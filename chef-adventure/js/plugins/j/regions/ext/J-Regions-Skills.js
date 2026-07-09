//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 REGION-SKILLS] Enables execution of skills via region ids.
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
 * OVERVIEW
 * This plugin enables the ability to attempt to auto-execute skills
 * based on the region that a given character is standing upon while on
 * the map.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * At set intervals while any character on the map stands upon a given
 * regionId, the plugin will attempt to repeatedly execute a given skill
 * or skills against that character's JABS battler (player, follower, or
 * any map character that has a JABS battler attached).
 *
 * Executions use J-ABS forced map actions. A temporary "dummy" enemy
 * battler is created from an enemy id you specify in the tag; that
 * dummy's stats power the skill. The skill is resolved at the standing
 * character's map coordinates.
 *
 * This plugin probably could've been developed to work without JABS to
 * some extent, but this was designed FOR JABS, so it is a required
 * dependency. J-RegionEffects is also required (map note parsing shares
 * its refresh gate).
 * ============================================================================
 * PLUGIN PARAMETERS:
 *  - Execute Skill Delay:
 *      The number of frames between skill execution attempts.
 *      The lower this number, the more frequently skills will fire
 *        while standing on a tile with a region that executes skills.
 *      Defaults to 60, aka roughly once per second at 60 FPS.
 * ============================================================================
 * REGION SKILL IDS:
 * Have you ever wanted tiles that periodically cast a skill on whoever
 * is standing there (environmental damage, healing zones, traps)? Map
 * note tags define which region ids trigger which skills.
 *
 * NOTE ABOUT DUPLICATE TAGS:
 * Duplicate tags are allowed. They stack in the sense of execution
 * attempts, not merged into one roll. Multiple tags for the same region
 * (even the same skill id) mean the plugin will attempt to execute the
 * skill once per tag each time the timer fires (subject to each tag's
 * chance).
 *
 * NOTE ABOUT CHANCE:
 * CHANCE is a 1-100 integer percent chance per tag, per timer tick. It
 * does not account for target resistances or skill formulas beyond that
 * roll; use skill design and caster enemy stats for finer control.
 *
 * NOTE ABOUT THE CASTER ENEMY ID:
 * CASTER_ENEMY_ID is a row in the Enemies database. J-ABS builds a dummy
 * map battler from that enemy so the skill has valid stats, elements,
 * and actions. The dummy is not placed on the map as a visible event;
 * it exists only to cast. Change the id when you need different power
 * scaling or attack elements.
 *
 * NOTE ABOUT IS_FRIENDLY:
 * IS_FRIENDLY is the literal `true` or `false` (lowercase).
 *  - `false`: the dummy is treated as hostile to the target's team
 *    (typical damage tiles, traps, poison clouds).
 *  - `true`: the dummy is treated as friendly to the target's team
 *    (typical healing or buff zones for allies).
 * The plugin reuses one shared dummy instance and swaps it when region
 * tags on the same map disagree about caster id or friendly flag.
 *
 * NOTE ABOUT WHICH CHARACTERS ARE AFFECTED:
 * Any map character that can handle region skills is eligible: not
 * vehicles, and must have a JABS battler (same gate as other J-ABS map
 * characters). Hidden party followers still run region skills if they
 * have battlers.
 *
 * NOTE ABOUT SKILLS AND PERFORMANCE:
 * Skills run as real J-ABS map actions (projectiles, AoE, animations,
 * etc.). Very short execution delays plus high proc rates on busy maps
 * can spike load. Prefer modest chances or longer delays for hazard
 * regions that fire often. Skills must be valid for forced map execution
 * in J-ABS (same constraints as other map-damage / terrain skill paths).
 *
 * TAG USAGE:
 * - Map [Properties] note box (same place as region state tags).
 *
 * TAG FORMAT:
 *  <regionSkill:[REGION_ID, SKILL_ID, CHANCE, CASTER_ENEMY_ID,
 *    IS_FRIENDLY]>
 * Where REGION_ID is the map region id on the tile.
 * Where SKILL_ID is the skill database id to execute.
 * Where CHANCE is a 1-100 integer chance of executing this tick.
 * Where CASTER_ENEMY_ID is the enemy database id powering the dummy
 *   caster.
 * Where IS_FRIENDLY is `true` or `false` (hostile vs friendly dummy).
 *
 * All five values are required; the parser does not accept omitted
 * fields.
 *
 * TAG EXAMPLES:
 *  <regionSkill:[1, 12, 100, 3, false]>
 * Region 1: always (100%) tries to execute skill 12 using enemy 3's
 * stats as a hostile dummy, on each timer tick, against whoever stands
 * on region 1.
 *
 *  <regionSkill:[2, 45, 25, 8, false]>
 *  <regionSkill:[2, 45, 50, 8, false]>
 * Region 2: two entries for the same skill. Each tick can roll 25% and
 * 50% separately (two execution attempts, not one combined chance).
 *
 *  <regionSkill:[10, 78, 100, 1, true]>
 * Region 10: skill 78 from enemy 1 as a friendly dummy (ally healing
 * shrine).
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
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
J.REGIONS.EXT.SKILLS.Metadata = new J_RegionSkillsPluginMetadata("J-Region-Skills", "1.0.0");
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

//#endregion
//#region src/plugins/regions/ext/skills/objects/Game_Map.js
/**
* Extends {@link #initialize}.<br/>
* Also initializes the region skills properties.
*/
J.REGIONS.EXT.SKILLS.Aliased.Game_Map.set("initialize", Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function() {
	J.REGIONS.EXT.SKILLS.Aliased.Game_Map.get("initialize").call(this);
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
	const regionSkillsData = RPGManager.getArraysFromNotesByRegex({ note: this.note() }, J.REGIONS.EXT.SKILLS.RegExp.RegionSkill, true);
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
		const correctCaster = currentDummyCaster?.getBattlerId() === casterId;
		const correctTeam = currentDummyCaster?.isFriendlyTeam(targetJabsBattler.getTeam()) === isFriendly;
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
//# sourceMappingURL=J-Regions-Skills.js.map