//region Introduction
/*:
 * @target MZ
 * @plugindesc [v2.5.1 DROPS] Enables greater control over loot drops.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-Extend
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
 * where TYPE is either "i"/"item", "w"/"weapon", or "a"/"armor" (the short
 * and long forms both work- use whichever reads clearer to you).
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
 * NATURAL GROWTH + DROP RATE:
 * Have you ever wanted your drop rate bonus to permanently grow along with
 * your other growths because you're also using my
 *
 *        J-NaturalGrowth
 *
 * plugin? Well now you can! This is a second, independent drop rate bonus
 * from the flat <dropMultiplier:NUM> tag above- it lives on its own
 * registered parameter (key "dor"), can be earned from SDP panels, and
 * follows J-NaturalGrowths' own builder-like Buff/Growth tag pattern instead
 * of a flat additive number.
 *
 * NOTE:
 * This section requires J-NaturalGrowth to be loaded. Without it, these tags
 * are silently ignored (the same as always- just nothing computes them).
 *
 * Formula context:
 *   a = the battler these bonuses are being calculated for
 *   b = 0 (dor's base value is always 0- there's no "base drop rate" to
 *       expose without re-triggering the getAllNotes() lookup these formulas
 *       already live inside)
 *   v = $gameVariables._data
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
 *  <dorBuffPlus:[FORMULA]>
 *  <dorBuffRate:[FORMULA]>
 *  <dorGrowthPlus:[FORMULA]>
 *  <dorGrowthRate:[FORMULA]>
 * Where "Buff" is temporary (lost when the tag's source is removed) and
 * "Growth" is permanent (accumulates and stays as you level).
 * Where "Plus" is a flat amount and "Rate" is a percent-of-base amount.
 *
 * TAG EXAMPLES:
 *  <dorGrowthPlus:[a.level * 0.5]>
 * Permanently gain (level × 0.5)% drop rate per level.
 *
 *  <dorBuffPlus:[15]>
 * Gain a flat 15% drop rate while this tag's source is applied; lost if the
 * source is removed.
 *
 * Please refer to the J-NaturalGrowth documentation for more details on the
 * Buff/Growth/Plus/Rate pattern itself.
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
 * - 2.5.1
 *    Routed the static-instantiation and invalid-drop reports through J-Base's
 *    new Diagnostics, so each names J-DropsControl. The invalid-drop warning now
 *    shows the enemy, kind and id as named keys instead of a wrapped string.
 * - 2.5.0
 *    Added drop upgrade ladders. A ladder names a chain of rows in ascending
 *    order, and a battler carrying <dropUpgrade:N> promotes each drop N rungs
 *    along whichever ladder claims it, so a single authored drop can express a
 *    whole rarity tier without the enemy listing every rung it might yield.
 *    Added <dropQuantity:N>, granting extra copies of each item that dropped.
 *    Both are summed from all note sources on both sides of the kill, because
 *    an affix graded onto the slain enemy and a harvesting tool carried by the
 *    killer are the same kind of contribution. An enemy's ordinary states are
 *    already cleared by death; passive states held externally survive.
 *    Added the postProcessDroppedLoot hook, which runs after loot is rolled and
 *    before it is awarded. Extensions that observe or modify a haul alias this
 *    rather than makeDropItems, so they see the list at a defined point rather
 *    than racing each other through one override.
 * - 2.3.0
 *    Loot drops now resolve through the shared proc-count path, so a killer in
 *    Accumulate Mode earns a copy per successful roll rather than spending the
 *    surplus on an already-won roll, and Encore echoes each earned copy. The
 *    treasure-hunter shortcut is gone as a special case rather than as
 *    behavior; one consequence is that an absolutely cursed killer can now be
 *    denied a guaranteed drop, where the shortcut previously bypassed fate.
 *    didFindLoot keeps its boolean contract and delegates.
 *    Fixed two compounding rate bugs that made loot far more common than
 *    authored: the enemy base rate and the party bonus both started from one
 *    and were summed, doubling every drop in the game; and the double-drop
 *    accessory was consulted twice per roll, once inside the multiplier and
 *    again as a bare doubling of the chance.
 * - 2.2.0
 *    Added a NaturalGrowth-integrated drop rate stat (key "dor") via
 *    <dorBuffPlus>/<dorBuffRate>/<dorGrowthPlus>/<dorGrowthRate>, following
 *    J-NaturalGrowth's own Buff/Growth tag pattern; requires J-NaturalGrowth.
 *    makeDropItems/didFindLoot now accept the killing battler, whose
 *    lucky/cursed on-chance rolls now contribute to the loot-discovery roll.
 *    Documented that drop TYPE accepts long-form aliases (item/weapon/armor)
 *    alongside the short forms (i/w/a).
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
var J_DropsControlPluginMetadata = class J_DropsControlPluginMetadata extends PluginMetadata {
	/**
	* The upgrade ladders, keyed by {@link RPG_DropItem.Types}. Each inner map points a row id at the
	* row id directly above it on its ladder.
	* @type {Map<number, Map<number, number>>}
	*/
	upgradeLadders = new Map();
	/**
	* The downgrade ladders, keyed by {@link RPG_DropItem.Types}. Derived by inverting
	* {@link upgradeLadders}, never authored, so the two directions cannot disagree.
	* @type {Map<number, Map<number, number>>}
	*/
	downgradeLadders = new Map();
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* The three database tables a drop can point into, paired with the drop kind that identifies each.
	*
	* Named here rather than at the boot call site so the ladder builder can be handed a fixture in a
	* test without a database, and so the drop-kind-to-table mapping lives in exactly one place.
	* @returns {({kind: number, name: string, rows: RPG_BaseItem[]})[]}
	*/
	dropLadderTables() {
		return [
			{
				kind: RPG_DropItem.Types.Item,
				name: "item",
				rows: $dataItems
			},
			{
				kind: RPG_DropItem.Types.Weapon,
				name: "weapon",
				rows: $dataWeapons
			},
			{
				kind: RPG_DropItem.Types.Armor,
				name: "armor",
				rows: $dataArmors
			}
		];
	}
	/**
	* Builds and validates every drop upgrade ladder from the database.
	*
	* Runs once at boot rather than lazily, because the point of the validation is to fail at launch
	* where a person is watching. A ladder defect discovered at kill time is a drop that quietly
	* vanishes; the same defect discovered here names the offending rows.
	* @param {({kind: number, name: string, rows: RPG_BaseItem[]})[]} tables The database tables to scan.
	*/
	buildDropLadders(tables) {
		tables.forEach((table) => {
			const { kind, name, rows } = table;
			const upgrades = J_DropsControlPluginMetadata.readLadderLinks(name, rows);
			J_DropsControlPluginMetadata.assertNoLadderCycles(name, upgrades);
			this.upgradeLadders.set(kind, upgrades);
			this.downgradeLadders.set(kind, J_DropsControlPluginMetadata.invertLadder(upgrades));
		}, this);
	}
	/**
	* Reads every authored `<dropUpgradeId>` in one table into a map of row to the row above it.
	*
	* Two things are fatal here. A link naming a row the table does not contain would resolve to
	* nothing at kill time and silently delete the drop, so an unknown id fails now. Two rows naming
	* the same row above them would invert into one row with two rows beneath it, and a downgrade
	* could not choose between them- a ladder with a fork is not a ladder.
	* @param {string} name The human-readable table name, used only in error messages.
	* @param {RPG_BaseItem[]} rows The table to scan.
	* @returns {Map<number, number>}
	*/
	static readLadderLinks(name, rows) {
		const upgrades = new Map();
		const claimedBy = new Map();
		rows.forEach((row, id) => {
			const upgradeId = RPGManager.getNumberFromNoteByRegex(row, J.DROPS.RegExp.DropUpgradeId);
			if (upgradeId === 0) return;
			const target = rows.at(upgradeId);
			if (!target) {
				throw new Error(`J-DropsControl: ${name} row [${id}] has <dropUpgradeId:${upgradeId}>, ` + `which is not a row in that table.`);
			}
			if (claimedBy.has(upgradeId)) {
				const otherId = claimedBy.get(upgradeId);
				throw new Error(`J-DropsControl: ${name} rows [${otherId}] and [${id}] both promote into [${upgradeId}], ` + `which forks the downgrade path.`);
			}
			claimedBy.set(upgradeId, id);
			upgrades.set(id, upgradeId);
		});
		return upgrades;
	}
	/**
	* Verifies no ladder in this table loops back on itself.
	*
	* Walks from **every** linked row rather than from the roots. A closed loop has no root- every one
	* of its members has something pointing at it- so a root-first sweep would never enter one and the
	* defect would survive boot untouched.
	* @param {string} name The human-readable table name, used only in error messages.
	* @param {Map<number, number>} upgrades The ladder links for one table.
	*/
	static assertNoLadderCycles(name, upgrades) {
		upgrades.forEach((unusedTarget, startId) => {
			const visited = new Set();
			let current = startId;
			while (upgrades.has(current)) {
				if (visited.has(current)) {
					throw new Error(`J-DropsControl: ${name} row [${current}] is part of a circular drop upgrade ladder.`);
				}
				visited.add(current);
				current = upgrades.get(current);
			}
		});
	}
	/**
	* Inverts one table's ladder into its downgrade direction.
	*
	* Safe to do blindly because {@link readLadderLinks} already rejected the only shape that would
	* make the inverse ambiguous.
	* @param {Map<number, number>} upgrades The ladder links for one table.
	* @returns {Map<number, number>}
	*/
	static invertLadder(upgrades) {
		const downgrades = new Map();
		upgrades.forEach((upperId, lowerId) => downgrades.set(upperId, lowerId));
		return downgrades;
	}
	/**
	* Walks a row along its ladder by the given number of rungs.
	*
	* Positive counts climb and negative counts descend, both stopping at the end of the chain rather
	* than reporting a problem- over-promoting is a normal outcome of a generous roll, not a
	* misconfiguration. A row on no ladder is its own answer.
	* @param {number} kind The {@link RPG_DropItem.Types} of the row being walked.
	* @param {number} id The row id to start from.
	* @param {number} rungs How many rungs to travel; negative descends.
	* @returns {number} The row id arrived at.
	*/
	walkDropLadder(kind, id, rungs) {
		const climbing = rungs > 0;
		const ladders = climbing ? this.upgradeLadders : this.downgradeLadders;
		const ladder = ladders.get(kind);
		if (!ladder) return id;
		let current = id;
		let remaining = Math.abs(rungs);
		while (remaining > 0 && ladder.has(current)) {
			current = ladder.get(current);
			remaining -= 1;
		}
		return current;
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
* The plugin umbrella that governs all extensions related to this plugin.
*/
J.DROPS.EXT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.DROPS.Metadata = new J_DropsControlPluginMetadata("J-DropsControl", "2.5.1");
/**
* All regular expressions used by this plugin.
*/
J.DROPS.RegExp = {};
J.DROPS.RegExp.ExtraDrop = /<drops:[ ]?(\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)])>/i;
J.DROPS.RegExp.DropMultiplier = /<dropMultiplier:[ ]?(-?\d+)>/i;
J.DROPS.RegExp.GoldMultiplier = /<goldMultiplier:[ ]?(-?\d+)>/i;
/**
* The rung above this row on its drop upgrade ladder.
*
* Authored on the lower row, naming the row it promotes into. Only the upward links are authored; the
* downgrade direction is derived by inverting them at boot, so the two directions can never disagree.
* The id is read against whichever table the tagged row lives in, which is what makes an armor
* incapable of promoting into an item.
*
* <pre>
* Structure:
*  <dropUpgradeId:ID>
*
* Example:
*  <dropUpgradeId:307>
*
* Translation:
*  Promoting this row once yields row 307 of the same table.
* </pre>
* @type {RegExp}
*/
J.DROPS.RegExp.DropUpgradeId = /<dropUpgradeId:[ ]?(\d+)>/i;
/**
* How many rungs to promote a drop along its ladder.
*
* Summed across every note source of the slain enemy and of its killer, so an affix on the target and
* a harvesting tool on the killer add together rather than competing. Negative values walk the ladder
* downward. Over-promoting is not an error- the walk simply stops at the end of the chain.
*
* <pre>
* Structure:
*  <dropUpgrade:AMOUNT>
*
* Example:
*  <dropUpgrade:2>
*
* Translation:
*  Drops from this kill are promoted two rungs up their ladder.
* </pre>
* @type {RegExp}
*/
J.DROPS.RegExp.DropUpgrade = /<dropUpgrade:[ ]?(-?\d+)>/gi;
/**
* How many extra copies of each dropped item to grant.
*
* Summed like {@link J.DROPS.RegExp.DropUpgrade}, and applied once per distinct item that dropped
* rather than once per drop entry- an enemy listing the same item four times has dropped one thing,
* and the bonus lands on the thing. Negative values remove copies and may remove the last one, which
* is what gives negative affixes teeth.
*
* <pre>
* Structure:
*  <dropQuantity:AMOUNT>
*
* Example:
*  <dropQuantity:2>
*
* Translation:
*  Two extra copies of each distinct item dropped by this kill.
* </pre>
* @type {RegExp}
*/
J.DROPS.RegExp.DropQuantity = /<dropQuantity:[ ]?(-?\d+)>/gi;
J.DROPS.RegExp.DropRateBuffPlus = /<dorBuffPlus:\[([+\-*/ ().\w]+)]>/gi;
J.DROPS.RegExp.DropRateBuffRate = /<dorBuffRate:\[([+\-*/ ().\w]+)]>/gi;
J.DROPS.RegExp.DropRateGrowthPlus = /<dorGrowthPlus:\[([+\-*/ ().\w]+)]>/gi;
J.DROPS.RegExp.DropRateGrowthRate = /<dorGrowthRate:\[([+\-*/ ().\w]+)]>/gi;
/**
* The collection of all aliased classes for extending.
*/
J.DROPS.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
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
	const moreDrops = RPGManager.getArraysFromNotesByRegex(this, J.DROPS.RegExp.ExtraDrop);
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
		const remedy = "use the static properties on it directly instead of instantiating it.";
		Diagnostics.trace("J-DropsControl", `attempted to instantiate the PartyStrategy class; ${remedy}`);
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
//#region src/plugins/drops/core/objects/Game_Battler.js
/**
* Extends `.initNaturalGrowthParameters()` to include dor as growth-ready.
*/
J.DROPS.Aliased.Game_Battler.set("initNaturalGrowthParameters", Game_Battler.prototype.initNaturalGrowthParameters);
Game_Battler.prototype.initNaturalGrowthParameters = function() {
	if (!J.NATURAL) return;
	J.DROPS.Aliased.Game_Battler.get("initNaturalGrowthParameters").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with natural growth.
	*/
	this._j._natural ||= {};
	/**
	* The permanent flat bonus for drop rate.
	* @type {number}
	*/
	this._j._natural._dorPlus = 0;
	/**
	* The permanent multiplier bonus for drop rate.
	* @type {number}
	*/
	this._j._natural._dorRate = 0;
};
/**
* Gets the permanent flat bonus for drop rate.
* @returns {number}
*/
Game_Battler.prototype.dorPlus = function() {
	return this._j._natural._dorPlus;
};
/**
* Modifies the permanent flat bonus for drop rate.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modDorPlus = function(amount) {
	this._j._natural._dorPlus += amount;
};
/**
* Gets the permanent multiplicative bonus for drop rate.
* @returns {number}
*/
Game_Battler.prototype.dorRate = function() {
	return this._j._natural._dorRate;
};
/**
* Modifies the permanent multiplicative bonus for drop rate.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modDorRate = function(amount) {
	this._j._natural._dorRate += amount;
};
/**
* Gets all natural bonuses for dor.
* @returns {number}
*/
Game_Battler.prototype.dorNaturalBonuses = function() {
	if (!J.NATURAL) return 0;
	const dorBuffs = this.dorNaturalBuffs();
	const dorGrowths = this.dorNaturalGrowths();
	return dorBuffs + dorGrowths;
};
/**
* Calculates the buffs for drop rate.
* @returns {number}
*/
Game_Battler.prototype.dorNaturalBuffs = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = 0;
	const dorBuffPlus = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.DropRateBuffPlus, baseParam, this);
	const dorBuffRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.DropRateBuffRate, baseParam, this);
	if (!dorBuffPlus && !dorBuffRate) return 0;
	return this.calculatePlusRate(baseParam, dorBuffPlus, dorBuffRate);
};
/**
* Calculates the growths associated with drop rate.
* @returns {number}
*/
Game_Battler.prototype.dorNaturalGrowths = function() {
	const baseParam = 0;
	const growthPlus = this.dorPlus();
	const growthRate = this.dorRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
/**
* How many rungs this battler promotes drops by.
*
* Lives on the battler rather than the enemy so a slain enemy and the killer answer the same question
* the same way- an affix graded onto the target and a harvesting tool carried by the killer are the
* same kind of contribution and get summed rather than ranked.
*
* Note that an enemy's ordinary applied states are already gone by the time drops are made, since
* death clears them. Affixes survive because they are passive states held in an external source.
* @returns {number}
*/
Game_Battler.prototype.dropUpgradeCount = function() {
	const objectsToCheck = this.getAllNotes();
	return RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.DropUpgrade);
};
/**
* How many extra copies of each dropped item this battler grants.
*
* Sourced identically to {@link #dropUpgradeCount}; see there for why both sides of a kill contribute.
* @returns {number}
*/
Game_Battler.prototype.dropQuantityBonus = function() {
	const objectsToCheck = this.getAllNotes();
	return RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.DROPS.RegExp.DropQuantity);
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
/**
* Assembles a reward multiplier factor from this actor's notes and SDP panels.
* Both contributions are expressed in percent-points and are summed before being scaled down
* into the factor callers multiply by, so a notetag granting 20 and a panel granting 5 together
* produce a factor of 0.25 rather than two separately-rounded factors.
* @param {RegExp} structure The notetag structure carrying the multiplier.
* @param {string} parameterKey The SDP parameter key contributing to the same multiplier.
* @returns {number} The assembled multiplier factor.
*/
Game_Actor.prototype.rewardMultiplierFactor = function(structure, parameterKey) {
	const baseMultiplier = 0;
	const objectsToCheck = this.getAllNotes();
	const multiplierBonus = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, structure);
	const sdpBonus = J.SDP ? this.getSdpBonusForParameterKey(parameterKey, 1) : 0;
	return (multiplierBonus + baseMultiplier + sdpBonus) / 100;
};
Game_Actor.prototype.getDropMultiplierBonus = function() {
	const factor = this.rewardMultiplierFactor(J.DROPS.RegExp.DropMultiplier, "dor");
	const naturalBonus = this.dorNaturalBonuses();
	return factor + naturalBonus;
};
/**
* Extends `.applyNaturalCustomGrowths()` to include dor growths.
*/
J.DROPS.Aliased.Game_Actor.set("applyNaturalCustomGrowths", Game_Actor.prototype.applyNaturalCustomGrowths);
Game_Actor.prototype.applyNaturalCustomGrowths = function() {
	J.DROPS.Aliased.Game_Actor.get("applyNaturalCustomGrowths").call(this);
	if (!J.NATURAL) return;
	this.applyNaturalDorGrowths();
};
/**
* Applies the natural drop rate growths to this battler.
*/
Game_Actor.prototype.applyNaturalDorGrowths = function() {
	const baseParam = 0;
	const growthPlus = this.naturalParamBuff(J.DROPS.RegExp.DropRateGrowthPlus, baseParam);
	this.modDorPlus(growthPlus);
	const growthRate = this.naturalParamBuff(J.DROPS.RegExp.DropRateGrowthRate, baseParam);
	this.modDorRate(growthRate);
};
/**
* Gets this actor's bonus gold multiplier.
* @returns {number}
*/
Game_Actor.prototype.getGoldMultiplier = function() {
	return this.rewardMultiplierFactor(J.DROPS.RegExp.GoldMultiplier, "gdr");
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
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known; the
* killer contributes both their own positive and negative rolls to the drop-chance roll.
* @returns {RPG_BaseItem[]} The array of loot successfully found.
*/
Game_Enemy.prototype.makeDropItems = function(killer = null) {
	const dropList = this.getDropItems();
	if (!dropList.length) return [];
	const itemsFound = [];
	const multiplier = this.getDropMultiplierBonus();
	dropList.forEach((drop) => {
		if (!this.canFindLoot(drop)) return;
		const rate = drop.denominator * multiplier;
		const foundCount = this.howMuchLootFound(rate, killer);
		if (foundCount <= 0) return;
		for (let index = 0; index < foundCount; index++) {
			this.findLoot(drop, itemsFound);
		}
	}, this);
	return this.postProcessDroppedLoot(itemsFound, killer);
};
/**
* Applies the quality and quantity modifiers to loot that has already won its roll.
*
* Deliberately a pass over the finished list rather than work done inside the drop loop. Quantity has
* to see the whole list at once, because it grants copies per distinct item rather than per drop
* entry, and an enemy listing the same item four times has dropped one thing. Quality could have
* lived in {@link #findLoot}, but that method is aliased elsewhere with a fixed signature and a new
* argument would be silently swallowed before it ever arrived.
*
* Order matters: promotion runs first so the quantity bonus grants more of what you actually
* received. Two rows that both clamp onto the same top rung are one item by the time quantity counts
* them, which is the intended reading- you got one kind of thing, so you get more of that kind.
* @param {RPG_BaseItem[]} itemsFound The loot that successfully dropped.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {RPG_BaseItem[]} The loot as the player will actually receive it.
*/
Game_Enemy.prototype.postProcessDroppedLoot = function(itemsFound, killer = null) {
	const promoted = this.promoteDroppedLoot(itemsFound, killer);
	return this.applyDropQuantityBonus(promoted, killer);
};
/**
* Walks each dropped item along its ladder by the resolved number of rungs.
* @param {RPG_BaseItem[]} itemsFound The loot that successfully dropped.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {RPG_BaseItem[]}
*/
Game_Enemy.prototype.promoteDroppedLoot = function(itemsFound, killer = null) {
	const rungs = this.resolveDropUpgradeCount(killer);
	if (rungs === 0) return itemsFound;
	const promoting = (item) => {
		const promotedId = J.DROPS.Metadata.walkDropLadder(item.kind, item.id, rungs);
		if (promotedId === item.id) return item;
		return this.itemObject(item.kind, promotedId);
	};
	return itemsFound.map(promoting, this);
};
/**
* Grants or removes copies of each distinct item that dropped.
*
* The bonus lands once per distinct row, never once per drop entry- four identical drop entries are
* one item as far as the player is concerned, and scaling by how the author split their rows would
* make the same tag mean different things on identically-behaving enemies.
* @param {RPG_BaseItem[]} itemsFound The loot that successfully dropped.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {RPG_BaseItem[]}
*/
Game_Enemy.prototype.applyDropQuantityBonus = function(itemsFound, killer = null) {
	const bonus = this.resolveDropQuantityBonus(killer);
	if (bonus === 0) return itemsFound;
	/** @type {Map<string, {item: RPG_BaseItem, count: number}>} */
	const tallies = new Map();
	itemsFound.forEach((item, index) => {
		const key = item.id ? `${item.kind}:${item.id}` : `synthetic:${index}`;
		const tally = tallies.get(key) ?? {
			item,
			count: 0
		};
		tally.count += 1;
		tallies.set(key, tally);
	});
	const adjusted = [];
	tallies.forEach((tally) => {
		const { item, count } = tally;
		const total = item.id ? Math.max(count + bonus, 0) : count;
		for (let index = 0; index < total; index++) {
			adjusted.push(item);
		}
	});
	return adjusted;
};
/**
* How many rungs this kill promotes its drops by, summing both sides of it.
*
* The enemy's own grade applies whether or not the killer is known- an affixed enemy felled by
* something unidentified still drops what its affix promised.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {number}
*/
Game_Enemy.prototype.resolveDropUpgradeCount = function(killer = null) {
	const enemyCount = this.dropUpgradeCount();
	if (!killer) return enemyCount;
	return enemyCount + killer.dropUpgradeCount();
};
/**
* How many extra copies this kill grants of each distinct item, summing both sides of it.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {number}
*/
Game_Enemy.prototype.resolveDropQuantityBonus = function(killer = null) {
	const enemyBonus = this.dropQuantityBonus();
	if (!killer) return enemyBonus;
	return enemyBonus + killer.dropQuantityBonus();
};
/**
* Builds the drop to be found and adds it to the running list.
* @param {RPG_DropItem} drop The drop being found.
* @param {RPG_BaseItem} itemsFound The running list of items that have been found.
*/
Game_Enemy.prototype.findLoot = function(drop, itemsFound) {
	const item = this.itemObject(drop.kind, drop.dataId);
	if (!item) {
		Diagnostics.warn("J-DropsControl", "an invalid drop resolved; check the DB entry and note tags.", {
			enemy: this.enemy().name,
			kind: drop.kind,
			dataId: drop.dataId
		});
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
* Determines how many copies of a drop were found at the given rate.
*
* A drop is a repeatable outcome- finding it twice is a coherent result in a way that "hit twice"
* or "critted twice" are not- so this resolves through the shared proc-count path rather than
* collapsing to a single yes/no. That is what lets Accumulate Mode roll every one of the killer's
* positive rolls and award a copy per success, and lets Encore echo each success further.
*
* A rate at or beyond 100 succeeds on every roll by construction, so a "guaranteed" drop needs no
* special case: it simply lands on all of them.
* @param {number} rate The 0-100 integer rate of which to find this loot.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {number} How many copies of this loot were found; 0 means none.
*/
Game_Enemy.prototype.howMuchLootFound = function(rate, killer = null) {
	if (!killer) {
		return RPGManager.chanceIn100(rate, 1, 0) ? 1 : 0;
	}
	const positiveRolls = 1 + killer.getPositiveRolls();
	const negativeRolls = killer.getNegativeRolls();
	return RPGManager.resolveProcCount(killer, rate, positiveRolls, negativeRolls);
};
/**
* Determines whether or not loot was found based on the provided rate.
* This is not deterministic, and the same (non-100) rate can answer differently each time.
* Callers that care how many copies were found should ask {@link #howMuchLootFound} instead.
* @param {number} rate The 0-100 integer rate of which to find this loot.
* @param {Game_Actor|Game_Enemy=} killer The battler that landed the killing blow, if known.
* @returns {boolean} True if we found loot this time, false otherwise.
*/
Game_Enemy.prototype.didFindLoot = function(rate, killer = null) {
	return this.howMuchLootFound(rate, killer) > 0;
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
	const moreDrops = RPGManager.getArraysFromNotesByRegex(referenceData, J.DROPS.RegExp.ExtraDrop);
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
* Resolves which party members a reward strategy says should influence a bonus multiplier.
* An unrecognized strategy is a misconfigured plugin parameter rather than a runtime condition,
* and silently considering nobody would quietly halve the party's rewards for the rest of the
* playthrough with nothing to point at. Refusing to boot is the louder and cheaper failure.
* @param {string} strategy The configured reward strategy.
* @returns {Game_Actor[]} The members the strategy considers.
*/
Game_Party.prototype.dropsStrategyMembers = function(strategy) {
	switch (strategy) {
		case DropsPartyStrategy.AbsStyle: return [$gameParty.leader()];
		case DropsPartyStrategy.CombatPartyStyle: return [...$gameParty.battleMembers()];
		case DropsPartyStrategy.FullPartyStyle: return [...$gameParty.members()];
		default: throw new Error(`Unrecognized drops party strategy of [ ${strategy} ]; check the plugin parameters.`);
	}
};
/**
* Gets the selection of actors to consider when determining gold bonus multipliers.
* @param {string} [strategy] The reward strategy governing who counts.
* @returns {Game_Actor[]}
*/
Game_Party.prototype.goldMultiplierMembers = function(strategy = DropsPartyStrategy.CombatPartyStyle) {
	return this.dropsStrategyMembers(strategy);
};
/**
* Gets the collective bonus the party contributes to loot drop rates.
* This is a sum of bonuses rather than a multiplier in its own right, so it starts from zero and
* a party with nothing equipped contributes nothing. The identity value belongs to the enemy's
* own {@link Game_Enemy#getBaseDropRate}, which this is added to- starting from one here as well
* would mean two identities summing to two, doubling every drop in the game before any bonus
* was even involved.
* @returns {number}
*/
Game_Party.prototype.getPartyDropMultiplier = function() {
	const baseBonus = 0;
	const membersToConsider = this.dropMultiplierMembers();
	const dropMultiplier = membersToConsider.reduce((runningTotal, currentActor) => runningTotal + currentActor.getDropMultiplierBonus(), baseBonus);
	return dropMultiplier;
};
/**
* Gets the selection of actors to consider when determining bonus drop multipliers.
* @param {string} [strategy] The reward strategy governing who counts.
* @returns {Game_Actor[]}
*/
Game_Party.prototype.dropMultiplierMembers = function(strategy = DropsPartyStrategy.CombatPartyStyle) {
	return this.dropsStrategyMembers(strategy);
};

//#endregion
//#region src/plugins/drops/core/managers/TextManager.js
/**
* Display label for gold rate — bonus multiplier on gold rewards.
* @returns {string}
*/
TextManager.goldRate = function() {
	return "Gold UP";
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
	return "Drops UP";
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
		const goldDropRate = ParameterDefinition.Builder().key("gdr").group(ParameterGroups.FATE).sortOrder(3).label(() => TextManager.goldRate()).description(() => TextManager.goldRateDescription()).iconIndex(() => IconManager.goldRate()).format(ParameterFormat.MULTIPLIER_PERCENT).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.gdr).sdpBinding(SdpParameterBinding.byKey("gdr", () => 1)).build();
		ParameterRegistry.register(goldDropRate);
		const dropRate = ParameterDefinition.Builder().key("dor").group(ParameterGroups.FATE).sortOrder(6).label(() => TextManager.dropRate()).description(() => TextManager.dropRateDescription()).iconIndex(() => IconManager.dropRate()).format(ParameterFormat.MULTIPLIER_PERCENT).displayPolicy(ParameterDisplayPolicy.REWARD_RATE).getValue((battler) => battler.dor).sdpBinding(SdpParameterBinding.byKey("dor", () => 1)).build();
		ParameterRegistry.register(dropRate);
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
	J.EXTEND.Metadata.registerNonCombiningKey(J.DROPS.RegExp.ExtraDrop);
	J.DROPS.Metadata.buildDropLadders(J.DROPS.Metadata.dropLadderTables());
};

//#endregion
//# sourceMappingURL=J-DropsControl.js.map