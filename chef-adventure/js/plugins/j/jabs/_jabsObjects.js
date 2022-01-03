/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various game object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites/additions to the objects that
 * would otherwise be found in the rmmz_objects.js, such as Game_Map.
 * ============================================================================
 */

//#region Game_Actor
Game_Actor.JABS_MAINHAND = "Main";
Game_Actor.JABS_OFFHAND = "Off";
Game_Actor.JABS_TOOLSKILL = "Tool";
Game_Actor.JABS_DODGESKILL = "Dodge";
Game_Actor.JABS_L1_A_SKILL = "L1 + A";
Game_Actor.JABS_L1_B_SKILL = "L1 + B";
Game_Actor.JABS_L1_X_SKILL = "L1 + X";
Game_Actor.JABS_L1_Y_SKILL = "L1 + Y";
Game_Actor.JABS_R1_A_SKILL = "R1 + A";
Game_Actor.JABS_R1_B_SKILL = "R1 + B";
Game_Actor.JABS_R1_X_SKILL = "R1 + X";
Game_Actor.JABS_R1_Y_SKILL = "R1 + Y";

/**
 * Adds in the jabs tracking object for equipped skills.
 */
J.ABS.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_Actor.initMembers.call(this);
  this._j = this._j || {};
  /**
   * All equipped skills on this actor.
   * @type {JABS_SkillSlotManager}
   */
  this._j._equippedSkills = this._j._equippedSkills || new JABS_SkillSlotManager();

  /**
   * The total speed boosts currently applied to this actor.
   * @type {number}
   */
  this._j._speedBoosts = 0;

  /**
   * The number of bonus hits this actor currently has.
   * @type {number}
   */
  this._j._bonusHits = 0;

  /**
   * Whether or not the death effect has been performed.
   * The death effect is defined as "death animation".
   * @type {boolean}
   */
  this._j._deathEffect = false;
};

/**
 * Extends `.setup()` and initializes the jabs equipped skills.
 */
J.ABS.Aliased.Game_Actor.setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId)
{
  J.ABS.Aliased.Game_Actor.setup.call(this, actorId);
  this.initAbsSkills();
  this.refreshSpeedBoosts();
  this.refreshBonusHits();
};

/**
 * Gets the battler id of this actor from the database.
 * @returns {number}
 */
Game_Actor.prototype.battlerId = function()
{
  return this.actorId();
};

/**
 * The team id of this actor.
 * Defaults to the default ally team id.
 * @returns {number}
 */
Game_Actor.prototype.teamId = function()
{
  let val = JABS_Battler.allyTeamId();

  const referenceData = this.actor();
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
J.ABS.Aliased.Game_Actor.performMapDamage = Game_Actor.prototype.performMapDamage;
Game_Actor.prototype.performMapDamage = function()
{
  if (!$gameBattleMap.absEnabled)
  {
    J.ABS.Aliased.Game_Actor.performMapDamage.call(this);
  }
  else
  {
    $gameScreen.startFlashForDamage();
  }
};

/**
 * Disable built-in on-turn-end effects while JABS is active.
 * (built-in effects include regeneration and poison, but those are
 * already handled elsewhere in the engine)
 */
J.ABS.Aliased.Game_Actor.turnEndOnMap = Game_Actor.prototype.turnEndOnMap;
Game_Actor.prototype.turnEndOnMap = function()
{
  if (!$gameBattleMap.absEnabled)
  {
    J.ABS.Aliased.Game_Actor.turnEndOnMap.call(this);
  }
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
 * Gets whether or not this actor needs a death effect.
 * @returns {boolean}
 */
Game_Actor.prototype.needsDeathEffect = function()
{
  return this._j._deathEffect;
};

/**
 * Toggles this actor's need for a death effect.
 */
Game_Actor.prototype.toggleDeathEffect = function()
{
  this._j._deathEffect = !this._j._deathEffect;
};

J.ABS.Aliased.Game_Actor.die = Game_Actor.prototype.die;
Game_Actor.prototype.die = function()
{
  J.ABS.Aliased.Game_Actor.die.call(this);
  this.toggleDeathEffect();
};

/**
 * Handles on-revive effects at the actor-level.
 */
J.ABS.Aliased.Game_Actor.revive = Game_Actor.prototype.revive;
Game_Actor.prototype.revive = function()
{
  J.ABS.Aliased.Game_Actor.revive.call(this);
  const jabsBattler = $gameMap.getBattlerByUuid(this.getUuid());
  if (jabsBattler)
  {
    jabsBattler.setDying(false);
  }
};

/**
 * Initializes the jabs equipped skills based on equipment.
 */
Game_Actor.prototype.initAbsSkills = function()
{
  this.updateEquipmentSkills();
};

/**
 * Retrieves all skills that are currently equipped on this actor.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllEquippedSkills = function()
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

      const skillData = $dataSkills[skillSlot.id];
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
Game_Actor.prototype.findSlotForSkillId = function(skillIdToFind)
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
  this._j._equippedSkills.setSlot(slot, skillId, locked);
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
 * Updates the latest equipped mainhand/offhand skill slots with whatever the
 * currently equipped gear provides.
 */
Game_Actor.prototype.updateEquipmentSkills = function()
{
  this.releaseUnequippableSkills();

  const mainhandSkill = this.getMainhandSkill();
  const offhandSkill = this.getOffhandSkill();

  this.setEquippedSkill(Game_Actor.JABS_MAINHAND, mainhandSkill);
  this.setEquippedSkill(Game_Actor.JABS_OFFHAND, offhandSkill);
};

/**
 * Gets the mainhand skill for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getMainhandSkill = function()
{
  const equips = this.equips();
  let mainhandSkill = 0;
  if (equips[0])
  {
    mainhandSkill = parseInt(equips[0]._j.skillId);
  }

  return mainhandSkill
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
  const offhandOverride = this.offhandSkillOverride();
  if (offhandOverride)
  {
    return offhandOverride;
  }

  const equips = this.equips();
  let offhandSkill = 0;
  if (equips[1])
  {
    offhandSkill = parseInt(equips[1]._j.skillId);
  }

  return offhandSkill;
};

Game_Actor.prototype.offhandSkillOverride = function()
{
  let overrideSkillId = 0;
  let objectsToCheck = [...this.states()];
  const weapon = this.equips()[0];
  if (weapon)
  {
    objectsToCheck.unshift(weapon);
  }

  const structure = /<offhandSkill:(\d+)>/i;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        overrideSkillId = parseInt(RegExp.$1);
      }
    });
  });

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
 * Refreshes equipment-based skills every time the actor refreshes.
 */
J.ABS.Aliased.Game_Actor.refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function()
{
  J.ABS.Aliased.Game_Actor.refresh.call(this);
  this.updateEquipmentSkills();
  this.refreshSpeedBoosts();
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
 * Executes the JABS level up process if the leader is the one leveling up.
 */
J.ABS.Aliased.Game_Actor.levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function()
{
  J.ABS.Aliased.Game_Actor.levelUp.call(this);
  $gameBattleMap.requestSpriteRefresh = true;
  $gameBattleMap.battlerLevelup(this.getUuid());
};

/**
 * Extends the level down function to refresh sprites' danger indicator.
 */
J.ABS.Aliased.Game_Actor.levelDown = Game_Actor.prototype.levelDown;
Game_Actor.prototype.levelDown = function()
{
  J.ABS.Aliased.Game_Actor.levelDown.call(this);
  const isLeader = $gameParty.leader() === this;
  if (isLeader)
  {
    $gameBattleMap.requestSpriteRefresh = true;
  }
};

/**
 * When a new skill is learned, if it is for the leader then show it.
 */
J.ABS.Aliased.Game_Actor.learnSkill = Game_Actor.prototype.learnSkill;
Game_Actor.prototype.learnSkill = function(skillId)
{
  if (!this.isLearnedSkill(skillId))
  {
    const skill = $dataSkills[skillId];
    if (skill)
    {
      $gameBattleMap.battlerSkillLearn(skill, this.getUuid());
      this.upgradeSkillIfUpgraded(skillId);
      this.autoAssignSkillsIfRequired(skillId);
    }
  }

  J.ABS.Aliased.Game_Actor.learnSkill.call(this, skillId);
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
    const skillData = $dataSkills[skillSlot.id];
    const upgradeSkillId = parseInt(skillData.meta["Hide if learned Skill"]);
    if (upgradeSkillId === skillId)
    {
      this.setEquippedSkill(skillSlot.key, skillId);
    }
  });
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
  const equips = this.equips();
  let speedBoosts = 0;

  equips.forEach(equip =>
  {
    if (!equip) return;
    speedBoosts += equip._j.speedBoost;
  });

  this._j._speedBoosts = speedBoosts;
};

/**
 * Gets the current speed boost scale for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getSpeedBoosts = function()
{
  return this._j._speedBoosts;
};

/**
 * Updates the bonus hit count for this actor based on equipment.
 */
Game_Actor.prototype.refreshBonusHits = function()
{
  const equips = this.equips(); // while equipped
  const states = this.states(); // temporary states
  const skills = this.skills(); // passive skills
  let bonusHits = 0;

  const reducer = (previousValue, currentValue) => previousValue + currentValue.value;
  const isHitsTrait = trait => trait.code === J.BASE.Traits.ATTACK_REPEATS;
  equips.forEach(equip =>
  {
    if (!equip) return;
    bonusHits += equip._j.bonusHits;
    bonusHits += equip.traits.filter(isHitsTrait)
      .reduce(reducer, 0);
  });

  states.forEach(state =>
  {
    bonusHits += state._j.bonusHits;
    bonusHits += state.traits.filter(isHitsTrait)
      .reduce(reducer, 0);
  });

  skills.forEach(skill =>
  {
    bonusHits += skill._j.getBonusHits();
  });

  this._j._bonusHits = bonusHits;
};

/**
 * Gets the current number of bonus hits for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getBonusHits = function()
{
  return this._j._bonusHits;
};

/**
 * Determines the various state duration boosts available to this actor.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Battler} attacker The attacker- for use with formulai.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationBoost = function(baseDuration, attacker)
{
  let flatDurationBoost = 0;
  let multiplierDurationBoost = 0;
  let formulaDurationBoost = 0;
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj =>
  {
    flatDurationBoost += this.getStateDurationFlatPlus(obj);
    multiplierDurationBoost += this.getStateDurationPercPlus(obj, baseDuration);
    formulaDurationBoost += this.getStateDurationFormulaPlus(obj, baseDuration, attacker);
  });

  return Math.round(flatDurationBoost + multiplierDurationBoost + formulaDurationBoost);
};

/**
 * Gets the combined amount of flat state duration boosts from all sources.
 * @param {rm.types.BaseItem} noteObject object to inspect the notes of.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFlatPlus = function(noteObject)
{
  const structure = /<stateDurationFlat:[ ]?([\-+]?\d+)>/i;
  const notedata = noteObject.note.split(/[\r\n]+/);
  let flatDurationBoost = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      flatDurationBoost += parseInt(RegExp.$1);
    }
  });

  return flatDurationBoost;
};

/**
 * Gets the combined amount of percent-based state duration boosts from all sources.
 * @param {rm.types.BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationPercPlus = function(noteObject, baseDuration)
{
  const structure = /<stateDurationPerc:[ ]?([\-+]?\d+)>/i;
  const notedata = noteObject.note.split(/[\r\n]+/);
  let percDurationBoost = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      percDurationBoost += parseInt(RegExp.$1);
    }
  });

  return Math.round(baseDuration * (percDurationBoost / 100));
};

/**
 * Gets the combined amount of formula-based state duration boosts from all sources.
 * @param {rm.types.BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @param attacker
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFormulaPlus = function(noteObject, baseDuration, attacker)
{
  const a = this;  // the one who applied the state.
  const b = attacker; // this battler, afflicted by the state.
  const v = $gameVariables._data; // access to variables if you need it.
  const d = baseDuration;
  const structure = /<(?:stateDurationFormula|stateDurationForm):[ ]?\[([+\-*\/ ().\w]+)]>/i;
  const notedata = noteObject.note.split(/[\r\n]+/);
  let formulaDurationBoost = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      formulaDurationBoost += eval(RegExp.$1) ?? 0;
    }
  });

  return Math.round(formulaDurationBoost);
};

/**
 * A multiplier against the vision of an enemy target.
 * This may increase/decrease the sight and pursuit range of an enemy attempting to
 * perceive the actor.
 * @returns {number}
 */
Game_Actor.prototype.getVisionModifier = function()
{
  let visionMultiplier = 100;
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj => (visionMultiplier += this.extractVisionModifiers(obj)));

  return Math.max((visionMultiplier / 100), 0);
};

/**
 * Gets all modifiers related to vision from this database object.
 * @param referenceData
 * @returns {number}
 */
Game_Actor.prototype.extractVisionModifiers = function(referenceData)
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

  const player = $gameBattleMap.getPlayerMapBattler();
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
  const player = $gameBattleMap.getPlayerMapBattler();
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
  if ($gameBattleMap._absEnabled)
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
  this.subject()
    .clearResult();
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
    this.item()
      .effects
      .forEach(effect => this.applyItemEffect(target, effect));
    this.applyItemUserEffect(target);
  }
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
 * OVERWRITE Rewrites the handling for state application. The attacker is
 * now relevant to the state being applied.
 * @param {number} stateId The state id to potentially apply.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId, attacker)
{
  if (!attacker || !$gameBattleMap._absEnabled)
  {
    J.ABS.Aliased.Game_Battler.addState.call(this, stateId);
    return;
  }

  if (this.isStateAddable(stateId))
  {
    if (!this.isStateAffected(stateId))
    {
      this.addNewState(stateId, attacker);
      this.refresh();
    }

    this.resetStateCounts(stateId, attacker);
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
  J.ABS.Aliased.Game_Battler.addNewState.call(this, stateId);
  this.addJabsState(stateId, attacker);
};

/**
 * Refreshes the battler's state that is being re-applied.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
Game_Battler.prototype.resetStateCounts = function(stateId, attacker)
{
  Game_BattlerBase.prototype.resetStateCounts.call(this, stateId);
  this.addJabsState(stateId, attacker);
};

/**
 *
 * @param {number} stateId
 */
J.ABS.Aliased.Game_Battler.removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId)
{
  J.ABS.Aliased.Game_Battler.removeState.call(this, stateId);
  const stateTracker = $gameBattleMap.findStateTrackerByBattlerAndState(this, stateId);
  if (stateTracker)
  {
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
  const state = $dataStates[stateId];
  let duration = state.stepsToRemove;
  if (this.isActor() && !state._j.negative)
  {
    // extend our incoming positive states!
    duration += this.getStateDurationBoost(duration, attacker);
  }
  else if (this.isEnemy() && attacker && attacker.isActor() && state._j.negative)
  {
    // extend our outgoing negative states!
    duration += attacker.getStateDurationBoost(duration, this);
  }

  const stateTracker = new JABS_TrackedState({
    battler: this,
    stateId: stateId,
    iconIndex: state.iconIndex,
    duration: duration,
    source: attacker
  });
  $gameBattleMap.addStateTracker(stateTracker);
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
      powerLevel += parseFloat(this.param(counter));
    }

    if (xparams.includes(counter))
    {
      powerLevel += parseFloat(this.xparam(counter - 8) * 100);
    }

    if (sparams.includes(counter))
    {
      powerLevel += parseFloat(this.sparam(counter - 18) * 100 - 100);
    }

    counter++;
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
 * Gets the current speed boost scale for this actor.
 * At the Game_Battler level will always return 0.
 * @returns {number}
 */
Game_Battler.prototype.getSpeedBoosts = function()
{
  return 0;
};

/**
 * Retrieves all skills that are currently equipped on this actor.
 * At the Game_Battler level will always return an empty object.
 * @returns {object}
 */
Game_Battler.prototype.getAllEquippedSkills = function()
{
  return [];
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

};

/**
 * Checks all states to see if we have anything that grants parry ignore.
 * @returns {boolean}
 */
Game_Battler.prototype.ignoreAllParry = function()
{
  let ignore = false;
  const objectsToCheck = this.states();
  if (J.PASSIVE)
  {
    objectsToCheck.push(...this.passiveSkillStates());
  }

  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    const structure = /<ignoreParry>/i;
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        ignore = true;
      }
    });
  });

  return ignore;
};
//#endregion Game_Battler

//#region Game_BattleMap
/**
 * This class handles how non-player `JABS_Battler`s interact with others.
 */
class Game_BattleMap
{
  /**
   * @constructor
   */
  constructor()
  {
    this.initialize();
  };

  //#region getters/setters of the battle map
  /**
   * Retrieves whether or not the ABS is currently enabled.
   * @returns {boolean} True if enabled, false otherwise.
   */
  get absEnabled()
  {
    return this._absEnabled;
  };

  /**
   * Sets the ABS enabled switch to a new boolean value.
   * @param {boolean} enabled Whether or not the ABS is enabled (default = true).
   */
  set absEnabled(enabled)
  {
    this._absEnabled = enabled;
  };

  /**
   * Retrieves whether or not the ABS is currently paused.
   * @returns {boolean} True if paused, false otherwise.
   */
  get absPause()
  {
    return this._absPause;
  };

  /**
   * Sets the ABS pause switch to a new boolean value.
   * @param {boolean} paused Whether or not the ABS is paused (default = true).
   */
  set absPause(paused)
  {
    this._absPause = paused;
  }

  /**
   * Checks whether or not we have a need to request the ABS-specific menu.
   * @returns {boolean} True if menu requested, false otherwise.
   */
  get requestAbsMenu()
  {
    return this._requestAbsMenu;
  };

  /**
   * Sets the current request for calling the ABS-specific menu.
   * @param {boolean} requested Whether or not we want to request the menu (default: true).
   */
  set requestAbsMenu(requested)
  {
    this._requestAbsMenu = requested;
  };

  /**
   * Gets whether or not there is a request to cycle through party members.
   * @returns {boolean}
   */
  get requestPartyRotation()
  {
    return this._requestPartyRotation;
  };

  /**
   * Sets the request for party rotation.
   * @param {boolean} rotate True if we want to rotate party members, false otherwise.
   */
  set requestPartyRotation(rotate)
  {
    this._requestPartyRotation = rotate;
  };

  /**
   * Gets whether or not there is a request to refresh the JABS menu.
   * The most common use case for this is adding new commands to the menu.
   * @returns {boolean}
   */
  get requestJabsMenuRefresh()
  {
    return this._requestJabsMenuRefresh;
  };

  /**
   * Sets the request for refreshing the JABS menu.
   * @param {boolean} requested True if we want to refresh the JABS menu, false otherwise.
   */
  set requestJabsMenuRefresh(requested)
  {
    this._requestJabsMenuRefresh = requested;
  };

  /**
   * Checks whether or not we have a need to request rendering for new actions.
   * @returns {boolean} True if needing to render actions, false otherwise.
   */
  get requestActionRendering()
  {
    return this._requestActionRendering;
  };

  /**
   * Issues a request to render actions on the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestActionRendering(request)
  {
    this._requestActionRendering = request;
  };

  /**
   * Checks whether or not we have a need to request rendering for new loot sprites.
   * @returns {boolean} True if needing to render loot, false otherwise.
   */
  get requestLootRendering()
  {
    return this._requestLootRendering;
  };

  /**
   * Issues a request to render loot onto the map.
   * @param {boolean} request Whether or not we want to render actions (default = true).
   */
  set requestLootRendering(request)
  {
    this._requestLootRendering = request;
  };

  /**
   * Checks whether or not we have a need to request a clearing of the action sprites
   * on the current map.
   * @returns {boolean} True if clear map requested, false otherwise.
   */
  get requestClearMap()
  {
    return this._requestClearMap;
  };

  /**
   * Issues a request to clear the map of all stale actions.
   * @param {boolean} request Whether or not we want to clear the battle map (default = true).
   */
  set requestClearMap(request)
  {
    this._requestClearMap = request;
  };

  /**
   * Checks whether or not we have a need to request a clearing of the loot sprites
   * on the current map.
   * @returns {boolean} True if clear loot requested, false otherwise.
   */
  get requestClearLoot()
  {
    return this._requestClearLoot;
  }

  /**
   * Issues a request to clear the map of any collected loot.
   * @param {boolean} request True if clear loot requested, false otherwise.
   */
  set requestClearLoot(request)
  {
    this._requestClearLoot = request;
  };

  /**
   * Checks whether or not we have a need to refresh all character sprites on the current map.
   * @returns {boolean} True if refresh is requested, false otherwise.
   */
  get requestSpriteRefresh()
  {
    return this._requestSpriteRefresh;
  };

  /**
   * Issues a request to refresh all character sprites on the current map.
   * @param {boolean} request True if we want to refresh all sprites, false otherwise.
   */
  set requestSpriteRefresh(request)
  {
    this._requestSpriteRefresh = request;
  };

  /**
   * Creates all members available in this class.
   */
  initialize(isMapTransfer = true)
  {
    /**
     * The `JABS_Battler` representing the player.
     * @type {JABS_Battler}
     */
    this._playerBattler = null;

    /**
     * True if we want to review available events for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestActionRendering = false;

    /**
     * True if we want to review available loot for rendering, false otherwise.
     * @type {boolean}
     */
    this._requestLootRendering = false;

    /**
     * True if we want to cycle through our party members, false otherwise.
     * @type {boolean}
     */
    this._requestPartyRotation = false;

    /**
     * True if we want to render additional sprites to the screen, false otherwise.
     * @type {boolean}
     */
    this._requestRendering = false;

    /**
     * True if we want to empty the map of all action sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearMap = false;

    /**
     * True if we want to empty the map of all stale loot sprites, false otherwise.
     * @type {boolean}
     */
    this._requestClearLoot = false;

    /**
     * True if we want to refresh all sprites and their add-ons, false otherwise.
     * @type {boolean}
     */
    this._requestSpriteRefresh = false;

    /**
     * A collection to manage all `JABS_Action`s on this battle map.
     * @type {JABS_Action[]}
     */
    this._actionEvents = [];

    /**
     * A collection of the metadata of all action-type events.
     * @type {rm.types.Event[]}
     */
    this._activeActions = isMapTransfer ? [] : this._activeActions ?? [];

    /**
     * True if we want to call the ABS-specific menu, false otherwise.
     * @type {boolean}
     */
    this._requestAbsMenu = false;

    /**
     * True if we want to refresh the commands of the JABS menu, false otherwise.
     * @type {boolean}
     */
    this._requestJabsMenuRefresh = false;

    /**
     * Whether or not this ABS is enabled.
     * If disabled, button input and enemy AI will be disabled.
     * Enemy battlers on the map will instead act like their
     * regularly programmed events.
     *
     * This will most likely be used for when the dev enters a town and the
     * populace is peaceful.
     * @type {boolean}
     */
    this._absEnabled = true;

    /**
     * Whether or not this ABS is temporarily paused.
     * If paused, all battlers on the map including the player will halt
     * movement, though timers will still tick.
     * @type {boolean}
     */
    this._absPause = false;

    /**
     * A collection of all ongoing states.
     * @type {JABS_TrackedState[]}
     */
    this._stateTracker = this._stateTracker || [];
    this.initializePlayerBattler();
  };

  /**
   * Adds a new `JABS_Action` to this battle map for tracking.
   * @param {JABS_Action} actionEvent The `JABS_Action` to add.
   * @param {rm.types.Event} actionEventData The event metadata, if anything.
   */
  addActionEvent(actionEvent, actionEventData)
  {
    this._actionEvents.push(actionEvent);
    if (actionEventData)
    {
      this._activeActions.push(actionEventData);
    }
  };

  /**
   * Finds the event metadata associated with the given `uuid`.
   * @param {string} uuid The `uuid` to find.
   * @returns {rm.types.Event} The event associated with the `uuid`.
   */
  event(uuid)
  {
    const results = this._activeActions.filter(eventData => eventData.uniqueId === uuid);
    return results[0];
  };

  loot(uuid)
  {

  };

  /**
   * Removes the temporary metadata from our store.
   * @param {JABS_Action} actionEvent The action event data.
   */
  removeActionEvent(actionEvent)
  {
    // find all the actions that are the same as this one.
    const sameAction = this._actionEvents
      .filter(action => action.getUuid() === actionEvent.getUuid());
    if (!sameAction || !sameAction.length)
    {
      // if for some reason we don't have any matching actions, then we're done.
      return;
    }

    const uniqueId = sameAction[0].getUuid();

    // filter out all those same actions.
    const updatedActiveActions = this.
      _activeActions
      .filter(active => !(active.uniqueId === uniqueId));
    this._activeActions = updatedActiveActions;
  };

  /**
   * Clears all currently managed `JABS_Action`s on this battle map that are marked
   * for removal.
   */
  clearActionEvents()
  {
    const actionEvents = this._actionEvents;
    const updatedActionEvents = actionEvents.filter(action => !action.getNeedsRemoval());

    if (actionEvents.length !== updatedActionEvents.length)
    {
      this.requestClearMap = true;
    }

    this._actionEvents = updatedActionEvents;
  };

  /**
   * Checks for how many living enemies there are present on the map.
   * "Enemies" is defined as "number of `Game_Battler`s that are `Game_Enemy`s".
   * @returns {boolean} True if there are any living enemies on this map, false otherwise.
   */
  anyLivingEnemies()
  {
    const anyEnemies = $gameMap
      .getBattlers()
      .find(battler => battler.isEnemy() && !battler.isInanimate());
    return !!anyEnemies;
  };

  /**
   * Whether or not the player is ready to attack using the mainhand skill slot.
   * @returns {boolean} True if the mainhand skill is off cooldown, false otherwise.
   */
  isMainhandActionReady()
  {
    const player = this.getPlayerMapBattler();
    return player.isSkillTypeCooldownReady(Game_Actor.JABS_MAINHAND);
  };

  /**
   * Whether or not the player is ready to attack using the offhand skill slot.
   * @returns {boolean} True if the offhand skill is off cooldown, false otherwise.
   */
  isOffhandActionReady()
  {
    const player = this.getPlayerMapBattler();
    return player.isSkillTypeCooldownReady(Game_Actor.JABS_OFFHAND);
  };

  /**
   * Retrieves the `JABS_Action` associated with the skill type.
   * If the skill is not off cooldown or simply unassigned, return `null`.
   * @param {JABS_Battler} battler The battler executing the action.
   * @param {string} skillType The slot this skill is associated with.
   * @returns {JABS_Action[]}
   */
  getSkillActionData(battler, skillType)
  {
    if (!battler.isSkillTypeCooldownReady(skillType)) return null;

    const mapActions = battler.getAttackData(skillType);
    if (!mapActions || !mapActions.length) return null;

    mapActions.forEach(action => action.setCooldownType(skillType))
    return mapActions;
  };

  /**
   * Determines the animation id for this particular attack.
   * -1 as an animation id represents "use normal attack", but enemies don't have that!
   * So for the case of enemies, it'll instead return the default.
   * @param {object} skill The $dataSkills object for this skill.
   * @param {JABS_Battler} caster The caster of this skill.
   */
  getAnimationId(skill, caster)
  {
    let animationId = skill.animationId;
    if (animationId === -1)
    {
      if (caster.isEnemy())
      {
        animationId = J.ABS.DefaultValues.AttackAnimationId;
      }
      else
      {
        const weapons = caster.getBattler()
          .weapons();
        if (weapons.length > 0)
        {
          animationId = weapons[0].animationId;
        }
        else
        {
          animationId = J.ABS.DefaultValues.AttackAnimationId;
        }
      }
    }

    return animationId;
  };

  /**
   * Returns the `JABS_Battler` associated with the player.
   * @returns {JABS_Battler} The battler associated with the player.
   */
  getPlayerMapBattler()
  {
    return this._playerBattler;
  };

  //#endregion getters/setters of the battle map

  /**
   * Initializes the player properties associated with this battle map.
   */
  initializePlayerBattler()
  {
    if (this._playerBattler == null || !this._playerBattler.getBattlerId())
    {
      this._playerBattler = JABS_Battler.createPlayer();
      const uuid = this._playerBattler.getUuid();
      $gamePlayer.setMapBattler(uuid);
    }
  };

  /**
   * Updates all the battlers on the current map.
   * Also, this includes managing player input and updating active `JABS_Action`s.
   */
  update()
  {
    this.updatePlayerBattler();
    this.updateNonPlayerBattlers();
    this.updateActions();
    this.updateStates();
  };

  /**
   * Cycles through and updates all things related to the player.
   */
  updatePlayerBattler()
  {
    const player = this.getPlayerMapBattler();
    if (player === null) return;
    if (player.getBattler()
      .isDead())
    {
      this.handleDefeatedPlayer();
      return;
    }

    this.handleInput();
    player.update();
  };

  //#region Player input and handling
  /**
   * Handles the player input if the menu isn't requested.
   */
  handleInput()
  {
    if (this.requestAbsMenu || this.absPause)
    {
      return;
    }
    else
    {
      this.handleAbsInput();
    }
  };

  /**
   * Handles the player input and executes actions on the map.
   */
  handleAbsInput()
  {
    // don't swing all willy nilly while events are executing.
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) return;

    // pull up the jabs quick menu.
    if (Input.isTriggered(J.ABS.Input.Start) || Input.isTriggered("escape"))
    {
      this.performMenuAction();
    }

    // don't allow for other inputs if the abs is disabled.
    if (!this.absEnabled) return;

    const battler = this.getPlayerMapBattler();

    // if the player is casting, then countdown and wait for it to finish before
    // accepting additional input.
    if (battler.isCasting())
    {
      battler.countdownCastTime();
      return;
    }

    // if skills are queued, execute them.
    if (battler.isActionDecided() && !battler.isCasting())
    {
      this.executeMapActions(battler, battler.getDecidedAction());
      battler.clearDecidedAction();
      return;
    }

    // strafing can be done concurrently to other actions.
    if (Input.isPressed(J.ABS.Input.L2))
    {
      this.performStrafe(true);
    }
    else
    {
      this.performStrafe(false);
    }

    // dodge roll
    if (Input.isTriggered(J.ABS.Input.R2))
    {
      this.performDodgeRoll();
      return;
    }

    // track for L1 + ABXY
    if (Input.isPressed(J.ABS.Input.L1))
    {
      if (Input.isTriggered(J.ABS.Input.A))
      {
        this.performSkillAction(1);
      }
      else if (Input.isTriggered(J.ABS.Input.B))
      {
        this.performSkillAction(2);
      }
      else if (Input.isTriggered(J.ABS.Input.X))
      {
        this.performSkillAction(3);
      }
      else if (Input.isTriggered(J.ABS.Input.Y))
      {
        this.performSkillAction(4);
      }

      return;
    }

    // track for R1 + ABXY
    if (Input.isPressed(J.ABS.Input.R1))
    {
      if (Input.isTriggered(J.ABS.Input.A))
      {
        this.performSkillAction(5);
      }
      else if (Input.isTriggered(J.ABS.Input.B))
      {
        this.performSkillAction(6);
      }
      else if (Input.isTriggered(J.ABS.Input.X))
      {
        this.performSkillAction(7);
      }
      else if (Input.isTriggered(J.ABS.Input.Y))
      {
        this.performSkillAction(8);
      }
      else
      {
        // if pressing R1, but not any keys, defend instead.
        this.performRotate(true);
      }

      return;
    }
    else
    {
      // not defending now.
      this.performRotate(false);
    }

    // track for keyboard-exclusive input for skills.
    if (Input.isTriggered("1"))
    {
      this.performSkillAction(1);
      return;
    }
    if (Input.isTriggered("2"))
    {
      this.performSkillAction(2);
      return;
    }

    if (Input.isTriggered("3"))
    {
      this.performSkillAction(3);
      return;
    }

    if (Input.isTriggered("4"))
    {
      this.performSkillAction(4);
      return;
    }

    if (Input.isTriggered("5"))
    {
      this.performSkillAction(5);
      return;
    }

    if (Input.isTriggered("6"))
    {
      this.performSkillAction(6);
      return;
    }

    if (Input.isTriggered("7"))
    {
      this.performSkillAction(7);
      return;
    }

    if (Input.isTriggered("8"))
    {
      this.performSkillAction(8);
      return;
    }

    // mainhand action
    if (Input.isTriggered(J.ABS.Input.A))
    {
      // if we are about to interact with an NPC, don't cut them down pls.
      if (this.isNonBattlerEventInFrontOfPlayer())
      {
        return;
      }

      this.performMainhandAction();
    }

    // combat offhand action
    // only able to perform this if the player doesn't have a guard skill in their offhand.
    if (!this.getPlayerMapBattler()
        .isGuardSkillByKey(Game_Actor.JABS_OFFHAND) &&
      (Input.isTriggered(J.ABS.Input.B) || Input.isTriggered("control")))
    {
      this.performOffhandAction();
    }

    // tool action
    if (Input.isTriggered(J.ABS.Input.Y))
    {
      this.performToolAction();
    }

    // party rotation
    if (Input.isTriggered(J.ABS.Input.Select))
    {
      this.rotatePartyMembers();
    }
  };

  /**
   * Handles event interaction for events in front of the player. If they exist,
   * and the player meets the criteria to interact with the event, then do so.
   * It also prevents the player from swinging their weapon willy nilly at NPCs.
   * @returns {boolean} True if there is an event infront of the player, false otherwise.
   */
  isNonBattlerEventInFrontOfPlayer()
  {
    const player = this.getPlayerMapBattler()
      .getCharacter();
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

  /**
   * Rotates the leader out to the back and pulls in the next-in-line.
   */
  rotatePartyMembers(force = false)
  {
    // if rotating is disabled, then skip- forced cycling bypasses this check.
    if (!$gameParty.canPartyCycle() && !force) return;

    // you can't rotate if there is no party to rotate through.
    if ($gameParty._actors.length === 1) return;

    this.performPartyCycling();
  };

  /**
   * Actually executes the party cycling and swaps to the next living member.
   */
  performPartyCycling()
  {
    // determine which battler in the party is the next living battler.
    const nextAllyIndex = $gameParty._actors.findIndex(this.canCycleToAlly);

    // can't cycle if there are no living/valid members.
    if (nextAllyIndex === -1)
    {
      console.warn('No members available to cycle to.');
      return;
    }

    // swap to the next party member in the sequence.
    $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextAllyIndex));
    $gamePlayer.refresh();
    $gamePlayer.requestAnimation(40, false);

    // recreate the JABS player battler and set it to the player character.
    this._playerBattler = JABS_Battler.createPlayer();
    const newPlayer = this.getPlayerMapBattler().getCharacter();
    newPlayer.setMapBattler(this._playerBattler.getUuid());

    // request the scene overlord to take notice and react accordingly (refresh hud etc).
    this.requestPartyRotation = true;

    // if the log is present, then do log things.
    if (J.LOG)
    {
      const log = new MapLogBuilder()
        .setupPartyCycle(this.getPlayerMapBattler().battlerName())
        .build();
      $gameTextLog.addLog(log);
    }

    // request a map-wide sprite refresh on cycling.
    this.requestSpriteRefresh = true;
  };

  /**
   * Determines whether or not this member can be party cycled to.
   * @param {number} actorId The id of the actor.
   * @param {number} partyIndex The index of the member in the party.
   * @returns
   */
  canCycleToAlly(actorId, partyIndex)
  {
    // ignore switching to self.
    if (partyIndex === 0)
    {
      return false;
    }

    // don't switch to a dead member.
    const actor = $gameActors.actor(actorId);
    if (actor.isDead())
    {
      return false;
    }

    // don't switch with a member that is locked.
    if (actor.switchLocked())
    {
      return false;
    }

    return true;
  };

  /**
   * Executes an action on the map based on the mainhand skill slot.
   */
  performMainhandAction()
  {
    const jabsBattler = this.getPlayerMapBattler();
    const canUseMainhand = this.isMainhandActionReady() && jabsBattler.canBattlerUseAttacks();

    if (!canUseMainhand) return;

    const actions = jabsBattler.getAttackData(Game_Actor.JABS_MAINHAND);
    if (!actions || !actions.length) return;

    actions.forEach(action => action.setCooldownType(Game_Actor.JABS_MAINHAND));
    this.executeMapActions(jabsBattler, actions);
  };

  /**
   * Executes an action on the map based on the offhand skill slot.
   */
  performOffhandAction()
  {
    const battler = this.getPlayerMapBattler();
    const canPerformOffhand = battler.hasOffhandSkill() &&
      this.isOffhandActionReady() &&
      battler.canBattlerUseAttacks();
    if (!canPerformOffhand) return;

    const actions = battler.getAttackData(Game_Actor.JABS_OFFHAND);
    if (!actions || !actions.length) return;

    actions.forEach(action => action.setCooldownType(Game_Actor.JABS_OFFHAND));
    this.executeMapActions(battler, actions);
  };

  /**
   * Begins the execution of a tool. Depending on the equipped tool,
   * this can perform a variety of types of actions.
   */
  performToolAction()
  {
    const battler = this.getPlayerMapBattler();
    const cooldownReady = battler.isSkillTypeCooldownReady(Game_Actor.JABS_TOOLSKILL);
    const toolId = battler.getBattler()
      .getEquippedSkill(Game_Actor.JABS_TOOLSKILL);
    if (cooldownReady && toolId)
    {
      battler.applyToolEffects(toolId);
    }
  };

  /**
   * Begins execution of a skill based on any of the L1/R1 + ABXY skill slots.
   * @param {number} inputCombo The input combination to execute a skill.
   */
  performSkillAction(inputCombo)
  {
    const battler = this.getPlayerMapBattler();
    if (!battler.canBattlerUseSkills())
    {
      SoundManager.playCancel();
      return;
    }

    let mapActions = [];

    switch (inputCombo)
    {
      case 1: // L1 + A
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_A_SKILL);
        break;
      case 2: // L1 + B
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_B_SKILL);
        break;
      case 3: // L1 + X
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_X_SKILL);
        break;
      case 4: // L1 + Y
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_L1_Y_SKILL);
        break;
      case 5: // R1 + A
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_A_SKILL);
        break;
      case 6: // R1 + B
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_B_SKILL);
        break;
      case 7: // R1 + X
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_X_SKILL);
        break;
      case 8: // R1 + Y
        mapActions = this.getSkillActionData(battler, Game_Actor.JABS_R1_Y_SKILL);
        break;
    }

    if (mapActions && mapActions.length)
    {
      battler.setDecidedAction(mapActions);
      const primaryMapAction = mapActions[0];
      battler.setCastCountdown(primaryMapAction.getCastTime());
    }
    else
    {
      // either no skill equipped in that slot, or its not off cooldown.
      SoundManager.playCancel();
    }
  };

  /**
   * Calls the Abs menu.
   */
  performMenuAction()
  {
    this.absPause = true;
    this.requestAbsMenu = true;
  };

  /**
   * Locks the player's facing direction while allowing movement.
   */
  performStrafe(strafing)
  {
    const player = this.getPlayerMapBattler()
      .getCharacter();
    player.setDirectionFix(strafing);
  };

  /**
   * Locks the player's movement so they may rotate in-place without movement.
   * If the player has a guard skill for their offhand, then also perform a guard.
   * @param {boolean} rotating True if the player is rotating, false otherwise.
   */
  performRotate(rotating)
  {
    const player = this.getPlayerMapBattler();
    player.setMovementLock(rotating);

    // if the player also has a guard skill equipped in their offhand, guard!
    if (player.isGuardSkillByKey(Game_Actor.JABS_OFFHAND))
    {
      player.executeGuard(rotating, Game_Actor.JABS_OFFHAND);
    }
  };

  /**
   * Executes the battler's dodge skill.
   */
  performDodgeRoll()
  {
    const player = this.getPlayerMapBattler();
    if (player.isSkillTypeCooldownReady(Game_Actor.JABS_DODGESKILL) && player.canBattlerMove())
    {
      player.tryDodgeSkill();
    }
  };

  /**
   * Cycles through and updates all things related to battlers other than the player.
   */
  updateNonPlayerBattlers()
  {
    const player = $gameBattleMap.getPlayerMapBattler();
    const visibleBattlers = $gameMap.getBattlersWithinRange(player, 30, false);

    visibleBattlers.forEach(this.performNonPlayerBattlerUpdate, this);
  };

  /**
   * Performs the update against this non-player battler.
   *
   * NOTE: The player's battler gets duplicated once into the "all battlers"
   * collection after the first party cycle. The initial check prevents updating
   * the player battler twice if they are in that collection.
   * @param {JABS_Battler} battler
   */
  performNonPlayerBattlerUpdate(battler)
  {
    if (battler === $gameBattleMap.getPlayerMapBattler()) return;

    battler.update();

    const isDead = battler.getBattler()
      .isDead();
    const isntStillDying = !battler.isDying();
    const isntErased = battler.isEnemy()
      ? !battler.getCharacter()._erased
      : true;
    if (isDead && isntStillDying && isntErased)
    {
      battler.setInvincible();
      this.handleDefeatedTarget(battler, this.getPlayerMapBattler());
    }
  };

  //#endregion player input and handling

  /**
   * Updates all `JABS_Action`s currently on the battle map. This includes checking for collision,
   * checking piercing information, and applying effects against the map.
   */
  updateActions()
  {
    const actionEvents = this._actionEvents;
    if (!actionEvents.length) return;

    actionEvents.forEach(action =>
    {
      // decrement the delay timer prior to action countdown.
      action.countdownDelay();

      // if we're still delaying and not triggering by touch...
      if (!action.triggerOnTouch() && !action.isDelayCompleted())
      {
        // then stop processing this action.
        return;
      }

      // if the delay is completed, decrement the action timer.
      if (action.isDelayCompleted())
      {
        action.countdownDuration();
      }

      // if the duration of the action expires, remove it.
      if (action.isActionExpired())
      {
        this.cleanupAction(action);
        return;
      }

      // if there are no more hits left on this action, remove it.
      const hits = action.getPiercingTimes();
      if (hits <= 0)
      {
        this.cleanupAction(action);
        return;
      }

      // if there is a delay between hits, count down on it.
      const delay = action.getPiercingDelay();
      if (delay > 0)
      {
        action.modPiercingDelay();
        return;
      }

      // determine targets that this action collided with.
      const targets = this.getCollisionTargets(action);
      if (targets.length > 0)
      {
        targets.forEach(target =>
        {
          this.applyPrimaryBattleEffects(action, target);
        });

        // if we were delaying, end the delay.
        action.endDelay();

        // if the target can pierce enemies, adjust those values.
        action.resetPiercingDelay();
        action.modPiercingTimes();
      }
    });
  };

  /**
   * Cleans up a `JABS_Action`.
   *
   * If the minimum duration has yet to pass, then don't dispose of the action yet.
   * @param {JABS_Action} action The action to be cleaned up.
   */
  cleanupAction(action)
  {
    if (action.getDuration() >= JABS_Action.getMinimumDuration())
    {
      action.preCleanupHook();
      action.setNeedsRemoval();
      //this.removeActionEvent(action);
      this.clearActionEvents();
    }
  };

  //#region state tracking
  /**
   * Updates all states for all battlers that are afflicted.
   */
  updateStates()
  {
    this._stateTracker.forEach(trackedState =>
    {
      trackedState.update();
    });
  };

  /**
   * Adds a state tracker to the collection.
   * @param {JABS_TrackedState} newTrackedState The state tracker to add.
   */
  addStateTracker(newTrackedState)
  {
    const index = this._stateTracker
      .findIndex(trackedState =>
        trackedState.battler === newTrackedState.battler &&
        trackedState.stateId === newTrackedState.stateId);

    // if there is already a tracked state for this battler and id, then refresh it instead.
    // this is where to change reapplication functionality.
    if (index > -1)
    {
      const data = this._stateTracker[index];
      data.duration = newTrackedState.duration;
      data.expired = false;
      return;
    }

    this._stateTracker.push(newTrackedState);
  };

  /**
   * Gets all tracked states that are active for a battler.
   * @param {Game_Battler} battler The battler to find tracked states for.
   * @returns {JABS_TrackedState[]}
   */
  getAllActiveStatesByBattler(battler)
  {
    return this
      .getStateTrackerByBattler(battler)
      .filter(trackedState => !trackedState.isExpired());
  };

  /**
   * Gets all tracked states for a given battler.
   * @param {Game_Battler} battler The battler to find tracked states for.
   * @returns {JABS_TrackedState[]}
   */
  getStateTrackerByBattler(battler)
  {
    return this._stateTracker.filter(trackedState => trackedState.battler === battler);
  };

  /**
   * Finds the tracked state associated with a specific battler and a state id.
   * @param {Game_Battler} battler The battler to find a state for.
   * @param {number} stateId The state id to find on the given battler.
   * @returns {JABS_TrackedState}
   */
  findStateTrackerByBattlerAndState(battler, stateId)
  {
    return this.getStateTrackerByBattler(battler)
      .find(trackedState =>
        trackedState.battler === battler &&
        trackedState.stateId === stateId);
  };

  //#endregion state tracking

  /**
   * Clears leader data from another battler by it's `uuid`.
   * @param {string} uuid The `uuid` of the battler to clear leader data for.
   */
  clearLeaderDataByUuid(uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      battler.clearLeaderData();
    }
  };

  /**
   * Gets all nearby battlers that have an ai trait of `follower`.
   * @param {JABS_Battler} leaderBattler The battler to get all nearby followers for.
   * @returns {JABS_Battler[]} All ai-traited `follower` battlers.
   */
  getNearbyFollowers(leaderBattler)
  {
    const range = leaderBattler.getSightRadius() + leaderBattler.getPursuitRadius();
    const nearbyBattlers = $gameMap.getBattlersWithinRange(leaderBattler, range);
    return nearbyBattlers.filter(battler =>
    {
      const ai = battler.getAiMode();
      const canLead = !battler.hasLeader() || (leaderBattler.getUuid() === battler.getLeader());
      return (ai.follower && !ai.leader && canLead);
    });
  };

  //#region action execution
  /**
   * Generates a new `JABS_Action` based on a skillId, and executes the skill.
   * This overrides the need for costs or cooldowns, and is intended to be
   * used from the map, within an event's custom move routes.
   * @param {JABS_Battler} battler The battler executing the skill.
   * @param {number} skillId The skill to be executed.
   * @param {boolean} isRetaliation Whether or not this skill is from a retaliation.
   * @param {number?} targetX The target's `x` coordinate, if applicable.
   * @param {number?} targetY The target's `y` coordinate, if applicable.
   */
  forceMapAction(battler, skillId, isRetaliation = false, targetX = null, targetY = null)
  {
    const actions = battler.createMapActionFromSkill(skillId, isRetaliation);

    // if no actions, then don't actually do anything.
    if (!actions || !actions.length) return;

    this.executeMapActions(battler, actions, targetX, targetY);
  };

  /**
   * Iterates over all actions provided and executes them.
   * @param {JABS_Battler} battler The battler executing the action.
   * @param {JABS_Action[]} actions All actions to perform.
   * @param {number|null} targetX The target's `x` coordinate, if applicable.
   * @param {number|null} targetY The target's `y` coordinate, if applicable.
   */
  executeMapActions(battler, actions, targetX = null, targetY = null)
  {
    // if no actions, then don't actually do anything.
    if (!actions) return;

    const primaryAction = actions[0];

    // retaliations do not follow normal skill execution behaviors.
    if (!primaryAction.isRetaliation())
    {
      this.paySkillCosts(battler, primaryAction);
      this.applyCooldownCounters(battler, primaryAction);
    }

    actions.forEach(action =>
    {
      this.executeMapAction(battler, action, targetX, targetY);
    });
  };

  /**
   * Executes the provided `JABS_Action`.
   * It generates a copy of an event from the "ActionMap" and fires it off
   * based on it's move route.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   * @param {number?} targetX The target's `x` coordinate, if applicable.
   * @param {number?} targetY The target's `y` coordinate, if applicable.
   */
  executeMapAction(caster, action, targetX, targetY)
  {
    const character = caster.getCharacter();
    const baseSkill = action.getBaseSkill();
    const casterAnimation = baseSkill._j.casterAnimation();
    const freeCombo = baseSkill._j.freeCombo();

    // if there is no connect requirement for combos, then allow checking for input.
    if (freeCombo)
    {
      this.checkComboSequence(caster, action)
    }

    // perform self-animation and pose.
    caster.performActionPose(baseSkill);
    if (casterAnimation)
    {
      character.requestAnimation(casterAnimation);
    }

    let actionEventData = null;

    // actually perform the event creation for spawning a new action on the map.
    if (!action.isDirectAction())
    {
      const eventId = action.getActionId();
      actionEventData = JsonEx.makeDeepCopy($actionMap.events[eventId]);
      actionEventData.x = targetX ?? caster.getX();
      actionEventData.y = targetY ?? caster.getY();
      actionEventData.isAction = true;
      actionEventData.id += 1000;
      actionEventData.uniqueId = action.getUuid();
      actionEventData.actionDeleted = false;
      this.addMapActionToMap(actionEventData, action);
    }

    this.addActionEvent(action, actionEventData);
  };

  /**
   * Determines the directions of all projectiles.
   * @param {number} facing The base direction the battler is facing.
   * @param {number} projectile The pattern/number of projectiles to generate directions for.
   * @returns {number[]} The collection of directions to fire projectiles off in.
   */
  determineActionDirections(facing, projectile)
  {
    const directions = [];
    switch (projectile)
    {
      case 1:
        directions.push(facing);
        break;
      case 2:
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 3:
        directions.push(facing);
        directions.push(this.rotate45degrees(facing, true));
        directions.push(this.rotate45degrees(facing, false));
        break;
      case 4:
        directions.push(facing);
        directions.push(this.rotate90degrees(facing, true));
        directions.push(this.rotate90degrees(facing, false));
        directions.push(this.rotate180degrees(facing));
        break;
      case 8:
        directions.push(
          1, 3, 7, 9,   // diagonal
          2, 4, 6, 8);  // cardinal
        break;
    }

    return directions;
  };

  /**
   * Rotates the direction provided 45 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate45degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 9 : 7;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 3 : 9;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 7 : 1;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 1 : 3;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 4 : 2;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 2 : 6;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 8 : 4;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 6 : 8;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  };

  /**
   * Rotates the direction provided 90 degrees.
   * @param {number} direction The base direction to rotate from.
   * @param {boolean} clockwise True if rotating clockwise, false otherwise.
   * @returns {number} The direction after rotation.
   */
  rotate90degrees(direction, clockwise)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = clockwise ? 6 : 4;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = clockwise ? 2 : 8;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = clockwise ? 8 : 2;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = clockwise ? 4 : 6;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = clockwise ? 7 : 3;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = clockwise ? 1 : 9;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = clockwise ? 9 : 1;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = clockwise ? 3 : 7;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  };

  /**
   * Rotates the direction provided 180 degrees.
   * @param {number} direction The base direction to rotate from.
   * @returns {number} The direction after rotation.
   */
  rotate180degrees(direction)
  {
    let newDirection = direction;
    switch (direction)
    {
      case J.ABS.Directions.UP:
        newDirection = 2;
        break;
      case J.ABS.Directions.RIGHT:
        newDirection = 4;
        break;
      case J.ABS.Directions.LEFT:
        newDirection = 6;
        break;
      case J.ABS.Directions.DOWN:
        newDirection = 8;
        break;
      case J.ABS.Directions.LOWERLEFT:
        newDirection = 9;
        break;
      case J.ABS.Directions.LOWERRIGHT:
        newDirection = 7;
        break;
      case J.ABS.Directions.UPPERLEFT:
        newDirection = 3;
        break;
      case J.ABS.Directions.UPPERRIGHT:
        newDirection = 1;
        break;
      default:
        console.warn('non-dir8 provided, no rotation performed.');
        break;
    }

    return newDirection;
  };

  /**
   * Applies the cooldowns to the battler.
   * @param {JABS_Battler} caster The `JABS_Battler` executing the `JABS_Action`.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyCooldownCounters(caster, action)
  {
    if (caster.isPlayer())
    {
      this.applyPlayerCooldowns(caster, action);
    }
    else
    {
      this.applyAiCooldowns(caster, action);
    }
  };

  /**
   * Applies cooldowns in regards to the player for the casted action.
   * @param {JABS_Battler} caster The player.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyPlayerCooldowns(caster, action)
  {
    const cooldownType = action.getCooldownType();
    const cooldownValue = action.getCooldown();
    const skill = action.getBaseSkill();

    // if the skill has a unique cooldown functionality,
    // then each slot will have an independent cooldown.
    if (skill._j.uniqueCooldown() || this.isBasicAttack(cooldownType))
    {
      // if the skill is unique, only apply the cooldown to the slot assigned.
      caster.setCooldownCounter(cooldownType, cooldownValue);
      return;
    }

    // if the skill is not unique, then the cooldown applies to all slots it is equipped to.
    const equippedSkills = caster.getBattler()
      .getAllEquippedSkills();
    equippedSkills.forEach(skillSlot =>
    {
      if (skillSlot.id === skill.id)
      {
        caster.setCooldownCounter(skillSlot.key, cooldownValue);
      }
    });
  };

  /**
   * Applies cooldowns in regards to an ai-controlled battler for the casted action.
   * @param {JABS_Battler} caster The ai-controlled battler, ally or enemy.
   * @param {JABS_Action} action The `JABS_Action` to execute.
   */
  applyAiCooldowns(caster, action)
  {
    const cooldownType = action.getCooldownType();
    const cooldownValue = action.getCooldown();
    const aiCooldownValue = action.getAiCooldown();
    caster.modCooldownCounter(cooldownType, cooldownValue);

    // if the caster is any AI-controlled battler, then also trigger the postaction cooldown.
    if (aiCooldownValue > -1)
    {
      caster.startPostActionCooldown(aiCooldownValue);
    }
    else
    {
      caster.startPostActionCooldown(cooldownValue);
    }
  };

  /**
   * Checks whether or not this skill is a basic attack.
   * @param {string} cooldownKey The cooldown key to check.
   * @returns {boolean} True if the skill is a basic attack, false otherwise.
   */
  isBasicAttack(cooldownKey)
  {
    const isMainHand = cooldownKey === Game_Actor.JABS_MAINHAND;
    const isOffHand = cooldownKey === Game_Actor.JABS_OFFHAND;
    return (isMainHand || isOffHand);
  };

  /**
   * Pays the costs for the skill (mp/tp default) if applicable.
   * @param {JABS_Battler} caster The battler casting the action.
   * @param {JABS_Action} action The action(skill) to pay the cost for.
   */
  paySkillCosts(caster, action)
  {
    const battler = caster.getBattler();
    const skill = action.getBaseSkill();
    battler.paySkillCost(skill);
  };

  /**
   * Creates a new `JABS_Action` and adds it to the map and tracking.
   * @param {rm.types.Event} actionEventData An object representing the data of a `Game_Event`.
   * @param {JABS_Action} action An object representing the data of a `Game_Event`.
   */
  addMapActionToMap(actionEventData, action)
  {
    // add the data to the $datamap.events.
    $dataMap.events[$dataMap.events.length] = actionEventData;
    const newIndex = $dataMap.events.length - 1;
    actionEventData.actionIndex = newIndex;

    // assign this so it exists, but isn't valid.
    actionEventData.lootIndex = 0;

    // create the event by hand with this new data
    const actionEventSprite = new Game_Event(
      J.ABS.DefaultValues.ActionMap,
      newIndex);

    // give it a name.
    const skillName = action.getBaseSkill().name;
    const casterName = action.getCaster().battlerName();
    actionEventSprite.__actionName = `_${casterName}-${skillName}`;

    // on rare occasions, the timing of adding an action to the map coincides
    // with the removal of the caster which breaks the ordering of the events.
    // the result will throw an error and break. This should catch that, and if
    // not, then the try-catch will.
    if (!actionEventData || !actionEventData.pages.length)
    {
      console.error("that rare error occurred!");
      return;
    }

    const pageIndex = actionEventSprite.findProperPageIndex();
    const {characterIndex, characterName} = actionEventData.pages[pageIndex].image;

    actionEventSprite.setActionSpriteNeedsAdding();
    actionEventSprite._eventId = actionEventData.id;
    actionEventSprite._characterName = characterName;
    actionEventSprite._characterIndex = characterIndex;
    const pageData = actionEventData.pages[pageIndex];
    actionEventSprite.setMoveFrequency(pageData.moveFrequency);
    actionEventSprite.setMoveRoute(pageData.moveRoute);
    actionEventSprite.setDirection(action.direction());
    actionEventSprite.setCustomDirection(action.direction());
    actionEventSprite.setCastedDirection($gamePlayer.direction());
    actionEventSprite.setMapActionData(action);

    // overwrites the "start" of the event for this event to be nothing.
    // this prevents the player from accidentally interacting with the
    // sword swing or whatever is generated by the action.
    actionEventSprite.start = () => false;

    action.setActionSprite(actionEventSprite);
    $gameMap.addEvent(actionEventSprite);
    this.requestActionRendering = true;
  };

  /**
   * Adds the loot to the map.
   * @param {number} targetX The `x` coordinate of the battler dropping the loot.
   * @param {number} targetY The `y` coordinate of the battler dropping the loot.
   * @param {object} item The loot's raw data object.
   */
  addLootDropToMap(targetX, targetY, item)
  {
    // clone the loot data from the action map event id of 1.
    const lootEventData = JsonEx.makeDeepCopy($actionMap.events[1]);
    lootEventData.x = targetX;
    lootEventData.y = targetY;

    // add the loot event to the datamap list of events.
    $dataMap.events[$dataMap.events.length] = lootEventData;
    const newIndex = $dataMap.events.length - 1;
    lootEventData.lootIndex = newIndex;

    // create the loot event by hand with this new data.
    const jabsLootData = new JABS_LootDrop(item);
    lootEventData.uuid = jabsLootData.uuid;
    console.log(lootEventData.uuid);

    // set the duration of this loot drop
    // if a custom time is available, then use that, otherwise use the default.
    jabsLootData.duration = item._j.expires || J.ABS.Metadata.DefaultLootExpiration;

    // generate a new event to visually represent the loot drop and flag it for adding.
    const eventId = $dataMap.events.length - 1;
    const lootEvent = new Game_Event($gameMap.mapId(), eventId);
    lootEvent.setLootData(jabsLootData);
    lootEvent.setLootNeedsAdding();

    // add loot event to map.
    this.requestLootRendering = true;
    $gameMap.addEvent(lootEvent);
  };

  /**
   * Applies an action against a designated target battler.
   *
   * This is the orchestration method that manages the execution of an action against
   * a given target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyPrimaryBattleEffects(action, target)
  {
    // execute the action against the target.
    this.executeSkillEffects(action, target);

    // apply effects that require landing a successful hit.
    this.applyOnHitEffects(action, target);

    // applies additional effects that come after the skill execution.
    this.continuedPrimaryBattleEffects(action, target);

    // run any additional functionality that we needed to run after a skill is executed.
    this.postPrimaryBattleEffects(action, target);
  };

  /**
   * Attempts to execute the skill effects of this action against the target.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   * @returns {Game_ActionResult}
   */
  executeSkillEffects(action, target)
  {
    // handle any pre-execution effects.
    this.preExecuteSkillEffects(action, target);

    // get whether or not this action was unparryable.
    const isUnparryable = (action.getBaseSkill()._j.ignoreParry() === -1);

    // check whether or not this action was parried.
    const caster = action.getCaster();
    const isParried = isUnparryable
      ? false // parry is cancelled because the skill ignores it.
      : this.checkParry(caster, target);

    // check if the action was parried instead.
    const targetBattler = target.getBattler();
    if (!isUnparryable && isParried)
    {
      // grab the result, clear it, and set the parry flag to true.
      const result = targetBattler.result();
      result.clear();
      result.parried = true;
    }

    // apply the action to the target.
    const gameAction = action.getAction();
    gameAction.apply(targetBattler);

    // handle any post-execution effects.
    this.postExecuteSkillEffects(action, target);
  };

  /**
   * Execute any pre-execution effects.
   * This occurs before the actual skill is applied against the target battler to get the
   * `Game_ActionResult` that is then used throughout the function.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  preExecuteSkillEffects(action, target)
  {
  };

  /**
   * Execute any post-execution effects.
   * This occurs after the actual skill is executed against the target battler.
   * @param {JABS_Action} action The action being executed.
   * @param {JABS_Battler} target The target to apply skill effects against.
   */
  postExecuteSkillEffects(action, target)
  {
    // apply aggro regardless of successful hit.
    this.applyAggroEffects(action, target);
  };

  /**
   * Applies all aggro effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyAggroEffects(action, target)
  {
    // grab the attacker.
    const attacker = action.getCaster();

    // don't aggro your allies against you! That's dumb.
    if (attacker.isSameTeam(target.getTeam())) return;

    // grab the result on the target, from the action executed.
    const result = target.getBattler().result();

    // the default/base aggro.
    let aggro = J.ABS.Metadata.BaseAggro;

    // hp damage counts for 1.
    if (result.hpDamage > 0)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroPerHp;
    }

    // mp damage counts for 2.
    if (result.mpDamage > 0)
    {
      aggro += result.mpDamage * J.ABS.Metadata.AggroPerMp;
    }

    // tp damage counts for 10.
    if (result.tpDamage > 0)
    {
      aggro += result.tpDamage * J.ABS.Metadata.AggroPerTp;
    }

    // if the attacker also healed from it, extra aggro for each point healed!
    if (result.drain)
    {
      aggro += result.hpDamage * J.ABS.Metadata.AggroDrain;
    }

    // if the attacker was parried, reduce aggro on this battler...
    if (result.parried)
    {
      aggro += J.ABS.Metadata.AggroParryFlatAmount;
      // ...and also increase the aggro of the attacking battler!
      attacker.addUpdateAggro(target.getUuid(), J.ABS.Metadata.AggroParryUserGain);
    }

    // apply any bonus aggro from the underlying skill.
    aggro += action.bonusAggro();

    // apply the aggro multiplier from the underlying skill.
    aggro *= action.aggroMultiplier();

    // apply any aggro amplification from states.
    const attackerStates = attacker.getBattler().states();
    if (attackerStates.length > 0)
    {
      attackerStates.forEach(state =>
      {
        if (state._j.aggroOutAmp >= 0)
        {
          aggro *= state._j.aggroOutAmp;
        }
      });
    }

    // apply any aggro reduction from states.
    const targetStates = target.getBattler().states();
    if (targetStates.length > 0)
    {
      targetStates.forEach(state =>
      {
        if (state._j.aggroInAmp >= 0)
        {
          aggro *= state._j.aggroInAmp;
        }
      });
    }

    // apply the TGR multiplier from the attacker.
    aggro *= attacker.getBattler().tgr;

    // the player can attack tremendously faster than the AI can...
    // ...so reduce the aggro dealt to compensate.
    if (attacker.isPlayer())
    {
      aggro *= J.ABS.Metadata.AggroPlayerReduction;
    }

    // apply the aggro to the target.
    target.addUpdateAggro(attacker.getUuid(), aggro);
  };

  /**
   * Applies on-hit effects against the target.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  applyOnHitEffects(action, target)
  {
    // if the result isn't a hit or a parry, then we don't process on-hit effects.
    const result = target.getBattler().result();
    if (!result.isHit() && !result.parried) return;

    // grab some shorthand variables for local use.
    const caster = action.getCaster();
    const targetCharacter = target.getCharacter();
    const skill = action.getBaseSkill();

    // get the animation id associated with this skill.
    const targetAnimationId = this.getAnimationId(skill, caster);

    // if the skill should animate on the target, then animate as normal.
    targetCharacter.requestAnimation(targetAnimationId, result.parried);

    // if there is a self-animation id, apply that to yourself for every hit.
    if (action.getJabsData().selfAnimationId())
    {
      const event = action.getActionSprite();
      const selfAnimationId = action.getJabsData().selfAnimationId();
      event.requestAnimation(selfAnimationId);
    }

    // if freecombo-ing, then we already checked for combo when executing the action.
    if (!skill._j.freeCombo())
    {
      this.checkComboSequence(caster, action);
    }

    this.checkKnockback(action, target);
    this.triggerAlert(caster, target);

    // if the attacker and the target are the same team, then don't set that as "last hit".
    if (!(caster.isSameTeam(target.getTeam())))
    {
      caster.setBattlerLastHit(target);
    }
  };

  /**
   * Forces the target hit to be knocked back.
   * @param {JABS_Action} action The action potentially knocking the target back.
   * @param {JABS_Battler} target The map battler to potentially knockback.
   */
  checkKnockback(action, target)
  {
    // don't knockback if already being knocked back.
    const targetSprite = target.getCharacter();
    if (targetSprite.isJumping()) return;

    // get the knockback resist for this target.
    const targetReferenceData = target.getReferenceData();
    const targetMeta = targetReferenceData.meta;
    let knockbackResist = 1.00;
    if (targetMeta && targetMeta[J.ABS.Notetags.KnockbackResist])
    {
      let metaResist = parseInt(targetMeta[J.ABS.Notetags.KnockbackResist]);
      knockbackResist = (100 - metaResist) / 100;
    }

    // don't even knock them up or around at all, they are immune to knockback.
    if (knockbackResist <= 0)
    {
      return;
    }

    // get the knockback value from the skill if applicable.
    const skill = action.getBaseSkill();
    let knockback = skill._j.knockback();
    if (knockback == null) return;
    knockback *= knockbackResist;

    // if the knockback is 0, just hop in place.
    if (knockback === 0)
    {
      targetSprite.jump(0, 0);
      return;
    }

    // calculate where the knockback would send the target.
    const actionSprite = action.getActionSprite();
    const knockbackDirection = actionSprite.direction();
    let xPlus = 0;
    let yPlus = 0;
    switch (knockbackDirection)
    {
      case J.ABS.Directions.UP:
        yPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.DOWN:
        yPlus += Math.ceil(knockback);
        break;
      case J.ABS.Directions.LEFT:
        xPlus -= Math.ceil(knockback);
        break;
      case J.ABS.Directions.RIGHT:
        xPlus += Math.ceil(knockback);
        break;
    }

    const maxX = targetSprite.x + xPlus;
    const maxY = targetSprite.y + yPlus;
    let realX = targetSprite.x;
    let realY = targetSprite.y;
    let canPass = true;

    // dynamically test each square to ensure you don't cross any unpassable tiles.
    while (canPass && (realX !== maxX || realY !== maxY))
    {
      switch (knockbackDirection)
      {
        case J.ABS.Directions.UP:
          realY--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY++;
          break;
        case J.ABS.Directions.DOWN:
          realY++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realY--;
          break;
        case J.ABS.Directions.LEFT:
          realX--;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX++;
          break;
        case J.ABS.Directions.RIGHT:
          realX++;
          canPass = targetSprite.canPass(realX, realY, knockbackDirection);
          if (!canPass) realX--;
          break;
        default:
          canPass = false;
          break;
      }
    }

    // execute the jump to the new destination.
    targetSprite.jump(realX - targetSprite.x, realY - targetSprite.y);
  };

  /**
   * Determines if there is a combo action that should succeed this skill.
   * @param {JABS_Battler} caster The battler that casted this skill.
   * @param {JABS_Action} action The action that contains the skill to check for combos.
   */
  checkComboSequence(caster, action)
  {
    const combo = action.getBaseSkill()
      ._j
      .combo();
    if (combo)
    {
      const battler = caster.getBattler();
      const [skillId, comboDelay] = combo;
      if (!battler.hasSkill(skillId))
      {
        return;
      }

      const cooldownKey = action.getCooldownType();
      if (!(caster.getComboNextActionId(cooldownKey) === skillId))
      {
        caster.modCooldownCounter(cooldownKey, comboDelay);
      }

      caster.setComboFrames(cooldownKey, comboDelay);
      caster.setComboNextActionId(cooldownKey, skillId);
    }
  };

  /**
   * Calculates whether or not the attack was parried.
   * @param {JABS_Battler} caster The battler performing the action.
   * @param {JABS_Battler} target The target the action is against.
   * @returns {boolean}
   */
  checkParry(caster, target)
  {
    const isFacing = caster.isFacingTarget(target.getCharacter());
    // cannot parry if not facing target.
    if (!isFacing) return false;

    // if the target battler has 0% GRD, they can't parry.
    const targetBattler = target.getBattler();
    if (targetBattler.grd === 0) return false;

    const casterBattler = caster.getBattler();

    // if the attacker has a state that ignores all parry, then skip parrying.
    if (casterBattler.ignoreAllParry()) return false;

    /*
    // WIP formula!
    // defender's stat calculation of grd, bonuses from agi/luk.
    const baseGrd = parseFloat(((targetBattler.grd - 1) * 100).toFixed(3));
    const bonusGrdFromAgi = parseFloat((targetBattler.agi * 0.1).toFixed(3));
    const bonusGrdFromLuk = parseFloat((targetBattler.luk * 0.1).toFixed(3));
    const defenderGrd = baseGrd + bonusGrdFromAgi + bonusGrdFromLuk;

    // attacker's stat calculation of hit, bonuses from agi/luk.
    const baseHit = parseFloat((casterBattler.hit * 100).toFixed(3));
    const bonusHitFromAgi = parseFloat((casterBattler.agi * 0.1).toFixed(3));
    const bonusHitFromLuk = parseFloat((casterBattler.luk * 0.1).toFixed(3));
    const attackerHit = baseHit + bonusHitFromAgi + bonusHitFromLuk;

    // determine the difference and apply the multiplier if applicable.
    let difference = attackerHit - defenderGrd;
    if (J.LEVEL && J.LEVEL.Metadata.Enabled) {
      const multiplier = LevelScaling.multiplier(targetBattler.level, casterBattler.level);
      difference *= multiplier;
    }

    // the hit is too great, there is no chance of being parried.
    if (difference > 100) {
      return false;
    // the grd is too great, there is no chance of landing a hit.
    } else if (difference < 0) {
      return true;
    }

    const rng = parseInt(Math.randomInt(100) + 1);
    console.log(`attacker: ${attackerHit}, defender: ${defenderGrd}, rng: ${rng}, diff: ${difference}, parried: ${rng > difference}`);
    return rng > difference;
    */

    const bonusHit = parseFloat((casterBattler.hit * 0.1).toFixed(3));
    const hit = parseFloat((Math.random() + bonusHit).toFixed(3));
    const parry = parseFloat((targetBattler.grd - 1).toFixed(3));
    // console.log(`attacker:${casterBattler.name()} bonus:${bonusHit} + hit:${hit-bonusHit} < grd:${parryRate} ?${hit < parryRate}`);
    return hit < parry;
  };

  /**
   * If the battler is hit from outside of it's engagement range,
   * trigger the alert state.
   * @param {JABS_Battler} attacker The battler triggering the alert.
   * @param {JABS_Battler} target The battler entering the alert state.
   */
  triggerAlert(attacker, target)
  {
    // check if the target can actually be alerted first.
    if (!this.canBeAlerted(attacker, target)) return;

    // alert the target!
    target.showBalloon(J.ABS.Balloons.Question);
    target.setAlertedCoordinates(attacker.getX(), attacker.getY());
    const alertDuration = target.getAlertDuration();
    target.setAlertedCounter(alertDuration);

    // a brief pause the first time entering the alerted state.
    if (!target.isAlerted())
    {
      target.setWaitCountdown(45);
    }
  };

  /**
   * Checks if the battler can even be alerted in the first place.
   * @param {JABS_Battler} attacker The battler that initiated the alert.
   * @param {JABS_Battler} battler The battler to be alerted.
   * @return {boolean} True if they can be alerted, false otherwise.
   */
  canBeAlerted(attacker, battler)
  {
    // cannot alert your own allies.
    if (attacker.isSameTeam(battler.getTeam())) return false;

    // cannot alert the player.
    if (battler.isPlayer()) return false;

    // cannot alert battlers that are already engaged.
    if (battler.isEngaged()) return false;

    // cannot alert inanimate objects.
    if (battler.isInanimate()) return false;

    return true;
  };

  /**
   * Applies all effects to the target that occur after the skill execution is complete.
   * @param {JABS_Action} action The `JABS_Action` containing the action data.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  continuedPrimaryBattleEffects(action, target)
  {
    // checks for retaliation from the target.
    this.checkRetaliate(action, target);

    // apply the battle memories to the target.
    const result = target.getBattler().result();
    this.applyBattleMemories(result, action, target);
  };

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} targetBattler The target having the action applied against.
   */
  checkRetaliate(action, targetBattler)
  {
    // do not retaliate against other battler's retaliations.
    if (action.isRetaliation()) return;

    // do not retaliate against being targeted by battlers of the same team.
    if (action.getCaster()
      .isSameTeam(targetBattler.getTeam()))
    {
      return;
    }

    if (targetBattler.isActor())
    {
      // handle player retaliations.
      this.handleActorRetaliation(targetBattler);
    }
    else
    {
      // handle non-player retaliations.
      this.handleEnemyRetaliation(targetBattler);
    }
  };

  /**
   * Executes any retaliation the player may have when receiving a hit while guarding/parrying.
   * @param {JABS_Battler} battler The player's `JABS_Battler`.
   */
  handleActorRetaliation(battler)
  {
    const result = battler.getBattler()
      .result();
    const needsCounterParry = result.preciseParried && battler.counterParry();
    const needsCounterGuard = !needsCounterParry && battler.guarding() && battler.counterGuard();
    const retaliationSkills = battler.getBattler()
      .retaliationSkills();

    // if we should be counter-parrying.
    if (needsCounterParry)
    {
      this.forceMapAction(battler, battler.counterParry(), true);
    }

    // if we should be counter-guarding.
    if (needsCounterGuard)
    {
      this.forceMapAction(battler, battler.counterGuard(), true);
    }

    // if auto-counter is available, then just do that.
    if (result.parried)
    {
      this.handleAutoCounter(battler);
    }

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(battler, skillChance.skillId, true);
        }
      })
    }
  };

  /**
   * If the counter rate is sufficient, then automatically perform your counterskills on any
   * incoming passive parry!
   * @param {JABS_Battler} battler The battler performing the counter.
   */
  handleAutoCounter(battler)
  {
    // if we don't have anything to auto-counter with, skip it.
    const guardData = battler.getGuardData(Game_Actor.JABS_OFFHAND);
    if (!guardData) return;
    if (!guardData.canCounter()) return;

    // if RNG is within the threshold...
    const shouldAutoCounter = battler.getBattler().cnt > Math.random();

    // ...then execute all counters available!
    if (shouldAutoCounter)
    {
      if (guardData.counterGuardId)
      {
        // if we have a counterguard, perform it.
        this.forceMapAction(battler, guardData.counterGuardId, true);
      }

      if (guardData.counterParryId)
      {
        // if we have a counterparry, perform it.
        this.forceMapAction(battler, guardData.counterParryId, true);
      }
    }
  }

  /**
   * Executes any retaliation the enemy may have when receiving a hit at any time.
   * @param {JABS_Battler} enemy The enemy's `JABS_Battler`.
   */
  handleEnemyRetaliation(enemy)
  {
    // assumes enemy battler is enemy.
    const retaliationSkills = enemy.getBattler()
      .retaliationSkills();

    // if there are any passive retaliation skills to perform...
    if (retaliationSkills.length)
    {
      // ...perform them!
      retaliationSkills.forEach(skillChance =>
      {
        if (skillChance.shouldTrigger())
        {
          this.forceMapAction(enemy, skillChance.skillId, true);
        }
      })
    }
  };

  /**
   * Applies a battle memory to the target.
   * Only applicable to actors (for now).
   * @param {Game_ActionResult} result The effective result of the action against the target.
   * @param {JABS_Action} action The action executed against the target.
   * @param {JABS_Battler} target The target the action was applied to.
   */
  applyBattleMemories(result, action, target)
  {
    // only applicable to allies.
    if (target.isEnemy()) return;

    // only works if the code is there to process.
    if (!J.ALLYAI) return;

    const newMemory = new JABS_BattleMemory(
      target.getBattlerId(),
      action.getBaseSkill().id,
      action.getAction()
        .calculateRawElementRate(target.getBattler()),
      result.hpDamage);
    target.applyBattleMemories(newMemory);
  };

  /**
   * Executes a retalation if necessary on receiving a hit.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  postPrimaryBattleEffects(action, target)
  {
    // generate log for this action.
    this.createAttackLog(action, target);

    // generate the text popup for this action.
    this.generatePopAttack(action, target);

    // generate the text popup for the skill usage on the caster.
    this.generatePopSkillUsage(action, target);
  };

  /**
   * Generates a popup based on the action executed and its result.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopAttack(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const caster = action.getCaster();
    const character = target.getCharacter();

    // generate the textpop.
    const damagePop = this.configureDamagePop(action.getAction(), skill, caster, target);

    // add the pop to the target's tracking.
    character.addTextPop(damagePop);
    character.setRequestTextPop();
  };

  /**
   * Generates a popup on the caster based on the skill used.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The target having the action applied against.
   */
  generatePopSkillUsage(action, target)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // inanimate objects do not have skill usage pops.
    if (action.getCaster().isInanimate()) return;

    // gather shorthand variables for use.
    const skill = action.getBaseSkill();
    const character = action.getCaster().getCharacter();

    // generate the textpop.
    const skillUsagePop = this.configureSkillUsedPop(skill);

    // add the pop to the caster's tracking.
    character.addTextPop(skillUsagePop);
    character.setRequestTextPop();
  };

  /**
   * Generates a log in the `Map_TextLog` if applicable.
   * It is important to note that only HP damage is published to the log.
   * @param {JABS_Action} action The action affecting the target.
   * @param {JABS_Battler} target The `JABS_Battler` who was the target of the action.
   */
  createAttackLog(action, target)
  {
    // if not enabled, skip this.
    if (!J.LOG) return;

    // gather shorthand variables for use.
    const result = target.getBattler().result();
    const caster = action.getCaster();
    const skill = action.getBaseSkill();

    const casterName = caster.getReferenceData().name;
    const targetName = target.getReferenceData().name;

    // create parry logs if it was parried.
    if (result.parried)
    {
      const parryLog = new MapLogBuilder()
        .setupParry(targetName, casterName, skill.id, result.preciseParried)
        .build();
      $gameTextLog.addLog(parryLog);
      return;
    }
    // create evasion logs if it was evaded.
    else if (result.evaded)
    {
      const dodgeLog = new MapLogBuilder()
        .setupDodge(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(dodgeLog);
      return;
    }
    // create retaliation logs if it was a retaliation.
    else if (action.isRetaliation())
    {
      const retaliationLog = new MapLogBuilder()
        .setupRetaliation(casterName)
        .build();
      $gameTextLog.addLog(retaliationLog);
    }
    // if no damage of any kind was dealt, and no states were applied, then you get a special message!
    else if (!result.hpDamage && !result.mpDamage && !result.tpDamage && !result.addedStates.length)
    {
      const log = new MapLogBuilder()
        .setupUndamaged(targetName, casterName, skill.id)
        .build();
      $gameTextLog.addLog(log);
      return;
    }
    if (result.hpDamage)
    {
      // otherwise, it must be a regular damage type log.
      // get the base damage dealt and clean that up.
      let roundedDamage = Math.round(result.hpDamage);
      const isNotHeal = roundedDamage > 0;
      roundedDamage = roundedDamage >= 0 ? roundedDamage : roundedDamage.toString().replace("-", "");
      const damageReduction = Math.round(result.reduced);
      let reducedAmount = "";
      if (damageReduction)
      {
        reducedAmount = `(${parseInt(damageReduction)})`;
      }

      const log = new MapLogBuilder()
        .setupExecution(targetName, casterName, skill.id, roundedDamage, reducedAmount, !isNotHeal, result.critical)
        .build();
      $gameTextLog.addLog(log);
      // fall through in case there were states that were also applied, such as defeating the target.
    }

    // also publish any logs regarding application of states against the target.
    if (result.addedStates.length)
    {
      result.addedStates.forEach(stateId =>
      {
        // show a custom line when an enemy is defeated.
        if (stateId === target.getBattler().deathStateId())
        {
          const log = new MapLogBuilder()
            .setupTargetDefeated(targetName)
            .build();
          $gameTextLog.addLog(log);
          return;
        }

        // show all the rest of the non-death states.
        const log = new MapLogBuilder()
          .setupStateAfflicted(targetName, stateId)
          .build();
        $gameTextLog.addLog(log);
      });
    }
  };

  /**
   * Configures this skill used popup based on the skill itself.
   * @param {rm.types.Skill} skill The skill that was used.
   * @returns {Map_TextPop}
   */
  configureSkillUsedPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillUsed(skill.iconIndex)
      .build();
  };

  /**
   * Configures this damage popup based on the action result against the target.
   * TODO: reduce incoming parameters to only "action" and "target"- extract as-needed.
   * @param {Game_Action} gameAction The action this popup is based on.
   * @param {rm.types.Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler who casted this skill.
   * @param {JABS_Battler} target The target battler the popup is placed on.
   */
  configureDamagePop(gameAction, skill, caster, target)
  {
    // get the underlying battler associated with the popup.
    const targetBattler = target.getBattler();

    // get the underlying actionresult from the skill execution.
    const actionResult = targetBattler.result();

    // initialize this to false.
    let targetElementallyImmune = false;

    // determine the elemental factor.
    let elementalRate;

    // check if using the J-Elementalistics plugin.
    if (J.ELEM)
    {
      // leverage the new elemental algorithm for elemental rates.
      elementalRate = gameAction.calculateRawElementRate(targetBattler);

      // check to ensure we have any amount of applicable elements.
      targetElementallyImmune = (gameAction.getApplicableElements(targetBattler)).length === 0;
    }
    else
    {
      // leverage the default method for obtaining elemental rate.
      elementalRate = gameAction.calcElementRate(targetBattler);
    }

    // translate the skill into it's relevant iconIndex, or 0 if not applicable.
    const elementalIcon = this.determineElementalIcon(skill, caster);

    // if the skill execution was parried, then use that icon instead.
    const iconIndex = actionResult.parried
      ? 128
      : elementalIcon;

    // instantiate the builder for piece-mealing the popup together.
    const textPopBuilder = new TextPopBuilder(0);

    // if the target was completely immune to what you had, then say so.
    if (targetElementallyImmune)
    {
      textPopBuilder.setValue(`IMMUNE`);
    }
    // if you were parried, sorry about your luck.
    else if (actionResult.parried)
    {
      textPopBuilder.setValue(`PARRY!`);
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.hpDamage)
    {
      textPopBuilder
        .setValue(actionResult.hpDamage)
        .isHpDamage();
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.mpDamage)
    {
      textPopBuilder
        .setValue(actionResult.mpDamage)
        .isMpDamage();
    }
    // if the result is tp damage, treat it as such.
    else if (actionResult.tpDamage)
    {
      textPopBuilder
        .setValue(actionResult.mpDamage)
        .isTpDamage();
    }

    // if we somehow used this without a proper damage type, then just build a default.
    return textPopBuilder
      .setIconIndex(iconIndex)
      .isElemental(elementalRate)
      .setCritical(actionResult.critical)
      .build();
  };

  /**
   * Translates a skill's elemental affiliation into the icon id representing it.
   * @param {rm.types.Skill} skill The skill reference data itself.
   * @param {JABS_Battler} caster The battler performing the action.
   * @returns {number} The icon index to use for this popup.
   */
  determineElementalIcon(skill, caster)
  {
    // if not using the elemental icons, don't return one.
    if (!J.ABS.Metadata.UseElementalIcons) return 0;

    let elementId = skill.damage.elementId;

    // if the battler is an actor and the action is based on the weapon's elements
    // probe the weapon's traits for its actual element.
    if (elementId === -1 && caster.isActor())
    {
      const attackElements = caster.getBattler()
        .attackElements();
      if (attackElements.length)
      {
        // we pick only the first element!
        elementId = attackElements[0];
      }
      else
      {
        elementId = 0;
      }
    }

    // if its an item, then use the item's icon index.
    if (DataManager.isItem(skill))
    {
      return $dataItems[skill.id].iconIndex;
    }

    const iconData = J.ABS.Metadata.ElementalIcons;
    const elementalIcon = iconData.find(data => data.element === elementId);
    return elementalIcon ? elementalIcon.icon : 0;
  };

  //#endregion action execution

  //#region collision
  /**
   * Checks this `JABS_Action` against all map battlers to determine collision.
   * If there is a collision, then a `Game_Action` is applied.
   * @param {JABS_Action} action The `JABS_Action` to check against all battlers.
   * @returns {JABS_Battler[]} A collection of `JABS_Battler`s that this action hit.
   */
  getCollisionTargets(action)
  {
    if (action.getAction()
      .isForUser())
    {
      return [action.getCaster()];
    }

    const actionSprite = action.getActionSprite();
    const range = action.getRange();
    const shape = action.getShape();
    const casterJabsBattler = action.getCaster();
    const caster = casterJabsBattler.getCharacter();

    /**  @type {JABS_Battler[]} */
    const battlers = $gameMap.getAllBattlersDistanceSortedFromPlayer(casterJabsBattler);
    let hitOne = false;
    let targetsHit = [];

    const allyTarget = casterJabsBattler.getAllyTarget();
    if (allyTarget && action.getAction()
      .isForOne())
    {
      if (allyTarget.canActionConnect() && allyTarget.isWithinScope(action, allyTarget, hitOne))
      {
        targetsHit.push(allyTarget);
        return targetsHit;
      }
    }

    battlers
      .filter(battler =>
      {
        // this battler is untargetable.
        if (!battler.canActionConnect()) return false;

        // the action's scopes don't meet the criteria for this target.
        // excludes the "single"-hitonce check.
        if (!battler.isWithinScope(action, battler)) return false;

        // if the attacker is an enemy, do not consider inanimate targets.
        if (casterJabsBattler.isEnemy() && battler.isInanimate()) return false;

        // this battler is potentially hit-able.
        return true;
      })
      .forEach(battler =>
      {
        // this time, it is effectively checking for the single-scope.
        if (!battler.isWithinScope(action, battler, hitOne)) return;

        // if the action is a direct-targeting action,
        // then only check distance between the caster and target.
        if (action.isDirectAction())
        {
          if (action.getAction()
            .isForUser())
          {
            targetsHit.push(battler);
            hitOne = true;
            return;
          }
          const maxDistance = action.getProximity();
          const distance = casterJabsBattler.distanceToDesignatedTarget(battler);
          if (distance <= maxDistance)
          {
            targetsHit.push(battler);
            hitOne = true;
          }

          // if the action is a standard projectile-based action,
          // then check to see if this battler is now in range.
        }
        else
        {
          const sprite = battler.getCharacter();
          let dx = actionSprite.x - sprite.x;
          let dy = actionSprite.y - sprite.y;
          dx = dx >= 0 ? Math.max(dx, 0) : Math.min(dx, 0);
          dy = dy >= 0 ? Math.max(dy, 0) : Math.min(dy, 0);
          const result = this.isTargetWithinRange(caster.direction(), dx, dy, range, shape);
          if (result)
          {
            targetsHit.push(battler);
            hitOne = true;
          }
        }
      });

    return targetsHit;
  };

  /**
   * Determines collision of a given shape vs coordinates.
   * @param {number} facing The direction the caster is facing.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {string} shape The collision formula based on shape.
   */
  isTargetWithinRange(facing, dx, dy, range, shape)
  {
    switch (shape)
    {
      case J.BASE.Shapes.Rhombus:
        return this.collisionRhombus(Math.abs(dx), Math.abs(dy), range);
      case J.BASE.Shapes.Square:
        return this.collisionSquare(Math.abs(dx), Math.abs(dy), range);
      case J.BASE.Shapes.FrontSquare:
        return this.collisionFrontSquare(dx, dy, range, facing);
      case J.BASE.Shapes.Line:
        return this.collisionLine(dx, dy, range, facing);
      case J.BASE.Shapes.Arc:
        return this.collisionArc(dx, dy, range, facing);
      case J.BASE.Shapes.Wall:
        return this.collisionWall(dx, dy, range, facing);
      case J.BASE.Shapes.Cross:
        return this.collisionCross(dx, dy, range);
      default:
        return false;
    }
  };

  /**
   * A rhombus-shaped (aka diamond) collision.
   * Range determines the size of the rhombus surrounding the action.
   * This is typically used for AOE around the caster type skills, but could also
   * be used for very large objects, or as an explosion radius.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision shape is.
   */
  collisionRhombus(absDx, absDy, range)
  {
    return (absDx + absDy) <= range;
  };

  /**
   * A square-shaped collision.
   * Range determines the size of the square around the action.
   * The use cases for this are similar to that of rhombus, but instead of a diamond-shaped
   * hitbox, its a plain ol' square.
   * @param {number} absDx The absolute value of the distance between target and actions' `X` value.
   * @param {number} absDy The absolute value of the distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   */
  collisionSquare(absDx, absDy, range)
  {
    const inHorzRange = absDx <= range;
    const inVertRange = absDy <= range;
    return inHorzRange && inVertRange;
  };

  /**
   * A square-shaped collision infront of the caster.
   * Range determines the size of the square infront of the action.
   * For when you want a square that doesn't affect targets behind the action. It would be
   * more accurate to call this a "half-square", really.
   * @param {number} dx The distance between target and actions' `X` value.
   * @param {number} dy The distance between target and actions' `Y` value.
   * @param {number} range How big the collision square is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionFrontSquare(dx, dy, range, facing)
  {
    const inHorzRange = Math.abs(dx) <= range;
    const inVertRange = Math.abs(dy) <= range;
    let isFacing = true;

    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
    }

    return inHorzRange && inVertRange && isFacing;
  };

  /**
   * A line-shaped collision.
   * Range the distance of the of the line.
   * This is typically used for spears and other stabby attacks.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionLine(dx, dy, range, facing)
  {
    let result = false;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        result = (dx === 0) && (dy >= 0) && (dy <= range);
        break;
      case J.ABS.Directions.UP:
        result = (dx === 0) && (dy <= 0) && (dy >= -range);
        break;
      case J.ABS.Directions.RIGHT:
        result = (dy === 0) && (dx >= 0) && (dx <= range);
        break;
      case J.ABS.Directions.LEFT:
        result = (dy === 0) && (dx <= 0) && (dx >= -range);
        break;
    }

    return result;
  };

  /**
   * An arc-shaped collision.
   * Range determines the reach and area of arc.
   * This is what could be considered a standard 180 degree slash-shape, the basic attack.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionArc(dx, dy, range, facing)
  {
    const inRange = (Math.abs(dx) + Math.abs(dy)) <= range;
    let isFacing = true;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
        isFacing = dy <= 0;
        break;
      case J.ABS.Directions.UP:
        isFacing = dy >= 0;
        break;
      case J.ABS.Directions.RIGHT:
        isFacing = dx <= 0;
        break;
      case J.ABS.Directions.LEFT:
        isFacing = dx >= 0;
        break;
    }

    return inRange && isFacing;
  };

  /**
   * A wall-shaped collision.
   * Range determines how wide the wall is.
   * Typically used for hitting targets to the side of the caster.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   * @param {number} facing The direction the caster is facing at time of cast.
   */
  collisionWall(dx, dy, range, facing)
  {
    let result = false;
    switch (facing)
    {
      case J.ABS.Directions.DOWN:
      case J.ABS.Directions.UP:
        result = Math.abs(dx) <= range && dy === 0;
        break;
      case J.ABS.Directions.RIGHT:
      case J.ABS.Directions.LEFT:
        result = Math.abs(dy) <= range && dx === 0;
        break;
    }

    return result;
  };

  /**
   * A cross shaped collision.
   * Range determines how far the cross reaches from the action.
   * Think bomb explosions from the game bomberman.
   * @param {number} dx The distance between target and X value.
   * @param {number} dy The distance between target and Y value.
   * @param {number} range How big the collision shape is.
   */
  collisionCross(dx, dy, range)
  {
    const inVertRange = Math.abs(dy) <= range && dx === 0;
    const inHorzRange = Math.abs(dx) <= range && dy === 0;
    return inVertRange || inHorzRange;
  };

  //#endregion collision

  //#region defeated target aftermath
  /**
   * Handles the defeat of a given `Game_Battler` on the map.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  handleDefeatedTarget(target, caster)
  {
    this.predefeatHandler(target, caster);
    switch (true)
    {
      case (target.isPlayer()):
        this.handleDefeatedPlayer();
        break;
      case (target.isActor() && !target.isPlayer() && !target.isDying()):
        this.handleDefeatedAlly(target);
        break;
      case (target.isEnemy()):
        this.handleDefeatedEnemy(target, caster);
        break;
      default:
        break;
    }

    this.postDefeatHandler(target, caster);
  };

  /**
   * Handles the effects that occur before a target's defeat is processed,
   * such as "executes skill on death".
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  predefeatHandler(target, caster)
  {
    target.performPredefeatEffects(caster);
  };

  /**
   * Handles the effects that occur after a target's defeat is processed.
   * @param {JABS_Battler} target The `Game_Battler` that was defeated.
   * @param {JABS_Battler} caster The `Game_Battler` that defeated the target.
   */
  postDefeatHandler(target, caster)
  {
    target.performPostdefeatEffects(caster);
  };

  /**
   * Handles the defeat of the battler the player is currently controlling.
   */
  handleDefeatedPlayer()
  {
    //? TODO: gameover calls this like 100 times, make it stop.
    this.rotatePartyMembers();
  };

  /**
   * Handles a non-player ally that was defeated.
   */
  handleDefeatedAlly(defeatedAlly)
  {
    //console.log(`${defeatedAlly.getBattler().name()} has died.`);
  };

  /**
   * Handles an enemy that was defeated, including dolling out exp/gold and loot drops.
   * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
   * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
   */
  handleDefeatedEnemy(defeatedTarget, caster)
  {
    // remove all leader/follower data the battler may have.
    defeatedTarget.clearFollowers();
    defeatedTarget.clearLeader();

    // perform the death cry if they are dunzo.
    const targetCharacter = defeatedTarget.getCharacter();
    if (!defeatedTarget.isInanimate())
    {
      SoundManager.playEnemyCollapse();
    }

    // if the defeated target is an enemy, check for death controls.
    if (defeatedTarget.hasEventActions())
    {
      targetCharacter.start();
    }

    // if the caster is player/actor, gain aftermath.
    if (caster && caster.isActor())
    {
      const targetBattler = defeatedTarget.getBattler();
      this.gainBasicRewards(targetBattler, caster);
      this.createLootDrops(defeatedTarget, caster);
    }

    // remove the target's character from the map.
    defeatedTarget.setDying(true);
  };

  /**
   * Grants experience/gold/loot rewards to the battler that defeated the target.
   * If the level scaling plugin is available, both experience and gold are scaled.
   * @param {Game_Enemy} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  gainBasicRewards(enemy, actor)
  {
    let experience = enemy.exp();
    let gold = enemy.gold();
    const actorCharacter = actor.getCharacter();

    const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
    experience = Math.ceil(experience * levelMultiplier);
    gold = Math.ceil(gold * levelMultiplier);

    this.gainExperienceReward(experience, actorCharacter);
    this.gainGoldReward(gold, actorCharacter);
    this.createRewardsLog(experience, gold, actor);
  };

  /**
   * Gets the multiplier based on difference in level between attacker and
   * target to determine if the battle was "too easy" or "very hard", resulting
   * in reduced or increased numeric rewards (excludes loot drops).
   * @param {Game_Battler} enemy The target battler that was defeated.
   * @param {JABS_Battler} actor The map battler that defeated the target.
   */
  getRewardScalingMultiplier(enemy, actor)
  {
    let multiplier = 1.0;
    if (J.LEVEL && J.LEVEL.Metadata.Enabled)
    {
      multiplier = LevelScaling.multiplier(actor.getBattler().level, enemy.level);
    }

    return multiplier;
  };

  /**
   * Gains experience from battle rewards.
   * @param {number} experience The experience to be gained as a reward.
   * @param {Game_Character} casterCharacter The character who defeated the target.
   */
  gainExperienceReward(experience, casterCharacter)
  {
    // don't do anything if the enemy didn't grant any experience.
    if (!experience) return;

    const activeParty = $gameParty.battleMembers();
    activeParty.forEach(member =>
    {
      const gainedExperience = experience *= member.exr;
      member.gainExp(gainedExperience);
    });

    // generate the text popup for the experience earned.
    this.generatePopExperience(experience, casterCharacter);
  };

  /**
   * Generates a popup for experience earned.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopExperience(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const expPop = this.configureExperiencePop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(expPop);
    character.setRequestTextPop();
  };

  /**
   * Creates the text pop of the experienced gained.
   * @param {number} exp The amount of experience gained.
   * @returns {Map_TextPop}
   */
  configureExperiencePop(exp)
  {
    // round the experience we've acquired if it is a decimal.
    const experienceGained = Math.round(exp);

    // build the popup.
    return new TextPopBuilder(experienceGained)
      .isExperience()
      .build();
  };

  /**
   * Gains gold from battle rewards.
   * @param {number} gold The gold to be gained as a reward.
   * @param {Game_Character} character The character who defeated the target.
   */
  gainGoldReward(gold, character)
  {
    // don't do anything if the enemy didn't grant any gold.
    if (!gold) return;

    // actually gain the gold.
    $gameParty.gainGold(gold);

    // generate the text popup for the gold found.
    this.generatePopGold(gold, character);
  };

  /**
   * Generates a popup for gold found.
   * @param {number} amount The amount in the popup.
   * @param {Game_Character} character The character the popup is on.
   */
  generatePopGold(amount, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const goldPop = this.configureGoldPop(amount);

    // add the pop to the target's tracking.
    character.addTextPop(goldPop);
    character.setRequestTextPop();
  };

  /**
   * Creates the text pop of the gold gained.
   * @param {number} gold The amount of gold gained.
   */
  configureGoldPop(gold)
  {
    // round the gold we've acquired if it is a decimal.
    const goldGained = Math.round(gold);

    // build the popup.
    return new TextPopBuilder(goldGained)
      .isGold()
      .build();
  };

  /**
   * Create a log entry for both experience earned and gold dropped.
   * @param {number} experience The amount of experience gained.
   * @param {number} gold The gold to be gained as a reward.
   * @param {JABS_Battler} caster The ally gaining the experience and gold.
   */
  createRewardsLog(experience, gold, caster)
  {
    if (!J.LOG) return;

    if (experience !== 0)
    {
      const expLog = new MapLogBuilder()
        .setupExperienceGained(caster.getReferenceData().name, experience)
        .build();
      $gameTextLog.addLog(expLog);
    }

    if (gold !== 0)
    {
      const goldLog = new MapLogBuilder()
        .setupGoldFound(gold)
        .build();
      $gameTextLog.addLog(goldLog);
    }
  };

  /**
   * Create all drops for a defeated enemy and gain them.
   * @param {JABS_Battler} target The enemy dropping the loot.
   * @param {JABS_Battler} caster The ally that defeated the enemy.
   */
  createLootDrops(target, caster)
  {
    // actors don't drop loot.
    if (target.isActor()) return;

    // if we have no drops, don't bother.
    const items = target
      .getBattler()
      .makeDropItems();
    if (items.length === 0) return;

    items.forEach(item => this.addLootDropToMap(target.getX(), target.getY(), item));
  };

  /**
   * Creates a log for an item earned as a loot drop from an enemy.
   * @param {object} item The reference data for the item loot that was picked up.
   */
  createLootLog(item)
  {
    if (!J.LOG) return;

    let lootType = String.empty;
    if (item.atypeId)
    {
      lootType = "armor";
    }
    else if (item.wtypeId)
    {
      lootType = "weapon";
    }
    else if (item.itypeId)
    {
      lootType = "item";
    }

    // the player is always going to be the one collecting the loot- for now.
    const lootLog = new MapLogBuilder()
      .setupLootObtained(this.getPlayerMapBattler().getReferenceData().name, lootType, item.id)
      .build();
    $gameTextLog.addLog(lootLog);
  };

  /**
   * Generates popups for a pile of items picked up at the same time.
   * @param {rm.types.BaseItem[]} itemDataList All items picked up.
   * @param {Game_Character} character The character displaying the popups.
   */
  generatePopItemBulk(itemDataList, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // iterate over all loot.
    itemDataList.forEach((itemData, index) =>
    {
      // generate a pop that moves based on index.
      this.generatePopItem(itemData, character, 64+(index*24));
    }, this);

    // flag the character for processing pops.
    character.setRequestTextPop();
  };

  /**
   * Generates a popup for an acquired item.
   *
   * NOTE:
   * This is used from within the `generatePopItemBulk()`!
   * Use that instead of this!
   * @param {rm.types.BaseItem} itemData The item's database object.
   * @param {Game_Character} character The character displaying the popup.
   * @param {number} y The y coordiante for this item pop.
   */
  generatePopItem(itemData, character, y)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const lootPop = this.configureItemPop(itemData, y);

    // add the pop to the target's tracking.
    character.addTextPop(lootPop);
  };

  /**
   * Creates the text pop of the acquired item.
   * @param {rm.types.BaseItem} itemData The item's database object.
   * @param {number} y The y coordiante for this item pop.
   */
  configureItemPop(itemData, y)
  {
    // build the popup.
    return new TextPopBuilder(itemData.name)
      .isLoot(y)
      .setIconIndex(itemData.iconIndex)
      .build();
  };

  /**
   * Handles a level up for the leader while on the map.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerLevelup(uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.playLevelUpAnimation(character);
      this.generatePopLevelUp(character);
      this.createLevelUpLog(battler);
    }
  };

  /**
   * Creates a text pop of the level up.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopLevelUp(character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const levelUpPop = this.configureLevelUpPop();

    // add the pop to the target's tracking.
    character.addTextPop(levelUpPop);
    character.setRequestTextPop();
  };

  /**
   * Configures the level up text pop.
   * @returns {Map_TextPop}
   */
  configureLevelUpPop()
  {
    // build the popup.
    return new TextPopBuilder(`LEVEL UP`)
      .isLevelUp()
      .build();
  };

  /**
   * Creates a level up log for the given battler.
   * @param {JABS_Battler} jabsBattler The given JABS battler.
   */
  createLevelUpLog(jabsBattler)
  {
    if (!J.LOG) return;

    const battler = jabsBattler.getBattler();
    const log = this.configureLevelUpLog(battler.name(), battler.level);
    $gameTextLog.addLog(log);
  };

  /**
   * Configures the log for the actor reaching a new level.
   * @param {string} targetName The name of the battler leveling up.
   * @param {number} newLevel The level being reached.
   * @returns {Map_Log}
   */
  configureLevelUpLog(targetName, newLevel)
  {
    return new MapLogBuilder()
      .setupLevelUp(targetName, newLevel)
      .build();
  };

  /**
   * Plays the level up animation on the character.
   * @param {Game_Character} character The player's `Game_Character`.
   */
  playLevelUpAnimation(character)
  {
    character.requestAnimation(49);
  };

  /**
   * Handles a skill being learned for the leader while on the map.
   * @param {rm.types.Skill} skill The skill being learned.
   * @param {string} uuid The uuid of the battler leveling up.
   */
  battlerSkillLearn(skill, uuid)
  {
    const battler = $gameMap.getBattlerByUuid(uuid);
    if (battler)
    {
      const character = battler.getCharacter();
      this.generatePopSkillLearn(skill, character);
      this.createSkillLearnLog(skill, battler);
    }
  };

  /**
   * Creates a text pop of the skill being learned.
   * @param {rm.types.Skill} skill The skill being learned.
   * @param {Game_Character} character The character to show the popup on.
   */
  generatePopSkillLearn(skill, character)
  {
    // if we are not using popups, then don't do this.
    if (!J.POPUPS) return;

    // generate the textpop.
    const skillLearnPop = this.configureSkillLearnPop(skill);

    // add the pop to the target's tracking.
    character.addTextPop(skillLearnPop);
    character.setRequestTextPop();
  };

  /**
   * Configures the popup for a skill learned.
   * @param {rm.types.Skill} skill The skill learned.
   * @returns {Map_TextPop}
   */
  configureSkillLearnPop(skill)
  {
    return new TextPopBuilder(skill.name)
      .isSkillLearned(skill.iconIndex)
      .build();
  };

  /**
   * Creates a skill learning log for the player.
   * @param {rm.types.Skill} skill The skill being learned.
   * @param {JABS_Battler} player The player's `JABS_Battler`.
   */
  createSkillLearnLog(skill, player)
  {
    if (!J.LOG) return;

    const log = this.configureSkillLearnLog(player.getReferenceData().name, skill.id);
    $gameTextLog.addLog(log);
  };

  /**
   * Configures the log for the skill learned.
   * @param {string} targetName The name of the target learning the skill.
   * @param {number} learnedSkillId The id of the skill learned.
   * @returns {Map_Log}
   */
  configureSkillLearnLog(targetName, learnedSkillId)
  {
    return new MapLogBuilder()
      .setupSkillLearn(targetName, learnedSkillId)
      .build();
  };

//#endregion defeated target aftermath
}

//#endregion Game_BattleMap

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
Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY)
{
  var searchLimit = this.searchLimit();
  var mapWidth = $gameMap.width();
  var nodeList = [];
  var openList = [];
  var closedList = [];
  var start = {};
  var best = start

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

    var current = nodeList[bestIndex];
    var x1 = current.x;
    var y1 = current.y;
    var pos1 = y1 * mapWidth + x1;
    var g1 = current.g;

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
      var horz = directions[0];
      var vert = directions[1];
      var x2 = $gameMap.roundXWithDirection(x1, horz);
      var y2 = $gameMap.roundYWithDirection(y1, vert);
      var pos2 = y2 * mapWidth + x2;

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

  var node = best;
  while (node.parent && node.parent !== start)
  {
    node = node.parent;
  }

  var deltaX1 = $gameMap.deltaX(node.x, start.x);
  var deltaY1 = $gameMap.deltaY(node.y, start.y);
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

  var deltaX2 = this.deltaXFrom(goalX);
  var deltaY2 = this.deltaYFrom(goalY);
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
  const player = $gameBattleMap.getPlayerMapBattler();
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
  if ($dataEnemies[enemyId])
  {
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
 * Gets the current number of bonus hits for this actor.
 * @returns {number}
 */
Game_Enemy.prototype.getBonusHits = function()
{
  let bonusHits = 0;
  const structure = /<bonusHits:[ ]?(\d+)>/i;
  const objectsToCheck = this.getEverythingWithNotes();
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
 *
 * @param {rm.types.Enemy} referenceData
 * @returns
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
 * Gets the enemy's basic attack skill id from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.skillId = function()
{
  const referenceData = this.enemy();

  // check the traits for the skill id first.
  const attackSkillTrait = referenceData.traits
    .find(trait => trait.code === J.BASE.Traits.ATTACK_SKILLID);
  if (attackSkillTrait)
  {
    return attackSkillTrait.dataId;
  }

  // then check the notes for the skill id.
  const notesSkillId = this.getSkillIdFromEnemyNotes(referenceData);
  if (notesSkillId)
  {
    return notesSkillId;
  }

  // still no dice, then use the default one.
  return J.ABS.Metadata.DefaultEnemyAttackSkillId;
};

/**
 * Gets the skill id from the notes.
 * @param {rm.types.Enemy} referenceData The reference data for this enemy.
 * @returns
 */
Game_Enemy.prototype.getSkillIdFromEnemyNotes = function(referenceData)
{
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.SkillId])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.SkillId]) || skillId;
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    let skillId = 0;
    const structure = /<skillId:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        skillId = parseInt(RegExp.$1);
      }
    });

    return skillId;
  }
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
 * Gets the enemy's ai code from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {string}
 */
Game_Enemy.prototype.ai = function()
{
  let val = J.ABS.Metadata.DefaultEnemyAiCode;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AiCode])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.AiCode];
  }
  else
  {
    const structure = /<ai:[ ]?([0|1]{8})>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = RegExp.$1;
      }
    });
  }

  return val;
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
    return $gameBattleMap.event(this.getMapActionUuid());
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
  if ($gameBattleMap.absEnabled)
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

  // setup our variables for assignment.
  let battlerId = 0;
  let teamId = null;
  let ai = null;
  let sightRange = null;
  let alertedSightBoost = null;
  let pursuitRange = null;
  let alertedPursuitBoost = null;
  let alertDuration = null;
  let canIdle = null;
  let showHpBar = null;
  let showBattlerName = null;
  let isInvincible = null;
  let isInanimate = null;

  // iterate over all commands to construct the battler core data.
  this.list().forEach(command =>
  {
    // assuming the event command is a comment, assign the values.
    if (this.matchesControlCode(command.code))
    {
      const comment = command.parameters[0];
      if (comment.match(/^<[.\w:-]+>$/i))
      {
        switch (true)
        {
          case (/<e:[ ]?([0-9]*)>/i.test(comment)): // enemy id
            battlerId = parseInt(RegExp.$1);
            break;
          case (/<team:[ ]?([0-9]*)>/i.test(comment)): // enemy id
            teamId = parseInt(RegExp.$1);
            break;
          case (/<ai:[ ]?([0|1]{8})>/i.test(comment)): // ai code
            ai = JABS_Battler.translateAiCode(RegExp.$1);
            break;
          case (/<s:[ ]?([0-9]*)>/i.test(comment)): // sight range
            sightRange = parseInt(RegExp.$1);
            break;
          case (/<as:[ ]?([0-9]*)>/i.test(comment)): // alerted sight boost
            alertedSightBoost = parseInt(RegExp.$1);
            break;
          case (/<p:[ ]?([0-9]*)>/i.test(comment)): // pursuit range
            pursuitRange = parseInt(RegExp.$1);
            break;
          case (/<ap:[ ]?([0-9]*)>/i.test(comment)): // alerted pursuit boost
            alertedPursuitBoost = parseInt(RegExp.$1);
            break;
          case (/<ad:[ ]?([0-9]*)>/i.test(comment)): // alert duration
            alertDuration = parseInt(RegExp.$1);
            break;
          case (/<noIdle>/i.test(comment)): // able to idle?
            canIdle = false;
            break;
          case (/<noHpBar>/i.test(comment)): // show hp bar?
            showHpBar = false;
            break;
          case (/<noName>/i.test(comment)): // show battler name?
            showBattlerName = false;
            break;
          case (/<invincible>/i.test(comment)): // is invincible?
            isInvincible = true;
            break;
          case (/<inanimate>/i.test(comment)): // is inanimate?
            isInanimate = true;
            teamId = JABS_Battler.neutralTeamId();
            break;
        }
      }
    }
  });

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

  this.initializeCoreData(battlerCoreData);
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
    // if the command isn't a comment, then skip.
    if (!this.matchesControlCode(command.code)) return false;

    // grab the comment and check to make sure it matches our notetag-like pattern.
    const comment = command.parameters[0];
    if (!comment.match(/^<[.\w:-]+>$/i)) return false;

    // check if the comment matches the pattern we expect.
    return comment.match(/<e:[ ]?([0-9]*)>/i);
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
    if (!comment.match(/^<[.\w:-]+>$/i)) return false;

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
    if (comment.match(/<ms:((0|([1-9][0-9]*))(\.[0-9]+)?)>/i))
    {
      // apply the custom move speed based on the tag provided.
      this.setMoveSpeed(parseFloat(RegExp.$1));
    }
  });
};

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
  if ($gameBattleMap.absEnabled)
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
  if ($gameBattleMap.absEnabled)
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
  if ($gameBattleMap.absEnabled)
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
 * Enables the shop scene with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function(params)
{
  if ($gameBattleMap.absEnabled)
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
 * Enables saving with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command352 = Game_Interpreter.prototype.command352;
Game_Interpreter.prototype.command352 = function()
{
  if ($gameBattleMap.absEnabled)
  {
    SceneManager.push(Scene_Save);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command352.call(this);
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
  if ($gameBattleMap.absEnabled)
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
  this.jabsInitialization();
};

/**
 * Initializes all enemies and the battle map for JABS.
 */
Game_Map.prototype.jabsInitialization = function()
{
  // don't do things if we aren't using JABS.
  if (!$gameBattleMap.absEnabled) return;

  // initialize the battle map for this map.
  $gameBattleMap.initialize();

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
    else { }
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

  // update JABS.
  $gameBattleMap.update();
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
    const actionMetadata = $gameBattleMap.event(uuid);
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
  battlers.push($gameBattleMap.getPlayerMapBattler());
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
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlersWithinRange = function(user, maxDistance, includePlayer = true)
{
  const battlers = this.getBattlers();
  if (includePlayer)
  {
    battlers.push($gameBattleMap.getPlayerMapBattler());
  }

  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all battlers that are on a different team from the designated battler.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlers = function(user)
{
  const battlers = this.getBattlers();
  const player = $gameBattleMap.getPlayerMapBattler();
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
 * @param {JABS_Battler} user The battler to find opponents for.
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
  const battler = this._j._allBattlers.find((battler, index) =>
  {
    const result = battler.getUuid() === uuid;
    if (result) targetIndex = index;
    return result;
  });

  return [battler, targetIndex];
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
  $gameBattleMap.cleanupAction(actionToRemove.getMapActionData());

  // and also to cleanup the current list of active jabs action events.
  $gameBattleMap.clearActionEvents();

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
//#endregion

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
  const shift = Input.isPressed(J.ABS.Input.X);
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
  if ($gameBattleMap.absEnabled)
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
  const isMenuRequested = $gameBattleMap.requestAbsMenu;
  const isAbsPaused = $gameBattleMap.absPause;
  const isPlayerCasting = $gameBattleMap.getPlayerMapBattler()
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
  if ($gameBattleMap.absEnabled)
  {
    return Input.isPressed(J.ABS.Input.Cheat) && $gameTemp.isPlaytest();
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
  $gameBattleMap.initializePlayerBattler();
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
  const player = $gameBattleMap.getPlayerMapBattler();
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
    const lootData = loot.getLootData().lootData;

    // store the loot on-pickup.
    this.storeOnPickup(lootData);

    // note that the loot was picked up.
    lootPickedUp.push(lootData);

    // remove loot now that we're done with it.
    this.removeLoot(loot);
  });

  // generate all popups for the loot collected.
  $gameBattleMap.generatePopItemBulk(lootPickedUp, this);

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
  const lootData = lootMetadata.lootData;
  lootMetadata.useOnPickup
    ? this.useOnPickup(lootData)
    : this.storeOnPickup(lootData);
};

/**
 * Uses the loot as soon as it is collected.
 * @param {rm.types.BaseItem} lootData An object representing the loot.
 */
Game_Player.prototype.useOnPickup = function(lootData)
{
  const player = $gameBattleMap.getPlayerMapBattler();
  player.applyToolEffects(lootData.id, true);
};

/**
 * Picks up the loot and stores it in the player's inventory.
 * @param {rm.types.BaseItem} lootData The loot database data itself.
 */
Game_Player.prototype.storeOnPickup = function(lootData)
{
  // add the loot to your inventory.
  $gameParty.gainItem(lootData, 1, true);

  // generate a log for the loot collected.
  $gameBattleMap.createLootLog(lootData);
};

/**
 * Removes the loot drop event from the map.
 * @param {Game_Event} lootEvent The loot to remove from the map.
 */
Game_Player.prototype.removeLoot = function(lootEvent)
{
  lootEvent.setLootNeedsRemoving(true);
  $gameBattleMap.requestClearLoot = true;
};
//#endregion

//#region Game_Unit
/**
 * OVERWRITE If Jabs is enabled, then you are always "in battle"!
 * Otherwise, it is dependent on the default method.
 */
J.ABS.Aliased.Game_Unit.inBattle = Game_Unit.prototype.inBattle;
Game_Unit.prototype.inBattle = function()
{
  return $gameBattleMap.absEnabled
    ? true
    : J.ABS.Aliased.Game_Unit.inBattle.call(this);
}
//#endregion
//ENDFILE