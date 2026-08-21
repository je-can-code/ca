//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 CMS] A redesign of the main menu.
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
 * CHANGELOG:
 * - 1.2.0
 *    The menu gold strip is now a currency strip: CurrencyDefinition describes
 *    a currency, registerCoreCurrencies declares gold, and Window_Currencies
 *    renders however many are registered. Extensions add their own without
 *    touching the scene.
 * - 1.1.0
 *    Each party member's cell is now a character card rather than a data row.
 *    It is headed by their name with their class beneath it, carries their map
 *    sprite beside their portrait, and is banded into sections by rules.
 *    Level and remaining experience share a row, since a level means little
 *    without knowing how close the next one is.
 *    Resources are drawn as segmented gauges spanning the cell, marked by icon
 *    rather than by abbreviation and trailed by their current and maximum
 *    values.
 *    Afflicting states are listed by icon, and an actor suffering none says so
 *    rather than leaving the row blank.
 *    Every equipment slot is listed, with empty ones named and dimmed rather
 *    than omitted, so the block keeps its shape as gear comes and goes.
 *    A drawExtensionData hook sits alongside level and experience for other
 *    plugins to contribute to; it returns the position it finished at, so any
 *    number of them may each claim a row without knowing about one another.
 *    The party display no longer tints each cell behind its contents. That
 *    tint marks which row a cursor is on, and nothing selects a party member
 *    here- it advertised an interaction that does not exist.
 *    Fixed the party display overrunning the currency strip by the height of
 *    the control legend. It was measuring its own floor from the bottom of the
 *    screen by the strip's height rather than stopping at the strip's position,
 *    and the sixty pixels it overran were hidden underneath the very window
 *    that caused it.
 *    Command help text no longer refers to "this character", which pointed at
 *    a referent the menu never identifies.
 * - 1.0.0
 *    The initial release.
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
 * @default Review the abilities you've learned.
 *
 * @param help-equip
 * @parent parentConfig
 * @type multiline_string
 * @text Equipment
 * @desc Describes the equipment command in the menu's help window.
 * @default Change the weapons and armor you have equipped.
 *
 * @param help-status
 * @parent parentConfig
 * @type multiline_string
 * @text Status
 * @desc Describes the status command in the menu's help window.
 * @default Inspect your parameters in detail.
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
J.CMS = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CMS.Metadata = new J_CmsMain_PluginMetadata("J-CMS", "1.2.0");
/**
* The plugin umbrella that governs all extensions of this plugin.
*/
J.CMS.EXT = {};

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
//#region src/plugins/cms/core/_models/CurrencyDefinition.js
/**
* One kind of spendable thing the currency strip is willing to display.
*
* A definition is a description rather than a value: it knows what to call itself, what to draw beside
* itself, and how to go and ask for the current amount. That last part is a function on purpose- a
* balance changes constantly, and a strip caching numbers would be a strip showing yesterday's.
*
* The menu owns the strip but not what goes in it. Anything with a currency describes it this way and
* hands it over, which is what lets the menu display a thing it has never heard of.
*/
var CurrencyDefinition = class {
	/**
	* The unique identifier for this currency, used to keep the same one from being added twice.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The icon drawn beside the amount, or -1 to draw none.
	* @type {number}
	*/
	iconIndex = -1;
	/**
	* Answers with the short label drawn beside the amount.<br/>
	* Declared without a default, because the constructor requires one and a stand-in nobody can ever
	* observe is just a lie about what happens when it is missing.
	* @type {function(): string}
	*/
	unitProvider;
	/**
	* Answers with the amount currently held.<br/>
	* Declared without a default, for the same reason as the label above it.
	* @type {function(): number}
	*/
	amountProvider;
	/**
	* Constructor.
	*
	* Both halves are functions rather than values, and for the same reason. An amount changes constantly.
	* A label can come from the database- gold's does- and the database does not exist at the moment a
	* plugin registers itself, so reading one eagerly would throw before the title screen.
	* @param {string} key The unique identifier for this currency.
	* @param {number} iconIndex The icon drawn beside the amount, or -1 for none.
	* @param {function(): string} unitProvider Answers with the short label drawn beside the amount.
	* @param {function(): number} amountProvider Answers with the amount currently held.
	*/
	constructor(key, iconIndex, unitProvider, amountProvider) {
		this.key = key;
		this.iconIndex = iconIndex;
		this.unitProvider = unitProvider;
		this.amountProvider = amountProvider;
	}
	/**
	* The short label drawn beside the amount.
	* @returns {string}
	*/
	unit() {
		return this.unitProvider();
	}
	/**
	* The amount currently held of this currency.
	* @returns {number}
	*/
	amount() {
		return this.amountProvider();
	}
	/**
	* Whether this currency draws an icon beside its amount.
	* @returns {boolean}
	*/
	hasIcon() {
		return this.iconIndex > -1;
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
//#region src/plugins/cms/core/helpers/MenuStatusCatalog.js
/**
* The contents of a single actor's cell in the main menu's party display, decided but not drawn.
*
* What belongs in a cell is a policy question that keeps changing as the game grows; how a line of
* text lands on a bitmap is not. Separating the two means the policy can be exercised directly-
* asking what an actor with an empty weapon slot reads as should not require standing up a window,
* a bitmap, and a font metric to find out.
*
* Every method here is static and takes the actor rather than the window, because nothing in this
* class measures or draws. These are answers about a battler, not about a rectangle.
*/
var MenuStatusCatalog = class MenuStatusCatalog {
	/**
	* Stands in for the item name of a slot holding nothing.
	* @type {string}
	*/
	static EMPTY_SLOT_TEXT = "nothing equipped";
	/**
	* Stands in for the experience readout of an actor with no further levels to earn.
	* @type {string}
	*/
	static MAX_LEVEL_TEXT = "MAX";
	/**
	* Separates the level from the distance to the next one.
	* @type {string}
	*/
	static LEVEL_DIVIDER = "-";
	/**
	* Stands in for the state icons of an actor suffering nothing at all.
	*
	* An empty row would read as "this section has not loaded" rather than as good news. Saying it
	* outright costs one line and removes the ambiguity.
	* @type {string}
	*/
	static UNAFFLICTED_TEXT = "Unafflicted";
	/**
	* The level readout for an actor.
	*
	* The bare number, with no word naming it. The icon drawn beside it says what it is, and it says
	* so in the same visual language every other measure in this menu uses- a player who has learned
	* one of these icons has learned all of them, which is worth more than a word repeated on every
	* row.
	* @param {Game_Actor} actor The actor whose level is being described.
	* @returns {string}
	*/
	static levelValue(actor) {
		return `${actor.level}`;
	}
	/**
	* The resources worth showing for an actor, in the order they are drawn.
	*
	* Each row carries the numbers and the fill rate, but names its resource with a key rather than a
	* color- what blue means is a question for whatever draws the row, and answering it here would
	* drag ColorManager into a class that otherwise never touches the screen.
	*
	* Tech is included only when the database says to display it, which is the same condition the
	* engine's own gauge placement honors.
	* @param {Game_Actor} actor The actor whose resources are being catalogued.
	* @returns {{key: string, label: string, current: number, max: number, rate: number}[]}
	*/
	static resourceRows(actor) {
		const rows = [MenuStatusCatalog.buildResourceRow("hp", TextManager.hpA, actor.hp, actor.mhp), MenuStatusCatalog.buildResourceRow("mp", TextManager.mpA, actor.mp, actor.mmp)];
		if ($dataSystem.optDisplayTp) {
			rows.push(MenuStatusCatalog.buildResourceRow("tp", TextManager.tpA, actor.tp, actor.maxTp()));
		}
		return rows;
	}
	/**
	* Builds a single resource row, including the fill rate its gauge needs.
	*
	* A resource with no capacity reads as empty rather than as a division by zero. That is a real
	* state rather than a defensive one- an actor with no magic at all has an mmp of zero, and the row
	* still has to render something.
	* @param {string} key Which resource this is, being one of 'hp', 'mp', or 'tp'.
	* @param {string} label The abbreviation the database names this resource with.
	* @param {number} current How much of the resource the actor currently holds.
	* @param {number} max How much of the resource the actor can hold.
	* @returns {{key: string, label: string, current: number, max: number, rate: number}}
	*/
	static buildResourceRow(key, label, current, max) {
		return {
			key,
			label,
			current,
			max,
			rate: max === 0 ? 0 : current / max
		};
	}
	/**
	* The icons of every state currently afflicting an actor.
	*
	* States without an icon are dropped rather than drawn as a gap. A state that chose not to show
	* itself in the status bar has no business claiming space in the menu either.
	* @param {Game_Actor} actor The actor whose afflictions are being catalogued.
	* @returns {number[]}
	*/
	static stateIcons(actor) {
		return actor.states().map((state) => state.iconIndex).filter((iconIndex) => iconIndex > 0);
	}
	/**
	* Builds one row per equipment slot the actor wears, in the order they are worn.
	*
	* Empty slots are kept rather than dropped. A missing weapon is itself information, and dropping
	* the row would leave the player counting slots to work out which one they forgot to fill- while
	* also making the block shift height every time a piece of gear comes or goes.
	* @param {Game_Actor} actor The actor whose loadout is being catalogued.
	* @returns {{item: RPG_EquipItem, slotName: string, isEquipped: boolean}[]}
	*/
	static equipmentRows(actor) {
		const slotTypeIds = actor.equipSlots();
		const equips = actor.equips();
		return slotTypeIds.map((slotTypeId, index) => {
			const item = equips.at(index);
			return MenuStatusCatalog.buildEquipmentRow(slotTypeId, item);
		});
	}
	/**
	* Builds a single equipment row from a slot type and whatever currently occupies it.
	*
	* The slot name is resolved here rather than at draw time so that an empty row still knows what
	* it stands for. A filled row identifies itself by the item's own icon and name, but an empty one
	* has neither and would otherwise be an anonymous blank line.
	* @param {number} slotTypeId The 1-based equip type this slot accepts.
	* @param {RPG_EquipItem} item The equipment in the slot, or null while the slot is empty.
	* @returns {{item: RPG_EquipItem, slotName: string, isEquipped: boolean}}
	*/
	static buildEquipmentRow(slotTypeId, item) {
		return {
			item,
			slotName: TextManager.equipType(slotTypeId),
			isEquipped: item !== null
		};
	}
	/**
	* The experience readout for an actor, phrased as the distance still to travel.
	*
	* Deliberately derived from the actor rather than stated as a constant. The size of a level is a
	* plugin parameter of J-Level-Flat, so a readout naming today's interval would quietly begin
	* lying the moment that parameter changed- and nothing would report the discrepancy.
	* @param {Game_Actor} actor The actor whose progress is being described.
	* @returns {string}
	*/
	static experienceLabel(actor) {
		if (actor.isMaxLevel()) return MenuStatusCatalog.MAX_LEVEL_TEXT;
		const remaining = actor.nextLevelExp() - actor.currentExp();
		return `${remaining} to next level`;
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
	* Catalog group ids per visual row band (left column, then middle column).
	*
	* Three bands, all paired, leaving the bottom of the page free for the elemental and ailment
	* affiliations.
	* @type {Array<[string, string]>}
	*/
	static PAGE_GROUP_ROW_GROUPS = [
		["combat", "vitality"],
		["precision", "defensive"],
		["support", "fate"]
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
	/**
	* The size step affiliation rows shrink by, relative to body copy.
	*
	* Smaller than the catalog rows above them, because these are exceptions rather than the standing
	* facts about a battler- an actor with no unusual resistances shows none of them at all.
	* @returns {number}
	*/
	static affiliationFontSizeModifier() {
		return -6;
	}
	/**
	* The range of state ids treated as ailments worth reporting resistance to.
	*
	* Deliberately a narrow band rather than every state in the database. There are over a thousand, the
	* overwhelming majority of which are passives, affixes, food buffs and other machinery the player
	* never resists. These are the debilitations they actually build against.
	* @returns {[number, number]} The inclusive start and exclusive end of the band.
	*/
	static ailmentStateIdRange() {
		return [4, 18];
	}
	/**
	* Y coordinate for the horizontal rule beneath a section title.
	* @param {Window_Base} window The window doing the drawing.
	* @param {number} sectionY The section's content anchor y, same as catalog groups use.
	* @returns {number}
	*/
	static affiliationSeparatorY(window, sectionY) {
		const rowBaseY = sectionY + 8;
		const firstRowY = rowBaseY - 2 + window.lineHeight();
		return firstRowY - 4;
	}
	/**
	* Collects element affiliation rows that differ from the 100% baseline.
	*
	* Read through {@link Game_Battler.elementRate} rather than summed from traits, so what the panel
	* claims and what combat actually does cannot disagree- including J-Elementalistics absorption.
	* @param {Game_Actor} actor The actor to inspect.
	* @param {number} limit The number of elements to inspect.
	* @returns {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>}
	*/
	static collectElementAffiliationRows(actor, limit = 10) {
		/** @type {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} */
		const rows = [];
		$dataSystem.elements.slice(0, limit).forEach((elementName, index) => {
			const absorbed = J.ELEM && actor.isElementAbsorbed(index);
			const combatRate = actor.elementRate(index);
			const magnitudePercent = Math.round(Math.abs(combatRate) * 100);
			const formatted = AffiliationDisplay.formatDelta(magnitudePercent, {
				absorbed,
				immune: absorbed === false && magnitudePercent <= 0
			});
			if (!formatted) return;
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
	*
	* Read through {@link Game_Battler.stateRate} for the same reason the elements are.
	* @param {Game_Actor} actor The actor to inspect.
	* @returns {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>}
	*/
	static collectAilmentAffiliationRows(actor) {
		/** @type {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} */
		const rows = [];
		const [firstId, lastId] = this.ailmentStateIdRange();
		$dataStates.slice(firstId, lastId).forEach((state) => {
			if (!state) return;
			const immune = actor.isStateResist(state.id);
			const ratePercent = immune ? 0 : Math.round(actor.stateRate(state.id) * 100);
			const formatted = AffiliationDisplay.formatDelta(ratePercent, { immune });
			if (!formatted) return;
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
	* Draws one affiliation row: icon, name, and the deviation from baseline.
	* @param {Window_Base} window The window doing the drawing.
	* @param {{name: string, value: string, iconIndex: number, colorIndex: number}} row The row to draw.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width available for this row.
	*/
	static drawAffiliationRow(window, row, x, y, sectionWidth) {
		window.resetFontSettings();
		window.modFontSize(this.affiliationFontSizeModifier());
		const modifiedX = x + ImageManager.iconWidth + 4;
		const gap = 8;
		const valuePixelWidth = this.styledValuePixelWidth(window, row.value);
		const nameWidth = Math.max(48, sectionWidth - (modifiedX - x) - valuePixelWidth - gap);
		window.drawIcon(row.iconIndex, x, y);
		window.drawText(`${row.name}`, modifiedX, y, nameWidth, "left");
		window.drawStyledPaddedValue(x, y, row.value, sectionWidth, 8, row.colorIndex);
		window.resetFontSettings();
	}
	/**
	* Draws a single placeholder row for a section where every entry sits at the baseline.
	* @param {Window_Base} window The window doing the drawing.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width available for this row.
	*/
	static drawAffiliationBaselineRow(window, x, y, sectionWidth) {
		window.resetFontSettings();
		window.modFontSize(this.affiliationFontSizeModifier());
		window.changeTextColor(ColorManager.textColor(7));
		window.drawText("All standard", x, y, sectionWidth, "center");
		window.resetFontSettings();
	}
	/**
	* Draws filtered affiliation rows beneath a section header.
	* @param {Window_Base} window The window doing the drawing.
	* @param {number} x The x coordinate.
	* @param {number} y The section anchor y.
	* @param {number} sectionWidth The width available for each row.
	* @param {Array<{name: string, value: string, iconIndex: number, colorIndex: number}>} rows The rows.
	* @returns {number} The y coordinate just below the last visible row.
	*/
	static drawAffiliationRows(window, x, y, sectionWidth, rows) {
		if (rows.length === 0) {
			const rowY = y + window.lineHeight() + 8;
			this.drawAffiliationBaselineRow(window, x, rowY, sectionWidth);
			return rowY + window.lineHeight();
		}
		rows.forEach((row, index) => {
			const rowY = y + (index + 1) * window.lineHeight() + 8;
			this.drawAffiliationRow(window, row, x, rowY, sectionWidth);
		});
		return y + (rows.length + 1) * window.lineHeight() + 8;
	}
	/**
	* Draws the elemental affiliations section.
	* @param {Window_Base} window The window doing the drawing.
	* @param {Game_Actor} actor The actor to inspect.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width of this section.
	* @param {number} limit The number of elements to inspect.
	* @returns {number} The y coordinate just below the last drawn row.
	*/
	static drawElementAffiliations(window, actor, x, y, sectionWidth, limit = 10) {
		const titleY = y - 15;
		this.drawTitle(window, "Elements", x, titleY, 64, 8, "center", sectionWidth);
		window.drawHorizontalLine(x, this.affiliationSeparatorY(window, y), sectionWidth, 3);
		return this.drawAffiliationRows(window, x, y, sectionWidth, this.collectElementAffiliationRows(actor, limit));
	}
	/**
	* Draws the ailment affiliations section.
	* @param {Window_Base} window The window doing the drawing.
	* @param {Game_Actor} actor The actor to inspect.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	* @param {number} sectionWidth The width of this section.
	* @returns {number} The y coordinate just below the last drawn row.
	*/
	static drawAilmentAffiliations(window, actor, x, y, sectionWidth) {
		const titleY = y - 15;
		this.drawTitle(window, "Ailments", x, titleY, 2, 8, "center", sectionWidth);
		window.drawHorizontalLine(x, this.affiliationSeparatorY(window, y), sectionWidth, 3);
		return this.drawAffiliationRows(window, x, y, sectionWidth, this.collectAilmentAffiliationRows(actor));
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
		const item = new WindowCommandBuilder(TextManager.item).setSymbol("item").setHelpText(J.CMS.Metadata.helpTextFor("item")).setEnabled(enabled).setIconIndex(2567).setMenuSection(MenuSection.Party).build();
		this.addBuiltCommand(item);
	}
	if (this.needsCommand("skill")) {
		const skill = new WindowCommandBuilder(TextManager.skill).setSymbol("skill").setHelpText(J.CMS.Metadata.helpTextFor("skill")).setEnabled(enabled).setIconIndex(2564).setMenuSection(MenuSection.Actor).build();
		this.addBuiltCommand(skill);
	}
	if (this.needsCommand("equip")) {
		const equip = new WindowCommandBuilder(TextManager.equip).setSymbol("equip").setHelpText(J.CMS.Metadata.helpTextFor("equip")).setEnabled(enabled).setIconIndex(2565).setMenuSection(MenuSection.Actor).build();
		this.addBuiltCommand(equip);
	}
};
/**
* Overwrites {@link #addOptionsCommand}.<br/>
* Adds the options command when the plugin list includes it.
*/
Window_MenuCommand.prototype.addOptionsCommand = function() {
	if (this.needsCommand("options") === false) return;
	const enabled = this.isOptionsEnabled();
	const options = new WindowCommandBuilder(TextManager.options).setSymbol("options").setHelpText(J.CMS.Metadata.helpTextFor("options")).setEnabled(enabled).setIconIndex(2566).setMenuSection(MenuSection.Party).build();
	this.addBuiltCommand(options);
};
/**
* Overwrites {@link #addGameEndCommand}.<br/>
* Adds the game-end command with CMS icon styling.
*/
Window_MenuCommand.prototype.addGameEndCommand = function() {
	const enabled = this.isGameEndEnabled();
	const gameEnd = new WindowCommandBuilder(TextManager.gameEnd).setSymbol("gameEnd").setHelpText(J.CMS.Metadata.helpTextFor("gameEnd")).setEnabled(enabled).setIconIndex(2562).setMenuSection(MenuSection.Party).build();
	this.addBuiltCommand(gameEnd);
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
	* Gets the remembered index.
	* @returns {number} The rememberedIndex.
	*/
	rememberedIndex() {
		return this._rememberedIndex;
	}
	/**
	* Sets the remembered index.
	* @param {number} newRememberedIndex The new rememberedIndex.
	*/
	setRememberedIndex(newRememberedIndex) {
		this._rememberedIndex = newRememberedIndex;
	}
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
	* Remembers which command is currently highlighted, so it can be returned to later.
	*
	* Kept separately from the selection itself because a column losing focus is fully deselected- the
	* index is gone the moment the highlight is cleared, so it has to be captured beforehand.
	*/
	rememberSelection() {
		if (this.index() < 0) return;
		this.setRememberedIndex(this.index());
	}
	/**
	* Restores the previously remembered selection, defaulting to the first command.
	*/
	restoreSelection() {
		const index = this.rememberedIndex() ?? 0;
		this.select(Math.min(index, Math.max(0, this.maxItems() - 1)));
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
* Overwrites {@link Window_Selectable.drawItemBackground}.<br/>
* Draws no backing behind a member's cell.
*
* The tinted rectangle behind a row exists to show which row the cursor is on. Nothing selects a
* party member here- the two command columns own the cursor and this window is read-only- so the
* tint marks nothing, and reads as a panel the player ought to be able to interact with. The engine
* does the same for its own read-only {@link Window_StatusParams}.
* @param {number} _index The index of the party member whose cell would have been backed.
*/
Window_MenuStatus.prototype.drawItemBackground = function(_index) {};
/**
* Overwrites {@link #drawItemImage}.<br/>
* Draws the actor's name across the top, then their face and map sprite beneath it.
*
* The name leads because a cell without a header reads as a data row rather than as a person- the
* player has to infer whose column this is from the artwork. Naming it first turns the column into a
* card, which is the difference between a menu and a screen worth looking at.
*
* Two graphics rather than one because they answer different questions. The face is who this person
* is in a conversation; the map sprite is who the player has been looking at for the last several
* hours of play, and in an action game that is the stronger identification of the two.
* @param {number} index The index of the party member being rendered.
*/
Window_MenuStatus.prototype.drawItemImage = function(index) {
	const actor = this.actor(index);
	const rect = this.itemRect(index);
	this.drawActorNameHeader(actor, rect);
	this.drawActorClassSubtitle(actor, rect);
	const artY = rect.y + this.headerHeight();
	const pairWidth = ImageManager.faceWidth + this.walkSpriteGap() + this.walkSpriteWidth();
	const pairX = rect.x + Math.floor((rect.width - pairWidth) / 2);
	this.drawActorFace(actor, pairX, artY, ImageManager.faceWidth, ImageManager.faceHeight);
	const spriteCenterX = pairX + ImageManager.faceWidth + this.walkSpriteGap() + this.walkSpriteWidth() / 2;
	this.drawActorWalkSprite(actor, Math.floor(spriteCenterX), artY + ImageManager.faceHeight);
};
/**
* Draws the actor's name across the top of their cell, enlarged and centered.
*
* Enlarged because this is the one piece of text in the cell that identifies everything below it,
* and centered because the artwork beneath it is centered- a left-aligned name over centered
* portraits reads as a mistake rather than as a choice.
* @param {Game_Actor} actor The actor being named.
* @param {Rectangle} rect The bounds of the cell.
*/
Window_MenuStatus.prototype.drawActorNameHeader = function(actor, rect) {
	this.contents.fontSize = $gameSystem.mainFontSize() + this.headerFontBoost();
	this.drawText(actor.name(), rect.x, rect.y, rect.width, "center");
	this.resetFontSettings();
};
/**
* Draws the actor's class beneath their name, as a subtitle.
*
* Upper-cased and shrunk because it is a category rather than a proper noun- the name is who this
* person is and the class is what they currently are, and the two carrying identical weight would
* make the header read as two names. Tinted for the same reason, so the eye can tell at a glance
* which line is the one it was looking for.
* @param {Game_Actor} actor The actor whose class is being named.
* @param {Rectangle} rect The bounds of the cell.
*/
Window_MenuStatus.prototype.drawActorClassSubtitle = function(actor, rect) {
	this.resetFontSettings();
	const className = actor.currentClass().name.toUpperCase();
	const shrunk = this.modFontSizeForText(this.classSubtitleFontShrink(), className);
	const subtitle = this.colorizeText(this.classSubtitleColorIndex(), shrunk);
	const subtitleWidth = this.textSizeEx(subtitle).width;
	const subtitleX = rect.x + Math.floor((rect.width - subtitleWidth) / 2);
	this.drawTextEx(subtitle, subtitleX, rect.y + this.lineHeight(), rect.width);
};
/**
* How much larger than body text the cell's name header is drawn.
* @returns {number}
*/
Window_MenuStatus.prototype.headerFontBoost = function() {
	return 8;
};
/**
* How much smaller than body text the class subtitle is drawn.
* @returns {number}
*/
Window_MenuStatus.prototype.classSubtitleFontShrink = function() {
	return -6;
};
/**
* The palette index the class subtitle is tinted with.
* @returns {number}
*/
Window_MenuStatus.prototype.classSubtitleColorIndex = function() {
	return 1;
};
/**
* The vertical space the name and class claim before the artwork begins.
* @returns {number}
*/
Window_MenuStatus.prototype.headerHeight = function() {
	return this.lineHeight() * 2;
};
/**
* Draws an actor's map sprite in its neutral standing pose, facing the player.
*
* The engine's own {@link Window_Base.drawCharacter} selects exactly this frame, but blits it at
* native size, which leaves it dwarfed by the portrait beside it. This exists solely to draw that
* same frame enlarged.
*
* Nothing here requests the sheet in advance. The party's own map sprites are necessarily cached by
* the time a menu can be opened at all, and the scene refreshes this window again on start, which is
* the same safety net the face graphics beside them have always relied on.
* @param {Game_Actor} actor The actor whose map sprite is being drawn.
* @param {number} x The horizontal center of the drawn sprite.
* @param {number} y The baseline the sprite stands on.
*/
Window_MenuStatus.prototype.drawActorWalkSprite = function(actor, x, y) {
	const characterName = actor.characterName();
	const bitmap = ImageManager.loadCharacter(characterName);
	const isBig = ImageManager.isBigCharacter(characterName);
	const frameWidth = bitmap.width / (isBig ? 3 : 12);
	const frameHeight = bitmap.height / (isBig ? 4 : 8);
	const position = isBig ? 0 : actor.characterIndex();
	const sourceX = (position % 4 * 3 + 1) * frameWidth;
	const sourceY = Math.floor(position / 4) * 4 * frameHeight;
	const scale = this.walkSpriteScale();
	const drawWidth = frameWidth * scale;
	const drawHeight = frameHeight * scale;
	const destinationX = x - Math.floor(drawWidth / 2);
	const destinationY = y - drawHeight;
	const { context } = this.contents;
	context.imageSmoothingEnabled = false;
	this.contents.blt(bitmap, sourceX, sourceY, frameWidth, frameHeight, destinationX, destinationY, drawWidth, drawHeight);
	context.imageSmoothingEnabled = true;
};
/**
* How much larger than native the map sprite is drawn.
*
* Matching the portrait's height is the wrong target. Chibi proportions spend most of a frame on the
* head, so a sprite standing as tall as a face does not read as its equal- it reads as looming. Two
* keeps the sprite a companion to the portrait rather than a competitor, which is the relationship
* worth preserving even if these proportions are later replaced with something less top-heavy.
*
* Whole numbers only- these are pixel art, and a fractional scale resamples them into mush.
* @returns {number}
*/
Window_MenuStatus.prototype.walkSpriteScale = function() {
	return 2;
};
/**
* The horizontal space the drawn map sprite claims.
*
* Derived from the map's tile size rather than measured off the sheet, because the layout has to
* know this width before the sheet has necessarily finished loading.
* @returns {number}
*/
Window_MenuStatus.prototype.walkSpriteWidth = function() {
	return $gameMap.tileWidth() * this.walkSpriteScale();
};
/**
* Clear air between the face and the map sprite.
* @returns {number}
*/
Window_MenuStatus.prototype.walkSpriteGap = function() {
	return 16;
};
/**
* Overwrites {@link #drawItemStatus}.<br/>
* Draws a member's details beneath their portrait.
*
* Ordered by how often the answer is wanted rather than by how the data happens to be stored: how
* far along they are, how they are holding up, what is currently wrong with them, and what they are
* carrying. Each block is separated by a rule, because five stacks of text at one rhythm reads as a
* single undifferentiated list no matter how well the individual rows are drawn.
* @param {number} index The index of the party member being rendered.
*/
Window_MenuStatus.prototype.drawItemStatus = function(index) {
	const actor = this.actor(index);
	const rect = this.itemRect(index);
	const padding = this.itemPadding();
	const x = rect.x + padding;
	const width = rect.width - padding * 2;
	let y = rect.y + this.headerHeight() + ImageManager.faceHeight + this.sectionGap();
	this.drawLevelAndExperience(actor, x, y, width);
	y += this.lineHeight();
	y = this.drawExtensionData(actor, x, y, width);
	y = this.drawSectionBreak(x, y, width);
	y = this.drawActorResources(actor, x, y, width);
	y = this.drawSectionBreak(x, y, width);
	this.drawActorStates(actor, x, y, width);
	y += this.lineHeight();
	y = this.drawSectionBreak(x, y, width);
	this.drawEquipment(actor, x, y, width);
};
/**
* Clear air on either side of the rule dividing one block of details from the next.
* @returns {number}
*/
Window_MenuStatus.prototype.sectionGap = function() {
	return Math.floor(this.lineHeight() / 2);
};
/**
* The thickness of the rule dividing one block of details from the next.
*
* Four rather than the two {@link Window_Base.drawHorizontalLine} defaults to, because that default
* cannot draw its own color- see {@link #drawSectionBreak} for why.
* @returns {number}
*/
Window_MenuStatus.prototype.sectionRuleHeight = function() {
	return 4;
};
/**
* Draws the rule dividing one block of details from the next.
*
* Returns the y the following block begins at rather than expecting the caller to add the gap twice
* and get it right- a divider is one thing, and the space it occupies should be one number.
* @param {number} x The left edge of the rule.
* @param {number} y The top of the space the divider occupies.
* @param {number} width The width available to the rule.
* @returns {number}
*/
Window_MenuStatus.prototype.drawSectionBreak = function(x, y, width) {
	const gap = this.sectionGap();
	this.resetTextColor();
	this.drawHorizontalLine(x, y + Math.floor(gap / 2), width, this.sectionRuleHeight());
	return y + gap;
};
/**
* Draws the actor's level and the distance to their next one as a single row.
*
* These are one thought rather than two- a level means little without knowing how close the next one
* is, and separating them by three gauges is what left the experience readout looking stranded when
* it lived on its own. The divider between them is what keeps a left-aligned and a right-aligned
* value from reading as two unrelated pieces of text that happen to share a line.
* @param {Game_Actor} actor The actor whose progress is being drawn.
* @param {number} x The left edge of the row.
* @param {number} y The top of the row.
* @param {number} width The width available to the row.
*/
Window_MenuStatus.prototype.drawLevelAndExperience = function(actor, x, y, width) {
	const levelValue = MenuStatusCatalog.levelValue(actor);
	const experienceLabel = MenuStatusCatalog.experienceLabel(actor);
	const iconY = y + Math.floor((this.lineHeight() - ImageManager.iconHeight) / 2);
	this.drawIcon(IconManager.level(), x, iconY);
	const levelMargin = ImageManager.standardIconWidth + 8;
	this.resetTextColor();
	this.drawText(levelValue, x + levelMargin, y, width - levelMargin, "left");
	this.drawText(experienceLabel, x, y, width, "right");
	const levelWidth = levelMargin + this.textWidth(levelValue);
	const experienceWidth = this.textWidth(experienceLabel);
	const gapWidth = width - levelWidth - experienceWidth;
	if (gapWidth <= 0) return;
	this.changePaintOpacity(false);
	this.drawText(MenuStatusCatalog.LEVEL_DIVIDER, x + levelWidth, y, gapWidth, "center");
	this.changePaintOpacity(true);
};
/**
* Draws every resource this actor carries, one gauge per line.
* @param {Game_Actor} actor The actor whose resources are being drawn.
* @param {number} x The left edge of the block.
* @param {number} y The top of the block.
* @param {number} width The width available to each row.
* @returns {number} The y coordinate immediately beneath the block.
*/
Window_MenuStatus.prototype.drawActorResources = function(actor, x, y, width) {
	const rows = MenuStatusCatalog.resourceRows(actor);
	rows.forEach((row, index) => {
		const rowY = y + this.lineHeight() * index;
		this.drawResourceRow(row, x, rowY, width);
	});
	return y + this.lineHeight() * rows.length;
};
/**
* Draws a single resource as a label, a gauge, and the numbers behind it.
*
* The three share one line rather than stacking, because a resource is one fact and three lines of
* vertical space is more than one fact is worth in a cell that has five other blocks to fit.
* @param {{key: string, label: string, current: number, max: number, rate: number}} row The row.
* @param {number} x The left edge of the row.
* @param {number} y The top of the row.
* @param {number} width The width available to the row.
*/
Window_MenuStatus.prototype.drawResourceRow = function(row, x, y, width) {
	const iconY = y + Math.floor((this.lineHeight() - ImageManager.iconHeight) / 2);
	this.drawIcon(this.resourceIconIndex(row.key), x, iconY);
	this.resetTextColor();
	this.drawText(`${row.current} / ${row.max}`, x, y, width, "right");
	const gaugeX = x + this.resourceLabelWidth();
	const gaugeWidth = width - this.resourceLabelWidth() - this.resourceValueWidth();
	const gaugeY = y + Math.floor((this.lineHeight() - this.gaugeHeight()) / 2);
	const gaugeRect = new Rectangle(gaugeX, gaugeY, gaugeWidth, this.gaugeHeight());
	this.drawGauge(gaugeRect, row.rate, this.resourceGaugeOptions(row));
};
/**
* Overwrites {@link Window_Base.gaugeHeight}.<br/>
* The thickness of a gauge drawn in this window.
*
* J-Base's default of ten is sized for the tighter windows it was written against, and a ten pixel
* bar sitting in a thirty-six pixel line reads as a hairline rather than as a measure of anything.
* This window has the room to draw a gauge that looks like a gauge.
* @returns {number}
*/
Window_MenuStatus.prototype.gaugeHeight = function() {
	return 18;
};
/**
* The space reserved for a resource's icon before its gauge begins.
* @returns {number}
*/
Window_MenuStatus.prototype.resourceLabelWidth = function() {
	return ImageManager.standardIconWidth + 12;
};
/**
* The icon standing for a given resource.
*
* An icon rather than the database's abbreviation, because the abbreviations are two letters that
* differ by one character and the icons are distinguishable at a glance- which is the whole job of
* the leftmost thing on a row the player is scanning rather than reading.
*
* Resolved through IconManager for the same reason the colors are resolved through ColorManager: a
* resource should look the way it looks everywhere else in the game, and neither decision belongs
* to this window.
* @param {string} key Which resource is being marked, being one of 'hp', 'mp', or 'tp'.
* @returns {number}
*/
Window_MenuStatus.prototype.resourceIconIndex = function(key) {
	switch (key) {
		case "mp": return IconManager.param(1);
		case "tp": return IconManager.maxTp();
		default: return IconManager.param(0);
	}
};
/**
* The space reserved for a resource's current and maximum values.
* @returns {number}
*/
Window_MenuStatus.prototype.resourceValueWidth = function() {
	return 160;
};
/**
* Builds the styling for a resource gauge.
*
* Kept as one method taking the whole row so that changing the house style is a single edit- these
* four gauge shapes are trivially interchangeable, and settling on one is a matter of looking at
* them rather than of reasoning about them.
*
* Segmented rather than solid because a solid bar answers "how full" and a segmented one also
* answers "how much", which is the more useful question when the number beside it is the thing the
* player is actually budgeting against.
* @param {{key: string, label: string, current: number, max: number, rate: number}} row The row.
* @returns {WindowGaugeOptions}
*/
Window_MenuStatus.prototype.resourceGaugeOptions = function(row) {
	const [leftColor, rightColor] = this.resourceGaugeColors(row.key);
	const segments = Math.max(1, Math.ceil(row.max / this.resourceSegmentValue()));
	return WindowGaugeOptions.Builder().gaugeType(Window_Base.GAUGE_TYPES.Segmented).segments(segments).gap(2).leftGradientColor(leftColor).rightGradientColor(rightColor).backColor(this.gaugeBackColor()).build();
};
/**
* How much of a resource one segment of its gauge stands for.
* @returns {number}
*/
Window_MenuStatus.prototype.resourceSegmentValue = function() {
	return 20;
};
/**
* The gradient a given resource's gauge is drawn in.
*
* Deferred to the engine's own gauge colors rather than chosen here, so a resource looks the same in
* this menu as it does everywhere else the player has already learned to read it.
* @param {string} key Which resource the gauge renders, being one of 'hp', 'mp', or 'tp'.
* @returns {[string, string]}
*/
Window_MenuStatus.prototype.resourceGaugeColors = function(key) {
	switch (key) {
		case "mp": return [ColorManager.mpGaugeColor1(), ColorManager.mpGaugeColor2()];
		case "tp": return [ColorManager.tpGaugeColor1(), ColorManager.tpGaugeColor2()];
		default: return [ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2()];
	}
};
/**
* Draws the icons of every state currently afflicting this actor.
*
* An actor suffering nothing says so in words rather than leaving the row blank. A blank row reads
* as something that failed to load; "Unafflicted" reads as good news, and good news is worth the
* line it costs.
* @param {Game_Actor} actor The actor whose afflictions are being drawn.
* @param {number} x The left edge of the row.
* @param {number} y The top of the row.
* @param {number} width The width available to the row.
*/
Window_MenuStatus.prototype.drawActorStates = function(actor, x, y, width) {
	const iconIndices = MenuStatusCatalog.stateIcons(actor);
	if (iconIndices.length === 0) {
		this.changePaintOpacity(false);
		this.drawText(MenuStatusCatalog.UNAFFLICTED_TEXT, x, y, width, "left");
		this.changePaintOpacity(true);
		return;
	}
	const iconY = y + Math.floor((this.lineHeight() - ImageManager.iconHeight) / 2);
	iconIndices.forEach((iconIndex, index) => {
		const iconX = x + index * (ImageManager.standardIconWidth + 4);
		this.drawIcon(iconIndex, iconX, iconY);
	});
};
/**
* Draws everything this actor is wearing, one slot per line.
* @param {Game_Actor} actor The actor whose loadout is being drawn.
* @param {number} x The left edge of the block.
* @param {number} y The top of the block.
* @param {number} width The width available to each row.
* @returns {number} The y coordinate immediately beneath the block.
*/
Window_MenuStatus.prototype.drawEquipment = function(actor, x, y, width) {
	const rows = MenuStatusCatalog.equipmentRows(actor);
	rows.forEach((row, index) => {
		const rowY = y + this.lineHeight() * index;
		this.drawEquipmentRow(row, x, rowY, width);
	});
	return y + this.lineHeight() * rows.length;
};
/**
* Draws a single equipment slot.
*
* A filled slot needs no label- the item's own icon and name identify it more precisely than the slot
* name ever could. An empty one has neither, so it borrows the name of the slot it stands for and is
* drawn dimmed, which is what keeps a run of empty slots reading as absences rather than as more gear.
* @param {{item: RPG_EquipItem, slotName: string, isEquipped: boolean}} row The row to draw.
* @param {number} x The left edge of the row.
* @param {number} y The top of the row.
* @param {number} width The width available to the row.
*/
Window_MenuStatus.prototype.drawEquipmentRow = function(row, x, y, width) {
	if (row.isEquipped) {
		this.drawItemName(row.item, x, y, width);
		return;
	}
	const textMargin = ImageManager.standardIconWidth + 4;
	const textX = x + textMargin;
	const textWidth = Math.max(0, width - textMargin);
	this.changePaintOpacity(false);
	this.drawText(`${row.slotName} - ${MenuStatusCatalog.EMPTY_SLOT_TEXT}`, textX, y, textWidth);
	this.changePaintOpacity(true);
};
/**
* Draws whatever other plugins have to contribute about this actor's advancement.
*
* Deliberately empty. J-CMS knows nothing about the systems layered on top of it, and the things
* genuinely worth a row here- unspent node points, for one- belong to the plugins that own them.
* Those plugins alias this method rather than J-CMS reaching across for data it has no business
* knowing about.
*
* Positioned alongside level and experience rather than at the foot of the cell, because what an
* extension has to say about a character is almost always another measure of how far along they
* are, and a currency waiting to be spent belongs beside the two numbers it will be spent on- not
* stranded beneath their gear.
*
* An implementation must return the y its own drawing ended at, so that several extensions can each
* claim a row without any of them knowing what the others drew. Doing nothing returns the y it was
* given, which costs the cell no space at all.
* @param {Game_Actor} _actor The actor being described.
* @param {number} _x The left edge of the space available.
* @param {number} y The top of the space available.
* @param {number} _width The width available.
* @returns {number}
*/
Window_MenuStatus.prototype.drawExtensionData = function(_actor, _x, y, _width) {
	return y;
};

//#endregion
//#region src/plugins/cms/core/windows/Window_Currencies.js
/**
* The strip along the floor of the menu's centre stack, showing everything the party can spend.
*
* This exists instead of vanilla's `Window_Gold` because that window draws gold and nothing else, with
* the single draw call written directly into its refresh. There is no seam in it to add a second value
* to, and it is small enough that inheriting from it would buy nothing but its shape.
*
* The menu does not know what currencies a game has. Anything that owns one registers a
* {@link CurrencyDefinition} and is drawn alongside the rest, which is why gold is registered the same
* way everything else is rather than being special-cased here.
*/
var Window_Currencies = class Window_Currencies extends Window_Selectable {
	/**
	* Every currency willing to be displayed, in the order they were registered.
	*
	* Static, because the registrations happen at boot- long before a menu is opened, and once for the
	* lifetime of the session rather than once per window.
	* @type {CurrencyDefinition[]}
	*/
	static #definitions = [];
	/**
	* Adds a currency to the strip.
	*
	* Registering the same key twice is ignored rather than duplicated, so a plugin that registers during
	* a hook that can run more than once does not slowly fill the strip with copies of itself.
	* @param {CurrencyDefinition} definition The currency to display.
	*/
	static register(definition) {
		const alreadyRegistered = Window_Currencies.#definitions.some((existing) => existing.key === definition.key);
		if (alreadyRegistered) return;
		Window_Currencies.#definitions.push(definition);
	}
	/**
	* Every currency currently registered for display.
	* @returns {CurrencyDefinition[]}
	*/
	static definitions() {
		return Window_Currencies.#definitions;
	}
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Selectable.initialize}.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.refresh();
	}
	/**
	* Overwrites {@link #colSpacing}.<br/>
	* The strip is a single row of text rather than a grid, so it wants no gutter of its own.
	* @returns {number}
	*/
	colSpacing() {
		return 0;
	}
	/**
	* Overwrites {@link #refresh}.<br/>
	* Redraws every registered currency across the width of the strip.
	*/
	refresh() {
		this.contents.clear();
		const definitions = Window_Currencies.definitions();
		if (definitions.length === 0) return;
		const rect = this.itemLineRect(0);
		const slotWidth = Math.floor(rect.width / definitions.length);
		definitions.forEach((definition, index) => this.drawCurrency(definition, index, rect, slotWidth));
	}
	/**
	* Draws a single currency into its own slot along the strip.
	*
	* The icon eats into the left of the slot rather than being drawn over the amount, because the amount
	* is right-aligned and a wide number would otherwise run underneath it.
	* @param {CurrencyDefinition} definition The currency being drawn.
	* @param {number} index Which slot along the strip it occupies.
	* @param {Rectangle} rect The line the strip draws along.
	* @param {number} slotWidth How wide a single currency's slot is.
	*/
	drawCurrency(definition, index, rect, slotWidth) {
		const slotX = rect.x + index * slotWidth;
		if (definition.hasIcon()) {
			this.drawIcon(definition.iconIndex, slotX, rect.y);
		}
		const textX = definition.hasIcon() ? slotX + ImageManager.iconWidth + 4 : slotX;
		const textWidth = slotX + slotWidth - textX;
		const amount = definition.amount();
		const unit = definition.unit();
		this.drawCurrencyValue(amount, unit, textX, rect.y, textWidth);
	}
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
	const wh = this.goldWindowRect().y - wy;
	return new Rectangle(this.centerStackX(), wy, this.centerStackWidth(), wh);
};
/**
* Overwrites {@link #createGoldWindow}.<br/>
* Builds the currency strip rather than vanilla's gold-only window.
*
* The slot keeps vanilla's name because vanilla's `Scene_Menu.create` is what calls it, and because
* everything measuring against `_goldWindow` should go on finding it there.
*/
Scene_Menu.prototype.createGoldWindow = function() {
	const rectangle = this.goldWindowRect();
	const window = new Window_Currencies(rectangle);
	this.setGoldWindow(window);
	this.addWindow(window);
};
/**
* Gets the currency strip.
* @returns {Window_Currencies}
*/
Scene_Menu.prototype.goldWindow = function() {
	return this._goldWindow;
};
/**
* Sets the currency strip to the given window.
*
* Written into vanilla's own slot rather than into this plugin's namespace, because vanilla's
* `Scene_Menu` reads `_goldWindow` itself and anything else measuring against it should keep working.
* @param {Window_Currencies} window The window to track.
*/
Scene_Menu.prototype.setGoldWindow = function(window) {
	this._goldWindow = window;
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
			semantic: ["focus-prev", "focus-next"],
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
	this.setCommandWindow(new MenuCommandBroadcaster([this.actorCommandWindow(), this.partyCommandWindow()]));
	this.bindMenuCommandHandlers(this.commandWindow());
	this.actorCommandWindow().setHelpWindow(this.helpWindow());
	this.partyCommandWindow().setHelpWindow(this.helpWindow());
};
/**
* Creates the actor command column.
*/
Scene_Menu.prototype.createActorCommandWindow = function() {
	const window = new Window_MenuActorCommand(this.actorCommandWindowRect());
	window.setHandler("focus-next", this.onFocusPartyColumn.bind(this));
	window.setHandler("cancel", this.popScene.bind(this));
	this.setActorCommandWindow(window);
	this.addWindow(window);
};
/**
* Creates the party command column.
*/
Scene_Menu.prototype.createPartyCommandWindow = function() {
	const window = new Window_MenuPartyCommand(this.partyCommandWindowRect());
	window.setHandler("focus-prev", this.onFocusActorColumn.bind(this));
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
//#region src/plugins/cms/core/registerCoreCurrencies.js
/**
* Registers gold with the currency strip.
*
* Gold goes through the same door everything else does. It could have been drawn directly by the strip
* and saved a few lines, but then gold would be the one currency the strip knew about by name- and the
* next thing added would have had to argue for a seam that ought to have existed already.
*
* It registers first, and therefore draws leftmost, because it is the currency every game has.
*/
var goldDefinition = new CurrencyDefinition("gold", -1, () => TextManager.currencyUnit, () => $gameParty.gold());
Window_Currencies.register(goldDefinition);

//#endregion
//# sourceMappingURL=J-CMS.js.map