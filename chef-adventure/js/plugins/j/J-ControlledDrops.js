//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 DROP] Enables greater control over what and how often loot is dropped.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin enables the ability to drop items at a percent rate instead of
 * the obscure 1/1(100%), 1/2(50%), 1/3(33%), etc, rates of drop. This also
 * enables the ability to drop more than the default of three items. In order
 * to leverage this, you'll simply need to add some tags into the note box of
 * your enemies in the database. They will look something like this:
 * 
 * <drops:[TYPE,ID,CHANCE]>
 * 
 * where TYPE is either "i", "w", or "a" (representing item/weapon/armor).
 * where ID is the id of the drop in the database.
 * where CHANCE is the percent chance to drop.
 * 
 * An example of a correctly formed tag looks like this:
 * 
 * <drops:[i,3,10]>
 * 
 * An enemy with this tag will drop an item of id 3 with a 10% chance.
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
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<dropMultiplier:[ ]?(\d+)>/i;
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
//#endregion Game_Actor

//#region Game_Enemy
/**
 * OVERWRITE Modifies the drop chance algorithm to treat the number entered in the
 * database as a percent chance instead of some weird fractional shit.
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
    const rate = drop.denominator;

    // roll the dice and see if we get some loot.
    const chance = (Math.random() * 100) * multiplier;
    if (chance < rate) {
      // found some loots.
      const item = this.itemObject(drop.kind, drop.dataId);
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
  const drops = this.enemy().dropItems;
  drops.push(...this.extraDrops());
  return drops;
};

/**
 * Gets any additional drops from the notes of this particular enemy.
 *
 * TODO: add a feature for having states maybe add additional drops to enemies?
 * @returns {rm.types.EnemyDropItem[]}
 */
Game_Enemy.prototype.extraDrops = function()
{
  const referenceData = this.enemy();
  return [...this.extractExtraDrops(referenceData)];
};

/**
 * Parses the given reference data to extract any extra drops that may be present.
 * @param {rm.types.Enemy} referenceData The database object to parse.
 * @returns {rm.types.EnemyDropItem[]}
 */
Game_Enemy.prototype.extractExtraDrops = function(referenceData)
{
  // initialize the extra drops collection.
  const extraDrops = [];

  // get the note data associated with the database object.
  const notedata = referenceData.note.split(/[\r\n]+/);

  // iterate over each line of the note and check if we have extra drops.
  notedata.forEach(line => {
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
Game_Enemy.prototype.extractExtraDrop = function(line)
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

/**
 * Gets the multiplier against the RNG of an item dropping.
 * @returns {number}
 */
Game_Enemy.prototype.getDropMultiplier = function()
{
  // the default drop multiplier rate.
  let multiplier = 1;

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
//#endregion Game_Enemy

//#region Game_Party
/**
 * Gets the collective multiplier for loot drops for the entire party.
 * By default, only extracts the leaders, but can potentially get ALL member's multipliers
 * for that sweet sweet loot dropping goodness.
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
  membersToConsider.push($gameParty.leader());

  // TODO: make conditional functionality for all battle members, or everyone including reserve members.
  return membersToConsider;
};
//#endregion Game_Party
//#endregion Game objects