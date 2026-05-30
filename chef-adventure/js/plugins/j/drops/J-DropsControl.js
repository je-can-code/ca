//region Introduction
/*:
 * @target MZ
 * @plugindesc [v2.1.2 DROPS] Enables greater control over loot drops.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This plugin rewrites the way gold and item drops from enemies are handled.
 * ============================================================================
 * NEW
 *  FEATURES:
 *  - PERCENTAGE DROPS
 *
 *  TAGS:
 *  - ADDITIONAL ITEMS
 *  - DROP MULTIPLIER
 *  - GOLD MULTIPLIER
 * ============================================================================
 * WARNING 1:
 * This is likely incompatible with any other plugins that interact with the
 * drops for enemies unless it was specifically written as an extension of
 * this plugin.
 *
 * WARNING 2:
 * The party ability of "Drop Item Double" will double the entire multiplier
 * that is provided via the tags. Having multiple of this party ability will
 * not further double the multiplier.
 * ============================================================================
 * PERCENTAGE DROPS:
 * Have you ever wanted an enemy to drop something say... 40% of the time, but
 * realized you can't put decimal numbers into the enemy drop "denominator"
 * field in the editor, or go dig up your probability section out of your math
 * book to remember the formula to translate a percentage into a probability?
 *
 * Well look no further because now you can just enter a number into the drop
 * items "Probability" box and that number will be treated as a #/100 chance!
 * For example, if you enter "40" in the "Probability" field on the Enemy tab
 * in the database, it will be treated as "a 40/100 chance of acquiring the
 * loot, aka 40% chance".
 *
 * NOTE ABOUT USING THIS PLUGIN:
 * By having this plugin enabled, you opt into the PERCENTAGE DROPS feature
 * and cannot disable it. It is required, and probably the reason you're using
 * this plugin anyway.
 *
 * NOTE ABOUT TREASURE HUNTER GODLINESS:
 * If the percentage chance exceeds 100%, the drop item will always drop.
 * This sounds obvious, but remember this when looking at the TAG EXAMPLES.
 * ============================================================================
 * ADDITIONAL ITEMS:
 * Have you ever wanted to drop more items than just three per enemy? Well now
 * you can with the proper tags applied to enemies in the database!
 *
 * NOTE ABOUT NATIVE DROP INTERACTIONS:
 * This is additive in the sense that if you specify drop items using the
 * editor and also have one or more of these tags on an enemy, it will add
 * all of them together as potential drops, exceeding the limit of 3.
 *
 * NOTE ABOUT DUPLICATE TAGS:
 * You can have more than one of the same item drop, at the same or different
 * rates and they will individually be processed.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 * <drops:[TYPE,ID,CHANCE]>
 * where TYPE is either "i", "w", or "a" (representing item/weapon/armor).
 * where ID is the id of the drop item in the database.
 * where CHANCE is the percent chance to drop.
 *
 * TAG EXAMPLES:
 *  <drops:[i,3,10]>
 * This enemy has a [10% chance] to drop [an item] of [id 3 in the database].
 *
 *  <drops:[w,12,65]>
 *  <drops:[w,12,15]>
 *  <drops:[a,5,100]>
 * This enemy has a [65% chance] to drop [a weapon] of [id 12 in the database].
 * This enemy has a [15% chance] to drop [a weapon] of [id 12 in the database].
 * This enemy has a [100% chance] to drop [an armor] of [id 5 in the database].
 * ============================================================================
 * DROP MULTIPLIER
 * Additionally, you can apply tags to increase this percentage chance
 * multiplicatively! See the tag examples down below for additional details
 * on how the multiplication works and the caveats to consider when adding
 * the tag to things in the database.
 *
 * NOTE:
 * The bonuses from all members in the battle party will be considered by
 * adding them all together to produce a "party drop item rate".
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
 *  <dropMultiplier:NUM>
 * Where NUM is the a positive amount to increase drop item rate.
 *
 * TAG EXAMPLES:
 *  <dropMultiplier:50>
 * This actor now has +50% drop chance.
 * - If a drop item on an enemy has a 40% chance to drop, with this drop
 * multiplier bonus it would be increased from 40% >> 60% (50% of 40 is 20)
 * - If a drop item on an enemy has a 4% chance to drop, with this drop
 * multiplier bonus, it would be increased from 4% >> 6% (50% of 4 is 2)
 *
 *  <dropMultiplier:10>
 *  <dropMultiplier:40>
 *  <dropMultiplier:200>
 * This actor now has +250% drop chance.
 * - If a drop item on an enemy has a 40% chance to drop, with this drop
 * multiplier bonus, it would be increased from 40% >> 140% (250% of 40 is 100)
 * - If a drop item on an enemy has a 4% chance to drop, with this drop
 * multiplier bonus, it would be increased from 4% >> 14% (250% of 4 is 10)
 * ============================================================================
 * GOLD MULTIPLIER
 * Have you ever wanted to have an actor gain bonus gold for some thiefy
 * reason or another? Well now you can by applying the proper tags to the
 * various database locations that are relevant.
 *
 * NOTE 1:
 * This does not apply to gold earned from other sources,
 * such as event/script/plugin commands.
 *
 * NOTE 2:
 * The bonuses from all members in the battle party will be considered by
 * adding them all together to produce a "party gold rate".
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
 *  <goldMultiplier:NUM>
 * Where NUM is the a positive amount to increase gold earned rate.
 *
 * TAG EXAMPLES:
 *  <goldMultiplier:50>
 * The party will now gain +50% gold from defeated enemies.
 *
 *  <goldMultiplier:65>
 *  <goldMultiplier:10>
 *  <goldMultiplier:100>
 * The party will now gain +175% gold from defeated enemies.
 * ============================================================================
 * CHANGELOG:
 * - 2.1.2
 *    Consumed `RPGManager` updates.
 * - 2.1.1
 *    Added guard to prevent adding invalid drops to the drop list.
 * - 2.1.0
 *    Further abstracted some of the logic for drops to support extension.
 * - 2.0.0
 *    Retroactively added this CHANGELOG.
 *    Refactored various data retrieval methods from given battlers.
 *    Fixed issue with mismapped level calculations.
 *    Added more jsdocs and comments to explain better the logical flow.
 *    Removed useless methods.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */

//#region src/plugins/drops/core/_metadata/_pluginMetadata.js
var J_DropsControlPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/drops/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.DROPS = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.DROPS.Metadata = new J_DropsControlPluginMetadata("J-DropsControl", "2.1.2");
/**
* All regular expressions used by this plugin.
*/
J.DROPS.RegExp = {};
J.DROPS.RegExp.ExtraDrop = /<drops:[ ]?(\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)])>/i;
J.DROPS.RegExp.DropMultiplier = /<dropMultiplier:[ ]?(-?\d+)>/i;
J.DROPS.RegExp.GoldMultiplier = /<goldMultiplier:[ ]?(-?\d+)>/i;
/**
* The collection of all aliased classes for extending.
*/
J.DROPS.Aliased = {
	Game_Enemy: new Map(),
	RPG_Enemy: new Map(),
	Scene_Boot: new Map()
};

//#endregion
//#region src/plugins/drops/core/database/RPG_DropItem.js
/**
* Translates this drop item into its corresponding implemented class.
* @returns {RPG_Item|RPG_Weapon|RPG_Armor}
*/
RPG_DropItem.prototype.toImplementation = function() {
	let source;
	switch (this.kind) {
		case RPG_DropItem.Types.Item:
			source = $dataItems;
			break;
		case RPG_DropItem.Types.Weapon:
			source = $dataWeapons;
			break;
		case RPG_DropItem.Types.Armor:
			source = $dataArmors;
			break;
		default: throw new Error(`This drop item is missing properties to fulfill this request.`, this);
	}
	return source.at(this.dataId);
};

//#endregion
//#region src/plugins/drops/core/database/RPG_DropItemBuilder.js
/**
* A builder class for simply developing {@link RPG_DropItem}s.
*/
var RPG_DropItemBuilder = class {
	/**
	* The current id mapping to the entry in the database for this drop.
	* @type {number}
	*/
	#id = 0;
	/**
	* The type id mapping to one of the given {@link RPG_DropItem.Types} that represent
	* the type of drop this is.
	* @type {number}
	*/
	#type = 0;
	/**
	* The percent chance that this loot will be dropped.
	* @type {number}
	*/
	#chance = 0;
	/**
	* Builds the {@link RPG_DropItem} with the current parameters in this builder.
	* @param {boolean=} withClear Whether or not to clear the builder's data after building; defaults to true.
	* @returns {RPG_DropItem} The constructed drop.
	*/
	build(withClear = true) {
		const dropItem = {
			kind: this.#type,
			dataId: this.#id,
			denominator: this.#chance
		};
		if (withClear) {
			this.#clear();
		}
		return new RPG_DropItem(dropItem);
	}
	/**
	* Clears all data currently in the builder.
	*/
	#clear() {
		this.setId(0);
		this.setType(0);
		this.setChance(0);
	}
	/**
	* Sets the id aka `dataId` of this {@link RPG_DropItem}.<br>
	* @param {number} id The database id of the item.
	* @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
	*/
	setId(id) {
		this.#id = id;
		return this;
	}
	/**
	* Sets the typeId aka `kind` of this {@link RPG_DropItem}.<br>
	* @param {number} typeId The typeId of this loot.
	* @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
	*/
	setType(typeId) {
		this.#type = typeId;
		return this;
	}
	/**
	* Sets the chance aka `denominator` for this {@link RPG_DropItem} to drop.
	* @param {number} percentChance The chance for this loot to drop.
	* @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
	*/
	setChance(percentChance) {
		this.#chance = percentChance;
		return this;
	}
	/**
	* Builds a item drop based on the given parameters.
	* @param {number} databaseId The id in the database of this item.
	* @param {number} percentChance The chance that this loot should drop.
	* @return {RPG_DropItem} A item-based loot drop with the given parameters.
	*/
	itemLoot(databaseId, percentChance) {
		this.setType(RPG_DropItem.Types.Item);
		this.setId(databaseId);
		this.setChance(percentChance);
		return this.build();
	}
	/**
	* Builds a weapon drop based on the given parameters.
	* @param {number} databaseId The id in the database of this weapon.
	* @param {number} percentChance The chance that this loot should drop.
	* @return {RPG_DropItem} A weapon-based loot drop with the given parameters.
	*/
	weaponLoot(databaseId, percentChance) {
		this.setType(RPG_DropItem.Types.Weapon);
		this.setId(databaseId);
		this.setChance(percentChance);
		return this.build();
	}
	/**
	* Builds a armor drop based on the given parameters.
	* @param {number} databaseId The id in the database of this armor.
	* @param {number} percentChance The chance that this loot should drop.
	* @return {RPG_DropItem} A armor-based loot drop with the given parameters.
	*/
	armorLoot(databaseId, percentChance) {
		this.setType(RPG_DropItem.Types.Armor);
		this.setId(databaseId);
		this.setChance(percentChance);
		return this.build();
	}
};

//#endregion
//#region src/plugins/drops/core/database/RPG_Enemy.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the extra drops.
*/
J.DROPS.Aliased.Game_Enemy.set("initMembers", RPG_Enemy.prototype.initMembers);
RPG_Enemy.prototype.initMembers = function(enemy) {
	J.DROPS.Aliased.Game_Enemy.get("initMembers").call(this, enemy);
	this.initExtraDrops();
};
/**
* Parses the extra drops on the enemy and adds them into the collection.
*/
RPG_Enemy.prototype.initExtraDrops = function() {
	const moreDrops = RPGManager.getArraysFromNotesByRegex(this, J.DROPS.RegExp.ExtraDrop, true);
	if (moreDrops.length === 0) return;
	const mapper = (drop) => {
		const [dropType, dropId, chance] = drop;
		return new RPG_DropItemBuilder().setType(RPG_DropItem.TypeFromLetter(dropType)).setId(dropId).setChance(chance).build();
	};
	const convertedDrops = moreDrops.map(mapper, this);
	this.dropItems.push(...convertedDrops);
};
/**
* Gets the list of original drop items from the enemy in the database.
*
* This double-checks the actual drop items associated with an enemy in the
* database as you can have invalid drop items if you set a drop up with a
* denominator, but then changed your mind and flipped the drop type to "None".
* @returns {RPG_DropItem[]}
*/
RPG_Enemy.prototype.originalDropItems = function() {
	return this.dropItems.filter(this.validDropItemFilter, this);
};
/**
* Determines whether or not a drop item is a valid drop.
* @param {RPG_DropItem} dropItem The potential drop to check.
* @returns {boolean} True if the drop is valid, false otherwise.
*/
RPG_Enemy.prototype.validDropItemFilter = function(dropItem) {
	if (!dropItem) return false;
	if (!dropItem.dataId || !dropItem.kind) return false;
	return true;
};

//#endregion
//#region src/plugins/drops/core/models/DropsPartyStrategy.js
/**
* A class representing a static collection of party strategies relating to rewards.
*/
var DropsPartyStrategy = class {
	constructor() {
		console.warn(`Attempted to instantiate the PartyStrategy class.`);
		console.warn(`Please directly use the static properties on it instead of instantiating it.`);
		console.trace();
		throw new Error(`PartyStrategy is a static class that cannot be instantiated.`);
	}
	/**
	* The strategy used in niche cases like in games backed by ABS engines.
	* This defines where only the leader will influence reward rates.
	* @type {string}
	*/
	static AbsStyle = "leader-only";
	/**
	* The strategy used most commonly in games wielding standard turn-based battle systems.
	* This defines where the active combat party, usually about 4 including the leader,
	* will influence reward rates.
	* @type {string}
	*/
	static CombatPartyStyle = "combat-party";
	/**
	* The strategy used most often as an alternative to {@link DropsPartyStrategy.CombatPartyStyle}.
	* This defines where every single member of the party, reserve or otherwise,
	* will influence reward rates.
	* @type {string}
	*/
	static FullPartyStyle = "full-party";
};

//#endregion
//#region src/plugins/drops/core/objects/Game_Actor.js
Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	* Gold drop rate multiplier bonus.
	*/
	gdr: {
		get: function() {
			return 0;
		},
		configurable: true
	},
	/**
	* Item drop rate multiplier bonus.
	*/
	dor: {
		get: function() {
			return 0;
		},
		configurable: true
	}
});
Object.defineProperty(Game_Actor.prototype, "gdr", {
	get: function() {
		return this.getGoldMultiplier();
	},
	configurable: true
});
Object.defineProperty(Game_Actor.prototype, "dor", {
	get: function() {
		return this.getDropMultiplierBonus();
	},
	configurable: true
});
/**
* Gets this actor's bonus drop multiplier.
* @returns {number}
*/
Game_Actor.prototype.getDropMultiplierBonus = function() {
	const baseMultiplier = 0;
	const objectsToCheck = this.getAllNotes();
	const multiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.DropMultiplier);
	const factor = (multiplierBonus + baseMultiplier) / 100;
	return factor;
};
/**
* Gets this actor's bonus gold multiplier.
* @returns {number}
*/
Game_Actor.prototype.getGoldMultiplier = function() {
	const baseMultiplier = 0;
	const objectsToCheck = this.getAllNotes();
	const multiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.GoldMultiplier);
	const factor = (multiplierBonus + baseMultiplier) / 100;
	return factor;
};

//#endregion
//#region src/plugins/drops/core/objects/Game_Enemy.js
/**
* Gets the gold that the enemy dropped.
* This includes multipliers from our gold bonuses.
* @returns {number} The rounded product of the base gold against the multiplier.
*/
J.DROPS.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function() {
	const baseGoldRate = this.getBaseGoldRate();
	const baseGold = J.DROPS.Aliased.Game_Enemy.get("gold").call(this) * baseGoldRate;
	const multiplier = $gameParty.getGoldMultiplier();
	return Math.round(baseGold * multiplier);
};
/**
* The base gold multiplier of this enemy.
* Currently defaults to 1, but open for extension.
* @returns {number}
*/
Game_Enemy.prototype.getBaseGoldRate = function() {
	return 1;
};
/**
* Overwrites {@link #makeDropItems}.<br/>
* Modifies the drop chance algorithm to treat the number entered in the database as a percent chance instead of some
* weird fractional shit. Also applies any applicable multipliers against the discovery rate of loot.
* @returns {RPG_BaseItem[]} The array of loot successfully found.
*/
Game_Enemy.prototype.makeDropItems = function() {
	const dropList = this.getDropItems();
	if (!dropList.length) return [];
	const itemsFound = [];
	const multiplier = this.getDropMultiplierBonus();
	dropList.forEach((drop) => {
		if (!this.canFindLoot(drop)) return;
		const rate = drop.denominator * multiplier;
		const treasureHunterSkip = rate >= 100;
		const foundLoot = treasureHunterSkip ? true : this.didFindLoot(rate);
		if (foundLoot === false) return;
		this.findLoot(drop, itemsFound);
	}, this);
	return itemsFound;
};
/**
* Builds the drop to be found and adds it to the running list.
* @param {RPG_DropItem} drop The drop being found.
* @param {RPG_BaseItem} itemsFound The running list of items that have been found.
*/
Game_Enemy.prototype.findLoot = function(drop, itemsFound) {
	const item = this.itemObject(drop.kind, drop.dataId);
	if (!item) {
		console.warn(`Invalid drop resolved:
       enemy=${this.enemy().name}, kind=${drop.kind}, id=${drop.dataId},
      "(check DB entry and note tags).`);
		return;
	}
	itemsFound.push(item);
};
/**
* Determines if the drop is allowed to be found.
* @param {RPG_DropItem} drop The drop to potentially to find.
*/
Game_Enemy.prototype.canFindLoot = function(drop) {
	if (drop.kind === 0) return false;
	return true;
};
/**
* Determines whether or not loot was found based on the provided rate.
* This is not deterministic, and the same (non-100) rate
* @param {number} rate The 0-100 integer rate of which to find this loot.
* @returns {boolean} True if we found loot this time, false otherwise.
*/
Game_Enemy.prototype.didFindLoot = function(rate) {
	let chance = rate;
	if ($gameParty.hasDropItemDouble()) {
		chance *= 2;
	}
	const found = RPGManager.chanceIn100(chance);
	return found;
};
/**
* Gets the drop items from this enemy from all sources available.
* @returns {RPG_DropItem[]}
*/
Game_Enemy.prototype.getDropItems = function() {
	const baseDropItems = this.enemy().originalDropItems();
	const allDropItems = [...baseDropItems];
	const extraDropItems = this.extraDrops();
	allDropItems.push(...extraDropItems);
	return allDropItems;
};
/**
* Gets any additional drops from the notes of this particular enemy.
* @returns {RPG_DropItem[]}
*/
Game_Enemy.prototype.extraDrops = function() {
	const extraDrops = [];
	const sources = this.dropSources();
	sources.forEach((source) => {
		const drops = this.extractExtraDrops(source);
		extraDrops.push(...drops);
	}, this);
	return extraDrops;
};
/**
* A collection of all sources of which loot may be acquired from.
* Typically, this will only be the enemy itself, but is open for extension.
* @returns {RPG_BaseItem[]}
*/
Game_Enemy.prototype.dropSources = function() {
	const sources = [];
	return sources;
};
/**
* Parses the given reference data to extract any extra drops that may be present.
* @param {RPG_BaseItem} referenceData The database object to parse.
* @returns {RPG_DropItem[]}
*/
Game_Enemy.prototype.extractExtraDrops = function(referenceData) {
	const moreDrops = RPGManager.getArraysFromNotesByRegex(referenceData, J.DROPS.RegExp.ExtraDrop, true) ?? [];
	const mapper = (drop) => {
		const [dropType, dropId, chance] = drop;
		return new RPG_DropItemBuilder().setType(RPG_DropItem.TypeFromLetter(dropType)).setId(dropId).setChance(chance).build();
	};
	const convertedDrops = moreDrops.map(mapper, this);
	return convertedDrops;
};
/**
* Gets the multiplier against the RNG of an item dropping.
* @returns {number}
*/
Game_Enemy.prototype.getDropMultiplierBonus = function() {
	let multiplier = this.getBaseDropRate();
	multiplier += $gameParty.getPartyDropMultiplier();
	multiplier *= this.dropItemRate();
	return multiplier;
};
/**
* The base drop rate multiplier of this enemy.
* Currently defaults to 1, but open for extension.
* @returns {number}
*/
Game_Enemy.prototype.getBaseDropRate = function() {
	return 1;
};

//#endregion
//#region src/plugins/drops/core/objects/Game_Party.js
/**
* Gets the collective sum multiplier for gold drops for the entire party.
* @returns {number}
*/
Game_Party.prototype.getGoldMultiplier = function() {
	const baseMultiplier = 1;
	const membersToConsider = this.goldMultiplierMembers();
	const goldMultiplier = membersToConsider.reduce((runningTotal, currentActor) => runningTotal + currentActor.getGoldMultiplier(), baseMultiplier);
	return goldMultiplier;
};
/**
* Gets the selection of actors to consider when determining gold bonus multipliers.
* @returns {Game_Actor[]}
*/
Game_Party.prototype.goldMultiplierMembers = function(strategy = DropsPartyStrategy.CombatPartyStyle) {
	const membersToConsider = [];
	switch (strategy) {
		case DropsPartyStrategy.AbsStyle:
			membersToConsider.push($gameParty.leader());
			break;
		case DropsPartyStrategy.CombatPartyStyle:
			membersToConsider.push(...$gameParty.battleMembers());
			break;
		case DropsPartyStrategy.FullPartyStyle:
			membersToConsider.push(...$gameParty.members());
			break;
	}
	return membersToConsider;
};
/**
* Gets the collective sum multiplier for loot drops for the entire party.
* @returns {number}
*/
Game_Party.prototype.getPartyDropMultiplier = function() {
	const baseMultiplier = 1;
	const membersToConsider = this.dropMultiplierMembers();
	const dropMultiplier = membersToConsider.reduce((runningTotal, currentActor) => runningTotal + currentActor.getDropMultiplierBonus(), baseMultiplier);
	return dropMultiplier;
};
/**
* Gets the selection of actors to consider when determining bonus drop multipliers.
* @returns {Game_Actor[]}
*/
Game_Party.prototype.dropMultiplierMembers = function(strategy = DropsPartyStrategy.CombatPartyStyle) {
	const membersToConsider = [];
	switch (strategy) {
		case DropsPartyStrategy.AbsStyle:
			membersToConsider.push($gameParty.leader());
			break;
		case DropsPartyStrategy.CombatPartyStyle:
			membersToConsider.push(...$gameParty.battleMembers());
			break;
		case DropsPartyStrategy.FullPartyStyle:
			membersToConsider.push(...$gameParty.members());
			break;
	}
	return membersToConsider;
};

//#endregion
//#region src/plugins/drops/core/managers/TextManager.js
/**
* Display label for gold rate — bonus multiplier on gold rewards.
* @returns {string}
*/
TextManager.goldRate = function() {
	return "Gold Rate";
};
/**
* Help text explaining how gold rate improves battle and chest payouts.
* @returns {string[]}
*/
TextManager.goldRateDescription = function() {
	return ["Bonus multiplier applied to gold rewards.", "Higher values yield more gold from battles and chests."];
};
/**
* Display label for drop rate — bonus multiplier on item drop chances.
* @returns {string}
*/
TextManager.dropRate = function() {
	return "Drop Rate";
};
/**
* Help text explaining how drop rate improves extra loot odds.
* @returns {string[]}
*/
TextManager.dropRateDescription = function() {
	return ["Bonus multiplier applied to item drop chances.", "Higher values improve the odds of extra loot."];
};

//#endregion
//#region src/plugins/drops/core/managers/IconManager.js
/**
* Icon index for gold rate bonus in fate parameter UI.
* @returns {number}
*/
IconManager.goldRate = function() {
	return 314;
};
/**
* Icon index for item drop rate bonus in fate parameter UI.
* @returns {number}
*/
IconManager.dropRate = function() {
	return 210;
};

//#endregion
//#region src/plugins/drops/core/core/registerDropsParameters.js
/**
* Boot-time registration for J-Drops parameters in {@link ParameterRegistry}.
*/
var DropsParameterRegistration = class {
	/**
	* Registers gold and drop rate multipliers with the parameter catalog.
	*/
	static registerAll() {
		ParameterRegistry.register(ParameterDefinition.Builder().key("gdr").group(ParameterGroups.FATE).sortOrder(3).label(() => TextManager.goldRate()).description(() => TextManager.goldRateDescription()).iconIndex(() => IconManager.goldRate()).format(ParameterFormat.MULTIPLIER_PERCENT).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.gdr).sdpBinding(SdpParameterBinding.byKey("gdr", () => 1)).build());
		ParameterRegistry.register(ParameterDefinition.Builder().key("dor").group(ParameterGroups.FATE).sortOrder(6).label(() => TextManager.dropRate()).description(() => TextManager.dropRateDescription()).iconIndex(() => IconManager.dropRate()).format(ParameterFormat.MULTIPLIER_PERCENT).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.dor).sdpBinding(SdpParameterBinding.byKey("dor", () => 1)).build());
	}
};

//#endregion
//#region src/plugins/drops/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Drops stats with the parameter catalog after vanilla seeding.
*/
J.DROPS.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.DROPS.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	DropsParameterRegistration.registerAll();
};

//#endregion
//# sourceMappingURL=J-DropsControl.js.map