//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 DROPS] Enables greater control over loot drops.
 * @author JE
 * @url https://github.com/je-can-code/ca
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
 * PERCENTAGE DROPS
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
 * NOTE 1:
 * By having this plugin enabled, you opt into the PERCENTAGE DROPS feature
 * and cannot disable it. It is required. Sorry.
 *
 * NOTE 2:
 * If the percentage chance exceeds 100%, the drop item will always drop.
 * This sounds obvious, but remember this when looking at the TAG EXAMPLES.
 * ============================================================================
 * ADDITIONAL ITEMS
 * Have you ever wanted to drop more items than just three per enemy? Well now
 * you can with the proper tags applied to enemies in the database!
 *
 * NOTE 1:
 * This is additive in the sense that if you specify drop items using the
 * editor and also have one or more of these tags on an enemy, it will add
 * all of them together as potential drops, exceeding the limit of 3.
 *
 * NOTE 2:
 * You can have more than one of the same item drop, at the same or different
 * rates and they will individually be processed.
 *
 * NOTE 3:
 * Drop multipliers apply to items dropped using ADDITIONAL DROP tags, too.
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
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DROPS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DROPS.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-DropsControl`,

  /**
   * The version of this plugin.
   */
  Version: '2.0.0',
};

/**
 * All regular expressions used by this plugin.
 */
J.DROPS.RegExp = {
  ExtraDrop: /<drops:[ ]?(\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)])>/i,
}

/**
 * The collection of all aliased classes for extending.
 */
J.DROPS.Aliased = {
  Game_Enemy: new Map(),
};
//endregion Introduction

/**
 * Translates this drop item into its corresponding implemented class.
 * @returns {RPG_Item|RPG_Weapon|RPG_Armor}
 */
RPG_DropItem.prototype.toImplementation = function()
{
  // define the source to pull the item from.
  let source = [];

  // pivot on the kind of drop item this is.
  switch (this.kind)
  {
    case RPG_DropItem.Types.Item:
      source = $dataItems;
      break;
    case RPG_DropItem.Types.Weapon:
      source = $dataWeapons;
      break;
    case RPG_DropItem.Types.Armor:
      source = $dataArmors;
      break;
    default:
      throw new Error(`This drop item is missing properties to fulfill this request.`, this);
  }

  // return the id of the drop item from its corresponding source.
  return source.at(this.dataId);
};

/**
 * A builder class for simply developing {@link RPG_DropItem}s.
 */
class RPG_DropItemBuilder
{
  //region properties
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
  //endregion properties

  /**
   * Builds the {@link RPG_DropItem} with the current parameters in this builder.
   * @param {boolean=} withClear Whether or not to clear the builder's data after building; defaults to true.
   * @returns {RPG_DropItem} The constructed drop.
   */
  build(withClear = true)
  {
    // create an anonymous object representing the drop data.
    const dropItem = {
      kind: this.#type,
      dataId: this.#id,
      denominator: this.#chance,
    };

    // check to make sure the clear needs execution.
    if (withClear)
    {
      // wipe out the existing data in the builder.
      this.#clear();
    }

    // return the built drop item.
    return new RPG_DropItem(dropItem);
  }

  /**
   * Clears all data currently in the builder.
   */
  #clear()
  {
    this.setId(0);
    this.setType(0);
    this.setChance(0);
  }

  //region builders
  /**
   * Sets the id aka `dataId` of this {@link RPG_DropItem}.
   * @param {number} id The database id of the item.
   * @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
   */
  setId(id)
  {
    this.#id = id;
    return this;
  }

  /**
   * Sets the typeId aka `kind` of this {@link RPG_DropItem}.
   * @param {number} typeId The typeId of this loot.
   * @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
   */
  setType(typeId)
  {
    this.#type = typeId;
    return this;
  }

  /**
   * Sets the chance aka `denominator` for this {@link RPG_DropItem} to drop.
   * @param {number} percentChance The chance for this loot to drop.
   * @returns {RPG_DropItemBuilder} This builder for fluent-chaining.
   */
  setChance(percentChance)
  {
    this.#chance = percentChance;
    return this;
  }

  /**
   * Builds a item drop based on the given parameters.
   * @param {number} databaseId The id in the database of this item.
   * @param {number} percentChance The chance that this loot should drop.
   * @return {RPG_DropItem} A item-based loot drop with the given parameters.
   */
  itemLoot(databaseId, percentChance)
  {
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
  weaponLoot(databaseId, percentChance)
  {
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
  armorLoot(databaseId, percentChance)
  {
    this.setType(RPG_DropItem.Types.Armor);
    this.setId(databaseId);
    this.setChance(percentChance);
    return this.build();
  }
  //endregion builders
}

/**
 * Gets the list of original drop items from the enemy in the database.
 *
 * This double-checks the actual drop items associated with an enemy in the
 * database as you can have invalid drop items if you set a drop up with a
 * denominator, but then changed your mind and flipped the drop type to "None".
 * @returns {RPG_DropItem[]}
 */
RPG_Enemy.prototype.originalDropItems = function()
{
  return this.dropItems
    .filter(this.validDropItemFilter, this);
};

/**
 * Determines whether or not a drop item is a valid drop.
 * @param {RPG_DropItem} dropItem The potential drop to check.
 * @returns {boolean} True if the drop is valid, false otherwise.
 */
RPG_Enemy.prototype.validDropItemFilter = function(dropItem)
{
  // if the drop item itself is falsey, it is not valid.
  if (!dropItem) return false;

  // if the drop item lacks an id or drop type, it is not valid.
  if (!dropItem.dataId || !dropItem.kind) return false;

  // the item is valid!
  return true;
};

//region Game_Actor
/**
 * Gets this actor's bonus drop multiplier.
 * @returns {number}
 */
Game_Actor.prototype.getDropMultiplier = function()
{
  let dropMultiplier = 0;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (dropMultiplier += this.extractDropMultiplier(obj)));
  return (dropMultiplier / 100);
};

/**
 * Gets the bonus drop multiplier from a given database object.
 * @param {RPG_BaseItem} referenceData The database object in question.
 * @returns {number}
 */
Game_Actor.prototype.extractDropMultiplier = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<dropMultiplier:[ ]?(-?[\d]+)>/i;
  let dropMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      dropMultiplier += multiplier;
    }
  });

  return dropMultiplier;
};

/**
 * Gets this actor's bonus gold multiplier.
 * @returns {number}
 */
Game_Actor.prototype.getGoldMultiplier = function()
{
  let goldMultiplier = 0;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (goldMultiplier += this.extractGoldMultiplier(obj)));
  return (goldMultiplier / 100);
};

/**
 * Gets the bonus gold multiplier from a given database object.
 * @param {RPG_BaseItem} referenceData The database object in question.
 * @returns {number}
 */
Game_Actor.prototype.extractGoldMultiplier = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<goldMultiplier:[ ]?(-?[\d]+)>/i;
  let goldMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      goldMultiplier += multiplier;
    }
  });

  return goldMultiplier;
};
//endregion Game_Actor

//region Game_Battler
/**
 * Parses the given reference data to extract any extra drops that may be present.
 * @param {RPG_BaseItem} referenceData The database object to parse.
 * @returns {RPG_DropItem[]}
 */
Game_Battler.prototype.extractExtraDrops = function(referenceData)
{
  // get the drops found on this enemy.
  const moreDrops = referenceData.getArraysFromNotesByRegex(J.DROPS.RegExp.ExtraDrop, true) ?? [];

  // a mapping function to build proper drop items from the arrays.
  const mapper = drop =>
  {
    // deconstruct the array into drop properties.
    const [ dropType, dropId, chance ] = drop;

    // build the new drop item.
    return new RPG_DropItemBuilder()
      .setType(RPG_DropItem.TypeFromLetter(dropType))
      .setId(dropId)
      .setChance(chance)
      .build();
  };

  // map the converted drops.
  const convertedDrops = moreDrops.map(mapper, this);

  // return the found extra drops.
  return convertedDrops;
};
//endregion Game_Battler

//region Game_Enemy
/**
 * Gets the gold that the enemy dropped.
 * This includes multipliers from our gold bonuses.
 * @returns {number} The rounded product of the base gold against the multiplier.
 */
J.DROPS.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function()
{
  const baseGoldRate = this.getBaseGoldRate();
  const baseGold = (J.DROPS.Aliased.Game_Enemy.get("gold").call(this) * baseGoldRate);
  const multiplier = $gameParty.getGoldMultiplier();
  return Math.round(baseGold * multiplier);
};

/**
 * The base gold multiplier of this enemy.
 * Currently defaults to 1, but open for extension.
 * @returns {number}
 */
Game_Enemy.prototype.getBaseGoldRate = function()
{
  return 1;
};

/**
 * OVERWRITE Modifies the drop chance algorithm to treat the number entered in the
 * database as a percent chance instead of some weird fractional shit. Also applies
 * any applicable multipliers against the discovery rate of loot.
 * @returns {RPG_BaseItem[]} The array of loot successfully found.
 */
Game_Enemy.prototype.makeDropItems = function()
{
  // get all potential loot for this enemy.
  const dropList = this.getDropItems();

  // no point in iterating over nothing.
  if (!dropList.length) return [];

  // initialize our running collection of all actually dropped loot.
  const itemsFound = [];

  // get the chance multiplier for loot dropping.
  const multiplier = this.getDropMultiplier();

  // iterate over all drops to see what we got.
  dropList.forEach(drop =>
  {
    // we don't deal with empty loot here.
    if (drop.kind === 0) return;

    // here we're using the number from the database as a percentage chance instead.
    const rate = drop.denominator * multiplier;

    // if the multiplier was so great that the rate is above 100, we always get it.
    const treasureHunterSkip = rate >= 100;

    // roll the dice and see if we get some loot.
    const foundLoot = (Math.random() * 100) < rate;
    const item = this.itemObject(drop.kind, drop.dataId);

    // if we earned the loot...
    if (treasureHunterSkip || foundLoot)
    {
      // ...add it to the list of earned drops from this enemy!
      itemsFound.push(item);
    }
  });

  // return all earned loot!
  return itemsFound;
};

/**
 * Gets the drop items from this enemy from all sources available.
 * @returns {RPG_DropItem[]}
 */
Game_Enemy.prototype.getDropItems = function()
{
  // validate the original drop items from the enemy in the database.
  const databaseDropItems = this.enemy().originalDropItems();

  // initialize the drops to be the enemy's own valid drop items from the database.
  const allDropItems = [...databaseDropItems];

  // grab any extra drops available.
  const extraDropItems = this.extraDrops();

  // add the extra drops found.
  allDropItems.push(...extraDropItems);

  // return what we found.
  return allDropItems;
};

/**
 * Gets any additional drops from the notes of this particular enemy.
 *
 * @returns {RPG_DropItem[]}
 */
Game_Enemy.prototype.extraDrops = function()
{
  // initialize our extra drops collection.
  const extraDrops = [];

  // grab all sources that things can drop from.
  const sources = this.dropSources();

  // iterate over each of the sources.
  sources.forEach(source =>
  {
    // extract the drops from the source.
    const drops = this.extractExtraDrops(source);

    // add what was found.
    extraDrops.push(...drops);
  });

  // return all the extras.
  return extraDrops;
};

/**
 * A collection of all sources of which loot may be acquired from.
 * Typically, this will only be the enemy itself, but is open for extension.
 * @returns {RPG_BaseItem[]}
 */
Game_Enemy.prototype.dropSources = function()
{
  // initialize our sources tracking.
  const sources = [];

  // add the enemy's own self to the list of sources.
  sources.push(this.enemy());

  // return what we found.
  return sources;
};

/**
 * Gets the multiplier against the RNG of an item dropping.
 * @returns {number}
 */
Game_Enemy.prototype.getDropMultiplier = function()
{
  // the base/default drop multiplier rate.
  let multiplier = this.getBaseDropRate();

  // get the party's bonus drop multiplier.
  multiplier += $gameParty.getDropMultiplier();

  // if someone in the party has the "double drops" accessory, then double the rate.
  multiplier *= this.dropItemRate();

  // return this magical loot multiplier.
  return multiplier;
};

/**
 * The base drop rate multiplier of this enemy.
 * Currently defaults to 1, but open for extension.
 * @returns {number}
 */
Game_Enemy.prototype.getBaseDropRate = function()
{
  return 1;
};
//endregion Game_Enemy

//region Game_Party
/**
 * Gets the collective multiplier for gold drops for the entire party.
 * @returns {number}
 */
Game_Party.prototype.getGoldMultiplier = function()
{
  let goldMultiplier = 1;
  const membersToConsider = this.goldMultiplierMembers();
  membersToConsider.forEach(actor => goldMultiplier += actor.getGoldMultiplier());
  return goldMultiplier;
};

/**
 * Gets the selection of actors to consider when determining gold bonus multipliers.
 * @returns {Game_Actor[]}
 */
Game_Party.prototype.goldMultiplierMembers = function()
{
  const membersToConsider = [];
  membersToConsider.push(...$gameParty.battleMembers());

  // if only the leader should influence drop bonuses (for ABS style).
  // membersToConsider.push($gameParty.leader());

  // or everyone including reserve members (different preferences).
  // membersToConsider.push(...$gameParty.members());
  return membersToConsider;
};

/**
 * Gets the collective multiplier for loot drops for the entire party.
 * @returns {number}
 */
Game_Party.prototype.getDropMultiplier = function()
{
  let dropMultiplier = 0;
  const membersToConsider = this.dropMultiplierMembers();
  membersToConsider.forEach(actor => dropMultiplier += actor.getDropMultiplier());
  return dropMultiplier;
};

/**
 * Gets the selection of actors to consider when determining bonus drop multipliers.
 * @returns {Game_Actor[]}
 */
Game_Party.prototype.dropMultiplierMembers = function()
{
  const membersToConsider = [];
  membersToConsider.push(...$gameParty.battleMembers());

  // if only the leader should influence drop bonuses (for ABS style).
  // membersToConsider.push($gameParty.leader());

  // or everyone including reserve members (different preferences).
  // membersToConsider.push(...$gameParty.members());
  return membersToConsider;
};
//endregion Game_Party