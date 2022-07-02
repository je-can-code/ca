//#region Game_Item
/**
 * Largely overwrites this function to instead leverage an item's index value over
 * it's ID for setting objects to the item slot.
 */
J.JAFTING.Aliased.Game_Item.setObject = Game_Item.prototype.setObject;
Game_Item.prototype.setObject = function(item)
{
  J.JAFTING.Aliased.Game_Item.setObject.call(this, item);
  this._itemId = item ? item.index : 0;
};
//#endregion Game_Item