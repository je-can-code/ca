//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 CMS_S] A redesign of the status menu for chef adventure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-SDP
 * @base J-CriticalFactors
 * @base J-NaturalGrowth
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This is primarily designed to render out multiple additional parameters from
 * other plugins for the Chef Adventure game:
 * - BASE (the max tp)
 * - JABS (the movement speed boost)
 * - SDP (breakdown of what panels give bonuses, sdp/exp/gold boosts)
 * - CRIT (the crit damage multiplier and reduction)
 * - NATURAL (the natural buffs and growths)
 *
 * This provides a more comprehensive view of what all the parameters are for
 * the actors (revealing base/sp/ex values) as well as providing a breakdown
 * for each parameter as to what is feeding into it.
 *
 * NOTE ABOUT USING THIS CUSTOM STATUS SCREEN:
 * It is not encouraged to use this unless you intend to use all the base
 * plugins that are listed. Support for this plugin will be minimal for
 * edge-cases outside of how I use this.
 *
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.1.0
 *    Added complete long-parameter coverage and detailed breakdown panel.
 *    Documentation pass for status list window and models.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
 * =========================================================================
 */
//endregion Introduction

//#region src/plugins/cms/status/_metadata/_pluginMetadata.js
var J_CmsStatus_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/cms/status/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "1.0.1";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CMS_S = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CMS_S.Metadata = new J_CmsStatus_PluginMetadata("J-CMS-Status", "1.1.0");
J.CMS_S.Aliased = { Scene_Status: new Map() };

//#endregion
//#region src/plugins/cms/status/_models/StatusParameter.js
/**
* The content of a single parameter being drawn in a window.
*/
var StatusParameter = class {
	/**
	* The numeric value for the parameter.
	* For sp/ex parameters, this may be a decimal.
	* @type {number}
	*/
	value = 0;
	/**
	* The parameter registry key this value represents.
	* @type {string}
	*/
	parameterKey = String.empty;
	/**
	* The `name` of this parameter.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The `iconIndex` of this parameter.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The `colorIndex` of this parameter.
	* @type {number}
	*/
	colorIndex = 0;
	/**
	* Constructor.
	* @param {number} value The value of the parameter.
	* @param {string} parameterKey The registry key this value represents.
	*/
	constructor(value, parameterKey) {
		this.value = value;
		this.parameterKey = parameterKey;
		this.refresh();
	}
	/**
	* Initialize the properties based on the registry definition.
	*/
	refresh() {
		const definition = ParameterRegistry.get(this.parameterKey);
		if (!definition) {
			this.name = this.parameterKey;
			this.iconIndex = 0;
			this.colorIndex = 0;
			return;
		}
		this.name = definition.label();
		this.iconIndex = definition.iconIndex();
		this.colorIndex = definition.resolveDisplayColorIndex(this.value);
	}
	/**
	* Whether this parameter should use styled zero-padding on the status screen.
	* Returns false when a sentinel label replaces the numeric value, or for regen stats
	* that already format themselves with a unit suffix.
	* @returns {boolean}
	*/
	usesStyledValue() {
		const definition = ParameterRegistry.get(this.parameterKey);
		if (!definition) {
			return false;
		}
		if (definition.resolveDisplaySentinel(this.value)) {
			return false;
		}
		return definition.format !== ParameterFormat.REGEN_PER_SECOND;
	}
	/**
	* Get the pretty value of this parameter.
	* @param {boolean=} withPadding True if you want zero-padding, false otherwise; defaults to false.
	* @returns {string}
	*/
	prettyValue(withPadding = false) {
		const definition = ParameterRegistry.get(this.parameterKey);
		if (!definition) {
			return this.value.toString();
		}
		return definition.prettyValue(this.value, withPadding);
	}
};

//#endregion
//#region src/plugins/cms/status/_models/StatusStatListRow.js
/**
* Represents a single selectable stat row for the Status stat list window.
* Each row points at a registry parameter key and the display section it belongs to.
*/
var StatusStatListRow = class {
	/**
	* The display section header this row belongs to (ex: "Core Parameters").
	* @type {string}
	*/
	section = String.empty;
	/**
	* The registry key represented by this row.
	* @type {string}
	*/
	parameterKey = String.empty;
	/**
	* Constructor.
	* @param {string} section The display section header.
	* @param {string} parameterKey The registry key this row represents.
	*/
	constructor(section, parameterKey) {
		this.section = section;
		this.parameterKey = parameterKey;
	}
};

//#endregion
//#region src/plugins/cms/status/helpers/StatusHelper.js
/**
* Text and number formatting helpers.
*/
var StatusHelper = class {
	/**
	* Formats a numeric percent (e.g., 25 -> "+25%" when signed).
	* @param {number} percent The percent value.
	* @param {boolean} signed Whether to prefix a plus when positive.
	* @returns {string}
	*/
	static toPercentString(percent, signed) {
		const base = Number.isInteger(percent) ? `${percent}` : percent.toFixed(1);
		const sign = signed && percent >= 0 ? "+" : String.empty;
		return `${sign}${base}%`;
	}
	/**
	* Converts a rate like 1.20 into a signed percentage delta string like "+20%".
	* @param {number} rate The multiplier rate.
	* @returns {string}
	*/
	static toRateString(rate) {
		const delta = (rate - 1) * 100;
		return this.toPercentString(delta, true);
	}
};

//#endregion
//#region src/plugins/cms/status/windows/Window_StatusParameters.js
/**
* A replacement class for `Window_StatusParams`, which originally extended `Window_Selectable`
* and rendered only the b-params. This window now extends `Window_Base` and renders all
* params, including b-/x-/s- params.
*/
var Window_StatusParameters = class Window_StatusParameters extends Window_Base {
	/**
	* Section chrome for catalog groups rendered on page 1.
	* @type {Object<string, {title: string, iconIndex: number, colorIndex: number}>}
	*/
	static GROUP_CHROME = {
		combat: {
			title: "Combat",
			iconIndex: 76,
			colorIndex: 10
		},
		vitality: {
			title: "Vitality",
			iconIndex: 7,
			colorIndex: 3
		},
		precision: {
			title: "Precision",
			iconIndex: 1756,
			colorIndex: 6
		},
		defensive: {
			title: "Defensive",
			iconIndex: 1625,
			colorIndex: 26
		},
		mobility: {
			title: "Mobility",
			iconIndex: 82,
			colorIndex: 20
		},
		fate: {
			title: "Fate",
			iconIndex: 1619,
			colorIndex: 27
		}
	};
	/**
	* Gap between a catalog name block and its value column.
	* @type {number}
	*/
	static CATALOG_NAME_VALUE_GAP = 8;
	/**
	* Gap between paired values straddling the center divider.
	* @type {number}
	*/
	static CATALOG_PAIR_GAP = 8;
	/**
	* Horizontal rules extend this many pixels past {@link #computeThreeColumnLayout} column width.
	* @type {number}
	*/
	static COLUMN_LINE_BLEED = 16;
	/**
	* Clear air between columns after accounting for {@link #COLUMN_LINE_BLEED}.
	* @type {number}
	*/
	static COLUMN_CLEAR_GAP = 24;
	/**
	* Shared layout constants for page-1 row bands.
	* @type {{rowGap: number}}
	*/
	static PAGE_LAYOUT = { rowGap: 24 };
	/**
	* Catalog group ids per visual row band (left column, then middle column).
	* @type {Array<[string, string]>}
	*/
	static PAGE_GROUP_ROW_GROUPS = [
		["combat", "vitality"],
		["precision", "defensive"],
		["mobility", "fate"]
	];
	/**
	* @param {Rectangle} rect A rectangle that represents the shape of this window.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		this.actor = null;
	}
	/**
	* Overwrites {@link #lineHeight}.<br/>
	* Reduces line height for this window.
	* @returns {number}
	*/
	lineHeight() {
		return 32;
	}
	/**
	* Sets the actor for this window to draw parameter data for.
	* @param {Game_Actor} actor The actor to set.
	*/
	setActor(actor) {
		this.actor = actor;
		this.refresh();
	}
	/**
	* Refreshes this window by clearing it and redrawing all its contents.
	*/
	refresh() {
		this.contents.clear();
		this.drawContent();
	}
	/**
	* Draws all content in this window.
	*/
	drawContent() {
		if (!this.actor) return;
		const { rowGap } = Window_StatusParameters.PAGE_LAYOUT;
		const columnLayout = this.computeThreeColumnLayout();
		let cursorY = 0;
		if (columnLayout) {
			const { columnWidth, leftX, middleX, rightX, rightColumnWidth } = columnLayout;
			const columnXs = [leftX, middleX];
			Window_StatusParameters.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
				const rowHeights = rowGroups.map((groupId, columnIndex) => {
					return this.drawParameterGroup(columnXs[columnIndex], cursorY, groupId, columnWidth);
				});
				const tallestSection = Math.max(...rowHeights);
				cursorY += tallestSection + rowGap;
			});
			const elementsBottomY = this.drawElementalRates(rightX, 0, 10, rightColumnWidth);
			this.drawStateRates(rightX, elementsBottomY + 16, rightColumnWidth);
		} else {
			const fallbackWidth = Math.floor((this.innerWidth - 24) / 2);
			Window_StatusParameters.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
				const rowHeights = rowGroups.map((groupId, columnIndex) => {
					const x = columnIndex === 0 ? 0 : fallbackWidth + 24;
					return this.drawParameterGroup(x, cursorY, groupId, fallbackWidth);
				});
				const tallestSection = Math.max(...rowHeights);
				cursorY += tallestSection + rowGap;
			});
			const halfWidth = Math.floor((this.innerWidth - 16) / 2);
			const elementsHeight = this.drawElementalRates(0, cursorY + 8, 10, halfWidth);
			this.drawStateRates(halfWidth + 16, cursorY + 8, halfWidth);
		}
	}
	/**
	* Computes equal-width three-column layout with equal inter-column gaps.
	* @returns {{ edgePad: number, gap: number, columnWidth: number, leftX: number, middleX: number, rightX: number, rightColumnWidth: number }|null}
	*/
	computeThreeColumnLayout() {
		const edgePad = 8;
		const usable = this.innerWidth - edgePad * 2;
		const gap = Window_StatusParameters.COLUMN_LINE_BLEED + Window_StatusParameters.COLUMN_CLEAR_GAP;
		const minColumnWidth = 200;
		const columnWidth = Math.floor((usable - gap * 2) / 3);
		if (columnWidth < minColumnWidth) {
			return null;
		}
		const leftX = edgePad;
		const middleX = leftX + columnWidth + gap;
		const rightX = middleX + columnWidth + gap;
		const rightColumnWidth = this.innerWidth - rightX;
		return {
			edgePad,
			gap,
			columnWidth,
			leftX,
			middleX,
			rightX,
			rightColumnWidth
		};
	}
	/**
	* X coordinate of the vertical rule between paired stats — matches {@link #drawTSeparator}.
	* @param {number} sectionX The left edge of the group column.
	* @param {number} sectionWidth The drawable width of the group column.
	* @returns {number}
	*/
	centerDividerX(sectionX, sectionWidth) {
		return sectionX + Math.floor(sectionWidth / 2) + 8;
	}
	/**
	* Outer right edge for catalog row chrome (icon column); matches section width, not line bleed.
	* @param {number} sectionX The left edge of the group column.
	* @param {number} sectionWidth The drawable width of the group column.
	* @returns {number}
	*/
	catalogRowRight(sectionX, sectionWidth) {
		return sectionX + sectionWidth;
	}
	/**
	* Whether a catalog value already occupies the sign column (space, {@code +}, or {@code -}).
	* @param {string} value The rendered value text.
	* @returns {boolean}
	*/
	catalogValueHasSignColumn(value) {
		const first = value.charAt(0);
		return first === " " || first === "+" || first === "-";
	}
	/**
	* Whether a right-half catalog value should indent one column to match signed percent rows.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {boolean}
	*/
	catalogValueRightReservesSignColumn(value, withPadding, isSentinel) {
		if (withPadding) {
			return this.catalogValueHasSignColumn(value) === false;
		}
		return isSentinel;
	}
	/**
	* Monospace slot width for a right-half catalog value.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	catalogValueRightMeasureWidth(value, withPadding, isSentinel) {
		if (withPadding || isSentinel) {
			return this.styledValuePixelWidth(value);
		}
		return this.textWidth(value);
	}
	/**
	* Layout width for a right-half catalog value beside the center divider.
	* Flat numerics and sentinel labels reserve one digit column so they align with signed percents.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	catalogValueRightLayoutWidth(value, withPadding, isSentinel) {
		const measureWidth = this.catalogValueRightMeasureWidth(value, withPadding, isSentinel);
		if (this.catalogValueRightReservesSignColumn(value, withPadding, isSentinel)) {
			return measureWidth + this.textWidth("0");
		}
		return measureWidth;
	}
	/**
	* X coordinate for drawing a right-half catalog value beside the center divider.
	* @param {number} halfX The inner edge of the right half-column.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	catalogValueRightDrawX(halfX, value, withPadding, isSentinel) {
		if (this.catalogValueRightReservesSignColumn(value, withPadding, isSentinel)) {
			return halfX + this.textWidth("0");
		}
		return halfX;
	}
	/**
	* Estimates pixel width for a styled padded string (monospace digit assumption).
	* @param {string} value The rendered text.
	* @returns {number}
	*/
	styledValuePixelWidth(value) {
		return value.length * this.textWidth("0");
	}
	/**
	* Y coordinate for the horizontal rule beneath a section title — matches {@link #drawTSeparator}.
	* @param {number} sectionY The section's content anchor y (same as catalog groups use).
	* @returns {number}
	*/
	sectionSeparatorY(sectionY) {
		const rowBaseY = sectionY + 8;
		const firstRowY = rowBaseY - 2 + this.lineHeight();
		return firstRowY - 4;
	}
	/**
	* Collects element affiliation rows that differ from the 100% baseline.
	* Uses {@link Game_Battler#elementRate} so the panel matches combat math (incl. J.ELEM absorb).
	* @param {number} limit The number of elements to inspect.
	* @returns {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>}
	*/
	collectElementAffiliationRows(limit = 10) {
		/** @type {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} */
		const rows = [];
		$dataSystem.elements.slice(0, limit).forEach((elementName, index) => {
			const absorbed = J.ELEM && this.actor.isElementAbsorbed(index);
			const combatRate = this.actor.elementRate(index);
			const magnitudePercent = Math.round(Math.abs(combatRate) * 100);
			const formatted = AffiliationDisplay.formatDelta(magnitudePercent, {
				absorbed,
				immune: absorbed === false && magnitudePercent <= 0
			});
			if (!formatted) {
				return;
			}
			const name = elementName === String.empty ? "Neutral" : elementName;
			rows.push({
				name,
				value: formatted.value,
				iconIndex: IconManager.element(index),
				colorIndex: formatted.colorIndex
			});
		});
		return rows;
	}
	/**
	* Collects ailment resistance rows that differ from the 100% baseline.
	* Uses {@link Game_Battler#stateRate} so the panel matches combat math.
	* @returns {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>}
	*/
	collectAilmentAffiliationRows() {
		/** @type {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} */
		const rows = [];
		$dataStates.slice(4, 18).forEach((state) => {
			if (!state) return;
			const immune = this.actor.isStateResist(state.id);
			const ratePercent = immune ? 0 : Math.round(this.actor.stateRate(state.id) * 100);
			const formatted = AffiliationDisplay.formatDelta(ratePercent, { immune });
			if (!formatted) {
				return;
			}
			rows.push({
				name: state.name,
				value: formatted.value,
				iconIndex: state.iconIndex,
				colorIndex: formatted.colorIndex
			});
		});
		return rows;
	}
	/**
	* Draws a single baseline placeholder row when every entry in a section is standard.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width available for this row.
	*/
	drawAffiliationBaselineRow(x, y, sectionWidth) {
		this.resetFontSettings();
		this.makeFontSmaller();
		this.changeTextColor(ColorManager.textColor(7));
		this.drawText("All standard", x, y, sectionWidth, "center");
		this.resetFontSettings();
	}
	/**
	* Draws filtered affiliation rows beneath a section header.
	* @param {number} x The x coordinate.
	* @param {number} y The section anchor y.
	* @param {number} sectionWidth The width available for each row.
	* @param {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} rows The rows to draw.
	* @returns {number} The y coordinate just below the last visible row.
	*/
	drawAffiliationRows(x, y, sectionWidth, rows) {
		if (rows.length === 0) {
			const rowY = y + this.lineHeight() + 8;
			this.drawAffiliationBaselineRow(x, rowY, sectionWidth);
			return rowY + this.lineHeight();
		}
		rows.forEach((row, index) => {
			const rowY = y + (index + 1) * this.lineHeight() + 8;
			this.drawParameter(row.name, row.value, row.iconIndex, x, rowY, row.colorIndex, sectionWidth);
		});
		return y + (rows.length + 1) * this.lineHeight() + 8;
	}
	/**
	* Draws one catalog group section and returns the vertical space consumed.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {string} groupId The {@link ParameterGroups} id.
	* @param {number} sectionWidth The width of the section.
	* @returns {number}
	*/
	drawParameterGroup(x, y, groupId, sectionWidth) {
		const chrome = Window_StatusParameters.GROUP_CHROME[groupId];
		const definitions = ParameterRegistry.byGroup(groupId);
		if (!chrome || !definitions.length) {
			return 0;
		}
		const rowCount = Math.ceil(definitions.length / 2);
		const titleY = y - 15;
		const rowBaseY = y + 8;
		this.drawTitle(chrome.title, x, titleY, chrome.iconIndex, chrome.colorIndex);
		this.drawTSeparator(x, rowBaseY - 2, sectionWidth, rowCount);
		this.drawGroupParameters(x, rowBaseY, sectionWidth, definitions);
		return 36 + rowCount * this.lineHeight() + 8;
	}
	/**
	* Draws all parameters for a group in two-column pairs.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width of the section.
	* @param {ParameterDefinition[]} definitions The catalog entries for this group.
	*/
	drawGroupParameters(x, y, sectionWidth, definitions) {
		const lh = this.lineHeight();
		const dividerX = this.centerDividerX(x, sectionWidth);
		const pairGap = Window_StatusParameters.CATALOG_PAIR_GAP;
		const leftInnerRight = dividerX - Math.floor(pairGap / 2);
		const rightHalfX = dividerX + Math.ceil(pairGap / 2);
		const rowRight = this.catalogRowRight(x, sectionWidth);
		definitions.forEach((definition, index) => {
			const row = Math.floor(index / 2) + 1;
			const rowY = y + lh * row;
			const parameter = this.makeParameter(definition.key);
			if (index % 2 === 0) {
				this.drawParameterLeft(x, rowY, leftInnerRight, parameter);
			} else {
				this.drawParameterRight(rightHalfX, rowY, rowRight, parameter);
			}
		});
	}
	/**
	* Draws a T separator by using a horizontal and vertical line.
	* The length of these lines is defined by the section width and the number of lines.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} w The width of the T separator.
	* @param {number=} lines The height of the T separator, multiplied by `lineHeight`; defaults to 1 line.
	*/
	drawTSeparator(x, y, w, lines = 1) {
		const lh = this.lineHeight();
		const firstRowY = y + lh * 1;
		this.drawHorizontalLine(x, firstRowY - 4, w + Window_StatusParameters.COLUMN_LINE_BLEED, 3);
		const secondColumnX = x + w / 2 + 12;
		const verticalLineX = secondColumnX - 4;
		const verticalLineHeight = lh * lines + 4;
		this.drawVerticalLine(verticalLineX, firstRowY - 2, verticalLineHeight, 3);
	}
	/**
	* Draws a catalog stat value with optional styled zero-padding.
	* @param {number} x The value column x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} width The width reserved for the value.
	* @param {StatusParameter} parameter The parameter being rendered.
	* @param {'left'|'right'} align Horizontal alignment within the slot.
	*/
	drawCatalogParameterValue(x, y, width, parameter, align = "right") {
		const withPadding = parameter.usesStyledValue();
		const value = parameter.prettyValue(withPadding);
		if (withPadding) {
			this.drawStyledPaddedValue(x, y, value, width, 8, parameter.colorIndex, align);
		} else {
			const valueColorIndex = parameter.colorIndex;
			if (valueColorIndex !== 0) {
				this.contents.fontBold = true;
			}
			this.changeTextColor(ColorManager.textColor(valueColorIndex));
			this.drawText(value, x, y, width, align);
			this.resetTextColor();
			this.resetFontFormatting();
		}
	}
	/**
	* Creates a new parameter object that contains the necessary data to draw it into the window.
	* @param {string} parameterKey The parameter registry key (e.g. `'atk'`).
	* @returns {StatusParameter} The compiled {@link StatusParameter}.
	*/
	makeParameter(parameterKey) {
		const value = this.actor.parameter(parameterKey);
		return new StatusParameter(value, parameterKey);
	}
	/**
	* Left half of a paired row: {@code [icon][name][value→center]}.
	* @param {number} halfX The left edge of this half-column.
	* @param {number} y The y coordinate.
	* @param {number} innerRight The inner edge where values meet the center divider.
	* @param {StatusParameter} parameter The parameter being rendered.
	*/
	drawParameterLeft(halfX, y, innerRight, parameter) {
		this.resetFontSettings();
		this.drawIcon(parameter.iconIndex, halfX, y);
		this.makeFontSmaller();
		const iconPad = ImageManager.iconWidth + 4;
		const gap = Window_StatusParameters.CATALOG_NAME_VALUE_GAP;
		const rowSpan = innerRight - halfX;
		const nameX = halfX + iconPad;
		const withPadding = parameter.usesStyledValue();
		const value = parameter.prettyValue(withPadding);
		const valuePixelWidth = withPadding ? this.styledValuePixelWidth(value) : this.textWidth(value);
		const nameWidth = Math.max(0, rowSpan - iconPad - valuePixelWidth - gap);
		this.drawText(`${parameter.name}`, nameX, y, nameWidth, "left");
		this.drawCatalogParameterValue(halfX, y, rowSpan, parameter, "right");
		this.resetFontSettings();
	}
	/**
	* Right half of a paired row: {@code [value←center][name][icon]} (mirrored zigzag).
	* @param {number} halfX The left (inner) edge of this half-column.
	* @param {number} y The y coordinate.
	* @param {number} outerRight The outer edge of the section (includes underline bleed).
	* @param {StatusParameter} parameter The parameter being rendered.
	*/
	drawParameterRight(halfX, y, outerRight, parameter) {
		this.resetFontSettings();
		this.makeFontSmaller();
		const gap = Window_StatusParameters.CATALOG_NAME_VALUE_GAP;
		const iconX = outerRight - ImageManager.iconWidth;
		const withPadding = parameter.usesStyledValue();
		const value = parameter.prettyValue(withPadding);
		const definition = ParameterRegistry.get(parameter.parameterKey);
		const isSentinel = definition && definition.resolveDisplaySentinel(parameter.value) !== null;
		const layoutWidth = this.catalogValueRightLayoutWidth(value, withPadding, isSentinel);
		const valueDrawX = this.catalogValueRightDrawX(halfX, value, withPadding, isSentinel);
		const valueDrawWidth = this.catalogValueRightMeasureWidth(value, withPadding, isSentinel);
		const nameX = halfX + layoutWidth + gap;
		const nameWidth = Math.max(0, iconX - nameX - gap);
		this.drawCatalogParameterValue(valueDrawX, y, valueDrawWidth, parameter, "left");
		this.resetTextColor();
		this.resetFontFormatting();
		this.drawText(`${parameter.name}`, nameX, y, nameWidth, "right");
		this.drawIcon(parameter.iconIndex, iconX, y);
		this.resetFontSettings();
	}
	/**
	* Overwrites {@link #makeFontSmaller}.<br/>
	* Makes the reduction step smaller.
	*/
	makeFontSmaller() {
		if (this.contents.fontSize >= 24) {
			this.contents.fontSize -= 6;
		}
	}
	/**
	* Overwrites {@link #makeFontBigger}.<br/>
	* Makes the expansion step smaller.
	*/
	makeFontBigger() {
		if (this.contents.fontSize <= 96) {
			this.contents.fontSize += 6;
		}
	}
	/**
	* Draws the elemental rates section.
	* @param {number} x The `x` coordinate.
	* @param {number} y The `y` coordinate.
	* @param {number} limit The endpoint if applicable of elements to pull.
	* @param {number=} sectionWidth The width of this section; defaults to 450.
	* @returns {number} The y coordinate just below the last drawn row.
	*/
	drawElementalRates(x, y, limit = 10, sectionWidth = 450) {
		const titleY = y - 15;
		const separatorY = this.sectionSeparatorY(y);
		this.drawTitle("Elements", x, titleY, 64, 8, "center", sectionWidth);
		this.drawHorizontalLine(x, separatorY, sectionWidth, 3);
		const rows = this.collectElementAffiliationRows(limit);
		return this.drawAffiliationRows(x, y, sectionWidth, rows);
	}
	/**
	* Draws the state rates section.
	* @param {number} x The `x` coordinate.
	* @param {number} y The `y` coordinate.
	* @param {number=} sectionWidth The width of this section; defaults to 450.
	* @returns {number} The y coordinate just below the last drawn row.
	*/
	drawStateRates(x, y, sectionWidth = 450) {
		const titleY = y - 15;
		const separatorY = this.sectionSeparatorY(y);
		this.drawTitle("Ailments", x, titleY, 2, 8, "center", sectionWidth);
		this.drawHorizontalLine(x, separatorY, sectionWidth, 3);
		const rows = this.collectAilmentAffiliationRows();
		return this.drawAffiliationRows(x, y, sectionWidth, rows);
	}
	/**
	* Draws the given data as "a parameter".
	* @param {string} name The name of the parameter.
	* @param {number} value The value of the parameter.
	* @param {number} iconIndex The icon index for this parameter.
	* @param {number} x The `x` coordinate.
	* @param {number} y The `y` coordinate.
	* @param {number} colorIndex The color index for this parameter.
	* @param {number=} sectionWidth The width available for this row.
	*/
	drawParameter(name, value, iconIndex, x, y, colorIndex = 0, sectionWidth = 450) {
		this.resetFontSettings();
		this.makeFontSmaller();
		const modifiedX = x + ImageManager.iconWidth + 4;
		const gap = Window_StatusParameters.CATALOG_NAME_VALUE_GAP;
		const valuePixelWidth = this.styledValuePixelWidth(value);
		const nameWidth = Math.max(48, sectionWidth - (modifiedX - x) - valuePixelWidth - gap);
		this.drawIcon(iconIndex, x, y);
		this.drawText(`${name}`, modifiedX, y, nameWidth, "left");
		this.drawStyledPaddedValue(x, y, value, sectionWidth, 8, colorIndex);
		this.resetFontSettings();
	}
	/**
	* Draws the title of one of the sections for parameters.
	* @param {string} text The text to write as the title.
	* @param {number} x The `x` coordinate.
	* @param {number} y The `y` coordinate.
	* @param {number=} iconIndex The icon index for this parameter; defaults to none(0).
	* @param {number=} colorIndex The color index for the title; defaults to system color(1).
	* @param {string=} alignment The text-alignment value of the title; defaults to "center".
	* @param {number=} sectionWidth The width available for the title row.
	*/
	drawTitle(text, x, y, iconIndex = 0, colorIndex = 1, alignment = "center", sectionWidth = 350) {
		this.resetFontSettings();
		this.drawIcon(iconIndex, x, y + 16);
		this.changeTextColor(ColorManager.textColor(colorIndex));
		this.makeFontBigger();
		this.drawText(text, x + 32, y + 16, sectionWidth - 32, alignment);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/cms/status/windows/Window_StatusStatList.js
/**
* A selectable list of stats (by long param id) that drives the breakdown panel.
*/
var Window_StatusStatList = class extends Window_Selectable {
	/**
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Ensures namespaced storage exists for this window.
	*/
	_root() {
		this._j ||= {};
		this._j._cms_s ||= {};
		this._j._cms_s._status ||= {};
		this._j._cms_s._status._list ||= {
			/**
			* The actor whose stats are shown by this list.
			* @type {Game_Actor|null}
			*/
			_actor: null,
			/**
			* The rows displayed by this list.
			* @type {StatusStatListRow[]}
			*/
			_data: [],
			/**
			* Callback invoked after selection changes.
			* @type {function|null}
			*/
			_onChange: null
		};
	}
	/**
	* Initializes namespaced members.
	*/
	initMembers() {
		this._root();
	}
	/**
	* Gets the bound actor.
	* @returns {Game_Actor|null}
	*/
	getActor() {
		this._root();
		return this._j._cms_s._status._list._actor;
	}
	/**
	* Binds an actor and refreshes the list.
	* @param {Game_Actor} v The actor to bind.
	*/
	setActor(v) {
		this._root();
		this._j._cms_s._status._list._actor = v;
		this.refresh();
		this.select(0);
		this.callChangeHandler();
	}
	/**
	* Gets all rows.
	* @returns {StatusStatListRow[]}
	*/
	getData() {
		this._root();
		return this._j._cms_s._status._list._data;
	}
	/**
	* Replaces all rows.
	* @param {StatusStatListRow[]} v The rows to assign.
	*/
	setData(v) {
		this._root();
		this._j._cms_s._status._list._data = v;
	}
	/**
	* Gets the selection-change callback.
	* @returns {function|null}
	*/
	getChangeHandler() {
		this._root();
		return this._j._cms_s._status._list._onChange;
	}
	/**
	* Sets the selection-change callback.
	* @param {function|null} fn The callback.
	*/
	setChangeHandler(fn) {
		this._root();
		this._j._cms_s._status._list._onChange = fn;
	}
	/**
	* Gets the number of rows.
	* @returns {number}
	*/
	maxItems() {
		return this.getData().length;
	}
	/**
	* Gets a row by index.
	* @param {number} index The index.
	* @returns {StatusStatListRow}
	*/
	itemAt(index) {
		return this.getData()[index];
	}
	/**
	* Gets the selected row.
	* @returns {StatusStatListRow}
	*/
	currentItem() {
		return this.itemAt(this.index());
	}
	/**
	* Gets the selected parameter key (or empty when none).
	* @returns {string}
	*/
	currentParameterKey() {
		/** @type {StatusStatListRow} */
		const row = this.currentItem();
		return row ? row.parameterKey : String.empty;
	}
	/**
	* Changes selection and invokes the change callback.
	* @param {number} index The new index.
	*/
	select(index) {
		super.select(index);
		this.callChangeHandler();
	}
	/**
	* Rebuilds rows and redraws the window.
	*/
	refresh() {
		this.contents.clear();
		this.buildData();
		this.createContents();
		this.drawAllItems();
	}
	/**
	* Populates rows grouped by parameter section.
	*/
	buildData() {
		/** @type {StatusStatListRow[]} */
		const rows = [];
		Window_StatusParameters.PAGE_GROUP_ROW_GROUPS.forEach((rowGroups) => {
			rowGroups.forEach((groupId) => {
				const chrome = Window_StatusParameters.GROUP_CHROME[groupId];
				const definitions = ParameterRegistry.byGroup(groupId);
				if (!chrome || !definitions.length) {
					return;
				}
				definitions.forEach((definition) => {
					rows.push(new StatusStatListRow(chrome.title, definition.key));
				});
			});
		});
		this.setData(rows);
	}
	/**
	* Draws a single row (icon + name).
	* @param {number} index The row index.
	*/
	drawItem(index) {
		const rect = this.itemRectWithPadding(index);
		const row = this.itemAt(index);
		const { parameterKey } = row;
		const name = TextManager.parameterLabel(parameterKey);
		const icon = IconManager.parameterIcon(parameterKey);
		const color = ColorManager.parameterColor(parameterKey);
		this.changeTextColor(ColorManager.textColor(color));
		this.drawIcon(icon, rect.x, rect.y + 2);
		this.drawText(name, rect.x + 36, rect.y, rect.width - 36, "left");
		this.resetTextColor();
	}
	/**
	* Invokes the selection-change callback if assigned.
	*/
	callChangeHandler() {
		const handler = this.getChangeHandler();
		if (handler) {
			handler();
		}
	}
};

//#endregion
//#region src/plugins/cms/status/windows/Window_StatusStatBreakdown.js
/**
* A read-only window that explains where a stat comes from.
*/
var Window_StatusStatBreakdown = class Window_StatusStatBreakdown extends Window_Base {
	/**
	* The various kinds of breakdowns we can draw.
	* @type {{Base: string, Ex: string, Special: string, Mtp: string, Crit: string, Custom: string}}
	*/
	static KINDS = {
		Base: "bparam",
		Ex: "xparam",
		Special: "sparam",
		Mtp: "mtp",
		Crit: "crit",
		Custom: "custom"
	};
	/**
	* Constructor.
	* @param {Rectangle} rect The window rectangle.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	initMembers() {
		if (!this._j) this._j = {};
		if (!this._j._cms_s) this._j._cms_s = {};
		if (!this._j._cms_s._status) this._j._cms_s._status = {};
		this._j._cms_s._status._breakdown = {
			_actor: null,
			_parameterKey: String.empty
		};
	}
	/** @returns {Game_Actor} */
	getActor() {
		return this._j._cms_s._status._breakdown._actor;
	}
	/** @param {Game_Actor} v */
	setActor(v) {
		this._j._cms_s._status._breakdown._actor = v;
	}
	/** @returns {string} */
	getParameterKey() {
		return this._j._cms_s._status._breakdown._parameterKey;
	}
	/** @param {string} v */
	setParameterKey(v) {
		this._j._cms_s._status._breakdown._parameterKey = v;
	}
	/**
	* Sets the context and refreshes the panel.
	* @param {Game_Actor} actor The actor.
	* @param {string} parameterKey The registry key.
	*/
	setContext(actor, parameterKey) {
		this.setActor(actor);
		this.setParameterKey(parameterKey);
		this.refresh();
	}
	lineHeight() {
		return 28;
	}
	refresh() {
		this.contents.clear();
		if (!this.getActor()) return;
		this.drawBreakdown();
	}
	/**
	* Orchestrates the breakdown drawing for the current stat, including
	* a two-line description beneath the header pulled from TextManager.
	*/
	drawBreakdown() {
		const actor = this.getActor();
		const parameterKey = this.getParameterKey();
		const name = TextManager.parameterLabel(parameterKey);
		const icon = IconManager.parameterIcon(parameterKey);
		const color = ColorManager.parameterColor(parameterKey);
		const finalValue = new StatusParameter(actor.parameter(parameterKey), parameterKey).prettyValue(false);
		const gutter = 16;
		const widthUsable = this.innerWidth - gutter;
		const headerX = 0;
		const headerY = 0;
		this.changeTextColor(ColorManager.textColor(color));
		this.drawIcon(icon, headerX, headerY + 2);
		this.drawText(name, headerX + 36, headerY, widthUsable - 36, "left");
		this.resetTextColor();
		this.drawText(finalValue, headerX, headerY, widthUsable, "right");
		const descriptionLines = TextManager.parameterDescription(parameterKey);
		let cursorY = headerY + this.lineHeight();
		if (descriptionLines && descriptionLines.length >= 1) {
			this.drawText(descriptionLines[0], headerX, cursorY, widthUsable, "left");
			cursorY += this.lineHeight();
		}
		if (descriptionLines && descriptionLines.length >= 2) {
			this.drawText(descriptionLines[1], headerX, cursorY, widthUsable, "left");
			cursorY += this.lineHeight();
		}
		cursorY += 16;
		const kind = this.resolveKind(parameterKey);
		switch (kind) {
			case Window_StatusStatBreakdown.KINDS.Base:
				this.drawBParamBreakdown(actor, ParameterKeys.bparamId(parameterKey), headerX, cursorY, widthUsable);
				break;
			case Window_StatusStatBreakdown.KINDS.Ex:
				this.drawXParamBreakdown(actor, ParameterKeys.xparamId(parameterKey), headerX, cursorY, widthUsable);
				break;
			case Window_StatusStatBreakdown.KINDS.Special:
				this.drawSParamBreakdown(actor, ParameterKeys.sparamId(parameterKey), headerX, cursorY, widthUsable);
				break;
			case Window_StatusStatBreakdown.KINDS.Mtp:
				this.drawMtpBreakdown(actor, headerX, cursorY, widthUsable);
				break;
			case Window_StatusStatBreakdown.KINDS.Crit:
				this.drawCritBreakdown(actor, parameterKey === "cdm" ? 0 : 1, headerX, cursorY, widthUsable);
				break;
			case Window_StatusStatBreakdown.KINDS.Custom:
				this.drawCustomBreakdown(actor, parameterKey, headerX, cursorY, widthUsable);
				break;
			default:
				this.drawText("No breakdown available for this stat.", headerX, cursorY, widthUsable, "left");
				break;
		}
	}
	/**
	* Resolves the kind from a registry parameter key.
	* @param {string} parameterKey The registry key.
	* @returns {string}
	*/
	resolveKind(parameterKey) {
		if (parameterKey === "mtp") return Window_StatusStatBreakdown.KINDS.Mtp;
		if (parameterKey === "cdm" || parameterKey === "cdr") return Window_StatusStatBreakdown.KINDS.Crit;
		if (ParameterKeys.bparamId(parameterKey) >= 0) return Window_StatusStatBreakdown.KINDS.Base;
		if (ParameterKeys.xparamId(parameterKey) >= 0) return Window_StatusStatBreakdown.KINDS.Ex;
		if (ParameterKeys.sparamId(parameterKey) >= 0) return Window_StatusStatBreakdown.KINDS.Special;
		return Window_StatusStatBreakdown.KINDS.Custom;
	}
	/**
	* Draws the b-param breakdown.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} longId The long id driving this step.
	* @param {number} x The x driving this step.
	* @param {number} y The y driving this step.
	* @param {number} w The w driving this step.
	* @returns {number}
	*/
	drawBParamBreakdown(actor, longId, x, y, w) {
		const paramId = longId;
		const baseNaturalOnly = actor.paramBaseNaturalBonuses(paramId);
		const baseWithNatural = actor.paramBase(paramId);
		const baseVanilla = baseWithNatural - baseNaturalOnly;
		const natGrowthPlus = actor.bParamGrowthPlus(paramId);
		const natGrowthRate = actor.bParamGrowthRate(paramId);
		const natGrowthDeltaRaw = this.calcPlusRate(actor, baseVanilla, natGrowthPlus, natGrowthRate);
		const natGrowthDelta = Math.round(natGrowthDeltaRaw);
		const natBuffPlus = actor.bParamBuffPlus(paramId);
		const natBuffRate = actor.bParamBuffRate(paramId);
		const natBuffDeltaRaw = this.calcPlusRate(actor, baseVanilla, natBuffPlus, natBuffRate);
		const natBuffDelta = Math.round(natBuffDeltaRaw);
		const baseNatural = baseVanilla + natGrowthDelta + natBuffDelta;
		const equipFlat = this.sumEquipBParamFlat(actor, paramId);
		const stateFlat = this.sumStateBParamFlat(actor, paramId);
		const trActor = this.paramRateFromTraits([actor.actor()], paramId);
		const trClass = this.paramRateFromTraits([actor.currentClass()], paramId);
		const trEquips = this.paramRateFromTraits(actor.equips().filter((equip) => !!equip), paramId);
		const trStates = this.paramRateFromTraits(actor.states(), paramId);
		const traitsProduct = trActor * trClass * trEquips * trStates;
		const preRateBase = baseNatural + (equipFlat + stateFlat);
		const traitsDelta = Math.round(preRateBase * (traitsProduct - 1));
		const totalWithSdp = actor.param(paramId);
		const sdpCore = this._sdpCoreCoefficients(actor, paramId);
		const preSdpBase = this._solvePreSdpBaseCore(totalWithSdp, sdpCore.k, sdpCore.c);
		const rawPanelDeltas = this._computeSdpCorePanelDeltas(preSdpBase, sdpCore.panels);
		const sdpPanelDeltas = rawPanelDeltas.filter((p) => p.delta !== 0);
		const sdpTotalDelta = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);
		let cursorY = y;
		const baseRows = [];
		baseRows.push({
			key: "Base (Actor/Class)",
			value: baseVanilla
		});
		if (natGrowthPlus !== 0 || natGrowthRate !== 0 || natGrowthDelta !== 0) {
			const growthText = this.formatPlusRate(natGrowthPlus, natGrowthRate, natGrowthDelta);
			baseRows.push({
				key: "+ Natural (Growths)",
				value: growthText
			});
		}
		if (natBuffPlus !== 0 || natBuffRate !== 0 || natBuffDelta !== 0) {
			const buffText = this.formatPlusRate(natBuffPlus, natBuffRate, natBuffDelta);
			baseRows.push({
				key: "+ Natural (Buffs)",
				value: buffText
			});
		}
		baseRows.push({
			key: "= Base (with NATURAL)",
			value: baseNatural
		});
		cursorY = this.drawSectionWithRows(x, cursorY, w, "Base", baseRows);
		const flatsRows = [];
		if (equipFlat !== 0) flatsRows.push({
			key: "+ Equips",
			value: equipFlat
		});
		if (stateFlat !== 0) flatsRows.push({
			key: "+ States",
			value: stateFlat
		});
		cursorY = this.drawSectionWithRows(x, cursorY, w, "Flats", flatsRows);
		const traitsRows = [];
		if (trActor !== 1) traitsRows.push({
			key: "× Actor",
			value: StatusHelper.toRateString(trActor)
		});
		if (trClass !== 1) traitsRows.push({
			key: "× Class",
			value: StatusHelper.toRateString(trClass)
		});
		if (trEquips !== 1) traitsRows.push({
			key: "× Equips",
			value: StatusHelper.toRateString(trEquips)
		});
		if (trStates !== 1) traitsRows.push({
			key: "× States",
			value: StatusHelper.toRateString(trStates)
		});
		if (traitsDelta !== 0) {
			const sign = traitsDelta >= 0 ? "+" : String.empty;
			traitsRows.push({
				key: "= Traits",
				value: `${sign}${traitsDelta}`
			});
		}
		cursorY = this.drawSectionWithRows(x, cursorY, w, "Traits (×)", traitsRows);
		if (sdpTotalDelta !== 0 && sdpPanelDeltas.length > 0) {
			const totalSign = sdpTotalDelta >= 0 ? "+" : String.empty;
			const totalText = `${totalSign}${sdpTotalDelta}`;
			cursorY = this.drawSdpPanelsSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Draws the x-param breakdown.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} xId The x id driving this step.
	* @param {number} x The x driving this step.
	* @param {number} y The y driving this step.
	* @param {number} w The w driving this step.
	* @returns {number}
	*/
	drawXParamBreakdown(actor, xId, x, y, w) {
		const isRegen = xId === 7 || xId === 8 || xId === 9;
		if (isRegen) {
			return this._drawXParamBreakdownRegen(actor, xId, x, y, w);
		}
		return this._drawXParamBreakdownPercent(actor, xId, x, y, w);
	}
	/**
	* Renders the xparam breakdown for the three repurposed regen stats (HRG/MRG/TRG).
	* These use flat native units and are displayed as "per 5s" values for readability.
	* The section includes Baseline, Natural (growth), Natural (buffs), Traits (+), and SDP (Panels).
	* @param {Game_Actor} actor The actor whose regen xparam is being explained.
	* @param {number} xId The xparam id (7=HRG, 8=MRG, 9=TRG).
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this breakdown section.
	*/
	_drawXParamBreakdownRegen(actor, xId, x, y, w) {
		const common = this._gatherXparamCommon(actor, xId);
		const addActorDec = common.adds.actor;
		const addClassDec = common.adds.class;
		const addEquipsDec = common.adds.equips;
		const addStatesDec = common.adds.states;
		const { natGrowthDelta } = common;
		const { totalWithSdp } = common;
		const toNativeFromEditorDec = (v) => v * 100;
		const normalizeNaturalNative = (n) => {
			if (n === 0) return 0;
			const abs = Math.abs(n);
			return abs < 1 ? n * 100 : n;
		};
		const natBuffDeltaRaw = this.calcPlusRate(actor, 0, actor.xParamBuffPlus(xId), actor.xParamBuffRate(xId));
		const natGrowthDeltaNative = normalizeNaturalNative(natGrowthDelta);
		const natBuffDeltaNative = normalizeNaturalNative(natBuffDeltaRaw);
		const rSdp = this._computeNonCoreSdpContributionRegen(actor, xId, 8, totalWithSdp);
		const { sdpPanelDeltas } = rSdp;
		const sdpTotalFlat = rSdp.sdpTotal;
		let cursorY = y;
		cursorY = this.drawSectionTitle(x, cursorY, w, "Baseline");
		this.drawKeyValue(x + 12, cursorY, w - 12, "Baseline", this.formatPerFiveFlat(0), "left");
		cursorY += this.lineHeight() + 6;
		if (natGrowthDeltaNative !== 0) {
			cursorY = this.drawSectionTitle(x, cursorY, w, "Natural");
			const growthText = this.formatPlusRatePerFive(natGrowthDeltaNative, actor.xParamGrowthRate(xId));
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Growths)", growthText, "left");
			cursorY += this.lineHeight() + 6;
		}
		if (natBuffDeltaNative !== 0) {
			const buffText = this.formatSignedFlatPerFive(natBuffDeltaNative);
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Buffs)", buffText, "left");
			cursorY += this.lineHeight() + 6;
		}
		const traitRows = [
			{
				key: "+ Actor",
				valueNative: toNativeFromEditorDec(addActorDec)
			},
			{
				key: "+ Class",
				valueNative: toNativeFromEditorDec(addClassDec)
			},
			{
				key: "+ Equips",
				valueNative: toNativeFromEditorDec(addEquipsDec)
			},
			{
				key: "+ States",
				valueNative: toNativeFromEditorDec(addStatesDec)
			}
		].filter((r) => r.valueNative !== 0).map((r) => ({
			key: r.key,
			value: this.formatPerFiveFlat(r.valueNative)
		}));
		cursorY = this.drawSectionWithRows(x, cursorY, w, "Traits (+)", traitRows);
		if (sdpPanelDeltas.length > 0 && sdpTotalFlat !== 0) {
			const totalText = this.formatSignedFlatPerFive(sdpTotalFlat);
			cursorY = this.drawSdpPanelsFlatPerFiveSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Renders the xparam breakdown for standard percent-based xparams.
	* These are displayed in percent space (e.g., +4.0%).
	* The section includes Baseline, Natural (growths), Natural (buffs), Traits (+), and SDP (Panels).
	* @param {Game_Actor} actor The actor whose xparam is being explained.
	* @param {number} xId The xparam id (0..9), excluding the regen ids 7/8/9.
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this breakdown section.
	*/
	_drawXParamBreakdownPercent(actor, xId, x, y, w) {
		const common = this._gatherXparamCommon(actor, xId);
		const addActor = common.adds.actor;
		const addClass = common.adds.class;
		const addEquips = common.adds.equips;
		const addStates = common.adds.states;
		const { natGrowthDelta } = common;
		const { totalWithSdp } = common;
		const natBuffDeltaDec = this.calcPlusRate(actor, 0, actor.xParamBuffPlus(xId), actor.xParamBuffRate(xId));
		const xSdp = this._computeNonCoreSdpContribution(actor, xId, 8, totalWithSdp);
		const { sdpPanelDeltas } = xSdp;
		const { sdpTotal } = xSdp;
		let cursorY = y;
		cursorY = this.drawSectionTitle(x, cursorY, w, "Baseline");
		this.drawKeyValue(x + 12, cursorY, w - 12, "Baseline", StatusHelper.toPercentString(0, false), "left");
		cursorY += this.lineHeight() + 6;
		if (natGrowthDelta !== 0) {
			cursorY = this.drawSectionTitle(x, cursorY, w, "Natural");
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Growths)", StatusHelper.toPercentString(natGrowthDelta * 100, true), "left");
			cursorY += this.lineHeight() + 6;
		}
		if (natBuffDeltaDec !== 0) {
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Buffs)", StatusHelper.toPercentString(natBuffDeltaDec * 100, true), "left");
			cursorY += this.lineHeight() + 6;
		}
		const traitRows = [
			{
				key: "+ Actor",
				value: addActor
			},
			{
				key: "+ Class",
				value: addClass
			},
			{
				key: "+ Equips",
				value: addEquips
			},
			{
				key: "+ States",
				value: addStates
			}
		].filter((r) => r.value !== 0).map((r) => ({
			key: r.key,
			value: StatusHelper.toPercentString(r.value * 100, true)
		}));
		cursorY = this.drawSectionWithRows(x, cursorY, w, "Traits (+)", traitRows);
		if (sdpTotal !== 0 && sdpPanelDeltas.length > 0) {
			const totalText = StatusHelper.toPercentString(sdpTotal * 100, true);
			cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Gathers the common xparam inputs used by both regen and percent renderers.
	* Returns trait adds by source, the NATURAL delta against a 0.0 base, and the
	* post-SDP total (for solving SDP pre-base in the caller).
	* @param {Game_Actor} actor The actor.
	* @param {number} xId The xparam id (0..9).
	* @returns {{ adds:{actor:number,class:number,equips:number,states:number}, natGrowthDelta:number, totalWithSdp:number }}
	*/
	_gatherXparamCommon(actor, xId) {
		const addActor = this.xparamAddFromTraits([actor.actor()], xId);
		const addClass = this.xparamAddFromTraits([actor.currentClass()], xId);
		const addEquips = this.xparamAddFromTraits(actor.equips().filter((e) => !!e), xId);
		const addStates = this.xparamAddFromTraits(actor.states(), xId);
		const natGrowthDelta = this.calcPlusRate(actor, 0, actor.xParamGrowthPlus(xId), actor.xParamGrowthRate(xId));
		const totalWithSdp = actor.xparam(xId);
		return {
			adds: {
				actor: addActor,
				class: addClass,
				equips: addEquips,
				states: addStates
			},
			natGrowthDelta,
			totalWithSdp
		};
	}
	/**
	* Draws the s-param breakdown.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} sId The s id driving this step.
	* @param {number} x The x driving this step.
	* @param {number} y The y driving this step.
	* @param {number} w The w driving this step.
	* @returns {number}
	*/
	drawSParamBreakdown(actor, sId, x, y, w) {
		const rActor = this.sparamRateFromTraits([actor.actor()], sId);
		const rClass = this.sparamRateFromTraits([actor.currentClass()], sId);
		const rEquips = this.sparamRateFromTraits(actor.equips().filter((equip) => !!equip), sId);
		const rStates = this.sparamRateFromTraits(actor.states(), sId);
		const natGrowthPlus = actor.sParamGrowthPlus(sId);
		const natGrowthRate = actor.sParamGrowthRate(sId);
		const growthDeltaPct = actor.calculatePlusRate(1, natGrowthPlus, natGrowthRate);
		const natBuffPlus = actor.sParamBuffPlus(sId);
		const natBuffRate = actor.sParamBuffRate(sId);
		const buffDeltaPct = actor.calculatePlusRate(1, natBuffPlus, natBuffRate);
		const natGrowthMult = (natGrowthRate + 100) / 100;
		const product = rActor * rClass * rEquips * rStates * natGrowthMult;
		const deltaPct = (product - 1) * 100;
		const totalWithSdp = actor.sparam(sId);
		const sSdp = this._computeNonCoreSdpContribution(actor, sId, 18, totalWithSdp);
		const { sdpPanelDeltas } = sSdp;
		const sdpTotalDec = sSdp.sdpTotal;
		let cursorY = y;
		cursorY = this.drawSectionTitle(x, cursorY, w, "Baseline");
		this.drawKeyValue(x + 12, cursorY, w - 12, "Baseline", StatusHelper.toRateString(1), "left");
		cursorY += this.lineHeight() + 6;
		if (natGrowthPlus !== 0 || natGrowthRate !== 0 || growthDeltaPct !== 0) {
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Growths)", StatusHelper.toPercentString(growthDeltaPct, true), "left");
			cursorY += this.lineHeight() + 6;
		}
		if (natBuffPlus !== 0 || natBuffRate !== 0 || buffDeltaPct !== 0) {
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Buffs)", StatusHelper.toPercentString(buffDeltaPct, true), "left");
			cursorY += this.lineHeight() + 6;
		}
		const showActor = rActor !== 1;
		const showClass = rClass !== 1;
		const showEquips = rEquips !== 1;
		const showStates = rStates !== 1;
		const anyTraits = showActor || showClass || showEquips || showStates;
		if (anyTraits) {
			cursorY = this.drawSectionTitle(x, cursorY, w, "Traits (×)");
			if (showActor) {
				this.drawKeyValue(x + 12, cursorY, w - 12, "× Actor", StatusHelper.toRateString(rActor), "left");
				cursorY += this.lineHeight();
			}
			if (showClass) {
				this.drawKeyValue(x + 12, cursorY, w - 12, "× Class", StatusHelper.toRateString(rClass), "left");
				cursorY += this.lineHeight();
			}
			if (showEquips) {
				this.drawKeyValue(x + 12, cursorY, w - 12, "× Equips", StatusHelper.toRateString(rEquips), "left");
				cursorY += this.lineHeight();
			}
			if (showStates) {
				this.drawKeyValue(x + 12, cursorY, w - 12, "× States", StatusHelper.toRateString(rStates), "left");
				cursorY += this.lineHeight();
			}
			if (deltaPct !== 0) {
				this.drawKeyValue(x + 12, cursorY, w - 12, "= Total", StatusHelper.toPercentString(deltaPct, true), "left");
				cursorY += this.lineHeight();
			}
			cursorY += 6;
		}
		const anySdp = sdpTotalDec !== 0 && sdpPanelDeltas.length > 0;
		if (anySdp) {
			const totalText = StatusHelper.toPercentString(sdpTotalDec * 100, true);
			cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Draws the max tp breakdown.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} x The x driving this step.
	* @param {number} y The y driving this step.
	* @param {number} w The w driving this step.
	* @returns {number}
	*/
	drawMtpBreakdown(actor, x, y, w) {
		const baseMaxTp = actor.getBaseMaxTp();
		const natGrowthPlus = actor.maxTpGrowthPlus();
		const natGrowthRate = actor.maxTpGrowthRate();
		const growthDeltaRaw = this.calcPlusRate(actor, baseMaxTp, natGrowthPlus, natGrowthRate);
		const growthDelta = Math.round(growthDeltaRaw);
		const natBuffPlus = actor.maxTpBuffPlus ? actor.maxTpBuffPlus() : 0;
		const natBuffRate = actor.maxTpBuffRate ? actor.maxTpBuffRate() : 0;
		const buffDeltaRaw = this.calcPlusRate(actor, baseMaxTp, natBuffPlus, natBuffRate);
		const buffDelta = Math.round(buffDeltaRaw);
		const totalWithSdp = actor.maxTp();
		const sdp = this._sdpCoreCoefficients(actor, 30);
		const preSdpBase = this._solvePreSdpBaseCore(totalWithSdp, sdp.k, sdp.c);
		const rawPanelDeltas = this._computeSdpCorePanelDeltas(preSdpBase, sdp.panels);
		const sdpPanelDeltas = rawPanelDeltas.filter((p) => p.delta !== 0);
		const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);
		let cursorY = y;
		cursorY = this.drawSectionTitle(x, cursorY, w, "Base");
		this.drawKeyValue(x + 12, cursorY, w - 12, "Base (Actor/Class)", baseMaxTp, "left");
		cursorY += this.lineHeight();
		if (natGrowthPlus !== 0 || natGrowthRate !== 0 || growthDelta !== 0) {
			const growthText = this.formatPlusRate(natGrowthPlus, natGrowthRate, growthDelta);
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Growths)", growthText, "left");
			cursorY += this.lineHeight();
		}
		if (natBuffPlus !== 0 || natBuffRate !== 0 || buffDelta !== 0) {
			const buffText = this.formatPlusRate(natBuffPlus, natBuffRate, buffDelta);
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Buffs)", buffText, "left");
			cursorY += this.lineHeight();
		}
		cursorY += 6;
		const anySdp = sdpTotal !== 0 && sdpPanelDeltas.length > 0;
		if (anySdp) {
			const totalSign = sdpTotal >= 0 ? "+" : String.empty;
			const totalText = `${totalSign}${sdpTotal}`;
			cursorY = this.drawSdpPanelsSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Draws the crit breakdown (28 = Crit Amp, 29 = Crit Block).
	* @param {Game_Actor} actor The actor.
	* @param {number} critId 0 for amp (28), 1 for block (29).
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} w The width available.
	* @returns {number}
	*/
	drawCritBreakdown(actor, critId, x, y, w) {
		const isAmp = critId === 0;
		const base = isAmp ? actor.baseCriticalMultiplier() : actor.baseCriticalReduction();
		const notes = isAmp ? actor.getCriticalDamageMultiplier() : actor.getCriticalDamageReduction();
		const totalWithSdp = isAmp ? actor.criticalDamageMultiplier() : actor.criticalDamageReduction();
		const cSdp = this._computeNonCoreSdpContribution(actor, critId, 28, totalWithSdp);
		const { sdpPanelDeltas } = cSdp;
		const sdpTotalDec = cSdp.sdpTotal;
		let cursorY = y;
		cursorY = this.drawSectionTitle(x, cursorY, w, "Baseline");
		this.drawKeyValue(x + 12, cursorY, w - 12, "Baseline", StatusHelper.toPercentString(base * 100, false), "left");
		cursorY += this.lineHeight() + 6;
		const growthPlus = isAmp ? actor.cdmPlus() : actor.cdrPlus();
		const growthRate = isAmp ? actor.cdmRate() : actor.cdrRate();
		const growthDelta = actor.calculatePlusRate(base, growthPlus, growthRate);
		if (growthPlus !== 0 || growthRate !== 0 || growthDelta !== 0) {
			console.log("growthPlus", growthPlus);
			console.log("growthRate", growthRate);
			console.log("growthDelta", growthDelta);
			cursorY = this.drawSectionTitle(x, cursorY, w, "Natural");
			const growthText = this.formatPlusRatePercent(growthPlus, growthRate, growthDelta);
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Growths)", growthText, "left");
			cursorY += this.lineHeight() + 6;
		}
		const notesSources = actor.getAllNotes();
		const buffPlusRegex = isAmp ? J.CRIT.RegExp.CritDamageMultiplierBuffPlus : J.CRIT.RegExp.CritDamageReductionBuffPlus;
		const buffPlusSum = RPGManager.getSumFromAllNotesByRegex(notesSources, buffPlusRegex);
		const buffRateRegex = isAmp ? J.CRIT.RegExp.CritDamageMultiplierBuffRate : J.CRIT.RegExp.CritDamageReductionBuffRate;
		const buffRateSum = RPGManager.getSumFromAllNotesByRegex(notesSources, buffRateRegex);
		const buffDelta = actor.calculatePlusRate(base, buffPlusSum, buffRateSum);
		if (buffPlusSum !== 0 || buffRateSum !== 0 || buffDelta !== 0) {
			const buffText = this.formatPlusRatePercent(buffPlusSum, buffRateSum, buffDelta);
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Natural (Buffs)", buffText, "left");
			cursorY += this.lineHeight() + 6;
		}
		if (notes !== 0) {
			cursorY = this.drawSectionTitle(x, cursorY, w, "Notes");
			this.drawKeyValue(x + 12, cursorY, w - 12, "+ Notes", StatusHelper.toPercentString(notes, true), "left");
			cursorY += this.lineHeight() + 6;
		}
		if (sdpPanelDeltas.length > 0 && sdpTotalDec !== 0) {
			const totalText = StatusHelper.toPercentString(sdpTotalDec * 100, true);
			cursorY = this.drawSdpPanelsPercentSection(x, cursorY, w, totalText, sdpPanelDeltas);
		}
		return cursorY + 10;
	}
	/**
	* Draws a breakdown for custom long parameters that don’t fit the base/x/s/crit/mtp families.
	* Currently supported custom params:
	* - 31: Move Speed Boost (MSB)
	* - 32: Skill Proficiency Boost (SPB)
	* - 33: SDP Multiplier Bonus (SMB)
	* @param {Game_Actor} actor The actor whose stat is being explained.
	* @param {string} parameterKey The registry key to render.
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this section.
	*/
	drawCustomBreakdown(actor, parameterKey, x, y, w) {
		if (parameterKey === "msb") {
			return this._drawMsbBreakdown(actor, x, y, w);
		}
		if (parameterKey === "prof") {
			return this._drawSpbBreakdown(actor, x, y, w);
		}
		if (parameterKey === "sdr") {
			return this._drawSmbBreakdown(actor, x, y, w);
		}
		return this.drawSectionWithRows(x, y, w, "Details", [{
			key: "Info",
			value: "No breakdown available for this custom stat."
		}]);
	}
	/**
	* Builds SDP percent (k) and flat (c) coefficients for core params (incl. MTP=30),
	* and collects per-panel rows including icon and rarity.
	* @param {Game_Actor} actor The actor.
	* @param {number} paramId The core param id (0..7) or 30 for MTP.
	* @returns {{k:number,c:number,panels:Array}}
	*/
	_sdpCoreCoefficients(actor, paramId) {
		let k = 0;
		let c = 0;
		const rows = [];
		const rankings = actor.getAllSdpRankings();
		rankings.forEach((ranking) => {
			const panel = J.SDP.Metadata.panelsMap.get(ranking.key);
			if (!panel) return;
			const parameterKey = ParameterKeys.bparamKey(paramId);
			const panelParams = panel.getPanelParameterByKey(parameterKey);
			if (!panelParams.length) return;
			panelParams.forEach((pp) => {
				const { name } = panel;
				const { iconIndex } = panel;
				const { rarity } = panel;
				const { isFlat } = pp;
				const { perRank } = pp;
				const curRank = ranking.currentRank;
				if (isFlat) {
					const flat = curRank * perRank;
					c += flat;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: true,
						amount: flat
					});
				} else {
					const pct = curRank * perRank / 100;
					k += pct;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: false,
						amount: pct
					});
				}
			});
		});
		return {
			k,
			c,
			panels: rows
		};
	}
	/**
	* Computes each core panel's exact delta against the pre‑SDP base.
	* Floors percent pieces to match J.SDP’s behavior for core params.
	* Carries icon/rarity for rendering.
	* @param {number} basePreSdp The pre-SDP base value.
	* @param {Array} rows The rows from _sdpCoreCoefficients().
	* @returns {{name:string,delta:number,iconIndex:number,rarity:number}[]}
	*/
	_computeSdpCorePanelDeltas(basePreSdp, rows) {
		const deltas = [];
		rows.forEach((row) => {
			const { name } = row;
			const { iconIndex } = row;
			const { rarity } = row;
			let delta;
			let rateDec = 0;
			if (row.isFlat) {
				delta = row.amount;
			} else {
				const pct = row.amount;
				delta = Math.floor(basePreSdp * pct);
				rateDec = pct;
			}
			deltas.push({
				name,
				delta,
				iconIndex,
				rarity,
				...rateDec !== 0 ? { rateDec } : {}
			});
		});
		return deltas;
	}
	/**
	* Builds SDP coefficients for non-core params (x/s) using an id offset.
	* Includes icon and rarity for rendering.
	* For xparams use idExtra=8, for sparams use idExtra=18.
	* @param {Game_Actor} actor The actor.
	* @param {number} subId The x/s id (0..9).
	* @param {number} idExtra The offset into panel parameter ids.
	* @returns {{k:number,c:number,panels:Array}}
	*/
	_sdpNonCoreCoefficients(actor, subId, idExtra) {
		let k = 0;
		let c = 0;
		const rows = [];
		const rankings = actor.getAllSdpRankings();
		rankings.forEach((ranking) => {
			const panel = J.SDP.Metadata.panelsMap.get(ranking.key);
			if (!panel) return;
			const parameterKey = ParameterKeys.legacyLongParamKey(subId + idExtra);
			const panelParams = panel.getPanelParameterByKey(parameterKey);
			if (!panelParams.length) return;
			panelParams.forEach((pp) => {
				const { name } = panel;
				const iconIndex = panel.iconIndex | 0;
				const rarity = panel.getPanelRarityColorIndex();
				const { isFlat } = pp;
				const { perRank } = pp;
				const curRank = ranking.currentRank;
				if (isFlat) {
					const add = curRank * perRank / 100;
					c += add;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: true,
						amount: add
					});
				} else {
					const pct = curRank * perRank / 100;
					k += pct;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: false,
						amount: pct
					});
				}
			});
		});
		return {
			k,
			c,
			panels: rows
		};
	}
	/**
	* Builds SDP coefficients for regen xparams (7/8/9) using id offset 8.
	* Flats are native units (not divided by 100). Percents remain decimal.
	* @param {Game_Actor} actor The actor.
	* @param {number} subId The xparam id (7,8,9).
	* @param {number} idExtra The offset (8 for xparams).
	* @returns {{k:number,c:number,panels:Array}}
	*/
	_sdpNonCoreCoefficientsRegen(actor, subId, idExtra) {
		let k = 0;
		let c = 0;
		const rows = [];
		const rankings = actor.getAllSdpRankings();
		rankings.forEach((ranking) => {
			const panel = J.SDP.Metadata.panelsMap.get(ranking.key);
			if (!panel) return;
			const parameterKey = ParameterKeys.legacyLongParamKey(subId + idExtra);
			const panelParams = panel.getPanelParameterByKey(parameterKey);
			if (!panelParams.length) return;
			panelParams.forEach((pp) => {
				const { name } = panel;
				const iconIndex = panel.iconIndex | 0;
				const rarity = panel.getPanelRarityColorIndex();
				const { isFlat } = pp;
				const { perRank } = pp;
				const curRank = ranking.currentRank;
				if (isFlat) {
					const add = curRank * perRank;
					c += add;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: true,
						amount: add
					});
				} else {
					const pct = curRank * perRank / 100;
					k += pct;
					rows.push({
						name,
						iconIndex,
						rarity,
						isFlat: false,
						amount: pct
					});
				}
			});
		});
		return {
			k,
			c,
			panels: rows
		};
	}
	/**
	* Computes the regen (HRG/MRG/TRG) SDP contribution in native flat units.
	* @param {Game_Actor} actor The actor.
	* @param {number} subId The xparam id (7,8,9).
	* @param {number} idExtra The offset (8 for xparams).
	* @param {number} totalWithSdp The final value including SDP (native units).
	* @returns {{ sdpPanelDeltas: {name:string,delta:number,iconIndex:number,rarity:number}[], sdpTotal: number }}
	*/
	_computeNonCoreSdpContributionRegen(actor, subId, idExtra, totalWithSdp) {
		const sdp = this._sdpNonCoreCoefficientsRegen(actor, subId, idExtra);
		const preSdpBase = this._solvePreSdpBaseNonCore(totalWithSdp, sdp.k, sdp.c);
		const rawPanelDeltas = this._computeSdpNonCorePanelDeltas(preSdpBase, sdp.panels);
		const sdpPanelDeltas = rawPanelDeltas.filter((p) => p.delta !== 0);
		const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);
		return {
			sdpPanelDeltas,
			sdpTotal
		};
	}
	/**
	* Computes each non-core panel's exact delta against a pre‑SDP base (no floors).
	* Returns icon/rarity for rendering.
	* @param {number} basePreSdp The pre-SDP base value (x/s param before SDP).
	* @param {Array} rows The rows from _sdpNonCoreCoefficients().
	* @returns {{name:string,delta:number,iconIndex:number,rarity:number}[]}
	*/
	_computeSdpNonCorePanelDeltas(basePreSdp, rows) {
		const deltas = [];
		rows.forEach((row) => {
			const { name } = row;
			const iconIndex = row.iconIndex | 0;
			const rarity = row.rarity | 0;
			let delta;
			let rateDec = 0;
			if (row.isFlat) {
				delta = row.amount;
			} else {
				const pct = row.amount;
				delta = basePreSdp * pct;
				rateDec = pct;
			}
			deltas.push({
				name,
				delta,
				iconIndex,
				rarity,
				...rateDec !== 0 ? { rateDec } : {}
			});
		});
		return deltas;
	}
	/**
	* Computes the non-core SDP contribution for a given subId/offset and total.
	* Returns both the filtered per-panel rows and the net decimal total.
	* Example: a return total of 0.04 represents +4%.
	* @param {Game_Actor} actor The actor.
	* @param {number} subId The x/s/crit sub-id (x:0..9, s:0..9, crit:0..1).
	* @param {number} idExtra The offset to map into panel parameter ids (x:+8, s:+18, crit:+28).
	* @param {number} totalWithSdp The final value including SDP.
	* @returns {{ sdpPanelDeltas: {name:string,delta:number,iconIndex:number,rarity:number}[], sdpTotal: number }}
	*/
	_computeNonCoreSdpContribution(actor, subId, idExtra, totalWithSdp) {
		const sdp = this._sdpNonCoreCoefficients(actor, subId, idExtra);
		const preSdpBase = this._solvePreSdpBaseNonCore(totalWithSdp, sdp.k, sdp.c);
		const rawPanelDeltas = this._computeSdpNonCorePanelDeltas(preSdpBase, sdp.panels);
		const sdpPanelDeltas = rawPanelDeltas.filter((p) => p.delta !== 0);
		const sdpTotal = sdpPanelDeltas.reduce((n, p) => n + p.delta, 0);
		return {
			sdpPanelDeltas,
			sdpTotal
		};
	}
	/**
	* Solves for the pre‑SDP base for core params using T = B*(1+K) + C.
	* @param {number} totalWithSdp The final actor value including SDP.
	* @param {number} k The percent coefficient sum (as decimal).
	* @param {number} c The flat coefficient sum.
	* @returns {number}
	*/
	_solvePreSdpBaseCore(totalWithSdp, k, c) {
		const numerator = totalWithSdp - c;
		const denom = 1 + k;
		const base = denom !== 0 ? Math.round(numerator / denom) : 0;
		return Math.max(0, base);
	}
	/**
	* Solves for the pre‑SDP base for non-core params using T = B*(1+K) + C.
	* @param {number} totalWithSdp The final actor value including SDP.
	* @param {number} k The percent coefficient sum (as decimal).
	* @param {number} c The flat coefficient sum (already in decimal space).
	* @returns {number}
	*/
	_solvePreSdpBaseNonCore(totalWithSdp, k, c) {
		const numerator = totalWithSdp - c;
		const denom = 1 + k;
		const base = denom !== 0 ? numerator / denom : 0;
		return Math.max(0, base);
	}
	/**
	* Draws a single SDP panel entry (icon + colored name + right-aligned value).
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} w The width available.
	* @param {string} name The panel name.
	* @param {number} iconIndex The icon index to draw.
	* @param {number} rarityColorIndex The ColorManager index for rarity.
	* @param {string} valueText The right-aligned value text to draw.
	*/
	drawSdpPanelEntry(x, y, w, name, iconIndex, rarityColorIndex, valueText) {
		const safeIcon = iconIndex | 0;
		const safeRarity = rarityColorIndex | 0;
		this.drawIcon(safeIcon, x, y + 2);
		const nameX = x + 36;
		const nameW = Math.floor(w * .6) - 36;
		this.changeTextColor(ColorManager.textColor(safeRarity));
		this.drawText(name, nameX, y, nameW, "left");
		this.resetTextColor();
		this.drawText(valueText, x, y, w, "right");
	}
	/**
	* An SDP (Panels) section renderer for regen showing flat values per 5s.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width.
	* @param {string} totalValueText The right-aligned signed total in per‑5s units.
	* @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows.
	* @returns {number} The next y after drawing (or unchanged if skipped).
	*/
	drawSdpPanelsFlatPerFiveSection(x, y, w, totalValueText, panels) {
		const anyPanels = panels && panels.length > 0;
		if (!anyPanels) {
			return y;
		}
		let cursorY = this.drawSectionTitle(x, y, w, "SDP (Panels)");
		this.drawKeyValue(x + 12, cursorY, w - 12, "+ Total ", totalValueText, "left");
		cursorY += this.lineHeight();
		panels.forEach((panel) => {
			const { name } = panel;
			const { iconIndex } = panel;
			const { rarity } = panel;
			let valueText;
			if (panel.rateDec) {
				const pctText = StatusHelper.toPercentString(panel.rateDec * 100, true);
				const flatText = this.formatSignedFlatPerFive(panel.delta);
				valueText = `${pctText} (${flatText})`;
			} else {
				valueText = this.formatSignedFlatPerFive(panel.delta);
			}
			this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);
			cursorY += this.lineHeight();
		});
		cursorY += 6;
		return cursorY;
	}
	/**
	* Formats a native flat value as a per‑5s display string, with simple rounding.
	* Example: native 6 → "1.2" (per 5 seconds).
	* @param {number} nativeFlat The native flat amount (pre‑division).
	* @returns {string}
	*/
	formatPerFiveFlat(nativeFlat) {
		const perFive = nativeFlat / 5;
		const text = perFive.toFixed(1);
		return text;
	}
	/**
	* Formats a native flat delta as a signed per‑5s string (ex: "+1.2").
	* @param {number} nativeFlat The native flat delta (pre‑division).
	* @returns {string}
	*/
	formatSignedFlatPerFive(nativeFlat) {
		const sign = nativeFlat >= 0 ? "+" : String.empty;
		const absPerFive = this.formatPerFiveFlat(Math.abs(nativeFlat));
		return `${sign}${absPerFive}`;
	}
	/**
	* Formats NATURAL growth for regen as "<rate%> → +<per5s>" where the delta
	* is expressed as per‑5s. Example: "+20% → +0.6".
	* @param {number} deltaNative The computed delta in native flat units.
	* @param {number} ratePercent The growth rate percent (for display only).
	* @returns {string}
	*/
	formatPlusRatePerFive(deltaNative, ratePercent) {
		const rateText = StatusHelper.toPercentString(ratePercent, true);
		const deltaText = this.formatSignedFlatPerFive(deltaNative);
		return `${rateText} → ${deltaText}`;
	}
	/**
	* Formats a pair of inputs (plus, rate) and the solved percent delta into
	* a compact string: "+Plus%, +Rate% → +Delta%".
	* @param {number} plus The flat percent-points input (e.g., 15 for +15%).
	* @param {number} rate The multiplier percent input (e.g., 20 for +20%).
	* @param {number} delta The solved percent-points delta (may be fractional).
	* @returns {string}
	*/
	formatPlusRatePercent(plus, rate, delta) {
		const plusText = StatusHelper.toPercentString(plus, true);
		const rateText = StatusHelper.toPercentString(rate, true);
		const deltaText = StatusHelper.toPercentString(delta, true);
		return `${plusText}, ${rateText} → ${deltaText}`;
	}
	/**
	* Renders the breakdown for Move Speed Boost (longId 31).
	* Source is equips/states only via the `jabsSpeedBoost` note property.
	* Values are whole-number bonuses (Page 1 shows this as a raw number, not a percent).
	* @param {Game_Actor} actor The actor whose stat is being explained.
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this section.
	*/
	_drawMsbBreakdown(actor, x, y, w) {
		const equipTotal = (actor.equippedEquips() || []).filter((e) => !!e).reduce((n, e) => n + (e.jabsSpeedBoost | 0), 0);
		const stateTotal = (actor.states() || []).filter((s) => !!s).reduce((n, s) => n + (s.jabsSpeedBoost | 0), 0);
		const total = equipTotal + stateTotal;
		const rows = [];
		rows.push({
			key: "Baseline",
			value: 0
		});
		if (equipTotal !== 0) rows.push({
			key: "+ Equips",
			value: equipTotal
		});
		if (stateTotal !== 0) rows.push({
			key: "+ States",
			value: stateTotal
		});
		rows.push({
			key: "= Total",
			value: total
		});
		return this.drawSectionWithRows(x, y, w, "Sources (Equips/States)", rows);
	}
	/**
	* Renders the breakdown for Skill Proficiency Boost (longId 32).
	* Source is equips/states only via `J.PROF.RegExp.ProficiencyBonus`.
	* Values are flat integers (added directly to skill proficiency gains).
	* @param {Game_Actor} actor The actor whose stat is being explained.
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this section.
	*/
	_drawSpbBreakdown(actor, x, y, w) {
		const eq = RPGManager.getSumFromAllNotesByRegex(actor.equippedEquips().filter((e) => !!e), J.PROF.RegExp.ProficiencyBonus);
		const st = RPGManager.getSumFromAllNotesByRegex(actor.states().filter((s) => !!s), J.PROF.RegExp.ProficiencyBonus);
		const total = eq + st;
		const rows = [];
		rows.push({
			key: "Baseline",
			value: 0
		});
		if (eq !== 0) rows.push({
			key: "+ Equips",
			value: eq
		});
		if (st !== 0) rows.push({
			key: "+ States",
			value: st
		});
		rows.push({
			key: "= Total",
			value: total
		});
		return this.drawSectionWithRows(x, y, w, "Sources (Equips/States)", rows);
	}
	/**
	* Renders the breakdown for SDP Multiplier Bonus (longId 33).
	* Source is equips/states only via `J.SDP.RegExp.SdpMultiplier`.
	* Rows render in percent points around a 100% baseline; Page 1 shows factor (total/100).
	* @param {Game_Actor} actor The actor whose stat is being explained.
	* @param {number} x The x coordinate to start drawing.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width available to draw within.
	* @returns {number} The next y position after finishing this section.
	*/
	_drawSmbBreakdown(actor, x, y, w) {
		const eqPct = RPGManager.getSumFromAllNotesByRegex(actor.equippedEquips().filter((e) => !!e), J.SDP.RegExp.SdpMultiplier);
		const stPct = RPGManager.getSumFromAllNotesByRegex(actor.states().filter((s) => !!s), J.SDP.RegExp.SdpMultiplier);
		const basePct = 100;
		const totalPct = basePct + eqPct + stPct;
		const formatFactor = (n) => {
			if (Math.abs(n) < 1) {
				return n.toFixed(2);
			}
			if (Number.isInteger(n)) {
				return `${n}`;
			}
			const txt = n.toFixed(2);
			return txt.endsWith(".00") ? txt.slice(0, -3) : txt;
		};
		const formatSignedFactor = (n) => {
			const sign = n >= 0 ? "+" : String.empty;
			return `${sign}${formatFactor(Math.abs(n))}`;
		};
		const baseFactor = basePct / 100;
		const eqFactor = eqPct / 100;
		const stFactor = stPct / 100;
		const totalFactor = totalPct / 100;
		const rows = [];
		rows.push({
			key: "Baseline",
			value: formatFactor(baseFactor)
		});
		if (eqPct !== 0) {
			rows.push({
				key: "+ Equips",
				value: formatSignedFactor(eqFactor)
			});
		}
		if (stPct !== 0) {
			rows.push({
				key: "+ States",
				value: formatSignedFactor(stFactor)
			});
		}
		rows.push({
			key: "= Total",
			value: formatFactor(totalFactor)
		});
		return this.drawSectionWithRows(x, y, w, "Sources (Equips/States)", rows);
	}
	/**
	* Calculates the amount to add to a parameter.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} base The base driving this step.
	* @param {number} plus The plus driving this step.
	* @param {number} rate The rate driving this step.
	* @returns {number}
	*/
	calcPlusRate(actor, base, plus, rate) {
		const computed = actor.calculatePlusRate(base, plus, rate);
		return computed;
	}
	/**
	* Formats the plus and rate into a readable string.
	* @param {number} plus The plus driving this step.
	* @param {number} rate The rate driving this step.
	* @param {number} delta The delta driving this step.
	* @returns {string}
	*/
	formatPlusRate(plus, rate, delta) {
		const plusSign = plus >= 0 ? "+" : String.empty;
		const deltaSign = delta >= 0 ? "+" : String.empty;
		const rateText = StatusHelper.toPercentString(rate, true);
		return `${plusSign}${plus}, ${rateText} → ${deltaSign}${Math.round(delta)}`;
	}
	/**
	* Sums the flat bonus parameter from equips.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} paramId The param id driving this step.
	* @returns {number}
	*/
	sumEquipBParamFlat(actor, paramId) {
		let total = 0;
		actor.equips().forEach((equip) => {
			if (!equip) return;
			const arr = equip.params;
			total += arr ? arr[paramId] | 0 : 0;
		});
		return total;
	}
	/**
	* Sums the flat bonus parameter from states.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {number} paramId The param id driving this step.
	* @returns {number}
	*/
	sumStateBParamFlat(actor, paramId) {
		let total = 0;
		actor.states().forEach((state) => {
			if (!state) return;
			const arr = state.params;
			total += arr ? arr[paramId] | 0 : 0;
		});
		return total;
	}
	/**
	* Determines the b-param bonuses from traits.
	* @param {RPG_Traited[]} objs The objs driving this step.
	* @param {number} paramId The param id driving this step.
	* @returns {number}
	*/
	paramRateFromTraits(objs, paramId) {
		const CODE = Game_BattlerBase.TRAIT_PARAM;
		let rate = 1;
		objs.forEach((source) => {
			if (!source || !source.traits) return;
			source.traits.forEach((trait) => {
				if (trait.code === CODE && trait.dataId === paramId) {
					rate *= trait.value;
				}
			});
		});
		return rate;
	}
	/**
	* Determines the x-param bonuses from traits.
	* @param {RPG_Traited[]} objs The objs driving this step.
	* @param {number} xId The x id driving this step.
	* @returns {number}
	*/
	xparamAddFromTraits(objs, xId) {
		const CODE = Game_BattlerBase.TRAIT_XPARAM;
		let add = 0;
		objs.forEach((source) => {
			if (!source || !source.traits) return;
			source.traits.forEach((trait) => {
				if (trait.code === CODE && trait.dataId === xId) {
					add += trait.value;
				}
			});
		});
		return add;
	}
	/**
	* Determines the s-param bonuses from traits.
	* @param {RPG_Traited[]} objs The objs driving this step.
	* @param {number} sId The s id driving this step.
	* @returns {number}
	*/
	sparamRateFromTraits(objs, sId) {
		const CODE = Game_BattlerBase.TRAIT_SPARAM;
		let rate = 1;
		objs.forEach((source) => {
			if (!source || !source.traits) return;
			source.traits.forEach((trait) => {
				if (trait.code === CODE && trait.dataId === sId) {
					rate *= trait.value;
				}
			});
		});
		return rate;
	}
	/**
	* Draws a small section title without any horizontal line.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} w The width.
	* @param {string} text The section title.
	* @returns {number} The next y after drawing.
	*/
	drawSectionTitle(x, y, w, text) {
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(text, x, y, w, "left");
		this.resetTextColor();
		const nextY = y + this.lineHeight() + 4;
		return nextY;
	}
	/**
	* Draws the value at the designated location.
	* @param x
	* @param y
	* @param w
	* @param key
	* @param value
	* @param align
	*/
	drawKeyValue(x, y, w, key, value, align) {
		this.drawText(key, x, y, Math.floor(w * .6), align || "left");
		const text = `${value}`;
		this.drawText(text, x, y, w, "right");
	}
	/**
	* Draws a section title and a list of key/value rows.
	* If `rows` is empty, the section is skipped and the original `y` is returned.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width.
	* @param {string} title The section title.
	* @param {{ key:string, value:string|number }[]} rows The rows to draw.
	* @returns {number} The next y after drawing (or unchanged if skipped).
	*/
	drawSectionWithRows(x, y, w, title, rows) {
		if (!rows || rows.length === 0) {
			return y;
		}
		let cursorY = this.drawSectionTitle(x, y, w, title);
		rows.forEach((row) => {
			this.drawKeyValue(x + 12, cursorY, w - 12, row.key, row.value, "left");
			cursorY += this.lineHeight();
		});
		cursorY += 6;
		return cursorY;
	}
	/**
	* Draws an SDP (Panels) section consisting of a "+ Total" line and panel entries.
	* If there are no non-zero panels or the overall total is neutral, the section is skipped.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width.
	* @param {string|number} totalValueText The right-aligned text for the total row.
	* @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows; caller ensures non-zero filtering if desired.
	* @returns {number} The next y after drawing (or unchanged if skipped).
	*/
	drawSdpPanelsSection(x, y, w, totalValueText, panels) {
		const anyPanels = panels && panels.length > 0;
		if (!anyPanels) {
			return y;
		}
		let cursorY = this.drawSectionTitle(x, y, w, "SDP (Panels)");
		this.drawKeyValue(x + 12, cursorY, w - 12, "+ Total", totalValueText, "left");
		cursorY += this.lineHeight();
		panels.forEach((panel) => {
			const { name } = panel;
			const { iconIndex } = panel;
			const { rarity } = panel;
			const sign = panel.delta >= 0 ? "+" : String.empty;
			const flatText = `${sign}${panel.delta}`;
			const valueText = panel.rateDec ? `${StatusHelper.toPercentString(panel.rateDec * 100, true)} (${flatText})` : flatText;
			this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);
			cursorY += this.lineHeight();
		});
		cursorY += 6;
		return cursorY;
	}
	/**
	* Same as `drawSdpPanelsSection`, but formats each panel delta as a percent string (e.g., "+4.0%")
	* and expects `totalValueText` to also be percent-formatted already.
	* Useful for xparams/sparams where contribution space is decimal/percentage.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate to start drawing.
	* @param {number} w The width.
	* @param {string} totalValueText The right-aligned text for the total row, already formatted.
	* @param {{ name:string, iconIndex:number, rarity:number, delta:number }[]} panels The per-panel rows.
	* @returns {number} The next y after drawing (or unchanged if skipped).
	*/
	drawSdpPanelsPercentSection(x, y, w, totalValueText, panels) {
		const anyPanels = panels && panels.length > 0;
		if (!anyPanels) {
			return y;
		}
		let cursorY = this.drawSectionTitle(x, y, w, "SDP (Panels)");
		this.drawKeyValue(x + 12, cursorY, w - 12, "+ Total", totalValueText, "left");
		cursorY += this.lineHeight();
		panels.forEach((panel) => {
			const { name } = panel;
			const { iconIndex } = panel;
			const { rarity } = panel;
			const pct = panel.delta * 100;
			const valueText = StatusHelper.toPercentString(pct, true);
			this.drawSdpPanelEntry(x + 24, cursorY, w - 24, name, iconIndex, rarity, valueText);
			cursorY += this.lineHeight();
		});
		cursorY += 6;
		return cursorY;
	}
};

//#endregion
//#region src/plugins/cms/status/windows/Window_StatusPageHint.js
/**
* A tiny, non-interactive window that informs the player they can use L2/R2
* to switch the right-hand view in the Status scene.
*/
var Window_StatusPageHint = class extends Window_Base {
	/**
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.refresh();
	}
	/**
	* Redraws the hint text centered within the window.
	*/
	refresh() {
		this.contents.clear();
		const { innerWidth } = this;
		const x = 0;
		const y = 0;
		const text = "L2/R2: Switch View · L1/R1: Party";
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(text, x, y, innerWidth, "center");
		this.resetTextColor();
	}
};

//#endregion
//#region src/plugins/cms/status/windows/Window_Status.js
/**
* Overwrites {@link #drawBlock1}.<br/>
* Renders the actor name and class without the nickname.
*/
Window_Status.prototype.drawBlock1 = function() {
	const y = this.block1Y();
	this.drawActorName(this._actor, 0, y, 168);
	this.drawActorClass(this._actor, 204, y, 168);
};
/**
* Overwrites {@link #drawBlock2}.<br/>
* Renders the actor face, basic info, and experience at non-default positioning.
*/
Window_Status.prototype.drawBlock2 = function() {
	const y = this.block2Y();
	this.drawActorFace(this._actor, 12, y);
	this.drawBasicInfo(204, y);
	this.drawExpInfo(0, y + 250);
};

//#endregion
//#region src/plugins/cms/status/scenes/Scene_Status.js
/**
* Overwrites {@link #createButtons}.<br/>
* Removes buttons because fuck the buttons.
*/
Scene_Status.prototype.createButtons = function() {};
/**
* Overwrites {@link #create}.<br/>
* Creates all windows and initializes state.
*/
Scene_Status.prototype.create = function() {
	Scene_MenuBase.prototype.create.call(this);
	this.initMembers();
	this.createStatusWindow();
	this.createStatusParamsWindow();
	this.createStatusEquipWindow();
	this.createStatListWindow();
	this.createStatBreakdownWindow();
	this.createStatusHintWindow();
	this.applyPageVisibility();
};
/**
* Initializes all members and namespaced state for this scene.
*/
Scene_Status.prototype.initMembers = function() {
	if (!this._j) this._j = {};
	if (!this._j._cms_s) this._j._cms_s = {};
	if (!this._j._cms_s._status) this._j._cms_s._status = {};
	this._j._cms_s._status._windows = {
		_status: null,
		_params: null,
		_equip: null,
		_list: null,
		_breakdown: null,
		_hint: null
	};
	this._j._cms_s._status._state = {
		_pageIndex: 0,
		_lastDir4: 0,
		_switchCooldown: 0
	};
};
Scene_Status.prototype.getStatusWindow = function() {
	return this._j._cms_s._status._windows._status;
};
Scene_Status.prototype.setStatusWindow = function(v) {
	this._j._cms_s._status._windows._status = v;
};
Scene_Status.prototype.getParamsWindow = function() {
	return this._j._cms_s._status._windows._params;
};
Scene_Status.prototype.setParamsWindow = function(v) {
	this._j._cms_s._status._windows._params = v;
};
Scene_Status.prototype.getEquipWindow = function() {
	return this._j._cms_s._status._windows._equip;
};
Scene_Status.prototype.setEquipWindow = function(v) {
	this._j._cms_s._status._windows._equip = v;
};
Scene_Status.prototype.getStatListWindow = function() {
	return this._j._cms_s._status._windows._list;
};
Scene_Status.prototype.setStatListWindow = function(v) {
	this._j._cms_s._status._windows._list = v;
};
Scene_Status.prototype.getStatBreakdownWindow = function() {
	return this._j._cms_s._status._windows._breakdown;
};
Scene_Status.prototype.setStatBreakdownWindow = function(v) {
	this._j._cms_s._status._windows._breakdown = v;
};
Scene_Status.prototype.getStatusHintWindow = function() {
	return this._j._cms_s._status._windows._hint;
};
Scene_Status.prototype.setStatusHintWindow = function(v) {
	this._j._cms_s._status._windows._hint = v;
};
Scene_Status.prototype.getPageIndex = function() {
	return this._j._cms_s._status._state._pageIndex | 0;
};
Scene_Status.prototype.setPageIndex = function(v) {
	this._j._cms_s._status._state._pageIndex = v | 0;
};
Scene_Status.prototype.getLastDir4 = function() {
	return this._j._cms_s._status._state._lastDir4 | 0;
};
Scene_Status.prototype.setLastDir4 = function(v) {
	this._j._cms_s._status._state._lastDir4 = v | 0;
};
Scene_Status.prototype.getSwitchCooldown = function() {
	return this._j._cms_s._status._state._switchCooldown | 0;
};
Scene_Status.prototype.setSwitchCooldown = function(v) {
	const frames = v | 0;
	this._j._cms_s._status._state._switchCooldown = Math.max(0, frames);
};
/**
* Overwrites {@link #refreshActor}.<br/>
* Refresh all windows.
*/
Scene_Status.prototype.refreshActor = function() {
	const actor = this.actor();
	this.getStatusWindow().setActor(actor);
	this.getParamsWindow().setActor(actor);
	this.getEquipWindow().setActor(actor);
	const list = this.getStatListWindow();
	const breakdown = this.getStatBreakdownWindow();
	list.setActor(actor);
	breakdown.setContext(actor, list.currentParameterKey());
};
/**
* Overwrites {@link #onActorChange}.<br/>
* Vanilla activates {@link this._statusWindow}, which CMS does not use.
* Refresh all CMS windows and restore focus for the active page.
*/
Scene_Status.prototype.onActorChange = function() {
	Scene_MenuBase.prototype.onActorChange.call(this);
	this.refreshActor();
	this.applyPageVisibility();
};
/**
* Width of the stacked actor + equip column on the left edge of Page 1.
* @returns {number}
*/
Scene_Status.prototype.statusLeftColumnWidth = function() {
	return Math.round(Graphics.boxWidth * .225);
};
/**
* The rectangle for the status window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusWindowRect = function() {
	const wx = 0;
	const wy = 0;
	const ww = this.statusLeftColumnWidth();
	const wh = Math.round(Graphics.boxHeight * .6);
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the equip window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusEquipWindowRect = function() {
	const wx = 0;
	const wy = this.getStatusWindow().height;
	const ww = this.statusLeftColumnWidth();
	const wh = Math.round(Graphics.boxHeight * .4);
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the parameters window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusParamsWindowRect = function() {
	const leftColumnWidth = this.statusLeftColumnWidth();
	const wx = leftColumnWidth;
	const hintRect = this.statusHintWindowRect();
	const wy = hintRect.height;
	const ww = Graphics.boxWidth - leftColumnWidth;
	const wh = Graphics.boxHeight - wy;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the stat list window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusStatListWindowRect = function() {
	const leftColumnWidth = this.statusLeftColumnWidth();
	const wx = leftColumnWidth;
	const hintRect = this.statusHintWindowRect();
	const wy = hintRect.height;
	const ww = 440;
	const wh = Graphics.boxHeight - wy;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the stat breakdown window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusStatBreakdownWindowRect = function() {
	const list = this.statusStatListWindowRect();
	const wx = list.x + list.width;
	const wy = this.statusHintWindowRect().height;
	const ww = Graphics.boxWidth - wx;
	const wh = Graphics.boxHeight - wy;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the hint window.
* @returns {Rectangle}
*/
Scene_Status.prototype.statusHintWindowRect = function() {
	const leftColumnWidth = this.statusLeftColumnWidth();
	const wx = leftColumnWidth;
	const wy = 0;
	const ww = Graphics.boxWidth - wx;
	const wh = 60;
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Creates the status window and configures it.
*/
Scene_Status.prototype.createStatusWindow = function() {
	const rect = this.statusWindowRect();
	const win = new Window_Status(rect);
	this.setStatusWindow(win);
	this.addWindow(win);
};
/**
* Creates the parameters window and configures it.
*/
Scene_Status.prototype.createStatusParamsWindow = function() {
	const rect = this.statusParamsWindowRect();
	const win = new Window_StatusParameters(rect);
	this.setParamsWindow(win);
	this.addWindow(win);
};
/**
* Creates the equipment window and configures it.
*/
Scene_Status.prototype.createStatusEquipWindow = function() {
	const rect = this.statusEquipWindowRect();
	const win = new Window_StatusEquip(rect);
	this.setEquipWindow(win);
	this.addWindow(win);
};
/**
* Creates the stat list window and configures it.
*/
Scene_Status.prototype.createStatListWindow = function() {
	const rect = this.statusStatListWindowRect();
	const list = new Window_StatusStatList(rect);
	this.setStatListWindow(list);
	list.setActor(this.actor());
	list.setChangeHandler(this.onStatListChanged.bind(this));
	this.addWindow(list);
};
/**
* Creates the stat breakdown window and configures it.
*/
Scene_Status.prototype.createStatBreakdownWindow = function() {
	const rect = this.statusStatBreakdownWindowRect();
	const breakdown = new Window_StatusStatBreakdown(rect);
	this.setStatBreakdownWindow(breakdown);
	breakdown.setContext(this.actor(), "mhp");
	this.addWindow(breakdown);
};
/**
* Creates the bottom-centered hint window.
*/
Scene_Status.prototype.createStatusHintWindow = function() {
	const rect = this.statusHintWindowRect();
	const hint = new Window_StatusPageHint(rect);
	this.setStatusHintWindow(hint);
	this.addWindow(hint);
};
/**
* An event that fires when the selected stat changes in the list window.
*/
Scene_Status.prototype.onStatListChanged = function() {
	if (this.getPageIndex() !== 1) return;
	const parameterKey = this.getStatListWindow().currentParameterKey();
	this.getStatBreakdownWindow().setContext(this.actor(), parameterKey);
};
/**
* Applies visibility to the windows based on the current page index.
*/
Scene_Status.prototype.applyPageVisibility = function() {
	const isPage1 = this.getPageIndex() === 0;
	const isPage2 = this.getPageIndex() === 1;
	this.getStatusWindow().visible = true;
	this.getEquipWindow().visible = true;
	this.getParamsWindow().visible = isPage1;
	this.getStatBreakdownWindow().visible = isPage2;
	this.getStatusHintWindow().visible = true;
	const listWindow = this.getStatListWindow();
	listWindow.visible = isPage2;
	if (isPage1) {
		listWindow.deactivate();
	} else {
		listWindow.activate();
		if (listWindow.index() === -1) {
			listWindow.select(0);
		}
	}
};
/**
* Extends {@link #update}.<br/>
* Also handles page switching and cooldowns.
*/
J.CMS_S.Aliased.Scene_Status.set("update", Scene_Status.prototype.update);
Scene_Status.prototype.update = function() {
	J.CMS_S.Aliased.Scene_Status.get("update").call(this);
	if (Input.isTriggered("cancel")) {
		this.popScene();
		return;
	}
	this.updatePageSwitchCooldown();
};
/**
* Updates the page switch cooldown.
*/
Scene_Status.prototype.updatePageSwitchCooldown = function() {
	const cooldown = this.getSwitchCooldown();
	if (cooldown > 0) {
		const nextFrames = cooldown - 1;
		this.setSwitchCooldown(nextFrames);
		return;
	}
	if (this.getSwitchCooldown() === 0) {
		this.handleNormalizedStatusInput();
	}
};
/**
* Handles L2/R2 page switching and L1/R1 actor cycling for the status scene.
* Page 1 has no active selectable window, so this lives at scene scope.
*/
Scene_Status.prototype.handleNormalizedStatusInput = function() {
	let handled = false;
	if (Input.isTriggered("l2") || Input.isTriggered("r2")) {
		const next = (this.getPageIndex() + 1) % 2;
		this.setPageIndex(next);
		this.applyPageVisibility();
		this.onStatListChanged();
		handled = true;
	}
	if (Input.isTriggered("pageup")) {
		this.previousActor();
		handled = true;
	}
	if (Input.isTriggered("pagedown")) {
		this.nextActor();
		handled = true;
	}
	if (handled) {
		this.setSwitchCooldown(12);
	}
};

//#endregion
//# sourceMappingURL=J-CMS-Status.js.map