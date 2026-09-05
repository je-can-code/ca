//region annotations
/* eslint-disable max-len */
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 HUD-DPS] A J-HUD extension that displays each battle member's damage output.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-ABS-Dps
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Dps
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds a damage readout to the map screen. It draws one row per
 * battle member and three columns of rates:
 *
 *   Now   - the rolling rate across the last few seconds of combat.
 *   Fight - the rate across the encounter in progress.
 *   Last  - the rate across the encounter before it.
 *
 * This plugin measures nothing itself. Every number on it is asked of the
 * tracker in J-ABS-Dps, which is where the rules about what counts and how it
 * is timed all live.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * IT IS OFF BY DEFAULT.
 * This is a tuning instrument, not part of the game's presentation. It stays
 * off until somebody is actually measuring something.
 *
 * THE FIGURES HOLD BETWEEN FIGHTS.
 * The clock behind them only runs while the party is in combat, so the table
 * does not bleed to zero on the walk to the next encounter. The Fight column
 * keeps showing the fight that just ended, and only moves down into Last when
 * the next one begins.
 *
 * A LOW NUMBER IS A READING, NOT A GAP.
 * Every member is measured against the same encounter clock. An ally who spent
 * the fight dead or idling divides what little they did by the whole fight and
 * reads low, which is the thing worth knowing.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    The readout fades while the player is standing on top of it, through the shared
 *    resolver in J-HUD.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * PLUGIN PARAMETERS:
 * @param enabled
 * @type boolean
 * @text Show Readout
 * @desc Whether or not the damage readout is drawn. Off by default; this is an instrument rather than part of the game.
 * @default false
 *
 * @param windowX
 * @type number
 * @text Window X
 * @desc The x coordinate of the readout's top-left corner.
 * @default 0
 *
 * @param windowY
 * @type number
 * @text Window Y
 * @desc The y coordinate of the readout's top-left corner.
 * @default 0
 *
 * @param windowWidth
 * @type number
 * @text Window Width
 * @desc Width of the readout. Widen if long battler names clip in the leading column.
 * @default 360
 *
 * @param windowHeight
 * @type number
 * @text Window Height
 * @desc Height of the readout. Needs one row for the headings plus one per battle member; raise it if rows clip.
 * @default 160
 *
 * @param windowOpacity
 * @type number
 * @min 0
 * @max 255
 * @text Window Opacity
 * @desc Opacity of the windowskin frame and backdrop only (0 = invisible panel, 255 = opaque). The numbers stay fully visible.
 * @default 255
 */
//=================================================================================================
/* eslint-enable max-len */
//endregion annotations

//#region src/plugins/hud/ext/dps/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-HUD-Dps.
*
* Exposes the anchor, size and opacity of the damage readout, plus the switch that puts it on
* screen at all. It is an instrument rather than part of the game's presentation, so it defaults to
* off and stays that way until somebody is actually measuring something.
*/
var JDpsHud_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version string.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Reads the window's placement and visibility from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*
	* Parameter-driven fields are declared here rather than as class fields, so that values coming
	* out of the RMMZ plugin manager actually apply after load.
	*/
	initializeMetadata() {
		/**
		* Whether or not the damage readout is drawn at all.
		* @type {boolean}
		*/
		this.enabled = this.parsedPluginParameters["enabled"] === "true";
		/**
		* The x coordinate of the readout's top-left corner on screen.
		* @type {number}
		*/
		this.windowX = Number(this.parsedPluginParameters["windowX"] ?? 0);
		/**
		* The y coordinate of the readout's top-left corner on screen.
		* @type {number}
		*/
		this.windowY = Number(this.parsedPluginParameters["windowY"] ?? 0);
		/**
		* The width of the readout in pixels.
		* @type {number}
		*/
		this.windowWidth = Number(this.parsedPluginParameters["windowWidth"] ?? 360);
		/**
		* The height of the readout in pixels.
		*
		* Tall enough for a heading row plus every battle member; raise it if rows clip.
		* @type {number}
		*/
		this.windowHeight = Number(this.parsedPluginParameters["windowHeight"] ?? 160);
		/**
		* Opacity of the windowskin frame and backdrop (0-255); the numbers are not faded.
		* @type {number}
		*/
		const rawOpacity = Number(this.parsedPluginParameters["windowOpacity"] ?? 255);
		this.windowOpacity = Math.max(0, Math.min(255, rawOpacity));
	}
};

//#endregion
//#region src/plugins/hud/ext/dps/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredHudVersion = "2.0.0";
	const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.version.version(), requiredHudVersion);
	if (!hasHudRequirement) {
		throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to HUD extensions.
*/
J.HUD.EXT ||= {};
/**
* The plugin umbrella for all things belonging to J-HUD-Dps.
*/
J.HUD.EXT.DPS ||= {};
/**
* The metadata associated with this plugin.
*/
J.HUD.EXT.DPS.Metadata = new JDpsHud_PluginMetadata("J-HUD-Dps", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.DPS.Aliased = { Scene_Map: new Map() };

//#endregion
//#region src/plugins/hud/ext/dps/windows/Window_DpsFrame.js
/**
* A HUD window rendering each battle member's damage output as a small table.
*
* One row per battle member, three columns:
*   Now   - the rolling rate across the last few seconds of combat.
*   Fight - the rate across the encounter in progress.
*   Last  - the rate across the encounter before it.
*
* Every row is measured against the same encounter clock, which is what makes a low number mean
* something. A member who spent the fight dead or idling divides their small damage by the whole
* fight and reads low; give each of them their own active-time denominator and everyone looks
* competent over whatever slice of the fight they turned up for.
*
* This window draws numbers and nothing else. Every figure on it is asked of the tracker over in
* J-ABS-Dps, which is where the measuring lives.
*/
var Window_DpsFrame = class Window_DpsFrame extends Window_Base {
	/**
	* Width in pixels of the leading column holding battler names.
	* @type {number}
	*/
	static NAME_COLUMN_WIDTH = 120;
	/**
	* Width in pixels of each of the three numeric columns.
	* @type {number}
	*/
	static VALUE_COLUMN_WIDTH = 70;
	/**
	* Font size adjustment for every row on this frame (negative = smaller).
	*
	* The table is a reference read at a glance beside the action, not something to be studied, and a
	* smaller face keeps four columns inside a window that does not dominate the screen.
	* @type {number}
	*/
	static ROW_FONT_DELTA = -8;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle describing this window's dimensions.
	*/
	constructor(rect) {
		super(rect);
		this.configure();
		this.refresh();
	}
	/**
	* One-time window setup: plugin-driven windowskin frame opacity.
	*/
	configure() {
		this.opacity = J.HUD.EXT.DPS.Metadata.windowOpacity;
	}
	/**
	* Keeps backdrop opacity on the plugin parameter instead of $gameSystem.windowOpacity().
	* MZ calls this every frame from {@link Window_Base#updateBackOpacity}.
	*/
	updateBackOpacity() {
		this.backOpacity = J.HUD.EXT.DPS.Metadata.windowOpacity;
	}
	/**
	* Updates this window each frame.
	*
	* Repainting every frame is the point of the thing- the rolling rate is meant to move while the
	* fighting is happening, and a refresh triggered by events would only ever show it after.
	*/
	update() {
		super.update();
		this.refresh();
		this.alpha = HudInterferenceResolver.nextFrameAlpha(this);
	}
	/**
	* Refreshes the window contents, hiding the frame when the HUD is not being shown.
	*/
	refresh() {
		this.contents.clear();
		if (J.HUD.EXT.DPS.Metadata.enabled === false) {
			this.hide();
			return;
		}
		if (!$hudManager.canShowHud()) {
			this.hide();
			return;
		}
		this.show();
		this.drawHeaderRow();
		this.drawMemberRows();
	}
	/**
	* Draws the column headings above the member rows.
	*/
	drawHeaderRow() {
		this.drawRow(String.empty, "Now", "Fight", "Last", 0);
	}
	/**
	* Draws one row per current battle member, in party order.
	*/
	drawMemberRows() {
		const members = $gameParty.battleMembers();
		const tracker = $jabsEngine.dpsTracker();
		members.forEach((member, index) => this.drawMemberRow(member, tracker, index));
	}
	/**
	* Draws a single battle member's row of rates.
	* @param {Game_Actor} member The battle member this row describes.
	* @param {JabsDpsTracker} tracker The tracker holding the measurements.
	* @param {number} index The zero-based position of this member in the party.
	*/
	drawMemberRow(member, tracker, index) {
		const uuid = member.getUuid();
		const now = Window_DpsFrame.formatRate(tracker.rollingDpsBy(uuid));
		const fight = Window_DpsFrame.formatRate(tracker.currentDpsBy(uuid));
		const last = Window_DpsFrame.formatRate(tracker.previousDpsBy(uuid));
		const rowIndex = index + 1;
		this.drawRow(member.name(), now, fight, last, rowIndex);
	}
	/**
	* Draws one row of the table, name on the left and three values right-aligned after it.
	* @param {string} label The text for the leading name column.
	* @param {string} first The text for the first value column.
	* @param {string} second The text for the second value column.
	* @param {string} third The text for the third value column.
	* @param {number} rowIndex The zero-based row this content belongs on.
	*/
	drawRow(label, first, second, third, rowIndex) {
		const y = rowIndex * this.lineHeight();
		const nameWidth = Window_DpsFrame.NAME_COLUMN_WIDTH;
		const valueWidth = Window_DpsFrame.VALUE_COLUMN_WIDTH;
		this.modFontSize(Window_DpsFrame.ROW_FONT_DELTA);
		this.drawText(label, 0, y, nameWidth, "left");
		this.drawText(first, nameWidth, y, valueWidth, "right");
		this.drawText(second, nameWidth + valueWidth, y, valueWidth, "right");
		this.drawText(third, nameWidth + valueWidth * 2, y, valueWidth, "right");
		this.resetFontSettings();
	}
	/**
	* Renders a rate as the whole number that goes in a cell.
	*
	* Fractions of a point per second are below the resolution of any decision this table informs,
	* and a column of decimals is harder to compare at a glance than a column of integers.
	* @param {number} rate The rate to render.
	* @returns {string}
	*/
	static formatRate(rate) {
		return Math.round(rate).toString();
	}
};

//#endregion
//#region src/plugins/hud/ext/dps/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map.prototype.initHudMembers}.<br/>
* Initializes the storage slot for the dps frame window.
*/
J.HUD.EXT.DPS.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.DPS.Aliased.Scene_Map.get("initHudMembers").call(this);
	this._j._hud._dps = {};
	/**
	* The window that displays each battle member's damage output.
	* @type {Window_DpsFrame|null}
	*/
	this._j._hud._dps._frame = null;
};
/**
* Extends {@link Scene_Map.prototype.createAllWindows}.<br/>
* Includes creation of the dps frame window alongside other HUD windows.
*/
J.HUD.EXT.DPS.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.DPS.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createDpsFrameWindow();
};
/**
* Creates the dps frame window and adds it to the scene's window registry.
*/
Scene_Map.prototype.createDpsFrameWindow = function() {
	const window = this.buildDpsFrameWindow();
	this.setDpsFrameWindow(window);
	this.addWindow(window);
};
/**
* Builds and configures the dps frame window.
* @returns {Window_DpsFrame} The fully configured window.
*/
Scene_Map.prototype.buildDpsFrameWindow = function() {
	const rectangle = this.dpsFrameWindowRect();
	const window = new Window_DpsFrame(rectangle);
	return window;
};
/**
* Calculates the rectangle for the dps frame window.
*
* All four values come from plugin parameters so the readout can be dragged out of the way of
* whatever else is being watched without touching source.
* @returns {Rectangle}
*/
Scene_Map.prototype.dpsFrameWindowRect = function() {
	const width = J.HUD.EXT.DPS.Metadata.windowWidth;
	const height = J.HUD.EXT.DPS.Metadata.windowHeight;
	const x = J.HUD.EXT.DPS.Metadata.windowX;
	const y = J.HUD.EXT.DPS.Metadata.windowY;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked dps frame window.
* @returns {Window_DpsFrame|null}
*/
Scene_Map.prototype.getDpsFrameWindow = function() {
	return this._j._hud._dps._frame;
};
/**
* Sets the tracked dps frame window to the given instance.
* @param {Window_DpsFrame} window The window to track.
*/
Scene_Map.prototype.setDpsFrameWindow = function(window) {
	this._j._hud._dps._frame = window;
};

//#endregion
//# sourceMappingURL=J-HUD-Dps.js.map