//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 LOADOUT] A scene for managing every party member's combat loadout.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @orderAfter J-CMS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds a single scene showing every party member's assignable
 * combat slots at once, and lets the player change any of them.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; the skill slots being managed belong to JABS.
 * - J-ABS-InputManager; when present, slots are labelled with the inputs
 *   currently bound to them rather than with fixed button names.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This replaces the five separate assignment flows that previously lived on
 * the JABS quick menu- offhand, combat skills, dodge, tools, and usable items.
 * Each of those opened a pair of on-map windows, and every one of them operated
 * on the party leader alone, meaning an ally's loadout could not be adjusted
 * without first making that ally the leader.
 *
 * Here, every member is shown side by side. Moving between them is ordinary
 * horizontal cursor movement, because they are literally adjacent columns.
 *
 * The mainhand slot is deliberately absent. It is supplied by whichever weapon
 * the actor has equipped rather than chosen by the player, so presenting it
 * would imply an assignment that cannot be made.
 *
 * ----------------------------------------------------------------------------
 * ABOUT COMBAT SKILL INPUTS:
 * Combat skills are not bound to inputs directly. Each is the skill trigger
 * modifier held alongside one of the primary buttons, so the input shown for
 * those slots is assembled from the current binding of both halves. Remapping
 * either half is reflected here immediately.
 *
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- the slots it manages are defined by
 * JABS, and their contents are chosen by the player rather than tagged.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, this command is visible in the menu. Use 0 to always show it.
 * @default 0
 *
 * @param command-name
 * @parent parentConfig
 * @type string
 * @text Command Name
 * @desc The name the loadout command carries in the menu.
 * @default Loadout
 *
 * @param command-icon
 * @parent parentConfig
 * @type number
 * @text Command Icon
 * @desc The icon index the loadout command carries in the menu.
 * @default 77
 */
//endregion annotations


//#region src/plugins/abs/ext/loadout/_metadata/_pluginMetadata.js
var J_JabsLoadout_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
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
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* An id of zero means the command is always available.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* The name this system's command carries in the menu.
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["command-name"] ?? "Loadout";
		/**
		* The icon this system's command carries in the menu.
		* @type {number}
		*/
		this.commandIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["command-icon"], 77);
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The parent umbrella for all JABS extensions, which this plugin lives beneath.
*/
J.ABS.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.LOADOUT = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.LOADOUT.Metadata = new J_JabsLoadout_PluginMetadata("J-ABS-Loadout", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.LOADOUT.Aliased = {};
J.ABS.EXT.LOADOUT.Aliased.Scene_Menu = new Map();
J.ABS.EXT.LOADOUT.Aliased.Window_MenuCommand = new Map();

//#endregion
//#region src/plugins/abs/ext/loadout/_models/LoadoutSlotCatalog.js
/**
* The assignable slots the loadout scene presents, and how to describe them.
*
* Three windows need to agree on this- each actor's slot column and the spine of labels between
* them- and they must agree exactly, because a row means "this slot" only if every column counts
* rows the same way. Keeping the ordering here rather than in any one of them means a slot cannot be
* added to one column and forgotten in another.
*/
var LoadoutSlotCatalog = class {
	/**
	* The slot keys this scene presents, in display order.
	*
	* Mainhand is deliberately absent. It is supplied by whichever weapon the actor has equipped
	* rather than chosen by the player, so offering it as a row would imply an assignment that cannot
	* be made.
	* @returns {string[]}
	*/
	static slotKeys() {
		return [
			JABS_Button.Offhand,
			JABS_Button.CombatSkill1,
			JABS_Button.CombatSkill2,
			JABS_Button.CombatSkill3,
			JABS_Button.CombatSkill4,
			JABS_Button.Dodge,
			JABS_Button.Tool,
			JABS_Button.UsableItem
		];
	}
	/**
	* How many slots this scene presents.
	* @returns {number}
	*/
	static slotCount() {
		return this.slotKeys().length;
	}
	/**
	* Gets the slot key occupying a given row.
	* @param {number} index The row being asked about.
	* @returns {string}
	*/
	static slotKeyAt(index) {
		return this.slotKeys()[index];
	}
	/**
	* Describes which input fires a given slot, resolved against the player's live bindings.
	*
	* Combat skills are not bound directly- each is the skill trigger modifier held alongside one of
	* the primary buttons- so their description is assembled from the current binding of both halves.
	* Doing it this way rather than writing the buttons into a string means remapping either half is
	* reflected immediately, and a retired button cannot leave a stale label behind.
	* @param {string} slotKey The key of the slot being described.
	* @returns {string}
	*/
	static describeInput(slotKey) {
		const composition = JABS_Button.combatSkillComposition(slotKey);
		if (composition.length > 0) {
			return composition.map((button) => this.describeButton(button)).join(" + ");
		}
		return this.describeButton(slotKey);
	}
	/**
	* Describes a single logical button as the input currently bound to it.
	* @param {string} button The logical button to describe.
	* @returns {string}
	*/
	static describeButton(button) {
		return InputLegendResolver.resolve(button, button);
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_LoadoutActorHeader.js
/**
* The column headers naming which party member each column of the loadout board belongs to.
*
* This exists instead of an actor ribbon because the board renders every member at once- a ribbon
* names the single actor a scene is currently about, and this scene is about all of them. The headers
* sit directly above the board and share its column geometry so each name lands over its own column.
*/
var Window_LoadoutActorHeader = class extends Window_Base {
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
		* The width of a single actor's column on the board beneath.
		* @type {number}
		*/
		this._actorColumnWidth = 0;
		/**
		* The width of the slot spine running between those columns.
		* @type {number}
		*/
		this._slotSpineWidth = 0;
	}
	/**
	* Gets the actor column width.
	* @returns {number} The actorColumnWidth.
	*/
	actorColumnWidth() {
		return this._actorColumnWidth;
	}
	/**
	* Sets the actor column width.
	* @param {number} newActorColumnWidth The new actorColumnWidth.
	*/
	setActorColumnWidth(newActorColumnWidth) {
		this._actorColumnWidth = newActorColumnWidth;
	}
	/**
	* Gets the slot spine width.
	* @returns {number} The slotSpineWidth.
	*/
	slotSpineWidth() {
		return this._slotSpineWidth;
	}
	/**
	* Sets the slot spine width.
	* @param {number} newSlotSpineWidth The new slotSpineWidth.
	*/
	setSlotSpineWidth(newSlotSpineWidth) {
		this._slotSpineWidth = newSlotSpineWidth;
	}
	/**
	* Adopts the board's column geometry so each name lands over its own column.
	*
	* The geometry is handed over rather than recalculated because two windows deriving the same layout
	* independently is precisely how they end up disagreeing- the board owns the arithmetic, this window
	* only follows it.
	* @param {number} actorColumnWidth The width of a single actor column.
	* @param {number} slotSpineWidth The width of the spine between them.
	*/
	setColumnGeometry(actorColumnWidth, slotSpineWidth) {
		this.setActorColumnWidth(actorColumnWidth);
		this.setSlotSpineWidth(slotSpineWidth);
		this.refresh();
	}
	/**
	* Gets the party members being named, in column order.
	* @returns {Game_Actor[]}
	*/
	members() {
		return $gameParty.members();
	}
	/**
	* Renders one name per column.
	*/
	refresh() {
		this.contents.clear();
		if (this.actorColumnWidth() === 0) return;
		this.members().forEach((actor, index) => this.drawColumnHeader(actor, index));
	}
	/**
	* Renders a single column's header.
	* @param {Game_Actor} actor The member owning this column.
	* @param {number} index The column index.
	*/
	drawColumnHeader(actor, index) {
		const spineOffset = index === 0 ? 0 : this.slotSpineWidth();
		const x = this.actorColumnWidth() * index + spineOffset;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(actor.name(), x, 0, this.actorColumnWidth(), "center");
		this.resetTextColor();
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_LoadoutSlots.js
/**
* One party member's column of assignable slots.
*
* The scene builds one of these per member and keeps their selections in lockstep, so a row means
* the same slot in every column. Only one is ever active; the others stay selected but inactive,
* which leaves their highlight drawn without animating it. The player therefore sees which slot they
* are on for everyone at once, while it stays unambiguous whose slot they are about to change.
*/
var Window_LoadoutSlots = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes all custom members of this window.
	*/
	initMembers() {
		/**
		* The actor whose slots this column represents.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
	}
	/**
	* Gets the actor whose slots this column represents.
	* @returns {Game_Actor|null} The actor.
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor whose slots this column represents.
	* @param {Game_Actor} newActor The new actor.
	*/
	setActor(newActor) {
		this._actor = newActor;
		this.refresh();
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Builds one command per assignable slot.
	*/
	makeCommandList() {
		if (!this.actor()) return;
		LoadoutSlotCatalog.slotKeys().forEach((slotKey) => this.addBuiltCommand(this.buildSlotCommand(slotKey)));
	}
	/**
	* Builds the command representing this actor's assignment to one slot.
	* @param {string} slotKey The key of the slot being represented.
	* @returns {BuiltWindowCommand}
	*/
	buildSlotCommand(slotKey) {
		const entry = this.slottedEntry(slotKey);
		const name = entry ? entry.name : this.emptySlotText();
		return new WindowCommandBuilder(name).setSymbol(slotKey).setIconIndex(entry ? entry.iconIndex : 0).setHelpText(this.describeSlot(slotKey, entry)).build();
	}
	/**
	* Gets whatever currently occupies one of this actor's slots.
	*
	* The slot resolves its own contents rather than the id being looked up here, because the tool and
	* usable-item slots store item ids while every other slot stores skill ids. Resolving them all
	* against the skill table would silently render whichever skill happened to share an item's id.
	* @param {string} slotKey The key of the slot to inspect.
	* @returns {?RPG_UsableItem|?RPG_Skill}
	*/
	slottedEntry(slotKey) {
		const slot = this.slotByKey(slotKey);
		if (!slot) return null;
		return slot.data(this.actor());
	}
	/**
	* Gets one of this actor's slots by its key.
	* @param {string} slotKey The key of the slot to fetch.
	* @returns {?JABS_SkillSlot}
	*/
	slotByKey(slotKey) {
		return this.actor().getSkillSlotManager().getSkillSlotByKey(slotKey);
	}
	/**
	* Describes what a slot currently holds and how it is triggered.
	*
	* Named for the actor as well as the input, because the scene shows two members at once- "the
	* offhand slot" is ambiguous here in a way it never was on the old single-actor menus.
	* @param {string} slotKey The key of the slot being described.
	* @param {?RPG_UsableItem|?RPG_Skill} entry Whatever currently occupies the slot, if anything.
	* @returns {string}
	*/
	describeSlot(slotKey, entry) {
		const input = this.colorizeText(this.slotColorIndex(), LoadoutSlotCatalog.describeInput(slotKey));
		const actor = this.actorTextCode();
		if (!entry) return `${actor} has nothing assigned to ${input}.`;
		return `${actor} uses ${this.entryTextCode(slotKey, entry)} on ${input}.`;
	}
	/**
	* The color index the triggering input renders with.
	*
	* Deliberately not the index {@link Window_Base.translateSkillTextCode} tints skill names with. The
	* sentence holds two nouns- a thing and a control- and painting both the same color collapses that
	* distinction into a wall of one hue. This one is warm where skills are cool, so the eye separates
	* "what happens" from "what you press" without having to read for it.
	* @returns {number}
	*/
	slotColorIndex() {
		return 6;
	}
	/**
	* The ex-text code naming the actor whose slots this window shows.
	*
	* Deferring to the engine's own actor code rather than interpolating the name means the sentence
	* follows the actor- a rename, or a different party member entirely, needs no change here.
	* @returns {string}
	*/
	actorTextCode() {
		return `\\N[${this.actor().actorId()}]`;
	}
	/**
	* The ex-text code naming whatever occupies a slot, complete with its icon.
	*
	* Which code applies depends on which database the slot's id belongs to, and the slot itself is asked
	* rather than the key being pattern-matched. That is the same authority {@link JABS_SkillSlot.data}
	* consults, so the sentence can never name a different thing than the slot actually holds- an item
	* rendered as a skill would silently display whichever skill happened to share its id.
	* @param {string} slotKey The key of the slot being described.
	* @param {RPG_UsableItem|RPG_Skill} entry Whatever currently occupies the slot.
	* @returns {string}
	*/
	entryTextCode(slotKey, entry) {
		const slot = this.slotByKey(slotKey);
		return slot.isItem() ? `\\item[${entry.id}]` : `\\skill[${entry.id}]`;
	}
	/**
	* The text rendered for a slot holding nothing.
	* @returns {string}
	*/
	emptySlotText() {
		return "- empty -";
	}
	/**
	* Gets the slot key currently highlighted.
	* @returns {string}
	*/
	currentSlotKey() {
		return LoadoutSlotCatalog.slotKeyAt(this.index());
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_LoadoutSpine.js
/**
* The column of slot labels running between the party members' slot columns.
*
* The slot itself is shared- both members have an offhand, both have a dodge- so naming it once
* between them says what a row means without claiming it belongs to either side. Repeating the label
* in both columns would say the same thing twice and take the space the assignments need.
*
* Rows here line up with the slot columns by construction, since all three read their ordering from
* the same catalog.
*/
var Window_LoadoutSpine = class extends Window_Base {
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
		* How tall a row is in the slot columns either side.
		* @type {number}
		*/
		this._rowHeight = 0;
	}
	/**
	* Gets how tall a row is.
	* @returns {number} The rowHeight.
	*/
	rowHeight() {
		return this._rowHeight;
	}
	/**
	* Adopts the row height of the slot columns either side, so labels sit beside the rows they name.
	*
	* Selectable windows add padding to their line height that a plain window does not, so deriving
	* this independently would drift by that difference on every row and compound down the list. The
	* columns own the arithmetic; this window follows it.
	* @param {number} newRowHeight The new rowHeight.
	*/
	setRowHeight(newRowHeight) {
		this._rowHeight = newRowHeight;
		this.refresh();
	}
	/**
	* Renders one label per slot.
	*/
	refresh() {
		this.contents.clear();
		if (this.rowHeight() === 0) return;
		this.changeTextColor(ColorManager.systemColor());
		LoadoutSlotCatalog.slotKeys().forEach((slotKey, index) => this.drawSlotLabel(slotKey, index));
		this.resetTextColor();
	}
	/**
	* Renders a single slot's label.
	* @param {string} slotKey The key of the slot being labelled.
	* @param {number} index The row the slot occupies.
	*/
	drawSlotLabel(slotKey, index) {
		const y = index * this.rowHeight();
		const label = LoadoutSlotCatalog.describeInput(slotKey);
		const { width } = this.textSizeEx(label);
		const x = Math.max(0, Math.floor((this.innerWidth - width) / 2));
		const offset = Math.max(0, Math.floor((this.rowHeight() - this.lineHeight()) / 2));
		this.drawTextEx(label, x, y + offset, this.innerWidth);
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_LoadoutPicker.js
/**
* The list of things eligible to be placed into a given slot.
*
* This opens as a modal over the board rather than sitting beside it permanently, which is the reason
* the board can afford to show every party member at once- a picker occupying its own column would
* take exactly the space the second actor uses.
*
* What is eligible depends entirely on the slot: combat slots draw from the actor's equipped combat
* skills, the dodge slot from their dodge skills, and the tool and usable-item slots from the party's
* shared inventory. Those pools are owned by JABS and its extensions rather than defined here, so
* that a skill becoming eligible elsewhere is reflected here without this window being touched.
*/
var Window_LoadoutPicker = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes all custom members of this window.
	*/
	initMembers() {
		/**
		* The actor whose slot is being filled.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The key of the slot being filled.
		* @type {string}
		*/
		this._slotKey = String.empty;
	}
	/**
	* Sets the actor.
	* @param {Game_Actor|null} newActor The new actor.
	*/
	setActor(newActor) {
		this._actor = newActor;
	}
	/**
	* Sets the slot key.
	* @param {string} newSlotKey The new slotKey.
	*/
	setSlotKey(newSlotKey) {
		this._slotKey = newSlotKey;
	}
	/**
	* Points this window at a particular actor's particular slot and rebuilds accordingly.
	* @param {Game_Actor} actor The actor whose slot is being filled.
	* @param {string} slotKey The key of the slot being filled.
	*/
	setTarget(actor, slotKey) {
		this.setActor(actor);
		this.setSlotKey(slotKey);
		this.refresh();
		this.select(0);
	}
	/**
	* Gets the actor whose slot is being filled.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Gets the key of the slot being filled.
	* @returns {string}
	*/
	slotKey() {
		return this._slotKey;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Lists everything eligible for the targeted slot.
	*/
	makeCommandList() {
		if (!this.actor()) return;
		this.addBuiltCommand(this.buildClearCommand());
		this.candidates().forEach((candidate) => this.addBuiltCommand(this.buildCandidateCommand(candidate)));
	}
	/**
	* Builds the command that empties the targeted slot.
	* @returns {BuiltWindowCommand}
	*/
	buildClearCommand() {
		return new WindowCommandBuilder(J.ABS.Metadata.ClearSlotText).setSymbol("clear").setColorIndex(this.clearCommandColorIndex()).setHelpText("Leave this slot empty.").build();
	}
	/**
	* The color index the clear command renders with, setting it apart from real candidates.
	* @returns {number}
	*/
	clearCommandColorIndex() {
		return 16;
	}
	/**
	* Gets everything eligible to occupy the targeted slot.
	*
	* @returns {(RPG_Skill|RPG_Item)[]}
	*/
	candidates() {
		if (this.slotKey() === JABS_Button.Tool) return this.toolCandidates();
		if (this.slotKey() === JABS_Button.UsableItem) return this.usableItemCandidates();
		if (this.slotKey() === JABS_Button.Dodge) return this.actor().buildDodgeSkillCandidatePool();
		if (this.slotKey() === JABS_Button.Offhand) return this.actor().buildOffhandAssignableSkillPool();
		return this.actor().buildCombatSkillCandidatePool();
	}
	/**
	* Gets the party's tools- items explicitly tagged as such.
	* @returns {RPG_Item[]}
	*/
	toolCandidates() {
		return $gameParty.allItems().filter((item) => this.isEligibleItem(item) && item.jabsTool === true);
	}
	/**
	* Gets the party's usable items- consumables that are not tools.
	* @returns {RPG_Item[]}
	*/
	usableItemCandidates() {
		return $gameParty.allItems().filter((item) => this.isEligibleItem(item) && item.jabsTool !== true);
	}
	/**
	* Determines whether an item may occupy a slot at all.
	*
	* Mirrors the gates JABS applies elsewhere: the item must be a genuine always-usable item rather
	* than a weapon or armor that happens to carry a tag, and must not have been explicitly hidden.
	* @param {RPG_Item} item The item to evaluate.
	* @returns {boolean}
	*/
	isEligibleItem(item) {
		if (item.jabsHiddenFromMenus) return false;
		if (DataManager.isItem(item) === false) return false;
		if (item.itypeId !== 1) return false;
		return item.occasion === 0;
	}
	/**
	* Builds the command representing a single candidate.
	* @param {RPG_Skill|RPG_Item} candidate The skill or item being offered.
	* @returns {BuiltWindowCommand}
	*/
	buildCandidateCommand(candidate) {
		const { id, name, iconIndex, description } = candidate;
		return new WindowCommandBuilder(name).setSymbol("candidate").setExtensionData(id).setIconIndex(iconIndex).setHelpText(description).setRightText(this.describeQuantity(candidate)).build();
	}
	/**
	* Describes how many of a candidate the party holds, where that is meaningful.
	*
	* Skills have no quantity, and neither do items that are not consumed on use, so both render
	* nothing rather than a misleading count.
	* @param {RPG_Skill|RPG_Item} candidate The candidate being described.
	* @returns {string}
	*/
	describeQuantity(candidate) {
		if (DataManager.isItem(candidate) === false) return String.empty;
		if (candidate.consumable === false) return String.empty;
		return `x${$gameParty.numItems(candidate)}`;
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.<br/>
* Adds the loadout command to the main menu's actor column.
*/
J.ABS.EXT.LOADOUT.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.ABS.EXT.LOADOUT.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	if (this.canAddLoadoutCommand() === false) return;
	const command = new WindowCommandBuilder(J.ABS.EXT.LOADOUT.Metadata.commandName).setSymbol("jabs-loadout").setHelpText("Choose which skills and items each character has bound to each combat input.").setEnabled(true).setIconIndex(J.ABS.EXT.LOADOUT.Metadata.commandIconIndex).setMenuSection(MenuSection.Actor).build();
	this.addBuiltCommand(command);
};
/**
* Determines whether the loadout command should appear in the menu.
* @returns {boolean}
*/
Window_MenuCommand.prototype.canAddLoadoutCommand = function() {
	const switchId = J.ABS.EXT.LOADOUT.Metadata.menuSwitchId;
	if (switchId === 0) return true;
	return $gameSwitches.value(switchId);
};

//#endregion
//#region src/plugins/abs/ext/loadout/scenes/Scene_JabsLoadout.js
/**
* The scene for reviewing and changing what each party member has bound to each combat input.
*
* This replaces five separate assign flows that previously lived on the JABS quick menu, each of
* which opened a pair of on-map windows and every one of which operated on the party leader only-
* meaning an ally's loadout could not be touched without first making them the leader.
*
* Every member gets a column of slots, and those columns move together: choosing a row selects that
* slot for everyone at once, and only the focused column animates its highlight. The candidate lists
* beneath follow the same row, so "who has what in this slot, and what could they have" is answered
* without navigating anywhere. Left and right change whose column is focused, and mean exactly that
* everywhere in the scene.
*
* Unlike the other actor-scoped scenes this extends the plain facet base rather than the actor-scoped
* one. It has no single actor to name in a ribbon.
*/
var Scene_JabsLoadout = class Scene_JabsLoadout extends Scene_MenuFacetBase {
	/**
	* Pushes this scene onto the scene stack.
	*/
	static callScene() {
		SceneManager.push(Scene_JabsLoadout);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes this scene's members.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the loadout.
		*/
		this._j._loadout = {};
		/**
		* The headers naming each column's party member.
		* @type {Window_LoadoutActorHeader|null}
		*/
		this._j._loadout._header = null;
		/**
		* The labels naming each row's slot.
		* @type {Window_LoadoutSpine|null}
		*/
		this._j._loadout._spine = null;
		/**
		* Each member's column of slots, in party order.
		* @type {Window_LoadoutSlots[]}
		*/
		this._j._loadout._slotColumns = [];
		/**
		* Each member's list of candidates for the selected slot, in party order.
		* @type {Window_LoadoutPicker[]}
		*/
		this._j._loadout._pickers = [];
		/**
		* Which member's column is currently focused.
		* @type {number}
		*/
		this._j._loadout._focusedColumn = 0;
	}
	/**
	* Gets the party members this scene presents, in column order.
	* @returns {Game_Actor[]}
	*/
	members() {
		return $gameParty.members();
	}
	/**
	* Gets the headers naming each column's party member.
	* @returns {Window_LoadoutActorHeader}
	*/
	headerWindow() {
		return this._j._loadout._header;
	}
	/**
	* Sets the headers naming each column's party member.
	* @param {Window_LoadoutActorHeader} window The window to track.
	*/
	setHeaderWindow(window) {
		this._j._loadout._header = window;
	}
	/**
	* Gets the labels naming each row's slot.
	* @returns {Window_LoadoutSpine}
	*/
	spineWindow() {
		return this._j._loadout._spine;
	}
	/**
	* Sets the labels naming each row's slot.
	* @param {Window_LoadoutSpine} window The window to track.
	*/
	setSpineWindow(window) {
		this._j._loadout._spine = window;
	}
	/**
	* Gets every member's slot column.
	* @returns {Window_LoadoutSlots[]}
	*/
	slotColumns() {
		return this._j._loadout._slotColumns;
	}
	/**
	* Gets every member's candidate list.
	* @returns {Window_LoadoutPicker[]}
	*/
	pickers() {
		return this._j._loadout._pickers;
	}
	/**
	* Gets which member's column is currently focused.
	* @returns {number} The focusedColumn.
	*/
	focusedColumn() {
		return this._j._loadout._focusedColumn;
	}
	/**
	* Sets which member's column is currently focused.
	* @param {number} newFocusedColumn The new focusedColumn.
	*/
	setFocusedColumn(newFocusedColumn) {
		this._j._loadout._focusedColumn = newFocusedColumn;
	}
	/**
	* Gets the slot column currently focused.
	* @returns {Window_LoadoutSlots}
	*/
	focusedSlotColumn() {
		return this.slotColumns()[this.focusedColumn()];
	}
	/**
	* Gets the candidate list belonging to the focused column.
	* @returns {Window_LoadoutPicker}
	*/
	focusedPicker() {
		return this.pickers()[this.focusedColumn()];
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates this scene's own windows.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createActorHeaderWindow();
		this.createSlotColumnWindows();
		this.createSpineWindow();
		this.createPickerWindows();
		this.syncSlotSelection(0);
		this.focusedSlotColumn().activate();
		this.refreshPickers();
	}
	/**
	* Creates the column headers and adds them to tracking.
	*/
	createActorHeaderWindow() {
		const window = new Window_LoadoutActorHeader(this.actorHeaderWindowRect());
		window.setColumnGeometry(this.actorColumnWidth(), this.spineWidth());
		this.setHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Creates one slot column per party member.
	*/
	createSlotColumnWindows() {
		this.members().forEach((actor, index) => {
			const window = new Window_LoadoutSlots(this.slotColumnRect(index));
			window.setActor(actor);
			window.setHandler("ok", this.onSlotChosen.bind(this));
			window.setHandler("context", this.onSlotCleared.bind(this));
			window.setHandler("cancel", this.popScene.bind(this));
			window.setHandler("focus-prev", this.onFocusPreviousColumn.bind(this));
			window.setHandler("focus-next", this.onFocusNextColumn.bind(this));
			window.setHelpWindow(this.helpWindow());
			window.deactivate();
			this.slotColumns().push(window);
			this.addWindow(window);
		});
	}
	/**
	* Creates the spine of slot labels and adds it to tracking.
	*/
	createSpineWindow() {
		const window = new Window_LoadoutSpine(this.spineWindowRect());
		window.setRowHeight(this.slotColumns()[0].itemHeight());
		this.setSpineWindow(window);
		this.addWindow(window);
	}
	/**
	* Creates one candidate list per party member.
	*/
	createPickerWindows() {
		this.members().forEach((actor, index) => {
			const window = new Window_LoadoutPicker(this.pickerRect(index));
			window.setHandler("candidate", this.onCandidateChosen.bind(this));
			window.setHandler("clear", this.onCandidateCleared.bind(this));
			window.setHandler("cancel", this.onPickerCancelled.bind(this));
			window.setHelpWindow(this.helpWindow());
			window.deactivate();
			window.deselect();
			this.pickers().push(window);
			this.addWindow(window);
		});
	}
	/**
	* The proportion of the width given to the spine of slot labels.
	*
	* Narrower than either member's column because it carries a short fixed label rather than a skill
	* name, and because the assignments are the content- the spine only says which row you are on.
	* @returns {number}
	*/
	spineRatio() {
		return .24;
	}
	/**
	* The width of the spine of slot labels.
	* @returns {number}
	*/
	spineWidth() {
		return Math.floor(this.facetAreaRect().width * this.spineRatio());
	}
	/**
	* The width of a single member's column.
	*
	* An even share of whatever the spine does not claim, so the columns always match each other
	* regardless of how wide the spine is configured to be.
	* @returns {number}
	*/
	actorColumnWidth() {
		return Math.floor((this.facetAreaRect().width - this.spineWidth()) / this.members().length);
	}
	/**
	* The left edge of a given member's column.
	* @param {number} index The column being placed.
	* @returns {number}
	*/
	actorColumnX(index) {
		const spineOffset = index === 0 ? 0 : this.spineWidth();
		return this.actorColumnWidth() * index + spineOffset;
	}
	/**
	* Builds the rectangle for the column headers, capping the slot columns.
	* @returns {Rectangle}
	*/
	actorHeaderWindowRect() {
		const facetArea = this.facetAreaRect();
		return new Rectangle(facetArea.x, facetArea.y, facetArea.width, this.calcWindowHeight(1, false));
	}
	/**
	* The height of the slot columns, being exactly the rows they contain.
	* @returns {number}
	*/
	slotColumnHeight() {
		return this.calcWindowHeight(LoadoutSlotCatalog.slotCount(), true);
	}
	/**
	* The vertical position the slot columns begin at.
	* @returns {number}
	*/
	slotColumnY() {
		return this.facetAreaRect().y + this.actorHeaderWindowRect().height;
	}
	/**
	* Builds the rectangle for a given member's slot column.
	* @param {number} index The column being placed.
	* @returns {Rectangle}
	*/
	slotColumnRect(index) {
		return new Rectangle(this.actorColumnX(index), this.slotColumnY(), this.actorColumnWidth(), this.slotColumnHeight());
	}
	/**
	* Builds the rectangle for the spine of slot labels, sat between the columns.
	* @returns {Rectangle}
	*/
	spineWindowRect() {
		return new Rectangle(this.actorColumnWidth(), this.slotColumnY(), this.spineWidth(), this.slotColumnHeight());
	}
	/**
	* Builds the rectangle for a given member's candidate list.
	*
	* These claim everything between the slot columns and the control legend, which is the space the
	* scene previously left empty while opening its picker as a modal over the board instead.
	* @param {number} index The list being placed.
	* @returns {Rectangle}
	*/
	pickerRect(index) {
		const facetArea = this.facetAreaRect();
		const width = Math.floor(facetArea.width / this.members().length);
		const y = this.slotColumnY() + this.slotColumnHeight();
		const height = facetArea.y + facetArea.height - y;
		return new Rectangle(width * index, y, width, height);
	}
	/**
	* Points every slot column at the same row, so a slot is selected for the whole party at once.
	*
	* Columns that are not focused stay selected rather than being deselected, which leaves their
	* highlight drawn without animating it- the player can see which slot they are on for everyone,
	* while it stays unambiguous whose slot they are about to change.
	* @param {number} index The row to select.
	*/
	syncSlotSelection(index) {
		this.slotColumns().forEach((column) => column.select(index));
	}
	/**
	* Rebuilds every candidate list to reflect the currently selected slot.
	*/
	refreshPickers() {
		const slotKey = this.focusedSlotColumn().currentSlotKey();
		this.pickers().forEach((picker, index) => picker.setTarget(this.members()[index], slotKey));
		this.pickers().forEach((picker) => picker.deselect());
	}
	/**
	* Extends {@link #update}.<br/>
	* Also keeps the unfocused columns and the candidate lists following the focused column.
	*/
	update() {
		super.update();
		if (this.focusedPicker().active) return;
		const index = this.focusedSlotColumn().index();
		if (this.slotColumns().some((column) => column.index() !== index)) {
			this.syncSlotSelection(index);
			this.refreshPickers();
		}
	}
	/**
	* Moves focus to the previous member's column.
	*/
	onFocusPreviousColumn() {
		this.focusColumn(this.focusedColumn() - 1);
	}
	/**
	* Moves focus to the next member's column.
	*/
	onFocusNextColumn() {
		this.focusColumn(this.focusedColumn() + 1);
	}
	/**
	* Focuses a member's column, wrapping around the ends of the party.
	* @param {number} index The column to focus.
	*/
	focusColumn(index) {
		const count = this.slotColumns().length;
		const wrapped = (index % count + count) % count;
		this.focusedSlotColumn().deactivate();
		this.setFocusedColumn(wrapped);
		this.focusedSlotColumn().activate();
		this.focusedSlotColumn().updateHelp();
	}
	/**
	* Handles a slot being chosen, focusing that member's candidate list.
	*/
	onSlotChosen() {
		this.focusedSlotColumn().deactivate();
		this.focusedPicker().activate();
		this.focusedPicker().select(0);
	}
	/**
	* Handles a candidate being chosen, committing it to the slot.
	*/
	onCandidateChosen() {
		const chosenId = this.focusedPicker().currentExt();
		this.commitAssignment(chosenId);
	}
	/**
	* Handles the clear entry being chosen, emptying the slot.
	*/
	onCandidateCleared() {
		this.commitAssignment(0);
	}
	/**
	* Assigns something to the focused member's selected slot and returns to the columns.
	* @param {number} skillId The id to assign, or zero to empty the slot.
	*/
	commitAssignment(skillId) {
		this.focusedPicker().actor().setEquippedSkill(this.focusedPicker().slotKey(), skillId);
		SoundManager.playEquip();
		this.focusedSlotColumn().refresh();
		this.closePicker();
	}
	/**
	* Handles the candidate list being backed out of without choosing anything.
	*/
	onPickerCancelled() {
		this.closePicker();
	}
	/**
	* Returns focus from a candidate list to the slot columns.
	*/
	closePicker() {
		this.focusedPicker().deactivate();
		this.focusedPicker().deselect();
		this.focusedSlotColumn().activate();
	}
	/**
	* Handles the context action on a slot column, emptying the highlighted slot outright.
	*/
	onSlotCleared() {
		const column = this.focusedSlotColumn();
		if (column.slottedEntry(column.currentSlotKey()) === null) {
			SoundManager.playBuzzer();
			column.activate();
			return;
		}
		column.actor().setEquippedSkill(column.currentSlotKey(), 0);
		SoundManager.playEquip();
		column.refresh();
		column.activate();
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* @returns {{semantic: string, label: string}[]}
	*/
	controlLegendEntries() {
		return [
			{
				semantic: ["focus-prev", "focus-next"],
				label: "switch character"
			},
			{
				semantic: "ok",
				label: "assign"
			},
			{
				semantic: "context",
				label: "clear slot"
			},
			{
				semantic: "cancel",
				label: "back"
			}
		];
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.<br/>
* Adds a handler for the loadout menu command.
*/
J.ABS.EXT.LOADOUT.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.ABS.EXT.LOADOUT.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("jabs-loadout", this.commandJabsLoadout.bind(this));
};
/**
* Opens the loadout scene.
*/
Scene_Menu.prototype.commandJabsLoadout = function() {
	Scene_JabsLoadout.callScene();
};

//#endregion
//# sourceMappingURL=J-ABS-Loadout.js.map