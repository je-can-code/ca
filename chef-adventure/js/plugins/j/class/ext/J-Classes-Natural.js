//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CLASS-NATURAL] Shows each class's natural growths in the class scene.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Classes
 * @base J-NaturalGrowth
 * @orderAfter J-Base
 * @orderAfter J-Classes
 * @orderAfter J-NaturalGrowth
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin connects J-Classes to J-NaturalGrowth, for games whose classes
 * carry natural growth tags.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Classes; the class scene this adds to.
 * - J-NaturalGrowth; the growths this shows.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The class scene lists one more section for the highlighted class, beneath
 * its parameters:
 * - Growth per level: every Growth tag on the class. These are earned once
 *   for each level gained while the class is worn, and kept for good, so the
 *   class an actor levels in shapes them in every class afterwards.
 *
 * Only the class's own note is read. Each formula is worked out for the actor
 * as they would be in that class, so a formula reading their level or a
 * parameter's base shows what it would give right now.
 *
 * A class's Buff tags have no section of their own. They apply only while
 * the class is worn, so they show in the values of the parameters J-Classes
 * lists, and in their multipliers, below.
 *
 * ============================================================================
 * MULTIPLIERS:
 * A parameter with no growth curve gets its multiplier from its flat Buff
 * tag instead, measured the same way a curve is: the class's buff at level 99
 * over the buff of the class the actor started the game in. A class authored
 * as its starting class's buff times some number shows exactly that number.
 *  Starting class:  <hitBuffPlus:[1*a.level]>
 *  This class:      <hitBuffPlus:[2*a.level]>
 * This class reads Accuracy ×2.00 among its parameters.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/class/ext/natural/_metadata/_pluginMetadata.js
/**
* The metadata for J-Classes-Natural, which has nothing to configure.
*/
var J_ClassNaturalPluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/class/ext/natural/_metadata/initialization.js
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
	const requiredNaturalVersion = "3.0.0";
	const hasNaturalRequirement = J.BASE.Helpers.satisfies(J.NATURAL.Metadata.version.version(), requiredNaturalVersion);
	if (hasNaturalRequirement === false) {
		throw new Error(`Either missing J-NaturalGrowth or has a lower version than the required: ${requiredNaturalVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension.
*/
J.CLASS.EXT.NATURAL = {};
/**
* The metadata associated with this plugin.
*/
J.CLASS.EXT.NATURAL.Metadata = new J_ClassNaturalPluginMetadata("J-Classes-Natural", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.CLASS.EXT.NATURAL.Aliased = {};
J.CLASS.EXT.NATURAL.Aliased.ClassManager = new Map();
J.CLASS.EXT.NATURAL.Aliased.Window_ClassParameters = new Map();

//#endregion
//#region src/plugins/class/ext/natural/managers/ClassGrowthManager.js
/**
* Reads what a class contributes through J-NaturalGrowth's tags: what it grants for every level gained while
* it is worn, and what it grants simply for being worn, which J-Classes' multipliers are measured by.
*
* Only the class's own note is read. Everything else the actor carries has growth tags too, but the growth
* section answers "what does this class do", and folding in gear and states would answer a different question.
* The formulas are evaluated for a copy of the actor standing in the class, so a formula reading the actor's
* level or a parameter's base sees what it would see after changing.
*/
var ClassGrowthManager = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Reads what a class grants for every level gained while it is worn, as the growth section the class scene
	* lists: one row per flat or percent growth, in the order the scene lists its parameters.
	*
	* A growth is earned once per level gained while the class is worn, and kept for good, so the class an actor
	* levels in shapes them in every class afterwards.
	* @param {Game_Actor} actor The actor the class is read for.
	* @param {number} classId The id of the class being read.
	* @returns {Array<{parameterKey: string, isRate: boolean, amount: number}>}
	*/
	static readGrowths(actor, classId) {
		const preview = ClassManager.previewActor(actor, classId);
		return this.growthRows(preview, classId);
	}
	/**
	* What a class buffs a parameter by while worn, at the level multipliers are measured at: the measure a
	* parameter with no curve is given its multiplier by.
	*
	* The formula is worked out for the actor as they are, but at that level, so a buff written as a base
	* times a multiplier- `2 * a.level` against a starting class's `1 * a.level`- reads back as exactly that
	* multiplier. Anything else a formula leans on, such as the parameter's own base, reads as it is now.
	* @param {Game_Actor} actor The actor being measured.
	* @param {number} classId The id of the class being read.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {number}
	*/
	static buffAtReferenceLevel(actor, classId, parameterKey) {
		const naturalKeys = ParameterRegistry.naturallyBoundKeys();
		if (naturalKeys.includes(parameterKey) === false) return 0;
		const atReferenceLevel = Object.create(actor, { level: { value: ClassManager.MULTIPLIER_REFERENCE_LEVEL } });
		const { buffPlus } = ParameterRegistry.naturalBinding(parameterKey);
		const base = actor.naturalDisplayBase(parameterKey);
		return RPGManager.getResultFromNoteByRegex($dataClasses[classId], buffPlus, base, atReferenceLevel);
	}
	/**
	* Reads a class's growths for every parameter bound to natural growth.
	*
	* Only a parameter the class actually grows gets a row, so a class growing three parameters lists three
	* rather than every parameter in the game at zero.
	* @param {Game_Actor} preview The actor standing in the class.
	* @param {number} classId The id of the class being read.
	* @returns {Array<{parameterKey: string, isRate: boolean, amount: number}>}
	*/
	static growthRows(preview, classId) {
		const dataClass = $dataClasses[classId];
		const rows = [];
		const parameterKeys = ClassManager.inListingOrder(ParameterRegistry.naturallyBoundKeys());
		parameterKeys.forEach((parameterKey) => {
			const { growthPlus: plusTag, growthRate: rateTag } = ParameterRegistry.naturalBinding(parameterKey);
			const base = preview.naturalDisplayBase(parameterKey);
			const plus = RPGManager.getResultFromNoteByRegex(dataClass, plusTag, base, preview);
			if (plus !== 0) {
				rows.push({
					parameterKey,
					isRate: false,
					amount: plus
				});
			}
			const rate = RPGManager.getResultFromNoteByRegex(dataClass, rateTag, base, preview);
			if (rate !== 0) {
				rows.push({
					parameterKey,
					isRate: true,
					amount: rate
				});
			}
		});
		return rows;
	}
	/**
	* Describes a row the way the class scene draws it: the parameter's icon and name, and the amount signed.
	*
	* A flat amount is formatted by the parameter's own definition, so a percent parameter reads as a percent
	* and a regen reads per second, exactly as it does on the status screen. A rate is always a percent of the
	* parameter's base, whatever the parameter is.
	* @param {{parameterKey: string, isRate: boolean, amount: number}} row The row to describe.
	* @returns {{iconIndex: number, label: string, value: string}}
	*/
	static describe(row) {
		const definition = ParameterRegistry.get(row.parameterKey);
		return {
			iconIndex: definition.iconIndex(),
			label: definition.label(),
			value: this.formatAmount(definition, row)
		};
	}
	/**
	* Formats a row's amount as signed text.
	* @param {ParameterDefinition} definition The definition of the row's parameter.
	* @param {{parameterKey: string, isRate: boolean, amount: number}} row The row whose amount is formatted.
	* @returns {string}
	*/
	static formatAmount(definition, row) {
		if (row.isRate) {
			const amount = Number(row.amount.toFixed(2));
			const sign = amount >= 0 ? "+" : String.empty;
			return `${sign}${amount}%`;
		}
		const rawAmount = row.amount / definition.displayScale();
		return definition.prettyDelta(rawAmount);
	}
};

//#endregion
//#region src/plugins/class/ext/natural/managers/ClassManager.js
/**
* Extends {@link ClassManager.referenceValue}.<br/>
* Also measures a parameter J-Classes has no curve for by what the class buffs it by while worn.
*
* A class authored as its starting class's buff times some number- `3 * a.level` against `1 * a.level`-
* then shows that number as its multiplier, exactly the way a class authored as its starting class's curve
* times some number does.
* @param {Game_Actor} actor The actor being measured.
* @param {number} classId The id of the class to read.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number}
*/
J.CLASS.EXT.NATURAL.Aliased.ClassManager.set("referenceValue", ClassManager.referenceValue);
ClassManager.referenceValue = function(actor, classId, parameterKey) {
	const original = J.CLASS.EXT.NATURAL.Aliased.ClassManager.get("referenceValue").call(this, actor, classId, parameterKey);
	if (original !== 0) return original;
	return ClassGrowthManager.buffAtReferenceLevel(actor, classId, parameterKey);
};

//#endregion
//#region src/plugins/class/ext/natural/windows/Window_ClassParameters.js
/**
* Extends {@link Window_ClassParameters#drawAfterParameters}.<br/>
* Also lists what the highlighted class grants for every level gained while wearing it, beneath whatever came
* before.
*
* This is the part a player can plan around. A growth is earned at level-up and kept forever, so the class an
* actor levels in decides what they carry into every class after it.
* @param {number} y The y coordinate just below everything drawn so far.
* @returns {number} The y coordinate just below everything drawn.
*/
J.CLASS.EXT.NATURAL.Aliased.Window_ClassParameters.set("drawAfterParameters", Window_ClassParameters.prototype.drawAfterParameters);
Window_ClassParameters.prototype.drawAfterParameters = function(y) {
	const afterOriginal = J.CLASS.EXT.NATURAL.Aliased.Window_ClassParameters.get("drawAfterParameters").call(this, y);
	const growths = ClassGrowthManager.readGrowths(this.actor(), this.classId());
	const gap = Math.floor(this.lineHeight() / 2);
	return this.drawGrowthSection("Growth per level", growths, afterOriginal + gap);
};
/**
* Draws the class's growth section: its title, then a row per growth, or a line saying there are none.
* @param {string} title The section's title.
* @param {Array<{parameterKey: string, isRate: boolean, amount: number}>} rows The section's rows.
* @param {number} y The y coordinate the section starts at.
* @returns {number} The y coordinate just below the section.
*/
Window_ClassParameters.prototype.drawGrowthSection = function(title, rows, y) {
	this.drawSectionTitle(title, y);
	const rowsY = y + this.lineHeight();
	if (rows.length === 0) {
		this.drawEmptySectionRow("Nothing", rowsY);
		return rowsY + this.lineHeight();
	}
	rows.forEach((row, index) => {
		const rowY = rowsY + index * this.lineHeight();
		this.drawGrowthRow(row, rowY);
	});
	return rowsY + rows.length * this.lineHeight();
};
/**
* Draws a single contribution the way a parameter row above it reads: the parameter's icon and name, and the
* amount at the right edge- in line with the parameters' last column- in the same smaller type.
* @param {{parameterKey: string, isRate: boolean, amount: number}} row The row to draw.
* @param {number} y The y coordinate of the row.
*/
Window_ClassParameters.prototype.drawGrowthRow = function(row, y) {
	const { iconIndex, label, value } = ClassGrowthManager.describe(row);
	const left = this.contentLeft();
	const right = this.contentRight();
	const nameX = left + ImageManager.iconWidth + 4;
	this.resetFontSettings();
	this.drawIcon(iconIndex, left, y);
	this.makeFontSmaller();
	this.drawText(label, nameX, y, right - nameX);
	this.drawText(value, left, y, right - left, Window_Base.TextAlignments.Right);
	this.resetFontSettings();
};

//#endregion
//# sourceMappingURL=J-Classes-Natural.js.map