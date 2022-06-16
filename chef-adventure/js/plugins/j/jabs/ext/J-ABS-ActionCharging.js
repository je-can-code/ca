//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CHARGE] Enable skills to be charged to perform other skills.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables modifications for cast times and cooldowns for actions.
 *
 * Enables:
 * - NEW! added param "Fast Cooldown", for modifying cooldown times.
 * - NEW! added param "Cast Speed", for modifying cast speeds.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT_CHARGE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT_CHARGE.Metadata = {
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
J.ABS.EXT_CHARGE.PluginParameters = PluginManager.parameters(J.ABS.EXT_CHARGE.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT_CHARGE.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  JABS_Action: new Map(),
  JABS_Battler: new Map(),
  JABS_InputController: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT_CHARGE.RegExp = {
  ChargeData: /<chargeTier:[ ]?(\[\d+,[ ]?\d+,[ ]?\d+])>/gi,
};
//#endregion Introduction

//#region existing JABS objects
//#region JABS_InputController
//#region mainhand
/**
 * Extends {@link JABS_InputController.updateMainhandAction}.
 * Handles charging capability to the mainhand.
 */
J.ABS.EXT_CHARGE.Aliased.JABS_InputController
  .set('updateMainhandAction', JABS_InputController.prototype.updateMainhandAction);
JABS_InputController.prototype.updateMainhandAction = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_InputController.get('updateMainhandAction').call(this);

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
 * Begins charging up the mainhand action.
 */
JABS_InputController.prototype.performMainhandChargeAction = function()
{
  JABS_InputAdapter.performMainhandActionCharging(true, $jabsEngine.getPlayer1())
};

/**
 * When the mainhand is not charging, then cancel the charge.
 */
JABS_InputController.prototype.performMainhandChargeAlterAction = function()
{
  JABS_InputAdapter.performMainhandActionCharging(false, $jabsEngine.getPlayer1())
};
//#endregion mainhand

//#region offhand
/**
 * Extends {@link JABS_InputController.updateOffhandAction}.
 * Handles charging capability to the offhand.
 */
J.ABS.EXT_CHARGE.Aliased.JABS_InputController
.set('updateOffhandAction', JABS_InputController.prototype.updateOffhandAction);
JABS_InputController.prototype.updateOffhandAction = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_InputController.get('updateOffhandAction').call(this);

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
 * Begins charging up the offhand action.
 */
JABS_InputController.prototype.performOffhandChargeAction = function()
{
  JABS_InputAdapter.performOffhandActionCharging(true, $jabsEngine.getPlayer1())
};

/**
 * When the offhand is not charging, then cancel the charge.
 */
JABS_InputController.prototype.performOffhandChargeAlterAction = function()
{
  JABS_InputAdapter.performOffhandActionCharging(false, $jabsEngine.getPlayer1())
};
//#endregion offhand
//#endregion JABS_InputController

//#region JABS_InputAdapter
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
  jabsBattler.executeChargeAction(JABS_Button.Main, charging);
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
//#endregion JABS_InputAdapter

//#region JABS_Battler
/**
 * Extends {@link JABS_Battler.initBattleInfo}.
 * Also initializes the charge-related data.
 */
J.ABS.EXT_CHARGE.Aliased.JABS_Battler.set('initBattleInfo', JABS_Battler.prototype.initBattleInfo);
JABS_Battler.prototype.initBattleInfo = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_Battler.get('initBattleInfo').call(this);

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

//#region property getter setter
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

//#endregion property getter setter

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
    skillId = battler.getEquippedSkill(slot);
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
    const [chargeTier, maxDuration, chargeSkillId] = tierData;

    // return a compiled charging tier.
    return new JABS_ChargingTier(chargeTier, maxDuration, chargeSkillId)
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
J.ABS.EXT_CHARGE.Aliased.JABS_Battler.set('update', JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_Battler.get('update').call(this);

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

  // if we do not have a tier to charge, then do not.
  if (!currentTier) return;

  // update the current charging tier.
  currentTier.update();

  //const { tier, duration, maxDuration } = currentTier;
  //console.log(`tier:[${tier}], duration:[${duration}/${maxDuration}]`);
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
//#endregion JABS_Battler
//#endregion existing JABS objects

//#region new JABS objects
//#region JABS_ChargingTier
/**
 * A single charging tier derived from a skill in a slot to be charged.
 */
class JABS_ChargingTier
{
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
   * Constructor.
   * @param {number} tier The number of tier this is.
   * @param {number} maxDuration The duration for this tier.
   * @param {number} skillId The skill to be executed on charge-up.
   */
  constructor(tier, maxDuration, skillId)
  {
    this.maxDuration = maxDuration;
    this.tier = tier;
    this.skillId = skillId;
  }

  /**
   * The default for a tier that is missing from a skill but needed to
   * fill the gaps between other tiers that were defined.
   * @param {number} fillerTier The tier number to be filled.
   * @returns {JABS_ChargingTier} The default filler tier.
   */
  static defaultTier(fillerTier = 1)
  {
    return new JABS_ChargingTier(fillerTier, 30, 0);
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
    console.log(`completed tier ${this.tier}, charge skill ${this.skillId} available!`);
  }
}
//#endregion JABS_ChargingTier
//#endregion new JABS objects

//#region RPG objects
//#region RPG_Skill
/**
 * The charge tier data associated with a skill.
 * @type {[number, number, number][]|null}
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
 * @returns {[number, number, number][]|null}
 */
RPG_Base.prototype.getJabsChargeData = function()
{
  return this.extractJabsChargeData()
};

/**
 * Gets the value from its notes.
 * @returns {[number, number, number][]|null}
 */
RPG_Base.prototype.extractJabsChargeData = function()
{
  return this.getArraysFromNotesByRegex(J.ABS.EXT_CHARGE.RegExp.ChargeData, true);
};
//#endregion RPG_Skill
//#endregion RPG objects