//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 SKS-ABS] Makes JABS's combat/dodge/offhand quick menus respect SKS-equipped skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-SkillSlots
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-SkillSlots
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * Without this extension, SKS's equip scene and JABS's combat/dodge/offhand
 * quick menus are unaware of each other: a skill sitting in an SKS slot has no
 * effect on what JABS considers assignable, and every learned, menu-eligible
 * skill remains selectable regardless of whether it is actually equipped.
 *
 * This extension narrows JABS's combat, dodge, and offhand candidate pools
 * down to only the skills an actor currently has equipped via SKS, alongside
 * any skill exempt from slotting entirely (tagged <unslotted>, or ineligible
 * for slotting by skill type). It also keeps JABS's own quick-menu slots in
 * sync when a skill is unequipped from SKS- if that skill was actively pinned
 * to a combat, dodge, or offhand button, that button is cleared automatically
 * rather than being left pointing at a skill the actor can no longer use.
 *
 * The mainhand-provided offhand skill (granted by the equipped weapon, not
 * learned or chosen by the player) is always exempt from this filter, since
 * it was never meant to compete for an SKS slot in the first place.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations


//#region src/plugins/sks/ext/abs/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-SkillSlots-ABS.
*/
var JSkillSlotsAbs_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/sks/ext/abs/_metadata/initialization.js
globalThis.J ||= {};
J.SKS ||= {};
J.SKS.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.SKS.EXT.ABS = {};
/**
* The metadata associated with this plugin.
*/
J.SKS.EXT.ABS.Metadata = new JSkillSlotsAbs_PluginMetadata("J-SkillSlots-ABS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.SKS.EXT.ABS.Aliased = {};
J.SKS.EXT.ABS.Aliased.Game_Actor = new Map();

//#endregion
//#region src/plugins/sks/ext/abs/objects/Game_Actor.js
/**
* Filters a candidate skill pool down to those exempt from SKS gating (tagged
* <unslotted>, or otherwise ineligible for slotting) or currently SKS-equipped.
* @param {Game_Actor} actor The actor whose SKS equip state governs the filter.
* @param {RPG_Skill[]} candidates The unfiltered candidate pool to narrow.
* @returns {RPG_Skill[]}
*/
function filterToEquippedOrExempt(actor, candidates) {
	const equippedSkillIds = actor.equippedSkills().map((skill) => skill.id);
	const equippedIds = new Set(equippedSkillIds);
	return candidates.filter((skill) => skill.unslotted === true || equippedIds.has(skill.id));
}
/**
* Extends {@link #buildCombatSkillCandidatePool}.<br/>
* Narrows the combat quick-menu candidate pool down to SKS-equipped (or exempt) skills.
*/
J.SKS.EXT.ABS.Aliased.Game_Actor.set("buildCombatSkillCandidatePool", Game_Actor.prototype.buildCombatSkillCandidatePool);
Game_Actor.prototype.buildCombatSkillCandidatePool = function() {
	const candidates = J.SKS.EXT.ABS.Aliased.Game_Actor.get("buildCombatSkillCandidatePool").call(this);
	return filterToEquippedOrExempt(this, candidates);
};
/**
* Extends {@link #buildDodgeSkillCandidatePool}.<br/>
* Narrows the dodge quick-menu candidate pool down to SKS-equipped (or exempt) skills.
*/
J.SKS.EXT.ABS.Aliased.Game_Actor.set("buildDodgeSkillCandidatePool", Game_Actor.prototype.buildDodgeSkillCandidatePool);
Game_Actor.prototype.buildDodgeSkillCandidatePool = function() {
	const candidates = J.SKS.EXT.ABS.Aliased.Game_Actor.get("buildDodgeSkillCandidatePool").call(this);
	return filterToEquippedOrExempt(this, candidates);
};
/**
* Extends {@link #buildOffhandAssignableSkillPool}.<br/>
* Narrows the offhand quick-menu candidate pool down to SKS-equipped (or exempt) skills.
* The mainhand-provided offhand skill is always exempt- it is granted by the equipped
* weapon, not learned or chosen by the player, so it was never meant to compete for a slot.
*/
J.SKS.EXT.ABS.Aliased.Game_Actor.set("buildOffhandAssignableSkillPool", Game_Actor.prototype.buildOffhandAssignableSkillPool);
Game_Actor.prototype.buildOffhandAssignableSkillPool = function() {
	const candidates = J.SKS.EXT.ABS.Aliased.Game_Actor.get("buildOffhandAssignableSkillPool").call(this);
	const mainhandProvidedSkillId = this.getMainhandProvidedOffhandSkillId();
	const equippedSkillIds = this.equippedSkills().map((skill) => skill.id);
	const equippedIds = new Set(equippedSkillIds);
	return candidates.filter((skill) => skill.unslotted === true || equippedIds.has(skill.id) || skill.id === mainhandProvidedSkillId);
};
/**
* Extends {@link #onSkillUnequipChange}.<br/>
* Clears any live JABS combat/dodge/offhand slot pointing at a skill that was just
* unequipped from SKS, so no button is left pointing at a skill the actor can no longer use.
*/
J.SKS.EXT.ABS.Aliased.Game_Actor.set("onSkillUnequipChange", Game_Actor.prototype.onSkillUnequipChange);
Game_Actor.prototype.onSkillUnequipChange = function(slotIndex, skillId) {
	J.SKS.EXT.ABS.Aliased.Game_Actor.get("onSkillUnequipChange").call(this, slotIndex, skillId);
	const jabsSlot = this.getSkillSlotManager().getSlotBySkillId(skillId);
	if (!jabsSlot) return;
	this.getSkillSlotManager().clearSlot(jabsSlot.key);
};

//#endregion
//# sourceMappingURL=J-SkillSlots-ABS.js.map