//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.3 TOOLS] Enable new tool-like tags for use with skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables new tags that give tool-like functionality to skills.
 *
 * Enables:
 * - NEW! added "gap close" aka "hookshot" functionality.
 *
 * TODO:
 * - gloves for carrying events.
 *
 * This plugin requires JABS.
 * ============================================================================
 * GAP CLOSING:
 * Have you ever wanted to be able to use a skill and gap close to a target
 * without having to take the painstaking effort of manually moving to the
 * given target? Well now you can! By applying the appropriate tags to various
 * database locations, you can enable/disable gap closing for your battlers!
 *
 * HEADS UP:
 * There are a number of tags required to make this work, so this will deviate
 * from normal tag explanations a bit.
 *
 * TAG USAGE:
 * (primarily)
 * - Events
 * - Skills
 * - Enemies
 *
 * (secondarily)
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <gapClose>
 * This tag is required on skills that you want to be "gap closing skills".
 *
 *  <gapCloseTarget>
 * This tag is required on the things you want to be "gap closable", such as
 * enemies or on events representing enemies. This tag can also be applied to
 * things that a battler can be affected by, such as equipment or states.
 *
 * GAP CLOSE TARGET vs PLUGIN PARAMETER "Gap Close Default":
 * The <gapCloseTarget> tag is not required if you enable flip the plugin
 * parameter of "Gap Close Default" to true. Anything you hit while that is
 * true will result in gap closing if the skill permits.
 *
 * EXAMPLE:
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on enemy ID 33.
 * Using skill 25 against enemy 33 will pull the player to the enemy.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on state ID 4.
 * An enemy afflicts the player/battler with state 4.
 * If the enemy then used skill 25 against the player with the state, they
 * would be pulled to the player.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on some event that is an inanimate battler.
 * Using skill 25 against the event will pull the player to the event.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.1
 *    Consumed `RPGManager` update.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param canGapCloseByDefault
 * @type boolean
 * @text Gap Close Default
 * @desc True if you can gap close to anything hittable, false if only specific targets.
 * @default false
 *
 * @param grabThrowConfigs
 * @text GRAB AND THROW DEFAULTS
 *
 * @param grabThrowEnabled
 * @parent grabThrowConfigs
 * @type boolean
 * @text Grab and Throw Enabled
 * @desc True if grab and throw functionality is enabled globally by default.
 * @default true
 *
 * @param directionFixAlways
 * @parent grabThrowConfigs
 * @type boolean
 * @text Always Fix Throw Direction
 * @desc True if the throw direction is always fixed regardless of input.
 * @default false
 *
 */

//#region src/plugins/abs/ext/tools/_metadata/_pluginMetadata.js
var J_ToolsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps gap-close and grab/throw defaults from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The behavior for whether or not the player can gap close to anything they hit, or if they
		* can only gap close to targets bearing the "gap close target" tag.
		*/
		this.CanGapCloseByDefault = this.parsedPluginParameters["canGapCloseByDefault"] === "true";
		/**
		* Whether or not grab and throw functionality is enabled globally by default.
		* @type {boolean}
		*/
		this.GrabThrowEnabled = this.parsedPluginParameters["grabThrowEnabled"] !== "false";
		/**
		* Whether or not the throw direction is always fixed regardless of input.
		* @type {boolean}
		*/
		this.DirectionFixAlways = this.parsedPluginParameters["directionFixAlways"] === "true";
	}
};

//#endregion
//#region src/plugins/abs/ext/tools/_metadata/initialization.js
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
J.ABS.EXT.TOOLS = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TOOLS.Metadata = new J_ToolsPluginMetadata("J-ABS-Tools", "1.0.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.TOOLS.Aliased = {
	Game_Character: new Map(),
	Game_CharacterBase: new Map(),
	Game_Event: new Map(),
	Game_Follower: new Map(),
	Game_Player: new Map(),
	Game_System: new Map(),
	JABS_Engine: new Map(),
	JABS_Battler: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.TOOLS.RegExp = {
	GapClose: /<gapClose>/i,
	GapCloseTarget: /<gapCloseTarget>/i,
	GapCloseMode: /<gapCloseMode:(blink|jump|travel)>/i,
	GapClosePosition: /<gapClosePosition:(infront|behind|same)>/i,
	BlockGapClose: /<blockGapClose>/i
};
/**
* All types of gap close modes that are available to pick from.
* The mode is the means of which the battler will travel the to the destination.
* All modes bypass terrain.
* If they should not bypass terrain, consider eventing instead.
*/
J.ABS.EXT.TOOLS.GapCloseModes = {
	/**
	* Blinks instantly to the target.
	*/
	Blink: "blink",
	/**
	* Jumps to the target.
	*/
	Jump: "jump",
	/**
	* Using pathing, will attempt to walk to the destination.
	* While traveling, "through" will be enabled.
	*/
	Travel: "travel"
};
/**
* All types of gap close positions that are available to pick from.
* The position is ultimately the destination, defined as where the battler
* should end up when they are done gap closing.
*/
J.ABS.EXT.TOOLS.GapClosePositions = {
	/**
	* Infront translates to being on the same side of the target as the gap-closing
	* battler was when they started the gap closing process, and does not consider the
	* facing of the target battler considering that can change wildly.
	*/
	Infront: "infront",
	/**
	* Behind translates to being on the opposite side of the target as the gap-closing
	* battler was when they started the gap closing process, and does not consider the
	* facing of the target battler considering that can change wildly.
	*/
	Behind: "behind",
	/**
	* Same translates to arriving at the same coordinates as the target is, meaning the
	* gap-closing battler will be ontop of the target.
	*/
	Same: "same"
};

//#endregion
//#region src/plugins/abs/ext/tools/_models/JABS_Battler.js
/**
* Initializes the properties of this battler that are not related to anything in particular.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set("initGeneralInfo", JABS_Battler.prototype.initGeneralInfo);
JABS_Battler.prototype.initGeneralInfo = function() {
	J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get("initGeneralInfo").call(this);
	/**
	* The counter for how long this battler is waiting.
	* @type {boolean}
	*/
	this._gapClosing = false;
	/**
	* The destination coordinates of where this battler is gap closing to.
	* @type {[number, number]}
	*/
	this._gapCloseDestination = [0, 0];
};
/**
* Begins the process of gap closing.
*/
JABS_Battler.prototype.beginGapClosing = function() {
	this._gapClosing = true;
};
/**
* Ends the process of gap closing.
*/
JABS_Battler.prototype.endGapClosing = function() {
	this._gapClosing = false;
};
/**
* Gets whether or not this battler is currently gap closing.
* @returns {boolean}
*/
JABS_Battler.prototype.isGapClosing = function() {
	return this._gapClosing;
};
/**
* Gets the destination coordinates of where this battler is gap closing to.
* @returns {[number,number]}
*/
JABS_Battler.prototype.gapCloseDestination = function() {
	return this._gapCloseDestination;
};
/**
* Sets the destination coordinates for this battler's gap close.
* @param {[number, number]} destination The destination x:y coordinates.
*/
JABS_Battler.prototype.setGapCloseDestination = function(destination) {
	this._gapCloseDestination = destination;
};
/**
* Determines whether or not we have a valid gap close destination.
* @returns {boolean} True if we have a valid destination, false otherwise.
*/
JABS_Battler.prototype.hasGapCloseDestination = function() {
	const [goalX, goalY] = this.gapCloseDestination();
	if (goalX === 0 && goalY === 0) return false;
	return true;
};
/**
* Clears the destination coordinates for gap closing.
*/
JABS_Battler.prototype.clearGapCloseDestination = function() {
	this._gapCloseDestination = [0, 0];
};
/**
* Extends {@link JABS_Battler.update}.<br/>
* Also updates the gap closing process.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get("update").call(this);
	this.updateGapClosing();
};
/**
* The update flow for managing gap closing.
*/
JABS_Battler.prototype.updateGapClosing = function() {
	if (this.isGapClosing()) {
		if (this.hasGapCloseDestination()) {
			if (this.hasReachedGapCloseDestination()) {
				this.clearGapCloseDestination();
				this.endGapClosing();
			}
		} else {
			this.clearGapCloseDestination();
			this.endGapClosing();
		}
	}
};
/**
* Determines whether or not this battler can be gap closed to.
* @returns {boolean} True if the battler can be gap closed to, false otherwise.
*/
JABS_Battler.prototype.isGapClosable = function() {
	const battler = this.getBattler();
	const battlerGapClosable = battler.isGapClosable();
	let characterGapClosable = false;
	if (this.isEvent()) {
		const character = this.getCharacter();
		characterGapClosable = character.isGapClosable();
	}
	if (battlerGapClosable || characterGapClosable) return true;
	return false;
};
/**
* Executes a gap close to the target based on the provided action.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
JABS_Battler.prototype.gapCloseToTarget = function(action, target) {
	if (this.isGapClosing()) return;
	this.beginGapClosing();
	this.setGapCloseDestination([target.getX(), target.getY()]);
	let { jabsGapCloseMode, jabsGapClosePosition } = action.getBaseSkill();
	jabsGapClosePosition ??= J.ABS.EXT.TOOLS.GapClosePositions.Same;
	const [x, y] = this.determineGapCloseCoordinates(target, jabsGapClosePosition);
	jabsGapCloseMode ??= J.ABS.EXT.TOOLS.GapCloseModes.Jump;
	const casterCharacter = this.getCharacter();
	switch (jabsGapCloseMode) {
		case J.ABS.EXT.TOOLS.GapCloseModes.Jump:
			casterCharacter.jump(x, y);
			break;
		case J.ABS.EXT.TOOLS.GapCloseModes.Blink:
			casterCharacter.locate(target.getX(), target.getY());
			break;
		case J.ABS.EXT.TOOLS.GapCloseModes.Travel:
			casterCharacter.jump(x, y);
			break;
	}
};
/**
* Determines where the precise coordinates are that we're attempting to gap close to.
* Note that this doesn't return the x:y of the target, it returns the delta so that
* @param {JABS_Battler} target The target having the action applied against.
* @param {J.ABS.EXT.TOOLS.GapCloseModes} position The position post-gap-closing.
* @returns {[x: number, y: number]}
*/
JABS_Battler.prototype.determineGapCloseCoordinates = function(target, position) {
	const targetCharacter = target.getCharacter();
	const [x, y] = [this.getX(), this.getY()];
	const goalX = targetCharacter.deltaXFrom(x);
	const goalY = targetCharacter.deltaYFrom(y);
	if (position === J.ABS.EXT.TOOLS.GapClosePositions.Behind) {
		return [goalX, goalY];
	}
	if (position === J.ABS.EXT.TOOLS.GapClosePositions.Infront) {
		return [goalX, goalY];
	}
	return [goalX, goalY];
};
/**
* Determines if this battler has reached its gap close destination coordinates yet.
* @returns {boolean} True if it has reached the destination, false otherwise.
*/
JABS_Battler.prototype.hasReachedGapCloseDestination = function() {
	if (!this.hasGapCloseDestination()) {
		this.endGapClosing();
		return true;
	}
	const [goalX, goalY] = this.gapCloseDestination();
	const [actualX, actualY] = [this.getX(), this.getY()];
	const fuzzy = JABS_Battler.gapCloseWiggleRoom();
	const xOk = actualX >= goalX - fuzzy && actualX <= goalX + fuzzy;
	const yOk = actualY >= goalY - fuzzy && actualY <= goalY + fuzzy;
	const doneMoving = !this.getCharacter().isMoving();
	if (xOk && yOk && doneMoving) return true;
	return false;
};
/**
* A static value representing some degree of variance allowed for gap closing
* to a target destination.
* @returns {number} The amount of x:y coordinate wiggle room to identify as "close enough".
*/
JABS_Battler.gapCloseWiggleRoom = function() {
	return .5;
};

//#endregion
//#region src/plugins/abs/ext/tools/database/RPG_Skill.js
/**
* Whether or not this skill is designed to gap close.
* Gap-closing will pull the player to wherever the skill connected.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapClose", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapClose);
} });
/**
* The type of gap close mode this skill uses.
* If there is no gap close mode available, then it'll be null instead.
* @type {J.ABS.EXT.TOOLS.GapCloseModes|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapCloseMode", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapCloseMode, true);
} });
/**
* The type of gap close position this skill uses.
* If there is no gap close position available, then it'll be null instead.
* @type {J.ABS.EXT.TOOLS.GapClosePositions|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapClosePosition", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapClosePosition, true);
} });

//#endregion
//#region src/plugins/abs/ext/tools/managers/JABS_Engine.js
/**
* Processes the various on-hit effects against the target.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Engine.set("processOnHitEffects", JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target) {
	J.ABS.EXT.TOOLS.Aliased.JABS_Engine.get("processOnHitEffects").call(this, action, target);
	this.handleGapClose(action, target);
};
JABS_Engine.prototype.handleGapClose = function(action, target) {
	if (!this.canGapClose(action, target)) return;
	const caster = action.getCaster();
	caster.gapCloseToTarget(action, target);
};
/**
* Determine whether or not the target can be gap closed to.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
* @returns {boolean} True if the target can be gap closed to, false otherwise.
*/
JABS_Engine.prototype.canGapClose = function(action, target) {
	const skill = action.getBaseSkill();
	if (!skill.jabsGapClose) return false;
	if (J.ABS.EXT.TOOLS.Metadata.CanGapCloseByDefault) return true;
	if (!target.isGapClosable(action, target)) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_Battler.js
/**
* Determines whether or not this battler is a gap close target.
* @returns {boolean} True if this battler is a gap close target, false otherwise.
*/
Game_Battler.prototype.isGapClosable = function() {
	return RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.ABS.EXT.TOOLS.RegExp.GapCloseTarget);
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase.initMembers}.<br/>
* Also initializes our new members.
*/
J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.set("initMembers", Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function() {
	J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.get("initMembers").call(this);
	this.initToolsMembers();
};
Game_CharacterBase.prototype.initToolsMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the tools extension.
	*/
	this._j._tools ||= {};
	/**
	* A grouping of all properties associated with the grab and throw tool functionality.
	*/
	this._j._tools._grabThrow ||= {};
	this._j._tools._grabThrow._grab ||= {};
	this._j._tools._grabThrow._grab._enabled = false;
	this._j._tools._grabThrow._grab._wait = new JABS_Timer(0);
	this._j._tools._grabThrow._grab._check = false;
	this._j._tools._grabThrow._throw ||= {};
	this._j._tools._grabThrow._throw._enabled = false;
	this._j._tools._grabThrow._throw._through = false;
	this._j._tools._grabThrow._throw._directionFixAlways = J.ABS.EXT.TOOLS.Metadata.DirectionFixAlways;
	this._j._tools._grabThrow._throw._directionFix = false;
	this._j._tools._grabThrow._throw._range = 0;
	this._j._tools._grabThrow._throw._wait = new JABS_Timer(0);
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_Event.js
/**
* Determines whether or not this event has any gap close target overrides.
* @returns {boolean} True if this event has a gap close override, false otherwise.
*/
Game_Event.prototype.isGapClosable = function() {
	let gapCloseTarget = false;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		if (J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.test(comment)) {
			gapCloseTarget = true;
		}
	});
	return gapCloseTarget;
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_System.js
/**
* Extends {@link Game_System.initMembers}.<br/>
* Also initializes our new members.
*/
J.ABS.EXT.TOOLS.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.ABS.EXT.TOOLS.Aliased.Game_System.get("initMembers").call(this);
	this.initToolsMembers();
};
Game_System.prototype.initToolsMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the tools extension.
	*/
	this._j._tools ||= {};
	/**
	* Whether or not the grab and throw functionality is currently enabled.
	* @type {boolean}
	*/
	this._j._tools._grabThrowEnabled = J.ABS.EXT.TOOLS.Metadata.GrabThrowEnabled;
};
/**
* Gets whether or not grab and throw functionality is enabled.
* @returns {boolean}
*/
Game_System.prototype.isGrabThrowEnabled = function() {
	return this._j._tools._grabThrowEnabled;
};
/**
* Sets whether or not grab and throw functionality is enabled.
* @param {boolean} isEnabled The is enabled driving this step.
*/
Game_System.prototype.setGrabThrowEnabled = function(isEnabled) {
	this._j._tools._grabThrowEnabled = isEnabled;
};
/**
* Toggles whether or not grab and throw functionality is enabled.
*/
Game_System.prototype.toggleGrabThrowEnabled = function() {
	this._j._tools._grabThrowEnabled = !this.isGrabThrowEnabled();
};

//#endregion
//# sourceMappingURL=J-ABS-Tools.js.map