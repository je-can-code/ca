//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 EXTEND-ABS] J-ABS integration for J-Extend.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Extend
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Extend
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Extend for J-ABS.
 * It prevents the JABS AI from selecting skill-extension skills as actions.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is pure integration glue
 * between J-Extend and J-ABS's AI skill-selection logic.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion annotations


//#region src/plugins/extend/ext/abs/_metadata/_pluginMetadata.js
var JExtendAbs_PluginMetadata = class extends PluginMetadata {
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/extend/ext/abs/_metadata/initialization.js
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.EXTEND.EXT.ABS = {};
/**
* The metadata associated with this plugin.
*/
J.EXTEND.EXT.ABS.Metadata = new JExtendAbs_PluginMetadata("J-Extend-ABS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.EXTEND.EXT.ABS.Aliased = {};
J.EXTEND.EXT.ABS.Aliased.JABS_Battler = new Map();

//#endregion
//#region src/plugins/extend/ext/abs/database/RPG_Skill.js
/**
* Whether or not this skill is a skill-extension skill (bears an {@code <extend:[IDs]>} tag).
* Extension skills are excluded from the JABS AI skill pool.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "isSkillExtender", { get: function() {
	return J.EXTEND.RegExp.Extend.test(this.note);
} });

//#endregion
//#region src/plugins/extend/ext/abs/managers/JABS_Battler.js
/**
* Extends {@link #aiSkillFilter}.<br/>
* Excludes skill-extension skills from the AI skill pool.
*/
J.EXTEND.EXT.ABS.Aliased.JABS_Battler.set("aiSkillFilter", JABS_Battler.prototype.aiSkillFilter);
JABS_Battler.prototype.aiSkillFilter = function(skill) {
	const isValid = J.EXTEND.EXT.ABS.Aliased.JABS_Battler.get("aiSkillFilter").call(this, skill);
	if (isValid === false) return false;
	if (skill.isSkillExtender === true) return false;
	return true;
};

//#endregion
//# sourceMappingURL=J-Extend-ABS.js.map