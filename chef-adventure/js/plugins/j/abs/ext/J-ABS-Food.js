//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 ABS-FOOD] A JABS extension enabling food group chain states and a dedicated R2 food slot.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-ABS-InputManager
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds food group chain states, a dedicated R2 food slot, and an
 * ABS quick-menu Equip Food screen. It depends on J-ABS core for the general
 * <applyStateOnExpire> state-chaining mechanic.
 *
 * ============================================================================
 * FOOD ITEMS:
 * Tag any item with <food:TYPE> to designate it as a food item.
 * TYPE is the lowercase chain group key (e.g. protein, vegetable, fruit).
 * Food items are routed to the R2 food slot and excluded from the tool slot.
 *
 *    <food:TYPE>
 *
 * Example:
 *    <food:protein>
 *
 * ============================================================================
 * FOOD CHAIN STATES:
 * Tag every state that belongs to a food arc with the group name:
 *    <foodChain:TYPE>
 *  Where TYPE is a lower-case string (protein, vegetable, fruit, grain,
 *  dairy, confection, etc.). All states in one arc share TYPE.
 *
 * Chain progression is authored entirely via <applyStateOnExpire> (J-ABS
 * core). The Well Fed entry state expires into the peak, the peak expires
 * into the tail, and the tail has no expire link (natural end of chain).
 *
 * DURATION (required for arcs longer than ~2.8 minutes):
 * Use J-ABS core {@code <stateDuration:FRAMES>} on each phase state (see J-ABS
 * annotations). Chef Adventure targets: ca/docs/food/food-chain-durations.md
 *
 * Example three-phase Protein chain:
 *   State "Well Fed (Protein)"  → <foodChain:protein>  <applyStateOnExpire:[PUMPED_ID, 100]>
 *   State "Pumped"              → <foodChain:protein>  <applyStateOnExpire:[HANGRY_ID, 100]>
 *   State "Hangry"              → <foodChain:protein>  (no expire link — chain ends)
 *
 * ============================================================================
 * FOOD CHAIN BAR COLOR:
 * Tag any phase state in a food chain arc with a hex color to control how its
 * segment renders in the food chain HUD bar:
 *    <foodGroupColor:#RRGGBB>
 *  Where #RRGGBB is a six-digit hex color string.
 *
 * Example:
 *    <foodGroupColor:#44cc44>
 *
 * A phase state with no color tag renders as a neutral grey segment instead.
 * ============================================================================
 * ENDING A CHAIN (METABOLIZE):
 * Tag a skill so that executing it ends the caster's active food arc:
 *
 *    <endFoodChain>
 *
 * There is no tail phase and no consolation state; the arc is simply over.
 * This is what makes a "metabolize" skill cost the meal that fuelled it.
 *
 * Pair it with J-ABS core's <slotTransform:[UsableItem, SKILL_ID]> on each
 * phase state to turn the R2 button into that skill for as long as the arc
 * runs — eat when empty, burn the meal when full. Because the tag is read off
 * the executed skill rather than tracked through whatever dispatched it, an
 * enemy attack may carry it too and take the player's meal away.
 *
 * OMITTING THE TAG IS A DESIGN CHOICE, NOT AN OVERSIGHT. A skill that burns
 * fuel without spending the arc is an endurance move, bounded by the chain's
 * own duration rather than by a single use. Nothing warns about its absence.
 *
 * ============================================================================
 * FOOD CHAIN IMMUNITY:
 * Any battler whose getAllNotes() sources include the following tag keeps
 * their arc through a chain-ending skill. This tag may appear on any passive
 * state, accessory, class, or other note-bearing database object.
 *
 *    <foodChainImpervious>
 *
 * The bearer still executes the skill and still receives everything it does;
 * they simply do not spend the meal. This is the capstone form of food
 * mastery — fullness stops being ammunition and becomes a standing condition.
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Food chains gained a second type, an alternative to healing.
 *    Retired Overstuffed along with it: <overstuffedImpervious> is gone, replaced by
 *    <foodChainImpervious>, and <endFoodChain> now closes a chain outright.
 * - 1.1.0
 *    The Well Fed entry state names the leader as its source, so it applies as a JABS
 *    state and its expiry advances the chain. Without one it landed as an inert
 *    vanilla state that never expired, and the arc never started.
 *    An item declaring a food group nothing registered now warns and names the groups
 *    that do exist, rather than being eaten to no effect in silence.
 * - 1.0.3
 *    Routed the missing-duration authoring warning through J-Base's new
 *    Diagnostics, so it names J-ABS-Food in the console rather than the
 *    J-ABS-FOOD spelling this ship never actually shipped under.
 * - 1.0.2
 *    Repointed the last-item-consumed log at J-Log's new $mapLogs registry.
 *    The $lootLogManager global this called is gone. Requires J-Log 3.0.0
 *    when J-Log is installed at all.
 * - 1.0.1
 *    Corrected PLUGIN_NAME from J-ABS-FOOD to J-ABS-Food, matching the name the
 *    ship has always been built and shipped under.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * PLUGIN PARAMETERS:
 * @param equipFoodText
 * @type string
 * @text Equip Food Label
 * @desc The label shown in the JABS quick-menu for the Equip Food command.
 * @default Equip Food
 */
//=================================================================================================
/* eslint-enable max-len */
//endregion annotations

//#region src/plugins/abs/ext/food/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-ABS-FOOD.
* Exposes the equip food label used in the JABS quick-menu.
* The Overstuffed chain entry state is resolved from the boot-time registry
* rather than from an explicit parameter.
*/
var JFood_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version string.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	* The Overstuffed entry state is now resolved from the boot-time chain registry
	* rather than from an explicit plugin parameter.
	*/
	initializeMetadata() {
		this.EquipFoodText = String(this.parsedPluginParameters["equipFoodText"] ?? "Equip Food");
	}
};

//#endregion
//#region src/plugins/abs/ext/food/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
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
* The plugin umbrella for all things belonging to J-ABS-FOOD.
*/
J.ABS.EXT.FOOD ||= {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.FOOD.Metadata = new JFood_PluginMetadata("J-ABS-Food", "2.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.FOOD.Aliased = {
	JABS_Battler: new Map(),
	JABS_Engine: new Map(),
	JABS_SkillSlotManager: new Map(),
	Game_Actor: new Map(),
	Input: new Map(),
	Scene_Boot: new Map(),
	Window_JabsRemapActions: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.FOOD.RegExp = {
	/**
	* Marks an item as a food item and declares its food group type.
	* Value is the lowercase group key used to look up the chain plan in the registry.
	* Example: <food:protein>
	*/
	Food: /<food:[ ]?([a-zA-Z]+)>/i,
	/**
	* Identifies which food group chain a state belongs to.
	* Value is the group type string, e.g. protein, vegetable, fruit.
	*/
	FoodChain: /<foodChain:[ ]?([a-zA-Z]+)>/i,
	/**
	* The hex color for this state's segment in the food chain bar.
	* Value is a six-digit hex string, e.g. #44cc44.
	*/
	FoodGroupColor: /<foodGroupColor:[ ]?(#[0-9A-Fa-f]{6})>/i,
	/**
	* Boolean tag: executing this skill ends the caster's active food chain.
	*
	* This is what makes a metabolize skill cost the meal. Its absence is a design choice rather
	* than an oversight. A skill that burns fuel without consuming the arc is an endurance move,
	* bounded by the chain's own duration instead of by a single use.
	*
	* <pre>
	* Structure:
	*  <endFoodChain>
	*
	* Example:
	*  <endFoodChain>
	*
	* Translation:
	*  when this skill executes, whatever food arc the caster is in ends immediately
	* </pre>
	* @type {RegExp}
	*/
	EndFoodChain: /<endFoodChain>/i,
	/**
	* Boolean tag: the bearer's food chains never end from {@link #EndFoodChain}.
	*
	* The bearer still executes the skill and still receives everything it does; they simply keep
	* the arc they were in. May live on any note-bearing database object readable via
	* {@code getAllNotes()}: passive, equip, state, class or the battler's own row.
	*
	* <pre>
	* Structure:
	*  <foodChainImpervious>
	*
	* Example:
	*  <foodChainImpervious>
	*
	* Translation:
	*  this bearer metabolizes without ever spending the meal
	* </pre>
	* @type {RegExp}
	*/
	FoodChainImpervious: /<foodChainImpervious>/i
};

//#endregion
//#region src/plugins/abs/ext/food/database/RPG_Item.js
/**
* The food group chain type declared on this item, or null when the item is not food.<br/>
* Sourced from the {@code <food:TYPE>} notetag where TYPE is a lowercase key that maps
* to an entry in the boot-time {@link JABS_FoodChainPlan} registry (e.g. 'protein',
* 'vegetable', 'overstuffed'). Items without this tag are not routed to the R2 food
* slot and are treated as tools instead.
* @type {string|null}
*/
Object.defineProperty(RPG_Item.prototype, "jabsFoodType", { get: function() {
	const raw = RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.FOOD.RegExp.Food, true);
	if (raw === null) return null;
	return raw.toLowerCase();
} });

//#endregion
//#region src/plugins/abs/ext/food/database/RPG_Skill.js
/**
* Whether or not executing this skill ends the caster's active food chain.<br/>
* Sourced from the {@code <endFoodChain>} boolean notetag.
*
* A metabolize skill carries this because burning the meal is what it costs. A skill that
* deliberately omits it burns fuel without spending the arc: an endurance move bounded by the
* chain's own duration rather than by a single use. Absence is therefore an authoring decision,
* not an omission, and nothing warns about it.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsEndsFoodChain", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.FOOD.RegExp.EndFoodChain);
} });

//#endregion
//#region src/plugins/abs/ext/food/database/RPG_State.js
/**
* The food group chain type this state belongs to, if any.<br/>
* Returns the lower-cased type string (e.g. 'protein', 'vegetable') or null
* when the state is not part of any food chain arc.
* @type {string|null}
*/
Object.defineProperty(RPG_State.prototype, "jabsFoodChainType", { get: function() {
	const raw = RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.FOOD.RegExp.FoodChain, true);
	if (raw === null) return null;
	return raw.toLowerCase();
} });
/**
* The hex color string for this state's segment in the food chain bar.<br/>
* Sourced from the {@code <foodGroupColor:#RRGGBB>} notetag. Returns null when
* no tag is present; the bar renderer will fall back to a neutral grey.
* @type {string|null}
*/
Object.defineProperty(RPG_State.prototype, "jabsFoodGroupColor", { get: function() {
	const raw = RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.FOOD.RegExp.FoodGroupColor, true);
	if (raw === null) return null;
	return raw;
} });

//#endregion
//#region src/plugins/abs/ext/food/models/JABS_FoodChainSegment.js
/**
* Represents a single link in a food chain arc.
*
* Each segment corresponds to one database state in the chain, ordered from the
* entry state (Well Fed) through any peak states to the tail. Instances are built
* once by {@link JABS_FoodChainPlan._walkChain} during boot-time registry construction
* and treated as read-only thereafter.
*/
var JABS_FoodChainSegment = class {
	/**
	* The database state id for this chain link.
	* @type {number}
	*/
	stateId = 0;
	/**
	* The food group chain type this state belongs to (e.g. 'protein', 'overstuffed').
	* Sourced from the {@code <foodChain:TYPE>} notetag on the state.
	* @type {string}
	*/
	chainType = "";
	/**
	* The duration of this state in frames, from {@link RPG_State#jabsStateDurationFrames}
	* ({@code <stateDuration>} / {@code <stateDurationSec>}, else {@code stepsToRemove}).
	* At 60 fps, a value of 600 equals 10 seconds of duration.
	* @type {number}
	*/
	frames = 0;
	/**
	* The hex color string for this segment's bar fill (e.g. '#44cc44').
	* Sourced from the {@code <foodGroupColor:#RRGGBB>} notetag on the state.
	* Defaults to a neutral grey when no tag is present on the state.
	* @type {string}
	*/
	color = "#888888";
	/**
	* Constructor.
	* @param {number} stateId The database id of this state in the chain.
	* @param {string} chainType The food group chain type key (lowercase).
	* @param {number} frames Total duration in frames ({@link RPG_State#jabsStateDurationFrames}).
	* @param {string} color The hex color string for this segment's bar fill.
	*/
	constructor(stateId, chainType, frames, color) {
		this.stateId = stateId;
		this.chainType = chainType;
		this.frames = frames;
		this.color = color;
	}
};

//#endregion
//#region src/plugins/abs/ext/food/models/JABS_FoodChainPlan.js
/**
* Represents the pre-walked arc of a single food chain, built once at boot for every
* distinct food group type found in the state database.
*
* Instances are stored in a static registry keyed by the lowercase chain type string
* (e.g. 'protein', 'vegetable', 'overstuffed'). Retrieve a plan at runtime via
* {@link JABS_FoodChainPlan.forChainType} rather than constructing one directly.
*
* The HUD reads this plan to paint the bar and label the phases without re-walking
* the database every frame.
*/
var JABS_FoodChainPlan = class JABS_FoodChainPlan {
	/**
	* The boot-time registry of all known food chain plans.
	* Keyed by lowercase chain type string; values are fully-built plan instances.
	* Populated once by {@link JABS_FoodChainPlan.buildRegistry} and never mutated
	* afterward.
	* @type {Map<string, JABS_FoodChainPlan>}
	*/
	static _registry = new Map();
	/**
	* Builds the complete registry of food chain plans by scanning {@code $dataStates}.
	* Must be called exactly once, from {@code Scene_Boot.prototype.start}, after the
	* database has finished loading.
	*
	* Algorithm:
	*   1. Collect all state ids that carry {@code <foodChain:TYPE>}.
	*   2. From those, identify which ids are referenced by another food-chain state's
	*      {@code applyStateOnExpire} link — these are mid-chain or tail nodes.
	*   3. Entry states = food-chain states NOT referenced by any other food-chain state.
	*   4. Walk from each entry state to produce an ordered {@link JABS_FoodChainSegment}
	*      array, enforcing type consistency and detecting cycles.
	*   5. Store the resulting {@link JABS_FoodChainPlan} keyed by chain type.
	*
	* Throws an {@link Error} immediately if:
	*   - a cycle is detected in any chain walk, or
	*   - two entry states claim the same chain type (duplicate authoring error).
	*/
	static buildRegistry() {
		JABS_FoodChainPlan._registry.clear();
		const foodChainStateIds = $dataStates.filter((state) => state && state.id > 0 && state.jabsFoodChainType !== null).map((state) => state.id);
		const referencedIds = new Set();
		for (const id of foodChainStateIds) {
			const expireData = $dataStates[id].jabsApplyStateOnExpire;
			if (expireData !== null && expireData !== undefined) {
				referencedIds.add(expireData.stateId);
			}
		}
		const entryStateIds = foodChainStateIds.filter((id) => !referencedIds.has(id));
		for (const entryId of entryStateIds) {
			const plan = JABS_FoodChainPlan._walkChain(entryId);
			const chainType = $dataStates[entryId].jabsFoodChainType;
			if (JABS_FoodChainPlan._registry.has(chainType)) {
				const existingEntryId = JABS_FoodChainPlan._registry.get(chainType).getEntry().stateId;
				throw new Error(`J-ABS-FOOD: Duplicate food chain type '${chainType}' detected. ` + `States ${existingEntryId} and ${entryId} both claim to be the entry for '${chainType}'. ` + `Each chain type must have exactly one entry state in the database.`);
			}
			JABS_FoodChainPlan._registry.set(chainType, plan);
		}
	}
	/**
	* Returns the pre-built {@link JABS_FoodChainPlan} for the given chain type key.
	* The registry must have been built by {@link JABS_FoodChainPlan.buildRegistry}
	* before this is called.
	* @param {string} typeKey The lowercase chain type string (e.g. 'protein').
	* @returns {JABS_FoodChainPlan|null} The plan, or null if the type is not registered.
	*/
	static forChainType(typeKey) {
		return JABS_FoodChainPlan._registry.get(typeKey) ?? null;
	}
	/**
	* Lists every chain type the boot-time walk actually registered.
	*
	* This exists for diagnostics rather than for gameplay: when an item declares a food group that
	* resolves to nothing, the useful half of the report is not the key that missed but the set of
	* keys that would have hit, because the gap between them is usually a typo or a chain whose
	* entry state was never authored.
	* @returns {string[]} The registered chain type keys.
	*/
	static registeredChainTypes() {
		return Array.from(JABS_FoodChainPlan._registry.keys());
	}
	/**
	* Walks the natural-expiry chain starting at the given entry state id, producing an
	* ordered {@link JABS_FoodChainSegment} array.
	*
	* Walk rules:
	*   - Each visited state must carry {@code <foodChain:TYPE>}; a linked state without
	*     it is considered outside the food system and terminates the walk.
	*   - If a state id is encountered a second time, the data contains a cycle — a
	*     descriptive {@link Error} is thrown immediately so the bad data is caught on boot.
	*   - The walk is capped at 16 segments as a hard ceiling against runaway data.
	* @param {number} entryStateId The database id of the Well Fed entry state.
	* @returns {JABS_FoodChainPlan} The completed plan.
	*/
	static _walkChain(entryStateId) {
		const maxSegments = 16;
		const segments = [];
		const visited = new Set();
		const pathIds = [];
		let currentId = entryStateId;
		while (currentId > 0 && segments.length < maxSegments) {
			if (visited.has(currentId)) {
				const cycleStr = [...pathIds, currentId].join(" → ");
				throw new Error(`J-ABS-FOOD: Food chain cycle detected: ${cycleStr}. ` + `Review the <applyStateOnExpire> tags on those states and break the loop.`);
			}
			visited.add(currentId);
			pathIds.push(currentId);
			const state = $dataStates[currentId];
			if (!state) break;
			const chainType = state.jabsFoodChainType ?? "unknown";
			const frames = state.jabsStateDurationFrames ?? 0;
			const color = state.jabsFoodGroupColor ?? "#888888";
			if (frames > 0 && frames <= 9999 && state.jabsFoodChainType !== null) {
				const hasDurationTag = RPGManager.getNumberFromNoteByRegex(state, J.ABS.RegExp.StateDuration, true) !== null;
				const hasDurationSecTag = RPGManager.getNumberFromNoteByRegex(state, J.ABS.RegExp.StateDurationSec, true) !== null;
				if (hasDurationTag === false && hasDurationSecTag === false) {
					const seconds = Math.round(frames / 60);
					const fallback = `using stepsToRemove=${frames} (~${seconds}s)`;
					const remedy = "add <stateDuration:FRAMES> per ca/docs/food/food-chain-durations.md.";
					const message = `state ${currentId} (${state.name}) has <foodChain> but no <stateDuration>`;
					Diagnostics.warn("J-ABS-Food", `${message} - ${fallback}. ${remedy}`);
				}
			}
			segments.push(new JABS_FoodChainSegment(currentId, chainType, frames, color));
			const expireData = state.jabsApplyStateOnExpire;
			if (expireData === null || expireData === undefined) break;
			const nextId = expireData.stateId;
			const nextState = $dataStates[nextId];
			if (!nextState || nextState.jabsFoodChainType === null) break;
			currentId = nextId;
		}
		return new JABS_FoodChainPlan(segments);
	}
	/**
	* The ordered list of state segments comprising this chain arc, from entry to tail.
	* @type {Array<JABS_FoodChainSegment>}
	*/
	segments = [];
	/**
	* Constructor.
	* @param {Array<JABS_FoodChainSegment>} segments The ordered chain arc from entry to tail.
	*/
	constructor(segments) {
		this.segments = segments;
	}
	/**
	* Returns the entry (Well Fed) segment — the first link in the chain.
	* Returns null for an empty plan.
	* @returns {JABS_FoodChainSegment|null}
	*/
	getEntry() {
		return this.segments[0] ?? null;
	}
	/**
	* Whether this plan has any segments at all.
	* An empty plan means the registry walk failed (bad entry state id, missing data, etc).
	* @returns {boolean} True if the plan has at least one segment.
	*/
	isEmpty() {
		return this.segments.length === 0;
	}
	/**
	* Returns the index of the segment whose stateId matches the given id,
	* or -1 when the id is not part of this plan.
	* @param {number} stateId The state id to locate within this plan.
	* @returns {number} The zero-based segment index, or -1 if not found.
	*/
	indexOfState(stateId) {
		return this.segments.findIndex((segment) => segment.stateId === stateId);
	}
	/**
	* Returns the phase label for the segment at the given index.
	* Index 0 is always the Well Fed (entry) phase; the last index is always the tail.
	* Everything in between is a peak phase.
	* @param {number} index The segment index.
	* @returns {'wellFed'|'peak'|'tail'} The phase label for that position.
	*/
	phaseAtIndex(index) {
		if (index === 0) return "wellFed";
		if (index === this.segments.length - 1) return "tail";
		return "peak";
	}
};

//#endregion
//#region src/plugins/abs/ext/food/models/JABS_FoodChainResolver.js
/**
* A stateless utility class that owns all eat-event decision logic for the
* J-ABS-FOOD extension. Methods here operate on game state but hold no state
* themselves; every call reads from $gameParty, $jabsEngine, and the database.
*
* Call {@link JABS_FoodChainResolver.resolveEat} when a food item is consumed
* via the R2 slot. All other public methods expose individual phases of that
* decision tree for reuse (e.g. from the HUD or chain-type query).
*/
var JABS_FoodChainResolver = class JABS_FoodChainResolver {
	/**
	* Strips all currently active food-chain states from all living party members.
	* Uses {@code battler.removeState(id)} (forced removal) so that applyStateOnExpire
	* does NOT fire — we are intentionally clearing the chain, not advancing it.
	* @param {Game_Actor[]} members The party members to strip states from.
	*/
	static stripFoodChainStates(members) {
		members.forEach((member) => {
			const foodStateIds = member.states().filter((state) => state.jabsFoodChainType !== null).map((state) => state.id);
			foodStateIds.forEach((id) => member.removeState(id));
		});
	}
	/**
	* Returns the first active food-chain type found on the given battler, or null.
	* The type is a string like 'protein', 'vegetable', etc. from the database tag.
	* @param {Game_Actor} battler The battler to inspect for active food chain states.
	* @returns {string|null} The chain type string, or null if no food chain is active.
	*/
	static getActiveFoodChainType(battler) {
		const foodState = battler.states().find((state) => state.jabsFoodChainType !== null);
		if (!foodState) return null;
		return foodState.jabsFoodChainType;
	}
	/**
	* Derives the current chain phase for a battler relative to a given plan.
	* Returns 'wellFed', 'peak', 'tail', or null when no plan or no matching
	* active state is found.
	* @param {Game_Actor} battler The battler to inspect.
	* @param {JABS_FoodChainPlan} plan The plan to check phases against.
	* @returns {'wellFed'|'peak'|'tail'|null} The current phase label.
	*/
	static getPhase(battler, plan) {
		if (!plan || plan.isEmpty()) return null;
		for (const segment of plan.segments) {
			if (!battler.isStateAffected(segment.stateId)) continue;
			const index = plan.indexOfState(segment.stateId);
			return plan.phaseAtIndex(index);
		}
		return null;
	}
	/**
	* Returns true when the given battler's notes contain the foodChainImpervious tag.
	*
	* An impervious battler still executes a chain-ending skill and still receives everything it
	* does- they simply keep the arc they were in. This is the capstone form of food mastery: the
	* meal stops being the ammunition and becomes a standing condition.
	* @param {Game_Actor} battler The battler to inspect for immunity.
	* @returns {boolean} True if the battler keeps their chain through an ending skill.
	*/
	static hasFoodChainImpervious(battler) {
		if (!battler) return false;
		const notes = battler.getAllNotes();
		return RPGManager.checkForBooleanFromAllNotesByRegex(notes, J.ABS.EXT.FOOD.RegExp.FoodChainImpervious);
	}
	/**
	* Ends the given battler's active food chain, as demanded by a skill tagged
	* {@code <endFoodChain>}.
	*
	* This is the other half of metabolizing: the skill delivers whatever it delivers through the
	* ordinary action pipeline, and this clears the arc that paid for it. Imperviousness is checked
	* here rather than at the call site so that every future path into chain-ending inherits it.
	* @param {Game_Actor} battler The battler whose chain should end.
	*/
	static resolveEndFoodChain(battler) {
		if (!battler) return;
		if (JABS_FoodChainResolver.hasFoodChainImpervious(battler)) return;
		JABS_FoodChainResolver.stripFoodChainStates([battler]);
	}
	/**
	* Executes the full eat event for a food item consumed via the R2 food slot.
	*
	* Decision tree:
	*   - Always: heal/MP/TP/cure effects applied to all party members (skip code 21).
	*   - Resolve the food group type from the item's {@code <food:TYPE>} tag.
	*   - Look up the pre-built chain plan from the registry.
	*   - No active chain → apply Well Fed entry state, store plan.
	*   - Any active chain → strip all chains, apply new Well Fed, store plan.
	*
	* @param {number} itemId The database id of the food item consumed.
	* @param {JABS_Battler} jabsBattler The JABS battler eating the item (the map leader).
	*/
	static resolveEat(itemId, jabsBattler) {
		const item = $dataItems[itemId];
		if (!item) return;
		const foodType = item.jabsFoodType;
		if (!foodType) return;
		const newPlan = JABS_FoodChainPlan.forChainType(foodType);
		if (!newPlan) {
			Diagnostics.warn("J-ABS-Food", `no food chain is registered for type: [ ${foodType} ].`, () => ({
				itemId,
				itemName: item.name,
				registeredTypes: JABS_FoodChainPlan.registeredChainTypes()
			}));
			return;
		}
		const leader = $gameParty.leader();
		const members = $gameParty.battleMembers();
		JABS_FoodChainResolver.#applyFoodBuffetEffects(item, members, jabsBattler);
		const entryStateId = newPlan.getEntry().stateId;
		const currentChainType = JABS_FoodChainResolver.getActiveFoodChainType(leader);
		const leaderUuid = jabsBattler.getUuid();
		if (currentChainType === null) {
			JABS_FoodChainResolver.#startFoodChain(leader, entryStateId, leaderUuid, newPlan);
		} else {
			JABS_FoodChainResolver.#stripAndStartFoodChain(members, leader, entryStateId, leaderUuid, newPlan);
		}
	}
	/**
	* Applies all food item effects to all party members, explicitly skipping
	* effect code 21 (Add State) so that chain states are handled separately.
	*
	* This provides the buffet-style healing experience: everyone gets the HP/MP/TP
	* regen and cure effects, but food chain states only land on the leader.
	* @param {RPG_Item} item The food item data.
	* @param {Game_Actor[]} members All battle members to apply effects to.
	* @param {JABS_Battler} jabsBattler The consuming JABS battler (for animation).
	*/
	static #applyFoodBuffetEffects(item, members, jabsBattler) {
		members.forEach((member) => {
			const gameAction = new Game_Action(member, false);
			gameAction.setItem(item.id);
			item.effects.forEach((effect) => {
				if (effect.code === Game_Action.EFFECT_ADD_STATE) return;
				gameAction.applyItemEffect(member, effect);
			});
		});
		const leaderAction = new Game_Action($gameParty.leader(), false);
		leaderAction.setItem(item.id);
		leaderAction.applyGlobal();
		jabsBattler.showAnimation(item.animationId);
	}
	/**
	* Applies the Well Fed entry state to the leader and registers the given plan
	* on the engine. Use when no chain was active (clean start).
	* @param {Game_Actor} leader The party leader actor.
	* @param {number} entryStateId The Well Fed state id to apply.
	* @param {string} leaderUuid The UUID of the leader's JABS battler.
	* @param {JABS_FoodChainPlan} plan The pre-built registry plan for this food group.
	*/
	static #startFoodChain(leader, entryStateId, leaderUuid, plan) {
		leader.addState(entryStateId, leader);
		$jabsEngine.setFoodChainPlanByUuid(leaderUuid, plan);
	}
	/**
	* Strips all food chain states from all members, then starts the new chain
	* on the leader. Use for tail rescue and Field Medic re-feed.
	* @param {Game_Actor[]} members All party members to strip food states from.
	* @param {Game_Actor} leader The party leader actor.
	* @param {number} entryStateId The new Well Fed state id to apply.
	* @param {string} leaderUuid The UUID of the leader's JABS battler.
	* @param {JABS_FoodChainPlan} plan The pre-built registry plan for this food group.
	*/
	static #stripAndStartFoodChain(members, leader, entryStateId, leaderUuid, plan) {
		JABS_FoodChainResolver.stripFoodChainStates(members);
		JABS_FoodChainResolver.#startFoodChain(leader, entryStateId, leaderUuid, plan);
	}
};

//#endregion
//#region src/plugins/abs/ext/food/models/JABS_Battler.js
/**
* Extends {@link JABS_Battler.prototype.applyUsableItemEffects}.<br>
* When the item in the usable-item slot carries a {@code <food:TYPE>} tag, the standard
* Game_Action scope path is bypassed in favor of {@link JABS_FoodChainResolver.resolveEat},
* which applies buffet-style heals to the full party and manages the food chain arc on
* the leader. All other items (no food tag) fall through to core behavior unchanged.
* @param {number} itemId The id of the item being consumed.
* @param {boolean} isLoot Whether this is a loot pickup (skip consume + cooldown).
*/
J.ABS.EXT.FOOD.Aliased.JABS_Battler.set("applyUsableItemEffects", JABS_Battler.prototype.applyUsableItemEffects);
JABS_Battler.prototype.applyUsableItemEffects = function(itemId, isLoot = false) {
	const item = $dataItems[itemId];
	if (!item || item.jabsFoodType === null) {
		J.ABS.EXT.FOOD.Aliased.JABS_Battler.get("applyUsableItemEffects").call(this, itemId, isLoot);
		return;
	}
	const battler = this.getBattler();
	battler.consumeItem(item);
	battler.getSkillSlotManager().getUsableItemSlot().flagSkillSlotForRefresh();
	JABS_FoodChainResolver.resolveEat(itemId, this);
	this.createToolLog(item);
	if (!$gameParty.items().includes(item)) {
		battler.getSkillSlotManager().clearSlot(JABS_Button.UsableItem);
		const lastUsedLog = new LootLogBuilder().setupUsedLastItem(item.id).build();
		$mapLogs.loot.addLog(lastUsedLog);
	} else {
		this.modCooldownCounter(JABS_Button.UsableItem, J.ABS.DefaultValues.CooldownlessItems);
	}
};

//#endregion
//#region src/plugins/abs/ext/food/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.prototype.onExecuteMapAction}.<br>
* Ends the caster's food chain when the executed skill is tagged {@code <endFoodChain>}.
*
* This is the seam the whole metabolize loop hangs on. Core resolves the food slot to a skill and
* executes it like any other; the food extension never dispatches anything and so cannot know a
* burn happened- except here, where every executed action passes through. Reading the tag off the
* skill rather than tracking the dispatch is what lets an enemy attack take a meal away too.
* @param {JABS_Battler} caster The JABS battler executing the action.
* @param {JABS_Action} action The action being executed.
*/
J.ABS.EXT.FOOD.Aliased.JABS_Engine.set("onExecuteMapAction", JABS_Engine.prototype.onExecuteMapAction);
JABS_Engine.prototype.onExecuteMapAction = function(caster, action) {
	J.ABS.EXT.FOOD.Aliased.JABS_Engine.get("onExecuteMapAction").call(this, caster, action);
	if (!action.getBaseSkill().jabsEndsFoodChain) return;
	JABS_FoodChainResolver.resolveEndFoodChain(caster.getBattler());
};
/**
* Extends {@link JABS_Engine.prototype.initialize}.<br>
* Adds the _foodChainPlans Map which stores one JABS_FoodChainPlan per actor
* UUID. The map survives map transfers so the HUD can repaint on the next map
* without needing the player to re-eat (mirrors the _jabsStates pattern).
* @param {boolean} isMapTransfer Whether this init is a map-transfer event.
*/
J.ABS.EXT.FOOD.Aliased.JABS_Engine.set("initialize", JABS_Engine.prototype.initialize);
JABS_Engine.prototype.initialize = function(isMapTransfer = true) {
	J.ABS.EXT.FOOD.Aliased.JABS_Engine.get("initialize").call(this, isMapTransfer);
	/**
	* A Map of food chain plans, keyed by actor UUID.
	* Each value is a {@link JABS_FoodChainPlan} describing the ordered arc of states
	* the leader entered when eating their most recent food item.
	* Survives map transfer so the HUD does not go blank mid-dungeon.
	* @type {Map<string, JABS_FoodChainPlan>}
	*/
	this._foodChainPlans = isMapTransfer ? this._foodChainPlans ?? new Map() : new Map();
};
/**
* Returns the cached {@link JABS_FoodChainPlan} for the given UUID, or null.
* @param {string} uuid The actor UUID to look up.
* @returns {JABS_FoodChainPlan|null} The plan, or null if none is registered.
*/
JABS_Engine.prototype.getFoodChainPlanByUuid = function(uuid) {
	return this.foodChainPlans().get(uuid) ?? null;
};
/**
* Caches a food chain plan for the given actor UUID, replacing any prior plan.
* Called by the resolver immediately after the leader eats a food item.
* @param {string} uuid The actor UUID.
* @param {JABS_FoodChainPlan} plan The plan built from the item's entry state.
*/
JABS_Engine.prototype.setFoodChainPlanByUuid = function(uuid, plan) {
	this.foodChainPlans().set(uuid, plan);
};
/**
* Gets the food chain plans.
* @returns {Map<string, JABS_FoodChainPlan>} The foodChainPlans.
*/
JABS_Engine.prototype.foodChainPlans = function() {
	return this._foodChainPlans;
};

//#endregion
//#region src/plugins/abs/ext/food/input/Input.js
/**
* Extends {@link Input.ensureRemapBootstrapped}.<br>
* Injects the UsableItem→MobilitySkill default into the remap system immediately
* after the base J-ABS-InputManager seeds its own defaults. The bootstrap guard
* prevents double-seeding across multiple call sites (DataManager, Game_System).
*/
J.ABS.EXT.FOOD.Aliased.Input.set("ensureRemapBootstrapped", Input.ensureRemapBootstrapped);
Input.ensureRemapBootstrapped = function() {
	J.ABS.EXT.FOOD.Aliased.Input.get("ensureRemapBootstrapped").call(this);
	const bindings = Input.getAllBindings("JABS");
	if (bindings && bindings[JABS_Button.UsableItem] === undefined) {
		bindings[JABS_Button.UsableItem] = [J.ABS.EXT.INPUT.Symbols.MobilitySkill];
	}
};

//#endregion
//#region src/plugins/abs/ext/food/input/Window_JabsRemapActions.js
/**
* Extends {@link Window_JabsRemapActions.prototype.buildPostExtensionGroups}.<br>
* Appends a dedicated "Usable Item" section to the remap list so that the R2 usable-item
* binding is visible and reassignable in the JABS remap UI.
* @param {BuiltWindowCommand[]} rows Rows being built.
* @param {Set<string>} can Assignable logical keys.
*/
J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.set("buildPostExtensionGroups", Window_JabsRemapActions.prototype.buildPostExtensionGroups);
Window_JabsRemapActions.prototype.buildPostExtensionGroups = function(rows, can) {
	J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.get("buildPostExtensionGroups").call(this, rows, can);
	rows.push(this.buildHeaderCommand("Usable Item Actions"));
	this._addIf(rows, can, JABS_Button.UsableItem);
};
/**
* Extends {@link Window_JabsRemapActions.prototype.humanizeButton}.<br>
* Returns a friendly label for the UsableItem logical button.
* @param {string} button Logical key.
* @returns {string} The human-readable label.
*/
J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.set("humanizeButton", Window_JabsRemapActions.prototype.humanizeButton);
Window_JabsRemapActions.prototype.humanizeButton = function(button) {
	if (button === JABS_Button.UsableItem) return "Usable Item";
	return J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.get("humanizeButton").call(this, button);
};
/**
* Extends {@link Window_JabsRemapActions.prototype.describeButton}.<br>
* Provides help text for the UsableItem logical button.
* @param {string} button Logical key.
* @returns {string} The help text string.
*/
J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.set("describeButton", Window_JabsRemapActions.prototype.describeButton);
Window_JabsRemapActions.prototype.describeButton = function(button) {
	if (button === JABS_Button.UsableItem) {
		return "Use the equipped item.\nApplies the item's effects and starts any associated chain.";
	}
	return J.ABS.EXT.FOOD.Aliased.Window_JabsRemapActions.get("describeButton").call(this, button);
};

//#endregion
//#region src/plugins/abs/ext/food/objects/Game_Actor.js
/**
* Gets the skill slot dedicated to the R2 usable-item button.
* Mirrors the pattern of getToolSkillSlot and getDodgeSkillSlot in J-ABS core.
* @returns {JABS_SkillSlot} The usable-item slot from this actor's slot manager.
*/
Game_Actor.prototype.getUsableItemSkillSlot = function() {
	return this.getSkillSlotManager().getSkillSlotByKey(JABS_Button.UsableItem);
};

//#endregion
//#region src/plugins/abs/ext/food/scenes/Scene_Boot.js
/**
* Extends {@link Scene_Boot.prototype.start}.<br>
* Builds the food chain plan registry from the now-loaded state database.
* This runs once per game launch, after {@code DataManager.isDatabaseLoaded()} is
* guaranteed true, so {@code $dataStates} is fully populated when the walk begins.
* Any authoring errors (cycles, duplicate chain types) throw immediately here,
* giving the developer a clear boot-time failure rather than a silent runtime bug.
*/
J.ABS.EXT.FOOD.Aliased.Scene_Boot.set("start", Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function() {
	J.ABS.EXT.FOOD.Aliased.Scene_Boot.get("start").call(this);
	JABS_FoodChainPlan.buildRegistry();
};

//#endregion
//#region src/plugins/abs/ext/food/allyai/JABS_SkillSlotManager.js
/**
* Extends {@link JABS_SkillSlotManager.prototype.getEquippedAllySlots}.<br>
* Adds the UsableItem slot to the list of invalid ally slots so that AI-controlled
* party members do not autonomously attempt to consume usable items.
* Usable-item consumption is an intentional player decision, not an AI behavior.
* @returns {JABS_SkillSlot[]} Equipped slots excluding AI-invalid ones.
*/
J.ABS.EXT.FOOD.Aliased.JABS_SkillSlotManager.set("getEquippedAllySlots", JABS_SkillSlotManager.prototype.getEquippedAllySlots);
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function() {
	const slots = J.ABS.EXT.FOOD.Aliased.JABS_SkillSlotManager.get("getEquippedAllySlots").call(this);
	return slots.filter((skillSlot) => skillSlot.key !== JABS_Button.UsableItem);
};

//#endregion
//# sourceMappingURL=J-ABS-Food.js.map