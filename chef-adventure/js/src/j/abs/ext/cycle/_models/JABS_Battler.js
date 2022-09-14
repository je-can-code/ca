/**
 * Sets the number of steps that will be force-moved when dodging.
 * @param {number} stepCount The number of steps to dodge.
 */
J.ABS.EXT.CYCLE.Aliased.JABS_Battler.set('setDodgeSteps', JABS_Battler.prototype.setDodgeSteps);
JABS_Battler.prototype.setDodgeSteps = function(stepCount)
{
  // modify the step count because pixel movement makes it move multiplicatively per-step.
  const modifiedStepCount = (stepCount * CycloneMovement.stepCount);

  // perform original logic- but with the modified step count.
  J.ABS.EXT.CYCLE.Aliased.JABS_Battler.get('setDodgeSteps').call(this, modifiedStepCount);
};