//region Game_Action
/**
 * Overwrites {@link #setSkill}.
 * If a caster is available to this action, then update the udnerlying skill with
 * the overlayed skill instead.
 */
J.EXTEND.Aliased.Game_Action.set('setSkill', Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setSkill').call(this, skillId);

    // stop processing.
    return;
  }

  // build the extended skill.
  const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);

  // assign the overlayed skill to the object instead.
  this._item.setObject(skillToSet);
};

/**
 * Overwrites {@link #setItemObject}.
 * If a caster is available to this action, then update the underlying item with the data.
 */
J.EXTEND.Aliased.Game_Action.set('setItemObject', Game_Action.prototype.setItemObject);
Game_Action.prototype.setItemObject = function(itemObject)
{
  // check if we are missing a caster.
  if (!this.subject())
  {
    // perform original logic.
    J.EXTEND.Aliased.Game_Action.get('setItemObject').call(this, itemObject);

    // stop processing.
    return;
  }

  // TODO: sort out how to manage this when both skills AND items come through this way.
  this._item.setObject(itemObject);
};

/**
 * Extends {@link #apply}.
 * Also applies on-hit states.
 */
J.EXTEND.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('apply').call(this, target);

  // apply our on-hit self-states if we have any.
  this.applyOnHitSelfStates();
};

/**
 * Applies all applicable on-hit self states.
 */
Game_Action.prototype.applyOnHitSelfStates = function()
{
  // apply all on-hit states to oneself.
  this.applyStates(this.subject(), this.onHitSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when this skill hits a target.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onHitSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    sources,
    J.EXTEND.RegExp.OnHitSelfState);

  // return what we found.
  return stateChances;
};

/**
 * Extends {@link #applyItemUserEffect}.
 * Also applies on-cast states.
 */
J.EXTEND.Aliased.Game_Action.set('applyItemUserEffect', Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('applyItemUserEffect').call(this, target);

  // apply our on-cast self-states if we have any.
  this.applyOnCastSelfStates();
};

/**
 * Applies all applicable on-cast self states.
 */
Game_Action.prototype.applyOnCastSelfStates = function()
{
  // apply all self-inflictable states to oneself.
  this.applyStates(this.subject(), this.onCastSelfStates());
};

/**
 * Gets all possible states that could be self-inflicted when casting this skill.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onCastSelfStates = function()
{
  // grab all the self-state sources.
  const sources = this.selfStateSources();

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  const stateChances = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    sources,
    J.EXTEND.RegExp.OnCastSelfState);

  // return what we found.
  return stateChances;
};

/**
 * All sources to derive self-applied states from.
 * @returns {(RPG_UsableItem|RPG_State)[]}
 */
Game_Action.prototype.selfStateSources = function()
{
  // define the sources for this action.
  const sources = [
    // this action itself is a source (the underlying item/skill).
    this.item(),

    // the caster's states also apply as a source.
    ...this.subject().allStates(),
  ];

  // return what we found.
  return sources;
};

/**
 * Applies the given states to the target.
 * @param target {Game_Actor|Game_Enemy} The target to apply states to.
 * @param stateChances {JABS_OnChanceEffect[]} The various states to potentially apply.
 */
Game_Action.prototype.applyStates = function(target, stateChances)
{
  if (stateChances.length)
  {
    // iterate over each of them and see if we should apply them.
    stateChances.forEach(stateChance =>
    {
      // extract the data points from the on-chance effect.
      const { shouldTrigger, skillId } = stateChance;

      // roll the dice to see if the on-chance effect applies.
      if (shouldTrigger())
      {
        // apply the given state to the caster, with the caster as the attacker.
        target.addState(skillId, this.subject());
      }
    });
  }
};
//endregion Game_Action