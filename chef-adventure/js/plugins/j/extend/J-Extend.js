//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.9.0 EXTEND] Extends the capabilities of skills/actions.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * Please refer to J-Extend's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/extend/core/index.md
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/extend/core/_metadata/_pluginMetadata.js
var J_SkillExtendPluginMetadata = class extends PluginMetadata {
	/**
	* The set of tag keys whose note lines are appended across extensions rather than replaced.
	* Plugins opt in by calling {@link registerNonCombiningKey} during Scene_Boot.
	* @type {Set<string>}
	*/
	_nonCombiningKeys = new Set();
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Registers a tag key as non-combining for note merging.
	* When two extensions both carry this tag, their lines are appended rather than the overlay replacing the base.
	* The key is derived automatically from the provided regexp via {@link J.BASE.Helpers.getKeyFromRegexp}.
	* @param {RegExp} regexp The regexp whose tag key should be registered as non-combining.
	* @param {boolean} [asBoolean=false] Pass true for boolean tags (no colon) so the key is derived correctly.
	*/
	registerNonCombiningKey(regexp, asBoolean = false) {
		const key = J.BASE.Helpers.getKeyFromRegexp(regexp, asBoolean).toLowerCase();
		this.nonCombiningKeys().add(key);
	}
	/**
	* The live set of registered non-combining tag keys.
	* Registration mutates this set directly; readers should prefer {@link getNonCombiningKeys}, which
	* hands back a copy rather than the collection itself.
	* @returns {Set<string>} The backing set.
	*/
	nonCombiningKeys() {
		return this._nonCombiningKeys;
	}
	/**
	* Gets all registered non-combining tag keys as an array.
	* @returns {string[]} The registered keys, all lowercase.
	*/
	getNonCombiningKeys() {
		return [...this.nonCombiningKeys()];
	}
};

//#endregion
//#region src/plugins/extend/core/_metadata/initialization.js
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
J.EXTEND = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.EXTEND.Metadata = new J_SkillExtendPluginMetadata("J-Extend", "1.9.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.EXTEND.Aliased = {};
J.EXTEND.Aliased.DataManager = new Map();
J.EXTEND.Aliased.Game_Action = new Map();
J.EXTEND.Aliased.Game_Actor = new Map();
J.EXTEND.Aliased.Game_Enemy = new Map();
J.EXTEND.Aliased.Game_Item = new Map();
J.EXTEND.Aliased.JABS_SkillSlotManager = new Map();
/**
* A namespace for all J.EXTEND extension plugins.
*/
J.EXTEND.EXT = {};
/**
* All regular expressions used by this plugin.
*/
J.EXTEND.RegExp = {};
/**
* The structure of a skill or state extension tag.
*
* <pre>
* Structure:
*  <extend:[ID,...]>
*
* Example (on a skill):
*  <extend:[7, 8, 9]>
*
* Translation:
*  Extends skill/state id 7.
*  Extends skill/state id 8.
*  Extends skill/state id 9.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.Extend = /<extend:[ ]?(\[[ ]?\d+(?:,[ ]?\d+)*[ ]?])>/i;
/**
* The structure of a type-based extension tag.
*
* <pre>
* Structure:
*  <extendType:TYPE>
*
* Example (on a state):
*  <extendType:poison>
*
* Example (on a skill):
*  <extendType:low-effort>
*
* Translation:
*  Extends every currently-active state (or every known skill) bearing the {@code <type:TYPE>}
*  classifier "poison"/"low-effort", without listing each target id individually.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ExtendType = /<extendType:[ ]?(.+?)>/i;
/**
* The structure of an on-hit self-state application tag.
*
* <pre>
* Structure:
*  <onHitSelfState:[STATE_ID, CHANCE]>
*
* Example:
*  <onHitSelfState:[19, 100]>
*
* Translation:
*  On hit, apply state id 19 to oneself at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnHitSelfState = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-hit self-state loss tag.
*
* <pre>
* Structure:
*  <onHitLoseState:[STATE_ID, CHANCE]>
*
* Example:
*  <onHitLoseState:[19, 100]>
*
* Translation:
*  On hit, lose one stack of state id 19 from oneself at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnHitLoseState = /<onHitLoseState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-hit target-state stripping tag.
*
* <pre>
* Structure:
*  <onHitStripState:[STATE_ID, CHANCE]>
*
* Example:
*  <onHitStripState:[19, 100]>
*
* Translation:
*  On hit, strip one stack of state id 19 from the target at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnHitStripState = /<onHitStripState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-hit target-state removal tag.
*
* <pre>
* Structure:
*  <onHitRemoveState:[STATE_ID, CHANCE]>
*
* Example:
*  <onHitRemoveState:[19, 100]>
*
* Translation:
*  On hit, fully remove state id 19 from the target at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnHitRemoveState = /<onHitRemoveState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-cast self-state application tag.
*
* <pre>
* Structure:
*  <onCastSelfState:[STATE_ID, CHANCE]>
*
* Example:
*  <onCastSelfState:[19, 100]>
*
* Translation:
*  On cast, apply state id 19 to oneself at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastSelfState = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-cast self-state loss tag.
*
* <pre>
* Structure:
*  <onCastLoseState:[STATE_ID, CHANCE]>
*
* Example:
*  <onCastLoseState:[19, 100]>
*
* Translation:
*  On cast, lose one stack of state id 19 from oneself at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastLoseState = /<onCastLoseState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of a conditional on-cast self-state tag.
* Applies a state to oneself only if the caster already has a required state active.
*
* <pre>
* Structure:
*  <onCastSelfStateIfAfflicted:[STATE_TO_APPLY, CHANCE, STATE_REQUIREMENT]>
*
* Example:
*  <onCastSelfStateIfAfflicted:[42, 100, 19]>
*
* Translation:
*  On cast, if the caster has state id 19 active, apply state id 42 to oneself at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastSelfStateIfAfflicted = /<onCastSelfStateIfAfflicted:[ ]?(\[\d+,[ ]?\d+,[ ]?\d+])>/gi;
/**
* The structure of an on-cast target-state stripping tag.
*
* <pre>
* Structure:
*  <onCastStripState:[STATE_ID, CHANCE]>
*
* Example:
*  <onCastStripState:[19, 100]>
*
* Translation:
*  On cast, strip one stack of state id 19 from the target at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastStripState = /<onCastStripState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-cast target-state removal tag.
*
* <pre>
* Structure:
*  <onCastRemoveState:[STATE_ID, CHANCE]>
*
* Example:
*  <onCastRemoveState:[19, 100]>
*
* Translation:
*  On cast, fully remove state id 19 from the target at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastRemoveState = /<onCastRemoveState:[ ]?(\[\d+,[ ]?\d+])>/i;
/**
* The structure of an on-cast force-execute-skill tag. Fires once at press-time, same as the rest
* of the on-cast family — not per target hit. Repeatable: a skill may carry several of these tags,
* each rolled and dispatched independently, so one cast can chain into multiple follow-up skills.
*
* <pre>
* Structure:
*  <onCastExecuteSkill:[SKILL_ID, CHANCE]>
*
* Example:
*  <onCastExecuteSkill:[1026, 100]>
*  <onCastExecuteSkill:[1027, 50]>
*
* Translation:
*  On cast, always force-execute skill id 1026, and separately roll a 50% chance to also
*  force-execute skill id 1027.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastExecuteSkill = /<onCastExecuteSkill:[ ]?(\[\d+,[ ]?\d+])>/gi;
/**
* The structure of a conditional on-cast force-execute-skill tag.
* Force-executes a payload skill only if the caster already has a required state active — the
* <onCastSelfStateIfAfflicted> gate pattern, applied to <onCastExecuteSkill> instead of a self-state.
*
* <pre>
* Structure:
*  <onCastExecuteSkillIfAfflicted:[SKILL_ID, CHANCE, STATE_REQUIREMENT]>
*
* Example:
*  <onCastExecuteSkillIfAfflicted:[267, 100, 134]>
*
* Translation:
*  On cast, if the caster has state id 134 active, force-execute skill id 267 at 100% chance.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.OnCastExecuteSkillIfAfflicted = /<onCastExecuteSkillIfAfflicted:[ ]?(\[\d+,[ ]?\d+,[ ]?\d+])>/gi;
/**
* The structure of a skill-scoped on-hit apply-state tag with optional duration and stack overrides.
* Reads from the executing skill only ({@code this.item()}).
*
* <pre>
* Structure:
*  <thisApplyState:[STATE_ID, CHANCE]>
*  <thisApplyState:[STATE_ID, CHANCE, DURATION]>
*  <thisApplyState:[STATE_ID, CHANCE, DURATION, STACKS]>
*
* Example (duration override only):
*  <thisApplyState:[8, 25, 240]>
*
* Translation:
*  On hit, 25% chance to apply state id 8 for 240 frames (4 seconds at 60fps).
*  When DURATION is omitted or {@code 0}, the state's own jabsStateDurationFrames value
*  (and its own indefiniteState/duration tags) is used, unchanged.
*  When DURATION is {@code -1}, the state is forced indefinite regardless of its own tags.
*  Any other DURATION value forces that exact finite duration, also regardless of the
*  state's own tags (including <indefiniteState>).
*  When STACKS is omitted, the state's own jabsStateStacksApplied value is used.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ThisApplyState = /<thisApplyState:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?-?\d+(?:,[ ]?\d+)?)?])>/gi;
/**
* The structure of a caster-wide on-hit apply-state tag with optional duration and stack overrides.
* Reads from all of the caster's notes ({@code getAllNotes()}), so it can live on states, equips,
* actor data, or skills — wherever the caster's notes are sourced from.
*
* <pre>
* Structure:
*  <applyState:[STATE_ID, CHANCE]>
*  <applyState:[STATE_ID, CHANCE, DURATION]>
*  <applyState:[STATE_ID, CHANCE, DURATION, STACKS]>
*
* Example (passive state that applies poison for 10 seconds on hit):
*  <applyState:[12, 100, 600]>
*
* Translation:
*  On hit, always apply state id 12 for 600 frames (10 seconds at 60fps).
*  When DURATION is omitted or {@code 0}, the state's own jabsStateDurationFrames value
*  (and its own indefiniteState/duration tags) is used, unchanged.
*  When DURATION is {@code -1}, the state is forced indefinite regardless of its own tags.
*  Any other DURATION value forces that exact finite duration, also regardless of the
*  state's own tags (including <indefiniteState>).
*  When STACKS is omitted, the state's own jabsStateStacksApplied value is used.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ApplyState = /<applyState:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?-?\d+(?:,[ ]?\d+)?)?])>/gi;
/**
* The structure of a skill-scoped toggle-state tag. Reads from the executing skill only
* ({@code this.item()}). Fires once at press-time (same as the on-cast self-state tags), not on hit.
*
* <pre>
* Structure:
*  <toggleOnExecute:STATE_ID>
*
* Example (a stance skill that flips two states at once):
*  <toggleOnExecute:12>
*  <toggleOnExecute:13>
*
* Translation:
*  On execution, for each tagged STATE_ID: if the caster already has it, remove it;
*  if the caster does not have it, add it. Repeatable — one STATE_ID per tag/line, each
*  toggled independently. No chance roll; this always triggers.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ToggleOnExecute = /<toggleOnExecute:[ ]?(\d+)>/gi;
/**
* The structure of a skill-scoped cycle-group toggle tag. Reads from the executing skill only
* ({@code this.item()}). Fires once at press-time, same as {@link J.EXTEND.RegExp.ToggleOnExecute}.
* Unlike the scalar form, the ids in one group are coupled: exactly one is treated as "active"
* and execution advances to the next id in the list, wrapping back to the first after the last.
*
* <pre>
* Structure:
*  <toggleGroupOnExecute:[STATE_ID, STATE_ID, ...]>
*
* Example (a two-state stance swap):
*  <toggleGroupOnExecute:[12, 13]>
*
* Example (a three-state cycle):
*  <toggleGroupOnExecute:[12, 13, 14]>
*
* Translation:
*  On execution, find which id in the list the caster currently has. If none, add the first
*  id. If exactly one, remove it and add the next id in the list (wrapping to the first after
*  the last). If more than one is somehow active at once, remove all of them and add the first
*  id, resyncing the group back to a single active state. A skill may carry multiple
*  <toggleGroupOnExecute> tags to cycle several independent groups in one execution.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ToggleGroupOnExecute = /<toggleGroupOnExecute:[ ]?(\[[^\]]+])>/gi;

//#endregion
//#region src/plugins/extend/core/managers/OverlayManager.js
/**
* A static class for managing the overlaying of one skill onto another.
* The methods are divided by the attribute they overlay.
*/
var OverlayManager = class {
	/**
	* Gets the skill cache.
	* @returns {JCache} The skillCache.
	*/
	static skillCache() {
		return this._skillCache;
	}
	/**
	* Gets the state cache.
	* @returns {JCache} The stateCache.
	*/
	static stateCache() {
		return this._stateCache;
	}
	/**
	* The cache for caster-skill extensions. Keyed by the caster alone- extension results are
	* wholesale-invalidated on any learnSkill/forgetSkill via {@link invalidate}, so the skill id
	* is a stable key within one cache lifetime with no need to encode the overlay set.
	* @type {JCache}
	*/
	static _skillCache = JCache.battlerScoped({ name: "overlay:caster-skill" });
	/**
	* Tracks skill ids currently mid-resolution per caster to detect circular extension data
	* (e.g. skill 2 extends skill 1 AND skill 1 extends skill 2, direct or indirect).
	* Unlike the old caster-level re-entrancy guard, this is scoped per-skillId so legitimate
	* recursive chains (A extends B extends C) proceed normally — only actual cycles throw.
	* @type {WeakMap<Game_Actor|Game_Enemy, Set<number>>}
	*/
	static #resolving = new WeakMap();
	/**
	* The cache for battler-state extensions, parallel to {@link _skillCache} for skills.
	* @type {JCache}
	*/
	static _stateCache = JCache.battlerScoped({ name: "overlay:battler-state" });
	/**
	* Tracks state ids currently mid-resolution per battler to detect circular state extension data.
	* @type {WeakMap<Game_Battler, Set<number>>}
	*/
	static #resolvingState = new WeakMap();
	/**
	* Invalidates the cache for the given battler.
	* @param {Game_Actor|Game_Enemy} battler The battler to invalidate the cache for.
	* @returns {boolean} True if the cache was invalidated, false otherwise.
	*/
	static invalidate(battler) {
		this.skillCache().invalidate([battler]);
		this.stateCache().invalidate([battler]);
	}
	/**
	* Clears the cache for all objects.
	*/
	static clearCache() {
		this.skillCache().clear();
		this.stateCache().clear();
	}
	/**
	* Gets the extended skill based on the caster's learned skills.
	*
	* Extension candidates are gathered from the caster's full {@link Game_Battler#skillIds} list
	* (learned skills only — unlike states, a skill overlay never applies unless the caster has
	* actually learned it) and applied in two passes:
	* 1. Type-based overlays ({@code <extendType:TYPE>}) in ascending skill-id order — familial.
	* 2. Id-based overlays ({@code <extend:[IDs]>}) in ascending skill-id order — specific.
	*
	* Each candidate is itself recursively resolved before being applied, so extension chains work.
	* Mirrors {@link getExtendedState}; see that method for the parallel state-side implementation.
	* @param caster {Game_Actor|Game_Enemy} The caster of the skill.
	* @param skillId {number} The base skill to extend.
	* @returns {RPG_Skill}
	*/
	static getExtendedSkill(caster, skillId) {
		if (skillId <= 0) throw new Error("Invalid skill extension id.");
		if (!caster) return this.#requireDatabaseEntry($dataSkills[skillId], "skill", skillId);
		return this.skillCache().get([caster], String(skillId), () => {
			const knownIds = caster.skillIds();
			const targetSkill = $dataSkills[skillId];
			const targetTypes = targetSkill ? targetSkill.types() : [];
			const typeCandidates = [];
			const idCandidates = [];
			for (const id of knownIds) {
				if (id === skillId) continue;
				const candidate = $dataSkills[id];
				if (!candidate || !candidate.isExtension) continue;
				if (targetTypes.length > 0 && ArrayHelper.hasAnyIntersection(targetTypes, candidate.getExtensionTypes)) {
					typeCandidates.push(id);
					continue;
				}
				if (candidate.getExtensions.includes(skillId)) {
					idCandidates.push(id);
				}
			}
			typeCandidates.sort((a, b) => a - b);
			idCandidates.sort((a, b) => a - b);
			const overlayIds = [...typeCandidates, ...idCandidates];
			let inProgress = this.#resolving.get(caster);
			if (!inProgress) {
				inProgress = new Set();
				this.#resolving.set(caster, inProgress);
			}
			if (inProgress.has(skillId)) {
				throw new Error(`Circular skill extension detected on skill ${skillId}! Please stop recursing the universe 💢`);
			}
			inProgress.add(skillId);
			try {
				const resolvedOverlays = overlayIds.map((id) => this.getExtendedSkill(caster, id));
				return this.#getExtendedSkill(resolvedOverlays, skillId);
			} finally {
				inProgress.delete(skillId);
				if (inProgress.size === 0) this.#resolving.delete(caster);
			}
		});
	}
	/**
	* Gets the extended state for the given battler and state id.
	*
	* Extension states are gathered from the battler's full {@link Game_Battler#allStateIds} list
	* (preserving passive stacks/duplicates) and applied in two passes:
	* 1. Type-based overlays ({@code <extendType:TYPE>}) in ascending state-id order — familial.
	* 2. Id-based overlays ({@code <extend:[IDs]>}) in ascending state-id order — specific.
	*
	* Each candidate is itself recursively resolved before being applied, so extension chains work.
	* Results are cached per-battler and invalidated by {@link OverlayManager.invalidate} on any
	* state change (via {@link Game_Battler#onBattlerDataChange}).
	* @param {Game_Battler} battler The battler whose active states supply potential overlays.
	* @param {number} stateId The base state id to potentially extend.
	* @returns {RPG_State} The extended (or unmodified) state.
	*/
	static getExtendedState(battler, stateId) {
		if (stateId <= 0) throw new Error("Invalid state id for extension.");
		if (!battler) return this.#requireDatabaseEntry($dataStates[stateId], "state", stateId);
		return this.stateCache().get([battler], String(stateId), () => {
			const allIds = battler.allStateIds();
			const targetState = $dataStates[stateId];
			const targetTypes = targetState ? targetState.types() : [];
			const typeCandidates = [];
			const idCandidates = [];
			for (const id of allIds) {
				if (id === stateId) continue;
				const candidate = $dataStates[id];
				if (!candidate || !candidate.isExtension) continue;
				if (targetTypes.length > 0 && ArrayHelper.hasAnyIntersection(targetTypes, candidate.getExtensionTypes)) {
					typeCandidates.push(id);
					continue;
				}
				if (candidate.getExtensions.includes(stateId)) {
					idCandidates.push(id);
				}
			}
			typeCandidates.sort((a, b) => a - b);
			idCandidates.sort((a, b) => a - b);
			const overlayIds = [...typeCandidates, ...idCandidates];
			let inProgressState = this.#resolvingState.get(battler);
			if (!inProgressState) {
				inProgressState = new Set();
				this.#resolvingState.set(battler, inProgressState);
			}
			if (inProgressState.has(stateId)) {
				throw new Error(`Circular state extension detected on state ${stateId}! Please stop recursing the universe 💢`);
			}
			inProgressState.add(stateId);
			try {
				const resolvedOverlays = overlayIds.map((id) => this.getExtendedState(battler, id));
				return this.#getExtendedState(resolvedOverlays, stateId);
			} finally {
				inProgressState.delete(stateId);
				if (inProgressState.size === 0) this.#resolvingState.delete(battler);
			}
		});
	}
	/**
	* Extends the base skill with the given overlay skills in sequential order.
	* @param {RPG_Skill[]} overlaySkills - The skill overlays to apply.
	* @param {number} skillId - The id of the base skill to extend.
	* @returns {RPG_Skill} The extended skill.
	*/
	static #getExtendedSkill(overlaySkills, skillId) {
		const baseSkill = this.#requireDatabaseEntry($dataSkills[skillId], "skill", skillId);
		if (overlaySkills.length === 0) {
			return baseSkill;
		}
		const baseClone = baseSkill._clone();
		const extended = overlaySkills.reduce((working, overlay) => this.extendSkill(working, overlay), baseClone);
		return extended;
	}
	/**
	* Extends the base state with the given overlay states in sequential order.
	* @param {RPG_State[]} overlayStates The state overlays to apply.
	* @param {number} stateId The id of the base state to extend.
	* @returns {RPG_State} The extended state.
	*/
	static #getExtendedState(overlayStates, stateId) {
		const baseState = this.#requireDatabaseEntry($dataStates[stateId], "state", stateId);
		if (overlayStates.length === 0) return baseState;
		const baseClone = baseState._clone();
		return overlayStates.reduce((working, overlay) => this.extendState(working, overlay), baseClone);
	}
	/**
	* Asserts that a database row actually exists before it gets overlaid.
	*
	* An `<extend:>` tag pointing at an id that no longer exists is a data error, and a silent
	* fallback would leave a skill or state quietly doing nothing for the rest of the playthrough.
	* Failing loudly, naming the id, is the only useful outcome.
	* @param {RPG_Skill|RPG_State} entry The database row to validate.
	* @param {string} kind The kind of row, for the error message.
	* @param {number} id The id that was looked up.
	* @returns {RPG_Skill|RPG_State} The validated row.
	*/
	static #requireDatabaseEntry(entry, kind, id) {
		if (!entry) {
			throw new Error(`Extension targets a ${kind} id that does not exist: ${id}. Check your <extend:> data.`);
		}
		return entry;
	}
	/**
	* Merges the skill overlay onto the base skill and returns the updated base skill.
	* @param baseSkill {RPG_Skill} The base skill to be overlayed.
	* @param skillOverlay {RPG_Skill} The skill to overlay with.
	* @returns {RPG_Skill} The base skill overlayed with the overlay skill.
	*/
	static extendSkill(baseSkill, skillOverlay) {
		const updatedBaseSkill = this.extendBaseSkill(baseSkill, skillOverlay);
		this.sanitizeExtensions(updatedBaseSkill);
		return updatedBaseSkill;
	}
	/**
	* Overlays the base skill data.
	*
	* Effects, meta, note, and repeats are combined.
	*
	* Scope, mpCost, tpCost, and tpGain are replaced.
	* @param baseSkill {RPG_Skill} The base skill.
	* @param skillOverlay {RPG_Skill} The overlay skill.
	* @returns {RPG_Skill} The overlayed base skill.
	*/
	static extendBaseSkill(baseSkill, skillOverlay) {
		this.extendGeneral(baseSkill, skillOverlay);
		this.extendDamage(baseSkill, skillOverlay);
		this.extendEffects(baseSkill, skillOverlay);
		this.extendInvocation(baseSkill, skillOverlay);
		this.extendMessage(baseSkill, skillOverlay);
		this.extendMetadata(baseSkill, skillOverlay);
		return baseSkill;
	}
	/**
	* Extends the general settings section of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendGeneral(baseSkill, skillOverlay) {
		if (baseSkill.mpCost !== skillOverlay.mpCost) {
			baseSkill.mpCost = skillOverlay.mpCost;
		}
		if (baseSkill.tpCost !== skillOverlay.tpCost) {
			baseSkill.tpCost = skillOverlay.tpCost;
		}
		const bothHaveScopes = baseSkill.scope !== 0 && skillOverlay.scope !== 0;
		const scopesHaveChanged = baseSkill.scope !== skillOverlay.scope;
		if (bothHaveScopes && scopesHaveChanged) {
			baseSkill.scope = skillOverlay.scope;
		}
	}
	/**
	* Extends the damage section of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendDamage(baseSkill, skillOverlay) {
		if (!skillOverlay.damage.type) {
			return;
		}
		if (baseSkill.damage.critical !== skillOverlay.damage.critical) {
			baseSkill.damage.critical = skillOverlay.damage.critical;
		}
		if (baseSkill.damage.elementId !== skillOverlay.damage.elementId) {
			baseSkill.damage.elementId = skillOverlay.damage.elementId;
		}
		if (baseSkill.damage.type !== skillOverlay.damage.type) {
			if (baseSkill.damage.type === 1 && skillOverlay.damage.type === 5) {
				baseSkill.damage.type = 5;
			} else if (baseSkill.damage.type === 2 && skillOverlay.damage.type === 6) {
				baseSkill.damage.type = 6;
			}
		}
		if (baseSkill.damage.variance !== skillOverlay.damage.variance) {
			baseSkill.damage.variance = skillOverlay.damage.variance;
		}
		if (skillOverlay.damage.formula && baseSkill.damage.formula !== skillOverlay.damage.formula) {
			baseSkill.damage.formula = skillOverlay.damage.formula;
		}
	}
	/**
	* Extends the effects section of a skill.
	*
	* For add-state effects (code 21), the overlay wins per state id — "last extension wins."
	* If the overlay defines a chance for state X, any earlier add-state entries for state X
	* are stripped from the base before concatenation.  This prevents duplicate apply-state
	* rolls when a later extension upgrades a partial chance to a guaranteed application.
	*
	* All other effect types are concatenated as before.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendEffects(baseSkill, skillOverlay) {
		if (skillOverlay.effects.length === 0) return;
		const overlayAddStates = skillOverlay.effects.filter((e) => e.code === Game_Action.EFFECT_ADD_STATE);
		if (overlayAddStates.length > 0) {
			const replacedIds = new Set(overlayAddStates.map((e) => e.dataId));
			baseSkill.effects = baseSkill.effects.filter((e) => e.code !== Game_Action.EFFECT_ADD_STATE || replacedIds.has(e.dataId) === false);
		}
		baseSkill.effects = baseSkill.effects.concat(skillOverlay.effects);
	}
	/**
	* Extends the metadata of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendMetadata(baseSkill, skillOverlay) {
		baseSkill.meta = {
			...baseSkill.meta,
			...skillOverlay.meta
		};
		baseSkill.note = this.overwriteNote(baseSkill.note, skillOverlay.note);
		RPGManager.invalidate(baseSkill);
	}
	/**
	* Extends the invocation section of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendInvocation(baseSkill, skillOverlay) {
		if (skillOverlay.speed !== 0) {
			baseSkill.speed += skillOverlay.speed;
		}
		if (baseSkill.successRate !== skillOverlay.successRate && skillOverlay.successRate !== 100) {
			baseSkill.successRate += skillOverlay.successRate;
		}
		if (skillOverlay.repeats !== 1) {
			baseSkill.repeats += skillOverlay.repeats - 1;
		}
		baseSkill.tpGain += skillOverlay.tpGain;
		if (baseSkill.hitType && skillOverlay.hitType) {
			baseSkill.hitType = skillOverlay.hitType;
		}
		if (skillOverlay.animationId !== 0 && baseSkill.animationId !== skillOverlay.animationId) {
			baseSkill.animationId = skillOverlay.animationId;
		}
	}
	/**
	* Extends the message section of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendMessage(baseSkill, skillOverlay) {
		if (skillOverlay.message1 !== String.empty && baseSkill.message1 !== skillOverlay.message1) {
			baseSkill.message1 = skillOverlay.message1;
		}
		if (skillOverlay.message2 !== String.empty && baseSkill.message2 !== skillOverlay.message2) {
			baseSkill.message2 = skillOverlay.message2;
		}
	}
	/**
	* Purges all references to the skill extension tags from the `baseSkill`.
	* @param baseSkill {RPG_Skill} The base skill.
	* @returns {RPG_Skill} The overlayed base skill.
	*/
	static sanitizeExtensions(baseSkill) {
		delete baseSkill.meta["extend"];
		delete baseSkill.meta["extendType"];
		baseSkill.note = baseSkill.note.replace(J.EXTEND.RegExp.Extend, String.empty);
		baseSkill.note = baseSkill.note.replace(J.EXTEND.RegExp.ExtendType, String.empty);
		baseSkill.note = baseSkill.note.replace(/\n\n/gim, "\n");
		baseSkill.note = baseSkill.note.replace(/\r\r/gim, "\r");
		RPGManager.invalidate(baseSkill);
	}
	/**
	* Merges the state overlay onto the base state and returns the updated base state.
	* @param {RPG_State} baseState The base state to be overlaid.
	* @param {RPG_State} stateOverlay The state to overlay with.
	* @returns {RPG_State} The updated base state.
	*/
	static extendState(baseState, stateOverlay) {
		this.extendStateGeneral(baseState, stateOverlay);
		this.extendStateRemoval(baseState, stateOverlay);
		this.extendStateMessages(baseState, stateOverlay);
		this.extendStateTraits(baseState, stateOverlay);
		this.extendStateMetadata(baseState, stateOverlay);
		this.sanitizeStateExtensions(baseState);
		return baseState;
	}
	/**
	* Extends the general section of a state (restriction, priority, overlay icon, battler motion).
	* @param {RPG_State} baseState The state being extended.
	* @param {RPG_State} stateOverlay The state extending the base.
	*/
	static extendStateGeneral(baseState, stateOverlay) {
		if (stateOverlay.restriction !== 0) {
			baseState.restriction = stateOverlay.restriction;
		}
		if (stateOverlay.priority !== 50) {
			baseState.priority = stateOverlay.priority;
		}
		if (stateOverlay.overlay !== 0) {
			baseState.overlay = stateOverlay.overlay;
		}
		if (stateOverlay.motion !== 0) {
			baseState.motion = stateOverlay.motion;
		}
	}
	/**
	* Extends the removal conditions of a state (timing, turns, damage, walk, restriction, battle-end).
	* Last wins for all fields; numeric fields only replace when the overlay differs from default.
	* @param {RPG_State} baseState The state being extended.
	* @param {RPG_State} stateOverlay The state extending the base.
	*/
	static extendStateRemoval(baseState, stateOverlay) {
		if (stateOverlay.autoRemovalTiming !== 0) {
			baseState.autoRemovalTiming = stateOverlay.autoRemovalTiming;
		}
		if (stateOverlay.minTurns !== 1) baseState.minTurns = stateOverlay.minTurns;
		if (stateOverlay.maxTurns !== 1) baseState.maxTurns = stateOverlay.maxTurns;
		baseState.removeAtBattleEnd = stateOverlay.removeAtBattleEnd;
		baseState.removeByRestriction = stateOverlay.removeByRestriction;
		baseState.removeByDamage = stateOverlay.removeByDamage;
		baseState.removeByWalking = stateOverlay.removeByWalking;
		if (stateOverlay.chanceByDamage !== 100) baseState.chanceByDamage = stateOverlay.chanceByDamage;
		if (stateOverlay.stepsToRemove !== 100) baseState.stepsToRemove = stateOverlay.stepsToRemove;
	}
	/**
	* Extends the messages of a state; only overwrites when the overlay provides a non-empty string.
	* @param {RPG_State} baseState The state being extended.
	* @param {RPG_State} stateOverlay The state extending the base.
	*/
	static extendStateMessages(baseState, stateOverlay) {
		if (stateOverlay.message1) baseState.message1 = stateOverlay.message1;
		if (stateOverlay.message2) baseState.message2 = stateOverlay.message2;
		if (stateOverlay.message3) baseState.message3 = stateOverlay.message3;
		if (stateOverlay.message4) baseState.message4 = stateOverlay.message4;
	}
	/**
	* Extends the traits of a state using {@link TraitResolver.overlayTraits} (last wins per code+dataId).
	* @param {RPG_State} baseState The state being extended.
	* @param {RPG_State} stateOverlay The state extending the base.
	*/
	static extendStateTraits(baseState, stateOverlay) {
		baseState.traits = TraitResolver.overlayTraits(baseState.traits, stateOverlay.traits);
	}
	/**
	* Extends the metadata and note of a state.
	* @param {RPG_State} baseState The state being extended.
	* @param {RPG_State} stateOverlay The state extending the base.
	*/
	static extendStateMetadata(baseState, stateOverlay) {
		baseState.meta = {
			...baseState.meta,
			...stateOverlay.meta
		};
		baseState.note = this.overwriteNote(baseState.note, stateOverlay.note);
		RPGManager.invalidate(baseState);
	}
	/**
	* Purges all state-extension tags from the note of the given state to prevent recursive extension.
	* @param {RPG_State} baseState The state to sanitize.
	*/
	static sanitizeStateExtensions(baseState) {
		baseState.note = baseState.note.replace(J.EXTEND.RegExp.Extend, String.empty);
		baseState.note = baseState.note.replace(J.EXTEND.RegExp.ExtendType, String.empty);
		baseState.note = baseState.note.replace(/\n\n/gim, "\n");
		baseState.note = baseState.note.replace(/\r\r/gim, "\r");
		RPGManager.invalidate(baseState);
	}
	/**
	* Merges the overlay skill's note into the base skill's note.
	*
	* The merging itself belongs to {@link NoteResolver} in J-Base, alongside the reader that parses notes
	* back out and the resolver that merges the structured half of the same problem. What stays here is
	* the *policy*: which keys accumulate rather than replace, which is this plugin's registry to own.
	* @param {string} baseNote The base note content.
	* @param {string} overlayNote The overlay note content.
	* @returns {string} The merged note text, joined with newlines.
	*/
	static overwriteNote(baseNote, overlayNote) {
		const accumulatingKeys = J.EXTEND.Metadata.getNonCombiningKeys();
		return NoteResolver.merge(baseNote, overlayNote, accumulatingKeys);
	}
};

//#endregion
//#region src/plugins/extend/core/database/RPG_Base.js
/**
* Whether this database object bears any extension tags.
* True when either {@code <extend:[IDs]>} or {@code <extendType:TYPE>} is present.
* Generic across every database object type ({@link RPG_Base} subclasses) since {@code <type:>}
* itself lives on {@link RPG_Base} — skills and states are the only types with an overlay
* consumer today ({@link OverlayManager}), but weapons/armors/actors/classes/etc. get this
* detection for free the moment a consumer wants it.
* @type {boolean}
*/
Object.defineProperty(RPG_Base.prototype, "isExtension", { get: function() {
	const hasIdExtension = !!RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.Extend, true);
	const hasTypeExtension = !!RPGManager.getStringsFromNoteByRegex(this, J.EXTEND.RegExp.ExtendType, true);
	return hasIdExtension || hasTypeExtension;
} });
/**
* Gets all ids this database object targets via {@code <extend:[IDs]>}.
* Returns an empty array when the tag is absent.
* @type {number[]}
*/
Object.defineProperty(RPG_Base.prototype, "getExtensions", { get: function() {
	return RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.Extend);
} });
/**
* Gets all type classifiers this database object extends via {@code <extendType:TYPE>}.
* Returns an empty array when the tag is absent.
* @type {string[]}
*/
Object.defineProperty(RPG_Base.prototype, "getExtensionTypes", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.EXTEND.RegExp.ExtendType);
} });

//#endregion
//#region src/plugins/extend/core/managers/DataManager.js
/**
* Extends {@link #setupNewGame}.<br/>
* Also clears the RPGManager note cache for a fresh session.
*/
J.EXTEND.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	OverlayManager.clearCache();
	J.EXTEND.Aliased.DataManager.get("setupNewGame").call(this);
};
/**
* Extends {@link #extractSaveContents}.<br/>
* Also clears the RPGManager note cache before applying save data.
*/
J.EXTEND.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents) {
	OverlayManager.clearCache();
	J.EXTEND.Aliased.DataManager.get("extractSaveContents").call(this, contents);
};
/**
* Extends {@link #setupBattleTest}.<br/>
* Also clears the RPGManager note cache when entering battle test.
*/
J.EXTEND.Aliased.DataManager.set("setupBattleTest", DataManager.setupBattleTest);
DataManager.setupBattleTest = function() {
	OverlayManager.clearCache();
	J.EXTEND.Aliased.DataManager.get("setupBattleTest").call(this);
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Action.js
/**
* Overwrites {@link #setSkill}.<br/>
* If a caster is available to this action, then update the udnerlying skill with
* the overlayed skill instead.
*/
J.EXTEND.Aliased.Game_Action.set("setSkill", Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId) {
	if (!this.subject()) {
		J.EXTEND.Aliased.Game_Action.get("setSkill").call(this, skillId);
		return;
	}
	const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);
	this.rawItem().setObject(skillToSet);
};
/**
* Overwrites {@link #setItemObject}.<br/>
* If a caster is available to this action, then update the underlying item with the data.
*/
J.EXTEND.Aliased.Game_Action.set("setItemObject", Game_Action.prototype.setItemObject);
Game_Action.prototype.setItemObject = function(itemObject) {
	if (!this.subject()) {
		J.EXTEND.Aliased.Game_Action.get("setItemObject").call(this, itemObject);
		return;
	}
	this.rawItem().setObject(itemObject);
};
/**
* Extends {@link #apply}.<br/>
* Also applies on-hit states.
*/
J.EXTEND.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.EXTEND.Aliased.Game_Action.get("apply").call(this, target);
	this.applyOnHitStateEffects(target);
};
/**
* Applies all on-hit state modifications, such as adding or removing states to self or the target.
* @param {Game_Actor|Game_Enemy} target The target being hit with the action.
*/
Game_Action.prototype.applyOnHitStateEffects = function(target) {
	if (this.canApplyOnHitStateEffects(target) === false) return;
	this.applyOnHitSelfStates();
	this.applyOnHitLoseStates();
	this.applyOnHitApplyStates(target);
	this.applyOnHitStripStates(target);
	this.applyOnHitRemoveStates(target);
};
/**
* Determines whether or not the on-hit state effects can apply.
* @param {Game_Actor|Game_Enemy}target
*/
Game_Action.prototype.canApplyOnHitStateEffects = function(target) {
	if (target.result().isHit() === false) {
		return false;
	}
	return true;
};
/**
* Applies all applicable on-hit self states.
*/
Game_Action.prototype.applyOnHitSelfStates = function() {
	this.applyStates(this.subject(), this.onHitSelfStates());
};
/**
* Gets all possible states that could be self-inflicted when this skill hits a target.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onHitSelfStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnHitSelfState);
	return stateChances;
};
/**
* Removes all applicable on-hit lose states.
*/
Game_Action.prototype.applyOnHitLoseStates = function() {
	this.loseStates(this.subject(), this.onHitLoseStates());
};
/**
* Gets all possible states that could be self-lost when this skill hits a target.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onHitLoseStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnHitLoseState);
	return stateChances;
};
/**
* Applies all applicable on-hit state stripping.
* @param {Game_Actor|Game_Enemy} target The target being hit with the action.
*/
Game_Action.prototype.applyOnHitStripStates = function(target) {
	this.stripStates(target, this.onHitStripStates());
};
/**
* Gets all possible states that could lose a single stack from the target when it hits.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onHitStripStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnHitStripState);
	return stateChances;
};
/**
* Applies all applicable on-hit full state removals.
* @param {Game_Actor|Game_Enemy} target The target being hit with the action.
*/
Game_Action.prototype.applyOnHitRemoveStates = function(target) {
	this.removeStates(target, this.onHitRemoveStates());
};
/**
* Gets all possible states that could be fully removed from the target when it hits.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onHitRemoveStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnHitRemoveState);
	return stateChances;
};
/**
* Applies all on-hit apply-states to the target, drawing from two sources:
* the executing skill ({@code <thisApplyState>}) and the caster's full notes
* ({@code <applyState>}). Caster-wide entries fire first; skill-scoped entries
* fire second and win on any same-state conflict via force-replace semantics.
*
* Each entry is evaluated independently: the chance is rolled, and on success a
* {@link JABS_StateOverrides} is constructed and passed to
* {@link Game_Battler#addStateWithOverrides}.
* Target state resistance is still respected inside {@link Game_Battler#handleAddingJabsState}.
* @param {Game_Actor|Game_Enemy} target The target being hit with the action.
*/
Game_Action.prototype.applyOnHitApplyStates = function(target) {
	const notes = this.subject().getAllNotes();
	const casterEntries = RPGManager.getArraysFromAllNotesByRegex(notes, J.EXTEND.RegExp.ApplyState);
	const skillEntries = RPGManager.getArraysFromNotesByRegex(this.item(), J.EXTEND.RegExp.ThisApplyState);
	const allEntries = [...casterEntries, ...skillEntries];
	if (!allEntries.length) return;
	const attacker = this.subject();
	allEntries.forEach(([stateId, chance, duration = null, stacks = null]) => {
		if (!RPGManager.chanceIn100(chance)) return;
		const overrides = new JABS_StateOverrides(duration, stacks);
		target.addStateWithOverrides(stateId, attacker, overrides, this.item());
	});
};
/**
* Extends {@link #applyItemUserEffect}.<br/>
* Also applies on-cast target-affecting states (strip/remove).
* On-cast self states (self/lose) fire once at press-time via {@link JABS_Engine#handleOnCastStateEffects} instead.
*/
J.EXTEND.Aliased.Game_Action.set("applyItemUserEffect", Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target) {
	J.EXTEND.Aliased.Game_Action.get("applyItemUserEffect").call(this, target);
	this.applyOnCastStripStates(target);
	this.applyOnCastRemoveStates(target);
};
/**
* Toggles all {@code <toggleOnExecute:STATE_ID>} states on the caster: for each tagged state id,
* removes it if the caster currently has it, or adds it if they don't. Fires once at press-time
* (see {@link JABS_Engine#handleOnCastStateEffects}), same as the on-cast self-state family below.
* There is no chance roll; this always triggers when the skill executes.
*/
Game_Action.prototype.applyToggleOnExecuteStates = function() {
	const caster = this.subject();
	this.toggleOnExecuteStateIds().forEach((stateId) => {
		if (caster.isStateAffected(stateId)) {
			caster.removeState(stateId);
		} else {
			caster.addState(stateId, caster);
		}
	});
};
/**
* Gets all state ids tagged with {@code <toggleOnExecute:STATE_ID>} on the executing skill.
* Skill-scoped only; a skill may carry multiple tags to toggle multiple states in one execution.
* @returns {number[]}
*/
Game_Action.prototype.toggleOnExecuteStateIds = function() {
	return RPGManager.getStringsFromNoteByRegex(this.item(), J.EXTEND.RegExp.ToggleOnExecute).map(Number);
};
/**
* Cycles all {@code <toggleGroupOnExecute:[STATE_ID, ...]>} groups on the caster: for each
* tagged group, advances the caster from whichever state in the group is currently active to
* the next one in the list, wrapping back to the first after the last. Fires once at
* press-time, same as {@link #applyToggleOnExecuteStates}.
*/
Game_Action.prototype.applyToggleGroupOnExecuteStates = function() {
	const caster = this.subject();
	this.toggleGroupOnExecuteGroups().forEach((group) => {
		const activeIds = group.filter((stateId) => caster.isStateAffected(stateId));
		activeIds.forEach((stateId) => caster.removeState(stateId));
		let nextId;
		if (activeIds.length === 1) {
			const currentIndex = group.indexOf(activeIds[0]);
			const nextIndex = (currentIndex + 1) % group.length;
			nextId = group[nextIndex];
		} else {
			[nextId] = group;
		}
		caster.addState(nextId, caster);
	});
};
/**
* Gets all cycle groups tagged with {@code <toggleGroupOnExecute:[STATE_ID, ...]>} on the
* executing skill. Skill-scoped only; a skill may carry multiple tags to cycle multiple
* independent groups in one execution.
* @returns {number[][]}
*/
Game_Action.prototype.toggleGroupOnExecuteGroups = function() {
	return RPGManager.getArraysFromNotesByRegex(this.item(), J.EXTEND.RegExp.ToggleGroupOnExecute);
};
/**
* Applies all applicable on-cast self states.
*/
Game_Action.prototype.applyOnCastSelfStates = function() {
	this.applyStates(this.subject(), this.onCastSelfStates());
};
/**
* Applies all applicable on-cast lose states.
*/
Game_Action.prototype.applyOnCastLoseStates = function() {
	this.loseStates(this.subject(), this.onCastLoseStates());
};
/**
* Applies conditional on-cast self-states that require the caster to already have a specific state.
* Reads from the skill note and the caster's active states.
* Each tag is [STATE_TO_APPLY, CHANCE, STATE_REQUIREMENT]; the state is applied only when the
* caster is currently afflicted with STATE_REQUIREMENT.
*/
Game_Action.prototype.applyOnCastSelfStatesIfAfflicted = function() {
	const caster = this.subject();
	const sources = this.reactiveStateSources();
	const allArrays = sources.flatMap((source) => RPGManager.getArraysFromNotesByRegex(source, J.EXTEND.RegExp.OnCastSelfStateIfAfflicted) ?? []);
	if (allArrays.length === 0) return;
	const effects = allArrays.filter(([, , stateRequirement]) => caster.isStateAffected(stateRequirement)).map(([stateToApply, chance]) => new JABS_OnChanceEffect(stateToApply, chance, J.EXTEND.RegExp.OnCastSelfStateIfAfflicted.toString()));
	this.applyStates(caster, effects);
};
/**
* Applies all applicable on-cast state stripping.
* @param {Game_Actor|Game_Enemy} target The target the casted action will affect.
*/
Game_Action.prototype.applyOnCastStripStates = function(target) {
	this.stripStates(target, this.onCastStripStates());
};
/**
* Applies all applicable on-cast full state removals.
* @param {Game_Actor|Game_Enemy} target The target the casted action will affect.
*/
Game_Action.prototype.applyOnCastRemoveStates = function(target) {
	this.removeStates(target, this.onCastRemoveStates());
};
/**
* Maximum nesting depth permitted for {@code <onCastExecuteSkill>} chains.
* A forced skill's own tag is allowed to trigger one further hop before being cut off, guarding
* against an authoring mistake (or a deliberately cyclic pair of skills) looping forever.
* @type {number}
*/
var ON_CAST_EXECUTE_SKILL_MAX_DEPTH = 2;
/**
* Current nesting depth of in-flight {@code <onCastExecuteSkill>} dispatches.
* @type {number}
*/
var onCastExecuteSkillDepth = 0;
/**
* Gets all skills that should be force-executed when casting this skill, alongside their
* individual roll chances. Skill-scoped and repeatable — a skill may carry several
* {@code <onCastExecuteSkill>} tags, each collected and rolled independently.
* @returns {[number, number][]} Tuples of `[skillId, chance]`.
*/
Game_Action.prototype.onCastExecuteSkills = function() {
	return RPGManager.getArraysFromNotesByRegex(this.item(), J.EXTEND.RegExp.OnCastExecuteSkill) ?? [];
};
/**
* Rolls and force-executes a batch of already-gated `[skillId, chance]` payloads through JABS,
* sharing the single depth guard between both the unconditional and state-gated
* {@code onCastExecuteSkill} families so a mixed chain still can't loop forever.
* @param {[number, number][]} payloads Tuples of `[skillId, chance]` that have already passed
* whatever gate (if any) applies to their source tag.
* @param {JABS_Battler} caster The JABS battler executing this cast.
*/
function dispatchOnCastExecuteSkillPayloads(payloads, caster) {
	if (payloads.length === 0) return;
	if (onCastExecuteSkillDepth >= ON_CAST_EXECUTE_SKILL_MAX_DEPTH) return;
	onCastExecuteSkillDepth += 1;
	try {
		payloads.forEach(([skillId, chance]) => {
			if (!RPGManager.chanceIn100(chance)) return;
			$jabsEngine.forceMapAction(caster, skillId, false);
		});
	} finally {
		onCastExecuteSkillDepth -= 1;
	}
}
/**
* Force-executes every qualifying {@code <onCastExecuteSkill>} payload through JABS, exactly once
* at the moment of press. Each tag rolls its own chance independently, so a single cast can chain
* into several follow-up skills at once.
* @param {JABS_Battler} caster The JABS battler executing this cast.
*/
Game_Action.prototype.applyOnCastExecuteSkills = function(caster) {
	dispatchOnCastExecuteSkillPayloads(this.onCastExecuteSkills(), caster);
};
/**
* Gets all state-gated skills that should be force-executed when casting this skill, alongside
* their individual roll chances. Reads {@code <onCastExecuteSkillIfAfflicted>} from the executing
* skill's own note only ({@code this.item()}), same skill-scoped rule as its unconditional sibling.
* @returns {[number, number, number][]} Tuples of `[skillId, chance, stateRequirement]`.
*/
Game_Action.prototype.onCastExecuteSkillsIfAfflicted = function() {
	return RPGManager.getArraysFromNotesByRegex(this.item(), J.EXTEND.RegExp.OnCastExecuteSkillIfAfflicted) ?? [];
};
/**
* Force-executes every qualifying {@code <onCastExecuteSkillIfAfflicted>} payload through JABS,
* exactly once at the moment of press, but only for tags whose required state is currently active
* on the caster. Lets a skill fire one of several possible payloads depending on which state the
* caster is carrying, without ever rolling or executing the ones that don't apply.
* @param {JABS_Battler} caster The JABS battler executing this cast.
*/
Game_Action.prototype.applyOnCastExecuteSkillsIfAfflicted = function(caster) {
	const subject = this.subject();
	const allTriples = this.onCastExecuteSkillsIfAfflicted();
	const qualifyingPayloads = allTriples.filter(([, , stateRequirement]) => subject.isStateAffected(stateRequirement)).map(([skillId, chance]) => [skillId, chance]);
	dispatchOnCastExecuteSkillPayloads(qualifyingPayloads, caster);
};
/**
* Gets all possible states that could be self-inflicted when casting this skill.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCastSelfStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnCastSelfState);
	return stateChances;
};
/**
* Gets all possible states that could be self-removed when casting this skill.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCastLoseStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnCastLoseState);
	return stateChances;
};
/**
* Gets all possible states that could lose a single stack from the target when casting this skill.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCastStripStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnCastStripState);
	return stateChances;
};
/**
* Gets all possible states that could be fully removed from the target when casting this skill.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCastRemoveStates = function() {
	const sources = this.reactiveStateSources();
	const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(sources, J.EXTEND.RegExp.OnCastRemoveState);
	return stateChances;
};
/**
* All sources to derive self-applied states from.
* @returns {(RPG_UsableItem|RPG_State)[]}
*/
Game_Action.prototype.reactiveStateSources = function() {
	const sources = [this.item(), ...this.subject().allStates()];
	return sources;
};
/**
* Applies the given states to the target.
* @param target {Game_Actor|Game_Enemy} The target to apply states to.
* @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially apply.
*/
Game_Action.prototype.applyStates = function(target, jabsOnChanceEffects) {
	if (jabsOnChanceEffects.length === 0) return;
	jabsOnChanceEffects.forEach((jabsOnChanceEffect) => {
		const attacker = this.subject();
		const skill = jabsOnChanceEffect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = target.getNegativeRolls();
		const procCount = jabsOnChanceEffect.resolveProcCount(positiveRolls, negativeRolls, attacker);
		for (let i = 0; i < procCount; i++) {
			target.addState(jabsOnChanceEffect.skillId, attacker, skill);
		}
	});
};
/**
* Loses the given states from the target.
* This consumes a single stack in JABS, or removes the whole state outside JABS.
* @param target {Game_Actor|Game_Enemy} The target to lose states from.
* @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially lose.
*/
Game_Action.prototype.loseStates = function(target, jabsOnChanceEffects) {
	if (jabsOnChanceEffects.length === 0) return;
	jabsOnChanceEffects.forEach((jabsOnChanceEffect) => {
		const attacker = this.subject();
		const skill = jabsOnChanceEffect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = target.getNegativeRolls();
		if (jabsOnChanceEffect.shouldTrigger(positiveRolls, negativeRolls, attacker)) {
			this.loseState(target, jabsOnChanceEffect.skillId);
		}
	});
};
/**
* Strips the given states from the target.
* This consumes a single stack in JABS, or removes the whole state outside JABS.
* @param target {Game_Actor|Game_Enemy} The target to strip states from.
* @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially strip.
*/
Game_Action.prototype.stripStates = function(target, jabsOnChanceEffects) {
	if (jabsOnChanceEffects.length === 0) return;
	jabsOnChanceEffects.forEach((jabsOnChanceEffect) => {
		const attacker = this.subject();
		const skill = jabsOnChanceEffect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = target.getNegativeRolls();
		if (jabsOnChanceEffect.shouldTrigger(positiveRolls, negativeRolls, attacker)) {
			this.stripState(target, jabsOnChanceEffect.skillId);
		}
	});
};
/**
* Loses a single stack of the given state from the target.
* This falls back to full state removal outside JABS.
* @param {Game_Actor|Game_Enemy} target The target losing the state.
* @param {number} stateId The id of the state to lose.
*/
Game_Action.prototype.loseState = function(target, stateId) {
	if (J.ABS) {
		target.decrementStateStacks(stateId);
		return;
	}
	target.removeState(stateId);
};
/**
* Strips a single stack of the given state from the target.
* This falls back to full state removal outside JABS.
* @param {Game_Actor|Game_Enemy} target The target losing the state.
* @param {number} stateId The id of the state to strip.
*/
Game_Action.prototype.stripState = function(target, stateId) {
	if (J.ABS) {
		target.decrementStateStacks(stateId);
		return;
	}
	target.removeState(stateId);
};
/**
* Removes the given states from the target.
* This fully strips the state instead of consuming a single stack.
* @param target {Game_Actor|Game_Enemy} The target to apply states to.
* @param jabsOnChanceEffects {JABS_OnChanceEffect[]} The various states to potentially apply.
*/
Game_Action.prototype.removeStates = function(target, jabsOnChanceEffects) {
	if (jabsOnChanceEffects.length === 0) return;
	jabsOnChanceEffects.forEach((jabsOnChanceEffect) => {
		const attacker = this.subject();
		const skill = jabsOnChanceEffect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = target.getNegativeRolls();
		if (jabsOnChanceEffect.shouldTrigger(positiveRolls, negativeRolls, attacker)) {
			target.removeState(jabsOnChanceEffect.skillId);
		}
	});
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Battler.js
/**
* Overwrites {@link #skill}.<br/>
* Routes skill resolution through OverlayManager so any active extension overlays
* for this battler are folded into the returned skill before callers inspect it.
* Both actors and enemies benefit here: Game_Enemy#skills already calls this.skill()
* per action, so enemies transparently receive overlay-merged skills when applicable.
* @param {number} skillId The skill id to resolve.
* @returns {RPG_Skill} The potentially extended skill.
*/
Game_Battler.prototype.skill = function(skillId) {
	return OverlayManager.getExtendedSkill(this, skillId);
};
/**
* Overwrites {@link #state}.<br/>
* Routes state resolution through OverlayManager so any active state extensions for this battler
* are folded into the returned state before callers inspect it.
* @param {number} stateId The state id to resolve.
* @returns {RPG_State} The potentially extended state.
*/
Game_Battler.prototype.state = function(stateId) {
	return OverlayManager.getExtendedState(this, stateId);
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Actor.js
/**
* Extends {@link #skills}.<br/>
* Routes each skill through the extended skill resolver so that overlay
* contributions from learned extension skills are reflected in the returned list.
* Vanilla logic handles deduplication and addedSkills; we simply remap the result.
* @returns {RPG_Skill[]} The (potentially extended) full skill list.
*/
J.EXTEND.Aliased.Game_Actor.set("skills", Game_Actor.prototype.skills);
Game_Actor.prototype.skills = function() {
	const baseSkills = J.EXTEND.Aliased.Game_Actor.get("skills").call(this);
	return baseSkills.map((skill) => this.skill(skill.id));
};
/**
* Extends {@link #hasSkill}.<br/>
* Vanilla compares by object reference (`skills().includes($dataSkills[id])`), which
* breaks as soon as the overlay system returns a clone instead of the original database
* entry.  Compare by id so the result is correct regardless of whether an overlay
* is currently active for this skill.
* @param {number} skillId The skill id to check for.
* @returns {boolean}
*/
J.EXTEND.Aliased.Game_Actor.set("hasSkill", Game_Actor.prototype.hasSkill);
Game_Actor.prototype.hasSkill = function(skillId) {
	return this.skills().some((skill) => skill.id === skillId);
};
/**
* Extends {@link #learnSkill}.<br/>
* Invalidates the caster cache when a skill is learned.
*/
J.EXTEND.Aliased.Game_Actor.set("learnSkill", Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId) {
	J.EXTEND.Aliased.Game_Actor.get("learnSkill").call(this, skillId);
	OverlayManager.invalidate(this);
};
/**
* Extends {@link #forgetSkill}.<br/>
* Invalidates the caster cache when a skill is forgotten.
*/
J.EXTEND.Aliased.Game_Actor.set("forgetSkill", Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId) {
	J.EXTEND.Aliased.Game_Actor.get("forgetSkill").call(this, skillId);
	OverlayManager.invalidate(this);
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Enemy.js
/**
* Extends {@link #learnSkill}.<br/>
* Invalidates the caster cache when a skill is learned.
*/
J.EXTEND.Aliased.Game_Enemy.set("learnSkill", Game_Enemy.prototype.learnSkill);
Game_Enemy.prototype.learnSkill = function(skillId) {
	J.EXTEND.Aliased.Game_Enemy.get("learnSkill").call(this, skillId);
	OverlayManager.invalidate(this);
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Item.js
/**
* Extends {@link #initMembers}.<br/>
* Also declares the underlying object, at its resting value.
*
* The default lives here rather than in the `initialize` alias below so that a decode establishes it
* too - the hook is the only one of the two a savefile can run.
*/
J.EXTEND.Aliased.Game_Item.set("initMembers", Game_Item.prototype.initMembers);
Game_Item.prototype.initMembers = function() {
	J.EXTEND.Aliased.Game_Item.get("initMembers").call(this);
	/**
	* The underlying object associated with this item.
	* @type {RPG_EquipItem|RPG_UsableItem}
	*/
	this._item = null;
};
/**
* Extends `initialize()` to include our update of assigning the item.
*
* Only the *mapping* is here; the default is in {@link #initMembers} above. An extended skill is not
* in the database, so the object it wraps has to be carried in rather than looked up.
*/
J.EXTEND.Aliased.Game_Item.set("initialize", Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item) {
	J.EXTEND.Aliased.Game_Item.get("initialize").call(this, item);
	if (item) {
		this._item = item;
	}
};
/**
* Gets the underlying object for this `Game_Item`.
* Normally this can be retrieved by using {@link Game_Item.object}, but that function limits
* the possibility of retrieval to only stuff in the database, which extended skills will
* not be in the database.
*/
Game_Item.prototype.underlyingObject = function() {
	return this._item;
};
/**
* Sets the underlying object this item carries.
*
* Only ever handed something the database does not contain; a row the engine can look up by id is
* left uncarried on purpose. See {@link Game_Item.carryWhenSynthetic} for why.
* @param {RPG_UsableItem|RPG_EquipItem} obj The object to carry, or null to carry nothing.
*/
Game_Item.prototype.setItem = function(obj) {
	this._item = obj;
};
/**
* Carries the given object only when its database does not already hold it at its own id.
*
* A row the database holds is reachable by id, so it stays a data class plus an id- which is what
* keeps a savefile referencing a row rather than freezing a copy of one that will never see a
* rebalance, with nothing reporting that it didn't. Anything else was synthesized (an overlay-merged
* skill, almost always) and exists nowhere the engine can look it up, so this wrapper is the only
* thing that can hold onto it.
*
* Clearing on a real row matters as much as carrying on a synthetic one. The wrapper outlives any
* single binding, so a carry left behind by a previous skill would answer for the next one bound
* here- silently handing back a skill nobody asked for.
* @param {RPG_UsableItem} obj The object being bound to this wrapper.
* @param {RPG_UsableItem[]} database The database that would hold it, if it came from one.
*/
Game_Item.prototype.carryWhenSynthetic = function(obj, database) {
	if (database[obj.id] === obj) {
		this.setItem(null);
		return;
	}
	this.setItem(obj);
};
/**
* Extends `setObject()` to enable setting custom skills and items.
*
* Only an object the database does not contain is carried; everything else stays a data class plus
* an id. Whether a row came from the database is a question of provenance rather than of type- a
* merged clone is every bit as much an {@link RPG_Skill} as the row it was cloned from- so that
* question is asked of the database itself in {@link Game_Item.carryWhenSynthetic}. The type
* predicates here decide only which database is the one worth asking.
* @param {RPG_UsableItem|RPG_EquipItem} obj The database row or custom object being bound.
*/
J.EXTEND.Aliased.Game_Item.set("setObject", Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(obj) {
	J.EXTEND.Aliased.Game_Item.get("setObject").call(this, obj);
	if (!obj) return;
	if (obj.isSkill()) {
		this.setDataClass("skill");
		this.carryWhenSynthetic(obj, $dataSkills);
	} else if (obj.isItem()) {
		this.setDataClass("item");
		this.carryWhenSynthetic(obj, $dataItems);
	}
};
/**
* Extends this function to return the underlying custom object (like an extended skill)
* if it was assigned.
*/
J.EXTEND.Aliased.Game_Item.set("object", Game_Item.prototype.object);
Game_Item.prototype.object = function() {
	if (this._item) {
		return this._item;
	}
	return J.EXTEND.Aliased.Game_Item.get("object").call(this);
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Party.js
/**
* Passive skill states from battle party members that can trigger on-hit self effects.
* @returns {RPG_State[]}
*/
Game_Party.prototype.extraOnHitSelfStateSources = function() {
	const extraSources = [];
	if (J.PASSIVE) {
		const members = $gameParty.battleMembers();
		members.forEach((member) => {
			extraSources.push(...member.allStates());
		});
	}
	return extraSources;
};
/**
* Passive skill states from battle party members that can trigger on-cast self effects.
* @returns {RPG_State[]}
*/
Game_Party.prototype.extraOnCastSelfStateSources = function() {
	const extraSources = [];
	if (J.PASSIVE) {
		const members = $gameParty.battleMembers();
		members.forEach((member) => {
			extraSources.push(...member.allStates());
		});
	}
	return extraSources;
};

//#endregion
//#region src/plugins/extend/core/managers/JABS_SkillSlotManager.js
J.EXTEND.Aliased.JABS_SkillSlotManager.set("filterActionSkills", JABS_SkillSlotManager.prototype.filterActionSkills);
/**
* Extends {@link #filterActionSkills}.<br/>
* Also filters out skill extensions.
* @param {Game_Enemy} enemy The enemy to check.
* @param {RPG_EnemyAction} action The action to check.
*/
JABS_SkillSlotManager.prototype.filterActionSkills = function(enemy, action) {
	const originalLogic = J.EXTEND.Aliased.JABS_SkillSlotManager.get("filterActionSkills").call(this, enemy, action);
	if (originalLogic === false) return false;
	const skill = enemy.skill(action.skillId);
	return skill.isExtension === false;
};

//#endregion
//# sourceMappingURL=J-Extend.js.map