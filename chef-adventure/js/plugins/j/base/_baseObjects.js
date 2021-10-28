/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] Mods/Adds for the various game object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of BASE.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_objects.js, such as Game_Map. Also, any new
 * things that follow the pattern that defines a game object can be found in
 * here.
 * ============================================================================
 */

//#region Game_Actor
/**
 * Gets all skills that are executed when this actor is defeated.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onOwnDefeatSkillIds = function() {
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Gets all skills that are executed when this actor defeats a target.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.onTargetDefeatSkillIds = function() {
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Checks all possible places for whether or not the actor is able to
 * be switched to.
 * @returns {boolean}
 */
Game_Actor.prototype.switchLocked = function() {
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<noSwitch>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj => {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line => {
      if (line.match(structure)) {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets whether or not there are notes that indicate skills should be autoassigned
 * when leveling up.
 * @returns {boolean}
 */
Game_Actor.prototype.autoAssignOnLevelup = function() {
  const objectsToCheck = this.getEverythingWithNotes();
  const structure = /<autoAssignSkills>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj => {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line => {
      if (line.match(structure)) {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};

/**
 * Gets all things the things that this actor has that can possibly have
 * notes on it at the present moment. This includes the actor itself, the
 * actor's class, their skills, their equips, and their current states.
 * @returns {rm.types.BaseItem[]}
 */
Game_Actor.prototype.getEverythingWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.actor());
  objectsWithNotes.push(this.currentClass());
  objectsWithNotes.push(...this.skills());
  objectsWithNotes.push(...this.equips().filter(equip => !!equip));
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * Gets all things except skills that can possibly have notes on it at the
 * present moment. Skills are omitted on purpose.
 * @returns {rm.types.BaseItem[]}
 */
Game_Actor.prototype.getCurrentWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.actor());
  objectsWithNotes.push(this.currentClass());
  objectsWithNotes.push(...this.equips().filter(equip => !!equip));
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * Gets how much bonus HIT this actor has based on level.
 * @returns {number} The amount of growth in HIT for this actor.
 */
Game_Actor.prototype.hitGrowth = function() {
  let hitGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.HitGrowth]) {
    hitGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.HitGrowth]);
  } else {
    const structure = /<hitGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note => {
      if (note.match(structure)) {
        hitGrowthPerLevel = parseFloat(RegExp.$1);
      }
    });
  }

  return parseFloat(((hitGrowthPerLevel * this.level) / 100).toFixed(2));
};

/**
 * Gets how much bonus GRD this actor has based on level.
 * @returns {number} The amount of growth in GRD for this actor.
 */
Game_Actor.prototype.grdGrowth = function() {
  let grdGrowthPerLevel = 0;
  if (this._meta && this._meta[J.BASE.Notetags.GuardGrowth]) {
    grdGrowthPerLevel = parseFloat(this._meta[J.BASE.Notetags.GuardGrowth]);
  } else {
    const structure = /<grdGrowth:[ ]?([.\d]+)>/i;
    this.actor().note.split(/[\r\n]+/).forEach(note => {
      if (note.match(structure)) {
        grdGrowthPerLevel = parseFloat(RegExp.$1);
      }
    });
  }

  return parseFloat(((grdGrowthPerLevel * this.level) / 100).toFixed(2));
};

/**
 * Gets the prepare time for this actor.
 * Actors are not gated by prepare times, only by post-action cooldowns.
 * @returns {number}
 */
 Game_Actor.prototype.prepareTime = function() {
  return 1;
};

/**
 * Gets the skill id for this actor.
 * Actors don't use this functionality, they have equipped skills instead.
 * @returns {null}
 */
Game_Actor.prototype.skillId = function() {
  return null;
};

/**
 * Gets the sight range for this actor.
 * Looks first to the class, then the actor for the tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.sightRange = function() {
  let val = Game_Battler.prototype.sightRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Sight]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Sight]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Sight]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
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
Game_Actor.prototype.alertedSightBoost = function() {
  let val = Game_Battler.prototype.alertedSightBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertSightBoost]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
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
Game_Actor.prototype.pursuitRange = function() {
  let val = Game_Battler.prototype.pursuitRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Pursuit]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Pursuit]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Pursuit]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
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
Game_Actor.prototype.alertedPursuitBoost = function() {
  let val = Game_Battler.prototype.alertedPursuitBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
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
Game_Actor.prototype.alertDuration = function() {
  let val = Game_Battler.prototype.alertDuration.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertDuration]) {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertDuration]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration]) {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertDuration]);
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the team id for this actor.
 * Actors are ALWAYS on team id of 0.
 * @returns {number}
 */
Game_Actor.prototype.teamId = function() {
  if (J.ABS) {
    return JABS_Battler.allyTeamId();
  }

  return 0;
};

/**
 * Gets the ai of the actor.
 * Though allies leverage ally ai for action decision making, this AI does
 * have one effect: how to move around and stuff throughout the phases.
 * @returns {null}
 */
Game_Actor.prototype.ai = function() {
  return new JABS_BattlerAI(true, true);
};

/**
 * Gets whether or not the actor can idle.
 * Actors can never idle.
 * @returns {boolean}
 */
Game_Actor.prototype.canIdle = function() {
  return false;
};

/**
 * Gets whether or not the actor's hp bar will show.
 * Actors never show their hp bar (they use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showHpBar = function() {
  return false;
};

/**
 * Gets whether or not the actor's danger indicator will show.
 * Danger indicator is not applicable to actors (since it is relative to the player).
 * @returns {boolean}
 */
Game_Actor.prototype.showDangerIndicator = function() {
  return false;
};

/**
 * Gets whether or not the actor's name will show below their character.
 * Actors never show their name (the use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showBattlerName = function() {
  return false;
};

/**
 * Gets whether or not the actor is invincible.
 * Actors are never invincible by this means.
 * @returns {boolean}
 */
Game_Actor.prototype.isInvincible = function() {
  return false;
};

/**
 * Gets whether or not the actor is inanimate.
 * Actors are never inanimate (duh).
 * @returns {boolean}
 */
Game_Actor.prototype.isInanimate = function() {
  return false;
};

/**
 * Gets the retaliation skill ids for this actor.
 * Will retrieve from actor, class, all equipment, and states.
 * @returns {JABS_SkillChance[]}
 */
Game_Actor.prototype.retaliationSkills = function() {
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * The underlying database data for this actor.
 * @returns {rm.types.Actor}
 */
Game_Actor.prototype.databaseData = function() {
  return this.actor();
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * The underlying database data for this battler.
 * 
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {rm.types.Enemy|rm.types.Actor}
 */
Game_Battler.prototype.databaseData = function() {
  return null;
};
/**
 * All battlers have a prepare time.
 * At this level, returns default 180 frames.
 * @returns {number}
 */
Game_Battler.prototype.prepareTime = function() {
  return 180;
};

/**
 * All battlers have a skill id for their basic attack.
 * At this level, returns the default skill id of 1.
 * @returns {number}
 */
Game_Battler.prototype.skillId = function() {
  return 1;
};

/**
 * All battlers have a default sight range.
 * @returns {number}
 */
Game_Battler.prototype.sightRange = function() {
  return 4;
};

/**
 * All battlers have a default alerted sight boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedSightBoost = function() {
  return 2;
};

/**
 * All battlers have a default pursuit range.
 * @returns {number}
 */
Game_Battler.prototype.pursuitRange = function() {
  return 6;
};

/**
 * All battlers have a default alerted pursuit boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedPursuitBoost = function() {
  return 4;
};

/**
 * All battlers have a default alert duration.
 * @returns {number}
 */
Game_Battler.prototype.alertDuration = function() {
  return 300;
};

/**
 * All battlers have a default team id.
 * At this level, the default team id is 1 (the default for enemies).
 * @returns {number}
 */
Game_Battler.prototype.teamId = function() {
  if (J.ABS) return JABS_Battler.enemyTeamId();

  return 1;
};

/**
 * All battlers have a default AI.
 * @returns {JABS_BattlerAI}
 */
Game_Battler.prototype.ai = function() {
  if (J.ABS) return new JABS_BattlerAI();

  return null;
};

/**
 * All battlers can idle by default.
 * @returns {boolean}
 */
Game_Battler.prototype.canIdle = function() {
  return true;
};

/**
 * All battlers will show their hp bar by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showHpBar = function() {
  return true;
};

/**
 * All battlers will show their danger indicator by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showDangerIndicator = function() {
  return true;
};

/**
 * All battlers will show their database name by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showBattlerName = function() {
  return true;
};

/**
 * All battlers can be invincible, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInvincible = function() {
  return false;
};

/**
 * All battlers can be inanimate, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInanimate = function() {
  return false;
};

/**
 * All battlers have a default of no retaliation skills.
 * @returns {JABS_SkillChance[]}
 */
Game_Battler.prototype.retaliationSkills = function() {
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+\])>/i;
  const objectsToCheck = this.getEverythingWithNotes();
  const skills = [];
  objectsToCheck.forEach(obj => {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * All battlers have a default of no on-own-defeat skill ids.
 * @returns {number[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function() {
  return [];
};

/**
 * All battlers have a default of no on-defeating-a-target skill ids.
 * @returns {number[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function() {
  return [];
};

/**
 * All battlers have this, but actors and enemies perform this function differently.
 * @returns {rm.types.BaseItem[]}
 */
Game_Battler.prototype.getEverythingWithNotes = function() {
  return [];
};

/**
 * Gets whether or not the aggro is locked for this battler.
 * Locked aggro means their aggro cannot be modified in any way.
 * @returns {boolean}
 */
Game_Battler.prototype.isAggroLocked = function() {
  return this.states().some(state => state._j.aggroLock);
};

/**
 * Gets the multiplier for received aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroInAmp = function() {
  let inAmp = 1.0;
  this.states().forEach(state => inAmp += state._j.aggroInAmp);
  return inAmp;
};

/**
 * Gets the multiplier for dealt aggro for this battler.
 * @returns {number}
 */
Game_Battler.prototype.aggroOutAmp = function() {
  let outAmp = 1.0;
  this.states().forEach(state => outAmp += state._j.aggroOutAmp);
  return outAmp;
};
//#endregion Game_Battler

//#region Game_Character
/**
 * Gets the `aiCode` for this character.
 * If no code is specified, return `10000000`.
 * @returns {string}
 */
Game_Character.prototype.aiCode = function() {
  let aiCode = "10000000";
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AiCode]) {
    aiCode = referenceData.meta[J.BASE.Notetags.AiCode] || aiCode;
  } else {
    const structure = /<ai:[ ]?([0|1]{8})>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        aiCode = RegExp.$1;
      }
    })
  }

  return aiCode;
};

/**
 * Gets the `battlerId` for this character.
 * If no id is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.battlerId = function() {
  let battlerId = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.BattlerId]) {
    // if its in the metadata, then grab it from there.
    battlerId = referenceData.meta[J.BASE.Notetags.BattlerId] || battlerId;
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<e:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        battlerId = RegExp.$1;
      }
    });
  }

  return parseInt(battlerId);
};

/**
 * Gets the `sightRange` for this character.
 * If no sight is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.sightRadius = function() {
  let sightRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight]) {
    sightRadius = referenceData.meta[J.BASE.Notetags.Sight] || sightRadius;
  } else {
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        sightRadius = RegExp.$1;
      }
    })
  }

  return parseInt(sightRadius);
};

/**
 * Gets the boost to `sightRange` for this character when alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedSightBoost = function() {
  let sightBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost]) {
    sightBoost = referenceData.meta[J.BASE.Notetags.AlertSightBoost] || sightBoost;
  } else {
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        sightBoost = RegExp.$1;
      }
    })
  }

  return parseInt(sightBoost);
};

/**
 * Gets the `pursuitRange` for this character.
 * If no pursuit is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.pursuitRadius = function() {
  let pursuitRadius = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit]) {
    pursuitRadius = referenceData.meta[J.BASE.Notetags.Pursuit] || pursuitRadius;
  } else {
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        pursuitRadius = RegExp.$1;
      }
    })
  }

  return parseInt(pursuitRadius);
};

/**
 * Gets the boost to `pursuitRange` for this character when alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedPursuitBoost = function() {
  let pursuitBoost = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]) {
    pursuitBoost = referenceData.meta[J.BASE.Notetags.AlertPursuitBoost] || pursuitBoost;
  } else {
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        pursuitBoost = RegExp.$1;
      }
    })
  }

  return parseInt(pursuitBoost);
};

/**
 * Gets the duration of which this battler will spend alerted.
 * @returns {number}
 */
Game_Character.prototype.alertedDuration = function() {
  let alertDuration = 300;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration]) {
    alertDuration = referenceData.meta[J.BASE.Notetags.AlertDuration] || alertDuration;
  } else {
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        alertDuration = RegExp.$1;
      }
    })
  }

  return parseInt(alertDuration);
};

/**
 * Gets the `pursuitRange` for this character.
 * If no pursuit is specified, return `0`.
 * @returns {number}
 */
Game_Character.prototype.customMoveSpeed = function() {
  let customMoveSpeed = 0;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.MoveSpeed]) {
    customMoveSpeed = referenceData.meta[J.BASE.Notetags.MoveSpeed] || customMoveSpeed;
  } else {
    const structure =/<ms:((0|([1-9][0-9]*))(\.[0-9]+)?)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        customMoveSpeed = RegExp.$1;
      }
    })
  }

  return parseFloat(customMoveSpeed);
};

/**
 * Gets the `idle` boolean for this battler.
 * `True` by default.
 * @returns {boolean}
 */
Game_Character.prototype.canIdle = function() {
  let canIdle = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoIdle]) {
    canIdle = false;
  } else {
    const structure =/<noIdle>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        canIdle = false;
      }
    })
  }

  if (this.isInanimate()) canIdle = false;
  return canIdle;
};

/**
 * Gets the boolean for whether or not to show the hp bar.
 * `True` by default.
 * @returns {boolean}
 */
Game_Character.prototype.showHpBar = function() {
  if (!(this instanceof Game_Event)) return false;

  let showHpBar = true;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoHpBar]) {
    showHpBar = false;
  } else {
    const structure =/<noHpBar>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        showHpBar = false;
      }
    })
  }

  if (this.isInanimate()) showHpBar = false;
  return showHpBar;
};

/**
 * Gets the boolean for whether or not this battler is invincible.
 * Invincible is defined as "not able to be collided with".
 * `False` by default.
 * @returns {boolean}
 */
Game_Character.prototype.isInvincible = function() {
  if (!(this instanceof Game_Event)) return;

  let invincible = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Invincible]) {
    invincible = true;
  } else {
    const structure =/<invincible>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        invincible = true;
      }
    })
  }

  return invincible;
};

/**
 * Gets the boolean for whether or not this is an inanimate object.
 * Inanimate objects have no hp bar, don't move idly, and cannot engage.
 * This is typically used for things like traps that perform actions.
 * `False` by default.
 * @returns {boolean}
 */
Game_Character.prototype.isInanimate = function() {
  if (!(this instanceof Game_Event)) return;

  let inanimate = false;
  const referenceData = this.event();

  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Inanimate]) {
    inanimate = true;
  } else {
    const structure =/<inanimate>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        inanimate = true;
      }
    })
  }

  return inanimate;
};
//#endregion Game_Character

//#region Game_Enemy
/**
 * Gets the enemy's level.
 * If no level is specified, return `0`.
 * @returns {number}
 */
Object.defineProperty(Game_Enemy.prototype, "level", {
  get() {
    let level = 0;

    const referenceData = $dataEnemies[this.enemyId()];
    if (referenceData.meta && referenceData.meta[J.BASE.Notetags.EnemyLevel]) {
      level = parseInt(referenceData.meta[J.BASE.Notetags.EnemyLevel]) || level;
    } else {
      const structure = /<level:[ ]?([0-9]*)>/i;
      const notedata = referenceData.note.split(/[\r\n]+/);
      notedata.forEach(note => {
        if (note.match(structure)) {
          level = RegExp.$1;
        }
      })
    }

    return parseInt(level);
  },
  configurable: true,
});

/**
 * Gets any additional drops from the notes of this particular enemy.
 * @returns {[string, number, number][]}
 */
Game_Enemy.prototype.extraDrops = function() {
  const referenceData = this.enemy();
  const dropList = [];
  const structure = /<drops:[ ]?\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)]>/i;
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(note => {
    if (note.match(structure)) {
      let kind = 0;
      switch (RegExp.$1) {
        case ("i" || "item"):
          kind = 1;
          break;
        case ("w" || "weapon"):
          kind = 2;
          break;
        case ("a" || "armor"):
          kind = 3;
          break;
      }

      const result = { 
        kind, 
        dataId: parseInt(RegExp.$2), 
        denominator: parseInt(RegExp.$3)
      };
      dropList.push(result);
    }
  });

  // if there is a panel that needs to be added to the list, then add it.
  const sdpDrop = this.needsSdpDrop();
  if (sdpDrop) dropList.push(sdpDrop);

  return dropList;
};

/**
 * Determines if there is an SDP to drop, and whether or not to drop it.
 * @returns {{kind, dataId, denominator}}
 */
Game_Enemy.prototype.needsSdpDrop = function() {
  // doesn't matter if we aren't even using the SDP system.
  if (!J.SDP) return null;

  const referenceData = this.enemy();
  const structure = /<sdpPanel:[ ]?"(.*?)":(\d+):(\d+)>/i;
  const notedata = referenceData.note.split(/[\r\n]+/);

  // get the panel key from this enemy if it exists.
  let panelKey = "";
  notedata.forEach(note => {
    if (note.match(structure)) {
      panelKey = RegExp.$1;
    }
  });

  // if we don't have a panel key, then give up.
  if (!panelKey) return null;

  // if a panel exists to be earned, but we already have it, then give up.
  const alreadyEarned = $gameSystem.getSdp(panelKey).isUnlocked();
  if (alreadyEarned) return null;

  // create the new drop based on the SDP.
  return {
    kind: 1, // all SDP drops are assumed to be "items".
    dataId: parseInt(RegExp.$2),
    denominator: parseInt(RegExp.$3)
  };
};

/**
 * Gets the amount of sdp points granted by this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.sdpPoints = function() {
  let points = 0;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.SdpPoints]) {
    // if its in the metadata, then grab it from there.
    points = referenceData.meta[J.BASE.Notetags.SdpPoints];
  } else {
    // if its not in the metadata, then check the notes proper.
    const structure = /<sdpPoints:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      if (note.match(structure)) {
        points = RegExp.$1;
      }
    })
  }

  return parseInt(points);
};

/**
 * Gets all skills that are executed by this enemy when it is defeated.
 * @returns {JABS_SkillChance}
 */
Game_Enemy.prototype.onOwnDefeatSkillIds = function() {
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets all skills that are executed by this enemy when it defeats its target.
 * @returns {JABS_SkillChance}
 */
Game_Enemy.prototype.onTargetDefeatSkillIds = function() {
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+\])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Converts all "actions" from an enemy into their collection of known skills.
 * @returns {rm.types.Skill[]}
 */
Game_Enemy.prototype.skills = function() {
  const actions = this.enemy().actions
    .map(action => $dataSkills[action.skillId]);
  const skillTraits = this.enemy().traits
    .filter(trait => trait.code === 35)
    .map(skillTrait => $dataSkills[skillTrait.dataId]);
  return actions
    .concat(skillTraits)
    .sort();
};

/**
 * Checks whether or not this enemy knows this skill.
 * @param skillId The id of the skill to check for.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasSkill = function(skillId) {
  return this.skills().includes($dataSkills[skillId]);
};

/**
 * Gets all objects with notes available to enemies.
 * @returns {rm.types.BaseItem[]}
 */
Game_Enemy.prototype.getEverythingWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.enemy());
  objectsWithNotes.push(...this.skills());
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * Gets all objects with notes available to enemies.
 * @returns {rm.types.BaseItem[]}
 */
Game_Enemy.prototype.getCurrentWithNotes = function() {
  const objectsWithNotes = [];
  objectsWithNotes.push(this.enemy());
  objectsWithNotes.push(...this.states());
  return objectsWithNotes;
};

/**
 * The underlying database data for this enemy.
 * @returns {rm.types.Enemy}
 */
 Game_Enemy.prototype.databaseData = function() {
  return this.enemy();
};
//#endregion Game_Enemy

//#region Game_Event
/**
 * Detects whether or not the event code is one that matches the "comment" code.
 * @param {number} code The code to match.
 * @returns {boolean}
 */
Game_Event.prototype.matchesControlCode = function(code) {
  return (code === 108 || code === 408);
};
//#endregion Game_Event
//ENDFILE