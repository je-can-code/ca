//region RPG_Traited
/**
 * A class representing a BaseItem from the database, but with traits.
 */
class RPG_Traited extends RPG_BaseItem
{
  /**
   * A collection of all traits this item possesses.
   * @type {RPG_Trait[]}
   */
  traits = [];

  /**
   * Constructor.
   * Maps the base item's traits into this object.
   * @param {RPG_BaseItem} baseItem The underlying database object.
   * @param {number} index The index of the entry in the database.
   */
  constructor(baseItem, index)
  {
    // perform original logic.
    super(baseItem, index);

    // map the base item's traits.
    this.traits = baseItem.traits.map(trait => new RPG_Trait(trait));
  }
}
//endregion RPG_Traited