//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 INPUT] A manager for overseeing the input of JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS-AllyAI
 * @orderBefore J-HUD
 * @help
 * ============================================================================
 * This plugin is a mapping of inputs to controls for JABS.
 * This plugin governs the mapping of button inputs to JABS functionality.
 *
 * This is a fully-built controller for JABS.
 * It interfaces with the JABS_InputAdapter in a 1:1 fashion to functionality
 * as the engine was intended to be used with a controller.
 * ============================================================================
 * DEVELOPER NOTES:
 * This plugin defines the means of which button inputs are mapped to the
 * publicly exposed JABS_InputAdapter endpoints. Because the JABS_InputController
 * is an instance-type class, additional instances of it can be created and
 * mapped to different functionality like additional battlers if one wanted.
 * Alternatively, button input mapping changes would take place here, though
 * do be sure to review J-ABS's Input keymapper to see what is already there.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.INPUT = {};
J.ABS.EXT.INPUT.Metadata = {};
J.ABS.EXT.INPUT.Metadata.Version = '1.0.0';
J.ABS.EXT.INPUT.Metadata.Name = `J-ABS-InputManager`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.INPUT.PluginParameters = PluginManager.parameters(J.ABS.EXT.INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.ABS.EXT.INPUT.Metadata =
  {
    // the previously defined metadata.
    ...J.ABS.EXT.INPUT.Metadata,
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.INPUT.Aliased =
  {
    DataManager: new Map(),
    JABS_Engine: new Map(),
    JABS_Battler: new Map(),
  };
//endregion metadata

/**
 * The global reference for the player's input manager.
 * This interprets and manages incoming inputs for JABS-related functionality.
 * @type {JABS_InputController}
 * @global
 */
var $jabsController1 = null;
//endregion introduction

//region JABS_Battler
/**
 * Generates a `JABS_Battler` based on the current leader of the party.
 * Also assigns the controller inputs for the player.
 */
J.ABS.EXT.INPUT.Aliased.JABS_Battler.set('createPlayer', JABS_Battler.createPlayer);
JABS_Battler.createPlayer = function()
{
  // intercept return data from original logic.
  const playerJabsBattler = J.ABS.EXT.INPUT.Aliased.JABS_Battler.get('createPlayer').call(this);

  // assign newly players are created to controller 1.
  $jabsController1.battler = playerJabsBattler;

  // return original logic data.
  return playerJabsBattler;
};
//endregion JABS_Battler

//region JABS_Button
/**
 * A static class containing all input keys available for JABS.
 */
class JABS_Button
{
  //region functionality
  /**
   * The "start" key.
   * Used for bringing up the JABS menu on the map.
   * @type {string}
   */
  static Menu = "Menu";

  /**
   * The "select" key.
   * Used for party-cycling.
   * @type {string}
   */
  static Select = "Select";
  //endregion functionality

  //region primary
  /**
   * The "main", "A" button, or "Z" key.
   * Used for executing the mainhand action.
   * @type {string}
   */
  static Mainhand = "Main";

  /**
   * The "offhand", "B" button, or "X" key.
   * Used for executing the offhand action.
   * @type {string}
   */
  static Offhand = "Offhand";

  /**
   * The "tool", "Y" button, or "C" key.
   * Used for executing the currently selected tool skill.
   * @type {string}
   */
  static Tool = "Tool";

  /**
   * The "dodge", "R2" button, or "Tab" key.
   * Used for executing the currently selected dodge skill.
   * @type {string}
   */
  static Dodge = "Dodge";
  //endregion primary

  //region mobility
  /**
   * The "strafe", "L2" button, or "Left Ctrl" key.
   * Used for locking the direction faced while the input is held.
   * @type {string}
   */
  static Strafe = "Strafe";

  /**
   * The "rotate", "R1" button, or "W" and "E" key(s).
   * Used for locking in-place while the input is held.
   * @type {string}
   */
  static Rotate = "Rotate";

  /**
   * The "guard", "R1" button, or "W", and "E" key(s).
   * Used for activating the guard function while the input is held.
   * @type {string}
   */
  static Guard = "Guard";
  //endregion mobility

  //region L1 + buttons
  /**
   * The `L1 + A` or 1 key.
   * Executes combat skill 1.
   * @type {string}
   */
  static CombatSkill1 = "CombatSkill1";

  /**
   * The `L1 + B` or 2 key.
   * Executes combat skill 2.
   * @type {string}
   */
  static CombatSkill2 = "CombatSkill2";

  /**
   * The `L1 + X` or 3 key.
   * Executes combat skill 3.
   * @type {string}
   */
  static CombatSkill3 = "CombatSkill3";

  /**
   * The `L1 + Y` or 4 key.
   * Executes combat skill 4.
   * @type {string}
   */
  static CombatSkill4 = "CombatSkill4";
  //endregion  L1 + buttons

  /**
   * Gets all assignable buttons used for JABS.
   * @returns {string[]} A collection of JABS-input keys' identifiers.
   */
  static assignableInputs()
  {
    // the valid set of assignable inputs.
    const okInputs = [
      // primary
      this.Mainhand,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // L1 + buttons
      this.CombatSkill1,
      this.CombatSkill2,
      this.CombatSkill3,
      this.CombatSkill4,
    ];

    // a filter function for ensuring only the correct inputs are accepted.
    const filtering = buttonInput => !okInputs.includes(buttonInput);

    // return the filtered buttons.
    return this.allButtons().filter(filtering);
  }

  /**
   * Gets all currently available buttons used for JABS.
   * @returns {string[]} A collection of JABS-input key's identifiers.
   */
  static allButtons()
  {
    return [
      // functionality
      this.Menu,
      this.Select,

      // primary
      this.Mainhand,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // mobility
      this.Strafe,
      this.Rotate,
      this.Guard,

      // L1 + buttons
      this.CombatSkill1,
      this.CombatSkill2,
      this.CombatSkill3,
      this.CombatSkill4,
    ];
  }
}
//endregion JABS_Button

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

//region DataManager
J.ABS.EXT.INPUT.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.DataManager.get('createGameObjects').call(this);

  // initialize controller 1 for JABS.
  $jabsController1 = new JABS_InputController();
};
//endregion DataManager

//region Input
/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // core buttons.
  90: J.ABS.Input.Mainhand,       // z
  88: J.ABS.Input.Offhand,        // x
  16: J.ABS.Input.Dash,           // shift (already defined)
  67: J.ABS.Input.Tool,           // c

  // functional buttons.
  81: J.ABS.Input.SkillTrigger,   // q
  17: J.ABS.Input.StrafeTrigger,  // ctrl
  69: J.ABS.Input.GuardTrigger,   // e
  9: J.ABS.Input.MobilitySkill,   // tab

  // quickmenu button.
  13: J.ABS.Input.Quickmenu,      // enter

  // party cycling button.
  46: J.ABS.Input.PartyCycle,     // del

  // movement buttons.
  38: J.ABS.Input.DirUp,          // arrow up
  40: J.ABS.Input.DirDown,        // arrow down
  37: J.ABS.Input.DirLeft,        // arrow left
  39: J.ABS.Input.DirRight,       // arrow right

  // keyboard alternative for the multi-button skills.
  49: J.ABS.Input.CombatSkill1,   // 1 = L1 + cross
  50: J.ABS.Input.CombatSkill2,   // 2 = L1 + circle
  51: J.ABS.Input.CombatSkill3,   // 3 = L1 + square
  52: J.ABS.Input.CombatSkill4,   // 4 = L1 + triangle
};
//endregion Input

//region JABS_Engine
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('performPartyCycling', JABS_Engine.prototype.performPartyCycling);
/**
 * Extends `performPartyCycling()` to include reassigning the controller to the player.
 */
JABS_Engine.prototype.performPartyCycling = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('performPartyCycling').call(this);

  // when the player party cycles, update their controls to the updated battler.
  $jabsController1.battler = this.getPlayer1();
};

/**
 * Handles the player input.
 */
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('updateInput', JABS_Engine.prototype.updateInput);
JABS_Engine.prototype.updateInput = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('updateInput').call(this);

  // don't update if we aren't allowed to update.
  if (!this.canUpdateInput()) return;

  // update the input.
  $jabsController1.update();
};
//endregion JABS_Engine