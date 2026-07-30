//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v3.0.1 ALLYAI] Grants your allies AI to fight alongside the player.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderBefore J-ABS-InputManager
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin grants party followers AI to fight alongside the player.
 * Ally behavior is governed by three orthogonal axes and a do-nothing toggle.
 *
 * This plugin requires JABS.
 * This plugin requires followers be enabled to do anything.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * All party members represented by followers on the field are granted AI for
 * action decision-making and movement positioning while in combat.
 *
 * Each ally's behavior is shaped by three independent axes:
 *
 *   RISK    (careful / balanced / reckless)
 *     Controls how aggressively the ally selects offensive skills.
 *     Careful allies lean on battle memories; reckless allies always press
 *     the strongest available skill.
 *
 *   SUPPORT (offense / balanced / support)
 *     Controls how much the ally weighs healing and buffing against offense.
 *     Support allies prioritize cleansing > healing > buffing before attacking.
 *     Balanced allies conditionally support when allies are in danger.
 *
 *   SPACING (frontline / midline / backline)
 *     Controls how close the ally positions itself relative to its target.
 *     Frontline allies close to melee range; backline allies hold at max skill
 *     range and maintain a shorter leash from the leader.
 *
 * The ten named presets snap all three axes to a coherent archetype:
 *   berserker  — reckless / offense  / frontline
 *   guardian   — careful  / offense  / frontline
 *   vanguard   — balanced / balanced / frontline
 *   war-priest — balanced / support  / frontline
 *   skirmisher — balanced / offense  / midline
 *   generalist — balanced / balanced / midline   (default)
 *   cleric     — careful  / support  / midline
 *   artillery  — careful  / offense  / backline
 *   wizard     — balanced / offense  / backline
 *   medic      — careful  / support  / backline
 *
 * A separate DO-NOTHING toggle overrides all axis behavior: the ally takes no
 * actions and backs away from all targets, staying near the leader.
 *
 * ============================================================================
 * DEFAULT ALLY AI PRESET:
 * Apply a tag to an actor or class to set their default preset on game start.
 * Class tags take priority over actor tags.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 *
 * TAG FORMAT:
 *  <defaultAi:PRESET>
 * Where PRESET is one of the ten preset keys listed above.
 *
 * EXAMPLE:
 *  <defaultAi:medic>
 * This ally defaults to the Medic preset (careful / support / backline).
 *
 * ----------------------------------------------------------------------------
 * BATTLE MEMORIES:
 * Allies accumulate battle memories as they fight. A memory records which
 * skills proved effective against a given enemy. Careful and balanced allies
 * use these memories to inform skill selection; reckless allies use them only
 * as a secondary signal when picking the strongest skill.
 *
 * AGGRO/PASSIVE TOGGLE:
 * A party-wide toggle controls engagement behavior. When Passive, allies only
 * fight when the leader attacks or when struck directly. When Aggressive,
 * allies engage any enemy that enters their sight range.
 *
 * ============================================================================
 * Caveats to note:
 * - When party-cycling, all allies will be pulled to the player and all aggro
 *   will be removed (so they don't just try to resume fighting).
 *
 * - When an ally is defeated, party-cycling will skip over them and they will
 *   follow the player like a normal non-battler follower.
 *
 * ============================================================================
 * CHANGELOG:
 * - 3.0.1
 *    Ally idle-check now also treats channeling as busy (J-ABS Channel).
 *    Fixed applyBattleMemories' inverted check; memories went unrecorded.
 *    Fixed jumpAll returning early instead of skipping just one follower.
 * - 3.0.0
 *    Replaced exclusive AI modes with three orthogonal behavior axes:
 *    risk (careful/balanced/reckless), support (offense/balanced/support),
 *    and spacing (frontline/midline/backline).
 *    Added ten named presets that snap all axes to a coherent archetype.
 *    Added per-ally do-nothing toggle (overrides all axes).
 *    Spacing axis now drives per-ally safe-distance thresholds and leash range.
 *    Removed dead modes: do-nothing (now a toggle), basic-attack, variety,
 *    full-force, support. Removed unused JABS_AllyAIMode class.
 * - 2.2.0
 *    Raised minimum J-ABS version to 4.10.0 (defensive dodge/guard coordination).
 *    Ally `JABS_AiManager` / battler paths updated for defensive interrupts and follower dodge behavior.
 * - 2.1.2
 *    decideAction and ally AI mode helpers now return a skill-id array, matching J-ABS 4.7.2.
 *    Raised minimum J-ABS version to 4.7.2.
 * - 2.1.1
 *    Raised minimum J-ABS version to 4.7.0.
 * - 2.1.0
 *    Raised minimum J-ABS version to 4.6.0.
 *    Delegates cleanse/heal/buff support logic to shared `JABS_AI` base methods (same behavior, less duplication).
 *    Fixed `aiComboChanceModifier` using `getMode().key` when `getMode()` already returns the mode key string.
 *    Fixed `bestFitHealingAllSkill` calling `bestFitHealingOneSkill` with no arguments on multi-heal fallback.
 *    Battle memory helpers now live on `JABS_AI`; `JABS_BattleMemory` class moved to J-ABS core.
 * - 2.0.1
 *    Consumed `RPGManager` update.
 * - 2.0.0
 *    Added a concept of "formations".
 *    Allies now own their own movement instead of mirroring the player.
 *    Added castbar visibility while casting (for allies).
 *    Changed rubberbanding to blink allies to the player instead of jump.
 * - 1.2.0
 *    Removed ally AI code from core JABS and added here.
 *    Fixed issue where battle memories were not correctly applied.
 * - 1.1.1
 *    Updated JABS menu integration with help text.
 * - 1.1.0
 *    Retroactively added this CHANGELOG.
 *    Upgraded AI to be able to leverage combos (enemy AI, too).
 *    Refactored code surrounding AI action decision-making.
 *    Refactored code surrounding ally AI assignment from command windows.
 *    Refactored code surrounding battler access and management.
 *    Refactored ally AI targeting.
 *    Removed dead code.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param menuConfigs
 * @text MENU DETAILS
 *
 * @param jabsMenuAllyAiCommandName
 * @parent menuConfigs
 * @type string
 * @text Menu Text
 * @desc The text displayed in the JABS quick menu for the ally ai command.
 * @default Manage Allies AI
 *
 * @param jabsMenuAllyAiCommandIconIndex
 * @parent menuConfigs
 * @type number
 * @text Menu Icon
 * @desc The icon displayed beside the above menu text.
 * @default 2564
 *
 * @param jabsMenuAllyAiCommandSwitchId
 * @parent menuConfigs
 * @type number
 * @text Menu Switch
 * @desc The control switch for whether or not the ally ai command displays in the menu.
 * @default 101
 *
 * @param partyConfigs
 * @text PARTY-WIDE DETAILS
 *
 * @param partyWidePassiveText
 * @parent partyConfigs
 * @type string
 * @text Party Passive Text
 * @desc The text displayed when the party-wide toggle is set to "passive".
 * @default Passive Enabled
 *
 * @param partyWidePassiveIconIndex
 * @parent partyConfigs
 * @type number
 * @text Party Passive Icon
 * @desc The icon indicating party-wide passive engagement is enabled.
 * @default 4
 *
 * @param partyWideAggressiveText
 * @parent partyConfigs
 * @type string
 * @text Party Aggressive Text
 * @desc The text displayed when the party-wide toggle is set to "aggressive".
 * @default Aggressive Enabled
 *
 * @param partyWideAggressiveIconIndex
 * @parent partyConfigs
 * @type number
 * @text Party Aggressive Icon
 * @desc The icon indicating party-wide aggressive engagement is enabled.
 * @default 15
 *
 * @param allyFormationsConfigs
 * @text ALLY FORMATIONS DETAILS
 *
 * @param allyFormationsCommandName
 * @parent allyFormationsConfigs
 * @type string
 * @text Formations Command Text
 * @desc The text displayed for the ally formations command in the party menu.
 * @default Ally Formations
 *
 * @param allyFormationsCommandIconIndex
 * @parent allyFormationsConfigs
 * @type number
 * @text Formations Command Icon
 * @desc The icon displayed beside the ally formations command.
 * @default 289
 *
 * @param aiModeConfigs
 * @text AI-MODE DETAILS
 *
 * @param aiModeEquipped
 * @parent aiModeConfigs
 * @type number
 * @text Mode Equipped Icon
 * @desc The icon indicating that the mode is equipped.
 * @default 91
 *
 * @param aiModeNotEquipped
 * @parent aiModeConfigs
 * @type number
 * @text Mode Not Equipped Icon
 * @desc The icon indicating that the mode is not equipped.
 * @default 95
 *
 *
 */

//#region src/plugins/abs/ext/allyai/_metadata/_pluginMetadata.js
var J_AllyAiPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps ally AI menu commands and formation defaults from plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		this.AllyAiCommandName = this.parsedPluginParameters["jabsMenuAllyAiCommandName"];
		this.AllyAiCommandIconIndex = Number(this.parsedPluginParameters["jabsMenuAllyAiCommandIconIndex"]);
		this.AllyAiCommandSwitchId = Number(this.parsedPluginParameters["jabsMenuAllyAiCommandSwitchId"]);
		this.PartyAiPassiveText = this.parsedPluginParameters["partyWidePassiveText"];
		this.PartyAiPassiveIconIndex = Number(this.parsedPluginParameters["partyWidePassiveIconIndex"]);
		this.PartyAiAggressiveText = this.parsedPluginParameters["partyWideAggressiveText"];
		this.PartyAiAggressiveIconIndex = Number(this.parsedPluginParameters["partyWideAggressiveIconIndex"]);
		this.AiModeEquippedIconIndex = Number(this.parsedPluginParameters["aiModeEquipped"]);
		this.AiModeNotEquippedIconIndex = Number(this.parsedPluginParameters["aiModeNotEquipped"]);
		this.AllyFormationsCommandName = this.parsedPluginParameters["allyFormationsCommandName"] || "Ally Formations";
		this.AllyFormationsCommandIconIndex = Number(this.parsedPluginParameters["allyFormationsCommandIconIndex"] || 289);
		this.FormationTolerance = .5;
		/**
		* All available formations that a party can take.
		* @type {JABS_Formation[]}
		*/
		this.FormationTypes = [
			{
				key: "fan-behind",
				name: "Rear Support",
				description: "The rear-wedge formation.\nAllies will fan out behind you for support.",
				formation: [
					[-1, -1],
					[1, -1],
					[0, -2],
					[-1, -2],
					[1, -2],
					[0, -4]
				],
				effects: []
			},
			{
				key: "flank-sides",
				name: "Wings",
				description: "A side- flank formation.\nAllies will flank you at either side to look extra menacing.",
				formation: [
					[-1, 0],
					[1, 0],
					[-2, 0],
					[2, 0],
					[-3, 0],
					[3, 0]
				],
				effects: []
			},
			{
				key: "close-circle",
				name: "Body Barricade",
				description: "The tight circle formation.\nNo one will get to most delicate squishy innard!",
				formation: [
					[0, 1],
					[1, 0],
					[0, -1],
					[-1, 0],
					[1, 1],
					[-1, 1],
					[1, -1],
					[-1, -1]
				],
				effects: []
			}
		];
		/**
		* The default formation type if none is selected.
		* @type {string}
		*/
		this.DefaultFormationType = this.FormationTypes[0].key;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.ALLYAI = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.ALLYAI.Metadata = new J_AllyAiPluginMetadata("J-ABS-AllyAI", "3.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.ALLYAI.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_Follower: new Map(),
	Game_Followers: new Map(),
	Game_Interpreter: new Map(),
	Game_Map: new Map(),
	Game_Party: new Map(),
	Game_Player: new Map(),
	JABS_AiManager: new Map(),
	JABS_Battler: new Map(),
	JABS_Engine: new Map(),
	Scene_Map: new Map(),
	Scene_Menu: new Map(),
	Spriteset_Map: new Map(),
	Window_AllyAiSelect: new Map(),
	Window_MenuCommand: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.ALLYAI.RegExp = {};
J.ABS.EXT.ALLYAI.RegExp.DefaultAi = /<defaultAi:(berserker|guardian|vanguard|war-priest|skirmisher|generalist|cleric|artillery|wizard|medic)>/i;

//#endregion
//#region src/plugins/abs/ext/allyai/_models/JABS_AllyAI.js
/**
* A class representing the AI-decision-making functionality for allies.
* Serialized into actor save data via {@link JsonEx}; registered so bundled restores keep prototype methods.
*/
var JABS_AllyAI = class JABS_AllyAI extends JABS_AI {
	/**
	* The risk axis controls how aggressively the ally selects offensive skills.
	*/
	static Risk = {
		/** Relies on known-effective skills; conservative fallback to random. */
		CAREFUL: 0,
		/** Balances memory-driven and random skill selection. */
		BALANCED: 1,
		/** Always presses the strongest available skill. */
		RECKLESS: 2
	};
	/**
	* The support axis controls how the ally weighs healing/buffing against offense.
	*/
	static Support = {
		/** Never deviates toward support skills. */
		OFFENSE: 0,
		/** Conditionally supports when allies are in danger. */
		BALANCED: 1,
		/** Prioritizes cleansing, healing, and buffing before offense. */
		SUPPORT: 2
	};
	/**
	* The spacing axis controls how close the ally positions itself relative to its target.
	*/
	static Spacing = {
		/** Closes to melee range; chases targets aggressively. */
		FRONTLINE: 0,
		/** Maintains a moderate distance from targets. */
		MIDLINE: 1,
		/** Stays at maximum skill range; avoids close combat. */
		BACKLINE: 2
	};
	/**
	* The close-distance threshold (in tiles) for each spacing axis value.
	* Allies back away from their target when inside this range.
	*/
	static CloseDistances = {
		[JABS_AllyAI.Spacing.FRONTLINE]: 1,
		[JABS_AllyAI.Spacing.MIDLINE]: 3,
		[JABS_AllyAI.Spacing.BACKLINE]: 5
	};
	/**
	* The far-distance threshold (in tiles) for each spacing axis value.
	* Allies move toward their target when beyond this range.
	*/
	static FarDistances = {
		[JABS_AllyAI.Spacing.FRONTLINE]: 2,
		[JABS_AllyAI.Spacing.MIDLINE]: 5,
		[JABS_AllyAI.Spacing.BACKLINE]: 7
	};
	/**
	* The leash multiplier for each spacing axis value.
	* Applied to {@link JABS_Battler.allyRubberbandRange} to derive per-ally leash distance.
	*/
	static LeashMultipliers = {
		[JABS_AllyAI.Spacing.FRONTLINE]: 1.5,
		[JABS_AllyAI.Spacing.MIDLINE]: 1,
		[JABS_AllyAI.Spacing.BACKLINE]: .6
	};
	/**
	* The close-distance threshold when do-nothing is active (very large so the ally always backs away).
	* @type {number}
	*/
	static DoNothingCloseDistance = 8;
	/**
	* The far-distance threshold when do-nothing is active.
	* @type {number}
	*/
	static DoNothingFarDistance = 10;
	/**
	* The leash multiplier when do-nothing is active (small so the ally stays near the leader).
	* @type {number}
	*/
	static DoNothingLeashMultiplier = .5;
	/**
	* All ten named presets available for ally AI configuration.
	* Each preset maps to a combination of risk, support, and spacing axis values.
	*/
	static presets = {
		BERSERKER: {
			key: "berserker",
			name: "Berserker",
			description: "Reckless melee aggressor.\nCharges in and hits as hard as possible at all times.",
			risk: JABS_AllyAI.Risk.RECKLESS,
			support: JABS_AllyAI.Support.OFFENSE,
			spacing: JABS_AllyAI.Spacing.FRONTLINE
		},
		GUARDIAN: {
			key: "guardian",
			name: "Guardian",
			description: "Careful frontline protector.\nStays in the thick of it but won't overextend.",
			risk: JABS_AllyAI.Risk.CAREFUL,
			support: JABS_AllyAI.Support.OFFENSE,
			spacing: JABS_AllyAI.Spacing.FRONTLINE
		},
		VANGUARD: {
			key: "vanguard",
			name: "Vanguard",
			description: "Balanced frontline fighter.\nA dependable melee ally who adapts to the situation.",
			risk: JABS_AllyAI.Risk.BALANCED,
			support: JABS_AllyAI.Support.BALANCED,
			spacing: JABS_AllyAI.Spacing.FRONTLINE
		},
		WAR_PRIEST: {
			key: "war-priest",
			name: "War Priest",
			description: "Frontline support hybrid.\nFights up close but keeps an eye on ally health.",
			risk: JABS_AllyAI.Risk.BALANCED,
			support: JABS_AllyAI.Support.SUPPORT,
			spacing: JABS_AllyAI.Spacing.FRONTLINE
		},
		SKIRMISHER: {
			key: "skirmisher",
			name: "Skirmisher",
			description: "Mobile midline attacker.\nFlexible and opportunistic; adapts to whatever is needed.",
			risk: JABS_AllyAI.Risk.BALANCED,
			support: JABS_AllyAI.Support.OFFENSE,
			spacing: JABS_AllyAI.Spacing.MIDLINE
		},
		GENERALIST: {
			key: "generalist",
			name: "Generalist",
			description: "Balanced all-rounder.\nA sensible default for allies without a defined specialty.",
			risk: JABS_AllyAI.Risk.BALANCED,
			support: JABS_AllyAI.Support.BALANCED,
			spacing: JABS_AllyAI.Spacing.MIDLINE
		},
		CLERIC: {
			key: "cleric",
			name: "Cleric",
			description: "Careful midline supporter.\nKeeps allies healthy from a moderate distance.",
			risk: JABS_AllyAI.Risk.CAREFUL,
			support: JABS_AllyAI.Support.SUPPORT,
			spacing: JABS_AllyAI.Spacing.MIDLINE
		},
		ARTILLERY: {
			key: "artillery",
			name: "Artillery",
			description: "Careful backline attacker.\nHangs back and fires from safety; never rushes in.",
			risk: JABS_AllyAI.Risk.CAREFUL,
			support: JABS_AllyAI.Support.OFFENSE,
			spacing: JABS_AllyAI.Spacing.BACKLINE
		},
		WIZARD: {
			key: "wizard",
			name: "Wizard",
			description: "Balanced backline attacker.\nDeals damage from range and pushes up when needed.",
			risk: JABS_AllyAI.Risk.BALANCED,
			support: JABS_AllyAI.Support.OFFENSE,
			spacing: JABS_AllyAI.Spacing.BACKLINE
		},
		MEDIC: {
			key: "medic",
			name: "Medic",
			description: "Careful backline support.\nStays well back and focuses on keeping the party alive.",
			risk: JABS_AllyAI.Risk.CAREFUL,
			support: JABS_AllyAI.Support.SUPPORT,
			spacing: JABS_AllyAI.Spacing.BACKLINE
		}
	};
	/**
	* Gets all valid preset objects.
	* @returns {object[]}
	*/
	static getPresets() {
		return Object.keys(JABS_AllyAI.presets).map((key) => JABS_AllyAI.presets[key]);
	}
	/**
	* Finds a preset object by its key string.
	* @param {string} key The preset key to look up.
	* @returns {object|null}
	*/
	static getPresetByKey(key) {
		return JABS_AllyAI.getPresets().find((preset) => preset.key === key) ?? null;
	}
	/**
	* Validates that the given key corresponds to a known preset.
	* @param {string} key The key to validate.
	* @returns {boolean}
	*/
	static validatePreset(key) {
		return JABS_AllyAI.getPresetByKey(key) !== null;
	}
	/**
	* Constructor.
	* @param {...*} args Forwarded to {@link #initialize}.
	*/
	constructor(...args) {
		super();
		this.initialize(...args);
	}
	/**
	* Initializes this ally AI with an optional starting preset.
	* @param {string} [presetKey] The preset key to apply on construction.
	*/
	initialize(presetKey) {
		this.initMembers();
		if (presetKey) {
			this.applyPreset(presetKey);
		}
	}
	/**
	* Initializes all default members of this class.
	*/
	initMembers() {
		/**
		* When true this ally takes no actions and backs away from all targets.
		* Overrides all axis behavior.
		* @type {boolean}
		*/
		this._doNothing = false;
		/**
		* The risk axis: how aggressively this ally picks offensive skills.
		* @type {number}
		*/
		this._risk = JABS_AllyAI.Risk.BALANCED;
		/**
		* The support axis: how much this ally weighs healing/buffing vs offense.
		* @type {number}
		*/
		this._support = JABS_AllyAI.Support.BALANCED;
		/**
		* The spacing axis: how close this ally positions itself relative to its target.
		* @type {number}
		*/
		this._spacing = JABS_AllyAI.Spacing.MIDLINE;
		/**
		* The key of the last applied preset, or the default preset key.
		* @type {string}
		*/
		this._presetKey = JABS_AllyAI.presets.GENERALIST.key;
		/**
		* The collection of memories this ally AI possesses.
		* @type {JABS_BattleMemory[]}
		*/
		this.memory = [];
	}
	/**
	* Gets the risk.
	* @returns {number} The risk.
	*/
	risk() {
		return this._risk;
	}
	/**
	* Sets the risk.
	* @param {number} newRisk The new risk.
	*/
	setRisk(newRisk) {
		this._risk = newRisk;
	}
	/**
	* Gets the support.
	* @returns {number} The support.
	*/
	support() {
		return this._support;
	}
	/**
	* Sets the support.
	* @param {number} newSupport The new support.
	*/
	setSupport(newSupport) {
		this._support = newSupport;
	}
	/**
	* Gets the spacing.
	* @returns {number} The spacing.
	*/
	spacing() {
		return this._spacing;
	}
	/**
	* Sets the spacing.
	* @param {number} newSpacing The new spacing.
	*/
	setSpacing(newSpacing) {
		this._spacing = newSpacing;
	}
	/**
	* Gets the preset key.
	* @returns {string} The presetKey.
	*/
	presetKey() {
		return this._presetKey;
	}
	/**
	* Sets the preset key.
	* @param {string} newPresetKey The new presetKey.
	*/
	setPresetKey(newPresetKey) {
		this._presetKey = newPresetKey;
	}
	/**
	* Gets whether this ally is in do-nothing mode.
	* @returns {boolean}
	*/
	isDoNothing() {
		return this._doNothing;
	}
	/**
	* Sets the do-nothing flag for this ally.
	* @param {boolean} doNothing True to enable do-nothing mode, false to disable.
	*/
	setDoNothing(doNothing) {
		this._doNothing = doNothing;
	}
	/**
	* Gets the current risk axis value.
	* @returns {number}
	*/
	getRisk() {
		return this.risk();
	}
	/**
	* Gets the current support axis value.
	* @returns {number}
	*/
	getSupport() {
		return this.support();
	}
	/**
	* Gets the current spacing axis value.
	* @returns {number}
	*/
	getSpacing() {
		return this.spacing();
	}
	/**
	* Gets the key of the currently applied preset.
	* @returns {string}
	*/
	getPresetKey() {
		return this.presetKey();
	}
	/**
	* Applies a preset by key, updating all three axes and the stored preset key.
	* @param {string} presetKey The key of the preset to apply.
	*/
	applyPreset(presetKey) {
		const preset = JABS_AllyAI.getPresetByKey(presetKey);
		if (!preset) {
			console.error(`Attempted to apply ally AI preset: [${presetKey}], but it is not a valid preset.`);
			return;
		}
		this.setRisk(preset.risk);
		this.setSupport(preset.support);
		this.setSpacing(preset.spacing);
		this.setPresetKey(preset.key);
	}
	/**
	* Gets the close-distance threshold in tiles for this ally's current spacing.
	* The ally backs away from its target when within this range.
	* @returns {number}
	*/
	getCloseDistance() {
		if (this.isDoNothing()) return JABS_AllyAI.DoNothingCloseDistance;
		return JABS_AllyAI.CloseDistances[this.spacing()];
	}
	/**
	* Gets the far-distance threshold in tiles for this ally's current spacing.
	* The ally moves toward its target when beyond this range.
	* @returns {number}
	*/
	getFarDistance() {
		if (this.isDoNothing()) return JABS_AllyAI.DoNothingFarDistance;
		return JABS_AllyAI.FarDistances[this.spacing()];
	}
	/**
	* Gets the leash multiplier for this ally's current spacing.
	* Applied to the base rubber-band range to derive the per-ally leash distance.
	* @returns {number}
	*/
	getLeashMultiplier() {
		if (this.isDoNothing()) return JABS_AllyAI.DoNothingLeashMultiplier;
		return JABS_AllyAI.LeashMultipliers[this.spacing()];
	}
	/**
	* Wraps a base support helper result (0 means none) as a uniform skill-id list.
	* @param {number} skillId The skill id driving this step.
	* @returns {number[]}
	*/
	wrapSupportSkillId(skillId) {
		if (!skillId) return [];
		return [skillId];
	}
	/**
	* Decides an action based on this battler's axes, the target, and the available skills.
	* @param {JABS_Battler} user The battler of the AI deciding a skill.
	* @param {JABS_Battler} target The target battler to decide an action against.
	* @param {number[]} availableSkills A collection of all skill ids to potentially pick from.
	* @returns {number[]} Exactly one skill id, or empty when no valid choice exists.
	*/
	decideAction(user, target, availableSkills) {
		if (this.isDoNothing()) return this.decideDoNothing(user);
		const usableSkills = this.filterUncastableSkills(user, availableSkills);
		if (this.shouldFollowWithCombo(user)) return [this.followWithCombo(user)];
		switch (this.support()) {
			case JABS_AllyAI.Support.SUPPORT: return this.decideSupportFirst(usableSkills, user, target);
			case JABS_AllyAI.Support.BALANCED: return this.decideBalancedSupport(usableSkills, user, target);
			case JABS_AllyAI.Support.OFFENSE:
			default: return this.decideOffense(usableSkills, user, target);
		}
	}
	/**
	* Decides to do nothing and waits briefly before reconsidering.
	* @param {JABS_Battler} user The battler doing nothing.
	* @returns {number[]}
	*/
	decideDoNothing(user) {
		user.setWaitCountdown(20);
		return [];
	}
	/**
	* Prioritizes cleansing, healing, and buffing allies before falling through to cautious offense.
	* Used when the support axis is {@link JABS_AllyAI.Support.SUPPORT}.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideSupportFirst(usableSkills, user, target) {
		const cleansePick = this.wrapSupportSkillId(this.decideCleansing(user, usableSkills));
		if (cleansePick.length) return cleansePick;
		const healPick = this.wrapSupportSkillId(this.decideHealing(user, usableSkills));
		if (healPick.length) return healPick;
		const buffPick = this.wrapSupportSkillId(this.decideBuffing(user, usableSkills));
		if (buffPick.length) return buffPick;
		return this.decideCautiousOffense(usableSkills, user, target);
	}
	/**
	* Conditionally supports allies when in danger, otherwise proceeds to offense.
	* Used when the support axis is {@link JABS_AllyAI.Support.BALANCED}.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideBalancedSupport(usableSkills, user, target) {
		const nearbyAllies = user.getAllNearbyAllies();
		const anyInDanger = nearbyAllies.some((ally) => ally.getBattler().currentHpPercent() < .6);
		if (anyInDanger && RPGManager.chanceIn100(50)) {
			const supportPick = this.decideSupportFirst(usableSkills, user, target);
			if (supportPick.length) return supportPick;
		}
		return this.decideOffense(usableSkills, user, target);
	}
	/**
	* Dispatches to the appropriate offense behavior based on the risk axis.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideOffense(usableSkills, user, target) {
		if (!usableSkills.length) return [];
		switch (this.risk()) {
			case JABS_AllyAI.Risk.RECKLESS: return this.decideRecklessOffense(usableSkills, user, target);
			case JABS_AllyAI.Risk.CAREFUL: return this.decideCautiousOffense(usableSkills, user, target);
			case JABS_AllyAI.Risk.BALANCED:
			default: return this.decideBalancedOffense(usableSkills, user, target);
		}
	}
	/**
	* Always presses the strongest available skill, using battle memories as a secondary signal.
	* Used when the risk axis is {@link JABS_AllyAI.Risk.RECKLESS}.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideRecklessOffense(usableSkills, user, target) {
		const strongestSkillId = this.determineStrongestSkill(usableSkills, user, target);
		const memoriesOfTarget = this.memory.filter((mem) => mem.battlerId === target.getBattlerId());
		if (memoriesOfTarget.length) {
			const effectiveSkills = this.filterMemoriesByEffectiveness(usableSkills, memoriesOfTarget);
			if (effectiveSkills.length === 1 && effectiveSkills[0] !== strongestSkillId) {
				const chosen = RPGManager.chanceIn100(50) ? strongestSkillId : effectiveSkills[0];
				return this.isSkillIdValid(chosen) ? [chosen] : [];
			}
			if (effectiveSkills.length > 1) {
				const chosen = effectiveSkills[Math.randomInt(effectiveSkills.length)];
				return this.isSkillIdValid(chosen) ? [chosen] : [];
			}
		}
		return this.isSkillIdValid(strongestSkillId) ? [strongestSkillId] : [];
	}
	/**
	* Balances memory-driven skill choices with randomness.
	* Used when the risk axis is {@link JABS_AllyAI.Risk.BALANCED}.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideBalancedOffense(usableSkills, user, target) {
		const memoriesOfTarget = this.memory.filter((mem) => mem.battlerId === target.getBattlerId());
		let tempSkills = usableSkills;
		if (memoriesOfTarget.length) {
			tempSkills = this.filterMemoriesByEffectiveness(usableSkills, memoriesOfTarget);
		}
		let chosenSkillId;
		if (tempSkills.length === 0) {
			chosenSkillId = usableSkills[Math.randomInt(usableSkills.length)];
		} else if (tempSkills.length === 1) {
			chosenSkillId = RPGManager.chanceIn100(50) ? tempSkills[0] : usableSkills[Math.randomInt(usableSkills.length)];
		} else {
			chosenSkillId = tempSkills[Math.randomInt(tempSkills.length)];
		}
		return this.isSkillIdValid(chosenSkillId) ? [chosenSkillId] : [];
	}
	/**
	* Relies heavily on battle memories, falling back to random only when none exist.
	* Used when the risk axis is {@link JABS_AllyAI.Risk.CAREFUL}.
	* @param {number[]} usableSkills The skill ids available to choose from.
	* @param {JABS_Battler} user The battler choosing the skill.
	* @param {JABS_Battler} target The targeted battler.
	* @returns {number[]}
	*/
	decideCautiousOffense(usableSkills, user, target) {
		if (!usableSkills.length) return [];
		const memoriesOfTarget = this.memory.filter((mem) => mem.battlerId === target.getBattlerId());
		if (memoriesOfTarget.length) {
			const effectiveSkills = this.filterMemoriesByEffectiveness(usableSkills, memoriesOfTarget);
			if (effectiveSkills.length) {
				const chosen = effectiveSkills[Math.randomInt(effectiveSkills.length)];
				return this.isSkillIdValid(chosen) ? [chosen] : [];
			}
		}
		const chosen = usableSkills[Math.randomInt(usableSkills.length)];
		return this.isSkillIdValid(chosen) ? [chosen] : [];
	}
};
SerializableRegistry.register(JABS_AllyAI);

//#endregion
//#region src/plugins/abs/ext/allyai/_models/JABS_Battler.js
/**
* Generates a `JABS_Battler` for an actor ally bound to a follower character.
* Uses the actor's own core configuration.
* @param {Game_Follower} follower The follower character representing this ally on the map.
* @param {Game_Actor} actor The underlying actor battler.
* @returns {JABS_Battler} The built ally battler.
*/
JABS_Battler.createAlly = function(follower, actor) {
	if (!follower || !actor) return null;
	const coreData = JABS_BattlerCoreData.Builder().setBattler(actor).build();
	return new JABS_Battler(follower, actor, coreData);
};
/**
* Extends the engagement determination to handle aggro/passive party toggling.
* @param {JABS_Battler} target The target to see if we should engage with.
* @returns {boolean}
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set("shouldEngage", JABS_Battler.prototype.shouldEngage);
JABS_Battler.prototype.shouldEngage = function(target, distance) {
	if (this.isEnemy()) {
		return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("shouldEngage").call(this, target, distance);
	}
	if ($gameParty.isAggro() && !target.isInanimate()) {
		return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("shouldEngage").call(this, target, distance);
	}
	return this.shouldAllyEngage(target, distance);
};
/**
* Determines whether or not the ally should engage in combat with the target.
* @param {JABS_Battler} target The target to potentially engage with.
* @param {number} distance The distance from this battler to the nearest potential target.
* @returns {boolean} True if this ally should engage in combat, false otherwise.
*/
JABS_Battler.prototype.shouldAllyEngage = function(target, distance) {
	const allyAI = this.getAllyAiMode();
	if (allyAI && allyAI.isDoNothing()) return false;
	if (target.isInanimate()) return false;
	if (!this.inSightRange(target, distance)) return false;
	const isAlerted = this.isAlerted();
	const playerHitSomething = $jabsEngine.getPlayer1().hasBattlerLastHit();
	const shouldEngage = isAlerted || playerHitSomething;
	return shouldEngage;
};
/**
* Gets all allies to this battler within a large range.
* (Not map-wide because that could result in unexpected behavior)
* @returns {JABS_Battler[]}
*/
JABS_Battler.prototype.getAllNearbyAllies = function() {
	return JABS_AiManager.getAlliedBattlersWithinRange(this, JABS_Battler.allyRubberbandRange());
};
/**
* Gets the ally ai associated with this battler.
* @returns {JABS_AllyAI}
*/
JABS_Battler.prototype.getAllyAiMode = function() {
	if (this.isEnemy()) return null;
	return this.getBattler().getAllyAI();
};
/**
* Gets the close-distance threshold in tiles for this battler.
* Enemies use the global default; allies delegate to their spacing axis.
* @returns {number}
*/
JABS_Battler.prototype.getCloseDistance = function() {
	if (this.isEnemy()) return JABS_Battler.closeDistance;
	const allyAI = this.getAllyAiMode();
	if (!allyAI) return JABS_Battler.closeDistance;
	return allyAI.getCloseDistance();
};
/**
* Gets the far-distance threshold in tiles for this battler.
* Enemies use the global default; allies delegate to their spacing axis.
* @returns {number}
*/
JABS_Battler.prototype.getFarDistance = function() {
	if (this.isEnemy()) return JABS_Battler.farDistance;
	const allyAI = this.getAllyAiMode();
	if (!allyAI) return JABS_Battler.farDistance;
	return allyAI.getFarDistance();
};
/**
* Gets the leash range for this ally battler.
* Applies the spacing-axis leash multiplier to the base rubber-band range.
* @returns {number}
*/
JABS_Battler.prototype.getAllyLeashRange = function() {
	const allyAI = this.getAllyAiMode();
	if (!allyAI) return JABS_Battler.allyRubberbandRange();
	return JABS_Battler.allyRubberbandRange() * allyAI.getLeashMultiplier();
};
/**
* Applies the battle memory to the battler.
* Only applicable to allies (for now).
* @param {JABS_BattleMemory} newMemory The new memory to apply to this battler.
*/
JABS_Battler.prototype.applyBattleMemories = function(newMemory) {
	if (this.isEnemy()) return;
	return this.getBattler().getAllyAI().applyMemory(newMemory);
};

//#endregion
//#region src/plugins/abs/ext/allyai/_models/JABS_Formation.js
/**
* The structure of a party formation in JABS.
*/
var JABS_Formation = class {
	/**
	* The name of the formation.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The description of the formation for use when reviewing formations.
	* @type {string}
	*/
	description = String.empty;
	/**
	* A collection of the x,y coordinates of each ally relative to the leader and their facing.
	* @type {[number[]]}
	*/
	formation = [];
	/**
	* A collection of the effects applied to the party while this formation is active.
	* @type {any[]}
	*/
	effects = [];
	/**
	* Constructor.
	* @param {string} name The name of this formation.
	* @param {string} description The description of this formation to display to the player.
	* @param {[number[]]} formation The array of positions for allies representing the formation.
	* @param {any[]=} effects The additional effects applied when this formation is active.
	*/
	constructor(name, description, formation, effects = []) {
		this.name = name;
		this.description = description;
		this.formation = formation;
		this.effects = effects;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/managers/JABS_AiManager.js
/**
* Extends {@link #executeAi}.<br/>
* Enforces a functional leash for keeping ally battlers close in the execute loop.
* @param {JABS_Battler} battler The battler executing on the AI mode.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set("executeAi", JABS_AiManager.executeAi);
JABS_AiManager.executeAi = function(battler) {
	if (battler.isActor()) {
		const leader = $jabsEngine.getPlayer1();
		if (this.maintainLeashAndEngagement(battler, leader)) return;
	}
	J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get("executeAi").call(this, battler);
};
/**
* Extends {@link #aiPhase0}.<br/>
* Also accommodates the possibility of actors having an idle phase.
* @param {JABS_Battler} battler The batter to decide for.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set("aiPhase0", JABS_AiManager.aiPhase0);
JABS_AiManager.aiPhase0 = function(battler) {
	if (battler.isEnemy()) {
		J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get("aiPhase0").call(this, battler);
	} else {
		this.allyAiPhase0(battler);
	}
};
/**
* Decides what to do for allies in their idle phase.
* When not alerted/engaged, allies follow the leader in a loose formation.
* @param {JABS_Battler} allyBattler The ally battler.
*/
JABS_AiManager.allyAiPhase0 = function(allyBattler) {
	this.enforceFollowerThroughPolicy(allyBattler);
	if (!this.canPerformAllyPhase0(allyBattler)) return;
	const allyAI = allyBattler.getAllyAiMode();
	const isDoNothing = allyAI && allyAI.isDoNothing();
	if (!isDoNothing && allyBattler.isAlerted()) {
		this.seekForAlerter(allyBattler);
		return;
	}
	this.allyFollowLeader(allyBattler);
};
/**
* Enforces the passability policy for JABS-controlled followers.
* While gathering, allow through (vanilla regroup). Otherwise, disable through so
* AI-driven movement respects terrain.
* @param {JABS_Battler} allyBattler The follower battler.
*/
JABS_AiManager.enforceFollowerThroughPolicy = function(allyBattler) {
	const chr = allyBattler.getCharacter();
	if (!chr || !chr.isFollower()) return;
	const followers = $gamePlayer.followers();
	const isGathering = followers && followers.areGathering();
	if (isGathering) {
		chr.setThrough(true);
		return;
	}
	chr.setThrough(false);
};
/**
* Determines whether or not the ally can do phase 0 things.
* @param {JABS_Battler} allyBattler The ally battler.
* @returns {boolean} True if this ally can do phase 0 things, false otherwise.
*/
JABS_AiManager.canPerformAllyPhase0 = function(allyBattler) {
	if (allyBattler.isCastingOrChanneling()) return false;
	if (allyBattler.isEngaged()) return false;
	return true;
};
/**
* Causes an ally to follow their leader (player1) intelligently while idle.
* Uses a small formation offset per follower index, a leash, and keeps spacing.
* @param {JABS_Battler} allyBattler The ally battler to reposition.
*/
JABS_AiManager.allyFollowLeader = function(allyBattler) {
	const leader = $jabsEngine.getPlayer1();
	if (!leader) return;
	if (this.maintainLeashAndEngagement(allyBattler, leader)) return;
	if (!allyBattler.canBattlerMove()) return;
	const followerIndex = this.getFollowerIndexFromBattler(allyBattler);
	const formationType = $gameParty.getPartyFormation();
	const coords = this.computeFormationTarget(leader, followerIndex, formationType);
	const [desiredX, desiredY] = coords;
	this.moveTowardSlotIfNeeded(allyBattler, desiredX, desiredY);
};
/**
* Applies leash rules to keep allies reasonably near the leader.
* Returns true if a corrective action (like jump) occurred this frame.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {JABS_Battler} leaderBattler The leader battler.
* @returns {boolean} True if a corrective action occurred, false otherwise.
*/
JABS_AiManager.maintainLeashAndEngagement = function(allyBattler, leaderBattler) {
	const distanceToLeader = $gameMap.distance(allyBattler.getCharacter()._realX, allyBattler.getCharacter()._realY, leaderBattler.getCharacter()._realX, leaderBattler.getCharacter()._realY);
	const leash = allyBattler.getAllyLeashRange();
	if (distanceToLeader > leash) {
		this.rubberbandAlly(allyBattler);
		return true;
	}
	if (distanceToLeader <= Math.round(leash / 2)) {
		allyBattler.unlockEngagement();
	}
	return false;
};
/**
* Rubber bands the ally back to the leader/player.
* @param {JABS_Battler} allyBattler The ally battler to rubber band.
*/
JABS_AiManager.rubberbandAlly = function(allyBattler) {
	allyBattler.lockEngagement();
	allyBattler.disengageTarget();
	allyBattler.resetAllAggro(null, true);
	const allyCharacter = allyBattler.getCharacter();
	const leader = $jabsEngine.getPlayer1();
	const lx = Math.floor(leader.getX());
	const ly = Math.floor(leader.getY());
	allyCharacter.locate(lx, ly);
};
/**
* Resolves the follower index for a battler bound to a Game_Follower.
* @param {JABS_Battler} allyBattler The ally battler to resolve index for.
* @returns {number} The zero-based follower index; -1 if not found.
*/
JABS_AiManager.getFollowerIndexFromBattler = function(allyBattler) {
	const character = allyBattler.getCharacter();
	if (!character || !character.isFollower()) return -1;
	const followers = $gamePlayer.followers().data();
	return followers.indexOf(character);
};
/**
* Computes the absolute map tile for a follower’s formation slot.
* Offsets are defined assuming the leader faces DOWN (2); they will be rotated to match current facing.
* @param {JABS_Battler} leaderBattler The leader battler.
* @param {number} followerIndex The index of the follower (0-based).
* @param {string} formationType The formation type key.
* @returns {[number, number]} The [x, y] tile target for this follower.
*/
JABS_AiManager.computeFormationTarget = function(leaderBattler, followerIndex, formationType) {
	const idx = Math.max(0, followerIndex);
	const offsets = this.getFormationOffsets(formationType);
	const chosen = offsets[idx % offsets.length];
	const [ox, oy] = chosen;
	const dir = leaderBattler.getCharacter().direction();
	const rotated = this.rotateOffsetForFacing(ox, oy, dir);
	const [rx, ry] = rotated;
	const lx = Math.floor(leaderBattler.getX());
	const ly = Math.floor(leaderBattler.getY());
	return this.calculateFormationSlotCoordinates(lx, rx, ly, ry);
};
/**
* Gets the array of [x,y] tile offsets for the requested formation type.
* Offsets are relative to the leader's current tile.
* @param {string} formationKey The formation type key.
* @returns {number[][]} The list of offsets.
*/
JABS_AiManager.getFormationOffsets = function(formationKey) {
	const foundFormation = J.ABS.EXT.ALLYAI.Metadata.FormationTypes.find((formation) => formation.key === formationKey) ?? J.ABS.EXT.ALLYAI.Metadata.FormationTypes[0];
	return foundFormation.formation;
};
/**
* Calculates the formation slot's coordinates based on the given parameters.
* @param {number} lx The leader's x coordinate.
* @param {number} rx The rotated x.
* @param {number} ly The leader's y coordinate.
* @param {number} ry The rotated y.
* @returns {[number, number]}
*/
JABS_AiManager.calculateFormationSlotCoordinates = function(lx, rx, ly, ry) {
	const sx = lx + rx;
	const sy = ly + ry;
	return [sx, sy];
};
/**
* Rotates a baseline offset [ox, oy] (assumed for leader facing DOWN) into the space of the given facing.
* Directions follow RMMZ standard: 2=down, 4=left, 6=right, 8=up.
* @param {number} ox The baseline x-offset (facing DOWN).
* @param {number} oy The baseline y-offset (facing DOWN).
* @param {2|4|6|8} dir The leader's current facing direction.
* @returns {[number, number]} The rotated offset [x, y].
*/
JABS_AiManager.rotateOffsetForFacing = function(ox, oy, dir) {
	switch (dir) {
		case 2: return [ox, oy];
		case 4: return [-oy, ox];
		case 6: return [oy, -ox];
		case 8: return [-ox, -oy];
		default: return [ox, oy];
	}
};
/**
* Issues a smart move toward the designated slot if outside tolerance and able to move.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {number} desiredX The desired slot x.
* @param {number} desiredY The desired slot y.
*/
JABS_AiManager.moveTowardSlotIfNeeded = function(allyBattler, desiredX, desiredY) {
	if (allyBattler.isDodging()) {
		return;
	}
	if (allyBattler.guarding()) {
		return;
	}
	const tolerance = J.ABS.EXT.ALLYAI.Metadata.FormationTolerance;
	if (this.isWithinTolerance(allyBattler, desiredX, desiredY, tolerance)) return;
	const character = allyBattler.getCharacter();
	if (character.isMoving()) return;
	if (allyBattler.canBattlerMove()) {
		allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);
	}
};
/**
* Checks if a battler is within a Manhattan tolerance of the target tile.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {number} targetX The target x tile.
* @param {number} targetY The target y tile.
* @param {number} tolerance The allowed range before moving.
* @returns {boolean} True if within tolerance, false otherwise.
*/
JABS_AiManager.isWithinTolerance = function(allyBattler, targetX, targetY, tolerance) {
	const chr = allyBattler.getCharacter();
	const dx = chr.x - targetX;
	const dy = chr.y - targetY;
	const dist = Math.sqrt(dx * dx + dy * dy);
	return dist <= tolerance;
};
/**
* Extends {@link #maintainSafeDistance}.<br/>
* Allies use spacing-axis-driven close/far thresholds instead of the global constants.
* @param {JABS_Battler} battler The battler to reposition.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set("maintainSafeDistance", JABS_AiManager.maintainSafeDistance);
JABS_AiManager.maintainSafeDistance = function(battler) {
	if (battler.isEnemy()) {
		J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get("maintainSafeDistance").call(this, battler);
		return;
	}
	const distance = battler.distanceToCurrentTarget();
	const closeDistance = battler.getCloseDistance();
	const farDistance = battler.getFarDistance();
	if (distance <= closeDistance) {
		battler.smartMoveAwayFromTarget();
	} else if (distance > farDistance) {
		battler.smartMoveTowardTarget();
	} else {}
};
/**
* Extends {@link #decideAiPhase2Action}.<br/>
* Includes handling ally AI as well as enemy.
* @param {JABS_Battler} battler The battler deciding the action.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.set("decideAiPhase2Action", JABS_AiManager.decideAiPhase2Action);
JABS_AiManager.decideAiPhase2Action = function(battler) {
	if (battler.isEnemy()) {
		J.ABS.EXT.ALLYAI.Aliased.JABS_AiManager.get("decideAiPhase2Action").call(this, battler);
	} else {
		this.decideAllyAiPhase2Action(battler);
	}
};
/**
* The ally battler decides what action to take.
* Based on it's AI traits, it will make a decision on an action to take.
* @param {JABS_Battler} jabsBattler The ally battler deciding the action.
*/
JABS_AiManager.decideAllyAiPhase2Action = function(jabsBattler) {
	const battler = jabsBattler.getBattler();
	const validSkillSlots = battler.getValidSkillSlotsForAlly();
	const currentlyEquippedSkillIds = validSkillSlots.map((skillSlot) => skillSlot.id).filter((skillId) => !JABS_Battler.isGuardSkillById(skillId));
	const decidedPicks = jabsBattler.getAllyAiMode().decideAction(jabsBattler, jabsBattler.getTarget(), currentlyEquippedSkillIds);
	if (decidedPicks.length === 0 || !this.isSkillIdValid(decidedPicks[0])) {
		this.cancelActionSetup(jabsBattler);
		return;
	}
	const [decidedSkillId] = decidedPicks;
	if (JABS_Battler.isDodgeSkillById(decidedSkillId)) {
		this.cancelActionSetup(jabsBattler);
		return;
	}
	if (JABS_Battler.isGuardSkillById(decidedSkillId)) {
		this.cancelActionSetup(jabsBattler);
		return;
	}
	const decidedSkillSlot = battler.findSlotForSkillId(decidedSkillId);
	const cooldownKey = decidedSkillSlot.key;
	this.setupActionForNextPhase(jabsBattler, decidedSkillId, cooldownKey);
};

//#endregion
//#region src/plugins/abs/ext/allyai/managers/JABS_Engine.js
/**
* Whether or not there is a request issued for rendering refreshed allies.
* @type {boolean}
*/
Object.defineProperty(JABS_Engine.prototype, "requestAlliesRefresh", {
	value: false,
	writeable: true
});
/**
* Extends {@link JABS_Engine.prePartyCycling}.<br/>
* Jumps all followers to the player upon party cycling.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("prePartyCycling", JABS_Engine.prototype.prePartyCycling);
JABS_Engine.prototype.prePartyCycling = function() {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("prePartyCycling").call(this);
	$gamePlayer.jumpFollowersToMe();
};
/**
* Overwrites {@link JABS_Engine.handlePartyCycleMemberChanges}.<br/>
* Jumps all followers to the player upon party cycling.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("handlePartyCycleMemberChanges", JABS_Engine.prototype.handlePartyCycleMemberChanges);
JABS_Engine.prototype.handlePartyCycleMemberChanges = function() {
	const formerLeader = $gameParty.leaderJabsBattler();
	if (formerLeader) {
		JABS_AiManager.removeBattler(formerLeader);
	}
	J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("handlePartyCycleMemberChanges").call(this);
	$jabsEngine.requestAlliesRefresh = true;
};
/**
* Extends {@link JABS_Engine.continuedPrimaryBattleEffects}.<br/>
* Also applies battle memories as-necessary.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("continuedPrimaryBattleEffects", JABS_Engine.prototype.continuedPrimaryBattleEffects);
JABS_Engine.prototype.continuedPrimaryBattleEffects = function(action, target) {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("continuedPrimaryBattleEffects").call(this, action, target);
	const result = target.getBattler().result();
	this.applyBattleMemories(result, action, target);
};
/**
* Applies battle memories against the target based on the action being impacted.
* @param result
* @param action
* @param target
*/
JABS_Engine.prototype.applyBattleMemories = function(result, action, target) {
	if (!this.canApplyBattleMemories(target)) return;
	const newMemory = new JABS_BattleMemory(target.getBattlerId(), action.getBaseSkill().id, action.getAction().calculateRawElementRate(target.getBattler()), result.hpDamage);
	const attacker = action.getCaster();
	attacker.applyBattleMemories(newMemory);
};
/**
* Determines whether or not battle memories should be applied to the target.
* @param {JABS_Battler} target The target battler to potentially apply abttle memories to.
* @returns {boolean}
*/
JABS_Engine.prototype.canApplyBattleMemories = function(target) {
	if (target.isEnemy()) return false;
	return true;
};
/**
* Rebuilds all actor allies bound to followers after party cycling.
* Ensures ex-leaders (now followers) regain proper ally core (sight/pursuit) and
* are bound to their follower characters for correct isPlayer/isFollower state.
*/
JABS_Engine.prototype.rebuildActorAllies = function() {
	const followers = $gamePlayer.followers().data();
	const allyBattlers = JABS_AiManager.convertFollowersToBattlers(followers);
	JABS_AiManager.addOrUpdateBattlers(allyBattlers);
};
/**
* Extends {@link #postPartyCycling}.<br/>
* Also rebuilds allies so they can be correctly aligned with the proper battler data.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("postPartyCycling", JABS_Engine.prototype.postPartyCycling);
JABS_Engine.prototype.postPartyCycling = function() {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("postPartyCycling").call(this);
	this.rebuildActorAllies();
};
/**
* Extends {@link JABS_Engine#canBeAlerted}.<br/>
* Do-nothing allies cannot be alerted; they ignore attacks passively.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("canBeAlerted", JABS_Engine.prototype.canBeAlerted);
JABS_Engine.prototype.canBeAlerted = function(attacker, battler) {
	if (!J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("canBeAlerted").call(this, attacker, battler)) return false;
	if (battler.isActor()) {
		const allyAI = battler.getAllyAiMode();
		if (allyAI && allyAI.isDoNothing()) return false;
	}
	return true;
};

//#endregion
//#region src/plugins/abs/ext/allyai/managers/JABS_SkillSlotManager.js
/**
* Gets all skill slots that have a skill assigned.
* @returns {JABS_SkillSlot[]}
*/
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function() {
	const invalidAllySlots = [JABS_Button.Tool, JABS_Button.Dodge];
	return this.getEquippedSlots().filter((skillSlot) => !invalidAllySlots.includes(skillSlot.key));
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also tracks JABS ally AI.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get("initMembers").call(this);
	this.initAllyAiMembers();
};
/**
* Initializes all members associated with the JABS extension of Ally AI.
*/
Game_Actor.prototype.initAllyAiMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._abs ||= {};
	/**
	* A grouping of all properties associated with the ally AI extension.
	*/
	this._j._abs._allyAi ||= {};
	/**
	* The currently selected Ally AI mode.
	* @type {JABS_AllyAI|null}
	*/
	this._j._abs._allyAi._mode = new JABS_AllyAI(JABS_AllyAI.presets.GENERALIST.key);
};
/**
* Extends {@link #setup}.<br/>
* Also initializes ally AI.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Actor.set("setup", Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId) {
	J.ABS.EXT.ALLYAI.Aliased.Game_Actor.get("setup").call(this, actorId);
	this.initAllyAI();
};
/**
* Initializes the ally ai for this battler.
*/
Game_Actor.prototype.initAllyAI = function() {
	const defaultAllyAiMode = this.getDefaultAllyAI();
	this.setAllyAIPreset(defaultAllyAiMode);
};
/**
* Get the current ally AI mode for this ally.
* @returns {JABS_AllyAI}
*/
Game_Actor.prototype.getAllyAI = function() {
	if (!this._j._abs._allyAi) {
		this.initAllyAiMembers();
	}
	return this.mode();
};
/**
* Applies an ally AI preset to this ally by preset key.
* @param {string} presetKey The key of the preset to apply.
*/
Game_Actor.prototype.setAllyAIPreset = function(presetKey) {
	this.mode().applyPreset(presetKey);
};
/**
* Gets the default ally AI mode associated with an actor.
* The priority for the AI mode is class > actor > default.
* @returns {string}
*/
Game_Actor.prototype.getDefaultAllyAI = function() {
	if (!this.actorId()) return null;
	const actorMode = RPGManager.getStringFromNoteByRegex(this.actor(), J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);
	const classMode = RPGManager.getStringFromNoteByRegex(this.currentClass(), J.ABS.EXT.ALLYAI.RegExp.DefaultAi, true);
	const allyAiMode = classMode ?? actorMode;
	if (JABS_AllyAI.validatePreset(allyAiMode)) {
		return allyAiMode;
	}
	return JABS_AllyAI.presets.GENERALIST.key;
};
/**
* Gets all skill slots that have skills assigned to them- excluding the tool slot.
* @returns {JABS_SkillSlot[]}
*/
Game_Actor.prototype.getValidSkillSlotsForAlly = function() {
	return this.getSkillSlotManager().getEquippedAllySlots();
};
/**
* Gets the ally AI mode governing how this actor fights on its own.
* @returns {string} The configured ally AI mode.
*/
Game_Actor.prototype.mode = function() {
	return this._j._abs._allyAi._mode;
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Follower.js
/**
* Extends {@link #chaseCharacter}.<br/>
* Adjust the chaseCharacter function to prevent chasing the player
* while this follower is engaged.
* @param {Game_Character} character The character this follower is following.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set("chaseCharacter", Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character) {
	if (!this.canObeyJabsAi()) {
		J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get("chaseCharacter").call(this, character);
	}
};
/**
* Determines whether or not this follower should be controlled by the {@link JABS_AiManager}.<br>
* @returns {boolean} True if this follower should be controlled, false otherwise.
*/
Game_Follower.prototype.canObeyJabsAi = function() {
	if (!this.isVisible()) return false;
	if (!this.getJabsBattler()) return false;
	return true;
};
/**
* Extends {@link #setDirectionFix}.<br/>
* Allows JABS to prevent the direction fix from applying as-needed.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set("setDirectionFix", Game_Follower.prototype.setDirectionFix);
Game_Follower.prototype.setDirectionFix = function(isDirectionFixed) {
	const battler = this.getJabsBattler();
	if (!battler) {
		J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get("setDirectionFix").call(this, isDirectionFixed);
		return;
	}
	if (battler.isEngaged() || !$gameMap._interpreter.isRunning()) return;
	J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get("setDirectionFix").call(this, isDirectionFixed);
};
/**
* Jump to the player from wherever you are.
*/
Game_Follower.prototype.jumpToPlayer = function() {
	const sx = $gamePlayer.deltaXFrom(this.x);
	const sy = $gamePlayer.deltaYFrom(this.y);
	this.jump(sx, sy);
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Followers.js
/**
* Extends {@link #show}.<br/>
* If you're using this, the followers always show up!
* @returns {boolean}
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Followers.set("show", Game_Followers.prototype.show);
Game_Followers.prototype.show = function() {
	J.ABS.EXT.ALLYAI.Aliased.Game_Followers.get("show").call(this);
	$gameMap.updateAllies();
};
/**
* Extends {@link #hide}.<br/>
* If you're using this, the followers always show up!
* @returns {boolean}
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Followers.set("hide", Game_Followers.prototype.hide);
Game_Followers.prototype.hide = function() {
	J.ABS.EXT.ALLYAI.Aliased.Game_Followers.get("hide").call(this);
	$gameMap.updateAllies();
};
/**
* Overwrites {@link #jumpAll}.<br/>
* Adjust the jumpAll function to prevent jumping to the player
* when the player is hit.
*/
Game_Followers.prototype.jumpAll = function() {
	if (!$gamePlayer.isJumping()) return;
	const playerBattler = $gamePlayer.getJabsBattler();
	for (const follower of this.data()) {
		if (!follower || !follower.isVisible()) continue;
		const battler = follower.getJabsBattler();
		if (battler.isEngaged() || !$gameMap._interpreter.isRunning()) continue;
		const sx = $gamePlayer.deltaXFrom(follower.x);
		const sy = $gamePlayer.deltaYFrom(follower.y);
		follower.jump(sx, sy);
	}
};
/**
* Sets whether or not all followers are direction-fixed.
* @param {boolean} isFixed Whether or not the direction should be fixed.
*/
Game_Followers.prototype.setDirectionFixAll = function(isFixed) {
	this.data().forEach((follower) => {
		if (!follower) return;
		const battler = follower.getJabsBattler();
		if (!battler) return;
		if (battler.isEngaged() || !$gameMap._interpreter.isRunning()) return;
		follower.setDirection(isFixed);
	});
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Interpreter.js
/**
* Extends the "Set Moveroute" event command.
* Sets all follower's direction-fix to be whatever the player's is after a moveroute.
* This accommodates the other adjustment regarding the player direction locking and allowing
* the allies to stay agnostic to that input.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.set("command205", Game_Interpreter.prototype.command205);
Game_Interpreter.prototype.command205 = function(params) {
	const result = J.ABS.EXT.ALLYAI.Aliased.Game_Interpreter.get("command205").call(this, params);
	if (result && params[0] === -1) {
		$gamePlayer.followers().setDirectionFixAll($gamePlayer.isDirectionFixed());
		$gamePlayer.jumpFollowersToMe();
	}
	return result;
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Map.js
/**
* Extends {@link Game_Map.parseBattlers}.<br/>
* Also parses ally battlers as well as events.
* @returns {JABS_Battler[]}
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Map.set("parseBattlers", Game_Map.prototype.parseBattlers);
Game_Map.prototype.parseBattlers = function() {
	const originalParsedBattlers = J.ABS.EXT.ALLYAI.Aliased.Game_Map.get("parseBattlers").call(this);
	const parsedAllyBattlers = this.parseAllyBattlers();
	const parsedBattlers = originalParsedBattlers.concat(parsedAllyBattlers);
	return parsedBattlers;
};
/**
* Parses all followers that are active into their battler form.
* @returns {JABS_Battler[]}
*/
Game_Map.prototype.parseAllyBattlers = function() {
	return JABS_AiManager.convertFollowersToBattlers($gamePlayer.followers().data());
};
/**
* Gets all ally battlers out of the collection of battlers.
* This does not include the player.
* @returns {JABS_Battler[]}
*/
Game_Map.prototype.getFollowerBattlers = function() {
	return JABS_AiManager.getAllBattlers().filter((battler) => battler.isFollower());
};
/**
* Updates all ally battlers in-place.
* For use with party-cycling.
*/
Game_Map.prototype.updateAllies = function() {
	const allyJabsBattlers = this.getFollowerBattlers();
	this.removeBattlers(allyJabsBattlers);
	const allies = this.parseAllyBattlers();
	if (allies.length) {
		JABS_AiManager.addOrUpdateBattlers(allies);
	}
};
/**
* Removes all provided battlers from the battler tracking.
* @param {JABS_Battler[]} battlers The battlers to be removed.
*/
Game_Map.prototype.removeBattlers = function(battlers) {
	battlers.forEach((battler) => battler.disengageTarget());
	JABS_AiManager.removeBattlers(battlers);
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Party.js
/**
* Extends initialization to include the ally AI configurations.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.ABS.EXT.ALLYAI.Aliased.Game_Party.get("initialize").call(this);
	this.initAllyAi();
};
/**
* Initializes additional properties associated with ally ai.
*/
Game_Party.prototype.initAllyAi = function() {
	/**
	* All encompassing object for storing my custom properties.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._abs ||= {};
	/**
	* A grouping of all properties associated with the ally ai JABS extension.
	*/
	this._j._abs._allyAI ||= {};
	/**
	* Whether or not the party will engage without the player's engagement.
	* @type {boolean}
	*/
	this._j._abs._allyAI._aggroPassiveToggle ||= false;
	/**
	* The name of the current formation the party is leveraging.
	* @type {string}
	*/
	this._j._abs._allyAI._partyFormation = J.ABS.EXT.ALLYAI.Metadata.DefaultFormationType;
};
/**
* Gets whether or not the party is allowed to actively engage enemies.
* @returns {boolean}
*/
Game_Party.prototype.isAggro = function() {
	return this._j._abs._allyAI._aggroPassiveToggle;
};
/**
* Sets the party ally AI to be aggro.
* Aggro party ally AI will have their own sight ranges and engage any enemies nearby.
*/
Game_Party.prototype.becomeAggro = function() {
	this._j._abs._allyAI._aggroPassiveToggle = true;
};
/**
* Sets the party ally AI to be passive.
* Passive party ally AI will only fight if hit first or when the leader engages.
*/
Game_Party.prototype.becomePassive = function() {
	this._j._abs._allyAI._aggroPassiveToggle = false;
};
/**
* Gets the key of the current party formation.
* @returns {string}
*/
Game_Party.prototype.getPartyFormation = function() {
	return this._j._abs._allyAI._partyFormation;
};
/**
* Sets the key of the current party formation to the given formation.
* @param formation
*/
Game_Party.prototype.setPartyFormation = function(formation) {
	this._j._abs._allyAI._partyFormation = formation;
};
/**
* Extends {@link Game_Party.addActor}.<br/>
* Also updates allies to accommodate the addition of the actor.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set("addActor", Game_Party.prototype.addActor);
Game_Party.prototype.addActor = function(actorId) {
	J.ABS.EXT.ALLYAI.Aliased.Game_Party.get("addActor").call(this, actorId);
	$gameMap.updateAllies();
};
/**
* Extends {@link Game_Party.removeActor}.<br/>
* Also updates allies to accommodate the removal of the actor.
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set("removeActor", Game_Party.prototype.removeActor);
Game_Party.prototype.removeActor = function(actorId) {
	J.ABS.EXT.ALLYAI.Aliased.Game_Party.get("removeActor").call(this, actorId);
	$gameMap.updateAllies();
};

//#endregion
//#region src/plugins/abs/ext/allyai/objects/Game_Player.js
/**
* Jumps all followers of the player back to the player.
*/
Game_Player.prototype.jumpFollowersToMe = function() {
	this.followers().data().forEach((follower) => follower.jumpToPlayer());
};

//#endregion
//#region src/plugins/abs/ext/allyai/sprites/Spriteset_Map.js
/**
* Extends {@link #refreshAllCharacterSprites}.<br/>
* Also refreshes follower ally battlers after sprites have been refreshed.
*/
J.ABS.EXT.ALLYAI.Aliased.Spriteset_Map.set("refreshAllCharacterSprites", Spriteset_Map.prototype.refreshAllCharacterSprites);
Spriteset_Map.prototype.refreshAllCharacterSprites = function() {
	J.ABS.EXT.ALLYAI.Aliased.Spriteset_Map.get("refreshAllCharacterSprites").call(this);
	if ($jabsEngine.requestAlliesRefresh) {
		$gameMap.updateAllies();
		$jabsEngine.requestAlliesRefresh = false;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/windows/Window_AllyAiSelect.js
/**
* The on-map windows for reviewing and changing how allies behave in combat.
*
* This previously rode on the JABS quick menu's shared selection window, extending it with two extra
* modes. That window existed to serve ten loadout-assignment modes as well, all of which moved into
* the loadout scene- leaving ally AI as its only remaining consumer. Inheriting from a class gutted
* down to nothing but a mode switch would have been worse than owning the behavior outright, so this
* is now a window in its own right.
*
* Ally AI stays on the map rather than following the assignment flows into a scene because it is a
* tactical decision made between fights, where breaking to a full scene costs more than it gains.
*/
var Window_AllyAiSelect = class Window_AllyAiSelect extends Window_Command {
	/**
	* The modes this window can render.
	*/
	static Types = {
		/**
		* The list of party members whose AI may be configured, plus the party-wide toggles.
		*/
		PartyList: "ai-party-list",
		/**
		* The list of AI presets a single chosen ally may adopt.
		*/
		SelectAi: "select-ai"
	};
	/**
	* @constructor
	* @param {Rectangle} rect The shape of the window.
	* @param {string} type Which of {@link Window_AllyAiSelect.Types} this window renders.
	*/
	constructor(rect, type) {
		super(rect);
		this.setMenuType(type);
		this.refresh();
		this.select(0);
		this.activate();
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes all custom members of this window.
	*/
	initMembers() {
		/**
		* Which mode this window renders.
		* @type {string}
		*/
		this._menuType = String.empty;
		/**
		* The actor id of the ally currently being managed through this window.
		* @type {number}
		*/
		this._chosenActorId = 0;
	}
	/**
	* Gets which mode this window renders.
	* @returns {string} The menuType.
	*/
	menuType() {
		return this._menuType;
	}
	/**
	* Sets which mode this window renders.
	* @param {string} newMenuType The new menuType.
	*/
	setMenuType(newMenuType) {
		this._menuType = newMenuType;
	}
	/**
	* Gets the actor id of the ally being managed.
	* @returns {number} The chosenActorId.
	*/
	getActorId() {
		return this._chosenActorId;
	}
	/**
	* Sets the actor id of the ally being managed.
	* @param {number} actorId The new chosenActorId.
	*/
	setActorId(actorId) {
		this._chosenActorId = actorId;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Builds whichever list this window's mode calls for.
	*/
	makeCommandList() {
		switch (this.menuType()) {
			case Window_AllyAiSelect.Types.PartyList:
				this.addAggroPassiveToggleCommand();
				this.makeAllyList();
				this.addAllyFormationCommand();
				break;
			case Window_AllyAiSelect.Types.SelectAi:
				this.makeAllyAiDoNothingToggle();
				this.makeAllyAiPresetList();
				break;
		}
	}
	/**
	* Draws the list of party members whose AI can be configured.
	*/
	makeAllyList() {
		const forEacher = (member) => {
			const command = new WindowCommandBuilder(member.name()).setSymbol("party-member").setExtensionData(member.actorId()).build();
			this.addBuiltCommand(command);
		};
		$gameParty.allMembers().forEach(forEacher, this);
	}
	/**
	* Injects the aggro-passive toggle command into the menu.
	*/
	addAggroPassiveToggleCommand() {
		const aggroPassiveCommandName = $gameParty.isAggro() ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveText : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveText;
		const aggroPassiveCommandIcon = $gameParty.isAggro() ? J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex : J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex;
		const description = $gameParty.isAggro() ? "The party is currently 'aggro'.\nAllies will engage in any enemy that comes within their range." : "The party is currently 'passive'.\nAllies will not engage until the leader strikes or is struck.";
		const textColor = $gameParty.isAggro() ? 2 : 3;
		const command = new WindowCommandBuilder(aggroPassiveCommandName).setSymbol("aggro-passive-toggle").setTextLines(description.split(/[\r\n]/i)).flagAsSubText().setColorIndex(textColor).setIconIndex(aggroPassiveCommandIcon).build();
		this.addBuiltCommand(command);
	}
	/**
	* Injects the party formations command into the menu.
	*/
	addAllyFormationCommand() {
		const allyFormationsCommand = new WindowCommandBuilder(J.ABS.EXT.ALLYAI.Metadata.AllyFormationsCommandName).setSymbol("ally-formations").setIconIndex(J.ABS.EXT.ALLYAI.Metadata.AllyFormationsCommandIconIndex).setColorIndex(23).build();
		this.addBuiltCommand(allyFormationsCommand);
	}
	/**
	* Adds a do-nothing toggle command at the top of the ally AI selection window.
	* Mirrors the aggro/passive toggle pattern from the party list window.
	*/
	makeAllyAiDoNothingToggle() {
		const currentActor = $gameActors.actor(this.getActorId());
		if (!currentActor) return;
		const allyAI = currentActor.getAllyAI();
		const isDoNothing = allyAI.isDoNothing();
		const commandName = isDoNothing ? "Do Nothing: ON" : "Do Nothing: OFF";
		const description = isDoNothing ? "This ally hangs back and takes no actions.\nToggle off to restore their preset behavior." : "This ally acts according to their preset.\nToggle on to make them stand down entirely.";
		const colorIndex = isDoNothing ? 3 : 2;
		const iconIndex = isDoNothing ? J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex : J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex;
		const command = new WindowCommandBuilder(commandName).setSymbol("do-nothing-toggle").setTextLines(description.split(/[\r\n]/i)).flagAsSubText().setColorIndex(colorIndex).setIconIndex(iconIndex).build();
		this.addBuiltCommand(command);
	}
	/**
	* Draws the list of available AI presets that an ally can use.
	*/
	makeAllyAiPresetList() {
		const currentActor = $gameActors.actor(this.getActorId());
		if (!currentActor) return;
		const presets = JABS_AllyAI.getPresets();
		const currentAi = currentActor.getAllyAI();
		const forEacher = (preset) => {
			const { key, name, description } = preset;
			const isEquipped = currentAi.getPresetKey() === key;
			const iconIndex = isEquipped ? J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex : J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex;
			const command = new WindowCommandBuilder(name).setSymbol("select-ai").setTextLines(description.split(/[\r\n]/i)).flagAsSubText().setIconIndex(iconIndex).setEnabled(true).setExtensionData(preset).build();
			this.addBuiltCommand(command);
		};
		presets.forEach(forEacher, this);
	}
	/**
	* Overwrites {@link #itemHeight}.<br/>
	* Increases the height so subtext can be added.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/windows/Window_Formations.js
/**
* A window that allows selection from a list of ally AI formations.
*/
var Window_Formations = class extends Window_Command {
	constructor(rect) {
		super(rect);
	}
	/**
	* Generates the command list for the JABS menu.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	buildCommands() {
		return J.ABS.EXT.ALLYAI.Metadata.FormationTypes.map(this.buildCommand, this);
	}
	buildCommand(formation) {
		const { key, name, description } = formation;
		const isEquipped = $gameParty.getPartyFormation() === key;
		const iconIndex = isEquipped ? J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex : J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex;
		return new WindowCommandBuilder(name).setSymbol("select-formation").setTextLines(description.split(/[\r\n]/i)).flagAsSubText().setIconIndex(iconIndex).setEnabled(true).setExtensionData(formation).build();
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
//#region src/plugins/abs/ext/allyai/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.<br/>
* Adds the ally AI command to the main menu's party column.
*
* The party column rather than the actor column, because what this configures is how the party behaves
* as a group- the formation they hold, whether they pick fights of their own- and the per-ally presets
* only make sense read against each other.
*
* This command previously lived in the JABS quick menu on the map. It moved here when that menu was
* retired, since by then the quick menu's only other entry was a way into this very menu.
*/
J.ABS.EXT.ALLYAI.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.ABS.EXT.ALLYAI.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	if (this.canAddAllyAiCommand() === false) return;
	const enabled = $gamePlayer.followers().isVisible();
	const command = new WindowCommandBuilder(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandName).setSymbol("ally-ai").setEnabled(enabled).setIconIndex(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandIconIndex).setColorIndex(27).setHelpText(this.allyAiHelpText()).setMenuSection(MenuSection.Party).build();
	this.addBuiltCommand(command);
};
/**
* Determines whether or not the ally ai management command can be added to the menu.
* @returns {boolean} True if the command should be added, false otherwise.
*/
Window_MenuCommand.prototype.canAddAllyAiCommand = function() {
	return $gameSwitches.value(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandSwitchId);
};
/**
* The help text for the ally AI menu command.
* @returns {string}
*/
Window_MenuCommand.prototype.allyAiHelpText = function() {
	const description = ["Your ally management selection menu.", "A general direction or theme of guidance can be assigned to your allies from here."];
	return description.join("\n");
};

//#endregion
//#region src/plugins/abs/ext/allyai/scenes/Scene_JabsAllyAi.js
/**
* The scene for deciding how the party's allies behave in combat.
*
* This replaces a stack of windows that used to open on top of the map, one over the next: pick "manage
* ally ai", get a window; pick an ally, get another window over that one; pick formations, get a third.
* Each step hid the one before it, so the player could never see what they were changing relative to
* anything else, and the whole arrangement lived on {@link Scene_Map} where it competed with the HUD.
*
* Here the party stays on screen the entire time, and whatever is being chosen sits beside it rather
* than on top of it. Same three lists, same handlers, none of the stacking.
*/
var Scene_JabsAllyAi = class Scene_JabsAllyAi extends Scene_MenuFacetBase {
	/**
	* Constructor.
	*/
	constructor() {
		super();
	}
	/**
	* Pushes this scene onto the scene stack.
	*/
	static callScene() {
		SceneManager.push(Scene_JabsAllyAi);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the members particular to this scene.
	*/
	initMembers() {
		super.initMembers();
		/**
		* The actor whose AI presets the detail column is currently showing.
		* @type {number}
		*/
		this._chosenActorId = 0;
	}
	/**
	* Gets the actor whose AI presets the detail column is currently showing.
	* @returns {number}
	*/
	chosenActorId() {
		return this._chosenActorId;
	}
	/**
	* Sets the actor whose AI presets the detail column should show.
	* @param {number} actorId The id of the actor.
	*/
	setChosenActorId(actorId) {
		this._chosenActorId = actorId;
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates this scene's own windows.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createPartyListWindow();
		this.createPresetListWindow();
		this.createFormationListWindow();
		this.focusPartyList();
	}
	/**
	* Creates the list of party members whose AI may be configured.
	*/
	createPartyListWindow() {
		const window = new Window_AllyAiSelect(this.partyListRect(), Window_AllyAiSelect.Types.PartyList);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("party-member", this.commandSelectMemberAi.bind(this));
		window.setHandler("aggro-passive-toggle", this.commandAggroPassiveToggle.bind(this));
		window.setHandler("ally-formations", this.commandAllyFormations.bind(this));
		window.setHelpWindow(this.helpWindow());
		this.setPartyListWindow(window);
		this.addWindow(window);
	}
	/**
	* Creates the list of AI presets a single chosen ally may adopt.
	*/
	createPresetListWindow() {
		const window = new Window_AllyAiSelect(this.detailRect(), Window_AllyAiSelect.Types.SelectAi);
		window.setHandler("cancel", this.focusPartyList.bind(this));
		window.setHandler("select-ai", this.commandEquipMemberAi.bind(this));
		window.setHandler("do-nothing-toggle", this.commandToggleDoNothing.bind(this));
		window.setHelpWindow(this.helpWindow());
		this.setPresetListWindow(window);
		this.addWindow(window);
		window.hide();
		window.deactivate();
	}
	/**
	* Creates the list of party formations.
	*/
	createFormationListWindow() {
		const window = new Window_Formations(this.detailRect());
		window.setHandler("cancel", this.focusPartyList.bind(this));
		window.setHandler("select-formation", this.commandSelectAllyFormation.bind(this));
		window.setHelpWindow(this.helpWindow());
		this.setFormationListWindow(window);
		this.addWindow(window);
		window.hide();
		window.deactivate();
	}
	/**
	* The share of the content area given to the party column.
	*
	* The party gets the smaller half because its rows are names, while the column beside it carries
	* presets and formations that each explain themselves across a second line.
	* @returns {number}
	*/
	partyColumnRatio() {
		return .4;
	}
	/**
	* The shape of the party column.
	* @returns {Rectangle}
	*/
	partyListRect() {
		const area = this.facetAreaRect();
		const width = Math.round(area.width * this.partyColumnRatio());
		return new Rectangle(area.x, area.y, width, area.height);
	}
	/**
	* The shape of the column beside the party, shared by the presets and the formations.
	*
	* Defined as the remainder rather than its own fraction, so the two columns cannot drift apart or
	* leave a seam between them however the ratio is tuned.
	* @returns {Rectangle}
	*/
	detailRect() {
		const area = this.facetAreaRect();
		const partyWidth = this.partyListRect().width;
		return new Rectangle(area.x + partyWidth, area.y, area.width - partyWidth, area.height);
	}
	/**
	* Implements {@link #controlLegendEntries}.<br/>
	* Describes the controls this scene responds to.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [{
			semantic: "ok",
			label: "select"
		}, {
			semantic: "cancel",
			label: "back"
		}];
	}
	/**
	* Gives the party column the cursor, and takes the detail column away.
	*
	* The detail column is hidden rather than merely deactivated, because what it shows only makes sense
	* next to a specific choice- an ally's presets, with no ally chosen, would describe nobody.
	*/
	focusPartyList() {
		this.presetListWindow().hide();
		this.presetListWindow().deactivate();
		this.formationListWindow().hide();
		this.formationListWindow().deactivate();
		this.partyListWindow().activate();
		this.partyListWindow().show();
	}
	/**
	* Gives one of the detail lists the cursor.
	*
	* The party column stays visible and stays selected- only deactivated- so the player keeps seeing
	* which ally the list beside it belongs to.
	* @param {Window_Command} window The detail window to focus.
	*/
	focusDetail(window) {
		this.partyListWindow().deactivate();
		window.show();
		window.refresh();
		window.activate();
		window.select(0);
	}
	/**
	* Shows the chosen ally's AI presets.
	*/
	commandSelectMemberAi() {
		const actorId = this.partyListWindow().currentExt();
		this.setChosenActorId(actorId);
		this.presetListWindow().setActorId(actorId);
		this.focusDetail(this.presetListWindow());
	}
	/**
	* Toggles the party-wide aggro/passive stance.
	*
	* Passive confines allies to the leader's current target; aggro gives them their full sight range and
	* lets them pick fights of their own.
	*/
	commandAggroPassiveToggle() {
		SoundManager.playRecovery();
		$gameParty.isAggro() ? $gameParty.becomePassive() : $gameParty.becomeAggro();
		this.partyListWindow().refresh();
	}
	/**
	* Applies the chosen preset to the chosen ally.
	*/
	commandEquipMemberAi() {
		const newPreset = this.presetListWindow().currentExt();
		const allyAi = $gameActors.actor(this.chosenActorId()).getAllyAI();
		allyAi.applyPreset(newPreset.key);
		this.presetListWindow().refresh();
	}
	/**
	* Toggles whether the chosen ally acts at all.
	*/
	commandToggleDoNothing() {
		SoundManager.playRecovery();
		const allyAi = $gameActors.actor(this.chosenActorId()).getAllyAI();
		allyAi.setDoNothing(!allyAi.isDoNothing());
		this.presetListWindow().refresh();
	}
	/**
	* Shows the party's available formations.
	*/
	commandAllyFormations() {
		this.focusDetail(this.formationListWindow());
	}
	/**
	* Applies the chosen formation to the party.
	*/
	commandSelectAllyFormation() {
		/** @type {JABS_Formation} */
		const selectedFormation = this.formationListWindow().currentExt();
		$gameParty.setPartyFormation(selectedFormation.key);
		this.formationListWindow().refresh();
	}
	/**
	* Gets the party column.
	* @returns {Window_AllyAiSelect}
	*/
	partyListWindow() {
		return this._partyListWindow;
	}
	/**
	* Sets the party column.
	* @param {Window_AllyAiSelect} window The window to track.
	*/
	setPartyListWindow(window) {
		this._partyListWindow = window;
	}
	/**
	* Gets the AI preset list.
	* @returns {Window_AllyAiSelect}
	*/
	presetListWindow() {
		return this._presetListWindow;
	}
	/**
	* Sets the AI preset list.
	* @param {Window_AllyAiSelect} window The window to track.
	*/
	setPresetListWindow(window) {
		this._presetListWindow = window;
	}
	/**
	* Gets the formation list.
	* @returns {Window_Formations}
	*/
	formationListWindow() {
		return this._formationListWindow;
	}
	/**
	* Sets the formation list.
	* @param {Window_Formations} window The window to track.
	*/
	setFormationListWindow(window) {
		this._formationListWindow = window;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.<br/>
* Adds a handler for the ally AI menu command.
*/
J.ABS.EXT.ALLYAI.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.ABS.EXT.ALLYAI.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("ally-ai", this.commandJabsAllyAi.bind(this));
};
/**
* Opens the ally AI scene.
*/
Scene_Menu.prototype.commandJabsAllyAi = function() {
	Scene_JabsAllyAi.callScene();
};

//#endregion
//# sourceMappingURL=J-ABS-AllyAI.js.map