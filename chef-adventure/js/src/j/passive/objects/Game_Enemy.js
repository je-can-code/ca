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
//#endregion Game_Enemy