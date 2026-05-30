//region Introduction
/*:
 * @target MZ
 * @plugindesc [v2.1.0 PROF] Enables skill proficiency tracking.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to have actors grow in prof when using
 * skills. Additionally, triggers can now be configured to execute
 * against these new proficiencies (and other things).
 *
 * Integrates with others of mine plugins:
 * - J-ABS; actions performed in JABS will accrue proficiency.
 * - J-Elem; enables damage formula integration for proficiency.
 * ----------------------------------------------------------------------------
 * DETAILS
 * This plugin tracks all skill usage for all battlers (actors and enemies,
 * though with enemies it is much less meaningful since they are short-lived).
 * By defining "proficiency conditionals", you can enable actors to unlock new
 * skills or gain other javascript-based rewards by using their skills.
 *
 * WHEN USING J-ELEMENTALISTICS
 * Additionally, a new parameter is exposed in the "damage formula" for "p"
 * which represents the attacker's proficiency in the skill being used. For
 * example, consider the following formula:
 *
 *  ((a.atk * 4) + p) - (b.def * 2)
 *
 * We would now translate that as:
 * 4X attacker ATK + attacker's proficiency in this skill
 * minus
 * 2X defender DEF
 *
 * Which gives this skill the ability to scale the more the attacker uses this
 * skill. Be aware there is no practical upper limit on proficiency, so if the
 * game is intended to go on for a long while, such scaling could be difficult
 * to balance in the long run. Use it in damage formulas wisely!
 * ----------------------------------------------------------------------------
 * !              IMPORTANT NOTE ABOUT CONFIGURATION DATA                     !
 * The configuration data for this plugin is derived from an external file
 * rather than the plugin's parameters. This file lives in the "/data"
 * directory of your project, and is called "config.proficiency.json". You can
 * absolutely generate/modify this file by hand, but you'll probably want to
 * visit my github and swipe the jmz-data-editor project I've built that
 * provides a convenient GUI for generating and modifying the configuration.
 *
 * If this configuration file is missing, the game will not run.
 *
 * Additionally, due to the way RMMZ base code is designed, by loading external
 * files for configuration like this, a project made with this plugin will
 * simply crash when attempting to load in a web context with an error akin to:
 *    "ReferenceError require is not defined"
 * This error is a result of attempting to leverage nodejs's "require" loader
 * to load the "fs" (file system) library to then load the plugin's config
 * file. Normally a web deployed game will alternatively use "forage" instead
 * to handle things that need to be read or saved, but because the config file
 * is just that- a file sitting in the /data directory rather than loaded into
 * forage storage- it becomes unaccessible.
 * ============================================================================
 * PROFICIENCY BONUSES
 * Have you ever wanted a battler to be able to gain some bonus proficiency by
 * means of something from the database? Well now you can! By applying the
 * appropriate tag to the various database locations, you too can have your
 * battlers gain bonus proficiency!
 *
 * NOTE:
 * Bonuses are flat bonuses that get added to the base amount, not percentage.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <proficiencyBonus:NUM>
 *
 * TAG EXAMPLES:
 *  <proficiencyBonus:3>
 * The attacker now gains +3 bonus proficiency for any skill used.
 *
 *  <proficiencyBonus:50>
 * The attacker now gains +50 bonus proficiency for any skill used.
 * ============================================================================
 * PROFICIENCY BLOCKING
 * Have you ever wanted a battler to NOT be able to gain proficiency? Well now
 * you can! By applying the appropriate tags to the various database locations,
 * you too can block any battler from giving or gaining proficiency!
 *
 * NOTE:
 * It is important to recognize that there are two tags that both block the
 * gain of proficiency in different ways. One tag is designed to prevent the
 * GIVING of proficiency, for most commonly being placed on enemies or states
 * that enemies can be placed in. The second tag is designed to prevent the
 * GAINING of proficiency, most commonly being placed on actors or states that
 * actors can be placed in... though either tag can go on anything as long as
 * you understand what you're doing.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <proficiencyGivingBlock>
 * or
 *  <proficiencyGainingBlock>
 *
 * TAG EXAMPLES:
 *  <proficiencyGivingBlock>
 * The battler that has this tag will not GIVE proficiency to any opposing
 * battlers that hit this battler with skills.
 *
 *  <proficiencyGainingBlock>
 * The battler that has this tag will not be able to GAIN proficiency from any
 * battlers that this battler uses skills against.
 * ============================================================================
 * PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 * COMMAND:
 * "Modify Actor's Proficiency"
 * This command will allow you to increase or decrease a single actor's
 * proficiency for a given skill. You only need choose the actor, skill, and
 * the amount to increase/decrease by.
 *
 * COMMAND:
 * "Modify Party's Proficiency"
 * This command will do the same as the single actor's command above, but
 * instead apply against the whole party.
 *
 * NOTES:
 * - You cannot reduce a skill's proficiency in a skill below 0.
 * - Increasing the proficiency can trigger rewards for the skill.
 * - Decreasing the proficiency will NOT undo rewards gained.
 * ============================================================================
 * CHANGELOG:
 * - 2.1.0
 *    Registers 'p' as a formula context variable via Game_Action.registerFormulaContext.
 *    Damage formulas can now use 'p' for skill proficiency without J-Elementalistics
 *    needing to hardcode a J.PROF conditional block. The registration calls
 *    this.skillProficiency() on the Game_Action instance at formula evaluation time.
 * - 2.0.1
 *    Added flag for showing external file load info.
 *    Removed dead plugin parameters for conditionals.
 * - 2.0.0
 *    THIS UPDATE BREAKS WEB DEPLOY FUNCTIONALITY FOR YOUR GAME.
 *    Updated to extend common plugin metadata patterns.
 *    Loads configuration data from external file.
 *    Proficiency conditional data is no longer saved to the actor.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @command modifyActorSkillProficiency
 * @text Modify Actor's Proficiency
 * @desc Increase/decrease one or more actor's proficiency with one or more skills.
 * @arg actorIds
 * @type actor[]
 * @text Actor Id
 * @desc Choose one or more actors to modify the proficiency for.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 * @command modifyPartySkillProficiency
 * @text Modify Party's Proficiency
 * @desc Increase/decrease every member in the current party's proficiency with a particular skill.
 * @arg skillIds
 * @type skill[]
 * @text Skill Id
 * @desc Choose one or more skills to modify the proficiency for.
 * @arg amount
 * @type number
 * @text Modifier
 * @desc This modifier can be negative or positive.
 * @min -999999
 * @max 999999
 *
 */

//#region src/plugins/prof/core/__models/ProficiencyRequirement.js
/**
* A single requirement of a skill proficiency conditional.
*/
var ProficiencyRequirement = class {
	/**
	* The skill id for this requirement.
	* @type {number}
	*/
	skillId = 0;
	/**
	* The level of proficiency required to consider this requirement fulfilled.
	* @type {number}
	*/
	proficiency = 0;
	/**
	* The skill ids for this requirement.
	* @type {number[]}
	*/
	secondarySkillIds = [];
	/**
	* Constructor.
	* @param {number} skillId The primary skill id of the requirement.
	* @param {number} proficiency The proficiency required.
	* @param {number[]} secondarySkillIds The secondary skill ids for the requirement.
	*/
	constructor(skillId, proficiency, secondarySkillIds) {
		this.skillId = skillId;
		this.proficiency = proficiency;
		this.secondarySkillIds = secondarySkillIds;
	}
	/**
	* Check the total proficiency for this requirement to be unlocked by battler.
	* @param {Game_Actor|Game_Enemy} battler The battler whose proficiency this is being checked for.
	* @returns {number}
	*/
	totalProficiency(battler) {
		const skillProficiency = battler.tryGetSkillProficiencyBySkillId(this.skillId);
		const primaryProficiency = skillProficiency.proficiency;
		return this.secondarySkillIds.reduce((accumulator, secondarySkillId) => {
			const secondaryProficiency = battler.tryGetSkillProficiencyBySkillId(secondarySkillId);
			return accumulator + secondaryProficiency.proficiency;
		}, primaryProficiency);
	}
};

//#endregion
//#region src/plugins/prof/core/__models/ProficiencyConditional.js
/**
* A collection of requirements associated with a collection of actors that will grant one or more rewards upon
* satisfying all requirements.
*/
var ProficiencyConditional = class {
	/**
	* The key of this conditional.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The actor's id of which this conditional applies to.
	* @type {number[]}
	*/
	actorIds = Array.empty;
	/**
	* The requirements for this conditional.
	* @type {ProficiencyRequirement[]}
	*/
	requirements = Array.empty;
	/**
	* The skills rewarded when all requirements are fulfilled.
	* @type {number[]}
	*/
	skillRewards = Array.empty;
	/**
	* The javascript to execute when all requirements are fulfilled.
	* @type {string}
	*/
	jsRewards = String.empty;
	/**
	* Constructor.
	* @param {string} key The unique identifier of this skill proficiency conditional.
	* @param {number[]} actorIds The ids of all actors this conditional applies to.
	* @param {ProficiencyRequirement[]} requirements All requirements that must be satisfied to grant the rewards.
	* @param {number[]} skillRewards The skills rewarded upon satisfying all requirements.
	* @param {string} jsRewards The raw javascript to execute upon satisfying all requirements.
	*/
	constructor(key, actorIds, requirements, skillRewards, jsRewards) {
		this.key = key;
		this.actorIds = actorIds;
		this.requirements = requirements;
		this.skillRewards = skillRewards;
		this.jsRewards = jsRewards;
	}
};

//#endregion
//#region src/plugins/prof/core/__models/SkillProficiency.js
/**
* A data model for saving skill usage/proficiency for battlers.
*/
var SkillProficiency = class {
	/**
	* Initializes this class with the given parameters.
	* @param {number} skillId The skill id of the skill for this prof.
	* @param {number} [initialProficiency] The prof the owning battler bears with this skill; defaults to 0.
	*/
	constructor(skillId, initialProficiency = 0) {
		/**
		* The skill id of the skill for this prof.
		* @type {number}
		*/
		this.skillId = skillId;
		/**
		* The prof the owning battler bears with this skill.
		* @type {number}
		*/
		this.proficiency = initialProficiency;
	}
	/**
	* Gets the underlying skill of this prof.
	* @returns {RPG_Skill}
	*/
	skill() {
		return $dataSkills[this.skillId];
	}
	/**
	* Adds a given amount of prof to the skill's current prof.
	* @param {number} value The amount of prof to add.
	*/
	improve(value) {
		this.proficiency += value;
		if (this.proficiency < 0) {
			this.proficiency = 0;
		}
	}
};
SerializableRegistry.register(SkillProficiency);

//#endregion
//#region src/plugins/prof/core/_metadata/_pluginMetadata.js
var J_ProficiencyPluginMetadata = class J_ProficiencyPluginMetadata extends PluginMetadata {
	/**
	* The path where the external configuration file is located relative to the root of the project.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.proficiency.json";
	/**
	* Maps all the raw proficiency conditional data
	* @param {any} parsedBlob The JSON.parse()'d data blob of the config.
	* @returns {ProficiencyConditional[]}
	*/
	static classifyConditionals(parsedBlob) {
		return parsedBlob.conditionals.map((conditional) => {
			const requirements = conditional.requirements.map((requirement) => new ProficiencyRequirement(requirement.skillId, requirement.proficiency, requirement.secondarySkillIds));
			return new ProficiencyConditional(conditional.key, conditional.actorIds, requirements, conditional.skillRewards, conditional.jsRewards);
		});
	}
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Initializes the proficiencies from database and external data.
	*/
	initializeProficiencies() {
		const classifiedConditionalData = ExternalJsonConfigLoader.load(J_ProficiencyPluginMetadata.CONFIG_PATH, ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Proficiency").configName("proficiency configuration").mapper(J_ProficiencyPluginMetadata.classifyConditionals.bind(J_ProficiencyPluginMetadata)).logSummary((result) => [`- ${result.length} proficiency conditionals`]).build());
		/**
		* The collection of all defined skill proficiencies.
		* @type {ProficiencyConditional[]}
		*/
		this.conditionals = classifiedConditionalData;
		/**
		* A map of actorId:conditional[] for more easily accessing all conditionals associated with a given actor.
		* @type {Map<number, ProficiencyConditional[]>}
		*/
		this.actorConditionalsMap = new Map();
		$dataActors.filter((actor) => !!actor).forEach((actor) => this.actorConditionalsMap.set(actor.id, Array.empty));
		this.conditionals.forEach((conditional) => {
			conditional.actorIds.forEach((actorId) => {
				const data = this.actorConditionalsMap.get(actorId);
				data.push(conditional);
			});
		});
	}
};

//#endregion
//#region src/plugins/prof/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PROF = {};
/**
* The metadata associated with this plugin.
* @type {J_ProficiencyPluginMetadata}
*/
J.PROF.Metadata = new J_ProficiencyPluginMetadata("J-Proficiency", "2.1.0");
/**
* The various aliases associated with this plugin.
*/
J.PROF.Aliased = {
	Game_Actor: new Map(),
	Game_Action: new Map(),
	Game_Battler: new Map(),
	Game_Enemy: new Map(),
	Game_System: new Map(),
	IconManager: new Map(),
	Scene_Boot: new Map(),
	TextManager: new Map()
};
J.PROF.RegExp = {};
J.PROF.RegExp.ProficiencyBonus = /<proficiencyBonus:[ ]?(\d+)>/i;
J.PROF.RegExp.ProficiencyGivingBlock = /<proficiencyGivingBlock>/i;
J.PROF.RegExp.ProficiencyGainingBlock = /<proficiencyGainingBlock>/i;
Game_Action.registerFormulaContext("p", (action) => action.skillProficiency());

//#endregion
//#region src/plugins/prof/core/objects/Game_Battler.js
/**
* Bonus proficiency gained when earning skill proficiency.
*/
Object.defineProperty(Game_BattlerBase.prototype, "prof", {
	get: function() {
		return 0;
	},
	configurable: true
});
/**
* Gets all skill proficiencies for this battler.
* @returns {SkillProficiency[]}
*/
Game_Battler.prototype.skillProficiencies = function() {
	return [];
};
/**
* Gets the prof of one particular skill for this battler.
* @param {number} skillId The id of the skill to get proficiency for.
* @returns {SkillProficiency|null}
*/
Game_Battler.prototype.skillProficiencyBySkillId = function(skillId) {
	return null;
};
/**
* Gets the total amount of proficiency gained from an action for this battler.
* @returns {number}
*/
Game_Battler.prototype.skillProficiencyAmount = function() {
	const base = this.baseSkillProficiencyAmount();
	const bonuses = this.prof;
	return base + bonuses;
};
/**
* Gets the base amount of proficiency gained from an action for this battler.
* @returns {number}
*/
Game_Battler.prototype.baseSkillProficiencyAmount = function() {
	return 1;
};
/**
* Whether or not a battler can gain proficiency by using skills against this battler.
* @returns {boolean} True if the battler can give proficiency, false otherwise.
*/
Game_Battler.prototype.canGiveProficiency = function() {
	return !RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.PROF.RegExp.ProficiencyGivingBlock);
};
/**
* Whether or not this battler can gain proficiency from using skills.
* @returns {boolean} True if the battler can gain proficiency, false otherwise.
*/
Game_Battler.prototype.canGainProficiency = function() {
	return !RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.PROF.RegExp.ProficiencyGainingBlock);
};

//#endregion
//#region src/plugins/prof/core/objects/Game_Actor.js
/**
* Adds new properties to the actors that manage the skill prof system.
*/
J.PROF.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.PROF.Aliased.Game_Actor.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the proficiency system.
	*/
	this._j._proficiency ||= {};
	/**
	* All skill proficiencies earned by completing conditionals.
	* @type {SkillProficiency[]}
	*/
	this._j._proficiency._proficiencies ||= [];
	/**
	* All conditionals that have been unlocked by this actor.
	* @type {string[]}
	*/
	this._j._proficiency._unlockedConditionals ||= [];
	this._j._proficiency._bonusSkillProficiencyGains = 0;
};
/**
* Gets all skill proficiencies for this actor.
* @returns {SkillProficiency[]}
*/
Game_Actor.prototype.skillProficiencies = function() {
	return this._j._proficiency._proficiencies;
};
/**
* Adds a newly acquired proficiency to this actor.
* @param {SkillProficiency} skillProficiency The newly acquired proficiency.
*/
Game_Actor.prototype.addNewSkillProficiency = function(skillProficiency) {
	this._j._proficiency._proficiencies.push(skillProficiency);
	this._j._proficiency._proficiencies.sort();
};
/**
* Gets all of this actor's skill proficiency conditionals, locked and unlocked.
* @returns {ProficiencyConditional[]}
*/
Game_Actor.prototype.proficiencyConditionals = function() {
	return J.PROF.Metadata.actorConditionalsMap.get(this.actorId());
};
/**
* Gets all of this actor's skill proficiency conditionals that have been unlocked.
* @returns {string[]}
*/
Game_Actor.prototype.unlockedConditionals = function() {
	return this._j._proficiency._unlockedConditionals;
};
/**
* Registers a conditional as unlocked by its key.
* @param {string} conditional The key of the conditional to unlock.
*/
Game_Actor.prototype.addUnlockedConditional = function(conditional) {
	this._j._proficiency._unlockedConditionals.push(conditional);
};
/**
* Gets all of this actor's skill proficiency conditionals that include a requirement of the provided skillId.
* @param {number} skillId The skill id to find conditionals for.
* @returns {ProficiencyConditional[]}
*/
Game_Actor.prototype.proficiencyConditionalBySkillId = function(skillId) {
	return this.proficiencyConditionals().filter((conditional) => conditional.requirements.some((requirement) => requirement.skillId === skillId));
};
/**
* Checks whether or not a conditional has been unlocked by its key.
* @param key {string} The key of the conditional.
* @returns {boolean}
*/
Game_Actor.prototype.isConditionalUnlocked = function(key) {
	return this.unlockedConditionals().includes(key);
};
/**
* Gets all currently locked skill proficiency conditionals.
* @returns {ProficiencyConditional[]}
*/
Game_Actor.prototype.lockedConditionals = function() {
	return this.proficiencyConditionals().filter((conditional) => this.isConditionalUnlocked(conditional.key) === false);
};
/**
* Unlocks a skill proficiency conditional by its key.
* @param key {string} The key of the conditional.
*/
Game_Actor.prototype.unlockConditional = function(key) {
	if (this.isConditionalUnlocked(key)) {
		console.warn(`Attempted to unlock conditional: [${key}], but it was already unlocked.`);
		return;
	}
	this.addUnlockedConditional(key);
};
/**
* Executes the reward listed in the skill proficiency conditional.
* @param conditional {ProficiencyConditional} The conditional containing the reward.
*/
Game_Actor.prototype.executeConditionalReward = function(conditional) {
	this.executeSkillRewards(conditional);
	this.executeJsRewards(conditional);
};
/**
* Teaches this actor all skills listed (if any) in the skill rewards
* of a skill proficiency conditional.
* @param conditional {ProficiencyConditional} The conditional containing the reward.
*/
Game_Actor.prototype.executeSkillRewards = function(conditional) {
	const { skillRewards } = conditional;
	if (!skillRewards.length) return;
	skillRewards.forEach(this.learnSkill, this);
};
/**
* Performs the arbitrary javascript provided in the skill proficiency conditional-
* but with guardrails to ensure it doesn't blow up the game.
* @param conditional {ProficiencyConditional} The conditional containing the reward.
*/
Game_Actor.prototype.executeJsRewards = function(conditional) {
	if (!conditional.jsRewards) return;
	const a = this;
	const c = conditional;
	const { jsRewards } = c;
	try {
		new Function("a", "c", jsRewards)(a, c);
	} catch (error) {
		console.error(`there was an error executing the reward for: ${c.key}.<br>`);
		console.log(error);
	}
};
/**
* Gets a skill proficiency by its skill id.
*
* This will return `undefined` if the skill proficiency
* has not yet been generated.
* @param {number} skillId The skill id.
* @returns {SkillProficiency|null}
*/
Game_Actor.prototype.skillProficiencyBySkillId = function(skillId) {
	return this.skillProficiencies().find((skillProficiency) => skillProficiency.skillId === skillId);
};
/**
* A safe means of attempting to retrieve a skill proficiency. If the proficiency
* does not exist, then it will be created with the default of zero starting proficiency.
* @param {number} skillId The skill id to identify the proficiency for.
* @returns {SkillProficiency}
*/
Game_Actor.prototype.tryGetSkillProficiencyBySkillId = function(skillId) {
	const exists = this.skillProficiencyBySkillId(skillId);
	if (exists) {
		return exists;
	} else {
		return this.addSkillProficiency(skillId);
	}
};
/**
* Adds a new skill proficiency to the collection.
* @param {number} skillId The skill id.
* @param {number=} initialProficiency Optional. The starting prof.
* @returns {SkillProficiency} The skill proficiency added.
*/
Game_Actor.prototype.addSkillProficiency = function(skillId, initialProficiency = 0) {
	const exists = this.skillProficiencyBySkillId(skillId);
	if (exists) {
		console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
		return exists;
	}
	const proficiency = new SkillProficiency(skillId, initialProficiency);
	this.addNewSkillProficiency(proficiency);
	return proficiency;
};
/**
* Extends skill learning to add new skill proficiencies if we learned new skills.
*/
J.PROF.Aliased.Game_Actor.set("onLearnNewSkill", Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId) {
	J.PROF.Aliased.Game_Actor.get("onLearnNewSkill").call(this, skillId);
	this.addSkillProficiency(skillId);
};
/**
* Improves the skill prof by a given amount (defaults to 1).
* @param {number} skillId The skill id.
* @param {number} amount The amount to improve the prof by.
*/
Game_Actor.prototype.increaseSkillProficiency = function(skillId, amount = 1) {
	const proficiency = this.tryGetSkillProficiencyBySkillId(skillId);
	proficiency.improve(amount);
	this.evaluateProficiencyConditionals();
};
/**
* Check all proficiency conditionals to see if any of them are now met.
*/
Game_Actor.prototype.evaluateProficiencyConditionals = function() {
	const lockedConditionals = this.lockedConditionals();
	if (!lockedConditionals.length) return;
	lockedConditionals.forEach(this.evaluateProficiencyConditional, this);
};
/**
* Checks the conditional to see if requirements are met to unlock it.
* @param {ProficiencyConditional} conditional The conditional being evaluated.
*/
Game_Actor.prototype.evaluateProficiencyConditional = function(conditional) {
	const allRequirementsMet = conditional.requirements.every(this.isRequirementMet, this);
	if (allRequirementsMet) {
		this.unlockConditional(conditional.key);
		this.executeConditionalReward(conditional);
	}
};
/**
* Validates whether or not a proficiency requirement is met.
* @param {ProficiencyRequirement} requirement The requirement being evaluated.
* @returns {boolean}
*/
Game_Actor.prototype.isRequirementMet = function(requirement) {
	const accumulatedProficiency = requirement.totalProficiency(this);
	return accumulatedProficiency >= requirement.proficiency;
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Also updates bonus skill proficiency gains.
*/
J.PROF.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.PROF.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.updateBonusSkillProficiencyGains();
};
/**
* Updates the skill proficiency gains for this actor.
*/
Game_Actor.prototype.updateBonusSkillProficiencyGains = function() {
	if (this._j._proficiency._bonusSkillProficiencyGains === undefined || this._j._proficiency._bonusSkillProficiencyGains === null) {
		this._j._proficiency._bonusSkillProficiencyGains = 0;
	}
	this._j._proficiency._bonusSkillProficiencyGains = RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.PROF.RegExp.ProficiencyBonus);
};
/**
* Bonus proficiency gained when earning skill proficiency.
*/
Object.defineProperty(Game_Actor.prototype, "prof", {
	get: function() {
		return this._j._proficiency._bonusSkillProficiencyGains;
	},
	configurable: true
});

//#endregion
//#region src/plugins/prof/core/objects/Game_Enemy.js
/**
* Extends {@link Game_Enemy.initMembers}.<br/>
* Initializes skill proficiency storage for map enemies.
*/
J.PROF.Aliased.Game_Enemy.set("initMembers", Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function() {
	J.PROF.Aliased.Game_Enemy.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all boosts this actor has can potentially consume.
	* @type {SkillProficiency[]}
	*/
	this._j._profs ||= [];
};
/**
* Gets all skill proficiencies for this enemy.
* @returns {SkillProficiency[]}
*/
Game_Enemy.prototype.skillProficiencies = function() {
	return this._j._profs;
};
/**
* Gets a skill prof by its skill id.
* @param {number} skillId The skill id.
* @returns {SkillProficiency|null}
*/
Game_Enemy.prototype.skillProficiencyBySkillId = function(skillId) {
	return this.skillProficiencies().find((prof) => prof.skillId === skillId);
};
/**
* Adds a new skill prof to the collection.
* @param {number} skillId The skill id.
* @param {number} initialProficiency Optional. The starting prof.
* @returns {SkillProficiency}
*/
Game_Enemy.prototype.addSkillProficiency = function(skillId, initialProficiency = 0) {
	const exists = this.skillProficiencyBySkillId(skillId);
	if (exists) {
		console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
		return exists;
	}
	const proficiency = new SkillProficiency(skillId, initialProficiency);
	this._j._profs.push(proficiency);
	this._j._profs.sort();
	return proficiency;
};
/**
* A safe means of attempting to retrieve a skill proficiency. If the proficiency
* does not exist, then it will be created with the default of zero starting proficiency.
* @param {number} skillId The skill id to identify the proficiency for.
* @returns {SkillProficiency}
*/
Game_Enemy.prototype.tryGetSkillProficiencyBySkillId = function(skillId) {
	const exists = this.skillProficiencyBySkillId(skillId);
	if (exists) {
		return exists;
	} else {
		return this.addSkillProficiency(skillId);
	}
};
/**
* Improves the skill prof by a given amount (defaults to 1).
* @param {number} skillId The skill id.
* @param {number} amount The amount to improve the prof by.
*/
Game_Enemy.prototype.increaseSkillProficiency = function(skillId, amount = 1) {
	let proficiency = this.skillProficiencyBySkillId(skillId);
	if (!proficiency) {
		proficiency = this.addSkillProficiency(skillId);
	}
	proficiency.improve(amount);
};

//#endregion
//#region src/plugins/prof/core/objects/Game_Action.js
/**
* Extends the .apply() to include consideration of prof.
*/
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.PROF.Aliased.Game_Action.get("apply").call(this, target);
	const result = target.result();
	if (this.canIncreaseProficiency(target)) {
		this.increaseProficiency(result.critical);
	}
};
/**
* Whether or not increasing the attacker's proficiency is a valid course of action
* based on various requirements.
* @param {Game_Battler} target The result of the action.
* @returns {boolean}
*/
Game_Action.prototype.canIncreaseProficiency = function(target) {
	const isSkill = this.isSkill();
	if (!isSkill) return false;
	const isHit = target.result().isHit();
	if (!isHit) return false;
	const canGiveProficiency = target.canGiveProficiency();
	if (!canGiveProficiency) return false;
	const canGainProficiency = this.subject().canGainProficiency();
	if (!canGainProficiency) return false;
	return true;
};
/**
* Increases the skill prof for the actor with the given skill.
*/
Game_Action.prototype.increaseProficiency = function() {
	const caster = this.subject();
	const skill = this.item();
	if (!caster || !skill) {
		console.warn("attempted to improve prof for an invalid caster or skill.");
		return;
	}
	const amount = caster.skillProficiencyAmount();
	caster.increaseSkillProficiency(skill.id, amount);
};
/**
* Gets the skill prof from this action's skill of the caster.
* @returns {number}
*/
Game_Action.prototype.skillProficiency = function() {
	if (this.isSkill() && this.subject()) {
		const skill = this.item();
		const skillProficiency = this.subject().skillProficiencyBySkillId(skill.id);
		if (skillProficiency) {
			return skillProficiency.proficiency;
		}
	}
	return 0;
};
if (J.ABS) {
	/**
	* Extends {@link Game_Action.onParry}.<br/>
	* Also gains proficiency for the parry if possible.
	* @param {JABS_Battler} jabsBattler The battler that is parrying.
	*/
	J.PROF.Aliased.Game_Action.set("onParry", Game_Action.prototype.onParry);
	Game_Action.prototype.onParry = function(jabsBattler) {
		J.PROF.Aliased.Game_Action.get("onParry").call(this, jabsBattler);
		this.gainProficiencyFromGuarding(jabsBattler);
	};
	/**
	* Extends {@link Game_Action.onGuard}.<br/>
	* Also gains proficiency for the guard if possible.
	* @param {JABS_Battler} jabsBattler The battler that is guarding.
	*/
	J.PROF.Aliased.Game_Action.set("onGuard", Game_Action.prototype.onGuard);
	Game_Action.prototype.onGuard = function(jabsBattler) {
		J.PROF.Aliased.Game_Action.get("onGuard").call(this, jabsBattler);
		this.gainProficiencyFromGuarding(jabsBattler);
	};
	/**
	* Gains proficiency when guarding.
	* @param jabsBattler
	*/
	Game_Action.prototype.gainProficiencyFromGuarding = function(jabsBattler) {
		if (!this.canGainProficiencyFromGuarding(jabsBattler)) return;
		const skillId = jabsBattler.getGuardSkillId();
		jabsBattler.getBattler().increaseSkillProficiency(skillId, 1);
	};
	/**
	* Determines whether or not this battle can gain proficiency for the guard skill.
	* @param {JABS_Battler} jabsBattler The battler that is guarding/parrying.
	* @returns {boolean} True if we can gain proficiency, false otherwise.
	*/
	Game_Action.prototype.canGainProficiencyFromGuarding = function(jabsBattler) {
		const canGainProficiency = jabsBattler.getBattler().canGainProficiency();
		if (!canGainProficiency) return false;
		const skillId = jabsBattler.getGuardSkillId();
		if (!skillId) return false;
		return true;
	};
}

//#endregion
//#region src/plugins/prof/core/objects/Game_System.js
/**
* Updates the list of all available proficiency conditionals from the latest plugin metadata.
*/
J.PROF.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.PROF.Aliased.Game_System.get("onAfterLoad").call(this);
	this.updateProficienciesFromPluginMetadata();
};
/**
* Updates the plugin metadata after the game data has loaded.
*/
Game_System.prototype.updateProficienciesFromPluginMetadata = function() {
	$gameActors.actorIds().forEach((actorId) => {
		const actorConditionals = J.PROF.Metadata.conditionals.filter((condition) => condition.actorIds.includes(actorId));
		J.PROF.Metadata.actorConditionalsMap.set(actorId, actorConditionals);
	});
};

//#endregion
//#region src/plugins/prof/core/managers/TextManager.js
/**
* Gets the proper name of "proficiency bonus", which is quite long, really.
* @returns {string}
*/
TextManager.proficiencyBonus = function() {
	return "Proficiency+";
};
/**
* Gets the description text for the proficiency boost.
* @returns {string[]}
*/
TextManager.proficiencyDescription = function() {
	return ["The numeric bonus of proficiency gained when gaining proficiency.", "Higher amounts of this means achieving proficiency mastery faster."];
};

//#endregion
//#region src/plugins/prof/core/managers/IconManager.js
/**
* Gets the icon index for the proficiency boost.
* @return {number}
*/
IconManager.proficiencyBoost = function() {
	return 979;
};

//#endregion
//#region src/plugins/prof/core/core/registerProfParameters.js
/**
* Boot-time registration for J-Prof parameters in {@link ParameterRegistry}.
*/
var ProfParameterRegistration = class {
	/**
	* Registers proficiency bonus with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("prof").group(ParameterGroups.FATE).sortOrder(4).label(() => TextManager.proficiencyBonus()).description(() => TextManager.proficiencyDescription()).iconIndex(() => IconManager.proficiencyBoost()).format(ParameterFormat.FLAT).getValue((battler) => battler.prof).sdpBinding(SdpParameterBinding.byKey("prof", (actor) => actor.baseSkillProficiencyAmount())).build());
	}
};

//#endregion
//#region src/plugins/prof/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Initializes the proficiency data. The passive detail window draws
* J-Prof data directly from the state note — no contributor registration needed.
*/
J.PROF.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.PROF.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	J.PROF.Metadata.initializeProficiencies();
};

//#endregion
//#region src/plugins/prof/core/_metadata/pluginCommands.js
/**
* Plugin command for modifying proficiency for one or more actors for one or more skills by a given amount.
*/
PluginManager.registerCommand(J.PROF.Metadata.name, "modifyActorSkillProficiency", (args) => {
	const { actorIds, skillIds } = args;
	const parsedActorIds = JSON.parse(actorIds).map((num) => parseInt(num));
	const parsedSkillIds = JSON.parse(skillIds).map((num) => parseInt(num));
	let { amount } = args;
	amount = parseInt(amount);
	parsedSkillIds.forEach((skillId) => {
		parsedActorIds.forEach((actorId) => {
			$gameActors.actor(actorId).increaseSkillProficiency(skillId, amount);
		});
	});
});
/**
* Plugin command for modifying proficiency of the whole party for one or more skills by a given amount.
*/
PluginManager.registerCommand(J.PROF.Metadata.name, "modifyPartySkillProficiency", (args) => {
	const { skillIds } = args;
	let { amount } = args;
	const parsedSkillIds = JSON.parse(skillIds).map((num) => parseInt(num));
	amount = parseInt(amount);
	$gameParty.members().forEach((actor) => {
		parsedSkillIds.forEach((skillId) => {
			actor.increaseSkillProficiency(skillId, amount);
		});
	});
});

//#endregion
//# sourceMappingURL=J-Proficiency.js.map