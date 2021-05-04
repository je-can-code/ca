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
//#region Game_Enemy
/**
 * OVERWRITE Modifies the drop chance algorithm to treat the number entered in the
 * database as a percent chance instead of some weird fractional shit.
 * @returns {object[]} The array of loot successfully found.
 */
Game_Enemy.prototype.makeDropItems = function() {
  const dropList = this.enemy().dropItems.concat(this.extraDrops());
  
  // no point in iterating over nothing.
  if (!dropList.length) return [];

  const itemsFound = [];
  const multiplier = $gameParty.hasDropItemDouble() ? 2 : 1;

  // iterate over all drops to see what we got.
  dropList.forEach(drop => {
    // we don't deal with empty loot here.
    if (drop.kind === 0) return;

    // roll the dice and see if we get some loot!
    const rate = drop.denominator;
    const chance = (Math.random() * 100) * multiplier;
    if (chance < rate) {
      // found some loots!
      const item = this.itemObject(drop.kind, drop.dataId);
      itemsFound.push(item);
    }
  });

  return itemsFound;
};
//#endregion Game_Enemy
//#endregion Game objects