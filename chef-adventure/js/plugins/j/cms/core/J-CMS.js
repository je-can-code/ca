//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CMS_M] A redesign of the main menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This is a redesign of the main menu.
 *
 * As the "core" of the CMS family, this plugin also carries the shared
 * parameter-catalog rendering (grouping, chrome, layout) that other CMS
 * scenes build on, so it must be enabled and ordered before them.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely a scene/window
 * redesign of the native main menu.
 * ============================================================================
 */
//endregion Introduction

//#region src/plugins/cms/core/_metadata/_pluginMetadata.js
var J_CmsMain_PluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/cms/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CMS_M = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CMS_M.Metadata = new J_CmsMain_PluginMetadata("J-CMS", "1.0.0");
J.CMS_M.Aliased = {
	Scene_Menu: {},
	Window_EquipItem: {},
	Window_EquipSlot: {}
};

//#endregion
//#region src/plugins/cms/core/_models/CmsParameter.js
/**
* The content of a single parameter being drawn in a window.
* Shared across all CMS scenes (status, equip, etc.) so every screen renders
* a given registry parameter with identical name/icon/color/formatting.
*/
var CmsParameter = class {
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
	* The battler this parameter belongs to, if known. Threaded through to
	* {@link ParameterDefinition#prettyValue} so REGEN_PER_SECOND can convert using this
	* battler's actual tick cadence instead of assuming a fixed tick count.
	* @type {Game_Battler|null}
	*/
	actor = null;
	/**
	* Constructor.
	* @param {number} value The value of the parameter.
	* @param {string} parameterKey The registry key this value represents.
	* @param {Game_Battler=} actor The battler this parameter belongs to, if known.
	*/
	constructor(value, parameterKey, actor = null) {
		this.value = value;
		this.parameterKey = parameterKey;
		this.actor = actor;
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
		return definition.prettyValue(this.value, withPadding, this.actor);
	}
};

//#endregion
//#region src/plugins/cms/core/helpers/ParameterCatalogRenderer.js
/**
* Shared registry-driven parameter catalog rendering for every CMS scene that shows a battler's
* parameters (status page 1, the equip comparison panel, etc.). Every consumer draws through here
* so the group taxonomy, chrome (title/icon/color), and layout math stay identical everywhere —
* a stat looks and is grouped the same way whether you're looking at the status or equip scene.
*
* All methods here are static and take the calling `window` as their first argument instead of
* this class extending `Window_Base` itself; several CMS windows (like `Window_EquipStatus`) are
* prototype-patches onto RMMZ's built-in global classes rather than ES class extensions, so a
* plain delegate is the only shape both callers can use identically.
*/
var ParameterCatalogRenderer = class ParameterCatalogRenderer {
	/**
	* Section chrome for the catalog groups every parameter-catalog window renders.
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
			title: "Haste",
			iconIndex: 82,
			colorIndex: 20
		},
		fate: {
			title: "Fate",
			iconIndex: 1619,
			colorIndex: 27
		},
		support: {
			title: "Support",
			iconIndex: 86,
			colorIndex: 14
		}
	};
	/**
	* Catalog group ids per visual row band (left column, then middle column). `support` has no
	* partner group — like an odd-count group's dangling last row, it's a lone entry in its own band.
	* @type {Array<[string, string]|[string]>}
	*/
	static PAGE_GROUP_ROW_GROUPS = [
		["combat", "vitality"],
		["precision", "defensive"],
		["mobility", "fate"],
		["support"]
	];
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
	* Shared layout constants for catalog row bands.
	* @type {{rowGap: number}}
	*/
	static PAGE_LAYOUT = { rowGap: 24 };
	/**
	* Computes equal-width three-column layout with equal inter-column gaps.
	* @param {Window_Base} window The window driving the layout.
	* @returns {{ edgePad: number, gap: number, columnWidth: number, leftX: number, middleX: number, rightX: number, rightColumnWidth: number }|null}
	*/
	static computeThreeColumnLayout(window) {
		const edgePad = 8;
		const usable = window.innerWidth - edgePad * 2;
		const gap = ParameterCatalogRenderer.COLUMN_LINE_BLEED + ParameterCatalogRenderer.COLUMN_CLEAR_GAP;
		const minColumnWidth = 200;
		const columnWidth = Math.floor((usable - gap * 2) / 3);
		if (columnWidth < minColumnWidth) {
			return null;
		}
		const leftX = edgePad;
		const middleX = leftX + columnWidth + gap;
		const rightX = middleX + columnWidth + gap;
		const rightColumnWidth = window.innerWidth - rightX;
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
	* Computes equal-width two-column layout spanning the full inner width. Unlike
	* {@link #computeThreeColumnLayout}, this reserves no third column for elements/ailments — for
	* consumers (like the equip comparison panel) that have nothing to put there, splitting into two
	* wider columns instead gives every parameter name and value room to breathe.
	* @param {Window_Base} window The window driving the layout.
	* @returns {{ edgePad: number, gap: number, columnWidth: number, leftX: number, middleX: number }|null}
	*/
	static computeTwoColumnLayout(window) {
		const edgePad = 8;
		const usable = window.innerWidth - edgePad * 2;
		const gap = ParameterCatalogRenderer.COLUMN_LINE_BLEED + ParameterCatalogRenderer.COLUMN_CLEAR_GAP;
		const minColumnWidth = 200;
		const columnWidth = Math.floor((usable - gap) / 2);
		if (columnWidth < minColumnWidth) {
			return null;
		}
		const leftX = edgePad;
		const middleX = leftX + columnWidth + gap;
		return {
			edgePad,
			gap,
			columnWidth,
			leftX,
			middleX
		};
	}
	/**
	* X coordinate of the vertical rule between paired stats — matches {@link #drawTSeparator}.
	* @param {number} sectionX The left edge of the group column.
	* @param {number} sectionWidth The drawable width of the group column.
	* @returns {number}
	*/
	static centerDividerX(sectionX, sectionWidth) {
		return sectionX + Math.floor(sectionWidth / 2) + 8;
	}
	/**
	* Outer right edge for catalog row chrome (icon column); matches section width, not line bleed.
	* @param {number} sectionX The left edge of the group column.
	* @param {number} sectionWidth The drawable width of the group column.
	* @returns {number}
	*/
	static catalogRowRight(sectionX, sectionWidth) {
		return sectionX + sectionWidth;
	}
	/**
	* Whether a catalog value already occupies the sign column (space, {@code +}, or {@code -}).
	* @param {string} value The rendered value text.
	* @returns {boolean}
	*/
	static catalogValueHasSignColumn(value) {
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
	static catalogValueRightReservesSignColumn(value, withPadding, isSentinel) {
		if (withPadding) {
			return ParameterCatalogRenderer.catalogValueHasSignColumn(value) === false;
		}
		return isSentinel;
	}
	/**
	* Estimates pixel width for a styled padded string (monospace digit assumption).
	* @param {Window_Base} window The window measuring the text.
	* @param {string} value The rendered text.
	* @returns {number}
	*/
	static styledValuePixelWidth(window, value) {
		return value.length * window.textWidth("0");
	}
	/**
	* Monospace slot width for a right-half catalog value.
	* @param {Window_Base} window The window measuring the text.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	static catalogValueRightMeasureWidth(window, value, withPadding, isSentinel) {
		if (withPadding || isSentinel) {
			return ParameterCatalogRenderer.styledValuePixelWidth(window, value);
		}
		return window.textWidth(value);
	}
	/**
	* Layout width for a right-half catalog value beside the center divider.
	* Flat numerics and sentinel labels reserve one digit column so they align with signed percents.
	* @param {Window_Base} window The window measuring the text.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	static catalogValueRightLayoutWidth(window, value, withPadding, isSentinel) {
		const measureWidth = ParameterCatalogRenderer.catalogValueRightMeasureWidth(window, value, withPadding, isSentinel);
		if (ParameterCatalogRenderer.catalogValueRightReservesSignColumn(value, withPadding, isSentinel)) {
			return measureWidth + window.textWidth("0");
		}
		return measureWidth;
	}
	/**
	* X coordinate for drawing a right-half catalog value beside the center divider.
	* @param {Window_Base} window The window measuring the text.
	* @param {number} halfX The inner edge of the right half-column.
	* @param {string} value The rendered value text.
	* @param {boolean} withPadding Whether styled padding is active.
	* @param {boolean} isSentinel Whether the value is a clamped label ({@code FREE}, etc.).
	* @returns {number}
	*/
	static catalogValueRightDrawX(window, halfX, value, withPadding, isSentinel) {
		if (ParameterCatalogRenderer.catalogValueRightReservesSignColumn(value, withPadding, isSentinel)) {
			return halfX + window.textWidth("0");
		}
		return halfX;
	}
	/**
	* Resolves what text/color a catalog value slot should render. When `nextParameter` is supplied
	* and its value differs from `parameter`, this collapses "current → projected" into a single
	* colored string instead of the padded single-value display — that's the whole reason equip's
	* comparison panel can share this renderer with the plain status page instead of duplicating it.
	*
	* `color` is always a ready-to-draw CSS color string. It is kept separate from `colorIndex`
	* (a raw palette index, only meaningful in the non-diff/padded-value path) because
	* {@link ColorManager#paramchangeTextColor} — used for the diff path — already returns a resolved
	* CSS string rather than a palette index; feeding that back through {@link ColorManager#textColor}
	* a second time throws, since that call expects a number.
	* @param {CmsParameter} parameter The parameter's current value.
	* @param {CmsParameter|null} nextParameter The parameter's projected value, if comparing.
	* @returns {{text: string, colorIndex: number, color: string, bold: boolean, withPadding: boolean}}
	*/
	static resolveCatalogDisplay(parameter, nextParameter) {
		const hasDiff = nextParameter !== null && nextParameter.value !== parameter.value;
		if (!hasDiff) {
			const withPadding = parameter.usesStyledValue();
			return {
				text: parameter.prettyValue(withPadding),
				colorIndex: parameter.colorIndex,
				color: ColorManager.textColor(parameter.colorIndex),
				bold: parameter.colorIndex !== 0,
				withPadding
			};
		}
		const diffValue = nextParameter.value - parameter.value;
		const definition = ParameterRegistry.get(parameter.parameterKey);
		const colorDiff = definition && definition.isIncreaseBeneficial() === false ? -diffValue : diffValue;
		const deltaText = definition ? definition.prettyDelta(diffValue, parameter.actor) : String.empty;
		return {
			text: `${nextParameter.prettyValue()}${deltaText ? ` (${deltaText})` : String.empty}`,
			colorIndex: 0,
			color: ColorManager.paramchangeTextColor(colorDiff),
			bold: true,
			withPadding: false
		};
	}
	/**
	* Draws a catalog stat value, optionally as a "current → projected" comparison.
	* @param {Window_Base} window The window to draw into.
	* @param {number} x The value column x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} width The width reserved for the value.
	* @param {CmsParameter} parameter The parameter being rendered.
	* @param {'left'|'right'} align Horizontal alignment within the slot.
	* @param {CmsParameter|null} nextParameter The projected value to compare against, if any.
	*/
	static drawCatalogParameterValue(window, x, y, width, parameter, align = "right", nextParameter = null) {
		const display = ParameterCatalogRenderer.resolveCatalogDisplay(parameter, nextParameter);
		if (display.withPadding) {
			window.drawStyledPaddedValue(x, y, display.text, width, 8, display.colorIndex, align);
			return;
		}
		if (display.bold) {
			window.contents.fontBold = true;
		}
		window.changeTextColor(display.color);
		window.drawText(display.text, x, y, width, align);
		window.resetTextColor();
		window.resetFontFormatting();
	}
	/**
	* Creates a new parameter object that contains the necessary data to draw it into a window.
	* @param {Game_Battler} actor The battler to resolve the value from.
	* @param {string} parameterKey The parameter registry key (e.g. `'atk'`).
	* @returns {CmsParameter} The compiled {@link CmsParameter}.
	*/
	static makeParameter(actor, parameterKey) {
		const value = actor.parameter(parameterKey);
		return new CmsParameter(value, parameterKey, actor);
	}
	/**
	* Left half of a paired row: {@code [icon][name][value→center]}.
	* @param {Window_Base} window The window to draw into.
	* @param {number} halfX The left edge of this half-column.
	* @param {number} y The y coordinate.
	* @param {number} innerRight The inner edge where values meet the center divider.
	* @param {CmsParameter} parameter The parameter being rendered.
	* @param {CmsParameter|null} nextParameter The projected value to compare against, if any.
	*/
	static drawParameterLeft(window, halfX, y, innerRight, parameter, nextParameter = null) {
		window.resetFontSettings();
		window.drawIcon(parameter.iconIndex, halfX, y);
		window.makeFontSmaller();
		const iconPad = ImageManager.iconWidth + 4;
		const gap = ParameterCatalogRenderer.CATALOG_NAME_VALUE_GAP;
		const rowSpan = innerRight - halfX;
		const nameX = halfX + iconPad;
		const display = ParameterCatalogRenderer.resolveCatalogDisplay(parameter, nextParameter);
		const valuePixelWidth = display.withPadding ? ParameterCatalogRenderer.styledValuePixelWidth(window, display.text) : window.textWidth(display.text);
		const nameWidth = Math.max(0, rowSpan - iconPad - valuePixelWidth - gap);
		window.drawText(`${parameter.name}`, nameX, y, nameWidth, "left");
		ParameterCatalogRenderer.drawCatalogParameterValue(window, halfX, y, rowSpan, parameter, "right", nextParameter);
		window.resetFontSettings();
	}
	/**
	* Right half of a paired row: {@code [value←center][name][icon]} (mirrored zigzag).
	* @param {Window_Base} window The window to draw into.
	* @param {number} halfX The left (inner) edge of this half-column.
	* @param {number} y The y coordinate.
	* @param {number} outerRight The outer edge of the section (includes underline bleed).
	* @param {CmsParameter} parameter The parameter being rendered.
	* @param {CmsParameter|null} nextParameter The projected value to compare against, if any.
	*/
	static drawParameterRight(window, halfX, y, outerRight, parameter, nextParameter = null) {
		window.resetFontSettings();
		window.makeFontSmaller();
		const gap = ParameterCatalogRenderer.CATALOG_NAME_VALUE_GAP;
		const iconX = outerRight - ImageManager.iconWidth;
		const display = ParameterCatalogRenderer.resolveCatalogDisplay(parameter, nextParameter);
		const definition = ParameterRegistry.get(parameter.parameterKey);
		const isSentinel = nextParameter === null && definition && definition.resolveDisplaySentinel(parameter.value) !== null;
		const layoutWidth = ParameterCatalogRenderer.catalogValueRightLayoutWidth(window, display.text, display.withPadding, isSentinel);
		const valueDrawX = ParameterCatalogRenderer.catalogValueRightDrawX(window, halfX, display.text, display.withPadding, isSentinel);
		const valueDrawWidth = ParameterCatalogRenderer.catalogValueRightMeasureWidth(window, display.text, display.withPadding, isSentinel);
		const nameX = halfX + layoutWidth + gap;
		const nameWidth = Math.max(0, iconX - nameX - gap);
		ParameterCatalogRenderer.drawCatalogParameterValue(window, valueDrawX, y, valueDrawWidth, parameter, "left", nextParameter);
		window.resetTextColor();
		window.resetFontFormatting();
		window.drawText(`${parameter.name}`, nameX, y, nameWidth, "right");
		window.drawIcon(parameter.iconIndex, iconX, y);
		window.resetFontSettings();
	}
	/**
	* Draws all parameters for a group in two-column pairs.
	* @param {Window_Base} window The window to draw into.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width of the section.
	* @param {ParameterDefinition[]} definitions The catalog entries for this group.
	* @param {Game_Battler} actor The battler whose current values are shown.
	* @param {Game_Battler|null} tempActor The battler whose projected values are compared, if any.
	*/
	static drawGroupParameters(window, x, y, sectionWidth, definitions, actor, tempActor = null) {
		const lh = window.lineHeight();
		const dividerX = ParameterCatalogRenderer.centerDividerX(x, sectionWidth);
		const pairGap = ParameterCatalogRenderer.CATALOG_PAIR_GAP;
		const leftInnerRight = dividerX - Math.floor(pairGap / 2);
		const rightHalfX = dividerX + Math.ceil(pairGap / 2);
		const rowRight = ParameterCatalogRenderer.catalogRowRight(x, sectionWidth);
		definitions.forEach((definition, index) => {
			const row = Math.floor(index / 2) + 1;
			const rowY = y + lh * row;
			const parameter = ParameterCatalogRenderer.makeParameter(actor, definition.key);
			const nextParameter = tempActor ? ParameterCatalogRenderer.makeParameter(tempActor, definition.key) : null;
			const isComparing = tempActor !== null;
			const isUnchanged = nextParameter === null || nextParameter.value === parameter.value;
			window.changePaintOpacity(!(isComparing && isUnchanged));
			if (index % 2 === 0) {
				ParameterCatalogRenderer.drawParameterLeft(window, x, rowY, leftInnerRight, parameter, nextParameter);
			} else {
				ParameterCatalogRenderer.drawParameterRight(window, rightHalfX, rowY, rowRight, parameter, nextParameter);
			}
		});
		window.changePaintOpacity(true);
	}
	/**
	* Draws a T separator by using a horizontal and vertical line.
	* The length of these lines is defined by the section width and the number of lines.
	* @param {Window_Base} window The window to draw into.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} w The width of the T separator.
	* @param {number=} lines The height of the T separator, multiplied by `lineHeight`; defaults to 1 line.
	*/
	static drawTSeparator(window, x, y, w, lines = 1) {
		const lh = window.lineHeight();
		const firstRowY = y + lh * 1;
		window.drawHorizontalLine(x, firstRowY - 4, w + ParameterCatalogRenderer.COLUMN_LINE_BLEED, 3);
		const secondColumnX = x + w / 2 + 12;
		const verticalLineX = secondColumnX - 4;
		const verticalLineHeight = lh * lines + 4;
		window.drawVerticalLine(verticalLineX, firstRowY - 2, verticalLineHeight, 3);
	}
	/**
	* Draws one catalog group section and returns the vertical space consumed.
	* @param {Window_Base} window The window to draw into.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {string} groupId The {@link ParameterGroups} id.
	* @param {number} sectionWidth The width of the section.
	* @param {Game_Battler} actor The battler whose current values are shown.
	* @param {Game_Battler|null} tempActor The battler whose projected values are compared, if any.
	* @returns {number}
	*/
	static drawParameterGroup(window, x, y, groupId, sectionWidth, actor, tempActor = null) {
		const chrome = ParameterCatalogRenderer.GROUP_CHROME[groupId];
		const definitions = ParameterRegistry.byGroup(groupId);
		if (!chrome || !definitions.length) {
			return 0;
		}
		const rowCount = Math.ceil(definitions.length / 2);
		const titleY = y - 15;
		const rowBaseY = y + 8;
		ParameterCatalogRenderer.drawTitle(window, chrome.title, x, titleY, chrome.iconIndex, chrome.colorIndex);
		ParameterCatalogRenderer.drawTSeparator(window, x, rowBaseY - 2, sectionWidth, rowCount);
		ParameterCatalogRenderer.drawGroupParameters(window, x, rowBaseY, sectionWidth, definitions, actor, tempActor);
		return 36 + rowCount * window.lineHeight() + 8;
	}
	/**
	* Draws the title of one of the sections for parameters.
	* @param {Window_Base} window The window to draw into.
	* @param {string} text The text to write as the title.
	* @param {number} x The `x` coordinate.
	* @param {number} y The `y` coordinate.
	* @param {number=} iconIndex The icon index for this parameter; defaults to none(0).
	* @param {number=} colorIndex The color index for the title; defaults to system color(1).
	* @param {string=} alignment The text-alignment value of the title; defaults to "center".
	* @param {number=} sectionWidth The width available for the title row.
	*/
	static drawTitle(window, text, x, y, iconIndex = 0, colorIndex = 1, alignment = "center", sectionWidth = 350) {
		window.resetFontSettings();
		window.drawIcon(iconIndex, x, y + 16);
		window.changeTextColor(ColorManager.textColor(colorIndex));
		window.makeFontBigger();
		window.drawText(text, x + 32, y + 16, sectionWidth - 32, alignment);
		window.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/cms/core/scenes/Scene_Menu.js
/**
* The rectangle for the command window.<br/>
* Flips horizontal anchor when right-side input mode is active.
* @returns {Rectangle}
*/
Scene_Menu.prototype.commandWindowRect = function() {
	const ww = this.mainCommandWidth();
	const wh = this.mainAreaHeight() - this.goldWindowRect().height;
	const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
	const wy = this.mainAreaTop();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* The rectangle for the status window.<br/>
* Fills the remaining width beside the command column.
* @returns {Rectangle}
*/
Scene_Menu.prototype.statusWindowRect = function() {
	const ww = Graphics.boxWidth - this.mainCommandWidth();
	const wh = this.mainAreaHeight();
	const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
	const wy = this.mainAreaTop();
	return new Rectangle(wx, wy, ww, wh);
};
/**
* CMS menu keeps commands on the left — never mirror for right-side input.
* @returns {boolean}
*/
Scene_Menu.prototype.isRightInputMode = function() {
	return false;
};
/**
* CMS menu keeps help at the top — not the bottom strip layout.
* @returns {boolean}
*/
Scene_Menu.prototype.isBottomHelpMode = function() {
	return false;
};
/**
* CMS menu uses bottom button hints instead of top-of-screen buttons.
* @returns {boolean}
*/
Scene_Menu.prototype.isBottomButtonMode = function() {
	return true;
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuCommand.js
/**
* Adds CMS main menu commands with custom icon indices per entry.
*/
Window_MenuCommand.prototype.addMainCommands = function() {
	const enabled = this.areMainCommandsEnabled();
	if (this.needsCommand("item")) {
		this.addCommand(TextManager.item, "item", enabled, null, 2567);
	}
	if (this.needsCommand("skill")) {
		this.addCommand(TextManager.skill, "skill", enabled, null, 2564);
	}
	if (this.needsCommand("equip")) {
		this.addCommand(TextManager.equip, "equip", enabled, null, 2565);
	}
	if (this.needsCommand("status")) {
		this.addCommand(TextManager.status, "status", enabled, null, 2560);
	}
};
/**
* Adds the options command when the plugin list includes it.
*/
Window_MenuCommand.prototype.addOptionsCommand = function() {
	if (this.needsCommand("options")) {
		const enabled = this.isOptionsEnabled();
		this.addCommand(TextManager.options, "options", enabled, null, 2566);
	}
};
/**
* Adds the game-end command with CMS icon styling.
*/
Window_MenuCommand.prototype.addGameEndCommand = function() {
	const enabled = this.isGameEndEnabled();
	this.addCommand(TextManager.gameEnd, "gameEnd", enabled, null, 2562);
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuStatus.js
/**
* CMS status window shows six party rows at once.
* @returns {number}
*/
Window_MenuStatus.prototype.numVisibleRows = function() {
	return 6;
};
/**
* Draws a compact actor ribbon: name, level, class, and basic gauges.
* @param {Game_Actor} actor The actor row being rendered.
* @param {number} x Left edge of the row content.
* @param {number} y Top edge of the row content.
*/
Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y) {
	const lineHeight = this.lineHeight();
	const x2 = x + 180;
	this.drawActorName(actor, x, y);
	this.drawActorLevel(actor, x, y + lineHeight * 1);
	this.drawActorClass(actor, x2, y);
	this.placeBasicGauges(actor, x2, y + lineHeight);
};

//#endregion
//# sourceMappingURL=J-CMS.js.map