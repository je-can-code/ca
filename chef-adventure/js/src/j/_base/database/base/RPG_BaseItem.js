//region RPG_BaseItem
/**
 * The class representing baseItem from the database,
 * and now an iconIndex with a description.
 */
class RPG_BaseItem extends RPG_Base
{
  /**
   * The description of this entry.
   * @type {string}
   */
  description = String.empty;

  /**
   * The icon index of this entry.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * Constructor.
   * Maps the base item's properties into this object.
   * @param {any} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    // perform original logic.
    super(baseItem, index);

    // map the additional description and iconIndex as well for all base items.
    this.description = baseItem.description;
    this.iconIndex = baseItem.iconIndex;
  }
}
//endregion RPG_BaseItem