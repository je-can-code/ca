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
 * Extends {@link JABS_InputController.updateMainhandAction}.
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
 * Extends {@link JABS_InputController.updateOffhandAction}.
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
 * Extends {@link JABS_InputController.updateCombatAction1}.
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
 * Extends {@link JABS_InputController.updateCombatAction2}.
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
 * Extends {@link JABS_InputController.updateCombatAction3}.
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
 * Extends {@link JABS_InputController.updateCombatAction4}.
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