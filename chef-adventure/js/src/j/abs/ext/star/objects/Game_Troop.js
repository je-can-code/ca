/**
 * Extends {@link Game_Troop.initialize}.
 * Initializes our additional members for STABS.
 */
J.ABS.EXT.STAR.Aliased.Game_Troop.set('initialize', Game_Troop.prototype.initialize);
Game_Troop.prototype.initialize = function() 
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Troop.get('initialize').call(this);

  // initialize the STABS members.
  this.initMembers();
};

/**
* Initializes additional properties for this class.
*/
Game_Troop.prototype.initMembers = function() 
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
   * The number of living enemies remaining on this battle map.
   * @type {number}
   */
  this._j._abs._remainingEnemyCount = 0;
};

/**
 * Gets the number of living enemies on this map.
 * @returns {number}
 */
Game_Troop.prototype.getRemainingEnemyCount = function()
{
  return this._j._abs._remainingEnemyCount;
};

/**
 * Updates the current number of living enemies on this map.
 */
Game_Troop.prototype.updateRemainingEnemyCount = function() 
{
  // update the remaining enemy count.
  this._remainingEnemyCount = JABS_AiManager.getOpposingBattlers($jabsEngine.getPlayer1()).length;
};

/**
 * Gets whether or there are still enemies alive on this map.
 */
Game_Troop.prototype.areEnemiesAlive = function() 
{
  return this.getRemainingEnemyCount() > 0;
};