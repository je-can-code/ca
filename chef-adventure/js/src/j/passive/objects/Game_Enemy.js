//region Game_Enemy
/**
 * Extends {@link #onSetup}.
 * Also refreshes the passive states on this battler for the first time.
 * @param {number} enemyId The battler's id.
 */
J.PASSIVE.Aliased.Game_Enemy.set('onSetup', Game_Enemy.prototype.onSetup);
Game_Enemy.prototype.onSetup = function(enemyId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Enemy.get('onSetup').call(this, enemyId);

  // refresh all passive states on this battler.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #traitObjects}.
 * When considering traits, also include the enemy's passive states.
 */
J.PASSIVE.Aliased.Game_Enemy.set('traitObjects', Game_Enemy.prototype.traitObjects);
Game_Enemy.prototype.traitObjects = function()
{
  // perform original logic.
  const originalObjects = J.PASSIVE.Aliased.Game_Enemy.get('traitObjects').call(this);

  // add our own passive states.
  originalObjects.push(...this.getPassiveStates());

  // return the new combined collection.
  return originalObjects;
};

/**
 * Extends {@link #getNotesSources}.
 * Includes passive states from this enemy.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Enemy.set('getNotesSources', Game_Enemy.prototype.getNotesSources);
Game_Enemy.prototype.getNotesSources = function()
{
  // perform original logic to get notes.
  const originalSources = J.PASSIVE.Aliased.Game_Enemy.get('getNotesSources').call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive skill states, too.
    ...this.getPassiveStates(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources;
};
//endregion Game_Enemy