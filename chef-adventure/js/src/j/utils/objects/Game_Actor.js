/**
 * Extends {@link Game_Actor.onLearnNewSkill}.
 * Wraps the function so that if a new skill is learned, it'll echo to the console.
 */
J.UTILS.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.UTILS.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

  // instead of responding with undefined to the console, return the name of the skill.
  //console.log(`[${skillId}] {${this.skill(skillId).name}} was learned.`);
};

/**
 * Extends {@link Game_Actor.onForgetSkill}.
 * Wraps the function so that if a skill is forgotten, it'll echo back to the console.
 */
J.UTILS.Aliased.Game_Actor.set('onForgetSkill', Game_Actor.prototype.onForgetSkill);
Game_Actor.prototype.onForgetSkill = function(skillId)
{
  // perform original logic.
  J.UTILS.Aliased.Game_Actor.get('onForgetSkill').call(this, skillId);

  // instead of responding with undefined to the console, return the name of the skill.
  return `[${skillId}] {${this.skill(skillId).name}} was not learned.`;
};