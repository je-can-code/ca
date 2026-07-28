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
	* Adopts the board's column geometry so each name lands over its own column.
	*
	* The geometry is handed over rather than recalculated because two windows deriving the same layout
	* independently is precisely how they end up disagreeing- the board owns the arithmetic, this window
	* only follows it.
	* @param {number} actorColumnWidth The width of a single actor column.
	* @param {number} slotSpineWidth The width of the spine between them.
	*/
	setColumnGeometry(actorColumnWidth, slotSpineWidth) {
		this._actorColumnWidth = actorColumnWidth;
		this._slotSpineWidth = slotSpineWidth;
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
		if (this._actorColumnWidth === 0) return;
		this.members().forEach((actor, index) => this.drawColumnHeader(actor, index));
	}
	/**
	* Renders a single column's header.
	* @param {Game_Actor} actor The member owning this column.
	* @param {number} index The column index.
	*/
	drawColumnHeader(actor, index) {
		const spineOffset = index === 0 ? 0 : this._slotSpineWidth;
		const x = this._actorColumnWidth * index + spineOffset;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(actor.name(), x, 0, this._actorColumnWidth, "center");
		this.resetTextColor();
	}
};

//#endregion
//#region src/plugins/abs/ext/loadout/windows/Window_LoadoutBoard.js
/**
* The board showing every assignable slot for every party member at once.
*
* This is the only screen in the game that renders more than one actor simultaneously, and it can
* afford to because it has no permanent picker or detail column competing for the space- its picker
* opens as a modal over the board rather than beside it. Every other actor-scoped scene carries one,
* which is why they remain single-actor.
*
* Rendering both members side by side answers the question a two-person party actually asks: not
* "what does Jerald have equipped", but "between the two of them, is anything uncovered".
*
* The columns are literal window columns, so moving between actors is ordinary horizontal cursor
* movement rather than a special binding- the player presses left and right and it simply works.
*/
var Window_LoadoutBoard = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Overwrites {@link #maxCols}.<br/>
	* One column per party member.
	* @returns {number}
	*/
	maxCols() {
		return Math.max(1, $gameParty.size());
	}
	/**
	* Gets the party members rendered by this board, in column order.
	* @returns {Game_Actor[]}
	*/
	members() {
		return $gameParty.members();
	}
	/**
	* The slot keys this board renders, in row order.
	*
	* Mainhand is deliberately absent- it is supplied by whatever weapon the actor has equipped rather
	* than chosen here, so offering it as a row would imply an assignment the player cannot make.
	* @returns {string[]}
	*/
	slotKeys() {
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
	* Implements {@link #makeCommandList}.<br/>
	* Builds one command per actor per slot, ordered so the grid reads row by row.
	*
	* The engine lays a multi-column list out left to right before wrapping, so the commands must be
	* interleaved by actor rather than grouped by them- otherwise every one of Jerald's slots would
	* occupy the top rows and Rupert's would follow beneath, which is a list, not a board.
	*/
	makeCommandList() {
		this.slotKeys().forEach((slotKey) => {
			this.members().forEach((actor) => this.addBuiltCommand(this.buildSlotCommand(actor, slotKey)));
		});
	}
	/**
	* Builds the command representing one actor's assignment to one slot.
	* @param {Game_Actor} actor The actor owning the slot.
	* @param {string} slotKey The key of the slot being represented.
	* @returns {BuiltWindowCommand}
	*/
	buildSlotCommand(actor, slotKey) {
		const slot = actor.getSkillSlotManager().getSkillSlotByKey(slotKey);
		const skillId = slot ? slot.id : 0;
		const skill = skillId > 0 ? actor.skill(skillId) : null;
		const name = skill ? skill.name : this.emptySlotText();
		return new WindowCommandBuilder(name).setSymbol(slotKey).setIconIndex(skill ? skill.iconIndex : 0).setExtensionData({
			actorId: actor.actorId(),
			slotKey,
			skillId
		}).setHelpText(this.describeSlot(actor, slotKey, skill)).build();
	}
	/**
	* Describes what a slot currently holds and how it is triggered.
	*
	* Named for both the actor and the input, because the board shows two members at once- "the offhand
	* slot" is ambiguous here in a way it never was on the old single-actor menus.
	* @param {Game_Actor} actor The actor owning the slot.
	* @param {string} slotKey The key of the slot being described.
	* @param {?RPG_Skill} skill Whatever currently occupies the slot, if anything.
	* @returns {string}
	*/
	describeSlot(actor, slotKey, skill) {
		const input = this.describeSlotInput(slotKey);
		if (!skill) return `${actor.name()} has nothing assigned to ${input}.`;
		return `${actor.name()} uses ${skill.name} on ${input}.`;
	}
	/**
	* Describes which input fires a given slot, resolved against the player's live bindings.
	*
	* Combat skills are not bound directly- each is the skill trigger modifier held alongside one of
	* the primary buttons- so their description is assembled from the current binding of both halves.
	* Doing it this way rather than writing "L1 + Cross" into a string means remapping either half is
	* immediately reflected here, and a retired button cannot leave a stale label behind.
	* @param {string} slotKey The key of the slot being described.
	* @returns {string}
	*/
	describeSlotInput(slotKey) {
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
	describeButton(button) {
		return InputLegendResolver.resolve(button, button);
	}
	/**
	* The proportion of the board's width given to the slot spine running down the middle.
	*
	* The spine is narrower than either actor column because it carries a short fixed label rather than
	* a skill name, and because the assignments are the content- the spine only says which row you are
	* looking at.
	* @returns {number}
	*/
	slotSpineRatio() {
		return .24;
	}
	/**
	* The width of the slot spine.
	* @returns {number}
	*/
	slotSpineWidth() {
		return Math.floor(this.innerWidth * this.slotSpineRatio());
	}
	/**
	* The width of a single actor's column.
	*
	* Derived as an even share of whatever the spine does not claim, so the two columns always match
	* each other regardless of how wide the spine is configured to be.
	* @returns {number}
	*/
	actorColumnWidth() {
		return Math.floor((this.innerWidth - this.slotSpineWidth()) / this.maxCols());
	}
	/**
	* Overwrites {@link #itemRect}.<br/>
	* Lays the columns out either side of the slot spine.
	* @param {number} index The index of the command being placed.
	* @returns {Rectangle}
	*/
	itemRect(index) {
		const column = index % this.maxCols();
		const row = Math.floor(index / this.maxCols());
		const spineOffset = column === 0 ? 0 : this.slotSpineWidth();
		const x = this.actorColumnWidth() * column + spineOffset;
		const y = row * this.itemHeight() - this.scrollBaseY();
		return new Rectangle(x, y, this.actorColumnWidth(), this.itemHeight());
	}
	/**
	* Extends {@link #drawItem}.<br/>
	* Also renders the slot's own label into the spine, once per row.
	* @param {number} index The index of the command being drawn.
	*/
	drawItem(index) {
		super.drawItem(index);
		if (index % this.maxCols() !== 0) return;
		this.drawSlotSpineLabel(index);
	}
	/**
	* Renders the slot label for the row the given command belongs to.
	* @param {number} index The index of a command in the row being labelled.
	*/
	drawSlotSpineLabel(index) {
		const rect = this.itemRect(index);
		const x = this.actorColumnWidth();
		this.resetFontSettings();
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(this.describeSlotInput(this.commandSymbol(index)), x, rect.y, this.slotSpineWidth(), "center");
		this.resetTextColor();
	}
	/**
	* The text rendered for a slot holding nothing.
	* @returns {string}
	*/
	emptySlotText() {
		return "- empty -";
	}
	/**
	* The color index the input description renders with.
	* @returns {number}
	*/
	inputTextColorIndex() {
		return 4;
	}
	/**
	* Gets the extension data of the currently highlighted slot.
	* @returns {?{actorId: number, slotKey: string, skillId: number}}
	*/
	currentSlotData() {
		if (this.index() < 0) return null;
		return this.commandEntryAt(this.index())?.ext ?? null;
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
		this.initMembers();
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
	* Points this window at a particular actor's particular slot and rebuilds accordingly.
	* @param {Game_Actor} actor The actor whose slot is being filled.
	* @param {string} slotKey The key of the slot being filled.
	*/
	setTarget(actor, slotKey) {
		this._actor = actor;
		this._slotKey = slotKey;
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
		this.candidates().forEach((candidate) => this.addBuiltCommand(this.buildCandidateCommand(candidate)));
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
* Unlike the other actor-scoped scenes this one extends the plain facet base rather than the
* actor-scoped one. It has no single actor to put in a ribbon: the board shows every member at once,
* which it can afford because its picker opens as a modal over the board instead of occupying a
* column beside it.
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
		* The board of every member's every slot.
		* @type {Window_LoadoutBoard|null}
		*/
		this._j._loadout._board = null;
		/**
		* The modal list of things eligible for the slot being filled.
		* @type {Window_LoadoutPicker|null}
		*/
		this._j._loadout._picker = null;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates this scene's own windows.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createBoardWindow();
		this.createActorHeaderWindow();
		this.createPickerWindow();
		this.boardWindow().select(0);
		this.boardWindow().activate();
	}
	/**
	* Creates the column headers and adds them to tracking.
	*/
	createActorHeaderWindow() {
		const rectangle = this.actorHeaderWindowRect();
		const window = new Window_LoadoutActorHeader(rectangle);
		window.setColumnGeometry(this.boardWindow().actorColumnWidth(), this.boardWindow().slotSpineWidth());
		this._j._loadout._header = window;
		this.addWindow(window);
	}
	/**
	* Creates the loadout board and adds it to tracking.
	*/
	createBoardWindow() {
		const rectangle = this.boardWindowRect();
		const window = new Window_LoadoutBoard(rectangle);
		window.setHandler("ok", this.onSlotSelected.bind(this));
		window.setHandler("context", this.onSlotCleared.bind(this));
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHelpWindow(this._helpWindow);
		this._j._loadout._board = window;
		this.addWindow(window);
	}
	/**
	* Gets the loadout board.
	* @returns {Window_LoadoutBoard}
	*/
	boardWindow() {
		return this._j._loadout._board;
	}
	/**
	* Creates the picker and adds it to tracking.
	*/
	createPickerWindow() {
		const rectangle = this.pickerWindowRect();
		const window = new Window_LoadoutPicker(rectangle);
		window.setHandler("candidate", this.onCandidateSelected.bind(this));
		window.setHandler("cancel", this.onPickerCancelled.bind(this));
		window.setHelpWindow(this._helpWindow);
		window.hide();
		window.deactivate();
		this._j._loadout._picker = window;
		this.addWindow(window);
	}
	/**
	* Gets the picker.
	* @returns {Window_LoadoutPicker}
	*/
	pickerWindow() {
		return this._j._loadout._picker;
	}
	/**
	* Builds the rectangle for the column headers, capping the board.
	* @returns {Rectangle}
	*/
	actorHeaderWindowRect() {
		const facetArea = this.facetAreaRect();
		const height = this.calcWindowHeight(1, false);
		return new Rectangle(facetArea.x, facetArea.y, facetArea.width, height);
	}
	/**
	* Builds the rectangle for the board, filling whatever the headers leave.
	* @returns {Rectangle}
	*/
	boardWindowRect() {
		const facetArea = this.facetAreaRect();
		const headerHeight = this.actorHeaderWindowRect().height;
		return new Rectangle(facetArea.x, facetArea.y + headerHeight, facetArea.width, facetArea.height - headerHeight);
	}
	/**
	* Builds the rectangle for the picker, overlaying the board.
	*
	* It deliberately covers the board rather than sitting beside it- a permanent side panel is exactly
	* what forces every other actor-scoped scene down to one actor at a time.
	* @returns {Rectangle}
	*/
	pickerWindowRect() {
		return this.boardWindowRect();
	}
	/**
	* Handles a slot being chosen on the board, opening the list of things eligible for it.
	*/
	onSlotSelected() {
		const slotData = this.boardWindow().currentSlotData();
		this.boardWindow().deactivate();
		this.pickerWindow().setTarget($gameActors.actor(slotData.actorId), slotData.slotKey);
		this.pickerWindow().show();
		this.pickerWindow().activate();
	}
	/**
	* Handles a candidate being chosen in the picker, committing it to the slot.
	*/
	onCandidateSelected() {
		const chosenId = this.pickerWindow().currentExt();
		this.pickerWindow().actor().setEquippedSkill(this.pickerWindow().slotKey(), chosenId);
		this.closePicker();
	}
	/**
	* Handles the picker being backed out of without choosing anything.
	*/
	onPickerCancelled() {
		this.closePicker();
	}
	/**
	* Dismisses the picker and returns focus to the board.
	*/
	closePicker() {
		this.pickerWindow().hide();
		this.pickerWindow().deactivate();
		this.boardWindow().refresh();
		this.boardWindow().activate();
	}
	/**
	* Handles the context action on the board, emptying the highlighted slot.
	*/
	onSlotCleared() {
		const slotData = this.boardWindow().currentSlotData();
		if (slotData.skillId === 0) {
			SoundManager.playBuzzer();
			this.boardWindow().activate();
			return;
		}
		$gameActors.actor(slotData.actorId).setEquippedSkill(slotData.slotKey, 0);
		SoundManager.playEquip();
		this.boardWindow().refresh();
		this.boardWindow().activate();
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* @returns {{semantic: string, label: string}[]}
	*/
	controlLegendEntries() {
		return [
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
	this._commandWindow.setHandler("jabs-loadout", this.commandJabsLoadout.bind(this));
};
/**
* Opens the loadout scene.
*/
Scene_Menu.prototype.commandJabsLoadout = function() {
	Scene_JabsLoadout.callScene();
};

//#endregion
//# sourceMappingURL=J-ABS-Loadout.js.map