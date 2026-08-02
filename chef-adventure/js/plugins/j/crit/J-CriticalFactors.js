//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.3.0 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-NaturalGrowth
 * @help
 * ============================================================================
 * This plugin enables the ability to control the multiplier of critical damage
 * based on a pair of tags.
 *
 * Integrates with others of mine plugins:
 * - J-SDP            (can earn CDM and CDR from panels)
 * - J-NaturalGrowths (can grow CDM and CDR via levels)
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This overwrites the "applyCritical()" function in its entirety and replaces
 * the functionality with two new parameters on battlers: cdm and cdr, which
 * are described below. One significant difference to note is that critical hit
 * damage is calculated and managed separately, allowing for a battler's CDR
 * parameter to mitigate the critical portion entirely while still taking the
 * base damage. Additionally, the base critical damage multiplier is reduced by
 * default, and is parameterized for your convenience- because lets face it:
 * triple damage for a crit is an awful lot for the default.
 *
 * ============================================================================
 * THIS ACTION CRITICAL MODIFIERS:
 * Have you ever wanted to modify the current action's critical chance and/or
 * modifier? Well now you can! By applying the appropriate tag to the database
 * objects in question, you can control the critical chance and critical
 * damage modifiers for a specific skill's execution!
 *
 * NOTE:
 * This stacks additively with other crit effects.
 *
 * NOTE:
 * The effects of these tags do not apply to skills that cannot crit, so be
 * sure to make certain the critical dropdown is set to "YES" in the damage
 * formula box for the given skill.
 *
 * Formula context:
 *   a = this action's subject (the attacker)
 *   b = 0 (unused; present for formula consistency)
 *   v = $gameVariables._data
 *
 * TAG USAGE:
 * - Items
 * - Skills
 *
 * TAG FORMAT:
 *  <thisCritChance:[FORMULA]>
 *  <thisCritMultiplier:[FORMULA]>
 *  <thisCritsAlways>
 *
 * TAG EXAMPLES:
 *  <thisCritChance:[25]>
 * Increases the critical chance of this particular skill by 25%.
 *
 *  <thisCritMultiplier:[10 + a.agi]>
 * Increases the critical damage multiplier by 10% plus the battler's agility.
 *
 *  <thisCritsAlways>
 * The skill or item with this tag will ALWAYS crit.
 *
 * ============================================================================
 * CRITICAL DAMAGE MULTIPLIER:
 * Have you ever wanted to have any amount of control over critical damage?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can now control how hard (or weak) a battler's crit will be!
 *
 * DETAILS:
 * Four new tags are available for use across the various applicable database
 * objects: two for base values, and two for adding onto the base. While you
 * can use any of the four on any of the database locations listed below, it
 * was designed so that the "base" tags would live on static objects, like the
 * actor itself, while the non-base tags would live everywhere else.
 *
 * The two base values have greater impact when used in the context of
 * "J-NaturalGrowths", as they are a new value that can be leveraged within
 * the formulas you write, allowing for complex buff/growth formulas revolving
 * around incoming/outgoing critical hit damage.
 *
 * NOTE:
 * If multiple tags are present on a single battler, then all tag amounts will
 * be added together for a single multiplier amount as seen in the examples.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <critMultiplierBase:NUM>
 *  <critMultiplier:NUM>
 * Where NUM is the amount to add to the battler's critical damage multiplier.
 *
 * TAG EXAMPLE(S):
 *  <critMultiplier:50>
 * Increases the outgoing critical damage multiplier by 50% for this battler.
 *
 *  <critMultiplier:10>
 *  <critMultiplier:40>
 *  <critMultiplier:150>
 * Increases the outgoing critical damage multiplier by 200% for this battler.
 *
 * ============================================================================
 * CRITICAL DAMAGE REDUCTION:
 * Have you ever regreted adding a ton of critical damage multipliers across
 * the various database locations and now need to counterbalance that somehow?
 * Well now you can! By applying the appropriate tag in various database
 * locations, you can now reduce the amount of damage received when an enemy
 * battler lands a critical hit!
 *
 * NOTE:
 * This reduces the amount of CRITICAL damage, and does not actually impact the
 * base damage that the critical hit is based on. See the overview details for
 * more information.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <critReductionBase:NUM>
 *  <critReduction:NUM>
 * Where NUM is the amount to add to the battler's critical damage reduction.
 *
 * TAG EXAMPLE(S):
 *  <critReduction:30>
 * Reduces critical damage against this battler by 30%.
 *
 *  <critReduction:10>
 *  <critReduction:30>
 *  <critReduction:80>
 * The three amounts above total to above 100. This means that this battler
 * will NOT take any bonus damage from critical hits. All critical hits will
 * be the same as non-critical hits. However, for the sake of other possible
 * effects, the attack will still be classified as a "critical hit".
 * ============================================================================
 * NATURAL GROWTH + CRITICAL DAMAGE MULTIPLIERS/REDUCTIONS:
 * Have you ever wanted to permanently grow your CDM/CDR stats along with your
 * other growths that you have setup because you're also using my
 *
 *        J-NaturalGrowth
 *
 * plugin? Well now you can! By taking advantage of the same builder-like
 * pattern already established by the natural growths plugin, you too can start
 * growing your CDR and CDM by flat or rate multipliers as you level up!
 *
 * NOTE ABOUT NATURAL "BUFFS" FOR CDM/CDR:
 * Unlike other natural buffs, cdm/cdr are not tracked and only used during the
 * calculation of a critical hit.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULA]>
 * Where (PARAM) is literally one of either "cdm" (crit damage multiplier) or
 * "ctr" (crit taken rate- internally this is the same stat the critReduction
 * tags above feed into, just spelled differently here for consistency with
 * how J-NaturalGrowths names its own tag families).
 * Where (BUFF|GROWTH) is literally one of either "Buff" or "Growth".
 * Where (PLUS|RATE) is literally one of either "Plus" or "Rate".
 * Where [FORMULA] is a real formula this time (unlike the thisCritChance/
 * thisCritMultiplier tags above)- it runs through the standard evaluator with:
 *   a = the battler these bonuses are being calculated for
 *   b = the battler's base value for this parameter (baseCriticalMultiplier()
 *       for cdm tags, baseCriticalReduction() for ctr tags- 0.5 by default
 *       for both)
 *   v = $gameVariables._data
 *
 * EXAMPLE:
 *  <cdmGrowthRate:[5]>
 * Gain +5% crit damage multiplier (cdm) per level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 *  <ctrBuffPlus:[25]>
 * Gain a flat 25 crit taken rate reduction (ctr) while this tag is applied to
 * this battler.
 * This would be lost if the object this tag lived on was removed.
 *
 *  <cdmGrowthPlus:[a.level * 3]>
 * Gain (the battler's level multiplied by 3) crit damage multiplier (cdm) per
 * level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 * Please refer to the other plugin's documentation for more details.
 * ============================================================================
 * ON-CRIT STATE APPLICATION:
 * Have you ever wanted a critical hit to do more than just deal extra damage?
 * Well now you can! By applying the appropriate tags to the relevant database
 * objects, you can configure states to be applied to the target or to the
 * attacker themselves whenever a critical hit lands — each with its own
 * independent chance to trigger.
 *
 * Two families of tags are available:
 *
 * "thisCrit" tags live on a specific skill or item and only fire when THAT
 * skill or item lands a critical hit. Think of these as per-skill effects.
 *
 * "onCrit" tags live on any note source attached to the attacker (states,
 * weapons, armors, class, actor, enemy) and fire whenever ANY of their
 * actions lands a critical hit. Think of these as passive crit behaviors —
 * ideal for mastery passive states that grant a character-wide on-crit effect.
 *
 * Both families are processed independently on every critical hit, so a
 * battler can carry both simultaneously without conflict.
 *
 * NOTE:
 * These effects require J-ABS to be loaded. The tags will be silently ignored
 * in non-JABS combat contexts.
 *
 * NOTE:
 * CHANCE is a whole-number percent from 0 to 100.
 * A CHANCE of 100 means the state is always applied on crit.
 * Multiple tags for the same state are each rolled independently.
 *
 * TAG USAGE:
 * "thisCrit" tags:
 * - Skills
 * - Items
 *
 * "onCrit" tags:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <thisCritApply:[STATE_ID, CHANCE]>
 *  <thisCritSelf:[STATE_ID, CHANCE]>
 *  <onCritApply:[STATE_ID, CHANCE]>
 *  <onCritSelf:[STATE_ID, CHANCE]>
 * Where STATE_ID is the id of the state to apply.
 * Where CHANCE is the percent chance (0–100) that the state applies on a crit.
 * "Apply" variants apply the state to the TARGET that was critically hit.
 * "Self" variants apply the state to the ATTACKER who landed the critical hit.
 *
 * TAG EXAMPLES:
 *  <thisCritApply:[5, 30]>
 * This skill has a 30% chance to apply state id 5 to the target when it crits.
 *
 *  <thisCritSelf:[12, 100]>
 * This skill always applies state id 12 to the attacker when it crits.
 *
 *  <onCritApply:[5, 25]>
 * Whenever this battler (or whatever carries this note) lands any critical hit,
 * there is a 25% chance to apply state id 5 to the target.
 * A passive mastery state with this tag would grant the effect for as long as
 * the state is active.
 *
 *  <onCritSelf:[20, 50]>
 * Whenever this battler lands any critical hit, there is a 50% chance to apply
 * state id 20 to themselves.
 *
 * ============================================================================
 * FORCING ON-CRIT PROCS:
 * Have you ever wanted an on-crit state application to land every single time,
 * no exceptions, without having to touch your Accumulate/Encore/luck systems
 * to get there? Well now you can! Applying this tag to the attacker's own note
 * sources forces every "thisCrit"/"onCrit" state-application roll from above
 * to succeed, as if the attacker had rolled a guaranteed positive result.
 *
 * NOTE:
 * This ONLY affects the on-crit state application roll (thisCritApply,
 * thisCritSelf, onCritApply, onCritSelf). It does not change whether the hit
 * itself crits, and it does not touch the attacker's real isVeryLucky() or
 * isVeryCursed() flags anywhere else- Accumulate Mode and Encore both still
 * read the attacker's real values and stack normally on top of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <forceCritProcs>
 *
 * TAG EXAMPLES:
 *  <forceCritProcs>
 * Any battler with this tag applied to one of their note sources will always
 * succeed their on-crit state application rolls- a mastery capstone state with
 * this tag turns an "onCritApply:[5, 25]" (25% chance) into a guaranteed
 * application on every critical hit, without inflating crit chance itself or
 * touching luck elsewhere.
 *
 * ============================================================================
 * CONDITIONAL CRITICAL CHANCE BY TARGET STATE:
 * Have you ever wanted a skill to crit more reliably — or guaranteed — when the
 * target is already afflicted with a specific state? Well now you can! By
 * applying the appropriate tags, you can add bonus crit chance that only applies
 * when the target has a specific state active.
 *
 * Two families of tags are available, mirroring the "thisCrit"/"onCrit" split:
 *
 * "thisCritChanceIfState" lives on a specific skill or item and only contributes
 * its bonus when THAT skill is the one being executed.
 *
 * "critChanceIfState" lives on any note source attached to the attacker (states,
 * weapons, armors, class, actor, enemy) and contributes its bonus whenever ANY
 * of their actions is executed against a matching target.
 *
 * NOTE:
 * BONUS_CHANCE is a whole-number percent from 0 to 100 (or higher for guaranteed).
 * A BONUS_CHANCE of 100 effectively guarantees a crit when the state is present,
 * though the target's crit evasion (cev) still applies.
 *
 * NOTE:
 * Multiple tags stack additively. If a skill carries two tags for different states,
 * and the target has both states, both bonuses are added to the crit chance.
 *
 * TAG USAGE:
 * "thisCritChanceIfState" tags:
 * - Skills
 * - Items
 *
 * "critChanceIfState" tags:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <thisCritChanceIfState:[STATE_ID, BONUS_CHANCE]>
 *  <critChanceIfState:[STATE_ID, BONUS_CHANCE]>
 * Where STATE_ID is the id of the state the target must have.
 * Where BONUS_CHANCE is the percent crit chance bonus (0–100+) to add.
 *
 * TAG EXAMPLES:
 *  <thisCritChanceIfState:[14, 100]>
 * This skill has guaranteed crit chance against targets afflicted with state 14.
 *
 *  <thisCritChanceIfState:[14, 50]>
 *  <thisCritChanceIfState:[7, 50]>
 * This skill gains +50% crit chance if the target has state 14, another +50%
 * if the target has state 7. If both are present, the bonus totals +100%.
 *
 *  <critChanceIfState:[14, 30]>
 * While this note source is active on the attacker, all of their actions gain
 * +30% crit chance against targets afflicted with state 14. Useful on passive
 * mastery states to reward building into a specific debuff.
 *
 * ============================================================================
 * CONDITIONAL CRITICAL CHANCE BY TARGET STATE TYPE:
 * The same as the state-id variants above, but matching by type classifier
 * (the <type:TYPE> tag on states) rather than a specific state id. This lets
 * you say "any bleed" instead of "specifically state 15."
 *
 * NOTE:
 * The type comparison is case-insensitive.
 *
 * TAG USAGE:
 * "thisCritChanceIfStateType" tags:
 * - Skills
 * - Items
 *
 * "critChanceIfStateType" tags:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <thisCritChanceIfStateType:[TYPE, BONUS_CHANCE]>
 *  <critChanceIfStateType:[TYPE, BONUS_CHANCE]>
 * Where TYPE is the state type classifier string (case-insensitive).
 * Where BONUS_CHANCE is the percent crit chance bonus (0–100+) to add.
 *
 * TAG EXAMPLES:
 *  <thisCritChanceIfStateType:[bleed, 100]>
 * This skill has guaranteed crit chance against targets with any state typed "bleed".
 *
 *  <critChanceIfStateType:[bleed, 50]>
 * While this note source is active, all actions gain +50% crit chance against
 * targets with any state typed "bleed".
 *
 * ============================================================================
 * GUARANTEED CRITICAL HIT BY TARGET STATE:
 * Have you ever wanted a skill to always crit against a target that has a
 * specific state — without needing to route through the chance system? Well
 * now you can! By applying the appropriate tags, you can guarantee a critical
 * hit when the target has any one of the listed states active.
 *
 * Two families of tags are available, mirroring the "thisCrit"/"crit" split:
 *
 * "thisCritsAlwaysIfState" lives on a specific skill or item and only triggers
 * for THAT skill's execution.
 *
 * "critAlwaysIfState" lives on any note source attached to the attacker and
 * triggers for ALL of their actions.
 *
 * NOTE:
 * Each tag accepts one or more state IDs. The crit is guaranteed if the target
 * has ANY of the listed states active — you do not need all of them.
 *
 * NOTE:
 * Multiple tags stack via OR — if any tag's state list contains a state the
 * target has, the crit is guaranteed.
 *
 * NOTE:
 * A guaranteed crit from these tags bypasses the target's crit evasion (cev),
 * exactly like {@link thisCritsAlways}.
 *
 * TAG USAGE:
 * "thisCritsAlwaysIfState" tags:
 * - Skills
 * - Items
 *
 * "critAlwaysIfState" tags:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <thisCritsAlwaysIfState:[STATE_ID, ...]>
 *  <critAlwaysIfState:[STATE_ID, ...]>
 * Where STATE_ID is one or more state ids (comma-separated) to check on the target.
 *
 * TAG EXAMPLES:
 *  <thisCritsAlwaysIfState:[14]>
 * This skill always crits against targets afflicted with state 14.
 *
 *  <thisCritsAlwaysIfState:[14, 7]>
 * This skill always crits against targets afflicted with state 14 OR state 7.
 *
 *  <critAlwaysIfState:[14]>
 * While this note source is active on the attacker, all of their actions always
 * crit against targets afflicted with state 14.
 *
 * ============================================================================
 * GUARANTEED CRITICAL HIT BY TARGET STATE TYPE:
 * The same as the state-id guaranteed-crit variants above, but matching by
 * type classifier rather than a specific state id.
 *
 * NOTE:
 * The type comparison is case-insensitive.
 *
 * TAG USAGE:
 * "thisCritsAlwaysIfStateType" tags:
 * - Skills
 * - Items
 *
 * "critAlwaysIfStateType" tags:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <thisCritsAlwaysIfStateType:TYPE>
 *  <critAlwaysIfStateType:TYPE>
 * Where TYPE is the state type classifier string (case-insensitive).
 *
 * TAG EXAMPLES:
 *  <thisCritsAlwaysIfStateType:bleed>
 * This skill always crits against targets with any state typed "bleed".
 *
 *  <critAlwaysIfStateType:bleed>
 * While this note source is active, all actions always crit against targets
 * with any state typed "bleed".
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.3.0
 *    Added <forceCritProcs> to force every on-crit state application roll
 *    to succeed, without inflating crit chance or touching luck elsewhere.
 *    Added conditional crit chance bonuses vs a target's active state, by
 *    id (<thisCritChanceIfState>/<critChanceIfState>) or by type
 *    classifier (<thisCritChanceIfStateType>/<critChanceIfStateType>).
 *    Added guaranteed crits vs a target's active state, by id
 *    (<thisCritsAlwaysIfState>/<critAlwaysIfState>) or by type classifier
 *    (<thisCritsAlwaysIfStateType>/<critAlwaysIfStateType>); bypasses cev
 *    the same way <thisCritsAlways> does.
 * - 1.2.0
 *    Added plugin parameters for the base CDM/CTR defaults (previously a
 *    hard-coded, unreachable 50% baked into Game_BattlerBase).
 * - 1.1.0
 *    Added on-crit state application tags:
 *    <thisCritApply>, <thisCritSelf> (skill-scoped) and
 *    <onCritApply>, <onCritSelf> (attacker-global, any note source).
 * - 1.0.2
 *    Added dependency note about NaturalGrowth.
 *    Added ordering annotation for coming after J-NaturalGrowth.
 * - 1.0.1
 *    Fixed issue where CDM and CDR were not being calculated for SDP bonuses.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param critMultiplierBaseDefault
 * @type number
 * @decimals 2
 * @min 0
 * @text Base Critical Damage Multiplier
 * @desc The default bonus critical damage (%) for battlers with no <critMultiplierBase> tags. 50 = +50% (x1.5 total).
 * @default 50.00
 *
 * @param critReductionBaseDefault
 * @type number
 * @decimals 2
 * @min 0
 * @text Base Critical Damage Reduction
 * @desc The default critical damage reduction (%) for battlers with no <critReductionBase> tags. 50 = -50% of the bonus.
 * @default 50.00
 */

//#region src/plugins/crit/core/_metadata/_pluginMetadata.js
var J_CriticalFactorsPluginMetadata = class J_CriticalFactorsPluginMetadata extends PluginMetadata {
	/**
	* The factor used for critical damage multiplication when the plugin parameter is absent or
	* unreadable. This is a static rather than a field initializer on purpose: the parent
	* constructor reaches `initializeMetadata` before any subclass field initializer has run, so a
	* field would still be `undefined` at the moment the fallback is needed - and would then
	* overwrite the parsed result on its way in.
	* @type {number}
	*/
	static #DEFAULT_CDM_FACTOR = .5;
	/**
	* The factor used for critical damage reduction when the plugin parameter is absent or
	* unreadable. Static for the same reason as {@link #DEFAULT_CDM_FACTOR}.
	* @type {number}
	*/
	static #DEFAULT_CTR_FACTOR = .5;
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		const { parsedPluginParameters: p } = this;
		/**
		* The default critical damage multiplier factor applied to every battler that carries no
		* `<critMultiplierBase:NUM>` notetags. A percent-point value (e.g. `50` becomes `0.5`).
		* @type {number}
		*/
		this.baseCdmFactor = J_CriticalFactorsPluginMetadata.#parsePercentFactorOr(p["critMultiplierBaseDefault"], J_CriticalFactorsPluginMetadata.#DEFAULT_CDM_FACTOR);
		/**
		* The default critical damage reduction factor applied to every battler that carries no
		* `<critReductionBase:NUM>` notetags. A percent-point value (e.g. `50` becomes `0.5`).
		* @type {number}
		*/
		this.baseCtrFactor = J_CriticalFactorsPluginMetadata.#parsePercentFactorOr(p["critReductionBaseDefault"], J_CriticalFactorsPluginMetadata.#DEFAULT_CTR_FACTOR);
	}
	/**
	* Parses a percent-point plugin parameter (e.g. `"50.00"`) into its `/100` factor.
	* @param {string|number|undefined|null} value The raw plugin parameter value.
	* @param {number} fallback The fallback factor to use when the value is absent or invalid.
	* @returns {number}
	*/
	static #parsePercentFactorOr(value, fallback) {
		if (value === undefined || value === null || value === "") {
			return fallback;
		}
		const parsed = Number.parseFloat(value);
		if (!Number.isFinite(parsed)) {
			return fallback;
		}
		return parsed / 100;
	}
};

//#endregion
//#region src/plugins/crit/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CRIT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CRIT.Metadata = new J_CriticalFactorsPluginMetadata("J-CriticalFactors", "1.3.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.CRIT.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_BattlerBase: new Map(),
	Game_Enemy: new Map(),
	IconManager: new Map(),
	TextManager: new Map(),
	Window_SDP_Details: new Map(),
	Scene_Boot: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.CRIT.RegExp = {
	ThisCritDamageChance: /<thisCritChance:\[([+\-*/ ().\w]+)]>/gi,
	ThisCritDamageMultiplier: /<thisCritMultiplier:\[([+\-*/ ().\w]+)]>/gi,
	ThisCritsAlways: /<thisCritsAlways>/gi,
	ThisCritChanceIfState: /<thisCritChanceIfState:(\[\d+,[ ]?\d+])>/gi,
	ThisCritChanceIfStateType: /<thisCritChanceIfStateType:(\[[a-zA-Z][a-zA-Z0-9_-]*,[ ]?\d+])>/gi,
	ThisCritsAlwaysIfState: /<thisCritsAlwaysIfState:(\[\d+(?:,[ ]?\d+)*])>/gi,
	ThisCritsAlwaysIfStateType: /<thisCritsAlwaysIfStateType:([a-zA-Z][a-zA-Z0-9_-]*)>/gi,
	ThisCritApply: /<thisCritApply:[ ]?(\[\d+,[ ]?\d+])>/gi,
	ThisCritSelf: /<thisCritSelf:[ ]?(\[\d+,[ ]?\d+])>/gi,
	CritChanceIfState: /<critChanceIfState:(\[\d+,[ ]?\d+])>/gi,
	CritChanceIfStateType: /<critChanceIfStateType:(\[[a-zA-Z][a-zA-Z0-9_-]*,[ ]?\d+])>/gi,
	CritAlwaysIfState: /<critAlwaysIfState:(\[\d+(?:,[ ]?\d+)*])>/gi,
	CritAlwaysIfStateType: /<critAlwaysIfStateType:([a-zA-Z][a-zA-Z0-9_-]*)>/gi,
	OnCritApply: /<onCritApply:[ ]?(\[\d+,[ ]?\d+])>/gi,
	OnCritSelf: /<onCritSelf:[ ]?(\[\d+,[ ]?\d+])>/gi,
	ForceCritProcs: /<forceCritProcs>/i,
	CritDamageReductionBase: /<critReductionBase: ?(\d+)>/gi,
	CritDamageReduction: /<critReduction: ?(\d+)>/gi,
	CritDamageMultiplierBase: /<critMultiplierBase: ?(\d+)>/gi,
	CritDamageMultiplier: /<critMultiplier: ?(\d+)>/gi,
	CritTakenRateBuffPlus: /<ctrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateBuffRate: /<ctrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateGrowthPlus: /<ctrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateGrowthRate: /<ctrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffPlus: /<cdmBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffRate: /<cdmBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthPlus: /<cdmGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthRate: /<cdmGrowthRate:\[([+\-*/ ().\w]+)]>/gi
};

//#endregion
//#region src/plugins/crit/core/database/RPG_BaseItem.js
/**
* The conditional crit chance bonuses on this note source, keyed by target state id.
* Each entry is a [stateId, bonusChance] pair — the bonus applies to all actions executed
* by the attacker when the target has the specified state active.
* Covers actors, classes, skills, weapons, armors, enemies, and states.
* @type {[number, number][]|null}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critChanceIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritChanceIfState);
} });
/**
* The conditional crit chance bonuses on this note source, keyed by state type classifier.
* Each entry is a [type, bonusChance] pair — the bonus applies to all actions executed by
* the attacker when the target has any active state carrying the specified type classifier.
* @type {[string, number][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critChanceIfStateTypes", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritChanceIfStateType);
} });
/**
* The flat list of state ids that guarantee a critical hit for all actions while this note
* source is active on the attacker, when the target has any one of them active.
* Aggregated across all <critAlwaysIfState> tags on this note source.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critAlwaysIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritAlwaysIfState).flat();
} });
/**
* The list of state type classifiers that guarantee a critical hit for all actions while this
* note source is active on the attacker, when the target has any active state carrying one of them.
* @type {string[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critAlwaysIfStateTypes", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.CRIT.RegExp.CritAlwaysIfStateType);
} });

//#endregion
//#region src/plugins/crit/core/database/RPG_Skill.js
/**
* The conditional crit chance bonuses for this skill, keyed by target state id.
* Each entry is a [stateId, bonusChance] pair — the bonus applies only when the
* target has the specified state active at the time this skill is executed.
* @type {[number, number][]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritChanceIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritChanceIfState);
} });
/**
* The conditional crit chance bonuses for this skill, keyed by state type classifier.
* Each entry is a [type, bonusChance] pair — the bonus applies when the target has any
* active state carrying the specified type classifier.
* @type {[string, number][]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritChanceIfStateTypes", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritChanceIfStateType);
} });
/**
* The flat list of state ids that guarantee a critical hit for this skill when the target
* has any one of them active. Aggregated across all <thisCritsAlwaysIfState> tags on this skill.
* @type {number[]}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritsAlwaysIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritsAlwaysIfState).flat();
} });
/**
* The list of state type classifiers that guarantee a critical hit for this skill when the
* target has any active state carrying one of them.
* @type {string[]}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritsAlwaysIfStateTypes", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.CRIT.RegExp.ThisCritsAlwaysIfStateType);
} });

//#endregion
//#region src/plugins/crit/core/managers/IconManager.js
/**
* Gets the icon index for the critical damage parameters.
* @param {number} paramId The id of the crit param to get an icon index for.
* @returns {number}
*/
IconManager.critParam = function(paramId) {
	switch (paramId) {
		case 0: return 976;
		case 1: return 977;
	}
};

//#endregion
//#region src/plugins/crit/core/managers/TextManager.js
/**
* Gets the text for the critical damage parameters from "J-CriticalFactors".
* @param {number} paramId The id of the crit param to get a name for.
* @returns {string} The name of the parameter.
*/
TextManager.critParam = function(paramId) {
	switch (paramId) {
		case 0: return "Crit Amp";
		case 1: return "Crit Block";
	}
};
/**
* Gets the description text for the critical damage parameters.
* @param {number} paramId The id of the crit param to get a description for.
* @returns {string[]}
*/
TextManager.critParamDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The numeric value to the intensity of one's critical hits.", "Higher amounts of this yield bigger critical hits."];
		case 1: return ["The numeric value to one's percent reduction of critical damage.", "Enemy critical amp is directly reduced by this amount."];
	}
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Action.js
/**
* Extends the `initialize()` function to include initializing our new target tracker.
* Note that the target tracker will remain null on this action until after our custom logic
* within `apply()` has been executed (before aliased function logic).
*/
J.CRIT.Aliased.Game_Action.set("initialize", Game_Action.prototype.initialize);
Game_Action.prototype.initialize = function(subject, forcing) {
	J.CRIT.Aliased.Game_Action.get("initialize").call(this, subject, forcing);
	/**
	* The target of this action.
	* This remains null until the `apply()` function is executed.
	* @type {Game_Actor|Game_Enemy|null}
	*/
	this._targetBattler = null;
};
/**
* Sets the target battler of this action.
* This is primarily used in functions that do not normally have access to the target,
* such as the `applyCritical()` function.
* @param {Game_Actor|Game_Enemy|null} targetBattler The target of this action.
*/
Game_Action.prototype.setTargetBattler = function(targetBattler) {
	this._targetBattler = targetBattler;
};
/**
* Gets the current target of this action.
* This will always yield `null` if this is accessed before `apply()` has started running.
* @returns {Game_Actor|Game_Enemy|null}
*/
Game_Action.prototype.targetBattler = function() {
	return this._targetBattler;
};
/**
* Extends {@link #apply}.<br/>
* Tracks the target for use in critical calculations, then fires any on-crit state effects
* when the result confirms a critical hit landed.
*/
J.CRIT.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	this.setTargetBattler(target);
	J.CRIT.Aliased.Game_Action.get("apply").call(this, target);
	if (target.result().critical) {
		this.applyOnCriticalStateEffects(target);
	}
};
/**
* Applies all on-crit state effects — states to the target and states to self — from both
* the executing skill and any global crit tags present anywhere on the attacker.
* Guarded by J-ABS availability since on-chance effects depend on {@link JABS_OnChanceEffect}.
* @param {Game_Actor|Game_Enemy} target The target that received the critical hit.
*/
Game_Action.prototype.applyOnCriticalStateEffects = function(target) {
	if (!J.ABS) return;
	this.applyOnCriticalTargetStates(target);
	this.applyOnCriticalSelfStates();
};
/**
* Rolls and applies all on-crit states that target the enemy that was just critically hit.
* Checks both the executing skill ({@link thisCritApply}) and all attacker notes ({@link onCritApply}).
* @param {Game_Actor|Game_Enemy} target The target to apply states to.
*/
Game_Action.prototype.applyOnCriticalTargetStates = function(target) {
	this.rollAndApplyCritStates(target, this.thisCritTargetStates());
	this.rollAndApplyCritStates(target, this.onCritTargetStates());
};
/**
* Rolls and applies all on-crit states that target the attacker themselves.
* Checks both the executing skill ({@link thisCritSelf}) and all attacker notes ({@link onCritSelf}).
*/
Game_Action.prototype.applyOnCriticalSelfStates = function() {
	const attacker = this.subject();
	this.rollAndApplyCritStates(attacker, this.thisCritSelfStates());
	this.rollAndApplyCritStates(attacker, this.onCritSelfStates());
};
/**
* Iterates a list of on-chance effects and applies any that pass their roll to the recipient.
* @param {Game_Actor|Game_Enemy} recipient The battler receiving the state applications.
* @param {JABS_OnChanceEffect[]} onChanceEffects The effects to roll and apply.
*/
Game_Action.prototype.rollAndApplyCritStates = function(recipient, onChanceEffects) {
	if (onChanceEffects.length === 0) return;
	const attacker = this.subject();
	onChanceEffects.forEach((effect) => {
		const skill = effect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = recipient.getNegativeRolls();
		const positiveRoller = attacker.isForceCritProcs() ? {
			isVeryLucky: () => true,
			isVeryCursed: () => false,
			isAccumulating: () => attacker.isAccumulating(),
			getEncoreRepeats: () => attacker.getEncoreRepeats()
		} : attacker;
		const procCount = effect.resolveProcCount(positiveRolls, negativeRolls, positiveRoller);
		for (let i = 0; i < procCount; i++) {
			recipient.addState(effect.skillId, attacker, skill);
		}
	});
};
/**
* Gets all on-crit target states sourced from the executing skill only.
* Uses the {@link thisCritApply} tag — independent of what the attacker has globally.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.thisCritTargetStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects([this.item()], J.CRIT.RegExp.ThisCritApply);
};
/**
* Gets all on-crit self states sourced from the executing skill only.
* Uses the {@link thisCritSelf} tag — independent of what the attacker has globally.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.thisCritSelfStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects([this.item()], J.CRIT.RegExp.ThisCritSelf);
};
/**
* Gets all on-crit target states sourced from anywhere on the attacker.
* Uses the {@link onCritApply} tag — fires whenever any crit lands, regardless of the skill used.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCritTargetStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects(this.subject().getAllNotes(), J.CRIT.RegExp.OnCritApply);
};
/**
* Gets all on-crit self states sourced from anywhere on the attacker.
* Uses the {@link onCritSelf} tag — fires whenever any crit lands, regardless of the skill used.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCritSelfStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects(this.subject().getAllNotes(), J.CRIT.RegExp.OnCritSelf);
};
/**
* Overwrites {@link #applyCritical}.<br/>
* Replaces the way critical damage is calculated by
* adding multiplier and reduction modifiers for actors and enemies alike.
* @param {number} baseDamage The base damage before crit modification.
* @returns {number} The critically modified damage.
*/
Game_Action.prototype.applyCritical = function(baseDamage) {
	const criticalBonusDamage = this.applyCriticalDamageMultiplier(baseDamage);
	const reducedCriticalBonusDamage = this.applyCriticalDamageReduction(criticalBonusDamage);
	return baseDamage + reducedCriticalBonusDamage;
};
/**
* Calculates the amount of critical damage to add onto the base damage.
* @param {number} baseDamage The base damage before crit modification.
* @returns {number} The amount of critical damage to add onto the base.
*/
Game_Action.prototype.applyCriticalDamageMultiplier = function(baseDamage) {
	const attacker = this.subject();
	let critMultiplier = attacker.baseCriticalMultiplier();
	critMultiplier += attacker.cdm;
	critMultiplier += this.ownCriticalDamageMultiplier();
	return baseDamage * critMultiplier;
};
/**
* Calculates the amount of critical damage that will be removed from the bonus crit damage.
* @param {number} criticalDamage The critical damage to be added.
* @returns {number} The amount of critical damage after mitigations.
*/
Game_Action.prototype.applyCriticalDamageReduction = function(criticalDamage) {
	const defender = this.targetBattler();
	if (!defender) return criticalDamage;
	const baseCriticalReductionRate = 1 - defender.ctr;
	const criticalReductionRate = Math.max(baseCriticalReductionRate, 0);
	return criticalDamage * criticalReductionRate;
};
/**
* Overwrites {@link #itemCri}.<br/>
* Includes the addition of potential action-based crit rate boosts.
* @param {Game_Battler} target The target being struck with the critical.
* @returns {number} The calculated critical chance of this action.
*/
Game_Action.prototype.itemCri = function(target) {
	if (!this.item().damage.critical) return 0;
	if (this.isGuaranteedCrit()) return 9999;
	if (this.isGuaranteedCritVsTarget(target)) return 9999;
	let critChance = this.subject().cri;
	critChance += this.ownCriticalChanceBonus();
	critChance += this.thisCritChanceIfStateBonus(target);
	critChance += this.critChanceIfStateBonus(target);
	critChance -= target.cev;
	return Math.max(critChance, 0);
};
/**
* Calculates this action's own bonus to crit damage multipliers.
* Formula context: `a` is this action's subject (the attacker), `b` is 0 (no meaningful
* per-skill base value to expose), `v` is `$gameVariables._data`.
* @returns {number}
*/
Game_Action.prototype.ownCriticalDamageMultiplier = function() {
	return RPGManager.getResultsFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageMultiplier, 0, this.subject()) / 100;
};
/**
* Checks if this action is an unconditional guaranteed critical hit.
* @returns {boolean}
*/
Game_Action.prototype.isGuaranteedCrit = function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this.item(), J.CRIT.RegExp.ThisCritsAlways);
};
/**
* Checks if the target's current states trigger a guaranteed critical hit for this action.
* Checks both the skill's own {@link thisCritsAlwaysIfState} tags and the attacker's global
* {@link critAlwaysIfState} tags across all note sources.
* @param {Game_Battler} target The target being struck.
* @returns {boolean} True if the target has any state that guarantees a crit, false otherwise.
*/
Game_Action.prototype.isGuaranteedCritVsTarget = function(target) {
	const skillStateIds = this.item().thisCritsAlwaysIfStates;
	if (skillStateIds.some((stateId) => target.isStateAffected(stateId))) return true;
	const skillStateTypes = this.item().thisCritsAlwaysIfStateTypes;
	if (skillStateTypes.some((type) => this.targetHasActiveStateType(target, type))) return true;
	const globalStateIds = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critAlwaysIfStates);
	if (globalStateIds.some((stateId) => target.isStateAffected(stateId))) return true;
	const globalStateTypes = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critAlwaysIfStateTypes);
	return globalStateTypes.some((type) => this.targetHasActiveStateType(target, type));
};
/**
* Calculates this action's own bonus to crit chance.
* Formula context: `a` is this action's subject (the attacker), `b` is 0 (no meaningful
* per-skill base value to expose), `v` is `$gameVariables._data`.
* @returns {number}
*/
Game_Action.prototype.ownCriticalChanceBonus = function() {
	return RPGManager.getResultsFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageChance, 0, this.subject()) / 100;
};
/**
* Calculates the conditional crit chance bonus from this skill's own state-gated tags.
* Reads all {@link thisCritChanceIfState} pairs on the executing skill and sums the bonus
* for each pair whose state the target currently has active.
* @param {Game_Battler} target The target being struck.
* @returns {number} The total conditional bonus as a 0–1 rate addend.
*/
Game_Action.prototype.thisCritChanceIfStateBonus = function(target) {
	const pairs = this.item().thisCritChanceIfStates;
	if (!pairs.length) return 0;
	const stateIdBonus = pairs.reduce((total, [stateId, bonusChance]) => {
		return total + (target.isStateAffected(stateId) ? bonusChance / 100 : 0);
	}, 0);
	const typePairs = this.item().thisCritChanceIfStateTypes;
	const stateTypeBonus = typePairs.reduce((total, [type, bonusChance]) => {
		return total + (this.targetHasActiveStateType(target, type) ? bonusChance / 100 : 0);
	}, 0);
	return stateIdBonus + stateTypeBonus;
};
/**
* Calculates the conditional crit chance bonus from the attacker's global state-gated tags.
* Reads all {@link critChanceIfState} pairs from every note source on the attacker and sums
* the bonus for each pair whose state the target currently has active.
* @param {Game_Battler} target The target being struck.
* @returns {number} The total conditional bonus as a 0–1 rate addend.
*/
Game_Action.prototype.critChanceIfStateBonus = function(target) {
	const allPairs = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critChanceIfStates);
	if (!allPairs.length) return 0;
	const stateIdBonus = allPairs.reduce((total, [stateId, bonusChance]) => {
		return total + (target.isStateAffected(stateId) ? bonusChance / 100 : 0);
	}, 0);
	const allTypePairs = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critChanceIfStateTypes);
	const stateTypeBonus = allTypePairs.reduce((total, [type, bonusChance]) => {
		return total + (this.targetHasActiveStateType(target, type) ? bonusChance / 100 : 0);
	}, 0);
	return stateIdBonus + stateTypeBonus;
};
/**
* Checks whether the target has any active state carrying the specified type classifier.
* The comparison is case-insensitive.
* @param {Game_Battler} target The target whose active states are checked.
* @param {string} type The type classifier to look for.
* @returns {boolean} True if any active state on the target carries this type.
*/
Game_Action.prototype.targetHasActiveStateType = function(target, type) {
	return target.states().some((state) => state.types().some((stateType) => stateType.toLowerCase() === type.toLowerCase()));
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Actor.js
/**
* Extend `.applyNaturalCustomGrowths()` to include our cdm/ctr growths.
*/
J.CRIT.Aliased.Game_Actor.set("applyNaturalCustomGrowths", Game_Actor.prototype.applyNaturalCustomGrowths);
Game_Actor.prototype.applyNaturalCustomGrowths = function() {
	J.CRIT.Aliased.Game_Actor.get("applyNaturalCustomGrowths").call(this);
	if (!J.NATURAL) return;
	this.applyNaturalCdmGrowths();
	this.applyNaturalCtrGrowths();
};
/**
* Applies the natural CDM growths to this battler.
*/
Game_Actor.prototype.applyNaturalCdmGrowths = function() {
	const [, , growthPlusStructure, growthRateStructure] = this.getNaturalGrowthsRegexForCrit();
	const baseCdm = this.baseCriticalMultiplier();
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCdm);
	this.modCdmPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseCdm);
	this.modCdmRate(growthRate);
};
/**
* Applies the natural CTR growths to this battler.
*/
Game_Actor.prototype.applyNaturalCtrGrowths = function() {
	const [growthPlusStructure, growthRateStructure, ,] = this.getNaturalGrowthsRegexForCrit();
	const baseCtr = this.baseCriticalReduction();
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCtr);
	this.modCtrPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseCtr);
	this.modCtrRate(growthRate);
};
/**
* Gets the various regular expressions used for getting CDM/CTR growth values.
* @returns {[RegExp,RegExp,RegExp,RegExp]}
*/
Game_Actor.prototype.getNaturalGrowthsRegexForCrit = function() {
	return [
		J.CRIT.RegExp.CritTakenRateGrowthPlus,
		J.CRIT.RegExp.CritTakenRateGrowthRate,
		J.CRIT.RegExp.CritDamageMultiplierGrowthPlus,
		J.CRIT.RegExp.CritDamageMultiplierGrowthRate
	];
};
/**
* Gets all SDP bonuses for the given crit parameter id.
* @param {number} critParamId The id of the crit parameter.
* @param {number} baseParam The base value of the crit parameter in question.
* @returns {number}
*/
Game_Actor.prototype.critSdpBonuses = function(critParamId, baseParam) {
	const parameterKey = critParamId === 0 ? "cdm" : "ctr";
	return this.getSdpBonusForParameterKey(parameterKey, baseParam);
};

//#endregion
//#region src/plugins/crit/core/core/registerCritParameters.js
/**
* Boot-time registration for J-Crit parameters in {@link ParameterRegistry}.
*/
var CritParameterRegistration = class {
	/**
	* Registers CDM and CTR with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("cdm").group(ParameterGroups.PRECISION).sortOrder(6).label(() => TextManager.critParam(0)).description(() => TextManager.critParamDescription(0)).iconIndex(() => IconManager.critParam(0)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.cdm).sdpBinding(SdpParameterBinding.byKey("cdm", (actor) => actor.baseCriticalMultiplier())).build());
		ParameterRegistry.register(ParameterDefinition.Builder().key("ctr").group(ParameterGroups.PRECISION).sortOrder(7).label(() => TextManager.critParam(1)).description(() => TextManager.critParamDescription(1)).iconIndex(() => IconManager.critParam(1)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.ctr).sdpBinding(SdpParameterBinding.byKey("ctr", (actor) => actor.baseCriticalReduction())).build());
	}
};

//#endregion
//#region src/plugins/crit/core/objects/Game_BattlerBase.js
Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	* The battler's critical damage multiplier.
	* Critical hits are multiplied by this amount to determine the total critical hit damage.
	* @type {number}
	*/
	cdm: {
		get: function() {
			return this.criticalDamageMultiplier();
		},
		configurable: true
	},
	/**
	* The battler's critical taken rate.
	* Critical hit damage is reduced by this percent before being applied.
	* @type {number}
	*/
	ctr: {
		get: function() {
			return this.criticalDamageReduction();
		},
		configurable: true
	}
});
/**
* The base critical damage multiplier.
* A battler's critical damage multiplier acts as the base bonus multiplier for all
* critical hits. The individual battler's `cdm` is added to this amount to calculate
* the damage a critical hit can potentially deal.
* Sourced from the plugin parameter so designers can retune the default without
* touching code- see {@link J_CriticalFactorsPluginMetadata#baseCdmFactor}.
* @returns {number} The base multiplier for this battler.
*/
Game_BattlerBase.prototype.baseCriticalMultiplier = function() {
	return J.CRIT.Metadata.baseCdmFactor;
};
/**
* Gets the multiplier for this battler's critical hits.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageMultiplier = function() {
	return 0;
};
/**
* The base critical taken rate.
* A battler's critical taken rate acts as the base crit reduction for all incoming
* critical hits. The individual battler's `ctr` is added to this amount to calculate
* the damage a critical hit can potentially deal.
* Sourced from the plugin parameter so designers can retune the default without
* touching code- see {@link J_CriticalFactorsPluginMetadata#baseCtrFactor}.
* @returns {number} The base reduction for this battler.
*/
Game_BattlerBase.prototype.baseCriticalReduction = function() {
	return J.CRIT.Metadata.baseCtrFactor;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageReduction = function() {
	return 0;
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Battler.js
/**
* Extends `.initNaturalGrowthParameters()` to include the new critical damage parameters as growth-ready.
*/
J.CRIT.Aliased.Game_Battler.set("initNaturalGrowthParameters", Game_Battler.prototype.initNaturalGrowthParameters);
Game_Battler.prototype.initNaturalGrowthParameters = function() {
	if (!J.NATURAL) return;
	J.CRIT.Aliased.Game_Battler.get("initNaturalGrowthParameters").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with natural growth.
	*/
	this._j._natural ||= {};
	/**
	* The permanent flat bonus for CDM.
	* @type {number}
	*/
	this._j._natural._cdmPlus = 0;
	/**
	* The permanent multiplier bonus for CDR.
	* @type {number}
	*/
	this._j._natural._cdmRate = 0;
	/**
	* The permanent flat bonus for CTR.
	* @type {number}
	*/
	this._j._natural._ctrPlus = 0;
	/**
	* The permanent multiplier bonus for CTR.
	* @type {number}
	*/
	this._j._natural._ctrRate = 0;
};
/**
* Gets the permanent flat bonus for CDM.
* @returns {number}
*/
Game_Battler.prototype.cdmPlus = function() {
	return this._j._natural._cdmPlus;
};
/**
* Modifies the permanent flat bonus for CDM.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdmPlus = function(amount) {
	this._j._natural._cdmPlus += amount;
};
/**
* Gets the permanent multiplicative bonus for CDM.
* @returns {number}
*/
Game_Battler.prototype.cdmRate = function() {
	return this._j._natural._cdmRate;
};
/**
* Modifies the permanent multiplicative bonus for CDM.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdmRate = function(amount) {
	this._j._natural._cdmRate += amount;
};
/**
* Gets the current growths applied to CTR plus.
* @returns {number}
*/
Game_Battler.prototype.ctrPlus = function() {
	return this._j._natural._ctrPlus;
};
/**
* Modifies the permanent flat bonus for CTR.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCtrPlus = function(amount) {
	this._j._natural._ctrPlus += amount;
};
/**
* Gets the current growths applied to CTR rate.
* @returns {number}
*/
Game_Battler.prototype.ctrRate = function() {
	return this._j._natural._ctrRate;
};
/**
* Modifies the permanent multiplicative bonus for CTR.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCtrRate = function(amount) {
	this._j._natural._ctrRate += amount;
};
/**
* Extends {@link Game_BattlerBase#baseCriticalMultiplier}.<br/>
* Adds any `<critMultiplierBase:NUM>` notetag contributions on top of the plugin-configured
* floor value inherited from {@link Game_BattlerBase}, instead of replacing it outright-
* without this alias, every battler without a notetag would floor out at 0 instead of the
* designer-configured default.
*/
J.CRIT.Aliased.Game_Battler.set("baseCriticalMultiplier", Game_Battler.prototype.baseCriticalMultiplier);
Game_Battler.prototype.baseCriticalMultiplier = function() {
	const baseFactor = J.CRIT.Aliased.Game_Battler.get("baseCriticalMultiplier").call(this);
	const objectsToCheck = this.getAllNotes();
	const baseCriticalMultiplier = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBase);
	const baseCdmFactor = baseCriticalMultiplier / 100;
	return baseFactor + baseCdmFactor;
};
/**
* Calculates this battler's current critical damage multiplier.
* @returns {number}
*/
Game_Battler.prototype.criticalDamageMultiplier = function() {
	const cdmBonuses = this.getCriticalDamageMultiplier();
	const cdmNaturalBonuses = this.cdmNaturalBonuses();
	const cdmSdpBonuses = this.critSdpBonuses(0, this.baseCriticalMultiplier());
	const cdmFactor = (cdmBonuses + cdmNaturalBonuses + cdmSdpBonuses) / 100;
	return cdmFactor;
};
/**
* Gets the sum of all critical damage multipliers from all notes.
* @returns {number}
*/
Game_Battler.prototype.getCriticalDamageMultiplier = function() {
	const objectsToCheck = this.getAllNotes();
	const cdmBonuses = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplier);
	return cdmBonuses;
};
/**
* Gets all natural bonuses for cdm, excluding the base cdm itself.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalBonuses = function() {
	if (!J.NATURAL) return 0;
	const cdmBuffs = this.cdmNaturalBuffs();
	const cdmGrowths = this.cdmNaturalGrowths();
	return cdmBuffs + cdmGrowths;
};
/**
* Calculates the buffs for critical damage multipliers.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalBuffs = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCriticalMultiplier();
	const cdmBuffPlus = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBuffPlus, baseParam, this);
	const cdmBuffRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBuffRate, baseParam, this);
	if (!cdmBuffPlus && !cdmBuffRate) return 0;
	return this.calculatePlusRate(baseParam, cdmBuffPlus, cdmBuffRate);
};
/**
* Calculates the growths associated with critical damage multipliers.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalGrowths = function() {
	const baseCdm = this.baseCriticalMultiplier();
	const growthPlus = this.cdmPlus();
	const growthRate = this.cdmRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseCdm, growthPlus, growthRate);
};
/**
* Extends {@link Game_BattlerBase#baseCriticalReduction}.<br/>
* Adds any `<critReductionBase:NUM>` notetag contributions on top of the plugin-configured
* floor value inherited from {@link Game_BattlerBase}, instead of replacing it outright-
* without this alias, every battler without a notetag would floor out at 0 instead of the
* designer-configured default.
*/
J.CRIT.Aliased.Game_Battler.set("baseCriticalReduction", Game_Battler.prototype.baseCriticalReduction);
Game_Battler.prototype.baseCriticalReduction = function() {
	const baseFactor = J.CRIT.Aliased.Game_Battler.get("baseCriticalReduction").call(this);
	const objectsToCheck = this.getAllNotes();
	const baseCriticalReduction = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReductionBase);
	const baseCdrFactor = baseCriticalReduction / 100;
	return baseFactor + baseCdrFactor;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number} The CDR factor for this battler.
*/
Game_Battler.prototype.criticalDamageReduction = function() {
	const ctrBonuses = this.getCriticalDamageReduction();
	const ctrNaturalBonuses = this.ctrNaturalBonuses();
	const ctrSdpBonuses = this.critSdpBonuses(1, this.baseCriticalReduction());
	const ctrFactor = (ctrBonuses + ctrNaturalBonuses + ctrSdpBonuses) / 100;
	return ctrFactor;
};
/**
* Gets the sum of all critical damage reductions from all notes.
* @returns {number}
*/
Game_Battler.prototype.getCriticalDamageReduction = function() {
	const objectsToCheck = this.getAllNotes();
	const ctrBonuses = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReduction);
	return ctrBonuses;
};
/**
* Gets all natural bonuses for ctr, excluding the base ctr itself.
* @returns {number}
*/
Game_Battler.prototype.ctrNaturalBonuses = function() {
	if (!J.NATURAL) return 0;
	const ctrBuffs = this.ctrNaturalBuffs();
	const ctrGrowths = this.ctrNaturalGrowths();
	return ctrBuffs + ctrGrowths;
};
/**
* Calculates the buffs for critical taken rate.
* @returns {number}
*/
Game_Battler.prototype.ctrNaturalBuffs = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCriticalReduction();
	const ctrBuffPlus = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritTakenRateBuffPlus, baseParam, this);
	const ctrBuffRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritTakenRateBuffRate, baseParam, this);
	if (!ctrBuffPlus && !ctrBuffRate) return 0;
	const baseCtr = this.baseCriticalReduction();
	return this.calculatePlusRate(baseCtr, ctrBuffPlus, ctrBuffRate);
};
/**
* Calculates the growths associated with critical taken rate.
* @returns {number}
*/
Game_Battler.prototype.ctrNaturalGrowths = function() {
	const baseCtr = this.baseCriticalReduction();
	const growthPlus = this.ctrPlus();
	const growthRate = this.ctrRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseCtr, growthPlus, growthRate);
};
/**
* Whether or not this battler's on-crit state applications should skip their own chance roll and
* always land. Scoped specifically to {@link Game_Action.rollAndApplyCritStates}- unlike
* `isVeryLucky()`, this does not bypass any other roll site (hit chance, regular state-apply,
* retaliation, etc). Sourced from any of this battler's own note sources via `<forceCritProcs>`.
* @returns {boolean}
*/
Game_Battler.prototype.isForceCritProcs = function() {
	return RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.CRIT.RegExp.ForceCritProcs) === true;
};

//#endregion
//#region src/plugins/crit/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Crit stats with the parameter catalog after vanilla seeding.
*/
J.CRIT.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.CRIT.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	CritParameterRegistration.registerAll();
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritChanceIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritChanceIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritChanceIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritChanceIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritsAlwaysIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritsAlwaysIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritAlwaysIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritAlwaysIfStateType);
};

//#endregion
//# sourceMappingURL=J-CriticalFactors.js.map