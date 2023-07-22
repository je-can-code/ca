//region Game_Action
/**
 * Extends the .apply() to include consideration of prof.
 */
J.PROF.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  J.PROF.Aliased.Game_Action.get("apply").call(this, target);

  const result = target.result();

  // determine if the battler can increase proficiency against the target.
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

// this stuff only applies to JABS.
if (J.ABS)
{
  /**
   * Extends {@link Game_Action.onParry}.
   * Also gains proficiency for the parry if possible.
   * @param {JABS_Battler} jabsBattler The battler that is parrying.
   */
  J.PROF.Aliased.Game_Action.set('onParry', Game_Action.prototype.onParry);
  Game_Action.prototype.onParry = function(jabsBattler)
  {
    // perform original logic.
    J.PROF.Aliased.Game_Action.get('onParry').call(this, jabsBattler);

    // gain some proficiency from guarding.
    this.gainProficiencyFromGuarding(jabsBattler);
  };

  /**
   * Extends {@link Game_Action.onGuard}.
   * Also gains proficiency for the guard if possible.
   * @param {JABS_Battler} jabsBattler The battler that is guarding.
   */
  J.PROF.Aliased.Game_Action.set('onGuard', Game_Action.prototype.onGuard);
  Game_Action.prototype.onGuard = function(jabsBattler)
  {
    // perform original logic.
    J.PROF.Aliased.Game_Action.get('onGuard').call(this, jabsBattler);

    // gain some proficiency from guarding.
    this.gainProficiencyFromGuarding(jabsBattler);
  };

  /**
   * Gains proficiency when guarding.
   * @param jabsBattler
   */
  Game_Action.prototype.gainProficiencyFromGuarding = function(jabsBattler)
  {
    // don't gain proficiency if we cannot.
    if (!this.canGainProficiencyFromGuarding(jabsBattler)) return;

    // handle tp generation from the guard skill.
    const skillId = jabsBattler.getGuardSkillId();

    // gain some proficiency for the parry skill.
    jabsBattler.getBattler().increaseSkillProficiency(skillId, 1);
  };

  /**
   * Determines whether or not this battle can gain proficiency for the guard skill.
   * @param {JABS_Battler} jabsBattler The battler that is guarding/parrying.
   * @returns {boolean} True if we can gain proficiency, false otherwise.
   */
  Game_Action.prototype.canGainProficiencyFromGuarding = function(jabsBattler)
  {
    // determine whether or not this battler can gain proficiency.
    const canGainProficiency = jabsBattler.getBattler().canGainProficiency();

    // if the battler is blocked from gaining proficiency don't gain proficiency.
    if (!canGainProficiency) return false;

    // get the guard skill id.
    const skillId = jabsBattler.getGuardSkillId();

    // if there is no skill id, don't gain proficiency.
    if (!skillId) return false;

    // gain proficiency!
    return true;
  };
}
//endregion Game_Action