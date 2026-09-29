//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CLASS-APT] Shows each class's aptitude learnings in the class scene.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Classes
 * @base J-Aptitude
 * @orderAfter J-Base
 * @orderAfter J-Classes
 * @orderAfter J-Aptitude
 * @orderAfter J-Aptitude-Typed
 * @orderAfter J-SkillSlots
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin connects J-Classes to J-Aptitude, for games whose classes teach
 * skills through <aptitude> tags.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Classes; the class scene this adds to.
 * - J-Aptitude; the learnings this shows.
 * - J-Aptitude-Typed; typed learnings carry their badge here too.
 * - J-SkillSlots; the skills a class keeps known are listed too.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The class scene gains a window beside the parameters, showing every skill
 * the highlighted class teaches and how far along the actor is with each.
 * Progress is kept per class whether or not it is being worn, so a class set
 * aside still shows how far along it got.
 *
 * With J-SkillSlots installed, the skills a class lists in <unslottedSkills>
 * are shown above them as "Always known": the skills the class keeps active
 * for as long as it is worn, like the weapon types it can equip.
 *
 * Each class in the list also shows how many of its skills have been learned,
 * as learned/total, and MASTERED in green once every one of them has. A "???"
 * class shows neither.
 *
 * ============================================================================
 * MASTERY:
 * A class is mastered once every skill it teaches has been learned, from that
 * class or any other. A class that teaches nothing is never mastered.
 *
 * Events can ask with a script call in a conditional branch:
 *  $gameActors.actor(1).isClassMastered(2)
 * This is true once actor 1 has learned everything class 2 teaches.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/class/ext/apt/_metadata/_pluginMetadata.js
/**
* The metadata for J-Classes-Aptitude, which has nothing to configure.
*/
var J_ClassAptPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/class/ext/apt/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "4.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredClassesVersion = "1.0.0";
	const hasClassesRequirement = J.BASE.Helpers.satisfies(J.CLASS.Metadata.version.version(), requiredClassesVersion);
	if (hasClassesRequirement === false) {
		throw new Error(`Either missing J-Classes or has a lower version than the required: ${requiredClassesVersion}`);
	}
	const requiredAptitudeVersion = "1.5.0";
	const hasAptitudeRequirement = J.BASE.Helpers.satisfies(J.APT.Metadata.version.version(), requiredAptitudeVersion);
	if (hasAptitudeRequirement === false) {
		throw new Error(`Either missing J-Aptitude or has a lower version than the required: ${requiredAptitudeVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension.
*/
J.CLASS.EXT.APT = {};
/**
* The metadata associated with this plugin.
*/
J.CLASS.EXT.APT.Metadata = new J_ClassAptPluginMetadata("J-Classes-Aptitude", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.CLASS.EXT.APT.Aliased = {};
J.CLASS.EXT.APT.Aliased.Scene_Classes = new Map();
J.CLASS.EXT.APT.Aliased.Window_ClassList = new Map();

//#endregion
//#region src/plugins/class/ext/apt/managers/ClassAptitudeManager.js
/**
* Answers what the class scene asks about a class's aptitude learnings: how many an actor has learned, and
* whether they have learned them all.
*
* Progress is read per skill rather than per source, the same way J-Aptitude grants it. A skill learned
* from one class counts for every other class that teaches it too, which is also why a class stops handing
* out AP for a skill the moment it is learned anywhere.
*/
var ClassAptitudeManager = class {
	/**
	* The color a mastered class's progress is drawn in: the same green the aptitude ladder marks a learned
	* skill DONE in.
	* @type {number}
	*/
	static MASTERED_COLOR_INDEX = 11;
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Counts how many of a class's teachables an actor has learned.
	* @param {Game_Actor} actor The actor whose learnings are counted.
	* @param {number} classId The id of the class whose teachables are counted.
	* @returns {number}
	*/
	static learnedCount(actor, classId) {
		const teachables = $dataClasses[classId].aptitudeTeachings;
		const learned = teachables.filter((teachable) => actor.hasLearnedAptitudeSkill(teachable.skillId));
		return learned.length;
	}
	/**
	* Determines whether an actor has learned everything a class teaches.
	*
	* A class that teaches nothing is never mastered: there is nothing to have finished, and answering yes
	* would let a trainer hand out a reward for a class nobody has worked at.
	* @param {Game_Actor} actor The actor being asked about.
	* @param {number} classId The id of the class being asked about.
	* @returns {boolean}
	*/
	static isMastered(actor, classId) {
		const total = $dataClasses[classId].aptitudeTeachings.length;
		if (total === 0) return false;
		return this.learnedCount(actor, classId) === total;
	}
	/**
	* The progress drawn at the right edge of a class's row: learned over total while there is still something
	* to learn, MASTERED once there is not, and nothing at all for a class that teaches nothing or one the actor
	* has yet to unlock.
	* @param {Game_Actor} actor The actor whose progress is shown.
	* @param {number} classId The id of the class whose progress is shown.
	* @returns {string}
	*/
	static progressText(actor, classId) {
		if (ClassManager.isClassRevealed(actor, classId) === false) return String.empty;
		const total = $dataClasses[classId].aptitudeTeachings.length;
		if (total === 0) return String.empty;
		const learned = this.learnedCount(actor, classId);
		if (learned === total) return "MASTERED";
		return `${learned}/${total}`;
	}
	/**
	* The skills a class keeps known and active for as long as it is worn: its `<unslottedSkills>`, each skill
	* once, in database order.
	*
	* The tag belongs to J-SkillSlots, which frees the skills it lists from needing a slot for whoever carries
	* it. On a class, that is everything the class hands out for free- in Chef Adventure, the weapon and armor
	* types it can equip. Without J-SkillSlots there is no such thing as an unslotted skill, so nothing is.
	* @param {number} classId The id of the class being read.
	* @returns {number[]}
	*/
	static alwaysKnownSkillIds(classId) {
		if (!J.SKS) return [];
		const skillIdArrays = RPGManager.getArraysFromNotesByRegex($dataClasses[classId], J.SKS.RegExp.UnslottedSkills);
		const skillIds = new Set(skillIdArrays.flat());
		return [...skillIds].sort((left, right) => left - right);
	}
};

//#endregion
//#region src/plugins/class/ext/apt/objects/Game_Actor.js
/**
* Determines whether this actor has learned everything the given class teaches.
*
* Here for events to ask by script- a trainer offering a class's next step checks this first, as
* `$gameActors.actor(1).isClassMastered(2)` in a conditional branch.
* @param {number} classId The id of the class being asked about.
* @returns {boolean}
*/
Game_Actor.prototype.isClassMastered = function(classId) {
	return ClassAptitudeManager.isMastered(this, classId);
};

//#endregion
//#region src/plugins/class/ext/apt/windows/Window_ClassLearnings.js
/**
* The window beside the class's parameters: what the highlighted class keeps known while it is worn, then
* every skill it teaches, and how far along the actor is with each.
*
* This is J-Aptitude's own source-details window pointed at a class, so the ladder, the DONE and KNOWN marks,
* the progress gauges and the typed-AP badge all read exactly as they do in the aptitude scene. Progress is
* kept per source whether or not that source is worn, which is what lets a class the actor has set aside
* still show how far along they got.
*/
var Window_ClassLearnings = class extends Window_AptitudeSourceDetails {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Points this window at an actor and one of their classes, and redraws it.
	* @param {Game_Actor} actor The actor whose progress is shown.
	* @param {number} classId The id of the class whose learnings are shown.
	*/
	showClass(actor, classId) {
		this.setActor(actor);
		const dataClass = $dataClasses[classId];
		if (this.source() === dataClass) {
			this.refresh();
			return;
		}
		this.setSource(dataClass);
	}
	/**
	* Overrides {@link Window_AptitudeSourceDetails#drawHeader}.<br/>
	* Draws what the class keeps known for as long as it is worn, above the skills it teaches.
	*
	* The source's own header is left out. The class's name is already highlighted in the list, and the
	* header's description of a class assumes it is the one being worn, which here it often is not.
	*/
	drawHeader() {
		const skillIds = ClassAptitudeManager.alwaysKnownSkillIds(this.source().id);
		if (skillIds.length === 0) return;
		const left = this.contentLeft();
		const titleY = this.nextY();
		const iconIndex = ClassManager.classIconIndex(this.source());
		const title = `\\I[${iconIndex}]\\C[16]Always known\\C[0]`;
		this.drawTextEx(title, left, titleY, this.contentsWidth());
		skillIds.forEach((skillId, index) => {
			const skill = this.actor().skill(skillId);
			const rowY = titleY + (index + 1) * this.lineHeight();
			this.drawTextEx(`\\I[${skill.iconIndex}]${skill.name}`, left, rowY, this.contentsWidth());
		});
		const afterRows = titleY + (skillIds.length + 1) * this.lineHeight();
		this.setNextY(afterRows + Math.floor(this.lineHeight() / 2));
	}
	/**
	* Overrides {@link Window_AptitudeSourceDetails#contentLeft}.<br/>
	* Starts every row the class scene's shared inset in from the left edge, as the parameters beside it do.
	* @returns {number}
	*/
	contentLeft() {
		return ClassSceneLayout.contentInset(this);
	}
	/**
	* Overrides {@link Window_AptitudeSourceDetails#teachableGaugeX}.<br/>
	* Anchors each gauge against the right side, the class scene's shared inset in from the edge.
	*
	* J-Aptitude spaces the ladder for the full width of its own scene. Beside the class's parameters this
	* window has about half that, so the gauge moves to the side and leaves a skill's name the rest of the row.
	* @returns {number}
	*/
	teachableGaugeX() {
		const right = this.contentsWidth() - ClassSceneLayout.contentInset(this);
		return right - this.gaugeWidth();
	}
	/**
	* Overrides {@link Window_AptitudeSourceDetails#gaugeWidth}.<br/>
	* Shortens the gauges, so the longest skill names still clear their numbers inside the inset.
	* @returns {number}
	*/
	gaugeWidth() {
		return 120;
	}
	/**
	* Overrides {@link Window_AptitudeSourceDetails#teachableStatusRight}.<br/>
	* Ends each teachable's status just short of its gauge.
	* @returns {number}
	*/
	teachableStatusRight() {
		return this.teachableGaugeX() - this.itemPadding();
	}
	/**
	* Overrides {@link Window_Base#lineHeight}.<br/>
	* Spaces rows the way the parameters beside it are spaced, which is also what lets the longest ladders
	* fit in the window at all.
	* @returns {number}
	*/
	lineHeight() {
		return ClassSceneLayout.ROW_HEIGHT;
	}
	/**
	* Overrides {@link Window_Base#resetFontSize}.<br/>
	* Draws everything in this window a step smaller than the menus' own type, to suit its shorter rows.
	*
	* Nearly everything here is drawn with text codes, and drawing text codes resets the font first, so the
	* smaller size belongs in the reset itself rather than being applied row by row.
	*/
	resetFontSize() {
		this.contents.fontSize = $gameSystem.mainFontSize() - ClassSceneLayout.ROW_FONT_REDUCTION;
	}
};

//#endregion
//#region src/plugins/class/ext/apt/windows/Window_ClassList.js
/**
* Extends {@link #classRightText}.<br/>
* Also shows how much of each class the actor has learned.
* @param {RPG_Class} dataClass The class the row names.
* @returns {string}
*/
J.CLASS.EXT.APT.Aliased.Window_ClassList.set("classRightText", Window_ClassList.prototype.classRightText);
Window_ClassList.prototype.classRightText = function(dataClass) {
	const original = J.CLASS.EXT.APT.Aliased.Window_ClassList.get("classRightText").call(this, dataClass);
	const progressText = ClassAptitudeManager.progressText(this.actor(), dataClass.id);
	if (progressText === String.empty) return original;
	return progressText;
};
/**
* Extends {@link #classRightColorIndex}.<br/>
* Also marks a class the actor has learned everything from.
* @param {RPG_Class} dataClass The class the row names.
* @returns {number}
*/
J.CLASS.EXT.APT.Aliased.Window_ClassList.set("classRightColorIndex", Window_ClassList.prototype.classRightColorIndex);
Window_ClassList.prototype.classRightColorIndex = function(dataClass) {
	const original = J.CLASS.EXT.APT.Aliased.Window_ClassList.get("classRightColorIndex").call(this, dataClass);
	if (ClassAptitudeManager.isMastered(this.actor(), dataClass.id) === false) return original;
	return ClassAptitudeManager.MASTERED_COLOR_INDEX;
};

//#endregion
//#region src/plugins/class/ext/apt/scenes/Scene_Classes.js
/**
* Extends {@link #sideWindowDefinitions}.<br/>
* Also places the highlighted class's learnings beside the parameters, after any window placed before it.
* @returns {Array<{createWindow: function(Rectangle): Window_Base}>}
*/
J.CLASS.EXT.APT.Aliased.Scene_Classes.set("sideWindowDefinitions", Scene_Classes.prototype.sideWindowDefinitions);
Scene_Classes.prototype.sideWindowDefinitions = function() {
	const definitions = J.CLASS.EXT.APT.Aliased.Scene_Classes.get("sideWindowDefinitions").call(this);
	definitions.push({ createWindow: (rectangle) => new Window_ClassLearnings(rectangle) });
	return definitions;
};

//#endregion
//# sourceMappingURL=J-Classes-Aptitude.js.map