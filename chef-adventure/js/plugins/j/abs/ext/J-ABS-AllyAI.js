//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v3.2.0 ABS-ALLYAI] Grants your allies AI to fight alongside the player.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderBefore J-ABS-InputManager
 * @help
 * ============================================================================
 * Please refer to J-ABS-AllyAI's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/abs/ext/allyai/index.md
 * ============================================================================
 *
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
 * @param allyStanceConfigs
 * @text ALLY STANCE DETAILS
 *
 * @param allyStanceCommandName
 * @parent allyStanceConfigs
 * @type string
 * @text Stance Command Text
 * @desc The text displayed for the ally stance command in the party menu.
 * @default Ally Stance
 *
 * @param allyStanceCommandIconIndex
 * @parent allyStanceConfigs
 * @type number
 * @text Stance Command Icon
 * @desc The icon displayed beside the ally stance command.
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
 * @param doNothingOnIconIndex
 * @parent aiModeConfigs
 * @type number
 * @text Do-Nothing On Icon
 * @desc The icon shown on an ally's do-nothing toggle while it is switched on.
 * @default 4
 *
 * @param doNothingOffIconIndex
 * @parent aiModeConfigs
 * @type number
 * @text Do-Nothing Off Icon
 * @desc The icon shown on an ally's do-nothing toggle while it is switched off.
 * @default 15
 */
//endregion annotations

//#region src/plugins/abs/ext/allyai/_models/JABS_Stance.js
/**
* One of the stances the party's allies can take: where an ally keeps itself around the leader while there
* is nothing to fight, and whether it goes into a fight before the leader does.
*
* A stance describes a zone rather than a single tile. An ally anywhere inside its zone is already in
* position and stays put, so it is not forever shuffling after a leader who only took a step. One that has
* strayed walks back to just inside the nearest edge of the zone and no further, which is the least walking
* that puts it back where it belongs.
*
* Every zone is laid out for a leader facing down, and turned to match the leader's real facing by
* whoever places the ally. In that frame "forward" runs the way the leader faces and "side" runs across
* it, so a forward of 2 is two tiles in front of the leader whichever way they happen to be facing.
*/
var JABS_Stance = class JABS_Stance {
	/**
	* The places around the leader a stance can keep an ally.
	*/
	static Placements = {
		/**
		* In front of the leader, between them and whatever lies ahead.
		*/
		Front: "front",
		/**
		* Beside the leader, on whichever side the ally already stands nearer.
		*/
		Side: "side",
		/**
		* Behind the leader, out of the way of whatever lies ahead.
		*/
		Behind: "behind"
	};
	/**
	* The nearest an ally kept in front of or behind the leader stands to them, in tiles.
	* @type {number}
	*/
	static NearDistance = 1;
	/**
	* The furthest an ally kept in front of or behind the leader strays from them, in tiles.
	* @type {number}
	*/
	static FarDistance = 3;
	/**
	* How far out to the leader's side an ally kept beside them stands, in tiles.
	* @type {number}
	*/
	static SideDistance = 1;
	/**
	* How far ahead of or behind the leader an ally kept beside them may drift before it moves, in tiles.
	*
	* Without any slack a side stance would be a single tile, and a leader walking forward would leave the
	* ally out of position after every step they took.
	* @type {number}
	*/
	static SideSlack = 1;
	/**
	* The key this stance is stored and looked up by.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The name of this stance, as the player sees it.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The description of this stance, as the player sees it when choosing one.
	* @type {string}
	*/
	description = String.empty;
	/**
	* Where around the leader this stance keeps an ally; one of {@link JABS_Stance.Placements}.
	* @type {string}
	*/
	placement = JABS_Stance.Placements.Behind;
	/**
	* Whether an ally in this stance takes on anything it can see without waiting for the leader.
	* @type {boolean}
	*/
	engagesFirst = false;
	/**
	* Constructor.
	* @param {string} key The key this stance is stored and looked up by.
	* @param {string} name The name of this stance, as the player sees it.
	* @param {string} description The description of this stance, as the player sees it.
	* @param {string} placement Where around the leader this stance keeps an ally.
	* @param {boolean} engagesFirst Whether an ally in this stance goes in before the leader does.
	*/
	constructor(key, name, description, placement, engagesFirst) {
		this.key = key;
		this.name = name;
		this.description = description;
		this.placement = placement;
		this.engagesFirst = engagesFirst;
	}
	/**
	* Gets the lane an ally keeps within a stance, which spreads several allies apart.
	*
	* Every ally in the party takes the same stance, and without lanes they would all head for the same
	* spot and pile up on one another. The first ally keeps the middle lane; each one after it alternates
	* out to either side of it, one tile further each pair.
	* @param {number} allyIndex The ally's place among the leader's followers; the first is zero.
	* @returns {number} The lane this ally keeps, in tiles from the middle one.
	*/
	static laneFor(allyIndex) {
		const distanceOut = Math.ceil(allyIndex / 2);
		return allyIndex % 2 === 1 ? -distanceOut : distanceOut;
	}
	/**
	* Pins a value between two bounds.
	*
	* Kept here rather than borrowed from the engine's `Number.prototype.clamp`, so this model stands on
	* its own without anything else having been loaded first.
	* @param {number} value The value to pin.
	* @param {number} min The lowest the value may be.
	* @param {number} max The highest the value may be.
	* @returns {number} The value, moved inside the bounds if it was outside them.
	*/
	static clampToRange(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
	/**
	* Finds the nearest spot within this stance to where an ally currently stands.
	*
	* An ally well inside the zone gets its own position straight back, which is what lets it stand still;
	* one outside it gets the closest point near the zone's edge.
	*
	* Every mover counts an ally as arrived once it is within some tolerance of its spot, so a spot right on
	* the zone's edge lets the ally stop that far outside the zone - and the edge nearest the leader is only a
	* tile away, so an ally kept in front would stop half a tile from them, standing in their sprite. The spot
	* is therefore pulled inside the zone by the inset given, which is that tolerance: wherever short of the
	* spot the ally stops, it stops inside the zone.
	* @param {number} side How far across the leader's facing the ally stands, with the leader facing down.
	* @param {number} forward How far ahead of the leader the ally stands; negative when it is behind them.
	* @param {number} lane The lane this ally keeps; see {@link JABS_Stance.laneFor}.
	* @param {number} inset How far inside the zone's edges the spot is pulled.
	* @returns {[number, number]} The [side, forward] spot this ally should stand at.
	*/
	nearestSpot(side, forward, lane, inset) {
		const nearest = JABS_Stance.NearDistance + inset;
		const furthest = JABS_Stance.FarDistance - inset;
		switch (this.placement) {
			case JABS_Stance.Placements.Front: return [lane, JABS_Stance.clampToRange(forward, nearest, furthest)];
			case JABS_Stance.Placements.Behind: return [lane, JABS_Stance.clampToRange(forward, -furthest, -nearest)];
			default: return this.nearestSideSpot(side, forward, lane, inset);
		}
	}
	/**
	* Finds the nearest spot at the leader's side to where an ally currently stands.
	*
	* The ally keeps to whichever side it already stands on, so a leader turning around never sends it
	* across their path to the far side. An ally standing exactly in line with the leader has no nearer
	* side, and takes the positive one. The spot is pulled inside the zone the same way
	* {@link JABS_Stance.nearestSpot} explains: further out to the side, and less far along it.
	* @param {number} side How far across the leader's facing the ally stands, with the leader facing down.
	* @param {number} forward How far ahead of the leader the ally stands; negative when it is behind them.
	* @param {number} lane The lane this ally keeps; see {@link JABS_Stance.laneFor}.
	* @param {number} inset How far inside the zone's edges the spot is pulled.
	* @returns {[number, number]} The [side, forward] spot this ally should stand at.
	*/
	nearestSideSpot(side, forward, lane, inset) {
		const whichSide = side < 0 ? -1 : 1;
		const sideSpot = whichSide * (JABS_Stance.SideDistance + inset);
		const slack = JABS_Stance.SideSlack - inset;
		const forwardSpot = JABS_Stance.clampToRange(forward, lane - slack, lane + slack);
		return [sideSpot, forwardSpot];
	}
};

//#endregion
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
	* Maps ally AI menu commands and stance defaults from plugin parameters.
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
		this.AiModeEquippedIconIndex = Number(this.parsedPluginParameters["aiModeEquipped"]);
		this.AiModeNotEquippedIconIndex = Number(this.parsedPluginParameters["aiModeNotEquipped"]);
		this.DoNothingOnIconIndex = Number(this.parsedPluginParameters["doNothingOnIconIndex"]);
		this.DoNothingOffIconIndex = Number(this.parsedPluginParameters["doNothingOffIconIndex"]);
		this.AllyStanceCommandName = this.parsedPluginParameters["allyStanceCommandName"] || "Ally Stance";
		this.AllyStanceCommandIconIndex = Number(this.parsedPluginParameters["allyStanceCommandIconIndex"] || 289);
		this.StanceTolerance = .5;
		this.StanceProgressEpsilon = .05;
		this.StanceStallFrames = 60;
		this.StanceSpotDrift = .5;
		this.StanceFacingSettleFrames = 30;
		this.StanceCatchUpDistance = 1.5;
		this.StanceCatchUpSpeedBoost = 1;
		this.PullBackFrames = 180;
		/**
		* All available stances the party's allies can take.
		*
		* Listed in ladder order, from hanging back behind the leader to leading the charge ahead of them. The
		* menu shows them in this order, and stepping the stance safer or bolder moves along it.
		* @type {JABS_Stance[]}
		*/
		this.StanceTypes = [
			new JABS_Stance("safe-support", "Safe Support", "Hangs back 1-3 tiles behind you.\nJoins the fight the moment you do.", JABS_Stance.Placements.Behind, false),
			new JABS_Stance("bloody-wanker", "Bloody Wanker", "Sticks right at your side.\nAlways first to swing at anything in sight.", JABS_Stance.Placements.Side, true),
			new JABS_Stance("meat-shield", "Meat Shield", "Marches 1-3 tiles ahead of you.\nCharges anything in sight before it reaches you.", JABS_Stance.Placements.Front, true)
		];
		/**
		* The default stance the party takes if none has been chosen.
		* @type {string}
		*/
		this.DefaultStanceType = this.StanceTypes[0].key;
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
J.ABS.EXT.ALLYAI.Metadata = new J_AllyAiPluginMetadata("J-ABS-AllyAI", "3.2.0");
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
	*
	* These climb with spacing rather than falling, because spacing is measured from the ally's
	* target while the leash is measured from the leader- and in a fight the leader is standing on
	* the target. An ally told to hold seven tiles off the enemy is therefore also seven tiles off
	* the player, so the tier that stands furthest back is the tier that needs the most rope.
	*
	* Every value here must resolve to less than {@link JABS_AiManager.maxAiRange}. Beyond that
	* distance the ally falls out of the AI management sweep entirely, so the leash check that would
	* have hauled them back never runs again- and with vanilla follower chasing suppressed, nothing
	* else is left to bring them home. A leash above the sweep radius does not stretch, it snaps.
	*/
	static LeashMultipliers = {
		[JABS_AllyAI.Spacing.FRONTLINE]: 1.1,
		[JABS_AllyAI.Spacing.MIDLINE]: 1.15,
		[JABS_AllyAI.Spacing.BACKLINE]: 1.2
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
	* @param {string=} presetKey The preset key to apply on construction.
	*/
	constructor(presetKey) {
		super();
		this.initialize(presetKey);
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
			Diagnostics.error("J-ABS-AllyAI", `attempted to apply ally AI preset: [${presetKey}], but it is not a valid preset.`);
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
//#region src/plugins/abs/ext/allyai/_models/JABS_StanceFacing.js
/**
* Tracks which way an ally's stance is laid out around its leader, turning it only once the leader has
* settled on a new facing.
*
* Laying a stance out from the leader's facing directly would swing it the instant they turned, and a
* stance kept in front of the leader swings all the way round to behind them. An ally in front, watching
* its leader turn to read a sign, would sprint a lap around them and then sprint back. So a new facing has
* to be held for a moment before the stance follows it, and a glance one way and back moves nobody.
*/
var JABS_StanceFacing = class {
	/**
	* The facing the stance is currently laid out from, or zero before any facing has been seen.
	* @type {number}
	*/
	#direction = 0;
	/**
	* The facing the leader has most recently turned to and held; zero before any has been counted.
	* @type {number}
	*/
	#candidate = 0;
	/**
	* How many consecutive observations the leader has held {@link #candidate} for.
	* @type {number}
	*/
	#candidateFrames = 0;
	/**
	* Gets the facing the stance is currently laid out from.
	* @returns {number} The direction, or zero before any facing has been seen.
	*/
	direction() {
		return this.#direction;
	}
	/**
	* Records which way the leader faces this frame, and turns the stance if they have held a new facing
	* for long enough.
	* @param {number} direction The direction the leader currently faces.
	* @param {number} settleFrames How many frames a new facing must be held before the stance follows it.
	*/
	observe(direction, settleFrames) {
		if (this.#direction === 0) {
			this.#direction = direction;
			return;
		}
		if (direction !== this.#candidate) {
			this.#candidate = direction;
			this.#candidateFrames = 0;
		}
		this.#candidateFrames += 1;
		if (this.#candidateFrames < settleFrames) return;
		this.#direction = direction;
	}
};

//#endregion
//#region src/plugins/abs/ext/allyai/_models/JABS_StanceStall.js
/**
* Tracks how an ally is faring at reaching its spot in the party's stance, so that a spot it cannot reach
* can be abandoned instead of chased forever.
*
* An ally that cannot reach its spot does not fail quietly. The pathfinder rounds a character's position
* to a whole tile before searching, so an ally standing near a tile boundary gets a different first step
* depending on which side of that boundary it is on. It takes the step, lands back on the other side, and
* is handed the opposite answer next frame. Because a move command faces its character whether or not the
* move succeeds, the result reads as a character vibrating in place rather than as one that is stuck.
*
* **Progress is measured, not time.** Giving up after a fixed number of frames would abandon a long but
* perfectly good walk around a wall, which is the common case and the one that must not break. What is
* tracked instead is the closest the ally has ever come to the spot during this attempt, and how long it
* has been since that improved. A detour that is genuinely working keeps beating its own record and never
* stalls; the two-step shuffle above never beats it once.
*/
var JABS_StanceStall = class {
	/**
	* Whether an attempt on a spot is currently underway.
	*
	* Kept as its own flag rather than inferred from the coordinates below, because `0,0` is a real place on
	* a map and an ally assigned a spot there would otherwise inherit the history of an attempt that never
	* happened.
	* @type {boolean}
	*/
	#attempting = false;
	/**
	* The x coordinate of the spot this attempt is aimed at.
	* @type {number}
	*/
	#targetX = 0;
	/**
	* The y coordinate of the spot this attempt is aimed at.
	* @type {number}
	*/
	#targetY = 0;
	/**
	* The closest this ally has come to the spot during the current attempt.
	* @type {number}
	*/
	#bestDistance = 0;
	/**
	* How many consecutive frames have passed without improving on {@link #bestDistance}.
	* @type {number}
	*/
	#framesWithoutProgress = 0;
	/**
	* Records how this frame's approach went.
	*
	* A spot that has moved since the attempt began starts a fresh attempt, because the leader walking or
	* turning relocates it and the old attempt's history says nothing about the new one. That also means an
	* ally is never stalled while its leader is on the move, which is the behaviour worth protecting -
	* standing still is only ever the answer to a spot that is genuinely unreachable from where the ally is.
	*
	* A spot is also the nearest point of a zone to wherever the ally happens to be, so an ally shuffling on
	* the spot drags its spot around with it by a hair each frame. Those hairs are not a moved spot - they
	* are exactly the shuffle this tracker exists to catch - so a spot only counts as moved once it has
	* drifted further than the given tolerance from where the attempt began.
	* @param {number} distance How far this ally currently is from the spot.
	* @param {number} targetX The x coordinate of the spot.
	* @param {number} targetY The y coordinate of the spot.
	* @param {number} epsilon How much closer counts as having made progress.
	* @param {number} driftTolerance How far the spot may drift before it counts as a different spot.
	*/
	observe(distance, targetX, targetY, epsilon, driftTolerance) {
		const isNewAttempt = this.#attempting === false || this.#hasSpotMoved(targetX, targetY, driftTolerance);
		if (isNewAttempt) {
			this.#beginAttempt(distance, targetX, targetY);
			return;
		}
		if (distance < this.#bestDistance - epsilon) {
			this.#bestDistance = distance;
			this.#framesWithoutProgress = 0;
			return;
		}
		this.#framesWithoutProgress += 1;
	}
	/**
	* Whether the spot has drifted far enough from where this attempt began to count as a different spot.
	* @param {number} targetX The x coordinate of the spot now.
	* @param {number} targetY The y coordinate of the spot now.
	* @param {number} driftTolerance How far the spot may drift before it counts as a different spot.
	* @returns {boolean} True if this is a different spot, false if it is still the same one.
	*/
	#hasSpotMoved(targetX, targetY, driftTolerance) {
		const drift = Math.hypot(targetX - this.#targetX, targetY - this.#targetY);
		return drift > driftTolerance;
	}
	/**
	* Starts measuring a fresh attempt from wherever the ally happens to be standing.
	* @param {number} distance How far this ally currently is from the spot.
	* @param {number} targetX The x coordinate of the spot.
	* @param {number} targetY The y coordinate of the spot.
	*/
	#beginAttempt(distance, targetX, targetY) {
		this.#attempting = true;
		this.#targetX = targetX;
		this.#targetY = targetY;
		this.#bestDistance = distance;
		this.#framesWithoutProgress = 0;
	}
	/**
	* Whether this ally has spent long enough getting no closer to give up on the spot.
	* @param {number} stallFrames How many frames without progress are tolerated.
	* @returns {boolean} True if the ally should stop trying, false otherwise.
	*/
	isStalled(stallFrames) {
		return this.#framesWithoutProgress >= stallFrames;
	}
	/**
	* Abandons the current attempt, so the next one is measured from scratch.
	*
	* Called when an ally is standing in its spot, which is the one outcome that says everything recorded so
	* far is spent - the next time it is out of position it is a new problem, even if the spot has not moved
	* an inch.
	*/
	reset() {
		this.#attempting = false;
		this.#framesWithoutProgress = 0;
	}
};

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
* Extends the engagement determination so allies decide by the party's stance.
* @param {JABS_Battler} target The target to see if we should engage with.
* @param {number} distance The distance from this battler to the target.
* @returns {boolean}
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set("shouldEngage", JABS_Battler.prototype.shouldEngage);
JABS_Battler.prototype.shouldEngage = function(target, distance) {
	if (this.isEnemy()) {
		return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("shouldEngage").call(this, target, distance);
	}
	return this.shouldAllyEngage(target, distance);
};
/**
* Determines whether or not the ally should engage in combat with the target.
*
* The party's stance decides whether an ally goes in first, but every stance answers the leader: an ally
* that was struck, or that the leader's own fight has rallied, joins in whatever its stance, and so does
* one whose leader is already trading blows. Only a direct order to pull back keeps an ally out of it.
* @param {JABS_Battler} target The target to potentially engage with.
* @param {number} distance The distance from this battler to the nearest potential target.
* @returns {boolean} True if this ally should engage in combat, false otherwise.
*/
JABS_Battler.prototype.shouldAllyEngage = function(target, distance) {
	const allyAI = this.getAllyAiMode();
	if (allyAI && allyAI.isDoNothing()) return false;
	if (target.isInanimate()) return false;
	if (this.isPullingBack()) return false;
	if (!this.inSightRange(target, distance)) return false;
	if (this.isAlerted()) return true;
	if (this.isLeaderFighting()) return true;
	return $gameParty.getPartyStanceType().engagesFirst;
};
/**
* Determines whether the leader is fighting something right now.
*
* The leader's last hit is the record of what they last struck. Smashing a crate is not a fight worth
* joining, so an inanimate last hit does not count, and neither does one that has since been defeated.
* @returns {boolean} True if the leader's last hit is something alive that fights back, false otherwise.
*/
JABS_Battler.prototype.isLeaderFighting = function() {
	const lastHit = $jabsEngine.getPlayer1().lastHit();
	if (lastHit === null) return false;
	if (lastHit.isInanimate()) return false;
	return lastHit.isDead() === false;
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
* Extends {@link JABS_Battler.initIdleInfo}.<br/>
* Also prepares this battler to keep its place in the party's stance.
*
* Seeded alongside the rest of the idle state because that is exactly when it applies: keeping to a stance
* is what an ally does when it has nothing to fight, and none of it means anything while it is engaged.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set("initIdleInfo", JABS_Battler.prototype.initIdleInfo);
JABS_Battler.prototype.initIdleInfo = function() {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("initIdleInfo").call(this);
	/**
	* How this battler is faring at reaching its spot in the party's stance.
	* @type {JABS_StanceStall}
	*/
	this._stanceStall = new JABS_StanceStall();
	/**
	* Which way this battler's stance is laid out around the leader.
	* @type {JABS_StanceFacing}
	*/
	this._stanceFacing = new JABS_StanceFacing();
	/**
	* Whether this battler has strayed far enough from its stance to sprint back into it.
	* @type {boolean}
	*/
	this._stanceCatchingUp = false;
	/**
	* The frame this battler last kept to its stance on; see {@link JABS_Battler.isStanceCatchingUp}.
	* @type {number}
	*/
	this._stanceFollowFrame = 0;
};
/**
* Extends {@link JABS_Battler.initBattleInfo}.<br/>
* Also prepares this battler to obey an order to pull back.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set("initBattleInfo", JABS_Battler.prototype.initBattleInfo);
JABS_Battler.prototype.initBattleInfo = function() {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("initBattleInfo").call(this);
	/**
	* How many more frames this battler stays out of the fight after being told to pull back.
	* @type {number}
	*/
	this._pullBackFrames = 0;
};
/**
* Extends {@link JABS_Battler.updateTimers}.<br/>
* Also counts down any order to pull back.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set("updateTimers", JABS_Battler.prototype.updateTimers);
JABS_Battler.prototype.updateTimers = function() {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get("updateTimers").call(this);
	this.processPullBackTimer();
};
/**
* Gets how this battler is faring at reaching its spot in the party's stance.
* @returns {JABS_StanceStall} The tracker for this battler's current attempt.
*/
JABS_Battler.prototype.getStanceStall = function() {
	return this._stanceStall;
};
/**
* Records how this frame's approach toward a stance spot went.
*
* Exposed on the battler rather than left inside the AI manager because more than one manager steers an
* ally into its stance - the pixel movement bridge replaces the tile-based mover outright - and a give-up
* implemented in only one of them is a give-up that never happens. Ally AI owns the knobs, so it owns the
* seam; whoever is doing the moving calls it.
* @param {number} distance How far this battler currently is from the spot.
* @param {number} spotX The x coordinate of the spot.
* @param {number} spotY The y coordinate of the spot.
*/
JABS_Battler.prototype.observeStanceApproach = function(distance, spotX, spotY) {
	const { StanceProgressEpsilon, StanceSpotDrift } = J.ABS.EXT.ALLYAI.Metadata;
	this.getStanceStall().observe(distance, spotX, spotY, StanceProgressEpsilon, StanceSpotDrift);
};
/**
* Whether this battler has spent long enough getting no closer to abandon its stance spot.
* @returns {boolean} True if the battler should stop trying to reach the spot, false otherwise.
*/
JABS_Battler.prototype.hasGivenUpOnStanceSpot = function() {
	const stallFrames = J.ABS.EXT.ALLYAI.Metadata.StanceStallFrames;
	return this.getStanceStall().isStalled(stallFrames);
};
/**
* Abandons this battler's current attempt at a stance spot.
*
* Called on arrival, which is the one outcome that spends an attempt outright - the next time this
* battler is out of position it is a new problem, even against the very same spot.
*/
JABS_Battler.prototype.clearStanceApproach = function() {
	this.getStanceStall().reset();
};
/**
* Gets which way this battler's stance is laid out around the leader.
* @returns {JABS_StanceFacing} The tracker for this battler's stance facing.
*/
JABS_Battler.prototype.stanceFacing = function() {
	return this._stanceFacing;
};
/**
* Records which way the leader faces this frame, turning this battler's stance once they have settled.
* @param {number} direction The direction the leader currently faces.
*/
JABS_Battler.prototype.observeLeaderFacing = function(direction) {
	const settleFrames = J.ABS.EXT.ALLYAI.Metadata.StanceFacingSettleFrames;
	this.stanceFacing().observe(direction, settleFrames);
};
/**
* Gets the facing this battler's stance is currently laid out from.
* @returns {number} The direction the stance is laid out from.
*/
JABS_Battler.prototype.getStanceFacing = function() {
	return this.stanceFacing().direction();
};
/**
* Gets whether this battler has strayed far enough from its stance to sprint back into it.
* @returns {boolean}
*/
JABS_Battler.prototype.stanceCatchingUp = function() {
	return this._stanceCatchingUp;
};
/**
* Sets whether this battler has strayed far enough from its stance to sprint back into it.
* @param {boolean} catchingUp Whether the battler is catching up.
*/
JABS_Battler.prototype.setStanceCatchingUp = function(catchingUp) {
	this._stanceCatchingUp = catchingUp;
};
/**
* Gets the frame this battler last kept to its stance on.
* @returns {number}
*/
JABS_Battler.prototype.stanceFollowFrame = function() {
	return this._stanceFollowFrame;
};
/**
* Sets the frame this battler last kept to its stance on.
* @param {number} frame The frame count it kept to its stance on.
*/
JABS_Battler.prototype.setStanceFollowFrame = function(frame) {
	this._stanceFollowFrame = frame;
};
/**
* Decides whether this battler sprints back into its stance, from how far outside the stance it stands.
*
* The decision has a memory on purpose. An ally starts sprinting once it is well out of position, and
* keeps sprinting until it is back in it. Deciding afresh every frame would stop the sprint the moment the
* ally was merely close - and an ally kept in front of a walking leader, sent behind them by a turn, would
* then trail them at a walk forever, never quite getting back in front.
*
* Between those two points it changes nothing, which is what keeps an ally trailing a walking leader at
* the edge of its zone walking with them rather than lurching after them.
* @param {number} distance How far the battler stands from its stance spot.
*/
JABS_Battler.prototype.updateStanceCatchUp = function(distance) {
	const { StanceCatchUpDistance, StanceTolerance } = J.ABS.EXT.ALLYAI.Metadata;
	this.setStanceFollowFrame(Graphics.frameCount);
	if (distance > StanceCatchUpDistance) {
		this.setStanceCatchingUp(true);
		return;
	}
	if (distance <= StanceTolerance) {
		this.setStanceCatchingUp(false);
	}
};
/**
* Whether this battler is sprinting back into its stance right now.
*
* A sprint only holds while the battler is actually keeping to its stance. The moment it does anything else
* - fights, chases an alert, or stands frozen through a cutscene that stopped the AI - it stops being
* steered by its stance, and a sprint left over from before would carry into whatever it does next. So a
* sprint also requires the stance to have steered the battler this frame or the one before; either order
* of the AI and the character update within a frame then sees it.
* @returns {boolean} True if the battler should be moving faster than its leader, false otherwise.
*/
JABS_Battler.prototype.isStanceCatchingUp = function() {
	if (!this.stanceCatchingUp()) return false;
	return this.stanceFollowFrame() >= Graphics.frameCount - 1;
};
/**
* Gets how many more frames this battler stays out of the fight after being told to pull back.
* @returns {number}
*/
JABS_Battler.prototype.pullBackFrames = function() {
	return this._pullBackFrames;
};
/**
* Sets how many more frames this battler stays out of the fight after being told to pull back.
* @param {number} frames The number of frames.
*/
JABS_Battler.prototype.setPullBackFrames = function(frames) {
	this._pullBackFrames = frames;
};
/**
* Whether this battler is staying out of the fight because it was told to pull back.
* @returns {boolean} True if it is pulling back, false otherwise.
*/
JABS_Battler.prototype.isPullingBack = function() {
	return this.pullBackFrames() > 0;
};
/**
* Counts down an order to pull back by one frame.
*/
JABS_Battler.prototype.processPullBackTimer = function() {
	if (!this.isPullingBack()) return;
	this.setPullBackFrames(this.pullBackFrames() - 1);
};
/**
* Obeys an order to charge: goes after something to fight right now, whatever the party's stance says.
*
* An ally already fighting is already charging, and one told to do nothing goes on doing nothing. A
* charge also overrides any pull back still in effect, since the newer order is the one that stands.
*/
JABS_Battler.prototype.chargeOnCommand = function() {
	if (this.getAllyAiMode().isDoNothing()) return;
	if (this.isEngaged()) return;
	this.setPullBackFrames(0);
	const target = this.findChargeTarget();
	if (target === null) return;
	this.showBalloon(J.ABS.Balloons.Exclamation);
	this.engageTarget(target);
};
/**
* Finds something this battler can charge at.
*
* Whatever the leader is fighting comes first, since a charge is the leader asking for help with their
* fight. Failing that, the nearest foe in sight will do.
* @returns {JABS_Battler|null} The battler to charge at, or null when nothing worth charging is in reach.
*/
JABS_Battler.prototype.findChargeTarget = function() {
	if (this.isLeaderFighting()) {
		const leaderTarget = $jabsEngine.getPlayer1().lastHit();
		if (this.canChargeAt(leaderTarget)) return leaderTarget;
	}
	const nearestFoe = JABS_AiManager.getClosestOpposingBattler(this);
	if (nearestFoe === null) return null;
	if (nearestFoe.isInanimate()) return null;
	if (!this.canChargeAt(nearestFoe)) return null;
	return nearestFoe;
};
/**
* Whether a target is within reach for a charge.
*
* A charge is a chase, so the target must sit within this battler's pursuit range, or the chase would be
* abandoned on its first step. It must also sit within this battler's leash of the leader, or the chase
* would carry the battler far enough from the leader to be snapped straight back to them.
* @param {JABS_Battler} target The battler to charge at.
* @returns {boolean} True if the target is within reach, false otherwise.
*/
JABS_Battler.prototype.canChargeAt = function(target) {
	const distance = this.distanceToDesignatedTarget(target);
	if (!this.inPursuitRange(target, distance)) return false;
	const leader = $jabsEngine.getPlayer1();
	return target.distanceToDesignatedTarget(leader) <= this.getAllyLeashRange();
};
/**
* Obeys an order to pull back: drops out of any fight, and stays out of every fight for a while.
*
* The ally forgets why it was fighting as well as what, so it does not turn straight back around the
* moment the order runs out. Disengaging also clears any alert, so it does not walk back toward one
* either, and while the order holds it cannot be alerted again.
*/
JABS_Battler.prototype.pullBackOnCommand = function() {
	this.disengageTarget();
	this.resetAllAggro(null, true);
	this.setPullBackFrames(J.ABS.EXT.ALLYAI.Metadata.PullBackFrames);
	this.showBalloon(J.ABS.Balloons.Sweat);
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
* When not alerted/engaged, allies keep to the party's stance around the leader.
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
	const isHidden = followers.isVisible() === false;
	if (isGathering || isHidden) {
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
* Causes an ally to keep to the party's stance around their leader (player1) while idle.
*
* The stance is a zone, so an ally already inside it stays where it is. One outside it heads for the
* nearest spot in it, sprinting if it has strayed far enough. The zone turns with the leader, but only
* once the leader has settled on a new facing.
* @param {JABS_Battler} allyBattler The ally battler to reposition.
*/
JABS_AiManager.allyFollowLeader = function(allyBattler) {
	const leader = $jabsEngine.getPlayer1();
	if (!leader) return;
	if (this.maintainLeashAndEngagement(allyBattler, leader)) return;
	if (!allyBattler.canBattlerMove()) return;
	const leaderFacing = leader.getCharacter().direction();
	allyBattler.observeLeaderFacing(leaderFacing);
	const spot = this.findStanceSpot(allyBattler, leader);
	const [spotX, spotY] = spot;
	const distance = this.distanceToSlot(allyBattler, spotX, spotY);
	allyBattler.updateStanceCatchUp(distance);
	this.moveTowardSlotIfNeeded(allyBattler, spotX, spotY);
};
/**
* Finds the nearest spot in the party's stance for an ally, as map coordinates.
* @param {JABS_Battler} allyBattler The ally battler being placed.
* @param {JABS_Battler} leaderBattler The leader the stance is laid out around.
* @returns {[number, number]} The [x, y] coordinates of the spot.
*/
JABS_AiManager.findStanceSpot = function(allyBattler, leaderBattler) {
	const stance = $gameParty.getPartyStanceType();
	const followerIndex = this.getFollowerIndexFromBattler(allyBattler);
	const lane = JABS_Stance.laneFor(Math.max(0, followerIndex));
	const facing = allyBattler.getStanceFacing();
	return this.computeStanceSpot(allyBattler, leaderBattler, stance, facing, lane);
};
/**
* Computes the nearest spot within a stance's zone to where an ally stands, as map coordinates.
*
* Both battlers are measured by their logical position, the same position every mover measures arrival
* against, so the answer means the same thing under tile and pixel movement alike: the ally's place
* relative to the leader is turned into the leader-facing-down frame the stance is defined in, brought to
* the nearest point of the zone there, and turned back out onto the map.
* @param {JABS_Battler} allyBattler The ally battler being placed.
* @param {JABS_Battler} leaderBattler The leader the stance is laid out around.
* @param {JABS_Stance} stance The stance the ally is keeping to.
* @param {2|4|6|8} facing The facing the stance is laid out from.
* @param {number} lane The lane this ally keeps within the stance.
* @returns {[number, number]} The [x, y] coordinates of the spot.
*/
JABS_AiManager.computeStanceSpot = function(allyBattler, leaderBattler, stance, facing, lane) {
	const leaderCharacter = leaderBattler.getCharacter();
	const leaderX = leaderCharacter.x;
	const leaderY = leaderCharacter.y;
	const allyCharacter = allyBattler.getCharacter();
	const fromLeaderX = allyCharacter.x - leaderX;
	const fromLeaderY = allyCharacter.y - leaderY;
	const allyOffset = this.unrotateOffsetForFacing(fromLeaderX, fromLeaderY, facing);
	const [side, forward] = allyOffset;
	const inset = J.ABS.EXT.ALLYAI.Metadata.StanceTolerance;
	const spotOffset = stance.nearestSpot(side, forward, lane, inset);
	const [spotSide, spotForward] = spotOffset;
	const mapOffset = this.rotateOffsetForFacing(spotSide, spotForward, facing);
	const [offsetX, offsetY] = mapOffset;
	return [leaderX + offsetX, leaderY + offsetY];
};
/**
* Applies leash rules to keep allies reasonably near the leader.
* Returns true if a corrective action (like jump) occurred this frame.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {JABS_Battler} leaderBattler The leader battler.
* @returns {boolean} True if a corrective action occurred, false otherwise.
*/
JABS_AiManager.maintainLeashAndEngagement = function(allyBattler, leaderBattler) {
	const distanceToLeader = allyBattler.distanceToDesignatedTarget(leaderBattler);
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
* Rotates an offset on the map back into the baseline frame of a leader facing DOWN - the exact reverse of
* {@link JABS_AiManager.rotateOffsetForFacing}, so turning an offset one way and then the other returns it
* unchanged.
*
* Stances are defined in that baseline frame, so this is how an ally's place on the map is read in terms a
* stance understands: how far in front of the leader it stands, and how far to one side.
* @param {number} mapX The x-offset on the map.
* @param {number} mapY The y-offset on the map.
* @param {2|4|6|8} dir The facing the offset is measured against.
* @returns {[number, number]} The baseline offset [x, y], as though the leader faced DOWN.
*/
JABS_AiManager.unrotateOffsetForFacing = function(mapX, mapY, dir) {
	switch (dir) {
		case 2: return [mapX, mapY];
		case 4: return [mapY, -mapX];
		case 6: return [-mapY, mapX];
		case 8: return [-mapX, -mapY];
		default: return [mapX, mapY];
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
	const tolerance = J.ABS.EXT.ALLYAI.Metadata.StanceTolerance;
	if (this.isWithinTolerance(allyBattler, desiredX, desiredY, tolerance)) {
		allyBattler.clearStanceApproach();
		return;
	}
	const distance = this.distanceToSlot(allyBattler, desiredX, desiredY);
	allyBattler.observeStanceApproach(distance, desiredX, desiredY);
	if (allyBattler.hasGivenUpOnStanceSpot()) return;
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
	const distance = this.distanceToSlot(allyBattler, targetX, targetY);
	return distance <= tolerance;
};
/**
* Measures how far an ally is from a formation slot.
*
* Euclidean over the fractional coordinates rather than over tiles, so that an ally a hair out of
* position is not reported as a whole tile away - and so the number shrinks smoothly as the ally
* walks, which is what makes it usable as a measure of progress rather than merely of arrival.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {number} targetX The target x tile.
* @param {number} targetY The target y tile.
* @returns {number} The distance between the ally and the slot.
*/
JABS_AiManager.distanceToSlot = function(allyBattler, targetX, targetY) {
	const character = allyBattler.getCharacter();
	const dx = character.x - targetX;
	const dy = character.y - targetY;
	return Math.sqrt(dx * dx + dy * dy);
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
		this.repositionAllyToStandoff(battler);
	} else if (distance > farDistance) {
		battler.smartMoveTowardTarget();
	} else {}
};
/**
* Moves an ally that is too close to its target back out to its standoff ring, arcing around the
* target toward the leader rather than retreating straight back.
*
* The vanilla retreat this replaces walks directly away from the target, and it does so on one
* cardinal axis at a time, choosing whichever axis currently dominates. That choice reinforces
* itself- a step that grows the horizontal gap makes horizontal dominate harder next frame- so an
* ally being pursued locks onto an axis and marches in a dead straight line for as long as the
* chase lasts. Nothing in it knows the party exists, so the line leads out of the fight.
*
* Steering toward a fixed point instead of a direction is what ends the march: a point is arrived
* at, and {@link JABS_Battler.smartMoveTowardCoordinates} stops on arrival. Biasing that point
* toward the leader is what keeps the ally in the fight while it backs off.
* @param {JABS_Battler} allyBattler The ally battler repositioning.
*/
JABS_AiManager.repositionAllyToStandoff = function(allyBattler) {
	const leader = $jabsEngine.getPlayer1();
	const target = allyBattler.getTarget();
	const standoffPoint = this.calculateAllyStandoffPoint(allyBattler, target, leader);
	const [standoffX, standoffY] = standoffPoint;
	allyBattler.smartMoveTowardCoordinates(standoffX, standoffY);
};
/**
* Calculates the point an ally should back off to: on its own standoff ring around the target, on
* whichever side of that ring sits nearest the leader.
*
* The bearing is built from two pieces. The first is the ally's own bearing away from the target,
* which is what stops it cutting through the target to reach the other side. The second is the
* portion of the leader's bearing that runs perpendicular to it- the sideways pull, with the
* away-or-toward part removed. Adding a perpendicular vector to a unit vector can never cancel it
* out, so the result always points somewhere sane no matter where the leader is standing, which
* is the reason for taking only the perpendicular part rather than blending the two bearings.
* @param {JABS_Battler} allyBattler The ally battler repositioning.
* @param {JABS_Battler} target The battler being backed away from.
* @param {JABS_Battler} leader The battler the standoff point is biased toward.
* @returns {[number, number]} The [x, y] coordinates to back off to.
*/
JABS_AiManager.calculateAllyStandoffPoint = function(allyBattler, target, leader) {
	const targetX = target.getX();
	const targetY = target.getY();
	const closeDistance = allyBattler.getCloseDistance();
	const farDistance = allyBattler.getFarDistance();
	const standoffRadius = (closeDistance + farDistance) / 2;
	const awayBearing = this.normalizeVector(allyBattler.getX() - targetX, allyBattler.getY() - targetY);
	const [awayX, awayY] = awayBearing;
	const leaderBearing = this.normalizeVector(leader.getX() - targetX, leader.getY() - targetY);
	const [leaderX, leaderY] = leaderBearing;
	const alongAway = leaderX * awayX + leaderY * awayY;
	const sidewaysPull = this.normalizeVector(leaderX - alongAway * awayX, leaderY - alongAway * awayY);
	const [sidewaysX, sidewaysY] = sidewaysPull;
	const bearing = this.normalizeVector(awayX + sidewaysX, awayY + sidewaysY);
	const [bearingX, bearingY] = bearing;
	return [targetX + bearingX * standoffRadius, targetY + bearingY * standoffRadius];
};
/**
* Reduces a vector to length one, or to the zero vector when it has no length to speak of.
*
* The zero case is real rather than defensive: two battlers standing on the same tile genuinely
* have no bearing between them, and a leader directly behind the ally genuinely has no sideways
* component. Both answer zero here, and the caller's addition then simply leaves the other term
* standing, which is the correct behavior in each case.
* @param {number} x The x component of the vector.
* @param {number} y The y component of the vector.
* @returns {[number, number]} The [x, y] components of the unit vector.
*/
JABS_AiManager.normalizeVector = function(x, y) {
	const length = Math.hypot(x, y);
	if (length < .01) return [0, 0];
	return [x / length, y / length];
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
	const elementRate = action.getAction().calculateRawElementRate(target.getBattler());
	const newMemory = new JABS_BattleMemory(target.getBattlerId(), action.getBaseSkill().id, elementRate, result.hpDamage);
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
* Do-nothing allies cannot be alerted; they ignore attacks passively. Neither can allies pulling back, who
* would otherwise be dragged straight back toward the fight they were just told to leave.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("canBeAlerted", JABS_Engine.prototype.canBeAlerted);
JABS_Engine.prototype.canBeAlerted = function(attacker, battler) {
	if (!J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("canBeAlerted").call(this, attacker, battler)) return false;
	if (battler.isActor()) {
		const allyAI = battler.getAllyAiMode();
		if (allyAI && allyAI.isDoNothing()) return false;
		if (battler.isPullingBack()) return false;
	}
	return true;
};
/**
* Extends {@link JABS_Engine#processOnHitEffects}.<br/>
* Also rallies the leader's allies whenever the leader lands a hit or takes one.
*/
J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.set("processOnHitEffects", JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target) {
	J.ABS.EXT.ALLYAI.Aliased.JABS_Engine.get("processOnHitEffects").call(this, action, target);
	const caster = action.getCaster();
	this.rallyAlliesForLeaderHit(caster, target);
};
/**
* Rallies the leader's allies toward the other side of a hit the leader was part of.
*
* Every stance answers the leader: whatever an ally would otherwise wait for, the leader striking
* something or being struck sends it toward the fight. A hit that did not involve the leader rallies
* nobody; an ally that was struck itself is alerted by the hit as usual.
* @param {JABS_Battler} caster The battler who landed the hit.
* @param {JABS_Battler} target The battler who took the hit.
*/
JABS_Engine.prototype.rallyAlliesForLeaderHit = function(caster, target) {
	const leader = this.getPlayer1();
	if (caster === leader) {
		this.rallyAlliesToward(target);
		return;
	}
	if (target === leader) {
		this.rallyAlliesToward(caster);
	}
};
/**
* Rallies every ally on the field toward a foe.
* @param {JABS_Battler} foe The battler the allies are rallied toward.
*/
JABS_Engine.prototype.rallyAlliesToward = function(foe) {
	$gameMap.getFollowerBattlers().forEach((ally) => this.rallyAllyToward(ally, foe));
};
/**
* Rallies a single ally toward a foe, by alerting it to where that foe stands.
*
* Being rallied is being alerted: the ally heads toward the foe until something is in sight, then fights
* it, exactly as it would after being struck. Whatever an ally cannot be alerted by, it is not rallied by
* either, which is how a healed friend or a smashed crate rallies nobody, and how an ally already fighting
* keeps to its own fight. The alert is raised quietly, with neither the balloon nor the startled pause a
* hit brings, because the ally is answering its leader rather than being caught off guard.
* @param {JABS_Battler} ally The ally being rallied.
* @param {JABS_Battler} foe The battler the ally is rallied toward.
*/
JABS_Engine.prototype.rallyAllyToward = function(ally, foe) {
	if (!this.canBeAlerted(foe, ally)) return;
	ally.setAlertedCoordinates(foe.getX(), foe.getY());
	ally.setAlertedCounter(ally.getAlertDuration());
};

//#endregion
//#region src/plugins/abs/ext/allyai/managers/JABS_InputAdapter.js
/**
* Orders every ally on the field to charge: each one goes after something to fight right now, whatever
* the party's stance would have it wait for.
*
* Added to the core adapter so that whatever reads the player's input can issue the order without knowing
* how allies carry it out; see {@link JABS_Battler.chargeOnCommand} for that.
*/
JABS_InputAdapter.performAllyCharge = function() {
	$gameMap.getFollowerBattlers().forEach((ally) => ally.chargeOnCommand());
};
/**
* Orders every ally on the field to pull back: each one drops out of whatever it is fighting and stays
* out of every fight for a while.
*
* Added to the core adapter so that whatever reads the player's input can issue the order without knowing
* how allies carry it out; see {@link JABS_Battler.pullBackOnCommand} for that.
*/
JABS_InputAdapter.performAllyPullBack = function() {
	$gameMap.getFollowerBattlers().forEach((ally) => ally.pullBackOnCommand());
};
/**
* Steps the party's stance one rung safer, toward hanging back behind the leader.
*/
JABS_InputAdapter.performAllyStanceSafer = function() {
	this.stepAllyStance(-1);
};
/**
* Steps the party's stance one rung bolder, toward leading the charge ahead of the leader.
*/
JABS_InputAdapter.performAllyStanceBolder = function() {
	this.stepAllyStance(1);
};
/**
* Steps the party's stance along the ladder of stances, and lets the player know how it went.
*
* A player stepping the stance mid-fight is not looking at a menu, so the change has to be heard and read
* without one: a cursor sound and a line in the map's action log when it changes, and a buzzer when the
* stance is already at the end of the ladder and there is nowhere further to step.
* @param {number} step How many rungs to move; positive is bolder, negative is safer.
*/
JABS_InputAdapter.stepAllyStance = function(step) {
	const nextStanceKey = $gameParty.stanceKeyAlongLadder(step);
	if (nextStanceKey === $gameParty.getPartyStance()) {
		SoundManager.playBuzzer();
		return;
	}
	$gameParty.setPartyStance(nextStanceKey);
	SoundManager.playCursor();
	this.logAllyStance();
};
/**
* Writes the party's current stance into the map's action log.
*
* The log belongs to J-Log, which this plugin does not require; without it, the sound is the whole of the
* feedback.
*/
JABS_InputAdapter.logAllyStance = function() {
	if (!J.LOG) return;
	const stance = $gameParty.getPartyStanceType();
	const stanceLog = new ActionLogBuilder().setMessage(`Stance set to \\C[23]${stance.name}\\C[0].`).build();
	$mapLogs.action.addLog(stanceLog);
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
/**
* Extends {@link #realMoveSpeed}.<br/>
* Also lets an ally sprint back into the party's stance when it has strayed far from it.
*
* A follower copies the player's speed every frame, so an ally is never faster than its leader on its own.
* That leaves an ally kept in front of the leader stranded behind them after a turn, for as long as they
* keep walking. The sprint is what lets it get back in front.
* @returns {number}
*/
J.ABS.EXT.ALLYAI.Aliased.Game_Follower.set("realMoveSpeed", Game_Follower.prototype.realMoveSpeed);
Game_Follower.prototype.realMoveSpeed = function() {
	const originalSpeed = J.ABS.EXT.ALLYAI.Aliased.Game_Follower.get("realMoveSpeed").call(this);
	if (!this.isCatchingUpToStance()) return originalSpeed;
	return originalSpeed + J.ABS.EXT.ALLYAI.Metadata.StanceCatchUpSpeedBoost;
};
/**
* Whether this follower is sprinting back into the party's stance right now.
* @returns {boolean} True if it is sprinting, false otherwise.
*/
Game_Follower.prototype.isCatchingUpToStance = function() {
	const battler = this.getJabsBattler();
	if (!battler) return false;
	return battler.isStanceCatchingUp();
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
	const followers = $gamePlayer.followers().data();
	return JABS_AiManager.convertFollowersToBattlers(followers);
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
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set("initMembers", Game_Party.prototype.initMembers);
Game_Party.prototype.initMembers = function() {
	J.ABS.EXT.ALLYAI.Aliased.Game_Party.get("initMembers").call(this);
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
	* The key of the stance the party's allies currently take.
	*
	* The key is what gets saved, never the stance itself, so a stance retuned in a later version reaches
	* every existing save as soon as it loads.
	* @type {string}
	*/
	this._j._abs._allyAI._partyStance = J.ABS.EXT.ALLYAI.Metadata.DefaultStanceType;
};
/**
* Gets the key of the stance the party's allies currently take.
* @returns {string}
*/
Game_Party.prototype.getPartyStance = function() {
	return this._j._abs._allyAI._partyStance;
};
/**
* Sets the stance the party's allies take.
* @param {string} stanceKey The key of the stance to take.
*/
Game_Party.prototype.setPartyStance = function(stanceKey) {
	this._j._abs._allyAI._partyStance = stanceKey;
};
/**
* Gets the stance the party's allies currently take.
*
* A key that names no stance falls back to the default one. The key is saved, so a save written before a
* stance was retired still holds that stance's key, and it should load into a sensible stance rather than
* into none at all.
* @returns {JABS_Stance}
*/
Game_Party.prototype.getPartyStanceType = function() {
	const stanceKey = this.getPartyStance();
	const { StanceTypes } = J.ABS.EXT.ALLYAI.Metadata;
	const stance = StanceTypes.find((stanceType) => stanceType.key === stanceKey);
	return stance ?? StanceTypes[0];
};
/**
* Gets the key of the stance a number of rungs along the ladder from the party's current one.
*
* The stances are listed in ladder order, from hanging back behind the leader to leading the charge ahead
* of them, so a positive step is bolder and a negative one is safer. The ladder does not wrap around: a
* step past either end stays on the end rung, so stepping bolder from the boldest stance never sends the
* party all the way back to the safest one.
* @param {number} step How many rungs to move; positive is bolder, negative is safer.
* @returns {string} The key of the stance that many rungs along, or of the end rung if the step runs out.
*/
Game_Party.prototype.stanceKeyAlongLadder = function(step) {
	const { StanceTypes } = J.ABS.EXT.ALLYAI.Metadata;
	const currentRung = StanceTypes.indexOf(this.getPartyStanceType());
	const lastRung = StanceTypes.length - 1;
	const nextRung = JABS_Stance.clampToRange(currentRung + step, 0, lastRung);
	return StanceTypes[nextRung].key;
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
		* The list of party members whose AI may be configured, plus the party's stance.
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
				this.makeAllyList();
				this.addAllyStanceCommand();
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
	* Injects the party stance command into the menu, naming the stance the party currently takes.
	*/
	addAllyStanceCommand() {
		const currentStance = $gameParty.getPartyStanceType();
		const currentStanceText = `Currently: ${currentStance.name}`;
		const allyStanceCommand = new WindowCommandBuilder(J.ABS.EXT.ALLYAI.Metadata.AllyStanceCommandName).setSymbol("ally-stances").setTextLines([currentStanceText]).flagAsSubText().setIconIndex(J.ABS.EXT.ALLYAI.Metadata.AllyStanceCommandIconIndex).setColorIndex(23).build();
		this.addBuiltCommand(allyStanceCommand);
	}
	/**
	* Adds a do-nothing toggle command at the top of the ally AI selection window.
	* The toggle renders its own state, so it reads correctly whichever way it is set.
	*/
	makeAllyAiDoNothingToggle() {
		const currentActor = $gameActors.actor(this.getActorId());
		if (!currentActor) return;
		const allyAI = currentActor.getAllyAI();
		const isDoNothing = allyAI.isDoNothing();
		const commandName = isDoNothing ? "Do Nothing: ON" : "Do Nothing: OFF";
		const description = isDoNothing ? "This ally hangs back and takes no actions.\nToggle off to restore their preset behavior." : "This ally acts according to their preset.\nToggle on to make them stand down entirely.";
		const colorIndex = isDoNothing ? 3 : 2;
		const iconIndex = isDoNothing ? J.ABS.EXT.ALLYAI.Metadata.DoNothingOnIconIndex : J.ABS.EXT.ALLYAI.Metadata.DoNothingOffIconIndex;
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
//#region src/plugins/abs/ext/allyai/windows/Window_Stances.js
/**
* A window that allows selection from the stances the party's allies can take.
*/
var Window_Stances = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Generates the command list of stances.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds one command for every stance the party can take.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		return J.ABS.EXT.ALLYAI.Metadata.StanceTypes.map(this.buildCommand, this);
	}
	/**
	* Builds the command for a single stance.
	* @param {JABS_Stance} stance The stance to build a command for.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(stance) {
		const { key, name, description } = stance;
		const isEquipped = $gameParty.getPartyStance() === key;
		const iconIndex = isEquipped ? J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex : J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex;
		return new WindowCommandBuilder(name).setSymbol("select-stance").setTextLines(description.split(/[\r\n]/i)).flagAsSubText().setIconIndex(iconIndex).setEnabled(true).setExtensionData(stance).build();
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
* The party list stays on screen the entire time, and whatever is being chosen for the highlighted ally
* sits beside it- so the player can always read one ally's settings against the rest of the party.
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
		this.createStanceListWindow();
		this.focusPartyList();
	}
	/**
	* Creates the list of party members whose AI may be configured.
	*/
	createPartyListWindow() {
		const window = new Window_AllyAiSelect(this.partyListRect(), Window_AllyAiSelect.Types.PartyList);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("party-member", this.commandSelectMemberAi.bind(this));
		window.setHandler("ally-stances", this.commandAllyStances.bind(this));
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
	* Creates the list of stances the party can take.
	*/
	createStanceListWindow() {
		const window = new Window_Stances(this.detailRect());
		window.setHandler("cancel", this.focusPartyList.bind(this));
		window.setHandler("select-stance", this.commandSelectAllyStance.bind(this));
		window.setHelpWindow(this.helpWindow());
		this.setStanceListWindow(window);
		this.addWindow(window);
		window.hide();
		window.deactivate();
	}
	/**
	* The share of the content area given to the party column.
	*
	* The party gets the smaller half because its rows are names, while the column beside it carries
	* presets and stances that each explain themselves across a second line.
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
	* The shape of the column beside the party, shared by the presets and the stances.
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
		this.stanceListWindow().hide();
		this.stanceListWindow().deactivate();
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
	* Applies the chosen preset to the chosen ally.
	*/
	commandEquipMemberAi() {
		const newPreset = this.presetListWindow().currentExt();
		const allyAi = $gameActors.actor(this.chosenActorId()).getAllyAI();
		allyAi.applyPreset(newPreset.key);
		this.presetListWindow().refresh();
		this.presetListWindow().activate();
	}
	/**
	* Toggles whether the chosen ally acts at all.
	*/
	commandToggleDoNothing() {
		SoundManager.playRecovery();
		const allyAi = $gameActors.actor(this.chosenActorId()).getAllyAI();
		allyAi.setDoNothing(!allyAi.isDoNothing());
		this.presetListWindow().refresh();
		this.presetListWindow().activate();
	}
	/**
	* Shows the stances the party can take.
	*/
	commandAllyStances() {
		this.focusDetail(this.stanceListWindow());
	}
	/**
	* Applies the chosen stance to the party.
	*/
	commandSelectAllyStance() {
		/** @type {JABS_Stance} */
		const selectedStance = this.stanceListWindow().currentExt();
		$gameParty.setPartyStance(selectedStance.key);
		this.stanceListWindow().refresh();
		this.partyListWindow().refresh();
		this.stanceListWindow().activate();
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
	* Gets the stance list.
	* @returns {Window_Stances}
	*/
	stanceListWindow() {
		return this._stanceListWindow;
	}
	/**
	* Sets the stance list.
	* @param {Window_Stances} window The window to track.
	*/
	setStanceListWindow(window) {
		this._stanceListWindow = window;
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