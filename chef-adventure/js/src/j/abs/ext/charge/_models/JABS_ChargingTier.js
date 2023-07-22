//region JABS_ChargingTier
/**
 * A single charging tier derived from a skill in a slot to be charged.
 */
class JABS_ChargingTier
{
  //region properties
  /**
   * The number of frames that this tier has already been charged.
   * @type {number}
   */
  duration = 0;

  /**
   * The number of frames that this tier must be charged to be completed.
   * @type {number}
   */
  maxDuration = 0;

  /**
   * The tier number for this {@link JABS_ChargingTier}.
   * @type {number}
   */
  tier = 0;

  /**
   * The skill id that can be executed when this tier is charged.
   * @type {number}
   */
  skillId = 0;

  /**
   * Whether or not this tier has completed charging.
   * @type {boolean}
   */
  completed = false;

  /**
   * The animation id to be played while this tier is being charged.
   * If it is set to 0 or missing, no animation will be played.
   * @type {number}
   */
  whileChargingAnimationId = 0;

  /**
   * The animation id to be played when this tier has finished charging.
   * If it is set to 0 or missing, no animation will be played.
   * @type {number}
   */
  chargeTierCompleteAnimationId = 0;
  //endregion properties

  /**
   * Constructor.
   * @param {number} tier The number of tier this is.
   * @param {number} maxDuration The duration for this tier.
   * @param {number} skillId The skill to be executed on charge-up.
   * @param {number} whileChargingAnimationId The animation to be played while charging this skill.
   * @param {number} maxChargeReadyAnimationId The animation to be played when max charge is ready.
   */
  constructor(tier, maxDuration, skillId, whileChargingAnimationId, maxChargeReadyAnimationId)
  {
    this.maxDuration = maxDuration;
    this.tier = tier;
    this.skillId = skillId;
    this.whileChargingAnimationId = whileChargingAnimationId;
    this.chargeTierCompleteAnimationId = maxChargeReadyAnimationId;
  }

  /**
   * The default for a tier that is missing from a skill but needed to
   * fill the gaps between other tiers that were defined.
   * @param {number} fillerTier The tier number to be filled.
   * @returns {JABS_ChargingTier} The default filler tier.
   */
  static defaultTier(fillerTier = 1)
  {
    return new JABS_ChargingTier(fillerTier, 30, 0, 0, 0);
  }

  /**
   * Updates this charging tier.
   */
  update()
  {
    // check to make sure we're not completed yet.
    if (!this.completed)
    {
      // increment the duration by 1.
      this.duration++;

      // check if the duration has reached the max.
      if (this.duration >= this.maxDuration)
      {
        // flag this for completion.
        this.completed = true;

        // perform on-completion hook.
        this.onComplete();
      }
    }
  }

  /**
   * An event hook for when a tier has reached max charge.
   */
  onComplete()
  {
  }
}
//endregion JABS_ChargingTier