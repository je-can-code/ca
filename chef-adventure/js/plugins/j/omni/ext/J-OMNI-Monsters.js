//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.1 OMNI-MONSTER] Extends the Omnipedia with a Monsterpedia entry.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-DropsControl
 * @base J-Elementalistics
 * @base J-SDP
 * @base J-Omnipedia
 * @orderAfter J-HUD
 * @orderAfter J-HUD-TargetFrame
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the Omnipedia by adding a new entry: The Monsterpedia.
 *
 * Due to rendering a large amount of data, there are a number of other plugins
 * required to use this plugin:
 * - J-Base             : always required for my plugins.
 * - J-ABS              : enables the tracking of most data points.
 * - J-DropsControl     : renders loot drop data and tracking.
 * - J-Elementalistics  : renders elemental data and tracking.
 * - J-SDP              : renders SDP points earned and panel drop rate.
 * ============================================================================
 * MONSTERPEDIA ENTRY TAGS:
 * A handful of tags customize how an enemy appears (or doesn't) in the
 * Monsterpedia.
 *
 * TAG USAGE:
 * - Enemies
 *
 * TAG FORMAT:
 *  <hideFromMonsterpedia>
 *    Excludes this enemy entirely from the Monsterpedia entry list.
 *
 *  <monsterFamilyIcon:ICON_INDEX>
 *    Sets the icon index representing this enemy's monster family/category
 *    in the Monsterpedia listing.
 *
 *  <descriptionLine:TEXT>
 *    Adds one line of flavor-text description to this enemy's Monsterpedia
 *    detail view. Multiple tags on the same enemy each add another line.
 *
 * TAG EXAMPLES:
 *  <hideFromMonsterpedia>
 * This enemy (a story-only or hidden boss, perhaps) never appears in the
 * Monsterpedia listing.
 *
 *  <monsterFamilyIcon:64>
 * This enemy's family icon in the Monsterpedia listing is icon 64.
 *
 *  <descriptionLine:A lumbering beast of the northern peaks.>
 *  <descriptionLine:Known to hoard shiny objects.>
 * This enemy's Monsterpedia detail view shows both lines of description,
 * one per tag, in the order they appear on the note.
 * ============================================================================
 * CHANGELOG:
 * - 1.2.1
 *    The monsterpedia detail window no longer declares private members. A
 *    window's constructor reaches initialize, and through it the drawing
 *    hooks, before a derived class installs its own members- so anything
 *    private was being touched on an object that did not yet have it.
 * - 1.2.0
 *    The monsterpedia lookup cache is no longer written to savefiles. It held
 *    the same observations as the saveables it is built from, keyed by enemy
 *    id, which meant every observation the party had ever made was stored
 *    twice. It now rebuilds from the saveables on load.
 * - 1.1.0
 *    Added <hideFromMonsterpedia>, <monsterFamilyIcon:ICON_INDEX>, and
 *    repeatable <descriptionLine:TEXT> Monsterpedia entry tags.
 * - 1.0.2
 *    Consumed `RPGManager` updates.
 *    Fixed missed issue with SDP rendering.
 *    Adjusted monster detail view to accommodate fontsize 24 at 1080p.
 * - 1.0.1
 *    Added support for auto-generating target frame icons where applicable.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//#region src/plugins/omni/ext/monster/_metadata/_pluginMetadata.js
var J_OmniMonster_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps static command and switch metadata used by the monsterpedia entry.
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
		* The various data points that define the command for the Monsterpedia.
		*/
		this.Command = {
			Name: "Monsterpedia",
			Symbol: "monster-pedia",
			IconIndex: 14
		};
		/**
		* The id of the switch that will represent whether or not the command
		* should be visible in the Omnipedia menu.
		* @type {number}
		*/
		this.EnabledSwitch = 103;
	}
};

//#endregion
//#region src/plugins/omni/ext/monster/_metadata/initialization.js
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
	const requiredOmniVersion = "1.0.0";
	const hasOmniRequirement = J.BASE.Helpers.satisfies(J.OMNI.Metadata.version.version(), requiredOmniVersion);
	if (hasOmniRequirement === false) {
		throw new Error(`Either missing J-Omnipedia or has a lower version than the required: ${requiredOmniVersion}`);
	}
})();
/**
* The over-arching extensions collection for this plugin.
*/
J.OMNI.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.OMNI.EXT.MONSTER = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.OMNI.EXT.MONSTER.Metadata = new J_OmniMonster_PluginMetadata("J-OMNI-Monsters", "1.2.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.OMNI.EXT.MONSTER.Aliased = {};
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_Party = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_System = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Battler = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine = new Map();
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList = new Map();
/**
* All regular expressions used by this plugin.
*/
J.OMNI.EXT.MONSTER.RegExp = {};
J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia = /<hideFromMonsterpedia>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon = /<monsterFamilyIcon:[ ]?(\d+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription = /<descriptionLine:[ ]?([\w\s.?!,\-'"]+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaRegion = /<region:[ ]?([\w\s.?!,'"]+)>/i;

//#endregion
//#region src/plugins/omni/ext/monster/__models/MonsterpediaObservations.js
/**
* A monsterpedia entry of observations about a particular monster.
* This data drives the visibility of data within a given monsterpedia entry.
* Serialized into party save data via {@link JsonEx}; registered so bundled restores keep prototype methods.
*/
var MonsterpediaObservations = class {
	/**
	* Initialize a set of observations for a new enemy.
	* @param {number} enemyId The id of the enemy these observations are for.
	*/
	constructor(enemyId) {
		/**
		* The id of the monster in the monsterpedia.
		* @type {number}
		*/
		this.id = enemyId;
		this.initMembers();
	}
	/**
	* Initialize other observations that cannot be initialized with parameters.
	*/
	initMembers() {
		/**
		* The number of this monster that has been defeated by the player.
		* @type {number}
		*/
		this.numberDefeated = 0;
		/**
		* Whether or not the player knows the name of this monster.
		* When the name is unknown, it'll be masked.
		* @type {boolean}
		*/
		this.knowsName = false;
		/**
		* Whether or not the player knows the family this monster belongs to.
		* When the family is unknown, the icon will be omitted from the list and
		* the family will be masked in the detail.
		* @type {boolean}
		*/
		this.knowsFamily = true;
		/**
		* Whether or not the player knows the description of this monster.
		* When the description is unknown, it'll be masked.
		* @type {boolean}
		*/
		this.knowsDescription = false;
		/**
		* Whether or not the player knows the regions this monster is found in.
		* When the regions are unknown, it'll simply be blank.
		* @type {boolean}
		*/
		this.knowsRegions = false;
		/**
		* Whether or not the player knows the parameters of this monster.
		* When the parameters are unknown, they will be masked.
		* @type {boolean}
		*/
		this.knowsParameters = false;
		/**
		* Whether or not the player knows the ailmentalistics of this monster.
		* When the ailmentalistics are unknown, they will be masked.
		* @type {boolean}
		*/
		this.knowsAilmentalistics = false;
		/**
		* All drops observed to be lootable from this enemy.
		* @type {['i'|'w'|'a', number][]}
		*/
		this.knownDrops = [];
		/**
		* All element ids that have been observed in-action against this enemy.
		* @type {number[]}
		*/
		this.knownElementalistics = [];
	}
	/**
	* Adds an observed drop to this monster's observations.
	* @param {'i'|'w'|'a'} dropType The type of loot drop observed.
	* @param {number} dropId The id of the drop.
	*/
	addKnownDrop(dropType, dropId) {
		this.knownDrops.push([dropType, dropId]);
	}
	/**
	* Determines whether or not a given drop is known.
	* @param {'i'|'w'|'a'} dropType The type of drop this is.
	* @param {number} dropId The id of the drop.
	* @returns {boolean} True if the drop is known, false otherwise.
	*/
	isDropKnown(dropType, dropId) {
		const finder = (drop) => {
			const [type, id] = drop;
			if (type === dropType && id === dropId) return true;
			return false;
		};
		const found = this.knownDrops.find(finder, this);
		return !!found;
	}
	addKnownElementalistic(elementId) {
		this.knownElementalistics.push(elementId);
	}
	isElementalisticKnown(elementId) {
		return this.knownElementalistics.includes(elementId);
	}
};
SerializableRegistry.register(MonsterpediaObservations);

//#endregion
//#region src/plugins/omni/ext/monster/database/RPG_Enemy.js
/**
* Whether or not this enemy should be hidden from the monsterpedia.
* @type {boolean} True if the enemy should be hidden, false otherwise.
*/
Object.defineProperty(RPG_Enemy.prototype, "hideFromMonsterpedia", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia);
} });
/**
* The icon index of the monster family this enemy belongs to.
* @type {number}
*/
Object.defineProperty(RPG_Enemy.prototype, "monsterFamilyIcon", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon);
} });
/**
* The description of the enemy for the monsterpedia.
* @type {string[]}
*/
Object.defineProperty(RPG_Enemy.prototype, "monsterpediaDescription", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription);
} });

//#endregion
//#region src/plugins/omni/ext/monster/objects/Game_Enemy.js
/**
* Gets the {@link MonsterpediaObservations} associated with this enemy.
* If none exists yet, one will be initialized.
* @returns {MonsterpediaObservations}
*/
Game_Enemy.prototype.getMonsterPediaObservations = function() {
	return $gameParty.getOrCreateMonsterpediaObservationsById(this.battlerId());
};
/**
* Extends {@link #onDeath}.<br/>
* Also updates the monsterpedia observations for this enemy.
*/
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set("onDeath", Game_Enemy.prototype.onDeath);
Game_Enemy.prototype.onDeath = function() {
	J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get("onDeath").call(this);
	this.updateMonsterpediaObservation();
};
/**
* Updates the monsterpedia observation associated with this enemy on-death.
*/
Game_Enemy.prototype.updateMonsterpediaObservation = function() {
	this.incrementDefeatCount();
	this.learnMonsterpediaName();
	this.learnMonsterpediaFamily();
	this.learnMonsterpediaDescription();
	this.learnMonsterpediaParameters();
};
/**
* Increment the death counter for this particular enemy.
*/
Game_Enemy.prototype.incrementDefeatCount = function() {
	const observations = this.getMonsterPediaObservations();
	observations.numberDefeated++;
};
/**
* Enables the visibility of the enemy's name in the monsterpedia
* for this monster.
*/
Game_Enemy.prototype.learnMonsterpediaName = function() {
	const observations = this.getMonsterPediaObservations();
	observations.knowsName = true;
};
/**
* Enables the visibility of the enemy's family in the monsterpedia
* for this monster.
*/
Game_Enemy.prototype.learnMonsterpediaFamily = function() {
	const observations = this.getMonsterPediaObservations();
	observations.knowsFamily = true;
};
/**
* Enables the visibility of the enemy's description in the monsterpedia
* for this monster.
*/
Game_Enemy.prototype.learnMonsterpediaDescription = function() {
	const observations = this.getMonsterPediaObservations();
	observations.knowsDescription = true;
};
/**
* Enables the visibility of the enemy's parameters in the monsterpedia
* for this monster.
*/
Game_Enemy.prototype.learnMonsterpediaParameters = function() {
	const observations = this.getMonsterPediaObservations();
	observations.knowsParameters = true;
};
/**
* Extends {@link #postProcessDroppedLoot}.<br/>
* Also observes each drop dropped for monsterpedia purposes.
*
* Observes the **incoming** list rather than the returned one, deliberately. What arrives here is the
* loot as this enemy's database rows describe it; what leaves may have been promoted up a drop
* upgrade ladder into rows the enemy does not list at all. The pedia unmasks an enemy's own drop
* entries by their base ids, so a promoted row would both credit the wrong entry and leave the real
* one masked forever. The drop dropped- it merely also got upgraded on the way out.
* @param {RPG_BaseItem[]} itemsFound The loot that successfully dropped, before modifiers.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {RPG_BaseItem[]}
*/
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set("postProcessDroppedLoot", Game_Enemy.prototype.postProcessDroppedLoot);
Game_Enemy.prototype.postProcessDroppedLoot = function(itemsFound, killer = null) {
	itemsFound.forEach(this.observeDrop, this);
	return J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get("postProcessDroppedLoot").call(this, itemsFound, killer);
};
/**
* Observes a given drop, and records it in the monsterpedia if applicable.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} drop The drop to observe.
*/
Game_Enemy.prototype.observeDrop = function(drop) {
	const observations = this.getMonsterPediaObservations();
	const { kind: dropType, id: dropId } = drop;
	if (observations.isDropKnown(dropType, dropId)) return;
	observations.addKnownDrop(dropType, dropId);
};
/**
* Observes a given element, and records it in the monsterpedia if applicable.
* @param {number} elementId The element id to observe.
*/
Game_Enemy.prototype.observeElement = function(elementId) {
	const observations = this.getMonsterPediaObservations();
	if (observations.isElementalisticKnown(elementId)) return;
	observations.addKnownElementalistic(elementId);
};

//#endregion
//#region src/plugins/omni/ext/monster/objects/Game_Party.js
/**
* Extends {@link #initOmnipediaMembers}.<br/>
* Includes monsterpedia members.
*/
J.OMNI.EXT.MONSTER.Aliased.Game_Party.set("initOmnipediaMembers", Game_Party.prototype.initOmnipediaMembers);
Game_Party.prototype.initOmnipediaMembers = function() {
	J.OMNI.EXT.MONSTER.Aliased.Game_Party.get("initOmnipediaMembers").call(this);
	this.initMonsterpediaMembers();
};
/**
* Initialize members related to the omnipedia's monsterpedia.
*/
Game_Party.prototype.initMonsterpediaMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to the omnipedia.
	*/
	this._j._omni ||= {};
	/**
	* A collection of the current observations of all monsters perceived.
	* @type {MonsterpediaObservations[]}
	*/
	this._j._omni._monsterpediaObservationsSaveables = [];
	/**
	* A more friendly cache of monster observations to work with.
	* This is what is kept up-to-date until saving.
	*
	* This is keyed by the enemyId.
	* @type {Map<number, MonsterpediaObservations>}
	*/
	this._j._omni._monsterpediaObservationsCache = new Map();
};
/**
* Gets all monsterpedia observations perceived by the party.
* @returns {MonsterpediaObservations[]}
*/
Game_Party.prototype.getSavedMonsterpediaObservations = function() {
	return this._j._omni._monsterpediaObservationsSaveables;
};
/**
* Gets the cache of monsterpedia observations.
* The cache is keyed by enemyId.
* @returns {Map<number, MonsterpediaObservations>}
*/
Game_Party.prototype.getMonsterpediaObservationsCache = function() {
	return this._j._omni._monsterpediaObservationsCache;
};
/**
* Sets the cache of the monsterpedia observations.
* @param {Map<number, MonsterpediaObservations>} cache The cache to set over the old cache.
*/
Game_Party.prototype.setMonsterpediaObservationsCache = function(cache) {
	this._j._omni._monsterpediaObservationsCache = cache;
};
/**
* Updates the saveable monsterpedia observations collection with the latest
* from the running cache of observations.
*/
Game_Party.prototype.translateMonsterpediaCacheForSaving = function() {
	const saveableObservations = this.getSavedMonsterpediaObservations();
	const cache = this.getMonsterpediaObservationsCache();
	const forEacher = (observation, enemyId) => {
		saveableObservations[enemyId] = observation;
	};
	cache.forEach(forEacher, this);
};
/**
* Updates the monsterpedia observations cache with the data from the saveables.
*/
Game_Party.prototype.translateMonsterpediaSaveablesToCache = function() {
	const saveableObservations = this.getSavedMonsterpediaObservations();
	const cache = new Map();
	saveableObservations.forEach((observation, enemyId) => {
		if (!observation) return;
		cache.set(enemyId, observation);
	}, this);
	this.setMonsterpediaObservationsCache(cache);
};
/**
* Synchronizes the monsterpedia cache into the saveable datas.
*/
Game_Party.prototype.synchronizeMonsterpediaDataBeforeSave = function() {
	this.translateMonsterpediaCacheForSaving();
	this.translateMonsterpediaSaveablesToCache();
};
/**
* Synchronize the monsterpedia saveable datas into the cache.
*/
Game_Party.prototype.synchronizeMonsterpediaAfterLoad = function() {
	this.translateMonsterpediaSaveablesToCache();
	this.translateMonsterpediaCacheForSaving();
};
/**
* Gets or creates the monsterpedia observations for a given enemyId.
* @param {number} enemyId The id of the enemy to find observations for.
* @returns {MonsterpediaObservations} The observation for that enemyId.
*/
Game_Party.prototype.getOrCreateMonsterpediaObservationsById = function(enemyId) {
	const observations = this.getMonsterpediaObservationsCache();
	const foundObservation = observations.get(enemyId);
	if (foundObservation) {
		return foundObservation;
	}
	const createdObservations = new MonsterpediaObservations(enemyId);
	observations.set(enemyId, createdObservations);
	return createdObservations;
};

//#endregion
//#region src/plugins/omni/ext/monster/objects/Game_System.js
/**
* Update the saved data with the running cache.
*/
J.OMNI.EXT.MONSTER.Aliased.Game_System.set("onBeforeSave", Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function() {
	J.OMNI.EXT.MONSTER.Aliased.Game_System.get("onBeforeSave").call(this);
	$gameParty.synchronizeMonsterpediaDataBeforeSave();
};
/**
* Setup the caches to work with from the saved data.
*/
J.OMNI.EXT.MONSTER.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.OMNI.EXT.MONSTER.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameParty.synchronizeMonsterpediaAfterLoad();
};

//#endregion
//#region src/plugins/omni/ext/monster/objects/JABS_Battler.js
if (J.HUD && J.HUD.EXT.TARGET) {
	/**
	* Gets the target frame icon from the underlying character.
	* @returns {number}
	*/
	J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.set("getTargetFrameIcon", JABS_Battler.prototype.getTargetFrameIcon);
	JABS_Battler.prototype.getTargetFrameIcon = function() {
		const originalTargetFrameIcon = J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.get("getTargetFrameIcon").call(this);
		if (originalTargetFrameIcon !== 0) return originalTargetFrameIcon;
		const enemy = this.getBattler().enemy();
		const monsterFamilyIconIndex = enemy.monsterFamilyIcon;
		if (monsterFamilyIconIndex) {
			return monsterFamilyIconIndex;
		}
		return 0;
	};
}

//#endregion
//#region src/plugins/omni/ext/monster/managers/JABS_Engine.js
/**
* Processes the various on-hit effects against the target.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.set("processOnHitEffects", JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target) {
	J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.get("processOnHitEffects").call(this, action, target);
	if (target.isEnemy()) {
		this.processElementalisticObservations(action, target);
	}
};
/**
* Observes all elements associated with an action against a given enemy.
* @param {JABS_Action} action The action to observe elements for.
* @param {JABS_Battler} target The enemy target to observe elements against.
*/
JABS_Engine.prototype.processElementalisticObservations = function(action, target) {
	const baseSkill = action.getBaseSkill();
	const baseElement = baseSkill.damage.elementId;
	const elements = [];
	const addedElements = Game_Action.extractElementsFromAction(baseSkill);
	elements.push(...addedElements);
	const caster = action.getCaster();
	if (baseElement === -1) {
		elements.push(...caster.getBattler().attackElements());
	} else {
		elements.push(baseElement);
	}
	const enemy = target.getBattler();
	elements.forEach((elementId) => enemy.observeElement(elementId));
};

//#endregion
//#region src/plugins/omni/ext/monster/windows/Window_MonsterpediaList.js
/**
* A window containing the list of all enemies perceived for the monsterpedia.
*/
var Window_MonsterpediaList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of all observable monsters in this window.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all monsters to the list that can possibly be observed.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const enemies = [];
		const forEacher = (enemy) => {
			if (!this.isValidEnemy(enemy)) return;
			enemies.push(enemy);
		};
		$dataEnemies.forEach(forEacher, this);
		const commands = enemies.map(this.buildCommand, this);
		return commands;
	}
	/**
	* Determines whether or not the enemy is a valid enemy.
	* @param {RPG_Enemy} enemy The enemy database data.
	* @returns {boolean} True if the enemy should be listed in the monsterpedia, false otherwise.
	*/
	isValidEnemy(enemy) {
		if (!enemy) return false;
		if (!enemy.name) return false;
		if (enemy.hideFromMonsterpedia) return false;
		if (enemy.name.startsWith("===")) return false;
		return true;
	}
	/**
	* Builds a {@link BuiltWindowCommand} based on the enemy data.
	* @param {RPG_Enemy} enemy The enemy database data.
	* @returns {BuiltWindowCommand} The built command based on this enemy.
	*/
	buildCommand(enemy) {
		const { id, name } = enemy;
		const observations = $gameParty.getOrCreateMonsterpediaObservationsById(id);
		let enemyName = name;
		if (!observations.knowsName) {
			enemyName = J.BASE.Helpers.maskString(enemyName);
		}
		let enemyMonsterFamilyIconIndex = enemy.monsterFamilyIcon;
		if (!observations.knowsFamily || observations.numberDefeated === 0) {
			enemyMonsterFamilyIconIndex = 93;
		}
		return new WindowCommandBuilder(enemyName).setSymbol(`${id}-${name}`).setExtensionData(observations).setIconIndex(enemyMonsterFamilyIconIndex).build();
	}
};

//#endregion
//#region src/plugins/omni/ext/monster/windows/Window_MonsterpediaDetail.js
var Window_MonsterpediaDetail = class extends Window_Base {
	/**
	* The player's observations of the currently highlighted enemy.
	* @type {MonsterpediaObservations|null}
	*/
	_currentObservations = null;
	/**
	* A cache of all sprites associated with enemies in the monsterpedia.
	* @type {Map<number, Sprite_Enemy>}
	*/
	_battlerImageCache = new Map();
	/**
	* A cache of all sprites associated with base parameters.
	* @type {Map<number, Sprite_Icon>}
	*/
	_baseParameterIconCache = new Map();
	/**
	* A cache of all sprites associated with sp parameters.
	* @type {Map<number, Sprite_Icon>}
	*/
	_spParameterIconCache = new Map();
	/**
	* A cache of all sprites associated with ex parameters.
	* @type {Map<number, Sprite_Icon>}
	*/
	_exParameterIconCache = new Map();
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Gets the current enemy observations for this window.
	* @returns {MonsterpediaObservations|null}
	*/
	getObservations() {
		return this._currentObservations;
	}
	/**
	* Sets the current enemy observations for this window.
	* @param {MonsterpediaObservations} observations The observations driving this step.
	*/
	setObservations(observations) {
		this._currentObservations = observations;
	}
	/**
	* Gets the battler image cache.
	* @returns {Map<number, Sprite_Enemy>}
	*/
	getEnemyImageCache() {
		return this._battlerImageCache;
	}
	/**
	* Gets the b-parameter icon image cache.
	* @returns {Map<number, Sprite_Icon>}
	*/
	getBaseParameterIconCache() {
		return this._baseParameterIconCache;
	}
	/**
	* Gets the s-parameter icon image cache.
	* @returns {Map<number, Sprite_Icon>}
	*/
	getSpParameterIconCache() {
		return this._spParameterIconCache;
	}
	/**
	* Gets the x-parameter icon image cache.
	* @returns {Map<number, Sprite_Icon>}
	*/
	getExParameterIconCache() {
		return this._exParameterIconCache;
	}
	/**
	* Populates the sprite cache ahead of rendering.
	*/
	populateImageCache() {
		this.populateEnemySpriteImageCache();
		this.populateParameterIconSpriteCache();
	}
	/**
	* Caches all enemy battler sprites that have been at least perceived once.
	*/
	populateEnemySpriteImageCache() {
		const monsterpediaCache = $gameParty.getMonsterpediaObservationsCache();
		const forEacherEnemySprites = (_, enemyId) => this.getOrCreateEnemySprite(enemyId);
		monsterpediaCache.forEach(forEacherEnemySprites, this);
	}
	/**
	* Caches all sprites associated with parameters icons.
	*/
	populateParameterIconSpriteCache() {
		this.populateBaseParameterIconSpriteCache();
		this.populateSpParameterIconSpriteCache();
		this.populateExParameterIconSpriteCache();
	}
	/**
	* Caches all base parameter icon sprites.
	*/
	populateBaseParameterIconSpriteCache() {
		const bparamIds = Game_BattlerBase.knownBaseParameterIds().concat(30);
		const forEacher = (_, bParamId) => this.getOrCreateBaseParameterIconSprite(bParamId);
		bparamIds.forEach(forEacher, this);
	}
	/**
	* Caches all sp parameter icon sprites.
	*/
	populateSpParameterIconSpriteCache() {
		const sparamIds = Game_BattlerBase.knownSpParameterIds();
		const forEacher = (_, sParamId) => this.getOrCreateSpParameterIconSprite(sParamId);
		sparamIds.forEach(forEacher, this);
	}
	/**
	* Caches all ex parameter icon sprites.
	*/
	populateExParameterIconSpriteCache() {
		const xparamIds = Game_BattlerBase.knownExParameterIds();
		const forEacher = (_, xParamId) => this.getOrCreateExParameterIconSprite(xParamId);
		xparamIds.forEach(forEacher, this);
	}
	/**
	* Gets the enemy's sprite. If it is already cached, the cached one will be
	* returned, otherwise it'll be created and then cached.
	* @param {number} enemyId The id of the battler to retrieve the sprite for.
	* @returns {Sprite_Enemy}
	*/
	getOrCreateEnemySprite(enemyId) {
		const cache = this.getEnemyImageCache();
		if (cache.has(enemyId)) {
			return cache.get(enemyId);
		}
		const battler = new Game_Enemy(enemyId, 0, 0);
		const sprite = new Sprite_Enemy(battler);
		cache.set(enemyId, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Gets the base parameter icon sprite. If it is already cached, the cached one will be
	* returned, otherwise it'll be created and then cached.
	* @param {number} bParamId The id of the parameter to retrieve the sprite for.
	* @returns {Sprite_Icon}
	*/
	getOrCreateBaseParameterIconSprite(bParamId) {
		const cache = this.getBaseParameterIconCache();
		if (cache.has(bParamId)) {
			return cache.get(bParamId);
		}
		const iconIndex = bParamId === 30 ? IconManager.maxTp() : IconManager.param(bParamId);
		const sprite = new Sprite_Icon(iconIndex);
		cache.set(bParamId, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Gets the sp parameter icon sprite. If it is already cached, the cached one will be
	* returned, otherwise it'll be created and then cached.
	* @param {number} sParamId The id of the parameter to retrieve the sprite for.
	* @returns {Sprite_Icon}
	*/
	getOrCreateSpParameterIconSprite(sParamId) {
		const cache = this.getSpParameterIconCache();
		if (cache.has(sParamId)) {
			return cache.get(sParamId);
		}
		const iconIndex = IconManager.sparam(sParamId);
		const sprite = new Sprite_Icon(iconIndex);
		cache.set(sParamId, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Gets the ex parameter icon sprite. If it is already cached, the cached one will be
	* returned, otherwise it'll be created and then cached.
	* @param {number} xParamId The id of the parameter to retrieve the sprite for.
	* @returns {Sprite_Icon}
	*/
	getOrCreateExParameterIconSprite(xParamId) {
		const cache = this.getExParameterIconCache();
		if (cache.has(xParamId)) {
			return cache.get(xParamId);
		}
		const iconIndex = IconManager.xparam(xParamId);
		const sprite = new Sprite_Icon(iconIndex);
		cache.set(xParamId, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Extends {@link #clearContent}.<br/>
	* Also hides all cached images.
	*/
	clearContent() {
		super.clearContent();
		const cache = this.getEnemyImageCache();
		cache.forEach((sprite) => sprite.hide());
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws a header and some detail for the omnipedia list header.
	*/
	drawContent() {
		const observations = this.getObservations();
		if (!observations) return;
		const [x, y] = [0, 0];
		const lh = this.lineHeight();
		const defeatedY = y + 4;
		this.drawEnemyDefeat(x, defeatedY);
		const enemyNameX = x + 100;
		this.drawEnemyName(enemyNameX, y);
		const enemySpriteY = y + lh * 3;
		this.drawEnemySprite(x, enemySpriteY);
		const parametersX = this.width - 300;
		this.drawEnemyParameters(parametersX, y);
		const dropsX = this.width - 600;
		this.drawEnemyDrops(dropsX, y);
		const descriptionY = this.height - lh * 6;
		this.drawDescription(x, descriptionY);
		this.drawElementalistics();
	}
	/**
	* Draws the enemy defeat information at the location.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyDefeat(x, y) {
		const valueX = x + 12;
		this.drawEnemyDefeatCountValue(valueX, y);
		const keyY = y - 14;
		this.drawEnemyDefeatCountKey(x, keyY);
	}
	/**
	* Draws the enemy's defeated count value at the given point.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyDefeatCountValue(x, y) {
		this.resetFontSettings();
		this.modFontSize(6);
		const { numberDefeated } = this.getObservations();
		const paddedNumberDefeated = numberDefeated.padZero(4);
		const textWidth = this.textWidth(paddedNumberDefeated);
		this.drawText(`${paddedNumberDefeated}`, x, y, textWidth, Window_Base.TextAlignments.Left);
	}
	/**
	* Draws the enemy's defeated count key at the given point.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyDefeatCountKey(x, y) {
		this.resetFontSettings();
		this.modFontSize(-10);
		this.toggleItalics(true);
		const defeatCounterText = "DEFEATED";
		const textWidth = this.textWidth(defeatCounterText);
		this.drawText(defeatCounterText, x, y, textWidth, Window_Base.TextAlignments.Left);
	}
	/**
	* Draws the enemy's name at the given point.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyName(x, y) {
		this.resetFontSettings();
		this.modFontSize(14);
		this.toggleBold(true);
		const { id, knowsName } = this.getObservations();
		const databaseEnemy = $dataEnemies.at(id);
		const { name } = databaseEnemy;
		const possiblyMaskedName = knowsName ? name : J.BASE.Helpers.maskString(name);
		const textWidth = this.textWidth(name);
		this.drawText(possiblyMaskedName, x, y, textWidth, Window_Base.TextAlignments.Left);
	}
	/**
	* Draws the enemy's battler sprite at the given point.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemySprite(x, y) {
		const { id, numberDefeated } = this.getObservations();
		if (numberDefeated < 1) return;
		const sprite = this.getOrCreateEnemySprite(id);
		let homeX = x + sprite.width;
		const homeY = y + sprite.height;
		if (sprite.width > 300) {
			const xModifier = sprite.width * .4;
			homeX -= xModifier;
		}
		sprite.setHome(homeX, homeY);
		sprite.show();
	}
	/**
	* Draws the primary parameters of the enemy.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyParameters(x, y) {
		const lh = this.lineHeight() - 10;
		this.drawLevelParameter(x, y);
		const resourcesY = lh * 2;
		this.drawResourceParameters(x, resourcesY);
		const parametersY = lh * 6;
		this.drawCoreParameters(x, parametersY);
	}
	/**
	* Draws the level of the enemy.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawLevelParameter(x, y) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const { id, knowsParameters } = this.getObservations();
		const gameEnemy = $gameEnemies.enemy(id);
		const { level } = gameEnemy;
		this.drawEnemyParameter(x, y, IconManager.level(), TextManager.level, level, !knowsParameters, 4);
	}
	/**
	* Draws the resource parameters of the enemy, such as HP/MP/TP.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawResourceParameters(x, y) {
		this.resetFontSettings();
		const lh = this.lineHeight() - 10;
		this.modFontSize(-6);
		const { id, knowsParameters } = this.getObservations();
		const gameEnemy = $gameEnemies.enemy(id);
		const { mhp, mmp, mtp } = gameEnemy;
		const maxRemover = (parameterName) => {
			return parameterName.replace("Max ", String.empty);
		};
		const resourceNameValueTighten = -14;
		const maxHpName = maxRemover(TextManager.param(0));
		this.drawEnemyParameter(x, y, IconManager.param(0), maxHpName, mhp, !knowsParameters, 6, resourceNameValueTighten);
		const maxMpName = maxRemover(TextManager.param(1));
		const maxMpXPlus = 12;
		const maxMpYPlus = lh * 1;
		this.drawEnemyParameter(x + maxMpXPlus, y + maxMpYPlus, IconManager.param(1), maxMpName, mmp, !knowsParameters, 6, resourceNameValueTighten);
		const maxTpName = maxRemover(TextManager.maxTp());
		const maxTpXPlus = 24;
		const maxTpYPlus = lh * 2;
		this.drawEnemyParameter(x + maxTpXPlus, y + maxTpYPlus, IconManager.maxTp(), maxTpName, mtp, !knowsParameters, 6, resourceNameValueTighten);
	}
	/**
	* Draws the core parameters of the enemy, such as atk/def/mat/mdf/agi/luk.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawCoreParameters(x, y) {
		this.resetFontSettings();
		const lh = this.lineHeight() - 10;
		this.modFontSize(-4);
		const { id, knowsParameters } = this.getObservations();
		const gameEnemy = $gameEnemies.enemy(id);
		const { atk, def, pdr, mat, mdf, mdr, agi, hit, cnt, luk, cri, cev } = gameEnemy;
		const leftColumnX = 8;
		const atkXPlus = leftColumnX;
		this.drawEnemyParameter(x + atkXPlus, y, IconManager.param(2), TextManager.param(2), atk, !knowsParameters, 4);
		const defXPlus = leftColumnX + 8;
		const defYPlus = lh * 1;
		this.drawEnemyParameter(x + defXPlus, y + defYPlus, IconManager.param(3), TextManager.param(3), def, !knowsParameters, 4);
		const pdrXPlus = leftColumnX + 8;
		const pdrYPlus = lh * 2;
		const pdrValue = Math.round(pdr * 100 - 100);
		this.drawEnemyParameter(x + pdrXPlus, y + pdrYPlus, IconManager.sparam(6), TextManager.sparam(6), pdrValue, !knowsParameters, 3);
		const matXPlus = leftColumnX;
		const matYPlus = lh * 3;
		this.drawEnemyParameter(x + matXPlus, y + matYPlus, IconManager.param(4), TextManager.param(4), mat, !knowsParameters, 4);
		const mdfXPlus = leftColumnX + 8;
		const mdfYPlus = lh * 4;
		this.drawEnemyParameter(x + mdfXPlus, y + mdfYPlus, IconManager.param(5), TextManager.param(5), mdf, !knowsParameters, 4);
		const mdrXPlus = leftColumnX + 8;
		const mdrYPlus = lh * 5;
		const mdrValue = Math.round(mdr * 100 - 100);
		this.drawEnemyParameter(x + mdrXPlus, y + mdrYPlus, IconManager.sparam(7), TextManager.sparam(7), mdrValue, !knowsParameters, 3);
		const agiXPlus = leftColumnX;
		const agiYPlus = lh * 6;
		this.drawEnemyParameter(x + agiXPlus, y + agiYPlus, IconManager.param(6), TextManager.param(6), agi, !knowsParameters, 4);
		const hitXPlus = leftColumnX + 8;
		const hitYPlus = lh * 7;
		const hitValue = Math.round(hit * 100);
		this.drawEnemyParameter(x + hitXPlus, y + hitYPlus, IconManager.xparam(0), TextManager.xparam(0), hitValue, !knowsParameters, 4);
		const cntXPlus = leftColumnX + 8;
		const cntYPlus = lh * 8;
		const cntValue = Math.round(cnt * 100);
		this.drawEnemyParameter(x + cntXPlus, y + cntYPlus, IconManager.xparam(6), TextManager.xparam(6), cntValue, !knowsParameters, 3);
		const lukXPlus = leftColumnX;
		const lukYPlus = lh * 9;
		this.drawEnemyParameter(x + lukXPlus, y + lukYPlus, IconManager.param(7), TextManager.param(7), luk, !knowsParameters, 4);
		const criXPlus = leftColumnX + 8;
		const criYPlus = lh * 10;
		const criValue = Math.round(cri * 100);
		this.drawEnemyParameter(x + criXPlus, y + criYPlus, IconManager.xparam(2), TextManager.xparam(2), criValue, !knowsParameters, 4);
		const cevXPlus = leftColumnX + 8;
		const cevYPlus = lh * 11;
		const cevValue = Math.round(cev * 100);
		this.drawEnemyParameter(x + cevXPlus, y + cevYPlus, IconManager.xparam(3), TextManager.xparam(3), cevValue, !knowsParameters, 4);
	}
	/**
	* Draws the enemy parameter with the given data at the designated point's coordinates.
	*
	* If the parameter name is {@link String.empty}, the name will be omitted entirely from drawing.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	* @param {number} iconIndex The icon index of the parameter.
	* @param {string} parameterName The name of the parameter.
	* @param {number|string} parameterValue The numeric or preformatted value of the parameter.
	* @param {boolean=} maskValue Whether or not to mask the parameter value; defaults to false.
	* @param {number=} padZeroCount The digits to pad to when {@link parameterValue} is numeric; defaults to 8.
	* @param {number=} spacePlus Additional space to add between the name and value of this parameter.
	* @param {number=} valueColorIndex Palette index for significant digits; defaults to 0.
	*/
	drawEnemyParameter(x, y, iconIndex, parameterName, parameterValue, maskValue = false, padZeroCount = 8, spacePlus = 0, valueColorIndex = 0) {
		this.drawIcon(iconIndex, x, y);
		const iconWidthPadding = iconIndex === 0 ? 0 : 40;
		const nameValueSpace = 48 + spacePlus;
		const parameterNameX = x + iconWidthPadding;
		const parameterNameWidth = parameterName !== String.empty ? 300 : 0;
		let parameterValueX = parameterNameX + 48;
		if (parameterName !== String.empty) {
			this.toggleBold(true);
			this.drawText(`${parameterName}`, parameterNameX, y, parameterNameWidth, Window_Base.TextAlignments.Left);
			this.toggleBold(false);
			parameterValueX += nameValueSpace;
		}
		const displayValue = maskValue ? J.BASE.Helpers.maskString(parameterValue.padZero(padZeroCount)) : parameterValue.padZero(padZeroCount);
		const parameterValueWidth = parameterName !== String.empty ? 128 : this.textWidth(displayValue);
		this.drawEnemyParameterValue(parameterValueX, y, displayValue, parameterValueWidth, valueColorIndex);
	}
	/**
	* Draws an enemy's parameter value.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	* @param {string} value The stringified parameter value, possibly masked.
	* @param {number} width The width to work with.
	* @param {number=} valueColorIndex Palette index for significant digits; defaults to 0.
	*/
	drawEnemyParameterValue(x, y, value, width, valueColorIndex = 0) {
		this.drawStyledPaddedValue(x, y, value, width, 8, valueColorIndex);
	}
	/**
	* Draws the list of an enemy's potential loot drops.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawEnemyDrops(x, y) {
		const lh = this.lineHeight() - 10;
		this.drawBasicRewards(x, y);
		const sdpYPlus = lh * 4;
		this.drawSdpDrop(x, sdpYPlus);
		const dropsYPlus = lh * 6;
		this.drawStandardDrops(x, dropsYPlus);
	}
	/**
	* Draws the basic rewards such as exp/gold/sdp.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawBasicRewards(x, y) {
		this.resetFontSettings();
		this.modFontSize(0);
		const lh = this.lineHeight() - 10;
		const observations = this.getObservations();
		const { id, knowsParameters } = observations;
		const gameEnemy = $gameEnemies.enemy(id);
		const expIcon = IconManager.rewardParam(0);
		const expName = TextManager.rewardParam(0);
		const expValue = gameEnemy.exp();
		this.drawEnemyParameter(x, y, expIcon, expName, expValue, !knowsParameters, 0);
		const goldIcon = IconManager.rewardParam(1);
		const goldName = TextManager.rewardParam(1);
		const goldValue = gameEnemy.gold();
		const goldYPlus = lh * 1;
		this.drawEnemyParameter(x, y + goldYPlus, goldIcon, goldName, goldValue, !knowsParameters, 0);
		const sdpIcon = IconManager.rewardParam(4);
		const sdpName = TextManager.sdpPoints();
		const sdpValue = gameEnemy.sdpPoints();
		const sdpYPlus = lh * 2;
		this.drawEnemyParameter(x, y + sdpYPlus, sdpIcon, sdpName, sdpValue, !knowsParameters, 0);
	}
	/**
	* Draws the sdp drop.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawSdpDrop(x, y) {
		this.resetFontSettings();
		this.modFontSize(-6);
		const observations = this.getObservations();
		const { id, knowsParameters } = observations;
		const gameEnemy = $gameEnemies.enemy(id);
		const sdpDropData = gameEnemy.getSdpDropData();
		if (sdpDropData === null || sdpDropData.at(0) === String.empty) {
			const noSdpDropsText = `No SDP to unlock.`;
			const noSdpDropsTextWidth = this.textWidth(noSdpDropsText);
			this.drawText(noSdpDropsText, x, y, noSdpDropsTextWidth);
			return;
		}
		const [sdpKey, sdpDropChance] = sdpDropData;
		const panel = J.SDP.Metadata.panelsMap.get(sdpKey);
		if (!panel) return;
		let dropText = `${sdpDropChance}%`;
		if (panel.isUnlocked()) {
			dropText = `✅`;
		}
		const panelName = knowsParameters ? panel.name : J.BASE.Helpers.maskString(panel.name);
		this.drawEnemyParameter(x, y, panel.iconIndex, panelName, dropText, false, 0, 20);
	}
	/**
	* Draws the standard list of all loot that this enemy can drop.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawStandardDrops(x, y) {
		this.resetFontSettings();
		const lh = this.lineHeight() - 10;
		this.modFontSize(-6);
		const observations = this.getObservations();
		const { id, numberDefeated } = observations;
		const gameEnemy = $gameEnemies.enemy(id);
		const drops = gameEnemy.getDropItems();
		if (!drops.length) {
			const noDropsText = `No standard drops to acquire.`;
			const noDropsTextWidth = this.textWidth(noDropsText);
			this.drawText(noDropsText, x, y, noDropsTextWidth);
			return;
		}
		let numberSkipped = 0;
		const forEacher = (drop, index) => {
			if (this.isSkippableDrop(drop)) {
				numberSkipped++;
				return;
			}
			const implementation = drop.toImplementation();
			const { dataId: dropId, denominator: dropChance, kind: dropType } = drop;
			const isDropKnown = observations.isDropKnown(dropType, dropId) || numberDefeated > 100;
			const dropIcon = isDropKnown ? implementation.iconIndex : 93;
			const dropName = isDropKnown ? implementation.name : J.BASE.Helpers.maskString(implementation.name);
			const dropYPlus = (index - numberSkipped) * lh;
			this.drawEnemyParameter(x, y + dropYPlus, dropIcon, dropName, `${dropChance}%`, false, 4);
		};
		drops.forEach(forEacher, this);
	}
	/**
	* Determines whether or not the drop should be drawn in the monsterpedia.
	* @param {RPG_DropItem} drop The drop to inspect.
	* @returns {boolean} True if this drop should be skipped, false otherwise.
	*/
	isSkippableDrop(drop) {
		if (drop.isSdpDrop()) return true;
		if (drop.kind === RPG_DropItem.Types.Item) {
			return this.skippableItemIds().includes(drop.dataId);
		}
		if (drop.kind === RPG_DropItem.Types.Weapon) {
			return this.skippableWeaponIds().includes(drop.dataId);
		}
		if (drop.kind === RPG_DropItem.Types.Armor) {
			return this.skippableArmorIds().includes(drop.dataId);
		}
		return true;
	}
	/**
	* A list of item ids that shouldn't be drawn in the list of loot.
	* @returns {number[]}
	*/
	skippableItemIds() {
		return [
			2,
			3,
			4,
			8,
			9
		];
	}
	/**
	* A list of weapon ids that shouldn't be drawn in the list of loot.
	* @returns {number[]}
	*/
	skippableWeaponIds() {
		return [];
	}
	/**
	* A list of armor ids that shouldn't be drawn in the list of loot.
	* @returns {number[]}
	*/
	skippableArmorIds() {
		return [];
	}
	/**
	* Draws the description text of an enemy.
	* @param {number} x The x coordinate of the point.
	* @param {number} y The y coordinate of the point.
	*/
	drawDescription(x, y) {
		this.resetFontSettings();
		const lh = this.lineHeight() - 10;
		const observations = this.getObservations();
		const { id, knowsDescription } = observations;
		const { monsterpediaDescription } = $dataEnemies.at(id);
		this.modFontSize(-4);
		if (!monsterpediaDescription.length) {
			const missingDescriptionText = "There is no description for this enemy.";
			const missingDescriptionTextWidth = this.textWidth(missingDescriptionText);
			this.drawText(missingDescriptionText, x, y, missingDescriptionTextWidth);
			return;
		}
		monsterpediaDescription.forEach((line, index) => {
			const lineText = knowsDescription ? line : J.BASE.Helpers.maskString(line);
			const lineY = y + lh * index;
			const lineWidth = this.textWidth(lineText);
			this.drawText(lineText, x, lineY, lineWidth);
		});
	}
	/**
	* Draws damage-type elementalistics plus prefixed taxonomy rows (`vs ` / `x ` / `tool-`).
	* Damage types render in a column shifted left; family/traits/tools use the original right-hand x so the block
	* does not grow upward into the parameter stack when multiple taxonomy lines exist.
	* Both columns share the same top row so taxonomy reads downward beside Cut through Typeless.
	* Taxonomy rows only appear when the effective rate differs from 100% (same signal as the Aptitude typed extension).
	*/
	drawElementalistics() {
		this.resetFontSettings();
		const lh = this.lineHeight() - 10;
		const damageColumnOffset = 280;
		const observations = this.getObservations();
		const { id } = observations;
		const gameEnemy = $gameEnemies.enemy(id);
		this.modFontSize(-4);
		const taxonomy = this.collectMonsterpediaTaxonomyRows(gameEnemy);
		const taxonomyLineCount = this.countMonsterpediaTaxonomyDrawLines(taxonomy);
		const damageTypeCount = 10;
		const blockRowCount = Math.max(damageTypeCount, taxonomyLineCount);
		const descriptionTop = this.height - this.lineHeight() * 6;
		const elemBlockBottom = descriptionTop - lh;
		let yTop = elemBlockBottom - lh * blockRowCount;
		if (yTop < 48) {
			yTop = 48;
		}
		const taxonomyColumnX = this.width - 300;
		const damageColumnX = taxonomyColumnX - damageColumnOffset;
		const damageStartRow = 0;
		const taxonomyStartRow = 0;
		this.drawMonsterpediaTaxonomySections(taxonomyColumnX, yTop, lh, taxonomyStartRow, observations, taxonomy);
		const damageElementIds = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10
		];
		damageElementIds.forEach((elementId, index) => {
			const row = damageStartRow + index;
			this.drawMonsterpediaDamageElementRow(damageColumnX, yTop, lh, row, observations, elementId);
		});
	}
	/**
	* Collects non-neutral prefixed element rows for monsterpedia display.
	* @param {Game_Enemy} gameEnemy The enemy instance to inspect.
	* @returns {{
	*   vs: {elementId: number, label: string, rate: number}[],
	*   x: {elementId: number, label: string, rate: number}[],
	*   tool: {elementId: number, label: string, rate: number}[]
	* }}
	*/
	collectMonsterpediaTaxonomyRows(gameEnemy) {
		const names = $dataSystem.elements;
		const vs = [];
		const xList = [];
		const tool = [];
		for (let elementId = 1; elementId < names.length; elementId++) {
			const rawName = names[elementId];
			if (!rawName) continue;
			const trimmed = String(rawName).trim();
			const low = trimmed.toLowerCase();
			let bucket = null;
			if (low.startsWith("vs ")) {
				bucket = vs;
			} else if (low.startsWith("x ")) {
				bucket = xList;
			} else if (low.startsWith("tool-")) {
				bucket = tool;
			}
			if (bucket === null) continue;
			const rate = Math.round(gameEnemy.elementRate(elementId) * 100);
			if (rate === 100) continue;
			let label = trimmed;
			if (low.startsWith("vs ")) {
				label = trimmed.slice(3).trim();
			} else if (low.startsWith("x ")) {
				label = trimmed.slice(2).trim();
			} else if (low.startsWith("tool-")) {
				label = trimmed.slice("tool-".length).trim();
			}
			bucket.push({
				elementId,
				label,
				rate
			});
		}
		const byElementId = (a, b) => a.elementId - b.elementId;
		vs.sort(byElementId);
		xList.sort(byElementId);
		tool.sort(byElementId);
		return {
			vs,
			x: xList,
			tool
		};
	}
	/**
	* Counts drawable lines for taxonomy sections, including one header line per non-empty bucket.
	* @param {{ vs: object[], x: object[], tool: object[] }} taxonomy The grouped taxonomy rows.
	* @returns {number}
	*/
	countMonsterpediaTaxonomyDrawLines(taxonomy) {
		let lines = 0;
		if (taxonomy.vs.length > 0) {
			lines += 1 + taxonomy.vs.length;
		}
		if (taxonomy.x.length > 0) {
			lines += 1 + taxonomy.x.length;
		}
		if (taxonomy.tool.length > 0) {
			lines += 1 + taxonomy.tool.length;
		}
		return lines;
	}
	/**
	* Draws taxonomy headers and rows, advancing the shared row cursor.
	* @param {number} x The x coordinate of the column.
	* @param {number} y The top y of the whole elementalistics block.
	* @param {number} lh The line height to use.
	* @param {number} row The starting row index within the block.
	* @param {MonsterpediaObservations} observations The active observations.
	* @param {{ vs: object[], x: object[], tool: object[] }} taxonomy The grouped taxonomy rows.
	* @returns {number} The next row index after drawing taxonomy content.
	*/
	drawMonsterpediaTaxonomySections(x, y, lh, row, observations, taxonomy) {
		let r = row;
		r = this.drawMonsterpediaTaxonomyBucket(x, y, lh, r, observations, taxonomy.vs, "Family");
		r = this.drawMonsterpediaTaxonomyBucket(x, y, lh, r, observations, taxonomy.x, "Traits");
		r = this.drawMonsterpediaTaxonomyBucket(x, y, lh, r, observations, taxonomy.tool, "Tools");
		return r;
	}
	/**
	* Draws one taxonomy bucket (header + rows) when it has content.
	* @param {number} x The x coordinate of the column.
	* @param {number} y The top y of the whole elementalistics block.
	* @param {number} lh The line height to use.
	* @param {number} row The starting row index within the block.
	* @param {MonsterpediaObservations} observations The active observations.
	* @param {{ elementId: number, label: string, rate: number }[]} rows The rows to render.
	* @param {string} headerText The section title.
	* @returns {number} The next row index after this bucket.
	*/
	drawMonsterpediaTaxonomyBucket(x, y, lh, row, observations, rows, headerText) {
		if (rows.length === 0) return row;
		let cursor = row;
		this.resetFontSettings();
		this.modFontSize(-8);
		this.toggleItalics(true);
		const headerWidth = this.textWidth(headerText);
		this.drawText(headerText, x, y + lh * cursor, headerWidth, Window_Base.TextAlignments.Left);
		this.toggleItalics(false);
		cursor += 1;
		rows.forEach((entry) => {
			const { elementId, label, rate } = entry;
			this.drawMonsterpediaTaxonomyElementRow(x, y, lh, cursor, observations, elementId, label, rate);
			cursor += 1;
		});
		return cursor;
	}
	/**
	* Draws a single taxonomy row with icon, shortened label, and resist text.
	* @param {number} x The x coordinate of the column.
	* @param {number} y The top y of the whole elementalistics block.
	* @param {number} lh The line height to use.
	* @param {number} row The row index within the block.
	* @param {MonsterpediaObservations} observations The active observations.
	* @param {number} elementId The database element id.
	* @param {string} label The display label (prefix stripped).
	* @param {number} rate The rounded percent rate.
	*/
	drawMonsterpediaTaxonomyElementRow(x, y, lh, row, observations, elementId, label, rate) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const elementIcon = IconManager.element(elementId);
		const gameEnemy = $gameEnemies.enemy(observations.id);
		const absorbed = J.ELEM && gameEnemy.isElementAbsorbed(elementId);
		const affiliationFlags = {
			absorbed,
			immune: absorbed === false && rate <= 0
		};
		const { knowsParameters } = observations;
		const resolved = AffiliationDisplay.resolveDisplay(rate, affiliationFlags);
		let displayRate = resolved.value;
		let valueColorIndex = resolved.colorIndex;
		if (knowsParameters === false) {
			displayRate = J.BASE.Helpers.maskString(AffiliationDisplay.maskTemplate);
			valueColorIndex = 0;
		}
		this.drawEnemyParameter(x, y + lh * row, elementIcon, label, displayRate, false, 4, 0, valueColorIndex);
		this.changeTextColor(ColorManager.normalColor());
	}
	/**
	* Draws one standard damage-type row (observed via combat hits).
	* @param {number} x The x coordinate of the column.
	* @param {number} y The top y of the whole elementalistics block.
	* @param {number} lh The line height to use.
	* @param {number} row The row index within the block.
	* @param {MonsterpediaObservations} observations The active observations.
	* @param {number} elementId The database element id.
	*/
	drawMonsterpediaDamageElementRow(x, y, lh, row, observations, elementId) {
		this.resetFontSettings();
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.normalColor());
		const gameEnemy = $gameEnemies.enemy(observations.id);
		const elementIcon = IconManager.element(elementId);
		const elementName = TextManager.element(elementId);
		const magnitudePercent = Math.round(Math.abs(gameEnemy.elementRate(elementId)) * 100);
		const absorbed = J.ELEM && gameEnemy.isElementAbsorbed(elementId);
		const affiliationFlags = {
			absorbed,
			immune: absorbed === false && magnitudePercent <= 0
		};
		const knowsElementalistic = observations.isElementalisticKnown(elementId);
		const resolved = AffiliationDisplay.resolveDisplay(magnitudePercent, affiliationFlags);
		let displayRate = resolved.value;
		let valueColorIndex = resolved.colorIndex;
		if (knowsElementalistic === false) {
			displayRate = J.BASE.Helpers.maskString(AffiliationDisplay.maskTemplate);
			valueColorIndex = 0;
		}
		this.drawEnemyParameter(x, y + lh * row, elementIcon, elementName, displayRate, false, 4, 0, valueColorIndex);
		this.changeTextColor(ColorManager.normalColor());
	}
};

//#endregion
//#region src/plugins/omni/ext/monster/scenes/Scene_Monsterpedia.js
/**
* A scene for interacting with the Monsterpedia.
*/
var Scene_Monsterpedia = class extends Scene_MenuBase {
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* A debug function that unlocks everything in the monsterpedia.
	*/
	static unlockAllMonsterpediaEntries() {
		const forEacher = (enemy) => {
			if (!enemy) return;
			const gameEnemy = $gameEnemies.enemy(enemy.id);
			gameEnemy.updateMonsterpediaObservation();
			const observations = $gameParty.getOrCreateMonsterpediaObservationsById(enemy.id);
			const allDrops = gameEnemy.getDropItems();
			allDrops.forEach((drop) => observations.addKnownDrop(drop.kind, drop.dataId), this);
			[
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10
			].forEach((id) => observations.addKnownElementalistic(id), this);
		};
		$dataEnemies.forEach(forEacher, this);
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
	* Also initializes all properties for our omnipedia.
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
		* A grouping of all properties associated with the omnipedia.
		*/
		this._j._omni = {};
	}
	/**
	* The primary properties of the scene are the initial properties associated with
	* the main list containing all pedias unlocked by the player along with some subtext of
	* what the pedia entails.
	*/
	initPrimaryMembers() {
		/**
		* A grouping of all properties associated with the monsterpedia.
		* The monsterpedia is a subcategory of the omnipedia..
		*/
		this._j._omni._monster = {};
		/**
		* The window that shows the list of percieved monsters.
		* @type {Window_MonsterpediaList}
		*/
		this._j._omni._monster._pediaList = null;
		/**
		* The window that shows the details observed of a perceived monster.
		* @type {Window_MonsterpediaDetail}
		*/
		this._j._omni._monster._pediaDetail = null;
		/**
		* The window that shows the teriary information of a perceived monster.
		* @type {Window_MonsterpediaList}
		*/
		this._j._omni._monster._pediaHelp = null;
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
	* Creates all monsterpedia windows.
	*/
	createAllWindows() {
		this.createMonsterpediaListWindow();
		this.createMonsterpediaDetailWindow();
		const listWindow = this.getMonsterpediaListWindow();
		listWindow.onIndexChange();
	}
	/**
	* Overwrites {@link Scene_MenuBase.prototype.createBackground}.<br/>
	* Changes the filter to a different type from {@link PIXI.filters}.
	*/
	createBackground() {
		this.setBackgroundFilter(new PIXI.filters.AlphaFilter(.1));
		this.setBackgroundSprite(new Sprite());
		this.backgroundSprite().bitmap = SceneManager.backgroundBitmap();
		this.backgroundSprite().filters = [this.backgroundFilter()];
		this.addChild(this.backgroundSprite());
	}
	/**
	* Creates the list of monsters the player has perceived.
	*/
	createMonsterpediaListWindow() {
		const window = this.buildMonsterpediaListWindow();
		this.setMonsterpediaListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the monsterpedia listing window.
	* @returns {Window_OmnipediaList}
	*/
	buildMonsterpediaListWindow() {
		const rectangle = this.monsterpediaListRectangle();
		const window = new Window_MonsterpediaList(rectangle);
		window.setHandler("cancel", this.onCancelMonsterpedia.bind(this));
		window.onIndexChange = this.onMonsterpediaIndexChange.bind(this);
		return window;
	}
	/**
	* Gets the rectangle associated with the monsterpedia list command window.
	* @returns {Rectangle}
	*/
	monsterpediaListRectangle() {
		const [x, y] = Graphics.boxOrigin;
		const width = 400;
		const height = Graphics.boxHeight - Graphics.verticalPadding * 2;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked monsterpedia list window.
	* @returns {Window_MonsterpediaList}
	*/
	getMonsterpediaListWindow() {
		return this._j._omni._monster._pediaList;
	}
	/**
	* Set the currently tracked monsterpedia list window to the given window.
	* @param {Window_MonsterpediaList} listWindow The monsterpedia list window to track.
	*/
	setMonsterpediaListWindow(listWindow) {
		this._j._omni._monster._pediaList = listWindow;
	}
	/**
	* Creates the detail of a single monster the player has perceived.
	*/
	createMonsterpediaDetailWindow() {
		const window = this.buildMonsterpediaDetailWindow();
		this.setMonsterpediaDetailWindow(window);
		window.populateImageCache();
		this.addWindow(window);
	}
	/**
	* Sets up and defines the monsterpedia detail window.
	* @returns {Window_MonsterpediaDetail}
	*/
	buildMonsterpediaDetailWindow() {
		const rectangle = this.monsterpediaDetailRectangle();
		const window = new Window_MonsterpediaDetail(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with the monsterpedia detail command window.
	* @returns {Rectangle}
	*/
	monsterpediaDetailRectangle() {
		const listWindow = this.getMonsterpediaListWindow();
		const x = listWindow.x + listWindow.width;
		const y = Graphics.verticalPadding;
		const width = Graphics.boxWidth - listWindow.width - Graphics.horizontalPadding * 2;
		const height = Graphics.boxHeight - Graphics.verticalPadding * 2;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked monsterpedia detail window.
	* @returns {Window_MonsterpediaDetail}
	*/
	getMonsterpediaDetailWindow() {
		return this._j._omni._monster._pediaDetail;
	}
	/**
	* Set the currently tracked monsterpedia detail window to the given window.
	* @param {Window_MonsterpediaDetail} detailWindow The monsterpedia detail window to track.
	*/
	setMonsterpediaDetailWindow(detailWindow) {
		this._j._omni._monster._pediaDetail = detailWindow;
	}
	/**
	* Opens the monsterpedia detail window.
	*/
	openMonsterpediaDetailWindow() {
		const window = this.getMonsterpediaDetailWindow();
		window.open();
		window.show();
	}
	/**
	* Closes the monsterpedia detail window.
	*/
	closeMonsterpediaDetailWindow() {
		const window = this.getMonsterpediaDetailWindow();
		window.close();
		window.hide();
	}
	/**
	* Synchronize the detail window with the list window of the monsterpedia.
	*/
	onMonsterpediaIndexChange() {
		const listWindow = this.getMonsterpediaListWindow();
		const detailWindow = this.getMonsterpediaDetailWindow();
		const highlightedEnemyObservations = listWindow.currentExt();
		detailWindow.setObservations(highlightedEnemyObservations);
		detailWindow.refresh();
	}
	/**
	* Close the monsterpedia and return to the main omnipedia.
	*/
	onCancelMonsterpedia() {
		SceneManager.pop();
	}
};

//#endregion
//#region src/plugins/omni/ext/monster/windows/Window_OmnipediaList.js
/**
* Extends {@link #buildCommands}.<br/>
* Adds the monsterpedia command to the list of commands in the omnipedia.
*/
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.set("buildCommands", Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function() {
	const originalCommands = J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.get("buildCommands").call(this);
	if (this.canAddMonsterpediaCommand()) {
		const monsterpediaCommand = new WindowCommandBuilder(J.OMNI.EXT.MONSTER.Metadata.Command.Name).setSymbol(J.OMNI.EXT.MONSTER.Metadata.Command.Symbol).addTextLine("Your standard fare in monsterologies across the universe.").addTextLine("It is adapted to the local monsterology of Erocia.").setIconIndex(J.OMNI.EXT.MONSTER.Metadata.Command.IconIndex).build();
		originalCommands.push(monsterpediaCommand);
	}
	return originalCommands;
};
/**
* Determines whether or not the monsterpedia command should be added to the Omnipedia.
* @returns {boolean}
*/
Window_OmnipediaList.prototype.canAddMonsterpediaCommand = function() {
	if (!$gameSwitches.value(J.OMNI.EXT.MONSTER.Metadata.EnabledSwitch)) return false;
	return true;
};

//#endregion
//#region src/plugins/omni/ext/monster/scenes/Scene_Omnipedia.js
/**
* Extends {@link #onRootPediaSelection}.<br/>
* When the monsterpedia is selected, open the monsterpedia.
*/
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.set("onRootPediaSelection", Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function() {
	const currentSelection = this.getRootOmnipediaKey();
	if (currentSelection === "monster-pedia") {
		this.monsterpediaSelected();
	} else {
		J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.get("onRootPediaSelection").call(this);
	}
};
/**
* Switch to the monsterpedia when selected from the root omnipedia list.
*/
Scene_Omnipedia.prototype.monsterpediaSelected = function() {
	this.closeRootPediaWindows();
	Scene_Monsterpedia.callScene();
};

//#endregion
//#region src/plugins/omni/ext/monster/registerOmniMonsterSaveCodecs.js
/**
* The monsterpedia cache is the same observations as `_monsterpediaObservationsSaveables`, keyed by
* enemy id for lookup - the whole collection, written to the file a second time.
*
* It rebuilds here rather than coming back empty, because nothing reads it through a guard: the
* lookups call `.get()` on it directly, so an empty cache reads as "this party has observed nothing"
* rather than as "this has not been built yet". Every saveable it needs has already decoded by the
* time a transient factory runs.
*
* The saveables are a sparse array indexed by enemy id, so the empty slots are skipped rather than
* keyed to `undefined`.
*/
SerializableRegistry.extend(Game_Party, { transients: { "_j._omni._monsterpediaObservationsCache": (party) => {
	const cache = new Map();
	party.getSavedMonsterpediaObservations().forEach((observation, enemyId) => {
		if (!observation) return;
		cache.set(enemyId, observation);
	});
	return cache;
} } });

//#endregion
//# sourceMappingURL=J-OMNI-Monsters.js.map