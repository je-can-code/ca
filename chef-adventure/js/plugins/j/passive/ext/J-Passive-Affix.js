//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-AFFIX] Random passive affixes + tier presentation for JABS enemies.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @base J-ABS-Speed
 * @base J-ABS-Tools
 * @base J-ABS-Timing
 * @base J-ABS-Shield
 * @base J-Extend
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-ABS-Speed
 * @orderAfter J-ABS-Tools
 * @orderAfter J-ABS-Timing
 * @orderAfter J-ABS-Shield
 * @orderAfter J-Extend
 * @orderAfter J-HUD-TargetFrame
 * @orderAfter J-MessageTextCodes
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Passive for J-ABS.
 *
 * It adds a passive "affix" system to JABS map enemies so they can spawn with
 * a random tier prefix and/or suffix (both weighted), and it decorates the
 * name presentation on the map and in the target HUD.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This plugin is intentionally layered behind a simple policy:
 * If an event explicitly defines passive state ids via `<passive:[...]>`, then
 * those ids win and no random affix rolling occurs for that spawn.
 *
 * Otherwise, prefix/suffix affixes are rolled from state-defined pools and
 * applied as passive states to the spawned enemy battler.
 *
 * ============================================================================
 * PASSIVE AFFIX RNG (MAP ENEMIES)
 * Have you ever wanted "Wicked Slime" or "Slime of Frost" to be a thing, but
 * still want full control when you need it? Well now you can! By applying the
 * appropriate tags to your states and enemies (and optionally event comments),
 * you too can have JABS enemies spawn with weighted passive affixes.
 *
 * TAG USAGE:
 * - States (prefix/suffix pool membership + weights)
 * - Enemies (block RNG and/or override chances)
 * - Events (Comment commands on the pfage that spawns the enemy)
 *
 * POLICY / PRECEDENCE:
 *  (1) If the event has an explicit `<passive:[...]>` list that contains any
 *      affix ids, then that list is applied and no random affix rolling
 *      occurs.
 *  (2) Otherwise, prefix and suffix are rolled independently by chance + pool.
 *  (3) Event comment overrides beat enemy note overrides, which beat the
 *      plugin defaults.
 *
 * ----------------------------------------------------------------------------
 * BLOCKING RANDOM AFFIXES
 * Have you ever wanted a specific enemy to opt-out of random affixes entirely,
 * or to only ever roll one slot? Well now you can! By applying the following
 * tags to an enemy note, you too can block random affix rolls per enemy.
 *
 * TAG USAGE:
 * - Enemies
 *
 * TAG FORMAT:
 *  <no-rng-passives>
 *  <no-rng-passive-prefixes>
 *  <no-rng-passive-suffixes>
 *
 * TAG EXAMPLES:
 *  <no-rng-passives>
 *    Prevents rolling both prefixes and suffixes for this enemy.
 *
 *  <no-rng-passive-prefixes>
 *    Prevents rolling prefixes for this enemy, but suffixes may still roll.
 *
 * ----------------------------------------------------------------------------
 * OVERRIDING RANDOM AFFIX CHANCES
 * Have you ever wanted a particular enemy (or a single spawn point on the map)
 * to have a much higher (or lower) chance of rolling an affix? Well now you
 * can! By applying these chance tags to an enemy note or event comment, you
 * too can override the percent chance for that slot.
 *
 * TAG USAGE:
 * - Enemies
 * - Events (Comment commands)
 *
 * TAG FORMAT:
 *  <passive-affix-prefix-chance:PERCENT>
 *  <passive-affix-suffix-chance:PERCENT>
 *    Where PERCENT is 0–100 (decimals allowed).
 *
 * TAG NOTES:
 * - Multiple chance tags on an event page are allowed; the last one wins.
 * - Event comment chance overrides take priority over enemy note overrides.
 *
 * TAG EXAMPLES:
 *  <passive-affix-prefix-chance:100>
 *    Always rolls a prefix (unless blocked or overridden by explicit
 *    `<passive:[...]>`).
 *
 *  <passive-affix-suffix-chance:12.5>
 *    Rolls a suffix roughly 12.5% of the time.
 *
 * ============================================================================
 * AFFIX POOLS (STATE NOTES)
 * Have you ever wanted some passive states to act like "affix words", where a
 * state can be eligible to become a prefix or suffix? Well now you can! By
 * applying the following tags to states, you too can define the pools this
 * plugin rolls from.
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <enemy-prefix>
 *  <enemy-suffix>
 *
 * TAG EXAMPLES:
 *  <enemy-prefix>
 *    This state can be selected as a prefix affix state.
 *
 * ----------------------------------------------------------------------------
 * WEIGHTING AFFIX ROLLS
 * Have you ever wanted some affixes to be common and others to be rare? Well
 * now you can! By applying a weight tag to a state, you too can influence how
 * often it is selected by the weighted roll.
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <affix-weight:N>
 *    Where N is a positive integer weight.
 *
 * TAG EXAMPLES:
 *  <affix-weight:10>
 *    Ten times as likely as an affix with weight 1.
 *
 * ============================================================================
 * TIER STRIPE / TINT
 * Have you ever wanted your tier prefix to communicate its tier visually on
 * the map (and optionally in the HUD), without forcing every prefix to have a
 * color? Well now you can! By applying a tier hex tag to a prefix state, you
 * too can tint the map nameplate stripe (and optionally the HUD name row).
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <tier-color-hex:#RRGGBB>
 *
 * TAG NOTES:
 * - No tag means no stripe tint. Full stop.
 *
 * TAG EXAMPLES:
 *  <tier-color-hex:#FF0000>
 *    Uses a bright red stripe tint when this prefix is the selected tier
 *    prefix.
 *
 * ============================================================================
 * TIER RANK (PIP COUNT)
 * Have you ever wanted the map nameplate stripe to communicate not just that
 * a prefix is special, but how special, without forcing players to memorize
 * five different tier colors? Well now you can! By applying a tier rank tag
 * to a prefix state, you too can make the stripe draw that many thin pips
 * instead of one solid block.
 *
 * TAG USAGE:
 * - States
 *
 * TAG FORMAT:
 *  <affix-tier:N>
 *    Where N is a positive integer tier rank.
 *
 * TAG NOTES:
 * - No tag (or a tag of 1) draws the original single solid stripe. Full stop.
 * - Rank is capped at 5 pips regardless of the tagged value.
 *
 * TAG EXAMPLES:
 *  <affix-tier:3>
 *    Draws three thin pips on the map nameplate stripe when this prefix is
 *    the selected tier prefix.
 *
 * ============================================================================
 * REWARD MULTIPLIERS
 * Have you ever wanted affixed enemies to yield better rewards for the extra
 * challenge they pose? Well now you can! By applying the following tag to
 * states and/or enemy notes, you too can multiplicatively scale any reward
 * type when the enemy is defeated.
 *
 * TAG USAGE:
 * - States (affix states or any other state on the enemy)
 * - Enemies
 *
 * TAG FORMAT:
 *  <rewardMultiplier:[TYPE, VALUE]>
 *    Where TYPE is one of: exp, gold, sdp, ap, drops
 *    Where VALUE is a decimal multiplier (e.g. 2.0 = double).
 *
 * TAG NOTES:
 * - Multiple tags per note are supported (one per reward type).
 * - When an enemy has multipliers from both its note and its states,
 *   they stack multiplicatively (e.g. 1.5x from note * 2.0x from
 *   prefix state = 3.0x total).
 * - The "drops" type multiplies the drop chance percentage, not the
 *   number of items.
 *
 * TAG EXAMPLES:
 *  <rewardMultiplier:[exp, 2.0]>
 *    Enemies defeated with this tag yield double experience.
 *
 *  <rewardMultiplier:[gold, 1.5]>
 *  <rewardMultiplier:[drops, 1.25]>
 *    These two tags on the same state would grant 1.5x gold and
 *    1.25x drop chance when the enemy is defeated.
 *
 * ============================================================================
 * PLUGIN PARAMETERS
 * Have you ever wanted to tune the default prefix/suffix roll chances without
 * tagging every enemy? Well now you can! By configuring the parameters below,
 * you too can set the global defaults used when no overrides are present.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param parentConfigPassiveAffix
 * @text PASSIVE AFFIX
 *
 * @param default-prefix-chance
 * @parent parentConfigPassiveAffix
 * @type number
 * @decimals 2
 * @min 0
 * @max 100
 * @text Default Prefix Affix Chance
 * @desc Percent chance to roll a random prefix affix when the slot is not blocked and no override applies.
 * @default 8
 *
 * @param default-suffix-chance
 * @parent parentConfigPassiveAffix
 * @type number
 * @decimals 2
 * @min 0
 * @max 100
 * @text Default Suffix Affix Chance
 * @desc Percent chance to roll a random suffix affix when the slot is not blocked and no override applies.
 * @default 8
 */
//endregion annotations

//#region src/plugins/passive/ext/affix/_metadata/_pluginMetadata.js
var JPassiveAffix_PluginMetadata = class extends PluginMetadata {
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
	* Parses the plugin parameters and assigns them to the metadata.
	*/
	initializeMetadata() {
		/**
		* The default chance for a prefix to be applied.
		* @type {number}
		*/
		this.defaultPrefixChance = parseFloat(this.parsedPluginParameters["default-prefix-chance"]);
		/**
		* The default chance for a suffix to be applied.
		* @type {number}
		*/
		this.defaultSuffixChance = parseFloat(this.parsedPluginParameters["default-suffix-chance"]);
	}
	/**
	* Initializes the state affix weight totals and maps.
	*/
	initializeStateAffixWeights() {
		/**
		* The total weight of all prefixes.
		* @type {number}
		*/
		this.totalPrefixWeight = 0;
		/**
		* The total weight of all suffixes.
		* @type {number}
		*/
		this.totalSuffixWeight = 0;
		/**
		* The collection of key=id,value=weight for all states and their prefix weights found in the database.
		* @type {Map<number, number>}
		*/
		this.prefixMap = new Map();
		/**
		* The collection of key=id,value=weight for all states and their suffix weights found in the database.
		* @type {Map<number, number>}
		*/
		this.suffixMap = new Map();
		$dataStates.forEach((state) => {
			if (!state) return;
			if (state.isEnemyPrefix) {
				this.totalPrefixWeight += state.affixWeight;
				this.prefixMap.set(state.id, state.affixWeight);
			}
			if (state.isEnemySuffix) {
				this.totalSuffixWeight += state.affixWeight;
				this.suffixMap.set(state.id, state.affixWeight);
			}
		});
	}
	/**
	* Determines if the provided state id is an affix state.
	* @param {number} stateId The state id to check.
	* @returns {boolean} True if the state is a prefix or suffix, false otherwise.
	*/
	isAffixStateId(stateId) {
		return this.prefixMap.has(stateId) || this.suffixMap.has(stateId);
	}
};

//#endregion
//#region src/plugins/passive/ext/affix/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PASSIVE.EXT.AFFIX = {};
/**
* The metadata associated with this plugin.
*/
J.PASSIVE.EXT.AFFIX.Metadata = new JPassiveAffix_PluginMetadata("J-Passive-Affix", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.AFFIX.Aliased = {};
J.PASSIVE.EXT.AFFIX.Aliased.Game_Enemy = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.JABS_AiManager = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Battler = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.Scene_Boot = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.Sprite_Character = new Map();
J.PASSIVE.EXT.AFFIX.Aliased.Window_PassiveDetail = new Map();
/**
* All regular expressions used by this plugin.
*/
J.PASSIVE.EXT.AFFIX.RegExp = {};
J.PASSIVE.EXT.AFFIX.RegExp.Prefix = /<enemy-prefix>/i;
J.PASSIVE.EXT.AFFIX.RegExp.Suffix = /<enemy-suffix>/i;
J.PASSIVE.EXT.AFFIX.RegExp.Weight = /<affix-weight:([1-9]\d*)>/i;
J.PASSIVE.EXT.AFFIX.RegExp.TierColorHex = /<tier-color-hex:(#[0-9A-F]{6})>/i;
J.PASSIVE.EXT.AFFIX.RegExp.AffixTier = /<affix-tier:([1-9]\d*)>/i;
J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassives = /<no-rng-passives>/i;
J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassivePrefixes = /<no-rng-passive-prefixes>/i;
J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassiveSuffixes = /<no-rng-passive-suffixes>/i;
J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixPrefixChance = /<passive-affix-prefix-chance:[ ]?([+-]?\d+(?:\.\d+)?)>/i;
J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixSuffixChance = /<passive-affix-suffix-chance:[ ]?([+-]?\d+(?:\.\d+)?)>/i;
J.PASSIVE.EXT.AFFIX.RegExp.RewardMultiplier = /<rewardMultiplier:\[[ ]?(exp|gold|sdp|ap|drops),[ ]?(\d+(?:\.\d+)?)[ ]?]>/gi;
/**
* A collection of helper methods for this plugin.
*/
J.PASSIVE.EXT.AFFIX.Helpers = {};
/**
* Parses all {@link J.PASSIVE.EXT.AFFIX.RegExp.RewardMultiplier} tags from a database object's note.
* Returns a map of reward type key to multiplier value. Each type appears at most once; if
* duplicated, the last tag on the note wins.
* @param {RPG_BaseItem} databaseData The database object whose note to scan.
* @returns {Map<string, number>} Reward type → multiplier pairs found.
*/
J.PASSIVE.EXT.AFFIX.Helpers.parseRewardMultipliers = function(databaseData) {
	const results = new Map();
	if (!databaseData || !databaseData.note) return results;
	const regex = J.PASSIVE.EXT.AFFIX.RegExp.RewardMultiplier;
	const lines = databaseData.note.split(/[\r\n]+/);
	const stickyFreeFlags = regex.flags.replace("g", "").replace("y", "");
	const scan = new RegExp(regex.source, stickyFreeFlags);
	lines.forEach((line) => {
		const match = scan.exec(line);
		if (match === null) return;
		const rewardType = match[1].toLowerCase();
		const multiplier = parseFloat(match[2]);
		results.set(rewardType, multiplier);
	});
	return results;
};
/**
* Walks a battler's passive states in order and returns the first enemy-prefix state found.
* Shared by every resolver that needs "the one prefix state currently deciding tier presentation"
* (stripe color, HUD tint, tier rank) so they all agree on the same winning state.
* @param {Game_Battler} battler Source battler; only enemies participate.
* @returns {RPG_State|null} The first qualifying enemy-prefix state, or null when none applies.
*/
J.PASSIVE.EXT.AFFIX.Helpers.findFirstEnemyPrefixState = function(battler) {
	if (!battler || battler.isEnemy() === false) return null;
	const passiveStatesIds = battler.getPassiveStateIds();
	if (passiveStatesIds.length === 0) return null;
	for (const passiveStateId of passiveStatesIds) {
		const state = battler.state(passiveStateId);
		if (!state) continue;
		if (state.isEnemyPrefix !== true) continue;
		return state;
	}
	return null;
};
/**
* Resolves map/HUD tier stripe tint from the first enemy-prefix passive state on the battler.
* Callers assign the result to {@link JABS_BattlerName#colorHex} (or HUD fields) when non-empty.
* @param {Game_Battler} battler Source battler; only enemies participate.
* @returns {string} Stripe hex, or {@link String.empty} when none applies.
*/
J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierStripeColorHex = function(battler) {
	const state = J.PASSIVE.EXT.AFFIX.Helpers.findFirstEnemyPrefixState(battler);
	if (!state) return String.empty;
	if (state.tierColorHex && state.tierColorHex !== String.empty) {
		return state.tierColorHex;
	}
	return String.empty;
};
/**
* Resolves the map nameplate tier rank (pip count) from the first enemy-prefix passive state on the battler.
* Callers assign the result to {@link JABS_BattlerName#tier} to control how many stripe pips are drawn.
* @param {Game_Battler} battler Source battler; only enemies participate.
* @returns {number} The tier rank, or `0` when none applies.
*/
J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierRank = function(battler) {
	const state = J.PASSIVE.EXT.AFFIX.Helpers.findFirstEnemyPrefixState(battler);
	return state ? state.affixTier : 0;
};

//#endregion
//#region src/plugins/passive/ext/affix/database/RPG_Enemy.js
/**
* Whether or not this enemy is blocked from having passive prefixes.
* @type {boolean}
*/
Object.defineProperty(RPG_Enemy.prototype, "noRngPrefixes", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassivePrefixes);
} });
/**
* Whether or not this enemy is blocked from having passive suffixes.
* @type {boolean}
*/
Object.defineProperty(RPG_Enemy.prototype, "noRngSuffixes", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassiveSuffixes);
} });
/**
* Whether or not this enemy is blocked from random passive affix rolls on both slots.
* @type {boolean}
*/
Object.defineProperty(RPG_Enemy.prototype, "noRngPassives", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassives);
} });
/**
* Optional override for the passive prefix affix roll percent ({@code 0}–{@code 100}) from this enemy's note.
* @type {number|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "passiveAffixPrefixChance", { get() {
	return RPGManager.getNumberFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixPrefixChance, true);
} });
/**
* Optional override for the passive suffix affix roll percent ({@code 0}–{@code 100}) from this enemy's note.
* @type {number|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "passiveAffixSuffixChance", { get() {
	return RPGManager.getNumberFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixSuffixChance, true);
} });
/**
* All reward multipliers defined on this enemy via {@link J.PASSIVE.EXT.AFFIX.RegExp.RewardMultiplier}.
* Returns a map of reward type key to its multiplier value.
* @type {Map<string, number>}
*/
Object.defineProperty(RPG_Enemy.prototype, "rewardMultipliers", { get() {
	return J.PASSIVE.EXT.AFFIX.Helpers.parseRewardMultipliers(this);
} });

//#endregion
//#region src/plugins/passive/ext/affix/database/RPG_State.js
/**
* Whether or not this state is flagged as an enemy prefix state.
* @type {boolean}
*/
Object.defineProperty(RPG_State.prototype, "isEnemyPrefix", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.Prefix);
} });
/**
* Whether or not this state is flagged as an enemy suffix state.
* @type {boolean}
*/
Object.defineProperty(RPG_State.prototype, "isEnemySuffix", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.Suffix);
} });
/**
* The weight of this state for enemy affixes.
* Defaults to 100 if none is found.
* @type {number}
*/
Object.defineProperty(RPG_State.prototype, "affixWeight", { get() {
	return RPGManager.getNumberFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.Weight, true) ?? 100;
} });
/**
* Optional tier stripe / HUD tint hex from {@link J.PASSIVE.EXT.AFFIX.RegExp.TierColorHex}; absent tag means no color.
* @type {string|null}
*/
Object.defineProperty(RPG_State.prototype, "tierColorHex", { get() {
	return RPGManager.getStringFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.TierColorHex, true);
} });
/**
* The tier rank of this state for map nameplate stripe pips, from {@link J.PASSIVE.EXT.AFFIX.RegExp.AffixTier}.
* Defaults to 0 if none is found, meaning no pip subdivision (single solid stripe).
* @type {number}
*/
Object.defineProperty(RPG_State.prototype, "affixTier", { get() {
	return RPGManager.getNumberFromNoteByRegex(this, J.PASSIVE.EXT.AFFIX.RegExp.AffixTier, true) ?? 0;
} });
/**
* All reward multipliers defined on this state via {@link J.PASSIVE.EXT.AFFIX.RegExp.RewardMultiplier}.
* Returns a map of reward type key to its multiplier value.
* @type {Map<string, number>}
*/
Object.defineProperty(RPG_State.prototype, "rewardMultipliers", { get() {
	return J.PASSIVE.EXT.AFFIX.Helpers.parseRewardMultipliers(this);
} });

//#endregion
//#region src/plugins/passive/ext/affix/managers/JABS_AiManager.js
/**
* True when prefix affix RNG is blocked for this spawn (enemy note or event comments).
* @param {Game_Event} character Spawning map event.
* @param {RPG_Enemy} enemyData Database enemy row.
* @returns {boolean}
*/
JABS_AiManager.shouldBlockPassivePrefixRng = function(character, enemyData) {
	if (enemyData.noRngPassives) return true;
	if (enemyData.noRngPrefixes) return true;
	if (character.eventCommentsDisablePassiveAffixPrefixRng()) return true;
	return false;
};
/**
* True when suffix affix RNG is blocked for this spawn (enemy note or event comments).
* @param {Game_Event} character Spawning map event.
* @param {RPG_Enemy} enemyData Database enemy row.
* @returns {boolean}
*/
JABS_AiManager.shouldBlockPassiveSuffixRng = function(character, enemyData) {
	if (enemyData.noRngPassives) return true;
	if (enemyData.noRngSuffixes) return true;
	if (character.eventCommentsDisablePassiveAffixSuffixRng()) return true;
	return false;
};
/**
* Extends {@link #postConvertMutate}.<br/>
* Also adds the event source to the battler.
* @param {Game_Enemy} battler The enemy battler that was converted from the event.
* @param {JABS_Battler} jabsBattler The created JABS battler from the event.
*/
J.PASSIVE.EXT.AFFIX.Aliased.JABS_AiManager.set("postConvertMutate", JABS_AiManager.postConvertMutate);
JABS_AiManager.postConvertMutate = function(battler, jabsBattler) {
	J.PASSIVE.EXT.AFFIX.Aliased.JABS_AiManager.get("postConvertMutate").call(this, battler, jabsBattler);
	const character = jabsBattler.getCharacter();
	const passiveStateIds = character.getPassiveStateIds();
	const hasExplicitPassives = passiveStateIds.length > 0;
	const hasExplicitAffixes = hasExplicitPassives && passiveStateIds.some((id) => J.PASSIVE.EXT.AFFIX.Metadata.isAffixStateId(id));
	if (hasExplicitAffixes) {
		battler.addPassiveStateExternalSourceByStateIds(passiveStateIds);
		return;
	}
	const enemyData = battler.enemy();
	const prefixChance = character.getResolvedPassiveAffixPrefixChance(enemyData);
	const suffixChance = character.getResolvedPassiveAffixSuffixChance(enemyData);
	const canApplyPrefix = JABS_AiManager.shouldBlockPassivePrefixRng(character, enemyData) === false && RPGManager.chanceIn100(prefixChance);
	const canApplySuffix = JABS_AiManager.shouldBlockPassiveSuffixRng(character, enemyData) === false && RPGManager.chanceIn100(suffixChance);
	if (canApplyPrefix) {
		const prefixStateId = RPGManager.weightedMapChoice(J.PASSIVE.EXT.AFFIX.Metadata.prefixMap, J.PASSIVE.EXT.AFFIX.Metadata.totalPrefixWeight);
		if (prefixStateId !== null) {
			passiveStateIds.push(prefixStateId);
		}
	}
	if (canApplySuffix) {
		const suffixStateId = RPGManager.weightedMapChoice(J.PASSIVE.EXT.AFFIX.Metadata.suffixMap, J.PASSIVE.EXT.AFFIX.Metadata.totalSuffixWeight);
		if (suffixStateId !== null) {
			passiveStateIds.push(suffixStateId);
		}
	}
	battler.addPassiveStateExternalSourceByStateIds(passiveStateIds);
};

//#endregion
//#region src/plugins/passive/ext/affix/managers/JABS_Battler.js
/**
* With {@link J.HUD.EXT.TARGET}, wraps {@link JABS_Battler#buildFramedTarget}: tier prefix/suffix text, icons,
* optional {@link Window_Base#colorizeText} (same passive id bands as the map stripe).
*/
if (J.HUD && J.HUD.EXT.TARGET) {
	/**
	* Builds {@link FramedTarget} for the HUD, then applies tier label text, icons, and optional color.
	* @param {JABS_Battler} battlerLastHit Last-hit target for this frame.
	* @returns {FramedTarget}
	*/
	J.PASSIVE.EXT.AFFIX.Aliased.JABS_Battler.set("buildFramedTarget", JABS_Battler.prototype.buildFramedTarget);
	JABS_Battler.prototype.buildFramedTarget = function(battlerLastHit) {
		const framedTarget = J.PASSIVE.EXT.AFFIX.Aliased.JABS_Battler.get("buildFramedTarget").call(this, battlerLastHit);
		this.applyPassiveTierTargetFrameDecoration(framedTarget, battlerLastHit);
		const tierStripeHex = J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierStripeColorHex(battlerLastHit.getBattler());
		if (ColorManager.isValidHexColor(tierStripeHex)) {
			framedTarget.nameColorHex = tierStripeHex;
		}
		return framedTarget;
	};
	/**
	* Mutates {@link FramedTarget#name}: tier words, up to two `\\I` escapes, optional {@link Window_Base#colorizeText}.
	* @param {FramedTarget} framedTarget HUD row to update in place.
	* @param {JABS_Battler} battlerLastHit Source for passive state ids.
	*/
	JABS_Battler.prototype.applyPassiveTierTargetFrameDecoration = function(framedTarget, battlerLastHit) {
		if (battlerLastHit.isEnemy() === false) return;
		const battler = battlerLastHit.getBattler();
		const passiveStatesIds = battler.getPassiveStateIds();
		if (passiveStatesIds.length === 0) return;
		const hasAnyAffix = passiveStatesIds.some((passiveStateId) => {
			const state = battler.state(passiveStateId);
			if (!state) return false;
			return state.isEnemyPrefix === true || state.isEnemySuffix === true;
		});
		if (hasAnyAffix === false) return;
		let foundPrefix = false;
		let foundSuffix = false;
		let prefixIconIndex = null;
		let suffixIconIndex = null;
		let prefixTierHudMessageColorIndex = null;
		let displayName = framedTarget.name;
		for (const passiveStateId of passiveStatesIds) {
			const state = battler.state(passiveStateId);
			if (!state) continue;
			if (state.isEnemyPrefix === true && foundPrefix === false) {
				displayName = `${state.name} ${displayName}`;
				prefixIconIndex = state.iconIndex;
				if (state.tierColorHex) {
					prefixTierHudMessageColorIndex = ColorManager.colorIndexFromHex(state.tierColorHex);
				}
				foundPrefix = true;
			}
			if (state.isEnemySuffix === true && foundSuffix === false) {
				displayName = `${displayName} of ${state.name}`;
				suffixIconIndex = state.iconIndex;
				foundSuffix = true;
			}
			if (foundPrefix === true && foundSuffix === true) break;
		}
		let iconEscapes = String.empty;
		if (prefixIconIndex !== null) {
			iconEscapes += `\\I[${prefixIconIndex}]`;
		}
		if (suffixIconIndex !== null) {
			iconEscapes += `\\I[${suffixIconIndex}]`;
		}
		let labeledBody = displayName;
		if (J.MESSAGE && prefixTierHudMessageColorIndex !== null) {
			labeledBody = Window_Base.prototype.colorizeText(prefixTierHudMessageColorIndex, displayName);
		}
		framedTarget.name = `${iconEscapes}${labeledBody}`;
	};
}

//#endregion
//#region src/plugins/passive/ext/affix/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.prototype.determineExperienceGained}.<br/>
* Applies reward multipliers from the defeated enemy's note and states.
* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
* @param {Game_Actor} victoriousActor The actor that defeated the enemy.
* @returns {number} The multiplied experience gained.
*/
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.set("determineExperienceGained", JABS_Engine.prototype.determineExperienceGained);
JABS_Engine.prototype.determineExperienceGained = function(defeatedEnemy, victoriousActor) {
	const base = J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.get("determineExperienceGained").call(this, defeatedEnemy, victoriousActor);
	const rewardMultiplier = defeatedEnemy.getRewardMultiplierByType("exp");
	return Math.ceil(base * rewardMultiplier);
};
/**
* Extends {@link JABS_Engine.prototype.determineGoldGained}.<br/>
* Applies reward multipliers from the defeated enemy's note and states.
* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
* @param {Game_Actor} victoriousActor The actor that defeated the enemy.
* @returns {number} The multiplied gold gained.
*/
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.set("determineGoldGained", JABS_Engine.prototype.determineGoldGained);
JABS_Engine.prototype.determineGoldGained = function(defeatedEnemy, victoriousActor) {
	const base = J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.get("determineGoldGained").call(this, defeatedEnemy, victoriousActor);
	const rewardMultiplier = defeatedEnemy.getRewardMultiplierByType("gold");
	return Math.ceil(base * rewardMultiplier);
};
/**
* Extends {@link JABS_Engine.prototype.determineSdpGained}.<br/>
* Applies reward multipliers from the defeated enemy's note and states.
* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
* @param {JABS_Battler} actor The map battler that defeated the target.
* @returns {number} The multiplied SDP points gained.
*/
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.set("determineSdpGained", JABS_Engine.prototype.determineSdpGained);
JABS_Engine.prototype.determineSdpGained = function(defeatedEnemy, actor) {
	const base = J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.get("determineSdpGained").call(this, defeatedEnemy, actor);
	const rewardMultiplier = defeatedEnemy.getRewardMultiplierByType("sdp");
	return Math.ceil(base * rewardMultiplier);
};
/**
* Extends {@link JABS_Engine.prototype.determineApGained}.<br/>
* Applies reward multipliers from the defeated enemy's note and states.
* @param {Game_Enemy} defeatedEnemy The enemy that was defeated.
* @returns {number} The multiplied AP gained.
*/
J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.set("determineApGained", JABS_Engine.prototype.determineApGained);
JABS_Engine.prototype.determineApGained = function(defeatedEnemy) {
	const base = J.PASSIVE.EXT.AFFIX.Aliased.JABS_Engine.get("determineApGained").call(this, defeatedEnemy);
	const rewardMultiplier = defeatedEnemy.getRewardMultiplierByType("ap");
	return Math.ceil(base * rewardMultiplier);
};

//#endregion
//#region src/plugins/passive/ext/affix/objects/Game_Enemy.js
/**
* Computes the combined reward multiplier for a given reward type by scanning
* both the enemy's database note and all currently applied states.
* Multiple sources stack multiplicatively.
* @param {string} rewardType The reward type key: exp, gold, sdp, ap, or drops.
* @returns {number} The combined multiplier (1.0 when no tags are present).
*/
Game_Enemy.prototype.getRewardMultiplierByType = function(rewardType) {
	let multiplier = 1;
	const enemyMultipliers = this.enemy().rewardMultipliers;
	if (enemyMultipliers.has(rewardType)) {
		multiplier *= enemyMultipliers.get(rewardType);
	}
	this.allStates().forEach((state) => {
		const stateMultipliers = state.rewardMultipliers;
		if (stateMultipliers.has(rewardType)) {
			multiplier *= stateMultipliers.get(rewardType);
		}
	});
	return multiplier;
};
/**
* Extends {@link Game_Enemy.prototype.getDropMultiplierBonus}.<br/>
* Folds in any reward multipliers for the "drops" type from this enemy's note and states.
* @returns {number} The adjusted drop multiplier.
*/
J.PASSIVE.EXT.AFFIX.Aliased.Game_Enemy.set("getDropMultiplierBonus", Game_Enemy.prototype.getDropMultiplierBonus);
Game_Enemy.prototype.getDropMultiplierBonus = function() {
	const base = J.PASSIVE.EXT.AFFIX.Aliased.Game_Enemy.get("getDropMultiplierBonus").call(this);
	const rewardMultiplier = this.getRewardMultiplierByType("drops");
	return base * rewardMultiplier;
};

//#endregion
//#region src/plugins/passive/ext/affix/objects/Game_Event.js
/**
* Reads the last {@link J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixPrefixChance} tag from this page's comment commands.
* @returns {number|null} Parsed chance, or null when no tag is present.
*/
Game_Event.prototype.getPassiveAffixPrefixChanceFromEventComments = function() {
	let chance = null;
	const regex = J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixPrefixChance;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		regex.lastIndex = 0;
		const regexResult = regex.exec(comment);
		if (regexResult === null) return;
		chance = parseFloat(regexResult[1]);
	});
	return chance;
};
/**
* Reads the last {@link J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixSuffixChance} tag from this page's comment commands.
* @returns {number|null} Parsed chance, or null when no tag is present.
*/
Game_Event.prototype.getPassiveAffixSuffixChanceFromEventComments = function() {
	let chance = null;
	const regex = J.PASSIVE.EXT.AFFIX.RegExp.PassiveAffixSuffixChance;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		regex.lastIndex = 0;
		const regexResult = regex.exec(comment);
		if (regexResult === null) return;
		chance = parseFloat(regexResult[1]);
	});
	return chance;
};
/**
* True when any comment on this page contains {@link J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassivePrefixes}.
* @returns {boolean}
*/
Game_Event.prototype.eventCommentsDisablePassiveAffixPrefixRng = function() {
	let blocks = false;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		if (J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassives.test(comment)) {
			blocks = true;
		}
		if (J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassivePrefixes.test(comment)) {
			blocks = true;
		}
	});
	return blocks;
};
/**
* True when any comment on this page contains {@link J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassiveSuffixes}.
* @returns {boolean}
*/
Game_Event.prototype.eventCommentsDisablePassiveAffixSuffixRng = function() {
	let blocks = false;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		if (J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassives.test(comment)) {
			blocks = true;
		}
		if (J.PASSIVE.EXT.AFFIX.RegExp.NoRngPassiveSuffixes.test(comment)) {
			blocks = true;
		}
	});
	return blocks;
};
/**
* Effective prefix affix roll gate for this spawn: event comment overrides enemy note, then plugin default.
* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
* @returns {number} The percent chance of the roll.
*/
Game_Event.prototype.getResolvedPassiveAffixPrefixChance = function(enemyData) {
	const eventOverride = this.getPassiveAffixPrefixChanceFromEventComments();
	if (eventOverride !== null) {
		return parseFloat(eventOverride).clamp(0, 100);
	}
	const enemyOverride = enemyData.passiveAffixPrefixChance;
	if (enemyOverride !== null) {
		return parseFloat(enemyOverride).clamp(0, 100);
	}
	return J.PASSIVE.EXT.AFFIX.Metadata.defaultPrefixChance;
};
/**
* Effective suffix affix roll gate for this spawn: event comment overrides enemy note, then plugin default.
* @param {RPG_Enemy} enemyData Database enemy row for the spawned troop member.
* @returns {number} The percent chance of the roll.
*/
Game_Event.prototype.getResolvedPassiveAffixSuffixChance = function(enemyData) {
	const eventOverride = this.getPassiveAffixSuffixChanceFromEventComments();
	if (eventOverride !== null) {
		return parseFloat(eventOverride).clamp(0, 100);
	}
	const enemyOverride = enemyData.passiveAffixSuffixChance;
	if (enemyOverride !== null) {
		return parseFloat(enemyOverride).clamp(0, 100);
	}
	return J.PASSIVE.EXT.AFFIX.Metadata.defaultSuffixChance;
};

//#endregion
//#region src/plugins/passive/ext/affix/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Initializes the passive state affix weights for JABS map enemies.
* The passive detail window's JABS sections are provided directly by
* Window_PassiveDetail in this extension — no contributor registration needed.
*/
J.PASSIVE.EXT.AFFIX.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.PASSIVE.EXT.AFFIX.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	J.PASSIVE.EXT.AFFIX.Metadata.initializeStateAffixWeights();
};

//#endregion
//#region src/plugins/passive/ext/affix/sprites/Sprite_Character.js
/**
* Extends {@link #getBattlerName}.<br/>
* Considers passive tier states for {@link JABS_BattlerName#colorHex} (map stripe).
* Tier label copy is composed in the HUD target frame.
* @returns {JABS_BattlerName}
*/
J.PASSIVE.EXT.AFFIX.Aliased.Sprite_Character.set("getBattlerName", Sprite_Character.prototype.getBattlerName);
Sprite_Character.prototype.getBattlerName = function() {
	/** @type {JABS_BattlerName} */
	const battlerName = J.PASSIVE.EXT.AFFIX.Aliased.Sprite_Character.get("getBattlerName").call(this);
	this.applyPassiveMapTierAccent(battlerName);
	return battlerName;
};
/**
* Sets {@link JABS_BattlerName#colorHex} from the first tier-prefix passive state.
* Map stripe and HUD may reuse the same field for tinting.
* @param {JABS_BattlerName} battlerName The battler's name.
*/
Sprite_Character.prototype.applyPassiveMapTierAccent = function(battlerName) {
	if (this.canApplyPassiveMapTierAccent() === false) return;
	const battler = this.getBattler();
	const tierStripeHex = J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierStripeColorHex(battler);
	if (tierStripeHex !== String.empty) {
		battlerName.colorHex = tierStripeHex;
	}
	const tierRank = J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierRank(battler);
	if (tierRank !== 0) {
		battlerName.tier = tierRank;
	}
};
/**
* Determines whether or not passive map tier accent should be considered for this sprite.
* @returns {boolean} True if the battler name color may be modified, false otherwise.
*/
Sprite_Character.prototype.canApplyPassiveMapTierAccent = function() {
	const battler = this.getBattler();
	if (!battler) return false;
	if (battler.isEnemy() === false) return false;
	return true;
};

//#endregion
//#region src/plugins/passive/ext/affix/windows/Window_PassiveDetail.js
/**
* Extends {@link Window_PassiveDetail#drawStateHeader} and {@link Window_PassiveDetail#drawCombatSection}.<br/>
* Injects skill-history prose under the header and JABS combat sections in the left column.
* All methods read and advance {@link Window_PassiveDetail#currentY} directly —
* no y threading through method signatures.
*/
J.PASSIVE.EXT.AFFIX.Aliased.Window_PassiveDetail.set("drawStateHeader", Window_PassiveDetail.prototype.drawStateHeader);
Window_PassiveDetail.prototype.drawStateHeader = function(state) {
	J.PASSIVE.EXT.AFFIX.Aliased.Window_PassiveDetail.get("drawStateHeader").call(this, state);
	this.drawSkillHistoryBonusProse(state);
	this.drawAutoApplyStateProse(state);
};
J.PASSIVE.EXT.AFFIX.Aliased.Window_PassiveDetail.set("drawCombatSection", Window_PassiveDetail.prototype.drawCombatSection);
Window_PassiveDetail.prototype.drawCombatSection = function(state) {
	J.PASSIVE.EXT.AFFIX.Aliased.Window_PassiveDetail.get("drawCombatSection").call(this, state);
	this.drawJabsCombatSection(state);
	this.drawJabsShieldSection(state);
	this.drawJabsStackingSection(state);
};
/**
* Draws player-facing prose for each {@link J.ABS.RegExp.SkillHistoryBonus} tag on this state.
* Skipped when J-ABS is absent or the state carries no rotation bonus tags.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawSkillHistoryBonusProse = function(state) {
	if (!J.ABS) return;
	const lines = SkillHistoryBonusDisplay.collectGeneralProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};
/**
* Draws player-facing prose for each time {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tag on this state.
* Skipped when J-Passive-Conditional is absent or the state carries no time auto-apply rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawAutoApplyStateProse = function(state) {
	if (!J.PASSIVE.EXT.CONDITIONAL) return;
	const lines = AutoApplyStateDisplay.collectTimeProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};
/**
* Draws the JABS Combat section.
* Skipped when the state has no JABS combat content.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawJabsCombatSection = function(state) {
	const rows = this.collectJabsCombatRows(state);
	if (rows.length === 0) return;
	this.drawDetailSectionHeader("Combat");
	rows.forEach(({ icon, label, value }) => {
		this.drawDetailRow(icon, label, value);
	});
};
/**
* Collects all JABS combat display rows for the given state.
* Delegates to focused sub-collectors to stay within complexity limits.
* @param {RPG_State} state The state to check.
* @returns {Array<{icon: number, label: string, value: string}>}
*/
Window_PassiveDetail.prototype.collectJabsCombatRows = function(state) {
	const rows = [];
	rows.push(...this.collectJabsAilmentRows(state));
	rows.push(...this.collectResourcesAbsRows(state));
	rows.push(...this.collectJabsModifierRows(state));
	rows.push(...this.collectJabsTimingRows(state));
	return rows;
};
/**
* Collects JABS ailment and slip rows for the given state.
* Covers the five status ailment flags and HP/MP/TP slip (percent or formula).
* @param {RPG_State} state The state to check.
* @returns {Array<{icon: number, label: string, value: string}>}
*/
Window_PassiveDetail.prototype.collectJabsAilmentRows = function(state) {
	const rows = [];
	if (state.jabsParalyzed) rows.push({
		icon: 0,
		label: "Paralyzed",
		value: "(rooted + muted + disabled)"
	});
	if (state.jabsRooted) rows.push({
		icon: 0,
		label: "Rooted",
		value: "(cannot move)"
	});
	if (state.jabsMuted) rows.push({
		icon: 0,
		label: "Muted",
		value: "(no cast skills)"
	});
	if (state.jabsDisarmed) rows.push({
		icon: 0,
		label: "Disabled",
		value: "(no basic attack)"
	});
	if (state.isNegativeType()) rows.push({
		icon: 0,
		label: "Negative",
		value: "(AI tries to remove)"
	});
	const slipHpPct = state.jabsSlipHpPercent;
	const slipMpPct = state.jabsSlipMpPercent;
	const slipTpPct = state.jabsSlipTpPercent;
	const slipHpForm = state.jabsSlipHpFormula;
	const slipMpForm = state.jabsSlipMpFormula;
	const slipTpForm = state.jabsSlipTpFormula;
	if (slipHpPct) {
		rows.push({
			icon: TraitManager.slipIcon("hp", slipHpPct),
			label: TraitManager.slipName("hp", slipHpPct),
			value: `+${Math.abs(slipHpPct)}% / tick`
		});
	} else if (slipHpForm) {
		const hpEval = this.evaluateFormula(slipHpForm, this.actor());
		rows.push({
			icon: TraitManager.slipIcon("hp", Number(hpEval)),
			label: TraitManager.slipName("hp", Number(hpEval)),
			value: `+${Math.abs(Number(hpEval))} / tick`
		});
	}
	if (slipMpPct) {
		rows.push({
			icon: TraitManager.slipIcon("mp", slipMpPct),
			label: TraitManager.slipName("mp", slipMpPct),
			value: `+${Math.abs(slipMpPct)}% / tick`
		});
	} else if (slipMpForm) {
		const mpEval = this.evaluateFormula(slipMpForm, this.actor());
		rows.push({
			icon: TraitManager.slipIcon("mp", Number(mpEval)),
			label: TraitManager.slipName("mp", Number(mpEval)),
			value: `+${Math.abs(Number(mpEval))} / tick`
		});
	}
	if (slipTpPct) {
		rows.push({
			icon: TraitManager.slipIcon("tp", slipTpPct),
			label: TraitManager.slipName("tp", slipTpPct),
			value: `+${Math.abs(slipTpPct)}% / tick`
		});
	} else if (slipTpForm) {
		const tpEval = this.evaluateFormula(slipTpForm, this.actor());
		rows.push({
			icon: TraitManager.slipIcon("tp", Number(tpEval)),
			label: TraitManager.slipName("tp", Number(tpEval)),
			value: `+${Math.abs(Number(tpEval))} / tick`
		});
	}
	return rows;
};
/**
* Collects resource gain rows from J-Resources-ABS for the given state.
* Covers HP/MP/TP gains that fire on a successful attack and gains that fire
* when the bearer takes damage. Each resource type supports flat, percent, and
* formula variants; the first present variant wins per resource per trigger.
* Returns an empty array when J-Resources-ABS is not loaded.
* @param {RPG_State} state The state to check.
* @returns {Array<{icon: number, label: string, value: string}>}
*/
Window_PassiveDetail.prototype.collectResourcesAbsRows = function(state) {
	if (!J.RESOURCES || !J.RESOURCES.EXT || !J.RESOURCES.EXT.ABS) return [];
	const rows = [];
	const rx = J.RESOURCES.EXT.ABS.RegExp;
	const checks = [
		[
			rx.OnAttackHpGainFlat,
			rx.OnAttackHpGainPercent,
			rx.OnAttackHpGainFormula,
			`On-Attack ${TextManager.resource(0)}`,
			IconManager.param(0)
		],
		[
			rx.OnAttackMpGainFlat,
			rx.OnAttackMpGainPercent,
			rx.OnAttackMpGainFormula,
			`On-Attack ${TextManager.resource(1)}`,
			IconManager.param(1)
		],
		[
			rx.OnAttackTpGainFlat,
			rx.OnAttackTpGainPercent,
			rx.OnAttackTpGainFormula,
			`On-Attack ${TextManager.resource(30)}`,
			IconManager.maxTp()
		],
		[
			rx.WhenHitHpGainFlat,
			rx.WhenHitHpGainPercent,
			rx.WhenHitHpGainFormula,
			`When-Hit ${TextManager.resource(0)}`,
			IconManager.param(0)
		],
		[
			rx.WhenHitMpGainFlat,
			rx.WhenHitMpGainPercent,
			rx.WhenHitMpGainFormula,
			`When-Hit ${TextManager.resource(1)}`,
			IconManager.param(1)
		],
		[
			rx.WhenHitTpGainFlat,
			rx.WhenHitTpGainPercent,
			rx.WhenHitTpGainFormula,
			`When-Hit ${TextManager.resource(30)}`,
			IconManager.maxTp()
		]
	];
	checks.forEach(([flatRx, pctRx, formRx, label, icon]) => {
		const row = this.collectResourceGainRow(state, flatRx, pctRx, formRx, label, icon);
		if (row) rows.push(row);
	});
	return rows;
};
/**
* Resolves a resource gain row from a flat/percent/formula tag triplet.
* Checks flat first, then percent, then formula; returns the first match as a
* display row or null when none of the three tags are present on the state.
* @param {RPG_State} state The state to check.
* @param {RegExp} flatRx Regexp for the flat gain tag.
* @param {RegExp} pctRx Regexp for the percent gain tag.
* @param {RegExp} formRx Regexp for the formula gain tag.
* @param {string} label The display label for this row.
* @param {number} icon The icon index for this row.
* @returns {{icon: number, label: string, value: string}|null}
*/
Window_PassiveDetail.prototype.collectResourceGainRow = function(state, flatRx, pctRx, formRx, label, icon) {
	const flat = RPGManager.getNumberFromNoteByRegex(state, flatRx);
	if (flat) return {
		icon,
		label,
		value: `+${flat}`
	};
	const pct = RPGManager.getNumberFromNoteByRegex(state, pctRx);
	if (pct) return {
		icon,
		label,
		value: `+${pct}%`
	};
	const form = RPGManager.getStringFromNoteByRegex(state, formRx);
	if (form) {
		const evaluated = this.evaluateFormula(form, this.actor());
		return {
			icon,
			label,
			value: `+${Math.abs(Number(evaluated))}`
		};
	}
	return null;
};
/**
* Collects JABS battler-modifier rows for the given state.
* Covers aggro, offhand skill, vision, retaliation, bonus hits (three scopes),
* parry ignore, speed boost (ext-speed), and gap-close target (ext-tools).
* @param {RPG_State} state The state to check.
* @returns {Array<{icon: number, label: string, value: string}>}
*/
Window_PassiveDetail.prototype.collectJabsModifierRows = function(state) {
	const rows = [];
	const aggroOut = state.jabsAggroOutAmp;
	if (aggroOut) rows.push({
		icon: 0,
		label: "Aggro Out",
		value: `x${aggroOut}`
	});
	const offhandId = state.jabsOffhandSkillId;
	if (offhandId) {
		const skill = $dataSkills[offhandId];
		rows.push({
			icon: skill ? skill.iconIndex : 0,
			label: "Offhand",
			value: skill ? skill.name : `Skill #${offhandId}`
		});
	}
	const visionMult = RPGManager.getNumberFromNoteByRegex(state, J.ABS.RegExp.VisionMultiplier);
	if (visionMult) {
		const sign = visionMult > 0 ? "+" : "";
		rows.push({
			icon: 0,
			label: "Vision",
			value: `${sign}${visionMult}%`
		});
	}
	const retaliateData = RPGManager.getNumbersFromNoteByRegex(state, J.ABS.RegExp.Retaliate);
	if (retaliateData && retaliateData.length >= 2) {
		const [retSkillId, retChance] = retaliateData;
		const retSkill = $dataSkills[retSkillId];
		rows.push({
			icon: retSkill ? retSkill.iconIndex : 0,
			label: "Retaliate",
			value: `${retSkill ? retSkill.name : `Skill #${retSkillId}`} at ${retChance}%`
		});
	}
	const bonusGlobal = state.jabsBonusHitsScopeGlobal;
	const bonusBasic = state.jabsBonusHitsScopeBasic;
	const bonusSkill = state.jabsBonusHitsScopeSkill;
	if (bonusGlobal) rows.push({
		icon: 0,
		label: "Bonus Hits (all)",
		value: `+${bonusGlobal}`
	});
	if (bonusBasic) rows.push({
		icon: 0,
		label: "Bonus Hits (basic)",
		value: `+${bonusBasic}`
	});
	if (bonusSkill) rows.push({
		icon: 0,
		label: "Bonus Hits (skills)",
		value: `+${bonusSkill}`
	});
	const ignoresParry = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.RegExp.Unparryable);
	if (ignoresParry) rows.push({
		icon: 0,
		label: "Ignore Parry",
		value: ""
	});
	if (J.ABS.EXT.SPEED) {
		const speedBoost = RPGManager.getNumberFromNoteByRegex(state, J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost);
		if (speedBoost) {
			const sign = speedBoost > 0 ? "+" : "";
			rows.push({
				icon: 0,
				label: "Speed Boost",
				value: `${sign}${speedBoost}`
			});
		}
	}
	if (J.ABS.EXT.TOOLS) {
		const isTarget = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.EXT.TOOLS.RegExp.GapCloseTarget);
		if (isTarget) rows.push({
			icon: 0,
			label: "Gap Close Target",
			value: ""
		});
	}
	return rows;
};
/**
* Collects JABS timing and extension rows for the given state.
* Covers cast time modifiers (ext-timing), cooldown modifiers (ext-timing),
* on-cast self state (J-Extend), and state duration formula.
* @param {RPG_State} state The state to check.
* @returns {Array<{icon: number, label: string, value: string}>}
*/
Window_PassiveDetail.prototype.collectJabsTimingRows = function(state) {
	const rows = [];
	if (J.ABS.EXT.TIMING) {
		const castFlat = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.CastSpeedFlat);
		if (castFlat) {
			rows.push({
				icon: 0,
				label: "Cast Time Flat",
				value: `${this.evaluateFormula(castFlat, this.actor())}`
			});
		}
		const castRate = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.CastSpeedRate);
		if (castRate) {
			rows.push({
				icon: 0,
				label: "Cast Time Rate",
				value: `${this.evaluateFormula(castRate, this.actor())}%`
			});
		}
		const cdFlat = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.FastCooldownFlat);
		if (cdFlat) {
			rows.push({
				icon: 0,
				label: "Cooldown Flat",
				value: `${this.evaluateFormula(cdFlat, this.actor())}`
			});
		}
		const cdRate = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.TIMING.RegExp.FastCooldownRate);
		if (cdRate) {
			rows.push({
				icon: 0,
				label: "Cooldown Rate",
				value: `${this.evaluateFormula(cdRate, this.actor())}%`
			});
		}
	}
	if (J.EXTEND) {
		const onCastData = RPGManager.getNumbersFromNoteByRegex(state, J.EXTEND.RegExp.OnCastSelfState);
		if (onCastData && onCastData.length >= 2) {
			const [castStateId, castChance] = onCastData;
			const castState = $dataStates[castStateId];
			rows.push({
				icon: castState ? castState.iconIndex : 0,
				label: "On Cast",
				value: `${castState ? castState.name : `State #${castStateId}`} at ${castChance}%`
			});
		}
	}
	const durationForm = RPGManager.getStringFromNoteByRegex(state, J.ABS.RegExp.StateDurationFormulaPlus);
	if (durationForm) {
		rows.push({
			icon: 0,
			label: "Duration",
			value: `x${this.evaluateFormula(durationForm, this.actor())}`
		});
	}
	return rows;
};
/**
* Draws the JABS Shield section when J-ABS-Ext-Shield is loaded and the state
* has shield-related tags. Skipped otherwise.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawJabsShieldSection = function(state) {
	if (!J.ABS.EXT.SHIELD) return;
	const rows = [];
	const shieldFormula = RPGManager.getStringFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.ShieldPointsFormula);
	if (shieldFormula) {
		rows.push({
			icon: 0,
			label: "Shield",
			value: `${this.evaluateFormula(shieldFormula, this.actor())}`
		});
	}
	const shieldProtect = RPGManager.checkForBooleanFromNoteByRegex(state, J.ABS.EXT.SHIELD.RegExp.Protect);
	if (shieldProtect) rows.push({
		icon: 0,
		label: "Shield Protect",
		value: "(no overflow dmg)"
	});
	if (rows.length === 0) return;
	this.drawDetailSectionHeader("Shield");
	rows.forEach(({ icon, label, value }) => {
		this.drawDetailRow(icon, label, value);
	});
};
/**
* Draws the JABS Stacking section when the state has a reapplication type.
* Shows the stack type and its sub-settings (extend amount/cap or max stacks).
* Skipped when no reapplication type is defined on the state.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawJabsStackingSection = function(state) {
	const reapplyType = state.jabsStateReapplyType;
	if (!reapplyType) return;
	this.drawDetailSectionHeader("Stacking");
	this.drawDetailRow(0, "Stack Type", reapplyType);
	if (reapplyType === "extend") {
		const extendAmt = state.jabsStateExtendAmount;
		const extendMax = state.jabsStateExtendMax;
		this.drawDetailRow(0, "Extend Amount", `${extendAmt}f`);
		if (extendMax) this.drawDetailRow(0, "Extend Cap", `${extendMax}f`);
	}
	if (reapplyType === "stack") {
		this.drawDetailRow(0, "Max Stacks", `${state.jabsStateStackMax}`);
		this.drawDetailRow(0, "Stacks Applied", `${state.jabsStateStacksApplied}`);
		if (state.jabsLoseAllStacksAtOnce) this.drawDetailRow(0, "Lose All Stacks At Once", "");
	}
};
/**
* Gets the actor whose passive details are being displayed.
* @returns {Game_Actor} The displayed actor.
*/
Window_PassiveDetail.prototype.actor = function() {
	return this._actor;
};

//#endregion
//# sourceMappingURL=J-Passive-Affix.js.map