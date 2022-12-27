//region Game_Battler
/**
 * Extends {@link Game_Battler.initMembers}.
 */
J.ABS.EXT.SPEED.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize the extra members.
  this.initSpeedBoosts();
};

/**
 * Initializes the members for movement speed boosts.
 */
Game_Battler.prototype.initSpeedBoosts = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all JABS properties associated with the speed boosts.
   */
  this._j._abs._speed = {};

  /**
   * The cached value for speed boosts modifier.
   * @type {number}
   */
  this._j._abs._speed._walkBoost = 0;

  // TODO: add dashing speed boost too?
};

/**
 * Gets the current walking speed boost scale for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getWalkSpeedBoosts = function()
{
  return this._j._abs._speed._walkBoost;
};

/**
 * Sets the current speed bost scale for this battler.
 * @param {number} amount The new walking speed boost amount.
 */
Game_Battler.prototype.setWalkSpeedBoost = function(amount)
{
  this._j._abs._speed._walkBoost = amount;
};

/**
 * Updates the speed boost scale for this battler based on available notes.
 */
Game_Battler.prototype.refreshSpeedBoosts = function()
{
  // default to 0 of speed boost.
  let speedBoosts = 0;

  // get all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // iterate over all valid note objects this battler has.
  objectsToCheck
    .filter(obj => obj.jabsSpeedBoost)
    .forEach(obj => speedBoosts += obj.jabsSpeedBoost);

  // update the speed boost value with the latest.
  this.setWalkSpeedBoost(speedBoosts);
};
//endregion Game_Battler