//region Introduction
 
/*:
 * @target MZ
 * @plugindesc [v3.0.0 SDP] Enables the SDP system, aka Stat Distribution Panels.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-DropsControl
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-Speed
 * @orderAfter J-DropsControl
 * @orderAfter J-CriticalFactors
 * @orderAfter J-Natural
 * @orderAfter J-Proficiency
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is a form of "stat distribution"- an alternative to the standard
 * of leveling up to raise an actor's stats.
 *
 * Integrates with others of mine plugins:
 * - J-ABS; enemies will individually drop their points and panels.
 * - J-ABS-Speed; enables usage of Movespeed Boost as a parameter on panels.
 * - J-CriticalFactors; enables usage of CDM/CDR as parameters on panels.
 * - J-DropsControl; enables usage of item-as-panel drops.
 * - J-Natural; enables SDP reward modifications.
 * - J-Proficiency; enables usage of Proficiency+ as a parameter on panels.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This system allows the player's party to unlock "stat distribution panels"
 * (aka SDPs), by means of plugin command.
 *
 * The scene to manage unlocked SDPs is accessible via the menu, the JABS
 * quick menu, or via plugin command.
 *
 * Each SDP has the following:
 * - 1+ parameters (of the 27 available in RMMZ) with flat/percent growth.
 * - A fixed rank max.
 * - Rank-up costs driven by **rarity defaults** (plugin parameters) plus optional **per-panel offsets**
 *   in `config.sdp.json` (`baseCost`, `flatGrowthCost`, `multGrowthCost` — usually **0 / 0 / 1.0**).
 * - Customizable name/icon/description1/description2.
 * - Rank up rewards for any/every/max rank, which can be most anything.
 *
 * In order to rank up these SDPs, you'll need to use SDP points. These can be
 * acquired by using the tags below, or by using plugin commands.
 *
 * NOTES:
 * - SDP points gained from enemies are earned for all members of the party.
 * - SDP points are stored and spent on a per-actor basis.
 * - SDP points for an actor cannot be reduced below 0.
 * - Stat Distribution Panels are unlocked for all members of the party.
 * - Stat Distribution Panel rewards can unlock other panels.
 *
 * IMPORTANT NOTE:
 * The SDP data is derived from an external file rather than the plugin's
 * parameters. This file lives in the "/data" directory of your project, and
 * is called "config.sdp.json". You can absolutely generate/modify this file
 * by hand, but you'll probably want to visit my github and swipe the
 * rmmz-data-editor project I've built that provides a convenient GUI for
 * generating and modifying SDPs in just about every way you could need.
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
 * ----------------------------------------------------------------------------
 * NOTE ABOUT PANEL NAMES:
 * Generally speaking, you can name your chosen panels (described in the
 * configuration file mentioned above) whatever you want- with a couple of
 * exceptions for organizational purposes within the JMZ Data Editor.
 *
 * If a panel starts with any of the following characters:
 * - "__" (double underscore)
 * - "--" (double hyphen/dash)
 * - "==" (double equals)
 * Then the panel will not be included in the list that is parsed from the
 * configuration file upon starting the game.
 * ============================================================================
 * ENEMY SDP DROPS:
 * Ever want enemies to drop SDPs themselves for unlocking across the party?
 * Well now you can! By applying the appropriate tag to enemies in the
 * database, you can have enemies drop any singular SDP at any integer percent
 * chance you want them to.
 *
 * NOTE ABOUT SDP DROPS AND JABS:
 * This system was explicitly designed with JABS in mind. If you are not using
 * JABS, you probably instead should just use the SDP UNLOCK tag on an item
 * that the enemy drops for similar functionality. This functionality will
 * dynamically generate the loot for the SDP being unlocked with no database
 * backing and unlock it upon pickup- which would be incompatible outside of
 * JABS.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <sdpDropData:[SDP_KEY, DROP_CHANCE]>
 *   Where SDP_KEY is the unique string key for the SDP to unlock.
 *   Where DROP_CHANCE is the 1-100 percent chance that the SDP will drop.
 *
 * TAG EXAMPLES:
 *  <sdpDropData:[ORC_1, 5]>
 * The enemy with this tag will drop an SDP with the key of "ORC_1" upon defeat
 * 5% of the time.
 *
 *  <sdpDropData:[GOB_4, 100]>
 * The enemy with this tag will drop an SDP with the key of "GOB_4" upon defeat
 * 100% of the time- aka guaranteed drop upon defeat.
 *
 * ============================================================================
 * SDP UNLOCK:
 * Ever wanted items used to unlock SDPs? Well now you can! By applying the
 * necessary tags onto items in the database, you too can have items that will
 * function as SDP unlockers (in addition to whatever else they do).
 * 
 * TAG USAGE:
 * - Items only.
 * 
 * TAG FORMAT:
 *  <sdpUnlock:SDP_KEY>
 *   Where SDP_KEY is the unique string key for the SDP to unlock.
 *
 * TAG EXAMPLES:
 *  <sdpUnlock:ORC_1>
 * An item used with this tag on it will unlock the SDP with the key of "ORC_1"
 * upon use- in addition to its other effects.
 *
 *  <sdpUnlock:GOB_4>
 * An item used with this tag on it will unlock the SDP with the key of "GOB_4"
 * upon use- in addition to its other effects.
 * 
 * ============================================================================
 * SDP POINTS:
 * Ever want enemies to drop SDP Points? Well now they can! By applying the
 * appropriate tag to the enemy/enemies in question, you can have enemies drop
 * as little or as much as you want them to.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <sdp:POINTS>
 *
 * TAG EXAMPLES:
 *  <sdp:10>
 * The party will gain 10 SDP points from defeating this enemy.
 *
 *  <sdp:123456>
 * The party will gain 123456 SDP points from defeating this enemy.
 *
 * ============================================================================
 * SDP MULTIPLIERS:
 * Ever want allies to gain some percentage amount more (or less) of the SDP
 * points earned from enemies? Well now you can! By applying the appropriate
 * tag to the various database locations applicable, you can gain a percentage
 * bonus/penalty amount of SDP points obtained!
 *
 * NOTE:
 * The format implies that you will be providing whole numbers and not actual
 * multipliers, like 1.3 or something. If multiple tags are present across the
 * various database locations on a single actor, they will stack additively.
 * SDP points cannot be reduced below 0 for an actor, but they most certainly
 * can receive negative amounts if the tags added up like that.
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
 *  <sdpMultiplier:AMOUNT>    (for positive)
 *  <sdpMultiplier:-AMOUNT>   (for negative)
 *
 * TAG EXAMPLES:
 *  <sdpMultiplier:25>
 * An actor with something equipped/applied that has the above tag will now
 * gain 25% increased SDP points.
 *
 *  <sdpMultiplier:80>
 *  <sdpMultiplier:-30>
 * An actor with something equipped/applied that has both of the above tags
 * will now gain 50% increased SDP points (80 - 30 = 50).
 *
 * ============================================================================
 * CHANGELOG:
 * - 3.0.0
 *    BREAKING: Rank-up cost spine is defined per **rarity** in plugin parameters; each panel’s `baseCost`,
 *    `flatGrowthCost`, and `multGrowthCost` in `config.sdp.json` are **offsets / scale** (defaults **0 / 0 / 1.0**).
 *    Retune plugin defaults or panel overrides when migrating from v2.x absolute triples.
 * - 2.1.2
 *    Consumed `RPGManager` updates.
 * - 2.1.1
 *    Added flag for showing external file load info.
 * - 2.1.0
 *    Removed association of SDPs being backed by actual database items.
 *    Implemented JABS-centric basis for dynamically generating drops.
 * - 2.0.2
 *    Added new getTotalSdpRanks function to actors for a new data point.
 * - 2.0.1
 *    Added filter for skipping panels that start with particular characters.
 *    Retroactively added note about breaking web deploys for this plugin.
 * - 2.0.0
 *    THIS UPDATE BREAKS WEB DEPLOY FUNCTIONALITY FOR YOUR GAME.
 *    Major breaking changes related to plugin parameters.
 *    Updated to extend common plugin metadata patterns.
 *    Panel data is now strictly data.
 *    Rankings of panels are stored on the actor as save data.
 *    Now loads panel data from external file.
 *    Panels being unlocked/locked are stored on the party.
 *    Updated SDP scene to display rewards.
 *    Updated SDP rewards to have names.
 * - 1.3.0
 *    Added new tag for unlocking panels on use of item.
 * - 1.2.3
 *    Updated JABS menu integration with help text.
 * - 1.2.2
 *    Updated sdp drop production to use drop item builder.
 * - 1.2.1
 *    Update to add tracking for total gained sdp points.
 *    Update to add tracking for total spent sdp points.
 * - 1.2.0
 *    Update to include Max TP as a valid panel parameter.
 * - 1.1.0
 *    Update to accommodate J-CriticalFactors.
 * - 1.0.0
 *    The initial release.
 *
 * ============================================================================
 *
 * @param SDPconfigs
 * @text SDP SETUP
 *
 * @param menuSwitch
 * @parent SDPconfigs
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 104
 *
 * @param sdpIcon
 * @parent SDPconfigs
 * @type number
 * @text Points Icon
 * @desc The default icon index to represent "SDP points".
 * Use the context menu to easily select an index.
 * @default 306
 *
 * @param victoryText
 * @parent SDPconfigs
 * @type string
 * @text Victory Text
 * @desc The text appended to text as seen in the default.
 * This text usually shows up after a battle is won.
 * @default SDP points earned!
 *
 * @param menuCommandName
 * @parent SDPconfigs
 * @type string
 * @text Menu Name
 * @desc The text to show as the name of this command in menus.
 * @default Distribute
 *
 * @param menuCommandIcon
 * @parent SDPconfigs
 * @type number
 * @text Menu Icon
 * @desc The icon to show next to the command in the menu.
 * Use the context menu to easily select an index.
 * @default 2563
 *
 * @param sdpUnitSingular
 * @parent SDPconfigs
 * @type string
 * @text Unit name (singular)
 * @desc Player-facing word for one rankable entry (panel, node, junction, etc.).
 * @default panel
 *
 * @param sdpUnitPlural
 * @parent SDPconfigs
 * @type string
 * @text Unit name (plural)
 * @desc Plural form for counts in confirmations (panels, nodes, …).
 * @default panels
 *
 * @param sdpPointsDisplayName
 * @parent SDPconfigs
 * @type string
 * @text Points name (short)
 * @desc Currency label in SDP UI (confirmation “Remaining …”, cart wallet header, TextManager.sdpPoints).
 * @default SDP
 *
 *
 * @param JABSconfigs
 * @text JABS-ONLY CONFIG
 * @desc Without JABS, these configurations are irrelevant.
 *
 * @param showInBoth
 * @parent JABSconfigs
 * @type boolean
 * @desc If ON, then show in both JABS quick menu and main menu, otherwise only JABS quick menu.
 * @default false
 *
 *
 * @param sdpPanelCostDefaults
 * @text Panel rank-up defaults (by rarity)
 * @desc Core base / flat coefficient / exponential base (**mult**) per rarity. Panel JSON adds offsets on top.
 *
 * @param sdpDefaultCommonBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Common · Base SDP
 * @default 0
 *
 * @param sdpDefaultCommonFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Common · Flat coefficient
 * @default 70
 *
 * @param sdpDefaultCommonMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Common · Mult base
 * @default 1.06
 *
 * @param sdpDefaultMagicalBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Magical · Base SDP
 * @default 0
 *
 * @param sdpDefaultMagicalFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Magical · Flat coefficient
 * @default 235
 *
 * @param sdpDefaultMagicalMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Magical · Mult base
 * @default 1.06
 *
 * @param sdpDefaultRareBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Rare · Base SDP
 * @default 0
 *
 * @param sdpDefaultRareFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Rare · Flat coefficient
 * @default 1180
 *
 * @param sdpDefaultRareMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Rare · Mult base
 * @default 1.06
 *
 * @param sdpDefaultEpicBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Epic · Base SDP
 * @default 0
 *
 * @param sdpDefaultEpicFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Epic · Flat coefficient
 * @default 4320
 *
 * @param sdpDefaultEpicMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Epic · Mult base
 * @default 1.06
 *
 * @param sdpDefaultLegendaryBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Legendary · Base SDP
 * @default 0
 *
 * @param sdpDefaultLegendaryFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Legendary · Flat coefficient
 * @default 11900
 *
 * @param sdpDefaultLegendaryMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Legendary · Mult base
 * @default 1.06
 *
 * @param sdpDefaultGodlikeBase
 * @parent sdpPanelCostDefaults
 * @type number
 * @min -999999
 * @text Godlike · Base SDP
 * @default 0
 *
 * @param sdpDefaultGodlikeFlat
 * @parent sdpPanelCostDefaults
 * @type number
 * @min 0
 * @text Godlike · Flat coefficient
 * @default 30500
 *
 * @param sdpDefaultGodlikeMult
 * @parent sdpPanelCostDefaults
 * @type number
 * @decimals 2
 * @min 1.00
 * @text Godlike · Mult base
 * @default 1.06
 *
 * @command Call SDP Menu
 * @text Access the SDP Menu
 * @desc Calls the SDP Menu directly via plugin command.
 *
 * @command Unlock SDP
 * @text Unlock Panel(s)
 * @desc Unlocks a new panel for the player to level up by its key. Key must exist in the SDPs list above.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the SDPs that will be unlocked.
 *
 * @command Lock SDP
 * @text Lock Panel(s)
 * @desc Locks a SDP by its key. Locked panels do not appear in the list nor affect the player's parameters.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the SDPs that will be locked.
 *
 * @command Modify SDP points
 * @text Add/Remove SDP points
 * @desc Adds or removes a designated amount of points from an actor.
 * @arg actorId
 * @type actor
 * @desc The actor to modify the points of.
 * @arg sdpPoints
 * @type number
 * @min -99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 *
 * @command Modify party SDP points
 * @text Add/Remove party's SDP points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg sdpPoints
 * @type number
 * @min -99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 */
 

//#region src/plugins/sdp/core/__models/PanelParameter.js
/**
* A class that represents a single parameter and its growth for a SDP.
*/
function PanelParameter() {
	this.initialize(...arguments);
}
PanelParameter.prototype = {};
PanelParameter.prototype.constructor = PanelParameter;
/**
* Initializes a single panel parameter.
* @param {number} parameterId The parameter this class represents.
* @param {number} perRank The amount per rank this parameter gives.
* @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
* @param {boolean} isCore True if this is a core parameter, false otherwise.
*/
PanelParameter.prototype.initialize = function(parameterId, perRank, isFlat = true, isCore = false) {
	/**
	* The id of the parameter this class represents.
	* @type {number}
	*/
	this.parameterId = parameterId;
	/**
	* The amount per rank this parameter gives.
	* @type {number}
	*/
	this.perRank = perRank;
	/**
	* Whether or not the growth per rank for this parameter is flat or percent.
	* @type {boolean} True if it is flat growth, false if it is percent growth.
	*/
	this.isFlat = isFlat;
	/**
	* Whether or not this is a core parameter.
	* Core parameters are emphasized on the SDP scene.
	* @type {boolean} True if it is a core parameter, false otherwise.
	*/
	this.isCore = isCore;
};

//#endregion
//#region src/plugins/sdp/core/__models/PanelRankupReward.js
/**
* A class that represents a single reward for achieving a particular rank in a panel.
*/
function PanelRankupReward() {
	this.initialize(...arguments);
}
PanelRankupReward.prototype = {};
PanelRankupReward.prototype.constructor = PanelRankupReward;
/**
* Initializes a single rankup reward.
* @param {string} rewardName The name to display for this reward.
* @param {number} rankRequired The rank required.
* @param {string} effect The effect to execute.
*/
PanelRankupReward.prototype.initialize = function(rewardName, rankRequired, effect) {
	/**
	* The name of this reward that shows up in the SDP scene.
	* @type {string}
	*/
	this.rewardName = rewardName;
	/**
	* The rank required for this panel rankup reward to be executed.
	* @type {number}
	*/
	this.rankRequired = rankRequired;
	/**
	* The effect to be executed upon reaching the rank required.
	* The effect is captured as javascript.
	* @type {string}
	*/
	this.effect = effect;
};

//#endregion
//#region src/plugins/sdp/core/__models/StatDistributionPanelBuilder.js
/**
* A builder for creating {@link StatDistributionPanel}.
*/
var StatDistributionPanelBuilder = class {
	#name = String.empty;
	#key = String.empty;
	#iconIndex = 0;
	#rarity = 0;
	#unlockedByDefault = false;
	#description = String.empty;
	#flavorText = String.empty;
	#maxRank = 1;
	#baseCost = 0;
	#flatGrowth = 0;
	#multGrowth = 1;
	#parameters = [];
	#rewards = [];
	/**
	* Builds the configured panel.
	* @returns {StatDistributionPanel}
	*/
	build() {
		return new StatDistributionPanel(this.#name, this.#key, this.#iconIndex, this.#rarity, this.#unlockedByDefault, this.#description, this.#flavorText, this.#maxRank, this.#baseCost, this.#flatGrowth, this.#multGrowth, this.#parameters, this.#rewards);
	}
	name(name) {
		this.#name = name;
		return this;
	}
	key(key) {
		this.#key = key;
		return this;
	}
	iconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	unlockedByDefault(unlockedByDefault) {
		this.#unlockedByDefault = unlockedByDefault;
		return this;
	}
	description(description) {
		this.#description = description;
		return this;
	}
	flavorText(flavorText) {
		this.#flavorText = flavorText;
		return this;
	}
	maxRank(maxRank) {
		this.#maxRank = maxRank;
		return this;
	}
	baseCost(baseCost) {
		this.#baseCost = baseCost;
		return this;
	}
	flatGrowth(flatGrowth) {
		this.#flatGrowth = flatGrowth;
		return this;
	}
	multGrowth(multGrowth) {
		this.#multGrowth = multGrowth;
		return this;
	}
	rarity(rarity) {
		this.#rarity = PanelRarity.normalizeRarityFromJson(rarity);
		return this;
	}
	parameters(parameters) {
		this.#parameters = parameters;
		return this;
	}
	rewards(rewards) {
		this.#rewards = rewards;
		return this;
	}
};

//#endregion
//#region src/plugins/sdp/core/__models/StatDistributionPanel.js
/**
* The class that governs the details of a single SDP.
* Use the {@link StatDistributionPanelBuilder} to fluently build these.
*/
var StatDistributionPanel = class {
	constructor(name, key, iconIndex, rarity, unlockedByDefault, description, topFlavorText, maxRank, baseCost, flatGrowthCost, multGrowthCost, panelParameters, panelRewards) {
		/**
		* Gets the friendly name for this SDP.
		* @type {string}
		*/
		this.name = name;
		/**
		* Gets the unique identifier key that represents this SDP.
		* @type {string}
		*/
		this.key = key;
		/**
		* Gets the icon index for this SDP.
		* @type {number}
		*/
		this.iconIndex = iconIndex;
		/**
		* Panel rarity (**0–5**, Common..Godlike).
		* @type {number}
		*/
		this.rarity = rarity;
		/**
		* Gets whether or not this SDP is unlocked by default.
		* @type {boolean}
		*/
		this.unlockedByDefault = unlockedByDefault;
		/**
		* Gets the description for this SDP.
		* @type {string}
		*/
		this.description = description;
		/**
		* The description that shows up underneath the name in the details window.
		* @type {string}
		*/
		this.topFlavorText = topFlavorText;
		/**
		* Gets the maximum rank for this SDP.
		* @type {number}
		*/
		this.maxRank = maxRank;
		/**
		* Additive offset on top of the rarity default base SDP (see `config.sdp.json`; core curve lives in plugin params).
		* @type {number}
		*/
		this.baseCost = baseCost;
		/**
		* Additive offset on the rarity default exponential coefficient (**flat** term before `mult ** step`).
		* @type {number}
		*/
		this.flatGrowthCost = flatGrowthCost;
		/**
		* Multiplier applied to the rarity default **mult** (keep **1.0** for “use defaults only”).
		* @type {number}
		*/
		this.multGrowthCost = multGrowthCost;
		/**
		* The collection of all parameters that this panel affects when ranking it up.
		* @returns {PanelParameter[]}
		*/
		this.panelParameters = panelParameters;
		/**
		* The collection of all rewards this panel can grant by ranking it up.
		* @type {PanelRankupReward[]}
		*/
		this.panelRewards = panelRewards;
	}
	/**
	* Calculates the cost of SDP points to rank this panel up.
	*
	* Combines plugin-parameter rarity defaults with per-panel offsets from
	* **J.SDP.Metadata.resolveEffectiveRankUpCostParts** — effective cost is
	* `base + floor(flat * mult^(currentRank + 1))` with resolved **base**, **flat**, and **mult**.
	*
	* @param {number} currentRank The current ranking of this panel for a given actor.
	* @returns {number}
	*/
	rankUpCost(currentRank) {
		if (currentRank === this.maxRank) {
			return 0;
		} else {
			const rankExponent = currentRank + 1;
			const parts = J.SDP.Metadata.resolveEffectiveRankUpCostParts(this);
			const growth = Math.floor(parts.flatGrowthCost * parts.multGrowthCost ** rankExponent);
			return parts.baseCost + growth;
		}
	}
	/**
	* Retrieves all panel parameters associated with a provided `paramId`.
	* @param {number} paramId The `paramId` to find parameters for.
	* @returns {PanelParameter[]}
	*/
	getPanelParameterById(paramId) {
		const { panelParameters } = this;
		return panelParameters.filter((panelParameter) => panelParameter.parameterId === paramId);
	}
	/**
	* Gets the panel rewards attached to the provided `rank`.
	* @param {number} rank The rank to check and see if there are any rewards for.
	* @returns {PanelRankupReward[]}
	*/
	getPanelRewardsByRank(rank) {
		const { panelRewards } = this;
		return panelRewards.filter((reward) => reward.rankRequired === rank);
	}
	/**
	* Gets whether or not this SDP is unlocked.
	* @returns {boolean} True if this SDP is unlocked, false otherwise.
	*/
	isUnlocked() {
		return $gameParty.isSdpUnlocked(this.key);
	}
	/**
	* Sets this SDP to be unlocked.
	*/
	unlock() {
		$gameParty.unlockSdp(this.key);
	}
	/**
	* Sets this SDP to be locked.
	*/
	lock() {
		$gameParty.lockSdp(this.key);
	}
	calculateBonusByRank(paramId, currentRank, baseParam = 0, fractional = false) {
		const panelParameters = this.panelParameters.filter((panelParameter) => panelParameter.parameterId === paramId);
		if (!panelParameters.length) return 0;
		let val = 0;
		panelParameters.forEach((panelParameter) => {
			const { perRank, isFlat } = panelParameter;
			if (!isFlat) {
				const factor = currentRank * perRank / 100;
				val += baseParam * factor;
			} else {
				val += currentRank * perRank;
			}
		});
		if (fractional) {
			val /= 100;
		}
		return val;
	}
	/**
	* Window text color index for SDP chrome for this panel's rarity.
	*
	* @returns {number}
	*/
	getPanelRarityColorIndex() {
		return PanelRarity.rarityIndexToColorIndex(this.rarity);
	}
	/**
	* Gets the text associated with the rarity of this panel.
	*
	* @returns {string}
	*/
	getPanelRarityText() {
		switch (this.rarity) {
			case PanelRarity.RARITY_COMMON: return PanelRarity.Common;
			case PanelRarity.RARITY_MAGICAL: return PanelRarity.Magical;
			case PanelRarity.RARITY_RARE: return PanelRarity.Rare;
			case PanelRarity.RARITY_EPIC: return PanelRarity.Epic;
			case PanelRarity.RARITY_LEGENDARY: return PanelRarity.Legendary;
			case PanelRarity.RARITY_GODLIKE: return PanelRarity.Godlike;
			default: return `unknown rarity: [ ${this.rarity} ]`;
		}
	}
};
StatDistributionPanel.Builder = () => new StatDistributionPanelBuilder();

//#endregion
//#region src/plugins/sdp/core/__models/PanelRarity.js
/**
* Panel rarity indices (**0–5**) and helpers for SDP UI drawing.
*/
var PanelRarity = class PanelRarity {
	/** Common (`rarity` **0**). */
	static RARITY_COMMON = 0;
	/** Magical (`rarity` **1**). */
	static RARITY_MAGICAL = 1;
	/** Rare (`rarity` **2**). */
	static RARITY_RARE = 2;
	/** Epic (`rarity` **3**). */
	static RARITY_EPIC = 3;
	/** Legendary (`rarity` **4**). */
	static RARITY_LEGENDARY = 4;
	/** Godlike (`rarity` **5**). */
	static RARITY_GODLIKE = 5;
	/** Highest valid {@link StatDistributionPanel.rarity} value ({@link PanelRarity.RARITY_GODLIKE}). */
	static RARITY_MAX = 5;
	/**
	* Common SDPs that bring few pros and many cons.
	* @type {"Common"}
	*/
	static Common = "Common";
	/**
	* Magical SDPs that are usually fairly balanced.
	* @type {"Magical"}
	*/
	static Magical = "Magical";
	/**
	* Rare SDPs that are skewed in favor of the player granting many positives.
	* @type {"Rare"}
	*/
	static Rare = "Rare";
	/**
	* Epic SDPs that make a significant difference if the player chooses to
	* master it.
	* @type {"Epic"}
	*/
	static Epic = "Epic";
	/**
	* Legendary SDPs that can easily make-or-break the flow of battle with the
	* immense boons they bring.
	* @type {"Legendary"}
	*/
	static Legendary = "Legendary";
	/**
	* Godlike SDPs that are few and far between, because they are tremendously
	* imbalanced in favor of the player. The player would be a fool to not master
	* this as soon as possible.
	* @type {string}
	*/
	static Godlike = "Godlike";
	/** Window text color index for Magical rarity chrome. */
	static WindowColorMagical = 3;
	/** Window text color index for Rare rarity chrome. */
	static WindowColorRare = 23;
	/** Window text color index for Epic rarity chrome. */
	static WindowColorEpic = 31;
	/** Window text color index for Legendary rarity chrome. */
	static WindowColorLegendary = 20;
	/** Window text color index for Godlike rarity chrome. */
	static WindowColorGodlike = 25;
	/**
	* Converts a rarity label ("Rare", …) into the integer stored as {@link StatDistributionPanel.rarity}.
	*
	* @param {string} label The rarity word from JSON or tooling.
	* @returns {number} {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	*/
	static rarityLabelToIndex(label) {
		switch (label) {
			case PanelRarity.Common: return PanelRarity.RARITY_COMMON;
			case PanelRarity.Magical: return PanelRarity.RARITY_MAGICAL;
			case PanelRarity.Rare: return PanelRarity.RARITY_RARE;
			case PanelRarity.Epic: return PanelRarity.RARITY_EPIC;
			case PanelRarity.Legendary: return PanelRarity.RARITY_LEGENDARY;
			case PanelRarity.Godlike: return PanelRarity.RARITY_GODLIKE;
			default: return PanelRarity.RARITY_COMMON;
		}
	}
	/**
	* Window text color index for SDP chrome for this rarity.
	*
	* @param {number} rarityIndex {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	* @returns {number}
	*/
	static rarityIndexToColorIndex(rarityIndex) {
		switch (rarityIndex) {
			case PanelRarity.RARITY_COMMON: return 0;
			case PanelRarity.RARITY_MAGICAL: return PanelRarity.WindowColorMagical;
			case PanelRarity.RARITY_RARE: return PanelRarity.WindowColorRare;
			case PanelRarity.RARITY_EPIC: return PanelRarity.WindowColorEpic;
			case PanelRarity.RARITY_LEGENDARY: return PanelRarity.WindowColorLegendary;
			case PanelRarity.RARITY_GODLIKE: return PanelRarity.WindowColorGodlike;
			default:
				console.warn(`PanelRarity.rarityIndexToColorIndex: unknown rarity index [ ${rarityIndex} ].`);
				return 0;
		}
	}
	/**
	* Coerces parsed JSON into {@link PanelRarity.RARITY_COMMON} .. {@link PanelRarity.RARITY_GODLIKE}.
	*
	* @param {string|number} raw Labels, integers **0–5**, or alternate integer encodings accepted by the loader.
	* @returns {number}
	*/
	static normalizeRarityFromJson(raw) {
		if (typeof raw === "string") {
			const trimmed = raw.trim();
			if (trimmed === "") {
				return PanelRarity.RARITY_COMMON;
			}
			switch (trimmed) {
				case PanelRarity.Common: return PanelRarity.RARITY_COMMON;
				case PanelRarity.Magical: return PanelRarity.RARITY_MAGICAL;
				case PanelRarity.Rare: return PanelRarity.RARITY_RARE;
				case PanelRarity.Epic: return PanelRarity.RARITY_EPIC;
				case PanelRarity.Legendary: return PanelRarity.RARITY_LEGENDARY;
				case PanelRarity.Godlike: return PanelRarity.RARITY_GODLIKE;
				default: break;
			}
			const parsedFromString = parseInt(trimmed, 10);
			if (!Number.isNaN(parsedFromString)) {
				return PanelRarity.normalizeRarityFromJson(parsedFromString);
			}
			console.warn(`PanelRarity.normalizeRarityFromJson: unrecognized string [ ${trimmed} ].`);
			return PanelRarity.RARITY_COMMON;
		}
		const n = parseInt(raw, 10);
		if (Number.isNaN(n)) {
			return PanelRarity.RARITY_COMMON;
		}
		switch (n) {
			case PanelRarity.WindowColorRare: return PanelRarity.RARITY_RARE;
			case PanelRarity.WindowColorEpic: return PanelRarity.RARITY_EPIC;
			case PanelRarity.WindowColorLegendary: return PanelRarity.RARITY_LEGENDARY;
			case PanelRarity.WindowColorGodlike: return PanelRarity.RARITY_GODLIKE;
			default: break;
		}
		if (n >= PanelRarity.RARITY_COMMON && n <= PanelRarity.RARITY_MAX) {
			return n;
		}
		console.warn(`PanelRarity.normalizeRarityFromJson: out-of-range rarity [ ${n} ]; clamped to Common.`);
		return PanelRarity.RARITY_COMMON;
	}
	/**
	* Converts a rarity label string into a window text color index for SDP chrome.
	*
	* @param {string} rarity The rarity word.
	* @returns {number}
	*/
	static fromRarityToColor(rarity) {
		const rarityIndex = PanelRarity.rarityLabelToIndex(rarity);
		return PanelRarity.rarityIndexToColorIndex(rarityIndex);
	}
};

//#endregion
//#region src/plugins/sdp/core/__models/PanelRanking.js
/**
* A class for tracking an actor's ranking in a particular panel.
*/
function PanelRanking() {
	this.initialize(...arguments);
}
PanelRanking.prototype = {};
PanelRanking.prototype.constructor = PanelRanking;
/**
* Initializes a single panel ranking for tracking on a given actor.
* @param {string} key The unique key for the panel to be tracked.
* @param {number} actorId The id of the actor.
*/
PanelRanking.prototype.initialize = function(key, actorId) {
	/**
	* The key for this panel ranking.
	* @type {string}
	*/
	this.key = key;
	/**
	* The id of the actor that owns this ranking.
	* @type {number}
	*/
	this.actorId = actorId;
	this.initMembers();
};
/**
* Initializes all members of this class.
*/
PanelRanking.prototype.initMembers = function() {
	/**
	* The current rank for this panel ranking.
	* @type {number}
	*/
	this.currentRank = 0;
	/**
	* Whether or not this panel is maxed out.
	* @type {boolean}
	*/
	this.maxed = false;
	/**
	*
	* @type {boolean}
	*/
	this._isUnlocked = false;
};
/**
* Determines whether or not the associated panel is unlocked.
* @returns {boolean}
*/
PanelRanking.prototype.isUnlocked = function() {
	return this._isUnlocked;
};
/**
* Flags the associated panel as "unlocked".
*/
PanelRanking.prototype.unlock = function() {
	this._isUnlocked = true;
};
/**
* Flags the associated panel as "locked".
*/
PanelRanking.prototype.lock = function() {
	this._isUnlocked = false;
};
/**
* Ranks up this panel.
* If it is at max rank, then perform the max effect exactly once
* and then max the panel out.
*/
PanelRanking.prototype.rankUp = function() {
	const panel = J.SDP.Metadata.panelsMap.get(this.key);
	const { maxRank } = panel;
	if (this.currentRank < maxRank) {
		this.currentRank++;
		this.performRepeatRankupEffects();
		this.performCurrentRankupEffects();
	}
	if (this.currentRank === maxRank) {
		this.performMaxRankupEffects();
	}
};
PanelRanking.prototype.normalizeRank = function() {
	const panel = J.SDP.Metadata.panelsMap.get(this.key);
	const { maxRank } = panel;
	if (this.currentRank > maxRank) {
		this.currentRank = maxRank;
	}
};
/**
* Gets whether or not this panel is maxed out.
* @returns {boolean} True if this panel is maxed out, false otherwise.
*/
PanelRanking.prototype.isPanelMaxed = function() {
	return this.maxed;
};
/**
* Upon reaching a given rank of this panel, try to perform this `javascript` effect.
* @param {number} newRank The rank to inspect and execute effects for.
*/
PanelRanking.prototype.performRankupEffects = function(newRank) {
	const rewardEffects = J.SDP.Metadata.panelsMap.get(this.key).getPanelRewardsByRank(newRank);
	if (rewardEffects.length === 0) return;
	const a = $gameActors.actor(this.actorId);
	rewardEffects.forEach((rewardEffect) => {
		try {
			eval(rewardEffect.effect);
		} catch (err) {
			console.error(`
        An error occurred while trying to execute the rank-${this.currentRank} 
        reward for panel: ${this.key}`);
			console.error(err);
		}
	});
};
/**
* Executes any rewards associated with the current rank (used after ranking up typically).
*/
PanelRanking.prototype.performCurrentRankupEffects = function() {
	this.performRankupEffects(this.currentRank);
};
/**
* Executes any rewards that are defined as "repeat rankup effects", aka -1 rank.
*/
PanelRanking.prototype.performRepeatRankupEffects = function() {
	this.performRankupEffects(-1);
};
/**
* Executes any rewards that are defined as "max rankup effects", aka 0 rank.
*/
PanelRanking.prototype.performMaxRankupEffects = function() {
	this.maxed = true;
	SoundManager.playRecovery();
	this.performRankupEffects(0);
};

//#endregion
//#region src/plugins/sdp/core/__models/PanelTracking.js
/**
* A class that represents a single tracking of a panel being unlocked.
*/
function PanelTracking(key, unlockedByDefault) {
	this.initialize(...arguments);
}
PanelTracking.prototype = {};
PanelTracking.prototype.constructor = PanelTracking;
/**
* Initializes a single panel tracking.
* @param {string} panelKey The key of the panel tracked.
* @param {boolean} unlockedByDefault Whether or not unlocked by default.
*/
PanelTracking.prototype.initialize = function(panelKey, unlockedByDefault) {
	/**
	* The key of this panel that is being tracked.
	* @type {string}
	*/
	this.key = panelKey;
	/**
	* True if the panel associated with this key is unlocked,
	* false otherwise.
	* @type {boolean}
	*/
	this.unlocked = unlockedByDefault;
};
/**
* Checks whether or not this tracked panel has been unlocked.
* @return {boolean}
*/
PanelTracking.prototype.isUnlocked = function() {
	return this.unlocked;
};
/**
* Unlocks this panel in tracking, allowing party members to put points
* towards it and rank it up.
*/
PanelTracking.prototype.unlock = function() {
	this.unlocked = true;
};
/**
* Locks this panel in tracking, preventing party members from putting
* any additional points into it.
*/
PanelTracking.prototype.lock = function() {
	this.unlocked = false;
};

//#endregion
//#region src/plugins/sdp/core/_metadata/_pluginMetadata.js
var J_SdpPluginMetadata = class J_SdpPluginMetadata extends PluginMetadata {
	/**
	* Project-relative path to the SDP JSON configuration file.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.sdp.json";
	/**
	* Converts the JSON-parsed blob into classified {@link StatDistributionPanel}s.
	* @param {any} parsedBlob The already-parsed JSON blob.
	* @return {StatDistributionPanel[]} The blob with all data converted into proper classes.
	*/
	static classifyPanels(parsedBlob) {
		const parsedPanels = [];
		const foreacher = (parsedPanel) => {
			const panelName = parsedPanel.name;
			if (panelName.startsWith("__")) return;
			if (panelName.startsWith("==")) return;
			if (panelName.startsWith("--")) return;
			const { panelParameters, panelRewards } = parsedPanel;
			const parsedPanelParameters = [];
			panelParameters.forEach((paramBlob) => {
				const parsedParameter = paramBlob;
				const panelParameter = new PanelParameter(parseInt(parsedParameter.parameterId), parseFloat(parsedParameter.perRank), parsedParameter.isFlat, parsedParameter.isCore);
				parsedPanelParameters.push(panelParameter);
			});
			const parsedPanelRewards = [];
			if (panelRewards) {
				panelRewards.forEach((reward) => {
					const parsedReward = reward;
					const panelReward = new PanelRankupReward(parsedReward.rewardName, parseInt(parsedReward.rankRequired), parsedReward.effect);
					parsedPanelRewards.push(panelReward);
				});
			}
			const panel = StatDistributionPanel.Builder().name(parsedPanel.name).key(parsedPanel.key).iconIndex(parseInt(parsedPanel.iconIndex)).rarity(parsedPanel.rarity).unlockedByDefault(parsedPanel.unlockedByDefault).description(parsedPanel.description).flavorText(parsedPanel.topFlavorText).maxRank(parseInt(parsedPanel.maxRank)).baseCost(parseInt(parsedPanel.baseCost)).flatGrowth(parseInt(parsedPanel.flatGrowthCost)).multGrowth(parseFloat(parsedPanel.multGrowthCost)).parameters(parsedPanelParameters).rewards(parsedPanelRewards).build();
			parsedPanels.push(panel);
		};
		parsedBlob.forEach(foreacher, this);
		return parsedPanels;
	}
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
		this.initializePanelCostDefaultsByRarity();
		this.initializePanels();
		this.initializeMetadata();
	}
	/**
	* Parses plugin parameters into six rarity rows (**Common..Godlike**) used as the core rank-up cost spine.
	* Panel JSON fields layer additive / multiplicative offsets on top — see resolveEffectiveRankUpCostParts.
	*/
	initializePanelCostDefaultsByRarity() {
		const { parsedPluginParameters: p } = this;
		/**
		* One rarity tier: base SDP, exponential coefficient, and growth base (**mult**).
		* @type {{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }}
		*/
		const row = (baseKey, flatKey, multKey, fbBase, fbFlat, fbMult) => {
			return {
				baseCost: J.BASE.Helpers.parsePluginInt(p[baseKey], fbBase),
				flatGrowthCost: J.BASE.Helpers.parsePluginInt(p[flatKey], fbFlat),
				multGrowthCost: J_SdpPluginMetadata.#parsePositiveFloatOr(p[multKey], fbMult)
			};
		};
		/**
		* Indexed **0–5** matching {@link PanelRarity} Common..Godlike.
		* @type {Array<{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }>}
		*/
		this.panelCostDefaultsByRarity = [
			row("sdpDefaultCommonBase", "sdpDefaultCommonFlat", "sdpDefaultCommonMult", 0, 70, 1.06),
			row("sdpDefaultMagicalBase", "sdpDefaultMagicalFlat", "sdpDefaultMagicalMult", 0, 235, 1.06),
			row("sdpDefaultRareBase", "sdpDefaultRareFlat", "sdpDefaultRareMult", 0, 1180, 1.06),
			row("sdpDefaultEpicBase", "sdpDefaultEpicFlat", "sdpDefaultEpicMult", 0, 4320, 1.06),
			row("sdpDefaultLegendaryBase", "sdpDefaultLegendaryFlat", "sdpDefaultLegendaryMult", 0, 11900, 1.06),
			row("sdpDefaultGodlikeBase", "sdpDefaultGodlikeFlat", "sdpDefaultGodlikeMult", 0, 30500, 1.06)
		];
	}
	/**
	* @param {string|number|undefined|null} value
	* @param {number} fallback
	* @returns {number}
	*/
	static #parsePositiveFloatOr(value, fallback) {
		if (value === undefined || value === null || value === "") {
			return fallback;
		}
		const parsed = Number.parseFloat(String(value));
		if (Number.isFinite(parsed) && parsed > 0) {
			return parsed;
		}
		return fallback;
	}
	/**
	* Effective rank-up cost knobs after combining rarity defaults with per-panel overrides from `config.sdp.json`.
	*
	* @param {StatDistributionPanel} panel
	* @returns {{ baseCost: number, flatGrowthCost: number, multGrowthCost: number }}
	*/
	resolveEffectiveRankUpCostParts(panel) {
		const rarityIndex = PanelRarity.normalizeRarityFromJson(panel.rarity);
		const row = this.panelCostDefaultsByRarity[rarityIndex];
		const scale = panel.multGrowthCost;
		const safeScale = scale > 0 ? scale : 1;
		return {
			baseCost: row.baseCost + panel.baseCost,
			flatGrowthCost: row.flatGrowthCost + panel.flatGrowthCost,
			multGrowthCost: row.multGrowthCost * safeScale
		};
	}
	/**
	* Initializes the SDPs that exist in the SDP configuration.
	*/
	initializePanels() {
		const canLogLoadInfo = J_SdpPluginMetadata.#hasMinimumBaseVersion();
		const classifiedPanels = ExternalJsonConfigLoader.load(J_SdpPluginMetadata.CONFIG_PATH, ExternalJsonConfigLoaderOptions.Builder().pluginName("J-SDP").configName("sdp configuration").mapper((parsed) => J_SdpPluginMetadata.classifyPanels(parsed.sdps)).logSummary(canLogLoadInfo ? (result) => [`- ${result.length} panels`] : null).build());
		/**
		* The collection of all defined SDPs.
		* @type {StatDistributionPanel[]}
		*/
		this.panels = classifiedPanels;
		const panelMap = new Map();
		this.panels.forEach((panel) => panelMap.set(panel.key, panel));
		/**
		* A key:panel map of all defined SDPs.
		* @type {Map<string, StatDistributionPanel>}
		*/
		this.panelsMap = panelMap;
	}
	initializeMetadata() {
		/**
		* The id of a switch that represents whether or not this system is accessible
		* in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menuSwitch"], 0);
		/**
		* The icon index that represents the system itself.
		* Used as the icon for costs and currency.
		* @type {number}
		*/
		this.sdpIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["sdpIcon"], 0);
		/**
		* The text displayed upon victory during a battle-end victory scene.
		*/
		this.victoryText = this.parsedPluginParameters["victoryText"];
		/**
		* The name used for the command when visible in a menu.
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["menuCommandName"] ?? "Distribute";
		/**
		* The icon used alongside the command's name when visible in the menu.
		* @type {number}
		*/
		this.commandIconIndex = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menuCommandIcon"], 0);
		/**
		* When JABS is enabled, this menu is removed from the main menu and added instead
		* to the quick menu. If this is set to true, then access to the menu will be re-added
		* to the main menu again.<br>
		*
		* Both menus are shown/hidden by the menu switch id.
		* @type {boolean}
		*/
		this.jabsShowInBothMenus = this.parsedPluginParameters["showInBoth"] === "true";
		/**
		* Singular player-facing name for one SDP row (confirmation copy, future labels).
		* @type {string}
		*/
		this.unitSingular = this.parsedPluginParameters["sdpUnitSingular"] ?? "panel";
		/**
		* Plural player-facing name for counts such as “4 upgrades on 2 …”.
		* @type {string}
		*/
		this.unitPlural = this.parsedPluginParameters["sdpUnitPlural"] ?? "panels";
		/**
		* Short label for spendable currency (“Remaining …”, cart wallet chip, {@link TextManager#sdpPoints}).
		* @type {string}
		*/
		this.sdpPointsDisplayName = this.parsedPluginParameters["sdpPointsDisplayName"] ?? "SDP";
	}
	/**
	* Checks if the BASE plugin meets the minimum version requirement for this plugin.
	* @return {boolean}
	*/
	static #hasMinimumBaseVersion() {
		const minimumVersion = this.#minimumBaseVersion();
		const actualVersion = new PluginVersion(J.BASE.Metadata.Version);
		const meetsThreshold = actualVersion.satisfiesPluginVersion(minimumVersion);
		if (!meetsThreshold) return false;
		return true;
	}
	/**
	* Gets the current minimum version of the J-BASE system this plugin requires.
	* @returns {PluginVersion}
	*/
	static #minimumBaseVersion() {
		return PluginVersion.builder.major("2").minor("3").patch("1").build();
	}
};

//#endregion
//#region src/plugins/sdp/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.SDP = {};
/**
* The metadata associated with this plugin.
*/
J.SDP.Metadata = new J_SdpPluginMetadata("J-SDP", "3.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.SDP.Aliased = {
	BattleManager: new Map(),
	DataManager: new Map(),
	JABS_Engine: new Map(),
	TextManager: new Map(),
	IconManager: new Map(),
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Enemy: new Map(),
	Game_Party: new Map(),
	Game_Player: new Map(),
	Game_Switches: new Map(),
	Game_System: new Map(),
	Scene_Boot: new Map(),
	Scene_Map: new Map(),
	Scene_Menu: new Map(),
	Window_AbsMenu: new Map(),
	Window_MenuCommand: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.SDP.RegExp = {
	SdpPoints: /<sdpPoints: ?-?([0-9]+)>/i,
	SdpMultiplier: /<sdpMultiplier: ?([-.\d]+)>/i,
	SdpDropData: /<sdpDropData: ?(\[[-\w]+,[ ]?\d+])>/i,
	SdpUnlockKey: /<sdpUnlock: ?(.+)>/i
};

//#endregion
//#region src/plugins/sdp/core/database/RPG_DropItem.js
/**
* The SDP key of this item.
* @type {string}
*/
Object.defineProperty(RPG_DropItem.prototype, "sdpKey", { get: function() {
	return this.getSdpKey();
} });
/**
* Gets the SDP key of this item.
* @returns {string}
*/
RPG_DropItem.prototype.getSdpKey = function() {
	return this._sdpKey;
};
/**
* Gets the key of this item.
* @param {string} key The key of the SDP.
*/
RPG_DropItem.prototype.setSdpKey = function(key) {
	this._sdpKey = key;
};
/**
* Checks whether or not this drop item is a stat distribution panel drop.
* @returns {boolean} True if this is a panel drop, false otherwise.
*/
RPG_DropItem.prototype.isSdpDrop = function() {
	return !!this._sdpKey;
};

//#endregion
//#region src/plugins/sdp/core/database/RPG_Item.js
/**
* The SDP key that this item unlocks upon use.
* @type {string}
*/
Object.defineProperty(RPG_Item.prototype, "sdpKey", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.SDP.RegExp.SdpUnlockKey);
} });

//#endregion
//#region src/plugins/sdp/core/database/RPG_Enemy.js
/**
* The number of SDP points this enemy will yield upon defeat.
* @type {number|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpPoints", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.SDP.RegExp.SdpPoints);
} });
/**
* Gets the SDP drop data for this enemy.
*
* Panels that have already been dropped and collected will not
* be dropped again.
*
* The zeroth index is the string key for the panel being dropped.
* The first index is 1-100 percent chance for the panel to drop.
* The second index is the numeric id of the item associated with the panel.
* @type {[string, number, number]|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpDropData", { get: function() {
	const sdpData = RPGManager.getArrayFromNotesByRegex(this, J.SDP.RegExp.SdpDropData, true, true);
	return sdpData ?? [String.empty, 0];
} });
/**
* Gets the key of the panel being dropped.
* @type {string}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpDropKey", { get: function() {
	return this.sdpDropData[0];
} });
/**
* Gets the drop rate for this panel.
* @type {number}
*/
Object.defineProperty(RPG_Enemy.prototype, "sdpDropChance", { get: function() {
	return this.sdpDropData[1];
} });

//#endregion
//#region src/plugins/sdp/core/objects/Game_BattlerBase.js
/**
* Gets all SDP bonuses for the given crit parameter id.
* @param {number} critParamId The id of the crit parameter.
* @param {number} baseParam The base value of the crit parameter in question.
* @returns {number}
*/
Game_BattlerBase.prototype.critSdpBonuses = function(critParamId, baseParam) {
	return 0;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Battler.js
/**
* Gets the SDP points multiplier for this battler.
* @returns {number}
*/
Game_Battler.prototype.sdpMultiplier = function() {
	return 1;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br>
* Also initializes the SDP members.
*/
J.SDP.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.SDP.Aliased.Game_Actor.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the SDP system.
	*/
	this._j._sdp ||= {};
	/**
	* The accumulative total number of points this actor has ever gained.
	* @type {number}
	*/
	this._j._sdp._pointsEverGained = 0;
	/**
	* The accumulative total number of points this actor has ever spent.
	* @type {number}
	*/
	this._j._sdp._pointsSpent = 0;
	/**
	* The points that this current actor has.
	* @type {number}
	*/
	this._j._sdp._points = 0;
	/**
	* A collection of the ranks for each panel that have had points invested.
	* @type {PanelRanking[]}
	*/
	this._j._sdp._ranks = [];
};
/**
* Adds a new panel ranking for tracking the progress of a given panel.
* @param {string} key The less-friendly unique key that represents this SDP.
* @return {PanelRanking} The created panel ranking.
*/
Game_Actor.prototype.getOrCreateSdpRankByKey = function(key) {
	const rankings = this.getAllSdpRankings();
	const existingRanking = rankings.find((panelRank) => panelRank.key === key);
	if (existingRanking) {
		return existingRanking;
	}
	const newRanking = new PanelRanking(key, this.actorId());
	rankings.push(newRanking);
	return newRanking;
};
/**
* Searches for a ranking in a given panel based on key and returns it.
* @param {string} key The key of the panel we seek.
* @returns {PanelRanking} The sdp ranking.
*/
Game_Actor.prototype.getSdpByKey = function(key) {
	return this.getOrCreateSdpRankByKey(key);
};
/**
* Gets all rankings that this actor has.
* @returns {PanelRanking[]}
*/
Game_Actor.prototype.getAllSdpRankings = function() {
	return this._j._sdp._ranks;
};
/**
* Sum of all panel current ranks for this actor (convenience for menus / reporting).
* @returns {number}
*/
Game_Actor.prototype.getTotalSdpRanks = function() {
	return this.getAllSdpRankings().reduce((total, panelRanking) => total + panelRanking.currentRank, 0);
};
/**
* Gets all unlocked panels for this actor.
* @returns {PanelRanking[]}
*/
Game_Actor.prototype.getAllUnlockedSdps = function() {
	return this.getAllSdpRankings().filter((panelRanking) => panelRanking.isUnlocked());
};
/**
* Unlocks a panel by its key.
* @param {string} key The key of the panel to unlock.
*/
Game_Actor.prototype.unlockSdpByKey = function(key) {
	const panelRanking = this.getSdpByKey(key);
	panelRanking.unlock();
};
/**
* Checks if a particular panel is unlocked.
* @param {string} key The key of the panel to check.
* @returns {boolean}
*/
Game_Actor.prototype.isSdpUnlocked = function(key) {
	return this.getSdpByKey(key).isUnlocked();
};
/**
* Check if this actor has any unlocked panels.
* @returns {boolean}
*/
Game_Actor.prototype.hasAnyUnlockedSdps = function() {
	return this.getAllUnlockedSdps().length > 0;
};
/**
* Locks a panel by its key.
* @param {string} key The key of the panel to lock.
*/
Game_Actor.prototype.lockSdpByKey = function(key) {
	const panelRanking = this.getSdpByKey(key);
	panelRanking.lock();
};
/**
* Gets the accumulative total of points this actor has ever gained.
* @returns {number}
*/
Game_Actor.prototype.getAccumulatedTotalSdpPoints = function() {
	return this._j._sdp._pointsEverGained;
};
/**
* Increase the amount of accumulated total points for this actor by a given amount.
* This amount should never be reduced.
* @param {number} points The number of points to increase the total by.
*/
Game_Actor.prototype.modAccumulatedTotalSdpPoints = function(points) {
	if (points > 0) {
		this._j._sdp._pointsEverGained += points;
	}
};
/**
* Gets the accumulative total of points this actor has ever spent.
* @returns {number}
*/
Game_Actor.prototype.getAccumulatedSpentSdpPoints = function() {
	return this._j._sdp._pointsSpent;
};
/**
* Increase the amount of accumulated spent points for this actor by a given amount.
* This number is designed to not be reduced except when refunding.
* @param {number} points The number of points to increase the spent by.
*/
Game_Actor.prototype.modAccumulatedSpentSdpPoints = function(points) {
	this._j._sdp._pointsSpent += points;
};
/**
* Gets the amount of SDP points this actor has.
*/
Game_Actor.prototype.getSdpPoints = function() {
	return this._j._sdp._points;
};
/**
* Increase the amount of SDP points the actor has by a given amount.
* If the parameter provided is negative, it will reduce the actor's points instead.
*
* NOTE: An actor's SDP points cannot be less than 0.
* @param {number} points The number of points we are adding/removing from this actor.
*/
Game_Actor.prototype.modSdpPoints = function(points) {
	let gainedSdpPoints = points;
	if (gainedSdpPoints > 0) {
		gainedSdpPoints = Math.round(gainedSdpPoints * this.sdpMultiplier());
		this.modAccumulatedTotalSdpPoints(gainedSdpPoints);
	}
	this._j._sdp._points += gainedSdpPoints;
	if (this._j._sdp._points < 0) {
		this._j._sdp._points = 0;
	}
};
/**
* OVERWRITE Gets the SDP points multiplier for this actor.
* @returns {number}
*/
Game_Actor.prototype.sdpMultiplier = function() {
	const multiplier = 100;
	const objectsToCheck = this.getAllNotes();
	const sdpMultiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.SDP.RegExp.SdpMultiplier);
	const sdpMultiplier = multiplier + sdpMultiplierBonus;
	return sdpMultiplier / 100;
};
/**
* Ranks up this actor's panel by key.
* @param {string} panelKey The key of the panel to rank up.
*/
Game_Actor.prototype.rankUpPanel = function(panelKey) {
	this.getSdpByKey(panelKey).rankUp();
};
/**
* Calculates the value of the bonus stats for a designated core parameter.
* @param {number} paramId The id of the parameter to get the bonus for.
* @param {number} baseParam The base value of the designated parameter.
* @returns {number}
*/
Game_Actor.prototype.getSdpBonusForCoreParam = function(paramId, baseParam) {
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterById(paramId);
		if (!panelParameters.length) return;
		panelParameters.forEach((panelParameter) => {
			const { perRank } = panelParameter;
			const curRank = panelRanking.currentRank;
			if (!panelParameter.isFlat) {
				panelModifications += Math.floor(baseParam * (curRank * perRank) / 100);
			} else {
				panelModifications += curRank * perRank;
			}
		});
	});
	return panelModifications;
};
/**
* Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
* @param {number} sparamId The id of the parameter to get the bonus for.
* @param {number} baseParam The base value of the designated parameter.
* @param {number} idExtra The id modifier for s/x params.
* @returns {number}
*/
Game_Actor.prototype.getSdpBonusForNonCoreParam = function(sparamId, baseParam, idExtra) {
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterById(sparamId + idExtra);
		if (!panelParameters.length) return;
		panelParameters.forEach((panelParameter) => {
			const { perRank } = panelParameter;
			const curRank = panelRanking.currentRank;
			if (!panelParameter.isFlat) {
				panelModifications += baseParam * (curRank * perRank) / 100;
			} else {
				panelModifications += curRank * perRank / 100;
			}
		});
	});
	return panelModifications;
};
/**
* Extends the base parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("param").call(this, paramId);
	const panelModifications = this.getSdpBonusForCoreParam(paramId, baseParam);
	const result = baseParam + panelModifications;
	return result;
};
/**
* Extends the ex-parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("xparam").call(this, xparamId);
	const panelModifications = this.getSdpBonusForNonCoreParam(xparamId, baseParam, 8);
	const result = baseParam + panelModifications;
	return result;
};
/**
* Extends the sp-parameters with the SDP bonuses.
*/
J.SDP.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId) {
	const baseParam = J.SDP.Aliased.Game_Actor.get("sparam").call(this, sparamId);
	const panelModifications = this.getSdpBonusForNonCoreParam(sparamId, baseParam, 18);
	const result = baseParam + panelModifications;
	return result;
};
/**
* Extends {@link #maxTp}.<br>
* Includes bonuses from panels as well.
* @returns {number}
*/
J.SDP.Aliased.Game_Actor.set("maxTp", Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function() {
	const baseMaxTp = J.SDP.Aliased.Game_Actor.get("maxTp").call(this);
	const bonusMaxTpFromSdp = this.maxTpSdpBonuses(baseMaxTp);
	const result = bonusMaxTpFromSdp + baseMaxTp;
	return result;
};
/**
* Calculates the bonuses for Max TP from the actor's currently ranked SDPs.
* @param {number} baseMaxTp The base max TP for this actor.
* @returns {number}
*/
Game_Actor.prototype.maxTpSdpBonuses = function(baseMaxTp) {
	const panelRankings = this.getAllSdpRankings();
	if (!panelRankings.length) return 0;
	let panelModifications = 0;
	panelRankings.forEach((panelRanking) => {
		const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
		if (!panel) {
			return;
		}
		const panelParameters = panel.getPanelParameterById(30);
		if (panelParameters.length) {
			panelParameters.forEach((panelParameter) => {
				const { perRank, isFlat } = panelParameter;
				const { currentRank } = panelRanking;
				if (isFlat) {
					panelModifications += currentRank * perRank;
				} else {
					panelModifications += Math.floor(baseMaxTp * (currentRank * perRank) / 100);
				}
			});
		}
	});
	return panelModifications;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Enemy.js
/**
* Gets any additional drops from the notes of this particular enemy.
* This allows for only gaining an SDP from enemies once.
* @returns {RPG_DropItem[]}
*/
J.SDP.Aliased.Game_Enemy.set("extraDrops", Game_Enemy.prototype.extraDrops);
Game_Enemy.prototype.extraDrops = function() {
	const dropList = J.SDP.Aliased.Game_Enemy.get("extraDrops").call(this);
	if (!this.canDropSdp()) return dropList;
	const sdpDrop = this.makeSdpDrop();
	dropList.push(sdpDrop);
	return dropList;
};
/**
* Determines if there is an SDP to drop, and whether or not to drop it.
* @returns {RPG_DropItem}
*/
Game_Enemy.prototype.canDropSdp = function() {
	if (!this.hasSdpDropData()) return false;
	const panel = J.SDP.Metadata.panelsMap.get(this.enemy().sdpDropKey);
	if (!panel) {
		console.warn(`Panel of key ${this.enemy().sdpDropKey} is not defined, but was trying to be dropped.`);
		console.warn(`Consider defining a panel with the key of ${this.enemy().sdpDropKey}.<br>`);
		return false;
	}
	if ($gameParty.isSdpUnlocked(panel.key)) return false;
	return true;
};
/**
* Makes the new drop item for the SDP based on the data from this enemy.
* @returns {RPG_Item}
*/
Game_Enemy.prototype.makeSdpDrop = function() {
	const [key, chance, itemId] = this.getSdpDropData();
	const debugChance = $gameSystem.shouldForceDropSdp() ? 1e7 : chance;
	const sdpDrop = new RPG_DropItemBuilder().itemLoot(itemId, debugChance);
	sdpDrop.setSdpKey(key);
	return sdpDrop;
};
/**
* Gets the SDP drop data from this enemy.
* @returns {[string,number,number]}
*/
Game_Enemy.prototype.getSdpDropData = function() {
	return this.enemy().sdpDropData;
};
/**
* Gets whether or not this enemy has an SDP to drop.
* @returns {boolean}
*/
Game_Enemy.prototype.hasSdpDropData = function() {
	return this.enemy().sdpDropData[0] !== String.empty;
};
/**
* Extends {@link #findLoot}.<br/>
* Custom handles SDP drops to enable potentially item-less SDP relations.
* @param {RPG_DropItem} drop The drop being found.
* @param {RPG_BaseItem} itemsFound The running list of items that have been found.
*/
J.SDP.Aliased.Game_Enemy.set("findLoot", Game_Enemy.prototype.findLoot);
Game_Enemy.prototype.findLoot = function(drop, itemsFound) {
	if (drop.isSdpDrop()) {
		const sdpLoot = this.buildSdpLoot(drop);
		itemsFound.push(sdpLoot);
		return;
	}
	J.SDP.Aliased.Game_Enemy.get("findLoot").call(this, drop, itemsFound);
};
/**
* Dynamically generates a custom drop exclusive for picking up and unlocking an SDP without a backing item.
* @param {RPG_DropItem} drop The SDP loot to build.
* @returns {{
*   name: string,
*   iconIndex: number,
*   description: string,
*   itypeId: number,
*   sdpKey: string,
*   jabsUseOnPickup: boolean,
* }}
*/
Game_Enemy.prototype.buildSdpLoot = function(drop) {
	const panel = J.SDP.Metadata.panelsMap.get(drop.sdpKey);
	const dynamicLoot = {
		id: 0,
		meta: {},
		note: String.empty,
		name: panel.name,
		iconIndex: panel.iconIndex ?? J.SDP.Metadata.sdpIconIndex,
		description: panel.description ?? "",
		itypeId: 1,
		animationId: 119,
		sdpKey: panel.key,
		jabsUseOnPickup: true
	};
	return dynamicLoot;
};
/**
* Gets the base amount of SDP points this enemy grants.
* @returns {number}
*/
Game_Enemy.prototype.sdpPoints = function() {
	return this.enemy().sdpPoints;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Party.js
/**
* Extends {@link #initialize}.<br>
* Also initializes our SDP members.
*/
J.SDP.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.SDP.Aliased.Game_Party.get("initialize").call(this);
	this.initSdpMembers();
};
/**
* Initializes all members of the sdp system.
*/
Game_Party.prototype.initSdpMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the sdp system.
	*/
	this._j._sdp ||= {};
};
/**
* Checks if any member of the party has any unlocked panels.
* @returns {boolean} True if at least one member has at least one panel unlocked, false otherwise.
*/
Game_Party.prototype.hasAnyUnlockedSdps = function() {
	return $gameActors.actors().some((actor) => actor.hasAnyUnlockedSdps());
};
/**
* Unlocks an SDP being tracked by its key.
* @param {string} key The key of the SDP to unlock.
*/
Game_Party.prototype.unlockSdp = function(key) {
	if (J.SDP.Metadata.panelsMap.has(key) === false) {
		console.error(`The SDP key of ${key} was not found in the list of panels to unlock.`);
		return;
	}
	$gameActors.actors().forEach((member) => member.unlockSdpByKey(key));
};
/**
* Unlocks every defined SDP panel for all actors returned by {@link Game_Actors#actors}
* (database actors with valid names). Intended for dev / testing.
*/
Game_Party.prototype.unlockAllSdpsForEveryone = function() {
	J.SDP.Metadata.panelsMap.forEach((panel, key) => {
		this.unlockSdp(key);
	});
};
/**
* Checks if a particular panel is unlocked for the whole party.
* @param {string} key The key of the panel to check.
* @returns {boolean} True if every actor has it unlocked, false otherwise.
*/
Game_Party.prototype.isSdpUnlocked = function(key) {
	return $gameActors.actors().every((actor) => actor.isSdpUnlocked(key));
};
/**
* Locks a panel for all party members.
* @param {string} key The key of the panel unlock.
*/
Game_Party.prototype.lockSdp = function(key) {
	if (J.SDP.Metadata.panelsMap.has(key) === false) {
		console.error(`The SDP key of ${key} was not found in the list of panels to lock.`);
		return;
	}
	$gameActors.actors().forEach((member) => member.lockSdpByKey(key));
};
/**
* Gets the rank of a given SDP for an actor by its key.
* @param {number} actorId The id of the actor to get the rank from.
* @param {string} key The key of the SDP to get the rank for.
* @return {number} The rank of the SDP for the given actor.
*/
Game_Party.prototype.getSdpRankByActorAndKey = function(actorId, key) {
	const actor = $gameActors.actor(actorId);
	if (!actor) {
		console.error(`The actor id of ${actorId} was invalid.`);
		return 0;
	}
	const panelRanking = actor.getSdpByKey(key);
	if (panelRanking) {
		return panelRanking.currentRank;
	} else {
		return 0;
	}
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Player.js
/**
* Extends {@link #useOnPickup}.<br/>
* If the loot being picked up is actually an SDP, then support the possibility of there not being a backing item from
* the database to execute effects on.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} lootData An object representing the loot.
*/
J.SDP.Aliased.Game_Player.set("useOnPickup", Game_Player.prototype.useOnPickup);
Game_Player.prototype.useOnPickup = function(lootData) {
	if (lootData.sdpKey) {
		$gameParty.unlockSdp(lootData.sdpKey);
		$jabsEngine.onSdpPanelUnlocked(lootData.sdpKey, this);
		$jabsEngine.createSdpUnlockLog(lootData.sdpKey);
		this.requestAnimation(lootData.animationId ?? 119);
		return;
	}
	J.SDP.Aliased.Game_Player.get("useOnPickup").call(this, lootData);
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Troop.js
/**
* Gets the amount of SDP points earned from all defeated enemies.
* @returns {number}
*/
Game_Troop.prototype.sdpTotal = function() {
	let sdpPoints = 0;
	this.deadMembers().forEach((enemy) => sdpPoints += enemy.sdpPoints());
	return sdpPoints;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_System.js
/**
* Extends {@link #initialize}.<br>
* Also initializes the debug features for the SDP system.
*/
J.SDP.Aliased.Game_System.set("initialize", Game_System.prototype.initialize);
Game_System.prototype.initialize = function() {
	J.SDP.Aliased.Game_System.get("initialize").call(this);
	this.initSdpMembers();
};
/**
* Initializes the SDP system and binds earned panels to the `$gameSystem` object.
*/
Game_System.prototype.initSdpMembers = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the SDP system.
	*/
	this._j._sdp ||= {};
	/**
	* Whether or not to force any enemy that can drop a panel to drop a panel.
	* @type {boolean}
	*/
	this._j._sdp._forceDropPanels = false;
};
/**
* Enables a DEBUG functionality for forcing the drop of panels where applicable.
*/
Game_System.prototype.enableForcedSdpDrops = function() {
	this._j._sdp._forceDropPanels = true;
};
/**
* Disables a DEBUG functionality for forcing the drop of panels where applicable.
*/
Game_System.prototype.disableForcedSdpDrops = function() {
	this._j._sdp._forceDropPanels = false;
};
/**
* Determines whether or not the DEBUG functionality of forced-panel-dropping is active.
* @returns {boolean|*|boolean}
*/
Game_System.prototype.shouldForceDropSdp = function() {
	return this._j._sdp._forceDropPanels ?? false;
};

//#endregion
//#region src/plugins/sdp/core/objects/Game_Action.js
/**
* Extends {@link #applyGlobal}.<br>
* Also handles any SDP effects such as unlocking.
*/
J.SDP.Aliased.Game_Action.set("applyGlobal", Game_Action.prototype.applyGlobal);
Game_Action.prototype.applyGlobal = function() {
	J.SDP.Aliased.Game_Action.get("applyGlobal").call(this);
	this.applySdpUnlock();
};
/**
* Handles any SDP-related effects for this action.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP-related effect to.
*/
Game_Action.prototype.applySdpUnlock = function(target) {
	if (this.canUnlockSdp()) {
		this.applySdpUnlockEffect();
	}
};
/**
* Determines whether or not the SDP on this action can be unlocked.
* @returns {boolean} True if the SDP can be unlocked, false otherwise.
*/
Game_Action.prototype.canUnlockSdp = function() {
	const item = this.item();
	if (!item) return false;
	if (item instanceof RPG_Skill) return false;
	if (!item.sdpKey) return false;
	return true;
};
/**
* Performs any unlock effects associated with the attached item's SDP tag.
*/
Game_Action.prototype.applySdpUnlockEffect = function() {
	const item = this.item();
	$gameParty.unlockSdp(item.sdpKey);
};
/**
* Extends {@link #apply}.<br/>
* Also applies SDP point modifications as a result of the action execution.
*/
J.SDP.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.SDP.Aliased.Game_Action.get("apply").call(this, target);
	this.applySdpPointMod(target);
};
/**
* Handles SDP point modification from action execution.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
*/
Game_Action.prototype.applySdpPointMod = function(target) {
	if (this.isSdpPointMod(target)) {
		this.modSdpPointsOnApply(target);
	}
};
/**
* Determines whether or not this action grants SDP points.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
* @returns {boolean}
*/
Game_Action.prototype.isSdpPointMod = function(target) {
	const item = this.item();
	if (!item) return false;
	if (item instanceof RPG_Skill) return false;
	if (target.isEnemy()) return false;
	if (RPGManager.getNumberFromNoteByRegex(item, J.SDP.RegExp.SdpPoints) === 0) return false;
	return true;
};
/**
* Gains (or loses) the points from the pickup against the target actor.
* @param {Game_Actor|Game_Enemy} target The target to apply the SDP point modification to.
*/
Game_Action.prototype.modSdpPointsOnApply = function(target) {
	const item = this.item();
	const points = RPGManager.getNumberFromNoteByRegex(item, J.SDP.RegExp.SdpPoints);
	target.modSdpPoints(points);
};

//#endregion
//#region src/plugins/sdp/core/managers/BattleManager.js
/**
* Extends {@link #makeRewards}.<br>
* Also includes the SDP points earned.
*/
J.SDP.Aliased.BattleManager.set("makeRewards", BattleManager.makeRewards);
BattleManager.makeRewards = function() {
	J.SDP.Aliased.BattleManager.get("makeRewards").call(this);
	this._rewards = {
		...this._rewards,
		sdp: $gameTroop.sdpTotal()
	};
};
/**
* Extends {@link #gainRewards}.<br>
* Also gain the SDP points earned.
*/
J.SDP.Aliased.BattleManager.set("gainRewards", BattleManager.gainRewards);
BattleManager.gainRewards = function() {
	J.SDP.Aliased.BattleManager.get("gainRewards").call(this);
	this.gainSdpPoints();
};
/**
* Performs a gain of the SDP points for all members of the party after battle.
*/
BattleManager.gainSdpPoints = function() {
	const { sdp } = this._rewards;
	$gameParty.members().forEach((member) => member.modSdpPoints(sdp));
};
/**
* Extends {@link #displayRewards}.<br>
* Also displays the SDP victory text.
*/
J.SDP.Aliased.BattleManager.set("displayRewards", BattleManager.displayRewards);
BattleManager.displayRewards = function() {
	this.displaySdp();
	J.SDP.Aliased.BattleManager.get("displayRewards").call(this);
};
/**
* Displays the SDP victory text in the victory log.
*/
BattleManager.displaySdp = function() {
	const { sdp } = this._rewards;
	if (sdp <= 0) return;
	const text = `\\. ${sdp} ${J.SDP.Metadata.victoryText}`;
	$gameMessage.add(text);
};

//#endregion
//#region src/plugins/sdp/core/managers/JABS_Engine.js
if (J.ABS) {
	/**
	* Extends the basic rewards from defeating an enemy to also include SDP points.
	* @param {Game_Battler} enemy The target battler that was defeated.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	*/
	J.SDP.Aliased.JABS_Engine.set("gainBasicRewards", JABS_Engine.prototype.gainBasicRewards);
	JABS_Engine.prototype.gainBasicRewards = function(enemy, actor) {
		J.SDP.Aliased.JABS_Engine.get("gainBasicRewards").call(this, enemy, actor);
		let sdpPoints = enemy.sdpPoints();
		if (!sdpPoints) return;
		const levelMultiplier = this.getRewardScalingMultiplier(enemy, actor);
		sdpPoints = Math.ceil(sdpPoints * levelMultiplier);
		this.gainSdpReward(sdpPoints, actor);
		this.createSdpLog(sdpPoints, actor);
	};
	/**
	* Gains SDP points from battle rewards.
	* @param {number} sdpPoints The SDP points to gain.
	* @param {JABS_Battler} actor The map battler that defeated the target.
	*/
	JABS_Engine.prototype.gainSdpReward = function(sdpPoints, actor) {
		if (!sdpPoints) return;
		$gameParty.members().forEach((member) => member.modSdpPoints(sdpPoints));
		const sdpMultiplier = actor.getBattler().sdpMultiplier();
		const multipliedSdpPoints = Math.round(sdpMultiplier * sdpPoints);
		this.onSdpRewardGranted(multipliedSdpPoints, actor.getCharacter());
	};
	/**
	* Lifecycle event: SDP points were awarded to the party leader's character.
	* Extended by optional plugins (e.g. J-Popups-SDP) to surface map feedback.
	* @param {number} sdpPoints The scaled SDP points granted.
	* @param {Game_Character} character The character who received the reward.
	*/
	JABS_Engine.prototype.onSdpRewardGranted = function(sdpPoints, character) {};
	/**
	* Lifecycle event: an SDP panel was unlocked for a character on the map.
	* Extended by optional plugins (e.g. J-Popups-SDP) to surface map feedback.
	* @param {string} sdpKey The key of the SDP panel that was unlocked.
	* @param {Game_Character} character The character who unlocked the panel.
	*/
	JABS_Engine.prototype.onSdpPanelUnlocked = function(sdpKey, character) {};
	/**
	* Creates the log entry if using the J-LOG.
	* @param {number} sdpPoints The SDP ponts gained.
	* @param {JABS_Battler} battler The battler gaining the SDP points.
	*/
	JABS_Engine.prototype.createSdpLog = function(sdpPoints, battler) {
		if (!J.LOG) return;
		const sdpLog = new ActionLogBuilder().setupSdpAcquired(battler.battlerName(), sdpPoints).build();
		$actionLogManager.addLog(sdpLog);
	};
	/**
	* Creates the log entry if using the J-LOG.
	* @param {string} sdpKey The SDP panel key that was unlocked.
	*/
	JABS_Engine.prototype.createSdpUnlockLog = function(sdpKey) {
		if (!J.LOG) return;
		const sdpLog = new ActionLogBuilder().setupSdpUnlocked(sdpKey).build();
		$actionLogManager.addLog(sdpLog);
	};
}

//#endregion
//#region src/plugins/sdp/core/managers/IconManager.js
/**
* Extend {@link #longParam}.<br>
* First checks if the paramId was the SDP multiplier before checking others.
*/
J.SDP.Aliased.IconManager.set("longParam", IconManager.longParam);
IconManager.longParam = function(paramId) {
	switch (paramId) {
		case 33: return this.sdpMultiplier();
		default: return J.SDP.Aliased.IconManager.get("longParam").call(this, paramId);
	}
};
/**
* Gets the icon index for the SDP multiplier.
* @return {number}
*/
IconManager.sdpMultiplier = function() {
	return 2229;
};

//#endregion
//#region src/plugins/sdp/core/managers/TextManager.js
/**
* Gets the proper name for the points used by the SDP system.
* @returns {string}
*/
TextManager.sdpPoints = function() {
	return J.SDP.Metadata.sdpPointsDisplayName;
};
/**
* Extends {@link #longParam}.<br>
* First checks if it is the SDP multiplier paramId before searching for others.
* @returns {string}
*/
J.SDP.Aliased.TextManager.set("longParam", TextManager.longParam);
TextManager.longParam = function(paramId) {
	switch (paramId) {
		case 33: return this.sdpMultiplier();
		default: return J.SDP.Aliased.TextManager.get("longParam").call(this, paramId);
	}
};
/**
* Gets the proper name of "SDP Multiplier".
* @returns {string}
*/
TextManager.sdpMultiplier = function() {
	return "SDP Multiplier";
};
/**
* Extends {@link #longParamDescription}.<br>
* First checks if it is the SDP multiplier paramId before searching for others.
* @returns {string[]}
*/
J.SDP.Aliased.TextManager.set("longParamDescription", TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId) {
	switch (paramId) {
		case 33: return this.sdpMultiplierDescription();
		default: return J.SDP.Aliased.TextManager.get("longParamDescription").call(this, paramId);
	}
};
/**
* Gets the description text for the SDP multiplier.
* @returns {string[]}
*/
TextManager.sdpMultiplierDescription = function() {
	return ["The percentage bonuses being applied against SDP point gain.", "Higher amounts of this yields greater SDP point generation."];
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_MenuCommand.js
/**
* Extends the make command list for the main menu to include SDP, if it meets the conditions.
*/
J.SDP.Aliased.Window_MenuCommand.set("makeCommandList", Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function() {
	J.SDP.Aliased.Window_MenuCommand.get("makeCommandList").call(this);
	if (!this.canAddSdpCommand()) return;
	const command = new WindowCommandBuilder(J.SDP.Metadata.commandName).setSymbol("sdp-menu").setEnabled($gameParty.hasAnyUnlockedSdps()).setIconIndex(J.SDP.Metadata.commandIconIndex).setColorIndex(1).build();
	const lastCommand = this._list.at(-1);
	if (lastCommand.symbol === "gameEnd") {
		this._list.splice(this._list.length - 2, 0, command);
	} else {
		this.addBuiltCommand(command);
	}
};
/**
* Determines whether or not the sdp command can be added to the JABS menu.
* @returns {boolean} True if the command should be added, false otherwise.
*/
Window_MenuCommand.prototype.canAddSdpCommand = function() {
	if (!$gameSwitches.value(J.SDP.Metadata.menuSwitchId)) return false;
	if (J.ABS && !J.SDP.Metadata.jabsShowInBothMenus) return false;
	return true;
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_AbsMenu.js
if (J.ABS) {
	/**
	* Extends {@link #buildCommands}.<br>
	* Adds the sdp command at the end of the list.
	* @returns {BuiltWindowCommand[]}
	*/
	J.SDP.Aliased.Window_AbsMenu.set("buildCommands", Window_AbsMenu.prototype.buildCommands);
	Window_AbsMenu.prototype.buildCommands = function() {
		const originalCommands = J.SDP.Aliased.Window_AbsMenu.get("buildCommands").call(this);
		if (!this.canAddSdpCommand()) return originalCommands;
		const command = new WindowCommandBuilder(J.SDP.Metadata.commandName).setSymbol("sdp-menu").setEnabled($gameParty.hasAnyUnlockedSdps()).setIconIndex(J.SDP.Metadata.commandIconIndex).setColorIndex(1).setHelpText(this.sdpHelpText()).build();
		originalCommands.push(command);
		return originalCommands;
	};
	/**
	* Determines whether or not the sdp command can be added to the JABS menu.
	* @returns {boolean} True if the command should be added, false otherwise.
	*/
	Window_AbsMenu.prototype.canAddSdpCommand = function() {
		if (!$gameSwitches.value(J.SDP.Metadata.menuSwitchId)) return false;
		return true;
	};
	/**
	* The help text for the JABS sdp menu.
	* @returns {string}
	*/
	Window_AbsMenu.prototype.sdpHelpText = function() {
		const description = ["The ever-growing list of stat distribution panels, aka your junction system.", "Junction points can be spent here to modify your stats- permanently."];
		return description.join("\n");
	};
}

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpList.js
/**
* The SDP window containing the list of all unlocked panels.
*/
var Window_SdpList = class extends Window_Command {
	/**
	* The currently selected actor for listing unlocked panels and drawing ranks/costs.
	* @type {Game_Actor}
	*/
	currentActor = null;
	filterNoMaxedPanels = false;
	/**
	* The queued cart levels by panel key.
	* @type {Map<string, number>}
	*/
	cart = new Map();
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Sets the actor for this window to the provided actor. Implicit refresh.
	* @param {Game_Actor} actor The actor to assign to this window.
	*/
	setActor(actor) {
		this.currentActor = actor;
		this.refresh();
	}
	/**
	* Sets the cart map to show queued levels in the list.
	* @param {Map<string, number>} cart The cart mapping.
	*/
	setCart(cart) {
		this.cart = cart;
		this.refresh();
	}
	/**
	* Gets whether or not the no-max-panels filter is enabled.
	* @returns {boolean}
	*/
	usingNoMaxPanelsFilter() {
		return this.filterNoMaxedPanels;
	}
	/**
	* Toggles the "hide max panels" filter for this window.
	*/
	toggleNoMaxPanelsFilter() {
		this.filterNoMaxedPanels = !this.filterNoMaxedPanels;
	}
	/**
	* OVERWRITE Sets the alignment for this command window to be left-aligned.
	*/
	itemTextAlign() {
		return "left";
	}
	/**
	* OVERWRITE Creates the command list for this window.
	*/
	makeCommandList() {
		const actor = this.currentActor;
		if (!actor) return;
		const panelRankings = actor.getAllUnlockedSdps();
		if (panelRankings.length === 0) return;
		const commands = panelRankings.map((panelRanking) => {
			const panel = J.SDP.Metadata.panelsMap.get(panelRanking.key);
			const command = this.makeCommand(panel);
			if (!command) return null;
			return command;
		}, this).filter((command) => command !== null);
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds a single command for the SDP list based on a given panel.
	* @param {StatDistributionPanel} panel The panel to build a command for.
	* @returns {BuiltWindowCommand}
	*/
	makeCommand(panel) {
		const actor = this.currentActor;
		const { name, key, iconIndex, maxRank } = panel;
		const colorIndex = panel.getPanelRarityColorIndex();
		const panelRanking = actor.getSdpByKey(key);
		const { currentRank } = panelRanking;
		const isMaxRank = maxRank <= currentRank;
		if (isMaxRank && this.usingNoMaxPanelsFilter()) {
			return null;
		}
		const enabled = !isMaxRank;
		const command = new WindowCommandBuilder(name).setSymbol(key).setEnabled(enabled).setExtensionData(panel).setIconIndex(iconIndex).setColorIndex(colorIndex).build();
		return command;
	}
	/**
	* OVERWRITE Renders SDP list rows with styled padded ranks.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		this.drawRankDetails(index, rectX, rectY, rectWidth);
	}
	/**
	* Draws the rank block flush right (`CC / MM`). With cart, the left number becomes a preview
	* (`min(max, current + queued)`) in palette **24** (power-up) — no extra ` +NN` column.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawRankDetails(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const panel = command ? command.ext : null;
		if (!panel) {
			return;
		}
		const actor = this.currentActor;
		const { key, maxRank } = panel;
		const { currentRank } = actor.getSdpByKey(key);
		const isMaxRank = maxRank <= currentRank;
		const cartLevels = this.cart.get(key) ?? 0;
		const pad = 12;
		const rightEdge = x + width - pad;
		if (isMaxRank) {
			const done = "DONE";
			const doneW = this.textWidth(done);
			this.drawText(done, rightEdge - doneW, y, doneW, Window_Base.TextAlignments.Left);
			return;
		}
		const rankW = this.textWidth("00");
		const slashText = " / ";
		const slashW = this.textWidth(slashText);
		const maxX = rightEdge - rankW;
		const slashX = maxX - slashW;
		const curX = slashX - rankW;
		const hasCart = cartLevels > 0;
		const previewCurrent = Math.min(maxRank, currentRank + cartLevels);
		const currentColor = hasCart ? 24 : 0;
		this.drawStyledZeroPaddedNumber(curX, y, hasCart ? previewCurrent : currentRank, rankW, 2, 8, currentColor);
		this.drawText(slashText, slashX, y, slashW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(maxX, y, maxRank, rankW, 2, 8, 0);
	}
	/**
	* OVERWRITE Enables tab-switching via left input (controller-first).
	*/
	cursorLeft(wrap) {
		if (this.isHandled("cart-dec")) {
			this.callHandler("cart-dec");
			return;
		}
		Window_Selectable.prototype.cursorLeft.call(this, wrap);
	}
	/**
	* OVERWRITE Enables tab-switching via right input (controller-first).
	*/
	cursorRight(wrap) {
		if (this.isHandled("cart-inc")) {
			this.callHandler("cart-inc");
			return;
		}
		Window_Selectable.prototype.cursorRight.call(this, wrap);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpHeader.js
/**
* A single-line, help-like header that summarizes the hovered panel.
* Name + rarity + flavor in one readable sentence, controller-first.
*/
var Window_SdpHeader = class extends Window_Base {
	/**
	* @type {StatDistributionPanel|null}
	*/
	#panel = null;
	/**
	* Binds the hovered panel to this header.
	* @param {StatDistributionPanel|null} panel The hovered panel.
	*/
	setPanel(panel) {
		this.#panel = panel;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br>
	* Renders the single-line summary for the hovered panel.
	*/
	drawContent() {
		const panel = this.#panel;
		if (!panel) {
			return;
		}
		const { name } = panel;
		const { topFlavorText: flavor } = panel;
		this.resetFontSettings();
		const rarityCx = panel.getPanelRarityColorIndex();
		const boldName = `\\*${name}\\*`;
		const tintedName = this.colorizeText(rarityCx, boldName);
		const sizedName = this.modFontSizeForText(2, tintedName);
		this.drawTextEx(sizedName, 0, 0, this.innerWidth);
		this.resetFontSettings();
		this.resetFontSettings();
		const sizedFlavor = this.modFontSizeForText(-1, flavor);
		this.drawTextEx(sizedFlavor, 0, this.lineHeight(), this.innerWidth);
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpParameterList.js
var Window_SdpParameterList = class extends Window_Command {
	/**
	* The current parameters on the panel being hovered over.
	* @type {PanelParameter[]}
	*/
	panelParameters = [];
	/**
	* The current actor to compare parameters against the panel parameters for.
	* @type {Game_Actor}
	*/
	currentActor = null;
	/**
	* Constructor.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Sets the current actor to compare parameters for.
	* @param {Game_Actor} actor The actor to set.
	*/
	setActor(actor) {
		this.currentActor = actor;
	}
	/**
	* Sets the parameters that are defined in this list.
	* @param {PanelParameter[]} parameters The collection of parameters for this panel.
	*/
	setParameters(parameters) {
		this.panelParameters = parameters;
	}
	/**
	* Implements {@link #makeCommandList}.<br>
	* Creates the command list of parameters affected by this SDP.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all omnipedia commands to the list that are available.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		if (!this.panelParameters) return [];
		const commands = this.panelParameters.map(this.#buildPanelParameterCommand, this);
		return commands;
	}
	#buildPanelParameterCommand(panelParameter) {
		const { parameterId, isCore } = panelParameter;
		const colorIndex = isCore ? 14 : 0;
		const paramName = TextManager.longParam(parameterId);
		const paramIcon = IconManager.longParam(parameterId);
		let paramValue = this.currentActor.longParam(parameterId);
		const isPercentParamValue = this.isPercentParameter(parameterId);
		const percentValue = isPercentParamValue ? "%" : String.empty;
		if (!Game_BattlerBase.isBaseParam(parameterId) && parameterId !== 30) {
			paramValue *= 100;
		}
		const paramDescription = TextManager.longParamDescription(parameterId);
		const { modifierColorIndex, modifierText } = this.#determineModifierData(panelParameter);
		const commandName = `${paramName} ( ${Math.trunc(paramValue)}${percentValue} )`;
		const command = new WindowCommandBuilder(commandName).setSymbol(parameterId).addTextLines(paramDescription).setIconIndex(paramIcon).setColorIndex(colorIndex).setRightText(modifierText).setRightColorIndex(modifierColorIndex).setExtensionData(panelParameter).build();
		return command;
	}
	#determineModifierData(panelParameter) {
		const calculateAfterRankUpValue = (paramValue, modifier, isFlat) => {
			return isFlat ? Number((paramValue + modifier).toFixed(2)) : paramValue + paramValue * (modifier / 100);
		};
		const determineModifierColorIndex = (paramId, isCore, paramValue, afterRankupValue) => {
			const upColor = 24;
			const upCoreColor = 28;
			const downColor = 20;
			const downCoreColor = 18;
			const smallerIsBetter = this.isNegativeGood(paramId);
			let colorIndex = 0;
			if (paramValue > afterRankupValue && !smallerIsBetter) {
				colorIndex = isCore ? downCoreColor : downColor;
			} else if (paramValue < afterRankupValue && !smallerIsBetter) {
				colorIndex = isCore ? upCoreColor : upColor;
			} else if (paramValue > afterRankupValue && smallerIsBetter) {
				colorIndex = isCore ? upCoreColor : upColor;
			} else if (paramValue < afterRankupValue && smallerIsBetter) {
				colorIndex = isCore ? downCoreColor : downColor;
			}
			return colorIndex;
		};
		const buildModifierText = (modifier, isFlat) => {
			const isPercent = isFlat ? `` : `%`;
			const isPositive = modifier >= 0 ? "+" : String.empty;
			return `(${isPositive}${modifier}${isPercent})`;
		};
		const { parameterId: paramId, perRank: modifier, isFlat, isCore } = panelParameter;
		const paramValue = this.currentActor.longParam(paramId);
		const afterRankupValue = calculateAfterRankUpValue(paramValue, modifier, isFlat);
		const modifierColorIndex = determineModifierColorIndex(paramId, isCore, paramValue, afterRankupValue);
		const modifierText = buildModifierText(modifier, isFlat);
		return {
			modifierColorIndex,
			modifierText
		};
	}
	/**
	* Determines whether or not the parameter should be marked as "improved" if it is negative.
	* @param {number} parameterId The paramId to check if smaller is better for.
	* @returns {boolean} True if the smaller is better for this paramId, false otherwise.
	*/
	isNegativeGood(parameterId) {
		const smallerIsBetterParameterIds = this.getSmallerIsBetterParameterIds();
		const smallerIsBetter = smallerIsBetterParameterIds.includes(parameterId);
		return smallerIsBetter;
	}
	/**
	* The collection of long-form parameter ids that should have a positive color indicator
	* when there is a decrease of value in that parameter from the panel.
	* @returns {number[]}
	*/
	getSmallerIsBetterParameterIds() {
		return [
			18,
			22,
			23,
			24,
			25,
			26
		];
	}
	/**
	* Determines whether or not the parameter should be suffixed with a % character.
	* This is specifically for parameters that truly are ranged between 0-100 and RNG.
	* @param {number} parameterId The paramId to check if is a percent.
	* @returns {boolean}
	*/
	isPercentParameter(parameterId) {
		const isPercentParameterIds = this.getIsPercentParameterIds();
		const isPercent = isPercentParameterIds.includes(parameterId);
		return isPercent;
	}
	/**
	* The collection of long-form parameter ids that should be decorated with a `%` symbol.
	* @returns {number[]}
	*/
	getIsPercentParameterIds() {
		return [
			9,
			14,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27
		];
	}
	/**
	* Overrides {@link #itemHeight}.<br>
	* Makes the command rows bigger so there can be additional lines.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpRewardList.js
var Window_SdpRewardList = class extends Window_Command {
	/**
	* The list of rewards for the currently-selected panel.
	* @type {PanelRankupReward[]}
	*/
	panelRewards = [];
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	setRewards(rewards) {
		this.panelRewards = rewards;
	}
	/**
	* Implements {@link #makeCommandList}.<br>
	* Creates the command list of rewards granted by this SDP.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all SDP rewards as commands to the list.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const commands = [];
		if (!this.panelRewards) return commands;
		if (this.panelRewards.length === 0) {
			const command = new WindowCommandBuilder("No rewards.").setSymbol("no-rewards").setEnabled(false).setColorIndex(8).build();
			commands.push(command);
			return commands;
		}
		this.panelRewards.forEach((panelReward) => {
			const { rewardName, rankRequired } = panelReward;
			let iconIndex;
			switch (rankRequired) {
				case -1:
					iconIndex = 75;
					break;
				case 0:
					iconIndex = 73;
					break;
				default:
					iconIndex = 86;
					break;
			}
			const command = new WindowCommandBuilder(rewardName).setSymbol(rewardName).setIconIndex(iconIndex).setExtensionData({
				panelReward,
				rankRequired
			}).build();
			commands.push(command);
		});
		return commands;
	}
	/**
	* OVERWRITE Renders reward rows with styled padded ranks.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		this.drawRewardRankRequirement(index, rectX, rectY, rectWidth);
	}
	/**
	* Draws the reward rank requirement on the right side.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawRewardRankRequirement(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const ext = command ? command.ext : null;
		if (!ext) {
			return;
		}
		const { rankRequired } = ext;
		const pad = 12;
		const rightEdge = x + width - pad;
		const label = "Rank: ";
		const labelW = this.textWidth(label);
		let valueText = String.empty;
		if (rankRequired === -1) valueText = "EACH";
		else if (rankRequired === 0) valueText = "MAX";
		if (valueText) {
			const valueW = this.textWidth(valueText);
			const valueX = rightEdge - valueW;
			const labelX = valueX - labelW;
			this.drawText(label, labelX, y, labelW, Window_Base.TextAlignments.Left);
			this.drawText(valueText, valueX, y, valueW, Window_Base.TextAlignments.Left);
			return;
		}
		const valueW = this.textWidth("00");
		const valueX = rightEdge - valueW;
		const labelX = valueX - labelW;
		this.drawText(label, labelX, y, labelW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(valueX, y, rankRequired, valueW, 2, 8, 0);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpCart.js
/**
* A controller-first "shopping cart" window for queued SDP rankups.
* This window is display-only; selection happens in {@link Window_SdpList}.
*/
var Window_SdpCart = class Window_SdpCart extends Window_Command {
	/**
	* The actor whose wallet + rankings apply.
	* @type {Game_Actor|null}
	*/
	actor = null;
	/**
	* The queued cart levels by panel key.
	* @type {Map<string, number>}
	*/
	cart = new Map();
	/**
	* The cached wallet value for the pinned row.
	* @type {number}
	*/
	wallet = 0;
	/**
	* The cached total cost for the pinned row.
	* @type {number}
	*/
	totalCost = 0;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Binds the cart context to this window.
	* @param {Game_Actor} actor The actor whose SDP points will be spent.
	* @param {Map<string, number>} cart The queued levels by panel key.
	*/
	setCart(actor, cart) {
		this.actor = actor;
		this.cart = cart;
	}
	/**
	* OVERWRITE No commands are selectable in this window.
	*/
	isCurrentItemEnabled() {
		return false;
	}
	/**
	* Implements {@link #makeCommandList}.<br>
	* Draws the contents of the cart and the total cost.
	*/
	makeCommandList() {
		const { actor } = this;
		if (!actor) {
			return;
		}
		if (this.cart.size === 0) {
			const empty = new WindowCommandBuilder("Cart: empty").setSymbol("cart-empty").setEnabled(false).setColorIndex(8).build();
			this.addBuiltCommand(empty);
			return;
		}
		let totalCost = 0;
		this.cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			const cost = Window_SdpCart.#calculateQueuedCost(panel, currentRank, levels);
			totalCost += cost;
		});
		const wallet = actor.getSdpPoints();
		this.wallet = wallet;
		this.totalCost = totalCost;
		const walletRow = new WindowCommandBuilder(J.SDP.Metadata.sdpPointsDisplayName).setSymbol("cart-wallet").setEnabled(false).setIconIndex(J.SDP.Metadata.sdpIconIndex).build();
		this.addBuiltCommand(walletRow);
		this.cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			const cost = Window_SdpCart.#calculateQueuedCost(panel, currentRank, levels);
			const command = new WindowCommandBuilder(panel.name).setSymbol(`cart-${key}`).setEnabled(false).setIconIndex(panel.iconIndex).setExtensionData({
				levels,
				cost
			}).build();
			this.addBuiltCommand(command);
		});
	}
	/**
	* OVERWRITE Renders the cart rows with styled padded numbers.
	* @param {number} index The command index.
	*/
	drawItem(index) {
		this.preDrawItem(index);
		const { x: rectX, y: rectY, width: rectWidth } = this.itemLineRect(index);
		const commandIcon = this.commandIcon(index);
		if (commandIcon) {
			this.drawIcon(commandIcon, rectX + 4, rectY);
		}
		const commandNameX = rectX + 40;
		this.drawTextEx(this.buildCommandName(index), commandNameX, rectY, rectWidth);
		const symbol = this.commandSymbol(index);
		if (symbol === "cart-wallet") {
			this.drawCartWalletRow(rectX, rectY, rectWidth);
		} else if (symbol.startsWith("cart-")) {
			this.drawCartLineItemRow(index, rectX, rectY, rectWidth);
		}
	}
	/**
	* Draws the pinned wallet row with styled numbers.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawCartWalletRow(x, y, width) {
		const pad = 12;
		const gap = 12;
		const spendW = this.textWidth("(-00000000)");
		const amountW = this.textWidth("00000000");
		const spendX = x + width - spendW - pad;
		const amountX = spendX - gap - amountW;
		this.drawStyledZeroPaddedNumber(amountX, y, this.wallet, amountW, 8, 8, 0);
		const canAfford = this.totalCost <= this.wallet;
		let spendColor = 0;
		if (this.totalCost > 0) {
			spendColor = canAfford ? 24 : 18;
		}
		this.drawStyledZeroPaddedCost(spendX, y, this.totalCost, spendW, 8, 8, spendColor);
	}
	/**
	* Draws a cart line item row with `+NN | 00000000` formatting.
	* @param {number} index The command index.
	* @param {number} x The row x.
	* @param {number} y The row y.
	* @param {number} width The row width.
	*/
	drawCartLineItemRow(index, x, y, width) {
		const command = this.commandEntryAt(index);
		const ext = command ? command.ext : null;
		if (!ext) {
			return;
		}
		const { levels, cost } = ext;
		const pad = 12;
		const gap = 8;
		const costW = this.textWidth("00000000");
		const costX = x + width - costW - pad;
		this.drawStyledZeroPaddedNumber(costX, y, cost, costW, 8, 8, 0);
		const prefix = "+";
		const pipe = " |";
		const pipeW = this.textWidth(pipe);
		const plusW = this.textWidth(prefix);
		const levelsW = this.textWidth("00");
		const pipeX = costX - gap - pipeW;
		const levelsX = pipeX - levelsW;
		const plusX = levelsX - plusW;
		this.drawText(prefix, plusX, y, plusW, Window_Base.TextAlignments.Left);
		this.drawStyledZeroPaddedNumber(levelsX, y, levels, levelsW, 2, 8, 0);
		this.drawText(pipe, pipeX, y, pipeW, Window_Base.TextAlignments.Left);
	}
	/**
	* Calculates the total cost of a queued number of rankups for a panel.
	* @param {StatDistributionPanel} panel The panel being purchased.
	* @param {number} currentRank The current rank of the panel.
	* @param {number} levels The queued levels.
	* @returns {number}
	*/
	static #calculateQueuedCost(panel, currentRank, levels) {
		let cost = 0;
		for (let i = 0; i < levels; i++) {
			cost += panel.rankUpCost(currentRank + i);
		}
		return cost;
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpConfirmation.js
/**
* The window that prompts the user to confirm/cancel the upgrading of a chosen panel.
* Long panel names must not become {@link Window_Command} labels: {@link Window_Command#drawItem}
* feeds names through {@link Window_Base#drawTextEx}, which wraps and stacks multiple lines inside
* a single-row {@link Window_Selectable#itemRect}, producing overlapping unreadable text.
*/
var Window_SdpConfirmation = class extends Window_Command {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
		this.initMembers();
		this.opacity = 255;
		this.contentsBack.opacity = 255;
		this.contents.opacity = 255;
	}
	updateBackOpacity() {
		this.backOpacity = 255;
	}
	/**
	* Initializes all members of this window.
	*/
	initMembers() {
		/**
		* The current mode of this confirmation window.
		* - single: upgrade hovered panel once.
		* - cart: checkout the queued cart.
		* @type {string}
		*/
		this.mode = "single";
		/**
		* The summary of the current cart checkout, if applicable.
		* @type {{
		*   panelCount: number,
		*   levelCount: number,
		*   totalCost: number,
		*   wallet: number,
		*   remaining: number,
		*   canAfford: boolean,
		*   solePanelName: string|null
		* }|null}
		*/
		this.cartSummary = null;
		/**
		* The summary of the current single-panel upgrade, if applicable.
		* @type {{ panelName: string, cost: number, wallet: number, remaining: number, canAfford: boolean }|null}
		*/
		this.singleSummary = null;
	}
	/**
	* The amount of columns this command window uses.
	* @returns {number}
	*/
	maxCols() {
		return 2;
	}
	/**
	* The width of each command cell.
	* @returns {number}
	*/
	itemWidth() {
		const spacing = this.colSpacing();
		return Math.floor((this.innerWidth - spacing) / 2);
	}
	/**
	* Keep the choice row tight; the summary above does the heavy lifting.
	* @returns {number}
	*/
	numVisibleRows() {
		return 1;
	}
	/**
	* Keep the two choices separated but not wasteful.
	* @returns {number}
	*/
	colSpacing() {
		return 12;
	}
	/**
	* Sets the mode of this confirmation window.
	* @param {string} mode The mode key.
	*/
	setMode(mode) {
		this.mode = mode;
	}
	/**
	* Sets the cart summary for this confirmation window.
	* @param {{
	*   panelCount: number,
	*   levelCount: number,
	*   totalCost: number,
	*   wallet: number,
	*   remaining: number,
	*   canAfford: boolean,
	*   solePanelName: string|null
	* }} summary The cart summary.
	*/
	setCartSummary(summary) {
		this.cartSummary = summary;
	}
	/**
	* Sets the single-upgrade summary for this confirmation window.
	* @param {string} panelName The name of the panel being upgraded.
	* @param {number} cost The cost of the rank-up.
	* @param {number} wallet The actor wallet.
	*/
	setSingleSummary(panelName, cost, wallet) {
		const remaining = wallet - cost;
		const canAfford = remaining >= 0;
		this.singleSummary = {
			panelName,
			cost,
			wallet,
			remaining,
			canAfford
		};
	}
	/**
	* Vertical space reserved for the summary block above command rows.
	* Must stay in sync with {@link #drawConfirmationSummary}.
	* @returns {number}
	*/
	confirmationSummaryHeight() {
		const topPad = this.itemPadding();
		const lh = this.lineHeight();
		const gapBeforeCommands = 8;
		return topPad + lh * 4 + gapBeforeCommands;
	}
	/**
	* Shifts command rows below the summary block so list geometry stays coherent.
	* @param {number} index The command index.
	* @returns {Rectangle}
	*/
	itemRect(index) {
		const rect = Window_Selectable.prototype.itemRect.call(this, index);
		rect.y += this.confirmationSummaryHeight();
		return rect;
	}
	/**
	* Paints summary text first, then command rows (default {@link Window_Selectable#paint} omits summary).
	*/
	paint() {
		if (!this.contents) {
			return;
		}
		this.contents.clear();
		if (this.contentsBack) {
			this.contentsBack.clear();
		}
		this.drawConfirmationSummary();
		this.drawAllItems();
	}
	/**
	* Draws the checkout / upgrade context above the OK and Cancel lines.
	*/
	drawConfirmationSummary() {
		const padX = this.itemPadding();
		const w = this.innerWidth - padX * 2;
		let y = this.itemPadding();
		this.resetFontSettings();
		/**
		* Draws a labeled row with a right-aligned numeric amount.
		* @param {number} iconIndex The icon index, or 0 for none.
		* @param {string} label The left-aligned label.
		* @param {number} amount The right-aligned amount.
		* @param {number} colorIndex The right-text color index.
		*/
		const drawLabeledAmountRow = (iconIndex, label, amount, colorIndex = 0) => {
			const hasIcon = iconIndex > 0;
			const iconSpace = hasIcon ? 40 : 0;
			const textX = padX + iconSpace;
			const textW = w - iconSpace;
			if (hasIcon) {
				this.drawIcon(iconIndex, padX, y + 2);
			}
			this.drawText(label, textX, y, textW, "left");
			this.drawStyledZeroPaddedNumber(textX, y, amount, textW, 8, 8, colorIndex);
			y += this.lineHeight();
		};
		if (this.mode === "cart") {
			const summary = this.cartSummary;
			if (!summary) {
				return;
			}
			let lineA;
			if (summary.panelCount === 1 && summary.solePanelName) {
				const levelWord = summary.levelCount === 1 ? "rank" : "ranks";
				const nameMarked = this.boldenText(summary.solePanelName);
				lineA = `${nameMarked} will be upgraded by ${summary.levelCount} ${levelWord}.`;
			} else {
				const { unitPlural } = J.SDP.Metadata;
				const upgradeWord = summary.levelCount === 1 ? "upgrade" : "upgrades";
				lineA = `${summary.levelCount} ${upgradeWord} on ${summary.panelCount} ${unitPlural}; confirm?`;
			}
			this.drawTextEx(lineA, padX, y, w);
			y += this.lineHeight();
			drawLabeledAmountRow(J.SDP.Metadata.sdpIconIndex, "Current Amount", summary.wallet);
			drawLabeledAmountRow(0, "Cost to pay", summary.totalCost, 18);
			y -= 8;
			this.drawHorizontalLine(padX, y, w);
			y += 10;
			drawLabeledAmountRow(0, `Remaining ${J.SDP.Metadata.sdpPointsDisplayName}`, summary.remaining);
		} else {
			const summary = this.singleSummary;
			if (!summary) {
				return;
			}
			const nameMarked = this.boldenText(summary.panelName);
			const lineA = `${nameMarked} will be upgraded by 1 rank.`;
			this.drawTextEx(lineA, padX, y, w);
			y += this.lineHeight();
			drawLabeledAmountRow(J.SDP.Metadata.sdpIconIndex, "Current Amount", summary.wallet);
			drawLabeledAmountRow(0, "Cost to pay", summary.cost, 18);
			y -= 8;
			this.drawHorizontalLine(padX, y, w);
			y += 10;
			drawLabeledAmountRow(0, `Remaining ${J.SDP.Metadata.sdpPointsDisplayName}`, summary.remaining);
		}
		this.resetFontSettings();
	}
	/**
	* OVERWRITE Creates the command list for this window.
	*/
	makeCommandList() {
		const isCart = this.mode === "cart";
		const summary = isCart ? this.cartSummary : this.singleSummary;
		const canAfford = summary ? summary.canAfford : false;
		const upgrade = new WindowCommandBuilder("Upgrade").setSymbol(isCart ? "panel-cart-ok" : "panel-upgrade-ok").setEnabled(canAfford).setIconIndex(91).build();
		this.addBuiltCommand(upgrade);
		const cancel = new WindowCommandBuilder("Cancel").setSymbol("panel-upgrade-cancel").setEnabled(true).setIconIndex(90).build();
		this.addBuiltCommand(cancel);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpPoints.js
/**
* The SDP window containing the menu actor identity.
*/
var Window_SdpPoints = class extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The rectangle that defines this window's shape.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
		this.initMembers();
	}
	/**
	* Initializes all members of this window.
	*/
	initMembers() {
		this._actor = null;
	}
	/**
	* Refreshes this window and all its content.
	*/
	refresh() {
		this.contents.clear();
		this.drawPoints();
	}
	/**
	* Draws the face + actor name of the menu actor.
	*/
	drawPoints() {
		this.drawSdpFace();
		this.drawActorName();
	}
	/**
	* Draws the menu actor name (wallet moved to the cart).
	*/
	drawActorName() {
		if (!this._actor) return;
		const actorName = this._actor.name();
		const x = 140;
		const y = 0;
		const textWidth = this.innerWidth - x;
		const alignment = "left";
		this.drawText(actorName, x, y, textWidth, alignment);
	}
	/**
	* A wrapper around the drawing of the actor's face- in case we need logic.
	*/
	drawSdpFace() {
		if (!this._actor) return;
		this.drawFace(this._actor.faceName(), this._actor.faceIndex(), 0, 0, 128, 40);
	}
	/**
	* Sets the actor focus for the SDP points window. Implicit refresh.
	* @param {Game_Actor} actor The actor to display SDP info for.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpHelp.js
/**
* The window that displays the help text associated with a panel.
*/
var Window_SdpHelp = class extends Window_Help {
	/**
	* @constructor
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
};

//#endregion
//#region src/plugins/sdp/core/windows/Window_SdpControlsHint.js
/**
* A single-line controller hint for the SDP scene.
* This must not live in {@link Window_SdpHelp} because that help window is
* reserved for 2 lines of panel description.
*/
var Window_SdpControlsHint = class extends Window_Base {
	/**
	* @param {Rectangle} rect The dimensions of the window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Re-renders the static controller hint.
	*/
	refresh() {
		this.contents.clear();
		this.drawControllerHint();
	}
	/**
	* Draws the controller-first legend for cart + checkout + filters.
	*/
	drawControllerHint() {
		const padX = 12;
		this.resetFontSettings();
		this.modFontSize(-4);
		this.changeTextColor(ColorManager.normalColor());
		const text = "L/R: -/+ cart  OK: checkout/upgrade  More: filter";
		const y = Math.max(0, Math.floor((this.innerHeight - this.lineHeight()) / 2));
		this.drawText(text, padX, y, this.innerWidth - padX * 2, "left");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_SDP.js
/**
* The scene for managing SDPs that the player has acquired.
*/
var Scene_SDP = class extends Scene_MenuBase {
	/**
	* Calls this scene.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initializes all properties for this scene.
	*/
	initMembers() {
		super.initMembers();
		this._j ||= {};
		/**
		* A grouping of all properties associated with the sdp system.
		*/
		this._j._sdp = {};
		/**
		* A grouping of all windows associated with this scene.
		*/
		this._j._sdp._windows = {};
		/**
		* All panels that are unlocked by the party and available for ranking up.
		* @type {Window_SdpList}
		*/
		this._j._sdp._windows._sdpList = null;
		/**
		* Header strip for the hovered SDP (single-line name/rarity/flavor).
		* @type {Window_SdpHeader}
		*/
		this._j._sdp._windows._sdpHeader = null;
		/**
		* The list of parameters associated with the currently selected SDP.
		* @type {Window_SdpParameterList}
		*/
		this._j._sdp._windows._sdpParameterList = null;
		/**
		* The list of rewards associated with the currently selected SDP.
		* @type {Window_SdpRewardList}
		*/
		this._j._sdp._windows._sdpRewardList = null;
		/**
		* The shopping cart window for planned rank-ups.
		* @type {Window_SdpCart}
		*/
		this._j._sdp._windows._sdpCart = null;
		/**
		* The confirmation window that allows the user to confirm the rankup of a panel.
		* @type {Window_SdpConfirmation}
		*/
		this._j._sdp._windows._sdpConfirmation = null;
		/**
		* The points window that displays the current menu actor's SDP points.
		* @type {Window_SdpPoints}
		*/
		this._j._sdp._windows._sdpPoints = null;
		/**
		* The help window that displays the description of the currently hovered SDP.
		* @type {Window_SdpHelp}
		*/
		this._j._sdp._windows._sdpHelp = null;
		/**
		* The controller-first shopping cart of queued rankups by panel key.
		* @type {Map<string, number>}
		*/
		this._j._sdp._cart = new Map();
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
	* Overrides {@link #createButtons}.<br>
	* Removes the rendering of buttons from this scene.
	*/
	createButtons() {}
	/**
	* Pixel width shared by the center column windows.
	* @returns {number}
	*/
	sdpCenterColumnWidth() {
		return 720;
	}
	/**
	* Creates all windows associated with the SDP scene.
	*/
	createAllWindows() {
		this.createSdpPointsWindow();
		this.createSdpHeaderWindow();
		this.createSdpControlsHintWindow();
		this.createSdpHelpWindow();
		this.createSdpListWindow();
		this.createSdpParameterListWindow();
		this.createSdpRewardListWindow();
		this.createSdpCartWindow();
		this.createSdpConfirmationWindow();
		this.onPanelHoveredChange();
	}
	/**
	* Creates the list of SDPs available to the player.
	*/
	createSdpListWindow() {
		const window = this.buildSdpListWindow();
		this.setSdpListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp listing window.
	* @returns {Window_SdpList}
	*/
	buildSdpListWindow() {
		const rectangle = this.sdpListRectangle();
		const window = new Window_SdpList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onSelectPanel.bind(this));
		window.setHandler("more", this.onFilterPanels.bind(this));
		window.setHandler("cart-dec", this.onCartLevelDecrease.bind(this));
		window.setHandler("cart-inc", this.onCartLevelIncrease.bind(this));
		window.setHandler("pagedown", this.cycleMembers.bind(this, true));
		window.setHandler("pageup", this.cycleMembers.bind(this, false));
		window.onIndexChange = this.onPanelHoveredChange.bind(this);
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp list command window.
	* @returns {Rectangle}
	*/
	sdpListRectangle() {
		const pointsRectangle = this.sdpPointsRectangle();
		const width = 480;
		const hintH = this.sdpControlsHintHeight();
		const heightFit = pointsRectangle.height + this.sdpHelpRectangle().height + hintH + 8;
		const height = Graphics.height - heightFit;
		const x = 0;
		const y = pointsRectangle.height;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked sdp list window.
	* @returns {Window_SdpList}
	*/
	getSdpListWindow() {
		return this._j._sdp._windows._sdpList;
	}
	/**
	* Set the currently tracked parameter list window to the given window.
	* @param {Window_SdpList} listWindow The parameter list window to track.
	*/
	setSdpListWindow(listWindow) {
		this._j._sdp._windows._sdpList = listWindow;
	}
	/**
	* Creates the window for all parameters associated with the hovered SDP.
	*/
	createSdpParameterListWindow() {
		const window = this.buildSdpParameterListWindow();
		this.setSdpParameterListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp parameter listing window.
	* @returns {Window_SdpParameterList}
	*/
	buildSdpParameterListWindow() {
		const rectangle = this.sdpParameterListRectangle();
		const window = new Window_SdpParameterList(rectangle);
		window.deselect();
		window.deactivate();
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle associated with the parameter list command window.
	* @returns {Rectangle}
	*/
	sdpParameterListRectangle() {
		const listRect = this.sdpListRectangle();
		const headerH = this.sdpHeaderRectangle().height;
		const helpH = this.sdpHelpRectangle().height;
		const hintH = this.sdpControlsHintHeight();
		const x = listRect.width;
		const y = headerH;
		const width = this.sdpCenterColumnWidth();
		const height = Graphics.boxHeight - helpH - headerH - hintH;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked parameter list window.
	* @returns {Window_SdpParameterList}
	*/
	getSdpParameterListWindow() {
		return this._j._sdp._windows._sdpParameterList;
	}
	/**
	* Set the currently tracked parameter list window to the given window.
	* @param {Window_SdpParameterList} listWindow The parameter list window to track.
	*/
	setSdpParameterListWindow(listWindow) {
		this._j._sdp._windows._sdpParameterList = listWindow;
	}
	/**
	* Creates the window for all rewards associated with the hovered SDP.
	*/
	createSdpRewardListWindow() {
		const window = this.buildSdpRewardListWindow();
		this.setSdpRewardListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp reward listing window.
	* @returns {Window_SdpRewardList}
	*/
	buildSdpRewardListWindow() {
		const rectangle = this.sdpRewardListRectangle();
		const window = new Window_SdpRewardList(rectangle);
		window.deselect();
		window.deactivate();
		return window;
	}
	/**
	* Gets the currently tracked reward list window.
	* @returns {Window_SdpRewardList}
	*/
	getSdpRewardListWindow() {
		return this._j._sdp._windows._sdpRewardList;
	}
	/**
	* Set the currently tracked reward list window to the given window.
	* @param {Window_SdpRewardList} listWindow The reward list window to track.
	*/
	setSdpRewardListWindow(listWindow) {
		this._j._sdp._windows._sdpRewardList = listWindow;
	}
	/**
	* Creates the window for planned ("cart") panel rankups.
	*/
	createSdpCartWindow() {
		const window = this.buildSdpCartWindow();
		this.setSdpCartWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the cart window (shares the right column with rewards).
	* @returns {Window_SdpCart}
	*/
	buildSdpCartWindow() {
		const rectangle = this.sdpCartRectangle();
		const window = new Window_SdpCart(rectangle);
		window.deselect();
		window.deactivate();
		return window;
	}
	/**
	* Gets the tracked cart window.
	* @returns {Window_SdpCart}
	*/
	getSdpCartWindow() {
		return this._j._sdp._windows._sdpCart;
	}
	/**
	* Sets the tracked cart window.
	* @param {Window_SdpCart} cartWindow The cart window to track.
	*/
	setSdpCartWindow(cartWindow) {
		this._j._sdp._windows._sdpCart = cartWindow;
	}
	/**
	* Rectangle for the cart window, occupying the bottom half of the right column.
	* @returns {Rectangle}
	*/
	sdpCartRectangle() {
		const rewardsRect = this.sdpRewardListRectangle();
		const bottom = this.sdpRightColumnBottom();
		const gap = this.sdpRightColumnSplitGap();
		const cartY = rewardsRect.y + rewardsRect.height + gap;
		const cartHeight = bottom - cartY;
		return new Rectangle(rewardsRect.x, cartY, rewardsRect.width, cartHeight);
	}
	/**
	* Rectangle for the rewards window, occupying the top half of the right column.
	* @returns {Rectangle}
	*/
	sdpRewardListRectangle() {
		const sdpListRect = this.sdpListRectangle();
		const centerW = this.sdpCenterColumnWidth();
		const { height: headerH } = this.sdpHeaderRectangle();
		const x = sdpListRect.width + centerW;
		const y = headerH;
		const width = Graphics.boxWidth - x;
		const bottom = this.sdpRightColumnBottom();
		const gap = this.sdpRightColumnSplitGap();
		const fullHeight = bottom - y;
		const height = Math.floor((fullHeight - gap) / 2);
		return new Rectangle(x, y, width, height);
	}
	/**
	* The bottom boundary for the right column (rewards + cart).
	* @returns {number}
	*/
	sdpRightColumnBottom() {
		return Graphics.boxHeight;
	}
	/**
	* The gap between rewards and cart windows.
	* @returns {number}
	*/
	sdpRightColumnSplitGap() {
		return 0;
	}
	/**
	* Creates the header window for the hovered SDP.
	*/
	createSdpHeaderWindow() {
		const window = this.buildSdpHeaderWindow();
		this.setSdpHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the header window.
	* @returns {Window_SdpHeader}
	*/
	buildSdpHeaderWindow() {
		const rectangle = this.sdpHeaderRectangle();
		return new Window_SdpHeader(rectangle);
	}
	/**
	* The rectangle for the header strip spanning the top row (right of points ribbon).
	* @returns {Rectangle}
	*/
	sdpHeaderRectangle() {
		const pointsRect = this.sdpPointsRectangle();
		const { width: x } = pointsRect;
		const y = 0;
		const width = Graphics.boxWidth - x;
		const height = 108;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the tracked header window.
	* @returns {Window_SdpHeader}
	*/
	getSdpHeaderWindow() {
		return this._j._sdp._windows._sdpHeader;
	}
	/**
	* Sets the tracked header window.
	* @param {Window_SdpHeader} headerWindow The header window to track.
	*/
	setSdpHeaderWindow(headerWindow) {
		this._j._sdp._windows._sdpHeader = headerWindow;
	}
	/**
	* Pixel height reserved for the controller legend strip above {@link Window_SdpHelp}.
	* @returns {number}
	*/
	sdpControlsHintHeight() {
		const lineHeight = Window_Base.prototype.lineHeight();
		const pad = $gameSystem.windowPadding();
		return lineHeight + pad * 2;
	}
	/**
	* Creates the controller hint strip (cart/checkout/filter legend).
	*/
	createSdpControlsHintWindow() {
		const window = this.buildSdpControlsHintWindow();
		this.addWindow(window);
	}
	/**
	* Builds the controller hint window.
	* @returns {Window_SdpControlsHint}
	*/
	buildSdpControlsHintWindow() {
		const rectangle = this.sdpControlsHintRectangle();
		const window = new Window_SdpControlsHint(rectangle);
		window.refresh();
		return window;
	}
	/**
	* Rectangle for the controller legend strip (left + center columns only).
	* @returns {Rectangle}
	*/
	sdpControlsHintRectangle() {
		const hintH = this.sdpControlsHintHeight();
		const { y: helpY, width: helpWidth } = this.sdpHelpRectangle();
		const x = 0;
		const y = helpY - hintH;
		const width = helpWidth;
		const height = hintH;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Creates the help window that provides contextual details to the player about the panel.
	*/
	createSdpHelpWindow() {
		const window = this.buildSdpHelpWindow();
		this.setSdpHelpWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp help window.
	* @returns {Window_SdpHelp}
	*/
	buildSdpHelpWindow() {
		const rectangle = this.sdpHelpRectangle();
		const window = new Window_SdpHelp(rectangle);
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp help window.
	* @returns {Rectangle}
	*/
	sdpHelpRectangle() {
		const { width: ribbonW } = this.sdpPointsRectangle();
		const width = ribbonW + this.sdpCenterColumnWidth();
		const lineHeight = Window_Base.prototype.lineHeight();
		const pad = $gameSystem.windowPadding();
		const height = lineHeight * 2 + pad * 2 + 24;
		const x = 0;
		const y = Graphics.boxHeight - height;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked sdp help window.
	* @returns {Window_SdpHelp}
	*/
	getSdpHelpWindow() {
		return this._j._sdp._windows._sdpHelp;
	}
	/**
	* Set the currently tracked help window to the given window.
	* @param {Window_SdpHelp} helpWindow The help window to track.
	*/
	setSdpHelpWindow(helpWindow) {
		this._j._sdp._windows._sdpHelp = helpWindow;
	}
	/**
	* Creates the points window for displaying how many points the current actor has.
	*/
	createSdpPointsWindow() {
		const window = this.buildSdpPointsWindow();
		this.setSdpPointsWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp points window.
	* @returns {Window_SdpPoints}
	*/
	buildSdpPointsWindow() {
		const rectangle = this.sdpPointsRectangle();
		const window = new Window_SdpPoints(rectangle);
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp points ribbon window.
	* @returns {Rectangle}
	*/
	sdpPointsRectangle() {
		const width = 480;
		const height = 72;
		const x = 0;
		const y = 0;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked sdp points window.
	* @returns {Window_SdpPoints}
	*/
	getSdpPointsWindow() {
		return this._j._sdp._windows._sdpPoints;
	}
	/**
	* Set the currently tracked sdp points window to the given window.
	* @param {Window_SdpPoints} pointsWindow The window to track.
	*/
	setSdpPointsWindow(pointsWindow) {
		this._j._sdp._windows._sdpPoints = pointsWindow;
	}
	/**
	* Creates the confirmation window for confirming the rankup of an SDP.
	*/
	createSdpConfirmationWindow() {
		const window = this.buildSdpConfirmationWindow();
		this.setSdpConfirmationWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the sdp listing window.
	* @returns {Window_SdpConfirmation}
	*/
	buildSdpConfirmationWindow() {
		const rectangle = this.sdpConfirmationRectangle();
		const window = new Window_SdpConfirmation(rectangle);
		window.setHandler("cancel", this.onUpgradeCancel.bind(this));
		window.setHandler("panel-upgrade-ok", this.onUpgradeConfirm.bind(this));
		window.setHandler("panel-cart-ok", this.onCartCheckoutConfirm.bind(this));
		window.setHandler("panel-upgrade-cancel", this.onUpgradeCancel.bind(this));
		window.hide();
		return window;
	}
	/**
	* Gets the rectangle associated with the sdp confirmation window.
	* @returns {Rectangle}
	*/
	sdpConfirmationRectangle() {
		const windowPad = $gameSystem.windowPadding();
		const lh = Window_Base.prototype.lineHeight();
		const itemPad = 8;
		const summaryBlock = itemPad + lh * 4 + 8;
		const commandBlock = lh;
		const innerSlack = 16;
		const height = windowPad * 2 + summaryBlock + commandBlock + innerSlack;
		const width = Math.min(Graphics.boxWidth - 48, 710);
		const x = (Graphics.boxWidth - width) / 2;
		const y = (Graphics.boxHeight - height) / 2;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked sdp confirmation window.
	* @returns {Window_SdpConfirmation}
	*/
	getSdpConfirmationWindow() {
		return this._j._sdp._windows._sdpConfirmation;
	}
	/**
	* Set the currently tracked sdp confirmation window to the given window.
	* @param {Window_SdpConfirmation} confirmationWindow The window to track.
	*/
	setSdpConfirmationWindow(confirmationWindow) {
		this._j._sdp._windows._sdpConfirmation = confirmationWindow;
	}
	/**
	* When selecting a panel, bring up the confirmation window.
	*/
	onSelectPanel() {
		if (this._j._sdp._cart.size > 0) {
			this.openCartCheckoutConfirmation();
			return;
		}
		this.openSingleUpgradeConfirmation();
	}
	/**
	* Opens the confirmation window for purchasing the queued cart.
	*/
	openCartCheckoutConfirmation() {
		const window = this.getSdpConfirmationWindow();
		window.setMode("cart");
		window.setCartSummary(this.buildCartSummary($gameParty.menuActor()));
		window.refresh();
		window.show();
		window.open();
		window.activate();
		this.showModalDimmer(Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT, this.getSdpConfirmationWindow());
	}
	/**
	* Opens the confirmation window for purchasing a single rank-up.
	*/
	openSingleUpgradeConfirmation() {
		const actor = $gameParty.menuActor();
		const panel = this.getSdpListWindow().currentExt();
		const { currentRank } = actor.getSdpByKey(panel.key);
		const cost = panel.rankUpCost(currentRank);
		const window = this.getSdpConfirmationWindow();
		window.setMode("single");
		window.setSingleSummary(panel.name, cost, actor.getSdpPoints());
		window.refresh();
		window.show();
		window.open();
		window.activate();
		this.showModalDimmer(Scene_Base.MODAL_DIMMER_CONTENTS_OPACITY_DEFAULT, this.getSdpConfirmationWindow());
	}
	/**
	* Queues one more level for the currently hovered panel.
	*/
	onCartLevelIncrease() {
		this.modifyHoveredPanelCartLevels(1);
	}
	/**
	* Removes one queued level for the currently hovered panel.
	*/
	onCartLevelDecrease() {
		this.modifyHoveredPanelCartLevels(-1);
	}
	/**
	* Adds or removes queued levels for the hovered panel.
	* @param {number} delta The amount to adjust by.
	*/
	modifyHoveredPanelCartLevels(delta) {
		const panel = this.getSdpListWindow().currentExt();
		if (!panel) {
			return;
		}
		const actor = $gameParty.menuActor();
		const { key, maxRank } = panel;
		const { currentRank } = actor.getSdpByKey(key);
		const maxQueue = Math.max(0, maxRank - currentRank);
		const cart = this._j._sdp._cart;
		const existing = cart.get(key) ?? 0;
		const next = Math.max(0, Math.min(existing + delta, maxQueue));
		if (next === 0) {
			cart.delete(key);
		} else {
			cart.set(key, next);
		}
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
	}
	/**
	* Toggle the filtering out of already-maxed panels.
	*/
	onFilterPanels() {
		const sdpListWindow = this.getSdpListWindow();
		sdpListWindow.toggleNoMaxPanelsFilter();
		this.onPanelHoveredChange();
		if (sdpListWindow.index() >= sdpListWindow.commandList().length) {
			sdpListWindow.select(sdpListWindow.commandList().length - 1);
		}
	}
	/**
	* Attempts to execute all cart rankups in one go.
	* If the total cost cannot be afforded, nothing happens.
	*/
	checkoutCart() {
		const actor = $gameParty.menuActor();
		const cart = this._j._sdp._cart;
		if (cart.size === 0) {
			return false;
		}
		let totalCost = 0;
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				totalCost += panel.rankUpCost(currentRank + i);
			}
		});
		const wallet = actor.getSdpPoints();
		if (totalCost > wallet) {
			SoundManager.playBuzzer();
			return false;
		}
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				const cost = panel.rankUpCost(currentRank + i);
				if (cost === 0) {
					return;
				}
				actor.modSdpPoints(-cost);
				actor.rankUpPanel(key);
				actor.modAccumulatedSpentSdpPoints(cost);
			}
		});
		this._j._sdp._cart.clear();
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
		return true;
	}
	/**
	* Builds a summarized view of the cart for display/confirmation.
	* @param {Game_Actor} actor The actor whose wallet and ranks apply.
	* @returns {{
	*   panelCount: number,
	*   levelCount: number,
	*   totalCost: number,
	*   wallet: number,
	*   remaining: number,
	*   canAfford: boolean,
	*   solePanelName: string|null
	* }}
	*/
	buildCartSummary(actor) {
		const cart = this._j._sdp._cart;
		const wallet = actor.getSdpPoints();
		let totalCost = 0;
		let levelCount = 0;
		let panelCount = 0;
		cart.forEach((levels, key) => {
			const panel = J.SDP.Metadata.panelsMap.get(key);
			if (!panel) {
				return;
			}
			panelCount++;
			levelCount += levels;
			const { currentRank } = actor.getSdpByKey(key);
			for (let i = 0; i < levels; i++) {
				totalCost += panel.rankUpCost(currentRank + i);
			}
		});
		const remaining = wallet - totalCost;
		const canAfford = remaining >= 0;
		let solePanelName = null;
		if (panelCount === 1) {
			cart.forEach((_levels, key) => {
				const sole = J.SDP.Metadata.panelsMap.get(key);
				if (sole) {
					solePanelName = sole.name;
				}
			});
		}
		return {
			panelCount,
			levelCount,
			totalCost,
			wallet,
			remaining,
			canAfford,
			solePanelName
		};
	}
	/**
	* Refreshes all windows in this scene on change of index in the list.
	*/
	onPanelHoveredChange() {
		const hasPanels = this.getSdpListWindow().hasCommands();
		if (!hasPanels) {
			this.getSdpHeaderWindow().setPanel(null);
			this.getSdpHeaderWindow().refresh();
			return;
		}
		/** @type {StatDistributionPanel} */
		const currentPanel = this.getSdpListWindow().currentExt();
		const currentActor = $gameParty.menuActor();
		this.getSdpListWindow().setActor(currentActor);
		this.getSdpListWindow().setCart(this._j._sdp._cart);
		this.getSdpPointsWindow().setActor(currentActor);
		const parameterListWindow = this.getSdpParameterListWindow();
		parameterListWindow.setActor(currentActor);
		parameterListWindow.setParameters(currentPanel.panelParameters);
		parameterListWindow.refresh();
		const rewardListWindow = this.getSdpRewardListWindow();
		rewardListWindow.setRewards(currentPanel.panelRewards);
		rewardListWindow.refresh();
		this.getSdpCartWindow().setCart(currentActor, this._j._sdp._cart);
		this.getSdpCartWindow().refresh();
		this.getSdpHeaderWindow().setPanel(currentPanel);
		this.getSdpHeaderWindow().refresh();
		this.getSdpHelpWindow().setText(currentPanel.description);
	}
	/**
	* Cycles the currently selected member to the next in the party.
	* @param {boolean} isForward Whether or not to cycle to the next member or previous.
	*/
	cycleMembers(isForward = true) {
		if (this._j._sdp._cart.size > 0) {
			SoundManager.playBuzzer();
			this.getSdpListWindow().activate();
			return;
		}
		isForward ? $gameParty.makeMenuActorNext() : $gameParty.makeMenuActorPrevious();
		this.onPanelHoveredChange();
		this.getSdpListWindow().activate();
	}
	/**
	* If the player opts to upgrade the existing panel, remove the points and rank up the panel.
	*/
	onUpgradeConfirm() {
		this.hideModalDimmer();
		const panel = this.getSdpListWindow().currentExt();
		const actor = $gameParty.menuActor();
		const panelRanking = actor.getSdpByKey(panel.key);
		const panelRankupCost = panel.rankUpCost(panelRanking.currentRank);
		actor.modSdpPoints(-panelRankupCost);
		actor.rankUpPanel(panel.key);
		actor.modAccumulatedSpentSdpPoints(panelRankupCost);
		this.onPanelHoveredChange();
		this.getSdpConfirmationWindow().close();
		this.getSdpListWindow().activate();
	}
	/**
	* Confirms and executes the queued cart rankups.
	*/
	onCartCheckoutConfirm() {
		const didCheckout = this.checkoutCart();
		if (didCheckout === false) {
			return;
		}
		this.hideModalDimmer();
		this.getSdpConfirmationWindow().close();
		this.getSdpConfirmationWindow().hide();
		this.getSdpListWindow().activate();
	}
	/**
	* If the player opts to cancel the upgrade process, return to the list window.
	*/
	onUpgradeCancel() {
		this.hideModalDimmer();
		const window = this.getSdpConfirmationWindow();
		window.close();
		window.hide();
		this.getSdpListWindow().activate();
	}
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* No initialization required for J-SDP on database load at this time;
* the passive detail window draws J-SDP data directly from the state note.
*/
J.SDP.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.SDP.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Map.js
/**
* Adds the functionality for calling the SDP menu from the JABS quick menu.
*/
J.SDP.Aliased.Scene_Map.set("createJabsAbsMenuMainWindow", Scene_Map.prototype.createJabsAbsMenuMainWindow);
Scene_Map.prototype.createJabsAbsMenuMainWindow = function() {
	J.SDP.Aliased.Scene_Map.get("createJabsAbsMenuMainWindow").call(this);
	const mainMenuWindow = this.getJabsMainListWindow();
	mainMenuWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};
/**
* Brings up the SDP menu.
*/
Scene_Map.prototype.commandSdp = function() {
	Scene_SDP.callScene();
};

//#endregion
//#region src/plugins/sdp/core/scenes/Scene_Menu.js
/**
* Hooks into the command window creation of the menu to add functionality for the SDP menu.
*/
J.SDP.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.SDP.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this._commandWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};
/**
* Brings up the SDP menu.
*/
Scene_Menu.prototype.commandSdp = function() {
	Scene_SDP.callScene();
};

//#endregion
//#region src/plugins/sdp/core/_metadata/pluginCommands.js
/**
* Plugin command for calling the SDP scene/menu.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Call SDP Menu", () => {
	Scene_SDP.callScene();
});
/**
* Plugin command for unlocking a SDP to be leveled.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Unlock SDP", (args) => {
	const { keys } = args;
	const panelKeys = JSON.parse(keys);
	panelKeys.forEach((key) => $gameParty.unlockSdp(key));
});
/**
* Plugin command for locking a SDP to no longer be available for the player.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Lock SDP", (args) => {
	const { keys } = args;
	const panelKeys = JSON.parse(keys);
	panelKeys.forEach((key) => $gameParty.lockSdp(key));
});
/**
* Plugin command for modifying an actor's SDP points.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify SDP points", (args) => {
	const { actorId, sdpPoints } = args;
	const parsedActorId = parseInt(actorId);
	const parsedSdpPoints = parseInt(sdpPoints);
	$gameActors.actor(parsedActorId).modSdpPoints(parsedSdpPoints);
});
/**
* Plugin command for modifying all current party members' SDP points.
*/
PluginManager.registerCommand(J.SDP.Metadata.name, "Modify party SDP points", (args) => {
	const { sdpPoints } = args;
	const parsedSdpPoints = parseInt(sdpPoints);
	$gameParty.members().forEach((member) => member.modSdpPoints(parsedSdpPoints));
});

//#endregion
//# sourceMappingURL=J-SDP.js.map