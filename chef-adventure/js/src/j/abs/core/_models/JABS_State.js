//region JABS_State
/**
 * A class for handling the state data in the context of JABS.
 */
class JABS_State
{
  //region properties
  /**
   * The list of rulesets available for how to handle reapplication of a state.
   */
  static reapplicationType = {
    /**
     * "Refresh" will refresh the duration of a state when reapplied.
     */
    Refresh: "refresh",

    /**
     * "Extend" will add the remaining duration onto the new duration when reapplied.
     */
    Extend: "extend",

    /**
     * "Stack" will add an additional stack of the state when reapplied.
     */
    Stack: "stack",
  }

  /**
   * The battler being afflicted with this state.
   * @type {Game_Battler}
   */
  battler = null;

  /**
   * The id of the state being tracked.
   * @type {number}
   */
  stateId = 0;

  /**
   * The icon index of the state being tracked (for visual purposes).
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The current duration of the state being tracked. Decrements over time.
   * @type {number}
   */
  duration = 0;

  /**
   * The base duration.
   * Used for reapplication and stacking purposes.
   * @type {number}
   */
  #baseDuration = 0;

  /**
   * The number of frames that defines "recently applied".
   * @type {number}
   */
  #recentlyAppliedCounter = 0;

  /**
   * Whether or not this tracked state is identified as `expired`.
   * Expired states do not apply to the battler, but are kept in the tracking collection
   * to grant the ability to refresh the state duration or whatever we choose to do.
   * @type {boolean}
   */
  expired = true;

  /**
   * The source that caused this state. Usually this is an opposing battler. If no source is specified,
   * then the afflicted battler is the source.
   * @type {Game_Battler}
   */
  source = null;

  /**
   * The number of stacks of this state applied to the tracker.
   * @type {number}
   */
  stackCount = 0;
  //endregion properties

  /**
   * Constructor.
   * @param {Game_Battler} battler The battler afflicted.
   * @param {number} stateId The id of the state being applied to the battler.
   * @param {number} iconIndex The icon index associated with the state.
   * @param {number} duration The duration in frames that this state will remain.
   * @param {number=} startingStacks The number of stacks to start out with; defaults to 1.
   * @param {Game_Battler=} source The battler who afflicted the state; defaults to self.
   */
  constructor(battler, stateId, iconIndex, duration, startingStacks = 1, source = battler)
  {
    // initialize the values of the tracker.
    this.battler = battler;
    this.stateId = stateId;
    this.iconIndex = iconIndex;
    this.duration = duration;
    this.stackCount = startingStacks;
    this.source = source;

    // mirror the duration as base duration for stacks.
    this.setBaseDuration(duration);
    this.refreshRecentlyAppliedCounter();

    // set the state to be active.
    this.expired = false;
  }

  /**
   * Updates the base duration to a new value.
   * @param {number} newBaseDuration The new base duration value.
   */
  setBaseDuration(newBaseDuration)
  {
    // updates the underlying base duration as well.
    this.#baseDuration = newBaseDuration;
  }

  /**
   * Determines whether or not the state should not expire by duration.
   * @returns {boolean} True if this state should last until removed, false otherwise.
   */
  hasEternalDuration()
  {
    // "forever" states are states that have no duration aka -1.
    if (this.#baseDuration !== -1) return false;

    // this state should never expire unless removed explicitly.
    return true;
  }

  /**
   * Refresh the recently applied counter.
   */
  refreshRecentlyAppliedCounter()
  {
    // reset the recently applied counter.
    this.#recentlyAppliedCounter = 6;
  }

  /**
   * The update loop for this tracked state.
   * Handles decrementing the counter and removing the state as applicable.
   */
  update()
  {
    // countdown the recently applied timer for this state.
    this.decrementRecentlyAppliedCounter();

    // countdown if there is still time left to be counted down.
    this.decrementCounter();

    // remove stacks as-needed.
    this.decrementStacks();

    // check if we can and should remove this state from the battler.
    if (this.canRemoveFromBattler() && this.shouldRemoveFromBattler())
    {
      // actually remove the state from the battler.
      this.removeFromBattler();
    }
  }

  /**
   * Decrements the duration as-needed.
   */
  decrementCounter()
  {
    // check if we still have time left on the clock.
    if (this.duration > 0)
    {
      // decrement the timer.
      this.duration--;
    }
  }

  /**
   * Decrements the recently applied counter as-needed.
   */
  decrementRecentlyAppliedCounter()
  {
    // check if we still have any counter left.
    if (this.#recentlyAppliedCounter > 0)
    {
      // decrement it as-needed.
      this.#recentlyAppliedCounter--;
    }
  }

  /**
   * Decrement the stack counter as-needed.
   */
  decrementStacks()
  {
    // check if we are at 0 duration and have stacks remaining.
    if (this.duration <= 0 && this.stackCount > 0 && !this.hasEternalDuration())
    {
      // decrement the stack counter.
      this.stackCount--;

      // check if we STILL have stacks remaining.
      if (this.stackCount > 0)
      {
        // reset the duration to the initial duration.
        this.refreshDuration();
      }
    }
  }

  /**
   * Refreshes the duration of the state based on its original duration.
   * This does not refresh the recently applied counter.
   */
  refreshDuration(newDuration = this.#baseDuration)
  {
    // refresh the duration.
    this.duration = newDuration;

    // unexpire the tracker.
    this.expired = false;

    // flag this as recently applied.
    this.#recentlyAppliedCounter = 6;
  }

  /**
   * Increments the stack counter as high as the limit allows.
   * @param {number} stackIncrease The number of stacks to increase; defaults to 1.
   */
  incrementStacks(stackIncrease = 1)
  {
    // grab the max number of stacks for this state.
    // TODO: get this from the state data.
    const maxStacks = 5;

    // check if we still have room to add more stacks.
    if (this.stackCount < maxStacks)
    {
      // project the new stack count.
      const projectedStackCount = this.stackCount + stackIncrease;

      // increment the stack counter within threshold.
      this.stackCount = Math.min(maxStacks, projectedStackCount);
    }
  }

  /**
   * Removes this tracked state from the afflicted battler.
   */
  removeFromBattler()
  {
    // actually remove the state from the battler.
    this.battler.removeState(this.stateId);

    // expire it, too.
    this.expired = true;
  }

  /**
   * Determine if removing this state is even possible.
   * @returns {boolean} True if it is removable, false otherwise.
   */
  canRemoveFromBattler()
  {
    // if the state afflicted is death, we can't remove it.
    if (this.canHoldBecauseStateType()) return false;

    // if the battler isn't afflicted with it, we can't remove it.
    if (!this.battler.isStateAffected(this.stateId)) return false;

    // its removable.
    return true;
  }

  /**
   * Determines whether or not this state should be removed because of its type.
   * @returns {boolean}
   */
  canHoldBecauseStateType()
  {
    // if the state afflicted is death, we can't remove it.
    if (this.stateId === this.battler.deathStateId()) return true;

    // nothing is holding this state relating to its type of state.
    return false;
  }

  /**
   * Determines whether or not we should remove this state from the battler.
   * @returns {boolean} True if it should be removed, false otherwise.
   */
  shouldRemoveFromBattler()
  {
    // if there are any stacks remaining, the stacks should be decremented first.
    if (this.stackCount > 0) return false;

    // if there is still time on the clock, we shouldn't remove it.
    if (!this.shouldRemoveByDuration()) return false;

    // purge it!
    return true;
  }

  /**
   * Determines whether or not this state should be removed because of its duration.
   * @returns {boolean} True if the state should be removed, false otherwise.
   */
  shouldRemoveByDuration()
  {
    // if there is still time on the clock, we shouldn't remove it.
    if (this.duration > 0) return false;

    // if there is no time because it is an eternal state, we shouldn't remove it.
    if (this.duration <= 0 && this.hasEternalDuration()) return false;

    // time is up!
    return true;
  }

  /**
   * Determines whether or not this state is about to expire.
   * @returns {boolean} True if it is about to expire, false otherwise.
   */
  isAboutToExpire()
  {
    // define the threshold for when a state is "about to expire".
    const aboutToExpireThreshold = Math.round(this.#baseDuration / 5);

    // return whether or not the current duration is less than that.
    return (this.duration <= aboutToExpireThreshold && !this.hasEternalDuration());
  }

  /**
   * Determines whether or not this state was recently applied.
   * @returns {boolean} True if it was recently applied, false otherwise.
   */
  wasRecentlyApplied()
  {
    // return whether or not this state has been recently applied.
    return (this.#recentlyAppliedCounter > 0);
  }
}
//endregion JABS_State