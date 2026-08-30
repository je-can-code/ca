//region introduction
 
/*:
 * @target MZ
 * @plugindesc [v2.2.1 DIFFICULTY] A layered difficulty system.
 * @base J-Base
 * @orderAfter J-Base
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @orderAfter J-SDP
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to apply one to many "difficulty layers",
 * defined as a collection of parameter modifications and bonuses against both
 * actors and enemies alike.
 * ----------------------------------------------------------------------------
 * NOTE:
 * There are no tags for this plugin.
 * All difficulties are defined in an external JSON file.
 * ============================================================================
 * CHANGELOG:
 * - 2.2.1
 *    Routed the duplicate-key and lock/unlock/enable/disable warnings through
 *    J-Base's new Diagnostics, so each one names J-Difficulty in the console.
 * - 2.2.0
 *    Difficulty layers now retain the raw configuration they were built from.
 *    The classifier reads a fixed set of fields by name, so anything an
 *    extension adds to a layer was unrecoverable once parsing finished - and
 *    parsing happens during this plugin's own construction, too early for any
 *    extension to intervene. Keeping the source is what lets an extension find
 *    its own fields without reading the file a second time.
 * - 2.1.2
 *    Difficulty scaling can no longer reduce max hp below one. The engine floors
 *    it at one inside its own param call, and the difficulty multiplier was
 *    applied to the result - outside that clamp - so a max hp multiplier of zero
 *    produced a battler with no maximum hp and broke every ratio computed from
 *    it. Other parameters still scale to zero, which is a legitimate setting.
 * - 2.1.1
 *    The difficulty points window no longer declares private members. A
 *    window's constructor reaches initialize, and through it the drawing
 *    hooks, before a derived class installs its own members- so anything
 *    private was being touched on an object that did not yet have it.
 * - 2.1.0
 *    Routed the _difficulty namespace into its own save section, so difficulty
 *    state lands in systems/difficulty.json rather than in the system blob.
 *    Moved the _difficulty namespace seeding from the initialize alias to
 *    initMembers, so a decoded save can establish it without a constructor.
 * - 2.0.2
 *    Fixed the scene's initMembers chain never reaching Scene_Base, which left
 *    the modal dimmer field unseeded. getModalDimmerWindow guards on === null,
 *    so undefined slipped straight past it and showModalDimmer dereferenced it.
 *    Command windows now seed state in initMembers, early enough for
 *    makeCommandList to see it.
 * - 2.0.1
 *    Added flag for showing external file load info.
 *    Removed dead plugin parameter inputs.
 * - 2.0.0
 *    Updated window layout of scene.
 *    Added multiple layer application support.
 *    Updated difficulty layers to also be applicable to actors if desired.
 *    Refactored a lot of underlying code.
 *    Externalized difficulty layer data.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param initialPoints
 * @parent difficultyConfigs
 * @type number
 * @text Starting Points
 * @desc The number of points the player has available from the start of a new game.
 * @default 10
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The key of the starting or default difficulty before it is decided.
 * @default 000_default
 *
 * @command callDifficultyMenu
 * @text Call Difficulty Menu
 * @desc Calls the difficulty menu regardless of the current scene.
 *
 * @command lockDifficulty
 * @text Lock Difficulty
 * @desc Locks a difficulty, making it unchoosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be locked.
 *
 * @command unlockDifficulty
 * @text Unlock Difficulty
 * @desc Unlocks a difficulty, making it choosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unlocked.
 *
 * @command hideDifficulty
 * @text Hide Difficulty
 * @desc Hides a difficulty, preventing it from being added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be hidden.
 *
 * @command unhideDifficulty
 * @text Unhide Difficulty
 * @desc Shows a difficulty, forcing it to be added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unhidden.
 *
 * @command enableDifficulty
 * @text Enable Difficulty
 * @desc Enables a difficulty, applying its effects.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be enabled.
 *
 * @command disableDifficulty
 * @text Disable Difficulty
 * @desc Disables a difficulty, rendering its effects inactive.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be disabled.
 *
 * @command modifyLayerMax
 * @text Modify Layer Max
 * @desc Modifies the maximum difficulty layer points by the given amount.
 * @arg amount
 * @type number
 * @desc The amount to modify the max layer points by. This can be negative.
 * @min -999999
 * @max 999999
 */
 

//#region src/plugins/diff/core/__models/DifficultyBonusEffects.js
var DifficultyBonusEffects = class {
	/**
	* The bonus multiplier for experience earned by the player.
	* @type {number}
	*/
	exp = 100;
	/**
	* The bonus multiplier for gold found by the player.
	* @type {number}
	*/
	gold = 100;
	/**
	* The bonus multiplier for sdp acquired by the player.
	* @type {number}
	*/
	sdp = 100;
	/**
	* The bonus multiplier for drops (potentially) gained by the player.
	* @type {number}
	*/
	drops = 100;
	/**
	* The bonus multiplier for the encounter rate for the player.
	* @type {number}
	*/
	encounters = 100;
};

//#endregion
//#region src/plugins/diff/core/__models/DifficultyMetadata.js
/**
* A class governing a single difficulty and the way it impacts the game parameters.
*/
var DifficultyMetadata = class {
	/**
	* The name of the difficulty, visually to the player.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The description of the difficulty, displayed in the help window at the top.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The icon used when the name of the difficulty is displayed in the scene.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The cost required to enable this difficulty.
	* @type {number}
	*/
	cost = 0;
	/**
	* The various battler effects that apply against actors.
	* @type {DifficultyBattlerEffects}
	*/
	actorEffects = new DifficultyBattlerEffects();
	/**
	* The various battler effects that apply against enemies.
	* @type {DifficultyBattlerEffects}
	*/
	enemyEffects = new DifficultyBattlerEffects();
	/**
	* The various reward modifiers applied against the party.
	* @type {DifficultyBonusEffects}
	*/
	rewards = new DifficultyBonusEffects();
	/**
	* Whether or not this difficulty is enabled.
	* When a difficulty is enabled, its global effects are applied.
	* @type {boolean}
	*/
	enabled = false;
	/**
	* Whether or not this difficulty is unlocked and can be enabled/disabled.
	* @type {boolean}
	*/
	unlocked = true;
	/**
	* Whether or not this difficulty is hidden from selection.
	* @type {boolean}
	*/
	hidden = false;
};

//#endregion
//#region src/plugins/diff/core/__models/DifficultyBattlerEffects.js
/**
* A collection of all applicable multipliers against core parameters
* that are a part of a {@link DifficultyMetadata}.<br>
*/
var DifficultyBattlerEffects = class DifficultyBattlerEffects {
	/**
	* Creates a new {@link DifficultyBattlerEffects} with the given parameters.
	* @param {number[]} bparams The bparams.
	* @param {number[]} xparams The xparams.
	* @param {number[]} sparams The sparams.
	* @param {number[]} cparams The cparams.
	* @returns {DifficultyBattlerEffects}
	*/
	static fromRaw(bparams, xparams, sparams, cparams) {
		const battlerEffects = new DifficultyBattlerEffects();
		battlerEffects.bparams = bparams;
		battlerEffects.xparams = xparams;
		battlerEffects.sparams = sparams;
		battlerEffects.cparams = cparams;
		return battlerEffects;
	}
	/**
	* The base/b-parameter multipliers.
	* The array aligns percent multipliers against the matching index's parameters.
	* @type {[number, number, number, number, number, number, number, number]}
	*/
	bparams = [
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100
	];
	/**
	* The secondary/s-parameter multipliers.
	* The array aligns percent multipliers against the matching index's parameters.
	* @type {[number, number, number, number, number, number, number, number, number, number]}
	*/
	sparams = [
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100
	];
	/**
	* The extraneous/x-parameter multipliers.
	* The array aligns percent multipliers against the matching index's parameters.
	* @type {[number, number, number, number, number, number, number, number, number, number]}
	*/
	xparams = [
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100,
		100
	];
	/**
	* The custom/c-parameter multipliers.
	* This array is loosely defined based on index of custom parameters.
	* @type {number[]}
	*/
	cparams = [];
};

//#endregion
//#region src/plugins/diff/core/__models/DifficultyLayer.js
/**
* A class governing a single difficulty and the way it impacts the game parameters.
*/
var DifficultyLayer = class DifficultyLayer {
	/**
	* Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.
	* @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
	* @returns {DifficultyLayer} The new difficulty based on the metadata.
	*/
	static fromMetadata(difficultyMetadata) {
		const difficultyLayer = new DifficultyLayer(difficultyMetadata.key);
		difficultyLayer.name = difficultyMetadata.name;
		difficultyLayer.description = difficultyMetadata.description;
		difficultyLayer.iconIndex = difficultyMetadata.iconIndex;
		difficultyLayer.cost = difficultyMetadata.cost;
		difficultyLayer.actorEffects = new DifficultyBattlerEffects();
		difficultyLayer.actorEffects.bparams = [...difficultyMetadata.actorEffects.bparams];
		difficultyLayer.actorEffects.sparams = [...difficultyMetadata.actorEffects.sparams];
		difficultyLayer.actorEffects.xparams = [...difficultyMetadata.actorEffects.xparams];
		difficultyLayer.actorEffects.cparams = [...difficultyMetadata.actorEffects.cparams];
		difficultyLayer.enemyEffects = new DifficultyBattlerEffects();
		difficultyLayer.enemyEffects.bparams = [...difficultyMetadata.enemyEffects.bparams];
		difficultyLayer.enemyEffects.sparams = [...difficultyMetadata.enemyEffects.sparams];
		difficultyLayer.enemyEffects.xparams = [...difficultyMetadata.enemyEffects.xparams];
		difficultyLayer.enemyEffects.cparams = [...difficultyMetadata.enemyEffects.cparams];
		difficultyLayer.rewards = new DifficultyBonusEffects();
		difficultyLayer.rewards.exp = difficultyMetadata.rewards.exp;
		difficultyLayer.rewards.gold = difficultyMetadata.rewards.gold;
		difficultyLayer.rewards.drops = difficultyMetadata.rewards.drops;
		difficultyLayer.rewards.encounters = difficultyMetadata.rewards.encounters;
		difficultyLayer.rewards.sdp = difficultyMetadata.rewards.sdp;
		return difficultyLayer;
	}
	/**
	* Creates a new instance of {@link DifficultyLayer} from another {@link DifficultyLayer}.
	* @param {DifficultyLayer} layer The metadata to build from.
	* @returns {DifficultyLayer} The new difficulty based on the layer.
	*/
	static fromLayer(layer) {
		const difficultyLayer = new DifficultyLayer(layer.key);
		difficultyLayer.name = layer.name;
		difficultyLayer.description = layer.description;
		difficultyLayer.iconIndex = layer.iconIndex;
		difficultyLayer.cost = layer.cost;
		difficultyLayer.actorEffects = new DifficultyBattlerEffects();
		difficultyLayer.actorEffects.bparams = [...layer.actorEffects.bparams];
		difficultyLayer.actorEffects.sparams = [...layer.actorEffects.sparams];
		difficultyLayer.actorEffects.xparams = [...layer.actorEffects.xparams];
		difficultyLayer.actorEffects.cparams = [...layer.actorEffects.cparams];
		difficultyLayer.enemyEffects = new DifficultyBattlerEffects();
		difficultyLayer.enemyEffects.bparams = [...layer.enemyEffects.bparams];
		difficultyLayer.enemyEffects.sparams = [...layer.enemyEffects.sparams];
		difficultyLayer.enemyEffects.xparams = [...layer.enemyEffects.xparams];
		difficultyLayer.enemyEffects.cparams = [...layer.enemyEffects.cparams];
		difficultyLayer.rewards = new DifficultyBonusEffects();
		difficultyLayer.rewards.exp = layer.rewards.exp;
		difficultyLayer.rewards.gold = layer.rewards.gold;
		difficultyLayer.rewards.drops = layer.rewards.drops;
		difficultyLayer.rewards.encounters = layer.rewards.encounters;
		difficultyLayer.rewards.sdp = layer.rewards.sdp;
		return difficultyLayer;
	}
	/**
	* The key associated with the applied difficulty.
	* @type {string}
	*/
	static appliedKey = `000_applied-difficulty`;
	/**
	* The name of the applied difficulty.
	* @type {string}
	*/
	static appliedName = `Applied Difficulty`;
	/**
	* The description of the applied difficulty.
	* @type {string}
	*/
	static appliedDescription = `The combined effects of all enabled difficulties.`;
	/**
	* Constructor to instantiate a layer of difficulty with a key.
	* @param {string} key The key of this layer.
	*/
	constructor(key) {
		this.key = key;
	}
	/**
	* Checks whether or not this difficulty layer is actually the default layer.
	* @returns {boolean}
	*/
	isDefaultLayer() {
		return this.key === J.DIFFICULTY.Metadata.defaultKey;
	}
	/**
	* Checks whether or not this difficulty layer is actually the applied difficulty layer.
	* @returns {boolean}
	*/
	isAppliedLayer() {
		return this.key === DifficultyLayer.appliedKey;
	}
	/**
	* The name of the difficulty, visually to the player.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The description of the difficulty, displayed in the help window at the top.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The icon used when the name of the difficulty is displayed in the scene.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* The cost required to enable this difficulty.
	* @type {number}
	*/
	cost = 0;
	/**
	* The various parameter effects that apply to actors.
	* @type {DifficultyBattlerEffects}
	*/
	actorEffects = new DifficultyBattlerEffects();
	/**
	* The various parameter effects that apply to enemies.
	* @type {DifficultyBattlerEffects}
	*/
	enemyEffects = new DifficultyBattlerEffects();
	/**
	* The various reward effects that apply to the party.
	* @type {DifficultyBonusEffects}
	*/
	rewards = new DifficultyBonusEffects();
	/**
	* Whether or not this difficulty's cost can be covered by the remaining layer points.
	* @returns {boolean} True if the cost can be paid, false otherwise.
	*/
	canPayCost() {
		const canPay = this.cost <= $gameSystem.getRemainingLayerPoints();
		return canPay;
	}
	/**
	* Determines whether or not this difficulty is unlocked.
	* @returns {boolean}
	*/
	isUnlocked() {
		const { unlocked } = $gameSystem.getDifficultyConfigByKey(this.key);
		return unlocked;
	}
	/**
	* Locks this difficulty, making it unavailable for the player to enable/disable.
	*/
	lock() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.unlocked = false;
	}
	/**
	* Unlocks this difficulty, making it available for the player to enable/disable.
	*/
	unlock() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.unlocked = true;
	}
	/**
	* Determines whether or not this difficulty is hidden in the list.
	* @returns {boolean}
	*/
	isHidden() {
		const { hidden } = $gameSystem.getDifficultyConfigByKey(this.key);
		return hidden;
	}
	/**
	* Hides this difficulty, making it no longer listed in the difficulty list.
	*/
	hide() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.hidden = true;
	}
	/**
	* Unhides this difficulty, making it visible in the difficulty list.
	*/
	unhide() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.hidden = false;
	}
	/**
	* Determines whether or not this difficulty is currently enabled.
	* @returns {boolean} True if this difficulty is enabled, false otherwise.
	*/
	isEnabled() {
		const { enabled } = $gameSystem.getDifficultyConfigByKey(this.key);
		return enabled;
	}
	/**
	* Enables this difficulty layer.
	*/
	enable() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.enabled = true;
	}
	/**
	* Disables this difficulty layer.
	*/
	disable() {
		const config = $gameSystem.getDifficultyConfigByKey(this.key);
		config.enabled = false;
	}
};

//#endregion
//#region src/plugins/diff/core/__models/DifficultyBuilder.js
/**
* The fluent-builder for easily creating new difficulties.
*/
var DifficultyBuilder = class {
	#name = String.empty;
	#key = String.empty;
	#description = String.empty;
	#iconIndex = 0;
	#cost = 0;
	#actorEffects = new DifficultyBattlerEffects();
	#enemyEffects = new DifficultyBattlerEffects();
	#rewards = new DifficultyBonusEffects();
	#enabled = false;
	#unlocked = true;
	#hidden = false;
	/**
	* Constructor.
	* @param {string} name The name of this difficulty.
	* @param {string} key The unique key of this difficulty.
	*/
	constructor(name, key) {
		this.setName(name);
		this.setKey(key);
	}
	/**
	* Builds the difficulty with its current configuration.
	* @returns {DifficultyMetadata}
	*/
	build() {
		const difficulty = new DifficultyMetadata();
		difficulty.name = this.#name;
		difficulty.key = this.#key;
		difficulty.description = this.#description;
		difficulty.iconIndex = this.#iconIndex;
		difficulty.cost = this.#cost;
		difficulty.actorEffects = this.#actorEffects;
		difficulty.enemyEffects = this.#enemyEffects;
		difficulty.rewards = this.#rewards;
		difficulty.enabled = this.#enabled;
		difficulty.unlocked = this.#unlocked;
		difficulty.hidden = this.#hidden;
		return difficulty;
	}
	buildAsLayer() {
		const difficulty = new DifficultyLayer(this.#key);
		difficulty.name = this.#name;
		difficulty.description = this.#description;
		difficulty.iconIndex = this.#iconIndex;
		difficulty.cost = this.#cost;
		difficulty.actorEffects = this.#actorEffects;
		difficulty.enemyEffects = this.#enemyEffects;
		difficulty.rewards = this.#rewards;
		difficulty.enabled = this.#enabled;
		difficulty.unlocked = this.#unlocked;
		difficulty.hidden = this.#hidden;
		return difficulty;
	}
	setName(name) {
		this.#name = name;
		return this;
	}
	setKey(key) {
		this.#key = key;
		return this;
	}
	setDescription(description) {
		this.#description = description;
		return this;
	}
	setIconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	setCost(cost) {
		this.#cost = cost;
		return this;
	}
	setActorEffects(effects) {
		this.#actorEffects = effects;
		return this;
	}
	setEnemyEffects(effects) {
		this.#enemyEffects = effects;
		return this;
	}
	setRewards(rewards) {
		this.#rewards = rewards;
		return this;
	}
	setUnlocked(unlocked) {
		this.#unlocked = unlocked;
		return this;
	}
	setEnabled(enabled) {
		this.#enabled = enabled;
		return this;
	}
	setHidden(hidden) {
		this.#hidden = hidden;
		return this;
	}
};

//#endregion
//#region src/plugins/diff/core/__models/DifficultyConfig.js
var DifficultyConfig = class DifficultyConfig {
	/**
	* Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.<br>
	* @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
	* @returns {DifficultyLayer} The new difficulty based on the metadata.
	*/
	static fromMetadata(difficultyMetadata) {
		const difficultyConfig = new DifficultyConfig();
		difficultyConfig.key = difficultyMetadata.key;
		difficultyConfig.enabled = difficultyMetadata.enabled;
		difficultyConfig.unlocked = difficultyMetadata.unlocked;
		difficultyConfig.hidden = difficultyMetadata.hidden;
		return difficultyConfig;
	}
	/**
	* The unique identifier of the difficulty, used for lookup and reference.
	* @type {string}
	*/
	key = String.empty;
	/**
	* Whether or not this difficulty is enabled.
	* When a difficulty is enabled, its global effects are applied.
	* @type {boolean}
	*/
	enabled = false;
	/**
	* Whether or not this difficulty is unlocked and can be enabled/disabled.
	* @type {boolean}
	*/
	unlocked = true;
	/**
	* Whether or not this difficulty is hidden from selection.
	* @type {boolean}
	*/
	hidden = false;
	/**
	* Constructor.
	* @param {string} key The key of the difficulty.
	* @param {boolean} enabled Whether or not this difficulty's effects are applied from the start.
	* @param {boolean} unlocked Whether or not this difficulty is unlocked for application.
	* @param {boolean} hidden Whether or not this difficulty is visible in the list.
	*/
	constructor(key = String.empty, enabled = false, unlocked = true, hidden = false) {
		this.key = key;
		this.enabled = enabled;
		this.unlocked = unlocked;
		this.hidden = hidden;
	}
};
/**
* Every difficulty the player has toggled lives in a savefile at
* `$gameSystem._j._difficulty._configurations`, so the save encoder meets this type and needs a
* codec for it.
*
* The defaults live in class fields, which only run when a constructor does- and the decoder never
* runs one. The seed therefore copies them off a freshly built instance rather than restating them,
* which is safe because this constructor defaults every parameter and does nothing but assign.
*/
SerializableRegistry.register(DifficultyConfig, {
	id: "difficulty-config",
	aliases: ["DifficultyConfig"],
	seed: (instance) => Object.assign(instance, new DifficultyConfig())
});

//#endregion
//#region src/plugins/diff/core/_metadata/_pluginMetadata.js
var J_DiffPluginMetadata = class J_DiffPluginMetadata extends PluginMetadata {
	/**
	* Project-relative path to the difficulty JSON configuration file.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.difficulty.json";
	/**
	* The underlying layer that represents the default.<br>
	* It is null by default but is updated at initiation and during modification of layers.
	* @type {DifficultyLayer|null}
	*/
	static #default = null;
	/**
	* A default {@link DifficultyLayer} with all unmodified parameters and bonuses.
	* When all layers are disabled, this is the default layer used.
	* @type {DifficultyLayer}
	*/
	static defaultLayer() {
		return this.#default;
	}
	/**
	* Updates the default layer with a new default.
	* @param {DifficultyLayer} layer The layer driving this step.
	*/
	static updateDefaultLayer(layer) {
		this.#default = layer;
	}
	/**
	* Converts the JSON-parsed blob into classified {@link DifficultyLayer}s.
	* @param {any} parsedBlob The already-parsed JSON blob.
	* @return {Map<string, DifficultyMetadata>} A map of the difficulty layers by their keys.
	*/
	static classifyDifficulties(parsedBlob) {
		/** @type {Map<string, DifficultyMetadata>} */
		const difficultiesMap = new Map();
		const forEacher = (parsedDifficultyBlob) => {
			const { key, name, description, iconIndex, cost, actorEffects, enemyEffects, rewards, enabled, unlocked, hidden } = parsedDifficultyBlob;
			const battlerEffectsMapper = (battlerEffects) => {
				const newBParams = [
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100
				];
				const newXParams = [
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100
				];
				const newSParams = [
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100,
					100
				];
				const newCParams = [];
				const { bparams, xparams, sparams, cparams } = battlerEffects;
				bparams.forEach((paramRate, paramId) => newBParams[paramId] = paramRate);
				xparams.forEach((paramRate, paramId) => newXParams[paramId] = paramRate);
				sparams.forEach((paramRate, paramId) => newSParams[paramId] = paramRate);
				cparams.forEach((paramRate, paramId) => newCParams[paramId] = paramRate);
				const modifiedBattlerEffects = DifficultyBattlerEffects.fromRaw(newBParams, newXParams, newSParams, newCParams);
				return modifiedBattlerEffects;
			};
			const mappedActorEffects = battlerEffectsMapper(actorEffects);
			const mappedEnemyEffects = battlerEffectsMapper(enemyEffects);
			/** @type {DifficultyMetadata} */
			const completeDifficulty = new DifficultyBuilder(name, key).setDescription(description).setIconIndex(iconIndex).setCost(cost).setEnabled(enabled).setHidden(hidden).setUnlocked(unlocked).setActorEffects(mappedActorEffects).setEnemyEffects(mappedEnemyEffects).setRewards(rewards).build();
			if (difficultiesMap.get(key)) {
				Diagnostics.warn("J-Difficulty", `duplicate difficulty key definition detected for [${key}].`);
			}
			difficultiesMap.set(key, completeDifficulty);
		};
		parsedBlob.forEach(forEacher);
		return difficultiesMap;
	}
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeDifficulties();
		this.initializeMetadata();
	}
	/**
	* Loads difficulty layers from {@link J_DiffPluginMetadata.CONFIG_PATH}.
	*/
	initializeDifficulties() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Difficulty").configName("difficulty configuration").logSummary((result) => [`- ${result.length} difficulty layers`]).build();
		const parsedBlob = ExternalJsonConfigLoader.load(J_DiffPluginMetadata.CONFIG_PATH, options);
		/**
		* The raw JSON blob for each layer, keyed by that layer's key.
		* Retained because {@link J_DiffPluginMetadata.classifyDifficulties} reads a fixed set of fields
		* by name, so anything an extension adds to a layer's configuration is not represented anywhere
		* in the built metadata and would otherwise be unrecoverable. Keeping the source is what lets an
		* extension find its own fields without reading the file a second time.
		* @type {Map<string, object>}
		*/
		this.allRawConfigs = new Map(parsedBlob.map((blob) => [blob.key, blob]));
		/**
		* A map of difficulty layer metadatas by their key.
		* @type {Map<string, DifficultyMetadata>}
		*/
		this.allMetadatas = J_DiffPluginMetadata.classifyDifficulties(parsedBlob);
	}
	initializeMetadata() {
		/**
		* The key for the default difficulty.
		* @type {string}
		*/
		this.defaultKey = this.parsedPluginParameters["defaultDifficulty"] || "default_undefined";
		/**
		* The default point max for allocating difficulty layers.
		*/
		this.initialPoints = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["initialPoints"], 0);
		const defaultLayer = DifficultyLayer.fromMetadata(this.allMetadatas.get(this.defaultKey));
		J_DiffPluginMetadata.updateDefaultLayer(defaultLayer);
	}
};

//#endregion
//#region src/plugins/diff/core/_metadata/initialization.js
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
J.DIFFICULTY = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.DIFFICULTY.Metadata = new J_DiffPluginMetadata("J-Difficulty", "2.2.1");
/**
* The actual `plugin parameters` extracted from RMMZ.
*/
J.DIFFICULTY.PluginParameters = PluginManager.parameters(J.DIFFICULTY.Metadata.name);
/**
* A collection of all aliased methods for this plugin.
*/
J.DIFFICULTY.Aliased = {
	DataManager: new Map(),
	Game_Actor: new Map(),
	Game_Enemy: new Map(),
	Game_Map: new Map(),
	Game_System: new Map(),
	Game_Temp: new Map(),
	Scene_Map: new Map()
};

//#endregion
//#region src/plugins/diff/core/managers/DifficultyManager.js
/**
* A static class to manage the difficulties with.
*/
var DifficultyManager = class {
	/**
	* Gets all difficulties defined, including locked difficulties.
	* @returns {DifficultyLayer[]}
	*/
	static allDifficulties() {
		const difficultyLayersSource = $gameTemp.getAllDifficultyLayers();
		const difficultyLayers = [];
		difficultyLayersSource.forEach((layer) => difficultyLayers.push(layer));
		return difficultyLayers;
	}
	/**
	* Gets all available difficulties.
	* @returns {DifficultyLayer[]}
	*/
	static availableDifficulties() {
		/** @param {DifficultyLayer} difficultyLayer */
		const filtering = (difficultyLayer) => {
			if (difficultyLayer.isHidden()) return false;
			if (!difficultyLayer.isUnlocked()) return false;
			return true;
		};
		return this.allDifficulties().filter(filtering);
	}
	/**
	* Gets the difficulty by its key.
	* Centralized if needing refactoring down the road.
	* @param {string} key The key of the difficulty to find.
	* @returns {DifficultyLayer|undefined} The difficulty if the key exists, undefined otherwise.
	*/
	static #getDifficultyByKey = (key) => $gameTemp.findDifficultyLayerByKey(key);
	/**
	* Re-evaluates all currently enabled difficulties and refreshes the applied difficulty.
	*/
	static refreshAppliedDifficulty = () => $gameTemp.refreshAppliedDifficulty();
	/**
	* Locks the difficulty with the given key.
	* @param {string} key The difficulty key to lock.
	*/
	static lockDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.lock();
		} else {
			Diagnostics.warn("J-Difficulty", `could not lock difficulty with key: [${key}].`);
		}
	}
	/**
	* Unlocks the difficulty with the given key.
	* @param {string} key The difficulty key to unlock.
	*/
	static unlockDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.unlock();
		} else {
			Diagnostics.warn("J-Difficulty", `could not lock difficulty with key: [${key}].`);
		}
	}
	/**
	* Hides the difficulty with the given key.
	* @param {string} key The difficulty key to hide.
	*/
	static hideDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.hide();
		} else {
			Diagnostics.warn("J-Difficulty", `could not lock difficulty with key: [${key}].`);
		}
	}
	/**
	* Reveals the difficulty with the given key.
	* @param {string} key The difficulty key to reveal.
	*/
	static unhideDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.unhide();
		} else {
			Diagnostics.warn("J-Difficulty", `could not unlock difficulty with key: [${key}].`);
		}
	}
	/**
	* Enables the difficulty with the given key.
	* @param {string} key The difficulty key to enable.
	*/
	static enableDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.enable();
			this.refreshAppliedDifficulty();
		} else {
			Diagnostics.warn("J-Difficulty", `could not enable difficulty with key: [${key}].`);
		}
	}
	/**
	* Disables the difficulty with the given key.
	* @param {string} key The difficulty key to disable.
	*/
	static disableDifficulty(key) {
		const foundDifficulty = this.#getDifficultyByKey(key);
		if (foundDifficulty) {
			foundDifficulty.disable();
			this.refreshAppliedDifficulty();
		} else {
			Diagnostics.warn("J-Difficulty", `could not disable difficulty with key: [${key}].`);
		}
	}
};

//#endregion
//#region src/plugins/diff/core/managers/DataManager.js
/**
* Extends {@link DataManager.setupNewGame}.<br/>
* Includes difficulty setup for new games.
*/
J.DIFFICULTY.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	J.DIFFICULTY.Aliased.DataManager.get("setupNewGame").call(this);
	$gameTemp.setupDifficultySystem();
};

//#endregion
//#region src/plugins/diff/core/objects/Game_System.js
/**
* Extends the `.initialize()` with our difficulty initialization.
*/
J.DIFFICULTY.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.DIFFICULTY.Aliased.Game_System.get("initMembers").call(this);
	this.initDifficultyMembers();
};
/**
* Initializes the Difficulty System.
*/
Game_System.prototype.initDifficultyMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the difficulty system.
	*/
	this._j._difficulty ||= {};
	/**
	* The collection of difficulty configurations tracked by this player.
	* @type {DifficultyConfig[]}
	*/
	this._j._difficulty._configurations = [];
	/**
	* The max points available to allocate to difficulty layers.
	* @type {number}
	*/
	this._j._difficulty._layerPointMax = J.DIFFICULTY.Metadata.initialPoints;
	/**
	* The current number of points allocated to difficulty layers.
	* @type {number}
	*/
	this._j._difficulty._layerPoints = 0;
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Updates the list of all available difficulties from the latest plugin metadata.
*/
J.DIFFICULTY.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.DIFFICULTY.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameTemp.setupDifficultySystem();
};
/**
* Get all current configurations for difficulties.
* @returns {DifficultyConfig[]}
*/
Game_System.prototype.getAllDifficultyConfigs = function() {
	return this._j._difficulty._configurations;
};
/**
* Add a {@link DifficultyConfig} to the list of configurations.
* @param {DifficultyConfig} config The config to add.
*/
Game_System.prototype.addDifficultyConfig = function(config) {
	const difficultyConfigs = this.getAllDifficultyConfigs();
	difficultyConfigs.push(config);
};
/**
* Gets the {@link DifficultyConfig} associated with the given key.
* @param {string} key The key of the difficulty.
* @returns {DifficultyConfig|undefined} The config if found, undefined otherwise.
*/
Game_System.prototype.getDifficultyConfigByKey = function(key) {
	return this.getAllDifficultyConfigs().find((config) => config.key === key);
};
/**
* Registers a {@link DifficultyConfig} with the system if it is not already registered.
* @param {DifficultyConfig} difficultyConfig The config to register.
*/
Game_System.prototype.registerDifficultyConfig = function(difficultyConfig) {
	const { key } = difficultyConfig;
	const foundConfig = this.getDifficultyConfigByKey(key);
	if (!foundConfig) {
		this.addDifficultyConfig(difficultyConfig);
	}
};
/**
* Gets the number of max layer points the player has.
* @returns {number}
*/
Game_System.prototype.getLayerPointMax = function() {
	return this._j._difficulty._layerPointMax;
};
/**
* Sets the max layer points to a designated amount.
* @param {number} layerPointMax The new max layer point value.
*/
Game_System.prototype.setLayerPointMax = function(layerPointMax) {
	this._j._difficulty._layerPointMax = layerPointMax;
};
/**
* Modifies the max layer points by a given amount.
* @param {number} modifier The modifier against the max layer points.
*/
Game_System.prototype.modLayerPointMax = function(modifier) {
	this._j._difficulty._layerPointMax += modifier;
};
/**
* Gets the number of current layer points the player has available.
* @returns {number}
*/
Game_System.prototype.getLayerPoints = function() {
	return this._j._difficulty._layerPoints;
};
/**
* Sets the current number of layer points the player has available.
* @param {number} layerPoints The new amount of layer points for the player.
*/
Game_System.prototype.setLayerPoints = function(layerPoints) {
	this._j._difficulty._layerPoints = layerPoints;
};
/**
* Modifies the current layer points by a given amount.
* @param {number} modifier The modifier against the current layer points.
*/
Game_System.prototype.modLayerPoints = function(modifier) {
	this._j._difficulty._layerPoints += modifier;
};
/**
* Gets the remaining number of layer points available.
* @returns {number}
*/
Game_System.prototype.getRemainingLayerPoints = function() {
	return this.getLayerPointMax() - this.getLayerPoints();
};

//#endregion
//#region src/plugins/diff/core/objects/Game_Temp.js
/**
* Intializes all additional members of this class.
*/
J.DIFFICULTY.Aliased.Game_Temp.set("initMembers", Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function() {
	J.DIFFICULTY.Aliased.Game_Temp.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._difficulty ||= {};
	/**
	* All difficulties that were defined in the plugin metadata.
	* @type {Map<string, DifficultyMetadata>}
	*/
	this._j._difficulty._metadata = J.DIFFICULTY.Metadata.allMetadatas;
	/**
	* All difficulties available for use.
	* @type {Map<string, DifficultyLayer>}
	*/
	this._j._difficulty._allLayers = new Map();
	/**
	* All difficulties' default configurations.
	* @type {Map<string, DifficultyConfig>}
	*/
	this._j._difficulty._allConfigs = new Map();
	/**
	* The "applied" difficulty.
	* This is effectively a combination of all currently enabled difficulties as
	* a single {@link DifficultyLayer}.
	* @type {DifficultyLayer}
	*/
	this._j._difficulty._appliedDifficulty = J_DiffPluginMetadata.defaultLayer();
};
/**
* Gets all difficulties that have been defined by plugin metadata.
* @returns {Map<string, DifficultyLayer>}
*/
Game_Temp.prototype.getAllDifficultyLayers = function() {
	return this._j._difficulty._allLayers;
};
/**
* Finds the {@link DifficultyLayer} that matches the given key.
* @param {string} key The key of the difficulty to find.
* @returns {DifficultyLayer|undefined} The difficulty if it existed, `undefined` otherwise;
*/
Game_Temp.prototype.findDifficultyLayerByKey = function(key) {
	const difficulties = this.getAllDifficultyLayers();
	return difficulties.get(key);
};
/**
* Sets up the difficulty layers based on the plugin parameters.
*/
Game_Temp.prototype.setupDifficultySystem = function() {
	this.metadata().forEach((difficultyMetadata, key) => {
		const difficultyLayer = DifficultyLayer.fromMetadata(difficultyMetadata);
		this.getAllDifficultyLayers().set(key, difficultyLayer);
		const difficultyConfig = DifficultyConfig.fromMetadata(difficultyMetadata);
		this.allConfigs().set(key, difficultyConfig);
		$gameSystem.registerDifficultyConfig(difficultyConfig);
	});
	this.refreshAppliedDifficulty();
};
/**
* Gets the applied difficulty.
* If somehow there is no applied difficulty in-place, then the default will be used.
* @returns {DifficultyLayer}
*/
Game_Temp.prototype.getAppliedDifficulty = function() {
	return this._j._difficulty._appliedDifficulty;
};
/**
* Sets the applied difficulty to the given difficulty.
* @param {DifficultyLayer} difficulty The new applied difficulty.
*/
Game_Temp.prototype.setAppliedDifficulty = function(difficulty) {
	this._j._difficulty._appliedDifficulty = difficulty;
};
/**
* Refreshes the applied difficulty based on the currently enabled layers.
*/
Game_Temp.prototype.refreshAppliedDifficulty = function() {
	const appliedDifficulty = this.buildAppliedDifficulty();
	this.setAppliedDifficulty(appliedDifficulty);
};
/**
* Builds the applied difficulty based on the currently enabled layers.
* @returns {DifficultyLayer}
*/
Game_Temp.prototype.buildAppliedDifficulty = function() {
	/** @type {DifficultyLayer[]} */
	const enabledDifficulties = $gameSystem.getAllDifficultyConfigs().filter((config) => config.enabled).map((config) => this.findDifficultyLayerByKey(config.key));
	if (enabledDifficulties.length === 0) {
		return J_DiffPluginMetadata.defaultLayer();
	}
	const enabledActorEffects = new DifficultyBattlerEffects();
	const enabledEnemyEffects = new DifficultyBattlerEffects();
	const { cost: initialCost, rewards } = DifficultyLayer.fromLayer(J_DiffPluginMetadata.defaultLayer());
	let cost = initialCost;
	enabledDifficulties.forEach((layer) => {
		cost += layer.cost;
		const { actorEffects, enemyEffects } = layer;
		actorEffects.bparams.forEach((bparam, bIndex) => {
			const bParamFactor = parseFloat((bparam / 100).toFixed(3));
			enabledActorEffects.bparams[bIndex] *= bParamFactor;
		});
		actorEffects.xparams.forEach((xparam, xIndex) => {
			const xParamFactor = parseFloat((xparam / 100).toFixed(3));
			enabledActorEffects.xparams[xIndex] *= xParamFactor;
		});
		actorEffects.sparams.forEach((sparam, sIndex) => {
			const sParamFactor = parseFloat((sparam / 100).toFixed(3));
			enabledActorEffects.sparams[sIndex] *= sParamFactor;
		});
		enemyEffects.bparams.forEach((bparam, bIndex) => {
			const bParamFactor = parseFloat((bparam / 100).toFixed(3));
			enabledEnemyEffects.bparams[bIndex] *= bParamFactor;
		});
		enemyEffects.xparams.forEach((xparam, xIndex) => {
			const xParamFactor = parseFloat((xparam / 100).toFixed(3));
			enabledEnemyEffects.xparams[xIndex] *= xParamFactor;
		});
		enemyEffects.sparams.forEach((sparam, sIndex) => {
			const sParamFactor = parseFloat((sparam / 100).toFixed(3));
			enabledEnemyEffects.sparams[sIndex] *= sParamFactor;
		});
		const expFactor = parseFloat((layer.rewards.exp / 100).toFixed(3));
		rewards.exp *= expFactor;
		const goldFactor = parseFloat((layer.rewards.gold / 100).toFixed(3));
		rewards.gold *= goldFactor;
		const dropsFactor = parseFloat((layer.rewards.drops / 100).toFixed(3));
		rewards.drops *= dropsFactor;
		const encountersFactor = parseFloat((layer.rewards.encounters / 100).toFixed(3));
		rewards.encounters *= encountersFactor;
		const sdpFactor = parseFloat((layer.rewards.sdp / 100).toFixed(3));
		rewards.sdp *= sdpFactor;
	}, this);
	const { appliedKey, appliedName, appliedDescription } = DifficultyLayer;
	const newDifficulty = new DifficultyBuilder(appliedName, appliedKey).setDescription(appliedDescription).setCost(cost).setActorEffects(enabledActorEffects).setEnemyEffects(enabledEnemyEffects).setRewards(rewards).buildAsLayer();
	return newDifficulty;
};
/**
* Gets the difficulty metadata staged for the layer being edited.
* @returns {object} The staged difficulty metadata.
*/
Game_Temp.prototype.metadata = function() {
	return this._j._difficulty._metadata;
};
/**
* Gets the all configs.
* @returns {Map<string, DifficultyConfig>} The allConfigs.
*/
Game_Temp.prototype.allConfigs = function() {
	return this._j._difficulty._allConfigs;
};

//#endregion
//#region src/plugins/diff/core/objects/Game_Actor.js
/**
* Extends {@link #param}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("param").call(this, paramId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.actorEffects.bparams[paramId] / 100;
	const scaledValue = Math.round(originalValue * multiplier);
	return paramId === 0 ? Math.max(1, scaledValue) : scaledValue;
};
/**
* Extends {@link #sparam}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("sparam").call(this, sparamId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.actorEffects.sparams[sparamId] / 100;
	return originalValue * multiplier;
};
/**
* Extends {@link #xparam}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("xparam").call(this, xparamId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.actorEffects.xparams[xparamId] / 100;
	return originalValue * multiplier;
};

//#endregion
//#region src/plugins/diff/core/objects/Game_Enemy.js
/**
* Extends {@link #param}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Enemy.set("param", Game_Enemy.prototype.param);
Game_Enemy.prototype.param = function(paramId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("param").call(this, paramId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.enemyEffects.bparams[paramId] / 100;
	const scaledValue = Math.round(originalValue * multiplier);
	return paramId === 0 ? Math.max(1, scaledValue) : scaledValue;
};
/**
* Extends {@link #sparam}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sparam").call(this, sparamId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.enemyEffects.sparams[sparamId] / 100;
	return originalValue * multiplier;
};
/**
* Extends {@link #xparam}.<br/>
* Also modifies the value based on the applied difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId) {
	const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("xparam").call(this, xparamId);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.enemyEffects.xparams[xparamId] / 100;
	return originalValue * multiplier;
};
/**
* Extends the `.exp()` function to modify by difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function() {
	const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("exp").call(this);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.rewards.exp / 100;
	return Math.round(originalValue * multiplier);
};
/**
* Extends the `.gold()` function to modify by difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function() {
	const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("gold").call(this);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.rewards.gold / 100;
	return Math.round(originalValue * multiplier);
};
if (J.DROPS) {
	/**
	* Extends the `.getBaseDropRate()` function to modify by difficulty.
	* @returns {number}
	*/
	J.DIFFICULTY.Aliased.Game_Enemy.set("getBaseDropRate", Game_Enemy.prototype.getBaseDropRate);
	Game_Enemy.prototype.getBaseDropRate = function() {
		const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("getBaseDropRate").call(this);
		const appliedDifficulty = $gameTemp.getAppliedDifficulty();
		const multiplier = appliedDifficulty.rewards.drops / 100;
		return Math.round(originalValue * multiplier);
	};
}
if (J.SDP) {
	/**
	* Extends the `.sdpPoints()` function to modify by difficulty.
	* @returns {number}
	*/
	J.DIFFICULTY.Aliased.Game_Enemy.set("sdpPoints", Game_Enemy.prototype.sdpPoints);
	Game_Enemy.prototype.sdpPoints = function() {
		const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sdpPoints").call(this);
		const appliedDifficulty = $gameTemp.getAppliedDifficulty();
		const multiplier = appliedDifficulty.rewards.sdp / 100;
		return Math.round(originalValue * multiplier);
	};
}

//#endregion
//#region src/plugins/diff/core/objects/Game_Map.js
/**
* Extends the `.encounterStep()` function to modify by difficulty.
* @returns {number}
*/
J.DIFFICULTY.Aliased.Game_Map.set("encounterStep", Game_Map.prototype.encounterStep);
Game_Map.prototype.encounterStep = function() {
	const originalValue = J.DIFFICULTY.Aliased.Game_Map.get("encounterStep").call(this);
	const appliedDifficulty = $gameTemp.getAppliedDifficulty();
	const multiplier = appliedDifficulty.rewards.encounters / 100;
	return Math.round(originalValue * multiplier);
};

//#endregion
//#region src/plugins/diff/core/windows/Window_DifficultyList.js
var Window_DifficultyList = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of difficulties for this window.
	*/
	makeCommandList() {
		const difficulties = DifficultyManager.availableDifficulties();
		if (!difficulties.length) return;
		difficulties.sort((a, b) => {
			if (a.key < b.key) return -1;
			if (a.key > b.key) return 1;
			return 0;
		});
		difficulties.forEach(this.makeDifficultyCommand, this);
		const appliedDifficulty = $gameTemp.getAppliedDifficulty();
		this.prependCommand(`\\I[${appliedDifficulty.iconIndex}]${appliedDifficulty.name}`, appliedDifficulty.key, false, appliedDifficulty, 83, 6);
	}
	/**
	* Make and add a single difficulty command.
	* @param {DifficultyLayer} difficulty The dfificulty command to create.
	*/
	makeDifficultyCommand(difficulty) {
		if (difficulty.isHidden()) return;
		if (difficulty.isDefaultLayer()) return;
		const enabledIcon = difficulty.isEnabled() ? 25 : 16;
		let difficultyName = `\\I[${difficulty.iconIndex}]${difficulty.name}`;
		if (!difficulty.isUnlocked()) {
			const lockIcon = 2530;
			difficultyName = `\\I[${lockIcon}]${difficultyName}`;
		}
		const enoughLayerPoints = difficulty.isEnabled() || difficulty.canPayCost();
		const enabled = difficulty.isUnlocked() && enoughLayerPoints;
		this.addCommand(difficultyName, difficulty.key, enabled, difficulty, enabledIcon);
	}
	/**
	* Gets the difficulty being hovered over in this list.
	* @returns {DifficultyLayer}
	*/
	hoveredDifficulty() {
		return this.currentExt();
	}
	/**
	* Designed for overriding to weave in functionality on-change of the index.
	*/
	onIndexChange() {}
};

//#endregion
//#region src/plugins/diff/core/windows/Window_DifficultyPoints.js
/**
* A window containing the difficulty points information.
*/
var Window_DifficultyPoints = class extends Window_Base {
	/**
	* The difficulty layer that the cursor is currently hovering over.
	* @type {DifficultyLayer|null}
	*/
	_hoveredDifficulty = null;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Get the currently hovered difficulty from the list window.
	* @returns {DifficultyLayer}
	*/
	getHoveredDifficulty() {
		return this._hoveredDifficulty;
	}
	/**
	* Set the currently hovered difficulty used by this window.
	* @param {DifficultyLayer} difficulty The difficulty currently hovered.
	*/
	setHoveredDifficulty(difficulty) {
		this._hoveredDifficulty = difficulty;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws the various data points surrounding the difficulty layer points
	* and how they are affected by the difficulty layer currently being
	* hovered over by the player.
	*/
	drawContent() {
		const [x, y] = [0, 0];
		const lh = this.lineHeight();
		this.drawHeader(x, y);
		const maxLayerY = y + lh * 1;
		this.drawMaxLayerPoints(x, maxLayerY);
		const currentLayerX = x + 200;
		const currentLayerY = y + lh * 1;
		this.drawCurrentLayerPoints(currentLayerX, currentLayerY);
		const layerModifierX = x + 250;
		const layerModifierY = y + lh * 1;
		this.drawLayerModifier(layerModifierX, layerModifierY);
	}
	/**
	* Renders the header for the difficulty layer points available to the player.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	drawHeader(x, y) {
		this.resetFontSettings();
		this.modFontSize(10);
		this.toggleItalics(true);
		this.drawIcon(2564, x, y);
		const modX = x + ImageManager.iconWidth + 4;
		const modY = y - 2;
		this.drawText(`Difficulty Layer Points`, modX, modY, 300, "left");
		this.resetFontSettings();
	}
	/**
	* Renders the maximum amount of layer points the player has available.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	drawMaxLayerPoints(x, y) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const layerPointMax = $gameSystem.getLayerPointMax();
		this.toggleBold(true);
		this.drawText(`Max:`, x, y, 100, "left");
		this.toggleBold(false);
		this.drawText(`${layerPointMax}`, x, y, 100, "right");
		this.resetFontSettings();
	}
	/**
	* Renders the currently applied layer points.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	drawCurrentLayerPoints(x, y) {
		this.resetFontSettings();
		this.modFontSize(-4);
		const layerPointsCurrent = $gameSystem.getLayerPoints();
		this.toggleBold(true);
		this.drawText(`Applied:`, x, y, 100, "left");
		this.toggleBold(false);
		this.drawText(`${layerPointsCurrent}`, x, y, 100, "right");
		this.resetFontSettings();
	}
	/**
	* Renders the modifer against the current amount of applied layer points.
	* @param {number} x The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	drawLayerModifier(x, y) {
		const difficulty = this.getHoveredDifficulty();
		if (!difficulty) return;
		if (difficulty.isAppliedLayer() || difficulty.isDefaultLayer()) return;
		this.resetFontSettings();
		const layerCost = difficulty.cost;
		let sign = String.empty;
		let costColorIndex = 0;
		if (layerCost > 0) {
			sign = "+";
			if (layerCost + $gameSystem.getLayerPoints() > $gameSystem.getLayerPointMax()) {
				costColorIndex = 10;
			} else {
				costColorIndex = 20;
			}
		}
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.textColor(costColorIndex));
		this.drawText(`(${sign}${layerCost})`, x, y, 100, "right");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/diff/core/windows/Window_DifficultyEffects.js
var Window_DifficultyEffects = class Window_DifficultyEffects extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The difficulty being hovered over from the list.
		* @type {DifficultyBattlerEffects}
		*/
		this.hoveredEffects = null;
		/**
		* The bonuses of the difficulty being hovered over from the list.
		* @type {DifficultyBonusEffects}
		*/
		this.hoveredBonuses = null;
		/**
		* The type of effects being displayed in this list.
		* @type {Window_DifficultyEffects.EffectsTypes}
		*/
		this.hoveredEffectsType = String.empty;
	}
	/**
	* The types of comparison that are valid when comparing parameter values.
	*/
	static ComparisonTypes = {
		SAME: "same",
		EASIER: "easier",
		HARDER: "harder"
	};
	/**
	* The types of effects that can be listed in this window.
	*/
	static EffectsTypes = {
		ACTOR: "actor",
		ENEMY: "enemy"
	};
	/**
	* Gets the list of battler effects that this window is displaying.
	* @returns {DifficultyBattlerEffects}
	*/
	getEffectsList() {
		return this.hoveredEffects;
	}
	/**
	* Sets the list of effects that this window is displaying.
	* @param {DifficultyBattlerEffects} effectsList The new effects list.
	*/
	setEffectsList(effectsList) {
		if (this.hoveredEffects === effectsList) return;
		this.hoveredEffects = effectsList;
	}
	/**
	* Gets the type of battler effects that this window is displaying.
	* @returns {DifficultyBattlerEffects}
	*/
	getEffectsType() {
		return this.hoveredEffectsType;
	}
	/**
	* Sets the type of effects that will display in this list.
	* @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
	*/
	setEffectsType(effectsType) {
		if (this.hoveredEffectsType === effectsType) return;
		this.hoveredEffectsType = effectsType;
	}
	/**
	* Gets the effect bonuses that will display in this list.
	* @returns {DifficultyBonusEffects|null}
	*/
	getEffectsBonuses() {
		return this.hoveredBonuses;
	}
	/**
	* Sets the effect bonuses that will display in this list.
	* @param {DifficultyBonusEffects} bonuses The new bonuses.
	*/
	setEffectsBonuses(bonuses) {
		if (this.hoveredBonuses === bonuses) return;
		this.hoveredBonuses = bonuses;
	}
	/**
	* Updates the contents of this window with new data.
	* @param {DifficultyBattlerEffects} effectsList The new effects list.
	* @param {DifficultyBonusEffects} effectBonuses The new bonuses list.
	* @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
	*/
	updateEffects(effectsList, effectBonuses, effectsType) {
		this.setEffectsType(effectsType);
		this.setEffectsList(effectsList);
		this.setEffectsBonuses(effectBonuses);
		this.refresh();
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Renders all the effect of the hovered difficulty layer.
	*/
	makeCommandList() {
		const effectsList = this.getEffectsList();
		if (!effectsList) return;
		const { bparams, xparams, sparams } = effectsList;
		const battlerEffectsCommands = Array.empty;
		const effectsTitleCommand = this.buildTitleCommand();
		battlerEffectsCommands.push(effectsTitleCommand);
		const bparamCommands = bparams.map(this.buildBParamCommand, this).filter((command) => !!command);
		const xparamCommands = xparams.map(this.buildXParamCommand, this).filter((command) => !!command);
		const sparamCommands = sparams.map(this.buildSParamCommand, this).filter((command) => !!command);
		battlerEffectsCommands.push(...bparamCommands);
		battlerEffectsCommands.push(...xparamCommands);
		battlerEffectsCommands.push(...sparamCommands);
		const bonusCommands = this.bonusEffectsCommands();
		battlerEffectsCommands.push(...bonusCommands);
		battlerEffectsCommands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all bonus effects commands.
	* @returns {BuiltWindowCommand[]}
	*/
	bonusEffectsCommands() {
		switch (this.getEffectsType()) {
			case Window_DifficultyEffects.EffectsTypes.ACTOR: return this.bonusActorEffects();
			case Window_DifficultyEffects.EffectsTypes.ENEMY: return this.bonusEnemyEffects();
		}
	}
	/**
	* Builds all bonus effects applicable to enemies.
	* @returns {BuiltWindowCommand[]}
	*/
	bonusEnemyEffects() {
		const bonuses = this.getEffectsBonuses();
		if (!bonuses) return Array.empty;
		const bonusCommands = Array.empty;
		if (bonuses.exp !== 100) {
			const paramValue = bonuses.exp;
			const paramIconIndex = IconManager.rewardParam(0);
			const paramName = TextManager.rewardParam(0);
			const paramDescription = TextManager.rewardDescription(0);
			let paramSign = String.empty;
			if (paramValue > 100) {
				paramSign = `+`;
			}
			const paramColorIndex = this.getComparedBonusColor(true, paramValue, 100);
			const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
			bonusCommands.push(paramCommand);
		}
		if (bonuses.gold !== 100) {
			const paramValue = bonuses.gold;
			const paramIconIndex = IconManager.rewardParam(1);
			const paramName = TextManager.rewardParam(1);
			const paramDescription = TextManager.rewardDescription(1);
			let paramSign = String.empty;
			if (paramValue > 100) {
				paramSign = `+`;
			}
			const paramColorIndex = this.getComparedBonusColor(true, paramValue, 100);
			const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
			bonusCommands.push(paramCommand);
		}
		if (bonuses.drops !== 100) {
			const paramValue = bonuses.drops;
			const paramIconIndex = IconManager.rewardParam(2);
			const paramName = TextManager.rewardParam(2);
			const paramDescription = TextManager.rewardDescription(2);
			let paramSign = String.empty;
			if (paramValue > 100) {
				paramSign = `+`;
			}
			const paramColorIndex = this.getComparedBonusColor(true, paramValue, 100);
			const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
			bonusCommands.push(paramCommand);
		}
		if (bonuses.sdp !== 100) {
			const paramValue = bonuses.sdp;
			const paramIconIndex = IconManager.rewardParam(4);
			const paramName = TextManager.sdpPoints();
			const paramDescription = TextManager.rewardDescription(4);
			let paramSign = String.empty;
			if (paramValue > 100) {
				paramSign = `+`;
			}
			const paramColorIndex = this.getComparedBonusColor(true, paramValue, 100);
			const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
			bonusCommands.push(paramCommand);
		}
		return bonusCommands;
	}
	/**
	* Builds all bonus effects applicable to actors.
	* @returns {BuiltWindowCommand[]}
	*/
	bonusActorEffects() {
		const bonuses = this.getEffectsBonuses();
		if (!bonuses) return Array.empty;
		const bonusCommands = Array.empty;
		if (bonuses.encounters !== 100) {
			const paramValue = bonuses.encounters;
			const paramIconIndex = IconManager.rewardParam(3);
			const paramName = TextManager.rewardParam(3);
			const paramDescription = TextManager.rewardDescription(3);
			let paramSign = String.empty;
			if (paramValue > 100) {
				paramSign = `+`;
			}
			const paramColorIndex = this.getComparedBonusColor(true, paramValue, 100);
			const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
			bonusCommands.push(paramCommand);
		}
		return bonusCommands;
	}
	buildTitleCommand() {
		switch (this.getEffectsType()) {
			case Window_DifficultyEffects.EffectsTypes.ACTOR: return this.buildActorTitleCommand();
			case Window_DifficultyEffects.EffectsTypes.ENEMY: return this.buildEnemyTitleCommand();
		}
		return new WindowCommandBuilder("Effects").setIconIndex(93).setColorIndex(6).build();
	}
	buildEnemyTitleCommand() {
		return new WindowCommandBuilder("Enemy Effects").setIconIndex(14).setColorIndex(2).build();
	}
	buildActorTitleCommand() {
		return new WindowCommandBuilder("Actor Effects").setIconIndex(82).setColorIndex(1).build();
	}
	buildBParamCommand(paramValue, index) {
		if (paramValue === 100) return;
		const paramIconIndex = IconManager.param(index);
		const paramName = TextManager.param(index);
		const paramDescription = TextManager.bparamDescription(index);
		let paramSign = String.empty;
		if (paramValue > 100) {
			paramSign = `+`;
		}
		const paramColorIndex = this.getComparedColor(this.biggerIsBetterBParameters(index), paramValue, 100);
		const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
		return paramCommand;
	}
	buildXParamCommand(paramValue, index) {
		if (paramValue === 100) return;
		const paramIconIndex = IconManager.xparam(index);
		const paramName = TextManager.xparam(index);
		const paramDescription = TextManager.xparamDescription(index);
		let paramSign = String.empty;
		if (paramValue > 100) {
			paramSign = `+`;
		}
		const paramColorIndex = this.getComparedColor(this.biggerIsBetterXParameters(index), paramValue, 100);
		const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
		return paramCommand;
	}
	buildSParamCommand(paramValue, index) {
		if (paramValue === 100) return;
		const paramIconIndex = IconManager.sparam(index);
		const paramName = TextManager.sparam(index);
		const paramDescription = TextManager.sparamDescription(index);
		let paramSign = String.empty;
		if (paramValue > 100) {
			paramSign = `+`;
		}
		const paramColorIndex = this.getComparedColor(this.biggerIsBetterSParameters(index), paramValue, 100);
		const paramCommand = new WindowCommandBuilder(paramName).setIconIndex(paramIconIndex).setRightText(`${paramSign}${paramValue - 100}`).setColorIndex(paramColorIndex).addTextLines(paramDescription).build();
		return paramCommand;
	}
	/**
	* Gets the text color for the compared/hovered parameter value.
	* @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
	* @param {number} paramValue The currently applied parameter.
	* @param {number} comparisonValue The potential parameter to change to.
	* @returns {string} The color string.
	*/
	getComparedColor(biggerIsBetter, paramValue, comparisonValue) {
		const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);
		if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ENEMY) {
			switch (comparison) {
				case Window_DifficultyEffects.ComparisonTypes.SAME: return 0;
				case Window_DifficultyEffects.ComparisonTypes.EASIER: return 29;
				case Window_DifficultyEffects.ComparisonTypes.HARDER: return 10;
			}
		}
		if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ACTOR) {
			switch (comparison) {
				case Window_DifficultyEffects.ComparisonTypes.SAME: return 0;
				case Window_DifficultyEffects.ComparisonTypes.HARDER: return 29;
				case Window_DifficultyEffects.ComparisonTypes.EASIER: return 10;
			}
		}
	}
	getComparedBonusColor(biggerIsBetter, paramValue, comparisonValue) {
		const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);
		switch (comparison) {
			case Window_DifficultyEffects.ComparisonTypes.SAME: return 0;
			case Window_DifficultyEffects.ComparisonTypes.EASIER: return 29;
			case Window_DifficultyEffects.ComparisonTypes.HARDER: return 10;
		}
	}
	/**
	* Determines whether or not one parameter is "better" than the other.
	* Contextually, this determines whether or not it would become easier for the player if said
	* parameter was changed to the next parameter. In most cases, reducing a parameter would make it
	* easier, so the boolean is typically set to false- but not always.
	* @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
	* @param {number} baseValue The currently applied parameter.
	* @param {number} comparisonValue The potential parameter to change to.
	* @returns {Window_DifficultyEffects.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
	*/
	determineComparisonType(biggerIsBetter, baseValue, comparisonValue) {
		const isSame = baseValue === comparisonValue;
		const baseIsBigger = baseValue > comparisonValue;
		const isImprovement = biggerIsBetter === baseIsBigger;
		if (isSame) {
			return Window_DifficultyEffects.ComparisonTypes.SAME;
		} else if (isImprovement) {
			return Window_DifficultyEffects.ComparisonTypes.EASIER;
		} else if (!isImprovement) {
			return Window_DifficultyEffects.ComparisonTypes.HARDER;
		}
	}
	/**
	* Get whether or not bigger is better for a b-parameter contextually for the player.
	* @param {number} bparamId The b-parameter id.
	* @returns {boolean} True if it is better for the player when bigger, false otherwise.
	*/
	biggerIsBetterBParameters(bparamId) {
		const biggerIsBetterBParameters = [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false
		];
		return biggerIsBetterBParameters.at(bparamId) ?? false;
	}
	/**
	* Get whether or not bigger is better for an s-parameter contextually for the player.
	* @param {number} sparamId The s-parameter id.
	* @returns {boolean} True if it is better for the player when bigger, false otherwise.
	*/
	biggerIsBetterSParameters(sparamId) {
		const biggerIsBetterSParameters = [
			false,
			false,
			false,
			false,
			true,
			true,
			true,
			true,
			true,
			false
		];
		return biggerIsBetterSParameters[sparamId] ?? true;
	}
	/**
	* Get whether or not bigger is better for an s-parameter contextually for the player.
	* @param {number} xparamId The x-parameter id.
	* @returns {boolean} True if it is better for the player when bigger, false otherwise.
	*/
	biggerIsBetterXParameters(xparamId) {
		const biggerIsBetterXParameters = [
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false
		];
		return biggerIsBetterXParameters[xparamId] ?? true;
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
//#region src/plugins/diff/core/scenes/Scene_Difficulty.js
/**
* The difficulty scene for managing the current difficulty.
*/
var Scene_Difficulty = class extends Scene_MenuBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes all properties for this scene.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* A grouping of all properties associated with the difficulty layer system.
		*/
		this._j._difficulty = {};
		/**
		* The window that shows the description of the difficulty layer.
		* @type {Window_Help}
		*/
		this._j._difficulty._helpWindow = null;
		/**
		* The window for showing the difficulty layer point max, current, and projection.
		* @type {Window_DifficultyPoints}
		*/
		this._j._difficulty._pointsWindow = null;
		/**
		* The window for displaying the list of difficulty layers the player has not-hidden.
		* @type {Window_DifficultyList}
		*/
		this._j._difficulty._listWindow = null;
		/**
		* The window for displaying the various enemy effects this difficulty applies.
		* @type {Window_DifficultyEffects}
		*/
		this._j._difficulty._enemyEffects = null;
		/**
		* The window for displaying the various actor effects this difficulty applies.
		* @type {Window_DifficultyEffects}
		*/
		this._j._difficulty._actorEffects = null;
	}
	/**
	* Extends {@link #start}.<br/>
	* Handles the post-scene setup.
	*/
	start() {
		super.start();
		const listWindow = this.getDifficultyListWindow();
		listWindow.select(0);
		this.onHoverChange();
	}
	/**
	* Extends {@link #create}.<br/>
	* Creates our scene's windows.
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
	* Creates all windows associated with the difficulty scene.
	*/
	createAllWindows() {
		this.createPointsWindow();
		this.createHelpWindow();
		this.createListWindow();
		this.createEnemyEffectsWindow();
		this.createActorEffectsWindow();
	}
	/**
	* Creates the points window that displays information about your current point allocation.
	*/
	createPointsWindow() {
		const window = this.buildPointsWindow();
		this.setPointsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the points window.
	* @returns {Window_DifficultyPoints}
	*/
	buildPointsWindow() {
		const rectangle = this.pointsRectangle();
		return new Window_DifficultyPoints(rectangle);
	}
	/**
	* Gets the rectangle associated with the points window.
	* @returns {Rectangle}
	*/
	pointsRectangle() {
		return new Rectangle(0, 0, 400, 100);
	}
	/**
	* Get the currently tracked points window.
	* @returns {Window_DifficultyPoints}
	*/
	getPointsWindow() {
		return this._j._difficulty._pointsWindow;
	}
	/**
	* Set the currently tracked points window to the given window.
	* @param {Window_DifficultyPoints} pointsWindow The points window to track.
	*/
	setPointsWindow(pointsWindow) {
		this._j._difficulty._pointsWindow = pointsWindow;
	}
	/**
	* Creates the help window that provides contextual details to the player
	* about the difficulty difference between the selected and current.
	*/
	createHelpWindow() {
		const window = this.buildHelpWindow();
		this.setHelpWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the help window.
	* @returns {Window_Help}
	*/
	buildHelpWindow() {
		const rectangle = this.helpRectangle();
		return new Window_Help(rectangle);
	}
	/**
	* Gets the rectangle associated with the help window.
	* @returns {Rectangle}
	*/
	helpRectangle() {
		const { width: pointsWidth } = this.getPointsWindow();
		const width = Graphics.boxWidth - pointsWidth;
		return new Rectangle(pointsWidth, 0, width, 100);
	}
	/**
	* Get the currently tracked help window.
	* @returns {Window_Help}
	*/
	getHelpWindow() {
		return this._j._difficultyHelpWindow;
	}
	/**
	* Set the currently tracked help window to the given window.
	* @param {Window_Help} helpWindow The help window to track.
	*/
	setHelpWindow(helpWindow) {
		this._j._difficultyHelpWindow = helpWindow;
	}
	/**
	* Creates the list of difficulties available to the player.
	* This uses the help window's coordinates, and must be created after it.
	*/
	createListWindow() {
		const window = this.buildDifficultyListWindow();
		this.setDifficultyListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the difficulty list window.
	* @returns {Window_DifficultyList}
	*/
	buildDifficultyListWindow() {
		const rectangle = this.difficultyListRectangle();
		const window = new Window_DifficultyList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onSelectDifficulty.bind(this));
		window.onIndexChange = this.onHoverChange.bind(this);
		return window;
	}
	/**
	* Gets the rectangle associated with the difficulty list command window.
	*/
	difficultyListRectangle() {
		const { height: pointsHeight } = this.getPointsWindow();
		const width = 400;
		const height = Graphics.boxHeight - pointsHeight;
		const x = 0;
		const y = pointsHeight;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Get the currently tracked difficulty list window.
	* @returns {Window_DifficultyList}
	*/
	getDifficultyListWindow() {
		return this._j._difficulty._listWindow;
	}
	/**
	* Set the currently tracked difficulty list window to the given window.
	* @param {Window_DifficultyList} difficultyListWindow The difficulty list window to track.
	*/
	setDifficultyListWindow(difficultyListWindow) {
		this._j._difficulty._listWindow = difficultyListWindow;
	}
	/**
	* Creates the window displaying various battler effects applied to enemies.
	*/
	createEnemyEffectsWindow() {
		const window = this.buildDifficultyEnemyEffectsWindow();
		window.deselect();
		window.deactivate();
		this.setDifficultyEnemyEffectsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the difficulty enemy effects window.
	* @returns {Window_DifficultyEffects}
	*/
	buildDifficultyEnemyEffectsWindow() {
		const rectangle = this.difficultyEnemyEffectsRectangle();
		return new Window_DifficultyEffects(rectangle);
	}
	/**
	* Gets the rectangle associated with the difficulty enemy effects window.
	* @returns {Rectangle}
	*/
	difficultyEnemyEffectsRectangle() {
		const { width: listWidth } = this.getDifficultyListWindow();
		const { height: helpHeight } = this.getHelpWindow();
		const width = (Graphics.boxWidth - listWidth) / 2;
		const height = Graphics.boxHeight - helpHeight;
		const x = listWidth;
		const y = helpHeight;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked window.
	* @returns {Window_DifficultyEffects}
	*/
	getDifficultyEnemyEffectsWindow() {
		return this._j._difficulty._enemyEffects;
	}
	/**
	* Sets the currently tracked window to the given window.
	* @param {Window_DifficultyEffects} window The window to track.
	*/
	setDifficultyEnemyEffectsWindow(window) {
		this._j._difficulty._enemyEffects = window;
	}
	/**
	* Creates the window displaying various battler effects applied to actors.
	*/
	createActorEffectsWindow() {
		const window = this.buildDifficultyActorEffectsWindow();
		window.deselect();
		window.deactivate();
		this.setDifficultyActorEffectsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the difficulty actor effects window.
	* @returns {Window_DifficultyEffects}
	*/
	buildDifficultyActorEffectsWindow() {
		const rectangle = this.difficultyActorEffectsRectangle();
		return new Window_DifficultyEffects(rectangle);
	}
	/**
	* Gets the rectangle associated with the difficulty actor effects window.
	* @returns {Rectangle}
	*/
	difficultyActorEffectsRectangle() {
		const { x: enemyEffectsX, width: effectsEffectsWidth } = this.getDifficultyEnemyEffectsWindow();
		const { height: helpHeight } = this.getHelpWindow();
		const leftSideOfEnemyEffects = enemyEffectsX + effectsEffectsWidth;
		const width = Graphics.boxWidth - leftSideOfEnemyEffects;
		const height = Graphics.boxHeight - helpHeight;
		const x = leftSideOfEnemyEffects;
		const y = helpHeight;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked window.
	* @returns {Window_DifficultyEffects}
	*/
	getDifficultyActorEffectsWindow() {
		return this._j._difficulty._actorEffects;
	}
	/**
	* Sets the currently tracked window to the given window.
	* @param {Window_DifficultyEffects} window The window to track.
	*/
	setDifficultyActorEffectsWindow(window) {
		this._j._difficulty._actorEffects = window;
	}
	/**
	* Gets the difficulty being hovered over in the difficulty list.
	* @returns {DifficultyLayer}
	*/
	hoveredDifficulty() {
		const listWindow = this.getDifficultyListWindow();
		return listWindow.hoveredDifficulty();
	}
	/**
	* A hook to perform logic when the selected
	*/
	onHoverChange() {
		this.onHoverUpdatePoints();
		this.onHoverUpdateHelp();
		this.onHoverUpdateEffects();
	}
	/**
	* Updates the points window when the hovered difficulty changes.
	*/
	onHoverUpdatePoints() {
		const hoveredDifficulty = this.hoveredDifficulty();
		const pointsWindow = this.getPointsWindow();
		pointsWindow.setHoveredDifficulty(hoveredDifficulty);
		pointsWindow.refresh();
	}
	/**
	* Updates the help window when the hovered difficulty changes.
	*/
	onHoverUpdateHelp() {
		const hoveredDifficulty = this.hoveredDifficulty();
		const helpWindow = this.getHelpWindow();
		helpWindow.setText(hoveredDifficulty.description);
	}
	/**
	* Updates the details window when the hovered difficulty changes.
	*/
	onHoverUpdateEffects() {
		const hoveredDifficulty = this.hoveredDifficulty();
		if (!hoveredDifficulty) return;
		const { actorEffects, enemyEffects } = hoveredDifficulty;
		this.updateActorEffectsWindow(actorEffects);
		this.updateEnemyEffectsWindow(enemyEffects);
	}
	updateActorEffectsWindow(newActorEffects) {
		const actorEffectsWindow = this.getDifficultyActorEffectsWindow();
		if (actorEffectsWindow.getEffectsList() !== newActorEffects) {
			const { exp, gold, sdp, drops, encounters } = this.hoveredDifficulty().rewards;
			const bonusEffects = new DifficultyBonusEffects();
			bonusEffects.exp = exp;
			bonusEffects.gold = gold;
			bonusEffects.drops = drops;
			bonusEffects.sdp = sdp;
			bonusEffects.encounters = encounters;
			actorEffectsWindow.updateEffects(newActorEffects, bonusEffects, Window_DifficultyEffects.EffectsTypes.ACTOR);
		}
	}
	updateEnemyEffectsWindow(newEnemyEffects) {
		const enemyEffectsWindow = this.getDifficultyEnemyEffectsWindow();
		if (enemyEffectsWindow.getEffectsList() !== newEnemyEffects) {
			const { exp, gold, sdp, drops, encounters } = this.hoveredDifficulty().rewards;
			const bonusEffects = new DifficultyBonusEffects();
			bonusEffects.exp = exp;
			bonusEffects.gold = gold;
			bonusEffects.drops = drops;
			bonusEffects.sdp = sdp;
			bonusEffects.encounters = encounters;
			enemyEffectsWindow.updateEffects(newEnemyEffects, bonusEffects, Window_DifficultyEffects.EffectsTypes.ENEMY);
		}
	}
	/**
	* Runs when the user chooses one of the items in the difficulty list.
	*/
	onSelectDifficulty() {
		const hovered = this.hoveredDifficulty();
		if (hovered.isEnabled()) {
			DifficultyManager.disableDifficulty(hovered.key);
			this.onDisableDifficulty(hovered);
		} else {
			DifficultyManager.enableDifficulty(hovered.key);
			this.onEnableDifficulty(hovered);
		}
		this.refreshCoreDifficultyWindows();
		const listWindow = this.getDifficultyListWindow();
		listWindow.activate();
	}
	/**
	* A hook for performing logic when a difficulty layer is disabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being disabled.
	*/
	onDisableDifficulty(difficulty) {
		this.refundDifficultyCost(difficulty);
		SoundManager.playActorDamage();
	}
	/**
	* A hook for performing logic when a difficulty layer is disabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being disabled.
	*/
	refundDifficultyCost(difficulty) {
		const refund = difficulty.cost * -1;
		$gameSystem.modLayerPoints(refund);
	}
	/**
	* A hook for performing logic when a difficulty layer is enabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being enabled.
	*/
	onEnableDifficulty(difficulty) {
		this.applyDifficultyCost(difficulty);
		SoundManager.playUseSkill();
	}
	/**
	* A hook for performing logic when a difficulty layer is disabled.
	* @param {DifficultyLayer} difficulty The difficulty layer being disabled.
	*/
	applyDifficultyCost(difficulty) {
		$gameSystem.modLayerPoints(difficulty.cost);
	}
	/**
	* Refreshes all windows in the scene at once.
	*/
	refreshCoreDifficultyWindows() {
		const listWindow = this.getDifficultyListWindow();
		const helpWindow = this.getHelpWindow();
		const pointsWindow = this.getPointsWindow();
		listWindow.refresh();
		helpWindow.refresh();
		pointsWindow.refresh();
	}
};

//#endregion
//#region src/plugins/diff/core/_metadata/pluginCommands.js
/**
* Plugin command for calling the Difficulty scene/menu.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "callDifficultyMenu", () => {
	Scene_Difficulty.callScene();
});
/**
* Plugin command for calling the locking one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "lockDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.lockDifficulty(key);
	});
});
/**
* Plugin command for calling the unlocking one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "unlockDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.unlockDifficulty(key);
	});
});
/**
* Plugin command for hiding one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "hideDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.hideDifficulty(key);
	});
});
/**
* Plugin command for unhiding one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "unhideDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.unhideDifficulty(key);
	});
});
/**
* Plugin command for enabling one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "enableDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.enableDifficulty(key);
	});
});
/**
* Plugin command for disabling one or many difficulties.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "disableDifficulty", (args) => {
	let { keys } = args;
	keys = JSON.parse(keys);
	keys.forEach((key) => {
		DifficultyManager.disableDifficulty(key);
	});
});
/**
* Plugin command for modifying the max layer points.
*/
PluginManager.registerCommand(J.DIFFICULTY.Metadata.name, "modifyLayerMax", (args) => {
	const { amount } = args;
	const parsedAmount = parseInt(amount);
	$gameSystem.modLayerPointMax(parsedAmount);
});

//#endregion
//#region src/plugins/diff/core/registerDifficultySaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-Difficulty a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_difficulty", "difficulty");
}

//#endregion
//# sourceMappingURL=J-Difficulty.js.map