//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 JAFT-Refine] An extension for JAFTING to enable equip refinement.
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
	* @returns {*} The code.
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
	* @returns {*} The notes.
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
		if (material.jaftingRefinedCount > 0) {
			output.jaftingRefinedCount += material.jaftingRefinedCount - 1;
		}
		return output;
	}
	/**
	* Takes the refinement result equip and creates it in the appropriate datastore, and adds it to
	* the player's inventory.
	* @param {RPG_EquipItem} outputEquip The equip to generate and add to the player's inventory.
	*/
	static createRefinedOutput(outputEquip) {
		if (outputEquip.wtypeId) {
			this.generateRefinedEquip($dataWeapons, outputEquip, this.RefinementTypes.Weapon);
		} else if (outputEquip.atypeId) {
			this.generateRefinedEquip($dataArmors, outputEquip, this.RefinementTypes.Armor);
		}
	}
	/**
	* Generates the new entry in the corresponding datastore for the new equip data that was refined.
	* @param {RPG_Weapon[]|RPG_Armor[]} datastore The datastore to extend with new data.
	* @param {RPG_EquipItem} equip The equip to generate and add to the player's inventory.
	* @param {string} refinementType The type of equip this is; for incrementing the counter on custom data.
	* @returns {RPG_EquipItem}
	*/
	static generateRefinedEquip(datastore, equip, refinementType) {
		equip.jaftingRefinedCount++;
		const suffix = `+${equip.jaftingRefinedCount}`;
		if (equip.jaftingRefinedCount === 1) {
			equip.name = `${equip.name} ${suffix}`;
		} else {
			const index = equip.name.indexOf("+");
			if (index > -1) {
				equip.name = `${equip.name.slice(0, index)}${suffix}`;
			} else {
				equip.name = `${equip.name} ${suffix}`;
			}
		}
		const newIndex = $gameParty.getRefinementCounter(refinementType);
		equip._updateIndex(newIndex);
		datastore[newIndex] = equip;
		$gameParty.gainItem(datastore[newIndex], 1);
		$gameParty.incrementRefinementCounter(refinementType);
		if (equip.wtypeId) {
			$gameParty.addRefinedWeapon(equip);
		} else if (equip.atypeId) {
			$gameParty.addRefinedArmor(equip);
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
	/**
	* Performs the refinement transaction: remove inputs, stamp the hydrated output row, then register it through
	* {@link JaftingManager.createRefinedOutput} (dynamic id allocation + party gain).
	*
	* @param {Game_Item} baseItem The base item driving this step.
	* @param {Game_Item} materialItem The material item driving this step.
	* @param {RPG_EquipItem} outputEquip The output equip driving this step.
	* @returns {{ ok: boolean, reason: string|null }}
	*/
	commitRefinement(baseItem, materialItem, outputEquip) {
		const baseDatum = baseItem.object();
		const materialDatum = materialItem.object();
		const mergedLedger = JaftingSalvageManager.buildRefinementOutputLedger(baseDatum, materialDatum);
		$gameParty.gainItem(baseItem, -1);
		$gameParty.gainItem(materialItem, -1);
		outputEquip._jaftingSalvageLedger = mergedLedger;
		JaftingManager.createRefinedOutput(outputEquip);
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
J.JAFTING.EXT.REFINE.Metadata = new J_CraftingRefinePluginMetadata("J-JAFTING-Refinement", "1.2.0");
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
J.JAFTING.EXT.REFINE.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.JAFTING.EXT.REFINE.Aliased.Game_Party.get("initialize").call(this);
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
	* A collection of all weapons that have been refined.
	* @type {RPG_EquipItem[]}
	*/
	this._j._refinement._weapons = [];
	/**
	* A collection of all armors that have been refined.
	* @type {RPG_EquipItem[]}
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
* Gets all tracked weapons that have been refined.
* @returns {RPG_EquipItem[]}
*/
Game_Party.prototype.getRefinedWeapons = function() {
	return this._j._refinement._weapons;
};
/**
* Gets all tracked armors that have been refined.
* @returns {RPG_EquipItem[]}
*/
Game_Party.prototype.getRefinedArmors = function() {
	return this._j._refinement._armors;
};
/**
* Adds a newly refined weapon to the collection for tracking purposes.
* @param {RPG_EquipItem} equip The newly refined weapon.
*/
Game_Party.prototype.addRefinedWeapon = function(equip) {
	this.getRefinedWeapons().push(equip);
};
/**
* Adds a newly refined armor to the collection for tracking purposes.
* @param {RPG_EquipItem} equip The newly refined armor.
*/
Game_Party.prototype.addRefinedArmor = function(equip) {
	this.getRefinedArmors().push(equip);
};
/**
* Updates the $dataWeapons collection to include the player's collection of
* refined weapons.
*/
Game_Party.prototype.refreshDatabaseWeapons = function() {
	this.getRefinedWeapons().forEach((weapon) => {
		const updatedWeapon = new RPG_Weapon(weapon, weapon.index);
		$dataWeapons[updatedWeapon._key()] = updatedWeapon;
	});
};
/**
* Updates the $dataArmors collection to include the player's collection of
* refined armors.
*/
Game_Party.prototype.refreshDatabaseArmors = function() {
	this.getRefinedArmors().forEach((armor) => {
		const updatedArmor = new RPG_Armor(armor, armor.index);
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
* Refinement equip list helpers + {@link Window_RefinableList}.<br>
* <br>
* **Two different questions:** {@link refinableEquipTemplateSortHasSalvageLineage} drives **list ordering** (anything
* with dismantle history or a refine counter sorts like a “stamped” row). {@link refinableEquipHasSalvageStamp} drives
* **per-row paint** when the stack UI passes a `unitOrdinal` so only the expanded slot shows the hollow diamond from
* {@link J.JAFTING.EXT.REFINE.Messages.RefinableListSalvageStampPrefix}.<br>
* Keep those roles split—sorting on `unitOrdinal` would scramble templates every frame.
*/
/**
* True when this row should sort with stamped-lineage priority (salvage bag, dynamic ledger, or any refine +N).
*
* @param {RPG_EquipItem} equip The equip driving this step.
* @returns {boolean}
*/
function refinableEquipTemplateSortHasSalvageLineage(equip) {
	if (equip.jaftingRefinedCount > 0) {
		return true;
	}
	const ledger = JaftingSalvageManager.getLedgerForDatum(equip);
	if (ledger === null || ledger === undefined) {
		return false;
	}
	if (!ledger.rows || ledger.rows.length === 0) {
		return false;
	}
	return true;
}
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
		this.initialize(rect);
		this.initMembers();
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
		equips.sort((a, b) => {
			const stampA = refinableEquipTemplateSortHasSalvageLineage(a) ? 1 : 0;
			const stampB = refinableEquipTemplateSortHasSalvageLineage(b) ? 1 : 0;
			if (stampA !== stampB) {
				return stampB - stampA;
			}
			if (a.etypeId > b.etypeId) return 1;
			if (a.etypeId < b.etypeId) return -1;
			if (a.id > b.id) return 1;
			if (a.id < b.id) return -1;
			return 0;
		});
		equips.forEach((equip) => {
			if (equip.jaftingUnrefinable) {
				return;
			}
			const isStackCountedRow = JaftingSalvageLedger.isStackCountedRefinableEquip(equip);
			const count = $gameParty.numItems(equip);
			if (count < 1) {
				return;
			}
			if (isStackCountedRow) {
				this.addRefinableEquipCommand(equip, null);
				return;
			}
			for (let u = 0; u < count; u++) {
				this.addRefinableEquipCommand(equip, {
					unitOrdinal: u,
					unitsTotal: count
				});
			}
		});
	}
	/**
	* Builds and appends refinable rows (enable rules, icons, salvage stamp label, optional stack counts).
	*
	* @param {RPG_EquipItem} equip The equip driving this step.
	* @param {{ unitOrdinal: number, unitsTotal: number }|null} unitSlot Pass null for stack-counted material rows.
	*/
	addRefinableEquipCommand(equip, unitSlot) {
		if (equip.jaftingUnrefinable) {
			return;
		}
		const equipCount = $gameParty.numItems(equip);
		const isStackCountedRow = JaftingSalvageLedger.isStackCountedRefinableEquip(equip);
		const hasUnit = unitSlot !== null && unitSlot !== undefined;
		if (isStackCountedRow && hasUnit) {
			return;
		}
		if (!isStackCountedRow && !hasUnit) {
			return;
		}
		let rightText = String.empty;
		if (isStackCountedRow) {
			rightText = `x${equipCount}`;
		}
		const hasSalvageStamp = refinableEquipHasSalvageStamp(equip, hasUnit ? unitSlot.unitOrdinal : undefined);
		const hasRefinementAccent = equip.jaftingRefinedCount > 0;
		const stamped = hasSalvageStamp || hasRefinementAccent;
		const rowName = stamped ? `${J.JAFTING.EXT.REFINE.Messages.RefinableListSalvageStampPrefix}${equip.name}` : equip.name;
		const nameColorIndex = stamped ? 6 : 0;
		const sameTemplate = equip === this.baseSelection;
		const rowOrdinal = hasUnit ? unitSlot.unitOrdinal : null;
		const baseOrdinal = this.baseSelectionUnitOrdinal;
		let samePhysicalUnit = false;
		if (sameTemplate) {
			if (rowOrdinal !== null && rowOrdinal !== undefined && baseOrdinal !== null && baseOrdinal !== undefined) {
				samePhysicalUnit = rowOrdinal === baseOrdinal;
			}
		}
		const templateStack = this.baseSelection ? $gameParty.numItems(this.baseSelection) : 0;
		const canSelectThisMaterial = sameTemplate === false || templateStack > 1 && samePhysicalUnit === false;
		let enabled = this.isPrimary ? true : canSelectThisMaterial;
		let { iconIndex } = equip;
		let errorText = "";
		if (equip.jaftingUnrefinable) {
			enabled = false;
			iconIndex = 90;
		}
		if (!this.isPrimary) {
			if (!JaftingManager.parseTraits(equip).length) {
				enabled = false;
				errorText += `${J.JAFTING.EXT.REFINE.Messages.NoTraitsOnMaterial}\n`;
			}
			if (equip.jaftingNotRefinementMaterial) {
				enabled = false;
				iconIndex = 90;
			}
			if (this.baseSelection) {
				const primaryHasMaxRefineCount = this.baseSelection.jaftingMaxRefineCount > 0;
				if (primaryHasMaxRefineCount) {
					const primaryMaxRefineCount = this.baseSelection.jaftingMaxRefineCount;
					const projectedCount = this.baseSelection.jaftingRefinedCount + equip.jaftingRefinedCount;
					const overRefinementCount = primaryMaxRefineCount < projectedCount;
					if (overRefinementCount) {
						enabled = false;
						iconIndex = 90;
						errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedRefineCount} ${projectedCount}/${primaryMaxRefineCount}.<br>\n`;
					}
				}
				const baseMaxTraitCount = this.baseSelection.jaftingMaxTraitCount;
				const projectedResult = JaftingManager.determineRefinementOutput(this.baseSelection, equip);
				const projectedResultTraitCount = JaftingManager.parseTraits(projectedResult).length;
				const overMaxTraitCount = baseMaxTraitCount > 0 && projectedResultTraitCount > baseMaxTraitCount;
				if (overMaxTraitCount) {
					enabled = false;
					iconIndex = 92;
					errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedTraitCount} ${projectedResultTraitCount}/${baseMaxTraitCount}.<br>\n`;
				}
			}
		} else {
			const equipIsMaxRefined = equip.jaftingMaxRefineCount === 0 ? false : equip.jaftingMaxRefineCount <= equip.jaftingRefinedCount;
			const equipHasMaxTraits = equip.jaftingMaxTraitCount === 0 ? false : equip.jaftingMaxTraitCount <= JaftingManager.parseTraits(equip).length;
			if (equipIsMaxRefined) {
				enabled = false;
				iconIndex = 92;
				errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxRefineCount}\n`;
			}
			if (equipHasMaxTraits) {
				enabled = false;
				iconIndex = 92;
				errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxTraitCount}\n`;
			}
			if (equip.jaftingNotRefinementBase) {
				enabled = false;
				iconIndex = 92;
			}
		}
		const isChosenBaseRow = sameTemplate && rowOrdinal !== null && rowOrdinal !== undefined && baseOrdinal !== null && baseOrdinal !== undefined && rowOrdinal === baseOrdinal;
		if (isChosenBaseRow) {
			iconIndex = 91;
		}
		const extData = {
			data: equip,
			error: errorText
		};
		if (hasUnit) {
			extData.unitOrdinal = unitSlot.unitOrdinal;
			extData.unitsTotal = unitSlot.unitsTotal;
		}
		const command = new WindowCommandBuilder(rowName).setSymbol("refine-object").setEnabled(enabled).setExtensionData(extData).setIconIndex(iconIndex).setColorIndex(nameColorIndex).setRightText(rightText).setHelpText(equip.description).build();
		this.addBuiltCommand(command);
	}
};

//#endregion
//#region src/plugins/jafting/ext/refine/windows/Window_RefinementDetails.js
/**
* The window containing the chosen equips for refinement and also the projected results.
*/
var Window_RefinementDetails = class extends Window_Base {
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
	* Width of each preview column (base / material / output) from {@link #innerWidth}.
	* @returns {number}
	*/
	refinementColumnWidth() {
		return Math.max(96, Math.floor(this.innerWidth / 3));
	}
	/**
	* Max draw width for names and traits inside one column.
	* @returns {number}
	*/
	refinementColumnTextWidth() {
		return Math.max(64, this.refinementColumnWidth() - 12);
	}
	refresh() {
		this.contents.clear();
		this.drawContent();
	}
	/**
	* Draws all content in this window.
	*/
	drawContent() {
		if (!this.primaryEquip) return;
		this.drawRefinementHeaders();
		this.drawRefinementTarget();
		this.drawRefinementMaterial();
		this.drawRefinementResult();
	}
	/**
	* Draws all columns' titles.
	*/
	drawRefinementHeaders() {
		const columnWidth = this.refinementColumnWidth();
		const labelWidth = this.refinementColumnTextWidth();
		const ox = 0;
		this.modFontSize(6);
		this.toggleBold(true);
		const baseX = ox + columnWidth * 0;
		this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleBase, baseX, 0, labelWidth);
		const consumableX = ox + columnWidth * 1;
		this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleMaterial, consumableX, 0, labelWidth);
		const outputX = ox + columnWidth * 2;
		this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleOutput, outputX, 0, labelWidth);
		this.resetFontSettings();
	}
	/**
	* Draws the primary equip that is being used as a base for refinement.
	* Will draw whatever is being hovered over if nothing is selected.
	*/
	drawRefinementTarget() {
		this.drawEquip(this.primaryEquip, 0, "base");
	}
	/**
	* Draws the secondary equip that is being used as a material for refinement.
	* Will draw whatever is being hovered over if nothing is selected.
	*/
	drawRefinementMaterial() {
		if (!this.secondaryEquip) return;
		this.drawEquip(this.secondaryEquip, this.refinementColumnWidth(), "material");
	}
	/**
	* Draws one column of a piece of equip and it's traits.
	* @param {RPG_EquipItem} equip The equip to draw details for.
	* @param {number} x The `x` coordinate to start drawing at.
	* @param {string} type Which column this is.
	*/
	drawEquip(equip, x, type) {
		const parsedTraits = JaftingManager.parseTraits(equip);
		const jaftingTraits = JaftingManager.combineBaseParameterTraits(parsedTraits);
		this.drawEquipTitle(equip, x, type);
		this.drawEquipTraits(jaftingTraits, x);
	}
	/**
	* Draws the title for this portion of the equip details.
	* @param {RPG_EquipItem} equip The equip to draw details for.
	* @param {number} x The `x` coordinate to start drawing at.
	* @param {string} type Which column this is.
	*/
	drawEquipTitle(equip, x, type) {
		const lh = this.lineHeight();
		const textW = this.refinementColumnTextWidth();
		if (type === "output") {
			if (equip.jaftingRefinedCount === 0) {
				this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name} +1\\C[0]`, x, lh * 1, textW);
			} else {
				const suffix = `+${equip.jaftingRefinedCount + 1}`;
				const index = equip.name.lastIndexOf("+");
				if (index > -1) {
					const name = `${equip.name.slice(0, index)}${suffix}`;
					this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, textW);
				} else {
					const name = `${equip.name} ${suffix}`;
					this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, textW);
				}
			}
		} else {
			this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name}\\C[0]`, x, lh * 1, textW);
		}
	}
	/**
	* Draws all transferable traits on this piece of equipment.
	* @param {JAFTING_Trait[]} traits A list of transferable traits.
	* @param {number} x The `x` coordinate to start drawing at.
	*/
	drawEquipTraits(traits, x) {
		const lh = this.lineHeight();
		const textW = this.refinementColumnTextWidth();
		if (!traits.length) {
			this.drawTextEx(`${J.JAFTING.EXT.REFINE.Messages.NoTransferableTraits}`, x, lh * 2, textW);
			return;
		}
		traits.sort((a, b) => a._code - b._code);
		traits.forEach((trait, index) => {
			const y = lh * 2 + index * lh;
			this.drawTextEx(`${trait.nameAndValue}`, x, y, textW);
		});
	}
	/**
	* Draws the projected refinement result of fusing the material into the base.
	*/
	drawRefinementResult() {
		if (!this.primaryEquip || !this.secondaryEquip) return;
		const result = JaftingManager.determineRefinementOutput(this.primaryEquip, this.secondaryEquip);
		this.drawEquip(result, this.refinementColumnWidth() * 2, "output");
		this.outputEquip = result;
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
	* Initialize all properties for the Refinement scene.
	*/
	initMembers() {
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
		this.createBaseRefinableListWindow();
		this.createConsumableRefinableListWindow();
		this.createRefinementDetailsWindow();
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
	* @returns {number} Width shared by the left refinable lists (~10% wider than the original 350px column).
	*/
	getBaseRefinableListColumnWidth() {
		return Math.round(350 * 1.1);
	}
	/**
	* @returns {Rectangle}
	*/
	getRefinementStepHintRectangle() {
		const [ox, oy] = Graphics.boxOrigin;
		const x = ox + Graphics.horizontalPadding;
		const width = Graphics.boxWidth - Graphics.horizontalPadding * 2;
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
		const listRect = this.getBaseRefinableListRectangle();
		const [ox] = Graphics.boxOrigin;
		const x = listRect.x + listRect.width + Graphics.horizontalPadding;
		const { y } = listRect;
		const width = ox + Graphics.boxWidth - x - Graphics.horizontalPadding;
		const height = 100;
		return new Rectangle(x, y, width, height);
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
		const [ox, oy] = Graphics.boxOrigin;
		const hintHeight = this.getRefinementStepHintHeight();
		const width = this.getBaseRefinableListColumnWidth();
		const height = Graphics.boxHeight - Graphics.verticalPadding - hintHeight;
		return new Rectangle(ox, oy + hintHeight, width, height);
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
		listWindow.hide();
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
		return this.getBaseRefinableListRectangle();
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
		const [ox, oy] = Graphics.boxOrigin;
		const listRect = this.getBaseRefinableListRectangle();
		const descWindow = this.getRefinementDescriptionWindow();
		const x = listRect.x + listRect.width + Graphics.horizontalPadding;
		const y = listRect.y + descWindow.height + Graphics.verticalPadding;
		const width = ox + Graphics.boxWidth - x - Graphics.horizontalPadding;
		const height = oy + Graphics.boxHeight - y - Graphics.verticalPadding;
		return new Rectangle(x, y, width, height);
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
//# sourceMappingURL=J-JAFTING-Refinement.js.map