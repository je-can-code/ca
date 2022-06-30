//#region Game_Party
/**
 * Extends initialization to include the ally AI configurations.
 */
J.ALLYAI.Aliased.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function()
{
  J.ALLYAI.Aliased.Game_Party.initialize.call(this);
  this._j = this._j || {};
  this._j._allyAI = this._j._allyAI || {};
  this._j._allyAI._aggroPassiveToggle = this._j._allyAI._aggroPassiveToggle || false;
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
 * When adding party members, also update your allies.
 */
J.ALLYAI.Aliased.Game_Party.addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId)
{
  J.ALLYAI.Aliased.Game_Party.addActor.call(this, actorId);
  $gameMap.updateAllies();
};

/**
 * When removing party members, also update your allies.
 */
J.ALLYAI.Aliased.Game_Party.removeActor = Game_Party.prototype.removeActor;
Game_Party.prototype.removeActor = function(actorId)
{
  J.ALLYAI.Aliased.Game_Party.removeActor.call(this, actorId);
  $gameMap.updateAllies();
};
//#endregion Game_Party