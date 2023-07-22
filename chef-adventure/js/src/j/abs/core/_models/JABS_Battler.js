//region JABS_Battler
/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 */
function JABS_Battler()
{
  this.initialize(...arguments);
}

//region initialize battler
JABS_Battler.prototype = {};
JABS_Battler.prototype.constructor = JABS_Battler;

/**
 * Initializes this JABS battler.
 * @param {Game_Event} event The event the battler is bound to.
 * @param {Game_Actor|Game_Enemy} battler The battler data itself.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
 */
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData)
{
  /**
   * The character/sprite that represents this battler on the map.
   * @type {Game_Event|Game_Player|Game_Follower}
   */
  this._event = event;

  /**
   * The battler data that represents this battler's stats and information.
   * @type {Game_Actor|Game_Enemy}
   */
  this._battler = battler;

  /**
   * Whether or not the battler is hidden.
   * Hidden AI-controlled battlers (like enemies) will not take action, nor will they
   * be targetable.
   * @type {boolean}
   */
  this._hidden = false;
  this.initCoreData(battlerCoreData);
  this.initFromNotes();
  this.initGeneralInfo();
  this.initBattleInfo();
  this.initIdleInfo();
  this.initPoseInfo();
  this.initCooldowns();
};

/**
 * Initializes the battler's core data from the comments.
 * @param {JABS_BattlerCoreData} battlerCoreData
 */
JABS_Battler.prototype.initCoreData = function(battlerCoreData)
{
  /**
   * The id of the battler in the database.
   * @type {number}
   */
  this._battlerId = battlerCoreData.battlerId();

  /**
   * The team that this battler fights for.
   * @type {number}
   */
  this._team = battlerCoreData.team();

  /**
   * The distance this battler requires before it will engage with a non-allied target.
   * @type {number}
   */
  this._sightRadius = battlerCoreData.sightRange();

  /**
   * The boost this battler gains to their sight range while alerted.
   * @type {number}
   */
  this._alertedSightBoost = battlerCoreData.alertedSightBoost();

  /**
   * The distance this battler will allow for its target to be from itself before it disengages.
   * @type {number}
   */
  this._pursuitRadius = battlerCoreData.pursuitRange();

  /**
   * The boost this battler gains to their pursuit range while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = battlerCoreData.alertedPursuitBoost();

  /**
   * The duration in frames that this battler remains in an alerted state.
   * @type {number}
   */
  this._alertDuration = battlerCoreData.alertDuration();

  /**
   * The `JABS_EnemyAI` of this battler.
   * Only utilized by AI (duh).
   * @type {JABS_EnemyAI}
   */
  this._aiMode = battlerCoreData.ai();

  /**
   * Whether or not this battler is allowed to move around while idle.
   * @type {boolean}
   */
  this._canIdle = battlerCoreData.isInanimate()
    ? false // don't move idly if inanimate.
    : battlerCoreData.canIdle();

  /**
   * Whether or not this battler's hp bar is visible.
   * Inanimate battlers do not show their hp bar by default.
   * @type {boolean}
   */
  this._showHpBar = battlerCoreData.isInanimate()
    ? false // don't show hp bar if inanimate.
    : battlerCoreData.showHpBar();

  /**
   * Whether or not this battler's name is visible.
   * Inanimate battlers do not show their name by default.
   * @type {boolean}
   */
  this._showBattlerName = battlerCoreData.isInanimate()
    ? false // don't show battler name if inanimate.
    : battlerCoreData.showBattlerName();

  /**
   * Whether or not this battler is invincible, rendering them unable
   * to be collided with by map actions.
   * @type {boolean}
   */
  this._invincible = battlerCoreData.isInvincible();

  /**
   * Whether or not this battler is inanimate.
   * Inanimate battlers don't move, can't be alerted, and have no hp bar.
   * Ideal for destructibles like crates or traps.
   * @type {boolean}
   */
  this._inanimate = battlerCoreData.isInanimate();
};

/**
 * Initializes the properties of this battler that are directly derived from notes.
 */
JABS_Battler.prototype.initFromNotes = function()
{
  /**
   * The number of frames to fulfill the "prepare" phase of a battler's engagement.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareMax = this.getPrepareTime();
};

/**
 * Initializes the properties of this battler that are not related to anything in particular.
 */
JABS_Battler.prototype.initGeneralInfo = function()
{
  /**
   * Whether or not the movement for this battler is locked.
   * @type {boolean}
   */
  this._movementLock = false;

  /**
   * The timer that designates the "wait" for this battler.
   * While this timer is active, this battler will "wait" until it completes
   * before taking any action.
   * @type {JABS_Timer}
   */
  this._waitTimer = new JABS_Timer(0);

  /**
   * The timer that designates the duration between engagement updates.
   * This is not a publicly exposed timer, statically defined at 30 frames per update.
   *
   * This is because engagement calculations are the most expensive
   * update to perform on a per-frame basis by a longshot in the entirety of JABS
   * due to the number of mathematical distance calculations performed.
   * @type {JABS_Timer}
   */
  this._engagementTimer = new JABS_Timer(15);
};

/**
 * Initializes all properties that don't require input parameters.
 */
JABS_Battler.prototype.initBattleInfo = function()
{
  /**
   * The id of the last skill that was executed by this battler.
   * @type {number}
   */
  this._lastUsedSkillId = 0;

  /**
   * The key of the slot that was last performed.
   * @type {string}
   */
  this._lastUsedSlot = String.empty;

  /**
   * The current phase of AI battling that this battler is in.
   * Only utilized by AI.
   * @type {number}
   */
  this._phase = 1;

  /**
   * The counter for preparing an action to execute for the AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._prepareCounter = 0;

  /**
   * Whether or not this battler is finished with its "prepare" time and ready to
   * advance to phase 2 of combat.
   * @type {boolean}
   */
  this._prepareReady = false;

  /**
   * The counter for after a battler's action is executed.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldown = 0;

  /**
   * The number of frames a skill requires as cooldown when executed by AI.
   * Only utilized by AI.
   * @type {number}
   */
  this._postActionCooldownMax = 0;

  /**
   * Whether or not this battler is ready to return to it's prepare phase.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._postActionCooldownComplete = true;

  /**
   * The number of frames a skill requires prior to execution.
   * @type {number}
   */
  this._castTimeCountdown = 0;

  /**
   * Whether or not this battler is currently in a casting state.
   * @type {boolean}
   */
  this._casting = false;

  /**
   * Whether or not this battler is engaged in combat with a target.
   * @type {boolean}
   */
  this._engaged = false;

  /**
   * Whether or not this battler can actually engage with any targets.
   * @type {boolean}
   */
  this._engagementLock = false;

  /**
   * The targeted `JABS_Battler` that this battler is attempting to battle with.
   * @type {JABS_Battler}
   */
  this._target = null;

  /**
   * The `JABS_Battler` that was last hit by any action from this battler.
   * @type {JABS_Battler}
   */
  this._lastHit = null;

  /**
   * The targeted `JABS_Battler` that this battler is aiming to support.
   * @type {JABS_Battler}
   */
  this._allyTarget = null;

  /**
   * Whether or not this target is alerted. Alerted targets have an expanded
   * sight and pursuit range.
   * @type {boolean}
   */
  this._alerted = false;

  /**
   * The counter for managing alertedness.
   * @type {number}
   */
  this._alertedCounter = 0;

  /**
   * A snapshot of the coordinates of the battler who triggered the alert
   * at the time this battler was alerted.
   * @type {[number, number]}
   */
  this._alertedCoordinates = [0, 0];

  /**
   * Whether or not the battler is in position to execute an action.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._inPosition = false;

  /**
   * The action decided by this battler. Remains `null` until an action is selected
   * in combat.
   * Only utilized by AI.
   * @type {JABS_Action[]}
   */
  this._decidedAction = null;

  /**
   * A queue of actions pending execution from a designated leader.
   * @type {number|null}
   */
  this._leaderDecidedAction = null;

  /**
   * The `uuid` of the leader that is leading this battler.
   * This is only used for followers to prevent multiple leaders for commanding them.
   * @type {string}
   */
  this._leaderUuid = String.empty;

  /**
   * A collection of `uuid`s from all follower battlers this battler is leading.
   * If this battler's AI does not contain the "leader" trait, this is unused.
   * @type {string[]}
   */
  this._followers = [];

  /**
   * The counter that governs slip effects like regeneration or poison.
   * @type {number}
   */
  this._regenCounter = 1;

  /**
   * The distance in steps/tiles/squares that the dodge will move the battler.
   * @type {number}
   */
  this._dodgeSteps = 0;

  /**
   * Whether or not this battler is dodging.
   * @type {boolean}
   */
  this._dodging = false;

  /**
   * The direction of which this battler is dodging.
   * Always `0` until a dodge is executed.
   * @type {number}
   */
  this._dodgeDirection = 0;

  /**
   * Whether or not this battler is guarding.
   * @type {boolean}
   */
  this._isGuarding = false;

  /**
   * The flat amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardFlatReduction = 0;

  /**
   * The percent amount to reduce damage by when guarding.
   * @type {number}
   */
  this._guardPercReduction = 0;

  /**
   * The number of frames at the beginning of activating guarding where
   * the first hit will be parried instead.
   * @type {number}
   */
  this._parryWindow = 0;

  /**
   * The id of the skill to retaliate with when successfully precise-parrying.
   * @type {number[]}
   */
  this._counterParryIds = [];

  /**
   * The id of the skill to retaliate with when successfully guarding.
   * @type {number}
   */
  this._counterGuardIds = 0;

  /**
   * The id of the skill associated with the guard data.
   * @type {number}
   */
  this._guardSkillId = 0;

  /**
   * Whether or not this battler is in a state of dying.
   * @type {boolean}
   */
  this._dying = false;

  /**
   * All currently tracked battler's aggro for this battler.
   * @type {JABS_Aggro[]}
   */
  this._aggros = [];
};

/**
 * Initializes the properties of this battler that are related to idling/phase0.
 */
JABS_Battler.prototype.initIdleInfo = function()
{
  /**
   * The initial `x` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeX = this._event._x;

  /**
   * The initial `y` coordinate of where this battler was placed in the RMMZ editor or
   * was when the map was recreated (in the instance the RM user is leveraging a plugin that persists
   * event location after a map transfer).
   * @type {number}
   */
  this._homeY = this._event._y;

  /**
   * Whether or not this battler is identified as idle. Idle battlers are not
   * currently engaged, but instead executing their phase 0 movement pattern based on AI.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idle = true;

  /**
   * The counter for frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCount = 0;

  /**
   * The number of frames until this battler's idle action is ready.
   * Only utilized by AI.
   * @type {number}
   */
  this._idleActionCountMax = 30;

  /**
   * Whether or not the idle action is ready to execute.
   * Only utilized by AI.
   * @type {boolean}
   */
  this._idleActionReady = false;
};

/**
 * Initializes the properties of this battler that are related to the character posing.
 */
JABS_Battler.prototype.initPoseInfo = function()
{
  /**
   * The number of frames to pose for.
   * @type {number}
   */
  this._poseFrames = 0;

  /**
   * Whether or not this battler is currently posing.
   * @type {boolean}
   */
  this._posing = false;

  /**
   * The name of the file that contains this battler's character sprite (without extension).
   * @type {string}
   */
  this._baseSpriteImage = "";

  /**
   * The index of this battler's character sprite in the `_baseSpriteImage`.
   * @type {number}
   */
  this._baseSpriteIndex = 0;
  this.captureBaseSpriteInfo();
};

/**
 * Initializes the cooldowns for this battler.
 */
JABS_Battler.prototype.initCooldowns = function()
{
  // grab the battler for use.
  const battler = this.getBattler();

  // setup the skill slots for the enemy.
  battler.getSkillSlotManager().setupSlots(battler);
};
//endregion initialize battler

//region statics
/**
 * Generates a `JABS_Battler` based on the current leader of the party.
 * Also assigns the controller inputs for the player.
 */
JABS_Battler.createPlayer = function()
{
  // grab the leader of the party.
  const battler = $gameParty.leader();

  // if they are ready to be initialized, then do so.
  const actorId = battler ? battler.actorId() : 0;
  const coreData = new JABS_CoreDataBuilder(actorId)
    .isPlayer()
    .build();

  // return the created player.
  return new JABS_Battler($gamePlayer, battler, coreData);
};

// TODO: parameterize this on a per-enemy basis?
/**
 * If a battler is less than this distance from the target, they are considered "close".
 * @type {number}
 */
JABS_Battler.closeDistance = 3.0;

/**
 * If a battler is more than this distance from the target, they are considered "far".
 * @type {number}
 */
JABS_Battler.farDistance = 5.0;

/**
 * Determines if the battler is close to the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isClose = function(distance)
{
  return distance <= JABS_Battler.closeDistance;
};

/**
 * Determines if the battler is at a safe range from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isSafe = function(distance)
{
  return (distance > JABS_Battler.closeDistance) && (distance <= JABS_Battler.farDistance);
};

/**
 * Determines if the battler is far away from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isFar = function(distance)
{
  return distance > JABS_Battler.farDistance;
};

/**
 * Determines whether or not the skill id is a guard-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.isGuardSkillById = function(id)
{
  // if there is no id to check, then it is not a dodge skill.
  if (!id) return false;

  // if the skill type is not "guard skill", then this is not a guard skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.GuardSkillTypeId) return false;

  // its a guard skill!
  return true;
};

/**
 * Determines whether or not the skill id is a dodge-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean} True if it is a dodge skill, false otherwise.
 */
JABS_Battler.isDodgeSkillById = function(id)
{
  // if there is no id to check, then it is not a dodge skill.
  if (!id) return false;

  // if the skill type is not "dodge skill", then this is not a dodge skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.DodgeSkillTypeId) return false;

  // its a dodge skill!
  return true;
};

/**
 * Determines whether or not the skill id is a weapon-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean}
 */
JABS_Battler.isWeaponSkillById = function(id)
{
  // if there is no id to check, then it is not a weapon skill.
  if (!id) return false;

  // if the skill type is not "weapon skill", then this is not a weapon skill.
  if ($dataSkills[id].stypeId !== J.ABS.DefaultValues.WeaponSkillTypeId) return false;

  // its a weapon skill!
  return true;
};


/**
 * Determines whether or not a skill should be visible
 * in the jabs combat skill assignment menu.
 * @param skill {RPG_Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInCombatMenu = function(skill)
{
  // invalid skills are not visible in the combat skill menu.
  if (!skill) return false;

  // explicitly hidden skills are not visible in the combat skill menu.
  if (skill.metaAsBoolean("hideFromJabsMenu")) return false;

  // dodge skills are not visible in the combat skill menu.
  if (JABS_Battler.isDodgeSkillById(skill.id)) return false;

  // guard skills are not visible in the combat skill menu.
  if (JABS_Battler.isGuardSkillById(skill.id)) return false;

  // weapon skills are not visible in the combat skill menu.
  if (JABS_Battler.isWeaponSkillById(skill.id)) return false;

  // show this skill!
  return true;
};

/**
 * Determines whether or not a skill should be visible
 * in the jabs dodge skill assignment menu.
 * @param skill {RPG_Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInDodgeMenu = function(skill)
{
  // invalid skills are not visible in the dodge menu.
  if (!skill) return false;

  // explicitly hidden skills are not visible in the dodge menu.
  if (skill.metaAsBoolean("hideFromJabsMenu")) return false;

  // non-dodge skills are not visible in the dodge menu.
  if (!JABS_Battler.isDodgeSkillById(skill.id)) return false;

  // show this skill!
  return true;
};

/**
 * Determines whether or not an item should be visible
 * in the JABS tool assignment menu.
 * @param {RPG_Item} item The item to check if should be visible.
 * @returns {boolean}
 */
JABS_Battler.isItemVisibleInToolMenu = function(item)
{
  // invalid items are not visible in the item menu.
  if (!item) return false;

  // explicitly hidden items are not visible in the item menu.
  if (item.metaAsBoolean("hideFromJabsMenu")) return false;

  // non-items or non-always-occasion items are not visible in the item menu.
  const isItem = DataManager.isItem(item) && item.itypeId === 1;
  const isUsable = isItem && (item.occasion === 0);
  if (!isItem || !isUsable) return false;

  // show this item!
  return true;
};

/**
 * Gets the team id for allies, including the player.
 * @returns {0}
 */
JABS_Battler.allyTeamId = function()
{
  return 0;
};

/**
 * Gets the team id for enemies.
 * @returns {1}
 */
JABS_Battler.enemyTeamId = function()
{
  return 1;
};

/**
 * Gets the team id for neutral parties.
 * @returns {2}
 */
JABS_Battler.neutralTeamId = function()
{
  return 2;
};

/**
 * Gets the distance that allies are detected and can extend away from the player.
 * @returns {number}
 */
JABS_Battler.allyRubberbandRange = function()
{
  return parseFloat(10 + J.ABS.Metadata.AllyRubberbandAdjustment);
};
//endregion statics

//region updates
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function()
{
  // don't update map battlers if JABS is disabled.
  if (!$jabsEngine.absEnabled) return;

  this.updatePoseEffects();
  this.updateCooldowns();
  this.updateTimers();
  this.updateEngagement();
  this.updateRG();
  this.updateDodging();
  this.updateDeathHandling();
};

//region queued player actions
/**
 * Process any queued actions and execute them.
 */
JABS_Battler.prototype.processQueuedActions = function()
{
  // if we cannot process actions, then do not.
  if (!this.canProcessQueuedActions()) return;

  // gather the most recent decided action.
  const decidedActions = this.getDecidedAction();

  // execute the action.
  $jabsEngine.executeMapActions(this, decidedActions);

  // determine the core action associated with the action collection.
  const lastUsedSkill = decidedActions.at(0);

  // set the last skill used to be the skill we just used.
  this.setLastUsedSkillId(lastUsedSkill.getBaseSkill().id);

  // set the last slot used to be the slot of the skill we just used.
  this.setLastUsedSlot(lastUsedSkill.getCooldownType());

  // clear the queued action.
  this.clearDecidedAction();
};

/**
 * Check if we can process any queued actions.
 * @returns {boolean}
 */
JABS_Battler.prototype.canProcessQueuedActions = function()
{
  // check if we have an action decided.
  if (!this.isActionDecided()) return false;

  // check if we're still casting actions.
  if (this.isCasting()) return false;

  // validate that non-players are in-position.
  if (!this.isPlayer() && !this.isInPosition()) return false;

  // we can process all the actions!
  return true;
};
//endregion queued player actions

//region update pose effects
/**
 * Update all character sprite animations executing on this battler.
 */
JABS_Battler.prototype.updatePoseEffects = function()
{
  // if we cannot update pose effects, then do not.
  if (!this.canUpdatePoseEffects()) return;

  // countdown the timer for posing.
  this.countdownPoseTimer();

  // manage the actual adjustments to the character's pose pattern.
  this.handlePosePattern();
};

/**
 * Determines whether or not this battler can update its own pose effects.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdatePoseEffects = function()
{
  // we need to be currently animating in order to update animations.
  if (!this.isPosing()) return false;

  // update animations!
  return true;
};

/**
 * Gets whether or not this battler is currently posing.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPosing = function()
{
  return this._posing;
};

/**
 * Counts down the pose animation frames and manages the pose pattern.
 */
JABS_Battler.prototype.countdownPoseTimer = function()
{
  // if guarding, then do not countdown the pose frames.
  if (this.guarding()) return;

  // check if we are still posing.
  if (this._poseFrames > 0)
  {
    // decrement the pose frames.
    this._poseFrames--;
  }
};

/**
 * Manages whether or not this battler is posing based on pose frames.
 */
JABS_Battler.prototype.handlePosePattern = function()
{
  // check if we are still posing.
  if (this._poseFrames > 0)
  {
    // manage the current pose pattern based on the animation frame count.
    this.managePosePattern();
  }
  // we are done posing now.
  else
  {
    // reset the pose back to default.
    this.resetAnimation();
  }
};

/**
 * Watches the current pose frames and adjusts the pose pattern accordingly.
 */
JABS_Battler.prototype.managePosePattern = function()
{
  // if the battler has 4 or less frames left.
  if (this._poseFrames < 4)
  {
    // set the pose pattern to 0, the left side.
    this.setPosePattern(0);
  }
  // check fi the battler has more than 10 frames left.
  else if (this._poseFrames > 10)
  {
    // set the pose pattern to 2, the right side.
    this.setPosePattern(2);
  }
  // the battler is between 5-9 pose frames.
  else
  {
    // set the pose pattern to 1, the middle.
    this.setPosePattern(1);
  }
};

/**
 * Sets this battler's underlying character's pose pattern.
 * @param {number} pattern The pattern to set for this character.
 */
JABS_Battler.prototype.setPosePattern = function(pattern)
{
  this.getCharacter()._pattern = pattern;
};
//endregion update pose effects

//region update cooldowns
/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function()
{
  this.getBattler().getSkillSlotManager().updateCooldowns();
};
//endregion update cooldowns

//region update timers
/**
 * Updates all timers for this battler.
 */
JABS_Battler.prototype.updateTimers = function()
{
  this.processWaitTimer();
  this.processAlertTimer();
  this.processParryTimer();
  this.processLastHitTimer();
  this.processCastingTimer();
  this.processEngagementTimer();
};

/**
 * Updates the timer for "waiting".
 */
JABS_Battler.prototype.processWaitTimer = function()
{
  this._waitTimer.update();
};

/**
 * Updates the timer for "alerted".
 */
JABS_Battler.prototype.processAlertTimer = function()
{
  // if alerted, update the alert timer.
  if (this.isAlerted())
  {
    this.countdownAlert();
  }
};

/**
 * Updates the timer for "parrying".
 */
JABS_Battler.prototype.processParryTimer = function()
{
  // if parrying, update the parry timer.
  if (this.parrying())
  {
    this.getCharacter().requestAnimation(131, false);
    this.countdownParryWindow();
  }
};

/**
 * Updates the timer for "last hit".
 */
JABS_Battler.prototype.processLastHitTimer = function()
{
  // if this battler has a last hit, update the last hit timer.
  if (this.hasBattlerLastHit())
  {
    this.countdownLastHit();
  }
};

/**
 * Updates the timer for "casting".
 */
JABS_Battler.prototype.processCastingTimer = function()
{
  // if casting, update the cast timer.
  if (this.isCasting())
  {
    this.countdownCastTime();
  }
};

/**
 * Updates the timer for "engagement".
 *
 * This is an important timer that prevents recalculating distances for all
 * battlers on the map every frame.
 */
JABS_Battler.prototype.processEngagementTimer = function()
{
  this._engagementTimer.update();
};
//endregion update timers

//region update engagement
/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function()
{
  // ai engagement is blocked for players and while the game is paused.
  if (!this.canUpdateEngagement()) return;

  // grab the nearest target to this battler.
  const target = JABS_AiManager.getClosestOpposingBattler(this);

  // if we're unable to engage the target, do not engage.
  if (!this.canEngageTarget(target)) return;

  // determine the distance to the target from this battler.
  const distance = this.distanceToDesignatedTarget(target);

  // process engagement handling.
  this.handleEngagement(target, distance);

  // reset the engagement timer.
  this._engagementTimer.reset();
};

/**
 * If this battler is the player, a hidden battler, an inanimate battler, or the abs is paused, then
 * prevent engagement updates.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateEngagement = function()
{
  // if JABS is paused, we do not update engagement.
  if ($jabsEngine.absPause) return false;

  // the player cannot engage.
  if (this.isPlayer()) return false;

  // inanimate battlers cannot engage.
  if (this.isInanimate()) return false;

  // if the engagement timer is not ready, we cannot update.
  if (!this._engagementTimer.isTimerComplete()) return false;

  // if we're already engaged, no need to further update engagement- its confusing.
  if (this.isEngaged()) return false;

  // if we are unable to alter engagement, don't update engagement.
  if (this.isEngagementLocked()) return false;

  // engage!
  return true;
};

/**
 * Determines if this battler can engage the given target.
 * @param {JABS_Battler} target The potential target to engage.
 * @returns {boolean} True if we can engage this target, false otherwise.
 */
JABS_Battler.prototype.canEngageTarget = function(target)
{
  // you cannot engage with nothing.
  if (!target) return false;

  // you cannot engage with yourself.
  if (target.getUuid() === this.getUuid()) return false;

  // engage!
  return true;
};

/**
 * Process the engagement with the given target and distance.
 * @param {JABS_Battler} target The target in question for engagement.
 * @param {number} distance The distance between this battler and the target.
 */
JABS_Battler.prototype.handleEngagement = function(target, distance)
{
  // check if we're already engaged.
  if (this.isEngaged())
  {
    // if engaged already, check if maybe we should now disengage.
    if (this.shouldDisengage(target, distance))
    {
      // disengage combat with the target.
      this.disengageTarget();
    }
  }
  // we aren't engaged yet.
  else
  {
    // check if we should now engage this target based on the given distance.
    if (this.shouldEngage(target, distance))
    {
      // engage in combat with the target.
      this.engageTarget(target);
    }
  }
};

/**
 * Determines whether or not this battler should disengage from it's target.
 * @param {JABS_Battler} target The target to potentially disengage from.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldDisengage = function(target, distance)
{
  // check if we're out of pursuit range with this target.
  const isOutOfRange = !this.inPursuitRange(target, distance);

  // return the findings.
  return isOutOfRange;
};

/**
 * Determines whether or not this battler should engage to the nearest target.
 * @param {JABS_Battler} target The target to potentially engage.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  // check if we're in range of sight with the target.
  const isInSightRange = this.inSightRange(target, distance);

  // return the findings.
  return isInSightRange;
};
//endregion update engagement

//region update dodging
/**
 * Updates the dodge skill.
 */
JABS_Battler.prototype.updateDodging = function()
{
  // if we cannot update dodge, do not.
  if (!this.canUpdateDodge()) return;

  // cancel the dodge if we got locked down.
  this.handleDodgeCancel();

  // force dodge move while dodging.
  this.handleDodgeMovement();

  // if the dodge is over, end the dodging.
  this.handleDodgeEnd();
};

/**
 * Determine whether or not this battler can update its dodging.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateDodge = function()
{
  // if we are not a player, we cannot dodge.
  if (!this.isPlayer()) return false;

  // we can dodge!
  return true;
};

/**
 * Handles the ending of dodging if the battler is interrupted.
 */
JABS_Battler.prototype.handleDodgeCancel = function()
{
  // check if we really should cancel dodging.
  if (!this.shouldCancelDodge()) return;

  // end the dodging.
  this.endDodge();
};

/**
 * Checks if we should cancel the dodge.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldCancelDodge = function()
{
  // if the battler cannot move, then we should cancel dodging.
  if (!this.canBattlerMove()) return true;

  // nothing is canceling the dodge.
  return false;
};

/**
 * Handles the forced movement while dodging.
 */
JABS_Battler.prototype.handleDodgeMovement = function()
{
  // if we cannot dodge move, do not.
  if (!this.canDodgeMove()) return;

  // perform the movement.
  this.executeDodgeMovement();
};

/**
 * Determines whether or not this character can be forced to dodge move.
 * @returns {boolean}
 */
JABS_Battler.prototype.canDodgeMove = function()
{
  // if the character is currently moving, don't dodge move.
  if (this.getCharacter().isMoving()) return false;

  // if the battler cannot move, don't dodge move.
  if (!this.canBattlerMove()) return false;

  // if we are out of dodge steps, don't dodge move.
  if (this.getDodgeSteps() <= 0) return false;

  // if we are not dodging, don't dodge move.
  if (!this.isDodging()) return false;

  // we can dodge move!
  return true;
};

/**
 * Performs the forced dodge movement in the direction of the dodge.
 */
JABS_Battler.prototype.executeDodgeMovement = function()
{
  // move the character.
  this.getCharacter().moveStraight(this._dodgeDirection);

  // reduce the dodge steps.
  this._dodgeSteps--;
};

/**
 * Handles the conclusion of the dodging if necessary.
 */
JABS_Battler.prototype.handleDodgeEnd = function()
{
  // check if we even should end the dodge.
  if (!this.shouldEndDodge()) return;

  // conclude the dodge.
  this.endDodge();
};

/**
 * Determines wehether or not to end the dodging.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEndDodge = function()
{
  // if we are out of dodge steps and we're done moving, end the dodge.
  if (this.getDodgeSteps() <= 0 && !this.getCharacter().isMoving()) return true;

  // KEEP DODGING.
  return false;
};

/**
 * Stops the dodge and resets the values to default.
 */
JABS_Battler.prototype.endDodge = function()
{
  // stop the dodge.
  this.setDodging(false);

  // set dodge steps to 0 regardless of what they are.
  this.setDodgeSteps(0);

  // disable the invincibility from dodging.
  this.setInvincible(false);
};
//endregion update dodging

//region update death handling
/**
 * Handles when this enemy battler is dying.
 */
JABS_Battler.prototype.updateDeathHandling = function()
{
  // don't do this for actors/players.
  if (this.isActor()) return;

  // do nothing if we are waiting.
  if (this.isWaiting()) return;

  // if the event is erased officially, ignore it.
  if (this.getCharacter().isErased()) return;

  // if we are dying, self-destruct.
  if (this.isDying() && !$gameMap.isEventRunning())
  {
    this.destroy();
  }
};
//endregion update death handling
//endregion updates

//region update helpers
//region timers
/**
 * Sets the battler's wait duration to a number. If this number is greater than
 * zero, then the battler must wait before doing anything else.
 * @param {number} wait The duration for this battler to wait.
 */
JABS_Battler.prototype.setWaitCountdown = function(wait)
{
  // reset the wait timer to start over.
  this._waitTimer.reset();

  // set the wait timer's max to a new time.
  this._waitTimer.setMaxTime(wait);
};

/**
 * Gets whether or not this battler is currently waiting.
 * @returns {boolean} True if waiting, false otherwise.
 */
JABS_Battler.prototype.isWaiting = function()
{
  return !this._waitTimer.isTimerComplete();
};

/**
 * Counts down the duration for this battler's cast time.
 */
JABS_Battler.prototype.countdownCastTime = function()
{
  this.performCastAnimation();
  if (this._castTimeCountdown > 0)
  {
    this._castTimeCountdown--;
    return;
  }

  if (this._castTimeCountdown <= 0)
  {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * Performs the cast animation if possible on this battler.
 */
JABS_Battler.prototype.performCastAnimation = function()
{
  // check if we can perform a cast animation.
  if (!this.canPerformCastAnimation()) return;

  // get the cast animation id.
  const animationId = this.getDecidedAction()[0].getCastAnimation();

  // show the animation.
  this.showAnimation(animationId);
};

/**
 * Determines whether or not we can perform a cast animation.
 * @returns {boolean}
 */
JABS_Battler.prototype.canPerformCastAnimation = function()
{
  // if we don't have a decided action somehow, then don't do cast animation things.
  if (!this.getDecidedAction()) return false;

  // if we don't have a cast animation, then don't do cast animation things.
  if (!this.getDecidedAction()[0].getCastAnimation()) return false;

  // don't show casting animations while other animations are playing on you.
  if (this.isShowingAnimation()) return false;

  // show cast animations!
  return true;
};

/**
 * Sets the cast time duration to a number. If this number is greater than
 * zero, then the battler must spend this duration in frames casting before
 * executing the skill.
 * @param {number} castTime The duration in frames to spend casting.
 */
JABS_Battler.prototype.setCastCountdown = function(castTime)
{
  this._castTimeCountdown = castTime;
  if (this._castTimeCountdown > 0)
  {
    this._casting = true;
  }

  if (this._castTimeCountdown <= 0)
  {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * Gets whether or not this battler is currently casting a skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isCasting = function()
{
  return this._casting;
};

/**
 * Counts down the alertedness of this battler.
 */
JABS_Battler.prototype.countdownAlert = function()
{
  if (this._alertedCounter > 0)
  {
    this._alertedCounter--;
    return;
  }

  if (this._alertedCounter <= 0)
  {
    this.clearAlert();
  }
};

/**
 * Removes and clears the alert state from this battler.
 */
JABS_Battler.prototype.clearAlert = function()
{
  this.setAlerted(false);
  this._alertedCounter = 0;
  // if (!this.isEngaged())
  // {
  //   this.showBalloon(J.ABS.Balloons.Silence);
  // }
};
//endregion timers

//region dodging
/**
 * Gets whether or not this battler is dodging.
 * @returns {boolean} True if currently dodging, false otherwise.
 */
JABS_Battler.prototype.isDodging = function()
{
  return this._dodging;
};

/**
 * Sets whether or not this battler is dodging.
 * @param {boolean} dodging Whether or not the battler is dodging (default = true).
 */
JABS_Battler.prototype.setDodging = function(dodging)
{
  this._dodging = dodging;
};

/**
 * Sets the direction that the battler will be moved when dodging.
 * @param {2|4|6|8|1|3|7|9} direction The numeric direction to be moved.
 */
JABS_Battler.prototype.setDodgeDirection = function(direction)
{
  this._dodgeDirection = direction;
};

/**
 * Gets the number of dodge steps remaining to be stepped whilst dodging.
 * @returns {number}
 */
JABS_Battler.prototype.getDodgeSteps = function()
{
  return this._dodgeSteps;
};

/**
 * Sets the number of steps that will be force-moved when dodging.
 * @param {number} stepCount The number of steps to dodge.
 */
JABS_Battler.prototype.setDodgeSteps = function(stepCount)
{
  this._dodgeSteps = stepCount;
};

/**
 * Tries to execute the battler's dodge skill.
 * Checks to see if costs are payable before executing.
 */
JABS_Battler.prototype.tryDodgeSkill = function()
{
  // grab the battler.
  const battler = this.getBattler();

  // grab the skill id for the dodge slot.
  const skillId = battler.getEquippedSkillId(JABS_Button.Dodge);

  // if we have no skill id in the dodge slot, then do not dodge.
  if (!skillId) return;

  // grab the skill for the given dodge skill id.
  const skill = this.getSkill(skillId);

  // determine if it can be paid.
  const canPay = battler.canPaySkillCost(skill);

  // check if the user can pay the cost and if there is a move type available.
  if (canPay && skill.jabsMoveType)
  {
    // execute the skill in the dodge slot.
    this.executeDodgeSkill(skill);
  }
};

/**
 * Executes the provided dodge skill.
 * @param {RPG_Skill} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill)
{
  // change over to the action pose for the skill.
  this.performActionPose(skill);

  // trigger invincibility for dodging if applicable.
  this.setInvincible(skill.jabsInvincibleDodge);

  // increase the move speed while dodging to give the illusion of "dodge-rolling".
  // TODO: get dodge modifier from skill.
  const dodgeSpeedBonus = 2;
  this.getCharacter().setDodgeModifier(dodgeSpeedBonus);

  // set the number of steps this dodge will roll you.
  this.setDodgeSteps(skill.jabsRadius);

  // set the direction to be dodging in (front/back/specified).
  const dodgeDirection = this.determineDodgeDirection(skill.jabsMoveType);
  this.setDodgeDirection(dodgeDirection);

  // pay whatever costs are associated with the skill.
  this.getBattler().paySkillCost(skill);

  // apply the cooldowns for the dodge.
  this.modCooldownCounter(JABS_Button.Dodge, skill.jabsCooldown);

  // trigger the dodge!
  this.setDodging(true);
};

/**
 * Translates a dodge skill type into a direction to move.
 * @param {string} moveType The type of dodge skill the player is using.
 */
JABS_Battler.prototype.determineDodgeDirection = function(moveType)
{
  const player = this.getCharacter();
  let direction;
  switch (moveType)
  {
    case J.ABS.Notetags.MoveType.Forward:
      direction = player.direction();
      break;
    case J.ABS.Notetags.MoveType.Backward:
      direction = player.reverseDir(player.direction());
      break;
    case J.ABS.Notetags.MoveType.Directional:
      if (Input.isPressed("up"))
      {
        direction = J.ABS.Directions.UP;
      }
      else if (Input.isPressed("right"))
      {
        direction = J.ABS.Directions.RIGHT;
      }
      else if (Input.isPressed("left"))
      {
        direction = J.ABS.Directions.LEFT;
      }
      else if (Input.isPressed("down"))
      {
        direction = J.ABS.Directions.DOWN;
      }
      else
      {
        direction = player.direction();
      }
      break;
    default:
      direction = player.direction();
      break;
  }

  return direction;
};
//endregion dodging

//region regeneration
/**
 * Updates all regenerations and ticks four times per second.
 */
JABS_Battler.prototype.updateRG = function()
{
  // check if we are able to update the RG.
  if (!this.canUpdateRG()) return;

  //
  this.performRegeneration();
  this.setRegenCounter(15);
};

JABS_Battler.prototype.canUpdateRG = function()
{
  // check if the regen is even ready for this battler.
  if (!this.isRegenReady()) return false;

  // if its ready but
  if (this.getBattler().isDead()) return false;

  return true;
};

/**
 * Whether or not the regen tick is ready.
 * @returns {boolean} True if its time for a regen tick, false otherwise.
 */
JABS_Battler.prototype.isRegenReady = function()
{
  if (this._regenCounter <= 0)
  {
    this.setRegenCounter(0);
    return true;
  }

  this._regenCounter--;
  return false;
};

/**
 * Gets the current count on the regen counter.
 * @returns {number}
 */
JABS_Battler.prototype.getRegenCounter = function()
{
  return this._regenCounter;
};

/**
 * Sets the regen counter to a given number.
 * @param {number} count The count to set the regen counter to.
 */
JABS_Battler.prototype.setRegenCounter = function(count)
{
  this._regenCounter = count;
};

/**
 * Performs the full suite of possible regenerations handled by JABS.
 *
 * This includes both natural and tag/state-driven regenerations.
 */
JABS_Battler.prototype.performRegeneration = function()
{
  // if we have no battler, don't bother.
  const battler = this.getBattler();
  if (!battler) return;

  // handle our natural rgs since we have a battler.
  this.processNaturalRegens();

  // if we have no states, don't bother.
  let states = battler.allStates();
  if (!states.length) return;

  // clean-up all the states that are somehow applied but not tracked.
  states = states.filter(this.shouldProcessState, this);

  // handle all the tag-specific hp/mp/tp regenerations.
  this.processStateRegens(states);
};

/**
 * Processes the natural regeneration of this battler.
 *
 * This includes all HRG/MRG/TRG derived from any extraneous source.
 */
JABS_Battler.prototype.processNaturalRegens = function()
{
  this.processNaturalHpRegen();
  this.processNaturalMpRegen();
  this.processNaturalTpRegen();
};

/**
 * Processes the natural HRG for this battler.
 */
JABS_Battler.prototype.processNaturalHpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regenerate.
  if (battler.hp < battler.mhp)
  {
    // extract the regens rates.
    const { hrg, rec } = battler;

    // calculate the bonus.
    const naturalHp5 = ((hrg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainHp(naturalHp5);
  }
};

/**
 * Processes the natural MRG for this battler.
 */
JABS_Battler.prototype.processNaturalMpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regnerate.
  if (battler.mp < battler.mmp)
  {
    // extract the regens rates.
    const { mrg, rec } = battler;

    // calculate the bonus.
    const naturalMp5 = ((mrg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainMp(naturalMp5);
  }
};

/**
 * Processes the natural TRG for this battler.
 */
JABS_Battler.prototype.processNaturalTpRegen = function()
{
  // shorthand the battler.
  const battler = this.getBattler();

  // check if we need to regenerate.
  if (battler.tp < battler.maxTp())
  {
    // extract the regens rates.
    const { trg, rec } = battler;

    // calculate the bonus.
    const naturalTp5 = ((trg * 100) * 0.05) * rec;

    // execute the gain.
    battler.gainTp(naturalTp5);
  }
};

/**
 * Processes all regenerations derived from state tags.
 * @param {RPG_State[]} states The filtered list of states to parse.
 */
JABS_Battler.prototype.processStateRegens = function(states)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default the regenerations to the battler's innate regens.
  const { rec } = battler;
  const regens = [0, 0, 0];

  // process each state for slip actions.
  for (const state of states)
  {
    // add the per-five hp slip.
    regens[0] += this.stateSlipHp(state);

    // add the per-five mp slip.
    regens[1] += this.stateSlipMp(state);

    // add the per-five tp slip.
    regens[2] += this.stateSlipTp(state);
  }

  // iterate over the above regens.
  regens.forEach((regen, index) =>
  {
    // if it wasn't modified, don't worry about it.
    if (!regen)
    {
      return;
    }

    // apply REC effects against all three regens.
    if (regen > 0)
    {
      regen *= rec;
    }

    // apply "per5" rate- 4 times per second, for 5 seconds, equals 20.
    regen /= 20;


    // if we have a non-zero amount, generate the popup.
    if (regen)
    {
      this.applySlipEffect(regen, index);

      // flip the sign for the regen for properly creating pops.
      regen *= -1;

      // generate the textpop.
      this.generatePopSlip(regen, index);
    }
  });
};

/**
 * Determines if a state should be processed or not for slip effects.
 * @param {RPG_State} state The state to check if needing processing.
 * @returns {boolean} True if we should process this state, false otherwise.
 */
JABS_Battler.prototype.shouldProcessState = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // grab the state we're working with.
  const trackedState = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), state.id);

  // validate the state exists.
  if (!trackedState)
  {
    // untracked states could be passive states the battler is owning.
    if (battler.isPassiveState(state.id)) return true;

    // when loading a file that was saved with a state, we encounter a weird issue
    // where the state is still on the battler but not in temporary memory as a
    // JABS tracked state. In this case, we remove it.
    battler.removeState(state.id);
    return false;
  }

  // don't process states if they have no metadata.
  // the RG from states is a part of the base, now.
  if (!state.meta) return false;

  return true;
};

/**
 * Processes a single state and returns its tag-based hp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The hp regen from this state.
 */
JABS_Battler.prototype.stateSlipHp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // the running total of the hp-per-5 amount from states.
  let tagHp5 = 0;

  // deconstruct the data out of the state.
  const {
    jabsSlipHpFlatPerFive: hpPerFiveFlat,
    jabsSlipHpPercentPerFive: hpPerFivePercent,
    jabsSlipHpFormulaPerFive: hpPerFiveFormula,
  } = state;

  // if the flat tag exists, use it.
  tagHp5 += hpPerFiveFlat;

  // if the percent tag exists, use it.
  tagHp5 += battler.mhp * (hpPerFivePercent / 100);

  // if the formula tag exists, use it.
  if (hpPerFiveFormula)
  {
    // add the slip formula to the running total.
    tagHp5 += this.calculateStateSlipFormula(hpPerFiveFormula, battler, state);
  }

  // return the per-five.
  return tagHp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipMp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // the running total of the mp-per-5 amount from states.
  let tagMp5 = 0;

  // deconstruct the data out of the state.
  const {
    jabsSlipMpFlatPerFive: mpPerFiveFlat,
    jabsSlipMpPercentPerFive: mpPerFivePercent,
    jabsSlipMpFormulaPerFive: mpPerFiveFormula,
  } = state;

  // if the flat tag exists, use it.
  tagMp5 += mpPerFiveFlat;

  // if the percent tag exists, use it.
  tagMp5 += battler.mmp * (mpPerFivePercent / 100);

  // if the formula tag exists, use it.
  if (mpPerFiveFormula)
  {
    // add the slip formula to the running total.
    tagMp5 += this.calculateStateSlipFormula(mpPerFiveFormula, battler, state);
  }

  // return the per-five.
  return tagMp5;
};

/**
 * Processes a single state and returns its tag-based tp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The tp regen from this state.
 */
JABS_Battler.prototype.stateSlipTp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagTp5 = 0;

  // deconstruct the data out of the state.
  const {
    jabsSlipTpFlatPerFive: tpPerFiveFlat,
    jabsSlipTpPercentPerFive: tpPerFivePercent,
    jabsSlipTpFormulaPerFive: tpPerFiveFormula,
  } = state;

  // if the flat tag exists, use it.
  tagTp5 += tpPerFiveFlat;

  // if the percent tag exists, use it.
  tagTp5 += battler.maxTp() * (tpPerFivePercent / 100);

  // if the formula tag exists, use it.
  if (tpPerFiveFormula)
  {
    // add the slip formula to the running total.
    tagTp5 += this.calculateStateSlipFormula(tpPerFiveFormula, battler, state);
  }

  // return the per-five.
  return tagTp5;
};

/**
 * Calculates the value of a slip-based formula.
 * This is where the source and afflicted are determined before {@link eval}uating the
 * formula with the necessary context to evaluate a formula.
 * @param {string} formula The string containing the formula to parse.
 * @param {Game_Battler} battler The battler that is afflicted with the slip effect.
 * @param {RPG_State} state The state representing this slip effect.
 * @returns {number} The result of the formula representing the slip effect value.
 */
JABS_Battler.prototype.calculateStateSlipFormula = function(formula, battler, state)
{
  // pull the state associated with the battler.
  const trackedState = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), state.id);

  // initialize the source and afflicted with oneself.
  let sourceBattler = battler;
  let afflictedBattler = battler;

  // check if the trackedState was present.
  if (trackedState)
  {
    // update the source and afflicted with the tracked data instead.
    sourceBattler = trackedState.source;
    afflictedBattler = trackedState.battler;
  }

  // calculate the total for this slip formula.
  const total = this.slipEval(formula, sourceBattler, afflictedBattler, state);

  // return the result.
  return total;
};

/**
 * Performs an {@link eval} on the provided formula with the given parameters as scoped context
 * to calculate a formula-based slip values. Also provides a weak safety net to ensure that no
 * garbage values get returned, or raises exceptions if the formula is invalidly written.
 * @param {string} formula The string containing the formula to parse.
 * @param {Game_Battler} sourceBattler The battler that applied this state to the target.
 * @param {Game_Battler} afflictedBattler The target battler afflicted with this state.
 * @param {RPG_State} state The state associated with this slip effect.
 * @returns {number} The output of the formula (multiplied by `-1`) to
 */
JABS_Battler.prototype.slipEval = function(formula, sourceBattler, afflictedBattler, state)
{
  // variables for contextual eval().
  /* eslint-disable no-unused-vars */
  const a = sourceBattler;        // the one who applied the state.
  const b = afflictedBattler;     // this battler, afflicted by the state.
  const v = $gameVariables._data; // access to variables if you need it.
  const s = state;                // access to the state itself if you need it.
  /* eslint-enable no-unused-vars */

  // initialize the result.
  let result = 0;

  // add a safety net for people who write broken formulas.
  try
  {
    // eval() the formula and default to negative (because "slip" is negative).
    result = eval(formula) * -1;

    // check if the eval() produced garbage output despite not throwing.
    if (!Number.isFinite(result))
    {
      // throw, and then catch to properly log in the next block.
      throw new Error("Invalid formula.")
    }
  }
  catch (err)
  {
    console.warn(`failed to eval() this formula: [ ${formula} ]`);
    console.trace();
    throw err;
  }

  // we prefer to work with integers for slip.
  const formattedResult = Math.round(result);

  // return the calculated result.
  return formattedResult;
};

/**
 * Applies the regeneration amount to the appropriate parameter.
 * @param {number} amount The regen amount.
 * @param {number} type The regen type- identified by index.
 */
JABS_Battler.prototype.applySlipEffect = function(amount, type)
{
  // grab the battler.
  const battler = this.getBattler();

  // pivot on the slip type.
  switch (type)
  {
    case 0:
      battler.gainHp(amount);
      break;
    case 1:
      battler.gainMp(amount);
      break;
    case 2:
      battler.gainTp(amount);
      break;
  }
};

/**
 * Creates the slip popup on this battler.
 * @param {number} amount The slip pop amount.
 * @param {number} type The slip parameter: 0=hp, 1=mp, 2=tp.
 */
JABS_Battler.prototype.generatePopSlip = function(amount, type)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // gather shorthand variables for use.
  const character = this.getCharacter();

  // generate the textpop.
  const slipPop = this.configureSlipPop(amount, type);

  // add the pop to the target's tracking.
  character.addTextPop(slipPop);
  character.requestTextPop();
};

/**
 * Configures a popup based on the slip damage type and amount.
 * @param {number} amount The amount of the slip.
 * @param {0|1|2} type The slip parameter: 0=hp, 1=mp, 2=tp.
 * @returns {Map_TextPop}
 */
JABS_Battler.prototype.configureSlipPop = function(amount, type)
{
  // lets take our time with this text pop building.
  const textPopBuilder = new TextPopBuilder(amount);

  // based on the hp/mp/tp type, we apply different visual effects.
  switch (type)
  {
    case 0: // hp
      textPopBuilder.isHpDamage();
      break;
    case 1: // mp
      textPopBuilder.isMpDamage();
      break;
    case 2: // tp
      textPopBuilder.isTpDamage();
      break;
  }

  // build and return the popup.
  return textPopBuilder.build();
};
//endregion regeneration

/**
 * Gets whether or not this battler's movement is locked.
 * @returns {boolean} True if the battler's movement is locked, false otherwise.
 */
JABS_Battler.prototype.isMovementLocked = function()
{
  return this._movementLock;
};

/**
 * Sets the battler's movement lock.
 * @param {boolean} locked Whether or not the battler's movement is locked (default = true).
 */
JABS_Battler.prototype.setMovementLock = function(locked = true)
{
  this._movementLock = locked;
};

/**
 * Whether or not the battler is able to move.
 * A variety of things can impact the ability for a battler to move.
 * @returns {boolean} True if the battler can move, false otherwise.
 */
JABS_Battler.prototype.canBattlerMove = function()
{
  // battlers cannot move if they are movement locked by choice (rotating/guarding/etc).
  if (this.isMovementLocked()) return false;

  // battlers cannot move if they are movement locked by state.
  if (this.isMovementLockedByState()) return false;

  // battler can move!
  return true;
};

/**
 * Checks all states to see if any are movement-locking.
 * @returns {boolean} True if there is at least one locking movement, false otherwise.
 */
JABS_Battler.prototype.isMovementLockedByState = function()
{
  // grab the states to check for movement-blocking effects.
  const states = this.getBattler().states();

  // if we have no states,
  if (!states.length) return false;

  // check all our states to see if any are blocking movement.
  const lockedByState = states.some(state => (state.jabsRooted || state.jabsParalyzed));

  // return what we found.
  return lockedByState;
};

/**
 * Whether or not the battler is able to use attacks based on states.
 * @returns {boolean} True if the battler can attack, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseAttacks = function()
{
  const states = this.getBattler().states();
  if (!states.length)
  {
    return true;
  }

  const disabled = states.find(state => (state.jabsDisarmed || state.jabsParalyzed));
  return !disabled;

};

/**
 * Whether or not the battler is able to use skills based on states.
 * @returns {boolean} True if the battler can use skills, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseSkills = function()
{
  const states = this.getBattler().states();
  if (!states.length)
  {
    return true;
  }

  const muted = states.find(state => (state.jabsMuted || state.jabsParalyzed));
  return !muted;

};

/**
 * Initializes the sprite info for this battler.
 */
JABS_Battler.prototype.captureBaseSpriteInfo = function()
{
  this.setBaseSpriteName(this.getCharacterSpriteName());
  this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};

/**
 * Gets the name of this battler's current character sprite.
 * @returns {string}
 */
JABS_Battler.prototype.getCharacterSpriteName = function()
{
  return this.getCharacter()._characterName;
};

/**
 * Gets the index of this battler's current character sprite.
 * @returns {number}
 */
JABS_Battler.prototype.getCharacterSpriteIndex = function()
{
  return this.getCharacter()._characterIndex;
};

/**
 * Sets the name of this battler's original character sprite.
 * @param {string} name The name to set.
 */
JABS_Battler.prototype.setBaseSpriteName = function(name)
{
  this._baseSpriteImage = name;
};

/**
 * Sets the index of this battler's original character sprite.
 * @param {number} index The index to set.
 */
JABS_Battler.prototype.setBaseSpriteIndex = function(index)
{
  this._baseSpriteIndex = index;
};
//endregion update helpers

//region reference helpers
/**
 * Reassigns the character to something else.
 * @param {Game_Event|Game_Player|Game_Follower} newCharacter The new character to assign.
 */
JABS_Battler.prototype.setCharacter = function(newCharacter)
{
  this._event = newCharacter;
};

/**
 * Gets the battler's name.
 * @returns {string}
 */
JABS_Battler.prototype.battlerName = function()
{
  return this.getReferenceData().name;
};

/**
 * Events that have no actual conditions associated with them may have a -1 index.
 * Ignore that if that's the case.
 */
JABS_Battler.prototype.hasEventActions = function()
{
  // only events can have event commands.
  if (!this.isEvent()) return false;

  const event = this.getCharacter();
  return event._pageIndex !== -1;
};

/**
 * Destroys this battler by removing it from tracking and erasing the character.
 */
JABS_Battler.prototype.destroy = function()
{
  // set the battler as invincible to prevent further hitting.
  this.setInvincible();

  // remove the battler from tracking.
  JABS_AiManager.removeBattler(this);

  // grab the character.
  const character = this.getCharacter();

  // erase the underlying character.
  character.erase();

  // flag the sprite for removal.
  character.setActionSpriteNeedsRemoving();
};

/**
 * Reveals this battler onto the map.
 */
JABS_Battler.prototype.revealHiddenBattler = function()
{
  this._hidden = false;
};

/**
 * Hides this battler from the current battle map.
 */
JABS_Battler.prototype.hideBattler = function()
{
  this._hidden = true;
};

/**
 * Whether or not this battler is hidden on the current battle map.
 */
JABS_Battler.prototype.isHidden = function()
{
  return this._hidden;
};

/**
 * Whether or not this battler is in a state of dying.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDying = function()
{
  return this._dying;
};

/**
 * Sets whether or not this battler is in a state of dying.
 * @param {boolean} dying The new state of dying.
 */
JABS_Battler.prototype.setDying = function(dying)
{
  this._dying = dying;
};

/**
 * Calculates whether or not this battler should continue fighting it's target.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
JABS_Battler.prototype.inPursuitRange = function(target, distance)
{
  // grab the current pursuit radius.
  let pursuitRadius = this.getPursuitRadius();

  // apply the modification from the actor, if any.
  const visionMultiplier = target.getBattler().getVisionModifier();

  // apply the multiplier to the base.
  pursuitRadius *= visionMultiplier;

  // return whether or not we're in range.
  return (distance <= pursuitRadius);
};

/**
 * Calculates whether or not this battler should engage the nearest battler.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
JABS_Battler.prototype.inSightRange = function(target, distance)
{
  // grab the sight for this battler.
  const sightRadius = this.getSightRadius();

  // apply the modification from the actor, if any.
  const modifiedSight = this.applyVisionMultiplier(target, sightRadius);

  // determine whether or not the target is in sight.
  const isInSightRange = (distance <= modifiedSight);

  // return the answer.
  return isInSightRange;
};

/**
 * Determines whether or not this battler is "out of range" of a given target.
 * At or beyond the designated range usually results in dropping cognition of one another.
 * @param {JABS_Battler} target The target to check if within range of.
 * @returns {boolean} True if this battler is out of range of the target, false otherwise.
 */
JABS_Battler.prototype.outOfRange = function(target)
{
  // if the target is invalid, then they are out of range.
  if (!target) return true;

  // if they are actually out of update range, then they are out of range.
  if (this.distanceToDesignatedTarget(target) > JABS_AiManager.maxAiRange) return true;

  // they are not out of range.
  return false;
};

/**
 * Applies the vision multiplier against the base vision radius in question.
 * @param {JABS_Battler} target The target we're trying to see.
 * @param {number} originalRadius The original vision radius.
 */
JABS_Battler.prototype.applyVisionMultiplier = function(target, originalRadius)
{
  // get this battler's vision multiplier factor.
  const visionMultiplier = target.getBattler().getVisionModifier();

  // calculate the new radius.
  const modifiedVisionRadius = (originalRadius * visionMultiplier);

  // return our calculation.
  return modifiedVisionRadius;
};

/**
 * Gets this battler's unique identifier.
 * @returns {string}
 */
JABS_Battler.prototype.getUuid = function()
{
  // if there is problems with the battler, return nothing.
  if (!this.getBattler()) return String.empty;

  return this.getBattler().getUuid();
};

/**
 * Gets whether or not this battler has any pending actions decided
 * by this battler's leader.
 */
JABS_Battler.prototype.hasLeaderDecidedActions = function()
{
  // if you don't have a leader, you don't perform the actions.
  if (!this.hasLeader()) return false;

  return this._leaderDecidedAction;
};

/**
 * Gets the next skill id from the queue of leader-decided actions.
 * Also removes it from the current queue.
 * @returns {number}
 */
JABS_Battler.prototype.getNextLeaderDecidedAction = function()
{
  const action = this._leaderDecidedAction;
  this.clearLeaderDecidedActionsQueue();
  return action;
};

/**
 * Adds a new action decided by the leader for the follower to perform.
 * @param {number} skillId The skill id decided by the leader.
 */
JABS_Battler.prototype.setLeaderDecidedAction = function(skillId)
{
  this._leaderDecidedAction = skillId;
};

/**
 * Clears all unused leader-decided actions that this follower had pending.
 */
JABS_Battler.prototype.clearLeaderDecidedActionsQueue = function()
{
  this._leaderDecidedAction = null;
};

/**
 * Gets the leader's `uuid` of this battler.
 */
JABS_Battler.prototype.getLeader = function()
{
  return this._leaderUuid;
};

/**
 * Gets the battler for this battler's leader.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getLeaderBattler = function()
{
  if (this._leaderUuid)
  {
    return JABS_AiManager.getBattlerByUuid(this._leaderUuid);
  }

  return null;

};

/**
 * Sets the `uuid` of the leader of this battler.
 * @param {string} newLeader The leader's `uuid`.
 */
JABS_Battler.prototype.setLeader = function(newLeader)
{
  const leader = JABS_AiManager.getBattlerByUuid(newLeader);
  if (leader)
  {
    this._leaderUuid = newLeader;
    leader.addFollower(this.getUuid());
  }
};

/**
 * Gets whether or not this battler has a leader.
 * Only battlers with the ai-trait of `follower` can have leaders.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasLeader = function()
{
  return !!this._leaderUuid;
};

/**
 * Gets all followers associated with this battler.
 * Only leaders can have followers.
 * @return {string[]} The `uuid`s of all followers.
 */
JABS_Battler.prototype.getFollowers = function()
{
  return this._followers;
};

/**
 * Gets the whole battler of the follower matching the `uuid` provided.
 * @param {string} followerUuid The `uuid` of the follower to find.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getFollowerByUuid = function(followerUuid)
{
  // if we don't have followers, just return null.
  if (!this.hasFollowers()) return null;

  // search through the followers to find the matching battler.
  const foundUuid = this._followers.find(uuid => uuid === followerUuid);
  if (foundUuid)
  {
    return JABS_AiManager.getBattlerByUuid(foundUuid);
  }

  return null;

};

/**
 * Adds a follower to the leader's collection.
 * @param {string} newFollowerUuid The new uuid of the follower now being tracked.
 */
JABS_Battler.prototype.addFollower = function(newFollowerUuid)
{
  const found = this.getFollowerByUuid(newFollowerUuid);
  if (found)
  {
    console.error("this follower already existed within the follower list.");
  }
  else
  {
    this._followers.push(newFollowerUuid);
  }
};

/**
 * Removes the follower from
 * @param {string} oldFollowerUuid The `uuid` of the follower to remove from tracking.
 */
JABS_Battler.prototype.removeFollower = function(oldFollowerUuid)
{
  const index = this._followers.indexOf(uuid => uuid === oldFollowerUuid);
  if (index !== -1)
  {
    this._followers.splice(index, 1);
  }
  else
  {
    console.error("could not find follower to remove from the list.", oldFollowerUuid);
  }
};

/**
 * Clears all current followers from this battler.
 */
JABS_Battler.prototype.clearFollowers = function()
{
  // first de-assign leadership from all followers for this leader...
  this._followers.forEach(followerUuid =>
  {
    $gameMap.clearLeaderDataByUuid(followerUuid);
  });

  // ...then empty the collection.
  this._followers.splice(0, this._followers.length);
};

/**
 * Removes this follower's leader.
 */
JABS_Battler.prototype.clearLeader = function()
{
  // get the leader's uuid for searching.
  const leaderUuid = this.getLeader();
  // if found, remove this follower from that leader.
  if (leaderUuid)
  {
    const uuid = this.getUuid();
    // in some instances, "this" may not be alive anymore so handle that.
    if (!uuid) return;

    const leader = JABS_AiManager.getBattlerByUuid(leaderUuid);
    if (!leader) return;

    leader.removeFollowerByUuid(uuid);
  }
};

/**
 * Removes a follower from it's current leader.
 * @param {string} uuid The `uuid` of the follower to remove from the leader.
 */
JABS_Battler.prototype.removeFollowerByUuid = function(uuid)
{
  const index = this._followers.indexOf(uuid);
  if (index !== -1)
  {
    this._followers.splice(index, 1);
  }
};

/**
 * Removes the leader data from this battler.
 */
JABS_Battler.prototype.clearLeaderData = function()
{
  this.setLeader("");
  this.clearLeaderDecidedActionsQueue();
};

/**
 * Gets whether or not this battler has followers.
 * Only battlers with the AI trait of "leader" will have followers.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasFollowers = function()
{
  // if you're not a leader, you can't have followers.
  if (!this.getAiMode().leader) return false;

  return this._followers.length > 0;
};

/**
 * Gets the database data for this battler.
 * @returns {RPG_Actor|RPG_Enemy} The battler data.
 */
JABS_Battler.prototype.getReferenceData = function()
{
  // if somehow we don't have a battler, return an empty object.
  if (!this.getBattler()) return {};

  // if it is an actor, return the actor database data.
  if (this.isActor())
  {
    return this.getBattler()
      .actor();
  }

  // if it is an enemy, return the enemy database data.
  if (this.getBattler()
    .isEnemy())
  {
    return this.getBattler()
      .enemy();
  }
};

/**
 * Determines if this battler is facing its target.
 * @param {Game_Character} target The target `Game_Character` to check facing for.
 */
JABS_Battler.prototype.isFacingTarget = function(target)
{
  const userDir = this.getCharacter()
    .direction();
  const targetDir = target.direction();

  switch (userDir)
  {
    case J.ABS.Directions.DOWN:
      return targetDir === J.ABS.Directions.UP;
    case J.ABS.Directions.UP:
      return targetDir === J.ABS.Directions.DOWN;
    case J.ABS.Directions.LEFT:
      return targetDir === J.ABS.Directions.RIGHT;
    case J.ABS.Directions.RIGHT:
      return targetDir === J.ABS.Directions.LEFT;
  }

  return false;
};

/**
 * Whether or not this battler is actually the `Game_Player`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPlayer = function()
{
  return (this.getCharacter() instanceof Game_Player);
};

/**
 * Whether or not this battler is a `Game_Actor`.
 * The player counts as a `Game_Actor`, too.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActor = function()
{
  return (this.isPlayer() || this.getBattler() instanceof Game_Actor)
};

/**
 * Whether or not this battler is based on a follower.
 * @returns {boolean}
 */
JABS_Battler.prototype.isFollower = function()
{
  return (this.getCharacter() instanceof Game_Follower);
};

/**
 * Whether or not this battler is a `Game_Enemy`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEnemy = function()
{
  return (this.getBattler() instanceof Game_Enemy);
};

/**
 * Whether or not this battler is based on an event.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEvent = function()
{
  return (this.getCharacter() instanceof Game_Event);
};

/**
 * Compares the user with a provided target team to see if they are the same.
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean} True if the user and target are on the same team, false otherwise.
 */
JABS_Battler.prototype.isSameTeam = function(targetTeam)
{
  return (this.getTeam() === targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "friendly".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isFriendlyTeam = function(targetTeam)
{
  // TODO: parameterize in objects what are "opposing" teams.
  return [this.getTeam()].includes(targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "opposing".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isOpposingTeam = function(targetTeam)
{
  // TODO: parameterize in objects what are "friendly" teams.
  return !(targetTeam === this.getTeam());
  //return [].includes(targetTeam);
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_Battler.prototype.getTeam = function()
{
  return this._team;
};

/**
 * Gets the phase of battle this battler is currently in.
 * The player does not have any phases.
 * @returns {number} The phase this `JABS_Battler` is in.
 */
JABS_Battler.prototype.getPhase = function()
{
  return this._phase;
};

/**
 * Gets whether or not this battler is invincible.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInvincible = function()
{
  return this._invincible;
};

/**
 * Gets whether or not this battler is inanimate.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInanimate = function()
{
  return this._inanimate;
};

/**
 * Sets this battler to be invincible, rendering them unable to be collided
 * with by map actions of any kind.
 * @param {boolean} invincible True if uncollidable, false otherwise (default: true).
 */
JABS_Battler.prototype.setInvincible = function(invincible = true)
{
  this._invincible = invincible;
};

/**
 * Sets the phase of battle that this battler should be in.
 * @param {number} newPhase The new phase the battler is entering.
 */
JABS_Battler.prototype.setPhase = function(newPhase)
{
  this._phase = newPhase;
};

/**
 * Resets the phase of this battler back to one and resets all flags.
 */
JABS_Battler.prototype.resetPhases = function()
{
  this.setPhase(1);
  this._prepareReady = false;
  this._prepareCounter = 0;
  this._postActionCooldownComplete = false;
  this.setDecidedAction(null);
  this.setAllyTarget(null);
  this.setInPosition(false);
};

/**
 * Gets whether or not this battler is in position for a given skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInPosition = function()
{
  return this._inPosition;
};

/**
 * Sets this battler to be identified as "in position" to execute their
 * decided skill.
 * @param {boolean} inPosition
 */
JABS_Battler.prototype.setInPosition = function(inPosition = true)
{
  this._inPosition = inPosition;
};

/**
 * Gets whether or not this battler has decided an action.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActionDecided = function()
{
  return this._decidedAction !== null;
};

/**
 * Gets the battler's decided action.
 * @returns {JABS_Action[]|null}
 */
JABS_Battler.prototype.getDecidedAction = function()
{
  return this._decidedAction;
};

/**
 * Sets this battler's decided action to this action.
 * @param {JABS_Action[]} action The action this battler has decided on.
 */
JABS_Battler.prototype.setDecidedAction = function(action)
{
  this._decidedAction = action;
};

/**
 * Clears this battler's decided action.
 */
JABS_Battler.prototype.clearDecidedAction = function()
{
  this._decidedAction = null;
};

/**
 * Resets the idle action back to a not-ready state.
 */
JABS_Battler.prototype.resetIdleAction = function()
{
  this._idleActionReady = false;
};

/**
 * Returns the `Game_Character` that this `JABS_Battler` is bound to.
 * For the player, it'll return a subclass instead: `Game_Player`.
 * @returns {Game_Event|Game_Player|Game_Follower} The event this `JABS_Battler` is bound to.
 */
JABS_Battler.prototype.getCharacter = function()
{
  return this._event;
};

/**
 * Returns the `Game_Battler` that this `JABS_Battler` represents.
 *
 * This may be either a `Game_Actor`, or `Game_Enemy`.
 * @returns {Game_Actor|Game_Enemy} The `Game_Battler` this battler represents.
 */
JABS_Battler.prototype.getBattler = function()
{
  return this._battler;
};

/**
 * Gets whether or not the underlying battler is dead.
 * @returns {boolean} True if they are dead, false otherwise.
 */
JABS_Battler.prototype.isDead = function()
{
  return this.getBattler().isDead();
};

/**
 * Whether or not the event is actually loaded and valid.
 * @returns {boolean} True if the event is valid (non-player) and loaded, false otherwise.
 */
JABS_Battler.prototype.isEventReady = function()
{
  const character = this.getCharacter();
  if (character instanceof Game_Player)
  {
    return false;
  }

  return !!character.event();

};

/**
 * The radius a battler of a different team must enter to cause this unit to engage.
 * @returns {number} The sight radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getSightRadius = function()
{
  let sight = this._sightRadius;
  if (this.isAlerted())
  {
    sight += this._alertedSightBoost;
  }

  return sight;
};

/**
 * The maximum distance a battler of a different team may reach before this unit disengages.
 * @returns {number} The pursuit radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getPursuitRadius = function()
{
  let pursuit = this._pursuitRadius;
  if (this.isAlerted())
  {
    pursuit += this._alertedPursuitBoost;
  }

  return pursuit;
};

/**
 * Sets whether or not this battler is engaged.
 * @param {boolean} isEngaged Whether or not this battler is engaged.
 */
JABS_Battler.prototype.setEngaged = function(isEngaged)
{
  this._engaged = isEngaged;
};

/**
 * Whether or not this `JABS_Battler` is currently engaged in battle with a target.
 * @returns {boolean} Whether or not this battler is engaged.
 */
JABS_Battler.prototype.isEngaged = function()
{
  return this._engaged;
};

/**
 * Engage battle with the target battler.
 * @param {JABS_Battler} target The target this battler is engaged with.
 */
JABS_Battler.prototype.engageTarget = function(target)
{
  // this battler cannot engage with targets right now.
  if (this.isEngagementLocked()) return;

  // enable engagement.
  this.setIdle(false);
  this.setEngaged(true);

  // setup the target and their aggro.
  this.setTarget(target);
  this.addUpdateAggro(target.getUuid(), 0);

  // check if this is an actor-based character.
  if (this.isActor())
  {
    // disable walking through walls while the follower is engaged.
    this.getCharacter().setThrough(false);
  }

  // if we're alerted, also clear the alert state.
  this.clearAlert();

  // TODO: abstract this.
  this.showBalloon(J.ABS.Balloons.Exclamation);
};

/**
 * Disengage from the target.
 */
JABS_Battler.prototype.disengageTarget = function()
{
  // clear any targeting.
  this.setTarget(null);
  this.setAllyTarget(null);

  // disable being engaged.
  this.setEngaged(false);

  // disable the alert when disengaging.
  this.clearAlert();

  // remove leader/follower data.
  this.clearFollowers();
  this.clearLeaderData();

  // forget decided action.
  this.clearDecidedAction();

  // reset all the phases back to default.
  this.resetPhases();

  // TODO: abstract this.
  //this.showBalloon(J.ABS.Balloons.Frustration);
};

/**
 * Gets whether or not this battler is currently barred from engagement.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEngagementLocked = function()
{
  return this._engagementLock;
};

/**
 * Locks engagement.
 * Disables the ability for this battler to acquire a target and do battle.
 */
JABS_Battler.prototype.lockEngagement = function()
{
  this._engagementLock = true;
};

/**
 * Unlocks engagement.
 * Allows this battler to engage with targets and do battle.
 */
JABS_Battler.prototype.unlockEngagement = function()
{
  this._engagementLock = false;
};

/**
 * Gets the current target of this battler.
 * @returns {JABS_Battler|null}
 */
JABS_Battler.prototype.getTarget = function()
{
  return this._target;
};

/**
 * Sets the target of this battler.
 * @param {JABS_Battler} newTarget The new target.
 */
JABS_Battler.prototype.setTarget = function(newTarget)
{
  this._target = newTarget;
};

/**
 * Gets the last battler struck by this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getBattlerLastHit = function()
{
  if (this._lastHit && this._lastHit.isDead())
  {
    // if the last hit battler was defeated or something, remove it.
    this.setBattlerLastHit(null);
  }

  return this._lastHit;
};

/**
 * Sets the last battler struck by this battler.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 */
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit)
{
  this._lastHit = battlerLastHit;

  // the player-controlled character cannot have a target by normal means due
  // to them not being controlled by AI. However, their "last hit" is basically
  // the same thing, so assign their target as well.
  if (this.isPlayer())
  {
    this.setTarget(this._lastHit);
  }
};

/**
 * Gets whether or not this has a last battler hit currently stored.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasBattlerLastHit = function()
{
  return !!this.getBattlerLastHit();
};

/**
 * Clears the last battler hit tracker from this battler.
 */
JABS_Battler.prototype.clearBattlerLastHit = function()
{
  this.setBattlerLastHit(null);
  this.setLastBattlerHitCountdown(0);

  // when clearing the last battler hit, also remove the player's target that
  // was likely added via the above function of "setBattlerLastHit".
  if (this.isPlayer())
  {
    this.setTarget(null);
  }
};

/**
 * Sets the last battler hit countdown.
 * @param {number} duration The duration in frames (60/s).
 */
JABS_Battler.prototype.setLastBattlerHitCountdown = function(duration = 900)
{
  this._lastHitCountdown = duration;
};

/**
 * Counts down the last hit counter.
 * @returns {boolean}
 */
JABS_Battler.prototype.countdownLastHit = function()
{
  if (this._lastHitCountdown <= 0)
  {
    this._lastHitCountdown = 0;
    if (this.hasBattlerLastHit())
    {
      this.clearBattlerLastHit();
    }
  }

  if (this._lastHitCountdown > 0)
  {
    this._lastHitCountdown--;
  }
};

/**
 * Gets whether or not this battler is dead inside.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDead = function()
{
  const battler = this.getBattler();

  if (!battler)
  { // has no battler.
    return true;
  }
  else if (!JABS_AiManager.getBattlerByUuid(battler.getUuid()))
  { // battler isn't on the map.
    return true;
  }
  else if (battler.isDead() || this.isDying())
  { // battler is actually dead.
    return true;
  }
  // battler is OK!
  return false;

};

/**
 * Gets the current allied target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getAllyTarget = function()
{
  return this._allyTarget;
};

/**
 * Sets the allied target of this battler.
 * @param {JABS_Battler} newAlliedTarget The new target.
 */
JABS_Battler.prototype.setAllyTarget = function(newAlliedTarget)
{
  this._allyTarget = newAlliedTarget;
};

/**
 * Determines the distance from this battler and the point.
 * @param {number|null} x2 The x coordinate to check.
 * @param {number|null} y2 The y coordinate to check.
 * @returns {number|null} The distance from the battler to the point.
 */
JABS_Battler.prototype.distanceToPoint = function(x2, y2)
{
  if ((x2 ?? y2) === null) return null;
  const x1 = this.getX();
  const y1 = this.getY();
  const distance = Math.hypot(x2 - x1, y2 - y1).toFixed(2);
  return parseFloat(distance);
};

/**
 * Determines distance from this battler and the target.
 * @param {JABS_Battler} target The target that this battler is checking distance against.
 * @returns {number|null} The distance from this battler to the provided target.
 */
JABS_Battler.prototype.distanceToDesignatedTarget = function(target)
{
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current target.
 * @returns {number|null} The distance.
 */
JABS_Battler.prototype.distanceToCurrentTarget = function()
{
  const target = this.getTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current ally target.
 * @returns {number|null} The distance.
 */
JABS_Battler.prototype.distanceToAllyTarget = function()
{
  const target = this.getAllyTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * A shorthand reference to the distance this battler is from it's home.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToHome = function()
{
  return this.distanceToPoint(this._homeX, this._homeY);
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_Battler.prototype.canIdle = function()
{
  return this._canIdle;
};

/**
 * Gets whether or not this battler should show its hp bar.
 * @returns {boolean}
 */
JABS_Battler.prototype.showHpBar = function()
{
  return this._showHpBar;
};

/**
 * Gets whether or not this battler should show its name.
 * @returns {boolean}
 */
JABS_Battler.prototype.showBattlerName = function()
{
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {boolean} True if this battler is alerted, false otherwise.
 */
JABS_Battler.prototype.isAlerted = function()
{
  return this._alerted;
};

/**
 * Sets the alerted state for this battler.
 * @param {boolean} alerted The new alerted state (default = true).
 */
JABS_Battler.prototype.setAlerted = function(alerted = true)
{
  this._alerted = alerted;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {number} The duration remaining for this alert state.
 */
JABS_Battler.prototype.getAlertDuration = function()
{
  return this._alertDuration;
};

/**
 * Sets the alerted counter to this number of frames.
 * @param {number} alertedFrames The duration in frames for how long to be alerted.
 */
JABS_Battler.prototype.setAlertedCounter = function(alertedFrames)
{
  this._alertedCounter = alertedFrames;
  if (this._alertedCounter > 0)
  {
    this.setIdle(false);
    this.setAlerted();
  }
  else if (this._alertedCounter <= 0)
  {
    this.setAlerted(false);
  }
};

/**
 * Gets the alerted coordinates.
 * @returns {[number, number]} The `[x, y]` of the alerter.
 */
JABS_Battler.prototype.getAlertedCoordinates = function()
{
  return this._alertedCoordinates;
};

/**
 * Sets the alerted coordinates.
 * @param {number} x The `x` of the alerter.
 * @param {number} y The `y` of the alerter.
 */
JABS_Battler.prototype.setAlertedCoordinates = function(x, y)
{
  this._alertedCoordinates = [x, y];
};

/**
 * Whether or not this battler is at it's home coordinates.
 * @returns {boolean} True if the battler is home, false otherwise.
 */
JABS_Battler.prototype.isHome = function()
{
  return (this._event.x === this._homeX && this._event.y === this._homeY);
};

/**
 * Returns the X coordinate of the event portion's initial placement.
 * @returns {number} The X coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeX = function()
{
  return this._homeX;
};

/**
 * Returns the Y coordinate of the event portion's initial placement.
 * @returns {number} The Y coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeY = function()
{
  return this._homeY;
};

/**
 * Returns the X coordinate of the event.
 * @returns {number} The X coordinate of this event.
 */
JABS_Battler.prototype.getX = function()
{
  return this.getCharacter()._realX;
};

/**
 * Returns the Y coordinate of the event.
 * @returns {number} The Y coordinate of this event.
 */
JABS_Battler.prototype.getY = function()
{
  return this.getCharacter()._realY;
};

/**
 * Retrieves the AI associated with this battler.
 * @returns {JABS_EnemyAI} This battler's AI.
 */
JABS_Battler.prototype.getAiMode = function()
{
  return this._aiMode;
};

/**
 * Gets this follower's leader's AI.
 * @returns {JABS_EnemyAI} This battler's leader's AI.
 */
JABS_Battler.prototype.getLeaderAiMode = function()
{
  // if we don't have a leader, don't.
  if (!this.hasLeader()) return null;

  const leader = JABS_AiManager.getBattlerByUuid(this.getLeader());
  if (!leader) return null;

  return leader.getAiMode();
};

/**
 * Tries to move this battler away from its current target.
 * This may fail if the battler is pinned in a corner or something.
 */
JABS_Battler.prototype.moveAwayFromTarget = function()
{
  const battler = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;
  const character = target.getCharacter();

  battler.moveAwayFromCharacter(character);
};

/**
 * Tries to move this battler away from its current target.
 *
 * There is no pathfinding away, but if its not able to move directly
 * away, it will try a different direction to wiggle out of corners.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function()
{
  const battler = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  battler.moveAwayFromCharacter(target.getCharacter());
  if (!battler.isMovementSucceeded())
  {
    const threatDir = battler.reverseDir(battler.direction());
    let newDir = (Math.randomInt(4) + 1) * 2;
    while (newDir === threatDir)
    {
      newDir = (Math.randomInt(4) + 1) * 2;
    }
    battler.moveStraight(newDir);
  }
};

/**
 * Tries to move this battler towards its current target.
 */
JABS_Battler.prototype.smartMoveTowardTarget = function()
{
  const target = this.getTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler towards its ally target.
 */
JABS_Battler.prototype.smartMoveTowardAllyTarget = function()
{
  const target = this.getAllyTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler toward a set of coordinates.
 * @param {number} x The `x` coordinate to reach.
 * @param {number} y The `y` coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(x, y)
{
  const character = this.getCharacter();
  const nextDir = CycloneMovement
    ? character.findDirectionTo(x, y)
    : character.findDiagonalDirectionTo(x, y);

  if (character.isDiagonalDirection(nextDir))
  {
    const horzvert = character.getDiagonalDirections(nextDir);
    character.moveDiagonally(horzvert[0], horzvert[1]);
  }
  else
  {
    character.moveStraight(nextDir);
  }
};

/**
 * Turns this battler towards it's current target.
 */
JABS_Battler.prototype.turnTowardTarget = function()
{
  const character = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  character.turnTowardCharacter(target.getCharacter());
};
//endregion reference helpers

//region isReady & cooldowns
/**
 * Initializes a cooldown with the given key.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration to initialize this cooldown with.
 */
JABS_Battler.prototype.initializeCooldown = function(cooldownKey, duration)
{
  // grab the slot being worked with.
  const skillSlot = this.getBattler().getSkillSlot(cooldownKey);

  // if we don't have a slot, then do not process.
  if (!skillSlot) return;

  // set the skillslot's cooldown frames to the default.
  skillSlot.getCooldown().setFrames(duration);
};

/**
 * Gets the cooldown data for a given cooldown key.
 * @param {string} cooldownKey The cooldown to lookup.
 * @returns {JABS_Cooldown}
 */
JABS_Battler.prototype.getCooldown = function(cooldownKey)
{
  // grab the slot of the given key.
  const skillSlot = this.getBattler().getSkillSlot(cooldownKey);

  // check that there is a skill slot.
  if (!skillSlot)
  {
    console.warn('omg');

    // TODO: make sure enemies get assigned their slots.

    return null;
  }

  return skillSlot.getCooldown();
};

/**
 * Gets the cooldown and skill slot data for a given key.
 * @param {string} key The slot to get the data for.
 * @returns {{ cooldown: JABS_Cooldown, skillslot: JABS_SkillSlot }}
 */
JABS_Battler.prototype.getActionKeyData = function(key)
{
  const cooldown = this.getCooldown(key);
  const skillslot = this.getBattler().getSkillSlot(key);

  if (!cooldown || !skillslot) return null;

  return {
    cooldown,
    skillslot
  }
};

/**
 * Whether or not this battler has finished it's post-action cooldown phase.
 * @returns {boolean} True if the battler is cooled down, false otherwise.
 */
JABS_Battler.prototype.isPostActionCooldownComplete = function()
{
  if (this._postActionCooldownComplete)
  {
    // we are ready to do idle things.
    return true;
  }

  if (this._postActionCooldown <= this._postActionCooldownMax)
  {
    // we are still charging up...
    this._postActionCooldown++;
    return false;
  }
  this._postActionCooldownComplete = true;
  this._postActionCooldown = 0;

  // we are ready to finish phase3!
  return true;

};

/**
 * Starts the post-action cooldown for this battler.
 * @param {number} cooldown The cooldown duration.
 */
JABS_Battler.prototype.startPostActionCooldown = function(cooldown)
{
  this._postActionCooldownComplete = false;
  this._postActionCooldown = 0;
  this._postActionCooldownMax = cooldown;
};

/**
 * Retrieves the battler's idle state.
 * @returns {boolean} True if the battler is idle, false otherwise.
 */
JABS_Battler.prototype.isIdle = function()
{
  return this._idle;
};

/**
 * Sets whether or not this battler is idle.
 * @param {boolean} isIdle True if this battler is idle, false otherwise.
 */
JABS_Battler.prototype.setIdle = function(isIdle)
{
  this._idle = isIdle;
};

/**
 * Whether or not this battler is ready to perform an idle action.
 * @returns {boolean} True if the battler is idle-ready, false otherwise.
 */
JABS_Battler.prototype.isIdleActionReady = function()
{
  if (this._idleActionReady)
  {
    // we are ready to do idle things.
    return true;
  }

  if (this._idleActionCount <= this._idleActionCountMax)
  {
    // we are still charging up...
    this._idleActionCount++;
    return false;
  }
  this._idleActionReady = true;
  this._idleActionCount = 0;

  // we are ready to idle!
  return true;

};

/**
 * Whether or not the skilltype has a base or combo cooldown ready.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @returns {boolean} True if the given skilltype is ready, false otherwise.
 */
JABS_Battler.prototype.isSkillTypeCooldownReady = function(cooldownKey)
{
  const isAnyReady = this.getBattler()
    .getSkillSlotManager()
    .isAnyCooldownReadyForSlot(cooldownKey);
  return isAnyReady;
};

/**
 * Modifies the cooldown for this key by a given amount.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.modCooldownCounter = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).modBaseFrames(duration);
};

/**
 * Set the cooldown timer to a designated number.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.setCooldownCounter = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).setFrames(duration);
};

/**
 * Resets this battler's combo information.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.resetComboData = function(cooldownKey)
{
  this.getBattler()
    .getSkillSlotManager()
    .getSkillSlotByKey(cooldownKey)
    .resetCombo();
};

/**
 * Sets the combo frames to be a given value.
 * @param {string} cooldownKey The key associated with the cooldown.
 * @param {number} duration The number of frames until this combo action is ready.
 */
JABS_Battler.prototype.setComboFrames = function(cooldownKey, duration)
{
  this.getCooldown(cooldownKey).setComboFrames(duration);
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.isActionReady = function()
{
  if (this._prepareReady)
  {
    // we are ready to take action.
    return true;
  }

  if (this._prepareCounter < this._prepareMax)
  {
    // we are still charging up...
    this._prepareCounter++;
    return false;
  }

  this._prepareReady = true;
  this._prepareCounter = 0;
  // we are charged up now!
  return true;

};

/**
 * Determines the number of frames between opportunity to take the next action.
 * This maps to time spent in phase1 of JABS AI.
 * @returns {number} The number of frames between actions.
 */
JABS_Battler.prototype.getPrepareTime = function()
{
  return this.getBattler().prepareTime();
};

/**
 * Determines whether or not a skill can be executed based on restrictions or not.
 * This is used by AI.
 * @param {number} chosenSkillId The skill id to be executed.
 * @returns {boolean} True if this skill can be executed, false otherwise.
 */
JABS_Battler.prototype.canExecuteSkill = function(chosenSkillId)
{
  // if there is no chosen skill, then we obviously cannot execute it.
  if (!chosenSkillId) return false;

  // check if the battler can use skills.
  const canUseSkills = this.canBattlerUseSkills();

  // check if the battler can use basic attacks.
  const canUseAttacks = this.canBattlerUseAttacks();

  // if can't use basic attacks or skills, then autofail.
  if (!canUseSkills && !canUseAttacks)
  {
    return false;
  }

  // check if the chosen skill is the enemy's basic attack.
  const isBasicAttack = this.isSkillIdBasicAttack(chosenSkillId);

  // check if basic attacks are blocked plus this being a basic attack.
  if (!canUseAttacks && isBasicAttack)
  {
    // if the skill is a basic attack, but the battler can't attack, then fail.
    return false;
  }

  // if the skill is an assigned skill, but the battler can't use skills, then fail.
  if (!canUseSkills && !isBasicAttack)
  {
    return false;
  }

  // check if this battler can pay the costs for the given skill id.
  if (!this.canPaySkillCost(chosenSkillId))
  {
    // cannot pay the cost.
    return false;
  }

  // build the cooldown key based on the skill data.
  const skillSlotKey = this.getCooldownKeyBySkillId(chosenSkillId);

  // check to make sure we have a key.
  if (!skillSlotKey)
  {
    // if there is no key, then this skill clearly isn't ready.
    return false;
  }

  // grab the cooldown itself.
  const cooldown = this.getCooldown(skillSlotKey);

  // check if the skill was actually a remembered effective skill from a follower.
  if (!cooldown)
  {
    // please stop trying to cast your follower's skills.
    console.warn(this, skillSlotKey);
    console.trace();
    return false;
  }

  // check if the chosen skill is actually a combo for this slot.
  const isCombo = this.getBattler().getSkillSlot(skillSlotKey).comboId === chosenSkillId;

  // check if the base is off cooldown yet.
  if (!isCombo && !cooldown.isBaseReady())
  {
    // cooldown is not ready yet.
    return false;
  }

  // cast the skill!
  return true;
};

JABS_Battler.prototype.getCooldownKeyBySkillId = function(skillId)
{
  // handle accordingly for enemies.
  if (this.isEnemy())
  {
    // grab the skill itself.
    const skill = this.getSkill(skillId);

    // return the arbitrary key.
    return `${skill.id}-${skill.name}`;
  }
  // handle accordingly for actors.
  else if (this.isActor())
  {
    // grab the first slot that the id lives in.
    const slot = this.getBattler().findSlotForSkillId(skillId);

    // if there is no slot with this skill, then its not a basic attack.
    if (!slot) return null;

    // return the found key.
    return slot.key;
  }

  // if somehow it is neither actor nor enemy, then return global.
  return "Global";
};

/**
 * Determines whether or not the given skill id is actually a basic attack
 * skill used by this battler. Basic attack includes main and off hands.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if the skill is a basic attack, false otherwise.
 */
JABS_Battler.prototype.isSkillIdBasicAttack = function(skillId)
{
  // handle accordingly if an enemy.
  if (this.isEnemy())
  {
    // grab the enemy basic attack.
    const basicAttackSkillId = this.getEnemyBasicAttack();

    // check if the chosen skill is the enemy's basic attack.
    return (skillId === basicAttackSkillId);
  }
  // handle accordingly if an actor.
  else if (this.isActor())
  {
    // grab the first slot that the id lives in.
    const slot = this.getBattler().findSlotForSkillId(skillId);

    // if there is no slot with this skill, then its not a basic attack.
    if (!slot) return false;

    // if the slot key matches our mainhand, then it is a basic attack.
    return (slot.key === JABS_Button.Mainhand || slot.key === JABS_Button.Offhand);
  }

  // handle accordingly if not actor or enemy.
  console.warn(`non-actor/non-enemy checked for basic attack.`, this);
  return false;
};

/**
 * Gets the proper skill based on the skill id.
 * Accommodates J-SkillExtend and/or J-Passives.
 * @param {number} skillId The skill id to retrieve.
 * @returns {RPG_Skill|null}
 */
JABS_Battler.prototype.getSkill = function(skillId)
{
  // check to make sure we actually have a skill id first.
  if (!skillId)
  {
    // return null if we do not.
    return null;
  }

  // return the skill assocaited with the underlying battler.
  return this.getBattler().skill(skillId);
};

/**
 * Determines whether or not this battler can pay the cost of a given skill id.
 * Accommodates skill extensions.
 * @param {number} skillId The skill id to check.
 * @returns {boolean} True if this battler can pay the cost, false otherwise.
 */
JABS_Battler.prototype.canPaySkillCost = function(skillId)
{
  // if the skill cost is more than the battler has resources for, then fail.
  const skill = this.getSkill(skillId);

  // check if the battler can pay the cost.
  if (!this.getBattler().canPaySkillCost(skill))
  {
    return false;
  }

  // we can pay the cost!
  return true;
};
//endregion isReady & cooldowns

//region get data
/**
 * Gets the skill id of the last skill that this battler executed.
 * @returns {number}
 */
JABS_Battler.prototype.getLastUsedSkillId = function()
{
  return this._lastUsedSkillId;
};

/**
 * Sets the skill id of the last skill that this battler executed.
 * @param {number} skillId The skill id of the last skill used.
 */
JABS_Battler.prototype.setLastUsedSkillId = function(skillId)
{
  this._lastUsedSkillId = skillId;
};

/**
 * Gets the key of the last used slot.
 * @returns {string}
 */
JABS_Battler.prototype.getLastUsedSlot = function()
{
  return this._lastUsedSlot;
};

/**
 * Sets the last used slot to the given slot key.
 * @param {string} slotKey The key of the last slot used.
 */
JABS_Battler.prototype.setLastUsedSlot = function(slotKey)
{
  this._lastUsedSlot = slotKey;
};

/**
 * Gets all allies to this battler within a large range.
 * (Not map-wide because that could result in unexpected behavior)
 * @returns {JABS_Battler[]}
 */
JABS_Battler.prototype.getAllNearbyAllies = function()
{
  return JABS_AiManager.getAlliedBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};

/**
 * Gets the ally ai associated with this battler.
 * @returns {JABS_AllyAI}
 */
JABS_Battler.prototype.getAllyAiMode = function()
{
  // enemies do not have ally ai.
  if (this.isEnemy()) return null;

  return this.getBattler().getAllyAI();
};

/**
 * Applies the battle memory to the battler.
 * Only applicable to allies (for now).
 * @param {JABS_BattleMemory} newMemory The new memory to apply to this battler.
 */
JABS_Battler.prototype.applyBattleMemories = function(newMemory)
{
  // enemies do not (yet) track battle memories.
  if (this.isEnemy()) return;

  return this.getBattler()
    .getAllyAI()
    .applyMemory(newMemory);
};

/**
 * Gets the id of the battler associated with this battler
 * that has been assigned via the battler core data.
 * @returns {number}
 */
JABS_Battler.prototype.getBattlerId = function()
{
  return this._battlerId;
};

/**
 * Gets the skill id of the next combo action in the sequence.
 * @returns {number} The skill id of the next combo action.
 */
JABS_Battler.prototype.getComboNextActionId = function(cooldownKey)
{
  const nextComboId = this.getBattler()
    .getSkillSlotManager()
    .getSlotComboId(cooldownKey);

  return nextComboId;
};

/**
 * Sets the skill id for the next combo action in the sequence.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @param {number} nextComboId The skill id for the next combo action.
 */
JABS_Battler.prototype.setComboNextActionId = function(cooldownKey, nextComboId)
{
  this.getBattler()
    .getSkillSlotManager()
    .setSlotComboId(cooldownKey, nextComboId);
};

/**
 * Determines whether or not at least one slot has a combo skill id pending.
 * @returns {boolean} True if at least one slot's combo skill id is pending, false otherwise.
 */
JABS_Battler.prototype.hasComboReady = function()
{
  return this.getBattler()
    .getSkillSlotManager()
    .getAllSlots()
    .some(slot => slot.comboId !== 0);
};

/**
 * Gets all skills that are available to this enemy battler.
 * These skills disclude "extend" skills and non-combo-starter skills.
 * @returns {number[]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function()
{
  // grab the database data for this enemy.
  const battlerActions = this.getBattler().enemy().actions;

  // a filter function for building the skill to check if it should be filtered.
  const filtering = action =>
  {
    // determine the skill of this action.
    const skill = this.getBattler().skill(action.skillId);

    // determine if we're keeping it.
    const keep = this.aiSkillFilter(skill);

    // return what we found out.
    return keep;
  };

  // determine the valid actions available for this enemy.
  const validActions = battlerActions.filter(filtering, this);

  // extract all the skill ids of the actions.
  const validSkillIds = validActions.map(action => action.skillId);

  // return the list of filtered skill ids this battler can use.
  return validSkillIds;
};

/**
 * Determine whether or not this skill is a valid skill for selection by the {@link JABS_AiManager}.
 * @param {RPG_Skill} skill The skill being verified.
 * @returns {boolean} True if the skill is chooseable by the AI "at random", false otherwise.
 */
JABS_Battler.prototype.aiSkillFilter = function(skill)
{
  // extract the combo data points.
  const { jabsComboAction, jabsComboStarter, jabsAiSkillExclusion, isSkillExtender } = skill;

  // this skill is explicitly excluded from the skill pool.
  if (jabsAiSkillExclusion) return false;

  // skill extender skills are excluded from the skill pool.
  if (isSkillExtender) return false;

  // determine if this skill is a combo action.
  const isCombo = !!jabsComboAction;

  // determine if this skill is a combo starter.
  const isComboStarter = !!jabsComboStarter;

  // we can only include combo starter combo skills.
  const isNonComboStarterSkill = (isCombo && !isComboStarter);

  // combo skills that are not combo starters are excluded from the skill pool.
  if (isNonComboStarterSkill) return false;

  // valid skill!
  return true;
};

/**
 * Retrieves the skillId of the basic attack for this enemy.
 * @returns {number} The skillId of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function()
{
  return this.getBattler().basicAttackSkillId();
};

/**
 * Gets all skill ids that this battler has access to, including the basic attack.
 * @returns {number[]}
 */
JABS_Battler.prototype.getAllSkillIdsFromEnemy = function()
{
  // grab all the added skills.
  const skills = this.getSkillIdsFromEnemy();

  // grab this enemy's basic attack.
  const basicAttackSkillId = this.getEnemyBasicAttack();

  // add the basic attack to the list of skills.
  skills.push(basicAttackSkillId);

  // return the built list.
  return skills;
};

/**
 * Gets the number of additional/bonus hits per basic attack.
 * Skills (such as magic) do not receive bonus hits at this time.
 * @param {RPG_Skill} skill The skill to consider regarding bonus hits.
 * @param {boolean} isBasicAttack True if this is a basic attack, false otherwise.
 * @returns {number} The number of bonus hits per attack.
 */
JABS_Battler.prototype.getAdditionalHits = function(skill, isBasicAttack)
{
  let bonusHits = 0;
  const battler = this.getBattler();
  if (isBasicAttack)
  {
    // TODO: split "basic attack" bonus hits from "skill" and "all" bonus hits.
    bonusHits += battler.getBonusHits();
    if (skill.repeats > 1)
    {
      bonusHits += skill.repeats - 1;
    }
  }
  else
  {
    // check for skills that may have non-pierce-related bonus hits?
  }

  return bonusHits;
};
//endregion get data

//region aggro
/**
 * Adjust the currently engaged target based on aggro.
 */
JABS_Battler.prototype.adjustTargetByAggro = function()
{
  // don't process aggro for inanimate battlers.
  if (this.isInanimate()) return;

  // extract the uuid of the current highest aggro.
  const highestAggroUuid = this.getHighestAggro().uuid();

  // check if we currently don't have a target.
  if (!this.getTarget())
  {
    // grab the battler for that uuid.
    const newTarget = JABS_AiManager.getBattlerByUuid(highestAggroUuid);

    // make sure the battler exists before setting it.
    if (newTarget)
    {
      // set it.
      this.setTarget(newTarget);
    }

    // stop processing .
    return;
  }

  // if the target is no longer valid, disengage and end combat.
  this.removeAggroIfInvalid(this.getTarget().getUuid());

  const allAggros = this.getAggrosSortedHighestToLowest();

  // if there is no aggros remaining, disengage.
  if (allAggros.length === 0)
  {
    this.disengageTarget();
    return;
  }

  // if there is only 1 aggro remaining
  if (allAggros.length === 1)
  {
    // if there is no target, just stop that shit.
    if (!this.getTarget()) return;

    // grab the uuid of the first aggro in the list.
    const zerothAggroUuid = allAggros.at(0).uuid();

    // check to see if the last aggro in the list belongs to the current target.
    if (!(this.getTarget().getUuid() === zerothAggroUuid))
    {
      // if it doesn't, then get that battler.
      const newTarget = JABS_AiManager.getBattlerByUuid(zerothAggroUuid);
      if (newTarget)
      {
        // then switch to that target!
        this.setTarget(newTarget);
      }
      else
      {
        // if the battler doesn't exist but the aggro does, purge it.
        this.removeAggro(zerothAggroUuid);
      }
    }

    // stop processing.
    return;
  }

  // if you still don't have a target but have multiple aggros, then just give up.
  if (!this.getTarget()) return;

  // filtered aggros containing only aggros of enemies that are nearby.
  const filteredAggros = allAggros.filter(aggro =>
  {
    // the battler associated with the aggro.
    const potentialTarget = JABS_AiManager.getBattlerByUuid(aggro.uuid());

    // if the target is invalid somehow, then it is not a valid aggro.
    if (!potentialTarget) return false;

    // if the target is too far away, don't consider it.
    if (this.getPursuitRadius() < this.distanceToDesignatedTarget(potentialTarget)) return false;

    // this aggro target is fine!
    return true;
  });

  // all aggro'd targets are too far, don't adjust targets.
  if (filteredAggros.length === 0) return;

  // find the highest aggro target currently being tracked.
  const highestAggroTargetUuid = filteredAggros.at(0).uuid();

  // grab the current target of this battler at the moment.
  const currentTargetUuid = this.getTarget().getUuid();

  // if the current target isn't the highest target, then switch!
  if (highestAggroTargetUuid !== currentTargetUuid)
  {
    // find the new target to change to that has more aggro than the current target.
    const newTarget = JABS_AiManager.getBattlerByUuid(highestAggroTargetUuid);

    // if we can't find the target on the map somehow, then try to remove it from the list of aggros.
    if (!newTarget)
    {
      // get the index to remove...
      this.removeAggro(highestAggroTargetUuid);
    }
    else
    {
      // we found it, let's engage!
      this.engageTarget(newTarget);
    }
  }

  // the current target IS the highest aggro! Continue as-usual.
};

/**
 * Gets all aggros on this battler.
 * @returns {JABS_Aggro[]}
 */
JABS_Battler.prototype.getAllAggros = function()
{
  return this._aggros;
};

/**
 * Gets the highest aggro currently tracked by this battler.
 * If the top two highest aggros are the same, this will add +1 to one of them
 * and use that instead to prevent infinite looping.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.getHighestAggro = function()
{
  // grab the aggros pre-sorted.
  const sortedAggros = this.getAggrosSortedHighestToLowest();

  // validate we have aggros.
  if (sortedAggros.length === 0)
  {
    // no aggros means no highest.
    return null;
  }

  // check if we only have a single aggro tracked.
  if (sortedAggros.length === 1)
  {
    // return that one aggro.
    return sortedAggros.at(0);
  }

  // otherwise, grab the first and second highest aggros.
  const [ highestAggro, secondHighestAggro, ] = sortedAggros;

  // check if the top two aggros are the same.
  if (highestAggro.aggro === secondHighestAggro.aggro)
  {
    // modify the first one by 1 to actually be higher.
    highestAggro.modAggro(1, true);
  }

  // return the result.
  return highestAggro;
};

/**
 * Gets all the aggros for this battler, sorted from highest to lowest.
 * @returns {JABS_Aggro[]}
 */
JABS_Battler.prototype.getAggrosSortedHighestToLowest = function()
{
  // a sorting function for determining the highest aggro from a collection.
  const sorting = (a, b) =>
  {
    if (a.aggro < b.aggro)
    {
      return 1
    }
    else if (a.aggro > b.aggro)
    {
      return -1;
    }

    return 0;
  };

  // grab the aggros.
  const aggros = this.getAllAggros();

  // sort them by their aggro rating.
  aggros.sort(sorting);

  // return the sorted aggros.
  return aggros;
};

/**
 * If the target is invalid somehow, then stop tracking its aggro.
 * @param {string} uuid The uuid of the target to potentially invalidate aggro for.
 */
JABS_Battler.prototype.removeAggroIfInvalid = function(uuid)
{
  // check if any of the captured conditions are true.
  if (this.isAggroInvalid(uuid))
  {
    // remove the aggro from this battler's tracking.
    this.removeAggro(uuid);
  }
};

/**
 * Determines whether or not this battler's aggro against a given target is invalid.
 * @param {string} uuid The uuid of the target to potentially invalidate aggro for.
 * @returns {boolean} True if the aggro is invalid, false otherwise.
 */
JABS_Battler.prototype.isAggroInvalid = function(uuid)
{
  // grab the battler from tracking.
  const battler = JABS_AiManager.getBattlerByUuid(uuid);

  // if the battler doesn't exist, then the aggro is invalid.
  if (!battler) return true;

  // if the battler is actually dead, then the aggro is invalid.
  if (battler.isDead()) return true;

  // if the battler is too far from this battler, then the aggro is invalid.
  if (battler.outOfRange(this)) return true;

  // the aggro must be valid.
  return false;
};

/**
 * Removes a single aggro by its `uuid`.
 * @param {string} uuid The `uuid` of the aggro to remove.
 */
JABS_Battler.prototype.removeAggro = function(uuid)
{
  // get the index to remove...
  const indexToRemove = this._aggros.findIndex(aggro => aggro.uuid() === uuid);
  if (indexToRemove > -1)
  {
    // if currently engaged with the dead target, then disengage.
    if (this.getTarget().getUuid() === uuid)
    {
      this.disengageTarget();
    }

    // ...and remove it.
    this._aggros.splice(indexToRemove, 1);
  }
};

/**
 * Adds a new aggro tracker to this battler, or updates an existing one.
 * @param {string} uuid The unique identifier of the target.
 * @param {number} aggroValue The amount of aggro being modified.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.addUpdateAggro = function(uuid, aggroValue, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler()
    .isAggroLocked() && !forced)
  {
    return;
  }

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro)
  {
    foundAggro.modAggro(aggroValue, forced);
  }
  else
  {
    const newAggro = new JABS_Aggro(uuid);
    newAggro.setAggro(aggroValue, forced);
    this._aggros.push(newAggro);
  }
};

/**
 * Resets the aggro for a particular target.
 * @param {string} uuid The unique identifier of the target to reset.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.resetOneAggro = function(uuid, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler()
    .isAggroLocked() && !forced)
  {
    return;
  }

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro)
  {
    foundAggro.resetAggro(forced);
  }
  else
  {
    // if the uuid provided is empty, then do nothing with it.
    if (!uuid) return;

    // otherwise, create a new aggro for this battler.
    this.addUpdateAggro(uuid, 0, forced);
  }
};

/**
 * Resets all aggro on this battler.
 * @param {string} uuid The unique identifier of the target resetting this battler's aggro.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.resetAllAggro = function(uuid, forced = false)
{
  // if the aggro is locked, don't adjust it.
  if (this.getBattler().isAggroLocked() && !forced) return;

  // reset the aggro of the battler that triggered this reset to prevent pursuit.
  this.resetOneAggro(uuid, forced);

  // and reset all aggros this battler has.
  this._aggros.forEach(aggro => aggro.resetAggro(forced));
};

/**
 * Gets an aggro by its unique identifier.
 * If the aggro doesn't exist, then returns undefined.
 * @param {string} uuid The unique identifier of the target resetting this battler's aggro.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.aggroExists = function(uuid)
{
  return this._aggros.find(aggro => aggro.uuid() === uuid);
};

//endregion aggro

//region create/apply effects
/**
 * Performs a preliminary check to see if the target is actually able to be hit.
 * @returns {boolean} True if actions can potentially connect, false otherwise.
 */
JABS_Battler.prototype.canActionConnect = function()
{
  // this battler is untargetable.
  if (this.isInvincible()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Debug)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter().isJabsAction())
  {
    return false;
  }

  // passes all the criteria.
  return true;
};

/**
 * Determines whether or not this battler is available as a target based on the
 * provided action's scopes.
 * @param {JABS_Action} action The action to check validity for.
 * @param {JABS_Battler} target The potential candidate for hitting with this action.
 * @param {boolean} alreadyHitOne Whether or not this action has already hit a target.
 */
JABS_Battler.prototype.isWithinScope = function(action, target, alreadyHitOne = false)
{
  const user = action.getCaster();
  const gameAction = action.getAction();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeSelf = gameAction.isForUser();
  const scopeMany = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();
  const scopeAllAllies = scopeAlly && scopeMany;
  const scopeAllOpponents = scopeOpponent && scopeMany;

  const targetIsSelf = (user.getUuid() === target.getUuid() || (action.getAction()
    .isForUser()));
  const actionIsSameTeam = user.getTeam() === this.getTeam();
  const targetIsOpponent = !user.isSameTeam(this.getTeam());

  // scope is for 1 target, and we already found one.
  if (scopeSingle && alreadyHitOne)
  {
    return false;
  }

  // the caster and target are the same.
  if (targetIsSelf && (scopeSelf || scopeAlly || scopeAllAllies || scopeEverything))
  {
    return true;
  }

  // action is from one of the target's allies.
  // inanimate battlers cannot be targeted by their allies with direct skills.
  if (actionIsSameTeam &&
    (scopeAlly || scopeAllAllies || scopeEverything) &&
    !(action.isDirectAction() && target.isInanimate()))
  {
    return true;
  }

  // action is for enemy battlers and scope is for opponents.
  if (targetIsOpponent && (scopeOpponent || scopeAllOpponents || scopeEverything))
  {
    return true;
  }

  // meets no criteria, target is not within scope of this action.
  return false;
};

/**
 * Creates a new `JABS_Action` from a skill id.
 * @param {number} skillId The id of the skill to create a `JABS_Action` from.
 * @param {boolean} isRetaliation True if this is a retaliation action, false otherwise.
 * @param {string} cooldownKey The cooldown key associated with this action.
 * @returns {JABS_Action[]} The `JABS_Action` based on the skill id provided.
 */
JABS_Battler.prototype.createJabsActionFromSkill = function(
  skillId,
  isRetaliation = false,
  cooldownKey = null)
{
  // create the underlying skill for the action.
  const action = new Game_Action(
    this.getBattler(),
    false);

  // set the skill which also applies all applicable overlays.
  action.setSkill(skillId);

  // grab the potentially extended skill.
  const skill = this.getSkill(skillId);

  // calculate the projectile count and directions.
  const projectileCount = skill.jabsProjectile ?? 1;
  const projectileDirections = $jabsEngine.determineActionDirections(
    this.getCharacter().direction(),
    projectileCount);

  // calculate how many actions will be generated to accommodate the directions.
  const actions = [];
  projectileDirections.forEach(direction =>
  {
    const mapAction = new JABS_Action({
      uuid: J.BASE.Helpers.generateUuid(),
      baseSkill: action.item(),
      teamId: this.getTeam(),
      gameAction: action,
      caster: this,
      isRetaliation: isRetaliation,
      direction: direction,
      cooldownKey: cooldownKey,
    });

    actions.push(mapAction);
  }, this);

  return actions;
};

/**
 * Constructs the attack data from this battler's skill slot.
 * @param {string} cooldownKey The cooldown key.
 * @returns {JABS_Action[]} The constructed `JABS_Action`s.
 */
JABS_Battler.prototype.getAttackData = function(cooldownKey)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // get the skill equipped in the designated slot.
  const skillId = this.getSkillIdForAction(cooldownKey);

  // if there isn't one, then we don't do anything.
  if (!skillId) return [];

  // check to make sure we can actually use the skill.
  if (!battler.meetsSkillConditions(battler.skill(skillId))) return [];

  // check to make sure we actually know the skill, too.
  if (!battler.hasSkill(skillId)) return [];

  // otherwise, use the skill from the slot to build an action.
  return this.createJabsActionFromSkill(skillId, false, cooldownKey);
};

/**
 * Gets the next skill id to create an action from for the given slot.
 * Accommodates combo actions.
 * @param {string} slot The slot for the skill to check.
 * @returns {number}
 */
JABS_Battler.prototype.getSkillIdForAction = function(slot)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // check the slot for a combo action.
  let skillId;

  // check if we have a skill id in the next combo action id slot.
  if (this.getComboNextActionId(slot) !== 0)
  {
    // capture the combo action id.
    skillId = this.getComboNextActionId(slot);
  }
  // if no combo...
  else
  {
    // then just grab the skill id in the slot.
    skillId = battler.getEquippedSkillId(slot);
  }

  // return whichever skill id was found.
  return skillId;
};

/**
 * Consumes an item and performs its effects.
 * @param {number} toolId The id of the tool/item to be used.
 * @param {boolean} isLoot Whether or not this is a loot pickup.
 */
// eslint-disable-next-line complexity
JABS_Battler.prototype.applyToolEffects = function(toolId, isLoot = false)
{
  // grab the item data.
  const item = $dataItems.at(toolId);

  // grab this battler.
  const battler = this.getBattler();

  // force the player to use the item.
  battler.consumeItem(item);

  // flag the slot for refresh.
  battler.getSkillSlotManager().getToolSlot().flagSkillSlotForRefresh();

  // also generate an action based on this tool.
  const gameAction = new Game_Action(battler, false);
  gameAction.setItem(toolId);

  // handle scopes of the tool.
  const scopeNone = gameAction.item().scope === 0;
  const scopeSelf = gameAction.isForUser();
  const scopeAlly = gameAction.isForFriend();
  const scopeOpponent = gameAction.isForOpponent();
  const scopeSingle = gameAction.isForOne();
  const scopeAll = gameAction.isForAll();
  const scopeEverything = gameAction.isForEveryone();

  const scopeAllAllies = scopeEverything || (scopeAll && scopeAlly);
  const scopeAllOpponents = scopeEverything || (scopeAll && scopeOpponent);
  const scopeOneAlly = (scopeSingle && scopeAlly);
  const scopeOneOpponent = (scopeSingle && scopeOpponent);

  // apply tool effects based on scope.
  if (scopeSelf || scopeOneAlly)
  {
    this.applyToolToPlayer(toolId);
  }
  else if (scopeEverything)
  {
    this.applyToolForAllAllies(toolId);
    this.applyToolForAllOpponents(toolId);
  }
  else if (scopeOneOpponent)
  {
    this.applyToolForOneOpponent(toolId);
  }
  else if (scopeAllAllies)
  {
    this.applyToolForAllAllies(toolId);
  }
  else if (scopeAllOpponents)
  {
    this.applyToolForAllOpponents(toolId);
  }
  else if (scopeNone)
  {
    // do nothing, the item has no scope and must be relying purely on the skillId.
  }
  else
  {
    console.warn(`unhandled scope for tool: [ ${gameAction.item().scope} ]!`);
  }

  // applies common events that may be a part of an item's effect.
  gameAction.applyGlobal();

  // create the log for the tool use.
  this.createToolLog(item);

  // extract the cooldown and skill id from the item.
  const { jabsCooldown: itemCooldown, jabsSkillId: itemSkillId } = item;

  // it was an item with a skill attached.
  if (itemSkillId)
  {
    const mapAction = this.createJabsActionFromSkill(itemSkillId);
    mapAction.forEach(action =>
    {
      action.setCooldownType(JABS_Button.Tool);
      $jabsEngine.executeMapAction(this, action);
    });
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item))
  {
    // remove the item from the slot.
    battler.getSkillSlotManager().clearSlot(JABS_Button.Tool);

    // build a lot for it.
    const log = new MapLogBuilder()
      .setupUsedLastItem(item.id)
      .build();
    $gameTextLog.addLog(log);
  }
  else
  {
    // it is an item with a custom cooldown.
    if (itemCooldown)
    {
      if (!isLoot) this.modCooldownCounter(JABS_Button.Tool, itemCooldown);
    }

    // it was an item, didn't have a skill attached, and didn't have a cooldown.
    if (!itemCooldown && !itemSkillId && !isLoot)
    {
      this.modCooldownCounter(JABS_Button.Tool, J.ABS.DefaultValues.CooldownlessItems);
    }
  }
};

/**
 * Applies the effects of the tool against the leader.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolToPlayer = function(toolId)
{
  // apply tool effects against player.
  const battler = this.getBattler();
  const gameAction = new Game_Action(battler, false);
  gameAction.setItem(toolId);
  gameAction.apply(battler);

  // display popup from item.
  this.generatePopItem(gameAction, toolId);

  // show tool animation.
  this.showAnimation($dataItems.at(toolId).animationId);
};

/**
 * Generates a popup based on the item used.
 * @param {Game_Action} gameAction The action describing the tool's effect.
 * @param {number} itemId The target having the action applied against.
 * @param {JABS_Battler} target The target for calculating damage; defaults to self.
 */
JABS_Battler.prototype.generatePopItem = function(gameAction, itemId, target = this)
{
  // if we are not using popups, then don't do this.
  if (!J.POPUPS) return;

  // grab some shorthand variables for local use.
  const character = this.getCharacter();
  const toolData = $dataItems.at(itemId);

  if (toolData.sdpKey !== String.empty)
  {
    $jabsEngine.generatePopItemBulk([toolData], character);
    return;
  }

  // generate the textpop.
  const itemPop = $jabsEngine.configureDamagePop(gameAction, toolData, this, target);

  // add the pop to the target's tracking.
  character.addTextPop(itemPop);
  character.requestTextPop();
};

/**
 * Applies the effects of the tool against all allies on the team.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllAllies = function(toolId)
{
  const battlers = $gameParty.battleMembers();
  if (battlers.length > 1)
  {
    battlers.shift(); // remove the leader, because that's the player.
    battlers.forEach(battler =>
    {
      const gameAction = new Game_Action(battler, false);
      gameAction.setItem(toolId);
      gameAction.apply(battler);
    });
  }

  // also apply effects to player/leader.
  this.applyToolToPlayer(toolId);
};

/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForOneOpponent = function(toolId)
{
  const item = $dataItems[toolId];
  let jabsBattler = this.getTarget();
  if (!jabsBattler)
  {
    // if we don't have a target, get the last hit battler instead.
    jabsBattler = this.getBattlerLastHit();
  }

  if (!jabsBattler)
  {
    // if we don't have a last hit battler, then give up on this.
    return;
  }

  // grab the battler being affected by this item.
  const battler = jabsBattler.getBattler();

  // create the game action based on the data.
  const gameAction = new Game_Action(battler, false);

  // apply the effects against the battler.
  gameAction.apply(battler);

  // generate the text popup for the item usage on the target.
  this.generatePopItem(gameAction, toolId, jabsBattler);
};

/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllOpponents = function(toolId)
{
  const battlers = JABS_AiManager.getEnemyBattlers();
  battlers.forEach(jabsBattler =>
  {
    // grab the battler being affected by this item.
    const battler = jabsBattler.getBattler();

    // create the game action based on the data.
    const gameAction = new Game_Action(battler, false);

    // apply the effects against the battler.
    gameAction.apply(battler);

    // generate the text popup for the item usage on the target.
    this.generatePopItem(gameAction, toolId);
  }, this);
};

/**
 * Creates the text log entry for executing an tool effect.
 * @param {RPG_Item} item The tool being used in the log.
 */
JABS_Battler.prototype.createToolLog = function(item)
{
  // if not enabled, skip this.
  if (!J.LOG) return;

  const log = new MapLogBuilder()
    .setupUsedItem(this.getReferenceData().name, item.id)
    .build();
  $gameTextLog.addLog(log);
};

/**
 * Executes the pre-defeat processing for a battler.
 * @param {JABS_Battler} victor The battler that defeated this battler.
 */
JABS_Battler.prototype.performPredefeatEffects = function(victor)
{
  // handle death animations first.
  this.handleOnDeathAnimations();

  // handle the skills executed when this battler is defeated.
  this.handleOnOwnDefeatSkills(victor);

  // handle skills executed when the victor defeats a target.
  this.handleOnTargetDefeatSkills(victor);
};

/**
 * Handles the on-death animations associated with this battler.
 */
JABS_Battler.prototype.handleOnDeathAnimations = function()
{
  // grab the loser battler.
  const battler = this.getBattler();

  // check if this is an actor with a death effect.
  if (battler.isActor() && battler.needsDeathEffect())
  {
    // perform the actor death animation.
    this.handleActorOnDeathAnimation();
  }
  // if not actor, then check for an enemy.
  else if (battler.isEnemy())
  {
    // perform the enemy death animation.
    this.handleEnemyOnDeathAnimation();
  }
};

/**
 * Handles the on-death animation for actors.
 * Since actors will persist as followers after defeat, they require additional
 * logic to prevent the repeated loop of death animation.
 */
JABS_Battler.prototype.handleActorOnDeathAnimation = function()
{
  // perform the actor death animation.
  this.showAnimation(152);

  // flag the death effect as "performed".
  this.getBattler().toggleDeathEffect();
};

/**
 * Handle the on-death animation for enemies.
 * Since they are instantly removed after, their logic doesn't require
 * toggling of battler death effects.
 */
JABS_Battler.prototype.handleEnemyOnDeathAnimation = function()
{
  // perform the enemy death animation.
  this.showAnimation(151);
};

/**
 * Handles the execution of any on-own-defeat skills the defeated battler may possess.
 * @param {JABS_Battler} victor The battler that defeated this battler.
 */
JABS_Battler.prototype.handleOnOwnDefeatSkills = function(victor)
{
  // grab the loser battler.
  const battler = this.getBattler();

  // grab all of the loser battler's on-death skills to execute.
  const onOwnDefeatSkills = battler.onOwnDefeatSkillIds();

  // an iterator function for executing all relevant on-own-defeat skills.
  const forEacher = onDefeatSkill =>
  {
    // extract out the data points from the skill.
    const { skillId } = onDefeatSkill;

    // roll the dice and see if we should trigger this on-own-death skill.
    if (onDefeatSkill.shouldTrigger())
    {
      // extract whether or not this on-defeat skill should be cast from the target.
      const castFromTarget = onDefeatSkill.appearOnTarget();

      // check if the skill should be cast from the target.
      if (castFromTarget)
      {
        // execute it from the target!
        $jabsEngine.forceMapAction(this, skillId, false, victor.getX(), victor.getY());
      }
      // it should be cast from the victor.
      else
      {
        // execute it from the caster like default.
        $jabsEngine.forceMapAction(this, skillId, false);
      }
    }
  };

  // iterate over each of the on-death skills.
  onOwnDefeatSkills.forEach(forEacher, this);
};

/**
 * Handles the execution of any on-target-defeat skills the victorious battler may possess.
 * @param {JABS_Battler} victor The battler that defeated this battler.
 */
JABS_Battler.prototype.handleOnTargetDefeatSkills = function(victor)
{
  // grab all of the victor battler's on-target-defeat skills.
  const onTargetDefeatSkills = victor.getBattler().onTargetDefeatSkillIds();

  // an iterator function for executing all relevant on-target-defeat skills.
  const forEacher = onDefeatSkill =>
  {
    // extract out the data points from the skill.
    const { skillId } = onDefeatSkill;

    // roll the dice and see if we should trigger this on-target-defeat skill.
    if (onDefeatSkill.shouldTrigger())
    {
      // extract whether or not this on-defeat skill should be cast from the target.
      const castFromTarget = onDefeatSkill.appearOnTarget();

      // check if the skill should be cast from the target.
      if (castFromTarget)
      {
        // execute it from the target!
        $jabsEngine.forceMapAction(victor, skillId, false, this.getX(), this.getY());
      }
      // it should be cast from the victor.
      else
      {
        // execute it from the caster like default.
        $jabsEngine.forceMapAction(victor, skillId, false);
      }
    }
  };

  // iterate over each the on-target-defeat skills.
  onTargetDefeatSkills.forEach(forEacher, this);
};

/**
 * Executes the post-defeat processing for a defeated battler.
 * @param {JABS_Battler} victor The battler that defeated this battler.
 */
JABS_Battler.prototype.performPostdefeatEffects = function(victor)
{
  // check if the defeated battler is an actor.
  if (this.isActor())
  {
    // flag them for death.
    this.setDying(true);
  }
};
//endregion apply effects

//region guarding
/**
 * Whether or not the precise-parry window is active.
 * @returns {boolean}
 */
JABS_Battler.prototype.parrying = function()
{
  return this._parryWindow > 0;
};

/**
 * Sets the battlers precise-parry window frames.
 * @param {number} parryFrames The number of frames available for precise-parry.
 */
JABS_Battler.prototype.setParryWindow = function(parryFrames)
{
  if (parryFrames < 0)
  {
    this._parryWindow = 0;
  }
  else
  {
    this._parryWindow = parryFrames;
  }
};

/**
 * Get whether or not this battler is currently guarding.
 * @returns {boolean}
 */
JABS_Battler.prototype.guarding = function()
{
  return this._isGuarding;
};

/**
 * Set whether or not this battler is currently guarding.
 * @param {boolean} isGuarding True if the battler is guarding, false otherwise.
 */
JABS_Battler.prototype.setGuarding = function(isGuarding)
{
  this._isGuarding = isGuarding;
};

/**
 * The flat amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.flatGuardReduction = function()
{
  if (!this.guarding()) return 0;

  return this._guardFlatReduction;
};

/**
 * Sets the battler's flat reduction when guarding.
 * @param {number} flatReduction The flat amount to reduce when guarding.
 */
JABS_Battler.prototype.setFlatGuardReduction = function(flatReduction)
{
  this._guardFlatReduction = flatReduction;
};

/**
 * The percent amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.percGuardReduction = function()
{
  if (!this.guarding()) return 0;

  return this._guardPercReduction;
};

/**
 * Sets the battler's percent reduction when guarding.
 * @param {number} percReduction The percent amount to reduce when guarding.
 */
JABS_Battler.prototype.setPercGuardReduction = function(percReduction)
{
  this._guardPercReduction = percReduction;
};

/**
 * Checks to see if retrieving the counter-guard skill id is appropriate.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterGuard = function()
{
  return this.guarding()
    ? this.counterGuardIds()
    : [];
};

/**
 * Gets the id of the skill for counter-guarding.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterGuardIds = function()
{
  return this._counterGuardIds;
};

/**
 * Sets the battler's retaliation id for guarding.
 * @param {number[]} counterGuardSkillIds The skill id to counter with while guarding.
 */
JABS_Battler.prototype.setCounterGuard = function(counterGuardSkillIds)
{
  this._counterGuardIds = counterGuardSkillIds;
};

/**
 * Checks to see if retrieving the counter-parry skill id is appropriate.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterParry = function()
{
  return this.guarding()
    ? this.counterParryIds()
    : [];
};

/**
 * Gets the ids of the skill for counter-parrying.
 * @returns {number[]}
 */
JABS_Battler.prototype.counterParryIds = function()
{
  return this._counterParryIds;
};

/**
 * Sets the id of the skill to retaliate with when successfully precise-parrying.
 * @param {number[]} counterParrySkillIds The skill ids of the counter-parry skill.
 */
JABS_Battler.prototype.setCounterParry = function(counterParrySkillIds)
{
  this._counterParryIds = counterParrySkillIds;
};

/**
 * Gets the guard skill id most recently assigned.
 * @returns {number}
 */
JABS_Battler.prototype.getGuardSkillId = function()
{
  return this._guardSkillId;
};

/**
 * Sets the guard skill id to a designated skill id.
 *
 * This gets removed when guarding/parrying.
 * @param guardSkillId
 */
JABS_Battler.prototype.setGuardSkillId = function(guardSkillId)
{
  this._guardSkillId = guardSkillId;
};

/**
 * Gets all data associated with guarding for this battler.
 * @returns {JABS_GuardData|null}
 */
JABS_Battler.prototype.getGuardData = function(cooldownKey)
{
  // shorthand the battler of which we're getting data for.
  const battler = this.getBattler();

  // determine the skill in the given slot.
  const skillId = battler.getEquippedSkillId(cooldownKey);

  // if we have no skill to guard with, then we don't guard.
  if (!skillId) return null;

  // if the skill isn't a guard skill, then it won't have guard data.
  if (!JABS_Battler.isGuardSkillById(skillId)) return null;

  // get the skill.
  const skill = this.getSkill(skillId);

  // check also to make sure we can use the guard skill in the slot.
  const canUse = battler.meetsSkillConditions(skill);

  // if we cannot use the guard skill due to constraints, then we don't guard.
  if (!canUse) return null;

  // return the guard data off the skill.
  return skill.jabsGuardData;
};

/**
 * Determines whether or not the skill slot is a guard-type skill or not.
 * @param {string} cooldownKey The key to determine if its a guard skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.prototype.isGuardSkillByKey = function(cooldownKey)
{
  // get the equipped skill in the given slot.
  const skillId = this.getBattler().getEquippedSkillId(cooldownKey);

  // if we don't hve a skill id, it isn't a guard skill.
  if (!skillId) return false;

  // if it it isn't a guard skill by its id, then ... it isn't a guard skill.
  if (!JABS_Battler.isGuardSkillById(skillId)) return false;

  // its a guard skill!
  return true;
};

/**
 * Triggers and maintains the guard state.
 * @param {boolean} guarding True if the battler is guarding, false otherwise.
 * @param {string} skillSlot The skill slot to build guard data from.
 */
JABS_Battler.prototype.executeGuard = function(guarding, skillSlot)
{
  // if we're still guarding, and already in a guard state, don't reset.
  if (guarding && this.guarding()) return;

  // if not guarding anymore, turn off the guard state.
  if (!guarding && this.guarding())
  {
    // stop guarding.
    this.endGuarding();

    // stop processing.
    return;
  }

  // if we aren't guarding now, and weren't guarding before, don't do anything.
  if (!guarding) return;

  // if not guarding, wasn't guarding before, but want to guard, then let's guard!
  const guardData = this.getGuardData(skillSlot);

  // if we cannot guard, then don't try.
  if (!guardData || !guardData.canGuard()) return;

  // begin guarding!
  this.startGuarding(skillSlot);
};

/**
 * Begin guarding with the given skill slot.
 * @param {string} skillSlot The skill slot containing the guard data.
 */
JABS_Battler.prototype.startGuarding = function(skillSlot)
{
  // grab the guard data.
  const guardData = this.getGuardData(skillSlot);

  // begin guarding!
  this.setGuarding(true);
  this.setFlatGuardReduction(guardData.flatGuardReduction);
  this.setPercGuardReduction(guardData.percGuardReduction);
  this.setCounterGuard(guardData.counterGuardIds);
  this.setCounterParry(guardData.counterParryIds);
  this.setGuardSkillId(guardData.skillId);

  // calculate parry frames, include eva bonus to parry.
  const totalParryFrames = this.getBonusParryFrames(guardData) + guardData.parryDuration;

  // if the guarding skill has a parry window, apply those frames once.
  if (guardData.canParry()) this.setParryWindow(totalParryFrames);

  // set the pose!
  const skillId = this.getBattler().getEquippedSkillId(skillSlot);
  this.performActionPose(this.getSkill(skillId));
};

/**
 * Ends the guarding stance for this battler.
 */
JABS_Battler.prototype.endGuarding = function()
{
  // end the guarding tracker.
  this.setGuarding(false);

  // remove any remaining parry time.
  this.setParryWindow(0);

  // stop posing.
  this.endAnimation();
};

/**
 * Abstraction of the definition of how to determine what the bonus to parry frames is.
 * @param {JABS_GuardData} guardData The guard data.
 * @returns {number}
 */
JABS_Battler.prototype.getBonusParryFrames = function(guardData)
{
  return Math.floor((this.getBattler().eva) * guardData.parryDuration);
};

/**
 * Counts down the parry window that occurs when guarding is first activated.
 */
JABS_Battler.prototype.countdownParryWindow = function()
{
  if (this.parrying())
  {
    this._parryWindow--;
  }

  if (this._parryWindow < 0)
  {
    this._parryWindow = 0;
  }
};
//endregion guarding

//region actionposes/animations
/**
 * Executes an action pose.
 * Will silently fail if the asset is missing.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill)
{
  // if we are still animating from a previous skill, prematurely end it.
  if (this._posing)
  {
    this.endAnimation();
  }

  // if we have a pose suffix for this skill, then try to perform the pose.
  if (skill.jabsPoseData)
  {
    this.changeCharacterSprite(skill);
  }
};

/**
 * Executes the change of character sprite based on the action pose data
 * from within a skill's notes.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.changeCharacterSprite = function(skill)
{
  // establish the base sprite data.
  const baseSpriteName = this.getCharacterSpriteName();
  this.captureBaseSpriteInfo();

  // define the duration for this pose.
  this.setAnimationCount(skill.jabsPoseDuration);

  // determine the new action pose sprite name.
  const newCharacterSprite = `${baseSpriteName}${skill.jabsPoseSuffix}`;

  // stitch the file path together with the sprite url.
  const spritePath = `img/characters/${Utils.encodeURI(newCharacterSprite)}.png`;

  // check if the sprite exists.
  const spriteExists = StorageManager.fileExists(spritePath);

  // only actually switch to the other character sprite if it exists.
  if (spriteExists)
  {
    // load the character into cache.
    ImageManager.loadCharacter(newCharacterSprite);

    // actually set the character.
    this.getCharacter().setImage(newCharacterSprite, skill.jabsPoseIndex);
  }
};

/**
 * Forcefully ends the pose animation.
 */
JABS_Battler.prototype.endAnimation = function()
{
  this.setAnimationCount(0);
  this.resetAnimation();
};

/**
 * Sets the pose animation count to a given amount.
 * @param {number} count The number of frames to animate for.
 */
JABS_Battler.prototype.setAnimationCount = function(count)
{
  this._poseFrames = count;
  if (this._poseFrames > 0)
  {
    this._posing = true;
  }

  if (this._poseFrames <= 0)
  {
    this._posing = false;
    this._poseFrames = 0;
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetAnimation = function()
{
  if (!this._baseSpriteImage && !this._baseSpriteIndex) return;
  if (this._posing)
  {
    this.endAnimation();
  }

  const originalImage = this._baseSpriteImage;
  const originalIndex = this._baseSpriteIndex;
  const currentImage = this.getCharacterSpriteName();
  const currentIndex = this.getCharacterSpriteIndex();
  const character = this.getCharacter();
  if (originalImage !== currentImage || originalIndex !== currentIndex)
  {
    character.setImage(originalImage, originalIndex);
  }
};
//endregion actionposes/animations

//region utility helpers
/**
 * Forces a display of a emoji balloon above this battler's head.
 * @param {number} balloonId The id of the balloon to display on this character.
 */
JABS_Battler.prototype.showBalloon = function(balloonId)
{
  $gameTemp.requestBalloon(this._event, balloonId);
};

/**
 * Displays an animation on the battler.
 * @param {number} animationId The id of the animation to play on the battler.
 */
JABS_Battler.prototype.showAnimation = function(animationId)
{
  this.getCharacter().requestAnimation(animationId);
};

/**
 * Checks if there is currently an animation playing on this character.
 * @returns {boolean} True if there is an animation playing, false otherwise.
 */
JABS_Battler.prototype.isShowingAnimation = function()
{
  return this.getCharacter().isAnimationPlaying();
};
//endregion utility helpers
//endregion JABS_Battler