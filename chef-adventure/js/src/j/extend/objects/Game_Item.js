//region Game_Item
/**
 * Extend `initialize()` to include our update of assigning the item.
 */
J.EXTEND.Aliased.Game_Item.set('initialize', Game_Item.prototype.initialize);
Game_Item.prototype.initialize = function(item)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('initialize').call(this, item);

  /**
   * The underlying object associated with this item.
   * @type {RPG_EquipItem|rm.types.UsableItem}
   */
  this._item = null;
  if (item)
  {
    this._item = item;
  }
};

/**
 * Gets the underlying object for this `Game_Item`.
 * Normally this can be retrieved by using {@link Game_Item.object}, but that function limits
 * the possibility of retrieval to only stuff in the database, which extended skills will
 * not be in the database.
 */
Game_Item.prototype.underlyingObject = function()
{
  return this._item;
};

/**
 * Extends `setObject()` to enable setting custom skills and items.
 * @param {RPG_UsableItem|RPG_EquipItem}
 */
J.EXTEND.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(obj)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Item.get('setObject').call(this, obj);

  // check to make sure we have something to work with.
  if (!obj) return;

  // check to ensure it has a skill category property.
  if (obj.hasOwnProperty('stypeId'))
  {
    // assign the data.
    this._dataClass = 'skill';
    this._item = obj;
  }
  // check to ensure it has an item category property.
  else if (obj.hasOwnProperty('itypeId'))
  {
    // assign the data.
    this._dataClass = 'item';
    this._item = obj;
  }
};

/**
 * Extends this function to return the underlying custom object (like an extended skill)
 * if it was assigned.
 */
J.EXTEND.Aliased.Game_Item.set('object', Game_Item.prototype.object);
Game_Item.prototype.object = function()
{
  // if we have a custom object to return, return that.
  if (this._item)
  {
    return this._item;
  }

  return J.EXTEND.Aliased.Game_Item.get('object').call(this);
};
//endregion Game_Item