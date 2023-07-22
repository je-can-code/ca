//region Game_Item
/**
 * Largely overwrites this function to instead leverage an item's index value over
 * it's ID for setting objects to the item slot.
 */
J.JAFTING.EXT.REFINE.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(item)
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.Game_Item.get('setObject').call(this, item);

  // assign the item id to here.
  this._itemId = item
    ? item._key()
    : 0;
};
//endregion Game_Item