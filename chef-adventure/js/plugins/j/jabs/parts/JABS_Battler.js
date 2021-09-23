/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of a JABS_Battler.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class represents the binding of a actor/enemy battler to an event.
 * This is the biggest and probably most complex class, as this owns a
 * majority of the responsibility for updating and maintaining itself and how
 * it interacts with others based on a variety of conditions ranging from
 * battler condition, battler AI, battler cooldowns, and so on.
 * 
 * Plugin Developer Notes:
 * It is worth noting that this initially was an ES5 class proper at one
 * point, but later was converted to this strange function/prototype model
 * later for common extensibility purposes.
 * ============================================================================
 */

/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 */
function JABS_Battler() { this.initialize(...arguments); }
//#region initialize battler
JABS_Battler.prototype = {};
JABS_Battler.prototype.constructor = JABS_Battler;

/**
 * Initializes this JABS battler.
 * @param {Game_Event} event The event the battler is bound to.
 * @param {Game_Battler} battler The battler data itself.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
 */
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData) {
  /**
   * The character/sprite that represents this battler on the map.
   * @type {Game_Character}
   */
  this._event = event;

  /**
   * The battler data that represents this battler's stats and information.
   * @type {Game_Battler}
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
  this.initAnimationInfo();
};

/**
 * Initializes the battler's core data from the comments.
 * @param {JABS_BattlerCoreData} battlerCoreData 
 */
JABS_Battler.prototype.initCoreData = function(battlerCoreData) {
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
   * The `JABS_BattlerAI` of this battler.
   * Only utilized by AI (duh).
   * @type {JABS_BattlerAI}
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
   * Whether or not this battler's danger indicator is visible.
   * Inanimate battlers do not show their danger indicator by default.
   * @type {boolean}
     */
  this._showDangerIndicator = battlerCoreData.isInanimate() 
    ? false // don't show danger indicator if inanimate.
    : battlerCoreData.showDangerIndicator();

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
JABS_Battler.prototype.initFromNotes = function() {
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
JABS_Battler.prototype.initGeneralInfo = function() {
  /**
   * Whether or not the movement for this battler is locked.
   * @type {boolean}
   */
  this._movementLock = false;

  /**
   * Whether or not this battler is waiting.
   * @type {boolean} True if battler is waiting, false otherwise.
   */
  this._waiting = false;

  /**
   * The counter for how long this battler is waiting.
   * @type {number}
   */
  this._waitCounter = 0;
};

/**
 * Initializes all properties that don't require input parameters.
 */
JABS_Battler.prototype.initBattleInfo = function() {
  /**
   * An object to track cooldowns within.
   * @type {JABS_Cooldown[]}
   */
  this._cooldowns = {};
  this.initCooldowns();

  /**
   * The collection of all states for this battler.
   * @type {any}
   */
  this._stateTracker = {};

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
   * @type {number}
   */
  this._leaderDecidedAction = null;

  /**
   * The `uuid` of the leader that is leading this battler.
   * This is only used for followers to prevent multiple leaders for commanding them.
   * @type {string}
   */
  this._leaderUuid = "";

  /**
   * A collection of `uuid`s from all follower battlers this battler is leading.
   * If this battler's AI does not contain the "leader" trait, this is unused.
   * @type {string[]}
   */
  this._followers = [];

  /**
   * The id of the skill that is set to be the next combo action.
   * Defaults to `0` if there is no combo available for a skill.
   * @type {number}
   */
  this._comboNextActionId = 0;

  /**
   * Whether or not the combo action is ready.
   * @type {boolean}
   */
  this._comboReady = false;

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
   * @type {number}
   */
  this._counterParryId = 0;

  /**
   * The id of the skill to retaliate with when successfully guarding.
   * @type {number}
   */
  this._counterGuardId = 0;

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
JABS_Battler.prototype.initIdleInfo = function() {
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
 * Initializes the properties of this battler that are related to the character graphics.
 */
JABS_Battler.prototype.initAnimationInfo = function() {
  /**
   * The number of frames to animate for.
   * @type {number}
   */
  this._animationFrames = 0;

  /**
   * Whether or not this battler is currently animating.
   * @type {boolean}
   */
  this._animating = false;

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
JABS_Battler.prototype.initCooldowns = function() {
  this.initializeCooldown("global", 0);
  if (this.isEnemy()) {
    // initialize all the skills assigned from the database.
    const skills = this.getSkillIdsFromEnemy();
    if (skills) {
      skills.forEach(skillIdAndRating => {
        const skill = $dataSkills[skillIdAndRating];
        this.initializeCooldown(skill.name, 0);
      })
    }

    // initialize the basic attack skill if identified.
    const basicAttackSkillAndRating = this.getEnemyBasicAttack();
    if (basicAttackSkillAndRating) {
      const basicAttack = $dataSkills[basicAttackSkillAndRating[0]];
      this.initializeCooldown(basicAttack.name, 0);
    }
  } else {
    // players don't need skills initialized, but they do need cooldown slots.
    this.initializeCooldown(Game_Actor.JABS_MAINHAND, 0);
    this.initializeCooldown(Game_Actor.JABS_OFFHAND, 0);
    this.initializeCooldown(Game_Actor.JABS_TOOLSKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_DODGESKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_A_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_B_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_X_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_L1_Y_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_A_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_B_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_X_SKILL, 0);
    this.initializeCooldown(Game_Actor.JABS_R1_Y_SKILL, 0);
  }
};
//#endregion initialize battler

//#region statics
/**
 * Generates the player character.
 */
JABS_Battler.createPlayer = function() {
  const battler = $gameParty.leader();
  let actorId = 0;
  if (battler) {
    actorId = battler.actorId();
  }

  const coreBattlerData = new JABS_BattlerCoreData({
    battlerId: actorId,
    teamId: JABS_Battler.allyTeamId(),
    battlerAI: "11000000",
    sightRange: 0,
    alertedSightBoost: 0,
    pursuitRange: 0,
    alertedPursuitBoost: 0,
    alertDuration: 0,
    canIdle: false,
    showHpBar: false,
    showDangerIndicator: false,
    showBattlerName: false,
    isInvincible: false,
    isInanimate: false
  });
  return new JABS_Battler($gamePlayer, battler, coreBattlerData);
};

/**
 * Determines if the battler is close to the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isClose = function(distance) {
  return distance <= 1.7;
};

/**
 * Determines if the battler is at a safe range from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isSafe = function(distance) {
  return (distance > 1.7) && (distance <= 3.5);
};

/**
 * Determines if the battler is far away from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isFar = function(distance) {
  return distance > 3.5;
};

/**
 * Determines whether or not the skill id is a guard-type skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.isGuardSkillById = function(id) {
  if (!id) return false;

  return $dataSkills[id].stypeId === J.ABS.DefaultValues.GuardSkillTypeId;
};

/**
 * Determines whether or not the skill id is a dodge-type skill or not.
 * @returns {boolean} True if it is a dodge skill, false otherwise.
 */
JABS_Battler.isDodgeSkillById = function(id) {
  if (!id) return false;

  return $dataSkills[id].stypeId === J.ABS.DefaultValues.DodgeSkillTypeId;
};

/**
 * Translates the AI attribute codes in `binary` form to a `JABS_BattlerAI`.
 * @param {string} code The code assigned in the notes that determines AI.
 * @returns {JABS_BattlerAI} The AI built off the provided attributes.
 */
JABS_Battler.translateAiCode = function(code) {
  return new JABS_BattlerAI(
    Boolean(parseInt(code[0]) === 1) || false, // basic
    Boolean(parseInt(code[1]) === 1) || false, // smart
    Boolean(parseInt(code[2]) === 1) || false, // executor
    Boolean(parseInt(code[3]) === 1) || false, // defensive
    Boolean(parseInt(code[4]) === 1) || false, // reckless
    Boolean(parseInt(code[5]) === 1) || false, // healer
    Boolean(parseInt(code[6]) === 1) || false, // follower
    Boolean(parseInt(code[7]) === 1) || false, // leader
  );
};

/**
 * Gets the team id for allies, including the player.
 * @returns {number}
 */
JABS_Battler.allyTeamId = function() {
  return 0;
};

/**
 * Gets the team id for enemies.
 * @returns {number}
 */
JABS_Battler.enemyTeamId = function() {
  return 1;
};

/**
 * Gets the team id for neutral parties.
 * @returns {number}
 */
JABS_Battler.neutralTeamId = function() {
  return 2;
};

/**
 * Gets the distance that allies are detected and can extend away from the player.
 * @returns {number}
 */
JABS_Battler.allyRubberbandRange = function() {
  return parseFloat(10 + J.ABS.Metadata.AllyRubberbandAdjustment);
};
//#endregion statics

//#region updates
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function() {
  // don't update map battlers if JABS is disabled.
  if (!$gameBattleMap.absEnabled) return;

  this.updateAnimations();
  this.updateCooldowns();
  this.updateEngagement();
  this.updateRG();
  this.updateDodging();
  this.updateDeathHandling();
};

/**
 * Update all character sprite animations executing on this battler.
 */
JABS_Battler.prototype.updateAnimations = function() {
  if (this._animating) {
    this.countdownAnimation();
  }
};

/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function() {
  Object.keys(this._cooldowns)
    .forEach(key => {
      this._cooldowns[key].update();
  });

  if (this.isWaiting()) {
    this.countdownWait();
  }

  if (this.isAlerted()) {
    this.countdownAlert();
  }

  if (this.parrying()) {
    this.getCharacter().requestAnimation(131, false);
    this.countdownParryWindow();
  }

  if (this.hasBattlerLastHit()) {
    this.countdownLastHit();
  }
};

/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function() {
  if (!this.canUpdateEngagement()) return;

  const targetResult = this.closestEnemyTarget();
  if (!targetResult[0] || targetResult[0].getUuid() === this.getUuid()) return;

  const target = targetResult[0];
  const distance = targetResult[1];
  if (this.isEngaged()) {
    if (this.shouldDisengage(distance)) {
      this.disengageTarget();
    }
  } else {
    if (this.shouldEngage(target, distance)) {
      this.engageTarget(target);
    }
  }
};

/**
 * If this battler is the player, a hidden battler, an inanimate battler, or the abs is paused, then
 * prevent engagement updates.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateEngagement = function() {
  return (!$gameBattleMap.absPause && !this.isPlayer() && !this.isHidden() && !this.isInanimate());
};

/**
 * Determines whether or not this battler should disengage from it's target.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldDisengage = function(distance) {
  return !this.inPursuitRange(distance);
};

/**
 * Determines whether or not this battler should engage to the nearest target.
 * @param {JABS_Battler} target The target to potentially engage.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEngage = function(target, distance) {
  return this.inSightRange(distance);
};

/**
 * Updates all regenerations and ticks four times per second.
 */
JABS_Battler.prototype.updateRG = function() {
  if (this.isRegenReady() && !this.getBattler().isDead()) {
    this.slipHp();
    this.slipMp();
    this.slipTp();
    this.setRegenCounter(15);
  }
};

/**
 * Updates the dodge skill.
 * Currently only used by the player.
 */
JABS_Battler.prototype.updateDodging = function() {
  if (!this.isPlayer()) return;

  // cancel the dodge if we got locked down.
  if (!this.canBattlerMove()) {
    this._dodging = false;
    this._dodgeSteps = 0;
  }

  // force dodge move while dodging.
  const player = this.getCharacter();
  if (!player.isMoving() && 
    this.canBattlerMove() &&
    this._dodgeSteps > 0 &&
    this._dodging) {
      player.moveStraight(this._dodgeDirection);
      this._dodgeSteps--;
  }

  // if the dodge is over, end the dodging.
  if (this._dodgeSteps <= 0 && !player.isMoving()) {
    this._dodging = false;
    this._dodgeSteps = 0;
    this.setInvincible(false);
  }
};

/**
 * Handles when this battler is dying.
 */
JABS_Battler.prototype.updateDeathHandling = function() {
  // don't do this for actors/players.
  if (this.isActor()) return;

  // do nothing if we are waiting.
  if (this.isWaiting()) return;

  // if we are dying, self-destruct.
  if (this.isDying() && !$gameMap._interpreter.isRunning()) {
    this.destroy();
  }
};
//#endregion updates

//#region update helpers
/**
 * Set whether or not the battler is strafing.
 * Only applicable to the player.
 * @param {boolean} strafing Whether or not the player is strafing. 
 */
JABS_Battler.prototype.setStrafing = function(strafing) {
  this._strafing = strafing;
};

/**
 * Counts down the duration for this battler's wait time.
 */
JABS_Battler.prototype.countdownWait = function() {
  if (this._waitCounter > 0) {
    this._waitCounter--;
    return;
  }

  if (this._waitCounter <= 0) {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Sets the battler's wait duration to a number. If this number is greater than
 * zero, then the battler must wait before doing anything else.
 * @param {number} wait The duration for this battler to wait.
 */
JABS_Battler.prototype.setWaitCountdown = function(wait) {
  this._waitCounter = wait;
  if (this._waitCounter > 0) {
    this._waiting = true;
  }

  if (this._waitCounter <= 0) {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Gets whether or not this battler is currently waiting.
 * @returns {boolean} True if waiting, false otherwise.
 */
JABS_Battler.prototype.isWaiting = function() {
  return this._waiting;
};

/**
 * Counts down the duration for this battler's cast time.
 */
JABS_Battler.prototype.countdownCastTime = function() {
  this.performCastAnimation();
  if (this._castTimeCountdown > 0) {
    this._castTimeCountdown--;
    return;
  }

  if (this._castTimeCountdown <= 0) {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * If there is a cast animation to play and there is no current animation playing,
 * then play the cast animation on this battler.
 */
JABS_Battler.prototype.performCastAnimation = function() {
  // if we don't have a decided action somehow, then don't do cast animation things.
  if (!this.getDecidedAction()) return;

  const { casterAnimation } = this.getDecidedAction()[0].getBaseSkill()._j;
  if (!casterAnimation) return;

  if (!this.getCharacter().isAnimationPlaying()) {
    this.showAnimation(casterAnimation);
  }
};

/**
 * Sets the cast time duration to a number. If this number is greater than
 * zero, then the battler must spend this duration in frames casting before
 * executing the skill.
 * @param {number} castTime The duration in frames to spend casting.
 */
JABS_Battler.prototype.setCastCountdown = function(castTime) {
  this._castTimeCountdown = castTime;
  if (this._castTimeCountdown > 0) {
    this._casting = true;
  }

  if (this._castTimeCountdown <= 0) {
    this._casting = false;
    this._castTimeCountdown = 0;
  }
};

/**
 * Gets whether or not this battler is currently casting a skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isCasting = function() {
  return this._casting;
};

/**
 * Counts down the alertedness of this battler.
 */
JABS_Battler.prototype.countdownAlert = function() {
  if (this._alertedCounter > 0) {
    this._alertedCounter--;
    return;
  }

  if (this._alertedCounter <= 0) {
    this.clearAlert();
  }
};

/**
 * Removes and clears the alert state from this battler.
 */
JABS_Battler.prototype.clearAlert = function() {
  this.setAlerted(false);
  this._alertedCounter = 0;
  if (!this.isEngaged()) {
    this.showBalloon(J.ABS.Balloons.Silence);
  }
};

//#region dodging
/**
 * Gets whether or not this battler is dodging.
 * @returns {boolean} True if currently dodging, false otherwise.
 */
JABS_Battler.prototype.isDodging = function() {
  return this._dodging;
};

/**
 * Sets whether or not this battler is dodging.
 * @param {boolean} dodging Whether or not the battler is dodging (default = true).
 */
JABS_Battler.prototype.setDodging = function(dodging = true) {
  this._dodging = dodging;
};

/**
 * Tries to execute the battler's dodge skill.
 * Checks to see if costs are payable before executing.
 */
JABS_Battler.prototype.tryDodgeSkill = function() {
  const battler = this.getBattler();
  const skillId = battler.getEquippedSkill(Game_Actor.JABS_DODGESKILL);
  if (!skillId) return;

  const skill = $dataSkills[skillId];
  const canPay = battler.canPaySkillCost(skill);
  if (canPay && skill._j.moveType) {
    this.executeDodgeSkill(skill);
  }
};

/**
 * Executes the provided dodge skill.
 * @param {object} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill) {
  const { moveType, range, cooldown, invincible } = skill._j;
  const player = this.getCharacter();

  this.setInvincible(invincible);
  this.performActionPose(skill);
  const dodgeSpeed = 2;
  const direction = this.determineDodgeDirection(moveType);
  player.setDodgeBoost(dodgeSpeed);

  this._dodgeSteps = range;
  this._dodgeDirection = direction;
  this.setDodging();

  const battler = this.getBattler();
  battler.paySkillCost(skill);
  this.modCooldownCounter(Game_Actor.JABS_DODGESKILL, cooldown);
};

/**
 * Translates a dodge skill type into a direction to move.
 * @param {string} moveType The type of dodge skill the player is using.
 */
JABS_Battler.prototype.determineDodgeDirection = function(moveType) {
  const player = this.getCharacter();
  let direction;
  switch (moveType) {
    case J.ABS.Notetags.MoveType.Forward:
      direction = player.direction();
      break;
    case J.ABS.Notetags.MoveType.Backward:
      direction = player.reverseDir(player.direction());
      break;
    case J.ABS.Notetags.MoveType.Directional:
      if (Input.isPressed("up")) {
        direction = J.ABS.Directions.UP;
      } else if (Input.isPressed("right")) {
        direction = J.ABS.Directions.RIGHT;
      } else if (Input.isPressed("left")) {
        direction = J.ABS.Directions.LEFT;
      } else if (Input.isPressed("down")) {
        direction = J.ABS.Directions.DOWN;
      } else {
        direction = player.direction();
      }
      break;
    default:
      direction = player.direction();
      break;
  }

  return direction;
};
//#endregion dodging

/**
 * Whether or not the regen tick is ready.
 * @returns {boolean} True if its time for a regen tick, false otherwise.
 */
JABS_Battler.prototype.isRegenReady = function() {
  if (this.getRegenCounter() <= 0) {
    this.setRegenCounter(0);
    return true;
  } else {
    this._regenCounter--;
    return false;
  }
};

/**
 * Gets the current count on the regen counter.
 * @returns {number}
 */
JABS_Battler.prototype.getRegenCounter = function() {
  return this._regenCounter;
};

/**
 * Sets the regen counter to a given number.
 * @param {number} count The count to set the regen counter to.
 */
JABS_Battler.prototype.setRegenCounter = function(count) {
  this._regenCounter = count;
};

/**
 * Manages hp regeneration/poison from a battler's HRG and current states.
 */
JABS_Battler.prototype.slipHp = function() {
  const battler = this.getBattler();
  const hrg = battler.hrg * 100;
  let hp5 = hrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let hp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipHpFlat, slipHpPerc, slipHpFormula } = state._j;
        if (slipHpFlat) {
          hp5mod += slipHpFlat;
          needPop = true;
        }
        
        if (slipHpPerc) {
          const factor = battler.mhp * (slipHpPerc / 100);
          hp5mod += factor;
          needPop = true;
        }

        if (slipHpFormula) {
          const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
          const a = trackedState.source;  // the one who applied the state.
          const b = trackedState.battler; // this battler, afflicted by the state.
          const v = $gameVariables._data; // access to variables if you need it.
          const result = Math.round(eval(slipHpFormula) * -1);
          if (Number.isFinite(result)) {
            hp5mod += result;
            needPop = true;
          } else {
            console.warn(`The state of ${state.id} has a formula producing a result that isn't valid.`);
            console.warn(`formula parsed: ${slipHpFormula}`);
            console.warn(`result produced: ${result}`);
          }
        }
      }
    });
  }

  hp5mod /= 4; // 4x per second
  hp5mod /= 5; // "per 5" seconds
  hp5 += hp5mod;
  battler.gainHp(hp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (hp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(hp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Manages mp regeneration/poison from a battler's MRG and current states.
 */
JABS_Battler.prototype.slipMp = function() {
  const battler = this.getBattler();
  const mrg = battler.mrg * 100;
  let mp5 = mrg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let mp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipMpFlat, slipMpPerc, slipMpFormula } = state._j;
        if (slipMpFlat) {
          mp5mod += slipMpFlat;
        }
        
        if (slipMpPerc) {
          const factor = battler.mmp * (slipMpPerc / 100);
          mp5mod += factor;
        }

        if (slipMpFormula) {
          const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
          const a = trackedState.source;  // the one who applied the state.
          const b = trackedState.battler; // this battler, afflicted by the state.
          const v = $gameVariables._data; // access to variables if you need it.
          const result = Math.round(eval(slipMpFormula) * -1);
          if (Number.isFinite(result)) {
            mp5mod += result;
            needPop = true;
          } else {
            console.warn(`The state of ${state.id} has a formula producing a result that isn't valid.`);
            console.warn(`formula parsed: ${slipMpFormula}`);
            console.warn(`result produced: ${result}`);
          }
        }
      }
    });
  }

  mp5mod /= 4;
  mp5mod /= 5;
  mp5 += mp5mod;
  battler.gainMp(mp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (mp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(mp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Manages tp regeneration/poison from a battler's TRG and current states.
 */
JABS_Battler.prototype.slipTp = function() {
  const battler = this.getBattler();
  const trg = battler.trg * 100;
  let tp5 = trg / 4 / 5; // regen 4x per second, for 5 seconds == rg.
  let tp5mod = 0;
  let needPop = false;
  const states = battler.states();
  if (states.length) {
    states.forEach(state => {
      if (state.meta) {
        const { slipTpFlat, slipTpPerc, slipTpFormula } = state._j;
        if (slipTpFlat) {
          tp5mod += slipTpFlat;
        }
        
        if (slipTpPerc) {
          const factor = battler.maxTp() * (slipTpPerc / 100);
          tp5mod += factor;
        }

        if (slipTpFormula) {
          const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
          const a = trackedState.source;  // the one who applied the state.
          const b = trackedState.battler; // this battler, afflicted by the state.
          const v = $gameVariables._data; // access to variables if you need it.
          const result = Math.round(eval(slipTpFormula) * -1);
          if (Number.isFinite(result)) {
            tp5mod += result;
            needPop = true;
          } else {
            console.warn(`The state of ${state.id} has a formula producing a result that isn't valid.`);
            console.warn(`formula parsed: ${slipTpFormula}`);
            console.warn(`result produced: ${result}`);
          }
        }
      }
    });
  }

  tp5mod /= 4;
  tp5mod /= 5;    
  tp5 += tp5mod;
  battler.gainTp(tp5);

  if (needPop) {
    const character = this.getCharacter();
    const textColor = (tp5 > 0) ? 3 : 0;
    const iconId = 0;
    const actionResult = null;
    const directValue = Math.ceil(tp5);
    const popup = new JABS_TextPop(
      actionResult,
      iconId,
      textColor,
      false,
      false,
      "damage",
      directValue);
    character.addTextPop(popup);
    character.setRequestTextPop();
  }
};

/**
 * Determines the closest enemy target.
 * @returns {[JABS_Battler, number]}
 */
JABS_Battler.prototype.closestEnemyTarget = function() {
  const battlers = $gameMap.getOpposingBattlersWithinRange(this, this.getSightRadius());
  let currentClosest = null;
  let closestDistanceYet = 1000;
  battlers.forEach(battler => {
    // don't engage same team and don't engage self
    if (this.isSameTeam(battler.getTeam())) return;
    if (this.getUuid() === battler.getUuid()) return;

    const distance = this.distanceToDesignatedTarget(battler);
    if (distance < closestDistanceYet) {
      // track and capture the closest
      closestDistanceYet = distance;
      currentClosest = battler;
    }
  })

  return [currentClosest, closestDistanceYet];
};

/**
 * Gets whether or not this battler's movement is locked.
 * @returns {boolean} True if the battler's movement is locked, false otherwise.
 */
JABS_Battler.prototype.isMovementLocked = function() {
  return this._movementLock;
};

/**
 * Sets the battler's movement lock.
 * @param {boolean} locked Whether or not the battler's movement is locked (default = true).
 */
JABS_Battler.prototype.setMovementLock = function(locked = true) {
  this._movementLock = locked;
};

/**
 * Whether or not the battler is able to move.
 * A variety of things can impact the ability for a battler to move.
 * @returns {boolean} True if the battler can move, false otherwise.
 */
JABS_Battler.prototype.canBattlerMove = function() {
  if (this.isMovementLocked()) {
    return false;
  }

  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const rooted = states.find(state => (state._j.rooted || state._j.paralyzed));
    return !rooted;
  }
};

/**
 * Whether or not the battler is able to use attacks based on states.
 * @returns {boolean} True if the battler can attack, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseAttacks = function() {
  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const disabled = states.find(state => (state._j.disabled || state._j.paralyzed));
    return !disabled;
  }
};

/**
 * Whether or not the battler is able to use skills based on states.
 * @returns {boolean} True if the battler can use skills, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseSkills = function() {
  const states = this.getBattler().states();
  if (!states.length) {
    return true;
  } else {
    const muted = states.find(state => (state._j.muted || state._j.paralyzed));
    return !muted;
  }
};

/**
 * Initializes the sprite info for this battler.
 */
JABS_Battler.prototype.captureBaseSpriteInfo = function() {
  this.setBaseSpriteName(this.getCharacterSpriteName());
  this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};

/**
 * Gets the name of this battler's current character sprite.
 * @returns {string}
 */
JABS_Battler.prototype.getCharacterSpriteName = function() {
  return this.getCharacter()._characterName;
};

/**
 * Gets the index of this battler's current character sprite.
 * @returns {number}
 */
JABS_Battler.prototype.getCharacterSpriteIndex = function() {
  return this.getCharacter()._characterIndex;
};

/**
 * Sets the name of this battler's original character sprite.
 * @param {string} name The name to set.
 */
JABS_Battler.prototype.setBaseSpriteName = function(name) {
  this._baseSpriteImage = name;
};

/**
 * Sets the index of this battler's original character sprite.
 * @param {number} index The index to set.
 */
JABS_Battler.prototype.setBaseSpriteIndex = function(index) {
  this._baseSpriteIndex = index;
};
//#endregion update helpers

//#region reference helpers
/**
 * Reassigns the character to something else.
 * @param {Game_Character} newCharacter The new character to assign.
 */
JABS_Battler.prototype.setCharacter = function(newCharacter) {
  this._event = newCharacter;
};

/**
 * Gets the battler's name.
 * @returns {string}
 */
JABS_Battler.prototype.battlerName = function() {
  return this.getReferenceData().name;
};

/**
 * Events that have no actual conditions associated with them may have a -1 index.
 * Ignore that if that's the case.
 */
JABS_Battler.prototype.hasEventActions = function() {
  // allies and the player don't have event commands.
  if (this.isActor()) return false;

  const event = this.getCharacter();
  return event._pageIndex !== -1;
};

/**
 * Whether or not the battler has an "offhand" piece of gear equipped.
 * This can either be a dual-wielded second weapon, or the first armor equipped.
 * @returns {boolean} True if the battler has offhand equip with a skill, false otherwise.
 */
JABS_Battler.prototype.hasOffhandSkill = function() {
  const battler = this.getBattler();
  const offhandGear = battler.equips()[1];
  return !!(offhandGear && offhandGear._j.skillId);
};

/**
 * Destroys this battler and removes it from the current battle map.
 */
JABS_Battler.prototype.destroy = function() {
  this.setInvincible();
  $gameMap.destroyBattler(this);
};

/**
 * Reveals this battler onto the map.
 */
JABS_Battler.prototype.revealHiddenBattler = function() {
  this._hidden = false;
};

/**
 * Hides this battler from the current battle map.
 */
JABS_Battler.prototype.hideBattler = function() {
  this._hidden = true;
};

/**
 * Whether or not this battler is hidden on the current battle map.
 */
JABS_Battler.prototype.isHidden = function() {
  return this._hidden;
};

/**
 * Whether or not this battler is in a state of dying.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDying = function() {
  return this._dying;
};

/**
 * Sets whether or not this battler is in a state of dying.
 * @param {boolean} dying The new state of dying.
 */
JABS_Battler.prototype.setDying = function(dying) {
  this._dying = dying;
};

/**
 * Calculates whether or not this battler should continue fighting it's target.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
 JABS_Battler.prototype.inPursuitRange = function(distance) {
  return (distance <= this.getPursuitRadius());
};

/**
 * Calculates whether or not this battler should engage the nearest battler.
 * @param {number} distance The distance from this battler to the target.
 * @returns {boolean}
 */
JABS_Battler.prototype.inSightRange = function(distance) {
  return (distance <= this.getSightRadius());
};

/**
 * Gets this battler's unique identifier.
 * @returns {string}
 */
JABS_Battler.prototype.getUuid = function() {
  // if there is problems with the battler, return nothing.
  if (!this.getBattler()) return "";

  return this.getBattler().getUuid();
};

/**
 * Gets whether or not this battler has any pending actions decided
 * by this battler's leader.
 */
JABS_Battler.prototype.hasLeaderDecidedActions = function() {
  // if you don't have a leader, you don't perform the actions.
  if (!this.hasLeader()) return false;

  return this._leaderDecidedAction;
};

/**
 * Gets the next skill id from the queue of leader-decided actions.
 * Also removes it from the current queue.
 * @returns {number}
 */
JABS_Battler.prototype.getNextLeaderDecidedAction = function() {
  const action = this._leaderDecidedAction;
  this.clearLeaderDecidedActionsQueue();
  return action;
};

/**
 * Adds a new action decided by the leader for the follower to perform.
 * @param {number} skillId The skill id decided by the leader.
 */
JABS_Battler.prototype.setLeaderDecidedAction = function(skillId) {
  this._leaderDecidedAction = skillId;
};

/**
 * Clears all unused leader-decided actions that this follower had pending.
 */
JABS_Battler.prototype.clearLeaderDecidedActionsQueue = function() {
  this._leaderDecidedAction = null;
};

/**
 * Gets the leader's `uuid` of this battler.
 */
JABS_Battler.prototype.getLeader = function() {
  return this._leaderUuid;
};

/**
 * Gets the battler for this battler's leader.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getLeaderBattler = function() {
  if (this._leaderUuid) {
    return $gameMap.getBattlerByUuid(this._leaderUuid);
  } else {
    return null;
  }
};

/**
 * Sets the `uuid` of the leader of this battler.
 * @param {string} newLeader The leader's `uuid`.
 */
JABS_Battler.prototype.setLeader = function(newLeader) {
  const leader = $gameMap.getBattlerByUuid(newLeader);
  if (leader) {
    this._leaderUuid = newLeader;
    leader.addFollower(this.getUuid());
  }
};

/**
 * Gets whether or not this battler has a leader.
 * Only battlers with the ai-trait of `follower` can have leaders.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasLeader = function() {
  return !!this._leaderUuid;
};

/**
 * Gets all followers associated with this battler.
 * Only leaders can have followers.
 * @return {string[]} The `uuid`s of all followers.
 */
JABS_Battler.prototype.getFollowers = function() {
  return this._followers;
};

/**
 * Gets the whole battler of the follower matching the `uuid` provided.
 * @param {string} followerUuid The `uuid` of the follower to find.
 * @returns {JABS_Battler} 
 */
JABS_Battler.prototype.getFollowerByUuid = function(followerUuid) {
  // if we don't have followers, just return null.
  if (!this.hasFollowers()) return null;

  // search through the followers to find the matching battler.
  const foundUuid = this._followers.find(uuid => uuid === followerUuid);
  if (foundUuid) {
    return $gameMap.getBattlerByUuid(foundUuid);
  }
  else {
    return null;
  }
};

/**
 * Adds a follower to the leader's collection.
 * @param {string} newFollowerUuid The new uuid of the follower now being tracked.
 */
JABS_Battler.prototype.addFollower = function(newFollowerUuid) {
  const found = this.getFollowerByUuid(newFollowerUuid);
  if (found) {
    console.error("this follower already existed within the follower list.");
  } else {
    this._followers.push(newFollowerUuid);
  }
};

/**
 * Removes the follower from 
 * @param {string} oldFollowerUuid The `uuid` of the follower to remove from tracking.
 */
JABS_Battler.prototype.removeFollower = function(oldFollowerUuid) {
  const index = this._followers.indexOf(uuid => uuid === oldFollowerUuid);
  if (index !== -1) {
    this._followers.splice(index, 1);
  } else {
    console.error("could not find follower to remove from the list.", oldFollowerUuid);
  }
};

/**
 * Clears all current followers from this battler.
 */
JABS_Battler.prototype.clearFollowers = function() {
  // first de-assign leadership from all followers for this leader...
  this._followers.forEach(followerUuid => {
    $gameBattleMap.clearLeaderDataByUuid(followerUuid);
  });

  // ...then empty the collection.
  this._followers.splice(0, this._followers.length);
};

/**
 * Removes this follower's leader.
 */
JABS_Battler.prototype.clearLeader = function() {
  // get the leader's uuid for searching.
  const leaderUuid = this.getLeader();
  // if found, remove this follower from that leader.
  if (leaderUuid) {
    const uuid = this.getUuid();
    // in some instances, "this" may not be alive anymore so handle that.
    if (!uuid) return;

    const leader = $gameMap.getBattlerByUuid(leaderUuid);
    if (!leader) return;

    leader.removeFollowerByUuid(uuid);
  }
};

/**
 * Removes a follower from it's current leader.
 * @param {string} uuid The `uuid` of the follower to remove from the leader.
 */
JABS_Battler.prototype.removeFollowerByUuid = function(uuid) {
  const index = this._followers.indexOf(uuid);
  if (index !== -1) {
    this._followers.splice(index, 1);
  }
};

/**
 * Removes the leader data from this battler.
 */
JABS_Battler.prototype.clearLeaderData = function() {
  this.setLeader("");
  this.clearLeaderDecidedActionsQueue();
};

/**
 * Gets whether or not this battler has followers.
 * Only battlers with the AI trait of "leader" will have followers.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasFollowers = function() {
  // if you're not a leader, you can't have followers.
  if (!this.getAiMode().leader) return false;

  return this._followers.length > 0;
};

/**
 * Gets the database data for this battler.
 * @returns {(Game_Actor|Game_Enemy)} The battler data.
 */
JABS_Battler.prototype.getReferenceData = function() {
  if (!this.getBattler()) return {};

  if (this.isActor()) {
    return this.getBattler().actor();
  } else if (this.getBattler().isEnemy()) {
    return this.getBattler().enemy();
  }
};

/**
 * Determines if this battler is facing its target.
 * @param {Game_Character} target The target `Game_Character` to check facing for.
 */
JABS_Battler.prototype.isFacingTarget = function(target) {
  const userDir = this.getCharacter().direction();
  const targetDir = target.direction();

  switch (userDir) {
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
JABS_Battler.prototype.isPlayer = function() {
  return (this.getCharacter() instanceof Game_Player);
};

/**
 * Whether or not this battler is a `Game_Actor`. 
 * The player counts as a `Game_Actor`, too.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActor = function() {
  return (this.isPlayer() || this.getBattler() instanceof Game_Actor)
};

/**
 * Whether or not this battler is a `Game_Enemy`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEnemy = function() {
  return (this.getBattler() instanceof Game_Enemy);
};

/**
 * Compares the user with a provided target team to see if they are the same.
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean} True if the user and target are on the same team, false otherwise.
 */
JABS_Battler.prototype.isSameTeam = function(targetTeam) {
  return (this.getTeam() === targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "friendly".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isFriendlyTeam = function(targetTeam) {
  // TODO: parameterize in objects what are "opposing" teams.
  return [this.getTeam()].includes(targetTeam);
};

/**
 * Gets whether or not the provided target team is considered "opposing".
 * @param {number} targetTeam The id of the team to check.
 * @returns {boolean}
 */
JABS_Battler.prototype.isOpposingTeam = function(targetTeam) {
  // TODO: parameterize in objects what are "friendly" teams.
  return !(targetTeam === this.getTeam());
  //return [].includes(targetTeam);
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_Battler.prototype.getTeam = function() {
  return this._team;
};

/**
 * Gets the phase of battle this battler is currently in.
 * The player does not have any phases.
 * @returns {number} The phase this `JABS_Battler` is in. 
 */
JABS_Battler.prototype.getPhase = function() {
  return this._phase;
};

/**
 * Gets whether or not this battler is invincible.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInvincible = function() {
  return this._invincible;
};

/**
 * Gets whether or not this battler is inanimate.
 * @returns {boolean}
 */
JABS_Battler.prototype.isInanimate = function() {
  return this._inanimate;
};

/**
 * Sets this battler to be invincible, rendering them unable to be collided
 * with by map actions of any kind.
 * @param {boolean} invincible True if uncollidable, false otherwise (default: true).
 */
JABS_Battler.prototype.setInvincible = function(invincible = true) {
  this._invincible = invincible;
};

/**
 * Sets the phase of battle that this battler should be in.
 * @param {number} newPhase The new phase the battler is entering.
 */
JABS_Battler.prototype.setPhase = function(newPhase) {
  this._phase = newPhase;
};

/**
 * Resets the phase of this battler back to one and resets all flags.
 */
JABS_Battler.prototype.resetPhases = function() {
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
JABS_Battler.prototype.isInPosition = function() {
  return this._inPosition;
};

/**
 * Sets this battler to be identified as "in position" to execute their
 * decided skill.
 * @param {boolean} inPosition 
 */
JABS_Battler.prototype.setInPosition = function(inPosition = true) {
  this._inPosition = inPosition;
};

/**
 * Gets whether or not this battler has decided an action.
 * @returns {boolean}
 */
JABS_Battler.prototype.isActionDecided = function() {
  return this._decidedAction !== null;
};

/**
 * Gets the battler's decided action.
 * @returns {JABS_Action[]}
 */
JABS_Battler.prototype.getDecidedAction = function() {
  return this._decidedAction;
};

/**
 * Sets this battler's decided action to this action.
 * @param {JABS_Action[]} action The action this battler has decided on.
 */
JABS_Battler.prototype.setDecidedAction = function(action) {
  this._decidedAction = action;
};

/**
 * Clears this battler's decided action.
 */
JABS_Battler.prototype.clearDecidedAction = function() {
  this._decidedAction = null;
};

/**
 * Resets the idle action back to a not-ready state.
 */
JABS_Battler.prototype.resetIdleAction = function() {
  this._idleActionReady = false;
};

/**
 * Returns the `Game_Character` that this `JABS_Battler` is bound to.
 * For the player, it'll return a subclass instead: `Game_Player`.
 * @returns {Game_Character} The event this `JABS_Battler` is bound to.
 */
JABS_Battler.prototype.getCharacter = function() {
  return this._event;
};

/**
 * Returns the `Game_Battler` that this `JABS_Battler` represents. 
 * 
 * This may be either a `Game_Actor`, or `Game_Enemy`.
 * @returns {Game_Battler} The `Game_Battler` this battler represents.
 */
JABS_Battler.prototype.getBattler = function() {
  return this._battler;
};

/**
   * Whether or not the event is actually loaded and valid.
   * @returns {boolean} True if the event is valid (non-player) and loaded, false otherwise.
 */
JABS_Battler.prototype.isEventReady = function() {
  const character = this.getCharacter();
  if (character instanceof Game_Player) {
    return false;
  } else {
    return !!character.event();
  }
};

/**
 * The radius a battler of a different team must enter to cause this unit to engage.
 * @returns {number} The sight radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getSightRadius = function() {
  let sight = this._sightRadius;
  if (this.isAlerted()) {
    sight += this._alertedSightBoost;
  }

  return sight;
};

/**
 * The maximum distance a battler of a different team may reach before this unit disengages.
 * @returns {number} The pursuit radius for this `JABS_Battler`.
 */
JABS_Battler.prototype.getPursuitRadius = function() {
  let pursuit = this._pursuitRadius;
  if (this.isAlerted()) {
    pursuit += this._alertedPursuitBoost;
  }

  return pursuit;
};

/**
 * Whether or not this `JABS_Battler` is currently engaged in battle with a target.
 * @returns {boolean} Whether or not this battler is engaged.
 */
JABS_Battler.prototype.isEngaged = function() {
  return this._engaged;
};

/**
 * Engage battle with the target battler.
 * @param {JABS_Battler} target The target this battler is engaged with.
 */
JABS_Battler.prototype.engageTarget = function(target) {
  // this battler cannot engage with targets right now.
  if (this.isEngagementLocked()) return;

  this._engaged = true;
  this.setTarget(target);
  this.setIdle(false);
  this.addUpdateAggro(target.getUuid(), 0);
  this.showBalloon(J.ABS.Balloons.Exclamation);
  if (this.isActor()) {
    // disable walking through walls while the follower is engaged.
    this.getCharacter().setThrough(false);
  }

  // if we're alerted, also clear the alert state.
  this.clearAlert();
};

/**
 * Disengage from the target.
 */
JABS_Battler.prototype.disengageTarget = function() {
  this.setTarget(null);
  this.setAllyTarget(null);
  this._engaged = false;
  this.clearFollowers();
  this.clearLeaderData();
  this.clearDecidedAction();
  this.showBalloon(J.ABS.Balloons.Frustration);
};

/**
 * Gets whether or not this battler is currently barred from engagement.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEngagementLocked = function() {
  return this._engagementLock;
};

/**
 * Locks engagement.
 * Disables the ability for this battler to acquire a target and do battle.
 */
JABS_Battler.prototype.lockEngagement = function() {
  this._engagementLock = true;
};

/**
 * Unlocks engagement.
 * Allows this battler to engage with targets and do battle.
 */
JABS_Battler.prototype.unlockEngagement = function() {
  this._engagementLock = false;
};

/**
 * Gets the current target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getTarget = function() {
  return this._target;
};

/**
 * Sets the target of this battler.
 * @param {JABS_Battler} newTarget The new target.
 */
JABS_Battler.prototype.setTarget = function(newTarget) {
  this._target = newTarget;
};

/**
 * Gets the last battler struck by this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getBattlerLastHit = function() {
  if (this._lastHit && this._lastHit.isDead()) {
    // if the last hit battler was defeated or something, remove it.
    this.setBattlerLastHit(null);
  }

  return this._lastHit;
};

/**
 * Sets the last battler struck by this battler.
 * @param {JABS_Battler} battlerLastHit The battler that is being set as last struck.
 */
JABS_Battler.prototype.setBattlerLastHit = function(battlerLastHit) {
  this._lastHit = battlerLastHit;

  // the player-controlled character cannot have a target by normal means due
  // to them not being controlled by AI. However, their "last hit" is basically
  // the same thing, so assign their target as well.
  if (this.isPlayer()) {
    this.setTarget(this._lastHit);
  }
};

/**
 * Gets whether or not this has a last battler hit currently stored.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasBattlerLastHit = function() {
  return !!this.getBattlerLastHit();
};

/**
 * Clears the last battler hit tracker from this battler.
 */
JABS_Battler.prototype.clearBattlerLastHit = function() {
  this.setBattlerLastHit(null);
  this.setLastBattlerHitCountdown(0);

  // when clearing the last battler hit, also remove the player's target that
  // was likely added via the above function of "setBattlerLastHit".
  if (this.isPlayer()) {
    this.setTarget(null);
  }
};

/**
 * Sets the last battler hit countdown.
 * @param {number} duration The duration in frames (60/s).
 */
JABS_Battler.prototype.setLastBattlerHitCountdown = function(duration = 900) {
  this._lastHitCountdown = duration;
};

/**
 * Counts down the last hit counter.
 * @returns {boolean}
 */
JABS_Battler.prototype.countdownLastHit = function() {
  if (this._lastHitCountdown <= 0) {
    this._lastHitCountdown = 0;
    if (this.hasBattlerLastHit()) {
      this.clearBattlerLastHit();
    }
  }

  if (this._lastHitCountdown > 0) {
    this._lastHitCountdown--;
  }
};

/**
 * Gets whether or not this battler is dead inside.
 * @returns {boolean}
 */
JABS_Battler.prototype.isDead = function() {
  const battler = this.getBattler();

  if (!battler) { // has no battler.
    return true;
  } else if (!$gameMap.battlerExists(this)) { // battler isn't on the map.
    return true;
  } else if (battler.isDead() || this.isDying()) { // battler is actually dead.
    return true;
  } else { // battler is OK!
    return false;
  }
};

/**
 * Gets the current allied target of this battler.
 * @returns {JABS_Battler}
 */
JABS_Battler.prototype.getAllyTarget = function() {
  return this._allyTarget;
};

/**
 * Sets the allied target of this battler.
 * @param {JABS_Battler} newAlliedTarget The new target.
 */
JABS_Battler.prototype.setAllyTarget = function(newAlliedTarget) {
  this._allyTarget = newAlliedTarget;
};

/**
 * Determines the distance from this battler and the point.
 * @param {number} x2 The x coordinate to check.
 * @param {number} y2 The y coordinate to check.
 * @returns {number} The distance from the battler to the point.
 */
JABS_Battler.prototype.distanceToPoint = function(x2, y2) {
  if ((x2 ?? y2) === null) return null;
  const x1 = this.getX();
  const y1 = this.getY();
  return parseFloat(Math
    .hypot(x2 - x1, y2 - y1)
    .toFixed(2));
};

/**
 * Determines distance from this battler and the target.
 * @param {JABS_Battler} target The target that this battler is checking distance against.
 * @returns {number} The distance from this battler to the provided target.
 */
JABS_Battler.prototype.distanceToDesignatedTarget = function(target) {
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current target.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToCurrentTarget = function() {
  const target = this.getTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current ally target.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToAllyTarget = function() {
  const target = this.getAllyTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * A shorthand reference to the distance this battler is from it's home.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToHome = function() {
  return this.distanceToPoint(this._homeX, this._homeY);
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_Battler.prototype.canIdle = function() {
  return this._canIdle;
};

/**
 * Gets whether or not this battler should show its hp bar.
 * @returns {boolean}
 */
JABS_Battler.prototype.showHpBar = function() {
  return this._showHpBar;
};

/**
 * Gets whether or not this battler should show its danger indicator.
 * @returns {boolean}
 */
 JABS_Battler.prototype.showDangerIndicator = function() {
  return this._showDangerIndicator;
};

/**
 * Gets whether or not this battler should show its name.
 * @returns {boolean}
 */
 JABS_Battler.prototype.showBattlerName = function() {
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {boolean} True if this battler is alerted, false otherwise.
 */
JABS_Battler.prototype.isAlerted = function() {
  return this._alerted;
};

/**
 * Sets the alerted state for this battler.
 * @param {boolean} alerted The new alerted state (default = true).
 */
JABS_Battler.prototype.setAlerted = function(alerted = true) {
  this._alerted = alerted;
};

/**
 * Gets whether or not this battler is in an `alerted` state.
 * @returns {number} The duration remaining for this alert state.
 */
JABS_Battler.prototype.getAlertDuration = function() {
  return this._alertDuration;
};

/**
 * Sets the alerted counter to this number of frames.
 * @param {number} alertedFrames The duration in frames for how long to be alerted.
 */
JABS_Battler.prototype.setAlertedCounter = function(alertedFrames) {
  this._alertedCounter = alertedFrames;
  if (this._alertedCounter > 0) {
    this.setIdle(false);
    this.setAlerted();
  } else if (this._alertedCounter <= 0) {
    this.setAlerted(false);
  }
};

/**
 * Gets the alerted coordinates.
 * @returns {[number, number]} The `[x, y]` of the alerter.
 */
JABS_Battler.prototype.getAlertedCoordinates = function() {
  return this._alertedCoordinates;
};

/**
 * Sets the alerted coordinates.
 * @param {number} x The `x` of the alerter.
 * @param {number} y The `y` of the alerter.
 */
JABS_Battler.prototype.setAlertedCoordinates = function(x, y) {
  this._alertedCoordinates = [x, y];
};

/**
 * Whether or not this battler is at it's home coordinates.
 * @returns {boolean} True if the battler is home, false otherwise.
 */
JABS_Battler.prototype.isHome = function() {
  return (this._event.x === this._homeX && this._event.y === this._homeY);
};

/**
 * Returns the X coordinate of the event portion's initial placement.
 * @returns {number} The X coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeX = function() {
  return this._homeX;
};

/**
 * Returns the Y coordinate of the event portion's initial placement.
 * @returns {number} The Y coordinate of this event's home.
 */
JABS_Battler.prototype.getHomeY = function() {
  return this._homeY;
};

/**
 * Returns the X coordinate of the event.
 * @returns {number} The X coordinate of this event.
 */
JABS_Battler.prototype.getX = function() {
  return this.getCharacter()._realX;
};

/**
 * Returns the Y coordinate of the event.
 * @returns {number} The Y coordinate of this event.
 */
JABS_Battler.prototype.getY = function() {
  return this.getCharacter()._realY;
};

/**
 * Retrieves the AI associated with this battler.
 * @returns {JABS_BattlerAI} This battler's AI.
 */
JABS_Battler.prototype.getAiMode = function() {
  return this._aiMode;
};

/**
 * Gets this follower's leader's AI.
 * @returns {JABS_BattlerAI} This battler's leader's AI.
 */
JABS_Battler.prototype.getLeaderAiMode = function() {
  // if we don't have a leader, don't.
  if (!this.hasLeader()) return null;

  const leader = $gameMap.getBattlerByUuid(this.getLeader());
  if (!leader) return null;

  return leader.getAiMode();
};

/**
 * Tries to move this battler away from its current target.
 * This may fail if the battler is pinned in a corner or something.
 */
JABS_Battler.prototype.moveAwayFromTarget = function() {
  const battler = this.getCharacter();
  const target = this.getTarget().getCharacter();
  if (!target) return;

  battler.moveAwayFromCharacter(target);
};

/**
 * Tries to move this battler away from its current target.
 * 
 * There is no pathfinding away, but if its not able to move directly
 * away, it will try a different direction to wiggle out of corners.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function() {
  const battler = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  battler.moveAwayFromCharacter(target.getCharacter());
  if (!battler.isMovementSucceeded()) {
    const threatDir = battler.reverseDir(battler.direction());
    let newDir = (Math.randomInt(4) + 1) * 2;
    while (newDir === threatDir) {
      newDir = (Math.randomInt(4) + 1) * 2;
    }
    battler.moveStraight(newDir);
  }
};

/**
 * Tries to move this battler towards its current target.
 */
JABS_Battler.prototype.smartMoveTowardTarget = function() {
  const target = this.getTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler towards its ally target.
 */
JABS_Battler.prototype.smartMoveTowardAllyTarget = function() {
  const target = this.getAllyTarget();
  if (!target) return;

  this.smartMoveTowardCoordinates(target.getX(), target.getY());
};

/**
 * Tries to move this battler toward a set of coordinates.
 * @param {number} x The `x` coordinate to reach.
 * @param {number} y The `y` coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(x, y) {
  const character = this.getCharacter();
  const nextDir = character.findDiagonalDirectionTo(x, y);

  if (character.isDiagonalDirection(nextDir)) {
    const horzvert = character.getDiagonalDirections(nextDir);
    character.moveDiagonally(horzvert[0], horzvert[1]);
  } else {
    character.moveStraight(nextDir);
  }
};

/**
 * Turns this battler towards it's current target.
 */
JABS_Battler.prototype.turnTowardTarget = function() {
  const character = this.getCharacter();
  const target = this.getTarget();
  if (!target) return;

  character.turnTowardCharacter(target.getCharacter());
};

//#endregion reference helpers

//#region isReady & cooldowns
/**
 * Initializes a cooldown with the given key.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration to initialize this cooldown with.
 */
JABS_Battler.prototype.initializeCooldown = function(cooldownKey, duration) {
  if (!this._cooldowns[cooldownKey]) {
    const cooldown = new JABS_Cooldown(cooldownKey);
    cooldown.setFrames(duration);
    this._cooldowns[cooldownKey] = cooldown;
  }
};

/**
 * Gets the cooldown data for a given cooldown key.
 * @param {string} cooldownKey The cooldown to lookup.
 * @returns {JABS_Cooldown}
 */
JABS_Battler.prototype.getCooldown = function(cooldownKey) {
  return this._cooldowns[cooldownKey];
};

/**
 * Gets the cooldown and skill slot data for a given key.
 * @param {string} key The slot to get the data for.
 * @returns {{ cooldown: JABS_Cooldown, skillslot: JABS_SkillSlot }}
 */
JABS_Battler.prototype.getActionKeyData = function(key) {
  return {
    cooldown: this.getCooldown(key),
    skillslot: this.getBattler().getSkillSlot(key)
  }
};

/**
 * Whether or not this battler has finished it's post-action cooldown phase.
 * @returns {boolean} True if the battler is cooled down, false otherwise.
 */
JABS_Battler.prototype.isPostActionCooldownComplete = function() {
  if (this._postActionCooldownComplete) {
    // we are ready to do idle things.
    return true;
  } else {
    if (this._postActionCooldown <= this._postActionCooldownMax) {
      // we are still charging up...
      this._postActionCooldown++;
      return false;
    }
    this._postActionCooldownComplete = true;
    this._postActionCooldown = 0;

    // we are ready to finish phase3!
    return true;
  }
};

/**
 * Starts the post-action cooldown for this battler.
 * @param {number} cooldown The cooldown duration.
 */
JABS_Battler.prototype.startPostActionCooldown = function(cooldown) {
  this._postActionCooldownComplete = false;
  this._postActionCooldown = 0;
  this._postActionCooldownMax = cooldown;
};

/**
 * Retrieves the battler's idle state.
 * @returns {boolean} True if the battler is idle, false otherwise.
 */
JABS_Battler.prototype.isIdle = function() {
  return this._idle;
};

/**
 * Sets whether or not this battler is idle.
 * @param {boolean} isIdle True if this battler is idle, false otherwise.
 */
JABS_Battler.prototype.setIdle = function(isIdle) {
  this._idle = isIdle;
};

/**
 * Whether or not this battler is ready to perform an idle action.
 * @returns {boolean} True if the battler is idle-ready, false otherwise.
 */
JABS_Battler.prototype.isIdleActionReady = function() {
  if (this._idleActionReady) {
    // we are ready to do idle things.
    return true;
  } else {
    if (this._idleActionCount <= this._idleActionCountMax) {
      // we are still charging up...
      this._idleActionCount++;
      return false;
    }
    this._idleActionReady = true;
    this._idleActionCount = 0;

    // we are ready to idle!
    return true;
  }
};

/**
 * Whether or not the skilltype has a base or combo cooldown ready.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @returns {boolean} True if the given skilltype is ready, false otherwise.
 */
JABS_Battler.prototype.isSkillTypeCooldownReady = function(cooldownKey) {
  return this._cooldowns[cooldownKey].isAnyReady();
};

/**
 * Modifies the cooldown for this key by a given amount.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.modCooldownCounter = function(cooldownKey, duration) {
  try {
    this._cooldowns[cooldownKey].modBaseFrames(duration);
  } catch (ex) {
    console.log(cooldownKey, duration);
    console.warn(ex);
  }
};

/**
 * Set the cooldown timer to a designated number.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.setCooldownCounter = function(cooldownKey, duration) {
  this._cooldowns[cooldownKey].setFrames(duration);
};

/**
 * Resets this battler's combo information.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.resetComboData = function(cooldownKey) {
  this._cooldowns[cooldownKey].resetCombo();
};

/**
 * Sets the combo frames to be a given value.
 * @param {string} cooldownKey The key associated with the cooldown.
 * @param {number} duration The number of frames until this combo action is ready.
 */
JABS_Battler.prototype.setComboFrames = function(cooldownKey, duration) {
  this._cooldowns[cooldownKey].setComboFrames(duration);
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.isActionReady = function() {
  if (this._prepareReady) {
    // we are ready to take action.
    return true;
  } else {
    if (this._prepareCounter < this._prepareMax) {
      // we are still charging up...
      this._prepareCounter++;
      return false;
    }

    this._prepareReady = true;
    this._prepareCounter = 0;
    // we are charged up now!
    return true;
  }
};

/**
 * Determines the number of frames between opportunity to take the next action.
 * This maps to time spent in phase1 of JABS AI.
 * @returns {number} The number of frames between actions.
 */
JABS_Battler.prototype.getPrepareTime = function() {
  if (!this.isPlayer()) {
    return this.getBattler().prepareTime();
  }
};

/**
 * Determines whether or not a skill can be executed based on restrictions or not.
 * @param {number} chosenSkillId The skill id to be executed.
 * @returns {boolean} True if this skill can be executed, false otherwise.
 */
JABS_Battler.prototype.canExecuteSkill = function(chosenSkillId) {
  const canUseSkills = this.canBattlerUseSkills();
  const canUseAttacks = this.canBattlerUseAttacks();
  const basicAttackId = this.getEnemyBasicAttack()[0];

  // if can't use basic attacks or skills, then autofail.
  if (!canUseSkills && !canUseAttacks) {
    return false;
  }

  // if the skill is a basic attack, but the battler can't attack, then fail.
  const isBasicAttack = chosenSkillId === basicAttackId;
  if (!canUseAttacks && isBasicAttack) {
    return false;
  }

  // if the skill is an assigned skill, but the battler can't use skills, then fail.
  if (!canUseSkills && !isBasicAttack) {
    return false;
  }

  // if the skill cost is more than the battler has resources for, then fail.
  const battler = this.getBattler();
  const canPay = battler.canPaySkillCost($dataSkills[chosenSkillId]);
  if (!battler.canPaySkillCost($dataSkills[chosenSkillId])) {
    return false;
  }

  // all criteria are met! this skill can be cast 🌞.
  return true;
};
//#endregion isReady & cooldowns

//#region get data
/**
 * Gets all allies to this battler within a large range.
 * (Not map-wide because that could result in unexpected behavior)
 * @returns {JABS_Battler[]}
 */
JABS_Battler.prototype.getAllNearbyAllies = function() {
  return $gameMap.getAllyBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};

/**
 * Gets the ally ai associated with this battler.
 * @returns {JABS_AllyAI}
 */
JABS_Battler.prototype.getAllyAiMode = function() {
  // enemies do not have ally ai.
  if (this.isEnemy()) return null;

  return this.getBattler().getAllyAI();
};

/**
 * Applies the battle memory to the battler.
 * Only applicable to allies (for now).
 * @param {JABS_BattleMemory} newMemory The new memory to apply to this battler.
 */
JABS_Battler.prototype.applyBattleMemories = function(newMemory) {
  // enemies do not (yet) track battle memories.
  if (this.isEnemy()) return;

  return this.getBattler().getAllyAI().applyMemory(newMemory);
};

/**
 * Gets the id of the battler associated with this battler
 * that has been assigned via the battler core data.
 * @returns {number}
 */
JABS_Battler.prototype.getBattlerId = function() {
  return this._battlerId;
};

/**
 * Gets the skill id of the next combo action in the sequence.
 * @returns {number} The skill id of the next combo action.
 */
JABS_Battler.prototype.getComboNextActionId = function(cooldownKey) {
  return this._cooldowns[cooldownKey].comboNextActionId;
};

/**
 * Sets the skill id for the next combo action in the sequence.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @param {number} nextComboId The skill id for the next combo action.
 */
JABS_Battler.prototype.setComboNextActionId = function(cooldownKey, nextComboId) {
  this._cooldowns[cooldownKey].comboNextActionId = nextComboId;
};

/**
 * Gets all skills that are available to this enemy battler.
 * @returns {number[]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function() {
  const battler = this.getBattler();
  const battlerData = $dataEnemies[battler.enemyId()];
  if (battlerData.actions.length > 0) {
    return battlerData.actions.map(action => {
      //return [action.skillId, action.rating];
      return action.skillId;
    });
  } else {
    return [];
  }
};

/**
 * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
 * @returns {[number, number]} The `[skillId, rating]` of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function() {
  const battler = this.getBattler();
  const basicAttackSkill = battler.skillId();
  return [basicAttackSkill, 5];
};

/**
 * Gets the number of additional/bonus hits per basic attack.
 * Skills (such as magic) do not receive bonus hits at this time.
 * @param {rm.types.Skill} skill The skill to consider regarding bonus hits.
 * @param {boolean} isBasicAttack True if this is a basic attack, false otherwise.
 * @returns {number} The number of bonus hits per attack.
 */
JABS_Battler.prototype.getAdditionalHits = function(skill, isBasicAttack) {
  // TODO: enemies don't get bonus hits (yet).
  if (this.isEnemy()) return 0;

  let bonusHits = 0;
  const battler = this.getBattler();
  if (isBasicAttack) {
    // TODO: split "basic attack" bonus hits from "skill" and "all" bonus hits.
    bonusHits += battler.getBonusHits();
  } else {
    // check for skills that may have non-pierce-related bonus hits?
  }

  return bonusHits;
};

/**
 * Gets the speedboost values for this battler.
 * @returns {number} The speedboost value.
 */
JABS_Battler.prototype.getSpeedBoosts = function() {
  // only calculate for the player (and allies).
  if (this.isEnemy()) return 0;

  return this.getBattler().getSpeedBoosts();
};
//#endregion get data

//#region aggro
/**
 * Adjust the currently engaged target based on aggro.
 */
JABS_Battler.prototype.adjustTargetByAggro = function() {
  // don't process aggro for inanimate battlers.
  if (this.isInanimate()) return;

  if (!this.getTarget()) {
    const highestAggro = this.getHighestAggro();
    const newTarget = $gameMap.getBattlerByUuid(highestAggro.uuid());
    if (newTarget) {
      this.setTarget(newTarget);
    }

    return;
  }

  // if the target is dead, disengage and end combat.
  // TODO: is this a race condition?
  this.removeAggroIfTargetDead(this.getTarget().getUuid());

  // if there is no aggros remaining, disengage.
  if (this._aggros.length === 0) {
    this.disengageTarget();
    return;
  }

  // if there is only 1 aggro remaining
  if (this._aggros.length === 1) {
    const zerothAggroUuid = this._aggros[0].uuid();
    // if there is no target, just stop that shit.
    if (!this.getTarget()) return;

    // check to see if the last aggro in the list belongs to the current target.
    if (!(this.getTarget().getUuid() === zerothAggroUuid)) {
      // if it doesn't, then get that battler.
      const newTarget = $gameMap.getBattlerByUuid(zerothAggroUuid);
      if (newTarget) {
        // then switch to that target!
        this.setTarget(newTarget);
      } else {
        // if the battler doesn't exist but the aggro does, purge it.
        this.removeAggro(zerothAggroUuid);
      }
    }
    return;
  }

  // if you still don't have a target but have multiple aggros, then just give up.
  if (!this.getTarget()) return;

  // find the highest aggro target currently being tracked.
  const highestAggroTarget = this.getHighestAggro();

  // if the current target isn't the highest target, then switch!
  if (!(highestAggroTarget.uuid() === this.getTarget().getUuid())) {

    // find the new target to change to that has more aggro than the current target.
    const newTarget = $gameMap.getBattlerByUuid(highestAggroTarget.uuid());

    // if we can't find the target on the map somehow, then try to remove it from the list of aggros.
    if (!newTarget) {
      // get the index to remove...
      this.removeAggro(highestAggroTarget.uuid());
    } else {
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
JABS_Battler.prototype.getAllAggros = function() {
  return this._aggros;
};

/**
 * Gets the highest aggro currently tracked by this battler.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.getHighestAggro = function() {
  return this._aggros.sort((a, b) => {
    if (a.aggro < b.aggro) {
      return 1
    } else if (a.aggro > b.aggro) {
      return -1;
    }

    return 0;
  })[0];
};

/**
 * If the target is dead, removes it's aggro.
 * @param uuid
 */
JABS_Battler.prototype.removeAggroIfTargetDead = function(uuid) {
  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler || battler.isDead()) {
    this.removeAggro(uuid);
  }
};

/**
 * Removes a single aggro by its `uuid`.
 * @param {string} uuid The `uuid` of the aggro to remove.
 */
JABS_Battler.prototype.removeAggro = function(uuid) {
  // get the index to remove...
  const indexToRemove = this._aggros.findIndex(aggro => aggro.uuid() === uuid);
  if (indexToRemove > -1) {
    // if currently engaged with the dead target, then disengage.
    if (this.getTarget().getUuid() === uuid) {
      this.disengageTarget();
    }

    // ...and remove it.
    this._aggros.splice(indexToRemove, 1);
  }

  if (this._aggros.lenghth) {

  }
};

/**
 * Adds a new aggro tracker to this battler, or updates an existing one.
 * @param {string} uuid The unique identifier of the target.
 * @param {number} aggroValue The amount of aggro being modified.
 * @param {boolean} forced If provided, then this application will bypass locks.
 */
JABS_Battler.prototype.addUpdateAggro = function(uuid, aggroValue, forced = false) {
  // if the aggro is locked, don't adjust it.
  if (this.getBattler().isAggroLocked() && !forced) return;

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro) {
    foundAggro.modAggro(aggroValue, forced);
  } else {
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
JABS_Battler.prototype.resetOneAggro = function(uuid, forced = false) {
  // if the aggro is locked, don't adjust it.
  if (this.getBattler().isAggroLocked() && !forced) return;

  const foundAggro = this.aggroExists(uuid);
  if (foundAggro) {
    foundAggro.resetAggro(forced);
  } else {
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
JABS_Battler.prototype.resetAllAggro = function(uuid, forced = false) {
  // if the aggro is locked, don't adjust it.
  if (this.getBattler().isAggroLocked() && !forced) return;

  this.resetOneAggro(uuid, forced);
  this._aggros.forEach(aggro => aggro.resetAggro(forced));
};

/**
 * Gets an aggro by its unique identifier.
 * If the aggro doesn't exist, then returns undefined.
 * @param {string} uuid The unique identifier of the target resetting this battler's aggro.
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.aggroExists = function(uuid) {
  return this._aggros.find(aggro => aggro.uuid() === uuid);
};

//#endregion aggro

//#region create/apply effects
/**
 * Performs a preliminary check to see if the target is actually able to be hit.
 * @returns {boolean} True if actions can potentially connect, false otherwise.
 */
JABS_Battler.prototype.canActionConnect = function() {
  // this battler is untargetable.
  if (this.isInvincible() || this.isHidden()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Cheat)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter().isAction()) return false;

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
JABS_Battler.prototype.isWithinScope = function(action, target, alreadyHitOne = false) {
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

  const targetIsSelf = (user.getUuid() === target.getUuid() || (action.getAction().isForUser()));
  const actionIsSameTeam = user.getTeam() === this.getTeam();
  const targetIsOpponent = !user.isSameTeam(this.getTeam());

  // scope is for 1 target, and we already found one.
  if (scopeSingle && alreadyHitOne) {
    return false;
  }

  // the caster and target are the same.
  if (targetIsSelf && (scopeSelf || scopeAlly || scopeAllAllies || scopeEverything)) {
    return true;
  }

  // action is from one of the target's allies.
  // inanimate battlers cannot be targeted by their allies with direct skills.
  if (actionIsSameTeam &&
    (scopeAlly || scopeAllAllies || scopeEverything) &&
    !(action.isDirectAction() && target.isInanimate())) {
      return true;
  }

  // action is for enemy battlers and scope is for opponents.
  if (targetIsOpponent && (scopeOpponent || scopeAllOpponents || scopeEverything)) {
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
JABS_Battler.prototype.createMapActionFromSkill = function(
  skillId,
  isRetaliation = false,
  cooldownKey = null
) {
  const battler = this.getBattler();
  const skill = $dataSkills[skillId];
  const action = new Game_Action(battler, false);
  action.setSkill(skillId);

  const actions = [];
  const projectileDirections = $gameBattleMap.determineActionDirections(
    this.getCharacter().direction(), 
    skill._j.projectile);
  
  const caster = this;
  projectileDirections.forEach(direction => {
    const mapAction = new JABS_Action({
      baseSkill: skill,          // the skill data
      teamId: caster.getTeam(), // the caster's team id
      gameAction: action,         // the Game_Action itself
      caster: caster,           // the JABS_Battler caster
      isRetaliation: isRetaliation,  // whether or not this is a retaliation
      direction: direction,      // the direction this action is initially facing
      cooldownKey,
    });

    actions.push(mapAction);
  });

  return actions;
};

/**
 * Constructs the attack data from this battler's skill slot.
 * @param {string} cooldownKey The key to build the combat action from.
 * @returns {JABS_Action[]} The constructed `JABS_Action`.
 */
JABS_Battler.prototype.getAttackData = function(cooldownKey) {
  const battler = this.getBattler()
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return null;

  const canUse = battler.canUse($dataSkills[id]);
  if (!canUse) {
    return null;
  }

  const comboActionId = this.getComboNextActionId(cooldownKey);
  this.resetComboData(cooldownKey);
  if (comboActionId !== 0) {
    const canUseCombo = battler.canUse($dataSkills[comboActionId]);
    if (!canUseCombo) {
      return null;
    }

    return this.createMapActionFromSkill(comboActionId, false, cooldownKey);
  }

  return this.createMapActionFromSkill(id, false, cooldownKey);
};

/**
 * Consumes an item and performs its effects.
 * @param {number} toolId The id of the tool/item to be used.
 * @param {boolean} isLoot Whether or not this is a loot pickup.
 */
JABS_Battler.prototype.applyToolEffects = function(toolId, isLoot = false) {
  const item = $dataItems[toolId];
  const playerBattler = this.getBattler();
  playerBattler.consumeItem(item);
  const gameAction = new Game_Action(playerBattler);
  gameAction.setItem(toolId);

  // handle scopes of the tool.
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
  if (scopeSelf || scopeOneAlly) {
    this.applyToolToPlayer(toolId);
  } else if (scopeEverything) {
    this.applyToolForAllAllies(toolId);
    this.applyToolForAllOpponents(toolId);
  } else if (scopeOneOpponent) {
    this.applyToolForOneOpponent(toolId);
  } else if (scopeAllAllies) {
    this.applyToolForAllAllies(toolId);
  } else if (scopeAllOpponents) {
    this.applyToolForAllOpponents(toolId);
  } else if (gameAction.item().scope === 0) {
    // do nothing, the item has no scope and must be relying purely on the skillId.
  } else {
    console.warn(`unhandled scope for tool: [ ${gameAction.item().scope} ]!`);
  }

  // applies common events that may be a part of an item's effect.
  gameAction.applyGlobal();

  // create the log for the tool use.
  this.createToolLog(item);

  const { cooldown: itemCooldown, skillId: itemSkillId } = item._j;

  // it is an item with a custom cooldown.
  if (itemCooldown) {
    if (!isLoot) this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, itemCooldown);
  }

  // it was an item with a skill attached.
  if (itemSkillId) {
    const mapAction = this.createMapActionFromSkill(itemSkillId);
    if (Array.isArray(mapAction)) {
      mapAction.forEach(action => {
        action.setCooldownType(Game_Actor.JABS_TOOLSKILL);
        $gameBattleMap.executeMapAction(this, action);
      });
    } else {
      mapAction.setCooldownType(Game_Actor.JABS_TOOLSKILL);
      $gameBattleMap.executeMapAction(this, mapAction);
    }
  }

  // it was an item, didn't have a skill attached, and didn't have a cooldown.
  if (!itemCooldown && !itemSkillId) {
    if (!isLoot) {
      this.modCooldownCounter(
        Game_Actor.JABS_TOOLSKILL, 
        J.ABS.DefaultValues.CooldownlessItems);
    }
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item)) {
    playerBattler.setEquippedSkill(Game_Actor.JABS_TOOLSKILL, 0);
    const lastItemMessage = `The last ${item.name} was consumed and unequipped.`;
    const log = new Map_TextLog(lastItemMessage, -1);
    $gameTextLog.addLog(log);
  }
};

/**
 * Applies the effects of the tool against the leader.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolToPlayer = function(toolId) {
  // apply tool effects against player.
  const playerBattler = this.getBattler();
  const playerGameAction = new Game_Action(playerBattler, false);
  playerGameAction.setItem(toolId);
  playerGameAction.apply(playerBattler);

  // display popup from item.
  const tool = $dataItems[toolId];
  const playerCharacter = this.getCharacter();
  const popup = $gameBattleMap.configureDamagePop(playerGameAction, tool, this, this);
  playerCharacter.addTextPop(popup);
  playerCharacter.setRequestTextPop();

  // show tool animation.
  playerCharacter.requestAnimation(tool.animationId, false);
};

/**
 * Applies the effects of the tool against all allies on the team.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllAllies = function(toolId) {
  const battlers = $gameParty.battleMembers();
  if (battlers.length > 1) {
    battlers.shift(); // remove the leader, because that's the player.
    battlers.forEach(battler => {
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
JABS_Battler.prototype.applyToolForOneOpponent = function(toolId) {
  const item = $dataItems[toolId];
  let jabsBattler = this.getTarget();
  if (!jabsBattler) {
    // if we don't have a target, get the last hit battler instead.
    jabsBattler = this.getBattlerLastHit();
  }

  if (!jabsBattler) {
    // if we don't have a last hit battler, then give up on this.
    return;
  }

  const battler = jabsBattler.getBattler();
  const gameAction = new Game_Action(battler, false);
  gameAction.apply(battler);
  const battlerSprite = jabsBattler.getCharacter();
  const popup = $gameBattleMap.configureDamagePop(gameAction, item, this, jabsBattler);
  battlerSprite.addTextPop(popup);
  battlerSprite.setRequestTextPop();
};


/**
 * Applies the effects of the tool against all opponents on the map.
 * @param {number} toolId The id of the tool/item being used.
 */
JABS_Battler.prototype.applyToolForAllOpponents = function(toolId) {
  const item = $dataItems[toolId];
  const battlers = $gameMap.getEnemyBattlers();
  battlers.forEach(jabsBattler => {
    const battler = jabsBattler.getBattler();
    const gameAction = new Game_Action(battler, false);
    gameAction.apply(battler);
    const battlerSprite = jabsBattler.getCharacter();
    const popup = $gameBattleMap.configureDamagePop(gameAction, item, this, jabsBattler);
    battlerSprite.addTextPop(popup);
    battlerSprite.setRequestTextPop();
  });
};

/**
 * Creates the text log entry for executing an tool effect.
 */
JABS_Battler.prototype.createToolLog = function(item) {
  // if not enabled, skip this.
  if (!J.LOG || !J.LOG.Metadata.Enabled) return;

  const battleMessage = `${this.getReferenceData().name} used the ${item.name}.`;
  const log = new Map_TextLog(battleMessage, -1);
  $gameTextLog.addLog(log);
};

/**
 * Executes the pre-defeat processing for a battler.
 * @param {JABS_Battler} victor The `JABS_Battler` that defeated this battler.
 */
JABS_Battler.prototype.performPredefeatEffects = function(victor) {
  const battler = this.getBattler();
  if (this.isActor() && battler.needsDeathEffect()) {
    this.showAnimation(152);
    battler.toggleDeathEffect();
  } else if (this.isEnemy()) {
    this.showAnimation(151);
  }

  const onOwnDefeatSkills = battler.onOwnDefeatSkillIds();
  if (onOwnDefeatSkills.length) {
    onOwnDefeatSkills.forEach(onDefeatSkill => {
      if (onDefeatSkill.shouldTrigger()) {
        $gameBattleMap.forceMapAction(this, onDefeatSkill.skillId, false);
      }
    });
  }

  const onTargetDefeatSkills = victor.getBattler().onTargetDefeatSkillIds();
  if (onTargetDefeatSkills.length) {
    console.log(onTargetDefeatSkills);
    onTargetDefeatSkills.forEach(onDefeatSkill => {
      const castFromTarget = onDefeatSkill.appearOnTarget();
      if (onDefeatSkill.shouldTrigger()) {
        if (castFromTarget) {
          $gameBattleMap.forceMapAction(victor, onDefeatSkill.skillId, false, this.getX(), this.getY());
        } else {
          $gameBattleMap.forceMapAction(victor, onDefeatSkill.skillId, false);
        }
      }
    });
  }
};

/**
 * Executes the post-defeat processing for a defeated battler.
 * @param {JABS_Battler} victor The `JABS_Battler` that defeated this battler.
 */
JABS_Battler.prototype.performPostdefeatEffects = function(victor) {
  if (this.isActor()) {
    this.setDying(true);
  }
};
//#endregion apply effects

//#region guarding
/**
 * Whether or not the precise-parry window is active.
 * @returns {boolean}
 */
JABS_Battler.prototype.parrying = function() {
  return this._parryWindow > 0;
};

/**
 * Sets the battlers precise-parry window frames.
 * @param {number} parryFrames The number of frames available for precise-parry.
 */
JABS_Battler.prototype.setParryWindow = function(parryFrames) {
  if (parryFrames < 0) {
    this._parryWindow = 0;
  } else {
    this._parryWindow = parryFrames;
  }
};

/**
 * Get whether or not this battler is currently guarding.
 * @returns {boolean}
 */
JABS_Battler.prototype.guarding = function() {
  return this._isGuarding;
};

/**
 * Set whether or not this battler is currently guarding.
 * @param {boolean} isGuarding True if the battler is guarding, false otherwise.
 */
JABS_Battler.prototype.setGuarding = function(isGuarding) {
  this._isGuarding = isGuarding;
};

/**
 * The flat amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.flatGuardReduction = function() {
  if (!this.guarding()) return 0;

  return this._guardFlatReduction;
};

/**
 * Sets the battler's flat reduction when guarding.
 * @param {number} flatReduction The flat amount to reduce when guarding.
 */
JABS_Battler.prototype.setFlatGuardReduction = function(flatReduction) {
  this._guardFlatReduction = flatReduction;
};

/**
 * The percent amount to reduce damage by when guarding.
 * @returns {number}
 */
JABS_Battler.prototype.percGuardReduction = function() {
  if (!this.guarding()) return 0;

  return this._guardPercReduction;
};

/**
 * Sets the battler's percent reduction when guarding.
 * @param {number} percReduction The percent amount to reduce when guarding.
 */
JABS_Battler.prototype.setPercGuardReduction = function(percReduction) {
  this._guardPercReduction = percReduction;
};

/**
 * Checks to see if retrieving the counter-guard skill id is appropriate.
 * @returns {number}
 */
JABS_Battler.prototype.counterGuard = function() {
  return this.guarding()
    ? this.counterGuardId()
    : 0;
};

/**
 * Gets the id of the skill for counter-guarding.
 * @returns {number}
 */
JABS_Battler.prototype.counterGuardId = function() {
  return this._counterGuardId;
};

/**
 * Sets the battler's retaliation id for guarding.
 * @param {number} counterGuardSkillId The skill id to counter with while guarding.
 */
JABS_Battler.prototype.setCounterGuard = function(counterGuardSkillId) {
  this._counterGuardId = counterGuardSkillId;
};

/**
 * Checks to see if retrieving the counter-parry skill id is appropriate.
 * @returns {number}
 */
JABS_Battler.prototype.counterParry = function() {
  return this.guarding()
    ? this.counterParryId()
    : 0;
};

/**
 * Gets the id of the skill for counter-parrying.
 * @returns {number}
 */
JABS_Battler.prototype.counterParryId = function() {
  return this._counterParryId;
};

/**
 * Sets the id of the skill to retaliate with when successfully precise-parrying.
 * @param {number} counterParrySkillId The skill id of the counter-parry skill.
 * @returns {number}
 */
JABS_Battler.prototype.setCounterParry = function(counterParrySkillId) {
  this._counterParryId = counterParrySkillId;
};

/**
 * Gets all data associated with guarding for this battler.
 * @returns {JABS_GuardData}
 */
JABS_Battler.prototype.getGuardData = function(cooldownKey) {
  const battler = this.getBattler()
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return null;

  const canUse = battler.canUse($dataSkills[id]);
  if (!canUse) {
    return null;
  }

  const skill = $dataSkills[id];
  const { guard, parry, counterGuard, counterParry } = skill._j;
  return new JABS_GuardData(guard[0], guard[1], counterGuard, counterParry, parry);
};

/**
 * Determines whether or not the skill slot is a guard-type skill or not.
 * @param {string} cooldownKey The key to determine if its a guard skill or not.
  * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.prototype.isGuardSkillByKey = function(cooldownKey) {
  const battler = this.getBattler();
  const id = battler.getEquippedSkill(cooldownKey);
  if (!id) return false;

  return JABS_Battler.isGuardSkillById(id);
};

/**
 * Triggers and maintains the guard state.
 * @param {boolean} guarding True if the battler is guarding, false otherwise.
 * @param {string} skillSlot The skill slot to build guard data from.
 */
JABS_Battler.prototype.executeGuard = function(guarding, skillSlot) {
  // if we're still guarding, and already in a guard state, don't reset.
  if (guarding && this.guarding()) return;

  // if not guarding anymore, turn off the guard state.
  if (!guarding && this.guarding()) {
    this.setGuarding(false);
    this.setParryWindow(0);
    this.endAnimation();
    return;
  }

  // if we aren't guarding, and weren't guarding, don't do anything.
  if (!guarding) return;

  // if not guarding, wasn't guarding before, but want to guard, then let's guard!
  const guardData = this.getGuardData(skillSlot);
  
  // if we cannot guard, then don't try.
  if (!guardData.canGuard()) return;

  // begin guarding!
  this.setGuarding(true);
  this.setFlatGuardReduction(guardData.flatGuardReduction);
  this.setPercGuardReduction(guardData.percGuardReduction);
  this.setCounterGuard(guardData.counterGuardId);
  this.setCounterParry(guardData.counterParryId);

  // calculate parry frames, include eva bonus to parry.
  const gameBattler = this.getBattler();
  const bonusParryFrames = Math.floor((gameBattler.eva) * guardData.parryDuration);
  const totalParryFrames = bonusParryFrames + guardData.parryDuration;

  // if the guarding skill has a parry window, apply those frames once.
  if (guardData.canParry()) this.setParryWindow(totalParryFrames);

  // set the pose!
  const skill = $dataSkills[gameBattler.getEquippedSkill(skillSlot)];
  this.performActionPose(skill);
};

/**
 * Counts down the parry window that occurs when guarding is first activated.
 */
JABS_Battler.prototype.countdownParryWindow = function() {
  if (this.parrying()) {
    this._parryWindow--;
  }

  if (this._parryWindow < 0) {
    this._parryWindow = 0;
  }
};
//#endregion guarding

//#region actionposes/animations
/**
 * Executes an action pose.
 * @param {object} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill) {
  if (this._animating) {
    this.endAnimation();
  }

  const character = this.getCharacter();
  const baseSpriteName = this.getCharacterSpriteName();
  let newCharacterSprite = "";
  let suffix = "";
  let index = this.getCharacterSpriteIndex();
  let duration = 0;
  if (skill._j.poseSuffix) {
    const notedata = skill._j.poseSuffix;
    suffix = notedata[0];
    index = notedata[1];
    duration = notedata[2];
    newCharacterSprite = `${baseSpriteName}${suffix}`;
    this.captureBaseSpriteInfo();
    this.setAnimationCount(duration);
  } else {
    return;
  }

  const exists = J.BASE.Helpers.checkFile(`img/characters/${newCharacterSprite}.png`);
  if (exists) {
    character.setImage(newCharacterSprite, index);
  } else {
    //console.info(`Character image: [${newCharacterSprite}] w/ suffix of [${suffix}] is missing.`); 
  }
};

/**
 * Forcefully ends the pose animation.
 */
JABS_Battler.prototype.endAnimation = function() {
  this.setAnimationCount(0);
  this.resetAnimation();
};

/**
 * Sets the pose animation count to a given amount.
 * @param {number} count The number of frames to animate for.
 */
JABS_Battler.prototype.setAnimationCount = function(count) {
  this._animationFrames = count;
  if (this._animationFrames > 0) {
    this._animating = true;
  }

  if (this._animationFrames <= 0) {
    this._animating = false;
    this._animationFrames = 0;
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetAnimation = function() {
  if (!this._baseSpriteImage && !this._baseSpriteIndex) return;
  if (this._animating) {
    this.endAnimation();
  }

  const originalImage = this._baseSpriteImage;
  const originalIndex = this._baseSpriteIndex;
  const currentImage = this.getCharacterSpriteName();
  const currentIndex = this.getCharacterSpriteIndex();
  const character = this.getCharacter();
  if (originalImage !== currentImage || originalIndex !== currentIndex) {
    character.setImage(originalImage, originalIndex);
  }
};

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.countdownAnimation = function() {
  // if guarding, then it must be a guard animation.
  if (this.guarding()) return;

  if (this._animationFrames > 0) {
    this._animationFrames--;
    if (this._animationFrames < 4) {
      this.getCharacter()._pattern = 0;
    } else if (this._animationFrames > 10) {
      this.getCharacter()._pattern = 2;
    } else {
      this.getCharacter()._pattern = 1;
    }
  } else {
    this.resetAnimation();
  }
};
//#endregion actionposes/animations

//#region utility helpers
/**
 * Forces a display of a emoji balloon above this battler's head.
 * @param {number} balloonId The id of the balloon to display on this character.
 */
JABS_Battler.prototype.showBalloon = function(balloonId) {
  $gameTemp.requestBalloon(this._event, balloonId);
};

/**
 * Displays an animation on the battler.
 * @param {number} animationId The id of the animation to play on the battler.
 */
JABS_Battler.prototype.showAnimation = function(animationId) {
  this.getCharacter().requestAnimation(animationId);
};
//#endregion utility helpers
//ENDFILE