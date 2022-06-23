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
    const result = player.getBattler()
      .result();
    if (result.preciseParried)
    {
      // if the player precise-parried the action, no status effects applied.
      return;
    }
  }

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.itemEffectAddState.call(this, target, effect);
};

/**
 * Reduces
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} player The player's `JABS_Battler`.
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, player)
{
  // if the player is parrying...
  if (player.parrying())
  {
    const playerBattler = player.getBattler();
    const result = playerBattler.result();

    // nullify the result via parry.
    result.parried = true;
    result.preciseParried = true;
    damage = 0;
    player.getCharacter()
      .requestAnimation(0, true, true);

    // handle tp generation from precise-parrying.
    const skillId = player.getGuardSkillId();
    if (skillId)
    {
      const skill = OverlayManager.getExtendedSkill(playerBattler, skillId);
      playerBattler.gainTp(skill.tpGain);
    }

    // reset the player's guarding.
    player.setParryWindow(0);
    player.setGuardSkillId(0);
  }

  // if the player is guarding...
  else if (player.guarding())
  {
    // reduce the damage accordingly per the guard data.
    damage = this.percDamageReduction(damage, player);
    damage = this.flatDamageReduction(damage, player);
  }

  return damage;
};

/**
 * Reduces damage of a value if defending- by a flat amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.flatDamageReduction = function(base, player)
{
  const reduction = parseFloat(player.flatGuardReduction());
  const result = player.getBattler()
    .result();
  result.reduced += reduction;
  base = Math.max((base + reduction), 0);
  return base;
};

/**
 * Reduces damage of a value if defending- by a percent amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.percDamageReduction = function(base, player)
{
  const reduction = parseFloat(base - ((100 + player.percGuardReduction()) / 100) * base);
  const result = player.getBattler()
    .result();
  result.reduced -= reduction;
  base = Math.max((base - reduction), 0);
  return base;
};

/**
 * OVERWRITE Replaces the hitrate formula with a standardized one that
 * makes it so the default is NOT to miss with half of your swings just
 * because you don't have +100% hit rate on every single skill.
 * @returns {number}
 */
Game_Action.prototype.itemHit = function()
{
  return (this.item().successRate * 0.01 * (this.subject().hit));
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
  if ($jabsEngine._absEnabled)
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
    if (this.item().damage.type > 0)
    {
      result.critical = Math.random() < this.itemCri(target);
      const value = this.makeDamageValue(target, result.critical);
      this.executeDamage(target, value);
    }

    // add the subject who is applying the state as a parameter for tracking purposes.
    this.item().effects.forEach(effect => this.applyItemEffect(target, effect));
    this.applyItemUserEffect(target);
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
  const hitRate = Math.random() + this.itemHit();
  const evadeRate = this.itemEva(target);
  const success = (hitRate - evadeRate) > 0;
  return success;
};
//#endregion Game_Action