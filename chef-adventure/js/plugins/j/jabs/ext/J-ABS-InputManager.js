//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 ABS-INPUT] A manager for overseeing the input of JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @base J-BASE
 * @orderAfter J-ABS
 * @orderAfter J-BASE
 * @orderBefore J-HUD
 * @help
 * ============================================================================
 * This plugin is an extension of the J-ABS system.
 *
 * This plugin oversees and manages the inputs/controls associated with JABS
 * and oversees the J-HUD-InputFrame data as well.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT_INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT_INPUT = {};
J.ABS.EXT_INPUT.Metadata = {};
J.ABS.EXT_INPUT.Metadata.Version = '1.0.0';
J.ABS.EXT_INPUT.Metadata.Name = `J-ABS-InputManager`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT_INPUT.PluginParameters = PluginManager.parameters(J.ABS.EXT_INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.ABS.EXT_INPUT.Metadata =
  {
    // the previously defined metadata.
    ...J.ABS.EXT_INPUT.Metadata,
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT_INPUT.Aliased =
  {
    Game_Map: new Map(),
    Scene_Map: new Map(),
  };
//#endregion metadata
//#endregion introduction

//#region Custom objects
//#region JABS_InputManager
/**
 * The class that handles input in the context of JABS.
 */
class JABS_InputManager
{
  /**
   * The collection of inputs that JABS will take action with.
   * @type {Map<string, JABS_Input>}
   */
  Keys = new Map();

  /**
   * Constructor.
   */
  constructor()
  {
    this.setupKeys();
  };

  //#region setup keys
  /**
   * Setup all keys and map their inputs to their corresponding actions.
   */
  setupKeys()
  {
    // setup other management input keys.
    this.setupKeyMenu();
    this.setupKeyPartycycle();

    // setup the primary input keys.
    this.setupKeyMainhand();
    this.setupKeyOffhand();
    this.setupKeyTool();
    this.setupKeyGuard();

    // setup the mobility input keys.
    this.setupKeyRotate();
    this.setupKeyStrafe();
    this.setupKeyDodge();

    // setup the combat skill input keys.
    this.setupKeyCombatSkill1();
    this.setupKeyCombatSkill2();
    this.setupKeyCombatSkill3();
    this.setupKeyCombatSkill4();
  };

  /**
   * Sets up the binding between the combat skill 4 and the given input key.
   */
  setupKeyMenu()
  {
    const action = () => $gameBattleMap.performMenuAction();
    const input = new JABS_Input(JABS_Button.Menu, action);
    this.Keys.set(JABS_Button.Menu, input);
  };

  /**
   * Sets up the binding between the combat skill 4 and the given input key.
   */
  setupKeyPartycycle()
  {
    const action = () => $gameBattleMap.rotatePartyMembers();
    const input = new JABS_Input(JABS_Button.Select, action);
    this.Keys.set(JABS_Button.Select, input);
  };


  /**
   * Sets up the binding between the mainhand functionality and the given input key.
   */
  setupKeyMainhand()
  {
    const action = () => $gameBattleMap.performMainhandAction();
    const input = new JABS_Input(JABS_Button.Main, action);
    this.Keys.set(JABS_Button.Main, input);
  };

  /**
   * Sets up the binding between the offhand functionality and the given input key.
   */
  setupKeyOffhand()
  {
    const action = () => $gameBattleMap.performOffhandAction();
    const input = new JABS_Input(JABS_Button.Offhand, action);
    this.Keys.set(JABS_Button.Offhand, input);
  };

  /**
   * Sets up the binding between the tool functionality and the given input key.
   */
  setupKeyTool()
  {
    const action = () => $gameBattleMap.performToolAction();
    const input = new JABS_Input(JABS_Button.Tool, action);
    this.Keys.set(JABS_Button.Tool, input);
  };

  /**
   * Sets up the binding between the guard functionality and the given input key.
   */
  setupKeyGuard()
  {
    const action = () => $gameBattleMap.performGuard(true);
    const alterAction = () => $gameBattleMap.performGuard(false);
    const input = new JABS_Input(JABS_Button.Guard, action, alterAction);
    this.Keys.set(JABS_Button.Guard, input);
  };

  /**
   * Sets up the binding between the rotate and the given input key.
   */
  setupKeyRotate()
  {
    const action = () => $gameBattleMap.performRotate(true);
    const alterAction = () => $gameBattleMap.performRotate(false);
    const input = new JABS_Input(JABS_Button.Rotate, action, alterAction);
    this.Keys.set(JABS_Button.Rotate, input);
  };

  /**
   * Sets up the binding between the strafe and the given input key.
   */
  setupKeyStrafe()
  {
    const action = () => $gameBattleMap.performStrafe(true);
    const alterAction = () => $gameBattleMap.performStrafe(false);
    const input = new JABS_Input(JABS_Button.Strafe, action, alterAction);
    this.Keys.set(JABS_Button.Strafe, input);
  };

  /**
   * Sets up the binding between the dodge and the given input key.
   */
  setupKeyDodge()
  {
    const action = () => $gameBattleMap.performDodgeAction();
    const input = new JABS_Input(JABS_Button.Dodge, action);
    this.Keys.set(JABS_Button.Dodge, input);
  };

  /**
   * Sets up the binding between the combat skill 1 and the given input key.
   */
  setupKeyCombatSkill1()
  {
    const action = () => $gameBattleMap.performCombatAction(JABS_Button.CombatSkill1);
    const input = new JABS_Input(JABS_Button.CombatSkill1, action);
    this.Keys.set(JABS_Button.CombatSkill1, input);
  };

  /**
   * Sets up the binding between the combat skill 2 and the given input key.
   */
  setupKeyCombatSkill2()
  {
    const action = () => $gameBattleMap.performCombatAction(JABS_Button.CombatSkill2);
    const input = new JABS_Input(JABS_Button.CombatSkill2, action);
    this.Keys.set(JABS_Button.CombatSkill2, input);
  };

  /**
   * Sets up the binding between the combat skill 3 and the given input key.
   */
  setupKeyCombatSkill3()
  {
    const action = () => $gameBattleMap.performCombatAction(JABS_Button.CombatSkill3);
    const input = new JABS_Input(JABS_Button.CombatSkill3, action);
    this.Keys.set(JABS_Button.CombatSkill3, input);
  };

  /**
   * Sets up the binding between the combat skill 4 and the given input key.
   */
  setupKeyCombatSkill4()
  {
    const action = () => $gameBattleMap.performCombatAction(JABS_Button.CombatSkill4);
    const input = new JABS_Input(JABS_Button.CombatSkill4, action);
    this.Keys.set(JABS_Button.CombatSkill4, input);
  };
  //#endregion setup keys

  /**
   * Updates the input loop for tracking JABS input.
   */
  update()
  {
    // update input for the management actions.
    this.updateMenuAction();
    this.updatePartycycleAction();

    // update input for the primary actions.
    this.updateMainhand();
    this.updateOffhand();
    this.updateToolCommand();
    this.updateGuardCommand();

    // update input for the mobility actions
    this.updateDodgeCommand();
    this.updateStrafeCommand();
    this.updateRotateCommand();

    // update input for combat actions (combo keys).
    this.updateCombatAction1();
    this.updateCombatAction2();
    this.updateCombatAction3();
    this.updateCombatAction4();
  };

  //#region menu action
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
  };

  /**
   * Checks the inputs of the menu action (Menu default).
   * @returns {boolean}
   */
  isMenuActionTriggered()
  {
    // this action requires Menu to be triggered.
    if (Input.isTriggered(J.ABS.Input.Start))
    {
      return true;
    }

    // Menu was never triggered.
    return false;
  };

  /**
   * Executes the menu action (Menu default).
   */
  performMenuAction()
  {
    this.Keys.get(JABS_Button.Menu).action();
  };
  //#endregion menu action

  //#region party cycle
  /**
   * Monitors and takes action based on player input regarding party cycling.
   * This is `Select` on the gamepad by default.
   */
  updatePartycycleAction()
  {
    // check if the action's input requirements have been met.
    if (this.isPartycycleActionTriggered())
    {
      // execute the action.
      this.performPartycycleAction();
    }
  };

  /**
   * Checks the inputs of the party cycle action (Select default).
   * @returns {boolean}
   */
  isPartycycleActionTriggered()
  {
    // this action requires Select to be triggered.
    if (Input.isTriggered(J.ABS.Input.Select))
    {
      return true;
    }

    // Select was never triggered.
    return false;
  };

  /**
   * Executes the party cycle action (Select default).
   */
  performPartycycleAction()
  {
    this.Keys.get(JABS_Button.Select).action();
  };
  //#endregion party cycle

  //#region mainhand
  /**
   * Monitors and takes action based on player input regarding the mainhand action.
   * This is `A` on the gamepad by default.
   */
  updateMainhand()
  {
    // check if the action's input requirements have been met.
    if (this.isMainhandActionTriggered())
    {
      // execute the action.
      this.performMainhandAction();
    }
  };

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
    if (Input.isTriggered(J.ABS.Input.A))
    {
      return true;
    }

    // A is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned mainhand action (A default).
   */
  performMainhandAction()
  {
    this.Keys.get(JABS_Button.Main).action();
  };
  //#endregion mainhand

  //#region offhand
  /**
   * Monitors and takes action based on player input regarding the offhand action.
   * This is `B` on the gamepad by default.
   */
  updateOffhand()
  {
    // check if the action's input requirements have been met.
    if (this.isOffhandActionTriggered())
    {
      // execute the action.
      this.performOffhandAction()
    }
  };

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
    if (Input.isTriggered(J.ABS.Input.B))
    {
      return true;
    }

    // B is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned offhand action (B default).
   */
  performOffhandAction()
  {
    this.Keys.get(JABS_Button.Offhand).action();
  };
  //#endregion offhand

  //#region tool
  /**
   * Monitors and takes action based on player input regarding the tool action.
   * This is `Y` on the gamepad by default.
   */
  updateToolCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isToolActionTriggered())
    {
      // execute the action.
      this.performToolAction();
    }
  };

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
    if (Input.isTriggered(J.ABS.Input.Y))
    {
      return true;
    }

    // Y is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned tool action (Y default).
   */
  performToolAction()
  {
    this.Keys.get(JABS_Button.Tool).action();
  };
  //#endregion offhand

  //#region dodge
  /**
   * Monitors and takes action based on player input regarding the dodge action.
   * This is `R2` on the gamepad by default.
   */
  updateDodgeCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isDodgeActionTriggered())
    {
      // execute the action.
      this.performDodgeAction();
    }
  };

  /**
   * Checks the inputs of the dodge action currently assigned (R2 default).
   * @returns {boolean}
   */
  isDodgeActionTriggered()
  {
    // this action requires R2 to be triggered.
    if (Input.isTriggered(J.ABS.Input.R2))
    {
      return true;
    }

    // R2 is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned dodge action (R2 default).
   */
  performDodgeAction()
  {
    this.Keys.get(JABS_Button.Dodge).action();
  };
  //#endregion dodge

  //#region strafe
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
  };

  /**
   * Checks the inputs of the strafe action currently assigned (L2 default).
   * @returns {boolean}
   */
  isStrafeActionTriggered()
  {
    // this action requires L2 to be triggered.
    if (Input.isPressed(J.ABS.Input.L2))
    {
      return true;
    }

    // R2 is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned strafe action (L2 default).
   */
  performStrafeAction()
  {
    this.Keys.get(JABS_Button.Strafe).action();
  };

  /**
   * Executes the currently assigned strafe alter-action (untouched-L2 default).
   */
  performStrafeAlterAction()
  {
    this.Keys.get(JABS_Button.Strafe).alterAction();
  };
  //#endregion strafe

  //#region rotate
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
  };

  /**
   * Checks the inputs of the rotate action currently assigned (L2 default).
   * @returns {boolean}
   */
  isRotateActionTriggered()
  {
    // this action requires R1 to be triggered.
    if (Input.isPressed(J.ABS.Input.R1))
    {
      return true;
    }

    // R1 is not being triggered.
    return false;
  };

  /**
   * Executes the currently assigned rotate action (R1 default).
   */
  performRotateAction()
  {
    this.Keys.get(JABS_Button.Rotate).action();
  };

  /**
   * Executes the currently assigned rotate alter-action (untouched-R1 default).
   */
  performRotateAlterAction()
  {
    this.Keys.get(JABS_Button.Rotate).alterAction();
  };
  //#endregion strafe

  //#region guard
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
  };

  /**
   * Checks the inputs of the guard action currently assigned (R1 default).
   * @returns {boolean}
   */
  isGuardActionTriggered()
  {
    // this action requires R1 to be held down.
    if (Input.isPressed(J.ABS.Input.R1))
    {
      return true;
    }

    // R1 is not being held down.
    return false;
  };

  /**
   * Activates the currently assigned guard action (untouched-R1 default).
   */
  performGuardAction()
  {
    this.Keys.get(JABS_Button.Guard).action();
  };

  /**
   * Deactivates the currently assigned guard alter-action (untouched-R1 default).
   */
  performGuardAlterAction()
  {
    this.Keys.get(JABS_Button.Guard).alterAction();
  };
  //#endregion guard

  //#region combat actions
  /**
   * Checks the inputs to ensure the combat action enabler is being held down.
   * (L1 default).
   * @returns {boolean}
   */
  isCombatSkillUsageEnabled()
  {
    // this action requires L1 to be held down.
    if (Input.isPressed(J.ABS.Input.L1))
    {
      return true;
    }

    // L1 is not being held down.
    return false;
  };

  //#region combat action 1
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
      this.performCombatAction1();
    }
  };

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
      if (Input.isTriggered(J.ABS.Input.A))
      {
        return true;
      }
    }

    // A was never triggered while L1 was held down.
    return false;
  };

  /**
   * Executes the combat action in slot 1 (L1+A default).
   */
  performCombatAction1()
  {
    this.Keys.get(JABS_Button.CombatSkill1).action();
  };
  //#endregion combat action 1

  //#region combat action 2
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
      this.performCombatAction2();
    }
  };

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
      if (Input.isTriggered(J.ABS.Input.B))
      {
        return true;
      }
    }

    // B was never triggered while L1 was held down.
    return false;
  };

  /**
   * Executes the combat action in slot 2 (L1+B default).
   */
  performCombatAction2()
  {
    this.Keys.get(JABS_Button.CombatSkill2).action();
  };
  //#endregion combat action 2

  //#region combat action 3
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
      this.performCombatAction3();
    }
  };

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
      if (Input.isTriggered(J.ABS.Input.X))
      {
        return true;
      }
    }

    // X was never triggered while L1 was held down.
    return false;
  };

  /**
   * Executes the combat action in slot 3 (L1+X default).
   */
  performCombatAction3()
  {
    this.Keys.get(JABS_Button.CombatSkill3).action();
  };
  //#endregion combat action 3

  //#region combat action 4
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
      this.performCombatAction4();
    }
  };

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
      if (Input.isTriggered(J.ABS.Input.Y))
      {
        return true;
      }
    }

    // Y was never triggered while L1 was held down.
    return false;
  };

  /**
   * Executes the combat action in slot 4 (L1+Y default).
   */
  performCombatAction4()
  {
    this.Keys.get(JABS_Button.CombatSkill4).action();
  };
  //#endregion combat action 4

  //#endregion combat actions
}
//#endregion JABS_InputManager

//#region JABS_Input
/**
 * A class representing a key and the functionality it performs when
 */
class JABS_Input
{
  /**
   * The key representing this input.
   * @returns {JABS_Button}
   */
  key = String.empty;

  /**
   * The action performed when this key is input.
   * @returns {function}
   */
  action = () => { console.log(`hello from JABS v${J.ABS.Metadata.Version}!`); };

  /**
   * The alternative action performed when this key's input is not being met.
   * This is optionally available.
   * @returns {function}
   */
  alterAction = () => { console.log(`goodbye for now!`) };

  /**
   * Constructor.
   * @param {JABS_Button} key The key representing this input.
   * @param {function} action The action to execute for this input.
   * @param {function} alterAction The alternative action executed while input is not met.
   */
  constructor(key, action, alterAction)
  {
    this.key = key;
    this.action = action;
    this.alterAction = alterAction;
  };
}
//#endregion JABS_Input

//#region JABS_Button
/**
 * A static class containing all input keys available for JABS.
 */
class JABS_Button
{
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

  /**
   * The "main", "A" button, or "Z" key.
   * Used for executing the mainhand action.
   * @type {string}
   */
  static Main = "Main";

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

  /**
   * Gets all inputs that are available for assignment
   * in one way or another.
   * @returns {string[]} A collection of JABS-input keys' identifiers.
   */
  static assignableInputs()
  {
    return [
      // primary
      this.Main,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // L1 + buttons
      this.CombatSkill1,
      this.CombatSkill2,
      this.CombatSkill3,
      this.CombatSkill4,
    ];
  };
}
//#endregion JABS_Button
//#endregion Custom objects