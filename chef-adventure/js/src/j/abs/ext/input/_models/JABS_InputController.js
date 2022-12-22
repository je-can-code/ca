//region JABS_InputController
/**
 * The class that handles input in the context of JABS for a player.
 * A battler must be set in order for this to update.
 */
class JABS_InputController
{
  /**
   * Constructor.
   */
  constructor()
  {
    // initialize this.
    this.initialize();
  }

  /**
   * Initializes this class.
   */
  initialize()
  {
    // register this controller with the input adapter.
    JABS_InputAdapter.register(this);

    // initialize the other members of the class.
    this.initMembers();

    this.initMapping();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The battler that this input manager manages.
     * @type {JABS_Battler|null}
     */
    this.battler = null;

    /**
     * A collection of input mappings from button to function.
     * @type {Map<string, string>}
     */
    this.inputMapping = new Map();
  }

  /**
   * Initialize the button to input mappings.
   */
  initMapping()
  {
    this.inputMapping.set(JABS_Button.Mainhand, J.ABS.Input.Mainhand);
    this.inputMapping.set(JABS_Button.Offhand, J.ABS.Input.Offhand);
    this.inputMapping.set(JABS_Button.Tool, J.ABS.Input.Tool);
    this.inputMapping.set(JABS_Button.Dodge, J.ABS.Input.Dash);
    this.inputMapping.set(JABS_Button.CombatSkill1, J.ABS.Input.CombatSkill1);
    this.inputMapping.set(JABS_Button.CombatSkill2, J.ABS.Input.CombatSkill2);
    this.inputMapping.set(JABS_Button.CombatSkill3, J.ABS.Input.CombatSkill3);
    this.inputMapping.set(JABS_Button.CombatSkill4, J.ABS.Input.CombatSkill4);
  }

  /**
   * Gets the key input for the given button.
   * @param {string} slot The button mapping to the slot.
   * @returns {string} The input to press for this given slot.
   */
  getInputForButton(slot)
  {
    return this.inputMapping.get(slot);
  }

  //region update
  /**
   * Updates the input loop for tracking JABS input.
   */
  update()
  {
    // if updating is not available, then do not.
    if (!this.canUpdate()) return;

    // update input for the management actions.
    this.updateMenuAction();
    this.updatePartyCycleAction();

    // update input for the triggered-button actions.
    this.updateMainhandAction();
    this.updateOffhandAction();
    this.updateToolAction();
    this.updateDodgeAction();

    // update input for multi-button actions.
    this.updateCombatAction1();
    this.updateCombatAction2();
    this.updateCombatAction3();
    this.updateCombatAction4();

    // update input for the pressed(held down)-button actions.
    this.updateGuardCommand();
    this.updateStrafeCommand();
    this.updateRotateCommand();
  }

  /**
   * Checks whether or not we can update this input manager.
   * @returns {boolean}
   */
  canUpdate()
  {
    // if we don't have a battler, we can't update their input.
    if (!this.battler) return false;

    // update!
    return true;
  }
  //endregion update

  //region menu action
  /**
   * Monitors and takes action based on player input regarding the menu.
   * This is `Menu` on the gamepad by default.
   */
  updateMenuAction()
  {
    // check if the action's input requirements have been met.
    if (this.isMenuActionTriggered())
    {
      // execute the action.
      this.performMenuAction();
    }
  }

  /**
   * Checks the inputs of the menu action (Menu default).
   * @returns {boolean}
   */
  isMenuActionTriggered()
  {
    // this action requires Menu to be triggered.
    if (Input.isTriggered(J.ABS.Input.Quickmenu))
    {
      return true;
    }

    // Menu was never triggered.
    return false;
  }

  /**
   * Executes the menu action (Menu default).
   */
  performMenuAction()
  {
    JABS_InputAdapter.performMenuAction();
  }
  //endregion menu action

  //region party cycle
  /**
   * Monitors and takes action based on player input regarding party cycling.
   * This is `Select` on the gamepad by default.
   */
  updatePartyCycleAction()
  {
    // check if the action's input requirements have been met.
    if (this.isPartyCycleActionTriggered())
    {
      // execute the action.
      this.performPartyCycleAction();
    }
  }

  /**
   * Checks the inputs of the party cycle action (Select default).
   * @returns {boolean}
   */
  isPartyCycleActionTriggered()
  {
    // this action requires Select to be triggered.
    if (Input.isTriggered(J.ABS.Input.PartyCycle))
    {
      return true;
    }

    // Select was never triggered.
    return false;
  }

  /**
   * Executes the party cycle action (Select default).
   */
  performPartyCycleAction()
  {
    JABS_InputAdapter.performPartyCycling(false);
  }
  //endregion party cycle

  //region mainhand
  /**
   * Monitors and takes action based on player input regarding the mainhand action.
   * This is `A` on the gamepad by default.
   */
  updateMainhandAction()
  {
    // check if the action's input requirements have been met.
    if (this.isMainhandActionTriggered())
    {
      // execute the action.
      this.performMainhandAction();
    }
  }

  /**
   * Checks the inputs of the mainhand action currently assigned (A default).
   * @returns {boolean}
   */
  isMainhandActionTriggered()
  {
    // if the player is preparing to use a skill, don't do this as well.
    if (this.isCombatSkillUsageEnabled())
    {
      return false;
    }

    // this action requires A to be triggered.
    if (Input.isTriggered(J.ABS.Input.Mainhand))
    {
      return true;
    }

    // A is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned mainhand action (A default).
   */
  performMainhandAction()
  {
    JABS_InputAdapter.performMainhandAction(this.battler);
  }
  //endregion mainhand

  //region offhand
  /**
   * Monitors and takes action based on player input regarding the offhand action.
   * This is `B` on the gamepad by default.
   */
  updateOffhandAction()
  {
    // check if the action's input requirements have been met.
    if (this.isOffhandActionTriggered())
    {
      // execute the action.
      this.performOffhandAction()
    }
  }

  /**
   * Checks the inputs of the offhand action currently assigned (B default).
   * @returns {boolean}
   */
  isOffhandActionTriggered()
  {
    // if the player is preparing to use a skill, don't do this as well.
    if (this.isCombatSkillUsageEnabled())
    {
      return false;
    }

    // this action requires B to be triggered.
    if (Input.isTriggered(J.ABS.Input.Offhand))
    {
      return true;
    }

    // B is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned offhand action (B default).
   */
  performOffhandAction()
  {
    JABS_InputAdapter.performOffhandAction(this.battler);
  }
  //endregion offhand

  //region tool
  /**
   * Monitors and takes action based on player input regarding the tool action.
   * This is `Y` on the gamepad by default.
   */
  updateToolAction()
  {
    // check if the action's input requirements have been met.
    if (this.isToolActionTriggered())
    {
      // execute the action.
      this.performToolAction();
    }
  }

  /**
   * Checks the inputs of the tool action currently assigned (Y default).
   * @returns {boolean}
   */
  isToolActionTriggered()
  {
    // if the player is preparing to use a skill, don't do this as well.
    if (this.isCombatSkillUsageEnabled())
    {
      return false;
    }

    // this action requires Y to be triggered.
    if (Input.isTriggered(J.ABS.Input.Tool))
    {
      return true;
    }

    // Y is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned tool action (Y default).
   */
  performToolAction()
  {
    JABS_InputAdapter.performToolAction($jabsEngine.getPlayer1());
  }
  //endregion tool

  //region dodge
  /**
   * Monitors and takes action based on player input regarding the dodge action.
   * This is `R2` on the gamepad by default.
   */
  updateDodgeAction()
  {
    // check if the action's input requirements have been met.
    if (this.isDodgeActionTriggered())
    {
      // execute the action.
      this.performDodgeAction();
    }
  }

  /**
   * Checks the inputs of the dodge action currently assigned (R2 default).
   * @returns {boolean}
   */
  isDodgeActionTriggered()
  {
    // this action requires R2 to be triggered.
    if (Input.isTriggered(J.ABS.Input.MobilitySkill))
    {
      return true;
    }

    // R2 is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned dodge action (R2 default).
   */
  performDodgeAction()
  {
    JABS_InputAdapter.performDodgeAction($jabsEngine.getPlayer1());
  }
  //endregion dodge

  //region combat actions
  /**
   * Checks the inputs to ensure the combat action enabler is being held down.
   * (L1 default).
   * @returns {boolean}
   */
  isCombatSkillUsageEnabled()
  {
    // this action requires L1 to be held down.
    if (Input.isPressed(J.ABS.Input.SkillTrigger))
    {
      return true;
    }

    // L1 is not being held down.
    return false;
  }

  /**
   * Executes the combat action in the given slot.
   * @param {string} slot The slot to execute the combo action from.
   */
  performCombatAction(slot)
  {
    JABS_InputAdapter.performCombatAction(
      slot,
      $jabsEngine.getPlayer1());
  }

  //region combat action 1
  /**
   * Monitors and takes action based on player input regarding combat action 1.
   * This is `L1+A` on the gamepad by default.
   */
  updateCombatAction1()
  {
    // check if the action's input requirements have been met.
    if (this.isCombatAction1Triggered())
    {
      // execute the action.
      this.performCombatAction(JABS_Button.CombatSkill1);
    }
  }

  /**
   * Checks the inputs of the combat action in slot 1 (L1+A default).
   * @returns {boolean}
   */
  isCombatAction1Triggered()
  {
    // this action requires L1 to be held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and also having A triggered at the same time.
      if (Input.isTriggered(J.ABS.Input.Mainhand))
      {
        return true;
      }
    }

    // if the keyboard input is met, then we are triggering this input.
    if (Input.isTriggered(J.ABS.Input.CombatSkill1)) return true;

    // A was never triggered while L1 was held down.
    return false;
  }
  //endregion combat action 1

  //region combat action 2
  /**
   * Monitors and takes action based on player input regarding combat action 2.
   * This is `L1+B` on the gamepad by default.
   */
  updateCombatAction2()
  {
    // check if the action's input requirements have been met.
    if (this.isCombatAction2Triggered())
    {
      // execute the action.
      this.performCombatAction(JABS_Button.CombatSkill2);
    }
  }

  /**
   * Checks the inputs of the combat action in slot 2 (L1+B default).
   * @returns {boolean}
   */
  isCombatAction2Triggered()
  {
    // this action requires L1 to be held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and also having B triggered at the same time.
      if (Input.isTriggered(J.ABS.Input.Offhand))
      {
        return true;
      }
    }

    // if the keyboard input is met, then we are triggering this input.
    if (Input.isTriggered(J.ABS.Input.CombatSkill2)) return true;

    // B was never triggered while L1 was held down.
    return false;
  }
  //endregion combat action 2

  //region combat action 3
  /**
   * Monitors and takes action based on player input regarding combat action 3.
   * This is `L1+X` on the gamepad by default.
   */
  updateCombatAction3()
  {
    // check if the action's input requirements have been met.
    if (this.isCombatAction3Triggered())
    {
      // execute the action.
      this.performCombatAction(JABS_Button.CombatSkill3);
    }
  }

  /**
   * Checks the inputs of the combat action in slot 3 (L1+X default).
   * @returns {boolean}
   */
  isCombatAction3Triggered()
  {
    // this action requires L1 to be held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and also having X triggered at the same time.
      if (Input.isTriggered(J.ABS.Input.Dash))
      {
        return true;
      }
    }

    // if the keyboard input is met, then we are triggering this input.
    if (Input.isTriggered(J.ABS.Input.CombatSkill3)) return true;

    // X was never triggered while L1 was held down.
    return false;
  }
  //endregion combat action 3

  //region combat action 4
  /**
   * Monitors and takes action based on player input regarding combat action 4.
   * This is `L1+Y` on the gamepad by default.
   */
  updateCombatAction4()
  {
    // check if the action's input requirements have been met.
    if (this.isCombatAction4Triggered())
    {
      // execute the action.
      this.performCombatAction(JABS_Button.CombatSkill4);
    }
  }

  /**
   * Checks the inputs of the combat action in slot 4 (L1+Y default).
   * @returns {boolean}
   */
  isCombatAction4Triggered()
  {
    // this action requires L1 to be held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and also having Y triggered at the same time.
      if (Input.isTriggered(J.ABS.Input.Tool))
      {
        return true;
      }
    }

    // if the keyboard input is met, then we are triggering this input.
    if (Input.isTriggered(J.ABS.Input.CombatSkill4)) return true;

    // Y was never triggered while L1 was held down.
    return false;
  }
  //endregion combat action 4
  //endregion combat actions

  //region strafe
  /**
   * Monitors and takes action based on player input regarding the strafe action.
   * This is `L2` on the gamepad by default.
   */
  updateStrafeCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isStrafeActionTriggered())
    {
      // execute the action.
      this.performStrafeAction();
    }
    // if they aren't being met.
    else
    {
      // then execute the alter-action.
      this.performStrafeAlterAction();
    }
  }

  /**
   * Checks the inputs of the strafe action currently assigned (L2 default).
   * @returns {boolean}
   */
  isStrafeActionTriggered()
  {
    // this action requires L2 to be triggered.
    if (Input.isPressed(J.ABS.Input.StrafeTrigger))
    {
      return true;
    }

    // R2 is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned strafe action (L2 default).
   */
  performStrafeAction()
  {
    JABS_InputAdapter.performStrafe(true, this.battler);
  }

  /**
   * Executes the currently assigned strafe alter-action (untouched-L2 default).
   */
  performStrafeAlterAction()
  {
    JABS_InputAdapter.performStrafe(false, this.battler);
  }
  //endregion strafe

  //region rotate
  /**
   * Monitors and takes action based on player input regarding the rotate action.
   * This is `L2` on the gamepad by default.
   */
  updateRotateCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isRotateActionTriggered())
    {
      // execute the action.
      this.performRotateAction();
    }
    // if they aren't being met.
    else
    {
      // then execute the alter-action.
      this.performRotateAlterAction();
    }
  }

  /**
   * Checks the inputs of the rotate action currently assigned (L2 default).
   * @returns {boolean}
   */
  isRotateActionTriggered()
  {
    // this action requires R1 to be triggered.
    if (Input.isPressed(J.ABS.Input.GuardTrigger))
    {
      return true;
    }

    // R1 is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned rotate action (R1 default).
   */
  performRotateAction()
  {
    JABS_InputAdapter.performRotate(true, $jabsEngine.getPlayer1());
  }

  /**
   * Executes the currently assigned rotate alter-action (untouched-R1 default).
   */
  performRotateAlterAction()
  {
    JABS_InputAdapter.performRotate(false, $jabsEngine.getPlayer1());
  }
  //endregion strafe

  //region guard
  /**
   * Monitors and takes action based on player input regarding the guard action.
   * This is `L2` on the gamepad by default.
   */
  updateGuardCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isGuardActionTriggered())
    {
      // execute the action.
      this.performGuardAction();
    }
    // if they aren't being met.
    else
    {
      // then execute the alter-action.
      this.performGuardAlterAction();
    }
  }

  /**
   * Checks the inputs of the guard action currently assigned (R1 default).
   * @returns {boolean}
   */
  isGuardActionTriggered()
  {
    // this action requires R1 to be held down.
    if (Input.isPressed(J.ABS.Input.GuardTrigger))
    {
      return true;
    }

    // R1 is not being held down.
    return false;
  }

  /**
   * Activates the currently assigned guard action (untouched-R1 default).
   */
  performGuardAction()
  {
    JABS_InputAdapter.performGuard(true, $jabsEngine.getPlayer1());
  }

  /**
   * Deactivates the currently assigned guard alter-action (untouched-R1 default).
   */
  performGuardAlterAction()
  {
    JABS_InputAdapter.performGuard(false, $jabsEngine.getPlayer1());
  }
  //endregion guard
}
//endregion JABS_InputController