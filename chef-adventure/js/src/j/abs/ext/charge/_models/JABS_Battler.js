//region JABS_Battler
/**
 * Extends {@link JABS_Battler.initBattleInfo}.
 * Also initializes the charge-related data.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_Battler.set('initBattleInfo', JABS_Battler.prototype.initBattleInfo);
JABS_Battler.prototype.initBattleInfo = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_Battler.get('initBattleInfo').call(this);

  // initialize the charge-related members.
  this.initChargeData();
};

/**
 * Initialize the properties associated with charging skills.
 */
JABS_Battler.prototype.initChargeData = function()
{
  /**
   * Whether or not this battler is charging up a skill for use.
   * @type {boolean}
   */
  this._charging = false;

  /**
   * The slot associated with the current charging.
   * @type {null|string}
   */
  this._chargeSlot = null;

  /**
   * The tiers of charging that are currently being managed.
   * @type {JABS_ChargingTier[]}
   */
  this._chargingTiers = [];
};

//region property getter setter
/**
 * Gets whether or not this battler is charging a skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isCharging = function()
{
  return this._charging;
};

/**
 * Begins the charging process.
 */
JABS_Battler.prototype.beginCharging = function()
{
  this._charging = true;
};

/**
 * Stops the charging process.
 */
JABS_Battler.prototype.stopCharging = function()
{
  this._charging = false;
};

/**
 * Gets the slot that is currently being charged.
 * @returns {string|null} The slot being charged, or `null` if nothing is being charged.
 */
JABS_Battler.prototype.getChargingSlot = function()
{
  return this._chargeSlot;
};

/**
 * Gets the charging tier data for the current slot.
 * @returns {JABS_ChargingTier[]}
 */
JABS_Battler.prototype.getChargingTierData = function()
{
  return this._chargingTiers;
};

/**
 * Whether or not charging tier data exists for this charge.
 * @returns {boolean} True if it exists, false otherwise.
 */
JABS_Battler.prototype.hasChargingTierData = function()
{
  return this._chargingTiers.length > 0;
};

/**
 * Sets the charging tier data to the given data.
 * @param {JABS_ChargingTier[]} tiers The new tier data.
 */
JABS_Battler.prototype.setChargingTierData = function(tiers)
{
  this._chargingTiers = tiers;
};

/**
 * Gets the current charging tier to be charged.
 * Returns `null` if there is no charging data, or all tiers are fully charged.
 * @returns {null|JABS_ChargingTier}
 */
JABS_Battler.prototype.getCurrentChargingTier = function()
{
  // grab all the tiers.
  const tiers = this.getChargingTierData();

  // if we have no tiers, there is no current charging tier.
  if (!tiers.length)
  {
    // we have no current tier.
    return null;
  }

  // sort out the charge tiers.
  const sortedFilteredTiers = tiers
    // filter out the already-completed tiers.
    .filter(chargeTier => !chargeTier.completed)
    // sort them from lowest to highest by tier.
    .sort((chargeTierLeft, chargeTierRight) => chargeTierLeft.tier - chargeTierRight.tier);

  // if we have none left after sorting and filtering, then null it is.
  if (!sortedFilteredTiers.length) return null;

  // grab the first, which should be lowest, charging tier available.
  const [currentTier,] = sortedFilteredTiers;

  // return the current tier.
  return currentTier;
};

/**
 * Gets the highest completed charging tier.
 * Returns `null` if there is no charging data, or no tiers are fully charged.
 * @returns {null|JABS_ChargingTier}
 */
JABS_Battler.prototype.getHighestChargedTier = function()
{
  // grab all the tiers.
  const tiers = this.getChargingTierData();

  // if we have no tiers, there is no highest charged tier.
  if (!tiers.length)
  {
    // we have no charged tier.
    return null;
  }

  // sort out the charge tiers.
  const sortedFilteredtiers = tiers
    // filter out the incomplete tiers.
    .filter(chargeTier => chargeTier.completed)
    // sort them from highest to lowest by tier. (reversed from getting the current charge tier!)
    .sort((chargeTierLeft, chargeTierRight) => chargeTierRight.tier - chargeTierLeft.tier);

  // if we have none left after sorting and filtering, then null it is.
  if (!sortedFilteredTiers.length) return null;

  // grab the first, which should be highest, completed charge tier.
  const [highestChargedTier,] = sortedFilteredtiers;

  // return the highest charged tier.
  return highestChargedTier;
};

/**
 * Gets the highest completed charging tier that contains a skill id.
 * Returns `null` if there is no charging data, or no tiers are fully charged with skill ids.
 * @returns {null|JABS_ChargingTier}
 */
JABS_Battler.prototype.getHighestChargedTierWithSkillId = function()
{
  // grab all the tiers.
  const tiers = this.getChargingTierData();

  // if we have no tiers, there is no highest charged tier.
  if (!tiers.length)
  {
    // we have no charged tier.
    return null;
  }

  // sort out the charge tiers.
  const sortedFilteredTiers = tiers
    // filter out the incomplete tiers.
    .filter(chargeTier => chargeTier.completed)
    // filter out the charge tiers with no skill id associated with them.
    .filter(chargeTier => chargeTier.skillId)
    // sort them from highest to lowest by tier. (reversed from getting the current charge tier!)
    .sort((chargeTierLeft, chargeTierRight) => chargeTierRight.tier - chargeTierLeft.tier);

  // if we have none left after sorting and filtering, then null it is.
  if (!sortedFilteredTiers.length) return null;

  // grab the first, which should be highest, completed charge tier.
  const [highestChargedTier,] = sortedFilteredTiers;

  // return the highest charged tier.
  return highestChargedTier;

};

/**
 * Sets the slot that is currently being charged.
 * @param {string} slot The slot being charged.
 */
JABS_Battler.prototype.setChargingSlot = function(slot)
{
  this._chargeSlot = slot;
};
//endregion property getter setter

/**
 * Resets all charge-related data back to default values.
 */
JABS_Battler.prototype.resetChargeData = function()
{
  // remove the set charging slot.
  this.setChargingSlot(null);

  // remove the charging tier data.
  this.setChargingTierData([]);

  // stop charging.
  this.stopCharging();
};

/**
 * Handles the charging of a given action.
 * @param {string} slot The slot being charged.
 * @param {boolean} charging Whether or not the slot is being charged.
 */
JABS_Battler.prototype.executeChargeAction = function(slot, charging)
{
  if (!this.canChargeSlot(slot)) return;

  // get whether or not we're currently charging some action.
  const isCurrentlyCharging = this.isCharging();

  // grab the current slot being charged.
  const currentSlot = this.getChargingSlot();

  // determine if the slot currently being charged is the same as the requested.
  const isDifferentSlot = (slot !== currentSlot);

  // check if we're charging now, but another slot is trying to undo this charge.
  if (isCurrentlyCharging && (!charging && isDifferentSlot))
  {
    // ignore other slots cancelling this slot's charge effort.
    return;
  }

  // determine if the slot currently being charged is the same as the requested.
  const isSameSlot = (slot === currentSlot);

  // check if we're done charging.
  if ((!charging && isCurrentlyCharging))
  {
    // stop charging.
    this.endCharging();

    // do not process.
    return;
  }

  // if we aren't charging, and weren't charging, don't do anything.
  if (!charging) return;

  // shorthand for still charging.
  const isStillCharging = isCurrentlyCharging && isSameSlot;

  // make no changes to battler charging.
  if (isStillCharging) return;

  // shorthand for switching slots to charge, aka restarting.
  const isSwitchingChargingSlot = isStillCharging && !isSameSlot;

  // check if we're trying to switch slots to charge.
  if (isSwitchingChargingSlot)
  {
    // stop charging.
    this.endCharging();

    // stop processing.
    return;
  }

  // shorthand for starting to charge anew.
  const isChargingAnew = !isStillCharging && charging;

  // start charging a new skill.
  if (isChargingAnew)
  {
    // get the charging tiers.
    const chargingTiers = this.getChargingTiers(slot);

    // do nothing if we have no tiers to charge.
    if (!chargingTiers) return;

    // setup the charging.
    this.setupCharging(slot, chargingTiers);
  }
};

/**
 * Determines whether or not the given slot can be charged.
 * @param {string} slot The slot to potentially be charged.
 * @returns {boolean} True if it can be charged, false otherwise.
 */
JABS_Battler.prototype.canChargeSlot = function(slot)
{
  // if there is no slot provided, do not charge.
  if (!slot) return false;

  // shorthand the skill slot.
  const skillSlot = this
    .getBattler()
    .getSkillSlotManager()
    .getSkillSlotByKey(slot);

  // if there is no actual slot for the key, we cannot charge.
  if (!skillSlot) return false;

  // cannot charge slots with skills you do not know.
  if (!this.getBattler().hasSkill(skillSlot.id)) return false;

  // we can charge this slot!
  return true;
};

/**
 *
 * @param {string} slot The slot to be charged.
 * @param {JABS_ChargingTier[]} chargingTiers The charging tier data.
 */
JABS_Battler.prototype.setupCharging = function(slot, chargingTiers)
{
  // battlers cannot setup charging if already charging.
  if (this.isCharging()) return;

  // assign the charging slot.
  this.setChargingSlot(slot);

  // add the charging tier data.
  this.setChargingTierData(chargingTiers);

  // start charging.
  this.beginCharging();
};

/**
 * Ends the charging for this battler, releasing the charged skill.
 */
JABS_Battler.prototype.endCharging = function()
{
  // check if can release charged skill.
  this.releaseHighestChargedSkill();

  // reset the charge data when we're done.
  this.resetChargeData();
};

/**
 * Releases the highest charged skill available.
 */
JABS_Battler.prototype.releaseHighestChargedSkill = function()
{
  // determine the highest charged tier with a skill.
  const highestChargedTier = this.getHighestChargedTierWithSkillId();

  // if we have no charged tiers, then do nothing.
  if (!highestChargedTier) return;

  // extract the skill id from the highest charged tier.
  const { skillId } = highestChargedTier;

  // if we cannot release the charged skill, then do nothing.
  if (!this.canReleaseChargedSkill(skillId)) return;

  // setup the actions.
  const actions = this.createJabsActionFromSkill(skillId);

  // push this action into the queue.
  this.setDecidedAction(actions);

  // set the cast time for this battler to the primary skill in the list.
  this.setCastCountdown(actions[0].getCastTime());
};

/**
 * Determines whether or not the battler can actually execute the skill to be released.
 * @param {number} skillId The id of the skill to be released.
 * @returns {boolean} True if we can release the skill, false otherwise.
 */
JABS_Battler.prototype.canReleaseChargedSkill = function(skillId)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // check to make sure we actually know the skill, too.
  if (!battler.hasSkill(skillId)) return false;

  // determine the skill.
  const skill = battler.skill(skillId);

  // if we cannot execute the skill, then do nothing.
  if (!battler.meetsSkillConditions(skill)) return false;

  // we can release!
  return true;
}

/**
 * Extracts the charging tier data out of the skill in the given slot.
 * @param {string} slot The slot to extract charging data out of.
 * @returns {JABS_ChargingTier[]|null} The charging data if it existed, `null` otherwise.
 */
JABS_Battler.prototype.getChargingTiers = function(slot)
{
  // grab the underlying battler.
  const battler = this.getBattler();

  // start with a default of 0.
  let skillId = 0;

  // check if we have a
  if (this.getLastUsedSkillId())
  {
    // get the skill from the slot.
    skillId = this.getLastUsedSkillId();
  }
  else
  {
    // get the skill from the slot.
    skillId = battler.getEquippedSkillId(slot);
  }

  // if there is no skill id, then we cannot get any charge data from it.
  if (!skillId) return null;

  // determine the battler's interpretation of the skill.
  const skill = battler.skill(skillId);

  // extract the charging tier data out of the skill.
  const chargingTierData = skill.jabsChargeData;

  // if we have no charging data on the skills, then we cannot get any charge data from it.
  if (!chargingTierData || !chargingTierData.length) return null;

  // convert the raw data into a charging tier.
  const convertedData = chargingTierData.map(tierData =>
  {
    // destruct the tier data.
    const [
      chargeTier,
      maxDuration,
      chargeSkillId,
      whileChargingAnimationId,
      chargeTierCompleteAnimationId,
    ] = tierData;

    // return a compiled charging tier; note default animationId.
    return new JABS_ChargingTier(
      chargeTier,
      maxDuration,
      chargeSkillId,
      whileChargingAnimationId ?? 0,
      chargeTierCompleteAnimationId ?? 0
    );
  });

  // get the normalized data.
  const normalizedData = this.normalizeChargeTierData(convertedData);

  // return what was found.
  return normalizedData;
};

/**
 * Normalizes the charge tier data, accommodating for missing tiers between defined tiers.
 * @param {JABS_ChargingTier[]} chargeTierData The current state of charging data.
 * @returns {JABS_ChargingTier[]} The normalized and complete list of charging tiers.
 */
JABS_Battler.prototype.normalizeChargeTierData = function(chargeTierData)
{
  const sortedTiers = chargeTierData
    // sort them from lowest to highest by tier.
    .sort((chargeTierLeft, chargeTierRight) => chargeTierLeft.tier - chargeTierRight.tier);

  // grab the first tier.
  const [firstTier] = sortedTiers;

  // check if the first tier is actually tier 1.
  if (firstTier.tier !== 1)
  {
    // it was not- add a filler for tier 1.
    sortedTiers.unshift(JABS_ChargingTier.defaultTier(1));
  }

  // iterate over and normalize the list of tiers.
  for (let index = 0; index < sortedTiers.length; index++)
  {
    // skip the first item, we already ensured that was OK.
    if (index === 0) continue;

    // grab the current item in the list.
    const currentTier = sortedTiers.at(index);

    // grab the previous item in the list.
    const previousTier = sortedTiers.at(index-1);

    // the calculation of the expected tier.
    const expectedTier = previousTier.tier + 1;

    // check if the current tier is what we expect.
    if (currentTier.tier !== expectedTier)
    {
      // it was not- make some filler.
      const filler = JABS_ChargingTier.defaultTier(expectedTier);

      // splice in the filler at the correct index.
      sortedTiers.splice(index, 0, filler);
    }
  }

  // return our normalized and sorted tiers.
  return sortedTiers;
};

/**
 * Extends {@link JABS_Battler.update}.
 * Also updates charging as-needed.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_Battler.set('update', JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_Battler.get('update').call(this);

  // also update charging.
  this.updateCharging();
};

/**
 * Updates the charging for this battler.
 */
JABS_Battler.prototype.updateCharging = function()
{
  // if we cannot update charging, then do not.
  if (!this.canUpdateCharging()) return;

  // grab the current tier of charging.
  const currentTier = this.getCurrentChargingTier();

  // perform the pre-update charging hook.
  this.preUpdateCharging(currentTier);

  // update the current charging tier.
  currentTier.update();

  // perform the post-update charging hook.
  this.postUpdateCharging(currentTier);
};

/**
 * Determines whether or not charging can be updated.
 * @returns {boolean} True if we can update charging, false otherwise.
 */
JABS_Battler.prototype.canUpdateCharging = function()
{
  // cannot update charging if not charging.
  if (!this.isCharging()) return false;

  // we cannot update charging if we have nothing to charge.
  if (!this.getCurrentChargingTier()) return false;

  // we can charge!
  return true;
};

/**
 * Processes the pre-update charging effects.
 * This defines
 * @param {JABS_ChargingTier} currentTier The current tier about to be charged.
 */
JABS_Battler.prototype.preUpdateCharging = function(currentTier)
{
  // check if we can show the while-charging animation.
  if (this.canShowPreChargingAnimation(currentTier))
  {
    // grab the [default] animation id.
    const animationId = currentTier.whileChargingAnimationId === 0
      ? J.ABS.EXT.CHARGE.Metadata.DefaultChargingAnimationId
      : currentTier.whileChargingAnimationId;

    // play an animation.
    this.showAnimation(animationId);
  }
};

/**
 * Determines whether or not to show the charging animation.
 * @param {JABS_ChargingTier} currentTier The current tier about to be charged.
 */
JABS_Battler.prototype.canShowPreChargingAnimation = function(currentTier)
{
  // check whether or not we have an animation id to play.
  const hasNoAnimationId = currentTier.whileChargingAnimationId === 0;

  // check if we set a default animation id to play.
  const usingDefault = J.ABS.EXT.CHARGE.Metadata.DefaultChargingAnimationId !== 0;

  // if we have no animation id nor default, then we cannot show animations.
  if (hasNoAnimationId && !usingDefault) return false;

  // we play roughly once per second while charging.
  if (currentTier.duration % 15 !== 0) return false;

  // show the animation!
  return true;
};

/**
 * Processes the post-update charging effects.
 * This defines the hooks for on-max charge and the like.
 * @param {JABS_ChargingTier} currentTier The most recent charging tier that was updated.
 */
JABS_Battler.prototype.postUpdateCharging = function(currentTier)
{
  // grab the newly updated tier.
  const afterUpdateTier = this.getCurrentChargingTier();

  // if all tiers are completed, then we celebrate!
  if (!afterUpdateTier)
  {
    // process the on-max-charge event hook.
    this.onMaxCharge(currentTier);

    // don't continue processing!
    return;
  }

  // check if we are still on the same charging tier.
  if (!currentTier.completed)
  {
    // stop processing because still charging.
    return;
  }

  // they must be two separate charging tiers, we charged a tier!
  if (currentTier.tier < afterUpdateTier.tier)
  {
    // process the on-charge-tier-complete event hook.
    this.onChargeTierComplete(currentTier, afterUpdateTier);
  }
};

/**
 * Determines whether or not to show the charging animation.
 * @param {JABS_ChargingTier} currentTier The current tier about to be charged.
 */
JABS_Battler.prototype.canShowTierCompletionAnimation = function(currentTier)
{
  // check whether or not we have an animation id to play.
  const hasNoAnimationId = currentTier.chargeTierCompleteAnimationId === 0;

  // check if we set a default animation id to play.
  const usingDefault = J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId !== 0;

  // if we have no animation id nor default, then we cannot show animations.
  if (hasNoAnimationId && !usingDefault) return false;

  // show the animation!
  return true;
};

/**
 * Processes the max charge ready effects.
 * Either this or {@link JABS_Battler.onChargeTierComplete} will execute, not both.
 * @param {JABS_ChargingTier} finalChargeTier The last tier that completed charging.
 */
JABS_Battler.prototype.onMaxCharge = function(finalChargeTier)
{
  // shorthand our various conditions for playing/showing things.
  const canShowAnimation = this.canShowTierCompletionAnimation(finalChargeTier);
  const canPlaySE = J.ABS.EXT.CHARGE.Metadata.UseTierCompleteSE;
  const canPlaySEwithAnimation = canPlaySE && J.ABS.EXT.CHARGE.Metadata.AllowTierCompleteSEandAnimation;

  // grab the [default] animation id.
  const animationId = finalChargeTier.chargeTierCompleteAnimationId === 0
    ? J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId
    : finalChargeTier.chargeTierCompleteAnimationId;

  // check if we can show the animation.
  if (canShowAnimation)
  {

    // show the animation.
    this.showAnimation(animationId);

    // check if we should also play the SE.
    if (canPlaySEwithAnimation)
    {
      // play a sound effect!
      SoundManager.playMaxChargeReadySE();
    }
  }
  // we can't play the animation, but check if we can at least play the SE.
  else if (canPlaySE)
  {
    // play a sound effect!
    SoundManager.playMaxChargeReadySE();
  }
};

/**
 * Processes the charge tier complete effects.
 * Either this or {@link JABS_Battler.onMaxCharge} will execute, not both.
 * @param {JABS_ChargingTier} completedChargeTier The most recent charging tier completed.
 * @param {JABS_ChargingTier} nextChargeTier The next charging tier.
 */
JABS_Battler.prototype.onChargeTierComplete = function(completedChargeTier, nextChargeTier)
{
  // shorthand our various conditions for playing/showing things.
  const canShowAnimation = this.canShowTierCompletionAnimation(completedChargeTier);
  const canPlaySE = J.ABS.EXT.CHARGE.Metadata.UseTierCompleteSE;
  const canPlaySEwithAnimation = canPlaySE && J.ABS.EXT.CHARGE.Metadata.AllowTierCompleteSEandAnimation;

  // grab the [default] animation id.
  const animationId = completedChargeTier.chargeTierCompleteAnimationId === 0
    ? J.ABS.EXT.CHARGE.Metadata.DefaultTierCompleteAnimationId
    : completedChargeTier.chargeTierCompleteAnimationId;

  // check if we can show the animation.
  if (canShowAnimation)
  {
    // show the animation.
    this.showAnimation(animationId);

    // check if we should also play the SE.
    if (canPlaySEwithAnimation)
    {
      // play a sound effect!
      SoundManager.playChargeTierCompleteSE();
    }
  }
  // we can't play the animation, but check if we can at least play the SE.
  else if (canPlaySE)
  {
    // play a sound effect!
    SoundManager.playChargeTierCompleteSE();
  }
};
//endregion JABS_Battler