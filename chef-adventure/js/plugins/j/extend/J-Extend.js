//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.4.1 EXTEND] Extends the capabilities of skills/actions.
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
 * - Skills and states.
 *
 * TAG FORMAT:
 *  <extend:[NUM]>
 *  <extend:[NUM,NUM,...]>
 * Where NUM is the skill or state id to extend.
 *
 * TAG EXAMPLES:
 *  <extend:[40]>
 * This skill/state will act as an extension to skill/state of id 40.
 *
 *  <extend:[7,8,9,10,11]>
 * This skill/state will act as an extension to all skills/states of id 7, 8, 9, 10, and 11.
 *
 * EXTENSION BY TYPE:
 * As an alternative to id-based extension, a skill or state can instead extend
 * EVERY skill/state carrying a matching <type:CLASSIFIER> tag (see J-Base), without
 * having to list each target id individually.
 *
 * TAG USAGE:
 * - Skills and states.
 *
 * TAG FORMAT:
 *  <extendType:CLASSIFIER>
 * Where CLASSIFIER is the type classifier string to match against (see
 * J-Base's <type:CLASSIFIER> tag).
 *
 * TAG EXAMPLES:
 *  <extendType:poison>
 * This state acts as an extension to every currently active state that
 * carries <type:poison>, regardless of that state's specific id.
 *
 *  <extendType:low-effort>
 * This skill acts as an extension to every skill the caster knows that
 * carries <type:low-effort>, regardless of that skill's specific id.
 *
 * NOTE ABOUT CANDIDATE POOLS:
 * States draw type/id candidates from the battler's currently ACTIVE states
 * (including passive-injected ones). Skills draw candidates from the caster's
 * KNOWN/learned skills — a skill overlay never applies unless the caster has
 * actually learned it, same as id-based skill extension already worked.
 *
 * NOTE ABOUT RESOLUTION ORDER:
 * When a candidate pool has both type-based and id-based extension candidates
 * for the same base skill/state, type-based overlays are applied first (in
 * ascending id order), then id-based overlays are applied second (also
 * ascending id order) — id-based extensions win on conflict since they apply last.
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
 *  <onCastSelfStateIfAfflicted:[STATE_TO_APPLY,CHANCE,STATE_REQUIREMENT]>
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
 *  <onCastSelfStateIfAfflicted:[42,100,19]>
 * On cast, if the caster currently has state id 19 (STATE_REQUIREMENT) active,
 * apply state id 42 (STATE_TO_APPLY) to oneself at 100% chance. If the caster
 * does not have state 19, this tag does nothing- no roll occurs at all.
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
 * ON-HIT APPLY STATE (SKILL-SCOPED):
 * Have you ever wanted a specific skill to apply a state to its target with a
 * custom duration or stack count, rather than whatever the state's defaults are?
 * Well now you can! By applying the appropriate tag directly to the skill, you
 * can author exactly how long or how many stacks a state lands with on a
 * per-skill basis.
 *
 * NOTE 1:
 * CHANCE is an integer between 0 and 100. Target state resistances are still
 * respected — if the target cannot receive the state, it will not be applied
 * regardless of the chance roll.
 *
 * NOTE 2:
 * DURATION is in frames (60 frames = 1 second at 60fps). It replaces the state's
 * own jabsStateDurationFrames value as the BASE duration. Attacker duration-boost
 * tags (stateDurationFlat, stateDurationPerc, stateDurationFormula) still apply
 * on top of this overridden base, so passive gear and traits remain relevant.
 *
 * NOTE 3:
 * DURATION and STACKS are both optional. Omitting DURATION uses the state's own
 * default duration. Omitting STACKS uses the state's own default stack count.
 *
 * NOTE 4:
 * A skill may carry multiple <thisApplyState> tags to apply different states on
 * the same hit. Each entry is evaluated independently.
 *
 * NOTE 5:
 * If both <thisApplyState> and <applyState> target the same state id on the same
 * hit, <thisApplyState> fires last and wins.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <thisApplyState:[STATE_ID, CHANCE]>
 *  <thisApplyState:[STATE_ID, CHANCE, DURATION]>
 *  <thisApplyState:[STATE_ID, CHANCE, DURATION, STACKS]>
 * Where STATE_ID is the id of the state to apply to the target.
 * Where CHANCE is the percent chance between 0 and 100 that it triggers.
 * Where DURATION is the duration in frames; omit to use the state's default.
 * Where STACKS is the starting stack count; omit to use the state's default.
 *
 * TAG EXAMPLES:
 *  <thisApplyState:[8, 100, 240]>
 * On hit, always apply state id 8 for 240 frames (4 seconds at 60fps).
 *
 *  <thisApplyState:[8, 25]>
 * On hit, 25% chance to apply state id 8 using the state's own default duration.
 *
 *  <thisApplyState:[8, 50, 120, 2]>
 * On hit, 50% chance to apply state id 8 for 120 frames with 2 starting stacks.
 * ============================================================================
 * ON-HIT APPLY STATE (CASTER-WIDE):
 * Have you ever wanted a passive state, equipped item, or actor data to make
 * your attacks apply a state with custom duration or stacks on every hit?
 * Well now you can! The caster-wide variant reads from all of the attacker's
 * notes, so it can live anywhere — a poisoned-blade state, a cursed accessory,
 * or a base actor trait — and will fire whenever that battler lands a hit.
 *
 * NOTE 1:
 * All notes from the same section above apply here as well (CHANCE, DURATION,
 * STACKS behavior, resistances, etc.).
 *
 * NOTE 2:
 * If both <applyState> and <thisApplyState> target the same state id on the same
 * hit, <thisApplyState> fires last and wins.
 *
 * TAG USAGE:
 * - Skills, states, weapons, armors, actors, enemies, classes.
 *
 * TAG FORMAT:
 *  <applyState:[STATE_ID, CHANCE]>
 *  <applyState:[STATE_ID, CHANCE, DURATION]>
 *  <applyState:[STATE_ID, CHANCE, DURATION, STACKS]>
 * Where STATE_ID is the id of the state to apply to the target.
 * Where CHANCE is the percent chance between 0 and 100 that it triggers.
 * Where DURATION is the duration in frames; omit to use the state's default.
 * Where STACKS is the starting stack count; omit to use the state's default.
 *
 * TAG EXAMPLES:
 *  <applyState:[12, 100, 600]>
 * On every hit, always apply state id 12 for 600 frames (10 seconds at 60fps).
 *
 *  <applyState:[12, 30]>
 * On every hit, 30% chance to apply state id 12 with the state's default duration.
 * ============================================================================
 * TOGGLE STATE ON EXECUTE:
 * Have you ever wanted a "stance" skill — one that flips a state on when it's off,
 * and flips it off when it's on, using the same skill both ways? This tag does
 * exactly that: it fires once when the skill executes (not per-hit), checks
 * whether the caster currently has the tagged state, and toggles it.
 *
 * NOTE 1:
 * This fires once at press-time, the same as the on-cast self-state tags above —
 * it does not require (or care about) a successful hit against a target.
 *
 * NOTE 2:
 * There is no chance roll; this always triggers when the skill executes.
 *
 * NOTE 3:
 * A skill may carry multiple <toggleOnExecute> tags to flip several states in a
 * single execution. Each STATE_ID is evaluated independently: if the caster has
 * it, it's removed; if not, it's added.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <toggleOnExecute:STATE_ID>
 * Where STATE_ID is the id of the state to toggle on the caster.
 *
 * TAG EXAMPLES:
 *  <toggleOnExecute:12>
 * Executing this skill removes state id 12 from the caster if they have it,
 * or adds it if they don't — toggling a stance on/off with one skill.
 *
 *  <toggleOnExecute:12>
 *  <toggleOnExecute:13>
 * Executing this skill independently toggles both state id 12 and state id 13.
 * ============================================================================
 * CHANGELOG:
 * - 1.5.0
 *    Added <toggleOnExecute:STATE_ID> — a skill-scoped, press-time state toggle
 *    for stance-style skills (add if absent, remove if present). Repeatable.
 * - 1.4.1
 *    Fixed Game_Actor#hasSkill to compare by skill id rather than object reference.
 *    Vanilla uses includes($dataSkills[id]) which breaks the moment the overlay system
 *    returns a clone instead of the original database entry — hasSkill would always
 *    return false for any overlaid skill, silently blocking JABS action execution.
 *    Optimized OverlayManager#getExtendedSkill hot path: the per-caster cache is now
 *    checked before any array allocation, filter, sort, or string construction. Cache
 *    hits are O(1); the skillId alone is a stable key because the whole per-caster
 *    cache is invalidated wholesale on every learnSkill / forgetSkill call.
 * - 1.4.0
 *    Structural refactor of OverlayManager#getExtendedSkill: overlay candidates are now
 *    collected via caster.skillIds() (raw IDs, no skill()/skills() involvement) instead of
 *    caster.skills(). Removed the WeakSet re-entrancy guard. Each overlay id is now
 *    recursively resolved through getExtendedSkill before being applied, so chained
 *    extensions (A extends B extends C) produce a fully merged result at every level.
 *    A per-skillId WeakMap/Set circular-extension guard replaces the old caster-level guard;
 *    it throws a clear error on circular data rather than silently falling back.
 * - 1.3.0
 *    Lifted skill() override from Game_Actor to Game_Battler so enemies also
 *    receive overlay-merged skills when J-SkillExtend is loaded. Aliased
 *    Game_Actor#skills to map through this.skill(), making the plural form
 *    consistent with the singular for all consumers including the passive system.
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
	* The set of tag keys whose note lines are appended across extensions rather than replaced.
	* Plugins opt in by calling {@link registerNonCombiningKey} during Scene_Boot.
	* @type {Set<string>}
	*/
	#nonCombiningKeys = new Set();
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
		this.#nonCombiningKeys.add(J.BASE.Helpers.getKeyFromRegexp(regexp, asBoolean).toLowerCase());
	}
	/**
	* Gets all registered non-combining tag keys as an array.
	* @returns {string[]} The registered keys, all lowercase.
	*/
	getNonCombiningKeys() {
		return [...this.#nonCombiningKeys];
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
J.EXTEND.Metadata = new J_SkillExtendPluginMetadata("J-Extend", "1.4.1");
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
*  When DURATION is omitted, the state's own jabsStateDurationFrames value is used.
*  When STACKS is omitted, the state's own jabsStateStacksApplied value is used.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ThisApplyState = /<thisApplyState:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+){0,2}])>/gi;
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
*  When DURATION is omitted, the state's own jabsStateDurationFrames value is used.
*  When STACKS is omitted, the state's own jabsStateStacksApplied value is used.
* </pre>
* @type {RegExp}
*/
J.EXTEND.RegExp.ApplyState = /<applyState:[ ]?(\[\d+,[ ]?\d+(?:,[ ]?\d+){0,2}])>/gi;
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
		this._skillCache.invalidate(battler);
		this._stateCache.invalidate(battler);
	}
	/**
	* Clears the cache for all objects.
	*/
	static clearCache() {
		this._skillCache.clear();
		this._stateCache.clear();
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
		if (!caster) return $dataSkills[skillId];
		return this._skillCache.get(caster, String(skillId), () => {
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
		if (!battler) return $dataStates[stateId];
		return this._stateCache.get(battler, String(stateId), () => {
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
		if (overlaySkills.length === 0) {
			return $dataSkills[skillId];
		}
		const baseClone = $dataSkills[skillId]._clone();
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
		if (overlayStates.length === 0) return $dataStates[stateId];
		const baseClone = $dataStates[stateId]._clone();
		return overlayStates.reduce((working, overlay) => this.extendState(working, overlay), baseClone);
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
	* Merges the overlay note into the base note with key-aware behavior.
	* - For keys not registered as non-combining: replace base lines with overlay lines if overlay provides any.
	* - For keys registered as non-combining: append unique overlay lines after base lines.
	* - Unsupported lines (non-tag text) are preserved from both notes with deduplication; base lines keep priority.
	* Non-combining keys are registered via {@link J.EXTEND.Metadata.registerNonCombiningKey}.
	* Keys are case-insensitive. Tags are those enclosed with angle brackets (e.g., `<key:value>` or `<key>`).
	* @param {string} baseNote The base note content.
	* @param {string} overlayNote The overlay note content.
	* @returns {string} The merged note text, joined with newlines.
	*/
	static overwriteNote(baseNote, overlayNote) {
		const oldNote = baseNote || String.empty;
		const newNote = overlayNote || String.empty;
		const exclusions = J.EXTEND.Metadata.getNonCombiningKeys();
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
	const hasIdExtension = !!RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.Extend, true, true);
	const hasTypeExtension = !!RPGManager.getStringsFromNoteByRegex(this, J.EXTEND.RegExp.ExtendType, true);
	return hasIdExtension || hasTypeExtension;
} });
/**
* Gets all ids this database object targets via {@code <extend:[IDs]>}.
* Returns an empty array when the tag is absent.
* @type {number[]}
*/
Object.defineProperty(RPG_Base.prototype, "getExtensions", { get: function() {
	return RPGManager.getArrayFromNotesByRegex(this, J.EXTEND.RegExp.Extend, true);
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
	const casterEntries = RPGManager.getAllCapturesFromAllNotesByRegex(this.subject().getAllNotes(), J.EXTEND.RegExp.ApplyState);
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
	return RPGManager.getNumbersFromNoteByRegex(this.item(), J.EXTEND.RegExp.ToggleOnExecute);
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
* @param {RPG_UsableItem|RPG_EquipItem} obj The database row or custom object being bound.
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