//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0.0 DROP] Enables greater control over gold and item drops.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
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
  Name: `J-ControlledDrops`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.DROPS.Aliased = {
  Game_Enemy: new Map(),
};
//#endregion Introduction

//#region Game objects
//#region Game_Actor
/**
 * Gets this actor's bonus drop multiplier.
 * @returns {number}
 */
Game_Actor.prototype.getDropMultiplier = function()
{
  let dropMultiplier = 0;
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj => (dropMultiplier += this.extractDropMultiplier(obj)));
  return (dropMultiplier / 100);
};

/**
 * Gets the bonus drop multiplier from a given database object.
 * @param {rm.types.BaseItem} referenceData The database object in question.
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
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj => (goldMultiplier += this.extractGoldMultiplier(obj)));
  return (goldMultiplier / 100);
};

/**
 * Gets the bonus gold multiplier from a given database object.
 * @param {rm.types.BaseItem} referenceData The database object in question.
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
//#endregion Game_Actor

//#region Game_Battler
/**
 * Parses the given reference data to extract any extra drops that may be present.
 * @param {rm.types.BaseItem} referenceData The database object to parse.
 * @returns {rm.types.EnemyDropItem[]}
 */
Game_Battler.prototype.extractExtraDrops = function(referenceData)
{
  // initialize the extra drops collection.
  const extraDrops = [];

  // get the note data associated with the database object.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // iterate over each line of the note and check if we have extra drops.
  notedata.forEach(line =>
  {
    // extract the relevant drop from this line.
    const extraDrop = this.extractExtraDrop(line);

    // if there was a drop found on this line...
    if (extraDrop)
    {
      // ...then add it to the running collection.
      extraDrops.push(extraDrop);
    }
  }, this);

  // return the found extra drops.
  return extraDrops;
};

/**
 * Extracts the extra drop from a single note line, if one is present.
 * @param {string} line The line from a note to extract from.
 * @returns {rm.types.EnemyDropItem|null}
 */
Game_Battler.prototype.extractExtraDrop = function(line)
{
  // the regex structure for extra drops.
  const structure = /<drops:[ ]?\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)]>/i;

  // if we have a relevant note tag...
  if (line.match(structure))
  {
    // ...identify the categorical "kind" of drop it is...
    let kind = 0;
    switch (RegExp.$1)
    {
      case ("i" || "item"):
        kind = 1;
        break;
      case ("w" || "weapon"):
        kind = 2;
        break;
      case ("a" || "armor"):
        kind = 3;
        break;
    }

    // ...and build the drop result based on the note data.
    const result =
      {
        kind,
        dataId: parseInt(RegExp.$2),
        denominator: parseInt(RegExp.$3)
      };

    // return the built drop result.
    return result;
  }

  // if we didn't find anything on this line, then return a null.
  return null;
};
//#endregion Game_Battler

//#region Game_Enemy
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
 * @returns {rm.types.BaseItem[]} The array of loot successfully found.
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
 * @returns {rm.types.EnemyDropItem[]}
 */
Game_Enemy.prototype.getDropItems = function()
{
  const drops = [...this.enemy().dropItems];
  drops.push(...this.extraDrops());
  return drops;
};

/**
 * Gets any additional drops from the notes of this particular enemy.
 *
 * @returns {rm.types.EnemyDropItem[]}
 */
Game_Enemy.prototype.extraDrops = function()
{
  const extraDrops = [];
  const objectsToCheck = this.dropSources();
  objectsToCheck.forEach(obj =>
  {
    const drops = this.extractExtraDrops(obj);
    extraDrops.push(...drops);
  });

  return extraDrops;
};

/**
 * A collection of all sources of which loot may be acquired from.
 * Typically, this will only be the enemy itself, but is open for extension.
 * @returns {rm.types.BaseItem[]}
 */
Game_Enemy.prototype.dropSources = function()
{
  const sources = [];
  sources.push(this.enemy());

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

  // if someone in the party has the "double drops" accessory...
  if ($gameParty.hasDropItemDouble())
  {
    // then multiply the collective drop rates by 2x.
    multiplier *= 2;
  }

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
//#endregion Game_Enemy

//#region Game_Party
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
//#endregion Game_Party
//#endregion Game objects