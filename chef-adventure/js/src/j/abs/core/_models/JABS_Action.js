//region JABS_Action
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

    /**
     * Whether or not this action has collided with at least one target.
     * @type {boolean}
     */
    this._hitAtLeastOne = false;

    this.initMembers();
  }

  /**
   * Initializes all properties on this class.
   */
  initMembers()
  {
    // initialize core functionality data.
    this.initVisuals();

    // initialize duration and expiration related data.
    this.initDuration();

    // initialize delay-related data.
    this.initDelay();

    // initialize piercing-related data.
    this.initPiercing();
  }

  initVisuals()
  {
    /**
     * The `Game_Event` this `JABS_Action` is bound to. Represents the visual aspect on the map.
     * @type {Game_Event}
     */
    this._actionSprite = null;

    /**
     * The animation id to be performed on the action itself upon execution.
     * @type {number}
     */
    this._selfAnimationId = this._baseSkill.jabsSelfAnimationId ?? 0;
  }

  initDuration()
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
  }

  initDelay()
  {
    /**
     * A grouping of all properties related to the delay of this action.
     */
    this._delay = {};

    /**
     * The duration remaining before this will action will autotrigger.
     * @type {JABS_Timer}
     */
    this._delay._delayDuration = new JABS_Timer(this._baseSkill.jabsDelayDuration ?? 0);

    /**
     * Whether or not this action will trigger when an enemy touches it.
     * @type {boolean}
     */
    this._delay._triggerOnTouch = this._baseSkill.jabsDelayTriggerByTouch ?? false;
  }

  initPiercing()
  {
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
     * @type {JABS_Timer}
     */
    this._pierceDelay = new JABS_Timer(this._basePierceDelay);

    this._pierceDelay.setCurrentTime(this._pierceDelay.getMaxTime() - 1);
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
    const isBasicAttack = [JABS_Button.Mainhand, JABS_Button.Offhand].includes(this.getCooldownType());
    pierceCount += this._caster.getAdditionalHits(this._baseSkill, isBasicAttack);

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
      event?.requestAnimation(this.getSelfAnimationId());
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
    this.getActionSprite()?.requestAnimation(this.getSelfAnimationId());
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
    // grab the caster's uuid.
    const uuid = this._caster.getUuid();

    // determine the real caster, but fallback to the designated caster.
    const caster = JABS_AiManager.getBattlerByUuid(uuid) ?? this._caster;

    // return the result.
    return caster;
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
   * Gets the duration in frames that this action has persisted on the map.
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
    this._delay._delayDuration.update();
  }

  /**
   * Gets whether or not the delay on this action has completed.
   *
   * This also includes if an action never had a delay to begin with.
   * @returns {boolean}
   */
  isDelayCompleted()
  {
    // if we triggered the action, we aren't delaying anymore.
    if (this.hasHitAtLeastOneTarget()) return true;

    // check if the delay has completed.
    const isTimerComplete = this._delay._delayDuration.isTimerComplete();

    // check if this action will delay until triggered.
    const willWaitEndlessly = this.isEndlessDelay();

    // if the timer is done and we're not waiting forever, the delay is completed.
    const isDelayComplete = (isTimerComplete && !willWaitEndlessly);

    // return our determination.
    return isDelayComplete;
  }

  /**
   * Automatically finishes the delay regardless of its current status.
   */
  endDelay()
  {
    this._delay._delayDuration.forceComplete();
  }

  /**
   * Gets whether or not this action will be delayed until triggered.
   * @returns {boolean}
   */
  isEndlessDelay()
  {
    return this._delay._delayDuration.getMaxTime() === -1;
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
    return this._delay._triggerOnTouch || this.isEndlessDelay();
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
   * Reduces the pierce times count of this action by 1.
   *
   * If an action reaches zero or less, then it also sets it up for removal.
   * @param {number=} decrement The amount to reduce the pierce times count by; defaults to 1.
   */
  decrementPierceTimes(decrement = 1)
  {
    // reduce pierce
    this._pierceTimesLeft -= decrement;
    if (this._pierceTimesLeft <= 0)
    {
      this.setNeedsRemoval();
    }
  }

  /**
   * Determines whether or not this action is ready to pierce another target.
   * @return {boolean} True if the timer for pierce delay is completed, false otherwise.
   */
  isPierceReady()
  {
    return this._pierceDelay.isTimerComplete();
  }

  /**
   * Counts down the pierce delay timer for this action.
   */
  countdownPierceDelay()
  {
    this._pierceDelay.update();
  }

  /**
   * Resets the pierce delay timer for this action.
   */
  resetPierceDelay()
  {
    this._pierceDelay.reset();
  }

  //region update
  /**
   * The overarching update logic for the action.
   */
  update()
  {
    // handle the updates before the main updates.
    this.preUpdate();

    // handle the main updating for the action.
    this.mainUpdate();

    // handle the updates after the main updates.
    this.postUpdate();
  }

  /**
   * An event hook for logic to perform before the main update of an action.
   * This includes by default the countdown for delayed activation of actions.
   */
  preUpdate()
  {
    // decrement the delay timer prior to action countdown.
    this.countdownDelay();
  }

  /**
   * The main update logic for an action.
   * this includes handling the delay countdown, cleanup, the piercing, and collision.
   */
  mainUpdate()
  {
    // if we're still delaying and not triggering by touch...
    if (!this.canMainUpdate()) return;

    // if the delay is completed, decrement the action timer.
    if (this.isDelayCompleted())
    {
      // countdown the overall duration timer of this action.
      this.countdownDuration();
    }

    // if the duration of the action expires, remove it.
    if (this.isReadyForCleanup())
    {
      // execute this action's cleanup.
      this.cleanup();

      // stop processing the action.
      return;
    }

    // check if this action is ready to pierce another target.
    if (!this.isPierceReady())
    {
      // countdown the pierce timer if not ready.
      this.countdownPierceDelay();

      // stop processing the action.
      return;
    }

    // determine targets that this action collided with.
    this.processCollision();
  }

  /**
   * Determines whether or not it is valid to perform the main update of the action.
   * @returns {boolean} True if the action should update, false otherwise.
   */
  canMainUpdate()
  {
    // if the event is a trigger action using delay, but hasn't completed, do not update.
    if (!this.triggerOnTouch() && !this.isDelayCompleted()) return false;

    // update.
    return true;
  }

  /**
   * Determines whether or not to cleanup the action.
   * @returns {boolean} True if the action should be cleaned up, false otherwise.
   */
  isReadyForCleanup()
  {
    // if we haven't at least passed the minimum duration, then do not cleanup.
    if (this.getDuration() < JABS_Action.getMinimumDuration()) return false;

    // if the action is expired, then cleanup.
    if (this.isActionExpired()) return true;

    // if the action has run out of piercing hits, then cleanup.
    if (this.getPiercingTimes() <= 0) return true;

    // not ready for cleanup.
    return false;
  }

  /**
   * Cleans up this action and removes it from tracking if applicable.
   */
  cleanup()
  {
    // execute the action's pre-cleanup logic.
    this.preCleanupHook();

    // flag the action for removal.
    this.setNeedsRemoval();

    // clear out stale action events.
    $jabsEngine.clearActionEvents();
  }

  /**
   * Handles collision in the context of this action against in-range battlers.
   */
  processCollision()
  {
    // grab all available collision targets.
    const collisionTargets = $jabsEngine.getCollisionTargets(this);

    // check if we have any collision targets.
    if (collisionTargets.length === 0) return;

    // apply the battle effects of the action against each target.
    collisionTargets.forEach(target => $jabsEngine.applyPrimaryBattleEffects(this, target), this);

    // perform post-collision action things.
    this.onCollision();
  }

  /**
   * An event hook fired when this action collides with a target.
   */
  onCollision()
  {
    // end the delay if there was one.
    this.endDelay();

    // reset the pierce delay back to default.
    this.resetPierceDelay();

    // reduce the pierce counts by one.
    this.decrementPierceTimes();

    // check if this action has hit at least one target.
    if (!this.hasHitAtLeastOneTarget())
    {
      // execute first-hit logic.
      this.onFirstCollision();
    }
  }

  /**
   * An event hook fired when this action collides with its first target.
   */
  onFirstCollision()
  {
    // flag our first hit so we don't do this again.
    this._hitAtLeastOne = true;
  }

  /**
   * An event hook for logic to perform after the main update of an action.
   */
  postUpdate()
  {
  }
  //endregion update

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
    return this.getBaseSkill().jabsRadius;
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
    return this.getBaseSkill().jabsProximity ?? 0;
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

  /**
   * Whether or not this action has hit at least one target.
   * @returns {boolean}
   */
  hasHitAtLeastOneTarget()
  {
    return this._hitAtLeastOne;
  }
}
//endregion JABS_Action