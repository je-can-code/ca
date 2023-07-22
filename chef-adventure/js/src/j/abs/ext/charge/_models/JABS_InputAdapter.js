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