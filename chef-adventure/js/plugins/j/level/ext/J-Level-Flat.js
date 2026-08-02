//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.1 LEVEL-FLAT] Flat per-level thresholds and map-based kill experience.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-LevelMaster
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-LevelMaster
 * @help
 * ============================================================================
 * OVERVIEW
 * This extension rewrites the experience curve from a scaling formula based on
 * the inputs in the RMMZ editor for a class to become a flat amount for every
 * level- instead relying on level difference to define experience gained.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-LevelMaster; scaling knobs for combat/rewards still apply to non-EXP
 *   rewards. This plugin layers on top for the EXP-specific paths described
 *   below.
 * - J-ABS; kill EXP is decided when JABS asks how much experience the defeat
 *   was worth.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * As mentioned above, this overwrites the experience curve and replaces the
 * functionality with a flat amount per level required to level up. This forces
 * the dev and players to play heavier around levels and removes the burden of
 * attempting to balance experience gain with any other suite of factors that
 * may influence it.
 *
 * For awareness, the map revolves around the notion that it demands the player
 * defeat ~40 enemies of equal level in order to level up. If the enemy is
 * above or below the level of the attacker (or average party level for default
 * battles), then the experience is modified accordingly. "What is that
 * modification?" you might be asking. Here is the full range of +/- 15 level
 * table of experience gain for you to understand, where "diff" is the
 * difference in level between the actor and the enemy, and the "exp" is the
 * amount of experience gained according to the policy. The plugin parameter
 * "Exp Policy Multiplier" will multiply the "exp" value from this table. Given
 * the defaults, the N of "// N" seen in the table below represents the rough
 * number of enemies that must be defeated in order to level up.
 *
   [
    {
      diff: -15,
      exp: 0
    }, // impossible to level.
    {
      diff: -14,
      exp: 1
    },  // 1000
    {
      diff: -13,
      exp: 1
    },  // 1000
    {
      diff: -12,
      exp: 1
    },  // 1000
    {
      diff: -11,
      exp: 1
    },  // 1000
    {
      diff: -10,
      exp: 1
    },  // 1000
    {
      diff: -9,
      exp: 3
    },  // 334
    {
      diff: -8,
      exp: 6
    },  // 166
    {
      diff: -7,
      exp: 10
    },  // 100
    {
      diff: -6,
      exp: 12
    },  // 83
    {
      diff: -5,
      exp: 14
    },  // 72
    {
      diff: -4,
      exp: 16
    },  // 63
    {
      diff: -3,
      exp: 18
    },  // 56
    {
      diff: -2,
      exp: 20
    },  // 50
    {
      diff: -1,
      exp: 22
    },  // 45
    {
      diff: 0,
      exp: 25
    },  // 40 - baseline
    {
      diff: 1,
      exp: 30
    },  // 33
    {
      diff: 2,
      exp: 35
    },  // 29
    {
      diff: 3,
      exp: 40
    },  // 25
    {
      diff: 4,
      exp: 50
    },  // 20
    {
      diff: 5,
      exp: 65
    },  // 16
    {
      diff: 6,
      exp: 80
    },  // 12
    {
      diff: 7,
      exp: 100
    },  // 10
    {
      diff: 8,
      exp: 150
    },  // 7
    {
      diff: 9,
      exp: 200
    },  // 5
    {
      diff: 10,
      exp: 250
    },  // 4
    {
      diff: 11,
      exp: 334
    },  // 3
    {
      diff: 12,
      exp: 500
    },  // 2
    {
      diff: 13,
      exp: 666
    },  // 2
    {
      diff: 14,
      exp: 750
    },  // 2
    {
      diff: 15,
      exp: 1000
    },  // 1
  ]
 *
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own. Everything here is tuned entirely
 * through the plugin parameters below (Exp Required Per Level, Exp Policy
 * Multiplier) and the level-difference table above- there's nothing to tag
 * on individual database objects.
 * ============================================================================
 * NOTE ABOUT EXR:
 * Party members still apply their experience rate (exr) when the engine
 * actually grants EXP. This plugin does not fold exr into the policy number;
 * that stays the engine's job in gainExp.


 *
 * ----------------------------------------------------------------------------
 * NOTE ABOUT LEVEL:
 * Depending on the form of battle, the plugin will assess the level difference
 * differently. In default turn-based battles, the level will be the average
 * level of the party (mostly due to scope availability- or lack thereof). In
 * JABS on-the-map combat, the level of the one dealing the killing blow will
 * be the one used to determine the experience gained for all members of the
 * party.
 *
 * ----------------------------------------------------------------------------
 * PLUGIN PARAMETERS:
 * The plugin parameters provide some arbitrary defaults for the the flat
 * leveling experience.
 *
 * Exp Required Per Level:
 * By default, this is set to 1000. This means that each level requires 1000
 * experience points to be gained in order to level up. This is tailored to
 * the plugin's experience ladder based on level difference. You can adjust
 * this to adjust how much experience is required to level up, but you'll also
 * want to probably adjust the policy multiplier below to adapt.
 *
 * Exp Policy Multiplier:
 * A multiplier against the experience ladder based on level difference. This
 * allows you to multiply the base amount of experience gained by defeating
 * enemies. The current default is 1.00, but expects pretty high numbers of
 * enemies to be defeated in order to level up (40 if levels are equal).
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Flat experience gain now consults the shared reward-policy gate
 *    (canGainReward), so inanimate enemies grant none.
 *    Reads $gameSystem.isLevelScalingEnabled() instead of the static
 *    J.LEVEL.Metadata.enabled flag.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfigFlat
 * @text FLAT
 *
 * @param exp-per-level
 * @parent parentConfigFlat
 * @type number
 * @text Exp Required Per Level
 * @desc What the flat amount of experience per level required to level up.
 * @decimals 0
 * @min 1
 * @default 1000
 *
 * @param policy-multiplier
 * @parent parentConfigFlat
 * @type number
 * @decimals 2
 * @text Exp Policy Multiplier
 * @desc The multiplier for base experience gained via the flat experience policy.
 * @default 1.00
 */
//endregion annotations

//#region src/plugins/level/ext/flat/_metadata/_pluginMetadata.js
var JLevelMasterFlat_PluginMetadata = class extends PluginMetadata {
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
		* The flat experience required to level up.
		* @type {number}
		*/
		this.expPerLevel = Number(this.parsedPluginParameters["exp-per-level"]) || 1e3;
		/**
		* The multiplier for base experience policy calculations.
		* @type {number}
		*/
		this.policyMultiplier = Number(this.parsedPluginParameters["policy-multiplier"]) || 1;
	}
};

//#endregion
//#region src/plugins/level/ext/flat/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The parent namespace must exist when this ext loads after J-LevelMaster.
*/
J.LEVEL ||= {};
J.LEVEL.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.LEVEL.EXT.FLAT = {};
/**
* The metadata associated with this plugin.
*/
J.LEVEL.EXT.FLAT.Metadata = new JLevelMasterFlat_PluginMetadata("J-LEVEL-Flat", "1.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.LEVEL.EXT.FLAT.Aliased = {};
J.LEVEL.EXT.FLAT.Aliased.Game_Troop = new Map();

//#endregion
//#region src/plugins/level/ext/flat/managers/ExperienceManager.js
/**
* A manager class for calculating experience gained.
*/
var ExperienceManager = class {
	/**
	* The base experience gained when there is no difference in level between the attacker and defender.
	*/
	static #parityExperience = 25;
	/**
	* The absolute minimum experience gained when the attacker's level is too far below the defender's.
	* @type {number}
	*/
	static #minimumExperience = 0;
	/**
	* The absolute maximum experience gained when the attacker's level is too far above the defender's.
	* @type {number}
	*/
	static #maximumExperience = 1e3;
	/**
	* The map of level differences to experience gained.
	* @type {Map<number, number>}
	*/
	static #experienceMap = new Map([
		{
			diff: -15,
			exp: this.#minimumExperience
		},
		{
			diff: -14,
			exp: 1
		},
		{
			diff: -13,
			exp: 1
		},
		{
			diff: -12,
			exp: 1
		},
		{
			diff: -11,
			exp: 1
		},
		{
			diff: -10,
			exp: 1
		},
		{
			diff: -9,
			exp: 3
		},
		{
			diff: -8,
			exp: 6
		},
		{
			diff: -7,
			exp: 10
		},
		{
			diff: -6,
			exp: 12
		},
		{
			diff: -5,
			exp: 14
		},
		{
			diff: -4,
			exp: 16
		},
		{
			diff: -3,
			exp: 18
		},
		{
			diff: -2,
			exp: 20
		},
		{
			diff: -1,
			exp: 22
		},
		{
			diff: 0,
			exp: this.#parityExperience
		},
		{
			diff: 1,
			exp: 30
		},
		{
			diff: 2,
			exp: 35
		},
		{
			diff: 3,
			exp: 40
		},
		{
			diff: 4,
			exp: 50
		},
		{
			diff: 5,
			exp: 65
		},
		{
			diff: 6,
			exp: 80
		},
		{
			diff: 7,
			exp: 100
		},
		{
			diff: 8,
			exp: 150
		},
		{
			diff: 9,
			exp: 200
		},
		{
			diff: 10,
			exp: 250
		},
		{
			diff: 11,
			exp: 334
		},
		{
			diff: 12,
			exp: 500
		},
		{
			diff: 13,
			exp: 666
		},
		{
			diff: 14,
			exp: 750
		},
		{
			diff: 15,
			exp: this.#maximumExperience
		}
	].map(({ diff, exp }) => [diff, exp]));
	/**
	* Calculates the experience gained based on the level difference between two battlers.
	* @param {number} levelA The level of the rewardee.
	* @param {number} levelB The level of the defeated target.
	* @returns {number} The experience gained.
	*/
	static calculateRewardFromLevelDifference(levelA, levelB) {
		const baseExp = this.#experienceByLevelDifference(levelA, levelB);
		return this.#applyExpModifications(baseExp);
	}
	/**
	* Calculates the experience reward based on the level difference between two battlers.
	* @param {number} levelA The level of the rewardee.
	* @param {number} levelB The level of the defeated target.
	* @returns {number} The experience gained.
	*/
	static #experienceByLevelDifference(levelA, levelB) {
		if (!levelA || !levelB) return this.#parityExperience;
		const levelDifference = levelB - levelA;
		if (levelDifference === 0) return this.#parityExperience;
		if (levelDifference < -15) return this.#minimumExperience;
		if (levelDifference > 15) return this.#maximumExperience;
		return this.#experienceMap.get(levelDifference);
	}
	/**
	* Applies the experience modifications based on the policy multiplier.
	* @param {number} baseExp The base experience gained.
	* @returns {number} The experience gained.
	*/
	static #applyExpModifications(baseExp) {
		const scaledExp = Math.round(baseExp * J.LEVEL.EXT.FLAT.Metadata.policyMultiplier);
		const normalizedExp = Math.max(scaledExp, this.#minimumExperience);
		return normalizedExp;
	}
};

//#endregion
//#region src/plugins/level/ext/flat/objects/Game_Actor.js
/**
* Overwrites {@link #expForLevel}.<br/>
* Uses the flat-experience formula.
* @param {number} level The level to calculate the experience for.
* @returns {number}
*/
Game_Actor.prototype.expForLevel = function(level) {
	if (level <= 1) return 0;
	const formula = (level - 1) * J.LEVEL.EXT.FLAT.Metadata.expPerLevel;
	return formula;
};

//#endregion
//#region src/plugins/level/ext/flat/objects/Game_Troop.js
/**
* Extends {@link #expTotal}.<br/>
* Uses the flat-experience gained formula.
*/
J.LEVEL.EXT.FLAT.Aliased.Game_Troop.set("expTotal", Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function() {
	if ($gameSystem.isLevelScalingEnabled()) {
		return this.getFlatExpResult();
	} else {
		return J.LEVEL.EXT.FLAT.Aliased.Game_Troop.get("expTotal").call(this);
	}
};
/**
* Determines the amount of experience gained based on the average battle party compared to each defeated enemy.
* This function scales experience to the flat level system.
* @returns {number}
*/
Game_Troop.prototype.getFlatExpResult = function() {
	const deadEnemies = this.deadMembers();
	const averageActorLevel = $gameParty.averageActorLevel();
	const reducer = (accumulativeExpTotal, currentEnemy) => {
		const baseExp = ExperienceManager.calculateRewardFromLevelDifference(averageActorLevel, currentEnemy.level);
		const total = baseExp + currentEnemy.exp();
		return accumulativeExpTotal + total;
	};
	return Math.round(deadEnemies.reduce(reducer, 0));
};

//#endregion
//#region src/plugins/level/ext/flat/managers/JABS_Engine.js
if (J.ABS) {
	/**
	* Overwrites {@link #determineExperienceGained}.<br/>
	* Replaces with the flat-experience logic.
	* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
	* @param {Game_Actor} victoriousActor The actor that defeated the enemy.
	*/
	JABS_Engine.prototype.determineExperienceGained = function(defeatedEnemy, victoriousActor) {
		if (this.canGainReward(defeatedEnemy, victoriousActor) === false) return 0;
		const baseExperience = ExperienceManager.calculateRewardFromLevelDifference(victoriousActor.level, defeatedEnemy.level);
		const withBonusExperience = defeatedEnemy.exp() + baseExperience;
		return withBonusExperience;
	};
}

//#endregion
//# sourceMappingURL=J-Level-Flat.js.map