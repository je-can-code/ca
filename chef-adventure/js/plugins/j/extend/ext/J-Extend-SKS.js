//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 EXTEND-SKS] J-SKS integration for J-Extend.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-SkillSlots
 * @base J-Extend
 * @orderAfter J-Base
 * @orderAfter J-SkillSlots
 * @orderAfter J-Extend
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Extend for J-SKS.
 * It causes the skill equip detail window to display the overlayed skill
 * rather than the base skill when J-Extend is active.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is pure integration glue
 * between J-Extend and J-SKS's skill equip detail window.
 * ============================================================================
 */
//endregion annotations


//#region src/plugins/extend/ext/sks/_metadata/_pluginMetadata.js
var JExtendSks_PluginMetadata = class extends PluginMetadata {
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/extend/ext/sks/_metadata/initialization.js
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.EXTEND.EXT.SKS = {};
/**
* The metadata associated with this plugin.
*/
J.EXTEND.EXT.SKS.Metadata = new JExtendSks_PluginMetadata("J-Extend-SKS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.EXTEND.EXT.SKS.Aliased = {};
J.EXTEND.EXT.SKS.Aliased.Window_SkillEquipDetail = new Map();

//#endregion
//#region src/plugins/extend/ext/sks/windows/Window_SkillEquipDetail.js
J.EXTEND.EXT.SKS.Aliased.Window_SkillEquipDetail.set("skill", Window_SkillEquipDetail.prototype.skill);
/**
* Extends {@link Window_SkillEquipDetail#skill} to return the overlayed skill
* when an actor context is available, surfacing the full inherited skill chain.
* @returns {RPG_Skill|null}
*/
Window_SkillEquipDetail.prototype.skill = function() {
	if (!this._skillId) return null;
	if (this._actor) {
		return OverlayManager.getExtendedSkill(this._actor, this._skillId);
	}
	return J.EXTEND.EXT.SKS.Aliased.Window_SkillEquipDetail.get("skill").call(this);
};

//#endregion
//# sourceMappingURL=J-Extend-SKS.js.map