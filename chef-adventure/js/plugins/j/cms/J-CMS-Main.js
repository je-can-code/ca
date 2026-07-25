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
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely a scene/window
 * redesign of the native main menu.
 * ============================================================================
 */
//endregion Introduction

//#region src/plugins/cms/main/_metadata/_pluginMetadata.js
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
//#region src/plugins/cms/main/_metadata/initialization.js
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
J.CMS_M.Metadata = new J_CmsMain_PluginMetadata("J-CMS-Main", "1.0.0");
J.CMS_M.Aliased = {
	Scene_Menu: {},
	Window_EquipItem: {},
	Window_EquipSlot: {}
};

//#endregion
//#region src/plugins/cms/main/scenes/Scene_Menu.js
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
//#region src/plugins/cms/main/windows/Window_MenuCommand.js
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
//#region src/plugins/cms/main/windows/Window_MenuStatus.js
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
//# sourceMappingURL=J-CMS-Main.js.map