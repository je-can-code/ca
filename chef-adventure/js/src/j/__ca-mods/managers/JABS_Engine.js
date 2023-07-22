//region JABS_Engine
/**
 * Fixes the weird problem where CA uniquely seems to want to move character sprites up
 * by 1 when generating loot.
 * @param {number} targetX The `x` coordiante where the loot will be dropped/placed.
 * @param {number} targetY The `y` coordinate where the loot will be dropped/placed.
 */
J.CAMods.Aliased.JABS_Engine.set('addLootDropToMap', JABS_Engine.prototype.addLootDropToMap);
JABS_Engine.prototype.addLootDropToMap = function(targetX, targetY, item)
{
  // move the Y up by one because CA is weird?
  const modifiedTargetY = targetY + 1;
  
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('addLootDropToMap').call(this, targetX, modifiedTargetY, item);
};

/**
 * Extends the handling of defeated enemies to track data.
 * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
 * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
 */
J.CAMods.Aliased.JABS_Engine.set('handleDefeatedEnemy', JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster)
{
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('handleDefeatedEnemy').call(this, defeatedTarget, caster);

  // determine whether to add to the destructibles count or regular count.
  if (defeatedTarget.isInanimate())
  {
    // add to destructibles destroyed count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.DestructiblesDestroyed, 1);
  }
  else
  {
    // add to enemy defeated count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.EnemiesDefeated, 1);
  }
};

/**
 * Extends {@link #handleDefeatedPlayer}.
 * Also tracks player defeated count.
 */
J.CAMods.Aliased.JABS_Engine.set('handleDefeatedPlayer', JABS_Engine.prototype.handleDefeatedPlayer);
JABS_Engine.prototype.handleDefeatedPlayer = function()
{
  // add to player defeated count.
  J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfDeaths, 1);

  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('handleDefeatedPlayer').call(this);
};

/**
 * Extends {@link #postExecuteSkillEffects}.
 * Also tracks our combat data in variables.
 * @param {JABS_Action} action The action being executed.
 * @param {JABS_Battler} target The target to apply skill effects against.
 */
J.CAMods.Aliased.JABS_Engine.set('postExecuteSkillEffects', JABS_Engine.prototype.postExecuteSkillEffects);
JABS_Engine.prototype.postExecuteSkillEffects = function(action, target)
{
  // execute the original method so the result is on the target.
  J.CAMods.Aliased.JABS_Engine.get('postExecuteSkillEffects').call(this, action, target);

  // don't track these data points if its a tool.
  if (action.getCooldownType() !== JABS_Button.Tool)
  {
    // if the target is an enemy, track it as attack data.
    if (target.isEnemy())
    {
      this.trackAttackData(target);
    }
    // if the target is an actor, track it as defensive data.
    else if (target.isActor())
    {
      this.trackDefensiveData(target);
    }
  }
};

/**
 * Tracks various attack-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
JABS_Engine.prototype.trackAttackData = function(target)
{
  // extract the data points from the battler's action result.
  const {hpDamage, critical} = target.getBattler().result();

  // check if it was hp-related.
  if (hpDamage > 0)
  {
    // count all damage dealt.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageDealt, hpDamage);

    // track the highest damage dealt in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageDealt);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageDealt, hpDamage);
    }

    // check if the hit was critical.
    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsDealt, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritDealt);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritDealt, hpDamage);
      }
    }
  }
};

/**
 * Tracks various defensive-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
JABS_Engine.prototype.trackDefensiveData = function(target)
{
  const {hpDamage, critical, parried, preciseParried} = target.getBattler().result();
  if (hpDamage)
  {
    // count all damage received.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageTaken, hpDamage);

    // track the highest damage received in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageTaken);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageTaken, hpDamage);
    }

    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsTaken, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritTaken);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritTaken, hpDamage);
      }
    }

  }
  else if (parried)
  {
    // count of all types of successful parries.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfParries, 1);

    if (preciseParried)
    {
      // count of all types of successful parries.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfPreciseParries, 1);
    }
  }
};

/**
 * Extends {@link #executeMapAction}.
 * Also tracks action execution data.
 * @param {JABS_Battler} caster The battler executing the action.
 * @param {JABS_Action} action The action being executed.
 * @param {number?} targetX The target's `x` coordinate, if applicable.
 * @param {number?} targetY The target's `y` coordinate, if applicable.
 */
J.CAMods.Aliased.JABS_Engine.set('executeMapAction', JABS_Engine.prototype.executeMapAction);
JABS_Engine.prototype.executeMapAction = function(caster, action, targetX, targetY)
{
  // perform original logic.
  J.CAMods.Aliased.JABS_Engine.get('executeMapAction').call(this, caster, action, targetX, targetY);

  // validate the caster is a player before tracking.
  if (caster.isPlayer())
  {
    // track the data for the player.
    this.trackActionData(action);
  }
};

/**
 * Tracks mainhand/offhand/skill usage data points and assigns them to variables.
 * @param {JABS_Action} action
 */
JABS_Engine.prototype.trackActionData = function(action)
{
  // check which cooldown this is associated with.
  const cooldownType = action.getCooldownType();

  // pivot on the slot type.
  switch (cooldownType)
  {
    case JABS_Button.Mainhand:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.MainhandSkillUsage, 1);
      break;
    case JABS_Button.Offhand:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.OffhandSkillUsage, 1);
      break;
    default:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.AssignedSkillUsage, 1);
      // any skills
      break;
  }
};
//endregion JABS_Engine