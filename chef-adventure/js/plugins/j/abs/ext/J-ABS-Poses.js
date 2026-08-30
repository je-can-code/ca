//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.7 ABS-POSES] Enable action poses for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables "action poses", or "character sprite animations" within
 * the JABS engine.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; allies and enemies will perform animations for various actions.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A new functionality for "action poses" or "character sprite animations" is
 * now available by adding a variety of tags across the database. Mind you,
 * this will not animate your character sprites for you, under the hood it will
 * just swap out the regular character sprite defined in the database with
 * another for a given duration, and cycle through the stepping animation.
 *
 * ============================================================================
 * ACTION POSES:
 * Ever want to have your characters visually perform actions on the map when
 * doing things like attacking or casting a spell? Well now you can! By
 * applying the appropriate tags across the various database locations, you too
 * can have pseudo-animated character sprites when taking action!
 *
 * TAG USAGE:
 * - Skills
 * - Items
 *
 * TAG FORMAT:
 *    <poseSuffix:[SUFFIX,INDEX,DURATION]>
 *  Where SUFFIX is the suffix of the filename you want to swap out for.
 *  Where INDEX is the index in the character file to become.
 *  Where DURATION is the amount of frames to remain in this pose.
 *
 * TAG EXAMPLES:
 *    <poseSuffix:[-spell,0,25]>
 * As an example, if the character using the skill was a player with a
 * character sprite named "Actor1", the above tag would look for "Actor1-spell"
 * and swap to the 0th index (the upper left-most character) for 25 frames
 * (which is about a half second).
 *
 * WARNING:
 * This is not a highly tested feature of JABS and may not work as intended.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.7
 *    Removed the commented-out warnings for a missing pose sheet, and said in a
 *    comment why the branch stays silent: it runs on every execution of the
 *    skill, so a report would repeat for as long as the asset is absent.
 * - 1.0.6
 *    Fixed a skill with no pose building a sprite name ending in undefined; the
 *    absent tag answered an empty array, which is truthy.
 * - 1.0.5
 *    startGuarding no longer takes a skillSlot param, matching J-ABS core;
 *    the guard pose now resolves via getGuardSkillId() instead.
 *    Moved gameAssetExists from its own file into initialization.js.
 *    Removed leftover unused scaffold plugin params.
 * - 1.0.4
 *    `JABS_Battler` pose hooks aligned with J-ABS 4.10.0 dodge/guard battler updates.
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.1
 *    Consumed `RPGManager` update.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region \0rolldown/runtime.js
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});

//#endregion
//#region src/plugins/abs/ext/poses/_metadata/_pluginMetadata.js
var J_PosesPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
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
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
	}
};

//#endregion
//#region src/plugins/abs/ext/poses/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**

* The plugin umbrella that governs all things related to this plugin.

*/
J.ABS.EXT.POSES = {};
/**

* The plugin umbrella that governs all extensions related to the parent.

*/
J.ABS.EXT.POSES.EXT ||= {};
/**

* The metadata associated with this plugin.

*/
J.ABS.EXT.POSES.Metadata = new J_PosesPluginMetadata("J-ABS-Poses", "1.0.7");
/**

* A collection of all aliased methods for this plugin.

*/
J.ABS.EXT.POSES.Aliased = {};
J.ABS.EXT.POSES.Aliased.JABS_Battler = new Map();
J.ABS.EXT.POSES.Aliased.JABS_Engine = new Map();
/**

* All regular expressions used by this plugin.

*/
J.ABS.EXT.POSES.RegExp = {};
J.ABS.EXT.POSES.RegExp.PoseSuffix = /<poseSuffix:[ ]?(\[[-_]?\w+,[ ]?\d+,[ ]?\d+])>/gi;
/**

* Helpers that are only used by this extension (kept out of J-Base on purpose).

*/
J.ABS.EXT.POSES.Helpers = {};
/**
* Whether a project-relative file exists under the game folder (desktop / NW.js).
*
* RMMZ's {@link StorageManager.localFileExists} only checks save slots (`save/name.rmmzsave`),
* not arbitrary assets like `img/characters/...`. Engine {@link StorageManager} fs helpers
* are save-oriented too. Poses is the sole consumer, so the check lives here — not in J-Base —
* so the J-Base Vite ship does not bundle Node `fs` / Rolldown's `__commonJSMin` runtime.
*
* Incompatible with web-deployed builds (no local filesystem layout).
*
* @param {string} projectRelativePath Path from the game project root, e.g. `img/characters/Actor1.png`.
* @returns {boolean} True when the file is present on disk.
*/
J.ABS.EXT.POSES.Helpers.gameAssetExists = function(projectRelativePath) {
	const path = __require("path");
	const fs = __require("fs");
	const gameRoot = path.dirname(process.mainModule.filename);
	const absolutePath = path.join(gameRoot, projectRelativePath);
	return fs.existsSync(absolutePath);
};

//#endregion
//#region src/plugins/abs/ext/poses/database/RPG_Skill.js
/**
* Gets the JABS pose suffix data for this skill.
*
* The zeroth index is the string suffix itself (no quotes needed).
* The first index is the index on the suffixed character sheet.
* The second index is the number of frames to spend in this pose.
* @type {[string, number, number]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsPoseData", { get: function() {
	return RPGManager.getArrayFromNotesByRegex(this, J.ABS.EXT.POSES.RegExp.PoseSuffix, true);
} });
/**
* Gets the JABS pose suffix for this skill.
* @type {string}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsPoseSuffix", { get: function() {
	return this.jabsPoseData[0];
} });
/**
* Gets the JABS pose index for this skill.
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsPoseIndex", { get: function() {
	return this.jabsPoseData[1];
} });
/**
* Gets the JABS pose duration for this skill.
* @type {number}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsPoseDuration", { get: function() {
	return this.jabsPoseData[2];
} });

//#endregion
//#region src/plugins/abs/ext/poses/managers/JABS_Engine.js
/**
* Handles the pose functionality behind this action.
* @param {JABS_Battler} caster The `JABS_Battler` executing the JABS action.
* @param {JABS_Action} action The JABS action to execute.
*/
JABS_Engine.prototype.handleActionPose = function(caster, action) {
	caster.performActionPose(action.getBaseSkill());
};
J.ABS.EXT.POSES.Aliased.JABS_Engine.set("executeMapAction", JABS_Engine.prototype.executeMapAction);
/**
* Executes the provided JABS action.
* It generates a copy of an event from the "ActionMap" and fires it off
* based on it's move route.
* @param {JABS_Battler} caster The `JABS_Battler` executing the JABS action.
* @param {JABS_Action} action The JABS action to execute.
* @param {number?} targetX The target's `x` coordinate, if applicable.
* @param {number?} targetY The target's `y` coordinate, if applicable.
*/
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY) {
	J.ABS.EXT.POSES.Aliased.JABS_Engine.get("executeMapAction").call(this, caster, action, targetX, targetY);
	this.handleActionPose(caster, action);
};

//#endregion
//#region src/plugins/abs/ext/poses/objects/JABS_Battler.js
J.ABS.EXT.POSES.Aliased.JABS_Battler.set("initialize", JABS_Battler.prototype.initialize);
/**
* Extends {@link #initialize}.<br/>
* Also intializes the pose information.
* @param {Game_Event} event The event the battler is bound to.
* @param {Game_Actor|Game_Enemy} battler The battler data itself.
* @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
*/
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData) {
	J.ABS.EXT.POSES.Aliased.JABS_Battler.get("initialize").call(this, event, battler, battlerCoreData);
	this.initPoseInfo();
};
/**
* Initializes the properties of this battler that are related to the character posing.
*/
JABS_Battler.prototype.initPoseInfo = function() {
	/**
	* The number of frames to pose for.
	* @type {number}
	*/
	this._poseFrames = 0;
	/**
	* Whether or not this battler is currently posing.
	* @type {boolean}
	*/
	this._posing = false;
	/**
	* The name of the file that contains this battler's character sprite (without extension).
	* @type {string}
	*/
	this._baseSpriteImage = String.empty;
	/**
	* The index of this battler's character sprite in the `_baseSpriteImage`.
	* @type {number}
	*/
	this._baseSpriteIndex = 0;
	this.captureBaseSpriteInfo();
};
/**
* Gets the current number of remaining frames left to be posing.
*/
JABS_Battler.prototype.getPoseFrames = function() {
	return this._poseFrames;
};
/**
* Checks whether or not this battler has active pose frames remaining.
* @returns {boolean}
*/
JABS_Battler.prototype.hasPoseFrames = function() {
	return this._poseFrames > 0;
};
/**
* Sets the current number of posing frames to the given amount.<br>
* Also returns this amount.
* @param {number} poseFrames The number of frames to pose for.
*/
JABS_Battler.prototype.setPoseFrames = function(poseFrames) {
	this._poseFrames = poseFrames;
	return this._poseFrames;
};
/**
* Adds the given amount of frames to the current number of pose frames.<br>
* Use negative numbers to reduce the frame count by a given amount.
* @param {number} modPoseFrames The number of frames to modify this amount by.
*/
JABS_Battler.prototype.modPoseFrames = function(modPoseFrames) {
	this._poseFrames += modPoseFrames;
	return this._poseFrames;
};
/**
* Gets the original character sprite's image name.
*/
JABS_Battler.prototype.getBaseSpriteImage = function() {
	return this._baseSpriteImage;
};
/**
* Sets the name of this battler's original character sprite.
* @param {string} name The name to set.
*/
JABS_Battler.prototype.setBaseSpriteImage = function(name) {
	this._baseSpriteImage = name;
};
/**
* Gets this battler's original character sprite index.
*/
JABS_Battler.prototype.getBaseSpriteIndex = function() {
	return this._baseSpriteIndex;
};
/**
* Sets the index of this battler's original character sprite.
* @param {number} index The index to set.
*/
JABS_Battler.prototype.setBaseSpriteIndex = function(index) {
	this._baseSpriteIndex = index;
};
/**
* Gets whether or not this battler is currently posing.
* @returns {boolean}
*/
JABS_Battler.prototype.isPosing = function() {
	return this._posing;
};
/**
* Flags the battler to start posing.
*/
JABS_Battler.prototype.startPosing = function() {
	this.setPosing(true);
};
/**
* Ends the battler's posing status.
*/
JABS_Battler.prototype.endPosing = function() {
	this.setPosing(false);
};
/**
* Initializes the sprite info for this battler.
*/
JABS_Battler.prototype.captureBaseSpriteInfo = function() {
	this.setBaseSpriteImage(this.getCharacterSpriteName());
	this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};
/**
* Gets the name of this battler's current character sprite.
* @returns {string}
*/
JABS_Battler.prototype.getCharacterSpriteName = function() {
	return this.getCharacter()._characterName;
};
/**
* Gets the index of this battler's current character sprite.
* @returns {number}
*/
JABS_Battler.prototype.getCharacterSpriteIndex = function() {
	return this.getCharacter()._characterIndex;
};
/**
* Sets this battler's underlying character's pose pattern.
* @param {number} pattern The pattern to set for this character.
*/
JABS_Battler.prototype.setPosePattern = function(pattern) {
	this.getCharacter()._pattern = pattern;
};
/**
* Executes an action pose.
* Will silently fail if the asset is missing.
* @param {RPG_Skill} skill The skill to pose for.
*/
JABS_Battler.prototype.performActionPose = function(skill) {
	if (this.isPosing()) {
		this.endAnimation();
	}
	if (skill.jabsPoseData) {
		this.tryStartPose(skill);
	}
};
/**
* Executes the change of character sprite based on the action pose data
* from within a skill's notes.
* @param {RPG_Skill} skill The skill to pose for.
*/
JABS_Battler.prototype.tryStartPose = function(skill) {
	const baseSpriteName = this.getCharacterSpriteName();
	this.captureBaseSpriteInfo();
	this.setPoseDuration(skill.jabsPoseDuration);
	const newCharacterSprite = `${baseSpriteName}${skill.jabsPoseSuffix}`;
	const spritePath = `img/characters/${Utils.encodeURI(newCharacterSprite)}.png`;
	const spriteExists = J.ABS.EXT.POSES.Helpers.gameAssetExists(spritePath);
	if (spriteExists) {
		ImageManager.loadCharacter(newCharacterSprite);
		this.getCharacter().setImage(newCharacterSprite, skill.jabsPoseIndex);
	}
};
/**
* Forcefully ends the pose animation.
*/
JABS_Battler.prototype.endAnimation = function() {
	this.setPoseDuration(0);
	this.resetPose();
};
/**
* Sets the pose animation count to a given amount.
* @param {number} frames The number of frames to animate for.
*/
JABS_Battler.prototype.setPoseDuration = function(frames) {
	this.setPoseFrames(frames);
	this.normalizePosing();
};
/**
* Handles the state of posing for this battler based on the current pose frames.
*/
JABS_Battler.prototype.normalizePosing = function() {
	if (this.getPoseFrames() > 0) {
		this.startPosing();
	} else {
		this.endPosing();
		this.setPoseFrames(0);
	}
};
/**
* Resets the pose animation for this battler.
*/
JABS_Battler.prototype.resetPose = function() {
	if (!this.getBaseSpriteImage() && !this.getBaseSpriteIndex()) return;
	if (this.isPosing()) {
		this.endAnimation();
	}
	const originalImage = this.getBaseSpriteImage();
	const originalIndex = this.getBaseSpriteIndex();
	const currentImage = this.getCharacterSpriteName();
	const currentIndex = this.getCharacterSpriteIndex();
	const character = this.getCharacter();
	if (originalImage !== currentImage || originalIndex !== currentIndex) {
		character.setImage(originalImage, originalIndex);
	}
};
J.ABS.EXT.POSES.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
/**
* Things that are battler-respective and should be updated on their own.
*/
JABS_Battler.prototype.update = function() {
	J.ABS.EXT.POSES.Aliased.JABS_Battler.get("update").call(this);
	this.updatePoses();
};
/**
* Update all character sprite animations executing on this battler.
*/
JABS_Battler.prototype.updatePoses = function() {
	if (!this.canUpdatePoses()) return;
	this.countdownPoseTimer();
	this.handlePosePattern();
};
/**
* Determines whether or not this battler can update its own pose effects.
* @returns {boolean}
*/
JABS_Battler.prototype.canUpdatePoses = function() {
	if (!$jabsEngine.absEnabled) return false;
	if (!this.isPosing()) return false;
	return true;
};
/**
* Counts down the pose animation frames and manages the pose pattern.
*/
JABS_Battler.prototype.countdownPoseTimer = function() {
	if (this.guarding()) return;
	if (this.hasPoseFrames()) {
		this.modPoseFrames(-1);
	}
};
/**
* Manages whether or not this battler is posing based on pose frames.
*/
JABS_Battler.prototype.handlePosePattern = function() {
	if (this.hasPoseFrames()) {
		this.managePosePattern();
	} else {
		this.resetPose();
	}
};
/**
* Watches the current pose frames and adjusts the pose pattern accordingly.
*/
JABS_Battler.prototype.managePosePattern = function() {
	if (this.getPoseFrames() < 4) {
		this.setPosePattern(0);
	} else if (this.getPoseFrames() > 10) {
		this.setPosePattern(2);
	} else {
		this.setPosePattern(1);
	}
};
J.ABS.EXT.POSES.Aliased.JABS_Battler.set("startGuarding", JABS_Battler.prototype.startGuarding);
/**
* Extends {@link #startGuarding}.
* Executes an action pose when guarding.
*/
JABS_Battler.prototype.startGuarding = function() {
	J.ABS.EXT.POSES.Aliased.JABS_Battler.get("startGuarding").call(this);
	const skillId = this.getBattler().getGuardSkillId();
	const skill = this.getSkill(skillId);
	this.performActionPose(skill);
};
J.ABS.EXT.POSES.Aliased.JABS_Battler.set("executeDodgeSkill", JABS_Battler.prototype.executeDodgeSkill);
/**
* Executes the provided dodge skill.
* @param {RPG_Skill} skill The RPG item representing the dodge skill.
* @param {number} [forcedDirection8] Core dodge passes this for AI away-vector dodges; preserve through alias.
*/
JABS_Battler.prototype.executeDodgeSkill = function(skill, forcedDirection8) {
	J.ABS.EXT.POSES.Aliased.JABS_Battler.get("executeDodgeSkill").call(this, skill, forcedDirection8);
	this.performActionPose(skill);
};
/**
* Sets whether this battler is currently locked into a pose animation.
* @param {boolean} newPosing True while posing.
*/
JABS_Battler.prototype.setPosing = function(newPosing) {
	this._posing = newPosing;
};

//#endregion
//# sourceMappingURL=J-ABS-Poses.js.map