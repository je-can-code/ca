//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DIFFICULTY-AFFIX] Lets difficulty layers bias enemy affix rates and unlock reserved affixes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Difficulty
 * @base J-Passive-Affix
 * @orderAfter J-Base
 * @orderAfter J-Difficulty
 * @orderAfter J-Passive-Affix
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Difficulty that reaches into J-Passive-Affix.
 *
 * It gives every difficulty layer an optional say in how enemy affixes roll:
 * how often they appear, how evenly the pool is spread, and whether affixes
 * that are otherwise unreachable become available at all.
 *
 * The point is to give the difficulty system a second axis. Without this, a
 * layer trades harder enemies for better rewards and that is the whole of the
 * bargain. With it, raising a layer also changes what the world spawns.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Nothing here is required. A difficulty layer that says nothing about affixes
 * behaves exactly as it did before this plugin was installed, and a project
 * where no layer says anything is completely unaffected.
 *
 * All configuration lives in the same `data/config.difficulty.json` that
 * J-Difficulty already reads. There is no second file and no plugin parameter.
 *
 * ============================================================================
 * CONFIGURING A LAYER
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
 *   how J-Difficulty already treats its parameter effects.
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
 */
//endregion annotations

//#region src/plugins/diff/ext/affix/__models/AffixEffects.js
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
			throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] has ${fieldName}:${chance}; must not be negative.`);
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
			throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] has flatten:${flatten}; must be between 0 and 100.`);
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
	* are asked later by {@link JDifficultyAffix_PluginMetadata#assertGrantsAreValid}.
	* @param {string} layerKey The layer being validated, for the error message.
	* @param {object[]} grants The authored grants, each an object of `stateId` and `weight`.
	* @returns {Map<number, number>}
	*/
	static #validatedGrants(layerKey, grants) {
		const rawGrants = new Map();
		grants.forEach((grant) => {
			const { stateId, weight } = grant;
			if (weight < 0) {
				throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] grants state [${stateId}] a weight of ` + `[${weight}]; must not be negative.`);
			}
			if (rawGrants.has(stateId)) {
				throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] grants state [${stateId}] more than once.`);
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
//#region src/plugins/diff/ext/affix/__models/DifficultyMetadata.js
/**
* The affix biasing this layer applies while it is enabled, or null when it declares none.
*
* Seeded on the prototype rather than in a constructor because this extension has no constructor to
* seed it in - J-Difficulty builds every layer before this ship's script is ever evaluated. A
* prototype default is what makes an undecorated layer answer with the cold value that every reader
* tests against, instead of `undefined`.
* @type {AffixEffects|null}
*/
DifficultyMetadata.prototype._affixEffects = null;
/**
* The affix biasing this difficulty layer applies while it is enabled.
* Most layers declare none and answer null; only the ones authored with an `affixEffects` block in
* the difficulty configuration carry one.
* @returns {AffixEffects|null}
*/
DifficultyMetadata.prototype.getAffixEffects = function() {
	return this._affixEffects;
};
/**
* Assigns the affix biasing this layer applies.
* Called once per authored layer during this extension's boot, and never again - the configuration
* driving it is static for the life of the session.
* @param {AffixEffects} affixEffects The effects parsed from this layer's configuration.
*/
DifficultyMetadata.prototype.setAffixEffects = function(affixEffects) {
	this._affixEffects = affixEffects;
};

//#endregion
//#region src/plugins/diff/ext/affix/_metadata/_pluginMetadata.js
/**
* The metadata for this extension, and the home of every calculation it performs.
*
* Three things are built here, at three different times, and keeping them apart is what makes the
* whole extension tractable:
*
* 1. The per-layer effects, built once during script evaluation from the configuration J-Difficulty
*    already parsed. Static data being reshaped; never rebuilt, never saved.
* 2. The slot split for granted affixes, done once at `onDatabaseLoaded`, because deciding which
*    pool a granted state belongs to needs its hydrated notetags.
* 3. The folded pools, rebuilt whenever the set of enabled layers changes. This is the only part
*    that is genuinely runtime state, because the player toggles layers.
*/
var JDifficultyAffix_PluginMetadata = class JDifficultyAffix_PluginMetadata extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Also hands every configured layer the affix effects it declared.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
		this.decorateDifficultyMetadatas();
	}
	/**
	* Establishes the cached values this extension folds the enabled layers into.
	*
	* Deliberately assigned here rather than declared as class fields. Field initializers run only
	* after `super()` has returned, and `PluginMetadata`'s constructor drives `postInitialize` before
	* that - so a field would overwrite anything this hook had already computed, silently and after
	* the fact.
	*/
	initializeMetadata() {
		/**
		* The pool this extension hands out for prefix rolls, or null while the cache is cold.
		* @type {{map: Map<number, number>, totalWeight: number}|null}
		*/
		this._effectivePrefixPool = null;
		/**
		* The pool this extension hands out for suffix rolls, or null while the cache is cold.
		* @type {{map: Map<number, number>, totalWeight: number}|null}
		*/
		this._effectiveSuffixPool = null;
		/**
		* The multiplier the enabled layers apply to a spawn's prefix chance, as a factor.
		* Identity until the layers have been folded, which is the honest answer before then.
		* @type {number}
		*/
		this._prefixChanceFactor = 1;
		/**
		* The multiplier the enabled layers apply to a spawn's suffix chance, as a factor.
		* @type {number}
		*/
		this._suffixChanceFactor = 1;
	}
	/**
	* The current difficulty-adjusted prefix pool, or null when it has not been built yet.
	* Null is a real answer rather than a missing one: it is what the aliased seam reads to decide it
	* should hand back the untouched base pool, which is correct before any layer has been evaluated.
	* @returns {{map: Map<number, number>, totalWeight: number}|null}
	*/
	effectivePrefixPool() {
		return this._effectivePrefixPool;
	}
	/**
	* The current difficulty-adjusted suffix pool, or null when it has not been built yet.
	* @returns {{map: Map<number, number>, totalWeight: number}|null}
	*/
	effectiveSuffixPool() {
		return this._effectiveSuffixPool;
	}
	/**
	* Replaces the cached difficulty-adjusted prefix pool.
	* @param {{map: Map<number, number>, totalWeight: number}} pool The newly folded pool.
	*/
	setEffectivePrefixPool(pool) {
		this._effectivePrefixPool = pool;
	}
	/**
	* Replaces the cached difficulty-adjusted suffix pool.
	* @param {{map: Map<number, number>, totalWeight: number}} pool The newly folded pool.
	*/
	setEffectiveSuffixPool(pool) {
		this._effectiveSuffixPool = pool;
	}
	/**
	* The multiplier the enabled layers apply to a spawn's prefix chance.
	* Cached rather than folded per spawn: spawns are frequent, difficulty toggles are not, and the
	* answer cannot change between the two.
	* @returns {number}
	*/
	prefixChanceFactor() {
		return this._prefixChanceFactor;
	}
	/**
	* The multiplier the enabled layers apply to a spawn's suffix chance.
	* @returns {number}
	*/
	suffixChanceFactor() {
		return this._suffixChanceFactor;
	}
	/**
	* Replaces the cached prefix chance multiplier.
	* @param {number} factor The newly folded factor.
	*/
	setPrefixChanceFactor(factor) {
		this._prefixChanceFactor = factor;
	}
	/**
	* Replaces the cached suffix chance multiplier.
	* @param {number} factor The newly folded factor.
	*/
	setSuffixChanceFactor(factor) {
		this._suffixChanceFactor = factor;
	}
	/**
	* Walks every configured difficulty layer and attaches the affix effects it declared.
	*
	* The raw configuration is read from J-Difficulty rather than from disk. That ship parses the file
	* inside its own constructor - during script evaluation, before this ship's script exists - so
	* there is no seam an extension could alias in time to influence the parse. What it can do is read
	* what was parsed, which is why J-Difficulty retains the raw blob alongside the objects it built.
	*/
	decorateDifficultyMetadatas() {
		J.DIFFICULTY.Metadata.allRawConfigs.forEach((rawConfig, layerKey) => {
			const { affixEffects } = rawConfig;
			if (affixEffects === undefined) return;
			const parsedEffects = AffixEffects.fromRaw(layerKey, affixEffects);
			const difficultyMetadata = J.DIFFICULTY.Metadata.allMetadatas.get(layerKey);
			difficultyMetadata.setAffixEffects(parsedEffects);
		});
	}
	/**
	* Validates every configured grant and sorts it into the slot its state belongs to.
	*
	* Every layer is checked, not merely the enabled ones. A grant sitting on a layer the player never
	* turns on is exactly as broken as one on a layer they always use, and the entire value of failing
	* at boot is that it fails for everyone on first launch rather than for one player, hours in, as a
	* silently absent affix that reads like bad luck.
	*/
	assertGrantsAreValid() {
		J.DIFFICULTY.Metadata.allMetadatas.forEach((difficultyMetadata, layerKey) => {
			const affixEffects = difficultyMetadata.getAffixEffects();
			if (affixEffects === null) return;
			affixEffects.rawGrants().forEach((weight, stateId) => this.assertGrantIsValid(layerKey, affixEffects, stateId, weight));
		});
	}
	/**
	* Validates one grant and records which slot (or slots) it applies to.
	* @param {string} layerKey The layer that authored this grant, for the error messages.
	* @param {AffixEffects} affixEffects The effects this grant belongs to.
	* @param {number} stateId The granted state.
	* @param {number} weight The weight this layer hands it.
	*/
	assertGrantIsValid(layerKey, affixEffects, stateId, weight) {
		const state = $dataStates[stateId];
		if (!state) {
			throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] grants state [${stateId}], which does not exist.`);
		}
		const isPrefix = state.isEnemyPrefix;
		const isSuffix = state.isEnemySuffix;
		if (isPrefix === false && isSuffix === false) {
			throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] grants state [${stateId}], which is neither ` + `<enemy-prefix> nor <enemy-suffix>.`);
		}
		if (state.affixWeight !== 0) {
			throw new Error(`[J-Difficulty-Affix] layer [${layerKey}] grants state [${stateId}], which already has ` + `<affix-weight:${state.affixWeight}>; grants are only for states reserved at weight 0.`);
		}
		if (isPrefix) {
			affixEffects.addPrefixGrant(stateId, weight);
		}
		if (isSuffix) {
			affixEffects.addSuffixGrant(stateId, weight);
		}
	}
	/**
	* The affix effects of every currently enabled difficulty layer.
	*
	* When nothing at all is enabled this falls back to the default layer's effects, mirroring
	* {@link Game_Temp#buildAppliedDifficulty}, which applies the default layer's parameter effects in
	* exactly that situation. Diverging would mean the default layer's stat half kept applying while
	* its affix half quietly stopped.
	* @returns {AffixEffects[]}
	*/
	enabledAffixEffects() {
		const enabledKeys = $gameSystem.getAllDifficultyConfigs().filter((config) => config.enabled).map((config) => config.key);
		const keysToRead = enabledKeys.length === 0 ? [J.DIFFICULTY.Metadata.defaultKey] : enabledKeys;
		const effects = [];
		keysToRead.forEach((layerKey) => {
			const difficultyMetadata = J.DIFFICULTY.Metadata.allMetadatas.get(layerKey);
			const affixEffects = difficultyMetadata.getAffixEffects();
			if (affixEffects === null) return;
			effects.push(affixEffects);
		});
		return effects;
	}
	/**
	* The combined multiplier applied to a spawn's prefix chance, as a factor rather than a percent.
	* Layers compose multiplicatively, matching how every other difficulty effect combines.
	* @param {AffixEffects[]} allEffects The effects of the currently enabled layers.
	* @returns {number}
	*/
	combinedPrefixChanceFactor(allEffects) {
		return allEffects.reduce((runningFactor, effects) => runningFactor * (effects.prefixChance / 100), 1);
	}
	/**
	* The combined multiplier applied to a spawn's suffix chance, as a factor rather than a percent.
	* @param {AffixEffects[]} allEffects The effects of the currently enabled layers.
	* @returns {number}
	*/
	combinedSuffixChanceFactor(allEffects) {
		return allEffects.reduce((runningFactor, effects) => runningFactor * (effects.suffixChance / 100), 1);
	}
	/**
	* The combined flatten of the enabled layers, as a factor between 0 and 1.
	*
	* Flattening rewrites a weight as `mean - (mean - weight) * (1 - f)`, so what each application
	* really does is scale that weight's distance from the mean by `(1 - f)`. Two applications scale it
	* by the product of their complements, which is why layers combine as `1 - product(1 - f)` and not
	* as a sum. Two layers at 40 give 64, not 80.
	*
	* That form is also order-independent, which matters because the enabled layers arrive in map
	* order and nothing about that order is meaningful. It holds because flattening preserves the
	* pool's total, so the mean every layer interpolates toward is the same one.
	* @param {AffixEffects[]} allEffects The effects of the currently enabled layers.
	* @returns {number}
	*/
	combinedFlatten(allEffects) {
		const remainingDistance = allEffects.reduce((runningDistance, effects) => runningDistance * (1 - effects.flatten / 100), 1);
		return 1 - remainingDistance;
	}
	/**
	* The union of every enabled layer's prefix grants, keyed by state id.
	*
	* Two layers granting the same affix resolve to the larger weight rather than to their sum. A
	* grant is a statement about how rare something ought to be at that difficulty, and two layers
	* each saying "50" both mean 50 - reading them as an accumulating resource would make an affix
	* progressively common purely as a side effect of enabling unrelated layers.
	* @param {AffixEffects[]} allEffects The effects of the currently enabled layers.
	* @returns {Map<number, number>}
	*/
	combinedPrefixGrants(allEffects) {
		return JDifficultyAffix_PluginMetadata.mergeGrantsByMax(allEffects.map((effects) => effects.prefixGrants()));
	}
	/**
	* The union of every enabled layer's suffix grants, keyed by state id.
	* @param {AffixEffects[]} allEffects The effects of the currently enabled layers.
	* @returns {Map<number, number>}
	*/
	combinedSuffixGrants(allEffects) {
		return JDifficultyAffix_PluginMetadata.mergeGrantsByMax(allEffects.map((effects) => effects.suffixGrants()));
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
	* Rebuilds both difficulty-adjusted pools from the currently enabled layers.
	* Called whenever the enabled set changes, which is rare - spawns are frequent and difficulty
	* toggles are not, so the folded result is cached rather than recomputed per enemy.
	*/
	buildEffectivePools() {
		const allEffects = this.enabledAffixEffects();
		const flatten = this.combinedFlatten(allEffects);
		const { prefixMap, suffixMap } = J.PASSIVE.EXT.AFFIX.Metadata;
		const prefixGrants = this.combinedPrefixGrants(allEffects);
		const suffixGrants = this.combinedSuffixGrants(allEffects);
		this.setEffectivePrefixPool(JDifficultyAffix_PluginMetadata.buildPool(prefixMap, flatten, prefixGrants));
		this.setEffectiveSuffixPool(JDifficultyAffix_PluginMetadata.buildPool(suffixMap, flatten, suffixGrants));
		this.setPrefixChanceFactor(this.combinedPrefixChanceFactor(allEffects));
		this.setSuffixChanceFactor(this.combinedSuffixChanceFactor(allEffects));
	}
	/**
	* Builds one difficulty-adjusted pool from a base pool, a flatten, and a set of grants.
	*
	* The base pool is copied rather than edited. It belongs to J-Passive-Affix and is that ship's only
	* record of how the affixes were authored, so flattening it in place would not merely leak - it
	* would compound, flattening an already-flattened pool every time the player touched a layer.
	* @param {Map<number, number>} basePool The authored pool for this slot.
	* @param {number} flatten How far to pull each weight toward the mean, between 0 and 1.
	* @param {Map<number, number>} grants The weights to hand to reserved states, keyed by state id.
	* @returns {{map: Map<number, number>, totalWeight: number}}
	*/
	static buildPool(basePool, flatten, grants) {
		const pool = new Map(basePool);
		JDifficultyAffix_PluginMetadata.flattenPool(pool, flatten);
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
	* affixes sitting at zero are not part of the distribution being levelled - they are not in the
	* pool in any meaningful sense until something grants them a weight.
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
//#region src/plugins/diff/ext/affix/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The umbrella for extensions of J-Difficulty. This is the first of them, so the shell does not
* exist yet and has to be declared here rather than assumed.
*/
J.DIFFICULTY.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.DIFFICULTY.EXT.AFFIX = {};
/**
* The metadata associated with this plugin.
*/
J.DIFFICULTY.EXT.AFFIX.Metadata = new JDifficultyAffix_PluginMetadata("J-Difficulty-Affix", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.DIFFICULTY.EXT.AFFIX.Aliased = {};
J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Event = new Map();
J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Temp = new Map();
J.DIFFICULTY.EXT.AFFIX.Aliased.JPassiveAffix_PluginMetadata = new Map();
J.DIFFICULTY.EXT.AFFIX.Aliased.Scene_Boot = new Map();

//#endregion
//#region src/plugins/diff/ext/affix/_metadata/JPassiveAffix_PluginMetadata.js
/**
* Extends {@link #effectivePrefixPool}.<br/>
* Also substitutes the difficulty-adjusted pool once one has been built.
*
* Aliasing a prototype method works here even though the metadata instance was constructed long
* before this file ran: methods live on the prototype, dispatch resolves at call time, and the
* instance carries no own property shadowing them - so the existing instance sees the replacement.
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.JPassiveAffix_PluginMetadata.set("effectivePrefixPool", JPassiveAffix_PluginMetadata.prototype.effectivePrefixPool);
JPassiveAffix_PluginMetadata.prototype.effectivePrefixPool = function() {
	const original = J.DIFFICULTY.EXT.AFFIX.Aliased.JPassiveAffix_PluginMetadata.get("effectivePrefixPool").call(this);
	const adjusted = J.DIFFICULTY.EXT.AFFIX.Metadata.effectivePrefixPool();
	if (adjusted === null) return original;
	return adjusted;
};
/**
* Extends {@link #effectiveSuffixPool}.<br/>
* Also substitutes the difficulty-adjusted pool once one has been built.
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.JPassiveAffix_PluginMetadata.set("effectiveSuffixPool", JPassiveAffix_PluginMetadata.prototype.effectiveSuffixPool);
JPassiveAffix_PluginMetadata.prototype.effectiveSuffixPool = function() {
	const original = J.DIFFICULTY.EXT.AFFIX.Aliased.JPassiveAffix_PluginMetadata.get("effectiveSuffixPool").call(this);
	const adjusted = J.DIFFICULTY.EXT.AFFIX.Metadata.effectiveSuffixPool();
	if (adjusted === null) return original;
	return adjusted;
};

//#endregion
//#region src/plugins/diff/ext/affix/objects/Game_Event.js
/**
* Extends {@link #getResolvedPassiveAffixPrefixChance}.<br/>
* Also scales the resolved chance by whatever the currently enabled difficulty layers ask for.
*
* Scaling the resolved value rather than the plugin default is deliberate: it composes with the
* existing precedence chain instead of competing with it, so an event comment or enemy note still
* decides the baseline and the difficulty only says how much more or less of it applies. A spawn
* pinned to zero stays at zero, because no multiplier moves zero.
* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
* @returns {number}
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Event.set("getResolvedPassiveAffixPrefixChance", Game_Event.prototype.getResolvedPassiveAffixPrefixChance);
Game_Event.prototype.getResolvedPassiveAffixPrefixChance = function(enemyData) {
	const original = J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Event.get("getResolvedPassiveAffixPrefixChance").call(this, enemyData);
	const factor = J.DIFFICULTY.EXT.AFFIX.Metadata.prefixChanceFactor();
	return (original * factor).clamp(0, 100);
};
/**
* Extends {@link #getResolvedPassiveAffixSuffixChance}.<br/>
* Also scales the resolved chance by whatever the currently enabled difficulty layers ask for.
* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
* @returns {number}
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Event.set("getResolvedPassiveAffixSuffixChance", Game_Event.prototype.getResolvedPassiveAffixSuffixChance);
Game_Event.prototype.getResolvedPassiveAffixSuffixChance = function(enemyData) {
	const original = J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Event.get("getResolvedPassiveAffixSuffixChance").call(this, enemyData);
	const factor = J.DIFFICULTY.EXT.AFFIX.Metadata.suffixChanceFactor();
	return (original * factor).clamp(0, 100);
};

//#endregion
//#region src/plugins/diff/ext/affix/objects/Game_Temp.js
/**
* Extends {@link #refreshAppliedDifficulty}.<br/>
* Also rebuilds the difficulty-adjusted affix pools.
*
* This is the one seam every path that changes the enabled layers passes through - starting a new
* game, loading a save, and toggling a layer in the difficulty scene all reach it, and nothing that
* writes `enabled` avoids it. Aliasing anything narrower would leave one of the three stale.
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Temp.set("refreshAppliedDifficulty", Game_Temp.prototype.refreshAppliedDifficulty);
Game_Temp.prototype.refreshAppliedDifficulty = function() {
	J.DIFFICULTY.EXT.AFFIX.Aliased.Game_Temp.get("refreshAppliedDifficulty").call(this);
	J.DIFFICULTY.EXT.AFFIX.Metadata.buildEffectivePools();
};

//#endregion
//#region src/plugins/diff/ext/affix/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Also validates every configured affix grant and sorts each into the slot its state belongs to.
*
* This is the earliest moment the work can happen and the latest it should. Deciding a grant's slot
* reads notetags off a hydrated `$dataStates` row, which does not exist while plugin metadata is
* being constructed - and deferring it any later would mean a broken grant on a layer nobody enables
* never gets checked at all.
*/
J.DIFFICULTY.EXT.AFFIX.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.DIFFICULTY.EXT.AFFIX.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	J.DIFFICULTY.EXT.AFFIX.Metadata.assertGrantsAreValid();
};

//#endregion
//# sourceMappingURL=J-Difficulty-Affix.js.map