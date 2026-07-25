//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 HUD-QUEST] A HUD frame that displays quest objective information.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD plugin.
 * It will display quests and their objectives and the player's progress as
 * in realtime.
 *
 * It will show and hide with the rest of the HUD, and will only reveal quests
 * that are flagged as "tracked" in the questopedia.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Quest and objective data is sourced from the Omni/Questopedia system (see
 * J-Omni-Quest), not from notetags of any kind- this plugin is purely a
 * display frame that reads tracked quest state and renders it.
 *
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Wrote real help docs; the help text was still boilerplate placeholder.
 *    Removed leftover unused scaffold plugin params/command/regex.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/hud/ext/quest/_metadata/_pluginMetadata.js
var J_HUD_Quest_PluginMetadata = class extends PluginMetadata {
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
	initializeMetadata() {}
};

//#endregion
//#region src/plugins/hud/ext/quest/_metadata/initialization.js
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
})();
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.HUD.EXT.QUEST ||= {};
/**
* The metadata associated with this plugin.
* @type {J_HUD_Quest_PluginMetadata}
*/
J.HUD.EXT.QUEST.Metadata = new J_HUD_Quest_PluginMetadata("J-HUD-QuestFrame", "1.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.QUEST.Aliased = {};
J.HUD.EXT.QUEST.Aliased.Scene_Map = new Map();
J.HUD.EXT.QUEST.Aliased.Scene_Questopedia = new Map();
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest = new Map();
J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective = new Map();
J.HUD.EXT.QUEST.Aliased.HudManager = new Map();

//#endregion
//#region src/plugins/hud/ext/quest/managers/HudManager.js
/**
* Initialize the various members of the HUD.
*/
J.HUD.EXT.QUEST.Aliased.HudManager.set("initMembers", HudManager.prototype.initMembers);
HudManager.prototype.initMembers = function() {
	J.HUD.EXT.QUEST.Aliased.HudManager.get("initMembers").call(this);
	/**
	* The request state for the quest data of the HUD.
	* @type {boolean}
	*/
	this._needsQuestRefresh = true;
};
/**
* Issue a request to refresh the quest data in the HUD.
*/
HudManager.prototype.requestQuestRefresh = function() {
	this._needsQuestRefresh = true;
};
/**
* Acknowledge the request to refresh the HUD.
*/
HudManager.prototype.acknowledgeQuestRefresh = function() {
	this._needsQuestRefresh = false;
};
/**
* Whether or not we have a request to refresh the quest data of the HUD.
* @returns {boolean}
*/
HudManager.prototype.needsQuestRefresh = function() {
	return this._needsQuestRefresh;
};

//#endregion
//#region src/plugins/hud/ext/quest/_models/TrackedOmniQuest.js
/**
* Extends {@link refreshState}.<br/>
* Also flags the HUD for refreshment.
*/
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.set("refreshState", TrackedOmniQuest.prototype.refreshState);
TrackedOmniQuest.prototype.refreshState = function() {
	J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.get("refreshState").call(this);
	$hudManager.requestQuestRefresh();
};
/**
* Unlocks this quest and actives the target objective. If no objectiveId is provided, then the first objective will be
* made {@link OmniObjective.States.Active}.
* @param {number=} objectiveId The id of the objective to initialize as active; defaults to the immediate or first.
*/
J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.set("unlock", TrackedOmniQuest.prototype.unlock);
TrackedOmniQuest.prototype.unlock = function(objectiveId = null) {
	J.HUD.EXT.QUEST.Aliased.TrackedOmniQuest.get("unlock").call(this, objectiveId);
	const hasNoTrackedQuests = QuestManager.trackedQuests().length === 0;
	if (hasNoTrackedQuests && this.state === OmniQuest.States.Active) {
		this.toggleTracked();
		$hudManager.requestQuestRefresh();
	}
};

//#endregion
//#region src/plugins/hud/ext/quest/_models/TrackedOmniObjective.js
/**
* Extends {@link onObjectiveUpdate}.<br/>
* Also refreshes the HUD for tracked quests.
*/
J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective.set("onObjectiveUpdate", TrackedOmniObjective.prototype.onObjectiveUpdate);
TrackedOmniObjective.prototype.onObjectiveUpdate = function() {
	J.HUD.EXT.QUEST.Aliased.TrackedOmniObjective.get("onObjectiveUpdate").call(this);
	if (QuestManager.quest(this.questKey).tracked) {
		$hudManager.requestQuestRefresh();
	}
};

//#endregion
//#region src/plugins/hud/ext/quest/windows/Window_QuestFrame.js
/**
* A window containing the HUD data for the {@link QuestManager}'s tracked quests.
*/
var Window_QuestFrame = class extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The window size desired for this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Extends {@link initialize}.<br/>
	* Also configures this window accordingly.
	* @param {Rectangle} rect The rectangle representing this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.configure();
		this.refresh();
	}
	/**
	* Performs the one-time setup and configuration per instantiation.
	*/
	configure() {
		this.opacity = 0;
	}
	/**
	* Extends {@link #update}.<br/>
	* Manages visibility of the quest frame.
	*/
	update() {
		super.update();
		if (!$hudManager.canShowHud()) {
			if (!this.isClosed()) {
				this.close();
			}
			return;
		} else {
			if (!this.isOpen()) {
				this.open();
				this.refresh();
			}
		}
		this.updateVisibility();
	}
	/**
	* Manages the visibility while the player is potentially interfering with it.
	*/
	updateVisibility() {
		if (this.playerInterference()) {
			this.handlePlayerInterference();
		} else {
			this.handleNonInterferenceOpacity();
		}
	}
	/**
	* Determines whether or not the player is in the way (or near it) of this window.
	* @returns {boolean} True if the player is in the way, false otherwise.
	*/
	playerInterference() {
		const playerX = $gamePlayer.screenX();
		const playerY = $gamePlayer.screenY();
		return playerX < this.width && playerY < this.height;
	}
	/**
	* Manages opacity for the window while the player is interfering with the visibility.
	*/
	handlePlayerInterference() {
		if (this.contentsOpacity > 64) {
			this.contentsOpacity -= 15;
		} else if (this.contentsOpacity < 64) this.contentsOpacity += 1;
	}
	/**
	* Reverts the opacity changes associated with the player getting in the way.
	*/
	handleNonInterferenceOpacity() {
		this.contentsOpacity = 255;
	}
	/**
	* Draws the quests currently tracked in the window as an element of the HUD.
	*/
	drawContent() {
		if (!$hudManager.canShowHud()) return;
		const [x, y] = [0, 0];
		this.drawQuests(x, y);
	}
	/**
	* Renders all {@link TrackedOmniQuest}s the player currently has set as "tracked".
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuests(x, y) {
		const quests = QuestManager.trackedQuests();
		if (quests.length === 0) return;
		const lh = this.lineHeight();
		let lineCount = 0;
		quests.forEach((quest) => {
			const questY = y;
			const questNameY = questY + lh * lineCount;
			this.drawQuestName(quest, x, questNameY);
			lineCount++;
			const drawableObjectives = quest.objectives.filter((objective) => objective.isActive());
			if (drawableObjectives.length === 0) {
				const nonObjectiveY = questY + lh * lineCount;
				this.drawNonObjective(quest, x, nonObjectiveY);
				lineCount++;
				return;
			}
			drawableObjectives.forEach((objective) => {
				const objectiveY = questY + lh * lineCount;
				this.drawObjective(objective, x, objectiveY);
				lineCount++;
			});
		}, this);
	}
	/**
	* Renders the name of the quest being tracked.
	* @param {TrackedOmniQuest} quest The quest being tracked.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuestName(quest, x, y) {
		const possiblyMaskedName = quest.isKnown() ? quest.name() : J.BASE.Helpers.maskString(quest.name());
		const questNameSized = this.modFontSizeForText(-4, possiblyMaskedName);
		const questName = this.boldenText(questNameSized);
		const questNameWidth = this.textWidth(questName);
		this.drawTextEx(questName, x, y, questNameWidth);
	}
	/**
	* Renders in-place of objectives the appropriate "you're not currently on any active objective for this quest" text,
	*
	* This situation is kind of an exceptional situation for a player to likely want to track a quest for, and should be
	* called out as a thing to discourage the player from keeping tracked.
	* @param {TrackedOmniQuest} quest The quest to render for the non-objective situation.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawNonObjective(quest, x, y) {
		let noObjectivesText;
		switch (true) {
			case quest.isCompleted():
				noObjectivesText = `✅ Quest is complete.`;
				break;
			case quest.isFailed():
				noObjectivesText = `❌ Quest is failed.`;
				break;
			case quest.isMissed():
				noObjectivesText = `❓ Quest is missed.`;
				break;
			default:
				const secretObjective = quest.objectives.find((objective) => !objective.isHidden());
				noObjectivesText = secretObjective ? secretObjective.fulfillmentText() : `🍈 Quest is in a state with no known objectives active.`;
				break;
		}
		const text = this.modFontSizeForText(-8, noObjectivesText);
		const nonObjectiveX = x + 10;
		const objectiveTextWidth = this.textWidth(text);
		this.drawTextEx(text, nonObjectiveX, y, objectiveTextWidth);
	}
	/**
	* Renders the fulfillment text for the given objective.
	* @param {TrackedOmniObjective} objective The objective to render.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawObjective(objective, x, y) {
		const objectiveText = this.modFontSizeForText(-8, objective.fulfillmentText());
		const objectiveX = x + 10;
		const objectiveTextWidth = this.textWidth(objectiveText);
		this.drawTextEx(objectiveText, objectiveX, y, objectiveTextWidth);
	}
	/**
	* Overwrites {@link lineHeight}.<br/>
	* This window's default lineheight will be 10 less than the default.
	* @returns {number}
	*/
	lineHeight() {
		return super.lineHeight() - 10;
	}
};

//#endregion
//#region src/plugins/hud/ext/quest/scenes/Scene_Map.js
/**
* Extends {@link #initHudMembers}.<br/>
* Includes initialization of the target frame members.
*/
J.HUD.EXT.QUEST.Aliased.Scene_Map.set("initHudMembers", Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function() {
	J.HUD.EXT.QUEST.Aliased.Scene_Map.get("initHudMembers").call(this);
	/**
	* A grouping of all properties that belong to quest extension of the HUD.
	*/
	this._j._hud._quest = {};
	/**
	* The quest frame for tracking quests and their objectives.
	* @type {Window_QuestFrame}
	*/
	this._j._hud._quest._questFrame = null;
};
/**
* Extends {@link #createAllWindows}.<br/>
* Includes creation of the target frame window.
*/
J.HUD.EXT.QUEST.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.QUEST.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createQuestFrameWindow();
};
/**
* Creates the quest frame window and adds it to tracking.
*/
Scene_Map.prototype.createQuestFrameWindow = function() {
	const window = this.buildQuestFrameWindow();
	this.setQuestFrameWindow(window);
	this.addWindow(window);
};
/**
* Sets up and defines the quest frame window.
* @returns {Window_QuestFrame}
*/
Scene_Map.prototype.buildQuestFrameWindow = function() {
	const rectangle = this.questFrameWindowRect();
	const window = new Window_QuestFrame(rectangle);
	return window;
};
/**
* Creates the rectangle representing the window for the target frame.
* @returns {Rectangle}
*/
Scene_Map.prototype.questFrameWindowRect = function() {
	const width = 800;
	const height = 400;
	const x = 0;
	const y = 0;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked quest frame window.
* @returns {Window_QuestFrame}
*/
Scene_Map.prototype.getQuestFrameWindow = function() {
	return this._j._hud._quest._questFrame;
};
/**
* Set the currently tracked quest frame window to the given window.
* @param {Window_QuestFrame} window The window to track.
*/
Scene_Map.prototype.setQuestFrameWindow = function(window) {
	this._j._hud._quest._questFrame = window;
};
/**
* Extends {@link #updateHudFrames}.<br/>
* Includes updating the target frame.
*/
J.HUD.EXT.QUEST.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.QUEST.Aliased.Scene_Map.get("updateHudFrames").call(this);
	if ($hudManager.needsQuestRefresh()) {
		this.getQuestFrameWindow().refresh();
		$hudManager.acknowledgeQuestRefresh();
	}
};

//#endregion
//#region src/plugins/hud/ext/quest/scenes/Scene_Questopedia.js
/**
* Extends {@link onQuestopediaListSelection}.<br/>
* Triggers a HUD update request when something is selected in the list of quests.
*/
J.HUD.EXT.QUEST.Aliased.Scene_Questopedia.set("onQuestopediaListSelection", Scene_Questopedia.prototype.onQuestopediaListSelection);
Scene_Questopedia.prototype.onQuestopediaListSelection = function() {
	J.HUD.EXT.QUEST.Aliased.Scene_Questopedia.get("onQuestopediaListSelection").call(this);
	$hudManager.requestQuestRefresh();
};

//#endregion
//# sourceMappingURL=J-HUD-QuestFrame.js.map