//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.2.1 EXTEND] Extends the capabilities of skills/actions.
 * @base J-Base
 * @orderAfter J-Base
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * This plugin extends the functionality of skills. It features additional
 * functionality that allow you to leverage new strategies in skill learning
 * and game development.
 *
 * DETAILS:
 * The new functionalities available are as follows:
 * - Skills extending skills.
 * - On-hit self-state application and removal.
 * - On-cast self-state application and removal.
 * - On-hit target-state stack stripping and full removal.
 * - On-cast target-state stack stripping and full removal.
 * ============================================================================
 * SKILL EXTENSION:
 * Have you ever wanted to have a single skill gain additional effects by
 * learning other skills? Well now you can! By applying the appropriate tag to
 * the skill(s) in question, you too can have skills that can progressively
 * gain additional upgrades/capabilities as a battler learns more skills!
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <skillExtend:[NUM]>
 *  <skillExtend:[NUM,NUM,...]>
 * Where NUM is the skill id to extend.
 *
 * TAG EXAMPLES:
 *  <skillExtend:[40]>
 * This skill will act as an extension to skill of id 40.
 *
 *  <skillExtend:[7,8,9,10,11]>
 * This skill will act as an extension to all skills of id 7, 8, 9, 10, and 11.
 * ============================================================================
 * WHAT DOES "ACT AS AN EXTENSION" MEAN?
 * ============================================================================
 * This section of information is so important that it gets its own headline!
 *
 * Lets pretend that in our fictional example, skill id 40 maps to "Fireball".
 * We want to extend our "Fireball" skill in some way by using this skill's
 * data points. What might that look like? It can manifest in a variety of
 * ways, but with this plugin, we use extension skills as OVERRIDES or AUGMENTS
 * to the base skill. Thusly, if this skill were some kind of upgrade, you
 * could fill in the damage formula to maybe have higher multipliers, and
 * add some extra repeats (offset of +1). The changes in the skill will overlay
 * the base skill's parameters and apply BEFORE the skill's execution. You
 * can see below for a comprehensive list of what happens to the base skill
 * based on an extension skill.
 *
 * NOTE:
 * Effects are only added or updated. Tags cannot be removed by this plugin
 * with the single exception of the extend tag.
 *
 * Comprehensive breakdown of how things are overridden:
 *  If a damage type is checked:
 *    - yes/no critical option is replaced.
 *    - base element id is replaced.
 *    - allowed upgrade of "hp damage" >> "hp drain" (but not cross or reverse)
 *    - allowed upgrade of "mp damage" >> "mp drain" (but not cross or reverse)
 *    - damage variance is replaced.
 *    - the formula itself is replaced if it is not completely empty.
 *  Other sections include:
 *    - the "effects" section of the skill just adds right into the base skill.
 *    - the two "meta" objects are merged with the extension skill's priority.
 *    - the extension skill's "note" object is appended onto the base skill's.
 *    - the repeats are added onto the base (offset of +1).
 *    - the speed is added onto the base.
 *    - the success is added onto the base (only if not same or equal to 100).
 *    - the scope is replaced.
 *    - the mp cost is replaced.
 *    - the tp cost is replaced.
 *    - the tp gain is added onto the base.
 *    - if the hit type section is not "certain hit", then it replaces.
 *    - both message lines are replaced.
 *  Base data things of note:
 *    - the "occasion" is not changeable.
 *    - though "note" objects are appended, the tag for extension is removed
 *      to prevent recursive behaviors in skill extension. This removal is
 *      only for this execution of the skill for overlay purposes only.
 *    - the editor's speed cap of +/-2000 is not respected!
 *    - the editor's success cap of 0-100 is not respected!
 *  When it comes to the note section:
 *    - all tags by default will be overridden where the key matches.
 *    - you can avoid override behavior by configuring duplicate keys.
 *
 * If using this plugin with JABS...
 *
 * Note about adding move-related tags:
 *  The effects of adding the "moveType" tag onto a skill that didn't
 *  previously have it are completely untested, use at your own risk!
 * Note about adding guard-related tags:
 *  The effects of adding the "counterGuard/counterParry" tags onto a skill
 *  that didn't previously have it are untested, though shouldn't cause any
 *  problems if they are added onto a skill with "guard & parry".
 * Note about combo-related tags:
 *  The effects of adding the "combo/actionId/direct" tags onto any skills is
 *  something to be careful about, as they very significantly change how
 *  the manager interacts with the actions. Replacing any of those values
 *  though should be totally fine if they already existed on the base skill.
 *
 * With that in mind, it is strongly recommended that you copy-paste the base
 * skill into the extension skill slot in your RMMZ editor database skill tab
 * to start your extension (or another skill extension of the same skill
 * perhaps)!
 * ============================================================================
 * STATE REACTION EFFECTS:
 * Have you ever wanted a battler to be able to inflict themselves with a state,
 * lose one of their own state stacks, strip a state stack from a target, or
 * fully remove a state from a target as part of a skill's execution? Well now
 * you can! By applying the appropriate tag to the skill(s) in question, you too
 * can have battlers that react to casting or landing skills with state
 * application and removal effects.
 *
 * NOTE 1:
 * State resistance is not taken into account in regards to the CHANCE of the
 * various self-state effects. It is assumed that the percent chance designated
 * in the tag is fully representative of the chance that the state will be
 * applied to the caster.
 *
 * NOTE 2:
 * In addition to JABS multiple projectiles triggering the on-hit effect
 * multiple times, having a skill "repeat", or in JABS have multiple hits on
 * the skill, will both result in triggering the on-hit effect multiple times.
 *
 * NOTE 3:
 * On-hit effects only process on a literal hit.
 * If the action misses, is evaded, or is parried, then the on-hit effects will
 * not trigger.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <onCastSelfState:[STATE_ID,CHANCE]>
 *  <onHitSelfState:[STATE_ID,CHANCE]>
 *  <onCastLoseState:[STATE_ID,CHANCE]>
 *  <onHitLoseState:[STATE_ID,CHANCE]>
 *  <onCastStripState:[STATE_ID,CHANCE]>
 *  <onHitStripState:[STATE_ID,CHANCE]>
 *  <onCastRemoveState:[STATE_ID,CHANCE]>
 *  <onHitRemoveState:[STATE_ID,CHANCE]>
 * Where STATE_ID is the id of the state to apply, strip, or remove.
 * Where CHANCE is the percent chance between 0 and 100 that it'll trigger.
 *
 * TAG EXAMPLES:
 *  <onCastSelfState:[3,40]>
 * The caster has a 40% chance of applying state w/ id of 3 to oneself.
 * When using JABS, this applies as soon as the skill/action is executed.
 * When using non-JABS, this applies in the same phase as you would gain TP
 * from executing a skill.
 *
 *  <onHitSelfState:[19,100]>
 * The caster has a 100% (always) chance of appling state id 19 to oneself.
 * This processes when the action successfully hits the target.
 * When using JABS, this applies as soon as the skill/action lands on
 * a target. This will trigger multiple times if an action has multiple
 * projectiles.
 * When using non-JABS, this applies when a skill successfully hits a
 * target. Misses, evades, and parries do not trigger this.
 *
 *  <onCastLoseState:[6,100]>
 * The caster has a 100% (always) chance of losing one stack of state id 6 from oneself.
 * This processes alongside other on-cast effects when the skill is executed.
 *
 *  <onHitLoseState:[7,50]>
 * The caster has a 50% chance of losing one stack of state id 7 from oneself when the
 * skill successfully hits a target.
 *
 *  <onCastStripState:[8,100]>
 * The caster has a 100% (always) chance of stripping one stack of state id 8
 * from the target.
 * This processes alongside other on-cast effects when the skill is executed.
 *
 *  <onHitStripState:[9,40]>
 * The caster has a 40% chance of stripping one stack of state id 9 from the
 * target when the skill successfully hits that target.
 *
 *  <onCastRemoveState:[10,100]>
 * The caster has a 100% (always) chance of fully removing state id 10 from the target.
 * This processes alongside other on-cast effects when the skill is executed.
 *
 *  <onHitRemoveState:[11,40]>
 * The caster has a 40% chance of fully removing state id 11 from the target when the
 * skill successfully hits that target.
 * ============================================================================
 * CHANGELOG:
 * - 1.2.1
 *    Fixed extendEffects to deduplicate addState effects by state ID when merging overlays.
 *    When an extension defines a state application, any prior entry for that state ID is
 *    replaced rather than concatenated — last extension wins per state. Multiple entries for
 *    the same state within a single extension are preserved for intentional stack effects.
 * - 1.2.0
 *    Implement caching for skill extensions by caster.
 *    Consume `RPGManager` updates.
 * - 1.1.0
 *    Rewrite tag override functionality to replace excluding specified keys.
 * - 1.0.1
 *    Fixed reference error when attempting to extend skills w/ on-hit effects.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/extend/core/_metadata/_pluginMetadata.js
var J_SkillExtendPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/extend/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
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
J.EXTEND.Metadata = new J_SkillExtendPluginMetadata("J-SkillExtend", "1.2.1");
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
* All regular expressions used by this plugin.
*/
J.EXTEND.RegExp = {};
/**
* The structure of a skill extension tag.
*
* <pre>
* Structure:
*  <skillExtend:[BASE_SKILL_ID,...]>
*
* Example:
*  <skillExtend:[7, 8, 9]>
*
* Translation:
*  Extends skill id 7.
*  Extends skill id 8.
*  Extends skill id 9.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.SkillExtend = /<skillExtend:[ ]?(\[[ ]?\d+(?:,[ ]?\d+)*[ ]?])>/i;
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

//#endregion
//#region src/plugins/extend/core/managers/OverlayManager.js
/**
* A static class for managing the overlaying of one skill onto another.
* The methods are divided by the attribute they overlay.
*/
var OverlayManager = class OverlayManager {
	/**
	* The line types available for overlaying in the context of a note.
	*/
	static LineType = {
		/**
		* A "key value pair" tag, such as <key:value>.
		*/
		kvp: "kvp",
		/**
		* A "boolean" tag, such as <key>.
		*/
		boolean: "boolean",
		/**
		* A tag that isn't supported by this framework at this time.
		* Any tag that is not one of the defined types will qualify as this and not get mutated.
		*/
		unsupported: "unsupported"
	};
	/**
	* A cache for caster-skill extensions.
	* This is effectively a map of maps, where the parent map is keyed by the caster, while the child map is keyed by
	* a combination of the skill id and its extension skill ids.
	* @type {WeakMap<Game_Actor|Game_Enemy, Map<string, RPG_Skill>>}
	*/
	static _casterExtendCache = new WeakMap();
	/**
	* The metrics for this manager.
	* @type {{ hits: number, misses: number }}
	*/
	static _metrics = {
		hits: 0,
		misses: 0
	};
	/**
	* Invalidates the cache for the given battler.
	* @param {Game_Actor|Game_Enemy} battler The battler to invalidate the cache for.
	* @returns {boolean} True if the cache was invalidated, false otherwise.
	*/
	static invalidate(battler) {
		return this._casterExtendCache.delete(battler);
	}
	/**
	* Clears the cache for all objects.
	*/
	static clearCache() {
		this._casterExtendCache = new WeakMap();
	}
	/**
	* Gets the existing cache of a caster's skill extensions.
	* If a cache does not yet exist for the caster, it'll be created.
	* @param {Game_Actor|Game_Enemy} caster The caster of the skill.
	* @returns {Map<string, RPG_Skill>}
	*/
	static getOrCreateCacheForCaster(caster) {
		const cacheHit = this._casterExtendCache.get(caster);
		if (cacheHit) return cacheHit;
		const newCasterCache = new Map();
		this._casterExtendCache.set(caster, newCasterCache);
		return newCasterCache;
	}
	/**
	* Retrieves a cached value for this caster/key, or computes and stores it.
	*
	* @param {Game_Actor|Game_Enemy} caster - The caster whose cache bucket to use.
	* @param {string} key - Stable key representing the computed value (ex: base skill id + overlay ids).
	* @param {Function} computeFn - A no-arg function that computes the value on a cache miss.
	* @returns {RPG_Skill} - The cached or newly computed extended skill.
	*/
	static cached(caster, key, computeFn) {
		const perCaster = this.getOrCreateCacheForCaster(caster);
		if (perCaster.has(key)) {
			this._metrics.hits++;
			return perCaster.get(key);
		}
		const value = computeFn();
		perCaster.set(key, value);
		this._metrics.misses++;
		return value;
	}
	/**
	* Gets the extended skill based on the caster's learned skills.
	* @param caster {Game_Actor|Game_Enemy} The caster of the skill.
	* @param skillId {number} The base skill to extend.
	* @returns {RPG_Skill}
	*/
	static getExtendedSkill(caster, skillId) {
		if (skillId <= 0) throw new Error("Invalid skill extension id.");
		if (!caster) return $dataSkills[skillId];
		const overlaySkills = caster.skills().filter((skill) => this.#isOverlayForBase(skill, skillId));
		if (overlaySkills.length > 0) {
			overlaySkills.sort((a, b) => a.id - b.id);
		}
		const overlayKey = `${skillId}|${overlaySkills.map((s) => s.id).join(",")}`;
		return this.cached(caster, overlayKey, () => this.#getExtendedSkill(overlaySkills, skillId));
	}
	/**
	* Checks if a given skill is an extension skill that can overlay the given base skill.
	* @param {RPG_Skill} skill The skill that potentially is the overlay.
	* @param {number} skillId The id of the base skill to check for overlay compatibility.
	* @returns {boolean} Whether or not the skill is an overlay for the base skill.
	*/
	static #isOverlayForBase(skill, skillId) {
		if (skill.isSkillExtension === false) return false;
		return skill.getSkillExtensions.includes(skillId);
	}
	/**
	* Extends the base skill with the given overlay skills in sequential order.
	* @param {RPG_Skill[]} overlaySkills - The skill overlays to apply.
	* @param {number} skillId - The id of the base skill to extend.
	* @returns {RPG_Skill} The extended skill.
	*/
	static #getExtendedSkill(overlaySkills, skillId) {
		if (overlaySkills.length === 0) {
			return $dataSkills[skillId];
		}
		const baseClone = $dataSkills[skillId]._clone();
		const extended = overlaySkills.reduce((working, overlay) => this.extendSkill(working, overlay), baseClone);
		return extended;
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
		if (baseSkill.successRate !== skillOverlay.successRate || skillOverlay.successRate !== 100) {
			baseSkill.successRate += skillOverlay.successRate;
		}
		if (skillOverlay.repeats !== 1) {
			baseSkill.repeats += skillOverlay.repeats - 1;
		}
		baseSkill.tpGain += skillOverlay.tpGain;
		if (baseSkill.hitType && skillOverlay.hitType) {
			baseSkill.hitType = skillOverlay.hitType;
		}
		if (baseSkill.animationId !== 0 && baseSkill.animationId !== skillOverlay.animationId) {
			baseSkill.animationId = skillOverlay.animationId;
		}
	}
	/**
	* Extends the message section of a skill.
	* @param {RPG_Skill} baseSkill The skill being extended.
	* @param {RPG_Skill} skillOverlay The skill extending the base skill.
	*/
	static extendMessage(baseSkill, skillOverlay) {
		if (baseSkill.message1 !== skillOverlay.message1) {
			baseSkill.message1 = skillOverlay.message1;
		}
		if (baseSkill.message2 !== skillOverlay.message2) {
			baseSkill.message2 = skillOverlay.message2;
		}
	}
	/**
	* Purges all references to the skill extend tag from the `baseSkill`.
	* @param baseSkill {RPG_Skill} The base skill.
	* @returns {RPG_Skill} The overlayed base skill.
	*/
	static sanitizeExtensions(baseSkill) {
		delete baseSkill.meta["skillExtend"];
		baseSkill.note = baseSkill.note.replace(J.EXTEND.RegExp.SkillExtend, String.empty);
		baseSkill.note = baseSkill.note.replace(/\n\n/gim, "\n");
		baseSkill.note = baseSkill.note.replace(/\r\r/gim, "\r");
		RPGManager.invalidate(baseSkill);
	}
	/**
	* The list of keys on notes that should never get merged/overridden, but instead appended.
	* @type {string[]}
	*/
	static _nonCombiningKeys = ["drop"];
	/**
	* Gets the keys that should never be combined- they will effectively be treated as unsupported.
	* @returns {string[]}
	*/
	static getNonCombiningKeys() {
		return this._nonCombiningKeys;
	}
	/**
	* Sets the global list of tag keys that should NOT be replaced when merging, but instead combined.
	* This allows multi-instance tags like `drop` to append additional lines from the overlay note.
	* @param {string[]} keys The array of keys that should be non-combining (case-insensitive).
	*/
	static setNonCombiningKeys(keys) {
		this._nonCombiningKeys = Array.isArray(keys) ? keys.map((k) => String(k).toLowerCase()) : [];
	}
	/**
	* Merges the overlay note into the base note with key-aware behavior.
	* - For keys not in the exclusions set: replace base lines with overlay lines if overlay provides any.
	* - For keys in the exclusions set: append unique overlay lines after base lines (multi-instance tags like "drop").
	* - Unsupported lines (non-tag text) are preserved from both notes with deduplication; base lines keep priority.
	*
	* Keys are case-insensitive. Tags are those enclosed with angle brackets (e.g., `<key:value>` or `<key>`).
	*
	* @param {string} baseNote The base note content.
	* @param {string} overlayNote The overlay note content.
	* @param {string[]=} nonCombiningKeys Optional keys to merge instead of replace; defaults to configured static list.
	* @returns {string} The merged note text, joined with newlines.
	*/
	static overwriteNote(baseNote, overlayNote, nonCombiningKeys) {
		const oldNote = baseNote || String.empty;
		const newNote = overlayNote || String.empty;
		const exclusions = this._normalizeExclusions(nonCombiningKeys);
		const oldTokens = this._tokenizeNote(oldNote);
		const newTokens = this._tokenizeNote(newNote);
		const oldBuckets = this._toKeyBuckets(oldTokens.tags);
		const newBuckets = this._toKeyBuckets(newTokens.tags);
		const merged = this._mergeBuckets(oldBuckets, newBuckets, exclusions);
		const mergedUnsupported = this._mergeUnsupported(oldTokens.unsupported, newTokens.unsupported);
		const result = this._reconstructNote(mergedUnsupported, merged);
		return result;
	}
	/**
	* Normalizes the incoming exclusions array, or falls back to the static configuration.
	* @param {string[]|null|undefined} exclusions The caller-provided keys that should merge instead of replace.
	* @returns {string[]} A lowercase array of keys to treat as non-replacing during merges.
	*/
	static _normalizeExclusions(exclusions) {
		const provided = Array.isArray(exclusions) ? exclusions : this.getNonCombiningKeys();
		return provided.map((k) => String(k).toLowerCase());
	}
	/**
	* Tokenizes a note text into angle-bracketed tags and unsupported lines.
	* Handles tags concatenated without newlines by regex extraction, and also
	* collects newline-separated content that is not tags.
	* @param {string} note The raw note text.
	* @returns {{tags: string[], unsupported: string[]}} The extracted tags and unsupported lines.
	*/
	static _tokenizeNote(note) {
		const tags = note.match(/<[^>]+>/g) || [];
		const rawLines = (note.split(/[\r\n]+/) || []).filter((l) => l.length > 0);
		const tagSet = new Set(tags);
		const unsupported = rawLines.filter((l) => tagSet.has(l) === false);
		return {
			tags,
			unsupported
		};
	}
	/**
	* Parses a single tag string into a key and type using the existing classifier.
	* @param {string} tag The tag, e.g. "<range:5>" or "<direct>".
	* @returns {{type: string, key: (string|null), line: string}} The parsed record.
	*/
	static _parseTag(tag) {
		const type = this._classifyLine(tag);
		if (type === OverlayManager.LineType.unsupported) {
			return {
				type,
				key: null,
				line: tag
			};
		}
		const inner = tag.substring(1, tag.length - 1);
		if (type === OverlayManager.LineType.kvp) {
			const idx = inner.indexOf(":");
			const key = inner.substring(0, idx).trim().toLowerCase();
			return {
				type,
				key,
				line: tag
			};
		}
		const key = inner.trim().toLowerCase();
		return {
			type: OverlayManager.LineType.boolean,
			key,
			line: tag
		};
	}
	/**
	* Determines if the note line is one of our standard key-value pairs separated by a colon.
	* @param {string} line The note line as a string.
	* @returns {boolean} True if it is a conventional <key:value> type of line.
	*/
	static _classifyLine(line) {
		if (line.startsWith("<") === false || line.endsWith(">") === false) return OverlayManager.LineType.unsupported;
		if ((line.match(/</g) || []).length > 1) return OverlayManager.LineType.unsupported;
		if ((line.match(/>/g) || []).length > 1) return OverlayManager.LineType.unsupported;
		if (line.includes(":")) return OverlayManager.LineType.kvp;
		return OverlayManager.LineType.boolean;
	}
	/**
	* Buckets an array of tag strings by their keys, preserving the first-seen key order
	* and deduping exact duplicate lines within a key.
	* @param {string[]} tags The tag strings to bucket.
	* @returns {{ order: string[], map: Record<string, string[]> }} The ordered keys and per-key lines.
	*/
	static _toKeyBuckets(tags) {
		const order = [];
		const map = Object.create(null);
		tags.forEach((tag) => {
			const parsed = this._parseTag(tag);
			if (parsed.type === OverlayManager.LineType.unsupported) {
				return;
			}
			if (map[parsed.key] === undefined) {
				map[parsed.key] = [];
				order.push(parsed.key);
			}
			if (map[parsed.key].includes(parsed.line) === false) {
				map[parsed.key].push(parsed.line);
			}
		});
		return {
			order,
			map
		};
	}
	/**
	* Merges the old and new buckets according to replacement rules and exclusions.
	* - For keys NOT in exclusions: replace old lines entirely with new lines (if provided), else keep old.
	* - For keys IN exclusions: combine old lines with new lines (append unique new lines), preserving order.
	* - New-only keys are appended in the order they appear in the new note.
	* @param {{order: string[], map: Record<string, string[]>}} oldBuckets The buckets from the base note.
	* @param {{order: string[], map: Record<string, string[]>}} newBuckets The buckets from the overlay note.
	* @param {string[]} exclusions The keys to be combined instead of replaced.
	* @returns {{ order: string[], map: Record<string, string[]> }} The merged buckets.
	*/
	static _mergeBuckets(oldBuckets, newBuckets, exclusions) {
		const mergedMap = Object.create(null);
		const mergedOrder = [];
		const appendKey = (key, lines) => {
			if (!lines || lines.length === 0) {
				return;
			}
			mergedMap[key] = lines.slice(0);
			if (mergedOrder.includes(key) === false) {
				mergedOrder.push(key);
			}
		};
		oldBuckets.order.forEach((key) => {
			const isExcluded = exclusions.includes(key);
			const oldLines = oldBuckets.map[key];
			const newLines = newBuckets.map[key];
			if (newLines && newLines.length > 0 && isExcluded === false) {
				appendKey(key, newLines);
				return;
			}
			if (isExcluded && newLines && newLines.length > 0) {
				const combined = oldLines.slice(0);
				newLines.forEach((line) => {
					if (combined.includes(line) === false) {
						combined.push(line);
					}
				});
				appendKey(key, combined);
				return;
			}
			appendKey(key, oldLines);
		});
		newBuckets.order.forEach((key) => {
			if (mergedOrder.includes(key) === false) {
				appendKey(key, newBuckets.map[key]);
			}
		});
		return {
			order: mergedOrder,
			map: mergedMap
		};
	}
	/**
	* Merges unsupported lines by appending new unsupported lines that do not already exist.
	* Old unsupported lines retain their relative order.
	* @param {string[]} oldUnsupported The unsupported lines from the base note.
	* @param {string[]} newUnsupported The unsupported lines from the overlay note.
	* @returns {string[]} The merged unsupported lines.
	*/
	static _mergeUnsupported(oldUnsupported, newUnsupported) {
		const merged = [];
		oldUnsupported.forEach((line) => {
			if (merged.includes(line) === false) {
				merged.push(line);
			}
		});
		newUnsupported.forEach((line) => {
			if (merged.includes(line) === false) {
				merged.push(line);
			}
		});
		return merged;
	}
	/**
	* Reconstructs a note from unsupported lines and merged buckets of tags.
	* Unsupported lines are emitted first, followed by tags grouped by key in key order.
	* @param {string[]} unsupported The unsupported lines to emit first.
	* @param {{order: string[], map: Record<string, string[]>}} buckets The merged buckets.
	* @returns {string} The reconstructed note text.
	*/
	static _reconstructNote(unsupported, buckets) {
		const parts = [];
		unsupported.forEach((line) => {
			parts.push(line);
		});
		buckets.order.forEach((key) => {
			const lines = buckets.map[key];
			lines.forEach((line) => {
				parts.push(line);
			});
		});
		const result = parts.join("\n");
		return result;
	}
};

//#endregion
//#region src/plugins/extend/core/database/RPG_Skill.js
/**
* Determines whether or not there are any skill extensions on this skill.
*/
Object.defineProperty(RPG_Skill.prototype, "isSkillExtension", { get: function() {
	return !!RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.SkillExtend, true, true);
} });
/**
* Gets all skill extensions for this skill- if any.
* Will return an empty array if none are present.
*/
Object.defineProperty(RPG_Skill.prototype, "getSkillExtensions", { get: function() {
	return RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.SkillExtend, true);
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
	this._item.setObject(skillToSet);
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
	this._item.setObject(itemObject);
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
* Extends {@link #applyItemUserEffect}.<br/>
* Also applies on-cast states.
*/
J.EXTEND.Aliased.Game_Action.set("applyItemUserEffect", Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target) {
	J.EXTEND.Aliased.Game_Action.get("applyItemUserEffect").call(this, target);
	this.applyOnCastSelfStates();
	this.applyOnCastLoseStates();
	this.applyOnCastStripStates(target);
	this.applyOnCastRemoveStates(target);
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
		if (jabsOnChanceEffect.shouldTrigger()) {
			target.addState(jabsOnChanceEffect.skillId, this.subject());
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
		if (jabsOnChanceEffect.shouldTrigger()) {
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
		if (jabsOnChanceEffect.shouldTrigger()) {
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
		if (jabsOnChanceEffect.shouldTrigger()) {
			target.removeState(jabsOnChanceEffect.skillId);
		}
	});
};

//#endregion
//#region src/plugins/extend/core/objects/Game_Actor.js
/**
* Overwrites {@link #skill}.<br/>
* Overlays the skill with any skill extensions.
* @param {number} skillId The skill id to get the skill for.
* @returns {RPG_Skill} The potentially extended skill.
*/
Game_Actor.prototype.skill = function(skillId) {
	return OverlayManager.getExtendedSkill(this, skillId);
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
* Extend `initialize()` to include our update of assigning the item.
*/
J.EXTEND.Aliased.Game_Item.set("initialize", Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item) {
	J.EXTEND.Aliased.Game_Item.get("initialize").call(this, item);
	/**
	* The underlying object associated with this item.
	* @type {RPG_EquipItem|RPG_UsableItem}
	*/
	this._item = null;
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
* Extends `setObject()` to enable setting custom skills and items.
* @param {RPG_UsableItem|RPG_EquipItem}
*/
J.EXTEND.Aliased.Game_Item.set("setObject", Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(obj) {
	J.EXTEND.Aliased.Game_Item.get("setObject").call(this, obj);
	if (!obj) return;
	if (obj.hasOwnProperty("stypeId")) {
		this._dataClass = "skill";
		this._item = obj;
	} else if (obj.hasOwnProperty("itypeId")) {
		this._dataClass = "item";
		this._item = obj;
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
	return skill.isSkillExtension === false;
};

//#endregion
//# sourceMappingURL=J-SkillExtend.js.map