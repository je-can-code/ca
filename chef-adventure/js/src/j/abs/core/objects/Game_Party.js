//region Game_Party
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
   * A grouping of all properties associated with JABS.
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

/**
 * Gets the {@link JABS_Battler} of the leader.
 * If no leader is present or no leader is tracked, this will return `undefined`.
 * @returns {JABS_Battler|undefined}
 */
Game_Party.prototype.leaderJabsBattler = function()
{
  // if we don't have a leader, then we don't have a leader battler.
  if (!this.leader()) return undefined;

  // grab the leader's uuid.
  const leaderUuid = this.leader().getUuid();

  // return the leader's battler.
  return JABS_AiManager.getBattlerByUuid(leaderUuid);
};

/**
 * Swap the leader with one of its followers by index and refreshes the player.
 * @param {number} newIndex The index of the follower to swap with.
 */
Game_Party.prototype.swapLeaderWithFollower = function(newIndex)
{
  // swap to the next party member in the sequence.
  this._actors = this._actors.concat(this._actors.splice(0, newIndex));

  // update the player with the change in party member order.
  $gamePlayer.refresh();
};
//endregion Game_Party