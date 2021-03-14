//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * Enables greater control over what and how often loot is dropped.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * # Start of Help
 * 
 * # End of Help
 */

 /**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.Drops = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.Drops.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-ControlledDrops`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.Drops.PluginParameters = PluginManager.parameters(J.Drops.Metadata.Name);
J.Drops.Metadata = {
  ...J.Drops.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};
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