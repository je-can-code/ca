//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.4.0 JAFTING-REFINE] An extension for JAFTING to enable equip refinement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the "refine" functionality of JAFTING.
 * The "refine" functionality is basically a trait transferrence system with
 * some guardrails in-place.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-JAFTING; the core that this engine hooks into to enable upgrading.
 *
 * NOTE ABOUT INGREDIENT TYPES
 * Stack-counted armor and weapon rows (one list row per stack) read type ids
 * from J-JAFTING core ("Material armor type id" / "Material weapon type id").
 * Use -1 on either parameter to disable; 0 remains a valid database type id.
 *
 * ============================================================================
 * UPGRADING
 * Ever want to upgrade your equips by sacrificing others in the name of
 * ascending to godliness? Well now you can! By using a variety of tags placed
 * deliberately on your equips throughout the database, you too can have a
 * dynamic and powerful upgrading system for equipment.
 *
 * HOW DOES IT WORK?
 * This is an extension of the JAFTING plugin to enable the ability to "refine"
 * equipment. "Refinement" is defined as "transfering the traits of one item
 * onto another". It is also important to note that "transferable traits" are
 * defined as "all traits on an equip in the database that are below the
 * divider".
 *
 * NOTE ABOUT THE DIVIDER
 * The "divider" is another trait: 'Collapse Effect'. It doesn't matter which
 * option you select in the dropdown for this (for now). Traits that are above
 * the "divider" are considered "passive" traits that cannot be transfered.
 *
 * NOTE ABOUT TRAIT REMOVAL
 * This plugin does not handle trait removal, so do keep that in mind.
 *
 * This functionality's exclusive target is equipment. The most common use case
 * for this type of plugin is to repeatedly upgrade a weapon or armor of a
 * given type with new/improved traits, allowing the player to keep their
 * equipment relevant longer (or hang onto stuff for sentimental reasons, I
 * guess). It works in tandem with a basic crafting system (the JAFTING base
 * system) to allow you, the RM dev, to come up with fun ways to allow not only
 * you, but the player as well, to flex creativity by using recipes to make
 * stuff, then using refinement to upgrade it. With a wide variety of traits
 * spread across various equipment, combined with the notetags below, this
 * extension on JAFTING can make for some interesting situations in-game (good
 * and bad).
 * ============================================================================
 * MENU MANAGEMENT
 * In order to enable or disable menu access for this plugin, you can use the
 * plugin parameter that identifies the switch and toggle that in-editor. The
 * enabling of the menu option for refinement will match the state of the
 * switch in the plugin parameters.
 *
 * ============================================================================
 * TAGS
 * Obviously, being able to willy nilly refine any equips with any equips could
 * be volatile for the RM dev being able to keep control on what the player
 * should be doing (such as refining a unique equipment onto another and there
 * by losing said unique equipment that could've been required for story!).
 *
 * TAG USAGE
 * - Weapons
 * - Armors
 *
 * ----------------------------------------------------------------------------
 * DISABLE REFINEMENT
 * Placing this tag onto equipment renders it unavailable to be refined at all.
 * That means it simply won't show up in the refinement menu's equip lists.
 *
 * TAG FORMAT
 *  <noRefine>
 *
 * ----------------------------------------------------------------------------
 * DISALLOW USING AS A "BASE"
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a base equip to refine. This most commonly would be used by
 * perhaps some kind of "fragile" types of equipment, or for equipment you
 * designed explicitly as a material.
 *
 * TAG FORMAT
 *  <notRefinementBase>
 *
 * ----------------------------------------------------------------------------
 * DISALLOW USING AS A "MATERIAL"
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a material equip to refine onto the base. This most commonly would
 * be used for preventing the player from sacrificing an equipment that is
 * required for story purposes.
 *
 * TAG FORMAT
 *  <notRefinementMaterial>
 *
 * ----------------------------------------------------------------------------
 * MAXIMUM REFINEMENT COUNT
 * Where NUM is a number that represents how many times this can be refined.
 * Placing this tag onto equipment means it can only be used as a base for
 * refinement NUM number of times.
 *
 * TAG FORMAT
 *  <maxRefineCount:NUM>
 *
 * TAG EXAMPLES
 *  <maxRefineCount:3>
 * An equip with this can only be used as a "base" for refinement 3 times
 * OR
 * An equip can only achieve be fused to or beyond +3 once
 * (whichever comes first)
 *
 * NOTE ABOUT LIMITS
 * While the refinement count may be fixed, you can still refine equips beyond
 * their limits by leveraging already-refined equipment as the material. The
 * system will allow fusing something if there are still refinement counts
 * available, even if the material has +8 when there is only 1 count left.
 *
 * ----------------------------------------------------------------------------
 * MAXIMUM TRAITS PER EQUIP
 * Where NUM is a number that represents how many combined traits it can have.
 * Placing this tag onto equipment means it can only be used as a base as long
 * as the number of combined trait slots (see the screen while refining) is
 * lesser than or equal to NUM. This most commonly would be used to prevent
 * the player from adding an unreasonable number of traits onto an equip.
 *
 * TAG FORMAT
 *  <maxTraitCount:NUM>
 *
 * TAG EXAMPLES
 *  <maxTraitCount:3>
 * An equip with this can only have a total of 3 unique traits.
 *
 * NOTE ABOUT LIMITS
 * Attempting to fuse beyond the max will not be allowed, even if there are
 * additional refinement counts available. However, traits will intelligently
 * stack if they are the same, and powering up existing traits will still be
 * allowed.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.4.0
 *    A refinement now costs the base exactly one count, whatever the donor had
 *    accumulated. Previously a donor's own history was added to the output and
 *    charged against the base's ceiling, which meant a fully-refined weapon
 *    could not be spent on anything - the pairing was barred before it could be
 *    offered. A maxed donor hands over everything it gathered for the price of a
 *    single count, which is what makes building one worth doing.
 *    The refine-count ceiling no longer consults the donor either, so the case
 *    that used to read as an unexplained refusal now simply projects one more
 *    than the base has spent.
 *    Added the transferrableEffectsBelow note tag, the note-side counterpart to
 *    the divider trait. Everything above it describes what an equip is and never
 *    leaves it; everything below is what a donor hands over when consumed. An
 *    equip without the tag offers no note effects at all - the absence means
 *    nothing transfers rather than everything does, which is what keeps an
 *    equip's own identity from being launderable.
 *    Note effects now merge on refinement, where previously only traits did. The
 *    base keeps its retained half verbatim and the two transferable halves
 *    combine beneath a fresh divider, so an output is itself donatable. Numeric
 *    tags total, distinct formulas and arrays stack side by side, and identical
 *    lines collapse to one.
 *    The refinement result column shows what an equip will be worth rather than
 *    the raw trait values behind it: a before and after per parameter, with the
 *    percentage responsible in a third column. A percentage landing on a stat the
 *    item has none of now reads plainly as zero to zero instead of looking like a
 *    gain.
 *    Transferable note effects are listed too, as authored - tag key on the left,
 *    value on the right, both sides shown when a value moves. Nothing interprets
 *    what a tag means yet, so these read as written rather than as a friendlier
 *    guess.
 *    The column headings are drawn on the output's name line and no longer depend
 *    on a numeric row existing, so switching between donors that grant an amount
 *    and donors that grant a name stopped moving every row a line.
 *    An effect the base already carried is no longer dimmed. The rightmost column
 *    says what happened to every row, and grey is what the donor list already
 *    uses for rows that cannot be picked.
 *    Fixed the details panel continuing to project a merge after backing out of
 *    the donor list. The last-highlighted donor stayed selected internally while
 *    nothing on screen said which one it was.
 * - 1.3.0
 *    Fixed refinement lineage collapsing on save/load. A refined item's
 *    ancestry was detected by comparing the datum's id against the refinement
 *    starting index, but refined rows are clones that keep the base item's id -
 *    only the slot they occupy moves. Every ancestor therefore looked like a
 *    base item, so a +5 sword came back as +1 carrying only its last material.
 *    Fixed commitRefinement unwrapping its arguments as Game_Item when the
 *    scene passes raw datums, which threw before a refinement could complete.
 *    Fixed the refinement detail panel staying blank after a commit; the
 *    cursor was already on the row it needed to redraw, so no index change
 *    was raised to trigger it.
 *    Removed a call to JaftingManager.combineBaseParameterTraits, which had not
 *    existed since the module migration and prevented the scene from opening.
 *    Routed the _refinement namespace into its own save section.
 * - 1.2.0
 *    Replaced ~550 lines of local trait-combining logic with calls to
 *    J-Base's new shared TraitResolver.refineTraits/consolidate.
 *    Fixed the salvage ledger being silently dropped from refined equipment
 *    on save/load- RPG_EquipItem's base schema doesn't carry
 *    _jaftingSalvageLedger, so Game_Party's database-refresh reconstruction
 *    (new RPG_Weapon/RPG_Armor from raw JSON) lost refinement lineage every
 *    time until this fix.
 * - 1.0.2
 *    Salvage ledger merges before refine consumes inputs.
 *    Refinable list lineage hints; hollow-diamond prefix for stamped rows.
 * - 1.0.1
 *    Consumed `RPGManager` updates.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 106
 *
 * @param menu-name
 * @parent parentConfig
 * @type string
 * @text Menu Name
 * @desc The name of the command used for JAFTING's Refinement.
 * @default Refinement
 *
 * @param menu-icon
 * @parent parentConfig
 * @type number
 * @text Menu Icon
 * @desc The icon of the command used for JAFTING's Refinement.
 * @default 2565
 *
 *
 * @command call-menu
 * @text Call the Refinement Menu
 * @desc Calls the JAFTING Refinement scene.
 *
 */

//#region src/plugins/jafting/ext/refine/__models/JAFTING_Trait.js
/**
* A class representing a single trait on a piece of equipment that can be potentially
* transferred by means of JAFTING's refinement mode.
*
* Trait name, value, and combined display are delegated entirely to
* {@link RPG_Trait} (J-Base), which is the canonical translation layer.
* The only JAFTING-specific responsibility this class retains is the divider
* factory and the {@link convertToRmTrait} bridge back to a plain RPG_Trait.
*/
var JAFTING_Trait = class {
	/**
	* Gets the code.
	* @returns {number} The code.
	*/
	code() {
		return this._code;
	}
	/**
	* Gets the data id.
	* @returns {number} The dataId.
	*/
	dataId() {
		return this._dataId;
	}
	/**
	* Initializes the members of this class.
	* @param {number} code The code of the trait.
	* @param {number} dataId The dataId of the trait.
	* @param {number} value The value of the trait.
	*/
	constructor(code, dataId, value) {
		this._code = code;
		this._dataId = dataId;
		this._value = value;
	}
	/**
	* The defacto of what JAFTING considers a "divider" trait.
	* All traits defined AFTER this trait are considered transferable.
	* @returns {RPG_Trait}
	*/
	static divider() {
		return RPG_Trait.fromValues(J.BASE.Traits.NO_DISAPPEAR, 3, 1);
	}
	/**
	* Gets a standardized concatenation of the name and value for this trait.
	* Delegates to {@link RPG_Trait#textNameAndValue} in J-Base.
	* @returns {string}
	*/
	get nameAndValue() {
		return this.convertToRmTrait().textNameAndValue();
	}
	/**
	* Gets the friendly name of the trait based on the trait code.
	* Delegates to {@link RPG_Trait#textName} in J-Base.
	* @returns {string}
	*/
	get name() {
		return this.convertToRmTrait().textName();
	}
	/**
	* Gets the friendly value of the trait based on the trait code and value.
	* Delegates to {@link RPG_Trait#textValue} in J-Base.
	* @returns {string}
	*/
	get value() {
		return this.convertToRmTrait().textValue();
	}
	/**
	* Gets the original RM trait associated with this JAFTING trait.
	* @returns {RPG_Trait}
	*/
	convertToRmTrait() {
		return RPG_Trait.fromValues(this.code(), this.dataId(), this._value);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/__models/JAFT_RefinementData.js
/**
* A class containing all the various data points extracted from notes.
*/
var JAFTING_RefinementData = class {
	/**
	* Gets the notes.
	* @returns {string[]} The notes.
	*/
	notes() {
		return this._notes;
	}
	/**
	* @constructor
	* @param {string} notes The raw note box as a string.
	* @param {any} meta The `meta` object containing prebuilt note metadata.
	*/
	constructor(notes, meta) {
		this._notes = notes.split(/[\r\n]+/);
		this._meta = meta;
		this.refinedCount = 0;
		this.maxRefineCount = this.getMaxRefineCount();
		this.maxTraitCount = this.getMaxTraitCount();
		this.notRefinementMaterial = this.isNotRefinableAsMaterial();
		this.notRefinementBase = this.isNotRefinableAsBase();
		this.unrefinable = this.isNotRefinable();
	}
	/**
	* The number of times this piece of equipment can be refined.
	* @returns {number}
	*/
	getMaxRefineCount() {
		return RPGManager.getNumberFromNoteByRegex({ note: this.notes() }, J.JAFTING.EXT.REFINE.MaxRefineCount);
	}
	/**
	* The number of transferable traits that this piece of equipment can have at any one time.
	* @returns {number}
	*/
	getMaxTraitCount() {
		return RPGManager.getNumberFromNoteByRegex({ note: this.notes() }, J.JAFTING.EXT.REFINE.MaxRefinedTraits);
	}
	/**
	* Gets whether or not this piece of equipment can be used in refinement as a material.
	* @returns {boolean}
	*/
	isNotRefinableAsMaterial() {
		return RPGManager.checkForBooleanFromNoteByRegex({ note: this.notes() }, J.JAFTING.EXT.REFINE.NotRefinementMaterial);
	}
	/**
	* Gets whether or not this piece of equipment can be used in refinement as a base.
	* @returns {boolean}
	*/
	isNotRefinableAsBase() {
		return RPGManager.checkForBooleanFromNoteByRegex({ note: this.notes() }, J.JAFTING.EXT.REFINE.NotRefinementBase);
	}
	/**
	* Gets whether or not this piece of equipment can be used in refinement.
	* If this is true, this will mean this cannot be used in refinement as base or material.
	* @returns
	*/
	isNotRefinable() {
		return RPGManager.checkForBooleanFromNoteByRegex({ note: this.notes() }, J.JAFTING.EXT.REFINE.Unrefinable);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/__models/JaftingRefinementLineage.js
/**
* The complete provenance of one refined equip: what it was made from, in what slot it lives, and
* the dismantle stamp it was born with.
*
* **This is what a save stores instead of the refined equip itself.** `JaftingManager` produces a
* refined row by a pure, deterministic function of its two inputs - parse the traits after the
* divider, merge them with keep-better semantics, clone the base, rename with the `+N` suffix - so
* the row is *derivable*, and a derivable thing persisted by value is a thing that stops following
* its source. Store the whole equip and rebalancing a base weapon's ATK never reaches the refined
* descendants a player is actually carrying. Store the lineage and every load replays them against
* whatever the database says today.
*
* A node is one of two things, and {@link #isLeaf} is the test:
*
* - a **leaf**, naming a database row by {@link #kind} and {@link #id}; or
* - a **refinement**, holding a {@link #base} and a {@link #material} that are themselves nodes.
*
* The recursion is not decorative. A material may itself have been refined, and the moment it is
* consumed its `$data*` slot is reclaimed and blanked by {@link JaftingSalvageManager} - so by the
* time a save is written there is nothing left in the datastore to point at. The provenance has to
* travel inside the node that needs it.
*
* One field is genuinely stored rather than derived, and it is the exception worth understanding:
* {@link #ledger}. The dismantle stamp attached to a refined output is built by
* `JaftingSalvageManager.buildRefinementOutputLedger`, which reads the *party's* salvage bags for the
* specific stack slot the material was drawn from - and those bags are pruned by the very `gainItem`
* that consumes it. It is an input captured at a moment, not a derivation, so replay cannot
* reproduce it and the node carries it verbatim.
*/
var JaftingRefinementLineage = class JaftingRefinementLineage {
	/**
	* The `$dataWeapons` / `$dataArmors` slot this refinement was allocated, or `0` on a leaf.
	*
	* Stored rather than derived from replay order on purpose: a reordered, deduplicated, or
	* partially-failed lineage list can never silently repoint an inventory entry at the wrong item
	* when every node names its own slot. It is also the field
	* `JaftingSalvageManager.reclaimDynamicWeaponSlot` matches on when the last copy leaves the party.
	* @type {number}
	*/
	index = 0;
	/**
	* Which datastore a leaf's row lives in: `w`, `a`, or `i`.
	*
	* The same letters the salvage ledger uses, so the two vocabularies do not drift apart.
	* @type {string}
	*/
	kind = String.empty;
	/**
	* The database row id a leaf names, or `0` on a refinement.
	* @type {number}
	*/
	id = 0;
	/**
	* The equip that was improved, as its own node, or `null` on a leaf.
	* @type {JaftingRefinementLineage|null}
	*/
	base = null;
	/**
	* The equip that was consumed, as its own node, or `null` on a leaf.
	* @type {JaftingRefinementLineage|null}
	*/
	material = null;
	/**
	* The dismantle stamp this output was born with, or `null` when it had none.
	* @type {JaftingSalvageLedgerSnapshot|null}
	*/
	ledger = null;
	/**
	* Builds the node that names a database row directly.
	* @param {string} kind The datastore letter: `w`, `a`, or `i`.
	* @param {number} id The database row id.
	* @returns {JaftingRefinementLineage}
	*/
	static leaf(kind, id) {
		const lineage = new JaftingRefinementLineage();
		lineage.kind = kind;
		lineage.id = id;
		return lineage;
	}
	/**
	* Builds the node describing one refinement step.
	* @param {number} index The datastore slot the output was allocated.
	* @param {JaftingRefinementLineage} base The node describing the equip that was improved.
	* @param {JaftingRefinementLineage} material The node describing the equip that was consumed.
	* @param {JaftingSalvageLedgerSnapshot|null} ledger The dismantle stamp captured at commit time.
	* @returns {JaftingRefinementLineage}
	*/
	static refinement(index, base, material, ledger) {
		const lineage = new JaftingRefinementLineage();
		lineage.index = index;
		lineage.base = base;
		lineage.material = material;
		lineage.ledger = ledger;
		return lineage;
	}
	/**
	* Determines whether this node names a database row rather than describing a refinement.
	*
	* The base is the discriminator rather than the index, because a leaf and a refinement both have
	* a meaningful position in a datastore and only a refinement has inputs.
	* @returns {boolean}
	*/
	isLeaf() {
		return this.base === null;
	}
};
/**
* Registered so the save pipeline can write and rebuild a lineage tree. The two nested nodes and the
* captured ledger are declared, because everything below the top node is an instance the decoder
* has to be told the type of when the tags are stripped by hand.
*/
SerializableRegistry.register(JaftingRefinementLineage, {
	id: "jafting-refinement-lineage",
	aliases: ["JaftingRefinementLineage"],
	typed: {
		base: JaftingRefinementLineage,
		material: JaftingRefinementLineage,
		ledger: JaftingSalvageLedgerSnapshot
	},
	seed: (instance) => Object.assign(instance, new JaftingRefinementLineage())
});

//#endregion
//#region src/plugins/jafting/ext/refine/managers/JaftingManager.js
/**
* A class responsible for handling interactions between the JAFTING data stores,
* and the mutating the data itself.
*/
var JaftingManager = class JaftingManager {
	/**
	* A collection of categories of equipment that are refinable.
	*/
	static RefinementTypes = {
		Armor: "armor",
		Weapon: "weapon"
	};
	/**
	* The starting index for when our custom refined equips will be saved into the
	* target datastore.
	* @type {number}
	*/
	static StartingIndex = 2001;
	/**
	* The literal note line separating an equip's own effects from the ones it hands over when consumed.
	*
	* Written verbatim onto a refinement output, so a refined equip can itself be donated later. The
	* matching pattern lives on {@link J.JAFTING.EXT.REFINE.RegExp.TransferrableEffectsBelow}; this is the
	* text, because a RegExp cannot be turned back into the thing it recognizes.
	* @type {string}
	*/
	static TransferrableEffectsDivider = "<transferrableEffectsBelow>";
	/**
	* Parses all traits off the equipment that are below the "divider".
	* The divider is NOT parameterized, the "collapse effect" trait is the perfect trait
	* to use for this purpose since it has 0 use on actor equipment.
	* @param {RPG_EquipItem} equip An equip to parse traits off of.
	* @returns {JAFTING_Trait[]}
	*/
	static parseTraits(equip) {
		const allTraits = [...equip.traits];
		const divider = allTraits.findIndex((trait) => trait.code === 63);
		if (divider === -1) return Array.empty;
		const availableTraits = allTraits.splice(divider + 1);
		if (availableTraits.length === 0) return Array.empty;
		const consolidated = TraitResolver.consolidate(availableTraits);
		return consolidated.map((t) => new JAFTING_Trait(t.code, t.dataId, t.value));
	}
	/**
	* The note text below the transferable divider - what this equip hands over when consumed.
	*
	* No divider means no note effects transfer at all. That is the deliberate default and the mirror of
	* {@link parseTraits}: an equip says what it is willing to give away, and silence means nothing. The
	* alternative - transferring everything unless told otherwise - would hand a donor's identity over,
	* including the `<this{PARAM}:N>` bases that make a percentage bounded by the item carrying it.
	* @param {RPG_EquipItem} equip An equip to read transferable effects from.
	* @returns {string} The transferable note text, or an empty string when there is none.
	*/
	static parseNoteEffects(equip) {
		const lines = this.#noteLinesOf(equip);
		const dividerIndex = this.#dividerIndexOf(lines);
		if (dividerIndex === -1) return String.empty;
		return lines.slice(dividerIndex + 1).join("\n");
	}
	/**
	* The note text at and above the transferable divider - what an equip keeps no matter what.
	*
	* An equip with no divider keeps its whole note, since none of it was ever offered.
	* @param {RPG_EquipItem} equip An equip to read retained effects from.
	* @returns {string} The retained note text.
	*/
	static parseRetainedNote(equip) {
		const lines = this.#noteLinesOf(equip);
		const dividerIndex = this.#dividerIndexOf(lines);
		if (dividerIndex === -1) {
			return lines.join("\n");
		}
		return lines.slice(0, dividerIndex).join("\n");
	}
	/**
	* Splits a note into its non-empty lines.
	* @param {RPG_EquipItem} equip The equip whose note to split.
	* @returns {string[]}
	*/
	static #noteLinesOf(equip) {
		const note = equip.note || String.empty;
		return note.split(/[\r\n]+/).filter((line) => line.length > 0);
	}
	/**
	* Locates the transferable divider among a note's lines.
	* @param {string[]} lines The note's lines.
	* @returns {number} The divider's line index, or -1 when absent.
	*/
	static #dividerIndexOf(lines) {
		const pattern = J.JAFTING.EXT.REFINE.RegExp.TransferrableEffectsBelow;
		return lines.findIndex((line) => pattern.test(line));
	}
	/**
	* Decides how each tag key in a pair of transferable notes should merge.
	*
	* Derived from the shape of the values rather than from a list of known keys, because the divider is
	* what declares a tag transferable - so the set of keys that can arrive here is whatever an author
	* writes, not something this plugin can enumerate ahead of time.
	*
	* A key whose every value is a plain number **sums**: two `<bonusHits:2>` become four hits, which is
	* what a player refining the same material twice expects. Everything else - arrays, formulas, booleans,
	* prose - **accumulates**: distinct lines stack side by side, and identical ones collapse to one, which
	* lands exactly where the same formula appearing twice ought to.
	* @param {string} baseNote The base's transferable note text.
	* @param {string} overlayNote The donor's transferable note text.
	* @returns {{accumulatingKeys: string[], summingKeys: string[]}}
	*/
	static transferPolicyFor(baseNote, overlayNote) {
		const scalarShape = /^<([^:]+):\s*(-?\d+(?:\.\d+)?)\s*>$/;
		const tags = [...this.#tagsOf(baseNote), ...this.#tagsOf(overlayNote)];
		const scalarByKey = new Map();
		tags.forEach((tag) => {
			const inner = tag.substring(1, tag.length - 1);
			const colonIndex = inner.indexOf(":");
			const rawKey = colonIndex === -1 ? inner : inner.substring(0, colonIndex);
			const key = rawKey.trim().toLowerCase();
			const isScalar = scalarShape.test(tag);
			if (scalarByKey.has(key) === false) {
				scalarByKey.set(key, isScalar);
				return;
			}
			if (isScalar === false) scalarByKey.set(key, false);
		});
		const summingKeys = [];
		const accumulatingKeys = [];
		scalarByKey.forEach((isScalar, key) => {
			if (isScalar) {
				summingKeys.push(key);
				return;
			}
			accumulatingKeys.push(key);
		});
		return {
			accumulatingKeys,
			summingKeys
		};
	}
	/**
	* Extracts the angle-bracketed tags from a note.
	* @param {string} note The note text to read.
	* @returns {string[]}
	*/
	static #tagsOf(note) {
		const text = note || String.empty;
		return text.match(/<[^>]+>/g) || [];
	}
	/**
	* Groups a note's tags into their authored values, keyed by tag key.
	*
	* Values are kept exactly as written, brackets and all. Nothing here interprets what a tag *means* -
	* that is a job for a tag registry, and inventing a friendlier reading in the meantime would produce
	* something confidently wrong rather than something plainly unfinished.
	*
	* A boolean tag has no value to report, so its presence is the value.
	* @param {string} note The note text to read.
	* @returns {Map<string, string[]>} Each key's authored values, in the order written.
	*/
	static tagValuesOf(note) {
		const values = new Map();
		this.#tagsOf(note).forEach((tag) => {
			const inner = tag.substring(1, tag.length - 1);
			const colonIndex = inner.indexOf(":");
			const key = colonIndex === -1 ? inner.trim() : inner.substring(0, colonIndex).trim();
			const value = colonIndex === -1 ? "yes" : inner.substring(colonIndex + 1).trim();
			if (values.has(key) === false) {
				values.set(key, []);
			}
			const existing = values.get(key);
			if (existing.includes(value) === false) existing.push(value);
		});
		return values;
	}
	/**
	* Pairs the base's transferable note effects against the projected output's, per tag key.
	*
	* Only the output's keys are walked, because the merge cannot drop one: every key the base carried is
	* appended in some form, whether it stood alone, accumulated, or was totalled. A key with no `before`
	* is therefore genuinely arriving from the donor.
	* @param {RPG_EquipItem} base The equip being refined.
	* @param {RPG_EquipItem} result The projected refinement output.
	* @returns {{key: string, before: (string|null), after: string}[]} One row per key, key-ordered.
	*/
	static buildNoteEffectComparison(base, result) {
		const before = this.tagValuesOf(this.parseNoteEffects(base));
		const after = this.tagValuesOf(this.parseNoteEffects(result));
		const rows = [];
		after.forEach((values, key) => {
			const beforeValues = before.has(key) ? before.get(key).join(", ") : null;
			rows.push({
				key,
				before: beforeValues,
				after: values.join(", ")
			});
		});
		return rows.sort((left, right) => left.key.localeCompare(right.key));
	}
	/**
	* Determines the result of refining a given base with a given material.
	* Trait merging is delegated to {@link TraitResolver.refineTraits}.
	* @param {RPG_EquipItem} base An equip to refine.
	* @param {RPG_EquipItem} material An equip to consume as the refinement material.
	* @returns {RPG_EquipItem}
	*/
	static determineRefinementOutput(base, material) {
		if (!base || !material) return null;
		const baseRpgTraits = this.parseTraits(base).map((t) => RPG_Trait.fromValues(t._code, t._dataId, t._value));
		const materialRpgTraits = this.parseTraits(material).map((t) => RPG_Trait.fromValues(t._code, t._dataId, t._value));
		let mergedTraits = TraitResolver.refineTraits(baseRpgTraits, materialRpgTraits);
		mergedTraits = mergedTraits.filter((t) => !(t.code === 54 && t.dataId === base.etypeId));
		const output = base._generate(base, base._index());
		const dividerIndex = output.traits.findIndex((trait) => trait.code === 63);
		if (dividerIndex === -1) {
			output.traits.push(JAFTING_Trait.divider());
		} else {
			output.traits.splice(dividerIndex + 1);
		}
		mergedTraits.forEach((t) => output.traits.push(t));
		output.note = this.mergeTransferableNotes(base, material);
		return output;
	}
	/**
	* Builds the note a refinement output carries.
	*
	* The base's retained half is reproduced verbatim, then the two transferable halves are merged and
	* written back beneath a divider - so the output is itself donatable, carrying forward everything it
	* was given without ever offering the identity it kept.
	*
	* A divider is only written when there is something under it. An output with nothing transferable
	* should not advertise an empty payload, and an equip that never had a divider should not gain one for
	* free.
	* @param {RPG_EquipItem} base The equip being refined.
	* @param {RPG_EquipItem} material The equip being consumed.
	* @returns {string} The output's note.
	*/
	static mergeTransferableNotes(base, material) {
		const retained = this.parseRetainedNote(base);
		const baseTransferable = this.parseNoteEffects(base);
		const materialTransferable = this.parseNoteEffects(material);
		const { accumulatingKeys, summingKeys } = this.transferPolicyFor(baseTransferable, materialTransferable);
		const merged = NoteResolver.merge(baseTransferable, materialTransferable, accumulatingKeys, summingKeys);
		if (merged.length === 0) return retained;
		const divider = JaftingManager.TransferrableEffectsDivider;
		if (retained.length === 0) {
			return `${divider}\n${merged}`;
		}
		return `${retained}\n${divider}\n${merged}`;
	}
	/**
	* Stamps a freshly-merged output equip with the identity a refined row carries: one more refine on
	* the counter, the `+N` suffix on the name, and the datastore slot it will live in.
	*
	* This is deliberately separated from {@link generateRefinedEquip}, which surrounds it with party
	* side effects - spending the counter, gaining the item, recording the lineage. Everything here is
	* a pure function of the equip and the slot, and that is precisely what makes it replayable: a
	* load re-derives a refined row by running {@link determineRefinementOutput} and then this, with
	* nothing in between. Two implementations that had to agree would be the bug the lineage work
	* exists to prevent, so there is only ever one.
	* @param {RPG_EquipItem} equip The merged output to stamp, mutated in place.
	* @param {number} index The datastore slot this refinement occupies.
	*/
	static stampRefinedOutput(equip, index) {
		equip.jaftingRefinedCount++;
		const suffix = `+${equip.jaftingRefinedCount}`;
		if (equip.jaftingRefinedCount === 1) {
			equip.name = `${equip.name} ${suffix}`;
		} else {
			const plusIndex = equip.name.indexOf("+");
			if (plusIndex > -1) {
				equip.name = `${equip.name.slice(0, plusIndex)}${suffix}`;
			} else {
				equip.name = `${equip.name} ${suffix}`;
			}
		}
		equip._updateIndex(index);
	}
	/**
	* Rebuilds a refined equip from its provenance, against whatever the database says right now.
	*
	* This is the whole point of storing lineage instead of results. Every input is resolved fresh -
	* a leaf out of the live `$data*` table, a nested refinement by replaying it in turn - so a base
	* weapon whose ATK was raised during rebalancing reaches every refined descendant a player is
	* carrying on their next load.
	*
	* **The tradeoff is deliberate and worth stating: derived values follow the deriver.** Changing
	* `TraitResolver.refineTraits`, the divider convention, or the suffix format shifts every existing
	* refined item the next time a save is opened. During pre-release rebalancing that is the feature.
	* If it ever needs not to be, the lineage node is the place to gate it on a schema version.
	* @param {JaftingRefinementLineage} lineage The provenance to replay.
	* @returns {RPG_EquipItem} The rebuilt row, not yet written to any datastore.
	*/
	static replayLineage(lineage) {
		if (lineage.isLeaf()) return this.resolveLineageLeaf(lineage);
		const base = this.replayLineage(lineage.base);
		const material = this.replayLineage(lineage.material);
		const output = this.determineRefinementOutput(base, material);
		this.stampRefinedOutput(output, lineage.index);
		output._jaftingSalvageLedger = lineage.ledger;
		return output;
	}
	/**
	* Resolves the database row a leaf node names.
	* @param {JaftingRefinementLineage} lineage The leaf to resolve.
	* @returns {RPG_EquipItem} The live database row.
	*/
	static resolveLineageLeaf(lineage) {
		const datastore = this.datastoreForLineageKind(lineage.kind);
		const row = datastore[lineage.id];
		if (!row) {
			throw new Error(`refinement lineage names '${lineage.kind}:${lineage.id}', which is not in the database. ` + "A row that refined equipment was built from has been removed.");
		}
		return row;
	}
	/**
	* Maps a lineage node's datastore letter onto the table it refers to.
	* @param {string} kind The datastore letter: `w`, `a`, or `i`.
	* @returns {RPG_Weapon[]|RPG_Armor[]|RPG_Item[]} The datastore.
	*/
	static datastoreForLineageKind(kind) {
		if (kind === "w") return $dataWeapons;
		if (kind === "a") return $dataArmors;
		if (kind === "i") return $dataItems;
		throw new Error(`refinement lineage carries an unknown datastore letter: '${kind}'.`);
	}
	/**
	* Builds the lineage node describing an equip that is about to become a refinement input.
	*
	* A plain database row becomes a leaf. A refined row hands back the lineage already recorded for
	* it, so the provenance nests rather than restarting - which is what lets a three-deep refinement
	* replay from base rows alone.
	* @param {RPG_EquipItem} datum The equip being consumed as a base or a material.
	* @returns {JaftingRefinementLineage} The node describing it.
	*/
	static lineageForDatum(datum) {
		const slot = datum._key();
		if (slot >= this.StartingIndex) {
			const tracked = datum.isWeapon() ? $gameParty.getRefinedWeapons() : $gameParty.getRefinedArmors();
			const existing = tracked.find((lineage) => lineage.index === slot);
			if (existing) return existing;
		}
		return JaftingRefinementLineage.leaf(this.lineageKindForDatum(datum), datum.id);
	}
	/**
	* Maps an equip onto the datastore letter a lineage leaf records it under.
	* @param {RPG_EquipItem} datum The equip to classify.
	* @returns {string} The datastore letter: `w`, `a`, or `i`.
	*/
	static lineageKindForDatum(datum) {
		if (datum.isWeapon()) return "w";
		if (datum.isArmor()) return "a";
		return "i";
	}
	/**
	* Takes the refinement result equip and creates it in the appropriate datastore, and adds it to
	* the player's inventory.
	*
	* The two input nodes come along because the party records *provenance*, not the result: the
	* lineage node built here is what a save writes, and what a load replays. They arrive already
	* built rather than as raw equips, because both inputs have been spent by the time this runs -
	* see {@link RefinementWorkflowSession#commitRefinement} for why that ordering is forced.
	* @param {RPG_EquipItem} outputEquip The equip to generate and add to the player's inventory.
	* @param {JaftingRefinementLineage} baseLineage The provenance of the equip that was improved.
	* @param {JaftingRefinementLineage} materialLineage The provenance of the equip that was consumed.
	*/
	static createRefinedOutput(outputEquip, baseLineage, materialLineage) {
		if (outputEquip.wtypeId) {
			this.generateRefinedEquip($dataWeapons, outputEquip, this.RefinementTypes.Weapon, baseLineage, materialLineage);
			return;
		}
		if (outputEquip.atypeId) {
			this.generateRefinedEquip($dataArmors, outputEquip, this.RefinementTypes.Armor, baseLineage, materialLineage);
			return;
		}
		throw new Error("a refinement output was neither weapon nor armor, so there is no datastore for it.");
	}
	/**
	* Generates the new entry in the corresponding datastore for the new equip data that was refined.
	* @param {RPG_Weapon[]|RPG_Armor[]} datastore The datastore to extend with new data.
	* @param {RPG_EquipItem} equip The equip to generate and add to the player's inventory.
	* @param {string} refinementType The type of equip this is; for incrementing the counter on custom data.
	* @param {JaftingRefinementLineage} baseLineage The provenance of the equip that was improved.
	* @param {JaftingRefinementLineage} materialLineage The provenance of the equip that was consumed.
	*/
	static generateRefinedEquip(datastore, equip, refinementType, baseLineage, materialLineage) {
		const newIndex = $gameParty.getRefinementCounter(refinementType);
		this.stampRefinedOutput(equip, newIndex);
		datastore[newIndex] = equip;
		$gameParty.gainItem(datastore[newIndex], 1);
		$gameParty.incrementRefinementCounter(refinementType);
		const lineage = JaftingRefinementLineage.refinement(newIndex, baseLineage, materialLineage, equip._jaftingSalvageLedger);
		if (equip.wtypeId) {
			$gameParty.addRefinedWeapon(lineage);
		} else if (equip.atypeId) {
			$gameParty.addRefinedArmor(lineage);
		} else {
			console.error(`The following equip failed to be captured because it was neither weapon nor armor.`);
			console.warn(equip);
			throw new Error("please stop crafting stuff that isn't valid.");
		}
	}
	/**
	* True when party inventory has at least one equip that the primary refinable list would allow as base
	* (material type omitted, same enable rules as {@link Window_RefinableList} primary branch).
	* @returns {boolean}
	*/
	static partyHasEnterableRefinementBase() {
		let equips = $gameParty.equipItems();
		if (equips.length === 0) {
			return false;
		}
		equips = equips.filter((equip) => {
			if (JaftingSalvageLedger.isMaterialArmorDatum(equip)) {
				return false;
			}
			if (JaftingSalvageLedger.isMaterialWeaponDatum(equip)) {
				return false;
			}
			return true;
		});
		for (let i = 0; i < equips.length; i++) {
			const equip = equips[i];
			if (equip.jaftingUnrefinable) {
				continue;
			}
			const equipIsMaxRefined = equip.jaftingMaxRefineCount === 0 ? false : equip.jaftingMaxRefineCount <= equip.jaftingRefinedCount;
			if (equipIsMaxRefined) {
				continue;
			}
			const equipHasMaxTraits = equip.jaftingMaxTraitCount === 0 ? false : equip.jaftingMaxTraitCount <= JaftingManager.parseTraits(equip).length;
			if (equipHasMaxTraits) {
				continue;
			}
			if (equip.jaftingNotRefinementBase) {
				continue;
			}
			return true;
		}
		return false;
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/__models/RefinementWorkflowSession.js
/**
* Small state machine for {@link Scene_JaftingRefine}: which list the player is on (base vs material vs confirm).<br>
* <br>
* **Why this exists beside the scene:** keeps phase transitions in one place so windows only advance the tracked phase
* through these named methods—easier to grep than scattered string literals.<br>
* <br>
* **Money method:** {@link RefinementWorkflowSession#commitRefinement} is the only place that should spend inputs and
* mint output; it merges salvage ledgers **before** `gainItem(-1)` so party hooks that prune bags cannot erase lineage
* the output row still needs (see inline ordering in that method).
*/
var RefinementWorkflowSession = class RefinementWorkflowSession {
	/**
	* UX phases for base → material → confirm.
	*/
	static Phase = {
		PickingBase: "picking_base",
		PickingMaterial: "picking_material",
		Confirming: "confirming"
	};
	/**
	* @type {string}
	*/
	#phase = RefinementWorkflowSession.Phase.PickingBase;
	/**
	* Resets when entering the scene.
	*/
	reset() {
		this.#phase = RefinementWorkflowSession.Phase.PickingBase;
	}
	/**
	* @returns {string}
	*/
	getPhase() {
		return this.#phase;
	}
	/**
	* @returns {{ phase: string }}
	*/
	snapshot() {
		return { phase: this.#phase };
	}
	/**
	* Base equip chosen; list UI should switch to material selection.
	*/
	beginMaterialSelection() {
		this.#phase = RefinementWorkflowSession.Phase.PickingMaterial;
	}
	/**
	* User backed out of material list to base list.
	*/
	returnToBaseSelection() {
		this.#phase = RefinementWorkflowSession.Phase.PickingBase;
	}
	/**
	* Material chosen; show confirmation window.
	*/
	beginConfirmation() {
		this.#phase = RefinementWorkflowSession.Phase.Confirming;
	}
	/**
	* User cancelled confirm; return to material selection.
	*/
	returnToMaterialSelection() {
		this.#phase = RefinementWorkflowSession.Phase.PickingMaterial;
	}
	/**
	* Successful commit returns to base pick for the next round.
	*/
	markCommittedReturnToBase() {
		this.#phase = RefinementWorkflowSession.Phase.PickingBase;
	}
	/**
	* Performs the refinement transaction: remove inputs, stamp the hydrated output row, then register it through
	* {@link JaftingManager.createRefinedOutput} (dynamic id allocation + party gain).
	*
	* Both inputs arrive as the database rows themselves rather than `Game_Item` wrappers, because that is what the
	* refinable list windows carry and what `gainItem` reads an `id` off of further down.
	*
	* @param {RPG_EquipItem} baseDatum The base equip driving this step.
	* @param {RPG_EquipItem} materialDatum The material equip driving this step.
	* @param {RPG_EquipItem} outputEquip The output equip driving this step.
	* @returns {{ ok: boolean, reason: string|null }}
	*/
	commitRefinement(baseDatum, materialDatum, outputEquip) {
		const mergedLedger = JaftingSalvageManager.buildRefinementOutputLedger(baseDatum, materialDatum);
		const baseLineage = JaftingManager.lineageForDatum(baseDatum);
		const materialLineage = JaftingManager.lineageForDatum(materialDatum);
		$gameParty.gainItem(baseDatum, -1);
		$gameParty.gainItem(materialDatum, -1);
		outputEquip._jaftingSalvageLedger = mergedLedger;
		JaftingManager.createRefinedOutput(outputEquip, baseLineage, materialLineage);
		this.markCommittedReturnToBase();
		return {
			ok: true,
			reason: null
		};
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/_metadata/_pluginMetadata.js
/**
* Plugin metadata for the refinement JAFTING plugin.<br>
* Because this plugin has little to be configured, it is pretty light.
*/
var J_CraftingRefinePluginMetadata = class extends PluginMetadata {
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
		/**
		* The id of a switch that represents whether or not this system is accessible
		* in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* The name used for the command when visible in a menu.
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["menu-name"] ?? "Refinement";
		/**
		* The icon used alongside the command's name when visible in the menu.
		* @type {number}
		*/
		this.commandIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-icon"], 0);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/_metadata/initialization.js
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
	const requiredJaftingVersion = "2.1.0";
	const hasJaftingRequirement = J.BASE.Helpers.satisfies(J.JAFTING.Metadata.version.version(), requiredJaftingVersion);
	if (hasJaftingRequirement === false) {
		throw new Error(`Either missing J-JAFTING or has a lower version than the required: ${requiredJaftingVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.JAFTING.EXT ||= {};
J.JAFTING.EXT.REFINE = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.JAFTING.EXT.REFINE.Metadata = new J_CraftingRefinePluginMetadata("J-JAFTING-Refinement", "1.4.0");
/**
* A helpful mapping of the various messages that we use in JAFTING.
*/
J.JAFTING.EXT.REFINE.Messages = {
	/**
	* The name of the command for Refinement on the JAFTING mode menu.
	*/
	RefineCommandName: "Refine",
	/**
	* The name of the command that executes refinement.
	*/
	ExecuteRefinementCommandName: "Execute Refinement",
	/**
	* The name of the command that cancels the refinement process.
	*/
	CancelRefinementCommandName: "Cancel",
	/**
	* Hollow-diamond prefix for rows with dismantle lineage or refinement history—subtle, not a rarity star.
	*/
	RefinableListSalvageStampPrefix: "◇",
	/**
	* When an item hasn't been selected somehow, this message shows in the help window.
	*/
	NoItemSelected: "Nothing is selected.",
	/**
	* When the item being hovered over cannot be used in refinement as a base, show this.
	*/
	CannotUseAsBase: "This cannot be used as a base for refinement.",
	/**
	* When the item being hovered over cannot be used in refinement as a material, show this.
	*/
	CannotUseAsMaterial: "This cannot be used as a material for refinement.",
	/**
	* When the list window is the selection of a base to refine, this shows up in the mini window.
	*/
	ChooseRefinementBase: "Choose Refinement Base",
	/**
	* When the list window is the selection of a material to add, this shows up in the mini window.
	*/
	ChooseRefinementMaterial: "Choose Material to Add",
	/**
	* When a material has no traits, this message shows up in the help window.
	*/
	NoTraitsOnMaterial: "This material has no traits to refine the base with.",
	/**
	* When the refinement would result in going over the base's max refine count, this shows up.
	*/
	ExceedRefineCount: "Refining with this would result in exceeding refine count max:",
	/**
	* When the refinement would result in going over the base's max trait count, this shows up.
	*/
	ExceedTraitCount: "Refining with this would result in exceeding trait count max:",
	/**
	* When the player hovers over an equip that has already reached it's max refine count, this shows up.
	*/
	AlreadyMaxRefineCount: "This has already been refined the maximum number of times.",
	/**
	* When the player hovers over an equip that has already reached it's max trait count, this shows up.
	*/
	AlreadyMaxTraitCount: "This has already been refined with as many traits as it can hold.",
	/**
	* This shows up over the base equip during refinement.
	*/
	TitleBase: "Refinement Base",
	/**
	* This shows up over the material equip during refinement.
	*/
	TitleMaterial: "Refinement Material",
	/**
	* This shows up over the output equip during refinement.
	*/
	TitleOutput: "Refinement Output",
	/**
	* Shown when a material is disabled because it has no traits to grant the base equip.
	*/
	NoTransferableTraits: "No transferable traits.",
	/**
	* Step hint while choosing the refinement base (left list).
	*/
	RefinementStepHintPickingBase: "Choose the equipment you want to improve. " + "This item stays in your inventory and receives traits.",
	/**
	* Step hint while choosing the material (second list).
	*/
	RefinementStepHintPickingMaterial: "Choose a donor item. Transferable traits merge into your base; the donor is consumed.",
	/**
	* Step hint on the confirmation prompt.
	*/
	RefinementStepHintConfirming: "Confirm to apply refinement, or cancel to pick a different material."
};
/**
* A helpful mapping of all the various RMMZ classes being extended.
*/
J.JAFTING.EXT.REFINE.Aliased = {};
J.JAFTING.EXT.REFINE.Aliased.Game_Item = new Map();
J.JAFTING.EXT.REFINE.Aliased.Game_Party = new Map();
J.JAFTING.EXT.REFINE.Aliased.Game_System = new Map();
J.JAFTING.EXT.REFINE.Aliased.RPG_Base = new Map();
J.JAFTING.EXT.REFINE.Aliased.RPG_EquipItem = new Map();
J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting = new Map();
J.JAFTING.EXT.REFINE.Aliased.Scene_Map = new Map();
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList = new Map();
/**
* All regular expressions used by this plugin.
*/
J.JAFTING.EXT.REFINE.RegExp = {};
J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase = /<notRefinementBase>/i;
J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial = /<notRefinementMaterial>/i;
J.JAFTING.EXT.REFINE.RegExp.Unrefinable = /<noRefine>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount = /<maxRefineCount:[ ]?(\d+)>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxRefinedTraits = /<maxRefinedTraits:[ ]?(\d+)>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount = /<maxTraitCount:[ ]?(\d+)>/i;
/**
* Marks the point in a note past which effects are refinement payload.
*
* Everything above it describes what the equip *is* and never leaves it; everything below is what a donor
* hands over when consumed. The absence of this tag means an equip has no note effects to give - not that
* all of them transfer - which is what keeps a weapon's own identity from being launderable.
*
* This is the note-side counterpart to the code-63 trait divider {@link JaftingManager.parseTraits} reads.
*
* <pre>
* Structure:
*  <transferrableEffectsBelow>
*
* Example:
*  <skillId:1>
*  <maxRefineCount:6>
*  <transferrableEffectsBelow>
*  <bonusHits:2>
*
* Translation:
*  This equip uses skill 1 and refines six times, neither of which transfers.
*  A donor consuming it hands over two bonus hits.
* </pre>
* @type {RegExp}
*/
J.JAFTING.EXT.REFINE.RegExp.TransferrableEffectsBelow = /<transferrableEffectsBelow>/i;

//#endregion
//#region src/plugins/jafting/ext/refine/database/RPG_Base.js
/**
* Extends {@link RPG_Base._generate}.<br/>
*
* Also mirrors additional JAFTING-related values to the new object.
* @param {RPG_Base} overrides The overriding object.
* @param {number} index The new index.
* @returns {this}
*/
J.JAFTING.EXT.REFINE.Aliased.RPG_Base.set("_generate", RPG_Base.prototype._generate);
RPG_Base.prototype._generate = function(overrides, index) {
	const original = J.JAFTING.EXT.REFINE.Aliased.RPG_Base.get("_generate").call(this, overrides, index);
	original.jaftingRefinedCount = overrides.jaftingRefinedCount;
	return original;
};

//#endregion
//#region src/plugins/jafting/ext/refine/database/RPG_EquipItem.js
/**
* Copies the salvage ledger from the source object so refinement lineage survives save/load.
* The base schema does not include `_jaftingSalvageLedger`, so without this hook the property is silently dropped
* when {@link Game_Party#refreshDatabaseWeapons} and {@link Game_Party#refreshDatabaseArmors} reconstruct refined
* entries via `new RPG_Weapon(raw, index)`.
*
* @param {RPG_EquipItem & { _jaftingSalvageLedger?: JaftingSalvageLedgerSnapshot|null }} baseItem
*/
J.JAFTING.EXT.REFINE.Aliased.RPG_EquipItem.set("initMembers", RPG_EquipItem.prototype.initMembers);
RPG_EquipItem.prototype.initMembers = function(baseItem) {
	J.JAFTING.EXT.REFINE.Aliased.RPG_EquipItem.get("initMembers").call(this, baseItem);
	this._jaftingSalvageLedger = baseItem._jaftingSalvageLedger ?? null;
};
/**
* The number of times this equip has been refined.
* @type {number}
*/
RPG_EquipItem.prototype.jaftingRefinedCount ||= 0;
/**
* Whether or not this equip is blocked from being used as a base for refinement.
* @type {boolean}
*/
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementBase", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase);
} });
/**
* Whether or not this equip is blocked from being used as a material for refinement.
* @type {boolean}
*/
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementMaterial", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial);
} });
/**
* Whether or not this equip is blocked from being used in refinement at all.
* This is equivalent to {@link jaftingNotRefinementBase} and {@link jaftingNotRefinementMaterial}
* existing on the same equip.
* @type {boolean}
*/
Object.defineProperty(RPG_EquipItem.prototype, "jaftingUnrefinable", { get: function() {
	return this.getJaftingUnrefinable();
} });
/**
* Gets whether or not this equip is blocked from being used as a material for refinement.
* @returns {boolean}
*/
RPG_EquipItem.prototype.getJaftingUnrefinable = function() {
	let unrefinable = RPGManager.checkForBooleanFromNoteByRegex(this, J.JAFTING.EXT.REFINE.RegExp.Unrefinable);
	if (!unrefinable) {
		const notForBase = this.jaftingNotRefinementBase;
		const notForMaterial = this.jaftingNotRefinementMaterial;
		if (notForBase && notForMaterial) {
			unrefinable = true;
		}
	}
	return unrefinable;
};
/**
* The maximum number of times this equip can be refined.
* @type {number}
*/
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxRefineCount", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount);
} });
/**
* The maximum number of traits this equip can be gain as a result of refinement.
* This is defined as the number of traits that come after the divider.
* @type {number}
*/
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxTraitCount", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount);
} });

//#endregion
//#region src/plugins/jafting/ext/refine/objects/Game_Item.js
/**
* Largely overwrites this function to instead leverage an item's index value over
* it's ID for setting objects to the item slot.
*/
J.JAFTING.EXT.REFINE.Aliased.Game_Item.set("setObject", Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(item) {
	J.JAFTING.EXT.REFINE.Aliased.Game_Item.get("setObject").call(this, item);
	this._itemId = item ? item._key() : 0;
};

//#endregion
//#region src/plugins/jafting/ext/refine/objects/Game_Party.js
/**
* Refinement party hooks: counters, refined-equip tracking, and `$data*` refresh helpers.<br>
* When the last copy of a dynamic refinement row leaves the party, {@link JaftingSalvageManager} reclaims the slot and
* writes {@link RPG_Weapon.createEmpty} / {@link RPG_Armor.createEmpty} back into `$dataWeapons` / `$dataArmors` so
* indices stay hydrated blanks instead of `null`—keep any custom refresh paths consistent with that contract.
*/
J.JAFTING.EXT.REFINE.Aliased.Game_Party.set("initMembers", Game_Party.prototype.initMembers);
Game_Party.prototype.initMembers = function() {
	J.JAFTING.EXT.REFINE.Aliased.Game_Party.get("initMembers").call(this);
	this.initJaftingRefinementMembers();
};
/**
* Initializes all refinement-related JAFTING members of this class.
*/
Game_Party.prototype.initJaftingRefinementMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the jafting system.
	*/
	this._j._refinement ||= {};
	/**
	* The provenance of every weapon that has been refined.
	* @type {JaftingRefinementLineage[]}
	*/
	this._j._refinement._weapons = [];
	/**
	* The provenance of every armor that has been refined.
	* @type {JaftingRefinementLineage[]}
	*/
	this._j._refinement._armors = [];
	/**
	* A collection of all current increment indices for refinable equipment types.
	* This ensures no refined equipment gets overwritten by another refined equipment.
	* @type {number}
	*/
	this._j._refinement._increments = {};
	/**
	* The refinement increment index for weapons.
	* @type {number}
	*/
	this._j._refinement._increments[JaftingManager.RefinementTypes.Weapon] = JaftingManager.StartingIndex;
	/**
	* The refinement increment index for armors.
	* @type {number}
	*/
	this._j._refinement._increments[JaftingManager.RefinementTypes.Armor] = JaftingManager.StartingIndex;
};
/**
* Gets the provenance of every weapon this party has refined.
* @returns {JaftingRefinementLineage[]}
*/
Game_Party.prototype.getRefinedWeapons = function() {
	return this._j._refinement._weapons;
};
/**
* Gets the provenance of every armor this party has refined.
* @returns {JaftingRefinementLineage[]}
*/
Game_Party.prototype.getRefinedArmors = function() {
	return this._j._refinement._armors;
};
/**
* Adds a newly refined weapon's provenance to the collection for tracking purposes.
* @param {JaftingRefinementLineage} lineage The provenance of the newly refined weapon.
*/
Game_Party.prototype.addRefinedWeapon = function(lineage) {
	this.getRefinedWeapons().push(lineage);
};
/**
* Adds a newly refined armor's provenance to the collection for tracking purposes.
* @param {JaftingRefinementLineage} lineage The provenance of the newly refined armor.
*/
Game_Party.prototype.addRefinedArmor = function(lineage) {
	this.getRefinedArmors().push(lineage);
};
/**
* Rebuilds every refined weapon from its provenance and writes it back into `$dataWeapons`.
*
* This runs on load rather than during decode on purpose. The loader steps back through
* generations when one fails to read, so a decode that mutated `$dataWeapons` on its way to
* throwing would leave a rejected generation's rows behind in the datastore. Replaying from a
* post-load hook means the datastore is only ever touched by a load that actually succeeded.
*/
Game_Party.prototype.refreshDatabaseWeapons = function() {
	this.getRefinedWeapons().forEach((lineage) => {
		const updatedWeapon = JaftingManager.replayLineage(lineage);
		$dataWeapons[updatedWeapon._key()] = updatedWeapon;
	});
};
/**
* Rebuilds every refined armor from its provenance and writes it back into `$dataArmors`.
*
* Twin of {@link Game_Party#refreshDatabaseWeapons}; the same reasoning about when it runs applies.
*/
Game_Party.prototype.refreshDatabaseArmors = function() {
	this.getRefinedArmors().forEach((lineage) => {
		const updatedArmor = JaftingManager.replayLineage(lineage);
		$dataArmors[updatedArmor._key()] = updatedArmor;
	});
};
/**
* Gets the current increment for a particular datastore's latest index.
* @param {string} refinementType One of the refinement types.
* @returns {number}
*/
Game_Party.prototype.getRefinementCounter = function(refinementType) {
	return this.increments()[refinementType];
};
/**
* Increments the refinement index for a particular datastore.
* @param {string} refinementType One of the refinement types.
*/
Game_Party.prototype.incrementRefinementCounter = function(refinementType) {
	this.increments()[refinementType]++;
};
/**
* Gets how many times each item has been refined by this party.
* @returns {Object<number, number>} The refinement count per item id.
*/
Game_Party.prototype.increments = function() {
	return this._j._refinement._increments;
};

//#endregion
//#region src/plugins/jafting/ext/refine/objects/Game_System.js
/**
* Extends {@link #onAfterLoad}.<br/>
* Updates the database with the tracked refined equips.
*/
J.JAFTING.EXT.REFINE.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.JAFTING.EXT.REFINE.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameParty.refreshDatabaseWeapons();
	$gameParty.refreshDatabaseArmors();
};

//#endregion
//#region src/plugins/jafting/ext/refine/managers/RefinementEligibility.js
/**
* Answers whether one equip may take part in refinement right now, and why not when it may not.
*
* **This exists so the list can be sorted.** The eligibility rules used to be computed while each row was being
* built, which meant the ordering pass ran before any row knew whether it was usable and had nothing to sort on -
* so a player hunting for the one valid donor scrolled past every invalid one to find it. Deciding first and
* drawing second is the whole point, and it happens to put the rules somewhere they can be tested without a scene.
*
* **Two kinds of "no", and they are treated differently.**
*
* - **Permanent** - this equip can never fill this role, in any circumstance. Those rows are dropped entirely,
*   because showing a player something they will never be allowed to pick is a tease. JAFTING already did this for
*   {@link RPG_EquipItem.jaftingUnrefinable}; this widens it to the per-role flags that mean the same thing.
* - **Situational** - this equip is fine in principle but not against the base currently chosen, or has been
*   improved as far as it goes. Those rows stay, disabled and carrying a reason, and sort to the bottom. Filtering
*   them would be actively worse: a maxed-out weapon is an achievement the player wants to see rather than an
*   error, and a "not with this base" row becomes valid the moment they back out and choose differently, so hiding
*   it would make the list change shape while it is being read.
*/
var RefinementEligibility = class RefinementEligibility {
	/**
	* Icon shown on a row that is barred outright, whether by rule or by the chosen base.
	* @type {number}
	*/
	static BlockedIcon = 90;
	/**
	* Icon marking the physical copy the player already committed as the base.
	* @type {number}
	*/
	static ChosenBaseIcon = 91;
	/**
	* Icon shown on a row that has hit a ceiling - fully refined, or at its trait cap.
	* @type {number}
	*/
	static CappedIcon = 92;
	/**
	* Whether this equip can never fill this role, so the list should not offer it at all.
	*
	* @param {RPG_EquipItem} equip The equip being considered.
	* @param {boolean} isPrimary True when filling the base slot, false when filling the donor slot.
	* @returns {boolean}
	*/
	static isPermanentlyExcluded(equip, isPrimary) {
		if (equip.jaftingUnrefinable) {
			return true;
		}
		if (isPrimary) {
			return equip.jaftingNotRefinementBase;
		}
		return equip.jaftingNotRefinementMaterial;
	}
	/**
	* Judges one equip for the role currently being filled.
	*
	* Deliberately answers about the **template** rather than a particular copy of it. Which physical copy the player
	* is pointing at only matters for refusing to feed a base to itself, and that is the list's own business - every
	* copy of one template shares the verdict returned here, which is exactly what lets the sort treat them as a
	* block.
	*
	* @param {RPG_EquipItem} equip The equip being considered.
	* @param {boolean} isPrimary True when filling the base slot, false when filling the donor slot.
	* @param {RPG_EquipItem|null} baseSelection The already-chosen base, or null while choosing one.
	* @returns {{ enabled: boolean, iconIndex: number, errorText: string }}
	*/
	static evaluate(equip, isPrimary, baseSelection) {
		if (isPrimary) {
			return RefinementEligibility.evaluateAsBase(equip);
		}
		return RefinementEligibility.evaluateAsMaterial(equip, baseSelection);
	}
	/**
	* Judges an equip offered as the thing being improved.
	*
	* @param {RPG_EquipItem} equip The equip being considered.
	* @returns {{ enabled: boolean, iconIndex: number, errorText: string }}
	*/
	static evaluateAsBase(equip) {
		const verdict = {
			enabled: true,
			iconIndex: equip.iconIndex,
			errorText: String.empty
		};
		const refineCap = equip.jaftingMaxRefineCount;
		const isMaxRefined = refineCap === 0 ? false : refineCap <= equip.jaftingRefinedCount;
		if (isMaxRefined) {
			verdict.enabled = false;
			verdict.iconIndex = RefinementEligibility.CappedIcon;
			verdict.errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxRefineCount}\n`;
		}
		const traitCap = equip.jaftingMaxTraitCount;
		const currentTraits = JaftingManager.parseTraits(equip).length;
		const hasMaxTraits = traitCap === 0 ? false : traitCap <= currentTraits;
		if (hasMaxTraits) {
			verdict.enabled = false;
			verdict.iconIndex = RefinementEligibility.CappedIcon;
			verdict.errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxTraitCount}\n`;
		}
		return verdict;
	}
	/**
	* Judges an equip offered as the thing being consumed.
	*
	* @param {RPG_EquipItem} equip The equip being considered.
	* @param {RPG_EquipItem|null} baseSelection The already-chosen base, or null while choosing one.
	* @returns {{ enabled: boolean, iconIndex: number, errorText: string }}
	*/
	static evaluateAsMaterial(equip, baseSelection) {
		const verdict = {
			enabled: true,
			iconIndex: equip.iconIndex,
			errorText: String.empty
		};
		if (JaftingManager.parseTraits(equip).length === 0) {
			verdict.enabled = false;
			verdict.errorText += `${J.JAFTING.EXT.REFINE.Messages.NoTraitsOnMaterial}\n`;
		}
		if (baseSelection === null) {
			return verdict;
		}
		RefinementEligibility.applyRefineCountCeiling(verdict, equip, baseSelection);
		RefinementEligibility.applyTraitCountCeiling(verdict, equip, baseSelection);
		return verdict;
	}
	/**
	* Bars a donor when the base has already been refined as many times as it is allowed to be.
	*
	* The donor itself is not consulted. Every refinement costs the base exactly one count regardless of
	* how much history the donor brought with it, so what a donor accumulated has no bearing on whether
	* the base can accept it.
	*
	* @param {{ enabled: boolean, iconIndex: number, errorText: string }} verdict The verdict being amended.
	* @param {RPG_EquipItem} _equip The donor being considered, which this ceiling does not depend on.
	* @param {RPG_EquipItem} baseSelection The chosen base.
	*/
	static applyRefineCountCeiling(verdict, _equip, baseSelection) {
		const cap = baseSelection.jaftingMaxRefineCount;
		if (cap === 0) {
			return;
		}
		const projected = baseSelection.jaftingRefinedCount + 1;
		if (cap >= projected) {
			return;
		}
		verdict.enabled = false;
		verdict.iconIndex = RefinementEligibility.BlockedIcon;
		verdict.errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedRefineCount} ${projected}/${cap}.<br>\n`;
	}
	/**
	* Whether this equip should sort with the crafted goods rather than the stock ones.
	*
	* Anything carrying dismantle history or a refine counter has a story, and those are the rows a player browsing
	* this list is usually looking for. Note this asks about the **template**, never a single copy of it - ordering on
	* a per-copy value would reshuffle identical rows every time the list refreshed.
	*
	* @param {RPG_EquipItem} equip The equip being considered.
	* @returns {boolean}
	*/
	static hasStampedLineage(equip) {
		if (equip.jaftingRefinedCount > 0) {
			return true;
		}
		const ledger = JaftingSalvageManager.getLedgerForDatum(equip);
		if (ledger === null) {
			return false;
		}
		return ledger.rows.length > 0;
	}
	/**
	* Orders two judged rows for display.
	*
	* **Usable first, and that is the point of the whole exercise.** Everything after it is the ordering this list
	* always had: rows with a history above stock equipment, weapons before armor, then by id so copies of one
	* template stay together.
	*
	* @param {{ equip: RPG_EquipItem, verdict: { enabled: boolean } }} left The row being placed.
	* @param {{ equip: RPG_EquipItem, verdict: { enabled: boolean } }} right The row it is compared against.
	* @returns {number}
	*/
	static compareCandidates(left, right) {
		if (left.verdict.enabled !== right.verdict.enabled) {
			return left.verdict.enabled ? -1 : 1;
		}
		const leftStamped = RefinementEligibility.hasStampedLineage(left.equip);
		const rightStamped = RefinementEligibility.hasStampedLineage(right.equip);
		if (leftStamped !== rightStamped) {
			return leftStamped ? -1 : 1;
		}
		if (left.equip.etypeId !== right.equip.etypeId) {
			return left.equip.etypeId - right.equip.etypeId;
		}
		return left.equip.id - right.equip.id;
	}
	/**
	* Bars a donor whose traits would push the merged result past the base's trait ceiling.
	*
	* @param {{ enabled: boolean, iconIndex: number, errorText: string }} verdict The verdict being amended.
	* @param {RPG_EquipItem} equip The donor being considered.
	* @param {RPG_EquipItem} baseSelection The chosen base.
	*/
	static applyTraitCountCeiling(verdict, equip, baseSelection) {
		const cap = baseSelection.jaftingMaxTraitCount;
		if (cap === 0) {
			return;
		}
		const projectedOutput = JaftingManager.determineRefinementOutput(baseSelection, equip);
		const projectedTraits = JaftingManager.parseTraits(projectedOutput).length;
		if (cap >= projectedTraits) {
			return;
		}
		verdict.enabled = false;
		verdict.iconIndex = RefinementEligibility.CappedIcon;
		verdict.errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedTraitCount} ${projectedTraits}/${cap}.<br>\n`;
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinementStepHint.js
/**
* Short workflow copy above the refinable lists so the base vs material steps read clearly.
*/
var Window_RefinementStepHint = class extends Window_Base {
	/**
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this._text = String.empty;
	}
	/**
	* @param {string} text Plain instruction line (no control codes; keeps to one row).
	*/
	setText(text) {
		if (this._text === text) {
			return;
		}
		this._text = text;
		this.refresh();
	}
	/**
	* @returns {string}
	*/
	getText() {
		return this._text;
	}
	/**
	* Single-line instruction across the full width; truncates if it cannot fit.
	*/
	refresh() {
		this.contents.clear();
		const x = 0;
		const y = 0;
		const { innerWidth } = this;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(this.getText(), x, y, innerWidth, "left");
		this.resetTextColor();
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinementDescription.js
var Window_RefinementDescription = class extends Window_Help {
	constructor(rect) {
		super(rect);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinableList.js
/**
* Refinement equip list + its one remaining paint helper.<br>
* <br>
* **Two different questions, and only one of them lives here now.** Whether a row is usable, and how usable rows
* order against unusable ones, is {@link RefinementEligibility} - decided for every row before any row is drawn,
* because a sort cannot put the usable ones first while each row only learns its own verdict as it is built.
* {@link refinableEquipHasSalvageStamp} stays, and drives **per-row paint** when the stack UI passes a `unitOrdinal`
* so only the expanded copy shows the hollow diamond from
* {@link J.JAFTING.EXT.REFINE.Messages.RefinableListSalvageStampPrefix}.<br>
* Keep those roles split—ordering on a `unitOrdinal` would scramble identical rows every refresh.
*/
/**
* True when this row should show dismantle lineage styling (per stack slot when expanded).
*
* @param {RPG_EquipItem} equip The equip driving this step.
* @param {number|undefined|null} unitOrdinal The unit ordinal driving this step.
* @returns {boolean}
*/
function refinableEquipHasSalvageStamp(equip, unitOrdinal) {
	const ledger = JaftingSalvageManager.getLedgerUnitForDatum(equip, unitOrdinal);
	if (ledger === null || ledger === undefined) {
		return false;
	}
	if (!ledger.rows || ledger.rows.length === 0) {
		return false;
	}
	return true;
}
/**
* Command list of party weapons/armors eligible in the Refinement scene (base pick, material pick, or projected
* output). Pair with the two module-level helpers above for salvage-aware sort + prefix drawing.
*/
var Window_RefinableList = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.opacity = 0;
	}
	/**
	* Initializes the properties of this class.
	*/
	initMembers() {
		/**
		* The currently selected index of this equip selection window.
		* @type {number}
		*/
		this._currentIndex = null;
		/**
		* Whether or not this equip list window is the primary equip or not.
		* @type {boolean}
		*/
		this._isPrimaryEquipWindow = false;
		/**
		* The current equip that is selected as the base for refinement.
		* @type {RPG_EquipItem}
		*/
		this._primarySelection = null;
		/**
		* The projected result of refining the base item with the selected material.
		* @type {RPG_EquipItem}
		*/
		this._projectedOutput = null;
		/**
		* Ordinal of the base row the player confirmed (per expanded copy); null when not tracking a slot.
		* @type {number|null}
		*/
		this._baseSelectionUnitOrdinal = null;
	}
	/**
	* Gets whether or not this equip list window is the primary equip or not.
	* @returns {boolean}
	*/
	get isPrimary() {
		return this._isPrimaryEquipWindow;
	}
	/**
	* Sets whether or not this equip list window is the base equip or not.
	*/
	set isPrimary(primary) {
		this._isPrimaryEquipWindow = primary;
		this.refresh();
	}
	/**
	* Gets which physical copy of {@link #baseSelection} the scene locked in for material picking.
	* @returns {number|null}
	*/
	get baseSelectionUnitOrdinal() {
		return this._baseSelectionUnitOrdinal;
	}
	/**
	* Sets which physical copy of the base equip is reserved while the consumable list is open.
	*/
	set baseSelectionUnitOrdinal(value) {
		this._baseSelectionUnitOrdinal = value;
	}
	/**
	* Gets the base selection.
	* Always null if this is the primary equip window.
	* @returns {RPG_EquipItem}
	*/
	get baseSelection() {
		return this._primarySelection;
	}
	/**
	* Sets the primary selection.
	*/
	set baseSelection(equip) {
		this._primarySelection = equip;
	}
	/**
	* Overwrites {@link #itemTextAlign}.<br/>
	* Sets the alignment for this command window to be left-aligned.
	*/
	itemTextAlign() {
		return "left";
	}
	/**
	* Creates a list of all available equipment in the inventory.
	*/
	makeCommandList() {
		let equips = $gameParty.equipItems();
		if (!equips.length) return;
		if (this.isPrimary) {
			equips = equips.filter((equip) => {
				if (JaftingSalvageLedger.isMaterialArmorDatum(equip)) {
					return false;
				}
				if (JaftingSalvageLedger.isMaterialWeaponDatum(equip)) {
					return false;
				}
				return true;
			});
		}
		const offerable = equips.filter((equip) => !RefinementEligibility.isPermanentlyExcluded(equip, this.isPrimary));
		const judged = offerable.map((equip) => ({
			equip,
			verdict: RefinementEligibility.evaluate(equip, this.isPrimary, this.baseSelection)
		}));
		judged.sort(RefinementEligibility.compareCandidates);
		judged.forEach((candidate) => {
			const { equip, verdict } = candidate;
			const isStackCountedRow = JaftingSalvageLedger.isStackCountedRefinableEquip(equip);
			const count = $gameParty.numItems(equip);
			if (count < 1) {
				return;
			}
			if (isStackCountedRow) {
				this.addRefinableEquipCommand(equip, null, verdict);
				return;
			}
			for (let u = 0; u < count; u++) {
				const unitSlot = {
					unitOrdinal: u,
					unitsTotal: count
				};
				this.addRefinableEquipCommand(equip, unitSlot, verdict);
			}
		});
	}
	/**
	* Builds and appends one refinable row (salvage stamp label, optional stack count, per-copy markers).
	*
	* The verdict arrives already decided by {@link RefinementEligibility}, shared by every copy of this template.
	* What is left here is genuinely per-copy: marking the exact copy the player committed as the base, and refusing
	* to feed that copy to itself. Neither is knowable from the template alone.
	*
	* @param {RPG_EquipItem} equip The equip driving this step.
	* @param {{ unitOrdinal: number, unitsTotal: number }|null} unitSlot Pass null for stack-counted material rows.
	* @param {{ enabled: boolean, iconIndex: number, errorText: string }} verdict This template's eligibility.
	*/
	addRefinableEquipCommand(equip, unitSlot, verdict) {
		const isStackCountedRow = JaftingSalvageLedger.isStackCountedRefinableEquip(equip);
		const hasUnit = unitSlot !== null;
		if (isStackCountedRow === hasUnit) {
			return;
		}
		const rowOrdinal = hasUnit ? unitSlot.unitOrdinal : null;
		const isChosenBaseCopy = this.isChosenBaseCopy(equip, rowOrdinal);
		const label = this.rowLabelFor(equip, rowOrdinal);
		const enabled = verdict.enabled && this.isSpendableCopy(equip, isChosenBaseCopy);
		const iconIndex = isChosenBaseCopy ? RefinementEligibility.ChosenBaseIcon : verdict.iconIndex;
		const rightText = isStackCountedRow ? `x${$gameParty.numItems(equip)}` : String.empty;
		const extData = {
			data: equip,
			error: verdict.errorText
		};
		if (hasUnit) {
			extData.unitOrdinal = unitSlot.unitOrdinal;
			extData.unitsTotal = unitSlot.unitsTotal;
		}
		const helpText = enabled ? equip.description : this.blockedReasonText(verdict);
		const command = new WindowCommandBuilder(label.name).setSymbol("refine-object").setEnabled(enabled).setExtensionData(extData).setIconIndex(iconIndex).setColorIndex(label.colorIndex).setRightText(rightText).setHelpText(helpText).build();
		this.addBuiltCommand(command);
	}
	/**
	* The verdict's reasons, tidied into something a two-line help window can show.
	*
	* The reasons accumulate as a run-on string because more than one can apply at once, and they are not
	* consistent about how they end - some close with a newline, some with `<br>`. Normalizing here rather
	* than at each message keeps the messages readable as sentences.
	* @param {{ enabled: boolean, iconIndex: number, errorText: string }} verdict This row's eligibility.
	* @returns {string}
	*/
	blockedReasonText(verdict) {
		return verdict.errorText.replaceAll("<br>", String.empty).split("\n").map((line) => line.trim()).filter((line) => line.length > 0).join("\n");
	}
	/**
	* Whether this row is the exact physical copy the player already committed as the base.
	*
	* Both halves matter. The same template is not enough - a player who owns three of a weapon may refine one into
	* another - and an ordinal only means something once a base copy has actually been locked in.
	*
	* @param {RPG_EquipItem} equip The equip this row draws.
	* @param {number|null} rowOrdinal Which copy this row is, or null for a stack-counted row.
	* @returns {boolean}
	*/
	isChosenBaseCopy(equip, rowOrdinal) {
		if (equip !== this.baseSelection) {
			return false;
		}
		if (rowOrdinal === null) {
			return false;
		}
		const baseOrdinal = this.baseSelectionUnitOrdinal;
		if (baseOrdinal === null) {
			return false;
		}
		return rowOrdinal === baseOrdinal;
	}
	/**
	* Whether this copy may be spent as the donor.
	*
	* A template can be fed to itself - two of the same sword merging is legitimate - but only when a second copy
	* exists to be consumed, and never using the very copy standing in as the base.
	*
	* @param {RPG_EquipItem} equip The equip this row draws.
	* @param {boolean} isChosenBaseCopy Whether this row is the committed base copy.
	* @returns {boolean}
	*/
	isSpendableCopy(equip, isChosenBaseCopy) {
		if (this.isPrimary) {
			return true;
		}
		if (equip !== this.baseSelection) {
			return true;
		}
		const templateStack = $gameParty.numItems(this.baseSelection);
		return templateStack > 1 && isChosenBaseCopy === false;
	}
	/**
	* The name and colour a row draws with.
	*
	* Dismantle lineage earns the hollow diamond, and a refine counter earns the same accent even when the merged
	* salvage rows came out empty - a `+N` output should not look like stock gear just because its donor was a
	* vendor shell with nothing to refund.
	*
	* @param {RPG_EquipItem} equip The equip this row draws.
	* @param {number|null} rowOrdinal Which copy this row is, or null for a stack-counted row.
	* @returns {{ name: string, colorIndex: number }}
	*/
	rowLabelFor(equip, rowOrdinal) {
		const hasSalvageStamp = refinableEquipHasSalvageStamp(equip, rowOrdinal);
		const stamped = hasSalvageStamp || equip.jaftingRefinedCount > 0;
		if (!stamped) {
			return {
				name: equip.name,
				colorIndex: 0
			};
		}
		const { RefinableListSalvageStampPrefix } = J.JAFTING.EXT.REFINE.Messages;
		return {
			name: `${RefinableListSalvageStampPrefix}${equip.name}`,
			colorIndex: 6
		};
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinementDetails.js
/**
* The window containing the chosen equips for refinement and also the projected results.
*/
var Window_RefinementDetails = class Window_RefinementDetails extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
		this.initMembers();
		this.opacity = 220;
	}
	/**
	* Initializes all members of this window.
	*/
	initMembers() {
		/**
		* The primary equip that is the refinement target.
		* Traits from the secondary equip will be transfered to this equip.
		* @type {RPG_EquipItem}
		*/
		this._primaryEquip = null;
		/**
		* The secondary equip that is the refinement material.
		* The transferable traits on this equip will be transfered to the target.
		* @type {RPG_EquipItem}
		*/
		this._secondaryEquip = null;
		/**
		* The output of what would be the result from refining these items.
		* @type {RPG_EquipItem}
		*/
		this._resultingEquip = null;
	}
	/**
	* Gets the primary equip selected, aka the refinement target.
	* @returns {RPG_EquipItem}
	*/
	get primaryEquip() {
		return this._primaryEquip;
	}
	/**
	* Sets the primary equip selected, aka the refinement target.
	* @param {RPG_EquipItem} equip The equip to set as the target.
	*/
	set primaryEquip(equip) {
		this._primaryEquip = equip;
		this.refresh();
	}
	/**
	* Gets the secondary equip selected, aka the refinement material.
	* @returns {RPG_EquipItem}
	*/
	get secondaryEquip() {
		return this._secondaryEquip;
	}
	/**
	* Sets the secondary equip selected, aka the refinement material.
	* @param {RPG_EquipItem} equip The equip to set as the material.
	*/
	set secondaryEquip(equip) {
		this._secondaryEquip = equip;
		this.refresh();
	}
	/**
	* Gets the resulting equip from the output.
	*/
	get outputEquip() {
		return this._resultingEquip;
	}
	/**
	* Sets the resulting equip to the output to allow for the scene to grab the data.
	* @param {RPG_EquipItem} equip The equip to set.
	*/
	set outputEquip(equip) {
		this._resultingEquip = equip;
	}
	/**
	* The width each of the two list columns occupies.
	*
	* Fixed rather than a share of the panel, so an equip name has a predictable amount of room no matter
	* how wide the screen is. The result column takes whatever remains, which is deliberate - the result
	* is the answer the scene exists to give, so it should be the widest thing on it.
	* @returns {number}
	*/
	static ListColumnWidthCap = 470;
	/**
	* The width one list column takes out of a given inner width.
	*
	* A share rather than a constant, capped so it stops growing once a name has all the room it could
	* want. A fixed width starved the result column at lower resolutions; an uncapped share made the lists
	* absurdly wide at higher ones.
	*
	* **This is the single source for the split** - the scene positions its two list windows against this
	* same function, so the columns and the headings above them cannot disagree.
	* @param {number} innerWidth The drawable width of the panel.
	* @returns {number}
	*/
	static listColumnWidthFromInner(innerWidth) {
		return Math.min(Window_RefinementDetails.ListColumnWidthCap, Math.floor(innerWidth * .3));
	}
	/**
	* The three column origins, in this window's inner coordinates.
	* @returns {number[]}
	*/
	columnXs() {
		const listWidth = Window_RefinementDetails.listColumnWidthFromInner(this.innerWidth);
		return [
			0,
			listWidth,
			listWidth * 2
		];
	}
	/**
	* The width of the result column, which is everything the two lists did not take.
	* @returns {number}
	*/
	resultColumnWidth() {
		const listWidth = Window_RefinementDetails.listColumnWidthFromInner(this.innerWidth);
		return Math.max(96, this.innerWidth - listWidth * 2);
	}
	/**
	* Max draw width for text inside one column.
	* @param {number} columnWidth The width of the column being drawn into.
	* @returns {number}
	*/
	columnTextWidth(columnWidth) {
		return Math.max(64, columnWidth - 12);
	}
	/**
	* The inner Y where each column's content begins - below the titles and the rule under them.
	*
	* The scene positions the two list windows against this, which is the reason the headers live on this
	* window rather than on three of their own: one measurement, one baseline, and the columns cannot
	* drift apart.
	* @returns {number}
	*/
	columnContentInnerStartY() {
		return this.lineHeight() * 2 + 10;
	}
	refresh() {
		this.contents.clear();
		this.drawContent();
	}
	/**
	* The heading each column carries, paired with a line saying what the column is for.
	*
	* The lists themselves used to be unlabelled entirely, which was survivable while only one was on
	* screen at a time and a hint bar narrated which phase you were in. Two similar-looking columns of
	* equipment need saying which is which.
	* @returns {{title: string, subtext: string}[]}
	*/
	columnHeadings() {
		return [
			{
				title: J.JAFTING.EXT.REFINE.Messages.TitleBase,
				subtext: "The equipment being upgraded."
			},
			{
				title: J.JAFTING.EXT.REFINE.Messages.TitleMaterial,
				subtext: "Consumed; its effects merge into the base."
			},
			{
				title: J.JAFTING.EXT.REFINE.Messages.TitleOutput,
				subtext: "What you get if you confirm."
			}
		];
	}
	/**
	* Draws all content in this window.
	*
	* The headers draw unconditionally: they are the labels for two list windows that are always on
	* screen, so withholding them until something is selected would leave those lists unlabelled exactly
	* when the player most needs to know what they are choosing between.
	*/
	drawContent() {
		this.drawRefinementHeaders();
		this.drawRefinementResult();
	}
	/**
	* Draws every column's title, its explanatory line, and the rule that separates them from content.
	*/
	drawRefinementHeaders() {
		const headings = this.columnHeadings();
		const columnXs = this.columnXs();
		const listWidth = Window_RefinementDetails.listColumnWidthFromInner(this.innerWidth);
		const ruleY = this.columnContentInnerStartY() - 8;
		headings.forEach((heading, index) => {
			const columnWidth = index === 2 ? this.resultColumnWidth() : listWidth;
			const textWidth = this.columnTextWidth(columnWidth);
			const x = columnXs[index];
			this.resetFontSettings();
			this.modFontSize(4);
			this.toggleBold(true);
			this.drawText(heading.title, x, 0, textWidth, Window_Base.TextAlignments.Left);
			this.toggleBold(false);
			this.resetFontSettings();
			this.modFontSize(-4);
			this.changeTextColor(ColorManager.textColor(7));
			this.drawText(heading.subtext, x, this.lineHeight(), textWidth, Window_Base.TextAlignments.Left);
			this.resetTextColor();
			this.resetFontSettings();
			this.drawHorizontalLine(x, ruleY, textWidth);
		});
	}
	/**
	* The name a refined output carries, with its `+N` suffix advanced by one.
	* @param {RPG_EquipItem} equip The projected output.
	* @returns {string}
	*/
	outputDisplayName(equip) {
		const suffix = `+${equip.jaftingRefinedCount + 1}`;
		const plusIndex = equip.name.lastIndexOf("+");
		if (plusIndex === -1) return `${equip.name} ${suffix}`;
		return `${equip.name.slice(0, plusIndex)}${suffix}`;
	}
	/**
	* Pairs up what the base has now against what the projected result would have, per effect.
	*
	* Keyed on code and dataId together, because that pair is what identifies an effect - two traits
	* sharing a code are different stats. An effect the base does not carry arrives with a null `before`,
	* which is what lets the column say "new" rather than quietly listing it alongside the rest.
	* @param {RPG_EquipItem} result The projected refinement output.
	* @returns {{key: string, trait: JAFTING_Trait, before: (JAFTING_Trait|null)}[]}
	*/
	buildResultComparison(result) {
		const keyOf = (trait) => `${trait.code()}:${trait.dataId()}`;
		const baseTraits = new Map();
		JaftingManager.parseTraits(this.primaryEquip).forEach((trait) => baseTraits.set(keyOf(trait), trait));
		const resultTraits = new Map();
		JaftingManager.parseTraits(result).forEach((trait) => resultTraits.set(keyOf(trait), trait));
		const keys = [...new Set([...baseTraits.keys(), ...resultTraits.keys()])];
		const rows = keys.map((key) => {
			const before = baseTraits.has(key) ? baseTraits.get(key) : null;
			const after = resultTraits.has(key) ? resultTraits.get(key) : null;
			return {
				key,
				before,
				after
			};
		});
		return rows.sort((a, b) => {
			const left = a.after === null ? a.before : a.after;
			const right = b.after === null ? b.before : b.after;
			return left.code() - right.code() || left.dataId() - right.dataId();
		});
	}
	/**
	* The neutral value a trait code sits at when nothing is contributing to it.
	*
	* Needed to size the gain on an effect the base did not carry: the "before" is not zero, it is whatever
	* that code treats as no-effect, and the two differ. Matches what {@link TraitResolver} uses when it
	* combines same-code traits.
	* @param {number} code The trait code.
	* @returns {number}
	*/
	neutralValueForCode(code) {
		if (code === 22) return 0;
		return 1;
	}
	/**
	* Draws the projected refinement result into the third column, as a before-and-after.
	*
	* Only the result is drawn here now. The base and the donor are each visible in their own list, so
	* repeating them in this window was showing the player two things they had just chosen and calling it
	* detail. What is genuinely only knowable here is the *change*, which is what this column reports.
	*/
	drawRefinementResult() {
		if (!this.primaryEquip || !this.secondaryEquip) return;
		const result = JaftingManager.determineRefinementOutput(this.primaryEquip, this.secondaryEquip);
		const [, , x] = this.columnXs();
		const columnWidth = this.resultColumnWidth();
		const textWidth = this.columnTextWidth(columnWidth);
		const lh = this.lineHeight();
		let y = this.columnContentInnerStartY();
		this.drawTextEx(`\\I[${result.iconIndex}] \\C[6]${this.outputDisplayName(result)}\\C[0]`, x, y, textWidth);
		this.drawResultComparisonHeadings(x, y, textWidth);
		y += Math.floor(lh * 1.5);
		const comparison = this.buildResultComparison(result);
		if (comparison.length === 0) {
			this.drawTextEx(`${J.JAFTING.EXT.REFINE.Messages.NoTransferableTraits}`, x, y, textWidth);
		} else {
			const quantified = comparison.filter((row) => this.isQuantifiedRow(row));
			const granted = comparison.filter((row) => !this.isQuantifiedRow(row));
			quantified.forEach((row) => {
				this.drawResultComparisonRow(row, result, x, y, textWidth);
				y += lh;
			});
			if (quantified.length > 0 && granted.length > 0) y += Math.floor(lh * .5);
			granted.forEach((row) => {
				this.drawGrantedRow(row, x, y, textWidth);
				y += lh;
			});
		}
		const noteEffects = JaftingManager.buildNoteEffectComparison(this.primaryEquip, result);
		if (noteEffects.length > 0) {
			y += Math.floor(lh * .5);
			y = this.drawNoteEffectsHeading(x, y, textWidth);
			noteEffects.forEach((row) => {
				this.drawNoteEffectRow(row, x, y, textWidth);
				y += lh;
			});
		}
		this.drawRefinementCounter(result, x, y + Math.floor(lh * .5), textWidth);
		this.outputEquip = result;
	}
	/**
	* Whether this row's effect is an amount that can be compared, rather than a thing that is simply had.
	*
	* Only the three parameter codes carry a value worth putting in a before-and-after. Everything else
	* formats as a name - a skill to learn, an element to strike with, a slot to seal - and the only news
	* about one of those is whether the merge brought it along.
	* @param {{before: (JAFTING_Trait|null), after: (JAFTING_Trait|null)}} row The paired effect.
	* @returns {boolean}
	*/
	isQuantifiedRow(row) {
		const sample = row.after === null ? row.before : row.after;
		const code = sample.code();
		return code === 21 || code === 22 || code === 23;
	}
	/**
	* Draws an effect that is had rather than measured, on one full-width line.
	*
	* The whole row width goes to the label, because these read as sentences - "Learn: Palate Cleanser" -
	* and the only column beside it says whether it is arriving, leaving, or staying put.
	* @param {{before: (JAFTING_Trait|null), after: (JAFTING_Trait|null)}} row The paired effect.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} textWidth The drawable width of the result column.
	*/
	drawGrantedRow(row, x, y, textWidth) {
		const { colW } = this.resultComparisonColumns(textWidth);
		const sample = row.after === null ? row.before : row.after;
		const iconIndex = sample.convertToRmTrait().iconIndex();
		const labelWidth = textWidth - colW - 8;
		const label = iconIndex > 0 ? `\\I[${iconIndex}]${sample.nameAndValue}` : sample.nameAndValue;
		this.drawTextEx(label, x, y, labelWidth);
		this.drawGrantedVerdict(row, x + labelWidth + 8, y, colW);
	}
	/**
	* Draws what became of one granted effect, in the column its numeric siblings use for their modifier.
	*
	* Every row gets an answer here, including the ones that arrived untouched. The alternative - dimming
	* the label of a carried effect and leaving this column empty - meant brightness carried meaning for
	* one row shape and none for the other, and grey is already what this scene's donor list uses for rows
	* you cannot pick. A carried effect is the opposite of unavailable.
	* @param {{before: (JAFTING_Trait|null), after: (JAFTING_Trait|null)}} row The paired effect.
	* @param {number} x The verdict column's absolute origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} colW The verdict column's width.
	*/
	drawGrantedVerdict(row, x, y, colW) {
		const alignRight = Window_Base.TextAlignments.Right;
		if (row.after === null) {
			this.changeTextColor(ColorManager.textColor(18));
			this.drawText("lost", x, y, colW, alignRight);
			this.resetTextColor();
			return;
		}
		if (row.before === null) {
			this.changeTextColor(ColorManager.textColor(24));
			this.drawText("new", x, y, colW, alignRight);
			this.resetTextColor();
			return;
		}
		this.changeTextColor(ColorManager.textColor(7));
		this.drawText("-", x, y, colW, alignRight);
		this.resetTextColor();
	}
	/**
	* Labels the note-effect block, so a raw tag key is not mistaken for a broken trait row.
	*
	* These rows read differently from everything above them - a key as authored on the left, a value as
	* authored on the right - and saying so is what stops `cdmBuffPlus` looking like a rendering fault.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} textWidth The drawable width of the result column.
	* @returns {number} The vertical position the first row should start at.
	*/
	drawNoteEffectsHeading(x, y, textWidth) {
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.textColor(7));
		this.drawText("note effects", x, y, textWidth, Window_Base.TextAlignments.Left);
		this.resetTextColor();
		this.resetFontSettings();
		return y + this.lineHeight();
	}
	/**
	* Draws one transferable note effect: its tag key, and what its value becomes.
	*
	* Presented exactly as authored, because nothing here knows what a tag means. A value that changed
	* shows both sides so the movement is visible; one arriving from the donor shows only what it will be,
	* since it had no previous value to move from.
	* @param {{key: string, before: (string|null), after: string}} row The paired effect.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} textWidth The drawable width of the result column.
	*/
	drawNoteEffectRow(row, x, y, textWidth) {
		const { nameWidth } = this.resultComparisonColumns(textWidth);
		const valueWidth = textWidth - nameWidth - 8;
		this.drawText(row.key, x, y, nameWidth, Window_Base.TextAlignments.Left);
		const isNew = row.before === null;
		const isUnchanged = row.before === row.after;
		const valueText = isNew || isUnchanged ? row.after : `${row.before} -> ${row.after}`;
		const colorIndex = isUnchanged ? 7 : 24;
		this.changeTextColor(ColorManager.textColor(colorIndex));
		this.drawText(valueText, x + nameWidth + 8, y, valueWidth, Window_Base.TextAlignments.Right);
		this.resetTextColor();
	}
	/**
	* The x offsets, relative to the column origin, of the before / after / delta columns.
	*
	* The three numeric columns are kept deliberately narrow and adjacent rather than spread across the
	* full width. Three numbers that belong to one row have to be readable as a group; spacing them evenly
	* across the column made each row look like three unrelated facts.
	* @param {number} textWidth The drawable width of the result column.
	* @returns {{beforeX: number, afterX: number, deltaX: number, colW: number, nameWidth: number}}
	*/
	resultComparisonColumns(textWidth) {
		const colW = 96;
		const groupWidth = colW * 3;
		const nameWidth = Math.max(120, textWidth - groupWidth - 8);
		return {
			beforeX: nameWidth + 8,
			afterX: nameWidth + 8 + colW,
			deltaX: nameWidth + 8 + colW * 2,
			colW,
			nameWidth
		};
	}
	/**
	* Labels the three numeric columns, on the same line as the output's name.
	*
	* Drawn on every refresh rather than only when a numeric row exists, so the block beneath keeps one
	* fixed starting height. Switching between a donor that grants an amount and one that grants a name
	* otherwise moved every row a line up or down, which read as the panel twitching.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at, shared with the output's name.
	* @param {number} textWidth The drawable width of the result column.
	*/
	drawResultComparisonHeadings(x, y, textWidth) {
		const { beforeX, afterX, deltaX, colW } = this.resultComparisonColumns(textWidth);
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.textColor(7));
		this.drawText("now", x + beforeX, y, colW, Window_Base.TextAlignments.Right);
		this.drawText("after", x + afterX, y, colW, Window_Base.TextAlignments.Right);
		this.drawText("mod", x + deltaX, y, colW, Window_Base.TextAlignments.Right);
		this.resetTextColor();
		this.resetFontSettings();
	}
	/**
	* Draws one effect's before, after, and the percentage responsible for the difference.
	*
	* The projected output arrives as a parameter rather than being read off {@link outputEquip}, which is
	* not assigned until this column has finished drawing - reading it here would measure the previous
	* pairing the player looked at.
	* @param {{trait: JAFTING_Trait, before: (JAFTING_Trait|null)}} row The paired effect.
	* @param {RPG_EquipItem} result The projected refinement output.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} textWidth The drawable width of the result column.
	*/
	drawResultComparisonRow(row, result, x, y, textWidth) {
		const { beforeX, afterX, deltaX, colW, nameWidth } = this.resultComparisonColumns(textWidth);
		const sample = row.after === null ? row.before : row.after;
		const iconIndex = sample.convertToRmTrait().iconIndex();
		const label = iconIndex > 0 ? `\\I[${iconIndex}]${sample.name}` : sample.name;
		this.drawTextEx(label, x, y, nameWidth);
		const code = sample.code();
		const dataId = sample.dataId();
		const before = this.localWorthFor(this.primaryEquip, code, dataId);
		const after = this.localWorthFor(result, code, dataId);
		this.drawText(`${before}`, x + beforeX, y, colW, Window_Base.TextAlignments.Right);
		this.drawText(`${after}`, x + afterX, y, colW, Window_Base.TextAlignments.Right);
		this.drawResultComparisonModifier(row, x + deltaX, y, colW);
	}
	/**
	* What an equip is worth for one parameter on its own, as a whole number ready to draw.
	*
	* Its base for that stat amplified by its own percentages - the same arithmetic the battler performs
	* when it asks equipment what it contributes, so this column cannot disagree with the stat screen.
	* Base parameters read a flat amount; the other two families are already whole percents.
	* @param {RPG_EquipItem} equip The equip to measure.
	* @param {number} code The trait code: 21, 22, or 23.
	* @param {number} dataId The parameter id within that family.
	* @returns {number}
	*/
	localWorthFor(equip, code, dataId) {
		const ownRate = equip.ownRate(code, dataId);
		if (code === 21) {
			return Math.round(equip.thisBParam(dataId) * ownRate);
		}
		if (code === 22) {
			return Math.round(equip.thisXParam(dataId) * ownRate);
		}
		return Math.round(equip.thisSParam(dataId) * ownRate);
	}
	/**
	* Draws the percentage the projected result carries for this row.
	*
	* The two columns to the left say what the equip is worth before and after, which is the number a
	* player acts on. This column says what is producing that difference - the modifier itself - so a row
	* reads as a claim and its evidence rather than as a bare percentage of nothing in particular.
	* @param {{before: (JAFTING_Trait|null), after: (JAFTING_Trait|null)}} row The paired effect.
	* @param {number} x The modifier column's absolute origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} colW The modifier column's width.
	*/
	drawResultComparisonModifier(row, x, y, colW) {
		const alignRight = Window_Base.TextAlignments.Right;
		if (row.after === null) {
			this.changeTextColor(ColorManager.textColor(18));
			this.drawText("lost", x, y, colW, alignRight);
			this.resetTextColor();
			return;
		}
		const points = this.rowModifierPoints(row);
		if (points === null) {
			const colorIndex = row.before === null ? 24 : 7;
			this.changeTextColor(ColorManager.textColor(colorIndex));
			this.drawText(row.before === null ? "new" : "-", x, y, colW, alignRight);
			this.resetTextColor();
			return;
		}
		if (points === 0) {
			this.changeTextColor(ColorManager.textColor(7));
			this.drawText("-", x, y, colW, alignRight);
			this.resetTextColor();
			return;
		}
		const isGain = points > 0;
		this.changeTextColor(ColorManager.textColor(isGain ? 24 : 18));
		this.drawText(`${isGain ? "+" : ""}${points}%`, x, y, colW, alignRight);
		this.resetTextColor();
	}
	/**
	* The percentage the projected result carries for one row, in whole points.
	*
	* Read off the result's own value rather than the difference between the two sides, because this column
	* answers "what is this item's modifier now" - the movement is already visible in the before and after
	* beside it. Codes 21 and 23 store their values as deltas from 1.0 and code 22 from 0, which is the only
	* thing separating the two arms here.
	*
	* **The row must have an `after`.** A merge that dropped an effect has no modifier left to report, and
	* {@link drawResultComparisonModifier} answers that case itself before reaching this.
	* @param {{before: (JAFTING_Trait|null), after: JAFTING_Trait}} row The paired effect, still present in the result.
	* @returns {number|null} The modifier in whole percents, or null for a code with no numeric reading.
	*/
	rowModifierPoints(row) {
		const code = row.after.code();
		if (code !== 21 && code !== 22 && code !== 23) return null;
		const neutral = this.neutralValueForCode(code);
		const { value } = row.after.convertToRmTrait();
		return Math.round((value - neutral) * 100);
	}
	/**
	* Draws how many refinements this equip will have used, against its ceiling.
	* @param {RPG_EquipItem} result The projected refinement output.
	* @param {number} x The column origin.
	* @param {number} y The vertical position to draw at.
	* @param {number} textWidth The drawable width of the result column.
	*/
	drawRefinementCounter(result, x, y, textWidth) {
		const { beforeX, afterX, deltaX, colW, nameWidth } = this.resultComparisonColumns(textWidth);
		const cap = this.primaryEquip.jaftingMaxRefineCount;
		this.modFontSize(-2);
		this.changeTextColor(ColorManager.systemColor());
		this.drawText("refinements", x, y, nameWidth, Window_Base.TextAlignments.Left);
		this.resetTextColor();
		this.drawText(`${this.primaryEquip.jaftingRefinedCount}`, x + beforeX, y, colW, Window_Base.TextAlignments.Right);
		this.drawText(`${result.jaftingRefinedCount + 1}`, x + afterX, y, colW, Window_Base.TextAlignments.Right);
		if (cap > 0) {
			this.changeTextColor(ColorManager.textColor(7));
			this.drawText(`of ${cap}`, x + deltaX, y, colW, Window_Base.TextAlignments.Right);
			this.resetTextColor();
		}
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinementConfirmation.js
/**
* A window that gives the player a chance to confirm or cancel their
* refinement before executing.
*/
var Window_RefinementConfirmation = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Overwrites {@link #makeCommandList}.<br/>
	* Creates the command list for this window.
	*/
	makeCommandList() {
		this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.ExecuteRefinementCommandName}`, `ok`, true, null, 91);
		this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.CancelRefinementCommandName}`, `cancel`, true, null, 90);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/scenes/Scene_JaftingRefine.js
var Scene_JaftingRefine = class Scene_JaftingRefine extends Scene_MenuBase {
	/**
	* Whether Refinement can open: inventory includes at least one equip enterable as a refinement base.
	* @returns {boolean}
	*/
	static isAccessible() {
		return JaftingManager.partyHasEnterableRefinementBase();
	}
	/**
	* Whether the JAFTING hub should show Refinement as selectable (menu switch plus content eligibility).
	* @returns {boolean}
	*/
	static isRefineCommandEnabled() {
		return $gameSwitches.value(J.JAFTING.EXT.REFINE.Metadata.menuSwitchId) && Scene_JaftingRefine.isAccessible();
	}
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		if (Scene_JaftingRefine.isAccessible() === false) {
			SoundManager.playBuzzer();
			return;
		}
		SceneManager.push(this);
	}
	/**
	* The symbol representing the command for this scene from other menus.
	* @type {string}
	*/
	static KEY = "jafting-refine";
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initialize the window and all properties required by the scene.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes all properties for the Refinement scene.
	*/
	initMembers() {
		super.initMembers();
		this.initCoreMembers();
		this.initPrimaryMembers();
	}
	/**
	* The core properties of this scene are the root namespace definitions for this plugin.
	*/
	initCoreMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* A grouping of all properties associated with this JAFTING scene.
		*/
		this._j._crafting = {};
	}
	/**
	* Primary state for Refinement: base and material lists, details, confirmation, and selections.
	*/
	initPrimaryMembers() {
		/**
		* A grouping of all properties associated with the jafting type of refinement.
		* Refinement is a subcategory of the jafting system.
		*/
		this._j._crafting._refine = {};
		/**
		* Phase tracking and atomic refine commit (keeps confirmation handler thin).
		* @type {RefinementWorkflowSession}
		*/
		this._j._crafting._refine._session = new RefinementWorkflowSession();
		/**
		* Explains the current refinement step above the left-hand lists.
		* @type {Window_RefinementStepHint}
		*/
		this._j._crafting._refine._refinementStepHint = null;
		/**
		* The window that shows the tertiary information about a refinable.
		* @type {Window_RefinementDescription}
		*/
		this._j._crafting._refine._refinementDescription = null;
		/**
		* The window that shows the list of equips that can be used as a base for refinement.
		* @type {Window_RefinableList}
		*/
		this._j._crafting._refine._baseRefinableList = null;
		/**
		* The window that shows the list of equips that can be used as fodder for refinement.
		* @type {Window_RefinableList}
		*/
		this._j._crafting._refine._consumedRefinableList = null;
		/**
		* The window that shows the details of the refinement given the selected entries.
		* @type {Window_RefinementDetails}
		*/
		this._j._crafting._refine._refinementDetails = null;
		/**
		* Confirms or cancels the pending refinement.
		* @type {Window_RefinementConfirmation|null}
		*/
		this._j._crafting._refine._confirmationPrompt = null;
		/**
		* The base equip currently selected for refinement.
		* @type {Game_Item|null}
		*/
		this._j._crafting._refine._baseSelected = null;
		/**
		* The material equip currently selected for refinement.
		* @type {Game_Item|null}
		*/
		this._j._crafting._refine._consumedSelected = null;
		/**
		* Ordinal of the chosen base row when stacks expand (matches {@link Window_RefinableList} extension data).
		* @type {number|null}
		*/
		this._j._crafting._refine._baseSelectedUnitOrdinal = null;
		/**
		* Lazily computed outer height for {@link Window_RefinementStepHint} (one text line).
		* @type {number|undefined}
		*/
		this._cachedRefinementStepHintHeight = undefined;
	}
	/**
	* @returns {RefinementWorkflowSession}
	*/
	refinementSession() {
		return this._j._crafting._refine._session;
	}
	getBaseSelected() {
		return this._j._crafting._refine._baseSelected;
	}
	setBaseSelected(equip) {
		this._j._crafting._refine._baseSelected = equip;
	}
	getBaseSelectedUnitOrdinal() {
		return this._j._crafting._refine._baseSelectedUnitOrdinal;
	}
	setBaseSelectedUnitOrdinal(value) {
		this._j._crafting._refine._baseSelectedUnitOrdinal = value;
	}
	getConsumedSelected() {
		return this._j._crafting._refine._consumedSelected;
	}
	setConsumedSelected(equip) {
		this._j._crafting._refine._consumedSelected = equip;
	}
	/**
	* Initialize all resources required for this scene.
	*/
	create() {
		super.create();
		this.createDisplayObjects();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
		this.configureAllWindows();
	}
	/**
	* Creates all windows in this scene.
	*/
	createAllWindows() {
		this.createRefinementStepHintWindow();
		this.createRefinementDescriptionWindow();
		this.createRefinementDetailsWindow();
		this.createBaseRefinableListWindow();
		this.createConsumableRefinableListWindow();
		this.createRefinementConfirmationWindow();
	}
	/**
	* Configures all windows.
	*/
	configureAllWindows() {
		const listWindow = this.getBaseRefinableListWindow();
		listWindow.refresh();
		this.getRefinementDescriptionWindow().setText(listWindow.currentHelpText() ?? String.empty);
		const selected = listWindow.currentExt();
		const detailsWindow = this.getRefinementDetailsWindow();
		if (selected === undefined || selected === null) {
			this.setBaseSelected(null);
			this.setBaseSelectedUnitOrdinal(null);
			detailsWindow.primaryEquip = null;
			this.refreshRefinementStepHint();
			return;
		}
		this.setBaseSelected(selected.data);
		this.setBaseSelectedUnitOrdinal(selected.unitOrdinal === undefined || selected.unitOrdinal === null ? null : selected.unitOrdinal);
		detailsWindow.primaryEquip = selected.data;
		this.refreshRefinementStepHint();
	}
	/**
	* Overwrites {@link Scene_MenuBase.prototype.createBackground}.<br/>
	* Changes the filter to a different type from {@link PIXI.filters}.<br>
	*/
	createBackground() {
		this.setBackgroundFilter(new PIXI.filters.AlphaFilter(.1));
		this.setBackgroundSprite(new Sprite());
		this.backgroundSprite().bitmap = SceneManager.backgroundBitmap();
		this.backgroundSprite().filters = [this.backgroundFilter()];
		this.addChild(this.backgroundSprite());
	}
	/**
	* Overwrites {@link #createButtons}.<br/>
	* Disables the creation of the buttons.
	* @override
	*/
	createButtons() {}
	/**
	* @returns {number} Outer height for {@link Window_RefinementStepHint} (single menu line).
	*/
	getRefinementStepHintHeight() {
		if (this._cachedRefinementStepHintHeight !== undefined) {
			return this._cachedRefinementStepHintHeight;
		}
		const probe = new Window_RefinementStepHint(new Rectangle(0, 0, 400, 48));
		this._cachedRefinementStepHintHeight = probe.fittingHeight(1);
		probe.destroy();
		return this._cachedRefinementStepHintHeight;
	}
	/**
	* @returns {number} Width shared by the two refinable lists, as the panel itself computes it.
	*/
	getBaseRefinableListColumnWidth() {
		const panelRect = this.getRefinementPanelRectangle();
		const panelWindow = this.getRefinementDetailsWindow();
		const innerWidth = panelRect.width - panelWindow.padding * 2;
		return Window_RefinementDetails.listColumnWidthFromInner(innerWidth);
	}
	/**
	* @returns {Rectangle}
	*/
	getRefinementStepHintRectangle() {
		const [ox, oy] = Graphics.boxOrigin;
		const x = ox;
		const width = Graphics.boxWidth - Graphics.horizontalPadding;
		const height = this.getRefinementStepHintHeight();
		return new Rectangle(x, oy, width, height);
	}
	/**
	* Updates the step hint from {@link RefinementWorkflowSession#getPhase}.
	*/
	refreshRefinementStepHint() {
		const hintWindow = this.getRefinementStepHintWindow();
		const phase = this.refinementSession().getPhase();
		let text = String.empty;
		if (phase === RefinementWorkflowSession.Phase.PickingBase) {
			text = J.JAFTING.EXT.REFINE.Messages.RefinementStepHintPickingBase;
		} else if (phase === RefinementWorkflowSession.Phase.PickingMaterial) {
			text = J.JAFTING.EXT.REFINE.Messages.RefinementStepHintPickingMaterial;
		} else if (phase === RefinementWorkflowSession.Phase.Confirming) {
			text = J.JAFTING.EXT.REFINE.Messages.RefinementStepHintConfirming;
		}
		hintWindow.setText(text);
	}
	/**
	* Creates the step hint window.
	*/
	createRefinementStepHintWindow() {
		const window = this.buildRefinementStepHintWindow();
		this.setRefinementStepHintWindow(window);
		this.addWindow(window);
	}
	buildRefinementStepHintWindow() {
		const rectangle = this.getRefinementStepHintRectangle();
		return new Window_RefinementStepHint(rectangle);
	}
	/**
	* @returns {Window_RefinementStepHint}
	*/
	getRefinementStepHintWindow() {
		return this._j._crafting._refine._refinementStepHint;
	}
	/**
	* @param {Window_RefinementStepHint} someWindow The some window driving this step.
	*/
	setRefinementStepHintWindow(someWindow) {
		this._j._crafting._refine._refinementStepHint = someWindow;
	}
	/**
	* Creates the RefinementDescription window.
	*/
	createRefinementDescriptionWindow() {
		const window = this.buildRefinementDescriptionWindow();
		this.setRefinementDescriptionWindow(window);
		this.addWindow(window);
	}
	buildRefinementDescriptionWindow() {
		const rectangle = this.getRefinementDescriptionRectangle();
		const window = new Window_RefinementDescription(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with this window.
	* @returns {Rectangle}
	*/
	getRefinementDescriptionRectangle() {
		const [ox, oy] = Graphics.boxOrigin;
		const x = ox;
		const y = oy + this.getRefinementStepHintHeight();
		const width = Graphics.boxWidth - Graphics.horizontalPadding;
		const height = this.calcWindowHeight(2, false);
		return new Rectangle(x, y, width, height);
	}
	/**
	* The panel every column of the refinement workflow is drawn inside.
	*
	* One backing window rather than a header per column: it owns the titles, the rules beneath them, and
	* the result itself, so the three columns share a baseline by construction instead of by three
	* windows agreeing with each other.
	* @returns {Rectangle}
	*/
	getRefinementPanelRectangle() {
		const [ox, oy] = Graphics.boxOrigin;
		const descriptionRect = this.getRefinementDescriptionRectangle();
		const x = ox;
		const y = descriptionRect.y + descriptionRect.height;
		const width = Graphics.boxWidth - Graphics.horizontalPadding;
		const height = oy + Graphics.boxHeight - y - Graphics.verticalPadding;
		return new Rectangle(x, y, width, height);
	}
	/**
	* The shared column geometry for everything drawn inside the refinement panel.
	*
	* The two lists take a fixed column each and the result takes whatever is left, because the result is
	* the answer the scene exists to give - it should be the widest thing on screen, not an equal third.
	* @returns {{listWidth: number, resultWidth: number, columnX: number[], contentY: number, height: number}}
	*/
	getRefinementPanelLayout() {
		const panelRect = this.getRefinementPanelRectangle();
		const panelWindow = this.getRefinementDetailsWindow();
		const pad = panelWindow.padding;
		const innerX = panelRect.x + pad;
		const innerWidth = panelRect.width - pad * 2;
		const listWidth = this.getBaseRefinableListColumnWidth();
		const resultWidth = innerWidth - listWidth * 2;
		const contentY = panelRect.y + pad + panelWindow.columnContentInnerStartY();
		const height = panelRect.y + panelRect.height - contentY - pad;
		return {
			listWidth,
			resultWidth,
			columnX: [
				innerX,
				innerX + listWidth,
				innerX + listWidth * 2
			],
			contentY,
			height
		};
	}
	/**
	* Gets the RefinementDescription window being tracked.
	*/
	getRefinementDescriptionWindow() {
		return this._j._crafting._refine._refinementDescription;
	}
	/**
	* Sets the RefinementDescription window tracking.
	*/
	setRefinementDescriptionWindow(someWindow) {
		this._j._crafting._refine._refinementDescription = someWindow;
	}
	/**
	* Creates the base RefinableList window.
	*/
	createBaseRefinableListWindow() {
		const window = this.buildRefinableListWindow();
		this.setBaseRefinableListWindow(window);
		this.addWindow(window);
	}
	buildRefinableListWindow() {
		const rectangle = this.getBaseRefinableListRectangle();
		const window = new Window_RefinableList(rectangle);
		window.isPrimary = true;
		window.setHandler("cancel", this.onBaseRefinableListCancel.bind(this));
		window.setHandler("ok", this.onBaseRefinableListSelection.bind(this));
		window.onIndexChange = this.onBaseRefinableListIndexChange.bind(this);
		return window;
	}
	/**
	* Gets the rectangle associated with this window.
	* @returns {Rectangle}
	*/
	getBaseRefinableListRectangle() {
		const layout = this.getRefinementPanelLayout();
		return new Rectangle(layout.columnX[0], layout.contentY, layout.listWidth, layout.height);
	}
	/**
	* Gets the RefinableList window being tracked.
	*/
	getBaseRefinableListWindow() {
		return this._j._crafting._refine._baseRefinableList;
	}
	/**
	* Sets the RefinableList window tracking.
	*/
	setBaseRefinableListWindow(someWindow) {
		this._j._crafting._refine._baseRefinableList = someWindow;
	}
	selectBaseRefinableListWindow() {
		const listWindow = this.getBaseRefinableListWindow();
		listWindow.show();
		listWindow.activate();
		this.getRefinementDescriptionWindow().setText(listWindow.currentHelpText());
		this.refreshRefinementStepHint();
	}
	deselectBaseRefinableListWindow() {
		const listWindow = this.getBaseRefinableListWindow();
		listWindow.deactivate();
	}
	onBaseRefinableListIndexChange() {
		const listWindow = this.getBaseRefinableListWindow();
		const helpText = listWindow.currentHelpText();
		this.getRefinementDescriptionWindow().setText(helpText ?? String.empty);
		const baseRefinable = listWindow.currentExt();
		this.getRefinementDetailsWindow().primaryEquip = baseRefinable === null ? null : baseRefinable.data;
	}
	onBaseRefinableListCancel() {
		SceneManager.pop();
	}
	onBaseRefinableListSelection() {
		this.refinementSession().beginMaterialSelection();
		const baseRefinableListWindow = this.getBaseRefinableListWindow();
		const baseRefinable = baseRefinableListWindow.currentExt();
		this.setBaseSelected(baseRefinable.data);
		this.setBaseSelectedUnitOrdinal(baseRefinable.unitOrdinal === undefined || baseRefinable.unitOrdinal === null ? null : baseRefinable.unitOrdinal);
		this.deselectBaseRefinableListWindow();
		this.selectConsumableRefinableListWindow();
	}
	/**
	* Creates the consumable RefinableList window.
	*/
	createConsumableRefinableListWindow() {
		const window = this.buildConsumableRefinableListWindow();
		this.setConsumableRefinableListWindow(window);
		this.addWindow(window);
	}
	buildConsumableRefinableListWindow() {
		const rectangle = this.getConsumableRefinableListRectangle();
		const window = new Window_RefinableList(rectangle);
		window.setHandler("cancel", this.onConsumableRefinableListCancel.bind(this));
		window.setHandler("ok", this.onConsumableRefinableListSelection.bind(this));
		window.onIndexChange = this.onConsumableRefinableListIndexChange.bind(this);
		window.hide();
		window.deactivate();
		return window;
	}
	/**
	* Gets the rectangle associated with this window.
	* @returns {Rectangle}
	*/
	getConsumableRefinableListRectangle() {
		const layout = this.getRefinementPanelLayout();
		return new Rectangle(layout.columnX[1], layout.contentY, layout.listWidth, layout.height);
	}
	/**
	* Gets the consumable RefinableList window being tracked.
	*/
	getConsumableRefinableListWindow() {
		return this._j._crafting._refine._consumedRefinableList;
	}
	/**
	* Sets the consumable RefinableList window tracking.
	*/
	setConsumableRefinableListWindow(someWindow) {
		this._j._crafting._refine._consumedRefinableList = someWindow;
	}
	selectConsumableRefinableListWindow() {
		const listWindow = this.getConsumableRefinableListWindow();
		listWindow.baseSelection = this.getBaseSelected();
		listWindow.baseSelectionUnitOrdinal = this.getBaseSelectedUnitOrdinal();
		listWindow.refresh();
		listWindow.show();
		listWindow.activate();
		const selectedExt = listWindow.currentExt();
		const selected = selectedExt === null ? null : selectedExt.data;
		this.setConsumedSelected(selected);
		this.getRefinementDetailsWindow().secondaryEquip = selected;
		this.getRefinementDescriptionWindow().setText(listWindow.currentHelpText());
		this.refreshRefinementStepHint();
	}
	deselectConsumableRefinableListWindow() {
		const listWindow = this.getConsumableRefinableListWindow();
		listWindow.hide();
		listWindow.deactivate();
	}
	onConsumableRefinableListIndexChange() {
		const listWindow = this.getConsumableRefinableListWindow();
		const helpText = listWindow.currentHelpText();
		this.getRefinementDescriptionWindow().setText(helpText ?? String.empty);
		const consumedRefinable = listWindow.currentExt();
		this.getRefinementDetailsWindow().secondaryEquip = consumedRefinable.data;
	}
	onConsumableRefinableListCancel() {
		this.refinementSession().returnToBaseSelection();
		this.getRefinementDetailsWindow().secondaryEquip = null;
		this.deselectConsumableRefinableListWindow();
		this.selectBaseRefinableListWindow();
	}
	onConsumableRefinableListSelection() {
		this.refinementSession().beginConfirmation();
		const listWindow = this.getConsumableRefinableListWindow();
		const consumedRefinable = listWindow.currentExt().data;
		this.setConsumedSelected(consumedRefinable);
		this.selectRefinementConfirmationWindow();
	}
	/**
	* Creates the RefinementDetails window.
	*/
	createRefinementDetailsWindow() {
		const window = this.buildRefinementDetailsWindow();
		this.setRefinementDetailsWindow(window);
		this.addWindow(window);
	}
	buildRefinementDetailsWindow() {
		const rectangle = this.getRefinementDetailsRectangle();
		const window = new Window_RefinementDetails(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with this window.
	* @returns {Rectangle}
	*/
	getRefinementDetailsRectangle() {
		return this.getRefinementPanelRectangle();
	}
	/**
	* Gets the RefinementDetails window being tracked.
	*/
	getRefinementDetailsWindow() {
		return this._j._crafting._refine._refinementDetails;
	}
	/**
	* Sets the RefinementDetails window tracking.
	*/
	setRefinementDetailsWindow(someWindow) {
		this._j._crafting._refine._refinementDetails = someWindow;
	}
	/**
	* Creates the RefinementConfirmation window.
	*/
	createRefinementConfirmationWindow() {
		const window = this.buildRefinementConfirmationWindow();
		this.setRefinementConfirmationWindow(window);
		this.addWindow(window);
	}
	buildRefinementConfirmationWindow() {
		const rectangle = this.getRefinementConfirmationRectangle();
		const window = new Window_RefinementConfirmation(rectangle);
		window.setHandler("cancel", this.onRefinementConfirmationCancel.bind(this));
		window.setHandler("ok", this.onRefinementConfirmationSelection.bind(this));
		window.hide();
		window.deactivate();
		return window;
	}
	/**
	* Gets the rectangle associated with this window.
	* @returns {Rectangle}
	*/
	getRefinementConfirmationRectangle() {
		const [ox, oy] = Graphics.boxOrigin;
		const width = this.getBaseRefinableListColumnWidth();
		const height = 120;
		const x = ox + Math.floor((Graphics.boxWidth - width) / 2);
		const y = oy + Math.floor((Graphics.boxHeight - height) / 2);
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the RefinementConfirmation window being tracked.
	*/
	getRefinementConfirmationWindow() {
		return this._j._crafting._refine._confirmationPrompt;
	}
	selectRefinementConfirmationWindow() {
		const listWindow = this.getRefinementConfirmationWindow();
		listWindow.show();
		listWindow.activate();
		this.refreshRefinementStepHint();
	}
	deselectRefinementConfirmationWindow() {
		const listWindow = this.getRefinementConfirmationWindow();
		listWindow.hide();
		listWindow.deactivate();
	}
	/**
	* Sets the RefinementConfirmation window tracking.
	*/
	setRefinementConfirmationWindow(someWindow) {
		this._j._crafting._refine._confirmationPrompt = someWindow;
	}
	onRefinementConfirmationCancel() {
		this.refinementSession().returnToMaterialSelection();
		this.deselectRefinementConfirmationWindow();
		this.selectConsumableRefinableListWindow();
	}
	onRefinementConfirmationSelection() {
		const detailsWindow = this.getRefinementDetailsWindow();
		const output = detailsWindow.outputEquip;
		const outcome = this.refinementSession().commitRefinement(this.getBaseSelected(), this.getConsumedSelected(), output);
		if (outcome.ok === false) {
			return;
		}
		detailsWindow.primaryEquip = null;
		detailsWindow.secondaryEquip = null;
		this.deselectConsumableRefinableListWindow();
		this.deselectRefinementConfirmationWindow();
		this.selectBaseRefinableListWindow();
		this.setBaseSelected(null);
		this.setBaseSelectedUnitOrdinal(null);
		this.setConsumedSelected(null);
		const listWindow = this.getBaseRefinableListWindow();
		listWindow.refresh();
		listWindow.select(0);
		this.onBaseRefinableListIndexChange();
		this.getConsumableRefinableListWindow().refresh();
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/scenes/Scene_Jafting.js
/**
* Extends {@link #onRootJaftingSelection}.<br/>
* When Refinement is chosen on the JAFTING hub, opens the Refinement scene.
*/
J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting.set("onRootJaftingSelection", Scene_Jafting.prototype.onRootJaftingSelection);
Scene_Jafting.prototype.onRootJaftingSelection = function() {
	const currentSelection = this.getRootJaftingKey();
	if (currentSelection === Scene_JaftingRefine.KEY) {
		this.jaftingRefinementSelected();
	} else {
		J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting.get("onRootJaftingSelection").call(this);
	}
};
/**
* Switch to the JAFTING Refinement scene from the hub list.
*/
Scene_Jafting.prototype.jaftingRefinementSelected = function() {
	this.closeRootJaftingWindows();
	Scene_JaftingRefine.callScene();
};

//#endregion
//#region src/plugins/jafting/ext/refine/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map.prototype.start}.<br/>
* Collects any refinement slot the playthrough can no longer reach.
*
* **Why the map, and why not the moment a row leaves inventory.** Refinement mints rows into `$dataWeapons` /
* `$dataArmors` and the party tracks their provenance, so both need tidying once the player parts with one for
* good. The tempting place to do that is the `loseItem` hook, and it is wrong: equipping spends a row out of the
* bag before installing it in the slot, so an item mid-equip is momentarily held nowhere, and selling, dismantling
* and story-driven removals each settle at their own pace. Collecting from inside any of those means reading a
* transitional state as a final one.
*
* `Scene_Map.start` is the point where none of that is in flight. It runs on map transfer *and* on the return from
* any menu, shop, or battle, because `SceneManager.pop` constructs a fresh scene rather than resuming the old one -
* so every path that could have released a refined equip passes through here afterward, with the transaction
* finished. Collection being late costs nothing: the slot allocator only ever counts upward, so no future
* refinement is waiting on a freed slot.
*
* This lives in Refinement rather than JAFTING core because Refinement is what creates dynamic rows in the first
* place. A project without it has none, and therefore wants no sweep.
*/
J.JAFTING.EXT.REFINE.Aliased.Scene_Map.set("start", Scene_Map.prototype.start);
Scene_Map.prototype.start = function() {
	J.JAFTING.EXT.REFINE.Aliased.Scene_Map.get("start").call(this);
	JaftingSalvageManager.reclaimUnreferencedDynamicSlots();
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_JaftingList.js
/**
* Extends {@link #buildCommands}.<br/>
* Includes the refinement command as well as the rest.
*/
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList.set("buildCommands", Window_JaftingList.prototype.buildCommands);
Window_JaftingList.prototype.buildCommands = function() {
	const commands = J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList.get("buildCommands").call(this);
	commands.push(this.buildRefinementCommand());
	return commands;
};
/**
* Builds the jafting refinement command for the main jafting types menu.
* @return {BuiltWindowCommand}
*/
Window_JaftingList.prototype.buildRefinementCommand = function() {
	return new WindowCommandBuilder(J.JAFTING.EXT.REFINE.Metadata.commandName).setSymbol(Scene_JaftingRefine.KEY).setEnabled(Scene_JaftingRefine.isRefineCommandEnabled()).addTextLine("Give your equipment a personal touch.").addTextLine("Modify your equips with trait transferrence and reach for godlihood!").setIconIndex(J.JAFTING.EXT.REFINE.Metadata.commandIconIndex).build();
};

//#endregion
//#region src/plugins/jafting/ext/refine/_metadata/pluginCommands.js
/**
* A plugin command.<br>
* Calls the JAFTING refinement menu.
*/
PluginManager.registerCommand(J.JAFTING.EXT.REFINE.Metadata.name, "call-menu", () => {
	Scene_JaftingRefine.callScene();
});

//#endregion
//#region src/plugins/jafting/ext/refine/registerJaftingRefineSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-JAFTING-Refinement a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_refinement", "refinement");
}

//#endregion
//# sourceMappingURL=J-JAFTING-Refinement.js.map