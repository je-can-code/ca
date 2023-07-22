//region RPG_EquipItem
/**
 * A base class representing containing common properties found in both
 * weapons and armors.
 */
class RPG_EquipItem extends RPG_Traited
{
  //region properties
  /**
   * The type of equip this is.
   * This number is the index that maps to your equip types.
   * @type {number}
   */
  etypeId = 1;

  /**
   * The core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [1, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The price of this equip.
   * @type {number}
   */
  price = 0;
  //endregion properties

  /**
   * Constructor.
   * @param {RPG_EquipItem} equip The equip to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(equip, index)
  {
    // supply the base class params.
    super(equip, index);

    // map the data.
    this.etypeId = equip.etypeId;
    this.params = equip.params;
    this.price = equip.price;
  }

  /**
   * Determines whether or not this equip is a weapon.
   * @returns {boolean}
   */
  isWeapon()
  {
    return this.etypeId === 1;
  }

  /**
   * Determines whether or not this equip is an armor.
   * Armor is defined as an equip type that is greater than 1.
   * @returns {boolean}
   */
  isArmor()
  {
    return this.etypeId > 1;
  }
}
//endregion RPG_EquipItem