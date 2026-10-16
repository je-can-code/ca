//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.2 REGIONS-SKILLS] Enables execution of skills via region ids.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-RegionEffects
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-RegionEffects
 * @help
 * ============================================================================
 * Please refer to J-Regions-Skills's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/regions/ext/skills/index.md
 * ============================================================================
 *
 * @param execution-delay
 * @type number
 * @text Execute Skill Delay
 * @desc The number of frames between skill executions.
 * Adjust this to make skills execute more or less frequently.
 * @default 60
 */
//endregion annotations

//#region src/plugins/regions/ext/skills/_metadata/_pluginMetadata.js
var J_RegionSkillsPluginMetadata = class extends PluginMetadata {
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
		* The number of frames between executing while standing on the given regionId.<br>
		* Lower this to increase frequency of skill execution.<br>
		* Raise this to reduce frequency of skill execution.<br>
		* This only applies while a battler is standing on a tile with a valid region skill.
		* @type {number}
		*/
		this.delayBetweenExecutions = this.parsedPluginParameters["execution-delay"] ?? 60;
	}
};

//#endregion
//#region src/plugins/regions/ext/skills/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.REGIONS.EXT.SKILLS = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.REGIONS.EXT.SKILLS.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.REGIONS.EXT.SKILLS.Metadata = new J_RegionSkillsPluginMetadata("J-Regions-Skills", "1.1.2");
/**
* A collection of all aliased methods for this plugin.
*/
J.REGIONS.EXT.SKILLS.Aliased = {};
J.REGIONS.EXT.SKILLS.Aliased.Game_Character = new Map();
J.REGIONS.EXT.SKILLS.Aliased.Game_Map = new Map();
J.REGIONS.EXT.SKILLS.Aliased.Game_System = new Map();
/**
* All regular expressions used by this plugin.
*/
J.REGIONS.EXT.SKILLS.RegExp = {};
J.REGIONS.EXT.SKILLS.RegExp.RegionSkill = /<regionSkill:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?(true|false)])>/gi;

//#endregion
//#region src/plugins/regions/ext/skills/models/RegionSkillData.js
/**
* A data class containing the various data points associated with a region that
* may execute a skill while standing upon it.
*/
var RegionSkillData = class {
	/**
	* The regionId this data class stores data for.
	* @type {number}
	*/
	regionId = -1;
	/**
	* The skillId that can be executed while within this regionId.
	* @type {number}
	*/
	skillId = 0;
	/**
	* The 1-100 integer percent chance of skill execution while within this regionId.
	* @type {number}
	*/
	chance = 0;
	/**
	* The id of the enemy whose stats will power this skill execution.
	* @type {number}
	*/
	casterId = 0;
	/**
	* Whether or not this region skill execution is considered friendly towards the player.
	* @type {boolean}
	*/
	isFriendly = false;
	/**
	* Constructor.
	*/
	constructor(regionId, stateId, chanceOfApplication = 100, casterId = 0, isFriendly = false) {
		this.regionId = regionId;
		this.skillId = stateId;
		this.chance = chanceOfApplication;
		this.casterId = casterId;
		this.isFriendly = isFriendly;
	}
};
SerializableRegistry.register(RegionSkillData);

//#endregion
//#region src/plugins/regions/ext/skills/objects/Game_Map.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the region skills properties.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_Map.set("initMembers", Game_Map.prototype.initMembers);
Game_Map.prototype.initMembers = function() {
	J.REGIONS.EXT.SKILLS.Aliased.Game_Map.get("initMembers").call(this);
	this.initRegionSkillsMembers();
};
/**
* Initializes all region states properties for the map.
*/
Game_Map.prototype.initRegionSkillsMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to region effects.
	*/
	this._j._regions ||= {};
	/**
	* The grouping of all properties related specifically to the region skills extension.
	*/
	this._j._regions._skills = {};
	/**
	* A map keyed by regionId of all {@link RegionSkillData}s that apply while the character is on a tile
	* marked by the keyed regionId.
	* @type {Map<number,RegionSkillData[]>}
	*/
	this._j._regions._skills._map = new Map();
};
/**
* Gets the dictionary currently tracking the regions and skill data executions for the map.
* @return {Map<number,RegionSkillData[]>}
*/
Game_Map.prototype.getRegionSkills = function() {
	return this._j._regions._skills._map;
};
/**
* Gets all skillIds to be executed against characters standing on the given regionId.
* @return {RegionSkillData[]}
*/
Game_Map.prototype.getRegionSkillsByRegionId = function(regionId) {
	return this.getRegionSkills().get(regionId) ?? Array.empty;
};
/**
* Sets the skillIds to the given regionId.
* @param {number} regionId The regionId to update with new stateIds.
* @param {RegionSkillData} regionSkillData The new region state data to add to the regionId.
*/
Game_Map.prototype.addRegionSkillDataByRegionId = function(regionId, regionSkillData) {
	const regionSkills = this.getRegionSkills();
	if (!regionSkills.has(regionId)) {
		regionSkills.set(regionId, [regionSkillData]);
	} else {
		const currentRegionSkillDatas = regionSkills.get(regionId);
		const newRegionSkillDatas = currentRegionSkillDatas.concat(regionSkillData);
		regionSkills.set(regionId, newRegionSkillDatas);
	}
};
/**
* Extends {@link #setup}.<br/>
* Also initializes this map's region-skill data.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.REGIONS.EXT.SKILLS.Aliased.Game_Map.get("setup").call(this, mapId);
	this.setupRegionSkills();
};
/**
* Sets up the region skills based on tags for this map.
*/
Game_Map.prototype.setupRegionSkills = function() {
	this.clearRegionSkills();
	this.refreshRegionSkills();
};
/**
* Clears all region skills that have been configured for this map.
*/
Game_Map.prototype.clearRegionSkills = function() {
	const regionSkills = this.getRegionSkills();
	regionSkills.clear();
};
/**
* Refreshes the region skills on this map.
*/
Game_Map.prototype.refreshRegionSkills = function() {
	if (!this.canRefreshRegionEffects()) return;
	const regionSkillsData = RPGManager.getArraysFromNotesByRegex({ note: this.note() }, J.REGIONS.EXT.SKILLS.RegExp.RegionSkill);
	if (!regionSkillsData || !regionSkillsData.length) return;
	regionSkillsData.forEach((regionSkillData) => {
		const [regionId, skillId, chanceOfApplication, casterId, isFriendly] = regionSkillData;
		const newRegionSkillData = new RegionSkillData(regionId, skillId, chanceOfApplication, casterId, isFriendly);
		this.addRegionSkillDataByRegionId(regionId, newRegionSkillData);
	});
};

//#endregion
//#region src/plugins/regions/ext/skills/objects/Game_Character.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the region skills members.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_Character.set("initMembers", Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function() {
	J.REGIONS.EXT.SKILLS.Aliased.Game_Character.get("initMembers").call(this);
	this.initRegionSkillsMembers();
};
/**
* Initializes all members associated with region states.
*/
Game_Character.prototype.initRegionSkillsMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with REGIONS.
	*/
	this._j._regions ||= {};
	/**
	* A grouping of all properties associated with the region skills plugin extension.
	*/
	this._j._regions._skills = {};
	/**
	* The timer that manages the (re)execution of region-derived skills.
	* @type {JABS_Timer}
	*/
	this._j._regions._skills._timer = new JABS_Timer(J.REGIONS.EXT.SKILLS.Metadata.delayBetweenExecutions);
};
/**
* Gets the region skills timer for this character.
* @return {JABS_Timer}
*/
Game_Character.prototype.getRegionSkillsTimer = function() {
	return this._j._regions._skills._timer;
};
/**
* Extends {@link #update}.<br/>
* Also handles region skills updates for the character.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_Character.set("update", Game_Character.prototype.update);
Game_Character.prototype.update = function() {
	J.REGIONS.EXT.SKILLS.Aliased.Game_Character.get("update").call(this);
	this.handleRegionSkills();
};
/**
* Handles processing of the region states functionality.
*/
Game_Character.prototype.handleRegionSkills = function() {
	if (!this.canHandleRegionSkills()) return;
	const timer = this.getRegionSkillsTimer();
	timer.update();
	if (timer.isTimerComplete()) {
		timer.reset();
		this.executeRegionSkills();
	}
};
/**
* Checks if this character should process their own region skills.
* @return {boolean}
*/
Game_Character.prototype.canHandleRegionSkills = function() {
	if (this.isVehicle()) return false;
	if (!this.hasJabsBattler()) return false;
	return true;
};
/**
* Executes all relevant region skills based on their regionId.
*/
Game_Character.prototype.executeRegionSkills = function() {
	const regionSkillDatas = this.getRegionSkillsByCurrentRegionId();
	if (regionSkillDatas.length === 0) return;
	const targetJabsBattler = this.getJabsBattler();
	regionSkillDatas.forEach((regionSkillData) => {
		const { skillId, chance, casterId, isFriendly } = regionSkillData;
		const walkerBattler = targetJabsBattler.getBattler();
		const skill = $dataSkills.at(skillId);
		const positiveRolls = 1 + walkerBattler.getPositiveRollsForSkill(skill);
		const negativeRolls = walkerBattler.getNegativeRollsForSkill(skill);
		const procCount = RPGManager.resolveProcCount(walkerBattler, chance, positiveRolls, negativeRolls);
		if (procCount === 0) return;
		const currentDummyCaster = $jabsEngine.getMapDamageBattler();
		const hasDummyCaster = currentDummyCaster !== null && currentDummyCaster !== undefined;
		const correctCaster = hasDummyCaster && currentDummyCaster.getBattlerId() === casterId;
		const correctTeam = hasDummyCaster && currentDummyCaster.isFriendlyTeam(targetJabsBattler.getTeam()) === isFriendly;
		if (!correctCaster || !correctTeam) {
			$jabsEngine.setMapDamageBattler(casterId, isFriendly);
		}
		for (let i = 0; i < procCount; i++) {
			$jabsEngine.forceMapAction($jabsEngine.getMapDamageBattler(), skillId, false, targetJabsBattler.getX(), targetJabsBattler.getY(), true);
		}
	});
};
/**
* Gets all {@link RegionSkillData}s associated with this character's current regionId.
* @return {RegionSkillData[]}
*/
Game_Character.prototype.getRegionSkillsByCurrentRegionId = function() {
	const regionId = this.regionId();
	return $gameMap.getRegionSkillsByRegionId(regionId);
};

//#endregion
//#region src/plugins/regions/ext/skills/objects/Game_System.js
/**
* Updates the region skills after loading a game.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.REGIONS.EXT.SKILLS.Aliased.Game_System.get("onAfterLoad").call(this);
	this.updateRegionSkillsAfterLoad();
};
/**
* Re-initializes the region skills for the map and characters.
*/
Game_System.prototype.updateRegionSkillsAfterLoad = function() {
	$gameMap.initRegionSkillsMembers();
	$gameMap.setupRegionSkills();
	$gamePlayer.initRegionSkillsMembers();
	$gamePlayer.followers().data().forEach((follower) => follower.initRegionSkillsMembers());
};

//#endregion
//#region src/plugins/regions/ext/skills/managers/JABS_Engine.js
/**
* The enemy used by the engine for map damage skill executions.
* @type {JABS_Battler}
*/
JABS_Engine.prototype.mapDamageBattler = null;
/**
* The enemy used by the engine for map damage skill executions.
* @type {JABS_Battler}
*/
JABS_Engine.prototype.getMapDamageBattler = function() {
	return this.mapDamageBattler;
};
/**
* Initializes a new {@link JABS_Battler} based on the given id.<br/>
* This dummy enemy is used for things like forced skill executions on
* the map needing an enemy to execute.
* @param {number} dummyEnemyId The id of the enemy in the database to represent the dummy.
* @param {boolean} isFriendly Whether or not this dummy is an allied dummy.
*/
JABS_Engine.prototype.setMapDamageBattler = function(dummyEnemyId, isFriendly) {
	const coreData = JABS_BattlerCoreData.Builder().setBattlerId(dummyEnemyId).isDummy(isFriendly).build();
	this.mapDamageBattler = new JABS_Battler($gamePlayer, $gameEnemies.enemy(dummyEnemyId), coreData);
};

//#endregion
//#region src/plugins/regions/ext/skills/registerRegionSkillsSaveCodecs.js
/**
* The region-skills execution timer is a stopwatch and is never written to a savefile; each holder
* gets a fresh one on load, built from the plugin parameter rather than from whatever delay was
* configured when the save was written.
*
* The three character-like hosts are named individually because a codec is resolved by the exact
* constructor of the value being encoded, so a declaration on `Game_Character` - where the field is
* assigned - would reach none of them. Events are absent because J-Base's event codec drops
* everything at `_j` on an event outright.
*/
var regionSkillsTimerTransients = { "_j._regions._skills._timer": () => new JABS_Timer(J.REGIONS.EXT.SKILLS.Metadata.delayBetweenExecutions) };
SerializableRegistry.extend(Game_Player, { transients: regionSkillsTimerTransients });
SerializableRegistry.extend(Game_Follower, { transients: regionSkillsTimerTransients });
SerializableRegistry.extend(Game_Vehicle, { transients: regionSkillsTimerTransients });

//#endregion
//# sourceMappingURL=J-Regions-Skills.js.map