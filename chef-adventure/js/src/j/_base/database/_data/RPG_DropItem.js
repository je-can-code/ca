//region RPG_DropItem
/**
 * A class representing a single drop item of an enemy from the database.
 */
class RPG_DropItem
{
  /**
   * The various types of {@link RPG_DropItem} that can be produced.
   */
  static Types = {
    /**
     * The drop item type that maps to "items" in the database.
     */
    Item: 1,

    /**
     * The drop item type that maps to "weapons" in the database.
     */
    Weapon: 2,

    /**
     * The drop item type that maps to "armors" in the database.
     */
    Armor: 3,
  }

  /**
   * Translates a letter or word drop item type into its numeric counterpart.
   * @param {i|item|w|weapon|a|armor} letter The letter to translate.
   * @returns {number} The numeric drop item type.
   */
  static TypeFromLetter = letter =>
  {
    // pivot on the lowercase version of the letter.
    switch (letter.toLowerCase())
    {
      // "i" for "item".
      case ('i'||'item'): return this.Types.Item;

      // "w" for "weapon".
      case ('w'||'weapon'): return this.Types.Weapon;

      // "a" for "armor".
      case ('a'||'armor'): return this.Types.Armor;

      // don't use this with invalid item types.
      default: throw new Error(`invalid item type letter provided: [${letter}].`);
    }
  }

  /**
   * Translates a number/kind drop item type into its letter counterpart.
   * @param {1|2|3} number The number to translate.
   * @returns {number} The letter drop item type.
   */
  static TypeFromNumber = number =>
  {
    // pivot on the number.
    switch (number)
    {
      // "1" for "item".
      case 1: return 'i';

      // "2" for "weapon".
      case 2: return 'w';

      // "3" for "armor".
      case 3: return 'a';

      // don't use this with invalid item types.
      default: throw new Error(`invalid item type number provided: [${number}].`);
    }
  }

  //region properties
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
  //endregion properties

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
//endregion RPG_DropItem