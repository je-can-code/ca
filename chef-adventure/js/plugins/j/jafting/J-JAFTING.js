//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.2.0 JAFTING] Root JAFTING menu, salvage loop, and extension hooks.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is the core menu system that other JAFTING menus plug into.
 * It was designed as an extensible wrapper scene for all JAFTING modes.
 *
 * NOTE ABOUT THIS PLUGIN:
 * This is a base plugin that offers no actual crafting functionality itself.
 * It offers instead a root "JAFTING" menu that the other extensions will
 * connect to for singular JAFTING access—including Salvage on that hub (same
 * scene as {@code call-salvage}). Chances are, if you are using
 * this plugin, you probably also want to grab the "Creation" extension and/or
 * the "Refinement" extension and place them below this one.
 * ============================================================================
 * ORGANIZATION:
 * Have you ever wanted a menu that has a single purpose, such as granting
 * access to all the other crafting menus built to work with JAFTING? Well now
 * you can! Just drop this plugin above your other installed JAFTING extension
 * plugins, and voila! It works.
 *
 * NOTE ABOUT THIS PLUGIN:
 * It isn't really necessary. It is literally just a wrapper scene and menu
 * that unifies access to all JAFTING scenes. You could also just directly
 * call the other JAFTING scenes directly if you preferred.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- salvage/refine material typing is
 * configured entirely via plugin parameters (armor/weapon type ids), and
 * the JAFTING extensions that plug into this hub (Creation, Refinement) own
 * their own respective tags.
 * ============================================================================
 * CHANGELOG:
 * - 2.2.0
 *    Routed the _jafting namespace into its own save section, so crafting
 *    state lands in systems/jafting.json rather than in the system blob.
 * - 2.1.3
 *    Split JaftingSalvageDataModels.js into one file per class
 *    (JaftingSalvageLedgerRow/Snapshot/PartyLedgerBag) and registered all
 *    three with SerializableRegistry so JsonEx restores keep their
 *    prototype methods after a save load.
 * - 2.1.2
 *    Salvage hub row: label, icon, optional switch gate
 *    ({@link Window_JaftingList}).
 *    {@link Scene_JaftingSalvage.KEY} ties the hub entry to scene routing.
 * - 2.1.1
 *    Party salvage bags init from {@link DataManager.createGameObjects} and
 *    {@link DataManager.extractSaveContents}
 *    (not {@link Scene_Boot#onDatabaseLoaded}; runs before $gameParty exists).
 * - 2.1.0
 *    Salvage ledger helpers, {@link Scene_JaftingSalvage}, and plugin command
 *    call-salvage.
 * - 2.0.0
 *    Removed all references to refinement logic.
 *    Extracted the crafting logic entirely into its own plugin.
 *    Repurposes this plugin to be the "core" or "root" crafting menu only.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command call-menu
 * @text Call Core Menu
 * @desc Brings up the core JAFTING menu.
 *
 * @command call-salvage
 * @text Call Salvage Scene
 * @desc Opens the JAFTING salvage scene where stamped gear can be dismantled (same scene as the hub Salvage row).
 *
 * @param jaftingSalvageConfig
 * @text SALVAGE / REFINE STACKS
 *
 * @param material-armor-type-id
 * @parent jaftingSalvageConfig
 * @type number
 * @min -1
 * @text Material armor type id
 * @desc Armor atypeId treated as stack-only ingredients (refinement base list omits them; dismantle keeps bare rows). Use -1 to disable. Default 5.
 * @default 5
 *
 * @param material-weapon-type-id
 * @parent jaftingSalvageConfig
 * @type number
 * @min -1
 * @text Material weapon type id
 * @desc Weapon wtypeId treated like material armors (stack counts in refine lists; dismantle pass-through). Use -1 to disable; 0 is a valid type id.
 * @default -1
 *
 * @param jaftingHubSalvage
 * @text HUB — SALVAGE ROW
 *
 * @param salvage-menu-switch
 * @parent jaftingHubSalvage
 * @type number
 * @min 0
 * @text Salvage hub switch id
 * @desc When non-zero, the Salvage hub row requires this game switch ON. Use 0 to always show Salvage (ignore switches).
 * @default 0
 *
 * @param salvage-menu-name
 * @parent jaftingHubSalvage
 * @type string
 * @text Salvage hub command name
 * @desc Label for the Salvage entry on the root JAFTING menu.
 * @default Salvage
 *
 * @param salvage-menu-icon
 * @parent jaftingHubSalvage
 * @type number
 * @text Salvage hub command icon
 * @desc Icon index drawn beside the Salvage hub command (RPG Maker icon sheet).
 * @default 192
 *
 */

//#region src/plugins/jafting/core/_metadata/_pluginMetadata.js
/**
* Plugin metadata for the core JAFTING plugin.
* Because this plugin offers little actual functionality, there is little that
* can be configured.
*/
var J_CraftingPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Reads salvage/refine stack policy ids from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.materialArmorTypeId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["material-armor-type-id"], 5);
		this.materialWeaponTypeId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["material-weapon-type-id"], -1);
		this.salvageMenuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["salvage-menu-switch"], 0);
		this.salvageCommandName = this.parsedPluginParameters["salvage-menu-name"] ?? "Salvage";
		this.salvageMenuIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["salvage-menu-icon"], 192);
	}
};

//#endregion
//#region src/plugins/jafting/core/_metadata/initialization.js
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
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.JAFTING = {};
/**
* A collection of all extensions for JAFTING.
*/
J.JAFTING.EXT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.JAFTING.Metadata = new J_CraftingPluginMetadata("J-JAFTING", "2.2.0");
/**
* A helpful mapping of all the various RMMZ classes being extended.
*/
J.JAFTING.Aliased = {};
J.JAFTING.Aliased.Game_Party = new Map();
J.JAFTING.Aliased.DataManager = new Map();
J.JAFTING.Aliased.Scene_Jafting = new Map();
J.JAFTING.Aliased.Scene_Map = new Map();

//#endregion
//#region src/plugins/jafting/core/__models/JaftingSalvageLedgerRow.js
/**
* One stamped ingredient line (`t` + `id` + `n`, optional dismantle ban).<br>
* `t` mirrors dismantle routing (`i` / `w` / `a`, gold letter, SDP letter, etc.)—see
* {@link JaftingSalvageManager.refundLedgerRows}.
*/
var JaftingSalvageLedgerRow = class JaftingSalvageLedgerRow {
	/**
	* @param {string} t Ledger type letter (`i`, `w`, `a`, gold, SDP, etc.).
	* @param {number} id Database id (or 0 for non-db rows such as gold).
	* @param {number} n Quantity credited when dismantling **one** stamped unit.
	* @param {boolean=} banned When true, dismantle skips this row.
	*/
	constructor(t, id, n, banned) {
		this.t = t;
		this.id = id;
		this.n = n;
		if (banned === true) {
			this.banned = true;
		}
	}
	/**
	* Deep-copies this row so merges never share mutable references.
	*
	* @returns {JaftingSalvageLedgerRow}
	*/
	clone() {
		return new JaftingSalvageLedgerRow(this.t, this.id, this.n, this.banned === true);
	}
};

//#endregion
//#region src/plugins/jafting/core/__models/JaftingSalvageLedgerSnapshot.js
/**
* Salvage stamp for **one** inventory unit (craft output slot, refinement output, or one stack ordinal).<br>
* Party stacks mirror these in {@link JaftingSalvagePartyLedgerBag#unitLedgers}; dynamic refinement rows hang the same
* shape on {@link RPG_Weapon#_jaftingSalvageLedger} and {@link RPG_Armor#_jaftingSalvageLedger}.
*/
var JaftingSalvageLedgerSnapshot = class JaftingSalvageLedgerSnapshot {
	/**
	* @param {JaftingSalvageLedgerRow[]|null|undefined} rows
	*/
	constructor(rows) {
		this.rows = Array.isArray(rows) ? rows : [];
	}
	/**
	* Returns `.rows` from a snapshot, or an empty array when the snapshot is absent.
	*
	* @param {JaftingSalvageLedgerSnapshot|null|undefined} ledger
	* @returns {JaftingSalvageLedgerRow[]}
	*/
	static rowsFrom(ledger) {
		if (!ledger) {
			return [];
		}
		return ledger.rows;
	}
	/**
	* Clones every row into a fresh snapshot (used when stamping multiple outputs from the same recipe shell).
	*
	* @param {JaftingSalvageLedgerSnapshot} ledger
	* @returns {JaftingSalvageLedgerSnapshot}
	*/
	static cloneFromLedger(ledger) {
		const clones = ledger.rows.map((r) => r.clone());
		return new JaftingSalvageLedgerSnapshot(clones);
	}
};

//#endregion
//#region src/plugins/jafting/core/__models/JaftingSalvagePartyLedgerBag.js
/**
* Party-side ledger bag for a single template id (`i:` / `w:` / `a:` keys in {@link JaftingSalvageManager}).<br>
* `unitLedgers` parallels {@link Game_Party#numItems} for that template; `rows` holds the merged dismantle view.
*/
var JaftingSalvagePartyLedgerBag = class JaftingSalvagePartyLedgerBag {
	constructor() {
		/**
		* Per stack slot lineage (null when that copy has no stamp).
		*
		* @type {(JaftingSalvageLedgerSnapshot|null)[]}
		*/
		this.unitLedgers = [];
		/**
		* Merged dismantle rows (union of every non-empty {@link #unitLedgers} slot).
		*
		* @type {JaftingSalvageLedgerRow[]}
		*/
		this.rows = [];
	}
	/**
	* Returns the bag as-is, or a fresh empty bag when the map slot is absent.
	*
	* @param {JaftingSalvagePartyLedgerBag|null|undefined} raw
	* @returns {JaftingSalvagePartyLedgerBag}
	*/
	static coerce(raw) {
		if (!raw) {
			return new JaftingSalvagePartyLedgerBag();
		}
		return raw;
	}
};

//#endregion
//#region src/plugins/jafting/core/registerJaftingSalvageSerializableModels.js
/**
* Registers JAFTING salvage ledger models with {@link SerializableRegistry}.
*/
SerializableRegistry.register(JaftingSalvageLedgerRow);
SerializableRegistry.register(JaftingSalvageLedgerSnapshot);
SerializableRegistry.register(JaftingSalvagePartyLedgerBag);

//#endregion
//#region src/plugins/jafting/core/__models/JaftingSalvageLedger.js
/**
* Stateless helpers for salvage ledger **rows** (clone, merge, dedupe).<br>
* Concrete row / snapshot / bag classes live in {@link JaftingSalvageLedgerRow},
* {@link JaftingSalvageLedgerSnapshot}, and {@link JaftingSalvagePartyLedgerBag}
* (see `JaftingSalvageDataModels.js`).<br>
* Party-facing **saved** ledgers live under {@link JaftingSalvageManager} on `$gameParty` or on RPG equipment rows.
*/
var JaftingSalvageLedger = {};
/**
* Armor type id used for ingredient-style armors (monster parts, materials).<br>
* Must align with JAFTING Refinement UI filtering and game data conventions.
*/
JaftingSalvageLedger.MaterialArmorTypeId = 5;
/**
* Effective armor type id for ingredient stacks (JAFTING core plugin parameter).<br>
* {@link MaterialArmorTypeId} is the fallback when metadata is missing; -1 in parameters means disabled
* (no armor type is treated as stack-only material).
*
* @returns {number}
*/
JaftingSalvageLedger.getMaterialArmorTypeId = function() {
	return J.JAFTING.Metadata.materialArmorTypeId;
};
/**
* Weapon type id for stack-only ingredient weapons (JAFTING core plugin parameter).<br>
* -1 disables the feature; 0 is a valid {@link RPG_Weapon#wtypeId} when you intend that type as material stacks.
*
* @returns {number}
*/
JaftingSalvageLedger.getMaterialWeaponTypeId = function() {
	return J.JAFTING.Metadata.materialWeaponTypeId;
};
/**
* True when this armor row uses the configured material armor type (refine primary filter, dismantle pass-through).
*
* @param {RPG_Armor|RPG_Base} datum The datum driving this step.
* @returns {boolean}
*/
JaftingSalvageLedger.isMaterialArmorDatum = function(datum) {
	const armorTypeId = JaftingSalvageLedger.getMaterialArmorTypeId();
	if (armorTypeId < 0) {
		return false;
	}
	return datum.isArmor() === true && datum.atypeId === armorTypeId;
};
/**
* True when this weapon row uses the configured material weapon type (parameter must be zero or greater).
*
* @param {RPG_Weapon|RPG_Base} datum The datum driving this step.
* @returns {boolean}
*/
JaftingSalvageLedger.isMaterialWeaponDatum = function(datum) {
	const weaponTypeId = JaftingSalvageLedger.getMaterialWeaponTypeId();
	if (weaponTypeId < 0) {
		return false;
	}
	return datum.isWeapon() === true && datum.wtypeId === weaponTypeId;
};
/**
* True when refine lists should keep one row with stack counts (monster parts, clip-style weapons, etc.).
*
* @param {RPG_EquipItem|RPG_Base} datum The datum driving this step.
* @returns {boolean}
*/
JaftingSalvageLedger.isStackCountedRefinableEquip = function(datum) {
	return JaftingSalvageLedger.isMaterialArmorDatum(datum) || JaftingSalvageLedger.isMaterialWeaponDatum(datum);
};
/**
* Stable merge key for a ledger row (type + database id).
*
* @param {JaftingSalvageLedgerRow|{ t: string, id: number }} row
* @returns {string}
*/
JaftingSalvageLedger.rowMergeKey = function(row) {
	return `${row.t}:${row.id}`;
};
/**
* Clones row objects for safe merging without sharing references.
*
* @param {JaftingSalvageLedgerRow[]} rows The rows to clone.
* @returns {JaftingSalvageLedgerRow[]}
*/
JaftingSalvageLedger.cloneRows = function(rows) {
	return rows.map((r) => r.clone());
};
/**
* Merges duplicate rows by summing counts when {@link rowMergeKey} matches.<br>
* Call this whenever a pipeline might double-count the same ingredient (parallel outputs, concat merges, reload
* coercion).<br>
* Banned flags OR together (if any duplicate is banned, merged row is banned).
*
* @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} rows
* @returns {JaftingSalvageLedgerRow[]}
*/
JaftingSalvageLedger.mergeDuplicateRows = function(rows) {
	const bucket = {};
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const key = JaftingSalvageLedger.rowMergeKey(row);
		if (!bucket[key]) {
			bucket[key] = row.clone();
		} else {
			bucket[key].n += row.n;
			if (row.banned === true) {
				bucket[key].banned = true;
			}
		}
	}
	return Object.keys(bucket).map((k) => bucket[k]);
};
/**
* Maps a database entry onto the ledger row letter that routes its stash and refund handling.
*
* Used where the letter cannot be read off a {@link CraftingComponent}, which is the case for a
* categorical slot: the component names types rather than a datastore, so only the entry actually
* spent knows which table it came from.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The entry to classify.
* @returns {string} The datastore letter: `i`, `w`, or `a`.
*/
JaftingSalvageLedger.typeLetterForDatum = function(datum) {
	if (datum.isWeapon()) return "w";
	if (datum.isArmor()) return "a";
	return "i";
};
/**
* Builds ledger rows from recipe ingredients (what crafting consumed).<br>
* Tools are intentionally omitted — salvage stamps track consumed inputs only.
*
* A categorical ingredient has no fixed row of its own, so the entry the player actually spent must be
* supplied. Falling back to whatever the component resolves to on its own would stamp the *first
* eligible* entry rather than the spent one — a wrong ancestry that never throws and only surfaces
* much later as a mismatched salvage refund.
*
* @param {CraftingComponent[]} ingredients The ingredients driving this step.
* @param {Map<number, RPG_Item|RPG_Weapon|RPG_Armor>} selections The entry spent for each categorical
* ingredient, keyed by its index in the ingredients collection.
* @returns {JaftingSalvageLedgerRow[]}
*/
JaftingSalvageLedger.rowsFromCraftingComponents = function(ingredients, selections = new Map()) {
	const rows = [];
	for (let i = 0; i < ingredients.length; i++) {
		const component = ingredients[i];
		if (component.isDatabaseEntry()) {
			const wasSelected = selections.has(i);
			const datum = wasSelected ? selections.get(i) : component.getItem();
			let typeLetter = "i";
			if (component.isWeapon()) {
				typeLetter = "w";
			} else if (component.isArmor()) {
				typeLetter = "a";
			}
			if (wasSelected) {
				typeLetter = JaftingSalvageLedger.typeLetterForDatum(datum);
			}
			rows.push(new JaftingSalvageLedgerRow(typeLetter, datum.id, component.quantity()));
		} else if (component.isGold()) {
			rows.push(new JaftingSalvageLedgerRow(CraftingComponent.Types.Gold, 0, component.quantity()));
		} else if (component.isSdp()) {
			rows.push(new JaftingSalvageLedgerRow(CraftingComponent.Types.SDP, 0, component.quantity()));
		}
	}
	return JaftingSalvageLedger.mergeDuplicateRows(rows);
};
/**
* Concatenates two ledgers, then runs {@link mergeDuplicateRows} so overlapping `t:id` keys sum instead of duplicating
* lines.<br>
* Refine / craft code paths prefer this over hand-rolled loops—order only matters before dedupe, not after.
*
* @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} a
* @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} b
* @returns {JaftingSalvageLedgerRow[]}
*/
JaftingSalvageLedger.mergeRowArrays = function(a, b) {
	const combined = JaftingSalvageLedger.cloneRows(a).concat(JaftingSalvageLedger.cloneRows(b));
	return JaftingSalvageLedger.mergeDuplicateRows(combined);
};

//#endregion
//#region src/plugins/jafting/core/managers/JaftingSalvageManager.js
/**
* Orchestrates **where** ledgers live, **when** they merge from craft/refine, **how** dismantle pays out, and
* **cleanup** when the last copy of dynamic refinement rows disappears from inventory.<br>
* <br>
* **`id` and `index` answer different questions, and every branch below depends on the difference.**<br>
* `id` is *what a row is OF* - "an Iron Sword" - and every instance of that thing shares it. `index` is *which
* instance this is* - the one carrying `+2` and a fire trait, in its own datastore slot. Rows authored in the RMMZ
* database editor have the two coincide, which is exactly why reading the wrong one looks fine for a long time.
* Dynamic rows are where they diverge: {@link JaftingManager.stampRefinedOutput} moves only the index, so a refined
* Iron Sword reports its base's `id` forever. **Ask `_key()` - never `id` - when the question is "is this a dynamic
* instance?", and note that this class's threshold constant is named for the index it compares against.**<br>
* <br>
* **Two storage homes (read this before touching `getLedger*`):**<br>
* - **Dynamic refinement rows** (`_key()` ≥ {@link JaftingSalvageManager.DynamicEquipIndexMin}) — stamp rides on
*   `datum._jaftingSalvageLedger` because each `$dataWeapons` / `$dataArmors` slot is already unique.<br>
* - **Vanilla stack templates** — stamp lives in `$gameParty._j._jafting._salvageLedgers[containerKey]` as a
* {@link JaftingSalvagePartyLedgerBag} with `unitLedgers[]` parallel to stack height. The key is built from `id` on
* purpose: every Iron Sword shares one bag, because a stack cannot diverge per-instance.<br>
* <br>
* Saved shapes are {@link JaftingSalvageLedgerSnapshot} and {@link JaftingSalvagePartyLedgerBag}; each stamped line is
* a {@link JaftingSalvageLedgerRow}. Merge math stays on {@link JaftingSalvageLedger}.
*/
var JaftingSalvageManager = class JaftingSalvageManager {
	/**
	* Dynamic weapon/armor indices created by JAFTING Refinement begin here.<br>
	* Must stay aligned with {@link JaftingManager.StartingIndex} when Refinement is installed.
	*/
	static DynamicEquipIndexMin = 2001;
	/**
	* Extension seam: runs after a dynamic refinement slot drops out of inventory and `$dataWeapons` / `$dataArmors`
	* is reset to {@link RPG_Weapon.createEmpty} / {@link RPG_Armor.createEmpty}.<br>
	* Projects may replace this function on {@link JaftingSalvageManager} to chain extra bookkeeping—default is a no-op.
	*
	* @param {'weapon'|'armor'} kind The kind driving this step.
	* @param {number} slotId The slot id driving this step.
	*/
	static onAfterDynamicSlotReclaimed(kind, slotId) {}
	/**
	* Container key for party-side ledger maps (vanilla stacks cannot diverge per-instance).
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @returns {string|null}
	*/
	static containerKeyFromDatum(datum) {
		if (datum.isItem()) {
			return `i:${datum.id}`;
		}
		if (datum.isWeapon()) {
			return `w:${datum.id}`;
		}
		if (datum.isArmor()) {
			return `a:${datum.id}`;
		}
		return null;
	}
	/**
	* Ensures `$gameParty._j._jafting._salvageLedgers` exists.<br>
	* Invoked only from {@link DataManager.createGameObjects} and {@link DataManager.extractSaveContents} so party bags
	* are ready before any gameplay touches ledgers—ledger readers do not lazy-init this graph.
	*/
	static initPartySalvageStorage() {
		if (!$gameParty) {
			return;
		}
		$gameParty._j ||= {};
		$gameParty._j._jafting ||= {};
		$gameParty._j._jafting._salvageLedgers ||= {};
	}
	/**
	* Rebuilds merged `bag.rows` from every non-empty per-slot ledger (dismantle still reads merged rows only).
	*
	* @param {JaftingSalvagePartyLedgerBag} bag The bag driving this step.
	*/
	static recomputeMergedRowsFromPartyLedgerBag(bag) {
		let acc = [];
		if (bag.unitLedgers && bag.unitLedgers.length > 0) {
			for (let i = 0; i < bag.unitLedgers.length; i++) {
				const unit = bag.unitLedgers[i];
				if (unit && unit.rows && unit.rows.length > 0) {
					acc = JaftingSalvageLedger.mergeRowArrays(acc, JaftingSalvageLedger.cloneRows(unit.rows));
				}
			}
		}
		bag.rows = JaftingSalvageLedger.mergeDuplicateRows(acc);
	}
	/**
	* How many copies of a template row the playthrough holds, wherever they are.
	*
	* The bag is only half of it. **Equipping does not consume a copy, but it does remove it from the container** -
	* so a stack of one that somebody is wearing reads as zero, and sizing the per-copy array off `numItems` alone
	* would throw that copy's provenance away and refund nothing when it is eventually taken apart. Worn copies are
	* counted rather than merely detected, because two accessory slots can hold two of the same thing.
	*
	* @param {RPG_Base} datum The template row being counted.
	* @returns {number}
	*/
	static heldCountIncludingWorn(datum) {
		const slot = datum._key();
		const worn = $gameActors.existingActors().reduce((tally, actor) => tally + JaftingSalvageManager.wornCountForActor(actor, slot), 0);
		return $gameParty.numItems(datum) + worn;
	}
	/**
	* How many copies of one slot a single actor is wearing.
	*
	* @param {Game_Actor} actor The actor whose equipment is being read.
	* @param {number} slot The datastore slot being counted.
	* @returns {number}
	*/
	static wornCountForActor(actor, slot) {
		return actor.equips().filter((equip) => equip !== null && equip._key() === slot).length;
	}
	/**
	* Grows the per-copy ledger array to cover every copy held, and never shrinks it.
	*
	* **Growth is safe to do immediately; shrinking is not.** A copy leaving the container might have been sold, or
	* might have been equipped, or might be mid-transaction in a trade that has not installed it anywhere yet - and
	* at the moment this runs there is no way to tell those apart. Shrinking therefore belongs to
	* {@link resizeTemplateLedgerBags}, which runs from a settled state. Dismantling is the one exception, because
	* destruction is unambiguous: {@link releaseSalvagedUnitLedgers} drops those entries on the spot.
	*
	* @param {JaftingSalvagePartyLedgerBag} bag The bag driving this step.
	* @param {RPG_Base} datum The datum driving this step.
	*/
	static syncPartyLedgerUnitCountToStack(bag, datum) {
		const held = JaftingSalvageManager.heldCountIncludingWorn(datum);
		if (!Array.isArray(bag.unitLedgers)) {
			bag.unitLedgers = [];
		}
		while (bag.unitLedgers.length < held) {
			bag.unitLedgers.push(null);
		}
		JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
	}
	/**
	* Shrinks every template bag back to the number of copies actually held, and drops the ones left empty.
	*
	* The deferred half of {@link syncPartyLedgerUnitCountToStack}, and the stack-shaped twin of
	* {@link reclaimUnreferencedDynamicSlots} - same reasoning, same safe moment, so they run from the same place.
	* Trimming from the tail matches the LIFO order copies are stamped and dismantled in.
	*/
	static resizeTemplateLedgerBags() {
		const ledgers = $gameParty._j._jafting._salvageLedgers;
		Object.keys(ledgers).forEach((key) => JaftingSalvageManager.resizeTemplateLedgerBag(key));
	}
	/**
	* Shrinks one template bag to what is held, then prunes it if nothing is left.
	*
	* @param {string} key The container key of the bag to resize.
	*/
	static resizeTemplateLedgerBag(key) {
		const bag = $gameParty._j._jafting._salvageLedgers[key];
		const datum = JaftingSalvageManager.templateRowForContainerKey(key);
		const held = JaftingSalvageManager.heldCountIncludingWorn(datum);
		if (bag.unitLedgers.length > held) {
			bag.unitLedgers.splice(held);
			JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
		}
		JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
	}
	/**
	* Resolves a container key back to the database row it describes.
	*
	* Safe to index a datastore with the id half of the key because **only template rows ever reach a party bag** -
	* a dynamic instance keeps its stamp on the row itself and is turned away by every path that writes one - and a
	* template row's id and index are the same number by definition.
	*
	* @param {string} key A container key shaped `i:12`, `w:4`, or `a:9`.
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor}
	*/
	static templateRowForContainerKey(key) {
		const [letter, rawId] = key.split(":");
		const id = Number(rawId);
		if (letter === "i") return $dataItems[id];
		if (letter === "w") return $dataWeapons[id];
		return $dataArmors[id];
	}
	/**
	* Ensures the party bag has a parallel {@link JaftingSalvagePartyLedgerBag#unitLedgers} array and matches current
	* `numItems`.
	*
	* @param {JaftingSalvagePartyLedgerBag|{ unitLedgers?: unknown[], rows?: unknown[] }} bag
	* @param {RPG_Base} datum The datum driving this step.
	*/
	static coercePartyLedgerBagShapeForDatum(bag, datum) {
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		const working = JaftingSalvagePartyLedgerBag.coerce(bag);
		if (working !== bag) {
			$gameParty._j._jafting._salvageLedgers[key] = working;
		}
		JaftingSalvageManager.syncPartyLedgerUnitCountToStack(working, datum);
	}
	/**
	* Deletes an empty keyed bag when merged rows and every slot are lineage-free.
	*
	* @param {string} key The key driving this step.
	*/
	static pruneEmptyPartyLedgerBag(key) {
		let bag = $gameParty._j._jafting._salvageLedgers[key];
		if (!bag) {
			return;
		}
		bag = JaftingSalvagePartyLedgerBag.coerce(bag);
		let anyUnitRows = false;
		if (Array.isArray(bag.unitLedgers)) {
			for (let i = 0; i < bag.unitLedgers.length; i++) {
				const u = bag.unitLedgers[i];
				if (u && u.rows && u.rows.length > 0) {
					anyUnitRows = true;
					break;
				}
			}
		}
		const mergedEmpty = !bag.rows || bag.rows.length === 0;
		if (mergedEmpty && anyUnitRows === false) {
			delete $gameParty._j._jafting._salvageLedgers[key];
		}
	}
	/**
	* Reads the salvage ledger attached to an RPG datum or the party bag for stacked goods.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @returns {JaftingSalvageLedgerSnapshot|JaftingSalvagePartyLedgerBag|null}
	*/
	static getLedgerForDatum(datum) {
		if (datum === null || datum === undefined) {
			return null;
		}
		if (datum._jaftingSalvageLedger) {
			return datum._jaftingSalvageLedger;
		}
		if (datum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return null;
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		let bag = $gameParty._j._jafting._salvageLedgers[key];
		if (bag) {
			JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
			bag = $gameParty._j._jafting._salvageLedgers[key];
		}
		if (bag && bag.rows && bag.rows.length > 0) {
			return bag;
		}
		return null;
	}
	/**
	* Reads the salvage ledger for one stack index (party bag) or the whole dynamic row ledger.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @param {number|null|undefined} unitOrdinal The unit ordinal driving this step.
	* @returns {JaftingSalvageLedgerSnapshot|JaftingSalvagePartyLedgerBag|null}
	*/
	static getLedgerUnitForDatum(datum, unitOrdinal) {
		if (datum === null || datum === undefined) {
			return null;
		}
		if (datum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return JaftingSalvageManager.getLedgerForDatum(datum);
		}
		if (unitOrdinal === null || unitOrdinal === undefined) {
			return JaftingSalvageManager.getLedgerForDatum(datum);
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		if (!key) {
			return null;
		}
		let bag = $gameParty._j._jafting._salvageLedgers[key];
		if (!bag) {
			return null;
		}
		JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
		bag = $gameParty._j._jafting._salvageLedgers[key];
		const unit = bag.unitLedgers[unitOrdinal];
		if (!unit || !unit.rows || unit.rows.length === 0) {
			return null;
		}
		return unit;
	}
	/**
	* Clears ledger storage for a datum everywhere it might live.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	*/
	static clearLedgerForDatum(datum) {
		if (datum._jaftingSalvageLedger) {
			datum._jaftingSalvageLedger = null;
		}
		if (datum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return;
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		if (key) {
			delete $gameParty._j._jafting._salvageLedgers[key];
		}
	}
	/**
	* Party hook after items enter inventory — grow per-slot lineage arrays for static-template stacks.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} itemDatum The item datum driving this step.
	* @param {number} amountGained The amount gained driving this step.
	*/
	static afterPartyGainedItem(itemDatum, amountGained) {
		if (!itemDatum || amountGained < 1) {
			return;
		}
		if (itemDatum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return;
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(itemDatum);
		if (!key) {
			return;
		}
		JaftingSalvageManager.initPartySalvageStorage();
		const bag = $gameParty._j._jafting._salvageLedgers[key];
		if (!bag) {
			return;
		}
		JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, itemDatum);
		JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
	}
	/**
	* After crafting succeeds, stamps outputs using ingredient-derived ledger rows (deduped).
	*
	* @param {CraftingRecipe} recipe The recipe driving this step.
	* @param {Map<number, RPG_Item|RPG_Weapon|RPG_Armor>} selections The entry spent for each
	* categorical ingredient, keyed by its index in the recipe's ingredients.
	*/
	static applyCraftRecipeOutputs(recipe, selections = new Map()) {
		const ingredientRows = JaftingSalvageLedger.rowsFromCraftingComponents(recipe.ingredients, selections);
		const shell = new JaftingSalvageLedgerSnapshot(ingredientRows);
		for (let i = 0; i < recipe.outputs.length; i++) {
			const component = recipe.outputs[i];
			if (component.isDatabaseEntry()) {
				const datum = component.getItem();
				const snapshot = JaftingSalvageLedgerSnapshot.cloneFromLedger(shell);
				JaftingSalvageManager.appendStampedUnitsToPartyStack(datum, snapshot, component.quantity());
			}
		}
	}
	/**
	* Merges an incoming ledger snapshot into whatever storage backs {@link datum}.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} incomingLedger
	*/
	static mergeLedgerIntoPartyOrDatum(datum, incomingLedger) {
		if (datum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			const existingRows = JaftingSalvageLedgerSnapshot.rowsFrom(datum._jaftingSalvageLedger);
			const incomingRows = JaftingSalvageLedgerSnapshot.rowsFrom(incomingLedger);
			datum._jaftingSalvageLedger = new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(existingRows, incomingRows));
			return;
		}
		JaftingSalvageManager.appendStampedUnitsToPartyStack(datum, incomingLedger, 1);
	}
	/**
	* Assigns freshly crafted lineage snapshots onto the last stampedCount stack slots (LIFO stack order).<br>
	* Call after {@link Game_Party.prototype.gainItem} has already raised counts (see {@link CraftingRecipe#craft}).
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} incomingLedger
	* @param {number} stampedCount The stamped count driving this step.
	*/
	static appendStampedUnitsToPartyStack(datum, incomingLedger, stampedCount) {
		if (datum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return;
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		if (!key) {
			return;
		}
		if (stampedCount < 1) {
			return;
		}
		JaftingSalvageManager.initPartySalvageStorage();
		const ledgers = $gameParty._j._jafting._salvageLedgers;
		let bag = ledgers[key];
		if (!bag) {
			bag = new JaftingSalvagePartyLedgerBag();
			ledgers[key] = bag;
		}
		JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, datum);
		bag = $gameParty._j._jafting._salvageLedgers[key];
		const n = $gameParty.numItems(datum);
		const start = Math.max(0, n - stampedCount);
		for (let i = start; i < n; i++) {
			bag.unitLedgers[i] = JaftingSalvageLedgerSnapshot.cloneFromLedger(incomingLedger);
		}
		JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
	}
	/**
	* True when the refinement **material** contributes **no extra dismantle rows** onto the output stamp.<br>
	* <br>
	* Check order matters: stamped ledger wins first, then ingredient-type exceptions, then the blunt "vendor shell"
	* weapon/armor rule—stack items fall through to `false` so we never mis-classify a normal item donor.<br>
	* Pair with {@link JaftingSalvageManager.buildRefinementOutputLedger}; that method mirrors these branches when
	* building rows.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} materialDatum The material datum driving this step.
	* @returns {boolean}
	*/
	static refinementMaterialHasNoRecoverableRows(materialDatum) {
		const ledger = JaftingSalvageManager.getLedgerForDatum(materialDatum);
		if (ledger && ledger.rows && ledger.rows.length > 0) {
			return false;
		}
		if (materialDatum.isArmor() && materialDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId()) {
			return false;
		}
		if (JaftingSalvageLedger.isMaterialWeaponDatum(materialDatum)) {
			return false;
		}
		if (materialDatum.isWeapon() || materialDatum.isArmor()) {
			return true;
		}
		return false;
	}
	/**
	* Builds the merged salvage ledger that should attach to refined output equipment.<br>
	* <br>
	* **Pipeline (same story as {@link JaftingSalvageManager.refinementMaterialHasNoRecoverableRows}, but emitting
	* rows):** clone the base stamp, optionally fold donor rows, always end on a deduped snapshot so duplicate `t:id`
	* keys from parallel crafts collapse cleanly.<br>
	* Early exit when the donor is a **gold-only** vendor shell—base lineage alone defines dismantle. Stamped donor
	* merges next. Ingredient-class gear without a nested ledger still gets a **synthetic** single row so dismantle
	* refunds the part. The final `return` catches non-equip donors where none of the above applied.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} baseDatum The base datum driving this step.
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} materialDatum The material datum driving this step.
	* @returns {JaftingSalvageLedgerSnapshot}
	*/
	static buildRefinementOutputLedger(baseDatum, materialDatum) {
		const baseLedger = JaftingSalvageManager.getLedgerForDatum(baseDatum);
		const baseRows = baseLedger && baseLedger.rows ? JaftingSalvageLedger.cloneRows(baseLedger.rows) : [];
		if (JaftingSalvageManager.refinementMaterialHasNoRecoverableRows(materialDatum)) {
			return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeDuplicateRows(baseRows));
		}
		const materialLedger = JaftingSalvageManager.getLedgerForDatum(materialDatum);
		if (materialLedger && materialLedger.rows && materialLedger.rows.length > 0) {
			return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(baseRows, materialLedger.rows));
		}
		if (materialDatum.isArmor() && materialDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId()) {
			const partRows = [new JaftingSalvageLedgerRow("a", materialDatum.id, 1)];
			return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(baseRows, partRows));
		}
		if (JaftingSalvageLedger.isMaterialWeaponDatum(materialDatum)) {
			const partRows = [new JaftingSalvageLedgerRow("w", materialDatum.id, 1)];
			return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeRowArrays(baseRows, partRows));
		}
		return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeDuplicateRows(baseRows));
	}
	/**
	* Whether dismantling this datum would return anything after weapon/armor expansion.<br>
	* UI uses this so vendor-only stamps (bare `w`/`a` rows that unpack to nothing) never clutter the candidate list.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @returns {boolean}
	*/
	static datumHasSalvageLedger(datum) {
		const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(datum);
		return !!(snap && snap.rows && snap.rows.length > 0);
	}
	/**
	* Clone of the party/datum ledger with `w`/`a` rows replaced by nested ingredient rows (or dropped when vendor).<br>
	* Stored ledgers stay raw; dismantle + UI read through this snapshot so crafted donors never pay whole weapons back.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @returns {JaftingSalvageLedgerSnapshot|null}
	*/
	static getSalvageLedgerSnapshotExpanded(datum) {
		const raw = JaftingSalvageManager.getLedgerForDatum(datum);
		if (!raw || !raw.rows || raw.rows.length === 0) {
			return null;
		}
		const merged = JaftingSalvageLedger.mergeDuplicateRows(JaftingSalvageLedger.cloneRows(raw.rows));
		const expanded = JaftingSalvageManager.expandWeaponArmorRowsForSalvage(merged, {});
		return new JaftingSalvageLedgerSnapshot(expanded);
	}
	/**
	* Counts non-banned rows after expansion (used for salvage UI layout).
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static visibleExpandedRefundRowCount(datum) {
		const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(datum);
		if (!snap || !snap.rows) {
			return 0;
		}
		let n = 0;
		for (let i = 0; i < snap.rows.length; i++) {
			if (snap.rows[i].banned === true) {
				continue;
			}
			n++;
		}
		return n;
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static layoutPreviewLineCountSingle(datum) {
		if (datum === null || datum === undefined) {
			return 1;
		}
		const n = JaftingSalvageManager.visibleExpandedRefundRowCount(datum);
		if (n < 1) {
			return 1;
		}
		return 3 + n;
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static layoutPreviewLineCountTwoColumn(datum) {
		const n = JaftingSalvageManager.visibleExpandedRefundRowCount(datum);
		if (n < 1) {
			return JaftingSalvageManager.layoutPreviewLineCountSingle(datum);
		}
		return 3 + Math.ceil(n / 2);
	}
	/**
	* When a weapon/armor ledger row has no nested ledger, vendor shells drop—except material-type gear.
	*
	* @param {JaftingSalvageLedgerRow[]} flat The flat driving this step.
	* @param {JaftingSalvageLedgerRow|{ t: string, id: number, n: number, banned?: boolean }} row
	* @param {RPG_Weapon|RPG_Armor} equipDatum The equip datum driving this step.
	* @returns {boolean} true when a pass-through row was appended.
	*/
	static tryPushMaterialEquipmentPassThrough(flat, row, equipDatum) {
		const isArmorMaterial = row.t === "a" && equipDatum.isArmor() && equipDatum.atypeId === JaftingSalvageLedger.getMaterialArmorTypeId();
		const isWeaponMaterial = row.t === "w" && equipDatum.isWeapon() && JaftingSalvageLedger.isMaterialWeaponDatum(equipDatum);
		if (isArmorMaterial === false && isWeaponMaterial === false) {
			return false;
		}
		flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n));
		return true;
	}
	/**
	* Replaces each `w`/`a` row with that template's stamped ledger (scaled by row count), or drops it with no
	* ledger.<br>
	* Ingredient armors ({@link JaftingSalvageLedger.getMaterialArmorTypeId}) and configured material weapons keep bare
	* `a` / `w` refund lines when the template
	* carries no nested ledger—those rows are refinement materials, not vendor-only equipment shells.<br>
	* {@link visited} breaks cycles if a ledger ever references itself transitively.
	*
	* @param {JaftingSalvageLedgerRow[]|{ t: string, id: number, n: number, banned?: boolean }[]} rows
	* @param {Record<string, boolean>} visited The visited driving this step.
	* @returns {JaftingSalvageLedgerRow[]}
	*/
	static expandWeaponArmorRowsForSalvage(rows, visited) {
		const flat = [];
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			if (row.banned === true) {
				flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n, true));
				continue;
			}
			if (row.t !== "w" && row.t !== "a") {
				flat.push(new JaftingSalvageLedgerRow(row.t, row.id, row.n));
				continue;
			}
			const visitKey = `${row.t}:${row.id}`;
			if (visited[visitKey] === true) {
				continue;
			}
			visited[visitKey] = true;
			let equipDatum;
			if (row.t === "w") {
				equipDatum = $dataWeapons[row.id];
			} else {
				equipDatum = $dataArmors[row.id];
			}
			if (!equipDatum) {
				continue;
			}
			const sub = JaftingSalvageManager.getLedgerForDatum(equipDatum);
			if (!sub || !sub.rows || sub.rows.length === 0) {
				JaftingSalvageManager.tryPushMaterialEquipmentPassThrough(flat, row, equipDatum);
				continue;
			}
			const innerMerged = JaftingSalvageLedger.mergeDuplicateRows(JaftingSalvageLedger.cloneRows(sub.rows));
			const innerExpanded = JaftingSalvageManager.expandWeaponArmorRowsForSalvage(innerMerged, visited);
			const mult = row.n;
			for (let j = 0; j < innerExpanded.length; j++) {
				const ir = innerExpanded[j];
				const piece = new JaftingSalvageLedgerRow(ir.t, ir.id, ir.n * mult, ir.banned === true);
				flat.push(piece);
			}
		}
		return JaftingSalvageLedger.mergeDuplicateRows(flat);
	}
	/**
	* Candidate datums that may enter the salvage scene list.
	*
	* @returns {RPG_Base[]}
	*/
	static getSalvageCandidateDatums() {
		const all = $gameParty.allItems();
		const out = [];
		for (let i = 0; i < all.length; i++) {
			const datum = all[i];
			if (!datum) {
				continue;
			}
			if ($gameParty.numItems(datum) < 1) {
				continue;
			}
			if (JaftingSalvageManager.datumHasSalvageLedger(datum) === false) {
				continue;
			}
			out.push(datum);
		}
		return out;
	}
	/**
	* The stamped ledgers of the copies a dismantle is about to destroy, newest first.
	*
	* A dynamic instance is a single unique row rather than a stack, so its own snapshot is the whole answer. A
	* template stack hands back the tail of {@link JaftingSalvagePartyLedgerBag#unitLedgers}, which is where the most
	* recently acquired copies live. An unstamped copy contributes nothing, which is why the array is allowed to hold
	* nulls in the first place - a stack can mix crafted copies with ones bought from a shop.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum being dismantled.
	* @param {number} amount How many copies are being destroyed.
	* @returns {Array<JaftingSalvageLedgerSnapshot>} One entry per stamped copy being destroyed.
	*/
	static ledgersForSalvagedUnits(datum, amount) {
		if (datum._jaftingSalvageLedger) {
			return [datum._jaftingSalvageLedger];
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		const bag = $gameParty._j._jafting._salvageLedgers[key];
		const units = bag.unitLedgers;
		const start = Math.max(0, units.length - amount);
		return units.slice(start).filter((unit) => unit !== null);
	}
	/**
	* Builds the payout for a dismantle: every destroyed copy expanded to leaves, halved, then merged.
	*
	* The order is load-bearing. Expansion has to run **per copy** with its own visited set, or the cycle-breaker
	* would treat a second copy's identical rows as already seen and drop them. Halving has to run **per copy** too,
	* before merging, or two copies costing nine would round once against eighteen instead of twice against nine.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum being dismantled.
	* @param {number} amount How many copies are being destroyed.
	* @returns {JaftingSalvageLedgerSnapshot} What the player receives.
	*/
	static refundForSalvagedUnits(datum, amount) {
		const ledgers = JaftingSalvageManager.ledgersForSalvagedUnits(datum, amount);
		const refundRows = [];
		ledgers.forEach((ledger) => {
			const stored = JaftingSalvageLedger.mergeDuplicateRows(JaftingSalvageLedger.cloneRows(ledger.rows));
			const expanded = JaftingSalvageManager.expandWeaponArmorRowsForSalvage(stored, {});
			expanded.forEach((row) => refundRows.push(JaftingSalvageManager.refundableRow(row)));
		});
		return new JaftingSalvageLedgerSnapshot(JaftingSalvageLedger.mergeDuplicateRows(refundRows));
	}
	/**
	* Drops the ledgers of the copies a dismantle just destroyed.
	*
	* Destruction is the one moment a ledger can be discarded on the spot, because unlike a copy leaving the bag for
	* any other reason there is no chance it comes back. Everything else defers to the sweep.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum being dismantled.
	* @param {number} amount How many copies were destroyed.
	*/
	static releaseSalvagedUnitLedgers(datum, amount) {
		if (datum._jaftingSalvageLedger) {
			datum._jaftingSalvageLedger = null;
			return;
		}
		const key = JaftingSalvageManager.containerKeyFromDatum(datum);
		const bag = $gameParty._j._jafting._salvageLedgers[key];
		const units = bag.unitLedgers;
		units.splice(Math.max(0, units.length - amount), amount);
		JaftingSalvageManager.recomputeMergedRowsFromPartyLedgerBag(bag);
		JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
	}
	/**
	* The share of one row's cost that dismantling hands back: half, rounded up.
	*
	* Rounding up rather than down is deliberate and it is the generous direction on purpose - a component that cost
	* one comes back whole, because rounding down would mean single-unit ingredients silently vanish and dismantling
	* a dish made of six different one-of things would pay nothing at all.
	*
	* @param {JaftingSalvageLedgerRow} row An already-expanded leaf row.
	* @returns {JaftingSalvageLedgerRow} A row carrying the refundable quantity.
	*/
	static refundableRow(row) {
		const refundable = Math.ceil(row.n / 2);
		return new JaftingSalvageLedgerRow(row.t, row.id, refundable, row.banned === true);
	}
	/**
	* Pays out every eligible row, scaled by {@link amount}. Banned rows skip.
	*
	* **This method applies no policy of its own** - it hands over exactly what it is given. The half-refund rate
	* lives in {@link refundableRow}, applied per stamped unit by {@link executeSalvage} before rows are merged,
	* because merging first and halving after would round a different number and quietly change the rate.
	*
	* **Contract:** callers pass **already expanded** rows (see
	* {@link JaftingSalvageManager.getSalvageLedgerSnapshotExpanded})
	* so `w` / `a` lines here are leaf refunds—never whole crafted shells that still need unpacking. If you feed raw
	* storage, vendor rows could mint unintended items.
	*
	* @param {JaftingSalvageLedgerSnapshot|{ rows: JaftingSalvageLedgerRow[] }} ledger
	* @param {number} amount The amount driving this step.
	*/
	static refundLedgerRows(ledger, amount) {
		if (amount < 1) {
			return;
		}
		for (let i = 0; i < ledger.rows.length; i++) {
			const row = ledger.rows[i];
			if (row.banned === true) {
				continue;
			}
			const total = row.n * amount;
			if (row.t === "i") {
				$gameParty.gainItem($dataItems[row.id], total);
			} else if (row.t === "w") {
				$gameParty.gainItem($dataWeapons[row.id], total);
			} else if (row.t === "a") {
				$gameParty.gainItem($dataArmors[row.id], total);
			} else if (row.t === "g") {
				$gameParty.gainGold(total);
			} else if (row.t === "s") {
				$gameParty.members().forEach((actor) => actor.modSdpPoints(total));
			}
		}
	}
	/**
	* Executes salvage for {@link amount} units of {@link datum}.
	*
	* **Refunds come from the specific copies being destroyed, never from the stack's summary.** `bag.rows` is the
	* union of every stamped copy - three swords that each cost two horns summarise as six - and paying from that
	* summary refunds the whole stack's history for every single copy dismantled, so crafting a batch and taking it
	* apart one at a time multiplies materials by the stack height. The per-copy ledgers were always being recorded;
	* this is the path that finally reads them.
	*
	* Copies are consumed **last-in-first-out**, matching the order {@link appendStampedUnitsToPartyStack} writes
	* them. Two copies of one database row are indistinguishable to the player, so there is nothing to choose
	* between beyond being consistent with how they were stacked.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} datum The datum driving this step.
	* @param {number} amount The amount driving this step.
	* @returns {boolean}
	*/
	static executeSalvage(datum, amount) {
		const raw = JaftingSalvageManager.getLedgerForDatum(datum);
		if (!raw || !raw.rows || raw.rows.length === 0) {
			return false;
		}
		if (amount < 1) {
			return false;
		}
		if ($gameParty.numItems(datum) < amount) {
			return false;
		}
		const refund = JaftingSalvageManager.refundForSalvagedUnits(datum, amount);
		if (refund.rows.length === 0) {
			return false;
		}
		JaftingSalvageManager.refundLedgerRows(refund, 1);
		JaftingSalvageManager.releaseSalvagedUnitLedgers(datum, amount);
		$gameParty.loseItem(datum, amount);
		return true;
	}
	/**
	* Party hook after items leave inventory — keeps template bags sized to the stack they describe.
	*
	* **This hook deliberately does not collect anything belonging to a dynamic instance.** Leaving the bag is not
	* the same event as leaving the game: equipping is a `loseItem`, and vanilla's `tradeItemWithParty` spends the
	* row *before* `changeEquip` installs it in the slot, so at this exact moment a weapon being equipped is in
	* neither the inventory nor anyone's hands. A count of zero here answers "not in the bag", which is not the
	* question collection needs answered. {@link reclaimUnreferencedDynamicSlots} asks the real one, later, from a
	* point where the answer has settled.
	*
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} itemDatum The item datum driving this step.
	* @param {number} amountLost The amount lost driving this step.
	*/
	static afterPartyLostItem(itemDatum, amountLost) {
		if (!itemDatum) {
			return;
		}
		if (amountLost < 1) {
			return;
		}
		if (itemDatum._key() < JaftingSalvageManager.DynamicEquipIndexMin) {
			const key = JaftingSalvageManager.containerKeyFromDatum(itemDatum);
			if (key) {
				JaftingSalvageManager.initPartySalvageStorage();
				const bag = $gameParty._j._jafting._salvageLedgers[key];
				if (bag) {
					JaftingSalvageManager.coercePartyLedgerBagShapeForDatum(bag, itemDatum);
					JaftingSalvageManager.pruneEmptyPartyLedgerBag(key);
				}
			}
		}
		if (itemDatum._key() >= JaftingSalvageManager.DynamicEquipIndexMin) {
			return;
		}
		if ($gameParty.numItems(itemDatum) > 0) {
			return;
		}
		JaftingSalvageManager.clearLedgerForDatum(itemDatum);
	}
	/**
	* Collects every dynamic refinement slot nothing can reach any more.
	*
	* **This is a garbage collector, and it is correct for it to run late.** The refinement counter only ever
	* increments - reclaiming a slot never returns it to the allocator - so no future refinement can land in a
	* collected slot, and nothing is ever waiting on one being freed. All collection buys is a save that stops
	* growing and a load that stops replaying rows the player no longer owns, neither of which is urgent. That is
	* what makes it safe to ask this question from a quiet moment instead of from the middle of an equip.
	*
	* Call it from somewhere the player is demonstrably done transacting - J-JAFTING-Refinement drives it off
	* `Scene_Map.start`, which every menu, shop, and battle return passes through.
	*/
	static reclaimUnreferencedDynamicSlots() {
		const weaponSlots = $gameParty.getRefinedWeapons().map((lineage) => lineage.index);
		const armorSlots = $gameParty.getRefinedArmors().map((lineage) => lineage.index);
		weaponSlots.forEach((slot) => JaftingSalvageManager.reclaimWeaponSlotWhenUnreferenced(slot));
		armorSlots.forEach((slot) => JaftingSalvageManager.reclaimArmorSlotWhenUnreferenced(slot));
	}
	/**
	* Collects one dynamic weapon slot if nothing holds it.
	*
	* @param {number} slot The `$dataWeapons` slot a tracked refinement occupies.
	*/
	static reclaimWeaponSlotWhenUnreferenced(slot) {
		const row = $dataWeapons[slot];
		if (JaftingSalvageManager.isDynamicRowHeld(row)) {
			return;
		}
		JaftingSalvageManager.reclaimDynamicWeaponSlot(row);
	}
	/**
	* Collects one dynamic armor slot if nothing holds it.
	*
	* @param {number} slot The `$dataArmors` slot a tracked refinement occupies.
	*/
	static reclaimArmorSlotWhenUnreferenced(slot) {
		const row = $dataArmors[slot];
		if (JaftingSalvageManager.isDynamicRowHeld(row)) {
			return;
		}
		JaftingSalvageManager.reclaimDynamicArmorSlot(row);
	}
	/**
	* Whether anything in the playthrough still holds this row.
	*
	* Two places can hold one, and both have to be asked. The bag is the obvious one. The other is somebody's
	* hands - and that means **every actor the save has built, not the current party roster**, because an actor
	* written out of the party keeps wearing whatever they had on. Chef Adventure splits its two leads up for
	* whole dungeons, so the character who is not currently travelling with you is exactly the one whose sword
	* would otherwise be collected out from under them.
	*
	* @param {RPG_Weapon|RPG_Armor} datum The dynamic row being considered for collection.
	* @returns {boolean}
	*/
	static isDynamicRowHeld(datum) {
		if ($gameParty.numItems(datum) > 0) {
			return true;
		}
		return JaftingSalvageManager.isRowWornByAnyone(datum);
	}
	/**
	* Whether any actor this save has built is wearing this row.
	*
	* Reads `existingActors` rather than `actors`, because the latter hands every database id to
	* {@link Game_Actors.actor} and lazily constructs whatever is missing - which would answer "who exists" by
	* making more of them exist, on every single map entry.
	*
	* @param {RPG_Weapon|RPG_Armor} datum The dynamic row being considered for collection.
	* @returns {boolean}
	*/
	static isRowWornByAnyone(datum) {
		const slot = datum._key();
		return $gameActors.existingActors().some((actor) => JaftingSalvageManager.isActorWearingSlot(actor, slot));
	}
	/**
	* Whether one actor is wearing the row occupying a given slot.
	*
	* Compares slots rather than object identity: `Game_Item` stores a refined equip by its `_key()`, so the slot
	* is what an equipped instance is actually recorded as. An empty equip slot resolves to `null` by contract -
	* that is what `Game_Item.object()` returns when nothing is set - so the list genuinely holds gaps.
	*
	* @param {Game_Actor} actor The actor whose equipment is being read.
	* @param {number} slot The datastore slot being looked for.
	* @returns {boolean}
	*/
	static isActorWearingSlot(actor, slot) {
		return actor.equips().some((equip) => equip !== null && equip._key() === slot);
	}
	/**
	* Removes refined weapon bookkeeping when the row is fully gone from inventory.
	*
	* @param {RPG_Weapon} weaponDatum The weapon datum driving this step.
	*/
	static reclaimDynamicWeaponSlot(weaponDatum) {
		const weapons = $gameParty.getRefinedWeapons();
		const slot = weaponDatum._key();
		for (let i = 0; i < weapons.length; i++) {
			if (weapons[i].index === slot) {
				weapons.splice(i, 1);
				break;
			}
		}
		$dataWeapons[slot] = RPG_Weapon.createEmpty(slot);
		JaftingSalvageManager.onAfterDynamicSlotReclaimed("weapon", slot);
	}
	/**
	* Removes refined armor bookkeeping when the row is fully gone from inventory.
	*
	* @param {RPG_Armor} armorDatum The armor datum driving this step.
	*/
	static reclaimDynamicArmorSlot(armorDatum) {
		const armors = $gameParty.getRefinedArmors();
		const slot = armorDatum._key();
		for (let i = 0; i < armors.length; i++) {
			if (armors[i].index === slot) {
				armors.splice(i, 1);
				break;
			}
		}
		$dataArmors[slot] = RPG_Armor.createEmpty(slot);
		JaftingSalvageManager.onAfterDynamicSlotReclaimed("armor", slot);
	}
};

//#endregion
//#region src/plugins/jafting/core/objects/DataManager.js
/**
* Salvage ledger bags live on `$gameParty._j` — they must exist after the party object is real.<br>
* Vanilla {@link Scene_Boot#onDatabaseLoaded} fires **before** {@link DataManager.createGameObjects}, so `$gameParty`
* is still null there; explicit init belongs on {@link DataManager.createGameObjects} and on
* {@link DataManager.extractSaveContents} after a loaded save replaces `$gameParty`.
*/
J.JAFTING.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.JAFTING.Aliased.DataManager.get("createGameObjects").call(this);
	JaftingSalvageManager.initPartySalvageStorage();
};
J.JAFTING.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents) {
	J.JAFTING.Aliased.DataManager.get("extractSaveContents").call(this, contents);
	JaftingSalvageManager.initPartySalvageStorage();
};

//#endregion
//#region src/plugins/jafting/core/objects/Game_Party.js
/**
* Extends {@link Game_Party.prototype.gainItem}.<br/>
* Keeps per-slot salvage ledgers aligned when static-template stacks grow outside crafting stamps.
*/
J.JAFTING.Aliased.Game_Party.set("gainItem", Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
	J.JAFTING.Aliased.Game_Party.get("gainItem").call(this, item, amount, includeEquip);
	JaftingSalvageManager.afterPartyGainedItem(item, amount);
};
/**
* Extends {@link Game_Party.prototype.loseItem}.<br/>
* Reclaims refinement datastore slots once dynamic equipment leaves inventory entirely.
*/
J.JAFTING.Aliased.Game_Party.set("loseItem", Game_Party.prototype.loseItem);
Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
	J.JAFTING.Aliased.Game_Party.get("loseItem").call(this, item, amount, includeEquip);
	JaftingSalvageManager.afterPartyLostItem(item, amount);
};

//#endregion
//#region src/plugins/jafting/core/windows/Window_JaftingListHeader.js
var Window_JaftingListHeader = class extends Window_Base {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws the JAFTING hub title and short description.
	*/
	drawContent() {
		const [x, y] = [0, 0];
		const lh = this.lineHeight();
		this.drawHeader(x, y);
		const detailY = y + lh * 1;
		this.drawDetail(x, detailY);
	}
	/**
	* Draws the header text.
	* @param {number} x The base x coordinate for this section.
	* @param {number} y The base y coordinate for this section.
	*/
	drawHeader(x, y) {
		this.modFontSize(10);
		const headerText = "The Jafting System";
		const headerTextWidth = this.width;
		this.toggleBold(true);
		this.drawText(headerText, x, y, headerTextWidth, "center");
		this.resetFontSettings();
	}
	/**
	* Draws the detail text.
	* @param {number} x The base x coordinate for this section.
	* @param {number} y The base y coordinate for this section.
	*/
	drawDetail(x, y) {
		const detailText = "Item Creation of all kinds, at your doorstep.";
		const detailTextWidth = this.width;
		this.toggleItalics(true);
		this.drawText(detailText, x, y, detailTextWidth, "center");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/jafting/core/windows/Window_SalvageCandidateList.js
/**
* Lists inventory rows that currently carry a JAFTING salvage ledger.
*/
var Window_SalvageCandidateList = class extends Window_Selectable {
	/**
	* Gets the data.
	* @returns {Array} The data.
	*/
	data() {
		return this._data;
	}
	/**
	* Sets the data.
	* @param {Array} newData The new data.
	*/
	setData(newData) {
		this._data = newData;
	}
	/**
	* @param {Rectangle} rect Window geometry.
	*/
	constructor(rect) {
		super(rect);
		this._data = [];
	}
	/**
	* @returns {number}
	*/
	maxItems() {
		return this.data().length;
	}
	/**
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor|undefined}
	*/
	item() {
		return this.data()[this.index()];
	}
	/**
	* Rebuilds the backing datums from {@link JaftingSalvageManager.getSalvageCandidateDatums}.
	*/
	makeItemList() {
		this.setData(JaftingSalvageManager.getSalvageCandidateDatums());
	}
	/**
	* Refreshes selectable entries.
	*/
	refresh() {
		const prevIndex = this.index();
		this.makeItemList();
		Window_Selectable.prototype.refresh.call(this);
		if (this.maxItems() < 1) {
			this.select(-1);
			return;
		}
		if (prevIndex < 0) {
			this.select(0);
			return;
		}
		if (prevIndex >= this.maxItems()) {
			this.select(this.maxItems() - 1);
		}
	}
	/**
	* @param {number} index Draw index.
	*/
	drawItem(index) {
		const datum = this.data()[index];
		if (datum === undefined || datum === null) {
			return;
		}
		const rect = this.itemLineRect(index);
		this.resetTextColor();
		this.changePaintOpacity(true);
		this.drawIcon(datum.iconIndex, rect.x + 2, rect.y + 2);
		this.drawText(datum.name, rect.x + 40, rect.y, rect.width - 40);
	}
};

//#endregion
//#region src/plugins/jafting/core/windows/Window_SalvageConfirmation.js
/**
* Confirms execution of salvage so players cannot accidentally dismantle gear.
*/
var Window_SalvageConfirmation = class extends Window_Command {
	/**
	* @param {Rectangle} rect Window geometry.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Builds confirm/cancel commands.
	*/
	makeCommandList() {
		this.addCommand("Salvage now", "confirm", true);
		this.addCommand("Nevermind", "cancel", true);
	}
};

//#endregion
//#region src/plugins/jafting/core/windows/Window_SalvagePreview.js
/**
* Refund breakdown for the highlighted salvage candidate—icons and name colors match standard {@link Window_Base}
* item drawing so the pane reads like the rest of the engine menus.<br>
* {@link Scene_JaftingSalvage} places this window full-height beside the list with a capped width;
* {@link JaftingSalvageManager} expands nested `w`/`a` ledger rows into ingredients for display and payout.
*/
var Window_SalvagePreview = class Window_SalvagePreview extends Window_Base {
	/**
	* Gets the refund two column.
	* @returns {boolean} The refundTwoColumn.
	*/
	/**
	* Gets the dismantle amount.
	* @returns {number} The dismantleAmount.
	*/
	dismantleAmount() {
		return this._dismantleAmount;
	}
	/**
	* Gets the datum.
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor|null} The datum.
	*/
	datum() {
		return this._datum;
	}
	/**
	* @param {Rectangle} rect Window geometry (repositioned by {@link Scene_JaftingSalvage#layoutSalvagePanels}).
	*/
	isRefundTwoColumn() {
		return this._refundTwoColumn;
	}
	/**
	* Sets the refund two column.
	* @param {boolean} newRefundTwoColumn The new refundTwoColumn.
	*/
	setRefundTwoColumn(newRefundTwoColumn) {
		this._refundTwoColumn = newRefundTwoColumn;
	}
	constructor(rect) {
		super(rect);
		this._datum = null;
		this._dismantleAmount = 1;
		this._refundTwoColumn = false;
	}
	/**
	* When true, refund rows render in two columns so more components fit without scrolling.
	*
	* @param {boolean} flag The flag driving this step.
	*/
	setRefundTwoColumnMode(flag) {
		this.setRefundTwoColumn(flag === true);
	}
	/**
	* How many stamped units one confirm action dismantles (must match {@link Scene_JaftingSalvage.DismantleBatchSize}).
	*
	* @param {number} amount The amount driving this step.
	*/
	setDismantleAmount(amount) {
		if (amount < 1) {
			this._dismantleAmount = 1;
		} else {
			this._dismantleAmount = amount;
		}
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null} datum The datum driving this step.
	*/
	setDatum(datum) {
		this._datum = datum;
		this.refresh();
	}
	/**
	* Renders stack context, dismantle batch size, and scaled refund lines (expanded snapshot).
	*/
	refresh() {
		if (!this.contents) {
			this.createContents();
		}
		this.contents.clear();
		if (this.datum() === null || this.datum() === undefined) {
			this.drawText("Select an item to preview refunds.", 0, 0, this.contentsWidth(), "left");
			return;
		}
		const raw = JaftingSalvageManager.getLedgerForDatum(this.datum());
		if (!raw || !raw.rows || raw.rows.length === 0) {
			this.drawText("Nothing recoverable is stamped on this item.", 0, 0, this.contentsWidth(), "left");
			return;
		}
		const snap = JaftingSalvageManager.getSalvageLedgerSnapshotExpanded(this.datum());
		if (!snap || !snap.rows || snap.rows.length === 0) {
			this.drawText("Stamped, but every weapon/armor line was vendor-only—nothing returns when dismantled.", 0, 0, this.contentsWidth(), "left");
			return;
		}
		const visibleRows = Window_SalvagePreview.collectNonBannedRows(snap.rows);
		const stack = $gameParty.numItems(this.datum());
		const batch = this.dismantleAmount();
		let y = 0;
		const lh = this.lineHeight();
		const countCol = 72;
		const nameW = this.contentsWidth() - countCol;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText("Selected item", 0, y, this.contentsWidth(), "left");
		y += lh;
		this.resetTextColor();
		this.drawItemName(this.datum(), 0, y, nameW);
		this.drawText(`×${stack}`, nameW, y, countCol, "right");
		y += lh;
		this.changeTextColor(ColorManager.systemColor());
		if (batch === 1) {
			this.drawText("Refund after dismantling ×1 unit:", 0, y, this.contentsWidth(), "left");
		} else {
			this.drawText(`Refund after dismantling ×${batch} units:`, 0, y, this.contentsWidth(), "left");
		}
		y += lh;
		this.resetTextColor();
		this.paintExpandedRefundRows(y, visibleRows, batch, lh, countCol, nameW);
	}
	/**
	* @param {object[]} rows The rows driving this step.
	* @returns {object[]}
	*/
	static collectNonBannedRows(rows) {
		const out = [];
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			if (row.banned === true) {
				continue;
			}
			out.push(row);
		}
		return out;
	}
	/**
	* @param {number} y The y driving this step.
	* @param {object[]} visibleRows The visible rows driving this step.
	* @param {number} batch The batch driving this step.
	* @param {number} lh The lh driving this step.
	* @param {number} countCol The count col driving this step.
	* @param {number} nameW The name w driving this step.
	*/
	paintExpandedRefundRows(y, visibleRows, batch, lh, countCol, nameW) {
		if (this.isRefundTwoColumn() === false) {
			this.paintExpandedRefundRowsSingle(y, visibleRows, batch, lh, countCol, nameW);
			return;
		}
		this.paintExpandedRefundRowsDouble(y, visibleRows, batch, lh);
	}
	/**
	* @param {number} y The y driving this step.
	* @param {object[]} visibleRows The visible rows driving this step.
	* @param {number} batch The batch driving this step.
	* @param {number} lh The lh driving this step.
	* @param {number} countCol The count col driving this step.
	* @param {number} nameW The name w driving this step.
	*/
	paintExpandedRefundRowsSingle(y, visibleRows, batch, lh, countCol, nameW) {
		let yy = y;
		let rendered = 0;
		for (let i = 0; i < visibleRows.length; i++) {
			if (yy + lh > this.contentsHeight()) {
				break;
			}
			yy = this.drawLedgerRefundRow(visibleRows[i], 0, yy, batch, lh, countCol, nameW, this.contentsWidth());
			rendered++;
		}
		if (rendered < visibleRows.length && yy + lh <= this.contentsHeight()) {
			const more = visibleRows.length - rendered;
			this.changeTextColor(ColorManager.systemColor());
			this.drawText(`+${more} more refunds.`, 0, yy, this.contentsWidth(), "left");
			this.resetTextColor();
		}
	}
	/**
	* @param {number} y The y driving this step.
	* @param {object[]} visibleRows The visible rows driving this step.
	* @param {number} batch The batch driving this step.
	* @param {number} lh The lh driving this step.
	*/
	paintExpandedRefundRowsDouble(y, visibleRows, batch, lh) {
		let yy = y;
		const gutter = 12;
		const colW = Math.floor((this.contentsWidth() - gutter) / 2);
		const ccL = Math.min(56, Math.floor(colW * .28));
		const nwL = colW - ccL;
		const ccR = Math.min(56, Math.floor(colW * .28));
		const nwR = colW - ccR;
		let rendered = 0;
		for (let i = 0; i < visibleRows.length; i += 2) {
			if (yy + lh > this.contentsHeight()) {
				break;
			}
			const rowL = visibleRows[i];
			const rowR = visibleRows[i + 1];
			const rowY = yy;
			yy = this.drawLedgerRefundRow(rowL, 0, rowY, batch, lh, ccL, nwL, colW);
			rendered++;
			if (rowR) {
				this.drawLedgerRefundRow(rowR, colW + gutter, rowY, batch, lh, ccR, nwR, colW);
				rendered++;
			}
			yy += lh;
		}
		if (rendered < visibleRows.length && yy + lh <= this.contentsHeight()) {
			const more = visibleRows.length - rendered;
			this.changeTextColor(ColorManager.systemColor());
			this.drawText(`+${more} more refunds.`, 0, yy, this.contentsWidth(), "left");
			this.resetTextColor();
		}
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static previewContentLineCount(datum) {
		return JaftingSalvageManager.layoutPreviewLineCountSingle(datum);
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static previewContentLineCountTwoColumn(datum) {
		return JaftingSalvageManager.layoutPreviewLineCountTwoColumn(datum);
	}
	/**
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null|undefined} datum The datum driving this step.
	* @returns {number}
	*/
	static countVisibleRefundRowsForDatum(datum) {
		return JaftingSalvageManager.visibleExpandedRefundRowCount(datum);
	}
	/**
	* @param {{ t: string, id: number, n: number, banned?: boolean }} row
	* @param {number} baseX The base x driving this step.
	* @param {number} y The y driving this step.
	* @param {number} dismantleBatch The dismantle batch driving this step.
	* @param {number} lh The lh driving this step.
	* @param {number} countCol The count col driving this step.
	* @param {number} nameW The name w driving this step.
	* @param {number} colInnerW width budget for this column (drawItemName + count).
	* @returns {number} next Y below this row.
	*/
	drawLedgerRefundRow(row, baseX, y, dismantleBatch, lh, countCol, nameW, colInnerW) {
		const qty = row.n * dismantleBatch;
		const nameWClamped = Math.max(40, colInnerW - countCol);
		if (row.t === "i" || row.t === "w" || row.t === "a") {
			const datum = Window_SalvagePreview.databaseDatumForRow(row);
			if (datum === null || datum === undefined) {
				this.drawText(`(missing) ×${qty}`, baseX, y, colInnerW, "left");
				return y + lh;
			}
			this.drawItemName(datum, baseX, y, nameWClamped);
			this.drawText(`×${qty}`, baseX + nameWClamped, y, countCol, "right");
			return y + lh;
		}
		if (row.t === "g") {
			this.drawCurrencyValue(String(qty), TextManager.currencyUnit, baseX, y, colInnerW);
			return y + lh;
		}
		if (row.t === "s") {
			this.changeTextColor(ColorManager.systemColor());
			this.drawText(TextManager.sdpPoints(), baseX, y, colInnerW - countCol, "left");
			this.resetTextColor();
			this.drawText(String(qty), baseX + nameWClamped, y, countCol, "right");
			return y + lh;
		}
		this.drawText(`Unknown ×${qty}`, baseX, y, colInnerW, "left");
		return y + lh;
	}
	/**
	* @param {{ t: string, id: number, n: number }} row
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor|null}
	*/
	static databaseDatumForRow(row) {
		if (row.t === "i") {
			return $dataItems[row.id];
		}
		if (row.t === "w") {
			return $dataWeapons[row.id];
		}
		if (row.t === "a") {
			return $dataArmors[row.id];
		}
		return null;
	}
};

//#endregion
//#region src/plugins/jafting/core/scenes/Scene_JaftingSalvage.js
/**
* First-class salvage scene: pick a stamped item, preview refunds, confirm destruction.
*/
var Scene_JaftingSalvage = class Scene_JaftingSalvage extends Scene_MenuBase {
	/**
	* Gets the last preview datum.
	* @returns {RPG_Item|RPG_Weapon|RPG_Armor|null} The lastPreviewDatum.
	*/
	lastPreviewDatum() {
		return this._lastPreviewDatum;
	}
	/**
	* Sets the last preview datum.
	* @param {RPG_Item|RPG_Weapon|RPG_Armor|null} newLastPreviewDatum The new lastPreviewDatum.
	*/
	setLastPreviewDatum(newLastPreviewDatum) {
		this._lastPreviewDatum = newLastPreviewDatum;
	}
	/**
	* Gets the last preview stack.
	* @returns {number|null} The lastPreviewStack.
	*/
	lastPreviewStack() {
		return this._lastPreviewStack;
	}
	/**
	* Sets the last preview stack.
	* @param {number|null} newLastPreviewStack The new lastPreviewStack.
	*/
	setLastPreviewStack(newLastPreviewStack) {
		this._lastPreviewStack = newLastPreviewStack;
	}
	/**
	* Gets the candidate window.
	* @returns {Window_SalvageCandidateList} The candidateWindow.
	*/
	candidateWindow() {
		return this._candidateWindow;
	}
	/**
	* Sets the candidate window.
	* @param {Window_SalvageCandidateList} newCandidateWindow The new candidateWindow.
	*/
	setCandidateWindow(newCandidateWindow) {
		this._candidateWindow = newCandidateWindow;
	}
	/**
	* Gets the preview window.
	* @returns {Window_SalvagePreview} The previewWindow.
	*/
	previewWindow() {
		return this._previewWindow;
	}
	/**
	* Sets the preview window.
	* @param {Window_SalvagePreview} newPreviewWindow The new previewWindow.
	*/
	setPreviewWindow(newPreviewWindow) {
		this._previewWindow = newPreviewWindow;
	}
	/**
	* Gets the confirmation window.
	* @returns {Window_SalvageConfirmation} The confirmationWindow.
	*/
	confirmationWindow() {
		return this._confirmationWindow;
	}
	/**
	* Sets the confirmation window.
	* @param {Window_SalvageConfirmation} newConfirmationWindow The new confirmationWindow.
	*/
	setConfirmationWindow(newConfirmationWindow) {
		this._confirmationWindow = newConfirmationWindow;
	}
	/**
	* How many stamped units one confirmation dismantles (stack splitting can grow this later).
	*/
	static DismantleBatchSize = 1;
	/**
	* Hub / handler symbol for {@link Window_JaftingList} and {@link Scene_Jafting#onRootJaftingSelection}.
	* @type {string}
	*/
	static KEY = "jafting-salvage";
	/**
	* Whether the root JAFTING menu should allow choosing Salvage (plugin command {@code call-salvage} ignores this).
	* Switch id {@code 0} skips the gate so designers can leave the parameter unset.
	*
	* @returns {boolean}
	*/
	static isSalvageHubCommandEnabled() {
		const switchId = J.JAFTING.Metadata.salvageMenuSwitchId;
		if (switchId === 0) {
			return true;
		}
		return $gameSwitches.value(switchId);
	}
	/**
	* Opens the salvage workflow.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Constructor.
	*/
	constructor() {
		super();
	}
	/**
	* Spawns the window layer, background, and salvage UI.
	*/
	create() {
		Scene_MenuBase.prototype.create.call(this);
		this.setLastPreviewDatum(null);
		this.setLastPreviewStack(null);
		this.createSalvageWindows();
	}
	/**
	* Softens the map backdrop similar to other JAFTING scenes.
	*/
	createBackground() {
		this.setBackgroundFilter(new PIXI.filters.AlphaFilter(.1));
		this.setBackgroundSprite(new Sprite());
		this.backgroundSprite().bitmap = SceneManager.backgroundBitmap();
		this.backgroundSprite().filters = [this.backgroundFilter()];
		this.addChild(this.backgroundSprite());
	}
	/**
	* Suppresses touch UI chrome for parity with Creation / Refinement scenes.
	*/
	createButtons() {}
	/**
	* Builds list, preview, and confirmation chrome.
	*/
	createSalvageWindows() {
		const candidateRect = this.salvageCandidateWindowRect();
		const previewRect = this.salvagePreviewWindowRect();
		const confirmRect = this.salvageConfirmationWindowRect();
		this.setCandidateWindow(new Window_SalvageCandidateList(candidateRect));
		this.candidateWindow().setHandler("ok", this.onSalvageCandidateOk.bind(this));
		this.candidateWindow().setHandler("cancel", this.popScene.bind(this));
		this.setPreviewWindow(new Window_SalvagePreview(previewRect));
		this.setConfirmationWindow(new Window_SalvageConfirmation(confirmRect));
		this.confirmationWindow().setHandler("confirm", this.onSalvageConfirmOk.bind(this));
		this.confirmationWindow().setHandler("cancel", this.onSalvageConfirmCancel.bind(this));
		this.confirmationWindow().hide();
		this.confirmationWindow().deactivate();
		this.addWindow(this.candidateWindow());
		this.addWindow(this.previewWindow());
		this.addWindow(this.confirmationWindow());
		this.previewWindow().setDismantleAmount(Scene_JaftingSalvage.DismantleBatchSize);
	}
	/**
	* Shared width for the candidate column so create-time rects match {@link #layoutSalvagePanels}.
	*
	* @returns {number}
	*/
	salvageCandidateListWidth() {
		return Math.min(440, Math.max(280, Math.floor(Graphics.boxWidth * .34)));
	}
	/**
	* Preview pane width: never eats the whole screen—refund text rarely needs more than half the box.
	*
	* @param {number} previewX left edge of the preview window in screen space
	* @returns {number}
	*/
	salvagePreviewBandWidth(previewX) {
		const margin = 18;
		const fullRight = Graphics.boxWidth - margin - previewX;
		const widthCap = Math.min(560, Math.floor(Graphics.boxWidth * .48));
		return Math.min(fullRight, Math.max(200, Math.min(widthCap, fullRight)));
	}
	/**
	* Vertical band shared by the salvage list and preview (full height above the confirm row).
	*
	* @returns {{ topY: number, bandH: number }}
	*/
	salvageClusterVerticalBand() {
		const topY = 40;
		const confirmRect = this.salvageConfirmationWindowRect();
		const bandBottom = confirmRect.y - 16;
		const bandH = Math.max(160, bandBottom - topY);
		return {
			topY,
			bandH
		};
	}
	/**
	* Places the candidate list and preview as one horizontal cluster, centered with side margins.<br>
	* Iterates a few times because {@link #salvagePreviewBandWidth} depends on the preview's screen-x
	* (free space to the right edge).
	*
	* @returns {{ listX: number, listW: number, previewX: number, previewW: number, topY: number, bandH: number }}
	*/
	salvageClusterStripLayout() {
		const margin = 18;
		const gapMid = 16;
		const { topY, bandH } = this.salvageClusterVerticalBand();
		const listW = this.salvageCandidateListWidth();
		let listX = margin;
		for (let iter = 0; iter < 8; iter++) {
			const previewX = listX + listW + gapMid;
			const previewW = this.salvagePreviewBandWidth(previewX);
			const totalW = listW + gapMid + previewW;
			const idealX = Math.floor((Graphics.boxWidth - totalW) / 2);
			const maxLeft = Graphics.boxWidth - margin - totalW;
			const nextX = Math.max(margin, Math.min(idealX, maxLeft));
			if (nextX === listX) {
				return {
					listX,
					listW,
					previewX,
					previewW,
					topY,
					bandH
				};
			}
			listX = nextX;
		}
		const previewX = listX + listW + gapMid;
		const previewW = this.salvagePreviewBandWidth(previewX);
		return {
			listX,
			listW,
			previewX,
			previewW,
			topY,
			bandH
		};
	}
	/**
	* Candidate list on the left, salvage preview on the right—both use the full vertical band above confirm (no scroll).
	*/
	layoutSalvagePanels() {
		const strip = this.salvageClusterStripLayout();
		const { listX, listW, previewX, previewW, topY, bandH } = strip;
		this.candidateWindow().move(listX, topY, listW, bandH);
		const preview = this.previewWindow();
		const item = this.candidateWindow().item();
		const n = JaftingSalvageManager.visibleExpandedRefundRowCount(item);
		const linesSingle = JaftingSalvageManager.layoutPreviewLineCountSingle(item);
		const linesTwo = JaftingSalvageManager.layoutPreviewLineCountTwoColumn(item);
		const desiredSingle = preview.fittingHeight(linesSingle);
		const desiredTwo = preview.fittingHeight(linesTwo);
		let useTwoCol = false;
		if (desiredSingle > bandH && n > 1 && desiredTwo <= bandH) {
			useTwoCol = true;
		} else if (desiredSingle > bandH && n > 1) {
			useTwoCol = true;
		}
		preview.setRefundTwoColumnMode(useTwoCol);
		preview.move(previewX, topY, previewW, bandH);
	}
	/**
	* @returns {Rectangle}
	*/
	salvageCandidateWindowRect() {
		const s = this.salvageClusterStripLayout();
		return new Rectangle(s.listX, s.topY, s.listW, s.bandH);
	}
	/**
	* @returns {Rectangle}
	*/
	salvagePreviewWindowRect() {
		const s = this.salvageClusterStripLayout();
		return new Rectangle(s.previewX, s.topY, s.previewW, s.bandH);
	}
	/**
	* @returns {Rectangle}
	*/
	salvageConfirmationWindowRect() {
		const width = 420;
		const height = this.calcWindowHeight(2, true);
		const x = (Graphics.boxWidth - width) / 2;
		const y = Graphics.boxHeight - height - 24;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Starts interaction on the candidate list.
	*/
	start() {
		Scene_MenuBase.prototype.start.call(this);
		this.candidateWindow().open();
		this.previewWindow().open();
		this.confirmationWindow().open();
		this.candidateWindow().refresh();
		this.candidateWindow().activate();
		this.refreshPreviewFromSelection();
	}
	/**
	* Keeps the preview pane synced with the active cursor row.
	*/
	update() {
		Scene_MenuBase.prototype.update.call(this);
		if (this.candidateWindow() && this.candidateWindow().active) {
			const item = this.candidateWindow().item();
			const stack = item ? $gameParty.numItems(item) : 0;
			if (item !== this.lastPreviewDatum() || stack !== this.lastPreviewStack()) {
				this.setLastPreviewDatum(item);
				this.setLastPreviewStack(stack);
				this.layoutSalvagePanels();
				this.previewWindow().setDatum(item);
			}
		}
	}
	/**
	* Requests confirmation before dismantling the highlighted entry.
	*/
	onSalvageCandidateOk() {
		const datum = this.candidateWindow().item();
		if (datum === undefined || datum === null) {
			SoundManager.playBuzzer();
			return;
		}
		this.confirmationWindow().show();
		this.confirmationWindow().select(0);
		this.confirmationWindow().activate();
		this.candidateWindow().deactivate();
	}
	/**
	* Confirms salvage execution for a single unit.
	*/
	onSalvageConfirmOk() {
		const datum = this.candidateWindow().item();
		if (datum === undefined || datum === null) {
			SoundManager.playBuzzer();
			this.onSalvageConfirmCancel();
			return;
		}
		const ok = JaftingSalvageManager.executeSalvage(datum, Scene_JaftingSalvage.DismantleBatchSize);
		if (ok === false) {
			SoundManager.playBuzzer();
		} else {
			SoundManager.playUseItem();
		}
		this.candidateWindow().refresh();
		this.refreshPreviewFromSelection();
		this.onSalvageConfirmCancel();
	}
	/**
	* Closes the confirmation layer and returns focus to the list.
	*/
	onSalvageConfirmCancel() {
		this.confirmationWindow().hide();
		this.confirmationWindow().deactivate();
		this.candidateWindow().activate();
	}
	/**
	* Forces preview regeneration after list mutations.
	*/
	refreshPreviewFromSelection() {
		const item = this.candidateWindow().item();
		const stack = item ? $gameParty.numItems(item) : 0;
		this.setLastPreviewDatum(item);
		this.setLastPreviewStack(stack);
		this.layoutSalvagePanels();
		this.previewWindow().setDatum(item);
	}
};

//#endregion
//#region src/plugins/jafting/core/windows/Window_JaftingList.js
/**
* Root JAFTING hub list: commands registered by Creation, Refinement, and other extensions.
*/
var Window_JaftingList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Builds the hub command list from {@link #buildCommands}.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Returns hub commands: core registers Salvage first; Creation / Refinement extensions append after this list.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		return [this.buildSalvageHubCommand()];
	}
	/**
	* Salvage hub row—opens {@link Scene_JaftingSalvage} (same entry point as plugin command {@code call-salvage}).
	* @returns {BuiltWindowCommand}
	*/
	buildSalvageHubCommand() {
		return new WindowCommandBuilder(J.JAFTING.Metadata.salvageCommandName).setSymbol(Scene_JaftingSalvage.KEY).setEnabled(Scene_JaftingSalvage.isSalvageHubCommandEnabled()).addTextLine("Break down stamped equipment toward its ingredient history.").addTextLine("Vendor-only shells never list here—only gear carrying dismantle lineage.").setIconIndex(J.JAFTING.Metadata.salvageMenuIconIndex).build();
	}
	/**
	* Overwrites {@link #itemHeight}.<br/>
	* Makes the command rows bigger so there can be additional lines.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
};

//#endregion
//#region src/plugins/jafting/core/scenes/Scene_Jafting.js
var Scene_Jafting = class extends Scene_MenuBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initialize all properties for the root JAFTING hub scene.
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
	* The primary properties of the scene: the command list and header windows
	* for the root JAFTING menu.
	*/
	initPrimaryMembers() {
		/**
		* The window that lists Salvage, Creation, Refinement, and other registered JAFTING modes.
		* @type {Window_JaftingList}
		*/
		this._j._crafting._commandList = null;
		/**
		* The window that displays at the top while the JAFTING list is active.
		* @type {Window_JaftingListHeader}
		*/
		this._j._crafting._listHeader = null;
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
	}
	/**
	* Creates all windows associated with this scene.
	*/
	createAllWindows() {
		this.createJaftingRootWindows();
	}
	/**
	* Creates the root-level JAFTING hub windows.
	*/
	createJaftingRootWindows() {
		this.createJaftingListWindow();
		this.createJaftingListHeaderWindow();
	}
	/**
	* Creates a header window for the JAFTING command list.
	*/
	createJaftingListHeaderWindow() {
		const window = this.buildJaftingListHeaderWindow();
		this.setJaftingListHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the JAFTING list header window.
	* @returns {Window_JaftingListHeader}
	*/
	buildJaftingListHeaderWindow() {
		const rectangle = this.jaftingListHeaderRectangle();
		const window = new Window_JaftingListHeader(rectangle);
		window.refresh();
		return window;
	}
	/**
	* Gets the rectangle associated with the JAFTING list header window.
	* @returns {Rectangle}
	*/
	jaftingListHeaderRectangle() {
		const width = 1e3;
		const x = Graphics.boxWidth / 2 - width * .5;
		const height = 100;
		const y = 100;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked JAFTING list header window.
	* @returns {Window_JaftingListHeader}
	*/
	getJaftingListHeaderWindow() {
		return this._j._crafting._listHeader;
	}
	/**
	* Set the currently tracked JAFTING list header window to the given window.
	* @param {Window_JaftingListHeader} listHeaderWindow The header window to track.
	*/
	setJaftingListHeaderWindow(listHeaderWindow) {
		this._j._crafting._listHeader = listHeaderWindow;
	}
	/**
	* Opens the root header window.
	*/
	openRootHeaderWindow() {
		const rootHeaderWindow = this.getJaftingListHeaderWindow();
		rootHeaderWindow.open();
		rootHeaderWindow.show();
	}
	/**
	* Closes the root header window.
	*/
	closeRootHeaderWindow() {
		const rootHeaderWindow = this.getJaftingListHeaderWindow();
		rootHeaderWindow.close();
		rootHeaderWindow.hide();
	}
	/**
	* Creates the list of JAFTING modes available to the player.
	*/
	createJaftingListWindow() {
		const window = this.buildJaftingListWindow();
		this.setJaftingListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the JAFTING command list window.
	* @returns {Window_JaftingList}
	*/
	buildJaftingListWindow() {
		const rectangle = this.jaftingListRectangle();
		const window = new Window_JaftingList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onRootJaftingSelection.bind(this));
		return window;
	}
	/**
	* Gets the rectangle associated with the JAFTING command list window.
	* @returns {Rectangle}
	*/
	jaftingListRectangle() {
		const width = 800;
		const x = Graphics.boxWidth / 2 - width * .5;
		const height = 240;
		const y = Graphics.boxHeight / 2 - height * .5;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked JAFTING command list window.
	* @returns {Window_JaftingList}
	*/
	getJaftingListWindow() {
		return this._j._crafting._commandList;
	}
	/**
	* Set the currently tracked JAFTING command list window to the given window.
	* @param {Window_JaftingList} listWindow The list window to track.
	*/
	setJaftingListWindow(listWindow) {
		this._j._crafting._commandList = listWindow;
	}
	/**
	* Opens the root list window and activates it.
	*/
	openRootListWindow() {
		const rootListWindow = this.getJaftingListWindow();
		rootListWindow.open();
		rootListWindow.show();
		rootListWindow.activate();
	}
	/**
	* Closes the root list window.
	*/
	closeRootListWindow() {
		const rootListWindow = this.getJaftingListWindow();
		rootListWindow.close();
		rootListWindow.deactivate();
	}
	/**
	* Gets the current symbol of the root JAFTING list (the highlighted command key).
	* @returns {string}
	*/
	getRootJaftingKey() {
		return this.getJaftingListWindow().currentSymbol();
	}
	/**
	* Opens all windows associated with the root JAFTING hub.
	*/
	openRootJaftingWindows() {
		this.openRootListWindow();
		this.openRootHeaderWindow();
	}
	/**
	* Closes all windows associated with the root JAFTING hub.
	*/
	closeRootJaftingWindows() {
		this.closeRootListWindow();
		this.closeRootHeaderWindow();
	}
	/**
	* When a jafting choice is made, execute this logic.
	* This is only implemented/extended by the jafting types.
	*/
	onRootJaftingSelection() {}
};

//#endregion
//#region src/plugins/jafting/core/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map.prototype.start}.<br/>
* Trims per-copy salvage ledgers back to the copies the player still holds.
*
* **Why this is deferred rather than done when a copy leaves the bag.** A stamped copy can leave the container for
* reasons that are nothing like each other: sold, handed to a story event, dismantled - or simply equipped, which
* removes it from inventory without the player parting with it at all. At the instant of the removal those are
* indistinguishable, and guessing wrong throws away the provenance of a sword somebody is still wearing, so
* dismantling it later refunds nothing.
*
* `Scene_Map.start` is where the guessing stops. It runs on map transfer and on the return from any menu, shop, or
* battle, so every path that could have released a copy has finished by the time this asks how many are held. Being
* late costs only a slightly larger save in the meantime.
*
* This lives in JAFTING core rather than an extension because the bags are core's: Creation stamps them whether or
* not Refinement is installed. Refinement adds its own pass for the dynamic rows only it creates.
*/
J.JAFTING.Aliased.Scene_Map.set("start", Scene_Map.prototype.start);
Scene_Map.prototype.start = function() {
	J.JAFTING.Aliased.Scene_Map.get("start").call(this);
	JaftingSalvageManager.resizeTemplateLedgerBags();
};

//#endregion
//#region src/plugins/jafting/core/scenes/Scene_JaftingSalvageHubRouting.js
/**
* Routes the Salvage hub row before Creation / Refinement extensions chain their own keys.<br>
* The alias map is created in core `_metadata/initialization.js` so this `.set` runs after that file loads.
*/
J.JAFTING.Aliased.Scene_Jafting.set("onRootJaftingSelection", Scene_Jafting.prototype.onRootJaftingSelection);
Scene_Jafting.prototype.onRootJaftingSelection = function() {
	const currentSelection = this.getRootJaftingKey();
	if (currentSelection === Scene_JaftingSalvage.KEY) {
		this.jaftingSalvageSelected();
	} else {
		J.JAFTING.Aliased.Scene_Jafting.get("onRootJaftingSelection").call(this);
	}
};
/**
* Leaves the hub chrome on the stack and pushes dismantle UI—mirrors {@link Scene_JaftingCreate.callScene} flow.
*/
Scene_Jafting.prototype.jaftingSalvageSelected = function() {
	this.closeRootJaftingWindows();
	Scene_JaftingSalvage.callScene();
};

//#endregion
//#region src/plugins/jafting/core/_metadata/pluginCommands.js
/**
* A plugin command.<br>
* Calls the core JAFTING menu.
*/
PluginManager.registerCommand(J.JAFTING.Metadata.name, "call-menu", () => {
	Scene_Jafting.callScene();
});
/**
* A plugin command.<br>
* Opens the JAFTING salvage scene directly (bypasses hub switch gating on
* {@link Scene_JaftingSalvage.isSalvageHubCommandEnabled}).
*/
PluginManager.registerCommand(J.JAFTING.Metadata.name, "call-salvage", () => {
	Scene_JaftingSalvage.callScene();
});

//#endregion
//#region src/plugins/jafting/core/registerJaftingSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-JAFTING a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_jafting", "jafting");
}

//#endregion
//# sourceMappingURL=J-JAFTING.js.map