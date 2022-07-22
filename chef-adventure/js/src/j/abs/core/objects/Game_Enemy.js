//#region Game_Enemy
J.ABS.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
  // perform original logic.
  J.ABS.Aliased.Game_Enemy.get('setup').call(this, enemyId, x, y);

  // initialize the combat skills for the battler.
  this.initAbsSkills();
};

/**
 * Initializes the JABS equipped skills based on skill data from this enemy.
 */
Game_Enemy.prototype.initAbsSkills = function()
{
  this.getSkillSlotManager().setupSlots(this);
};

/**
 * Gets the battler id of this enemy from the database.
 * @returns {number}
 */
Game_Enemy.prototype.battlerId = function()
{
  return this.enemyId();
};

/**
 * Gets the current number of bonus hits for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getBonusHits = function()
{
  let bonusHits = 0;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => bonusHits += obj.jabsBonusHits ?? 0);

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