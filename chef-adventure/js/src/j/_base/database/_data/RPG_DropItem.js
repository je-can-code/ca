//#region RPG_DropItem
/**
 * A class representing a single drop item of an enemy from the database.
 */
class RPG_DropItem
{
  //#region properties
  /**
   * The id of the underlying item's entry in the database.
   * @type {number}
   */
  dataId = 0;

  /**
   * The drop chance value numeric field in the database.
   * @type {number}
   */
  denominator = 0;

  /**
   * The type of drop this is:
   * 0 being item, 1 being weapon, 2 being armor.
   * @type {number}
   */
  kind = 0;
  //#endregion properties

  /**
   * Constructor.
   * @param {rm.types.EnemyDropItem} enemyDropItem The drop item to parse.
   */
  constructor({ dataId, denominator, kind })
  {
    // map the enemy drop to this object.
    this.dataId = dataId;
    this.denominator = denominator;
    this.kind = kind;
  }
}
//#endregion RPG_DropItem