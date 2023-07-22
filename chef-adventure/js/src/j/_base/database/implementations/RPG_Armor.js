//region RPG_Armor
/**
 * A class representing a single armor from the database.
 */
class RPG_Armor extends RPG_EquipItem
{
  //region properties
  /**
   * The type of armor this is.
   * This number is the index that maps to your armor types.
   * @type {number}
   */
  atypeId = 1;

  /**
   * The type of item this is. Armors are always type 3.
   * @type {3}
   */
  kind = 3;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.Armor} armor The armor to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(armor, index)
  {
    // supply the base class params.
    super(armor, index);

    // map the data.
    this.atypeId = armor.atypeId;
  }
}
//endregion RPG_Armor