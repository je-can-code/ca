//#region Game_Party
/**
 * Extends the initialize to include additional objects for JABS.
 */
J.ABS.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Party.get('initialize').call(this);

  // initialize party data for JABS.
  this.initJabsPartyData();
};

/**
 * Initializes the stuff related to tracking JABS party cycle capabilities.
 */
Game_Party.prototype.initJabsPartyData = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The master reference to all JABS-related added properties on this class.
   * @type {{}}
   */
  this._j._abs ||= {};

  /**
   * Whether or not the party is allowed to party cycle.
   * @type {boolean}
   */
  this._j._abs._canPartyCycle ||= true;
};

/**
 * (re-)Enables the JABS party cycle functionality.
 */
Game_Party.prototype.enablePartyCycling = function()
{
  this._j._abs._canPartyCycle = true;
};

/**
 * Disables the JABS party cycle functionality.
 */
Game_Party.prototype.disablePartyCycling = function()
{
  this._j._abs._canPartyCycle = false;
};

/**
 * Gets whether or not the party can cycle between members.
 * @returns {boolean} True if party cycling is enabled, false otherwise.
 */
Game_Party.prototype.canPartyCycle = function()
{
  return this._j._abs._canPartyCycle;
};
//#endregion Game_Party