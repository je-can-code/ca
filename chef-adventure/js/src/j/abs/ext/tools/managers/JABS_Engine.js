/**
 * Processes the various on-hit effects against the target.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Engine.set('processOnHitEffects', JABS_Engine.prototype.processOnHitEffects)
JABS_Engine.prototype.processOnHitEffects = function(action, target)
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Engine.get('processOnHitEffects').call(this, action, target);

  // handle gapclose logic.
  this.handleGapClose(action, target);
};

JABS_Engine.prototype.handleGapClose = function(action, target)
{
  // if we cannot gap close, then do not.
  if (!this.canGapClose(action, target)) return;

  // grab the caster.
  const caster = action.getCaster();

  // gap close to the target.
  caster.gapCloseToTarget(action, target)
};

/**
 * Determine whether or not the target can be gap closed to.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 * @returns {boolean} True if the target can be gap closed to, false otherwise.
 */
JABS_Engine.prototype.canGapClose = function(action, target)
{
  // grab the skill.
  const skill = action.getBaseSkill();

  // if the skill isn't a gap close skill, then we cannot gap close.
  if (!skill.jabsGapClose) return false;

  // if it is a gap close skill and the default behavior is always gap close, then we can gap close.
  if (J.ABS.EXT.TOOLS.Metadata.CanGapCloseByDefault) return true;

  // if the target is not a gap-closable target, then we cannot gap close.
  if (!target.isGapClosable(action, target)) return false;

  // we can gap close!
  return true;
};