//region RPG_Item
/**
 * A class representing a single item entry from the database.
 */
class RPG_Item extends RPG_UsableItem
{
  //region properties
  /**
   * Whether or not this item is removed after using it.
   * @type {boolean}
   */
  consumable = true;

  /**
   * The type of item this is:
   * 0 for regular item, 1 for key item, 2 for hiddenA, 3 for hiddenB.
   * @type {number}
   */
  itypeId = 1;

  /**
   * The price of this item.
   * @type {number}
   */
  price = 0;

  /**
   * The type of item this is. Items are always type 1.
   * @type {1}
   */
  kind = 1;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.Item} item The item to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(item, index)
  {
    // supply the base class params.
    super(item, index);

    // map the data.
    this.consumable = item.consumable;
    this.itypeId = item.itypeId;
    this.price = item.price;
  }
}
//endregion RPG_Item