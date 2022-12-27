//region JABS_Action
/**
 * Extends {@link JABS_Action.getCastTime}.
 * Applies cast speed into the equation of determining cast time.
 */
J.ABS.EXT.TIMING.Aliased.JABS_Action.set('getCastTime', JABS_Action.prototype.getCastTime);
JABS_Action.prototype.getCastTime = function()
{
  // perform original logic to get regular cast time.
  const skillCastTime = J.ABS.EXT.TIMING.Aliased.JABS_Action.get('getCastTime').call(this);

  // grab the caster.
  const caster = this.getCaster().getBattler();

  // if we have no caster, then don't try to calculate it.
  if (!caster) return skillCastTime;

  // calculate the cast time.
  const actualCastTime = caster.applyCastSpeed(skillCastTime);

  // return the actual cast time.
  return actualCastTime;
};

/**
 * Extends {@link JABS_Action.getCooldown}.
 * Applies fast cooldown into the equation of determining cooldown time.
 */
J.ABS.EXT.TIMING.Aliased.JABS_Action.set('getCooldown', JABS_Action.prototype.getCooldown);
JABS_Action.prototype.getCooldown = function()
{
  // perform original logic to get regular cooldown.
  const skillCooldown = J.ABS.EXT.TIMING.Aliased.JABS_Action.get('getCooldown').call(this);

  // grab the caster.
  const caster = this.getCaster().getBattler();

  // if we have no caster, then don't try to calculate it.
  if (!caster) return skillCooldown;

  // calculate the cooldown.
  const actualCooldown = caster.applyFastCooldown(skillCooldown);

  // return the actual cooldown.
  return actualCooldown;
};
//endregion JABS_Action