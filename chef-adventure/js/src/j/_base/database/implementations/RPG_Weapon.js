//region RPG_Weapon
/**
 * A class representing a single weapon from the database.
 */
class RPG_Weapon extends RPG_EquipItem
{
  //region properties
  /**
   * The animation id for this weapon.
   * @type {number}
   */
  animationId = -1;

  /**
   * The type of weapon this is.
   * This number is the index that maps to your weapon types.
   * @type {number}
   */
  wtypeId = 1;

  /**
   * The type of item this is. Weapons are always type 2.
   * @type {2}
   */
  kind = 2;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.Weapon} weapon The weapon to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(weapon, index)
  {
    // supply the base class params.
    super(weapon, index);

    // map the data.
    this.animationId = weapon.animationId;
    this.wtypeId = weapon.wtypeId;
  }
}
//endregion RPG_Weapon