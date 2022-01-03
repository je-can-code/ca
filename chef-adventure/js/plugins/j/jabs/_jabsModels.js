/*:
 * @target MZ
 * @plugindesc
 * [v3.0 JABS] The various custom models created for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all models that honestly deserved their own file, but
 * that is mighty inconvenient for plugin consumers, so now its all in one.
 * ============================================================================
 */

//#region JABS_Action
/**
 * An object that binds a `Game_Action` to a `Game_Event` on the map.
 */
class JABS_Action
{
  /**
   * The minimum duration a `JABS_Action` must exist visually before cleaning it up.
   *
   * All actions should exist visually for at least 8 frames.
   * @returns {8} The minimum number of frames, 8.
   */
  static getMinimumDuration()
  {
    return 8;
  };

  /**
   * @constructor
   * @param {string} uuid This action's unique identifier.
   * @param {rm.types.Skill} baseSkill The skill retrieved from `$dataSkills[id]`.
   * @param {number} teamId A shorthand for the team id this skill belongs to.
   * @param {Game_Action} gameAction The underlying action associated with this `JABS_Action`.
   * @param {JABS_Battler} caster The `JABS_Battler` who created this `JABS_Action`.
   * @param {boolean} isRetaliation Whether or not this is a retaliation action.
   * @param {number} direction The direction this action will face initially.
   * @param {string?} cooldownKey Whether or not this is a direct action.
   */
  constructor({uuid, baseSkill, teamId, gameAction, caster, isRetaliation, direction, cooldownKey})
  {
    /**
     * The unique identifier for this action.
     *
     * All actions that are bound to an event have this.
     * @type {string}
     */
    this._uuid = uuid;

    /**
     * The base skill object, in case needed for something.
     * @type {rm.types.Skill}
     */
    this._baseSkill = gameAction.item();

    /**
     * The team the owner of this skill is a part of.
     * @type {number}
     */
    this._teamId = teamId;

    /**
     * The `Game_Action` to bind to the `Game_Event` and `JABS_Battler`.
     * @type {Game_Action}
     */
    this._gameAction = gameAction;

    /**
     * The `JABS_Battler` that used created this `JABS_Action`.
     * @type {JABS_Battler}
     */
    this._caster = caster;

    /**
     * Whether or not this action was generated as a retaliation to another battler's action.
     * @type {boolean}
     */
    this._isRetaliation = isRetaliation;

    /**
     * The direction this projectile will initially face and move.
     * @type {number}
     */
    this._facing = direction;

    /**
     * The type of action this is. Used for mapping cooldowns to the appropriate slot on the caster.
     * @type {string}
     */
    this._actionCooldownType = cooldownKey ?? "global";

    this.initMembers();
  }

  /**
   * Initializes all properties on this class.
   */
  initMembers()
  {
    /**
     * The JABS metadata associated with the base skill.
     * Almost all custom feature flags live inside this object.
     * @type {JABS_SkillData}
     */
    this._jabsData = this._baseSkill._j;

    /**
     * The current timer on this particular action.
     * @type {number}
     */
    this._currentDuration = 0;

    /**
     * Whether or not the visual of this map action needs removing.
     * @type {boolean}
     */
    this._needsRemoval = false;

    /**
     * The `Game_Event` this `JABS_Action` is bound to. Represents the visual aspect on the map.
     * @type {Game_Event}
     */
    this._actionSprite = null;

    /**
     * The duration remaining before this will action will autotrigger.
     * @type {number}
     */
    this._delayDuration = this._jabsData.delay().duration;

    /**
     * Whether or not this action will trigger when an enemy touches it.
     * @type {boolean}
     */
    this._triggerOnTouch = this._jabsData.delay().touchToTrigger;

    /**
     * The remaining number of times this action can pierce a target.
     * @type {number}
     */
    this._pierceTimesLeft = this.makePiercingCount();

    /**
     * The base pierce delay in frames.
     * @type {number}
     */
    this._basePierceDelay = this._jabsData.piercing()[1];

    /**
     * The current pierce delay in frames.
     * @type {number}
     */
    this._currentPierceDelay = 0;
  };

  /**
   * Combines from all available sources the bonus hits for this action.
   * @returns {number}
   */
  makePiercingCount()
  {
    let pierceCount = this._jabsData.piercing()[0];

    // handle skill extension bonuses.
    if (J.EXTEND)
    {
      pierceCount += this._gameAction._item
        ? this._gameAction._item._item.repeats - 1
        : 0;
    }

    // handle other bonus hits for basic attacks.
    pierceCount += this._caster.getAdditionalHits(
      this._baseSkill,
      this._actionCooldownType === Game_Actor.JABS_MAINHAND ||
      this._actionCooldownType === Game_Actor.JABS_OFFHAND)

    return pierceCount;
  };

  /**
   * Executes additional logic before this action is disposed.
   */
  preCleanupHook()
  {
    // handle self-targeted animations on cleanup.
    const event = this.getActionSprite();
    if (this._jabsData.selfAnimationId())
    {
      const animationId = this._jabsData.selfAnimationId();
      event.requestAnimation(animationId);
    }
  };

  /**
   * Gets the `uuid` of this action.
   *
   * If one is not returned, then it is probably a direct action with no event representing it.
   * @returns {string|null}
   */
  getUuid()
  {
    return this._uuid;
  };

  /**
   * Gets the base skill this `JABS_Action` is based on.
   * @returns {rm.types.Skill} The base skill of this `JABS_Action`.
   */
  getBaseSkill()
  {
    return this._baseSkill;
  };

  /**
   * Gets the JABS-specific skill data associated with this action.
   * @returns {JABS_SkillData} This action's JABS skill data object.
   */
  getJabsData()
  {
    return this._jabsData;
  };

  /**
   * Gets the team id of the caster of this action.
   * @returns {number} The team id of the caster of this `JABS_Action`.
   */
  getTeamId()
  {
    return this.getCaster().getTeam();
  };

  /**
   * The base game action this `JABS_Action` is based on.
   * @returns {Game_Action} The base game action for this action.
   */
  getAction()
  {
    return this._gameAction;
  };

  /**
   * Gets the `JABS_Battler` that created this `JABS_Action`.
   * @returns {JABS_Battler} The caster of this `JABS_Action`.
   */
  getCaster()
  {
    return this._caster;
  };

  /**
   * Whether or not this action is a retaliation- meaning it will not invoke retaliation.
   * @returns {boolean} True if it is a retaliation, false otherwise.
   */
  isRetaliation()
  {
    return this._isRetaliation;
  };

  /**
   * Gets the direction this action is facing.
   * @returns {2|4|6|8|1|3|7|9}
   */
  direction()
  {
    return this._facing || this.getActionSprite().direction();
  };

  /**
   * Gets the name of the cooldown for this action.
   * @returns {string} The cooldown key for this action.
   */
  getCooldownType()
  {
    return this._actionCooldownType;
  };

  /**
   * Sets the name of the cooldown for tracking on the caster.
   * @param {string} type The name of the cooldown that this leverages.
   */
  setCooldownType(type)
  {
    this._actionCooldownType = type;
  };

  /**
   * Gets the durations remaining on this `JABS_Action`.
   */
  getDuration()
  {
    return this._currentDuration;
  };

  /**
   * Gets the max duration in frames that this action will exist on the map.
   * If the duration was unset, or is set but less than the minimum, it will be the minimum.
   * @returns {number} The max duration in frames (min 8).
   */
  getMaxDuration()
  {
    if (this.getJabsData().duration() >= JABS_Action.getMinimumDuration())
    {
      return this.getJabsData().duration();
    }

    return JABS_Action.getMinimumDuration();
  };

  /**
   * Increments the duration for this `JABS_Action`. If the duration drops
   * to or below 0, then it will also flag this `JABS_Action` for removal.
   */
  countdownDuration()
  {
    this._currentDuration++;
    if (this.getMaxDuration() <= this._currentDuration)
    {
      this.setNeedsRemoval();
    }
  };

  /**
   * Gets whether or not this action is expired and should be removed.
   * @returns {boolean} True if expired and past the minimum count, false otherwise.
   */
  isActionExpired()
  {
    const isExpired = this.getMaxDuration() <= this._currentDuration;
    const minDurationElapsed = this._currentDuration > JABS_Action.getMinimumDuration();
    return (isExpired && minDurationElapsed);
  };

  /**
   * Gets whether or not this `JABS_Action` needs removing.
   * @returns {boolean} Whether or not this action needs removing.
   */
  getNeedsRemoval()
  {
    return this._needsRemoval;
  };

  /**
   * Sets whether or not this `JABS_Action` needs removing.
   * @param {boolean} remove Whether or not to remove this `JABS_Action`.
   */
  setNeedsRemoval(remove = true)
  {
    this._needsRemoval = remove;
  };

  /**
   * Gets the `Game_Event` this `JABS_Action` is bound to.
   * The `Game_Event` represents the visual aspect of this action.
   * @returns {Game_Event}
   */
  getActionSprite()
  {
    return this._actionSprite;
  }

  /**
   * Binds this `JABS_Action` to a provided `Game_Event`.
   * @param {Game_Event} actionSprite The `Game_Event` to bind to this `JABS_Action`.
   */
  setActionSprite(actionSprite)
  {
    this._actionSprite = actionSprite;
  };

  /**
   * Decrements the pre-countdown delay timer for this action. If the action does not
   * have `touchOnTrigger`, then the action will not affect anyone until the timer expires.
   */
  countdownDelay()
  {
    if (this._delayDuration > 0)
    {
      this._delayDuration--;
    }
  };

  /**
   * Gets whether or not the delay on this action has completed.
   *
   * This also includes if an action never had a delay to begin with.
   * @returns {boolean}
   */
  isDelayCompleted()
  {
    return this._delayDuration <= 0 && !this.isEndlessDelay();
  };

  /**
   * Automatically finishes the delay regardless of its current status.
   */
  endDelay()
  {
    this._delayDuration = 0;
  };

  /**
   * Gets whether or not this action will be delayed until triggered.
   * @returns {boolean}
   */
  isEndlessDelay()
  {
    return this._delayDuration === -1;
  };

  /**
   * Gets whether or not this action will be triggered by touch, regardless of its
   * delay counter.
   *
   * If `isEndlessDelay()` applies to this action, then it will automatically
   * trigger by touch regardless of configuration.
   * @returns {boolean}
   */
  triggerOnTouch()
  {
    return this._triggerOnTouch || this.isEndlessDelay();
  };

  /**
   * Gets the number of times this action can potentially hit a target.
   * @returns {number} The number of times remaining that this action can hit a target.
   */
  getPiercingTimes()
  {
    return this._pierceTimesLeft;
  };

  /**
   * Modifies the piercing times counter of this action by an amount (default = 1). If an action
   * reaches zero or less times, then it also sets it up for removal.
   * @param {number} decrement The number to decrement the times counter by for this action.
   */
  modPiercingTimes(decrement = 1)
  {
    this._pierceTimesLeft -= decrement;
    if (this._pierceTimesLeft <= 0)
    {
      this.setNeedsRemoval();
    }
  };

  /**
   * Gets the delay between hits for this action.
   * @returns {number} The number of frames between repeated hits.
   */
  getPiercingDelay()
  {
    return this._currentPierceDelay;
  };

  /**
   * Modifies the piercing delay by this amount (default = 1). If a negative number is
   * provided, then this will increase the delay by that amount instead.
   * @param {number} decrement The amount to modify the delay by.
   */
  modPiercingDelay(decrement = 1)
  {
    this._currentPierceDelay -= decrement;
  };

  /**
   * Resets the piercing delay of this action back to it's base.
   */
  resetPiercingDelay()
  {
    this._currentPierceDelay = this._basePierceDelay;
  };

  /**
   * Gets whether or not this action is a direct-targeting action.
   * @returns {boolean}
   */
  isDirectAction()
  {
    return this.getJabsData().direct() ?? false;
  };

  /**
   * Gets whether or not this action is a support action.
   * @returns {boolean}
   */
  isSupportAction()
  {
    return this._gameAction.isForFriend();
  };

  /**
   * The number of frames until this action's caster may act again.
   * @returns {number} The cooldown frames of this `JABS_Action`.
   */
  getCooldown()
  {
    return this.getJabsData().cooldown() ?? 0;
  };

  /**
   * Gets the ai-specific cooldown for this skill.
   * This is used in place of regular cooldowns for skills when present.
   * @returns {number}
   */
  getAiCooldown()
  {
    return this.getJabsData().aiCooldown() ?? 0;
  };

  /**
   * Gets the cast time for this skill.
   * @returns {number}
   */
  getCastTime()
  {
    // TODO: add a cast time modifier based on actor "all notes" collection.
    const castTime = this.getJabsData().castTime();

    // the unspecified cast time is -1.
    if (castTime < 0)
    {
      return 0;
    }

    // return the total cast time.
    return castTime;
  };

  /**
   * Gets the range of which this `JABS_Action` will reach.
   * @returns {number} The range of this action.
   */
  getRange()
  {
    // TODO: add ability to increase this (and duration).
    return this.getJabsData().range();
  };

  /**
   * Gets the proximity to the target in order to use this `JABS_Action`.
   * @returns {number} The proximity required for this action.
   */
  getProximity()
  {
    return this.getJabsData().proximity();
  };

  /**
   * Gets the shape of the hitbox for this `JABS_Action`.
   * @returns {string} The designated shape of the action.
   */
  getShape()
  {
    return this.getJabsData().shape();
  };

  /**
   * Gets the event id associated with this `JABS_Action` from the action map.
   * @returns {number} The event id for this `JABS_Action`.
   */
  getActionId()
  {
    return this.getJabsData().actionId();
  };

  /**
   * Gets any additional aggro this skill generates.
   * @returns {number}
   */
  bonusAggro()
  {
    return this.getJabsData().bonusAggro();
  };

  /**
   * Gets the aggro multiplier from this skill.
   * @returns {number}
   */
  aggroMultiplier()
  {
    return this.getJabsData().aggroMultiplier();
  };
}
//#endregion JABS_Action

//#region JABS_Aggro
/**
 * A tracker for managing the aggro for this particular battler and its owner.
 */
function JABS_Aggro()
{
  this.initialize(...arguments);
}

JABS_Aggro.prototype = {};
JABS_Aggro.prototype.constructor = JABS_Aggro;

/**
 * Initializes this class and it's members.
 * @param {string} uuid The uuid of the battler.
 */
JABS_Aggro.prototype.initialize = function(uuid)
{
  /**
   * The unique identifier of the battler this aggro is tracked for.
   * @type {string}
   */
  this.battlerUuid = uuid;

  /**
   * The numeric measurement of aggro from this battler.
   * @type {number}
   */
  this.aggro = 0;

  /**
   * Whether or not the aggro is locked at it's current value.
   * @type {boolean}
   */
  this.locked = false;
};

/**
 * Gets the `uuid` of the battler this aggro is associated with.
 * @returns {string}
 */
JABS_Aggro.prototype.uuid = function()
{
  return this.battlerUuid;
};

/**
 * Sets a lock on this aggro to prevent any modification of the aggro
 * regarding this battler.
 */
JABS_Aggro.prototype.lock = function()
{
  this.locked = true;
};

/**
 * Removes the lock on this aggro to allow modification of the aggro
 * regarding this battler.
 */
JABS_Aggro.prototype.unlock = function()
{
  this.locked = false;
};

/**
 * Resets the aggro back to 0.
 * Will do nothing if aggro is locked unless forced.
 */
JABS_Aggro.prototype.resetAggro = function(forced = false)
{
  if (this.locked && !forced) return;
  this.aggro = 0;
};

/**
 * Sets the aggro to a specific value.
 * Will do nothing if aggro is locked unless forced.
 */
JABS_Aggro.prototype.setAggro = function(newAggro, forced = false)
{
  if (this.locked && !forced) return;

  this.aggro = newAggro;
};

/**
 * Modifies the aggro by a given amount.
 * Can be negative.
 * Will do nothing if aggro is locked unless forced.
 * @param {number} modAggro The amount to modify.
 * @param {boolean} forced Forced aggro modifications override "aggro lock".
 */
JABS_Aggro.prototype.modAggro = function(modAggro, forced = false)
{
  if (this.locked && !forced) return;

  this.aggro += modAggro;
  if (this.aggro < 0) this.aggro = 0;
};
//#endregion JABS_Aggro

//#region JABS_Battler
/**
 * An object that represents the binding of a `Game_Event` to a `Game_Battler`.
 * This can be for either the player, an ally, or an enemy.
 */
function JABS_Battler()
{
  this.initialize(...arguments);
}

//#region initialize battler
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
  this.initAnimationInfo();
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
JABS_Battler.prototype.initBattleInfo = function()
{
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
 * Initializes the properties of this battler that are related to the character graphics.
 */
JABS_Battler.prototype.initAnimationInfo = function()
{
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
JABS_Battler.prototype.initCooldowns = function()
{
  this.initializeCooldown("global", 0);
  if (this.isEnemy())
  {
    // initialize all the skills assigned from the database.
    const skills = this.getSkillIdsFromEnemy();
    if (skills)
    {
      skills.forEach(skillIdAndRating =>
      {
        const skill = $dataSkills[skillIdAndRating];
        this.initializeCooldown(skill.name, 0);
      })
    }

    // initialize the basic attack skill if identified.
    const basicAttackSkillAndRating = this.getEnemyBasicAttack();
    if (basicAttackSkillAndRating)
    {
      const basicAttack = $dataSkills[basicAttackSkillAndRating[0]];
      this.initializeCooldown(basicAttack.name, 0);
    }
  }
  else
  {
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
 *
 * It does so blindly, with no regard for existing player battlers.
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

  return new JABS_Battler($gamePlayer, battler, coreData);
};

/**
 * Determines if the battler is close to the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isClose = function(distance)
{
  return distance <= 1.7;
};

/**
 * Determines if the battler is at a safe range from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isSafe = function(distance)
{
  return (distance > 1.7) && (distance <= 3.5);
};

/**
 * Determines if the battler is far away from the target based on distance.
 * @param {number} distance The distance away from the target.
 */
JABS_Battler.isFar = function(distance)
{
  return distance > 3.5;
};

/**
 * Determines whether or not the skill id is a guard-type skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.isGuardSkillById = function(id)
{
  if (!id) return false;

  return $dataSkills[id].stypeId === J.ABS.DefaultValues.GuardSkillTypeId;
};

/**
 * Determines whether or not the skill id is a dodge-type skill or not.
 * @returns {boolean} True if it is a dodge skill, false otherwise.
 */
JABS_Battler.isDodgeSkillById = function(id)
{
  if (!id) return false;

  return $dataSkills[id].stypeId === J.ABS.DefaultValues.DodgeSkillTypeId;
};

/**
 * Determines whether or not a skill should be visible
 * in the jabs combat skill assignment menu.
 * @param skill {rm.types.Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInCombatMenu = function(skill)
{
  const isDodgeSkillType = JABS_Battler.isDodgeSkillById(skill.id);
  const isGuardSkillType = JABS_Battler.isGuardSkillById(skill.id);
  const isWeaponSkillType = JABS_Battler.isWeaponSkillById(skill.id);
  const needsHiding = skill.meta && skill.meta["hideFromJabsMenu"]; // one-off hiding.
  return !isDodgeSkillType && !isGuardSkillType && !isWeaponSkillType && !needsHiding;
};

/**
 * Determines whether or not a skill should be visible
 * in the jabs dodge skill assignment menu.
 * @param skill {rm.types.Skill} The skill to check.
 * @returns {boolean}
 */
JABS_Battler.isSkillVisibleInDodgeMenu = function(skill)
{
  const isDodgeSkillType = JABS_Battler.isDodgeSkillById(skill.id);
  const needsHiding = skill.meta && skill.meta["hideFromJabsMenu"]; // one-off hiding.
  return isDodgeSkillType && !needsHiding;
};

/**
 * Determines whether or not an item should be visible
 * in the jabs tool assignment menu.
 * @param item {rm.types.Item}
 * @returns {boolean}
 */
JABS_Battler.isItemVisibleInToolMenu = function(item)
{
  const isItem = DataManager.isItem(item) && item.itypeId === 1;
  const isUsable = isItem && (item.occasion === 0);
  const needsHiding = item.meta && item.meta["hideFromJabsMenu"]; // one-off hiding.
  return isItem && isUsable && !needsHiding;
};

/**
 * Determines whether or not the skill id is a weapon-type skill or not.
 * @param id {number} The id of the skill to check.
 * @returns {boolean}
 */
JABS_Battler.isWeaponSkillById = function(id)
{
  if (!id) return false;

  return $dataSkills[id].stypeId === J.ABS.DefaultValues.WeaponSkillTypeId;
};

/**
 * Translates the AI attribute codes in `binary` form to a `JABS_BattlerAI`.
 * @param {string} code The code assigned in the notes that determines AI.
 * @returns {JABS_BattlerAI} The AI built off the provided attributes.
 */
JABS_Battler.translateAiCode = function(code)
{
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
//#endregion statics

//#region updates
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function()
{
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
JABS_Battler.prototype.updateAnimations = function()
{
  if (this._animating)
  {
    this.countdownAnimation();
  }
};

/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function()
{
  Object.keys(this._cooldowns)
    .forEach(key =>
    {
      this._cooldowns[key].update();
    });
  if (this.isPlayer())
  {
    // console.log('updating cooldowns.');
  }

  if (this.isWaiting())
  {
    this.countdownWait();
  }

  if (this.isAlerted())
  {
    this.countdownAlert();
  }

  if (this.parrying())
  {
    this.getCharacter()
      .requestAnimation(131, false);
    this.countdownParryWindow();
  }

  if (this.hasBattlerLastHit())
  {
    this.countdownLastHit();
  }
};

/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function()
{
  if (!this.canUpdateEngagement()) return;

  const targetResult = this.closestEnemyTarget();
  if (!targetResult[0] || targetResult[0].getUuid() === this.getUuid()) return;

  const target = targetResult[0];
  const distance = targetResult[1];
  if (this.isEngaged())
  {
    if (this.shouldDisengage(target, distance))
    {
      this.disengageTarget();
    }
  }
  else
  {
    if (this.shouldEngage(target, distance))
    {
      this.engageTarget(target);
    }
  }
};

/**
 * If this battler is the player, a hidden battler, an inanimate battler, or the abs is paused, then
 * prevent engagement updates.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateEngagement = function()
{
  return (!$gameBattleMap.absPause && !this.isPlayer() && !this.isHidden() && !this.isInanimate());
};

/**
 * Determines whether or not this battler should disengage from it's target.
 * @param {JABS_Battler} target The target to potentially disengage from.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldDisengage = function(target, distance)
{
  return !this.inPursuitRange(target, distance);
};

/**
 * Determines whether or not this battler should engage to the nearest target.
 * @param {JABS_Battler} target The target to potentially engage.
 * @param {number} distance The distance in number of tiles.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  return this.inSightRange(target, distance);
};

/**
 * Updates the dodge skill.
 * Currently only used by the player.
 */
JABS_Battler.prototype.updateDodging = function()
{
  if (!this.isPlayer()) return;

  // cancel the dodge if we got locked down.
  if (!this.canBattlerMove())
  {
    this.setDodging(false);
    this._dodgeSteps = 0;
  }

  // force dodge move while dodging.
  const player = this.getCharacter();
  if (!player.isMoving() &&
    this.canBattlerMove() &&
    this._dodgeSteps > 0 &&
    this._dodging)
  {
    player.moveStraight(this._dodgeDirection);
    this._dodgeSteps--;
  }

  // if the dodge is over, end the dodging.
  if (this._dodgeSteps <= 0 && !player.isMoving())
  {
    this.setDodging(false);
    this._dodgeSteps = 0;
    this.setInvincible(false);
  }
};

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
  if (this.getCharacter()._erased) return;

  // if we are dying, self-destruct.
  if (this.isDying() && !$gameMap._interpreter.isRunning())
  {
    this.destroy();
  }
};
//#endregion updates

//#region update helpers

//#region timers
/**
 * Set whether or not the battler is strafing.
 * Only applicable to the player.
 * @param {boolean} strafing Whether or not the player is strafing.
 */
JABS_Battler.prototype.setStrafing = function(strafing)
{
  this._strafing = strafing;
};

/**
 * Counts down the duration for this battler's wait time.
 */
JABS_Battler.prototype.countdownWait = function()
{
  if (this._waitCounter > 0)
  {
    this._waitCounter--;
    return;
  }

  if (this._waitCounter <= 0)
  {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Sets the battler's wait duration to a number. If this number is greater than
 * zero, then the battler must wait before doing anything else.
 * @param {number} wait The duration for this battler to wait.
 */
JABS_Battler.prototype.setWaitCountdown = function(wait)
{
  this._waitCounter = wait;
  if (this._waitCounter > 0)
  {
    this._waiting = true;
  }

  if (this._waitCounter <= 0)
  {
    this._waiting = false;
    this._waitCounter = 0;
  }
};

/**
 * Gets whether or not this battler is currently waiting.
 * @returns {boolean} True if waiting, false otherwise.
 */
JABS_Battler.prototype.isWaiting = function()
{
  return this._waiting;
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
 * If there is a cast animation to play and there is no current animation playing,
 * then play the cast animation on this battler.
 */
JABS_Battler.prototype.performCastAnimation = function()
{
  // if we don't have a decided action somehow, then don't do cast animation things.
  if (!this.getDecidedAction()) return;

  const animationId = this.getDecidedAction()[0].getBaseSkill()
    ._j
    .casterAnimation();
  if (!animationId) return;

  if (!this.getCharacter()
    .isAnimationPlaying())
  {
    this.showAnimation(animationId);
  }
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
  if (!this.isEngaged())
  {
    this.showBalloon(J.ABS.Balloons.Silence);
  }
};
//#endregion timers

//#region dodging
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
JABS_Battler.prototype.setDodging = function(dodging = true)
{
  this._dodging = dodging;
};

/**
 * Tries to execute the battler's dodge skill.
 * Checks to see if costs are payable before executing.
 */
JABS_Battler.prototype.tryDodgeSkill = function()
{
  const battler = this.getBattler();
  const skillId = battler.getEquippedSkill(Game_Actor.JABS_DODGESKILL);
  if (!skillId) return;

  const skill = $dataSkills[skillId];
  const canPay = battler.canPaySkillCost(skill);
  if (canPay && skill._j.moveType())
  {
    this.executeDodgeSkill(skill);
  }
};

/**
 * Executes the provided dodge skill.
 * @param {rm.types.Skill} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill)
{
  // change over to the action pose for the skill.
  this.performActionPose(skill);

  // trigger invincibility for dodging if applicable.
  const invincible = skill._j.invincible();
  this.setInvincible(invincible);

  // increase the move speed while dodging to give the illusion of "dodge-rolling".
  const dodgeSpeed = 2;
  this.getCharacter().setDodgeBoost(dodgeSpeed);

  // set the number of steps this dodge will roll you.
  const range = skill._j.range();
  this._dodgeSteps = range;

  // set the direction to be dodging in (front/back/specified).
  const moveType = skill._j.moveType();
  const direction = this.determineDodgeDirection(moveType);
  this._dodgeDirection = direction;

  // pay whatever costs are associated with the skill.
  this.getBattler().paySkillCost(skill);

  // apply the cooldowns for the dodge.
  const cooldown = skill._j.cooldown();
  this.modCooldownCounter(Game_Actor.JABS_DODGESKILL, cooldown);

  // trigger the dodge!
  this.setDodging();
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
//#endregion dodging

//#region regeneration
/**
 * Updates all regenerations and ticks four times per second.
 */
JABS_Battler.prototype.updateRG = function()
{
  if (this.isRegenReady() && !this.getBattler()
    .isDead())
  {
    this.performRegeneration();
    this.setRegenCounter(15);
  }
};
/**
 * Whether or not the regen tick is ready.
 * @returns {boolean} True if its time for a regen tick, false otherwise.
 */
JABS_Battler.prototype.isRegenReady = function()
{
  if (this.getRegenCounter() <= 0)
  {
    this.setRegenCounter(0);
    return true;
  }
  else
  {
    this._regenCounter--;
    return false;
  }
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
  let states = battler.states();
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
  const battler = this.getBattler();
  const {hrg, rec} = battler;
  const naturalHp5 = ((hrg * 100) * 0.05) * rec;
  battler.gainHp(naturalHp5);
};

/**
 * Processes the natural MRG for this battler.
 */
JABS_Battler.prototype.processNaturalMpRegen = function()
{
  const battler = this.getBattler();
  const {mrg, rec} = battler;
  const naturalMp5 = ((mrg * 100) * 0.05) * rec;
  battler.gainMp(naturalMp5);
};

/**
 * Processes the natural TRG for this battler.
 */
JABS_Battler.prototype.processNaturalTpRegen = function()
{
  const battler = this.getBattler();
  const {trg, rec} = battler;
  const naturalTp5 = ((trg * 100) * 0.05) * rec;
  battler.gainTp(naturalTp5);
};

/**
 * Processes all regenerations derived from state tags.
 * @param {rm.types.State[]} states The filtered list of states to parse.
 */
JABS_Battler.prototype.processStateRegens = function(states)
{
  const battler = this.getBattler();

  // default the regenerations to the battler's innate regens.
  const {rec} = battler;
  const regens = [0, 0, 0];

  // process each state for slip actions.
  for (const state of states)
  {
    regens[0] += this.stateSlipHp(state);
    regens[1] += this.stateSlipMp(state);
    regens[2] += this.stateSlipTp(state);
  }

  regens.forEach((regen, index) =>
  {
    // if it wasn't modified, don't worry about it.
    if (!regen)
    {
      return;
    }

    // apply REC effects.
    if (regen > 0)
    {
      regen *= rec;
    }

    // apply "per5" rate- 4 times per second, for 5 seconds.
    regen *= 0.05;

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
 * @param {rm.types.State} state The state to check if needing processing.
 * @returns {boolean} True if we should process this state, false otherwise.
 */
JABS_Battler.prototype.shouldProcessState = function(state)
{
  const battler = this.getBattler();
  const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
  if (!trackedState)
  {
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
 * @param {rm.types.State} state The state to process.
 * @returns {number} The hp regen from this state.
 */
JABS_Battler.prototype.stateSlipHp = function(state)
{
  const battler = this.getBattler();
  const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
  const {slipHpFlat, slipHpPerc, slipHpFormula} = state._j;
  let tagHp5 = 0;

  // if the flat tag exists, use it.
  if (slipHpFlat)
  {
    tagHp5 += slipHpFlat;
  }

  // if the percent tag exists, use it.
  if (slipHpPerc)
  {
    const factor = battler.mhp * (slipHpPerc / 100);
    tagHp5 += factor;
  }

  // if the formula tag exists, use it.
  if (slipHpFormula)
  {
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.
    const result = Math.round(eval(slipHpFormula) * -1);
    if (Number.isFinite(result))
    {
      tagHp5 += result;
    }
    else
    {
      console.warn(`The state of ${state.id} has an hp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${slipHpFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  return tagHp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {rm.types.State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipMp = function(state)
{
  const battler = this.getBattler();
  const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
  const {slipMpFlat, slipMpPerc, slipMpFormula} = state._j;
  let tagMp5 = 0;

  // if the flat tag exists, use it.
  if (slipMpFlat)
  {
    tagMp5 += slipMpFlat;
  }

  // if the percent tag exists, use it.
  if (slipMpPerc)
  {
    const factor = battler.mmp * (slipMpPerc / 100);
    tagMp5 += factor;
  }

  // if the formula tag exists, use it.
  if (slipMpFormula)
  {
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.
    const result = Math.round(eval(slipMpFormula) * -1);
    if (Number.isFinite(result))
    {
      tagMp5 += result;
    }
    else
    {
      console.warn(`The state of ${state.id} has an mp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${slipMpFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  return tagMp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {rm.types.State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipTp = function(state)
{
  const battler = this.getBattler();
  const trackedState = $gameBattleMap.findStateTrackerByBattlerAndState(battler, state.id);
  const {slipTpFlat, slipTpPerc, slipTpFormula} = state._j;

  let tagTp5 = 0;

  if (slipTpFlat)
  {
    tagTp5 += slipTpFlat;
  }

  if (slipTpPerc)
  {
    const factor = battler.maxTp() * (slipTpPerc / 100);
    tagTp5 += factor;
  }

  if (slipTpFormula)
  {
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.
    const result = Math.round(eval(slipTpFormula) * -1);
    if (Number.isFinite(result))
    {
      tagTp5 += result;
    }
    else
    {
      console.warn(`The state of ${state.id} has a tp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${slipTpFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  return tagTp5;
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
  character.setRequestTextPop();
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

/**
 * Applies the regeneration amount to the appropriate parameter.
 * @param {number} amount The regen amount.
 * @param {number} type The regen type- identified by index.
 */
JABS_Battler.prototype.applySlipEffect = function(amount, type)
{
  const battler = this.getBattler();
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
//#endregion regeneration

/**
 * Determines the closest enemy target.
 * @returns {[JABS_Battler, number]}
 */
JABS_Battler.prototype.closestEnemyTarget = function()
{
  const battlers = $gameMap.getOpposingBattlersWithinRange(this, this.getSightRadius());
  let currentClosest = null;
  let closestDistanceYet = 1000;
  battlers.forEach(battler =>
  {
    // don't engage same team and don't engage self
    if (this.isSameTeam(battler.getTeam())) return;
    if (this.getUuid() === battler.getUuid()) return;

    const distance = this.distanceToDesignatedTarget(battler);
    if (distance < closestDistanceYet)
    {
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
  if (this.isMovementLocked())
  {
    return false;
  }

  const states = this.getBattler()
    .states();
  if (!states.length)
  {
    return true;
  }
  else
  {
    const rooted = states.find(state => (state._j.rooted || state._j.paralyzed));
    return !rooted;
  }
};

/**
 * Whether or not the battler is able to use attacks based on states.
 * @returns {boolean} True if the battler can attack, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseAttacks = function()
{
  const states = this.getBattler()
    .states();
  if (!states.length)
  {
    return true;
  }
  else
  {
    const disabled = states.find(state => (state._j.disabled || state._j.paralyzed));
    return !disabled;
  }
};

/**
 * Whether or not the battler is able to use skills based on states.
 * @returns {boolean} True if the battler can use skills, false otherwise.
 */
JABS_Battler.prototype.canBattlerUseSkills = function()
{
  const states = this.getBattler()
    .states();
  if (!states.length)
  {
    return true;
  }
  else
  {
    const muted = states.find(state => (state._j.muted || state._j.paralyzed));
    return !muted;
  }
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
//#endregion update helpers

//#region reference helpers
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
JABS_Battler.prototype.hasOffhandSkill = function()
{
  const battler = this.getBattler();
  const offhandGear = battler.equips()[1];
  return !!(offhandGear && offhandGear._j.skillId);
};

/**
 * Destroys this battler and removes it from the current battle map.
 */
JABS_Battler.prototype.destroy = function()
{
  this.setInvincible();
  $gameMap.destroyBattler(this);
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
  let pursuitRadius = this.getPursuitRadius();

  // if the target is an actor, they may have pursuit reduction/boost from something.
  if (target.isActor())
  {
    // apply the modification from the actor, if any.
    const visionMultiplier = target.getBattler().getVisionModifier();
    pursuitRadius *= visionMultiplier;
  }

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
  let sightRadius = this.getSightRadius();

  // if the target is an actor, they may have sight reduction/boost from something.
  if (target.isActor())
  {
    // apply the modification from the actor, if any.
    const visionMultiplier = target.getBattler().getVisionModifier();
    sightRadius *= visionMultiplier;
  }

  return (distance <= sightRadius);
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
    return $gameMap.getBattlerByUuid(this._leaderUuid);
  }
  else
  {
    return null;
  }
};

/**
 * Sets the `uuid` of the leader of this battler.
 * @param {string} newLeader The leader's `uuid`.
 */
JABS_Battler.prototype.setLeader = function(newLeader)
{
  const leader = $gameMap.getBattlerByUuid(newLeader);
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
    return $gameMap.getBattlerByUuid(foundUuid);
  }
  else
  {
    return null;
  }
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
    $gameBattleMap.clearLeaderDataByUuid(followerUuid);
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

    const leader = $gameMap.getBattlerByUuid(leaderUuid);
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
 * @returns {rm.types.Actor|rm.types.Enemy} The battler data.
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
 * Whether or not this battler is a `Game_Enemy`.
 * @returns {boolean}
 */
JABS_Battler.prototype.isEnemy = function()
{
  return (this.getBattler() instanceof Game_Enemy);
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
 * @returns {JABS_Action[]}
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
  else
  {
    return !!character.event();
  }
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

  this._engaged = true;
  this.setTarget(target);
  this.setIdle(false);
  this.addUpdateAggro(target.getUuid(), 0);
  this.showBalloon(J.ABS.Balloons.Exclamation);
  if (this.isActor())
  {
    // disable walking through walls while the follower is engaged.
    this.getCharacter()
      .setThrough(false);
  }

  // if we're alerted, also clear the alert state.
  this.clearAlert();
};

/**
 * Disengage from the target.
 */
JABS_Battler.prototype.disengageTarget = function()
{
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
 * @returns {JABS_Battler}
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
  else if (!$gameMap.battlerExists(this))
  { // battler isn't on the map.
    return true;
  }
  else if (battler.isDead() || this.isDying())
  { // battler is actually dead.
    return true;
  }
  else
  { // battler is OK!
    return false;
  }
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
 * @param {number} x2 The x coordinate to check.
 * @param {number} y2 The y coordinate to check.
 * @returns {number} The distance from the battler to the point.
 */
JABS_Battler.prototype.distanceToPoint = function(x2, y2)
{
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
JABS_Battler.prototype.distanceToDesignatedTarget = function(target)
{
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current target.
 * @returns {number} The distance.
 */
JABS_Battler.prototype.distanceToCurrentTarget = function()
{
  const target = this.getTarget();
  if (!target) return null;

  return this.distanceToPoint(target.getX(), target.getY());
};

/**
 * Determines distance from this battler and the current ally target.
 * @returns {number} The distance.
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
 * @returns {JABS_BattlerAI} This battler's AI.
 */
JABS_Battler.prototype.getAiMode = function()
{
  return this._aiMode;
};

/**
 * Gets this follower's leader's AI.
 * @returns {JABS_BattlerAI} This battler's leader's AI.
 */
JABS_Battler.prototype.getLeaderAiMode = function()
{
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
JABS_Battler.prototype.moveAwayFromTarget = function()
{
  const battler = this.getCharacter();
  const target = this.getTarget()
    .getCharacter();
  if (!target) return;

  battler.moveAwayFromCharacter(target);
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
  const nextDir = character.findDiagonalDirectionTo(x, y);

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

//#endregion reference helpers

//#region isReady & cooldowns
/**
 * Initializes a cooldown with the given key.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration to initialize this cooldown with.
 */
JABS_Battler.prototype.initializeCooldown = function(cooldownKey, duration)
{
  if (!this._cooldowns[cooldownKey])
  {
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
JABS_Battler.prototype.getCooldown = function(cooldownKey)
{
  return this._cooldowns[cooldownKey];
};

/**
 * Gets the cooldown and skill slot data for a given key.
 * @param {string} key The slot to get the data for.
 * @returns {{ cooldown: JABS_Cooldown, skillslot: JABS_SkillSlot }}
 */
JABS_Battler.prototype.getActionKeyData = function(key)
{
  return {
    cooldown: this.getCooldown(key),
    skillslot: this.getBattler()
      .getSkillSlot(key)
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
  else
  {
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
  }
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
  else
  {
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
  }
};

/**
 * Whether or not the skilltype has a base or combo cooldown ready.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @returns {boolean} True if the given skilltype is ready, false otherwise.
 */
JABS_Battler.prototype.isSkillTypeCooldownReady = function(cooldownKey)
{
  return this._cooldowns[cooldownKey].isAnyReady();
};

/**
 * Modifies the cooldown for this key by a given amount.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.modCooldownCounter = function(cooldownKey, duration)
{
  try
  {
    this._cooldowns[cooldownKey].modBaseFrames(duration);
  }
  catch (ex)
  {
    console.log(cooldownKey, duration);
    console.warn(ex);
  }
};

/**
 * Set the cooldown timer to a designated number.
 * @param {string} cooldownKey The key of this cooldown.
 * @param {number} duration The duration of this cooldown.
 */
JABS_Battler.prototype.setCooldownCounter = function(cooldownKey, duration)
{
  this._cooldowns[cooldownKey].setFrames(duration);
};

/**
 * Resets this battler's combo information.
 * @param {string} cooldownKey The key of this cooldown.
 */
JABS_Battler.prototype.resetComboData = function(cooldownKey)
{
  this._cooldowns[cooldownKey].resetCombo();
};

/**
 * Sets the combo frames to be a given value.
 * @param {string} cooldownKey The key associated with the cooldown.
 * @param {number} duration The number of frames until this combo action is ready.
 */
JABS_Battler.prototype.setComboFrames = function(cooldownKey, duration)
{
  this._cooldowns[cooldownKey].setComboFrames(duration);
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
  else
  {
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
  }
};

/**
 * Determines the number of frames between opportunity to take the next action.
 * This maps to time spent in phase1 of JABS AI.
 * @returns {number} The number of frames between actions.
 */
JABS_Battler.prototype.getPrepareTime = function()
{
  if (!this.isPlayer())
  {
    return this.getBattler()
      .prepareTime();
  }
};

/**
 * Determines whether or not a skill can be executed based on restrictions or not.
 * @param {number} chosenSkillId The skill id to be executed.
 * @returns {boolean} True if this skill can be executed, false otherwise.
 */
JABS_Battler.prototype.canExecuteSkill = function(chosenSkillId)
{
  const canUseSkills = this.canBattlerUseSkills();
  const canUseAttacks = this.canBattlerUseAttacks();
  const basicAttackId = this.getEnemyBasicAttack()[0];

  // if can't use basic attacks or skills, then autofail.
  if (!canUseSkills && !canUseAttacks)
  {
    return false;
  }

  // if the skill is a basic attack, but the battler can't attack, then fail.
  const isBasicAttack = chosenSkillId === basicAttackId;
  if (!canUseAttacks && isBasicAttack)
  {
    return false;
  }

  // if the skill is an assigned skill, but the battler can't use skills, then fail.
  if (!canUseSkills && !isBasicAttack)
  {
    return false;
  }

  // if the skill cost is more than the battler has resources for, then fail.
  const battler = this.getBattler();
  const canPay = battler.canPaySkillCost($dataSkills[chosenSkillId]);
  if (!battler.canPaySkillCost($dataSkills[chosenSkillId]))
  {
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
JABS_Battler.prototype.getAllNearbyAllies = function()
{
  return $gameMap.getAllyBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};

/**
 * Gets the ally ai associated with this battler.
 * @returns {JABS_AllyAI}
 */
JABS_Battler.prototype.getAllyAiMode = function()
{
  // enemies do not have ally ai.
  if (this.isEnemy()) return null;

  return this.getBattler()
    .getAllyAI();
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
  return this._cooldowns[cooldownKey].comboNextActionId;
};

/**
 * Sets the skill id for the next combo action in the sequence.
 * @param {string} cooldownKey The cooldown key to check readiness for.
 * @param {number} nextComboId The skill id for the next combo action.
 */
JABS_Battler.prototype.setComboNextActionId = function(cooldownKey, nextComboId)
{
  this._cooldowns[cooldownKey].comboNextActionId = nextComboId;
};

/**
 * Gets all skills that are available to this enemy battler.
 * @returns {number[]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function()
{
  const battler = this.getBattler();
  let battlerData = $dataEnemies[battler.enemyId()];

  // filter out any "extend" skills as far as this collection is concerned.
  return battlerData.actions
    .filter(action =>
    {
      const skill = $dataSkills[action.skillId];
      const isExtendSkill = skill.meta && skill.meta['skillExtend'];
      return !isExtendSkill;
    })
    .map(action => action.skillId);
};

/**
 * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
 * @returns {[number, number]} The `[skillId, rating]` of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function()
{
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

/**
 * Gets the speedboost values for this battler.
 * @returns {number} The speedboost value.
 */
JABS_Battler.prototype.getSpeedBoosts = function()
{
  // only calculate for the player (and allies).
  if (this.isEnemy()) return 0;

  return this.getBattler()
    .getSpeedBoosts();
};
//#endregion get data

//#region aggro
/**
 * Adjust the currently engaged target based on aggro.
 */
JABS_Battler.prototype.adjustTargetByAggro = function()
{
  // don't process aggro for inanimate battlers.
  if (this.isInanimate()) return;

  if (!this.getTarget())
  {
    const highestAggro = this.getHighestAggro();
    const newTarget = $gameMap.getBattlerByUuid(highestAggro.uuid());
    if (newTarget)
    {
      this.setTarget(newTarget);
    }

    return;
  }

  // if the target is dead, disengage and end combat.
  // TODO: is this a race condition?
  this.removeAggroIfTargetDead(this.getTarget()
    .getUuid());

  // if there is no aggros remaining, disengage.
  if (this._aggros.length === 0)
  {
    this.disengageTarget();
    return;
  }

  // if there is only 1 aggro remaining
  if (this._aggros.length === 1)
  {
    const zerothAggroUuid = this._aggros[0].uuid();
    // if there is no target, just stop that shit.
    if (!this.getTarget()) return;

    // check to see if the last aggro in the list belongs to the current target.
    if (!(this.getTarget()
      .getUuid() === zerothAggroUuid))
    {
      // if it doesn't, then get that battler.
      const newTarget = $gameMap.getBattlerByUuid(zerothAggroUuid);
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
    return;
  }

  // if you still don't have a target but have multiple aggros, then just give up.
  if (!this.getTarget()) return;

  // find the highest aggro target currently being tracked.
  const highestAggroTarget = this.getHighestAggro();

  // if the current target isn't the highest target, then switch!
  if (!(highestAggroTarget.uuid() === this.getTarget()
    .getUuid()))
  {

    // find the new target to change to that has more aggro than the current target.
    const newTarget = $gameMap.getBattlerByUuid(highestAggroTarget.uuid());

    // if we can't find the target on the map somehow, then try to remove it from the list of aggros.
    if (!newTarget)
    {
      // get the index to remove...
      this.removeAggro(highestAggroTarget.uuid());
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
 * @returns {JABS_Aggro}
 */
JABS_Battler.prototype.getHighestAggro = function()
{
  return this._aggros.sort((a, b) =>
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
  })[0];
};

/**
 * If the target is dead, removes it's aggro.
 * @param uuid
 */
JABS_Battler.prototype.removeAggroIfTargetDead = function(uuid)
{
  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler || battler.isDead())
  {
    this.removeAggro(uuid);
  }
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
    if (this.getTarget()
      .getUuid() === uuid)
    {
      this.disengageTarget();
    }

    // ...and remove it.
    this._aggros.splice(indexToRemove, 1);
  }

  if (this._aggros.lenghth)
  {

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
  if (this.getBattler()
    .isAggroLocked() && !forced)
  {
    return;
  }

  this.resetOneAggro(uuid, forced);
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

//#endregion aggro

//#region create/apply effects
/**
 * Performs a preliminary check to see if the target is actually able to be hit.
 * @returns {boolean} True if actions can potentially connect, false otherwise.
 */
JABS_Battler.prototype.canActionConnect = function()
{
  // this battler is untargetable.
  if (this.isInvincible() || this.isHidden()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Cheat)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter()
    .isAction())
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
JABS_Battler.prototype.createMapActionFromSkill = function(
  skillId,
  isRetaliation = false,
  cooldownKey = null)
{
  const battler = this.getBattler();
  const action = new Game_Action(battler, false);

  // set the skill which also applies all applicable overlays.
  action.setSkill(skillId);

  let skill = null;
  if (J.EXTEND)
  {
    // if using the skill extension plugin, then get the extended skill.
    skill = OverlayManager.getExtendedSkill(this.getBattler(), skillId);

    // apply all on-cast self states.
    action.applyOnCastSelfStates();
  }
  else
  {
    // otherwise get the regular skill.
    skill = $dataSkills[skillId];
  }

  // calculate the projectile count and directions.
  const projectileCount = skill._j.projectile();
  const projectileDirections = $gameBattleMap.determineActionDirections(
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
      cooldownKey,
    });

    actions.push(mapAction);
  });

  return actions;
};

/**
 * Constructs the attack data from this battler's skill slot.
 * @param {string} cooldownKey The cooldown key.
 * @returns {JABS_Action[]} The constructed `JABS_Action`s.
 */
JABS_Battler.prototype.getAttackData = function(cooldownKey)
{
  const battler = this.getBattler();

  // get the skill equipped in the designated slot.
  let skillId = battler.getEquippedSkill(cooldownKey);

  // if there isn't one, then we don't do anything.
  if (!skillId) return [];

  // check to make sure we can actually use the skill.
  const canUse = battler.canUse($dataSkills[skillId]);

  // check to make sure we actually know the skill, too.
  const hasSkill = battler.hasSkill(skillId);

  // if we don't know the skill or can't use it, then don't do anything.
  if (!canUse || !hasSkill) return null;

  // if we have combo action data, use that.
  const comboAction = this.getComboData(cooldownKey);
  if (comboAction === null)
  {
    // do nothing, the combo isn't ready.
  }
  else if (comboAction.length)
  {
    return comboAction;
  }

  // otherwise, use the skill from the slot to build an action.
  return this.createMapActionFromSkill(skillId, false, cooldownKey);
};

/**
 * Gets the combo data for a particular slot.
 * @param {string} cooldownKey The cooldown key.
 * @returns {JABS_Action[]|null} The constructed `JABS_Action`s.
 */
JABS_Battler.prototype.getComboData = function(cooldownKey)
{
  const battler = this.getBattler();

  // check the slot for a combo action.
  const comboActionId = this.getComboNextActionId(cooldownKey);
  this.resetComboData(cooldownKey);
  if (comboActionId !== 0)
  {
    // check to make sure we can actually use the skill.
    const canUseCombo = battler.canUse($dataSkills[comboActionId]);
    if (!canUseCombo) return null;

    // check to make sure we actually know the skill, too.
    const hasSkill = battler.hasSkill(comboActionId);
    if (!hasSkill) return null;

    // we know and can use the skill, so lets combo it up!
    return this.createMapActionFromSkill(comboActionId, false, cooldownKey);
  }

  // we came up empty for combos.
  return null;
};

/**
 * Consumes an item and performs its effects.
 * @param {number} toolId The id of the tool/item to be used.
 * @param {boolean} isLoot Whether or not this is a loot pickup.
 */
JABS_Battler.prototype.applyToolEffects = function(toolId, isLoot = false)
{
  const item = $dataItems[toolId];
  const playerBattler = this.getBattler();
  playerBattler.consumeItem(item);
  const gameAction = new Game_Action(playerBattler, false);
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

  const { cooldown: itemCooldown, skillId: itemSkillId } = item._j;

  // it is an item with a custom cooldown.
  if (itemCooldown)
  {
    if (!isLoot) this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, itemCooldown);
  }

  // it was an item with a skill attached.
  if (itemSkillId)
  {
    const mapAction = this.createMapActionFromSkill(itemSkillId);
    mapAction.forEach(action =>
    {
      action.setCooldownType(Game_Actor.JABS_TOOLSKILL);
      $gameBattleMap.executeMapAction(this, action);
    });
  }

  // it was an item, didn't have a skill attached, and didn't have a cooldown.
  if (!itemCooldown && !itemSkillId && !isLoot)
  {
    this.modCooldownCounter(Game_Actor.JABS_TOOLSKILL, J.ABS.DefaultValues.CooldownlessItems);
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item))
  {
    playerBattler.setEquippedSkill(Game_Actor.JABS_TOOLSKILL, 0);
    const log = new MapLogBuilder()
      .setupUsedLastItem(item.id)
      .build();
    $gameTextLog.addLog(log);
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
  this.showAnimation($dataItems[toolId].animationId);
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
  const toolData = $dataItems[itemId];

  // generate the textpop.
  const itemPop = $gameBattleMap.configureDamagePop(gameAction, toolData, this, target);

  // add the pop to the target's tracking.
  character.addTextPop(itemPop);
  character.setRequestTextPop();
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
  const battlers = $gameMap.getEnemyBattlers();
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
 * @param {JABS_Battler} victor The `JABS_Battler` that defeated this battler.
 */
JABS_Battler.prototype.performPredefeatEffects = function(victor)
{
  const battler = this.getBattler();
  if (this.isActor() && battler.needsDeathEffect())
  {
    this.showAnimation(152);
    battler.toggleDeathEffect();
  }
  else if (this.isEnemy())
  {
    this.showAnimation(151);
  }

  const onOwnDefeatSkills = battler.onOwnDefeatSkillIds();
  if (onOwnDefeatSkills.length)
  {
    onOwnDefeatSkills.forEach(onDefeatSkill =>
    {
      if (onDefeatSkill.shouldTrigger())
      {
        $gameBattleMap.forceMapAction(this, onDefeatSkill.skillId, false);
      }
    });
  }

  const onTargetDefeatSkills = victor.getBattler()
    .onTargetDefeatSkillIds();
  if (onTargetDefeatSkills.length)
  {
    onTargetDefeatSkills.forEach(onDefeatSkill =>
    {
      const castFromTarget = onDefeatSkill.appearOnTarget();
      if (onDefeatSkill.shouldTrigger())
      {
        if (castFromTarget)
        {
          $gameBattleMap.forceMapAction(victor, onDefeatSkill.skillId, false, this.getX(), this.getY());
        }
        else
        {
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
JABS_Battler.prototype.performPostdefeatEffects = function(victor)
{
  if (this.isActor())
  {
    this.setDying(true);
  }
};
//#endregion apply effects

//#region guarding
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
 * @returns {number}
 */
JABS_Battler.prototype.counterGuard = function()
{
  return this.guarding()
    ? this.counterGuardId()
    : 0;
};

/**
 * Gets the id of the skill for counter-guarding.
 * @returns {number}
 */
JABS_Battler.prototype.counterGuardId = function()
{
  return this._counterGuardId;
};

/**
 * Sets the battler's retaliation id for guarding.
 * @param {number} counterGuardSkillId The skill id to counter with while guarding.
 */
JABS_Battler.prototype.setCounterGuard = function(counterGuardSkillId)
{
  this._counterGuardId = counterGuardSkillId;
};

/**
 * Checks to see if retrieving the counter-parry skill id is appropriate.
 * @returns {number}
 */
JABS_Battler.prototype.counterParry = function()
{
  return this.guarding()
    ? this.counterParryId()
    : 0;
};

/**
 * Gets the id of the skill for counter-parrying.
 * @returns {number}
 */
JABS_Battler.prototype.counterParryId = function()
{
  return this._counterParryId;
};

/**
 * Sets the id of the skill to retaliate with when successfully precise-parrying.
 * @param {number} counterParrySkillId The skill id of the counter-parry skill.
 * @returns {number}
 */
JABS_Battler.prototype.setCounterParry = function(counterParrySkillId)
{
  this._counterParryId = counterParrySkillId;
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
  const battler = this.getBattler()
  const skillId = battler.getEquippedSkill(cooldownKey);
  if (!skillId) return null;

  const canUse = battler.canUse($dataSkills[skillId]);
  if (!canUse)
  {
    return null;
  }

  const skill = OverlayManager.getExtendedSkill(battler, skillId);
  const [flat, percent] = skill._j.guard();
  const parry = skill._j.parry();
  const counterParry = skill._j.counterParry();
  const counterGuard = skill._j.counterGuard();
  return new JABS_GuardData(skillId, flat, percent, counterGuard, counterParry, parry);
};

/**
 * Determines whether or not the skill slot is a guard-type skill or not.
 * @param {string} cooldownKey The key to determine if its a guard skill or not.
 * @returns {boolean} True if it is a guard skill, false otherwise.
 */
JABS_Battler.prototype.isGuardSkillByKey = function(cooldownKey)
{
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
JABS_Battler.prototype.executeGuard = function(guarding, skillSlot)
{
  // if we're still guarding, and already in a guard state, don't reset.
  if (guarding && this.guarding()) return;

  // if not guarding anymore, turn off the guard state.
  if (!guarding && this.guarding())
  {
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
  this.setGuardSkillId(guardData.skillId);

  // calculate parry frames, include eva bonus to parry.
  const totalParryFrames = this.getBonusParryFrames(guardData) + guardData.parryDuration;

  // if the guarding skill has a parry window, apply those frames once.
  if (guardData.canParry()) this.setParryWindow(totalParryFrames);

  // set the pose!
  const battler = this.getBattler();
  const skillId = battler.getEquippedSkill(skillSlot);
  const skill = OverlayManager.getExtendedSkill(battler, skillId);
  this.performActionPose(skill);
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
//#endregion guarding

//#region actionposes/animations
/**
 * Executes an action pose.
 * Will silently fail if the asset is missing.
 * @param {rm.types.Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill)
{
  // if we are still animating from a previous skill, prematurely end it.
  if (this._animating)
  {
    this.endAnimation();
  }

  // if we have a pose suffix for this skill, then try to perform the pose.
  if (skill._j.poseSuffix())
  {
    this.changeCharacterSprite(skill);
  }
};

/**
 * Executes the change of character sprite based on the action pose data
 * from within a skill's notes.
 * @param {rm.types.Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.changeCharacterSprite = function(skill)
{
  // get the action pose data from the skill.
  const notedata = skill._j.poseSuffix();
  const [suffix, index, duration] = notedata;

  // establish the base sprite data.
  const baseSpriteName = this.getCharacterSpriteName();
  this.captureBaseSpriteInfo();

  // define the duration for this pose.
  this.setAnimationCount(duration);

  // determine the new action pose sprite name.
  const newCharacterSprite = `${baseSpriteName}${suffix}`;

  // only actually switch to the other character sprite if it exists.
  ImageManager
    .probeCharacter(newCharacterSprite)
    .then(() =>
    {
      ImageManager.loadCharacter(newCharacterSprite);
      this.getCharacter()
        .setImage(newCharacterSprite, index);
    })
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
  this._animationFrames = count;
  if (this._animationFrames > 0)
  {
    this._animating = true;
  }

  if (this._animationFrames <= 0)
  {
    this._animating = false;
    this._animationFrames = 0;
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetAnimation = function()
{
  if (!this._baseSpriteImage && !this._baseSpriteIndex) return;
  if (this._animating)
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

/**
 * Whether or not this battler is ready to take action of any kind.
 * @returns {boolean} True if the battler is ready, false otherwise.
 */
JABS_Battler.prototype.countdownAnimation = function()
{
  // if guarding, then it must be a guard animation.
  if (this.guarding()) return;

  if (this._animationFrames > 0)
  {
    this._animationFrames--;
    if (this._animationFrames < 4)
    {
      this.getCharacter()._pattern = 0;
    }
    else if (this._animationFrames > 10)
    {
      this.getCharacter()._pattern = 2;
    }
    else
    {
      this.getCharacter()._pattern = 1;
    }
  }
  else
  {
    this.resetAnimation();
  }
};
//#endregion actionposes/animations

//#region utility helpers
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
//#endregion utility helpers
//#endregion JABS_Battler

//#region JABS_BattlerAI
/**
 * An object representing the structure of the `JABS_Battler` AI.
 */
class JABS_BattlerAI
{
  /**
   * @constructor
   * @param {boolean} basic Enable the most basic of AI (recommended).
   * @param {boolean} smart Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} defensive Add defending and support skills for allies.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    basic = true,
    smart = false,
    executor = false,
    defensive = false,
    reckless = false,
    healer = false,
    follower = false,
    leader = false
  )
  {
    /**
     * The most basic of AI: just move and take action.
     *
     * `10000000`, first bit.
     */
    this.basic = basic;

    /**
     * Adds an additional skillset; enabling intelligent pursuit among other things.
     *
     * `01000000`, second bit.
     */
    this.smart = smart;

    /**
     * Adds an additional skillset; targeting a foe's weakspots if available.
     *
     * `00100000`, third bit.
     */
    this.executor = executor;

    /**
     * Adds an additional skillset; allowing defending in place of action
     * and supporting allies with buff skills.
     *
     * `00010000`, fourth bit.
     */
    this.defensive = defensive;

    /**
     * Adds an additional skillset; forcing skills whenever available.
     *
     * `00001000`, fifth bit.
     */
    this.reckless = reckless;

    /**
     * Adds an additional skillset; prioritizing healing skills when either
     * oneself' or allies' current health reach below 66% of max health.
     *
     * `00000100`, sixth bit.
     */
    this.healer = healer;

    /**
     * Adds an additional skillset; performs only basic attacks when
     * engaged. If a leader is nearby, a leader will encourage actually
     * available skills intelligently based on the target.
     *
     * `00000010`, seventh bit.
     */
    this.follower = follower;

    /**
     * Adds an additional skillset; enables ally coordination.
     *
     * `00000001`, eighth bit.
     */
    this.leader = leader;
  };

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler)
  {
    // all follower actions are decided based on the leader's ai.
    const {smart, executor, defensive, healer} = this;
    const basicAttackId = followerBattler.getEnemyBasicAttack()[0];
    let skillsToUse = followerBattler.getSkillIdsFromEnemy();
    if (skillsToUse.length)
    {
      const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();
      if (healer || defensive)
      {
        // get nearby allies with the leader's modified sight range of both battlers.
        const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);

        // prioritize healing when self or allies are low on hp.
        if (healer)
        {
          skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
        }

        // find skill that has the most buffs on it.
        if (defensive)
        {
          skillsToUse = this.filterSkillsDefensivePriority(skillsToUse, allies);
        }
      }
      else if (smart || executor)
      {
        // focus on the leader's target instead of the follower's target.
        skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);
      }
    }
    else
    {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackId;
    }

    let chosenSkillId = Array.isArray(skillsToUse)
      ? skillsToUse[0]
      : skillsToUse;
    const followerGameBattler = followerBattler.getBattler();
    const canPayChosenSkillCosts = followerGameBattler.canPaySkillCost($dataSkills[chosenSkillId]);
    if (!canPayChosenSkillCosts)
    {
      // if they can't pay the cost of the decided skill, check the basic attack.
      chosenSkillId = basicAttackId;
    }

    return chosenSkillId;
  };

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse)
  {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return skillsToUse;

    const {healer, defensive} = this;
    const allies = $gameMap.getAllyBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (healer)
    {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // find skill that has the most buffs on it.
    if (defensive)
    {
      skillsToUse = this.filterSkillsDefensivePriority(user, skillsToUse, allies);
    }

    // if we ended up not picking a skill, then clear any ally targeting.
    if (!skillsToUse.length)
    {
      user.setAllyTarget(null);
    }

    return skillsToUse;
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse)
  {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return skillsToUse;

    const {smart, executor} = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (smart)
    {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }

    // find most elementally effective skill vs the target.
    if (executor)
    {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, target);
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will purge all elementally ineffective skills from the collection.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  filterElementallyIneffectiveSkills(skillsToUse, target)
  {
    if (skillsToUse.length > 1)
    {
      skillsToUse = skillsToUse.filter(skillId =>
      {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        return rate >= 1
      });
    }

    return skillsToUse;
  };

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler} target The battler to decide the action about.
   * @param {number[]} skillsToUse The available skills to use.
   */
  findMostElementallyEffectiveSkill(skillsToUse, target)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1)
    {
      let elementalSkillCollection = [];
      skillsToUse.forEach(skillId =>
      {
        const testAction = new Game_Action(target.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) =>
      {
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  };

  /**
   * Filters skills by a defensive priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies
   * @returns
   */
  filterSkillsDefensivePriority(user, skillsToUse, allies)
  {
    return skillsToUse;
  };

  /**
   * Filters skills by a healing priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies
   * @returns
   */
  filterSkillsHealerPriority(user, skillsToUse, allies)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const {basic, smart, defensive, reckless} = this;
    if (!basic && !smart && !defensive && !reckless) return skillsToUse;

    let mostWoundedAlly = null;
    let lowestHpRatio = 1.01;
    let actualHpDifference = 0;
    let alliesBelow66 = 0;
    let alliesMissingAnyHp = 0;

    // iterate over allies to determine the ally with the lowest hp%
    allies.forEach(ally =>
    {
      const battler = ally.getBattler();
      const hpRatio = battler.hp / battler.mhp;

      // if it is lower than the last-tracked-lowest, then update the lowest.
      if (lowestHpRatio > hpRatio)
      {
        lowestHpRatio = hpRatio;
        mostWoundedAlly = ally;
        actualHpDifference = battler.mhp - battler.hp;

        // count all allies below the "heal all" threshold.
        if (hpRatio <= 0.66)
        {
          alliesBelow66++;
        }
      }

      // count all allies missing any amount of hp.
      if (hpRatio < 1)
      {
        alliesMissingAnyHp++;
      }
    });

    // if there are no allies that are missing hp, then just return... unless we're reckless 🌚.
    if (!alliesMissingAnyHp && !reckless) return skillsToUse;

    user.setAllyTarget(mostWoundedAlly);
    const mostWoundedAllyBattler = mostWoundedAlly.getBattler();

    // filter out the skills that aren't for allies.
    const healingTypeSkills = skillsToUse.filter(skillId =>
    {
      const testAction = new Game_Action(user.getBattler());
      testAction.setSkill(skillId);
      return (testAction.isForAliveFriend() &&  // must target living allies.
        testAction.isRecover() &&               // must recover something.
        testAction.isHpEffect());               // must affect hp.
    });

    // if we have 0 or 1 skills left after healing, just return that.
    if (healingTypeSkills.length < 2)
    {
      return healingTypeSkills;
    }

    // determine the best skill based on AI traits.
    let bestSkillId = null;
    let runningBiggestHealAll = 0;
    let runningBiggestHealOne = 0;
    let runningClosestFitHealAll = 0;
    let runningClosestFitHealOne = 0;
    let runningBiggestHeal = 0;
    let biggestHealSkill = null;
    let biggestHealAllSkill = null;
    let biggestHealOneSkill = null;
    let closestFitHealAllSkill = null;
    let closestFitHealOneSkill = null;
    let firstSkill = false;
    healingTypeSkills.forEach(skillId =>
    {
      const skill = $dataSkills[skillId];
      const testAction = new Game_Action(user.getBattler());
      testAction.setItemObject(skill);
      const healAmount = testAction.makeDamageValue(mostWoundedAllyBattler, false);
      if (Math.abs(runningBiggestHeal) < Math.abs(healAmount))
      {
        biggestHealSkill = skillId;
        runningBiggestHeal = healAmount;
      }

      // if this is our first skill in the possible heal skills available, write to all skills.
      if (!firstSkill)
      {
        biggestHealAllSkill = skillId;
        runningBiggestHealAll = healAmount;
        closestFitHealAllSkill = skillId;
        runningClosestFitHealAll = healAmount;
        biggestHealOneSkill = skillId;
        runningBiggestHealOne = healAmount;
        closestFitHealOneSkill = skillId;
        runningClosestFitHealOne = healAmount;
        firstSkill = true;
      }

      // analyze the heal all skills for biggest and closest fits.
      if (testAction.isForAll())
      {
        // if this heal amount is bigger than the running biggest heal-all amount, then update.
        if (runningBiggestHealAll < healAmount)
        {
          biggestHealAllSkill = skillId;
          runningBiggestHealAll = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-all amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealAll - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealAllSkill = skillId;
          runningClosestFitHealAll = healAmount;
        }
      }

      // analyze the heal one skills for biggest and closest fits.
      if (testAction.isForOne())
      {
        // if this heal amount is bigger than the running biggest heal-one amount, then update.
        if (runningBiggestHealOne < healAmount)
        {
          biggestHealOneSkill = skillId;
          runningBiggestHealOne = healAmount;
        }

        // if this difference is smaller than the running closest fit heal-one amount, then update.
        const runningDifference = Math.abs(runningClosestFitHealOne - actualHpDifference);
        const thisDifference = Math.abs(healAmount - actualHpDifference);
        if (thisDifference < runningDifference)
        {
          closestFitHealOneSkill = skillId;
          runningClosestFitHealOne = healAmount;
        }
      }
    });

    // basic will just pick a random one from the four skill options.
    // basic will get overwritten if there are additional ai traits.
    if (basic)
    {
      const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
      bestSkillId = skillOptions[Math.randomInt(skillOptions.length)];
    }

    // smart will decide in this order:
    if (smart)
    {
      // - if any below 40%, then prioritize heal-one of most wounded.
      if (lowestHpRatio <= 0.40)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;

        // - if none below 40% but multiple wounded, prioritize closest-fit heal-all.
      }
      else if (alliesMissingAnyHp > 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealAllSkill : closestFitHealAllSkill;

        // - if only one wounded, then heal them.
      }
      else if (alliesMissingAnyHp === 1 && lowestHpRatio < 0.80)
      {
        bestSkillId = defensive ? biggestHealOneSkill : closestFitHealOneSkill;
        // - if none wounded, or none below 80%, then don't heal.
      }
      else
      {
      }
    }

    // defensive will decide in this order:
    if (defensive && !smart)
    {
      // - if there is only one wounded ally, prioritize biggest heal-one skill.
      if (alliesMissingAnyHp === 1)
      {
        bestSkillId = biggestHealOneSkill;
        // - if there is more than one wounded ally, prioritize biggest heal-all skill.
      }
      else if (alliesMissingAnyHp > 1)
      {
        bestSkillId = biggestHealAllSkill;
        // - if none wounded, don't heal.
      }
      else
      {
      }
    }

    // reckless will decide in this order:
    if (reckless)
    {
      // - if there are any wounded allies, always use biggest heal skill, for one or all.
      if (alliesMissingAnyHp > 0)
      {
        bestSkillId = biggestHealSkill;
        // - if none wounded, don't heal.
      }
      else
      {
      }
    }

    return bestSkillId;
  };
}
//#endregion JABS_BattlerAI

//#region JABS_BattlerCoreData
/**
 * A class containing all the data extracted from the comments of an event's
 * comments and contained with friendly methods to access and manipulate.
 */
function JABS_BattlerCoreData()
{
  this.initialize(...arguments);
}

JABS_BattlerCoreData.prototype = {};
JABS_BattlerCoreData.prototype.constructor = JABS_BattlerCoreData;

/**
 * Initializes this battler data object.
 * @param {number} battlerId This enemy id.
 * @param {number} teamId This battler's team id.
 * @param {JABS_BattlerAI} battlerAI This battler's converted AI.
 * @param {number} sightRange The sight range.
 * @param {number} alertedSightBoost The boost to sight range while alerted.
 * @param {number} pursuitRange The pursuit range.
 * @param {number} alertedPursuitBoost The boost to pursuit range while alerted.
 * @param {number} alertDuration The duration in frames of how long to remain alerted.
 * @param {boolean} canIdle Whether or not this battler can idle.
 * @param {boolean} showHpBar Whether or not to show the hp bar.
 * @param {boolean} showBattlerName Whether or not to show the battler's name.
 * @param {boolean} isInvincible Whether or not this battler is invincible.
 * @param {boolean} isInanimate Whether or not this battler is inanimate.
 */
JABS_BattlerCoreData.prototype.initialize = function({
  battlerId,
  teamId,
  battlerAI,
  sightRange,
  alertedSightBoost,
  pursuitRange,
  alertedPursuitBoost,
  alertDuration,
  canIdle,
  showHpBar,
  showBattlerName,
  isInvincible,
  isInanimate
})
{
  /**
   * The id of the enemy that this battler represents.
   * @type {number}
   */
  this._battlerId = battlerId;

  /**
   * The id of the team this battler belongs to.
   * @type {number}
   */
  this._teamId = teamId;

  /**
   * The converted-from-binary AI of this battler.
   * @type {JABS_BattlerAI}
   */
  this._battlerAI = battlerAI;

  /**
   * The base range that this enemy can and engage targets within.
   * @type {number}
   */
  this._sightRange = sightRange;

  /**
   * The boost to sight range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedSightBoost = alertedSightBoost;

  /**
   * The base range that this enemy will pursue it's engaged target.
   * @type {number}
   */
  this._pursuitRange = pursuitRange;

  /**
   * The boost to pursuit range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = alertedPursuitBoost;

  /**
   * The duration in frames that this enemy will remain alerted.
   * @type {number}
   */
  this._alertDuration = alertDuration;

  /**
   * Whether or not this battler will move around while idle.
   * @type {boolean} True if the battler can move while idle, false otherwise.
   */
  this._canIdle = canIdle;

  /**
   * Whether or not this battler's hp bar will be visible.
   * @type {boolean} True if the battler's hp bar should show, false otherwise.
   */
  this._showHpBar = showHpBar;

  /**
   * Whether or not this battler's name will be visible.
   * @type {boolean} True if the battler's name should show, false otherwise.
   */
  this._showBattlerName = showBattlerName;

  /**
   * Whether or not this battler is invincible.
   *
   * Invincible is defined as: `actions will not collide with this battler`.
   * @type {boolean} True if the battler is invincible, false otherwise.
   */
  this._isInvincible = isInvincible;

  /**
   * Whether or not this battler is inanimate. Inanimate battlers have a few
   * unique traits, those being: cannot idle, hp bar is hidden, cannot be alerted,
   * does not play deathcry when defeated, and cannot engage in battle.
   * @type {boolean} True if the battler is inanimate, false otherwise.
   */
  this._isInanimate = isInanimate;

  this.initMembers()
};

/**
 * Initializes all properties of this class.
 * This is effectively a hook for adding extra properties into this object.
 */
JABS_BattlerCoreData.prototype.initMembers = function() { };

/**
 * Gets this battler's enemy id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.battlerId = function()
{
  return this._battlerId;
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.team = function()
{
  return this._teamId;
};

/**
 * Gets this battler's AI.
 * @returns {JABS_BattlerAI}
 */
JABS_BattlerCoreData.prototype.ai = function()
{
  return this._battlerAI;
};

/**
 * Gets the base range that this enemy can engage targets within.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.sightRange = function()
{
  return this._sightRange;
};

/**
 * Gets the boost to sight range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedSightBoost = function()
{
  return this._alertedSightBoost;
};

/**
 * Gets the base range that this enemy will pursue it's engaged target.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.pursuitRange = function()
{
  return this._pursuitRange;
};

/**
 * Gets the boost to pursuit range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedPursuitBoost = function()
{
  return this._alertedPursuitBoost;
};

/**
 * Gets the duration in frames for how long this battler remains alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertDuration = function()
{
  return this._alertDuration;
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.canIdle = function()
{
  return this._canIdle;
};

/**
 * Gets whether or not this battler's hp bar will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showHpBar = function()
{
  return this._showHpBar;
};

/**
 * Gets whether or not this battler's name will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showBattlerName = function()
{
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is `invincible`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInvincible = function()
{
  return this._isInvincible;
};

/**
 * Gets whether or not this battler is `inanimate`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInanimate = function()
{
  return this._isInanimate;
};
//#endregion JABS_BattlerCoreData

//#region JABS_CoreDataBuilder
/**
 * A builder class for constructing `JABS_BattlerCoreData`.
 */
class JABS_CoreDataBuilder
{
  //#region properties
  /**
   * The battler's id, such as the actor id or enemy id.
   * @type {number}
   * @private
   */
  #battlerId = 0;

  /**
   * The team id that this battler belongs to.
   * @type {number}
   * @private
   */
  #teamId = JABS_Battler.enemyTeamId();

  /**
   * The AI of this battler.
   * @type {string}
   * @private
   */
  #battlerAi = "11000000";

  /**
   * The sight range of this battler.
   * @type {number}
   * @private
   */
  #sightRange = J.ABS.Metadata.DefaultEnemySightRange;

  /**
   * The alerted sight boost of this battler.
   * @type {number}
   * @private
   */
  #alertedSightBoost = J.ABS.Metadata.DefaultEnemyAlertedSightBoost;

  /**
   * The pursuit range of this battler.
   * @type {number}
   * @private
   */
  #pursuitRange = J.ABS.Metadata.DefaultEnemyPursuitRange;

  /**
   * The alerted pursuit boost of this battler.
   * @type {number}
   * @private
   */
  #alertedPursuitBoost = J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;

  /**
   * The duration this battler remains alerted.
   * @type {number}
   * @private
   */
  #alertDuration = J.ABS.Metadata.DefaultEnemyAlertDuration;

  /**
   * Whether or not this battler is allowed to idle about.
   * @type {boolean}
   * @private
   */
  #canIdle = J.ABS.Metadata.DefaultEnemyCanIdle;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showHpBar = J.ABS.Metadata.DefaultEnemyShowHpBar;

  /**
   * Whether or not this battler has a visible hp bar.
   * @type {boolean}
   * @private
   */
  #showDangerIndicator = J.DANGER ? J.DANGER.Metadata.DefaultEnemyShowDangerIndicator : false;

  /**
   * Whether or not this battler's name is visible.
   * @type {boolean}
   * @private
   */
  #showBattlerName = J.ABS.Metadata.DefaultEnemyShowBattlerName;

  /**
   * Whether or not this battler is invincible.
   * @type {boolean}
   * @private
   */
  #isInvincible = J.ABS.Metadata.DefaultEnemyIsInvincible;

  /**
   * Whether or not this battler is inanimate.
   * @type {boolean}
   * @private
   */
  #isInanimate = J.ABS.Metadata.DefaultEnemyIsInanimate;
  //#endregion properties

  /**
   * Constructor.
   * @param {number} battlerId The id of the battler from the database.
   */
  constructor(battlerId)
  {
    this.setBattlerId(battlerId);
  };

  /**
   * Builds the core data with the current set of parameters.
   * @returns {JABS_BattlerCoreData}
   */
  build()
  {
    const core = new JABS_BattlerCoreData({
      // configure core battler data.
      battlerId: this.#battlerId,
      teamId: this.#teamId,
      battlerAI: this.#battlerAi,

      // configure sight and alert battler data.
      sightRange: this.#sightRange,
      alertedSightBoost: this.#alertedSightBoost,
      pursuitRange: this.#pursuitRange,
      alertedPursuitBoost: this.#alertedPursuitBoost,
      alertDuration: this.#alertDuration,

      // configure on-the-map settings.
      canIdle: this.#canIdle,
      showHpBar: this.#showHpBar,
      showBattlerName: this.#showBattlerName,
      isInvincible: this.#isInvincible,
      isInanimate: this.#isInanimate
    });

    // if using danger indicators, then set that, too.
    if (J.DANGER)
    {
      core.setDangerIndicator(this.#showDangerIndicator);
    }

    return core;
  };

  //#region setters
  /**
   * Sets all properties based on this battler's own data except id.
   * @param {Game_Battler} battler
   * @returns {this} This builder for fluent-building.
   */
  setBattler(battler)
  {
    this.#battlerId = battler.battlerId();
    this.#teamId = battler.teamId();
    this.#battlerAi = battler.ai();

    this.#sightRange = battler.sightRange();
    this.#alertedSightBoost = battler.alertedSightBoost();
    this.#pursuitRange = battler.pursuitRange();
    this.#alertedPursuitBoost = battler.alertedPursuitBoost();
    this.#alertDuration = battler.alertDuration();

    this.#canIdle = battler.canIdle();
    this.#showHpBar = battler.showHpBar();
    this.#showDangerIndicator = battler.showDangerIndicator();
    this.#showBattlerName = battler.showBattlerName();
    this.#isInvincible = battler.isInvincible();
    this.#isInanimate = battler.isInanimate();

    return this;
  };

  /**
   * Sets all properties based on the assumption that this is for the player.
   * Effectively, all ranges are set to 0, and all booleans are set to false.
   * @returns {this} This builder for fluent-building.
   */
  isPlayer()
  {
    this.#teamId = JABS_Battler.allyTeamId();

    this.#sightRange = 0;
    this.#alertedSightBoost = 0;
    this.#pursuitRange = 0;
    this.#alertedPursuitBoost = 0;
    this.#alertDuration = 0;

    this.#canIdle = false;
    this.#showHpBar = false;
    this.#showBattlerName = false;
    this.#isInvincible = false;
    this.#isInanimate = false;

    return this;
  };

  /**
   * Sets the battler id of this core data.
   * @param {number} battlerId The id of the battler from the database.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerId(battlerId)
  {
    this.#battlerId = battlerId;
    return this;
  };

  /**
   * Sets the team id of this core data.
   * @param {number} teamId The id of the team this battler belongs to.
   * @returns {this} This builder for fluent-building.
   */
  setTeamId(teamId)
  {
    this.#teamId = teamId;
    return this;
  };

  /**
   * Sets the AI of this core data.
   * @param {string} battlerAi The AI of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerAi(battlerAi)
  {
    this.#battlerAi = battlerAi;
    return this;
  };

  /**
   * Sets the sight range of this core data.
   * @param {number} sightRange The sight range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setSightRange(sightRange)
  {
    this.#sightRange = sightRange;
    return this;
  };

  /**
   * Sets the alerted sight boost of this core data.
   * @param {number} alertedSightBoost The alerted sight boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedSightBoost(alertedSightBoost)
  {
    this.#alertedSightBoost = alertedSightBoost;
    return this;
  };

  /**
   * Sets the pursuit range of this core data.
   * @param {number} pursuitRange The pursuit range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setPursuitRange(pursuitRange)
  {
    this.#pursuitRange = pursuitRange;
    return this;
  };

  /**
   * Sets the alerted pursuit boost of this core data.
   * @param {number} alertedPursuitBoost The alerted pursuit boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedPursuitBoost(alertedPursuitBoost)
  {
    this.#alertedPursuitBoost = alertedPursuitBoost;
    return this;
  };

  /**
   * Sets the alerted duration of this core data.
   * @param {number} alertDuration The duration of which this battler remains alerted.
   * @returns {this} This builder for fluent-building.
   */
  setAlertDuration(alertDuration)
  {
    this.#alertDuration = alertDuration;
    return this;
  };

  /**
   * Sets whether or not this battler can idle while not in combat.
   * @param {boolean} canIdle Whether or not this battler can idle about.
   * @returns {this} This builder for fluent-building.
   */
  setCanIdle(canIdle)
  {
    this.#canIdle = canIdle;
    return this;
  };

  /**
   * Sets whether or not this battler's hp bar is visible.
   * @param {boolean} showHpBar Whether or not the hp bar is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowHpBar(showHpBar)
  {
    this.#showHpBar = showHpBar;
    return this;
  };

  /**
   * Sets whether or not this battler's danger indicator is visible.
   * @param {boolean} showDangerIndicator Whether or not the danger indicator is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowDangerIndicator(showDangerIndicator)
  {
    this.#showDangerIndicator = showDangerIndicator;
    return this;
  };

  /**
   * Sets whether or not this battler's name is visible.
   * @param {boolean} showBattlerName Whether or not the battler name is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowBattlerName(showBattlerName)
  {
    this.#showBattlerName = showBattlerName;
    return this;
  };

  /**
   * Sets whether or not this battler is invincible.
   * @param {boolean} isInvincible Whether or not the battler is invincible.
   * @returns {this} This builder for fluent-building.
   */
  setIsInvincible(isInvincible)
  {
    this.#isInvincible = isInvincible;
    return this;
  };

  /**
   * Sets whether or not this battler is inanimate.
   * @param {boolean} isInanimate Whether or not the battler is inanimate.
   * @returns {this} This builder for fluent-building.
   */
  setIsInanimate(isInanimate)
  {
    this.#isInanimate = isInanimate;
    return this;
  };
  //#endregion setters
}
//#endregion JABS_CoreDataBuilder

//#region JABS_Cooldown
/**
 * A class representing a skill or item's cooldown data.
 */
class JABS_Cooldown
{
  //#region initialize
  /**
   * @constructor
   * @param {string} key The key identifying this cooldown.
   */
  constructor(key)
  {
    this.key = key;
    this.initMembers();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    this.frames = 0;
    this.ready = false;
    this.comboFrames = 0;
    this.comboReady = false;
    this.comboNextActionId = 0;
    this.locked = false;
  };

  //#endregion initialize

  /**
   * Gets whether or not if either of the components of the cooldown are ready.
   * @returns {boolean}
   */
  isAnyReady()
  {
    return this.ready || this.comboReady;
  };

  /**
   * Manages the update cycle for this cooldown.
   */
  update()
  {
    // don't update the cooldown for this skill while locked.
    if (this.isLocked())
    {
      return;
    }

    this.updateBaseCooldown();
    this.updateComboCooldown();
  };

  //#region base cooldown
  /**
   * Updates the base skill data for this cooldown.
   */
  updateBaseCooldown()
  {
    if (this.ready)
    {
      return;
    }

    if (this.frames > 0)
    {
      this.tickBase()
      return;
    }

    if (this.frames <= 0)
    {
      this.resetCombo();
      this.enableBase();
    }
  };

  /**
   * Decrements the base cooldown gauge 1 frame at a time.
   */
  tickBase()
  {
    this.frames--;
  };

  /**
   * Enables the flag to indicate the base skill is ready for this cooldown.
   */
  enableBase()
  {
    this.ready = true;
    this.frames = 0;
  };

  /**
   * Gets whether or not the base skill is off cooldown.
   * @returns {boolean}
   */
  isBaseReady()
  {
    return this.ready;
  };

  /**
   * Sets a new value for the base cooldown to countdown from.
   * @param {number} frames The value to countdown from.
   */
  setFrames(frames)
  {
    this.frames = frames;
    if (this.frames <= 0)
    {
      this.ready = true;
      this.frames = 0;
    }

    if (this.frames > 0)
    {
      this.ready = false;
    }
  };

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modBaseFrames(frames)
  {
    this.frames += frames;
    if (this.frames <= 0)
    {
      this.ready = true;
      this.frames = 0;
    }

    if (this.frames > 0)
    {
      this.ready = false;
    }
  };

  //#endregion base cooldown

  //#region combo cooldown
  /**
   * Updates the combo data for this cooldown.
   */
  updateComboCooldown()
  {
    if (this.comboReady)
    {
      return;
    }

    if (this.comboFrames > 0)
    {
      this.tickCombo();
      return;
    }

    if (this.comboFrames <= 0)
    {
      this.enableCombo();
    }
  };

  /**
   * Decrements the combo gauge 1 frame at a time.
   */
  tickCombo()
  {
    this.comboFrames--;
  };

  /**
   * Enables the flag to indicate a combo is ready for this cooldown.
   */
  enableCombo()
  {
    this.comboFrames = 0;
    if (this.comboNextActionId)
    {
      this.comboReady = true;
    }
  };

  /**
   * Sets the combo frames to countdown from this value.
   * @param {number} frames The value to countdown from.
   */
  setComboFrames(frames)
  {
    this.comboFrames = frames;
    if (this.comboFrames <= 0)
    {
      this.comboReady = true;
      this.comboFrames = 0;
    }

    if (this.comboFrames > 0)
    {
      this.comboReady = false;
    }
  };

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modComboFrames(frames)
  {
    this.comboFrames += frames;
    if (this.comboFrames <= 0)
    {
      this.comboReady = true;
      this.comboFrames = 0;
    }

    if (this.comboFrames > 0)
    {
      this.comboReady = false;
    }
  };

  /**
   * Resets the combo data associated with this cooldown.
   */
  resetCombo()
  {
    this.comboFrames = 0;
    this.comboNextActionId = 0;
    this.comboReady = false;
  };

  /**
   * Gets whether or not the combo cooldown is ready.
   * @returns {boolean}
   */
  isComboReady()
  {
    return this.comboReady;
  }

  //#endregion combo cooldown

  //#region locking
  /**
   * Gets whether or not this cooldown is locked.
   * @returns {boolean}
   */
  isLocked()
  {
    return this.locked;
  };

  /**
   * Locks this cooldown to prevent it from cooling down.
   */
  lock()
  {
    this.locked = true;
  }

  /**
   * Unlocks this cooldown to allow it to finish cooling down.
   */
  unlock()
  {
    this.locked = false;
  };

  //#endregion locking
}
//#endregion JABS_Cooldown

//#region JABS_EquipmentData
/**
 * A class that contains all custom data for JABS equipment.
 *
 * This class was created because equipment does not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_EquipmentData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.skillId = this.skillId();
    this.speedBoost = this.speedBoost();
    this.bonusHits = this.getBonusHits();
  }

  /**
   * Gets the skill id associated with this piece of equipment.
   * @returns {number} The skill id.
   */
  skillId()
  {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId])
    {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    }
    else
    {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          skillId = parseInt(RegExp.$1);
        }
      });
    }

    return skillId;
  };

  /**
   * Gets the speed boost value associated with this piece of equipment.
   * @returns {number} The speed boost value.
   */
  speedBoost()
  {
    let speedBoost = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SpeedBoost])
    {
      speedBoost = parseInt(this._meta[J.BASE.Notetags.SpeedBoost]) || 0;
    }
    else
    {
      const structure = /<speedBoost:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          speedBoost = parseInt(RegExp.$1);
        }
      });
    }

    return speedBoost;
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  getBonusHits()
  {
    let bonusHits = 0;
    if (this._meta && this._meta[J.BASE.Notetags.BonusHits])
    {
      bonusHits = parseInt(this._meta[J.BASE.Notetags.BonusHits]);
    }
    else
    {
      const structure = /<bonusHits:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          bonusHits = parseInt(RegExp.$1);
        }
      });
    }

    return bonusHits;
  };
}
//#endregion JABS_EquipmentData

//#region JABS_GuardData
/**
 * A class responsible for managing the data revolving around guarding and parrying.
 */
class JABS_GuardData
{
  /**
   * @constructor
   * @param {number} skillId The skill this guard data is associated with.
   * @param {number} flatGuardReduction The flat amount of damage reduced when guarding, if any.
   * @param {number} percGuardReduction The percent amount of damage mitigated when guarding, if any.
   * @param {number} counterGuardId The skill id to counter with when guarding, if any.
   * @param {number} counterParryId The skill id to counter with when precise-parrying, if any.
   * @param {number} parryDuration The duration of which a precise-parry is available, if any.
   */
  constructor(
    skillId,
    flatGuardReduction,
    percGuardReduction,
    counterGuardId,
    counterParryId,
    parryDuration)
  {
    /**
     * The skill this guard data is associated with.
     * @type {number}
     */
    this.skillId = skillId;

    /**
     * The flat amount of damage reduced when guarding, if any.
     * @type {number}
     */
    this.flatGuardReduction = flatGuardReduction;

    /**
     * The percent amount of damage mitigated when guarding, if any.
     * @type {number}
     */
    this.percGuardReduction = percGuardReduction;

    /**
     * The skill id to counter with when guarding, if any.
     * @type {number}
     */
    this.counterGuardId = counterGuardId;

    /**
     * The skill id to counter with when precise-parrying, if any.
     * @type {number}
     */
    this.counterParryId = counterParryId;

    /**
     * The duration of which a precise-parry is available, if any.
     * @type {number}
     */
    this.parryDuration = parryDuration;
  };

  /**
   * Gets whether or not this guard data includes the ability to guard at all.
   * @returns {boolean}
   */
  canGuard()
  {
    return !!(this.flatGuardReduction || this.percGuardReduction);
  };

  /**
   * Gets whether or not this guard data includes the ability to precise-parry.
   * @returns {boolean}
   */
  canParry()
  {
    return this.parryDuration > 0;
  };

  /**
   * Gets whether or not this guard data enables countering of any kind.
   * @returns {boolean}
   */
  canCounter()
  {
    return !!(this.counterGuardId || this.counterParryId);
  };
}
//#endregion JABS_GuardData

//#region JABS_ItemData
/**
 * A class that contains all custom data for JABS items.
 *
 * This class was created because items do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_ItemData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
  };

  /**
   * Gets the skill id associated with this item/tool.
   * @returns {number} The skill id, or `0` if none is present.
   */
  get skillId()
  {
    let skillId = 0;
    if (this._meta && this._meta[J.BASE.Notetags.SkillId])
    {
      skillId = parseInt(this._meta[J.BASE.Notetags.SkillId]) || 0;
    }
    else
    {
      const structure = /<skillId:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          skillId = parseInt(RegExp.$1);
        }
      })
    }

    return skillId;
  };

  /**
   * Gets the cooldown for this item.
   * @returns {number} The cooldown in frames (default = 0).
   */
  get cooldown()
  {
    let cooldown = 0;
    if (this._meta && this._meta[J.BASE.Notetags.Cooldown])
    {
      cooldown = parseInt(this._meta[J.BASE.Notetags.Cooldown]);
    }
    else
    {
      const structure = /<cooldown:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          cooldown = parseInt(RegExp.$1);
        }
      });
    }

    return cooldown;
  };

  /**
   * Gets whether or not this item will be used instantly on-pickup.
   * @returns {boolean} True if this is an instant-use item, false otherwise.
   */
  get useOnPickup()
  {
    let useOnPickup = false;
    if (this._meta && this._meta[J.BASE.Notetags.UseOnPickup])
    {
      useOnPickup = true;
    }
    else
    {
      const structure = /<useOnPickup>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          useOnPickup = true;
        }
      });
    }

    return useOnPickup;
  };

  /**
   * Gets the duration in frames of how long this loot will persist on the map.
   * If none is specified, the default will be used.
   * @returns {number}
   */
  get expires()
  {
    let expires = 0;
    if (this._meta && this._meta[J.BASE.Notetags.LootExpiration])
    {
      expires = parseInt(this._meta[J.BASE.Notetags.LootExpiration]);
    }
    else
    {
      const structure = /<expires:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          expires = parseInt(RegExp.$1);
        }
      });
    }

    return expires;
  };
}
//#endregion JABS_ItemData

//#region JABS_LootDrop
/**
 * An object that represents the binding of a `Game_Event` to an item/weapon/armor.
 */
class JABS_LootDrop
{
  constructor(object)
  {
    this._lootObject = object;
    this.initMembers();
  };

  /**
   * Initializes properties of this object that don't require parameters.
   */
  initMembers()
  {
    /**
     * The duration that this loot drop will exist on the map.
     * @type {number}
     */
    this._duration = 900;

    /**
     * Whether or not this loot drop can expire.
     * @type {boolean}
     */
    this._canExpire = true;

    /**
     * The universally unique identifier for this loot drop.
     * @type {string}
     */
    this._uuid = J.BASE.Helpers.generateUuid();
  };

  /**
   * Gets the `uuid` of this loot drop.
   * @returns {string}
   */
  get uuid()
  {
    return this._uuid;
  };

  /**
   * Sets the `uuid` to the new value.
   * This overwrites the default-generated `uuid`.
   * @param {string} newUuid The new `uuid`.
   */
  set uuid(newUuid)
  {
    this._uuid = newUuid;
  };

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration()
  {
    return this._duration;
  };

  /**
   * Sets the duration for this loot drop.
   */
  set duration(newDuration)
  {
    if (newDuration === -1)
    {
      this._canExpire = false;
    }

    this._duration = newDuration;
  };

  /**
   * Whether or not this loot drop's duration is expired.
   * If the loot cannot expire, this will always return false, regardless of duration.
   * @returns {boolean}
   */
  get expired()
  {
    if (!this._canExpire) return false;

    return this._duration <= 0;
  };

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration()
  {
    if (!this._canExpire || this._duration <= 0) return;

    this._duration--;
  };

  /**
   * Gets the underlying loot object.
   * @returns {rm.types.BaseItem}
   */
  get lootData()
  {
    return this._lootObject;
  };

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon()
  {
    return this._lootObject.iconIndex;
  };

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup()
  {
    return this._lootObject._j.useOnPickup;
  };
}
//#endregion JABS_LootDrop

//#region JABS_SkillChance
/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_SkillChance
{
  constructor(skillId, chance, key)
  {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {rm.types.Skill}
   */
  baseSkill()
  {
    return $dataSkills[this.skillId];
  };

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget()
  {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  };

  /**
   * Rolls for whether or not this skill should proc.
   * @returns {boolean}
   */
  shouldTrigger()
  {
    const chance = Math.randomInt(100) + 1;
    return chance <= this.chance;
  };
}
//#endregion JABS_SkillChance

//#region JABS_SkillData
/**
 * A class that contains all custom feature flags for JABS skills.
 *
 * This class was created because skills do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
function JABS_SkillData()
{
  this.initialize(...arguments);
}

JABS_SkillData.prototype = {};
JABS_SkillData.prototype.constructor = JABS_SkillData;

/**
 * @constructor
 * @param {string} notes The raw note box as a string.
 * @param {any} meta The `meta` object containing prebuilt note metadata.
 */
JABS_SkillData.prototype.initialize = function(notes, meta)
{
  this._notes = notes.split(/[\r\n]+/);
  this._meta = meta;
};

/**
 * OVERWRITE Rewrites the way this object is deserialized when being stringified.
 * @returns {JABS_SkillData}
 */
JABS_SkillData.prototype.toJSON = function()
{
  const jsonObj = Object.assign({}, this);
  const proto = Object.getPrototypeOf(this);
  for (const key of Object.getOwnPropertyNames(proto))
  {
    const desc = Object.getOwnPropertyDescriptor(proto, key);
    const hasGetter = desc && typeof desc.get === 'function';
    if (hasGetter)
    {
      jsonObj[key] = this[key];
    }
  }

  return jsonObj;
};

/**
 * Gets the duration of the delay for this action and whether or not it can be triggered
 * by colliding with it.
 * @returns {{duration: number, touchToTrigger: boolean}}
 */
JABS_SkillData.prototype.delay = function()
{
  let temp = [0, false];
  const structure = /<delay:[ ]?(\[-?\d+,[ ]?(true|false)])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      temp = JSON.parse(RegExp.$1);
    }
  });

  return {duration: parseInt(temp[0]) ?? 0, touchToTrigger: temp[1]};
};

/**
 * Gets the bonus aggro this skill generates.
 * @returns {number}
 */
JABS_SkillData.prototype.bonusAggro = function()
{
  let aggro = 0;
  const structure = /<aggro:[ ]?(-?\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      aggro += parseInt(RegExp.$1);
    }
  })

  return aggro;
};

/**
 * Gets the aggro multiplier that this skill performs.
 * Used for skills specifically that increase/decrease by a percent (or reset).
 * @returns {number}
 */
JABS_SkillData.prototype.aggroMultiplier = function()
{
  let multiplier = 1.0;
  const structure = /<aggroMultiply:[ ]?(\d+[.]?\d+)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      multiplier += parseFloat(RegExp.$1);
    }
  });

  return multiplier;
};

/**
 * Gets whether or not this skill is a direct-targeting skill.
 * @returns {boolean} True if it is a direct-targeting skill, false otherwise.
 */
JABS_SkillData.prototype.direct = function()
{
  let isDirect = false;
  const structure = /<direct>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      isDirect = true;
    }
  });

  return isDirect;
};

/**
 * Gets the number of bonus hits this skill grants.
 * @returns {number} The number of bonus hits.
 */
JABS_SkillData.prototype.getBonusHits = function()
{
  let bonusHits = 0;
  const structure = /<bonusHits:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      bonusHits = parseInt(RegExp.$1);
    }
  });

  return bonusHits;
};

/**
 * Gets the amount of parry to ignore.
 * @type {number} The amount of parry to ignore; will be `-1` if should always ignore.
 */
JABS_SkillData.prototype.ignoreParry = function()
{
  let ignore = 0;
  const structure = /<ignoreParry([:]?[ ]?((\d+)[%])?)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      ignore = !RegExp.$1
        ? -1                    // if parameter left out, then always ignore parry.
        : parseInt(RegExp.$3);  // if parameter exists, use the number.
    }
  });

  return ignore;
};

/**
 * Gets the amount of damage being reduced by guarding.
 * @returns {[number, number]} `[flat, percent]`.
 */
JABS_SkillData.prototype.guard = function()
{
  let guard = [0, false];
  const structure = /<guard:[ ]?(\[-?\d+,[ ]?-?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      guard = JSON.parse(RegExp.$1);
    }
  });

  return guard;
};

/**
 * Gets the number of frames that a precise-guard is available for.
 * @returns {number} The number of frames for precise-guard.
 */
JABS_SkillData.prototype.parry = function()
{
  let parry = 0;
  const structure = /<parry:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      parry = parseInt(RegExp.$1);
    }
  });

  return parry;
};

/**
 * Gets the id of the skill to retaliate with when executing a precise-parry.
 * @returns {number} The skill id.
 */
JABS_SkillData.prototype.counterParry = function()
{
  let id = 0;
  const structure = /<counterParry:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      id = parseInt(RegExp.$1);
    }
  });

  return id;
};

/**
 * Gets the id of the skill to retaliate with when guarding.
 * @returns {number} The skill id.
 */
JABS_SkillData.prototype.counterGuard = function()
{
  let id = 0;
  const structure = /<counterGuard:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      id = parseInt(RegExp.$1);
    }
  });

  return id;
};

/**
 * Gets the animation id to show when executing a skill.
 * @returns {number} The animation id for casting (default = 1)
 */
JABS_SkillData.prototype.casterAnimation = function()
{
  let animationId = 0;
  const structure = /<castAnimation:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      animationId = parseInt(RegExp.$1);
    }
  });

  return animationId;
};

/**
 * Gets the cast time for this skill.
 * @returns {number} The cast time in frames (default = 0).
 */
JABS_SkillData.prototype.castTime = function()
{
  let castTime = -1;
  const structure = /<castTime:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      castTime = parseInt(RegExp.$1);
    }
  });

  return castTime;
};

/**
 * Gets the cooldown for this skill.
 * @returns {number} The cooldown in frames (default = 0).
 */
JABS_SkillData.prototype.cooldown = function()
{
  let cooldown = 0;
  const structure = /<cooldown:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      cooldown = parseInt(RegExp.$1);
    }
  });

  return cooldown;
};

/**
 * Gets the cooldown for this skill when performed by AI.
 * If this is also an actor using the skill, the base cooldown will
 * still be applied to the cooldown slot.
 * @returns {number} The cooldown in frames (default = 0).
 */
JABS_SkillData.prototype.aiCooldown = function()
{
  let aiCooldown = -1;
  const structure = /<aiCooldown:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      aiCooldown = parseInt(RegExp.$1);
    }
  });

  return aiCooldown;
};

/**
 * Gets the range for this skill.
 * @returns {number} The range in tiles/spaces/squares (default = 0).
 */
JABS_SkillData.prototype.range = function()
{
  let range = 0;
  const structure = /<range:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      range = parseInt(RegExp.$1);
    }
  });

  return range;
};

/**
 * Gets the action id for this skill.
 * @returns {number} The action id (default = 1).
 */
JABS_SkillData.prototype.actionId = function()
{
  let actionId = 1;
  const structure = /<actionId:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      actionId = parseInt(RegExp.$1);
    }
  });

  return actionId;
};

/**
 * Gets the duration this skill persists on the map.
 * @returns {number} The duration in frames (default = 60).
 */
JABS_SkillData.prototype.duration = function()
{
  let duration = 0;
  const structure = /<duration:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      duration = parseInt(RegExp.$1);
    }
  });

  return duration;
};

/**
 * Gets the hitbox shape for this skill.
 * @returns {string} The hitbox shape (default = rhombus).
 */
JABS_SkillData.prototype.shape = function()
{
  let shape = 'rhombus';
  const structure = /<shape:[ ]?(rhombus|square|frontsquare|line|arc|wall|cross)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      shape = RegExp.$1.toLowerCase();
    }
  });

  return shape;
};

/**
 * Gets the number of projectiles for this skill.
 * @returns {number}
 */
JABS_SkillData.prototype.projectile = function()
{
  let projectile = 1;
  const structure = /<projectile:[ ]?([12348])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      projectile = parseInt(RegExp.$1);
    }
  });

  return projectile;
};

/**
 * Gets the piercing data for this skill.
 * @returns {[number, number]} The piercing data (default = [1, 0]).
 */
JABS_SkillData.prototype.piercing = function()
{
  let piercing = [1, 0];
  const structure = /<pierce:[ ]?(\[\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      piercing = JSON.parse(RegExp.$1);
    }
  });

  return piercing;
};

/**
 * Gets the combo data for this skill.
 * @returns {[number, number]} The combo data (default = null).
 */
JABS_SkillData.prototype.combo = function()
{
  let combo = null;
  const structure = /<combo:[ ]?(\[\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      combo = JSON.parse(RegExp.$1);
    }
  });

  return combo;
};

/**
 * Gets the free combo boolean for this skill. "Free Combo" skills do not
 * require the hit to land to continue combo-ing.
 * @returns {boolean} True if free combo, false otherwise.
 */
JABS_SkillData.prototype.freeCombo = function()
{
  let freeCombo = false;
  const structure = /<freeCombo>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      freeCombo = true;
    }
  });

  return freeCombo;
};

/**
 * Gets the proximity required for this skill.
 * @returns {number} The proximity.
 */
JABS_SkillData.prototype.proximity = function()
{
  let proximity = 0;
  const structure = /<proximity:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      proximity = parseInt(RegExp.$1);
    }
  });

  return proximity;
};

/**
 * Gets the knockback for this skill. Unlike many other numeric parameters,
 * if there is no knockback, the default is `null` instead of `0` because `0`
 * knockback will still knock up the battler.
 * @returns {number} The knockback (default = null).
 */
JABS_SkillData.prototype.knockback = function()
{
  let knockback = null;
  const structure = /<knockback:[ ]?(\d+)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      knockback = parseInt(RegExp.$1);
    }
  });

  return knockback;
};

/**
 * Gets whether or not this battler is invincible due to this skill.
 * @returns {boolean}
 */
JABS_SkillData.prototype.invincible = function()
{
  let invincible = false;
  const structure = /<invincible>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      invincible = true;
    }
  });

  return invincible;
};

/**
 * Gets the unique cooldown boolean. Unique cooldown means that the skill
 * can be assigned to multiple slots and cooldowns are impacted independently
 * of one another.
 * @returns {boolean} True if this skill is unique, false otherwise.
 */
JABS_SkillData.prototype.uniqueCooldown = function()
{
  let uniqueCooldown = false;
  const structure = /<unique>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      uniqueCooldown = true;
    }
  });

  return uniqueCooldown;
};

/**
 * Gets the type of movement this skill executes (for dodge skills).
 * @returns {string}
 */
JABS_SkillData.prototype.moveType = function()
{
  let moveType = "forward";
  const structure = /<moveType:[ ]?(forward|backward|directional)>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      moveType = RegExp.$1;
    }
  });

  return moveType;
};

/**
 * Gets the action pose data for this skill.
 * @returns {[string, number, number]} The action pose data (default = null).
 */
JABS_SkillData.prototype.poseSuffix = function()
{
  let actionPoseData = null;
  const structure = /<poseSuffix:[ ]?(\["[-_]?\w+",[ ]?\d+,[ ]?\d+])>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      actionPoseData = JSON.parse(RegExp.$1);
    }
  });

  return actionPoseData;
};

/**
 * Gets the animation id to execute on oneself instead of on the target.
 *
 * This doubles as both an indicator, and also retrieves the animation id.
 * @returns {number}
 */
JABS_SkillData.prototype.selfAnimationId = function()
{
  let selfAnimationId = 0;
  const structure = /<animationOnSelf:([ ]?\d+)?>/i;
  this._notes.forEach(note =>
  {
    if (note.match(structure))
    {
      selfAnimationId = parseInt(RegExp.$1);
    }
  });

  return selfAnimationId;
};
//#endregion JABS_SkillData

//#region JABS_SkillSlot
/**
 * This class represents a single skill slot handled by the skill slot manager.
 */
function JABS_SkillSlot()
{
  this.initialize(...arguments);
}

JABS_SkillSlot.prototype = {};
JABS_SkillSlot.prototype.constructor = JABS_SkillSlot;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlot.prototype.initialize = function(key, skillId)
{
  /**
   * The key of this skill slot.
   *
   * Maps 1:1 to one of the possible skill slot button combinations.
   * @type {string}
   */
  this.key = key;

  /**
   * The id of the skill.
   *
   * Set to 0 when a skill is not equipped in this slot.
   * @type {number}
   */
  this.id = skillId;
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlot.prototype.initMembers = function()
{
  /**
   * Whether or not this skill slot is locked.
   *
   * Locked slots cannot be changed until unlocked.
   * @type {boolean}
   */
  this.locked = false;
};

/**
 * Gets whether or not this slot has anything assigned to it.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isUsable = function()
{
  return this.id > 0;
};

/**
 * Gets whether or not this slot is empty.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isEmpty = function()
{
  return this.id === 0;
};

/**
 * Gets whether or not this slot is locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Checks whether or not this is a "primary" slot making up the base functions
 * that this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isPrimarySlot = function()
{
  const slots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND,
    Game_Actor.JABS_TOOLSKILL,
    Game_Actor.JABS_DODGESKILL
  ];

  return slots.includes(this.key);
};

/**
 * Checks whether or not this is a "secondary" slot making up the optional and
 * flexible functions this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSecondarySlot = function()
{
  const slots = [
    Game_Actor.JABS_L1_A_SKILL,
    Game_Actor.JABS_L1_B_SKILL,
    Game_Actor.JABS_L1_X_SKILL,
    Game_Actor.JABS_L1_Y_SKILL,
    Game_Actor.JABS_R1_A_SKILL,
    Game_Actor.JABS_R1_B_SKILL,
    Game_Actor.JABS_R1_X_SKILL,
    Game_Actor.JABS_R1_Y_SKILL
  ];

  return slots.includes(this.key);
};

/**
 * Sets a new skill id to this slot.
 *
 * Slot cannot be assigned if it is locked.
 * @param {number} skillId The new skill id to assign to this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setSkillId = function(skillId)
{
  if (this.isLocked())
  {
    console.warn("This slot is currently locked.");
    SoundManager.playBuzzer();
    return;
  }

  this.id = skillId;
  return this;
};

/**
 * Sets whether or not this slot is locked.
 * @param {boolean} locked Whether or not this slot is locked.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setLock = function(locked)
{
  if (!this.canBeLocked())
  {
    this.locked = locked;
  }

  return this;
};

/**
 * Gets whether or not this slot can be locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeLocked = function()
{
  const lockproofSlots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND
  ];

  return !lockproofSlots.includes(this.key);
};

/**
 * Locks this slot, preventing changing of skill assignment.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.lock = function()
{
  this.setLock(true);
  return this;
};

/**
 * Unlocks this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.unlock = function()
{
  this.setLock(false);
  return this;
};

/**
 * Returns this slot to skill id 0 and unlocks it.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.clear = function()
{
  this.unlock();
  this.setSkillId(0);
  return this;
};

/**
 * Clears this slot in the context of "releasing unequippable skills".
 * Skills that are mainhand/offhand/tool will not be automatically removed.
 * Skills that are locked will not be automatically removed.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.autoclear = function()
{
  if (!this.canBeAutocleared())
  {
    // skip because you can't autoclear these slots.
    return this;
  }
  else
  {
    return this.setSkillId(0);
  }
};

/**
 * Gets whether or not this slot can be autocleared, such as from auto-upgrading
 * a skill or something.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeAutocleared = function()
{
  const noAutoclearSlots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND,
    Game_Actor.JABS_TOOLSKILL
  ];

  return !noAutoclearSlots.includes(this.key);
};
//#endregion JABS_SkillSlot

//#region JABS_SkillSlotManager
/**
 * A class responsible for managing the skill slots on an actor.
 */
function JABS_SkillSlotManager()
{
  this.initialize(...arguments);
}

JABS_SkillSlotManager.prototype = {};
JABS_SkillSlotManager.prototype.constructor = JABS_SkillSlotManager;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlotManager.prototype.initialize = function()
{
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlotManager.prototype.initMembers = function()
{
  /**
   * All skill slots that a player possesses.
   *
   * These are in a fixed order.
   * @type {JABS_SkillSlot[]}
   */
  this._slots = [
    new JABS_SkillSlot("Global", 0),

    new JABS_SkillSlot(Game_Actor.JABS_MAINHAND, 0),
    new JABS_SkillSlot(Game_Actor.JABS_OFFHAND, 0),
    new JABS_SkillSlot(Game_Actor.JABS_TOOLSKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_DODGESKILL, 0),

    new JABS_SkillSlot(Game_Actor.JABS_L1_A_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_B_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_X_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_Y_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_A_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_B_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_X_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_Y_SKILL, 0)
  ];
};

/**
 * Gets all skill slots, regardless of whether or not their are assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSlots = function()
{
  return this._slots;
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllPrimarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isPrimarySlot());
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSecondarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isSecondarySlot());
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getToolSlot = function()
{
  return this.getSkillBySlot(Game_Actor.JABS_TOOLSKILL);
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getDodgeSlot = function()
{
  return this.getSkillBySlot(Game_Actor.JABS_DODGESKILL);
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedSlots = function()
{
  return this.getAllSlots().filter(skillSlot => skillSlot.isUsable());
};

/**
 * Gets all secondary skill slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEmptySecondarySlots = function()
{
  return this.getAllSecondarySlots().filter(skillSlot => skillSlot.isEmpty());
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function()
{
  return this.getEquippedSlots()
    .filter(skillSlot => skillSlot.key !== Game_Actor.JABS_TOOLSKILL);
};

/**
 * Gets a skill slot by its key.
 * @param {string} key The key to find the matching slot for.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSkillBySlot = function(key)
{
  return this.getAllSlots()
    .find(skillSlot => skillSlot.key === key);
};

/**
 * Gets the entire skill slot of the slot containing the skill id.
 * @param {number} skillIdToFind The skill id to find.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSlotBySkillId = function(skillIdToFind)
{
  return this.getEquippedSlots()
    .find(skillSlot => skillSlot.id === skillIdToFind);
};

/**
 * Sets a new skill to a designated slot.
 * @param {string} key The key of the slot to set.
 * @param {number} skillId The id of the skill to assign to the slot.
 * @param {boolean} locked Whether or not the slot should be locked.
 */
JABS_SkillSlotManager.prototype.setSlot = function(key, skillId, locked)
{
  this.getSkillBySlot(key)
    .setSkillId(skillId)
    .setLock(locked);
};

/**
 * Clears and unlocks a skill slot by its key.
 * @param {string} key The key of the slot to clear.
 */
JABS_SkillSlotManager.prototype.clearSlot = function(key)
{
  this.getSkillBySlot(key).clear();
};

/**
 * Unlocks all slots owned by this actor.
 */
JABS_SkillSlotManager.prototype.unlockAllSlots = function(key)
{
  this.getAllSlots().forEach(slot => slot.unlock());
};
//#endregion JABS_SkillSlotManager

//#region JABS_StateData
/**
 * A class that contains all custom data for JABS states.
 *
 * This class was created because states do not inherently have a class to hook into
 * for extensions, like `Game_Actor` or `Game_Map`.
 */
class JABS_StateData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.bonusHits = this.getBonusHits();
  };

  /**
   * Gets the number of bonus hits this skill grants.
   * @returns {number} The number of bonus hits.
   */
  getBonusHits()
  {
    let bonusHits = 0;
    if (this._meta && this._meta[J.BASE.Notetags.BonusHits])
    {
      bonusHits = parseInt(this._meta[J.BASE.Notetags.BonusHits]);
    }
    else
    {
      const structure = /<bonusHits:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          bonusHits = parseInt(RegExp.$1);
        }
      });
    }

    return bonusHits;
  };

  /**
   * Gets whether or not this state is identified as a "negative" state.
   * @returns {boolean}
   */
  get negative()
  {
    let negative = false;
    if (this._meta && this._meta[J.BASE.Notetags.NegativeState])
    {
      negative = true;
    }
    else
    {
      const structure = /<negative>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          negative = true;
        }
      })
    }

    return negative;
  };

  /**
   * Gets whether or not this state locks aggro modification.
   * @returns {boolean}
   */
  get aggroLock()
  {
    let aggroLocked = false;
    if (this._meta && this._meta[J.BASE.Notetags.AggroLock])
    {
      aggroLocked = true;
    }
    else
    {
      const structure = /<aggroLock>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          aggroLocked = true;
        }
      })
    }

    return aggroLocked;
  };

  /**
   * Gets the aggro dealt amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroOutAmp()
  {
    let aggroOutAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroOutAmp])
    {
      aggroOutAmp = parseFloat(this._meta[J.BASE.Notetags.AggroOutAmp]);
    }
    else
    {
      const structure = /<aggroOutAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          aggroOutAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroOutAmp;
  };

  /**
   * Gets the aggro received amp multiplier bonus for this state.
   * @returns {number}
   */
  get aggroInAmp()
  {
    let aggroInAmp = 1.0;
    if (this._meta && this._meta[J.BASE.Notetags.AggroInAmp])
    {
      aggroInAmp = parseFloat(this._meta[J.BASE.Notetags.AggroInAmp]);
    }
    else
    {
      const structure = /<aggroInAmp:[ ]?[+]?([-]?\d+[.]?\d+)?>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          aggroInAmp = parseFloat(RegExp.$1);
        }
      })
    }

    return aggroInAmp;
  };

  /**
   * Gets whether or not this state inflicts JABS paralysis.
   * @returns {boolean} True if it inflicts JABS paralysis, false otherwise.
   */
  get paralyzed()
  {
    let paralyzed = false;
    if (this._meta && this._meta[J.BASE.Notetags.Paralyzed])
    {
      paralyzed = true;
    }
    else
    {
      const structure = /<paralyzed>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          paralyzed = true;
        }
      })
    }

    return paralyzed;
  };

  /**
   * Gets whether or not this state inflicts JABS root.
   * @returns {boolean} True if it inflicts JABS root, false otherwise.
   */
  get rooted()
  {
    let rooted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Rooted])
    {
      rooted = true;
    }
    else
    {
      const structure = /<rooted>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          rooted = true;
        }
      })
    }

    return rooted;
  };

  /**
   * Gets whether or not this state inflicts JABS mute.
   * @returns {boolean} True if it inflicts JABS mute, false otherwise.
   */
  get muted()
  {
    let muted = false;
    if (this._meta && this._meta[J.BASE.Notetags.Muted])
    {
      muted = true;
    }
    else
    {
      const structure = /<muted>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          muted = true;
        }
      })
    }

    return muted;
  };

  /**
   * Gets whether or not this state inflicts JABS disable.
   * @returns {boolean} True if it inflicts JABS disable, false otherwise.
   */
  get disabled()
  {
    let disabled = false;
    if (this._meta && this._meta[J.BASE.Notetags.Disabled])
    {
      disabled = true;
    }
    else
    {
      const structure = /<disabled>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          disabled = true;
        }
      })
    }

    return disabled;
  };

  /**
   * Gets the formula for hp5 of this state.
   *
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipHpFormula()
  {
    let formula = "";
    const structure = /<slip:hp:\[([+\-*\/ ().\w]+)]>/gmi;
    this._notes.forEach(note =>
    {
      if (note.match(structure))
      {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat hp5 for this state.
   * @returns {number} The flat hp5.
   */
  get slipHpFlat()
  {
    let hpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpFlat])
    {
      hpFlat = parseInt(this._meta[J.BASE.Notetags.HpFlat]);
    }
    else
    {
      const structure = /<hpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          hpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return hpFlat;
  };

  /**
   * Gets the percentage hp5 for this state.
   * @returns {number} The percentage hp5.
   */
  get slipHpPerc()
  {
    let hpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.HpPerc])
    {
      hpPerc = parseFloat(this._meta[J.BASE.Notetags.HpPerc]);
    }
    else
    {
      const structure = /<hpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          hpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return hpPerc;
  };

  /**
   * Gets the formula for mp5 of this state.
   *
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipMpFormula()
  {
    let formula = "";
    const structure = /<slip:mp:\[([+\-*\/ ().\w]+)]>/gmi;
    this._notes.forEach(note =>
    {
      if (note.match(structure))
      {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat mp5 for this state.
   * @returns {number} The flat mp5.
   */
  get slipMpFlat()
  {
    let mpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpFlat])
    {
      mpFlat = parseInt(this._meta[J.BASE.Notetags.MpFlat]);
    }
    else
    {
      const structure = /<mpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          mpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return mpFlat;
  };

  /**
   * Gets the percentage mp5 for this state.
   * @returns {number} The percentage mp5.
   */
  get slipMpPerc()
  {
    let mpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MpPerc])
    {
      mpPerc = parseFloat(this._meta[J.BASE.Notetags.MpPerc]);
    }
    else
    {
      const structure = /<mpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          mpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return mpPerc;
  };

  /**
   * Gets the formula for mp5 of this state.
   *
   * This formula is a string, intended to be `eval`-ed, which is absolutely unsafe, so
   * use with the utmost caution (as with any eval).
   * @returns {string} the formula to be dynamically executed.
   */
  get slipTpFormula()
  {
    let formula = "";
    const structure = /<slip:tp:\[([+\-*\/ ().\w]+)]>/gmi;
    this._notes.forEach(note =>
    {
      if (note.match(structure))
      {
        formula = RegExp.$1;
      }
    });

    return formula;
  };

  /**
   * Gets the flat tp5 for this state.
   * @returns {number} The flat tp5.
   */
  get slipTpFlat()
  {
    let tpFlat = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpFlat])
    {
      tpFlat = parseInt(this._meta[J.BASE.Notetags.TpFlat]);
    }
    else
    {
      const structure = /<tpFlat:[ ]?([-]?\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          tpFlat = parseInt(RegExp.$1);
        }
      });
    }

    return tpFlat;
  };

  /**
   * Gets the percentage tp5 for this state.
   * @returns {number} The percentage tp5.
   */
  get slipTpPerc()
  {
    let tpPerc = 0;
    if (this._meta && this._meta[J.BASE.Notetags.TpPerc])
    {
      tpPerc = parseFloat(this._meta[J.BASE.Notetags.TpPerc]);
    }
    else
    {
      const structure = /<tpPerc:[ ]?([-]?\d+)[%]?>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          tpPerc = parseFloat(RegExp.$1);
        }
      });
    }

    return tpPerc;
  };
}
//#endregion JABS_StateData

//#region JABS_TrackedState
/**
 * A class containing the tracked data for a particular state and battler.
 */
function JABS_TrackedState()
{
  this.initialize(...arguments);
}
JABS_TrackedState.prototype = {};
JABS_TrackedState.prototype.constructor = JABS_TrackedState;

/**
 * @constructor
 * @param {Game_Battler} battler The battler afflicted with this state.
 * @param {number} stateId The id of the state being tracked.
 * @param {number} iconIndex The icon index of the state being tracked.
 * @param {number} duration The duration of the state being tracked.
 * @param {Game_Battler} source The origin that applied this state to the battler.
 */
JABS_TrackedState.prototype.initialize = function({battler, stateId, iconIndex, duration, source})
{
  /**
   * The battler being afflicted with this state.
   * @type {Game_Battler}
   */
  this.battler = battler;

  /**
   * The id of the state being tracked.
   * @type {number}
   */
  this.stateId = stateId;

  /**
   * The icon index of the state being tracked (for visual purposes).
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The current duration of the state being tracked. Decrements over time.
   * @type {number}
   */
  this.duration = duration;

  /**
   * Whether or not this tracked state is identified as `expired`.
   * Expired states do not apply to the battler, but are kept in the tracking collection
   * to grant the ability to refresh the state duration or whatever we choose to do.
   * @type {boolean}
   */
  this.expired = false;

  /**
   * The source that caused this state. Usually this is an opposing battler. If no source is specified,
   * then the afflicted battler is the source.
   * @type {Game_Battler}
   */
  this.source = source ?? battler;
};

/**
 * Updates this tracked state over time. If the duration reaches 0, then the state
 * is removed and this tracked state becomes `expired`.
 */
JABS_TrackedState.prototype.update = function()
{
  if (this.duration > 0)
  {
    this.duration--;
  }
  else if (this.duration === 0 && this.stateId !== this.battler.deathStateId())
  {
    this.removeStateFromBattler();
  }
};

/**
 * Performs the removal of the state from the battler and sets the `expired` to true.
 */
JABS_TrackedState.prototype.removeStateFromBattler = function()
{
  const index = this.battler
    .states()
    .findIndex(state => state.id === this.stateId);
  if (index > -1)
  {
    this.battler.removeState(this.stateId);
    this.expired = true;
  }
};

/**
 * Gets whether or not this tracked state is `expired`.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isExpired = function()
{
  return this.expired;
};

/**
 * Gets whether or not this tracked state is about to 'expire'.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isAboutToExpire = function()
{
  return this.duration <= 90;
};
//#endregion JABS_TrackedState

//ENDOFFILE