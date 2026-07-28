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
 * COMMAND HELP TEXT
 * The main menu describes the highlighted command in a help window along the
 * top. Each of the engine's own commands has its description configured here,
 * because those commands belong to the engine rather than to any plugin.
 *
 * Commands contributed by other plugins carry their own descriptions, supplied
 * where that plugin builds its command. This plugin neither knows nor needs to
 * know what those commands are.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely a scene/window
 * redesign of the native main menu.
 * ============================================================================
 *
 * @param parentConfig
 * @text COMMAND DESCRIPTIONS
 *
 * @param help-item
 * @parent parentConfig
 * @type multiline_string
 * @text Inventory
 * @desc Describes the inventory command in the menu's help window.
 * @default Review and use the items the party is carrying.
 *
 * @param help-skill
 * @parent parentConfig
 * @type multiline_string
 * @text Abilities
 * @desc Describes the abilities command in the menu's help window.
 * @default Review every ability this character knows.
 *
 * @param help-equip
 * @parent parentConfig
 * @type multiline_string
 * @text Equipment
 * @desc Describes the equipment command in the menu's help window.
 * @default Change the weapons and armor this character has equipped.
 *
 * @param help-status
 * @parent parentConfig
 * @type multiline_string
 * @text Status
 * @desc Describes the status command in the menu's help window.
 * @default Inspect this character's parameters in detail.
 *
 * @param help-options
 * @parent parentConfig
 * @type multiline_string
 * @text Options
 * @desc Describes the options command in the menu's help window.
 * @default Adjust sound, display, and other game settings.
 *
 * @param help-save
 * @parent parentConfig
 * @type multiline_string
 * @text Save
 * @desc Describes the save command in the menu's help window.
 * @default Record your progress to a save file.
 *
 * @param help-gameEnd
 * @parent parentConfig
 * @type multiline_string
 * @text Exit
 * @desc Describes the exit command in the menu's help window.
 * @default Return to the title screen or close the game.
 *
 * @param help-formation
 * @parent parentConfig
 * @type multiline_string
 * @text Formation
 * @desc Describes the formation command in the menu's help window.
 * @default Rearrange the order of the party.
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
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
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
		* A map of the engine's own menu command symbols to their configured descriptions.
		*
		* Only the engine's commands live here. Commands contributed by other plugins carry their own
		* descriptions, supplied wherever that plugin builds its command- this plugin has no business
		* knowing they exist, let alone what they do.
		* @type {Map<string, string>}
		*/
		this.commandHelpText = new Map([
			["item", this.parsedPluginParameters["help-item"] ?? String.empty],
			["skill", this.parsedPluginParameters["help-skill"] ?? String.empty],
			["equip", this.parsedPluginParameters["help-equip"] ?? String.empty],
			["status", this.parsedPluginParameters["help-status"] ?? String.empty],
			["options", this.parsedPluginParameters["help-options"] ?? String.empty],
			["save", this.parsedPluginParameters["help-save"] ?? String.empty],
			["gameEnd", this.parsedPluginParameters["help-gameEnd"] ?? String.empty],
			["formation", this.parsedPluginParameters["help-formation"] ?? String.empty]
		]);
	}
	/**
	* Gets the configured description for one of the engine's menu commands.
	* @param {string} symbol The symbol of the command being described.
	* @returns {string} The description, or {@link String.empty} if this is not an engine command.
	*/
	helpTextFor(symbol) {
		return this.commandHelpText.get(symbol) ?? String.empty;
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
//#region src/plugins/cms/core/_models/MenuCommandBroadcaster.js
/**
* Stands in for the main menu's single command window now that there are two of them.
*
* Six plugins integrate with the main menu by aliasing `Scene_Menu#createCommandWindow` and calling
* `this._commandWindow.setHandler(...)`. Splitting the menu into two columns would have silently
* broken every one of them- their commands would still render, but pressing one would do nothing,
* which is the worst possible failure because it looks like it works.
*
* Rather than asking six plugins to learn about columns, `_commandWindow` becomes this: something
* that accepts a handler and gives it to both columns. A command's section decides which column
* renders it, so only one column will ever actually fire the handler- registering with both is
* harmless, and means a plugin retagging its command between sections needs no change at all.
*/
var MenuCommandBroadcaster = class {
	/**
	* The command windows receiving everything registered here.
	* @type {Window_MenuCommand[]}
	*/
	#windows = [];
	/**
	* @constructor
	* @param {Window_MenuCommand[]} windows The command windows to broadcast to.
	*/
	constructor(windows) {
		this.#windows = windows;
	}
	/**
	* Registers a handler against every command window.
	* @param {string} symbol The symbol of the command being handled.
	* @param {Function} method The handler to invoke when that command is chosen.
	*/
	setHandler(symbol, method) {
		this.#windows.forEach((window) => window.setHandler(symbol, method));
	}
	/**
	* Refreshes every command window.
	*/
	refresh() {
		this.#windows.forEach((window) => window.refresh());
	}
	/**
	* Gets the windows this broadcaster feeds.
	* @returns {Window_MenuCommand[]}
	*/
	windows() {
		return this.#windows;
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
//#region src/plugins/cms/core/windows/Window_MenuCommand.js
/**
* Overwrites {@link #addMainCommands}.<br/>
* Adds the vanilla main commands as built commands carrying both an icon and a menu section.
*
* These are built rather than added through vanilla's {@link Window_Command.addCommand} because that
* pushes a plain object with nowhere to record a section, and these four are precisely the commands
* that need one- three of them open actor-scoped scenes and belong in the menu's left column.
*/
Window_MenuCommand.prototype.addMainCommands = function() {
	const enabled = this.areMainCommandsEnabled();
	if (this.needsCommand("item")) {
		this.addBuiltCommand(new WindowCommandBuilder(TextManager.item).setSymbol("item").setHelpText(J.CMS_M.Metadata.helpTextFor("item")).setEnabled(enabled).setIconIndex(2567).setMenuSection(MenuSection.Party).build());
	}
	if (this.needsCommand("skill")) {
		this.addBuiltCommand(new WindowCommandBuilder(TextManager.skill).setSymbol("skill").setHelpText(J.CMS_M.Metadata.helpTextFor("skill")).setEnabled(enabled).setIconIndex(2564).setMenuSection(MenuSection.Actor).build());
	}
	if (this.needsCommand("equip")) {
		this.addBuiltCommand(new WindowCommandBuilder(TextManager.equip).setSymbol("equip").setHelpText(J.CMS_M.Metadata.helpTextFor("equip")).setEnabled(enabled).setIconIndex(2565).setMenuSection(MenuSection.Actor).build());
	}
	if (this.needsCommand("status")) {
		this.addBuiltCommand(new WindowCommandBuilder(TextManager.status).setSymbol("status").setHelpText(J.CMS_M.Metadata.helpTextFor("status")).setEnabled(enabled).setIconIndex(2560).setMenuSection(MenuSection.Actor).build());
	}
};
/**
* Overwrites {@link #addOptionsCommand}.<br/>
* Adds the options command when the plugin list includes it.
*/
Window_MenuCommand.prototype.addOptionsCommand = function() {
	if (this.needsCommand("options") === false) return;
	const enabled = this.isOptionsEnabled();
	this.addBuiltCommand(new WindowCommandBuilder(TextManager.options).setSymbol("options").setHelpText(J.CMS_M.Metadata.helpTextFor("options")).setEnabled(enabled).setIconIndex(2566).setMenuSection(MenuSection.Party).build());
};
/**
* Overwrites {@link #addGameEndCommand}.<br/>
* Adds the game-end command with CMS icon styling.
*/
Window_MenuCommand.prototype.addGameEndCommand = function() {
	const enabled = this.isGameEndEnabled();
	this.addBuiltCommand(new WindowCommandBuilder(TextManager.gameEnd).setSymbol("gameEnd").setHelpText(J.CMS_M.Metadata.helpTextFor("gameEnd")).setEnabled(enabled).setIconIndex(2562).setMenuSection(MenuSection.Party).build());
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuSectionCommand.js
/**
* A main menu command window showing only the commands belonging to one section.
*
* The main menu is split into two columns- one for scenes about a single actor, one for scenes about
* the party or the game. Rather than asking every plugin in the ecosystem to register into a new
* place, both columns extend {@link Window_MenuCommand} and therefore inherit every existing
* `addOriginalCommands` hook automatically. Each column then keeps only the commands belonging to it.
*
* This is why nothing had to change about how commands are registered: the split happens at the point
* of consumption, not registration. A plugin that has never heard of sections still works, and lands
* in the party column because that is what an untagged command defaults to.
*/
var Window_MenuSectionCommand = class extends Window_MenuCommand {
	/**
	* Extends {@link #makeCommandList}.<br/>
	* Also discards every command belonging to a different section.
	*/
	makeCommandList() {
		super.makeCommandList();
		this.filterToSection();
	}
	/**
	* Discards every command in the list that does not belong to this window's section.
	*/
	filterToSection() {
		const commands = this.commandList();
		const surviving = commands.filter((command) => this.belongsToSection(command));
		commands.length = 0;
		commands.push(...surviving);
	}
	/**
	* Determines whether a command belongs in this window.
	*
	* The command list is deliberately heterogeneous- vanilla's {@link Window_Command.addCommand} pushes
	* plain objects while {@link Window_Command.addBuiltCommand} pushes {@link BuiltWindowCommand}
	* instances- so a command may genuinely have no section at all. Those are treated as party
	* commands, which is the same default a built command gets when it never declares one.
	* @param {BuiltWindowCommand|{symbol: string}} command The command to evaluate.
	* @returns {boolean}
	*/
	belongsToSection(command) {
		const section = command.menuSection ?? MenuSection.Party;
		return section === this.menuSection();
	}
	/**
	* The section of commands this window renders.
	* @returns {string} One of {@link MenuSection}.
	*/
	menuSection() {
		return MenuSection.Party;
	}
	/**
	* Shrinks this window to the height of its contents and centers it vertically.
	*
	* The window sizes itself rather than being handed a height because only it knows how many commands
	* survived filtering- most of this menu is unlocked over the course of the game, so the count is not
	* knowable until the list has actually been built.
	*/
	fitToContents() {
		const desiredHeight = this.fittingHeight(Math.max(1, this.maxItems()));
		const height = Math.min(desiredHeight, Graphics.boxHeight);
		const y = Math.floor((Graphics.boxHeight - height) / 2);
		this.move(this.x, y, this.width, height);
	}
	/**
	* Overwrites {@link #updateHelp}.<br/>
	* Describes the highlighted command in the scene's help window.
	*/
	updateHelp() {
		if (!this._helpWindow) return;
		this._helpWindow.setText(this.currentHelpText());
	}
	/**
	* Remembers which command is currently highlighted, so it can be returned to later.
	*
	* Kept separately from the selection itself because a column losing focus is fully deselected- the
	* index is gone the moment the highlight is cleared, so it has to be captured beforehand.
	*/
	rememberSelection() {
		if (this.index() < 0) return;
		this._rememberedIndex = this.index();
	}
	/**
	* Restores the previously remembered selection, defaulting to the first command.
	*/
	restoreSelection() {
		const index = this._rememberedIndex ?? 0;
		this.select(Math.min(index, Math.max(0, this.maxItems() - 1)));
	}
	/**
	* Extends {@link #cursorRight}.<br/>
	* Moves focus to the column on the right, if there is one.
	*
	* A single-column list has no use for horizontal cursor movement- the engine no-ops it entirely- so
	* the input is free, and moving right between two side-by-side columns is what a player reaches for
	* first. This routes it to the same handler the shoulder buttons use, so both work and neither is a
	* special case.
	* @param {boolean} wrap Whether or not to wrap the cursor.
	*/
	cursorRight(wrap) {
		if (this.isHandled("content-next")) {
			this.callHandler("content-next");
			return;
		}
		super.cursorRight(wrap);
	}
	/**
	* Extends {@link #cursorLeft}.<br/>
	* Moves focus to the column on the left, if there is one.
	* @param {boolean} wrap Whether or not to wrap the cursor.
	*/
	cursorLeft(wrap) {
		if (this.isHandled("content-prev")) {
			this.callHandler("content-prev");
			return;
		}
		super.cursorLeft(wrap);
	}
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuActorCommand.js
/**
* The left column of the main menu, listing every scene scoped to a single actor.
*/
var Window_MenuActorCommand = class extends Window_MenuSectionCommand {
	/**
	* Implements {@link Window_MenuSectionCommand.menuSection}.<br/>
	* @returns {string}
	*/
	menuSection() {
		return MenuSection.Actor;
	}
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuPartyCommand.js
/**
* The right column of the main menu, listing every scene concerning the party or the game as a whole.
*
* This column also collects any command that never declared a section at all, which is what allows a
* plugin written before the menu was split- or one written by someone who never learned it was- to
* keep appearing rather than silently vanishing.
*/
var Window_MenuPartyCommand = class extends Window_MenuSectionCommand {
	/**
	* Implements {@link Window_MenuSectionCommand.menuSection}.<br/>
	* @returns {string}
	*/
	menuSection() {
		return MenuSection.Party;
	}
};

//#endregion
//#region src/plugins/cms/core/windows/Window_MenuStatus.js
/**
* Overwrites {@link #maxCols}.<br/>
* Renders one column per party member rather than one row.
*
* The party is a permanently fixed pair, so the center of the menu can afford to show every member at
* once side by side. Six stacked rows was the correct shape for a variable-size party filling a narrow
* strip; it wastes most of a wide center column and answers nothing the player was asking.
* @returns {number}
*/
Window_MenuStatus.prototype.maxCols = function() {
	return Math.max(1, $gameParty.size());
};
/**
* Overwrites {@link #numVisibleRows}.<br/>
* Every member is visible at once, so there is only ever one row of them.
* @returns {number}
*/
Window_MenuStatus.prototype.numVisibleRows = function() {
	return 1;
};
/**
* Overwrites {@link #itemHeight}.<br/>
* Each member's cell claims the full height of the window.
* @returns {number}
*/
Window_MenuStatus.prototype.itemHeight = function() {
	return this.innerHeight;
};
/**
* Overwrites {@link #drawItemImage}.<br/>
* Draws the actor's face at the top of their column.
*
* This is the only place in the game a full-size portrait appears. Concentrating it here is what
* permits every other actor-scoped scene to carry a compact ribbon instead of re-rendering the same
* artwork in a layout that has better uses for the space.
* @param {number} index The index of the party member being rendered.
*/
Window_MenuStatus.prototype.drawItemImage = function(index) {
	const actor = this.actor(index);
	const rect = this.itemRect(index);
	const faceX = rect.x + Math.floor((rect.width - ImageManager.faceWidth) / 2);
	this.drawActorFace(actor, faceX, rect.y, ImageManager.faceWidth, ImageManager.faceHeight);
};
/**
* Overwrites {@link #drawItemStatus}.<br/>
* Draws a member's details beneath their portrait.
*
* Deliberately sparse for now- name, level, class, and the basic gauges. What else belongs here is a
* question better answered against a working skeleton than guessed at in advance.
* @param {number} index The index of the party member being rendered.
*/
Window_MenuStatus.prototype.drawItemStatus = function(index) {
	const actor = this.actor(index);
	const rect = this.itemRect(index);
	const y = rect.y + ImageManager.faceHeight + this.lineHeight();
	const padding = this.itemPadding();
	const x = rect.x + padding;
	const width = rect.width - padding * 2;
	this.drawActorName(actor, x, y, width);
	this.drawActorLevel(actor, x, y + this.lineHeight());
	this.drawActorClass(actor, x, y + this.lineHeight() * 2, width);
	this.placeBasicGauges(actor, x, y + this.lineHeight() * 3);
};

//#endregion
//#region src/plugins/cms/core/scenes/Scene_Menu.js
/**
* Overwrites {@link #create}.<br/>
* Builds the main menu as three columns- actor commands, the party display, party commands.
*
* The two command columns mirror how the scenes behind them actually divide: some concern a single
* actor, the rest concern the party or the game. Two columns of eight read faster than one list of
* sixteen, because the grouping does the sorting on the player's behalf.
*/
Scene_Menu.prototype.create = function() {
	Scene_MenuBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createCommandWindow();
	this.createStatusWindow();
	this.createGoldWindow();
	this.createControlLegendWindow();
	this.actorCommandWindow().fitToContents();
	this.partyCommandWindow().fitToContents();
	this.actorCommandWindow().activate();
	this.actorCommandWindow().select(0);
};
/**
* The width of a single command column.
*
* Derived from the screen rather than fixed, so the layout holds at any resolution. Nothing in this
* scene may use a pixel literal- a hardcoded column width is exactly the drift this menu replaces.
* @returns {number}
*/
Scene_Menu.prototype.commandColumnWidth = function() {
	return Math.floor(Graphics.boxWidth * this.commandColumnRatio());
};
/**
* The proportion of the screen width given to each command column.
* @returns {number}
*/
Scene_Menu.prototype.commandColumnRatio = function() {
	return .22;
};
/**
* The width of the center stack, being whatever the two command columns do not claim.
*
* Expressed as the remainder rather than its own calculation, so rounding in the column widths can
* never leave an unclaimed strip down the middle of the screen.
* @returns {number}
*/
Scene_Menu.prototype.centerStackWidth = function() {
	return Graphics.boxWidth - this.commandColumnWidth() * 2;
};
/**
* The x coordinate at which the center stack begins.
* @returns {number}
*/
Scene_Menu.prototype.centerStackX = function() {
	return this.commandColumnWidth();
};
/**
* Builds the provisional rectangle for a command column.
*
* Only the width and left edge matter here. The column shrinks to its contents and centers itself
* once its list exists- see {@link Window_MenuSectionCommand.fitToContents}- because most of this
* menu is unlocked over the course of the game and the count is not knowable before then.
* @param {number} x The left edge of the column.
* @returns {Rectangle}
*/
Scene_Menu.prototype.floatingColumnRect = function(x) {
	return new Rectangle(x, 0, this.commandColumnWidth(), Graphics.boxHeight);
};
/**
* The rectangle for the actor command column, floating against the left edge.
* @returns {Rectangle}
*/
Scene_Menu.prototype.actorCommandWindowRect = function() {
	return this.floatingColumnRect(0);
};
/**
* The rectangle for the party command column, floating against the right edge.
* @returns {Rectangle}
*/
Scene_Menu.prototype.partyCommandWindowRect = function() {
	return this.floatingColumnRect(Graphics.boxWidth - this.commandColumnWidth());
};
/**
* Overwrites {@link #helpWindowRect}.<br/>
* The rectangle for the help window, capping the center stack.
* @returns {Rectangle}
*/
Scene_Menu.prototype.helpWindowRect = function() {
	return new Rectangle(this.centerStackX(), 0, this.centerStackWidth(), this.calcWindowHeight(this.helpWindowLineCount(), false));
};
/**
* How many lines of description the help window renders.
* @returns {number}
*/
Scene_Menu.prototype.helpWindowLineCount = function() {
	return 2;
};
/**
* Overwrites {@link #statusWindowRect}.<br/>
* The rectangle for the party display, filling the center stack between help and currency.
* @returns {Rectangle}
*/
Scene_Menu.prototype.statusWindowRect = function() {
	const wy = this.helpWindowRect().height;
	const wh = Graphics.boxHeight - wy - this.goldWindowRect().height;
	return new Rectangle(this.centerStackX(), wy, this.centerStackWidth(), wh);
};
/**
* Overwrites {@link #goldWindowRect}.<br/>
* The rectangle for the currency strip, flooring the center stack.
*
* Deliberately mirrors the help window at the opposite end of the stack, and spans the full center
* width rather than only as much as a gold value needs- this strip is intended to carry more than
* gold in future, and sizing it to today's contents would only mean resizing it later.
* @returns {Rectangle}
*/
Scene_Menu.prototype.goldWindowRect = function() {
	const wh = this.calcWindowHeight(1, true);
	const wy = Graphics.boxHeight - this.controlLegendWindowRect().height - wh;
	return new Rectangle(this.centerStackX(), wy, this.centerStackWidth(), wh);
};
/**
* The rectangle for the control legend, pinned across the full width of the bottom.
*
* Unlike the help window and currency strip, this spans the whole screen rather than only the center
* stack, because it describes the entire scene- including the two command columns that sit outside
* that stack.
* @returns {Rectangle}
*/
Scene_Menu.prototype.controlLegendWindowRect = function() {
	const wh = this.calcWindowHeight(1, false);
	return new Rectangle(0, Graphics.boxHeight - wh, Graphics.boxWidth, wh);
};
/**
* CMS menu keeps commands on the left- never mirror for right-side input.
* @returns {boolean}
*/
Scene_Menu.prototype.isRightInputMode = function() {
	return false;
};
/**
* CMS menu keeps help at the top- not the bottom strip layout.
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
/**
* Creates the control legend and adds it to tracking.
*/
Scene_Menu.prototype.createControlLegendWindow = function() {
	const window = new Window_ControlLegend(this.controlLegendWindowRect());
	window.setEntries(this.controlLegendEntries());
	this.addWindow(window);
};
/**
* The controls this menu teaches.
*
* Only the non-obvious ones are worth the space. Moving between the two columns is the entry that
* justifies this window existing at all- nothing about two side-by-side lists suggests the second one
* is reachable, which is precisely the sort of silent capability players never find.
* @returns {{semantic: string, label: string}[]}
*/
Scene_Menu.prototype.controlLegendEntries = function() {
	return [
		{
			semantic: "content-next",
			label: "switch column"
		},
		{
			semantic: "ok",
			label: "open"
		},
		{
			semantic: "cancel",
			label: "back"
		}
	];
};
/**
* Overwrites {@link #createCommandWindow}.<br/>
* Creates both command columns and exposes them behind a single broadcaster.
*
* Eight plugins alias this method and then call `this._commandWindow.setHandler(...)` to wire their
* own commands. Keeping both the method name and that property means all eight keep working
* untouched- `_commandWindow` is simply no longer a window, but something that hands each
* registration to both columns. Only the column actually rendering a given command can ever fire its
* handler.
*
* IMPORTANT: this is an overwrite rather than an alias, so any plugin patching this method must load
* AFTER this one or its patch is discarded. That is why J-CMS is ordered immediately after J-Base,
* ahead of every plugin that contributes a menu command- ordering it later silently breaks the
* handlers of anything loaded before it, while leaving their commands visibly rendered.
*/
Scene_Menu.prototype.createCommandWindow = function() {
	this.createActorCommandWindow();
	this.createPartyCommandWindow();
	this._commandWindow = new MenuCommandBroadcaster([this.actorCommandWindow(), this.partyCommandWindow()]);
	this.bindMenuCommandHandlers(this._commandWindow);
	this.actorCommandWindow().setHelpWindow(this._helpWindow);
	this.partyCommandWindow().setHelpWindow(this._helpWindow);
};
/**
* Creates the actor command column.
*/
Scene_Menu.prototype.createActorCommandWindow = function() {
	const window = new Window_MenuActorCommand(this.actorCommandWindowRect());
	window.setHandler("content-next", this.onFocusPartyColumn.bind(this));
	window.setHandler("cancel", this.popScene.bind(this));
	this.setActorCommandWindow(window);
	this.addWindow(window);
};
/**
* Creates the party command column.
*/
Scene_Menu.prototype.createPartyCommandWindow = function() {
	const window = new Window_MenuPartyCommand(this.partyCommandWindowRect());
	window.setHandler("content-prev", this.onFocusActorColumn.bind(this));
	window.setHandler("cancel", this.popScene.bind(this));
	window.deactivate();
	window.deselect();
	this.setPartyCommandWindow(window);
	this.addWindow(window);
};
/**
* Gets the actor command column.
* @returns {Window_MenuActorCommand}
*/
Scene_Menu.prototype.actorCommandWindow = function() {
	return this._j._cms._actorCommandWindow;
};
/**
* Sets the actor command column to the given window.
* @param {Window_MenuActorCommand} window The window to track.
*/
Scene_Menu.prototype.setActorCommandWindow = function(window) {
	this._j ||= {};
	this._j._cms ||= {};
	this._j._cms._actorCommandWindow = window;
};
/**
* Gets the party command column.
* @returns {Window_MenuPartyCommand}
*/
Scene_Menu.prototype.partyCommandWindow = function() {
	return this._j._cms._partyCommandWindow;
};
/**
* Sets the party command column to the given window.
* @param {Window_MenuPartyCommand} window The window to track.
*/
Scene_Menu.prototype.setPartyCommandWindow = function(window) {
	this._j ||= {};
	this._j._cms ||= {};
	this._j._cms._partyCommandWindow = window;
};
/**
* Hands focus to the party column.
*/
Scene_Menu.prototype.onFocusPartyColumn = function() {
	this.swapColumnFocus(this.actorCommandWindow(), this.partyCommandWindow());
};
/**
* Hands focus back to the actor column.
*/
Scene_Menu.prototype.onFocusActorColumn = function() {
	this.swapColumnFocus(this.partyCommandWindow(), this.actorCommandWindow());
};
/**
* Moves focus from one command column to the other.
*
* The column being left is fully deselected rather than merely deactivated, because a dormant column
* still showing a highlighted row reads as though two things are selected at once. Its position is
* remembered separately so returning to it lands where the player left off instead of snapping back
* to the top.
* @param {Window_MenuSectionCommand} leaving The column losing focus.
* @param {Window_MenuSectionCommand} entering The column gaining focus.
*/
Scene_Menu.prototype.swapColumnFocus = function(leaving, entering) {
	leaving.rememberSelection();
	leaving.deactivate();
	leaving.deselect();
	entering.activate();
	entering.restoreSelection();
	entering.updateHelp();
};
/**
* Binds the handlers for every command either column may contain.
*
* Both columns are wired identically, because a command's section decides which column renders it-
* not which handlers exist. A command that never appears in a given column simply never fires there,
* and wiring both means a plugin retagging its command needs no change here.
* @param {MenuCommandBroadcaster} window The broadcaster feeding both command columns.
*/
Scene_Menu.prototype.bindMenuCommandHandlers = function(window) {
	window.setHandler("skill", this.commandActorScene.bind(this, Scene_Skill));
	window.setHandler("equip", this.commandActorScene.bind(this, Scene_Equip));
	window.setHandler("status", this.commandActorScene.bind(this, Scene_Status));
	window.setHandler("item", this.commandItem.bind(this));
	window.setHandler("options", this.commandOptions.bind(this));
	window.setHandler("save", this.commandSave.bind(this));
	window.setHandler("gameEnd", this.commandGameEnd.bind(this));
};
/**
* Opens a scene scoped to the currently selected actor.
*
* Vanilla routes these three commands through an actor-selection window first, to answer "which of
* the party did you mean?". A permanently two-person party whose scenes each carry their own actor
* ribbon does not need that question asked, so the scene is pushed immediately and resolves the menu
* actor itself- which {@link Game_Party.menuActor} always answers with a valid party member.
* @param {Function} sceneClass The scene to open.
*/
Scene_Menu.prototype.commandActorScene = function(sceneClass) {
	SceneManager.push(sceneClass);
};

//#endregion
//# sourceMappingURL=J-CMS.js.map