//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.2.2 INPUT] A manager for overseeing the input of JABS.
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
 * - 2.2.2
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 2.2.1
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 2.2.0
 *    Removed independent remappability of sprint and mobility.
 *    Added support for tracking "in combat" to handle dash/mobility switching.
 *    Updated sprint input to switch to mobility skill while "in combat".
 * - 2.1.1
 *    Fixed typo in custom input mapping.
 * - 2.1.0
 *    Added ability to use dpad in "Window_Select"-based windows.
 *    Moved debug logic from J-ABS to this plugin.
 *    Updated old namespace for inputs to match this plugin.
 * - 2.0.0
 *    Significantly overhauled the plugin to support with input remapping.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/abs/ext/input/_models/JABS_Button.js
/**
* A static class containing all input keys available for JABS.
*/
var JABS_Button = class {
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
	static Mainhand = "Main";
	/**
	* The "offhand", "B" button, or "X" key.
	* Used for executing the offhand action.
	* @type {string}
	*/
	static Offhand = "Offhand";
	/**
	* The "tool", Triangle button, or Tab key (native symbol: tab).
	* Used for executing the currently selected tool skill.
	* @type {string}
	*/
	static Tool = "Tool";
	/**
	* Optional dodge / mobility skill input (R2 by default when remapped).
	* In combat, {@link JABS_Button.Sprint} (Square) handles mobility contextually.
	* @type {string}
	*/
	static Dodge = "Dodge";
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
	* The combat "enabler" (commonly L1 hold on gamepads).
	* Used as a modifier to enable Combat Skill 1–4 actions while held.
	* @type {string}
	*/
	static SkillTrigger = "SkillTrigger";
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
	* Gets all assignable buttons used for JABS.
	* @returns {string[]} A collection of JABS-input keys' identifiers.
	*/
	static assignableInputs() {
		const okInputs = [
			this.Mainhand,
			this.Offhand,
			this.Tool,
			this.SkillTrigger,
			this.Sprint,
			this.Strafe,
			this.Rotate,
			this.Menu,
			this.Select
		];
		const filtering = (buttonInput) => okInputs.includes(buttonInput);
		return this.allButtons().filter(filtering);
	}
	/**
	* Gets all currently available buttons used for JABS.
	* @returns {string[]} A collection of JABS-input key's identifiers.
	*/
	static allButtons() {
		return [
			this.Mainhand,
			this.Offhand,
			this.Tool,
			this.Sprint,
			this.SkillTrigger,
			this.Strafe,
			this.Rotate,
			this.Guard,
			this.Dodge,
			this.CombatSkill1,
			this.CombatSkill2,
			this.CombatSkill3,
			this.CombatSkill4,
			this.Menu,
			this.Select
		];
	}
};

//#endregion
//#region src/plugins/abs/ext/input/_models/JABS_StandardController.js
/**
* The class that handles input in the context of JABS for a player.
* A battler must be set in order for this to update.
* It is important to note that rotate and guard are arbitrarily coupled together by this controller.
*/
var JABS_StandardController = class extends JABS_BaseController {
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initializes this class.
	*/
	initialize() {
		this.initMembers();
		this.initMapping();
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		this.battler = null;
		/**
		* A collection of input mappings from logical action (button) to an array of physical inputs.
		* "Physical inputs" are `Input` symbols like `ok`, `cancel`, or custom entries registered by plugins.
		* @type {Map<string, string[]>}
		*/
		this.inputMapping = new Map();
		/**
		* Tracks whether the last-processed frame was considered in combat.
		* Used for treating a hold across the boundary (exploration → combat)
		* as a single edge-press for Mobility.
		* @type {boolean}
		*/
		this._lastInCombat = false;
	}
	/**
	* Initialize the button-to-input mappings.
	* Seeds from current JABS defaults.
	*/
	initMapping() {
		this.inputMapping.set(JABS_Button.Menu, [J.ABS.EXT.INPUT.Symbols.Quickmenu]);
		this.inputMapping.set(JABS_Button.Select, [J.ABS.EXT.INPUT.Symbols.PartyCycle]);
		this.inputMapping.set(JABS_Button.Mainhand, [J.ABS.EXT.INPUT.Symbols.Mainhand]);
		this.inputMapping.set(JABS_Button.Offhand, [J.ABS.EXT.INPUT.Symbols.Offhand]);
		this.inputMapping.set(JABS_Button.Tool, [J.ABS.EXT.INPUT.Symbols.Tool]);
		this.inputMapping.set(JABS_Button.Sprint, [J.ABS.EXT.INPUT.Symbols.Dash]);
		this.inputMapping.set(JABS_Button.Strafe, [J.ABS.EXT.INPUT.Symbols.StrafeTrigger]);
		this.inputMapping.set(JABS_Button.Rotate, [J.ABS.EXT.INPUT.Symbols.GuardTrigger]);
		this.inputMapping.set(JABS_Button.Guard, [J.ABS.EXT.INPUT.Symbols.GuardTrigger]);
		this.inputMapping.set(JABS_Button.SkillTrigger, [J.ABS.EXT.INPUT.Symbols.SkillTrigger]);
		this.inputMapping.set(JABS_Button.CombatSkill1, [J.ABS.EXT.INPUT.Symbols.CombatSkill1]);
		this.inputMapping.set(JABS_Button.CombatSkill2, [J.ABS.EXT.INPUT.Symbols.CombatSkill2]);
		this.inputMapping.set(JABS_Button.CombatSkill3, [J.ABS.EXT.INPUT.Symbols.CombatSkill3]);
		this.inputMapping.set(JABS_Button.CombatSkill4, [J.ABS.EXT.INPUT.Symbols.CombatSkill4]);
	}
	/**
	* Builds a plain-object of the default mappings without mutating this controller.
	* This is safe to use for "Reset to Defaults" previews in the remap scene.
	* @returns {Object<string, string[]>} The default logical->physical mapping.
	*/
	buildDefaultMapping() {
		const defaults = {};
		defaults[JABS_Button.Menu] = [J.ABS.EXT.INPUT.Symbols.Quickmenu];
		defaults[JABS_Button.Select] = [J.ABS.EXT.INPUT.Symbols.PartyCycle];
		defaults[JABS_Button.Mainhand] = [J.ABS.EXT.INPUT.Symbols.Mainhand];
		defaults[JABS_Button.Offhand] = [J.ABS.EXT.INPUT.Symbols.Offhand];
		defaults[JABS_Button.Tool] = [J.ABS.EXT.INPUT.Symbols.Tool];
		defaults[JABS_Button.Dodge] = [J.ABS.EXT.INPUT.Symbols.MobilitySkill];
		defaults[JABS_Button.Sprint] = [J.ABS.EXT.INPUT.Symbols.Dash];
		defaults[JABS_Button.Strafe] = [J.ABS.EXT.INPUT.Symbols.StrafeTrigger];
		defaults[JABS_Button.Rotate] = [J.ABS.EXT.INPUT.Symbols.GuardTrigger];
		defaults[JABS_Button.Guard] = [J.ABS.EXT.INPUT.Symbols.GuardTrigger];
		defaults[JABS_Button.SkillTrigger] = [J.ABS.EXT.INPUT.Symbols.SkillTrigger];
		defaults[JABS_Button.CombatSkill1] = [J.ABS.EXT.INPUT.Symbols.CombatSkill1];
		defaults[JABS_Button.CombatSkill2] = [J.ABS.EXT.INPUT.Symbols.CombatSkill2];
		defaults[JABS_Button.CombatSkill3] = [J.ABS.EXT.INPUT.Symbols.CombatSkill3];
		defaults[JABS_Button.CombatSkill4] = [J.ABS.EXT.INPUT.Symbols.CombatSkill4];
		return defaults;
	}
	/**
	* Resets this controller’s live bindings back to the defaults.
	* Does not touch persistence; the caller should save if desired.
	*/
	resetToDefaults() {
		const defaults = this.buildDefaultMapping();
		this.setAllInputs(defaults);
	}
	/**
	* Gets the physical inputs for the given logical button.
	* @param {string} button The logical action key.
	* @returns {string[]} The list of physical inputs associated with this action.
	*/
	getInputsForButton(button) {
		const raw = this.inputMapping.get(button);
		if (!raw) return [];
		if (Array.isArray(raw)) return raw.slice(0);
		return [raw];
	}
	/**
	* Gets the primary physical input for the given button (convenience).
	* @param {string} slot The logical action key.
	* @returns {string|undefined} The first physical input, if any.
	*/
	getInputForButton(slot) {
		const inputs = this.getInputsForButton(slot);
		return inputs.length > 0 ? inputs[0] : undefined;
	}
	/**
	* Overwrites the entire mapping for this controller in one call.
	* Accepts either a `Map<string, string|string[]>` or a plain object `{ [button]: string|string[] }`.
	* No saving happens here; this is purely runtime state.
	* @param {Map<string,(string|string[])>|Object<string,(string|string[])>} mapping The mapping to apply.
	*/
	setAllInputs(mapping) {
		this.inputMapping.clear();
		const toArray = (value) => {
			if (Array.isArray(value)) return value.slice(0);
			if (!value) return [];
			return [value];
		};
		if (mapping instanceof Map) {
			mapping.forEach((value, key) => {
				this.inputMapping.set(key, toArray(value));
			}, this);
		} else {
			Object.keys(mapping).forEach((key) => {
				this.inputMapping.set(key, toArray(mapping[key]));
			});
		}
		const rotateInputs = this.inputMapping.get(JABS_Button.Rotate) || [];
		this.inputMapping.set(JABS_Button.Guard, rotateInputs.slice(0));
	}
	/**
	* Exports the current mapping as a plain object suitable for saving.
	* @returns {Object<string,string[]>} A shallow copy of the current mapping.
	*/
	exportAllInputs() {
		const out = {};
		this.inputMapping.forEach((value, key) => out[key] = Array.isArray(value) ? value.slice(0) : []);
		return out;
	}
	/**
	* Determines if any physical input bound to the logical action was triggered this frame.
	* @param {string} button The logical action key.
	* @returns {boolean}
	*/
	isActionTriggered(button) {
		const inputs = this.getInputsForButton(button);
		for (let i = 0; i < inputs.length; i++) {
			const physical = inputs[i];
			if (Input.isTriggered(physical)) return true;
		}
		return false;
	}
	/**
	* Determines if any physical input bound to the logical action is currently pressed.
	* @param {string} button The logical action key.
	* @returns {boolean}
	*/
	isActionPressed(button) {
		const inputs = this.getInputsForButton(button);
		for (let i = 0; i < inputs.length; i++) {
			const physical = inputs[i];
			if (Input.isPressed(physical)) return true;
		}
		return false;
	}
	/**
	* Updates the input loop for tracking JABS input.
	*/
	update() {
		if (this.canUpdate() === false) return;
		this.updateMenuAction();
		this.updatePartyCycleAction();
		this.updateMainhandAction();
		this.updateOffhandAction();
		this.updateToolAction();
		this.updateSprintCommand();
		this.updateCombatAction1();
		this.updateCombatAction2();
		this.updateCombatAction3();
		this.updateCombatAction4();
		this.updateGuardCommand();
		this.updateStrafeCommand();
		this.updateRotateCommand();
	}
	/**
	* Checks whether or not we can update this controller's input.
	* @returns {boolean}
	*/
	canUpdate() {
		if (this.getBattler() === null) return false;
		return true;
	}
	/**
	* Monitors and takes action based on player input regarding the menu.
	* This is `Menu` on the gamepad by default.
	*/
	updateMenuAction() {
		if (this.isMenuActionTriggered()) {
			this.performMenuAction();
		}
	}
	/**
	* Checks the inputs of the menu action (Menu default).
	* @returns {boolean}
	*/
	isMenuActionTriggered() {
		if (this.isActionTriggered(JABS_Button.Menu)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the menu action (Menu default).
	*/
	performMenuAction() {
		JABS_InputAdapter.performMenuAction();
	}
	/**
	* Monitors and takes action based on player input regarding party cycling.
	* This is `Select` on the gamepad by default.
	*/
	updatePartyCycleAction() {
		if (this.isPartyCycleActionTriggered()) {
			this.performPartyCycleAction();
		}
	}
	/**
	* Checks the inputs of the party cycle action (Select default).
	* @returns {boolean}
	*/
	isPartyCycleActionTriggered() {
		if (this.isActionTriggered(JABS_Button.Select)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the party cycle action (Select default).
	*/
	performPartyCycleAction() {
		JABS_InputAdapter.performPartyCycling(false);
	}
	/**
	* Monitors and takes action based on player input regarding the mainhand action.
	* This is `A` on the gamepad by default.
	*/
	updateMainhandAction() {
		if (this.isMainhandActionTriggered()) {
			this.performMainhandAction();
		}
	}
	/**
	* Checks the inputs of the mainhand action currently assigned (A default).
	* @returns {boolean}
	*/
	isMainhandActionTriggered() {
		if (this.isCombatSkillUsageEnabled()) {
			return false;
		}
		if (this.isActionTriggered(JABS_Button.Mainhand)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the currently assigned mainhand action (A default).
	*/
	performMainhandAction() {
		JABS_InputAdapter.performMainhandAction(this.getBattler());
	}
	/**
	* Monitors and takes action based on player input regarding the offhand action.
	* This is `B` on the gamepad by default.
	*/
	updateOffhandAction() {
		if (this.isOffhandActionTriggered()) {
			this.performOffhandAction();
		}
	}
	/**
	* Checks the inputs of the offhand action currently assigned (B default).
	* @returns {boolean}
	*/
	isOffhandActionTriggered() {
		if (this.isCombatSkillUsageEnabled()) {
			return false;
		}
		if (this.isActionTriggered(JABS_Button.Offhand)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the currently assigned offhand action (B default).
	*/
	performOffhandAction() {
		JABS_InputAdapter.performOffhandAction(this.getBattler());
	}
	updateSprintCommand() {
		if (this.isSprintActionTriggered()) {
			this.performSprintAction();
		} else {
			this.performSprintAlterAction();
		}
	}
	/**
	* Checks the inputs of the sprint action currently assigned (Shift default).
	* Context-aware:
	* - Out of combat: treat Sprint as a held input (classic run).
	* - In combat: treat Sprint strictly as an edge-trigger (for Mobility/Dodge).
	* @returns {boolean}
	*/
	isSprintActionTriggered() {
		const battler = this.getBattler();
		const inCombat = battler.isInCombat();
		if (inCombat) {
			this._lastInCombat = true;
			return this.isActionTriggered(JABS_Button.Sprint);
		}
		this._lastInCombat = false;
		return this.isActionPressed(JABS_Button.Sprint);
	}
	/**
	* Enables sprinting for this controller's battler when out of combat.
	* In combat, Sprint becomes the Mobility/Dodge action instead.
	*/
	performSprintAction() {
		const battler = this.getBattler();
		if (battler.isInCombat()) {
			JABS_InputAdapter.performSprint(false, battler);
			JABS_InputAdapter.performDodgeAction(battler);
			return;
		}
		JABS_InputAdapter.performSprint(true, battler);
	}
	/**
	* Disables sprinting for this controller's battler.
	*/
	performSprintAlterAction() {
		const battler = this.getBattler();
		if (battler.isInCombat()) {
			return;
		}
		JABS_InputAdapter.performSprint(false, battler);
	}
	/**
	* Monitors and takes action based on player input regarding the tool action.
	* This is `Y` on the gamepad by default.
	*/
	updateToolAction() {
		if (this.isToolActionTriggered()) {
			this.performToolAction();
		}
	}
	/**
	* Checks the inputs of the tool action currently assigned (Y default).
	* @returns {boolean}
	*/
	isToolActionTriggered() {
		if (this.isCombatSkillUsageEnabled()) {
			return false;
		}
		if (this.isActionTriggered(JABS_Button.Tool)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the currently assigned tool action (Y default).
	*/
	performToolAction() {
		JABS_InputAdapter.performToolAction(this.getBattler());
	}
	/**
	* Checks the inputs to ensure the combat action enabler is being held down (L1 default).
	* @returns {boolean}
	*/
	isCombatSkillUsageEnabled() {
		if (this.isActionPressed(JABS_Button.SkillTrigger)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the combat action in the given slot.
	* @param {string} slot The slot to execute the combo action from.
	*/
	performCombatAction(slot) {
		JABS_InputAdapter.performCombatAction(slot, this.getBattler());
	}
	/**
	* Monitors and takes action based on player input regarding combat action 1.
	* This is `L1 + Mainhand` on the gamepad by default.
	*/
	updateCombatAction1() {
		if (this.isCombatAction1Triggered()) {
			this.performCombatAction(JABS_Button.CombatSkill1);
		}
	}
	/**
	* Checks the inputs of the combat action in slot 1.
	* Requires SkillTrigger held and CombatSkill1 triggered.
	* @returns {boolean}
	*/
	isCombatAction1Triggered() {
		if (this.isCombatSkillUsageEnabled()) {
			if (this.isActionTriggered(JABS_Button.Mainhand)) {
				return true;
			}
		}
		if (this.isActionTriggered(JABS_Button.CombatSkill1)) {
			return true;
		}
		return false;
	}
	/**
	* Monitors and takes action based on player input regarding combat action 2.
	* This is `L1 + Offhand` on the gamepad by default.
	*/
	updateCombatAction2() {
		if (this.isCombatAction2Triggered()) {
			this.performCombatAction(JABS_Button.CombatSkill2);
		}
	}
	/**
	* Checks the inputs of the combat action in slot 2.
	* Requires SkillTrigger held and CombatSkill2 triggered.
	* @returns {boolean}
	*/
	isCombatAction2Triggered() {
		if (this.isCombatSkillUsageEnabled()) {
			if (this.isActionTriggered(JABS_Button.Offhand)) {
				return true;
			}
		}
		if (this.isActionTriggered(JABS_Button.CombatSkill2)) {
			return true;
		}
		return false;
	}
	/**
	* Monitors and takes action based on player input regarding combat action 3.
	* This is `L1 + Dash` (X) on the gamepad by default.
	*/
	updateCombatAction3() {
		if (this.isCombatAction3Triggered()) {
			this.performCombatAction(JABS_Button.CombatSkill3);
		}
	}
	/**
	* Checks the inputs of the combat action in slot 3.
	* Requires SkillTrigger held and CombatSkill3 triggered.
	* @returns {boolean}
	*/
	isCombatAction3Triggered() {
		if (this.isCombatSkillUsageEnabled()) {
			if (this.isActionTriggered(JABS_Button.Sprint)) {
				return true;
			}
		}
		if (this.isActionTriggered(JABS_Button.CombatSkill3)) {
			return true;
		}
		return false;
	}
	/**
	* Monitors and takes action based on player input regarding combat action 4.
	* This is `L1 + Tool` (Y) on the gamepad by default.
	*/
	updateCombatAction4() {
		if (this.isCombatAction4Triggered()) {
			this.performCombatAction(JABS_Button.CombatSkill4);
		}
	}
	/**
	* Checks the inputs of the combat action in slot 4.
	* Requires SkillTrigger held and CombatSkill4 triggered.
	* @returns {boolean}
	*/
	isCombatAction4Triggered() {
		if (this.isCombatSkillUsageEnabled()) {
			if (this.isActionTriggered(JABS_Button.Tool)) {
				return true;
			}
		}
		if (this.isActionTriggered(JABS_Button.CombatSkill4)) {
			return true;
		}
		return false;
	}
	/**
	* Monitors and takes action based on player input regarding the strafe action.
	* This is `L2` on the gamepad by default.
	*/
	updateStrafeCommand() {
		if (this.isStrafeActionTriggered()) {
			this.performStrafeAction();
		} else {
			this.performStrafeAlterAction();
		}
	}
	/**
	* Checks the inputs of the strafe action currently assigned (L2 default).
	* @returns {boolean}
	*/
	isStrafeActionTriggered() {
		if (this.isActionPressed(JABS_Button.Strafe)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the currently assigned strafe action (L2 default).
	*/
	performStrafeAction() {
		JABS_InputAdapter.performStrafe(true, this.getBattler());
	}
	/**
	* Executes the currently assigned strafe alter-action (untouched-L2 default).
	*/
	performStrafeAlterAction() {
		JABS_InputAdapter.performStrafe(false, this.getBattler());
	}
	/**
	* Monitors and takes action based on player input regarding the rotate action.
	* This is `R1` on the gamepad by default.
	*/
	updateRotateCommand() {
		if (this.isRotateActionTriggered()) {
			this.performRotateAction();
		} else {
			this.performRotateAlterAction();
		}
	}
	/**
	* Checks the inputs of the rotate action currently assigned (R1 default).
	* @returns {boolean}
	*/
	isRotateActionTriggered() {
		if (this.isActionPressed(JABS_Button.Rotate)) {
			return true;
		}
		return false;
	}
	/**
	* Executes the currently assigned rotate action (R1 default).
	*/
	performRotateAction() {
		JABS_InputAdapter.performRotate(true, this.getBattler());
		JABS_InputAdapter.performGuard(true, this.getBattler());
	}
	/**
	* Executes the currently assigned rotate alter-action (untouched-R1 default).
	*/
	performRotateAlterAction() {
		JABS_InputAdapter.performRotate(false, this.getBattler());
		JABS_InputAdapter.performGuard(false, this.getBattler());
	}
	/**
	* Monitors and takes action based on player input regarding the guard action.
	* This is `R1` on the gamepad by default.
	*/
	updateGuardCommand() {
		if (this.isGuardActionTriggered()) {
			this.performGuardAction();
		} else {
			this.performGuardAlterAction();
		}
	}
	/**
	* Checks the inputs of the guard action currently assigned (R1 default).
	* @returns {boolean}
	*/
	isGuardActionTriggered() {
		if (this.isActionPressed(JABS_Button.Guard)) {
			return true;
		}
		return false;
	}
	/**
	* Activates the currently assigned guard action (R1 default).
	*/
	performGuardAction() {
		JABS_InputAdapter.performGuard(true, this.getBattler());
	}
	/**
	* Deactivates the currently assigned guard alter-action (untouched-R1 default).
	*/
	performGuardAlterAction() {
		JABS_InputAdapter.performGuard(false, this.getBattler());
	}
};

//#endregion
//#region src/plugins/abs/ext/input/_models/JabsInputSymbols.js
/**
* Symbol names registered with RMMZ {@link Input} for J-ABS Input extension mappings.
*/
var JabsInputSymbols = class {
	static DirUp = "up";
	static DirDown = "down";
	static DirLeft = "left";
	static DirRight = "right";
	static Mainhand = "ok";
	static Offhand = "cancel";
	static Dash = "shift";
	static Tool = "tab";
	static GuardTrigger = "pagedown";
	static SkillTrigger = "pageup";
	static MobilitySkill = "r2";
	static StrafeTrigger = "l2";
	static Quickmenu = "start";
	static PartyCycle = "select";
	static Debug = "cheat";
	static R3 = "r3";
	static L3 = "l3";
	static DPadUp = "dpad-up";
	static DPadDown = "dpad-down";
	static DPadLeft = "dpad-left";
	static DPadRight = "dpad-right";
	static CombatSkill1 = "combat-skill-1";
	static CombatSkill2 = "combat-skill-2";
	static CombatSkill3 = "combat-skill-3";
	static CombatSkill4 = "combat-skill-4";
};

//#endregion
//#region src/plugins/abs/ext/input/_metadata/_pluginMetadata.js
var J_InputPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/abs/ext/input/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.6.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.INPUT = {};
/**
* Cross-ship symbol table for other plugins (map minimap, omni quest, charge, …).
*/
J.ABS.EXT.INPUT.Symbols = {};
J.ABS.EXT.INPUT.Symbols.DirUp = JabsInputSymbols.DirUp;
J.ABS.EXT.INPUT.Symbols.DirDown = JabsInputSymbols.DirDown;
J.ABS.EXT.INPUT.Symbols.DirLeft = JabsInputSymbols.DirLeft;
J.ABS.EXT.INPUT.Symbols.DirRight = JabsInputSymbols.DirRight;
J.ABS.EXT.INPUT.Symbols.Mainhand = JabsInputSymbols.Mainhand;
J.ABS.EXT.INPUT.Symbols.Offhand = JabsInputSymbols.Offhand;
J.ABS.EXT.INPUT.Symbols.Dash = JabsInputSymbols.Dash;
J.ABS.EXT.INPUT.Symbols.Tool = JabsInputSymbols.Tool;
J.ABS.EXT.INPUT.Symbols.GuardTrigger = JabsInputSymbols.GuardTrigger;
J.ABS.EXT.INPUT.Symbols.SkillTrigger = JabsInputSymbols.SkillTrigger;
J.ABS.EXT.INPUT.Symbols.MobilitySkill = JabsInputSymbols.MobilitySkill;
J.ABS.EXT.INPUT.Symbols.StrafeTrigger = JabsInputSymbols.StrafeTrigger;
J.ABS.EXT.INPUT.Symbols.Quickmenu = JabsInputSymbols.Quickmenu;
J.ABS.EXT.INPUT.Symbols.PartyCycle = JabsInputSymbols.PartyCycle;
J.ABS.EXT.INPUT.Symbols.Debug = JabsInputSymbols.Debug;
J.ABS.EXT.INPUT.Symbols.R3 = JabsInputSymbols.R3;
J.ABS.EXT.INPUT.Symbols.L3 = JabsInputSymbols.L3;
J.ABS.EXT.INPUT.Symbols.DPadUp = JabsInputSymbols.DPadUp;
J.ABS.EXT.INPUT.Symbols.DPadDown = JabsInputSymbols.DPadDown;
J.ABS.EXT.INPUT.Symbols.DPadLeft = JabsInputSymbols.DPadLeft;
J.ABS.EXT.INPUT.Symbols.DPadRight = JabsInputSymbols.DPadRight;
J.ABS.EXT.INPUT.Symbols.CombatSkill1 = JabsInputSymbols.CombatSkill1;
J.ABS.EXT.INPUT.Symbols.CombatSkill2 = JabsInputSymbols.CombatSkill2;
J.ABS.EXT.INPUT.Symbols.CombatSkill3 = JabsInputSymbols.CombatSkill3;
J.ABS.EXT.INPUT.Symbols.CombatSkill4 = JabsInputSymbols.CombatSkill4;
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.INPUT.Metadata = new J_InputPluginMetadata("J-ABS-InputManager", "2.2.2");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.INPUT.Aliased = {
	DataManager: new Map(),
	Game_Player: new Map(),
	Game_System: new Map(),
	Input: new Map(),
	JABS_Engine: new Map(),
	JABS_Battler: new Map(),
	Window_MenuCommand: new Map(),
	Window_Selectable: new Map(),
	Scene_Menu: new Map()
};
/**
* The global reference for the player's input manager.
* This interprets and manages incoming inputs for JABS-related functionality.
* @type {JABS_StandardController}
* @global
*/
globalThis.$jabsController1 = null;

//#endregion
//#region src/plugins/abs/ext/input/_models/JABS_Battler.js
/**
* Generates a `JABS_Battler` based on the current leader of the party.
* Also assigns the controller inputs for the player.
*/
J.ABS.EXT.INPUT.Aliased.JABS_Battler.set("createPlayer", JABS_Battler.createPlayer);
JABS_Battler.createPlayer = function() {
	const playerJabsBattler = J.ABS.EXT.INPUT.Aliased.JABS_Battler.get("createPlayer").call(this);
	$jabsController1.setBattler(playerJabsBattler);
	return playerJabsBattler;
};
/**
* Extends {@link JABS_Battler.canActionConnect}.<br/>
* While the debug button is pressed, the player cannot be targeted.
* @returns {boolean} True if actions can potentially connect, false otherwise.
*/
J.ABS.EXT.INPUT.Aliased.JABS_Battler.set("canActionConnect", JABS_Battler.prototype.canActionConnect);
JABS_Battler.prototype.canActionConnect = function() {
	if (this.isPlayer() && Input.isPressed(J.ABS.EXT.INPUT.Symbols.Debug)) return false;
	return J.ABS.EXT.INPUT.Aliased.JABS_Battler.get("canActionConnect").call(this);
};

//#endregion
//#region src/plugins/abs/ext/input/_models/JABS_InputAdapter.js
/**
* Gets all registered input controllers managed by the adapter.
* Returns a shallow copy to prevent external mutation.
* @returns {JABS_StandardController[]} The list of registered controllers.
*/
JABS_InputAdapter.getAllControllers = function() {
	return this.controllers.slice(0);
};

//#endregion
//#region src/plugins/abs/ext/input/managers/DataManager.js
/**
* Extends {@link DataManager.createGameObjects}.<br/>
* Bootstraps input remap defaults, JABS icon/text registration, and controller 1.
*/
J.ABS.EXT.INPUT.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.ABS.EXT.INPUT.Aliased.DataManager.get("createGameObjects").call(this);
	Input.ensureRemapBootstrapped();
	IconManager.registerJabsIcons();
	IconManager.registerJabsInputTexts();
	if (!$jabsController1) {
		$jabsController1 = new JABS_StandardController();
	}
};

//#endregion
//#region src/plugins/abs/ext/input/managers/IconManager.js
/**
* A key-value mapping of physical input symbols to icon indices.
* @type {Record<string, number>}
*/
IconManager._jabsActionIconRegistry = {};
/**
* Gets the icon registry for JABS input symbols.
* @returns {Record<string, number>}
*/
IconManager.getJabsIconRegistry = function() {
	return IconManager._jabsActionIconRegistry;
};
/**
* Registers a custom icon for a given symbol.
* @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
* @param {number} iconIndex The icon index to use for the given symbol.
*/
IconManager.registerJabsIcon = function(symbol, iconIndex) {
	const validatedSymbol = String(symbol);
	const normalizedSymbol = validatedSymbol.trim().toLowerCase();
	if (!normalizedSymbol) {
		throw new Error(`Attempting to register an empty symbol for icon index: ${iconIndex}`);
	}
	const validatedIconIndex = Number(iconIndex);
	if (isNaN(validatedIconIndex)) {
		throw new Error(`Invalid icon index for symbol '${normalizedSymbol}': ${iconIndex}`);
	}
	const registry = this.getJabsIconRegistry();
	registry[normalizedSymbol] = validatedIconIndex;
};
/**
* Gets the icon index for a given physical input symbol.
* @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
* @returns {number} The icon index to use for the given symbol, or 0 if not mapped.
*/
IconManager.jabsIconIndexForSymbol = function(symbol) {
	const validatedSymbol = String(symbol);
	const normalizedSymbol = validatedSymbol.trim().toLowerCase();
	if (!normalizedSymbol) return 0;
	const registry = this.getJabsIconRegistry();
	return registry[normalizedSymbol] || 0;
};
/**
* Registers all JABS input symbols with their respective icon indices.
*/
IconManager.registerJabsIcons = function() {
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.Mainhand, 76);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.Offhand, 77);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.Tool, 176);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.Dash, 140);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.SkillTrigger, 86);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.StrafeTrigger, 82);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.GuardTrigger, 83);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.MobilitySkill, 13);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.Quickmenu, 2563);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.PartyCycle, 75);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.CombatSkill1, 79);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.CombatSkill2, 79);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.CombatSkill3, 79);
	this.registerJabsIcon(J.ABS.EXT.INPUT.Symbols.CombatSkill4, 79);
};
/**
* A key-value mapping of physical input symbols to ex-text.
* @type {Record<string, string>}
*/
IconManager._jabsInputTextRegistry = {};
/**
* Gets the ex-text registry for JABS input symbols.
* @returns {Record<string, string>}
*/
IconManager.getJabsInputTextRegistry = function() {
	return IconManager._jabsInputTextRegistry;
};
/**
* Registers custom ex-text for a given symbol.
* @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
* @param {string} text The ex-text to use for the given symbol.
*/
IconManager.registerJabsInputText = function(symbol, text) {
	const validatedSymbol = String(symbol);
	const normalizedSymbol = validatedSymbol.trim().toLowerCase();
	if (!normalizedSymbol) {
		throw new Error(`Attempting to register an empty symbol for ex-text: ${text}`);
	}
	const validatedText = String(text).trim();
	if (!validatedText) {
		throw new Error(`Attempting to register an empty ex-text for symbol: ${normalizedSymbol}`);
	}
	const registry = this.getJabsInputTextRegistry();
	registry[normalizedSymbol] = validatedText;
};
/**
* Get the ex-text for a given physical input symbol.
* @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
* @returns {string} The ex-text for the given symbol, or the symbol itself if not mapped.
*/
IconManager.jabsInputTextForSymbol = function(symbol) {
	const registry = this.getJabsInputTextRegistry();
	const validatedSymbol = String(symbol);
	const normalizedSymbol = validatedSymbol.toLowerCase();
	return registry[normalizedSymbol] || Input.labelForSymbol(normalizedSymbol) || symbol;
};
/**
* Gets the ex-text for a given physical input symbol.
* @param {string} symbol The physical input symbol (ex: "ok", "pagedown", "l2", "start").
* @returns {string} The ex-text for the given symbol, or the symbol itself if not mapped.
*/
IconManager.jabsIconTextForSymbol = function(symbol) {
	if (!symbol) return "(unbound)";
	return this.jabsInputTextForSymbol(symbol) || String(symbol);
};
/**
* Registers all JABS input symbols with their respective ex-text.
*/
IconManager.registerJabsInputTexts = function() {
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.Mainhand, "\\I[2448] / \\I[2432]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.Offhand, "\\I[2449] / \\I[2433]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.Tool, "\\I[2450] / \\I[2434]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.Dash, "\\I[2451] / \\I[2435]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.SkillTrigger, "\\I[2452] / \\I[2436]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.StrafeTrigger, "\\I[2454] / \\I[2438]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.GuardTrigger, "\\I[2453] / \\I[2437]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.MobilitySkill, "\\I[2455] / \\I[2439]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.Quickmenu, "\\I[2456] / \\I[2440]");
	this.registerJabsInputText(J.ABS.EXT.INPUT.Symbols.PartyCycle, "\\I[2457] / \\I[2441]");
};

//#endregion
//#region src/plugins/abs/ext/input/managers/Input.js
/**
* Extends the existing mapper for keyboards to accommodate for the
* additional skill inputs that are used for gamepads.
*/
Input.keyMapper = {
	...Input.keyMapper,
	192: JabsInputSymbols.Debug,
	90: JabsInputSymbols.Mainhand,
	88: JabsInputSymbols.Offhand,
	16: JabsInputSymbols.Dash,
	9: JabsInputSymbols.Tool,
	81: JabsInputSymbols.SkillTrigger,
	17: JabsInputSymbols.StrafeTrigger,
	69: JabsInputSymbols.GuardTrigger,
	18: JabsInputSymbols.MobilitySkill,
	13: JabsInputSymbols.Quickmenu,
	46: JabsInputSymbols.PartyCycle,
	38: JabsInputSymbols.DirUp,
	40: JabsInputSymbols.DirDown,
	37: JabsInputSymbols.DirLeft,
	39: JabsInputSymbols.DirRight,
	49: JabsInputSymbols.CombatSkill1,
	50: JabsInputSymbols.CombatSkill2,
	51: JabsInputSymbols.CombatSkill3,
	52: JabsInputSymbols.CombatSkill4
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
* - remapped: Y is now the tool button, and start is the menu.
*/
Input.gamepadMapper = {
	0: JabsInputSymbols.Mainhand,
	1: JabsInputSymbols.Offhand,
	2: JabsInputSymbols.Dash,
	3: JabsInputSymbols.Tool,
	4: JabsInputSymbols.SkillTrigger,
	5: JabsInputSymbols.GuardTrigger,
	6: JabsInputSymbols.StrafeTrigger,
	7: JabsInputSymbols.MobilitySkill,
	8: JabsInputSymbols.PartyCycle,
	9: JabsInputSymbols.Quickmenu,
	10: JabsInputSymbols.L3,
	11: JabsInputSymbols.R3,
	12: JabsInputSymbols.DPadUp,
	13: JabsInputSymbols.DPadDown,
	14: JabsInputSymbols.DPadLeft,
	15: JabsInputSymbols.DPadRight
};
Input._jRegistries ||= {
	actions: Object.create(null),
	symbolLabels: Object.create(null),
	capture: new Set(),
	bindings: Object.create(null),
	defaults: Object.create(null),
	bootstrapped: false
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
Input.registerAction = function(ns, def) {
	if (!ns || !def || !def.key) return;
	const bag = Input._jRegistries.actions;
	bag[ns] = bag[ns] || [];
	bag[ns].push({
		key: String(def.key),
		label: String(def.label || def.key),
		defaults: Array.isArray(def.defaults) ? def.defaults.slice() : [],
		category: String(def.category || "misc")
	});
};
/**
* Gets the registered logical actions for a namespace.
* @param {string} ns The namespace.
* @returns {Array<{key:string,label:string,defaults:string[],category:string}>}
*/
Input.getRegisteredActions = function(ns) {
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
Input.seedDefaultBindings = function(ns, defaults) {
	if (!ns || !defaults) return;
	const out = Object.create(null);
	const keys = Object.keys(defaults);
	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];
		out[k] = Array.isArray(defaults[k]) ? defaults[k].slice() : [];
	}
	Input._jRegistries.defaults[ns] = out;
};
/**
* Gets the live bindings (logical -> physical[]) for a namespace.
* If empty, returns a lazily-initialized copy of the defaults.
* @param {string} ns The namespace.
* @returns {Object<string, string[]>}
*/
Input.getAllBindings = function(ns) {
	const b = Input._jRegistries.bindings;
	if (!b[ns]) {
		const d = Input._jRegistries.defaults[ns] || Object.create(null);
		const clone = Object.create(null);
		const keys = Object.keys(d);
		for (let i = 0; i < keys.length; i++) {
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
Input.getBindings = function(ns, key) {
	const all = Input.getAllBindings(ns);
	const arr = all[key];
	return Array.isArray(arr) ? arr : [];
};
/**
* Overwrites the bound physical symbols for a single logical key.
* @param {string} ns The namespace.
* @param {string} key The logical action key.
* @param {string[]} physical Array of physical symbols.
*/
Input.setBindings = function(ns, key, physical) {
	const all = Input.getAllBindings(ns);
	all[key] = Array.isArray(physical) ? physical.slice() : [];
};
/**
* Resets a namespace’s live bindings back to the seeded defaults.
* @param {string} ns The namespace.
*/
Input.resetBindingsToDefaults = function(ns) {
	const d = Input._jRegistries.defaults[ns] || Object.create(null);
	const clone = Object.create(null);
	const keys = Object.keys(d);
	for (let i = 0; i < keys.length; i++) {
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
Input.isActionTriggered = function(ns, key) {
	const inputs = Input.getBindings(ns, key);
	for (let i = 0; i < inputs.length; i++) {
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
Input.isActionPressed = function(ns, key) {
	const inputs = Input.getBindings(ns, key);
	for (let i = 0; i < inputs.length; i++) {
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
Input.registerSymbolLabel = function(symbol, label) {
	Input._jRegistries.symbolLabels[String(symbol)] = String(label || symbol);
};
/**
* Resolves a friendly label for a physical input symbol.
* @param {string} symbol The physical symbol.
* @returns {string}
*/
Input.labelForSymbol = function(symbol) {
	const labels = Input._jRegistries.symbolLabels;
	const key = String(symbol);
	return labels[key] || key;
};
/**
* Registers a physical symbol as eligible for capture by the remap prompt.
* @param {string} symbol The symbol to allow.
*/
Input.registerRemapCaptureSymbol = function(symbol) {
	Input._jRegistries.capture.add(String(symbol));
};
/**
* Gets all extra capture-eligible symbols registered by plugins.
* @returns {string[]}
*/
Input.getRemapCaptureSymbols = function() {
	return Array.from(Input._jRegistries.capture);
};
/**
* Idempotent bootstrap for remap defaults and symbol labels.
* Should be called from DataManager.createGameObjects() on boot/load.
*/
Input.ensureRemapBootstrapped = function() {
	if (Input._jRegistries.bootstrapped === true) {
		return;
	}
	const d = {};
	d[JABS_Button.Menu] = [JabsInputSymbols.Quickmenu];
	d[JABS_Button.Select] = [JabsInputSymbols.PartyCycle];
	d[JABS_Button.Mainhand] = [JabsInputSymbols.Mainhand];
	d[JABS_Button.Offhand] = [JabsInputSymbols.Offhand];
	d[JABS_Button.Tool] = [JabsInputSymbols.Tool];
	d[JABS_Button.Sprint] = [JabsInputSymbols.Dash];
	d[JABS_Button.Strafe] = [JabsInputSymbols.StrafeTrigger];
	d[JABS_Button.Rotate] = [JabsInputSymbols.GuardTrigger];
	d[JABS_Button.Guard] = [JabsInputSymbols.GuardTrigger];
	d[JABS_Button.SkillTrigger] = [JabsInputSymbols.SkillTrigger];
	d[JABS_Button.CombatSkill1] = [JabsInputSymbols.CombatSkill1];
	d[JABS_Button.CombatSkill2] = [JabsInputSymbols.CombatSkill2];
	d[JABS_Button.CombatSkill3] = [JabsInputSymbols.CombatSkill3];
	d[JABS_Button.CombatSkill4] = [JabsInputSymbols.CombatSkill4];
	Input.seedDefaultBindings("JABS", d);
	Input.getAllBindings("JABS");
	Input.registerSymbolLabel(JabsInputSymbols.L3, "L3");
	Input.registerSymbolLabel(JabsInputSymbols.R3, "R3");
	Input.registerSymbolLabel(JabsInputSymbols.Tool, "Triangle");
	Input.registerSymbolLabel(JabsInputSymbols.StrafeTrigger, "L2");
	Input.registerSymbolLabel(JabsInputSymbols.MobilitySkill, "R2");
	Input.registerSymbolLabel(JabsInputSymbols.DPadUp, "D-Pad Up");
	Input.registerSymbolLabel(JabsInputSymbols.DPadDown, "D-Pad Down");
	Input.registerSymbolLabel(JabsInputSymbols.DPadLeft, "D-Pad Left");
	Input.registerSymbolLabel(JabsInputSymbols.DPadRight, "D-Pad Right");
	Input.registerRemapCaptureSymbol(JabsInputSymbols.L3);
	Input.registerRemapCaptureSymbol(JabsInputSymbols.R3);
	Input.registerRemapCaptureSymbol(JabsInputSymbols.DPadUp);
	Input.registerRemapCaptureSymbol(JabsInputSymbols.DPadDown);
	Input.registerRemapCaptureSymbol(JabsInputSymbols.DPadLeft);
	Input.registerRemapCaptureSymbol(JabsInputSymbols.DPadRight);
	Input.bootstrapAllKeyboardKeysForCapture();
	Input._jRegistries.bootstrapped = true;
};
/**
* Generates capture-eligible symbols for any keyboard keycodes that are not
* already mapped to core RMMZ symbols, and registers readable labels for them.
*/
Input.bootstrapAllKeyboardKeysForCapture = function() {
	const reserved = new Set([
		"ok",
		"cancel",
		"menu",
		"escape",
		"tab",
		"pageup",
		"pagedown",
		"shift",
		"control",
		"up",
		"down",
		"left",
		"right",
		"l2",
		"r2"
	]);
	const existingMap = Object.assign({}, Input.keyMapper);
	Object.keys(existingMap).forEach((code) => {
		const sym = existingMap[code];
		if (typeof sym === "string" && sym.length) {
			reserved.add(sym);
		}
	});
	for (let code = 8; code <= 222; code++) {
		if (Input._isBlacklistedKeycode(code)) {
			continue;
		}
		if (Object.prototype.hasOwnProperty.call(Input.keyMapper, code)) {
			const s = Input.keyMapper[code];
			if (s && reserved.has(s) === false) {
				Input.registerRemapCaptureSymbol(s);
				Input.registerSymbolLabel(s, Input._keycodeLabelFor(code, s));
			}
			continue;
		}
		const symbol = `key-${code}`;
		Input.keyMapper[code] = symbol;
		Input.registerRemapCaptureSymbol(symbol);
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
Input._isBlacklistedKeycode = function(code) {
	if (code >= 112 && code <= 123) {
		return true;
	}
	if (code >= 124 && code <= 135) {
		return true;
	}
	return false;
};
/**
* Resolves a display label for a given keycode.
* Falls back to the symbol if not recognized.
* @param {number} code The keyboard keycode (8..222 range typically).
* @param {string} fallback The fallback label when unknown.
* @returns {string}
*/
Input._keycodeLabelFor = function(code, fallback) {
	if (code >= 65 && code <= 90) {
		return String.fromCharCode(code);
	}
	if (code >= 48 && code <= 57) {
		return String(code - 48);
	}
	if (code >= 96 && code <= 105) {
		return `Num ${code - 96}`;
	}
	if (code >= 112 && code <= 123) {
		return `F${code - 111}`;
	}
	switch (code) {
		case 8: return "Backspace";
		case 9: return "Tab";
		case 13: return "Enter";
		case 16: return "Shift";
		case 17: return "Ctrl";
		case 18: return "Alt";
		case 19: return "Pause";
		case 20: return "CapsLock";
		case 27: return "Esc";
		case 32: return "Space";
		case 33: return "PageUp";
		case 34: return "PageDown";
		case 35: return "End";
		case 36: return "Home";
		case 37: return "Left";
		case 38: return "Up";
		case 39: return "Right";
		case 40: return "Down";
		case 45: return "Insert";
		case 46: return "Delete";
		case 91: return "Meta";
		case 93: return "Context";
		case 106: return "Num *";
		case 107: return "Num +";
		case 109: return "Num -";
		case 110: return "Num .";
		case 111: return "Num /";
		case 186: return "; :";
		case 187: return "= +";
		case 188: return ", <";
		case 189: return "- _";
		case 190: return ". >";
		case 191: return "/ ?";
		case 192: return "` ~";
		case 219: return "[ {";
		case 220: return "\\ |";
		case 221: return "] }";
		case 222: return "' \"";
	}
	return String(fallback || `Key ${code}`);
};
/**
* Adjustable stick axis threshold (deadzone) for converting axes → directions.
* Lower this if your controller’s axes don’t reach ±1.0. Default 0.50.
* @type {number}
*/
Input._axisThreshold = .5;
/**
* Sets the analog stick threshold.
* @param {number} v The new threshold (0.05–0.90 recommended).
*/
Input.setAxisThreshold = function(v) {
	const n = Number(v);
	if (!isNaN(n) && n > 0 && n < 1) {
		Input._axisThreshold = n;
	}
};
/**
* Extends {@link Input._updateGamepadState}.<br/>
* Extends gamepad processing to reinforce directions from axes
* using a configurable threshold, without disabling vanilla behavior.
* Ensures mutual exclusivity and proper clearing when axes return to neutral.
* Also writes results to the per-pad state, then rebuilds the merged state as
* (keyboardApprox OR currentGamepadAxes) so keyboard arrows are preserved while
* stick clears. Includes optional diagnostic logging when enabled.
* @param {Gamepad} gamepad The gamepad polled from navigator.getGamepads().
*/
J.ABS.EXT.INPUT.Aliased.Input.set("_updateGamepadState", Input._updateGamepadState);
Input._updateGamepadState = function(gamepad) {
	J.ABS.EXT.INPUT.Aliased.Input.get("_updateGamepadState").call(this, gamepad);
	if (!gamepad) {
		return;
	}
	const ensured = Input._ensurePadStates(gamepad);
	if (!ensured) {
		return;
	}
	const { s } = ensured;
	const { padState } = ensured;
	Input._normalizeDpadFromButtons(gamepad, s, padState);
	if (!gamepad.axes || gamepad.axes.length < 2) {
		return;
	}
	const s0 = Input._snapshotMergedDirections(s);
	const flags = Input._resolveAxesFlags(gamepad);
	Input._applyAxesToPerPad(padState, flags);
	const axesNow = Input._axesNowFromPadState(padState);
	const prevAxes = Input._axesStamp || {
		up: false,
		down: false,
		left: false,
		right: false
	};
	const kbdApprox = Input._keyboardApproxFromSnapshot(s0, prevAxes);
	Input._rebuildMergedDirections(s, kbdApprox, axesNow);
	Input._axesStamp = axesNow;
};
/**
* Ensures we have both the merged current state bag and the per-pad snapshot.
* @param {Gamepad} gamepad The polled gamepad.
* @returns {{ s: object, padState: object }|null}
*/
Input._ensurePadStates = function(gamepad) {
	const s = this._currentState;
	const padState = this._gamepadStates && typeof gamepad.index === "number" ? this._gamepadStates[gamepad.index] : null;
	if (!s || !padState) {
		return null;
	}
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
Input._normalizeDpadFromButtons = function(gamepad, s, padState) {
	const dpu = !!(gamepad.buttons && gamepad.buttons[12] && gamepad.buttons[12].pressed);
	const dpd = !!(gamepad.buttons && gamepad.buttons[13] && gamepad.buttons[13].pressed);
	const dpl = !!(gamepad.buttons && gamepad.buttons[14] && gamepad.buttons[14].pressed);
	const dpr = !!(gamepad.buttons && gamepad.buttons[15] && gamepad.buttons[15].pressed);
	s["dpad-up"] = dpu;
	s["dpad-down"] = dpd;
	s["dpad-left"] = dpl;
	s["dpad-right"] = dpr;
	padState["dpad-up"] = dpu;
	padState["dpad-down"] = dpd;
	padState["dpad-left"] = dpl;
	padState["dpad-right"] = dpr;
};
/**
* Captures the current merged cardinal directions into a plain object.
* @param {object} s The merged current state bag.
* @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
*/
Input._snapshotMergedDirections = function(s) {
	return {
		up: !!s.up,
		down: !!s.down,
		left: !!s.left,
		right: !!s.right
	};
};
/**
* Resolves axis flags from the left stick using the configured threshold.
* @param {Gamepad} gamepad The polled gamepad.
*/
Input._resolveAxesFlags = function(gamepad) {
	const ax = gamepad.axes && gamepad.axes.length > 0 ? gamepad.axes[0] || 0 : 0;
	const ay = gamepad.axes && gamepad.axes.length > 1 ? gamepad.axes[1] || 0 : 0;
	const t = Input._axisThreshold;
	const holdLeft = ax <= -t;
	const holdRight = ax >= t;
	const neutralX = !holdLeft && !holdRight;
	const holdUp = ay <= -t;
	const holdDown = ay >= t;
	const neutralY = !holdUp && !holdDown;
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
Input._applyAxesToPerPad = function(padState, f) {
	if (f.holdLeft) {
		padState.left = true;
		padState.right = false;
	} else if (f.holdRight) {
		padState.right = true;
		padState.left = false;
	} else if (f.neutralX) {
		padState.left = false;
		padState.right = false;
	}
	if (f.holdUp) {
		padState.up = true;
		padState.down = false;
	} else if (f.holdDown) {
		padState.down = true;
		padState.up = false;
	} else if (f.neutralY) {
		padState.up = false;
		padState.down = false;
	}
};
/**
* Extracts the current axis-derived directions from the per-pad snapshot.
* @param {object} padState The per-pad snapshot for this device.
* @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
*/
Input._axesNowFromPadState = function(padState) {
	return {
		up: padState.up === true,
		down: padState.down === true,
		left: padState.left === true,
		right: padState.right === true
	};
};
/**
* Separates an approximate keyboard-only contribution from the previous merged snapshot.
* Anything present in merged last frame that was NOT set by axes last frame is treated as keyboard.
* @param {{up:boolean,down:boolean,left:boolean,right:boolean}} s0 The merged snapshot prior to axes resolution.
* @param {{up:boolean,down:boolean,left:boolean,right:boolean}} prevAxes The last frame's axes contribution.
* @returns {{up:boolean,down:boolean,left:boolean,right:boolean}}
*/
Input._keyboardApproxFromSnapshot = function(s0, prevAxes) {
	return {
		up: s0.up && prevAxes.up === false,
		down: s0.down && prevAxes.down === false,
		left: s0.left && prevAxes.left === false,
		right: s0.right && prevAxes.right === false
	};
};
/**
* Rebuilds merged directions as (keyboardApprox OR currentGamepadAxes) for each cardinal.
* @param {object} s The merged current state bag to write into.
* @param {{up:boolean,down:boolean,left:boolean,right:boolean}} kbdApprox The keyboard-only approximation.
* @param {{up:boolean,down:boolean,left:boolean,right:boolean}} axesNow The axes contribution for this frame.
*/
Input._rebuildMergedDirections = function(s, kbdApprox, axesNow) {
	s.up = kbdApprox.up === true || axesNow.up === true;
	s.down = kbdApprox.down === true || axesNow.down === true;
	s.left = kbdApprox.left === true || axesNow.left === true;
	s.right = kbdApprox.right === true || axesNow.right === true;
};
/**
* Exports a deep-cloned snapshot of all live namespace bindings for save.
* Shape: { [ns: string]: { [key: string]: string[] } }
* @returns {Object<string, Object<string, string[]>>}
*/
Input.exportAllBindingsForSave = function() {
	const b = Input._jRegistries.bindings || Object.create(null);
	const out = Object.create(null);
	const namespaces = Object.keys(b);
	for (let i = 0; i < namespaces.length; i++) {
		const ns = namespaces[i];
		const map = b[ns] || Object.create(null);
		const clone = Object.create(null);
		const keys = Object.keys(map);
		for (let k = 0; k < keys.length; k++) {
			const key = keys[k];
			const arr = map[key];
			clone[key] = Array.isArray(arr) ? arr.slice(0) : [];
		}
		out[ns] = clone;
	}
	return out;
};
/**
* Imports all namespace bindings from a saved snapshot into the live registry.
* Any namespaces absent from the snapshot retain their current (bootstrapped) values.
* @param {Object<string, Object<string, string[]>>} saved The snapshot to import.
*/
Input.importAllBindingsFromSave = function(saved) {
	if (!saved || typeof saved !== "object") {
		return;
	}
	const b = Input._jRegistries.bindings;
	const namespaces = Object.keys(saved);
	for (let i = 0; i < namespaces.length; i++) {
		const ns = namespaces[i];
		const map = saved[ns] || Object.create(null);
		const clone = Object.create(null);
		const keys = Object.keys(map);
		for (let k = 0; k < keys.length; k++) {
			const key = keys[k];
			const arr = map[key];
			clone[key] = Array.isArray(arr) ? arr.slice(0) : [];
		}
		b[ns] = clone;
	}
};

//#endregion
//#region src/plugins/abs/ext/input/managers/JABS_Engine.js
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set("performPartyCycling", JABS_Engine.prototype.performPartyCycling);
/**
* Extends {@link #performPartyCycling}.<br/>
* Include reassigning the controller to the player.
*/
JABS_Engine.prototype.performPartyCycling = function() {
	J.ABS.EXT.INPUT.Aliased.JABS_Engine.get("performPartyCycling").call(this);
	$jabsController1.setBattler(this.getPlayer1());
};
/**
* Handles the player input.
*/
J.ABS.EXT.INPUT.Aliased.JABS_Engine.set("updateInput", JABS_Engine.prototype.updateInput);
JABS_Engine.prototype.updateInput = function() {
	J.ABS.EXT.INPUT.Aliased.JABS_Engine.get("updateInput").call(this);
	if (!this.canUpdateInput()) return;
	$jabsController1.update();
};

//#endregion
//#region src/plugins/abs/ext/input/objects/Game_Player.js
/**
* Extends {@link #isDebugThrough}.<br/>
* Allows the custom debug button to be pressed while JABS is active.
*/
J.ABS.EXT.INPUT.Aliased.Game_Player.set("isDebugThrough", Game_Player.prototype.isDebugThrough);
Game_Player.prototype.isDebugThrough = function() {
	if ($jabsEngine.absEnabled) {
		return Input.isPressed(J.ABS.EXT.INPUT.Symbols.Debug) && $gameTemp.isPlaytest();
	} else {
		return J.ABS.EXT.INPUT.Aliased.Game_Player.get("isDebugThrough").call(this);
	}
};

//#endregion
//#region src/plugins/abs/ext/input/objects/Game_System.js
/**
* Extends {@link #initMembers}.<br/>
* Initializes members used for storing JABS input mappings per controller.
*/
J.ABS.EXT.INPUT.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.ABS.EXT.INPUT.Aliased.Game_System.get("initMembers").call(this);
	this.initJabsInputConfigMembers();
};
/**
* Initializes members used for storing JABS input mappings and controller references.
*/
Game_System.prototype.initJabsInputConfigMembers = function() {
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
Game_System.prototype.getJabsInputMappings = function() {
	return this._j._abs._input._mappings;
};
/**
* Overwrites the stored mapping dictionary of controllerKey -> mapping object.
* @param {Object<string, Object<string,string>>} mappings The new mappings dictionary.
*/
Game_System.prototype.setJabsInputMappings = function(mappings) {
	this._j._abs._input._mappings = mappings;
};
/**
* Stores a full mapping for the given controller key.
* @param {string} controllerKey The key representing which controller this mapping belongs to.
* @param {Object<string,string>} mapping The mapping object to store.
*/
Game_System.prototype.setJabsInputConfig = function(controllerKey, mapping) {
	const copy = {};
	Object.keys(mapping).forEach((key) => copy[key] = mapping[key]);
	const mappings = this.getJabsInputMappings();
	mappings[controllerKey] = copy;
	this.setJabsInputMappings(mappings);
};
/**
* Gets the stored mapping for the given controller key.
* @param {string} controllerKey The key representing which controller’s mapping to retrieve.
* @returns {Object<string,string>|null} The stored mapping, or null if none found.
*/
Game_System.prototype.getJabsInputConfig = function(controllerKey) {
	const mappings = this.getJabsInputMappings();
	const found = mappings[controllerKey];
	if (!found) return null;
	const copy = {};
	Object.keys(found).forEach((key) => copy[key] = found[key]);
	return copy;
};
/**
* Gets the persisted snapshot of the Input registry bindings.
* Shape: { [ns: string]: { [key: string]: string[] } }
* @returns {Object<string, Object<string, string[]>>}
*/
Game_System.prototype.getInputBindingsSnapshot = function() {
	if (!this._j || !this._j._abs || !this._j._abs._input || !this._j._abs._input._bindings) {
		return {};
	}
	return this._j._abs._input._bindings || {};
};
/**
* Overwrites the persisted Input bindings snapshot on the system object.
* The provided object should follow the shape: { [ns]: { [key]: string[] } }.
* @param {Object<string, Object<string, string[]>>} snapshot The snapshot to store.
*/
Game_System.prototype.setInputBindingsSnapshot = function(snapshot) {
	const out = {};
	const namespaces = Object.keys(snapshot || {});
	for (let i = 0; i < namespaces.length; i++) {
		const ns = namespaces[i];
		const map = snapshot[ns] || {};
		const copy = {};
		const keys = Object.keys(map);
		for (let k = 0; k < keys.length; k++) {
			const key = keys[k];
			const arr = map[key];
			copy[key] = Array.isArray(arr) ? arr.slice(0) : [];
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
Game_System.prototype.applyJabsInputConfigToController = function(controllerKey, controller) {
	const mapping = this.getJabsInputConfig(controllerKey);
	if (!mapping) return;
	controller.setAllInputs(mapping);
};
/**
* Captures current mappings from all known controllers into system storage.
* This should be called before save, or explicitly by the remap scene’s Save.
*/
Game_System.prototype.saveAllJabsInputConfigs = function() {
	const controllers = JABS_InputAdapter.getAllControllers();
	controllers.forEach((controller, index) => {
		const key = this.resolveJabsControllerKey(controller, index);
		this.setJabsInputConfig(key, controller.exportAllInputs());
	});
};
/**
* Applies stored mappings to all currently registered controllers.
* Intended to be called after a save file loads.
*/
Game_System.prototype.applyAllJabsInputConfigs = function() {
	const controllers = JABS_InputAdapter.getAllControllers();
	controllers.forEach((controller, index) => {
		const key = this.resolveJabsControllerKey(controller, index);
		this.applyJabsInputConfigToController(key, controller);
	});
};
/**
* Resets a controller to defaults and persists the mapping.
* @param {number} index The adapter index of the controller to reset.
*/
Game_System.prototype.resetJabsInputConfigToDefaults = function(index) {
	const list = JABS_InputAdapter.getAllControllers();
	const controller = list[index];
	const key = this.resolveJabsControllerKey(controller, index);
	const defaults = controller.buildDefaultMapping();
	controller.setAllInputs(defaults);
	this.setJabsInputConfig(key, defaults);
};
/**
* Snapshots all live Input namespace bindings into system storage for persistence.
*/
Game_System.prototype.saveAllInputBindingsFromInput = function() {
	const snapshot = Input.exportAllBindingsForSave();
	this.setInputBindingsSnapshot(snapshot);
};
/**
* Applies the persisted Input bindings snapshot back into the live Input registry.
* Ensures Input defaults are bootstrapped before applying.
*/
Game_System.prototype.applyAllInputBindingsToInput = function() {
	Input.ensureRemapBootstrapped();
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
Game_System.prototype.resolveJabsControllerKey = function(controller, index) {
	return `player${index + 1}`;
};
/**
* Initializes JABS input data for legacy saves that predate persistence.
* If both the stored controller mappings and Input bindings snapshot are missing,
* this seeds defaults one time so subsequent saves/loads work normally.
*/
Game_System.prototype.initializeJabsInputForLegacySaveIfMissing = function() {
	this.initJabsInputConfigMembers();
	const mappingsDict = this._j && this._j._abs && this._j._abs._input ? this._j._abs._input._mappings : null;
	const bindingsDict = this._j && this._j._abs && this._j._abs._input ? this._j._abs._input._bindings : null;
	const hasMappings = mappingsDict ? Object.keys(mappingsDict).length > 0 : false;
	const hasBindings = bindingsDict ? Object.keys(bindingsDict).length > 0 : false;
	if (hasMappings === false && hasBindings === false) {
		Input.ensureRemapBootstrapped();
		const controllers = JABS_InputAdapter.getAllControllers();
		controllers.forEach((controller, index) => {
			const key = this.resolveJabsControllerKey(controller, index);
			const defaults = controller.buildDefaultMapping();
			controller.setAllInputs(defaults);
			this.setJabsInputConfig(key, defaults);
		});
		const snapshot = Input.exportAllBindingsForSave();
		this.setInputBindingsSnapshot(snapshot);
	}
};
/**
* Extends {@link #onBeforeSave}.<br/>
* Snapshots controller mappings before saving.
*/
J.ABS.EXT.INPUT.Aliased.Game_System.set("onBeforeSave", Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function() {
	const original = J.ABS.EXT.INPUT.Aliased.Game_System.get("onBeforeSave");
	original.call(this);
	this.saveAllJabsInputConfigs();
	this.saveAllInputBindingsFromInput();
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Applies stored mappings after loading.
*/
J.ABS.EXT.INPUT.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.ABS.EXT.INPUT.Aliased.Game_System.get("onAfterLoad").call(this);
	this.initializeJabsInputForLegacySaveIfMissing();
	this.applyAllInputBindingsToInput();
	this.applyAllJabsInputConfigs();
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_JabsRemapUsageHelp.js
/**
* Static usage/help panel for the JABS remap scene (right side).
*/
var Window_JabsRemapUsageHelp = class extends Window_Base {
	/**
	* @param {Rectangle} rect The rectangle to draw this window within.
	*/
	constructor(rect) {
		super(rect);
		this.refresh();
	}
	/**
	* Refreshes the static help text.
	*/
	refresh() {
		this.contents.clear();
		const rebind = `${IconManager.jabsIconTextForSymbol("ok")} Rebind`;
		const clear = `${IconManager.jabsIconTextForSymbol(J.ABS.EXT.INPUT.Symbols.Tool)} Clear Binding`;
		this.drawTextEx(rebind, 0, this.lineHeight() * 0, this.contentsWidth());
		this.drawTextEx(clear, 0, this.lineHeight() * 1, this.contentsWidth());
	}
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_JabsRemapPrompt.js
/**
* Full-screen overlay that captures the next input symbol.
*/
var Window_JabsRemapPrompt = class Window_JabsRemapPrompt extends Window_Base {
	/**
	* Frames to ignore immediate UI inputs after opening the prompt.
	* Adjusted for 60 FPS.
	* Can be migrated to plugin parameters later.
	* @type {number}
	*/
	static WarmupFrames = 20;
	/**
	* Maximum frames the prompt remains active before auto-closing.
	* Adjusted for 60 FPS.
	* Can be migrated to plugin parameters later.
	* @type {number}
	*/
	static TimeoutFrames = 5 * 60;
	/**
	* @param {Rectangle} rect The rectangle to draw this window within.
	*/
	constructor(rect) {
		super(rect);
		this.opacity = 192;
		this.refresh();
	}
	/**
	* Lazily ensures the root plugin namespace exists for this window's data.
	*/
	_root() {
		this._j ||= {};
		this._j._abs ||= {};
		this._j._abs._input ||= {};
	}
	/**
	* Gets the captured symbol awaiting pickup by the scene.
	* @returns {string|null}
	*/
	getCapturedSymbol() {
		this._root();
		return this._j._abs._input._remapCaptured ?? null;
	}
	/**
	* Sets the captured symbol awaiting pickup by the scene.
	* @param {string|null} v The captured symbol.
	*/
	setCapturedSymbol(v) {
		this._root();
		this._j._abs._input._remapCaptured = v ?? null;
	}
	/**
	* Gets whether or not the prompt is currently active.
	* @returns {boolean}
	*/
	isActive() {
		this._root();
		return this._j._abs._input._remapActive === true;
	}
	/**
	* Sets whether or not the prompt is currently active.
	* @param {boolean} v The new active state.
	*/
	setActive(v) {
		this._root();
		this._j._abs._input._remapActive = v === true;
	}
	/**
	* Gets the remaining warmup frames.
	* @returns {number}
	*/
	getWarmupFrames() {
		this._root();
		return this._j._abs._input._remapWarmup | 0;
	}
	/**
	* Sets the remaining warmup frames.
	* @param {number} v The frames to set.
	*/
	setWarmupFrames(v) {
		this._root();
		this._j._abs._input._remapWarmup = Math.max(0, v | 0);
	}
	/**
	* Gets the remaining timeout frames.
	* @returns {number}
	*/
	getTimeoutFrames() {
		this._root();
		return this._j._abs._input._remapTimeout | 0;
	}
	/**
	* Sets the remaining timeout frames.
	* @param {number} v The frames to set.
	*/
	setTimeoutFrames(v) {
		this._root();
		this._j._abs._input._remapTimeout = Math.max(0, v | 0);
	}
	/**
	* Gets the logical action label being captured for.
	* @returns {string}
	*/
	getButtonLabel() {
		this._root();
		return this._j._abs._input._remapButtonLabel || String.empty;
	}
	/**
	* Sets the logical action label being captured for.
	* @param {string} v The button label.
	*/
	setButtonLabel(v) {
		this._root();
		this._j._abs._input._remapButtonLabel = String(v || String.empty);
	}
	/**
	* Begins the prompt for the given logical action.
	* @param {string} button The logical action being captured.
	*/
	startPrompt(button) {
		this.setCapturedSymbol(null);
		this.setActive(true);
		this.setWarmupFrames(Window_JabsRemapPrompt.WarmupFrames);
		this.setTimeoutFrames(Window_JabsRemapPrompt.TimeoutFrames);
		this.setButtonLabel(button);
		this.show();
		this.refresh();
	}
	/**
	* Ends the capture prompt.
	*/
	endPrompt() {
		this.setActive(false);
		this.hide();
	}
	/**
	* Per-frame update for capture.
	*/
	update() {
		super.update();
		if (this.isActive() === false) {
			return;
		}
		const found = this._findTriggeredSymbol();
		this._decrementWarmup();
		if (found) {
			this.setCapturedSymbol(found);
			this.endPrompt();
			return;
		}
		if (this._tickTimeoutAndRedraw()) {
			this.setCapturedSymbol(null);
			this.endPrompt();
		}
	}
	/**
	* Attempts to find a triggered symbol from curated sets, honoring warmup.
	* Accepts only keyboard/gamepad symbols; mouse inputs are not considered.
	* @returns {string|null}
	*/
	_findTriggeredSymbol() {
		if (this.getWarmupFrames() > 0) {
			return null;
		}
		const symbols = this._curatedSymbols();
		const allow = new Set(symbols);
		for (let i = 0; i < symbols.length; i++) {
			const s = symbols[i];
			if (Input.isTriggered(s)) {
				return s;
			}
		}
		const latest = Input._latestButton;
		if (latest && allow.has(latest) && Input.isTriggered(latest)) {
			return latest;
		}
		return null;
	}
	/**
	* Gets the curated list of keyboard/gamepad symbols to poll each frame.
	* @returns {string[]}
	*/
	_curatedSymbols() {
		const k = J.ABS.EXT.INPUT.Symbols;
		const inputs = [
			k.Mainhand,
			k.Offhand,
			k.Dash,
			k.Tool,
			k.SkillTrigger,
			k.GuardTrigger,
			k.StrafeTrigger,
			k.MobilitySkill,
			k.PartyCycle,
			k.Quickmenu,
			k.DPadUp,
			k.DPadDown,
			k.DPadLeft,
			k.DPadRight
		];
		const extras = Input.getRemapCaptureSymbols();
		return inputs.concat(extras);
	}
	/**
	* Decrements the warmup countdown when active.
	*/
	_decrementWarmup() {
		if (this.getWarmupFrames() > 0) {
			this.setWarmupFrames(this.getWarmupFrames() - 1);
		}
	}
	/**
	* Decrements the timeout, redraws countdown text, and returns whether it expired.
	* @returns {boolean} True if timeout reached zero this frame; false otherwise.
	*/
	_tickTimeoutAndRedraw() {
		if (this.getTimeoutFrames() <= 0) {
			return false;
		}
		this.setTimeoutFrames(this.getTimeoutFrames() - 1);
		this.refresh();
		if (this.getTimeoutFrames() === 0) {
			return true;
		}
		return false;
	}
	/**
	* Redraws the prompt if active, otherwise clears contents.
	*/
	refresh() {
		this.contents.clear();
		if (this.isActive()) {
			this.drawPrompt();
		}
	}
	/**
	* Draws the prompt text for the current button.
	*/
	drawPrompt() {
		const cx = 0;
		const cy = Math.floor(this.contentsHeight() / 2) - this.lineHeight();
		this.drawText("Press a key or button…", cx, cy, this.contentsWidth(), "center");
		this.drawText(`for: ${this.getButtonLabel()}`, cx, cy + this.lineHeight(), this.contentsWidth(), "center");
		this.drawText(`Auto-cancels in ${(this.getTimeoutFrames() / 60).toFixed(1)}s`, cx, cy + this.lineHeight() * 2, this.contentsWidth(), "center");
	}
	/**
	* Returns the captured symbol for one frame and clears it.
	* @returns {string|null}
	*/
	pollCapturedSymbol() {
		const out = this.getCapturedSymbol();
		this.setCapturedSymbol(null);
		return out;
	}
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_JabsRemapCommand.js
/**
* Bottom command strip for Apply / Reset / Cancel.
*/
var Window_JabsRemapCommand = class extends Window_Command {
	/**
	* @param {Rectangle} rect The rectangle to draw this window within.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Gets the number of visible rows.
	* @returns {number}
	*/
	numVisibleRows() {
		return 4;
	}
	/**
	* Defines the commands for this window.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds the commands for this window.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const apply = new WindowCommandBuilder("Apply current remapping").setIconIndex(91).setSymbol("apply").setEnabled(true).build();
		const defaults = new WindowCommandBuilder("Reset to defaults").setIconIndex(207).setSymbol("defaults").setEnabled(true).build();
		const reset = new WindowCommandBuilder("Undo changes").setIconIndex(74).setSymbol("reset").setEnabled(true).build();
		const cancel = new WindowCommandBuilder("Exit without saving").setIconIndex(90).setSymbol("cancel").setEnabled(true).build();
		return [
			apply,
			defaults,
			reset,
			cancel
		];
	}
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_JabsRemapActions.js
var JABS_REMAP_HEADER_HELP = {
	"Primary Actions": "Primary actions used moment-to-moment: mainhand/offhand attacks and tools.\n" + "These are your core mapped buttons for direct, immediate use.",
	"Secondary Actions": "Secondary and modifier inputs: Skill Trigger, Rotate, Strafe, Dodge.\n" + "Hold or tap to modify movement or enable combat skill slots.",
	"Functional Actions": "Functional shortcuts unrelated to attacks: open the JABS menu, cycle party leader.\n" + "Useful for management between encounters or to swap leaders on the fly."
};
/**
* Cached labels + help text for logical JABS buttons (built once; keys use {@link JABS_Button}).
* @returns {{ labels: Object<string, string>, help: Object<string, string> }}
*/
function jabsRemapActionLookupMaps() {
	if (jabsRemapActionLookupMaps._cached) {
		return jabsRemapActionLookupMaps._cached;
	}
	const labels = {};
	labels[JABS_Button.Mainhand] = "Mainhand";
	labels[JABS_Button.Offhand] = "Offhand";
	labels[JABS_Button.Tool] = "Tool";
	labels[JABS_Button.Dodge] = "Dodge";
	labels[JABS_Button.CombatSkill1] = "Skill Trigger + Mainhand";
	labels[JABS_Button.CombatSkill2] = "Skill Trigger + Offhand";
	labels[JABS_Button.CombatSkill3] = "Skill Trigger + Dodge";
	labels[JABS_Button.CombatSkill4] = "Skill Trigger + Tool";
	labels[JABS_Button.Sprint] = "Sprint";
	labels[JABS_Button.SkillTrigger] = "Skill Trigger";
	labels[JABS_Button.Strafe] = "Strafe";
	labels[JABS_Button.Rotate] = "Rotate";
	labels[JABS_Button.Guard] = "Guard";
	labels[JABS_Button.Menu] = "Menu";
	labels[JABS_Button.Select] = "Party Cycle";
	const help = {};
	help[JABS_Button.Menu] = "Open the JABS quick menu.\nAccess actions, tools, and options.";
	help[JABS_Button.Select] = "Cycle the party leader.\nRotate the front actor with the next in line.";
	help[JABS_Button.Mainhand] = "Use the mainhand action.\nTypically your basic weapon attack.";
	help[JABS_Button.Offhand] = "Use the offhand action.\nTypically your secondary skill, or the guard-ready indicator.";
	help[JABS_Button.Tool] = "Use the selected tool.\nExecutes the currently equipped tool skill.";
	help[JABS_Button.Sprint] = "Sprint while held.\nMove faster when conditions allow.";
	help[JABS_Button.Dodge] = "Execute the mobility skill.\nLunge, backstep, tumble, or similar move.";
	help[JABS_Button.Strafe] = "Hold facing while moving.\nLocks direction for circle-strafing.";
	help[JABS_Button.Rotate] = "Rotate in place while held.\nIf you are guard-ready, you will also raise your guard.";
	help[JABS_Button.SkillTrigger] = "Enable combat skills while held.\nPrimary actions become Combat skills 1-4.";
	help[JABS_Button.Guard] = "Hold to raise guard (if guard skill is available).\nRaises guard skill when available.";
	help[JABS_Button.CombatSkill1] = "Trigger Combat Skill 1.\nUsed with the Skill Trigger modifier.";
	help[JABS_Button.CombatSkill2] = "Trigger Combat Skill 2.\nUsed with the Skill Trigger modifier.";
	help[JABS_Button.CombatSkill3] = "Trigger Combat Skill 3.\nUsed with the Skill Trigger modifier.";
	help[JABS_Button.CombatSkill4] = "Trigger Combat Skill 4.\nUsed with the Skill Trigger modifier.";
	jabsRemapActionLookupMaps._cached = {
		labels,
		help
	};
	return jabsRemapActionLookupMaps._cached;
}
/**
* The list window that shows logical actions and current bindings.
* Extends {@link Window_Command} with builder-style rows and namespaced state under
* {@link this._j._abs._input._actions}.
*/
var Window_JabsRemapActions = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw this window within.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
		this.select(this.firstActionIndex());
	}
	/**
	* Ensures `this._j._abs._input._actions` exists and seeds state/view bags.
	* Also hydrates the assignable button list when empty.
	*/
	initMembers() {
		this._j ||= {};
		this._j._abs ||= {};
		this._j._abs._input ||= {};
		this._j._abs._input._actions ||= {};
		const actions = this._j._abs._input._actions;
		actions._state = {
			_mapping: {},
			_externalMapping: {},
			_buttons: []
		};
		actions._view = { _helpWindow: null };
		if (this.getButtons().length === 0) {
			this.setButtons(this.buildButtonList());
		}
	}
	/**
	* Gets the current mapping being displayed.
	* @returns {Object<string, string[]>}
	*/
	getMapping() {
		return this._state()._mapping || {};
	}
	/**
	* Sets the mapping to display and refreshes.
	* @param {Object<string, string[]>} mapping The mapping to show and edit.
	*/
	setMapping(mapping) {
		this._state()._mapping = mapping || {};
		this.refresh();
	}
	/**
	* Gets the external mapping reference for rows from {@link buildExternalActionCommand}.
	* Shape: `{ [`${ns}:${key}`]: string[] }` (scene-owned; optional).
	* @returns {Object<string, string[]>}
	*/
	getExternalMapping() {
		return this._state()._externalMapping || {};
	}
	/**
	* Sets the external mapping reference; scene owns lifecycle.
	* @param {Object<string, string[]>} externalMapping The external mapping.
	*/
	setExternalMapping(externalMapping) {
		this._state()._externalMapping = externalMapping || {};
		this.refresh();
	}
	/**
	* Gets the ordered list of logical action keys.
	* @returns {string[]}
	*/
	getButtons() {
		const state = this._state();
		if (state._buttons && state._buttons.length > 0) {
			return state._buttons;
		}
		return this.buildButtonList();
	}
	/**
	* Sets the ordered list of logical action keys.
	* @param {string[]} buttons The ordered list of buttons.
	*/
	setButtons(buttons) {
		this._state()._buttons = Array.isArray(buttons) ? buttons.slice(0) : [];
		this.refresh();
	}
	/**
	* Gets the currently bound help window.
	* @returns {Window_Help|null}
	*/
	getHelpWindow() {
		return this._view()._helpWindow;
	}
	/**
	* Sets the help window and forwards to the base implementation for linkage.
	* @param {Window_Help} helpWindow The help window to bind.
	*/
	setHelpWindow(helpWindow) {
		this._view()._helpWindow = helpWindow;
		super.setHelpWindow(helpWindow);
	}
	/**
	* Returns the current logical button at the cursor (or section / external label for headers).
	* @returns {string}
	*/
	currentButton() {
		const cmd = this.currentData();
		if (!cmd) {
			return String.empty;
		}
		if (cmd.ext && cmd.ext.kind === "header") {
			return String(cmd.ext.label || String.empty);
		}
		if (cmd.ext && cmd.ext.kind === "ext-action") {
			return String(cmd.ext.label || String.empty);
		}
		if (cmd.ext && cmd.ext.kind === "action") {
			return String(cmd.ext.button || cmd.symbol || String.empty);
		}
		return String(cmd.symbol || String.empty);
	}
	/**
	* Ensures the `_j._abs._input._actions` chain exists.
	* Lazily mirrors ctor init so accessors stay valid when this window is touched without a full
	* new-game init path (continued saves, aliased entry, or future scene wiring).
	*/
	_root() {
		this._j ||= {};
		this._j._abs ||= {};
		this._j._abs._input ||= {};
		this._j._abs._input._actions ||= {};
	}
	/**
	* Lazily ensures and returns the window-local state bag.
	* @returns {{_mapping:Object<string,string[]>, _externalMapping:Object<string, string[]>, _buttons:string[]}}
	*/
	_state() {
		this._root();
		const actions = this._j._abs._input._actions;
		actions._state ||= {
			_mapping: {},
			_externalMapping: {},
			_buttons: []
		};
		return actions._state;
	}
	/**
	* Lazily ensures and returns the window-local view bag.
	* @returns {{_helpWindow:Window_Help|null}}
	*/
	_view() {
		this._root();
		const actions = this._j._abs._input._actions;
		actions._view ||= { _helpWindow: null };
		return actions._view;
	}
	/**
	* Built-in section specs (title + logical keys). Override to reorder or replace default sections.
	* @returns {{ title: string, buttons: string[] }[]}
	*/
	_builtinSectionSpecs() {
		return [
			{
				title: "Primary Actions",
				buttons: [
					JABS_Button.Mainhand,
					JABS_Button.Offhand,
					JABS_Button.Tool,
					JABS_Button.Sprint
				]
			},
			{
				title: "Secondary Actions",
				buttons: [
					JABS_Button.SkillTrigger,
					JABS_Button.Rotate,
					JABS_Button.Strafe,
					JABS_Button.Dodge
				]
			},
			{
				title: "Functional Actions",
				buttons: [JABS_Button.Menu, JABS_Button.Select]
			}
		];
	}
	/**
	* Appends built-in header + action rows between pre/post extension hooks.
	* @param {BuiltWindowCommand[]} rows Accumulated rows.
	* @param {Set<string>} can Assignable logical keys for this window.
	*/
	buildBuiltinActionSections(rows, can) {
		const specs = this._builtinSectionSpecs();
		for (let i = 0; i < specs.length; i++) {
			const spec = specs[i];
			rows.push(this.buildHeaderCommand(spec.title));
			for (let j = 0; j < spec.buttons.length; j++) {
				this._addIf(rows, can, spec.buttons[j]);
			}
		}
	}
	/**
	* Builds the ordered list of logical actions to show.
	* @returns {string[]}
	*/
	buildButtonList() {
		return JABS_Button.assignableInputs();
	}
	/**
	* Implements {@link Window_Command.prototype.makeCommandList}.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands (headers + actions) for this window.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const can = new Set(this.getButtons());
		const rows = [];
		this.buildPreExtensionGroups(rows, can);
		this.buildBuiltinActionSections(rows, can);
		this.buildPostExtensionGroups(rows, can);
		return rows;
	}
	/**
	* Adds an action row when the logical key is assignable in this context.
	* @param {BuiltWindowCommand[]} rows Rows being built.
	* @param {Set<string>} can Assignable logical keys.
	* @param {string} button Logical key.
	*/
	_addIf(rows, can, button) {
		if (can.has(button)) {
			rows.push(this.buildActionCommand(button));
		}
	}
	/**
	* Prepend custom sections before built-in groups.
	* @param {BuiltWindowCommand[]} rows Rows being built.
	* @param {Set<string>} can Assignable logical keys.
	*/
	buildPreExtensionGroups(rows, can) {}
	/**
	* Append custom sections after built-in groups.
	* @param {BuiltWindowCommand[]} rows Rows being built.
	* @param {Set<string>} can Assignable logical keys.
	*/
	buildPostExtensionGroups(rows, can) {}
	/**
	* Builds a non-interactive section header.
	* @param {string} label Header label.
	* @returns {BuiltWindowCommand}
	*/
	buildHeaderCommand(label) {
		return new WindowCommandBuilder(label).setSymbol(`__header__${label}`).setExtensionData({
			kind: "header",
			label
		}).setEnabled(false).build();
	}
	/**
	* Builds a remappable JABS logical action row.
	* @param {string} button Logical action key.
	* @returns {BuiltWindowCommand}
	*/
	buildActionCommand(button) {
		return new WindowCommandBuilder(this.humanizeButton(button)).setSymbol(button).setExtensionData({
			kind: "action",
			button
		}).setEnabled(true).build();
	}
	/**
	* Builds a row backed by {@link Input} registry keys (external namespace).
	* @param {string} ns Namespace (e.g. `"J.MAP"`).
	* @param {string} key Logical key within `ns`.
	* @param {string} label Row label.
	* @param {number} [iconIndex=0] Optional fixed left icon; 0 = derive from binding.
	* @returns {BuiltWindowCommand}
	*/
	buildExternalActionCommand(ns, key, label, iconIndex) {
		return new WindowCommandBuilder(label).setSymbol(`__ext__${ns}:${key}`).setExtensionData({
			kind: "ext-action",
			ns,
			key,
			label,
			icon: Number(iconIndex) || 0
		}).setEnabled(true).build();
	}
	/**
	* @param {number} index Row index.
	*/
	drawItem(index) {
		const rect = this.itemRectWithPadding(index);
		const cmd = this._list[index];
		if (!cmd) {
			return;
		}
		if (cmd.ext && cmd.ext.kind === "header") {
			this._drawHeaderItem(rect, cmd);
			return;
		}
		if (cmd.ext && cmd.ext.kind === "ext-action") {
			this._drawExternalActionItem(rect, cmd);
			return;
		}
		this._drawJabsActionItem(rect, cmd);
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @param {{name:string, ext:object}} cmd Command data.
	*/
	_drawHeaderItem(rect, cmd) {
		const name = cmd.name || String.empty;
		this.changeTextColor(ColorManager.systemColor());
		this.contents.fontBold = true;
		this.drawText(name, rect.x, rect.y, rect.width, "center");
		this.resetTextColor();
		this.contents.fontBold = false;
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @param {{ name:string, symbol:string, ext:object }} cmd Command data.
	*/
	_drawExternalActionItem(rect, cmd) {
		const displayLabel = String(cmd.ext.label || "");
		const combined = this.getMapping();
		const token = String(cmd.symbol || "");
		const hasStaged = Object.prototype.hasOwnProperty.call(combined, token);
		const staged = hasStaged ? combined[token] : null;
		let boundList;
		if (staged !== null) {
			boundList = Array.isArray(staged) ? staged : [];
		} else {
			boundList = Input.getBindings(cmd.ext.ns, cmd.ext.key) || [];
		}
		const bound = boundList.length > 0 ? boundList[0] : String.empty;
		let leftIcon = 0;
		if (cmd.ext.icon && cmd.ext.icon > 0) {
			leftIcon = cmd.ext.icon;
		}
		this._drawActionBindingRow(rect, displayLabel, bound, leftIcon);
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @param {{symbol:string}} cmd Command data.
	*/
	_drawJabsActionItem(rect, cmd) {
		const button = String(cmd.symbol);
		const mapping = this.getMapping();
		const boundList = mapping[button] || [];
		const bound = boundList.length > 0 ? boundList[0] : String.empty;
		const label = this.humanizeButton(button);
		this._drawActionBindingRow(rect, label, bound, 0);
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @returns {number} Icon Y.
	*/
	_iconYForRect(rect) {
		const ih = ImageManager.iconHeight;
		return rect.y + Math.max(0, Math.floor((this.lineHeight() - ih) / 2));
	}
	/**
	* @param {number} leftX Left column X.
	* @param {number} iconY Icon Y.
	* @param {number} iconIndex Icon index; 0 = skip icon.
	* @param {string} label Text after optional icon.
	* @param {Rectangle} rect Row rect.
	* @param {number} midX Column split.
	*/
	_drawLeftLabelWithOptionalIcon(leftX, iconY, iconIndex, label, rect, midX) {
		let labelX = leftX;
		if (iconIndex > 0) {
			this.drawIcon(iconIndex, leftX, iconY);
			labelX += ImageManager.iconWidth + 6;
		}
		const leftW = Math.max(0, midX - rect.x);
		this.drawText(label, labelX, rect.y, leftW);
	}
	/**
	* Two-column row: optional fixed left icon, label, arrow, binding (with icon escapes).
	* @param {Rectangle} rect Row rect.
	* @param {string} label Left column label.
	* @param {string} bound Primary physical symbol for the right column.
	* @param {number} leftIconOverride Fixed left icon index; 0 = use {@link iconIndexForSymbol} on `bound`.
	*/
	_drawActionBindingRow(rect, label, bound, leftIconOverride) {
		let iconIndex = leftIconOverride;
		if (!(iconIndex > 0)) {
			iconIndex = this.iconIndexForSymbol(bound);
		}
		const iconY = this._iconYForRect(rect);
		const midX = rect.x + Math.floor(rect.width / 2);
		this._drawLeftLabelWithOptionalIcon(rect.x, iconY, iconIndex, label, rect, midX);
		this._drawArrowBetweenColumns(rect, midX);
		const rightText = IconManager.jabsIconTextForSymbol(bound);
		this._drawRightBindingText(rect, midX, rightText);
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @param {number} midX Column split.
	*/
	_drawArrowBetweenColumns(rect, midX) {
		const arrow = "→";
		this.drawText(arrow, midX - this.textWidth(arrow), rect.y, Math.floor(rect.width / 2));
	}
	/**
	* @param {Rectangle} rect Row rect.
	* @param {number} midX Column split.
	* @param {string} rightText Text for {@link Window_Base.prototype.drawTextEx}.
	*/
	_drawRightBindingText(rect, midX, rightText) {
		const rightWidth = this.textSizeEx(rightText).width;
		const rightX = midX + Math.floor(rect.width / 2) - rightWidth;
		this.drawTextEx(rightText, rightX, rect.y, Math.floor(rect.width / 2));
	}
	/**
	* Updates the linked help window from the current selection.
	*/
	updateHelp() {
		const help = this.getHelpWindow();
		if (!help) {
			return;
		}
		const button = this.currentButton();
		help.setText(this.describeButton(button));
	}
	/**
	* Blocks OK on header rows only.
	*/
	processOk() {
		const cmd = this.currentData();
		if (!cmd) {
			SoundManager.playBuzzer();
			return;
		}
		if (cmd.ext && cmd.ext.kind === "header") {
			SoundManager.playBuzzer();
			return;
		}
		super.processOk();
	}
	/**
	* First enabled command index (skips disabled headers).
	* @returns {number}
	*/
	firstActionIndex() {
		for (let i = 0; i < this._list.length; i++) {
			const cmd = this._list[i];
			if (cmd && cmd.enabled !== false) {
				return i;
			}
		}
		return 0;
	}
	/**
	* @param {string} button Logical key.
	* @returns {string}
	*/
	humanizeButton(button) {
		const { labels } = jabsRemapActionLookupMaps();
		return labels[button] || button;
	}
	/**
	* @param {string} symbol Physical symbol.
	* @returns {number} Icon index, or 0.
	*/
	iconIndexForSymbol(symbol) {
		return IconManager.jabsIconIndexForSymbol(symbol);
	}
	/**
	* Help text for a header label, logical key, or external row label.
	* @param {string} button Value from {@link currentButton}.
	* @returns {string}
	*/
	describeButton(button) {
		const header = JABS_REMAP_HEADER_HELP[button];
		if (header) {
			return header;
		}
		const { help } = jabsRemapActionLookupMaps();
		if (help[button]) {
			return help[button];
		}
		return String(button);
	}
};

//#endregion
//#region src/plugins/abs/ext/input/scenes/Scene_JabsRemap.js
/**
* The scene for remapping JABS inputs.
* Owns layout, capture flow, and applying/saving mappings.
*/
var Scene_JabsRemap = class extends Scene_MenuBase {
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Initializes this scene and members.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
	}
	/**
	* Initialize all properties required by the scene.
	*/
	initMembers() {
		this.initCoreMembers();
		this.initPrimaryMembers();
	}
	/**
	* Initializes the shared root namespace for this plugin branch.
	*/
	initCoreMembers() {
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
	initPrimaryMembers() {
		/**
		* The collection of windows owned by this scene.
		*/
		this._j._abs._input._windows = {
			_topHelp: null,
			_actions: null,
			_usageHelp: null,
			_command: null,
			_prompt: null
		};
		/**
		* The state data for this scene.
		*/
		this._j._abs._input._state = {
			_controllerIndex: 0,
			_controllers: [],
			_pendingByKey: {},
			_isCapturing: false,
			_capturingButton: null
		};
	}
	/**
	* Creates all display objects for this scene.
	*/
	create() {
		super.create();
		this.buildControllerList();
		this.createDisplayObjects();
		this.refreshAll();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
	}
	/**
	* Creates all remap-related windows.
	*/
	createAllWindows() {
		this.createTopHelpWindow();
		this.createActionsWindow();
		this.createUsageHelpWindow();
		this.createCommandWindow();
		this.createPromptWindow();
	}
	/**
	* Creates the top help window that describes the selected logical action.
	*/
	createTopHelpWindow() {
		const window = this.buildTopHelpWindow();
		this.setTopHelpWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the top help window.
	* @returns {Window_Help}
	*/
	buildTopHelpWindow() {
		const rectangle = this.topHelpWindowRectangle();
		const window = new Window_Help(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with the top help window.
	* @returns {Rectangle}
	*/
	topHelpWindowRectangle() {
		const wh = this.calcWindowHeight(1.6, true);
		const ww = Math.floor(Graphics.boxWidth * .6);
		const wx = Math.floor((Graphics.boxWidth - ww) / 2);
		const wy = 0;
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the currently tracked top help window.
	* @returns {Window_Help}
	*/
	getTopHelpWindow() {
		return this._j._abs._input._windows._topHelp;
	}
	/**
	* Set the currently tracked top help window to the given window.
	* @param {Window_Help} helpWindow The help window to track.
	*/
	setTopHelpWindow(helpWindow) {
		this._j._abs._input._windows._topHelp = helpWindow;
	}
	/**
	* Creates the actions list window (middle-left region).
	*/
	createActionsWindow() {
		const window = this.buildActionsWindow();
		this.setActionsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the actions window.
	* @returns {Window_JabsRemapActions}
	*/
	buildActionsWindow() {
		const rectangle = this.actionsWindowRectangle();
		const window = new Window_JabsRemapActions(rectangle);
		window.setHandler("ok", this.onRemapRequested.bind(this));
		window.setHandler("context", this.onClearBinding.bind(this));
		window.setHandler("cancel", this.onActionsCancel.bind(this));
		window.setHelpWindow(this.getTopHelpWindow());
		return window;
	}
	/**
	* Gets the rectangle associated with the actions window (middle-left region).
	* @returns {Rectangle}
	*/
	actionsWindowRectangle() {
		const topH = this.topHelpWindowRectangle().height;
		const cmdH = this.commandWindowRectangle().height;
		const wy = topH;
		const wh = Graphics.boxHeight - topH - cmdH;
		const groupW = Math.floor(Graphics.boxWidth * .6);
		const groupX = Math.floor((Graphics.boxWidth - groupW) / 2);
		const actionsW = Math.floor(groupW * .7);
		const wx = groupX;
		return new Rectangle(wx, wy, actionsW, wh);
	}
	/**
	* Gets the currently tracked actions window.
	* @returns {Window_JabsRemapActions}
	*/
	getActionsWindow() {
		return this._j._abs._input._windows._actions;
	}
	/**
	* Set the currently tracked actions window to the given window.
	* @param {Window_JabsRemapActions} actionsWindow The actions window to track.
	*/
	setActionsWindow(actionsWindow) {
		this._j._abs._input._windows._actions = actionsWindow;
	}
	/**
	* Creates the right-side usage/help panel that lists scene controls.
	*/
	createUsageHelpWindow() {
		const window = this.buildUsageHelpWindow();
		this.setUsageHelpWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the usage/help window.
	* @returns {Window_JabsRemapUsageHelp}
	*/
	buildUsageHelpWindow() {
		const rectangle = this.usageHelpWindowRectangle();
		const window = new Window_JabsRemapUsageHelp(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with the right-side usage/help window.
	* @returns {Rectangle}
	*/
	usageHelpWindowRectangle() {
		const topH = this.topHelpWindowRectangle().height;
		const cmdH = this.commandWindowRectangle().height;
		const wy = topH;
		const wh = Graphics.boxHeight - topH - cmdH;
		const groupW = Math.floor(Graphics.boxWidth * .6);
		const groupX = Math.floor((Graphics.boxWidth - groupW) / 2);
		const actionsW = Math.floor(groupW * .7);
		const usageW = groupW - actionsW;
		const wx = groupX + actionsW;
		return new Rectangle(wx, wy, usageW, wh);
	}
	/**
	* Gets the currently tracked usage/help window.
	* @returns {Window_JabsRemapUsageHelp}
	*/
	getUsageHelpWindow() {
		return this._j._abs._input._windows._usageHelp;
	}
	/**
	* Set the currently tracked usage/help window to the given window.
	* @param {Window_JabsRemapUsageHelp} helpWindow The usage/help window to track.
	*/
	setUsageHelpWindow(helpWindow) {
		this._j._abs._input._windows._usageHelp = helpWindow;
	}
	/**
	* Creates the bottom command window (Apply/Reset/Cancel).
	*/
	createCommandWindow() {
		const window = this.buildCommandWindow();
		this.setCommandWindow(window);
		this.addWindow(window);
		window.deselect();
		window.deactivate();
	}
	/**
	* Sets up and defines the command window.
	* @returns {Window_JabsRemapCommand}
	*/
	buildCommandWindow() {
		const rectangle = this.commandWindowRectangle();
		const window = new Window_JabsRemapCommand(rectangle);
		window.setHandler("apply", this.onApply.bind(this));
		window.setHandler("defaults", this.onDefaults.bind(this));
		window.setHandler("reset", this.onReset.bind(this));
		window.setHandler("cancel", this.popScene.bind(this));
		return window;
	}
	/**
	* Gets the rectangle associated with the command window.
	* @returns {Rectangle}
	*/
	commandWindowRectangle() {
		const wh = this.calcWindowHeight(4, true);
		const ww = Math.floor(Graphics.boxWidth * .25);
		const wx = Math.floor((Graphics.boxWidth - ww) / 2);
		const wy = Graphics.boxHeight - wh;
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the currently tracked command window.
	* @returns {Window_JabsRemapCommand}
	*/
	getCommandWindow() {
		return this._j._abs._input._windows._command;
	}
	/**
	* Set the currently tracked command window to the given window.
	* @param {Window_JabsRemapCommand} commandWindow The command window to track.
	*/
	setCommandWindow(commandWindow) {
		this._j._abs._input._windows._command = commandWindow;
	}
	/**
	* Creates the capture prompt overlay window.
	*/
	createPromptWindow() {
		const window = this.buildPromptWindow();
		this.setPromptWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the prompt overlay window.
	* @returns {Window_JabsRemapPrompt}
	*/
	buildPromptWindow() {
		const rectangle = this.promptWindowRectangle();
		const window = new Window_JabsRemapPrompt(rectangle);
		window.hide();
		return window;
	}
	/**
	* Gets the rectangle associated with the prompt overlay window.
	* @returns {Rectangle}
	*/
	promptWindowRectangle() {
		return new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
	}
	/**
	* Gets the currently tracked prompt overlay window.
	* @returns {Window_JabsRemapPrompt}
	*/
	getPromptWindow() {
		return this._j._abs._input._windows._prompt;
	}
	/**
	* Set the currently tracked prompt overlay window to the given window.
	* @param {Window_JabsRemapPrompt} promptWindow The prompt window to track.
	*/
	setPromptWindow(promptWindow) {
		this._j._abs._input._windows._prompt = promptWindow;
	}
	/**
	* Builds the controller list from the adapter and snapshots as pending.
	*/
	buildControllerList() {
		const all = JABS_InputAdapter.getAllControllers();
		const controllers = all.length > 0 ? [all[0]] : [];
		this.setControllers(controllers);
		for (let i = 0; i < controllers.length; i++) {
			const key = this.resolveControllerKey(i);
			const exportMap = controllers[i].exportAllInputs();
			const normalized = {};
			Object.keys(exportMap).forEach((k) => {
				const v = exportMap[k];
				if (Array.isArray(v)) {
					normalized[k] = v.slice(0);
				} else if (v) {
					normalized[k] = [v];
				} else {
					normalized[k] = [];
				}
			});
			this._state()._pendingByKey[key] = normalized;
		}
	}
	/**
	* Resolves the stored-key for a controller index.
	* @param {number} index The adapter index for the controller.
	* @returns {string} The key in the form of player{n}.
	*/
	resolveControllerKey(index) {
		return `player${index + 1}`;
	}
	/**
	* Refreshes all windows for the current controller.
	*/
	refreshAll() {
		const combined = this.buildDisplayMapping();
		this.getActionsWindow().setMapping(combined);
		this.getActionsWindow().activate();
		this.getCommandWindow().deactivate();
	}
	/**
	* Builds a combined display mapping for the actions window.
	* Combines the current controller’s pending JABS mapping with staged external rows.
	* External rows are keyed as tokens: "__ext__<ns>:<key>" → string[].
	* @returns {Object<string, string[]>}
	*/
	buildDisplayMapping() {
		const base = this.currentPendingMapping() || {};
		const combined = {};
		Object.keys(base).forEach((button) => {
			const list = base[button];
			combined[button] = Array.isArray(list) ? list.slice(0) : [];
		});
		const ext = this.getPendingExternal();
		const extKeys = Object.keys(ext);
		for (let i = 0; i < extKeys.length; i++) {
			const compound = extKeys[i];
			const arr = ext[compound];
			combined[`__ext__${compound}`] = Array.isArray(arr) ? arr.slice(0) : [];
		}
		return combined;
	}
	/**
	* Gets the pending mapping object for the current controller.
	* @returns {Object<string, string[]>}
	*/
	currentPendingMapping() {
		const key = this.resolveControllerKey(this._state()._controllerIndex);
		return this._state()._pendingByKey[key];
	}
	/**
	* Ensures at most one logical action holds a given symbol across the mapping.
	* The first key visited in {@link JABS_Button.assignableInputs} / {@link JABS_Button.allButtons}
	* order keeps the symbol; later duplicates are cleared.
	* @param {Object<string, string[]>} mapping The mapping to sanitize.
	*/
	sanitizeMappingUnique(mapping) {
		const ownerBySymbol = {};
		const visit = (button) => {
			const list = mapping[button] || [];
			if (list.length === 0) {
				return;
			}
			const [symbol] = list;
			if (!ownerBySymbol[symbol]) {
				ownerBySymbol[symbol] = button;
				return;
			}
			mapping[button] = [];
		};
		const seen = new Set();
		const assignable = JABS_Button.assignableInputs();
		for (let i = 0; i < assignable.length; i++) {
			const button = assignable[i];
			if (Object.prototype.hasOwnProperty.call(mapping, button)) {
				visit(button);
				seen.add(button);
			}
		}
		const all = JABS_Button.allButtons();
		for (let i = 0; i < all.length; i++) {
			const button = all[i];
			if (seen.has(button)) {
				continue;
			}
			if (Object.prototype.hasOwnProperty.call(mapping, button)) {
				visit(button);
				seen.add(button);
			}
		}
		const keys = Object.keys(mapping);
		for (let i = 0; i < keys.length; i++) {
			const button = keys[i];
			if (seen.has(button)) {
				continue;
			}
			visit(button);
		}
	}
	/**
	* Copies a controller-style mapping into {@link Input} namespace `JABS` so saves and registry UIs match gameplay.
	* @param {Object<string, string|string[]>} mapping Logical JABS keys to physical symbol(s).
	*/
	syncJabsInputRegistryFromControllerMapping(mapping) {
		const keys = Object.keys(mapping);
		for (let i = 0; i < keys.length; i++) {
			const logicalKey = keys[i];
			const raw = mapping[logicalKey];
			let arr;
			if (Array.isArray(raw)) {
				arr = raw.slice(0);
			} else if (raw) {
				arr = [raw];
			} else {
				arr = [];
			}
			Input.setBindings("JABS", logicalKey, arr);
		}
	}
	/**
	* Handler when Apply is chosen.
	*/
	onApply() {
		const controllers = this._state()._controllers;
		for (let i = 0; i < controllers.length; i++) {
			const controller = controllers[i];
			const key = this.resolveControllerKey(i);
			const mapping = this._state()._pendingByKey[key];
			this.sanitizeMappingUnique(mapping);
			controller.setAllInputs(mapping);
			$gameSystem.setJabsInputConfig(key, mapping);
			this.syncJabsInputRegistryFromControllerMapping(mapping);
		}
		this.flushPendingExternalBindings();
		SceneManager.pop();
	}
	/**
	* Replaces the pending map with the controller’s defaults (preview),
	* without applying to the live controller or saving.
	*/
	onDefaults() {
		const idx = this._state()._controllerIndex;
		const key = this.resolveControllerKey(idx);
		const controller = this._state()._controllers[idx];
		const defaults = controller.buildDefaultMapping();
		this._state()._pendingByKey[key] = defaults;
		this.getActionsWindow().setMapping(this.buildDisplayMapping());
		this.onActionsCancel();
		this.getCommandWindow().deactivate();
		this.getActionsWindow().activate();
	}
	/**
	* Handler when Reset is chosen.
	*/
	onReset() {
		this.buildControllerList();
		this.refreshAll();
	}
	/**
	* Handler when the action list cancels.
	* Switch focus to the bottom command strip.
	*/
	onActionsCancel() {
		this.getActionsWindow().deactivate();
		this.getCommandWindow().select(0);
		this.getCommandWindow().activate();
	}
	/**
	* Begins a capture for the currently selected logical action.
	*/
	onRemapRequested() {
		const cmd = this.getActionsWindow().currentData();
		if (cmd && cmd.ext && cmd.ext.kind === "ext-action") {
			const token = `__ext__${cmd.ext.ns}:${cmd.ext.key}`;
			this._state()._capturingButton = token;
			this._state()._isCapturing = true;
			this.getPromptWindow().startPrompt(String(cmd.ext.label || String.empty));
			this.getCommandWindow().deactivate();
			this.getActionsWindow().deactivate();
			return;
		}
		const button = this.getActionsWindow().currentButton();
		this.beginCapture(button);
	}
	/**
	* Clears the binding for the selected logical action.
	*/
	onClearBinding() {
		const cmd = this.getActionsWindow().currentData();
		if (cmd && cmd.ext && cmd.ext.kind === "ext-action") {
			this.setPendingExternalBinding(cmd.ext.ns, cmd.ext.key, []);
			this.getActionsWindow().setMapping(this.buildDisplayMapping());
			return;
		}
		const button = this.getActionsWindow().currentButton();
		const pending = this.currentPendingMapping();
		pending[button] = [];
		this.getActionsWindow().setMapping(this.buildDisplayMapping());
	}
	/**
	* Begins the capture overlay for a logical action.
	* @param {string} button The logical action to capture for.
	*/
	beginCapture(button) {
		this._state()._capturingButton = button;
		this._state()._isCapturing = true;
		const promptLabel = this.getActionsWindow().humanizeButton(button);
		this.getPromptWindow().startPrompt(promptLabel);
		this.getCommandWindow().deactivate();
		this.getActionsWindow().deactivate();
	}
	/**
	* Ends the capture overlay.
	*/
	endCapture() {
		this._state()._isCapturing = false;
		this._state()._capturingButton = null;
		this.getPromptWindow().endPrompt();
		this.getActionsWindow().activate();
	}
	/**
	* Removes a symbol from all actions in the provided mapping, except for one.
	* @param {Object<string, string[]>} mapping The mapping to sanitize.
	* @param {string} symbol The physical input symbol to remove.
	* @param {string} exceptButton The logical action to exclude from removal.
	*/
	unbindSymbolFromMapping(mapping, symbol, exceptButton) {
		Object.keys(mapping).forEach((key) => {
			if (key === exceptButton) return;
			const list = mapping[key] || [];
			if (!list.length) return;
			const filtered = list.filter((s) => s !== symbol);
			if (filtered.length !== list.length) {
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
	assignWithConflictResolution(button, symbol) {
		if (typeof button === "string" && button.indexOf("__ext__") === 0) {
			const without = button.substring("__ext__".length);
			const splitAt = without.indexOf(":");
			if (splitAt > 0) {
				const ns = without.substring(0, splitAt);
				const key = without.substring(splitAt + 1);
				this.setPendingExternalBinding(ns, key, [symbol]);
				this.getActionsWindow().setMapping(this.buildDisplayMapping());
				return;
			}
		}
		const pending = this.currentPendingMapping();
		this.unbindSymbolFromMapping(pending, symbol, button);
		pending[button] = [symbol];
		this.getActionsWindow().setMapping(this.buildDisplayMapping());
	}
	/**
	* Gets (and initializes) the pending external bindings map for this scene.
	* Map shape: { 'ns:key': string[] }
	* @returns {Object<string, string[]>}
	*/
	getPendingExternal() {
		const state = this._state();
		state._pendingExternal ||= {};
		return state._pendingExternal;
	}
	/**
	* Reads a staged binding array for an external action if present; otherwise null.
	* @param {string} ns The namespace, such as 'J.MAP'.
	* @param {string} key The logical key within that namespace.
	* @returns {string[]|null}
	*/
	getPendingExternalBinding(ns, key) {
		const compound = `${ns}:${key}`;
		const map = this.getPendingExternal();
		return Object.prototype.hasOwnProperty.call(map, compound) ? map[compound] : null;
	}
	/**
	* Stages a binding array for an external logical action.
	* @param {string} ns The namespace, such as 'J.MAP'.
	* @param {string} key The logical key within that namespace.
	* @param {string[]} physical The array of physical symbols to stage.
	*/
	setPendingExternalBinding(ns, key, physical) {
		const compound = `${ns}:${key}`;
		this.getPendingExternal()[compound] = Array.isArray(physical) ? physical.slice(0) : [];
	}
	/**
	* Writes all staged external bindings into the live Input registry and clears the stage.
	*/
	flushPendingExternalBindings() {
		const map = this.getPendingExternal();
		Object.keys(map).forEach((compound) => {
			const splitAt = compound.indexOf(":");
			if (splitAt <= 0) {
				return;
			}
			const ns = compound.substring(0, splitAt);
			const key = compound.substring(splitAt + 1);
			const physical = map[compound] || [];
			Input.setBindings(ns, key, physical);
		});
		$gameSystem.saveAllInputBindingsFromInput();
		this._state()._pendingExternal = {};
		this.getActionsWindow().setMapping(this.buildDisplayMapping());
	}
	/**
	* Standard per-frame update.
	*/
	update() {
		super.update();
		if (this._state()._isCapturing === false) {
			return;
		}
		const captured = this.getPromptWindow().pollCapturedSymbol();
		if (!captured) {
			if (this.getPromptWindow().isActive() === false) {
				this.endCapture();
			}
			return;
		}
		this.assignWithConflictResolution(this._state()._capturingButton, captured);
		this.endCapture();
	}
	/**
	* Convenience accessor for the scene state object.
	*/
	_state() {
		return this._j._abs._input._state;
	}
	/**
	* Sets the controller collection being edited.
	* @param {Object[]} controllers The list of controllers.
	*/
	setControllers(controllers) {
		this._state()._controllers = controllers;
	}
};

//#endregion
//#region src/plugins/abs/ext/input/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.<br/>
* Also wires the handler for opening the JABS input remapping scene.
*/
J.ABS.EXT.INPUT.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.ABS.EXT.INPUT.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this._commandWindow.setHandler("jabsRemap", () => {
		SceneManager.push(Scene_JabsRemap);
	});
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.<br/>
* Also adds a command to open the JABS input remapping scene from the main menu.
*/
J.ABS.EXT.INPUT.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.ABS.EXT.INPUT.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	if (this.canAddJabsRemapCommand() === false) return;
	this.addJabsRemapCommand();
};
/**
* Adds the JABS Controls command to the main menu.
*/
Window_MenuCommand.prototype.addJabsRemapCommand = function() {
	const command = new WindowCommandBuilder("JABS Controls").setSymbol("jabsRemap").setIconIndex(2569).setEnabled(true).build();
	const lastCommand = this._list.at(-1);
	if (lastCommand.symbol === "gameEnd") {
		this._list.splice(this._list.length - 2, 0, command);
	} else {
		this.addBuiltCommand(command);
	}
};
/**
* Determines whether or not the JABS Controls command can be added to the main menu.
* @returns {boolean} True if the command should be added, false otherwise.
*/
Window_MenuCommand.prototype.canAddJabsRemapCommand = function() {
	if (!J.ABS) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/input/windows/Window_Selectable.js
/**
* Extends {@link #processCursorMove}.<br/>
* Also recognizes custom D-Pad symbols for menu navigation.
*/
J.ABS.EXT.INPUT.Aliased.Window_Selectable.set("processCursorMove", Window_Selectable.prototype.processCursorMove);
Window_Selectable.prototype.processCursorMove = function() {
	const lastIndex = this.index();
	J.ABS.EXT.INPUT.Aliased.Window_Selectable.get("processCursorMove").call(this);
	if (this.index() !== lastIndex) {
		return;
	}
	if (this.isCursorMovable() === false) {
		return;
	}
	const repDown = Input.isRepeated(J.ABS.EXT.INPUT.Symbols.DPadDown);
	const repUp = Input.isRepeated(J.ABS.EXT.INPUT.Symbols.DPadUp);
	const repRight = Input.isRepeated(J.ABS.EXT.INPUT.Symbols.DPadRight);
	const repLeft = Input.isRepeated(J.ABS.EXT.INPUT.Symbols.DPadLeft);
	if (repDown === false && repUp === false && repRight === false && repLeft === false) {
		return;
	}
	const trgDown = Input.isTriggered(J.ABS.EXT.INPUT.Symbols.DPadDown);
	const trgUp = Input.isTriggered(J.ABS.EXT.INPUT.Symbols.DPadUp);
	const trgRight = Input.isTriggered(J.ABS.EXT.INPUT.Symbols.DPadRight);
	const trgLeft = Input.isTriggered(J.ABS.EXT.INPUT.Symbols.DPadLeft);
	if (repDown) {
		this.cursorDown(trgDown);
	} else if (repUp) {
		this.cursorUp(trgUp);
	} else if (repRight) {
		this.cursorRight(trgRight);
	} else if (repLeft) {
		this.cursorLeft(trgLeft);
	}
	if (this.index() !== lastIndex) {
		SoundManager.playCursor();
	}
};

//#endregion
//# sourceMappingURL=J-ABS-InputManager.js.map