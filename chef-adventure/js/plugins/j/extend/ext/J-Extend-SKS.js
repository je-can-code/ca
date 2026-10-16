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
 * Please refer to J-Extend-SKS's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/extend/ext/sks/index.md
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
	if (!this.skillId()) return null;
	if (this.actor()) return this.actor().skill(this.skillId());
	return J.EXTEND.EXT.SKS.Aliased.Window_SkillEquipDetail.get("skill").call(this);
};
/**
* Gets the skill id.
* @returns {number} The skillId.
*/
Window_SkillEquipDetail.prototype.skillId = function() {
	return this._skillId;
};
/**
* Gets the actor whose equipped skill is being detailed.
* @returns {Game_Actor} The detailed actor.
*/
Window_SkillEquipDetail.prototype.actor = function() {
	return this._actor;
};

//#endregion
//# sourceMappingURL=J-Extend-SKS.js.map