//region initialization
/*:
 * @target MZ
 * @plugindesc [v1.3.1 LEVEL] Allows levels to have greater control and purpose.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin scales various data points based on the difference between the
 * actor and enemy's levels. This also bestows a new "level" property upon
 * enemies, meaning they too can leverage their level in damage formulas for
 * skills and whatever other scripting shenanigans you want to do.
 *
 * The various data points include:
 * - damage
 * - experience
 * - gold
 *
 * See below SAMPLE CALCULATIONS to understand how the scaling works.
 *
 * CAUTION:
 * This probably won't work with any other plugins that mess with the
 * level functionality of battlers.
 *
 * Integrates with others of mine plugins:
 * - J-ABS; enables per-event-enemy level overrides.
 * - J-NATURAL; handles level-based max hp/mp/tp growths.
 *
 * ============================================================================
 * PLUGIN PARAMETERS BREAKDOWN:
 *  - Start Enabled:
 *      The scaling functionality will be enabled when a newgame is started.
 *      Defaults to true.
 *  - Minimum Multiplier (Combat):
 *      Clamp floor for damage and other combat uses of level scaling.
 *      Defaults to 0.1x.
 *  - Maximum Multiplier (Combat):
 *      Clamp ceiling for combat scaling.
 *      Defaults to 2.0x.
 *  - Minimum / Maximum Multiplier (Rewards):
 *      Separate clamps for EXP and gold from level scaling. When blank, combat values are used.
 *      Defaults to match combat.
 *  - Growth Multiplier:
 *      The amount the multiplier changes per level of difference.
 *      Defaults to 0.1x per level of difference.
 *  - Upper Invariance:
 *      The amount above 0 levels of difference before scaling is applied.
 *      See the SAMPLE CALCULATIONS below for examples.
 *      Defaults to 1 level.
 *  - Lower Invariance:
 *      The amount below 0 levels of difference before scaling is applied.
 *      See the SAMPLE CALCULATIONS below for examples.
 *      Defaults to 1 level.
 *  - Actor Balancer:
 *      A variableId whose value is added to all actor's levels.
 *      This DOES impact how their levels are perceived by RMMZ.
 *      Defaults to variableId 141.
 *  - Enemy Balancer:
 *      A variableId whose value is added to all enemy's levels.
 *      Only really applies to scaling since enemies usually lack levels.
 *      Defaults to variableId 142.
 *  - Single Level Across Classes:
 *      Whether all classes share one actor-wide level/exp instead of each
 *      class leveling independently (vanilla RMMZ behavior).
 *      Defaults to true.
 *  - Canonical Curve (Basis/Extra/Acceleration A/B):
 *      The four inputs to the class-independent exp curve used when Single
 *      Level is on. Ignored if another plugin (e.g. J-Level-Flat) overrides
 *      expForLevel; only matters as the honest default when nothing else does.
 * ============================================================================
 * SINGLE LEVEL ACROSS CLASSES:
 * By default, RPG Maker MZ tracks experience per-class (Game_Actor._exp is
 * keyed by classId), so switching to a class you haven't played resets you to
 * level 1 even if your other classes are deep into the double digits. With
 * this setting enabled, every class always agrees on the same level and exp
 * for a given actor- _exp remains an object keyed by classId (for
 * compatibility with anything that expects that shape), but every key is kept
 * in sync with every write, so there is effectively only one level per actor.
 *
 * Switching classes no longer resets or re-derives level from a per-class
 * exp bucket. It also retroactively grants every learning on the destination
 * class at or below your current level (mirroring how a fresh actor learns
 * everything up to their initial level), so jumping into a brand new class at
 * level 40 doesn't skip past its first 40 levels of learnings.
 *
 * This is intentionally orthogonal to per-class stat growth (see J-NATURAL):
 * J-NATURAL banks permanent stat growth once per level-up, sourced from
 * whichever class is active in that exact moment. With levels shared, playing
 * many classes no longer punishes you with a level-1 reset, but the stat
 * growth you bank is still shaped entirely by which classes you actually
 * spent those levels playing.
 * ============================================================================
 * LEVEL TAGS:
 * Have you ever wanted to scale damage/experience/gold by level, but realized
 * that enemies in RMMZ don't have a level parameter? Well now you can! By
 * adding the appropriate tags to various locations in the database, you too
 * can scale numbers to your hearts content!
 *
 * NOTE ABOUT LEVEL ZERO:
 * The level-scaling utility has no concept of actor or enemy when performing
 * its calculations. With that in mind, be cognizant of the magic level of
 * zero. If a level ever ends up being zero, that battler will be identified
 * as a "non-level", aka level scaling won't apply and all multipliers to and
 * from that battler will be 1.0x. Level can drop below zero, though, so just
 * stay aware when doing unusual things, like trying to add a state that grants
 * bonus levels for a scaling bonus to a non-level enemy.
 *
 * NOTE ABOUT REWARDS:
 * The way the math works out for the level-scaling calculations, the inputs
 * for levels are entered in reverse from the way they are in combat formulas!
 * If it helps you, you can think of it like enemies using a skill against
 * each member of your party that gives experience- and is affected by the
 * normal level-scaling mechanics. The same applies to gold rewards.
 *
 * NOTE ABOUT WORKING WITH JABS:
 * If a level is present on an event that is identified as a JABS enemy, this
 * level will override whatever is present on the database note section. You
 * can think of the event as the real level, while the database notes are the
 * "default" level for enemies. The overriden level still gets combined with
 * any other modifications from states and whatnot. If an enemy has a level, by
 * default it will show up in their battler name. If it is desired to be
 * hidden, it can be converted to ??? by using the hide level tag.
 *
 * DETAILS:
 * This was initially designed only for enemies, but has since been expanded to
 * also allow you to apply modifiers to your actors as well. For enemies, since
 * they do not innately have levels, the total amount of "level" is the sum of
 * all tags found for a given enemy across itself and any states that may be
 * applied to an enemy. For actors, it starts with whatever their current level
 * is, and if states/classes/equipment/skills also contain the tags, the level
 * modifiers will be stacked against the actor's base level.
 *
 * ENEMY TAG USAGE:
 * - Enemies
 * - States
 * - Events (w/ JABS)
 *
 * ACTOR TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <lv:NUM> or <lvl:NUM> or <level:NUM>
 * Where NUM is the level value to set/modify. (can be negative)
 *
 * TAG EXAMPLES:
 *  <level:4>
 * On enemies, if on the enemy, it would set their base level to 4.
 * On enemies, if on a state, it would grant a +4 modifier to their base level.
 * On events, this will override whatever the JABS enemy's level would be.
 * On actors, this would grant a +4 level modifier to their base level.
 *
 *  <level:-2>
 * On enemies, if on the enemy, it would do nothing.
 * On enemies, if on a state, and they have a base level set,
 *  this will grant a -2 modifier to their base level.
 * On actors, this will grant a -2 modifier to their base level.
 *
 *  <hideLevel>
 * On enemies, this will turn the level into "???" instead of the level value.
 * On events, this will override a singular enemy into hiding the value.
 * On states, this will do nothing.
 *
 * ============================================================================
 * SKILL LEARNING TAGS
 * Have you ever wanted enemies to learn new skills as they "level up"? Well,
 * now you can! By applying the appropriate tag w/ data points to the enemies,
 * you too can have enemies obtain new skills as they reach ever-higher levels!
 *
 * NOTE ABOUT LEVELS AND SKILLS:
 * The actual skill needs to be in the actions list of an enemy in order for it
 * to ever be available. The tag is basically a "guard" that level-checks before
 * allowing the skill to be included in the skill list when the list of skills
 * for an enemy is grabbed and mapped.
 *
 * NOTE ABOUT COMPATIBILITY:
 * Due to the nature of how this functionality works, this tag probably won't
 * work as-intended outside of JABS. An extension would need to be drafted
 * that leverages the Game_Enemy.prototype.skills function to determine their
 * available skills instead of the default- which directly parses the actions.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <learning:[SKILL_ID, LEVEL_LEARNED]>
 * Where SKILL_ID is the skill being learned, and LEVEL_LEARNED is the level
 * at which the enemy must be before the skill becomes available to them.
 *
 * TAG EXAMPLE:
 *  <learning:[210, 10]>
 * An enemy with this tag will have skill of ID 210 become "learned" when the
 * enemy is level 10 or higher.
 *
 * ============================================================================
 * BEYOND THE MAX LEVELS
 * Have you ever wanted levels to exceed 99? Well now you can! By properly
 * setting the plugin configuration, you too can reach beyond the max level!
 *
 * NOTE ABOUT PLUGIN CONFIGURATION:
 * There are two important values that should be considered when working with
 * beyond max level tags: the "default beyond max level" value- aka the "base",
 * and the "max boosted level" value- aka the "cap", as they influence the tags
 * in this section.
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
 *  <maxLevelBoost:AMOUNT>
 * Where AMOUNT is a negative or positive integer applied to the base beyond
 * max level.
 *
 * TAG EXAMPLES:
 *  <maxLevelBoost:+25> (on the actor)
 * The actor with this tag will have a +25 modifier to their base max level,
 * but no higher than the cap max level.
 *
 *  <maxLevelBoost:+100> (on the actor)
 *  <maxLevelBoost:-25> (on an equipped weapon)
 * The actor with these tags will have a +75 (100-25=75) modifier to their base
 * max level, but no higher than the cap max level.
 *
 *  <maxLevelBoost:-50> (on the actor)
 *  <maxLevelBoost:-25> (on a learned skill for the actor)
 *  <maxLevelBoost:+10> (on a state applied to the actor)
 * The actor with these tags will have a -65 (-50-25+10=-65) modifier to their
 * base max level.
 *
 * ============================================================================
 * SAMPLE CALCULATIONS:
 * Here is an example back and forth encounter between an allied party and
 * enemy party.
 *
 * Let us assume you are using the default plugin parameters.
 *
 * You have a party that looks like this:
 * - Gilbert  lv12
 * - Susan    lv14
 * - Frank    lv11
 * - Ophelia  lv35
 *
 * And you are fighting an enemy troop that looks like this:
 * - Slime      lv12  (10xp)
 * - Goblin     lv13  (14xp)
 * - Gigagoblin lv20  (55xp)
 * - Red Slime  lv16  (21xp)
 *
 * Gilbert attacks Slime!
 * They are the same level.
 * Damage is not modified; 1.0x.
 *
 * Susan attacks Slime!
 * Susan is 2 levels over the slime.
 * There is 1 level of upper invariance.
 * The actual variance is +1 level difference.
 * The growth per level of difference is 0.1x.
 * Damage is increased; 1.1x for this attack.
 *
 * Goblin attacks Gilbert!
 * The attacker(Goblin) is 1 level over the defender(Gilbert).
 * There is 1 level of upper invariance.
 * The actual variance is 0 level difference.
 * Damage is not modified; 1.0x.
 *
 * Gigagoblin attacks Susan!
 * The attacker(Gigagoblin) is 6 levels over the defender(Susan).
 * There is 1 level of upper invariance.
 * The actual variance is +5 level difference.
 * The growth per level of difference is 0.1x.
 * Damage is increased; 1.5x for this attack.
 *
 * Ophelia attacks Gigagoblin!
 * The attacker(Ophelia) is 15 levels over the defender(Gigagoblin).
 * There is 1 level of lower invariance.
 * The actual variance is +14 level difference.
 * The growth per level of difference is 0.1x.
 * The actual multiplier is 2.4x.
 * The cap multiplier is 2.0x.
 * Damage is increased; capped at 2.0x (from 2.4x).
 *
 * Frank attacks Red Slime!
 * The attacker(Frank) is 5 levels under the defender(Red Slime).
 * There is 1 level of lower invariance.
 * The actual variance is -4 level difference.
 * The reduction per level of difference is -0.1x.
 * Damage is reduced; 0.6x for this attack.
 *
 * Gigagoblin attacks Ophelia!
 * The attacker(Gigagoblin) is 15 levels under the defender(Ophelia).
 * There is 1 level of lower invariance.
 * The actual variance is -14 level difference.
 * The reduction per level of difference is -0.1x.
 * The actual multiplier is -0.4x.
 * (which would actually heal the defender!!!)
 * The minimum multiplier is 0.1x.
 * Damage is reduced; capped at 0.1x for this attack.
 *
 * Eventually, all enemies are defeated (thanks Ophelia!).
 * Average the actor's party level (18).
 * There is 1 level of upper/lower invariance.
 *
 * Party average of 18 is 6 levels over the slime, -1 for invariance.
 * Slime experience (10) is multiplied by 0.5x; 5xp.
 * Party average of 18 is 5 levels over the goblin, -1 for invariance.
 * Goblin experience (14) is multiplied by 0.6x; 8.4xp.
 * Party average of 18 is 2 levels under the gigagoblin, +1 for invariance.
 * Gigagoblin experience (55) is multiplied by 1.1x; 60.5xp.
 * Party average of 18 is 2 levels over the red slime, -1 for invariance.
 * Red Slime experience (21) is multiplied by 0.9x; 18.9xp.
 * Each member of the party gains 92.8 experience.
 *
 * This same logic is again applied to gold from each defeated enemy.
 * ============================================================================
 * CHANGELOG:
 * - 1.4.0
 *    Added Single Level Across Classes: actors can now share one level/exp
 *    across all classes instead of leveling each class independently, with
 *    a class-independent canonical exp curve and retroactive learning
 *    backfill on class change.
 * - 1.3.1
 *    Updated battler name rendering support for compatibility.
 * - 1.3.0
 *    Added reward-specific min/max multipliers; LevelScaling.multiplier accepts combat vs reward scope.
 * - 1.2.1
 *    Fixed issue with level overrides not apply J-NATURAL growths.
 * - 1.2.0
 *    Added ability to override JABS enemies on the map with a new level.
 * - 1.1.1
 *    Added ability to manipulate max level for actors.
 *    Adapted extended plugin metadata structure.
 * - 1.1.0
 *    Refactored various data retrieval methods from given battlers.
 *    Fixed issue with mismapped level calculations.
 *    Added more jsdocs and comments to explain better the logical flow.
 *    Removed useless methods.
 *    Updated example battle scenario to be more verbose.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param parentConfigScaling
 * @text SCALING
 *
 * @param useScaling
 * @parent parentConfigScaling
 * @type boolean
 * @text Start Enabled
 * @desc Whether or not this scaling functionality is enabled by default.
 * @on Enabled By Default
 * @off Disabled By Default
 * @default true
 *
 * @param minMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Minimum Multiplier (Combat)
 * @desc Min for damage and parry. EXP/gold use reward params when set.
 * @default 0.10
 *
 * @param maxMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Maximum Multiplier (Combat)
 * @desc Clamp ceiling for combat scaling.
 * @default 2.00
 *
 * @param rewardMinMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Minimum Multiplier (Rewards)
 * @desc Min for scaled EXP/gold. Missing param uses combat minimum.
 * @default 0.10
 *
 * @param rewardMaxMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Maximum Multiplier (Rewards)
 * @desc Max for scaled EXP/gold. Missing param uses combat maximum.
 * @default 2.00
 *
 * @param growthMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Growth Multiplier
 * @desc The amount of growth per level of difference.
 * @default 0.10
 *
 * @param invariantUpperRange
 * @parent parentConfigScaling
 * @type number
 * @text Upper Invariance
 * @desc The amount of level difference over 0 before scaling takes effect.
 * @default 1
 *
 * @param invariantLowerRange
 * @parent parentConfigScaling
 * @type number
 * @text Lower Invariance
 * @desc The amount of level difference under 0 before scaling takes effect.
 * @default 1
 *
 * @param variableActorBalancer
 * @parent parentConfigScaling
 * @type variable
 * @text Actor Balancer
 * @desc The variable id to act as a constant level modifier in favor of actors.
 * @default 141
 *
 * @param variableEnemyBalancer
 * @parent parentConfigScaling
 * @type variable
 * @text Enemy Balancer
 * @desc The variable id to act as a constant level modifier in favor of enemies.
 * @default 142
 *
 * @param parentConfigActorLevels
 * @text ACTOR LEVELS
 *
 * @param useSharedActorLevel
 * @parent parentConfigActorLevels
 * @type boolean
 * @text Single Level Across Classes
 * @desc Whether all classes track one shared actor level/exp instead of leveling independently per-class.
 * @on Shared
 * @off Independent (vanilla)
 * @default true
 *
 * @param canonicalExpBasis
 * @parent parentConfigActorLevels
 * @type number
 * @text Canonical Curve: Basis
 * @desc Used only when Single Level is on and no other plugin (e.g. J-Level-Flat) overrides expForLevel.
 * @default 30
 *
 * @param canonicalExpExtra
 * @parent parentConfigActorLevels
 * @type number
 * @text Canonical Curve: Extra
 * @desc See Canonical Curve: Basis.
 * @default 20
 *
 * @param canonicalExpAccA
 * @parent parentConfigActorLevels
 * @type number
 * @text Canonical Curve: Acceleration A
 * @desc See Canonical Curve: Basis.
 * @default 30
 *
 * @param canonicalExpAccB
 * @parent parentConfigActorLevels
 * @type number
 * @text Canonical Curve: Acceleration B
 * @desc See Canonical Curve: Basis.
 * @default 30
 *
 * @param parentConfigMaxLevel
 * @text MAX LEVEL
 *
 * @param defaultBeyondMaxLevel
 * @parent parentConfigMaxLevel
 * @type number
 * @min 100
 * @max 1000
 * @text Default Beyond Max Level
 * @desc The default for what the max level is if beyond the cap. Requires max level for actors to be set to 99.
 * @default 255
 *
 * @param trueMaxLevel
 * @parent parentConfigMaxLevel
 * @type number
 * @min 1
 * @max 1000
 * @text Max Boosted Level
 * @desc The max level your level can be. While this is intended to always be beyond the max, it can be lower.
 * @default 1000
 *
 *
 * @command enableScaling
 * @text Enable Scaling
 * @desc Enables the scaling functionality for damage/rewards.
 *
 * @command disableScaling
 * @text Disable Scaling
 * @desc Disables the scaling functionality for damage/rewards.
 */

//#region src/plugins/level/core/_metadata/_pluginMetadata.js
var J_LevelPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	postInitialize() {
		super.postInitialize();
		this.initializeLevelMaster();
	}
	initializeLevelMaster() {
		/**
		* Whether or not the scaling functionality is enabled.
		* @type {boolean}
		*/
		this.enabled = this.parsedPluginParameters["useScaling"] === "true";
		/**
		* The minimum multiplier that scaling can reduce to based on level difference. This should never actually be zero
		* or lower or unexpected things can happen.
		* @type {number}
		*/
		this.minimumMultiplier = Number(this.parsedPluginParameters["minMultiplier"]);
		/**
		* The maximum multiplier that scaling can reach based on level difference.
		* @type {number}
		*/
		this.maximumMultiplier = Number(this.parsedPluginParameters["maxMultiplier"]);
		const rewardMinRaw = this.parsedPluginParameters["rewardMinMultiplier"];
		/**
		* The minimum multiplier for reward scaling (EXP / gold). Falls back to combat minimum when unset.
		* @type {number}
		*/
		this.rewardMinimumMultiplier = rewardMinRaw === undefined || rewardMinRaw === "" ? this.minimumMultiplier : Number(rewardMinRaw);
		if (Number.isFinite(this.rewardMinimumMultiplier) === false) {
			this.rewardMinimumMultiplier = this.minimumMultiplier;
		}
		const rewardMaxRaw = this.parsedPluginParameters["rewardMaxMultiplier"];
		/**
		* The maximum multiplier for reward scaling (EXP / gold). Falls back to combat maximum when unset.
		* @type {number}
		*/
		this.rewardMaximumMultiplier = rewardMaxRaw === undefined || rewardMaxRaw === "" ? this.maximumMultiplier : Number(rewardMaxRaw);
		if (Number.isFinite(this.rewardMaximumMultiplier) === false) {
			this.rewardMaximumMultiplier = this.maximumMultiplier;
		}
		/**
		* The amount per level up or down that applies. This amount stacks additively.
		* @type {number}
		*/
		this.growthMultiplier = Number(this.parsedPluginParameters["growthMultiplier"]);
		/**
		* The upper limit from a zero level difference before scaling kicks in.
		* @type {number}
		*/
		this.invariantUpperRange = Number(this.parsedPluginParameters["invariantUpperRange"]);
		/**
		* The lower limit from a zero level difference before scaling kicks in.
		* @type {number}
		*/
		this.invariantLowerRange = Number(this.parsedPluginParameters["invariantLowerRange"]);
		/**
		* The variableId to set to modify the actor level balancer value. This number is directly added to all actors'
		* levels when considering scaling.
		* @type {number}
		*/
		this.actorBalanceVariable = Number(this.parsedPluginParameters["variableActorBalancer"]);
		/**
		* The variableId to set to modify the enemy level balancer value. This number is directly added to all enemies'
		* levels when considering scaling.
		* @type {number}
		*/
		this.enemyBalanceVariable = Number(this.parsedPluginParameters["variableEnemyBalancer"]);
		/**
		* The default max level beyond the max set by the database.
		* @type {number}
		*/
		this.defaultBeyondMaxLevel = Number(this.parsedPluginParameters["defaultBeyondMaxLevel"]);
		/**
		* The true max level. No actor level can ascend beyond this. This will override actor max level if applicable.
		* @type {number}
		*/
		this.trueMaxLevel = Number(this.parsedPluginParameters["trueMaxLevel"]);
		/**
		* Whether all classes share one actor-wide level/exp instead of each class leveling independently.
		* @type {boolean}
		*/
		this.useSharedActorLevel = this.parsedPluginParameters["useSharedActorLevel"] === "true";
		/**
		* The "basis" input to the canonical, class-independent exp curve used when {@link useSharedActorLevel} is on.
		* @type {number}
		*/
		this.canonicalExpBasis = Number(this.parsedPluginParameters["canonicalExpBasis"]);
		/**
		* The "extra" input to the canonical exp curve.
		* @type {number}
		*/
		this.canonicalExpExtra = Number(this.parsedPluginParameters["canonicalExpExtra"]);
		/**
		* The "acceleration A" input to the canonical exp curve.
		* @type {number}
		*/
		this.canonicalExpAccA = Number(this.parsedPluginParameters["canonicalExpAccA"]);
		/**
		* The "acceleration B" input to the canonical exp curve.
		* @type {number}
		*/
		this.canonicalExpAccB = Number(this.parsedPluginParameters["canonicalExpAccB"]);
	}
};

//#endregion
//#region src/plugins/level/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.LEVEL = {};
/**
* The grouping for extensions of this plugin.
*/
J.LEVEL.EXT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.LEVEL.Metadata = new J_LevelPluginMetadata("J-LevelMaster", "1.3.1");
/**
* The maximum level definable in the level. Any level below this can be determined without extra calculations.
* @type {number}
*/
J.LEVEL.EditorMaxLevel = 99;
/**
* All aliased methods for this plugin.
*/
J.LEVEL.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_BattlerBase: new Map(),
	Game_Enemy: new Map(),
	Game_Event: new Map(),
	Game_System: new Map(),
	Game_Temp: new Map(),
	Game_Troop: new Map(),
	DataManager: new Map(),
	JABS_AiManager: new Map(),
	Sprite_Character: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.LEVEL.RegExp = {
	/**
	* The regex for hiding the level display of a battler.
	* @type {RegExp}
	*/
	HideLevel: /<hideLevel>/i,
	/**
	* The regex for the level tag on various database objects.
	* @type {RegExp}
	*/
	Level: /<(?:lv|lvl|level):[ ]?(-?\+?\d+)>/i,
	/**
	* The regex for when a skill id is learned at a designated level.
	* The array capture group is [SKILL_ID, LEVEL_LEARNED].
	* @type {RegExp}
	*/
	Learning: /<learning: ?(\[\d+, ?\d+])>/i,
	/**
	* The regex for granting bonuses or penalties to max level (for actors only).
	* @type {RegExp}
	*/
	MaxLevelBoost: /<maxLevelBoost: ?(-?\+?\d+)>/i
};

//#endregion
//#region src/plugins/level/core/_metadata/pluginCommands.js
/**
* Plugin command for enabling the level scaling functionality.
*/
PluginManager.registerCommand(J.LEVEL.Metadata.name, "enableScaling", () => {
	$gameSystem.enableLevelScaling();
});
/**
* Plugin command for disabling the level scaling functionality.
*/
PluginManager.registerCommand(J.LEVEL.Metadata.name, "disableScaling", () => {
	$gameSystem.disableLevelScaling();
});

//#endregion
//#region src/plugins/level/core/managers/DataManager.js
/**
* Extends {@link #setupNewGame}.<br/>
* Also builds the beyond max data for classes.
*/
J.LEVEL.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	J.LEVEL.Aliased.DataManager.get("setupNewGame").call(this);
	$gameTemp.buildBeyondMaxData();
};

//#endregion
//#region src/plugins/level/core/managers/JABS_AiManager.js
/**
* Extends {@link #postConvertMutate}.<br/>
* Also applies the level override.
* @param {Game_Enemy} battler The enemy battler that was converted from the event.
* @param {JABS_Battler} jabsBattler The created JABS battler from the event.
*/
J.LEVEL.Aliased.JABS_AiManager.set("postConvertMutate", JABS_AiManager.postConvertMutate);
JABS_AiManager.postConvertMutate = function(battler, jabsBattler) {
	J.LEVEL.Aliased.JABS_AiManager.get("postConvertMutate").call(this, battler, jabsBattler);
	const character = jabsBattler.getCharacter();
	const levelOverride = character.getLevelOverrides();
	if (levelOverride !== null) {
		battler.setCachedLevelOverride(levelOverride);
		if (J.NATURAL) {
			battler.refreshAllParameterBuffs();
		}
	}
};

//#endregion
//#region src/plugins/level/core/managers/LevelScaling.js
/**
* A helper class for calculating level-based scaling multipliers.
*/
var LevelScaling = class LevelScaling {
	/**
	* Which clamp profile {@link LevelScaling.multiplier} uses after the level-difference curve.
	* @type {{ COMBAT: string, REWARD: string }}
	*/
	static Scope = {
		COMBAT: "combat",
		REWARD: "reward"
	};
	/**
	* The default scaling multiplier.
	* @type {number}
	* @private
	*/
	static #defaultScalingMultiplier = 1;
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Determines the multiplier based on the target's and user's levels.
	*
	* This gives a multiplier in relation to the user.
	* @param {number} userLevel The level of the user, typically the actor.
	* @param {number} targetLevel The level of the target.
	* @param {string} [scope] `LevelScaling.Scope.COMBAT` or `LevelScaling.Scope.REWARD`; combat when omitted.
	* @returns {number} A decimal representing the multiplier for the scaling.
	*/
	static multiplier(userLevel, targetLevel, scope = LevelScaling.Scope.COMBAT) {
		if (!$gameSystem.isLevelScalingEnabled()) return this.#defaultScalingMultiplier;
		if (!this.#isValid(userLevel, targetLevel)) return this.#defaultScalingMultiplier;
		const levelDifference = userLevel - targetLevel;
		return this.calculate(levelDifference, scope);
	}
	/**
	* Determines whether or not the two battler's level inputs were valid.
	* Zero, while "valid", is handled the same as invalid: just use the default multiplier.
	* @param {number} a One of the battler's level.
	* @param {number} b The other battler's level.
	* @returns {boolean} True if both battler's levels are valid, false otherwise.
	*/
	static #isValid(a, b) {
		if (!a || !b) return false;
		return true;
	}
	/**
	* Resolves min/max clamps for the given scope from live plugin metadata.
	* @param {string} scope `LevelScaling.Scope.COMBAT` or `LevelScaling.Scope.REWARD`.
	* @returns {{ min: number, max: number }}
	*/
	static #clampsForScope(scope) {
		if (scope === LevelScaling.Scope.REWARD) {
			return {
				min: J.LEVEL.Metadata.rewardMinimumMultiplier,
				max: J.LEVEL.Metadata.rewardMaximumMultiplier
			};
		}
		return {
			min: J.LEVEL.Metadata.minimumMultiplier,
			max: J.LEVEL.Metadata.maximumMultiplier
		};
	}
	/**
	* Calculates the multiplier based on the given level difference.
	* @param {number} levelDifference The difference in levels between target and user.
	* @param {string} [scope] `LevelScaling.Scope.COMBAT` or `LevelScaling.Scope.REWARD`; combat when omitted.
	* @returns {number}
	*/
	static calculate(levelDifference, scope = LevelScaling.Scope.COMBAT) {
		const base = this.#defaultScalingMultiplier;
		const growth = J.LEVEL.Metadata.growthMultiplier;
		const upper = J.LEVEL.Metadata.invariantUpperRange;
		const lower = J.LEVEL.Metadata.invariantLowerRange;
		if (levelDifference <= upper && levelDifference >= lower) return base;
		const invariantDifference = levelDifference > 0 ? levelDifference - upper : levelDifference + lower;
		const result = base + invariantDifference * growth;
		const { min, max } = this.#clampsForScope(scope);
		return result.clamp(min, max);
	}
};

//#endregion
//#region src/plugins/level/core/objects/Game_Action.js
/**
* Scales damaged dealt and received to be based on level differences.
*/
J.LEVEL.Aliased.Game_Action.set("makeDamageValue", Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical) {
	const baseDamage = J.LEVEL.Aliased.Game_Action.get("makeDamageValue").call(this, target, critical);
	const multiplier = LevelScaling.multiplier(this.subject().level, target.level, LevelScaling.Scope.COMBAT);
	return baseDamage * multiplier;
};

//#endregion
//#region src/plugins/level/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes this plugin's members.
*/
J.LEVEL.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.LEVEL.Aliased.Game_Actor.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._level ||= {};
	/**
	* The calculated max level of this actor.
	* @type {number}
	*/
	this._j._level._realMaxLevel = J.LEVEL.EditorMaxLevel;
};
Game_Actor.prototype.getRealMaxLevel = function() {
	return this._j._level._realMaxLevel;
};
Game_Actor.prototype.setRealMaxLevel = function(newRealLevel) {
	this._j._level._realMaxLevel = newRealLevel;
};
J.LEVEL.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.LEVEL.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.updateRealMaxLevel();
	this.refreshLevel();
};
Game_Actor.prototype.updateRealMaxLevel = function() {
	const newMaxLevel = this.calculateRealMaxLevel();
	this.setRealMaxLevel(newMaxLevel);
};
Game_Actor.prototype.calculateRealMaxLevel = function() {
	const baseMaxLevel = this.baseMaxLevel();
	const maxLevelBoosts = this.maxLevelBoost();
	if (maxLevelBoosts === 0) return baseMaxLevel;
	const maxLevelSum = baseMaxLevel + maxLevelBoosts;
	const cappedMaxLevel = Math.min(maxLevelSum, J.LEVEL.Metadata.trueMaxLevel);
	const normalizedMaxLevel = Math.max(cappedMaxLevel, 1);
	return normalizedMaxLevel;
};
/**
* Overwrites {@link #maxLevel}.<br/>
* Recalculates the max level based on the possibility of a modified max level.
* @returns {number}
*/
Game_Actor.prototype.maxLevel = function() {
	return this.getRealMaxLevel();
};
/**
* Gets the max level boost from all available notes for this battler.
* @returns {number|null}
*/
Game_Actor.prototype.maxLevelBoost = function() {
	return RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.LEVEL.RegExp.MaxLevelBoost);
};
/**
* The base max level for a given actor. If it is set below 99 in the database, it'll just be that value. If it is set
* to 99, then it'll return what is defined in the plugin parameters.
* @returns {number}
*/
Game_Actor.prototype.baseMaxLevel = function() {
	if (this.actor().maxLevel < 99) return this.actor().maxLevel;
	return J.LEVEL.Metadata.defaultBeyondMaxLevel;
};
/**
* Overwrites {@link #paramBase}.<br/>
* Potentially fetches "beyond max data" for when ones level is beyond the editor max of 99.
* @param {number} paramId The paramId to fetch the data for.
* @returns {number}
*/
Game_Actor.prototype.paramBase = function(paramId) {
	const rawLevel = Math.floor(this.getLevel());
	const editorMax = J.LEVEL.EditorMaxLevel;
	if (rawLevel <= editorMax) {
		const row = this.currentClass().params[paramId];
		const idx = Math.min(Math.max(rawLevel, 0), row.length - 1);
		return row[idx];
	}
	if ($gameTemp.hasCachedBeyondMaxData() === false) {
		$gameTemp.buildBeyondMaxData();
	}
	const params = $gameTemp.getBeyondMaxData(this.currentClass().id);
	const beyondRow = params[paramId];
	const beyondIdx = Math.min(rawLevel, beyondRow.length - 1);
	return beyondRow[beyondIdx];
};
/**
* The base or default level for this battler.
* Actors have a level tracker, so we'll use that for the base.
* @returns {number}
*/
Game_Actor.prototype.getBattlerBaseLevel = function() {
	return this._level;
};
/**
* Gets all database sources we can get levels from.
*
* Uses {@link #getAllNotes} so the result benefits from the notes cache and
* includes all note-bearing sources — database data, class, skills, equips,
* and all states (including passives). This also opens the door for skills
* to grant level bonuses via the level tag, which is intentional.
* @returns {RPG_BaseItem[]}
*/
Game_Actor.prototype.getLevelSources = function() {
	return this.getAllNotes();
};
/**
* The variable level modifier for this actor.
* @returns {number}
*/
Game_Actor.prototype.getLevelBalancer = function() {
	if (J.LEVEL.Metadata.actorBalanceVariable) {
		return $gameVariables.value(J.LEVEL.Metadata.actorBalanceVariable);
	}
	return 0;
};
/**
* Extends {@link #initExp}.<br/>
* When single-level-across-classes is enabled, initializes exp as a synced value instead of
* only seeding the current class's slot.
*/
J.LEVEL.Aliased.Game_Actor.set("initExp", Game_Actor.prototype.initExp);
Game_Actor.prototype.initExp = function() {
	if (J.LEVEL.Metadata.useSharedActorLevel === false) {
		J.LEVEL.Aliased.Game_Actor.get("initExp").call(this);
		return;
	}
	this.setSyncedExp(this.currentLevelExp());
};
/**
* Extends {@link #changeExp}.<br/>
* When single-level-across-classes is enabled, writes the new exp value to every class's slot
* instead of just the current one, so switching classes never desyncs from this exp change.
*/
J.LEVEL.Aliased.Game_Actor.set("changeExp", Game_Actor.prototype.changeExp);
Game_Actor.prototype.changeExp = function(exp, show) {
	if (J.LEVEL.Metadata.useSharedActorLevel === false) {
		J.LEVEL.Aliased.Game_Actor.get("changeExp").call(this, exp, show);
		return;
	}
	const clampedExp = Math.max(exp, 0);
	this.setSyncedExp(clampedExp);
	const lastLevel = this._level;
	const lastSkills = this.skills();
	while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
		this.levelUp();
	}
	while (this.currentExp() < this.currentLevelExp()) {
		this.levelDown();
	}
	if (show && this._level > lastLevel) {
		this.displayLevelUp(this.findNewSkills(lastSkills));
	}
	this.refresh();
};
/**
* Extends {@link #changeClass}.<br/>
* When single-level-across-classes is enabled, no longer resets level/exp on class change- the
* actor's level is shared across all classes, so there is nothing to reset or re-derive. Also
* retroactively backfills the destination class's learnings up to the current level.
*/
J.LEVEL.Aliased.Game_Actor.set("changeClass", Game_Actor.prototype.changeClass);
Game_Actor.prototype.changeClass = function(classId, keepExp) {
	if (J.LEVEL.Metadata.useSharedActorLevel === false) {
		J.LEVEL.Aliased.Game_Actor.get("changeClass").call(this, classId, keepExp);
		return;
	}
	this._classId = classId;
	this.backfillLearningsForCurrentLevel();
	this.onClassChange(classId, keepExp);
	this.refresh();
};
/**
* Grants every learning on the currently active class whose level requirement is already met by
* this actor's current level. Safe to call repeatedly- {@link Game_Actor.learnSkill} is a no-op
* for skills already known.
*/
Game_Actor.prototype.backfillLearningsForCurrentLevel = function() {
	this.currentClass().learnings.forEach((learning) => {
		if (learning.level <= this._level) {
			this.learnSkill(learning.skillId);
		}
	}, this);
};
/**
* Writes the given exp value to every class's exp slot, keeping them all in agreement. This keeps
* {@link Game_Actor._exp} shaped exactly like vanilla (an object keyed by classId) for
* compatibility with anything that expects that shape, while ensuring there is effectively only
* one level per actor regardless of which class happens to be active.
* @param {number} exp The exp value to write to every class's slot.
*/
Game_Actor.prototype.setSyncedExp = function(exp) {
	$dataClasses.forEach((rpgClass) => {
		if (!rpgClass) return;
		this._exp[rpgClass.id] = exp;
	}, this);
};
/**
* Overwrites {@link #expForLevel}.<br/>
* When single-level-across-classes is enabled, uses a canonical, class-independent exp curve
* instead of pulling basis/extra/acceleration values from the currently active class. This is only
* the honest default for when nothing else defines a curve- J-Level-Flat, for example, also plainly
* overwrites expForLevel and loads after this plugin, so its definition simply replaces this one
* entirely at load time (the same load-order-wins mechanics as any other plugin overwrite), not a
* chained alias call.
* @param {number} level The level to calculate the required exp for.
* @returns {number}
*/
Game_Actor.prototype.expForLevel = function(level) {
	if (J.LEVEL.Metadata.useSharedActorLevel === false) {
		const [basis, extra, accA, accB] = this.currentClass().expParams;
		return Math.round(basis * Math.pow(level - 1, .9 + accA / 250) * level * (level + 1) / (6 + Math.pow(level, 2) / 50 / accB) + (level - 1) * extra);
	}
	const basis = J.LEVEL.Metadata.canonicalExpBasis;
	const extra = J.LEVEL.Metadata.canonicalExpExtra;
	const accA = J.LEVEL.Metadata.canonicalExpAccA;
	const accB = J.LEVEL.Metadata.canonicalExpAccB;
	return Math.round(basis * Math.pow(level - 1, .9 + accA / 250) * level * (level + 1) / (6 + Math.pow(level, 2) / 50 / accB) + (level - 1) * extra);
};

//#endregion
//#region src/plugins/level/core/objects/Game_Battler.js
/**
* The level of this battler.
*
* This is the same as `battler.lvl`.
* @returns {number}
*/
Object.defineProperty(Game_Battler.prototype, "level", {
	get() {
		return this.getLevel();
	},
	configurable: true
});
/**
* The level of this battler.
*
* This is the same as `battler.level`.
* @returns {number}
*/
Object.defineProperty(Game_Battler.prototype, "lvl", {
	get() {
		return this.getLevel();
	},
	configurable: true
});
/**
* Gets the level for this battler.
*
* Returns the cached value when available; computes and caches on the first call or after
* {@link #refreshLevel} invalidates the cache via {@link #onBattlerDataChange}.
* @returns {number}
*/
Game_Battler.prototype.getLevel = function() {
	if (this._j._level._cachedLevel !== null) {
		return this._j._level._cachedLevel;
	}
	const computed = this.computeLevel();
	this._j._level._cachedLevel = computed;
	return computed;
};
/**
* Computes the level for this battler from all registered sources.
*
* Separated from {@link #getLevel} so the cache layer stays clean.
* Includes a re-entrancy guard for cases where computing the level would
* otherwise trigger another level computation (e.g. a state whose note
* calls back into level logic).
* @returns {number}
*/
Game_Battler.prototype.computeLevel = function() {
	if (this._j._level._isComputingGetLevel === true) {
		return this.getBattlerBaseLevel() + this.getLevelBalancer();
	}
	this._j._level._isComputingGetLevel = true;
	try {
		const sources = this.getLevelSources();
		let level = this.getBattlerBaseLevel();
		level += this.getLevelBalancer();
		sources.forEach((rpgData) => {
			level += this.extractLevel(rpgData);
		}, this);
		return level;
	} finally {
		this._j._level._isComputingGetLevel = false;
	}
};
/**
* Invalidates the cached level and immediately re-primes it.
*
* Called by {@link #onBattlerDataChange} hooks in both {@link Game_Actor} and
* {@link Game_Enemy} so that the HUD's per-frame reads of {@link #level} remain O(1).
*/
Game_Battler.prototype.refreshLevel = function() {
	this._j._level._cachedLevel = null;
	this.getLevel();
};
/**
* Gets all database sources we can get levels from.
* @returns {RPG_BaseItem[]}
*/
Game_Battler.prototype.getLevelSources = function() {
	return [];
};
/**
* The base or default level for this battler.
* @returns {number}
*/
Game_Battler.prototype.getBattlerBaseLevel = function() {
	return 0;
};
/**
* The variable level modifier for this battler.
* @returns {number}
*/
Game_Battler.prototype.getLevelBalancer = function() {
	return 0;
};
/**
* Extracts the level from a given source's note data.
* @param {RPG_BaseItem} rpgData The database object to extract level from.
*/
Game_Battler.prototype.extractLevel = function(rpgData) {
	return RPGManager.getNumberFromNoteByRegex(rpgData, J.LEVEL.RegExp.Level);
};

//#endregion
//#region src/plugins/level/core/objects/Game_BattlerBase.js
/**
* Extends {@link #initMembers}.<br/>
* Initializes the level cache members for this battler.
*/
J.LEVEL.Aliased.Game_BattlerBase.set("initMembers", Game_BattlerBase.prototype.initMembers);
Game_BattlerBase.prototype.initMembers = function() {
	J.LEVEL.Aliased.Game_BattlerBase.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with levels.
	*/
	this._j._level ||= {};
	/**
	* The cached computed level for this battler.
	* Null when the cache is cold and must be recomputed via {@link #getLevel}.
	* Invalidated by {@link #refreshLevel} whenever battler data changes.
	* @type {number|null}
	*/
	this._j._level._cachedLevel = null;
	/**
	* Re-entrancy guard for {@link #computeLevel}.
	* Prevents infinite recursion when level sources themselves reference level.
	* @type {boolean}
	*/
	this._j._level._isComputingGetLevel = false;
};

//#endregion
//#region src/plugins/level/core/objects/Game_Enemy.js
/**
* Extends {@link Game_Enemy.setup}.<br/>
* Includes setting up the learned level map for skills.
*/
J.LEVEL.Aliased.Game_Enemy.set("initMembers", Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function() {
	J.LEVEL.Aliased.Game_Enemy.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with levels.
	*/
	this._j._level ||= {};
	/**
	* All skill learnings this enemy has for it recorded as a dictionary.
	* @type {Record<number, number>}
	*/
	this._j._level._skillLearnings = {};
	/**
	* The cached level override for this enemy if one exists.
	* @type {number|null}
	*/
	this._j._level._cachedLevelOverride = null;
};
/**
* Sets a skill's learning by its skill and level.
* @param {number} skillId The skill id to be learned.
* @param {number} level The level the corresponding skill is learned.
*/
Game_Enemy.prototype.setSkillLearning = function(skillId, level) {
	this._j._level._skillLearnings[skillId] = level;
};
Game_Enemy.prototype.getCachedLevelOverride = function() {
	return this._j._level._cachedLevelOverride;
};
Game_Enemy.prototype.setCachedLevelOverride = function(level) {
	this._j._level._cachedLevelOverride = level;
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Refreshes the cached level when this enemy's battler data changes.
*/
J.LEVEL.Aliased.Game_Enemy.set("onBattlerDataChange", Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function() {
	J.LEVEL.Aliased.Game_Enemy.get("onBattlerDataChange").call(this);
	this.refreshLevel();
};
/**
* Extends {@link Game_Enemy.setup}.<br/>
* Includes setting up the learned level map for skills.
*/
J.LEVEL.Aliased.Game_Enemy.set("setup", Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	J.LEVEL.Aliased.Game_Enemy.get("setup").call(this, enemyId, x, y);
	this.setupSkillLearnings();
};
/**
* Sets up the learnings defined on the enemy.
*/
Game_Enemy.prototype.setupSkillLearnings = function() {
	const learnings = RPGManager.getArraysFromNotesByRegex(this.enemy(), J.LEVEL.RegExp.Learning) ?? [];
	if (learnings.length === 0) return;
	learnings.forEach((learning) => this.setSkillLearning(learning.at(0), learning.at(1)));
};
/**
* Extends {@link #canMapActionToSkill}.<br/>
* Also factors in whether or not the skill is technically learned or not.
* @param {RPG_EnemyAction} action The action being mapped to a skill.
* @returns {boolean}
*/
J.LEVEL.Aliased.Game_Enemy.set("canMapActionToSkill", Game_Enemy.prototype.canMapActionToSkill);
Game_Enemy.prototype.canMapActionToSkill = function(action) {
	const baseCanMap = J.LEVEL.Aliased.Game_Enemy.get("canMapActionToSkill").call(this, action);
	if (baseCanMap === false) return false;
	const isLearned = this.isLearnedSkillByLevel(action);
	return isLearned;
};
/**
* Determines if a skill has been learned from potential level restrictions.
* @param {RPG_EnemyAction} action The action being mapped to a skill.
* @returns {boolean}
*/
Game_Enemy.prototype.isLearnedSkillByLevel = function(action) {
	const levelLearned = this._j._level._skillLearnings[action.skillId];
	if (levelLearned === undefined) return true;
	if (this.level >= levelLearned) return true;
	return false;
};
/**
* Overwrites {@link #getBattlerBaseLevel}.<br/>
* Instead of defaulting to zero, it will use the enemy's own note, accommodating any overrides if present.
* @returns {number}
*/
J.LEVEL.Aliased.Game_Enemy.set("getBattlerBaseLevel", Game_Enemy.prototype.getBattlerBaseLevel);
Game_Enemy.prototype.getBattlerBaseLevel = function() {
	const defaultBaseLevel = J.LEVEL.Aliased.Game_Enemy.get("getBattlerBaseLevel").call(this);
	const noteLevel = RPGManager.getNumberFromNoteByRegex(this.enemy(), J.LEVEL.RegExp.Level);
	const baseLevel = defaultBaseLevel + noteLevel;
	if (this.hasLevelOverride() === false) return baseLevel;
	return this.getCachedLevelOverride();
};
/**
* Checks if this enemy in particular has any JABS level overrides.
* @returns {boolean}
*/
Game_Enemy.prototype.hasLevelOverride = function() {
	if (!J.ABS) return false;
	if (this.getCachedLevelOverride() === null) return false;
	return true;
};
/**
* Determines if the level should be hidden for this enemy based on its notes.
* @returns {boolean} True if the level should be hidden, false otherwise.
*/
Game_Enemy.prototype.shouldHideLevel = function() {
	const referenceData = this.enemy();
	const hideLevel = RPGManager.checkForBooleanFromNoteByRegex(referenceData, J.LEVEL.RegExp.HideLevel);
	return hideLevel;
};
/**
* Gets all database sources we can get levels from.
*
* Excludes the enemy's own database entry because {@link #getBattlerBaseLevel} already
* reads the base `<level:N>` tag directly from the enemy note. Including it here would
* cause that tag to be counted twice. Skills and states may still carry `<level:+N>` bonus
* tags, which is intentional.
* @returns {RPG_BaseItem[]}
*/
Game_Enemy.prototype.getLevelSources = function() {
	return [...this.skills(), ...this.allStates()];
};
/**
* The variable level modifier for this enemy.
* @returns {number}
*/
Game_Enemy.prototype.getLevelBalancer = function() {
	if (J.LEVEL.Metadata.enemyBalanceVariable) {
		return $gameVariables.value(J.LEVEL.Metadata.enemyBalanceVariable);
	}
	return 0;
};

//#endregion
//#region src/plugins/level/core/objects/Game_Event.js
/**
* Extends {@link Game_Event.initMembers}.<br/>
* Initializes level-related properties.
*/
J.LEVEL.Aliased.Game_Event.set("initMembers", Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function() {
	J.LEVEL.Aliased.Game_Event.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with levels.
	*/
	this._j._level ||= {};
	/**
	* The cached level override value.
	* @type {number|null}
	*/
	this._j._level._cachedLevelOverride = null;
	/**
	* The cached check of whether or not to hide the level in the battler's name.
	* @type {boolean|null}
	*/
	this._j._level._cachedHideLevel = null;
};
/**
* Gets the cached level override.<br>
* If there is no override, this returns null instead.
* @returns {number|null}
*/
Game_Event.prototype.getCachedLevelOverride = function() {
	return this._j._level._cachedLevelOverride;
};
/**
* Gets the cached flag for whether or not the level should be hidden.<br>
* If there is this hasn't been parsed, this returns null instead.
* @returns {boolean|null}
*/
Game_Event.prototype.getCachedHideLevel = function() {
	return this._j._level._cachedHideLevel;
};
/**
* Sets the level override as a cached value.
* @param {number|null} level The new cached value.
*/
Game_Event.prototype.setCachedLevelOverride = function(level) {
	this._j._level._cachedLevelOverride = level;
};
/**
* Sets the flag for hiding the level as a cached value.
* @param {boolean|null} hideLevel The new cached value.
*/
Game_Event.prototype.setCachedHideLevel = function(hideLevel) {
	this._j._level._cachedHideLevel = hideLevel;
};
/**
* Extends {@link Game_Event.refresh}.<br/>
* Clears the level override cache when the event page changes.
*/
J.LEVEL.Aliased.Game_Event.set("refresh", Game_Event.prototype.refresh);
Game_Event.prototype.refresh = function() {
	J.LEVEL.Aliased.Game_Event.get("refresh").call(this);
	this.clearLevelCache();
};
/**
* Clears the cached values related to levels.
*/
Game_Event.prototype.clearLevelCache = function() {
	this.setCachedLevelOverride(null);
	this.setCachedHideLevel(null);
};
/**
* Parses out the level from a list of event commands.
* @returns {number|null} The found level, or null if not found.
*/
Game_Event.prototype.getLevelOverrides = function() {
	if (this._j._level._cachedLevelOverride !== null) {
		return this._j._level._cachedLevelOverride;
	}
	let level = null;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		const regexResult = J.LEVEL.RegExp.Level.exec(comment);
		if (!regexResult) return;
		level = parseInt(regexResult[1]);
	});
	this._j._level._cachedLevelOverride = level;
	return level;
};
/**
* Determines if the level should be hidden for this event.
* @returns {boolean} True if the level should be hidden, false otherwise.
*/
Game_Event.prototype.shouldHideLevel = function() {
	if (this.getCachedHideLevel() !== null) {
		return this.getCachedHideLevel();
	}
	let hideLevel = false;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		if (J.LEVEL.RegExp.HideLevel.test(comment)) {
			hideLevel = true;
		}
	});
	this.setCachedHideLevel(hideLevel);
	return hideLevel;
};

//#endregion
//#region src/plugins/level/core/objects/Game_Party.js
/**
* Checks the current battle party and averages all levels.
* @returns {number} The average battle party level (rounded).
*/
Game_Party.prototype.averageActorLevel = function() {
	const allies = this.battleMembers();
	if (!allies.length) return 0;
	const reducer = (runningTotal, currentActor) => runningTotal + currentActor.level;
	const levelTotal = allies.reduce(reducer, 0);
	return Math.round(levelTotal / allies.length);
};

//#endregion
//#region src/plugins/level/core/objects/Game_System.js
/**
* Extends `initialize()` to include properties for this plugin.
*/
J.LEVEL.Aliased.Game_System.set("initialize", Game_System.prototype.initialize);
Game_System.prototype.initialize = function() {
	J.LEVEL.Aliased.Game_System.get("initialize").call(this);
	/**
	* The overarching _j object, where all my stateful plugin data is stored.
	*/
	this._j ||= {};
	/**
	* Whether or not the level scaling is enabled.
	* @type {boolean}
	*/
	this._j._levelScalingEnabled ||= J.LEVEL.Metadata.enabled;
};
/**
* Gets whether or not the level scaling is enabled.
* @returns {boolean}
*/
Game_System.prototype.isLevelScalingEnabled = function() {
	return this._j._levelScalingEnabled;
};
/**
* Enables level scaling functionality.
*/
Game_System.prototype.enableLevelScaling = function() {
	this._j._levelScalingEnabled = true;
};
/**
* Disables level scaling functionality.
*/
Game_System.prototype.disableLevelScaling = function() {
	this._j._levelScalingEnabled = false;
};
/**
* Rebuilds the beyond max parameter data for all actors.
*/
J.LEVEL.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.LEVEL.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameTemp.buildBeyondMaxData();
};

//#endregion
//#region src/plugins/level/core/objects/Game_Temp.js
/**
* Intializes all additional members of this class.
*/
J.LEVEL.Aliased.Game_Temp.set("initMembers", Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function() {
	J.LEVEL.Aliased.Game_Temp.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._level ||= {};
	/**
	* Whether or not the beyond max data has been cached.
	* @type {boolean}
	*/
	this._j._level._hasCachedBeyondMaxData = false;
	/**
	* All the level data for beyond the max level.
	*/
	this._j._level._beyondMaxData ||= {};
};
/**
* Iterate over all actors and build the parameter data for all classes.
*/
Game_Temp.prototype.buildBeyondMaxData = function() {
	$dataClasses.forEach((dataClass) => {
		if (!dataClass) return;
		this.buildBeyondMaxDataForClass(dataClass.id);
	}, this);
	this.flagBeyondMaxDataAsCached();
};
/**
* Builds the beyond max parameter data for a given class.
* @param {number} classId The classId to build the beyond max data for.
*/
Game_Temp.prototype.buildBeyondMaxDataForClass = function(classId) {
	const classParams = $dataClasses.at(classId).params;
	const newClassParams = Array.empty;
	Game_BattlerBase.knownBaseParameterIds().forEach((paramId) => {
		const parameterValues = classParams.at(paramId).toSpliced(0, 0);
		const lastFive = parameterValues.slice(parameterValues.length - 6);
		const growth = Array.empty;
		lastFive.forEach((value, index) => {
			if (index === 0) return;
			const previousValue = lastFive[index - 1];
			const difference = value - previousValue;
			growth.push(difference);
		});
		const averageGrowth = growth.reduce((sum, value) => sum + value, 0) / growth.length;
		for (let i = 100; i < 1e3; i++) {
			const nextParameterValue = parameterValues.at(i - 1) + averageGrowth;
			parameterValues[i] = Math.ceil(nextParameterValue);
		}
		newClassParams.push(parameterValues);
	});
	this.setBeyondMaxData(classId, newClassParams);
};
/**
* Gets the parameter collection for the class
* @param {number} classId The classId to build the beyond max data for.
* @returns {number[][]} The parameter collection for a given class and its parameters.
*/
Game_Temp.prototype.getBeyondMaxData = function(classId) {
	return this._j._level._beyondMaxData[classId];
};
/**
* Sets the parameter data for the given class.
* @param {number} classId The classId to set the parameter data for.
* @param {number[][]} parameterData The array of arrays of parameter values- one for each base paramId.
*/
Game_Temp.prototype.setBeyondMaxData = function(classId, parameterData) {
	this._j._level._beyondMaxData[classId] = parameterData;
};
/**
* Determines whether or not the beyond max data has been cached yet.
* @returns {boolean} True if it has been cached already, false otherwise.
*/
Game_Temp.prototype.hasCachedBeyondMaxData = function() {
	return this._j._level._hasCachedBeyondMaxData;
};
/**
* Flags the beyond max data as having been cached.
*/
Game_Temp.prototype.flagBeyondMaxDataAsCached = function() {
	this._j._level._hasCachedBeyondMaxData = true;
};

//#endregion
//#region src/plugins/level/core/objects/Game_Troop.js
/**
* Upon defeating a troop of enemies, scales the earned experience based on
* average actor level vs each of the enemies.
*/
J.LEVEL.Aliased.Game_Troop.set("expTotal", Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function() {
	if ($gameSystem.isLevelScalingEnabled()) {
		return this.getScaledExpResult();
	} else {
		return J.LEVEL.Aliased.Game_Troop.get("expTotal").call(this);
	}
};
/**
* Determines the amount of experience gained based on the average battle party compared to each defeated enemy.
* @returns {number} The scaled amount of EXP this enemy troop yielded.
*/
Game_Troop.prototype.getScaledExpResult = function() {
	const deadEnemies = this.deadMembers();
	const averageActorLevel = $gameParty.averageActorLevel();
	const reducer = (accumulativeExpTotal, currentEnemy) => {
		const expFactor = LevelScaling.multiplier(averageActorLevel, currentEnemy.level, LevelScaling.Scope.REWARD);
		const total = Math.round(expFactor * currentEnemy.exp());
		return accumulativeExpTotal + total;
	};
	return Math.round(deadEnemies.reduce(reducer, 0));
};

//#endregion
//#region src/plugins/level/core/sprites/Sprite_Character.js
/**
* Gets this battler's name.
* If there is no battler, this will return an empty name.
* @returns {JABS_BattlerName}
*/
J.LEVEL.Aliased.Sprite_Character.set("getBattlerName", Sprite_Character.prototype.getBattlerName);
Sprite_Character.prototype.getBattlerName = function() {
	/** @type {JABS_BattlerName} */
	const originalName = J.LEVEL.Aliased.Sprite_Character.get("getBattlerName").call(this);
	if (originalName.name === String.empty) return originalName;
	const battler = this.getBattler();
	if (battler.isEnemy() === false) return originalName;
	const { level } = battler;
	if (level === 0) return originalName;
	let levelString = `${level.padZero(3)}`;
	if (this._character && this._character.isEvent() && this._character.shouldHideLevel()) {
		levelString = "???";
	}
	if (levelString !== "???" && battler.shouldHideLevel()) {
		levelString = "???";
	}
	originalName.name = `${levelString} ${originalName.name}`;
	return originalName;
};

//#endregion
//# sourceMappingURL=J-LevelMaster.js.map