//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 PASSIVE-SKS] Gates passive state application by SKS equip state.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Passive
 * @base J-SkillSlots
 * @orderAfter J-Base
 * @orderAfter J-Passive
 * @orderAfter J-SkillSlots
 * @help
 * ============================================================================
 * OVERVIEW
 * Without this extension, a learned skill contributes its <passive:[...]>
 * effect the instant it is known, regardless of whether it is equipped into
 * an SKS slot.
 *
 * This extension narrows an actor's passive-state-sourced skills down to only
 * those currently equipped via SKS, alongside any skill exempt from slotting
 * entirely (tagged <unslotted>, or ineligible for slotting by skill type).
 * Exempt skills behave exactly as they do without this extension- always
 * contributing their passive effect once known. Enemies are unaffected, since
 * SKS's equip state only exists for actors.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations


//#region src/plugins/passive/ext/sks/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Passive-SKS.
*/
var JPassiveSks_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/passive/ext/sks/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PASSIVE.EXT.SKS = {};
/**
* The metadata associated with this plugin.
*/
J.PASSIVE.EXT.SKS.Metadata = new JPassiveSks_PluginMetadata("J-Passive-SKS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.SKS.Aliased = {};
J.PASSIVE.EXT.SKS.Aliased.Game_Actor = new Map();

//#endregion
//#region src/plugins/passive/ext/sks/objects/Game_Actor.js
/**
* Extends {@link #getPassiveStateSourcedSkills}.<br/>
* Narrows the passive-state-sourced skill list down to skills that are exempt from SKS
* gating (tagged <unslotted>, ineligible for slotting, or exempted for this battler
* specifically via <unslottedSkills:[...]>) or currently equipped via SKS. This is
* actor-only- SKS equip state does not exist for enemies, so enemies keep deriving
* passives from every learned skill via the unmodified base implementation.
*/
J.PASSIVE.EXT.SKS.Aliased.Game_Actor.set("getPassiveStateSourcedSkills", Game_Actor.prototype.getPassiveStateSourcedSkills);
Game_Actor.prototype.getPassiveStateSourcedSkills = function() {
	const learnedSkills = J.PASSIVE.EXT.SKS.Aliased.Game_Actor.get("getPassiveStateSourcedSkills").call(this);
	const equippedIds = new Set(this.equippedSkills().map((skill) => skill.id));
	const forcedUnslottedIds = this.forcedUnslottedSkillIds();
	return learnedSkills.filter((skill) => skill.unslotted === true || forcedUnslottedIds.has(skill.id) || equippedIds.has(skill.id));
};

//#endregion
//# sourceMappingURL=J-Passive-SKS.js.map