//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 FOOD] A J-HUD extension that displays the current food chain status on screen.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-ABS-Food
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Food
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds a food chain HUD frame to the screen.
 * It reads the leader's current food chain plan from JABS_Engine and renders
 * a vertical strip with a state icon, a segmented duration bar colored per
 * phase, and a label list highlighting the currently active phase.
 *
 * This plugin does NOT parse food notetags or register the R2 button.
 * Those responsibilities belong to J-ABS-Food.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * PLUGIN PARAMETERS:
 * @param windowX
 * @type number
 * @text Window X
 * @desc The x coordinate of the food chain window's top-left corner.
 * @default 0
 *
 * @param windowY
 * @type number
 * @text Window Y
 * @desc The y coordinate of the food chain window's top-left corner.
 * @default 70
 *
 * @param windowWidth
 * @type number
 * @text Window Width
 * @desc Width of the food chain strip. Widen if long state names (e.g. Well Fed (protein)) clip horizontally.
 * @default 200
 *
 * @param windowHeight
 * @type number
 * @text Window Height
 * @desc Total window height. Only grows the chain-state label list; icon and bar size stay fixed. Every chain phase is drawn at full row height — raise this if a longer chain clips.
 * @default 478
 *
 * @param windowOpacity
 * @type number
 * @min 0
 * @max 255
 * @text Window Opacity
 * @desc Opacity of the windowskin frame and backdrop only (0 = invisible panel, 255 = opaque). Food icons, bar, and labels stay fully visible.
 * @default 255
 */
//=================================================================================================
/* eslint-enable max-len */
//endregion annotations

//#region src/plugins/hud/ext/food/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-HUD-FOOD.
* Exposes the x/y anchor coordinates of the food chain window so Jeremy can
* reposition it without touching source code. Height follows the strip layout;
* width and height are configurable. Height only changes how many chain state
* labels fit; the icon and duration bar keep their fixed size.
*/
var JFoodHud_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version string.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Reads the window anchor coordinates from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	* Parameter-driven fields are declared here only — not as class fields —
	* so RMMZ plugin manager values actually apply after load.
	*/
	initializeMetadata() {
		/**
		* The x coordinate of the food frame window's top-left corner on screen.
		* @type {number}
		*/
		this.windowX = Number(this.parsedPluginParameters["windowX"] ?? 0);
		/**
		* The y coordinate of the food frame window's top-left corner on screen.
		* @type {number}
		*/
		this.windowY = Number(this.parsedPluginParameters["windowY"] ?? 70);
		/**
		* The width of the food frame window in pixels.
		* @type {number}
		*/
		this.windowWidth = Number(this.parsedPluginParameters["windowWidth"] ?? 200);
		/**
		* The total height of the food frame window in pixels.
		* Only the chain-state label region grows or shrinks with this value.
		* @type {number}
		*/
		this.windowHeight = Number(this.parsedPluginParameters["windowHeight"] ?? 478);
		/**
		* Opacity of the windowskin frame and backdrop (0–255); contents are not faded.
		* @type {number}
		*/
		const rawOpacity = Number(this.parsedPluginParameters["windowOpacity"] ?? 255);
		this.windowOpacity = Math.max(0, Math.min(255, rawOpacity));
	}
};

//#endregion
//#region src/plugins/hud/ext/food/_metadata/initialization.js
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
* The plugin umbrella for all things belonging to J-HUD-FOOD.
*/
J.HUD.EXT.FOOD ||= {};
/**
* The metadata associated with this plugin.
*/
J.HUD.EXT.FOOD.Metadata = new JFoodHud_PluginMetadata("J-HUD-FOOD", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.FOOD.Aliased = {
	JABS_Engine: new Map(),
	Scene_Map: new Map()
};

//#endregion
//#region src/plugins/hud/ext/food/windows/Window_FoodFrame.js
/**
* A HUD window that renders the leader's active food chain status as a tall vertical
* strip on the map screen. Reads only from:
*   - $gameParty.leader()                for the current actor
*   - $jabsEngine.getFoodChainPlanByUuid  for the pre-walked chain plan (built at boot)
*   - the JABS state tracker              for live remaining duration of the active state
*
* Layout, top to bottom:
*   1. Icon of the currently active food chain state (changes each phase transition).
*   2. Vertical segmented bar — black bezel and inset track, then segments proportional
*      to phase duration, colored by <foodGroupColor:#RRGGBB>. The active segment drains
*      in real time; future segments are muted; past segments are empty.
*   3. Chain state label list — one label per chain segment, the active one rendered
*      bold + italic. windowHeight is the only limit on how many label rows fit (no cap —
*      extra phases may clip). The icon and bar never resize.
*
* The window hides itself entirely when no food chain is active.
*/
var Window_FoodFrame = class Window_FoodFrame extends Window_Base {
	/**
	* Width in pixels of the vertical bar column.
	* @type {number}
	*/
	static BAR_WIDTH = 20;
	/**
	* Total height in pixels of the vertical bar (all segments combined).
	* @type {number}
	*/
	static BAR_HEIGHT = 180;
	/**
	* Black bezel thickness around the bar track (pixels per side).
	* @type {number}
	*/
	static BAR_BORDER_THICKNESS = 2;
	/**
	* Outer frame color for the vertical food bar.
	* @type {string}
	*/
	static BAR_FRAME_COLOR = "#000000";
	/**
	* Height reserved for each chain state label row, in pixels.
	* Must exceed {@link Window_Base#lineHeight} so descenders (g, y, etc.) are not clipped.
	* @type {number}
	*/
	static LABEL_ROW_HEIGHT = 34;
	/**
	* Extra padding below the last chain label inside the content area.
	* @type {number}
	*/
	static LABEL_BOTTOM_PADDING = 24;
	/**
	* Default number of chain-state label rows when deriving height from row count.
	* @type {number}
	*/
	static DEFAULT_VISIBLE_CHAIN_LABEL_ROWS = 6;
	/**
	* Standard MZ window padding applied on top and bottom (12 + 12).
	* @type {number}
	*/
	static WINDOW_PADDING = 24;
	/**
	* Font size adjustment for chain state names (negative = smaller).
	* Keeps long names like "Overstuffed" inside the narrow strip width.
	* @type {number}
	*/
	static CHAIN_LABEL_FONT_DELTA = -6;
	/**
	* Y offset of the icon from the top of the content area.
	* @type {number}
	*/
	static ICON_Y = 0;
	/**
	* Y offset where the vertical bar begins, leaving room for the icon above.
	* @type {number}
	*/
	static BAR_START_Y = 40;
	/**
	* Y offset where the chain label list begins, below the bar.
	* @type {number}
	*/
	static LABELS_START_Y = Window_FoodFrame.BAR_START_Y + Window_FoodFrame.BAR_HEIGHT + 6;
	/**
	* Content height consumed by the icon, bar, and label-region chrome (everything except label rows).
	* @returns {number}
	*/
	static fixedChromeContentHeight() {
		return Window_FoodFrame.LABELS_START_Y + Window_FoodFrame.LABEL_BOTTOM_PADDING;
	}
	/**
	* Computes total window height for a given number of visible chain-state label rows.
	* @param {number} visibleLabelRows How many chain state names should fit.
	* @returns {number}
	*/
	static requiredWindowHeight(visibleLabelRows = Window_FoodFrame.DEFAULT_VISIBLE_CHAIN_LABEL_ROWS) {
		const contentBottom = Window_FoodFrame.LABELS_START_Y + visibleLabelRows * Window_FoodFrame.LABEL_ROW_HEIGHT + Window_FoodFrame.LABEL_BOTTOM_PADDING;
		return contentBottom + Window_FoodFrame.WINDOW_PADDING;
	}
	/**
	* Derives how many chain-state labels fit in the given total window height.
	* Icon and bar size are not affected — only the label list grows with height.
	* @param {number} windowHeight Total window height in pixels.
	* @returns {number}
	*/
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
		this.opacity = J.HUD.EXT.FOOD.Metadata.windowOpacity;
	}
	/**
	* Keeps backdrop opacity on the plugin parameter instead of $gameSystem.windowOpacity().
	* MZ calls this every frame from {@link Window_Base#updateBackOpacity}.
	*/
	updateBackOpacity() {
		this.backOpacity = J.HUD.EXT.FOOD.Metadata.windowOpacity;
	}
	/**
	* Updates this window each frame.
	* Refreshing every frame keeps the drain bar animated in real time and ensures
	* the window hides itself as soon as the tail state fully expires.
	*/
	update() {
		super.update();
		this.refresh();
	}
	/**
	* Refreshes the window contents. Hides the frame when no food chain is running.
	*/
	refresh() {
		this.contents.clear();
		const player = $jabsEngine.getPlayer1();
		if (!player) {
			this.hide();
			return;
		}
		const leader = $gameParty.leader();
		if (!leader) {
			this.hide();
			return;
		}
		const plan = $jabsEngine.getFoodChainPlanByUuid(player.getUuid());
		if (!plan || plan.isEmpty()) {
			this.hide();
			return;
		}
		const activeId = this.#resolveActiveStateId(leader, plan);
		if (activeId === 0) {
			this.hide();
			return;
		}
		this.show();
		this.#drawActiveStateIcon(activeId);
		this.#drawVerticalBar(plan, player.getUuid(), activeId);
		this.#drawChainLabels(plan, activeId);
	}
	/**
	* Draws the icon of the currently active food chain state, centered at the top
	* of the content area.
	* @param {number} activeId The state id currently active on the leader.
	*/
	#drawActiveStateIcon(activeId) {
		const iconIndex = $dataStates[activeId] ? $dataStates[activeId].iconIndex : 0;
		const iconX = Math.floor((this.contentsWidth() - ImageManager.iconWidth) / 2);
		this.drawIcon(iconIndex, iconX, Window_FoodFrame.ICON_Y);
	}
	/**
	* Draws the vertical segmented bar, with each segment sized proportionally to its
	* phase duration and colored by the state's foodGroupColor notetag.
	*
	* Rendering rules per segment:
	*   - Past (index < activeIndex): gauge background only (fully drained).
	*   - Active: fill from the top by remaining-time ratio; remainder is gauge background.
	*   - Future (index > activeIndex): full-height muted version of the segment color.
	* @param {JABS_FoodChainPlan} plan The active food chain plan.
	* @param {string} uuid The UUID of the leader's JABS battler for duration lookup.
	* @param {number} activeId The state id currently active on the leader.
	*/
	#drawVerticalBar(plan, uuid, activeId) {
		const { segments } = plan;
		const totalFrames = segments.reduce((sum, seg) => sum + seg.frames, 0);
		if (totalFrames <= 0) return;
		const barX = Math.floor((this.contentsWidth() - Window_FoodFrame.BAR_WIDTH) / 2);
		const barY = Window_FoodFrame.BAR_START_Y;
		const barW = Window_FoodFrame.BAR_WIDTH;
		const barH = Window_FoodFrame.BAR_HEIGHT;
		this.#drawBarFrame(barX, barY, barW, barH);
		const inner = Window_FoodFrame.#barInnerRect(barX, barY, barW, barH);
		const activeIndex = plan.indexOfState(activeId);
		let cumY = inner.y;
		const innerBottom = inner.y + inner.height;
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const isLast = i === segments.length - 1;
			let segH = Math.floor(segment.frames / totalFrames * inner.height);
			if (isLast) {
				segH = innerBottom - cumY;
			}
			if (segH <= 0) continue;
			const isActive = i === activeIndex;
			this.#drawBarSegment(inner.x, cumY, inner.width, segH, segment, i, activeIndex, isActive, uuid, isLast);
			cumY += segH;
		}
	}
	/**
	* Paints the bar bezel and recessed track behind all segments.
	* @param {number} x Left edge of the outer bar column.
	* @param {number} y Top edge of the outer bar column.
	* @param {number} width Outer width including the frame.
	* @param {number} height Outer height including the frame.
	*/
	#drawBarFrame(x, y, width, height) {
		const border = Window_FoodFrame.BAR_BORDER_THICKNESS;
		this.contents.fillRect(x, y, width, height, Window_FoodFrame.BAR_FRAME_COLOR);
		this.contents.fillRect(x + border, y + border, width - border * 2, height - border * 2, ColorManager.gaugeBackColor());
		this.#strokeBarOutline(x, y, width, height);
	}
	/**
	* Strokes a 1px rectangle around the outer bar bounds.
	* @param {number} x Left edge of the outer bar column.
	* @param {number} y Top edge of the outer bar column.
	* @param {number} width Outer width including the frame.
	* @param {number} height Outer height including the frame.
	*/
	#strokeBarOutline(x, y, width, height) {
		const ctx = this.contents._context;
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + .5, y + .5, width - 1, height - 1);
		ctx.lineWidth = 1;
		ctx.strokeStyle = Window_FoodFrame.BAR_FRAME_COLOR;
		ctx.stroke();
		ctx.restore();
	}
	/**
	* Inner drawable area inside the bar bezel.
	* @param {number} x Left edge of the outer bar column.
	* @param {number} y Top edge of the outer bar column.
	* @param {number} width Outer width including the frame.
	* @param {number} height Outer height including the frame.
	* @returns {{ x: number, y: number, width: number, height: number }}
	*/
	static #barInnerRect(x, y, width, height) {
		const border = Window_FoodFrame.BAR_BORDER_THICKNESS;
		return {
			x: x + border,
			y: y + border,
			width: width - border * 2,
			height: height - border * 2
		};
	}
	/**
	* Draws a single segment of the vertical bar.
	* @param {number} x Left edge of the bar column.
	* @param {number} y Top edge of this segment.
	* @param {number} width Width of the bar column.
	* @param {number} height Height of this segment.
	* @param {JABS_FoodChainSegment} segment The segment model for this position.
	* @param {number} index The zero-based index of this segment in the plan.
	* @param {number} activeIndex The index of the currently active segment.
	* @param {boolean} isActive Whether this segment is the currently active phase.
	* @param {string} uuid UUID for JABS state tracker duration lookup.
	* @param {boolean} isLast Whether this is the final slice in the chain (touches the track floor).
	*/
	#drawBarSegment(x, y, width, height, segment, index, activeIndex, isActive, uuid, isLast) {
		const bgColor = ColorManager.gaugeBackColor();
		if (index < activeIndex) {
			this.contents.fillRect(x, y, width, height, bgColor);
		} else if (isActive) {
			const fillRatio = this.#calculateFillRatio(segment, uuid);
			let fillH = Math.round(height * fillRatio);
			fillH = Math.max(0, Math.min(height, fillH));
			this.contents.fillRect(x, y, width, height, bgColor);
			if (fillH > 0) {
				this.contents.fillRect(x, y + (height - fillH), width, fillH, segment.color);
			}
		} else {
			this.contents.fillRect(x, y, width, height, Window_FoodFrame.#muteColor(segment.color));
		}
		if (isLast === false) {
			this.contents.fillRect(x, y + height - 1, width, 1, Window_FoodFrame.BAR_FRAME_COLOR);
		}
	}
	/**
	* Draws the chain state label list below the vertical bar.
	* Labels are in chain order (entry through tail). The active state's label is
	* rendered bold and italic; inactive labels are dimmed.
	* @param {JABS_FoodChainPlan} plan The active food chain plan.
	* @param {number} activeId The state id currently active on the leader.
	*/
	#drawChainLabels(plan, activeId) {
		const { segments } = plan;
		const rowH = Window_FoodFrame.LABEL_ROW_HEIGHT;
		const activeIndex = plan.indexOfState(activeId);
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const state = $dataStates[segment.stateId];
			if (!state) continue;
			const labelY = Window_FoodFrame.LABELS_START_Y + i * rowH;
			const isActive = i === activeIndex;
			this.#drawChainLabel(state.name, labelY, isActive);
		}
	}
	/**
	* Draws one chain-state label centered under the bar column.
	* @param {string} rawName The state name from the database (may contain $codes).
	* @param {number} y The y coordinate in contents space.
	* @param {boolean} isActive Whether this row is the currently active chain phase.
	*/
	#drawChainLabel(rawName, y, isActive) {
		let text = this.convertEscapeCharacters(rawName);
		text = this.#applyChainLabelFontSize(text);
		if (isActive) {
			text = this.boldenText(this.italicizeText(text));
		}
		const { width: textWidth } = this.textSizeEx(text);
		const drawX = this.#chainLabelCenterX(textWidth);
		const drawWidth = Math.min(textWidth, this.contentsWidth());
		if (isActive) {
			this.drawTextEx(text, drawX, y, drawWidth);
			return;
		}
		this.changeTextColor(ColorManager.dimColor1());
		this.changeOutlineColor(ColorManager.outlineColor());
		const textState = this.createTextState(text, drawX, y, drawWidth);
		this.processAllText(textState);
		this.resetTextColor();
	}
	/**
	* Computes the x offset to center a chain label row under the vertical bar.
	* @param {number} textWidth The measured width of the label text.
	* @returns {number}
	*/
	#chainLabelCenterX(textWidth) {
		const contentsW = this.contentsWidth();
		if (textWidth >= contentsW) {
			return 0;
		}
		return Math.floor((contentsW - textWidth) / 2);
	}
	/**
	* Wraps chain label text in a smaller font size for the narrow food strip.
	* @param {string} text The label text (may already include escape codes).
	* @returns {string}
	*/
	#applyChainLabelFontSize(text) {
		return this.modFontSizeForText(Window_FoodFrame.CHAIN_LABEL_FONT_DELTA, text);
	}
	/**
	* Finds the first segment state currently afflicting the leader.
	* Returns 0 when no segment from the plan is currently active.
	* @param {Game_Actor} leader The party leader.
	* @param {JABS_FoodChainPlan} plan The active food chain plan.
	* @returns {number} The active state id, or 0.
	*/
	#resolveActiveStateId(leader, plan) {
		for (const segment of plan.segments) {
			if (leader.isStateAffected(segment.stateId)) return segment.stateId;
		}
		return 0;
	}
	/**
	* Calculates the 0.0–1.0 fill ratio for the active segment based on the JABS
	* state tracker's remaining duration for that state.
	* Returns 1.0 (full) when the tracker entry cannot be found.
	* @param {JABS_FoodChainSegment} segment The currently active segment.
	* @param {string} uuid UUID for the JABS battler state tracker.
	* @returns {number} Fill ratio clamped to [0, 1].
	*/
	#calculateFillRatio(segment, uuid) {
		const jabsStateMap = $jabsEngine.getJabsStatesByUuid(uuid);
		if (!jabsStateMap) return 1;
		const jabsState = jabsStateMap.get(segment.stateId);
		if (!jabsState) return 1;
		if (segment.frames <= 0) return 1;
		const ratio = jabsState.duration / segment.frames;
		return Math.max(0, Math.min(1, ratio));
	}
	/**
	* Returns a 40%-brightness version of the given CSS hex color string.
	* Used to render upcoming (future) segments in a recognizable but subdued tone.
	* @param {string} hex A '#RRGGBB' hex color string.
	* @returns {string} The muted hex color string.
	*/
	static #muteColor(hex) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		const mr = Math.floor(r * .4).toString(16).padStart(2, "0");
		const mg = Math.floor(g * .4).toString(16).padStart(2, "0");
		const mb = Math.floor(b * .4).toString(16).padStart(2, "0");
		return `#${mr}${mg}${mb}`;
	}
};

//#endregion
//#region src/plugins/hud/ext/food/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map.prototype.initHudMembers}.<br>
* Initializes the storage slot for the food frame window.
*/
J.HUD.EXT.FOOD.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.FOOD.Aliased.Scene_Map.get("initHudMembers").call(this);
	this._j._hud._food = {};
	/**
	* The window that displays the leader's active food chain status.
	* @type {Window_FoodFrame|null}
	*/
	this._j._hud._food._frame = null;
};
/**
* Extends {@link Scene_Map.prototype.createAllWindows}.<br>
* Includes creation of the food frame window alongside other HUD windows.
*/
J.HUD.EXT.FOOD.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.FOOD.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createFoodFrameWindow();
};
/**
* Creates the food frame window and adds it to the scene's window registry.
*/
Scene_Map.prototype.createFoodFrameWindow = function() {
	const window = this.buildFoodFrameWindow();
	this.setFoodFrameWindow(window);
	this.addWindow(window);
};
/**
* Builds and configures the food frame window.
* @returns {Window_FoodFrame} The fully configured window.
*/
Scene_Map.prototype.buildFoodFrameWindow = function() {
	const rectangle = this.foodFrameWindowRect();
	const window = new Window_FoodFrame(rectangle);
	return window;
};
/**
* Calculates the rectangle for the food frame window.
* Width and height come from plugin parameters. Height only affects how many
* chain state labels are visible; icon and bar size are fixed in {@link Window_FoodFrame}.
* @returns {Rectangle}
*/
Scene_Map.prototype.foodFrameWindowRect = function() {
	const width = J.HUD.EXT.FOOD.Metadata.windowWidth;
	const height = J.HUD.EXT.FOOD.Metadata.windowHeight;
	const x = J.HUD.EXT.FOOD.Metadata.windowX;
	const y = J.HUD.EXT.FOOD.Metadata.windowY;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked food frame window.
* @returns {Window_FoodFrame|null}
*/
Scene_Map.prototype.getFoodFrameWindow = function() {
	return this._j._hud._food._frame;
};
/**
* Sets the tracked food frame window to the given instance.
* @param {Window_FoodFrame} window The window to track.
*/
Scene_Map.prototype.setFoodFrameWindow = function(window) {
	this._j._hud._food._frame = window;
};
/**
* Extends {@link JABS_Engine.prototype.postPartyCycling}.<br>
* Refreshes the food frame window whenever the party leader changes so that
* the displayed chain arc reflects the new leader's state.
*/
J.HUD.EXT.FOOD.Aliased.JABS_Engine.set("postPartyCycling", JABS_Engine.prototype.postPartyCycling);
JABS_Engine.prototype.postPartyCycling = function() {
	J.HUD.EXT.FOOD.Aliased.JABS_Engine.get("postPartyCycling").call(this);
	this.requestFoodFrameRefresh = true;
};
/**
* Extends {@link Scene_Map.prototype.updateHudFrames}.<br>
* Handles the food frame refresh request each frame.
*/
J.HUD.EXT.FOOD.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.FOOD.Aliased.Scene_Map.get("updateHudFrames").call(this);
	this.handleFoodFrameRefresh();
};
/**
* If the engine has requested a food frame refresh, performs it and clears the flag.
*/
Scene_Map.prototype.handleFoodFrameRefresh = function() {
	if (!$jabsEngine.requestFoodFrameRefresh) return;
	const foodFrame = this.getFoodFrameWindow();
	if (foodFrame) foodFrame.refresh();
	$jabsEngine.requestFoodFrameRefresh = false;
};

//#endregion
//# sourceMappingURL=J-HUD-Food.js.map