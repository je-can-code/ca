//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v3.7.1 BASE] The base class for all J plugins.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ============================================================================
 * OVERVIEW
 * This is the base class that is required for basically ALL of J-* plugins.
 * Please be sure this is above all other J-* plugins, and keep it up to date!
 * ----------------------------------------------------------------------------
 * ============================================================================
 * MAX ITEM QUANTITY:
 * Have you ever wanted to define a max quantity for items/weapons/armors in
 * the database? Like, not just 99? Well now you can! By applying the correct
 * tags to the relevant entries in the database, you too can have various fixed
 * and maximum item quantities.
 *
 * NOTE ABOUT FUNCTIONALITY PERMANENCE:
 * This max quantity stuff will likely get shifted to its own plugin eventually.
 *
 * TAG USAGE:
 * - Items
 * - Weapons
 * - Armors
 *
 * TAG FORMAT:
 *  <max:VALUE>
 *    Where VALUE represents the maximum quantity allowed for this item.
 *
 * TAG EXAMPLES:
 *  <max:15>
 * The maximum amount of the database entry decorated with this is 15.
 * ============================================================================
 * CUSTOM MAX TP:
 * Have you ever wanted to define a max value for TP instead of the default of
 * 100 across the board for all battlers?  Well now you can! By applying the
 * correct tags to the relevant entries in the database, you too can have
 * varying amounts of max tp for actors and enemies alike!.
 *
 * NOTE ABOUT COMBINING TAGS:
 * This is additive across the board, so if a single actor has multiple tags
 * from various equipment and/or states, all amounts of max tP will be summed
 * together.
 *
 * NOTE ABOUT NEGATIVES:
 * The tag value can be negative, so you can make "cursed" equipment or states
 * that reduce TP capabilities.
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
 *  <maxTp:VALUE>
 *    Where VALUE represents the amount of max TP provided by the entry.
 *
 * TAG EXAMPLES:
 *  <maxTp:15>    (on actor)
 * The max TP for this battler would be 15.
 *
 *  <maxTp:25>    (on state)
 *  <maxTp:100>   (on weapon)
 *  <maxTp:50000> (on armor)
 * The max TP for this battler would be 50125 until the state wears off, then
 * it would reduce to 50100.
 *
 * ============================================================================
 * STATE TYPE CLASSIFIER:
 * Have you ever wanted to group states into named categories, like "poison" or
 * "bleed", so other plugins/tags can react to "any state of this category" instead
 * of a single hardcoded state id? Well now you can! By applying this tag to a
 * state's notebox, that state is classified under one or more named types.
 *
 * NOTE ABOUT MULTIPLE TAGS:
 * A single state may carry more than one <type:CLASSIFIER> tag, and will
 * belong to every classifier listed across all of its tags.
 *
 * NOTE ABOUT CASING:
 * Classifier strings are intended to be compared case-insensitively by
 * consumers of this tag (such as J-ABS's type-based damage bonus tags).
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <type:CLASSIFIER>
 *    Where CLASSIFIER is the name of the category this state belongs to.
 *
 * TAG EXAMPLES:
 *  <type:poison>
 *  <type:bleed>
 * This state is classified as both "poison" and "bleed".
 *
 * ============================================================================
 * HAR (HEALING RATE):
 * Have you ever wanted a battler to be better (or worse) at healing others,
 * separately from how well a battler receives healing (REC)? Well now you
 * can! HAR is the sender-side counterpart to REC — it multiplies the potency
 * of healing this battler deals out, rather than healing this battler
 * receives.
 *
 * NOTE ABOUT COMBINING TAGS:
 * This is additive across the board, so if a single battler has multiple
 * tags from various equipment and/or states, all amounts of HAR will be
 * summed together before being applied as a single percent multiplier.
 *
 * NOTE ABOUT WHERE THIS APPLIES:
 * HAR is applied everywhere REC already is on the giving side: Damage-tab
 * "HP/MP Recover" skills, Effects-tab "Recover HP/MP" entries, and J-ABS-
 * Formula's custom heal pipeline (if that plugin is installed).
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
 *  <har:VALUE>
 *    Where VALUE represents the percent bonus/penalty to outgoing healing.
 *
 * TAG EXAMPLES:
 *  <har:25>    (on actor)
 * This battler's outgoing healing is now 125% effective.
 *
 *  <har:-50>   (on state)
 * While afflicted, this battler's outgoing healing is only 50% effective.
 *
 * ============================================================================
 *
 * DEV DETAILS:
 * I would encourage you peruse the added functions to the various classes.
 * Many helper functions that probably should've existed were added, and coding
 * patterns that were used erratically are... less erratic now.
 * ----------------------------------------------------------------------------
 * DEV THINGS ADDED:
 * - many *-Manager type classes were added, and existing ones were extended.
 * - the concept of "long param" was utilized for iterating over parameters.
 * - "implemented" a class layer for many database objects.
 * - added various lifecycle hooks to battlers and states.
 * - rewrites the way items are managed and processed.
 * - adds a number of functions to retrieve data that was otherwise "private".
 * - adds an API for retrieving specific regex-based comments from an event.
 * - adds an API for getting all notes associated with given battlers.
 * - adds a few reusable sprites for convenience, like faces, icons, and text.
 * - adds a parent class for subclassing to strongly type plugin metadata.
 *
 * ============================================================================
 * CHANGELOG:
 * - 3.7.1
 *    ParsableComment now admits the '#' character, so an event comment may carry
 *    a hex colour as a tag value. Previously such a comment failed the shape test
 *    and was discarded before parsing, which read downstream as the tag simply
 *    not being there.
 * - 3.7.0
 *    Added Diagnostics, the channel every plugin now reports developer-facing
 *    anomalies through. Diagnostics.warn/error/trace/info each take the emitting
 *    plugin's name and stamp it on the message, so a console line says which of
 *    eighty-odd plugins wrote it. Callers pass __PLUGIN_NAME__, so the name comes
 *    from that ship's own meta.js and no file repeats it. They are thin
 *    pass-throughs to the real console methods, so devtools keeps its own
 *    grouping and object inspection.
 * - 3.6.0
 *    RPGManager array reads no longer take a tryParse argument. Every caller
 *    passed true, the false path was dead, and the singular form parsed twice -
 *    the second pass being what crashed on a tag written without parameters.
 *    Fixed a formula evaluating to zero reading back as no tag at all, which
 *    callers then coalesced into their plugin default.
 *    Scenes no longer create touch ui buttons or reserve the strip for them.
 * - 3.5.0
 *    Added Window_FilterableList and Window_FilterStrip, backed by the new
 *    FilterCycle model, so any ship needing a filtered list with a cycling
 *    category strip can inherit one instead of rebuilding it.
 * - 3.4.0
 *    Parameter percentages carried by equipment now scale that equipment's own
 *    contribution rather than the wearer's total. A weapon granting +25% attack
 *    lifts what the weapon is worth, not the class curve and every other worn
 *    item along with it, which is what makes such a bonus bounded by the thing
 *    carrying it.
 *    Added RPG_EquipItem.ownRate, answering what an equip amplifies its own base
 *    by for one parameter. Codes 21 and 23 store deltas from 1.0 while code 22
 *    stores them from 0; this normalises all three onto one multiplier so a
 *    single subtraction can remove equipment's share from any of them.
 *    Added a localisedEquips hook to Game_BattlerBase, answering with nothing at
 *    that level. Enemies carry no equipment, so every formula below is a no-op
 *    for them rather than a special case.
 *    Game_BattlerBase.paramRate, sparam and the newly added xparam override now
 *    subtract equipment's share from the battler-wide aggregate and, for the two
 *    parameter families with no field of their own, re-apply it against each
 *    item's own base.
 *    Game_Actor.paramPlus is overwritten rather than extended, because vanilla
 *    already adds each equip's params entry and thisBParam includes that same
 *    entry - aliasing would have counted it twice.
 *    Equipment contributions are cached per parameter and invalidated by
 *    onBattlerDataChange, matching every other note-derived value on a battler.
 *    The reads behind them scan a note string once per equipped item, and
 *    parameters are asked for during damage resolution and once per row of every
 *    parameter catalog refresh.
 *    NoteResolver gained a summing policy for numeric tags. Stacking those as
 *    repeated lines cannot work - an exact duplicate line is dropped within a
 *    single note, so a value written twice collapses to one and reads as half
 *    what it should forever. Totalling them into one line is the only shape that
 *    survives being merged again.
 *    Added Window_ItemList data and setData accessors, so a list reordering or
 *    filtering its rows has a way in that is not a reach into storage it does
 *    not own.
 * - 3.3.0
 *    The shipped file moved from js/plugins/J-Base.js to
 *    js/plugins/base/J-Base.js, following the base plugin set's split into a
 *    core and its extensions. A plugin list still naming the old path will not
 *    find it.
 *    Added the J.BASE.EXT namespace, so extensions of the base plugin set have
 *    somewhere to live that is not the core itself.
 *    SerializableRegistry now holds serialization DECLARATIONS - what a type
 *    regenerates, what it stores by reference, and what its typed fields are -
 *    rather than only a list of constructors. The code that interprets those
 *    declarations lives in J-Base-Save, so the core carries no save format.
 *    Added register/extend/installDeclarations, plus a revision counter so a
 *    consumer can tell that a registration was replaced rather than added.
 *    Added an initMembers hook to Game_Party, Game_Map, Game_Timer, Game_Item,
 *    and Game_ActionResult. Decoding a saved object never runs its constructor,
 *    so state declared only in initialize could not be re-established; the hook
 *    is the seam that makes those types seedable.
 *    Added Game_Actors accessors - actorIds, actors, data, existingActors -
 *    replacing direct reads of the underlying sparse array.
 *    Added Scene_Title commandWindow accessors, matching the pair Scene_Menu
 *    already carried, so a plugin replacing a title command does not have to
 *    reach past them into the field.
 * - 3.2.0
 *    Added skillIds() to Game_Battler (stub returning empty), Game_Actor (learned skills
 *    plus trait-granted ids, deduplicated), and Game_Enemy (action skill ids plus
 *    trait-granted ids, deduplicated). This gives the skill-extension resolver a raw-id
 *    source that is completely outside the skill()/skills() call path, eliminating the
 *    need for a re-entrancy guard and enabling intentional recursive overlay chains.
 *    Added J.BASE.Resource enum (HP/MP/TP string keys).
 *    Added Game_Battler.prototype.onHeal(resource, amount) stub — a broadcast hook
 *    fired after any positive resource recovery. Extensions alias onHeal instead of
 *    the three gainHp/gainMp/gainTp methods individually.
 *    Aliased gainHp, gainMp, gainTp on Game_Battler to fire onHeal for positive values.
 *    Added Game_Action.formulaContextProviders registry and Game_Action.registerFormulaContext
 *    static method. Any plugin can now inject a named variable into damage formula evaluation
 *    by registering a getter; the variable is available in every formula evaluated by
 *    evalFormulaWithContext without any plugin needing to patch another plugin's code.
 *    Added Game_Action.prototype.evalFormulaWithContext(formula, a, b) — evaluates a formula
 *    string via new Function with the base context (a, b, v) plus all registered providers.
 *    This replaces all eval() usage in damage/formula paths; see each consumer's changelog.
 *    Added HAR (Healing Rate) — the sender-side counterpart to REC. New `har`
 *    getter on Game_Battler/Game_BattlerBase, summed from `<har:VALUE>` tags
 *    plus any SDP panel bonus. Registered in the parameter catalog (VITALITY
 *    group, longParamId 46).
 *    Aliased Game_Action.prototype.makeDamageValue to apply the caster's HAR
 *    to Damage-tab "HP/MP Recover" results, alongside vanilla's own REC
 *    multiplication for the same branch.
 *    Overwrote Game_Action.prototype.itemEffectRecoverHp/itemEffectRecoverMp
 *    to apply the caster's HAR to Effects-tab "Recover HP/MP" results.
 *    Added TraitResolver, a static class centralizing trait-merging logic shared
 *    across the ecosystem: overlayTraits (last-wins per code+dataId, used by
 *    J-Extend's state/skill overlays) and refineTraits (keep-better per
 *    code+dataId, used by JAFTING refinement), both built from shared
 *    sub-operations (opposing-pair cancellation, no-duplicate filtering,
 *    additive parameter-trait combining). Replaces ~550 lines of duplicated,
 *    near-identical combine-by-trait-code logic that used to live inside
 *    JaftingManager alone.
 *    Extended JsonEx._encode/_decode to support native Map/Set instances in save data.
 *    Fixed _encode mutating the live object graph in place while stringifying — the original
 *    algorithm wrote its "@" constructor tag back onto the same object being saved, which was
 *    invisible for plain objects/arrays but silently corrupted any live Map/Set the moment
 *    something (e.g. autosave) called JsonEx.stringify() on the live game state.
 * - 3.1.1
 *    RPG database wrappers expose createEmpty() on item, weapon, armor, skill,
 *    and state classes.
 *    Used when JAFTING reclaims dynamic refinement slots and in unit tests.
 * - 3.1.0
 *    Added TraitManager static class for centralized display of slip effects (name and icon
 *    based on value sign: damage vs regen).
 *    Extended TextManager with resource() for HP/MP/TP resource display names.
 *    Added traitsDeltaSum() helper on Game_BattlerBase.
 *    Overrode sparam, elementRate, paramRate, and stateRate to use additive delta stacking
 *    instead of multiplicative (traitsPi), with a floor of 0; xparam and attackStatesRate
 *    were already additive and are unchanged.
 *    Fixed RPG_Trait.textValue() for trait code 35: attack-skill now resolves via dataId
 *    instead of value.
 *    Fixed RPG_Trait.textValue() for xparam 0 (Accuracy) and sparam 1 (Parry) to display
 *    as flat integers rather than percentages, matching JABS usage.
 * - 3.0.1
 *    Fixed issue with RPGManager parsing arrays of notes.
 *    Added some arbitrary defaults for icon indices of types.
 * - 3.0.0
 *    Removed all legacy note-parsing logic from RPG_Base.
 *    Updated RPGManager to leverage WeakMap caching for parsed notes.
 * - 2.3.3
 *    Extended database object type-checking.
 *    Provided way for any database object to provide a unique identifier.
 *    Added gauge-drawing into the Window_Base class.
 *    Added API on Game_Actor and Game_Party for directly setting levels.
 *    Added Window_ActorRibbon for re-use.
 * - 2.3.2
 *    Added helper function to determine array intersections.
 *    Added prototype helper class for common prototype operations (unused).
 *    Added new RPGManager.getStringsFromNoteByRegex(...) helper function.
 *    Updated multiple ephemereal classes to be modern class syntax.
 * - 2.3.1
 *    Added flag for showing external file load info across plugins.
 *    Removed extraneous note tag enum-like object.
 *    Updated various custom sprites with additional helpful methods.
 * - 2.3.0
 *    Added base Max TP management with tags for battlers.
 *    Added helper functions for detecting plugin commands inside of events.
 *    Added helper function for converting horz/vert directions to a direction.
 *    Added helper functions for direction validation.
 * - 2.2.1
 *    Added dev filter function for action to skill mapping for enemies.
 * - 2.2.0
 *    Added parent class for subclassing to strongly type plugin metadata.
 *    Added Game_Character#isVehicle function.
 *    Added max item quantity functionality with tag.
 *    Added note grouping methods specific to actors/enemies.
 *    Added Window_Command updates to enable drawing faces as well.
 *    Updated Game_Timer to track elapsed time.
 * - 2.1.3
 *    Added help text functionality for window commands.
 *    Added description text for all parameters.
 * - 2.1.2
 *    Added polyfill implementation for Array.prototype.at().
 *    Updated Window_EquipItem code to enable extension.
 * - 2.1.1
 *    Lifted and shifted multiple functions out of my plugins into here.
 *    Added RPGManager class for helpful note parsing.
 *    Added numerous lifecycle hooks for battler data updating.
 * - 2.1.0
 *    Added wrapper objects for many database objects to ease plugin dev coding.
 *    Added "More data" window base class.
 *    Reverted the break-apart because that caused grief.
 *    Shuffled ownership of various functions.
 * - 2.0.0 (breaking change!)
 *    Broke apart the entire plugin into a collection of pieces, to leverage
 *    the new "plugin in a nested folder" functionality of RMMZ.
 * - 1.0.3
 *    Added "on-own-death" and "on-target-death" tag for battlers.
 *    Changed "retaliate" tag structure to allow a chance for triggering.
 * - 1.0.2
 *    Added an "IconManager" for consistent icon indexing between all my plugins.
 * - 1.0.1
 *    Updates for new models leveraged by the JAFTING system (refinement).
 *    All equipment now have a ._jafting property available on them.
 * - 1.0.0
 *    First proper actual release where I'm leveraging and enforcing versioning.
 * ============================================================================
 * @param actorBaseTp
 * @type number
 * @min 0
 * @text Actor Base TP Max
 * @desc The base TP for actors is this amount. Any formulai add onto this.
 * @default 0
 *
 * @param enemyBaseTp
 * @type number
 * @min 0
 * @text Enemy Base TP Max
 * @desc The base TP for enemies is this amount. Any formulai add onto this.
 * @default 100
 *
 */

//#region src/plugins/_base/core/core/JCache.js
/**
* A unified typed-cache primitive. A cache declares an ordered list of "weak dimensions" at
* construction (e.g. `['battler']`, `['object']`, `['battler', 'object']`), and `get()` requires
* one weak key per declared dimension before the stable string key. This makes cache *scope* a
* visible, reviewable choice at construction time instead of an implicit default buried in a
* generic memoize helper - the exact class of bug this primitive was built to prevent (a
* battler-context eval result silently cached on an object-scoped structure).
*/
var JCache = class JCache {
	/**
	* Gets the battler caches.
	* @returns {Set<JCache>} The battlerCaches.
	*/
	static battlerCaches() {
		return this._battlerCaches;
	}
	/**
	* Gets the root.
	* @returns {WeakMap} The root.
	*/
	root() {
		return this._root;
	}
	/**
	* Sets the root.
	* @param {WeakMap} newRoot The new root.
	*/
	setRoot(newRoot) {
		this._root = newRoot;
	}
	/**
	* Every JCache instance that declared a `'battler'` dimension, so a single bus call
	* ({@link JCache.invalidateAllForBattler}) can clear every battler-scoped cache in the game
	* without each caller needing to know the full list of caches that exist.
	* @type {Set<JCache>}
	*/
	static _battlerCaches = new Set();
	/**
	* Drops every battler-scoped cache entry for the given battler, across every registered
	* {@link JCache} instance that declared a `'battler'` dimension. Intended to be called once,
	* from {@link Game_Battler#onBattlerDataChange}, so individual managers never need their own
	* bespoke invalidation wiring into that method.
	* @param {Game_Battler} battler The battler whose cached entries should be dropped.
	*/
	static invalidateAllForBattler(battler) {
		for (const cache of this.battlerCaches()) {
			cache.invalidate([battler]);
		}
	}
	/**
	* Builds an object-scoped cache: one weak dimension, keyed by the database object being parsed.
	* Use for results that depend only on immutable note text (no runtime battler context).
	* @param {{ name: string, resolveOriginal?: boolean }} o Construction options (see {@link constructor}).
	* @returns {JCache}
	*/
	static objectScoped(o) {
		return new JCache({
			...o,
			dims: ["object"]
		});
	}
	/**
	* Builds a battler-scoped cache: one weak dimension, keyed by the battler. Use for results that
	* depend only on the battler's own live state (no distinct database object per entry).
	* @param {{ name: string, resolveOriginal?: boolean }} o Construction options (see {@link constructor}).
	* @returns {JCache}
	*/
	static battlerScoped(o) {
		return new JCache({
			...o,
			dims: ["battler"]
		});
	}
	/**
	* Builds a battler-then-object-scoped cache: two weak dimensions, battler outermost then the
	* database object. Use for eval results that read both a battler's live state ("a" in a
	* formula) and a specific database object's note text.
	* @param {{ name: string, resolveOriginal?: boolean }} o Construction options (see {@link constructor}).
	* @returns {JCache}
	*/
	static battlerThenObject(o) {
		return new JCache({
			...o,
			dims: ["battler", "object"]
		});
	}
	/**
	* @param {object} options Construction options.
	* @param {string} options.name A human-readable identifier for this cache, used for metrics/debugging.
	* @param {string[]} options.dims The ordered weak dimensions, e.g. `['battler', 'object']`.
	* @param {boolean} [options.resolveOriginal] When true, an `'object'` dimension key that is an
	* {@link RPG_Base} clone resolves to its {@link RPG_Base#_original} so clones share a bucket
	* with their source object.
	*/
	constructor({ name, dims, resolveOriginal = false }) {
		this.name = name;
		this.dims = dims;
		this.resolveOriginal = resolveOriginal;
		this._root = new WeakMap();
		this._metrics = {
			hits: 0,
			misses: 0
		};
		if (dims.includes("battler")) {
			JCache._battlerCaches.add(this);
		}
	}
	/**
	* Resolves a single dimension's key to its actual cache-bucket identity.
	* @param {string} dim The dimension name being resolved ('battler' or 'object').
	* @param {object} key The raw key passed in for this dimension.
	* @returns {object} The key to actually use as the WeakMap/Map key for this dimension.
	*/
	#resolve(dim, key) {
		return dim === "object" && this.resolveOriginal && key instanceof RPG_Base ? key._original() : key;
	}
	/**
	* Reads the cached value for the given dimension keys + string key, computing and storing it on
	* a miss.
	*
	* The weak keys arrive as one array rather than as leading arguments so the call site states how
	* many dimensions it is addressing. Spread across the argument list, `get(a, b, key, fn)` and
	* `get(a, key, fn)` read identically, and telling them apart meant knowing the dimension count
	* this cache was constructed with- which is declared in an entirely different file.
	* @param {object[]} weakKeys The weak dimension keys, outermost first; length must equal `dims`.
	* @param {string} stableKey The stable string key within the innermost bucket.
	* @param {Function} computeFn Produces the value on a miss.
	* @returns {any} The cached or freshly computed value.
	*/
	get(weakKeys, stableKey, computeFn) {
		let node = this.root();
		for (let i = 0; i < this.dims.length; i++) {
			const k = this.#resolve(this.dims[i], weakKeys[i]);
			let next = node.get(k);
			if (!next) {
				next = i === this.dims.length - 1 ? new Map() : new WeakMap();
				node.set(k, next);
			}
			node = next;
		}
		if (node.has(stableKey) === false) {
			this.recordMiss();
			node.set(stableKey, computeFn());
		} else {
			this.recordHit();
		}
		return node.get(stableKey);
	}
	/**
	* Drops the cached subtree at the given dimension-key prefix. `invalidate([battler])` (a
	* one-element prefix) is the common case: it drops every entry nested under that battler,
	* regardless of how many further dimensions this cache declares. An empty prefix clears the
	* entire cache.
	* @param {object[]=} prefix The dimension keys identifying the subtree to drop, outermost first.
	* @returns {boolean} True if something was found and removed at that prefix, false otherwise.
	*/
	invalidate(prefix = []) {
		if (prefix.length === 0) {
			this.clear();
			return true;
		}
		let node = this.root();
		for (let i = 0; i < prefix.length - 1; i++) {
			node = node.get(this.#resolve(this.dims[i], prefix[i]));
			if (!node) return false;
		}
		const last = prefix.length - 1;
		return node.delete(this.#resolve(this.dims[last], prefix[last]));
	}
	/**
	* Drops every entry in this cache by discarding the root weak dimension bucket outright.
	*/
	clear() {
		this.setRoot(new WeakMap());
	}
	/**
	* @returns {{ hits: number, misses: number }} A shallow copy of this cache's hit/miss counters.
	*/
	get metrics() {
		return { ...this._metrics };
	}
	/**
	* Records that a lookup found nothing and had to compute.
	*/
	recordMiss() {
		this._metrics.misses++;
	}
	/**
	* Records that a lookup was served from the cache.
	*/
	recordHit() {
		this._metrics.hits++;
	}
};

//#endregion
//#region src/plugins/_base/core/core/Diagnostics.js
/**
* The single channel every plugin in this ecosystem reports developer-facing anomalies through.
*
* This is not {@link MapLogManager} and has nothing to do with the J-Log ship. J-Log writes to
* windows the *player* reads during play. This writes to the devtools console that only the
* developer ever opens, and it exists because a console full of bare `console.warn` lines cannot
* be triaged: nothing in the message says which of eighty-odd plugins emitted it, so the first
* step in chasing any warning was grepping the whole tree for its wording.
*
* Every method takes the emitting plugin's name as its first argument and stamps it on the front
* of the message. Callers pass `__PLUGIN_NAME__` - the build-time identifier Vite substitutes from
* that ship's own `_metadata/meta.js`, the same one `initialization.js` builds its metadata from.
* So the name has exactly one source of truth per ship, renaming a ship updates every diagnostic it
* writes, and no file repeats a name that could drift out of step with the one it ships under.
*
* Deliberately the build-time identifier rather than `J.SOMETHING.Metadata.name`: substitution
* bakes a literal into the bundle, so the message still identifies its ship in exactly the
* situation where the runtime namespace is what broke.
*
* These are deliberately thin wrappers over the real `console` methods rather than a buffer or a
* reformatter. Devtools' own grouping, filtering and object inspection are the reason anyone opens
* the console at all, and anything that captures output first takes those away.
*
* Supporting values arrive as one optional `details` argument rather than a variadic tail, because
* a rest parameter states no contract - and a caller with several values to show is better served
* passing `{ target, attacker, error }` than three bare positional blobs, since devtools prints the
* keys alongside the values.
*
* This is for anomalies only - a state that should not have been reachable, an input that failed
* to parse, a contract a caller broke. Narrating normal operation is what this codebase means when
* it says never ship logging.
*/
var Diagnostics = class Diagnostics {
	/**
	* Reports something wrong that the game can carry on through, usually by falling back to a
	* sentinel or skipping the work. The caller keeps running after this returns.
	* @param {string} pluginName The emitting plugin's name; callers pass `__PLUGIN_NAME__`.
	* @param {string} message What is wrong, stated so a reader who has never seen this code knows.
	* @param {*} [details] One value worth inspecting, or an object naming several.
	*/
	static warn(pluginName, message, details = null) {
		const stamped = Diagnostics.format(pluginName, message);
		if (details === null) {
			console.warn(stamped);
			return;
		}
		console.warn(stamped, details);
	}
	/**
	* Reports something that went *right* and is worth confirming - a config file that loaded, a
	* save section that migrated. This is the one method here that is not about an anomaly, and it
	* exists for the small number of places where a developer deliberately asked to be told.
	*
	* It is not a licence to narrate normal operation. The bar is that somebody opted in: a plugin
	* passing a `logSummary` builder wants the confirmation, and a scene rendering a menu does not.
	* @param {string} pluginName The emitting plugin's name; callers pass `__PLUGIN_NAME__`.
	* @param {string} message What happened, stated so it is useful without the surrounding code.
	* @param {*} [details] One value worth inspecting, or an object naming several.
	*/
	static info(pluginName, message, details = null) {
		const stamped = Diagnostics.format(pluginName, message);
		if (details === null) {
			console.info(stamped);
			return;
		}
		console.info(stamped, details);
	}
	/**
	* Reports something wrong that the game cannot carry on through correctly, whether or not it is
	* about to throw. Use this when the result is going to be incorrect rather than merely absent.
	* @param {string} pluginName The emitting plugin's name; callers pass `__PLUGIN_NAME__`.
	* @param {string} message What is wrong, stated so a reader who has never seen this code knows.
	* @param {*} [details] One value worth inspecting, or an object naming several.
	*/
	static error(pluginName, message, details = null) {
		const stamped = Diagnostics.format(pluginName, message);
		if (details === null) {
			console.error(stamped);
			return;
		}
		console.error(stamped, details);
	}
	/**
	* Reports an anomaly whose *call path* is the diagnostic rather than its values - a method
	* reached from somewhere it should never have been reached from, a static class someone tried
	* to instantiate. The message alone cannot answer "who did this", so the stack comes with it.
	* @param {string} pluginName The emitting plugin's name; callers pass `__PLUGIN_NAME__`.
	* @param {string} message What is wrong, stated so a reader who has never seen this code knows.
	* @param {*} [details] One value worth inspecting, or an object naming several.
	*/
	static trace(pluginName, message, details = null) {
		Diagnostics.warn(pluginName, message, details);
		console.trace();
	}
	/**
	* Stamps the emitting plugin's name onto a message.
	*
	* Bracketed rather than colon-suffixed so the prefix survives being read next to a message that
	* contains its own colons, which most of them do.
	* @param {string} pluginName The emitting plugin's name; callers pass `__PLUGIN_NAME__`.
	* @param {string} message The message to stamp.
	* @returns {string}
	*/
	static format(pluginName, message) {
		return `[${pluginName}] ${message}`;
	}
};

//#endregion
//#region src/plugins/_base/core/_utilities/JsonMapper.js
var JsonMapper = class {
	/**
	* Parses a object into whatever its given data type is.
	* @param {any} obj The unknown object to parse.
	* @returns {any|null}
	*/
	static parseObject(obj) {
		if (obj === null || obj === undefined) return null;
		if (typeof obj === "string") {
			if (obj.startsWith("[") && obj.endsWith("]")) {
				return this.parseArrayFromString(obj);
			}
			return this.parseString(obj);
		}
		if (Array.isArray(obj)) {
			return obj.map(this.parseObject, this);
		}
		return obj;
	}
	/**
	* Parses a presumed array by peeling off the `[` and `]` and parsing the
	* exposed insides.
	*
	* This does not handle multiple nested arrays properly.
	* @param {string} strArr An string presumed to be an array.
	* @returns {any} The parsed exposed insides of the string array.
	*/
	static parseArrayFromString(strArr) {
		const exposedArray = strArr.slice(1, strArr.length - 1).split(/, |,/);
		const innerArrayStartIndex = exposedArray.findIndex((element) => element.startsWith("["));
		if (innerArrayStartIndex > -1) {
			const outerArrayEndIndex = exposedArray.findLastIndex((element) => element.endsWith("]"));
			const slicedArrayString = exposedArray.slice(innerArrayStartIndex, outerArrayEndIndex + 1).toString();
			const innerArray = this.parseArrayFromString(slicedArrayString);
			exposedArray.splice(innerArrayStartIndex, outerArrayEndIndex + 1 - innerArrayStartIndex, innerArray);
		}
		return this.parseObject(exposedArray);
	}
	/**
	* Parses a metadata object from a string into possibly a boolean or number.
	* If the conversion to those fail, then it'll proceed as a string.
	* @param {string} str The string object to parse.
	* @returns {boolean|number|string}
	*/
	static parseString(str) {
		const unquoted = this.unquoteString(str);
		if (unquoted.toLowerCase() === "true") {
			return true;
		} else if (unquoted.toLowerCase() === "false") return false;
		if (!Number.isNaN(parseFloat(unquoted))) return parseFloat(unquoted);
		return unquoted;
	}
	/**
	* Strips a single matching pair of surrounding double quotes from a token.
	*
	* RMMZ serializes list-type plugin parameters as a JSON string, so every entry arrives still
	* wrapped in its own quotes. Left in place they defeat downstream comparisons entirely-
	* `Number('"7"')` is NaN and `'"physical"'` never matches `'physical'`.
	* @param {string} str The token to unwrap.
	* @returns {string} The token without its surrounding quotes.
	*/
	static unquoteString(str) {
		if (str.length < 2) return str;
		if (str.startsWith("\"") && str.endsWith("\"")) return str.slice(1, -1);
		return str;
	}
};

//#endregion
//#region src/plugins/_base/core/_utilities/ArrayHelper.js
var ArrayHelper = class {
	/**
	* A filter function for ignoring null or undefined.
	* @param {any} value The value of the array being filtered.
	* @returns {boolean} False if the value is null or undefined, true otherwise.
	*/
	static NoNulls(value) {
		if (value === undefined || value === null) {
			return false;
		}
		return true;
	}
	/**
	* Determines whether two arrays share at least one common element.
	* Builds a Set from the smaller array for O(n + m) performance and early exit.
	*
	* Notes:
	* - Accepts numbers or strings (ids, keys, etc.).
	* - Returns false if either array is empty.
	*
	* @param {(number|string)[]} left The first collection of values.
	* @param {(number|string)[]} right The second collection of values.
	* @returns {boolean} True if a value is found in both arrays; otherwise false.
	*/
	static hasAnyIntersection(left, right) {
		if (!left || left.length === 0) {
			return false;
		}
		if (!right || right.length === 0) {
			return false;
		}
		let small = left;
		let large = right;
		if (right.length < left.length) {
			small = right;
			large = left;
		}
		const lookup = new Set(small);
		for (let i = 0; i < large.length; i++) {
			const value = large[i];
			if (lookup.has(value)) {
				return true;
			}
		}
		return false;
	}
	/**
	* Creates an array of numbers from a range, inclusive.
	* @param {number} a The starting number of the range.
	* @param {number} b The ending number of the range.
	* @returns {number[]} An array of numbers from a to b, inclusive.
	*/
	static rangeInclusive(a, b) {
		return Array.from({ length: b - a + 1 }, (_, i) => a + i);
	}
};

//#endregion
//#region src/plugins/_base/core/managers/RPGManager.js
/**
* A utility class for handling common database-related translations.
*/
var RPGManager = class RPGManager {
	/**
	* Gets the note cache.
	* @returns {JCache} The noteCache.
	*/
	static noteCache() {
		return this._noteCache;
	}
	/**
	* Gets the eval cache.
	* @returns {JCache} The evalCache.
	*/
	static evalCache() {
		return this._evalCache;
	}
	/**
	* Backing field for {@link _noteCache}, built lazily on first access rather than as an eager
	* static-field initializer. RPG_Base now imports this class (for its {@code types()} method),
	* and JCache imports RPG_Base (for its {@code instanceof} clone-resolution check) — a real
	* three-file import cycle (RPG_Base -> RPGManager -> JCache -> RPG_Base). Eager static fields
	* evaluate at module-load time, so their result depends on which file the cycle happens to be
	* entered from; a lazy getter defers construction until the first real call, by which point the
	* whole module graph has finished loading regardless of entry order.
	* @type {JCache|null}
	*/
	static #noteCache = null;
	/**
	* The cache for storing parsed note-text results (string/number/boolean/array/captures). Keyed
	* by the database object alone- note text is immutable, so no battler dimension is needed.
	* @type {JCache}
	*/
	static get _noteCache() {
		return this.#noteCache ??= JCache.objectScoped({
			name: "rpg:note-text",
			resolveOriginal: true
		});
	}
	/**
	* Backing field for {@link _evalCache}; see {@link #noteCache} for why this is lazy.
	* @type {JCache|null}
	*/
	static #evalCache = null;
	/**
	* The cache for storing eval'd formula results. Keyed by battler (the formula's live "a") then
	* by database object, so two battlers sharing a note object never collide and a battler's
	* entries can be dropped wholesale via the {@link JCache.invalidateAllForBattler} bus.
	* @type {JCache}
	*/
	static get _evalCache() {
		return this.#evalCache ??= JCache.battlerThenObject({
			name: "rpg:eval",
			resolveOriginal: true
		});
	}
	/**
	* Gets the cached data for the given object and tag key.
	* @param {object} object The object to get the cached data for.
	* @param {string} tagKey The tag key to get the cached data for.
	* @param {Function} computeFn The function to compute the data if it doesn't exist.
	* @returns {any} The cached data for the object and tag key.
	*/
	static cached(object, tagKey, computeFn) {
		return this.noteCache().get([object], tagKey, computeFn);
	}
	/**
	* Battler-scoped variant of {@link cached}: results are bucketed by the battler whose live
	* state the formula reads, then by database object, so two battlers never share an entry and a
	* battler's entries can be dropped wholesale on a data change.
	* @param {Game_Battler} battler The formula context (the `a`).
	* @param {object} object The database object being parsed.
	* @param {string} tagKey The stable key for this regex/options set (NO battler, NO level).
	* @param {Function} computeFn Producer run on a miss.
	* @returns {any}
	*/
	static cachedForBattler(battler, object, tagKey, computeFn) {
		return this.evalCache().get([battler, object], tagKey, computeFn);
	}
	/**
	* Invalidates the cache for the given object.
	* @param {object} object The object to invalidate the cache for.
	* @returns {boolean} True if the cache was invalidated, false otherwise.
	*/
	static invalidate(object) {
		return this.noteCache().invalidate([object]);
	}
	/**
	* Drops all cached eval results for one battler. Called from Game_Battler#onBattlerDataChange
	* (via the {@link JCache.invalidateAllForBattler} bus); kept for any direct callers.
	* @param {Game_Battler} battler
	* @returns {boolean}
	*/
	static invalidateBattlerEval(battler) {
		return this.evalCache().invalidate([battler]);
	}
	/**
	* Clears the cache for all objects.
	*/
	static clearCache() {
		this.noteCache().clear();
		this.evalCache().clear();
	}
	/**
	* A quick and re-usable means of rolling for a chance of success.
	* This will roll `rollForPositive` times in an effort to get a successful roll.
	* If success is found and `rollsForNegative` is greater than 0, additional rolls of success will
	* be required or the negative rolls will undo the success.
	* @param {number} percentOfSuccess The percent chance of success.
	* @param {number=} rollForPositive The number of positive rolls to find success; defaults to 1.
	* @param {number=} rollForNegative The number of negative rolls to follow success; defaults to 0.
	* @returns {boolean} True if success, false otherwise.
	*/
	static chanceIn100(percentOfSuccess, rollForPositive = 1, rollForNegative = 0) {
		if (percentOfSuccess <= 0) return false;
		let success = false;
		while (rollForPositive && !success) {
			const chance = Math.randomInt(100) + 1;
			if (chance <= percentOfSuccess) {
				success = true;
			}
			rollForPositive--;
		}
		if (success && rollForNegative) {
			while (rollForNegative && success) {
				const chance = Math.randomInt(100) + 1;
				if (chance <= percentOfSuccess) {
					success = true;
				} else {
					return false;
				}
				rollForNegative--;
			}
		}
		return success;
	}
	/**
	* Same as {@link #chanceIn100}, but first checks the positive-roller's own fate-override
	* flags- `isVeryLucky()` short-circuits straight to guaranteed success, `isVeryCursed()`
	* short-circuits straight to guaranteed failure, both bypassing the roll entirely rather than
	* stacking an absurd reroll count. Only when neither flag is set does an actual roll occur.
	* @param {Game_Battler} positiveRoller The battler whose success this roll is for- the one
	* whose `positiveRolls`/fate-override flags apply.
	* @param {number} percentOfSuccess The percent chance of success.
	* @param {number=} rollForPositive The number of positive rolls to find success; defaults to 1.
	* @param {number=} rollForNegative The number of negative rolls to follow success; defaults to 0.
	* @returns {boolean} True if success, false otherwise.
	*/
	static fateOf100(positiveRoller, percentOfSuccess, rollForPositive = 1, rollForNegative = 0) {
		if (positiveRoller.isVeryLucky()) return true;
		if (positiveRoller.isVeryCursed()) return false;
		return this.chanceIn100(percentOfSuccess, rollForPositive, rollForNegative);
	}
	/**
	* Accumulate Mode's counting roll: instead of stopping at the first successful positive roll,
	* rolls all `rollForPositive` attempts unconditionally and counts how many landed. Negative
	* rerolls have no counting-mode equivalent (Accumulate Mode is scoped to positive rolls only)
	* and are intentionally not accepted here.
	* @param {number} percentOfSuccess The percent chance of success.
	* @param {number=} rollForPositive The number of positive rolls to attempt; defaults to 1.
	* @returns {number} How many of the attempted rolls succeeded.
	*/
	static countSuccessesIn100(percentOfSuccess, rollForPositive = 1) {
		if (percentOfSuccess <= 0) return 0;
		let successCount = 0;
		let attemptsRemaining = rollForPositive;
		while (attemptsRemaining) {
			const chance = Math.randomInt(100) + 1;
			if (chance <= percentOfSuccess) {
				successCount++;
			}
			attemptsRemaining--;
		}
		return successCount;
	}
	/**
	* Same as {@link #countSuccessesIn100}, but first checks the positive-roller's own
	* fate-override flags- `isVeryLucky()` counts every attempt as a success, `isVeryCursed()`
	* counts none, both bypassing the roll entirely.
	* @param {Game_Battler} positiveRoller The battler whose success this roll is for.
	* @param {number} percentOfSuccess The percent chance of success.
	* @param {number=} rollForPositive The number of positive rolls to attempt; defaults to 1.
	* @returns {number} How many of the attempted rolls succeeded.
	*/
	static countSuccessesFateOf100(positiveRoller, percentOfSuccess, rollForPositive = 1) {
		if (positiveRoller.isVeryLucky()) return rollForPositive;
		if (positiveRoller.isVeryCursed()) return 0;
		return this.countSuccessesIn100(percentOfSuccess, rollForPositive);
	}
	/**
	* Resolves how many times a repeatable-action proc's action should actually execute, folding
	* in Accumulate Mode and Encore repeats from the positive-roller's own perspective. This is the
	* one entry point sites with a repeatable action (add a state, force-execute a skill) should
	* use instead of {@link #fateOf100}- sites whose success is consumed as a single boolean
	* outcome (hit/evade, crit, parry) should keep using {@link #fateOf100} directly, since there is
	* no repeatable action there for Accumulate/Encore to multiply.
	* @param {Game_Battler} positiveRoller The battler whose success this roll is for.
	* @param {number} percentOfSuccess The percent chance of success.
	* @param {number=} rollForPositive The number of positive rolls to find success; defaults to 1.
	* @param {number=} rollForNegative The number of negative rolls to follow success; defaults to 0.
	* @returns {number} How many times the proc's action should execute; 0 means it did not proc.
	*/
	static resolveProcCount(positiveRoller, percentOfSuccess, rollForPositive = 1, rollForNegative = 0) {
		let successCount;
		if (positiveRoller.isAccumulating()) {
			successCount = this.countSuccessesFateOf100(positiveRoller, percentOfSuccess, rollForPositive);
		} else {
			const singleSuccess = this.fateOf100(positiveRoller, percentOfSuccess, rollForPositive, rollForNegative);
			successCount = singleSuccess ? 1 : 0;
		}
		const repeatsPerSuccess = 1 + positiveRoller.getEncoreRepeats();
		return successCount * repeatsPerSuccess;
	}
	/**
	* A quick and re-usable means of rolling for chance using a weighted model against a map of (key=id,val=weight).
	* @param {Map<any,number>} map The map of key-value pairs to choose from.
	* @param {number} totalWeight The total weight of all values in the map.
	* @returns {any|null} The chosen key or null if no valid choice is found.
	*/
	static weightedMapChoice(map, totalWeight) {
		if (totalWeight <= 0) return null;
		let r = Math.random() * totalWeight;
		for (const [key, val] of map) {
			if (val <= 0) continue;
			r -= val;
			if (r < 0) return key;
		}
		return null;
	}
	/**
	* Gets the last instance of a string matching the regex from the given database object.
	* @param {RPG_BaseItem} databaseData The database object to inspect.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {string|null} The string matching the structure, {@link String.empty} if not found, or null with the flag.
	*/
	static getStringFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : String.empty;
		}
		const key = `str:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getStringFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gets the last instance of a string matching the regex from the given database object.
	* @param {RPG_BaseItem} databaseData The database object to inspect.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {string|null} The string matching the structure, {@link String.empty} if not found, or null with the flag.
	*/
	static #getStringFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		let val = String.empty;
		const lines = databaseData.note.split(/[\r\n]+/);
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			const [, stringResult] = result;
			val = stringResult;
		});
		if (!val) {
			return nullIfEmpty ? null : String.empty;
		}
		return val;
	}
	/**
	* Gathers all string instances matching the regex from the given database object.
	* @param {RPG_BaseItem} databaseData The database object to inspect.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {string[]|null} The array of strings matching the structure, or an empty array if not found, or null.
	*/
	static getStringsFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : Array.empty;
		}
		const key = `str[]:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getStringsFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gathers all string instances matching the regex from the given database object.
	* @param {RPG_BaseItem} databaseData The database object to inspect.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {string[]|null} The array of strings matching the structure, or an empty array if not found, or null.
	*/
	static #getStringsFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const val = [];
		const lines = databaseData.note.split(/[\r\n]+/);
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			const [, stringResult] = result;
			val.push(stringResult);
		});
		if (val.length === 0) {
			return nullIfEmpty ? null : [];
		}
		return val;
	}
	/**
	* Gathers all string instances matching the regex across every database object provided.
	* @param {RPG_BaseItem[]} databaseDatas The collection of database objects to inspect.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {string[]|null} The array of strings matching the structure across all sources, or empty, or null.
	*/
	static getStringsFromAllNotesByRegex(databaseDatas, structure, nullIfEmpty = false) {
		const strings = [];
		databaseDatas.forEach((databaseData) => {
			const found = this.getStringsFromNoteByRegex(databaseData, structure);
			if (found.length) {
				strings.push(...found);
			}
		}, this);
		if (!strings.length && nullIfEmpty) {
			return null;
		}
		return strings;
	}
	/**
	* Gets the last numeric value based on the provided regex structure.
	*
	* If the optional flag `nullIfEmpty` receives true passed in, then the result of
	* this will be `null` instead of the default 0 as an indicator we didn't find
	* anything from the notes of this skill.
	*
	* This can handle both integers and decimal numbers.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return 0 if not found, or null.
	* @returns {number|null} The last value from the notes of this object, or zero/null.
	*/
	static getNumberFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : 0;
		}
		const key = `num:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getNumberFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gets the last numeric value based on the provided regex structure.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return 0 if not found, or null.
	* @returns {number|null} The last value from the notes of this object, or zero/null.
	*/
	static #getNumberFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const lines = databaseData.note.split(/[\r\n]+/);
		let val = null;
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			const [, numericResult] = result;
			val = parseFloat(numericResult);
		});
		if (val === null) {
			return nullIfEmpty ? null : 0;
		}
		return val;
	}
	/**
	* Gets the sum of every numeric value matching the regex on a single object's note.
	*
	* The counterpart to {@link getNumberFromNoteByRegex}, and the distinction is the whole point: that
	* one keeps the *last* match and discards the rest, which is correct for a setting - an id, a cap, a
	* hitbox dimension - where two declarations mean the later one wins. This one is for a *bonus*, where
	* two declarations mean both apply.
	*
	* Reading a bonus with the last-wins variant loses values silently, and it is the shape any merged
	* note produces: two contributions landing on one row rather than on two.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return 0 if nothing matched, or null.
	* @returns {number|null} The sum across every matching line, or zero/null.
	*/
	static getSumFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : 0;
		}
		const key = `numsum:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getSumFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Sums every numeric value matching the regex across one object's note lines.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return 0 if nothing matched, or null.
	* @returns {number|null} The sum across every matching line, or zero/null.
	*/
	static #getSumFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const lines = databaseData.note.split(/[\r\n]+/);
		let found = false;
		let val = 0;
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			const [, numericResult] = result;
			found = true;
			val += parseFloat(numericResult);
		});
		if (found === false) {
			return nullIfEmpty ? null : 0;
		}
		return val;
	}
	/**
	* Gathers all numbers found in arrays on the database object provided.
	*
	* This accepts a regex structure, assuming the capture group is an numeric value,
	* and adds all values together from each line in the notes that match the provided
	* regex structure.
	*
	* If the optional flag `nullIfEmpty` receives true passed in, then the result of
	* this will be `null` instead of the default [] as an indicator we didn't find
	* anything from the notes of this skill.
	*
	* This can handle both integers and decimal numbers.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return [] if not found, or null.
	* @returns {number[]|null}
	*/
	static getNumbersFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : Array.empty;
		}
		const key = `num[]:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getNumbersFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gathers all numbers found in arrays on the database object provided.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty Whether or not to return [] if not found, or null.
	* @returns {number[]|null}
	*/
	static #getNumbersFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		let vals = [];
		const found = this.getArrayFromNotesByRegex(databaseData, structure, true);
		if (found !== null) {
			vals = found;
		}
		if (!vals.length) {
			return nullIfEmpty ? null : vals;
		}
		const noNullVals = vals.filter(ArrayHelper.NoNulls, this);
		return noNullVals;
	}
	/**
	* Gets the sum of all values from the notes of a collection of database objects.
	* @param {RPG_BaseItem[]} databaseDatas The collection of database objects.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {number|null} A number if "nullIfEmpty=false", null otherwise.
	*/
	static getSumFromAllNotesByRegex(databaseDatas, structure, nullIfEmpty = false) {
		if (!databaseDatas.length) {
			return nullIfEmpty ? null : 0;
		}
		let val = 0;
		databaseDatas.forEach((databaseData) => {
			val += this.getSumFromNoteByRegex(databaseData, structure);
		});
		if (!val && nullIfEmpty) {
			return null;
		}
		return val;
	}
	/**
	* Get the eval'd formula of all matching values from the notes of a single database object.
	* @param {RPG_Base} databaseData The database object to parse the notes of.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {number} baseParam The base parameter value for use within the formula(s) as the "b"; defaults to 0.
	* @param {RPG_BaseBattler=} context The context of which the formula(s) are using as the "a"; defaults to null.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {number|null} The calculated result from all formula summed together.
	*/
	static getResultFromNoteByRegex(databaseData, structure, baseParam, context = null, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : 0;
		}
		const key = `eval:${structure.source}::${structure.flags}::${baseParam}::nullIfEmpty=${nullIfEmpty}`;
		const compute = () => this.#getResultFromNoteByRegex(databaseData, structure, baseParam, context, nullIfEmpty);
		if (context) return this.cachedForBattler(context, databaseData, key, compute);
		return this.cached(databaseData, key, compute);
	}
	/**
	* Get the eval'd formula of all matching values from the notes of a single database object.
	* @param {RPG_Base} databaseData The database object to parse the notes of.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {number} baseParam The base parameter value for use within the formula(s) as the "b"; defaults to 0.
	* @param {RPG_BaseBattler=} context The context of which the formula(s) are using as the "a"; defaults to null.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {number|null} The calculated result from all formula summed together.
	*/
	static #getResultFromNoteByRegex(databaseData, structure, baseParam, context = null, nullIfEmpty = false) {
		const lines = databaseData.note.split(/[\r\n]+/);
		let val = 0;
		let hasMatch = false;
		const a = context;
		const b = baseParam;
		const v = $gameVariables._data;
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			hasMatch = true;
			const [, formula] = result;
			try {
				const evalResult = new Function("a", "b", "v", `return (${formula})`)(a, b, v).toFixed(3);
				val += parseFloat(evalResult);
			} catch (error) {
				Diagnostics.error("J-Base", `an error occurred while evaluating the formula: [${formula}].`, error);
			}
		});
		if (hasMatch === false && nullIfEmpty) {
			return null;
		}
		return val;
	}
	/**
	* Gets the eval'd formulai of all values from the notes of a collection of database objects.
	* It is intended that the regex structure provided will be a numeric formula.
	* @param {RPG_BaseItem[]} databaseDatas The collection of database objects.
	* @param {RegExp} structure The RegExp structure to find values for.
	* @param {number} baseParam The base parameter value for use within the formula(s) as the "b"; defaults to 0.
	* @param {RPG_BaseBattler=} context The context of which the formula(s) are using as the "a"; defaults to null.
	* @param {boolean=} nullIfEmpty Whether or not to return null if we found nothing; defaults to false.
	* @returns {number|null} The calculated result from all formula summed together.
	*/
	static getResultsFromAllNotesByRegex(databaseDatas, structure, baseParam = 0, context = null, nullIfEmpty = false) {
		if (!databaseDatas.length) {
			return nullIfEmpty ? null : 0;
		}
		let val = 0;
		let hasMatch = false;
		databaseDatas.forEach((databaseData) => {
			const result = this.getResultFromNoteByRegex(databaseData, structure, baseParam, context, true);
			if (result === null) return;
			hasMatch = true;
			val += result;
		});
		if (hasMatch === false && nullIfEmpty) {
			return null;
		}
		return val;
	}
	/**
	* Gets whether or not there is a matching regex tag on this database entry.
	*
	* Do be aware of the fact that with this type of tag, we are checking only
	* for existence, not the value. As such, it will be `true` if found, and `false` if
	* not, which may not be accurate. Pass `true` to the `nullIfEmpty` to obtain a
	* `null` instead of `false` when missing, or use a string regex pattern and add
	* something like `<someKey:true>` or `<someKey:false>` for greater clarity.
	*
	* This accepts a regex structure, but does not leverage a capture group.
	*
	* If the optional flag `nullIfEmpty` receives true passed in, then the result of
	* this will be `null` instead of the default `false` as an indicator we didn't find
	* anything from the notes of this skill.
	* @param {RPG_Base} databaseData The regular expression to filter notes by.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return `false` if not found, or null.
	* @returns {boolean|null} The found value from the notes of this object, or empty/null.
	*/
	static checkForBooleanFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : false;
		}
		const key = `bool:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#checkForBooleanFromNoteByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gets whether or not there is a matching regex tag on this database entry.
	* @param {RPG_Base} databaseData The regular expression to filter notes by.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return `false` if not found, or null.
	* @returns {boolean|null} The found value from the notes of this object, or empty/null.
	*/
	static #checkForBooleanFromNoteByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const lines = databaseData.note.split(/[\r\n]+/);
		let val = false;
		let hasMatch = false;
		lines.forEach((line) => {
			const hasStructure = scan.test(line);
			if (hasStructure) {
				val = true;
				hasMatch = true;
			}
		});
		if (hasMatch === false && nullIfEmpty) {
			return null;
		} else {
			return val;
		}
	}
	/**
	* Gets whether or not there is a matching regex tag from a collection of database objects.
	*
	* Do be aware of the fact that with this type of tag, we are checking only
	* for existence, not the value. As such, it will be `true` if found, and `false` if
	* not, which may not be accurate. Pass `true` to the `nullIfEmpty` to obtain a
	* `null` instead of `false` when missing, or use a string regex pattern and add
	* something like `<someKey:true>` or `<someKey:false>` for greater clarity.
	*
	* This accepts a regex structure, but does not leverage a capture group.
	*
	* If the optional flag `nullIfEmpty` receives true passed in, then the result of
	* this will be `null` instead of the default `false` as an indicator we didn't find
	* anything from the notes of this skill.
	* @param {RPG_Base[]} databaseDatas The objects to inspect.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return `false` if not found, or null.
	* @returns {boolean|null} The found value from the notes of this object, or empty/null.
	*/
	static checkForBooleanFromAllNotesByRegex(databaseDatas, structure, nullIfEmpty = false) {
		const results = databaseDatas.map((databaseData) => this.checkForBooleanFromNoteByRegex(databaseData, structure, nullIfEmpty));
		const onlyTrueRemains = results.filter((result) => result !== null).filter((result) => result !== false);
		if (onlyTrueRemains.length === 0) {
			if (nullIfEmpty) {
				return null;
			}
			return false;
		}
		return true;
	}
	/**
	* Gets an array of arrays based on the provided regex structure.
	*
	* This accepts a regex structure, assuming the capture group is an array of values
	* all wrapped in hard brackets [].
	*
	* Each captured array is parsed on the way out, translating strings to numbers and booleans and
	* keeping nested array structures intact- there is no raw-capture mode, because no consumer of a
	* notetag has ever wanted the unparsed text.
	* @param {RPG_Base} databaseData The database object to parse notes from.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return null if nothing is found.
	* @returns {any[][]|null} The array of arrays from the notes, or null.
	*/
	static getArraysFromNotesByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : [];
		}
		const key = `any[][]:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getArraysFromNotesByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gets an array of arrays matching the regex across every database object provided.
	* @param {RPG_Base[]} databaseDatas The collection of database objects to parse notes from.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return null if nothing is found.
	* @returns {any[][]|null} The array of arrays from the notes across all sources, or empty, or null.
	*/
	static getArraysFromAllNotesByRegex(databaseDatas, structure, nullIfEmpty = false) {
		const arrays = [];
		databaseDatas.forEach((databaseData) => {
			const found = this.getArraysFromNotesByRegex(databaseData, structure);
			if (found.length) {
				arrays.push(...found);
			}
		}, this);
		if (!arrays.length && nullIfEmpty) {
			return null;
		}
		return arrays;
	}
	/**
	* Gets an array of arrays based on the provided regex structure.
	* @param {RPG_Base} databaseData The database object to parse notes from.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean} nullIfEmpty Whether or not to return null if nothing is found.
	* @returns {any[][]|null} The array of arrays from the notes, or null.
	*/
	static #getArraysFromNotesByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const lines = databaseData.note.split(/[\r\n]+/);
		let val = [];
		let hasMatch = false;
		lines.forEach((line) => {
			const result = scan.exec(line);
			if (result === null) return;
			const [, match] = result;
			val.push(match);
			hasMatch = true;
		});
		if (!hasMatch) {
			return nullIfEmpty ? null : [];
		}
		val = val.map(JsonMapper.parseObject, JsonMapper);
		return val;
	}
	/**
	* Gets a single array based on the provided regex structure.
	*
	* This accepts a regex structure, assuming the capture group is an array of values
	* all wrapped in hard brackets [].
	*
	* The captured group is parsed as it is read, so the values arrive already translated to
	* numbers and booleans with any nested array structure intact. The plural sibling
	* {@link #getArraysFromNotesByRegex} collects raw captures across several lines first and parses
	* them in one pass at the end, but the values a caller receives are equally parsed either way.
	* @param {RPG_Base} databaseData The contents of the note of a given object.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty If this is true and nothing is found, null will be returned instead of empty array.
	* @returns {any[]|null} The array from the notes, or null.
	*/
	static getArrayFromNotesByRegex(databaseData, structure, nullIfEmpty = false) {
		if (this.#canParsedatabaseData(databaseData) === false) {
			return nullIfEmpty ? null : [];
		}
		const key = `any[]:${structure.source}::${structure.flags}::nullIfEmpty=${nullIfEmpty}`;
		return this.cached(databaseData, key, () => this.#getArrayFromNotesByRegex(databaseData, structure, nullIfEmpty));
	}
	/**
	* Gets a single array based on the provided regex structure.
	*
	* This accepts a regex structure, assuming the capture group is an array of values
	* all wrapped in hard brackets [].
	*
	* The capture is parsed where it is read, so the value is already fully translated by the time
	* the loop ends. A tag whose capture group is optional and did not participate parses to null,
	* which is reported as-is rather than treated as a collection.
	* @param {RPG_Base} databaseData The contents of the note of a given object.
	* @param {RegExp} structure The regular expression to filter notes by.
	* @param {boolean=} nullIfEmpty If this is true and nothing is found, null will be returned instead of empty array.
	* @returns {any[]|null} The array from the notes, or null.
	*/
	static #getArrayFromNotesByRegex(databaseData, structure, nullIfEmpty = false) {
		const safeFlags = structure.flags.replace("g", "").replace("y", "");
		const scan = new RegExp(structure.source, safeFlags);
		const lines = databaseData.note.split(/[\r\n]+/);
		let val = null;
		let hasMatch = false;
		lines.forEach((line) => {
			if (line.match(structure)) {
				const [, result] = scan.exec(line);
				val = JsonMapper.parseObject(result);
				hasMatch = true;
			}
		});
		if (!hasMatch) {
			return nullIfEmpty ? null : [];
		}
		return val;
	}
	/**
	* Collects all {@link JABS_OnChanceEffect}s from a single database objects.
	* @param {RPG_Base} databaseData The database object to retrieve on-chance effects from.
	* @param {RegExp} structure The on-chance-effect-templated regex structure to parse for.
	* @returns {JABS_OnChanceEffect[]} All found on-chance effects on this database object.
	*/
	static getOnChanceEffectsFromDatabaseObject(databaseData, structure) {
		const foundDatas = this.getArraysFromNotesByRegex(databaseData, structure);
		const key = J.BASE.Helpers.getKeyFromRegexp(structure);
		const mapper = (data) => {
			const [skillId, chance, hitTypeString] = data;
			const hitType = RPGManager.resolveHitTypeString(hitTypeString);
			return new JABS_OnChanceEffect(skillId, chance ?? 100, key, hitType);
		};
		const mappedOnChanceEffects = foundDatas.map(mapper, this);
		return mappedOnChanceEffects;
	}
	/**
	* Resolves an optional hit type string from a notetag into its numeric constant.
	* Accepts "physical", "magical", or "certain" (case-insensitive).
	* Returns null when the string is absent or unrecognised, meaning any hit type matches.
	* @param {string|undefined} str The raw string from the parsed notetag array.
	* @returns {number|null}
	*/
	static resolveHitTypeString(str) {
		if (!str) return null;
		switch (str.toLowerCase()) {
			case "physical": return Game_Action.HITTYPE_PHYSICAL;
			case "magical": return Game_Action.HITTYPE_MAGICAL;
			case "certain": return Game_Action.HITTYPE_CERTAIN;
			default: return null;
		}
	}
	/**
	* Collects all {@link JABS_OnChanceEffect}s from the list of database objects.
	* @param {RPG_Base[]} databaseDatas The list of database objects to parse.
	* @param {RegExp} structure The on-chance-effect-templated regex structure to parse for.
	* @returns {JABS_OnChanceEffect[]}
	*/
	static getOnChanceEffectsFromDatabaseObjects(databaseDatas, structure) {
		const onChanceEffects = [];
		databaseDatas.forEach((databaseData) => {
			const onChanceEffectList = this.getOnChanceEffectsFromDatabaseObject(databaseData, structure);
			onChanceEffects.push(...onChanceEffectList);
		});
		return onChanceEffects;
	}
	/**
	* Determines whether the database object can have its note parsed.
	* @param {RPG_Base} databaseData The database object to inspect.
	* @returns {boolean} True if it can be parsed, false otherwise.
	*/
	static #canParsedatabaseData(databaseData) {
		if (!databaseData) return false;
		if (databaseData && !databaseData.note) return false;
		return true;
	}
};

//#endregion
//#region src/plugins/_base/core/database/base/RPG_Base.js
/**
* A class representing the foundation of all database objects.
* In addition to doing all the things that a database object normally does,
* there are now some useful helper functions available for meta and note access,
* and additionally a means to access the original database object directly in case
* there are other things that aren't supported by this class that need accessing.
*/
var RPG_Base = class RPG_Base {
	/**
	* Stores the original underlying data per-instance, keyed by the instance.
	* Using a static WeakMap instead of a private instance field makes _original()
	* safe to call on objects created via Object.create(RPG_Base.prototype) (which
	* never run the constructor and therefore cannot initialize private fields).
	* @type {WeakMap<RPG_Base, any>}
	*/
	static #originals = new WeakMap();
	/**
	* The index of this entry in the database.
	* @type {number}
	*/
	index = 0;
	/**
	* The entry's id in the database.
	*/
	id = 0;
	/**
	* The `meta` object of this skill, containing a dictionary of
	* key value pairs translated from this skill's `note` object.
	* @type {{ [k: string]: any }}
	*/
	meta = {};
	/**
	* The entry's name.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The note field of this entry in the database.
	* @type {string}
	*/
	note = String.empty;
	/**
	* Constructor.
	* Maps the base item's properties into this object.
	* @param {any} baseItem The underlying database object.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(baseItem, index) {
		RPG_Base.#originals.set(this, baseItem);
		this.index = index;
		this.id = baseItem.id;
		this.meta = baseItem.meta;
		this.name = baseItem.name;
		this.note = baseItem.note;
		this.initMembers(baseItem);
	}
	/**
	* Extension seam: called at the end of construction with the raw source object so plugins can copy extra
	* properties that are not part of the base schema.
	* @param {any} _baseItem The underlying database object.
	*/
	initMembers(_baseItem) {}
	/**
	* Retrieves the index of this entry in the database.
	* @returns {number}
	*/
	_index() {
		return this.index;
	}
	/**
	* Updates the index of this entry in the database.
	* @param {number} newIndex The new index to set.
	*/
	_updateIndex(newIndex) {
		this.index = newIndex;
	}
	/**
	* The unique key that is used to register this object against
	* its corresponding container when the party has one or more of these
	* in their possession. By default, this is just the index of the item's entry
	* from the database, but you can change it if you need a more unique means
	* of identifying things.
	* @returns {any}
	*/
	_key() {
		return this._index();
	}
	/**
	* Retrieves the original underlying data that was passed to this
	* wrapper from the database.
	* @returns {any}
	*/
	_original() {
		return RPG_Base.#originals.get(this) ?? this;
	}
	/**
	* Creates a new instance of this wrapper class with all the same
	* database data that this one contains.
	* @returns {this}
	*/
	_clone() {
		const clone = new this.constructor(this, this._index());
		return clone;
	}
	/**
	* Generates an instance of this object off of the values of another.
	*
	* This is mostly used for "cloning" based on some other values.
	* @param {RPG_Base} overrides The overriding object.
	* @param {number} index The new index.
	* @returns {this}
	*/
	_generate(overrides, index) {
		return new this.constructor(overrides, index);
	}
	/**
	* Whether or not this database entry is an actor.
	* @returns {boolean}
	*/
	isActor() {
		return false;
	}
	/**
	* Whether or not this database entry is a class.
	* @returns {boolean}
	*/
	isClass() {
		return false;
	}
	/**
	* Whether or not this database entry is an enemy.
	* @returns {boolean}
	*/
	isEnemy() {
		return false;
	}
	/**
	* Whether or not this database entry is an item.
	* @returns {boolean}
	*/
	isItem() {
		return false;
	}
	/**
	* Whether or not this database entry is a weapon.
	* @returns {boolean}
	*/
	isWeapon() {
		return false;
	}
	/**
	* Whether or not this database entry is an armor.
	* @returns {boolean}
	*/
	isArmor() {
		return false;
	}
	/**
	* Whether or not this database entry is an equip item (weapon or armor).
	* {@link RPG_EquipItem} overrides this to return true.
	* @returns {boolean}
	*/
	isEquipItem() {
		return false;
	}
	/**
	* Whether or not this database entry is a skill.
	* @returns {boolean}
	*/
	isSkill() {
		return false;
	}
	/**
	* Whether or not this database entry is a state.
	* @returns {boolean}
	*/
	isState() {
		return false;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return "@base";
	}
	/**
	* Gets all type classifiers assigned to this state via notetag.
	* Returns every value matched by a {@code <type:CLASSIFIER>} tag in the notebox.
	* Multiple tags on the same state are all collected and returned together.
	* @returns {string[]} The array of classifier strings, or an empty array if none are defined.
	*/
	types() {
		return RPGManager.getStringsFromNoteByRegex(this, J.BASE.RegExp.ClassifierType);
	}
};

//#endregion
//#region src/plugins/_base/core/database/base/RPG_BaseItem.js
/**
* The class representing baseItem from the database,
* and now an iconIndex with a description.
*/
var RPG_BaseItem = class extends RPG_Base {
	/**
	* The description of this entry.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The icon index of this entry.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* Constructor.
	* Maps the base item's properties into this object.
	* @param {any} baseItem The underlying database object.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(baseItem, index) {
		super(baseItem, index);
		this.description = baseItem.description;
		this.iconIndex = baseItem.iconIndex;
	}
};
/**
* A frozen sentinel representing an empty or unoccupied database item slot.
* Use in place of null when a slot may have no item equipped so that callers
* can read {@code .name}, {@code .iconIndex}, and {@code .description} without
* null-guarding. Distinguish a real entry from this sentinel via {@code entry.id > 0}.
* @type {Readonly<{id: number, index: number, name: string, note: string, meta: {}, description: string, iconIndex: number}>}
*/
RPG_BaseItem.Empty = Object.freeze({
	id: 0,
	index: 0,
	name: "",
	note: "",
	meta: {},
	description: "",
	iconIndex: 0
});

//#endregion
//#region src/plugins/_base/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.BASE = {};
/**
* The plugin umbrella that governs all extensions of J-Base.
*/
J.BASE.EXT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.BASE.Metadata = {};
J.BASE.Metadata.Name = "J-Base";
J.BASE.Metadata.Version = "3.7.1";
/**
* The actual `plugin parameters` extracted from RMMZ.
*/
J.BASE.PluginParameters = PluginManager.parameters(J.BASE.Metadata.Name);
J.BASE.Metadata.BaseTpMaxActors = Number(J.BASE.PluginParameters["actorBaseTp"]);
J.BASE.Metadata.BaseTpMaxEnemies = Number(J.BASE.PluginParameters["enemyBaseTp"]);
/**
* How many generations of a save slot are kept on disk before the oldest are pruned.
*
* Every save writes a whole new generation and then points the slot at it, so the previous ones are
* still loadable. Keeping three means the failure mode of a bad save is "you lost the last save"
* rather than "you lost the file", which is the entire promise of the save system.
*
* The coalesce is the same pattern the note-parsing helpers use: a parameter the editor has not
* written into `plugins.js` yet reads as `undefined`, and this one has to hold a usable number from
* the first boot after the plugin is updated rather than after someone opens the plugin manager.
*/
J.BASE.Metadata.retainedSaveGenerations = Number(J.BASE.PluginParameters["retainedSaveGenerations"] ?? 3);
J.BASE.Metadata.ShowExternalFileLoadInfo = false;
/**
* The various traits captured here by id with a more meaningful descriptor.
*/
J.BASE.Traits = {
	/**
	* Defines a modification to one of the base parameters.
	* `.dataId` represents the parameter id, while `.value` represents the % modifier.
	*/
	B_PARAMETER: 21,
	/**
	* Defines a modification to one of the ex parameters.
	* `.dataId` represents the parameter id, while `.value` represents the % modifier.
	*/
	X_PARAMETER: 22,
	/**
	* Defines a modification to one of the sp parameters.
	* `.dataId` represents the parameter id, while `.value` represents the % modifier.
	*/
	S_PARAMETER: 23,
	/**
	* Defines the element associated with a skill/equipment/enemy.
	* `.dataId` represents the id of the element.
	*/
	ATTACK_ELEMENT: 31,
	/**
	* Defines the speed of deciding what action to take.
	* Caps at 1000 in the editor.
	*/
	ATTACK_SPEED: 33,
	/**
	* Defines the number of times an action will repeat.
	* Caps at +/- 9 in the editor.
	*
	* In the context of JABS, this adds onto the number of bonus hits an
	* actor will have globally.
	*/
	ATTACK_REPEATS: 34,
	/**
	* Defines the basic attack skill id.
	* For weapons and enemies, this represents the skill used for attacking.
	* For armor, this does nothing directly- but when used in the context of
	* JAFTING's refinement, it can redefine the skill used when a weapon attacks.
	*/
	ATTACK_SKILLID: 35,
	/**
	* Defines the addition/learning of a new skill category/type by means of trait.
	* The `dataId` for this trait represents the skill type id being learned.
	*/
	ADD_SKILLTYPE: 41,
	/**
	* Defines the removal/forgetting of a previous skill category/type by means of trait.
	* The `dataId` for this trait represents the skill type id being forgotten.
	*/
	SEAL_SKILLTYPE: 42,
	/**
	* Defines the addition/learning of a new skill by means of trait.
	* The `dataId` for this trait represents the skill id being learned.
	*/
	ADD_SKILL: 43,
	/**
	* Defines the removal/forgetting of a previous skill by means of trait.
	* The `dataId` for this trait represents the skill id being forgotten.
	*/
	SEAL_SKILL: 44,
	/**
	* The `DIVIDER` trait, specifically for JAFTING's refinement functionality.
	*/
	NO_DISAPPEAR: 63
};
/**
* String keys representing the three core battler resources.
* Passed as the first argument to {@link Game_Battler#onHeal} so listeners
* can branch without comparing magic strings themselves.
*/
J.BASE.Resource = {
	/**
	* Hit points — the primary health resource.
	*/
	HP: "hp",
	/**
	* Magic points — the mana / skill cost resource.
	*/
	MP: "mp",
	/**
	* Tech points — the limit / combo resource.
	*/
	TP: "tp"
};
/**
* All regular expressions used by this plugin.
*/
J.BASE.RegExp = {};
/**
* The basic structure for the maximum count of a number of items holdable is.
*/
J.BASE.RegExp.MaxItems = /<max:(\d+)>/gi;
/**
* Outgoing heal potency multiplier — the sender-side counterpart to REC (`<har:25>` = +25%).
*/
J.BASE.RegExp.HealAmplification = /<har:(-?\d+)>/gi;
/**
* The definition of what a parsable comment in an event looks like.
* This enforces a structure that enables the following tags to be valid:
*  <pre>
*    <someBooleanKey>
*    <someKeyWithNumberValue:123>
*    <someKeyWithArrayAndSingleNumberValue:[123]>
*    <someKeyWithArrayAndManyNumberValues:[123,456]>
*    <someKeyWithStringValue:someValue>
*    <someKeyWithRangeValue:startRange-endRange>
*    <someKeyWithHexColorValue:#ffa0a0>
*  </pre>
*/
J.BASE.RegExp.ParsableComment = /^<[[\]\w :"',.!+\-*/\\#]+>$/i;
/**
* The basic structure for retrieving summable max tech values.
*/
J.BASE.RegExp.MaxTp = /<maxTp: ?(-?\d+)>/i;
/**
* A flat amount of one parameter that **this row itself carries**, rather than one it grants its bearer.
*
* <pre>
* Structure:
*  <this{PARAM}:AMOUNT>
*
* Example:
*  <thisAtk:15>
*
* Translation:
*  This row contributes 15 points of ATK of its own.
* </pre>
*
* **Why these exist.** RMMZ gives equipment a `params` array for the eight base parameters and nothing at
* all for the twenty ex- and sp-parameters, which can only ever arrive as traits. A trait has no amount
* of its own to speak of - it multiplies whatever the *battler* already has - so there is no way in the
* editor to say "this shield is worth 25 points of parry". These tags are that missing field, in the same
* manner {@link J.BASE.RegExp.MaxTp} is the missing field for a resource RMMZ never modelled.
*
* That matters because it is what lets a percentage scale the *item* instead of its wearer. A `+25% ATK`
* on a sword can multiply the sword's own contribution once the sword has one, which keeps a legendary
* blade permanently worth more than a plussed-up Iron Sword - and stops a defensive stat being piled onto
* anything that will hold it.
*
* All twenty-eight are declared, including the eight the editor already covers via `params`. A refinement
* merge can produce any of them, so a `<thisAtk:>` arriving on a merged output needs somewhere to land
* rather than a special case. Where a row declares both, the two sum.
*
* **Amounts are in display units** - the same numbers the editor and the UI show, not the internal rates.
* `<thisGrd:25>` is twenty-five points of parry, matching the convention `<sar:25>` already uses.
*/
/**
* Flat max hit points this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMhp = /<thisMhp: ?(-?\d+)>/i;
/**
* Flat max magi this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMmp = /<thisMmp: ?(-?\d+)>/i;
/**
* Flat max tech this row carries.
*
* Belongs beside max life and max magi - {@link ParameterKeys} files it as a long parameter alongside them
* and `PassiveRuleThreshold` treats all three as max resources - and it is only absent from the eight
* because RMMZ fixed tech at a flat hundred for every battler rather than modelling it.
*
* Distinct from {@link J.BASE.RegExp.MaxTp}, which grants its **bearer** extra max tech wherever it is
* declared. This one is an amount the row itself is worth, so a percentage can scale it. A row may carry
* both, and they mean different things.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMtp = /<thisMtp: ?(-?\d+)>/i;
/**
* Flat attack this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisAtk = /<thisAtk: ?(-?\d+)>/i;
/**
* Flat defense this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisDef = /<thisDef: ?(-?\d+)>/i;
/**
* Flat magic attack this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMat = /<thisMat: ?(-?\d+)>/i;
/**
* Flat magic defense this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMdf = /<thisMdf: ?(-?\d+)>/i;
/**
* Flat agility this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisAgi = /<thisAgi: ?(-?\d+)>/i;
/**
* Flat luck this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisLuk = /<thisLuk: ?(-?\d+)>/i;
/**
* Flat accuracy this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisHit = /<thisHit: ?(-?\d+)>/i;
/**
* Flat evasion this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisEva = /<thisEva: ?(-?\d+)>/i;
/**
* Flat critical hit chance this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisCri = /<thisCri: ?(-?\d+)>/i;
/**
* Flat critical evasion this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisCev = /<thisCev: ?(-?\d+)>/i;
/**
* Flat magic evasion this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMev = /<thisMev: ?(-?\d+)>/i;
/**
* Flat magic reflection this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMrf = /<thisMrf: ?(-?\d+)>/i;
/**
* Flat counter attack chance this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisCnt = /<thisCnt: ?(-?\d+)>/i;
/**
* Flat hp regeneration this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisHrg = /<thisHrg: ?(-?\d+)>/i;
/**
* Flat magi regeneration this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMrg = /<thisMrg: ?(-?\d+)>/i;
/**
* Flat tech regeneration this row carries.
*
* Mind the neighbour: this is regeneration, while {@link J.BASE.RegExp.ThisTgr} one region below is
* target rate. The two abbreviations are a transposition apart and mean unrelated things.
* @type {RegExp}
*/
J.BASE.RegExp.ThisTrg = /<thisTrg: ?(-?\d+)>/i;
/**
* Flat target rate this row carries - how much aggro it draws.
*
* Mind the neighbour: this is target rate, while {@link J.BASE.RegExp.ThisTrg} one region above is tech
* regeneration.
* @type {RegExp}
*/
J.BASE.RegExp.ThisTgr = /<thisTgr: ?(-?\d+)>/i;
/**
* Flat guard rate this row carries - parry.
* @type {RegExp}
*/
J.BASE.RegExp.ThisGrd = /<thisGrd: ?(-?\d+)>/i;
/**
* Flat recovery rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisRec = /<thisRec: ?(-?\d+)>/i;
/**
* Flat pharmacology this row carries - potency of consumed items.
* @type {RegExp}
*/
J.BASE.RegExp.ThisPha = /<thisPha: ?(-?\d+)>/i;
/**
* Flat magi cost reduction this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMcr = /<thisMcr: ?(-?\d+)>/i;
/**
* Flat tech charge rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisTcr = /<thisTcr: ?(-?\d+)>/i;
/**
* Flat physical damage rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisPdr = /<thisPdr: ?(-?\d+)>/i;
/**
* Flat magical damage rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisMdr = /<thisMdr: ?(-?\d+)>/i;
/**
* Flat floor damage rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisFdr = /<thisFdr: ?(-?\d+)>/i;
/**
* Flat experience rate this row carries.
* @type {RegExp}
*/
J.BASE.RegExp.ThisExr = /<thisExr: ?(-?\d+)>/i;
/**
* One or more type classifiers assigned to a state.
* Multiple tags on the same state are all collected.
*
* <pre>
* Structure:
*  <type:CLASSIFIER>
*
* Example:
*  <type:poison>
*
* Translation:
*  This state belongs to the "poison" classifier category.
* </pre>
* @type {RegExp}
*/
J.BASE.RegExp.ClassifierType = /<type:[ ]?([a-zA-Z][a-zA-Z0-9_-]*)>/gi;
/**
* A collection of all aliased methods for this plugin.
*/
J.BASE.Aliased = {
	AudioManager: new Map(),
	Bitmap: new Map(),
	ConfigManager: new Map(),
	DataManager: new Map(),
	JsonEx: new Map(),
	Game_Action: new Map(),
	Game_BattlerBase: new Map(),
	Game_Character: {},
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_Enemy: new Map(),
	Game_ActionResult: new Map(),
	Game_Item: new Map(),
	Game_Map: new Map(),
	Game_Party: new Map(),
	Game_Temp: new Map(),
	Game_Timer: new Map(),
	Game_System: new Map(),
	Input: new Map(),
	Scene_Base: new Map(),
	Scene_Boot: new Map(),
	Scene_Map: new Map(),
	Scene_MenuBase: new Map(),
	SoundManager: new Map(),
	Window_Base: new Map(),
	Window_Command: new Map(),
	Window_Selectable: new Map()
};
/**
* The helper functions used commonly throughout my plugins.
*/
J.BASE.Helpers = {};
/**
* Quick and dirty semver without having access to the full nodejs ecosystem.
* Checks to ensure the version meets the required version- same as `semver.satisfies()`.
* Double tilda is shorthand for `parseInt()`.
* @param {string} currentVersion String representation of the version being checked.
* @param {string} minimumVersion String representation of the minimum required version.
* @returns {boolean}
*/
J.BASE.Helpers.satisfies = function(currentVersion, minimumVersion) {
	const currentVersionParts = currentVersion.split(".");
	const minimumVersionParts = minimumVersion.split(".");
	for (const i in currentVersionParts) {
		const a = ~~currentVersionParts[i];
		const b = ~~minimumVersionParts[i];
		if (a > b) return true;
		if (a < b) return false;
	}
	return true;
};
/**
* Parses a base-10 integer from plugin parameter values, using a fallback when missing or invalid.
*
* @param {string|number|undefined|null} value Raw plugin parameter value.
* @param {number} fallback Used when the value is empty or not a finite integer.
* @returns {number}
*/
J.BASE.Helpers.parsePluginInt = function(value, fallback) {
	if (value === undefined || value === null || value === "") {
		return fallback;
	}
	const parsed = Number.parseInt(String(value), 10);
	if (Number.isFinite(parsed)) {
		return parsed;
	}
	return fallback;
};
/**
* Generates a `uuid`- a universally unique identifier- for this battler.
* @returns {string} The `uuid`.
*/
J.BASE.Helpers.generateUuid = function() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
		return v.toString(16);
	});
};
/**
* Generates a vastly shorter version of the `uuid`.
* @returns {string} The `uuid`.
*/
J.BASE.Helpers.shortUuid = function() {
	return "xxx-xxx".replace(/x/g, () => {
		const nibble = Math.random() * 16 | 0;
		return nibble.toString(16);
	});
};
/**
* Updates the value of a numeric variable by a given amount.
*
* NOTE: This assumes the variable contains only a number.
* @param {number} variableId The id of the variable to modify.
* @param {number} amount The amount to modify the variable by.
*/
J.BASE.Helpers.modVariable = function(variableId, amount) {
	const oldValue = $gameVariables.value(variableId);
	const newValue = oldValue + amount;
	$gameVariables.setValue(variableId, newValue);
};
/**
* Provides a random integer within the range.
* @param {number} min The lower bound for random numbers (inclusive).
* @param {number} max The upper bound for random numbers (exclusive).
*/
J.BASE.Helpers.getRandomNumber = function(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
};
/**
* Translates the id and type into a proper `RPG::Item`.
* @param {number} id The id of the item in the database.
* @param {string} type An abbreviation for the type of item this is.
* @returns {RPG_BaseItem} The `RPG::Item` of the correct id and type.
*/
J.BASE.Helpers.translateItem = function(id, type) {
	switch (type) {
		case "i": return $dataItems[id];
		case "w": return $dataWeapons[id];
		case "a": return $dataArmors[id];
	}
};
/**
* Extracts the key portion from a tag.
* Captures everything between the `<` and `:`.
*
* If the optional `asBoolean` is provided as true, then it will instead
* capture everything between the `<` and `>`.
*
* This assumes it is one of the following formats:<br/>
*  `<someKey:someValue>`<br/>
*  `<someBooleanKey>`
* @param {RegExp} structure The structure of the regular expression.
* @param {boolean} asBoolean True if we want everything between `<` and `>`, false if only `<` and `:`.
* @returns {string}
*/
J.BASE.Helpers.getKeyFromRegexp = function(structure, asBoolean = false) {
	const stringifiedStructure = structure.toString();
	const openChar = "<";
	const closeChar = asBoolean ? ">" : ":";
	return stringifiedStructure.substring(stringifiedStructure.indexOf(openChar) + 1, stringifiedStructure.indexOf(closeChar));
};
/**
* Extends the global javascript {@link String} object.
* Adds a new property: {@link String.empty}, which is just an empty string.
*
* This is used to more clearly show developer intent rather than just arbitrarily
* adding empty double quotes all over the place.
* @type {string}
*/
Object.defineProperty(String, "empty", {
	value: "",
	writable: false
});
/**
* Extends the global javascript {@link Array} object.
* Adds a new property: {@link Array.empty}, which is just an empty array.
*
* This is used to more clearly show developer intent rather than just arbitrarily
* adding empty hard brackets all over the place.
* @type {[]}
*/
Object.defineProperty(Array, "empty", {
	enumerable: true,
	configurable: false,
	get: function() {
		return Array.of();
	}
});
/**
* Executes a given function a given number of `times`.
* This uses `.forEach()` under the covers, so build your functions accordingly.
* @param {number} times The times driving this step.
* @param {Function} func The function
* @param {undefined|any=} thisArg What represents "this" in the `.forEach()`; defaults to undefined.
*/
Array.iterate = function(times, func, thisArg = undefined) {
	[...Array(times)].forEach(func, thisArg);
};
/**
* Adds a given number of days based on this date.
* @param {number} days The number of days to add to a date.
* @returns {Date} The updated date with the designated days.
*/
Date.prototype.addDays = function(days) {
	const result = new Date(this.valueOf());
	result.setDate(result.getDate() + days);
	return result;
};
/**
* Adds a given number of hours based on this date.
* @param {number} hours The number of hours to add to a date.
* @returns {Date} The updated date with the designated hours.
*/
Date.prototype.addHours = function(hours) {
	this.setTime(this.getTime() + hours * 60 * 60 * 1e3);
	return this;
};
/**
* Adds a given number of minutes based on this date.
* @param {number} minutes The number of minutes to add to a date.
* @returns {Date} The updated date with the designated minutes.
*/
Date.prototype.addMinutes = function(minutes) {
	this.setTime(this.getTime() + minutes * 60 * 1e3);
	return this;
};
/**
* Masks all characters of a given string with the given masking character.
* @param {string} stringToMask The string to mask behind the maskingCharacter.
* @param {string=} maskingCharacter The character to mask with; defaults to "?".
* @returns {string} The masked string.
*/
J.BASE.Helpers.maskString = function(stringToMask, maskingCharacter = "?") {
	const structure = /[0-9A-Za-z\-()[\]*!?'"=@,.]/gi;
	return stringToMask.toString().replace(structure, maskingCharacter);
};

//#endregion
//#region src/plugins/_base/core/core/SerializableRegistry.js
/**
* A central registry of constructors that {@link JsonEx} can use for reliable
* type restoration when deserializing.
*
* It is also where each type's save declarations are kept - but only kept. This class stores what a
* registration said and answers "what constructor does this name mean"; it does not know what a
* transient or a typed field *means*, because that is the save format's business and the save
* format is an optional extension. J-Base-Save reads these declarations and builds its own codecs
* from them.
*
* That division is what lets the extension be uninstalled: without it, every registration here is
* inert metadata that nothing interprets, and the engine's own save path carries on unchanged.
*/
var SerializableRegistry = class {
	/**
	* Gets the constructors.
	* @returns {Map<string, Function>} The constructors.
	*/
	static constructors() {
		return this._constructors;
	}
	/**
	* Gets the raw declarations each constructor was registered with.
	* @returns {Map<Function, object>} The registrations.
	*/
	static registrations() {
		return this._registrations;
	}
	/**
	* Gets how many times a registration has been filed or amended.
	*
	* Anything caching a view of this registry compares against this rather than against the map's
	* size, because size does not move when a registration is replaced - and a test that clears the
	* registry and re-registers the same count would otherwise keep a stale cache silently.
	* @returns {number} The revision.
	*/
	static revision() {
		return this._revision;
	}
	/**
	* Sets the revision.
	* @param {number} value The new revision.
	*/
	static setRevision(value) {
		this._revision = value;
	}
	/**
	* The internal collection of registered constructors.
	* @type {Map<string, Function>}
	*/
	static _constructors = new Map();
	/**
	* The options each constructor was registered with, kept so {@link #extend} can merge into them.
	*
	* This exists because a codec for an engine class is authored by more than one plugin. J-Base owns
	* the `Game_Party` registration, but the transients living at `_j._omni` on that same party are
	* J-Omni's to declare - and J-Base must never know they exist, because a core plugin does not
	* reach into an optional extension. Keeping the raw declarations means a later contribution merges
	* rather than clobbers.
	* @type {Map<Function, object>}
	*/
	static _registrations = new Map();
	/**
	* How many times a registration has been filed or amended, so a cache can tell it has gone stale.
	* @type {number}
	*/
	static _revision = 0;
	/**
	* Registers a constructor for {@link JsonEx} deserialization and for the save pipeline.
	*
	* This enables modern `class` syntax for serializable models without requiring
	* `window.SomeClass = SomeClass` global exports.
	*
	* Everything past `aliases` describes how the save pipeline should treat this type. All of it is
	* optional, and the defaults are chosen to fail open: a type registered with no options at all
	* persists every own enumerable field, holds no instances, and seeds from `initMembers` if it has
	* one. Forgetting to declare something means it gets saved, which is wasteful and harmless- the
	* opposite mistake loses a player's progress.
	*
	* Both `transients` and `typed` accept **dotted paths** as keys, because the fields worth declaring
	* usually sit inside a plugin namespace rather than directly on the class:
	*
	* ```javascript
	* SerializableRegistry.register(Game_Party, {
	*   id: 'game-party',
	*   aliases: [ 'Game_Party' ],
	*   transients: {
	*     // lazy: every reader is guarded, so the cold value is the whole answer.
	*     '_j._base._cachedAllNotes': () => null,
	*
	*     // eager: nothing rebuilds this on a miss, so the factory owes the rebuild.
	*     '_j._omni._questopediaCache': party => new Map(
	*       party.getSavedQuestopediaEntries().map(entry => [ entry.key, entry ])),
	*   },
	*   typed: {
	*     _lastItem: Game_Item,
	*   },
	* });
	* ```
	*
	* @param {Function} constructor The constructor to register.
	* @param {{
	*   id?: string,
	*   aliases?: string[],
	*   transients?: Object<string, Function>,
	*   typed?: Object<string, Function>,
	*   typedValues?: Object<string, Function>,
	*   seed?: Function,
	*   encode?: Function,
	*   decode?: Function
	* }=} options Options for registration.
	*/
	static register(constructor, options = undefined) {
		const given = options ?? {};
		const id = given.id ? given.id : constructor.name;
		this.constructors().set(id, constructor);
		const aliases = given.aliases ? given.aliases : [];
		aliases.forEach((alias) => {
			this.constructors().set(alias, constructor);
		});
		const declarations = {
			id,
			aliases,
			transients: given.transients ?? {},
			typed: given.typed ?? {},
			typedValues: given.typedValues ?? {},
			seed: given.seed ?? null,
			encode: given.encode ?? null,
			decode: given.decode ?? null
		};
		this.installDeclarations(constructor, declarations);
	}
	/**
	* Adds declarations to a type another plugin already registered.
	*
	* This is how a plugin claims the part of a shared host that belongs to it. `Game_Party` is
	* registered by J-Base, but the caches at `$gameParty._j._omni` are J-Omni's - and the dependency
	* only runs one way, so J-Base cannot name them. J-Omni calls this instead, and the two sets of
	* declarations merge into the one codec that describes the class.
	*
	* Merging is per-declaration and last-wins on a collision, which is the same shape as the alias
	* map pattern: two plugins declaring the same path would be a genuine conflict worth noticing, and
	* two plugins declaring different paths - the normal case - simply add up.
	*
	* The `id`, `aliases`, and `seed` of an existing registration are left alone. Identity belongs to
	* whoever registered the type, and an extension redefining it would silently repoint every save.
	* @param {Function} constructor The already-registered constructor to add declarations to.
	* @param {{
	*   transients?: Object<string, Function>,
	*   typed?: Object<string, Function>,
	*   typedValues?: Object<string, Function>
	* }} options The declarations to merge in.
	*/
	static extend(constructor, options) {
		const existing = this.registrations().get(constructor);
		if (!existing) {
			throw new Error(`cannot extend the save codec for '${constructor.name}' because nothing has registered it. ` + "The plugin that owns the type must load before the one extending it.");
		}
		this.installDeclarations(constructor, {
			...existing,
			transients: {
				...existing.transients,
				...options.transients ?? {}
			},
			typed: {
				...existing.typed,
				...options.typed ?? {}
			},
			typedValues: {
				...existing.typedValues,
				...options.typedValues ?? {}
			}
		});
	}
	/**
	* Empties the registry entirely.
	*
	* This exists so nothing has to reach into the two maps to reset them. Clearing them from outside
	* would leave the revision where it was, and any cached view comparing against that revision would
	* decide it was still current while holding codecs for types that are no longer registered.
	*/
	static clear() {
		this.constructors().clear();
		this.registrations().clear();
		this.setRevision(this.revision() + 1);
	}
	/**
	* Files a complete set of declarations against the constructor they describe.
	* @param {Function} constructor The constructor being described.
	* @param {object} declarations The complete, normalized declarations.
	*/
	static installDeclarations(constructor, declarations) {
		this.registrations().set(constructor, declarations);
		this.setRevision(this.revision() + 1);
	}
	/**
	* Resolves a previously-registered constructor by id.
	*
	* This is {@link JsonEx}'s lookup, and it hands back a bare constructor because that is all
	* {@link JsonEx} has ever wanted. Anything reading save declarations goes through the index the
	* save extension builds instead.
	* @param {string} id The serialization id for the constructor.
	* @returns {Function|null} The resolved constructor, or null when not found.
	*/
	static resolve(id) {
		if (this.constructors().has(id)) {
			return this.constructors().get(id);
		}
		return null;
	}
	/**
	* Resolves the declarations a live value's type was registered with.
	*
	* Keyed on `value.constructor` rather than on a name or a prototype-chain test, which is both a
	* plain `Map` lookup and immune to two unrelated classes sharing a name.
	* @param {object} value The live instance to identify.
	* @returns {object|null} The declarations, or null when the type is not registered.
	*/
	static registrationForInstance(value) {
		if (this.registrations().has(value.constructor)) {
			return this.registrations().get(value.constructor);
		}
		return null;
	}
};

//#endregion
//#region src/plugins/_base/core/core/ParameterFormat.js
/**
* Display formatting policy for a {@link ParameterDefinition}.
*/
var ParameterFormat = class {
	/**
	* Whole-number base parameter (ATK, DEF, HIT, etc.).
	* @type {string}
	*/
	static FLAT = "flat";
	/**
	* Large pool base parameter (MHP, MMP).
	* @type {string}
	*/
	static FLAT_LARGE = "flatLarge";
	/**
	* Ex-parameter rate shown in percent space (multiply by 100).
	* @type {string}
	*/
	static PERCENT = "percent";
	/**
	* S-parameter rate centered around zero (multiply by 100, subtract 100).
	* @type {string}
	*/
	static PERCENT_CENTERED = "percentCentered";
	/**
	* Regeneration rate shown as per-second (divide engine tick by 5).
	* @type {string}
	*/
	static REGEN_PER_SECOND = "regenPerSecond";
	/**
	* Percent stat with explicit suffix (CDM, CDR, CNT, MRF, etc.).
	* @type {string}
	*/
	static PERCENT_SUFFIX = "percentSuffix";
	/**
	* Multiplier shown in percent space without centering (SDR, APR, etc.).
	* @type {string}
	*/
	static MULTIPLIER_PERCENT = "multiplierPercent";
	/**
	* Hundred-scale points display with no centering (HIT).
	* @type {string}
	*/
	static SCALED_POINTS = "scaledPoints";
	/**
	* Hundred-scale points display centered around zero (GRD).
	* @type {string}
	*/
	static SCALED_OFFSET = "scaledOffset";
};

//#endregion
//#region src/plugins/_base/core/core/ParameterDisplayPolicy.js
/**
* Value-aware display policy for {@link ParameterDefinition} entries.
* Drives signed padding and dynamic status colors without changing raw battler math.
*/
var ParameterDisplayPolicy = class {
	/**
	* Default catalog display — static color only, no extra sign rules.
	* @type {string}
	*/
	static NONE = "none";
	/**
	* Damage intake rates (PDR, MDR, FDR): lower is better, negative is protective.
	* @type {string}
	*/
	static DAMAGE_RATE = "damageRate";
	/**
	* Reward gain rates (EXP, gold, drops, SDP, APT): higher is better, centered at zero.
	* @type {string}
	*/
	static REWARD_RATE = "rewardRate";
	/**
	* Signed centered percent with no dynamic color (aggro).
	* @type {string}
	*/
	static SIGNED = "signed";
	/**
	* Skill cost reduction rates (HCR, etc.): lower is better, reducing what the battler pays.
	* @type {string}
	*/
	static COST_RATE = "costRate";
};

//#endregion
//#region src/plugins/_base/core/core/ParameterDisplaySentinel.js
/**
* Fixed status-screen labels for clamped rate parameters.
*/
var ParameterDisplaySentinel = class {
	/** @type {string} */
	static FREE = "FREE";
	/** @type {string} */
	static IMMUNE = "IMMUNE";
	/** @type {string} */
	static NONE = "NONE";
};

//#endregion
//#region src/plugins/_base/core/core/ParameterGroups.js
/**
* Status-screen and catalog grouping ids for {@link ParameterDefinition}.
*/
var ParameterGroups = class ParameterGroups {
	/** @type {string} */
	static VITALITY = "vitality";
	/** @type {string} */
	static COMBAT = "combat";
	/** @type {string} */
	static PRECISION = "precision";
	/** @type {string} */
	static DEFENSIVE = "defensive";
	/** @type {string} */
	static FATE = "fate";
	/** @type {string} */
	static SUPPORT = "support";
	/**
	* All groups in default status-screen iteration order.
	* @type {string[]}
	*/
	static ALL = [
		ParameterGroups.VITALITY,
		ParameterGroups.COMBAT,
		ParameterGroups.PRECISION,
		ParameterGroups.DEFENSIVE,
		ParameterGroups.FATE,
		ParameterGroups.SUPPORT
	];
};

//#endregion
//#region src/plugins/_base/core/core/ParameterKeys.js
/**
* String keys for vanilla engine parameters and legacy long-param id translation.
*/
var ParameterKeys = class ParameterKeys {
	/**
	* b-param registry keys indexed by engine param id (0–7).
	* @type {string[]}
	*/
	static BPARAM_KEYS = [
		"mhp",
		"mmp",
		"atk",
		"def",
		"mat",
		"mdf",
		"agi",
		"luk"
	];
	/**
	* x-param registry keys indexed by engine xparam id (0–9).
	* @type {string[]}
	*/
	static XPARAM_KEYS = [
		"hit",
		"eva",
		"cri",
		"cev",
		"mev",
		"mrf",
		"cnt",
		"hrg",
		"mrg",
		"trg"
	];
	/**
	* s-param registry keys indexed by engine sparam id (0–9).
	* @type {string[]}
	*/
	static SPARAM_KEYS = [
		"tgr",
		"grd",
		"rec",
		"pha",
		"mcr",
		"tcr",
		"pdr",
		"mdr",
		"fdr",
		"exr"
	];
	/**
	* Legacy SDP panel long-param id → registry key.
	* @type {Object<number, string>}
	*/
	static LEGACY_LONG_PARAM_TO_KEY = {
		0: "mhp",
		1: "mmp",
		2: "atk",
		3: "def",
		4: "mat",
		5: "mdf",
		6: "agi",
		7: "luk",
		8: "hit",
		9: "eva",
		10: "cri",
		11: "cev",
		12: "mev",
		13: "mrf",
		14: "cnt",
		15: "hrg",
		16: "mrg",
		17: "trg",
		18: "tgr",
		19: "grd",
		20: "rec",
		21: "pha",
		22: "mcr",
		23: "tcr",
		24: "pdr",
		25: "mdr",
		26: "fdr",
		27: "exr",
		28: "cdm",
		29: "ctr",
		30: "mtp",
		31: "msb",
		32: "prof",
		33: "sdr",
		35: "lst",
		36: "mst",
		37: "tst",
		38: "sar",
		39: "ser",
		40: "apr",
		41: "gdr",
		42: "dor",
		43: "hcr",
		44: "cdr",
		45: "per",
		46: "har"
	};
	/**
	* Parameters where a panel decrease is beneficial in the SDP preview UI.
	* @type {string[]}
	*/
	static SDP_SMALLER_IS_BETTER = [
		"tgr",
		"mcr",
		"tcr",
		"pdr",
		"mdr",
		"fdr"
	];
	/**
	* @param {number} paramId Engine b-param id (0–7).
	* @returns {string|null}
	*/
	static bparamKey(paramId) {
		return ParameterKeys.BPARAM_KEYS[paramId] ?? null;
	}
	/**
	* @param {number} xparamId Engine x-param id (0–9).
	* @returns {string|null}
	*/
	static xparamKey(xparamId) {
		return ParameterKeys.XPARAM_KEYS[xparamId] ?? null;
	}
	/**
	* @param {number} sparamId Engine s-param id (0–9).
	* @returns {string|null}
	*/
	static sparamKey(sparamId) {
		return ParameterKeys.SPARAM_KEYS[sparamId] ?? null;
	}
	/**
	* @param {number} longParamId Legacy unified panel parameter id.
	* @returns {string|null}
	*/
	static legacyLongParamKey(longParamId) {
		return ParameterKeys.LEGACY_LONG_PARAM_TO_KEY[longParamId] ?? null;
	}
	/**
	* Reverse lookup: returns the engine b-param id (0–7) for the given registry key,
	* or -1 if the key does not correspond to any b-param.
	* @param {string} parameterKey The registry key to look up.
	* @returns {number}
	*/
	static bparamId(parameterKey) {
		return ParameterKeys.BPARAM_KEYS.indexOf(parameterKey);
	}
	/**
	* Reverse lookup: returns the engine x-param id (0–9) for the given registry key,
	* or -1 if the key does not correspond to any x-param.
	* @param {string} parameterKey The registry key to look up.
	* @returns {number}
	*/
	static xparamId(parameterKey) {
		return ParameterKeys.XPARAM_KEYS.indexOf(parameterKey);
	}
	/**
	* Reverse lookup: returns the engine s-param id (0–9) for the given registry key,
	* or -1 if the key does not correspond to any s-param.
	* @param {string} parameterKey The registry key to look up.
	* @returns {number}
	*/
	static sparamId(parameterKey) {
		return ParameterKeys.SPARAM_KEYS.indexOf(parameterKey);
	}
};

//#endregion
//#region src/plugins/_base/core/core/JsonEx.js
/**
* Extends {@link JsonEx._encode}.<br/>
* Also encodes native `Map`/`Set` instances, and stops the original algorithm's in-place mutation of
* whatever object graph is being stringified.
*/
J.BASE.Aliased.JsonEx.set("_encode", JsonEx._encode);
JsonEx._encode = function(value, depth) {
	if (depth >= this.maxDepth) {
		throw new Error("Object too deep");
	}
	if (value instanceof Map) {
		return {
			"@": "Map",
			entries: [...value.entries()].map(([key, val]) => [this._encode(key, depth + 1), this._encode(val, depth + 1)])
		};
	}
	if (value instanceof Set) {
		return {
			"@": "Set",
			values: [...value].map((val) => this._encode(val, depth + 1))
		};
	}
	const type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]") {
		const encoded = Array.isArray(value) ? [] : {};
		const constructorName = value.constructor.name;
		if (constructorName !== "Object" && constructorName !== "Array") {
			encoded["@"] = constructorName;
		}
		for (const key of Object.keys(value)) {
			encoded[key] = this._encode(value[key], depth + 1);
		}
		return encoded;
	}
	return value;
};
/**
* Extends {@link JsonEx._decode}.<br/>
* Also resolves constructors via {@link SerializableRegistry} before falling back to the engine's
* default `window[className]` lookup, and reconstructs `Map`/`Set` instances encoded by the
* {@link JsonEx._encode} extension above.
*/
J.BASE.Aliased.JsonEx.set("_decode", JsonEx._decode);
JsonEx._decode = function(value) {
	const type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]") {
		if (value["@"] === "Map") {
			return new Map(value.entries.map(([key, val]) => [this._decode(key), this._decode(val)]));
		}
		if (value["@"] === "Set") {
			return new Set(value.values.map((val) => this._decode(val)));
		}
		if (value["@"]) {
			const constructorName = value["@"];
			const constructor = SerializableRegistry.resolve(constructorName) || window[constructorName];
			if (constructor) {
				Object.setPrototypeOf(value, constructor.prototype);
			}
		}
		Object.keys(value).forEach((key) => {
			value[key] = this._decode(value[key]);
		});
	}
	return value;
};

//#endregion
//#region src/plugins/_base/core/core/Bitmap.js
/**
* The alignments a canvas will actually accept for {@link CanvasRenderingContext2D#textAlign}.
*
* Kept as an allowlist rather than a type check, because the question being asked is not "is this a string" but
* "is this something the canvas understands" - and a wrong string is every bit as broken as a number.
* @type {string[]}
*/
var validTextAlignments = [
	"left",
	"center",
	"right",
	"start",
	"end"
];
/**
* Normalizes the alignment RMMZ hands down, because the engine hands down two different wrong things.
*
* `Window_Base.prototype.drawText` takes `(text, x, y, maxWidth, align)` while `Bitmap.prototype.drawText` takes
* `(text, x, y, maxWidth, lineHeight, align)` - five parameters against six, with `align` and `lineHeight` sitting
* in the same slot. Vanilla confuses the two in three separate places, and every one lands here:
*
* - `Window_Base.flushTextState` calls with no alignment at all, so `align` arrives `undefined`.
* - `Window_EquipSlot.drawItem` and `Window_StatusEquip.drawItem` both pass `rect.height`, so `align` arrives as
*   the line height - `36` by default, which the console then rejects once per equipment slot per refresh.
*
* Older Chromium quietly ignored an unusable `textAlign`; NW.js 0.110+ warns instead, which is why engine code
* that has been wrong for years only started saying so recently. **This is not a guard against our own contract**
* - it is the boundary with engine code that cannot be corrected at the source, and every one of those callers
* meant the default, so the default is what they get.
*
* @param {string} text The text that will be drawn.
* @param {number} x The x coordinate for the left of the text.
* @param {number} y The y coordinate for the top of the text.
* @param {number} maxWidth The maximum allowed width of the text.
* @param {number} lineHeight The height of the text line.
* @param {string} [align] The alignment of the text; defaults to left when unusable or omitted.
*/
J.BASE.Aliased.Bitmap.set("drawText", Bitmap.prototype.drawText);
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
	const resolvedAlign = validTextAlignments.includes(align) ? align : "left";
	J.BASE.Aliased.Bitmap.get("drawText").call(this, text, x, y, maxWidth, lineHeight, resolvedAlign);
};

//#endregion
//#region src/plugins/_base/core/models/PluginVersion.js
var PluginVersion = class PluginVersion {
	/**
	* The major version of this plugin.
	* @type {number}
	*/
	major = 0;
	/**
	* The minor version of this plugin.
	* @type {number}
	*/
	minor = 0;
	/**
	* The patch version of this plugin.
	* @type {number}
	*/
	patch = 0;
	/**
	* Constructor.
	* It is strongly recommended to use the {@link PluginVersion.builder} to
	* create these classes due to their string-parsing sensitivity.
	* @param {string} version The version driving this step.
	*/
	constructor(version) {
		const semverParts = version.split(".").map((part) => parseInt(part));
		const [major, minor, patch] = semverParts;
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}
	/**
	* Gets the string version of this overall version.
	* @return {string}
	*/
	version() {
		return [
			this.major,
			this.minor,
			this.patch
		].join(".");
	}
	/**
	* Checks if this {@link PluginVersion} is at or above another.
	* @param {PluginVersion} pluginVersion The other version to check satisfaction with.
	*/
	satisfiesPluginVersion(pluginVersion) {
		if (this.major > pluginVersion.major) return true;
		if (this.major < pluginVersion.major) return false;
		if (this.minor > pluginVersion.minor) return true;
		if (this.minor < pluginVersion.minor) return false;
		if (this.patch > pluginVersion.patch) return true;
		if (this.patch < pluginVersion.patch) return false;
		return true;
	}
	/**
	* A static builder class for more easily building {@link PluginVersion}s.
	* @type {PluginVersionBuilder}
	*/
	static builder = new class PluginVersionBuilder {
		#major = 0;
		#minor = 0;
		#patch = 0;
		/**
		* Build the {@link PluginVersion} with the current parameters.
		* Any unassigned parameters are defaulted to zero.
		* @return {PluginVersion}
		*/
		build() {
			const semverParts = [
				this.#major,
				this.#minor,
				this.#patch
			];
			const semver = semverParts.join(".");
			const pluginVersion = new PluginVersion(semver);
			this.#clear();
			return pluginVersion;
		}
		/**
		* The major version, typically incremented on breaking changes or
		* with drastic changes to existing functionality.
		* @param {number} version The numeric value of the version.
		* @return {PluginVersionBuilder} The builder for chaining.
		*/
		major(version) {
			const parsedVersion = parseInt(version);
			this.#major = parsedVersion;
			return this;
		}
		/**
		* The minor version, typically incremented on non-breaking changes or
		* additions in functionality.
		* @param {number} version The numeric value of the version.
		* @return {PluginVersionBuilder} The builder for chaining.
		*/
		minor(version) {
			const parsedVersion = parseInt(version);
			this.#minor = parsedVersion;
			return this;
		}
		/**
		* The patch version, typically incremented on tiny non-breaking changes
		* or fixes to existing functionality.
		* @param {number} version The numeric value of the version.
		* @return {PluginVersionBuilder} The builder for chaining.
		*/
		patch(version) {
			const parsedVersion = parseInt(version);
			this.#patch = parsedVersion;
			return this;
		}
		/**
		* Clears the data in the builder.
		*/
		#clear() {
			this.#major = 0;
			this.#minor = 0;
			this.#patch = 0;
		}
	}();
};

//#endregion
//#region src/plugins/_base/core/models/PluginMetadata.js
var PluginMetadata = class PluginMetadata {
	/**
	* A name:metadata map of all registered plugins in the this plugin ecosystem.
	* @type {Map<string, PluginMetadata>}
	*/
	static #plugins = new Map();
	/**
	* The name of the plugin.
	* This typically matches the filename, without the extension.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The version of the plugin.
	* @type {PluginVersion}
	*/
	version = null;
	/**
	* The raw plugin parameters string that is supposed to be "JSON-like".
	* @type {string}
	*/
	rawPluginParameters = "[]";
	/**
	* The parsed object for later manipulation.
	* This is almost always iterable.
	* @type {any[]}
	*/
	parsedPluginParameters = null;
	/**
	* Constructor.
	* @param {string} name The name of this plugin. Should match the filename.
	* @param {string} version The version of this plugin. Should be "semver"-formatted.
	*/
	constructor(name = "", version = "") {
		if (!name || !version) {
			Diagnostics.trace("J-Base", "erroneous plugin metadata was provided.", {
				name,
				version
			});
			const message = `Erroneous plugin metadata provided: name=[${name}], version=[${version}]`;
			throw new Error(message);
		}
		this.name = name;
		this.#applyVersion(version);
		this.initializePlugin();
	}
	/**
	* Whether or not a given plugin has registered its metadata.
	* @param {string} pluginName The name of the plugin to check for.
	* @return {boolean}
	*/
	static hasPlugin(pluginName) {
		return this.#plugins.has(pluginName);
	}
	static getPlugin(pluginName) {
		return this.#plugins.get(pluginName);
	}
	/**
	* Registers a plugin for tracking.
	* @param {PluginMetadata} pluginMetadata The metadata to track.
	*/
	static #registerPlugin(pluginMetadata) {
		if (this.hasPlugin(pluginMetadata.name)) {
			throw new Error(`Duplicate plugin entry detected: [${pluginMetadata.name}] !`);
		}
		this.#plugins.set(pluginMetadata.name, pluginMetadata);
	}
	/**
	* Takes the stringy version of the version to validate and set.
	* @param {string} version The "semver"-formatted string.
	*/
	#applyVersion(version) {
		const [major, minor, patch] = version.split(".").map((part) => parseInt(part));
		const pluginVersion = PluginVersion.builder.major(major).minor(minor).patch(patch).build();
		this.version = pluginVersion;
	}
	/**
	*  Initializes the plugin.
	*  This method is intended to be extended.
	*/
	initializePlugin() {
		this.rawPluginParameters = PluginManager.parameters(this.name);
		this.parsedPluginParameters = JsonMapper.parseObject(this.rawPluginParameters);
		PluginMetadata.#registerPlugin(this);
		this.postInitialize();
	}
	/**
	* Post initialization logic for setting up additional properties from the
	* plugin parameters or whatever else.
	*/
	postInitialize() {}
};

//#endregion
//#region src/plugins/_base/core/models/MenuSection.js
/**
* The sections a main menu command can belong to.
*
* The main menu is split into two columns because the scenes behind it split cleanly in two: those
* that answer "something specific about this actor", and those that concern the party or the game as
* a whole. Surfacing that split in the menu itself means the player learns the model by using it,
* rather than hunting through one long undifferentiated list.
*/
var MenuSection = class {
	/**
	* Commands opening a scene scoped to a single actor- status, equipment, skills, and the like.
	* These render in the left column.
	* @type {string}
	*/
	static Actor = "actor";
	/**
	* Commands opening a scene concerning the party or the game as a whole- items, crafting, options.
	* These render in the right column, and are the default for any command that never declares itself.
	* @type {string}
	*/
	static Party = "party";
	/**
	* Gets every valid section.
	* @returns {string[]}
	*/
	static sections() {
		return [this.Actor, this.Party];
	}
	/**
	* Determines whether the given value names a real section.
	* @param {string} section The value to validate.
	* @returns {boolean}
	*/
	static isValid(section) {
		return this.sections().includes(section);
	}
};

//#endregion
//#region src/plugins/_base/core/models/InputDevice.js
/**
* The kinds of input device the player can be holding.
*
* This exists so that anything drawing a button glyph can ask one question- "what is the player
* actually using right now?"- and get an answer that is a fixed vocabulary rather than a guess. A
* legend telling a controller player to press `Z` is worse than no legend at all, because it is
* confidently wrong.
*
* There are deliberately only two members. The glyph sheet this vocabulary serves carries one gamepad
* style and one keyboard style, so a third member would name something that cannot be drawn. Should
* further styles ever be illustrated, this is the enum that grows.
*/
var InputDevice = class {
	/**
	* The player is on a keyboard.
	*
	* This is the default, because a keyboard is the one input device a computer running the game is
	* guaranteed to have.
	* @type {string}
	*/
	static Keyboard = "keyboard";
	/**
	* The player is on a gamepad.
	* @type {string}
	*/
	static Gamepad = "gamepad";
	/**
	* Gets every valid device.
	* @returns {string[]}
	*/
	static devices() {
		return [this.Keyboard, this.Gamepad];
	}
	/**
	* Determines whether the given value names a real device.
	* @param {string} device The value to validate.
	* @returns {boolean}
	*/
	static isValid(device) {
		return this.devices().includes(device);
	}
};

//#endregion
//#region src/plugins/_base/core/models/BuiltWindowCommand.js
/**
* An implementation of a class surrounding the data for a singular window command.
*/
var BuiltWindowCommand = class {
	/**
	* The name of the command.
	* This is what visibly shows up in the list of commands.
	* @type {string}
	*/
	#name = String.empty;
	/**
	* Additional lines of text to render below the main command name.
	* @type {string[]}
	*/
	#lines = [];
	/**
	* Whether or not the additional lines are actually subtext.<br/>
	* Additional lines are classified as subtext by default.
	* @type {boolean}
	*/
	#isSubtext = true;
	/**
	* The text that will be right-aligned for this command.
	* @type {string}
	*/
	#rightText = String.empty;
	/**
	* The text color index the right-aligned text will be rendered with.
	* @type {number}
	*/
	#rightColorIndex = 0;
	/**
	* The symbol of this command.
	* This is normally invisible and used for connecting this command
	* to an event hook for logical processing.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* Whether or not this command is enabled.
	* @type {boolean}
	*/
	#enabled = true;
	/**
	* The underlying data associated with this command.
	* Usually populated with whatever this command represents data-wise.
	* @type {object|null}
	*/
	#extensionData = null;
	/**
	* Any special help text associated with this command.
	* @type {string}
	*/
	#helpText = String.empty;
	/**
	* The index of the icon that will be rendered on the left side of this command.
	* @type {number}
	*/
	#iconIndex = 0;
	/**
	* The text color index this command will be rendered with.
	* @type {number}
	*/
	#colorIndex = 0;
	/**
	* The filename of the face image associated with this log.
	* @type {string|String.empty}
	*/
	#faceName = String.empty;
	/**
	* The index of the face image associated with this log.
	* @type {number}
	*/
	#faceIndex = -1;
	/**
	* The menu section this command belongs to, for menus that split their commands into columns.
	*
	* This defaults to {@link MenuSection.Party} rather than being required, so that any command built
	* without knowledge of sections still lands somewhere sensible instead of vanishing. Only commands
	* that open an actor-scoped scene need to say otherwise.
	* @type {string}
	*/
	#menuSection = MenuSection.Party;
	constructor(name, symbol, enabled = true, extensionData = null, iconIndex = 0, colorIndex = 0, rightText = String.empty, rightColorIndex = 0, lines = [], helpText = String.empty, isSubtext = true, faceData = [String.empty, -1]) {
		this.#name = name;
		this.#key = symbol;
		this.#enabled = enabled;
		this.#extensionData = extensionData;
		this.#iconIndex = iconIndex;
		this.#colorIndex = colorIndex;
		this.#rightText = rightText;
		this.#rightColorIndex = rightColorIndex;
		this.#lines = lines;
		this.#helpText = helpText;
		this.#isSubtext = isSubtext;
		const [faceName, faceIndex] = faceData;
		this.#faceName = faceName;
		this.#faceIndex = faceIndex;
	}
	/**
	* Gets the name for this command.
	* @returns {string}
	*/
	get name() {
		return this.#name;
	}
	/**
	* Gets the extra lines that provide subtext to this command.
	* @returns {string[]}
	*/
	get subText() {
		if (!this.isSubtext) return [];
		return this.#lines;
	}
	/**
	* Gets the extra lines that make up this multiline command.
	* @returns {string[]}
	*/
	get lines() {
		if (this.isSubtext) return [];
		return this.#lines;
	}
	/**
	* Gets whether or not this command's additional lines were actually subtext.
	* @returns {boolean}
	*/
	get isSubtext() {
		return this.#isSubtext;
	}
	/**
	* Gets the right-aligned text for this command.
	* @returns {string}
	*/
	get rightText() {
		return this.#rightText;
	}
	/**
	* Gets the right-aligned color index of this command, if one is available.
	* @returns {number}
	*/
	get rightColor() {
		return this.#rightColorIndex;
	}
	/**
	* Gets the symbol for this command.
	* @returns {string}
	*/
	get symbol() {
		return this.#key;
	}
	/**
	* Gets whether or not this command is enabled.
	* @returns {boolean}
	*/
	get enabled() {
		return this.#enabled;
	}
	/**
	* Gets the underlying extension data for this command, if any is available.
	* @returns {object|null}
	*/
	get ext() {
		return this.#extensionData;
	}
	/**
	* Gets the icon index of this command, if one is available.
	* @returns {number}
	*/
	get icon() {
		return this.#iconIndex;
	}
	/**
	* Gets the color index of this command, if one is available.
	* @returns {number}
	*/
	get color() {
		return this.#colorIndex;
	}
	/**
	* Gets the help text of this command, if any is available.
	* @returns {string}
	*/
	get helpText() {
		return this.#helpText;
	}
	get faceData() {
		return [this.#faceName, this.#faceIndex];
	}
	/**
	* Gets the menu section this command belongs to.
	* @returns {string}
	*/
	get menuSection() {
		return this.#menuSection;
	}
	/**
	* Sets the menu section this command belongs to.
	*
	* This is assigned after construction rather than through the constructor because the constructor
	* already carries twelve positional parameters- adding a thirteenth for a field that most commands
	* never set would make every existing call site harder to read for no benefit.
	* @param {string} menuSection One of {@link MenuSection}.
	*/
	set menuSection(menuSection) {
		if (MenuSection.isValid(menuSection) === false) return;
		this.#menuSection = menuSection;
	}
};

//#endregion
//#region src/plugins/_base/core/models/ExternalJsonConfigLoaderOptions.js
/**
* The options for {@link ExternalJsonConfigLoader.load}.<br>
* This exists to avoid anonymous option objects throughout the codebase.
* @template TConfigJson The raw JSON shape after {@link JSON.parse}.
* @template TConfigResult The optional mapped/classified result shape.
*/
var ExternalJsonConfigLoaderOptions = class {
	/**
	* A factory for generating {@link ExternalJsonConfigLoaderOptions}.<br>
	* @returns {ExternalJsonConfigLoaderOptionsBuilder}
	* @constructor
	*/
	static Builder = () => new ExternalJsonConfigLoaderOptionsBuilder();
	/**
	* The plugin name used for error context.
	* @type {string|null}
	*/
	pluginName = null;
	/**
	* A friendly label for the config used for error context.
	* @type {string|null}
	*/
	configName = null;
	/**
	* Optional validator; throw an Error to reject the parsed blob.
	* @type {((parsed: TConfigJson) => void)|null}
	*/
	validator = null;
	/**
	* Optional mapper/classifier for transforming the parsed blob.
	* @type {((parsed: TConfigJson) => TConfigResult)|null}
	*/
	mapper = null;
	/**
	* Optional log builder when info logging is enabled.
	* @type {((result: TConfigResult|TConfigJson) => (string|string[]))|null}
	*/
	logSummary = null;
	/**
	* Constructor.
	* @param {string=} pluginName The plugin name used for error context.
	* @param {string=} configName A friendly label for the config used for error context.
	*/
	constructor(pluginName = null, configName = null) {
		this.pluginName = pluginName;
		this.configName = configName;
	}
};
/**
* A builder for {@link ExternalJsonConfigLoaderOptions}.<br>
* Exists to keep configuration setup explicit and chainable.
* @template TConfigJson The raw JSON shape after {@link JSON.parse}.
* @template TConfigResult The optional mapped/classified result shape.
*/
var ExternalJsonConfigLoaderOptionsBuilder = class {
	/**
	* The plugin name used for error context.
	* @type {string|null}
	*/
	#pluginName = null;
	/**
	* A friendly label for the config used for error context.
	* @type {string|null}
	*/
	#configName = null;
	/**
	* Optional validator; throw an Error to reject the parsed blob.
	* @type {((parsed: TConfigJson) => void)|null}
	*/
	#validator = null;
	/**
	* Optional mapper/classifier for transforming the parsed blob.
	* @type {((parsed: TConfigJson) => TConfigResult)|null}
	*/
	#mapper = null;
	/**
	* Optional log builder when info logging is enabled.
	* @type {((result: TConfigResult|TConfigJson) => (string|string[]))|null}
	*/
	#logSummary = null;
	/**
	* Builds the {@link ExternalJsonConfigLoaderOptions}.
	* @returns {ExternalJsonConfigLoaderOptions<TConfigJson, TConfigResult>}
	*/
	build() {
		const options = new ExternalJsonConfigLoaderOptions(this.#pluginName, this.#configName);
		options.validator = this.#validator;
		options.mapper = this.#mapper;
		options.logSummary = this.#logSummary;
		this.#clear();
		return options;
	}
	/**
	* Sets the plugin name used for error context.
	* @param {string|null} pluginName The plugin name.
	* @returns {ExternalJsonConfigLoaderOptionsBuilder}
	*/
	pluginName(pluginName) {
		this.#pluginName = pluginName;
		return this;
	}
	/**
	* Sets the config name used for error context.
	* @param {string|null} configName The config name.
	* @returns {ExternalJsonConfigLoaderOptionsBuilder}
	*/
	configName(configName) {
		this.#configName = configName;
		return this;
	}
	/**
	* Sets the validator callback used for rejecting invalid parsed blobs.
	* @param {((parsed: TConfigJson) => void)|null} validator The validator callback.
	* @returns {ExternalJsonConfigLoaderOptionsBuilder<TConfigJson, TConfigResult>}
	*/
	validator(validator) {
		this.#validator = validator;
		return this;
	}
	/**
	* Sets the mapper/classifier callback used for transforming parsed blobs.
	* @param {((parsed: TConfigJson) => TConfigResult)|null} mapper The mapper callback.
	* @returns {ExternalJsonConfigLoaderOptionsBuilder<TConfigJson, TConfigResult>}
	*/
	mapper(mapper) {
		this.#mapper = mapper;
		return this;
	}
	/**
	* Sets the log summary callback used for information logs.
	* @param {((result: TConfigResult|TConfigJson) => (string|string[]))|null} logSummary The summary callback.
	* @returns {ExternalJsonConfigLoaderOptionsBuilder<TConfigJson, TConfigResult>}
	*/
	logSummary(logSummary) {
		this.#logSummary = logSummary;
		return this;
	}
	/**
	* Clears the data in the builder.
	*/
	#clear() {
		this.#pluginName = null;
		this.#configName = null;
		this.#validator = null;
		this.#mapper = null;
		this.#logSummary = null;
	}
};

//#endregion
//#region src/plugins/_base/core/models/FilterCycle.js
/**
* An ordered ring of filter positions with a cursor, driving the L2/R2 tab strip above a filterable list.
*
* This is deliberately the dumbest possible thing that can hold a cycle: it owns an order and an index and
* nothing else. It does not know what a position means, where the positions came from, or whether any of
* them would produce an empty list- because the two scenes that already do this disagree about that last
* one on purpose. SDP omits families the actor has no panels in, so a filter over your own things can never
* dead-end; the study shop deliberately steps onto empty shelves, because a shoulder button that sometimes
* moves one place and sometimes three reads as broken, and an empty shelf says "come back later" rather
* than "this does not exist". Both are right for their scene, so the choice lives at the call site that
* builds the positions, and this class holds no opinion at all.
*/
var FilterCycle = class FilterCycle {
	/**
	* The reserved key for the position that matches everything.
	* @type {string}
	*/
	static ALL = "__all__";
	/**
	* The reserved key for the position collecting entries that resolve to no other position.
	* @type {string}
	*/
	static UNKNOWN = "__unknown__";
	/**
	* The position handed back when the cycle holds nothing, so callers never receive null.
	* @type {{key: string, name: string, iconIndex: number}}
	*/
	static EMPTY_POSITION = Object.freeze({
		key: FilterCycle.ALL,
		name: String.empty,
		iconIndex: 0
	});
	/**
	* The ordered positions this cycle walks.
	* @type {Array<{key: string, name: string, iconIndex: number}>}
	*/
	#positions = [];
	/**
	* The index into {@link #positions} currently selected.
	* @type {number}
	*/
	#index = 0;
	/**
	* @constructor
	* @param {Array<{key: string, name: string, iconIndex: number}>=} positions The positions to start with.
	*/
	constructor(positions = []) {
		this.setPositions(positions);
	}
	/**
	* Replaces the positions this cycle walks.
	*
	* The active key is preserved across a rebuild whenever it still exists, because the positions get rebuilt
	* for reasons that have nothing to do with the player- switching party member, learning a recipe- and
	* silently moving the tab out from under them on an unrelated event reads as the menu losing its place.
	* @param {Array<{key: string, name: string, iconIndex: number}>} positions The positions driving this step.
	*/
	setPositions(positions) {
		const previousKey = this.activeKey();
		this.#positions = positions;
		const survivingIndex = positions.findIndex((position) => position.key === previousKey);
		this.#index = survivingIndex === -1 ? 0 : survivingIndex;
	}
	/**
	* The positions this cycle is currently walking.
	* @returns {Array<{key: string, name: string, iconIndex: number}>}
	*/
	positions() {
		return this.#positions;
	}
	/**
	* Whether there is anywhere to move to.
	*
	* A single position is not a cycle- pressing the shoulder button would land you exactly where you already
	* are, so the caller buzzes instead of pretending something happened.
	* @returns {boolean}
	*/
	canCycle() {
		return this.#positions.length > 1;
	}
	/**
	* The position currently selected, or {@link FilterCycle.EMPTY_POSITION} when the cycle holds nothing.
	* @returns {{key: string, name: string, iconIndex: number}}
	*/
	activePosition() {
		if (this.#positions.length === 0) {
			return FilterCycle.EMPTY_POSITION;
		}
		return this.#positions.at(this.#index);
	}
	/**
	* The key of the position currently selected.
	*
	* An empty cycle answers {@link FilterCycle.ALL}, so a list asked to filter by it shows everything rather
	* than nothing- an unbuilt cycle should never look like a filter that excluded every row.
	* @returns {string}
	*/
	activeKey() {
		return this.activePosition().key;
	}
	/**
	* Moves the cursor forward one place, wrapping past the end.
	*/
	next() {
		this.#step(1);
	}
	/**
	* Moves the cursor back one place, wrapping past the front.
	*/
	previous() {
		this.#step(-1);
	}
	/**
	* Walks the cursor by a number of places, wrapping in either direction.
	*
	* A single position needs no special case: the wrap arithmetic already lands back on index 0. Only the
	* empty ring is worth naming, because a modulo by zero would poison the index rather than clamp it.
	* @param {number} step How many places to move, which may be negative.
	*/
	#step(step) {
		const total = this.#positions.length;
		if (total === 0) return;
		this.#index = (this.#index + step + total) % total;
	}
};

//#endregion
//#region src/plugins/_base/core/models/WindowGaugeOptions.js
/**
* The options for a gauge that shows up in the window.
*/
var WindowGaugeOptions = class {
	/**
	* A factory for generating {@link WindowGaugeOptions}.
	* @returns {GaugeOptionsBuilder}
	* @constructor
	*/
	static Builder = () => new GaugeOptionsBuilder();
	/**
	* The type of gauge to render.
	* @type {string}
	*/
	gaugeType = String.empty;
	/**
	* The color of the gauge's background.
	* @type {string}
	*/
	backColor = String.empty;
	/**
	* The left color gradient for the gauge.
	* @type {string}
	*/
	leftGradientColor = String.empty;
	/**
	* The right color gradient for the gauge.
	* @type {string}
	*/
	rightGradientColor = String.empty;
	/**
	* The color of the gauge's border.
	* @type {string}
	*/
	borderColor = String.empty;
	/**
	* The thickness of the gauge's border.
	* @type {number}
	*/
	borderThickness = 0;
	/**
	* The gap between the gauge's border and the inner fill area.
	* @type {number}
	*/
	borderGap = 0;
	/**
	* The color of the segment dividers.
	* @type {string}
	*/
	dividerColor = String.empty;
	/**
	* The number of visual segments.
	* @type {number}
	*/
	segments = 1;
	/**
	* The gap between visual segments in pixels.
	* @type {number}
	*/
	gap = 0;
	/**
	* The corner radius of the pill gauge in pixels.
	* @type {number}
	*/
	radius = 0;
	/**
	* The thickness of the radial gauge in pixels.
	* @type {number}
	*/
	thickness = 1;
	/**
	* The start angle of the radial gauge in radians.
	* @type {number}
	*/
	startAngle = 0;
	/**
	* Constructor.
	*/
	constructor(gaugeType, backColor, leftGradientColor, rightGradientColor, borderColor, borderThickness, borderGap, dividerColor, segments, gap, radius, thickness, startAngle) {
		this.gaugeType = gaugeType;
		this.backColor = backColor;
		this.leftGradientColor = leftGradientColor;
		this.rightGradientColor = rightGradientColor;
		this.borderColor = borderColor;
		this.borderThickness = borderThickness;
		this.borderGap = borderGap;
		this.dividerColor = dividerColor;
		this.segments = segments;
		this.gap = gap;
		this.radius = radius;
		this.thickness = thickness;
		this.startAngle = startAngle;
	}
};

//#endregion
//#region src/plugins/_base/core/models/GaugeOptionsBuilder.js
/**
* A factory for generating {@link WindowGaugeOptions}.
* Comes with sensible defaults.
*/
var GaugeOptionsBuilder = class {
	/**
	* The color of the gauge's background.
	* @type {string}
	*/
	#backColor = String.empty;
	/**
	* The color of the gauge's border.
	* @type {string}
	*/
	#borderColor = "rgba(255, 255, 255, 0.85)";
	/**
	* The left color gradient for the gauge.
	* Blends to the right color.
	* @type {string}
	*/
	#leftColor = "rgba(179, 89, 0, 1)";
	/**
	* The right color gradient for the gauge.
	* Blends from the left color.
	* @type {string}
	*/
	#rightColor = "rgba(255, 166, 77, 1)";
	/**
	* The thickness of the gauge's border.
	* @type {number}
	*/
	#borderThickness = 2;
	/**
	* The gap between the gauge's border and the inner fill area.
	* @type {number}
	*/
	#borderGap = 1;
	/**
	* The color of the segment dividers.
	* @type {string}
	*/
	#dividerColor = "rgba(255, 255, 255, 0.85)";
	/**
	* The number of visual segments.
	* @type {number}
	*/
	#segments = 8;
	/**
	* The gap between visual segments in pixels.
	* @type {number}
	*/
	#gap = 2;
	/**
	* The corner radius of the pill gauge in pixels.
	* @type {number}
	*/
	#radius = 4;
	/**
	* The thickness of the radial gauge in pixels.
	* @type {number}
	*/
	#thickness = 6;
	/**
	* The start angle of the radial gauge in radians.
	* @type {number}
	*/
	#startAngle = -Math.PI / 2;
	/**
	* The type of gauge to render.
	* @type {string}
	*/
	#gaugeType = Window_Base.GAUGE_TYPES.Rectangle;
	/**
	* Builds the {@link WindowGaugeOptions}.
	* @returns {WindowGaugeOptions}
	*/
	build() {
		return new WindowGaugeOptions(this.#gaugeType, this.#backColor, this.#leftColor, this.#rightColor, this.#borderColor, this.#borderThickness, this.#borderGap, this.#dividerColor, this.#segments, this.#gap, this.#radius, this.#thickness, this.#startAngle);
	}
	/**
	* The type of gauge, from {@link Window_Base.GAUGE_TYPES}.
	* @param {string} type The gauge type.
	* @returns {GaugeOptionsBuilder}
	*/
	gaugeType(type) {
		this.#gaugeType = type;
		return this;
	}
	/**
	* Sets the gauge's background color.
	* @param {string} color The color to set.
	* @returns {GaugeOptionsBuilder}
	*/
	backColor(color) {
		this.#backColor = color;
		return this;
	}
	/**
	* Sets the left color gradient for the gauge.
	* @param {string} color The color to set.
	* @returns {GaugeOptionsBuilder}
	*/
	leftGradientColor(color) {
		this.#leftColor = color;
		return this;
	}
	/**
	* Sets the right color gradient for the gauge.
	* @param {string} color The color to set.
	* @returns {GaugeOptionsBuilder}
	*/
	rightGradientColor(color) {
		this.#rightColor = color;
		return this;
	}
	/**
	* Sets the gauge’s border color.
	* @param {string} color The outline color.
	* @returns {GaugeOptionsBuilder}
	*/
	borderColor(color) {
		this.#borderColor = color;
		return this;
	}
	/**
	* Sets the border thickness in pixels (>=1).
	* @param {number} thickness The outline thickness.
	* @returns {GaugeOptionsBuilder}
	*/
	borderThickness(thickness) {
		this.#borderThickness = thickness;
		return this;
	}
	/**
	* Sets the padding between outline and inner fill area (>=0).
	* @param {number} gap The padding.
	* @returns {GaugeOptionsBuilder}
	*/
	borderGap(gap) {
		this.#borderGap = gap;
		return this;
	}
	/**
	* Sets the color for segment dividers (defaults to borderColor if omitted).
	* @param {string} color The divider color.
	* @returns {GaugeOptionsBuilder}
	*/
	dividerColor(color) {
		this.#dividerColor = color;
		return this;
	}
	/**
	* Sets the number of visual segments (>=1).
	* @param {number} count The segment count.
	* @returns {GaugeOptionsBuilder}
	*/
	segments(count) {
		this.#segments = count;
		return this;
	}
	/**
	* Sets the inter‑segment gap in pixels (>=0).
	* @param {number} px The gap width.
	* @returns {GaugeOptionsBuilder}
	*/
	gap(px) {
		this.#gap = px;
		return this;
	}
	/**
	* Sets the visual corner radius for pill gauges.
	* @param {number} r The radius in pixels.
	* @returns {GaugeOptionsBuilder}
	*/
	radius(r) {
		this.#radius = r;
		return this;
	}
	/**
	* Sets the ring thickness for radial gauges.
	* @param {number|null} t The thickness in pixels; null to derive automatically.
	* @returns {GaugeOptionsBuilder}
	*/
	thickness(t) {
		this.#thickness = t;
		return this;
	}
	/**
	* Sets the start angle for radial gauges (radians).
	* @param {number} radians The start angle.
	* @returns {GaugeOptionsBuilder}
	*/
	startAngle(radians) {
		this.#startAngle = radians;
		return this;
	}
};

//#endregion
//#region src/plugins/_base/core/models/J_EventEmitter.js
/**
* A custom event emitter for providing an event-driven approach to targeted
* cross-domain communication.
*
* Consider reviewing nodejs documentation about the {@link EventEmitter} class
* for usage instructions.
*/
var J_EventEmitter = class extends PIXI.utils.EventEmitter {};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_SkillDamage.js
/**
* The damage data for the skill, such as the damage formula or associated element.
*/
var RPG_SkillDamage = class {
	/**
	* Whether or not the damage can produce a critical hit.
	* @type {boolean}
	*/
	critical = false;
	/**
	* The element id associated with this damage.
	* @type {number}
	*/
	elementId = -1;
	/**
	* The formula to be evaluated in real time to determine damage.
	* @type {string}
	*/
	formula = String.empty;
	/**
	* The damage type this is, such as HP damage or MP healing.
	* @type {1|2|3|4|5|6}
	*/
	type = 0;
	/**
	* The % of variance this damage can have.
	* @type {number}
	*/
	variance = 0;
	/**
	* Constructor.
	* Maps the skill's damage properties into this object.
	* @param {RPG_SkillDamage} damage The original damage object to map.
	*/
	constructor(damage) {
		if (damage) {
			this.critical = damage.critical;
			this.elementId = damage.elementId;
			this.formula = damage.formula;
			this.type = damage.type;
			this.variance = damage.variance;
		} else {}
	}
};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_UsableEffect.js
/**
* A class representing a single effect on an item or skill from the database.
*/
var RPG_UsableEffect = class {
	/**
	* The type of effect this is.
	* @type {number}
	*/
	code = 0;
	/**
	* The dataId further defines what type of effect this is.
	* @type {number}
	*/
	dataId = 0;
	/**
	* The first value parameter of the effect.
	* @type {number}
	*/
	value1 = 0;
	/**
	* The second value parameter of the effect.
	* @type {number}
	*/
	value2 = 0;
	/**
	* Constructor.
	* @param {RPG_UsableEffect} effect The effect to parse.
	*/
	constructor(effect) {
		this.code = effect.code;
		this.dataId = effect.dataId;
		this.value1 = effect.value1;
		this.value2 = effect.value2;
	}
	textName() {
		switch (this.code) {
			case 11: return "Recover Life";
			case 12: return "Recover Magi";
			case 13: return "Recover Tech";
			case 21: return "Add State";
			case 22: return "Remove State";
			case 31: return "Add Buff";
			case 32: return "Add Debuff";
			case 33: return "Remove Buff";
			case 34: return "Remove Debuff";
			case 41: return "Special";
			case 42: return "Core Stat Growth";
			case 43: return "Learn Skill";
			case 44: return "Execute Common Event";
			default:
				Diagnostics.warn("J-Base", `unsupported usable-effect code of [${this.code}] was provided.`);
				return "UNKNOWN";
		}
	}
	textValue() {
		switch (this.code) {
			case 11:
				const flatHp = this.value2;
				const percHp = this.value1 * 100;
				let msg = String.empty;
				if (flatHp) msg += flatHp;
				if (percHp) msg += ` ${percHp}%`;
				if (flatHp === 0 && percHp === 0) msg = "0";
				return msg.trim();
			case 12: return "Recover Magi";
			case 13: return "Recover Tech";
			case 21: return "Add State";
			case 22: return "Remove State";
			case 31: return "Add Buff";
			case 32: return "Add Debuff";
			case 33: return "Remove Buff";
			case 34: return "Remove Debuff";
			case 41: return "Special";
			case 42: return "Core Stat Growth";
			case 43: return "Learn Skill";
			case 44: return "Execute Common Event";
			default:
				Diagnostics.warn("J-Base", `unsupported usable-effect code of [${this.code}] was provided.`);
				return "UNKNOWN";
		}
	}
};

//#endregion
//#region src/plugins/_base/core/database/core/RPG_UsableItem.js
/**
* A class representing the base properties for any usable item or skill
* from the database.
*/
var RPG_UsableItem = class extends RPG_BaseItem {
	/**
	* The animation id to execute for this skill.
	* @type {number}
	*/
	animationId = -1;
	/**
	* The damage data for this skill.
	* @type {RPG_SkillDamage}
	*/
	damage = null;
	/**
	* The various effects of this skill.
	* @type {RPG_UsableEffect[]}
	*/
	effects = [];
	/**
	* The hit type of this skill.
	* @type {number}
	*/
	hitType = 0;
	/**
	* The occasion type when this skill can be used.
	* @type {number}
	*/
	occasion = 0;
	/**
	* The number of times this skill repeats.
	* @type {number}
	*/
	repeats = 1;
	/**
	* The scope of this skill.
	* @type {number}
	*/
	scope = 0;
	/**
	* The speed bonus of this skill.
	* @type {number}
	*/
	speed = 0;
	/**
	* The % chance of success for this skill.
	* @type {number}
	*/
	successRate = 100;
	/**
	* The amount of TP gained from executing this skill.
	* @type {number}
	*/
	tpGain = 0;
	/**
	* Constructor.
	* @param {RPG_UsableItem} usableItem The usable item to parse.
	* @param {number} index The index of the skill in the database.
	*/
	constructor(usableItem, index) {
		super(usableItem, index);
		this.animationId = usableItem.animationId;
		this.damage = new RPG_SkillDamage(usableItem.damage);
		this.effects = usableItem.effects.map((effect) => new RPG_UsableEffect(effect));
		this.hitType = usableItem.hitType;
		this.occasion = usableItem.occasion;
		this.repeats = usableItem.repeats;
		this.scope = usableItem.scope;
		this.speed = usableItem.speed;
		this.successRate = usableItem.successRate;
		this.tpGain = usableItem.tpGain;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:usable`;
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Skill.js
/**
* An class representing a single skill from the database.
*/
var RPG_Skill = class RPG_Skill extends RPG_UsableItem {
	/**
	* The first line of the message for this skill.
	* @type {string}
	*/
	message1 = String.empty;
	/**
	* The second line of the message for this skill.
	* @type {string}
	*/
	message2 = String.empty;
	/**
	* The amount of MP required to execute this skill.
	* @type {number}
	*/
	mpCost = 0;
	/**
	* The first of two required weapon types to be equipped to execute this skill.
	* @type {number}
	*/
	requiredWtypeId1 = 0;
	/**
	* The second of two required weapon types to be equipped to execute this skill.
	* @type {number}
	*/
	requiredWtypeId2 = 0;
	/**
	* The skill type that this skill belongs to.
	* @type {number}
	*/
	stypeId = 0;
	/**
	* The amount of TP required to execute this skill.
	* @type {number}
	*/
	tpCost = 0;
	/**
	* Constructor.
	* Maps the skill's properties into this object.
	* @param {RPG_Skill} skill The underlying skill object.
	* @param {number} index The index of the skill in the database.
	*/
	constructor(skill, index) {
		super(skill, index);
		this.initMembers(skill);
	}
	/**
	* Maps all the data from the JSON to this object.
	* @param {RPG_Skill} skill The underlying skill object.
	*/
	initMembers(skill) {
		this.message1 = skill.message1;
		this.message2 = skill.message2;
		this.mpCost = skill.mpCost;
		this.requiredWtypeId1 = skill.requiredWtypeId1;
		this.requiredWtypeId2 = skill.requiredWtypeId2;
		this.stypeId = skill.stypeId;
		this.tpCost = skill.tpCost;
	}
	/**
	* Whether or not this database entry is a skill.
	* @returns {boolean}
	*/
	isSkill() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:skill`;
	}
	/**
	* Hydrated blank skill row—symmetry with other DB wrappers when a slot must read as "unused but valid".
	*
	* @param {number} index database id and `$dataSkills` index for this row
	* @returns {RPG_Skill}
	*/
	static createEmpty(index) {
		const raw = {
			id: index,
			message1: String.empty,
			message2: String.empty,
			messageType: 1,
			mpCost: 0,
			requiredWtypeId1: 0,
			requiredWtypeId2: 0,
			stypeId: 1,
			tpCost: 0,
			animationId: 0,
			damage: {
				critical: false,
				elementId: 0,
				formula: "0",
				type: 0,
				variance: 20
			},
			effects: [],
			hitType: 0,
			occasion: 0,
			repeats: 1,
			scope: 1,
			speed: 0,
			successRate: 100,
			tpGain: 0,
			description: String.empty,
			iconIndex: 0,
			name: String.empty,
			note: String.empty,
			meta: {}
		};
		return new RPG_Skill(raw, index);
	}
};

//#endregion
//#region src/plugins/_base/core/models/J_Timer.js
/**
* A reusable timer with some nifty functions.
*/
var J_Timer = class {
	/**
	* Constructor.
	*
	* NOTE: A key is not required, but can be set with setters.
	* @param {number=} [timerMax=0] The max duration of this timer.
	* @param {boolean=} [stopCounting=true] Whether or not to stop counting after completing; defaults to true.
	* @param {?Function} callback EXPERIMENTAL. A callback function for completion of this timer.
	*/
	constructor(timerMax = 0, stopCounting = true, callback = null) {
		/**
		* The maximum count this timer can reach.
		* @type {number}
		*/
		this._timerMax = timerMax;
		/**
		* Whether or not to stop counting after we've reached the max.
		* @type {boolean}
		*/
		this._stopCounting = stopCounting;
		/**
		* The callback function to execute when the timer completes.
		* If none is provided, nothing will happen, though the {@link #onComplete} will still execute
		* in case you would prefer to handle it in code yourself.
		* @type {Function|null}
		*/
		this._callback = callback;
		this.initMembers();
	}
	/**
	* Initializes the default members for the timer.
	*/
	initMembers() {
		/**
		* A key or name for this timer.
		* This is not strictly enforced by the timer, so this is for
		* developer convenience if needed.
		* @type {string}
		*/
		this._key = String.empty;
		/**
		* The counter on this timer that ticks up to the max.
		* @type {number}
		*/
		this._timer = 0;
	}
	/**
	* Gets the timer.
	* @returns {number} The timer.
	*/
	timer() {
		return this._timer;
	}
	/**
	* Sets the timer.
	* @param {number} newTimer The new timer.
	*/
	setTimer(newTimer) {
		this._timer = newTimer;
	}
	/**
	* Gets the timer max.
	* @returns {number} The timerMax.
	*/
	timerMax() {
		return this._timerMax;
	}
	/**
	* Sets the timer max.
	* @param {number} newTimerMax The new timerMax.
	*/
	setTimerMax(newTimerMax) {
		this._timerMax = newTimerMax;
	}
	/**
	* Gets the stop counting.
	* @returns {boolean} The stopCounting.
	*/
	stopCounting() {
		return this._stopCounting;
	}
	/**
	* Gets the key of this timer, if one was set.
	* @returns {string|String.empty}
	*/
	getKey() {
		return this._key;
	}
	/**
	* Sets the key of this timer to the given value.
	* @param {string} key The new key or name for this timer.
	*/
	setKey(key) {
		this._key = key;
	}
	/**
	* Gets the current time on this timer.
	* @returns {number}
	*/
	getCurrentTime() {
		return this.timer();
	}
	/**
	* Sets the current time of this timer to a given amount.
	* Reducing below max time will remove completion if applicable.
	* Setting at or above max time will apply completion if applicable.
	* @param {number} time The new time for this timer.
	*/
	setCurrentTime(time) {
		this.setTimer(time);
		this._handleIfIncomplete();
		this._handleIfComplete();
	}
	/**
	* Modify the current time of this timer by the given amount.
	* Reducing below max time will remove completion if applicable.
	* Setting at or above max time will apply completion if applicable.
	* @param {number} time The amount to modify by.
	* @returns {number} The new total after modification.
	*/
	modCurrentTime(time) {
		this.setTimer(this.timer() + time);
		this._handleIfIncomplete();
		this._handleIfComplete();
		return this.timer();
	}
	/**
	* Gets the total time set to run on this timer.
	* @returns {number}
	*/
	getMaxTime() {
		return this.timerMax();
	}
	/**
	* Sets the max time for this timer to the given amount.
	* @param {number} maxTime The new max time for this timer.
	*/
	setMaxTime(maxTime) {
		this.setTimerMax(maxTime);
	}
	/**
	* Whether or not we should stop counting beyond max when updating.
	* @returns {boolean}
	*/
	shouldStopCounting() {
		return this.stopCounting();
	}
	/**
	* Normalize time that is above bounds while the "stop counting" flag is set.
	*/
	normalizeTime() {
		if (!this.isTimerComplete()) return;
		if (!this.shouldStopCounting()) return;
		this.setTimer(this.getMaxTime());
	}
	/**
	* Checks whether or not this timer is completed.
	* @returns {boolean} True if it is completed, false otherwise.
	*/
	isTimerComplete() {
		return this._timerComplete;
	}
	/**
	* Resets the timer back to initial state.
	*/
	reset() {
		this.setTimer(0);
		this._timerComplete = false;
	}
	/**
	* The main update method of this timer.
	*/
	update() {
		this.tick();
		this.tock();
	}
	/**
	* Processes the incrementing of the time.
	*/
	tick() {
		if (this.isTimerComplete()) return;
		this.setTimer(this.timer() + 1);
	}
	/**
	* Processes the management of state of this timer.
	*/
	tock() {
		this._handleIfComplete();
	}
	/**
	* Handles the possibility of this timer becoming incomplete.
	*/
	_handleIfIncomplete() {
		if (this.timer() < this.timerMax()) {
			this._timerComplete = false;
		}
		this.normalizeTime();
	}
	/**
	* Handles the possibility of this timer becoming complete.
	*/
	_handleIfComplete() {
		if (this.isTimerComplete()) return;
		if (this.timer() >= this.timerMax()) {
			this._timerComplete = true;
			this.normalizeTime();
			this.onComplete();
		}
	}
	/**
	* Forcefully completes this timer.
	*/
	forceComplete() {
		this.setCurrentTime(this.getMaxTime());
		this._handleIfComplete();
	}
	onComplete() {}
};

//#endregion
//#region src/plugins/_base/core/core/registerJBaseSerializableModels.js
SerializableRegistry.register(J_Timer);
/**
* A hydrated skill row reaches a savefile through J-Passive, which stores whole `RPG_Skill` objects
* in `_j._passive._passiveSources` rather than the ids they were looked up by. That is a
* reference-versus-value defect and is tracked as one - a rebalanced skill never reaches a save that
* already captured a copy of it - but the encoder still has to be able to write what the codebase
* actually puts in front of it, so the type is registered.
*
* Registering it drags in the two types a skill row holds instances of: its damage block, and one
* effect object per entry in `effects`. Both are declared below.
*
* The seed copies a blank row rather than restating three classes' worth of class-field defaults,
* which keeps the defaults following the constructor chain instead of a transcription of it.
*/
SerializableRegistry.register(RPG_Skill, {
	id: "rpg-skill",
	aliases: ["RPG_Skill"],
	typed: {
		damage: RPG_SkillDamage,
		effects: RPG_UsableEffect
	},
	seed: (instance) => Object.assign(instance, RPG_Skill.createEmpty(0))
});
/**
* The damage block of a usable row. Its constructor tolerates being handed nothing and falls back to
* its class-field defaults, so a blank instance is exactly the set of defaults the seed wants.
*/
SerializableRegistry.register(RPG_SkillDamage, {
	id: "rpg-skill-damage",
	aliases: ["RPG_SkillDamage"],
	seed: (instance) => Object.assign(instance, new RPG_SkillDamage())
});
/**
* One entry from a usable row's effects list. Unlike the damage block, this constructor reads its
* argument unconditionally, so the defaults are spelled out rather than copied off a blank instance.
*/
SerializableRegistry.register(RPG_UsableEffect, {
	id: "rpg-usable-effect",
	aliases: ["RPG_UsableEffect"],
	seed: (instance) => {
		instance.code = 0;
		instance.dataId = 0;
		instance.value1 = 0;
		instance.value2 = 0;
	}
});

//#endregion
//#region src/plugins/_base/core/models/WindowCommandBuilder.js
/**
* A builder class for constructing {@link BuiltWindowCommand}.<br>
*/
var WindowCommandBuilder = class {
	/**
	* The name of the command.
	* This is what visibly shows up in the list of commands.
	* @type {string}
	*/
	#name = String.empty;
	/**
	* Additional lines of text to render below the main command name.
	* @type {string[]}
	*/
	#lines = [];
	/**
	* Whether or not the additional lines are actually subtext.<br/>
	* Additional lines are classified as subtext by default.
	* @type {boolean}
	*/
	#isSubtext = true;
	/**
	* The text that will be right-aligned for this command.
	* @type {string}
	*/
	#rightText = String.empty;
	/**
	* The text color index the right text of this command will be rendered with.
	* @type {number}
	*/
	#rightColorIndex = 0;
	/**
	* The symbol of this command.
	* This is normally invisible and used for connecting this command
	* to an event hook for logical processing.
	* @type {string}
	*/
	#key = String.empty;
	/**
	* Whether or not this command is enabled.
	* @type {boolean}
	*/
	#enabled = true;
	/**
	* The underlying data associated with this command.
	* Usually populated with whatever this command represents data-wise.
	* @type {null|any}
	*/
	#extensionData = null;
	/**
	* Any special help text associated with this command.
	* @type {string}
	*/
	#helpText = String.empty;
	/**
	* The index of the icon that will be rendered on the left side of this command.
	* @type {number}
	*/
	#iconIndex = 0;
	/**
	* The text color index this command will be rendered with.
	* @type {number}
	*/
	#colorIndex = 0;
	/**
	* The filename of the face image associated with this log.
	* @type {string|String.empty}
	*/
	#faceName = String.empty;
	/**
	* The index of the face image associated with this log.
	* @type {number}
	*/
	#faceIndex = -1;
	/**
	* The menu section this command belongs to.
	* @type {string}
	*/
	#menuSection = MenuSection.Party;
	/**
	* Start by defining the name, and chain additional setter methods to
	* build out this window command.
	* @param {string} name The name of the command.
	*/
	constructor(name) {
		this.setName(name);
	}
	/**
	* Builds a {@link BuiltWindowCommand} based on the current state of this builder.
	* @returns {BuiltWindowCommand}
	*/
	build() {
		const command = new BuiltWindowCommand(this.#name, this.#key, this.#enabled, this.#extensionData, this.#iconIndex, this.#colorIndex, this.#rightText, this.#rightColorIndex, this.#lines, this.#helpText, this.#isSubtext, [this.#faceName, this.#faceIndex]);
		command.menuSection = this.#menuSection;
		return command;
	}
	/**
	* Sets the name of this command.
	* @param {string} name The name of this command.
	* @returns {this} This builder for fluent-building.
	*/
	setName(name) {
		this.#name = name;
		return this;
	}
	/**
	* Adds a single line of subtext to this command.
	* @param {string} line The line of subtext to add.
	* @returns {this} This builder for fluent-building.
	*/
	addTextLine(line) {
		this.#lines.push(line);
		return this;
	}
	/**
	* Adds multiple lines of subtext to this command.
	* @param {string[]} lines The lines of subtext to add.
	* @returns {this} This builder for fluent-building.
	*/
	addTextLines(lines) {
		this.#lines.push(...lines);
		return this;
	}
	/**
	* Sets the subtext to be the given lines.
	* @param {string[]} lines The lines of subtext to set.
	* @returns {this} This builder for fluent-building.
	*/
	setTextLines(lines) {
		this.#lines = lines;
		return this;
	}
	/**
	* Sets this command to identify its additional lines as a multiline command rather than subtext.
	* @returns {WindowCommandBuilder}
	*/
	flagAsMultiline() {
		this.#isSubtext = false;
		return this;
	}
	/**
	* Sets this command to identify its additional lines as subtext rather than a multiline command.
	* @returns {WindowCommandBuilder}
	*/
	flagAsSubText() {
		this.#isSubtext = true;
		return this;
	}
	/**
	* Sets the right-aligned text of this command.
	* @param {string} rightText The right-text of this command.
	* @returns {this} This builder for fluent-building.
	*/
	setRightText(rightText) {
		this.#rightText = rightText;
		return this;
	}
	/**
	* Sets the color index of the right-aligned text of this command.
	* @param {number} rightColorIndex The color index for the right-text of this command.
	* @returns {this} This builder for fluent-building.
	*/
	setRightColorIndex(rightColorIndex) {
		this.#rightColorIndex = rightColorIndex;
		return this;
	}
	/**
	* Sets the key (symbol) of this command.
	* @param {string} symbol The key of this command.
	* @returns {this} This builder for fluent-building.
	*/
	setSymbol(symbol) {
		this.#key = symbol;
		return this;
	}
	/**
	* Sets whether or not this command is enabled.
	* @param {boolean} enabled Whether or not this command is enabled.
	* @returns {this} This builder for fluent-building.
	*/
	setEnabled(enabled) {
		this.#enabled = enabled;
		return this;
	}
	/**
	* Sets the underlying extension data for this command.
	* @param {any} ext The underlying extension data for this command.
	* @returns {this} This builder for fluent-building.
	*/
	setExtensionData(ext) {
		this.#extensionData = ext;
		return this;
	}
	/**
	* Sets the icon index for this command.
	* @param {number} iconIndex The index of the icon for this command.
	* @returns {this} This builder for fluent-building.
	*/
	setIconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	/**
	* Sets the color index for this command.
	* @param {number} colorIndex The index of the color for this command.
	* @returns {this} This builder for fluent-building.
	*/
	setColorIndex(colorIndex) {
		this.#colorIndex = colorIndex;
		return this;
	}
	/**
	* Sets the help text for this command.
	* @param {string} helpText The help text.
	* @returns {this} This builder for fluent-building.
	*/
	setHelpText(helpText) {
		this.#helpText = helpText;
		return this;
	}
	/**
	* Sets the filename of the face associated with this command.
	* @param {string} faceName The filename containing the face.
	* @returns {this} This builder for fluent-building.
	*/
	setFaceName(faceName) {
		this.#faceName = faceName;
		return this;
	}
	/**
	* Sets the index of the face on the face sheet associated with this command.
	* @param {number} faceIndex The index on the face sheet aligning to the face.
	* @returns {this} This builder for fluent-building.
	*/
	setFaceIndex(faceIndex) {
		this.#faceIndex = faceIndex;
		return this;
	}
	/**
	* Sets the menu section this command belongs to, for menus that split commands into columns.
	*
	* Commands that never call this default to {@link MenuSection.Party}, which is what allows menus to
	* be split without every existing command in the ecosystem having to be updated first.
	* @param {string} menuSection One of {@link MenuSection}.
	* @returns {this} This builder for fluent-building.
	*/
	setMenuSection(menuSection) {
		this.#menuSection = menuSection;
		return this;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/BattleManager.js
/**
* Gets the rewards accrued from the battle currently being resolved.
* @returns {{exp: number, gold: number, items: RPG_BaseItem[]}} The battle rewards.
*/
BattleManager.rewards = function() {
	return this._rewards;
};
/**
* Sets the rewards accrued from the battle currently being resolved.
* @param {{exp: number, gold: number, items: RPG_BaseItem[]}} newRewards The rewards bundle.
*/
BattleManager.setRewards = function(newRewards) {
	this._rewards = newRewards;
};

//#endregion
//#region src/plugins/_base/core/models/SdpParameterBinding.js
/**
* Describes how SDP panel rank bonuses attach to a {@link ParameterDefinition}.
*/
var SdpParameterBinding = class SdpParameterBinding {
	/**
	* @param {function(Game_Actor, number): number} getPanelBonus The get panel bonus driving this step.
	* @param {function(Game_Actor): number=} getBaseForSdp The get base for sdp driving this step.
	*/
	constructor(getPanelBonus, getBaseForSdp = undefined) {
		/**
		* Returns the bonus amount SDP panels contribute for this parameter.
		* @type {function(Game_Actor, number): number}
		*/
		this.getPanelBonus = getPanelBonus;
		/**
		* Optional base used when calculating percent-based panel growth.
		* @type {function(Game_Actor): number|undefined}
		*/
		this.getBaseForSdp = getBaseForSdp;
	}
	/**
	* Panel bonuses are not applied through the registry for this parameter.
	* @returns {SdpParameterBinding}
	*/
	static none() {
		return new SdpParameterBinding((_actor, _base) => 0);
	}
	/**
	* SDP bonus resolves panel entries by registry key.
	* @param {string} parameterKey The parameter key driving this step.
	* @param {function(Game_Actor): number=} getBaseForSdp The get base for sdp driving this step.
	* @returns {SdpParameterBinding}
	*/
	static byKey(parameterKey, getBaseForSdp = undefined) {
		return new SdpParameterBinding((actor, base) => {
			if (!J.SDP) return 0;
			return actor.getSdpBonusForParameterKey(parameterKey, base);
		}, getBaseForSdp);
	}
	/**
	* SDP bonus follows the core b-param hook path.
	* @param {number} paramId The param id driving this step.
	* @returns {SdpParameterBinding}
	*/
	static bparam(paramId) {
		const parameterKey = ParameterKeys.bparamKey(paramId);
		return SdpParameterBinding.byKey(parameterKey);
	}
	/**
	* SDP bonus follows the ex-param hook path.
	* @param {number} xparamId The xparam id driving this step.
	* @returns {SdpParameterBinding}
	*/
	static xparam(xparamId) {
		return new SdpParameterBinding((actor, base) => {
			if (!J.SDP) return 0;
			return actor.getSdpBonusForNonCoreParam(xparamId, base, 8);
		});
	}
	/**
	* SDP bonus follows the sp-param hook path.
	* @param {number} sparamId The sparam id driving this step.
	* @returns {SdpParameterBinding}
	*/
	static sparam(sparamId) {
		return new SdpParameterBinding((actor, base) => {
			if (!J.SDP) return 0;
			return actor.getSdpBonusForNonCoreParam(sparamId, base, 18);
		});
	}
	/**
	* Owner-defined SDP bonus logic (CDM, LST, SDR, etc.).
	* @param {function(Game_Actor, number): number} getPanelBonus The get panel bonus driving this step.
	* @param {function(Game_Actor): number=} getBaseForSdp The get base for sdp driving this step.
	* @returns {SdpParameterBinding}
	*/
	static custom(getPanelBonus, getBaseForSdp = undefined) {
		return new SdpParameterBinding(getPanelBonus, getBaseForSdp);
	}
};

//#endregion
//#region src/plugins/_base/core/models/ParameterDefinitionBuilder.js
/**
* Fluent builder for {@link ParameterDefinition}.
*/
var ParameterDefinitionBuilder = class {
	#key = String.empty;
	#group = String.empty;
	#sortOrder = 0;
	#label = () => String.empty;
	#description = () => [String.empty];
	#iconIndex = () => 0;
	#colorIndex = () => 0;
	#format = ParameterFormat.FLAT;
	#displayPolicy = ParameterDisplayPolicy.NONE;
	#getValue = (_battler) => 0;
	#sdpBinding = SdpParameterBinding.none();
	/**
	* @param {string} key The key driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	key(key) {
		this.#key = key;
		return this;
	}
	/**
	* @param {string} group The group driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	group(group) {
		this.#group = group;
		return this;
	}
	/**
	* @param {number} sortOrder The sort order driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	sortOrder(sortOrder) {
		this.#sortOrder = sortOrder;
		return this;
	}
	/**
	* @param {function(): string} label The label driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	label(label) {
		this.#label = label;
		return this;
	}
	/**
	* @param {function(): string[]} description The description driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	description(description) {
		this.#description = description;
		return this;
	}
	/**
	* @param {function(): number} iconIndex The icon index driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	iconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	/**
	* @param {function(): number} colorIndex The color index driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	colorIndex(colorIndex) {
		this.#colorIndex = colorIndex;
		return this;
	}
	/**
	* @param {string} format The format driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	format(format) {
		this.#format = format;
		return this;
	}
	/**
	* @param {string} displayPolicy The display policy driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	displayPolicy(displayPolicy) {
		this.#displayPolicy = displayPolicy;
		return this;
	}
	/**
	* @param {function(Game_Battler): number} getValue The get value driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	getValue(getValue) {
		this.#getValue = getValue;
		return this;
	}
	/**
	* @param {SdpParameterBinding} sdpBinding The sdp binding driving this step.
	* @returns {ParameterDefinitionBuilder}
	*/
	sdpBinding(sdpBinding) {
		this.#sdpBinding = sdpBinding;
		return this;
	}
	/**
	* @returns {ParameterDefinition}
	*/
	build() {
		return new ParameterDefinition(this.#key, this.#group, this.#sortOrder, this.#label, this.#description, this.#iconIndex, this.#colorIndex, this.#format, this.#displayPolicy, this.#getValue, this.#sdpBinding);
	}
};

//#endregion
//#region src/plugins/_base/core/models/ParameterDefinition.js
/**
* Immutable catalog entry for a battler parameter.
*/
var ParameterDefinition = class ParameterDefinition {
	/**
	* @param {string} key The registry key for this parameter.
	* @param {string} group The display group this parameter belongs to.
	* @param {number} sortOrder The sort order within the group.
	* @param {function(): string} label Getter that returns the display label.
	* @param {function(): string[]} description Getter that returns the description lines.
	* @param {function(): number} iconIndex Getter that returns the icon index.
	* @param {function(): number} colorIndex Getter that returns the base color index.
	* @param {string} format The display format constant from ParameterFormat.
	* @param {string} displayPolicy The display policy constant from ParameterDisplayPolicy.
	* @param {function(Game_Battler): number} getValue Live-value resolver for a battler.
	* @param {SdpParameterBinding} sdpBinding The SDP panel binding for this parameter.
	*/
	constructor(key, group, sortOrder, label, description, iconIndex, colorIndex, format, displayPolicy, getValue, sdpBinding) {
		this.key = key;
		this.group = group;
		this.sortOrder = sortOrder;
		this.label = label;
		this.description = description;
		this.iconIndex = iconIndex;
		this.colorIndex = colorIndex;
		this.format = format;
		this.displayPolicy = displayPolicy;
		this.getValue = getValue;
		this.sdpBinding = sdpBinding;
	}
	/**
	* Resolves the live value for the given battler.
	* @param {Game_Battler} battler The battler driving this step.
	* @returns {number}
	*/
	resolveValue(battler) {
		return this.getValue(battler);
	}
	/**
	* Pads a signed magnitude for styled numeric display, optionally reserving a sign column so
	* signed and unsigned rows align when drawn next to each other.
	* @param {number} num The rounded display magnitude.
	* @param {number} digits Minimum digit width after padding.
	* @param {boolean=} reserveSignColumn When true, zero uses a leading space so values align with signed rows.
	* @param {boolean=} showPlusForPositive When true, positive values render with a leading {@code +}.
	* @returns {string}
	*/
	static padSignedMagnitude(num, digits, reserveSignColumn = false, showPlusForPositive = false) {
		const rounded = Math.round(num);
		const padded = Math.abs(rounded).padZero(digits);
		if (rounded < 0) {
			return `-${padded}`;
		}
		if (showPlusForPositive && rounded > 0) {
			return `+${padded}`;
		}
		if (reserveSignColumn && rounded === 0) {
			return ` ${padded}`;
		}
		return padded;
	}
	/**
	* Transforms a raw battler value into the numeric magnitude shown in the UI.
	* Percent and regen formats are multiplied by 100; centered formats also subtract 100 for the delta.
	* @param {number} value The raw battler value.
	* @returns {number}
	*/
	displayMagnitude(value) {
		let num = value;
		if (this.format === ParameterFormat.PERCENT || this.format === ParameterFormat.PERCENT_CENTERED || this.format === ParameterFormat.PERCENT_SUFFIX || this.format === ParameterFormat.MULTIPLIER_PERCENT || this.format === ParameterFormat.SCALED_POINTS || this.format === ParameterFormat.SCALED_OFFSET || this.format === ParameterFormat.REGEN_PER_SECOND) {
			num *= 100;
		}
		if (this.format === ParameterFormat.PERCENT_CENTERED || this.format === ParameterFormat.SCALED_OFFSET) {
			num -= 100;
		}
		return num;
	}
	/**
	* Whether this parameter reserves a sign column when padded on the status screen.
	* Rate-based display policies all use a sign column so values align visually.
	* @returns {boolean}
	*/
	usesSignColumn() {
		return this.displayPolicy === ParameterDisplayPolicy.COST_RATE || this.displayPolicy === ParameterDisplayPolicy.DAMAGE_RATE || this.displayPolicy === ParameterDisplayPolicy.REWARD_RATE || this.displayPolicy === ParameterDisplayPolicy.SIGNED;
	}
	/**
	* Whether positive magnitudes should show a leading plus in the sign column.
	* Reward-rate and signed policies use the plus to make gains visually distinct.
	* @returns {boolean}
	*/
	usesPlusOnPositive() {
		return this.displayPolicy === ParameterDisplayPolicy.COST_RATE || this.displayPolicy === ParameterDisplayPolicy.REWARD_RATE || this.displayPolicy === ParameterDisplayPolicy.SIGNED;
	}
	/**
	* Whether display magnitude should be clamped at {@code -100%} before formatting.
	* Clamping applies to any policy that uses a sign column.
	* @returns {boolean}
	*/
	clampsDisplayAtMinus100() {
		return this.usesSignColumn();
	}
	/**
	* Clamps the UI magnitude according to this definition's display policy.
	* Rate-based policies cannot go below -100 (100% reduction = floor).
	* @param {number} num The unclamped display magnitude.
	* @returns {number}
	*/
	clampDisplayMagnitude(num) {
		if (this.clampsDisplayAtMinus100()) {
			return Math.max(num, -100);
		}
		return num;
	}
	/**
	* Resolves a fixed sentinel label when a rate hits its display floor (-100%).
	* Returns {@code null} when the value is above the floor and no sentinel applies.
	* @param {number} value The raw battler value to evaluate.
	* @returns {string|null}
	*/
	resolveDisplaySentinel(value) {
		const num = this.displayMagnitude(value);
		if (num > -100) {
			return null;
		}
		if (this.displayPolicy === ParameterDisplayPolicy.COST_RATE) {
			return ParameterDisplaySentinel.FREE;
		}
		if (this.displayPolicy === ParameterDisplayPolicy.DAMAGE_RATE) {
			return ParameterDisplaySentinel.IMMUNE;
		}
		if (this.displayPolicy === ParameterDisplayPolicy.REWARD_RATE || this.displayPolicy === ParameterDisplayPolicy.SIGNED) {
			return ParameterDisplaySentinel.NONE;
		}
		return null;
	}
	/**
	* Whether an increase in this parameter's raw value is beneficial to the battler. Cost-reduction
	* and damage-intake policies are inverted from the common case — lower is better — so a decrease
	* there should read as a positive change (green), not a negative one (red). Every other policy
	* (including the ambiguous/neutral ones) defaults to the common "higher is better" reading.
	* @returns {boolean}
	*/
	isIncreaseBeneficial() {
		return this.displayPolicy !== ParameterDisplayPolicy.DAMAGE_RATE && this.displayPolicy !== ParameterDisplayPolicy.COST_RATE;
	}
	/**
	* Resolves the text color index for a live value on the status screen.
	* Sentinel states and rate-direction policies each map to distinct palette entries.
	* @param {number} value The raw battler value to evaluate.
	* @returns {number}
	*/
	resolveDisplayColorIndex(value) {
		const sentinel = this.resolveDisplaySentinel(value);
		if (sentinel === ParameterDisplaySentinel.FREE) {
			return 3;
		}
		if (sentinel === ParameterDisplaySentinel.IMMUNE) {
			return 7;
		}
		if (sentinel === ParameterDisplaySentinel.NONE) {
			return 10;
		}
		const num = this.clampDisplayMagnitude(this.displayMagnitude(value));
		if (this.displayPolicy === ParameterDisplayPolicy.DAMAGE_RATE || this.displayPolicy === ParameterDisplayPolicy.COST_RATE) {
			if (num < 0) {
				return 3;
			}
			if (num > 0) {
				return 10;
			}
			return 0;
		}
		if (this.displayPolicy === ParameterDisplayPolicy.REWARD_RATE) {
			if (num > 0) {
				return 3;
			}
			if (num < 0) {
				return 10;
			}
			return 0;
		}
		return this.colorIndex();
	}
	/**
	* Formats a numeric value for UI display, applying sentinel labels, regen formatting,
	* padding, and percent suffixes as dictated by the format and display policy.
	* @param {number} value The raw battler value to format.
	* @param {boolean=} withPadding True to apply zero-padding for styled stat columns; defaults to false.
	* @param {Game_Battler=} actor The battler whose tick cadence resolves REGEN_PER_SECOND's
	* conversion. Optional so `_base` stays decoupled from J-ABS; when omitted (or J-ABS isn't
	* loaded), falls back to a neutral 1 tick/sec assumption rather than crashing.
	* @returns {string}
	*/
	prettyValue(value, withPadding = false, actor = null) {
		const sentinel = this.resolveDisplaySentinel(value);
		if (sentinel) {
			return sentinel;
		}
		const num = this.clampDisplayMagnitude(this.displayMagnitude(value));
		if (this.format === ParameterFormat.REGEN_PER_SECOND) {
			const ticksPerSecond = actor && actor.getNaturalRegenTickInterval ? 60 / actor.getNaturalRegenTickInterval() : 1;
			const perSecond = num * ticksPerSecond;
			return `${perSecond.toFixed(1)}/s`;
		}
		let base = Number.isInteger(num) ? num.toString() : num.toFixed(1);
		if (base.endsWith(".0")) {
			base = base.slice(0, base.length - 2);
		}
		if (withPadding) {
			base = this.applyPaddedDisplay(base, num);
		}
		if (this.format === ParameterFormat.PERCENT_SUFFIX || this.format === ParameterFormat.PERCENT_CENTERED || this.format === ParameterFormat.MULTIPLIER_PERCENT || this.format === ParameterFormat.PERCENT) {
			base = `${base}%`;
		}
		return base;
	}
	/**
	* Formats a raw delta (the difference between two raw battler values for this parameter) as a
	* signed string using the same scale/unit conventions as {@link #prettyValue} — but deliberately
	* skipping two things that only make sense for an absolute value, not a difference of two:
	* - The PERCENT_CENTERED/SCALED_OFFSET baseline subtraction {@link #displayMagnitude} applies.
	*   That constant cancels out of any difference of two absolute values on its own; re-applying it
	*   here would corrupt the delta instead of correctly reproducing it.
	* - Sentinel labels (FREE/IMMUNE/NONE). Those describe an absolute state a value has clamped
	*   into, which a delta never represents.
	* @param {number} rawDiff The raw difference between the projected and current values.
	* @param {Game_Battler=} actor The battler whose tick cadence resolves REGEN_PER_SECOND's
	* conversion, same as {@link #prettyValue}.
	* @returns {string}
	*/
	prettyDelta(rawDiff, actor = null) {
		const isPercentScaled = this.format === ParameterFormat.PERCENT || this.format === ParameterFormat.PERCENT_CENTERED || this.format === ParameterFormat.PERCENT_SUFFIX || this.format === ParameterFormat.MULTIPLIER_PERCENT || this.format === ParameterFormat.SCALED_POINTS || this.format === ParameterFormat.SCALED_OFFSET || this.format === ParameterFormat.REGEN_PER_SECOND;
		const num = isPercentScaled ? rawDiff * 100 : rawDiff;
		if (this.format === ParameterFormat.REGEN_PER_SECOND) {
			const ticksPerSecond = actor && actor.getNaturalRegenTickInterval ? 60 / actor.getNaturalRegenTickInterval() : 1;
			const perSecond = num * ticksPerSecond;
			return perSecond >= 0 ? `+${perSecond.toFixed(1)}` : perSecond.toFixed(1);
		}
		let base = Number.isInteger(num) ? num.toString() : num.toFixed(1);
		if (base.endsWith(".0")) {
			base = base.slice(0, base.length - 2);
		}
		if (num >= 0) {
			base = `+${base}`;
		}
		if (this.format === ParameterFormat.PERCENT_SUFFIX || this.format === ParameterFormat.PERCENT_CENTERED || this.format === ParameterFormat.MULTIPLIER_PERCENT || this.format === ParameterFormat.PERCENT) {
			base = `${base}%`;
		}
		return base;
	}
	/**
	* Applies zero-padding rules for styled stat values on the status screen.
	* Each format family has its own digit width and sign-column rules.
	* @param {string} base The un-padded display string.
	* @param {number} num The transformed numeric magnitude used for padding decisions.
	* @returns {string}
	*/
	applyPaddedDisplay(base, num) {
		if (this.format === ParameterFormat.FLAT_LARGE) {
			return String(base).padZero(6);
		}
		if (this.format === ParameterFormat.FLAT || this.format === ParameterFormat.SCALED_POINTS || this.format === ParameterFormat.SCALED_OFFSET) {
			return ParameterDefinition.padSignedMagnitude(num, 4, false, false);
		}
		if (this.format === ParameterFormat.PERCENT_CENTERED) {
			return ParameterDefinition.padSignedMagnitude(num, 3, this.usesSignColumn(), this.usesPlusOnPositive());
		}
		if (this.format === ParameterFormat.PERCENT || this.format === ParameterFormat.PERCENT_SUFFIX || this.format === ParameterFormat.MULTIPLIER_PERCENT) {
			if (this.usesSignColumn()) {
				return ParameterDefinition.padSignedMagnitude(num, 3, true, this.usesPlusOnPositive());
			}
			return Math.abs(Math.round(num)).padZero(3);
		}
		return base;
	}
};
ParameterDefinition.Builder = () => new ParameterDefinitionBuilder();

//#endregion
//#region src/plugins/_base/core/core/ParameterRegistry.js
/**
* Central registry of {@link ParameterDefinition} entries keyed by string id.
*/
var ParameterRegistry = class {
	/**
	* Gets the definitions.
	* @returns {Map<string, ParameterDefinition>} The definitions.
	*/
	static definitions() {
		return this._definitions;
	}
	/**
	* Gets the group cache.
	* @returns {Map<string, ParameterDefinition[]>} The groupCache.
	*/
	static groupCache() {
		return this._groupCache;
	}
	/**
	* @type {Map<string, ParameterDefinition>}
	*/
	static _definitions = new Map();
	/**
	* @type {Map<string, ParameterDefinition[]>}
	*/
	static _groupCache = new Map();
	/**
	* Registers a parameter definition. Duplicate keys throw.
	* @param {ParameterDefinition} definition The definition driving this step.
	*/
	static register(definition) {
		if (!(definition instanceof ParameterDefinition)) {
			throw new Error("ParameterRegistry.register requires a ParameterDefinition instance.");
		}
		if (this.definitions().has(definition.key)) {
			throw new Error(`ParameterRegistry: duplicate key "${definition.key}".`);
		}
		this.definitions().set(definition.key, definition);
		this.groupCache().clear();
	}
	/**
	* @param {string} key The key driving this step.
	* @returns {ParameterDefinition|null}
	*/
	static get(key) {
		if (this.definitions().has(key)) {
			return this.definitions().get(key);
		}
		return null;
	}
	/**
	* @param {string} key The key driving this step.
	* @returns {boolean}
	*/
	static has(key) {
		return this.definitions().has(key);
	}
	/**
	* @returns {ParameterDefinition[]}
	*/
	static all() {
		return [...this.definitions().values()];
	}
	/**
	* @param {string} group The group driving this step.
	* @returns {ParameterDefinition[]}
	*/
	static byGroup(group) {
		if (this.groupCache().has(group)) {
			return this.groupCache().get(group);
		}
		const definitions = this.all().filter((definition) => definition.group === group).sort((left, right) => left.sortOrder - right.sortOrder);
		this.groupCache().set(group, definitions);
		return definitions;
	}
	/**
	* Resolves a live battler value for the given parameter key.
	* @param {Game_Battler} battler The battler driving this step.
	* @param {string} key The key driving this step.
	* @returns {number}
	*/
	static resolveValue(battler, key) {
		const definition = this.get(key);
		if (!definition) return 0;
		return definition.resolveValue(battler);
	}
	/**
	* Resolves SDP panel bonus for the given key.
	* @param {Game_Actor} actor The actor driving this step.
	* @param {string} key The key driving this step.
	* @returns {number}
	*/
	static resolveSdpPanelBonus(actor, key) {
		const definition = this.get(key);
		if (!definition) return 0;
		const base = definition.sdpBinding.getBaseForSdp ? definition.sdpBinding.getBaseForSdp(actor) : definition.resolveValue(actor);
		return definition.sdpBinding.getPanelBonus(actor, base);
	}
};

//#endregion
//#region src/plugins/_base/core/managers/ColorManager.js
/**
* Gets the color index for a catalog parameter key.
* @param {string} parameterKey The registry key.
* @returns {number}
*/
ColorManager.parameterColor = function(parameterKey) {
	const definition = ParameterRegistry.get(parameterKey);
	if (!definition) {
		return 0;
	}
	return definition.colorIndex();
};
/**
* Gets the windowskin text palette color for a given element (same sampling path as {@link ColorManager.textColor}).
* @param {number} elementId The element id to get a color for.
* @returns {string} Hex color string from the windowskin palette (see {@link Bitmap#getPixel}).
*/
ColorManager.elementColorHexcode = function(elementId) {
	switch (elementId) {
		case -1: return this.textColor(0);
		case 0: return this.textColor(17);
		case 1: return this.textColor(7);
		case 2: return this.textColor(8);
		case 3: return this.textColor(25);
		case 4: return this.textColor(18);
		case 5: return this.textColor(23);
		case 6: return this.textColor(8);
		case 7: return this.textColor(25);
		case 8: return this.textColor(6);
		case 9: return this.textColor(26);
		case 10: return this.textColor(0);
		case 11: return this.textColor(2);
		case 12: return this.textColor(2);
		case 13: return this.textColor(2);
		case 14: return this.textColor(2);
		case 15: return this.textColor(2);
		case 16: return this.textColor(2);
		case 17: return this.textColor(2);
		case 18: return this.textColor(2);
		case 19: return this.textColor(2);
		case 20: return this.textColor(2);
		case 21: return this.textColor(27);
		case 22: return this.textColor(27);
		case 23: return this.textColor(27);
		case 24: return this.textColor(27);
		case 25: return this.textColor(20);
		case 26: return this.textColor(20);
		case 27: return this.textColor(20);
		case 28: return this.textColor(20);
		default: return this.textColor(0);
	}
};
/**
* Gets the color index for a given element.
* @param {number} elementId The element id to get a color for.
* @returns {number} The color index of the given element.
*/
ColorManager.elementColorIndex = function(elementId) {
	switch (elementId) {
		case -1: return 0;
		case 0: return 17;
		case 1: return 7;
		case 2: return 8;
		case 3: return 25;
		case 4: return 18;
		case 5: return 23;
		case 6: return 8;
		case 7: return 25;
		case 8: return 6;
		case 9: return 26;
		case 10: return 0;
		case 11: return 2;
		case 12: return 2;
		case 13: return 2;
		case 14: return 2;
		case 15: return 2;
		case 16: return 2;
		case 17: return 2;
		case 18: return 2;
		case 19: return 2;
		case 20: return 2;
		case 21: return 27;
		case 22: return 27;
		case 23: return 27;
		case 24: return 27;
		case 25: return 20;
		case 26: return 20;
		case 27: return 20;
		case 28: return 20;
		default: return 0;
	}
};
/**
* Gets the windowskin text palette color for the given skill type.
* @param {number} skillTypeId The id to get the color for.
* @returns {string} Hex color string from the windowskin palette.
*/
ColorManager.skillType = function(skillTypeId) {
	return this.textColor(1);
};
/**
* Gets the windowskin text palette color for the given weapon type.
* @param {number} weaponTypeId The id to get the color for.
* @returns {string} Hex color string from the windowskin palette.
*/
ColorManager.weaponType = function(weaponTypeId) {
	return this.textColor(2);
};
/**
* Gets the windowskin text palette color for the given armor type.
* @param {number} armorTypeId The id to get the color for.
* @returns {string} Hex color string from the windowskin palette.
*/
ColorManager.armorType = function(armorTypeId) {
	return this.textColor(3);
};
/**
* Gets the windowskin text palette color for the given equip type.
* @param {number} equipTypeId The id to get the color for.
* @returns {string} Hex color string from the windowskin palette.
*/
ColorManager.equipType = function(equipTypeId) {
	return this.textColor(4);
};
/**
* Gets the windowskin text palette color for the given SDP rarity band.
* @param {string} rarity The key to get the panel for.
* @returns {string} Hex color string from the windowskin palette.
*/
ColorManager.sdp = function(rarity) {
	const rarityColorIndex = PanelRarity.fromRarityToColor(rarity);
	return this.textColor(rarityColorIndex);
};
/**
* True when {@code colorHex} looks like {@code #RGB} or {@code #RRGGBB} (case-insensitive), including white.
* @param {string} colorHex Candidate hex string.
* @returns {boolean}
*/
ColorManager.isValidHexColor = function(colorHex) {
	if (!colorHex) {
		return false;
	}
	const structure = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	return structure.test(colorHex.trim());
};
/**
* Parses {@code #RGB} or {@code #RRGGBB} into RGB components.
* @param {string} hexString Source color.
* @returns {{r:number,g:number,b:number}|null}
*/
ColorManager.parseHexStringToRgb = function(hexString) {
	if (!hexString) {
		return null;
	}
	let h = hexString.trim();
	if (h.startsWith("#") === false) {
		return null;
	}
	h = h.slice(1);
	if (h.length === 3) {
		h = h.split("").map((ch) => {
			return ch + ch;
		}).join("");
	}
	if (h.length !== 6) {
		return null;
	}
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
		return null;
	}
	return {
		r,
		g,
		b
	};
};
/**
* Squared Euclidean distance between two RGB triples (fast compare without sqrt).
* @param {{r:number,g:number,b:number}} a First color.
* @param {{r:number,g:number,b:number}} b Second color.
* @returns {number}
*/
ColorManager.rgbDistanceSquared = function(a, b) {
	const dr = a.r - b.r;
	const dg = a.g - b.g;
	const db = a.b - b.b;
	return dr * dr + dg * dg + db * db;
};
/**
* Picks the windowskin text palette index whose {@link ColorManager.textColor} sample is closest to {@code hexString}.
* Pure white ({@code #fff} / {@code #ffffff}) returns {@code null} so callers can skip redundant {@code \\C[n]} wraps.
* @param {string} hexString Candidate {@code #RGB} / {@code #RRGGBB}.
* @returns {number|null} Palette index, or {@code null} when invalid or white.
*/
ColorManager.colorIndexFromHex = function(hexString) {
	if (ColorManager.isValidHexColor(hexString) === false) {
		return null;
	}
	const lower = hexString.trim().toLowerCase();
	if (lower === "#ffffff" || lower === "#fff") {
		return null;
	}
	const targetRgb = ColorManager.parseHexStringToRgb(hexString);
	let bestIndex = 0;
	let bestDist = Infinity;
	for (let i = 0; i < 32; i++) {
		const sample = ColorManager.textColor(i);
		const sampleRgb = ColorManager.parseHexStringToRgb(sample);
		if (sampleRgb === null) {
			continue;
		}
		const d = ColorManager.rgbDistanceSquared(targetRgb, sampleRgb);
		if (d < bestDist) {
			bestDist = d;
			bestIndex = i;
		}
	}
	return bestIndex;
};

//#endregion
//#region src/plugins/_base/core/managers/IconManager.js
/**
* A static class that manages the icon to X correlation, such as stats and elements.
* IconManager is a J-Base global — not part of the RMMZ engine (unlike TextManager).
*/
var IconManager = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("The IconManager is a static class.");
	}
	/**
	* Gets the iconIndex for levels.
	* @returns {number}
	*/
	static level() {
		return 86;
	}
	/**
	* Gets the `iconIndex` for max tp.
	* @returns {number} The `iconIndex`.
	*/
	static maxTp() {
		return 930;
	}
	/**
	* Gets the `iconIndex` for HAR (Healing Rate).
	* @returns {number} The `iconIndex`.
	*/
	static har() {
		return 7;
	}
	/**
	* Gets the iconIndex for a given reward parameter.<br>
	* Reward Param mapping:<br>
	* <pre>
	* - 0: experience
	* - 1: gold/currency
	* - 2: drops or drop rate
	* - 3: encounters or encounter rate
	* - 4: SDP
	* </pre>
	* @param {number} paramId The param id to get the icon index for.
	* @returns {number}
	*/
	static rewardParam(paramId) {
		switch (paramId) {
			case 0: return 87;
			case 1: return 2048;
			case 2: return 208;
			case 3: return 914;
			case 4: return 445;
		}
	}
	/**
	* Gets the corresponding `iconIndex` for the param.
	* @param {number} paramId The id of the param.
	* @returns {number} The `iconIndex`.
	*/
	static param(paramId) {
		switch (paramId) {
			case 0: return 928;
			case 1: return 929;
			case 2: return 931;
			case 3: return 932;
			case 4: return 933;
			case 5: return 934;
			case 6: return 935;
			case 7: return 936;
		}
	}
	/**
	* Gets the corresponding `iconIndex` for the x-param.
	* @param {number} paramId The id of the param.
	* @returns {number} The `iconIndex`.
	*/
	static xparam(paramId) {
		switch (paramId) {
			case 0: return 944;
			case 1: return 945;
			case 2: return 946;
			case 3: return 947;
			case 4: return 948;
			case 5: return 949;
			case 6: return 950;
			case 7: return 951;
			case 8: return 952;
			case 9: return 953;
		}
	}
	/**
	* Gets the corresponding `iconIndex` for the s-param.
	* @param {number} paramId The id of the param.
	* @returns {number} The `iconIndex`.
	*/
	static sparam(paramId) {
		switch (paramId) {
			case 0: return 960;
			case 1: return 961;
			case 2: return 962;
			case 3: return 963;
			case 4: return 964;
			case 5: return 965;
			case 6: return 966;
			case 7: return 967;
			case 8: return 968;
			case 9: return 969;
		}
	}
	/**
	* Gets the icon index for a catalog parameter key.
	* @param {string} parameterKey The registry key.
	* @returns {number}
	*/
	static parameterIcon(parameterKey) {
		const definition = ParameterRegistry.get(parameterKey);
		if (!definition) {
			return 0;
		}
		return definition.iconIndex();
	}
	/**
	* Gets the corresponding `iconIndex` for the element based on their id.
	* @param {number} elementId The id of the element.
	* @returns {number}
	*/
	static element(elementId) {
		switch (elementId) {
			case -1: return 76;
			case 0: return 70;
			case 1: return 912;
			case 2: return 913;
			case 3: return 914;
			case 4: return 915;
			case 5: return 916;
			case 6: return 917;
			case 7: return 918;
			case 8: return 919;
			case 9: return 920;
			case 10: return 127;
			case 11: return 302;
			case 12: return 321;
			case 13: return 345;
			case 14: return 342;
			case 15: return 184;
			case 16: return 2112;
			case 17: return 348;
			case 18: return 82;
			case 19: return 83;
			case 20: return 2192;
			case 21: return 403;
			case 22: return 364;
			case 23: return 453;
			case 24: return 72;
			case 25: return 200;
			case 26: return 218;
			case 27: return 1904;
			case 28: return 119;
			default: return 93;
		}
	}
	/**
	* Gets the icon for the skill type.
	* @param {number} skillTypeId The id of the skill type.
	* @returns {number} The corresponding icon index.
	*/
	static skillType(skillTypeId) {
		switch (skillTypeId) {
			case 1: return 82;
			case 2: return 2592;
			case 3: return 77;
			case 4: return 79;
			case 5: return 188;
			case 6: return 227;
			case 7: return 76;
			case 8: return 2192;
			default: return 0;
		}
	}
	/**
	* Gets the icon for the weapon type.
	* @param {number} weaponTypeId The id of the weapon type.
	* @returns {number} The corresponding icon index.
	*/
	static weaponType(weaponTypeId) {
		switch (weaponTypeId) {
			case 1: return 401;
			case 2: return 408;
			case 3: return 438;
			case 4: return 434;
			case 5: return 442;
			case 6: return 461;
			case 7: return 2074;
			case 8: return 2077;
			case 9: return 2076;
			case 10: return 2075;
			default: return 16;
		}
	}
	/**
	* Gets the icon for the armor type.
	* @param {number} armorTypeId The id of the armor type.
	* @returns {number} The corresponding icon index.
	*/
	static armorType(armorTypeId) {
		switch (armorTypeId) {
			case 1: return 16;
			default: return 16;
		}
	}
	/**
	* Gets the icon for the equip type.
	* @param {number} equipTypeId The id of the equip type.
	* @returns {number} The corresponding icon index.
	*/
	static equipType(equipTypeId) {
		switch (equipTypeId) {
			case 1: return 16;
			default: return 16;
		}
	}
	/**
	* Gets the icon for the special flag of a trait.
	* @param {number} flagId The id of the special flag.
	* @returns {number} The corresponding icon index.
	*/
	static specialFlag(flagId) {
		switch (flagId) {
			case 1: return 16;
			default: return 16;
		}
	}
	/**
	* Gets the icon for the party ability of a trait.
	* @param {number} partyAbilityId The id of the party ability.
	* @returns {number} The corresponding icon index.
	*/
	static partyAbility(partyAbilityId) {
		switch (partyAbilityId) {
			case 1: return 16;
			default: return 16;
		}
	}
	/**
	* Gets the icon for a trait.
	* @param {JAFTING_Trait} trait The target trait.
	* @returns {number} The corresponding icon index.
	*/
	static trait(trait) {
		switch (trait._code) {
			case 11: return this.element(trait._dataId);
			case 12: return this.param(trait._dataId);
			case 13:
			case 14: return $dataStates[trait._dataId].iconIndex;
			case 21: return this.param(trait._dataId);
			case 22: return this.xparam(trait._dataId);
			case 23: return this.sparam(trait._dataId);
			case 31: return this.element(trait._dataId);
			case 32: return $dataStates[trait._dataId].iconIndex;
			case 33: return 79;
			case 34: return 399;
			case 35: return $dataSkills[trait._dataId].iconIndex;
			case 41: return this.skillType(trait._dataId);
			case 42: return this.skillType(trait._dataId);
			case 43: return $dataSkills[trait._dataId].iconIndex;
			case 44: return $dataSkills[trait._dataId].iconIndex;
			case 51: return this.weaponType(trait._dataId);
			case 52: return this.armorType(trait._dataId);
			case 53: return this.equipType(trait._dataId);
			case 54: return this.equipType(trait._dataId);
			case 55: return 462;
			case 61: return 76;
			case 63: return 25;
			case 62: return this.specialFlag(trait._dataId);
			case 64: return this.partyAbility(trait._dataId);
			default:
				Diagnostics.error("J-Base", `all traits are accounted for- is this a custom trait code: [${trait._code}]?`);
				return false;
		}
	}
	/**
	* A tag for correlating a JABS parameter to an icon.
	*/
	static JABS_PARAMETER = {
		BONUS_HITS: "bonus-hits",
		ATTACK_SKILL: "attack-skill",
		SPEED_BOOST: "speed-boost"
	};
	/**
	* Gets the JABS-related icon based on parameter type.
	* @param {string} type The type of JABS parameter.
	* @returns {number} The corresponding icon index.
	*/
	static jabsParameterIcon(type) {
		switch (type) {
			case this.JABS_PARAMETER.BONUS_HITS: return 399;
			case this.JABS_PARAMETER.SPEED_BOOST: return 82;
			case this.JABS_PARAMETER.ATTACK_SKILL: return 76;
		}
	}
	/**
	* A tag for correlating a JAFTING parameter to an icon.
	*/
	static JAFTING_PARAMETER = {
		MAX_REFINE: "max-refine-count",
		MAX_TRAITS: "max-trait-count",
		NOT_BASE: "not-refinement-base",
		NOT_MATERIAL: "not-refinement-material",
		TIMES_REFINED: "refined-count",
		UNREFINABLE: "unrefinable"
	};
	/**
	* Gets the JAFTING-related icon based on parameter type.
	* @param {string} type The type of JAFTING parameter.
	* @returns {number} The corresponding icon index.
	*/
	static jaftingParameterIcon(type) {
		switch (type) {
			case this.JAFTING_PARAMETER.MAX_REFINE: return 86;
			case this.JAFTING_PARAMETER.MAX_TRAITS: return 86;
			case this.JAFTING_PARAMETER.NOT_BASE: return 90;
			case this.JAFTING_PARAMETER.NOT_MATERIAL: return 90;
			case this.JAFTING_PARAMETER.TIMES_REFINED: return 223;
			case this.JAFTING_PARAMETER.UNREFINABLE: return 90;
		}
	}
	/**
	* Gets the icon representing the team id provided.
	* @param {number} teamId The team id.
	* @returns {number} The corresponding icon index.
	*/
	static team(teamId) {
		switch (teamId) {
			case 0: return 38;
			case 1: return 21;
			case 2: return 91;
		}
	}
};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_Trait.js
/**
* A class representing a single trait living on one of the many types
* of database classes that leverage traits.
*/
var RPG_Trait = class RPG_Trait {
	/**
	* Constructs a new {@link RPG_Trait} from only its triad of base values.
	* @param {number} code The code that designates what kind of trait this is.
	* @param {number} dataId The identifier that further defines the trait.
	* @param {number} value The value of the trait, for traits that have numeric values.
	* @returns {RPG_Trait}
	*/
	static fromValues(code, dataId, value) {
		return new RPG_Trait({
			code,
			dataId,
			value
		});
	}
	/**
	* The code that designates what kind of trait this is.
	* @type {number}
	*/
	code = 0;
	/**
	* The identifier that further defines the trait.
	* Data type and usage depends on the code.
	* @type {number}
	*/
	dataId = 0;
	/**
	* The value of the trait, for traits that have numeric values.
	* Often is a floating point number to represent a percent multiplier.
	* @type {number}
	*/
	value = 1;
	/**
	* Constructor.
	* @param {RPG_Trait} trait The trait to parse.
	*/
	constructor(trait) {
		this.code = trait.code;
		this.dataId = trait.dataId;
		this.value = trait.value;
	}
	/**
	* The icon representing what this trait affects, or 0 when it has no natural one.
	*
	* The three parameter codes line up exactly with the three parameter icon lookups already in
	* {@link IconManager}, so a trait carrying a stat can always be shown as that stat's icon rather than
	* spelled out. Everything else - element rates, skill seals, party abilities - has no single icon that
	* means it, and answers 0 so a caller can fall back to words instead of inventing artwork.
	* @returns {number}
	*/
	iconIndex() {
		if (this.code === 21) return IconManager.param(this.dataId);
		if (this.code === 22) return IconManager.xparam(this.dataId);
		if (this.code === 23) return IconManager.sparam(this.dataId);
		if (this.code === 11 || this.code === 31) return IconManager.element(this.dataId);
		if (this.code === 14) return $dataStates.at(this.dataId).iconIndex;
		if (this.code === 35 || this.code === 43 || this.code === 44) return $dataSkills.at(this.dataId).iconIndex;
		return 0;
	}
	/**
	* Gets a combined textual name and value of this trait.
	* @return {string}
	*/
	textNameAndValue() {
		return `${this.textName()} ${this.textValue()}`;
	}
	/**
	* Gets the underlying name of the trait as text.
	* @return {string}
	*/
	textName() {
		switch (this.code) {
			case 11: return `${$dataSystem.elements[this.dataId]} dmg`;
			case 12: return `${TextManager.param(this.dataId)} debuff rate`;
			case 13: return `${$dataStates[this.dataId].name} resist`;
			case 14: return "Immune to";
			case 21: return `${TextManager.param(this.dataId)}`;
			case 22: return `${TextManager.xparam(this.dataId)}`;
			case 23: return `${TextManager.sparam(this.dataId)}`;
			case 31: return "Element:";
			case 32: return `${$dataStates[this.dataId].name} on-hit`;
			case 33: return "Skill Speed";
			case 34: return "Times";
			case 35: return "Basic Attack w/";
			case 41: return `Unlock:`;
			case 42: return `Lock:`;
			case 43: return `Learn:`;
			case 44: return `Seal:`;
			case 51: return `${$dataSystem.weaponTypes[this.dataId]}`;
			case 52: return `${$dataSystem.armorTypes[this.dataId]}`;
			case 53: return `${$dataSystem.equipTypes[this.dataId]}`;
			case 54: return `${$dataSystem.equipTypes[this.dataId]}`;
			case 55: return `${this.dataId ? "Enable" : "Disable"}`;
			case 61: return "Another turn chance:";
			case 62: return `${this.translateSpecialFlag()}`;
			case 64: return `${this.translatePartyAbility()}`;
			case 63: return "TRANSFERABLE TRAITS";
			default: return "Is this a custom trait?";
		}
	}
	/**
	* Gets the underlying value of the trait as text.
	* @return {*|string}
	*/
	textValue() {
		switch (this.code) {
			case 11:
				const calculatedElementalRate = Math.round(100 - this.value * 100);
				return `${calculatedElementalRate > 0 ? "-" : "+"}${Math.abs(calculatedElementalRate)}%`;
			case 12:
				const calculatedDebuffRate = Math.round(this.value * 100 - 100);
				return `${calculatedDebuffRate >= 0 ? "+" : "-"}${Math.abs(calculatedDebuffRate)}%`;
			case 13:
				const calculatedStateRate = Math.round(100 - this.value * 100);
				return `${calculatedStateRate > 0 ? "+" : "-"}${Math.abs(calculatedStateRate)}%`;
			case 14: return $dataStates[this.dataId].name;
			case 21:
				const calculatedBParam = Math.round(this.value * 100 - 100);
				return `${calculatedBParam >= 0 ? "+" : ""}${calculatedBParam}%`;
			case 22: {
				const calculatedXParam = Math.round(this.value * 100);
				if (this.dataId === 0) return `${calculatedXParam >= 0 ? "+" : ""}${calculatedXParam}`;
				return `${calculatedXParam >= 0 ? "+" : ""}${calculatedXParam}%`;
			}
			case 23: {
				const calculatedSParam = Math.round(this.value * 100 - 100);
				if (this.dataId === 1) return `${calculatedSParam >= 0 ? "+" : ""}${calculatedSParam}`;
				return `${calculatedSParam >= 0 ? "+" : ""}${calculatedSParam}%`;
			}
			case 31: return `${$dataSystem.elements.at(this.dataId)}`;
			case 32: return `${this.value * 100}%`;
			case 33: return `${this.value >= 0 ? "+" : "-"}${Math.abs(this.value)}`;
			case 34: return `${this.value >= 0 ? "+" : "-"}${Math.abs(this.value)}`;
			case 35: return `${$dataSkills[this.dataId].name}`;
			case 41: return `${$dataSystem.skillTypes[this.dataId]}`;
			case 42: return `${$dataSystem.skillTypes[this.dataId]}`;
			case 43: return `${$dataSkills[this.dataId].name}`;
			case 44: return `${$dataSkills[this.dataId].name}`;
			case 51: return "proficiency";
			case 52: return "proficiency";
			case 53: return "is locked";
			case 54: return "is sealed";
			case 55: return "Dual-wield";
			case 61: return `${Math.round(this.value * 100)}%`;
			case 62: return String.empty;
			case 64: return String.empty;
			case 63: return String.empty;
			default: return "is this a custom trait?";
		}
	}
	translateSpecialFlag() {
		switch (this.dataId) {
			case 0: return "Autobattle";
			case 1: return "Empowered Guard";
			case 2: return "Cover/Substitute";
			case 3: return "Preserve TP";
		}
	}
	translatePartyAbility() {
		switch (this.dataId) {
			case 0: return "Encounter Half";
			case 1: return "Encounter None";
			case 2: return "Prevent Surprise";
			case 3: return "Frequent Pre-emptive";
			case 4: return "Gold Dropped 2x";
			case 5: return "Loot Drop Chance 2x";
		}
	}
};

//#endregion
//#region src/plugins/_base/core/database/base/RPG_Traited.js
/**
* A class representing a BaseItem from the database, but with traits.
*/
var RPG_Traited = class extends RPG_BaseItem {
	/**
	* A collection of all traits this item possesses.
	* @type {RPG_Trait[]}
	*/
	traits = [];
	/**
	* Constructor.
	* Maps the base item's traits into this object.
	* @param {RPG_BaseItem} baseItem The underlying database object.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(baseItem, index) {
		super(baseItem, index);
		this.traits = baseItem.traits.map((trait) => new RPG_Trait(trait));
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:traited`;
	}
};

//#endregion
//#region src/plugins/_base/core/database/core/RPG_EquipItem.js
/**
* A base class representing containing common properties found in both
* weapons and armors.
*/
var RPG_EquipItem = class extends RPG_Traited {
	/**
	* The type of equip this is.
	* This number is the index that maps to your equip types.
	* @type {number}
	*/
	etypeId = 1;
	/**
	* The core parameters that all battlers have:
	* MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
	* in that order.
	* @type {[number, number, number, number, number, number, number, number]}
	*/
	params = [
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The price of this equip.
	* @type {number}
	*/
	price = 0;
	/**
	* Constructor.
	* @param {RPG_EquipItem} equip The equip to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(equip, index) {
		super(equip, index);
		this.etypeId = equip.etypeId;
		this.params = equip.params;
		this.price = equip.price;
	}
	/**
	* Determines whether or not this equip is a weapon.
	* @returns {boolean}
	*/
	isWeapon() {
		return this.etypeId === 1;
	}
	/**
	* Determines whether or not this equip is an armor.
	* Armor is defined as an equip type that is greater than 1.
	* @returns {boolean}
	*/
	isArmor() {
		return this.etypeId > 1;
	}
	/**
	* Whether or not this database entry is an equip item.
	* @returns {boolean}
	*/
	isEquipItem() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:equip`;
	}
	/**
	* How much of a base parameter this equip is worth of its own.
	*
	* **Both sources are summed.** The editor's `params` array and a `<this{PARAM}:N>` tag are two ways of
	* saying the same thing, and an equip may end up carrying both - a refinement merge can put a tag onto a
	* row that already had a number in the field. Neither wins; they add.
	* @param {number} paramId The base parameter id, 0 through 7.
	* @returns {number}
	*/
	thisBParam(paramId) {
		return this.params.at(paramId) + this.thisBParamBonus(paramId);
	}
	/**
	* The tagged half of a base parameter this equip carries, without its `params` field.
	*
	* Separate from {@link thisBParam} because the two halves are authored in different places, and a reader
	* comparing an equip against what the editor shows needs to be able to see them apart.
	* @param {number} paramId The base parameter id, 0 through 7.
	* @returns {number}
	*/
	thisBParamBonus(paramId) {
		switch (paramId) {
			case 0: return this.thisMhp();
			case 1: return this.thisMmp();
			case 2: return this.thisAtk();
			case 3: return this.thisDef();
			case 4: return this.thisMat();
			case 5: return this.thisMdf();
			case 6: return this.thisAgi();
			case 7: return this.thisLuk();
			default: return 0;
		}
	}
	/**
	* How much of an ex-parameter this equip is worth of its own.
	*
	* No `params` counterpart exists for these - RMMZ models them only as traits - so the tag is the whole
	* of it. That absence is the reason these tags exist at all.
	* @param {number} xparamId The ex-parameter id, 0 through 9.
	* @returns {number}
	*/
	thisXParam(xparamId) {
		switch (xparamId) {
			case 0: return this.thisHit();
			case 1: return this.thisEva();
			case 2: return this.thisCri();
			case 3: return this.thisCev();
			case 4: return this.thisMev();
			case 5: return this.thisMrf();
			case 6: return this.thisCnt();
			case 7: return this.thisHrg();
			case 8: return this.thisMrg();
			case 9: return this.thisTrg();
			default: return 0;
		}
	}
	/**
	* How much of an sp-parameter this equip is worth of its own.
	* @param {number} sparamId The sp-parameter id, 0 through 9.
	* @returns {number}
	*/
	thisSParam(sparamId) {
		switch (sparamId) {
			case 0: return this.thisTgr();
			case 1: return this.thisGrd();
			case 2: return this.thisRec();
			case 3: return this.thisPha();
			case 4: return this.thisMcr();
			case 5: return this.thisTcr();
			case 6: return this.thisPdr();
			case 7: return this.thisMdr();
			case 8: return this.thisFdr();
			case 9: return this.thisExr();
			default: return 0;
		}
	}
	/**
	* Flat max hit points this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisMhp() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMhp);
	}
	/**
	* Flat max magi this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisMmp() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMmp);
	}
	/**
	* Flat max tech this equip carries.
	*
	* The only one of the nine with no editor field to sum against, because RMMZ fixed tech at a flat
	* hundred rather than modelling it, so the tag is the whole of it.
	* @returns {number}
	*/
	thisMtp() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMtp);
	}
	/**
	* Flat attack this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisAtk() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisAtk);
	}
	/**
	* Flat defense this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisDef() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisDef);
	}
	/**
	* Flat magic attack this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisMat() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMat);
	}
	/**
	* Flat magic defense this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisMdf() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMdf);
	}
	/**
	* Flat agility this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisAgi() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisAgi);
	}
	/**
	* Flat luck this equip carries, from its tag alone.
	* @returns {number}
	*/
	thisLuk() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisLuk);
	}
	/**
	* Flat accuracy this equip carries.
	* @returns {number}
	*/
	thisHit() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisHit);
	}
	/**
	* Flat evasion this equip carries.
	* @returns {number}
	*/
	thisEva() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisEva);
	}
	/**
	* Flat critical hit chance this equip carries.
	* @returns {number}
	*/
	thisCri() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisCri);
	}
	/**
	* Flat critical evasion this equip carries.
	* @returns {number}
	*/
	thisCev() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisCev);
	}
	/**
	* Flat magic evasion this equip carries.
	* @returns {number}
	*/
	thisMev() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMev);
	}
	/**
	* Flat magic reflection this equip carries.
	* @returns {number}
	*/
	thisMrf() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMrf);
	}
	/**
	* Flat counter attack chance this equip carries.
	* @returns {number}
	*/
	thisCnt() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisCnt);
	}
	/**
	* Flat hp regeneration this equip carries.
	* @returns {number}
	*/
	thisHrg() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisHrg);
	}
	/**
	* Flat magi regeneration this equip carries.
	* @returns {number}
	*/
	thisMrg() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMrg);
	}
	/**
	* Flat tech regeneration this equip carries.
	*
	* Regeneration, not target rate - see {@link thisTgr}, whose abbreviation is a transposition away.
	* @returns {number}
	*/
	thisTrg() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisTrg);
	}
	/**
	* Flat target rate this equip carries - how much aggro it draws.
	*
	* Target rate, not tech regeneration - see {@link thisTrg}.
	* @returns {number}
	*/
	thisTgr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisTgr);
	}
	/**
	* Flat guard rate this equip carries - parry.
	* @returns {number}
	*/
	thisGrd() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisGrd);
	}
	/**
	* Flat recovery rate this equip carries.
	* @returns {number}
	*/
	thisRec() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisRec);
	}
	/**
	* Flat pharmacology this equip carries.
	* @returns {number}
	*/
	thisPha() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisPha);
	}
	/**
	* Flat magi cost reduction this equip carries.
	* @returns {number}
	*/
	thisMcr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMcr);
	}
	/**
	* Flat tech charge rate this equip carries.
	* @returns {number}
	*/
	thisTcr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisTcr);
	}
	/**
	* Flat physical damage rate this equip carries.
	* @returns {number}
	*/
	thisPdr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisPdr);
	}
	/**
	* Flat magical damage rate this equip carries.
	* @returns {number}
	*/
	thisMdr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisMdr);
	}
	/**
	* Flat floor damage rate this equip carries.
	* @returns {number}
	*/
	thisFdr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisFdr);
	}
	/**
	* Flat experience rate this equip carries.
	* @returns {number}
	*/
	thisExr() {
		return RPGManager.getSumFromNoteByRegex(this, J.BASE.RegExp.ThisExr);
	}
	/**
	* How much this equip amplifies its own base for a given parameter.
	*
	* A percentage on equipment scales what that equipment is worth rather than what its wearer is worth,
	* so the multiplier has to be assembled from this item's own traits. It cannot come from the battler's
	* flattened trait list, which no longer knows which item each trait arrived on.
	*
	* Returns a multiplier centred on 1.0 whichever family is asked for. Codes 21 and 23 store their values
	* as deltas from 1.0 while code 22 stores them as deltas from 0, and normalising the two here is what
	* lets one subtraction remove equipment's share from all three battler aggregates.
	*
	* Every trait counts, including any sitting below a JAFTING divider. A worn item's below-divider traits
	* are live - the divider is a transfer marker, not a switch - so a percentage there scales this item
	* exactly like one above it.
	* @param {number} code The trait code: 21 for base, 22 for ex-, 23 for sp-parameters.
	* @param {number} dataId The parameter id within that family.
	* @returns {number}
	*/
	ownRate(code, dataId) {
		const baseline = code === 22 ? 0 : 1;
		const matching = this.traits.filter((trait) => trait.code === code && trait.dataId === dataId);
		return matching.reduce((total, trait) => total + (trait.value - baseline), 1);
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Weapon.js
/**
* A class representing a single weapon from the database.
*/
var RPG_Weapon = class RPG_Weapon extends RPG_EquipItem {
	/**
	* The animation id for this weapon.
	* @type {number}
	*/
	animationId = -1;
	/**
	* The type of weapon this is.
	* This number is the index that maps to your weapon types.
	* @type {number}
	*/
	wtypeId = 1;
	/**
	* The type of item this is. Weapons are always type 2.
	* @type {2}
	*/
	kind = 2;
	/**
	* Constructor.
	* @param {RPG_Weapon} weapon The weapon to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(weapon, index) {
		super(weapon, index);
		this.animationId = weapon.animationId;
		this.wtypeId = weapon.wtypeId;
	}
	/**
	* Whether or not this database entry is a weapon.
	* @returns {boolean}
	*/
	isWeapon() {
		return true;
	}
	/**
	* Whether or not this database entry is an equip item.
	* @returns {boolean}
	*/
	isEquipItem() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:weapon`;
	}
	/**
	* Hydrated blank weapon row for reclaiming dynamic refinement slots (matches unused DB slot shape, not `null`).
	*
	* @param {number} index database id and `$dataWeapons` index for this row
	* @returns {RPG_Weapon}
	*/
	static createEmpty(index) {
		const raw = {
			id: index,
			animationId: 0,
			wtypeId: 0,
			etypeId: 1,
			params: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			price: 0,
			traits: [],
			description: String.empty,
			iconIndex: 0,
			name: String.empty,
			note: String.empty,
			meta: {}
		};
		return new RPG_Weapon(raw, index);
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_State.js
/**
* An class representing a single state from the database.
*/
var RPG_State = class RPG_State extends RPG_Traited {
	/**
	* The automatic removal timing.
	* @type {0|1|2}
	*/
	autoRemovalTiming = 0;
	/**
	* The percent chance that receiving damage will remove this state.
	* Requires `removeByDamage` to be true on this state.
	* @type {number}
	*/
	chanceByDamage = 100;
	/**
	* States do not normally have descriptions.
	* Rather than leaving it as `undefined`, lets be nice and keep it
	* an empty string.
	* @type {String.empty}
	*/
	description = String.empty;
	/**
	* The maximum number of turns this state will persist.
	* Requires `restriction` to not be 0 to be leveraged.
	* @type {number}
	*/
	maxTurns = 1;
	/**
	* "If an actor is inflicted with this state..."
	* @type {string}
	*/
	message1 = String.empty;
	/**
	* "If an enemy is inflicted with this state..."
	* @type {string}
	*/
	message2 = String.empty;
	/**
	* "If the state persists..."
	* @type {string}
	*/
	message3 = String.empty;
	/**
	* "If the state is removed..."
	* @type {string}
	*/
	message4 = String.empty;
	/**
	* The minimum number of turns this state will persist.
	* Requires `restriction` to not be 0 to be leveraged.
	* @type {number}
	*/
	minTurns = 1;
	/**
	* The motion the sideview battler will take while afflicted
	* with this state.
	* @type {number}
	*/
	motion = 0;
	/**
	* The state overlay id that shows on the battler while
	* this state is afflicted.
	* @type {number}
	*/
	overlay = 0;
	/**
	* The priority of the skill.
	* @type {number}
	*/
	priority = 50;
	/**
	* Whether or not this state will automatically be removed at
	* the end of the battle.
	* @type {boolean}
	*/
	removeAtBattleEnd = false;
	/**
	* Whether or not this state can be removed simply by taking damage.
	* Leverages the `chanceByDamage` percent for whether or not to remove.
	* @type {boolean}
	*/
	removeByDamage = false;
	/**
	* Whether or not this state can be removed by applying a different state
	* that has a higher `restriction` type.
	* @type {boolean}
	*/
	removeByRestriction = false;
	/**
	* Whether or not this state can be removed by taking the `stepsToRemove` number
	* of steps on this state.
	* @type {boolean}
	*/
	removeByWalking = false;
	/**
	* The type of restriction this state has.
	* @type {number}
	*/
	restriction = 0;
	/**
	* The number of steps to remove this state.
	* Requires `removeByWalking` to be true on this state to be leveraged.
	* @type {number}
	*/
	stepsToRemove = 100;
	/**
	* Constructor.
	* Maps the state's properties into this object.
	* @param {RPG_State} state The underlying state object.
	* @param {number} index The index of the state in the database.
	*/
	constructor(state, index) {
		super(state, index);
		this.autoRemovalTiming = state.autoRemovalTiming;
		this.chanceByDamage = state.chanceByDamage;
		this.maxTurns = state.maxTurns;
		this.message1 = state.message1;
		this.message2 = state.message2;
		this.message3 = state.message3;
		this.message4 = state.message4;
		this.minTurns = state.minTurns;
		this.motion = state.motion;
		this.overlay = state.overlay;
		this.priority = state.priority;
		this.removeAtBattleEnd = state.removeAtBattleEnd;
		this.removeByDamage = state.removeByDamage;
		this.removeByRestriction = state.removeByRestriction;
		this.removeByWalking = state.removeByWalking;
		this.restriction = state.restriction;
		this.stepsToRemove = state.stepsToRemove;
	}
	/**
	* Whether or not this database entry is a state.
	* @returns {boolean}
	*/
	isState() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:state`;
	}
	/**
	* Hydrated blank state row—symmetry with other DB wrappers when a slot must read as "unused but valid".
	*
	* @param {number} index database id and `$dataStates` index for this row
	* @returns {RPG_State}
	*/
	static createEmpty(index) {
		const raw = {
			id: index,
			autoRemovalTiming: 0,
			chanceByDamage: 100,
			traits: [],
			iconIndex: 0,
			maxTurns: 1,
			message1: String.empty,
			message2: String.empty,
			message3: String.empty,
			message4: String.empty,
			minTurns: 1,
			motion: 0,
			name: String.empty,
			note: String.empty,
			overlay: 0,
			priority: 50,
			removeAtBattleEnd: false,
			removeByDamage: false,
			removeByRestriction: false,
			removeByWalking: false,
			restriction: 0,
			stepsToRemove: 100,
			messageType: 1,
			description: String.empty,
			meta: {}
		};
		return new RPG_State(raw, index);
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Item.js
/**
* A class representing a single item entry from the database.
*/
var RPG_Item = class RPG_Item extends RPG_UsableItem {
	/**
	* Whether or not this item is removed after using it.
	* @type {boolean}
	*/
	consumable = true;
	/**
	* The type of item this is:
	* 0 for regular item, 1 for key item, 2 for hiddenA, 3 for hiddenB.
	* @type {number}
	*/
	itypeId = 1;
	/**
	* The price of this item.
	* @type {number}
	*/
	price = 0;
	/**
	* The type of item this is. Items are always type 1.
	* @type {1}
	*/
	kind = 1;
	/**
	* Constructor.
	* @param {RPG_Item} item The item to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(item, index) {
		super(item, index);
		this.consumable = item.consumable;
		this.itypeId = item.itypeId;
		this.price = item.price;
	}
	/**
	* Whether or not this database entry is an item.
	* @returns {boolean}
	*/
	isItem() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:item`;
	}
	/**
	* Hydrated blank consumable row—symmetry with equip `createEmpty`; useful when rebuilding `$dataItems` slots.
	*
	* @param {number} index database id and `$dataItems` index for this row
	* @returns {RPG_Item}
	*/
	static createEmpty(index) {
		const raw = {
			id: index,
			animationId: 0,
			consumable: true,
			damage: {
				critical: false,
				elementId: 0,
				formula: "0",
				type: 0,
				variance: 20
			},
			description: String.empty,
			effects: [],
			hitType: 0,
			iconIndex: 0,
			itypeId: 1,
			name: String.empty,
			note: String.empty,
			occasion: 0,
			price: 0,
			repeats: 1,
			scope: 7,
			speed: 0,
			successRate: 100,
			tpGain: 0,
			meta: {}
		};
		return new RPG_Item(raw, index);
	}
};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_DropItem.js
/**
* A class representing a single drop item of an enemy from the database.
*/
var RPG_DropItem = class {
	/**
	* The various types of {@link RPG_DropItem} that can be produced.
	*/
	static Types = {
		/**
		* The drop item type that maps to "items" in the database.
		*/
		Item: 1,
		/**
		* The drop item type that maps to "weapons" in the database.
		*/
		Weapon: 2,
		/**
		* The drop item type that maps to "armors" in the database.
		*/
		Armor: 3
	};
	/**
	* Translates a letter or word drop item type into its numeric counterpart.
	* @param {i|item|w|weapon|a|armor} letter The letter to translate.
	* @returns {number} The numeric drop item type.
	*/
	static TypeFromLetter = (letter) => {
		switch (letter.toLowerCase()) {
			case "i":
			case "item": return this.Types.Item;
			case "w":
			case "weapon": return this.Types.Weapon;
			case "a":
			case "armor": return this.Types.Armor;
			default: throw new Error(`invalid item type letter provided: [${letter}].`);
		}
	};
	/**
	* Translates a number/kind drop item type into its letter counterpart.
	* @param {1|2|3} number The number to translate.
	* @returns {number} The letter drop item type.
	*/
	static TypeFromNumber = (number) => {
		switch (number) {
			case 1: return "i";
			case 2: return "w";
			case 3: return "a";
			default: throw new Error(`invalid item type number provided: [${number}].`);
		}
	};
	/**
	* The id of the underlying item's entry in the database.
	* @type {number}
	*/
	dataId = 0;
	/**
	* The drop chance value numeric field in the database.
	* @type {number}
	*/
	denominator = 0;
	/**
	* The type of drop this is:
	* 0 being item, 1 being weapon, 2 being armor.
	* @type {number}
	*/
	kind = 0;
	/**
	* Constructor.
	* @param {RPG_DropItem} enemyDropItem The drop item to parse.
	*/
	constructor({ dataId, denominator, kind }) {
		this.dataId = dataId;
		this.denominator = denominator;
		this.kind = kind;
	}
};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_EnemyAction.js
/**
* A class representing a single enemy action from the database.
*/
var RPG_EnemyAction = class {
	/**
	* The first parameter of the condition configuration.
	* @type {number}
	*/
	conditionParam1 = 0;
	/**
	* The second parameter of the condition configuration.
	* @type {number}
	*/
	conditionParam2 = 0;
	/**
	* The type of condition it is.
	* @type {number}
	*/
	conditionType = 0;
	/**
	* The weight or rating that this enemy will execute this skill.
	* @type {number}
	*/
	rating = 5;
	/**
	* The skill id associated with the action.
	* @type {number}
	*/
	skillId = 1;
	/**
	* Constructor.
	* @param {RPG_EnemyAction} enemyAction The action to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(enemyAction, index) {
		this.conditionParam1 = enemyAction.conditionParam1;
		this.conditionParam2 = enemyAction.conditionParam2;
		this.conditionType = enemyAction.conditionType;
		this.rating = enemyAction.rating;
		this.skillId = enemyAction.skillId;
	}
};

//#endregion
//#region src/plugins/_base/core/database/core/RPG_BaseBattler.js
/**
* A class representing the groundwork for what all battlers
* database data look like.
*/
var RPG_BaseBattler = class extends RPG_Traited {
	/**
	* The name of the battler while in battle.
	* @type {string}
	*/
	battlerName = String.empty;
	/**
	* Constructor.
	* Maps the base battler data to the properties on this class.
	* @param {RPG_Enemy|RPG_Actor} battler The battler to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(battler, index) {
		super(battler, index);
		this.battlerName = battler.battlerName;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:battler`;
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Enemy.js
/**
* A class representing a single enemy battler's data from the database.
*/
var RPG_Enemy = class extends RPG_BaseBattler {
	/**
	* A collection of all actions that an enemy has assigned from the database.
	* @type {RPG_EnemyAction[]}
	*/
	actions = [];
	/**
	* The -255-0-255 hue of the battler sprite.
	* @type {number}
	*/
	battlerHue = 0;
	/**
	* A collection of all drop items this enemy can drop.
	* @type {RPG_DropItem[]}
	*/
	dropItems = [];
	/**
	* The base amount of experience this enemy grants upon defeat.
	* @type {number}
	*/
	exp = 0;
	/**
	* The base amount of gold this enemy grants upon defeat.
	* @type {number}
	*/
	gold = 0;
	/**
	* The core parameters that all battlers have:
	* MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
	* in that order.
	* @type {[number, number, number, number, number, number, number, number]}
	*/
	params = [
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* Constructor.
	* @param {RPG_Enemy} enemy The enemy to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(enemy, index) {
		super(enemy, index);
		this.initMembers(enemy);
	}
	/**
	* Maps the data from the JSON to this object.
	* @param {RPG_Enemy} enemy The enemy to parse.
	*/
	initMembers(enemy) {
		this.actions = enemy.actions.map((enemyAction) => new RPG_EnemyAction(enemyAction));
		this.battlerHue = enemy.battlerHue;
		this.dropItems = enemy.dropItems.map((dropItem) => new RPG_DropItem(dropItem));
		this.exp = enemy.exp;
		this.gold = enemy.gold;
		this.params = enemy.params;
	}
	/**
	* Whether or not this database entry is an enemy.
	* @returns {boolean}
	*/
	isEnemy() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:enemy`;
	}
};

//#endregion
//#region src/plugins/_base/core/database/_data/RPG_ClassLearning.js
/**
* A class representing a single learning of a skill for a class from the database.
*/
var RPG_ClassLearning = class {
	/**
	* The level that the owning class will learn the given skill.
	* @type {number}
	*/
	level = 0;
	/**
	* The skill to be learned when the owning class reaches the given level.
	* @type {number}
	*/
	skillId = 0;
	/**
	* The note data for this given learning.
	* @type {string}
	*/
	note = String.empty;
	/**
	* Constructor.
	* @param {RPG_ClassLearning} learning The class learning to parse.
	*/
	constructor(learning) {
		this.level = learning.level;
		this.skillId = learning.skillId;
		this.note = learning.note;
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Class.js
/**
* A class representing a RPG-relevant class from the database.
*/
var RPG_Class = class extends RPG_Traited {
	/**
	* The four data points that comprise the EXP curve for this class.
	* @type {[number, number, number, number]}
	*/
	expParams = [
		0,
		0,
		0,
		0
	];
	/**
	* A collection of skill learning data points for this class.
	* @type {RPG_ClassLearning[]}
	*/
	learnings = [];
	/**
	* A multi-dimensional array of the core parameters that all battlers have:
	* MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
	* in that order, but for all 100 of the base levels.
	* @type {[number[], number[], number[], number[], number[], number[], number[], number[]]}
	*/
	params = [
		[1],
		[0],
		[0],
		[0],
		[0],
		[0],
		[0],
		[0]
	];
	/**
	* Constructor.
	* @param {RPG_Class} classData The class data to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(classData, index) {
		super(classData, index);
		this.expParams = classData.expParams;
		this.learnings = classData.learnings.map((learning) => new RPG_ClassLearning(learning));
		this.params = classData.params;
	}
	/**
	* Whether or not this database entry is a class.
	* @returns {boolean}
	*/
	isClass() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:class`;
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Armor.js
/**
* A class representing a single armor from the database.
*/
var RPG_Armor = class RPG_Armor extends RPG_EquipItem {
	/**
	* The type of armor this is.
	* This number is the index that maps to your armor types.
	* @type {number}
	*/
	atypeId = 1;
	/**
	* The type of item this is. Armors are always type 3.
	* @type {3}
	*/
	kind = 3;
	/**
	* Constructor.
	* @param {RPG_Armor} armor The armor to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(armor, index) {
		super(armor, index);
		this.atypeId = armor.atypeId;
	}
	/**
	* Whether or not this database entry is an armor.
	* @returns {boolean}
	*/
	isArmor() {
		return true;
	}
	/**
	* Whether or not this database entry is an equip item.
	* @returns {boolean}
	*/
	isEquipItem() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:armor`;
	}
	/**
	* Hydrated blank armor row for reclaiming dynamic refinement slots (matches unused DB slot shape, not `null`).
	*
	* @param {number} index database id and `$dataArmors` index for this row
	* @returns {RPG_Armor}
	*/
	static createEmpty(index) {
		const raw = {
			id: index,
			atypeId: 0,
			etypeId: 2,
			params: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			price: 0,
			traits: [],
			description: String.empty,
			iconIndex: 0,
			name: String.empty,
			note: String.empty,
			meta: {}
		};
		return new RPG_Armor(raw, index);
	}
};

//#endregion
//#region src/plugins/_base/core/database/implementations/RPG_Actor.js
/**
* A class representing a single actor battler's data from the database.
*/
var RPG_Actor = class extends RPG_BaseBattler {
	/**
	* The index of the character sprite of the battler
	* on the spritesheet.
	* @type {number}
	*/
	characterIndex = 0;
	/**
	* The name of the file that the character sprite
	* resides within.
	* @type {string}
	*/
	characterName = String.empty;
	/**
	* The id of the class that this actor currently is.
	* @type {number}
	*/
	classId = 0;
	/**
	* The ids of the equipment in the core equips slots
	* of the actors from the database.
	* @type {number[]}
	*/
	equips = [
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The index of the face sprite of this battler on
	* the spritesheet.
	* @type {number}
	*/
	faceIndex = 0;
	/**
	* The name of the file that the face sprite resides
	* within.
	* @type {string}
	*/
	faceName = String.empty;
	/**
	* The starting level for this actor in the database.
	* @type {number}
	*/
	initialLevel = 1;
	/**
	* The maximum level of this actor from the database.
	* @type {number}
	*/
	maxLevel = 99;
	/**
	* The nickname of this actor from the database.
	* @type {string}
	*/
	nickname = String.empty;
	/**
	* The profile multiline text for this actor in the database.
	* @type {string}
	*/
	profile = String.empty;
	/**
	* Constructor.
	* @param {RPG_Actor} actor The actor to parse.
	* @param {number} index The index of the entry in the database.
	*/
	constructor(actor, index) {
		super(actor, index);
		this.initMembers(actor);
	}
	/**
	* Maps the data from the JSON to this object.
	* @param {RPG_Actor} actor The actor to parse.
	*/
	initMembers(actor) {
		this.characterIndex = actor.characterIndex;
		this.characterName = actor.characterName;
		this.classId = actor.classId;
		this.equips = actor.equips;
		this.faceIndex = actor.faceIndex;
		this.faceName = actor.faceName;
		this.initialLevel = actor.initialLevel;
		this.maxLevel = actor.maxLevel;
		this.nickname = actor.nickname;
		this.profile = actor.profile;
	}
	/**
	* Whether or not this database entry is an actor.
	* @returns {boolean}
	*/
	isActor() {
		return true;
	}
	/**
	* Gets the type of implementation this database entry is.
	* @returns {string}
	*/
	implementationType() {
		return `${super.implementationType()}:actor`;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/DataManager.js
/**
* This rule is being disabled so that my personal IDE will recognize the data types and allow for intellisense to
* actually work as-expected. The IDE gets confused due to the fact that these are globally defined as "var" and
* reassigned in multiple locations, the last checked being "null" or otherwise unknown (like from file loading).
*/
/**
* The over-arching object containing all of my added parameters.
*/
DataManager._j ||= {};
/**
* Whether or not the database JSON data has been wrapped yet or not.
* @type {boolean}
*/
DataManager._j._databaseRewriteProcessed = false;
/**
* Determines whether or not the database wrapjob has been processed.
* @returns {boolean}
*/
DataManager.isRewriteProcessed = function() {
	return this._j._databaseRewriteProcessed;
};
/**
* Flips the flag to indicate that the database wrapper rewrite
* has been processed.
*/
DataManager.rewriteProcessed = function() {
	this._j._databaseRewriteProcessed = true;
};
/**
* Extends `isDatabaseLoaded` to give a hook to perform additional actions once the databsae is finished loading.
*/
J.BASE.Aliased.DataManager.set("isDatabaseLoaded", DataManager.isDatabaseLoaded);
DataManager.isDatabaseLoaded = function() {
	const isLoaded = J.BASE.Aliased.DataManager.get("isDatabaseLoaded").call(this);
	if (isLoaded) {
		this.onDatabaseLoad();
	}
	return isLoaded;
};
/**
* Performs additional actions upon the completion of the database loading.
*/
DataManager.onDatabaseLoad = function() {
	if (!this.isRewriteProcessed()) {
		this.rewriteDatabaseData();
	}
};
/**
* Rewrites the JSON objects extracted from the database and replaces them
* with proper extendable classes.
*/
DataManager.rewriteDatabaseData = function() {
	this.rewriteActorData();
	this.rewriteArmorData();
	this.rewriteClassData();
	this.rewriteEnemyData();
	this.rewriteItemData();
	this.rewriteSkillData();
	this.rewriteStateData();
	this.rewriteWeaponData();
	this.rewriteProcessed();
};
/**
* Overwrites all actors used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with actors.
*/
DataManager.rewriteActorData = function() {
	const classifiedActors = [];
	$dataActors.forEach((actor, index) => {
		if (!actor) {
			classifiedActors.push(null);
			return;
		}
		const actor_class = this.actorRewriteClass();
		classifiedActors.push(new actor_class(actor, index));
	});
	$dataActors = classifiedActors;
};
/**
* Gets the class reference to use when rewriting actors.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteActorData()` for an example.
* @returns {RPG_Enemy} The class reference.
*/
DataManager.actorRewriteClass = function() {
	return RPG_Actor;
};
/**
* Overwrites all armors used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with armors.
*/
DataManager.rewriteArmorData = function() {
	const classifiedArmors = [];
	$dataArmors.forEach((armor, index) => {
		if (!armor) {
			classifiedArmors.push(null);
			return;
		}
		const armor_class = this.armorRewriteClass();
		classifiedArmors.push(new armor_class(armor, index));
	});
	$dataArmors = classifiedArmors;
};
/**
* Gets the class reference to use when rewriting armors.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteArmorData()` for an example.
* @returns {RPG_Armor} The class reference.
*/
DataManager.armorRewriteClass = function() {
	return RPG_Armor;
};
/**
* Overwrites all class used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with classes.
*/
DataManager.rewriteClassData = function() {
	const classifiedClasses = [];
	$dataClasses.forEach((klass, index) => {
		if (!klass) {
			classifiedClasses.push(null);
			return;
		}
		const class_class = this.classRewriteClass();
		classifiedClasses.push(new class_class(klass, index));
	});
	$dataClasses = classifiedClasses;
};
/**
* Gets the class reference to use when rewriting classes.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteClassData()` for an example.
* @returns {RPG_Class} The class reference.
*/
DataManager.classRewriteClass = function() {
	return RPG_Class;
};
/**
* Overwrites all enemies used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with enemies.
*/
DataManager.rewriteEnemyData = function() {
	const classifiedEnemies = [];
	$dataEnemies.forEach((enemy, index) => {
		if (!enemy) {
			classifiedEnemies.push(null);
			return;
		}
		const enemy_class = this.enemyRewriteClass();
		classifiedEnemies.push(new enemy_class(enemy, index));
	});
	/** @type {RPG_Enemy[]} */
	$dataEnemies = classifiedEnemies;
};
/**
* Gets the class reference to use when rewriting enemies.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteEnemyData()` for an example.
* @returns {RPG_Enemy} The class reference.
*/
DataManager.enemyRewriteClass = function() {
	return RPG_Enemy;
};
/**
* Overwrites all items used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with items.
*/
DataManager.rewriteItemData = function() {
	const classifiedItems = [];
	$dataItems.forEach((item, index) => {
		if (!item) {
			classifiedItems.push(null);
			return;
		}
		const item_class = this.itemRewriteClass();
		classifiedItems.push(new item_class(item, index));
	});
	$dataItems = classifiedItems;
};
/**
* Gets the class reference to use when rewriting enemies.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteItemData()` for an example.
* @returns {RPG_Item} The class reference.
*/
DataManager.itemRewriteClass = function() {
	return RPG_Item;
};
/**
* Overwrites all skills used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with skills.
*/
DataManager.rewriteSkillData = function() {
	const classifiedSkills = [];
	$dataSkills.forEach((skill, index) => {
		if (!skill) {
			classifiedSkills.push(null);
			return;
		}
		const skill_class = this.skillRewriteClass();
		classifiedSkills.push(new skill_class(skill, index));
	});
	$dataSkills = classifiedSkills;
};
/**
* Gets the class reference to use when rewriting skills.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteSkillData()` for an example.
* @returns {RPG_Skill} The class reference.
*/
DataManager.skillRewriteClass = function() {
	return RPG_Skill;
};
/**
* Overwrites all states used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with states.
*/
DataManager.rewriteStateData = function() {
	const classifiedStates = [];
	$dataStates.forEach((state, index) => {
		if (!state) {
			classifiedStates.push(null);
			return;
		}
		const state_class = this.stateRewriteClass();
		classifiedStates.push(new state_class(state, index));
	});
	$dataStates = classifiedStates;
};
/**
* Gets the class reference to use when rewriting states.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteStateData()` for an example.
* @returns {RPG_State} The class reference.
*/
DataManager.stateRewriteClass = function() {
	return RPG_State;
};
/**
* Overwrites all weapons used by JABS and replaces them with extendable classes!
* These operate exactly as they used to, but now give developers a bit more of
* an interface to work when coding with weapons.
*/
DataManager.rewriteWeaponData = function() {
	const classifiedWeapons = [];
	$dataWeapons.forEach((weapon, index) => {
		if (!weapon) {
			classifiedWeapons.push(null);
			return;
		}
		const weapon_class = this.weaponRewriteClass();
		classifiedWeapons.push(new weapon_class(weapon, index));
	});
	$dataWeapons = classifiedWeapons;
};
/**
* Gets the class reference to use when rewriting weapons.
* The return value of this class should be stored and re-used with
* the `new` operator; see `DataManager.rewriteWeaponData()` for an example.
* @returns {RPG_Weapon} The class reference.
*/
DataManager.weaponRewriteClass = function() {
	return RPG_Weapon;
};
/**
* Checks whether or not the unidentified object is a skill.
* @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
* @returns {boolean} True if the object is a skill, false otherwise.
*/
DataManager.isSkill = function(unidentified) {
	return unidentified && "stypeId" in unidentified;
};
/**
* Checks whether or not the unidentified object is an item.
* @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
* @returns {boolean} True if the object is an item, false otherwise.
*/
DataManager.isItem = function(unidentified) {
	return unidentified && "itypeId" in unidentified;
};
/**
* Checks whether or not the unidentified object is a weapon.
* @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
* @returns {boolean} True if the object is a weapon, false otherwise.
*/
DataManager.isWeapon = function(unidentified) {
	return unidentified && "wtypeId" in unidentified;
};
/**
* Checks whether or not the unidentified object is an armor.
* @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
* @returns {boolean} True if the object is an armor, false otherwise.
*/
DataManager.isArmor = function(unidentified) {
	return unidentified && "atypeId" in unidentified;
};
/**
* Extends {@link #setupNewGame}.<br/>
* Also clears the RPGManager note cache for a fresh session.
*/
J.BASE.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	RPGManager.clearCache();
	J.BASE.Aliased.DataManager.get("setupNewGame").call(this);
};
/**
* Extends {@link #extractSaveContents}.<br/>
* Also clears the RPGManager note cache before applying save data, and drops the derived caches the
* restored battlers came back holding.
*/
J.BASE.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents) {
	RPGManager.clearCache();
	J.BASE.Aliased.DataManager.get("extractSaveContents").call(this, contents);
	this.invalidateLoadedBattlerCaches();
};
/**
* Drops every derived cache on every actor that was just restored from a savefile.
*
* A savefile is a snapshot of live objects, so a battler's caches come back holding database rows
* that were copied at save time- and they come back *warm*, because every cache guard in the
* codebase tests `!== null` and a populated cache is exactly what was written. Nothing else in the
* load path notices: {@link Scene_Load.reloadMapIfUpdated} is the one mechanism that reacts to the
* database having changed, and it reloads the map without ever touching an actor.
*
* So a loaded actor keeps its stale traits, notes, and derived numbers until some unrelated state
* or equip change happens to fire {@link Game_Battler.onBattlerDataChange}. In combat that is
* immediate and the bug is invisible; standing on the map it may never happen at all. That is why
* editing a state's traits and loading a save appears to do nothing.
*
* {@link Game_Battler.onBattlerDataChange} is the right hammer here rather than nulling the five
* known caches by hand, because it also runs {@link JCache.invalidateAllForBattler}- which walks
* every battler-dimensioned {@link JCache} ever constructed and drops this battler's subtree from
* each. That makes this method self-maintaining: a cache added years from now is covered without
* anyone remembering to come back here.
*/
DataManager.invalidateLoadedBattlerCaches = function() {
	$gameActors.existingActors().forEach((actor) => actor.onBattlerDataChange());
};
/**
* Extends {@link #setupBattleTest}.<br/>
* Also clears the RPGManager note cache when entering battle test.
*/
J.BASE.Aliased.DataManager.set("setupBattleTest", DataManager.setupBattleTest);
DataManager.setupBattleTest = function() {
	RPGManager.clearCache();
	J.BASE.Aliased.DataManager.get("setupBattleTest").call(this);
};

//#endregion
//#region src/plugins/_base/core/managers/ExternalJsonConfigLoader.js
/**
* A centralized loader for external JSON configuration files in the project.
*
* This is intended to eliminate duplicated "read file → guard null/empty → JSON.parse try/catch → validate → classify"
* boilerplate across plugin metadata initializers.
*
* This loader is deliberately "domain-agnostic": it knows how to read and parse JSON, but it does not know what the
* JSON means. Callers can provide a validator and/or mapper to enforce plugin-specific shapes and transform the parsed
* blob into a classified result.
*/
var ExternalJsonConfigLoader = class {
	/**
	* Loads, parses, validates, and optionally maps JSON configuration from a project-relative path.
	* @template TConfigJson The raw JSON shape after {@link JSON.parse}.
	* @template TConfigResult The optional mapped/classified result shape.
	* @param {string} configPath Project-relative path, ex: `data/config.sdp.json`.
	* @param {ExternalJsonConfigLoaderOptions<TConfigJson, TConfigResult>=} options Additional options to customize
	* behavior.
	* @returns {TConfigResult|TConfigJson} The parsed JSON blob, or mapped result if a mapper was provided.
	*/
	static load(configPath, options = null) {
		const actualOptions = options ?? new ExternalJsonConfigLoaderOptions();
		const rawConfig = StorageManager.fsReadFile(configPath);
		if (rawConfig === null || rawConfig === String.empty) {
			throw this.#missingConfigError(configPath, actualOptions.pluginName, actualOptions.configName);
		}
		let parsed;
		try {
			parsed = JSON.parse(rawConfig);
		} catch (e) {
			const prefix = this.#errorPrefix(actualOptions.pluginName, actualOptions.configName);
			throw new Error(`${prefix}failed to parse JSON at ${configPath}: ${e.message}`);
		}
		if (parsed === null) {
			throw this.#missingConfigError(configPath, actualOptions.pluginName, actualOptions.configName);
		}
		if (actualOptions.validator) {
			try {
				actualOptions.validator(parsed);
			} catch (e) {
				const prefix = this.#errorPrefix(actualOptions.pluginName, actualOptions.configName);
				throw new Error(`${prefix}invalid JSON config at ${configPath}: ${e.message}`);
			}
		}
		const result = actualOptions.mapper ? actualOptions.mapper(parsed) : parsed;
		if (J.BASE.Metadata.ShowExternalFileLoadInfo) {
			this.#logLoadInfo(configPath, result, actualOptions.logSummary);
		}
		return result;
	}
	/**
	* Builds and returns a standardized "missing config" Error.
	* @param {string} configPath The path that was attempted.
	* @param {string=} pluginName The plugin name for message context.
	* @param {string=} configName The config name for message context.
	* @returns {Error}
	*/
	static #missingConfigError(configPath, pluginName, configName) {
		const prefix = this.#errorPrefix(pluginName, configName);
		const label = configName ?? "configuration";
		return new Error(`${prefix}missing ${label} file at ${configPath}.`);
	}
	/**
	* Builds a consistent prefix for all errors emitted by this loader.
	* @param {string=} pluginName The plugin name for message context.
	* @param {string=} configName The config name for message context.
	* @returns {string}
	*/
	static #errorPrefix(pluginName, configName) {
		const parts = [];
		if (pluginName) parts.push(pluginName);
		if (configName) parts.push(configName);
		if (parts.length === 0) return String.empty;
		return `[${parts.join("::")}] `;
	}
	/**
	* Logs informational details about what was loaded from disk.
	* @param {string} configPath The project-relative config path.
	* @param {any} result The result of loading (parsed or mapped).
	* @param {(result: any) => string|string[]=} logSummary Optional summary builder.
	*/
	static #logLoadInfo(configPath, result, logSummary) {
		if (logSummary) {
			const built = logSummary(result);
			const lines = Array.isArray(built) ? built : [built];
			const indented = lines.map((line) => `      ${line}`);
			const body = indented.join("\n");
			Diagnostics.info("J-Base", `loaded:\n${body}\n      from file ${configPath}.`);
			return;
		}
		Diagnostics.info("J-Base", `loaded external JSON from file ${configPath}.`);
	}
};

//#endregion
//#region src/plugins/_base/core/managers/Graphics.js
/**
* The horizontal padding between {@link Graphics.width} and {@link Graphics.boxWidth}.<br>
* When combined with {@link Graphics.verticalPadding}, the origin x,y can be easily
* determined.
* @returns {number} Always positive.
*/
Object.defineProperty(Graphics, "horizontalPadding", { get: function() {
	return Math.abs(this.width - this.boxWidth);
} });
/**
* The vertical padding between {@link Graphics.height} and {@link Graphics.boxHeight}.<br>
* @returns {number} Always positive.
*/
Object.defineProperty(Graphics, "verticalPadding", { get: function() {
	return Math.abs(this.height - this.boxHeight);
} });
/**
* The origin x and y coordinates of the "box" width and height values.
* @returns {[number, number]} A destructurable array of the box's ox and oy coordinates.
*/
Object.defineProperty(Graphics, "boxOrigin", { get: function() {
	return [this.horizontalPadding, this.verticalPadding];
} });

//#endregion
//#region src/plugins/_base/core/managers/InputDeviceTracker.js
/**
* Tracks which kind of device the player most recently gave input with.
*
* The engine offers no way to ask this. {@link Input._currentState} is keyed by button name and both
* the keyboard handler and the gamepad poller write into that same map, so by the time any state is
* observable the device that produced it is gone. {@link Input._latestButton} records *what* was
* pressed, never *by what*.
*
* The answer therefore has to be captured at the moment of the write, which is what the aliases in
* `managers/Input.js` do. This tracker is only the place the answer is kept, deliberately separated
* from the capturing so that consumers depend on a question rather than on a mechanism- if this is
* ever replaced by an explicit player-facing setting, {@link #currentDevice} is the single method that
* changes and nothing that draws a glyph has to know.
*/
var InputDeviceTracker = class {
	/**
	* The device the player most recently used.
	* @type {string} One of {@link InputDevice}.
	*/
	static #currentDevice = InputDevice.Keyboard;
	/**
	* Whether the player has actually given input with anything yet.
	*
	* Kept apart from the device itself to solve the opening moments of a session: a player who booted
	* the game with a controller already plugged in has not pressed anything, so nothing has claimed the
	* device, and defaulting blindly to keyboard would greet exactly the wrong audience with keyboard
	* glyphs. Until a real press arrives, the mere presence of a pad is allowed to decide. After one, the
	* player's own input outranks presence forever.
	* @type {boolean}
	*/
	static #claimed = false;
	/**
	* Gets the device the player is currently using.
	* @returns {string} One of {@link InputDevice}.
	*/
	static currentDevice() {
		return this.#currentDevice;
	}
	/**
	* Gets whether the player is currently using a gamepad.
	* @returns {boolean}
	*/
	static isGamepad() {
		return this.#currentDevice === InputDevice.Gamepad;
	}
	/**
	* Gets whether the player is currently using a keyboard.
	* @returns {boolean}
	*/
	static isKeyboard() {
		return this.#currentDevice === InputDevice.Keyboard;
	}
	/**
	* Records that the player just gave input with the keyboard.
	*/
	static markKeyboard() {
		this.#claimed = true;
		this.#currentDevice = InputDevice.Keyboard;
	}
	/**
	* Records that the player just gave input with a gamepad.
	*/
	static markGamepad() {
		this.#claimed = true;
		this.#currentDevice = InputDevice.Gamepad;
	}
	/**
	* Records that a gamepad is connected, without claiming that the player used it.
	*
	* A pad sitting connected and idle is weak evidence, so it only counts while there is no stronger
	* evidence available. This is what makes the first glyphs a controller player ever sees correct,
	* rather than correct only after they have pressed something.
	*/
	static noteGamepadPresent() {
		if (this.#claimed === true) return;
		this.#currentDevice = InputDevice.Gamepad;
	}
	/**
	* Restores this tracker to its initial state.
	*
	* Deliberately not wired to {@link Input.clear}, which the engine calls on window blur- alt-tabbing
	* out of the game is not the player changing controllers, and treating it as such would make the
	* legend rewrite itself every time focus moved.
	*/
	static reset() {
		this.#currentDevice = InputDevice.Keyboard;
		this.#claimed = false;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/Input.js
/**
* Gets the merged input state for the current frame.
* @returns {Object<string, boolean>} The current state, keyed by input symbol.
*/
Input.currentState = function() {
	return this._currentState;
};
/**
* Gets the per-gamepad button state snapshots, indexed by gamepad index.
* @returns {Object<number, boolean[]>} The gamepad states.
*/
Input.gamepadStates = function() {
	return this._gamepadStates;
};
/**
* The deflection an analog axis must exceed before it counts as deliberate input.
*
* Matches the threshold the engine itself uses when it synthesizes D-pad presses from stick axes, so
* that a stick claiming the device and a stick moving the cursor agree on what "pushed" means.
* @returns {number}
*/
Input.gamepadAxisThreshold = function() {
	return .5;
};
/**
* Determines whether the player is currently holding anything on the given gamepad.
*
* Asked every frame while a pad is connected, so it answers "is something pressed right now" rather
* than "did something just change". That distinction matters: the engine's own state loop fires on
* releases too, and a release is not a reason to decide the player switched devices.
* @param {Gamepad} gamepad The gamepad to inspect.
* @returns {boolean}
*/
Input.isGamepadActive = function(gamepad) {
	const buttonHeld = gamepad.buttons.some((button) => button.pressed === true);
	if (buttonHeld === true) return true;
	const threshold = this.gamepadAxisThreshold();
	return gamepad.axes.some((axis) => Math.abs(axis) > threshold);
};
/**
* Determines whether a key is one the game actually binds to something.
*
* The browser reports every key the player touches, the overwhelming majority of which the game has no
* use for. Treating those as evidence about the player's chosen device would mean an errant screenshot
* hotkey or a cat on the keyboard silently rewrites a controller player's legend, so only keys the game
* would genuinely act on get a say.
* @param {number} keyCode The key code reported by the browser.
* @returns {boolean}
*/
Input.isMappedKeyCode = function(keyCode) {
	const buttonName = this.keyMapper[keyCode];
	return buttonName !== undefined;
};
/**
* Extends {@link Input._onKeyDown}.<br/>
* Also records that the player is currently using a keyboard.
*
* This is one of only two places in the engine where a device writes into the merged input state, which
* is why aliasing it is exhaustive rather than a heuristic.
*/
J.BASE.Aliased.Input.set("_onKeyDown", Input._onKeyDown);
Input._onKeyDown = function(event) {
	if (this.isMappedKeyCode(event.keyCode) === true) {
		InputDeviceTracker.markKeyboard();
	}
	J.BASE.Aliased.Input.get("_onKeyDown").call(this, event);
};
/**
* Extends {@link Input._updateGamepadState}.<br/>
* Also records that the player is currently using a gamepad.
*
* The other of the two device-specific writers into the merged input state. Unlike the keyboard's, this
* one runs every frame for every connected pad whether or not the player touched it, so presence and
* use have to be reported separately.
* @param {Gamepad} gamepad The gamepad whose state is being read.
*/
J.BASE.Aliased.Input.set("_updateGamepadState", Input._updateGamepadState);
Input._updateGamepadState = function(gamepad) {
	J.BASE.Aliased.Input.get("_updateGamepadState").call(this, gamepad);
	InputDeviceTracker.noteGamepadPresent();
	if (this.isGamepadActive(gamepad) === false) return;
	InputDeviceTracker.markGamepad();
};

//#endregion
//#region src/plugins/_base/core/managers/InputLegendResolver.js
/**
* A registry translating semantic input handlers into something displayable to the player.
*
* Windows bind semantic handler names- `context`, `content-next`, `actor-prev`- rather than physical
* buttons, which is what lets one input mapping serve the whole ecosystem. The cost is that a legend
* wanting to tell the player "press Triangle" has nothing to read: the semantic name is all there is.
*
* This registry closes that gap without creating a dependency. J-Base knows only that a resolver may
* exist; whichever plugin actually owns the input mapping registers one at boot. With a resolver
* present, legends render live controller glyphs that follow the player's remapping. Without one,
* they fall back to the plain text label the caller supplied, which is always readable.
*/
var InputLegendResolver = class {
	/**
	* The registered resolver function, if any.
	* @type {?function(string): string}
	*/
	static #resolver = null;
	/**
	* Registers the function responsible for turning a semantic handler name into display text.
	*
	* The resolver is expected to return {@link String.empty} for anything it cannot describe, which
	* lets the caller keep its own fallback rather than rendering a blank.
	* @param {function(string): string} resolver Receives a semantic name, returns display text.
	*/
	static registerResolver(resolver) {
		this.#resolver = resolver;
	}
	/**
	* Gets whether a resolver has been registered.
	* @returns {boolean}
	*/
	static hasResolver() {
		return this.#resolver !== null;
	}
	/**
	* Resolves a semantic handler name into display text.
	* @param {string} semantic The semantic handler name, such as `context` or `actor-next`.
	* @param {string} fallback The text to use when no resolver can describe this semantic.
	* @returns {string}
	*/
	static resolve(semantic, fallback) {
		if (this.hasResolver() === false) return fallback;
		const resolved = this.#resolver(semantic);
		if (resolved === String.empty) return fallback;
		return resolved;
	}
	/**
	* Clears the registered resolver, restoring plain-text fallback behavior.
	*/
	static clearResolver() {
		this.#resolver = null;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/ImageManager.js
/**
* Generates a promise based on the resolution of the bitmap.
* If the promise resolves successfully, it'll contain the bitmap.
* If the promise rejects, then it is up to the handler how to deal with that.
* @param {string} filename The name of the file without the file extension.
* @param {string} directory The name of the directory to find the filename in (include trailing slash!).
* @returns {Promise}
*/
ImageManager.loadBitmapPromise = function(filename, directory) {
	const bitmapPromise = new Promise((resolve, reject) => {
		const bitmap = this.loadBitmap(`${directory}`, filename, 0, true);
		bitmap.addLoadListener((thisBitmap) => {
			if (thisBitmap.isReady()) {
				resolve(thisBitmap);
			} else if (thisBitmap.isError()) reject();
		});
	});
	return bitmapPromise;
};
/**
* The number of columns that exist on the iconsheet.
* @type {number}
*/
ImageManager.iconColumns = 16;

//#endregion
//#region src/plugins/_base/core/managers/NoteResolver.js
/**
* Merges one note into another, tag-aware.
*
* Notes are J-Base's business: it hydrates every `$data*` row into an `RPG_*` model, {@link RPGManager}
* reads tags off them, and {@link TraitResolver} merges the structured half of the same problem. The
* note merger belongs beside them rather than inside whichever plugin happened to need it first.
*
* **The policy is a parameter, deliberately.** Which keys accumulate rather than replace is a decision
* the caller states outright, not something read from a registry populated at boot. That matters because
* merged notes can outlive the merge: JAFTING replays a refined equip's provenance on every load, so a
* merge that consulted a global would silently produce different results once another plugin registered
* a key. Passing the policy in makes the output a function of nothing but its arguments.
*
* Three behaviors, and they line up with how the tags are read back:
* - **replace** (the default) suits a tag read by a scalar reader like
*   {@link RPGManager.getNumberFromNoteByRegex}, which takes the last match on a note and ignores the
*   rest. Appending a second one would silently discard the first.
* - **accumulate** suits a tag read by a collecting reader like
*   {@link RPGManager.getArraysFromNotesByRegex}, where every occurrence contributes.
* - **sum** suits a numeric tag that should total rather than choose between two values. Stacking those
*   as repeated lines cannot work: {@link #_toKeyBuckets} drops an exact duplicate line *within* a single
*   note, so `<bonusHits:2>` written twice collapses to one and reads as two forever. Totalling them into
*   one line is the only representation that survives being merged again.
*/
var NoteResolver = class NoteResolver {
	/**
	* The shapes a note line can take.
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
		* A line this framework has no opinion about - free-form prose, or malformed brackets.
		*/
		unsupported: "unsupported"
	};
	/**
	* Merges the overlay note into the base note, keyed by tag name.
	*
	* Keys absent from `accumulatingKeys` are replaced outright when the overlay offers any line for
	* them, and left alone when it does not. Keys present in it keep the base's lines and gain the
	* overlay's unique ones. Free-form lines survive from both sides, deduplicated, base first.
	*
	* Keys compare case-insensitively; a tag is anything wrapped in angle brackets.
	* @param {string} baseNote The note being merged into.
	* @param {string} overlayNote The note being merged in.
	* @param {string[]} accumulatingKeys Keys that gain the overlay's lines instead of being replaced by
	* them. Empty means every key replaces, which is the conservative reading.
	* @param {string[]} summingKeys Keys whose two scalar values total into one line. A key listed here that
	* does not hold a single plain number on each side falls back to accumulating, never to replacing, so a
	* mis-declared key cannot silently discard what the base already had.
	* @returns {string} The merged note, newline-joined.
	*/
	static merge(baseNote, overlayNote, accumulatingKeys = [], summingKeys = []) {
		const oldNote = baseNote || String.empty;
		const newNote = overlayNote || String.empty;
		const oldTokens = this._tokenizeNote(oldNote);
		const newTokens = this._tokenizeNote(newNote);
		const oldBuckets = this._toKeyBuckets(oldTokens.tags);
		const newBuckets = this._toKeyBuckets(newTokens.tags);
		const merged = this._mergeBuckets(oldBuckets, newBuckets, accumulatingKeys, summingKeys);
		const mergedUnsupported = this._mergeUnsupported(oldTokens.unsupported, newTokens.unsupported);
		return this._reconstructNote(mergedUnsupported, merged);
	}
	/**
	* Tokenizes a note into angle-bracketed tags and everything else.
	*
	* Tags are extracted by pattern rather than by line, so several crammed onto one line are still seen
	* individually. Anything that is not itself exactly a tag counts as free-form.
	* @param {string} note The raw note text.
	* @returns {{tags: string[], unsupported: string[]}} The extracted tags and free-form lines.
	*/
	static _tokenizeNote(note) {
		const tags = note.match(/<[^>]+>/g) || [];
		const rawLines = note.split(/[\r\n]+/).filter((l) => l.length > 0);
		const tagSet = new Set(tags);
		const unsupported = rawLines.filter((l) => tagSet.has(l) === false);
		return {
			tags,
			unsupported
		};
	}
	/**
	* Parses a single tag into its key and shape.
	* @param {string} tag The tag, e.g. "<range:5>" or "<direct>".
	* @returns {{type: string, key: (string|null), line: string}} The parsed record.
	*/
	static _parseTag(tag) {
		const type = this._classifyLine(tag);
		if (type === NoteResolver.LineType.unsupported) {
			return {
				type,
				key: null,
				line: tag
			};
		}
		const inner = tag.substring(1, tag.length - 1);
		if (type === NoteResolver.LineType.kvp) {
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
			type: NoteResolver.LineType.boolean,
			key,
			line: tag
		};
	}
	/**
	* Determines which shape a note line takes.
	* @param {string} line The note line to classify.
	* @returns {string} One of {@link NoteResolver.LineType}.
	*/
	static _classifyLine(line) {
		if (line.startsWith("<") === false || line.endsWith(">") === false) return NoteResolver.LineType.unsupported;
		if (line.match(/</g).length > 1) return NoteResolver.LineType.unsupported;
		if (line.match(/>/g).length > 1) return NoteResolver.LineType.unsupported;
		if (line.includes(":")) return NoteResolver.LineType.kvp;
		return NoteResolver.LineType.boolean;
	}
	/**
	* Groups tags under their keys, keeping first-seen key order and dropping exact duplicate lines.
	* @param {string[]} tags The tag strings to bucket.
	* @returns {{ order: string[], map: Record<string, string[]> }} The ordered keys and per-key lines.
	*/
	static _toKeyBuckets(tags) {
		const order = [];
		const map = Object.create(null);
		tags.forEach((tag) => {
			const parsed = this._parseTag(tag);
			if (parsed.type === NoteResolver.LineType.unsupported) return;
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
	* Applies replace-or-accumulate across two sets of buckets.
	*
	* Base key order is the baseline, so a merge never reshuffles what was already there. Keys only the
	* overlay has arrive afterwards, in its own order.
	* @param {{order: string[], map: Record<string, string[]>}} oldBuckets The base note's buckets.
	* @param {{order: string[], map: Record<string, string[]>}} newBuckets The overlay note's buckets.
	* @param {string[]} accumulatingKeys Keys that gain the overlay's lines rather than being replaced.
	* @param {string[]} summingKeys Keys whose two scalar values total into one line.
	* @returns {{ order: string[], map: Record<string, string[]> }} The merged buckets.
	*/
	static _mergeBuckets(oldBuckets, newBuckets, accumulatingKeys, summingKeys = []) {
		const mergedMap = Object.create(null);
		const mergedOrder = [];
		/**
		* Records a key's finished lines, ignoring a key that ended up with none.
		* @param {string} key The tag key.
		* @param {string[]} lines The lines that survived for it.
		*/
		const appendKey = (key, lines) => {
			if (!lines || lines.length === 0) return;
			mergedMap[key] = lines.slice(0);
			mergedOrder.push(key);
		};
		oldBuckets.order.forEach((key) => {
			const oldLines = oldBuckets.map[key];
			const newLines = newBuckets.map[key];
			const overlayHasAny = newLines !== undefined && newLines.length > 0;
			if (overlayHasAny === false) {
				appendKey(key, oldLines);
				return;
			}
			if (summingKeys.includes(key)) {
				const summed = this._sumScalarLines(oldLines, newLines);
				if (summed !== null) {
					appendKey(key, [summed]);
					return;
				}
			}
			if (accumulatingKeys.includes(key) || summingKeys.includes(key)) {
				const combined = oldLines.slice(0);
				newLines.forEach((line) => {
					if (combined.includes(line) === false) combined.push(line);
				});
				appendKey(key, combined);
				return;
			}
			appendKey(key, newLines);
		});
		newBuckets.order.forEach((key) => {
			if (mergedOrder.includes(key) === false) appendKey(key, newBuckets.map[key]);
		});
		return {
			order: mergedOrder,
			map: mergedMap
		};
	}
	/**
	* Totals two single-line scalar tags into one line, or reports that it cannot.
	*
	* Both sides must hold exactly one line, and both values must read as a plain number. A key already
	* carrying several lines is not a scalar - whatever it is, adding it up would be inventing a number
	* nobody wrote - so it declines rather than guessing.
	*
	* The base's spelling of the key is kept, so a merge never quietly recases a tag the author wrote.
	* @param {string[]} oldLines The base note's lines for this key.
	* @param {string[]} newLines The overlay note's lines for this key.
	* @returns {string|null} The totalled line, or null when the pair is not two scalars.
	*/
	static _sumScalarLines(oldLines, newLines) {
		if (oldLines.length !== 1 || newLines.length !== 1) return null;
		const scalarShape = /^<([^:]+):\s*(-?\d+(?:\.\d+)?)\s*>$/;
		const oldMatch = oldLines[0].match(scalarShape);
		const newMatch = newLines[0].match(scalarShape);
		if (oldMatch === null || newMatch === null) return null;
		const total = parseFloat(oldMatch[2]) + parseFloat(newMatch[2]);
		const tidied = parseFloat(total.toFixed(4));
		return `<${oldMatch[1]}:${tidied}>`;
	}
	/**
	* Merges free-form lines, base order first, without duplicates.
	* @param {string[]} oldUnsupported The base note's free-form lines.
	* @param {string[]} newUnsupported The overlay note's free-form lines.
	* @returns {string[]} The merged lines.
	*/
	static _mergeUnsupported(oldUnsupported, newUnsupported) {
		const merged = [];
		oldUnsupported.forEach((line) => {
			if (merged.includes(line) === false) merged.push(line);
		});
		newUnsupported.forEach((line) => {
			if (merged.includes(line) === false) merged.push(line);
		});
		return merged;
	}
	/**
	* Rebuilds note text from free-form lines and merged tag buckets.
	*
	* Free-form content leads, then tags grouped by key in key order, so the result is stable enough to
	* diff between two merges of the same inputs.
	* @param {string[]} unsupported The free-form lines to emit first.
	* @param {{order: string[], map: Record<string, string[]>}} buckets The merged buckets.
	* @returns {string} The reconstructed note text.
	*/
	static _reconstructNote(unsupported, buckets) {
		const parts = [];
		unsupported.forEach((line) => parts.push(line));
		buckets.order.forEach((key) => {
			buckets.map[key].forEach((line) => parts.push(line));
		});
		return parts.join("\n");
	}
};

//#endregion
//#region src/plugins/_base/core/database/miscellaneous/RPG_SoundEffect.js
/**
* The structure of the data points required to play a sound effect using the {@link SoundManager}.
*/
var RPG_SoundEffect = class {
	/**
	* The name of the sound effect.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The L/R adjustment of the sound effect.
	* @type {number}
	*/
	pan = 0;
	/**
	* The high/low pitch of the sound effect.
	* @type {number}
	*/
	pitch = 100;
	/**
	* The volume of the sound effect.
	* @type {number}
	*/
	volume = 100;
	/**
	* Constructor.
	* @param {string} name The name of the sound effect.
	* @param {number} volume The volume of the sound effect.
	* @param {number} pitch The high/low pitch of the sound effect.
	* @param {number} pan The L/R adjustment of the sound effect.
	*/
	constructor(name, volume = 100, pitch = 100, pan = 0) {
		this.name = name;
		this.pan = pan;
		this.pitch = pitch;
		this.volume = volume;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/SoundManager.js
/**
* Plays the sound effect provided.
* @param {RPG_SoundEffect} se The sound effect to play.
*/
SoundManager.playSoundEffect = function(se) {
	AudioManager.playStaticSe(se);
};

//#endregion
//#region src/plugins/_base/core/managers/TextManager.js
/**
* Gets the proper name of "max tp".
* @returns {string} The name of the parameter.
*/
TextManager.maxTp = function() {
	return "Max Tech";
};
/**
* Display label for HAR — the sender-side counterpart to REC.
* @returns {string}
*/
TextManager.har = function() {
	return "Healing Rate";
};
/**
* Help text explaining what HAR does.
* @returns {string[]}
*/
TextManager.harDescription = function() {
	return ["The percentage effectiveness of outgoing healing.", "Higher amounts of this will make healing others need less effort."];
};
/**
* Gets the "current resource" name for a given parameter id.
* This is the shorter, in-world name for the living resource itself
* as opposed to the stat-cap name (e.g. "Life" vs "Max Life").
* Use this when describing resource recovery rather than a stat modifier.
*
* Supported ids:
*  0  → HP  ("Life")
*  1  → MP  ("Magi")
*  30 → TP  ("Tech")
* @param {number} paramId The resource param id (0, 1, or 30).
* @returns {string} The in-world resource name.
*/
TextManager.resource = function(paramId) {
	switch (paramId) {
		case 0: return "Life";
		case 1: return "Magi";
		case 30: return "Tech";
	}
	Diagnostics.warn("J-Base", `TextManager.resource: unrecognized paramId [${paramId}].`);
	return String.empty;
};
/**
* Gets the name of the reward parameter.
* @param {number} paramId The paramId to get the reward text for.
* @returns {string}
*/
TextManager.rewardParam = function(paramId) {
	switch (paramId) {
		case 0: return this.exp;
		case 1: return this.currencyUnit;
		case 2: return "Drop Rate";
		case 3: return "Encounter Rate";
		case 4: return "SDP Point Rate";
	}
};
/**
* The double-line descriptions for various rewards.
* @param {number} paramId The id of the reward parameter.
* @returns {string[]}
*/
TextManager.rewardDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The resource required to accumulate to rise in level.", "Levels give unseen advantages."];
		case 1: return ["The primary currency of the universe.", "Most vendors happily take this in exchange for goods."];
		case 2: return ["The rate at which enemies will drop loot.", "Higher rates yield more frequent drops."];
		case 3: return ["The frequency of which the party will be engage in battles.", "Lower rates result in less random encounters."];
		case 4: return ["The rate of SDP accumulation from any source.", "Bigger rates yield fatter stacks of them sweet SDP points."];
	}
};
/**
* Whether a given registry key is a known catalog parameter.<br/>
* Public surface for other plugins (e.g. J-MessageTextCodes) to distinguish "unregistered key"
* from a legitimately-falsy/zero result, since {@link TextManager.parameterLabel}/
* {@link IconManager.parameterIcon}/{@link ColorManager.parameterColor} each fall back to a
* plausible-looking default instead of surfacing the miss.
* @param {string} parameterKey The registry key.
* @returns {boolean}
*/
TextManager.hasParameter = function(parameterKey) {
	return ParameterRegistry.has(parameterKey);
};
/**
* Gets the display label for a catalog parameter key.
* @param {string} parameterKey The registry key.
* @returns {string}
*/
TextManager.parameterLabel = function(parameterKey) {
	const definition = ParameterRegistry.get(parameterKey);
	if (!definition) {
		return parameterKey;
	}
	return definition.label();
};
/**
* Gets the double-line description for a catalog parameter key.
* @param {string} parameterKey The registry key.
* @returns {string[]}
*/
TextManager.parameterDescription = function(parameterKey) {
	const definition = ParameterRegistry.get(parameterKey);
	if (!definition) {
		return [String.empty];
	}
	return definition.description();
};
/**
* The double-line descriptions for the b-parameters.
* @param {number} paramId The id of the parameter.
* @returns {string[]}
*/
TextManager.bparamDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The base resource that defines life and death.", "Enemies and allies alike obey the rule of '0hp = dead'."];
		case 1: return ["The base resource that most magic-based spells consume.", "Without this, spells typically cannot be cast."];
		case 2: return ["The base stat that influences physical damage.", "Higher amounts of this yield higher physical damage output."];
		case 3: return ["The base stat that reduces physical damage.", "Higher amounts of this will reduce incoming physical damage."];
		case 4: return ["The base stat that influences magical damage.", "Higher amounts of this yield higher magical damage output."];
		case 5: return ["The base stat that reduces magical damage.", "Higher amounts of this will reduce incoming magical damage."];
		case 6: return ["The base stat that governs movement and agility.", "The effects of this are unknown at higher levels."];
		case 7: return ["The base stat that governs fortune and luck.", "The effects of this are wide and varied."];
		case 30: return ["The base resource that many weapon-based skills utilize.", "Without this, techniques typically cannot be executed."];
	}
};
/**
* The double-line descriptions for the x-parameters.
* @param {number} paramId The id of the parameter.
* @returns {string[]}
*/
TextManager.xparamDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The stat representing one's skill of accuracy.", "Being more accurate will result in being parried less."];
		case 1: return ["The stat representing skill in physically evading attacks.", "Having higher evasion will cause incoming hits to be dodged."];
		case 2: return ["A numeric value to one's chance of landing a critical hit.", "Critical hits will deal percent-increased damage."];
		case 3: return ["A numeric value to one's chance of evading a critical hit.", "Enemy critical hit chance is directly reduced by this amount."];
		case 4: return ["A numeric value to one's chance of evading a magical hit.", "Enemy magical hit chance is directly reduced by this amount."];
		case 5: return ["The chance of reflecting a skill back to its caster.", "Aside from it being reflected back, it is as if you casted it."];
		case 6: return ["The chance of auto-executing counter skills when struck.", "Being un-reducable, 100 makes countering inevitable."];
		case 7: return ["The amount of Life restored over 5 seconds.", "Recovery Rate amplifies this effect."];
		case 8: return ["The amount of Magi rejuvenated over 5 seconds.", "Recovery Rate amplifies this effect."];
		case 9: return ["The amount of Tech recovered over 5 seconds.", "Recovery Rate amplifies this effect."];
	}
};
/**
* The double-line descriptions for the s-parameters.
* @param {number} paramId The id of the parameter.
* @returns {string[]}
*/
TextManager.sparamDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The percentage of aggro that will be applied.", "Reduce for stealthing; increase for taunting."];
		case 1: return ["A numeric value representing the frequency of parrying.", "More of this will result in auto-parrying faced foes."];
		case 2: return ["The percentage effectiveness of incoming healing.", "Higher amounts of this will make healing you need less effort."];
		case 3: return ["The percentage effectiveness of items applied to oneself.", "Higher amounts of this will make items more potent."];
		case 4: return ["The percentage bonuses being applied to Magi costs.", "Enemy magical hit chance is directly reduced by this amount."];
		case 5: return ["The percentage bonuses being applied to Tech generation.", "Taking and dealing damage in combat will earn more Tech."];
		case 6: return ["The percentage bonuses being applied to physical damage.", "-100 is immune while 100+ takes double+ physical damage."];
		case 7: return ["The percentage bonuses being applied to magical damage.", "-100 is immune while 100+ takes double+ magical damage."];
		case 8: return ["The percentage bonuses being applied to floor damage.", "-100 is immune while 100+ takes double+ floor damage."];
		case 9: return ["The percentage bonuses being applied to experience gain.", "Higher amounts of this result in faster level growth."];
	}
};
/**
* Gets the name of the given sp-parameter.
* @param {number} sParamId The id of the sp-param to get a name for.
* @returns {string} The name of the parameter.
*/
TextManager.sparam = function(sParamId) {
	switch (sParamId) {
		case 0: return "Aggro";
		case 1: return "Parry";
		case 2: return "Recovery Rate";
		case 3: return "Item Effects";
		case 4: return "Magi Cost";
		case 5: return "Tech Cost";
		case 6: return "Phys Dmg Rate";
		case 7: return "Magi Dmg Rate";
		case 8: return "Env Dmg Rate";
		case 9: return "Experience UP";
	}
};
/**
* Gets the name of the given ex-parameter.
* @param {number} xParamId The id of the ex-param to get a name for.
* @returns {string} The name of the parameter.
*/
TextManager.xparam = function(xParamId) {
	switch (xParamId) {
		case 0: return "Accuracy";
		case 1: return "Phys Evade";
		case 2: return "Crit Rate";
		case 3: return "Crit Dodge";
		case 4: return "Magic Evade";
		case 5: return "Magic Reflect";
		case 6: return "Autocounter";
		case 7: return "HP Regen";
		case 8: return "MP Rejuv";
		case 9: return "TP Restore";
	}
};
/**
* Gets the armor type name from the database.
* @param {number} id The 1-based index of the armor type to get the name of.
* @returns {string} The name of the armor type.
*/
TextManager.armorType = function(id) {
	return this.getTypeNameByIdAndType(id, $dataSystem.armorTypes);
};
/**
* Gets the weapon type name from the database.
* @param {number} id The 1-based index of the weapon type to get the name of.
* @returns {string} The name of the weapon type.
*/
TextManager.weaponType = function(id) {
	return this.getTypeNameByIdAndType(id, $dataSystem.weaponTypes);
};
/**
* Gets the skill type name from the database.
* @param {number} id The 1-based index of the skill type to get the name of.
* @returns {string} The name of the skill type.
*/
TextManager.skillType = function(id) {
	return this.getTypeNameByIdAndType(id, $dataSystem.skillTypes);
};
/**
* Gets the equip type name from the database.
* @param {number} id The 1-based index of the equip type to get the name of.
* @returns {string} The name of the equip type.
*/
TextManager.equipType = function(id) {
	return this.getTypeNameByIdAndType(id, $dataSystem.equipTypes);
};
/**
* Gets the element name from the database.
* `-1` and `0` are special cases,
* the former being for weapon attack elements,
* the latter being for "none" element.
* @param {number} id The index of the element to get the name of.
* @returns {string} The name of the element type.
*/
TextManager.element = function(id) {
	switch (true) {
		case id === -1: return this.weaponElementsName();
		case id === 0: return this.neutralElementName();
		default: return this.getTypeNameByIdAndType(id, $dataSystem.elements);
	}
};
/**
* The name for the element which is governed by all elements currently
* applied to your weapon.
* @returns {string}
*/
TextManager.weaponElementsName = function() {
	return "(Basic Attack)";
};
/**
* The name for the element which is supposed to be "None" in the database,
* @returns {string}
*/
TextManager.neutralElementName = function() {
	return "Neutral";
};
/**
* Gets a type name by its type collect and index.
* @param {number} id The 1-based index to get the type name of.
* @param {string[]} type The collection of names for a given type.
* @returns {string|String.empty} The requested type name, or an empty string if invalid.
*/
TextManager.getTypeNameByIdAndType = function(id, type) {
	if (!this.isValidTypeId(id, type)) return String.empty;
	return type.at(id);
};
/**
* Determines whether or not the id is a valid index for types.
* @param {number} id The 1-based index of the type to get the name of.
* @param {string[]} types The array of types to extract the name from.
* @returns {boolean} True if we can get the name, false otherwise.
*/
TextManager.isValidTypeId = function(id, types) {
	if (id === 0 && types !== $dataSystem.elements) {
		Diagnostics.error("J-Base", `requested type id of [0] is always blank, and thus invalid.`);
		return false;
	}
	if (id >= types.length) {
		Diagnostics.error("J-Base", `requested type id of [${id}] is higher than the number of types.`);
		return false;
	}
	return true;
};
/**
* Translates a usable effect code into its textual name.
* @param {number} code The numeric code for the effect.
* @return {string}
*/
TextManager.usableEffectByCode = function(code) {
	switch (code) {
		case 11: return "Recover Life";
		case 12: return "Recover Magi";
		case 13: return "Recover Tech";
		case 21: return "Add State";
		case 22: return "Remove State";
		case 31: return "Add Buff";
		case 32: return "Add Debuff";
		case 33: return "Remove Buff";
		case 34: return "Remove Debuff";
		case 41: return "Special";
		case 42: return "Core Stat Growth";
		case 43: return "Learn Skill";
		case 44: return "Execute Common Event";
		default:
			Diagnostics.warn("J-Base", `unsupported effect code of [${code}] was provided.`);
			return "UNKNOWN";
	}
};

//#endregion
//#region src/plugins/_base/core/managers/TraitManager.js
/**
* A static class that centralizes display data (name and icon) for traits and
* notetag-driven effects across the ecosystem.
*
* The goal is a single authoritative place where Jeremy can adjust how any
* given tag or trait type presents itself, so every window that renders trait
* data stays consistent without needing updates in multiple files.
*/
var TraitManager = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Returns the display name for a slip effect.
	* In JABS convention, negative values are healing and positive values are damage.
	* @param {'hp'|'mp'|'tp'} type The resource type the slip affects.
	* @param {number} evaluatedValue The resolved slip amount; sign determines direction.
	* @returns {string}
	*/
	static slipName(type, evaluatedValue) {
		const isDamage = Number(evaluatedValue) > 0;
		switch (type) {
			case "hp": return isDamage ? "HP Poison" : TextManager.xparam(7);
			case "mp": return isDamage ? "MP Leak" : TextManager.xparam(8);
			case "tp": return isDamage ? "TP Drain" : TextManager.xparam(9);
		}
		return "Slip";
	}
	/**
	* Returns the icon index for a slip effect.
	* In JABS convention, positive values use damage icons; negative values use the stat's regen icon.
	* @param {'hp'|'mp'|'tp'} type The resource type the slip affects.
	* @param {number} evaluatedValue The resolved slip amount; sign determines direction.
	* @returns {number}
	*/
	static slipIcon(type, evaluatedValue) {
		const isDamage = Number(evaluatedValue) > 0;
		switch (type) {
			case "hp": return isDamage ? 2 : IconManager.xparam(7);
			case "mp": return isDamage ? 67 : IconManager.xparam(8);
			case "tp": return isDamage ? 11 : IconManager.xparam(9);
		}
		return 0;
	}
};

//#endregion
//#region src/plugins/_base/core/managers/TraitResolver.js
/**
* A static class that centralizes trait-merging operations shared across the ecosystem.
*
* Two distinct merge strategies are exposed:
*  - {@link overlayTraits}  "last wins per code+dataId" — used by state extension.
*  - {@link refineTraits}   "keep better per code+dataId" — used by JAFTING refinement.
*
* Both strategies share the same underlying sub-operations (opposing-pair cancellation,
* no-duplicate filtering, parameter-trait additive combining) but differ in how they
* resolve conflicts between traits that share the same code and dataId.
*/
var TraitResolver = class {
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Pairs of trait codes that are semantically opposed.
	* When one side is present in the overlay and the other is present in the base,
	* both are cancelled (for refinement) or the base entry is removed (for overlay).
	* @type {[number, number][]}
	*/
	static #OpposingPairs = [[41, 42], [43, 44]];
	/**
	* Trait codes where having more than one entry with the same dataId is meaningless.
	* Duplicates are stripped from the incoming overlay/material list during merging.
	* @type {number[]}
	*/
	static #NoDuplicateCodes = [
		14,
		31,
		51,
		52,
		53,
		54,
		62,
		64
	];
	/**
	* Trait codes where a higher value is the "better" one (used by {@link refineTraits}).
	* @type {number[]}
	*/
	static #HigherIsBetterCodes = [
		32,
		33,
		34,
		61
	];
	/**
	* Trait codes where a lower value is the "better" one (used by {@link refineTraits}).
	* @type {number[]}
	*/
	static #LowerIsBetterCodes = [
		11,
		12,
		13
	];
	/**
	* Trait codes that have exactly one meaningful instance; the overlay/material version
	* always replaces the base version when both are present (used by {@link refineTraits}).
	* @type {number[]}
	*/
	static #AlwaysReplaceCodes = [35, 55];
	/**
	* Merges {@link overlayTraits} onto {@link baseTraits} using "last wins per code+dataId" semantics.
	*
	* For every trait in the overlay:
	*  - Any base trait sharing the same code+dataId is removed (the overlay wins).
	*  - If the overlay trait belongs to an opposing pair, the opposing code with the same
	*    dataId is also removed from the base (e.g. overlay "seal skill type 3" strips
	*    base "unlock skill type 3").
	*
	* All overlay traits are then appended to the surviving base traits.
	* @param {RPG_Trait[]} baseTraits The traits of the object being extended.
	* @param {RPG_Trait[]} overlayTraits The traits of the extension object.
	* @returns {RPG_Trait[]} The merged trait array.
	*/
	static overlayTraits(baseTraits, overlayTraits) {
		let result = baseTraits.map((t) => RPG_Trait.fromValues(t.code, t.dataId, t.value));
		overlayTraits.forEach((overlay) => {
			result = result.filter((t) => !(t.code === overlay.code && t.dataId === overlay.dataId));
			const opposing = this.#opposingCode(overlay.code);
			if (opposing !== null) {
				result = result.filter((t) => !(t.code === opposing && t.dataId === overlay.dataId));
			}
		});
		overlayTraits.forEach((t) => result.push(RPG_Trait.fromValues(t.code, t.dataId, t.value)));
		return result;
	}
	/**
	* Merges {@link materialTraits} onto {@link baseTraits} using "keep better per code+dataId" semantics.
	*
	* Steps applied in order:
	*  1. Additive combining of parameter traits (codes 21/22/23) within each list.
	*  2. Opposing-pair cancellation — conflicting pairs are removed from both lists.
	*  3. No-duplicate filtering — material entries are dropped if base already has them.
	*  4. Always-replace codes (35, 55) — base entry is removed when material has the same code.
	*  5. Keep-better resolution for rate/stackable codes — the lower-value or higher-value
	*     winner stays; the loser is removed from its list before the final concat.
	*  6. All surviving base traits are returned first, followed by remaining material traits.
	* @param {RPG_Trait[]} baseTraits The traits of the base equip being refined.
	* @param {RPG_Trait[]} materialTraits The traits of the material being consumed.
	* @returns {RPG_Trait[]} The merged trait array.
	*/
	/**
	* Folds all same-dataId traits within a single trait list into one combined entry per
	* dataId using additive math, for every code where additive stacking is meaningful.
	*
	* This covers the full display-relevant set:
	*  - Codes 11/12/13  (element/debuff/state rates)      — neutral 1.0, delta formula
	*  - Codes 21/22/23  (base/ex/sp parameter rates)      — neutral 1.0 or 0.0
	*  - Code  32        (attack state chance)              — neutral 0.0, straight additive
	*
	* Used by display and count consumers (e.g. JAFTING's {@link JaftingManager.parseTraits})
	* that need a clean, consolidated view of an equip's traits rather than raw separate entries.
	* Not used during merging — {@link refineTraits} and {@link overlayTraits} have their own
	* resolution semantics for these codes.
	* @param {RPG_Trait[]} traits The trait list to consolidate.
	* @returns {RPG_Trait[]} A new array with stackable traits combined per code+dataId.
	*/
	static consolidate(traits) {
		let result = traits.map((t) => RPG_Trait.fromValues(t.code, t.dataId, t.value));
		result = this.#combineParameterTraitsForCode(result, 11, 1);
		result = this.#combineParameterTraitsForCode(result, 12, 1);
		result = this.#combineParameterTraitsForCode(result, 13, 1);
		result = this.#combineParameterTraitsForCode(result, 21, 1);
		result = this.#combineParameterTraitsForCode(result, 22, 0);
		result = this.#combineParameterTraitsForCode(result, 23, 1);
		result = this.#combineParameterTraitsForCode(result, 32, 0);
		return result;
	}
	static refineTraits(baseTraits, materialTraits) {
		let base = this.#combineAllParameterTraits(baseTraits.map((t) => RPG_Trait.fromValues(t.code, t.dataId, t.value)));
		let material = this.#combineAllParameterTraits(materialTraits.map((t) => RPG_Trait.fromValues(t.code, t.dataId, t.value)));
		[base, material] = this.#cancelOpposingPairs(base, material);
		[base, material] = this.#filterNoDuplicates(base, material);
		for (const code of this.#AlwaysReplaceCodes) {
			[base, material] = this.#replaceCode(base, material, code);
		}
		[base, material] = this.#keepBetterAll(base, material);
		return [...base, ...material.map((t) => RPG_Trait.fromValues(t.code, t.dataId, t.value))];
	}
	/**
	* Returns the opposing code for a given trait code, or null if it has none.
	* @param {number} code The trait code to look up.
	* @returns {number|null}
	*/
	static #opposingCode(code) {
		for (const [a, b] of this.#OpposingPairs) {
			if (code === a) return b;
			if (code === b) return a;
		}
		return null;
	}
	/**
	* Runs additive parameter combining for codes 21, 22, and 23 on a single trait list.
	* Multiple entries with the same code+dataId are folded into one with a summed value.
	* @param {RPG_Trait[]} traits The trait list to process in place.
	* @returns {RPG_Trait[]}
	*/
	static #combineAllParameterTraits(traits) {
		let combined = this.#combineParameterTraitsForCode(traits, 21, 1);
		combined = this.#combineParameterTraitsForCode(combined, 22, 0);
		combined = this.#combineParameterTraitsForCode(combined, 23, 1);
		return combined;
	}
	/**
	* Folds all traits of a single code in the list into one per dataId using additive math.
	* @param {RPG_Trait[]} traits The trait list to process.
	* @param {number} code The trait code to combine.
	* @param {number} neutral The neutral value for this code (1 for rate traits, 0 for additive traits).
	* @returns {RPG_Trait[]}
	*/
	static #combineParameterTraitsForCode(traits, code, neutral) {
		const tracker = {};
		const toRemove = new Set();
		traits.forEach((trait, index) => {
			if (trait.code !== code) return;
			if (tracker[trait.dataId] === undefined) {
				tracker[trait.dataId] = trait.value - neutral;
			} else {
				tracker[trait.dataId] += trait.value - neutral;
			}
			toRemove.add(index);
		});
		if (Object.keys(tracker).length === 0) return traits;
		const result = traits.filter((_, i) => !toRemove.has(i));
		for (const dataId in tracker) {
			const value = parseFloat((tracker[dataId] + neutral).toFixed(2));
			if (value === neutral) continue;
			result.push(RPG_Trait.fromValues(code, parseInt(dataId), value));
		}
		return result;
	}
	/**
	* Cancels opposing trait pairs across and within both lists.
	* Any dataId that appears as both code A and code B (across or within either list) is
	* removed entirely from both lists.
	* @param {RPG_Trait[]} baseTraits
	* @param {RPG_Trait[]} materialTraits
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #cancelOpposingPairs(baseTraits, materialTraits) {
		let base = baseTraits;
		let material = materialTraits;
		for (const [codeA, codeB] of this.#OpposingPairs) {
			[base, material] = this.#cancelPair(base, material, codeA, codeB);
		}
		return [base, material];
	}
	/**
	* Cancels one opposing pair across and within both lists.
	* @param {RPG_Trait[]} base
	* @param {RPG_Trait[]} material
	* @param {number} codeA
	* @param {number} codeB
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #cancelPair(base, material, codeA, codeB) {
		const conflicts = new Set();
		const baseA = base.filter((t) => t.code === codeA);
		const baseB = base.filter((t) => t.code === codeB);
		const matA = material.filter((t) => t.code === codeA);
		const matB = material.filter((t) => t.code === codeB);
		baseA.forEach((a) => {
			if (matB.some((b) => b.dataId === a.dataId)) conflicts.add(a.dataId);
		});
		baseB.forEach((b) => {
			if (matA.some((a) => a.dataId === b.dataId)) conflicts.add(b.dataId);
		});
		baseA.forEach((a) => {
			if (baseB.some((b) => b.dataId === a.dataId)) conflicts.add(a.dataId);
		});
		matA.forEach((a) => {
			if (matB.some((b) => b.dataId === a.dataId)) conflicts.add(a.dataId);
		});
		if (conflicts.size === 0) return [base, material];
		const strip = (traits) => traits.filter((t) => {
			if (t.code !== codeA && t.code !== codeB) return true;
			return !conflicts.has(t.dataId);
		});
		return [strip(base), strip(material)];
	}
	/**
	* Strips material traits that the base already owns for no-duplicate codes.
	* @param {RPG_Trait[]} base
	* @param {RPG_Trait[]} material
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #filterNoDuplicates(base, material) {
		const noDupes = this.#NoDuplicateCodes;
		const filteredMaterial = material.filter((mat) => {
			if (!noDupes.includes(mat.code)) return true;
			return !base.some((b) => b.code === mat.code && b.dataId === mat.dataId);
		});
		return [base, filteredMaterial];
	}
	/**
	* Removes the base entry for a given code when the material also has that code.
	* This gives the material ("last applied") effective replacement behavior for
	* codes like 35 (basic attack skill) and 55 (dual-wield toggle).
	* @param {RPG_Trait[]} base
	* @param {RPG_Trait[]} material
	* @param {number} code The code to apply replacement to.
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #replaceCode(base, material, code) {
		if (!material.some((t) => t.code === code)) return [base, material];
		return [base.filter((t) => t.code !== code), material];
	}
	/**
	* Runs keep-better resolution for all higher-is-better and lower-is-better codes.
	* @param {RPG_Trait[]} base
	* @param {RPG_Trait[]} material
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #keepBetterAll(base, material) {
		let resultBase = base;
		let resultMaterial = material;
		for (const code of this.#HigherIsBetterCodes) {
			[resultBase, resultMaterial] = this.#keepBetter(resultBase, resultMaterial, code, true);
		}
		for (const code of this.#LowerIsBetterCodes) {
			[resultBase, resultMaterial] = this.#keepBetter(resultBase, resultMaterial, code, false);
		}
		return [resultBase, resultMaterial];
	}
	/**
	* For each shared code+dataId pair between the two lists, removes the "worse" entry
	* from its list so only the winner survives into the final concat.
	* @param {RPG_Trait[]} base
	* @param {RPG_Trait[]} material
	* @param {number} code The trait code to process.
	* @param {boolean} higherIsBetter True if higher values are preferred; false if lower is.
	* @returns {[RPG_Trait[], RPG_Trait[]]}
	*/
	static #keepBetter(base, material, code, higherIsBetter) {
		const baseToRemove = new Set();
		const matToRemove = new Set();
		base.forEach((baseTrait, bi) => {
			if (baseTrait.code !== code) return;
			const mi = material.findIndex((t) => t.code === code && t.dataId === baseTrait.dataId);
			if (mi === -1) return;
			const matTrait = material[mi];
			const baseWins = higherIsBetter ? baseTrait.value >= matTrait.value : baseTrait.value <= matTrait.value;
			if (baseWins) {
				matToRemove.add(mi);
			} else {
				baseToRemove.add(bi);
			}
		});
		return [base.filter((_, i) => !baseToRemove.has(i)), material.filter((_, i) => !matToRemove.has(i))];
	}
};

//#endregion
//#region src/plugins/_base/core/core/registerVanillaParameters.js
/**
* Boot-time registration for vanilla engine parameters in {@link ParameterRegistry}.
*/
var VanillaParameterRegistration = class VanillaParameterRegistration {
	/**
	* Registers a core b-parameter with the catalog.
	* @param {string} key The key driving this step.
	* @param {number} paramId The param id driving this step.
	* @param {string} group The group driving this step.
	* @param {number} sortOrder The sort order driving this step.
	* @param {string} format The format driving this step.
	*/
	static registerBparam(key, paramId, group, sortOrder, format = ParameterFormat.FLAT) {
		const definition = ParameterDefinition.Builder().key(key).group(group).sortOrder(sortOrder).label(() => TextManager.param(paramId)).description(() => TextManager.bparamDescription(paramId)).iconIndex(() => IconManager.param(paramId)).format(format).getValue((battler) => battler.param(paramId)).sdpBinding(SdpParameterBinding.bparam(paramId)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers a core ex-parameter with the catalog.
	* @param {string} key The key driving this step.
	* @param {number} xparamId The xparam id driving this step.
	* @param {string} group The group driving this step.
	* @param {number} sortOrder The sort order driving this step.
	* @param {string} format The format driving this step.
	*/
	static registerXparam(key, xparamId, group, sortOrder, format = ParameterFormat.PERCENT) {
		const definition = ParameterDefinition.Builder().key(key).group(group).sortOrder(sortOrder).label(() => TextManager.xparam(xparamId)).description(() => TextManager.xparamDescription(xparamId)).iconIndex(() => IconManager.xparam(xparamId)).format(format).getValue((battler) => battler.xparam(xparamId)).sdpBinding(SdpParameterBinding.xparam(xparamId)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers a core sp-parameter with the catalog.
	* @param {string} key The key driving this step.
	* @param {number} sparamId The sparam id driving this step.
	* @param {string} group The group driving this step.
	* @param {number} sortOrder The sort order driving this step.
	* @param {string} format The format driving this step.
	* @param {string} displayPolicy The display policy driving this step.
	*/
	static registerSparam(key, sparamId, group, sortOrder, format = ParameterFormat.PERCENT_CENTERED, displayPolicy = ParameterDisplayPolicy.NONE) {
		const definition = ParameterDefinition.Builder().key(key).group(group).sortOrder(sortOrder).label(() => TextManager.sparam(sparamId)).description(() => TextManager.sparamDescription(sparamId)).iconIndex(() => IconManager.sparam(sparamId)).format(format).displayPolicy(displayPolicy).getValue((battler) => battler.sparam(sparamId)).sdpBinding(SdpParameterBinding.sparam(sparamId)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers HAR — the sender-side counterpart to REC — with the catalog.
	* Not a native engine param, so it needs its own custom builder rather than
	* the registerBparam/Xparam/Sparam helpers, which wrap native param ids.
	*/
	static registerHar() {
		const definition = ParameterDefinition.Builder().key("har").group(ParameterGroups.VITALITY).sortOrder(7).label(() => TextManager.har()).description(() => TextManager.harDescription()).iconIndex(() => IconManager.har()).format(ParameterFormat.PERCENT_CENTERED).getValue((battler) => battler.har).sdpBinding(SdpParameterBinding.byKey("har", () => 1)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers max TP with the catalog.
	* Needs its own builder rather than the generic bparam helper, because its SDP binding reads a
	* custom base rather than a native param id.
	*/
	static registerMtp() {
		const definition = ParameterDefinition.Builder().key("mtp").group(ParameterGroups.VITALITY).sortOrder(4).label(() => TextManager.maxTp()).description(() => TextManager.bparamDescription(30)).iconIndex(() => IconManager.maxTp()).format(ParameterFormat.FLAT).getValue((battler) => battler.maxTp()).sdpBinding(SdpParameterBinding.custom((actor, base) => {
			if (!J.SDP) return 0;
			if (!actor.maxTpSdpBonuses) return 0;
			return actor.maxTpSdpBonuses(base);
		}, (actor) => actor.getBaseMaxTp())).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers counter attack rate with the catalog.
	* Needs its own builder rather than the generic xparam helper, because it carries a display policy
	* and a format the helper does not offer for xparams.
	*/
	static registerCnt() {
		const definition = ParameterDefinition.Builder().key("cnt").group(ParameterGroups.COMBAT).sortOrder(2).label(() => TextManager.xparam(6)).description(() => TextManager.xparamDescription(6)).iconIndex(() => IconManager.xparam(6)).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.cnt).sdpBinding(SdpParameterBinding.xparam(6)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers magic reflection rate with the catalog.
	* Needs its own builder for the same reason as {@link #registerCnt}.
	*/
	static registerMrf() {
		const definition = ParameterDefinition.Builder().key("mrf").group(ParameterGroups.COMBAT).sortOrder(3).label(() => TextManager.xparam(5)).description(() => TextManager.xparamDescription(5)).iconIndex(() => IconManager.xparam(5)).format(ParameterFormat.PERCENT_SUFFIX).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.mrf).sdpBinding(SdpParameterBinding.xparam(5)).build();
		ParameterRegistry.register(definition);
	}
	/**
	* Registers all vanilla engine parameters with the catalog.
	*/
	static registerAll() {
		VanillaParameterRegistration.registerBparam("mhp", 0, ParameterGroups.VITALITY, 0, ParameterFormat.FLAT_LARGE);
		VanillaParameterRegistration.registerXparam("hrg", 7, ParameterGroups.VITALITY, 1, ParameterFormat.REGEN_PER_SECOND);
		VanillaParameterRegistration.registerBparam("mmp", 1, ParameterGroups.VITALITY, 2, ParameterFormat.FLAT_LARGE);
		VanillaParameterRegistration.registerXparam("mrg", 8, ParameterGroups.VITALITY, 3, ParameterFormat.REGEN_PER_SECOND);
		VanillaParameterRegistration.registerMtp();
		VanillaParameterRegistration.registerXparam("trg", 9, ParameterGroups.VITALITY, 5, ParameterFormat.REGEN_PER_SECOND);
		VanillaParameterRegistration.registerSparam("rec", 2, ParameterGroups.VITALITY, 6, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.REWARD_RATE);
		VanillaParameterRegistration.registerSparam("pha", 3, ParameterGroups.VITALITY, 8, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.REWARD_RATE);
		VanillaParameterRegistration.registerHar();
		VanillaParameterRegistration.registerBparam("atk", 2, ParameterGroups.COMBAT, 0);
		VanillaParameterRegistration.registerBparam("mat", 4, ParameterGroups.COMBAT, 1);
		VanillaParameterRegistration.registerCnt();
		VanillaParameterRegistration.registerMrf();
		VanillaParameterRegistration.registerSparam("mcr", 4, ParameterGroups.COMBAT, 7, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.COST_RATE);
		VanillaParameterRegistration.registerSparam("tcr", 5, ParameterGroups.COMBAT, 9, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.COST_RATE);
		VanillaParameterRegistration.registerXparam("hit", 0, ParameterGroups.PRECISION, 0, ParameterFormat.SCALED_POINTS);
		VanillaParameterRegistration.registerBparam("agi", 6, ParameterGroups.PRECISION, 1);
		VanillaParameterRegistration.registerSparam("grd", 1, ParameterGroups.PRECISION, 2, ParameterFormat.SCALED_OFFSET);
		VanillaParameterRegistration.registerXparam("cri", 2, ParameterGroups.PRECISION, 4);
		VanillaParameterRegistration.registerXparam("cev", 3, ParameterGroups.PRECISION, 5);
		VanillaParameterRegistration.registerBparam("def", 3, ParameterGroups.DEFENSIVE, 0);
		VanillaParameterRegistration.registerBparam("mdf", 5, ParameterGroups.DEFENSIVE, 1);
		VanillaParameterRegistration.registerSparam("pdr", 6, ParameterGroups.DEFENSIVE, 2, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.DAMAGE_RATE);
		VanillaParameterRegistration.registerSparam("mdr", 7, ParameterGroups.DEFENSIVE, 3, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.DAMAGE_RATE);
		VanillaParameterRegistration.registerXparam("eva", 1, ParameterGroups.DEFENSIVE, 4);
		VanillaParameterRegistration.registerXparam("mev", 4, ParameterGroups.DEFENSIVE, 5);
		VanillaParameterRegistration.registerSparam("fdr", 8, ParameterGroups.DEFENSIVE, 6, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.DAMAGE_RATE);
		VanillaParameterRegistration.registerSparam("tgr", 0, ParameterGroups.FATE, 0, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.SIGNED);
		VanillaParameterRegistration.registerBparam("luk", 7, ParameterGroups.FATE, 2);
		VanillaParameterRegistration.registerSparam("exr", 9, ParameterGroups.FATE, 1, ParameterFormat.PERCENT_CENTERED, ParameterDisplayPolicy.REWARD_RATE);
	}
};

//#endregion
//#region src/plugins/_base/core/core/AffiliationDisplay.js
/**
* Formats affiliation rates for CMS status and Monsterpedia elementalistics.
*/
var AffiliationDisplay = class AffiliationDisplay {
	/**
	* Digit width for styled affiliation deltas ({@code +0200%}, {@code -0050%}).
	* @type {number}
	*/
	static padDigits = 4;
	/**
	* Mask template for unknown affiliation deltas — keeps column width stable while scouting.
	* @type {string}
	*/
	static maskTemplate = "+0000%";
	/**
	* Formats an affiliation rate as a relative delta or special label.
	* Shared by CMS status affiliations and Monsterpedia elementalistics.
	* @param {number} ratePercent The effective rate on a 0–100+ scale (positive magnitude).
	* @param {{ absorbed?: boolean, immune?: boolean }} flags Display modifiers.
	* @returns {{ value: string, colorIndex: number }|null} Null when the rate is unmodified baseline.
	*/
	static formatDelta(ratePercent, flags = {}) {
		const absorbed = flags.absorbed === true;
		const immune = flags.immune === true;
		if (absorbed) {
			const magnitude = Math.round(ratePercent);
			const diff = magnitude - 100;
			if (diff === 0) {
				return {
					value: "ABSORB",
					colorIndex: 5
				};
			}
			return {
				value: `ABSORB (${ParameterDefinition.padSignedMagnitude(diff, AffiliationDisplay.padDigits, true, true)}%)`,
				colorIndex: 5
			};
		}
		if (immune || ratePercent <= 0) {
			return {
				value: "IMMUNE",
				colorIndex: 7
			};
		}
		const diff = Math.round(ratePercent) - 100;
		if (diff === 0) {
			return null;
		}
		if (diff <= -100) {
			return {
				value: "IMMUNE",
				colorIndex: 7
			};
		}
		let colorIndex = 0;
		if (diff > 0) {
			colorIndex = 10;
		} else {
			colorIndex = 3;
		}
		return {
			value: `${ParameterDefinition.padSignedMagnitude(diff, AffiliationDisplay.padDigits, true, true)}%`,
			colorIndex
		};
	}
	/**
	* Resolves affiliation display text, using {@code 000%} when the rate matches baseline.
	* @param {number} ratePercent The effective rate on a 0–100+ scale (positive magnitude).
	* @param {{ absorbed?: boolean, immune?: boolean }} flags Display modifiers.
	* @returns {{ value: string, colorIndex: number }}
	*/
	static resolveDisplay(ratePercent, flags = {}) {
		const formatted = AffiliationDisplay.formatDelta(ratePercent, flags);
		if (formatted) {
			return formatted;
		}
		return {
			value: `${ParameterDefinition.padSignedMagnitude(0, AffiliationDisplay.padDigits, true, true)}%`,
			colorIndex: 0
		};
	}
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Action.js
/**
* A collection of registered formula context providers.
* Each provider contributes a named variable to every `evalFormulaWithContext` call.
* Plugins append entries here via {@link Game_Action.registerFormulaContext}; the order
* of registration determines the order of arguments passed to the generated function.
* @type {Array<{name: string, getter: function}>}
*/
Game_Action.formulaContextProviders = [];
/**
* Registers a named formula context variable provided by a plugin.
* The getter receives `(action, a, b)` where `action` is the {@link Game_Action} instance,
* `a` is the attacker, and `b` is the target. Arrow functions are fully supported.
* The return value of the getter becomes the value of `name` inside every
* formula evaluated by {@link Game_Action#evalFormulaWithContext}.
* @param {string} name The variable name exposed inside the formula (e.g. `'p'`, `'s'`).
* @param {function(Game_Action, Game_Battler, Game_Battler): number|string|boolean|object} getter
* A function returning the value exposed under `name`.
*/
Game_Action.registerFormulaContext = function(name, getter) {
	Game_Action.formulaContextProviders.push({
		name,
		getter
	});
};
/**
* Evaluates a formula string using the base context (`a`, `b`, `v`) plus all
* variables registered via {@link Game_Action.registerFormulaContext}.
*
* Uses `new Function` rather than `eval` so that each plugin owns its own
* injected variable — no plugin needs to patch another's formula function.
* @param {string} formula The formula string to evaluate.
* @param {Game_Actor|Game_Enemy} a The attacker / subject of this action.
* @param {Game_Actor|Game_Enemy} b The target of this action.
* @returns {number} The result of the formula.
*/
Game_Action.prototype.evalFormulaWithContext = function(formula, a, b) {
	const v = $gameVariables._data;
	const names = [
		"a",
		"b",
		"v",
		...Game_Action.formulaContextProviders.map((provider) => provider.name)
	];
	const values = [
		a,
		b,
		v,
		...Game_Action.formulaContextProviders.map((provider) => provider.getter(this, a, b))
	];
	return new Function(...names, `return (${formula})`)(...values);
};
/**
* Gets the `Game_Item` wrapper backing this action.
*
* This is deliberately not {@link Game_Action#item}, which unwraps into the database row. Anything
* rebinding what this action points at needs the wrapper to call `setObject` on.
* @returns {Game_Item} The raw item wrapper.
*/
Game_Action.prototype.rawItem = function() {
	return this._item;
};
/**
* Extends {@link #clear}.<br/>
* Also seeds the triggering damage values, so they are always numbers rather than undefined.
*/
J.BASE.Aliased.Game_Action.set("clear", Game_Action.prototype.clear);
Game_Action.prototype.clear = function() {
	J.BASE.Aliased.Game_Action.get("clear").call(this);
	this.setTriggerHpDamage(0);
	this.setTriggerMpDamage(0);
	this.setTriggerTpDamage(0);
};
/**
* Sets the triggering damage values that caused this action to fire (e.g. a retaliation).
* These are exposed as `d` (HP), `m` (MP), and `t` (TP) inside damage formulas via
* {@link Game_Action.registerFormulaContext}.
* @param {number} hpDamage The HP damage that triggered this action.
* @param {number} mpDamage The MP damage that triggered this action.
* @param {number} tpDamage The TP damage that triggered this action.
*/
Game_Action.prototype.setTriggerDamage = function(hpDamage, mpDamage, tpDamage) {
	this.setTriggerHpDamage(hpDamage);
	this.setTriggerMpDamage(mpDamage);
	this.setTriggerTpDamage(tpDamage);
};
/**
* Gets the triggering HP damage stamped onto this action, defaulting to 0.
* @returns {number}
*/
Game_Action.prototype.getTriggerHpDamage = function() {
	return this.triggerHpDamage();
};
/**
* Gets the triggering MP damage stamped onto this action, defaulting to 0.
* @returns {number}
*/
Game_Action.prototype.getTriggerMpDamage = function() {
	return this.triggerMpDamage();
};
/**
* Gets the triggering TP damage stamped onto this action, defaulting to 0.
* @returns {number}
*/
Game_Action.prototype.getTriggerTpDamage = function() {
	return this.triggerTpDamage();
};
Game_Action.registerFormulaContext("d", (action) => action.getTriggerHpDamage());
Game_Action.registerFormulaContext("m", (action) => action.getTriggerMpDamage());
Game_Action.registerFormulaContext("t", (action) => action.getTriggerTpDamage());
/**
* Extends {@link #makeDamageValue}.<br/>
* Applies the caster's HAR to the Damage-tab "HP/MP Recover" result, mirroring
* vanilla's own `value *= target.rec` for the same negative-value (heal) branch.
* A negative return value here always means a heal; guard/variance/critical all
* preserve sign, so checking the final value is equivalent to checking baseValue.
*/
J.BASE.Aliased.Game_Action.set("makeDamageValue", Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical) {
	let value = J.BASE.Aliased.Game_Action.get("makeDamageValue").call(this, target, critical);
	if (value < 0) {
		value *= this.subject().har;
	}
	return value;
};
/**
* Overwrites {@link #itemEffectRecoverHp}.<br/>
* Identical to vanilla except for the added `this.subject().har` multiplier;
* the method mutates `target` directly rather than returning a value, so there's
* no return value to post-multiply the way {@link #makeDamageValue} allows.
*/
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
	let value = (target.mhp * effect.value1 + effect.value2) * target.rec * this.subject().har;
	if (this.isItem()) {
		value *= this.subject().pha;
	}
	value = Math.floor(value);
	if (value !== 0) {
		target.gainHp(value);
		this.makeSuccess(target);
	}
};
/**
* Overwrites {@link #itemEffectRecoverMp}.<br/>
* Identical to vanilla except for the added `this.subject().har` multiplier;
* the method mutates `target` directly rather than returning a value, so there's
* no return value to post-multiply the way {@link #makeDamageValue} allows.
*/
Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
	let value = (target.mmp * effect.value1 + effect.value2) * target.rec * this.subject().har;
	if (this.isItem()) {
		value *= this.subject().pha;
	}
	value = Math.floor(value);
	if (value !== 0) {
		target.gainMp(value);
		this.makeSuccess(target);
	}
};
/**
* Gets the actor id of this action's subject, or 0 when an enemy.
* @returns {number} The subjectActorId.
*/
Game_Action.prototype.subjectActorId = function() {
	return this._subjectActorId;
};
/**
* Sets the actor id of this action's subject, or 0 when an enemy.
* @param {number} newSubjectActorId The new subjectActorId.
*/
Game_Action.prototype.setSubjectActorId = function(newSubjectActorId) {
	this._subjectActorId = newSubjectActorId;
};
/**
* Gets the troop index of this action's subject, or -1 when an actor.
* @returns {number} The subjectEnemyIndex.
*/
Game_Action.prototype.subjectEnemyIndex = function() {
	return this._subjectEnemyIndex;
};
/**
* Sets the troop index of this action's subject, or -1 when an actor.
* @param {number} newSubjectEnemyIndex The new subjectEnemyIndex.
*/
Game_Action.prototype.setSubjectEnemyIndex = function(newSubjectEnemyIndex) {
	this._subjectEnemyIndex = newSubjectEnemyIndex;
};
/**
* Gets the trigger hp damage.
* @returns {number} The triggerHpDamage.
*/
Game_Action.prototype.triggerHpDamage = function() {
	return this._triggerHpDamage;
};
/**
* Sets the trigger hp damage.
* @param {number} newTriggerHpDamage The new triggerHpDamage.
*/
Game_Action.prototype.setTriggerHpDamage = function(newTriggerHpDamage) {
	this._triggerHpDamage = newTriggerHpDamage;
};
/**
* Gets the trigger mp damage.
* @returns {number} The triggerMpDamage.
*/
Game_Action.prototype.triggerMpDamage = function() {
	return this._triggerMpDamage;
};
/**
* Sets the trigger mp damage.
* @param {number} newTriggerMpDamage The new triggerMpDamage.
*/
Game_Action.prototype.setTriggerMpDamage = function(newTriggerMpDamage) {
	this._triggerMpDamage = newTriggerMpDamage;
};
/**
* Gets the trigger tp damage.
* @returns {number} The triggerTpDamage.
*/
Game_Action.prototype.triggerTpDamage = function() {
	return this._triggerTpDamage;
};
/**
* Sets the trigger tp damage.
* @param {number} newTriggerTpDamage The new triggerTpDamage.
*/
Game_Action.prototype.setTriggerTpDamage = function(newTriggerTpDamage) {
	this._triggerTpDamage = newTriggerTpDamage;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Actor.js
/**
* The underlying database data for this battler.
*
* This allows operations to be performed against both actor and enemy indifferently.
* @returns {number}
*/
Game_Actor.prototype.battlerId = function() {
	return this.actorId();
};
/**
* The underlying database data for this actor.
* @returns {RPG_Actor}
*/
Game_Actor.prototype.databaseData = function() {
	return this.actor();
};
/**
* Gets the skill ids this actor has actually learned.
*
* This is only the learned list. Trait-granted skills live in {@link Game_Actor#addedSkills},
* and {@link Game_Actor#skillIds} is the union of the two.
* @returns {number[]} The learned skill ids.
*/
Game_Actor.prototype.learnedSkillIds = function() {
	return this._skills;
};
/**
* Gets the equipped items as their `Game_Item` wrappers.
*
* This is deliberately not {@link Game_Actor#equips}, which unwraps each slot into its database
* row. Anything comparing or snapshotting equipment needs the wrappers, since two different
* wrappers can point at the same row.
* @returns {Game_Item[]} The raw, slot-ordered equipment wrappers.
*/
Game_Actor.prototype.rawEquips = function() {
	return this._equips;
};
/**
* Gets the raw skill ids known to this actor.
* Combines the actor's learned skill list with any bonus skill ids granted by traits,
* then deduplicates so each id appears at most once.
* @returns {number[]}
*/
Game_Actor.prototype.skillIds = function() {
	const allSkillIds = this.learnedSkillIds().concat(this.addedSkills());
	return [...new Set(allSkillIds)];
};
/**
* Determines whether or not this actor is the leader.
* @returns {boolean}
*/
Game_Actor.prototype.isLeader = function() {
	return $gameParty.leader() === this;
};
/**
* Gets all notes associated with the actor and its class.
* @returns {[RPG_Actor,RPG_Class]}
*/
Game_Actor.prototype.getActorNotes = function() {
	const actor = this.actor();
	return [actor, this.class(actor.classId)];
};
/**
* All sources this actor battler has available to it.
* @returns {(RPG_Actor|RPG_State|RPG_Class|RPG_Skill|RPG_EquipItem)[]}
*/
Game_Actor.prototype.getNotesSources = function() {
	const baseNoteSources = Game_Battler.prototype.getNotesSources.call(this);
	const actorUniqueNoteSources = [this.currentClass(), ...this.equippedEquips()];
	const combinedNoteSources = baseNoteSources.concat(actorUniqueNoteSources);
	return combinedNoteSources;
};
/**
* Extends {@link #setup}.<br/>
* Adds a hook for performing actions when an actor is setup.
*/
J.BASE.Aliased.Game_Actor.set("setup", Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId) {
	J.BASE.Aliased.Game_Actor.get("setup").call(this, actorId);
	this.onSetup(actorId);
};
/**
* A hook for performing actions when an actor is setup.
* @param {number} actorId The actor's id.
*/
Game_Actor.prototype.onSetup = function(actorId) {
	this.onBattlerDataChange();
};
/**
* Extends {@link #learnSkill}.<br/>
* Adds a hook for performing actions when a new skill is learned.
* If the skill is already known, it will not trigger any on-skill-learned effects.
*/
J.BASE.Aliased.Game_Actor.set("learnSkill", Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId) {
	if (!this.isLearnedSkill(skillId)) {
		this.onLearnNewSkill(skillId);
	}
	J.BASE.Aliased.Game_Actor.get("learnSkill").call(this, skillId);
};
/**
* A hook for performing actions when an actor learns a new skill.
* @param {number} skillId The skill id of the skill learned.
*/
Game_Actor.prototype.onLearnNewSkill = function(skillId) {
	this.onBattlerDataChange();
};
/**
* Extends {@link #learnSkill}.<br/>
* Adds a hook for performing actions when a new skill is learned.
* If the skill is already known, it will not trigger any on-skill-learned effects.
*/
J.BASE.Aliased.Game_Actor.set("forgetSkill", Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId) {
	if (this.isLearnedSkill(skillId)) {
		this.onForgetSkill(skillId);
	}
	J.BASE.Aliased.Game_Actor.get("forgetSkill").call(this, skillId);
};
/**
* A hook for performing actions when a battler forgets a skill.
* @param {number} skillId The skill id of the skill forgotten.
*/
Game_Actor.prototype.onForgetSkill = function(skillId) {
	this.onBattlerDataChange();
};
/**
* Extends {@link #die}.<br/>
* Adds a toggle of the death effects.
*/
J.BASE.Aliased.Game_Actor.set("die", Game_Actor.prototype.die);
Game_Actor.prototype.die = function() {
	J.BASE.Aliased.Game_Actor.get("die").call(this);
	this.onDeath();
};
/**
* An event hook fired when this actor dies.
*/
Game_Actor.prototype.onDeath = function() {
	this.onBattlerDataChange();
};
/**
* Extends {@link #revive}.<br/>
* Handles on-revive effects at the actor-level.
*/
J.BASE.Aliased.Game_Actor.set("revive", Game_Actor.prototype.revive);
Game_Actor.prototype.revive = function() {
	J.BASE.Aliased.Game_Actor.get("revive").call(this);
	this.onRevive();
};
/**
* An event hook fired when this actor revives.
*/
Game_Actor.prototype.onRevive = function() {
	this.onBattlerDataChange();
};
/**
* An event hook fired when this actor changes their current equipment.
*/
Game_Actor.prototype.onEquipChange = function() {
	this.onBattlerDataChange();
};
/**
* Extends {@link #changeClass}.<br/>
* Adds a hook for performing actions when the actor changes class.
*/
J.BASE.Aliased.Game_Actor.set("changeClass", Game_Actor.prototype.changeClass);
Game_Actor.prototype.changeClass = function(classId, keepExp) {
	J.BASE.Aliased.Game_Actor.get("changeClass").call(this, classId, keepExp);
	this.onClassChange(classId, keepExp);
};
/**
* An event hook fired when this actor changes classes.
*/
Game_Actor.prototype.onClassChange = function(classId, keepExp) {
	this.onBattlerDataChange();
};
/**
* Extends {@link #changeEquip}.<br/>
* Adds a hook for performing actions when equipment on the actor has changed state.
*/
J.BASE.Aliased.Game_Actor.set("changeEquip", Game_Actor.prototype.changeEquip);
Game_Actor.prototype.changeEquip = function(slotId, item) {
	const oldEquips = JsonEx.makeDeepCopy(this.rawEquips());
	J.BASE.Aliased.Game_Actor.get("changeEquip").call(this, slotId, item);
	const isChanged = !oldEquips.equals(this.rawEquips());
	if (isChanged) {
		this.onEquipChange();
	}
};
/**
* Extends {@link #discardEquip}.<br/>
* Adds a hook for performing actions when equipment on the actor has been discarded.
*/
J.BASE.Aliased.Game_Actor.set("discardEquip", Game_Actor.prototype.discardEquip);
Game_Actor.prototype.discardEquip = function(item) {
	const oldEquips = JsonEx.makeDeepCopy(this.rawEquips());
	J.BASE.Aliased.Game_Actor.get("discardEquip").call(this, item);
	const isChanged = !oldEquips.equals(this.rawEquips());
	if (isChanged) {
		this.onEquipChange();
	}
};
/**
* Extends {@link #forceChangeEquip}.<br/>
* Adds a hook for performing actions when equipment on the actor has been forcefully changed.
*/
J.BASE.Aliased.Game_Actor.set("forceChangeEquip", Game_Actor.prototype.forceChangeEquip);
Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
	const oldEquips = JsonEx.makeDeepCopy(this.rawEquips());
	J.BASE.Aliased.Game_Actor.get("forceChangeEquip").call(this, slotId, item);
	const isChanged = !oldEquips.equals(this.rawEquips());
	if (isChanged) {
		this.onEquipChange();
	}
};
/**
* Extends {@link #releaseUnequippableItems}.<br/>
* Adds a hook for performing actions when equipment on the actor has been released due to internal change.
*/
J.BASE.Aliased.Game_Actor.set("releaseUnequippableItems", Game_Actor.prototype.releaseUnequippableItems);
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
	const oldEquips = JsonEx.makeDeepCopy(this.rawEquips());
	J.BASE.Aliased.Game_Actor.get("releaseUnequippableItems").call(this, forcing);
	const isChanged = this.haveEquipsChanged(oldEquips);
	if (isChanged) {
		this.onEquipChange();
	}
};
/**
* Determines whether or not the equips have changed since before.
* @param {Game_Item[]} oldEquips The old equips collection.
* @returns {boolean} True if there was a change in equips, false otherwise.
*/
Game_Actor.prototype.haveEquipsChanged = function(oldEquips) {
	if (oldEquips.length !== this.rawEquips().length) return true;
	let hasDifferentEquips = false;
	oldEquips.forEach((oldEquip, index) => {
		const currentEquip = this.rawEquips()[index];
		const sameItemId = oldEquip.itemId() === currentEquip.itemId();
		const sameType = oldEquip.dataClass() === currentEquip.dataClass();
		const sameInnerItem = oldEquip.underlyingObject() === currentEquip.underlyingObject();
		if (sameItemId && sameType && sameInnerItem) return;
		hasDifferentEquips = true;
	});
	return hasDifferentEquips;
};
/**
* Overwrites the vanilla {@link #traitObjects} defined on {@link Game_Actor}.<br/>
* Routes all calls through the cache wrapper on {@link Game_BattlerBase} so the
* vanilla implementation — which pushes directly into the returned array — can never
* shadow our cache layer or cause accidental mutation.
* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_State)[]}
*/
Game_Actor.prototype.traitObjects = function() {
	return Game_BattlerBase.prototype.traitObjects.call(this);
};
/**
* Overwrites {@link #buildTraitObjects}.<br/>
* Actors have additional trait-bearing sources beyond states: their actor data,
* current class, and all currently equipped items.
*
* Returns a fresh array — never mutates the result of any super call — so the
* cache in {@link #traitObjects} remains safe.
* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_State)[]}
*/
Game_Actor.prototype.buildTraitObjects = function() {
	return [
		...this.states(),
		this.actor(),
		this.currentClass(),
		...this.equippedEquips()
	];
};
/**
* Gets all currently-equipped equips for this actor.
* Normally, {@link #equips} includes `null`s where there may be empty equipment slots,
* but this filters those out for you.
* @returns {RPG_EquipItem[]}
*/
Game_Actor.prototype.equippedEquips = function() {
	return this.equips().filter((equip) => !!equip);
};
/**
* Overwrites {@link Game_BattlerBase#localisedEquips}.<br/>
* An actor's worn equipment is exactly the set of trait sources whose percentages describe the item
* rather than the actor wearing it.
* @returns {RPG_EquipItem[]}
*/
Game_Actor.prototype.localisedEquips = function() {
	return this.equippedEquips();
};
/**
* Overwrites {@link Game_Actor#paramPlus}.<br/>
* Each equipped item contributes its own base for the parameter, amplified by its own percentages.
*
* Previously an equip's percentage was pooled into the actor's global rate, so a sword's `+25% ATK` lifted
* the class curve and every other worn item along with it. Now it lifts only what that sword is worth,
* which is what makes a percentage bounded by the thing carrying it.
*
* Deliberately an overwrite rather than an extension: vanilla's implementation already adds each equip's
* `params` entry, and {@link RPG_EquipItem#thisBParam} includes that same entry, so aliasing would count
* it twice. The actor's own permanent plus is fetched from the battler implementation directly, the way
* {@link #traitObjects} reaches past its own vanilla version.
* @param {number} paramId The base parameter id, 0 through 7.
* @returns {number}
*/
Game_Actor.prototype.paramPlus = function(paramId) {
	const actorPlus = Game_Battler.prototype.paramPlus.call(this, paramId);
	const equipPlus = this.equippedEquips().reduce((total, equip) => {
		const ownRate = equip.ownRate(Game_BattlerBase.TRAIT_PARAM, paramId);
		return total + equip.thisBParam(paramId) * ownRate;
	}, 0);
	return actorPlus + equipPlus;
};
/**
* Sets the level of this actor to the given level.
* @param {number} level The level to set this actor to.
*/
Game_Actor.prototype.setLevel = function(level) {
	const newExperience = this.expForLevel(level);
	this.changeExp(newExperience, false);
};
/**
* An event hook fired when this actor levels up.
*/
Game_Actor.prototype.onLevelUp = function() {
	this.onBattlerDataChange();
};
/**
* Extends {@link #levelUp}.<br/>
* Adds a hook for performing actions when an the actor levels up.
*/
J.BASE.Aliased.Game_Actor.set("levelUp", Game_Actor.prototype.levelUp);
Game_Actor.prototype.levelUp = function() {
	J.BASE.Aliased.Game_Actor.get("levelUp").call(this);
	this.onLevelUp();
};
/**
* An event hook fired when this actor levels down.
*/
Game_Actor.prototype.onLevelDown = function() {
	this.onBattlerDataChange();
};
/**
* Extends {@link #levelDown}.<br/>
* Adds a hook for performing actions when an the actor levels down.
*/
J.BASE.Aliased.Game_Actor.set("levelDown", Game_Actor.prototype.levelDown);
Game_Actor.prototype.levelDown = function() {
	J.BASE.Aliased.Game_Actor.get("levelDown").call(this);
	this.onLevelDown();
};
/**
* Gets the base max tp for this actor.
* @returns {number}
*/
Game_Actor.prototype.getBaseMaxTp = function() {
	return J.BASE.Metadata.BaseTpMaxActors;
};
/**
* Gets the id of this actor's current class.
* @returns {number} The classId.
*/
Game_Actor.prototype.classId = function() {
	return this._classId;
};
/**
* Sets the id of this actor's current class.
* @param {number} newClassId The new classId.
*/
Game_Actor.prototype.setClassId = function(newClassId) {
	this._classId = newClassId;
};
/**
* Gets the accumulated experience per class id.
* @returns {Object<number, number>} The exp.
*/
Game_Actor.prototype.exp = function() {
	return this._exp;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_ActionResult.js
/**
* Extends {@link Game_ActionResult.initialize}.<br/>
* Also runs the member-initialization hook every plugin hangs its own state off.
*/
J.BASE.Aliased.Game_ActionResult.set("initialize", Game_ActionResult.prototype.initialize);
Game_ActionResult.prototype.initialize = function() {
	J.BASE.Aliased.Game_ActionResult.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_ActionResult}.<br>
*
* Vanilla sets a result up inside `initialize`, which a decode can never re-run, so plugin state
* added through it would come back missing. A result reaches a savefile nested on every battler, so
* its codec seeds the engine's own fields and then calls this.
*
* **Plugins adding state to an action result alias this, not `initialize`.**
*/
Game_ActionResult.prototype.initMembers = function() {};

//#endregion
//#region src/plugins/_base/core/objects/Game_Actors.js
/**
* Gets all proper actor ids available for actors in the database.
* @returns {number[]}
*/
Game_Actors.prototype.actorIds = function() {
	const actorIds = Array.empty;
	$dataActors.forEach((actor) => {
		if (!actor) return;
		if (actor.name.length === 0) return;
		if (actor.name.startsWith(" ")) return;
		if (actor.name.startsWith("==")) return;
		if (actor.name.startsWith("__")) return;
		actorIds.push(actor.id);
	});
	return actorIds;
};
/**
* Gets all proper actors available in the database.
* @returns {Game_Actor[]}
*/
Game_Actors.prototype.actors = function() {
	return this.actorIds().map((id) => this.actor(id), this);
};
/**
* Gets the raw actor store: the array the engine indexes by actor id.
*
* Almost nothing wants this. {@link #existingActors} is the readable form, and it is the one to reach
* for unless you specifically need the id-to-actor indexing that only survives here.
* @returns {Game_Actor[]}
*/
Game_Actors.prototype.data = function() {
	return this._data;
};
/**
* Gets every actor this playthrough has actually built, compacted.
*
* This is deliberately not {@link #actors}. That one walks the database and hands each id to
* {@link Game_Actors.actor}, which lazily constructs any actor it does not find- so asking it "who
* exists right now" answers by making the answer true. Anything that wants to touch the actors a
* save genuinely knows about must read the store instead.
*
* The compaction is not a guard against a broken contract; it is the contract. The engine indexes
* this store by actor id and never fills the gaps, and **the gaps change shape across a save**: a
* store built during play carries real holes, which iteration skips for free, while one restored from
* a file carries explicit nulls, because `JSON.stringify` writes a hole as `null` and `JSON.parse`
* hands it back as a real element. Index 0 is always one of them- there is no actor 0. A caller that
* iterated the raw store would work until the first load and then fail on its very first element.
* @returns {Game_Actor[]}
*/
Game_Actors.prototype.existingActors = function() {
	return this.data().filter((actor) => actor !== null);
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Battler.js
/**
* Gets the skill associated with the given skill id.
* By default, we simply get the skill from the database with no modifications.
* @param {number} skillId The skill id to get the skill for.
* @returns {RPG_Skill}
*/
Game_Battler.prototype.skill = function(skillId) {
	return $dataSkills[skillId];
};
/**
* Gets all skills this battler has available to it.
* @returns {RPG_Skill[]}
*/
Game_Battler.prototype.skills = function() {
	return Array.empty;
};
/**
* Gets the raw skill ids available to this battler.
* Returns an empty array by default; actor and enemy override this for their respective data sources.
* @returns {number[]}
*/
Game_Battler.prototype.skillIds = function() {
	return Array.empty;
};
/**
* The underlying database data for this battler.
*
* This allows operations to be performed against both actor and enemy indifferently.
* @returns {number}
*/
Game_Battler.prototype.battlerId = function() {
	return 1;
};
/**
* The underlying database data for this battler.
*
* This allows operations to be performed against both actor and enemy indifferently.
* @returns {RPG_Enemy|RPG_Actor}
*/
Game_Battler.prototype.databaseData = function() {
	return null;
};
/**
* Gets the class associated with the given class id.
* By default, we simply get the class from the database with no modifications.
* @param {number} classId The class id to get the class for.
* @returns {RPG_Class}
*/
Game_Battler.prototype.class = function(classId) {
	return $dataClasses.at(classId);
};
/**
* Overwrites {@link #maxTp}.<br/>
* Replaces the default of 100 for all battlers with a tag-based calculation that reviews all available notes to sum
* together all maxTp values for a custom value.
* @returns {number}
*/
Game_Battler.prototype.maxTp = function() {
	const baseMaxTp = this.getBaseMaxTp();
	const combinedMaxTp = this.getBaseMaxTpBonuses();
	return Math.max(0, baseMaxTp + combinedMaxTp);
};
/**
* The base max TP for all battlers- always 0 at this level.
* @returns {number}
*/
Game_Battler.prototype.getBaseMaxTp = function() {
	return 0;
};
/**
* The base bonus to max tech on this battler.
* Result is cached and invalidated by {@link #onBattlerDataChange}.
* @returns {number}
*/
Game_Battler.prototype.getBaseMaxTpBonuses = function() {
	if (this.getCachedMaxTpBonuses() !== null) {
		return this.getCachedMaxTpBonuses();
	}
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.BASE.RegExp.MaxTp);
	this.setCachedMaxTpBonuses(bonus);
	return this.getCachedMaxTpBonuses();
};
/**
* Extends {@link #initMembers}.<br/>
* Initializes the notes cache for this battler.
*/
J.BASE.Aliased.Game_Battler.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.BASE.Aliased.Game_Battler.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the base plugin.
	*/
	this._j._base ||= {};
	/**
	* The cached result of {@link #getNotesSources} for this battler.
	* Null when the cache is cold; populated on the first {@link #getAllNotes} call after
	* construction or after {@link #onBattlerDataChange} invalidates it.
	* @type {RPG_BaseItem[]|null}
	*/
	this._j._base._cachedAllNotes = null;
	/**
	* The cached result of {@link #getBaseMaxTpBonuses} for this battler.
	* Null when the cache is cold; populated on the first call and invalidated by
	* {@link #onBattlerDataChange}.
	* @type {number|null}
	*/
	this._j._base._cachedMaxTpBonuses = null;
	/**
	* The cached result of {@link #baseHarFactor} for this battler.
	* Null when the cache is cold; invalidated by {@link #onBattlerDataChange}.
	* @type {number|null}
	*/
	this._j._base._cachedHarFactor = null;
};
/**
* Gets the cached max-tp-bonuses value for this battler, or null if the cache is cold.
* @returns {number|null}
*/
Game_Battler.prototype.getCachedMaxTpBonuses = function() {
	return this._j._base._cachedMaxTpBonuses;
};
/**
* Sets the cached max-tp-bonuses value for this battler.
* @param {number|null} value The new cached value, or null to invalidate.
*/
Game_Battler.prototype.setCachedMaxTpBonuses = function(value) {
	this._j._base._cachedMaxTpBonuses = value;
};
/**
* Gets the cached all-notes collection for this battler, or null if the cache is cold.
* @returns {RPG_BaseItem[]|null}
*/
Game_Battler.prototype.getCachedAllNotes = function() {
	return this._j._base._cachedAllNotes;
};
/**
* Sets the cached all-notes collection for this battler.
* @param {RPG_BaseItem[]|null} notes The new cached value, or null to invalidate.
*/
Game_Battler.prototype.setCachedAllNotes = function(notes) {
	this._j._base._cachedAllNotes = notes;
};
/**
* Gets everything that this battler has with notes on it.
*
* The result is cached and shared across all callers within a single data-change cycle.
* The cache is invalidated by {@link #onBattlerDataChange}, which fires whenever states,
* equipment, skills, or any other note-bearing data changes on this battler.
*
* All battlers have their own database data, along with all their states.
* Actors also get their class, skills, and equips added.
* Enemies also get their skills added.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
*/
Game_Battler.prototype.getAllNotes = function() {
	if (this.testNoteSources() !== undefined) {
		return this.testNoteSources();
	}
	if (this.getCachedAllNotes() !== null) {
		return this.getCachedAllNotes();
	}
	this.setCachedAllNotes(this.getNotesSources());
	return this.getCachedAllNotes();
};
/**
* Gets all database objects from which notes can be derived for this battler.
* @returns {RPG_BaseItem[]}
*/
Game_Battler.prototype.getNotesSources = function() {
	return [
		this.databaseData(),
		...this.skills(),
		...this.allStates()
	];
};
/**
* Adds a hook for performing actions when some part of the battler's data has changed.
* All battlers will trigger this hook when states are added or removed.
*
* Unlike {@link Game_Battler.refresh}, this does not trigger when hp/mp/tp changes.
*/
Game_Battler.prototype.onBattlerDataChange = function() {
	this.setCachedAllNotes(null);
	this.setCachedTraitObjects(null);
	this.setCachedAllTraits(null);
	this.setCachedMaxTpBonuses(null);
	this.setCachedEquipContributions(null);
	this.setCachedHarFactor(null);
	JCache.invalidateAllForBattler(this);
};
/**
* Gets the state associated with the given state id.
* By abstracting this, we can modify the underlying state before it reaches its destination.
* @param {number} stateId The state id to get data for.
* @returns {RPG_State}
*/
Game_Battler.prototype.state = function(stateId) {
	return $dataStates[stateId];
};
/**
* Overwrites {@link #states}.<br/>
* Returns all states from the view of this battler.
* @returns {RPG_State[]}
*/
Game_Battler.prototype.states = function() {
	return this._states.map((stateId) => this.state(stateId), this);
};
/**
* Extends {@link #eraseState}.<br/>
* Adds a hook for performing actions when a state is removed from the battler.
*/
J.BASE.Aliased.Game_Battler.set("eraseState", Game_Battler.prototype.eraseState);
Game_Battler.prototype.eraseState = function(stateId) {
	const oldStates = this.allStateIds();
	J.BASE.Aliased.Game_Battler.get("eraseState").call(this, stateId);
	const isChanged = !oldStates.equals(this.allStateIds());
	if (isChanged) {
		this.onStateRemoval(stateId);
	}
};
/**
* An event hook fired when this battler has a state removed.
* @param {number} stateId The state id being removed.
*/
Game_Battler.prototype.onStateRemoval = function(stateId) {
	this.onBattlerDataChange();
};
/**
* Extends {@link #addNewState}.<br/>
* Adds a hook for performing actions when a state is added on the battler.
*/
J.BASE.Aliased.Game_Battler.set("addNewState", Game_Battler.prototype.addNewState);
Game_Battler.prototype.addNewState = function(stateId) {
	const oldStates = this.allStateIds();
	J.BASE.Aliased.Game_Battler.get("addNewState").call(this, stateId);
	const isChanged = !oldStates.equals(this.allStateIds());
	if (isChanged) {
		this.onStateAdded(stateId);
	}
};
/**
* An event hook fired when this battler has a state added.
* @param {number} stateId The state id being added.
*/
Game_Battler.prototype.onStateAdded = function(stateId) {
	this.onBattlerDataChange();
};
/**
* Gets all states on the battler.
* This can include other states from other plugins, too.
* @returns {RPG_State[]}
*/
Game_Battler.prototype.allStates = function() {
	const states = [];
	states.push(...this.states());
	return states;
};
/**
* Gets the ids of all states on the battler as raw numbers.
* This can include other state ids from other plugins, too.
* @returns {number[]}
*/
Game_Battler.prototype.allStateIds = function() {
	return [...this._states];
};
/**
* Overwrites {@link Game_BattlerBase#isStateAffected}.<br/>
* Uses {@link #allStateIds} instead of the raw `_states` array so that passives injected
* by J.PASSIVE (and any other plugin that extends allStateIds) are included in the check.
* @param {number} stateId The state id to check.
* @returns {boolean}
*/
J.BASE.Aliased.Game_Battler.set("isStateAffected", Game_BattlerBase.prototype.isStateAffected);
Game_Battler.prototype.isStateAffected = function(stateId) {
	return this.allStateIds().includes(stateId);
};
/**
* Gets the current health percent of this battler.
* @returns {number}
*/
Game_Battler.prototype.currentHpPercent = function() {
	return parseFloat((this.hp / this.mhp).toFixed(2));
};
/**
* Gets the current health percent of this battler as a base-100 integer.
* @returns {number}
*/
Game_Battler.prototype.currentHpPercent100 = function() {
	return Math.round(this.currentHpPercent() * 100);
};
/**
* Resolves a catalog parameter value by string key.
* Delegates to {@link ParameterRegistry} — does not bypass param/xparam/sparam alias chains.
* @param {string} key The parameter key (e.g. `'atk'`).
* @returns {number}
*/
Game_Battler.prototype.parameter = function(key) {
	return ParameterRegistry.resolveValue(this, key);
};
/**
* Hook fired after any positive resource recovery on this battler.
* Extensions alias this instead of gainHp/gainMp/gainTp to react to healing events
* without duplicating three separate aliases per plugin.
* @param {string} _resource One of {@link J.BASE.Resource}.HP / .MP / .TP.
* @param {number} _amount The positive amount that was recovered.
*/
Game_Battler.prototype.onHeal = function(_resource, _amount) {};
/**
* Extends {@link #gainHp}.<br/>
* Fires {@link #onHeal} after any positive HP recovery so listeners can react.
*/
J.BASE.Aliased.Game_Battler.set("gainHp", Game_Battler.prototype.gainHp);
Game_Battler.prototype.gainHp = function(value) {
	J.BASE.Aliased.Game_Battler.get("gainHp").call(this, value);
	if (value > 0) this.onHeal(J.BASE.Resource.HP, value);
};
/**
* Extends {@link #gainMp}.<br/>
* Fires {@link #onHeal} after any positive MP recovery so listeners can react.
*/
J.BASE.Aliased.Game_Battler.set("gainMp", Game_Battler.prototype.gainMp);
Game_Battler.prototype.gainMp = function(value) {
	J.BASE.Aliased.Game_Battler.get("gainMp").call(this, value);
	if (value > 0) this.onHeal(J.BASE.Resource.MP, value);
};
/**
* Extends {@link #gainTp}.<br/>
* Fires {@link #onHeal} after any positive TP recovery so listeners can react.
*/
J.BASE.Aliased.Game_Battler.set("gainTp", Game_Battler.prototype.gainTp);
Game_Battler.prototype.gainTp = function(value) {
	J.BASE.Aliased.Game_Battler.get("gainTp").call(this, value);
	if (value > 0) this.onHeal(J.BASE.Resource.TP, value);
};
Object.defineProperties(Game_BattlerBase.prototype, { 
/**
* Outgoing heal amplification (1.0 = baseline). The sender-side counterpart to REC.
*/
har: {
	get: function() {
		return 1;
	},
	configurable: true
} });
Object.defineProperty(Game_Battler.prototype, "har", {
	get: function() {
		let factor = this.baseHarFactor();
		if (this.getSdpBonusForParameterKey) {
			factor += this.getSdpBonusForParameterKey("har", 1);
		}
		return factor;
	},
	configurable: true
});
/**
* Sums `<har:X>` notetags into a multiplier factor.
* Result is cached and invalidated by {@link #onBattlerDataChange}.
* @returns {number}
*/
Game_Battler.prototype.baseHarFactor = function() {
	if (this.getCachedHarFactor() !== null) {
		return this.getCachedHarFactor();
	}
	const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.BASE.RegExp.HealAmplification);
	this.setCachedHarFactor((100 + bonus) / 100);
	return this.getCachedHarFactor();
};
/**
* Gets the cached HAR factor for this battler, or null if the cache is cold.
* @returns {number|null}
*/
Game_Battler.prototype.getCachedHarFactor = function() {
	return this._j._base._cachedHarFactor;
};
/**
* Sets the cached HAR factor for this battler.
* @param {number|null} value The new cached value, or null to invalidate.
*/
Game_Battler.prototype.setCachedHarFactor = function(value) {
	this._j._base._cachedHarFactor = value;
};
/**
* Gets the test note sources.
* @returns {{note: string}[]} The testNoteSources.
*/
Game_Battler.prototype.testNoteSources = function() {
	return this.__testNoteSources;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_BattlerBase.js
/**
* Extends {@link #initMembers}.<br/>
* Initializes the trait objects cache for this battler.
*/
J.BASE.Aliased.Game_BattlerBase.set("initMembers", Game_BattlerBase.prototype.initMembers);
Game_BattlerBase.prototype.initMembers = function() {
	J.BASE.Aliased.Game_BattlerBase.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the base plugin.
	*/
	this._j._base ||= {};
	/**
	* The cached result of {@link #buildTraitObjects} for this battler.
	* Null when the cache is cold; populated on the first {@link #traitObjects} call after
	* construction or after {@link #onBattlerDataChange} invalidates it.
	* @type {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]|null}
	*/
	this._j._base._cachedTraitObjects = null;
	/**
	* The cached result of {@link #allTraits} for this battler.
	* Null when the cache is cold; populated on the first {@link #allTraits} call after
	* construction or after {@link #onBattlerDataChange} invalidates it.
	* Every downstream trait query ({@link #traits}, {@link #traitsWithId}, {@link #traitsPi},
	* {@link #traitsDeltaSum}, {@link #traitsSum}) benefits automatically.
	* @type {MV.Trait[]|null}
	*/
	this._j._base._cachedAllTraits = null;
	/**
	* The cached equipment contributions for this battler, keyed by `code:dataId`.
	* Null when the cache is cold; each parameter is resolved on first ask and held for the rest of
	* the cycle, because the reads behind it scan note strings once per equipped item.
	* Invalidated by {@link #onBattlerDataChange}.
	* @type {Map<string, {delta: number, local: number}>|null}
	*/
	this._j._base._cachedEquipContributions = null;
};
/**
* Gets the cached trait objects for this battler, or null if the cache is cold.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]|null}
*/
Game_BattlerBase.prototype.getCachedTraitObjects = function() {
	return this._j._base._cachedTraitObjects;
};
/**
* Sets the cached trait objects for this battler.
* @param {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]|null} traitObjects The new cached value, or null to invalidate.
*/
Game_BattlerBase.prototype.setCachedTraitObjects = function(traitObjects) {
	this._j._base._cachedTraitObjects = traitObjects;
};
/**
* Gets all objects that bear traits for this battler.
*
* The result is cached and shared across all callers within a single data-change cycle.
* The cache is invalidated by {@link #onBattlerDataChange}, which fires whenever states,
* equipment, skills, or any other trait-bearing data changes on this battler.
*
* Subclasses define their full trait object list via {@link #buildTraitObjects} rather than
* pushing into the returned array — this keeps the cache safe from accidental mutation.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
*/
Game_BattlerBase.prototype.traitObjects = function() {
	if (this.getCachedTraitObjects() !== null) {
		return this.getCachedTraitObjects();
	}
	this.setCachedTraitObjects(this.buildTraitObjects());
	return this.getCachedTraitObjects();
};
/**
* Builds the complete list of objects that bear traits for this battler.
*
* This is the extension point for subclasses — override this instead of {@link #traitObjects}
* so the cache layer in {@link #traitObjects} remains intact. Return a fresh array each call;
* never mutate the result of a super call.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
*/
Game_BattlerBase.prototype.buildTraitObjects = function() {
	return [...this.states()];
};
/**
* Gets the cached flat trait list for this battler, or null if the cache is cold.
* @returns {MV.Trait[]|null}
*/
Game_BattlerBase.prototype.getCachedAllTraits = function() {
	return this._j._base._cachedAllTraits;
};
/**
* Sets the cached flat trait list for this battler.
* @param {MV.Trait[]|null} allTraits The new cached value, or null to invalidate.
*/
Game_BattlerBase.prototype.setCachedAllTraits = function(allTraits) {
	this._j._base._cachedAllTraits = allTraits;
};
/**
* Gets the flat list of all traits from all trait-bearing objects for this battler.
*
* The result is cached and shared across all callers within a single data-change cycle.
* Every downstream trait query — {@link #traits}, {@link #traitsWithId}, {@link #traitsPi},
* {@link #traitsDeltaSum}, {@link #traitsSum} — benefits automatically since they all
* call this method first.
*
* The cache is invalidated by {@link #onBattlerDataChange}.
* @returns {MV.Trait[]}
*/
Game_BattlerBase.prototype.allTraits = function() {
	if (this.getCachedAllTraits() !== null) {
		return this.getCachedAllTraits();
	}
	const allTraits = this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
	this.setCachedAllTraits(allTraits);
	return this.getCachedAllTraits();
};
/**
* Gets the cached equipment contributions for this battler, or null if the cache is cold.
* @returns {Map<string, {delta: number, local: number}>|null}
*/
Game_BattlerBase.prototype.getCachedEquipContributions = function() {
	return this._j._base._cachedEquipContributions;
};
/**
* Sets the cached equipment contributions for this battler.
* @param {Map<string, {delta: number, local: number}>|null} contributions The new cached value, or null to invalidate.
*/
Game_BattlerBase.prototype.setCachedEquipContributions = function(contributions) {
	this._j._base._cachedEquipContributions = contributions;
};
/**
* The trait sources on this battler whose parameter percentages apply only to themselves.
*
* Equipment is the one kind of trait source that is a discrete object the player swaps in and out, so a
* percentage on it describes the item rather than its wearer. Battlers with no equipment answer with
* nothing, which makes every localisation formula below a no-op for them rather than a special case.
* @returns {RPG_EquipItem[]}
*/
Game_BattlerBase.prototype.localisedEquips = function() {
	return Array.empty;
};
/**
* What equipment contributes to a parameter, split into the share to remove from the battler-wide
* aggregate and the share to re-apply locally.
*
* Cached per parameter for the rest of the data-change cycle, because the reads behind it scan a note
* string once per equipped item and parameters are asked for during damage resolution and once per row
* of every parameter catalog refresh.
* @param {number} code The trait code: 21, 22, or 23.
* @param {number} dataId The parameter id within that family.
* @returns {{delta: number, local: number}}
*/
Game_BattlerBase.prototype.equipParameterContribution = function(code, dataId) {
	if (this.getCachedEquipContributions() === null) {
		this.setCachedEquipContributions(new Map());
	}
	const cache = this.getCachedEquipContributions();
	const key = `${code}:${dataId}`;
	if (cache.has(key)) return cache.get(key);
	cache.set(key, this.buildEquipParameterContribution(code, dataId));
	return cache.get(key);
};
/**
* Computes equipment's contribution to one parameter from scratch.
*
* `delta` is what equipment contributed to the battler-wide total, in that family's own units, and gets
* subtracted back out. `local` is each item's own base for the parameter amplified by that same item's
* own percentages. Both are expressed through {@link RPG_EquipItem#ownRate}, which normalises all three
* families onto one 1.0-centred multiplier so a single subtraction serves each of them.
*
* `local` is always zero for base parameters — {@link Game_Actor#paramPlus} owns their local half, since
* those are the one family with an existing field to scale.
*
* Tags are authored as whole percents while the engine works in rate space, hence the hundredth - the
* same conversion J-NaturalGrowths applies to its own growth tags.
*
* Separated from the caching wrapper above so the arithmetic can be read and tested without the cache in
* the way, mirroring how {@link #buildTraitObjects} sits behind {@link #traitObjects}.
* @param {number} code The trait code: 21, 22, or 23.
* @param {number} dataId The parameter id within that family.
* @returns {{delta: number, local: number}}
*/
Game_BattlerBase.prototype.buildEquipParameterContribution = function(code, dataId) {
	let delta = 0;
	let local = 0;
	this.localisedEquips().forEach((equip) => {
		const ownRate = equip.ownRate(code, dataId);
		delta += ownRate - 1;
		if (code === Game_BattlerBase.TRAIT_PARAM) return;
		const base = code === Game_BattlerBase.TRAIT_XPARAM ? equip.thisXParam(dataId) : equip.thisSParam(dataId);
		local += base / 100 * ownRate;
	});
	return {
		delta,
		local
	};
};
/**
* Returns a list of known base parameter ids.
* @returns {number[]}
*/
Game_BattlerBase.knownBaseParameterIds = function() {
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7
	];
};
/**
* Returns a list of known ex-parameter ids.
* @returns {number[]}
*/
Game_BattlerBase.knownExParameterIds = function() {
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	];
};
/**
* Returns a list of known sp-parameter ids.
* @returns {number[]}
*/
Game_BattlerBase.knownSpParameterIds = function() {
	return [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	];
};
/**
* Gets the sum of deltas above the 1.0 neutral baseline for all traits matching the given
* code and dataId.  Each trait value is treated as `1.0 + delta`; this method isolates
* the delta portion and sums them additively.
*
* Intended for use with multiplicative-baseline trait families (sparams, element rates) where
* the default {@link Game_BattlerBase#traitsPi} produces unintuitive compound values when stacking.
*
* @param {number} code The trait code (e.g. {@link Game_BattlerBase.TRAIT_SPARAM}).
* @param {number} id The dataId that further identifies the specific trait.
* @returns {number} The sum of `(value - 1.0)` for all matching traits.
*/
Game_BattlerBase.prototype.traitsDeltaSum = function(code, id) {
	return this.traitsWithId(code, id).map((trait) => trait.value - 1).reduce((total, delta) => total + delta, 0);
};
/**
* Overwrites {@link Game_BattlerBase#sparam}.<br/>
* Replaces the default multiplicative aggregation (traitsPi) with additive delta stacking.
*
* RMMZ stores sparam trait values as multipliers (1.0 = baseline, 1.5 = +50%).
* The default engine multiplies them together, so two +50% traits compound to ×2.25 instead
* of the intuitive ×2.0. This override subtracts the 1.0 baseline from each trait value,
* sums the deltas, then restores the 1.0 baseline — giving linear, predictable stacking
* while keeping the 1.0 return value that engine healing/cost/damage formulas expect.
*
* @param {number} sparamId The sparam index (0–9).
* @returns {number} The additively aggregated sparam value.
*/
J.BASE.Aliased.Game_BattlerBase.set("sparam", Game_BattlerBase.prototype.sparam);
Game_BattlerBase.prototype.sparam = function(sparamId) {
	const { delta, local } = this.equipParameterContribution(Game_BattlerBase.TRAIT_SPARAM, sparamId);
	const global = 1 + this.traitsDeltaSum(Game_BattlerBase.TRAIT_SPARAM, sparamId) - delta;
	return global + local;
};
/**
* Overwrites {@link Game_BattlerBase#xparam}.<br/>
* Scopes each equipped item's percentages to that item's own base rather than the battler's total.
*
* Vanilla aggregation is already additive here, so nothing about the stacking changes. What changes is
* whose value a percentage on a sword is a percentage *of*: previously the wearer's whole accuracy, now
* the sword's. Equipment's share is subtracted from the battler-wide sum and re-applied per item.
* @param {number} xparamId The xparam index (0-9).
* @returns {number}
*/
J.BASE.Aliased.Game_BattlerBase.set("xparam", Game_BattlerBase.prototype.xparam);
Game_BattlerBase.prototype.xparam = function(xparamId) {
	const global = J.BASE.Aliased.Game_BattlerBase.get("xparam").call(this, xparamId);
	const { delta, local } = this.equipParameterContribution(Game_BattlerBase.TRAIT_XPARAM, xparamId);
	return global - delta + local;
};
/**
* Overwrites {@link Game_BattlerBase#elementRate}.<br/>
* Replaces the default multiplicative aggregation (traitsPi) with additive delta stacking.
*
* RMMZ stores element rate trait values as multipliers (1.0 = neutral, 1.2 = +20% damage taken).
* The default engine multiplies them together, so two +20% traits compound to ×1.44 instead of
* the intuitive ×1.4. This override subtracts the 1.0 baseline from each trait value, sums the
* deltas, then restores the 1.0 baseline — giving linear, predictable stacking.
*
* The result is floored at 0 to prevent negative element rates from inverting damage direction.
* Absorption is handled separately by J.ELEM and is not affected by this override.
*
* @param {number} elementId The element ID to compute the rate for.
* @returns {number} The additively aggregated element rate, minimum 0.
*/
J.BASE.Aliased.Game_BattlerBase.set("elementRate", Game_BattlerBase.prototype.elementRate);
Game_BattlerBase.prototype.elementRate = function(elementId) {
	const rate = 1 + this.traitsDeltaSum(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
	return Math.max(0, rate);
};
/**
* Overwrites {@link Game_BattlerBase#paramRate}.<br/>
* Replaces the default multiplicative aggregation (traitsPi) with additive delta stacking.
*
* RMMZ stores param rate trait values as multipliers (1.0 = baseline, 1.5 = +50%).
* The default engine multiplies them together, so two +50% ATK traits compound to ×2.25 instead
* of the intuitive ×2.0. This override subtracts the 1.0 baseline from each trait value, sums
* the deltas, then restores the 1.0 baseline — giving linear, predictable stacking.
*
* The result is floored at 0; the engine already enforces a param floor via paramMin(),
* but keeping the rate non-negative avoids unexpected sign inversions from heavy reductions.
*
* @param {number} paramId The param index (0–7).
* @returns {number} The additively aggregated param rate, minimum 0.
*/
J.BASE.Aliased.Game_BattlerBase.set("paramRate", Game_BattlerBase.prototype.paramRate);
Game_BattlerBase.prototype.paramRate = function(paramId) {
	const { delta } = this.equipParameterContribution(Game_BattlerBase.TRAIT_PARAM, paramId);
	const rate = 1 + this.traitsDeltaSum(Game_BattlerBase.TRAIT_PARAM, paramId) - delta;
	return Math.max(0, rate);
};
/**
* Overwrites {@link Game_BattlerBase#stateRate}.<br/>
* Replaces the default multiplicative aggregation (traitsPi) with additive delta stacking.
*
* RMMZ stores state rate trait values as multipliers (1.0 = neutral, 0.5 = 50% less likely).
* The default engine multiplies them together, so two 50%-resist traits compound to ×0.25 instead
* of the intuitive ×0.0 (immunity). This override subtracts the 1.0 baseline from each trait
* value, sums the deltas, then restores the baseline — giving linear, predictable stacking.
*
* The result is floored at 0 so stacked resistances can reach full immunity without going negative.
*
* @param {number} stateId The state ID to compute the rate for.
* @returns {number} The additively aggregated state rate, minimum 0.
*/
J.BASE.Aliased.Game_BattlerBase.set("stateRate", Game_BattlerBase.prototype.stateRate);
Game_BattlerBase.prototype.stateRate = function(stateId) {
	const rate = 1 + this.traitsDeltaSum(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
	return Math.max(0, rate);
};
/**
* Gets the maximum tp/tech for this battler.
*/
Object.defineProperty(Game_BattlerBase.prototype, "mtp", {
	get: function() {
		return this.maxTp();
	},
	configurable: true
});
/**
* Magic reflect rate — negative values are meaningless, so floor at zero for combat and UI.
*/
Object.defineProperty(Game_BattlerBase.prototype, "mrf", {
	get: function() {
		return Math.max(0, this.xparam(5));
	},
	configurable: true
});
/**
* Counter rate — negative values are meaningless, so floor at zero for combat and UI.
*/
Object.defineProperty(Game_BattlerBase.prototype, "cnt", {
	get: function() {
		return Math.max(0, this.xparam(6));
	},
	configurable: true
});
/**
* Mp cost rate — negative values would let skillMpCost() go negative, which paySkillCost()
* would then treat as a free MP refund on cast. Floor at zero to prevent that.
*/
Object.defineProperty(Game_BattlerBase.prototype, "mcr", {
	get: function() {
		return Math.max(0, this.sparam(4));
	},
	configurable: true
});
/**
* Tp charge rate — negative values would let TP gain from damage/items go negative, silently
* draining TP instead of charging it. Floor at zero.
*/
Object.defineProperty(Game_BattlerBase.prototype, "tcr", {
	get: function() {
		return Math.max(0, this.sparam(5));
	},
	configurable: true
});

//#endregion
//#region src/plugins/_base/core/objects/Game_Character.js
/**
* Determines if this character is actually a player.
* @returns {boolean} True if this is a player, false otherwise.
*/
Game_Character.prototype.isPlayer = function() {
	return false;
};
/**
* Determines if this character is actually an event.
* @returns {boolean} True if this is an event, false otherwise.
*/
Game_Character.prototype.isEvent = function() {
	return false;
};
/**
* Determines if this character is actually a follower.
* @returns {boolean} True if this is a follower, false otherwise.
*/
Game_Character.prototype.isFollower = function() {
	return false;
};
/**
* Determines whether or not this character is currently erased.
* Non-events cannot be erased.
* @returns {boolean}
*/
Game_Character.prototype.isErased = function() {
	return false;
};
/**
* Determines whether or not this character is actually a vehicle.
* @return {boolean} True if this is a vehicle, false otherwise.
*/
Game_Character.prototype.isVehicle = function() {
	return false;
};
/**
* Gets the distance in tiles between this character and the player.
* @returns {number} The distance.
*/
Game_Character.prototype.distanceFromPlayer = function() {
	return this.distanceFromCharacter($gamePlayer);
};
/**
* Gets the distance in tiles between this character and another character.
* @param {Game_Character} character The character to determine distance from.
* @returns {number} The distance.
*/
Game_Character.prototype.distanceFromCharacter = function(character) {
	if (this === character) return 0;
	const distance = $gameMap.distance(character.x, character.y, this.x, this.y);
	const constrainedDistance = parseFloat(distance.toFixed(3));
	return constrainedDistance;
};
/**
* Characters are visible by default.
* The base engine only defines {@code isVisible} on {@link Game_Follower} and {@link Game_Vehicle};
* subclasses that have their own visibility logic (followers, vehicles) override this.
* @returns {boolean}
*/
Game_Character.prototype.isVisible = function() {
	return true;
};
/**
* Gets the remaining frames this character must wait before its next move.
* @returns {number} The waitCount.
*/
Game_Character.prototype.waitCount = function() {
	return this._waitCount;
};
/**
* Sets the remaining frames this character must wait before its next move.
* @param {number} newWaitCount The new waitCount.
*/
Game_Character.prototype.setWaitCount = function(newWaitCount) {
	this._waitCount = newWaitCount;
};
/**
* Gets the move route this character is currently following.
* @returns {object} The moveRoute.
*/
Game_Character.prototype.moveRoute = function() {
	return this._moveRoute;
};
/**
* Gets how far through the current move route this character is.
* @returns {number} The moveRouteIndex.
*/
Game_Character.prototype.moveRouteIndex = function() {
	return this._moveRouteIndex;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_CharacterBase.js
/**
* Gets all valid directions supported by the default system.
* @returns {number[]}
*/
Game_CharacterBase.prototype.getValidDirections = function() {
	return [...this.getValidCardinalDirections(), ...this.getValidDiagonalDirections()];
};
/**
* Gets all valid diagonal directions.
* @returns {number[]}
*/
Game_CharacterBase.prototype.getValidDiagonalDirections = function() {
	return [
		1,
		3,
		7,
		9
	];
};
/**
* Gets all valid cardinal directions.
* @returns {number[]}
*/
Game_CharacterBase.prototype.getValidCardinalDirections = function() {
	return [
		2,
		4,
		6,
		8
	];
};
/**
* Determines if a numeric directional input is diagonal.
* @param {number} direction The direction to check.
* @returns {boolean} True if the input is diagonal, false otherwise.
*/
Game_CharacterBase.prototype.isDiagonalDirection = function(direction) {
	return [
		1,
		3,
		7,
		9
	].contains(direction);
};
/**
* Determines if a numeric directional input is straight.
* @param {number} direction The direction to check.
* @returns {boolean} True if the input is straight, false otherwise.
*/
Game_CharacterBase.prototype.isStraightDirection = function(direction) {
	return [
		2,
		4,
		6,
		8
	].contains(direction);
};
/**
* Determines the horz/vert directions to move based on a diagonal direction.
* @param {[horz: number, vert: number]} direction The diagonal-only numeric direction to move.
*/
Game_CharacterBase.prototype.getDiagonalDirections = function(direction) {
	switch (direction) {
		case 1: return [4, 2];
		case 3: return [6, 2];
		case 7: return [4, 8];
		case 9: return [6, 8];
	}
};
/**
* Converts a horizontal/vertical direction pair into a single 8-dir code.
* Valid inputs are (4|6) for horz and (2|8) for vert. Returns 0 if invalid.
* @param {4|6} horz The horizontal component (4=left, 6=right).
* @param {2|8} vert The vertical component (2=down, 8=up).
* @returns {1|3|7|9|0} The 8-dir code for the diagonal, or 0 if invalid.
*/
Game_CharacterBase.prototype.directionFromHorzVert = function(horz, vert) {
	if (horz === 4 && vert === 2) {
		return 1;
	}
	if (horz === 6 && vert === 2) {
		return 3;
	}
	if (horz === 4 && vert === 8) {
		return 7;
	}
	if (horz === 6 && vert === 8) {
		return 9;
	}
	return 0;
};
/**
* Gets the number of frames this character has been standing still.
* @returns {number} The stopCount.
*/
Game_CharacterBase.prototype.stopCount = function() {
	return this._stopCount;
};
/**
* Sets the number of frames this character has been standing still.
* @param {number} newStopCount The new stopCount.
*/
Game_CharacterBase.prototype.setStopCount = function(newStopCount) {
	this._stopCount = newStopCount;
};
/**
* Sets the x coordinate of this character on the map.
*
* RMMZ exposes the matching getter as the native `x` property rather than a method, so reads go
* through `this.x` while writes come here- defining an `x()` method would clobber that property.
* @param {number} newX The new x coordinate.
*/
Game_CharacterBase.prototype.setX = function(newX) {
	this._x = newX;
};
/**
* Sets the y coordinate of this character on the map.
*
* Reads go through the native `y` property, for the same reason described on {@link #setX}.
* @param {number} newY The new y coordinate.
*/
Game_CharacterBase.prototype.setY = function(newY) {
	this._y = newY;
};
/**
* Gets the interpolated x coordinate this character is rendered at mid-step.
* @returns {number} The realX.
*/
Game_CharacterBase.prototype.realX = function() {
	return this._realX;
};
/**
* Sets the interpolated x coordinate this character is rendered at mid-step.
* @param {number} newRealX The new realX.
*/
Game_CharacterBase.prototype.setRealX = function(newRealX) {
	this._realX = newRealX;
};
/**
* Gets the interpolated y coordinate this character is rendered at mid-step.
* @returns {number} The realY.
*/
Game_CharacterBase.prototype.realY = function() {
	return this._realY;
};
/**
* Sets the interpolated y coordinate this character is rendered at mid-step.
* @param {number} newRealY The new realY.
*/
Game_CharacterBase.prototype.setRealY = function(newRealY) {
	this._realY = newRealY;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Enemies.js
/**
* A class that acts as a lazy dictionary for {@link Game_Enemy} data.<br/>
* Do not use the enemies from this class as actual battlers!
*/
var Game_Enemies = class {
	/**
	* A simple cache to store enemies by their ids.
	* @type {Map<number, Game_Enemy>}
	*/
	#cache = new Map();
	/**
	* Gets the enemy battler data for the enemy id provided.
	* @param {number} enemyId The enemy id to generate an enemy for.
	* @returns {Game_Enemy} The enemy battler data.
	*/
	enemy(enemyId) {
		if (this.#cache.has(enemyId)) {
			return this.#cache.get(enemyId);
		}
		const enemy = new Game_Enemy(enemyId, 0, 0);
		this.#cache.set(enemyId, enemy);
		return enemy;
	}
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Enemy.js
/**
* Gets the battler id of this enemy from the database.
* @returns {number}
*/
Game_Enemy.prototype.battlerId = function() {
	return this.enemyId();
};
/**
* The underlying database data for this enemy.
* @returns {RPG_Enemy}
*/
Game_Enemy.prototype.databaseData = function() {
	return this.enemy();
};
/**
* Gets all notes associated with the enemy and its class.
* @returns {[RPG_Enemy]}
*/
Game_Enemy.prototype.getEnemyNotes = function() {
	const enemy = this.enemy();
	return [enemy];
};
/**
* Extends {@link #setup}.<br/>
* Adds a hook for performing actions when an enemy is setup.
*/
J.BASE.Aliased.Game_Enemy.set("setup", Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId) {
	J.BASE.Aliased.Game_Enemy.get("setup").call(this, enemyId);
	this.onSetup(enemyId);
};
/**
* A hook for performing actions when an enemy is setup.
* @param {number} enemyId The enemy's id.
*/
Game_Enemy.prototype.onSetup = function(enemyId) {
	this.onBattlerDataChange();
};
/**
* Overwrites the vanilla {@link #traitObjects} defined on {@link Game_Enemy}.<br/>
* Routes all calls through the cache wrapper on {@link Game_BattlerBase} so the
* vanilla implementation — which concatenates directly onto the returned array — can never
* shadow our cache layer or cause accidental mutation.
* @returns {(RPG_Enemy|RPG_State)[]}
*/
Game_Enemy.prototype.traitObjects = function() {
	return Game_BattlerBase.prototype.traitObjects.call(this);
};
/**
* Overwrites {@link #buildTraitObjects}.<br/>
* Enemies have one additional trait-bearing source beyond states: their own enemy database entry.
*
* Returns a fresh array — never mutates the result of any super call — so the
* cache in {@link #traitObjects} remains safe.
* @returns {(RPG_Enemy|RPG_State)[]}
*/
Game_Enemy.prototype.buildTraitObjects = function() {
	return [...this.states(), this.enemy()];
};
/**
* Converts all "actions" from an enemy into their collection of known skills.
* This includes both skills listed in their skill list, and any added skills via traits.
* @returns {RPG_Skill[]}
*/
Game_Enemy.prototype.skills = function() {
	const actions = this.enemy().actions.filter(this.canMapActionToSkill, this).map((action) => this.skill(action.skillId), this);
	const skillTraits = this.traitObjects().filter((trait) => trait.code === J.BASE.Traits.ADD_SKILL).map((skillTrait) => this.skill(skillTrait.dataId), this);
	return actions.concat(skillTraits).sort();
};
/**
* Gets the raw skill ids available to this enemy.
* Combines action skill ids with any bonus skill ids granted by traits,
* then deduplicates so each id appears at most once.
* Mirrors the logic of {@link #skills} but returns ids instead of resolved skill objects,
* making it safe to call from inside the skill extension resolver.
* @returns {number[]}
*/
Game_Enemy.prototype.skillIds = function() {
	const actionIds = this.enemy().actions.filter(this.canMapActionToSkill, this).map((action) => action.skillId);
	const traitIds = this.traitObjects().filter((trait) => trait.code === J.BASE.Traits.ADD_SKILL).map((trait) => trait.dataId);
	return [...new Set(actionIds.concat(traitIds))];
};
/**
* Determines whether or not the action can be mapped to a skill.
* @param {RPG_EnemyAction} action The action being mapped to a skill.
* @returns {boolean}
*/
Game_Enemy.prototype.canMapActionToSkill = function(action) {
	return true;
};
/**
* Checks whether or not this enemy knows this skill.
* @param {number} skillId The id of the skill to check for.
* @returns {boolean}
*/
Game_Enemy.prototype.hasSkill = function(skillId) {
	return this.skills().some((skill) => skill.id === skillId);
};
/**
* Forces this enemy to learn the skill of the given id.<br/>
* Will not learn the skill again if it is already learned.
* @param {number} skillId The skill id to learn.
* @returns {boolean} True if the enemy learned the new skill, false if it already knew it.
*/
Game_Enemy.prototype.learnSkill = function(skillId) {
	if (this.hasSkill(skillId)) return false;
	const rpgEnemyAction = {
		"conditionParam1": 0,
		"conditionParam2": 0,
		"conditionType": 0,
		"rating": 5,
		"skillId": skillId
	};
	this.enemy().actions.push(rpgEnemyAction);
	return true;
};
/**
* Extends {@link #die}.<br/>
* Adds a toggle of the death effects.
*/
J.BASE.Aliased.Game_Enemy.set("die", Game_Enemy.prototype.die);
Game_Enemy.prototype.die = function() {
	J.BASE.Aliased.Game_Enemy.get("die").call(this);
	this.onDeath();
};
/**
* An event hook fired when this enemy dies.
*/
Game_Enemy.prototype.onDeath = function() {
	this.onBattlerDataChange();
};
/**
* Gets the base max tp for this enemy.
* @returns {number}
*/
Game_Enemy.prototype.getBaseMaxTp = function() {
	return J.BASE.Metadata.BaseTpMaxEnemies;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Event.js
/**
* Gets all valid-shaped comment event commands.
* @returns {RPG_EventListCommand[]}
*/
Game_Event.prototype.getValidCommentCommands = function() {
	if (!this.canGetValidCommentCommands()) return Array.empty;
	return this.list().filter(Game_Event.filterInvalidEventCommand, this);
};
/**
* Gets all valid-shaped comment event commands from a designated page.
* @param {RPG_MapEventPage} page The event page to parse comments from.
*/
Game_Event.getValidCommentCommandsFromPage = function(page) {
	const commands = page.list;
	if (commands.length === 0) return Array.empty;
	return commands.filter(Game_Event.filterInvalidEventCommand, this);
};
/**
* Filters out event commands that are not comments intended for regex parsing.
* @param {RPG_EventListCommand} command The command to evaluate.
* @returns {boolean}
*/
Game_Event.filterInvalidEventCommand = function(command) {
	if (!Game_Event.matchesControlCode(command.code)) return false;
	const [comment] = command.parameters;
	return J.BASE.RegExp.ParsableComment.test(comment);
};
/**
* Determines whether or not the parsable comment commands can be retrieved.
* @returns {boolean} True if they can be parsed, false otherwise.
*/
Game_Event.prototype.canGetValidCommentCommands = function() {
	if (!this) return false;
	if (!this.page()) return false;
	if (!this.page().list) return false;
	if (!this.list()) return false;
	if (this.list().length === 0) return false;
	return true;
};
/**
* Detects whether or not the event code is one that matches the "comment" code.
* @param {number} code The code to match.
* @returns {boolean}
*/
Game_Event.matchesControlCode = function(code) {
	const controlCodes = [108, 408];
	return controlCodes.includes(code);
};
/**
* Extracts a value out of an event's comments based on the provided structure.
* If there are multiple matches in the comments, only the last one will be returned.
* @param {RegExp} structure The regex to find values for.
* @param {any=} defaultValue The default value to start with; defaults to null.
* @param {boolean=} andParse Whether or not to parse the results; defaults to true.
* @returns {any} The last found value, or the default if nothing was found.
*/
Game_Event.prototype.extractValueByRegex = function(structure, defaultValue = null, andParse = true) {
	let val = defaultValue;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		const regexResult = structure.exec(comment);
		if (!regexResult) return;
		[, val] = regexResult;
	});
	if (val === defaultValue) return val;
	if (!andParse) return val;
	return JsonMapper.parseObject(val);
};
/**
* Extracts a value out of an event's comments based on the provided structure.
* If there are multiple matches in the comments, only the last one will be returned.
* @param {RPG_EventListCommand} command The command in question.
* @param {RegExp} structure The regex to find values for.
* @param {any=} defaultValue The default value to start with; defaults to null.
* @param {boolean=} andParse Whether or not to parse the results; defaults to true.
* @returns {any} The last found value, or the default if nothing was found.
*/
Game_Event.prototype.getDataForCommandByRegex = function(command, structure, defaultValue = null, andParse = true) {
	const [comment] = command.parameters;
	structure.lastIndex = 0;
	const regexResult = structure.exec(comment);
	if (!regexResult) return;
	const [, val] = regexResult;
	if (val === defaultValue) return val;
	if (!andParse) return val;
	return JsonMapper.parseObject(val);
};
/**
* Gets the current page's event command list if it is present, or an empty array if it isn't.
* @returns {RPG_EventListCommand[]}
*/
Game_Event.prototype.getEventCommandList = function() {
	let list = [];
	if (this.page() && this.list()) {
		list = this.list() ?? [];
	}
	return list;
};
/**
* Determines whether or not the given plugin commands are present in the list of event commands for a given plugin.
* @param {string} targetPluginName The name of the plugin to look for commands for.
* @param {string[]} commandNames The collection of plugin command names to validate existence of.
*/
Game_Event.prototype.hasPluginCommand = function(targetPluginName, commandNames) {
	const list = this.getEventCommandList();
	const found = !!list.find((cmd) => {
		if (!cmd || cmd.code !== 357) return false;
		const [pluginName, commandName] = cmd.parameters;
		if (!commandName) return false;
		if (pluginName !== targetPluginName) return false;
		return commandNames.includes(commandName);
	});
	return found;
};
/**
* Determines if this character is actually an event.
* @returns {boolean}
*/
Game_Event.prototype.isEvent = function() {
	return true;
};
/**
* Determines whether or not this character is currently erased.
* Non-events cannot be erased.
* @returns {boolean}
*/
Game_Event.prototype.isErased = function() {
	return this._erased;
};
/**
* Gets the index of the currently active event page.
* @returns {number} The pageIndex.
*/
Game_Event.prototype.pageIndex = function() {
	return this._pageIndex;
};
/**
* Sets the index of the currently active event page.
* @param {number} newPageIndex The new pageIndex.
*/
Game_Event.prototype.setPageIndex = function(newPageIndex) {
	this._pageIndex = newPageIndex;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Follower.js
/**
* Whether or not this character is a follower.
* @returns {boolean} True if this is a follower, false otherwise.
*/
Game_Follower.prototype.isFollower = function() {
	return true;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Item.js
/**
* Extends {@link Game_Item.initialize}.<br/>
* Also runs the member-initialization hook every plugin hangs its own state off.
*/
J.BASE.Aliased.Game_Item.set("initialize", Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item) {
	J.BASE.Aliased.Game_Item.get("initialize").call(this, item);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_Item}.<br>
*
* Note that this takes no arguments while `initialize` takes the item being wrapped. That split is
* the point: a decode has a savefile, not a constructor argument, so the hook is only ever a
* *defaulter*. Anything a plugin derives from the argument belongs in an `initialize` alias, and
* whatever that field's resting value is belongs here.
*
* **Plugins adding state to a game item alias this, not `initialize`.**
*/
Game_Item.prototype.initMembers = function() {};
/**
* Gets the data class of this item, describing which database this item is drawn from.
* @returns {string} One of "skill", "item", "weapon", or "armor"- or empty when unassigned.
*/
Game_Item.prototype.dataClass = function() {
	return this._dataClass;
};
/**
* Sets the data class of this item.
* @param {string} newDataClass One of "skill", "item", "weapon", or "armor".
*/
Game_Item.prototype.setDataClass = function(newDataClass) {
	this._dataClass = newDataClass;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Interpreter.js
/**
* Gets the conditional branch results by indent depth.
* @returns {Object<number, number|boolean>} The branch.
*/
Game_Interpreter.prototype.branch = function() {
	return this._branch;
};
/**
* Gets the indent depth of the command being executed.
* @returns {number} The indent.
*/
Game_Interpreter.prototype.indent = function() {
	return this._indent;
};
/**
* Gets the index of the command being executed.
* @returns {number} The index.
*/
Game_Interpreter.prototype.index = function() {
	return this._index;
};
/**
* Sets the index of the command being executed.
* @param {number} newIndex The new index.
*/
Game_Interpreter.prototype.setIndex = function(newIndex) {
	this._index = newIndex;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Map.js
/**
* Extends {@link Game_Map.initialize}.<br/>
* Also runs the member-initialization hook every plugin hangs its own state off.
*/
J.BASE.Aliased.Game_Map.set("initialize", Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function() {
	J.BASE.Aliased.Game_Map.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_Map}.<br>
*
* Vanilla sets the map up inside `initialize`, which a decode can never re-run, so plugin state
* added through it would come back missing. This hook is what a decode *can* run: the map's codec
* seeds the engine's own fields and then calls this, walking the same chain construction does.
*
* **Plugins adding state to the map alias this, not `initialize`.**
*/
Game_Map.prototype.initMembers = function() {};
/**
* Gets the raw event collection, nulls and all.
*
* This is deliberately not {@link Game_Map#events}, which filters the nulls out. A null is an
* empty slot awaiting reuse, so any code adding or removing events by index needs to see them.
* @returns {(Game_Event|null)[]} The raw, index-stable event collection.
*/
Game_Map.prototype.rawEvents = function() {
	return this._events;
};
/**
* Places an event into a specific slot of the event collection.
* @param {number} index The slot to place the event into.
* @param {Game_Event} newEvent The event being placed.
*/
Game_Map.prototype.setEventByIndex = function(index, newEvent) {
	this._events[index] = newEvent;
};
/**
* Empties a specific slot of the event collection, leaving it free for reuse.
* @param {number} index The slot to empty.
*/
Game_Map.prototype.clearEventByIndex = function(index) {
	this._events[index] = null;
};
/**
* Gets the note for the current map.
* @returns {string|String.empty}
*/
Game_Map.prototype.note = function() {
	if (!$dataMap) {
		Diagnostics.warn("J-Base", `attempted to get the note for a map that isn't available.`, {
			map: this,
			dataMap: $dataMap
		});
		return String.empty;
	}
	return $dataMap.note;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Party.js
/**
* Extends {@link Game_Party.initialize}.<br/>
* Also runs the member-initialization hook every plugin hangs its own state off.
*/
J.BASE.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.BASE.Aliased.Game_Party.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_Party}.<br>
*
* Vanilla sets the party up inside `initialize`, which takes no arguments but is never safe to
* re-run - so a save being decoded cannot call it, and any plugin state added through it would come
* back missing. This hook exists so that state has somewhere to live that a decode *can* run:
* `Game_Party`'s codec seeds the engine's own fields and then calls this, which walks the same alias
* chain construction does.
*
* **Plugins adding state to the party alias this, not `initialize`.**
*/
Game_Party.prototype.initMembers = function() {};
/**
* Gets the raw item container, mapping item ids to the quantity held.
*
* This is deliberately not {@link Game_Party#items}, which resolves the ids into database rows.
* Anything inspecting or pruning the container itself needs the id-keyed form.
* @returns {Object<number, number>} The raw id-to-quantity map.
*/
Game_Party.prototype.rawItems = function() {
	return this._items;
};
/**
* Gets the raw weapon container, mapping weapon ids to the quantity held.
* @returns {Object<number, number>} The raw id-to-quantity map.
*/
Game_Party.prototype.rawWeapons = function() {
	return this._weapons;
};
/**
* Gets the raw armor container, mapping armor ids to the quantity held.
* @returns {Object<number, number>} The raw id-to-quantity map.
*/
Game_Party.prototype.rawArmors = function() {
	return this._armors;
};
/**
* Drops every inventory entry whose database row no longer exists, and shouts about each one.
*
* **A savefile outlives the database it was written against.** Deleting a row during development is ordinary and
* correct - a whole family of weapons stops being part of the game - but every save written beforehand still holds
* that row in its containers. Those containers store quantities against keys, so a deleted row leaves a key
* pointing at nothing, and `Game_Party.weapons` resolves it by handing back `undefined`.
*
* Vanilla survives that only by luck: `DataManager.isItem` reads `item && …`, so engine windows silently skip the
* gaps. Plugin code that asks a row a question first - `datum.isArmor()` - dies instead, somewhere entirely
* unrelated to the deletion, with a stack trace that names neither the row nor the reason.
*
* So the reconciliation happens once, out loud, in one place. This is deliberately **not** a guard sprinkled across
* every predicate that touches inventory: the entry is genuinely gone, and the honest thing is to say so and drop
* it, rather than teach fifty callers to tiptoe around a hole.
*/
Game_Party.prototype.pruneMissingInventoryEntries = function() {
	const prunedItems = this.pruneMissingFromContainer(this.rawItems(), $dataItems, "i");
	const prunedWeapons = this.pruneMissingFromContainer(this.rawWeapons(), $dataWeapons, "w");
	const prunedArmors = this.pruneMissingFromContainer(this.rawArmors(), $dataArmors, "a");
	const pruned = prunedItems.concat(prunedWeapons, prunedArmors);
	if (pruned.length === 0) {
		return;
	}
	this.reportPrunedInventoryEntries(pruned);
};
/**
* Removes the keys of one container that no longer resolve to a row, reporting what was removed.
*
* Keys are read against the datastore rather than trusted, because that is the whole question being asked. Note
* this is indexed by the container's own key, which is the row's index rather than its id - the two agree for
* anything authored in the editor, and dynamically created rows are the reason the distinction exists.
* @param {Object<number, number>} container The raw key-to-quantity map to prune.
* @param {RPG_BaseItem[]} datastore The table those keys are supposed to index.
* @param {string} type The datastore letter this container holds - `i`, `w`, or `a`.
* @returns {string[]} One `type`-prefixed key per entry removed, such as `w181`.
*/
Game_Party.prototype.pruneMissingFromContainer = function(container, datastore, type) {
	const pruned = [];
	Object.keys(container).forEach((key) => {
		if (datastore[key]) {
			return;
		}
		pruned.push(`${type}${key}`);
		delete container[key];
	});
	return pruned;
};
/**
* Announces, in one line, the inventory entries that were dropped because their database rows are gone.
*
* Deliberately a single message rather than one per entry. Deletions come in families - a whole tier of weapons
* retired at once - so a per-entry report is dozens of near-identical lines that bury the very pattern that makes
* the cause recognisable. The keys are listed in the same `i` / `w` / `a` shorthand the salvage ledger uses, so a
* reader already knows how to read them.
* @param {string[]} pruned Every dropped entry, already type-prefixed.
*/
Game_Party.prototype.reportPrunedInventoryEntries = function(pruned) {
	const plural = pruned.length === 1 ? "entry" : "entries";
	const listed = pruned.join(",");
	const cause = "rows deleted after this save was written";
	const summary = `dropped ${pruned.length} inventory ${plural} whose database rows no longer exist`;
	Diagnostics.warn("J-Base", `${summary} (${cause}): [${listed}]`);
};
/**
* Overwrites {@link #gainItem}.<br/>
* Replaces item gain and management with index-based management instead.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
	if (!item) {
		return;
	}
	const container = this.itemContainer(item);
	if (container) {
		this.processItemGain(item, amount, includeEquip);
	} else {
		this.processContainerlessItemGain(item, amount, includeEquip);
	}
};
/**
* Modifies the quantity of an item/weapon/armor.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
Game_Party.prototype.processItemGain = function(item, amount, includeEquip) {
	const container = this.itemContainer(item);
	const lastNumber = this.numItems(item);
	const newNumber = lastNumber + amount;
	const itemKey = item._key();
	container[itemKey] = newNumber.clamp(0, this.maxItems(item));
	if (container[itemKey] === 0) {
		delete container[itemKey];
	}
	if (includeEquip && newNumber < 0) {
		this.discardMembersEquip(item, -newNumber);
	}
	$gameMap.requestRefresh();
};
/**
* Hook for item gain processing when the item gained was not one of the three main
* item types from the database.
* @param {RPG_BaseItem} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
Game_Party.prototype.processContainerlessItemGain = function(item, amount, includeEquip) {
	Diagnostics.error("J-Base", `an item was gained that is not flagged as a database object: ${item.name}.`, {
		item,
		amount,
		includeEquip
	});
};
/**
* Extends {@link #maxItems}.<br/>
* Adds more handling regarding maximum quantities for your inventory.
*/
J.BASE.Aliased.Game_Party.set("maxItems", Game_Party.prototype.maxItems);
Game_Party.prototype.maxItems = function(item = null) {
	const defaultMax = this.defaultMaxItems();
	if (!item) return defaultMax;
	const maxForItem = RPGManager.getNumberFromNoteByRegex(item, J.BASE.RegExp.MaxItems, true);
	if (maxForItem !== null) {
		return maxForItem;
	}
	return defaultMax;
};
/**
* The default maximum item count.
* @returns {number}
*/
Game_Party.prototype.defaultMaxItems = function() {
	return 999;
};
/**
* Overwrites {@link #numItems}.<br/>
* Retrieves the item based on its index.
* @param {RPG_BaseItem} item The item to check the quantity of.
* @returns {number}
*/
Game_Party.prototype.numItems = function(item) {
	const container = this.itemContainer(item);
	return container ? container[item._key()] || 0 : 0;
};
/**
* Get all items, including duplicates based on quantity.
* @returns {RPG_BaseItem[]}
*/
Game_Party.prototype.allItemsQuantified = function() {
	const allItemsDistinct = this.allItems();
	const allItemsRepeated = [];
	allItemsDistinct.forEach((baseItem) => {
		let count = this.numItems(baseItem);
		while (count > 0) {
			allItemsRepeated.push(baseItem);
			count--;
		}
	}, this);
	return allItemsRepeated;
};
/**
* Recovers the entire party back to perfect condition.
*/
Game_Party.prototype.recoverAllMembers = function() {
	this.members().forEach((member) => member.recoverAll());
};
/**
* Overwrites {@link #maxBattleMembers}.<br/>
* Sets the maximum number of battle members to 8.
* @returns {number}
*/
Game_Party.prototype.maxBattleMembers = function() {
	return 8;
};
/**
* Sets the level of all party members to the given level.
* @param {number} level The level to set all party members to.
*/
Game_Party.prototype.setLevel = function(level) {
	this.members().forEach((member) => {
		const normalizedLevel = level.clamp(1, member.maxLevel());
		member.setLevel(normalizedLevel);
	});
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Player.js
/**
* Determines if this character is actually a player.
* @returns {boolean}
*/
Game_Player.prototype.isPlayer = function() {
	return true;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Screen.js
/**
* Gets the tone the screen is currently moving toward.
*
* Vanilla exposes {@link Game_Screen.tone} but nothing for the destination, and the two answer very
* different questions. A tint runs over a duration, so partway through a fade the current tone is a
* value nobody asked for - an interpolation between where it was and where it is going. Anything
* deciding *who set the tint* has to compare against the destination; comparing against the current
* value reads any in-progress fade as belonging to nobody.
* @returns {[number, number, number, number]}
*/
Game_Screen.prototype.toneTarget = function() {
	return this._toneTarget;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_System.js
/**
* Extends {@link Game_System.initialize}.<br/>
* Initializes all members of this class and adds our custom members.
*/
J.BASE.Aliased.Game_System.set("initialize", Game_System.prototype.initialize);
Game_System.prototype.initialize = function() {
	J.BASE.Aliased.Game_System.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_System}.<br>
*/
Game_System.prototype.initMembers = function() {};
Game_System.prototype.gainAllEverything = function(count = 1) {
	this.gainAllItems(count);
	this.gainAllWeapons(count);
	this.gainAllArmors(count);
};
Game_System.prototype.gainAllItems = function(count = 1) {
	$dataItems.filter(this.canGainEntry).forEach((entry) => $gameParty.gainItem(entry, count));
};
Game_System.prototype.gainAllWeapons = function(count = 1) {
	$dataWeapons.filter(this.canGainEntry).forEach((entry) => $gameParty.gainItem(entry, count));
};
Game_System.prototype.gainAllArmors = function(count = 1) {
	$dataArmors.filter(this.canGainEntry).forEach((entry) => $gameParty.gainItem(entry, count));
};
/**
* Whether or not an entry from the database can be gained in the context
* of the various "gainAll*" methods.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} entry The database entry being gained.
* @return {boolean} True if the entry can be gained, false otherwise.
*/
Game_System.prototype.canGainEntry = function(entry) {
	if (entry === undefined || entry === null) return false;
	if (entry.name.trim().length === 0) return false;
	if (entry.name.startsWith("_")) return false;
	if (entry.name.startsWith("==")) return false;
	if (entry.name.includes("-- empty --")) return false;
	return true;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Temp.js
/**
* Extends {@link Game_Temp.initialize}.<br/>
* Initializes all members of this class and adds our custom members.
*/
J.BASE.Aliased.Game_Temp.set("initialize", Game_Temp.prototype.initialize);
Game_Temp.prototype.initialize = function() {
	J.BASE.Aliased.Game_Temp.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing temporary members in {@link Game_Temp}.<br>
*/
Game_Temp.prototype.initMembers = function() {};

//#endregion
//#region src/plugins/_base/core/objects/Game_Timer.js
/**
* Extends {@link #initialize}.<br/>
* Also initializes the duration.
*/
J.BASE.Aliased.Game_Timer.set("initialize", Game_Timer.prototype.initialize);
Game_Timer.prototype.initialize = function() {
	J.BASE.Aliased.Game_Timer.get("initialize").call(this);
	this.initMembers();
};
/**
* A hook for initializing additional members in {@link Game_Timer}.<br>
*
* Vanilla sets the timer up inside `initialize`, which a decode can never re-run, so anything added
* through it would come back missing. The timer's codec seeds the engine's own fields and then calls
* this, walking the same chain construction does.
*
* **Plugins adding state to the timer alias this, not `initialize`.**
*/
Game_Timer.prototype.initMembers = function() {
	/**
	* The duration of the timer.
	* @type {number}
	*/
	this._duration = 0;
};
/**
* Extends {@link #start}.<br/>
* Also sets the duration of the timer for tracking relative elapsed time.
*/
J.BASE.Aliased.Game_Timer.set("start", Game_Timer.prototype.start);
Game_Timer.prototype.start = function(duration) {
	J.BASE.Aliased.Game_Timer.get("start").call(this, duration);
	this.setDuration(duration);
};
/**
* Gets the elapsed amount of time relative to the duration.
* @returns {number}
*/
Game_Timer.prototype.elapsedFrames = function() {
	return this.duration() - this.frames();
};
/**
* Gets the frame count this timer was originally started with.
* @returns {number} The starting duration in frames.
*/
Game_Timer.prototype.duration = function() {
	return this._duration;
};
/**
* Sets the frame count this timer counts down from.
* @param {number} newDuration The starting duration in frames.
*/
Game_Timer.prototype.setDuration = function(newDuration) {
	this._duration = newDuration;
};

//#endregion
//#region src/plugins/_base/core/objects/Game_Vehicle.js
/**
* Vehicles are in fact vehicles.
* @return {boolean}
*/
Game_Vehicle.prototype.isVehicle = function() {
	return true;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_Dimmer.js
/**
* Full-box tint painted into {@link Window_Base#contents}. Uses normal {@link WindowLayer} ordering like any window so
* scenes can insert it above most chrome and below a chosen anchor sibling.
*/
var Window_Dimmer = class extends Window_Base {
	/**
	* Frameless box covering the menu viewport. Strength is {@link Window#contentsOpacity}, not {@link Window#opacity}.
	*
	* @param {Rectangle} rect Usually {@link Graphics.boxWidth} by {@link Graphics.boxHeight} at the origin.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.frameVisible = false;
		this.deactivate();
		this.refresh();
	}
	/**
	* Locks padding at zero so the tint reaches the inner edges.
	*/
	updatePadding() {
		this.padding = 0;
	}
	/**
	* Skips skin tone shifts so only {@link Window#contentsOpacity} drives how cold the overlay reads.
	*/
	updateTone() {}
	/**
	* Hides the plated backdrop so the painted contents alone carry the dim.
	*/
	updateBackOpacity() {
		this.backOpacity = 0;
	}
	/**
	* Solid black pixels in contents; {@link Window#contentsOpacity} scales the composite.
	*/
	refresh() {
		this.contents.clear();
		this.contents.fillRect(0, 0, this.contentsWidth(), this.contentsHeight(), "#000000");
	}
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Base.js
/**
* Default {@link Window#contentsOpacity} for {@link #showModalDimmer} / {@link #buildModalDimmerWindow} (0 = clear,
* 255 = strongest tint). Raise for heavier dim; override with {@link #showModalDimmer}'s first argument per call.
*/
Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT = 200;
/**
* Extends {@link #initialize}.<br/>
* Adds extension for initializing custom members for scenes.
*/
J.BASE.Aliased.Scene_Base.set("initialize", Scene_Base.prototype.initialize);
Scene_Base.prototype.initialize = function() {
	J.BASE.Aliased.Scene_Base.get("initialize").call(this);
	this.initMembers();
};
/**
* Initialize any additional custom members for this scene.
* This runs once per scene instance; child scenes that override should call <code>super.initMembers</code> first.
*/
Scene_Base.prototype.initMembers = function() {
	this._j ||= {};
	/**
	* Lazy-built on first {@link #getModalDimmerWindow}; {@link Scene_Boot} runs {@link #initMembers} before
	* {@link $gameSystem} exists, so constructing {@link Window_Base} during init would crash in
	* {@link Window_Base#resetFontSettings}.
	* @type {Window_Dimmer|null}
	*/
	this._j._modalDimmerWindow = null;
};
/**
* Allocates the modal dimmer window; only call once {@link $gameSystem} is ready (after boot finishes loading
* database).
*
* @returns {Window_Dimmer} Hidden until {@link #showModalDimmer} runs.
*/
Scene_Base.prototype.buildModalDimmerWindow = function() {
	const rect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
	const win = new Window_Dimmer(rect);
	win.visible = false;
	win.contentsOpacity = Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT;
	return win;
};
/**
* Gets whether this scene has ever summoned its modal dimmer.
*
* Asked instead of the getter when the answer only matters for tearing down, since the getter builds
* one on first use and would create a dimmer purely to switch it off.
* @returns {boolean}
*/
Scene_Base.prototype.hasModalDimmerWindow = function() {
	return this._j._modalDimmerWindow !== null;
};
/**
* Gets the shared modal dimmer window for this scene, creating it on first use when the engine data layer is live.
*
* @returns {Window_Dimmer} The dimmer overlay window.
*/
Scene_Base.prototype.getModalDimmerWindow = function() {
	if (this._j._modalDimmerWindow === null) {
		this._j._modalDimmerWindow = this.buildModalDimmerWindow();
	}
	return this._j._modalDimmerWindow;
};
/**
* Parents the dimmer into {@link Scene_Base#_windowLayer} immediately before the anchor so {@link WindowLayer} draws it
* above earlier windows but below that anchor sibling.
*
* @param {Window} anchorWindow The window that must remain visually above the dimmer (the modal itself).
*/
Scene_Base.prototype.ensureModalDimmerBeforeWindow = function(anchorWindow) {
	const dimmer = this.getModalDimmerWindow();
	const wl = this.windowLayer();
	if (dimmer.parent !== null) {
		dimmer.parent.removeChild(dimmer);
	}
	const insertAt = wl.getChildIndex(anchorWindow);
	wl.addChildAt(dimmer, insertAt);
};
/**
* Turns the dimmer on for scenes that already built {@link Scene_Base#_windowLayer}.
*
* @param {number} opacity Final {@link Window#contentsOpacity} after clamping (tint strength on the black fill).
* @param {Window} layerAboveWindow Window that must stay above the dimmer (confirmation, shop prompt, etc.).
*/
Scene_Base.prototype.showModalDimmer = function(opacity = Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT, layerAboveWindow) {
	this.ensureModalDimmerBeforeWindow(layerAboveWindow);
	const win = this.getModalDimmerWindow();
	win.contentsOpacity = opacity.clamp(0, 255);
	win.show();
	win.openness = 255;
	win.visible = true;
	win.refresh();
};
/**
* Hides the dimmer without destroying the window so the next modal can reuse it.
*/
Scene_Base.prototype.hideModalDimmer = function() {
	if (this.hasModalDimmerWindow() === false) return;
	this.getModalDimmerWindow().visible = false;
};
/**
* Pushes this current scene onto the stack, forcing it into action.
*/
Scene_Base.prototype.callScene = function() {
	SceneManager.push(this);
};
/**
* Whether this scene is the map scene.
* All scenes return false; {@link Scene_Map} overrides to return true.
* @returns {boolean}
*/
Scene_Base.prototype.isMapScene = function() {
	return false;
};
/**
* Identifies this scene as the map scene.
* @returns {boolean}
*/
Scene_Map.prototype.isMapScene = function() {
	return true;
};
/**
* Gets the layer every window of this scene is added to.
* @returns {WindowLayer} The windowLayer.
*/
Scene_Base.prototype.windowLayer = function() {
	return this._windowLayer;
};
/**
* Overwrites {@link #buttonAreaHeight}.<br/>
* Reserves no vertical space for the touch ui button row.
*
* Vanilla reserves this strip on every scene whether or not any buttons are drawn into it, so a
* project that does not use them pays for the gap on every window layout it ever writes.
* @returns {number}
*/
Scene_Base.prototype.buttonAreaHeight = function() {
	return 0;
};
/**
* Overwrites {@link #createButtons}.<br/>
* Skips creation of the touch ui buttons entirely.
*
* The cancel and page buttons are an accessibility affordance for touch devices, and this suite
* targets keyboard and gamepad instead- every scene here binds its own controls and draws its own
* legend, so the vanilla buttons would be a second, inconsistent way to do the same thing.
*/
Scene_Base.prototype.createButtons = function() {};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Equip.js
/**
* Gets the window listing this actor's equipment slots.
* @returns {Window_EquipSlot} The slotWindow.
*/
Scene_Equip.prototype.slotWindow = function() {
	return this._slotWindow;
};
/**
* Gets the window listing equippable items for the chosen slot.
* @returns {Window_EquipItem} The itemWindow.
*/
Scene_Equip.prototype.itemWindow = function() {
	return this._itemWindow;
};
/**
* Sets the window listing equippable items for the chosen slot.
* @param {Window_EquipItem} newItemWindow The new itemWindow.
*/
Scene_Equip.prototype.setItemWindow = function(newItemWindow) {
	this._itemWindow = newItemWindow;
};
/**
* Gets the window previewing parameter changes.
* @returns {Window_EquipStatus} The statusWindow.
*/
Scene_Equip.prototype.statusWindow = function() {
	return this._statusWindow;
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Map.js
/**
* Gets whether or not a map transfer is currently underway.
* @returns {boolean} The transfer.
*/
Scene_Map.prototype.transfer = function() {
	return this._transfer;
};
/**
* Extends {@link Scene_Map.prototype.start}.<br/>
* Reconciles the party's inventory against the database it was actually loaded next to.
*
* **Why here, of all places.** The obvious home is `DataManager.extractSaveContents`, and it is wrong: rows created
* at runtime rather than authored in the editor are written back into `$data*` from `Game_System.onAfterLoad`, which
* fires later - so a reconciliation that early would see a legitimately restored row as a missing one and delete
* the player's belongings. Aliasing `onAfterLoad` here does not help either, because this plugin loads first, which
* puts its body *before* every extension's replay in that same chain. `Scene_Load` is no good as a hook either,
* since J-Base-Save loads through a scene of its own.
*
* Every one of those paths ends up on the map, and by the time the map starts, everything that intends to populate
* a datastore has done it. So the question gets asked from the one moment where the answer is trustworthy.
*
* Running on every map entry rather than once per load is deliberate: it costs three key scans, it is idempotent,
* and it stays silent unless it actually removes something.
*/
J.BASE.Aliased.Scene_Map.set("start", Scene_Map.prototype.start);
Scene_Map.prototype.start = function() {
	J.BASE.Aliased.Scene_Map.get("start").call(this);
	$gameParty.pruneMissingInventoryEntries();
};
/**
* Overwrites {@link #createButtons}.<br/>
* Skips creation of the touch ui menu button on the map.
*
* The map's button opens the menu, which is already reachable by the bound cancel input, and the
* sprite would otherwise sit over the hud in the same corner.
*/
Scene_Map.prototype.createButtons = function() {};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Menu.js
/**
* Gets the window listing the top-level menu commands.
* @returns {Window_MenuCommand} The commandWindow.
*/
Scene_Menu.prototype.commandWindow = function() {
	return this._commandWindow;
};
/**
* Sets the window listing the top-level menu commands.
* @param {Window_MenuCommand} newCommandWindow The new commandWindow.
*/
Scene_Menu.prototype.setCommandWindow = function(newCommandWindow) {
	this._commandWindow = newCommandWindow;
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Title.js
/**
* Gets the window listing the title screen's commands.
* @returns {Window_TitleCommand} The commandWindow.
*/
Scene_Title.prototype.commandWindow = function() {
	return this._commandWindow;
};
/**
* Sets the window listing the title screen's commands.
* @param {Window_TitleCommand} newCommandWindow The new commandWindow.
*/
Scene_Title.prototype.setCommandWindow = function(newCommandWindow) {
	this._commandWindow = newCommandWindow;
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_MenuBase.js
/**
* Gets the sprite rendering this scene's blurred background.
* @returns {Sprite} The backgroundSprite.
*/
Scene_MenuBase.prototype.backgroundSprite = function() {
	return this._backgroundSprite;
};
/**
* Sets the sprite rendering this scene's blurred background.
* @param {Sprite} newBackgroundSprite The new backgroundSprite.
*/
Scene_MenuBase.prototype.setBackgroundSprite = function(newBackgroundSprite) {
	this._backgroundSprite = newBackgroundSprite;
};
/**
* Gets the blur filter applied to this scene's background.
* @returns {PIXI.filters.BlurFilter} The backgroundFilter.
*/
Scene_MenuBase.prototype.backgroundFilter = function() {
	return this._backgroundFilter;
};
/**
* Sets the blur filter applied to this scene's background.
* @param {PIXI.filters.BlurFilter} newBackgroundFilter The new backgroundFilter.
*/
Scene_MenuBase.prototype.setBackgroundFilter = function(newBackgroundFilter) {
	this._backgroundFilter = newBackgroundFilter;
};
/**
* Gets the help window describing the current selection.
* @returns {Window_Help} The helpWindow.
*/
Scene_MenuBase.prototype.helpWindow = function() {
	return this._helpWindow;
};
/**
* Overwrites {@link #createButtons}.<br/>
* Skips creation of the touch ui buttons on menu scenes.
*
* Vanilla adds its own cancel and page buttons here on top of whatever the scene already built,
* which is a second way to do what every menu in this suite already binds and documents itself.
*/
Scene_MenuBase.prototype.createButtons = function() {};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Skill.js
/**
* Gets the window describing the actor whose skills are shown.
* @returns {Window_SkillStatus} The statusWindow.
*/
Scene_Skill.prototype.statusWindow = function() {
	return this._statusWindow;
};
/**
* Gets the window listing the selectable skills.
* @returns {Window_SkillList} The itemWindow.
*/
Scene_Skill.prototype.itemWindow = function() {
	return this._itemWindow;
};
/**
* Gets the window listing the actor's skill types, which filters the skill list.
* @returns {Window_SkillType} The skillTypeWindow.
*/
Scene_Skill.prototype.skillTypeWindow = function() {
	return this._skillTypeWindow;
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Seeds vanilla engine parameters before downstream plugins extend the catalog.
*/
J.BASE.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	VanillaParameterRegistration.registerAll();
	J.BASE.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
};

//#endregion
//#region src/plugins/_base/core/windows/Window_ControlLegend.js
/**
* A single-line legend describing what the controls do in the scene currently being viewed.
*
* Every scene teaches its own controls or the player never finds them. This is the window that does
* the teaching, and it lives in J-Base precisely so that it is available to every scene rather than
* being reinvented- or, as has historically happened, simply omitted- one scene at a time.
*
* Entries are supplied as semantic handler names paired with a plain-language label. The semantic is
* resolved through {@link InputLegendResolver} when something has registered one, so the rendered
* glyph follows the player's own remapping instead of asserting a button that may no longer be true.
*/
var Window_ControlLegend = class extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes all custom members of this window.
	*/
	initMembers() {
		/**
		* The entries described by this legend.
		* @type {{semantic: string, label: string}[]}
		*/
		this._entries = [];
		/**
		* The input device this legend's glyphs were last drawn for.
		* @type {string} One of {@link InputDevice}.
		*/
		this._renderedDevice = InputDeviceTracker.currentDevice();
	}
	/**
	* Gets the input device this legend's glyphs were last drawn for.
	* @returns {string} One of {@link InputDevice}.
	*/
	renderedDevice() {
		return this._renderedDevice;
	}
	/**
	* Sets the input device this legend's glyphs were last drawn for.
	* @param {string} device One of {@link InputDevice}.
	*/
	setRenderedDevice(device) {
		this._renderedDevice = device;
	}
	/**
	* Gets the entries currently described by this legend.
	* @returns {{semantic: string, label: string}[]}
	*/
	entries() {
		return this._entries;
	}
	/**
	* Sets the entries described by this legend and redraws.
	* @param {{semantic: string, label: string}[]} entries The entries to describe.
	*/
	setEntries(entries) {
		this._entries = entries;
		this.refresh();
	}
	/**
	* Extends {@link Window_Base.update}.<br/>
	* Also redraws the legend when the player changes input device.
	*
	* Nothing pushes this change outward- the tracker has no idea who is listening- so the window asks,
	* which is the same way every other window in the engine notices the world moving underneath it. The
	* comparison is against what was last *drawn* rather than a flag, so a legend created before the
	* player ever touched anything still corrects itself.
	*/
	update() {
		super.update();
		const currentDevice = InputDeviceTracker.currentDevice();
		if (this.renderedDevice() === currentDevice) return;
		this.setRenderedDevice(currentDevice);
		this.refresh();
	}
	/**
	* Renders the legend.
	*/
	refresh() {
		this.contents.clear();
		if (this.entries().length === 0) return;
		this.drawLegend();
	}
	/**
	* Draws the assembled legend line.
	*/
	drawLegend() {
		const padX = this.legendPadding();
		this.resetFontSettings();
		this.modFontSize(this.legendFontSizeModifier());
		const text = this.buildLegendText();
		const y = Math.max(0, Math.floor((this.innerHeight - this.lineHeight()) / 2));
		this.drawTextEx(text, padX, y, this.innerWidth - padX * 2);
		this.resetFontSettings();
	}
	/**
	* Builds the full legend line from this window's entries.
	* @returns {string}
	*/
	buildLegendText() {
		return this.entries().map((entry) => this.describeEntry(entry)).join(this.legendSeparator());
	}
	/**
	* Describes a single legend entry as displayable text.
	*
	* An entry may name more than one semantic, because some controls are a pair the player thinks of
	* as one thing- moving between columns is "left or right", not two separate abilities. Listing
	* those separately would say the same sentence twice.
	* @param {{semantic: (string|string[]), label: string}} entry The entry to describe.
	* @returns {string}
	*/
	describeEntry(entry) {
		const semantics = Array.isArray(entry.semantic) ? entry.semantic : [entry.semantic];
		const inputs = semantics.map((semantic) => InputLegendResolver.resolve(semantic, semantic)).join(this.semanticSeparator());
		return `${inputs}: ${entry.label}`;
	}
	/**
	* The separator drawn between the inputs of a single entry.
	* @returns {string}
	*/
	semanticSeparator() {
		return "/";
	}
	/**
	* The horizontal padding applied to either end of the legend.
	* @returns {number}
	*/
	legendPadding() {
		return 12;
	}
	/**
	* The separator drawn between legend entries.
	* @returns {string}
	*/
	legendSeparator() {
		return "   ";
	}
	/**
	* How much smaller the legend renders than body copy.
	* @returns {number}
	*/
	legendFontSizeModifier() {
		return -4;
	}
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_MenuFacetBase.js
/**
* The shared skeleton for menu scenes.
*
* Scenes built independently drift. Measured across this ecosystem: one scene centers a container at
* two thirds of the screen, another runs full width with a hardcoded 420px column, a third invents a
* layout of its own, and one of them mixes two different vertical origins between its own rectangles.
* Nobody decided any of that- it is simply what happens when the same idea is implemented separately
* enough times.
*
* This base owns the chrome: a help window across the top, a control legend across the bottom, and a
* bounded region between them. Subclasses fill the region and nothing else. The region's contents are
* entirely free; its rectangle is not, and that single constraint is the whole anti-drift mechanism.
*
* Every dimension derives from {@link Graphics} and the current line height. There are no pixel
* literals here, and there should be none in anything built on this.
*/
var Scene_MenuFacetBase = class extends Scene_MenuBase {
	/**
	* Extends {@link #initialize}.<br/>
	* Also initializes this scene's members.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the members shared by every facet scene.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* A grouping of all properties associated with the facet skeleton.
		*/
		this._j._facet = {};
		/**
		* The legend describing this scene's controls.
		* @type {Window_ControlLegend|null}
		*/
		this._j._facet._legend = null;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates the shared chrome.
	*/
	create() {
		super.create();
		this.createControlLegendWindow();
	}
	/**
	* Creates the control legend window and adds it to tracking.
	*/
	createControlLegendWindow() {
		const rectangle = this.controlLegendWindowRect();
		const window = new Window_ControlLegend(rectangle);
		window.setEntries(this.controlLegendEntries());
		this.setControlLegendWindow(window);
		this.addWindow(window);
	}
	/**
	* Gets the currently tracked control legend window.
	* @returns {Window_ControlLegend|null}
	*/
	getControlLegendWindow() {
		return this._j._facet._legend;
	}
	/**
	* Sets the currently tracked control legend window to the given window.
	* @param {Window_ControlLegend} window The window to track.
	*/
	setControlLegendWindow(window) {
		this._j._facet._legend = window;
	}
	/**
	* Overwrites {@link #isBottomHelpMode}.<br/>
	* The help window belongs at the top of a facet scene, never the bottom.
	*
	* The engine defaults this to true, which places the help window across the bottom of the screen-
	* directly where the control legend lives. Left alone, every facet scene renders an empty help
	* window on top of its own legend.
	* @returns {boolean}
	*/
	isBottomHelpMode() {
		return false;
	}
	/**
	* Overwrites {@link #isBottomButtonMode}.<br/>
	* Facet scenes teach their controls through the legend rather than on-screen buttons.
	* @returns {boolean}
	*/
	isBottomButtonMode() {
		return true;
	}
	/**
	* The height of the help window across the top.
	* @returns {number}
	*/
	helpAreaHeight() {
		if (this.hasHelpWindow() === false) return 0;
		return this.calcWindowHeight(this.helpWindowLineCount(), false);
	}
	/**
	* Whether this scene renders a help window across the top.
	*
	* Most facet scenes should: a line or two describing whatever is highlighted is the cheapest
	* discoverability there is. But some carry a detail panel rich enough that a help strip would either
	* duplicate it or sit empty, and reserving space for a window that never arrives is worse than not
	* reserving it. Those override this to `false`, and receive a taller region in exchange.
	*
	* Note that the base does not create the help window either way- scenes call `createHelpWindow()`
	* themselves, because they alone know what to feed it. This only governs whether the room is made.
	* @returns {boolean}
	*/
	hasHelpWindow() {
		return true;
	}
	/**
	* How many lines of description the help window across the top can render.
	* @returns {number}
	*/
	helpWindowLineCount() {
		return 2;
	}
	/**
	* The height of the control legend across the bottom.
	* @returns {number}
	*/
	controlLegendHeight() {
		return this.calcWindowHeight(1, false);
	}
	/**
	* Builds the rectangle for the control legend, pinned across the bottom of the screen.
	* @returns {Rectangle}
	*/
	controlLegendWindowRect() {
		const width = Graphics.boxWidth;
		const height = this.controlLegendHeight();
		const y = Graphics.boxHeight - height;
		return new Rectangle(0, y, width, height);
	}
	/**
	* Builds the rectangle for the bounded region subclasses fill.
	*
	* This is deliberately the *remainder* of the screen rather than a computed size, so that rounding
	* in the chrome above and below can never leave an unclaimed strip of pixels.
	* @returns {Rectangle}
	*/
	facetAreaRect() {
		const y = this.mainAreaTop();
		const height = Graphics.boxHeight - y - this.controlLegendHeight();
		return new Rectangle(0, y, Graphics.boxWidth, height);
	}
	/**
	* The proportion of the screen width given to a single column of commands.
	*
	* Expressed as a ratio rather than a pixel count so the layout holds at any resolution. Subclasses
	* needing a wider or narrower command column override this rather than computing their own widths.
	* @returns {number}
	*/
	commandColumnRatio() {
		return .22;
	}
	/**
	* The width of a single command column.
	* @returns {number}
	*/
	commandColumnWidth() {
		return Math.floor(Graphics.boxWidth * this.commandColumnRatio());
	}
	/**
	* The entries this scene's control legend describes.
	*
	* Subclasses override this to teach their own controls. Returning an empty collection renders no
	* legend at all, which is the correct behavior for a scene that genuinely has nothing to explain.
	* @returns {{semantic: string, label: string}[]}
	*/
	controlLegendEntries() {
		return [];
	}
};

//#endregion
//#region src/plugins/_base/core/windows/Window_ActorRibbon.js
/**
* A window for rendering a ribbon of an actor's face.
* If the window is made longer or taller, additional info could be rendered around it.
*/
var Window_ActorRibbon = class extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes all custom members of this window.
	*/
	initMembers() {
		/**
		* The actor in this window.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The width of the actor face in the ribbon.
		* @type {number}
		*/
		this._faceWidth = 128;
		/**
		* The height of the actor face in the ribbon.
		* @type {number}
		*/
		this._faceHeight = 40;
		/**
		* The x of the actor's face in the ribbon.
		* @type {number}
		*/
		this._faceX = 0;
		/**
		* The y of the actor's face in the ribbon.
		* @type {number}
		*/
		this._faceY = 0;
	}
	/**
	* Gets the actor focus for the window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor focus for the window and optionally refreshes.
	* @param {Game_Actor} actor The actor to display.
	* @param {boolean} [andRefresh=true] Whether or not to refresh the window; defaults to true.
	*/
	setActor(actor, andRefresh = true) {
		this._actor = actor;
		if (andRefresh) {
			this.refresh();
		}
	}
	/**
	* The width of the actor face in the ribbon.
	* @returns {number}
	*/
	faceWidth() {
		return this._faceWidth;
	}
	/**
	* The width of the actor face in the ribbon.
	* @returns {number}
	*/
	setFaceWidth(width) {
		this._faceWidth = width;
	}
	/**
	* The height of the actor face in the ribbon.
	* @returns {number}
	*/
	faceHeight() {
		return this._faceHeight;
	}
	/**
	* The height of the actor face in the ribbon.
	* @returns {number}
	*/
	setFaceHeight(height) {
		this._faceHeight = height;
	}
	/**
	* Gets the size of the actor face in the ribbon.
	* @returns {[number, number]}
	*/
	faceSize() {
		return [this.faceWidth(), this.faceHeight()];
	}
	/**
	* Gets the x coordinate of the actor face in the ribbon.
	* @returns {number}
	*/
	faceX() {
		return this._faceX;
	}
	/**
	* Sets the x coordinate of the actor face in the ribbon.
	* @param {number} x The x coordinate.
	*/
	setFaceX(x) {
		this._faceX = x;
	}
	/**
	* Gets the y coordinate of the actor face in the ribbon.
	* @returns {number}
	*/
	faceY() {
		return this._faceY;
	}
	/**
	* Sets the y coordinate of the actor face in the ribbon.
	* @param {number} y The y coordinate.
	*/
	setFaceY(y) {
		this._faceY = y;
	}
	/**
	* Gets the coordinates of the actor face in the ribbon.
	* @returns {[number, number]}
	*/
	faceCoordinates() {
		return [this.faceX(), this.faceY()];
	}
	/**
	* Implements {@link #drawContent}.<br/>
	* Draws the actor face in the ribbon.
	*/
	drawContent() {
		if (!this.actor()) return;
		this.drawActorRibbon();
	}
	/**
	* Draws the actor face in the ribbon.
	*/
	drawActorRibbon() {
		const actor = this.actor();
		const [x, y] = this.faceCoordinates();
		const [w, h] = this.faceSize();
		this.drawFace(actor.faceName(), actor.faceIndex(), x, y, w, h);
	}
};

//#endregion
//#region src/plugins/_base/core/scenes/Scene_ActorFacetBase.js
/**
* The shared skeleton for menu scenes scoped to a single actor.
*
* Extends the facet skeleton with the one thing those scenes all need and all currently solve
* separately: showing which actor is being looked at, and letting the player change them. Four scenes
* already extend {@link Window_ActorRibbon} for the first half and one grew a bespoke header instead;
* this consolidates that so a fifth cannot diverge again.
*
* These scenes are always single-actor. An earlier design showed both party members at once, on the
* reasoning that the party is permanently a fixed pair- but every one of these scenes carries a
* picker or a detail panel occupying exactly the space a second actor would need. Rendering more than
* one actor is therefore a decision for an individual window that can afford it, not a posture of the
* base, and {@link JABS_Button}-style loadout boards do it themselves.
*
* Consequently `actor-prev` and `actor-next` mean the same thing in every scene built on this, with
* no exceptions to remember.
*/
var Scene_ActorFacetBase = class extends Scene_MenuFacetBase {
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the actor-scoped members.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The ribbon identifying the actor currently being viewed.
		* @type {Window_ActorRibbon|null}
		*/
		this._j._facet._ribbon = null;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates the actor ribbon.
	*/
	create() {
		super.create();
		this.createActorRibbonWindow();
	}
	/**
	* Creates the actor ribbon window and adds it to tracking.
	*/
	createActorRibbonWindow() {
		const rectangle = this.actorRibbonWindowRect();
		const window = this.buildActorRibbonWindow(rectangle);
		window.setActor(this.actor());
		this.setActorRibbonWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the actor ribbon window.
	*
	* Subclasses wanting to render additional information alongside the face- points, slot counts, and
	* the like- override this to return their own subclass of {@link Window_ActorRibbon} rather than
	* building an unrelated window and positioning it themselves.
	* @param {Rectangle} rectangle The rectangle to build the window within.
	* @returns {Window_ActorRibbon}
	*/
	buildActorRibbonWindow(rectangle) {
		return new Window_ActorRibbon(rectangle);
	}
	/**
	* Gets the currently tracked actor ribbon window.
	* @returns {Window_ActorRibbon|null}
	*/
	getActorRibbonWindow() {
		return this._j._facet._ribbon;
	}
	/**
	* Sets the currently tracked actor ribbon window to the given window.
	* @param {Window_ActorRibbon} window The window to track.
	*/
	setActorRibbonWindow(window) {
		this._j._facet._ribbon = window;
	}
	/**
	* The height of the actor ribbon.
	* @returns {number}
	*/
	actorRibbonHeight() {
		return this.calcWindowHeight(this.actorRibbonLineCount(), false);
	}
	/**
	* How many lines tall the actor ribbon is.
	*
	* One, because it is a ribbon: a band naming who is being looked at, not a panel about them. The face
	* it draws is cropped to 40px by default precisely so it fits in a single row.
	* @returns {number}
	*/
	actorRibbonLineCount() {
		return 1;
	}
	/**
	* Builds the rectangle for the actor ribbon, sat at the top of the bounded region.
	* @returns {Rectangle}
	*/
	actorRibbonWindowRect() {
		const facetArea = this.facetAreaRect();
		return new Rectangle(facetArea.x, facetArea.y, facetArea.width, this.actorRibbonHeight());
	}
	/**
	* Extends {@link #facetAreaRect}.<br/>
	* Narrows the region available to subclasses to exclude the actor ribbon.
	*
	* Subclasses therefore never need to account for the ribbon's height themselves- they receive a
	* region that already excludes it, the same way they already receive one excluding help and legend.
	* @returns {Rectangle}
	*/
	contentAreaRect() {
		const facetArea = this.facetAreaRect();
		const ribbonHeight = this.actorRibbonHeight();
		return new Rectangle(facetArea.x, facetArea.y + ribbonHeight, facetArea.width, facetArea.height - ribbonHeight);
	}
	/**
	* Extends {@link #onActorChange}.<br/>
	* Also refreshes the ribbon so it names whoever is now being viewed.
	*/
	onActorChange() {
		super.onActorChange();
		this.getActorRibbonWindow().setActor(this.actor());
	}
	/**
	* Cycles to the previous actor.
	*/
	onCycleActorLeft() {
		this.previousActor();
	}
	/**
	* Cycles to the next actor.
	*/
	onCycleActorRight() {
		this.nextActor();
	}
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite.js
/**
* Whether this sprite manages its own opacity independently of the HUD system.
* {@link Sprite_Icon} and {@link Sprite_BaseText} override this when flagged with
* {@code _disableManagedOpacity}; all other sprites defer to external management.
* @returns {boolean}
*/
Sprite.prototype.hasSelfManagedOpacity = function() {
	return false;
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_BaseText.js
/**
* A sprite that displays some text.
* This acts as a base class for a number of other text-based sprites.
*/
var Sprite_BaseText = class Sprite_BaseText extends Sprite {
	/**
	* The available supported text alignments.
	*/
	static Alignments = {
		Left: "left",
		Center: "center",
		Right: "right"
	};
	/**
	* Extend initialization of the sprite to draw the text.
	* @param {string} text The text content for this sprite.
	*/
	initialize(text = String.empty) {
		super.initialize();
		this.initMembers();
		this.setText(text);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* A test bitmap for measuring text width upon.
		* @type {Bitmap}
		*/
		this._j._testBitmap = new Bitmap(512, 128);
		/**
		* The text to render in this sprite.
		* @type {string}
		*/
		this._j._text = String.empty;
		/**
		* The text color index of this sprite.
		* This should be a hexcode.
		* @type {string}
		*/
		this._j._color = "#ffffff";
		/**
		* The alignment of text in this sprite.
		* @type {Sprite_BaseText.Alignments}
		*/
		this._j._alignment = Sprite_BaseText.Alignments.Left;
		/**
		* Whether or not the text should be italics.
		* @type {boolean}
		*/
		this._j._italics = false;
		/**
		* Whether or not the text should be bolded.
		* @type {boolean}
		*/
		this._j._bold = false;
		/**
		* The font face of the text in this sprite.
		* @type {string}
		*/
		this._j._fontFace = $gameSystem.mainFontFace();
		/**
		* The font size of the text in this sprite.
		* @type {number}
		*/
		this._j._fontSize = $gameSystem.mainFontSize();
		/**
		* The minimum width of the text.
		* @type {number}
		*/
		this._j._minWidth = 0;
		/**
		* Some systems that leverage {@link Sprite_BaseText} may have automation to manage the opacity of their text.
		* Setting this flag to true will disable that automation and allow you to manage the opacity yourself.
		* @type {boolean}
		*/
		this._j._disableManagedOpacity = false;
	}
	/**
	* Gets the j.
	* @returns {{_testBitmap: Bitmap, _text: string, _color: string, _alignment: string,
	* _italics: boolean, _bold: boolean, _fontFace: string, _fontSize: number, _minWidth: number,
	* _disableManagedOpacity: boolean}} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Sets up the bitmap based on the desired text content.
	*/
	loadBitmap() {
		if (this.bitmap) {
			this.bitmap.clear();
		}
		this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
		this.configureBitmap();
	}
	/**
	* Configures the bitmap with the current settings and configuration.
	*/
	configureBitmap() {
		this.bitmap.clear();
		this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
		this.bitmap.fontFace = this.fontFace();
		this.bitmap.fontSize = this.fontSize();
		this.bitmap.fontBold = this.isBold();
		this.bitmap.fontItalic = this.isItalics();
		this.bitmap.textColor = this.color();
		this.bitmap.outlineColor = "#000000";
		this.bitmap.outlineWidth = Math.max(2, Math.floor(this.fontSize() / 6));
	}
	/**
	* Refresh the content of this sprite.
	* This completely reloads the sprite's bitmap and redraws the text.
	*/
	refresh() {
		if (!this.bitmap) {
			this.loadBitmap();
		} else {
			this.configureBitmap();
		}
		this.renderText();
	}
	/**
	* The width of this bitmap.
	* Uses the bitmap measuring of text based on the current configuration.
	* @returns {number}
	*/
	bitmapWidth() {
		this.j()._testBitmap = new Bitmap(this.bitmap ? this.bitmap.width : 128, this.bitmapHeight());
		this.j()._testBitmap.fontFace = this.fontFace();
		this.j()._testBitmap.fontSize = this.fontSize();
		this.j()._testBitmap.fontItalic = this.isItalics();
		this.j()._testBitmap.fontBold = this.isBold();
		const measured = this.j()._testBitmap.measureTextWidth(this.text());
		const min = this.j()._minWidth;
		return Math.max(measured, min);
	}
	/**
	* The height of this bitmap.
	* This defaults to roughly 3 pixels per size of font.
	* @returns {number}
	*/
	bitmapHeight() {
		return this.j()._fontSize * 3;
	}
	/**
	* The text currently assigned to this sprite.
	* @returns {string|String.empty}
	*/
	text() {
		return this.j()._text;
	}
	/**
	* Assigns text to this sprite.
	* If the text has changed, it reloads the bitmap.
	* @param {string} text The text to assign to this sprite.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setText(text) {
		if (this.text() !== text) {
			this.j()._text = text;
			this.refresh();
		}
		return this;
	}
	/**
	* Gets the current color assigned to this sprite's text.
	* @returns {string}
	*/
	color() {
		return this.j()._color;
	}
	/**
	* Sets the color of this sprite's text.
	* This should be a hexcode.
	* @param {string} color The hex color for this text.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setColor(color) {
		if (!this.isValidColor(color)) return;
		if (this.color() !== color) {
			this.j()._color = color;
			this.refresh();
		}
		return this;
	}
	/**
	* Validates the color to ensure it is a hex color.
	* @param {string} color The color to validate.
	* @returns {boolean} True if the hex color is valid, false otherwise.
	*/
	isValidColor(color) {
		const structure = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		const isHexColor = structure.test(color);
		if (!isHexColor) {
			Diagnostics.error("J-Base", `attempted to assign ${color} as a hex color to this text sprite.`, this);
		}
		return isHexColor;
	}
	/**
	* Gets the text alignment for this text sprite.
	* @returns {Sprite_BaseText.Alignments}
	*/
	alignment() {
		return this.j()._alignment;
	}
	/**
	* Sets the alignment of this sprite's text.
	* The alignment set must be one of the three valid options.
	* @param {Sprite_BaseText.Alignments} alignment The alignment to set.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setAlignment(alignment) {
		if (!this.isValidAlignment(alignment)) return;
		if (this.alignment() !== alignment) {
			this.j()._alignment = alignment;
			this.refresh();
		}
		return this;
	}
	/**
	* Validates the alignment to ensure it is a valid alignment.
	* @param {string} alignment The alignment to validate.
	* @returns {boolean} True if the alignment is valid, false otherwise.
	*/
	isValidAlignment(alignment) {
		const validAlignments = [
			Sprite_BaseText.Alignments.Left,
			Sprite_BaseText.Alignments.Center,
			Sprite_BaseText.Alignments.Right
		];
		return validAlignments.includes(alignment);
	}
	/**
	* Gets whether or not this sprite's text is bold.
	* @returns {boolean}
	*/
	isBold() {
		return this.j()._bold;
	}
	/**
	* Sets the bold for this sprite's text.
	* @param {boolean} bold True if we're using bold, false otherwise.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setBold(bold) {
		if (this.isBold() !== bold) {
			this.j()._bold = bold;
			this.refresh();
		}
		return this;
	}
	/**
	* Gets whether or not this sprite's text is italics.
	* @returns {boolean}
	*/
	isItalics() {
		return this.j()._italics;
	}
	/**
	* Sets the italics for this sprite's text.
	* @param {boolean} italics True if we're using italics, false otherwise.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setItalics(italics) {
		if (this.isItalics() !== italics) {
			this.j()._italics = italics;
			this.refresh();
		}
		return this;
	}
	/**
	* Gets the current font face name.
	* @returns {string}
	*/
	fontFace() {
		return this.j()._fontFace;
	}
	/**
	* Sets the font face to the designated font.
	* This will not work if you set it to a font that you don't have
	* in the `/font` folder.
	* @param {string} fontFace The precise name of the font to change the text to.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setFontFace(fontFace) {
		if (this.fontFace() !== fontFace) {
			this.j()._fontFace = fontFace;
			this.refresh();
		}
		return this;
	}
	/**
	* Gets the current font size.
	* @returns {number}
	*/
	fontSize() {
		return this.j()._fontSize;
	}
	/**
	* Sets the font size to the designated number.
	* @param {number} fontSize The size of the font.
	* @returns {this} Returns `this` for fluent-chaining.
	*/
	setFontSize(fontSize) {
		if (this.fontSize() !== fontSize) {
			this.j()._fontSize = fontSize;
			this.refresh();
		}
		return this;
	}
	/**
	* Gets the minimum width for the text box.
	* @returns {number}
	*/
	minWidth() {
		return this.j()._minWidth;
	}
	/**
	* Sets a minimum width for the text box. Useful to make center/right alignment visible.
	* @param {number} width The minimum pixel width of this sprite’s bitmap.
	* @returns {this}
	*/
	setMinWidth(width) {
		const w = Math.max(0, width);
		if (this.j()._minWidth !== w) {
			this.j()._minWidth = w;
			this.refresh();
		}
		return this;
	}
	/**
	* Flags this sprite to disable the managed opacity automation.
	*/
	selfManageOpacity() {
		this.j()._disableManagedOpacity = true;
	}
	/**
	* Unflags this sprite to enable the managed opacity automation.
	*/
	autoManageOpacity() {
		this.j()._disableManagedOpacity = false;
	}
	/**
	* Checks whether or not this sprite is flagged for self-managed opacity.
	* @returns {boolean}
	*/
	hasSelfManagedOpacity() {
		return this.j()._disableManagedOpacity;
	}
	/**
	* Renders the text of this sprite.
	*/
	renderText() {
		const drawWidth = this.bitmap ? this.bitmap.width : this.bitmapWidth();
		this.bitmap.drawText(this.text(), 0, 0, drawWidth, this.bitmapHeight(), this.alignment());
	}
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Character.js
/**
* Gets the underlying `Game_Character` or its appropriate subclass that this
* sprite represents on the map.
* @returns {Game_Character|Game_Player|Game_Event|Game_Vehicle|Game_Follower}
*/
Sprite_Character.prototype.character = function() {
	return this._character;
};
/**
* Gets whether or not the underlying {@link Game_Character} is erased.
* If there is no underlying character, then it is still considered erased.
* @returns {boolean}
*/
Sprite_Character.prototype.isErased = function() {
	const character = this.character();
	if (!character) {
		Diagnostics.warn("J-Base", "attempted to check erasure status on a non-existing character.", this);
		return true;
	}
	return character.isErased();
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Face.js
/**
* A sprite that displays a single face.
*/
var Sprite_Face = class extends Sprite {
	/**
	* Constructor.
	* @param {string} faceName The name of the face file.
	* @param {number} faceIndex The index of the face.
	*/
	constructor(faceName, faceIndex) {
		super();
		this.initialize(faceName, faceIndex);
	}
	/**
	* Runs after {@link Sprite.prototype.initialize}.
	* @param {string} faceName The name of the face file.
	* @param {number} faceIndex The index of the face.
	*/
	initialize(faceName, faceIndex) {
		super.initialize();
		this.initMembers(faceName, faceIndex);
		this.loadBitmap();
	}
	/**
	* Initializes the properties associated with this sprite.
	* @param {string} faceName The name of the face file.
	* @param {number} faceIndex The index of the face.
	*/
	initMembers(faceName, faceIndex) {
		this._j = {
			_faceName: faceName,
			_faceIndex: faceIndex
		};
	}
	/**
	* Gets the j.
	* @returns {{_faceName: string, _faceIndex: number}} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Loads the bitmap into the sprite.
	*/
	loadBitmap() {
		this.bitmap = ImageManager.loadFace(this.j()._faceName);
		const pw = ImageManager.faceWidth;
		const ph = ImageManager.faceHeight;
		const width = pw;
		const height = ph;
		const sw = Math.min(width, pw);
		const sh = Math.min(height, ph);
		const sx = Math.floor(this.j()._faceIndex % 4 * pw + (pw - sw) / 2);
		const sy = Math.floor(Math.floor(this.j()._faceIndex / 4) * ph + (ph - sh) / 2);
		this.setFrame(sx, sy, pw, ph);
	}
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Icon.js
/**
* A customizable sprite that displays a single icon.
*
* Defaults to regular `ImageManager`'s defaults in size and columns,
* but can be modified manually to different iconsets bitmaps and/or
* different icon widths and heights.
*/
var Sprite_Icon = class extends Sprite {
	/**
	* Initializes this sprite with the designated icon.
	* @param {number} iconIndex The icon index of the icon for this sprite.
	*/
	initialize(iconIndex = 0) {
		super.initialize();
		this.initMembers();
		this.setupDefaultIconsetBitmap(iconIndex);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* Whether or not the sprite is ready to be drawn yet.
		* @type {boolean}
		*/
		this._j._isReady = false;
		/**
		* The icon index that this sprite represents.
		* @type {number}
		*/
		this._j._iconIndex = 0;
		/**
		* The width of our icon. Defaults to the image manager's width,
		* but it can be set higher or lower for different-sized iconsheets.
		* @type {number}
		*/
		this._j._iconWidth = ImageManager.iconWidth;
		/**
		* The height of our icon. Defaults to the image manager's height,
		* but it can be set higher or lower for different-sized iconsheets.
		* @type {number}
		*/
		this._j._iconHeight = ImageManager.iconHeight;
		/**
		* The number of columns on the iconset we're using. Defaults to 16,
		* which was also predefined by this plugin, but is just the number
		* of columns the default iconset.png file has.
		* @type {number}
		*/
		this._j._iconColumns = ImageManager.iconColumns;
		/**
		* Some systems that leverage {@link Sprite_Icon} may have automation to manage the opacity of their icons.
		* Setting this flag to true will disable that automation and allow you to manage the opacity yourself.
		* @type {boolean}
		*/
		this._j._disableManagedOpacity = false;
	}
	/**
	* Sets up the bitmap with the default iconset.
	* @param {number} iconIndex The icon index of the icon for this sprite.
	*/
	setupDefaultIconsetBitmap(iconIndex) {
		this.unReady();
		const bitmapPromise = ImageManager.loadBitmapPromise(`IconSet`, `img/system/`).then((bitmap) => this.setIconsetBitmap(bitmap)).catch(() => {
			throw new Error("default iconset bitmap failed to load.");
		});
		Promise.all([bitmapPromise]).then(() => this.onReady(iconIndex));
	}
	/**
	* Sets the ready flag to false to prevent rendering further
	*/
	unReady() {
		this._j._isReady = false;
	}
	/**
	* Gets whether or not this icon sprite is ready for rendering.
	* @returns {boolean}
	*/
	isReady() {
		return this._j._isReady;
	}
	/**
	* Sets the bitmap to the designated bitmap.
	* @param {Bitmap} bitmap The base bitmap of this sprite.
	*/
	setIconsetBitmap(bitmap) {
		this.bitmap = bitmap;
	}
	/**
	* Gets the icon index from the iconset for this sprite.
	* @returns {number}
	*/
	iconIndex() {
		return this._j._iconIndex;
	}
	/**
	* Sets the icon index for this sprite.
	* @param {number} iconIndex The icon index this sprite should render.
	*/
	setIconIndex(iconIndex) {
		this._j._iconIndex = iconIndex;
		if (!this.isReady()) return;
		this.drawIcon();
	}
	/**
	* Gets the width of this icon for this sprite.
	* @returns {number}
	*/
	iconWidth() {
		return this._j._iconWidth;
	}
	/**
	* Sets the width of this sprite's icon.
	* @param width
	*/
	setIconWidth(width) {
		this._j._iconWidth = width;
	}
	/**
	* Gets the height of this icon for this sprite.
	* @returns {number}
	*/
	iconHeight() {
		return this._j._iconHeight;
	}
	/**
	* Sets the height of this sprite's icon.
	* @param height
	*/
	setIconHeight(height) {
		this._j._iconHeight = height;
	}
	/**
	* Gets the number of columns for this sprite's iconset.
	* @returns {number}
	*/
	iconColumns() {
		return this._j._iconColumns;
	}
	/**
	* Sets the number of columns for the sprite's iconset.
	* @param {number} columns The new number of columns in this sprite's iconset.
	*/
	setIconColumns(columns) {
		this._j._iconColumns = columns;
	}
	/**
	* Flags this sprite to disable the managed opacity automation.
	*/
	selfManageOpacity() {
		this._j._disableManagedOpacity = true;
	}
	/**
	* Unflags this sprite to enable the managed opacity automation.
	*/
	autoManageOpacity() {
		this._j._disableManagedOpacity = false;
	}
	/**
	* Checks whether or not this sprite is flagged for self-managed opacity.
	* @returns {boolean}
	*/
	hasSelfManagedOpacity() {
		return this._j._disableManagedOpacity;
	}
	/**
	* Upon becoming ready, execute this logic.
	* In this sprite's case, we render ourselves.
	* @param {number} iconIndex The icon index of this sprite.
	*/
	onReady(iconIndex = 0) {
		this._j._isReady = true;
		this.setIconIndex(iconIndex);
	}
	/**
	* Sets the frame of the bitmap to be the icon we care about.
	*/
	drawIcon() {
		const iconWidth = this.iconWidth();
		const iconHeight = this.iconHeight();
		const iconsetColumns = this.iconColumns();
		const iconIndex = this.iconIndex();
		const x = iconIndex % iconsetColumns * iconWidth;
		const y = Math.floor(iconIndex / iconsetColumns) * iconHeight;
		this.setFrame(x, y, iconWidth, iconHeight);
	}
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_MapGauge.js
/**
* The sprite for displaying a gauge on a character's sprite.
*/
var Sprite_MapGauge = class extends Sprite_Gauge {
	/**
	* Gets the gauge.
	* @returns {{_bitmapWidth: number, _bitmapHeight: number, _gaugeHeight: number, _label: string,
	* _value: number|null, _iconIndex: number, _iconSprite: Sprite|null, _activated: boolean}} The gauge.
	*/
	gauge() {
		return this._gauge;
	}
	/**
	* Constructor.
	* @param {number} bitmapWidth - The width of the gauge bitmap.
	* @param {number} bitmapHeight - The height of the gauge bitmap.
	* @param {number} gaugeHeight - The height of the gauge itself.
	* @param {string} label - The label on the gauge.
	* @param {number|null} value - The value of the gauge.
	* @param {number} iconIndex - The index of the icon to display.
	*/
	constructor(bitmapWidth = 96, bitmapHeight = 24, gaugeHeight = 6, label = String.empty, value = null, iconIndex = -1) {
		super(bitmapWidth, bitmapHeight, gaugeHeight, label, value, iconIndex);
	}
	/**
	* Extends {@link #initialize}.<br/>
	* Intercepts and initializes our custom gauge information first.
	* @param {number} bitmapWidth - The width of the gauge bitmap.
	* @param {number} bitmapHeight - The height of the gauge bitmap.
	* @param {number} gaugeHeight - The height of the gauge itself.
	* @param {string} label - The label on the gauge.
	* @param {number|null} value - The value of the gauge.
	* @param {number} iconIndex - The index of the icon to display.
	*/
	initialize(bitmapWidth, bitmapHeight, gaugeHeight, label, value, iconIndex) {
		this.initGaugeMembers(bitmapWidth, bitmapHeight, gaugeHeight, label, value, iconIndex);
		super.initialize();
	}
	/**
	* Initializes the gauge.
	* @param {number} bitmapWidth - The width of the gauge bitmap.
	* @param {number} bitmapHeight - The height of the gauge bitmap.
	* @param {number} gaugeHeight - The height of the gauge itself.
	* @param {string} label - The label on the gauge.
	* @param {number|null} value - The value of the gauge.
	* @param {number} iconIndex - The icon index of the gauge.
	*/
	initGaugeMembers(bitmapWidth, bitmapHeight, gaugeHeight, label, value, iconIndex) {
		/**
		* The gauge data points.
		*/
		this._gauge = {};
		/**
		* The width of the gauge bitmap.
		* @type {number}
		*/
		this._gauge._bitmapWidth = bitmapWidth;
		/**
		* The height of the gauge bitmap.
		* @type {number}
		*/
		this._gauge._bitmapHeight = bitmapHeight;
		/**
		* The height of the gauge itself.
		* @type {number}
		*/
		this._gauge._gaugeHeight = gaugeHeight;
		/**
		* The label on the gauge.
		* @type {string}
		*/
		this._gauge._label = label;
		/**
		* The value of the gauge.
		* @type {number|null}
		*/
		this._gauge._value = value;
		/**
		* The icon index of the gauge.
		* @type {number}
		*/
		this._gauge._iconIndex = iconIndex;
		/**
		* The sprite representing the icon on the gauge.
		* @type {Sprite_Icon|null}
		*/
		this._gauge._iconSprite = null;
		/**
		* Whether or not the gauge is activated.
		* @type {boolean}
		*/
		this._gauge._activated = true;
	}
	/**
	* Gets the battler associated with this gauge.
	* @returns {Game_Actor|Game_Enemy|null}
	*/
	getBattler() {
		return this.battler();
	}
	/**
	* Gets the status type associated with this gauge.
	* @returns {string|null}
	*/
	getStatusType() {
		return this.statusType();
	}
	/**
	* Sets the status type associated with this gauge.
	* @param {string} statusType The status type to associate with this gauge.
	*/
	setStatusType(statusType) {
		this._statusType = statusType;
	}
	/**
	* Overwrites {@link #bitmapWidth}.<br/>
	* Gets the width of our custom bitmap.
	* @returns {number}
	*/
	bitmapWidth() {
		return this.gauge()._bitmapWidth;
	}
	/**
	* Overwrites {@link #bitmapHeight}.<br/>
	* Gets the height of our custom bitmap.
	* @returns {number}
	*/
	bitmapHeight() {
		return this.gauge()._bitmapHeight;
	}
	/**
	* Overwrites {@link #gaugeHeight}.<br/>
	* Gets the height of our custom gauge.
	* @returns {number}
	*/
	gaugeHeight() {
		return this.gauge()._gaugeHeight;
	}
	/**
	* Overwrites {@link #label}.<br/>
	* Gets our custom label for the gauge.
	* @returns {string}
	*/
	label() {
		return this.gauge()._label;
	}
	/**
	* Gets the icon index of the gauge.
	* @returns {number}
	*/
	iconIndex() {
		return this.gauge()._iconIndex;
	}
	/**
	* Sets the icon index of the gauge.
	* @param {number} iconIndex The index of the icon to set.
	*/
	setIcon(iconIndex) {
		this.gauge()._iconIndex = iconIndex;
		if (this.gauge()._iconSprite) {
			if (this.gauge()._iconIndex < 0) {
				this.gauge()._iconSprite.visible = false;
			} else {
				this.gauge()._iconSprite.setIconIndex(this.gauge()._iconIndex);
				this.gauge()._iconSprite.visible = true;
				const iconHeight = 16;
				const centeredY = Math.floor((this.bitmapHeight() - iconHeight) / 2);
				this.gauge()._iconSprite.move(10, centeredY);
			}
			this.redraw();
			return;
		}
		if (this.gauge()._iconIndex >= 0) {
			const sprite = this.createIconSprite();
			this.addChild(sprite);
			this.gauge()._iconSprite = sprite;
		}
		this.redraw();
	}
	/**
	* Sets the label of the gauge.
	* @param {string} label The label to set.
	*/
	setLabel(label) {
		this.gauge()._label = label;
		this.redraw();
	}
	/**
	* Activates the gauge.
	*/
	activateGauge() {
		this.gauge()._activated = true;
	}
	/**
	* Extends {@link Sprite#hide}.<br/>
	* Also deactivates the gauge so it does not tick or render while hidden.
	*/
	hide() {
		super.hide();
		this.deactivateGauge();
	}
	/**
	* Deactivates the gauge.
	*/
	deactivateGauge() {
		this.gauge()._activated = false;
	}
	/**
	* Gets whether or not the gauge is currently active.
	* @returns {boolean}
	*/
	isGaugeActive() {
		return this.gauge()._activated;
	}
	/**
	* Overwrites {@link #currentValue}.<br/>
	* Returns the current value of the gauge based on custom values.
	* @returns {number|NaN}
	*/
	currentValue() {
		if (!this.getBattler()) return NaN;
		switch (this.getStatusType()) {
			case "hp": return this.battler().hp;
			case "mp": return this.battler().mp;
			case "tp": return this.battler().tp;
			case "time": return this.battler().currentExp() - this.battler().currentLevelExp();
			default: return NaN;
		}
	}
	/**
	* Overwrites {@link #currentMaxValue}.<br/>
	* Returns the maximum value of the gauge based on custom values.
	* @returns {number|NaN}
	*/
	currentMaxValue() {
		if (!this.getBattler()) return NaN;
		switch (this.statusType()) {
			case "hp": return this.battler().mhp;
			case "mp": return this.battler().mmp;
			case "tp": return this.battler().maxTp();
			case "time": return this.battler().nextLevelExp() - this.battler().currentLevelExp();
			default: return NaN;
		}
	}
	/**
	* Creates the sprite for the icon on this gauge.
	* @returns {Sprite_Icon}
	*/
	createIconSprite() {
		const sprite = new Sprite_Icon(this.gauge()._iconIndex);
		sprite.scale.x = .5;
		sprite.scale.y = .5;
		const iconHeight = 16;
		const centeredY = Math.floor((this.bitmapHeight() - iconHeight) / 2);
		sprite.move(10, centeredY);
		return sprite;
	}
	update() {
		if (this.isGaugeActive() === false) return;
		super.update();
	}
	drawIcon() {
		if (this.iconIndex() >= 0) {
			if (!this.gauge()._iconSprite) {
				const sprite = this.createIconSprite();
				this.addChild(sprite);
				this.gauge()._iconSprite = sprite;
			}
			this.gauge()._iconSprite.visible = true;
		} else if (this.gauge()._iconSprite) {
			this.gauge()._iconSprite.visible = false;
		}
	}
	/**
	* Overwrites {@link #drawLabel}.<br/>
	* Draws our custom label on the gauge.
	*/
	drawLabel() {
		if (!this.label()) return;
		const x = 32;
		const y = 0;
		this.bitmap.fontSize = 12;
		this.bitmap.drawText(this.gauge()._label, x, y, this.bitmapWidth(), this.bitmapHeight(), "left");
	}
	/**
	* Overwrites {@link #drawValue}.<br/>
	* Does nothing by design (no values for map gauges).
	*/
	drawValue() {}
	/**
	* Overwrites {@link #redraw}.<br/>
	* Redraws the gauge with our custom values.
	*/
	redraw() {
		this.bitmap.clear();
		const currentValue = this.currentValue();
		if (!isNaN(currentValue)) {
			this.setValue(currentValue);
			this.setMaxValue(this.currentMaxValue());
			this.drawGauge();
			if (this.statusType() !== "time") {
				this.drawLabel();
				this.drawIcon();
				if (this.isValid()) {
					this.drawValue();
				}
			}
		}
	}
	/**
	* Overwrites {@link #measureLabelWidth}.<br/>
	* Measure the actual custom label for this map gauge. If no label is set,
	* return 0 so HUD gauges (which are unlabeled) render with the same width.
	* @returns {number}
	*/
	measureLabelWidth() {
		const label = this.label();
		if (!label || label.length === 0) {
			return 0;
		}
		this.bitmap.fontSize = 12;
		return this.bitmap.measureTextWidth(label);
	}
	/**
	* Overwrites {@link #textHeight}.<br/>
	* Return the bitmap height as the text height for map gauges to ensure borders are correctly drawn.
	* @returns {number}
	*/
	textHeight() {
		return this.bitmapHeight();
	}
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Animation.js
/**
* Gets the animation data being played.
* @returns {object} The animation.
*/
Sprite_Animation.prototype.animation = function() {
	return this._animation;
};
/**
* Gets the sprites this animation is playing against.
* @returns {Sprite[]} The targets.
*/
Sprite_Animation.prototype.targets = function() {
	return this._targets;
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_AnimationMV.js
/**
* Gets the MV-format animation data being played.
* @returns {object} The animation.
*/
Sprite_AnimationMV.prototype.animation = function() {
	return this._animation;
};
/**
* Gets the sprites this animation is playing against.
* @returns {Sprite[]} The targets.
*/
Sprite_AnimationMV.prototype.targets = function() {
	return this._targets;
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Damage.js
/**
* Gets the remaining frames before this popup disappears.
* @returns {number} The duration.
*/
Sprite_Damage.prototype.duration = function() {
	return this._duration;
};
/**
* Sets the remaining frames before this popup disappears.
* @param {number} newDuration The new duration.
*/
Sprite_Damage.prototype.setDuration = function(newDuration) {
	this._duration = newDuration;
};
/**
* Gets the rgba flash applied while this popup is displayed.
* @returns {number[]} The flashColor.
*/
Sprite_Damage.prototype.flashColor = function() {
	return this._flashColor;
};

//#endregion
//#region src/plugins/_base/core/sprites/Sprite_Gauge.js
/**
* Gets the battler this gauge is currently bound to.
* @returns {Game_Battler} The battler.
*/
Sprite_Gauge.prototype.battler = function() {
	return this._battler;
};
/**
* Sets the battler this gauge is currently bound to.
* @param {Game_Battler} newBattler The new battler.
*/
Sprite_Gauge.prototype.setBattler = function(newBattler) {
	this._battler = newBattler;
};
/**
* Gets which resource this gauge renders, such as "hp" or "mp".
* @returns {string} The statusType.
*/
Sprite_Gauge.prototype.statusType = function() {
	return this._statusType;
};
/**
* Sets which resource this gauge renders, such as "hp" or "mp".
* @param {string} newStatusType The new statusType.
*/
Sprite_Gauge.prototype.setStatusType = function(newStatusType) {
	this._statusType = newStatusType;
};
/**
* Gets the current value this gauge is rendering.
* @returns {number} The value.
*/
Sprite_Gauge.prototype.value = function() {
	return this._value;
};
/**
* Sets the current value this gauge is rendering.
* @param {number} newValue The new value.
*/
Sprite_Gauge.prototype.setValue = function(newValue) {
	this._value = newValue;
};
/**
* Gets the maximum value this gauge is rendering.
* @returns {number} The maxValue.
*/
Sprite_Gauge.prototype.maxValue = function() {
	return this._maxValue;
};
/**
* Sets the maximum value this gauge is rendering.
* @param {number} newMaxValue The new maxValue.
*/
Sprite_Gauge.prototype.setMaxValue = function(newMaxValue) {
	this._maxValue = newMaxValue;
};

//#endregion
//#region src/plugins/_base/core/sprites/Spriteset_Map.js
/**
* Gets the tilemap rendering the current map.
* @returns {Tilemap} The tilemap.
*/
Spriteset_Map.prototype.tilemap = function() {
	return this._tilemap;
};
/**
* Gets the sprites representing every character on the map.
* @returns {Sprite_Character[]} The characterSprites.
*/
Spriteset_Map.prototype.characterSprites = function() {
	return this._characterSprites;
};
/**
* Sets the sprites representing every character on the map.
* @param {Sprite_Character[]} newCharacterSprites The new characterSprites.
*/
Spriteset_Map.prototype.setCharacterSprites = function(newCharacterSprites) {
	this._characterSprites = newCharacterSprites;
};

//#endregion
//#region src/plugins/_base/core/windows/TileMap.js
/**
* Overwrites {@link #_addShadow}.<br/>
* Fuck those autoshadows.
*/
Tilemap.prototype._addShadow = function(layer, shadowBits, dx, dy) {};

//#endregion
//#region src/plugins/_base/core/windows/Window_Base.js
/**
* All alignments available for {@link Window_Base.prototype.drawText}.<br>
*/
Window_Base.TextAlignments = {
	/**
	* The "left" text alignment.
	* This is the default and not normally required to be set.
	*/
	Left: "left",
	/**
	* The "center" text alignment.
	* This requires the full width of the area attempting to be centered within
	* be provided (such as the whole window's width).
	*/
	Center: "center",
	/**
	* The "right" text alignment.
	* It is encouraged to use {@link Window_Base.prototype.textWidth} to define the
	* width parameter in order to properly right-align.
	*/
	Right: "right"
};
/**
* Enumerates built-in gauge types for {@link Window_Base#drawGauge}.
*/
Window_Base.GAUGE_TYPES = {
	Rectangle: "rect",
	Segmented: "segmented",
	Pill: "pill",
	Radial: "radial"
};
/**
* Draws a horizontal "line" with the given parameters.
*
* The origin coordinate is always the upper left corner.
* @param {number} x The x coordinate of the line.
* @param {number} y The y coordinate of the line.
* @param {number} width The width in pixels of the line.
* @param {number=} height The height in pixels of the line; defaults to 2.
*/
Window_Base.prototype.drawHorizontalLine = function(x, y, width, height = 2) {
	this.drawRect(x, y, width, height);
};
/**
* Draws a vertical "line" with the given parameters.
*
* The origin coordinate is always the upper left corner.
* @param {number} x The x coordinate of the line.
* @param {number} y The y coordinate of the line.
* @param {number} height The height in pixels of the line.
* @param {number=} width The width in pixels of the line; defaults to 2.
*/
Window_Base.prototype.drawVerticalLine = function(x, y, height, width = 2) {
	this.drawRect(x, y, width, height);
};
/**
* Clears the bitmaps associated with the window if available.
*/
Window_Base.prototype.clearContent = function() {
	if (this.contents) {
		this.contents.clear();
	}
	if (this.contentsBack) {
		this.contentsBack.clear();
	}
};
/**
* Refreshes the window by clearing its bitmaps and redrawing the content.
*/
Window_Base.prototype.refresh = function() {
	this.clearContent();
	this.drawContent();
};
/**
* Draws the content of this window.
*/
Window_Base.prototype.drawContent = function() {};
/**
* Overwrites {@link Window_Base.resetFontSettings}.<br/>
* Delegates each concern to its own method so individual windows can override
* only what they need (e.g. a smaller font size) without re-implementing everything.
*/
J.BASE.Aliased.Window_Base.set("resetFontSettings", Window_Base.prototype.resetFontSettings);
Window_Base.prototype.resetFontSettings = function() {
	this.resetFontFace();
	this.resetFontSize();
	this.resetTextColor();
	this.resetFontFormatting();
};
/**
* Resets the font face to the system default.
*/
Window_Base.prototype.resetFontFace = function() {
	this.contents.fontFace = $gameSystem.mainFontFace();
};
/**
* Resets the font size to the system default.<br>
* Override this in subclasses to use a different base size for a specific window.
*/
Window_Base.prototype.resetFontSize = function() {
	this.contents.fontSize = $gameSystem.mainFontSize();
};
/**
* Resets bold and italics for this bitmap.
*/
Window_Base.prototype.resetFontFormatting = function() {
	this.contents.fontItalic = false;
	this.contents.fontBold = false;
};
/**
* Gets the minimum font size.
* @returns {number}
*/
Window_Base.prototype.minimumFontSize = function() {
	return 8;
};
/**
* Gets the maximum font size.
* @returns {number}
*/
Window_Base.prototype.maximumFontSize = function() {
	return 96;
};
/**
* Clamps a font size value to fit within the min and max font size.
* @param {number} fontSize The font size to normalize.
* @returns {number}
*/
Window_Base.prototype.normalizeFontSize = function(fontSize) {
	let projectedFontSize = fontSize;
	projectedFontSize = Math.max(this.minimumFontSize(), projectedFontSize);
	projectedFontSize = Math.min(this.maximumFontSize(), projectedFontSize);
	return projectedFontSize;
};
/**
* Modify the font size by a given amount.
* Will clamp the value between the min and max font sizes.
* @param {number} amount The amount to add to the font size to change it.
*/
Window_Base.prototype.modFontSize = function(amount) {
	const projectedFontSize = this.contents.fontSize + amount;
	const normalizedFontSize = this.normalizeFontSize(projectedFontSize);
	this.contents.fontSize = normalizedFontSize;
};
/**
* Sets the font size to a given amount.
* Will clamp the value between the min and max font sizes.
* @param {number} fontSize The new potential font size to change it to.
*/
Window_Base.prototype.setFontSize = function(fontSize) {
	const projectedFontSize = fontSize;
	const normalizedFontSize = this.normalizeFontSize(projectedFontSize);
	this.contents.fontSize = normalizedFontSize;
};
/**
* Wraps text with `\\C[colorIndex]…\\C[0]` for {@link Window_Base#drawTextEx} (same idea as {@link #boldenText}).
* @param {number} colorIndex Palette index for the opening `\\C` code.
* @param {string} text Inner text.
* @returns {string} Tinted fragment; reset keeps later text from inheriting the color.
*/
Window_Base.prototype.colorizeText = function(colorIndex, text) {
	return `\\C[${colorIndex}]${text}\\C[0]`;
};
/**
* Wraps the given text with a font-size modifier shorthand.
* @param {number} modifier The size modification.
* @param {string} text The text to modify size for.
* @returns {string} The fontsize modified text like this: `\\FS[${number}]${string}\\FS[${number}]`
*/
Window_Base.prototype.modFontSizeForText = function(modifier, text) {
	const currentFontSize = this.contents.fontSize;
	const modifiedFontSize = currentFontSize + modifier;
	return `\\FS[${modifiedFontSize}]${text}\\FS[${currentFontSize}]`;
};
/**
* Extends text analysis to check for our custom escape codes, too.
*
* This enables bold and italics parsing for {@link Window_Base.prototype.drawTextEx}
* globally via `\\*` and `\\_`.
*/
J.BASE.Aliased.Window_Base.set("obtainEscapeCode", Window_Base.prototype.obtainEscapeCode);
Window_Base.prototype.obtainEscapeCode = function(textState) {
	const originalEscape = J.BASE.Aliased.Window_Base.get("obtainEscapeCode").call(this, textState);
	if (!originalEscape) {
		return this.customEscapeCodes(textState);
	} else {
		return originalEscape;
	}
};
/**
* Retrieves additional escape codes that are our custom creation.
* @param {RPG_TextState} textState Rolling bag from {@link Window_Base.prototype.createTextState}.
* @returns {string} The found escape code, if any.
*/
Window_Base.prototype.customEscapeCodes = function(textState) {
	if (!textState) return String.empty;
	const regExp = this.escapeCodes();
	const arr = regExp.exec(textState.text.slice(textState.index));
	if (arr) {
		textState.index += arr[0].length;
		return arr[0].toUpperCase();
	} else {
		return String.empty;
	}
};
/**
* Gets the regex escape code structure.
*
* This includes our added custom escape code symbols to look for.
* @returns {RegExp}
*/
Window_Base.prototype.escapeCodes = function() {
	return /^[$.|^!><{}*_\\]|^[A-Z]+/i;
};
/**
* Extends the processing of escape codes to include our custom ones.
*
* This adds italics and bold to the possible list of escape codes.
*/
J.BASE.Aliased.Window_Base.set("processEscapeCharacter", Window_Base.prototype.processEscapeCharacter);
Window_Base.prototype.processEscapeCharacter = function(code, textState) {
	J.BASE.Aliased.Window_Base.get("processEscapeCharacter").call(this, code, textState);
	switch (code) {
		case "_":
			this.toggleItalics();
			break;
		case "*":
			this.toggleBold();
			break;
	}
};
/**
* Toggles the italics for the rolling text state.
*
* This does not apply to {@link Window_Base.prototype.drawTextEx}, but alternatively
* you can interpolate `\"\\_\"` before and after the text desired to be italics to
* achieve the same effect.
* @param {?boolean} force Optional. If provided, will force one way or the other.
*/
Window_Base.prototype.toggleItalics = function(force = null) {
	this.contents.fontItalic = force ?? !this.contents.fontItalic;
};
/**
* Wraps the given text with the message code for italics.
* @param {string} text The text to italicize.
* @returns {string} The italicized text like this: `\\_${text}\\_`
*/
Window_Base.prototype.italicizeText = function(text) {
	return `\\_${text}\\_`;
};
/**
* Toggles the bold for the rolling text state.
*
* This does not apply to {@link Window_Base.prototype.drawTextEx}, but alternatively
* you can interpolate `\"\\*\"` before and after the text desired to be bold to
* achieve the same effect.
* @param {?boolean} force Optional. If provided, will force one way or the other.
*/
Window_Base.prototype.toggleBold = function(force = null) {
	this.contents.fontBold = force ?? !this.contents.fontBold;
};
/**
* Wraps the given text with the message code for bold.
* @param {string} text The text to bolden.
* @returns {string} The bolded text like this: `\\*${text}\\*`
*/
Window_Base.prototype.boldenText = function(text) {
	return `\\*${text}\\*`;
};
/**
* Builds a per-character mask: true where a `'0'` is **leading padding** inside a contiguous digit run
* (zeros before the first `'1'`–`'9'` in that run). Internal zeros (for example the middle `0` in `2088`)
* are false so they render like other significant digits.
*
* @param {string} value The full string being rendered (may include `(-…)`, `|`, `+`, etc.).
* @returns {boolean[]} Same length as `value`; non-digit indices are always false.
*/
Window_Base.prototype.buildLeadingPadZeroMask = function(value) {
	const mask = [];
	for (let i = 0; i < value.length; i++) {
		mask.push(false);
	}
	let i = 0;
	while (i < value.length) {
		const ch = value[i];
		if (ch >= "0" && ch <= "9") {
			const runStart = i;
			while (i < value.length && value[i] >= "0" && value[i] <= "9") {
				i++;
			}
			let firstSignificant = -1;
			for (let j = runStart; j < i; j++) {
				const c = value[j];
				if (c >= "1" && c <= "9") {
					firstSignificant = j;
					break;
				}
			}
			if (firstSignificant === -1) {
				for (let j = runStart; j < i; j++) {
					mask[j] = true;
				}
			} else {
				for (let j = runStart; j < firstSignificant; j++) {
					mask[j] = true;
				}
			}
		} else {
			i++;
		}
	}
	return mask;
};
/**
* Draws a padded value where leading zeroes are dim, and significant digits are bold.
* This is intended for controller-first numeric scanning (Monsterpedia, SDP, etc.).
*
* @param {number} x The left-most x.
* @param {number} y The y.
* @param {string} value The padded value to render.
* @param {number} width The width to work within.
* @param {number=} zeroColorIndex Palette index for leading zeros; defaults to 8.
* @param {number=} valueColorIndex Palette index for significant digits; defaults to 0.
* @param {'left'|'right'|'center'} align Horizontal alignment within {@code width}; defaults to {@code right}.
*/
Window_Base.prototype.drawStyledPaddedValue = function(x, y, value, width, zeroColorIndex = 8, valueColorIndex = 0, align = "right") {
	const charWidth = this.textWidth("0");
	const totalCharWidth = value.length * charWidth;
	let startX = x;
	if (align === "right") {
		startX = x + width - totalCharWidth;
	} else if (align === "center") {
		startX = x + Math.floor((width - totalCharWidth) / 2);
	}
	const leadingPadZeroMask = this.buildLeadingPadZeroMask(value);
	[...value].forEach((char, index) => {
		const isDigit = char >= "0" && char <= "9";
		const isLeadingPadZero = isDigit && char === "0" && leadingPadZeroMask[index];
		const isSignificantDigit = isDigit && isLeadingPadZero === false;
		if (isSignificantDigit) {
			this.processColorChange(valueColorIndex);
		} else if (isLeadingPadZero) {
			this.processColorChange(zeroColorIndex);
		} else {
			this.processColorChange(0);
		}
		this.toggleBold(isSignificantDigit);
		const charX = startX + index * charWidth;
		this.drawText(char, charX, y, charWidth, Window_Base.TextAlignments.Left);
		this.toggleBold(false);
	});
	this.processColorChange(0);
};
/**
* Draws a number padded with zeros, with leading zeros dimmed and significant digits bolded.
* @param {number} x The left-most x.
* @param {number} y The y.
* @param {number} number The numeric value.
* @param {number} width The width to work within.
* @param {number=} padZeroCount The digits to pad to; defaults to 8.
* @param {number=} zeroColorIndex Palette index for leading zeros; defaults to 8.
* @param {number=} valueColorIndex Palette index for significant digits; defaults to 0.
*/
Window_Base.prototype.drawStyledZeroPaddedNumber = function(x, y, number, width, padZeroCount = 8, zeroColorIndex = 8, valueColorIndex = 0) {
	const padded = number.padZero(padZeroCount);
	this.drawStyledPaddedValue(x, y, padded, width, zeroColorIndex, valueColorIndex);
};
/**
* Draws a cost value wrapped in parenthesis like `(-00000042)` with styled padding.
* @param {number} x The left-most x.
* @param {number} y The y.
* @param {number} cost The cost value.
* @param {number} width The width to work within.
* @param {number=} padZeroCount The digits to pad to; defaults to 8.
* @param {number=} zeroColorIndex Palette index for leading zeros; defaults to 8.
* @param {number=} valueColorIndex Palette index for significant digits; defaults to 0.
*/
Window_Base.prototype.drawStyledZeroPaddedCost = function(x, y, cost, width, padZeroCount = 8, zeroColorIndex = 8, valueColorIndex = 0) {
	const padded = cost.padZero(padZeroCount);
	const text = `(-${padded})`;
	this.drawStyledPaddedValue(x, y, text, width, zeroColorIndex, valueColorIndex);
};
/**
* Renders a "background" of a given rectangle.
* This is centralized for all windows to leverage if necessary.
* @param {Rectangle} rect The rectangle representing the background shape to render.
*/
Window_Base.prototype.drawBackgroundRect = function(rect) {
	const color1 = ColorManager.itemBackColor1();
	const color2 = ColorManager.itemBackColor2();
	const { x, y, width, height } = rect;
	this.contentsBack.gradientFillRect(x, y, width, height, color1, color2, true);
	this.contentsBack.strokeRect(x, y, width, height, color1);
};
/**
* The height of this gauge.
*/
Window_Base.prototype.gaugeHeight = function() {
	return 10;
};
/**
* The backdrop color.
* Defaults to black with 50% opacity.
* @returns {string}
*/
Window_Base.prototype.gaugeBackColor = function() {
	return "rgba(0, 0, 0, 0.5)";
};
/**
* Draws a gauge using a {@link Rectangle} and a {@link WindowGaugeOptions}.
* @param {Rectangle} rect The rectangle area to draw within.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The gauge options.
*/
Window_Base.prototype.drawGauge = function(rect, rate, options) {
	this.drawGaugeRect(rect, rate, options);
};
/**
* Dispatches to the specific gauge renderer based on the options.
* Provides an inner-rect (padding) and delegates shape/back/border to the style.
* @param {Rectangle} rect The rectangle area.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The strongly-typed gauge options.
*/
Window_Base.prototype.drawGaugeRect = function(rect, rate, options) {
	const clampedRate = Math.max(0, Math.min(1, rate));
	const inner = this._computeGaugeInnerRect(rect, options);
	const { x, y, width, height } = inner;
	switch (options.gaugeType) {
		case Window_Base.GAUGE_TYPES.Segmented: {
			this.drawGaugeSegmented(x, y, width, height, clampedRate, options);
			break;
		}
		case Window_Base.GAUGE_TYPES.Pill: {
			this.drawGaugePill(x, y, width, height, clampedRate, options);
			break;
		}
		case Window_Base.GAUGE_TYPES.Radial: {
			this.drawGaugeRadial(x, y, width, height, clampedRate, options);
			break;
		}
		case Window_Base.GAUGE_TYPES.Rectangle:
		default: {
			this.drawGaugeBorderedRect(x, y, width, height, clampedRate, options);
			break;
		}
	}
};
/**
* Draws a rectangular gauge with a gradient fill and a rectangle border that
* hugs the fill area. Back color is rendered first.
* @param {number} x The x coordinate inside the inner rect.
* @param {number} y The y coordinate inside the inner rect.
* @param {number} w The inner width.
* @param {number} h The inner height.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The strongly-typed gauge options.
*/
Window_Base.prototype.drawGaugeBorderedRect = function(x, y, w, h, rate, options) {
	const { backColor } = options;
	const { borderColor } = options;
	const { borderThickness } = options;
	this.contents.fillRect(x, y, w, h, backColor);
	const fw = Math.max(0, Math.floor(w * Math.max(0, Math.min(1, rate))));
	if (fw > 0 && h > 0) {
		this.contents.gradientFillRect(x, y, fw, h, options.leftGradientColor, options.rightGradientColor);
	}
	const ctx = this.context();
	ctx.save();
	ctx.beginPath();
	ctx.rect(x + .5, y + .5, w - 1, h - 1);
	ctx.lineWidth = borderThickness;
	ctx.strokeStyle = borderColor;
	ctx.stroke();
	ctx.restore();
};
/**
* Draws a segmented gauge with a single continuous gradient across the filled length.
* Then carves gap bars so color transitions don’t reset per segment.
* Border is a simple rectangle following the gauge.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
* @param {number} w The inner width.
* @param {number} h The inner height.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The strongly-typed gauge options.
*/
Window_Base.prototype.drawGaugeSegmented = function(x, y, w, h, rate, options) {
	const { backColor } = options;
	const { borderColor } = options;
	const { borderThickness } = options;
	const dividerColor = options.dividerColor || borderColor;
	const count = Math.max(1, Number(options.segments));
	const spacing = Math.max(0, Number(options.gap));
	const clamped = Math.max(0, Math.min(1, rate));
	const fw = Math.max(0, Math.floor(w * clamped));
	if (h <= 0) return;
	this.contents.fillRect(x, y, w, h, backColor);
	if (fw > 0) {
		this.contents.gradientFillRect(x, y, fw, h, options.leftGradientColor, options.rightGradientColor);
		if (count > 1 && spacing > 0) {
			const totalGap = spacing * (count - 1);
			const segW = Math.max(1, Math.floor((w - totalGap) / count));
			for (let i = 1; i < count; i++) {
				const gx = x + i * segW + (i - 1) * spacing;
				if (gx < x + fw) {
					const carve = Math.min(spacing, x + fw - gx);
					if (carve > 0) {
						this.contents.fillRect(gx, y, carve, h, dividerColor);
					}
				}
			}
		}
	}
	const ctx = this.context();
	ctx.save();
	ctx.beginPath();
	ctx.rect(x + .5, y + .5, w - 1, h - 1);
	ctx.lineWidth = borderThickness;
	ctx.strokeStyle = borderColor;
	ctx.stroke();
	ctx.restore();
};
/**
* Draws a pill gauge with a true rounded-rectangle path (no scanlines),
* then outlines it so the border follows the pill shape.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
* @param {number} w The inner width.
* @param {number} h The inner height.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The strongly-typed gauge options.
*/
Window_Base.prototype.drawGaugePill = function(x, y, w, h, rate, options) {
	const maxR = Math.max(0, Math.floor(h / 2) - 1);
	const r = Math.max(0, Math.min(Number(options.radius), maxR));
	const { backColor } = options;
	const { borderColor } = options;
	const { borderThickness } = options;
	const fw = Math.max(0, Math.floor(w * Math.max(0, Math.min(1, rate))));
	if (h <= 0) return;
	const ctx = this.context();
	const grad = ctx.createLinearGradient(x, y, x + w, y);
	grad.addColorStop(0, options.leftGradientColor);
	grad.addColorStop(1, options.rightGradientColor);
	const roundedRectPath = () => {
		const x2 = x + w;
		const y2 = y + h;
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x2 - r, y);
		ctx.arcTo(x2, y, x2, y + r, r);
		ctx.lineTo(x2, y2 - r);
		ctx.arcTo(x2, y2, x2 - r, y2, r);
		ctx.lineTo(x + r, y2);
		ctx.arcTo(x, y2, x, y2 - r, r);
		ctx.lineTo(x, y + r);
		ctx.arcTo(x, y, x + r, y, r);
		ctx.closePath();
	};
	ctx.save();
	roundedRectPath();
	ctx.fillStyle = backColor;
	ctx.fill();
	ctx.restore();
	if (fw > 0) {
		ctx.save();
		roundedRectPath();
		ctx.clip();
		ctx.fillStyle = grad;
		ctx.fillRect(x, y, fw, h);
		ctx.restore();
	}
	ctx.save();
	roundedRectPath();
	ctx.lineWidth = borderThickness;
	ctx.strokeStyle = borderColor;
	ctx.stroke();
	ctx.restore();
};
/**
* Draws an elliptical (oval-capable) radial gauge inside the given rect.
* Renders: back ring → filled wedge → border strokes that follow outer+inner ellipses.
* @param {number} x The inner-rect x.
* @param {number} y The inner-rect y.
* @param {number} w The inner-rect width.
* @param {number} h The inner-rect height.
* @param {number} rate The 0..1 fill amount.
* @param {WindowGaugeOptions} options The strongly-typed gauge options.
*/
Window_Base.prototype.drawGaugeRadial = function(x, y, w, h, rate, options) {
	const rx = Math.max(2, Math.floor(w / 2) - 1);
	const ry = Math.max(2, Math.floor(h / 2) - 1);
	const cx = x + Math.floor(w / 2);
	const cy = y + Math.floor(h / 2);
	const r = Math.max(0, Math.min(1, rate));
	const a0 = options.startAngle;
	const a1 = a0 + Math.PI * 2 * r;
	const t = Math.max(1, Math.floor(options.thickness));
	const irx = Math.max(1, rx - t);
	const iry = Math.max(1, ry - t);
	const { backColor } = options;
	const { borderColor } = options;
	const { borderThickness } = options;
	const ctx = this.context();
	const midAngle = a0 + (a1 - a0) / 2;
	const gx0 = cx + Math.cos(a0) * irx;
	const gy0 = cy + Math.sin(a0) * iry;
	const gx1 = cx + Math.cos(midAngle) * rx;
	const gy1 = cy + Math.sin(midAngle) * ry;
	const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
	grad.addColorStop(0, options.leftGradientColor);
	grad.addColorStop(1, options.rightGradientColor);
	ctx.save();
	ctx.beginPath();
	ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2, false);
	ctx.ellipse(cx, cy, irx, iry, 0, Math.PI * 2, 0, true);
	ctx.closePath();
	ctx.fillStyle = backColor;
	ctx.fill();
	ctx.restore();
	if (r > 0) {
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(cx, cy, rx, ry, 0, a0, a1, false);
		ctx.ellipse(cx, cy, irx, iry, 0, a1, a0, true);
		ctx.closePath();
		ctx.fillStyle = grad;
		ctx.fill();
		ctx.restore();
	}
	ctx.save();
	ctx.lineWidth = borderThickness;
	ctx.strokeStyle = borderColor;
	ctx.beginPath();
	ctx.ellipse(cx, cy, rx - (borderThickness % 2 ? .5 : 0), ry - (borderThickness % 2 ? .5 : 0), 0, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.beginPath();
	ctx.ellipse(cx, cy, irx + (borderThickness % 2 ? .5 : 0), iry + (borderThickness % 2 ? .5 : 0), 0, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.restore();
};
/**
* Computes the inner rectangle to draw into by applying border/padding options.
* This prevents the fill from touching the border while letting each style
* render its own border/backdrop shape.
* @param {Rectangle} rect The outer rectangle passed to drawGauge.
* @param {WindowGaugeOptions} options The gauge options (includes border settings).
* @returns {Rectangle} The inner rect.
*/
Window_Base.prototype._computeGaugeInnerRect = function(rect, options) {
	const borderThickness = Math.max(1, options.borderThickness);
	const borderGap = Math.max(0, options.borderGap);
	const ix = rect.x + borderThickness + borderGap;
	const iy = rect.y + borderThickness + borderGap;
	const iw = Math.max(0, rect.width - (borderThickness + borderGap) * 2);
	const ih = Math.max(0, rect.height - (borderThickness + borderGap) * 2);
	return {
		x: ix,
		y: iy,
		width: iw,
		height: ih
	};
};
/**
* Gets the 2d drawing context backing this window's contents bitmap.
* @returns {CanvasRenderingContext2D} The drawing context.
*/
Window_Base.prototype.context = function() {
	return this.contents.context;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_Command.js
/**
* A hook for subclasses to seed their own members before the command list is first built.
*
* A no-op here; implement it in the subclass and it will be called at the right moment.
*
* This exists because {@link Window_Command.initialize} ends by refreshing- which builds the command
* list, and therefore runs the subclass's `makeCommandList` before the subclass has had any chance to
* set itself up. Both of the obvious places to seed state are too late:
*
* - the constructor body after `super(rect)`, because `super(rect)` is what triggers the refresh.
* - class field declarations, because JavaScript applies those only after `super()` returns.
*
* And a derived constructor cannot touch `this` before calling `super`, so there is no earlier place to
* put it. Seeding state anywhere else yields "cannot read properties of undefined" from inside
* `makeCommandList`, on the first frame the window exists.
*
* Implementations must confine themselves to assigning fields. This runs before the original logic
* reaches {@link Window_Base.initialize}, so there is no `contents`, no geometry and no font yet-
* anything that draws, measures, or refreshes belongs after `super(rect)` in the constructor instead.
*
* There is a second, sharper consequence of the same timing, and it applies to `makeCommandList` rather
* than to this hook: **a command window's list is built before the instance is fully constructed**, so
* nothing on that path may touch a private member. Private fields and methods are branded onto an
* instance only once `super()` returns, and until then any `this.#anything` throws:
*
*   TypeError: Receiver must be an instance of class anonymous
*
* Note that naming a private method is enough- `array.map(this.#build, this)` evaluates the reference
* before `map` runs, so it throws even when the array is empty. So a `makeCommandList` with nothing to
* build should return before reaching any private member, which is worth a guard of its own.
*/
Window_Command.prototype.initMembers = function() {};
/**
* Extends {@link Window_Command.initialize}.<br/>
* Also gives subclasses a chance to seed their members before the command list is built from them.
*/
J.BASE.Aliased.Window_Command.set("initialize", Window_Command.prototype.initialize);
Window_Command.prototype.initialize = function(rect) {
	this.initMembers();
	J.BASE.Aliased.Window_Command.get("initialize").call(this, rect);
};
/**
* Gets all commands currently in this list.
* @returns {BuiltWindowCommand[]}
*/
Window_Command.prototype.commandList = function() {
	return this._list;
};
/**
* Checks whether or not there are any commands in this list.
* @return {boolean}
*/
Window_Command.prototype.hasCommands = function() {
	return this.commandList().length > 0;
};
/**
* Command row at {@link index}, or null when out of range (empty list, stale index, pre-refresh).
*
* @param {number} index The index driving this step.
* @returns {object|null}
*/
Window_Command.prototype.commandEntryAt = function(index) {
	const entry = this.commandList().at(index);
	if (entry === undefined || entry === null) {
		return null;
	}
	return entry;
};
/**
* Get the unmodified line height, which should always be `36`.
* @returns {36}
*/
Window_Command.prototype.originalLineHeight = function() {
	return Window_Base.prototype.lineHeight.call(this);
};
/**
* Handles things that must occur before every command drawn, such as
* clearing any residual text color assignments and changing the text opacity
* accordingly to the command's enabled status.
* @param {number} index The index of the command to predraw for.
*/
Window_Command.prototype.preDrawItem = function(index) {
	this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
};
/**
* Overwrites {@link #drawItem}.<br/>
* Renders the text along with any additional data that is available to the command.
*/
Window_Command.prototype.drawItem = function(index) {
	this.preDrawItem(index);
	const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
	let commandName = this.buildCommandName(index);
	const rightText = this.commandRightText(index);
	const isSubtext = this.isCommandSubtext(index);
	const subtexts = this.commandSubtext(index);
	const extraLines = this.commandLines(index);
	let commandNameX = rectX + 40;
	let commandNameY = rectY;
	const hasSubtexts = subtexts.length > 0 && isSubtext;
	const hasMultilineText = extraLines.length > 0 && !isSubtext;
	const subtextLift = subtexts.length * this.subtextLineHeight() / 2;
	const multilineLift = extraLines.length * this.multilineLineHeight() / 2;
	if (hasSubtexts) {
		commandName = this.boldenText(commandName);
		commandNameY -= subtextLift;
	} else if (hasMultilineText) {
		commandNameY -= multilineLift;
	}
	const [faceName, faceIndex] = this.commandFaceData(index);
	const hasFaceData = faceName !== String.empty && faceIndex > -1 && faceIndex < 8;
	if (hasFaceData) {
		const faceY = rectY;
		this.drawFace(faceName.substring(faceName.lastIndexOf("/") + 1), faceIndex, commandNameX - 36, faceY - 12, ImageManager.faceWidth, ImageManager.faceHeight);
		commandNameX += 36;
	}
	const commandIcon = this.commandIcon(index);
	if (commandIcon && !hasFaceData) {
		const iconY = rectY;
		this.drawIcon(commandIcon, commandNameX - 36, iconY);
	}
	if (!commandIcon && !hasFaceData) commandNameX = rectX + 4;
	this.drawTextEx(commandName, commandNameX, commandNameY, rectWidth);
	if (rightText) {
		const textWidth = this.textWidth(rightText);
		const rightTextX = rectWidth - this.textWidth(rightText);
		let rightTextY = rectY;
		if (hasSubtexts) {
			this.toggleBold(true);
			rightTextY -= subtextLift;
		}
		this.processColorChange(this.commandRightColorIndex(index));
		this.drawText(rightText, rightTextX, rightTextY, textWidth, "right");
		this.toggleBold(false);
	}
	if (hasSubtexts) {
		subtexts.forEach((subtext, subtextIndex) => {
			const realSubtextIndex = subtextIndex + 0;
			const subtextX = commandNameX;
			const subtextY = rectY - subtextLift + (realSubtextIndex + 1) * this.subtextLineHeight() + 2;
			const italicsSubtext = this.italicizeText(subtext);
			const sizedSubtext = this.modFontSizeForText(-4, italicsSubtext);
			this.drawTextEx(sizedSubtext, subtextX, subtextY, rectWidth);
		}, this);
	} else if (hasMultilineText) {
		const extraLineX = commandNameX;
		extraLines.forEach((extraLine, extraLineIndex) => {
			const actualIndex = extraLineIndex + 0;
			const extraLineY = rectY - multilineLift + (actualIndex + 1) * this.multilineLineHeight() + 2;
			this.drawTextEx(extraLine, extraLineX, extraLineY, rectWidth);
		}, this);
	}
};
/**
* Builds the name of the command at the given index.
* @param {number} index The index to build a name for.
* @returns {string} The built name.
*/
Window_Command.prototype.buildCommandName = function(index) {
	let commandName = `${this.commandName(index)}`;
	commandName = this.handleColor(commandName, index);
	return commandName;
};
/**
* Gets the subtext for the command at the given index.
* @param {number} index The index to get subtext for.
* @returns {string[]} The subtext if available, an empty array otherwise.
*/
Window_Command.prototype.commandSubtext = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return [];
	}
	return command.subText ?? [];
};
/**
* Gets the subtext for the command at the given index.
* @param {number} index The index to get subtext for.
* @returns {string[]} The lines if available, an empty array otherwise.
*/
Window_Command.prototype.commandLines = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return [];
	}
	return command.lines ?? [];
};
Window_Command.prototype.isCommandSubtext = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return true;
	}
	return command.isSubtext ?? true;
};
/**
* The line height explicitly used for subtext.
* @returns {number}
*/
Window_Command.prototype.subtextLineHeight = function() {
	return 20;
};
/**
* The line height explicitly used for multiline commands.
* @returns {number}
*/
Window_Command.prototype.multilineLineHeight = function() {
	return 16;
};
/**
* Gets the right-aligned text for this command.
* @param {number} index The index to get the right-text for.
* @returns {string}
*/
Window_Command.prototype.commandRightText = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return String.empty;
	}
	return command.rightText;
};
/**
* Gets the right-aligned text color index for this command.
* @param {number} index The index to get the right-color-index for.
* @returns {number}
*/
Window_Command.prototype.commandRightColorIndex = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return 0;
	}
	return command.rightColor;
};
/**
* Gets the help text for the command at the given index.
* @param {number} index The index to get the help text for.
* @returns {string}
*/
Window_Command.prototype.commandHelpText = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return String.empty;
	}
	return command.helpText;
};
/**
* Gets the help text for the current command.
* @returns {string}
*/
Window_Command.prototype.currentHelpText = function() {
	return this.commandHelpText(this.index()) ?? String.empty;
};
/**
* Overwrites {@link #updateHelp}.<br/>
* Describes the highlighted command in the attached help window.
*
* Commands already carry their own help text, and the engine already tells a window when to refresh its
* help- so doing the join here means attaching a help window is the whole of the work. Commands without
* help text resolve to an empty string, which reads as a cleared help window.
*/
Window_Command.prototype.updateHelp = function() {
	if (!this.helpWindow()) return;
	this.helpWindow().setText(this.currentHelpText());
};
/**
* Wraps the command in color if a color index is provided.
* @param {string} command The comman as raw text.
* @param {number} index The index of this command in the window.
* @returns {string}
*/
Window_Command.prototype.handleColor = function(command, index) {
	const commandColor = this.commandColor(index);
	if (commandColor) {
		return `\\C[${commandColor}]${command}\\C[0]`;
	}
	return command;
};
/**
* Retrieves the icon for the given command in the window if it exists.
* @param {number} index the index of the command.
* @returns {number} The icon index for the command, or 0 if it doesn't exist.
*/
Window_Command.prototype.commandIcon = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return 0;
	}
	return command.icon;
};
/**
* Retrieves the color for the given command in the window if it exists.
* @param {number} index the index of the command.
* @returns {number} The color index for the command, or 0 if it doesn't exist.
*/
Window_Command.prototype.commandColor = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return 0;
	}
	return command.color;
};
Window_Command.prototype.commandFaceData = function(index) {
	const command = this.commandEntryAt(index);
	if (command === null) {
		return [String.empty, -1];
	}
	return command.faceData ?? [String.empty, -1];
};
/**
* Overwrites {@link #addCommand}.<br/>
* Adds additional metadata to a command.
* @param {string} name The visible name of this command.
* @param {string} symbol The symbol for this command.
* @param {boolean=} enabled Whether or not this command is enabled; defaults to true.
* @param {object=} ext The extra data for this command; defaults to null.
* @param {number=} icon The icon index for this command; defaults to 0.
* @param {number=} color The color index for this command; defaults to 0.
*/
Window_Command.prototype.addCommand = function(name, symbol, enabled = true, ext = null, icon = 0, color = 0) {
	this.commandList().push({
		name,
		symbol,
		enabled,
		ext,
		icon,
		color
	});
};
/**
* Adds a pre-built command using the {@link BuiltWindowCommand} implementation.
* @param {BuiltWindowCommand} command The command to be added.
*/
Window_Command.prototype.addBuiltCommand = function(command) {
	this.commandList().push(command);
};
/**
* Identical to {@link #addCommand}, except that this adds the new command to
* the front of the list. This results in vertical lists having a new item prepended to
* the top, and in horizontal lists having a new item prepended to the left.
* @param {string} name The visible name of this command.
* @param {string} symbol The symbol for this command.
* @param {boolean=} enabled Whether or not this command is enabled; defaults to true.
* @param {object=} ext The extra data for this command; defaults to null.
* @param {number=} icon The icon index for this command; defaults to 0.
* @param {number=} color The color index for this command; defaults to 0.
*/
Window_Command.prototype.prependCommand = function(name, symbol, enabled = true, ext = null, icon = 0, color = 0) {
	this.commandList().unshift({
		name,
		symbol,
		enabled,
		ext,
		icon,
		color
	});
};
/**
* Adds a pre-built command using the {@link BuiltWindowCommand} implementation to
* the front of the list. This results in vertical lists having a new item prepended
* to the top, and in horizontal lists having a new item prepended to the left.
* @param {BuiltWindowCommand} command The command to be prepended.
*/
Window_Command.prototype.prependBuiltCommand = function(command) {
	this.commandList().unshift(command);
};

//#endregion
//#region src/plugins/_base/core/windows/Window_EquipItem.js
/**
* Overwrites {@link #updateHelp}.<br/>
* Enables extension of the method's logic for various menu needs.
*/
Window_EquipItem.prototype.updateHelp = function() {
	Window_ItemList.prototype.updateHelp.call(this);
	if (this.actor() && this.statusWindow() && this.slotId() >= 0) {
		this.updateActorComparison();
	}
};
/**
* Updates the actor comparison of the status window by duplicating the actor
* and forcefully equipping it with the hovered item.
*/
Window_EquipItem.prototype.updateActorComparison = function() {
	const actorClone = this.getActorClone(this.actor());
	this.preEquipSetupActorClone(actorClone);
	actorClone.forceChangeEquip(this.slotId(), this.item());
	this.postEquipSetupActorClone(actorClone);
	this.statusWindow().setTempActor(actorClone);
};
/**
* Duplicates a given actor.
*
* The duplicate is not a real version of the {@link Game_Actor} class, but
* will have access to its prototypical inheritance.
* @param {Game_Actor} actorToCopy The actor to make a copy of.
* @returns {Game_Actor} A non-referenced duplicate of the given actor.
*/
Window_EquipItem.prototype.getActorClone = function(actorToCopy) {
	return JsonEx.makeDeepCopy(actorToCopy);
};
/**
* A hook for performing logic on the clone of the actor for the status window.
* This is fired before equipping the actor clone with the equipment.
* @param {Game_Actor} actorClone The clone of the actor.
*/
Window_EquipItem.prototype.preEquipSetupActorClone = function(actorClone) {};
/**
* A hook for performing logic on the clone of the actor for the status window.
* This is fired after equipping the actor clone with the equipment.
* @param {Game_Actor} actorClone The clone of the actor.
*/
Window_EquipItem.prototype.postEquipSetupActorClone = function(actorClone) {};
/**
* Gets the actor whose equipment is being changed.
* @returns {Game_Actor} The actor.
*/
Window_EquipItem.prototype.actor = function() {
	return this._actor;
};
/**
* Gets the status window previewing this selection.
* @returns {Window_EquipStatus} The statusWindow.
*/
Window_EquipItem.prototype.statusWindow = function() {
	return this._statusWindow;
};
/**
* Gets the equipment slot currently being filled.
* @returns {number} The slotId.
*/
Window_EquipItem.prototype.slotId = function() {
	return this._slotId;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_FilterStrip.js
/**
* A thin strip above a filterable list, naming the tab the player is currently on.
*
* The strip renders a {@link FilterCycle} position directly rather than resolving a key into a label and an
* icon on every draw. A position already carries its own name and icon because whatever built the cycle had
* to know both anyway- so resolving here would be doing the same lookup once per frame that the cycle
* builder already did once per rebuild.
*/
var Window_FilterStrip = class extends Window_Base {
	/**
	* The position being named, defaulting to the empty one so the strip can draw before a cycle exists.
	* @type {{key: string, name: string, iconIndex: number}}
	*/
	_position = FilterCycle.EMPTY_POSITION;
	/**
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Sets the position this strip names and redraws.
	* @param {{key: string, name: string, iconIndex: number}} position The position driving this step.
	*/
	setPosition(position) {
		this._position = position;
		this.refresh();
	}
	/**
	* The position this strip is currently naming.
	* @returns {{key: string, name: string, iconIndex: number}}
	*/
	position() {
		return this._position;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Renders the active position's icon and label.
	*/
	drawContent() {
		const { name, iconIndex } = this.position();
		const iconPad = 4;
		const hasIcon = iconIndex > 0;
		const textX = hasIcon ? ImageManager.iconWidth + iconPad : 0;
		if (hasIcon) {
			this.drawIcon(iconIndex, iconPad, 0);
		}
		this.resetFontSettings();
		this.drawText(name, textX, 0, this.innerWidth - textX, Window_Base.TextAlignments.Left);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/_base/core/windows/Window_FilterableList.js
/**
* A command list narrowed by two independent filters: the tab the player is cycling with L2/R2, and an
* on/off toggle that hides rows they cannot act on.
*
* The two axes are genuinely independent and both are needed. The tab answers "which family of things am I
* looking at", the toggle answers "and only the ones I can do something with right now"- a maxed SDP panel
* and an uncraftable recipe are the same idea wearing different words.
*
* Subclasses supply the policy and never override {@link #makeCommandList}. The pipeline is fixed on
* purpose: filter the source, then sort, then build one command per surviving row. Building commands first
* and discarding them afterwards- which is how one of the two lists this replaces did it- pays to construct
* rows nobody sees, and forces a null return out of a builder whose whole job is to return a command.
*/
var Window_FilterableList = class extends Window_Command {
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Seeds both filters.
	*
	* These cannot be class field declarations, and they cannot live in a constructor body either:
	* `Window_Command.initialize` ends by refreshing, refreshing calls `makeCommandList`, and that reads both
	* of these. Anything assigned after `super()` returns is assigned too late to be seen by the first build.
	*/
	initMembers() {
		/**
		* The key of the tab currently selected.
		* @type {string}
		*/
		this._filterKey = this.initialFilterKey();
		/**
		* Whether rows the player cannot act on are hidden.
		* @type {boolean}
		*/
		this._actionableOnly = false;
	}
	/**
	* The tab a freshly built list starts on, before any scene has pointed it anywhere.
	*
	* {@link FilterCycle.ALL} suits a list that holds everything and narrows it, because showing everything
	* is the honest answer to "no tab chosen yet". A list whose source is a keyed query wants the opposite
	* and should override this: asking its provider for the everything-sentinel would be asking for a
	* category that does not exist.
	* @returns {string}
	*/
	initialFilterKey() {
		return FilterCycle.ALL;
	}
	/**
	* The key of the tab currently selected.
	* @returns {string}
	*/
	filterKey() {
		return this._filterKey;
	}
	/**
	* Sets the tab and rebuilds the list.
	* @param {string} filterKey The filter key driving this step.
	*/
	setFilterKey(filterKey) {
		if (this._filterKey === filterKey) return;
		this._filterKey = filterKey;
		this.refresh();
	}
	/**
	* Whether rows the player cannot act on are currently hidden.
	* @returns {boolean}
	*/
	isActionableOnly() {
		return this._actionableOnly;
	}
	/**
	* Flips the actionable-only filter and rebuilds the list.
	*
	* The rebuild is the whole point. A setter that flips its flag and returns leaves the player looking at
	* rows that no longer answer the filter they just asked for, and because a command list is only rebuilt on
	* refresh, nothing else will notice until some unrelated action happens to refresh it.
	*/
	toggleActionableOnly() {
		this._actionableOnly = !this._actionableOnly;
		this.refresh();
	}
	/**
	* Implements {@link Window_Command.makeCommandList}.<br/>
	* Filters, orders, and builds the rows.
	*/
	makeCommandList() {
		this.buildCommands().forEach(this.addBuiltCommand, this);
	}
	/**
	* Narrows the source down to the rows that survive both filters, in display order.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const filterKey = this.filterKey();
		return this.sourceItems().filter((item) => this.matchesFilter(item, filterKey)).filter((item) => this.isVisibleUnderActionableFilter(item)).sort((left, right) => this.compareItems(left, right)).map(this.buildCommand, this);
	}
	/**
	* Whether a row survives the actionable-only toggle.
	* @param {*} item The item driving this step.
	* @returns {boolean}
	*/
	isVisibleUnderActionableFilter(item) {
		if (this.isActionableOnly() === false) return true;
		return this.isActionable(item);
	}
	/**
	* The unfiltered list of things this window could show.
	* Subclasses answer with their own domain objects.
	* @returns {*[]}
	*/
	sourceItems() {
		return [];
	}
	/**
	* Whether a row belongs under the active tab.
	* Subclasses that only ever show one tab leave this alone.
	* @param {*} _item The item driving this step.
	* @param {string} _filterKey The active tab's key.
	* @returns {boolean}
	*/
	matchesFilter(_item, _filterKey) {
		return true;
	}
	/**
	* Whether the player can still do something with this row- rank it up, cook it, buy it.
	* Subclasses that have no such notion leave this alone and the toggle becomes a no-op for them.
	* @param {*} _item The item driving this step.
	* @returns {boolean}
	*/
	isActionable(_item) {
		return true;
	}
	/**
	* Orders two rows against each other, as {@link Array.prototype.sort} expects.
	* The default ties every pair, which preserves the source's own order.
	* @param {*} _left The first item driving this step.
	* @param {*} _right The second item driving this step.
	* @returns {number}
	*/
	compareItems(_left, _right) {
		return 0;
	}
	/**
	* Builds the command representing a single row.
	* @param {*} _item The item driving this step.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(_item) {
		throw new Error("A Window_FilterableList must implement buildCommand.");
	}
	/**
	* What to say when the list has nothing in it, since an empty frame reads as one that failed to draw.
	* Answer {@link String.empty} to stay silent.
	* @returns {string}
	*/
	emptyListText() {
		return "Nothing here.";
	}
	/**
	* Overwrites {@link Window_Selectable.drawAllItems}.<br/>
	* Explains an empty list rather than presenting a blank frame.
	* @override
	*/
	drawAllItems() {
		if (this.maxItems() > 0) {
			Window_Command.prototype.drawAllItems.call(this);
			return;
		}
		const message = this.emptyListText();
		if (message === String.empty) return;
		this.resetFontSettings();
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(message, 0, 0, this.innerWidth, Window_Base.TextAlignments.Center);
	}
};

//#endregion
//#region src/plugins/_base/core/windows/Window_Help.js
/**
* Gets the text from this help window.
* @returns {string}
*/
Window_Help.prototype.getText = function() {
	return this._text;
};
/**
* Sets the text of this help window to the given text.
* Will short-circuit if the given text it is the same as the current text.
* @param {string} text The given text to set this help window to.
*/
Window_Help.prototype.setText = function(text) {
	if (!this.canSetText(text)) return;
	const secondaryNewline = this.getSecondaryNewline();
	const messagePieces = text.split(secondaryNewline);
	const needsMessageComposition = messagePieces.length > 1;
	const message = needsMessageComposition ? this.buildMessage(messagePieces) : text;
	this._text = message;
	this.refresh();
};
/**
* Builds a message from a collection of message pieces.
* @param {string[]} messagePieces The collection of message pieces.
* @returns {string} A single string with additional new lines based on the collection size.
*/
Window_Help.prototype.buildMessage = function(messagePieces) {
	let message = String.empty;
	messagePieces.forEach((messagePiece, index) => {
		message += `${messagePieces.at(index)}`;
		if (messagePieces.at(index + 1)) {
			message += `\n`;
		}
	});
	return message;
};
/**
* Determines whether or not the given text can be set.
* @param {string} newText The new text to set.
* @returns {boolean} True if the given text can be set, false otherwise.
*/
Window_Help.prototype.canSetText = function(newText) {
	if (this.getText() === newText) return false;
	return true;
};
/**
* Gets the newline character other than "\n".
* @returns {string}
*/
Window_Help.prototype.getSecondaryNewline = function() {
	return "|";
};
/**
* Overwrites {@link #refresh}.<br/>
* Extracts the text rendering out into its own function, but this function
* still does the same thing: clears and redraws the contents of the window.
*/
Window_Help.prototype.refresh = function() {
	this.contents.clear();
	this.renderText();
};
/**
* Renders the text associated with this help window.
*/
Window_Help.prototype.renderText = function() {
	const { x, y, width } = this.baseTextRect();
	this.drawTextEx(this.getText(), x, y, width);
};

//#endregion
//#region src/plugins/_base/core/windows/Window_ItemList.js
/**
* Gets the rows this list is currently displaying.
*
* Vanilla builds `_data` in {@link #makeItemList} and then reads the field directly from half a dozen
* places. Anything extending one of those - reordering the rows, filtering them, appending to them -
* needs a way in that is not a reach into storage it does not own, and every J-owned list window already
* carries this same pair.
* @returns {(RPG_BaseItem|null)[]}
*/
Window_ItemList.prototype.data = function() {
	return this._data;
};
/**
* Sets the rows this list displays.
* @param {(RPG_BaseItem|null)[]} newData The rows to display.
*/
Window_ItemList.prototype.setData = function(newData) {
	this._data = newData;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_MoreData.js
/**
* A window designed to display "more" data.
* "More" data is typically defined as parameters not found otherwise listed
* in the screens these lists usually reside in.
*/
var Window_MoreData = class Window_MoreData extends Window_Command {
	/**
	* The various types supported by "more data" functionality.
	*/
	static Types = {
		/** The weapon type. */
		Weapon: "Weapon",
		/** The armor type. */
		Armor: "Armor",
		/** The skill type. */
		Skill: "Skill",
		/** The item type. */
		Item: "Item",
		/** Unknown type, if somehow some other type found its way in there. */
		Unknown: "Unknown"
	};
	/**
	* @constructor
	* @param {Rectangle} rect A rectangle that represents the shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes all properties of this method.
	*/
	initMembers() {
		/**
		* The item we're displaying more data for.
		* @type {RPG_EquipItem|RPG_UsableItem|null}
		*/
		this.item = null;
		/**
		* The type of item we're displaying in the more data window.
		* @type {string}
		*/
		this.type = null;
		/**
		* The actor used to perform parameter calculations against.
		* @type {Game_Actor}
		*/
		this.actor = null;
	}
	/**
	* Sets an item to this window to display more data for.
	* @param {RPG_BaseItem} newItem The item to set for this window.
	*/
	setItem(newItem) {
		this.item = newItem;
		this.refresh();
	}
	/**
	* Sets the actor of this window for performing parameter calculations against.
	* @param {Game_Actor} newActor The new actor.
	*/
	setActor(newActor) {
		this.actor = newActor;
		this.refresh();
	}
	/**
	* Refreshes this window by clearing it and redrawing all its contents.
	*/
	refresh() {
		super.refresh();
		if (this.item) {
			this.determineItemType();
		}
	}
	/**
	* Updates the type of item this is.
	*/
	determineItemType() {
		switch (true) {
			case DataManager.isItem(this.item):
				this.type = Window_MoreData.Types.Item;
				break;
			case DataManager.isSkill(this.item):
				this.type = Window_MoreData.Types.Skill;
				break;
			case DataManager.isArmor(this.item):
				this.type = Window_MoreData.Types.Armor;
				break;
			case DataManager.isWeapon(this.item):
				this.type = Window_MoreData.Types.Weapon;
				break;
			default:
				this.type = Window_MoreData.Types.Unknown;
				Diagnostics.warn("J-Base", "was provided an unknown item type to display more data for.", this.item);
				break;
		}
	}
	/**
	* Determines whether or not the selected row is a weapon or not.
	* @returns {boolean} True if this is a weapon, false otherwise.
	*/
	weaponSelected() {
		return this.type === Window_MoreData.Types.Weapon;
	}
	/**
	* Determines whether or not the selected row is an armor or not.
	* @returns {boolean} True if this is an armor, false otherwise.
	*/
	armorSelected() {
		return this.type === Window_MoreData.Types.Armor;
	}
	/**
	* Determines whether or not the selected row is an item or not.
	* @returns {boolean} True if this is an item, false otherwise.
	*/
	itemSelected() {
		return this.type === Window_MoreData.Types.Item;
	}
	/**
	* Determines whether or not the selected row is a skill or not.
	* @returns {boolean} True if this is a skill, false otherwise.
	*/
	skillSelected() {
		return this.type === Window_MoreData.Types.Skill;
	}
	/**
	* Creates a command list for this menu.
	*/
	makeCommandList() {
		if (this.item) {
			this.adjustWindowHeight();
		}
	}
	/**
	* Readjusts the height of the command window to match the number of commands.
	*/
	adjustWindowHeight() {
		const magicHeight = 800;
		const calculatedHeight = (this.commandList().length + 1) * (this.lineHeight() + 8) - 16;
		if (calculatedHeight >= magicHeight) {
			this.height = magicHeight;
		} else {
			this.height = calculatedHeight;
		}
	}
};

//#endregion
//#region src/plugins/_base/core/windows/Window_Selectable.js
/**
* Weaves in the "more data window" at the highest level of selectable.
*
* It can be added to any window that extends this or its subclasses.
*/
J.BASE.Aliased.Window_Selectable.set("initialize", Window_Selectable.prototype.initialize);
Window_Selectable.prototype.initialize = function(rect) {
	J.BASE.Aliased.Window_Selectable.get("initialize").call(this, rect);
	/**
	* The "more data" window. Used for further elaborating on a particular selection.
	*
	* @type {Window_MoreData}
	*/
	this._moreDataWindow = null;
};
J.BASE.Aliased.Window_Selectable.set("processHandling", Window_Selectable.prototype.processHandling);
Window_Selectable.prototype.processHandling = function() {
	if (this.isOpenAndActive()) {
		if (this.isMoreEnabled() && this.isMoreTriggered()) {
			return this.processMore();
		}
		if (this.isContextEnabled() && this.isContextTriggered()) {
			return this.processContext();
		}
		if (this.isContentPrevEnabled() && this.isContentPrevTriggered()) {
			return this.processContentPrev();
		}
		if (this.isContentNextEnabled() && this.isContentNextTriggered()) {
			return this.processContentNext();
		}
		if (this.isActorPrevEnabled() && this.isActorPrevTriggered()) {
			return this.processActorPrev();
		}
		if (this.isActorNextEnabled() && this.isActorNextTriggered()) {
			return this.processActorNext();
		}
	}
	return J.BASE.Aliased.Window_Selectable.get("processHandling").call(this);
};
/**
* Gets whether or not "more" data has been provided.
* @returns {boolean}  True if "more" is handled, false otherwise.
*/
Window_Selectable.prototype.isMoreEnabled = function() {
	return this.isHandled("more");
};
/**
* Gets whether or not the "more" button is pressed/held.
* @returns {boolean} True if the "more" button is pressed/held, false otherwise.
*/
Window_Selectable.prototype.isMoreTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("shift") : Input.isTriggered("shift");
};
/**
* Processes the "more" functionality.
*/
Window_Selectable.prototype.processMore = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callMoreHandler();
};
/**
* Calls the given handler provided by the "more" symbol.
*/
Window_Selectable.prototype.callMoreHandler = function() {
	this.callHandler("more");
};
/**
* Gets whether a contextual scene action handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isContextEnabled = function() {
	return this.isHandled("context");
};
/**
* Gets whether triangle / tab fired this frame (or repeat when allowed).
* @returns {boolean}
*/
Window_Selectable.prototype.isContextTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("tab") : Input.isTriggered("tab");
};
/**
* Processes the contextual scene action.
*/
Window_Selectable.prototype.processContext = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callContextHandler();
};
/**
* Calls the handler registered for contextual scene actions.
*/
Window_Selectable.prototype.callContextHandler = function() {
	this.callHandler("context");
};
/**
* Gets whether a content-tab previous handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isContentPrevEnabled = function() {
	return this.isHandled("content-prev");
};
/**
* Gets whether L2 / ctrl fired for content cycling.
* @returns {boolean}
*/
Window_Selectable.prototype.isContentPrevTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("l2") : Input.isTriggered("l2");
};
/**
* Processes content-tab cycle toward the previous entry.
*/
Window_Selectable.prototype.processContentPrev = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callContentPrevHandler();
};
/**
* Calls the handler registered for content-tab previous.
*/
Window_Selectable.prototype.callContentPrevHandler = function() {
	this.callHandler("content-prev");
};
/**
* Gets whether a content-tab next handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isContentNextEnabled = function() {
	return this.isHandled("content-next");
};
/**
* Gets whether R2 / alt fired for content cycling.
* @returns {boolean}
*/
Window_Selectable.prototype.isContentNextTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("r2") : Input.isTriggered("r2");
};
/**
* Processes content-tab cycle toward the next entry.
*/
Window_Selectable.prototype.processContentNext = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callContentNextHandler();
};
/**
* Calls the handler registered for content-tab next.
*/
Window_Selectable.prototype.callContentNextHandler = function() {
	this.callHandler("content-next");
};
/**
* Gets whether an actor-previous handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isActorPrevEnabled = function() {
	return this.isHandled("actor-prev");
};
/**
* Gets whether L1 / pageup fired for actor cycling.
* @returns {boolean}
*/
Window_Selectable.prototype.isActorPrevTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("pageup") : Input.isTriggered("pageup");
};
/**
* Processes actor cycle toward the previous party member.
*/
Window_Selectable.prototype.processActorPrev = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callActorPrevHandler();
};
/**
* Calls the handler registered for actor-previous.
*/
Window_Selectable.prototype.callActorPrevHandler = function() {
	this.callHandler("actor-prev");
};
/**
* Gets whether an actor-next handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isActorNextEnabled = function() {
	return this.isHandled("actor-next");
};
/**
* Gets whether R1 / pagedown fired for actor cycling.
* @returns {boolean}
*/
Window_Selectable.prototype.isActorNextTriggered = function() {
	return this.canRepeat() ? Input.isRepeated("pagedown") : Input.isTriggered("pagedown");
};
/**
* Processes actor cycle toward the next party member.
*/
Window_Selectable.prototype.processActorNext = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callActorNextHandler();
};
/**
* Calls the handler registered for actor-next.
*/
Window_Selectable.prototype.callActorNextHandler = function() {
	this.callHandler("actor-next");
};
/**
* Gets whether a focus-previous handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isFocusPrevEnabled = function() {
	return this.isHandled("focus-prev");
};
/**
* Gets whether a focus-next handler is registered.
* @returns {boolean}
*/
Window_Selectable.prototype.isFocusNextEnabled = function() {
	return this.isHandled("focus-next");
};
/**
* Processes moving focus to the window on the left.
*/
Window_Selectable.prototype.processFocusPrev = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callFocusPrevHandler();
};
/**
* Processes moving focus to the window on the right.
*/
Window_Selectable.prototype.processFocusNext = function() {
	this.playCursorSound();
	this.updateInputData();
	this.callFocusNextHandler();
};
/**
* Calls the handler registered for focus-previous.
*/
Window_Selectable.prototype.callFocusPrevHandler = function() {
	this.callHandler("focus-prev");
};
/**
* Calls the handler registered for focus-next.
*/
Window_Selectable.prototype.callFocusNextHandler = function() {
	this.callHandler("focus-next");
};
/**
* Extends {@link #cursorLeft}.<br/>
* Moves focus to the window on the left when one has been declared.
*
* Horizontal cursor movement is spatial- it means "go that way"- which the engine can only honour
* within a single window, and only when that window has more than one column. A scene laying windows
* out side by side has nowhere to express the same intent, so it declares a focus handler and this
* routes the input there.
*
* Note that this is a different idea from `content-prev`, which changes which subset a window is
* showing rather than where the player is. Those deliberately answer to different inputs: this to the
* directional pad, content cycling to the shoulder buttons. Collapsing them would spend two inputs
* on one job and leave the other unexpressible.
* @param {boolean} wrap Whether or not to wrap the cursor.
*/
J.BASE.Aliased.Window_Selectable.set("cursorLeft", Window_Selectable.prototype.cursorLeft);
Window_Selectable.prototype.cursorLeft = function(wrap) {
	if (this.isFocusPrevEnabled()) {
		return this.processFocusPrev();
	}
	return J.BASE.Aliased.Window_Selectable.get("cursorLeft").call(this, wrap);
};
/**
* Extends {@link #cursorRight}.<br/>
* Moves focus to the window on the right when one has been declared.
* @param {boolean} wrap Whether or not to wrap the cursor.
*/
J.BASE.Aliased.Window_Selectable.set("cursorRight", Window_Selectable.prototype.cursorRight);
Window_Selectable.prototype.cursorRight = function(wrap) {
	if (this.isFocusNextEnabled()) {
		return this.processFocusNext();
	}
	return J.BASE.Aliased.Window_Selectable.get("cursorRight").call(this, wrap);
};
/**
* Extends the `.select()` to include a hook for executing logic onIndexChange.
*/
J.BASE.Aliased.Window_Selectable.set("select", Window_Selectable.prototype.select);
Window_Selectable.prototype.select = function(index) {
	const previousIndex = this.index();
	J.BASE.Aliased.Window_Selectable.get("select").call(this, index);
	if (previousIndex !== this.index()) {
		this.onIndexChange();
	}
};
/**
* Designed for overriding to weave in functionality on-change of the index.
*
* NOTE: This executes AFTER the index has changed.
*/
Window_Selectable.prototype.onIndexChange = function() {};
/**
* Gets whether or not holding a direction repeats the cursor movement.
* @returns {boolean} The canRepeat.
*/
Window_Selectable.prototype.canRepeat = function() {
	return this._canRepeat;
};
/**
* Gets the help window bound to this selection.
* @returns {Window_Help} The helpWindow.
*/
Window_Selectable.prototype.helpWindow = function() {
	return this._helpWindow;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_ChoiceList.js
/**
* Gets the message window this choice list is anchored to.
* @returns {Window_Message} The messageWindow.
*/
Window_ChoiceList.prototype.messageWindow = function() {
	return this._messageWindow;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_EquipStatus.js
/**
* Gets the actor whose parameters are displayed.
* @returns {Game_Actor} The actor.
*/
Window_EquipStatus.prototype.actor = function() {
	return this._actor;
};
/**
* Gets the hypothetical actor used to preview parameter changes.
* @returns {Game_Actor} The tempActor.
*/
Window_EquipStatus.prototype.tempActor = function() {
	return this._tempActor;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_SkillList.js
/**
* Gets the actor whose skills are listed.
* @returns {Game_Actor} The actor.
*/
Window_SkillList.prototype.actor = function() {
	return this._actor;
};
/**
* Gets the skill type currently being filtered to.
* @returns {number} The stypeId.
*/
Window_SkillList.prototype.stypeId = function() {
	return this._stypeId;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_SkillType.js
/**
* Gets the actor whose skill types are listed.
* @returns {Game_Actor} The actor.
*/
Window_SkillType.prototype.actor = function() {
	return this._actor;
};

//#endregion
//#region src/plugins/_base/core/windows/Window_Status.js
/**
* Gets the actor whose status is displayed.
* @returns {Game_Actor} The actor.
*/
Window_Status.prototype.actor = function() {
	return this._actor;
};

//#endregion
//#region src/plugins/_base/core/windows/WindowLayer.js
/**
* Overwrites {@link #render}.<br/>
* Renders windows, but WITH the ability to overlay.
*
* @param {PIXI.Renderer} renderer - The renderer.
*/
WindowLayer.prototype.render = function(renderer) {
	if (!this.visible) {
		return;
	}
	const graphics = new PIXI.Graphics(), { gl } = renderer, children = this.children.clone();
	renderer.framebuffer.forceStencil();
	graphics.transform = this.transform;
	renderer.batch.flush();
	gl.enable(gl.STENCIL_TEST);
	while (children.length > 0) {
		const win = children.shift();
		if (win._isWindow && win.visible && win.openness > 0) {
			gl.stencilFunc(gl.EQUAL, 0, ~0);
			gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
			win.render(renderer);
			renderer.batch.flush();
			graphics.clear();
			gl.stencilFunc(gl.ALWAYS, 1, ~0);
			gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
			gl.blendFunc(gl.ZERO, gl.ONE);
			graphics.render(renderer);
			renderer.batch.flush();
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		}
	}
	gl.disable(gl.STENCIL_TEST);
	gl.clear(gl.STENCIL_BUFFER_BIT);
	gl.clearStencil(0);
	renderer.batch.flush();
	for (const child of this.children) {
		if (!child._isWindow && child.visible) {
			child.render(renderer);
		}
	}
	renderer.batch.flush();
};

//#endregion
//# sourceMappingURL=J-Base.js.map