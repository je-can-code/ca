//region Game_Party
/**
 * Extends `gainItem()` to also refresh the JAFTING windows on item quantity change.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.JAFTING.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  // perform original logic.
  J.JAFTING.Aliased.Game_Party.get('gainItem').call(this, item, amount, includeEquip);

  // refresh the JAFTING windows on item quantity change.
  $gameSystem.setRefreshRequest(true);
};
//endregion Game_Party