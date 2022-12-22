//region Game_Enemy
/**
 * Extends {@link Game_Enemy.setup}.
 * Includes JABS skill initialization.
 */
J.ABS.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
  // perform original logic.
  J.ABS.Aliased.Game_Enemy.get('setup').call(this, enemyId, x, y);

  // initialize the combat skills for the battler.
  this.initAbsSkills();

  // execute the first refresh for JABS-related things.
  this.jabsRefresh();
};

/**
 * Initializes the JABS equipped skills based on skill data from this enemy.
 */
Game_Enemy.prototype.initAbsSkills = function()
{
  this.getSkillSlotManager().setupSlots(this);
};

/**
 * Refreshes aspects associated with this battler in the context of JABS.
 */
Game_Enemy.prototype.jabsRefresh = function()
{
  // refresh the bonus hits to ensure they are still accurate.
  this.refreshBonusHits();
};

/**
 * Extends {@link #onBattlerDataChange}.
 * Adds a hook for performing actions when the battler's data hase changed.
 */
J.ABS.Aliased.Game_Enemy.set('onBattlerDataChange', Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Enemy.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.jabsRefresh();
};

//region JABS basic attack skills
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
//endregion JABS basic attack skills

//region JABS battler properties
/**
 * Gets the enemy's prepare time from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.prepareTime = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // find the trait that is for prepare time.
  const prepareTimeTrait = referenceData.traits.find(trait => trait.code === J.BASE.Traits.ATTACK_SPEED);

  // if we found a trait, prefer that first.
  if (prepareTimeTrait) return prepareTimeTrait.value;

  // grab the prepare time from the notes of the battler.
  const prepareFromNotes = referenceData.jabsPrepareTime;

  // if we found a note, prefer that second.
  if (prepareFromNotes) return prepareFromNotes;

  // if we don't have a trait or note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyPrepareTime;
};

/**
 * Gets the enemy's team id from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.teamId = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the team id from the battler.
  const teamId = referenceData.jabsTeamId;

  // if they don't have a team id tag, then return the default.
  if (!teamId) return JABS_Battler.enemyTeamId();

  // return the team id.
  return referenceData.jabsTeamId;
};

/**
 * Gets the enemy's ai from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {JABS_EnemyAI}
 */
Game_Enemy.prototype.ai = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the battler ai from the battler.
  const battlerAi = referenceData.jabsBattlerAi;

  // return what we found.
  return battlerAi;
};

/**
 * Gets the enemy's sight range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.sightRange = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the sight range from the notes of the battler.
  const sightRange = referenceData.jabsSightRange;

  // check if the sight range is a non-null value.
  if (sightRange !== null)
  {
    // return the parsed sight range.
    return sightRange;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemySightRange;
};

/**
 * Gets the enemy's boost to sight range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedSightBoost = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alerted sight boost from the notes of the battler.
  const alertedSightBoost = referenceData.jabsAlertedSightBoost;

  // check if the alerted sight boost is a non-null value.
  if (alertedSightBoost !== null)
  {
    // return the parsed alerted sight boost.
    return alertedSightBoost;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertedSightBoost;
};

/**
 * Gets the enemy's pursuit range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.pursuitRange = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the pursuit range from the notes of the battler.
  const pursuitRange = referenceData.jabsPursuitRange;

  // check if the pursuit range is a non-null value.
  if (pursuitRange !== null)
  {
    // return the parsed pursuit range.
    return pursuitRange;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyPursuitRange;
};

/**
 * Gets the enemy's boost to pursuit range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedPursuitBoost = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alerted pursuit boost from the notes of the battler.
  const alertedSightBoost = referenceData.jabsAlertedPursuitBoost;

  // check if the alerted pursuit boost is a non-null value.
  if (alertedSightBoost !== null)
  {
    // return the parsed alerted pursuit boost.
    return alertedSightBoost;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;
};

/**
 * Gets the enemy's duration for being alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertDuration = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // grab the alert duration from the notes of the battler.
  const alertDuration = referenceData.jabsAlertDuration;

  // check if the alert duration is a non-null value.
  if (alertDuration !== null)
  {
    // return the parsed alert duration.
    return alertDuration;
  }

  // if we don't have a note, then just return the default.
  return J.ABS.Metadata.DefaultEnemyAlertDuration
};

/**
 * Gets whether or not an enemy can idle about from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.canIdle = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to idle.
  const canIdle = referenceData.jabsConfigCanIdle;

  // if we found a non-null value, return it.
  if (canIdle !== null) return canIdle;

  // check if we are disallowed from idling.
  const cannotIdle = referenceData.jabsConfigNoIdle;

  // if we found a non-null value, return it.
  if (cannotIdle !== null) return cannotIdle;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyCanIdle;
};

/**
 * Gets whether or not an enemy has a visible hp bar from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showHpBar = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to show the hp bar.
  const showHpBar = referenceData.jabsConfigShowHpBar;

  // if we found a non-null value, return it.
  if (showHpBar !== null) return showHpBar;

  // check if we are disallowed from showing the hp bar.
  const noHpBar = referenceData.jabsConfigNoHpBar;

  // if we found a non-null value, return it.
  if (noHpBar !== null) return noHpBar;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyShowHpBar;
};

/**
 * Gets whether or not an enemy has a visible battler name from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showBattlerName = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are allowed to show the battler's name.
  const showName = referenceData.jabsConfigShowName;

  // if we found a non-null value, return it.
  if (showName !== null) return showName;

  // check if we are disallowed from showing the battler's name.
  const noName = referenceData.jabsConfigNoName;

  // if we found a non-null value, return it.
  if (noName !== null) return noName;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyShowBattlerName;
};

/**
 * Gets whether or not an enemy is invincible from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInvincible = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are enabling invincibility.
  const isInvincible = referenceData.jabsConfigInvincible;

  // if we found a non-null value, return it.
  if (isInvincible !== null) return isInvincible;

  // check if we are disabling invincibility.
  const notInvincible = referenceData.jabsConfigNotInvincible;

  // if we found a non-null value, return it.
  if (notInvincible !== null) return notInvincible;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyIsInvincible;
};

/**
 * Gets whether or not an enemy is inanimate from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInanimate = function()
{
  // grab the reference data for this battler.
  const referenceData = this.databaseData();

  // check if we are enabling invincibility.
  const isInanimate = referenceData.jabsConfigInanimate;

  // if we found a non-null value, return it.
  if (isInanimate !== null) return isInanimate;

  // check if we are disabling invincibility.
  const notInanimate = referenceData.jabsConfigNotInanimate;

  // if we found a non-null value, return it.
  if (notInanimate !== null) return notInanimate;

  // if we have no notes regarding this, then return the default.
  return J.ABS.Metadata.DefaultEnemyIsInanimate;
};
//endregion JABS battler properties

//region JABS bonus hits
/**
 * Gets all collections of sources that will be scanned for bonus hits.
 *
 * For enemies, this includes:
 *   - All applied states
 *   - The enemy's own data
 * @returns {RPG_BaseItem[][]}
 */
Game_Enemy.prototype.getBonusHitsSources = function()
{
  return [
    // states may contain bonus hits.
    this.states(),

    // the enemy itself may contain bonus hits.
    [this.databaseData()],
  ];
};
//endregion JABS bonus hits
//endregion Game_Enemy