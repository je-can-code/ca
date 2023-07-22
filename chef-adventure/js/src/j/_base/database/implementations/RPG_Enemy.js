//region RPG_Enemy
/**
 * A class representing a single enemy battler's data from the database.
 */
class RPG_Enemy extends RPG_BaseBattler
{
  //region properties
  /**
   * A collection of all actions that an enemy has assigned from the database.
   * @type {RPG_EnemyAction[]}
   */
  actions = [];

  /**
   * The -255-0-255 hue of the battler sprite.
   * @type {number}
   */
  battlerHue = 0;

  /**
   * A collection of all drop items this enemy can drop.
   * @type {RPG_DropItem[]}
   */
  dropItems = [];

  /**
   * The base amount of experience this enemy grants upon defeat.
   * @type {number}
   */
  exp = 0;

  /**
   * The base amount of gold this enemy grants upon defeat.
   * @type {number}
   */
  gold = 0;

  /**
   * The core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [1, 0, 0, 0, 0, 0, 0, 0];
  //endregion properties

  /**
   * Constructor.
   * @param {RPG_Enemy} enemy The enemy to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(enemy, index)
  {
    // supply the base class params.
    super(enemy, index);

    // map the data.
    this.initMembers(enemy);
  }

  /**
   * Maps the data from the JSON to this object.
   * @param {RPG_Enemy} enemy The enemy to parse.
   */
  initMembers(enemy)
  {
    // map the data.
    this.actions = enemy.actions
      .map(enemyAction => new RPG_EnemyAction(enemyAction));
    this.battlerHue = enemy.battlerHue;
    this.dropItems = enemy.dropItems
      .map(dropItem => new RPG_DropItem(dropItem));
    this.exp = enemy.exp;
    this.gold = enemy.gold;
    this.params = enemy.params;
  }
}
//endregion RPG_Enemy