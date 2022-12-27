//region Game_Party
/**
 * Extends initialization to include the ally AI configurations.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('initialize').call(this);

  // initialize our ally ai members.
  this.initAllyAi();
};

/**
 * Initializes additional properties associated with ally ai.
 */
Game_Party.prototype.initAllyAi = function()
{
  /**
   * All encompassing object for storing my custom properties.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with ally ai.
   */
  this._j._allyAI ||= {};

  /**
   * Whether or not the party will engage without the player's engagement.
   * @type {boolean}
   */
  this._j._allyAI._aggroPassiveToggle ||= false;
};

/**
 * Gets whether or not the party is allowed to actively engage enemies.
 * @returns {boolean}
 */
Game_Party.prototype.isAggro = function()
{
  return this._j._allyAI._aggroPassiveToggle;
};

/**
 * Sets the party ally AI to be aggro.
 * Aggro party ally AI will have their own sight ranges and engage any enemies nearby.
 */
Game_Party.prototype.becomeAggro = function()
{
  this._j._allyAI._aggroPassiveToggle = true;
};

/**
 * Sets the party ally AI to be passive.
 * Passive party ally AI will only fight if hit first or when the leader engages.
 */
Game_Party.prototype.becomePassive = function()
{
  this._j._allyAI._aggroPassiveToggle = false;
};

/**
 * Extends {@link Game_Party.addActor}.
 * Also updates allies to accommodate the addition of the actor.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('addActor', Game_Party.prototype.addActor);
Game_Party.prototype.addActor = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('addActor').call(this, actorId);

  // update all allies when adding an actor to the party.
  $gameMap.updateAllies();
};

/**
 * Extends {@link Game_Party.removeActor}.
 * Also updates allies to accommodate the removal of the actor.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Party.set('removeActor', Game_Party.prototype.removeActor);
Game_Party.prototype.removeActor = function(actorId)
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_Party.get('removeActor').call(this, actorId);

  // update all allies when removing an actor from the party.
  $gameMap.updateAllies();
};
//endregion Game_Party