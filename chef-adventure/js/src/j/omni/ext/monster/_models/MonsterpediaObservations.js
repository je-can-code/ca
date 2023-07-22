//region MonsterpediaObservations
/**
 * A monsterpedia entry of observations about a particular monster.
 * This data drives the visibility of data within a given monsterpedia entry.
 * @param {number} enemyId The id of the enemy these observations are for.
 */
function MonsterpediaObservations(enemyId)
{
  this.initialize(enemyId);
}

MonsterpediaObservations.prototype = {};
MonsterpediaObservations.prototype.constructor = MonsterpediaObservations;

/**
 * Initialize a set of observations for a new enemy.
 * @param {number} enemyId The id of the enemy these observations are for.
 */
MonsterpediaObservations.prototype.initialize = function(enemyId)
{
  /**
   * The id of the monster in the monsterpedia.
   * @type {number}
   */
  this.id = enemyId;

  // initialize other properties.
  this.initMembers();
};

/**
 * Initialize other observations that cannot be initialized with parameters.
 */
MonsterpediaObservations.prototype.initMembers = function()
{
  /**
   * The number of this monster that has been defeated by the player.
   * @type {number}
   */
  this.numberDefeated = 0;

  /**
   * Whether or not the player knows the name of this monster.
   * When the name is unknown, it'll be masked.
   * @type {boolean}
   */
  this.knowsName = false;

  /**
   * Whether or not the player knows the family this monster belongs to.
   * When the family is unknown, the icon will be omitted from the list and
   * the family will be masked in the detail.
   * @type {boolean}
   */
  this.knowsFamily = true;

  /**
   * Whether or not the player knows the description of this monster.
   * When the description is unknown, it'll be masked.
   * @type {boolean}
   */
  this.knowsDescription = false;

  /**
   * Whether or not the player knows the regions this monster is found in.
   * When the regions are unknown, it'll simply be blank.
   * @type {boolean}
   */
  this.knowsRegions = false;

  /**
   * Whether or not the player knows the parameters of this monster.
   * When the parameters are unknown, they will be masked.
   * @type {boolean}
   */
  this.knowsParameters = false;

  /**
   * Whether or not the player knows the ailmentalistics of this monster.
   * When the ailmentalistics are unknown, they will be masked.
   * @type {boolean}
   */
  this.knowsAilmentalistics = false;

  /**
   * All drops observed to be lootable from this enemy.
   * @type {[i|w|a, number][]}
   */
  this.knownDrops = [];

  /**
   * All element ids that have been observed in-action against this enemy.
   * @type {number[]}
   */
  this.knownElementalistics = [];
};

/**
 * Adds an observed drop to this monster's observations.
 * @param {i|w|a} dropType The type of loot drop observed.
 * @param {number} dropId The id of the drop.
 */
MonsterpediaObservations.prototype.addKnownDrop = function(dropType, dropId)
{
  this.knownDrops.push([dropType, dropId]);
};

/**
 * Determines whether or not a given drop is known.
 * @param {i|w|a} dropType The type of drop this is.
 * @param {number} dropId The id of the drop.
 * @returns {boolean} True if the drop is known, false otherwise.
 */
MonsterpediaObservations.prototype.isDropKnown = function(dropType, dropId)
{
  // a finder function for seeing if this drop is known.
  const finder = drop =>
  {
    // deconstruct the drop data.
    const [type, id] = drop;

    // if we have this entry in the list of known drops, then the drop is known.
    if (type === dropType && id === dropId) return true;

    // we do not have the drop in the list of known drops.
    return false;
  };

  // check if we found the item amongst the known drops.
  const found = this.knownDrops.find(finder, this);

  // return the boolean of whether or not we found it.
  return !!found;
};

MonsterpediaObservations.prototype.addKnownElementalistic = function(elementId)
{
  this.knownElementalistics.push(elementId);
};

MonsterpediaObservations.prototype.isElementalisticKnown = function(elementId)
{
  return this.knownElementalistics.includes(elementId);
};
//endregion MonsterpediaObservations