//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 APT] A plugin that grants the ability to learn by gaining points.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-LevelMaster
 * @orderAfter J-Log
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin grants the ability to learn skills by gaining points.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; acquire points from enemy kills and skill executions.
 * - J-LevelMaster; gates AP gain entirely (all-or-nothing, not a scaling
 *   multiplier) once the actor is too many levels above the enemy.
 * - J-Log; log all AP gained.
 * - J-Popups (+ J-Popups-APT); display popups for AP gained.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * This plugin lets actors learn skills by gaining AP (Aptitude Points).
 * As actors earn AP, it flows into the currently-active sources
 * (like Class/Weapons/Armor/States/Actor), and when a requirement is met:
 * the skill is learned.
 * - Only active sources on the actor receive AP. Change gear/class/state?
 *   Active sources change too.
 * - Multiple sources can point at the same skill; progress is tracked per
 *   source and the moment any teaching crosses its requirement, the skill
 *   becomes learned for the actor.
 *
 * ============================================================================
 * TEACHABLES
 * Ever want to have skills “teach themselves” while you play? Well now you
 * can! By applying the appropriate tags across the various database locations,
 * your actors will soak up AP from adventures and unlock those skills.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <aptitude:[SKILL_ID, REQUIRED_AP]>
 *    Where SKILL_ID is the database id of the skill to learn,
 *    Where REQUIRED_AP is how much AP that source needs to teach it.
 *
 * TAG EXAMPLES:
 *  <aptitude:[12,150]>
 * This source enables learning skill of id 12 once the owner gains 150 AP.
 * ============================================================================
 * AP
 * Ever want to gain AP so that you could learn all those skills that various
 * sources teach. Well now you can! By applying the appropriate tags onto
 * enemies, you too can gain AP when chopping up enemies.
 *
 * NOTE ABOUT LEVEL DIFFERENCE
 * There is a limit by default that prevents AP from being gained when the
 * actor level is too far above the enemy level. This is a plugin parameter
 * for your convenience. If you set the plugin parameter to -1, the
 * functionality will be disabled.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <ap:AMOUNT>
 *    Where AMOUNT is the amount of AP to be gained.
 *
 * TAG EXAMPLES:
 *  <ap:6>
 * This enemy will yield 6 AP upon defeat.
 *
 * ============================================================================
 * AP RATE MULTIPLIER
 * Ever want an actor to earn AP faster (or slower) than everyone else? Well
 * now you can! By applying the appropriate tag across the various database
 * locations, you can boost or reduce how much AP that actor actually banks
 * from every gain.
 *
 * NOTE:
 * The format implies whole numbers, not actual multipliers like 1.3. All
 * matching tags across an actor's active note sources sum together before
 * being applied as a single rate against the raw AP amount- same pattern as
 * J-SDP's sdpMultiplier. Also stacks with any SDP panel bonus for the "apr"
 * parameter key, if J-SDP is loaded.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <aptMultiplier:AMOUNT>    (for positive)
 *  <aptMultiplier:-AMOUNT>   (for negative)
 *
 * TAG EXAMPLES:
 *  <aptMultiplier:25>
 * An actor with something equipped/applied that has the above tag now gains
 * 25% increased AP from every source.
 *
 *  <aptMultiplier:80>
 *  <aptMultiplier:-30>
 * An actor with something equipped/applied that has both of the above tags
 * now gains 50% increased AP (80 - 30 = 50).
 *
 * ============================================================================
 * TIPS
 * ----------------------------------------------------------------------------
 * - Stack learnings: You can define the same skill on multiple sources. The UI
 *   will aggregate per‑source progress for that skill so you can see total vs.
 *   source contributions.
 * - Source lifetime: Only currently active sources on the actor receive AP
 *   (ex: changing class/equipment/states changes the active set of sources).
 * - J-ABS synergy: Pair enemy <ap:...> rewards with your encounter balance to
 *   tune progression alongside EXP.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added AP rate multiplier via <aptMultiplier:AMOUNT>, registered with
 *    the shared parameter catalog (apr) with an SDP panel binding.
 *    J-LevelMaster integration is now an all-or-nothing gate on AP gain
 *    once the actor is too many levels above the enemy, replacing the old
 *    scaling multiplier; reads $gameSystem.isLevelScalingEnabled() instead
 *    of the static plugin metadata flag.
 *    Fixed stale requiredAp: a learning's persisted requiredAp now re-syncs
 *    to the live notetag value every time its source grants AP, instead of
 *    being frozen at whatever value existed the first time it was touched.
 *    Added refresh-required-ap / refresh-required-ap-all plugin commands to
 *    manually repair saves that had already gone stale before this fix.
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.2
 *    Updated to be more extensible for extensions.
 *    Fixed issue with parsing inputs for aptitude progresses.
 * - 1.0.1
 *    Added emergency initialization for existing saves.
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
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 107
 *
 * @param levelConfig
 * @text LEVEL-RELATED SETUP
 *
 * @param max-level-threshold
 * @parent levelConfig
 * @type number
 * @text Max Level Threshold
 * @desc The max allowed difference in level between actor and enemy to gain AP from.
 * @min -1
 * @default 10
 *
 * @command mod-ap-all
 * @text Add/Remove AP (Party)
 * @desc Adds or removes a designated amount of AP from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 * @default 10
 *
 * @command mod-ap
 * @text Add/Remove AP
 * @desc Adds or removes a designated amount of AP from an actor by its id.
 * @arg actorId
 * @type actor
 * @desc The id of the actor to modify AP for.
 * @default 1
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The amount of AP to modify by. Negative removes AP. Per-source never goes below 0.
 * @default 10
 *
 * @command refresh-required-ap-all
 * @text Refresh Required AP (Party)
 * @desc Re-syncs persisted aptitude requiredAp values against current notetags for all party members.
 *
 * @command refresh-required-ap
 * @text Refresh Required AP
 * @desc Re-syncs persisted aptitude requiredAp values against current notetags for an actor by its id.
 * @arg actorId
 * @type actor
 * @desc The id of the actor to refresh aptitude requirements for.
 * @default 1
 */
//endregion annotations

//#region src/plugins/apt/core/_models/AptitudeLearning.js
/**
* The current state of a skill being learned.
*/
var AptitudeLearning = class {
	/**
	* Constructor.
	* @param {number} skillId The skill id to learn.
	* @param {number} requiredAp The required AP to achieve this learning.
	* @param {number} currentAp The current AP towards achieving this learning.
	*/
	constructor(skillId, requiredAp, currentAp) {
		/**
		* The id of the skill learned when achieving this learning.
		* @type {number}
		*/
		this.skillId = skillId;
		/**
		* The current AP towards achieving this learning.
		* @type {number}
		*/
		this.currentAp = currentAp;
		/**
		* The required amount of AP to achieve this learning.
		* @type {number}
		*/
		this.requiredAp = requiredAp;
	}
	/**
	* Gains AP towards achieving this learning.
	* @param {number} ap The amount of AP to gain.
	*/
	gainAp(ap) {
		this.currentAp += ap;
	}
	/**
	* Sets the current AP towards achieving this learning.
	* @param {number} ap The amount of AP to set.
	*/
	setAp(ap) {
		this.currentAp = ap;
	}
	/**
	* Sets the required AP to achieve this learning.
	* @param {number} requiredAp The amount of AP to set as required.
	*/
	setRequiredAp(requiredAp) {
		this.requiredAp = requiredAp;
	}
	/**
	* Whether or not this learning is achieved.
	* @returns {boolean} True if the learning is achieved, false otherwise.
	*/
	isLearned() {
		return this.currentAp >= this.requiredAp;
	}
};
SerializableRegistry.register(AptitudeLearning);

//#endregion
//#region src/plugins/apt/core/_models/AptitudeTeachable.js
/**
* The runtime shape of a learnable skill and its requirements.
*/
var AptitudeTeachable = class {
	/**
	* Constructor.
	* @param {number} skillId The skill id to learn.
	* @param {number} requiredAp The required AP to learn the skill.
	*/
	constructor(skillId, requiredAp) {
		/**
		* The id of the skill to learn.
		* @type {number}
		*/
		this.skillId = skillId;
		/**
		* The required AP to learn the skill.
		* @type {number}
		*/
		this.requiredAp = requiredAp;
	}
};

//#endregion
//#region src/plugins/apt/core/_models/AptitudeProgress.js
/**
* The structure of an object and its potential {@link AptitudeLearning}s.
*/
var AptitudeProgress = class {
	/**
	* Constructor.
	* @param {string} key "type:id" unique key of the aptitude being learned.
	* @param {Record<number, AptitudeLearning>} [aptitudeLearnings] The current state of learnings; defaults to nothing.
	*/
	constructor(key, aptitudeLearnings = {}) {
		/**
		* The "type:id" unique key of the aptitude being learned.
		* @type {string}
		*/
		this.key = key;
		/**
		* The current state of learnings.
		* @type {Record<number, AptitudeLearning>}
		*/
		this._learnings = aptitudeLearnings;
	}
	/**
	* Gets the current progress for a skill.
	* @param {number} skillId The skill id to learn.
	* @returns {AptitudeLearning|null} The current learning for the skill, or null if it doesn't exist.
	*/
	learningBySkillId(skillId) {
		return this.learnings()[skillId] ?? null;
	}
	/**
	* Determines whether or not this aptitude progress has a learning for the given skill.
	* @param {number} skillId The skill id to check for.
	* @returns {boolean} True if the skill exists on this progress, false otherwise.
	*/
	hasLearning(skillId) {
		return this.learnings()[skillId] !== undefined;
	}
	/**
	* Adds or updates a learning for this aptitude progress.
	* @param {number} skillId The skill id to learn.
	* @param {number} [amount] The current amount of AP for the learning; defaults to 0.
	*/
	setLearning(skillId, amount = 0) {
		if (this.hasLearning(skillId) === false) return;
		const learning = this.learningBySkillId(skillId);
		learning.setAp(amount);
	}
	/**
	* Creates a new learning for this aptitude progress.
	* @param {number} skillId The id of the skill for the learning.
	* @param {number} requiredAp The amount of AP required for the learning.
	* @param {number} [amount] The current amount of AP for the learning; defaults to 0.
	*/
	initializeLearning(skillId, requiredAp, amount = 0) {
		this._learnings[skillId] = new AptitudeLearning(skillId, requiredAp, amount);
	}
	/**
	* Gets the current state of learnings for this aptitude progress tracker.
	* @returns {Record<number, AptitudeLearning>}
	*/
	learnings() {
		return this._learnings;
	}
};
SerializableRegistry.register(AptitudeProgress);

//#endregion
//#region src/plugins/apt/core/_models/AptitudeSkill.js
/**
* The structure of an object and the skill that was learned.
*/
var AptitudeSkill = class {
	/**
	* Constructor.
	* @param {skillId} skillId The skill id that was learned.
	* @param {boolean} [learned] Whether or not the skill was learned; defaults to false.
	*/
	constructor(skillId, learned = false) {
		/**
		* The skill id that was learned.
		* @type {number}
		*/
		this.skillId = skillId;
		/**
		* Whether or not this aptitude skill is learned.
		* @type {boolean}
		*/
		this.learned = learned;
		/**
		* The "type:id" key of the aptitude that this skill was learned from.
		* @type {string}
		*/
		this._learnedFrom = String.empty;
	}
	/**
	* Learns the skill.
	* @param {AptitudeProgress} learnedFrom The aptitude from which this skill was learned.
	*/
	learnSkill(learnedFrom) {
		this.learned = true;
		this._learnedFrom = learnedFrom.key;
	}
	/**
	* Forgets the skill.
	*/
	forgetSkill() {
		this.learned = false;
		this._learnedFrom = String.empty;
	}
	/**
	* Gets the key of the aptitude that this skill was learned from.
	* @returns {string}
	*/
	learnedFrom() {
		return this._learnedFrom;
	}
};
SerializableRegistry.register(AptitudeSkill);

//#endregion
//#region src/plugins/apt/core/_models/AptitudeSkillSourceProgress.js
/**
* Represents per‑source progress for learning a skill via aptitudes.
*/
var AptitudeSkillSourceProgress = class {
	/**
	* The source key (e.g., equipment/state/skill source id string).
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* The skill id this source contributes AP toward.
	* @type {number}
	*/
	#skillId = 0;
	/**
	* The current AP accumulated toward the skill.
	* @type {number}
	*/
	#currentAp = 0;
	/**
	* The total AP required to learn the skill.
	* @type {number}
	*/
	#requiredAp = 0;
	/**
	* Whether or not the skill has been learned from this source.
	* @type {boolean}
	*/
	#learned = false;
	/**
	* Constructor.
	* @param {string} sourceKey - The source key (e.g., equipment/state/skill source id string).
	* @param {number} skillId - The skill id this source contributes AP toward.
	* @param {number} currentAp - The current AP accumulated for this source toward the skill.
	* @param {number} requiredAp - The total AP required to learn from this source.
	* @param {boolean} learned - Whether this source already granted the skill (complete).
	*/
	constructor(sourceKey, skillId, currentAp, requiredAp, learned) {
		this.#sourceKey = String(sourceKey);
		this.#skillId = Number(skillId);
		this.#currentAp = Number(currentAp);
		this.#requiredAp = Number(requiredAp);
		this.#learned = Boolean(learned === true);
	}
	/**
	* The key of the source.
	* @returns {string}
	*/
	sourceKey() {
		return this.#sourceKey;
	}
	/**
	* The skill id this source contributes AP toward.
	* @returns {number}
	*/
	skillId() {
		return this.#skillId;
	}
	/**
	* The current AP accumulated toward the skill.
	* @returns {number}
	*/
	currentAp() {
		return this.#currentAp;
	}
	/**
	* The total AP required to learn the skill.
	* @returns {number}
	*/
	requiredAp() {
		return this.#requiredAp;
	}
	/**
	* Whether or not the skill has been learned from this source.
	* @returns {boolean}
	*/
	learned() {
		return this.#learned;
	}
	/**
	* The remaining AP needed to learn the skill.
	* @returns {number}
	*/
	remainingAp() {
		return Math.max(0, this.requiredAp() - this.currentAp());
	}
};

//#endregion
//#region src/plugins/apt/core/_models/AptitudeSkillAggregate.js
/**
* Represents one skill learned via aptitudes across all sources on an actor.
* Holds per‑source progress and exposes convenience accessors for list/details UIs.
*/
var AptitudeSkillAggregate = class {
	/**
	* The skill id.
	* @type {number}
	*/
	#skillId = 0;
	/**
	* The database skill.
	* @type {RPG_Skill}
	*/
	#skill = null;
	/**
	* The sources that this skill reside in.
	* @type {AptitudeSkillSourceProgress[]}
	*/
	#sources = [];
	/**
	* @param {number} skillId The skill id.
	* @param {RPG_Skill} skillData The database skill for name/icon/desc.
	*/
	constructor(skillId, skillData) {
		this.#skillId = skillId;
		this.#skill = skillData;
		this.#sources = [];
	}
	/**
	* Adds one per‑source progress row to this aggregate.
	* @param {AptitudeSkillSourceProgress} src The per‑source row.
	*/
	addSource(src) {
		this.sources().push(src);
	}
	/**
	* The skill id for this aggregate.
	* @returns {number}
	*/
	skillId() {
		return this.#skillId;
	}
	/**
	* The database object for the skill.
	* @returns {RPG_Skill}
	*/
	skill() {
		return this.#skill;
	}
	/**
	* The name of the skill.
	* @returns {string}
	*/
	name() {
		return this.#skill.name;
	}
	/**
	* The icon index of the skill.
	* @returns {number}
	*/
	iconIndex() {
		return this.#skill.iconIndex;
	}
	/**
	* The sources that this skill resides in.
	* @returns {AptitudeSkillSourceProgress[]}
	*/
	sources() {
		return this.#sources;
	}
	/**
	* Whether or not this skill has been learned in any source.
	* @returns {boolean}
	*/
	learnedAny() {
		return this.sources().some((source) => source.learned() === true);
	}
	/**
	* Finds the source with the minimum remaining AP among not‑yet‑learned sources.
	* If all sources are learned, returns the first source for display context.
	* @returns {AptitudeSkillSourceProgress|null}
	*/
	cheapestSource() {
		let cheapest = null;
		const sources = this.sources();
		sources.forEach((s) => {
			if (s.learned() === true) {
				return;
			}
			const remaining = s.remainingAp();
			if (cheapest === null || remaining < cheapest.remainingAp()) {
				cheapest = s;
			}
		});
		if (cheapest === null && sources.length > 0) {
			return sources[0];
		}
		return cheapest;
	}
	/**
	* Convenience: current AP of the cheapest path for list UI.
	* @returns {number}
	*/
	currentAp() {
		const cheapest = this.cheapestSource();
		return cheapest ? cheapest.currentAp() : 0;
	}
	/**
	* Convenience: required AP of the cheapest path for list UI.
	* @returns {number}
	*/
	requiredAp() {
		const cheapest = this.cheapestSource();
		return cheapest ? cheapest.requiredAp() : 1;
	}
};

//#endregion
//#region src/plugins/apt/core/_metadata/_pluginMetadata.js
var JAptitude_PluginMetadata = class extends PluginMetadata {
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
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* The maximum level difference between actor and enemy that allows AP gain.
		* @type {number}
		*/
		this.maxLevelThreshold = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["max-level-threshold"], NaN);
		/**
		* Whether or not the level threshold limit is being used.
		* @type {boolean}
		*/
		this.usingLevelThresholdLimit = this.maxLevelThreshold > -1;
	}
};

//#endregion
//#region src/plugins/apt/core/_metadata/initialization.js
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
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (hasJabsRequirement === false) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.APT = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.APT.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.APT.Metadata = new JAptitude_PluginMetadata("J-Aptitude", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.APT.Aliased = {};
J.APT.Aliased.Scene_Boot = new Map();
J.APT.Aliased.BattleManager = new Map();
J.APT.Aliased.Game_Action = new Map();
J.APT.Aliased.Game_Actor = new Map();
J.APT.Aliased.JABS_Battler = new Map();
J.APT.Aliased.JABS_Engine = new Map();
J.APT.Aliased.Scene_Menu = new Map();
J.APT.Aliased.Window_MenuCommand = new Map();
/**
* All regular expressions used by this plugin.
*/
J.APT.RegExp = {};
/**
* The structure of a learnable aptitude skill.
*
* <pre>
* Structure:
*  <aptitude:[SKILL_ID, REQUIRED_AP]>
*
* Example:
*  <aptitude:[12, 150]>
*
* Translation:
*  Skill Learned: 12
*  Required AP  : 150
* </pre>
* @type {RegExp}
*/
J.APT.RegExp.AptitudeTeachable = /<aptitude:[ ]?(\[\d+,[ ]?\d+])>/gi;
/**
* The AP reward an enemy yields on defeat.
*
* <pre>
* Structure:
*  <ap:AMOUNT>
*
* Example:
*  <ap:12>
*
* Translation:
*  AP gained: 12
* </pre>
* @type {RegExp}
*/
J.APT.RegExp.ApReward = /<ap: ?(\d+)>/i;
J.APT.RegExp.AptMultiplier = /<aptMultiplier:(-?\d+)>/i;

//#endregion
//#region src/plugins/apt/core/database/RPG_Base.js
/**
* Gets all {@link AptitudeTeachable}s associated with this database object.
* @type {AptitudeTeachable[]}
*/
Object.defineProperty(RPG_Base.prototype, "aptitudeTeachings", { get() {
	return this.buildAptitudeTeachings();
} });
/**
* Builds the array of {@link AptitudeTeachable}s associated with this database object.
* Extensions may alias this to append additional teachables.
* @returns {AptitudeTeachable[]} The built list.
*/
RPG_Base.prototype.buildAptitudeTeachings = function() {
	const raw = RPGManager.getArraysFromNotesByRegex(this, J.APT.RegExp.AptitudeTeachable, true);
	return raw.map(([skillId, requiredAp]) => new AptitudeTeachable(skillId, requiredAp));
};

//#endregion
//#region src/plugins/apt/core/database/RPG_Enemy.js
/**
* The number of AP this enemy will yield upon defeat.
* @type {number}
*/
Object.defineProperty(RPG_Enemy.prototype, "apPoints", { get() {
	return RPGManager.getNumberFromNoteByRegex(this, J.APT.RegExp.ApReward);
} });

//#endregion
//#region src/plugins/apt/core/objects/Game_BattlerBase.js
Object.defineProperties(Game_BattlerBase.prototype, { 
/**
* Aptitude point gain multiplier.
*/
apr: {
	get: function() {
		return 1;
	},
	configurable: true
} });
Object.defineProperty(Game_Actor.prototype, "apr", {
	get: function() {
		if (this.getCachedApr() !== null) {
			return this.getCachedApr();
		}
		const multiplier = 100;
		const bonus = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.APT.RegExp.AptMultiplier);
		const sdpBonus = this.getSdpBonusForParameterKey ? this.getSdpBonusForParameterKey("apr", 1) : 0;
		const factor = (multiplier + bonus + sdpBonus) / 100;
		this.setCachedApr(factor);
		return this.getCachedApr();
	},
	configurable: true
});

//#endregion
//#region src/plugins/apt/core/objects/Game_Battler.js
/**
* Gets the AP points this battler yields upon defeat..
* @returns {number}
*/
Game_Battler.prototype.apPoints = function() {
	return this.databaseData().apPoints;
};

//#endregion
//#region src/plugins/apt/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes aptitude members.
*/
J.APT.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.APT.Aliased.Game_Actor.get("initMembers").call(this);
	this.initAptitudeMembers();
};
/**
* Initializes the aptitude members.
*/
Game_Actor.prototype.initAptitudeMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._aptitude ||= {};
	/**
	* A collection of all aptitudes that are presently being learned.
	* @type {Record<string, AptitudeProgress>}
	*/
	this._j._aptitude._progress = {};
	/**
	* The aptitude skills for this actor.
	* @type {Record<number, AptitudeSkill>}
	*/
	this._j._aptitude._learned = {};
	/**
	* The cached result of the {@link #apr} property getter.
	* Null when the cache is cold; invalidated by {@link #onBattlerDataChange}.
	* @type {number|null}
	*/
	this._j._aptitude._cachedApr = null;
};
/**
* Gets the cached APR factor for this actor, or null if the cache is cold.
* @returns {number|null}
*/
Game_Actor.prototype.getCachedApr = function() {
	return this._j._aptitude._cachedApr;
};
/**
* Sets the cached APR factor for this actor.
* @param {number|null} value The new cached value, or null to invalidate.
*/
Game_Actor.prototype.setCachedApr = function(value) {
	this._j._aptitude._cachedApr = value;
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Invalidates the APR factor cache.
*/
J.APT.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.APT.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.setCachedApr(null);
};
/**
* Gets all aptitude progress for this actor.
* @returns {Record<string, AptitudeProgress>}
*/
Game_Actor.prototype.getAllAptitudeProgresses = function() {
	if (!this._j._aptitude) this.initAptitudeMembers();
	return this.progress();
};
/**
* Gets all learned aptitude skills for this actor.
* @returns {Record<number, AptitudeSkill>}
*/
Game_Actor.prototype.getAllAptitudeSkillsLearned = function() {
	if (!this._j._aptitude) this.initAptitudeMembers();
	return this.learned();
};
/**
* Builds per‑skill aptitude aggregates across all current sources on this actor.
* Each aggregate contains the database skill and all per‑source progress rows.
* @returns {AptitudeSkillAggregate[]} The list of aggregates, one per skill id.
*/
Game_Actor.prototype.getAptitudeSkillAggregates = function() {
	const progresses = this.getAllAptitudeProgresses();
	/** @type {{ [skillId: string]: AptitudeSkillAggregate }} */
	const perSkill = {};
	Object.entries(progresses).forEach(([sourceKey, progress]) => {
		Object.entries(progress.learnings()).forEach(([skillIdKey, learning]) => {
			const skillId = Number(skillIdKey);
			if (!perSkill[skillId]) {
				const skillData = this.skill(skillId);
				perSkill[skillId] = new AptitudeSkillAggregate(skillId, skillData);
			}
			const row = new AptitudeSkillSourceProgress(sourceKey, skillId, learning.currentAp, learning.requiredAp, learning.isLearned());
			perSkill[skillId].addSource(row);
		});
	});
	return Object.values(perSkill).sort((a, b) => a.skillId() - b.skillId());
};
/**
* Gets the aptitude progress for the given key.
* @param {string} key The key to get the progress for.
* @returns {AptitudeProgress|null} The aptitude progress for the given key.
*/
Game_Actor.prototype.getAptitudeProgress = function(key) {
	if (!this._j._aptitude) this.initAptitudeMembers();
	return this.progress()[key] ?? null;
};
/**
* Determines whether or not the actor has a progress for the given key.
* @param {string} key The key to check for progress.
* @returns {boolean} True if the actor has progress for the key, false otherwise.
*/
Game_Actor.prototype.hasAptitudeProgress = function(key) {
	return this.progress()[key] !== undefined;
};
/**
* Sets the aptitude progress for the given key, skill id, and current AP.
* @param {string} key The key to set the progress for.
* @param {number} skillId The skill id to learn.
* @param {number} [currentAp] The current AP for the learning; defaults to 0.
*/
Game_Actor.prototype.setAptitudeProgress = function(key, skillId, currentAp = 0) {
	if (this.hasAptitudeProgress(key) === false) return;
	const progress = this.getAptitudeProgress(key);
	progress.setLearning(skillId, currentAp);
};
/**
* Initializes the aptitude progress for the given key, skill id, and current AP.
* @param {string} key The key to create the progress for.
* @param {number} skillId The skill id to learn.
* @param {number} requiredAp The amount of AP required for the learning.
* @param {number} currentAp The current AP for the learning.
*/
Game_Actor.prototype.initializeAptitudeProgress = function(key, skillId, requiredAp, currentAp = 0) {
	const newProgress = this.createAptitudeProgress(key, skillId, requiredAp, currentAp);
	this._j._aptitude._progress[key] = newProgress;
};
/**
* Creates a new aptitude progress for the given key and skill id.
* @param {string} key The key to create the progress for.
* @param {number} skillId The skill id to learn.
* @param {number} requiredAp The amount of AP required for the learning.
* @param {number} initialAp The initial AP to set for the learning.
* @returns {AptitudeProgress} The created aptitude progress.
*/
Game_Actor.prototype.createAptitudeProgress = function(key, skillId, requiredAp, initialAp) {
	const newProgress = new AptitudeProgress(key);
	newProgress.initializeLearning(skillId, requiredAp, initialAp);
	return newProgress;
};
/**
* Gets the aptitude learning for the given key and skill id.
* @param {string} key The key to get the learning for.
* @param {number} skillId The skill id to learn.
* @returns {AptitudeLearning|null} The aptitude learning for the given key and skill id, or null if it doesn't exist.
*/
Game_Actor.prototype.getAptitudeLearning = function(key, skillId) {
	if (this.hasAptitudeProgress(key) === false) return null;
	const progress = this.getAptitudeProgress(key);
	if (progress.hasLearning(skillId) === false) return null;
	return progress.learningBySkillId(skillId);
};
/**
* Gets all aptitude sources for this actor, in a curated display order:
* class, then the actor itself, then equips, then states, then anything else.
* This is typed as {@link RPG_Base}, but can yield many of its subclasses.
* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_State)[]}
*/
Game_Actor.prototype.getAptitudeSources = function() {
	const sources = this.getAllNotes().filter((obj) => obj.isSkill() === false);
	const classes = sources.filter((obj) => obj.isClass());
	const actors = sources.filter((obj) => obj.isActor());
	const equips = sources.filter((obj) => obj.isEquipItem());
	const states = sources.filter((obj) => obj.isState());
	const known = new Set([
		...classes,
		...actors,
		...equips,
		...states
	]);
	const others = sources.filter((obj) => known.has(obj) === false);
	return [
		...classes,
		...actors,
		...equips,
		...states,
		...others
	];
};
/**
* Gets whether or not this actor has the aptitude skill registered.
* @param {number} skillId The skill id to check.
* @returns {boolean} True if the actor has the aptitude skill registered, false otherwise.
*/
Game_Actor.prototype.hasAptitudeSkill = function(skillId) {
	return this.learned()[skillId] !== undefined;
};
/**
* Gets the aptitude skill for the given skill id.
* @param {number} skillId The skill id to check.
* @returns {AptitudeSkill|null} The aptitude skill for the given skill id, or null if it doesn't exist.
*/
Game_Actor.prototype.getAptitudeSkill = function(skillId) {
	return this.learned()[skillId];
};
/**
* Sets the aptitude skill for the given skill id.
* @param {number} skillId The skill id to set.
* @param {AptitudeSkill} aptitudeSkill The aptitude skill to set.
*/
Game_Actor.prototype.setAptitudeSkill = function(skillId, aptitudeSkill) {
	this.learned()[skillId] = aptitudeSkill;
};
/**
* Gets whether or not this actor has learned the given skill from an aptitude.
* @param {number} skillId The skill id to check.
* @returns {boolean} True if the actor has learned the skill, false otherwise.
*/
Game_Actor.prototype.hasLearnedAptitudeSkill = function(skillId) {
	if (this.hasAptitudeSkill(skillId) === false) return false;
	const aptitudeSkill = this.getAptitudeSkill(skillId);
	return aptitudeSkill.learned === true;
};
/**
* Marks the given skill as learned from an aptitude.
* @param {number} skillId The skill id to mark as learned.
* @param {string} sourceKey The source key for the aptitude.
*/
Game_Actor.prototype.learnAptitudeSkill = function(skillId, sourceKey) {
	if (this.hasLearnedAptitudeSkill(skillId)) return;
	if (this.hasAptitudeSkill(skillId) === false) {
		const newAptitudeSkill = this.createAptitudeSkill(skillId);
		this.setAptitudeSkill(skillId, newAptitudeSkill);
	}
	const aptitudeSkill = this.getAptitudeSkill(skillId);
	const aptitudeProgress = this.getAptitudeProgress(sourceKey);
	aptitudeSkill.learnSkill(aptitudeProgress);
};
/**
* Creates a new aptitude skill for the given skill id.
* @param {number} skillId The skill id to create the skill for.
* @param {boolean} [isLearned] Whether or not the skill is already learned; defaults to false.
* @returns {AptitudeSkill} The created aptitude skill.
*/
Game_Actor.prototype.createAptitudeSkill = function(skillId, isLearned = false) {
	return new AptitudeSkill(skillId, isLearned);
};
/**
* Gets the accumulated aptitude progress, keyed by aptitude.
* @returns {Object<string, number>} The progress per aptitude.
*/
Game_Actor.prototype.progress = function() {
	return this._j._aptitude._progress;
};
/**
* Gets the aptitude-granted skills this actor has already learned.
* @returns {Object<string, number[]>} The learned skills per aptitude.
*/
Game_Actor.prototype.learned = function() {
	return this._j._aptitude._learned;
};

//#endregion
//#region src/plugins/apt/core/objects/Game_Troop.js
/**
* Gets the amount of AP earned from all defeated enemies in the troop.
* @returns {number}
*/
Game_Troop.prototype.aptitudeApTotal = function() {
	let ap = 0;
	this.deadMembers().forEach((enemy) => ap += enemy.apPoints);
	return ap;
};

//#endregion
//#region src/plugins/apt/core/managers/ApManager.js
var ApManager = class ApManager {
	/**
	* Awards AP to the given actor, distributing to all active APT sources
	* and resolving any skill learns that cross their thresholds.
	* @param {Game_Actor} actor The actor gaining AP.
	* @param {number} amount The amount of AP awarded.
	* @param {string} cause A short label describing the cause (ex: 'victory').
	*/
	static gainAp(actor, amount, cause = "victory") {
		if (this.canGainAp(actor, amount) === false) return;
		let scaledAmount = amount;
		if (actor.apr) {
			scaledAmount = Math.round(amount * actor.apr);
		}
		if (scaledAmount === 0) return;
		const teachableSources = this.activeTeachables(actor);
		teachableSources.forEach((source) => {
			const { key, teachables } = source;
			this.applyApToSource(actor, key, teachables, scaledAmount, cause);
		});
	}
	/**
	* Determines whether the actor can gain AP.
	* @param {Game_Actor} actor The actor to evaluate.
	* @param {number} amount The amount of AP to check.
	* @returns {boolean} True if the actor can gain AP, false otherwise.
	*/
	static canGainAp(actor, amount) {
		if (actor.isDead()) return false;
		if (amount === 0) return false;
		return true;
	}
	/**
	* Derives a stable key for a source.
	* @param {RPG_Base} source The source to derive a key for.
	* @returns {string} The stable key.
	*/
	static deriveKey(source) {
		return `${source.implementationType()}:${source.id}`;
	}
	/**
	* Resolves a `sourceKey` (as produced by {@link ApManager.deriveKey}) back to the
	* concrete RPG object currently contributing aptitude teachables for the actor.
	*
	* Notes:
	* - This searches the actor’s current aptitude sources and matches by the same
	*   `deriveKey(source)` used during AP distribution, guaranteeing a stable pair.
	* - If the matched source is a skill, this returns the actor’s live skill entry
	*   (`actor.skill(id)`) to mirror the behavior in `#activeTeachables`.
	*
	* @param {Game_Actor} actor - The actor whose sources are searched.
	* @param {string} sourceKey - The stable key (e.g., "@base:usable:skill:17").
	* @returns {RPG_Actor|RPG_Class|RPG_Skill|RPG_Weapon|RPG_Armor|RPG_State|null} - The found source object.
	*/
	static resolveSourceByKey(actor, sourceKey) {
		if (!actor) return null;
		const sources = actor.getAptitudeSources();
		for (let i = 0; i < sources.length; i++) {
			const candidate = sources[i];
			const key = this.deriveKey(candidate);
			if (key === sourceKey) {
				if (candidate.isSkill() === true) {
					return actor.skill(candidate.id);
				}
				return candidate;
			}
		}
		return null;
	}
	/**
	* Resolves a `sourceKey` into a database object (ignores actor state).
	* @param {string} sourceKey The source key driving this step.
	* @returns {RPG_Actor|RPG_Class|RPG_Skill|RPG_Weapon|RPG_Armor|RPG_State|RPG_Item|null}
	*/
	static resolveStaticSourceByKey(sourceKey) {
		const parsed = this.parseKey(sourceKey);
		if (!parsed || Number.isFinite(parsed.id) === false) return null;
		const { types, id } = parsed;
		const terminal = types[types.length - 1];
		switch (terminal) {
			case "skill": return $dataSkills[id] || null;
			case "weapon": return $dataWeapons[id] || null;
			case "armor": return $dataArmors[id] || null;
			case "state": return $dataStates[id] || null;
			case "class": return $dataClasses[id] || null;
			case "actor": return $dataActors[id] || null;
			case "item": return $dataItems[id] || null;
			default: return null;
		}
	}
	static isSourceActive(actor, sourceKey) {
		if (!actor) return false;
		const sources = actor.getAptitudeSources();
		for (let i = 0; i < sources.length; i++) {
			const key = this.deriveKey(sources[i]);
			if (key === sourceKey) return true;
		}
		return false;
	}
	/**
	* Resolves a list of `sourceKey`s into their concrete source objects.
	*
	* @param {Game_Actor} actor - The actor whose sources are searched.
	* @param {string[]} sourceKeys - The list of stable keys to resolve.
	* @returns {(RPG_Base|null)[]} - Array of resolved sources (null where missing).
	*/
	static resolveAllSourcesByKeys(actor, sourceKeys) {
		const keys = Array.isArray(sourceKeys) ? sourceKeys : [];
		const resolved = keys.map((key) => this.resolveSourceByKey(actor, key));
		return resolved;
	}
	/**
	* Parses a `sourceKey` produced by {@link ApManager.deriveKey}.
	*
	* A key looks like: "@base:traited:equip:weapon:12" or "@base:usable:skill:17".
	* The final segment is always the numeric id; all preceding segments are the
	* type chain assembled via `implementationType()` across the inheritance stack.
	*
	* @param {string} sourceKey - The stable key to parse.
	* @returns {{ types: string[], id: number }} - The parsed components.
	*/
	static parseKey(sourceKey) {
		const parts = String(sourceKey).split(":");
		if (parts.length < 2) {
			return {
				types: [],
				id: NaN
			};
		}
		const idText = parts[parts.length - 1];
		const id = Number(idText);
		const types = parts.slice(0, parts.length - 1);
		return {
			types,
			id
		};
	}
	/**
	* Builds the list of currently active APT sources for the actor.
	* Each source contains a stringy `key` and a {@link AptitudeTeachable[]} `teachables`.
	* @param {Game_Actor} actor The actor to evaluate.
	* @returns {{ key: string, teachables: AptitudeTeachable[] }[]} The active teachable sources.
	*/
	static activeTeachables(actor) {
		const sources = actor.getAptitudeSources();
		const foundKeys = new Set();
		const results = [];
		sources.forEach((source) => {
			const key = this.deriveKey(source);
			if (foundKeys.has(key)) return;
			let trueSource = source;
			if (source.isSkill()) {
				trueSource = actor.skill(source.id);
			}
			const teachables = trueSource.aptitudeTeachings;
			if (teachables.length === 0) return;
			foundKeys.add(key);
			results.push({
				key,
				teachables
			});
		});
		return results;
	}
	/**
	* Applies AP to all relevant skill tracks for a single source, then resolves learns.
	* @param {Game_Actor} actor The actor gaining AP.
	* @param {string} sourceKey The stable key for this source.
	* @param {AptitudeTeachable[]} teachables The skills this source teaches.
	* @param {number} amount The AP awarded for this tick.
	* @param {string} cause The cause string for debugging/toasts.
	*/
	static applyApToSource(actor, sourceKey, teachables, amount, cause) {
		teachables.forEach((teachable) => {
			const { skillId, requiredAp } = teachable;
			if (actor.hasLearnedAptitudeSkill(skillId)) return;
			if (actor.hasAptitudeProgress(sourceKey) === false) {
				actor.initializeAptitudeProgress(sourceKey, skillId, requiredAp, 0);
			}
			const aptitudeProgress = actor.getAptitudeProgress(sourceKey);
			if (aptitudeProgress.hasLearning(skillId) === false) {
				aptitudeProgress.initializeLearning(skillId, requiredAp, 0);
			}
			const aptitudeLearning = aptitudeProgress.learningBySkillId(skillId);
			aptitudeLearning.setRequiredAp(requiredAp);
			const before = aptitudeLearning.currentAp;
			const unclamped = before + amount;
			const after = Math.max(0, Math.min(unclamped, requiredAp));
			actor.setAptitudeProgress(sourceKey, skillId, after);
			if (aptitudeLearning.isLearned()) {
				this.#resolveLearn(actor, sourceKey, skillId, cause);
			}
		});
	}
	/**
	* Re-syncs the requiredAp on every persisted aptitude learning for this actor to
	* match the current live notetag values on their sources.
	*
	* Normal AP gain only re-syncs a learning's requiredAp the next time that specific
	* source actually grants AP (see {@link ApManager.applyApToSource}), so a save that
	* started a learning before a notetag was retuned would otherwise be stuck honoring
	* the stale value forever. Use this to repair such a save after tuning notetags
	* mid-playtest, without needing to grind AP to touch every learning again.
	* @param {Game_Actor} actor The actor to refresh aptitude requirements for.
	*/
	static refreshRequiredAp(actor) {
		const progresses = actor.getAllAptitudeProgresses();
		Object.entries(progresses).forEach(([sourceKey, progress]) => {
			const source = this.resolveStaticSourceByKey(sourceKey);
			if (!source) return;
			const teachables = source.aptitudeTeachings;
			teachables.forEach((teachable) => {
				if (progress.hasLearning(teachable.skillId) === false) return;
				progress.learningBySkillId(teachable.skillId).setRequiredAp(teachable.requiredAp);
			});
		});
	}
	/**
	* Resolves learning the skill permanently and emits any feedback.
	* @param {Game_Actor} actor The actor learning a skill.
	* @param {string} sourceKey The source that triggered the learn.
	* @param {number} skillId The id of the learned skill.
	* @param {string} cause A short label describing why this occurred.
	*/
	static #resolveLearn(actor, sourceKey, skillId, cause) {
		actor.learnAptitudeSkill(skillId, sourceKey);
		if (actor.isLearnedSkill(skillId) === false) {
			actor.learnSkill(skillId);
		}
		this.#handleSkillLearnedLog(actor, sourceKey, skillId);
	}
	/**
	* Generates a dia log announcing that an actor learned a skill from one of their aptitude sources.
	* The skill's own message fields act as per-skill overrides for either line, allowing an author to
	* give a notable skill its own voice without touching this default phrasing.
	* @param {Game_Actor} actor The actor who learned the skill.
	* @param {string} sourceKey The key of the aptitude source that taught the skill.
	* @param {number} skillId The id of the skill that was learned.
	*/
	static #handleSkillLearnedLog(actor, sourceKey, skillId) {
		if (!J.LOG) return;
		const skill = actor.skill(skillId);
		const source = ApManager.resolveSourceByKey(actor, sourceKey);
		const sourceName = source ? source.name : "training";
		const headline = skill.message1 || `\\C[1]${actor.name()}\\C[0] learned \\C[1]${skill.name}\\C[0] from ${sourceName} aptitudes!`;
		const instruction = skill.message2 || "Equip it from the skills menu to use it.";
		const log = new DiaLogBuilder().addLine(headline).addLine(instruction).setFaceName(actor.faceName()).setFaceIndex(actor.faceIndex()).build();
		$diaLogManager.addLog(log);
	}
};

//#endregion
//#region src/plugins/apt/core/managers/TextManager.js
/**
* Display label for aptitude rate — bonus multiplier on aptitude point gains.
* @returns {string}
*/
TextManager.aptRate = function() {
	return "Aptitude UP";
};
/**
* Help text explaining how aptitude rate accelerates skill mastery tracks.
* @returns {string[]}
*/
TextManager.aptRateDescription = function() {
	return ["Bonus multiplier applied to aptitude point gains.", "Higher values accelerate skill mastery through aptitude tracks."];
};

//#endregion
//#region src/plugins/apt/core/managers/IconManager.js
/**
* Icon index for aptitude rate bonus in parameter and CMS displays.
* @returns {number}
*/
IconManager.aptRate = function() {
	return 79;
};

//#endregion
//#region src/plugins/apt/core/core/registerAptParameters.js
/**
* Boot-time registration for J-Aptitude parameters in {@link ParameterRegistry}.
*/
var AptParameterRegistration = class {
	/**
	* Registers aptitude point gain multiplier with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("apr").group(ParameterGroups.FATE).sortOrder(7).label(() => TextManager.aptRate()).description(() => TextManager.aptRateDescription()).iconIndex(() => IconManager.aptRate()).format(ParameterFormat.PERCENT_CENTERED).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.apr).sdpBinding(SdpParameterBinding.byKey("apr", () => 1)).build());
	}
};

//#endregion
//#region src/plugins/apt/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Aptitude stats with the parameter catalog after vanilla seeding.
*/
J.APT.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.APT.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	AptParameterRegistration.registerAll();
};

//#endregion
//#region src/plugins/apt/core/managers/BattleManager.js
/**
* Extends {@link #makeRewards}.<br/>
* Also includes the aptitude AP earned.
*/
J.APT.Aliased.BattleManager.set("makeRewards", BattleManager.makeRewards);
BattleManager.makeRewards = function() {
	J.APT.Aliased.BattleManager.get("makeRewards").call(this);
	this.setRewards({
		...this.rewards(),
		aptitudeAp: $gameTroop.aptitudeApTotal()
	});
};
/**
* Extends {@link #gainRewards}.<br/>
* Also awards the aptitude AP to party members via ApManager.
*/
J.APT.Aliased.BattleManager.set("gainRewards", BattleManager.gainRewards);
BattleManager.gainRewards = function() {
	J.APT.Aliased.BattleManager.get("gainRewards").call(this);
	this.gainAptitudeApRewards();
};
/**
* Performs the AP award for all members of the party after battle.
*/
BattleManager.gainAptitudeApRewards = function() {
	const { aptitudeAp } = this.rewards();
	if (!aptitudeAp) return;
	$gameParty.members().forEach((actor) => ApManager.gainAp(actor, aptitudeAp, "victory"));
};
/**
* Extends {@link #displayRewards}.<br/>
* Also displays the AP victory text.
*/
J.APT.Aliased.BattleManager.set("displayRewards", BattleManager.displayRewards);
BattleManager.displayRewards = function() {
	this.displayAptitudeAp();
	J.APT.Aliased.BattleManager.get("displayRewards").call(this);
};
/**
* Displays the AP victory text in the victory log.
*/
BattleManager.displayAptitudeAp = function() {
	const { aptitudeAp } = this.rewards();
	if (!aptitudeAp) return;
	const text = `\\. ${aptitudeAp} AP gained`;
	$gameMessage.add(text);
};

//#endregion
//#region src/plugins/apt/core/_models/JABS_Battler.js
if (J.ABS) {
	/**
	* Extends {@link #gainBasicRewards}.<br/>
	* Also includes AP when defeating an enemy.
	* @param {Game_Battler} enemy The target battler that was defeated.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	*/
	J.APT.Aliased.JABS_Engine.set("gainBasicRewards", JABS_Engine.prototype.gainBasicRewards);
	JABS_Engine.prototype.gainBasicRewards = function(enemy, actor) {
		J.APT.Aliased.JABS_Engine.get("gainBasicRewards").call(this, enemy, actor);
		const ap = this.determineApGained(enemy);
		this.gainAptitudeReward(ap, actor, enemy);
	};
	/**
	* Determines how many AP the defeated enemy yielded before per-member level scaling.
	* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
	* @returns {number} The base AP gained.
	*/
	JABS_Engine.prototype.determineApGained = function(defeatedEnemy) {
		if (this.canGainReward(defeatedEnemy, null) === false) return 0;
		return defeatedEnemy.apPoints();
	};
	/**
	* Gains AP from battle rewards.
	* @param {number} ap The AP to gain.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	* @param {Game_Enemy} enemy The map battler that was defeated.
	*/
	JABS_Engine.prototype.gainAptitudeReward = function(ap, actor, enemy) {
		if (ap === 0) return;
		$gameParty.members().filter((member) => this.canGainAptitudeReward(member, enemy)).forEach((member) => {
			const jabsBattler = JABS_AiManager.getBattlerByUuid(member.getUuid());
			if (!jabsBattler) return;
			const levelMultiplier = this.getRewardScalingMultiplier(enemy, jabsBattler);
			const actualAp = Math.ceil(ap * levelMultiplier);
			ApManager.gainAp(member, actualAp, "on-kill");
			this.createLogAp(actualAp, jabsBattler);
		});
	};
	/**
	* Determines whether or not the actor can gain AP from the enemy.
	* @param {Game_Actor} actor The map battler that defeated the target.
	* @param {Game_Enemy} enemy The map battler that was defeated.
	* @returns {boolean} True if the actor can gain AP, false otherwise.
	*/
	JABS_Engine.prototype.canGainAptitudeReward = function(actor, enemy) {
		if (J.LEVEL && $gameSystem.isLevelScalingEnabled() && J.APT.Metadata.usingLevelThresholdLimit === true) {
			const levelDifference = actor.level - enemy.level;
			if (levelDifference > J.APT.Metadata.maxLevelThreshold) return false;
		}
		return true;
	};
	/**
	* Creates the log entry.
	* @param {number} apPoints The AP gained.
	* @param {JABS_Battler} battler The battler gaining the AP.
	*/
	JABS_Engine.prototype.createLogAp = function(apPoints, battler) {
		if (!J.LOG) return;
		const apLog = new ActionLogBuilder().setMessage(`\\C[16]${battler.battlerName()}\\C[0] gained \\C[29]\\*${apPoints}\\*\\C[0] AP.`).build();
		$actionLogManager.addLog(apLog);
	};
}

//#endregion
//#region src/plugins/apt/core/windows/Window_AptitudeRibbon.js
/**
* The ribbon window for the Aptitude scene.
*/
var Window_AptitudeRibbon = class extends Window_ActorRibbon {
	/**
	* The target to show a hint for when the view is toggled.
	* @type {string}
	*/
	_toggleHintTarget = String.empty;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the ribbon in.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Gets the target to show a hint for when the view is toggled.
	* @returns {string}
	*/
	toggleHintTarget() {
		return this._toggleHintTarget;
	}
	/**
	* Sets the target to show a hint for when the view is toggled.
	* @param {string} target The target to show a hint for.
	*/
	setToggleHintTarget(target) {
		if (this._toggleHintTarget === target) return;
		this._toggleHintTarget = target;
		this.refresh();
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Adds the toggle hint target.
	*/
	initMembers() {
		super.initMembers();
		this._toggleHintTarget = String.empty;
	}
	/**
	* Draws the actor face in the ribbon.
	*/
	drawActorRibbon() {
		super.drawActorRibbon();
		this.drawActorName();
		this.drawHint();
	}
	/**
	* Draws the actor's name.
	*/
	drawActorName() {
		const actor = this.actor();
		const [x, y] = this.faceCoordinates();
		const [w] = this.faceSize();
		const name = actor.name();
		const nameX = x + w + 16;
		const nameWidth = this.contents.measureTextWidth(name);
		this.drawText(name, nameX, y, nameWidth);
	}
	/**
	* Draws the hint for the current view.
	*/
	drawHint() {
		const target = this.toggleHintTarget();
		const hint = `\\I[2450]/\\I[2434]: see ${target}.`;
		const textW = this.contents.measureTextWidth(hint);
		const [x, y] = this.faceCoordinates();
		const [w, h] = this.faceSize();
		const textX = x + 64;
		const textY = y + h;
		this.drawTextEx(hint, textX, textY, textW);
	}
};

//#endregion
//#region src/plugins/apt/core/windows/Window_AptitudeAggregateList.js
/**
* The window containing the list of aptitude skill aggregations for an actor.
*/
var Window_AptitudeAggregateList = class extends Window_Command {
	/**
	* The actor bound to this window.
	* @type {Game_Actor|null}
	*/
	_actor = null;
	/**
	* The list of aggregates bound to this window.
	* @type {AptitudeSkillAggregate[]}
	*/
	_aggregates = [];
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes the members of this window.
	*/
	initMembers() {
		this._actor = null;
		this._aggregates = [];
	}
	/**
	* Gets the actor that is bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor for this window.
	* @param {Game_Actor} actor The actor to bind.
	*/
	setActor(actor) {
		if (this._actor === actor) return;
		this._actor = actor;
		this.refresh();
	}
	/**
	* Get the list of aggregates that are bound to this window.
	* @returns {AptitudeSkillAggregate[]}
	*/
	aggregates() {
		return this._aggregates;
	}
	/**
	* Sets the prebuilt aggregates for rendering.
	* @param {AptitudeSkillAggregate[]} aggregates The list of aggregates to render.
	*/
	setAggregates(aggregates) {
		this._aggregates = aggregates || [];
		this.refresh();
	}
	/**
	* Rebuilds the command list for the current actor.
	*/
	makeCommandList() {
		if (this.actor() === null) return;
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const aggregates = this.aggregates();
		if (aggregates.length === 0) return [];
		const commands = aggregates.map(this.buildCommand, this);
		return commands;
	}
	/**
	* Builds a single command for the given aggregate.
	* @param {AptitudeSkillAggregate} aggregate The aggregate to build a command for.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(aggregate) {
		const learned = aggregate.learnedAny();
		const rightText = learned === true ? "DONE" : `${aggregate.currentAp()}/${aggregate.requiredAp()}`;
		let rightColor = 7;
		if (learned === true) {
			rightColor = 11;
		} else if (aggregate.currentAp() > 0) {
			rightColor = 6;
		}
		const builtWindowCommand = new WindowCommandBuilder(aggregate.name()).setSymbol(`skill:${aggregate.skillId()}`).setExtensionData(aggregate).setIconIndex(aggregate.iconIndex()).setRightText(rightText).setRightColorIndex(rightColor).setEnabled(learned === false).build();
		return builtWindowCommand;
	}
};

//#endregion
//#region src/plugins/apt/core/windows/Window_AptitudeSourceList.js
/**
* A window listing all aptitude sources currently applied to the actor.
*/
var Window_AptitudeSourceList = class extends Window_Command {
	/**
	* The actor bound to this window.
	* @type {Game_Actor|null}
	*/
	_actor = null;
	/**
	* The list of sources bound to this window.
	* @type {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
	*/
	_sources = [];
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes the members of this window.
	*/
	initMembers() {
		this._actor = null;
		this._sources = [];
	}
	/**
	* Gets the actor that is bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor for this window.
	* @param {Game_Actor} actor The actor to bind.
	*/
	setActor(actor) {
		this._actor = actor;
	}
	/**
	* The
	* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
	*/
	sources() {
		return this._sources;
	}
	/**
	* Sets the sources for this window.
	* @param {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]} sources The new sources.
	*/
	setSources(sources) {
		this._sources = sources;
		this.refresh();
	}
	/**
	* Rebuilds the command list for the current actor.
	*/
	makeCommandList() {
		if (this.actor() === null) return;
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const sources = this.sources();
		if (sources.length === 0) return [];
		const commands = sources.map(this.buildCommand, this);
		return commands;
	}
	/**
	* Builds a single command for the given source.
	* @param {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State} source The source.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(source) {
		let { iconIndex } = source;
		if (source.isActor()) {
			iconIndex = 2727;
		} else if (source.isClass()) {
			iconIndex = 2694;
		}
		const builtWindowCommand = new WindowCommandBuilder(source.name).setSymbol(`source:${source.implementationType()}`).setExtensionData(source).setIconIndex(iconIndex).build();
		return builtWindowCommand;
	}
};

//#endregion
//#region src/plugins/apt/core/windows/Window_AptitudeAggregateDetails.js
/**
* The window containing the details of an aptitude skill aggregate.
*/
var Window_AptitudeAggregateDetails = class extends Window_Base {
	/**
	* The actor bound to this window.
	* @type {Game_Actor|null}
	*/
	_actor = null;
	/**
	* The selected entry for display.
	* @type {AptitudeSkillAggregate|null}
	*/
	_aggregate = null;
	/**
	* The y position of the next block to draw.
	* @type {number}
	*/
	_nextY = 0;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
		this.refresh();
	}
	/**
	* Initializes the members of this window.
	*/
	initMembers() {
		this._actor = null;
		this._aggregate = null;
		this._nextY = 0;
	}
	/**
	* The actor bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor for this window.
	* @param {Game_Actor} actor The actor to bind.
	*/
	setActor(actor) {
		if (this.actor() === actor) return;
		this.setActor(actor);
		this._aggregate = null;
		this.refresh();
	}
	/**
	* The selected aggregate for display.
	* @returns {AptitudeSkillAggregate|null}
	*/
	aggregate() {
		return this._aggregate;
	}
	/**
	* Sets the selected aggregate for display.
	* @param {AptitudeSkillAggregate|null} aggregate The selected aggregate or null to clear.
	*/
	setAggregate(aggregate) {
		if (this.aggregate() === aggregate) return;
		this._aggregate = aggregate;
		this.refresh();
	}
	/**
	* The y position of the next block to draw.
	* @returns {number}
	*/
	nextY() {
		return this._nextY;
	}
	/**
	* Sets the next y position for drawing.
	* @param {number} y The y position to set.
	*/
	setNextY(y) {
		this._nextY = y;
	}
	/**
	* Implements {@link #drawContent}.<br/>
	* Draws the details for the selected aggregate.
	*/
	drawContent() {
		if (!this.aggregate() || !this.actor()) {
			this.resetTextColor();
			this.drawText("Select a skill from the list.", 0, 0, this.contentsWidth());
			return;
		}
		this.setNextY(0);
		this.drawHeader();
		this.drawSources();
	}
	/**
	* Draws the header containing the icon+name and learned badge.
	*/
	drawHeader() {
		const aggregate = this.aggregate();
		const skill = this.actor().skill(aggregate.skillId());
		let y = this.nextY();
		if (skill.iconIndex > 0) {
			this.drawIcon(skill.iconIndex, 0, y);
		}
		const left = skill.iconIndex > 0 ? 36 : 0;
		this.changeTextColor(this.systemColor());
		this.drawText(`${skill.name}`, left, y, this.contentsWidth() - left);
		if (aggregate.learnedAny() === true) {
			this.resetTextColor();
			this.drawText("[LEARNED]", 0, y, this.contentsWidth(), "right");
		}
		y += this.lineHeight();
		this.changeTextColor(ColorManager.normalColor());
		const wrappedText = this.modFontSizeForText(-4, skill.description);
		this.drawTextEx(wrappedText, 0, y, this.contentsWidth());
		y += this.lineHeight() * 2;
		this.setNextY(y);
	}
	/**
	* Draws the sources for the selected entry.
	*/
	drawSources() {
		const aggregate = this.aggregate();
		const baseY = this.nextY() + this.lineHeight();
		this.changeTextColor(this.systemColor());
		this.drawTextEx("\\I[86]\\C[16]Sources\\C[0]", 0, baseY, this.contentsWidth());
		const updatedY = baseY + this.lineHeight();
		this.setNextY(updatedY);
		aggregate.sources().forEach(this.drawSource, this);
	}
	/**
	* Draws a single source row.
	* @param {AptitudeSkillSourceProgress} sourceProgress - The per-source progress to draw for this skill.
	*/
	drawSource(sourceProgress) {
		const y = this.nextY();
		const leftW = Math.floor(this.contentsWidth() * .6);
		const databaseSource = ApManager.resolveStaticSourceByKey(sourceProgress.sourceKey());
		if (!databaseSource) return;
		const isActive = ApManager.isSourceActive(this.actor(), sourceProgress.sourceKey());
		let { iconIndex } = databaseSource;
		if (databaseSource.isActor()) {
			iconIndex = 2727;
		} else if (databaseSource.isClass()) {
			iconIndex = 2694;
		}
		let { name } = databaseSource;
		let activityColorIndex = 0;
		if (isActive === false) {
			activityColorIndex = 7;
			name += " (inactive)";
		}
		this.drawTextEx(`\\C[${activityColorIndex}]\\I[${iconIndex}]${name}\\C[0]`, 0, y, leftW);
		this.drawExtensionData(sourceProgress, 0 + leftW, y);
		const learned = sourceProgress.learned() === true;
		const knownElsewhere = learned === false && sourceProgress.currentAp() < sourceProgress.requiredAp() && this.actor().hasSkill(sourceProgress.skillId());
		let rightText;
		if (learned === true) {
			rightText = "DONE";
		} else if (knownElsewhere === true) {
			rightText = "KNOWN";
		} else {
			rightText = `${sourceProgress.currentAp()}/${sourceProgress.requiredAp()}`;
		}
		let rightColor = 7;
		if (learned === true) {
			rightColor = 11;
		} else if (sourceProgress.currentAp() > 0) {
			rightColor = isActive ? 6 : 7;
		}
		this.changeTextColor(ColorManager.textColor(rightColor));
		const rightW = this.contentsWidth() - leftW;
		this.drawText(rightText, 0, y, rightW, Window_Base.TextAlignments.Right);
		const shouldDrawGauge = learned === false && knownElsewhere === false;
		if (shouldDrawGauge === true) {
			this.drawProgressGauge(sourceProgress.currentAp(), sourceProgress.requiredAp(), isActive);
		}
		this.setNextY(y + this.lineHeight());
	}
	/**
	* Extension hook for drawing additional per-source information (such as typed badges).
	* @param {AptitudeSkillSourceProgress} sourceProgress - The per-source progress for this skill.
	* @param {number} x - The row's x coordinate.
	* @param {number} y - The row's y coordinate.
	*/
	drawExtensionData(sourceProgress, x, y) {}
	/**
	* Draws a gauge for a progress of the skill for this source.
	* @param {number} currentAp The current AP for the progress.
	* @param {number} requiredAp The required AP for the progress.
	* @param {boolean} isActive Whether the source is currently active.
	*/
	drawProgressGauge(currentAp, requiredAp, isActive) {
		const y = this.nextY();
		const gaugeX = Math.floor(this.contentsWidth() * .4);
		const gaugeY = y + Math.round(this.lineHeight() / 2) - Math.round(this.gaugeHeight() / 2);
		const rect = new Rectangle(gaugeX, gaugeY, this.gaugeWidth(), this.gaugeHeight());
		const progressRate = Math.max(0, Math.min(currentAp / requiredAp, 1));
		const leftGaugeColor = isActive ? this.gaugeColor1() : this.inactiveColor1();
		const rightGaugeColor = isActive ? this.gaugeColor2() : this.inactiveColor2();
		const segOpts = WindowGaugeOptions.Builder().gaugeType(Window_Base.GAUGE_TYPES.Segmented).segments(Math.max(1, Math.ceil(requiredAp / this.segmentValue()))).gap(2).leftGradientColor(leftGaugeColor).rightGradientColor(rightGaugeColor).build();
		this.drawGauge(rect, progressRate, segOpts);
	}
	/**
	* The width of the gauges in this window.
	* @returns {number}
	*/
	gaugeWidth() {
		return 200;
	}
	/**
	* The height of the gauges in this window.
	* @returns {number}
	*/
	gaugeHeight() {
		return 12;
	}
	/**
	* The back color of the gauges in this window.
	* @returns {string}
	*/
	gaugeBackColor() {
		return "rgba(255, 255, 255, 0.1)";
	}
	/**
	* The color to gradient from.
	* Defaults to blue.
	* @returns {string}
	*/
	gaugeColor1() {
		return "rgba(179, 89, 0, 1)";
	}
	/**
	* The color to gradient into.
	* Defaults to green.
	* @returns {string}
	*/
	gaugeColor2() {
		return "rgba(255, 166, 77, 1)";
	}
	inactiveColor1() {
		return "rgba(77, 77, 77, 1)";
	}
	inactiveColor2() {
		return "rgba(153, 153, 153, 1)";
	}
	/**
	* The amount that one segment represents.
	* @returns {number}
	*/
	segmentValue() {
		return 10;
	}
};

//#endregion
//#region src/plugins/apt/core/windows/Window_AptitudeSourceDetails.js
/**
* A window displaying details about a specific aptitude source.
*/
var Window_AptitudeSourceDetails = class extends Window_Base {
	/**
	* The actor bound to this window.
	* @type {Game_Actor|null}
	*/
	_actor = null;
	/**
	* The source bound to this window.
	* @type {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State|null}
	*/
	_source = null;
	/**
	* The y position of the next block to draw.
	* @type {number}
	*/
	_nextY = 0;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle to draw the window in.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
		this.refresh();
	}
	/**
	* Initializes the members of this window.
	*/
	initMembers() {
		this._actor = null;
		this._source = null;
		this._nextY = 0;
	}
	/**
	* Gets the actor that is bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Sets the actor for this window.
	* @param {Game_Actor} actor The actor to bind.
	*/
	setActor(actor) {
		this._actor = actor;
	}
	/**
	* Gets the source that is bound to this window.
	* @returns {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State|null}
	*/
	source() {
		return this._source;
	}
	/**
	* Sets the source for this window.
	* @param {RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State} source The new source.
	*/
	setSource(source) {
		if (this.source() === source) return;
		this._source = source;
		this.refresh();
	}
	/**
	* The y position of the next block to draw.
	* @returns {number}
	*/
	nextY() {
		return this._nextY;
	}
	/**
	* Sets the next y position for drawing.
	* @param {number} y The y position to set.
	*/
	setNextY(y) {
		this._nextY = y;
	}
	/**
	* Implements {@link #drawContent}.<br/>
	* Draws the details for the selected source.
	*/
	drawContent() {
		if (!this.source() || !this.actor()) {
			this.resetTextColor();
			this.drawText("Select a source from the list.", 0, 0, this.contentsWidth());
			return;
		}
		this.setNextY(0);
		this.drawHeader();
		this.drawSourceDetails();
	}
	/**
	* Draws the header containing the icon and name.
	*/
	drawHeader() {
		const source = this.source();
		let y = this.nextY();
		if (source.iconIndex > 0) {
			this.drawIcon(source.iconIndex, 0, y);
		}
		const left = source.iconIndex > 0 ? 36 : 0;
		this.changeTextColor(this.systemColor());
		this.drawText(`${source.name}`, left, y, this.contentsWidth() - left);
		y += this.lineHeight();
		let description;
		if (source.isActor()) {
			description = source.profile;
		} else if (source.isClass()) {
			description = "The class applied to the current actor.";
		} else if (source.isState()) {
			description = "A state applied to the actor.";
		} else {
			({description} = source);
		}
		const wrappedText = this.modFontSizeForText(-4, description);
		this.drawTextEx(wrappedText, 0, y, this.contentsWidth());
		y += this.lineHeight() * 3;
		this.setNextY(y);
	}
	/**
	* Draws the details for the source.
	* This includes the learnable skills and their progress.
	*/
	drawSourceDetails() {
		const source = this.source();
		const baseY = this.nextY();
		this.drawTextEx(`\\I[79]\\C[16]Skills\\C[0]`, 0, baseY, this.contentsWidth());
		const updatedY = baseY + this.lineHeight();
		this.setNextY(updatedY);
		const teachables = source.aptitudeTeachings;
		if (teachables.length === 0) {
			this.resetTextColor();
			this.drawText("No teachable skills available.", 0, this.nextY(), this.contentsWidth());
			return;
		}
		teachables.forEach(this.drawTeachable, this);
	}
	/**
	* Draws the details for a single teachable.
	* @param {AptitudeTeachable} teachable The teachable to render.
	*/
	drawTeachable(teachable) {
		const actor = this.actor();
		const sourceKey = ApManager.deriveKey(this.source());
		const x = 0;
		const nextY = this.nextY();
		const leftW = Math.floor(this.contentsWidth() * .6);
		const { requiredAp, skillId } = teachable;
		const skill = actor.skill(skillId);
		const learning = actor.getAptitudeLearning(sourceKey, skillId);
		const hasLearning = learning !== null;
		this.drawTextEx(`\\I[${skill.iconIndex}]${skill.name}`, x, nextY, leftW);
		this.drawExtensionData(teachable, sourceKey, x + leftW, nextY);
		const currentAp = hasLearning ? learning.currentAp : 0;
		const learned = hasLearning && learning.isLearned() === true;
		const knownElsewhere = learned === false && this.actor().hasSkill(skillId);
		let rightText;
		if (learned === true) {
			rightText = "DONE";
		} else if (knownElsewhere === true) {
			rightText = "KNOWN";
		} else {
			rightText = `${currentAp}/${requiredAp}`;
		}
		let rightColor = 7;
		if (learned === true) {
			rightColor = 11;
		} else if (currentAp > 0) {
			rightColor = 6;
		}
		this.changeTextColor(ColorManager.textColor(rightColor));
		const rightW = this.contentsWidth() - leftW;
		this.drawText(rightText, 0, nextY, rightW, Window_Base.TextAlignments.Right);
		const shouldDrawGauge = learned === false && knownElsewhere === false;
		if (shouldDrawGauge === true) {
			this.drawTeachableGauge(currentAp, requiredAp);
		}
		this.setNextY(nextY + this.lineHeight());
	}
	/**
	* Draws a gauge for a teachable skill.
	* @param {number} currentAp The current AP for the teachable.
	* @param {number} requiredAp The required AP for the teachable.
	*/
	drawTeachableGauge(currentAp, requiredAp) {
		const nextY = this.nextY();
		const gaugeX = Math.floor(this.contentsWidth() * .4);
		const gaugeY = nextY + Math.round(this.lineHeight() / 2) - Math.round(this.gaugeHeight() / 2);
		const rect = new Rectangle(gaugeX, gaugeY, this.gaugeWidth(), this.gaugeHeight());
		const progressRate = Math.max(0, Math.min(currentAp / requiredAp, 1));
		const segOpts = WindowGaugeOptions.Builder().gaugeType(Window_Base.GAUGE_TYPES.Segmented).segments(Math.max(1, Math.ceil(requiredAp / this.segmentValue()))).gap(2).leftGradientColor(this.gaugeColor1()).rightGradientColor(this.gaugeColor2()).build();
		this.drawGauge(rect, progressRate, segOpts);
	}
	/**
	* Extension hook for drawing additional teachable information.
	* @param {AptitudeTeachable} teachable - The teachable being rendered.
	* @param {string} sourceKey - The stable key for the source currently displayed.
	* @param {number} x - The row's x coordinate.
	* @param {number} y - The row's y coordinate.
	*/
	drawExtensionData(teachable, sourceKey, x, y) {}
	/**
	* The width of the gauges in this window.
	* @returns {number}
	*/
	gaugeWidth() {
		return 200;
	}
	/**
	* The height of the gauges in this window.
	* @returns {number}
	*/
	gaugeHeight() {
		return 12;
	}
	/**
	* The back color of the gauges in this window.
	* @returns {string}
	*/
	gaugeBackColor() {
		return "rgba(255, 255, 255, 0.1)";
	}
	/**
	* The color to gradient from.
	* Defaults to blue.
	* @returns {string}
	*/
	gaugeColor1() {
		return "rgba(179, 89, 0, 1)";
	}
	/**
	* The color to gradient into.
	* Defaults to green.
	* @returns {string}
	*/
	gaugeColor2() {
		return "rgba(255, 166, 77, 1)";
	}
	/**
	* The amount that one segment represents.
	* @returns {number}
	*/
	segmentValue() {
		return 10;
	}
};

//#endregion
//#region src/plugins/apt/core/scenes/Scene_Aptitude.js
/**
* The scene for viewing aptitude progress.
*/
var Scene_Aptitude = class Scene_Aptitude extends Scene_MenuBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* The available view modes for the aptitude windows.
	*/
	static viewMode = {
		/**
		* The view mode for viewing aggregates of aptitudes.
		*/
		AGGREGATE: "aggregate",
		/**
		* The view mode for viewing aptitude sources.
		*/
		SOURCE: "source"
	};
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the aptitude members.
	*/
	initMembers() {
		super.initMembers();
		this.initCoreMembers();
		this.initPrimaryMembers();
	}
	/**
	* Gets the j.
	* @returns {*} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Initializes the core aptitude members.
	*/
	initCoreMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* A grouping of all properties associated with the aptitude system.
		*/
		this._j._aptitude = {};
	}
	/**
	* Initializes the primary members for the scene.
	*/
	initPrimaryMembers() {
		/**
		* The last index tracked in the aggregate list window, per-actor.
		* Keyed by actorId → number.
		* @type {{[actorId:number]: number}}
		*/
		this._j._aptitude._lastAggregateIndexByActor = {};
		/**
		* The last index tracked in the source list window, per-actor.
		* Keyed by actorId → number.
		* @type {{[actorId:number]: number}}
		*/
		this._j._aptitude._lastSourceIndexByActor = {};
		/**
		* The current view mode for the aptitude windows.
		* Toggle between "aggregate" and "source" views.
		* @type {string}
		*/
		this._j._aptitude._viewMode = Scene_Aptitude.viewMode.AGGREGATE;
		/**
		* The aptitude aggregates for the current actor.
		* @type {AptitudeSkillAggregate[]}
		*/
		this._j._aptitude._aggregates = [];
		/**
		* The aptitude sources for the current actor.
		* @type {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
		*/
		this._j._aptitude._sources = [];
		/**
		* A grouping of all windows for this scene.
		*/
		this._j._aptitude._windows = {};
		/**
		* The ribbon window to display the actor and their name.
		* @type {Window_AptitudeRibbon|null}
		*/
		this._j._aptitude._windows._ribbon = null;
		/**
		* The list window that displays the per-skill aggregates.
		* @type {Window_AptitudeAggregateList|null}
		*/
		this._j._aptitude._windows._aggregateList = null;
		/**
		* The list window that displays the actor's sources.
		* @type {Window_AptitudeSourceList|null}
		*/
		this._j._aptitude._windows._sourceList = null;
		/**
		* The details window that displays all sources and respective progress towards learning the skill.
		* @type {Window_AptitudeAggregateDetails|null}
		*/
		this._j._aptitude._windows._aggregateDetails = null;
		/**
		* The details window that displays what this aptitude source is teaching.
		* @type {Window_AptitudeSourceDetails|null}
		*/
		this._j._aptitude._windows._sourceDetails = null;
	}
	/**
	* Applies initial visibility and selection to match the current view mode.
	* Ensures index 0 is selected (or the remembered index) and details are set.
	*/
	initializeView() {
		this.resetSelectionTrackers();
		const startIndex = this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE ? this.lastAggregateIndex() : this.lastSourceIndex();
		if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE) {
			this.hideSourceWindows();
			this.showAggregateWindows();
			this.refreshSelectionForCurrentView(startIndex);
		} else {
			this.hideAggregateWindows();
			this.showSourceWindows();
			this.refreshSelectionForCurrentView(startIndex);
		}
	}
	/**
	* Gets the last index tracked in the aggregate list window for the current actor.
	* @returns {number}
	*/
	lastAggregateIndex() {
		const actorId = this.actor().actorId();
		const map = this.j()._aptitude._lastAggregateIndexByActor;
		if (map[actorId] === undefined) {
			map[actorId] = 0;
		}
		return map[actorId];
	}
	/**
	* Sets the last index tracked in the aggregate list window for the current actor.
	* @param {number} index - The new index to track.
	*/
	setLastAggregateIndex(index) {
		const actorId = this.actor().actorId();
		this.j()._aptitude._lastAggregateIndexByActor[actorId] = index;
	}
	/**
	* Gets the last index tracked in the source list window for the current actor.
	* @returns {number}
	*/
	lastSourceIndex() {
		const actorId = this.actor().actorId();
		const map = this.j()._aptitude._lastSourceIndexByActor;
		if (map[actorId] === undefined) {
			map[actorId] = 0;
		}
		return map[actorId];
	}
	/**
	* Sets the last index tracked in the source list window for the current actor.
	* @param {number} index - The new index to track.
	*/
	setLastSourceIndex(index) {
		const actorId = this.actor().actorId();
		this.j()._aptitude._lastSourceIndexByActor[actorId] = index;
	}
	/**
	* Ensures selection tracker indices exist for the current actor without overwriting them.
	* This initializes to 0 only if the current actor does not yet have entries.
	*/
	resetSelectionTrackers() {
		const actorId = this.actor().actorId();
		const aggMap = this.j()._aptitude._lastAggregateIndexByActor;
		if (aggMap[actorId] === undefined) {
			aggMap[actorId] = 0;
		}
		const srcMap = this.j()._aptitude._lastSourceIndexByActor;
		if (srcMap[actorId] === undefined) {
			srcMap[actorId] = 0;
		}
	}
	/**
	* Gets the cached list of per‑skill aggregates for the current actor.
	* @returns {AptitudeSkillAggregate[]}
	*/
	aggregates() {
		return this.j()._aptitude._aggregates;
	}
	/**
	* Sets the cached list of per‑skill aggregates for the current actor.
	* @param {AptitudeSkillAggregate[]} aggregates The new aggregates.
	*/
	setAggregates(aggregates) {
		this.j()._aptitude._aggregates = aggregates;
	}
	/**
	* Rebuilds the aggregates cache for the current actor.
	*/
	rebuildAggregatesForActor() {
		const next = this.actor().getAptitudeSkillAggregates();
		this.setAggregates(next);
	}
	/**
	* Gets the aptitude sources for the current actor.
	* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]}
	*/
	sources() {
		return this.j()._aptitude._sources;
	}
	/**
	* Sets the aptitude sources for the current actor.
	* @param {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_Weapon|RPG_Armor|RPG_Skill|RPG_State)[]} sources The new sources.
	*/
	setSources(sources) {
		this.j()._aptitude._sources = sources;
	}
	/**
	* Rebuilds the sources cache for the current actor.
	*/
	rebuildSourcesForActor() {
		const next = this.actor().getAptitudeSources();
		this.setSources(next);
	}
	/**
	* Gets the current view mode for the aptitude windows.
	* Should be one of {@link Scene_Aptitude.viewMode}.
	* @returns {string}
	*/
	viewMode() {
		return this.j()._aptitude._viewMode;
	}
	/**
	* Sets the current view mode to the aggregate view.
	*/
	setViewModeToAggregate() {
		this.j()._aptitude._viewMode = Scene_Aptitude.viewMode.AGGREGATE;
		this.aptitudeRibbonWindow().setToggleHintTarget("the sources");
	}
	/**
	* Sets the current view mode to the source view.
	*/
	setViewModeToSource() {
		this.j()._aptitude._viewMode = Scene_Aptitude.viewMode.SOURCE;
		this.aptitudeRibbonWindow().setToggleHintTarget("your skills");
	}
	/**
	* Gets the current active list window for the view mode.
	* @returns {Window_AptitudeAggregateList|Window_AptitudeSourceList|null} - The active list window.
	*/
	currentListWindow() {
		if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE) {
			return this.aptitudeAggregateListWindow();
		} else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE) {
			return this.aptitudeSourceListWindow();
		}
		return null;
	}
	/**
	* Gets the currently inactive list window for the view mode.
	* @returns {Window_AptitudeAggregateList|Window_AptitudeSourceList|null} - The inactive list window.
	*/
	inactiveListWindow() {
		if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE) {
			return this.aptitudeSourceListWindow();
		} else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE) {
			return this.aptitudeAggregateListWindow();
		}
		return null;
	}
	/**
	* Gets the current active details window for the view mode.
	* @returns {Window_AptitudeAggregateDetails|Window_AptitudeSourceDetails|null} - The active details window.
	*/
	currentDetailsWindow() {
		if (this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE) {
			return this.aptitudeAggregateDetailsWindow();
		} else if (this.viewMode() === Scene_Aptitude.viewMode.SOURCE) {
			return this.aptitudeSourceDetailsWindow();
		}
		return null;
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
	* Creates all windows for this scene.
	*/
	createAllWindows() {
		this.rebuildAggregatesForActor();
		this.rebuildSourcesForActor();
		this.createAptitudeRibbonWindow();
		this.createAptitudeAggregateListWindow();
		this.createAptitudeSourceListWindow();
		this.createAptitudeAggregateDetailsWindow();
		this.createAptitudeSourceDetailsWindow();
		this.initializeView();
	}
	/**
	* Creates the aptitude ribbon window.
	*/
	createAptitudeRibbonWindow() {
		const rect = this.aptitudeRibbonRect();
		const win = new Window_AptitudeRibbon(rect);
		win.setActor(this.actor());
		win.setToggleHintTarget("the sources");
		this.j()._aptitude._windows._ribbon = win;
		this.addWindow(win);
	}
	/**
	* Gets the rectangle for the aptitude ribbon window.
	* @returns {Rectangle}
	*/
	aptitudeRibbonRect() {
		const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());
		const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);
		const x = containerX;
		const y = 0;
		const w = Math.floor(containerW * this.listColumnWidthPercent());
		const height = 36 * 3;
		return new Rectangle(x, y, w, height);
	}
	/**
	* Gets the aptitude ribbon window.
	* @returns {Window_AptitudeRibbon|null}
	*/
	aptitudeRibbonWindow() {
		return this.j()._aptitude._windows._ribbon;
	}
	/**
	* Creates the aptitude aggregate list window.
	*/
	createAptitudeAggregateListWindow() {
		const rect = this.aptitudeAggregateListWindowRect();
		const win = new Window_AptitudeAggregateList(rect);
		win.setActor(this.actor());
		win.setAggregates(this.aggregates());
		win.setHandler("ok", this.onListOk.bind(this));
		win.setHandler("cancel", this.popScene.bind(this));
		win.setHandler("context", this.toggleViewMode.bind(this));
		win.setHandler("actor-prev", this.onCycleActorLeft.bind(this));
		win.setHandler("actor-next", this.onCycleActorRight.bind(this));
		this.j()._aptitude._windows._aggregateList = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the aptitude aggregate list window.
	* @returns {Rectangle}
	*/
	aptitudeAggregateListWindowRect() {
		const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());
		const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);
		const { y: ribbonY, height: ribbonHeight } = this.aptitudeRibbonRect();
		const wy = ribbonY + ribbonHeight;
		const wh = Graphics.boxHeight - ribbonHeight;
		const listW = Math.floor(containerW * this.listColumnWidthPercent());
		return new Rectangle(containerX, wy, listW, wh);
	}
	/**
	* Gets the aptitude aggregate list window.
	* @returns {Window_AptitudeAggregateList|null}
	*/
	aptitudeAggregateListWindow() {
		return this.j()._aptitude._windows._aggregateList;
	}
	/**
	* Creates the aptitude source list window.
	*/
	createAptitudeSourceListWindow() {
		const rect = this.aptitudeSourceListWindowRect();
		const win = new Window_AptitudeSourceList(rect);
		win.setActor(this.actor());
		win.setSources(this.sources());
		win.setHandler("ok", this.onListOk.bind(this));
		win.setHandler("cancel", this.popScene.bind(this));
		win.setHandler("context", this.toggleViewMode.bind(this));
		win.setHandler("actor-prev", this.onCycleActorLeft.bind(this));
		win.setHandler("actor-next", this.onCycleActorRight.bind(this));
		win.hide();
		win.deactivate();
		this.j()._aptitude._windows._sourceList = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the aptitude source list window.
	* @returns {Rectangle}
	*/
	aptitudeSourceListWindowRect() {
		return this.aptitudeAggregateListWindowRect();
	}
	/**
	* Gets the aptitude source list window.
	* @returns {Window_AptitudeSourceList|null}
	*/
	aptitudeSourceListWindow() {
		return this.j()._aptitude._windows._sourceList;
	}
	/**
	* Creates the aptitude aggregate details window.
	*/
	createAptitudeAggregateDetailsWindow() {
		const rect = this.aptitudeAggregateDetailsWindowRect();
		const win = new Window_AptitudeAggregateDetails(rect);
		win.setActor(this.actor());
		this.j()._aptitude._windows._aggregateDetails = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the aptitude aggregate details window.
	* @returns {Rectangle}
	*/
	aptitudeAggregateDetailsWindowRect() {
		const containerW = Math.floor(Graphics.boxWidth * this.containerWidthPercent());
		const containerX = Math.floor((Graphics.boxWidth - containerW) / 2);
		const wy = this.mainAreaTop();
		const wh = Graphics.boxHeight;
		const listW = Math.floor(containerW * this.listColumnWidthPercent());
		const detailsW = containerW - listW;
		const dx = containerX + listW;
		return new Rectangle(dx, wy, detailsW, wh);
	}
	/**
	* Gets the aptitude aggregate details window.
	* @returns {Window_AptitudeAggregateDetails|null}
	*/
	aptitudeAggregateDetailsWindow() {
		return this.j()._aptitude._windows._aggregateDetails;
	}
	/**
	* Creates the aptitude source details window.
	*/
	createAptitudeSourceDetailsWindow() {
		const rect = this.aptitudeSourceDetailsWindowRect();
		const win = new Window_AptitudeSourceDetails(rect);
		win.setActor(this.actor());
		win.hide();
		this.j()._aptitude._windows._sourceDetails = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the aptitude source details window.
	* @returns {Rectangle}
	*/
	aptitudeSourceDetailsWindowRect() {
		return this.aptitudeAggregateDetailsWindowRect();
	}
	/**
	* Gets the aptitude source details window.
	* @returns {Window_AptitudeSourceDetails|null}
	*/
	aptitudeSourceDetailsWindow() {
		return this.j()._aptitude._windows._sourceDetails;
	}
	containerWidthPercent() {
		return .9;
	}
	/**
	* The percentage of the container width allotted to the list column (and, by
	* extension, the ribbon above it). Widened from the original 0.25 so that long
	* skill/source names and their right-aligned AP counts don't collide.
	* @returns {number}
	*/
	listColumnWidthPercent() {
		return .32;
	}
	containerHeightPercent() {
		return .8;
	}
	/**
	* Extends {@link #update}.<br/>
	* Also updates the details window when the list selection changes.
	*/
	update() {
		const previousViewMode = this.viewMode();
		super.update();
		const list = this.aptitudeAggregateListWindow();
		if (!list) return;
		this.updateDetails();
		this.updateVisibility(previousViewMode);
	}
	/**
	* Updates the aptitude details window based on the current list selection.
	*/
	updateDetails() {
		switch (this.viewMode()) {
			case Scene_Aptitude.viewMode.AGGREGATE: {
				const previousIndex = this.lastAggregateIndex();
				this.updateAggregateDetails(previousIndex);
				break;
			}
			case Scene_Aptitude.viewMode.SOURCE: {
				const previousIndex = this.lastSourceIndex();
				this.updateSourceDetails(previousIndex);
				break;
			}
		}
	}
	/**
	* Updates the aptitude aggregate details window.
	* @param {number} previousIndex The previous index of the list.
	*/
	updateAggregateDetails(previousIndex) {
		const listWindow = this.aptitudeAggregateListWindow();
		if (previousIndex === listWindow.index()) return;
		const aggregate = listWindow.currentExt();
		const details = this.aptitudeAggregateDetailsWindow();
		details.setActor(this.actor());
		details.setAggregate(aggregate);
		this.setLastAggregateIndex(listWindow.index());
	}
	/**
	* Updates the aptitude source details window.
	* @param {number} previousIndex The previous index of the list.
	*/
	updateSourceDetails(previousIndex) {
		const listWindow = this.aptitudeSourceListWindow();
		if (previousIndex === listWindow.index()) return;
		const source = listWindow.currentExt();
		const details = this.aptitudeSourceDetailsWindow();
		details.setActor(this.actor());
		details.setSource(source);
		this.setLastSourceIndex(listWindow.index());
	}
	/**
	* Updates the visibility of the aptitude windows based on the current view mode.
	* @param {string} previousViewMode The previous view mode.
	*/
	updateVisibility(previousViewMode) {
		const currentViewMode = this.viewMode();
		if (currentViewMode === previousViewMode) return;
		switch (currentViewMode) {
			case Scene_Aptitude.viewMode.AGGREGATE:
				this.hideSourceWindows();
				this.showAggregateWindows();
				break;
			case Scene_Aptitude.viewMode.SOURCE:
				this.hideAggregateWindows();
				this.showSourceWindows();
				break;
		}
	}
	/**
	* Shows the aptitude aggregate windows.
	* Also refreshes the list and details windows with the current actor.
	*/
	showAggregateWindows() {
		const list = this.aptitudeAggregateListWindow();
		const details = this.aptitudeAggregateDetailsWindow();
		this.rebuildAggregatesForActor();
		list.show();
		list.setActor(this.actor());
		list.setAggregates(this.aggregates());
		list.select(this.lastAggregateIndex());
		list.activate();
		details.show();
		details.setActor(this.actor());
		list.currentExt() ? details.setAggregate(list.currentExt()) : details.setAggregate(null);
	}
	/**
	* Hides the aptitude aggregate windows.
	*/
	hideAggregateWindows() {
		const list = this.aptitudeAggregateListWindow();
		const details = this.aptitudeAggregateDetailsWindow();
		list.hide();
		list.deactivate();
		details.hide();
	}
	/**
	* Shows the aptitude source windows.
	* Also refreshes the list and details windows with the current actor.
	*/
	showSourceWindows() {
		const list = this.aptitudeSourceListWindow();
		const details = this.aptitudeSourceDetailsWindow();
		list.show();
		list.setActor(this.actor());
		list.setSources(this.sources());
		list.select(this.lastSourceIndex());
		list.activate();
		details.show();
		details.setActor(this.actor());
		list.currentExt() ? details.setSource(list.currentExt()) : details.setSource(null);
	}
	/**
	* Hides the aptitude source windows.
	*/
	hideSourceWindows() {
		const list = this.aptitudeSourceListWindow();
		const details = this.aptitudeSourceDetailsWindow();
		list.hide();
		list.deactivate();
		details.hide();
	}
	/**
	* Cycles to the previous actor.
	*/
	onCycleActorLeft() {
		this.previousActor();
	}
	/**
	* Cycles to the next actor.
	*/
	onCycleActorRight() {
		this.nextActor();
	}
	/**
	* Handles the "more" action- aka the shift key/square button from the either list.
	*/
	toggleViewMode() {
		switch (this.viewMode()) {
			case Scene_Aptitude.viewMode.AGGREGATE:
				this.setViewModeToSource();
				break;
			case Scene_Aptitude.viewMode.SOURCE:
				this.setViewModeToAggregate();
				break;
			default: throw new Error(`Invalid view mode: ${this.viewMode()}`);
		}
	}
	/**
	* Extends {@link #onActorChange}.<br/>
	* Also refreshes the aptitude windows when the actor changes.
	*/
	onActorChange() {
		super.onActorChange();
		this.rebuildAggregatesForActor();
		this.rebuildSourcesForActor();
		const updatedActor = this.actor();
		this.rebindAllWindowsToActor(updatedActor);
		this.refreshListsForActor();
		this.resetSelectionTrackers();
		const startIndex = this.viewMode() === Scene_Aptitude.viewMode.AGGREGATE ? this.lastAggregateIndex() : this.lastSourceIndex();
		this.refreshSelectionForCurrentView(startIndex);
	}
	/**
	* Rebinds all scene windows to the provided actor.
	* @param {Game_Actor} actor - The actor to bind to all windows.
	*/
	rebindAllWindowsToActor(actor) {
		this.aptitudeRibbonWindow().setActor(actor);
		this.aptitudeAggregateListWindow().setActor(actor);
		this.aptitudeSourceListWindow().setActor(actor);
		this.aptitudeAggregateDetailsWindow().setActor(actor);
		this.aptitudeSourceDetailsWindow().setActor(actor);
	}
	/**
	* Refreshes the list contents for the currently bound actor.
	* This pulls from the scene’s cached aggregates and sources.
	*/
	refreshListsForActor() {
		this.aptitudeAggregateListWindow().setAggregates(this.aggregates());
		this.aptitudeSourceListWindow().setSources(this.sources());
	}
	/**
	* Selects and activates the current list view and updates its details.
	* @param {number} startIndex - The index to select in the active list.
	*/
	refreshSelectionForCurrentView(startIndex) {
		const activeList = this.currentListWindow();
		const inactiveList = this.inactiveListWindow();
		activeList.select(startIndex);
		activeList.activate();
		inactiveList.deactivate();
		this.setDetailsFromCurrentSelection();
	}
	/**
	* Applies the active list selection to the corresponding details window.
	*/
	setDetailsFromCurrentSelection() {
		switch (this.viewMode()) {
			case Scene_Aptitude.viewMode.AGGREGATE: {
				const list = this.aptitudeAggregateListWindow();
				const details = this.aptitudeAggregateDetailsWindow();
				const selected = list.currentExt();
				if (selected) {
					details.setAggregate(selected);
				} else {
					details.setAggregate(null);
				}
				break;
			}
			case Scene_Aptitude.viewMode.SOURCE: {
				const list = this.aptitudeSourceListWindow();
				const details = this.aptitudeSourceDetailsWindow();
				const selected = list.currentExt();
				if (selected) {
					details.setSource(selected);
				} else {
					details.setSource(null);
				}
				break;
			}
			default: {
				throw new Error(`Invalid view mode: ${this.viewMode()}`);
			}
		}
	}
	/**
	* Handles the OK action from the aptitude list.
	* (Reserved for future behaviors; currently a no‑op.)
	*/
	onListOk() {
		SoundManager.playOk();
		this.currentListWindow().activate();
	}
};

//#endregion
//#region src/plugins/apt/core/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.</br>
* Adds a handler for the Aptitude menu command.
*/
J.APT.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.APT.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("aptitude", this.commandAptitude.bind(this));
};
/**
* Opens the Aptitude scene.
*/
Scene_Menu.prototype.commandAptitude = function() {
	Scene_Aptitude.callScene();
};

//#endregion
//#region src/plugins/apt/core/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.</br>
* Adds the Aptitude menu command if enabled via plugin parameter.
*/
J.APT.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.APT.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	const switchId = J.APT.Metadata.menuSwitchId;
	if (switchId === 0 || $gameSwitches.value(switchId)) {
		const builtCommand = new WindowCommandBuilder("Aptitude").setSymbol("aptitude").setHelpText("Track this character's progress toward learning new skills.").setMenuSection(MenuSection.Actor).setIconIndex(186).build();
		this.addBuiltCommand(builtCommand);
	}
};

//#endregion
//#region src/plugins/apt/core/_metadata/pluginCommands.js
/**
* Plugin command for modifying AP for all actors.
*/
PluginManager.registerCommand(J.APT.Metadata.name, "mod-ap-all", ({ points }) => {
	$gameParty.members().forEach((actor) => ApManager.gainAp(actor, parseInt(points), "plugin-command"));
});
/**
* Plugin command for modifying AP for a specific actor.
*/
PluginManager.registerCommand(J.APT.Metadata.name, "mod-ap", ({ actorId, points }) => {
	const actor = $gameActors.actor(parseInt(actorId));
	ApManager.gainAp(actor, parseInt(points), "plugin-command");
});
/**
* Plugin command for re-syncing persisted aptitude requiredAp values against
* current notetags, for all party members.
*/
PluginManager.registerCommand(J.APT.Metadata.name, "refresh-required-ap-all", () => {
	$gameParty.members().forEach((actor) => ApManager.refreshRequiredAp(actor));
});
/**
* Plugin command for re-syncing persisted aptitude requiredAp values against
* current notetags, for a specific actor.
*/
PluginManager.registerCommand(J.APT.Metadata.name, "refresh-required-ap", ({ actorId }) => {
	const actor = $gameActors.actor(parseInt(actorId));
	ApManager.refreshRequiredAp(actor);
});

//#endregion
//# sourceMappingURL=J-Aptitude.js.map