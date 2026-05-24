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
	const requiredBaseVersion = "2.1.1";
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
Scene_Menu.prototype.commandWindowRect = function() {
	const ww = this.mainCommandWidth();
	const wh = this.mainAreaHeight() - this.goldWindowRect().height;
	const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
	const wy = this.mainAreaTop();
	return new Rectangle(wx, wy, ww, wh);
};
Scene_Menu.prototype.statusWindowRect = function() {
	const ww = Graphics.boxWidth - this.mainCommandWidth();
	const wh = this.mainAreaHeight();
	const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
	const wy = this.mainAreaTop();
	return new Rectangle(wx, wy, ww, wh);
};
Scene_Menu.prototype.isRightInputMode = function() {
	return false;
};
Scene_Menu.prototype.isBottomHelpMode = function() {
	return false;
};
Scene_Menu.prototype.isBottomButtonMode = function() {
	return true;
};

//#endregion
//#region src/plugins/cms/main/windows/Window_MenuCommand.js
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
Window_MenuCommand.prototype.addOptionsCommand = function() {
	if (this.needsCommand("options")) {
		const enabled = this.isOptionsEnabled();
		this.addCommand(TextManager.options, "options", enabled, null, 2566);
	}
};
Window_MenuCommand.prototype.addGameEndCommand = function() {
	const enabled = this.isGameEndEnabled();
	this.addCommand(TextManager.gameEnd, "gameEnd", enabled, null, 2562);
};

//#endregion
//#region src/plugins/cms/main/windows/Window_MenuStatus.js
Window_MenuStatus.prototype.numVisibleRows = function() {
	return 6;
};
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