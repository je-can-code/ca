/**
 * The `enemyMap` is a property containing the master map from which enemies
 * from the troop are derived from.
 * @type {{events: Game_Event[]}}
 */
BattleManager.enemyMap = BattleManager.enemyMap || { events: [] };

/**
 * Extends `initMembers` to include our members as well.
 */
J.ABS.EXT.STAR.Aliased.BattleManager.set('initMembers', BattleManager.initMembers);
BattleManager.initMembers = function() 
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.BattleManager.get('initMembers').call(this);

  /**
   * The origin location that the player came from.
   * This doubles as a return location, too.
   * @type {StarOrigin}
   */
  this._originLocation = null;

  /**
  * Whether or not the player is engaged in battle.
  * @type {boolean}
  */
  this._inBattle = false;

  /**
   * An arbitrary counter for various purposes.
   * @type {JABS_Timer}
   */
  this._wait = new JABS_Timer(60, false);

  /**
   * The phase of star battle we are in.
   * @type {StarPhase}
   */
  this._starPhase ||= StarPhases.PREPARING;
};

/**
 * Gets the current phase of star battle the player is in.
 * @returns {StarPhase}
 */
BattleManager.getStarPhase = function()
{
  return this._starPhase ?? StarPhases.DISENGAGED;
};

/**
 * Sets the current phase of star battle to the new one by the phase's key.
 * @param {StarPhase} starPhase The new star phase to be.
 */
BattleManager.setStarPhase = function(starPhase)
{
  this._starPhase = starPhase;
};

/**
 * Gets the wait timer.
 * @returns {JABS_Timer}
 */
BattleManager.getWaitTimer = function()
{
  return this._wait;
};

/**
 * Sets the wait timer to countdown from a given value.
 * @param {number} waitFrames The frames to wait for.
 */
BattleManager.setWait = function(waitFrames)
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // reset the time back to defaults.
  timer.reset();

  // set the new maximum.
  timer.getMaxTime(waitFrames);
};

/**
 * Gets whether or not we are waiting.
 * @returns {boolean} Whether or not we are waiting.
 */
BattleManager.isWaiting = function()
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // if its done, then resume battle.
  if (timer.isTimerComplete()) return false;
};

BattleManager.updateTimer = function()
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // then we are waiting too.
  console.log('waiting...');

  // update the timer if its not done.
  timer.update();
};

/**
 * Clears the wait timer.
 */
BattleManager.clearWait = function() 
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // reset the timer.
  timer.forceComplete();
};

/**
 * Initiates star battle.
 * @param {StarOrigin} originLocation The origin location that the player came from.
 * @param {number} battleMapId The id of the battle map to teleport to.
 */
BattleManager.setupStarBattle = function(originLocation, battleMapId) 
{
  // loads the troop data into the battle manager.
  BattleManager.setup($gameTroop.troop().id, true, true);

  // performs the default on-battle-start event hook.
  $gameSystem.onBattleStart();

  // begins the encounter for the player.
  this.engageInBattle();

  // sets the origin location.
  this._originLocation = originLocation;

  //* TODO: add more here for which map id to send based on player's map id?
  $gamePlayer.reserveTransfer(battleMapId, 14, 9);
};

/**
 * Marks the player as "in battle".
 */
BattleManager.engageInBattle = function() 
{
  this._inBattle = true;
};

/**
 * Marks the player as "not in battle".
 */
BattleManager.disengageInBattle = function() 
{
  this._inBattle = false;
};

/**
 * Gets whether or not the player is "in battle".
 * @returns {boolean}
 */
BattleManager.isInBattle = function() 
{
  return this._inBattle;
};

/**
 * Gets the origin location of the player- the map info for where the player
 * came from prior to entering battle.
 * @returns {StarOrigin}
 */
BattleManager.origin = function() 
{
  return this._originLocation;
};