//#region Game_Action
/**
 * Extends the .apply() to include consideration of prof.
 */
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  J.PROF.Aliased.Game_Action.get("apply").call(this, target);

  const result = target.result();

  // we only process prof gains for actors- for now.
  if (this.canIncreaseProficiency(target))
  {
    this.increaseProficiency(result.critical);
  }
};

/**
 * Whether or not increasing the attacker's proficiency is a valid course of action
 * based on various requirements.
 * @param {Game_Battler} target The result of the action.
 * @returns {boolean}
 */
Game_Action.prototype.canIncreaseProficiency = function(target)
{
  // only gain proficiency if this is a skill, not an item or something.
  const isSkill = this.isSkill();
  if (!isSkill) return false;

  // only gain proficiency if we hit the target.
  const isHit = target.result().isHit();
  if (!isHit) return false;

  // only gain proficiency if the target allows it.
  const canGiveProficiency = target.canGiveProficiency();
  if (!canGiveProficiency) return false;

  // only gain proficiency if the attacker allows it.
  const canGainProficiency = this.subject().canGainProficiency();
  if (!canGainProficiency) return false;

  // if we made it this far, then we can gain proficiency!
  return true;
};

/**
 * Increases the skill prof for the actor with the given skill.
 */
Game_Action.prototype.increaseProficiency = function()
{
  const caster = this.subject();
  const skill = this.item();
  if (!caster || !skill)
  {
    console.warn('attempted to improve prof for an invalid caster or skill.');
    return;
  }

  const amount = caster.skillProficiencyAmount();
  caster.increaseSkillProficiency(skill.id, amount);
};

/**
 * Gets the skill prof from this action's skill of the caster.
 * @returns {number}
 */
Game_Action.prototype.skillProficiency = function()
{
  if (this.isSkill() && this.subject())
  {
    const skill = this.item();
    const skillProficiency = this.subject().skillProficiencyBySkillId(skill.id);
    if (skillProficiency)
    {
      return skillProficiency.proficiency;
    }
  }

  return 0;
};

//#endregion Game_Action