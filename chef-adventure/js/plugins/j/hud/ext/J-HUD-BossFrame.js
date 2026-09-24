//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 HUD-BOSS] A HUD frame that displays a single target, like a boss.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @base J-HUD-TargetFrame
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @orderAfter J-HUD-TargetFrame
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD-TargetFrame plugin, designed for
 * JABS. It generates a window on the map displaying a single target at a much
 * bigger scale than the J-HUD-TargetFrame does.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it displays whichever battler is
 * the player's current target, not a specially-tagged "boss".
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    The boss frame now has a wide gauge centered under the boss's name, with its
 *    level above and its afflictions below. While it is up, the target frame waits
 *    beneath it, and never opens for the boss itself.
 * - 1.0.2
 *    Routed the boss-creation failure through J-Base's new Diagnostics, so it
 *    names J-HUD-BossFrame in the console.
 * - 1.0.1
 *    Fixed the HP-percent threshold check using a chained comparison
 *    (lowerRange <= hpPercent <= upperRange), which does not perform a
 *    range check in JS and was nearly always true regardless of the
 *    boss's actual HP.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/hud/ext/boss/_metadata/_pluginMetadata.js
var JHudBoss_PluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/hud/ext/boss/_metadata/initialization.js
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
	const requiredHudVersion = "2.0.0";
	const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.version.version(), requiredHudVersion);
	if (hasHudRequirement === false) {
		throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
	}
	const requiredTargetFrameVersion = "2.0.0";
	const targetFrameVersion = J.HUD.EXT.TARGET.Metadata.version.version();
	const hasTargetFrameRequirement = J.BASE.Helpers.satisfies(targetFrameVersion, requiredTargetFrameVersion);
	if (hasTargetFrameRequirement === false) {
		throw new Error(`Either missing J-HUD-TargetFrame or has a lower version than the required: ${requiredTargetFrameVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.HUD.EXT.BOSS = {};
/**
* The `metadata` associated with this plugin, such as version.
* @type {JHudBoss_PluginMetadata}
*/
J.HUD.EXT.BOSS.Metadata = new JHudBoss_PluginMetadata("J-HUD-BossFrame", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.BOSS.Aliased = {};
J.HUD.EXT.BOSS.Aliased.Hud_Manager = new Map();
J.HUD.EXT.BOSS.Aliased.JABS_Battler = new Map();
J.HUD.EXT.BOSS.Aliased.Scene_Map = new Map();

//#endregion
//#region src/plugins/hud/ext/boss/managers/BossFrameManager.js
var BossFrameManager = class {
	/**
	* The boss in the frame.
	* @type {FramedTarget|null}
	*/
	static boss = null;
	/**
	* Whether or not we have a new boss to refresh for.
	* @type {boolean}
	*/
	static #newBossRequest = false;
	/**
	* Whether or not we have a request to hide the boss frame.
	* @type {boolean}
	*/
	static #hideBossRequest = false;
	/**
	* Whether or not we have a request to show the boss frame.
	* @type {boolean}
	*/
	static #showBossRequest = false;
	/**
	* Whether the boss frame is meant to be on screen: shown by the last request, and not hidden since.<br/>
	* Unlike the requests, which clear the moment the frame acts on them, this holds for as long as the boss
	* frame stays up.
	* @type {boolean}
	*/
	static #bossFrameActive = false;
	/**
	* Gets the current boss.
	* @returns {FramedTarget|null}
	*/
	static getBossFrame() {
		return this.boss;
	}
	/**
	* Sets the current boss to the given target.
	* @param {FramedTarget} boss The given target.
	*/
	static setBossFrame(boss) {
		this.boss = boss;
		this.requestBossFrameRefresh();
	}
	/**
	* Sets the current boss to the data that resides within a given event
	* by its eventId.
	* @param {number} eventId The id of the event to set the boss to.
	*/
	static setBossByEventId(eventId) {
		const bossTarget = this.#createBossFrameFromEventId(eventId);
		this.setBossFrame(bossTarget);
	}
	/**
	* Get the {@link Game_Battler} associated with this boss.
	* @returns {Game_Battler|null}
	*/
	static getBossGameBattler() {
		const bossManager = globalThis.JabsBossManager;
		if (bossManager && bossManager.hasActiveEncounter()) {
			return bossManager.getBossGameBattler();
		}
		if (!this.boss) return null;
		return this.boss.battler;
	}
	/**
	* Get the {@link JABS_Battler} associated with this boss.
	* @returns {JABS_Battler|null}
	*/
	static getBossJabsBattler() {
		const bossManager = globalThis.JabsBossManager;
		if (bossManager && bossManager.hasActiveEncounter()) {
			return bossManager.getBossJabsBattler();
		}
		if (!this.boss) return null;
		const gameBattler = this.getBossGameBattler();
		return JABS_AiManager.getBattlerByUuid(gameBattler.getUuid());
	}
	/**
	* Gets the boss's current percent of health.
	* @returns {number}
	*/
	static getBossHpPercent() {
		if (!this.boss) return 0;
		return this.getBossGameBattler().currentHpPercent100();
	}
	/**
	* Determines whether or not the boss is above a given hp percent threshold.
	* @param {number} hpPercentThreshold The amount to check if the boss is inclusively above.
	* @returns {boolean} True if the boss is above the given amount, false otherwise.
	*/
	static isBossAboveHpThreshold(hpPercentThreshold) {
		if (!this.boss) return false;
		const aboveThreshold = this.getBossGameBattler().currentHpPercent100() >= hpPercentThreshold;
		return aboveThreshold;
	}
	/**
	* Determines whether or not the boss is below a given hp percent threshold.
	* @param {number} hpPercentThreshold The amount to check if the boss is inclusively below.
	* @returns {boolean} True if the boss is below the given amount, false otherwise.
	*/
	static isBossBelowHpThreshold(hpPercentThreshold) {
		if (!this.boss) return false;
		const aboveThreshold = this.getBossGameBattler().currentHpPercent100() <= hpPercentThreshold;
		return aboveThreshold;
	}
	/**
	* Determines whether or not the boss is between two given hp percents.
	* @param {number} lowerRange The lowest inclusive hp percent allowed.
	* @param {number} upperRange The highest inclusive hp percent allowed.
	* @returns {boolean} True if the boss is within the range, false otherwise.
	*/
	static isBossWithinHpRange(lowerRange, upperRange) {
		if (!this.boss) return false;
		const hpPercent = this.getBossGameBattler().currentHpPercent100();
		const withinThreshold = hpPercent >= lowerRange && hpPercent <= upperRange;
		return withinThreshold;
	}
	/**
	* Whether or not the boss frame requires a refresh.
	* @returns {boolean}
	*/
	static needsBossFrameRefresh() {
		return this.#newBossRequest;
	}
	/**
	* Requests the boss frame to be refreshed.
	*/
	static requestBossFrameRefresh() {
		this.#newBossRequest = true;
	}
	/**
	* Acknowledges the refresh request for the boss frame.
	*/
	static acknowledgeBossFrameRefresh() {
		this.#newBossRequest = false;
	}
	/**
	* Whether or not the boss frame requires hiding.
	* @returns {boolean}
	*/
	static needsBossFrameHiding() {
		return this.#hideBossRequest;
	}
	/**
	* Requests the boss frame to be concealed.
	*/
	static requestHideBossFrame() {
		this.#hideBossRequest = true;
		this.#bossFrameActive = false;
	}
	/**
	* Acknowledges the request for the boss frame to be concealed.
	*/
	static acknowledgeBossFrameHidden() {
		this.#hideBossRequest = false;
	}
	/**
	* Whether or not the boss frame requires showing.
	* @returns {boolean}
	*/
	static needsBossFrameShowing() {
		return this.#showBossRequest;
	}
	/**
	* Requests the boss frame to be revealed.
	*/
	static requestShowBossFrame() {
		this.#showBossRequest = true;
		this.#bossFrameActive = true;
	}
	/**
	* Acknowledges the request for the boss frame to be revealed.
	*/
	static acknowledgeBossFrameShown() {
		this.#showBossRequest = false;
	}
	/**
	* Whether the boss frame is meant to be on screen right now.
	* @returns {boolean}
	*/
	static isBossFrameActive() {
		return this.#bossFrameActive;
	}
	/**
	* Whether the boss frame is up and showing the given battler.<br/>
	* The target frame asks this before opening for a battler: the boss frame already shows that battler's
	* name, level, health, and afflictions, and a second frame opened for them would only stack on top of it.
	* @param {JABS_Battler} jabsBattler The battler being asked about.
	* @returns {boolean}
	*/
	static isFramingBattler(jabsBattler) {
		if (!this.isBossFrameActive()) return false;
		const bossBattler = this.getBossGameBattler();
		if (!bossBattler) return false;
		return bossBattler.getUuid() === jabsBattler.getUuid();
	}
	/**
	* Where the target frame should sit, given where it usually rests and where the boss frame ends.<br/>
	* Both frames want the top of the screen, so while the boss frame is up, the target frame drops to just
	* below it rather than covering it.
	* @param {number} restingY The y the target frame sits at when no boss is framed.
	* @param {number} bossFrameBottom The y of the boss frame's bottom edge.
	* @returns {number}
	*/
	static targetFrameY(restingY, bossFrameBottom) {
		if (this.isBossFrameActive()) return bossFrameBottom;
		return restingY;
	}
	/**
	* Creates a {@link FramedTarget} based on the data that resides in the event
	* of the given eventId.
	* @param {number} eventId The event id to generate a boss from.
	* @returns {FramedTarget}
	*/
	static #createBossFrameFromEventId(eventId) {
		if (!this.#canCreateBossFrameFromEventId(eventId)) {
			Diagnostics.error("J-HUD-BossFrame", `could not create a boss from event of id: [ ${eventId} ].`);
			throw new Error("Failed to create boss for boss frame.");
		}
		const bossJabsBattler = $gameMap.event(eventId).getJabsBattler();
		const bossBattler = bossJabsBattler.getBattler();
		const framedTargetConfiguration = new FramedTargetConfiguration();
		const framedTarget = new FramedTarget(bossBattler.name(), String.empty, 14, bossBattler, framedTargetConfiguration);
		bossJabsBattler.decorateFramedTarget(framedTarget, bossJabsBattler);
		return framedTarget;
	}
	/**
	* Determines whether or not we can build a boss from the given eventId.
	* @param {number} eventId The id of the event to build a boss from.
	* @returns {boolean} True if a boss can be built from the eventId, false otherwise.
	*/
	static #canCreateBossFrameFromEventId(eventId) {
		if (!eventId) return false;
		const bossEvent = $gameMap.event(eventId);
		if (!bossEvent) return false;
		if (!bossEvent.getJabsBattler()) return false;
		return true;
	}
};

//#endregion
//#region src/plugins/hud/ext/boss/_models/JABS_Battler.js
/**
* Extends {@link #canShowTargetFrame}.<br/>
* The boss in the boss frame never opens the target frame as well. The boss frame already shows that
* battler's name, level, health, and afflictions, and a second frame opened for them would only stack on
* top of it. Anyone else struck mid-fight- an add, a stray slime- still opens the target frame as usual.
* @returns {boolean}
*/
J.HUD.EXT.BOSS.Aliased.JABS_Battler.set("canShowTargetFrame", JABS_Battler.prototype.canShowTargetFrame);
JABS_Battler.prototype.canShowTargetFrame = function() {
	if (BossFrameManager.isFramingBattler(this)) return false;
	return J.HUD.EXT.BOSS.Aliased.JABS_Battler.get("canShowTargetFrame").call(this);
};

//#endregion
//#region src/plugins/hud/ext/boss/windows/Window_BossFrame.js
var Window_BossFrame = class Window_BossFrame extends Window_TargetFrame {
	/**
	* The size of the boss's hp gauge, in pixels: far wider than a regular target's, and a touch taller. Its bar
	* fills its whole bitmap, so the height is both.
	* @type {{width: number, height: number}}
	*/
	static HpGaugeSize = {
		width: 1e3,
		height: 16
	};
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		super.initMembers();
		this._j._hud ||= {};
		this._j._hud._boss = {};
		this._j._hud._boss._requestHide = false;
		this._j._hud._boss._concealing = false;
		this._j._hud._boss._requestShow = false;
		this._j._hud._boss._revealing = false;
	}
	/**
	* Gets the j.
	* @returns {{_hud: {_boss: {_requestHide: boolean, _concealing: boolean, _requestShow: boolean,
	* _revealing: boolean}}}} The j.
	*/
	j() {
		return this._j;
	}
	requestHideBossFrame() {
		this.j()._hud._boss._requestHide = true;
		this.beginConcealing();
	}
	beginConcealing() {
		this.j()._hud._boss._concealing = true;
	}
	endConcealing() {
		this.j()._hud._boss._concealing = false;
		this.acknowledgeBossFrameHidden();
	}
	acknowledgeBossFrameHidden() {
		this.j()._hud._boss._requestHide = false;
	}
	isStillConcealing() {
		return this.j()._hud._boss._concealing;
	}
	requestShowBossFrame() {
		this.j()._hud._boss._requestShow = true;
		this.beginRevealing();
	}
	beginRevealing() {
		this.j()._hud._boss._revealing = true;
	}
	endRevealing() {
		this.j()._hud._boss._revealing = false;
	}
	isStillRevealing() {
		return this.j()._hud._boss._revealing;
	}
	/**
	* Ensures all sprites are created and available for use.
	*/
	createCache() {
		this.getOrCreateTargetHpGaugeSprite();
	}
	/**
	* Creates the boss's hp gauge sprite for this window and caches it.
	* @returns {Sprite_MapGauge} The gauge sprite of the boss.
	*/
	getOrCreateTargetHpGaugeSprite() {
		return this.getOrCreateGaugeSprite("bossframe-enemy-hp-gauge", Window_BossFrame.HpGaugeSize);
	}
	handleInactivity() {}
	update() {
		super.update();
		this.manageBossFrameVisibility();
	}
	manageBossFrameVisibility() {
		if (this.isStillConcealing()) {
			this.fadeOutWindow();
		}
		if (this.isStillRevealing()) {
			this.fadeInWindow();
		}
	}
	/**
	* Fades out the boss frame window along with all sprites and content.
	*/
	fadeOutWindow() {
		this.contentsOpacity -= 10;
		this.j()._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);
		const contentsOpacityZero = this.contentsOpacity <= 0;
		const doneFading = contentsOpacityZero;
		if (doneFading) {
			this.endConcealing();
		}
	}
	/**
	* Fades in the boss frame window along with all sprites and content.
	*/
	fadeInWindow() {
		this.contentsOpacity += 40;
		this.j()._spriteCache.forEach((sprite, _) => sprite.opacity += 40);
		const contentsOpacityMax = this.contentsOpacity >= 255;
		const doneShowing = contentsOpacityMax;
		if (doneShowing) {
			this.endRevealing();
		}
	}
	/**
	* Lays out the boss frame. Where the target frame runs its icons, level, and name along one row, the
	* boss frame centers its icons and name across the whole frame, rides the level small and centered along the
	* top directly above them, and centers its gauge beneath.<br/>
	* Everything below the level drops by one level row to make room for it.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawContent(x, y) {
		this.drawTargetLevel(x, y);
		const bodyY = y + this.bossLevelRowHeight();
		this.drawTargetName(x, bodyY);
		this.drawTargetExtra(x, bodyY + 24);
		this.drawTargetBattlerInfo(x, y);
	}
	/**
	* Centers the boss's gauge across the frame, under the centered name.<br/>
	* The gauge is a child of the window rather than of its contents, so it centers on the window's own width.
	* The affliction strip starts from this same value, so it lines up under the gauge's left end.
	* @returns {number}
	*/
	targetBattlerGaugesX() {
		return (this.width - Window_BossFrame.HpGaugeSize.width) / 2;
	}
	/**
	* How far below the top of the gauges the afflictions start.<br/>
	* The boss frame only ever draws its hp gauge, so the afflictions only have to clear it, and a small gap.
	* @returns {number}
	*/
	targetGaugeStackHeight() {
		return Window_BossFrame.HpGaugeSize.height + 4;
	}
	/**
	* The vertical room reserved along the top of the frame for the level.<br/>
	* Nothing is reserved when there is no level to draw, so a frame without one keeps its name and
	* gauges where they would otherwise sit.
	* @returns {number}
	*/
	bossLevelRowHeight() {
		if (!this.canDrawTargetLevel()) return 0;
		return 16;
	}
	/**
	* Drops the gauges by the level row, so they stay below the name as it moves down to make room for
	* the level.<br/>
	* The affliction rows are positioned from this same value, which keeps them moving with the gauges.
	* @returns {number}
	*/
	targetBattlerGaugesY() {
		const baseGaugesY = super.targetBattlerGaugesY();
		return baseGaugesY + this.bossLevelRowHeight();
	}
	/**
	* Draws the target's name in the window.<br/>
	* A boss's name reads larger than a regular target's, and is centered across the frame- led by the same
	* icons the target frame leads its name with (the boss's own, then any an extension set), and in whatever
	* color the name hook settles on.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetName(x, y) {
		const iconCodes = this.targetRowIconIndices().map((iconIndex) => `\\I[${iconIndex}]`).join(String.empty);
		let name = `\\FS[24]${iconCodes}${this.targetName()}`;
		if (J.MESSAGE) {
			name = `\\*${name}`;
		}
		const color = this.targetNameColor();
		this.drawCenteredTextEx(name, y, color);
	}
	/**
	* Draws the level small and centered across the top of the frame, directly above the name.<br/>
	* On a frame this wide, anywhere measured from an edge would sit out under the rest of the HUD- so the
	* given x is not used here.
	* @param {string} levelString The level text, escape codes included.
	* @param {number} x The x coordinate; unused, since the level is centered.
	* @param {number} y The y coordinate.
	* @returns {number} The width the level took.
	*/
	drawTargetLevelText(levelString, x, y) {
		const color = this.targetLevelColor();
		return this.drawCenteredTextEx(levelString, y, color);
	}
	/**
	* Draws a line of text centered across the frame, and reports how wide it drew.<br/>
	* Measures with {@link Window_Base#textSizeEx} rather than {@link Window_Base#textWidth}: the latter
	* measures the raw string, so escape codes like `\FS[24]` count as printed characters, and the extra
	* width drags the line left of center.
	* @param {string} text The text to draw, escape codes included.
	* @param {number} y The y coordinate.
	* @param {string} color The color the text starts in.
	* @returns {number}
	*/
	drawCenteredTextEx(text, y, color) {
		const { width } = this.textSizeEx(text);
		const centerX = (this.contentsWidth() - width) / 2;
		return this.drawTextExInColor(text, centerX, y, width, color);
	}
	/**
	* Draws the target's various gauges.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawTargetBattlerGauges(x, y) {
		this.drawTargetHpGauge(x, y);
	}
};

//#endregion
//#region src/plugins/hud/ext/boss/scenes/Scene_Map.js
/**
* Extends {@link #initHudMembers}.<br/>
* Includes initialization of the boss frame members.
*/
J.HUD.EXT.BOSS.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.BOSS.Aliased.Scene_Map.get("initHudMembers").call(this);
	/**
	* A grouping of all properties that belong to the boss frame
	* extension of the HUD.
	*/
	this._j._hud._boss = {};
	/**
	* The target frame showing boss data.
	* This is much bigger than the regular target frame.
	* @type {Window_BossFrame}
	*/
	this._j._hud._boss._frame = null;
};
/**
* Extends {@link #createAllWindows}.<br/>
* Includes creation of the boss frame window.
*/
J.HUD.EXT.BOSS.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.BOSS.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createBossFrameWindow();
};
/**
* Creates the boss frame window and adds it to tracking.
*/
Scene_Map.prototype.createBossFrameWindow = function() {
	const window = this.buildBossFrameWindow();
	this.setBossFrameWindow(window);
	this.addWindow(window);
};
/**
* Sets up and defines the boss frame window.
* @returns {Window_BossFrame}
*/
Scene_Map.prototype.buildBossFrameWindow = function() {
	const rectangle = this.bossFrameWindowRect();
	const window = new Window_BossFrame(rectangle);
	return window;
};
/**
* Creates the rectangle representing the window for the boss frame.
* @returns {Rectangle}
*/
Scene_Map.prototype.bossFrameWindowRect = function() {
	const width = Graphics.boxWidth - 400;
	const height = 120;
	const x = (Graphics.boxWidth - width) / 2;
	const y = 0;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked boss frame window.
* @returns {Window_BossFrame}
*/
Scene_Map.prototype.getBossFrameWindow = function() {
	return this._j._hud._boss._frame;
};
/**
* Set the currently tracked boss frame window to the given window.
* @param {Window_BossFrame} window The window to track.
*/
Scene_Map.prototype.setBossFrameWindow = function(window) {
	this._j._hud._boss._frame = window;
};
/**
* Extends {@link #updateHudFrames}.<br/>
* Includes updating the target frame.
*/
J.HUD.EXT.BOSS.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.BOSS.Aliased.Scene_Map.get("updateHudFrames").call(this);
	this.handleAssignBoss();
	this.handleBossFrameVisibility();
	this.handleTargetFramePlacement();
};
/**
* Handles incoming requests to assign a boss to the boss frame.
*/
Scene_Map.prototype.handleAssignBoss = function() {
	if (!BossFrameManager.needsBossFrameRefresh()) return;
	const newBoss = BossFrameManager.getBossFrame();
	this.getBossFrameWindow().setTarget(newBoss);
	BossFrameManager.acknowledgeBossFrameRefresh();
};
Scene_Map.prototype.handleBossFrameVisibility = function() {
	this.handleHideBossFrame();
	this.handleShowBossFrame();
};
Scene_Map.prototype.handleHideBossFrame = function() {
	if (!BossFrameManager.needsBossFrameHiding()) return;
	this.getBossFrameWindow().requestHideBossFrame();
	BossFrameManager.acknowledgeBossFrameHidden();
};
Scene_Map.prototype.handleShowBossFrame = function() {
	if (!BossFrameManager.needsBossFrameShowing()) return;
	this.getBossFrameWindow().requestShowBossFrame();
	BossFrameManager.acknowledgeBossFrameShown();
};
/**
* Keeps the target frame out from under the boss frame.<br/>
* Both frames want the top of the screen, so while the boss frame is up, the target frame waits just below
* it- and goes back to its usual place once the boss frame is hidden.
*/
Scene_Map.prototype.handleTargetFramePlacement = function() {
	const targetFrame = this.getTargetFrameWindow();
	const bossFrame = this.getBossFrameWindow();
	const bossFrameBottom = bossFrame.y + bossFrame.height;
	const restingY = J.HUD.EXT.TARGET.Metadata.TargetFrameY;
	targetFrame.y = BossFrameManager.targetFrameY(restingY, bossFrameBottom);
};

//#endregion
//# sourceMappingURL=J-HUD-BossFrame.js.map