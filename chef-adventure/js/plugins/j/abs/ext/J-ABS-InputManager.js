//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 INPUT] A manager for overseeing the input of JABS.
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
 * OVERVIEW
 * ----------------------------------------------------------------------------
 * This plugin is a mapping of inputs to controls for JABS.
 *
 * This plugin requires JABS.
 * This plugin has no additional configuration required.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This entire plugin provides an implementation of a "controller" that the
 * player leverages to control inputs for JABS. With it, the player can press
 * keys or buttons to trigger JABS-specific functionality, like execution of
 * a skill, cycling with other members of the party, or bringing up the quick
 * menu. This plugin also provides a way to remap inputs to different keys or
 * buttons to suit the player's preferences.
 *
 * NOTE ABOUT DUPLICATES:
 * No single input can be mapped to multiple actions. Mapping the same input
 * to a second action will unbind the original. Be sure all actions you care
 * about are mapped! These cannot be undone mid-run by the player! (but they
 * can there is an exposed function on Game_System that will reset all input
 * mapping back to defaults via script call if necessary).
 *
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 2.0.0
 *   Significantly overhauled the plugin to support with input remapping.
 * - 1.0.0
 *   Initial release.
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
J.ABS.EXT.INPUT.Metadata.Version = '2.0.0';
J.ABS.EXT.INPUT.Metadata.Name = `J-ABS-InputManager`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.INPUT.PluginParameters = PluginManager.parameters(J.ABS.EXT.INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.ABS.EXT.INPUT.Metadata = {
  // the previously defined metadata.
  ...J.ABS.EXT.INPUT.Metadata,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.INPUT.Aliased = {
  DataManager: new Map(),
  Game_System: new Map(),
  Input: new Map(),
  JABS_Engine: new Map(),
  JABS_Battler: new Map(),
  Window_MenuCommand: new Map(),
  Scene_Menu: new Map(),
};
//endregion metadata

/**
 * The global reference for the player's input manager.
 * This interprets and manages incoming inputs for JABS-related functionality.
 * @type {JABS_StandardController}
 * @global
 */
// eslint-disable-next-line no-unused-vars
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
  const playerJabsBattler = J.ABS.EXT.INPUT.Aliased.JABS_Battler.get('createPlayer')
    .call(this);

  // assign newly players are created to controller 1.
  $jabsController1.setBattler(playerJabsBattler);

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
  static Menu = 'Menu';

  /**
   * The "select" key.
   * Used for party-cycling.
   * @type {string}
   */
  static Select = 'Select';
  //endregion functionality

  //region primary
  /**
   * The "main", "A" button, or "Z" key.
   * Used for executing the mainhand action.
   * @type {string}
   */
  static Mainhand = 'Main';

  /**
   * The "offhand", "B" button, or "X" key.
   * Used for executing the offhand action.
   * @type {string}
   */
  static Offhand = 'Offhand';

  /**
   * The "tool", "Y" button, or "C" key.
   * Used for executing the currently selected tool skill.
   * @type {string}
   */
  static Tool = 'Tool';

  /**
   * The "dodge", "R2" button, or "Tab" key.
   * Used for executing the currently selected dodge skill.
   * @type {string}
   */
  static Dodge = 'Dodge';
  //endregion primary

  //region mobility & modifiers
  /**
   * The sprint/dash input (engine-native dash replacement).
   * While held, the player sprints if allowed.
   * @type {string}
   */
  static Sprint = "Sprint";

  /**
   * The "strafe", "L2" button, or "Left Ctrl" key.
   * Used for locking the direction faced while the input is held.
   * @type {string}
   */
  static Strafe = 'Strafe';

  /**
   * The "rotate", "R1" button, or "W" and "E" key(s).
   * Used for locking in-place while the input is held.
   * @type {string}
   */
  static Rotate = 'Rotate';

  /**
   * The "guard", "R1" button, or "W", and "E" key(s).
   * Used for activating the guard function while the input is held.
   * @type {string}
   */
  static Guard = 'Guard';

  /**
   * The combat "enabler" (commonly L1 hold on gamepads).
   * Used as a modifier to enable Combat Skill 1–4 actions while held.
   * @type {string}
   */
  static SkillTrigger = 'SkillTrigger';
  //endregion mobility & modifiers

  //region L1 + buttons
  /**
   * The `L1 + A` or 1 key.
   * Executes combat skill 1.
   * @type {string}
   */
  static CombatSkill1 = 'CombatSkill1';

  /**
   * The `L1 + B` or 2 key.
   * Executes combat skill 2.
   * @type {string}
   */
  static CombatSkill2 = 'CombatSkill2';

  /**
   * The `L1 + X` or 3 key.
   * Executes combat skill 3.
   * @type {string}
   */
  static CombatSkill3 = 'CombatSkill3';

  /**
   * The `L1 + Y` or 4 key.
   * Executes combat skill 4.
   * @type {string}
   */
  static CombatSkill4 = 'CombatSkill4';

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
      this.Mainhand, this.Offhand, this.Tool, this.Dodge,

      // modifiers & mobility
      this.SkillTrigger, this.Sprint, this.Strafe, this.Rotate,

      // functionality
      this.Menu, this.Select,
    ];

    // a filter function for ensuring only the correct inputs are accepted.
    const filtering = buttonInput => okInputs.includes(buttonInput);

    // return the filtered buttons.
    return this.allButtons()
      .filter(filtering);
  }

  /**
   * Gets all currently available buttons used for JABS.
   * @returns {string[]} A collection of JABS-input key's identifiers.
   */
  static allButtons()
  {
    return [
      // primary
      this.Mainhand, this.Offhand, this.Tool, this.Sprint,


      // mobility & modifiers
      this.SkillTrigger,  this.Strafe, this.Rotate, this.Guard, this.Dodge,

      // L1 + buttons
      this.CombatSkill1, this.CombatSkill2, this.CombatSkill3, this.CombatSkill4,

      // functionality
      this.Menu, this.Select,
    ];
  }
}

//endregion JABS_Button

//region JABS_InputAdapter.getAllControllers
/**
 * Gets all registered input controllers managed by the adapter.
 * Returns a shallow copy to prevent external mutation.
 * @returns {JABS_StandardController[]} The list of registered controllers.
 */
JABS_InputAdapter.getAllControllers = function()
{
  // return a shallow copy of the internal controllers list.
  return this.controllers.slice(0);
};
//endregion JABS_InputAdapter.getAllControllers

//region JABS_InputController
/**
 * The class that handles input in the context of JABS for a player.
 * A battler must be set in order for this to update.
 * It is important to note that rotate and guard are arbitrarily coupled together by this controller.
 */
class JABS_StandardController
  extends JABS_BaseController
{
  /**
   * Constructor.
   */
  constructor()
  {
    // also run superclass constructor for registration.
    super();

    // initialize this.
    this.initialize();
  }

  /**
   * Initializes this class.
   */
  initialize()
  {
    // initialize the other members of the class.
    this.initMembers();

    // initialize default mappings.
    this.initMapping();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    // start with a null battler when initializing.
    this.battler = null;

    /**
     * A collection of input mappings from logical action (button) to an array of physical inputs.
     * "Physical inputs" are `Input` symbols like `ok`, `cancel`, or custom entries registered by plugins.
     * @type {Map<string, string[]>}
     */
    this.inputMapping = new Map();
  }

  /**
   * Initialize the button-to-input mappings.
   * Seeds from current JABS defaults.
   */
  initMapping()
  {
    // seed defaults from current JABS input symbols using string[] per action.
    this.inputMapping.set(JABS_Button.Menu, [ J.ABS.Input.Quickmenu ]);
    this.inputMapping.set(JABS_Button.Select, [ J.ABS.Input.PartyCycle ]);

    // seed primaries.
    this.inputMapping.set(JABS_Button.Mainhand, [ J.ABS.Input.Mainhand ]);
    this.inputMapping.set(JABS_Button.Offhand, [ J.ABS.Input.Offhand ]);
    this.inputMapping.set(JABS_Button.Tool, [ J.ABS.Input.Tool ]);
    this.inputMapping.set(JABS_Button.Dodge, [ J.ABS.Input.MobilitySkill ]);

    // seed mobility & modifiers.
    this.inputMapping.set(JABS_Button.Sprint, [ J.ABS.Input.Dash ]);
    this.inputMapping.set(JABS_Button.Strafe, [ J.ABS.Input.StrafeTrigger ]);
    this.inputMapping.set(JABS_Button.Rotate, [ J.ABS.Input.GuardTrigger ]);
    this.inputMapping.set(JABS_Button.Guard, [ J.ABS.Input.GuardTrigger ]);
    this.inputMapping.set(JABS_Button.SkillTrigger, [ J.ABS.Input.SkillTrigger ]);

    // seed L1 + buttons (combat skills).
    this.inputMapping.set(JABS_Button.CombatSkill1, [ J.ABS.Input.CombatSkill1 ]);
    this.inputMapping.set(JABS_Button.CombatSkill2, [ J.ABS.Input.CombatSkill2 ]);
    this.inputMapping.set(JABS_Button.CombatSkill3, [ J.ABS.Input.CombatSkill3 ]);
    this.inputMapping.set(JABS_Button.CombatSkill4, [ J.ABS.Input.CombatSkill4 ]);
  }

  /**
   * Builds a plain-object of the default mappings without mutating this controller.
   * This is safe to use for "Reset to Defaults" previews in the remap scene.
   * @returns {Object<string, string[]>} The default logical->physical mapping.
   */
  buildDefaultMapping()
  {
    // create a new object to hold the default mappings.
    const defaults = {};

    // seed defaults from current JABS input symbols using string[] per action.
    defaults[JABS_Button.Menu] = [ J.ABS.Input.Quickmenu ];
    defaults[JABS_Button.Select] = [ J.ABS.Input.PartyCycle ];

    // seed primaries.
    defaults[JABS_Button.Mainhand] = [ J.ABS.Input.Mainhand ];
    defaults[JABS_Button.Offhand] = [ J.ABS.Input.Offhand ];
    defaults[JABS_Button.Tool] = [ J.ABS.Input.Tool ];
    defaults[JABS_Button.Dodge] = [ J.ABS.Input.MobilitySkill ];

    // seed mobility/modifiers.
    defaults[JABS_Button.Sprint] = [ J.ABS.Input.Dash ];
    defaults[JABS_Button.Strafe] = [ J.ABS.Input.StrafeTrigger ];
    defaults[JABS_Button.Rotate] = [ J.ABS.Input.GuardTrigger ];
    defaults[JABS_Button.Guard] = [ J.ABS.Input.GuardTrigger ];
    defaults[JABS_Button.SkillTrigger] = [ J.ABS.Input.SkillTrigger ];

    // seed L1 + buttons (combat skills).
    defaults[JABS_Button.CombatSkill1] = [ J.ABS.Input.CombatSkill1 ];
    defaults[JABS_Button.CombatSkill2] = [ J.ABS.Input.CombatSkill2 ];
    defaults[JABS_Button.CombatSkill3] = [ J.ABS.Input.CombatSkill3 ];
    defaults[JABS_Button.CombatSkill4] = [ J.ABS.Input.CombatSkill4 ];

    // return the assembled defaults.
    return defaults;
  }

  /**
   * Resets this controller’s live bindings back to the defaults.
   * Does not touch persistence; the caller should save if desired.
   */
  resetToDefaults()
  {
    // rebuild the default mapping without mutating first.
    const defaults = this.buildDefaultMapping();

    // apply the defaults to this controller.
    this.setAllInputs(defaults);
  }

  /**
   * Gets the physical inputs for the given logical button.
   * @param {string} button The logical action key.
   * @returns {string[]} The list of physical inputs associated with this action.
   */
  getInputsForButton(button)
  {
    // get the configured value for this button.
    const raw = this.inputMapping.get(button);

    // return an empty array if nothing was configured.
    if (!raw) return [];

    // normalize string -> [ string ], and copy arrays for safety.
    if (Array.isArray(raw)) return raw.slice(0);

    // if the mapping is a single string, convert it into an array.
    return [ raw ];
  }

  /**
   * Gets the primary physical input for the given button (convenience).
   * @param {string} slot The logical action key.
   * @returns {string|undefined} The first physical input, if any.
   */
  getInputForButton(slot)
  {
    // grab the list of inputs for the button.
    const inputs = this.getInputsForButton(slot);

    // return the first one from the list, if available.
    return inputs.length > 0
      ? inputs[0]
      : undefined;
  }

  /**
   * Overwrites the entire mapping for this controller in one call.
   * Accepts either a `Map<string, string|string[]>` or a plain object `{ [button]: string|string[] }`.
   * No saving happens here; this is purely runtime state.
   * @param {Map<string,(string|string[])>|Object<string,(string|string[])>} mapping The mapping to apply.
   */
  setAllInputs(mapping)
  {
    // clear current map before applying new one.
    this.inputMapping.clear();

    // helper to normalize a mapping entry into an array of strings.
    const toArray = value =>
    {
      // return a shallow copy if the value is already an array.
      if (Array.isArray(value)) return value.slice(0);

      // return an empty array if there is no value.
      if (!value) return [];

      // otherwise, wrap the single value in an array.
      return [ value ];
    };

    // apply based on input type.
    if (mapping instanceof Map)
    {
      // copy entries from the provided map.
      mapping.forEach((value, key) =>
      {
        // set the normalized entry for this key.
        this.inputMapping.set(key, toArray(value));
      }, this);
    }
    else
    {
      // treat it like a POJO and copy own keys.
      Object.keys(mapping)
        .forEach(key =>
        {
          // set the normalized entry for this key.
          this.inputMapping.set(key, toArray(mapping[key]));
        });
    }

    // read the current rotate inputs (if any) after normalization.
    const rotateInputs = this.inputMapping.get(JABS_Button.Rotate) || [];

    // overwrite Guard with a cloned copy of Rotate’s inputs.
    this.inputMapping.set(JABS_Button.Guard, rotateInputs.slice(0));
  }

  /**
   * Exports the current mapping as a plain object suitable for saving.
   * @returns {Object<string,string[]>} A shallow copy of the current mapping.
   */
  exportAllInputs()
  {
    // create a plain object export of the map.
    const out = {};

    // iterate all entries and copy arrays into the object.
    this.inputMapping.forEach((value, key) => out[key] = Array.isArray(value)
      ? value.slice(0)
      : []);

    // return the export.
    return out;
  }

  /**
   * Determines if any physical input bound to the logical action was triggered this frame.
   * @param {string} button The logical action key.
   * @returns {boolean}
   */
  isActionTriggered(button)
  {
    // get the inputs to check.
    const inputs = this.getInputsForButton(button);

    // iterate all inputs and short-circuit on the first triggered.
    for (let i = 0; i < inputs.length; i++)
    {
      // grab the physical input at this index.
      const physical = inputs[i];

      // if this physical input was triggered, then the action is triggered.
      if (Input.isTriggered(physical)) return true;
    }

    // none of the inputs were triggered for this action.
    return false;
  }

  /**
   * Determines if any physical input bound to the logical action is currently pressed.
   * @param {string} button The logical action key.
   * @returns {boolean}
   */
  isActionPressed(button)
  {
    // get the inputs to check.
    const inputs = this.getInputsForButton(button);

    // iterate all inputs and short-circuit on the first pressed.
    for (let i = 0; i < inputs.length; i++)
    {
      // grab the physical input at this index.
      const physical = inputs[i];

      // if this physical input is pressed, then the action is pressed.
      if (Input.isPressed(physical)) return true;
    }

    // none of the inputs are pressed for this action.
    return false;
  }

  //region update
  /**
   * Updates the input loop for tracking JABS input.
   */
  update()
  {
    // if updating is not available, then do not.
    if (this.canUpdate() === false) return;

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
    this.updateSprintCommand();
    this.updateGuardCommand();
    this.updateStrafeCommand();
    this.updateRotateCommand();
  }

  /**
   * Checks whether or not we can update this controller's input.
   * @returns {boolean}
   */
  canUpdate()
  {
    // if we don't have a battler, we can't update their input.
    if (this.getBattler() === null) return false;

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
    if (this.isActionTriggered(JABS_Button.Menu))
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
    // perform the quick menu action via the adapter.
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
    if (this.isActionTriggered(JABS_Button.Select))
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
    // perform party cycling via the adapter.
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

    // this action requires the logical Mainhand to be triggered.
    if (this.isActionTriggered(JABS_Button.Mainhand))
    {
      return true;
    }

    // Mainhand is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned mainhand action (A default).
   */
  performMainhandAction()
  {
    // perform the mainhand action for this controller's battler.
    JABS_InputAdapter.performMainhandAction(this.getBattler());
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
      this.performOffhandAction();
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

    // this action requires the logical Offhand to be triggered.
    if (this.isActionTriggered(JABS_Button.Offhand))
    {
      return true;
    }

    // Offhand is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned offhand action (B default).
   */
  performOffhandAction()
  {
    // perform the offhand action for this controller's battler.
    JABS_InputAdapter.performOffhandAction(this.getBattler());
  }

  //endregion offhand

  //region sprint
  updateSprintCommand()
  {
    // check if the action's input requirements have been met.
    if (this.isSprintActionTriggered())
    {
      // execute the action.
      this.performSprintAction();
    }
    // if they aren't being met.
    else
    {
      // then execute the alter-action.
      this.performSprintAlterAction();
    }
  }

  /**
   * Checks the inputs of the sprint action currently assigned (Shift default).
   * @returns {boolean}
   */
  isSprintActionTriggered()
  {
    // this action requires Sprint to be pressed.
    if (this.isActionPressed(JABS_Button.Sprint))
    {
      return true;
    }

    // Sprint is not being pressed.
    return false;
  }

  /**
   * Enables sprinting for this controller's battler.
   */
  performSprintAction()
  {
    // perform sprint enable for this controller's battler.
    JABS_InputAdapter.performSprint(true, this.battler);
  }

  /**
   * Disables sprinting for this controller's battler.
   */
  performSprintAlterAction()
  {
    // perform sprint disable for this controller's battler.
    JABS_InputAdapter.performSprint(false, this.battler);
  }
  //endregion sprint

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

    // this action requires the logical Tool to be triggered.
    if (this.isActionTriggered(JABS_Button.Tool))
    {
      return true;
    }

    // Tool is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned tool action (Y default).
   */
  performToolAction()
  {
    // perform the tool action for this controller's battler.
    JABS_InputAdapter.performToolAction(this.getBattler());
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
    // this action requires the logical Dodge to be triggered.
    if (this.isActionTriggered(JABS_Button.Dodge))
    {
      return true;
    }

    // Dodge is not being triggered.
    return false;
  }

  /**
   * Executes the currently assigned dodge action (R2 default).
   */
  performDodgeAction()
  {
    // perform the dodge action for this controller's battler.
    JABS_InputAdapter.performDodgeAction(this.getBattler());
  }

  //endregion dodge

  //region combat actions
  /**
   * Checks the inputs to ensure the combat action enabler is being held down (L1 default).
   * @returns {boolean}
   */
  isCombatSkillUsageEnabled()
  {
    // this action requires the logical SkillTrigger to be held down.
    if (this.isActionPressed(JABS_Button.SkillTrigger))
    {
      return true;
    }

    // SkillTrigger is not being held down.
    return false;
  }

  /**
   * Executes the combat action in the given slot.
   * @param {string} slot The slot to execute the combo action from.
   */
  performCombatAction(slot)
  {
    // perform the combat action for this controller's battler and the given slot.
    JABS_InputAdapter.performCombatAction(slot, this.getBattler());
  }

  //region combat action 1
  /**
   * Monitors and takes action based on player input regarding combat action 1.
   * This is `L1 + Mainhand` on the gamepad by default.
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
   * Checks the inputs of the combat action in slot 1.
   * Requires SkillTrigger held and CombatSkill1 triggered.
   * @returns {boolean}
   */
  isCombatAction1Triggered()
  {
    // if the SkillTrigger is being held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and Mainhand is triggered this frame, then combat action 1 should fire.
      if (this.isActionTriggered(JABS_Button.Mainhand))
      {
        return true;
      }
    }

    // alternatively, if the keyboard shortcut for CombatSkill1 was triggered, then fire.
    if (this.isActionTriggered(JABS_Button.CombatSkill1))
    {
      return true;
    }

    // neither the chord nor the keyboard shortcut were used.
    return false;
  }

  //endregion combat action 1

  //region combat action 2
  /**
   * Monitors and takes action based on player input regarding combat action 2.
   * This is `L1 + Offhand` on the gamepad by default.
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
   * Checks the inputs of the combat action in slot 2.
   * Requires SkillTrigger held and CombatSkill2 triggered.
   * @returns {boolean}
   */
  isCombatAction2Triggered()
  {
    // if the SkillTrigger is being held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and Offhand is triggered this frame, then combat action 2 should fire.
      if (this.isActionTriggered(JABS_Button.Offhand))
      {
        return true;
      }
    }

    // alternatively, if the keyboard shortcut for CombatSkill2 was triggered, then fire.
    if (this.isActionTriggered(JABS_Button.CombatSkill2))
    {
      return true;
    }

    // neither the chord nor the keyboard shortcut were used.
    return false;
  }

  //endregion combat action 2

  //region combat action 3
  /**
   * Monitors and takes action based on player input regarding combat action 3.
   * This is `L1 + Dash` (X) on the gamepad by default.
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
   * Checks the inputs of the combat action in slot 3.
   * Requires SkillTrigger held and CombatSkill3 triggered.
   * @returns {boolean}
   */
  isCombatAction3Triggered()
  {
    // if the SkillTrigger is being held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and Dodge is triggered this frame, then combat action 3 should fire.
      if (this.isActionTriggered(JABS_Button.Dodge))
      {
        return true;
      }
    }

    // alternatively, if the keyboard shortcut for CombatSkill3 was triggered, then fire.
    if (this.isActionTriggered(JABS_Button.CombatSkill3))
    {
      return true;
    }

    // neither the chord nor the keyboard shortcut were used.
    return false;
  }

  //endregion combat action 3

  //region combat action 4
  /**
   * Monitors and takes action based on player input regarding combat action 4.
   * This is `L1 + Tool` (Y) on the gamepad by default.
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
   * Checks the inputs of the combat action in slot 4.
   * Requires SkillTrigger held and CombatSkill4 triggered.
   * @returns {boolean}
   */
  isCombatAction4Triggered()
  {
    // if the SkillTrigger is being held down...
    if (this.isCombatSkillUsageEnabled())
    {
      // ...and Tool is triggered this frame, then combat action 4 should fire.
      if (this.isActionTriggered(JABS_Button.Tool))
      {
        return true;
      }
    }

    // alternatively, if the keyboard shortcut for CombatSkill4 was triggered, then fire.
    if (this.isActionTriggered(JABS_Button.CombatSkill4))
    {
      return true;
    }

    // neither the chord nor the keyboard shortcut were used.
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
    // this action requires Strafe to be pressed.
    if (this.isActionPressed(JABS_Button.Strafe))
    {
      return true;
    }

    // Strafe is not being pressed.
    return false;
  }

  /**
   * Executes the currently assigned strafe action (L2 default).
   */
  performStrafeAction()
  {
    // perform strafe enable for this controller's battler.
    JABS_InputAdapter.performStrafe(true, this.getBattler());
  }

  /**
   * Executes the currently assigned strafe alter-action (untouched-L2 default).
   */
  performStrafeAlterAction()
  {
    // perform strafe disable for this controller's battler.
    JABS_InputAdapter.performStrafe(false, this.getBattler());
  }

  //endregion strafe

  //region rotate
  /**
   * Monitors and takes action based on player input regarding the rotate action.
   * This is `R1` on the gamepad by default.
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
   * Checks the inputs of the rotate action currently assigned (R1 default).
   * @returns {boolean}
   */
  isRotateActionTriggered()
  {
    // this action requires Rotate to be pressed.
    if (this.isActionPressed(JABS_Button.Rotate))
    {
      return true;
    }

    // Rotate is not being pressed.
    return false;
  }

  /**
   * Executes the currently assigned rotate action (R1 default).
   */
  performRotateAction()
  {
    // perform rotate enable for this controller's battler.
    JABS_InputAdapter.performRotate(true, this.getBattler());

    // also enable guarding while rotating; adapter/battler will vet eligibility.
    JABS_InputAdapter.performGuard(true, this.getBattler());
  }

  /**
   * Executes the currently assigned rotate alter-action (untouched-R1 default).
   */
  performRotateAlterAction()
  {
    // perform rotate disable for this controller's battler.
    JABS_InputAdapter.performRotate(false, this.getBattler());

    // also disable guarding when rotation stops; adapter/battler will vet eligibility.
    JABS_InputAdapter.performGuard(false, this.getBattler());
  }

  //endregion rotate

  //region guard
  /**
   * Monitors and takes action based on player input regarding the guard action.
   * This is `R1` on the gamepad by default.
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
    // this action requires Guard to be held down.
    if (this.isActionPressed(JABS_Button.Guard))
    {
      return true;
    }

    // Guard is not being held down.
    return false;
  }

  /**
   * Activates the currently assigned guard action (R1 default).
   */
  performGuardAction()
  {
    // perform guard enable for this controller's battler.
    JABS_InputAdapter.performGuard(true, this.getBattler());
  }

  /**
   * Deactivates the currently assigned guard alter-action (untouched-R1 default).
   */
  performGuardAlterAction()
  {
    // perform guard disable for this controller's battler.
    JABS_InputAdapter.performGuard(false, this.getBattler());
  }

  //endregion guard
}

//endregion JABS_InputController

//region DataManager
J.ABS.EXT.INPUT.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.DataManager.get('createGameObjects')
    .call(this);

  // Ensure engine-wide input remap defaults/labels are bootstrapped once per session.
  Input.ensureRemapBootstrapped();

  // register JABS icons.
  IconManager.registerJabsIcons();
  IconManager.registerJabsInputTexts();

  // initialize controller 1 for JABS.
  if (!$jabsController1)
  {
    // TODO: figure out how to prevent duplicate registration of controllers.
    $jabsController1 = new JABS_StandardController();
  }
};
//endregion DataManager

//region IconManager
//region jabs icon registry
/**
 * A key-value mapping of physical input symbols to icon indices.
 * @type {Record<string, number>}
 */
IconManager._jabsActionIconRegistry = {};

/**
 * Gets the icon registry for JABS input symbols.
 * @returns {Record<string, number>}
 */
IconManager.getJabsIconRegistry = function()
{
  return IconManager._jabsActionIconRegistry;
};

/**
 * Registers a custom icon for a given symbol.
 * @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
 * @param {number} iconIndex The icon index to use for the given symbol.
 */
IconManager.registerJabsIcon = function(symbol, iconIndex)
{
  // validate symbol to ensure its a string.
  const validatedSymbol = String(symbol);

  // normalize the symbol to lowercase.
  const normalizedSymbol = validatedSymbol.trim()
    .toLowerCase();
  if (!normalizedSymbol)
  {
    throw new Error(`Attempting to register an empty symbol for icon index: ${iconIndex}`);
  }

  // validate iconIndex to ensure its a number.
  const validatedIconIndex = Number(iconIndex);
  if (isNaN(validatedIconIndex))
  {
    throw new Error(`Invalid icon index for symbol '${normalizedSymbol}': ${iconIndex}`);
  }

  // grab the registry for updating.
  const registry = this.getJabsIconRegistry();

  // register the icon index for the symbol.
  registry[normalizedSymbol] = validatedIconIndex;
};

/**
 * Gets the icon index for a given physical input symbol.
 * @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
 * @returns {number} The icon index to use for the given symbol, or 0 if not mapped.
 */
IconManager.jabsIconIndexForSymbol = function(symbol)
{
  // validate symbol to ensure its a string.
  const validatedSymbol = String(symbol);

  // normalize the symbol to lowercase.
  const normalizedSymbol = validatedSymbol.trim()
    .toLowerCase();

  // bail early if the symbol is empty.
  if (!normalizedSymbol) return 0;

  // grab the registry for querying.
  const registry = this.getJabsIconRegistry();

  // return the icon index for the symbol, or 0 if not mapped.
  return registry[normalizedSymbol] || 0;
};

/**
 * Registers all JABS input symbols with their respective icon indices.
 */
IconManager.registerJabsIcons = function()
{
  this.registerJabsIcon(J.ABS.Input.Mainhand, 76);
  this.registerJabsIcon(J.ABS.Input.Offhand, 77);
  this.registerJabsIcon(J.ABS.Input.Tool, 176);
  this.registerJabsIcon(J.ABS.Input.Dash, 140);

  this.registerJabsIcon(J.ABS.Input.SkillTrigger, 86);
  this.registerJabsIcon(J.ABS.Input.StrafeTrigger, 82);
  this.registerJabsIcon(J.ABS.Input.GuardTrigger, 83);
  this.registerJabsIcon(J.ABS.Input.MobilitySkill, 13);

  this.registerJabsIcon(J.ABS.Input.Quickmenu, 2563);
  this.registerJabsIcon(J.ABS.Input.PartyCycle, 75);

  this.registerJabsIcon(J.ABS.Input.CombatSkill1, 79);
  this.registerJabsIcon(J.ABS.Input.CombatSkill2, 79);
  this.registerJabsIcon(J.ABS.Input.CombatSkill3, 79);
  this.registerJabsIcon(J.ABS.Input.CombatSkill4, 79);
};

//endregion jabs icon registry

//region jabs text registry
/**
 * A key-value mapping of physical input symbols to ex-text.
 * @type {Record<string, string>}
 */
IconManager._jabsInputTextRegistry = {};

/**
 * Gets the ex-text registry for JABS input symbols.
 * @returns {Record<string, string>}
 */
IconManager.getJabsInputTextRegistry = function()
{
  return IconManager._jabsInputTextRegistry;
};

/**
 * Registers custom ex-text for a given symbol.
 * @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
 * @param {string} text The ex-text to use for the given symbol.
 */
IconManager.registerJabsInputText = function(symbol, text)
{
  // validate symbol to ensure its a string.
  const validatedSymbol = String(symbol);

  // normalize the symbol to lowercase.
  const normalizedSymbol = validatedSymbol.trim()
    .toLowerCase();
  if (!normalizedSymbol)
  {
    throw new Error(`Attempting to register an empty symbol for ex-text: ${text}`);
  }

  // validate text to ensure its a string.
  const validatedText = String(text).trim();
  if (!validatedText)
  {
    throw new Error(`Attempting to register an empty ex-text for symbol: ${normalizedSymbol}`);
  }

  // grab the registry for updating.
  const registry = this.getJabsInputTextRegistry();

  // register the ex-text for the symbol.
  registry[normalizedSymbol] = validatedText;
};

/**
 * Get the ex-text for a given physical input symbol.
 * @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
 * @returns {string} The ex-text for the given symbol, or the symbol itself if not mapped.
 */
IconManager.jabsInputTextForSymbol = function(symbol)
{
  // grab the registry for querying.
  const registry = this.getJabsInputTextRegistry();

  // validate symbol to ensure its a string.
  const validatedSymbol = String(symbol);

  // normalize the symbol to lowercase.
  const normalizedSymbol = validatedSymbol.toLowerCase();

  // return the ex-text for the symbol, or the symbol itself if not mapped.
  return registry[normalizedSymbol] || Input.labelForSymbol(normalizedSymbol) || symbol;
};

/**
 * Gets the ex-text for a given physical input symbol.
 * @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
 * @returns {string} The ex-text for the given symbol, or the symbol itself if not mapped.
 */
IconManager.jabsIconTextForSymbol = function(symbol)
{
  // handle empty/unbound case.
  if (!symbol) return "(unbound)";

  // return the ex-text for the symbol, or the symbol itself if not mapped.
  return this.jabsInputTextForSymbol(symbol) || String(symbol);
};

/**
 * Registers all JABS input symbols with their respective ex-text.
 */
IconManager.registerJabsInputTexts = function()
{
  this.registerJabsInputText(J.ABS.Input.Mainhand, "\\I[2448] / \\I[2432]");
  this.registerJabsInputText(J.ABS.Input.Offhand, "\\I[2449] / \\I[2433]");
  this.registerJabsInputText(J.ABS.Input.Tool, "\\I[2450] / \\I[2434]");
  this.registerJabsInputText(J.ABS.Input.Dash, "\\I[2451] / \\I[2435]");

  this.registerJabsInputText(J.ABS.Input.SkillTrigger, "\\I[2452] / \\I[2436]");
  this.registerJabsInputText(J.ABS.Input.StrafeTrigger, "\\I[2454] / \\I[2438]");
  this.registerJabsInputText(J.ABS.Input.GuardTrigger, "\\I[2453] / \\I[2437]");
  this.registerJabsInputText(J.ABS.Input.MobilitySkill, "\\I[2455] / \\I[2439]");

  this.registerJabsInputText(J.ABS.Input.Quickmenu, "\\I[2456] / \\I[2440]");
  this.registerJabsInputText(J.ABS.Input.PartyCycle, "\\I[2457] / \\I[2441]");
};
//endregion jabs text registry
//endregion IconManager

//region Input
/**
 * The mappings of the gamepad descriptions to their buttons.
 */
J.ABS.Input = {};

//region input definitions

// this section of inputs is an attempt to align with the internal RMMZ mapping convention.
J.ABS.Input.DirUp = 'up';
J.ABS.Input.DirDown = 'down';
J.ABS.Input.DirLeft = 'left';
J.ABS.Input.DirRight = 'right';
J.ABS.Input.Mainhand = 'ok';
J.ABS.Input.Offhand = 'cancel';
J.ABS.Input.Dash = 'shift';
J.ABS.Input.Tool = 'tab';
J.ABS.Input.GuardTrigger = 'pagedown';
J.ABS.Input.SkillTrigger = 'pageup';

// this section of inputs are newly implemented.
J.ABS.Input.MobilitySkill = 'r2';
J.ABS.Input.StrafeTrigger = 'l2';
J.ABS.Input.Quickmenu = 'start';
J.ABS.Input.PartyCycle = 'select';
J.ABS.Input.Debug = 'cheat';

// for gamepads, these buttons are tracked, but aren't used by JABS right now.
J.ABS.Input.R3 = 'r3';
J.ABS.Input.L3 = 'l3';

// for dedicated D-pad shortcuts (not movement directions).
J.ABS.Input.DPadUp = 'dpad-up';
J.ABS.Input.DPadDown = 'dpad-down';
J.ABS.Input.DPadLeft = 'dpad-left';
J.ABS.Input.DPadRight = 'dpad-right';

// for keyboards, these buttons are for direct combatskill usage.
J.ABS.Input.CombatSkill1 = 'combat-skill-1';
J.ABS.Input.CombatSkill2 = 'combat-skill-2';
J.ABS.Input.CombatSkill3 = 'combat-skill-3';
J.ABS.Input.CombatSkill4 = 'combat-skill-4';
//endregion input definitions

/**
 * Extends the existing mapper for keyboards to accommodate for the
 * additional skill inputs that are used for gamepads.
 */
Input.keyMapper = {
  // define the original keyboard mapping.
  ...Input.keyMapper,

  // this is the new debug move-through for use with JABS.
  192: J.ABS.Input.Debug,       // ` (backtick)

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

/**
 * Overwrites gamepad button input to instead perform the various
 * actions that are expected in this ABS.
 *
 * This includes:
 * - D-Pad up, down, left, right
 * - A/kross, B/circle, X/square, Y/triangle
 * - L1/LB, R1/RB
 * - NEW: select/options, start/menu
 * - NEW: L2/LT, R2/RT
 * - NEW: L3/LSB, R3/RSB
 * - OVERWRITE: Y now is the tool button, and start is the menu.
 */
Input.gamepadMapper = {
  // action face buttons.
  0: J.ABS.Input.Mainhand,      // kross
  1: J.ABS.Input.Offhand,       // circle
  2: J.ABS.Input.Dash,          // square
  3: J.ABS.Input.Tool,          // triangle

  // shoulder/trigger buttons.
  4: J.ABS.Input.SkillTrigger,  // (L1) left bumper
  5: J.ABS.Input.GuardTrigger,  // (R1) right bumper
  6: J.ABS.Input.StrafeTrigger, // (L2) left trigger
  7: J.ABS.Input.MobilitySkill, // (R2) right trigger

  // meta/menu buttons.
  8: J.ABS.Input.PartyCycle,    // select
  9: J.ABS.Input.Quickmenu,     // start

  // stick-click buttons.
  10: J.ABS.Input.L3,           // (L3) left stick button
  11: J.ABS.Input.R3,           // (R3) right stick button

  // D-pad buttons remapped to dedicated shortcut symbols (not movement directions).
  12: J.ABS.Input.DPadUp,       // d-pad up (shortcut)
  13: J.ABS.Input.DPadDown,     // d-pad down (shortcut)
  14: J.ABS.Input.DPadLeft,     // d-pad left (shortcut)
  15: J.ABS.Input.DPadRight,    // d-pad right (shortcut)

  // the analog stick should be natively supported for movement.
};

// region registries

// Ensure a single bag for registry/bindings data on Input.
Input._jRegistries ||= {
  actions: Object.create(null),     // ns -> Array<action def>
  symbolLabels: Object.create(null),// symbol -> label
  capture: new Set(),               // Set<string>
  bindings: Object.create(null),    // ns -> { key: string[] }
  defaults: Object.create(null),    // ns -> { key: string[] }
  bootstrapped: false,              // idempotency flag
};

/**
 * Registers a logical action under a namespace for remapping.
 * @param {string} ns The namespace (e.g., "JABS", "HUD", "MINIMAP").
 * @param {object} def The action definition.
 * @param {string} def.key The logical action key (unique within ns).
 * @param {string} def.label The friendly label shown in UIs.
 * @param {string[]} [def.defaults] Optional default physical symbols.
 * @param {string} [def.category] Optional category label.
 */
Input.registerAction = function(ns, def)
{
  // Coerce shapes.
  if (!ns || !def || !def.key) return;

  // Initialize namespace list for actions.
  const bag = Input._jRegistries.actions;
  bag[ns] = bag[ns] || [];

  // Push normalized action def.
  bag[ns].push({
    key: String(def.key),
    label: String(def.label || def.key),
    defaults: Array.isArray(def.defaults)
      ? def.defaults.slice()
      : [],
    category: String(def.category || 'misc'),
  });
};

/**
 * Gets the registered logical actions for a namespace.
 * @param {string} ns The namespace.
 * @returns {Array<{key:string,label:string,defaults:string[],category:string}>}
 */
Input.getRegisteredActions = function(ns)
{
  const bag = Input._jRegistries.actions;
  const list = bag[ns] || [];
  return list.slice();
};

/**
 * Seeds the default physical bindings for a namespace in bulk.
 * Does not override live bindings; use resetBindingsToDefaults() to re-apply.
 * @param {string} ns The namespace.
 * @param {Object<string, string[]>} defaults Map of key -> physical symbols.
 */
Input.seedDefaultBindings = function(ns, defaults)
{
  if (!ns || !defaults) return;
  const out = Object.create(null);
  const keys = Object.keys(defaults);
  for (let i = 0; i < keys.length; i++)
  {
    const k = keys[i];
    out[k] = Array.isArray(defaults[k])
      ? defaults[k].slice()
      : [];
  }
  Input._jRegistries.defaults[ns] = out;
};

/**
 * Gets the live bindings (logical -> physical[]) for a namespace.
 * If empty, returns a lazily-initialized copy of the defaults.
 * @param {string} ns The namespace.
 * @returns {Object<string, string[]>}
 */
Input.getAllBindings = function(ns)
{
  const b = Input._jRegistries.bindings;
  if (!b[ns])
  {
    // Lazy-init from defaults so querying works before any remaps are saved.
    const d = Input._jRegistries.defaults[ns] || Object.create(null);
    const clone = Object.create(null);
    const keys = Object.keys(d);
    for (let i = 0; i < keys.length; i++)
    {
      const k = keys[i];
      clone[k] = d[k].slice();
    }
    b[ns] = clone;
  }
  return b[ns];
};

/**
 * Gets the bound physical symbols for a single logical key.
 * @param {string} ns The namespace.
 * @param {string} key The logical action key.
 * @returns {string[]} Array of physical symbols (may be empty).
 */
Input.getBindings = function(ns, key)
{
  const all = Input.getAllBindings(ns);
  const arr = all[key];
  return Array.isArray(arr)
    ? arr
    : [];
};

/**
 * Overwrites the bound physical symbols for a single logical key.
 * @param {string} ns The namespace.
 * @param {string} key The logical action key.
 * @param {string[]} physical Array of physical symbols.
 */
Input.setBindings = function(ns, key, physical)
{
  const all = Input.getAllBindings(ns);
  all[key] = Array.isArray(physical)
    ? physical.slice()
    : [];
};

/**
 * Resets a namespace’s live bindings back to the seeded defaults.
 * @param {string} ns The namespace.
 */
Input.resetBindingsToDefaults = function(ns)
{
  const d = Input._jRegistries.defaults[ns] || Object.create(null);
  const clone = Object.create(null);
  const keys = Object.keys(d);
  for (let i = 0; i < keys.length; i++)
  {
    const k = keys[i];
    clone[k] = d[k].slice();
  }
  Input._jRegistries.bindings[ns] = clone;
};

/**
 * Determines if any physical input bound to the logical action is triggered this frame.
 * @param {string} ns The namespace.
 * @param {string} key The logical action key.
 * @returns {boolean}
 */
Input.isActionTriggered = function(ns, key)
{
  const inputs = Input.getBindings(ns, key);
  for (let i = 0; i < inputs.length; i++)
  {
    const physical = inputs[i];
    if (Input.isTriggered(physical)) return true;
  }
  return false;
};

/**
 * Determines if any physical input bound to the logical action is currently pressed.
 * @param {string} ns The namespace.
 * @param {string} key The logical action key.
 * @returns {boolean}
 */
Input.isActionPressed = function(ns, key)
{
  const inputs = Input.getBindings(ns, key);
  for (let i = 0; i < inputs.length; i++)
  {
    const physical = inputs[i];
    if (Input.isPressed(physical)) return true;
  }
  return false;
};

/**
 * Registers a friendly label for a physical input symbol.
 * @param {string} symbol The physical symbol (e.g., 'dpad-up').
 * @param {string} label The friendly label (e.g., 'D-Pad Up').
 */
Input.registerSymbolLabel = function(symbol, label)
{
  Input._jRegistries.symbolLabels[String(symbol)] = String(label || symbol);
};

/**
 * Resolves a friendly label for a physical input symbol.
 * @param {string} symbol The physical symbol.
 * @returns {string}
 */
Input.labelForSymbol = function(symbol)
{
  const labels = Input._jRegistries.symbolLabels;
  const key = String(symbol);
  return labels[key] || key;
};

/**
 * Registers a physical symbol as eligible for capture by the remap prompt.
 * @param {string} symbol The symbol to allow.
 */
Input.registerRemapCaptureSymbol = function(symbol)
{
  Input._jRegistries.capture.add(String(symbol));
};

/**
 * Gets all extra capture-eligible symbols registered by plugins.
 * @returns {string[]}
 */
Input.getRemapCaptureSymbols = function()
{
  return Array.from(Input._jRegistries.capture);
};

/**
 * Idempotent bootstrap for remap defaults and symbol labels.
 * Should be called from DataManager.createGameObjects() on boot/load.
 */
Input.ensureRemapBootstrapped = function()
{
  if (Input._jRegistries.bootstrapped === true)
  {
    return; // already bootstrapped for this session
  }

  // Seed JABS defaults (logical actions -> physical symbols).
  const d = {};
  d[JABS_Button.Menu] = [ J.ABS.Input.Quickmenu ];
  d[JABS_Button.Select] = [ J.ABS.Input.PartyCycle ];
  d[JABS_Button.Mainhand] = [ J.ABS.Input.Mainhand ];
  d[JABS_Button.Offhand] = [ J.ABS.Input.Offhand ];
  d[JABS_Button.Tool] = [ J.ABS.Input.Tool ];
  d[JABS_Button.Dodge] = [ J.ABS.Input.MobilitySkill ];
  d[JABS_Button.Sprint] = [ J.ABS.Input.Dash ];
  d[JABS_Button.Strafe] = [ J.ABS.Input.StrafeTrigger ];
  d[JABS_Button.Rotate] = [ J.ABS.Input.GuardTrigger ];
  d[JABS_Button.Guard] = [ J.ABS.Input.GuardTrigger ];
  d[JABS_Button.SkillTrigger] = [ J.ABS.Input.SkillTrigger ];
  d[JABS_Button.CombatSkill1] = [ J.ABS.Input.CombatSkill1 ];
  d[JABS_Button.CombatSkill2] = [ J.ABS.Input.CombatSkill2 ];
  d[JABS_Button.CombatSkill3] = [ J.ABS.Input.CombatSkill3 ];
  d[JABS_Button.CombatSkill4] = [ J.ABS.Input.CombatSkill4 ];

  Input.seedDefaultBindings('JABS', d);
  Input.getAllBindings('JABS'); // lazy-init live bindings

  // friendly labels for some common symbols.
  Input.registerSymbolLabel(J.ABS.Input.L3, 'L3');
  Input.registerSymbolLabel(J.ABS.Input.R3, 'R3');
  Input.registerSymbolLabel(J.ABS.Input.MobilitySkill, 'R2');
  Input.registerSymbolLabel(J.ABS.Input.DPadUp, 'D-Pad Up');
  Input.registerSymbolLabel(J.ABS.Input.DPadDown, 'D-Pad Down');
  Input.registerSymbolLabel(J.ABS.Input.DPadLeft, 'D-Pad Left');
  Input.registerSymbolLabel(J.ABS.Input.DPadRight, 'D-Pad Right');

  // Allow these symbols to be captured in the prompt if desired.
  Input.registerRemapCaptureSymbol(J.ABS.Input.L3);
  Input.registerRemapCaptureSymbol(J.ABS.Input.R3);
  Input.registerRemapCaptureSymbol(J.ABS.Input.DPadUp);
  Input.registerRemapCaptureSymbol(J.ABS.Input.DPadDown);
  Input.registerRemapCaptureSymbol(J.ABS.Input.DPadLeft);
  Input.registerRemapCaptureSymbol(J.ABS.Input.DPadRight);

  // NEW: expose all non-engine keyboard keys for capture/binding.
  Input.bootstrapAllKeyboardKeysForCapture();

  // Mark as bootstrapped for this runtime session.
  Input._jRegistries.bootstrapped = true;
};

/**
 * Generates capture-eligible symbols for any keyboard keycodes that are not
 * already mapped to core RMMZ symbols, and registers readable labels for them.
 */
Input.bootstrapAllKeyboardKeysForCapture = function()
{
  // collect a snapshot of engine/core-reserved symbols to avoid overriding them.
  const reserved = new Set([
    // core engine actions and directions.
    'ok', 'cancel', 'menu', 'escape',
    'tab', 'pageup', 'pagedown', 'shift', 'control',
    'up', 'down', 'left', 'right',
  ]);

  // also consider whatever the current keyMapper already resolves to.
  const existingMap = Object.assign({}, Input.keyMapper);
  Object.keys(existingMap)
    .forEach(code =>
    {
      // read the mapped symbol for this code.
      const sym = existingMap[code];

      // if mapped to a core-like word, add to the reserved set for safety.
      if (typeof sym === 'string' && sym.length)
      {
        reserved.add(sym);
      }
    });

  // iterate a reasonable range of DOM KeyboardEvent.keyCode values.
  for (let code = 8; code <= 222; code++)
  {
    // never capture or map blacklisted keycodes (Function keys, etc.).
    if (Input._isBlacklistedKeycode(code))
    {
      continue;
    }

    // if the engine already has a mapping for this keycode, leave it alone.
    if (Object.prototype.hasOwnProperty.call(Input.keyMapper, code))
    {
      // still allow capture if it is NOT a reserved symbol and NOT blacklisted.
      const s = Input.keyMapper[code];
      if (s && reserved.has(s) === false)
      {
        // register this existing non-engine symbol for the prompt & label.
        Input.registerRemapCaptureSymbol(s);
        Input.registerSymbolLabel(s, Input._keycodeLabelFor(code, s));
      }
      continue;
    }

    // create a stable unique symbol for this unmapped keycode.
    const symbol = `key-${code}`;

    // define a keyboard mapping so Input can detect presses for this key.
    Input.keyMapper[code] = symbol;

    // allow the capture prompt to consider this symbol.
    Input.registerRemapCaptureSymbol(symbol);

    // provide a human-friendly label for the remap UI.
    Input.registerSymbolLabel(symbol, Input._keycodeLabelFor(code, symbol));
  }
};

/**
 * Determines if a keycode should be excluded from capture/mapping.
 * Currently blacklists Function keys to avoid conflicts with RMMZ/NW.js.
 *
 * @param {number} code The keycode to evaluate.
 * @returns {boolean} True if blacklisted; false otherwise.
 */
Input._isBlacklistedKeycode = function(code)
{
  // F1–F12 are 112–123.
  if (code >= 112 && code <= 123)
  {
    return true;
  }

  // Some platforms expose F13–F24 as 124–135; exclude those as well for safety.
  if (code >= 124 && code <= 135)
  {
    return true;
  }

  // allow all other keys.
  return false;
};

/**
 * Resolves a display label for a given keycode.
 * Falls back to the symbol if not recognized.
 * @param {number} code The keyboard keycode (8..222 range typically).
 * @param {string} fallback The fallback label when unknown.
 * @returns {string}
 */
Input._keycodeLabelFor = function(code, fallback)
{
  // A–Z
  if (code >= 65 && code <= 90)
  {
    // convert 65->A, 66->B, etc.
    return String.fromCharCode(code);
  }

  // 0–9 (top row)
  if (code >= 48 && code <= 57)
  {
    return String(code - 48);
  }

  // Numpad 0–9
  if (code >= 96 && code <= 105)
  {
    return `Num ${code - 96}`;
  }

  // Function keys F1–F12
  if (code >= 112 && code <= 123)
  {
    return `F${code - 111}`;
  }

  // Common punctuation and special keys.
  switch (code)
  {
    case 8:
      return 'Backspace';
    case 9:
      return 'Tab';
    case 13:
      return 'Enter';
    case 16:
      return 'Shift';
    case 17:
      return 'Ctrl';
    case 18:
      return 'Alt';
    case 19:
      return 'Pause';
    case 20:
      return 'CapsLock';
    case 27:
      return 'Esc';
    case 32:
      return 'Space';
    case 33:
      return 'PageUp';
    case 34:
      return 'PageDown';
    case 35:
      return 'End';
    case 36:
      return 'Home';
    case 37:
      return 'Left';
    case 38:
      return 'Up';
    case 39:
      return 'Right';
    case 40:
      return 'Down';
    case 45:
      return 'Insert';
    case 46:
      return 'Delete';
    case 91:
      return 'Meta';
    case 93:
      return 'Context';
    case 106:
      return 'Num *';
    case 107:
      return 'Num +';
    case 109:
      return 'Num -';
    case 110:
      return 'Num .';
    case 111:
      return 'Num /';
    case 186:
      return '; :';
    case 187:
      return '= +';
    case 188:
      return ', <';
    case 189:
      return '- _';
    case 190:
      return '. >';
    case 191:
      return '/ ?';
    case 192:
      return '` ~';
    case 219:
      return '[ {';
    case 220:
      return '\\ |';
    case 221:
      return '] }';
    case 222:
      return '\' "';
  }

  // fallback to the provided symbol when unknown.
  return String(fallback || `Key ${code}`);
};

/**
 * Adjustable stick axis threshold (deadzone) for converting axes → directions.
 * Lower this if your controller’s axes don’t reach ±1.0. Default 0.50.
 * @type {number}
 */
Input._axisThreshold = 0.5;

/**
 * Sets the analog stick threshold.
 * @param {number} v The new threshold (0.05–0.90 recommended).
 */
Input.setAxisThreshold = function(v)
{
  // constrain a bit to avoid nonsense values.
  const n = Number(v);
  if (!isNaN(n) && n > 0 && n < 1)
  {
    Input._axisThreshold = n;
  }
};

/**
 * OVERWRITE-ALIAS Extends gamepad processing to reinforce directions from axes
 * using a configurable threshold, without disabling vanilla behavior.
 * Ensures mutual exclusivity and proper clearing when axes return to neutral.
 * Also writes results to the per-pad state, then rebuilds the merged state as
 * (keyboardApprox OR currentGamepadAxes) so keyboard arrows are preserved while
 * stick clears. Includes optional diagnostic logging when enabled.
 * @param {Gamepad} gamepad The gamepad polled from navigator.getGamepads().
 */
J.ABS.EXT.INPUT.Aliased.Input.set('_updateGamepadState', Input._updateGamepadState);
Input._updateGamepadState = function(gamepad)
{
  // perform original engine logic first.
  J.ABS.EXT.INPUT.Aliased.Input
    .get('_updateGamepadState')
    .call(this, gamepad);

  // if there is no pad, there is nothing further to do this frame.
  if (!gamepad)
  {
    return;
  }

  // ensure we have both state bags; bail if missing.
  const ensured = Input._ensurePadStates(gamepad);
  if (!ensured)
  {
    return;
  }

  // unpack the state bags for readability.
  const { s } = ensured;
  const { padState } = ensured;

  // 1) Normalize D-pad strictly from raw buttons 12..15.
  Input._normalizeDpadFromButtons(gamepad, s, padState);

  // if there are no axes to process, stop here after D-pad normalization.
  if (!gamepad.axes || gamepad.axes.length < 2)
  {
    return;
  }

  // 2) Capture the merged snapshot BEFORE axis processing (for keyboard approx).
  const s0 = Input._snapshotMergedDirections(s);

  // 3) Resolve axis flags from the left stick.
  const flags = Input._resolveAxesFlags(gamepad);

  // 4) Apply axis flags to the per-pad snapshot with mutual exclusivity + neutral clearing.
  Input._applyAxesToPerPad(padState, flags);

  // 5) Compute current axes contribution from the per-pad snapshot.
  const axesNow = Input._axesNowFromPadState(padState);

  // 6) Derive keyboard-only approximation using last merged-vs-axes stamp.
  const prevAxes = Input._axesStamp || {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  const kbdApprox = Input._keyboardApproxFromSnapshot(s0, prevAxes);

  // 7) Rebuild merged directions as (keyboardApprox OR current axes).
  Input._rebuildMergedDirections(s, kbdApprox, axesNow);

  // 8) Update the axes stamp for next frame's separation logic.
  Input._axesStamp = axesNow;
};

/**
 * Ensures we have both the merged current state bag and the per-pad snapshot.
 * @param {Gamepad} gamepad The polled gamepad.
 * @returns {{ s: object, padState: object }|null}
 */
Input._ensurePadStates = function(gamepad)
{
  // read the merged state for this frame.
  const s = this._currentState;

  // resolve the per-pad state snapshot for this index.
  const padState = this._gamepadStates && typeof gamepad.index === 'number'
    ? this._gamepadStates[gamepad.index]
    : null;

  // if either is missing, we cannot proceed.
  if (!s || !padState)
  {
    return null;
  }

  // provide both state bags to the caller.
  return {
    s,
    padState
  };
};

/**
 * Normalizes the four D-pad symbols strictly from raw buttons 12..15.
 * Writes into both merged current state and per-pad snapshot.
 * @param {Gamepad} gamepad The polled gamepad.
 * @param {object} s The merged current state bag.
 * @param {object} padState The per-pad snapshot for this device.
 */
Input._normalizeDpadFromButtons = function(gamepad, s, padState)
{
  // coerce D-pad buttons to booleans from the raw Gamepad API.
  const dpu = !!(gamepad.buttons && gamepad.buttons[12] && gamepad.buttons[12].pressed);
  const dpd = !!(gamepad.buttons && gamepad.buttons[13] && gamepad.buttons[13].pressed);
  const dpl = !!(gamepad.buttons && gamepad.buttons[14] && gamepad.buttons[14].pressed);
  const dpr = !!(gamepad.buttons && gamepad.buttons[15] && gamepad.buttons[15].pressed);

  // write merged state for D-pad symbols.
  s['dpad-up'] = dpu;
  s['dpad-down'] = dpd;
  s['dpad-left'] = dpl;
  s['dpad-right'] = dpr;

  // mirror into per-pad snapshot for edge/trigger bookkeeping.
  padState['dpad-up'] = dpu;
  padState['dpad-down'] = dpd;
  padState['dpad-left'] = dpl;
  padState['dpad-right'] = dpr;
};

/**
 * Captures the current merged cardinal directions into a plain object.
 * @param {object} s The merged current state bag.
 * @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
 */
Input._snapshotMergedDirections = function(s)
{
  // build a simple snapshot of current merged directions.
  return {
    up: !!s.up,
    down: !!s.down,
    left: !!s.left,
    right: !!s.right,
  };
};

/**
 * Resolves axis flags from the left stick using the configured threshold.
 * @param {Gamepad} gamepad The polled gamepad.
 */
Input._resolveAxesFlags = function(gamepad)
{
  // read the two primary axes.
  const ax = gamepad.axes && gamepad.axes.length > 0
    ? (gamepad.axes[0] || 0)
    : 0;
  const ay = gamepad.axes && gamepad.axes.length > 1
    ? (gamepad.axes[1] || 0)
    : 0;

  // apply the configured threshold to derive flags.
  const t = Input._axisThreshold;
  const holdLeft = ax <= -t;
  const holdRight = ax >= t;
  const neutralX = !holdLeft && !holdRight;
  const holdUp = ay <= -t;
  const holdDown = ay >= t;
  const neutralY = !holdUp && !holdDown;

  // return all computed values to the caller.
  return {
    ax,
    ay,
    holdLeft,
    holdRight,
    holdUp,
    holdDown,
    neutralX,
    neutralY
  };
};

/**
 * Applies axis flags to the per-pad snapshot with mutual exclusivity and neutral clearing.
 * @param {object} padState The per-pad snapshot for this device.
 * @param {object} f The axis flags.
 */
Input._applyAxesToPerPad = function(padState, f)
{
  // resolve horizontal contribution.
  if (f.holdLeft)
  {
    padState.left = true;
    padState.right = false;
  }
  else if (f.holdRight)
  {
    padState.right = true;
    padState.left = false;
  }
  else if (f.neutralX)
  {
    padState.left = false;
    padState.right = false;
  }

  // resolve vertical contribution.
  if (f.holdUp)
  {
    padState.up = true;
    padState.down = false;
  }
  else if (f.holdDown)
  {
    padState.down = true;
    padState.up = false;
  }
  else if (f.neutralY)
  {
    padState.up = false;
    padState.down = false;
  }
};

/**
 * Extracts the current axis-derived directions from the per-pad snapshot.
 * @param {object} padState The per-pad snapshot for this device.
 * @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
 */
Input._axesNowFromPadState = function(padState)
{
  // interpret the per-pad snapshot booleans as the axes contribution for this frame.
  return {
    up: padState.up === true,
    down: padState.down === true,
    left: padState.left === true,
    right: padState.right === true,
  };
};

/**
 * Separates an approximate keyboard-only contribution from the previous merged snapshot.
 * Anything present in merged last frame that was NOT set by axes last frame is treated as keyboard.
 * @param {{up:boolean,down:boolean,left:boolean,right:boolean}} s0 The merged snapshot prior to axes resolution.
 * @param {{up:boolean,down:boolean,left:boolean,right:boolean}} prevAxes The last frame's axes contribution.
 * @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
 */
Input._keyboardApproxFromSnapshot = function(s0, prevAxes)
{
  // derive a keyboard-only approximation by subtracting prior axes contribution.
  return {
    up: s0.up && (prevAxes.up === false),
    down: s0.down && (prevAxes.down === false),
    left: s0.left && (prevAxes.left === false),
    right: s0.right && (prevAxes.right === false),
  };
};

/**
 * Rebuilds merged directions as (keyboardApprox OR currentGamepadAxes) for each cardinal.
 * @param {object} s The merged current state bag to write into.
 * @param {{up:boolean,down:boolean,left:boolean,right:boolean}} kbdApprox The keyboard-only approximation.
 * @param {{up:boolean,down:boolean,left:boolean,right:boolean}} axesNow The axes contribution for this frame.
 */
Input._rebuildMergedDirections = function(s, kbdApprox, axesNow)
{
  // combine keyboard approximation with current axes for each direction.
  s.up = (kbdApprox.up === true) || (axesNow.up === true);
  s.down = (kbdApprox.down === true) || (axesNow.down === true);
  s.left = (kbdApprox.left === true) || (axesNow.left === true);
  s.right = (kbdApprox.right === true) || (axesNow.right === true);
};

/**
 * Exports a deep-cloned snapshot of all live namespace bindings for save.
 * Shape: { [ns: string]: { [key: string]: string[] } }
 * @returns {Object<string, Object<string, string[]>>}
 */
Input.exportAllBindingsForSave = function()
{
  // read the live bindings bag.
  const b = Input._jRegistries.bindings || Object.create(null);

  // deep clone to avoid save-time mutation risks.
  const out = Object.create(null);
  const namespaces = Object.keys(b);
  for (let i = 0; i < namespaces.length; i++)
  {
    // clone each namespace mapping.
    const ns = namespaces[i];
    const map = b[ns] || Object.create(null);
    const clone = Object.create(null);
    const keys = Object.keys(map);
    for (let k = 0; k < keys.length; k++)
    {
      const key = keys[k];
      const arr = map[key];
      clone[key] = Array.isArray(arr)
        ? arr.slice(0)
        : [];
    }
    out[ns] = clone;
  }

  // return the cloned snapshot.
  return out;
};

/**
 * Imports all namespace bindings from a saved snapshot into the live registry.
 * Any namespaces absent from the snapshot retain their current (bootstrapped) values.
 * @param {Object<string, Object<string, string[]>>} saved The snapshot to import.
 */
Input.importAllBindingsFromSave = function(saved)
{
  // ignore invalid inputs.
  if (!saved || typeof saved !== 'object')
  {
    return;
  }

  // ensure the bindings bag exists.
  const b = Input._jRegistries.bindings;

  // apply each namespace from the save.
  const namespaces = Object.keys(saved);
  for (let i = 0; i < namespaces.length; i++)
  {
    // read the namespace and its map.
    const ns = namespaces[i];
    const map = saved[ns] || Object.create(null);

    // build a safe clone of the map for assignment.
    const clone = Object.create(null);
    const keys = Object.keys(map);
    for (let k = 0; k < keys.length; k++)
    {
      const key = keys[k];
      const arr = map[key];
      clone[key] = Array.isArray(arr)
        ? arr.slice(0)
        : [];
    }

    // replace the live namespace mapping with the cloned one.
    b[ns] = clone;
  }
};

//endregion registries
//endregion Input

//region JABS_Engine
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('performPartyCycling', JABS_Engine.prototype.performPartyCycling);
/**
 * Extends {@link #performPartyCycling}.<br/>
 * Include reassigning the controller to the player.
 */
JABS_Engine.prototype.performPartyCycling = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('performPartyCycling')
    .call(this);

  // when the player party cycles, update their controls to the updated battler.
  $jabsController1.setBattler(this.getPlayer1());
};

/**
 * Handles the player input.
 */
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set('updateInput', JABS_Engine.prototype.updateInput);
JABS_Engine.prototype.updateInput = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.JABS_Engine.get('updateInput')
    .call(this);

  // don't update if we aren't allowed to update.
  if (!this.canUpdateInput()) return;

  // update the input.
  $jabsController1.update();
};
//endregion JABS_Engine

//region Game_System
/**
 * Extends {@link #initMembers}.<br/>
 * Initializes members used for storing JABS input mappings per controller.
 */
J.ABS.EXT.INPUT.Aliased.Game_System.set('initMembers', Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.Game_System.get('initMembers')
    .call(this);

  // initialize extension members for JABS input configurations.
  this.initJabsInputConfigMembers();
};

/**
 * Initializes members used for storing JABS input mappings and controller references.
 */
Game_System.prototype.initJabsInputConfigMembers = function()
{
  /**
   * Root namespace for J-related data stored on the system object.
   */
  this._j ||= {};

  /**
   * ABS (JABS) namespace stored under the J-root on the system object.
   */
  this._j._abs ||= {};

  /**
   * Input extension namespace stored under the ABS namespace on the system object.
   */
  this._j._abs._input ||= {};

  /**
   * Dictionary of controllerKey -> mapping object `{ [button]: symbol }`.
   * @type {Object<string, Object<string, string>>}
   */
  this._j._abs._input._mappings ||= {};

  /**
   * Snapshot of the full Input registry bindings across all namespaces.
   * @type {Object<string, Object<string, string[]>>}
   */
  this._j._abs._input._bindings ||= {};
};

/**
 * Gets the stored mapping dictionary of controllerKey -> mapping object.
 * @returns {Object<string, Object<string,string>>}
 */
Game_System.prototype.getJabsInputMappings = function()
{
  // return the full mappings dictionary.
  return this._j._abs._input._mappings;
};

/**
 * Overwrites the stored mapping dictionary of controllerKey -> mapping object.
 * @param {Object<string, Object<string,string>>} mappings The new mappings dictionary.
 */
Game_System.prototype.setJabsInputMappings = function(mappings)
{
  // assign the provided mappings dictionary.
  this._j._abs._input._mappings = mappings;
};

/**
 * Stores a full mapping for the given controller key.
 * @param {string} controllerKey The key representing which controller this mapping belongs to.
 * @param {Object<string,string>} mapping The mapping object to store.
 */
Game_System.prototype.setJabsInputConfig = function(controllerKey, mapping)
{
  // create a shallow copy to avoid external mutation.
  const copy = {};

  // copy each mapping entry by key.
  Object.keys(mapping)
    .forEach(key => copy[key] = mapping[key]);

  // set the new value into the mappings dictionary via the setter.
  const mappings = this.getJabsInputMappings();
  mappings[controllerKey] = copy;
  this.setJabsInputMappings(mappings);
};

/**
 * Gets the stored mapping for the given controller key.
 * @param {string} controllerKey The key representing which controller’s mapping to retrieve.
 * @returns {Object<string,string>|null} The stored mapping, or null if none found.
 */
Game_System.prototype.getJabsInputConfig = function(controllerKey)
{
  // read the mappings dictionary.
  const mappings = this.getJabsInputMappings();

  // grab the mapping bucket for this key.
  const found = mappings[controllerKey];

  // return null if not found.
  if (!found) return null;

  // return a shallow copy for safety.
  const copy = {};
  Object.keys(found)
    .forEach(key => copy[key] = found[key]);
  return copy;
};

/**
 * Gets the persisted snapshot of the Input registry bindings.
 * Shape: { [ns: string]: { [key: string]: string[] } }
 * @returns {Object<string, Object<string, string[]>>}
 */
Game_System.prototype.getInputBindingsSnapshot = function()
{
  // in case this save file was created ahead of the remap update, handle it.
  if (!this._j || !this._j._abs || !this._j._abs._input || !this._j._abs._input._bindings)
  {
    return {};
  }

  // return the stored snapshot bag (may be empty object).
  return this._j._abs._input._bindings || {};
};

/**
 * Overwrites the persisted Input bindings snapshot on the system object.
 * The provided object should follow the shape: { [ns]: { [key]: string[] } }.
 * @param {Object<string, Object<string, string[]>>} snapshot The snapshot to store.
 */
Game_System.prototype.setInputBindingsSnapshot = function(snapshot)
{
  // assign a defensive deep clone to avoid mutation via shared references.
  const out = {};
  const namespaces = Object.keys(snapshot || {});
  for (let i = 0; i < namespaces.length; i++)
  {
    const ns = namespaces[i];
    const map = snapshot[ns] || {};
    const copy = {};
    const keys = Object.keys(map);
    for (let k = 0; k < keys.length; k++)
    {
      const key = keys[k];
      const arr = map[key];
      copy[key] = Array.isArray(arr)
        ? arr.slice(0)
        : [];
    }
    out[ns] = copy;
  }
  this._j._abs._input._bindings = out;
};

/**
 * Applies a stored mapping (if present) to the given controller.
 * @param {string} controllerKey The key used to look up the mapping.
 * @param {JABS_StandardController} controller The input controller to apply to.
 */
Game_System.prototype.applyJabsInputConfigToController = function(controllerKey, controller)
{
  // fetch any stored mapping for this key.
  const mapping = this.getJabsInputConfig(controllerKey);

  // if nothing was found, there is nothing to apply.
  if (!mapping) return;

  // push the full mapping to the controller in one call.
  controller.setAllInputs(mapping);
};

/**
 * Captures current mappings from all known controllers into system storage.
 * This should be called before save, or explicitly by the remap scene’s Save.
 */
Game_System.prototype.saveAllJabsInputConfigs = function()
{
  // get all currently registered controllers from the adapter.
  const controllers = JABS_InputAdapter.getAllControllers();

  // iterate each controller and snapshot its mapping.
  controllers.forEach((controller, index) =>
  {
    // resolve a key for this controller.
    const key = this.resolveJabsControllerKey(controller, index);

    // export and store the controller’s mapping.
    this.setJabsInputConfig(key, controller.exportAllInputs());
  });
};

/**
 * Applies stored mappings to all currently registered controllers.
 * Intended to be called after a save file loads.
 */
Game_System.prototype.applyAllJabsInputConfigs = function()
{
  // get all currently registered controllers from the adapter.
  const controllers = JABS_InputAdapter.getAllControllers();

  // apply per resolved key.
  controllers.forEach((controller, index) =>
  {
    const key = this.resolveJabsControllerKey(controller, index);
    this.applyJabsInputConfigToController(key, controller);
  });
};

/**
 * Resets a controller to defaults and persists the mapping.
 * @param {number} index The adapter index of the controller to reset.
 */
Game_System.prototype.resetJabsInputConfigToDefaults = function(index)
{
  // get controllers from adapter.
  const list = JABS_InputAdapter.getAllControllers();

  // get the controller and its key.
  const controller = list[index];
  const key = this.resolveJabsControllerKey(controller, index);

  // build and apply defaults.
  const defaults = controller.buildDefaultMapping();
  controller.setAllInputs(defaults);

  // persist the defaults for future loads.
  this.setJabsInputConfig(key, defaults);
};

/**
 * Snapshots all live Input namespace bindings into system storage for persistence.
 */
Game_System.prototype.saveAllInputBindingsFromInput = function()
{
  // delegate to the Input manager to export all namespaces.
  const snapshot = Input.exportAllBindingsForSave();

  // persist the snapshot on the system object.
  this.setInputBindingsSnapshot(snapshot);
};

/**
 * Applies the persisted Input bindings snapshot back into the live Input registry.
 * Ensures Input defaults are bootstrapped before applying.
 */
Game_System.prototype.applyAllInputBindingsToInput = function()
{
  // ensure live registries have defaults before overlaying saved data.
  Input.ensureRemapBootstrapped();

  // import from the system-stored snapshot across all namespaces.
  const saved = this.getInputBindingsSnapshot();
  Input.importAllBindingsFromSave(saved);
};

/**
 * Resolves a stable key for the given controller for config storage.
 * Default strategy: "player" + (index+1).
 * @param {JABS_StandardController} controller The controller to resolve a key for.
 * @param {number} index The index of this controller in the adapter list.
 * @returns {string} The resolved key.
 */
Game_System.prototype.resolveJabsControllerKey = function(controller, index)
{
  // basic, stable default: player1, player2, ...
  return `player${index + 1}`;
};

/**
 * Initializes JABS input data for legacy saves that predate persistence.
 * If both the stored controller mappings and Input bindings snapshot are missing,
 * this seeds defaults one time so subsequent saves/loads work normally.
 */
Game_System.prototype.initializeJabsInputForLegacySaveIfMissing = function()
{
  // Ensure the JABS input scaffolding exists on loaded saves.
  this.initJabsInputConfigMembers();

  // Read the mappings dictionary if available, otherwise null.
  const mappingsDict = (this._j && this._j._abs && this._j._abs._input)
    ? this._j._abs._input._mappings
    : null;

  // Read the bindings dictionary if available, otherwise null.
  const bindingsDict = (this._j && this._j._abs && this._j._abs._input)
    ? this._j._abs._input._bindings
    : null;

  // Determine if any mappings exist in the save.
  const hasMappings = mappingsDict
    ? Object.keys(mappingsDict).length > 0
    : false;

  // Determine if any bindings exist in the save.
  const hasBindings = bindingsDict
    ? Object.keys(bindingsDict).length > 0
    : false;

  // If neither mappings nor bindings exist, initialize defaults for old saves.
  if (hasMappings === false && hasBindings === false)
  {
    // Ensure the live Input registry is bootstrapped with defaults.
    Input.ensureRemapBootstrapped();

    // For any currently-registered controllers, apply and persist defaults.
    const controllers = JABS_InputAdapter.getAllControllers();
    controllers.forEach((controller, index) =>
    {
      // Resolve a stable key for this controller.
      const key = this.resolveJabsControllerKey(controller, index);

      // Build defaults and apply to the live controller.
      const defaults = controller.buildDefaultMapping();
      controller.setAllInputs(defaults);

      // Persist defaults into the system store so it exists next save.
      this.setJabsInputConfig(key, defaults);
    });

    // Snapshot the default Input registry across all namespaces for persistence.
    const snapshot = Input.exportAllBindingsForSave();
    this.setInputBindingsSnapshot(snapshot);
  }
};

/**
 * Extends {@link #onBeforeSave}.<br/>
 * Snapshots controller mappings before saving.
 */
J.ABS.EXT.INPUT.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  const original = J.ABS.EXT.INPUT.Aliased.Game_System.get('onBeforeSave');
  original.call(this);

  // snapshot all current controller mappings into system storage.
  this.saveAllJabsInputConfigs();

  // snapshot the full Input registry (all namespaces) into system storage.
  this.saveAllInputBindingsFromInput();
};

/**
 * Extends {@link #onAfterLoad}.<br/>
 * Applies stored mappings after loading.
 */
J.ABS.EXT.INPUT.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.Game_System.get('onAfterLoad')
    .call(this);

  // Perform one-time initialization for legacy saves if required.
  this.initializeJabsInputForLegacySaveIfMissing();

  // apply the persisted Input bindings back into the live registry.
  this.applyAllInputBindingsToInput();

  // attempt to apply stored configs to any currently registered controllers.
  this.applyAllJabsInputConfigs();
};

//endregion Game_System

//region Scene_JabsRemap
/**
 * The scene for remapping JABS inputs.
 * Owns layout, capture flow, and applying/saving mappings.
 */
class Scene_JabsRemap
  extends Scene_MenuBase
{
  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  //region init
  /**
   * Initializes this scene and members.
   */
  initialize()
  {
    // perform original logic.
    super.initialize();

    // also initialize our scene properties.
    this.initMembers();
  }

  /**
   * Initialize all properties required by the scene.
   */
  initMembers()
  {
    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the primary members for the remap scene.
    this.initPrimaryMembers();
  }

  /**
   * Initializes the shared root namespace for this plugin branch.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with JABS.
     */
    this._j._abs ||= {};

    /**
     * A grouping of all properties associated with JABS input.
     */
    this._j._abs._input ||= {};
  }

  /**
   * Initializes windows and state tracking for the remap scene.
   */
  initPrimaryMembers()
  {
    /**
     * The collection of windows owned by this scene.
     */
    this._j._abs._input._windows = {
      _topHelp: null,
      _actions: null,
      _usageHelp: null,
      _command: null,
      _prompt: null,
    };

    /**
     * The state data for this scene.
     */
    this._j._abs._input._state = {
      _controllerIndex: 0,
      _controllers: [],
      _pendingByKey: {},
      _isCapturing: false,
      _capturingButton: null,
    };
  }

  //endregion init

  //region create
  /**
   * Creates all display objects for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // build the initial controller list and pending maps.
    this.buildControllerList();

    // create the various display objects on the screen.
    this.createDisplayObjects();

    // refresh layout with the current controller.
    this.refreshAll();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all remap-related windows.
   */
  createAllWindows()
  {
    // create the top action help (conventional help window).
    this.createTopHelpWindow();

    // create the actions window (middle-left region).
    this.createActionsWindow();

    // create the right-side usage/help panel (middle-right region).
    this.createUsageHelpWindow();

    // create the bottom command window (bottom region).
    this.createCommandWindow();

    // create the capture overlay (fullscreen overlay, hidden by default).
    this.createPromptWindow();
  }

  //endregion create

  //region windows
  //region top help window
  /**
   * Creates the top help window that describes the selected logical action.
   */
  createTopHelpWindow()
  {
    // create the window.
    const window = this.buildTopHelpWindow();

    // update the tracker with the new window.
    this.setTopHelpWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the top help window.
   * @returns {Window_Help}
   */
  buildTopHelpWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.topHelpWindowRectangle();

    // create the window with the rectangle.
    const window = new Window_Help(rectangle);

    // return the built and configured help window.
    return window;
  }

  /**
   * Gets the rectangle associated with the top help window.
   * @returns {Rectangle}
   */
  topHelpWindowRectangle()
  {
    // determine the height for the top help window (single row).
    const wh = this.calcWindowHeight(1.8, true);

    // compute the total width for the centered middle group.
    const ww = Math.floor(Graphics.boxWidth * 0.60);

    // compute the starting x so the band is centered on-screen.
    const wx = Math.floor((Graphics.boxWidth - ww) / 2);

    // position the window at the top of the screen.
    const wy = 0;

    // build the rectangle to return.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the currently tracked top help window.
   * @returns {Window_Help}
   */
  getTopHelpWindow()
  {
    return this._j._abs._input._windows._topHelp;
  }

  /**
   * Set the currently tracked top help window to the given window.
   * @param {Window_Help} helpWindow The help window to track.
   */
  setTopHelpWindow(helpWindow)
  {
    this._j._abs._input._windows._topHelp = helpWindow;
  }

  //endregion top help window

  //region actions window
  /**
   * Creates the actions list window (middle-left region).
   */
  createActionsWindow()
  {
    // create the window.
    const window = this.buildActionsWindow();

    // update the tracker with the new window.
    this.setActionsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the actions window.
   * @returns {Window_JabsRemapActions}
   */
  buildActionsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.actionsWindowRectangle();

    // create the window with the rectangle.
    const window = new Window_JabsRemapActions(rectangle);

    // bind handlers for interactions.
    window.setHandler('ok', this.onRemapRequested.bind(this));
    window.setHandler('clear', this.onClearBinding.bind(this));
    window.setHandler('cancel', this.onActionsCancel.bind(this));

    // attach the top help so selection changes update descriptions.
    window.setHelpWindow(this.getTopHelpWindow());

    // return the built and configured actions window.
    return window;
  }

  /**
   * Gets the rectangle associated with the actions window (middle-left region).
   * @returns {Rectangle}
   */
  actionsWindowRectangle()
  {
    // compute heights of top and bottom bands.
    const topH = this.topHelpWindowRectangle().height;
    const cmdH = this.commandWindowRectangle().height;

    // determine the height for the actions window (middle-left band).
    const wy = topH;
    const wh = Graphics.boxHeight - topH - cmdH;

    // compute the total width for the centered middle group (actions + usage help).
    const groupW = Math.floor(Graphics.boxWidth * 0.60);

    // compute the starting x so the group is centered on-screen.
    const groupX = Math.floor((Graphics.boxWidth - groupW) / 2);

    // compute the actions window width as 70% of the group.
    const actionsW = Math.floor(groupW * 0.70);

    // place the actions window at the left of the centered group.
    const wx = groupX;

    // build the rectangle to return.
    return new Rectangle(wx, wy, actionsW, wh);
  }

  /**
   * Gets the currently tracked actions window.
   * @returns {Window_JabsRemapActions}
   */
  getActionsWindow()
  {
    return this._j._abs._input._windows._actions;
  }

  /**
   * Set the currently tracked actions window to the given window.
   * @param {Window_JabsRemapActions} actionsWindow The actions window to track.
   */
  setActionsWindow(actionsWindow)
  {
    this._j._abs._input._windows._actions = actionsWindow;
  }

  //endregion actions window

  //region usage help window
  /**
   * Creates the right-side usage/help panel that lists scene controls.
   */
  createUsageHelpWindow()
  {
    // create the window.
    const window = this.buildUsageHelpWindow();

    // update the tracker with the new window.
    this.setUsageHelpWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the usage/help window.
   * @returns {Window_JabsRemapUsageHelp}
   */
  buildUsageHelpWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.usageHelpWindowRectangle();

    // create the window with the rectangle.
    const window = new Window_JabsRemapUsageHelp(rectangle);

    // return the built and configured usage/help window.
    return window;
  }

  /**
   * Gets the rectangle associated with the right-side usage/help window.
   * @returns {Rectangle}
   */
  usageHelpWindowRectangle()
  {
    // compute heights of top and bottom bands.
    const topH = this.topHelpWindowRectangle().height;
    const cmdH = this.commandWindowRectangle().height;

    // determine the height for the usage/help window (middle-right band).
    const wy = topH;
    const wh = Graphics.boxHeight - topH - cmdH;

    // compute the total width for the centered middle group (actions + usage help).
    const groupW = Math.floor(Graphics.boxWidth * 0.60);

    // compute the starting x so the group is centered on-screen.
    const groupX = Math.floor((Graphics.boxWidth - groupW) / 2);

    // compute the actions window width as 70% of the group.
    const actionsW = Math.floor(groupW * 0.70);

    // compute the usage/help window width as the remaining 30% of the group.
    const usageW = groupW - actionsW;

    // place the usage/help window immediately to the right of the actions window.
    const wx = groupX + actionsW;

    // build the rectangle to return.
    return new Rectangle(wx, wy, usageW, wh);
  }

  /**
   * Gets the currently tracked usage/help window.
   * @returns {Window_JabsRemapUsageHelp}
   */
  getUsageHelpWindow()
  {
    return this._j._abs._input._windows._usageHelp;
  }

  /**
   * Set the currently tracked usage/help window to the given window.
   * @param {Window_JabsRemapUsageHelp} helpWindow The usage/help window to track.
   */
  setUsageHelpWindow(helpWindow)
  {
    this._j._abs._input._windows._usageHelp = helpWindow;
  }

  //endregion usage help window

  //region command window
  /**
   * Creates the bottom command window (Apply/Reset/Cancel).
   */
  createCommandWindow()
  {
    // create the window.
    const window = this.buildCommandWindow();

    // update the tracker with the new window.
    this.setCommandWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);

    // keep actions as the primary interaction by default.
    window.deselect();
    window.deactivate();
  }

  /**
   * Sets up and defines the command window.
   * @returns {Window_JabsRemapCommand}
   */
  buildCommandWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.commandWindowRectangle();

    // create the window with the rectangle.
    const window = new Window_JabsRemapCommand(rectangle);

    // set the handlers for command selections.
    window.setHandler('apply', this.onApply.bind(this));
    window.setHandler('defaults', this.onDefaults.bind(this));
    window.setHandler('reset', this.onReset.bind(this));
    window.setHandler('cancel', this.popScene.bind(this));

    // return the built and configured command window.
    return window;
  }

  /**
   * Gets the rectangle associated with the command window.
   * @returns {Rectangle}
   */
  commandWindowRectangle()
  {
    // determine the height for the command window (bottom strip).
    const wh = this.calcWindowHeight(4, true);

    // determine the width as 75% of the screen.
    const ww = Math.floor(Graphics.boxWidth * 0.25);

    // center the window horizontally.
    const wx = Math.floor((Graphics.boxWidth - ww) / 2);

    // position the window at the bottom of the screen.
    const wy = Graphics.boxHeight - wh;

    // build the rectangle to return.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the currently tracked command window.
   * @returns {Window_JabsRemapCommand}
   */
  getCommandWindow()
  {
    return this._j._abs._input._windows._command;
  }

  /**
   * Set the currently tracked command window to the given window.
   * @param {Window_JabsRemapCommand} commandWindow The command window to track.
   */
  setCommandWindow(commandWindow)
  {
    this._j._abs._input._windows._command = commandWindow;
  }

  //endregion command window

  //region prompt window
  /**
   * Creates the capture prompt overlay window.
   */
  createPromptWindow()
  {
    // create the window.
    const window = this.buildPromptWindow();

    // update the tracker with the new window.
    this.setPromptWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the prompt overlay window.
   * @returns {Window_JabsRemapPrompt}
   */
  buildPromptWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.promptWindowRectangle();

    // instantiate the prompt.
    const window = new Window_JabsRemapPrompt(rectangle);

    // start hidden by default.
    window.hide();

    // return the built and configured prompt window.
    return window;
  }

  /**
   * Gets the rectangle associated with the prompt overlay window.
   * @returns {Rectangle}
   */
  promptWindowRectangle()
  {
    // define a fullscreen rectangle.
    return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
  }

  /**
   * Gets the currently tracked prompt overlay window.
   * @returns {Window_JabsRemapPrompt}
   */
  getPromptWindow()
  {
    return this._j._abs._input._windows._prompt;
  }

  /**
   * Set the currently tracked prompt overlay window to the given window.
   * @param {Window_JabsRemapPrompt} promptWindow The prompt window to track.
   */
  setPromptWindow(promptWindow)
  {
    this._j._abs._input._windows._prompt = promptWindow;
  }

  //endregion prompt window
  //endregion windows

  //region actions
  /**
   * Builds the controller list from the adapter and snapshots as pending.
   */
  buildControllerList()
  {
    // get all controllers from the adapter.
    const all = JABS_InputAdapter.getAllControllers();

    // constrain to the first controller only for the current UX.
    const controllers = all.length > 0
      ? [ all[0] ]
      : [];
    this.setControllers(controllers);

    // build pending maps keyed to playerN using the resolver.
    for (let i = 0; i < controllers.length; i++)
    {
      // resolve the key for this index.
      const key = this.resolveControllerKey(i);

      // export the live mapping from the controller.
      const exportMap = controllers[i].exportAllInputs();

      // ensure arrays for each binding (normalization).
      const normalized = {};

      // iterate over each exported mapping key.
      Object.keys(exportMap)
        .forEach(k =>
        {
          // read the value for this key.
          const v = exportMap[k];

          // if the value is already an array, clone it.
          if (Array.isArray(v))
          {
            normalized[k] = v.slice(0);
          }
          // if a single value exists, wrap it in an array.
          else if (v)
          {
            normalized[k] = [ v ];
          }
          // otherwise, use an empty array for no binding.
          else
          {
            normalized[k] = [];
          }
        });

      // store the mapping as the initial pending state.
      this._state()._pendingByKey[key] = normalized;
    }
  }

  /**
   * Resolves the stored-key for a controller index.
   * @param {number} index The adapter index for the controller.
   * @returns {string} The key in the form of player{n}.
   */
  resolveControllerKey(index)
  {
    // return the playerN key for this index.
    return `player${index + 1}`;
  }

  /**
   * Refreshes all windows for the current controller.
   */
  refreshAll()
  {
    // Build a combined display mapping (controller pending + external staged tokens).
    const combined = this.buildDisplayMapping();

    // Set the combined mapping and ensure it is the active focus.
    this.getActionsWindow()
      .setMapping(combined);

    // Activate the actions window by default.
    this.getActionsWindow()
      .activate();

    // Ensure the bottom command strip is not active by default.
    this.getCommandWindow()
      .deactivate();
  }

  /**
   * Builds a combined display mapping for the actions window.
   * Combines the current controller’s pending JABS mapping with staged external rows.
   * External rows are keyed as tokens: "__ext__<ns>:<key>" → string[].
   * @returns {Object<string, string[]>}
   */
  buildDisplayMapping()
  {
    // Start with a shallow clone of the controller’s pending mapping.
    const base = this.currentPendingMapping() || {};
    const combined = {};

    // clone base logical mappings (first binding shown by UI is at [0]).
    Object.keys(base)
      .forEach(button =>
      {
        const list = base[button];
        combined[button] = Array.isArray(list)
          ? list.slice(0)
          : [];
      });

    // Overlay staged external bindings as tokenized keys.
    const ext = this.getPendingExternal();
    const extKeys = Object.keys(ext);
    for (let i = 0; i < extKeys.length; i++)
    {
      const compound = extKeys[i]; // in the form ns:key
      const arr = ext[compound];
      combined[`__ext__${compound}`] = Array.isArray(arr)
        ? arr.slice(0)
        : [];
    }

    // Return the merged bag used purely for display in the window.
    return combined;
  }

  /**
   * Gets the pending mapping object for the current controller.
   * @returns {Object<string, string[]>}
   */
  currentPendingMapping()
  {
    // resolve the key for this controller index.
    const key = this.resolveControllerKey(this._state()._controllerIndex);

    // return the mapping for this key.
    return this._state()._pendingByKey[key];
  }

  /**
   * Ensures at most one logical action holds a given symbol across the mapping.
   * Last occurrence wins in iteration order.
   * @param {Object<string, string[]>} mapping The mapping to sanitize.
   */
  sanitizeMappingUnique(mapping)
  {
    // track the first owner of each symbol while scanning.
    const ownerBySymbol = {};

    // first pass: record the first time we see a symbol and clear dups on the fly.
    Object.keys(mapping)
      .forEach(button =>
      {
        // get the list for this button (we treat only the first binding in UI).
        const list = mapping[button] || [];

        // if empty, continue.
        if (list.length === 0) return;

        // read the primary symbol.
        const [ symbol ] = list;

        // if we’ve not seen it, mark ownership and continue.
        if (!ownerBySymbol[symbol])
        {
          ownerBySymbol[symbol] = button;
          return;
        }

        // otherwise another action already owns it; unbind here.
        mapping[button] = [];
      });
  }

  /**
   * Handler when Apply is chosen.
   */
  onApply()
  {
    // iterate all controllers to apply their pending JABS mappings.
    const controllers = this._state()._controllers;
    for (let i = 0; i < controllers.length; i++)
    {
      // get controller and key.
      const controller = controllers[i];
      const key = this.resolveControllerKey(i);

      // get the pending mapping for this controller.
      const mapping = this._state()._pendingByKey[key];

      // enforce uniqueness as a final pass before applying.
      this.sanitizeMappingUnique(mapping);

      // set the live mapping on the controller.
      controller.setAllInputs(mapping);

      // persist the mapping into the system for saves.
      $gameSystem.setJabsInputConfig(key, mapping);
    }

    // commit any staged external (registry-backed) edits now that Apply was chosen.
    this.flushPendingExternalBindings();

    // exit the scene after applying.
    SceneManager.pop();
  }

  /**
   * Replaces the pending map with the controller’s defaults (preview),
   * without applying to the live controller or saving.
   */
  onDefaults()
  {
    // get the working controller index and key.
    const idx = this._state()._controllerIndex;
    const key = this.resolveControllerKey(idx);

    // get the controller being edited.
    const controller = this._state()._controllers[idx];

    // build a fresh default mapping.
    const defaults = controller.buildDefaultMapping();

    // replace the pending mapping with defaults.
    this._state()._pendingByKey[key] = defaults;

    // refresh the actions to reflect defaults.
    this.getActionsWindow()
      .setMapping(this._state()._pendingByKey[key]);

    // flip back to the remap window.
    this.onActionsCancel();
    this.getCommandWindow()
      .deactivate();
    this.getActionsWindow()
      .activate();
  }

  /**
   * Handler when Reset is chosen.
   */
  onReset()
  {
    // rebuild pending based on current live controller mappings.
    this.buildControllerList();

    // refresh everything.
    this.refreshAll();
  }

  /**
   * Handler when the action list cancels.
   * Switch focus to the bottom command strip.
   */
  onActionsCancel()
  {
    // deactivate the actions window.
    this.getActionsWindow()
      .deactivate();

    // select the first command and activate the command window.
    this.getCommandWindow()
      .select(0);
    this.getCommandWindow()
      .activate();
  }

  /**
   * Begins a capture for the currently selected logical action.
   */
  onRemapRequested()
  {
    // read the current command row.
    const cmd = this.getActionsWindow()
      .currentData();

    // external row: start capture with a stable token and friendly label.
    if (cmd && cmd.ext && cmd.ext.kind === 'ext-action')
    {
      // store a token we will parse on apply: __ext__<ns>:<key>
      const token = `__ext__${cmd.ext.ns}:${cmd.ext.key}`;

      // begin capture with friendly label.
      this._state()._capturingButton = token;
      this._state()._isCapturing = true;
      this.getPromptWindow()
        .startPrompt(String(cmd.ext.label || ''));

      // deactivate normal windows while capturing.
      this.getCommandWindow()
        .deactivate();
      this.getActionsWindow()
        .deactivate();
      return;
    }

    // JABS logical action path (original behavior).
    const button = this.getActionsWindow()
      .currentButton();
    this.beginCapture(button);
  }

  /**
   * Clears the binding for the selected logical action.
   */
  onClearBinding()
  {
    // read the current command row.
    const cmd = this.getActionsWindow()
      .currentData();

    // if this row represents an external registry-backed action, clear the staged value only.
    if (cmd && cmd.ext && cmd.ext.kind === 'ext-action')
    {
      // stage an empty binding array for this external action.
      this.setPendingExternalBinding(cmd.ext.ns, cmd.ext.key, []);

      // refresh to reflect the staged clear.
      this.getActionsWindow()
        .refresh();
      return;
    }

    // JABS logical action path (original behavior).
    const button = this.getActionsWindow()
      .currentButton();
    const pending = this.currentPendingMapping();
    pending[button] = [];
    this.getActionsWindow()
      .setMapping(pending);
  }

  /**
   * Begins the capture overlay for a logical action.
   * @param {string} button The logical action to capture for.
   */
  beginCapture(button)
  {
    // record which logical action we are capturing for.
    this._state()._capturingButton = button;

    // set the capture flag.
    this._state()._isCapturing = true;

    // show the capture prompt overlay.
    this.getPromptWindow()
      .startPrompt(button);

    // deactivate normal windows while capturing.
    this.getCommandWindow()
      .deactivate();
    this.getActionsWindow()
      .deactivate();
  }

  /**
   * Ends the capture overlay.
   */
  endCapture()
  {
    // clear the capture flag and button.
    this._state()._isCapturing = false;
    this._state()._capturingButton = null;

    // hide the capture prompt overlay.
    this.getPromptWindow()
      .endPrompt();

    // reactivate actions window.
    this.getActionsWindow()
      .activate();
  }

  /**
   * Removes a symbol from all actions in the provided mapping, except for one.
   * @param {Object<string, string[]>} mapping The mapping to sanitize.
   * @param {string} symbol The physical input symbol to remove.
   * @param {string} exceptButton The logical action to exclude from removal.
   */
  unbindSymbolFromMapping(mapping, symbol, exceptButton)
  {
    // iterate all logical actions in the mapping.
    Object.keys(mapping)
      .forEach(key =>
      {
        // skip the action that is intended to receive this symbol.
        if (key === exceptButton) return;

        // read the current list for this action.
        const list = mapping[key] || [];

        // if there is nothing to remove, continue.
        if (!list.length) return;

        // filter out the symbol.
        const filtered = list.filter(s => s !== symbol);

        // if changed, write back the filtered list.
        if (filtered.length !== list.length)
        {
          mapping[key] = filtered;
        }
      });
  }

  /**
   * Assigns a symbol to the given logical action while enforcing uniqueness.
   * If external, writes into the scene’s pending external map (not live Input).
   * Live Input registry is only updated on Apply.
   * @param {string} button The logical action receiving the new binding, or an external token.
   * @param {string} symbol The physical input symbol to assign.
   */
  assignWithConflictResolution(button, symbol)
  {
    // check if this is an external capture token.
    if (typeof button === 'string' && button.indexOf('__ext__') === 0)
    {
      // extract the namespace and key from the token format: __ext__<ns>:<key>
      const without = button.substring('__ext__'.length);
      const splitAt = without.indexOf(':');

      // if the token was parseable, stage the change into pending-external.
      if (splitAt > 0)
      {
        // resolve the namespace and key within that namespace.
        const ns = without.substring(0, splitAt);
        const key = without.substring(splitAt + 1);

        // stage the binding into the scene-stored pending-external map.
        this.setPendingExternalBinding(ns, key, [ symbol ]);

        // reflect the updated mapping in the actions window immediately.
        this.getActionsWindow()
          .setMapping(this.buildDisplayMapping());

        // do not write to Input registry here; Apply will commit it.
        return;
      }
    }

    // otherwise, original JABS behavior for the pending map.
    const pending = this.currentPendingMapping();

    // remove this symbol from all other actions before assigning.
    this.unbindSymbolFromMapping(pending, symbol, button);

    // assign the symbol to the given logical action.
    pending[button] = [ symbol ];

    // reflect logical mapping updates, too.
    this.getActionsWindow()
      .setMapping(this.buildDisplayMapping());
  }

  /**
   * Gets (and initializes) the pending external bindings map for this scene.
   * Map shape: { 'ns:key': string[] }
   * @returns {Object<string, string[]>}
   */
  getPendingExternal()
  {
    // ensure the state bag exists.
    const state = this._state();

    // lazily add the pending external map if not present.
    state._pendingExternal ||= {};

    // return the map reference.
    return state._pendingExternal;
  }

  /**
   * Reads a staged binding array for an external action if present; otherwise null.
   * @param {string} ns The namespace, such as 'J.MAP'.
   * @param {string} key The logical key within that namespace.
   * @returns {string[]|null}
   */
  getPendingExternalBinding(ns, key)
  {
    // compute the compound key for this external binding.
    const compound = `${ns}:${key}`;

    // read the map of staged external bindings.
    const map = this.getPendingExternal();

    // return the staged array or null when absent.
    return Object.prototype.hasOwnProperty.call(map, compound)
      ? map[compound]
      : null;
  }

  /**
   * Stages a binding array for an external logical action.
   * @param {string} ns The namespace, such as 'J.MAP'.
   * @param {string} key The logical key within that namespace.
   * @param {string[]} physical The array of physical symbols to stage.
   */
  setPendingExternalBinding(ns, key, physical)
  {
    // compute the compound external key.
    const compound = `${ns}:${key}`;

    // write a defensive copy of the array into the staged map.
    this.getPendingExternal()[compound] = Array.isArray(physical)
      ? physical.slice(0)
      : [];
  }

  /**
   * Writes all staged external bindings into the live Input registry and clears the stage.
   */
  flushPendingExternalBindings()
  {
    // read the staged external binds map.
    const map = this.getPendingExternal();

    // iterate all staged keys and commit them to the Input registry.
    Object.keys(map)
      .forEach(compound =>
      {
        // split the compound key to extract ns and key.
        const splitAt = compound.indexOf(':');

        // skip malformed keys (should not happen).
        if (splitAt <= 0)
        {
          return;
        }

        // extract parts.
        const ns = compound.substring(0, splitAt);
        const key = compound.substring(splitAt + 1);

        // read the staged physical symbols.
        const physical = map[compound] || [];

        // commit to the engine-owned Input registry.
        Input.setBindings(ns, key, physical);
      });

    // persist the now-updated Input registry snapshot into $gameSystem.
    $gameSystem.saveAllInputBindingsFromInput();

    // clear the staged map so future edits start fresh.
    this._state()._pendingExternal = {};

    // after clearing, reflect the (now-committed) state in the window.
    this.getActionsWindow()
      .setMapping(this.buildDisplayMapping());
  }

  //endregion actions

  //region update
  /**
   * Standard per-frame update.
   */
  update()
  {
    // perform original logic.
    super.update();

    // if we are not capturing, do nothing.
    if (this._state()._isCapturing === false)
    {
      return;
    }

    // attempt to read a captured symbol from the prompt overlay.
    const captured = this.getPromptWindow()
      .pollCapturedSymbol();

    // if nothing has been captured yet, determine if the prompt has auto-closed.
    if (!captured)
    {
      // if the prompt is no longer active (timed out or otherwise closed),
      // then end the capture flow without applying a binding.
      if (this.getPromptWindow()
        .isActive() === false)
      {
        // end the capture flow and reactivate the actions window.
        this.endCapture();
      }

      // continue waiting if still active.
      return;
    }

    // resolve and assign with conflict handling.
    this.assignWithConflictResolution(this._state()._capturingButton, captured);

    // reflect the updated combined mapping (controller pending + external staged).
    this.getActionsWindow()
      .setMapping(this.buildDisplayMapping());

    // end the capture flow.
    this.endCapture();
  }

  //endregion update

  //region helpers
  /**
   * Convenience accessor for the scene state object.
   */
  _state()
  {
    return this._j._abs._input._state;
  }

  /**
   * Sets the controller collection being edited.
   * @param {Object[]} controllers The list of controllers.
   */
  setControllers(controllers)
  {
    this._state()._controllers = controllers;
  }

  //endregion helpers
}

//endregion Scene_JabsRemap

/**
 * Extends {@link #createCommandWindow}.<br/>
 * Also wires the handler for opening the JABS input remapping scene.
 */
J.ABS.EXT.INPUT.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.Scene_Menu.get('createCommandWindow')
    .call(this);

  // wire the handler for our custom command symbol.
  this._commandWindow.setHandler('jabsRemap', () =>
  {
    // open the JABS remapping scene.
    SceneManager.push(Scene_JabsRemap);
  });
};

/* eslint-disable max-len */

//region Window_JabsRemapActions
/**
 * The list window that shows logical actions and current bindings.
 * Refactored to extend {@link Window_Command} with builder-style organization
 * and namespaced state under {@link this._j._abs._input}.
 */
class Window_JabsRemapActions
  extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle to draw this window within.
   */
  constructor(rect)
  {
    // perform super initialize.
    super(rect);

    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the window-local members.
    this.initPrimaryMembers();

    // align selection to the first actionable entry by default.
    this.select(this.firstActionIndex());
  }

  //region init
  /**
   * Initializes the shared root namespace for this plugin branch.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with JABS.
     */
    this._j._abs ||= {};

    /**
     * A grouping of all properties associated with JABS input.
     */
    this._j._abs._input ||= {};

    /**
     * A grouping for this window within the input branch.
     */
    this._j._abs._input._actions ||= {};
  }

  /**
   * Initializes the state and view members for this window.
   */
  initPrimaryMembers()
  {
    /**
     * Window-local state bag.
     */
    this._j._abs._input._actions._state = {
      // The JABS mapping to display (owned/managed by the scene).
      _mapping: {},

      // The external mapping for rows built via buildExternalActionCommand().
      _externalMapping: {},

      // The authoritative, ordered list of JABS logical action keys to display.
      _buttons: [],
    };

    /**
     * Window-local view bag.
     */
    this._j._abs._input._actions._view = {
      // The help window bound to this command window.
      _helpWindow: null,
    };

    // Pre-build the static button list if not already present.
    if (this.getButtons().length === 0)
    {
      // Set the authoritative buttons list for this window.
      this.setButtons(this.buildButtonList());
    }
  }

  //endregion init

  //region accessors
  /**
   * Gets the current mapping being displayed.
   * @returns {Object<string, string[]>}
   */
  getMapping()
  {
    // read from the lazily-initialized state bag.
    return this._state()._mapping || {};
  }

  /**
   * Sets the mapping to display and refreshes.
   * @param {Object<string, string[]>} mapping The mapping to show and edit.
   */
  setMapping(mapping)
  {
    // store the mapping reference (scene owns lifecycle of the object).
    this._state()._mapping = mapping || {};

    // refresh the contents to draw the values.
    this.refresh();
  }

  /**
   * Gets the current external mapping reference owned by the scene.
   * The shape is: { [`${ns}:${key}`]: string[] }
   * @returns {Object<string, string[]>}
   */
  getExternalMapping()
  {
    // Read from the lazily-initialized state bag.
    return this._state()._externalMapping || {};
  }

  /**
   * Sets the external mapping reference for external action rows.
   * The scene should maintain and update this object; the window only reads it.
   * @param {Object<string, string[]>} externalMapping The external mapping.
   */
  setExternalMapping(externalMapping)
  {
    // Store the reference (scene owns lifecycle and updates).
    this._state()._externalMapping = externalMapping || {};

    // Refresh the contents to draw the values.
    this.refresh();
  }

  /**
   * Gets the ordered list of logical action keys.
   * @returns {string[]}
   */
  getButtons()
  {
    // obtain the window state bag.
    const state = this._state();

    // if we already have an authoritative list, use it.
    if (state._buttons && state._buttons.length > 0)
    {
      return state._buttons;
    }

    // otherwise, fall back to the canonical assignable list without mutating state.
    return this.buildButtonList();
  }

  /**
   * Sets the ordered list of logical action keys.
   * @param {string[]} buttons The ordered list of buttons.
   */
  setButtons(buttons)
  {
    // store a defensive copy of the ordered button list.
    this._state()._buttons = Array.isArray(buttons)
      ? buttons.slice(0)
      : [];

    // rebuild the command list to reflect the new set of rows.
    this.refresh();
  }

  /**
   * Gets the currently bound help window.
   * @returns {Window_Help|null}
   */
  getHelpWindow()
  {
    // return the tracked help window instance.
    return this._view()._helpWindow;
  }

  /**
   * Sets the help window and forwards to the base implementation for linkage.
   * @param {Window_Help} helpWindow The help window to bind.
   */
  setHelpWindow(helpWindow)
  {
    // store a local reference for access via getter.
    this._view()._helpWindow = helpWindow;

    // also perform the default linkage.
    super.setHelpWindow(helpWindow);
  }

  /**
   * Returns the current logical button at the cursor (or section label for headers).
   * @returns {string}
   */
  currentButton()
  {
    // read the current command.
    const cmd = this.currentData();

    // if there is no command, return empty.
    if (!cmd) return String.empty;

    // if this is a header, return its label.
    if (cmd.ext && cmd.ext.kind === 'header')
    {
      return String(cmd.ext.label || '');
    }

    // if this is an external action, return its display label (for prompt/help).
    if (cmd.ext && cmd.ext.kind === 'ext-action')
    {
      return String(cmd.ext.label || '');
    }

    // otherwise return the logical action key.
    return String(cmd.symbol || '');
  }

  /**
   * Lazily ensures the root namespace exists.
   */
  _root()
  {
    // ensure root namespaces.
    this._j ||= {};
    this._j._abs ||= {};
    this._j._abs._input ||= {};
    this._j._abs._input._actions ||= {};
  }

  /**
   * Lazily ensures and returns the window-local state bag.
   * @returns {{_mapping:Object<string,string[]>, _externalMapping:Object<string, string[]> , _buttons:string[]}}
   */
  _state()
  {
    // Ensure root namespaces.
    this._root();

    // Ensure and return the state bag with all tracked properties.
    const actions = this._j._abs._input._actions;
    actions._state ||= {
      _mapping: {},
      _externalMapping: {},
      _buttons: [],
    };
    return actions._state;
  }

  /**
   * Lazily ensures and returns the window-local view bag.
   * @returns {{_helpWindow:Window_Help|null}}
   */
  _view()
  {
    // ensure root namespaces.
    this._root();

    // ensure and return the view bag.
    const actions = this._j._abs._input._actions;
    actions._view ||= { _helpWindow: null };
    return actions._view;
  }

  //endregion accessors

  //region builders
  /**
   * Builds the ordered list of logical actions to show.
   * @returns {string[]}
   */
  buildButtonList()
  {
    // build from the canonical list of assignable inputs provided by JABS_Button.
    const list = JABS_Button.assignableInputs();

    // return as-is (the provided list is authoritative and de-duplicated).
    return list;
  }

  /**
   * Implements {@link Window_Command.prototype.makeCommandList}.<br>
   * Creates all commands (headers + actions) for this window.
   */
  makeCommandList()
  {
    // build all the commands for the window; this does not require pre-initialized state.
    const commands = this.buildCommands();

    // add all built commands to the list.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window (headers + actions).
   * Composed from small group builders to encourage extension.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // reference the assignable set for quick membership checks; falls back if not stored yet.
    const can = new Set(this.getButtons());

    // compile the rows in order using composition.
    const rows = [];

    // allow extensions to prepend entire sections before the built-ins.
    this.buildPreExtensionGroups(rows, can);

    // build primary group.
    this.buildPrimaryGroupRows(rows, can);

    // build secondary group.
    this.buildSecondaryGroupRows(rows, can);

    // build functional group.
    this.buildFunctionalGroupRows(rows, can);

    // allow extensions to append entire sections after the built-ins.
    this.buildPostExtensionGroups(rows, can);

    // return the compiled list of commands.
    return rows;
  }

  /**
   * Adds an action command row if the logical button is assignable in this context.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   * @param {string} button The logical button to conditionally add.
   */
  _addIf(rows, can, button)
  {
    // only add if the action is assignable in this context.
    if (can.has(button))
    {
      // build and push the action command row.
      rows.push(this.buildActionCommand(button));
    }
  }

  /**
   * Allows plugins to prepend custom sections before the built-in groups.
   * Default: no-op. Alias to insert rows.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   */
  // eslint-disable-next-line no-unused-vars
  buildPreExtensionGroups(rows, can)
  {
  }

  /**
   * Builds the Primary Actions section and its rows.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   */
  buildPrimaryGroupRows(rows, can)
  {
    // add a header for the primary actions.
    rows.push(this.buildHeaderCommand('Primary Actions'));

    // add primary logical actions if assignable.
    this._addIf(rows, can, JABS_Button.Mainhand);
    this._addIf(rows, can, JABS_Button.Offhand);
    this._addIf(rows, can, JABS_Button.Tool);
    this._addIf(rows, can, JABS_Button.Sprint);
  }

  /**
   * Builds the Secondary Actions section and its rows.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   */
  buildSecondaryGroupRows(rows, can)
  {
    // add a header for the secondary actions.
    rows.push(this.buildHeaderCommand('Secondary Actions'));

    // add secondary logical actions if assignable.
    this._addIf(rows, can, JABS_Button.SkillTrigger);
    this._addIf(rows, can, JABS_Button.Rotate);
    this._addIf(rows, can, JABS_Button.Strafe);
    this._addIf(rows, can, JABS_Button.Dodge);
  }

  /**
   * Builds the Functional Actions section and its rows.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   */
  buildFunctionalGroupRows(rows, can)
  {
    // add a header for the functional actions.
    rows.push(this.buildHeaderCommand('Functional Actions'));

    // add functional logical actions if assignable.
    this._addIf(rows, can, JABS_Button.Menu);
    this._addIf(rows, can, JABS_Button.Select);
  }

  /**
   * Allows plugins to append custom sections after the built-in groups.
   * Default: no-op. Override/alias to insert rows.
   * @param {BuiltWindowCommand[]} rows The rows being built.
   * @param {Set<string>} can The set of assignable logical action keys.
   */
  // eslint-disable-next-line no-unused-vars
  buildPostExtensionGroups(rows, can)
  {
    // default: intentionally empty for extensions to override.
  }

  /**
   * Builds a header command that is non-interactive.
   * @param {string} label The header label to display.
   * @returns {BuiltWindowCommand}
   */
  buildHeaderCommand(label)
  {
    // build a disabled command that represents a section header.
    return new WindowCommandBuilder(label)
      .setSymbol(`__header__${label}`)
      .setExtensionData({
        kind: 'header',
        label
      })
      .setEnabled(false)
      .build();
  }

  /**
   * Builds an actionable command for a logical action button.
   * @param {string} button The logical action key.
   * @returns {BuiltWindowCommand}
   */
  buildActionCommand(button)
  {
    // build an enabled command that represents a remappable action.
    return new WindowCommandBuilder(this.humanizeButton(button))
      .setSymbol(button)
      .setExtensionData({
        kind: 'action',
        button
      })
      .setEnabled(true)
      .build();
  }

  /**
   * Builds an actionable command for an external namespace logical action.
   * The window will read/write these directly via the Input registry.
   * @param {string} ns The namespace (ex: "J.MAP").
   * @param {string} key The logical key within that namespace.
   * @param {string} label The row label to display.
   * @param {number} [iconIndex=0] Optional fixed left-side icon index for this action.
   * @returns {BuiltWindowCommand}
   */
  buildExternalActionCommand(ns, key, label, iconIndex)
  {
    // build an enabled command that carries external namespace metadata.
    return new WindowCommandBuilder(label)
      .setSymbol(`__ext__${ns}:${key}`)
      .setExtensionData({
        kind: 'ext-action',
        ns: ns,
        key: key,
        label: label,
        // an optional fixed per-action icon for the left glyph; 0 means none provided.
        icon: Number(iconIndex) || 0,
      })
      .setEnabled(true)
      .build();
  }

  //endregion builders

  //region drawing
  /**
   * Draws a single item.
   * @param {number} index The index to draw.
   */
  drawItem(index)
  {
    // get the rectangle for this line.
    const rect = this.itemRectWithPadding(index);

    // resolve the command to draw.
    const cmd = this._list[index];

    // if no command found, do nothing.
    if (!cmd)
    {
      return;
    }

    // if this is a header row, draw it and exit.
    if (cmd.ext && cmd.ext.kind === 'header')
    {
      this._drawHeaderItem(rect, cmd);
      return;
    }

    // if this is an external registry-backed action, draw that and exit.
    if (cmd.ext && cmd.ext.kind === 'ext-action')
    {
      this._drawExternalActionItem(rect, cmd);
      return;
    }

    // otherwise render the standard JABS logical action row.
    this._drawJabsActionItem(rect, cmd);
  }

  /**
   * Draws a header row centered with system color styling.
   * @param {Rectangle} rect The row rectangle.
   * @param {{name:string, ext:object}} cmd The command data for this row.
   */
  _drawHeaderItem(rect, cmd)
  {
    // resolve a friendly header label.
    const name = cmd.name || '';

    // apply system color and bold before drawing.
    this.changeTextColor(ColorManager.systemColor());
    this.contents.fontBold = true;

    // draw the header centered across the full row.
    this.drawText(name, rect.x, rect.y, rect.width, 'center');

    // reset text styling after drawing.
    this.resetTextColor();
    this.contents.fontBold = false;
  }

  /**
   * Draws an external registry-backed action row.
   * @param {Rectangle} rect The row rectangle.
   * @param {{ name:string, symbol:string, ext:object }} cmd The command for this row.
   */
  _drawExternalActionItem(rect, cmd)
  {
    // read the display label for this external action.
    const displayLabel = String(cmd.ext.label || "");

    // read the combined mapping from the window (scene-provided view model).
    const combined = this.getMapping();

    // the command symbol is a stable token: "__ext__<ns>:<key>".
    const token = String(cmd.symbol || "");

    // if a staged entry exists in the combined mapping, prefer that list.
    const hasStaged = Object.prototype.hasOwnProperty.call(combined, token);
    const staged = hasStaged ? combined[token] : null;

    // otherwise, fall back to the live registry for this external action.
    const boundList = staged !== null
      ? (Array.isArray(staged) ? staged : [])
      : (Input.getBindings(cmd.ext.ns, cmd.ext.key) || []);

    // extract the primary binding if any.
    const bound = boundList.length > 0
      ? boundList[0]
      : String.empty;

    // prefer a fixed per-action icon if provided; otherwise use the bound symbol’s icon.
    const leftIcon = (cmd.ext.icon && cmd.ext.icon > 0)
      ? cmd.ext.icon
      : this.iconIndexForSymbol(bound);

    // compute vertical placement for the icon and the mid X for two-column layout.
    const iconY = this._iconYForRect(rect);
    const midX = rect.x + Math.floor(rect.width / 2);

    // draw the left column (icon + label).
    this._drawLeftLabelWithOptionalIcon(rect.x, iconY, leftIcon, displayLabel, rect, midX);

    // draw the center arrow.
    this._drawArrowBetweenColumns(rect, midX);

    // draw the right column binding text with icon escapes.
    const rightText = IconManager.jabsIconTextForSymbol(bound);
    this._drawRightBindingText(rect, midX, rightText);
  }

  /**
   * Draws a standard JABS logical action row using the window’s mapping.
   * @param {Rectangle} rect The row rectangle.
   * @param {{symbol:string}} cmd The command data for this row.
   */
  _drawJabsActionItem(rect, cmd)
  {
    // resolve the logical button key from the command.
    const button = String(cmd.symbol);

    // read the displayed mapping from the window state.
    const mapping = this.getMapping();

    // read the binding list for this logical action.
    const boundList = mapping[button] || [];

    // extract the primary binding if present.
    const bound = boundList.length > 0
      ? boundList[0]
      : String.empty;

    // choose a readable label for the logical action.
    const label = this.humanizeButton(button);

    // draw the shared layout for this label/binding.
    this._drawActionBindingRow(rect, label, bound);
  }

  /**
   * Computes a vertically-centered Y for drawing an icon within a row.
   * @param {Rectangle} rect The row rectangle.
   * @returns {number} The Y coordinate for the icon.
   */
  _iconYForRect(rect)
  {
    // read shared icon height from the image manager.
    const ih = ImageManager.iconHeight;

    // compute a vertically-centered y for the icon within the row.
    return rect.y + Math.max(0, Math.floor((this.lineHeight() - ih) / 2));
  }

  /**
   * Draws an optional icon at the left and the provided label next to it.
   * @param {number} leftX The left column start X.
   * @param {number} iconY The Y where an icon would be drawn.
   * @param {number} iconIndex The icon index to draw; 0 means no icon.
   * @param {string} label The label to draw.
   * @param {Rectangle} rect The row rectangle.
   * @param {number} midX The mid X to limit left column width.
   */
  _drawLeftLabelWithOptionalIcon(leftX, iconY, iconIndex, label, rect, midX)
  {
    // start the text at the left side.
    let labelX = leftX;

    // if we have a valid icon index (> 0), draw it and push the text to the right.
    if (iconIndex > 0)
    {
      // draw the icon to the far-left, preceding the action label.
      this.drawIcon(iconIndex, leftX, iconY);

      // add spacing for the icon width + padding before drawing the action text.
      labelX += ImageManager.iconWidth + 6;
    }

    // compute the maximum width for the left column (half of the row width).
    const leftW = Math.max(0, midX - rect.x);

    // draw the action label to the right of the icon (if any).
    this.drawText(label, labelX, rect.y, leftW);
  }

  /**
   * Draws a complete two-column action row for a given label and binding.
   * @param {Rectangle} rect The row rectangle.
   * @param {string} label The left-column label to display.
   * @param {string} bound The primary bound physical symbol to display on the right.
   */
  _drawActionBindingRow(rect, label, bound)
  {
    // resolve an icon index for the bound physical symbol.
    const iconIndex = this.iconIndexForSymbol(bound);

    // compute the vertical placement for an icon.
    const iconY = this._iconYForRect(rect);

    // compute the middle x for two-column layout.
    const midX = rect.x + Math.floor(rect.width / 2);

    // draw the left column (icon + label).
    this._drawLeftLabelWithOptionalIcon(rect.x, iconY, iconIndex, label, rect, midX);

    // draw the center arrow.
    this._drawArrowBetweenColumns(rect, midX);

    // draw the right column binding text with icon escapes.
    const rightText = IconManager.jabsIconTextForSymbol(bound);
    this._drawRightBindingText(rect, midX, rightText);
  }

  /**
   * Draws the center arrow that separates left/right columns.
   * @param {Rectangle} rect The row rectangle.
   * @param {number} midX The middle X of the row.
   */
  _drawArrowBetweenColumns(rect, midX)
  {
    // define the arrow glyph to draw.
    const arrow = '→';

    // draw the arrow centered between columns.
    this.drawText(arrow, midX - this.textWidth(arrow), rect.y, Math.floor(rect.width / 2));
  }

  /**
   * Draws the right-column binding text (may contain icon escapes), right-aligned.
   * @param {Rectangle} rect The row rectangle.
   * @param {number} midX The middle X of the row.
   * @param {string} rightText The text to draw (often produced by IconManager).
   */
  _drawRightBindingText(rect, midX, rightText)
  {
    // measure the rendered width (icons + text) to right-align manually.
    const rightWidth = this.textSizeEx(rightText).width;

    // compute the right-aligned x within the right half.
    const rightX = midX + Math.floor(rect.width / 2) - rightWidth;

    // draw the mapping text on the right column using drawTextEx (enables icons).
    this.drawTextEx(rightText, rightX, rect.y, Math.floor(rect.width / 2));
  }

  //endregion drawing

  //region help
  /**
   * Updates the linked help window with a description of the selected action.
   */
  updateHelp()
  {
    // read the bound help window.
    const help = this.getHelpWindow();

    // if we have no help window, do nothing.
    if (!help) return;

    // resolve the currently selected logical or header label.
    const button = this.currentButton();

    // build the description for this selection.
    const text = this.describeButton(button);

    // update the help text.
    help.setText(text);
  }

  //endregion help

  //region handling
  /**
   * Processes the OK input.
   * Prevents confirming header rows.
   */
  processOk()
  {
    // read the current command.
    const cmd = this.currentData();

    // if there is no command, buzz and do nothing.
    if (!cmd)
    {
      SoundManager.playBuzzer();
      return;
    }

    // block only headers; allow normal and external actions to proceed.
    if (cmd.ext && cmd.ext.kind === 'header')
    {
      SoundManager.playBuzzer();
      return;
    }

    // defer to default behavior when actionable.
    super.processOk();
  }

  /**
   * Defines the standard handlers for OK/Cancel and Clear.
   */
  processHandling()
  {
    // perform super handling.
    super.processHandling();

    // handle clear binding when the delete-like key is pressed.
    if (this.isOpenAndActive())
    {
      // if the PageDown key was triggered, clear the binding.
      if (Input.isTriggered('pagedown')) this.callHandler('clear');
    }
  }

  //endregion handling

  //region utils
  /**
   * Finds the first actionable command index (skips headers).
   * @returns {number}
   */
  firstActionIndex()
  {
    // find the first index in the list that is enabled.
    for (let i = 0; i < this._list.length; i++)
    {
      // read the command at this index.
      const cmd = this._list[i];

      // if enabled, return this index.
      if (cmd && cmd.enabled !== false) return i;
    }

    // fallback to zero when none found.
    return 0;
  }

  /**
   * Converts a logical button key into a readable label.
   * @param {string} button The logical button key.
   * @returns {string}
   */
  humanizeButton(button)
  {
    // map known logical keys to nice labels.
    const map = {};
    map[JABS_Button.Mainhand] = 'Mainhand';
    map[JABS_Button.Offhand] = 'Offhand';
    map[JABS_Button.Tool] = 'Tool';
    map[JABS_Button.Dodge] = 'Dodge';

    // updated, descriptive labels for the four combat actions (not assignable here).
    map[JABS_Button.CombatSkill1] = 'Skill Trigger + Mainhand';
    map[JABS_Button.CombatSkill2] = 'Skill Trigger + Offhand';
    map[JABS_Button.CombatSkill3] = 'Skill Trigger + Dodge';
    map[JABS_Button.CombatSkill4] = 'Skill Trigger + Tool';

    // modifiers & mobility.
    map[JABS_Button.Sprint] = 'Sprint';
    map[JABS_Button.SkillTrigger] = 'Skill Trigger';
    map[JABS_Button.Strafe] = 'Strafe';
    map[JABS_Button.Rotate] = 'Rotate';
    map[JABS_Button.Guard] = 'Guard';

    // functionality.
    map[JABS_Button.Menu] = 'Menu';
    map[JABS_Button.Select] = 'Party Cycle';

    // return the translated label or the key if missing.
    return map[button] || button;
  }

  /**
   * Resolves an icon for a physical input symbol by consulting the IconManager.
   * Falls back to 0 (no icon) when unmapped.
   * @param {string} symbol The physical symbol to resolve an icon for.
   * @returns {number} The icon index to draw, or 0 if none.
   */
  iconIndexForSymbol(symbol)
  {
    // delegate to IconManager for a single icon index (or 0).
    return IconManager.jabsIconIndexForSymbol(symbol);
  }

  /**
   * Gets a human-readable description for a logical action or header.
   * @param {string} button The logical action key or header label.
   * @returns {string} The description text.
   */
  describeButton(button)
  {
    // provide descriptions for section headers when selected.
    if (button === 'Primary Actions')
    {
      // describe the purpose of primary actions.
      return 'Primary actions used moment-to-moment: mainhand/offhand attacks and tools.\n' + 'These are your core mapped buttons for direct, immediate use.';
    }

    // provide descriptions for section headers when selected.
    if (button === 'Secondary Actions')
    {
      // describe the purpose of secondary actions.
      return 'Secondary and modifier inputs: Skill Trigger, Rotate, Strafe, Dodge.\n' + 'Hold or tap to modify movement or enable combat skill slots.';
    }

    // provide descriptions for section headers when selected.
    if (button === 'Functional Actions')
    {
      // describe the purpose of functional actions.
      return 'Functional shortcuts unrelated to attacks: open the JABS menu, cycle party leader.\n' + 'Useful for management between encounters or to swap leaders on the fly.';
    }

    // a small dictionary of descriptions per logical action.
    const d = {};

    // functionality
    d[JABS_Button.Menu] = 'Open the JABS quick menu.\nAccess actions, tools, and options.';
    d[JABS_Button.Select] = 'Cycle the party leader.\nRotate the front actor with the next in line.';

    // primaries
    d[JABS_Button.Mainhand] = 'Use the mainhand action.\nTypically your basic weapon attack.';
    d[JABS_Button.Offhand] = 'Use the offhand action.\nTypically your secondary skill, or the guard-ready indicator.';
    d[JABS_Button.Tool] = 'Use the selected tool.\nExecutes the currently equipped tool skill.';
    d[JABS_Button.Sprint] = 'Sprint while held.\nMove faster when conditions allow.';

    // modifiers
    d[JABS_Button.Dodge] = 'Execute the mobility skill.\nLunge, backstep, tumble, or similar move.';
    d[JABS_Button.Strafe] = 'Hold facing while moving.\nLocks direction for circle-strafing.';
    d[JABS_Button.Rotate] = 'Rotate in place while held.\nIf you are guard-ready, you will also raise your guard.';
    d[JABS_Button.SkillTrigger] = 'Enable combat skills while held.\nPrimary actions become Combat skills 1-4.';

    // NOTE: this is not actually directly mappable- it arbitrarily shares input with rotation.
    d[JABS_Button.Guard] = 'Hold to raise guard (if guard skill is available).\nRaises guard skill when available.';

    // combat (L1 + face buttons)
    d[JABS_Button.CombatSkill1] = 'Trigger Combat Skill 1.\nUsed with the Skill Trigger modifier.';
    d[JABS_Button.CombatSkill2] = 'Trigger Combat Skill 2.\nUsed with the Skill Trigger modifier.';
    d[JABS_Button.CombatSkill3] = 'Trigger Combat Skill 3.\nUsed with the Skill Trigger modifier.';
    d[JABS_Button.CombatSkill4] = 'Trigger Combat Skill 4.\nUsed with the Skill Trigger modifier.';

    // fallback to the logical name if no description exists.
    return d[button] || String(button);
  }

  //endregion utils
}

//endregion Window_JabsRemapActions

//region Window_JabsRemapCommand
/**
 * Bottom command strip for Apply / Reset / Cancel.
 */
class Window_JabsRemapCommand
  extends Window_Command
{
  /**
   * @param {Rectangle} rect The rectangle to draw this window within.
   */
  constructor(rect)
  {
    // perform super initialize.
    super(rect);
  }

  /**
   * Gets the number of visible rows.
   * @returns {number}
   */
  numVisibleRows()
  {
    // render a single row.
    return 4;
  }

  /**
   * Defines the commands for this window.
   */
  makeCommandList()
  {
    // build the commands.
    const commands = this.buildCommands();

    // add the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds the commands for this window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // build the "Apply" command.
    const apply = new WindowCommandBuilder('Apply current remapping')
      .setIconIndex(91)
      .setSymbol('apply')
      .setEnabled(true)
      .build();

    // build the "Reset to Defaults" command.
    const defaults = new WindowCommandBuilder('Reset to defaults')
      .setIconIndex(207)
      .setSymbol('defaults')
      .setEnabled(true)
      .build();

    // build the "Undo changes" command.
    const reset = new WindowCommandBuilder('Undo changes')
      .setIconIndex(74)
      .setSymbol('reset')
      .setEnabled(true)
      .build();

    // build the "Exit without saving" command.
    const cancel = new WindowCommandBuilder('Exit without saving')
      .setIconIndex(90)
      .setSymbol('cancel')
      .setEnabled(true)
      .build();

    return [ apply, defaults, reset, cancel ];
  }
}

//endregion Window_JabsRemapCommand

//region Window_JabsRemapPrompt
/**
 * Full-screen overlay that captures the next input symbol.
 */
class Window_JabsRemapPrompt
  extends Window_Base
{
  //region static
  /**
   * Frames to ignore immediate UI inputs after opening the prompt.
   * Adjusted for 60 FPS.
   * Can be migrated to plugin parameters later.
   * @type {number}
   */
  static WarmupFrames = 20; // ~0.33s

  /**
   * Maximum frames the prompt remains active before auto-closing.
   * Adjusted for 60 FPS.
   * Can be migrated to plugin parameters later.
   * @type {number}
   */
  static TimeoutFrames = 5 * 60; // 5s
  //endregion static

  /**
   * @param {Rectangle} rect The rectangle to draw this window within.
   */
  constructor(rect)
  {
    // perform super initialize.
    super(rect);

    // make background darker for overlay effect.
    this.opacity = 192;

    // initial draw.
    this.refresh();
  }

  //region init
  /**
   * Lazily ensures the root plugin namespace exists for this window's data.
   */
  _root()
  {
    // ensure root namespaces.
    this._j ||= {};
    this._j._abs ||= {};
    this._j._abs._input ||= {};
  }

  //endregion init

  //region accessors
  /**
   * Gets the captured symbol awaiting pickup by the scene.
   * @returns {string|null}
   */
  getCapturedSymbol()
  {
    this._root();
    return this._j._abs._input._remapCaptured ?? null;
  }

  /**
   * Sets the captured symbol awaiting pickup by the scene.
   * @param {string|null} v The captured symbol.
   */
  setCapturedSymbol(v)
  {
    this._root();
    this._j._abs._input._remapCaptured = v ?? null;
  }

  /**
   * Gets whether or not the prompt is currently active.
   * @returns {boolean}
   */
  isActive()
  {
    this._root();
    return this._j._abs._input._remapActive === true;
  }

  /**
   * Sets whether or not the prompt is currently active.
   * @param {boolean} v The new active state.
   */
  setActive(v)
  {
    this._root();
    this._j._abs._input._remapActive = v === true;
  }

  /**
   * Gets the remaining warmup frames.
   * @returns {number}
   */
  getWarmupFrames()
  {
    this._root();
    return this._j._abs._input._remapWarmup | 0;
  }

  /**
   * Sets the remaining warmup frames.
   * @param {number} v The frames to set.
   */
  setWarmupFrames(v)
  {
    this._root();
    this._j._abs._input._remapWarmup = Math.max(0, v | 0);
  }

  /**
   * Gets the remaining timeout frames.
   * @returns {number}
   */
  getTimeoutFrames()
  {
    this._root();
    return this._j._abs._input._remapTimeout | 0;
  }

  /**
   * Sets the remaining timeout frames.
   * @param {number} v The frames to set.
   */
  setTimeoutFrames(v)
  {
    this._root();
    this._j._abs._input._remapTimeout = Math.max(0, v | 0);
  }

  /**
   * Gets the logical action label being captured for.
   * @returns {string}
   */
  getButtonLabel()
  {
    this._root();
    return this._j._abs._input._remapButtonLabel || String.empty;
  }

  /**
   * Sets the logical action label being captured for.
   * @param {string} v The button label.
   */
  setButtonLabel(v)
  {
    this._root();
    this._j._abs._input._remapButtonLabel = String(v || '');
  }

  //endregion accessors

  //region lifecycle
  /**
   * Begins the prompt for the given logical action.
   * @param {string} button The logical action being captured.
   */
  startPrompt(button)
  {
    // reset the captured symbol.
    this.setCapturedSymbol(null);

    // set the active flag.
    this.setActive(true);

    // set a short warmup to avoid immediately capturing UI inputs.
    this.setWarmupFrames(Window_JabsRemapPrompt.WarmupFrames);

    // set the timeout duration.
    this.setTimeoutFrames(Window_JabsRemapPrompt.TimeoutFrames);

    // store the label for redraws each frame.
    this.setButtonLabel(button);

    // show the window.
    this.show();

    // draw prompt text.
    this.refresh();
  }

  /**
   * Ends the capture prompt.
   */
  endPrompt()
  {
    // clear the active flag.
    this.setActive(false);

    // hide the window.
    this.hide();
  }

  //endregion lifecycle

  //region update/capture
  /**
   * Per-frame update for capture.
   */
  update()
  {
    // perform original logic.
    super.update();

    // if not active, do nothing.
    if (this.isActive() === false)
    {
      return;
    }

    // attempt to find a triggered symbol using curated lists and warmup rules.
    const found = this._findTriggeredSymbol();

    // decrement warmup if active.
    this._decrementWarmup();

    // if we captured something, store it and end the prompt.
    if (found)
    {
      // set the captured symbol.
      this.setCapturedSymbol(found);

      // end the prompt.
      this.endPrompt();
      return;
    }

    // tick timeout, redraw countdown, and auto-cancel if time elapsed.
    if (this._tickTimeoutAndRedraw())
    {
      // timed out; end the prompt without capturing.
      this.setCapturedSymbol(null);
      this.endPrompt();
    }
  }

  /**
   * Attempts to find a triggered symbol from curated sets, honoring warmup.
   * Accepts only keyboard/gamepad symbols; mouse inputs are not considered.
   * @returns {string|null}
   */
  _findTriggeredSymbol()
  {
    // if in warmup, block all input to avoid accidental captures.
    if (this.getWarmupFrames() > 0)
    {
      return null;
    }

    // get curated symbols to poll.
    const symbols = this._curatedSymbols();

    // build a membership set for fast checks (also used for latest fallback).
    const allow = new Set(symbols);

    // check the curated list first (edge-triggered only).
    for (let i = 0; i < symbols.length; i++)
    {
      // get the symbol at this index.
      const s = symbols[i];

      // if this symbol was triggered, capture it.
      if (Input.isTriggered(s))
      {
        return s;
      }
    }

    // guarded fallback: allow latest only if it is curated AND edge-triggered.
    const latest = Input._latestButton;
    if (latest && allow.has(latest) && Input.isTriggered(latest))
    {
      return latest;
    }

    // nothing was captured this frame.
    return null;
  }

  /**
   * Gets the curated list of keyboard/gamepad symbols to poll each frame.
   * @returns {string[]}
   */
  _curatedSymbols()
  {
    // collect core input constants from the JABS input adapter constants.
    // These should reflect only keyboard/gamepad bindings.
    const k = J.ABS.Input;

    // build the list using adapter constants.
    const inputs = [
      // face/core actions.
      k.Mainhand, k.Offhand, k.Dash, k.Tool,

      // modifier/shoulder/trigger style.
      k.SkillTrigger, k.GuardTrigger, k.StrafeTrigger, k.MobilitySkill,

      // utility.
      k.PartyCycle, k.Quickmenu,

      // controller d-pad inputs.
      k.DPadUp, k.DPadDown, k.DPadLeft, k.DPadRight,
    ];

    // merge in engine-wide capture symbols registered by other plugins.
    const extras = Input.getRemapCaptureSymbols();

    // return the curated symbol list.
    return inputs.concat(extras);
  }

  /**
   * Decrements the warmup countdown when active.
   */
  _decrementWarmup()
  {
    // reduce warmup frames if still active.
    if (this.getWarmupFrames() > 0)
    {
      this.setWarmupFrames(this.getWarmupFrames() - 1);
    }
  }

  /**
   * Decrements the timeout, redraws countdown text, and returns whether it expired.
   * @returns {boolean} True if timeout reached zero this frame; false otherwise.
   */
  _tickTimeoutAndRedraw()
  {
    // if there is no timeout active, nothing to tick.
    if (this.getTimeoutFrames() <= 0)
    {
      return false;
    }

    // decrement remaining frames until timeout.
    this.setTimeoutFrames(this.getTimeoutFrames() - 1);

    // redraw the prompt text with updated countdown.
    this.refresh();

    // if the timeout reached zero, report expiry.
    if (this.getTimeoutFrames() === 0)
    {
      return true;
    }

    // timeout still active.
    return false;
  }

  //endregion update/capture

  //region drawing
  /**
   * Redraws the prompt if active, otherwise clears contents.
   */
  refresh()
  {
    // clear then draw if active.
    this.contents.clear();

    // only draw the prompt when active.
    if (this.isActive())
    {
      this.drawPrompt();
    }
  }

  /**
   * Draws the prompt text for the current button.
   */
  drawPrompt()
  {
    // compute center coordinates.
    const cx = 0;
    const cy = Math.floor(this.contentsHeight() / 2) - this.lineHeight();

    // draw title.
    this.drawText('Press a key or button…', cx, cy, this.contentsWidth(), 'center');

    // draw the logical button label.
    this.drawText(`for: ${this.getButtonLabel()}`, cx, cy + this.lineHeight(), this.contentsWidth(), 'center');

    // draw the countdown using inline math (60 FPS assumed).
    this.drawText(
      `Auto-cancels in ${(this.getTimeoutFrames() / 60).toFixed(1)}s`,
      cx,
      cy + this.lineHeight() * 2,
      this.contentsWidth(),
      'center',
    );
  }

  //endregion drawing

  //region api
  /**
   * Returns the captured symbol for one frame and clears it.
   * @returns {string|null}
   */
  pollCapturedSymbol()
  {
    // take the captured symbol into a temp.
    const out = this.getCapturedSymbol();

    // clear the captured symbol.
    this.setCapturedSymbol(null);

    // return the symbol.
    return out;
  }

  //endregion api
}

//endregion Window_JabsRemapPrompt

//region Window_JabsRemapUsageHelp
/**
 * Static usage/help panel for the JABS remap scene (right side).
 */
class Window_JabsRemapUsageHelp
  extends Window_Base
{
  /**
   * @param {Rectangle} rect The rectangle to draw this window within.
   */
  constructor(rect)
  {
    // perform super initialize.
    super(rect);

    // refresh immediately.
    this.refresh();
  }

  /**
   * Refreshes the static help text.
   */
  refresh()
  {
    // clear the contents.
    this.contents.clear();

    // build the ex-text with icons for each hint line.
    const rebind = `${IconManager.jabsIconTextForSymbol('ok')} Rebind`;
    const clear = `${IconManager.jabsIconTextForSymbol(J.ABS.Input.GuardTrigger)} Clear Binding`;

    // draw each line using drawTextEx so icons render.
    this.drawTextEx(rebind, 0, this.lineHeight() * 0, this.contentsWidth());
    this.drawTextEx(clear, 0, this.lineHeight() * 1, this.contentsWidth());
  }
}

//endregion Window_JabsRemapUsageHelp

/**
 * Extends {@link #addOriginalCommands}.<br/>
 * Also adds a command to open the JABS input remapping scene from the main menu.
 */
J.ABS.EXT.INPUT.Aliased.Window_MenuCommand.set('addOriginalCommands', Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.Window_MenuCommand.get('addOriginalCommands')
    .call(this);

  // if we cannot add the command, then do not.
  if (this.canAddJabsRemapCommand() === false) return;

  this.addJabsRemapCommand();
};

/**
 * Adds the JABS Controls command to the main menu.
 */
Window_MenuCommand.prototype.addJabsRemapCommand = function()
{
  // build the JABS remap command.
  const command = new WindowCommandBuilder('JABS Controls')
    .setSymbol('jabsRemap')
    .setIconIndex(2569)
    .setEnabled(true)
    .build();

  // determine what the last command is.
  const lastCommand = this._list.at(-1);

  // check if the last command is the "End Game" command.
  if (lastCommand.symbol === "gameEnd")
  {
    // add it before the "End Game" command.
    this._list.splice(this._list.length - 2, 0, command);
  }
  // the last command is something else.
  else
  {
    // just add it to the end.
    this.addBuiltCommand(command);
  }
};

/**
 * Determines whether or not the JABS Controls command can be added to the main menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_MenuCommand.prototype.canAddJabsRemapCommand = function()
{
  // if JABS is not present, then do not render this command.
  if (!J.ABS) return false;

  // render the command!
  return true;
};