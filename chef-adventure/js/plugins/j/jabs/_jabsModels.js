/*:
 * @target MZ
 * @plugindesc
 * [v3.0.0 JABS] The various custom models created for JABS.
 * @author JE
 * @url https://github.com/je-can-code/ca
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
  }

  /**
   * @constructor
   * @param {string} uuid This action's unique identifier.
   * @param {RPG_Skill} baseSkill The skill retrieved from `$dataSkills[id]`.
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
     * @type {RPG_Skill}
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
    this._delayDuration = this._baseSkill.jabsDelayDuration ?? 0;

    /**
     * Whether or not this action will trigger when an enemy touches it.
     * @type {boolean}
     */
    this._triggerOnTouch = this._baseSkill.jabsDelayTriggerByTouch ?? false;

    /**
     * The remaining number of times this action can pierce a target.
     * @type {number}
     */
    this._pierceTimesLeft = this.makePiercingCount();

    /**
     * The base pierce delay in frames.
     * @type {number}
     */
    this._basePierceDelay = this._baseSkill.jabsPierceDelay;

    /**
     * The current pierce delay in frames.
     * @type {number}
     */
    this._currentPierceDelay = 0;

    /**
     * The animation id to be performed on the action itself upon execution.
     * @type {number}
     */
    this._selfAnimationId = this._baseSkill.jabsSelfAnimationId ?? 0;
  }

  /**
   * Combines from all available sources the bonus hits for this action.
   * @returns {number}
   */
  makePiercingCount()
  {
    let pierceCount = this._baseSkill.jabsPierceCount;

    // handle skill extension bonuses.
    if (J.EXTEND)
    {
      // check if there is an underlying item to parse repeats off of.
      pierceCount += this._gameAction._item
        // skill extensions borrow from the extended skill repeats instead.
        ? this._gameAction._item._item.repeats - 1
        // no extended skill, no bonus repeats.
        : 0;
    }

    // handle other bonus hits for basic attacks.
    pierceCount += this._caster.getAdditionalHits(
      this._baseSkill,
      this._actionCooldownType === JABS_Button.Main ||
      this._actionCooldownType === JABS_Button.Offhand)

    return pierceCount;
  }

  /**
   * Executes additional logic before this action is disposed.
   */
  preCleanupHook()
  {
    // handle self-targeted animations on cleanup.
    this.handleSelfAnimationOnDefeat();
  }

  /**
   * If the action has an animation to cast on oneself, then execute it.
   */
  handleSelfAnimationOnDefeat()
  {
    // handle self-targeted animations on cleanup.
    const event = this.getActionSprite();

    // check if the action has an animation to play before destroying.
    if (this.hasSelfAnimationId())
    {
      // play it on oneself.
      event.requestAnimation(this.getSelfAnimationId());
    }
  }

  /**
   * Gets whether or not this action has a self animation id.
   * @returns {boolean}
   */
  hasSelfAnimationId()
  {
    return this.getSelfAnimationId() !== 0;
  }

  /**
   * Gets the self animation id to display on oneself when
   * performing this action.
   * @returns {number}
   */
  getSelfAnimationId()
  {
    return this._selfAnimationId;
  }

  /**
   * Performs the self animation upon this action.
   */
  performSelfAnimation()
  {
    this.getActionSprite().requestAnimation(this.getSelfAnimationId());
  }

  /**
   * Gets the `uuid` of this action.
   *
   * If one is not returned, then it is probably a direct action with no event representing it.
   * @returns {string|null}
   */
  getUuid()
  {
    return this._uuid;
  }

  /**
   * Gets the base skill this `JABS_Action` is based on.
   * @returns {RPG_Skill} The base skill of this `JABS_Action`.
   */
  getBaseSkill()
  {
    return this._baseSkill;
  }

  /**
   * Gets the team id of the caster of this action.
   * @returns {number} The team id of the caster of this `JABS_Action`.
   */
  getTeamId()
  {
    return this.getCaster().getTeam();
  }

  /**
   * The base game action this `JABS_Action` is based on.
   * @returns {Game_Action} The base game action for this action.
   */
  getAction()
  {
    return this._gameAction;
  }

  /**
   * Gets the `JABS_Battler` that created this `JABS_Action`.
   * @returns {JABS_Battler} The caster of this `JABS_Action`.
   */
  getCaster()
  {
    return this._caster;
  }

  /**
   * Gets the cast animation id for this action.
   * @returns {number|null}
   */
  getCastAnimation()
  {
    return this.getBaseSkill().jabsCastAnimation;
  }

  /**
   * Gets whether or not this action is unparryable.
   * @returns {boolean}
   */
  isUnparryable()
  {
    return !!this.getBaseSkill().jabsUnparryable;
  }

  /**
   * Whether or not this action is a retaliation- meaning it will not invoke retaliation.
   * @returns {boolean} True if it is a retaliation, false otherwise.
   */
  isRetaliation()
  {
    return this._isRetaliation;
  }

  /**
   * Gets the direction this action is facing.
   * @returns {2|4|6|8|1|3|7|9}
   */
  direction()
  {
    return this._facing || this.getActionSprite().direction();
  }

  /**
   * Gets the name of the cooldown for this action.
   * @returns {string} The cooldown key for this action.
   */
  getCooldownType()
  {
    return this._actionCooldownType;
  }

  /**
   * Sets the name of the cooldown for tracking on the caster.
   * @param {string} type The name of the cooldown that this leverages.
   */
  setCooldownType(type)
  {
    this._actionCooldownType = type;
  }

  /**
   * Gets the durations remaining on this `JABS_Action`.
   */
  getDuration()
  {
    return this._currentDuration;
  }

  /**
   * Gets the max duration in frames that this action will exist on the map.
   * If the duration was unset, or is set but less than the minimum, it will be the minimum.
   * @returns {number} The max duration in frames (min 8).
   */
  getMaxDuration()
  {
    return Math.max(this.getBaseSkill().jabsDuration, JABS_Action.getMinimumDuration())
  }

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
  }

  /**
   * Gets whether or not this action is expired and should be removed.
   * @returns {boolean} True if expired and past the minimum count, false otherwise.
   */
  isActionExpired()
  {
    const isExpired = this.getMaxDuration() <= this._currentDuration;
    const minDurationElapsed = this._currentDuration > JABS_Action.getMinimumDuration();
    return (isExpired && minDurationElapsed);
  }

  /**
   * Gets whether or not this `JABS_Action` needs removing.
   * @returns {boolean} Whether or not this action needs removing.
   */
  getNeedsRemoval()
  {
    return this._needsRemoval;
  }

  /**
   * Sets whether or not this `JABS_Action` needs removing.
   * @param {boolean} remove Whether or not to remove this `JABS_Action`.
   */
  setNeedsRemoval(remove = true)
  {
    this._needsRemoval = remove;
  }

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
  }

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
  }

  /**
   * Gets whether or not the delay on this action has completed.
   *
   * This also includes if an action never had a delay to begin with.
   * @returns {boolean}
   */
  isDelayCompleted()
  {
    return this._delayDuration <= 0 && !this.isEndlessDelay();
  }

  /**
   * Automatically finishes the delay regardless of its current status.
   */
  endDelay()
  {
    this._delayDuration = 0;
  }

  /**
   * Gets whether or not this action will be delayed until triggered.
   * @returns {boolean}
   */
  isEndlessDelay()
  {
    return this._delayDuration === -1;
  }

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
  }

  /**
   * Gets the number of times this action can potentially hit a target.
   * @returns {number} The number of times remaining that this action can hit a target.
   */
  getPiercingTimes()
  {
    return this._pierceTimesLeft;
  }

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
  }

  /**
   * Gets the delay between hits for this action.
   * @returns {number} The number of frames between repeated hits.
   */
  getPiercingDelay()
  {
    return this._currentPierceDelay;
  }

  /**
   * Modifies the piercing delay by this amount (default = 1). If a negative number is
   * provided, then this will increase the delay by that amount instead.
   * @param {number} decrement The amount to modify the delay by.
   */
  modPiercingDelay(decrement = 1)
  {
    this._currentPierceDelay -= decrement;
  }

  /**
   * Resets the piercing delay of this action back to it's base.
   */
  resetPiercingDelay()
  {
    this._currentPierceDelay = this._basePierceDelay;
  }

  /**
   * Gets whether or not this action is a direct-targeting action.
   * @returns {boolean}
   */
  isDirectAction()
  {
    return this.getBaseSkill().jabsDirect ?? false;
  }

  /**
   * Gets whether or not this action is a support action.
   * @returns {boolean}
   */
  isSupportAction()
  {
    return this._gameAction.isForFriend();
  }

  /**
   * Gets the cooldown time for this skill.
   * @returns {number} The cooldown frames of this `JABS_Action`.
   */
  getCooldown()
  {
    return this.getBaseSkill().jabsCooldown ?? 0;
  }

  /**
   * Gets the range of which this `JABS_Action` will reach.
   * @returns {number} The range of this action.
   */
  getRange()
  {
    return this.getBaseSkill().jabsRange;
  }

  /**
   * Gets the cast time for this skill.
   * @returns {number}
   */
  getCastTime()
  {
    return this.getBaseSkill().jabsCastTime ?? 0;
  }

  /**
   * Gets the proximity to the target in order to use this `JABS_Action`.
   * @returns {number} The proximity required for this action.
   */
  getProximity()
  {
    // check if the scope is "user".
    if (this.isForSelf())
    {
      // proximity for usable skills of scope "user" is unlimited.
      return 9999;
    }

    // return the proximity from the underlying skill.
    return this.getBaseSkill().jabsProximity;
  }

  /**
   * Whether or not the scope of this action is "User" or not.
   * @returns {boolean}
   */
  isForSelf()
  {
    return this.getBaseSkill().scope === 11;
  }

  /**
   * Gets the shape of the hitbox for this `JABS_Action`.
   * @returns {string} The designated shape of the action.
   */
  getShape()
  {
    return this.getBaseSkill().jabsShape;
  }

  /**
   * Gets the knockback of this action.
   * @returns {number|null}
   */
  getKnockback()
  {
    return this.getBaseSkill().jabsKnockback;
  }

  /**
   * Gets the event id associated with this `JABS_Action` from the action map.
   * This MUST have a numeric return value, and thus will default to eventId 1
   * on the action map if none is present.
   * @returns {number}
   */
  getActionId()
  {
    return this.getBaseSkill().jabsActionId ?? 1;
  }

  /**
   * Gets any additional aggro this skill generates.
   * @returns {number}
   */
  bonusAggro()
  {
    return this.getBaseSkill().jabsBonusAggro ?? 0;
  }

  /**
   * Gets the aggro multiplier from this skill.
   * @returns {number}
   */
  aggroMultiplier()
  {
    return this.getBaseSkill().jabsAggroMultiplier ?? 1.0;
  }
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
   * The id of the last skill that was executed by this battler.
   * @type {number}
   */
  this._lastUsedSkillId = 0;

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
//#endregion initialize battler

//#region statics
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

  // explicitly hidden skills are not visible in the item menu.
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
//#endregion statics

//#region updates
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

/**
 * Process any queued actions and execute them.
 */
JABS_Battler.prototype.processQueuedActions = function()
{
  // if we cannot process actions, then do not.
  if (!this.canProcessQueuedActions()) return;

  const decidedActions = this.getDecidedAction();

  // execute the action.
  $jabsEngine.executeMapActions(this, decidedActions);

  // set the last skill used to be the skill we just used.
  this.setLastUsedSkillId(decidedActions[0].getBaseSkill().id);

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

  // check if we're not a player.
  // check also if we're not in position.
  if (!this.isPlayer() && !this.isInPosition()) return false;

  // we can process all the actions!
  return true;
};

//#region update pose effects
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
//#endregion update pose effects

//#region update cooldowns
/**
 * Updates all cooldowns for this battler.
 */
JABS_Battler.prototype.updateCooldowns = function()
{
  this.getBattler().getSkillSlotManager().updateCooldowns();

  /*
  // update all skill slot cooldowns.
  Object.keys(this._cooldowns).forEach(key =>
  {
    this._cooldowns[key].update();
  });
  */
};
//#endregion update cooldowns

//#region update timers
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
};

/**
 * Updates the timer for "waiting".
 */
JABS_Battler.prototype.processWaitTimer = function()
{
  // if waiting, update the wait timer.
  if (this.isWaiting())
  {
    this.countdownWait();
  }
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
//#endregion update timers

//#region update engagement
/**
 * Monitors all other battlers and determines if they are engaged or not.
 */
JABS_Battler.prototype.updateEngagement = function()
{
  // ai engagement is blocked for players and while the game is paused.
  if (!this.canUpdateEngagement()) return;

  // grab the nearest target to this battler.
  const [target, distance] = this.closestEnemyTarget();

  // if we're unable to engage the target, do not engage.
  if (!this.canEngageTarget(target)) return;

  // process engagement handling.
  this.handleEngagement(target, distance);
};

/**
 * If this battler is the player, a hidden battler, an inanimate battler, or the abs is paused, then
 * prevent engagement updates.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdateEngagement = function()
{
  return (!$jabsEngine.absPause && !this.isPlayer() && !this.isInanimate());
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
//#endregion update engagement

//#region update dodging
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
  this.setDodging(false);

  // set the dodge steps to 0.
  this._dodgeSteps = 0;
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
  if (this._dodgeSteps <= 0) return false;

  // if we are not dodging, don't dodge move.
  if (!this._dodging) return false;

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
  if (this._dodgeSteps <= 0 && !this.getCharacter().isMoving()) return true;

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
  this._dodgeSteps = 0;

  // disable the invincibility from dodging.
  this.setInvincible(false);
};
//#endregion update dodging

//#region update death handling
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
//#endregion update death handling
//#endregion updates

//#region update helpers

//#region timers
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

  const animationId = this.getDecidedAction()[0].getCastAnimation();
  if (!animationId) return;

  if (!this.getCharacter().isAnimationPlaying())
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
  // grab the battler.
  const battler = this.getBattler();

  // grab the skill id for the dodge slot.
  const skillId = battler.getEquippedSkill(JABS_Button.Dodge);

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
  const dodgeSpeedBonus = 2;
  this.getCharacter().setDodgeBoost(dodgeSpeedBonus);

  // set the number of steps this dodge will roll you.
  this._dodgeSteps = skill.jabsRange;

  // set the direction to be dodging in (front/back/specified).
  this._dodgeDirection = this.determineDodgeDirection(skill.jabsMoveType);

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
//#endregion dodging

//#region regeneration
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
 * @param {RPG_State[]} states The filtered list of states to parse.
 */
JABS_Battler.prototype.processStateRegens = function(states)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default the regenerations to the battler's innate regens.
  const {rec} = battler;
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
  const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);
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
 * @param {RPG_State} state The state to process.
 * @returns {number} The hp regen from this state.
 */
JABS_Battler.prototype.stateSlipHp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagHp5 = 0;

  // if the flat tag exists, use it.
  tagHp5 += state.jabsSlipHpFlatPerFive;

  // if the percent tag exists, use it.
  tagHp5 += battler.mhp * (state.jabsSlipHpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const hpPerFiveFormula = state.jabsSlipHpFormulaPerFive;
  if (hpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(hpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagHp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has an hp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${hpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
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

  // default slip to zero.
  let tagMp5 = 0;

  // if the flat tag exists, use it.
  tagMp5 += state.jabsSlipMpFlatPerFive;

  // if the percent tag exists, use it.
  tagMp5 += battler.mmp * (state.jabsSlipMpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const mpPerFiveFormula = state.jabsSlipMpFormulaPerFive;
  if (mpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(mpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagMp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has an mp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${mpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  // return the per-five.
  return tagMp5;
};

/**
 * Processes a single state and returns its tag-based mp regen value.
 * @param {RPG_State} state The state to process.
 * @returns {number} The mp regen from this state.
 */
JABS_Battler.prototype.stateSlipTp = function(state)
{
  // grab the battler we're working with.
  const battler = this.getBattler();

  // default slip to zero.
  let tagTp5 = 0;

  // if the flat tag exists, use it.
  tagTp5 += state.jabsSlipTpFlatPerFive;

  // if the percent tag exists, use it.
  tagTp5 += battler.maxTp() * (state.jabsSlipTpPercentPerFive / 100);

  // if the formula tag exists, use it.
  const tpPerFiveFormula = state.jabsSlipTpFormulaPerFive;
  if (tpPerFiveFormula)
  {
    // pull the state associated with the battler.
    const trackedState = $jabsEngine.findStateTrackerByBattlerAndState(battler, state.id);

    // variables for contextual eval().
    const a = trackedState.source;  // the one who applied the state.
    const b = trackedState.battler; // this battler, afflicted by the state.
    const v = $gameVariables._data; // access to variables if you need it.
    const s = state;                // access to the state itself if you need it.

    // eval the formula with the above context.
    const result = Math.round(eval(tpPerFiveFormula) * -1);

    // check to make sure we have a number.
    if (Number.isFinite(result))
    {
      // add the number onto the running total.
      tagTp5 += result;
    }
    // the eval failed and produced a NaN or otherwise.
    else
    {
      // warn them!
      console.warn(`The state of ${state.id} has a tp formula producing a result that isn't valid.`);
      console.warn(`formula parsed: ${tpPerFiveFormula}`);
      console.warn(`result produced: ${result}`);
    }
  }

  // return the per-five.
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

  // apply the modification from the actor, if any.
  const visionMultiplier = target.getBattler().getVisionModifier();

  // apply the multiplier to the base.
  pursuitRadius *= visionMultiplier;

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
  const modifiedSight = this.applyVisionMultiplier(target);

  // determine whether or not the target is in sight.
  const isInSightRange = (distance <= sightRadius);

  // return the answer.
  return isInSightRange;
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
    return $gameMap.getBattlerByUuid(this._leaderUuid);
  }
  
    return null;
  
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
  else if (!$gameMap.battlerExists(this))
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
  const skillSlot = this.getBattler().getSkillSlot(cooldownKey);

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
  const cooldownKey = this.getCooldownKeyBySkillId(chosenSkillId);

  // check to make sure we have a key.
  if (!cooldownKey)
  {
    // if somehow we have no key, then this skill clearly isn't ready.
    return false;
  }

  // grab the cooldown itself.
  const cooldown = this.getCooldown(cooldownKey);

  // check if the skill was actually a remembered effective skill from a follower.
  if (!cooldown)
  {
    // please stop trying to cast your follower's skills.
    console.warn(this, cooldownKey);
    console.trace();
    return false;
  }

  // check if the base is off cooldown yet.
  if (!cooldown.isBaseReady())
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
    const [basicAttackSkillId] = this.getEnemyBasicAttack();

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
    return (slot.key === JABS_Button.Main || slot.key === JABS_Button.Offhand);
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
//#endregion isReady & cooldowns

//#region get data
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
 * Gets all skills that are available to this enemy battler.
 * @returns {number[]} The skill ids available to this enemy.
 */
JABS_Battler.prototype.getSkillIdsFromEnemy = function()
{
  const battler = this.getBattler();

  // filter out any "extend" skills as far as this collection is concerned.
  const filtering = action =>
  {
    // grab the skill from the database.
    const skill = battler.skill(action.skillId);

    // determine if the skill is an extend skill or not.
    const isExtendSkill = skill.meta && skill.meta['skillExtend'];

    // filter out the extend skills.
    return !isExtendSkill;
  };

  // grab the database data for this enemy.
  const battlerData = this.getBattler().enemy();

  // return the filtered result of skills.
  return battlerData.actions
    .filter(filtering)
    .map(action => action.skillId);
};

/**
 * Retrieves the `[skillId, rating]` of the basic attack for this enemy.
 * @returns {[number, number]} The `[skillId, rating]` of the basic attack.
 */
JABS_Battler.prototype.getEnemyBasicAttack = function()
{
  const battler = this.getBattler();
  const basicAttackSkill = battler.basicAttackSkillId();
  return [basicAttackSkill, 5];
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
  const [basicAttackSkillId] = this.getEnemyBasicAttack();

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
  this.removeAggroIfTargetDead(this.getTarget().getUuid());

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
    if (!(this.getTarget().getUuid() === zerothAggroUuid))
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
  if (this.isInvincible()) return false;

  // the player cannot be targeted while holding the DEBUG button.
  if (this.isPlayer() && Input.isPressed(J.ABS.Input.Debug)) return false;

  // precise timing allows for battlers to hit other battlers the instant they
  // meet event conditions, and that is not grounds to hit enemies.
  if (this.getCharacter().isAction())
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
    skillId = battler.getEquippedSkill(slot);
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

  // extract the cooldown and skill id from the item.
  const { jabsCooldown: itemCooldown, jabsSkillId: itemSkillId } = item;


  // it is an item with a custom cooldown.
  if (itemCooldown)
  {
    if (!isLoot) this.modCooldownCounter(JABS_Button.Tool, itemCooldown);
  }

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

  // it was an item, didn't have a skill attached, and didn't have a cooldown.
  if (!itemCooldown && !itemSkillId && !isLoot)
  {
    this.modCooldownCounter(JABS_Button.Tool, J.ABS.DefaultValues.CooldownlessItems);
  }

  // if the last item was consumed, unequip it.
  if (!isLoot && !$gameParty.items().includes(item))
  {
    playerBattler.setEquippedSkill(JABS_Button.Tool, 0);
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
  const itemPop = $jabsEngine.configureDamagePop(gameAction, toolData, this, target);

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
        $jabsEngine.forceMapAction(this, onDefeatSkill.skillId, false);
      }
    });
  }

  const onTargetDefeatSkills = victor.getBattler().onTargetDefeatSkillIds();
  if (onTargetDefeatSkills.length)
  {
    onTargetDefeatSkills.forEach(onDefeatSkill =>
    {
      const castFromTarget = onDefeatSkill.appearOnTarget();
      if (onDefeatSkill.shouldTrigger())
      {
        if (castFromTarget)
        {
          $jabsEngine.forceMapAction(victor, onDefeatSkill.skillId, false, this.getX(), this.getY());
        }
        else
        {
          $jabsEngine.forceMapAction(victor, onDefeatSkill.skillId, false);
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

  const skill = this.getSkill(skillId);
  const canUse = battler.meetsSkillConditions(skill);
  if (!canUse)
  {
    return null;
  }

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
  const skillId = this.getBattler().getEquippedSkill(cooldownKey);

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
  const skillId = this.getBattler().getEquippedSkill(skillSlot);
  this.performActionPose(this.getSkill(skillId));
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

  // only actually switch to the other character sprite if it exists.
  ImageManager
    .probeCharacter(newCharacterSprite)
    .then(() =>
    {
      ImageManager.loadCharacter(newCharacterSprite);
      this.getCharacter().setImage(newCharacterSprite, skill.jabsPoseIndex);
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
   * @param {boolean} careful Add pathfinding pursuit and more.
   * @param {boolean} executor Add weakpoint targeting.
   * @param {boolean} reckless Add skill spamming over attacking.
   * @param {boolean} healer Prioritize healing if health is low.
   * @param {boolean} follower Only attacks alone, obeys leaders.
   * @param {boolean} leader Enables ally coordination.
   */
  constructor(
    careful = false,
    executor = false,
    reckless = false,
    healer = false,
    follower = false,
    leader = false
  )
  {
    /**
     * An ai trait that prevents this user from executing skills that are
     * elementally ineffective against their target.
     */
    this.careful = careful;

    /**
     * An ai trait that encourages this user to always use the strongest
     * available skill.
     */
    this.executor = executor;

    /**
     * An ai trait that forces this user to always use skills if possible.
     */
    this.reckless = reckless;

    /**
     * An ai trait that prioritizes healing allies.
     * If combined with smart, the most effective healing skill will be used.
     * If combined with reckless, the healer will spam healing.
     * If combined with smart AND reckless, the healer will only use the biggest
     * healing spells available.
     */
    this.healer = healer;

    /**
     * An ai trait that prevents the user from executing anything other than
     * their basic attack while they lack a leader.
     */
    this.follower = follower;

    /**
     * An ai trait that gives a battler the ability to use its own ai to
     * determine skills for a follower. This is usually combined with other
     * ai traits.
     */
    this.leader = leader;
  }

  /**
   * Checks whether or not this AI has any bonus ai traits.
   * @returns {boolean} True if there is at least one bonus trait, false otherwise.
   */
  hasBonusAiTraits()
  {
    return (
      this.careful ||
      this.executor ||
      this.reckless ||
      this.healer ||
      this.follower ||
      this.leader);
  }

  /**
   * Decides an action for the designated follower based on the leader's ai.
   * @param {JABS_Battler} leaderBattler The leader deciding the action.
   * @param {JABS_Battler} followerBattler The follower executing the decided action.
   * @returns {number} The skill id of the decided skill for the follower to perform.
   */
  decideActionForFollower(leaderBattler, followerBattler)
  {
    // grab the basic attack skill id for this battler.
    const [basicAttackSkillId] = followerBattler.getEnemyBasicAttack();

    let skillsToUse = followerBattler.getSkillIdsFromEnemy();

    // if the enemy has no skills, then just basic attack.
    if (!skillsToUse.length)
    {
      // if there are no actual skills on this enemy, just use it's basic attack.
      return basicAttackSkillId;
    }

    // all follower actions are decided based on the leader's ai.
    const {careful, executor, healer} = this;

    // the leader calculates for the follower, so the follower gets the leader's sight as a bonus.
    const modifiedSightRadius = leaderBattler.getSightRadius() + followerBattler.getSightRadius();

    // healer AI takes priority.
    if (healer)
    {
      // get nearby allies with the leader's modified sight range of both battlers.
      const allies = $gameMap.getBattlersWithinRange(leaderBattler, modifiedSightRadius);

      // prioritize healing when self or allies are low on hp.
      if (healer)
      {
        skillsToUse = this.filterSkillsHealerPriority(followerBattler, skillsToUse, allies);
      }
    }
    else if (careful || executor)
    {
      // focus on the leader's target instead of the follower's target.
      skillsToUse = this.decideAttackAction(leaderBattler, skillsToUse);
    }

    // if the enemy has no skills after all the filtering, then just basic attack.
    if (!skillsToUse.length)
    {
      // basic attacking is always an option.
      return basicAttackSkillId;
    }

    // handle either collection or single skill.
    // TODO: probably should unify the responses of the above to return either a single OR collection.
    let chosenSkillId = Array.isArray(skillsToUse) ? skillsToUse[0] : skillsToUse;

    // grab the battler of the follower.
    const followerGameBattler = followerBattler.getBattler();

    // grab the skill.
    const skill = followerGameBattler.skill(chosenSkillId);

    // check if they can pay the costs of the skill.
    if (!followerGameBattler.canPaySkillCost(skill))
    {
      // if they can't pay the cost of the decided skill, you can always basic attack!
      chosenSkillId = basicAttackSkillId;
    }

    return chosenSkillId;
  }

  /**
   * Decides a support-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideSupportAction(user, skillsToUse)
  {
    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const allies = $gameMap.getAllyBattlersWithinRange(user, user.getSightRadius());

    // prioritize healing when self or allies are low on hp.
    if (this.healer)
    {
      skillsToUse = this.filterSkillsHealerPriority(user, skillsToUse, allies);
    }

    // if we ended up not picking a skill, then clear any ally targeting.
    if (!skillsToUse.length)
    {
      user.setAllyTarget(null);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Decides an attack-oriented action to perform.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   */
  decideAttackAction(user, skillsToUse)
  {
    // reduce the list to only castable skills.
    skillsToUse = this.filterUncastableSkills(user, skillsToUse);

    // don't do things if we have no skills to work with.
    if (!skillsToUse || !skillsToUse.length) return [];

    const {careful, executor} = this;
    const target = user.getTarget();

    // filter out skills that are elementally ineffective.
    if (careful)
    {
      skillsToUse = this.filterElementallyIneffectiveSkills(skillsToUse, target);
    }

    // find most elementally effective skill vs the target.
    if (executor)
    {
      skillsToUse = this.findMostElementallyEffectiveSkill(skillsToUse, user, target);
    }

    // handle the possibility of none or many skills still remaining.
    return this.decideFromNoneToManySkills(user, skillsToUse);
  }

  /**
   * Filters out skills that cannot be executed at this time by the battler.
   * This prevents the user from continuously picking a skill they cannot execute.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @returns {number[]}
   */
  filterUncastableSkills(user, skillsToUse)
  {
    // check to make sure we have skills to filter.
    if (!skillsToUse || !skillsToUse.length) return [];

    // filter the skills by whether or not they can be executed.
    return skillsToUse.filter(user.canExecuteSkill, user);
  }

  /**
   * A protection method for handling none, one, or many skills remaining after
   * filtering, and only returning a single skill id.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]|number|null} skillsToUse The available skills to use.
   * @returns {number}
   */
  decideFromNoneToManySkills(user, skillsToUse)
  {
    // check if "skills" is actually just one valid skill.
    if (Number.isInteger(skillsToUse))
    {
      // return that, this is fine.
      return skillsToUse;
    }
    // check if "skills" is indeed an array of skills with values.
    else if (Array.isArray(skillsToUse) && skillsToUse.length)
    {
      // pick one at random.
      return skillsToUse[Math.randomInt(skillsToUse.length)];
    }

    // always at least basic attack.
    return user.getEnemyBasicAttack()[0];
  }

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
  }

  /**
   * Decides an action from an array of skill objects based on the target.
   * Will choose the skill that has the highest elemental effectiveness.
   * @param {number[]|number} skillsToUse The available skills to use.
   * @param {JABS_Battler} user The battler to decide the action.
   * @param {JABS_Battler} target The battler to decide the action about.
   */
  findMostElementallyEffectiveSkill(skillsToUse, user, target)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    if (skillsToUse.length > 1)
    {
      const elementalSkillCollection = [];
      skillsToUse.forEach(skillId =>
      {
        const testAction = new Game_Action(user.getBattler());
        testAction.setSkill(skillId);
        const rate = testAction.calcElementRate(target.getBattler());
        elementalSkillCollection.push([skillId, rate]);
      });

      // sorts the skills by their elemental effectiveness.
      elementalSkillCollection.sort((a, b) =>
      {
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });

      // only use the highest elementally effective skill.
      skillsToUse = elementalSkillCollection[0][0];
    }

    return skillsToUse;
  }

  /**
   * Filters skills by a healing priority.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @param {JABS_Battler[]} allies
   * @returns {number} The best skill id for healing according to this battler.
   */
  filterSkillsHealerPriority(user, skillsToUse, allies)
  {
    // if we have no skills to work with, then don't process.
    if (!skillsToUse.length > 1) return skillsToUse;

    // if we have no ai traits that affect skill-decision-making, then don't perform the logic.
    const {careful, reckless} = this;
    if (!careful && !reckless) return skillsToUse;

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

    const skillOptions = [biggestHealAllSkill, biggestHealOneSkill, closestFitHealAllSkill, closestFitHealOneSkill];
    bestSkillId = skillOptions[Math.randomInt(skillOptions.length)];

    // careful will decide in this order:
    if (careful)
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
    }
    else
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
    }

    return bestSkillId;
  }
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
JABS_BattlerCoreData.prototype.initMembers = function() 
{ };

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
  }

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
  }

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
  }

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
  }

  /**
   * Sets the battler id of this core data.
   * @param {number} battlerId The id of the battler from the database.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerId(battlerId)
  {
    this.#battlerId = battlerId;
    return this;
  }

  /**
   * Sets the team id of this core data.
   * @param {number} teamId The id of the team this battler belongs to.
   * @returns {this} This builder for fluent-building.
   */
  setTeamId(teamId)
  {
    this.#teamId = teamId;
    return this;
  }

  /**
   * Sets the AI of this core data.
   * @param {string} battlerAi The AI of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setBattlerAi(battlerAi)
  {
    this.#battlerAi = battlerAi;
    return this;
  }

  /**
   * Sets the sight range of this core data.
   * @param {number} sightRange The sight range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setSightRange(sightRange)
  {
    this.#sightRange = sightRange;
    return this;
  }

  /**
   * Sets the alerted sight boost of this core data.
   * @param {number} alertedSightBoost The alerted sight boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedSightBoost(alertedSightBoost)
  {
    this.#alertedSightBoost = alertedSightBoost;
    return this;
  }

  /**
   * Sets the pursuit range of this core data.
   * @param {number} pursuitRange The pursuit range of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setPursuitRange(pursuitRange)
  {
    this.#pursuitRange = pursuitRange;
    return this;
  }

  /**
   * Sets the alerted pursuit boost of this core data.
   * @param {number} alertedPursuitBoost The alerted pursuit boost of this battler.
   * @returns {this} This builder for fluent-building.
   */
  setAlertedPursuitBoost(alertedPursuitBoost)
  {
    this.#alertedPursuitBoost = alertedPursuitBoost;
    return this;
  }

  /**
   * Sets the alerted duration of this core data.
   * @param {number} alertDuration The duration of which this battler remains alerted.
   * @returns {this} This builder for fluent-building.
   */
  setAlertDuration(alertDuration)
  {
    this.#alertDuration = alertDuration;
    return this;
  }

  /**
   * Sets whether or not this battler can idle while not in combat.
   * @param {boolean} canIdle Whether or not this battler can idle about.
   * @returns {this} This builder for fluent-building.
   */
  setCanIdle(canIdle)
  {
    this.#canIdle = canIdle;
    return this;
  }

  /**
   * Sets whether or not this battler's hp bar is visible.
   * @param {boolean} showHpBar Whether or not the hp bar is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowHpBar(showHpBar)
  {
    this.#showHpBar = showHpBar;
    return this;
  }

  /**
   * Sets whether or not this battler's danger indicator is visible.
   * @param {boolean} showDangerIndicator Whether or not the danger indicator is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowDangerIndicator(showDangerIndicator)
  {
    this.#showDangerIndicator = showDangerIndicator;
    return this;
  }

  /**
   * Sets whether or not this battler's name is visible.
   * @param {boolean} showBattlerName Whether or not the battler name is visible.
   * @returns {this} This builder for fluent-building.
   */
  setShowBattlerName(showBattlerName)
  {
    this.#showBattlerName = showBattlerName;
    return this;
  }

  /**
   * Sets whether or not this battler is invincible.
   * @param {boolean} isInvincible Whether or not the battler is invincible.
   * @returns {this} This builder for fluent-building.
   */
  setIsInvincible(isInvincible)
  {
    this.#isInvincible = isInvincible;
    return this;
  }

  /**
   * Sets whether or not this battler is inanimate.
   * @param {boolean} isInanimate Whether or not the battler is inanimate.
   * @returns {this} This builder for fluent-building.
   */
  setIsInanimate(isInanimate)
  {
    this.#isInanimate = isInanimate;
    return this;
  }
  //#endregion setters
}
//#endregion JABS_CoreDataBuilder

//#region JABS_Cooldown
/**
 * A class representing a skill or item's cooldown data.
 */
class JABS_Cooldown
{
  /**
   * The key of the cooldown.
   * @type {string}
   */
  key = String.empty;

  /**
   * The frames of the cooldown.
   * @type {number}
   */
  frames = 0;

  /**
   * Whether or not the base cooldown is ready.
   * @type {boolean}
   */
  ready = false;

  /**
   * The number of frames in which the combo action can be executed instead.
   * @type {number}
   */
  comboFrames = 0;

  /**
   * Whether or not the combo cooldown is ready.
   * @type {boolean}
   */
  comboReady = false;

  /**
   * Whether or not this cooldown is locked from changing.
   * @type {boolean}
   */
  locked = false;

  //#region initialize
  /**
   * @constructor
   * @param {string} key The key identifying this cooldown.
   */
  constructor(key)
  {
    // assign the properties.
    this.key = key;

    // initialize the rest of the properties.
    this.clearData();
  }

  /**
   * Initializes all members of this class.
   */
  clearData()
  {
    // default all the values.
    this.frames = 0;
    this.ready = false;
    this.comboFrames = 0;
    this.comboReady = false;
    this.locked = false;
    this.mustComboClear = false;
  }
  //#endregion initialize

  /**
   * Gets whether or not if either of the components of the cooldown are ready.
   * @returns {boolean}
   */
  isAnyReady()
  {
    return this.ready || this.comboReady;
  }

  needsComboClear()
  {
    return this.mustComboClear;
  }

  acknowledgeComboClear()
  {
    this.mustComboClear = false;
  }

  requestComboClear()
  {
    this.mustComboClear = true;
  }

  /**
   * Manages the update cycle for this cooldown.
   */
  update()
  {
    // check if we can update the cooldowns at all.
    if (!this.canUpdate()) return;

    // update the cooldowns.
    this.updateCooldownData();
  }

  /**
   * Determines whether or not this cooldown can be updated.
   * @returns {boolean} True if it can be updated, false otherwise.
   */
  canUpdate()
  {
    // cannot update a cooldown when it is locked.
    if (this.isLocked()) return false;

    // update the cooldown!
    return true;
  }

  /**
   * Updates the base and combo cooldowns.
   */
  updateCooldownData()
  {
    // update the base cooldown.
    this.updateBaseCooldown();

    // update the combo cooldown.
    this.updateComboCooldown();
  }

  //#region base cooldown
  /**
   * Updates the base skill data for this cooldown.
   */
  updateBaseCooldown()
  {
    // if the base cooldown is ready, do not update.
    if (this.ready) return;

    // check if we have a base cooldown to decrement.
    if (this.frames > 0)
    {
      // decrement the base cooldown.
      this.frames--;
    }

    // check if the base cooldown is complete.
    this.handleIfBaseReady();
  }

  /**
   * Enables the flag to indicate the base skill is ready for this cooldown.
   * This also clears the combo data, as they both cannot be available at the same time.
   */
  enableBase()
  {
    // set the base cooldown frames to 0.
    this.frames = 0;

    // toggles the base ready flag.
    this.ready = true;
  }

  /**
   * Gets whether or not the base skill is off cooldown.
   * @returns {boolean}
   */
  isBaseReady()
  {
    return this.ready;
  }

  /**
   * Sets a new value for the base cooldown to countdown from.
   * @param {number} frames The value to countdown from.
   */
  setFrames(frames)
  {
    // set the value.
    this.frames = frames;

    // check if the base cooldown is now ready.
    this.handleIfBaseReady();

    // check if the base cooldown is now not ready.
    this.handleIfBaseUnready();
  }

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modBaseFrames(frames)
  {
    // modify the value.
    this.frames += frames;

    // check if the base cooldown is now ready.
    this.handleIfBaseReady();

    // check if the base cooldown is now not ready.
    this.handleIfBaseUnready();
  }

  /**
   * Checks if the base cooldown is in a state of ready.
   * If it is, the ready flag will be enabled.
   */
  handleIfBaseReady()
  {
    // check if the base cooldown is now ready.
    if (this.frames <= 0)
    {
      // clear the combo data.
      this.resetCombo();

      // enable the base skill.
      this.enableBase();
    }
  }

  /**
   * Checks if the base cooldown is in a state of unready.
   * If it is, the ready flag will be disabled.
   */
  handleIfBaseUnready()
  {
    // check if the base cooldown is now not ready.
    if (this.frames > 0)
    {
      // not ready.
      this.ready = false;
    }
  }
  //#endregion base cooldown

  //#region combo cooldown
  /**
   * Updates the combo data for this cooldown.
   */
  updateComboCooldown()
  {
    // if the combo cooldown is ready, do not update.
    if (this.comboReady) return;

    // decrement the combo cooldown.
    if (this.comboFrames > 0)
    {
      // decrement the combo cooldown.
      this.comboFrames--;
    }

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();
  }

  /**
   * Enables the flag to indicate a combo is ready for this cooldown.
   */
  enableCombo()
  {
    // action ready!
    // zero the wait time for combo frames.
    this.comboFrames = 0;

    // enable the combo!
    this.comboReady = true;
  }

  /**
   * Sets the combo frames to countdown from this value.
   * @param {number} frames The value to countdown from.
   */
  setComboFrames(frames)
  {
    // set the value.
    this.comboFrames = frames;

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();

    // handle if the base cooldown is now not ready.
    this.handleIfComboUnready();
  }

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modComboFrames(frames)
  {
    // modify the value.
    this.comboFrames += frames;

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();

    // handle if the base cooldown is now not ready.
    this.handleIfComboUnready();
  }

  /**
   * Checks if the combo cooldown is in a state of ready.
   * If it is, the ready flag will be enabled.
   */
  handleIfComboReady()
  {
    // check if the base cooldown is now ready.
    if (this.comboFrames <= 0)
    {
      // enable the combo!
      this.enableCombo();
    }
  }

  /**
   * Checks if the combo cooldown is in a state of unready.
   * If it is, the ready flag will be disabled.
   */
  handleIfComboUnready()
  {
    // check if the combo cooldown is now not ready.
    if (this.comboFrames > 0)
    {
      // not ready.
      this.comboReady = false;
    }
  }

  /**
   * Resets the combo data associated with this cooldown.
   */
  resetCombo()
  {
    // zero the combo frames.
    this.comboFrames = 0;

    // disable the ready flag.
    this.comboReady = false;

    // requests the slot containing this cooldown to clear the combo id.
    this.requestComboClear();
  }

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
  }

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
  }
  //#endregion locking
}
//#endregion JABS_Cooldown

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
  }

  /**
   * Gets whether or not this guard data includes the ability to guard at all.
   * @returns {boolean}
   */
  canGuard()
  {
    return !!(this.flatGuardReduction || this.percGuardReduction);
  }

  /**
   * Gets whether or not this guard data includes the ability to precise-parry.
   * @returns {boolean}
   */
  canParry()
  {
    return this.parryDuration > 0;
  }

  /**
   * Gets whether or not this guard data enables countering of any kind.
   * @returns {boolean}
   */
  canCounter()
  {
    return !!(this.counterGuardId || this.counterParryId);
  }
}
//#endregion JABS_GuardData

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
  }

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
  }

  /**
   * Gets the `uuid` of this loot drop.
   * @returns {string}
   */
  get uuid()
  {
    return this._uuid;
  }

  /**
   * Sets the `uuid` to the new value.
   * This overwrites the default-generated `uuid`.
   * @param {string} newUuid The new `uuid`.
   */
  set uuid(newUuid)
  {
    this._uuid = newUuid;
  }

  /**
   * Gets the duration remaining on this loot drop.
   * @returns {number}
   */
  get duration()
  {
    return this._duration;
  }

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
  }

  /**
   * Whether or not this loot drop's duration is expired.
   * If the loot cannot expire, this will always return false, regardless of duration.
   * @returns {boolean}
   */
  get expired()
  {
    if (!this._canExpire) return false;

    return this._duration <= 0;
  }

  /**
   * Counts down the duration for this loot drop.
   */
  countdownDuration()
  {
    if (!this._canExpire || this._duration <= 0) return;

    this._duration--;
  }

  /**
   * Gets the underlying loot object.
   * @returns {RPG_BaseItem}
   */
  get lootData()
  {
    return this._lootObject;
  }

  /**
   * Gets the `iconIndex` for the underlying loot object.
   * @returns {number}
   */
  get lootIcon()
  {
    return this._lootObject.iconIndex;
  }

  /**
   * Gets whether or not this loot should be automatically consumed on pickup.
   * @returns {boolean}
   */
  get useOnPickup()
  {
    return this._lootObject.jabsUseOnPickup ?? false;
  }
}
//#endregion JABS_LootDrop

//#region JABS_OnChanceEffect
/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_OnChanceEffect
{
  constructor(skillId, chance, key)
  {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {RPG_Skill}
   */
  baseSkill()
  {
    return $dataSkills[this.skillId];
  }

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget()
  {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  }

  /**
   * Dances with RNG to determine if this onChanceEffect was successful or not.
   * @param {number=} rollForPositive The number of times to try for success; defaults to 1.
   * @param {number=} rollForNegative The number of times to try and undo success; defaults to 0.
   * @returns {boolean} True if this effect should proc, false otherwise.
   */
  shouldTrigger(rollForPositive = 1, rollForNegative = 0)
  {
    // default fail.
    let success = false;

    // keep rolling for positive while we have positive rolls and aren't already successful.
    while (rollForPositive && !success)
    {
      // roll for effect!
      const chance = Math.randomInt(100) + 1;

      // check if the roll meets the chance criteria.
      if (chance <= this.chance)
      {
        // flag for success!
        success = true;
      }

      // decrement the positive roll counter.
      rollForPositive--;
    }

    // if successful and we have negative rerolls, lets get fight RNG for success!
    if (success && rollForNegative)
    {
      // keep rolling for negative while we have negative rerolls and are still successful.
      while (rollForNegative && success)
      {
        // check if the roll meets the chance criteria.
        if (chance <= this.chance)
        {
          // we keep our flag! (this time...)
          success = true;
        }
        // we didn't meet the chance criteria this time.
        else
        {
          // undo our success :(
          success = false;
        }

        // decrement the negative reroll counter.
        rollForNegative--;
      }
    }

    // return our successes (or failure).
    return success;
  }
}
//#endregion JABS_OnChanceEffect

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

  // initialize the rest of the members.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlot.prototype.initMembers = function()
{
  /**
   * The combo id that comes after the current id; default is 0.
   * @type {number}
   */
  this.comboId = 0;

  /**
   * The cooldown associated with this slot.
   * @type {JABS_Cooldown}
   */
  this.cooldown = new JABS_Cooldown(this.key);

  /**
   * Whether or not this skill slot is locked.
   *
   * Locked slots cannot be changed until unlocked.
   * @type {boolean}
   */
  this.locked = false;

  // initialize the refreshes.
  this.initVisualRefreshes();
};

//#region refreshes
/**
 * Initializes the various visual refreshes.
 */
JABS_SkillSlot.prototype.initVisualRefreshes = function()
{
  /**
   * Whether or not this skill slot's name needs refreshing.
   * @type {boolean}
   */
  this.needsNameRefresh = true;

  /**
   * Whether or not this skill slot's item cost needs refreshing.
   * @type {boolean}
   */
  this.needsItemCostRefresh = true;

  /**
   * Whether or not this skill slot's hp cost needs refreshing.
   * @type {boolean}
   */
  this.needsHpCostRefresh = true;

  /**
   * Whether or not this skill slot's mp cost needs refreshing.
   * @type {boolean}
   */
  this.needsMpCostRefresh = true;


  /**
   * Whether or not this skill slot's tp cost needs refreshing.
   * @type {boolean}
   */
  this.needsTpCostRefresh = true;


  /**
   * Whether or not this skill slot's icon needs refreshing.
   * @type {boolean}
   */
  this.needsIconRefresh = true;
};

/**
 * Flags this skillslot to need a visual refresh for the HUD.
 */
JABS_SkillSlot.prototype.flagSkillSlotForRefresh = function()
{
  this.needsNameRefresh = true;
  this.needsHpCostRefresh = true;
  this.needsMpCostRefresh = true;
  this.needsTpCostRefresh = true;
  this.needsItemCostRefresh = true;
  this.needsIconRefresh = true;
};

/**
 * Checks whether or not this skillslot's name is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualNameRefresh = function()
{
  return this.needsNameRefresh;
};

/**
 * Acknowledges that this skillslot's name was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeNameRefresh = function()
{
  this.needsNameRefresh = false;
};

/**
 * Checks whether or not this skillslot's item cost is in need of a visual refresh by type.
 * @param {Sprite_SkillCost.Types} costType
 * @returns {boolean} True if the given type
 */
JABS_SkillSlot.prototype.needsVisualCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      return this.needsHpCostRefresh;
    case (Sprite_SkillCost.Types.MP):
      return this.needsMpCostRefresh;
    case (Sprite_SkillCost.Types.TP):
      return this.needsTpCostRefresh;
    case (Sprite_SkillCost.Types.Item):
      return this.needsItemCostRefresh;
  }

  console.warn(`attempted to request a refresh of type: ${costType}, but it isn't implemented.`);
  return false;
};

/**
 * Acknowledges that this skillslot's item cost was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      this.needsHpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.MP):
      this.needsMpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.TP):
      this.needsTpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.Item):
      this.needsItemCostRefresh = false;
      break;
    default:
      console.warn(`attempted to acknowledge a refresh of type: ${costType}, but it isn't implemented.`);
      break;
  }
};

/**
 * Checks whether or not this skillslot's icon is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualIconRefresh = function()
{
  return this.needsIconRefresh;
};

/**
 * Acknowledges that this skillslot's icon was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeIconRefresh = function()
{
  this.needsIconRefresh = false;
};
//#endregion refreshes

/**
 * Gets the cooldown associated with this skill slot.
 * @returns {JABS_Cooldown}
 */
JABS_SkillSlot.prototype.getCooldown = function()
{
  return this.cooldown;
};

/**
 * Updates the cooldown for this skill slot.
 */
JABS_SkillSlot.prototype.updateCooldown = function()
{
  // update the cooldown.
  this.getCooldown().update();

  // handle the need to clear the combo id from this slot.
  this.handleComboReadiness();
};

JABS_SkillSlot.prototype.handleComboReadiness = function()
{
  // grab this slot's cooldown.
  const cooldown = this.getCooldown();

  // check if we need to clear the combo id.
  if (cooldown.needsComboClear())
  {
    // otherwise, reset the combo id for this slot.
    this.resetCombo();

    // let the cooldown know we did the deed.
    cooldown.acknowledgeComboClear();
  }
};

/**
 * Resets the combo id for this slot.
 */
JABS_SkillSlot.prototype.resetCombo = function()
{
  // reset the combo id to 0, forcing use of the main id.
  this.setComboId(0);
};

/**
 * Gets the next combo skill id for this skill slot.
 * @returns {number}
 */
JABS_SkillSlot.prototype.getComboId = function()
{
  return this.comboId;
};

/**
 * Sets the next combo skill id for this skill slot.
 * @param {number} skillId The new skill id that is next in the combo.
 */
JABS_SkillSlot.prototype.setComboId = function(skillId)
{
  this.comboId = skillId;
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
 * Gets whether or not this slot belongs to the tool slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isItem = function()
{
  return this.key === JABS_Button.Tool;
};

/**
 * Gets whether or not this slot belongs to a skill slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSkill = function()
{
  return this.key !== JABS_Button.Tool;
};

/**
 * Checks whether or not this is a "primary" slot making up the base functions
 * that this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isPrimarySlot = function()
{
  const slots = [
    JABS_Button.Main,
    JABS_Button.Offhand,
    JABS_Button.Tool,
    JABS_Button.Dodge
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
    JABS_Button.CombatSkill1,
    JABS_Button.CombatSkill2,
    JABS_Button.CombatSkill3,
    JABS_Button.CombatSkill4,
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
    return this;
  }

  // assign the new skill id.
  this.id = skillId;

  // raise a flag that we need the visual refresh.
  this.flagSkillSlotForRefresh();

  // return this for fluent-chaining.
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
    JABS_Button.Main,
    JABS_Button.Offhand
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
 * Gets whether or not this slot is locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Gets the underlying data for this slot.
 * Supports retrieving combo skills via targetId.
 * Supports skill extended data via J-SkillExtend.
 * @param {Game_Actor|null} user The user to get extended skill data for.
 * @param {number|null} targetId The target id to get skill data for.
 * @returns {RPG_UsableItem|RPG_Skill|null}
 */
JABS_SkillSlot.prototype.data = function(user = null, targetId = this.id)
{
  // if this slot is empty, then return null.
  if (this.isEmpty()) return null;

  // check if this slot is an item.
  if (this.isItem())
  {
    // return the corresponding item.
    return $dataItems[targetId];
  }

  // check if we're using the skill extension plugin and have a user.
  if (user)
  {
    // grab the combo id in this slot.
    const comboId = this.getComboId();

    // check first if we have a valid combo id.
    if (comboId)
    {
      // nice find! return the combo id version of the skill instead.
      return user.skill(comboId);
    }

    // otherwise, return the target id.
    return user.skill(targetId);
  }

  // all else fails... just return the database data for the skill.
  return $dataSkills[targetId];
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
  
  return this.setSkillId(0);
};

/**
 * Gets whether or not this slot can be autocleared, such as from auto-upgrading
 * a skill or something.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeAutocleared = function()
{
  const noAutoclearSlots = [
    JABS_Button.Main,
    JABS_Button.Offhand,
    JABS_Button.Tool
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
JABS_SkillSlotManager.prototype.initialize = function(battler)
{
  // setup the properties of this class.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlotManager.prototype.initMembers = function()
{
  /**
   * All skill slots that a battler possesses.
   *
   * These are in a fixed order.
   * @type {JABS_SkillSlot[]}
   */
  this._slots = [];

  /**
   * A single flip that gets toggled when this class no longer requires a setup.
   * @type {boolean}
   * @private
   */
  this._setupComplete = false;
};

/**
 * Gets whether or not this skill slot manager has been setup yet.
 * @returns {boolean}
 */
JABS_SkillSlotManager.prototype.isSetupComplete = function()
{
  return this._setupComplete;
};

/**
 * Finalizes the initialization of this skill slot manager.
 * @param {Game_Actor|Game_Enemy} battler The battler being finalized.
 */
JABS_SkillSlotManager.prototype.completeSetup = function(battler)
{
  // flag it as setup.
  this._setupComplete = true;
};

/**
 * Sets up the slots for the given battler.
 * @param {Game_Actor|Game_Enemy} battler The battler to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupSlots = function(battler)
{
  // actors only get one setup!
  if (this.isSetupComplete() && battler.isActor()) return;

  // initialize the slots.
  this.initializeBattlerSlots();

  // either actor or enemy, no in between!
  switch (true)
  {
    case (battler.isActor()):
      console.log(`setting up: `, battler.name(), battler);
      this.setupActorSlots();
      break;
    case (battler.isEnemy()):
      this.setupEnemySlots(battler);
      break;
  }

  // flag the setup as complete.
  this.completeSetup(battler);
};

/**
 * Gets all skill slots, regardless of whether or not their are assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSlots = function()
{
  return this._slots;
};


JABS_SkillSlotManager.prototype.initializeBattlerSlots = function()
{
  // initialize the slots.
  this._slots = [];
};

/**
 * Setup the slots for an actor.
 * All actors have the same set of slots.
 */
JABS_SkillSlotManager.prototype.setupActorSlots = function()
{
  this._slots.push(new JABS_SkillSlot(JABS_Button.Main, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Offhand, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Tool, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Dodge, 0));

  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill1, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill2, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill3, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill4, 0));
};

/**
 * Setup slots for an enemy.
 * Each enemy can have varying slots.
 * @param {Game_Enemy} enemy The enemy to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupEnemySlots = function(enemy)
{
  const battlerData = enemy.databaseData();
  if (!battlerData)
  {
    console.warn('missing battler data.', enemy);
    return;
  }

  // filter out any "extend" skills as far as this collection is concerned.
  const filtering = action =>
  {
    // grab the skill from the database.
    const skill = enemy.skill(action.skillId);

    // determine if the skill is an extend skill or not.
    const isExtendSkill = skill.metadata('skillExtend');

    // filter out the extend skills.
    return !isExtendSkill;
  };

  // filter the skills.
  const skillIds = battlerData.actions
    .filter(filtering)
    .map(action => action.skillId);

  // grab the basic attack skill id as well.
  const basicAttackSkillId = enemy.basicAttackSkillId();

  // check to make sure we found one.
  if (basicAttackSkillId)
  {
    // add it to the list if we did.
    skillIds.push(basicAttackSkillId);
  }

  // iterate over each skill.
  skillIds.forEach(skillId =>
  {
    // grab the skill itself.
    const skill = enemy.skill(skillId);

    // calculate the cooldown key.
    const slotKey = JABS_AiManager.buildEnemyCooldownType(skill);

    // add the slot to the manager for this enemy.
    this.addSlot(slotKey, skillId);
  }, this);
};

/**
 * Flags all skillslots for needing visual refresh for the input frame.
 */
JABS_SkillSlotManager.prototype.flagAllSkillSlotsForRefresh = function()
{
  this._slots.forEach(slot => slot.flagSkillSlotForRefresh());
};

/**
 * Adds a slot with the given slot key and skill id.
 * If a slot with the same key already exists, no action will be taken.
 * @param {string} key The slot key.
 * @param {number} initialSkillId The skill id to set to this slot.
 */
JABS_SkillSlotManager.prototype.addSlot = function(key, initialSkillId)
{
  // check if the slot key already exists on the manager.
  const exists = this._slots.find(slot => slot.key === key);

  // if it exists, then don't re-add this slot.
  if (exists) return;

  // add the slot with the designated key and skill id.
  this._slots.push(new JABS_SkillSlot(key, initialSkillId));
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
  return this.getSkillSlotByKey(JABS_Button.Tool);
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getDodgeSlot = function()
{
  return this.getSkillSlotByKey(JABS_Button.Dodge);
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
    .filter(skillSlot => skillSlot.key !== JABS_Button.Tool);
};

/**
 * Gets a skill slot by its key.
 * @param {string} key The key to find the matching slot for.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSkillSlotByKey = function(key)
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
  this.getSkillSlotByKey(key)
    .setSkillId(skillId)
    .setLock(locked);
};

/**
 * Gets the combo id of the given skill slot.
 * @param {string} key The skill slot key.
 * @returns {number}
 */
JABS_SkillSlotManager.prototype.getSlotComboId = function(key)
{
  return this.getSkillSlotByKey(key)
    .getComboId();
};

/**
 * Sets the combo id of the given skill slot.
 * @param {string} key The new skill slot key.
 * @param {number} comboId The new combo skill id.
 */
JABS_SkillSlotManager.prototype.setSlotComboId = function(key, comboId)
{
  this.getSkillSlotByKey(key)
    .setComboId(comboId);
};

/**
 * Updates the cooldowns of all slots with a skill in them.
 */
JABS_SkillSlotManager.prototype.updateCooldowns = function()
{
  // this.getAllSlots() // use this if slots should update when there is no skill in them.
  this.getEquippedSlots()
    .forEach(slot => slot.updateCooldown());
};

JABS_SkillSlotManager.prototype.isAnyCooldownReadyForSlot = function(key)
{
  // shorthand the slot.
  const slot = this.getSkillSlotByKey(key);

  // shorthand the cooldown.
  const cooldown = slot.getCooldown();

  // whether or not the slot has a combo id available to it.
  const hasComboId = (slot.getComboId() !== 0);

  // check if the combo cooldown is flagged as ready.
  const comboCooldownReady = cooldown.isComboReady();

  // if we have both a combo id and a ready, we can use a combo.
  const isComboReady = hasComboId && comboCooldownReady;

  // if the base cooldown is ready, thats it- its ready.
  const isBaseReady = cooldown.isBaseReady();

  const isAnyReady = (isComboReady || isBaseReady);

  return isAnyReady;
};

/**
 * Clears and unlocks a skill slot by its key.
 * @param {string} key The key of the slot to clear.
 */
JABS_SkillSlotManager.prototype.clearSlot = function(key)
{
  this.getSkillSlotByKey(key).clear();
};

/**
 * Unlocks all slots owned by this actor.
 */
JABS_SkillSlotManager.prototype.unlockAllSlots = function(key)
{
  this.getAllSlots().forEach(slot => slot.unlock());
};
//#endregion JABS_SkillSlotManager

//#region JABS_TrackedState
/**
 * A class containing the tracked data for a particular state and battler.
 *
 * This class enables JABS to keep tabs on state durations as well as their effects.
 * Since most effects in-battle aren't directly replicatable on the map as easily,
 * this acts as an interface between the state and JABS, of which JABS owns.
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