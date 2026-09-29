//region introduction
 
/*:
 * @target MZ
 * @plugindesc [v3.0.0 PASSIVE-DIFFICULTY] Difficulty layers as passive states for everyone.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Passive
 * @orderAfter J-Base
 * @orderAfter J-Passive
 * @orderAfter J-Passive-Affix
 * @orderAfter J-ABS
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Passive.
 *
 * It enables the ability to apply one to many "difficulty layers". A layer is
 * a passive that is on for everyone, perpetually: it names one state for
 * actors and one state for enemies, and while the layer is enabled every actor
 * and every enemy carries that state as a passive.
 *
 * Everything a layer does lives on its states, so anything a state can do, a
 * layer can do: any trait, and any tag any plugin reads off a state.
 *
 * Being passives, the states show no icon, fill no HUD strip, never expire,
 * and nothing can cure or cleanse them. Tag each one <hideFromPassiveList> to
 * keep it out of the Passives menu as well.
 * ----------------------------------------------------------------------------
 * NOTE:
 * There are no tags for this plugin.
 * All difficulties are defined in an external JSON file.
 * ============================================================================
 * CONFIGURING A LAYER
 * Every layer lives in `data/config.difficulty.json`, which is a list of them:
 *
 *  {
 *    "key": "011_crimson-drive",
 *    "name": "Bloody Exchange",
 *    "iconIndex": 1009,
 *    "description": "First line.|Second line.",
 *    "cost": 5,
 *    "actorStateId": 501,
 *    "enemyStateId": 502,
 *    "enabled": false,
 *    "unlocked": false,
 *    "hidden": false
 *  }
 *
 * - actorStateId: the state every actor carries while the layer is enabled.
 * - enemyStateId: the state every enemy carries while the layer is enabled.
 * - Either may be 0, which grants that side of every fight nothing.
 * - With no layer enabled at all, the default layer (the Default Difficulty
 *   parameter) stays in force, states and all.
 * ============================================================================
 * AFFIX EFFECTS (requires J-Passive-Affix)
 * It gives every difficulty layer an optional say in how enemy affixes roll:
 * how often they appear, how evenly the pool is spread, and whether affixes
 * that are otherwise unreachable become available at all.
 *
 * Nothing here is required. A layer that says nothing about affixes changes
 * nothing about them, and without J-Passive-Affix installed the block is read
 * and validated but never applied.
 *
 * Have you ever wanted your hardest difficulty to feel like a different game
 * rather than the same game with bigger numbers? Well now you can! By adding
 * an `affixEffects` block to a layer in the difficulty configuration, you too
 * can make that layer reshape the affixes your enemies spawn with.
 *
 * CONFIG USAGE:
 * - Any layer in `data/config.difficulty.json`
 *
 * CONFIG FORMAT:
 *  "affixEffects": {
 *    "prefixChance": 150,
 *    "suffixChance": 150,
 *    "flatten": 40,
 *    "grants": [
 *      { "stateId": 306, "weight": 50 }
 *    ]
 *  }
 *
 * CONFIG NOTES:
 * - Every field is optional. An omitted field does nothing at all.
 * - Effects from multiple enabled layers are combined, not overridden.
 * - When no layers are enabled, the default layer's block applies, matching
 *   how the default layer's states apply.
 *
 * ----------------------------------------------------------------------------
 * PREFIX CHANCE / SUFFIX CHANCE
 * These are multipliers against whatever chance the spawn would otherwise have
 * had, expressed as a percent. 100 means "leave it alone".
 *
 * They scale the chance AFTER J-Passive-Affix has resolved it, so the usual
 * precedence still decides the baseline: an event comment beats an enemy note,
 * which beats the plugin default. This only says how much of that applies.
 *
 * EXAMPLES:
 *  "prefixChance": 150
 *    Prefixes are half again as common while this layer is enabled.
 *
 *  "prefixChance": 0
 *    Prefixes never roll while this layer is enabled. This is legal and
 *    occasionally useful, but it is an easy typo for "leave it alone", which
 *    is 100 rather than 0.
 *
 * Two enabled layers at 150 combine to 225% of the base chance, because layers
 * multiply. The result is clamped to 0-100 before it is rolled.
 *
 * ----------------------------------------------------------------------------
 * FLATTEN
 * Affix weights are shares, not percentages: an affix's odds are its own weight
 * divided by the total weight of its pool. A pool authored so that its best
 * affix is fifty times rarer than its worst will show that best affix roughly
 * never, no matter how often affixes roll.
 *
 * Flatten pulls every weight toward the pool's average, as a percent of the
 * distance. At 0 the pool is untouched. At 100 every affix in the pool is
 * equally likely. In between, the rare end becomes reachable without the common
 * end disappearing.
 *
 * EXAMPLE:
 *  "flatten": 40
 *    In a pool averaging 179, an affix weighted 10 is rewritten to about 78 -
 *    close to eight times as likely - while one weighted 500 drops to about
 *    372, losing roughly a quarter of its share.
 *
 * Two enabled layers each flattening 40 combine to 64, not 80. Each layer
 * closes part of the remaining distance to the mean, so what is left after both
 * is 60% of 60%. The order they are applied in does not matter.
 *
 * Flatten applies to the whole pool. It has no notion of a "good" or "bad"
 * affix, because an affix is only a state and nothing records whether its
 * effects favor the player.
 *
 * ----------------------------------------------------------------------------
 * GRANTS
 * Have you ever wanted an affix that simply does not exist until the player
 * opts into a harder game? Well now you can! By reserving a state at weight
 * zero and granting it from a layer, you too can hide an affix behind a
 * difficulty.
 *
 * An affix state weighted at zero is a member of its pool that is never drawn.
 * It still counts as an affix everywhere else - an event pinning it through
 * `<passive:[...]>` still works, and its tier presentation still applies - it
 * simply never wins a random roll.
 *
 * A grant hands that state a weight, which both unlocks it and prices it.
 *
 * CONFIG FORMAT:
 *  "grants": [
 *    { "stateId": ID, "weight": WEIGHT }
 *  ]
 *
 * EXAMPLE:
 *  A state noted with:
 *    <enemy-prefix>
 *    <affix-weight:0>
 *
 *  ...paired with a layer configured:
 *    "grants": [
 *      { "stateId": 306, "weight": 50 }
 *    ]
 *
 *  ...means state 306 can only appear while that layer is enabled, at a weight
 *  of 50 against the rest of the prefix pool.
 *
 * CONFIG NOTES:
 * - Grants are a list of objects rather than an object keyed by state id,
 *   because JSON object keys are always strings. A keyed form would make every
 *   id arrive as text and need converting before it could match anything, and
 *   named fields say which number is the id and which is the weight.
 * - The same state may not be granted twice by one layer. Two different layers
 *   granting it is fine and resolves to the larger of the two weights.
 * - Which slot a grant lands in comes from the state's own <enemy-prefix> or
 *   <enemy-suffix> tag, so a grant never has to name it. A state carrying both
 *   is granted in both.
 * - Granted weights are never flattened. Flatten reshapes the pool as authored;
 *   grants speak for what was deliberately left out of it.
 * - Two layers granting the same state resolve to the larger weight, not the
 *   sum of the two.
 * - Granting a state that already has a nonzero weight is an error and stops
 *   the game at boot. Grants exist to unlock reserved affixes; applied to one
 *   that already rolls, a grant would silently overwrite an authored weight.
 * - Granting a state id that does not exist, or one that is neither a prefix
 *   nor a suffix, is likewise an error at boot. A grant that quietly does
 *   nothing is indistinguishable from bad luck, which is a miserable thing to
 *   have to diagnose from inside a playthrough.
 * ============================================================================
 * CHANGELOG:
 * - 3.0.0
 *    BREAKING: replaces J-Difficulty and J-Difficulty-Affix; plugin commands now come
 *    from J-Passive-Difficulty. Each layer is a pair of hidden passive states, and the
 *    difficulty screen says what they do in words. Locked layers show behind a padlock.
 * - 2.2.2
 *    Dropped a redundant round from the parameter and reward factors. The inputs are
 *    whole percentages, so it never had anything to round.
 * - 2.2.1
 *    Routed the duplicate-key and lock/unlock/enable/disable warnings through
 *    J-Base's new Diagnostics, so each one names J-Difficulty in the console.
 * - 2.2.0
 *    Difficulty layers now retain the raw configuration they were built from.
 *    The classifier reads a fixed set of fields by name, so anything an
 *    extension adds to a layer was unrecoverable once parsing finished - and
 *    parsing happens during this plugin's own construction, too early for any
 *    extension to intervene. Keeping the source is what lets an extension find
 *    its own fields without reading the file a second time.
 * - 2.1.2
 *    Difficulty scaling can no longer reduce max hp below one. The engine floors
 *    it at one inside its own param call, and the difficulty multiplier was
 *    applied to the result - outside that clamp - so a max hp multiplier of zero
 *    produced a battler with no maximum hp and broke every ratio computed from
 *    it. Other parameters still scale to zero, which is a legitimate setting.
 * - 2.1.1
 *    The difficulty points window no longer declares private members. A
 *    window's constructor reaches initialize, and through it the drawing
 *    hooks, before a derived class installs its own members- so anything
 *    private was being touched on an object that did not yet have it.
 * - 2.1.0
 *    Routed the _difficulty namespace into its own save section, so difficulty
 *    state lands in systems/difficulty.json rather than in the system blob.
 *    Moved the _difficulty namespace seeding from the initialize alias to
 *    initMembers, so a decoded save can establish it without a constructor.
 * - 2.0.2
 *    Fixed the scene's initMembers chain never reaching Scene_Base, which left
 *    the modal dimmer field unseeded. getModalDimmerWindow guards on === null,
 *    so undefined slipped straight past it and showModalDimmer dereferenced it.
 *    Command windows now seed state in initMembers, early enough for
 *    makeCommandList to see it.
 * - 2.0.1
 *    Added flag for showing external file load info.
 *    Removed dead plugin parameter inputs.
 * - 2.0.0
 *    Updated window layout of scene.
 *    Added multiple layer application support.
 *    Updated difficulty layers to also be applicable to actors if desired.
 *    Refactored a lot of underlying code.
 *    Externalized difficulty layer data.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param initialPoints
 * @parent difficultyConfigs
 * @type number
 * @text Starting Points
 * @desc The number of points the player has available from the start of a new game.
 * @default 10
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The key of the starting or default difficulty before it is decided.
 * @default 000_default
 *
 * @command callDifficultyMenu
 * @text Call Difficulty Menu
 * @desc Calls the difficulty menu regardless of the current scene.
 *
 * @command lockDifficulty
 * @text Lock Difficulty
 * @desc Locks a difficulty, making it unchoosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be locked.
 *
 * @command unlockDifficulty
 * @text Unlock Difficulty
 * @desc Unlocks a difficulty, making it choosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unlocked.
 *
 * @command hideDifficulty
 * @text Hide Difficulty
 * @desc Hides a difficulty, preventing it from being added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be hidden.
 *
 * @command unhideDifficulty
 * @text Unhide Difficulty
 * @desc Shows a difficulty, forcing it to be added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unhidden.
 *
 * @command enableDifficulty
 * @text Enable Difficulty
 * @desc Enables a difficulty, applying its effects.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be enabled.
 *
 * @command disableDifficulty
 * @text Disable Difficulty
 * @desc Disables a difficulty, rendering its effects inactive.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be disabled.
 *
 * @command modifyLayerMax
 * @text Modify Layer Max
 * @desc Modifies the maximum difficulty layer points by the given amount.
 * @arg amount
 * @type number
 * @desc The amount to modify the max layer points by. This can be negative.
 * @min -999999
 * @max 999999
 */
 

//#region src/plugins/passive/ext/difficulty/__models/AffixEffects.js
/**
* The affix biasing a single difficulty layer applies while it is enabled.
*
* Every field defaults to its identity value, so a layer declaring a partial block gets exactly the
* effects it asked for and nothing else. A layer declaring no block at all never builds one of these
* and is skipped entirely when the enabled layers are folded together.
*
* Grants arrive here unsorted. Deciding whether a granted state belongs to the prefix or the suffix
* pool requires reading its notetags off a hydrated `$dataStates` row, and those do not exist yet at
* the moment this is constructed - plugin metadata is built during script evaluation, long before the
* database loads. So the raw pairs are held as authored and the split happens later, during the
* boot-time validation pass that already has to walk every grant anyway.
*/
var AffixEffects = class AffixEffects {
	/**
	* Builds an instance from a layer's raw `affixEffects` JSON block.
	* @param {string} layerKey The key of the layer this block was authored on, used in error messages.
	* @param {object} rawBlock The `affixEffects` object as parsed from the configuration file.
	* @returns {AffixEffects}
	*/
	static fromRaw(layerKey, rawBlock) {
		const affixEffects = new AffixEffects();
		const { prefixChance, suffixChance, flatten, grants } = rawBlock;
		if (prefixChance !== undefined) {
			affixEffects.prefixChance = AffixEffects.#validatedChance(layerKey, "prefixChance", prefixChance);
		}
		if (suffixChance !== undefined) {
			affixEffects.suffixChance = AffixEffects.#validatedChance(layerKey, "suffixChance", suffixChance);
		}
		if (flatten !== undefined) {
			affixEffects.flatten = AffixEffects.#validatedFlatten(layerKey, flatten);
		}
		if (grants !== undefined) {
			affixEffects.setRawGrants(AffixEffects.#validatedGrants(layerKey, grants));
		}
		return affixEffects;
	}
	/**
	* Rejects a chance multiplier that cannot mean anything.
	* Zero is deliberately allowed and means "this layer suppresses that slot entirely while enabled";
	* only a negative multiplier is nonsense, because it would flip the sign of a percentage.
	* @param {string} layerKey The layer being validated, for the error message.
	* @param {string} fieldName Which of the two chance fields this is, for the error message.
	* @param {number} chance The authored value.
	* @returns {number}
	*/
	static #validatedChance(layerKey, fieldName, chance) {
		if (chance < 0) {
			throw new Error(`[${"J-Passive-Difficulty"}]layer [${layerKey}] has ${fieldName}:${chance}; must not be negative.`);
		}
		return chance;
	}
	/**
	* Rejects a flatten outside the range the interpolation is defined over.
	* Above 100 would push weights past the mean and out the other side, inverting the pool's ordering
	* rather than levelling it; below 0 would exaggerate the pool instead of flattening it. Neither is
	* what any author means by the word, so both are a mistake rather than a feature.
	* @param {string} layerKey The layer being validated, for the error message.
	* @param {number} flatten The authored value.
	* @returns {number}
	*/
	static #validatedFlatten(layerKey, flatten) {
		if (flatten < 0 || flatten > 100) {
			throw new Error(`[${"J-Passive-Difficulty"}]layer [${layerKey}] has flatten:${flatten}; must be between 0 and 100.`);
		}
		return flatten;
	}
	/**
	* Converts the authored grants array into a map keyed by state id.
	*
	* Grants are authored as a list of objects with named fields rather than as an object keyed by
	* state id, and the reason is that JSON object keys are always strings. A keyed form would make
	* every state id arrive as text needing coercion before it could match the numerically-keyed affix
	* pools - and an id that missed its coercion would land beside the real entry as a parallel member
	* of the pool rather than replacing it, double-counting the total with nothing reporting it.
	* Named fields also let a reader see which number is the id and which is the weight.
	*
	* Only the shape is checked here. Whether a granted id names a real state, which slot it belongs
	* to, and whether it was authored at zero weight are all questions needing the database, so they
	* are asked later by {@link DifficultyAffixManager.assertGrantsAreValid}.
	* @param {string} layerKey The layer being validated, for the error message.
	* @param {object[]} grants The authored grants, each an object of `stateId` and `weight`.
	* @returns {Map<number, number>}
	*/
	static #validatedGrants(layerKey, grants) {
		const rawGrants = new Map();
		grants.forEach((grant) => {
			const { stateId, weight } = grant;
			if (weight < 0) {
				throw new Error(`[${"J-Passive-Difficulty"}]layer [${layerKey}] grants state [${stateId}] a weight of ` + `[${weight}]; must not be negative.`);
			}
			if (rawGrants.has(stateId)) {
				throw new Error(`[${"J-Passive-Difficulty"}]layer [${layerKey}] grants state [${stateId}] more than once.`);
			}
			rawGrants.set(stateId, weight);
		});
		return rawGrants;
	}
	/**
	* The multiplier applied to whatever prefix chance a spawn would otherwise have had, as a percent.
	* 100 is identity; 150 makes prefixes half again as common while this layer is enabled.
	* @type {number}
	*/
	prefixChance = 100;
	/**
	* The multiplier applied to whatever suffix chance a spawn would otherwise have had, as a percent.
	* 100 is identity; the suffix twin of {@link #prefixChance} in every respect.
	* @type {number}
	*/
	suffixChance = 100;
	/**
	* How far each affix weight is pulled toward its pool's mean, as a percent.
	* 0 leaves the pool exactly as authored; 100 makes every member of the pool equally likely. This
	* is the knob that decides whether the rare end of an affix ladder is ever actually seen.
	* @type {number}
	*/
	flatten = 0;
	/**
	* The weights this layer hands to affix states, keyed by state id, before the slot is known.
	* Drained into {@link #prefixGrants} and {@link #suffixGrants} once the database has loaded.
	* @type {Map<number, number>}
	*/
	_rawGrants = new Map();
	/**
	* The weights this layer hands to prefix affix states, keyed by state id.
	* Empty until the boot-time validation pass sorts {@link #_rawGrants} by slot.
	* @type {Map<number, number>}
	*/
	_prefixGrants = new Map();
	/**
	* The weights this layer hands to suffix affix states, keyed by state id.
	* Empty until the boot-time validation pass sorts {@link #_rawGrants} by slot.
	* @type {Map<number, number>}
	*/
	_suffixGrants = new Map();
	/**
	* The grants exactly as authored, before they were sorted into slots.
	* @returns {Map<number, number>}
	*/
	rawGrants() {
		return this._rawGrants;
	}
	/**
	* Replaces the unsorted grants.
	* @param {Map<number, number>} rawGrants The grants as authored.
	*/
	setRawGrants(rawGrants) {
		this._rawGrants = rawGrants;
	}
	/**
	* The weights this layer hands to prefix affix states.
	* @returns {Map<number, number>}
	*/
	prefixGrants() {
		return this._prefixGrants;
	}
	/**
	* The weights this layer hands to suffix affix states.
	* @returns {Map<number, number>}
	*/
	suffixGrants() {
		return this._suffixGrants;
	}
	/**
	* Records that a granted state belongs to the prefix pool.
	* A state carrying both slot tags is recorded on both sides at the same weight, because it is
	* genuinely a member of both pools and a grant naming it means to unlock it wherever it lives.
	* @param {number} stateId The granted state.
	* @param {number} weight The weight this layer hands it.
	*/
	addPrefixGrant(stateId, weight) {
		this.prefixGrants().set(stateId, weight);
	}
	/**
	* Records that a granted state belongs to the suffix pool.
	* @param {number} stateId The granted state.
	* @param {number} weight The weight this layer hands it.
	*/
	addSuffixGrant(stateId, weight) {
		this.suffixGrants().set(stateId, weight);
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/__models/DifficultyMetadata.js
/**
* A class governing a single difficulty and the way it impacts the game parameters.
*/
var DifficultyMetadata = class {
	/**
	* The name of the difficulty, visually to the player.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The description of the difficulty, displayed in the help window at the top.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The icon used when the name of the difficulty is displayed in the scene.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The cost required to enable this difficulty.
	* @type {number}
	*/
	cost = 0;
	/**
	* The state every actor carries as a passive while this layer is in force, or 0 when the layer
	* grants actors nothing.
	* @type {number}
	*/
	actorStateId = 0;
	/**
	* The state every enemy carries as a passive while this layer is in force, or 0 when the layer
	* grants enemies nothing.
	* @type {number}
	*/
	enemyStateId = 0;
	/**
	* The affix biasing this layer applies while it is in force, or null when it declares none.
	* @type {AffixEffects|null}
	*/
	affixEffects = null;
	/**
	* Whether or not this difficulty is enabled.
	* When a difficulty is enabled, its global effects are applied.
	* @type {boolean}
	*/
	enabled = false;
	/**
	* Whether or not this difficulty is unlocked and can be enabled/disabled.
	* @type {boolean}
	*/
	unlocked = true;
	/**
	* Whether or not this difficulty is hidden from selection.
	* @type {boolean}
	*/
	hidden = false;
};

//#endregion
//#region src/plugins/passive/ext/difficulty/__models/DifficultyLayer.js
/**
* A class governing a single difficulty and the way it impacts the game parameters.
*/
var DifficultyLayer = class DifficultyLayer {
	/**
	* Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.
	* @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
	* @returns {DifficultyLayer} The new difficulty based on the metadata.
	*/
	static fromMetadata(difficultyMetadata) {
		const difficultyLayer = new DifficultyLayer(difficultyMetadata.key);
		difficultyLayer.name = difficultyMetadata.name;
		difficultyLayer.description = difficultyMetadata.description;
		difficultyLayer.iconIndex = difficultyMetadata.iconIndex;
		difficultyLayer.cost = difficultyMetadata.cost;
		difficultyLayer.actorStateId = difficultyMetadata.actorStateId;
		difficultyLayer.enemyStateId = difficultyMetadata.enemyStateId;
		difficultyLayer.affixEffects = difficultyMetadata.affixEffects;
		return difficultyLayer;
	}
	/**
	* The key associated with the applied difficulty.
	* @type {string}
	*/
	static appliedKey = `000_applied-difficulty`;
	/**
	* The name of the applied difficulty.
	* @type {string}
	*/
	static appliedName = `Applied Difficulty`;
	/**
	* The description of the applied difficulty.
	* @type {string}
	*/
	static appliedDescription = `The combined effects of all enabled difficulties.`;
	/**
	* Constructor to instantiate a layer of difficulty with a key.
	* @param {string} key The key of this layer.
	*/
	constructor(key) {
		this.key = key;
	}
	/**
	* Checks whether or not this difficulty layer is actually the default layer.
	* @returns {boolean}
	*/
	isDefaultLayer() {
		return this.key === J.PASSIVE.EXT.DIFFICULTY.Metadata.defaultKey;
	}
	/**
	* Checks whether or not this difficulty layer is actually the applied difficulty layer.
	* @returns {boolean}
	*/
	isAppliedLayer() {
		return this.key === DifficultyLayer.appliedKey;
	}
	/**
	* The name of the difficulty, visually to the player.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The description of the difficulty, displayed in the help window at the top.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The icon used when the name of the difficulty is displayed in the scene.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The cost required to enable this difficulty.
	* @type {number}
	*/
	cost = 0;
	/**
	* The state every actor carries as a passive while this layer is in force, or 0 when the layer
	* grants actors nothing.
	* @type {number}
	*/
	actorStateId = 0;
	/**
	* The state every enemy carries as a passive while this layer is in force, or 0 when the layer
	* grants enemies nothing.
	* @type {number}
	*/
	enemyStateId = 0;
	/**
	* The affix biasing this layer applies while it is in force, or null when it declares none.
	* @type {AffixEffects|null}
	*/
	affixEffects = null;
	/**
	* Whether or not this difficulty's cost can be covered by the remaining layer points.
	* @returns {boolean} True if the cost can be paid, false otherwise.
	*/
	canPayCost() {
		const canPay = this.cost <= $gameSystem.getRemainingLayerPoints();
		return canPay;
	}
	/**
	* Determines whether or not this difficulty is unlocked.
	* @returns {boolean}
	*/
	isUnlocked() {
		const { unlocked } = $gameSystem.getDifficultyConfigByKey(this.key);
		return unlocked;
	}
	/**
	* Locks this difficulty, making it unavailable for the player to enable/disable.
	*/
	lock() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.unlocked = false;
	}
	/**
	* Unlocks this difficulty, making it available for the player to enable/disable.
	*/
	unlock() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.unlocked = true;
	}
	/**
	* Determines whether or not this difficulty is hidden in the list.
	* @returns {boolean}
	*/
	isHidden() {
		const { hidden } = $gameSystem.getDifficultyConfigByKey(this.key);
		return hidden;
	}
	/**
	* Hides this difficulty, making it no longer listed in the difficulty list.
	*/
	hide() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.hidden = true;
	}
	/**
	* Unhides this difficulty, making it visible in the difficulty list.
	*/
	unhide() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.hidden = false;
	}
	/**
	* Determines whether or not this difficulty is currently enabled.
	* @returns {boolean} True if this difficulty is enabled, false otherwise.
	*/
	isEnabled() {
		const { enabled } = $gameSystem.getDifficultyConfigByKey(this.key);
		return enabled;
	}
	/**
	* Enables this difficulty layer.
	*/
	enable() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.enabled = true;
	}
	/**
	* Disables this difficulty layer.
	*/
	disable() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.enabled = false;
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/__models/DifficultyBuilder.js
/**
* The fluent-builder for easily creating new difficulties.
*/
var DifficultyBuilder = class {
	#name = String.empty;
	#key = String.empty;
	#description = String.empty;
	#iconIndex = 0;
	#cost = 0;
	#actorStateId = 0;
	#enemyStateId = 0;
	#affixEffects = null;
	#enabled = false;
	#unlocked = true;
	#hidden = false;
	/**
	* Constructor.
	* @param {string} name The name of this difficulty.
	* @param {string} key The unique key of this difficulty.
	*/
	constructor(name, key) {
		this.setName(name);
		this.setKey(key);
	}
	/**
	* Builds the difficulty with its current configuration.
	* @returns {DifficultyMetadata}
	*/
	build() {
		const difficulty = new DifficultyMetadata();
		difficulty.name = this.#name;
		difficulty.key = this.#key;
		difficulty.description = this.#description;
		difficulty.iconIndex = this.#iconIndex;
		difficulty.cost = this.#cost;
		difficulty.actorStateId = this.#actorStateId;
		difficulty.enemyStateId = this.#enemyStateId;
		difficulty.affixEffects = this.#affixEffects;
		difficulty.enabled = this.#enabled;
		difficulty.unlocked = this.#unlocked;
		difficulty.hidden = this.#hidden;
		return difficulty;
	}
	/**
	* Builds the difficulty as a layer rather than as metadata, for layers that exist only at runtime.
	* @returns {DifficultyLayer}
	*/
	buildAsLayer() {
		const difficulty = new DifficultyLayer(this.#key);
		difficulty.name = this.#name;
		difficulty.description = this.#description;
		difficulty.iconIndex = this.#iconIndex;
		difficulty.cost = this.#cost;
		difficulty.actorStateId = this.#actorStateId;
		difficulty.enemyStateId = this.#enemyStateId;
		difficulty.affixEffects = this.#affixEffects;
		difficulty.enabled = this.#enabled;
		difficulty.unlocked = this.#unlocked;
		difficulty.hidden = this.#hidden;
		return difficulty;
	}
	/**
	* Sets the name of the difficulty being built.
	* @param {string} name The display name.
	* @returns {DifficultyBuilder}
	*/
	setName(name) {
		this.#name = name;
		return this;
	}
	/**
	* Sets the key of the difficulty being built.
	* @param {string} key The unique key.
	* @returns {DifficultyBuilder}
	*/
	setKey(key) {
		this.#key = key;
		return this;
	}
	/**
	* Sets the description of the difficulty being built.
	* @param {string} description The help text.
	* @returns {DifficultyBuilder}
	*/
	setDescription(description) {
		this.#description = description;
		return this;
	}
	/**
	* Sets the icon of the difficulty being built.
	* @param {number} iconIndex The icon index.
	* @returns {DifficultyBuilder}
	*/
	setIconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	/**
	* Sets the cost of the difficulty being built.
	* @param {number} cost The layer points it costs to enable.
	* @returns {DifficultyBuilder}
	*/
	setCost(cost) {
		this.#cost = cost;
		return this;
	}
	/**
	* Sets the state every actor carries while the difficulty is in force.
	* @param {number} actorStateId The state id, or 0 for none.
	* @returns {DifficultyBuilder}
	*/
	setActorStateId(actorStateId) {
		this.#actorStateId = actorStateId;
		return this;
	}
	/**
	* Sets the state every enemy carries while the difficulty is in force.
	* @param {number} enemyStateId The state id, or 0 for none.
	* @returns {DifficultyBuilder}
	*/
	setEnemyStateId(enemyStateId) {
		this.#enemyStateId = enemyStateId;
		return this;
	}
	/**
	* Sets the affix biasing the difficulty applies while in force.
	* @param {AffixEffects|null} affixEffects The parsed effects, or null for none.
	* @returns {DifficultyBuilder}
	*/
	setAffixEffects(affixEffects) {
		this.#affixEffects = affixEffects;
		return this;
	}
	/**
	* Sets whether the difficulty starts unlocked.
	* @param {boolean} unlocked Whether the player may toggle it.
	* @returns {DifficultyBuilder}
	*/
	setUnlocked(unlocked) {
		this.#unlocked = unlocked;
		return this;
	}
	/**
	* Sets whether the difficulty starts enabled.
	* @param {boolean} enabled Whether it applies from the start.
	* @returns {DifficultyBuilder}
	*/
	setEnabled(enabled) {
		this.#enabled = enabled;
		return this;
	}
	/**
	* Sets whether the difficulty starts hidden from the list.
	* @param {boolean} hidden Whether the list leaves it out.
	* @returns {DifficultyBuilder}
	*/
	setHidden(hidden) {
		this.#hidden = hidden;
		return this;
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/__models/DifficultyConfig.js
var DifficultyConfig = class DifficultyConfig {
	/**
	* Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.<br>
	* @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
	* @returns {DifficultyLayer} The new difficulty based on the metadata.
	*/
	static fromMetadata(difficultyMetadata) {
		const difficultyConfig = new DifficultyConfig();
		difficultyConfig.key = difficultyMetadata.key;
		difficultyConfig.enabled = difficultyMetadata.enabled;
		difficultyConfig.unlocked = difficultyMetadata.unlocked;
		difficultyConfig.hidden = difficultyMetadata.hidden;
		return difficultyConfig;
	}
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* Whether or not this difficulty is enabled.
	* When a difficulty is enabled, its global effects are applied.
	* @type {boolean}
	*/
	enabled = false;
	/**
	* Whether or not this difficulty is unlocked and can be enabled/disabled.
	* @type {boolean}
	*/
	unlocked = true;
	/**
	* Whether or not this difficulty is hidden from selection.
	* @type {boolean}
	*/
	hidden = false;
	/**
	* Constructor.
	* @param {string} key The key of the difficulty.
	* @param {boolean} enabled Whether or not this difficulty's effects are applied from the start.
	* @param {boolean} unlocked Whether or not this difficulty is unlocked for application.
	* @param {boolean} hidden Whether or not this difficulty is visible in the list.
	*/
	constructor(key = String.empty, enabled = false, unlocked = true, hidden = false) {
		this.key = key;
		this.enabled = enabled;
		this.unlocked = unlocked;
		this.hidden = hidden;
	}
};
/**
* Every difficulty the player has toggled lives in a savefile at
* `$gameSystem._j._difficulty._configurations`, so the save encoder meets this type and needs a
* codec for it.
*
* The defaults live in class fields, which only run when a constructor does- and the decoder never
* runs one. The seed therefore copies them off a freshly built instance rather than restating them,
* which is safe because this constructor defaults every parameter and does nothing but assign.
*/
SerializableRegistry.register(DifficultyConfig, {
	id: "difficulty-config",
	aliases: ["DifficultyConfig"],
	seed: (instance) => Object.assign(instance, new DifficultyConfig())
});

//#endregion
//#region src/plugins/passive/ext/difficulty/_metadata/_pluginMetadata.js
var J_DiffPluginMetadata = class J_DiffPluginMetadata extends PluginMetadata {
	/**
	* Project-relative path to the difficulty JSON configuration file.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.difficulty.json";
	/**
	* The underlying layer that represents the default.<br>
	* It is null by default but is updated at initiation and during modification of layers.
	* @type {DifficultyLayer|null}
	*/
	static #default = null;
	/**
	* A default {@link DifficultyLayer} with no states and no affix biasing.
	* When all layers are disabled, this is the default layer used.
	* @type {DifficultyLayer}
	*/
	static defaultLayer() {
		return this.#default;
	}
	/**
	* Updates the default layer with a new default.
	* @param {DifficultyLayer} layer The layer driving this step.
	*/
	static updateDefaultLayer(layer) {
		this.#default = layer;
	}
	/**
	* Converts the JSON-parsed blob into classified {@link DifficultyMetadata}s.
	* @param {any} parsedBlob The already-parsed JSON blob.
	* @return {Map<string, DifficultyMetadata>} A map of the difficulty layers by their keys.
	*/
	static classifyDifficulties(parsedBlob) {
		/** @type {Map<string, DifficultyMetadata>} */
		const difficultiesMap = new Map();
		const forEacher = (parsedDifficultyBlob) => {
			const { key, name, description, iconIndex, cost, actorStateId, enemyStateId, affixEffects, enabled, unlocked, hidden } = parsedDifficultyBlob;
			const parsedAffixEffects = affixEffects === undefined ? null : AffixEffects.fromRaw(key, affixEffects);
			/** @type {DifficultyMetadata} */
			const completeDifficulty = new DifficultyBuilder(name, key).setDescription(description).setIconIndex(iconIndex).setCost(cost).setEnabled(enabled).setHidden(hidden).setUnlocked(unlocked).setActorStateId(actorStateId).setEnemyStateId(enemyStateId).setAffixEffects(parsedAffixEffects).build();
			if (difficultiesMap.get(key)) {
				Diagnostics.warn("J-Passive-Difficulty", `duplicate difficulty key definition detected for [${key}].`);
			}
			difficultiesMap.set(key, completeDifficulty);
		};
		parsedBlob.forEach(forEacher);
		return difficultiesMap;
	}
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeDifficulties();
		this.initializeMetadata();
	}
	/**
	* Loads difficulty layers from {@link J_DiffPluginMetadata.CONFIG_PATH}.
	*/
	initializeDifficulties() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Passive-Difficulty").configName("difficulty configuration").logSummary((result) => [`- ${result.length} difficulty layers`]).build();
		const parsedBlob = ExternalJsonConfigLoader.load(J_DiffPluginMetadata.CONFIG_PATH, options);
		/**
		* A map of difficulty layer metadatas by their key.
		* @type {Map<string, DifficultyMetadata>}
		*/
		this.allMetadatas = J_DiffPluginMetadata.classifyDifficulties(parsedBlob);
	}
	initializeMetadata() {
		/**
		* The key for the default difficulty.
		* @type {string}
		*/
		this.defaultKey = this.parsedPluginParameters["defaultDifficulty"] || "default_undefined";
		/**
		* The default point max for allocating difficulty layers.
		*/
		this.initialPoints = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["initialPoints"], 0);
		const defaultLayer = DifficultyLayer.fromMetadata(this.allMetadatas.get(this.defaultKey));
		J_DiffPluginMetadata.updateDefaultLayer(defaultLayer);
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "4.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The umbrella for extensions of J-Passive, which this plugin is one of. Declared rather than
* assumed, because no other extension of J-Passive is required to have loaded first.
*/
J.PASSIVE.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PASSIVE.EXT.DIFFICULTY = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.PASSIVE.EXT.DIFFICULTY.Metadata = new J_DiffPluginMetadata("J-Passive-Difficulty", "3.0.0");
/**
* The actual `plugin parameters` extracted from RMMZ.
*/
J.PASSIVE.EXT.DIFFICULTY.PluginParameters = PluginManager.parameters(J.PASSIVE.EXT.DIFFICULTY.Metadata.name);
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased = {
	DataManager: new Map(),
	Game_Actor: new Map(),
	Game_Enemy: new Map(),
	Game_Event: new Map(),
	Game_System: new Map(),
	Game_Temp: new Map(),
	JPassiveAffix_PluginMetadata: new Map(),
	Scene_Boot: new Map()
};

//#endregion
//#region src/plugins/passive/ext/difficulty/managers/DifficultyManager.js
/**
* A static class to manage the difficulties with.
*/
var DifficultyManager = class {
	/**
	* Gets all difficulties defined, including locked difficulties.
	* @returns {DifficultyLayer[]}
	*/
	static allDifficulties() {
		const difficultyLayersSource = $gameTemp.getAllDifficultyLayers();
		const difficultyLayers = [];
		difficultyLayersSource.forEach((layer) => difficultyLayers.push(layer));
		return difficultyLayers;
	}
	/**
	* Gets every difficulty the player may see in the difficulty menu: all but the hidden ones.
	*
	* A locked layer is seen too. Locking makes a layer unchoosable, not invisible, so the menu lists it with its
	* padlock and the player can see what there is still to unlock; only hiding keeps a layer out of sight.
	* @returns {DifficultyLayer[]}
	*/
	static visibleDifficulties() {
		return this.allDifficulties().filter((difficultyLayer) => difficultyLayer.isHidden() === false);
	}
	/**
	* Gets the difficulty by its key.
	* Centralized if needing refactoring down the road.
	* @param {string} key The key of the difficulty to find.
	* @returns {DifficultyLayer|undefined} The difficulty if the key exists, undefined otherwise.
	*/
	static #getDifficultyByKey = (key) => $gameTemp.findDifficultyLayerByKey(key);
	/**
	* Re-evaluates all currently enabled difficulties and refreshes the applied difficulty.
	*/
	static refreshAppliedDifficulty = () => $gameTemp.refreshAppliedDifficulty();
	/**
	* Locks the difficulty with the given key.
	* @param {string} key The difficulty key to lock.
	*/
	static lockDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.lock();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not lock difficulty with key: [${key}].`);
		}
	}
	/**
	* Unlocks the difficulty with the given key.
	* @param {string} key The difficulty key to unlock.
	*/
	static unlockDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.unlock();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not unlock difficulty with key: [${key}].`);
		}
	}
	/**
	* Hides the difficulty with the given key.
	* @param {string} key The difficulty key to hide.
	*/
	static hideDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.hide();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not hide difficulty with key: [${key}].`);
		}
	}
	/**
	* Reveals the difficulty with the given key.
	* @param {string} key The difficulty key to reveal.
	*/
	static unhideDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.unhide();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not unhide difficulty with key: [${key}].`);
		}
	}
	/**
	* Enables the difficulty with the given key.
	* @param {string} key The difficulty key to enable.
	*/
	static enableDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.enable();
			this.refreshAppliedDifficulty();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not enable difficulty with key: [${key}].`);
		}
	}
	/**
	* Disables the difficulty with the given key.
	* @param {string} key The difficulty key to disable.
	*/
	static disableDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.disable();
			this.refreshAppliedDifficulty();
		} else {
			Diagnostics.warn("J-Passive-Difficulty", `could not disable difficulty with key: [${key}].`);
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/managers/DifficultyAffixManager.js
/**
* The home of every calculation that lets difficulty layers bias how enemy affixes roll.
*
* Three things are built for this, at three different times, and keeping them apart is what makes the
* whole feature tractable:
*
* 1. The per-layer effects, parsed once while the difficulty configuration is classified. Static data
*    being reshaped; never rebuilt, never saved.
* 2. The slot split for granted affixes, done once at `onDatabaseLoaded`, because deciding which pool a
*    granted state belongs to needs its hydrated notetags.
* 3. The folded pools, rebuilt whenever the set of layers in force changes. This is the only part that is
*    genuinely runtime state, because the player toggles layers.
*
* Everything here reaches into J-Passive-Affix, so nothing calls it unless that plugin is installed.
*/
var DifficultyAffixManager = class DifficultyAffixManager {
	/**
	* The pool handed out for prefix rolls, or null while the cache is cold.
	* Null is a real answer rather than a missing one: it is what the aliased seam reads to decide it
	* should hand back the untouched base pool, which is correct before any layer has been evaluated.
	* @type {{map: Map<number, number>, totalWeight: number}|null}
	*/
	static #effectivePrefixPool = null;
	/**
	* The pool handed out for suffix rolls, or null while the cache is cold.
	* @type {{map: Map<number, number>, totalWeight: number}|null}
	*/
	static #effectiveSuffixPool = null;
	/**
	* The multiplier the layers in force apply to a spawn's prefix chance, as a factor.
	* Identity until the layers have been folded, which is the honest answer before then.
	* @type {number}
	*/
	static #prefixChanceFactor = 1;
	/**
	* The multiplier the layers in force apply to a spawn's suffix chance, as a factor.
	* @type {number}
	*/
	static #suffixChanceFactor = 1;
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* The current difficulty-adjusted prefix pool, or null when it has not been built yet.
	* @returns {{map: Map<number, number>, totalWeight: number}|null}
	*/
	static effectivePrefixPool() {
		return DifficultyAffixManager.#effectivePrefixPool;
	}
	/**
	* The current difficulty-adjusted suffix pool, or null when it has not been built yet.
	* @returns {{map: Map<number, number>, totalWeight: number}|null}
	*/
	static effectiveSuffixPool() {
		return DifficultyAffixManager.#effectiveSuffixPool;
	}
	/**
	* Replaces the cached difficulty-adjusted prefix pool.
	* @param {{map: Map<number, number>, totalWeight: number}|null} pool The newly folded pool.
	*/
	static setEffectivePrefixPool(pool) {
		DifficultyAffixManager.#effectivePrefixPool = pool;
	}
	/**
	* Replaces the cached difficulty-adjusted suffix pool.
	* @param {{map: Map<number, number>, totalWeight: number}|null} pool The newly folded pool.
	*/
	static setEffectiveSuffixPool(pool) {
		DifficultyAffixManager.#effectiveSuffixPool = pool;
	}
	/**
	* The multiplier the layers in force apply to a spawn's prefix chance.
	* Cached rather than folded per spawn: spawns are frequent, difficulty toggles are not, and the answer
	* cannot change between the two.
	* @returns {number}
	*/
	static prefixChanceFactor() {
		return DifficultyAffixManager.#prefixChanceFactor;
	}
	/**
	* The multiplier the layers in force apply to a spawn's suffix chance.
	* @returns {number}
	*/
	static suffixChanceFactor() {
		return DifficultyAffixManager.#suffixChanceFactor;
	}
	/**
	* Replaces the cached prefix chance multiplier.
	* @param {number} factor The newly folded factor.
	*/
	static setPrefixChanceFactor(factor) {
		DifficultyAffixManager.#prefixChanceFactor = factor;
	}
	/**
	* Replaces the cached suffix chance multiplier.
	* @param {number} factor The newly folded factor.
	*/
	static setSuffixChanceFactor(factor) {
		DifficultyAffixManager.#suffixChanceFactor = factor;
	}
	/**
	* Validates every configured grant and sorts it into the slot its state belongs to.
	*
	* Every layer is checked, not merely the enabled ones. A grant sitting on a layer the player never
	* turns on is exactly as broken as one on a layer they always use, and the entire value of failing at
	* boot is that it fails for everyone on first launch rather than for one player, hours in, as a
	* silently absent affix that reads like bad luck.
	*/
	static assertGrantsAreValid() {
		J.PASSIVE.EXT.DIFFICULTY.Metadata.allMetadatas.forEach((difficultyMetadata, layerKey) => {
			const { affixEffects } = difficultyMetadata;
			if (affixEffects === null) return;
			affixEffects.rawGrants().forEach((weight, stateId) => DifficultyAffixManager.assertGrantIsValid(layerKey, affixEffects, stateId, weight));
		});
	}
	/**
	* Validates one grant and records which slot (or slots) it applies to.
	* @param {string} layerKey The layer that authored this grant, for the error messages.
	* @param {AffixEffects} affixEffects The effects this grant belongs to.
	* @param {number} stateId The granted state.
	* @param {number} weight The weight this layer hands it.
	*/
	static assertGrantIsValid(layerKey, affixEffects, stateId, weight) {
		const state = $dataStates[stateId];
		if (!state) {
			throw new Error(`[${"J-Passive-Difficulty"}] layer [${layerKey}] grants state [${stateId}], which does not exist.`);
		}
		const isPrefix = state.isEnemyPrefix;
		const isSuffix = state.isEnemySuffix;
		if (isPrefix === false && isSuffix === false) {
			throw new Error(`[${"J-Passive-Difficulty"}] layer [${layerKey}] grants state [${stateId}], which is neither ` + `<enemy-prefix> nor <enemy-suffix>.`);
		}
		if (state.affixWeight !== 0) {
			throw new Error(`[${"J-Passive-Difficulty"}] layer [${layerKey}] grants state [${stateId}], which already has ` + `<affix-weight:${state.affixWeight}>; grants are only for states reserved at weight 0.`);
		}
		if (isPrefix) {
			affixEffects.addPrefixGrant(stateId, weight);
		}
		if (isSuffix) {
			affixEffects.addSuffixGrant(stateId, weight);
		}
	}
	/**
	* The affix effects of every difficulty layer in force.
	* Which layers are in force, including the fall back to the default layer when nothing is enabled,
	* is decided in one place, {@link Game_Temp#difficultyLayersInForce}, so the affix half of a layer can
	* never disagree with its state half about whether that layer applies.
	* @returns {AffixEffects[]}
	*/
	static affixEffectsInForce() {
		return $gameTemp.difficultyLayersInForce().map((layer) => layer.affixEffects).filter((affixEffects) => affixEffects !== null);
	}
	/**
	* The combined multiplier applied to a spawn's prefix chance, as a factor rather than a percent.
	* Layers compose multiplicatively.
	* @param {AffixEffects[]} allEffects The effects of the layers in force.
	* @returns {number}
	*/
	static combinedPrefixChanceFactor(allEffects) {
		return allEffects.reduce((runningFactor, effects) => runningFactor * (effects.prefixChance / 100), 1);
	}
	/**
	* The combined multiplier applied to a spawn's suffix chance, as a factor rather than a percent.
	* @param {AffixEffects[]} allEffects The effects of the layers in force.
	* @returns {number}
	*/
	static combinedSuffixChanceFactor(allEffects) {
		return allEffects.reduce((runningFactor, effects) => runningFactor * (effects.suffixChance / 100), 1);
	}
	/**
	* The combined flatten of the layers in force, as a factor between 0 and 1.
	*
	* Flattening rewrites a weight as `mean - (mean - weight) * (1 - f)`, so what each application really
	* does is scale that weight's distance from the mean by `(1 - f)`. Two applications scale it by the
	* product of their complements, which is why layers combine as `1 - product(1 - f)` and not as a sum.
	* Two layers at 40 give 64, not 80.
	*
	* That form is also order-independent, which matters because the layers arrive in config order and
	* nothing about that order is meaningful. It holds because flattening preserves the pool's total, so
	* the mean every layer interpolates toward is the same one.
	* @param {AffixEffects[]} allEffects The effects of the layers in force.
	* @returns {number}
	*/
	static combinedFlatten(allEffects) {
		const remainingDistance = allEffects.reduce((runningDistance, effects) => runningDistance * (1 - effects.flatten / 100), 1);
		return 1 - remainingDistance;
	}
	/**
	* The union of every in-force layer's prefix grants, keyed by state id.
	*
	* Two layers granting the same affix resolve to the larger weight rather than to their sum. A grant is
	* a statement about how rare something ought to be at that difficulty, and two layers each saying "50"
	* both mean 50 - reading them as an accumulating resource would make an affix progressively common
	* purely as a side effect of enabling unrelated layers.
	* @param {AffixEffects[]} allEffects The effects of the layers in force.
	* @returns {Map<number, number>}
	*/
	static combinedPrefixGrants(allEffects) {
		return DifficultyAffixManager.mergeGrantsByMax(allEffects.map((effects) => effects.prefixGrants()));
	}
	/**
	* The union of every in-force layer's suffix grants, keyed by state id.
	* @param {AffixEffects[]} allEffects The effects of the layers in force.
	* @returns {Map<number, number>}
	*/
	static combinedSuffixGrants(allEffects) {
		return DifficultyAffixManager.mergeGrantsByMax(allEffects.map((effects) => effects.suffixGrants()));
	}
	/**
	* Folds several grant maps into one, keeping the largest weight offered for each state.
	* @param {Map<number, number>[]} allGrants The grant maps to merge.
	* @returns {Map<number, number>}
	*/
	static mergeGrantsByMax(allGrants) {
		const merged = new Map();
		allGrants.forEach((grants) => {
			grants.forEach((weight, stateId) => {
				const existing = merged.get(stateId);
				const winner = existing === undefined ? weight : Math.max(existing, weight);
				merged.set(stateId, winner);
			});
		});
		return merged;
	}
	/**
	* Rebuilds both difficulty-adjusted pools and both chance factors from the layers in force.
	* Called whenever the set of layers in force changes, which is rare - spawns are frequent and
	* difficulty toggles are not, so the folded result is cached rather than recomputed per enemy.
	*/
	static buildEffectivePools() {
		const allEffects = DifficultyAffixManager.affixEffectsInForce();
		const flatten = DifficultyAffixManager.combinedFlatten(allEffects);
		const { prefixMap, suffixMap } = J.PASSIVE.EXT.AFFIX.Metadata;
		const prefixGrants = DifficultyAffixManager.combinedPrefixGrants(allEffects);
		const suffixGrants = DifficultyAffixManager.combinedSuffixGrants(allEffects);
		const prefixPool = DifficultyAffixManager.buildPool(prefixMap, flatten, prefixGrants);
		const suffixPool = DifficultyAffixManager.buildPool(suffixMap, flatten, suffixGrants);
		DifficultyAffixManager.setEffectivePrefixPool(prefixPool);
		DifficultyAffixManager.setEffectiveSuffixPool(suffixPool);
		const prefixChanceFactor = DifficultyAffixManager.combinedPrefixChanceFactor(allEffects);
		const suffixChanceFactor = DifficultyAffixManager.combinedSuffixChanceFactor(allEffects);
		DifficultyAffixManager.setPrefixChanceFactor(prefixChanceFactor);
		DifficultyAffixManager.setSuffixChanceFactor(suffixChanceFactor);
	}
	/**
	* Builds one difficulty-adjusted pool from a base pool, a flatten, and a set of grants.
	*
	* The base pool is copied rather than edited. It belongs to J-Passive-Affix and is that ship's only
	* record of how the affixes were authored, so flattening it in place would not merely leak - it would
	* compound, flattening an already-flattened pool every time the player touched a layer.
	* @param {Map<number, number>} basePool The authored pool for this slot.
	* @param {number} flatten How far to pull each weight toward the mean, between 0 and 1.
	* @param {Map<number, number>} grants The weights to hand to reserved states, keyed by state id.
	* @returns {{map: Map<number, number>, totalWeight: number}}
	*/
	static buildPool(basePool, flatten, grants) {
		const pool = new Map(basePool);
		DifficultyAffixManager.flattenPool(pool, flatten);
		grants.forEach((weight, stateId) => pool.set(stateId, weight));
		let totalWeight = 0;
		pool.forEach((weight) => totalWeight += weight);
		return {
			map: pool,
			totalWeight
		};
	}
	/**
	* Pulls every drawable weight in a pool toward that pool's mean, in place.
	*
	* Only entries authored above zero participate, and the mean is taken over that same set. Reserved
	* affixes sitting at zero are not part of the distribution being levelled - they are not in the pool
	* in any meaningful sense until something grants them a weight.
	* @param {Map<number, number>} pool The pool to flatten, modified in place.
	* @param {number} flatten How far to pull each weight toward the mean, between 0 and 1.
	*/
	static flattenPool(pool, flatten) {
		let drawableCount = 0;
		let drawableWeight = 0;
		pool.forEach((weight) => {
			if (weight <= 0) return;
			drawableCount++;
			drawableWeight += weight;
		});
		const mean = drawableWeight / drawableCount;
		pool.forEach((weight, stateId) => {
			if (weight <= 0) return;
			pool.set(stateId, weight + (mean - weight) * flatten);
		});
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/managers/DataManager.js
/**
* Extends {@link DataManager.setupNewGame}.<br/>
* Includes difficulty setup for new games.
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	J.PASSIVE.EXT.DIFFICULTY.Aliased.DataManager.get("setupNewGame").call(this);
	$gameTemp.setupDifficultySystem();
};

//#endregion
//#region src/plugins/passive/ext/difficulty/objects/Game_System.js
/**
* Extends the `.initialize()` with our difficulty initialization.
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_System.get("initMembers").call(this);
	this.initDifficultyMembers();
};
/**
* Initializes the Difficulty System.
*/
Game_System.prototype.initDifficultyMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the difficulty system.
	*/
	this._j._difficulty ||= {};
	/**
	* The collection of difficulty configurations tracked by this player.
	* @type {DifficultyConfig[]}
	*/
	this._j._difficulty._configurations = [];
	/**
	* The max points available to allocate to difficulty layers.
	* @type {number}
	*/
	this._j._difficulty._layerPointMax = J.PASSIVE.EXT.DIFFICULTY.Metadata.initialPoints;
	/**
	* The current number of points allocated to difficulty layers.
	* @type {number}
	*/
	this._j._difficulty._layerPoints = 0;
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Updates the list of all available difficulties from the latest plugin metadata.
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameTemp.setupDifficultySystem();
};
/**
* Get all current configurations for difficulties.
* @returns {DifficultyConfig[]}
*/
Game_System.prototype.getAllDifficultyConfigs = function() {
	return this._j._difficulty._configurations;
};
/**
* Add a {@link DifficultyConfig} to the list of configurations.
* @param {DifficultyConfig} config The config to add.
*/
Game_System.prototype.addDifficultyConfig = function(config) {
	const difficultyConfigs = this.getAllDifficultyConfigs();
	difficultyConfigs.push(config);
};
/**
* Gets the {@link DifficultyConfig} associated with the given key.
* @param {string} key The key of the difficulty.
* @returns {DifficultyConfig|undefined} The config if found, undefined otherwise.
*/
Game_System.prototype.getDifficultyConfigByKey = function(key) {
	return this.getAllDifficultyConfigs().find((config) => config.key === key);
};
/**
* Registers a {@link DifficultyConfig} with the system if it is not already registered.
* @param {DifficultyConfig} difficultyConfig The config to register.
*/
Game_System.prototype.registerDifficultyConfig = function(difficultyConfig) {
	const { key } = difficultyConfig;
	const foundConfig = this.getDifficultyConfigByKey(key);
	if (!foundConfig) {
		this.addDifficultyConfig(difficultyConfig);
	}
};
/**
* Gets the number of max layer points the player has.
* @returns {number}
*/
Game_System.prototype.getLayerPointMax = function() {
	return this._j._difficulty._layerPointMax;
};
/**
* Sets the max layer points to a designated amount.
* @param {number} layerPointMax The new max layer point value.
*/
Game_System.prototype.setLayerPointMax = function(layerPointMax) {
	this._j._difficulty._layerPointMax = layerPointMax;
};
/**
* Modifies the max layer points by a given amount.
* @param {number} modifier The modifier against the max layer points.
*/
Game_System.prototype.modLayerPointMax = function(modifier) {
	this._j._difficulty._layerPointMax += modifier;
};
/**
* Gets the number of current layer points the player has available.
* @returns {number}
*/
Game_System.prototype.getLayerPoints = function() {
	return this._j._difficulty._layerPoints;
};
/**
* Sets the current number of layer points the player has available.
* @param {number} layerPoints The new amount of layer points for the player.
*/
Game_System.prototype.setLayerPoints = function(layerPoints) {
	this._j._difficulty._layerPoints = layerPoints;
};
/**
* Modifies the current layer points by a given amount.
* @param {number} modifier The modifier against the current layer points.
*/
Game_System.prototype.modLayerPoints = function(modifier) {
	this._j._difficulty._layerPoints += modifier;
};
/**
* Gets the remaining number of layer points available.
* @returns {number}
*/
Game_System.prototype.getRemainingLayerPoints = function() {
	return this.getLayerPointMax() - this.getLayerPoints();
};

//#endregion
//#region src/plugins/passive/ext/difficulty/objects/Game_Temp.js
/**
* Intializes all additional members of this class.
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Temp.set("initMembers", Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function() {
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Temp.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the difficulty system.
	*/
	this._j._difficulty ||= {};
	/**
	* All difficulties that were defined in the plugin metadata.
	* @type {Map<string, DifficultyMetadata>}
	*/
	this._j._difficulty._metadata = J.PASSIVE.EXT.DIFFICULTY.Metadata.allMetadatas;
	/**
	* All difficulties available for use.
	* @type {Map<string, DifficultyLayer>}
	*/
	this._j._difficulty._allLayers = new Map();
	/**
	* All difficulties' default configurations.
	* @type {Map<string, DifficultyConfig>}
	*/
	this._j._difficulty._allConfigs = new Map();
	/**
	* The "applied" difficulty: the summary layer the difficulty menu lists first, standing for every
	* enabled layer at once.
	* @type {DifficultyLayer}
	*/
	this._j._difficulty._appliedDifficulty = J_DiffPluginMetadata.defaultLayer();
	/**
	* The passive sources every actor draws its difficulty states from.
	* Empty while no layer in force grants actors a state.
	* @type {RPG_BaseItem[]}
	*/
	this._j._difficulty._actorSources = [];
	/**
	* The passive sources every enemy draws its difficulty states from.
	* Empty while no layer in force grants enemies a state.
	* @type {RPG_BaseItem[]}
	*/
	this._j._difficulty._enemySources = [];
};
/**
* Gets all difficulties that have been defined by plugin metadata.
* @returns {Map<string, DifficultyLayer>}
*/
Game_Temp.prototype.getAllDifficultyLayers = function() {
	return this._j._difficulty._allLayers;
};
/**
* Finds the {@link DifficultyLayer} that matches the given key.
* @param {string} key The key of the difficulty to find.
* @returns {DifficultyLayer|undefined} The difficulty if it existed, `undefined` otherwise;
*/
Game_Temp.prototype.findDifficultyLayerByKey = function(key) {
	const difficulties = this.getAllDifficultyLayers();
	return difficulties.get(key);
};
/**
* Sets up the difficulty layers based on the plugin parameters.
*/
Game_Temp.prototype.setupDifficultySystem = function() {
	this.metadata().forEach((difficultyMetadata, key) => {
		const difficultyLayer = DifficultyLayer.fromMetadata(difficultyMetadata);
		this.getAllDifficultyLayers().set(key, difficultyLayer);
		const difficultyConfig = DifficultyConfig.fromMetadata(difficultyMetadata);
		this.allConfigs().set(key, difficultyConfig);
		$gameSystem.registerDifficultyConfig(difficultyConfig);
	});
	this.refreshAppliedDifficulty();
};
/**
* Gets the applied difficulty.
* If somehow there is no applied difficulty in-place, then the default will be used.
* @returns {DifficultyLayer}
*/
Game_Temp.prototype.getAppliedDifficulty = function() {
	return this._j._difficulty._appliedDifficulty;
};
/**
* Sets the applied difficulty to the given difficulty.
* @param {DifficultyLayer} difficulty The new applied difficulty.
*/
Game_Temp.prototype.setAppliedDifficulty = function(difficulty) {
	this._j._difficulty._appliedDifficulty = difficulty;
};
/**
* Refreshes the applied difficulty, and everything that follows from it, from the enabled layers.
*
* This is the one seam every change to the enabled set passes through - starting a new game, loading a
* save, and toggling a layer all reach it - which is why each consequence of a change is rebuilt here
* rather than at a narrower call site.
*/
Game_Temp.prototype.refreshAppliedDifficulty = function() {
	const appliedDifficulty = this.buildAppliedDifficulty();
	this.setAppliedDifficulty(appliedDifficulty);
	this.refreshDifficultyPassiveSources();
	if (J.PASSIVE.EXT.AFFIX) {
		DifficultyAffixManager.buildEffectivePools();
	}
	this.refreshDifficultyPassives();
};
/**
* Builds the applied difficulty based on the currently enabled layers.
* With nothing enabled the authored default layer applies outright; otherwise a summary layer stands
* for every enabled layer at once, carrying their combined cost.
* @returns {DifficultyLayer}
*/
Game_Temp.prototype.buildAppliedDifficulty = function() {
	const enabledDifficulties = this.enabledDifficultyLayers();
	if (enabledDifficulties.length === 0) {
		return J_DiffPluginMetadata.defaultLayer();
	}
	const { cost: initialCost } = J_DiffPluginMetadata.defaultLayer();
	const cost = enabledDifficulties.reduce((runningCost, layer) => runningCost + layer.cost, initialCost);
	const { appliedKey, appliedName, appliedDescription } = DifficultyLayer;
	return new DifficultyBuilder(appliedName, appliedKey).setDescription(appliedDescription).setCost(cost).buildAsLayer();
};
/**
* Gets every layer the player currently has enabled, in the order the configurations are tracked.
* @returns {DifficultyLayer[]}
*/
Game_Temp.prototype.enabledDifficultyLayers = function() {
	return $gameSystem.getAllDifficultyConfigs().filter((config) => config.enabled).map((config) => this.findDifficultyLayerByKey(config.key));
};
/**
* Gets every layer currently in force: the enabled ones, or the default layer alone when nothing is
* enabled, mirroring {@link #buildAppliedDifficulty}.
* @returns {DifficultyLayer[]}
*/
Game_Temp.prototype.difficultyLayersInForce = function() {
	const enabledDifficulties = this.enabledDifficultyLayers();
	if (enabledDifficulties.length === 0) {
		return [J_DiffPluginMetadata.defaultLayer()];
	}
	return enabledDifficulties;
};
/**
* Gets the state ids the layers in force grant every actor, leaving out layers that grant none.
* @returns {number[]}
*/
Game_Temp.prototype.actorDifficultyStateIds = function() {
	return this.difficultyLayersInForce().map((layer) => layer.actorStateId).filter((stateId) => stateId !== 0);
};
/**
* Gets the state ids the layers in force grant every enemy, leaving out layers that grant none.
* @returns {number[]}
*/
Game_Temp.prototype.enemyDifficultyStateIds = function() {
	return this.difficultyLayersInForce().map((layer) => layer.enemyStateId).filter((stateId) => stateId !== 0);
};
/**
* Rebuilds the passive sources each side draws its difficulty states from.
*
* Built here, once per change, rather than on every request: J-Passive asks each battler for its
* sources whenever it re-reads that battler's passives, and J-Passive-Conditional asks on every rule
* sweep, so a fresh row per request would re-parse its note for every battler on every frame.
*/
Game_Temp.prototype.refreshDifficultyPassiveSources = function() {
	const actorStateIds = this.actorDifficultyStateIds();
	const enemyStateIds = this.enemyDifficultyStateIds();
	const actorSources = this.buildDifficultyPassiveSources(actorStateIds);
	const enemySources = this.buildDifficultyPassiveSources(enemyStateIds);
	this.setActorDifficultySources(actorSources);
	this.setEnemyDifficultySources(enemySources);
};
/**
* Builds the passive sources that grant the given states.
* J-Passive reads a synthetic row's `<uniquePassive>` tag exactly as it reads one on a database row,
* so one row carrying every granted id is all a side needs. Unique rather than stackable, so a state
* two layers somehow both name is still granted once.
* @param {number[]} stateIds The ids of the states to grant.
* @returns {RPG_BaseItem[]} One source carrying every id, or none when there is nothing to grant.
*/
Game_Temp.prototype.buildDifficultyPassiveSources = function(stateIds) {
	if (stateIds.length === 0) return [];
	const rawSource = {
		id: -1,
		meta: {},
		name: String.empty,
		note: `<uniquePassive:[${stateIds.join(",")}]>`,
		description: String.empty,
		iconIndex: 0
	};
	return [new RPG_BaseItem(rawSource, rawSource.id)];
};
/**
* Hands every living battler the difficulty states now in force.
*
* J-Passive rebuilds a battler's passives only when something about that battler changes, and a
* difficulty toggle changes nothing about any battler, so each one has to be told. Rebuilding its
* passives also invalidates the trait, note and parameter caches that read them.
*/
Game_Temp.prototype.refreshDifficultyPassives = function() {
	$gameActors.existingActors().forEach((actor) => actor.refreshPassiveStates());
	$gameTroop.members().forEach((enemy) => enemy.refreshPassiveStates());
	if (J.ABS) {
		JABS_AiManager.getAllBattlers().map((jabsBattler) => jabsBattler.getBattler()).filter((battler) => battler.isEnemy()).forEach((enemy) => enemy.refreshPassiveStates());
	}
};
/**
* Gets the difficulty metadata staged for the layer being edited.
* @returns {object} The staged difficulty metadata.
*/
Game_Temp.prototype.metadata = function() {
	return this._j._difficulty._metadata;
};
/**
* Gets the all configs.
* @returns {Map<string, DifficultyConfig>} The allConfigs.
*/
Game_Temp.prototype.allConfigs = function() {
	return this._j._difficulty._allConfigs;
};
/**
* Gets the passive sources every actor draws its difficulty states from.
* @returns {RPG_BaseItem[]}
*/
Game_Temp.prototype.actorDifficultySources = function() {
	return this._j._difficulty._actorSources;
};
/**
* Sets the passive sources every actor draws its difficulty states from.
* @param {RPG_BaseItem[]} sources The new sources.
*/
Game_Temp.prototype.setActorDifficultySources = function(sources) {
	this._j._difficulty._actorSources = sources;
};
/**
* Gets the passive sources every enemy draws its difficulty states from.
* @returns {RPG_BaseItem[]}
*/
Game_Temp.prototype.enemyDifficultySources = function() {
	return this._j._difficulty._enemySources;
};
/**
* Sets the passive sources every enemy draws its difficulty states from.
* @param {RPG_BaseItem[]} sources The new sources.
*/
Game_Temp.prototype.setEnemyDifficultySources = function(sources) {
	this._j._difficulty._enemySources = sources;
};

//#endregion
//#region src/plugins/passive/ext/difficulty/objects/Game_Actor.js
/**
* Extends {@link #getPassiveStateSources}.<br/>
* Also includes the source carrying every state the difficulty layers in force grant actors. A
* difficulty is a passive that is on for everyone, perpetually, so every actor draws from the same
* source.
* @returns {RPG_BaseItem[]}
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Actor.set("getPassiveStateSources", Game_Actor.prototype.getPassiveStateSources);
Game_Actor.prototype.getPassiveStateSources = function() {
	const sources = J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Actor.get("getPassiveStateSources").call(this);
	const difficultySources = $gameTemp.actorDifficultySources();
	return [...sources, ...difficultySources];
};

//#endregion
//#region src/plugins/passive/ext/difficulty/objects/Game_Enemy.js
/**
* Extends {@link #getPassiveStateSources}.<br/>
* Also includes the source carrying every state the difficulty layers in force grant enemies. A
* difficulty is a passive that is on for everyone, perpetually, so every enemy draws from the same
* source.
* @returns {RPG_BaseItem[]}
*/
J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Enemy.set("getPassiveStateSources", Game_Enemy.prototype.getPassiveStateSources);
Game_Enemy.prototype.getPassiveStateSources = function() {
	const sources = J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Enemy.get("getPassiveStateSources").call(this);
	const difficultySources = $gameTemp.enemyDifficultySources();
	return [...sources, ...difficultySources];
};

//#endregion
//#region src/plugins/passive/ext/difficulty/objects/Game_Event.js
if (J.PASSIVE.EXT.AFFIX) {
	/**
	* Extends {@link #getResolvedPassiveAffixPrefixChance}.<br/>
	* Also scales the resolved chance by whatever the difficulty layers in force ask for.
	*
	* Scaling the resolved value rather than the plugin default is deliberate: it composes with the
	* existing precedence chain instead of competing with it, so an event comment or enemy note still
	* decides the baseline and the difficulty only says how much more or less of it applies. A spawn
	* pinned to zero stays at zero, because no multiplier moves zero.
	* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
	* @returns {number}
	*/
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Event.set("getResolvedPassiveAffixPrefixChance", Game_Event.prototype.getResolvedPassiveAffixPrefixChance);
	Game_Event.prototype.getResolvedPassiveAffixPrefixChance = function(enemyData) {
		const original = J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Event.get("getResolvedPassiveAffixPrefixChance").call(this, enemyData);
		const factor = DifficultyAffixManager.prefixChanceFactor();
		return (original * factor).clamp(0, 100);
	};
	/**
	* Extends {@link #getResolvedPassiveAffixSuffixChance}.<br/>
	* Also scales the resolved chance by whatever the difficulty layers in force ask for.
	* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
	* @returns {number}
	*/
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Event.set("getResolvedPassiveAffixSuffixChance", Game_Event.prototype.getResolvedPassiveAffixSuffixChance);
	Game_Event.prototype.getResolvedPassiveAffixSuffixChance = function(enemyData) {
		const original = J.PASSIVE.EXT.DIFFICULTY.Aliased.Game_Event.get("getResolvedPassiveAffixSuffixChance").call(this, enemyData);
		const factor = DifficultyAffixManager.suffixChanceFactor();
		return (original * factor).clamp(0, 100);
	};
}

//#endregion
//#region src/plugins/passive/ext/difficulty/_metadata/JPassiveAffix_PluginMetadata.js
if (J.PASSIVE.EXT.AFFIX) {
	/**
	* Extends {@link #effectivePrefixPool}.<br/>
	* Also substitutes the difficulty-adjusted pool once one has been built.
	*
	* Aliasing a prototype method works here even though the metadata instance was constructed long
	* before this file ran: methods live on the prototype, dispatch resolves at call time, and the
	* instance carries no own property shadowing them - so the existing instance sees the replacement.
	*/
	J.PASSIVE.EXT.DIFFICULTY.Aliased.JPassiveAffix_PluginMetadata.set("effectivePrefixPool", JPassiveAffix_PluginMetadata.prototype.effectivePrefixPool);
	JPassiveAffix_PluginMetadata.prototype.effectivePrefixPool = function() {
		const original = J.PASSIVE.EXT.DIFFICULTY.Aliased.JPassiveAffix_PluginMetadata.get("effectivePrefixPool").call(this);
		const adjusted = DifficultyAffixManager.effectivePrefixPool();
		if (adjusted === null) return original;
		return adjusted;
	};
	/**
	* Extends {@link #effectiveSuffixPool}.<br/>
	* Also substitutes the difficulty-adjusted pool once one has been built.
	*/
	J.PASSIVE.EXT.DIFFICULTY.Aliased.JPassiveAffix_PluginMetadata.set("effectiveSuffixPool", JPassiveAffix_PluginMetadata.prototype.effectiveSuffixPool);
	JPassiveAffix_PluginMetadata.prototype.effectiveSuffixPool = function() {
		const original = J.PASSIVE.EXT.DIFFICULTY.Aliased.JPassiveAffix_PluginMetadata.get("effectiveSuffixPool").call(this);
		const adjusted = DifficultyAffixManager.effectiveSuffixPool();
		if (adjusted === null) return original;
		return adjusted;
	};
}

//#endregion
//#region src/plugins/passive/ext/difficulty/scenes/Scene_Boot.js
if (J.PASSIVE.EXT.AFFIX) {
	/**
	* Extends {@link #onDatabaseLoaded}.<br/>
	* Also validates every configured affix grant and sorts each into the slot its state belongs to.
	*
	* This is the earliest moment the work can happen and the latest it should. Deciding a grant's slot
	* reads notetags off a hydrated `$dataStates` row, which does not exist while plugin metadata is
	* being constructed - and deferring it any later would mean a broken grant on a layer nobody enables
	* never gets checked at all.
	*/
	J.PASSIVE.EXT.DIFFICULTY.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
	Scene_Boot.prototype.onDatabaseLoaded = function() {
		J.PASSIVE.EXT.DIFFICULTY.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
		DifficultyAffixManager.assertGrantsAreValid();
	};
}

//#endregion
//#region src/plugins/passive/ext/difficulty/windows/Window_DifficultyList.js
var Window_DifficultyList = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of difficulties for this window.
	*/
	makeCommandList() {
		const difficulties = DifficultyManager.visibleDifficulties();
		if (!difficulties.length) return;
		difficulties.sort((a, b) => {
			if (a.key < b.key) return -1;
			if (a.key > b.key) return 1;
			return 0;
		});
		difficulties.forEach(this.makeDifficultyCommand, this);
		const appliedDifficulty = $gameTemp.getAppliedDifficulty();
		this.prependCommand(`\\I[${appliedDifficulty.iconIndex}]${appliedDifficulty.name}`, appliedDifficulty.key, false, appliedDifficulty, 83, 6);
	}
	/**
	* Make and add a single difficulty command.
	* @param {DifficultyLayer} difficulty The dfificulty command to create.
	*/
	makeDifficultyCommand(difficulty) {
		if (difficulty.isHidden()) return;
		if (difficulty.isDefaultLayer()) return;
		const enabledIcon = difficulty.isEnabled() ? 25 : 16;
		let difficultyName = `\\I[${difficulty.iconIndex}]${difficulty.name}`;
		if (!difficulty.isUnlocked()) {
			const lockIcon = 2530;
			difficultyName = `\\I[${lockIcon}]${difficultyName}`;
		}
		const enoughLayerPoints = difficulty.isEnabled() || difficulty.canPayCost();
		const enabled = difficulty.isUnlocked() && enoughLayerPoints;
		this.addCommand(difficultyName, difficulty.key, enabled, difficulty, enabledIcon);
	}
	/**
	* Gets the difficulty being hovered over in this list.
	* @returns {DifficultyLayer}
	*/
	hoveredDifficulty() {
		return this.currentExt();
	}
	/**
	* Designed for overriding to weave in functionality on-change of the index.
	*/
	onIndexChange() {}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/windows/Window_DifficultyPoints.js
/**
* A window containing the difficulty points information.
*/
var Window_DifficultyPoints = class extends Window_Base {
	/**
	* The difficulty layer that the cursor is currently hovering over.
	* @type {DifficultyLayer|null}
	*/
	_hoveredDifficulty = null;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Get the currently hovered difficulty from the list window.
	* @returns {DifficultyLayer}
	*/
	getHoveredDifficulty() {
		return this._hoveredDifficulty;
	}
	/**
	* Set the currently hovered difficulty used by this window.
	* @param {DifficultyLayer} difficulty The difficulty currently hovered.
	*/
	setHoveredDifficulty(difficulty) {
		this._hoveredDifficulty = difficulty;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws the various data points surrounding the difficulty layer points
	* and how they are affected by the difficulty layer currently being
	* hovered over by the player.
	*/
	drawContent() {
		const lh = this.lineHeight();
		this.drawHeader(0, 0);
		const columnWidth = this.figureColumnWidth();
		this.drawMaxLayerPoints(0, lh, columnWidth);
		this.drawCurrentLayerPoints(columnWidth, lh, columnWidth);
		this.drawLayerModifier(columnWidth * 2, lh, columnWidth);
	}
	/**
	* The width of each of the three figures on the line beneath the header.
	*
	* A third of the window rather than a pixel count, so the figures spread to fit whatever width the scene
	* gives the window, and a label never shares its space with the value beside it.
	* @returns {number}
	*/
	figureColumnWidth() {
		return Math.floor(this.innerWidth / 3);
	}
	/**
	* Renders the header for the difficulty layer points available to the player.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	drawHeader(x, y) {
		this.resetFontSettings();
		this.modFontSize(10);
		this.toggleItalics(true);
		this.drawIcon(2564, x, y);
		const modX = x + ImageManager.iconWidth + 4;
		const modY = y - 2;
		const titleWidth = this.innerWidth - modX;
		this.drawText("Difficulty Layer Points", modX, modY, titleWidth, "left");
		this.resetFontSettings();
	}
	/**
	* Renders the maximum amount of layer points the player has available.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	* @param {number} width The width of this figure's column.
	*/
	drawMaxLayerPoints(x, y, width) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const layerPointMax = $gameSystem.getLayerPointMax();
		this.toggleBold(true);
		this.drawText("Max:", x, y, width, "left");
		this.toggleBold(false);
		const valueWidth = width - this.itemPadding();
		this.drawText(`${layerPointMax}`, x, y, valueWidth, "right");
		this.resetFontSettings();
	}
	/**
	* Renders the currently applied layer points.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	* @param {number} width The width of this figure's column.
	*/
	drawCurrentLayerPoints(x, y, width) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const layerPointsCurrent = $gameSystem.getLayerPoints();
		this.toggleBold(true);
		this.drawText("Applied:", x, y, width, "left");
		this.toggleBold(false);
		const valueWidth = width - this.itemPadding();
		this.drawText(`${layerPointsCurrent}`, x, y, valueWidth, "right");
		this.resetFontSettings();
	}
	/**
	* Renders the modifier against the current amount of applied layer points.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	* @param {number} width The width of this figure's column.
	*/
	drawLayerModifier(x, y, width) {
		const difficulty = this.getHoveredDifficulty();
		if (!difficulty) return;
		if (difficulty.isAppliedLayer() || difficulty.isDefaultLayer()) return;
		this.resetFontSettings();
		const layerCost = difficulty.cost;
		let sign = String.empty;
		let costColorIndex = 0;
		if (layerCost > 0) {
			sign = "+";
			if (layerCost + $gameSystem.getLayerPoints() > $gameSystem.getLayerPointMax()) {
				costColorIndex = 10;
			} else {
				costColorIndex = 20;
			}
		}
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.textColor(costColorIndex));
		this.drawText(`(${sign}${layerCost})`, x, y, width, "left");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/services/DifficultyEffects.js
/**
* Turns difficulty layers into the rows the difficulty scene lists for each side of every fight.
*
* A layer's effects live on two states, one every actor carries and one every enemy carries, so describing a
* layer means describing those states' traits and tags. The applied layer at the top of the list stands for every
* layer in force at once, so it answers with all of their states together.
*
* Traits on the same stat fold into one through {@link TraitResolver.consolidate}, which adds them up the way
* J-Base stacks them in battle. A row then reads from the player's chair: whatever helps the party or hurts the
* enemies makes the game easier, and the reverse makes it harder.
*
* Tags follow the traits, each described by the plugin that owns it through {@link NotetagDescriber}. They are
* never merged, because how several copies of a tag combine is up to the plugin that reads it.
*
* Nothing here draws. The scene hands these rows to its effect lists, which only lay them out.
*/
var DifficultyEffects = class DifficultyEffects {
	/**
	* The two sides of every fight a layer hands a state to.
	* @type {{ACTOR: string, ENEMY: string}}
	*/
	static Sides = {
		ACTOR: "actor",
		ENEMY: "enemy"
	};
	/**
	* How a row reads from the player's chair.
	* @type {{EASIER: string, HARDER: string, NEUTRAL: string}}
	*/
	static Tones = {
		EASIER: "easier",
		HARDER: "harder",
		NEUTRAL: "neutral"
	};
	/**
	* The trait codes carrying one of the three parameter families, whose good direction the parameter catalog
	* already knows.
	* @type {number[]}
	*/
	static ParameterTraitCodes = [
		21,
		22,
		23
	];
	/**
	* The trait codes for rates of something done to their holder: element damage taken, debuffs and ailments.
	* Less of any of those is better for whoever carries it.
	* @type {number[]}
	*/
	static IntakeRateTraitCodes = [
		11,
		12,
		13
	];
	/**
	* The trait codes that mark something other than an effect, and so never become a row. Code 63 is
	* J-JAFTING's marker for traits that transfer, which the passive detail view leaves out as well.
	* @type {number[]}
	*/
	static HiddenTraitCodes = [63];
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* The rows describing what a layer does to one side of every fight.
	* @param {DifficultyLayer} layer The layer being described.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {Array<{iconIndex: number, name: string, value: string, tone: string, isProse?: boolean}>}
	*/
	static rowsFor(layer, side) {
		const stateIds = DifficultyEffects.stateIdsFor(layer, side);
		const traitRows = DifficultyEffects.effectTraits(stateIds).map((trait) => DifficultyEffects.rowFor(trait, side));
		const tagRows = DifficultyEffects.effectLines(stateIds).map((line) => DifficultyEffects.rowForLine(line, side));
		return [...traitRows, ...tagRows];
	}
	/**
	* The states a layer hands one side of every fight.
	* @param {DifficultyLayer} layer The layer being described.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {number[]}
	*/
	static stateIdsFor(layer, side) {
		if (layer.isAppliedLayer()) return DifficultyEffects.stateIdsInForce(side);
		const stateId = DifficultyEffects.stateIdOf(layer, side);
		if (stateId === 0) return [];
		return [stateId];
	}
	/**
	* The state a layer names for one side of every fight, or 0 when it names none.
	* @param {DifficultyLayer} layer The layer being read.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {number}
	*/
	static stateIdOf(layer, side) {
		if (side === DifficultyEffects.Sides.ACTOR) return layer.actorStateId;
		return layer.enemyStateId;
	}
	/**
	* The states every layer in force hands one side of every fight.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {number[]}
	*/
	static stateIdsInForce(side) {
		if (side === DifficultyEffects.Sides.ACTOR) return $gameTemp.actorDifficultyStateIds();
		return $gameTemp.enemyDifficultyStateIds();
	}
	/**
	* The traits of the given states, one per effect, in the order a status screen lists stats.
	* @param {number[]} stateIds The states to read.
	* @returns {RPG_Trait[]}
	*/
	static effectTraits(stateIds) {
		const traits = stateIds.flatMap((stateId) => $dataStates[stateId].traits).filter((trait) => DifficultyEffects.HiddenTraitCodes.includes(trait.code) === false);
		const consolidated = TraitResolver.consolidate(traits);
		return consolidated.sort(DifficultyEffects.compareTraits);
	}
	/**
	* Orders two traits by code, and by stat within a code.
	* @param {RPG_Trait} a The first trait.
	* @param {RPG_Trait} b The second trait.
	* @returns {number}
	*/
	static compareTraits(a, b) {
		if (a.code !== b.code) return a.code - b.code;
		return a.dataId - b.dataId;
	}
	/**
	* The lines describing every tag the given states carry, state by state.
	* @param {number[]} stateIds The states to read.
	* @returns {NotetagLine[]}
	*/
	static effectLines(stateIds) {
		return stateIds.flatMap((stateId) => NotetagDescriber.linesFor($dataStates[stateId]));
	}
	/**
	* The row describing one effect to one side of every fight.
	* @param {RPG_Trait} trait The effect.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {{iconIndex: number, name: string, value: string, tone: string}}
	*/
	static rowFor(trait, side) {
		return {
			iconIndex: trait.iconIndex(),
			name: trait.textName(),
			value: trait.textValue(),
			tone: DifficultyEffects.toneFor(trait, side)
		};
	}
	/**
	* The row describing one tag's line to one side of every fight.
	*
	* A line written as a sentence keeps its value inside its words, so its row says so, and the list colors the
	* value where it stands rather than on the right.
	* @param {NotetagLine} line The line.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {{iconIndex: number, name: string, value: string, tone: string, isProse: boolean}}
	*/
	static rowForLine(line, side) {
		return {
			iconIndex: line.iconIndex,
			name: line.text,
			value: line.value,
			tone: DifficultyEffects.toneForImpact(line.holderImpact, side),
			isProse: line.hasValueInPlace()
		};
	}
	/**
	* How an effect reads from the player's chair, given the side it applies to: one of
	* {@link DifficultyEffects.Tones}.
	* @param {RPG_Trait} trait The effect.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {string}
	*/
	static toneFor(trait, side) {
		const impact = DifficultyEffects.holderImpact(trait);
		return DifficultyEffects.toneForImpact(impact, side);
	}
	/**
	* How an effect reads from the player's chair, given which way it cuts for its holder and the side holding it:
	* one of {@link DifficultyEffects.Tones}.
	* @param {number} impact Whether the effect helps its holder (1), hurts it (-1), or neither (0).
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {string}
	*/
	static toneForImpact(impact, side) {
		if (impact === 0) return DifficultyEffects.Tones.NEUTRAL;
		const isPartySide = side === DifficultyEffects.Sides.ACTOR;
		const isGoodForHolder = impact > 0;
		if (isPartySide === isGoodForHolder) return DifficultyEffects.Tones.EASIER;
		return DifficultyEffects.Tones.HARDER;
	}
	/**
	* Whether an effect helps its holder (1), hurts it (-1), or neither (0).
	* @param {RPG_Trait} trait The effect.
	* @returns {number}
	*/
	static holderImpact(trait) {
		if (DifficultyEffects.ParameterTraitCodes.includes(trait.code)) {
			return DifficultyEffects.parameterImpact(trait);
		}
		if (DifficultyEffects.IntakeRateTraitCodes.includes(trait.code)) {
			return DifficultyEffects.intakeRateImpact(trait);
		}
		return 0;
	}
	/**
	* Whether a parameter trait helps its holder (1) or hurts it (-1).
	*
	* The parameter catalog decides which direction is good, so a cost or damage rate reads the right way round
	* without a table of its own here.
	* @param {RPG_Trait} trait A trait of one of the three parameter families.
	* @returns {number}
	*/
	static parameterImpact(trait) {
		const parameterKeys = DifficultyEffects.parameterKeysFor(trait.code);
		const parameterKey = parameterKeys[trait.dataId];
		const definition = ParameterRegistry.get(parameterKey);
		const isIncrease = DifficultyEffects.parameterChange(trait) > 0;
		if (isIncrease === definition.isIncreaseBeneficial()) return 1;
		return -1;
	}
	/**
	* The parameter keys of one parameter family, in data id order.
	* @param {number} code The trait code of the family.
	* @returns {string[]}
	*/
	static parameterKeysFor(code) {
		if (code === ParameterTraitMap.BaseParameterCode) return ParameterTraitMap.BaseParameterKeys;
		if (code === ParameterTraitMap.ExParameterCode) return ParameterTraitMap.ExParameterKeys;
		return ParameterTraitMap.SpParameterKeys;
	}
	/**
	* How far a parameter trait moves its stat. An ex-parameter's value is its own change, while every other
	* parameter rate is a multiplier around 1.
	* @param {RPG_Trait} trait A trait of one of the three parameter families.
	* @returns {number}
	*/
	static parameterChange(trait) {
		if (trait.code === ParameterTraitMap.ExParameterCode) return trait.value;
		return trait.value - 1;
	}
	/**
	* Whether a rate of something done to the holder helps it (1) or hurts it (-1).
	* @param {RPG_Trait} trait An element, debuff or state rate trait.
	* @returns {number}
	*/
	static intakeRateImpact(trait) {
		if (trait.value < 1) return 1;
		return -1;
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/windows/Window_DifficultyEffectList.js
/**
* One side of a difficulty layer as a flat list: a title naming the side, then one row per effect.
*
* The rows arrive already decided by {@link DifficultyEffects}; this window only lays them out. Each row is the
* effect's icon and name, with its value on the right in the color of how it reads for the player.
*
* A row too long for the list carries on beneath itself rather than running off its edge, and stands as tall as
* the lines it takes, so everything beneath it moves down to make room.
*
* It is a list to read, never one to choose from, so it holds no cursor and takes no input.
*/
var Window_DifficultyEffectList = class Window_DifficultyEffectList extends Window_Command {
	/**
	* The title row naming each side of every fight, keyed by side.
	*
	* A table on the class rather than a local, so an extension adding a side of its own adds its title beside
	* these.
	* @type {Object<string, {name: string, iconIndex: number, colorIndex: number}>}
	*/
	static Titles = {
		actor: {
			name: "Actor Effects",
			iconIndex: 82,
			colorIndex: 1
		},
		enemy: {
			name: "Enemy Effects",
			iconIndex: 14,
			colorIndex: 2
		}
	};
	/**
	* The text color index for each tone a row can carry: the engine's own power-up and power-down colors, the
	* same ones the passive detail view uses.
	* @type {Object<string, number>}
	*/
	static ToneColorIndices = {
		easier: 24,
		harder: 25,
		neutral: 0
	};
	/**
	* What the list says when the layer leaves its side untouched.
	* @type {string}
	*/
	static NoEffectsText = "No effects.";
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.deselect();
		this.deactivate();
	}
	/**
	* Implements {@link Window_Command#initMembers}.<br/>
	* Seeds the side and the rows before the command list is first built from them.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The side of every fight this list describes, or empty before one is chosen.
		* @type {string}
		*/
		this._side = String.empty;
		/**
		* The rows describing each effect on this side.
		* @type {Array<{iconIndex: number, name: string, value: string, tone: string}>}
		*/
		this._rows = [];
	}
	/**
	* Gets the side of every fight this list describes.
	* @returns {string}
	*/
	side() {
		return this._side;
	}
	/**
	* Sets the side of every fight this list describes, and lists it.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	*/
	setSide(side) {
		this._side = side;
		this.refresh();
	}
	/**
	* Gets the rows describing each effect on this side.
	* @returns {Array<{iconIndex: number, name: string, value: string, tone: string}>}
	*/
	rows() {
		return this._rows;
	}
	/**
	* Sets the rows describing each effect on this side, and lists them.
	* @param {Array<{iconIndex: number, name: string, value: string, tone: string}>} rows The new rows.
	*/
	setRows(rows) {
		this._rows = rows;
		this.refresh();
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Lists the title, then one row per effect, or a single row saying there are none.
	*/
	makeCommandList() {
		if (this.side() === String.empty) return;
		this.addBuiltCommand(this.buildTitleCommand());
		if (this.rows().length === 0) {
			this.addBuiltCommand(this.buildNoEffectsCommand());
			return;
		}
		this.rows().forEach((row) => this.addBuiltCommand(this.buildEffectCommand(row)));
	}
	/**
	* Builds the title row naming this list's side.
	* @returns {BuiltWindowCommand}
	*/
	buildTitleCommand() {
		const { name, iconIndex, colorIndex } = Window_DifficultyEffectList.Titles[this.side()];
		return new WindowCommandBuilder(name).setIconIndex(iconIndex).setColorIndex(colorIndex).build();
	}
	/**
	* Builds the row saying this side is left untouched.
	* @returns {BuiltWindowCommand}
	*/
	buildNoEffectsCommand() {
		return new WindowCommandBuilder(Window_DifficultyEffectList.NoEffectsText).build();
	}
	/**
	* Builds the row for one effect.
	* @param {{iconIndex: number, name: string, value: string, tone: string, isProse?: boolean}} row The effect.
	* @returns {BuiltWindowCommand}
	*/
	buildEffectCommand(row) {
		if (row.isProse === true) return this.buildProseCommand(row);
		const { iconIndex, name, value, tone } = row;
		const valueColorIndex = this.toneColorIndex(tone);
		return this.wrappedRowBuilder(name, iconIndex, value).setRightText(value).setRightColorIndex(valueColorIndex).build();
	}
	/**
	* Builds the row for one effect written as a sentence, its value colored and bolded right where it stands.
	* @param {{iconIndex: number, name: string, value: string, tone: string, isProse: boolean}} row The effect.
	* @returns {BuiltWindowCommand}
	*/
	buildProseCommand(row) {
		const { iconIndex, name, value, tone } = row;
		const valueColorIndex = this.toneColorIndex(tone);
		const sentence = NotetagLine.withValueInPlace(name, value, valueColorIndex);
		return this.wrappedRowBuilder(sentence, iconIndex, String.empty).build();
	}
	/**
	* A builder for a row whose words may not fit on one line: its first line as the command's name, and every line
	* after it beneath.
	* @param {string} text The row's words, text codes and all.
	* @param {number} iconIndex The row's icon, or 0 for none.
	* @param {string} rightText What the row shows on its right, or empty for nothing.
	* @returns {WindowCommandBuilder}
	*/
	wrappedRowBuilder(text, iconIndex, rightText) {
		const [firstLine, ...moreLines] = this.wrapToRow(text, iconIndex, rightText);
		return new WindowCommandBuilder(firstLine).setTextLines(moreLines).flagAsMultiline().setIconIndex(iconIndex);
	}
	/**
	* The lines a row's words take, none wider than the room the row leaves them, each picking back up whatever color
	* or bold the line before it left open.
	* @param {string} text The row's words, text codes and all.
	* @param {number} iconIndex The row's icon, or 0 for none.
	* @param {string} rightText What the row shows on its right, or empty for nothing.
	* @returns {string[]}
	*/
	wrapToRow(text, iconIndex, rightText) {
		const width = this.rowTextWidth(iconIndex, rightText);
		return TextWrapper.wrapStyled(text, width, (candidate) => this.textSizeEx(candidate).width);
	}
	/**
	* The room a row leaves its words: the row's width, less the indent its icon takes and whatever its right text
	* needs.
	* @param {number} iconIndex The row's icon, or 0 for none.
	* @param {string} rightText What the row shows on its right, or empty for nothing.
	* @returns {number}
	*/
	rowTextWidth(iconIndex, rightText) {
		const { width } = this.itemLineRect(0);
		const indent = this.commandNameIndent(iconIndex > 0);
		const rightTextWidth = this.textWidth(rightText);
		return width - indent - rightTextWidth;
	}
	/**
	* Overwrites {@link Window_Command#multilineLineHeight}.<br/>
	* Spaces the lines of a wrapped row a full line apart, since they are one sentence at one size rather than smaller
	* subtext beneath a name.
	* @returns {number}
	*/
	multilineLineHeight() {
		return this.lineHeight();
	}
	/**
	* Extends {@link Window_Selectable#itemRect}.<br/>
	* Makes each row as tall as its lines: a row that wrapped grows by a line for every line it wrapped onto, and
	* every row beneath it moves down by as much.
	* @param {number} index The row.
	* @returns {Rectangle}
	*/
	itemRect(index) {
		const rect = super.itemRect(index);
		rect.y += this.extraHeightAbove(index);
		rect.height += this.extraHeightOf(index);
		return rect;
	}
	/**
	* Extends {@link Window_Selectable#overallHeight}.<br/>
	* Also counts the lines every wrapped row adds, so the list knows how tall its rows really stand.
	* @returns {number}
	*/
	overallHeight() {
		const height = super.overallHeight();
		const extraHeight = this.extraHeightAbove(this.maxItems());
		return height + extraHeight;
	}
	/**
	* How much taller than one line the rows above the given one stand, all together.
	* @param {number} index The row.
	* @returns {number}
	*/
	extraHeightAbove(index) {
		const extraHeights = Array.from({ length: index }, (_, row) => this.extraHeightOf(row));
		return extraHeights.reduce((total, extraHeight) => total + extraHeight, 0);
	}
	/**
	* How much taller than one line a row stands: a line's height for every line its words wrapped onto.
	* @param {number} index The row.
	* @returns {number}
	*/
	extraHeightOf(index) {
		const extraLines = this.commandLines(index);
		return extraLines.length * this.multilineLineHeight();
	}
	/**
	* The text color index for a tone.
	*
	* Its own method rather than an inline lookup, so an extension wanting different colors aliases this one
	* answer instead of rebuilding the row.
	* @param {string} tone One of {@link DifficultyEffects.Tones}.
	* @returns {number}
	*/
	toneColorIndex(tone) {
		return Window_DifficultyEffectList.ToneColorIndices[tone];
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/scenes/Scene_Difficulty.js
/**
* The difficulty scene, where the player turns difficulty layers on and off.
*
* Built on {@link Scene_MenuFacetBase}, which owns the chrome: the help strip across the top describes the
* highlighted layer, and the control legend across the bottom teaches the controls. In the region between
* them, the command column holds the layer points above the list of layers, and the rest is split down the
* middle between the two sides of every fight, each listing what the highlighted layer does to it.
*
* The first row of the list is the applied difficulty, which stands for every layer in force at once, so
* highlighting it lists everything the player currently has on, merged into one row per stat.
*/
var Scene_Difficulty = class extends Scene_MenuFacetBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Constructor.
	*
	* No explicit `initialize()` call: the engine's own scene constructor performs one, and a second would run
	* the whole initialization twice.
	*/
	constructor() {
		super();
	}
	/**
	* Extends {@link Scene_MenuFacetBase.initMembers}.<br/>
	* Also initializes the windows this scene tracks.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the difficulty scene.
		*/
		this._j._difficulty = {};
		/**
		* The window showing the layer point budget, and what the highlighted layer would cost.
		* @type {Window_DifficultyPoints|null}
		*/
		this._j._difficulty._pointsWindow = null;
		/**
		* The list of difficulty layers the player may see.
		* @type {Window_DifficultyList|null}
		*/
		this._j._difficulty._listWindow = null;
		/**
		* The list of what the highlighted layer does to the party.
		* @type {Window_DifficultyEffectList|null}
		*/
		this._j._difficulty._actorEffectsWindow = null;
		/**
		* The list of what the highlighted layer does to the enemies.
		* @type {Window_DifficultyEffectList|null}
		*/
		this._j._difficulty._enemyEffectsWindow = null;
	}
	/**
	* Extends {@link Scene_MenuFacetBase.create}.<br/>
	* Also creates the help strip and this scene's own windows.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createAllWindows();
	}
	/**
	* Creates all windows associated with the difficulty scene, then shows the highlighted layer in them.
	*/
	createAllWindows() {
		this.createPointsWindow();
		this.createActorEffectsWindow();
		this.createEnemyEffectsWindow();
		this.createListWindow();
		this.onHoverChange();
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* Describes the controls this scene responds to.
	* @returns {{semantic: string, label: string}[]}
	*/
	controlLegendEntries() {
		return [{
			semantic: "ok",
			label: "toggle layer"
		}, {
			semantic: "cancel",
			label: "back"
		}];
	}
	/**
	* The height of the points window, which draws a header and one row.
	* @returns {number}
	*/
	pointsWindowHeight() {
		return this.calcWindowHeight(2, false);
	}
	/**
	* The width of each effects list: half of what the command column leaves over.
	* @returns {number}
	*/
	effectsListWidth() {
		const facetArea = this.facetAreaRect();
		const leftOver = facetArea.width - this.commandColumnWidth();
		return Math.floor(leftOver / 2);
	}
	/**
	* Gets the rectangle for the points window, atop the command column.
	* @returns {Rectangle}
	*/
	pointsWindowRect() {
		const facetArea = this.facetAreaRect();
		const width = this.commandColumnWidth();
		const height = this.pointsWindowHeight();
		return new Rectangle(facetArea.x, facetArea.y, width, height);
	}
	/**
	* Gets the rectangle for the list of layers, filling the command column beneath the points window.
	* @returns {Rectangle}
	*/
	listWindowRect() {
		const facetArea = this.facetAreaRect();
		const pointsHeight = this.pointsWindowHeight();
		const y = facetArea.y + pointsHeight;
		const width = this.commandColumnWidth();
		const height = facetArea.height - pointsHeight;
		return new Rectangle(facetArea.x, y, width, height);
	}
	/**
	* Gets the rectangle for the party's effects, beside the command column and the full height of the region.
	* @returns {Rectangle}
	*/
	actorEffectsWindowRect() {
		const facetArea = this.facetAreaRect();
		const x = facetArea.x + this.commandColumnWidth();
		const width = this.effectsListWidth();
		return new Rectangle(x, facetArea.y, width, facetArea.height);
	}
	/**
	* Gets the rectangle for the enemies' effects, from the party's list to the edge of the region.
	*
	* Its width is the remainder rather than a second half, so rounding can never leave a seam of unclaimed
	* pixels at the right edge.
	* @returns {Rectangle}
	*/
	enemyEffectsWindowRect() {
		const facetArea = this.facetAreaRect();
		const x = facetArea.x + this.commandColumnWidth() + this.effectsListWidth();
		const width = facetArea.x + facetArea.width - x;
		return new Rectangle(x, facetArea.y, width, facetArea.height);
	}
	/**
	* Creates the points window and adds it to tracking.
	*/
	createPointsWindow() {
		const window = this.buildPointsWindow();
		this.setPointsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the points window.
	* @returns {Window_DifficultyPoints}
	*/
	buildPointsWindow() {
		const rectangle = this.pointsWindowRect();
		return new Window_DifficultyPoints(rectangle);
	}
	/**
	* Get the currently tracked points window.
	* @returns {Window_DifficultyPoints}
	*/
	getPointsWindow() {
		return this._j._difficulty._pointsWindow;
	}
	/**
	* Set the currently tracked points window to the given window.
	* @param {Window_DifficultyPoints} pointsWindow The points window to track.
	*/
	setPointsWindow(pointsWindow) {
		this._j._difficulty._pointsWindow = pointsWindow;
	}
	/**
	* Creates the list of difficulties available to the player.
	*/
	createListWindow() {
		const window = this.buildListWindow();
		this.setDifficultyListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the difficulty list window.
	* @returns {Window_DifficultyList}
	*/
	buildListWindow() {
		const rectangle = this.listWindowRect();
		const window = new Window_DifficultyList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onSelectDifficulty.bind(this));
		window.onIndexChange = this.onHoverChange.bind(this);
		return window;
	}
	/**
	* Get the currently tracked difficulty list window.
	* @returns {Window_DifficultyList}
	*/
	getDifficultyListWindow() {
		return this._j._difficulty._listWindow;
	}
	/**
	* Set the currently tracked difficulty list window to the given window.
	* @param {Window_DifficultyList} difficultyListWindow The difficulty list window to track.
	*/
	setDifficultyListWindow(difficultyListWindow) {
		this._j._difficulty._listWindow = difficultyListWindow;
	}
	/**
	* Creates the list of what the highlighted layer does to the party.
	*/
	createActorEffectsWindow() {
		const window = this.buildActorEffectsWindow();
		this.setActorEffectsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the party's effects list.
	* @returns {Window_DifficultyEffectList}
	*/
	buildActorEffectsWindow() {
		const rectangle = this.actorEffectsWindowRect();
		return this.buildEffectsWindow(rectangle, DifficultyEffects.Sides.ACTOR);
	}
	/**
	* Creates the list of what the highlighted layer does to the enemies.
	*/
	createEnemyEffectsWindow() {
		const window = this.buildEnemyEffectsWindow();
		this.setEnemyEffectsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the enemies' effects list.
	* @returns {Window_DifficultyEffectList}
	*/
	buildEnemyEffectsWindow() {
		const rectangle = this.enemyEffectsWindowRect();
		return this.buildEffectsWindow(rectangle, DifficultyEffects.Sides.ENEMY);
	}
	/**
	* Builds an effects list for one side of every fight.
	* @param {Rectangle} rectangle The rectangle of the window.
	* @param {string} side One of {@link DifficultyEffects.Sides}.
	* @returns {Window_DifficultyEffectList}
	*/
	buildEffectsWindow(rectangle, side) {
		const window = new Window_DifficultyEffectList(rectangle);
		window.setSide(side);
		return window;
	}
	/**
	* Get the currently tracked list of the party's effects.
	* @returns {Window_DifficultyEffectList}
	*/
	getActorEffectsWindow() {
		return this._j._difficulty._actorEffectsWindow;
	}
	/**
	* Set the currently tracked list of the party's effects.
	* @param {Window_DifficultyEffectList} actorEffectsWindow The list to track.
	*/
	setActorEffectsWindow(actorEffectsWindow) {
		this._j._difficulty._actorEffectsWindow = actorEffectsWindow;
	}
	/**
	* Get the currently tracked list of the enemies' effects.
	* @returns {Window_DifficultyEffectList}
	*/
	getEnemyEffectsWindow() {
		return this._j._difficulty._enemyEffectsWindow;
	}
	/**
	* Set the currently tracked list of the enemies' effects.
	* @param {Window_DifficultyEffectList} enemyEffectsWindow The list to track.
	*/
	setEnemyEffectsWindow(enemyEffectsWindow) {
		this._j._difficulty._enemyEffectsWindow = enemyEffectsWindow;
	}
	/**
	* Gets the difficulty being hovered over in the difficulty list.
	* @returns {DifficultyLayer}
	*/
	hoveredDifficulty() {
		const listWindow = this.getDifficultyListWindow();
		return listWindow.hoveredDifficulty();
	}
	/**
	* Refreshes everything that describes the highlighted layer, whenever the highlight moves.
	*/
	onHoverChange() {
		this.onHoverUpdatePoints();
		this.onHoverUpdateHelp();
		this.onHoverUpdateEffects();
	}
	/**
	* Updates the points window when the hovered difficulty changes.
	*/
	onHoverUpdatePoints() {
		const hoveredDifficulty = this.hoveredDifficulty();
		const pointsWindow = this.getPointsWindow();
		pointsWindow.setHoveredDifficulty(hoveredDifficulty);
		pointsWindow.refresh();
	}
	/**
	* Updates the help window when the hovered difficulty changes.
	*/
	onHoverUpdateHelp() {
		const hoveredDifficulty = this.hoveredDifficulty();
		const helpWindow = this.helpWindow();
		helpWindow.setText(hoveredDifficulty.description);
	}
	/**
	* Updates both effects lists when the hovered difficulty changes.
	*/
	onHoverUpdateEffects() {
		const hoveredDifficulty = this.hoveredDifficulty();
		const actorRows = DifficultyEffects.rowsFor(hoveredDifficulty, DifficultyEffects.Sides.ACTOR);
		const enemyRows = DifficultyEffects.rowsFor(hoveredDifficulty, DifficultyEffects.Sides.ENEMY);
		const actorEffectsWindow = this.getActorEffectsWindow();
		const enemyEffectsWindow = this.getEnemyEffectsWindow();
		actorEffectsWindow.setRows(actorRows);
		enemyEffectsWindow.setRows(enemyRows);
	}
	/**
	* Runs when the user chooses one of the items in the difficulty list.
	*/
	onSelectDifficulty() {
		const hovered = this.hoveredDifficulty();
		if (hovered.isEnabled()) {
			DifficultyManager.disableDifficulty(hovered.key);
			this.onDisableDifficulty(hovered);
		} else {
			DifficultyManager.enableDifficulty(hovered.key);
			this.onEnableDifficulty(hovered);
		}
		this.refreshCoreDifficultyWindows();
		const listWindow = this.getDifficultyListWindow();
		listWindow.activate();
	}
	/**
	* A hook for performing logic when a difficulty layer is disabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being disabled.
	*/
	onDisableDifficulty(difficulty) {
		this.refundDifficultyCost(difficulty);
		SoundManager.playActorDamage();
	}
	/**
	* Refunds a disabled layer's cost back into the player's layer points.
	* @param {DifficultyLayer} difficulty The difficulty layer being disabled.
	*/
	refundDifficultyCost(difficulty) {
		const refund = difficulty.cost * -1;
		$gameSystem.modLayerPoints(refund);
	}
	/**
	* A hook for performing logic when a difficulty layer is enabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being enabled.
	*/
	onEnableDifficulty(difficulty) {
		this.applyDifficultyCost(difficulty);
		SoundManager.playUseSkill();
	}
	/**
	* Spends an enabled layer's cost out of the player's layer points.
	* @param {DifficultyLayer} difficulty The difficulty layer being enabled.
	*/
	applyDifficultyCost(difficulty) {
		$gameSystem.modLayerPoints(difficulty.cost);
	}
	/**
	* Refreshes the list, then everything describing the highlighted layer.
	*/
	refreshCoreDifficultyWindows() {
		const listWindow = this.getDifficultyListWindow();
		listWindow.refresh();
		this.onHoverChange();
	}
};

//#endregion
//#region src/plugins/passive/ext/difficulty/_metadata/pluginCommands.js
/**
* Plugin command for calling the Difficulty scene/menu.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "callDifficultyMenu", () => {
	Scene_Difficulty.callScene();
});
/**
* Plugin command for calling the locking one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "lockDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.lockDifficulty(key);
	});
});
/**
* Plugin command for calling the unlocking one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "unlockDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.unlockDifficulty(key);
	});
});
/**
* Plugin command for hiding one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "hideDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.hideDifficulty(key);
	});
});
/**
* Plugin command for unhiding one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "unhideDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.unhideDifficulty(key);
	});
});
/**
* Plugin command for enabling one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "enableDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.enableDifficulty(key);
	});
});
/**
* Plugin command for disabling one or many difficulties.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "disableDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.disableDifficulty(key);
	});
});
/**
* Plugin command for modifying the max layer points.
*/
PluginManager.registerCommand(J.PASSIVE.EXT.DIFFICULTY.Metadata.name, "modifyLayerMax", (args) => {
	const { amount } = args;
	const parsedAmount = parseInt(amount);
	$gameSystem.modLayerPointMax(parsedAmount);
});

//#endregion
//#region src/plugins/passive/ext/difficulty/registerDifficultySaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-Passive-Difficulty a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_difficulty", "difficulty");
}

//#endregion
//# sourceMappingURL=J-Passive-Difficulty.js.map