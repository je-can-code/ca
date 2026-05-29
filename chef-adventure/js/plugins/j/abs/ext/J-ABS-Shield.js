//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.2 SHIELD] A JABS extension that provides state-based HP shields.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Elementalistics
 * @orderAfter J-HUD-Party
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin provides the ability to create state-based HP shields that can
 * be used to protect actors from damage.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; this plugin is an extension to JABS.
 * - J-Elementalistics; considers all elements for shield typing/bypassing.
 * - J-HUD-Party; the shield gauge will be rendered above the hp gauge.
 * - J-Popups (+ J-Popups-ABS); shield damage popups will be generated.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Provides the standard in HP shield mechanics for JABS. States own the shield
 * and can be used to protect actors from damage in varying ways. The shields
 * always will have a maximum amount that it can absorb (cap).
 *
 * NOTE ABOUT SHIELD/STATE EXPIRATION:
 * When a shield breaks (as in, reduced to zero), the state will be removed.
 * This means one should probably make shield states unique from other effects
 * unless it is desired that the effects of the state are lost when the shield
 * breaks. Inversely, when a state owning a shield expires, the shield is
 * removed with the state.
 *
 * NOTE ABOUT STACKING:
 * Stacking works about like one might envision: a shield with stacks will be
 * multiple instances of the same shield. When damage is dealt to a battler
 * with a shield state applied having a stack greater than 1, the damage will
 * iterate through each stack until damage is fully absorbed, or until the
 * state's stacks are depleted. The exception to the "stack iteration" is when
 * a state also has the "shieldProtect" tag, in which case only one stack can
 * ever be removed per application of damage (because any overflow will be
 * negated by the protect functionality instead of carried to the next stack).
 * This means you could potentially apply a shield state with something like 10
 * stacks of 1 shield point, and it will effectively mitigate 10 hits-
 * assuming each hit deals at least 1 damage.
 *
 * NOTE ABOUT SLIP DAMAGE:
 * Currently, slip damage (aka damage over time) is not mitigated by shields.
 * It will apply directly to the battler, leaving shields intact.
 * This may change in a future update.
 *
 * ============================================================================
 * SHIELDING:
 * Have you ever wanted to apply some amount of shield points to a state to
 * protect against damage? Well now you can! By applying the appropriate tag
 * on your states, you too can apply shields to your heart's content.
 *
 * NOTE ABOUT FORMULA-BASED TAGS:
 * All formula-based tags are recalculated upon application of the state, and
 * again anytime the state refreshes. When a state is recalculated, the current
 * shield gets replaced with an updated shield, carrying over the previous
 * current amount along with adding it to the new base amount. The cap is
 * simply replaced with the updated value.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shield:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the amount to
 *    absorb. The variables 'a' and 'b' can be used in the formulas like you
 *    would in a damage formula, where 'a' represents the target afflicted
 *    with the shield state, and 'b' represents the RPG_State object.
 *
 * TAG EXAMPLES:
 *  <shield:[100]>
 * A shield to protect against 100 daamge will be supplied when afflicted with
 * the state bearing this tag.
 *
 *  <shield:[(a.atk * 3) + b.stepsToRemove]>
 * A shield to protect against damage based on triple the afflicted's attack
 * parameter as well as the value in the "steps to remove" field on the state.
 *
 * ============================================================================
 * SHIELD CAPS:
 * Have you ever wanted to have a cap on shields that was higher than the
 * initially applied amount? Well now you can! By applying the appropriate tag
 * on your states, you too can have shield caps as high as your heart desires!
 *
 * NOTE ABOUT OMITTING SHIELD CAPS:
 * If the shield cap is omitted from a shield state, then the cap will
 * automatically be set to the initial shield amount. This tag lets you create
 * states that can be reapplied to further increase the shield amount up to a
 * certain point- the cap.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldCap:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the cap shield
 *    amount. The variables 'a' and 'b' can be used in the formulas like you
 *    would in a damage formula, where 'a' represents the target afflicted
 *    with the shield state, and 'b' represents the RPG_State object.
 *
 * TAG EXAMPLES:
 *  <shieldCap:[100]>
 * A shield cap of 100 will be applied when afflicted with the state bearing this
 * tag.
 *
 *  <shieldCap:[(a.atk * 3) + b.stepsToRemove]>
 * A shield cap of (target's attack * 3) + (number of steps to remove) will be
 * applied when afflicted with the state bearing this tag.
 *
 * ============================================================================
 * SHIELD PRIORITY:
 * Have you ever wanted to force your shields to be consumed in a particular
 * order? Well now you can! By applying the shield priority tag to the various
 * shield states, you too can have deterministically controlled shield
 * consumption!
 *
 * NOTE ABOUT DUPLICATE PRIORITY:
 * If multiple shields have the same priority, then the timestamp at which
 * they were applied will be deferred to as a tie-breaker for determining
 * which should come first.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldPriority:PRIORITY>
 *    Where PRIORITY is an integer that represents the priority of the shield
 *    state. Shield states with higher priority will be consumed first.
 *
 * TAG EXAMPLES:
 *  <shieldPriority:5> (on stateA)
 *  <shieldPriority:10> (on stateB)
 *  <shieldPriority:1> (on stateC)
 * When afflicted with stateA, stateB, and stateC, the shields will be consumed
 * in the order of priority, with stateB consuming first, followed by stateA,
 * and finally stateC (because 10 > 5 > 1).
 *
 * ============================================================================
 * SHIELD PROTECT:
 * Have you ever wanted your shields to protect you from the overflow damage
 * after they break like they do in certain other games you might've played?
 * Well now you can! By applying the shield protect tag to the various shield
 * states, you too can have shields that will protect you from damage that
 * would otherwise overflow and deal damage after a shield is broken.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldProtect>
 *    This tag is used to indicate that the shield should protect you from
 *    damage that would otherwise overflow and deal damage after the shield
 *    is broken.
 *
 * TAG EXAMPLES:
 *  <shieldProtect>
 * Let us assume that a battler is afflicted with a shield state with the
 * <shield:[100]> tag as well, meaning they have a flat 100 shield points. If
 * this battler was struck with a blow that dealt 150 damage, normally 100 of
 * it would be soaked up by the shield leaving 50 to overflow back and damage
 * the battler's HP. If that same state also had the protect tag, then that
 * overflow of 50 would instead be nullified entirely.
 *
 * ============================================================================
 * SHIELD TYPE:
 * Have you ever wanted to have a shield that was explicitly designed to
 * protect the bearer from fire damage? Or even fire, ice, and lightning, but
 * nothing else? Well now you can! By applying the appropriate tag on your
 * states, you too can have elemental shields that are explicitly designed to
 * protect certain types of damage.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <shieldType:[TYPES...]>
 *    Where TYPES... is a comma-delimited array of numbers that represent the
 *    element ids from your database of the elements that you want this shield
 *    to be typed with.
 *
 * TAG EXAMPLES:
 *  <shieldType:[1,2,3]>
 * A shield that will soak damage if damage is taken that is of elements 1, 2,
 * or 3.
 *
 *  <shieldType:[1]>
 * A shield that will soak damage if damage is taken that is of element 1.
 *
 * ============================================================================
 * SHIELD BYPASS:
 * Have you ever wanted to be able to ignore all those awesome shields that we
 * just setup from all the previous tags? Well now you can! By applying the
 * appropriate tag on your skills, you too can bypass shields as much as you
 * feel the player should.
 *
 * NOTE ABOUT TYPES AND BYPASS INTERSECTIONS:
 * Shield bypassing is expected to go hand-in-hand with shield typing. If a
 * shield has any types that intersect with the types of the skill AND the
 * bypass types also intersect with any of the shield types, then the result
 * is that the shield will be bypassed. That sounds confusing to write, but
 * in practice it'll probably be a lot less complicated since skills typically
 * only have one element associated with them. If you just want a skill that
 * totally bypasses shields, then use the typeless tag.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <shieldBypass>
 *    This tag will indicate a skill will bypass any and all shields entirely.
 *
 *  <shieldBypass:[TYPES...]>
 *    Where TYPES... is a comma-delimited array of numbers that represent the
 *    element ids from your database of the elements that you want this skill
 *    to bypass shields for.
 *
 * TAG EXAMPLES:
 *  <shieldBypass>
 * This skill will entirely bypass all shields. There are no exceptions.
 *
 *  <shieldBypass:[1,2,3]>
 * This skill will bypass shields for elements with ids 1, 2, and 3.
 *
 * ============================================================================
 * SHIELD BONUS DAMAGE:
 * Have you ever wanted to be able to deal bonus damage to all those pesky
 * shields that the enemy has on them? Well now you can! By applying the
 * appropriate tags to skills, you too can create skills that are shield
 * destroyers!
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <shieldDamage:[FORMULA]>
 *    Where FORMULA represents a damage-like formula calculating the amount of
 *    bonus damage to deal. The variables 'a', 'b', and 'o' can be used in
 *    the formulas like you would in a damage formula, where 'a' represents
 *    the attacker executing the skill, 'b' represents target with the shield,
 *    and 'o' represents the pre-shielded amount of damage.
 *
 * TAG EXAMPLES:
 *  <shieldDamage:[100]>
 *    A skill with this tag will deal a flat 100 bonus damage to shields.
 *
 *  <shieldDamage:[o * 3]>
 *    A skill with this tag will deal triple the original damage to shields.
 *
 *  <shieldDamage:[b.currentShieldValue() / 2]>
 *    A skill with this tag will deal half of the current shield value as bonus
 *    damage to shields.
 *
 *  <shieldDamage:[a.hp + ($gameParty.gold() * 100)]>
 *    A skill with this tag will deal the amount equal to the attacker's
 *    current hp plus 100 times the party's gold.
 *    (a bizarre formula, but demonstrating availability to globals)
 *
 * ============================================================================
 * SHIELD BREAK SKILLS:
 * Have you ever wanted to be able to retaliate with particular skills when
 * your shield breaks? Well now you can! By applying the appropriate tags on
 * various applicable database objects, you too can customize your shield
 * break retaliation.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <shieldBreak:[SKILL_IDS...]>
 *    Where SKILL_IDS... is a comma-delimited array of numbers that represent
 *    the ids of the skills that will be executed when any shield breaks.
 *
 * TAG EXAMPLES:
 *  <shieldBreak:[1,2,3]> (on the shield state applied to the battler)
 *    This actor will execute skill 1, 2, and 3 when their shield breaks.
 *
 * <shieldBreak:[1,2,3]> (on the battler)
 * <shieldBreak:[1,4]>   (on the shield state applied to the battler)
 *    This battler will execute skills 1 (once), 2, 3, and 4 when their shield
 *    breaks- the 1 only triggers once even though it shows up twice.
 *
 * ============================================================================
 * There are no plugin parameters/commands for this plugin.
 * They are mostly just states, so work with them as you would any other state.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.1
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/abs/ext/shield/_metadata/_pluginMetadata.js
var JShield_PluginMetadata = class extends PluginMetadata {
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
	initializeMetadata() {}
};

//#endregion
//#region src/plugins/abs/ext/shield/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.6.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.ABS.EXT ||= {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.ABS.EXT.SHIELD ||= {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.SHIELD.Metadata = new JShield_PluginMetadata("J-ABS-Shield", "1.0.2");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.SHIELD.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	JABS_Engine: new Map(),
	JABS_State: new Map(),
	JABS_StateBuilder: new Map(),
	Sprite_ActorValue: new Map(),
	Sprite_Character: new Map(),
	Window_PartyFrame: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.SHIELD.RegExp = {
	/**
	* Represents the shield points derived from a damage formula.
	* 'a' is the attacker, 'b' is the shielded battler.
	*/
	ShieldPointsFormula: /<shield:\[([+\-*/ ().\w]+)]>/gi,
	/**
	* Represents the shield cap derived from a damage formula.
	* 'a' is the attacker, 'b' is the shielded battler.
	*/
	ShieldCapFormula: /<shieldCap:\[([+\-*/ ().\w]+)]>/gi,
	/**
	* Represents the priority of a shield.
	*/
	Priority: /<shieldPriority:[ ]?(\d+)>/i,
	/**
	* Dictates if the shield should prevent overflow damage upon breaking.
	*/
	Protect: /<shieldProtect>/i,
	/**
	* Represents the type of shield.
	*/
	Type: /<shieldType:[ ]?(\[[\d, ]+])>/gi,
	/**
	* On an action, this means it will bypass either all shields or specific shields.
	*/
	Bypass: /<shieldBypass(?::[ ]?(\[[\d, ]+]))?>/gi,
	/**
	* Represents an additional damage formula for shield-only damage from the action.
	* 'a' is the attacker, 'b' is the shielded battler, 'o' is the original damage before mitigation.
	*/
	ShieldDamage: /<shieldDamage:\[([+\-*/ ().\w]+)]>/gi,
	/**
	* Represents one or many skills to fire when this state’s shield breaks.
	*/
	Break: /<shieldBreak:[ ]?(\[[\d, ]+])>/i,
	/** Outgoing shield point amplification (`<sar:25>` = +25%). */
	ShieldAmplification: /<sar:(-?\d+)>/gi,
	/** Incoming shield effectiveness (`<ser:25>` = +25%). */
	ShieldEffectiveness: /<ser:(-?\d+)>/gi
};
/** Legacy SDP panel parameter ids for shield stats. */
J.ABS.EXT.SHIELD.SdpParamId = {
	SAR: 38,
	SER: 39
};

//#endregion
//#region src/plugins/abs/ext/shield/_models/JABS_Shield.js
/**
* Represents a state-owned shield pool for a {@link JABS_State}.
*/
var JABS_Shield = class JABS_Shield {
	/**
	* Derives a {@link JABS_Shield} from a state id.
	* @param {number} stateId The id of the state we should derive a shield from.
	* @param {Game_Actor|Game_Enemy} target The battler that will have the shield.
	* @param {Game_Actor|Game_Enemy} attacker The battler that is applying the state.
	* @returns {JABS_Shield|null} The shield data, or null if the state is not a shield state.
	*/
	static fromStateId(stateId, target, attacker) {
		const state = target.state(stateId);
		const pointFormulas = RPGManager.getStringsFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.ShieldPointsFormula);
		const a = attacker ?? target;
		const b = target;
		/**
		* A safe reduce function that wears a diaper during evaluation.
		* @param {number} total The current total value.
		* @param {string} formula The formula to evaluate.
		* @returns {number} The new total value.
		*/
		const safeReduce = (total, formula) => {
			try {
				return total + eval(formula);
			} catch (e) {
				console.error(`Error evaluating shield formula: ${formula}`, target, attacker, e);
				return total;
			}
		};
		let totalPoints = pointFormulas.reduce(safeReduce, 0);
		if (attacker && attacker.sar) {
			totalPoints *= attacker.sar;
		}
		if (target && target.ser) {
			totalPoints *= target.ser;
		}
		if (totalPoints === 0) return null;
		const capFormulas = RPGManager.getStringsFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.ShieldCapFormula);
		const totalCap = capFormulas.reduce(safeReduce, 0);
		const normalizedCap = totalCap === 0 ? totalPoints : totalCap;
		const priority = RPGManager.getNumberFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.Priority);
		const isProtect = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.Protect) === true;
		const appliedAt = Date.now();
		const shieldTypes = RPGManager.getArrayFromNotesByRegex(state, J.ABS.EXT.SHIELD.RegExp.Type, true);
		return new JABS_Shield(totalPoints, normalizedCap, priority, shieldTypes, isProtect, appliedAt);
	}
	/**
	* The maximum amount of shield points this shield can hold.
	* @type {number}
	*/
	#cap = 0;
	/**
	* The original amount of shield points when this state was instantiated.
	* @type {number}
	*/
	#originalAmount = 0;
	/**
	* The current amount of shield points remaining.
	* @type {number}
	*/
	#current = 0;
	/**
	* The priority of this shield.
	* @type {number}
	*/
	#priority = 0;
	/**
	* The element types this shield protects against.
	* @type {number[]}
	*/
	#types = [];
	/**
	* Whether or not this shield negates overflow when broken.
	* @type {boolean}
	*/
	#protect = false;
	/**
	* The epoch timestamp in milliseconds for when this shield was applied.
	* @type {number}
	*/
	#appliedAt = 0;
	/**
	* Constructor.
	* @param {number} shields The amount of shields provided by this state initially.
	* @param {number} cap The accumulation cap for add-and-clamp refresh behavior (often equals `max`).
	* @param {number} priority A numeric priority; higher values resolve earlier.
	* @param {number[]} shieldTypes The element types this shield protects against.
	* @param {boolean} protect When true, breaking this shield nullifies the remainder of the hit.
	* @param {number} appliedAt The frame index when this shield was created (for FIFO tiebreakers).
	*/
	constructor(shields, cap, priority, shieldTypes, protect, appliedAt) {
		this.#cap = cap;
		this.#originalAmount = shields;
		this.#current = shields;
		this.#priority = priority;
		this.#types = shieldTypes;
		this.#protect = protect === true;
		this.#appliedAt = appliedAt;
	}
	/**
	* Gets the accumulation cap used when adding via refresh (non-stackable add-and-clamp).
	* @returns {number} The accumulation cap.
	*/
	getCap() {
		return this.#cap;
	}
	/**
	* Gets the current amount of shield points remaining.
	* @returns {number} The current shield points.
	*/
	getCurrent() {
		return this.#current;
	}
	/**
	* Sets the current shield points.
	* The amount set can never be more than the shield cap.
	* @param {number} value The desired new current value.
	*/
	setCurrent(value) {
		this.#current = Math.round(Math.max(0, Math.min(this.#cap, value)));
	}
	/**
	* Damages the shield by a given amount and returns the overflow, if any.
	* @param {number} amount The amount of damage to be deducted.
	* @returns {number} The amount of damage that overflowed the shield.
	*/
	applyShieldDamage(amount) {
		const shieldAfterDamage = this.#current - amount;
		this.#current = Math.round(Math.max(0, shieldAfterDamage));
		if (shieldAfterDamage < 0) {
			return Math.round(Math.abs(shieldAfterDamage));
		}
		return 0;
	}
	/**
	* Gets this shield's resolution priority; higher resolves earlier.
	* @returns {number} The priority value.
	*/
	getPriority() {
		return this.#priority;
	}
	/**
	* Gets the element types this shield protects against.
	* @returns {number[]} The elementIds for this shield.
	*/
	getShieldTypes() {
		return this.#types;
	}
	/**
	* Gets whether this shield has protected-break semantics.
	* @returns {boolean} True if breaking this shield nullifies hit remainder; otherwise false.
	*/
	isProtected() {
		return this.#protect === true;
	}
	/**
	* Gets the frame index when this shield was first applied.
	* @returns {number} The application frame index used for FIFO ordering.
	*/
	getAppliedAt() {
		return this.#appliedAt;
	}
	/**
	* Determines whether this shield is currently depleted.
	* @returns {boolean} True if `current` is zero; otherwise false.
	*/
	isBroken() {
		return this.#current === 0;
	}
	/**
	* Refreshes the shields current value to whatever its original application amount was.
	*/
	refresh() {
		const projected = this.#current + this.#originalAmount;
		this.#current = Math.max(0, Math.min(this.#cap, projected));
	}
};

//#endregion
//#region src/plugins/abs/ext/shield/_models/JABS_State.js
/**
* The shield for this state.
* @type {JABS_Shield|null}
*/
Object.defineProperty(JABS_State.prototype, "shield", {
	get() {
		if (this._shield === undefined) {
			return null;
		}
		return this._shield;
	},
	set(v) {
		this._shield = v;
	},
	enumerable: true,
	configurable: true
});
/**
* Extends {@link #removeFromBattler}.<br/>
* Also removes the shield when the state expires.
*/
J.ABS.EXT.SHIELD.Aliased.JABS_State.set("removeFromBattler", JABS_State.prototype.removeFromBattler);
JABS_State.prototype.removeFromBattler = function() {
	J.ABS.EXT.SHIELD.Aliased.JABS_State.get("removeFromBattler").call(this);
	this.removeShield();
};
/**
* An event hook fired when a shield is broken.
*/
JABS_State.prototype.onShieldBreak = function() {
	this.battler.onShieldBreak();
	this.decrementStacks(1);
	if (this.stackCount === 0) {
		this.removeFromBattler();
		return;
	}
	this.refreshShield();
};
/**
* Zeroes out the shield for this state.
* This does not count as "breaking" the shield.
*/
JABS_State.prototype.removeShield = function() {
	if (this.shield === null || this.shield === undefined) return;
	this.shield.setCurrent(0);
};
/**
* Recalculates the shield based on the current state of the battler.
*/
JABS_State.prototype.recalculateShield = function() {
	const updatedShield = JABS_Shield.fromStateId(this.stateId, this.battler, this.source);
	if (updatedShield === null || updatedShield === undefined) return;
	const current = this.shield ? this.shield.getCurrent() : 0;
	updatedShield.setCurrent(current);
	this.shield = updatedShield;
};
/**
* Refreshes the shield back to its original amount.
*/
JABS_State.prototype.refreshShield = function() {
	if (this.canRefreshShield() === false) return;
	this.shield.refresh();
};
/**
* Determines whether or not this state can refresh its shield.
* @returns {boolean} True if the shield can be refreshed, false otherwise.
*/
JABS_State.prototype.canRefreshShield = function() {
	if (this.shield === null || this.shield === undefined) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/shield/_models/JABS_StateBuilder.js
/**
* The shield for this state.
* @type {JABS_Shield|null}
*/
Object.defineProperty(JABS_StateBuilder.prototype, "shield", {
	get() {
		if (this._shield === undefined) {
			return null;
		}
		return this._shield;
	},
	set(v) {
		this._shield = v;
	},
	enumerable: true,
	configurable: true
});
J.ABS.EXT.SHIELD.Aliased.JABS_StateBuilder.set("build", JABS_StateBuilder.prototype.build);
JABS_StateBuilder.prototype.build = function() {
	const originalState = J.ABS.EXT.SHIELD.Aliased.JABS_StateBuilder.get("build").call(this);
	originalState.shield = this.shield;
	return originalState;
};
/**
* Attaches a prebuilt {@link JABS_Shield} to the state after construction.
* @param {JABS_Shield} shield The shield model to assign.
* @returns {JABS_StateBuilder} This builder for chaining.
*/
JABS_StateBuilder.prototype.setShield = function(shield) {
	this.shield = shield;
	return this;
};

//#endregion
//#region src/plugins/abs/ext/shield/database/RPG_UsableItem.js
Object.defineProperties(RPG_UsableItem.prototype, {
	/**
	* Gets the elementIds that this skill bypasses.
	*
	* Shapes supported:
	* - <shield-bypass> → universal bypass (handled by {@link isShieldBypassUniversal}); this getter returns null.
	* - <shield-bypass: [1, 5, 7]> → typed bypass list; returns an array of element ids.
	*
	* Notes:
	* - Returns null when no tag is present, or when the tag is parameterless (universal form).
	* - The parameterized list must contain only element ids (numbers); names are not supported for this tag.
	*
	* @type {number[]|null}
	*/
	shieldBypassElements: {
		get: function() {
			if (this.hasShieldBypass === false) {
				return null;
			}
			J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;
			const match = J.ABS.EXT.SHIELD.RegExp.Bypass.exec(this.note);
			if (!match) {
				return null;
			}
			if (!match[1] || String(match[1]).trim().length === 0) {
				return null;
			}
			const list = RPGManager.getArrayFromNotesByRegex(this, J.ABS.EXT.SHIELD.RegExp.Bypass, true);
			return list;
		},
		configurable: true
	},
	/**
	* Whether this skill/item declares a shield bypass of any kind.
	* Supports both parameterless and parameterized forms.
	* @type {boolean}
	*/
	hasShieldBypass: {
		get: function() {
			J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;
			return J.ABS.EXT.SHIELD.RegExp.Bypass.test(this.note);
		},
		configurable: true
	},
	/**
	* True when the skill/item has the parameterless universal bypass form: <shield-bypass>
	* (no parameters after the colon). This means bypass ALL shields regardless of typing.
	* @type {boolean}
	*/
	isShieldBypassUniversal: {
		get: function() {
			if (this.hasShieldBypass === false) {
				return false;
			}
			J.ABS.EXT.SHIELD.RegExp.Bypass.lastIndex = 0;
			const match = J.ABS.EXT.SHIELD.RegExp.Bypass.exec(this.note);
			if (match && (!match[1] || String(match[1]).trim().length === 0)) {
				return true;
			}
			return false;
		},
		configurable: true
	},
	/**
	* A collection of damage formulas that contribute bonus SHIELD-ONLY damage.
	* Multiple tags are allowed; the results are summed when applying shields.
	* Ex: <shield-bonus:[a.atk*0.2]> or <shield-bonus:[p*0.5]> (where p is base HP damage).
	* @type {string[]}
	*/
	shieldBonusFormulas: {
		get: function() {
			J.ABS.EXT.SHIELD.RegExp.ShieldDamage.lastIndex = 0;
			const formulas = RPGManager.getStringsFromNoteByRegex(this, J.ABS.EXT.SHIELD.RegExp.ShieldDamage);
			return Array.isArray(formulas) ? formulas : [];
		},
		configurable: true
	}
});

//#endregion
//#region src/plugins/abs/ext/shield/managers/ColorManager.js
/**
* Gets the "shield gauge" color gradient 1 as hex.
* @returns {string}
*/
ColorManager.shieldGauge1 = function() {
	return this.textColor(7);
};
/**
* Gets the "shield gauge" color gradient 2 as hex.
* @returns {string}
*/
ColorManager.shieldGauge2 = function() {
	return this.textColor(8);
};

//#endregion
//#region src/plugins/abs/ext/shield/managers/TextManager.js
TextManager.sar = function() {
	return "Shield Amp";
};
TextManager.sarDescription = function() {
	return ["Multiplier on shield points this battler applies to allies.", "Higher values create stronger outgoing shields."];
};
TextManager.ser = function() {
	return "Shield Eff";
};
TextManager.serDescription = function() {
	return ["Multiplier on shield points received on this battler.", "Higher values strengthen incoming shields."];
};

//#endregion
//#region src/plugins/abs/ext/shield/managers/IconManager.js
IconManager.sar = function() {
	return 967;
};
IconManager.ser = function() {
	return 968;
};

//#endregion
//#region src/plugins/abs/ext/shield/managers/JABS_Engine.js
/**
* Extends {@link #refreshJabsState}.<br/>
* Also refreshes the shield when a shield state is refreshed.
*/
J.ABS.EXT.SHIELD.Aliased.JABS_Engine.set("refreshJabsState", JABS_Engine.prototype.refreshJabsState);
JABS_Engine.prototype.refreshJabsState = function(jabsState, newJabsState) {
	jabsState.recalculateShield();
	jabsState.refreshShield();
	J.ABS.EXT.SHIELD.Aliased.JABS_Engine.get("refreshJabsState").call(this, jabsState, newJabsState);
};
/**
* Extends {@link #extendJabsState}.<br/>
* Also refreshes the shield when a shield state is refreshed.
*/
J.ABS.EXT.SHIELD.Aliased.JABS_Engine.set("extendJabsState", JABS_Engine.prototype.extendJabsState);
JABS_Engine.prototype.extendJabsState = function(jabsState, newJabsState) {
	jabsState.recalculateShield();
	jabsState.refreshShield();
	J.ABS.EXT.SHIELD.Aliased.JABS_Engine.get("extendJabsState").call(this, jabsState, newJabsState);
};

//#endregion
//#region src/plugins/abs/ext/shield/objects/Game_Battler.js
Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	* Outgoing shield amplification (1.0 = baseline).
	*/
	sar: {
		get: function() {
			return 1;
		},
		configurable: true
	},
	/**
	* Incoming shield effectiveness (1.0 = baseline).
	*/
	ser: {
		get: function() {
			return 1;
		},
		configurable: true
	}
});
Object.defineProperty(Game_Battler.prototype, "sar", {
	get: function() {
		let factor = this.baseSarFactor();
		if (this.getSdpBonusForParameterKey) {
			factor += this.getSdpBonusForParameterKey("sar", 1);
		}
		return factor;
	},
	configurable: true
});
Object.defineProperty(Game_Battler.prototype, "ser", {
	get: function() {
		let factor = this.baseSerFactor();
		if (this.getSdpBonusForParameterKey) {
			factor += this.getSdpBonusForParameterKey("ser", 1);
		}
		return factor;
	},
	configurable: true
});
/**
* Sums `<sar:X>` notetags into a multiplier factor.
* @returns {number}
*/
Game_Battler.prototype.baseSarFactor = function() {
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.ABS.EXT.SHIELD.RegExp.ShieldAmplification);
	return (100 + bonus) / 100;
};
/**
* Sums `<ser:X>` notetags into a multiplier factor.
* @returns {number}
*/
Game_Battler.prototype.baseSerFactor = function() {
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.ABS.EXT.SHIELD.RegExp.ShieldEffectiveness);
	return (100 + bonus) / 100;
};

//#endregion
//#region src/plugins/abs/ext/shield/objects/_Game_Battler.js
/**
* Extends {@link #createJabsState}.<br/>
* Also includes shield data.
* @param {Game_Battler} target the battler being affected by the state.
* @param {number} stateId The id of the state being applied.
* @param {number} iconIndex The icon index of the state being applied.
* @param {number} totalDuration The total duration in frames of the state being applied.
* @param {number} stacks The number of stacks of the state being applied.
* @param {Game_Battler} attacker The battler applying the state.
* @returns {JABS_StateBuilder} The builder with all the parameters of the state being applied.
*/
J.ABS.EXT.SHIELD.Aliased.Game_Battler.set("createJabsState", Game_Battler.prototype.createJabsState);
Game_Battler.prototype.createJabsState = function(target, stateId, iconIndex, totalDuration, stacks, attacker) {
	const builder = J.ABS.EXT.SHIELD.Aliased.Game_Battler.get("createJabsState").call(this, target, stateId, iconIndex, totalDuration, stacks, attacker);
	const shield = JABS_Shield.fromStateId(stateId, target);
	builder.setShield(shield);
	return builder;
};
/**
* Gets the array of states containing non-broken shields and their values, sorted in priority order.
* @returns {JABS_State[]}
*/
Game_Battler.prototype.getShieldStates = function() {
	const jabsStates = $jabsEngine.getJabsStatesByUuid(this.getUuid());
	const states = Array.from(jabsStates.values());
	return states.filter((state) => {
		if (!state.shield) {
			return false;
		}
		if (state.shield.isBroken()) {
			return false;
		}
		return true;
	}).sort((a, b) => {
		const aShield = a.shield;
		const bShield = b.shield;
		const aPri = aShield.getPriority() || 0;
		const bPri = bShield.getPriority() || 0;
		if (aPri !== bPri) {
			return bPri - aPri;
		}
		return aShield.getAppliedAt() - bShield.getAppliedAt();
	});
};
/**
* Gets the highest priority shield state currently applied to this battler, or null if there are no shields.
* @returns {JABS_State|null}
*/
Game_Battler.prototype.currentShieldState = function() {
	const shieldStates = this.getShieldStates();
	if (shieldStates.length === 0) return null;
	return shieldStates.at(0);
};
/**
* Gets the highest priority shield value currently applied to this battler, or 0 if there are no shields.
* @returns {number}
*/
Game_Battler.prototype.currentShieldValue = function() {
	const shieldState = this.currentShieldState();
	if (shieldState === null) return 0;
	return shieldState.shield.getCurrent();
};
/**
* Gets the highest priority shield cap currently applied to this battler, or 0 if there are no shields.
* @returns {number}
*/
Game_Battler.prototype.currentShieldCap = function() {
	const shieldState = this.currentShieldState();
	if (shieldState === null) return 0;
	return shieldState.shield.getCap();
};
/**
* Gets the highest priority shield stacks currently applied to this battler, or 0 if there are no shields.
* @returns {number}
*/
Game_Battler.prototype.currentShieldStacks = function() {
	const shieldState = this.currentShieldState();
	if (shieldState === null) return 0;
	return shieldState.stackCount;
};
/**
* An event hook fired when a shield is broken.
*/
Game_Battler.prototype.onShieldBreak = function() {
	const caster = JABS_AiManager.getBattlerByUuid(this.getUuid());
	if (!caster) return;
	const sources = this.shieldBreakSources().filter((source) => !!source);
	/**
	* A reducer function to grab all the shield break skills.
	* @param {number[]} accumulator The accumulator of skill ids.
	* @param {RPG_Base} source The source from which to pull shield break skills.
	*/
	const reducer = (accumulator, source) => {
		const skillIds = RPGManager.getArrayFromNotesByRegex(source, J.ABS.EXT.SHIELD.RegExp.Break, true);
		return accumulator.concat(...skillIds);
	};
	const breakSkillIds = sources.reduce(reducer, []);
	if (breakSkillIds.length === 0) return;
	breakSkillIds.forEach((skillId) => $jabsEngine.forceMapAction(caster, skillId, true));
};
/**
* Gets all the sources from which shield break skills can be pulled from.
* @returns {[RPG_Actor|RPG_Enemy|RPG_State]}
*/
Game_Battler.prototype.shieldBreakSources = function() {
	return [this.databaseData(), ...this.states()];
};

//#endregion
//#region src/plugins/abs/ext/shield/objects/Game_Action.js
/**
* Extends {@link #executeDamage}.<br/>
* Considers shields when executing damage.
*/
J.ABS.EXT.SHIELD.Aliased.Game_Action.set("executeDamage", Game_Action.prototype.executeDamage);
Game_Action.prototype.executeDamage = function(target, value) {
	const updatedValue = this.applyShields(target, value);
	J.ABS.EXT.SHIELD.Aliased.Game_Action.get("executeDamage").call(this, target, updatedValue);
};
/**
* Potentially applies shields to the damage value.
* @param {Game_Actor|Game_Enemy} target The target of the action.
* @param {number} value The damage value to be applied.
* @returns {number} The updated damage value after applying shields.
*/
Game_Action.prototype.applyShields = function(target, value) {
	if (value === 0) return value;
	const skillOrItem = this.item();
	const validDamageTypes = [1, 5];
	if (validDamageTypes.includes(skillOrItem.damage.type) === false) return value;
	const shieldStates = target.getShieldStates();
	if (shieldStates.length === 0) return value;
	let updatedValue = value;
	for (const shieldState of shieldStates) {
		updatedValue = this.applyShield(shieldState, target, updatedValue);
		if (updatedValue === 0) break;
	}
	return updatedValue;
};
/**
* Applies the shield to the damage value against the target.
* Also applies any shield-only bonus damage from this action.
* @param {JABS_State} shieldState The state bearing the shield.
* @param {Game_Actor|Game_Enemy} target The target of the action.
* @param {number} value The damage value to be applied.
* @returns {number} The leftover damage value after applying the shield.
*/
Game_Action.prototype.applyShield = function(shieldState, target, value) {
	const { shield } = shieldState;
	if (!shield) {
		return value;
	}
	const skillOrItem = this.item();
	const actionElements = this.getActionElementsForShieldChecks(this.subject(), skillOrItem);
	if (this.isShieldRelevantToAction(shield, actionElements) === false) {
		return value;
	}
	if (this.shouldBypassShield(shield)) {
		return value;
	}
	const pendingBonusInitial = this.calculateShieldBonusDamage(target, value);
	const postAbsorption = this.absorbDamageIntoShield(shieldState, target, value, pendingBonusInitial);
	return postAbsorption;
};
/**
* Determines whether or not a shield should be bypassed by this action.
* @param {JABS_Shield} shield The shield to check.
* @returns {boolean} True if the shield should be bypassed, false otherwise.
*/
Game_Action.prototype.shouldBypassShield = function(shield) {
	if (!shield) {
		return false;
	}
	const skillOrItem = this.item();
	if (skillOrItem.hasShieldBypass === false) {
		return false;
	}
	if (skillOrItem.isShieldBypassUniversal === true) {
		return true;
	}
	const shieldElements = shield.getShieldTypes();
	const bypassElements = skillOrItem.shieldBypassElements;
	if (!bypassElements || bypassElements.length === 0 || shieldElements.length === 0) {
		return false;
	}
	const bypassesThisShield = ArrayHelper.hasAnyIntersection(shieldElements, bypassElements);
	if (bypassesThisShield === false) {
		return false;
	}
	return true;
};
/**
* Calculates the SHIELD-ONLY bonus damage for this action against a specific target.
* The result may be absorbed by shields but can never spill into HP damage.
*
* Variables available to formulas:
* - a: the subject/caster of this action.
* - b: the target receiving this action.
* - o: the HP damage value for this hit (pre-shield processing).
*
* @param {Game_Actor|Game_Enemy} target The target of the action.
* @param {number} baseDamage The base HP damage value (pre-shield).
* @returns {number} The total non-negative, rounded shield-only bonus value.
*/
Game_Action.prototype.calculateShieldBonusDamage = function(target, baseDamage) {
	const skillOrItem = this.item();
	const formulas = skillOrItem.shieldBonusFormulas;
	if (formulas.length === 0) {
		return 0;
	}
	const a = this.subject();
	const b = target;
	const o = baseDamage;
	const sum = formulas.reduce((total, f) => {
		const result = eval(f);
		const n = Number(result) || 0;
		return total + Math.max(0, Math.round(n));
	}, 0);
	return sum;
};
/**
* Absorbs as much of the provided damage as possible into the provided shield state.
* This will also consume any shield-only bonus damage, display pops, and handle break logic.
* If the shield is protected, the remainder of the hit is nullified.
*
* @param {JABS_State} shieldState The state bearing the shield to absorb damage.
* @param {Game_Actor|Game_Enemy} target The target receiving the action.
* @param {number} overflowDamage The current remaining HP damage to be applied to the target.
* @param {number} bonusDamage The current remaining SHIELD-ONLY bonus damage available.
* @returns {number} The leftover HP damage after absorption (0 if shield protected and nullified).
*/
Game_Action.prototype.absorbDamageIntoShield = function(shieldState, target, overflowDamage, bonusDamage) {
	let remainingDamage = overflowDamage;
	let pendingBonusDamage = bonusDamage;
	while (remainingDamage > 0 || pendingBonusDamage > 0) {
		const { shield: updatedShield } = shieldState;
		if (!updatedShield || updatedShield.getCurrent() <= 0) {
			break;
		}
		const before = updatedShield.getCurrent();
		const maxAbsorbThisTick = before;
		const absorbPower = remainingDamage + pendingBonusDamage;
		const absorbed = Math.min(absorbPower, maxAbsorbThisTick);
		const useFromReal = Math.min(remainingDamage, absorbed);
		const useFromBonus = absorbed - useFromReal;
		updatedShield.setCurrent(before - absorbed);
		remainingDamage -= useFromReal;
		pendingBonusDamage -= useFromBonus;
		if (absorbed > 0) {
			this.onShieldDamageAbsorbed(target, absorbed);
		}
		const brokeThisHit = before > 0 && updatedShield.getCurrent() === 0;
		if (brokeThisHit) {
			this.onShieldBroken(target);
			shieldState.onShieldBreak();
			if (updatedShield.isProtected()) {
				return 0;
			}
			continue;
		}
		break;
	}
	return remainingDamage;
};
/**
* Resolves the element ids that should be considered for shield relevance checks.
* Falls back to the skill/item's element, expands via J.ELEM when present,
* or uses the subject's normal attack elements when the element id is -1.
* @param {Game_Battler} subject The acting battler.
* @param {RPG_UsableItem} skillOrItem The action being executed.
* @returns {number[]} The collection of element ids for this action.
*/
Game_Action.prototype.getActionElementsForShieldChecks = function(subject, skillOrItem) {
	const declaredId = skillOrItem.damage.elementId;
	if (J.ELEM) {
		return [...this.getApplicableElements(subject)];
	}
	if (declaredId === -1) {
		return [...subject.attackElements()];
	}
	return [declaredId];
};
/**
* Determines whether or not the provided shield is relevant to the action's elements.
* Untyped shields are always relevant. Typed shields must intersect with the action's elements.
* @param {JABS_Shield} shield The shield being checked for relevance.
* @param {number[]} actionElements The elements associated with the action.
* @returns {boolean} True if the shield is relevant to this action, false otherwise.
*/
Game_Action.prototype.isShieldRelevantToAction = function(shield, actionElements) {
	const shieldElements = shield.getShieldTypes();
	if (shieldElements.length === 0) {
		return true;
	}
	const matches = ArrayHelper.hasAnyIntersection(actionElements, shieldElements);
	if (matches === false) {
		return false;
	}
	return true;
};
/**
* Lifecycle event: shield mitigation occurred on the target.
* Extended by optional plugins (e.g. J-Popups-ABS) to surface map feedback.
* @param {Game_Actor|Game_Enemy} target The battler doing the mitigating.
* @param {number} value The amount of damage mitigated.
*/
Game_Action.prototype.onShieldDamageAbsorbed = function(target, value) {};
/**
* Lifecycle event: a shield broke on the target.
* Extended by optional plugins (e.g. J-Popups-ABS) to surface map feedback.
* @param {Game_Actor|Game_Enemy} target The battler with the shield breaking.
*/
Game_Action.prototype.onShieldBroken = function(target) {};

//#endregion
//#region src/plugins/abs/ext/shield/objects/Game_Actor.js
/**
* Extends {@link #shieldBreakSources}.<br/>
* Also adds actor-specific shield break skill sources.
*/
J.ABS.EXT.SHIELD.Aliased.Game_Actor.set("shieldBreakSources", Game_Actor.prototype.shieldBreakSources);
Game_Actor.prototype.shieldBreakSources = function() {
	const originalSources = J.ABS.EXT.SHIELD.Aliased.Game_Actor.get("shieldBreakSources").call(this);
	return [
		...originalSources,
		this.class(),
		...this.equips()
	];
};

//#endregion
//#region src/plugins/abs/ext/shield/sprites/Sprite_ActorValue.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the shield value.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set("initMembers", Sprite_ActorValue.prototype.initMembers);
Sprite_ActorValue.prototype.initMembers = function(actor, parameter, fontSizeMod) {
	J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get("initMembers").call(this, actor, parameter, fontSizeMod);
	/**
	* The last tracked shield value.
	* @type {string}
	*/
	this._j._last._shields = this.makeShieldValue();
};
/**
* A factory method to create the shield value string.
* @param {Game_Actor} actor The actor to generate the shield value for.
* @returns {string} The shield value as a string 'current / (total)'.
*/
Sprite_ActorValue.prototype.makeShieldValue = function(actor) {
	if (!actor) return String.empty;
	const currentShields = actor.currentShieldValue();
	if (currentShields === 0) return String.empty;
	let shieldLabel = `(${Math.round(currentShields)})`;
	if (actor.currentShieldStacks() > 1) {
		shieldLabel += `${actor.currentShieldStacks()}x🛡`;
	}
	return shieldLabel;
};
/**
* Gets the last tracked shield value.
* @returns {string}
*/
Sprite_ActorValue.prototype.getLastShieldValue = function() {
	return this._j._last._shields;
};
/**
* Sets the last tracked shield value.
* @param {string} value The shield value as a string 'current / (total)'.
*/
Sprite_ActorValue.prototype.setLastShieldValue = function(value) {
	this._j._last._shields = value;
};
/**
* Extends {@link #hasParameterChanged}.<br/>
* Also considers the shield values for change.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set("hasParameterChanged", Sprite_ActorValue.prototype.hasParameterChanged);
Sprite_ActorValue.prototype.hasParameterChanged = function() {
	const originalChange = J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get("hasParameterChanged").call(this);
	if (originalChange === true) return true;
	if (this.getParameter() === Window_PartyFrame.gaugeTypes.Shield) {
		const currentShieldValue = this.makeShieldValue(this.getActor());
		if (this.getLastShieldValue() !== currentShieldValue) {
			this.setLastShieldValue(currentShieldValue);
			return true;
		}
	}
	return false;
};
/**
* Extends {@link #getActorValue}.<br/>
* Also gets the shield value if applicable.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.set("getActorValue", Sprite_ActorValue.prototype.getActorValue);
Sprite_ActorValue.prototype.getActorValue = function() {
	const originalValue = J.ABS.EXT.SHIELD.Aliased.Sprite_ActorValue.get("getActorValue").call(this);
	if (originalValue !== null) return originalValue;
	if (this.getParameter() === Window_PartyFrame.gaugeTypes.Shield) {
		return this.makeShieldValue(this.getActor());
	}
	return null;
};

//#endregion
//#region src/plugins/abs/ext/shield/sprites/Sprite_ShieldMapGauge.js
/**
* An implementation of the {@link Sprite_MapGauge} that renders shields.
*/
var Sprite_ShieldMapGauge = class extends Sprite_MapGauge {
	/**
	* Constructor.
	* @param {number} bitmapWidth The width of the bitmap.
	* @param {number} bitmapHeight The height of the bitmap.
	* @param {number} gaugeHeight The actual visual gauge height.
	*/
	constructor(bitmapWidth, bitmapHeight, gaugeHeight) {
		super(bitmapWidth, bitmapHeight, gaugeHeight);
	}
	/**
	* Determines if this gauge can be updated.
	* @returns {boolean} True if the gauge can be updated, false otherwise.
	*/
	canUpdateShieldGauge() {
		if (!this.getBattler()) return false;
		return true;
	}
	/**
	* Gets the current value for this gauge.
	* For shield gauges: returns the total current shield across all active shield states.
	* For all other types: defers to the base implementation.
	* @returns {number}
	*/
	currentValue() {
		const battler = this.getBattler();
		if (!battler) {
			return NaN;
		}
		const currentShieldValue = battler.currentShieldValue();
		if (currentShieldValue === 0) {
			return NaN;
		}
		return currentShieldValue;
	}
	/**
	* Gets the max value for this gauge.
	* For shield gauges: returns the HP reference (mhp) so shield scale matches HP gauge.
	* For all other types: defers to the base implementation.
	* @returns {number}
	*/
	currentMaxValue() {
		const battler = this.getBattler();
		if (!battler) {
			return NaN;
		}
		const capShieldValue = battler.currentShieldCap();
		if (capShieldValue === 0) {
			return NaN;
		}
		return capShieldValue;
	}
	/**
	* Overwrites {@link #gaugeColor1}.<br/>
	* Returns the shield gauge color gradient 1.
	* @returns {string}
	*/
	gaugeColor1() {
		return ColorManager.shieldGauge1();
	}
	/**
	* Overwrites {@link #gaugeColor2}.<br/>
	* Returns the shield gauge color gradient 2.
	* @returns {string}
	*/
	gaugeColor2() {
		return ColorManager.shieldGauge2();
	}
	/**
	* Explicitly return an empty label for shield map gauges.
	* This isn’t strictly required once gaugeX() is 0, but adds clarity.
	* @returns {string}
	*/
	label() {
		return String.empty;
	}
};

//#endregion
//#region src/plugins/abs/ext/shield/sprites/Sprite_Character.js
/**
* Extends {@link #initGaugeMembers}.<br/>
* Adds the shield gauge slot to the gauge group.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set("initGaugeMembers", Sprite_Character.prototype.initGaugeMembers);
Sprite_Character.prototype.initGaugeMembers = function() {
	J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get("initGaugeMembers").call(this);
	/**
	* The shield gauge for this sprite.
	* @type {Sprite_ShieldMapGauge|null}
	*/
	this._j._abs._gauges._shieldGauge = null;
};
/**
* Extends {@link #setupMapSprite}.<br/>
* Also sets up the on-map shield gauge.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set("setupMapSprite", Sprite_Character.prototype.setupMapSprite);
Sprite_Character.prototype.setupMapSprite = function() {
	J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get("setupMapSprite").call(this);
	this.setupShieldGauge();
};
/**
* Sets up this character's shield gauge, to show shields as-needed.
*/
Sprite_Character.prototype.setupShieldGauge = function() {
	if (this._j._abs._gauges._shieldGauge) {
		this._j._abs._gauges._shieldGauge.setup(this.getBattler(), "shield");
		this._j._abs._gauges._shieldGauge.activateGauge();
		const sprite = this._j._abs._gauges._shieldGauge;
		const x = -Math.round(sprite.bitmapWidth() / 2);
		const y = 0;
		sprite.move(x, y);
		return;
	}
	const baseWidth = 96;
	const baseHeight = 6;
	const sprite = new Sprite_ShieldMapGauge(baseWidth, baseHeight, 6);
	sprite.setup(this.getBattler(), "shield");
	sprite.activateGauge();
	this._j._abs._gauges._shieldGauge = sprite;
	const x = -Math.round(sprite.bitmapWidth() / 2);
	const y = 0;
	sprite.move(x, y);
	this.addChild(sprite);
};
/**
* Extends {@link #updateGauges}.<br/>
* Also updates the shield gauge using the same pattern as HP/Cast.
*/
J.ABS.EXT.SHIELD.Aliased.Sprite_Character.set("updateGauges", Sprite_Character.prototype.updateGauges);
Sprite_Character.prototype.updateGauges = function() {
	J.ABS.EXT.SHIELD.Aliased.Sprite_Character.get("updateGauges").call(this);
	if (this.canUpdateShieldGauge()) {
		this.updateShieldGauge();
	} else {
		this.hideShieldGauge();
	}
};
/**
* Determines whether or not we can update the shield gauge.
* @returns {boolean} True if we can update the shield gauge, false otherwise.
*/
Sprite_Character.prototype.canUpdateShieldGauge = function() {
	if (!this.canUpdate()) return false;
	if (!this.isJabsBattler()) return false;
	if (!this._j._abs._gauges._shieldGauge) return false;
	const battler = this.getBattler();
	if (!battler) return false;
	if (battler.currentShieldValue() <= 0) return false;
	return true;
};
/**
* Updates the shield gauge sprite.
*/
Sprite_Character.prototype.updateShieldGauge = function() {
	this.showShieldGauge();
	const gauge = this._j._abs._gauges._shieldGauge;
	if (gauge) {
		gauge._battler = this.getBattler();
	}
};
/**
* Shows the shield gauge if it exists.
*/
Sprite_Character.prototype.showShieldGauge = function() {
	const gauge = this._j._abs._gauges._shieldGauge;
	if (gauge) {
		gauge.activateGauge();
		gauge.show();
	}
};
/**
* Hides the shield gauge if it exists.
*/
Sprite_Character.prototype.hideShieldGauge = function() {
	const gauge = this._j._abs._gauges._shieldGauge;
	if (gauge) {
		gauge.hide();
	}
};

//#endregion
//#region src/plugins/abs/ext/shield/core/registerShieldParameters.js
/**
* Registers shield amplification and effectiveness with the parameter catalog.
*/
function registerShieldParameters() {
	ParameterRegistry.register(ParameterDefinition.Builder().key("sar").group(ParameterGroups.SUPPORT).sortOrder(0).label(() => TextManager.sar()).description(() => TextManager.sarDescription()).iconIndex(() => IconManager.sar()).format(ParameterFormat.MULTIPLIER_PERCENT).getValue((battler) => battler.sar).sdpBinding(SdpParameterBinding.byKey("sar", () => 1)).build());
	ParameterRegistry.register(ParameterDefinition.Builder().key("ser").group(ParameterGroups.SUPPORT).sortOrder(1).label(() => TextManager.ser()).description(() => TextManager.serDescription()).iconIndex(() => IconManager.ser()).format(ParameterFormat.MULTIPLIER_PERCENT).getValue((battler) => battler.ser).sdpBinding(SdpParameterBinding.byKey("ser", () => 1)).build());
}
registerShieldParameters();

//#endregion
//#region src/plugins/abs/ext/shield/windows/Window_PartyFrame.js
if (J.HUD && J.HUD.EXT.PARTY) {
	/**
	* The type of gauge for shields.
	*/
	Window_PartyFrame.gaugeTypes.Shield = "shield";
	/**
	* Creates the key for an actor's shield gauge sprite based on the parameters.
	* @param {Game_Actor} actor The actor to draw a composite shield gauge for.
	* @param {boolean} isFull Whether or not this is for a full-sized sprite.
	* @returns {string} The key for this shield gauge sprite.
	*/
	Window_PartyFrame.prototype.makeShieldGaugeSpriteKey = function(actor, isFull) {
		const gaugeSize = isFull ? "full" : "mini";
		return `shield-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
	};
	/**
	* Creates a full-sized composite shield gauge sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a shield gauge sprite for.
	* @returns {Sprite_ShieldMapGauge} The shield gauge sprite.
	*/
	Window_PartyFrame.prototype.getOrCreateFullSizeShieldGaugeSprite = function(actor) {
		const key = this.makeShieldGaugeSpriteKey(actor, true);
		if (this._hudSprites.has(key)) {
			return this._hudSprites.get(key);
		}
		const hpGauge = this.getOrCreateFullSizeGaugeSprite(actor, Window_PartyFrame.gaugeTypes.HP);
		const bitmapWidth = hpGauge.bitmapWidth();
		const bitmapHeight = 8;
		const gaugeHeight = 8;
		const sprite = new Sprite_ShieldMapGauge(bitmapWidth, bitmapHeight, gaugeHeight);
		sprite.setup(actor, Window_PartyFrame.gaugeTypes.Shield);
		sprite.deactivateGauge();
		this._hudSprites.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	};
	/**
	* Creates a mini-sized composite shield gauge sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a shield gauge sprite for.
	* @returns {Sprite_ShieldMapGauge} The shield gauge sprite.
	*/
	Window_PartyFrame.prototype.getOrCreateMiniSizeShieldGaugeSprite = function(actor) {
		const key = this.makeShieldGaugeSpriteKey(actor, false);
		if (this._hudSprites.has(key)) {
			return this._hudSprites.get(key);
		}
		const hpGauge = this.getOrCreateMiniSizeGaugeSprite(actor, Window_PartyFrame.gaugeTypes.HP);
		const bitmapWidth = hpGauge.bitmapWidth();
		const bitmapHeight = 4;
		const gaugeHeight = 4;
		const sprite = new Sprite_ShieldMapGauge(bitmapWidth, bitmapHeight, gaugeHeight);
		sprite.setup(actor, Window_PartyFrame.gaugeTypes.Shield);
		sprite.deactivateGauge();
		this._hudSprites.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	};
	/**
	* Creates the key for an actor's shield value sprite.
	* @param {Game_Actor} actor The actor to draw a shield value sprite for.
	* @returns {string} The key for this shield value sprite.
	*/
	Window_PartyFrame.prototype.makeShieldValueSpriteKey = function(actor) {
		return `shield-values-full-${actor.name()}-${actor.actorId()}`;
	};
	/**
	* Creates a full-sized shield value sprite for the given actor and caches it.
	* Only used for the party leader.
	* @param {Game_Actor} actor The actor to draw a shield value sprite for.
	* @returns {Sprite_ActorValue} The shield value sprite.
	*/
	Window_PartyFrame.prototype.getOrCreateShieldValueSprite = function(actor) {
		const key = this.makeShieldValueSpriteKey(actor);
		if (this._hudSprites.has(key)) {
			return this._hudSprites.get(key);
		}
		const sprite = new Sprite_ActorValue(actor, Window_PartyFrame.gaugeTypes.Shield, -6);
		this._hudSprites.set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	};
	/**
	* Creates all sprites for this hud and caches them.
	*/
	J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set("createCache", Window_PartyFrame.prototype.createCache);
	Window_PartyFrame.prototype.createCache = function() {
		J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get("createCache").call(this);
		$gameParty.battleMembers().forEach((actor) => {
			this.getOrCreateFullSizeShieldGaugeSprite(actor);
			this.getOrCreateMiniSizeShieldGaugeSprite(actor);
		});
	};
	/**
	* Extends {@link #drawLeaderResourceGauges}.<br/>
	* Calls original, then overlays the composite shield gauge on the HP gauge.
	* @param {number} x The x coordinate of the leader resource gauge group.
	* @param {number} y The y coordinate of the leader resource gauge group.
	*/
	J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set("drawLeaderResourceGauges", Window_PartyFrame.prototype.drawLeaderResourceGauges);
	Window_PartyFrame.prototype.drawLeaderResourceGauges = function(x, y) {
		J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get("drawLeaderResourceGauges").call(this, x, y);
		this.drawLeaderShieldGauge(x, y);
	};
	/**
	* Draws the composite shield gauge on the HP gauge.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	Window_PartyFrame.prototype.drawLeaderShieldGauge = function(x, y) {
		const leader = $gameParty.leader();
		const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
		const overlayH = 4;
		const overlayY = y + Math.floor((hpGauge.bitmapHeight() - overlayH) / 2) - 14;
		const shield = this.getOrCreateFullSizeShieldGaugeSprite(leader);
		shield.activateGauge();
		const shieldX = x;
		shield.move(shieldX, overlayY);
		shield.show();
		const shieldValues = this.getOrCreateShieldValueSprite(leader);
		const shieldValuesX = x + 12;
		shieldValues.move(shieldValuesX, overlayY - 12);
		shieldValues.show();
	};
	/**
	* Extends {@link #drawAllyGauges}.<br/>
	* Calls original, then overlays the composite shield gauge on the ally HP gauge.
	* @param {Game_Actor} ally The ally to draw the gauges for.
	* @param {number} x The x coordinate.
	* @param {number} oy The original y coordinate.
	*/
	J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.set("drawAllyGauges", Window_PartyFrame.prototype.drawAllyGauges);
	Window_PartyFrame.prototype.drawAllyGauges = function(ally, x, oy) {
		J.ABS.EXT.SHIELD.Aliased.Window_PartyFrame.get("drawAllyGauges").call(this, ally, x, oy);
		this.drawAllyShieldGauge(ally, x, oy);
	};
	/**
	* Draws the composite shield gauge on the ally HP gauge.
	* @param {Game_Actor} ally The ally to draw the shield gauge for.
	* @param {number} x The x coordinate.
	* @param {number} oy The original y coordinate.
	*/
	Window_PartyFrame.prototype.drawAllyShieldGauge = function(ally, x, oy) {
		const lh = 12;
		const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.HP);
		const overlayH = 3;
		const hpY = oy + lh * 0;
		const overlayY = hpY + Math.floor((hpGauge.bitmapHeight() - overlayH) / 2) - 6;
		const shield = this.getOrCreateMiniSizeShieldGaugeSprite(ally);
		shield.activateGauge();
		const shieldX = x;
		shield.move(shieldX, overlayY);
		shield.show();
	};
}

//#endregion
//# sourceMappingURL=J-ABS-Shield.js.map