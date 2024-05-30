//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CHARGE] Enable skills to be charged to perform other skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the ability to charge certain skills by holding down
 * the input associated with the skill slot.
 *
 * This plugin requires JABS.
 * This plugin has minimal plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Actors can now "charge up" their skills to configurable degrees based on
 * the tags applied to the skills in question. This concept is basically a
 * JABS version of what Link can do when you charge up his sword to swing it
 * all around, instead of just swinging it by mashing the button.
 *
 * The functionality is defined by "charging tiers", which include data points
 * such as:
 * - how long to charge this tier.
 * - what skill will be executed if released when this tier is charged.
 * - the tier number of this tier.
 *
 * A skill can have multiple tiers of charging to represent the ability to
 * have different releasable abilities depending on how long you charge.
 * ----------------------------------------------------------------------------
 * LIMITATIONS:
 * While the reference above makes it sound like ANY skill can be charged, that
 * is only partially true. ANY skill can be charged, as long as it meets a few
 * criteria.
 *
 *  - It has to be one of the chargable skill slots.
 * Skill slots you CAN charge:
 *  - mainhand slot
 *  - offhand slot
 *  - combat skill 1 slot
 *  - combat skill 2 slot
 *  - combat skill 3 slot
 *  - combat skill 4 slot
 *
 * Skill slots you CANNOT charge:
 *  - dodge slot
 *  - item/tool slot
 *
 * - it has to be a valid chargable skill.
 * Skill situations that are not valid chargable skills:
 *  - tools cannot be charged, even if they have charge tier data.
 *  - guard skills cannot be charged, even if they have charge tier data.
 *
 * - the battler must know the skill somehow.
 * ============================================================================
 * CHARGING TIERS:
 * Have you ever wanted your player to be able to "charge" skills? Well now
 * you can! By applying the appropriate tags to skills, you can allow the
 * player to hold down a skill slot's input to "charge" up the skill!
 *
 * NOTE1:
 * To understand some of the nuances, do be sure to read the next section
 * below that describes in greater detail how the charging tiers work.
 *
 * NOTE2:
 * The two optional tags in the tag format below can be made uniform by
 * instead adjusting the configuration in the plugin parameters.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <chargeTier:[TIER,DURATION,RELEASED_SKILL,CHARGE_ANIM?,DONE_ANIM?]>
 * Where TIER represents the number of charge tier this defines.
 * Where DURATION is how long in frames the button must be held to charge.
 * Where RELEASED_SKILL is the skill to execute when released after charging.
 * Where CHARGE_ANIM? is the animation to play while charging (optional).
 * Where DONE_ANIM? is the animation to play when done charging (optional).
 *
 * EXAMPLE:
 *  <chargeTier:[1,30,175]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. When fully charged and released, it will
 * execute the skill of id 175.
 *
 *  <chargeTier:[1,30,175,10]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. When fully charged and released, it will execute the
 * skill of id 175.
 *
 *  <chargeTier:[1,30,175,10,25]>
 * The player can charge this skill up 1 tier by holding down the input for
 * this skill slot for 30 frames. While charging, the animation of id 10
 * will play on loop. Each tier completed will play the animation of id 25.
 * When fully charged and released, it will execute the skill of id 175.
 *
 *  <chargeTier:[1,60,0]>
 *  <chargeTier:[2,120,90]>
 * The player can charge this skill up 2 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, but
 * will yield no skill when released. The second tier requires the input held
 * for an additional 120 frames, and when fully charged and released, it will
 * execute the skill id of 90.
 *
 *  <chargeTier:[1,60,125]>
 *  <chargeTier:[2,300,0]>
 *  <chargeTier:[7,150,90]>
 * (this is probably an unrealistic example, but illustrates the functionality)
 * The player can charge this skill up 7 tiers by holding down the input for
 * this skill slot. The first tier requires the input held for 60 frames, and
 * will execute skill of id 125 when released after charging for at minimum
 * the 60 frames. The second tier requires the input to be held for an
 * additional 300 frames (! roughly five seconds !), and when released after
 * charging, will execute the same skill as tier 1 because tier 2 has 0 set as
 * the skill id to execute. The tiers of (3/4/5/6) are all auto-generated and
 * each require 30 frames of holding the input. Finally, tier 7 requires the
 * input to be held for another 150 frames, and when fully charged and released
 * will execute skill id 90 instead. This skill requires a total of:
 * 60 + 300 + 30 + 30 + 30 + 30 + 150 = 630 aka ~10.5 seconds of holding the
 * input down to fully charge all the tiers!
 * ============================================================================
 * MORE ABOUT CHARGE TIERS:
 * In some cases, you may only want the player's charged ablity to release a
 * skill if it is charged multiple tiers. While you could just make a really
 * long charge tier, it may make more sense to charge up three tiers and only
 * the last tier will release a skill when fully charged. In this case, you
 * can only place the last tag on a skill (like a tier7 tag) and this engine
 * will auto-generate the prior tiers as 1/2 second charges per tier up
 * until the tier you defined is reached. None of the auto-generated tiers
 * will have releasable skills.
 *
 * If you manually created a gap, for example, by defining only charging tiers
 * 1 and 6, the auto-generated ones (2/3/4/5) would not have any releasable
 * skills, but if the tier1 you defined DOES have a releasable skill, releasing
 * anything after the first but before the 6th tier would end up releasing the
 * 1st tier charge skill as a result.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param defaults
 * @text DEFAULTS
 *
 * @param defaultChargingAnimId
 * @parent defaults
 * @type animation
 * @text Charging Animation
 * @desc This will be the default animation to play when a
 * while charging up. 0 means no animation.
 * @default 0
 *
 * @param defaultTierCompleteAnimId
 * @parent defaults
 * @type animation
 * @text Tier Complete Animation
 * @desc This will be the default animation to play when a
 * charging tier is charged. 0 means no animation.
 * @default 0
 *
 * @param useTierCompleteSE
 * @parent defaults
 * @type boolean
 * @text Use Tier Complete SE
 * @desc Whether or not to use the charging tier complete sound
 * effects.
 * @default false
 *
 * @param allowTierCompleteSEandAnim
 * @parent defaults
 * @type boolean
 * @text Allow Tier Complete SE/Anim
 * @desc Whether or not to use both sound effects and the defined
 * animations when a charging tier completes.
 * @default false
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT.CHARGE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.CHARGE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-ActionCharging`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.CHARGE.PluginParameters = PluginManager.parameters(J.ABS.EXT.CHARGE.Metadata.Name);

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.CHARGE.Metadata = {
  // the original properties.
  ...J.ABS.EXT.CHARGE.Metadata,

  /**
   * The default charging animation id.
   * 0 will yield no default animation.
   * @type {number}
   */
  DefaultChargingAnimationId: Number(J.ABS.EXT.CHARGE.PluginParameters['defaultChargingAnimId']),

  /**
   * The default tier complete animation id.
   * 0 will yield no default animation.
   * @type {number}
   */
  DefaultTierCompleteAnimationId: Number(J.ABS.EXT.CHARGE.PluginParameters['defaultTierCompleteAnimId']),

  /**
   * Whether or not to use the charging tier complete sound effect.
   * @type {boolean}
   */
  UseTierCompleteSE: J.ABS.EXT.CHARGE.PluginParameters['useTierCompleteSE'] === "true",

  /**
   * Whether or not to use the charging tier complete sound effect when there is an animation present.
   * @type {boolean}
   */
  AllowTierCompleteSEandAnimation: J.ABS.EXT.CHARGE.PluginParameters['allowTierCompleteSEandAnim'] === "true",
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.CHARGE.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  JABS_Action: new Map(),
  JABS_Battler: new Map(),
  JABS_InputController: new Map(),
  SoundManager: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.CHARGE.RegExp = {
  ChargeData: /<chargeTier:[ ]?(\[\d+,[ ]?\d+,[ ]?\d+(,[ ]?\d+(,[ ]?\d+)?)?])>/gi,
};
//endregion Introduction

//region JABS_Battler
/**
 * Extends {@link JABS_Battler.initBattleInfo}.<br>
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
 * Extends {@link JABS_Battler.update}.<br>
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

//region JABS_InputAdapter
//region mainhand
/**
 * Executes the charging of the mainhand slot.
 * @param {boolean} charging True if we are charging this slot, false otherwise.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 */
JABS_InputAdapter.performMainhandActionCharging = function(charging, jabsBattler)
{
  // check if we can charge with our mainhand slot.
  if (!this.canPerformMainhandActionCharging(jabsBattler)) return;

  // enable the charging of the action.
  jabsBattler.executeChargeAction(JABS_Button.Mainhand, charging);
};

/**
 * Determines wehether or not the player can try to charge their mainhand action.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 * @returns {boolean} True if we can charge with this slot, false otherwise.
 */
JABS_InputAdapter.canPerformMainhandActionCharging = function(jabsBattler)
{
  // if the battler can't use attacks, then do not charge.
  if (!jabsBattler.canBattlerUseAttacks()) return false;

  // if the player is casting, then do not charge.
  if (jabsBattler.isCasting()) return false;

  // perform!
  return true;
};
//endregion mainhand

//region offhand
/**
 * Executes the charging of the offhand slot.
 * @param {boolean} charging True if we are charging this slot, false otherwise.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 */
JABS_InputAdapter.performOffhandActionCharging = function(charging, jabsBattler)
{
  // check if we can charge with our mainhand slot.
  if (!this.canPerformOffhandActionCharging(jabsBattler)) return;

  // enable the charging of the action.
  jabsBattler.executeChargeAction(JABS_Button.Offhand, charging);
};

/**
 * Determines wehether or not the player can try to charge their offhand action.
 * Guard skills cannot be charged.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 * @returns {boolean} True if we can charge with this slot, false otherwise.
 */
JABS_InputAdapter.canPerformOffhandActionCharging = function(jabsBattler)
{
  // if the offhand skill is actually a guard skill, then do not charge.
  if (jabsBattler.isGuardSkillByKey(JABS_Button.Offhand)) return false;

  // if the battler can't use attacks, then do not charge.
  if (!jabsBattler.canBattlerUseAttacks()) return false;

  // if the player is casting, then do not charge.
  if (jabsBattler.isCasting()) return false;

  // perform!
  return true;
};
//endregion offhand

//region combat skills
/**
 * Executes the charging of the combat skill slot.
 * @param {boolean} charging True if we are charging this slot, false otherwise.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 * @param {string} slot The combat skill slot being charged.
 */
JABS_InputAdapter.performCombatSkillCharging = function(charging, jabsBattler, slot)
{
  // check if we can charge with our mainhand slot.
  if (!this.canPerformCombatSkillCharging(jabsBattler)) return;

  // enable the charging of the action.
  jabsBattler.executeChargeAction(slot, charging);
};

/**
 * Determines whether or not the player can try to charge their combat skill 1.
 * @param {JABS_Battler} jabsBattler The battler doing the charging.
 * @returns {boolean} True if we can charge with this slot, false otherwise.
 */
JABS_InputAdapter.canPerformCombatSkillCharging = function(jabsBattler)
{
  // if the battler can't use attacks, then do not charge.
  if (!jabsBattler.canBattlerUseSkills()) return false;

  // if the player is casting, then do not charge.
  if (jabsBattler.isCasting()) return false;

  // perform!
  return true;
};
//endregion combat skills
//endregion JABS_InputAdapter

//region JABS_InputController
J.ABS.EXT.CHARGE.Aliased.JABS_InputController.set('initMembers', JABS_InputController.prototype.initMembers);
JABS_InputController.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('initMembers').call(this);

  /**
   * The input delay between when the button is pressed down and when the charging can begin.
   * @type {number}
   */
  this._chargeInputDelayMax = 24;

  /**
   * A map of {@link JABS_Timer}s.
   * @type {Map<string, JABS_Timer>}
   */
  this._chargeInputDelay = new Map();

  // initialize the input delays for charging.
  this.initInputDelays();
};

/**
 * Gets the input delay for charging.
 * @returns {number} The delay in number of frames.
 */
JABS_InputController.prototype.getChargeInputDelayAmount = function()
{
  return this._chargeInputDelayMax;
};

/**
 * Initializes the input delays for this controller.
 */
JABS_InputController.prototype.initInputDelays = function()
{
  // clear the map if there was already stuff there somehow.
  this._chargeInputDelay.clear();

  // initialize the values of the input delays.
  this._chargeInputDelay.set(JABS_Button.Mainhand, new JABS_Timer(this.getChargeInputDelayAmount(), true));
  this._chargeInputDelay.set(JABS_Button.Offhand, new JABS_Timer(this.getChargeInputDelayAmount(), true));
  this._chargeInputDelay.set(JABS_Button.CombatSkill1, new JABS_Timer(this.getChargeInputDelayAmount(), true));
  this._chargeInputDelay.set(JABS_Button.CombatSkill2, new JABS_Timer(this.getChargeInputDelayAmount(), true));
  this._chargeInputDelay.set(JABS_Button.CombatSkill3, new JABS_Timer(this.getChargeInputDelayAmount(), true));
  this._chargeInputDelay.set(JABS_Button.CombatSkill4, new JABS_Timer(this.getChargeInputDelayAmount(), true));
};

/**
 * Gets the {@link JABS_Timer} associated with the charge input delay of the given slot.
 * @param {string} slot The slot to retrieve the charge input delay timer for.
 * @returns {JABS_Timer}
 */
JABS_InputController.prototype.getChargeInputDelayBySlot = function(slot)
{
  return this._chargeInputDelay.get(slot);
};

/**
 * Updates the charge input delay in the given slot.
 * @param {string} slot The slot to update the charge input delay timer for.
 */
JABS_InputController.prototype.updateChargeInputDelayBySlot = function(slot)
{
  this.getChargeInputDelayBySlot(slot).update();
};

/**
 * Resets the charge input delay in the given slot back to default.
 * @param {string} slot The slot to refresh the charge input delay timer for.
 */
JABS_InputController.prototype.resetChargeInputDelayBySlot = function(slot)
{
  this.getChargeInputDelayBySlot(slot).reset();
};

/**
 * Checks if the timer in the given slot is completed.
 * @param {string} slot The slot to refresh the charge input delay timer for.
 * @returns {boolean} True if the slot's timer is complete, false otherwise.
 */
JABS_InputController.prototype.isTimerCompleteBySlot = function(slot)
{
  return this.getChargeInputDelayBySlot(slot).isTimerComplete();
};

//region mainhand
/**
 * Extends {@link JABS_InputController.updateMainhandAction}.<br>
 * Handles charging capability for this input.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateMainhandAction', JABS_InputController.prototype.updateMainhandAction);
JABS_InputController.prototype.updateMainhandAction = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateMainhandAction').call(this);

  // handle the charging.
  this.handleMainhandCharging();
};

/**
 * Handles the charging detection and interaction for the mainhand.
 */
JABS_InputController.prototype.handleMainhandCharging = function()
{
  // check if the action's input requirements have been met.
  if (this.isMainhandActionCharging())
  {
    // execute the action.
    this.performMainhandChargeAction();
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performMainhandChargeAlterAction();
  }
};

/**
 * Checks the inputs of the mainhand action currently assigned (A default).
 * @returns {boolean}
 */
JABS_InputController.prototype.isMainhandActionCharging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeMainhandAction()) return false;

  // this action requires A to be held down.
  if (Input.isPressed(J.ABS.Input.Mainhand)) return true;

  // A is not being held down.
  return false;
};

/**
 * Determines whether or not the mainhand action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeMainhandAction = function()
{
  // do not charge if we are just mashing the button.
  if (this.isMainhandActionTriggered()) return false;

  // do not charge the mainhand if we are trying to use combat skills.
  if (this.isCombatSkillUsageEnabled()) return false;

  // we can charge!
  return true;
};

/**
 * Determines whether or not the charging is ready.
 * @returns {boolean} True if the charging is ready, false otherwise.
 */
JABS_InputController.prototype.isMainhandChargeActionReady = function()
{
  // the delay is still ticking.
  if (!this.isTimerCompleteBySlot(JABS_Button.Mainhand)) return false;

  // ready to charge!
  return true;
};

/**
 * Begins charging up the mainhand action.
 */
JABS_InputController.prototype.performMainhandChargeAction = function()
{
  // check if the delay has passed.
  if (this.isMainhandChargeActionReady())
  {
    // start charging.
    JABS_InputAdapter.performMainhandActionCharging(true, $jabsEngine.getPlayer1());
  }
  // the delay has not finished.
  else
  {
    // update the timer for the charge input delay.
    this.updateChargeInputDelayBySlot(JABS_Button.Mainhand);
  }
};

/**
 * When the mainhand is not charging, then cancel the charge.
 */
JABS_InputController.prototype.performMainhandChargeAlterAction = function()
{
  // execute the alter-action- aka stop charging and release if applicable.
  JABS_InputAdapter.performMainhandActionCharging(false, $jabsEngine.getPlayer1());

  // reset the slot's charging input delay.
  this.resetChargeInputDelayBySlot(JABS_Button.Mainhand);
};
//endregion mainhand

//region offhand
/**
 * Extends {@link JABS_InputController.updateOffhandAction}.<br>
 * Handles charging capability to the offhand.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateOffhandAction', JABS_InputController.prototype.updateOffhandAction);
JABS_InputController.prototype.updateOffhandAction = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateOffhandAction').call(this);

  // handle the charging.
  this.handleOffhandCharging();
};

/**
 * Handles the charging detection and interaction for the mainhand.
 */
JABS_InputController.prototype.handleOffhandCharging = function()
{
  // check if the action's input requirements have been met.
  if (this.isOffhandActionCharging())
  {
    // execute the action.
    this.performOffhandChargeAction();
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performOffhandChargeAlterAction();
  }
};

/**
 * Checks the inputs of the offhand action currently assigned (B default).
 * @returns {boolean}
 */
JABS_InputController.prototype.isOffhandActionCharging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeOffhandAction()) return false;

  // this action requires A to be held down.
  if (Input.isPressed(J.ABS.Input.Offhand)) return true;

  // A is not being held down.
  return false;
};

/**
 * Determines whether or not the offhand action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeOffhandAction = function()
{
  // do not charge if we are just mashing the button.
  if (this.isOffhandActionTriggered()) return false;

  // do not charge the mainhand if we are trying to use combat skills.
  if (this.isCombatSkillUsageEnabled()) return false;

  // we can charge!
  return true;
};

/**
 * Determines whether or not the charging is ready.
 * @returns {boolean} True if the charging is ready, false otherwise.
 */
JABS_InputController.prototype.isOffhandChargeActionReady = function()
{
  // the delay is still ticking.
  if (!this.isTimerCompleteBySlot(JABS_Button.Offhand)) return false;

  // ready to charge!
  return true;
};

/**
 * Begins charging up the offhand action.
 */
JABS_InputController.prototype.performOffhandChargeAction = function()
{
  // check if the delay has passed.
  if (this.isOffhandChargeActionReady())
  {
    // start charging.
    JABS_InputAdapter.performOffhandActionCharging(true, $jabsEngine.getPlayer1());
  }
  // the delay has not finished.
  else
  {
    // update the timer for the charge input delay.
    this.updateChargeInputDelayBySlot(JABS_Button.Offhand);
  }
};

/**
 * When the offhand is not charging, then cancel the charge.
 */
JABS_InputController.prototype.performOffhandChargeAlterAction = function()
{
  JABS_InputAdapter.performOffhandActionCharging(false, $jabsEngine.getPlayer1())
};
//endregion offhand

//region combat skills
/**
 * Determines whether or not the charging is ready.
 * @returns {boolean} True if the charging is ready, false otherwise.
 */
JABS_InputController.prototype.isCombatActionChargeReady = function(slot)
{
  // the delay is still ticking.
  if (!this.isTimerCompleteBySlot(slot)) return false;

  // ready to charge!
  return true;
};

/**
 * Begins charging up the combat skill action.
 * @param {string} slot The slot to charge alter action with.
 */
JABS_InputController.prototype.performCombatSkillChargeAction = function(slot)
{
  // check if the delay has passed.
  if (this.isCombatActionChargeReady(slot))
  {
    // start charging.
    JABS_InputAdapter.performCombatSkillCharging(true, $jabsEngine.getPlayer1(), slot);
  }
  // the delay has not finished.
  else
  {
    // update the timer for the charge input delay.
    this.updateChargeInputDelayBySlot(slot);
  }
};

/**
 * If the combat skill is not charging, then cancel the charge.
 * @param {string} slot The slot to charge alter action with.
 */
JABS_InputController.prototype.performCombatSkillChargeAlterAction = function(slot)
{
  // execute the alter-action- aka stop charging and release if applicable.
  JABS_InputAdapter.performCombatSkillCharging(
    false,
    $jabsEngine.getPlayer1(),
    slot);

  // reset the slot's charging input delay.
  this.resetChargeInputDelayBySlot(slot);
};

//region combat skill 1
/**
 * Extends {@link JABS_InputController.updateCombatAction1}.<br>
 * Handles charging capability for this input.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateCombatAction1', JABS_InputController.prototype.updateCombatAction1);
JABS_InputController.prototype.updateCombatAction1 = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateCombatAction1').call(this);

  // handle the charging.
  this.handleCombatAction1Charging();
};

/**
 * Handles the charging detection and interaction for this input.
 */
JABS_InputController.prototype.handleCombatAction1Charging = function()
{
  // check if the action's input requirements have been met.
  if (this.isCombatAction1Charging())
  {
    // execute the action.
    this.performCombatSkillChargeAction(JABS_Button.CombatSkill1);
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill1);
  }
};

/**
 * Determines if the inputs are being pressed to charge this combat skill.
 * @returns {boolean}
 */
JABS_InputController.prototype.isCombatAction1Charging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeCombatAction1()) return false;

  // this action requires the inputs for this combat skill to be held down.
  if (!this.isCombatSkillUsageEnabled()) return false;

  // or just the single-button input to be held down.
  if (Input.isPressed(J.ABS.Input.Mainhand) || Input.isPressed(J.ABS.Input.CombatSkill1)) return true;

  // inputs are not being held down.
  return false;
};

/**
 * Determines whether or not the combat action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeCombatAction1 = function()
{
  // do not charge if we are just mashing the button.
  if (this.isCombatAction1Triggered()) return false;

  // we can charge!
  return true;
};
//endregion combat skill 1

//region combat skill 2
/**
 * Extends {@link JABS_InputController.updateCombatAction2}.<br>
 * Handles charging capability for this input.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateCombatAction2', JABS_InputController.prototype.updateCombatAction2);
JABS_InputController.prototype.updateCombatAction2 = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateCombatAction2').call(this);

  // handle the charging.
  this.handleCombatAction2Charging();
};

/**
 * Handles the charging detection and interaction for this input.
 */
JABS_InputController.prototype.handleCombatAction2Charging = function()
{
  // check if the action's input requirements have been met.
  if (this.isCombatAction2Charging())
  {
    // execute the action.
    this.performCombatSkillChargeAction(JABS_Button.CombatSkill2);
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill2);
  }
};

/**
 * Determines if the inputs are being pressed to charge this combat skill.
 * @returns {boolean}
 */
JABS_InputController.prototype.isCombatAction2Charging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeCombatAction2()) return false;

  // this action requires the inputs for this combat skill to be held down.
  if (!this.isCombatSkillUsageEnabled()) return false;

  // or just the single-button input to be held down.
  if (Input.isPressed(J.ABS.Input.Offhand) || Input.isPressed(J.ABS.Input.CombatSkill2)) return true;

  // inputs are not being held down.
  return false;
};

/**
 * Determines whether or not the combat action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeCombatAction2 = function()
{
  // do not charge if we are just mashing the button.
  if (this.isCombatAction2Triggered()) return false;

  // we can charge!
  return true;
};
//endregion combat skill 2

//region combat skill 3
/**
 * Extends {@link JABS_InputController.updateCombatAction3}.<br>
 * Handles charging capability for this input.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateCombatAction3', JABS_InputController.prototype.updateCombatAction3);
JABS_InputController.prototype.updateCombatAction3 = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateCombatAction3').call(this);

  // handle the charging.
  this.handleCombatAction3Charging();
};

/**
 * Handles the charging detection and interaction for this input.
 */
JABS_InputController.prototype.handleCombatAction3Charging = function()
{
  // check if the action's input requirements have been met.
  if (this.isCombatAction3Charging())
  {
    // execute the action.
    this.performCombatSkillChargeAction(JABS_Button.CombatSkill3);
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill3);
  }
};

/**
 * Determines if the inputs are being pressed to charge this combat skill.
 * @returns {boolean}
 */
JABS_InputController.prototype.isCombatAction3Charging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeCombatAction3()) return false;

  // this action requires the inputs for this combat skill to be held down.
  if (!this.isCombatSkillUsageEnabled()) return false;

  // or just the single-button input to be held down.
  if (Input.isPressed(J.ABS.Input.Dash) || Input.isPressed(J.ABS.Input.CombatSkill3)) return true;

  // inputs are not being held down.
  return false;
};

/**
 * Determines whether or not the combat action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeCombatAction3 = function()
{
  // do not charge if we are just mashing the button.
  if (this.isCombatAction3Triggered()) return false;

  // we can charge!
  return true;
};
//endregion combat skill 3

//region combat skill 4
/**
 * Extends {@link JABS_InputController.updateCombatAction4}.<br>
 * Handles charging capability for this input.
 */
J.ABS.EXT.CHARGE.Aliased.JABS_InputController
  .set('updateCombatAction4', JABS_InputController.prototype.updateCombatAction4);
JABS_InputController.prototype.updateCombatAction4 = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.JABS_InputController.get('updateCombatAction4').call(this);

  // handle the charging.
  this.handleCombatAction4Charging();
};

/**
 * Handles the charging detection and interaction for this input.
 */
JABS_InputController.prototype.handleCombatAction4Charging = function()
{
  // check if the action's input requirements have been met.
  if (this.isCombatAction4Charging())
  {
    // execute the action.
    this.performCombatSkillChargeAction(JABS_Button.CombatSkill4);
  }
  // if they aren't being met.
  else
  {
    // then execute the alter-action.
    this.performCombatSkillChargeAlterAction(JABS_Button.CombatSkill4);
  }
};

/**
 * Determines if the inputs are being pressed to charge this combat skill.
 * @returns {boolean}
 */
JABS_InputController.prototype.isCombatAction4Charging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeCombatAction4()) return false;

  // this action requires the inputs for this combat skill to be held down.
  if (!this.isCombatSkillUsageEnabled()) return false;

  // or just the single-button input to be held down.
  if (Input.isPressed(J.ABS.Input.Tool) || Input.isPressed(J.ABS.Input.CombatSkill4)) return true;

  // inputs are not being held down.
  return false;
};

/**
 * Determines whether or not the combat action can be charged.
 * @returns {boolean}
 */
JABS_InputController.prototype.canChargeCombatAction4 = function()
{
  // do not charge if we are just mashing the button.
  if (this.isCombatAction4Triggered()) return false;

  // we can charge!
  return true;
};
//endregion combat skill 4
//endregion combat skills
//endregion JABS_InputController

//region RPG_Skill
/**
 * The charge tier data associated with a skill.
 * @type {[number, number, number, number][]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsChargeData",
  {
    get: function()
    {
      return this.getJabsChargeData();
    },
  });

/**
 * Gets the charge tier data from this skill.
 * @returns {[number, number, number, number][]|null}
 */
RPG_Base.prototype.getJabsChargeData = function()
{
  return this.extractJabsChargeData()
};

/**
 * Gets the value from its notes.
 * @returns {[number, number, number, number][]|null}
 */
RPG_Base.prototype.extractJabsChargeData = function()
{
  return this.getArraysFromNotesByRegex(J.ABS.EXT.CHARGE.RegExp.ChargeData, true);
};
//endregion RPG_Skill

//region SoundManager
/**
 * Extends {@link SoundManager.preloadImportantSounds}.<br>
 * Also preloads the charging-related sound effects.
 */
J.ABS.EXT.CHARGE.Aliased.SoundManager.set('preloadImportantSounds', SoundManager.preloadImportantSounds);
SoundManager.preloadImportantSounds = function()
{
  // perform original logic.
  J.ABS.EXT.CHARGE.Aliased.SoundManager.get('preloadImportantSounds').call(this);

  // load our charging sounds.
  this.loadJabsChargingSounds();
};

/**
 * Adds the charging-related sound effects to the list of preloaded sound effects.
 */
SoundManager.loadJabsChargingSounds = function()
{
  // grab the sound effect for charging tier complete.
  const chargeTierComplete = this.chargeTierCompleteSE();

  // grab the sound effect for max charge becoming ready.
  const maxChargeReady = this.maxChargeReadySE();

  // preload em.
  AudioManager.loadStaticSe(chargeTierComplete);
  AudioManager.loadStaticSe(maxChargeReady);
};

/**
 * Plays the sound effect for when a charging tier has completed charging.
 */
SoundManager.playChargeTierCompleteSE = function()
{
  // grab the sound effect for charging tier complete.
  const se = this.chargeTierCompleteSE();

  // play the effect.
  this.playSoundEffect(se);
};

/**
 * Plays the sound effect for when the max charge effect is ready.
 */
SoundManager.playMaxChargeReadySE = function()
{
  // grab the sound effect for the max charge becoming ready.
  const se = this.maxChargeReadySE();

  // play the effect.
  this.playSoundEffect(se);
};

/**
 * The sound effect to play when a charging tier has completed charging.
 * @returns {RPG_SoundEffect}
 */
SoundManager.chargeTierCompleteSE = function()
{
  return new RPG_SoundEffect("Heal6", 40, 130, 0);
};

/**
 * The sound effect to play when the max charge effect is ready.
 * @returns {RPG_SoundEffect}
 */
SoundManager.maxChargeReadySE = function()
{
  return new RPG_SoundEffect("Item3", 50, 110, 0);
};
//endregion SoundManager