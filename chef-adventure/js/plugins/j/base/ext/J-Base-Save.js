//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 BASE-SAVE] Saves as readable JSON instead of a compressed heap dump.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin replaces how RPG Maker MZ writes and reads savefiles.
 *
 * Vanilla treats a save as a dump of the live game objects: it is compressed,
 * it is one file per slot, and every value in it is whatever the engine
 * happened to be holding at the moment you pressed save. That makes a save
 * unreadable, impossible to hand-edit, and quietly full of data the game
 * already knows how to rebuild.
 *
 * With this plugin a slot becomes a directory of pretty-printed JSON, written
 * through per-type codecs that decide what is worth keeping.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A slot looks like this on disk:
 *
 *    save/
 *      config.json                 settings that outlive every save
 *      profile.json                anything that outlives one playthrough
 *      file1/
 *        current                   names the live generation
 *        gen-0007/
 *          manifest.json           what the load menu reads
 *          world.json
 *          party.json
 *          actors.json
 *          systems/
 *
 * Three things follow from that shape.
 *
 * A save is READABLE. Open it in any text editor and the state of the game is
 * right there, in named fields, in indented JSON.
 *
 * A save is RECOVERABLE. Each save writes a new generation and then swaps a
 * one-line pointer, which is the only filesystem operation that is genuinely
 * atomic. A crash mid-write leaves the previous generation live and untouched,
 * so the worst case is losing the newest save rather than losing the file.
 *
 * A save is HONEST. Derived data - caches, timers, anything the game rebuilds
 * on its own - is declared as such and never written, so what is in the file is
 * only what actually had to be remembered.
 *
 * ----------------------------------------------------------------------------
 * NOTE ABOUT SAVE COMPATIBILITY:
 * Savefiles written by vanilla RPG Maker MZ cannot be read by this plugin, and
 * savefiles written by this plugin cannot be read without it. There is no
 * converter. Install it before a project has saves worth keeping.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param retainedSaveGenerations
 * @type number
 * @min 1
 * @text Retained Save Generations
 * @desc How many past versions of a save slot are kept on disk for rollback.
 * @default 3
 */
//endregion annotations


//#region \0rolldown/runtime.js
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});

//#endregion
//#region src/plugins/_base/ext/save/_metadata/_pluginMetadata.js
/**
* The metadata for J-Base-Save, which owns the shape a savefile takes on disk.
*/
var J_BaseSavePluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
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
	*/
	initializeMetadata() {
		/**
		* How many past generations of a slot survive on disk for rollback.
		*
		* Three is the default because the failure mode of a bad save should be "you lost the last
		* save", never "you lost the file". Size is deliberately not a consideration here.
		* @type {number}
		*/
		this.retainedSaveGenerations = this.parsedPluginParameters["retainedSaveGenerations"] ?? 3;
	}
};

//#endregion
//#region src/plugins/_base/ext/save/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.BASE.EXT.SAVE = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.BASE.EXT.SAVE.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.BASE.EXT.SAVE.Metadata = new J_BaseSavePluginMetadata("J-Base-Save", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.BASE.EXT.SAVE.Aliased = {};
J.BASE.EXT.SAVE.Aliased.ConfigManager = new Map();
J.BASE.EXT.SAVE.Aliased.DataManager = new Map();
J.BASE.EXT.SAVE.Aliased.Game_System = new Map();
J.BASE.EXT.SAVE.Aliased.Scene_Boot = new Map();

//#endregion
//#region src/plugins/_base/ext/save/core/SaveError.js
/**
* The base of every error the save pipeline throws.
*
* Two things separate these from a bare {@link Error}. The first is the path: a savefile is a deep
* document, and "cannot encode Foo" is useless without knowing which of the eleven hundred nodes was
* the Foo. Every save error carries the JSON path of the node that failed, written the way a reader
* would type it - `$.actors._data[3]._j._abs._equippedSkills`.
*
* The second is {@link #kind}. The loader steps back through older generations when a newer one
* fails, and it has to tell *what* failed apart - a missing section file is recoverable by stepping
* back, an unregistered codec is not, because every generation will have the same problem. That
* discrimination cannot be a prototype-chain test, which this codebase bans, so the kind is data
* carried on the error itself.
*/
var SaveError = class extends Error {
	/**
	* A short, stable, machine-readable classification of what went wrong.
	* @type {string}
	*/
	#kind = String.empty;
	/**
	* The JSON path of the node that failed, from the root of the document being processed.
	* @type {string}
	*/
	#path = String.empty;
	/**
	* @param {string} kind The stable classification of the failure.
	* @param {string} path The JSON path of the node that failed.
	* @param {string} summary The human-readable explanation, which should say what to do about it.
	*/
	constructor(kind, path, summary) {
		super(`[${kind}] at ${path}: ${summary}`);
		this.name = "SaveError";
		this.#kind = kind;
		this.#path = path;
	}
	/**
	* Gets the stable classification of this failure, for callers deciding whether to recover.
	* @returns {string}
	*/
	kind() {
		return this.#kind;
	}
	/**
	* Gets the JSON path of the node that failed.
	* @returns {string}
	*/
	path() {
		return this.#path;
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveEncodeError.js
/**
* Thrown while turning the live object graph into plain data, when the graph contains something the
* codec declarations do not describe.
*
* Both cases this covers are **declaration bugs, caught at save time**, and that is deliberate. The
* alternative to throwing is writing a file that decodes into something subtly wrong - an object with
* no prototype, a field that comes back as a plain `{}` - and discovering it hours later in testplay
* as a missing method. Failing at the moment of the omission puts the error in front of the person
* who created it, holding the exact path of the field they forgot.
*/
var SaveEncodeError = class SaveEncodeError extends SaveError {
	/**
	* Builds the error for a class instance that no codec claims.
	*
	* The fix is a `SerializableRegistry.register` call for that class, not a change to the encoder.
	* @param {string} path The JSON path of the offending node.
	* @param {string} typeName The name of the unregistered constructor.
	* @returns {SaveEncodeError}
	*/
	static unregisteredType(path, typeName) {
		return new SaveEncodeError("save-encode-unregistered", path, `no codec is registered for '${typeName}'. Register it with SerializableRegistry.register(${typeName}).`);
	}
	/**
	* Builds the error for a field holding a class instance that its owner's type map never declared.
	*
	* The fix is a `typed` entry on the owning codec naming that field and its constructor - the point
	* of the check is that every typed field gets classified deliberately by whoever added it.
	* @param {string} path The JSON path of the offending field.
	* @param {string} ownerId The save id of the codec that should have declared it.
	* @param {string} field The name of the undeclared field.
	* @param {string} typeName The name of the constructor the field holds.
	* @returns {SaveEncodeError}
	*/
	static undeclaredTypedField(path, ownerId, field, typeName) {
		return new SaveEncodeError("save-encode-undeclared-typed-field", path, `'${field}' holds a ${typeName}, which the codec for '${ownerId}' does not declare. ` + `Add it: typed: { ${field}: ${typeName} }.`);
	}
	/**
	* Builds the error for a graph that descends further than the encoder is willing to follow.
	*
	* In practice this means a reference cycle: the walk has no cycle detection, deliberately, because
	* the shapes it encodes are trees. A depth ceiling turns an unreadable stack overflow into a path.
	* @param {string} path The JSON path at which the ceiling was reached.
	* @param {number} maxDepth The ceiling that was exceeded.
	* @returns {SaveEncodeError}
	*/
	static tooDeep(path, maxDepth) {
		return new SaveEncodeError("save-encode-too-deep", path, `the object graph is deeper than ${maxDepth} levels, which almost always means a reference ` + "cycle. Find the field on this path that points back up the graph.");
	}
	/**
	* @param {string} kind The stable classification of the failure.
	* @param {string} path The JSON path of the node that failed.
	* @param {string} summary The human-readable explanation.
	*/
	constructor(kind, path, summary) {
		super(kind, path, summary);
		this.name = "SaveEncodeError";
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveDecodeError.js
/**
* Thrown while rebuilding live objects out of the plain data a savefile holds.
*
* Every case here means the file and the code disagree about what a node is, and none of them is
* safely recoverable by guessing: a node whose type cannot be resolved would have to come back as a
* plain object, and a plain object standing in for a `Game_Actor` fails later, somewhere else,
* without any trace of where it came from. The loader steps back to an older generation instead, and
* these errors are what tell it to.
*/
var SaveDecodeError = class SaveDecodeError extends SaveError {
	/**
	* Builds the error for a type tag naming a codec that is not registered.
	*
	* Usually this means a plugin that wrote the save is no longer installed, or a class was renamed
	* without listing its old id in `aliases` - which is exactly what `aliases` is for.
	* @param {string} path The JSON path of the offending node.
	* @param {string} id The unresolvable save id.
	* @returns {SaveDecodeError}
	*/
	static unknownSaveId(path, id) {
		return new SaveDecodeError("save-decode-unknown-id", path, `no codec is registered under the save id '${id}'. Either the plugin that wrote it is no ` + `longer installed, or the class was renamed without adding aliases: [ '${id}' ].`);
	}
	/**
	* Builds the error for a node whose own tag contradicts the type map that expected it.
	*
	* The tag is redundant with the type map by design, and this is the integrity check that
	* redundancy buys: the two disagreeing means the file was written by different code than is
	* reading it, and continuing would put the wrong prototype on a live object.
	* @param {string} path The JSON path of the offending node.
	* @param {string} expectedId The save id the containing type map declared.
	* @param {string} actualId The save id the node's own tag carries.
	* @returns {SaveDecodeError}
	*/
	static typeMismatch(path, expectedId, actualId) {
		return new SaveDecodeError("save-decode-type-mismatch", path, `the type map expects '${expectedId}' here but the file says '${actualId}'. The save was ` + "written by different code than is reading it; check for a renamed or re-pointed field.");
	}
	/**
	* Builds the error for an untagged node at a position whose declared constructor has no codec.
	*
	* This is the tags-stripped path: with no tag to fall back on, an unregistered declared type
	* leaves nothing to rebuild from at all.
	* @param {string} path The JSON path of the offending node.
	* @param {string} typeName The name of the declared constructor.
	* @returns {SaveDecodeError}
	*/
	static unregisteredDeclaredType(path, typeName) {
		return new SaveDecodeError("save-decode-unregistered-declared-type", path, `the type map declares '${typeName}' here, but no codec is registered for it. ` + `Register it with SerializableRegistry.register(${typeName}).`);
	}
	/**
	* @param {string} kind The stable classification of the failure.
	* @param {string} path The JSON path of the node that failed.
	* @param {string} summary The human-readable explanation.
	*/
	constructor(kind, path, summary) {
		super(kind, path, summary);
		this.name = "SaveDecodeError";
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveStorageError.js
/**
* Thrown while reading or writing the files a slot is made of.
*
* These are the failures that have nothing to do with what the document *means*: a pointer naming a
* generation that is not there, a manifest that will not parse, a section the manifest promised and
* the directory does not hold, a disk that refused a write. The loader treats most of them as a
* reason to step back to an older generation, which is exactly why they carry a `kind` - see
* {@link SaveError}.
*
* The path on a storage error is a file path rather than a JSON path, because that is the thing a
* reader would go look at.
*/
var SaveStorageError = class SaveStorageError extends SaveError {
	/**
	* Builds the error for a slot with no generations at all.
	*
	* This is the "no such savefile" case, and it is normal: an empty slot in the load menu reaches it
	* every time the player looks at one.
	* @param {string} slotPath The directory the slot would live in.
	* @returns {SaveStorageError}
	*/
	static noGenerations(slotPath) {
		return new SaveStorageError("save-storage-no-generations", slotPath, "the slot holds no generations, so there is nothing to load.");
	}
	/**
	* Builds the error for a generation missing a file its manifest promised.
	* @param {string} filePath The path of the absent file.
	* @returns {SaveStorageError}
	*/
	static missingSection(filePath) {
		return new SaveStorageError("save-storage-missing-section", filePath, "the manifest lists this section but the file is not there. The generation is incomplete, " + "which is what a torn write looks like.");
	}
	/**
	* Builds the error for a file that is present but is not valid JSON.
	* @param {string} filePath The path of the unreadable file.
	* @param {string} reason Whatever `JSON.parse` said about it.
	* @returns {SaveStorageError}
	*/
	static malformedSection(filePath, reason) {
		return new SaveStorageError("save-storage-malformed-section", filePath, `the file is present but did not parse as JSON: ${reason}`);
	}
	/**
	* Builds the error for a generation written by a schema version this code cannot reach.
	*
	* The missing step is named because it is the actionable half of the message: a save two versions
	* behind with only the second step written fails here, and "write the migration from 3" is a very
	* different instruction from "this save is from the future".
	* @param {string} filePath The path of the manifest carrying the version.
	* @param {number} found The schema version the file claims.
	* @param {number} supported The schema version this code writes.
	* @param {number} missingStep The version whose migration is absent, or `0` when none is.
	* @returns {SaveStorageError}
	*/
	static unsupportedSchemaVersion(filePath, found, supported, missingStep) {
		const remedy = missingStep === 0 ? "It was written by a newer build than this one." : `No migration is registered from version ${missingStep}.`;
		return new SaveStorageError("save-storage-unsupported-schema-version", filePath, `the generation was written at schema version ${found}, and this build understands ` + `${supported}. ${remedy}`);
	}
	/**
	* Builds the error for a slot where every generation failed, naming what was wrong with each.
	*
	* This is the end of the line for a load: stepping back further is not possible, so the message
	* has to carry the whole story rather than only the last thing that went wrong.
	* @param {string} slotPath The directory the slot lives in.
	* @param {string[]} failures One line per generation tried, newest first.
	* @returns {SaveStorageError}
	*/
	static noLoadableGeneration(slotPath, failures) {
		return new SaveStorageError("save-storage-no-loadable-generation", slotPath, `every generation failed to load. Newest first:\n  ${failures.join("\n  ")}`);
	}
	/**
	* Builds the error for a write the filesystem refused.
	*
	* A full, locked, or permission-denied disk is real on Windows and is more likely now that a slot
	* is a directory of files rather than one. The pointer is deliberately left alone when this
	* happens, so the previous generation stays live and the player loses nothing but the new save.
	* @param {string} filePath The path being written when it failed.
	* @param {string} reason Whatever the filesystem said.
	* @returns {SaveStorageError}
	*/
	static writeFailed(filePath, reason) {
		return new SaveStorageError("save-storage-write-failed", filePath, `the filesystem refused the write: ${reason}. The previous generation is untouched and is ` + "still the live one.");
	}
	/**
	* @param {string} kind The stable classification of the failure.
	* @param {string} path The file path that failed.
	* @param {string} summary The human-readable explanation.
	*/
	constructor(kind, path, summary) {
		super(kind, path, summary);
		this.name = "SaveStorageError";
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveCodec.js
/**
* The normalized per-type record the registry stores: everything the encoder and decoder need to
* know about one class, resolved once at registration time rather than re-derived per node.
*
* A codec is built from the loose options object a caller hands
* {@link SerializableRegistry.register}, and its job is to turn every convenience that object allows
* into exactly one shape the walkers can rely on. Notably:
*
* - `transients` and `typed` accept **dotted paths**, because almost every transient in this project
*   lives inside a plugin namespace (`_j._base._cachedAllNotes`) rather than directly on the class.
*   A flat key list could not express a single row of the real inventory.
* - `seed` is resolved here, not at decode time, so the question "does this class have an
*   `initMembers` to default from" is asked once per class instead of once per decoded object.
*
* The trees this builds are read on every node of a save, so they are plain nested `Map`s rather
* than anything cleverer- a `Map.get` per path segment is the whole cost.
*/
var SaveCodec = class SaveCodec {
	/**
	* The constructor this codec describes.
	* @type {Function}
	*/
	#type = null;
	/**
	* The stable string this type is written to disk as.
	* @type {string}
	*/
	#id = String.empty;
	/**
	* Older save ids that still resolve to this type, so a rename ships without a migration.
	* @type {string[]}
	*/
	#aliases = [];
	/**
	* Transient declarations as given: dotted path to a factory producing the cold value.
	* @type {Map<string, Function>}
	*/
	#transients = new Map();
	/**
	* The same transient declarations arranged as a tree, for the encoder to skip by while walking.
	* @type {{value: Function|null, children: Map<string, object>}}
	*/
	#transientTree = null;
	/**
	* Type declarations arranged as a tree: which fields hold instances, and of what.
	* @type {{value: Function|null, children: Map<string, object>}}
	*/
	#typedTree = null;
	/**
	* Dictionary-valued type declarations arranged as a tree: which fields are plain objects whose
	* *values* are instances.
	* @type {{value: Function|null, children: Map<string, object>}}
	*/
	#typedValuesTree = null;
	/**
	* Establishes every field's default on a bare instance, before decoded fields land on it.
	* @type {Function}
	*/
	#seed = null;
	/**
	* A full replacement for the default encode walk, or null to use the default.
	* @type {Function|null}
	*/
	#encode = null;
	/**
	* A full replacement for the default decode walk, or null to use the default.
	* @type {Function|null}
	*/
	#decode = null;
	/**
	* Builds an empty node for the path trees below.
	* @returns {{value: Function|null, children: Map<string, object>}}
	*/
	static emptyNode() {
		return {
			value: null,
			children: new Map()
		};
	}
	/**
	* Arranges a flat map of dotted paths into a tree, so a walker descending an object graph can
	* carry its position in the declarations alongside its position in the data.
	*
	* A path may be a plain field name, in which case its node hangs directly off the root.
	* @param {Object<string, Function>} declarations Dotted path to whatever the path declares.
	* @returns {{value: Function|null, children: Map<string, object>}} The root of the tree.
	*/
	static buildPathTree(declarations) {
		const root = SaveCodec.emptyNode();
		Object.keys(declarations).forEach((path) => {
			let node = root;
			path.split(".").forEach((segment) => {
				if (node.children.has(segment) === false) {
					node.children.set(segment, SaveCodec.emptyNode());
				}
				node = node.children.get(segment);
			});
			node.value = declarations[path];
		});
		return root;
	}
	/**
	* @param {Function} type The constructor this codec describes.
	* @param {object} options The normalization inputs; see {@link SerializableRegistry.register}.
	* @param {string} options.id The stable save id.
	* @param {string[]} options.aliases Older save ids that still resolve here.
	* @param {Object<string, Function>} options.transients Dotted path to a cold-value factory.
	* @param {Object<string, Function>} options.typed Dotted path to the constructor that field holds.
	* @param {Object<string, Function>} options.typedValues Dotted path to the constructor that
	* field's dictionary *values* hold.
	* @param {Function|null} options.seed An explicit default-establishing step, or null to derive one.
	* @param {Function|null} options.encode A full encode override, or null.
	* @param {Function|null} options.decode A full decode override, or null.
	*/
	constructor(type, { id, aliases, transients, typed, typedValues, seed, encode, decode }) {
		this.#type = type;
		this.#id = id;
		this.#aliases = aliases;
		this.#transients = new Map(Object.entries(transients));
		this.#transientTree = SaveCodec.buildPathTree(transients);
		this.#typedTree = SaveCodec.buildPathTree(typed);
		this.#typedValuesTree = SaveCodec.buildPathTree(typedValues);
		this.#seed = seed ?? this.#deriveSeed(type);
		this.#encode = encode;
		this.#decode = decode;
	}
	/**
	* Picks the default seed step for a type that did not supply one.
	* @param {Function} type The constructor being registered.
	* @returns {Function} The seed step.
	*/
	#deriveSeed(type) {
		if (!type.prototype.initMembers) return () => {};
		if (type.prototype.initMembers.length > 0) return () => {};
		return (instance) => instance.initMembers();
	}
	/**
	* Gets the constructor this codec describes.
	* @returns {Function}
	*/
	type() {
		return this.#type;
	}
	/**
	* Gets the stable string this type is written to disk as.
	* @returns {string}
	*/
	id() {
		return this.#id;
	}
	/**
	* Gets the older save ids that still resolve to this type.
	* @returns {string[]}
	*/
	aliases() {
		return this.#aliases;
	}
	/**
	* Gets the transient declarations, keyed by dotted path.
	* @returns {Map<string, Function>}
	*/
	transients() {
		return this.#transients;
	}
	/**
	* Gets the root of the transient path tree, for the encoder to walk alongside the data.
	* @returns {{value: Function|null, children: Map<string, object>}}
	*/
	transientTree() {
		return this.#transientTree;
	}
	/**
	* Gets the root of the type path tree, for the decoder to walk alongside the data.
	* @returns {{value: Function|null, children: Map<string, object>}}
	*/
	typedTree() {
		return this.#typedTree;
	}
	/**
	* Gets the root of the dictionary-value type path tree.
	* @returns {{value: Function|null, children: Map<string, object>}}
	*/
	typedValuesTree() {
		return this.#typedValuesTree;
	}
	/**
	* Establishes every field's default on a bare instance, ahead of any decoded field landing on it.
	* @param {object} instance The freshly prototyped, unpopulated instance.
	*/
	seed(instance) {
		this.#seed(instance);
	}
	/**
	* Determines whether this codec replaces the default encode walk entirely.
	* @returns {boolean}
	*/
	hasEncodeOverride() {
		return this.#encode !== null;
	}
	/**
	* Runs this codec's encode override against an instance.
	* @param {object} instance The live instance being encoded.
	* @param {string} path The JSON path of the instance, for error context.
	* @returns {object} The plain data form.
	*/
	runEncode(instance, path) {
		return this.#encode(instance, path);
	}
	/**
	* Determines whether this codec replaces the default decode walk entirely.
	* @returns {boolean}
	*/
	hasDecodeOverride() {
		return this.#decode !== null;
	}
	/**
	* Runs this codec's decode override against plain data.
	* @param {object} data The plain data form read from the file.
	* @param {string} path The JSON path of the node, for error context.
	* @returns {object} The rebuilt instance.
	*/
	runDecode(data, path) {
		return this.#decode(data, path);
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveCodecIndex.js
/**
* The lookup the walkers use to go from a value, or from a tag in a file, to the codec describing it.
*
* {@link SerializableRegistry} keeps what each registration *said* - the raw declarations - and
* deliberately does not know what any of it means, because it lives in J-Base and the save format is
* an optional extension of it. Interpreting a declaration is this ship's job, so building codecs out
* of those declarations happens here.
*
* **The index is built lazily, on first lookup, rather than at load.** Plugins register their models
* at module scope, and several of them load *after* this one - so an index built while this file is
* being evaluated would be missing everything registered later. The first save or load happens long
* after every plugin has finished loading, which makes first-lookup the earliest moment the answer
* is complete.
*
* It rebuilds whenever the registry has grown or shrunk since the last build. That covers the two
* cases that matter: a plugin registering after the first build, and a test clearing the registry
* between cases.
*
* Note that the three lookups below refresh the index and the three accessors do not. That split is
* deliberate: an accessor that rebuilt on read would have to read its own field to decide whether to,
* which is the recursion the accessor rules exist to prevent.
*/
var SaveCodecIndex = class {
	/**
	* Codecs keyed by save id and by every alias they answer to.
	* @type {Map<string, SaveCodec>}
	*/
	static _byId = new Map();
	/**
	* Codecs keyed by the constructor function itself.
	* @type {Map<Function, SaveCodec>}
	*/
	static _byType = new Map();
	/**
	* The registry revision this index was built from, used to notice a stale one.
	*
	* Deliberately the revision rather than the registration count: a registration being *replaced*
	* leaves the count where it was, so a size check would hold a stale codec for a type someone had
	* just re-declared.
	* @type {number}
	*/
	static _builtFrom = -1;
	/**
	* Gets the codecs, keyed by save id and by every alias.
	* @returns {Map<string, SaveCodec>} The codecs by id.
	*/
	static byId() {
		return this._byId;
	}
	/**
	* Sets the codecs keyed by save id.
	* @param {Map<string, SaveCodec>} value The rebuilt index.
	*/
	static setById(value) {
		this._byId = value;
	}
	/**
	* Gets the codecs, keyed by the constructor function itself.
	* @returns {Map<Function, SaveCodec>} The codecs by type.
	*/
	static byType() {
		return this._byType;
	}
	/**
	* Sets the codecs keyed by constructor.
	* @param {Map<Function, SaveCodec>} value The rebuilt index.
	*/
	static setByType(value) {
		this._byType = value;
	}
	/**
	* Gets the registry revision the current index was built from.
	* @returns {number} The revision at build time.
	*/
	static builtFrom() {
		return this._builtFrom;
	}
	/**
	* Sets the registry revision the current index was built from.
	* @param {number} value The revision.
	*/
	static setBuiltFrom(value) {
		this._builtFrom = value;
	}
	/**
	* Rebuilds both indices when the registry no longer matches what they were built from.
	*/
	static rebuildIfStale() {
		const revision = SerializableRegistry.revision();
		if (this.builtFrom() === revision) return;
		const registrations = SerializableRegistry.registrations();
		const byId = new Map();
		const byType = new Map();
		registrations.forEach((declarations, constructor) => {
			const codec = new SaveCodec(constructor, declarations);
			byId.set(declarations.id, codec);
			declarations.aliases.forEach((alias) => byId.set(alias, codec));
			byType.set(constructor, codec);
		});
		this.setById(byId);
		this.setByType(byType);
		this.setBuiltFrom(revision);
	}
	/**
	* Gets every registered codec, keyed by constructor, with the index refreshed first.
	*
	* This is the enumeration entry point, and it exists separately from {@link #byType} because that
	* one is the bare accessor the field rules require and must not rebuild on read. Anything walking
	* the whole registry - a sweep asserting every type declares what it holds, for instance - wants
	* this, so that a type registered after the last lookup is included.
	* @returns {Map<Function, SaveCodec>} Every codec, by constructor.
	*/
	static all() {
		this.rebuildIfStale();
		return this.byType();
	}
	/**
	* Resolves a codec by the save id written into a file.
	*
	* Aliases resolve here too, which is the whole mechanism by which a class rename ships without a
	* migration: the old id keeps pointing at the codec that replaced it.
	* @param {string} id The save id read from a type tag.
	* @returns {SaveCodec|null} The resolved codec, or null when nothing is registered under that id.
	*/
	static forId(id) {
		this.rebuildIfStale();
		if (this.byId().has(id)) {
			return this.byId().get(id);
		}
		return null;
	}
	/**
	* Resolves a codec by its constructor function.
	* @param {Function} constructor The constructor to look up.
	* @returns {SaveCodec|null} The resolved codec, or null when the type is not registered.
	*/
	static forConstructor(constructor) {
		this.rebuildIfStale();
		if (this.byType().has(constructor)) {
			return this.byType().get(constructor);
		}
		return null;
	}
	/**
	* Resolves the codec describing a live value's type.
	* @param {object} value The live instance to identify.
	* @returns {SaveCodec|null} The resolved codec, or null when the type is not registered.
	*/
	static forInstance(value) {
		return this.forConstructor(value.constructor);
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveEncoder.js
/**
* Turns the live object graph into the plain data a savefile holds.
*
* The walk is type-directed rather than type-blind, which is the whole point of the exercise: the
* engine's own encoder asks every one of ~1,700 nodes what it is and stamps the answer onto it,
* whereas this one asks the *registry* what a value's constructor means and consults that type's
* declarations. The tag still gets written - see {@link #encodeInstance} - but as redundancy for a
* human reader and an integrity check, not as the mechanism.
*
* Nothing here mutates the value being encoded. That is not a stylistic preference: the engine's
* `JsonEx._encode` writes its tags back onto the live objects, which is invisible for plain shapes
* and destructive for anything whose encoded form differs from its runtime form.
*/
var SaveEncoder = class {
	/**
	* How deep the walk will follow a graph before giving up on it.
	*
	* There is no cycle detection, deliberately- the shapes being encoded are trees, and a general
	* cycle check would cost a `Set` insertion on every one of thousands of nodes to catch a bug that
	* should not exist. The ceiling is the cheap version: it turns an unreadable stack overflow into an
	* error naming the path that ran away.
	*
	* It covers the default walk only. A codec with an `encode` override re-enters {@link #encode} at
	* depth zero, so a cycle threaded through one- a `Map` holding a value that points back at the map
	* - still overflows the stack rather than reporting a path.
	* @type {number}
	*/
	static maxDepth = 100;
	/**
	* Encodes any value into its plain data form.
	* @param {*} value The value to encode.
	* @param {string=} path The JSON path of this value, used for error context.
	* @param {number=} depth How many levels down the graph this call sits.
	* @returns {*} The plain data form, safe to hand to `JSON.stringify`.
	*/
	static encode(value, path = "$", depth = 0) {
		if (depth >= this.maxDepth) throw SaveEncodeError.tooDeep(path, this.maxDepth);
		if (value === null) return value;
		const tag = Object.prototype.toString.call(value);
		if (tag === "[object Array]") {
			return value.map((element, index) => this.encode(element, `${path}[${index}]`, depth + 1));
		}
		if (tag !== "[object Object]" && tag !== "[object Map]" && tag !== "[object Set]") {
			return value;
		}
		if (tag === "[object Object]" && value.constructor === Object) {
			return this.encodePlainObject(value, null, path, depth);
		}
		return this.encodeInstance(value, path, depth);
	}
	/**
	* Encodes a class instance through its registered codec.
	* @param {object} value The instance to encode.
	* @param {string} path The JSON path of this value.
	* @param {number} depth How many levels down the graph this call sits.
	* @returns {object} The tagged plain data form.
	*/
	static encodeInstance(value, path, depth) {
		const codec = SaveCodecIndex.forInstance(value);
		if (codec === null) throw SaveEncodeError.unregisteredType(path, value.constructor.name);
		const encoded = codec.hasEncodeOverride() ? codec.runEncode(value, path) : this.encodePlainObject(value, codec, path, depth);
		encoded["@"] = codec.id();
		return encoded;
	}
	/**
	* Encodes the own enumerable keys of an object into a fresh container.
	*
	* This serves both plain objects and registered instances, because the walk is the same either
	* way- what differs is that an instance brings declarations with it. The `transientNode` argument
	* is the walker's position in those declarations, which is why the recursion carries it: a
	* transient like `_j._base._cachedAllNotes` is three plain objects deep, and the skip has to still
	* apply down there.
	* @param {object} value The object whose keys are being encoded.
	* @param {SaveCodec|null} codec The codec owning these declarations, or null for a plain object.
	* @param {string} path The JSON path of this object.
	* @param {number} depth How many levels down the graph this call sits.
	* @returns {object} A fresh plain object holding the encoded keys.
	*/
	static encodePlainObject(value, codec, path, depth) {
		const transientNode = codec === null ? null : codec.transientTree();
		return this.encodeKeys(value, codec, transientNode, path, depth);
	}
	/**
	* Encodes the own enumerable keys of an object, honoring the transient declarations in scope.
	* @param {object} value The object whose keys are being encoded.
	* @param {SaveCodec|null} codec The codec that owns the declarations, or null when none apply.
	* @param {{value: Function|null, children: Map<string, object>}|null} transientNode The walker's
	* position in the transient tree, or null when nothing below here is declared transient.
	* @param {string} path The JSON path of this object.
	* @param {number} depth How many levels down the graph this call sits.
	* @returns {object} A fresh plain object holding the encoded keys.
	*/
	static encodeKeys(value, codec, transientNode, path, depth) {
		const encoded = {};
		Object.keys(value).forEach((key) => {
			if (key === "@") return;
			const childPath = `${path}.${key}`;
			const childNode = transientNode === null ? null : transientNode.children.get(key) ?? null;
			if (childNode !== null && childNode.value !== null) return;
			const child = value[key];
			this.assertTypedFieldDeclared(child, codec, key, childPath);
			encoded[key] = this.encodeChild(child, childNode, childPath, depth);
		});
		return encoded;
	}
	/**
	* Encodes one child value, keeping the declaration walk in step with the data walk when it can.
	*
	* Note what is *not* forwarded: the codec. Declarations describe the direct keys of the instance
	* that owns them, so once the walk descends into a namespace object those keys are no longer that
	* codec's to police - only the transient waypoint travels down, because a transient path is
	* explicitly written to reach that far.
	* @param {*} child The value being encoded.
	* @param {{value: Function|null, children: Map<string, object>}|null} childNode The child's
	* position in the transient tree, or null when nothing below it is declared.
	* @param {string} childPath The JSON path of the child.
	* @param {number} depth How many levels down the graph this call sits.
	* @returns {*} The encoded child.
	*/
	static encodeChild(child, childNode, childPath, depth) {
		if (childNode === null || childNode.children.size === 0) {
			return this.encode(child, childPath, depth + 1);
		}
		if (child === null) return child;
		if (Object.prototype.toString.call(child) !== "[object Object]") return this.encode(child, childPath, depth + 1);
		if (child.constructor !== Object) return this.encode(child, childPath, depth + 1);
		return this.encodeKeys(child, null, childNode, childPath, depth + 1);
	}
	/**
	* Throws when a field holds a class instance its owner's type map never declared.
	*
	* This is a completeness check on the declaration rather than anything the decoder needs, and it
	* fires at save time on purpose: it forces every newly-added typed field to be classified by the
	* person who added it, while they still remember why it is there.
	*
	* It applies only to the direct keys of a registered class. A plain object has no declarations of
	* its own, so a class instance nested inside a namespace object is checked by nothing here- what
	* protects that case is the encoder refusing to encode an unregistered type at all.
	* @param {*} child The value held at the field.
	* @param {SaveCodec|null} codec The codec that owns the field, or null for a plain object.
	* @param {string} key The field name.
	* @param {string} childPath The JSON path of the field.
	*/
	static assertTypedFieldDeclared(child, codec, key, childPath) {
		if (codec === null) return;
		if (child === null) return;
		if (Object.prototype.toString.call(child) !== "[object Object]") return;
		if (child.constructor === Object) return;
		if (codec.typedTree().children.has(key)) return;
		if (codec.typedValuesTree().children.has(key)) return;
		throw SaveEncodeError.undeclaredTypedField(childPath, codec.id(), key, child.constructor.name);
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveDecoder.js
/**
* Rebuilds live objects out of the plain data a savefile holds.
*
* Two properties of this walk are worth understanding before changing it.
*
* **It never runs a constructor.** Instances are built with `Object.create(prototype)`, the same
* contract `JsonEx._decode` has via `setPrototypeOf`, because a constructor takes arguments a file
* does not have and does real work a load must not repeat - `Game_Actor.prototype.initialize` runs
* `setup()`. That is also why `#private` fields are banned in registered classes: a restored object
* carries the prototype without ever having been branded, so the first `this.#anything` throws.
*
* **It can rebuild a file whose tags have been stripped.** Type maps, not tags, are what the decoder
* is authoritative on; the tags are redundancy. Hand-edit a section down to bare JSON and it still
* comes back correctly, which is the difference between a save format a developer can work with and
* one they can only read.
*/
var SaveDecoder = class {
	/**
	* Decodes plain data back into live objects.
	* @param {*} data The plain data to decode.
	* @param {Function|null=} expectedType The constructor the containing type map declares here, or
	* null when nothing declared it.
	* @param {string=} path The JSON path of this value, used for error context.
	* @returns {*} The rebuilt value.
	*/
	static decode(data, expectedType = null, path = "$") {
		if (data === null) return data;
		const tag = Object.prototype.toString.call(data);
		if (tag === "[object Array]") {
			return data.map((element, index) => this.decode(element, expectedType, `${path}[${index}]`));
		}
		if (tag !== "[object Object]") return data;
		if (data["@"]) return this.decodeTagged(data, expectedType, path);
		if (expectedType !== null) return this.decodeDeclared(data, expectedType, path);
		return this.decodeKeys(data, null, null, null, path);
	}
	/**
	* Decodes a node that carries its own type tag.
	* @param {object} data The tagged plain data.
	* @param {Function|null} expectedType The constructor the containing type map declared, or null.
	* @param {string} path The JSON path of this node.
	* @returns {object} The rebuilt instance.
	*/
	static decodeTagged(data, expectedType, path) {
		const codec = SaveCodecIndex.forId(data["@"]);
		if (codec === null) throw SaveDecodeError.unknownSaveId(path, data["@"]);
		if (expectedType !== null && codec.type() !== expectedType) {
			const expectedCodec = SaveCodecIndex.forConstructor(expectedType);
			const expectedId = expectedCodec === null ? expectedType.name : expectedCodec.id();
			throw SaveDecodeError.typeMismatch(path, expectedId, codec.id());
		}
		return this.decodeWith(data, codec, path);
	}
	/**
	* Decodes an untagged node using only the constructor its position declares.
	*
	* This is the branch that makes a hand-edited file work.
	* @param {object} data The untagged plain data.
	* @param {Function} expectedType The declared constructor.
	* @param {string} path The JSON path of this node.
	* @returns {object} The rebuilt instance.
	*/
	static decodeDeclared(data, expectedType, path) {
		const codec = SaveCodecIndex.forConstructor(expectedType);
		if (codec === null) throw SaveDecodeError.unregisteredDeclaredType(path, expectedType.name);
		return this.decodeWith(data, codec, path);
	}
	/**
	* Rebuilds an instance through a resolved codec, honoring any decode override it carries.
	* @param {object} data The plain data for this node.
	* @param {SaveCodec} codec The codec describing the target type.
	* @param {string} path The JSON path of this node.
	* @returns {object} The rebuilt instance.
	*/
	static decodeWith(data, codec, path) {
		if (codec.hasDecodeOverride()) return codec.runDecode(data, path);
		const instance = Object.create(codec.type().prototype);
		codec.seed(instance);
		this.decodeKeys(data, codec, codec.typedTree(), codec.typedValuesTree(), path, instance);
		codec.transients().forEach((factory, transientPath) => this.assignAtPath(instance, transientPath, factory(instance)));
		return instance;
	}
	/**
	* Decodes every key of a plain data object onto a target, keeping the type declarations in step.
	* @param {object} data The plain data whose keys are being decoded.
	* @param {SaveCodec|null} codec The codec owning the declarations, or null for a plain object.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedNode The walker's
	* position in the type tree, or null when nothing below here is declared.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedValuesNode The walker's
	* position in the dictionary-value type tree, or null.
	* @param {string} path The JSON path of this object.
	* @param {object=} target The object to assign onto; a fresh plain object when omitted.
	* @returns {object} The target, populated.
	*/
	static decodeKeys(data, codec, typedNode, typedValuesNode, path, target = {}) {
		Object.keys(data).forEach((key) => {
			if (key === "@") return;
			const childPath = `${path}.${key}`;
			const typedChild = typedNode === null ? null : typedNode.children.get(key) ?? null;
			const typedValuesChild = typedValuesNode === null ? null : typedValuesNode.children.get(key) ?? null;
			const decoded = this.decodeChild(data[key], typedChild, typedValuesChild, childPath);
			target[key] = this.mergeOverSeeded(target[key], decoded);
		});
		return target;
	}
	/**
	* Lays a decoded value over whatever `seed` already established at the same position.
	*
	* Plain objects merge; everything else replaces. That distinction is what makes `seed` mean
	* anything below the top level of a class. Consider `_j`: the seed runs the whole `initMembers`
	* chain and builds every plugin's namespace, and then the file arrives holding a `_j` written
	* before half those plugins existed. A plain assignment would replace the complete namespace with
	* the partial one, and every plugin added since the save was written would find its own state
	* missing - which is exactly the failure `seed` exists to prevent, reintroduced one level down.
	*
	* Merging instead means the file wins wherever it has something to say and the seeded default
	* survives wherever it does not. Instances, arrays, `Map`s, and primitives replace outright, since
	* a decoded instance is already the complete answer for its position.
	* @param {*} seeded Whatever the seed left at this position, which is usually nothing.
	* @param {*} decoded The value the file produced.
	* @returns {*} The value to assign.
	*/
	static mergeOverSeeded(seeded, decoded) {
		if (this.isPlainObject(seeded) === false) return decoded;
		if (this.isPlainObject(decoded) === false) return decoded;
		Object.keys(decoded).forEach((key) => {
			seeded[key] = this.mergeOverSeeded(seeded[key], decoded[key]);
		});
		return seeded;
	}
	/**
	* Decodes one child value against whatever its position declares.
	* @param {*} child The plain data being decoded.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedChild The child's
	* position in the type tree, or null.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedValuesChild The child's
	* position in the dictionary-value type tree, or null.
	* @param {string} childPath The JSON path of the child.
	* @returns {*} The decoded child.
	*/
	static decodeChild(child, typedChild, typedValuesChild, childPath) {
		if (typedValuesChild !== null && typedValuesChild.value !== null) {
			return this.decodeDictionary(child, typedValuesChild.value, childPath);
		}
		if (typedChild !== null && typedChild.value !== null) {
			return this.decode(child, typedChild.value, childPath);
		}
		if (this.isPlainObject(child) && this.hasDeclarationsBelow(typedChild, typedValuesChild)) {
			return this.decodeKeys(child, null, typedChild, typedValuesChild, childPath);
		}
		return this.decode(child, null, childPath);
	}
	/**
	* Decodes a plain-object dictionary whose values are all instances of one declared type.
	* @param {object} data The dictionary's plain data.
	* @param {Function} valueType The constructor every value holds.
	* @param {string} path The JSON path of the dictionary.
	* @returns {object} A fresh dictionary holding the decoded values.
	*/
	static decodeDictionary(data, valueType, path) {
		const decoded = {};
		Object.keys(data).forEach((key) => {
			decoded[key] = this.decode(data[key], valueType, `${path}.${key}`);
		});
		return decoded;
	}
	/**
	* Determines whether a value is a plain object rather than an instance, array, or primitive.
	* @param {*} value The value to classify.
	* @returns {boolean}
	*/
	static isPlainObject(value) {
		if (value === null) return false;
		if (Object.prototype.toString.call(value) !== "[object Object]") return false;
		return value.constructor === Object;
	}
	/**
	* Determines whether either declaration tree still has anything to say below this point.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedChild The child's
	* position in the type tree, or null.
	* @param {{value: Function|null, children: Map<string, object>}|null} typedValuesChild The child's
	* position in the dictionary-value type tree, or null.
	* @returns {boolean}
	*/
	static hasDeclarationsBelow(typedChild, typedValuesChild) {
		if (typedChild !== null && typedChild.children.size > 0) return true;
		return typedValuesChild !== null && typedValuesChild.children.size > 0;
	}
	/**
	* Assigns a value at a dotted path on an instance, creating the namespace objects along the way.
	*
	* The waypoints are created rather than assumed because a transient may be declared deeper than
	* anything else on the instance has reason to build- a plugin namespace that only exists to hold
	* one cache, on a save written before that plugin was installed.
	* @param {object} instance The instance to assign onto.
	* @param {string} path The dotted path to assign at.
	* @param {*} value The value to assign.
	*/
	static assignAtPath(instance, path, value) {
		const segments = path.split(".");
		let node = instance;
		segments.slice(0, -1).forEach((segment) => {
			node[segment] ||= {};
			node = node[segment];
		});
		node[segments[segments.length - 1]] = value;
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveManifest.js
/**
* The index of one generation: what it holds, when it was written, and enough about the playthrough
* to draw a row in the load menu.
*
* Two jobs, and both of them are about not decoding a world you do not need:
*
* - **`sections` makes a torn write detectable.** A generation is a directory of files, and the only
*   way to know a crash did not land in the middle of it is for one file to say what the complete
*   set was. The manifest is written last for exactly this reason.
* - **`display` makes the load menu cheap.** Vanilla keeps a parallel `global.rmmzsave` holding one
*   summary per slot, which can and does drift from the slots it describes. Here the summary lives
*   *inside* the generation it summarizes, so it cannot describe a save that is not there.
*
* `display` is deliberately a superset of what vanilla's `DataManager.makeSavefileInfo` produces -
* `title`, `characters`, `faces`, `playtime`, `timestamp` - because {@link Window_SavefileList} reads
* those by name and is not being rewritten here. Everything past them is ours.
*
* The manifest is read as **plain data**, not decoded: the load menu wants five fields off a small
* JSON document, and running the decoder over it to hand back an instance would buy nothing.
*/
var SaveManifest = class SaveManifest {
	/**
	* The schema version this build writes, and the only one it can read without a migration.
	*
	* Phase 5 turns this into a chain of migrations. Until it does, a mismatch is a hard failure, which
	* is the correct behavior while saves are still disposable and the wrong one the day a player
	* exists - see the versioning phase of the save rewrite plan.
	* @type {number}
	*/
	static schemaVersion = 1;
	/**
	* The schema version this generation was written at.
	* @type {number}
	*/
	schemaVersion = SaveManifest.schemaVersion;
	/**
	* When the generation was written, as an ISO-8601 timestamp.
	* @type {string}
	*/
	savedAt = String.empty;
	/**
	* The playtime at the moment of writing, in frames.
	* @type {number}
	*/
	playtimeFrames = 0;
	/**
	* The playthrough this generation belongs to.
	*
	* A slot is a folder, and a folder is not a playthrough. Saving a new game over an old slot leaves
	* both games' generations sitting side by side, so a rollback that only counted backwards could
	* land in a game the player has no relationship to. Every generation records whose it is, and the
	* loader steps back only through generations that answer with the same id.
	*
	* Empty when the generation predates this field, which reads as "unknown" rather than "nobody".
	* @type {string}
	*/
	playthroughId = String.empty;
	/**
	* The file name of every section this generation is made of, manifest excluded.
	* @type {string[]}
	*/
	sections = [];
	/**
	* Everything the load menu draws, so it never has to open a world.
	* @type {object}
	*/
	display = {};
	/**
	* Builds the manifest for a generation about to be written.
	* @param {string[]} sections The file name of every section in the generation, manifest excluded.
	* @param {object} display Everything the load menu needs to draw this slot.
	* @param {number} playtimeFrames The playtime at the moment of writing, in frames.
	* @param {string} playthroughId The playthrough this generation belongs to.
	* @returns {SaveManifest}
	*/
	static create(sections, display, playtimeFrames, playthroughId) {
		const manifest = new SaveManifest();
		manifest.schemaVersion = SaveManifest.schemaVersion;
		manifest.savedAt = new Date().toISOString();
		manifest.playtimeFrames = playtimeFrames;
		manifest.playthroughId = playthroughId;
		manifest.sections = sections;
		manifest.display = display;
		return manifest;
	}
	/**
	* Determines whether a manifest read off disk was written at a version this build can read.
	* @param {number} schemaVersion The version the file claims.
	* @returns {boolean}
	*/
	static supportsSchemaVersion(schemaVersion) {
		return schemaVersion === SaveManifest.schemaVersion;
	}
};
/**
* Registered because the manifest is written through the encoder like everything else, which keeps
* one path to disk rather than two. The read side skips the decoder on purpose; see the class
* summary.
*/
SerializableRegistry.register(SaveManifest, {
	id: "save-manifest",
	aliases: ["SaveManifest"],
	seed: (instance) => Object.assign(instance, new SaveManifest())
});

//#endregion
//#region src/plugins/_base/ext/save/core/SaveMigrationRegistry.js
/**
* The chain of transformations that carries a slot written at an older schema version forward to the
* one this build reads.
*
* **Why this exists before there is anything for it to do.** A migration cannot be retrofitted onto a
* version that shipped without a stamp: if a build writes saves and has no notion of versioning, the
* next build has no way to tell what shape it is looking at, and the only honest options are "guess"
* or "refuse". The stamp and the seam therefore ship together, empty, and the first real migration
* drops into a mechanism that already works.
*
* Everything about a migration is deliberately narrow:
*
* - **It runs on plain data, before the decoder.** A migration is handed the parsed JSON of every
*   section plus the manifest, and hands back the same shape. It never sees an instance, because by
*   the time instances exist the seeds have run and the type maps have been consulted - both of which
*   describe the *current* schema, and neither of which can be told to pretend otherwise. Rewriting
*   the document first means everything downstream sees a generation indistinguishable from one this
*   build wrote itself.
* - **It moves exactly one version.** Registered against the version it reads, producing the next.
*   Composing two small steps is something the loader can do; splitting a large one apart later is
*   not.
* - **It is pure.** No globals, no filesystem, no `$data*`. A migration written a year from now is
*   verified by running it against a committed fixture of the old document shape, which only works if
*   the function's whole world arrives in its argument.
*
* The version stamp is applied by this registry rather than by each migration, so a step cannot
* forget to advance it - which also means the chain can never spin without making progress.
*/
var SaveMigrationRegistry = class {
	/**
	* The registered steps, keyed by the schema version each one reads.
	* @type {Map<number, Function>}
	*/
	static _migrations = new Map();
	/**
	* Gets the registered migration steps, keyed by the version each one reads.
	* @returns {Map<number, Function>} The migrations.
	*/
	static migrations() {
		return this._migrations;
	}
	/**
	* Registers the step that carries a document from one schema version to the next.
	*
	* The function receives `{ manifest, sections }` as plain data and returns the same shape. It must
	* not stamp the new version itself; this registry does that, so a step that forgets cannot exist.
	* @param {number} fromVersion The schema version this step reads.
	* @param {Function} migrate Receives `{ manifest, sections }`, returns the next version's document.
	*/
	static register(fromVersion, migrate) {
		if (this.migrations().has(fromVersion)) {
			throw new Error(`a save migration from schema version ${fromVersion} is already registered. ` + "Each version may be read by exactly one step.");
		}
		this.migrations().set(fromVersion, migrate);
	}
	/**
	* Determines whether an unbroken chain of steps leads from a version to the one this build reads.
	*
	* Asked before a generation is read rather than during, so the load menu can show a slot it will
	* be able to open and the loader can step past one it cannot.
	* @param {number} fromVersion The schema version the generation claims.
	* @returns {boolean} True when every intermediate step exists.
	*/
	static hasPathToCurrent(fromVersion) {
		if (fromVersion > SaveManifest.schemaVersion) return false;
		let version = fromVersion;
		while (version < SaveManifest.schemaVersion) {
			if (this.migrations().has(version) === false) {
				return false;
			}
			version += 1;
		}
		return true;
	}
	/**
	* Names the first version in a chain that has no step, for an error message that says what to fix.
	* @param {number} fromVersion The schema version the generation claims.
	* @returns {number} The version whose step is missing, or `0` when the chain is complete.
	*/
	static firstMissingStep(fromVersion) {
		let version = fromVersion;
		while (version < SaveManifest.schemaVersion) {
			if (this.migrations().has(version) === false) {
				return version;
			}
			version += 1;
		}
		return 0;
	}
	/**
	* Runs the chain over a document until it reads at this build's schema version.
	*
	* A document already at the current version passes through untouched, which is the overwhelmingly
	* common case and costs one comparison.
	* @param {{manifest: object, sections: Object<string, object>}} document The parsed generation.
	* @returns {{manifest: object, sections: Object<string, object>}} The document, brought forward.
	*/
	static apply(document) {
		let current = document;
		while (current.manifest.schemaVersion < SaveManifest.schemaVersion) {
			const fromVersion = current.manifest.schemaVersion;
			const migrate = this.migrations().get(fromVersion);
			current = migrate(current);
			current.manifest.schemaVersion = fromVersion + 1;
		}
		return current;
	}
	/**
	* Empties the chain.
	*
	* Registration happens once at load, at module scope, which leaves a test suite no way to arrange
	* a chain of its own without this. It exists for that and is not called by the running game.
	*/
	static reset() {
		this.migrations().clear();
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/SaveDocument.js
/**
* The single place that answers "where does `$gameScreen` go".
*
* A slot is written as several JSON documents rather than one, and something has to own the mapping
* from a top-level key of the save contents to the file it lands in. That is this. It replaces the
* flat object `DataManager.makeSaveContents` builds - ten engine keys, plus whatever plugins have
* aliased their way into it over the years.
*
* **Registration is optional and the default is to keep the data.** A key nobody registered lands in
* the fallback section rather than being dropped, because the failure modes are not symmetrical: an
* unregistered key in the wrong file is untidy, and an unregistered key in no file is a player's
* progress quietly evaporating. That is the same fail-open stance the codec layer takes on fields.
*
* `systems/<plugin>.json` does not appear here. Those files are produced by {@link SaveSectionRouter}
* from the `_j.<plugin>` slices it lifts off the hosts, not from a top-level key anyone registered.
*/
var SaveDocument = class {
	/**
	* The section a key lands in when nothing has registered it.
	*
	* The world file, rather than a file of its own, because an unregistered key is usually a plugin
	* that added a top-level key the old way and expects it back exactly as it left it.
	* @type {string}
	*/
	static fallbackSection = "world.json";
	/**
	* Which section each registered top-level key belongs to.
	* @type {Map<string, string>}
	*/
	static _sectionsByKey = new Map();
	/**
	* Gets which section each registered top-level key belongs to.
	* @returns {Map<string, string>} The sections, keyed by save-contents key.
	*/
	static sectionsByKey() {
		return this._sectionsByKey;
	}
	/**
	* Declares that a top-level key of the save contents belongs in a particular section file.
	*
	* A plugin that adds a top-level key registers it here instead of aliasing
	* `DataManager.makeSaveContents`, which is how the layout stays describable in one place.
	* @param {string} key The key as it appears on the save contents object, ex: `party`.
	* @param {string} sectionName The file it belongs in, ex: `party.json`.
	*/
	static registerKey(key, sectionName) {
		this.sectionsByKey().set(key, sectionName);
	}
	/**
	* Determines which section file a top-level key belongs in.
	* @param {string} key The key as it appears on the save contents object.
	* @returns {string} The section's file name.
	*/
	static sectionFor(key) {
		if (this.sectionsByKey().has(key)) {
			return this.sectionsByKey().get(key);
		}
		return this.fallbackSection;
	}
};
/**
* The vanilla ten, split three ways.
*
* `world.json` holds the things that describe where the player is and what the world has been told
* to do; the party and the actor roster get files of their own because they are the two documents a
* developer actually opens - "how much gold do I have", "what is this actor's level" - and burying
* them in a file with the switch table would make that worse rather than better.
*
* Followers and vehicles have no entry because they are not top-level keys: they live inside
* `player` and `map` respectively, and travel with them.
*/
SaveDocument.registerKey("system", "world.json");
SaveDocument.registerKey("screen", "world.json");
SaveDocument.registerKey("timer", "world.json");
SaveDocument.registerKey("switches", "world.json");
SaveDocument.registerKey("variables", "world.json");
SaveDocument.registerKey("selfSwitches", "world.json");
SaveDocument.registerKey("map", "world.json");
SaveDocument.registerKey("player", "world.json");
SaveDocument.registerKey("party", "party.json");
SaveDocument.registerKey("actors", "actors.json");

//#endregion
//#region src/plugins/_base/ext/save/core/SaveSectionRouter.js
/**
* Splits one slot into the files it is written as, and puts it back together on load.
*
* Two transformations happen here, and they are independent of each other:
*
* 1. **Top-level keys are grouped into sections** - `party` into `party.json`, the rest of the
*    vanilla ten into `world.json` and `actors.json` - per {@link SaveDocument}.
* 2. **`_j.<plugin>` slices are lifted off their hosts** into `systems/<plugin>.json`, keyed by
*    which host they came from, so one plugin's state is one file rather than being scattered across
*    seven objects that happened to be nearby at runtime.
*
* **Runtime homes do not change.** `$gameParty._j._omni` is still exactly where it was; only the
* file layout differs, and the codec knows both ends. No plugin needs refactoring to be reorganized.
*
* ### Why the lift happens after encoding, and the merge before decoding
*
* The lift moves subtrees out of the **encoded plain data**, never out of the live objects. Reaching
* into `$gameParty` to pull `_j._omni` off it before encoding would be mutating live state during a
* save, which is precisely the defect that made the engine's own `JsonEx._encode` dangerous.
*
* The merge is the mirror image and its ordering matters more. Slices go back into the plain data
* **before** anything is decoded, because a host's transients are re-seeded during its own decode: a
* fresh `JABS_Timer` is written to `_j._regions._skills._timer` as the last step of decoding a
* `Game_Player`. Merging a `_j._regions` slice onto the finished object afterwards would replace the
* namespace wholesale and take the freshly-seeded timer with it.
*
* ### What is not routed
*
* `$gameMap._events` is never walked, on either side. Every `_j.*` slice on a map event has a
* map-session lifetime and is dropped by the `Game_Event` codec itself, so there is nothing here to
* lift and no `events` key in a system file.
*
* ### A missing host is not an error
*
* Follower counts change, vehicles get removed, an actor leaves the roster. A slice whose host is
* gone is reported and dropped; a host with no slice keeps whatever `seed` gave it, which is the
* normal case for every plugin added since the save was written.
*/
var SaveSectionRouter = class {
	/**
	* The directory system files live in, relative to the generation root.
	* @type {string}
	*/
	static systemsDirectory = "systems/";
	/**
	* The tag written at the top of a system file, so it is identifiable on sight.
	* @type {string}
	*/
	static sectionTag = "save-section";
	/**
	* Which section file each registered `_j` namespace is lifted into, keyed by namespace.
	* @type {Map<string, string>}
	*/
	static _routedNamespaces = new Map();
	/**
	* Gets the registered `_j` namespaces and the file each is lifted into.
	* @returns {Map<string, string>} The section base names, keyed by `_j` namespace key.
	*/
	static routedNamespaces() {
		return this._routedNamespaces;
	}
	/**
	* Declares that a plugin's `_j` namespace should be lifted into a system file of its own.
	*
	* Registration is what makes this happen; an unregistered namespace simply stays inline on its
	* host and is written with it. That is deliberate on two counts. It keeps the router keyed on a
	* list of real plugins rather than on whatever `Object.keys(_j)` happens to return - four keys on
	* `_j` hold a boolean or an array rather than a namespace, and a naive router would cheerfully
	* write `systems/_textPopRequest.json` containing `false`. And it means a plugin opting in is a
	* layout change and nothing else: nothing is lost by not opting in.
	* @param {string} namespaceKey The key on `_j`, ex: `_abs`.
	* @param {string} sectionBaseName The file name without directory or extension, ex: `abs`.
	*/
	static registerNamespace(namespaceKey, sectionBaseName) {
		this.routedNamespaces().set(namespaceKey, `${this.systemsDirectory}${sectionBaseName}.json`);
	}
	/**
	* Turns a live save-contents object into the set of section files a generation is written from.
	* @param {object} contents The save contents, keyed as `DataManager.makeSaveContents` builds it.
	* @returns {Object<string, object>} The plain data of each section, keyed by file name.
	*/
	static toSections(contents) {
		const encoded = {};
		Object.keys(contents).forEach((key) => {
			encoded[key] = SaveEncoder.encode(contents[key], `$.${key}`);
		});
		const sections = this.liftSystemSlices(encoded);
		Object.keys(encoded).forEach((key) => {
			const sectionName = SaveDocument.sectionFor(key);
			sections[sectionName] ||= {};
			sections[sectionName][key] = encoded[key];
		});
		return sections;
	}
	/**
	* Moves every registered `_j` namespace out of the encoded hosts and into system files.
	* @param {Object<string, object>} encoded The encoded top-level keys, modified in place.
	* @returns {Object<string, object>} The system sections, keyed by file name.
	*/
	static liftSystemSlices(encoded) {
		const sections = {};
		const hosts = this.encodedHosts(encoded);
		this.routedNamespaces().forEach((sectionName, namespaceKey) => {
			const lifted = this.liftNamespace(hosts, namespaceKey);
			if (Object.keys(lifted).length === 0) return;
			sections[sectionName] = {
				"@": this.sectionTag,
				plugin: namespaceKey,
				hosts: lifted
			};
		});
		return sections;
	}
	/**
	* Pulls one namespace off every host that carries it.
	* @param {Object<string, object>} hosts The encoded hosts, keyed by host kind.
	* @param {string} namespaceKey The key on `_j` to lift.
	* @returns {object} The lifted slices, keyed by host kind then by host key.
	*/
	static liftNamespace(hosts, namespaceKey) {
		const lifted = {};
		Object.keys(hosts).forEach((hostKind) => {
			const members = hosts[hostKind];
			Object.keys(members).forEach((hostKey) => {
				const host = members[hostKey];
				const slice = this.namespaceOf(host, namespaceKey);
				if (slice === null) return;
				delete host._j[namespaceKey];
				lifted[hostKind] ||= {};
				lifted[hostKind][hostKey] = slice;
			});
		});
		return lifted;
	}
	/**
	* Turns a set of read section files back into one save-contents object.
	* @param {Object<string, object>} sections The plain data of each section, keyed by file name.
	* @returns {object} The decoded save contents, keyed as `DataManager.extractSaveContents` wants.
	*/
	static fromSections(sections) {
		const encoded = {};
		Object.keys(sections).filter((sectionName) => sectionName.startsWith(this.systemsDirectory) === false).forEach((sectionName) => {
			Object.assign(encoded, sections[sectionName]);
		});
		Object.keys(sections).filter((sectionName) => sectionName.startsWith(this.systemsDirectory)).forEach((sectionName) => this.placeSystemSlices(encoded, sections[sectionName]));
		const contents = {};
		Object.keys(encoded).forEach((key) => {
			contents[key] = SaveDecoder.decode(encoded[key], null, `$.${key}`);
		});
		return contents;
	}
	/**
	* Puts every slice from one system file back onto the host it came from.
	* @param {Object<string, object>} encoded The encoded top-level keys, modified in place.
	* @param {object} section The system file's plain data.
	*/
	static placeSystemSlices(encoded, section) {
		const hosts = this.encodedHosts(encoded);
		const namespaceKey = section.plugin;
		Object.keys(section.hosts).forEach((hostKind) => {
			const members = section.hosts[hostKind];
			Object.keys(members).forEach((hostKey) => {
				const host = hosts[hostKind] ? hosts[hostKind][hostKey] : undefined;
				if (!host) {
					console.warn(`[save] dropping the '${namespaceKey}' slice for ${hostKind}.${hostKey}; that host ` + "is not in this save.");
					return;
				}
				host._j ||= {};
				host._j[namespaceKey] = members[hostKey];
			});
		});
	}
	/**
	* Collects every host that can carry a `_j` namespace, keyed by kind and then by host key.
	*
	* There are seven kinds, and the one that is easy to miss is `map` itself - `$gameMap` carries
	* `_j._levelSync`, `_j._omni`, and `_j._regions`, including the only `J_Timer` in a whole save.
	* `$gameMap._events` is deliberately absent; see the class summary.
	* @param {Object<string, object>} encoded The encoded top-level keys.
	* @returns {Object<string, Object<string, object>>} The hosts, keyed by kind then by host key.
	*/
	static encodedHosts(encoded) {
		const hosts = {
			system: {},
			party: {},
			player: {},
			map: {},
			actors: {},
			followers: {},
			vehicles: {}
		};
		if (encoded.system) hosts.system.self = encoded.system;
		if (encoded.party) hosts.party.self = encoded.party;
		if (encoded.player) hosts.player.self = encoded.player;
		if (encoded.map) hosts.map.self = encoded.map;
		if (encoded.actors && encoded.actors._data) {
			encoded.actors._data.forEach((actor, index) => {
				if (actor) hosts.actors[String(index)] = actor;
			});
		}
		if (encoded.player && encoded.player._followers && encoded.player._followers._data) {
			encoded.player._followers._data.forEach((follower, index) => {
				if (follower) hosts.followers[String(index)] = follower;
			});
		}
		if (encoded.map && encoded.map._vehicles) {
			encoded.map._vehicles.forEach((vehicle, index) => {
				if (!vehicle) return;
				hosts.vehicles[vehicle._type ? vehicle._type : String(index)] = vehicle;
			});
		}
		return hosts;
	}
	/**
	* Reads one `_j` namespace off an encoded host.
	* @param {object} host The encoded host.
	* @param {string} namespaceKey The key on `_j` to read.
	* @returns {object|null} The slice, or null when this host does not carry that namespace.
	*/
	static namespaceOf(host, namespaceKey) {
		if (!host._j) return null;
		if (!host._j[namespaceKey]) return null;
		return host._j[namespaceKey];
	}
};

//#endregion
//#region src/plugins/_base/ext/save/core/registerEngineSaveCodecs.js
/**
* Every codec here describes a type J-Base does not own: two native collections, and the eighteen
* engine classes a savefile is made of.
*
* Three rules produced the declarations below, and none of them can be shortcut by reading a save:
*
* **A field is typed if the class assigns an instance to it**, not if its name sounds like it does.
* `Game_Party._actors` holds actor *ids*; `_items` / `_weapons` / `_armors` are id-to-count maps.
* Declaring any of them typed would have the decoder try to rebuild integers into actors. Every
* `typed` entry below was read out of `initialize` / `initMembers` in `project/js/rmmz_objects.js`.
*
* **A `seed` is required wherever the class sets up state in `initialize`.** The decoder never runs a
* constructor, so without one, any field an older save predates comes back `undefined` forever.
* Where the engine already has an idempotent, side-effect-free reset - `clear()` on several of these
* - that is the seed, so the default follows the engine rather than a copy of it that can drift.
*
* **Identity is explicit.** Each type gets a stable kebab-case save id plus its class name as an
* alias, so renaming an engine wrapper never touches a save, and files written by the engine's own
* `JsonEx` - which always tags with `constructor.name` - still resolve.
*/
/**
* Rebuilds a `Map` from the shape the encoder wrote.
* @param {{entries: Array}} data The encoded map.
* @param {string} path The JSON path of the node, for error context.
* @returns {Map}
*/
var decodeMap = (data, path) => new Map(data.entries.map(([key, value], index) => [SaveDecoder.decode(key, null, `${path}.entries[${index}][0]`), SaveDecoder.decode(value, null, `${path}.entries[${index}][1]`)]));
/**
* A `Map`'s real entries live in an internal slot that `Object.keys` cannot reach, so the default
* walk would faithfully encode one as `{}`. Both native collections therefore override the walk
* outright, in the same wire shape the retiring `JsonEx` override used.
*/
SerializableRegistry.register(Map, {
	id: "Map",
	encode: (value, path) => ({ entries: [...value.entries()].map(([key, entryValue], index) => [SaveEncoder.encode(key, `${path}.entries[${index}][0]`), SaveEncoder.encode(entryValue, `${path}.entries[${index}][1]`)]) }),
	decode: decodeMap
});
/**
* A `Set` has the same internal-slot problem as a `Map`, with one value per entry instead of two.
*/
SerializableRegistry.register(Set, {
	id: "Set",
	encode: (value, path) => ({ values: [...value].map((entryValue, index) => SaveEncoder.encode(entryValue, `${path}.values[${index}]`)) }),
	decode: (data, path) => new Set(data.values.map((value, index) => SaveDecoder.decode(value, null, `${path}.values[${index}]`)))
});
/**
* The engine's own reference type: it stores a data class and an id and looks the row up, rather
* than embedding a copy of it. Nothing else in the vanilla graph follows that example, which is the
* gap Phase 4's lineage work closes for refined equipment.
*/
SerializableRegistry.register(Game_Item, {
	id: "game-item",
	aliases: ["Game_Item"],
	seed: (instance) => {
		instance._dataClass = String.empty;
		instance._itemId = 0;
		instance.initMembers();
	}
});
/**
* Battle outcome flags for one action. Wholly transient in spirit but persisted by the engine, and
* `clear()` is exactly the set of defaults its constructor establishes.
*/
SerializableRegistry.register(Game_ActionResult, {
	id: "game-action-result",
	aliases: ["Game_ActionResult"],
	seed: (instance) => {
		instance.clear();
		instance.initMembers();
	}
});
/**
* Global flags and audio state. Holds no instances at all- the bgm/bgs/me fields are plain audio
* descriptors, not classes.
*/
SerializableRegistry.register(Game_System, {
	id: "game-system",
	aliases: ["Game_System"],
	seed: (instance) => {
		instance._saveEnabled = true;
		instance._menuEnabled = true;
		instance._encounterEnabled = true;
		instance._formationEnabled = true;
		instance._battleCount = 0;
		instance._winCount = 0;
		instance._escapeCount = 0;
		instance._saveCount = 0;
		instance._versionId = 0;
		instance._savefileId = 0;
		instance._framesOnSave = 0;
		instance._bgmOnSave = null;
		instance._bgsOnSave = null;
		instance._windowTone = null;
		instance._battleBgm = null;
		instance._victoryMe = null;
		instance._defeatMe = null;
		instance._savedBgm = null;
		instance._walkingBgm = null;
		instance.initMembers();
	}
});
/**
* The event-driven countdown, distinct from every `JABS_Timer` in the project.
*/
SerializableRegistry.register(Game_Timer, {
	id: "game-timer",
	aliases: ["Game_Timer"],
	seed: (instance) => {
		instance._frames = 0;
		instance._working = false;
		instance.initMembers();
	}
});
/**
* Switch values, as a sparse array indexed by switch id.
*/
SerializableRegistry.register(Game_Switches, {
	id: "game-switches",
	aliases: ["Game_Switches"],
	seed: (instance) => instance.clear()
});
/**
* Variable values, as a sparse array indexed by variable id.
*/
SerializableRegistry.register(Game_Variables, {
	id: "game-variables",
	aliases: ["Game_Variables"],
	seed: (instance) => instance.clear()
});
/**
* Self-switch values, keyed by a `mapId,eventId,letter` tuple rendered as a string.
*/
SerializableRegistry.register(Game_SelfSwitches, {
	id: "game-self-switches",
	aliases: ["Game_SelfSwitches"],
	seed: (instance) => instance.clear()
});
/**
* Screen effects. `_pictures` is a sparse array of `Game_Picture`, which is the only instance-valued
* field on the class- everything else is a tone array or a scalar.
*/
SerializableRegistry.register(Game_Screen, {
	id: "game-screen",
	aliases: ["Game_Screen"],
	typed: { _pictures: Game_Picture },
	seed: (instance) => instance.clear()
});
/**
* One picture on the screen. Held only through {@link Game_Screen}.
*/
SerializableRegistry.register(Game_Picture, {
	id: "game-picture",
	aliases: ["Game_Picture"],
	seed: (instance) => {
		instance.initBasic();
		instance.initTarget();
		instance.initTone();
		instance.initRotation();
	}
});
/**
* The actor roster. `_data` is sparse and indexed by actor id, and every entry is a live actor.
*/
SerializableRegistry.register(Game_Actors, {
	id: "game-actors",
	aliases: ["Game_Actors"],
	typed: { _data: Game_Actor },
	seed: (instance) => {
		instance._data = [];
	}
});
/**
* One actor.
*
* The five transients are J-Base's own derived caches, and every one of them is *lazy* - each reader
* is guarded by a strict `!== null` test that rebuilds on a miss. That is why the cold value is the
* whole answer here, and why it must be `null` rather than absent: a field that decodes as
* `undefined` passes that guard and hands the caller `undefined` instead of rebuilding.
*
* `_equips` holds `Game_Item`s and `_skills` holds skill *ids*; `_exp` is an id-to-number map. The
* two `_last*Skill` fields are `Game_Item`s, both assigned in `initMembers`.
*/
SerializableRegistry.register(Game_Actor, {
	id: "game-actor",
	aliases: ["Game_Actor"],
	typed: {
		_equips: Game_Item,
		_lastMenuSkill: Game_Item,
		_lastBattleSkill: Game_Item,
		_actions: Game_Action,
		_result: Game_ActionResult
	},
	transients: {
		"_j._base._cachedTraitObjects": () => null,
		"_j._base._cachedAllTraits": () => null,
		"_j._base._cachedAllNotes": () => null,
		"_j._base._cachedMaxTpBonuses": () => null,
		"_j._base._cachedHarFactor": () => null
	}
});
/**
* One queued action for a battler. Not present in a map save, but reachable from `_actions`.
*/
SerializableRegistry.register(Game_Action, {
	id: "game-action",
	aliases: ["Game_Action"],
	typed: { _item: Game_Item },
	seed: (instance) => instance.clear()
});
/**
* The party.
*
* Read the type map against the temptation to add to it: `_actors` is an array of actor **ids**, and
* `_items` / `_weapons` / `_armors` are plain id-to-count maps. `_lastItem` is the only field on the
* class that genuinely holds an instance.
*/
SerializableRegistry.register(Game_Party, {
	id: "game-party",
	aliases: ["Game_Party"],
	typed: { _lastItem: Game_Item },
	seed: (instance) => {
		instance._inBattle = false;
		instance._gold = 0;
		instance._steps = 0;
		instance._lastItem = new Game_Item();
		instance._menuActorId = 0;
		instance._targetActorId = 0;
		instance._actors = [];
		instance.initAllItems();
		instance.initMembers();
	}
});
/**
* The map.
*
* `_events` is typed even though the router never lifts `_j.*` slices off events: the events
* themselves are still persisted by the engine, and it is only the plugin state hanging from them
* that has a map-session lifetime.
*/
SerializableRegistry.register(Game_Map, {
	id: "game-map",
	aliases: ["Game_Map"],
	typed: {
		_interpreter: Game_Interpreter,
		_vehicles: Game_Vehicle,
		_events: Game_Event,
		_commonEvents: Game_CommonEvent
	},
	seed: (instance) => {
		instance._interpreter = new Game_Interpreter();
		instance._mapId = 0;
		instance._tilesetId = 0;
		instance._events = [];
		instance._commonEvents = [];
		instance._vehicles = [];
		instance._displayX = 0;
		instance._displayY = 0;
		instance._nameDisplay = true;
		instance._scrollDirection = 2;
		instance._scrollRest = 0;
		instance._scrollSpeed = 4;
		instance._parallaxName = String.empty;
		instance._parallaxZero = false;
		instance._parallaxLoopX = false;
		instance._parallaxLoopY = false;
		instance._parallaxSx = 0;
		instance._parallaxSy = 0;
		instance._parallaxX = 0;
		instance._parallaxY = 0;
		instance._battleback1Name = null;
		instance._battleback2Name = null;
		instance.createVehicles();
		instance.initMembers();
	}
});
/**
* One map event.
*
* **Everything at `_j` on an event is map-session state and is not written.** An event is rebuilt
* from scratch by `Game_Map.setupEvents` at the next map setup - and a load always reaches one,
* because J-ABS overwrites `Scene_Load.reloadMapIfUpdated` to reserve a transfer whenever JABS is
* enabled rather than only when the database version changed. So a slice hanging off an event was
* only ever being restored by accident, and restoring it is worse than dropping it: it hands the
* next session a half-dead enemy's bookkeeping instead of a fresh one.
*
* The cold value is the one the seed already established. The decoder runs `seed` before any field
* from the file lands, and the `initMembers` chain every plugin aliases is what builds `_j` - so by
* the time a transient factory runs, a complete, freshly-initialized namespace is already sitting
* there. Handing it back is the whole of the re-seed. This is the third shape a transient takes,
* alongside the lazy cache that answers with `null` and the eager cache that rebuilds itself.
*
* It has to be a transient rather than nothing at all, because `_j` on an event holds `JABS_Timer`s
* - a type deliberately left unregistered - and the encoder would refuse to write them.
*/
SerializableRegistry.register(Game_Event, {
	id: "game-event",
	aliases: ["Game_Event"],
	transients: { _j: (event) => event._j }
});
/**
* One parallel or autorun common event. Holds an interpreter while running.
*/
SerializableRegistry.register(Game_CommonEvent, {
	id: "game-common-event",
	aliases: ["Game_CommonEvent"],
	typed: { _interpreter: Game_Interpreter },
	seed: (instance) => {
		instance._commonEventId = 0;
		instance._interpreter = null;
	}
});
/**
* An event command interpreter. Nests: a `Show Choices` inside a called common event runs on a child.
*/
SerializableRegistry.register(Game_Interpreter, {
	id: "game-interpreter",
	aliases: ["Game_Interpreter"],
	typed: { _childInterpreter: Game_Interpreter },
	seed: (instance) => {
		instance._depth = 0;
		instance._branch = {};
		instance._indent = 0;
		instance._frameCount = 0;
		instance._freezeChecker = 0;
		instance.clear();
	}
});
/**
* The player character. Owns the follower collection.
*/
SerializableRegistry.register(Game_Player, {
	id: "game-player",
	aliases: ["Game_Player"],
	typed: { _followers: Game_Followers }
});
/**
* The follower collection.
*
* Its `setup()` sizes `_data` from `$gameParty.maxBattleMembers()`, which at decode time would be
* asking the throwaway party built by `createGameObjects`. The seed therefore stops short of it and
* leaves the collection empty for the file to fill.
*/
SerializableRegistry.register(Game_Followers, {
	id: "game-followers",
	aliases: ["Game_Followers"],
	typed: { _data: Game_Follower },
	seed: (instance) => {
		instance._visible = $dataSystem.optFollowers;
		instance._gathering = false;
		instance._data = [];
	}
});
/**
* One follower trailing the player.
*/
SerializableRegistry.register(Game_Follower, {
	id: "game-follower",
	aliases: ["Game_Follower"]
});
/**
* One of the three vehicles. Persisted individually because a boarded vehicle carries the player's
* position, and `refereshVehicles` only calls `refresh()` rather than rebuilding them.
*/
SerializableRegistry.register(Game_Vehicle, {
	id: "game-vehicle",
	aliases: ["Game_Vehicle"]
});

//#endregion
//#region src/plugins/_base/ext/save/objects/Game_System.js
/**
* Extends {@link #initMembers}.<br/>
* Also stamps the playthrough this game belongs to.
*/
J.BASE.EXT.SAVE.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.BASE.EXT.SAVE.Aliased.Game_System.get("initMembers").call(this);
	/**
	* The identity of the playthrough this game belongs to.
	*
	* A slot is a folder of generations, and until this existed nothing tied one generation to the
	* next beyond them sharing a folder. Start a new game, save it over an old slot, then roll that
	* generation back, and the loader would happily hand back the previous playthrough- a different
	* party, a different story position, and no indication that anything had happened.
	*
	* A new id is minted here, which is to say once per game world created. A loaded save overwrites
	* it with the one it was written under, so the id follows a playthrough rather than a session.
	* @type {string}
	*/
	this._playthroughId = J.BASE.Helpers.generateUuid();
};
/**
* Gets the identity of the playthrough this game belongs to.
* @returns {string}
*/
Game_System.prototype.playthroughId = function() {
	return this._playthroughId;
};

//#endregion
//#region src/plugins/_base/ext/save/managers/SaveFileSystem.js
/**
* The bottom of the save pipeline: everything about *files*, and nothing about what they mean.
*
* A slot is a directory holding several immutable generations and a one-line pointer naming the live
* one:
*
* ```
* save/file1/current        <- "gen-0007"
* save/file1/gen-0007/manifest.json, world.json, party.json, actors.json, systems/*.json
* save/file1/gen-0006/      <- kept for rollback
* ```
*
* **The pointer rename is the only atomic step, and it is the whole design.** A generation is written
* to a directory nothing is reading, fsynced, and only then does one `rename` make it live. A crash
* anywhere before that leaves the previous generation untouched and the partial one orphaned, which
* the next successful save prunes. Nothing here ever overwrites a file the game might still need -
* which matters more now than it did when a slot was one file, because a directory of a dozen files
* has a dozen chances to be torn.
*
* For contrast, vanilla renames the live file to `.rmmzsave_` before writing over it and then never
* reads that backup on load. The safety net existed and was connected to nothing.
*
* Every filesystem call goes through {@link StorageManager}'s `fs*` helpers rather than `require`ing
* `fs` here. That is where the engine already put them, and it means the crash-injection tests can
* make step N of a save fail by stubbing one method on a global they already stub.
*/
var SaveFileSystem = class {
	/**
	* The prefix every generation directory name starts with.
	* @type {string}
	*/
	static generationPrefix = "gen-";
	/**
	* How many digits a generation number is padded to, so a directory listing sorts lexically.
	* @type {number}
	*/
	static generationDigits = 4;
	/**
	* The file naming the live generation. One line, no newline, no ceremony.
	* @type {string}
	*/
	static pointerFileName = "current";
	/**
	* The scratch name the pointer is written to before being renamed into place.
	* @type {string}
	*/
	static pointerTempFileName = "current.tmp";
	/**
	* The file every generation must carry, listing what else it is made of.
	* @type {string}
	*/
	static manifestFileName = "manifest.json";
	/**
	* How many generations a slot keeps before the oldest are pruned.
	*
	* Three is the default because the failure mode of a bad save should be "you lost the last save",
	* never "you lost the file". Size is not a consideration; see the save rewrite plan.
	* @returns {number}
	*/
	static retainedGenerations() {
		return Math.max(1, J.BASE.EXT.SAVE.Metadata.retainedSaveGenerations);
	}
	/**
	* Gets the directory every save file lives under, with its trailing separator.
	* @returns {string}
	*/
	static saveDirectory() {
		return StorageManager.fileDirectoryPath();
	}
	/**
	* Gets the path of a scope-level document such as `config.json` or `profile.json`.
	* @param {string} fileName The document's file name, extension included.
	* @returns {string}
	*/
	static documentPath(fileName) {
		return `${this.saveDirectory()}${fileName}`;
	}
	/**
	* Gets the directory one slot lives in.
	* @param {string} slotName The slot's name, ex: `file1`.
	* @returns {string}
	*/
	static slotDirectory(slotName) {
		return `${this.saveDirectory()}${slotName}/`;
	}
	/**
	* Gets the path of the file naming a slot's live generation.
	* @param {string} slotName The slot's name.
	* @returns {string}
	*/
	static pointerPath(slotName) {
		return `${this.slotDirectory(slotName)}${this.pointerFileName}`;
	}
	/**
	* Gets the path of the scratch file the pointer is written to before the swap.
	* @param {string} slotName The slot's name.
	* @returns {string}
	*/
	static pointerTempPath(slotName) {
		return `${this.slotDirectory(slotName)}${this.pointerTempFileName}`;
	}
	/**
	* Gets the directory one generation of one slot lives in.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation's directory name, ex: `gen-0007`.
	* @returns {string}
	*/
	static generationDirectory(slotName, generationName) {
		return `${this.slotDirectory(slotName)}${generationName}/`;
	}
	/**
	* Gets the path of one section file inside one generation.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation's directory name.
	* @param {string} sectionName The section's file name, which may carry a subdirectory.
	* @returns {string}
	*/
	static sectionPath(slotName, generationName, sectionName) {
		return `${this.generationDirectory(slotName, generationName)}${sectionName}`;
	}
	/**
	* Renders a generation number as its directory name.
	* @param {number} generationNumber The generation's number.
	* @returns {string}
	*/
	static generationName(generationNumber) {
		return `${this.generationPrefix}${String(generationNumber).padStart(this.generationDigits, "0")}`;
	}
	/**
	* Reads the number back out of a generation directory name.
	* @param {string} generationName The generation's directory name.
	* @returns {number} The number, or zero when the name is not one of ours.
	*/
	static generationNumber(generationName) {
		const parsed = parseInt(generationName.slice(this.generationPrefix.length), 10);
		if (Number.isNaN(parsed)) return 0;
		return parsed;
	}
	/**
	* Reads the name of the generation a slot's pointer currently names.
	* @param {string} slotName The slot's name.
	* @returns {string} The generation directory name, or an empty string when there is no pointer.
	*/
	static currentGenerationName(slotName) {
		return this.pointerFields(slotName)[0] ?? String.empty;
	}
	/**
	* Reads which playthrough a slot currently belongs to.
	*
	* This lives in the pointer rather than in the newest manifest, and the difference matters exactly
	* when it is hardest to see. A manifest sits inside the generation it describes, so a generation
	* torn badly enough to be unloadable also takes its own identity down with it - and the moment the
	* slot cannot say whose it is, stepping back has nothing to check against and walks straight into
	* whatever playthrough happened to occupy the slot before. The pointer is the one write already
	* proven atomic, so putting the identity there means a torn generation loses its data and nothing
	* else.
	*
	* Empty for a slot written before ids existed, which reads as "unknown" rather than "nobody".
	* @param {string} slotName The slot's name.
	* @returns {string} The playthrough id, or an empty string when the pointer does not name one.
	*/
	static currentPlaythroughId(slotName) {
		return this.pointerFields(slotName)[1] ?? String.empty;
	}
	/**
	* Splits a slot's pointer into the fields it carries.
	*
	* The pointer is one line of whitespace-separated fields - the live generation, then the
	* playthrough it belongs to - so a pointer from before the second field existed still parses, and
	* still answers the question it was originally written to answer.
	* @param {string} slotName The slot's name.
	* @returns {string[]} The fields, or an empty array when the slot has no pointer.
	*/
	static pointerFields(slotName) {
		const pointer = StorageManager.fsReadFile(this.pointerPath(slotName));
		if (pointer === null) return [];
		return pointer.trim().split(/\s+/);
	}
	/**
	* Lists every generation directory a slot holds, newest first.
	*
	* This is the directory listing rather than the pointer, so it sees orphans - a generation whose
	* write crashed before the pointer swap is here, and is exactly what pruning cleans up.
	* @param {string} slotName The slot's name.
	* @returns {string[]} The generation directory names, newest first.
	*/
	static generationNames(slotName) {
		const slotDirectory = this.slotDirectory(slotName);
		if (StorageManager.fsExists(slotDirectory) === false) return [];
		return StorageManager.fsReaddir(slotDirectory).filter((entry) => entry.startsWith(this.generationPrefix)).filter((entry) => StorageManager.fsIsDirectory(`${slotDirectory}${entry}`)).sort((left, right) => this.generationNumber(right) - this.generationNumber(left));
	}
	/**
	* Builds the order a load should try generations in: the live one, then progressively older ones.
	*
	* The pointer leads even though it is usually also the newest, because the pointer is the
	* authority on which generation completed. Anything newer than it is an orphan from a write that
	* did not finish, and orphans are excluded rather than tried - a torn generation that happens to
	* parse would be worse than no generation at all.
	* @param {string} slotName The slot's name.
	* @returns {string[]} The generations to try, in order.
	*/
	static loadOrder(slotName) {
		const current = this.currentGenerationName(slotName);
		if (current === String.empty) return [];
		const currentNumber = this.generationNumber(current);
		const candidates = this.generationNames(slotName).filter((name) => this.generationNumber(name) <= currentNumber);
		const playthroughId = this.currentPlaythroughId(slotName);
		if (playthroughId === String.empty) return candidates;
		return candidates.filter((name) => {
			const claimed = this.playthroughIdAt(slotName, name);
			return claimed === String.empty || claimed === playthroughId;
		});
	}
	/**
	* Reads which playthrough a generation claims, without decoding anything.
	*
	* A generation whose manifest is missing or torn answers with nothing rather than throwing. It is
	* unloadable either way, and failing here would take down the listing that exists to route around
	* it- the caller's job is to choose what to try, not to discover what is broken.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation to ask, ex: `gen-0007`.
	* @returns {string} The playthrough id, or an empty string when it cannot be read.
	*/
	static playthroughIdAt(slotName, generationName) {
		const manifestPath = `${this.generationDirectory(slotName, generationName)}${this.manifestFileName}`;
		if (StorageManager.fsExists(manifestPath) === false) return String.empty;
		try {
			const manifest = this.readJson(manifestPath);
			return manifest.playthroughId ?? String.empty;
		} catch {
			return String.empty;
		}
	}
	/**
	* Determines whether a slot holds a save the game could load.
	* @param {string} slotName The slot's name.
	* @returns {boolean}
	*/
	static slotExists(slotName) {
		const current = this.currentGenerationName(slotName);
		if (current === String.empty) return false;
		return StorageManager.fsExists(this.generationDirectory(slotName, current));
	}
	/**
	* Writes a complete generation and makes it live.
	*
	* The sequence is the contract, and every step of it is ordered against a crash landing in the
	* middle: sections first, manifest after them so its presence means the set is complete, the
	* directory fsynced so the entries are durable, and only then the pointer swap.
	* @param {string} slotName The slot's name.
	* @param {Object<string, object>} sections The plain data of each section, keyed by file name.
	* @param {SaveManifest} manifest The manifest describing them.
	* @returns {Promise<void>} Resolves once the generation is live.
	*/
	static writeSlot(slotName, sections, manifest) {
		return new Promise((resolve, reject) => {
			try {
				this.writeGeneration(slotName, sections, manifest);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
	/**
	* Performs the whole write sequence for one generation.
	* @param {string} slotName The slot's name.
	* @param {Object<string, object>} sections The plain data of each section, keyed by file name.
	* @param {SaveManifest} manifest The manifest describing them.
	*/
	static writeGeneration(slotName, sections, manifest) {
		const orphanCutoff = this.generationNumber(this.currentGenerationName(slotName));
		const generationName = this.generationName(this.nextGenerationNumber(slotName));
		const generationDirectory = this.generationDirectory(slotName, generationName);
		StorageManager.fsMkdirRecursive(generationDirectory);
		Object.keys(sections).forEach((sectionName) => {
			this.writeJson(this.sectionPath(slotName, generationName, sectionName), sections[sectionName]);
		});
		this.writeJson(`${generationDirectory}${this.manifestFileName}`, manifest);
		StorageManager.fsSyncDirectory(generationDirectory);
		this.swapPointer(slotName, generationName, manifest.playthroughId ?? String.empty);
		this.pruneGenerations(slotName, orphanCutoff);
	}
	/**
	* Points a slot at a generation, atomically.
	*
	* Writing the name to a scratch file and renaming it over the pointer is the one step that makes a
	* torn write survivable: a rename either happened or it did not, so a crash mid-swap leaves the
	* previous generation live rather than leaving the pointer half-written and the slot unreadable.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation to make live.
	* @param {string} playthroughId The playthrough that generation belongs to.
	*/
	static swapPointer(slotName, generationName, playthroughId) {
		const temporaryPath = this.pointerTempPath(slotName);
		const pointer = playthroughId === String.empty ? generationName : `${generationName} ${playthroughId}`;
		this.writeSynced(temporaryPath, pointer);
		StorageManager.fsRename(temporaryPath, this.pointerPath(slotName));
	}
	/**
	* Picks the number the next generation gets.
	*
	* It is the highest number the directory holds plus one rather than the pointer's plus one, so an
	* orphan left by a crashed write is stepped over instead of being written into - reusing its name
	* would mean writing into a directory that already has files in it.
	* @param {string} slotName The slot's name.
	* @returns {number}
	*/
	static nextGenerationNumber(slotName) {
		const existing = this.generationNames(slotName);
		if (existing.length === 0) return 1;
		return this.generationNumber(existing[0]) + 1;
	}
	/**
	* Deletes the generations a slot no longer keeps.
	*
	* Two different things get deleted here, and conflating them was a bug worth naming. **Orphans**
	* are directories left by a write that never reached its pointer swap; they are recognized as
	* anything that appeared after the pointer this save started from, and they go regardless of the
	* retention count. **Retired** generations are real, complete ones that have simply fallen off the
	* end of the window.
	*
	* Retention counts generations rather than comparing numbers, because numbers are not dense: a
	* write that steps over an orphan leaves a gap, and a number-based window would read that gap as
	* several generations' worth of age and delete saves that are still the newest ones there are.
	* @param {string} slotName The slot's name.
	* @param {number} orphanCutoff The generation number the pointer held before this save.
	*/
	static pruneGenerations(slotName, orphanCutoff) {
		const current = this.currentGenerationName(slotName);
		if (current === String.empty) return;
		const currentNumber = this.generationNumber(current);
		const all = this.generationNames(slotName);
		const orphans = all.filter((name) => {
			const number = this.generationNumber(name);
			return number > orphanCutoff && number !== currentNumber;
		});
		const retired = all.filter((name) => this.generationNumber(name) <= currentNumber).slice(this.retainedGenerations());
		orphans.concat(retired).forEach((name) => StorageManager.fsRemoveDirectory(this.generationDirectory(slotName, name)));
	}
	/**
	* Writes one pretty-printed JSON document durably.
	*
	* Two spaces, and no attempt at compactness: the point of this format is that a developer can open
	* a savefile, read it, edit it, and load the result. Size is explicitly not a consideration.
	* @param {string} filePath The path to write to.
	* @param {*} data The plain data to serialize.
	*/
	static writeJson(filePath, data) {
		this.writeSynced(filePath, JSON.stringify(data, null, 2));
	}
	/**
	* Writes a file and does not return until the bytes are on the disk.
	*
	* `writeFileSync` returns as soon as the write is handed to the operating system, which is a
	* different thing from durable- a power loss between the two leaves a file that exists and is
	* empty. The fsync is what closes that window, and it is affordable here because a save happens
	* once every few minutes rather than once a frame.
	* @param {string} filePath The path to write to.
	* @param {string} contents The text to write.
	*/
	static writeSynced(filePath, contents) {
		const parent = this.parentDirectory(filePath);
		if (parent !== String.empty) {
			StorageManager.fsMkdirRecursive(parent);
		}
		try {
			StorageManager.fsWriteFileSynced(filePath, contents);
		} catch (error) {
			throw SaveStorageError.writeFailed(filePath, error.message);
		}
	}
	/**
	* Gets the directory portion of a path, with its trailing separator.
	*
	* Both separators are considered because the two halves of a save path come from different
	* places: the root comes from the engine's `path.join`, which on Windows produces backslashes,
	* and everything this class appends to it uses forward slashes. Node accepts the mix on every
	* platform; a parser that only knew one of them would not.
	* @param {string} filePath The path to take the parent of.
	* @returns {string} The parent directory, or an empty string when the path has no directory part.
	*/
	static parentDirectory(filePath) {
		const lastSeparator = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
		if (lastSeparator === -1) return String.empty;
		return filePath.slice(0, lastSeparator + 1);
	}
	/**
	* Reads a slot, stepping back through older generations until one loads.
	*
	* The caller supplies what to do with the sections rather than receiving them, because a
	* generation can fail in ways only the caller can see: a section that parses as JSON but does not
	* decode is just as torn as one that is missing, and both should fall back to the previous
	* generation rather than to an error. Handing the consumer in is what puts decode failures inside
	* the retry loop.
	* @param {string} slotName The slot's name.
	* @param {Function} buildFromSections Receives `(sections, manifest)` and returns the loaded value.
	* @returns {Promise<*>} Whatever `buildFromSections` returned for the newest generation that worked.
	*/
	static readSlot(slotName, buildFromSections) {
		return new Promise((resolve, reject) => {
			const order = this.loadOrder(slotName);
			if (order.length === 0) {
				reject(SaveStorageError.noGenerations(this.slotDirectory(slotName)));
				return;
			}
			const failures = [];
			const current = this.currentGenerationName(slotName);
			for (const generationName of order) {
				try {
					const loaded = this.readGeneration(slotName, generationName, buildFromSections);
					if (generationName !== current) {
						this.announceGenerationFallback(slotName, current, generationName, failures);
					}
					resolve(loaded);
					return;
				} catch (error) {
					failures.push(`${generationName}: ${error.message}`);
				}
			}
			reject(SaveStorageError.noLoadableGeneration(this.slotDirectory(slotName), failures));
		});
	}
	/**
	* Reports that a load stepped back past the generation the slot pointed at.
	*
	* The timestamp is what makes the message actionable- "an older one" tells the player nothing,
	* while the moment it was written tells them exactly how much they are about to replay.
	* @param {string} slotName The slot's name.
	* @param {string} current The generation the slot's pointer names.
	* @param {string} generationName The generation that actually loaded.
	* @param {string[]} failures Why each newer generation was passed over, newest first.
	*/
	static announceGenerationFallback(slotName, current, generationName, failures) {
		const savedAt = this.savedAtOf(slotName, generationName);
		console.warn(`[save] ${slotName}: ${current} could not be loaded, so ${generationName} (saved ${savedAt}) ` + "was loaded instead. Anything after that point is not in this file.");
		failures.forEach((failure) => console.warn(`[save] ${slotName}: skipped ${failure}`));
	}
	/**
	* Reads when a generation was written, for reporting rather than for logic.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation to ask, ex: `gen-0007`.
	* @returns {string} The ISO-8601 timestamp, or `an unknown time` when it cannot be read.
	*/
	static savedAtOf(slotName, generationName) {
		const manifestPath = `${this.generationDirectory(slotName, generationName)}${this.manifestFileName}`;
		try {
			return this.readJson(manifestPath).savedAt;
		} catch {
			return "an unknown time";
		}
	}
	/**
	* Reads and verifies one generation, then hands its sections to the caller.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation to read.
	* @param {Function} buildFromSections Receives `(sections, manifest)` and returns the loaded value.
	* @returns {*} Whatever `buildFromSections` returned.
	*/
	static readGeneration(slotName, generationName, buildFromSections) {
		const manifest = this.readManifestAt(slotName, generationName);
		const sections = {};
		manifest.sections.forEach((sectionName) => {
			sections[sectionName] = this.readJson(this.sectionPath(slotName, generationName, sectionName));
		});
		const migrated = SaveMigrationRegistry.apply({
			manifest,
			sections
		});
		return buildFromSections(migrated.sections, migrated.manifest);
	}
	/**
	* Reads the manifest of one generation and verifies this build can understand it.
	* @param {string} slotName The slot's name.
	* @param {string} generationName The generation to read the manifest of.
	* @returns {object} The manifest, as plain data.
	*/
	static readManifestAt(slotName, generationName) {
		const manifestPath = `${this.generationDirectory(slotName, generationName)}${this.manifestFileName}`;
		const manifest = this.readJson(manifestPath);
		const understood = SaveManifest.supportsSchemaVersion(manifest.schemaVersion) || SaveMigrationRegistry.hasPathToCurrent(manifest.schemaVersion);
		if (understood === false) {
			throw SaveStorageError.unsupportedSchemaVersion(manifestPath, manifest.schemaVersion, SaveManifest.schemaVersion, SaveMigrationRegistry.firstMissingStep(manifest.schemaVersion));
		}
		return manifest;
	}
	/**
	* Reads the manifest of the newest generation that has one, for the load menu.
	*
	* This is the cheap path, and it is cheap on purpose: drawing a row of the load menu opens one
	* small JSON document and never touches a world.
	* @param {string} slotName The slot's name.
	* @returns {object|null} The manifest as plain data, or null when the slot has nothing readable.
	*/
	static readManifest(slotName) {
		const order = this.loadOrder(slotName);
		let manifest = null;
		order.some((generationName) => {
			try {
				manifest = this.readManifestAt(slotName, generationName);
				return true;
			} catch {
				return false;
			}
		});
		return manifest;
	}
	/**
	* Reads one JSON file, failing loudly about which file and why when it cannot.
	* @param {string} filePath The path to read.
	* @returns {object} The parsed plain data.
	*/
	static readJson(filePath) {
		const contents = StorageManager.fsReadFile(filePath);
		if (contents === null) throw SaveStorageError.missingSection(filePath);
		try {
			return JSON.parse(contents);
		} catch (error) {
			throw SaveStorageError.malformedSection(filePath, error.message);
		}
	}
	/**
	* Writes a scope-level document - `config.json`, `profile.json` - atomically.
	*
	* A single document does not need generations; it needs the same rename that makes a generation
	* swap safe, so a crash mid-write cannot leave the player's settings half-written.
	* @param {string} fileName The document's file name.
	* @param {*} data The plain data to write.
	* @returns {Promise<void>} Resolves once the document is on disk.
	*/
	static writeDocument(fileName, data) {
		return new Promise((resolve, reject) => {
			try {
				const filePath = this.documentPath(fileName);
				const temporaryPath = `${filePath}.tmp`;
				this.writeJson(temporaryPath, data);
				StorageManager.fsRename(temporaryPath, filePath);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
	/**
	* Reads a scope-level document.
	* @param {string} fileName The document's file name.
	* @returns {Promise<object|null>} The parsed data, or null when the document does not exist yet.
	*/
	static readDocument(fileName) {
		return new Promise((resolve, reject) => {
			const filePath = this.documentPath(fileName);
			if (StorageManager.fsExists(filePath) === false) {
				resolve(null);
				return;
			}
			try {
				resolve(this.readJson(filePath));
			} catch (error) {
				reject(error);
			}
		});
	}
	/**
	* Deletes a slot and everything in it.
	* @param {string} slotName The slot's name.
	*/
	static removeSlot(slotName) {
		StorageManager.fsRemoveDirectory(this.slotDirectory(slotName));
	}
};

//#endregion
//#region src/plugins/_base/ext/save/managers/StorageManager.js
/**
* The save pipeline, replaced end to end.
*
* Vanilla's pipeline is `JsonEx.stringify` into `pako.deflate` into one `.rmmzsave` file, and back.
* This one encodes through per-type codecs, writes pretty-printed JSON into a directory of sections,
* and swaps a pointer to make the result live. What the engine calls is unchanged - `saveObject`,
* `loadObject`, `exists`, `remove` - so `DataManager` and `ConfigManager` keep their shape and the
* scenes above them notice nothing.
*
* **The `localforage` branch is gone rather than abstracted.** `Utils.isLocalMode()` is always true
* here: this is an NW.js project, external file loading does not work in a browser context, and a
* second storage backend nobody can reach is a second thing to keep correct. Do not reintroduce it
* "just in case".
*
* **The `pako` branch is gone too.** A savefile being readable by a human is the point of the
* rewrite, and compression is the one thing that cannot coexist with it. Size is explicitly a
* non-goal; see the save rewrite plan.
*
* Two shapes of thing get saved, and they are told apart by name rather than by a flag:
*
* - a **slot** - `file1`, `file2` - is a playthrough, and is written as a generation directory.
* - a **document** - `config` - is smaller than a slot and has no history worth keeping, so it is
*   one pretty-printed file swapped atomically into place.
*/
/**
* Determines whether a path exists at all, file or directory.
* @param {string} path The path to test.
* @returns {boolean}
*/
StorageManager.fsExists = function(path) {
	const fs = __require("fs");
	return fs.existsSync(path);
};
/**
* Determines whether a path is a directory.
* @param {string} path The path to test.
* @returns {boolean}
*/
StorageManager.fsIsDirectory = function(path) {
	const fs = __require("fs");
	return fs.statSync(path).isDirectory();
};
/**
* Creates a directory and every missing directory above it.
*
* The engine's own `fsMkdir` is one level deep, which was enough when every save was a file in one
* flat directory. A slot is now `save/file1/gen-0007/systems/`, so the recursive form is what this
* needs.
* @param {string} path The directory to create.
*/
StorageManager.fsMkdirRecursive = function(path) {
	const fs = __require("fs");
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
};
/**
* Lists the entries of a directory.
* @param {string} path The directory to list.
* @returns {string[]} The entry names, without their directory.
*/
StorageManager.fsReaddir = function(path) {
	const fs = __require("fs");
	return fs.readdirSync(path);
};
/**
* Writes a file and does not return until the bytes have reached the disk.
*
* `writeFileSync` hands the write to the operating system and returns; a power loss in the window
* that opens leaves a file that exists and is empty. The explicit fsync closes it, which a save
* system that promises "it always works" cannot do without.
* @param {string} path The file to write.
* @param {string} contents The text to write.
*/
StorageManager.fsWriteFileSynced = function(path, contents) {
	const fs = __require("fs");
	const descriptor = fs.openSync(path, "w");
	try {
		fs.writeSync(descriptor, contents);
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
};
/**
* Flushes a directory's own entries to disk, best-effort.
*
* Syncing the *files* makes their contents durable; syncing the *directory* is what makes the fact
* that they exist durable. Both matter for a generation, because a crash could otherwise leave a
* directory the filesystem has not finished admitting the files into.
*
* It is best-effort because Windows refuses to open a directory as a file at all, and CA ships on
* Windows. Losing this step costs a little durability on one platform; treating it as fatal would
* cost every save on that platform. The pointer rename is what carries atomicity regardless.
* @param {string} path The directory to flush.
*/
StorageManager.fsSyncDirectory = function(path) {
	const fs = __require("fs");
	try {
		const descriptor = fs.openSync(path, "r");
		try {
			fs.fsyncSync(descriptor);
		} finally {
			fs.closeSync(descriptor);
		}
	} catch {}
};
/**
* Deletes a directory and everything inside it.
* @param {string} path The directory to delete.
*/
StorageManager.fsRemoveDirectory = function(path) {
	const fs = __require("fs");
	if (fs.existsSync(path)) {
		fs.rmSync(path, {
			recursive: true,
			force: true
		});
	}
};
/**
* Determines whether a save name refers to a playthrough slot rather than a scope-level document.
*
* `DataManager.makeSavename` builds these as `file` followed by the slot number, and that shape is
* the whole test. Anything else - `config` today, `profile` tomorrow - is a document.
* @param {string} saveName The name the engine asked for.
* @returns {boolean}
*/
StorageManager.isSlotName = function(saveName) {
	return /^file\d+$/.test(saveName);
};
/**
* Gets the file name a scope-level document is written as.
* @param {string} saveName The name the engine asked for, ex: `config`.
* @returns {string}
*/
StorageManager.documentFileName = function(saveName) {
	return `${saveName}.json`;
};
/**
* Overwrites {@link StorageManager.saveObject}.<br/>
* Writes through the codec pipeline instead of `JsonEx` and `pako`.
* @param {string} saveName The name to save under.
* @param {object} object The live object graph to persist.
* @returns {Promise<void>}
*/
StorageManager.saveObject = function(saveName, object) {
	if (this.isSlotName(saveName)) return this.saveSlot(saveName, object);
	return this.saveDocument(saveName, object);
};
/**
* Overwrites {@link StorageManager.loadObject}.<br/>
* Reads through the codec pipeline instead of `pako` and `JsonEx`.
* @param {string} saveName The name to load.
* @returns {Promise<object|null>}
*/
StorageManager.loadObject = function(saveName) {
	if (this.isSlotName(saveName)) return this.loadSlot(saveName);
	return this.loadDocument(saveName);
};
/**
* Writes one playthrough slot as a new generation.
* @param {string} saveName The slot's name.
* @param {object} contents The save contents, as `DataManager.makeSaveContents` builds them.
* @returns {Promise<void>}
*/
StorageManager.saveSlot = function(saveName, contents) {
	const sections = SaveSectionRouter.toSections(contents);
	const manifest = SaveManifest.create(Object.keys(sections), DataManager.makeSavefileInfo(), Graphics.frameCount, $gameSystem.playthroughId());
	return SaveFileSystem.writeSlot(saveName, sections, SaveEncoder.encode(manifest, "$.manifest"));
};
/**
* Reads one playthrough slot, falling back through older generations as needed.
* @param {string} saveName The slot's name.
* @returns {Promise<object>} The save contents, ready for `DataManager.extractSaveContents`.
*/
StorageManager.loadSlot = function(saveName) {
	return SaveFileSystem.readSlot(saveName, (sections) => SaveSectionRouter.fromSections(sections));
};
/**
* Writes one scope-level document.
* @param {string} saveName The document's name, ex: `config`.
* @param {object} object The data to persist.
* @returns {Promise<void>}
*/
StorageManager.saveDocument = function(saveName, object) {
	return SaveFileSystem.writeDocument(this.documentFileName(saveName), SaveEncoder.encode(object, `$.${saveName}`));
};
/**
* Reads one scope-level document.
* @param {string} saveName The document's name.
* @returns {Promise<object|null>} The data, or null on a fresh install where the file is absent.
*/
StorageManager.loadDocument = function(saveName) {
	return SaveFileSystem.readDocument(this.documentFileName(saveName)).then((data) => {
		if (data === null) return null;
		return SaveDecoder.decode(data, null, `$.${saveName}`);
	});
};
/**
* Overwrites {@link StorageManager.exists}.<br/>
* @param {string} saveName The name to test.
* @returns {boolean}
*/
StorageManager.exists = function(saveName) {
	if (this.isSlotName(saveName)) return SaveFileSystem.slotExists(saveName);
	return this.fsExists(SaveFileSystem.documentPath(this.documentFileName(saveName)));
};
/**
* Overwrites {@link StorageManager.remove}.<br/>
* @param {string} saveName The name to delete.
*/
StorageManager.remove = function(saveName) {
	if (this.isSlotName(saveName)) {
		SaveFileSystem.removeSlot(saveName);
		return;
	}
	this.fsUnlink(SaveFileSystem.documentPath(this.documentFileName(saveName)));
};
/**
* Overwrites {@link StorageManager.filePath}.<br/>
* Answers with the slot directory or the document file, whichever the name refers to.
* @param {string} saveName The name to resolve.
* @returns {string}
*/
StorageManager.filePath = function(saveName) {
	if (this.isSlotName(saveName)) return SaveFileSystem.slotDirectory(saveName);
	return SaveFileSystem.documentPath(this.documentFileName(saveName));
};

//#endregion
//#region src/plugins/_base/ext/save/managers/ConfigManager.js
/**
* Installation scope: the settings that belong to the person playing rather than to a playthrough.
*
* Vanilla `ConfigManager` has seven fields, no way for a plugin to add an eighth, and writes them to
* `config.rmmzsave`. The second of those is why keybinds ended up at
* `$gameSystem._j._abs._input._mappings` - installation data trapped in slot scope, where rebinding
* a key in one save leaves every other save on the old bindings and deleting a save loses them.
*
* The registration seam below is the eighth field, generalized: a plugin declares what it wants kept
* at installation scope and what that setting defaults to, and the two halves of the config document
* pick it up automatically. The file itself moved to `config.json` with everything else, which
* {@link StorageManager} handles by name - nothing here knows what a file is.
*/
/**
* The over-arching object containing all of my added parameters.
*/
ConfigManager._j ||= {};
/**
* Every plugin-registered field, mapped to the factory producing its default.
* @type {Map<string, Function>}
*/
ConfigManager._j._registeredFields = new Map();
/**
* Gets every plugin-registered field and the factory producing its default.
* @returns {Map<string, Function>} The fields, keyed by name.
*/
ConfigManager.registeredFields = function() {
	return this._j._registeredFields;
};
/**
* Declares a setting that belongs to the installation rather than to a save.
*
* The default is a factory rather than a value because a setting is frequently an object or an
* array, and one shared instance handed out as "the default" would be mutated by the first thing
* that touched it.
*
* The field is seeded immediately, so it reads correctly between the plugin loading and the config
* document being read off disk.
* @param {string} key The field name, which is also the key it is written under.
* @param {Function} defaultValueFactory Produces the value the field holds on a fresh install.
*/
ConfigManager.registerField = function(key, defaultValueFactory) {
	this.registeredFields().set(key, defaultValueFactory);
	this[key] = defaultValueFactory();
};
/**
* Extends {@link #makeData}.<br/>
* Also writes every plugin-registered field into the config document.
* @returns {object} The config data, extended.
*/
J.BASE.EXT.SAVE.Aliased.ConfigManager.set("makeData", ConfigManager.makeData);
ConfigManager.makeData = function() {
	const config = J.BASE.EXT.SAVE.Aliased.ConfigManager.get("makeData").call(this);
	this.registeredFields().forEach((defaultValueFactory, key) => {
		config[key] = this[key];
	});
	return config;
};
/**
* Extends {@link #applyData}.<br/>
* Also reads every plugin-registered field back out of the config document.
*
* A field the document does not carry is reset to its default rather than left as whatever the last
* session put there. That is the same re-seed rule the save codecs follow, and for the same reason:
* a setting that is absent from the file has no value, and "no value" has to mean the default rather
* than a leftover.
* @param {object} config The config data read from disk.
*/
J.BASE.EXT.SAVE.Aliased.ConfigManager.set("applyData", ConfigManager.applyData);
ConfigManager.applyData = function(config) {
	J.BASE.EXT.SAVE.Aliased.ConfigManager.get("applyData").call(this, config);
	this.registeredFields().forEach((defaultValueFactory, key) => {
		this[key] = key in config ? config[key] : defaultValueFactory();
	});
};

//#endregion
//#region src/plugins/_base/ext/save/managers/ProfileManager.js
/**
* Profile scope: anything that outlives a single playthrough without being a machine setting.
*
* Three lifetimes exist, and until now the engine only had two of them. Installation scope is
* {@link ConfigManager} - volume, keybinds, window preferences, the things that belong to this copy
* of the game. Slot scope is a playthrough. Profile scope is the gap between them: a record of what
* this player has done across every playthrough, which survives deleting all their saves.
*
* **Nothing populates it yet, on purpose.** What belongs at this scope - a bestiary that remembers
* across runs, a new-game-plus unlock, a "you have finished this once" flag - is content design, not
* plumbing, and inventing entries here would be guessing at decisions nobody has made. This is the
* seam, ready for the first thing that needs it.
*
* The shape deliberately mirrors {@link ConfigManager}: register a field with a default factory, and
* the document takes care of itself. A plugin that understands one understands the other.
*/
var ProfileManager = class {
	/**
	* The file the profile document is written as.
	* @type {string}
	*/
	static fileName = "profile.json";
	/**
	* Every registered field, mapped to the factory producing its default.
	* @type {Map<string, Function>}
	*/
	static _registeredFields = new Map();
	/**
	* The live value of every registered field.
	* @type {Map<string, *>}
	*/
	static _values = new Map();
	/**
	* Whether the profile document has been read yet this session.
	* @type {boolean}
	*/
	static _loaded = false;
	/**
	* Gets every registered field and the factory producing its default.
	* @returns {Map<string, Function>} The fields, keyed by name.
	*/
	static registeredFields() {
		return this._registeredFields;
	}
	/**
	* Gets the live value of every registered field.
	* @returns {Map<string, *>} The values, keyed by field name.
	*/
	static values() {
		return this._values;
	}
	/**
	* Declares a value that belongs to the player's profile rather than to one playthrough.
	*
	* The default is a factory for the same reason it is on {@link ConfigManager.registerField}: a
	* shared mutable default is a bug waiting for its first writer.
	* @param {string} key The field name, which is also the key it is written under.
	* @param {Function} defaultValueFactory Produces the value the field holds on a fresh install.
	*/
	static registerField(key, defaultValueFactory) {
		this.registeredFields().set(key, defaultValueFactory);
		this.values().set(key, defaultValueFactory());
	}
	/**
	* Gets the current value of a registered field.
	* @param {string} key The field name.
	* @returns {*} The value.
	*/
	static get(key) {
		return this.values().get(key);
	}
	/**
	* Sets the value of a registered field. Writing the document is the caller's decision.
	* @param {string} key The field name.
	* @param {*} value The value to hold.
	*/
	static set(key, value) {
		this.values().set(key, value);
	}
	/**
	* Determines whether the profile document has been read this session.
	* @returns {boolean}
	*/
	static isLoaded() {
		return this._loaded;
	}
	/**
	* Builds the plain data the profile document is written from.
	* @returns {object}
	*/
	static makeData() {
		const data = {};
		this.values().forEach((value, key) => {
			data[key] = value;
		});
		return data;
	}
	/**
	* Applies a read profile document, defaulting anything it does not carry.
	* @param {object} data The profile data read from disk.
	*/
	static applyData(data) {
		this.registeredFields().forEach((defaultValueFactory, key) => {
			this.values().set(key, key in data ? data[key] : defaultValueFactory());
		});
	}
	/**
	* Reads the profile document.
	*
	* A fresh install has no document, which is a value rather than a failure: every field is already
	* sitting at the default its registration seeded.
	*/
	static load() {
		SaveFileSystem.readDocument(this.fileName).then((data) => {
			if (data !== null) {
				this.applyData(SaveDecoder.decode(data, null, "$.profile"));
			}
			this._loaded = true;
			return 0;
		}).catch(() => {
			this._loaded = true;
			return 0;
		});
	}
	/**
	* Writes the profile document.
	* @returns {Promise<void>}
	*/
	static save() {
		return SaveFileSystem.writeDocument(this.fileName, SaveEncoder.encode(this.makeData(), "$.profile"));
	}
};

//#endregion
//#region src/plugins/_base/ext/save/managers/DataManager.js
/**
* Extends {@link #makeSavefileInfo}.<br/>
* Also describes the playthrough well enough that a load menu never has to open a world.
*
* The vanilla five - title, characters, faces, playtime, timestamp - stay exactly as they are,
* because {@link Window_SavefileList} reads them by name. Everything added here is what a save menu
* worth looking at would want to show, and it costs nothing: this object is written into the
* generation's manifest, which is the one file the load menu reads.
* @returns {object} The savefile info, extended.
*/
J.BASE.EXT.SAVE.Aliased.DataManager.set("makeSavefileInfo", DataManager.makeSavefileInfo);
DataManager.makeSavefileInfo = function() {
	const info = J.BASE.EXT.SAVE.Aliased.DataManager.get("makeSavefileInfo").call(this);
	const leader = $gameParty.leader();
	info.mapName = this.savefileMapName();
	info.leaderName = leader.name();
	info.level = leader.level;
	info.gold = $gameParty.gold();
	info.party = $gameParty.allMembers().map((member) => member.actorId());
	return info;
};
/**
* Gets the name of the map the player is standing on, for a savefile's summary.
*
* The display name is preferred because it is the name the player has actually seen; the editor's
* name for the map is the fallback for the many maps that have no display name set.
* @returns {string}
*/
DataManager.savefileMapName = function() {
	const displayName = $gameMap.displayName();
	if (displayName !== String.empty) return displayName;
	return $dataMapInfos[$gameMap.mapId()].name;
};
/**
* Overwrites {@link #loadGlobalInfo}.<br/>
* Builds the savefile index by reading each slot's manifest instead of a parallel index file.
*
* Vanilla keeps `global.rmmzsave`, a second document listing what every slot holds, and it can drift
* from the slots themselves - it is written after the save it describes, so a crash between the two
* leaves the menu describing a save that is not there, or hiding one that is. Here each generation
* carries its own summary, so the index is derived rather than stored and cannot disagree with the
* thing it indexes.
*/
DataManager.loadGlobalInfo = function() {
	const globalInfo = [];
	for (let savefileId = 1; savefileId <= this.maxSavefiles(); savefileId++) {
		const manifest = SaveFileSystem.readManifest(this.makeSavename(savefileId));
		if (manifest === null) continue;
		globalInfo[savefileId] = manifest.display;
	}
	this._globalInfo = globalInfo;
};
/**
* Overwrites {@link #saveGlobalInfo}.<br/>
* Does nothing, because the index is derived from the manifests rather than written beside them.
*
* The in-memory `_globalInfo` the engine updates after a save is still correct for this session;
* the next boot rebuilds it from the manifests. Deliberately kept as a no-op rather than deleted,
* since the engine calls it from {@link #saveGame}.
*/
DataManager.saveGlobalInfo = function() {};

//#endregion
//#region src/plugins/_base/ext/save/scenes/Scene_Boot.js
/**
* Extends {@link #loadPlayerData}.<br/>
* Also reads the profile document, alongside the config and the savefile index.
*/
J.BASE.EXT.SAVE.Aliased.Scene_Boot.set("loadPlayerData", Scene_Boot.prototype.loadPlayerData);
Scene_Boot.prototype.loadPlayerData = function() {
	J.BASE.EXT.SAVE.Aliased.Scene_Boot.get("loadPlayerData").call(this);
	ProfileManager.load();
};
/**
* Extends {@link #isPlayerDataLoaded}.<br/>
* Also waits on the profile document before the boot sequence proceeds.
* @returns {boolean}
*/
J.BASE.EXT.SAVE.Aliased.Scene_Boot.set("isPlayerDataLoaded", Scene_Boot.prototype.isPlayerDataLoaded);
Scene_Boot.prototype.isPlayerDataLoaded = function() {
	const loaded = J.BASE.EXT.SAVE.Aliased.Scene_Boot.get("isPlayerDataLoaded").call(this);
	return loaded && ProfileManager.isLoaded();
};

//#endregion
//# sourceMappingURL=J-Base-Save.js.map