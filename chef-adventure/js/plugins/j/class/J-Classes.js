//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CLASS] Unlockable classes, and a scene to review and change them.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-CMS
 * @orderAfter J-Base
 * @orderAfter J-Base-Save
 * @orderAfter J-CMS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin gives every actor a set of classes they have unlocked, and a
 * scene where the player reviews those classes and, where the game allows it,
 * changes between them.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-CMS; the parameters are formatted through it, so a stat reads the
 *   same here as on the equip screen.
 * - J-Classes-Aptitude; adds each class's learnings beside the parameters,
 *   and each class's progress to the list.
 * - J-Classes-Natural; lists each class's natural growths beneath the
 *   parameters.
 * - J-LevelMaster; gives Max Tech a curve, so Max Tech gets a multiplier
 *   like any other parameter with one.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * An actor's class list shows every class they have unlocked, plus the class
 * they are wearing right now. Classes are unlocked for one actor at a time
 * with the "Unlock Classes" plugin command, and nothing ever locks one again.
 *
 * A class set aside for particular actors also shows in their lists before
 * they unlock it, as a dimmed "???" row that gives nothing away. See
 * UNLOCKABLE FOR ACTORS below.
 *
 * Whether the scene can change classes is decided by whatever opens it:
 * - The "Call Scene" plugin command says whether changing is allowed. This
 *   is how a game ties changing classes to a place or a moment: open the
 *   scene with changing allowed from there, and from nowhere else.
 * - The main menu's command only views, unless the "Menu Change Switch" is
 *   set and ON.
 * Opened without changing allowed, every class can still be browsed and
 *   read; confirming a class only buzzes.
 *
 * Changing classes keeps the actor's experience.
 *
 * ============================================================================
 * LAYOUT:
 * Beside the class list, everything about the highlighted class is shown at
 * once: its description across the top, then its parameters, with whatever
 * extensions list beneath them, and any window an extension places beside
 * them. There are no pages to cycle.
 *
 * DESCRIPTION:
 * RPG Maker's editor has no field for a class's description, so it is written
 * in the JMZ data editor, on the Classes board. A class without one leaves
 * the strip across the top blank.
 *
 * ICONS:
 * RPG Maker's editor has no field for a class's icon either, so it is chosen
 * in the JMZ data editor too. A class without one is drawn with the "Class
 * Icon" parameter's icon, and so is every "???" row.
 *
 * PARAMETERS:
 * Every class lists the same fifteen parameters, in the same order, so a row
 * never moves as the cursor goes from class to class: the resources (Max
 * Life, Max Magi, Max Tech), the six core stats (attack, magic attack,
 * defense, magic defense, agility, luck), then Accuracy, Parry, Crit Rate,
 * Crit Dodge, Physical Evasion and Magic Evasion. A growth section an
 * extension lists beneath reads in the same order.
 *
 * For any other class, a parameter changing into it would move reads what it
 * would become and by how much, green when the change is good for the actor
 * and red when it is bad. One it would leave alone reads as it stands, in
 * white. For the class the actor is already in, nothing would change, so
 * every parameter reads as it stands. Every value is padded with zeroes, the
 * way the equip screen pads a value as it stands.
 *
 * Every value is raw: the actor without their equipment. The class's curve
 * and buffs, the actor's own growth and their passives all count, and gear
 * does not, since a class that cannot wear what is equipped takes it off the
 * moment it is changed into.
 *
 * Each parameter reads across four columns, so the numbers line up from row
 * to row: its name, the class's multiplier, its value, and its change.
 *  Max Life   ×0.80   1674   (-419)
 *
 * The multiplier is how a class's growth curve scales a parameter: the
 * class's curve over the curve of the class the actor started the game in,
 * measured at level 99. A class authored as the starting class's curve times
 * some number shows exactly that number, and a curve times one reads ×1.00,
 * the class leaving the parameter alone. The starting class is the Class set
 * on the actor's own database entry.
 *
 * RPG Maker gives Max Tech no curve. Under J-LevelMaster, a class's
 * <mtpGrowthCurve> tag is its Max Tech curve, and is measured the same way.
 *
 * J-Classes only knows curves. An extension can measure other parameters
 * the same way: J-Classes-Natural measures a parameter with no curve by what
 * the class buffs it by while worn.
 *
 * A class that grants passive states through a <passive> tag is previewed
 * without them.
 *
 * ============================================================================
 * UNLOCKABLE FOR ACTORS
 * Want a class only certain actors can ever unlock, like a job one character
 * grows into and nobody else does? By applying the appropriate tag to the
 * class, you can set it aside for the actors it lists.
 *
 * It unlocks only for them: an "Unlock Classes" command naming any other
 * actor is refused, with a warning in the console. Until one of those actors
 * unlocks it, the class waits in their list as a dimmed "???" row, with no
 * name, icon or details, and confirming it buzzes. Every other actor never
 * sees it at all.
 *
 * A class without the tag is open to anyone, and stays out of every list
 * until it is unlocked.
 *
 * TAG USAGE:
 * - Classes
 *
 * TAG FORMAT:
 *  <unlockableForActors:[ACTOR_ID, ACTOR_ID, ...]>
 *    Where each ACTOR_ID is an actor this class can be unlocked for.
 *
 * TAG EXAMPLES:
 *  <unlockableForActors:[1]>
 * Only actor 1 can unlock this class, and it waits in their list as "???"
 * until they do.
 *
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
 * @desc When this switch is ON, the class command is visible in the menu. Leave at 0 to always show it.
 * @default 0
 *
 * @param menu-change-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Change Switch ID
 * @desc When this switch is ON, the menu's class command can change classes. Leave at 0 to only ever view.
 * @default 0
 *
 * @param command-name
 * @parent parentConfig
 * @type string
 * @text Command Name
 * @desc The name of the class command in the menu.
 * @default Classes
 *
 * @param command-icon
 * @parent parentConfig
 * @type number
 * @text Command Icon
 * @desc The icon index of the class command in the menu.
 * @default 0
 *
 * @param class-icon
 * @parent parentConfig
 * @type number
 * @text Class Icon
 * @desc The icon index drawn beside a class without an icon of its own, and beside every "???" class.
 * @default 0
 *
 *
 * @command call-scene
 * @text Call Scene
 * @desc Opens the class scene for the party, either to change classes or only to review them.
 * @arg allowChanging
 * @type boolean
 * @text Allow Changing
 * @desc Whether confirming a class changes the actor into it. When false, the scene only views.
 * @default true
 *
 * @command unlock-classes
 * @text Unlock Classes
 * @desc Unlocks classes for an actor, making them selectable in the class scene. Repeating an unlock does nothing.
 * @arg actorId
 * @type actor
 * @text Actor
 * @desc The actor the classes are unlocked for.
 * @default 1
 * @arg classIds
 * @type class[]
 * @text Classes
 * @desc The classes to unlock.
 * @default []
 */
//endregion annotations

//#region src/plugins/class/core/_metadata/_pluginMetadata.js
/**
* The metadata for J-Classes: the main menu command, and the one switch that can open class changing
* up to the menu.
*/
var J_ClassPluginMetadata = class extends PluginMetadata {
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
		* The id of a switch that represents whether or not the class command is visible in the menu.
		* An id of zero means the command is always available.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* The id of a switch that lets the menu command change classes, not only view them.
		* An id of zero means the menu only ever views, and changing classes is left entirely to events.
		* @type {number}
		*/
		this.menuChangeSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-change-switch"], 0);
		/**
		* The name the class command carries in the menu.
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["command-name"] ?? "Classes";
		/**
		* The icon the class command carries in the menu.
		* @type {number}
		*/
		this.commandIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["command-icon"], 0);
		/**
		* The icon drawn beside every class in the class list.
		* Classes carry no icon of their own in the database, so one is shared by all of them.
		* @type {number}
		*/
		this.classIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["class-icon"], 0);
	}
};

//#endregion
//#region src/plugins/class/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.20.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredCmsVersion = "1.2.1";
	const hasCmsRequirement = J.BASE.Helpers.satisfies(J.CMS.Metadata.version.version(), requiredCmsVersion);
	if (hasCmsRequirement === false) {
		throw new Error(`Either missing J-CMS or has a lower version than the required: ${requiredCmsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CLASS = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.CLASS.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.CLASS.Metadata = new J_ClassPluginMetadata("J-Classes", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.CLASS.Aliased = {};
J.CLASS.Aliased.Game_Actor = new Map();
J.CLASS.Aliased.Scene_Menu = new Map();
J.CLASS.Aliased.Window_MenuCommand = new Map();
/**
* All regular expressions used by this plugin.
*/
J.CLASS.RegExp = {};
/**
* The actors a class may be unlocked for. A class without it is open to anyone; a class with it unlocks
* only for the actors it names, and shows in their class lists as "???" until they do.
*
* <pre>
* Structure:
*  <unlockableForActors:[ACTOR_IDS]>
*
* Example:
*  <unlockableForActors:[1]>
*
* Translation:
*  Only actor 1 can unlock this class.
* </pre>
* @type {RegExp}
*/
J.CLASS.RegExp.UnlockableForActors = /<unlockableForActors: ?(\[[\d, ]+])>/i;

//#endregion
//#region src/plugins/class/core/managers/ClassManager.js
/**
* Answers every question the class scene asks: which classes an actor may look at, whether one of them can
* be changed into right now, and what changing would do to the actor's parameters.
*
* None of this lives in the scene or its windows. A window here draws what this answers and routes input
* back to it, and nothing more, so everything that decides anything can be tested without a screen.
*/
var ClassManager = class {
	/**
	* The level both classes are read at when measuring a multiplier.
	*
	* The editor's maximum, where a baked curve is at its largest and its rounding at its smallest. A class
	* authored as its starting class's curve times a constant reads back as exactly that constant here, which
	* a low level cannot promise: at level 1, a base of 10 times 1.05 bakes to 11 and would read as 1.10.
	* @type {number}
	*/
	static MULTIPLIER_REFERENCE_LEVEL = 99;
	/**
	* The parameters the class scene lists for every class, in this order: the three resources, the six stats a
	* class's curves are built around, then the six every class buffs.
	*
	* Every class lists the same parameters, so each keeps its row as the cursor moves from one class to the
	* next, and two classes compare at a glance.
	* @type {string[]}
	*/
	static LISTED_PARAMETER_KEYS = [
		"mhp",
		"mmp",
		"mtp",
		"atk",
		"mat",
		"def",
		"mdf",
		"agi",
		"luk",
		"hit",
		"grd",
		"cri",
		"cev",
		"eva",
		"mev"
	];
	/**
	* The palette index of the engine's power-up color, which {@link ColorManager.powerUpColor} reads: the green
	* the equip screen marks a better parameter in.
	* @type {number}
	*/
	static POWER_UP_COLOR_INDEX = 24;
	/**
	* The palette index of the engine's power-down color, which {@link ColorManager.powerDownColor} reads: the
	* red the equip screen marks a worse parameter in.
	* @type {number}
	*/
	static POWER_DOWN_COLOR_INDEX = 25;
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* The classes an actor's list shows, in database order: every class they have unlocked, the one they are
	* standing in, and every class set aside for them that they have yet to unlock, which shows as "???".
	* @param {Game_Actor} actor The actor whose classes are listed.
	* @returns {RPG_Class[]}
	*/
	static selectableClasses(actor) {
		const currentClassId = actor.currentClass().id;
		return $dataClasses.filter((dataClass) => this.isSelectableClass(actor, dataClass, currentClassId));
	}
	/**
	* Determines whether one database row belongs in an actor's class list.
	* @param {Game_Actor} actor The actor whose classes are listed.
	* @param {RPG_Class|null} dataClass The database row, which the engine leaves null at index zero.
	* @param {number} currentClassId The id of the class the actor is standing in.
	* @returns {boolean}
	*/
	static isSelectableClass(actor, dataClass, currentClassId) {
		if (dataClass === null) return false;
		if (dataClass.id === currentClassId) return true;
		if (actor.isClassUnlocked(dataClass.id)) return true;
		return this.isTeasedClass(actor, dataClass.id);
	}
	/**
	* Determines whether an actor may see everything about a class: the one they wear, and any they have
	* unlocked. A class they have yet to unlock shows as "???" and nothing more.
	* @param {Game_Actor} actor The actor looking.
	* @param {number} classId The id of the class being looked at.
	* @returns {boolean}
	*/
	static isClassRevealed(actor, classId) {
		if (this.isCurrentClass(actor, classId)) return true;
		return actor.isClassUnlocked(classId);
	}
	/**
	* The name a class's row shows: its own once revealed, "???" until then.
	* @param {Game_Actor} actor The actor whose list the row is in.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {string}
	*/
	static listedClassName(actor, dataClass) {
		if (this.isClassRevealed(actor, dataClass.id) === false) return "???";
		return dataClass.name;
	}
	/**
	* The icon a class's row shows: its own once revealed, the scene's shared class icon until then.
	* @param {Game_Actor} actor The actor whose list the row is in.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {number}
	*/
	static listedClassIconIndex(actor, dataClass) {
		if (this.isClassRevealed(actor, dataClass.id) === false) return J.CLASS.Metadata.classIconIndex;
		return this.classIconIndex(dataClass);
	}
	/**
	* The icon a class wears: its own, or the scene's shared class icon for a class without one.
	* @param {RPG_Class} dataClass The class.
	* @returns {number}
	*/
	static classIconIndex(dataClass) {
		if (dataClass.iconIndex === 0) return J.CLASS.Metadata.classIconIndex;
		return dataClass.iconIndex;
	}
	/**
	* The actors a class may be unlocked for: every id its `<unlockableForActors>` tags name, or none at all for
	* a class without the tag, which any actor may unlock.
	* @param {number} classId The id of the class being read.
	* @returns {number[]}
	*/
	static unlockableActorIds(classId) {
		const tagStructure = J.CLASS.RegExp.UnlockableForActors;
		const actorIdArrays = RPGManager.getArraysFromNotesByRegex($dataClasses[classId], tagStructure);
		return actorIdArrays.flat();
	}
	/**
	* Determines whether a class is set aside for particular actors, rather than open to anyone.
	* @param {number} classId The id of the class being read.
	* @returns {boolean}
	*/
	static isRestrictedClass(classId) {
		return this.unlockableActorIds(classId).length > 0;
	}
	/**
	* Determines whether a class may be unlocked for an actor: any class open to anyone, and a class set aside
	* for particular actors only for them.
	* @param {Game_Actor} actor The actor the class would be unlocked for.
	* @param {number} classId The id of the class.
	* @returns {boolean}
	*/
	static canUnlockClass(actor, classId) {
		if (this.isRestrictedClass(classId) === false) return true;
		return this.unlockableActorIds(classId).includes(actor.actorId());
	}
	/**
	* Determines whether a class shows in an actor's list as a locked "???" row: a class set aside for them that
	* they have yet to unlock.
	*
	* Only a class naming the actor is ever teased. One open to anyone would tease every actor at once, and one
	* set aside for somebody else is not theirs to see at all.
	* @param {Game_Actor} actor The actor whose list is being built.
	* @param {number} classId The id of the class.
	* @returns {boolean}
	*/
	static isTeasedClass(actor, classId) {
		if (actor.isClassUnlocked(classId)) return false;
		if (this.isRestrictedClass(classId) === false) return false;
		return this.canUnlockClass(actor, classId);
	}
	/**
	* Determines whether a class is the one the actor is standing in right now.
	* @param {Game_Actor} actor The actor being asked about.
	* @param {number} classId The id of the class being asked about.
	* @returns {boolean}
	*/
	static isCurrentClass(actor, classId) {
		return actor.currentClass().id === classId;
	}
	/**
	* Determines whether confirming a class would change the actor into it.
	* @param {Game_Actor} actor The actor who would change.
	* @param {number} classId The id of the class being confirmed.
	* @param {boolean} isChangingAllowed Whether the scene was opened with changing allowed.
	* @returns {boolean}
	*/
	static canChangeClass(actor, classId, isChangingAllowed) {
		if (isChangingAllowed === false) return false;
		if (this.isCurrentClass(actor, classId)) return false;
		return actor.isClassUnlocked(classId);
	}
	/**
	* Changes the actor into the given class.
	*
	* Experience is kept because a class is something an actor decides to be, not a new life. Under
	* J-LevelMaster the level is shared across classes anyway; without it, keeping the experience is what
	* stops every change from dropping the actor back to their new class's first level.
	* @param {Game_Actor} actor The actor who changes.
	* @param {number} classId The id of the class to change into.
	*/
	static changeClass(actor, classId) {
		actor.changeClass(classId, true);
	}
	/**
	* Determines whether the class command appears in the main menu.
	* @returns {boolean}
	*/
	static isMenuCommandVisible() {
		const switchId = J.CLASS.Metadata.menuSwitchId;
		if (switchId === 0) return true;
		return $gameSwitches.value(switchId);
	}
	/**
	* Determines whether the class command in the main menu may change classes, rather than only view them.
	* @returns {boolean}
	*/
	static canMenuChangeClasses() {
		const switchId = J.CLASS.Metadata.menuChangeSwitchId;
		if (switchId === 0) return false;
		return $gameSwitches.value(switchId);
	}
	/**
	* The id of the class an actor started the game in, which every multiplier is measured against.
	* @param {Game_Actor} actor The actor being measured.
	* @returns {number}
	*/
	static startingClassId(actor) {
		return actor.actor().classId;
	}
	/**
	* What a class contributes to a parameter at the reference level: the measure its multiplier is read from.
	*
	* J-Classes measures the one thing it knows a class contributes, a parameter's growth curve: a base
	* parameter's, baked into the class's params table, and Max Tech's, which J-LevelMaster reads from a tag- see
	* {@link #maxTpCurveValue}. Every other parameter measures nothing here. An extension that knows another way
	* a class contributes to a parameter- a buff it grants while worn, say- extends this to measure that too,
	* and every multiplier follows from whatever it answers.
	* @param {Game_Actor} actor The actor being measured, for a measure that has to be worked out for them.
	* @param {number} classId The id of the class to read.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {number}
	*/
	static referenceValue(actor, classId, parameterKey) {
		if (parameterKey === "mtp") return this.maxTpCurveValue(classId);
		const paramId = ParameterTraitMap.BaseParameterKeys.indexOf(parameterKey);
		if (paramId === -1) return 0;
		return $dataClasses[classId].params[paramId][this.MULTIPLIER_REFERENCE_LEVEL];
	}
	/**
	* What a class's Max Tech curve gives at the reference level.
	*
	* RPG Maker gives max tech no curve. J-LevelMaster gives a class one through its `<mtpGrowthCurve>` tag, and
	* that curve is the class's base max tech at every level, so this reads the very number J-LevelMaster would
	* give an actor at the reference level. Without J-LevelMaster there is no curve to read, and a class without
	* the tag contributes nothing to measure either way.
	* @param {number} classId The id of the class to read.
	* @returns {number}
	*/
	static maxTpCurveValue(classId) {
		if (!J.LEVEL) return 0;
		const curveValue = GrowthCurveFormula.baseMaxTpForClass($dataClasses[classId], this.MULTIPLIER_REFERENCE_LEVEL);
		if (curveValue === null) return 0;
		return curveValue;
	}
	/**
	* Determines whether a parameter can be expressed as a multiple of the actor's starting class. A starting
	* class contributing none of the parameter at the reference level leaves nothing to multiply.
	* @param {Game_Actor} actor The actor being measured.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {boolean}
	*/
	static hasParameterMultiplier(actor, parameterKey) {
		const startingClassId = this.startingClassId(actor);
		return this.referenceValue(actor, startingClassId, parameterKey) !== 0;
	}
	/**
	* How a class scales a parameter compared with the actor's starting class.
	* @param {Game_Actor} actor The actor being measured.
	* @param {number} classId The id of the class being measured.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {number}
	*/
	static parameterMultiplier(actor, classId, parameterKey) {
		const startingClassId = this.startingClassId(actor);
		const classValue = this.referenceValue(actor, classId, parameterKey);
		const startingValue = this.referenceValue(actor, startingClassId, parameterKey);
		return classValue / startingValue;
	}
	/**
	* The class scene's multiplier column for a parameter: the class's multiplier, to the two decimals
	* multipliers are authored in.
	*
	* A class leaving a parameter at its starting class's reads ×1.00, and shows it, so every row carries a
	* multiplier. Only a parameter the starting class contributes nothing to has nothing to multiply, and shows
	* nothing.
	* @param {Game_Actor} actor The actor being measured.
	* @param {number} classId The id of the class being measured.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {string}
	*/
	static multiplierText(actor, classId, parameterKey) {
		if (this.hasParameterMultiplier(actor, parameterKey) === false) return String.empty;
		const multiplier = this.parameterMultiplier(actor, classId, parameterKey);
		return `×${multiplier.toFixed(2)}`;
	}
	/**
	* Determines whether changing into the class a preview stands in would move a parameter's value.
	*
	* A parameter the change would leave where it is reads as it stands, the way the equip screen reads a
	* parameter an item leaves alone, and so does every parameter of the class already worn, which has no
	* preview to compare against.
	* @param {Game_Actor} actor The actor as they stand, raw- see {@link #baselineActor}.
	* @param {Game_Actor|null} previewActor The copy of the actor standing in the class, which the class
	*   already worn does not have.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {boolean}
	*/
	static isParameterChanging(actor, previewActor, parameterKey) {
		if (previewActor === null) return false;
		return actor.parameter(parameterKey) !== previewActor.parameter(parameterKey);
	}
	/**
	* How one parameter would change if the actor changed into the class a preview stands in: the value it
	* would become, padded the way the catalog pads a value as it stands so every row reads alike, the signed
	* change, and the palette index both are drawn in- see {@link #changeColorIndex}.
	*
	* The color says which way the change reads rather than which way the number moves. A cost or a damage rate
	* reads a drop as good news, so its sign is flipped before the color is chosen.
	* @param {Game_Actor} actor The actor as they stand, raw- see {@link #baselineActor}.
	* @param {Game_Actor} previewActor The copy of the actor standing in the class.
	* @param {string} parameterKey The registry key of the parameter.
	* @returns {{valueText: string, changeText: string, colorIndex: number}}
	*/
	static parameterChange(actor, previewActor, parameterKey) {
		const definition = ParameterRegistry.get(parameterKey);
		const projected = previewActor.parameter(parameterKey);
		const difference = projected - actor.parameter(parameterKey);
		const benefit = definition.isIncreaseBeneficial() ? difference : -difference;
		const deltaText = definition.prettyDelta(difference, actor);
		return {
			valueText: definition.prettyValue(projected, true, previewActor),
			changeText: `(${deltaText})`,
			colorIndex: this.changeColorIndex(benefit)
		};
	}
	/**
	* The palette index a change is drawn in, the same colors the equip screen marks a change with: the
	* engine's power-up color for a change that is good for the actor, its power-down color for one that is
	* bad, and normal text for no change at all.
	* @param {number} benefit How good the change is for the actor: positive when good, negative when bad.
	* @returns {number}
	*/
	static changeColorIndex(benefit) {
		if (benefit > 0) return this.POWER_UP_COLOR_INDEX;
		if (benefit < 0) return this.POWER_DOWN_COLOR_INDEX;
		return 0;
	}
	/**
	* The parameters the class scene lists for every class, in the order it lists them- see
	* {@link #LISTED_PARAMETER_KEYS}.
	* @returns {string[]}
	*/
	static listedParameterKeys() {
		return [...this.LISTED_PARAMETER_KEYS];
	}
	/**
	* Orders parameters the way the class scene lists them, as {@link #listedParameterKeys} does.
	*
	* A parameter the scene never lists can still arrive here- a growth section lists anything a class grows-
	* so it sorts after every listed one, keeping the order it arrived in.
	* @param {string[]} parameterKeys The parameters to order.
	* @returns {string[]} The same parameters, in listing order.
	*/
	static inListingOrder(parameterKeys) {
		const listedKeys = this.listedParameterKeys();
		/**
		* Where a parameter falls in the listing: its place, or after every listed parameter.
		* @param {string} parameterKey The parameter to place.
		* @returns {number}
		*/
		const rankOf = (parameterKey) => {
			const rank = listedKeys.indexOf(parameterKey);
			if (rank === -1) return listedKeys.length;
			return rank;
		};
		return [...parameterKeys].sort((left, right) => rankOf(left) - rankOf(right));
	}
	/**
	* The copy of the actor a class's parameters are compared against in the class scene.
	*
	* Returns null for the class the actor is already standing in: it would change nothing, so its parameters
	* are shown as they stand rather than as a comparison.
	* @param {Game_Actor} actor The actor whose classes are shown.
	* @param {number} classId The id of the class being shown.
	* @returns {Game_Actor|null}
	*/
	static comparisonActor(actor, classId) {
		if (this.isCurrentClass(actor, classId)) return null;
		return this.previewActor(actor, classId);
	}
	/**
	* Builds a copy of the actor standing in the given class with nothing equipped, to read what the class
	* itself makes of them.
	*
	* This is the equip scene's preview trick with the gear taken off. The class sheet compares raw stats, so
	* the class's curve and its own buffs, the actor's growth and their passives all land in what the copy
	* reports, and only equipment is left out. Leaving gear in would mislead: a class that cannot wear what is
	* equipped takes it off when it is changed into, so the copy would count gear the change removes.
	*
	* The copy is thrown away after reading, and nothing done to it reaches the real actor. The gear comes off
	* each slot directly rather than through unequipping, which trades with the party's inventory and runs the
	* refresh every plugin hooks into. For the same reason the class-change hooks are not run, so a class
	* granting passive states through `<passive>` previews without them.
	* @param {Game_Actor} actor The actor to copy.
	* @param {number} classId The id of the class the copy stands in.
	* @returns {Game_Actor}
	*/
	static previewActor(actor, classId) {
		const preview = JsonEx.makeDeepCopy(actor);
		preview.setClassId(classId);
		preview.rawEquips().forEach((slot) => slot.setObject(null));
		preview.onBattlerDataChange();
		return preview;
	}
	/**
	* Builds a copy of the actor as they stand, in the class they wear, with nothing equipped: the raw stats
	* every other class is compared against.
	* @param {Game_Actor} actor The actor to copy.
	* @returns {Game_Actor}
	*/
	static baselineActor(actor) {
		const currentClassId = actor.currentClass().id;
		return this.previewActor(actor, currentClassId);
	}
};

//#endregion
//#region src/plugins/class/core/helpers/ClassSceneLayout.js
/**
* The spacing every window beside the class list shares, so the parameters and whatever an extension places
* beside them can never drift apart.
*/
var ClassSceneLayout = class {
	/**
	* How far in from each side the windows beside the list start and end their rows, as a share of each
	* window's contents width.
	*
	* Those windows are each about half the screen, and a row with its name against one edge and its numbers
	* against the other leaves a gulf between them. Drawing the rows a little way in pulls the two together.
	* @type {number}
	*/
	static CONTENT_INSET_RATE = .1;
	/**
	* The height of a row in any window beside the list: the equip scene catalog's, so a stat sits at the same
	* size and spacing on both screens.
	*
	* It is shorter than the menus' standard row on purpose. A class with a long list of learnings needs every
	* row of the window beside the parameters, and at the standard height the last few fall off the bottom.
	* @type {number}
	*/
	static ROW_HEIGHT = 32;
	/**
	* How much smaller than the menus' own type a row beside the list is drawn, suiting the shorter rows.
	* @type {number}
	*/
	static ROW_FONT_REDUCTION = 2;
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* How far in from each side a window beside the list draws its rows.
	* @param {Window_Base} window The window being laid out.
	* @returns {number}
	*/
	static contentInset(window) {
		return Math.floor(window.contentsWidth() * this.CONTENT_INSET_RATE);
	}
};

//#endregion
//#region src/plugins/class/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the class members.
*/
J.CLASS.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.CLASS.Aliased.Game_Actor.get("initMembers").call(this);
	this.initClassMembers();
};
/**
* Initializes the members this plugin keeps on every actor.
*/
Game_Actor.prototype.initClassMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._class ||= {};
	/**
	* The ids of every class this actor has unlocked, in the order they were unlocked.
	*
	* The class an actor is standing in is deliberately not recorded here just for being worn. It is always
	* listed by virtue of being current, and recording it would make leaving a class look like having
	* unlocked it- the class every actor starts the game in would stay selectable forever.
	* @type {number[]}
	*/
	this._j._class._unlockedClassIds = [];
};
/**
* Gets the ids of every class this actor has unlocked.
* @returns {number[]}
*/
Game_Actor.prototype.unlockedClassIds = function() {
	return this._j._class._unlockedClassIds;
};
/**
* Sets the ids of every class this actor has unlocked.
* @param {number[]} classIds The unlocked class ids.
*/
Game_Actor.prototype.setUnlockedClassIds = function(classIds) {
	this._j._class._unlockedClassIds = classIds;
};
/**
* Determines whether this actor has unlocked the given class.
* @param {number} classId The id of the class to check.
* @returns {boolean}
*/
Game_Actor.prototype.isClassUnlocked = function(classId) {
	return this.unlockedClassIds().includes(classId);
};
/**
* Unlocks the given class for this actor, making it selectable in the class scene.
*
* Unlocking a class twice changes nothing, which is what lets an event repeat an unlock safely. A class set
* aside for other actors through `<unlockableForActors>` is refused, with a warning, since an event asking
* for it is a mistake in the event rather than something to quietly honor.
* @param {number} classId The id of the class to unlock.
*/
Game_Actor.prototype.unlockClass = function(classId) {
	if (ClassManager.canUnlockClass(this, classId) === false) {
		Diagnostics.warn("J-Classes", `class ${classId} is set aside for other actors, not actor ${this.actorId()}.`);
		return;
	}
	if (this.isClassUnlocked(classId)) return;
	const classIds = [...this.unlockedClassIds(), classId];
	this.setUnlockedClassIds(classIds);
};

//#endregion
//#region src/plugins/class/core/windows/Window_ClassDescription.js
/**
* The strip across the top of the class scene: what the highlighted class says about itself.
*
* RPG Maker's editor has no field for a class's description, so it comes from the JMZ data editor. A class
* that editor has never described reads as empty, which leaves this strip blank.
*/
var Window_ClassDescription = class extends Window_Help {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Shows the description of one of an actor's classes.
	*
	* Every window beside the class list is shown a class the same way, but a description belongs to the class
	* rather than to whoever is wearing it, so the actor goes unread.
	* @param {Game_Actor} _actor The actor whose classes are shown.
	* @param {number} classId The id of the class whose description is shown.
	*/
	showClass(_actor, classId) {
		this.setText($dataClasses[classId].description);
	}
};

//#endregion
//#region src/plugins/class/core/windows/Window_ClassList.js
/**
* The classes an actor may look at, one row each, with the class they are standing in picked out in color.
*
* Every row draws at full strength whether or not it can be confirmed. This list is as much for reading as
* for choosing- opened from the menu, nothing in it can be confirmed at all- and the engine's dimmed
* disabled rows would leave a list meant for browsing looking switched off. Whether confirming does anything
* is answered at the moment of confirming instead, which is where the buzzer belongs.
*/
var Window_ClassList = class Window_ClassList extends Window_Command {
	/**
	* The color the class an actor is standing in is drawn in.
	* @type {number}
	*/
	static CURRENT_CLASS_COLOR_INDEX = 6;
	/**
	* The color a class the actor has yet to unlock is drawn in: dimmed, since it is only a hint.
	* @type {number}
	*/
	static LOCKED_CLASS_COLOR_INDEX = 7;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns, by
	* which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The actor whose classes are listed.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* Whether confirming a row may change the actor's class.
		* @type {boolean}
		*/
		this._isChangingAllowed = false;
	}
	/**
	* Gets the actor whose classes are listed.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor whose classes are listed, and rebuilds the list for them.
	* @param {Game_Actor} actor The actor to list classes for.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Gets whether confirming a row may change the actor's class.
	* @returns {boolean}
	*/
	isChangingAllowed() {
		return this._isChangingAllowed;
	}
	/**
	* Sets whether confirming a row may change the actor's class.
	* @param {boolean} isChangingAllowed Whether changing classes is allowed.
	*/
	setChangingAllowed(isChangingAllowed) {
		this._isChangingAllowed = isChangingAllowed;
	}
	/**
	* Implements {@link Window_Command.makeCommandList}.<br/>
	* Lists every class the actor can see.
	*/
	makeCommandList() {
		if (this.actor() === null) return;
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds a row for every class the actor can see.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const classes = ClassManager.selectableClasses(this.actor());
		return classes.map(this.buildCommand, this);
	}
	/**
	* Builds the row for a single class.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(dataClass) {
		const name = ClassManager.listedClassName(this.actor(), dataClass);
		const iconIndex = ClassManager.listedClassIconIndex(this.actor(), dataClass);
		const colorIndex = this.classColorIndex(dataClass);
		const rightText = this.classRightText(dataClass);
		const rightColorIndex = this.classRightColorIndex(dataClass);
		return new WindowCommandBuilder(name).setSymbol("class").setExtensionData(dataClass).setIconIndex(iconIndex).setColorIndex(colorIndex).setRightText(rightText).setRightColorIndex(rightColorIndex).build();
	}
	/**
	* The color a class's name is drawn in: picked out for the class the actor is standing in, dimmed for a
	* class they have yet to unlock, and plain for every other.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {number}
	*/
	classColorIndex(dataClass) {
		const currentClass = this.actor().currentClass();
		if (dataClass.id === currentClass.id) return Window_ClassList.CURRENT_CLASS_COLOR_INDEX;
		const isRevealed = ClassManager.isClassRevealed(this.actor(), dataClass.id);
		if (isRevealed === false) return Window_ClassList.LOCKED_CLASS_COLOR_INDEX;
		return 0;
	}
	/**
	* The short text drawn at the right edge of a class's row.
	*
	* Empty here. This is the seam an extension aliases to summarize whatever it tracks about each class,
	* such as how much of it has been learned.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {string}
	*/
	classRightText(dataClass) {
		return String.empty;
	}
	/**
	* The color the text at the right edge of a class's row is drawn in.
	*
	* Plain here. An extension that summarizes something about each class aliases this beside
	* {@link #classRightText}, to mark a summary worth marking- a class fully learned, say.
	* @param {RPG_Class} dataClass The class the row names.
	* @returns {number}
	*/
	classRightColorIndex(dataClass) {
		return 0;
	}
	/**
	* Overrides {@link Window_Command.isCurrentItemEnabled}.<br/>
	* Asks whether confirming the highlighted class would change into it, rather than whether its row is
	* drawn enabled- every row is, for reading.
	* @returns {boolean}
	*/
	isCurrentItemEnabled() {
		const dataClass = this.currentExt();
		return ClassManager.canChangeClass(this.actor(), dataClass.id, this.isChangingAllowed());
	}
};

//#endregion
//#region src/plugins/class/core/windows/Window_ClassParameters.js
/**
* The class scene's main window: the same parameters for every class, listed down a single column in the same
* order, with whatever extensions add listed beneath them. A row never moves as the cursor goes from one class
* to the next, so two classes compare at a glance.
*
* Any other class shows what changing into it would do, compared against the actor as they are: a parameter
* it would move reads as the equip screen reads a change, and one it would leave alone reads as it stands.
* The class already worn would change nothing, so every parameter reads as it stands.
*
* Each row is a small table: the parameter's name, then its multiplier, its value and its change, each in a
* column of its own so the numbers line up from row to row. Values are formatted by J-CMS and by each
* parameter's own definition, so a stat reads the same way here as on the equip screen.
*
* Extensions add their own sections beneath the parameters by aliasing {@link #drawAfterParameters}.
*/
var Window_ClassParameters = class Window_ClassParameters extends Window_Base {
	/**
	* The widest multiplier the multiplier column makes room for.
	* @type {string}
	*/
	static MULTIPLIER_COLUMN_SAMPLE = "×0.00";
	/**
	* The widest value the value column makes room for: six digits, as wide as any padded catalog value.
	* @type {string}
	*/
	static VALUE_COLUMN_SAMPLE = "000000";
	/**
	* The widest change the change column makes room for.
	* @type {string}
	*/
	static CHANGE_COLUMN_SAMPLE = "(+0000)";
	/**
	* The space between one column of a parameter row and the next.
	* @type {number}
	*/
	static COLUMN_GAP = 16;
	/**
	* The actor whose parameters are shown.
	* @type {Game_Actor|null}
	*/
	_actor = null;
	/**
	* The id of the class being previewed.
	* @type {number}
	*/
	_classId = 0;
	/**
	* A copy of the actor as they stand, with nothing equipped: the raw stats every row starts from.
	* @type {Game_Actor|null}
	*/
	_baselineActor = null;
	/**
	* A copy of the actor standing in the previewed class with nothing equipped, which every row is compared
	* against- or null for the class the actor already wears, whose rows are shown as they stand.
	* @type {Game_Actor|null}
	*/
	_previewActor = null;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Gets the actor whose parameters are shown.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor whose parameters are shown.
	* @param {Game_Actor} actor The actor to show.
	*/
	setActor(actor) {
		this._actor = actor;
	}
	/**
	* Gets the id of the class being previewed.
	* @returns {number}
	*/
	classId() {
		return this._classId;
	}
	/**
	* Sets the id of the class being previewed.
	* @param {number} classId The id of the class to preview.
	*/
	setClassId(classId) {
		this._classId = classId;
	}
	/**
	* Gets the copy of the actor as they stand, with nothing equipped.
	* @returns {Game_Actor|null}
	*/
	baselineActor() {
		return this._baselineActor;
	}
	/**
	* Sets the copy of the actor as they stand, with nothing equipped.
	* @param {Game_Actor} baselineActor The copy every row starts from.
	*/
	setBaselineActor(baselineActor) {
		this._baselineActor = baselineActor;
	}
	/**
	* Gets the copy of the actor standing in the previewed class.
	* @returns {Game_Actor|null}
	*/
	previewActor() {
		return this._previewActor;
	}
	/**
	* Sets the copy of the actor standing in the previewed class.
	* @param {Game_Actor|null} previewActor The copy to compare against.
	*/
	setPreviewActor(previewActor) {
		this._previewActor = previewActor;
	}
	/**
	* Points this window at an actor and one of their classes, and redraws it.
	*
	* Both arrive together because the preview is built from both. Taking them one at a time would build a
	* copy of the actor in the wrong class in between, which is a whole deep copy thrown away for nothing.
	*
	* Every figure shown is raw: the actor with nothing equipped, both as they stand and in the class. The
	* sheet is about what a class makes of the actor, and a class that cannot wear their gear takes it off.
	* @param {Game_Actor} actor The actor whose parameters are shown.
	* @param {number} classId The id of the class being previewed.
	*/
	showClass(actor, classId) {
		this.setActor(actor);
		this.setClassId(classId);
		const baselineActor = ClassManager.baselineActor(actor);
		this.setBaselineActor(baselineActor);
		const previewActor = ClassManager.comparisonActor(actor, classId);
		this.setPreviewActor(previewActor);
		this.refresh();
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws the parameters, then whatever an extension lists beneath them.
	*/
	drawContent() {
		if (this.actor() === null) return;
		const afterParameters = this.drawParametersSection(0);
		this.drawAfterParameters(afterParameters);
	}
	/**
	* Draws the parameters as a titled list, one row each, the same parameters in the same order for every class.
	* @param {number} y The y coordinate the section starts at.
	* @returns {number} The y coordinate just below the section.
	*/
	drawParametersSection(y) {
		this.drawSectionTitle("Parameters", y);
		const rowsY = y + this.lineHeight();
		const parameterKeys = ClassManager.listedParameterKeys();
		parameterKeys.forEach((parameterKey, index) => {
			const rowY = rowsY + index * this.lineHeight();
			this.drawParameterRow(parameterKey, rowY);
		});
		return rowsY + parameterKeys.length * this.lineHeight();
	}
	/**
	* Draws one parameter as a row of four columns: its icon and name from the left, then its multiplier, its
	* value and its change, each right-aligned in a column of its own so every row's numbers line up.
	* @param {string} parameterKey The registry key of the parameter to draw.
	* @param {number} y The y coordinate of the row.
	*/
	drawParameterRow(parameterKey, y) {
		const parameter = ParameterCatalogRenderer.makeParameter(this.baselineActor(), parameterKey);
		this.resetFontSettings();
		this.drawIcon(parameter.iconIndex, this.contentLeft(), y);
		this.makeFontSmaller();
		const columns = this.parameterColumns();
		this.drawText(parameter.name, columns.nameX, y, columns.nameWidth);
		const multiplierText = ClassManager.multiplierText(this.actor(), this.classId(), parameterKey);
		this.drawText(multiplierText, columns.multiplierX, y, columns.multiplierWidth, "right");
		this.drawParameterFigures(parameter, columns, y);
		this.resetFontSettings();
	}
	/**
	* Draws a row's value and change columns: what the value would become and by how much, or the value as it
	* stands when changing classes would leave it alone.
	* @param {CmsParameter} parameter The parameter as the actor has it now, raw.
	* @param {{valueX: number, valueWidth: number, changeX: number, changeWidth: number}} columns Where the
	*   value and change columns sit.
	* @param {number} y The y coordinate of the row.
	*/
	drawParameterFigures(parameter, columns, y) {
		const { parameterKey } = parameter;
		if (ClassManager.isParameterChanging(this.baselineActor(), this.previewActor(), parameterKey) === false) {
			ParameterCatalogRenderer.drawCatalogParameterValue(this, columns.valueX, y, columns.valueWidth, parameter, "right", null);
			return;
		}
		const { valueText, changeText, colorIndex } = ClassManager.parameterChange(this.baselineActor(), this.previewActor(), parameterKey);
		this.drawStyledPaddedValue(columns.valueX, y, valueText, columns.valueWidth, 8, colorIndex, "right");
		const changeColor = ColorManager.textColor(colorIndex);
		this.changeTextColor(changeColor);
		this.contents.fontBold = true;
		this.drawText(changeText, columns.changeX, y, columns.changeWidth, "right");
		this.resetTextColor();
		this.resetFontFormatting();
	}
	/**
	* Where each column of a parameter row sits, measured in whatever type is set when this is asked.
	*
	* The three numeric columns are a fixed width each, sized to the widest thing they are made to hold, and
	* stack leftward from the row's right edge. Measuring what is actually in them instead would let the
	* columns shift as the cursor moves between classes, which is the jumble they exist to prevent.
	* @returns {{nameX: number, nameWidth: number, multiplierX: number, multiplierWidth: number, valueX: number,
	*   valueWidth: number, changeX: number, changeWidth: number}}
	*/
	parameterColumns() {
		const gap = Window_ClassParameters.COLUMN_GAP;
		const changeWidth = this.textWidth(Window_ClassParameters.CHANGE_COLUMN_SAMPLE);
		const valueWidth = this.textWidth(Window_ClassParameters.VALUE_COLUMN_SAMPLE);
		const multiplierWidth = this.textWidth(Window_ClassParameters.MULTIPLIER_COLUMN_SAMPLE);
		const changeX = this.contentRight() - changeWidth;
		const valueX = changeX - gap - valueWidth;
		const multiplierX = valueX - gap - multiplierWidth;
		const nameX = this.contentLeft() + ImageManager.iconWidth + 4;
		const nameWidth = multiplierX - gap - nameX;
		return {
			nameX,
			nameWidth,
			multiplierX,
			multiplierWidth,
			valueX,
			valueWidth,
			changeX,
			changeWidth
		};
	}
	/**
	* The x every row starts at: the scene's shared inset, in from the left edge.
	* @returns {number}
	*/
	contentLeft() {
		return ClassSceneLayout.contentInset(this);
	}
	/**
	* The x every row ends at: the scene's shared inset, in from the right edge.
	* @returns {number}
	*/
	contentRight() {
		return this.contentsWidth() - ClassSceneLayout.contentInset(this);
	}
	/**
	* Draws whatever an extension lists beneath the parameters, and returns the y just below it all.
	*
	* J-Classes lists nothing more. An extension aliases this to draw its own sections at `y` and return the
	* y just below them, so any number of extensions stack one after another.
	* @param {number} y The y coordinate just below everything drawn so far.
	* @returns {number} The y coordinate just below everything drawn.
	*/
	drawAfterParameters(y) {
		return y;
	}
	/**
	* Draws a section's title, in the system color every section title in the menus wears.
	* @param {string} title The section's title.
	* @param {number} y The y coordinate of the title.
	*/
	drawSectionTitle(title, y) {
		const width = this.contentRight() - this.contentLeft();
		this.resetFontSettings();
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(title, this.contentLeft(), y, width);
		this.resetTextColor();
	}
	/**
	* Draws the line standing in for a section with nothing in it.
	* @param {string} text What the line says.
	* @param {number} y The y coordinate of the line.
	*/
	drawEmptySectionRow(text, y) {
		const width = this.contentRight() - this.contentLeft();
		this.resetFontSettings();
		this.changeTextColor(ColorManager.textColor(7));
		this.drawText(text, this.contentLeft(), y, width);
		this.resetTextColor();
	}
	/**
	* Overrides {@link Window_Base.lineHeight}.<br/>
	* Spaces rows the way every window beside the class list does.
	* @returns {number}
	*/
	lineHeight() {
		return ClassSceneLayout.ROW_HEIGHT;
	}
	/**
	* Overrides {@link Window_Base.makeFontSmaller}.<br/>
	* Eases off the reduction step to the one every window beside the class list shares, the way the equip
	* scene's catalog does, since its rows are just as roomy here.
	*/
	makeFontSmaller() {
		if (this.contents.fontSize >= 20) {
			this.contents.fontSize -= ClassSceneLayout.ROW_FONT_REDUCTION;
		}
	}
};

//#endregion
//#region src/plugins/class/core/scenes/Scene_Classes.js
/**
* The class scene: an actor's classes down the left, and everything about the highlighted one beside them,
* all on one screen- its description across the top, and its parameters beneath that.
*
* Whether a class can be changed into here is decided by whoever opens the scene, never by the scene
* itself. A game gates changing behind a place, a moment or a switch simply by choosing when to open it
* with changing allowed. Opened any other way, everything can still be read, and confirming just buzzes.
*
* Layout is inherited from {@link Scene_ActorFacetBase}, which supplies the actor ribbon and the control
* legend and hands down {@link Scene_ActorFacetBase.contentAreaRect} as the region left over. This scene
* places only the list and the windows beside it within that region.
*
* There are two ways to extend it. An extension with more to say about a class's parameters lists it
* beneath them, by aliasing {@link Window_ClassParameters#drawAfterParameters}. An extension with a window
* of its own places it beside the parameters, by aliasing {@link Scene_Classes#sideWindowDefinitions}: the
* parameters then keep the left half, and the side windows share the right. Every window beside the list
* answers `showClass(actor, classId)`.
*/
var Scene_Classes = class extends Scene_ActorFacetBase {
	/**
	* Opens the class scene.
	* @param {boolean} isChangingAllowed Whether confirming a class changes into it.
	*/
	static callScene(isChangingAllowed) {
		SceneManager.push(this);
		SceneManager.prepareNextScene(isChangingAllowed);
	}
	/**
	* Opens the class scene from the main menu, which changes classes only when the game allows it.
	*/
	static callFromMenu() {
		const isChangingAllowed = ClassManager.canMenuChangeClasses();
		this.callScene(isChangingAllowed);
	}
	/**
	* Receives whether this scene may change classes.
	* @param {boolean} isChangingAllowed Whether confirming a class changes into it.
	*/
	prepare(isChangingAllowed) {
		this.setChangingAllowed(isChangingAllowed);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the class scene's members.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the class scene.
		*/
		this._j._class = {};
		/**
		* Whether confirming a class changes into it.
		* @type {boolean}
		*/
		this._j._class._isChangingAllowed = false;
		/**
		* The list of the actor's classes.
		* @type {Window_ClassList|null}
		*/
		this._j._class._classListWindow = null;
		/**
		* The highlighted class's description, across the top of everything beside the list.
		* @type {Window_ClassDescription|null}
		*/
		this._j._class._descriptionWindow = null;
		/**
		* The parameters the highlighted class touches, and whatever extensions list beneath them.
		* @type {Window_ClassParameters|null}
		*/
		this._j._class._parametersWindow = null;
		/**
		* The windows extensions placed beside the parameters, top to bottom.
		* @type {Window_Base[]}
		*/
		this._j._class._sideWindows = [];
	}
	/**
	* The windows this scene places beside the parameters, top to bottom.
	*
	* J-Classes places none. An extension aliases this to add its own- each needs only a way to build its
	* window in the rectangle it is given. Once there is at least one, the parameters keep the left half of
	* the space beneath the description, and these share the right half between them.
	* @returns {Array<{createWindow: function(Rectangle): Window_Base}>}
	*/
	sideWindowDefinitions() {
		return [];
	}
	/**
	* Gets whether confirming a class changes into it.
	* @returns {boolean}
	*/
	isChangingAllowed() {
		return this._j._class._isChangingAllowed;
	}
	/**
	* Sets whether confirming a class changes into it.
	* @param {boolean} isChangingAllowed Whether changing classes is allowed.
	*/
	setChangingAllowed(isChangingAllowed) {
		this._j._class._isChangingAllowed = isChangingAllowed;
	}
	/**
	* Gets the list of the actor's classes.
	* @returns {Window_ClassList|null}
	*/
	classListWindow() {
		return this._j._class._classListWindow;
	}
	/**
	* Sets the list of the actor's classes.
	* @param {Window_ClassList} window The list window to track.
	*/
	setClassListWindow(window) {
		this._j._class._classListWindow = window;
	}
	/**
	* Gets the window showing the highlighted class's description.
	* @returns {Window_ClassDescription|null}
	*/
	descriptionWindow() {
		return this._j._class._descriptionWindow;
	}
	/**
	* Sets the window showing the highlighted class's description.
	* @param {Window_ClassDescription} window The description window to track.
	*/
	setDescriptionWindow(window) {
		this._j._class._descriptionWindow = window;
	}
	/**
	* Gets the window listing the parameters the highlighted class touches.
	* @returns {Window_ClassParameters|null}
	*/
	parametersWindow() {
		return this._j._class._parametersWindow;
	}
	/**
	* Sets the window listing the parameters the highlighted class touches.
	* @param {Window_ClassParameters} window The parameters window to track.
	*/
	setParametersWindow(window) {
		this._j._class._parametersWindow = window;
	}
	/**
	* Gets the windows extensions placed beside the parameters, top to bottom.
	* @returns {Window_Base[]}
	*/
	sideWindows() {
		return this._j._class._sideWindows;
	}
	/**
	* Sets the windows extensions placed beside the parameters.
	* @param {Window_Base[]} windows The side windows to track, top to bottom.
	*/
	setSideWindows(windows) {
		this._j._class._sideWindows = windows;
	}
	/**
	* Gets every window beside the list, each of which shows the highlighted class.
	* @returns {Window_Base[]}
	*/
	detailWindows() {
		return [
			this.descriptionWindow(),
			this.parametersWindow(),
			...this.sideWindows()
		];
	}
	/**
	* Gets the class the list currently has highlighted.
	* @returns {RPG_Class}
	*/
	highlightedClass() {
		return this.classListWindow().currentExt();
	}
	/**
	* Determines whether any extension places a window beside the parameters.
	* @returns {boolean}
	*/
	hasSideWindows() {
		return this.sideWindowDefinitions().length > 0;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates the list and the windows beside it.
	*/
	create() {
		super.create();
		this.createAllWindows();
	}
	/**
	* Creates every window this scene places, and lands on the class the actor is standing in.
	*/
	createAllWindows() {
		this.createClassListWindow();
		this.createDescriptionWindow();
		this.createParametersWindow();
		this.createSideWindows();
		this.selectCurrentClass();
		this.refreshDetails();
	}
	/**
	* Creates the list of the actor's classes and adds it to tracking.
	*/
	createClassListWindow() {
		const window = this.buildClassListWindow();
		this.setClassListWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds and wires the list of the actor's classes.
	* @returns {Window_ClassList}
	*/
	buildClassListWindow() {
		const rectangle = this.classListWindowRect();
		const window = new Window_ClassList(rectangle);
		window.setChangingAllowed(this.isChangingAllowed());
		window.setActor(this.actor());
		window.setHandler("ok", this.onClassOk.bind(this));
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("actor-prev", this.onCycleActorLeft.bind(this));
		window.setHandler("actor-next", this.onCycleActorRight.bind(this));
		window.onIndexChange = this.onClassHighlighted.bind(this);
		return window;
	}
	/**
	* Builds the rectangle for the class list, down the left of the region beneath the ribbon.
	* @returns {Rectangle}
	*/
	classListWindowRect() {
		const contentArea = this.contentAreaRect();
		return new Rectangle(contentArea.x, contentArea.y, this.commandColumnWidth(), contentArea.height);
	}
	/**
	* Builds the rectangle for everything beside the list.
	* @returns {Rectangle}
	*/
	detailAreaRect() {
		const listRect = this.classListWindowRect();
		const contentArea = this.contentAreaRect();
		const x = listRect.x + listRect.width;
		const width = contentArea.width - listRect.width;
		return new Rectangle(x, contentArea.y, width, contentArea.height);
	}
	/**
	* Creates the description window and adds it to tracking.
	*/
	createDescriptionWindow() {
		const rectangle = this.descriptionWindowRect();
		const window = new Window_ClassDescription(rectangle);
		this.setDescriptionWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the rectangle for the description: two lines across the top of everything beside the list.
	* @returns {Rectangle}
	*/
	descriptionWindowRect() {
		const detailArea = this.detailAreaRect();
		const height = this.calcWindowHeight(2, false);
		return new Rectangle(detailArea.x, detailArea.y, detailArea.width, height);
	}
	/**
	* Builds the rectangle for everything beside the list beneath the description, which the parameters and
	* the side windows share.
	* @returns {Rectangle}
	*/
	detailBodyRect() {
		const detailArea = this.detailAreaRect();
		const descriptionRect = this.descriptionWindowRect();
		const y = descriptionRect.y + descriptionRect.height;
		const height = detailArea.height - descriptionRect.height;
		return new Rectangle(detailArea.x, y, detailArea.width, height);
	}
	/**
	* Creates the parameters window and adds it to tracking.
	*/
	createParametersWindow() {
		const rectangle = this.parametersWindowRect();
		const window = new Window_ClassParameters(rectangle);
		this.setParametersWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the rectangle for the parameters window: everything beneath the description, or its left half once
	* an extension places a window of its own beside it.
	* @returns {Rectangle}
	*/
	parametersWindowRect() {
		const detailBody = this.detailBodyRect();
		if (this.hasSideWindows() === false) return detailBody;
		const width = Math.floor(detailBody.width / 2);
		return new Rectangle(detailBody.x, detailBody.y, width, detailBody.height);
	}
	/**
	* Creates every window extensions place beside the parameters, and adds them to tracking.
	*/
	createSideWindows() {
		const definitions = this.sideWindowDefinitions();
		const windows = definitions.map((definition, index) => {
			const rectangle = this.sideWindowRect(index, definitions.length);
			const window = definition.createWindow(rectangle);
			this.addWindow(window);
			return window;
		});
		this.setSideWindows(windows);
	}
	/**
	* Builds the rectangle for one side window: an equal share of the space beside the parameters.
	* @param {number} index The side window's place, from the top.
	* @param {number} count How many side windows share the space.
	* @returns {Rectangle}
	*/
	sideWindowRect(index, count) {
		const detailBody = this.detailBodyRect();
		const parametersRect = this.parametersWindowRect();
		const x = parametersRect.x + parametersRect.width;
		const width = detailBody.width - parametersRect.width;
		const height = Math.floor(detailBody.height / count);
		const y = detailBody.y + index * height;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Overrides {@link Scene_MenuFacetBase.hasHelpWindow}.<br/>
	* Declines the help strip across the top.
	*
	* Everything beside the list already opens with the highlighted class's own description, which is all a
	* help strip would have to say.
	* @returns {boolean}
	*/
	hasHelpWindow() {
		return false;
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* Describes the controls this scene responds to, which depend on how it was opened.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		const entries = [];
		if (this.isChangingAllowed()) {
			entries.push({
				semantic: "ok",
				label: "change class"
			});
		}
		entries.push({
			semantic: ["actor-prev", "actor-next"],
			label: "switch character"
		});
		entries.push({
			semantic: "cancel",
			label: "back"
		});
		return entries;
	}
	/**
	* Highlights the class the actor is standing in.
	*/
	selectCurrentClass() {
		const currentClass = this.actor().currentClass();
		this.classListWindow().selectExt(currentClass);
	}
	/**
	* Points every window beside the list at the highlighted class- or, for a class the actor has yet to
	* unlock, puts them all away, since a "???" row gives nothing about its class away.
	*/
	refreshDetails() {
		const highlightedClass = this.highlightedClass();
		if (ClassManager.isClassRevealed(this.actor(), highlightedClass.id) === false) {
			this.hideDetails();
			return;
		}
		this.showDetails(highlightedClass);
	}
	/**
	* Shows every window beside the list, each drawing the given class for whichever actor is being viewed.
	* @param {RPG_Class} dataClass The class to show.
	*/
	showDetails(dataClass) {
		this.detailWindows().forEach((window) => {
			window.show();
			window.showClass(this.actor(), dataClass.id);
		});
	}
	/**
	* Puts away every window beside the list.
	*/
	hideDetails() {
		this.detailWindows().forEach((window) => window.hide());
	}
	/**
	* Keeps everything beside the list on whichever class the cursor moved to.
	*/
	onClassHighlighted() {
		this.refreshDetails();
	}
	/**
	* Changes the actor into the highlighted class.
	*
	* The list only calls this once it has agreed the class can be changed into, so everything here is the
	* change itself and bringing the screen up to date with it.
	*/
	onClassOk() {
		const highlightedClass = this.highlightedClass();
		ClassManager.changeClass(this.actor(), highlightedClass.id);
		const listWindow = this.classListWindow();
		listWindow.refresh();
		listWindow.selectExt(highlightedClass);
		this.refreshDetails();
		listWindow.activate();
	}
	/**
	* Extends {@link #onActorChange}.<br/>
	* Also lists the new actor's classes, landing on the one they are standing in.
	*/
	onActorChange() {
		super.onActorChange();
		const listWindow = this.classListWindow();
		listWindow.setActor(this.actor());
		this.selectCurrentClass();
		this.refreshDetails();
		listWindow.activate();
	}
};

//#endregion
//#region src/plugins/class/core/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.<br/>
* Adds a handler for the class command.
*/
J.CLASS.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.CLASS.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("classes", this.commandClasses.bind(this));
};
/**
* Opens the class scene from the main menu.
*/
Scene_Menu.prototype.commandClasses = function() {
	Scene_Classes.callFromMenu();
};

//#endregion
//#region src/plugins/class/core/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.<br/>
* Adds the class command to the main menu's actor column.
*/
J.CLASS.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.CLASS.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	if (ClassManager.isMenuCommandVisible() === false) return;
	const command = this.buildClassesCommand();
	this.addBuiltCommand(command);
};
/**
* Builds the class command, which belongs to the actor column since every class is one actor's.
* @returns {BuiltWindowCommand}
*/
Window_MenuCommand.prototype.buildClassesCommand = function() {
	return new WindowCommandBuilder(J.CLASS.Metadata.commandName).setSymbol("classes").setHelpText("Review what each of this character's classes does and teaches.").setMenuSection(MenuSection.Actor).setIconIndex(J.CLASS.Metadata.commandIconIndex).build();
};

//#endregion
//#region src/plugins/class/core/_metadata/pluginCommands.js
/**
* Opens the class scene, either to change classes or only to look at them.
*
* This is how a game decides where classes change: open the scene with changing allowed from wherever
* that should happen, and from nowhere else.
*/
PluginManager.registerCommand(J.CLASS.Metadata.name, "call-scene", ({ allowChanging }) => {
	const isChangingAllowed = allowChanging === "true";
	Scene_Classes.callScene(isChangingAllowed);
});
/**
* Unlocks one or more classes for an actor, making them selectable in the class scene.
*/
PluginManager.registerCommand(J.CLASS.Metadata.name, "unlock-classes", ({ actorId, classIds }) => {
	const actor = $gameActors.actor(parseInt(actorId));
	const parsedClassIds = JSON.parse(classIds);
	parsedClassIds.forEach((classId) => actor.unlockClass(parseInt(classId)));
});

//#endregion
//#region src/plugins/class/core/registerClassSaveRoutes.js
/**
* Lifts this plugin's slice out of the actors that carry it and into its own section file.
*
* Without this the unlocked classes still save correctly- they simply ride inline on each actor, which is
* where every plugin's state lived before the router existed. Registering is what gives J-Classes a file
* of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and without it
* the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_class", "class");
}

//#endregion
//# sourceMappingURL=J-Classes.js.map