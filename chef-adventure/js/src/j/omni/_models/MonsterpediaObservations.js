//#region MonsterpediaObservations
/**
 * A monsterpedia entry of observations about a particular monster.
 * This data drives the visibility of data within a given monsterpedia entry.
 */
class MonsterpediaObservations
{
  //#region properties
  /**
   * The id of the monster in the monsterpedia.
   * @type {number}
   */
  id = 0;

  /**
   * The number of this monster that has been defeated by the player.
   * @type {number}
   */
  numberDefeated = 0;

  /**
   * Whether or not the player knows the name of this monster.
   * When the name is unknown, it'll be masked.
   * @type {boolean}
   */
  knowsName = false;

  /**
   * Whether or not the player knows the family this monster belongs to.
   * When the family is unknown, the icon will be omitted from the list and
   * the family will be masked in the detail.
   * @type {boolean}
   */
  knowsFamily = true;

  /**
   * Whether or not the player knows the description of this monster.
   * When the description is unknown, it'll be masked.
   * @type {boolean}
   */
  knowsDescription = false;

  /**
   * Whether or not the player knows the regions this monster is found in.
   * When the regions are unknown, it'll simply be blank.
   * @type {boolean}
   */
  knowsRegions = false;

  /**
   * Whether or not the player knows the parameters of this monster.
   * When the parameters are unknown, they will be masked.
   * @type {boolean}
   */
  knowsParameters = true;

  /**
   * Whether or not the player knows the ailmentalistics of this monster.
   * When the ailmentalistics are unknown, they will be masked.
   * @type {boolean}
   */
  knowsAilmentistics = false;

  /**
   * Whether or not the player knows the elementalistics of this monster.
   * When the elementalistics are unknown, they will be masked.
   * @type {boolean}
   */
  knowsElementalistics = false;
  //#endregion properties

  /**
   * Constructor.
   * @param {number} enemyId The enemy id of this set of monster observations.
   */
  constructor(enemyId)
  {
    this.id = enemyId;
  }
}
//#endregion MonsterpediaObservations