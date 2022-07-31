//#region Game_Action
/**
 * OVERWRITE In the context of this `Game_Action`, for non-allies, it should
 * instead return the $dataEnemies data instead of the $gameTroop data because
 * the troop doesn't exist on the map.
 */
Game_Action.prototype.subject = function()
{
  let subject;
  if (this._subjectActorId > 0)
  {
    subject = $gameActors.actor(this._subjectActorId)
  }
  else
  {
    subject = $gameEnemies.enemy(this._subjectEnemyIndex);
  }
  return subject;
};

/**
 * OVERWRITE In the context of this `Game_Action`, overwrites the function for
 * setting the subject to reference the $dataEnemies, a new global object reference
 * for the database tab of enemies instead of referencing the troop.
 * @param {Game_Actor|Game_Enemy} subject The subject to work with.
 */
Game_Action.prototype.setSubject = function(subject)
{
  if (subject.isActor())
  {
    this._subjectActorId = subject.actorId();
    this._subjectEnemyIndex = -1;
  }
  else if (subject.isEnemy())
  {
    this._subjectEnemyIndex = subject.enemyId();
    this._subjectActorId = 0;
  }
};

/**
 * Gets the parry rate for a given battler.
 * @param {Game_Battler} target The target to check the parry rate for.
 */
Game_Action.prototype.itemPar = function(target)
{
  return (target.grd - 1).toFixed(3);
};

/**
 * Rounds the result of the damage calculations when executing skills.
 */
J.ABS.Aliased.Game_Action.makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  let base = J.ABS.Aliased.Game_Action.makeDamageValue.call(this, target, critical);

  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // currently, only the player can properly defend like this.
    base = this.handleGuardEffects(base, player);
  }

  return base;
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect)
{
  for (const stateId of this.subject().attackStates())
  {
    let chance = effect.value1;
    chance *= target.stateRate(stateId);
    chance *= this.subject()
      .attackStatesRate(stateId);
    chance *= this.lukEffectRate(target);
    if (Math.random() < chance)
    {
      target.addState(stateId, this.subject());
      this.makeSuccess(target);
    }
  }
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect)
{
  let chance = effect.value1;
  if (!this.isCertainHit())
  {
    chance *= target.stateRate(effect.dataId);
    chance *= this.lukEffectRate(target);
  }
  if (Math.random() < chance)
  {
    target.addState(effect.dataId, this.subject());
    this.makeSuccess(target);
  }
};

/**
 * Intercepts the action result and prevents adding states entirely if precise-parried
 * by the player.
 */
J.ABS.Aliased.Game_Action.itemEffectAddState = Game_Action.prototype.itemEffectAddState;
Game_Action.prototype.itemEffectAddState = function(target, effect)
{
  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // if it is the player, peek at the result before applying.
    const result = player.getBattler().result();

    // if the player precise-parried the action, no status effects applied.
    if (result.parried) return;
  }

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.itemEffectAddState.call(this, target, effect);
};

/**
 * Handles all guard-related effects, such as parrying or guarding.
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} jabsBattler The battler potentially doing guard things..
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
  modifiedDamage = this.percDamageReduction(modifiedDamage, jabsBattler);
  modifiedDamage = this.flatDamageReduction(modifiedDamage, jabsBattler);

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
 * @param {JABS_Battler} player The player's JABS battler.
 * @returns {number} The damage after reduction.
 */
Game_Action.prototype.flatDamageReduction = function(base, player)
{
  // calculate the flat reduction.
  const reduction = parseFloat(player.flatGuardReduction());

  // grab the action result for updating.
  const result = player.getBattler().result();

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
Game_Action.prototype.percDamageReduction = function(baseDamage, jabsBattler)
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

/**
 * OVERWRITE Replaces the hitrate formula with a standardized one that
 * makes it so the default is NOT to miss with half of your swings just
 * because you don't have +100% hit rate on every single skill.
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
 * OVERWRITE Alters this functionality to be determined by attacker's hit vs target's evade.
 * @param {Game_Battler} target The target of this action.
 * @returns {number}
 */
Game_Action.prototype.itemEva = function(target)
{
  switch (true)
  {
    case (this.isPhysical()):
      return target.eva;
    case (this.isMagical()):
      return target.mev;
    default:
      return 0;
  }
};

/**
 * OVERWRITE Adjusts how a skill is applied against the target in the context of JABS.
 */
J.ABS.Aliased.Game_Action.apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target)
{
  if ($jabsEngine.absEnabled)
  {
    this.applySkill(target);
  }
  else
  {
    J.ABS.Aliased.Game_Action.apply.call(this, target);
  }
};

/**
 * Applies a skill against the target.
 * This is effectively Game_Action.apply, but with some adjustments to accommodate
 * the fact that we're using this in an action battle system instead.
 *
 * "Missed" is no longer a possibility. It is false 100% of the time.
 * @param {Game_Battler} target The target the skill is being applied to.
 */
Game_Action.prototype.applySkill = function(target)
{
  const result = target.result();
  this.subject().clearResult();
  result.clear();
  result.used = this.testApply(target);
  result.evaded = !this.calculateHitSuccess(target);
  result.physical = this.isPhysical();
  result.drain = this.isDrain();
  if (result.isHit())
  {
    // check if there is a damage formula.
    if (this.item().damage.type > 0)
    {
      // determine if its a critical hit.
      result.critical = Math.random() < this.itemCri(target);

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
 * Calculates whether or not the attacker was precise enough to land the hit.
 * If this returns false, the result is that the skill was evaded.
 * @param {Game_Battler} target The target the skill is being applied to.
 * @returns {boolean}
 */
Game_Action.prototype.calculateHitSuccess = function(target)
{
  // hit rate gets a bonus between 0-1.
  const hitRate = Math.random() + this.itemHit();

  // grab the evade rate of the target based on the action.
  const evadeRate = this.itemEva(target);

  // determine the success.
  const success = (hitRate - evadeRate) > 0;

  // return our outcome.
  return success;
};
//#endregion Game_Action