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

/**
 * Extends {@link #destroy}.
 * Reloads the collision table in case the enemy was a part of the tileset.
 */
J.ABS.EXT.CYCLE.Aliased.JABS_Battler.set('destroy', JABS_Battler.prototype.destroy);
JABS_Battler.prototype.destroy = function()
{
  // before destruction, check if the battler was not an actor.
  const isNotActor = !this.getBattler().isActor();

  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.JABS_Battler.get('destroy').call(this);

  // check if the defeated battler was not an actor.
  if (isNotActor)
  {
    // reload the collision table.
    CycloneMovement.loadDefaultCollisionTable();
  }
};