//region Game_Action
/**
 * Overwrites {@link #subject}.
 * On the map there is no context of a $gameTroop. This means that an
 * action must accommodate both enemy and actor alike. In order to handle
 * this, we check to see which id was set and respond accordingly.
 *
 * NOTE: The subject represents the battler who is performing this action.
 * @returns {Game_Actor|Game_Enemy}
 */
// TODO: should this be updated to use the battler's UUIDs instead?
Game_Action.prototype.subject = function()
{
  // initialize the subject.
  let subject;

  // determine if there was an actor id stored.
  if (this._subjectActorId > 0)
  {
    // assign the subject to be the given actor.
    subject = $gameActors.actor(this._subjectActorId);
  }
  // it must've been an enemy.
  else
  {
    // assign the subject to be the given enemy.
    subject = $gameEnemies.enemy(this._subjectEnemyIndex);
  }

  // return the determined subject.
  return subject;
};

/**
 * Overwrites {@link #setSubject}.
 * On the map there is no context of a $gameTroop. This means that an
 * action must accommodate both enemy and actor alike. In order to handle
 * this, we check to see which id was set and respond accordingly.
 *
 * @param {Game_Actor|Game_Enemy} subject The subject to assign to this action.
 */
// TODO: should this be updated to use the battler's UUIDs instead?
Game_Action.prototype.setSubject = function(subject)
{
  // fancy if-else block.
  switch (true)
  {
    case (subject.isActor()):
      // update the battler ids to show the caster is an actor.
      this._subjectActorId = subject.battlerId();
      this._subjectEnemyIndex = -1;
      break;
    case (subject.isEnemy()):
      // update the battler ids to show the caster is an enemy.
      this._subjectEnemyIndex = subject.battlerId();
      this._subjectActorId = 0;
      break;
  }
};

//region action application
/**
 * Overwrites {@link #apply}.
 * Adjusts how a skill is applied to a target in the context of JABS.
 * While JABS is disabled, the normal application is used instead.
 */
J.ABS.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  // check if JABS is enabled.
  if ($jabsEngine.absEnabled)
  {
    // let JABS handle this.
    this.applyJabsAction(target);
  }
  // JABS is not enabled.
  else
  {
    // perform original logic.
    J.ABS.Aliased.Game_Action.get('apply').call(this, target);
  }
};

/**
 * Applies a skill against the target.
 * This is effectively Game_Action.apply, but with some adjustments to accommodate
 * the fact that we're using this in an action battle system instead.
 * @param {Game_Battler} target The target the skill is being applied to.
 */
Game_Action.prototype.applyJabsAction = function(target)
{
  // all the normal stuff that happens with Game_Action.apply() logic.
  const result = target.result();
  this.subject().clearResult();
  result.clear();
  result.used = this.testApply(target);
  result.evaded = this.isHitEvaded(target);
  result.physical = this.isPhysical();
  result.drain = this.isDrain();

  // validate we landed a hit.
  if (result.isHit())
  {
    // check if there is a damage formula.
    if (this.item().damage.type > 0)
    {
      // determine if its a critical hit.
      result.critical = this.isHitCritical(target);

      // calculate the damage.
      const value = this.makeDamageValue(target, result.critical);

      // actually apply the damage to the target.
      this.executeDamage(target, value);
    }

    // add the subject who is applying the state as a parameter for tracking purposes.
    this.item().effects.forEach(effect => this.applyItemEffect(target, effect));

    // applies on-cast/on-hit effects, like gaining TP or producing on-cast states.
    this.applyItemUserEffect(target);

    // applies common events that may be a part of a skill's effect.
    this.applyGlobal();
  }

  // also update the last target hit.
  this.updateLastTarget(target);
};

/**
 * Calculates whether or not this action is evaded by the target.
 * @param {Game_Battler} target The target the skill is being applied to.
 * @returns {boolean} True if this action was evaded, false otherwise.
 */
Game_Action.prototype.isHitEvaded = function(target)
{
  // hit rate gets a bonus between 0-1.
  const hitRate = Math.random() + this.itemHit();

  // grab the evade rate of the target based on the action.
  const evadeRate = this.itemEva(target);

  // determine if the hit was evaded.
  const evaded = (hitRate - evadeRate) <= 0;

  // return our outcome.
  return evaded;
};

/**
 * Calculates whether or not this action is a critical hit against the target.
 * @param {Game_Battler} target The target the skill is being applied to.
 * @returns {boolean} True if this action was critical, false otherwise.
 */
Game_Action.prototype.isHitCritical = function(target)
{
  return Math.random() < this.itemCri(target);
};

/**
 * Overwrites {@link #itemHit}.
 * This overwrite converts the success rate of a skill into the value
 * representing what percent of your hit is used in the hit chance formula.
 * @returns {number}
 */
Game_Action.prototype.itemHit = function()
{
  // success is a multiplier against the hitrate.
  const successFactor = this.item().successRate * 0.01;

  // calculate the hitrate factor.
  const hitRate = successFactor * this.subject().hit;

  // return the hitrate factor.
  return hitRate;
};

/**
 * Extends {@link #makeDamageValue}.
 * Includes consideration of guard effects of the target.
 */
J.ABS.Aliased.Game_Action.set('makeDamageValue', Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  // perform original logic.
  let base = J.ABS.Aliased.Game_Action.get('makeDamageValue').call(this, target, critical);

  // validate we have a target.
  if (this.canHandleGuardEffects(target))
  {
    // grab the guarding
    const guardingJabsBattler = JABS_AiManager.getBattlerByUuid(target.getUuid());

    // apply guard damage modifiers.
    base = this.handleGuardEffects(base, guardingJabsBattler);
  }

  // return the damage output.
  return base;
};

//region guard-related damage modification
/**
 * Determines whether or not the action should consider guard effects.
 * @param {Game_Battler} target The target considering guard effects.
 * @returns {boolean} True if guard effects should be considered, false otherwise.
 */
Game_Action.prototype.canHandleGuardEffects = function(target)
{
  // if there is no target, then the target cannot guarding.
  if (!target) return false;

  // handle guarding!
  return true;
};

/**
 * Handles all guard-related effects, such as parrying or guarding.
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} jabsBattler The battler potentially doing guard things.
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, jabsBattler)
{
  // check if the battler is parrying; parrying takes priority over guarding.
  if (jabsBattler.parrying())
  {
    // process the parry functionality.
    this.processParry(jabsBattler);

    // calculate the reduced amount from guarding.
    const parryReducedDamage = this.calculateParryDamageReduction(jabsBattler, damage);

    // return the reduced amount.
    return parryReducedDamage;
  }

  // check if the battler is guarding.
  if (jabsBattler.guarding())
  {
    // process the guard functionality.
    this.processGuard(jabsBattler);

    // calculate the reduced amount from guarding.
    const guardReducedDamage = this.calculateGuardDamageReduction(jabsBattler, damage);

    // return the reduced amount.
    return guardReducedDamage;
  }

  // if there was no guarding or parrying happen, just return the original damage.
  return damage;
};

/**
 * Processes the action as a parry, mitigating all damage, along
 * with any additional side effects.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 */
Game_Action.prototype.processParry = function(jabsBattler)
{
  // shorthand the underlying battler.
  const battler = jabsBattler.getBattler();

  // grab the action result.
  const actionResult = battler.result();

  // nullify the result via parry.
  actionResult.parried = true;

  // perform on-parry effects.
  this.onParry(jabsBattler);

  // TODO: pull the parry logic out of the requestanimation function.
  // play the parry animation.
  jabsBattler.getCharacter().requestAnimation(0, true);

  // reset the player's guarding.
  jabsBattler.setParryWindow(0);
  jabsBattler.setGuardSkillId(0);
};

/**
 * A hook to perform actions on-parry.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 */
Game_Action.prototype.onParry = function(jabsBattler)
{
  // handle tp generation from parrying.
  const guardSkillTp = this.getTpFromGuardSkill(jabsBattler) * 10;

  // gain 10x of the tp from the guard skill when parrying.
  jabsBattler.getBattler().gainTp(guardSkillTp);
};

/**
 * Calculates the damage reduction from parrying.
 * @param {JABS_Battler} jabsBattler The battler that is parrying.
 * @param {number} originalDamage The original amount of damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.calculateParryDamageReduction = function(jabsBattler, originalDamage)
{
  // assign the damage to a local variable because good coding practices.
  let modifiedDamage = originalDamage;

  // parry damage reduction is always 100%.
  modifiedDamage = 0;

  // return the parry-modified damage.
  return modifiedDamage;
};

/**
 * Processes the action as a guard, reducing damage along with any
 * additional side effects.
 * @param {JABS_Battler} jabsBattler The battler that is guar1ding.
 */
Game_Action.prototype.processGuard = function(jabsBattler)
{
  // perform on-guard effects.
  this.onGuard(jabsBattler);
};

/**
 * A hook to perform actions on-guard.
 * @param {JABS_Battler} jabsBattler The battler that is guarding.
 */
Game_Action.prototype.onGuard = function(jabsBattler)
{
  // gain any tp associated with defending.
  const guardSkillTp = this.getTpFromGuardSkill(jabsBattler);

  // gain 100% of the tp from the guard skill when guarding.
  jabsBattler.getBattler().gainTp(guardSkillTp);
};

/**
 * Calculates the damage reduction from guarding.
 * @param {JABS_Battler} jabsBattler The battler that is guarding.
 * @param {number} originalDamage The original amount of damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.calculateGuardDamageReduction = function(jabsBattler, originalDamage)
{
  // assign the damage to a local variable because good coding practices.
  let modifiedDamage = originalDamage;

  // reduce the damage accordingly per the guard data- percent then flat.
  modifiedDamage = this.applyPercentDamageReduction(modifiedDamage, jabsBattler);
  modifiedDamage = this.applyFlatDamageReduction(modifiedDamage, jabsBattler);

  // return the guard-modified damage.
  return modifiedDamage;
};

/**
 * Gets the TP from the guard skill that was performed.
 * @param {JABS_Battler} jabsBattler The battler that is defending.
 * @return {number} The TP
 */
Game_Action.prototype.getTpFromGuardSkill = function(jabsBattler)
{
  // handle tp generation from the guard skill.
  const skillId = jabsBattler.getGuardSkillId();

  // grab the potentially extended guard skill.
  const skill = jabsBattler.getSkill(skillId);

  // if timing is just a hair off, the guarding skill won't be available.
  if (!skill) return 0;

  // return the tp associated with the guard skill.
  return skill.tpGain;
};

/**
 * Reduces damage of a value if defending- by a flat amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} jabsBattler The battler.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.applyFlatDamageReduction = function(base, jabsBattler)
{
  // calculate the flat reduction.
  const reduction = parseFloat(jabsBattler.flatGuardReduction());

  // grab the action result for updating.
  const result = jabsBattler.getBattler().result();

  // take note of the flat amount reduced in the action result.
  result.reduced += reduction;

  // prevent reducing the damage into healing instead.
  const flatReducedDamage = Math.max((base + reduction), 0);

  // return the reduced amount of damage.
  return flatReducedDamage;
};

/**
 * Reduces damage of a value if defending- by a percent amount.
 * @param {number} baseDamage The base damage value to modify.
 * @param {JABS_Battler} jabsBattler The battler reducing damage.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.applyPercentDamageReduction = function(baseDamage, jabsBattler)
{
  // calculate the percent reduction.
  const reduction = parseFloat(baseDamage - ((100 + jabsBattler.percGuardReduction()) / 100) * baseDamage);

  // grab the action result for updating.
  const actionResult = jabsBattler.getBattler().result();

  // take note of the percent amount reduced in the action result.
  actionResult.reduced -= reduction;

  // prevent reducing the damage into healing instead.
  const percentReducedDamage = Math.max((baseDamage - reduction), 0);

  // return the reduced amount of damage.
  return percentReducedDamage;
};
//endregion guard-related damage modification

//region state-related effect application
/**
 * Extends {@link #itemEffectAddState}.
 * Adds a conditional check to see if adding state-related effects is allowed
 * against the target.
 * @param {Game_Battler} target The target battler potentially being afflicted.
 * @param {rm.types.Effect} effect The effect being applied to the target.
 */
J.ABS.Aliased.Game_Action.set('itemEffectAddState', Game_Action.prototype.itemEffectAddState);
Game_Action.prototype.itemEffectAddState = function(target, effect)
{
  // check if we are able to apply state-related effects.
  if (!this.canItemEffectAddState(target, effect)) return;

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.get('itemEffectAddState').call(this, target, effect);
};

/**
 * Determines whether or not the state from the effect of a skill or item can be applied
 * against the target. This is not a check of state resistances, but a check of whether
 * or not the application of state effects of any kind are allowed.
 *
 * By default, if an action is parried, then its states are not applied to the target.
 * @param {Game_Battler} target The target battler potentially being afflicted.
 * @param {rm.types.Effect} effect The effect being applied to the target.
 */
// eslint-disable-next-line no-unused-vars
Game_Action.prototype.canItemEffectAddState = function(target, effect)
{
  // if the target parried the result, then its state-related effects do not apply.
  if (target.result()?.parried) return false;

  // see if the state-related effects are applied!
  return true;
};

/**
 * Overwrites {@link #itemEffectAddAttackState}.
 * When a "Normal Attack" effect is used and a state is applied, then
 * all of the battler's attack states have an opportunity to be applied
 * based on all the various rates and calculations.
 *
 * DEV NOTE:
 * It was frustrating that this needed an entire replacement just to
 * inject the battler.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect)
{
  // grab all the attacker's state ids.
  const attackerStateIds = this.subject().attackStates();

  // if there are no attacker state ids, then don't process anything.
  if (!attackerStateIds.length) return;

  // extract the date point.
  const { value1: chance } = effect;

  // an iterator function for how to check and apply a state.
  const forEacher = stateId =>
  {
    // handle the application of the state- if applicable.
    this.handleApplyState(target, stateId, chance, true);
  };

  // run the logic against all the attacker's own states.
  attackerStateIds.forEach(forEacher, this);
};

/**
 * Overwrites {@link #itemEffectAddNormalState}.
 * Updates the method to be more modifyable, and considers attackers
 * when applying states.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect)
{
  // extract the data points.
  const { value1: chance, dataId: stateId } = effect;

  // handle the application of the state- if applicable.
  this.handleApplyState(target, stateId, chance, false);
};

/**
 *
 * @param {Game_Battler} target The target.
 * @param {number} stateId The id of the state being applied.
 * @param {number} chance The base chance the state will be applied.
 * @param {boolean} useAttackerStateRate Whether or not the attacker's state rate should apply.
 */
Game_Action.prototype.handleApplyState = function(target, stateId, chance, useAttackerStateRate)
{
  // check if we applied the state.
  if (this.shouldApplyState(target, stateId, chance, useAttackerStateRate))
  {
    // apply the state.
    this.applyStateEffect(target, stateId);
  }
};

/**
 * Determines whether or not the state should be applied to the target.
 * @param {Game_Battler} target The battler being afflicted with the state.
 * @param {number} stateId The id of the state being applied.
 * @param {number} baseChance The decimal base chance of applying the state.
 * @param {boolean=} useAttackerStateRate Whether or not to apply the attacker's state rate.
 * @returns {boolean} True if the state should be applied to the target, false otherwise.
 */
Game_Action.prototype.shouldApplyState = function(target, stateId, baseChance, useAttackerStateRate = false)
{
  // initialize the application modifier to 100%.
  let applicationModifier = 1.00;

  // check if we're applying the attacker's state rate against the base chance.
  if (useAttackerStateRate)
  {
    // apply the chance of success for this particular state from the attacker.
    applicationModifier *= this.subject().attackStatesRate(stateId);
  }

  // determine whether or not we should apply target resistances for this action.
  if (this.shouldTargetApplyResistances())
  {
    // apply the target's own state resistance rates against the state.
    applicationModifier *= target.stateRate(stateId);
  }

  // apply the action's luck modifier based on the two battlers.
  applicationModifier *= this.lukEffectRate(target);

  // calculate the chance.
  const calculatedChance = baseChance * applicationModifier;

  // convert the result into a rounded base-100 number.
  const d100 = Math.round(calculatedChance * 100);

  // roll d100.
  const shouldApplyState = RPGManager.chanceIn100(d100);

  // return the result.
  return shouldApplyState;
};

/**
 * Determines whether or not the direct application of a state should be
 * resisted by a target.
 *
 * The default implementation is to ignore resistances only for skills/items that
 * are of type "certain hit" in the database.
 * @returns {boolean} True if the resistances should be applied, false otherwise.
 */
Game_Action.prototype.shouldTargetApplyResistances = function()
{
  // certain hits ignore target's state application modifiers and luck impacts!
  if (this.isCertainHit()) return false;

  return true;
};

/**
 * Applies a state to a given target.
 * @param {Game_Battler} target The target having the state applied to.
 * @param {number} stateId The id of the staate being applied.
 */
Game_Action.prototype.applyStateEffect = function(target, stateId)
{
  // apply the state with the attacker.
  target.addState(stateId, this.subject());

  // flag the result as "success" of applying a state.
  this.makeSuccess(target);
};
//endregion state-related effect application
//endregion action application
//endregion Game_Action