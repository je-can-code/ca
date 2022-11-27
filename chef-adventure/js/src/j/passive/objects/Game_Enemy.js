//#region Game_Enemy
/**
 * Gets all skills learned from oneself.
 * In the case of enemies, this extracts the list of skill ids from the various actions
 * they can execute from their action list, as well as their "attack skill".
 * @returns {number[]}
 */
Game_Enemy.prototype.skillIdsFromSelf = function()
{
  return this.skills().map(skill => skill.id);
};

/**
 * Extends {@link #getNotesSources}.
 * Includes passive skill states from this enemy.
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
    ...this.passiveSkillStates(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources
};
//#endregion Game_Enemy