//region Game_Party
/**
 * Extends {@link #gainItem}.
 * Also refreshes the passive states for the party.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.NATURAL.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Party.get('gainItem').call(this, item, amount, includeEquip);

  // also refresh our parameter buffs.
  this.refreshAllParameterBuffsForAll();
};

/**
 * Refresh all parameter buffs for all party members.
 */
Game_Party.prototype.refreshAllParameterBuffsForAll = function()
{
  this
    .members()
    .forEach(member => member.refreshAllParameterBuffs());
};
//endregion Game_Party