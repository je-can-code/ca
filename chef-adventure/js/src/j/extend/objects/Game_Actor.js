//region Game_Actor
/**
 * OVERWRITE Gets the skill associated with the given skill id.
 * By abstracting this, we can modify the underlying skill before it reaches its destination.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {RPG_Skill}
 */
Game_Actor.prototype.skill = function(skillId)
{
  return OverlayManager.getExtendedSkill(this, skillId);
};
//endregion Game_Actor