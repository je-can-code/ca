//#region Game_Action
/**
 * Basically replaces `setSkill()` with setting the skill to instead set our extended skill.
 */
J.EXTEND.Aliased.Game_Action.set('setSkill', Game_Action.prototype.setSkill);
Game_Action.prototype.setSkill = function(skillId)
{
  if (!this.subject())
  {
    J.EXTEND.Aliased.Game_Action.get('setSkill').call(this, skillId);
    return;
  }

  // assign the overlayed skill to the object instead.
  const skillToSet = OverlayManager.getExtendedSkill(this.subject(), skillId);
  this._item.setObject(skillToSet);
};

/**
 * Basically replaces `setItemObject()` with setting the skill to instead set our extended skill.
 */
J.EXTEND.Aliased.Game_Action.set('setItemObject', Game_Action.prototype.setItemObject);
Game_Action.prototype.setItemObject = function(itemObject)
{
  if (!this.subject())
  {
    J.EXTEND.Aliased.Game_Action.get('setItemObject').call(this, itemObject);
    return;
  }

  // TODO: sort out how to manage this when both skills AND items come through this way.
  this._item.setObject(itemObject);
};

/**
 * Extends `apply()` to include applying states to one-self.
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
 * Gets all possible states that could be self-inflicted
 * when this skill hits a target.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onHitSelfStates = function()
{
  const sources = [];

  // get the skill and its overlays.
  sources.push(this.item());

  if (J.PASSIVE)
  {
    sources.push(...this.subject().allStates());
  }

  const structure = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
  const stateChances = [];

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  sources.forEach(obj =>
  {
    const chances = J.BASE.Helpers.parseSkillChance(structure, obj);
    stateChances.push(...chances);
  });

  return stateChances;
};

/**
 * Extends the `applyItemUserEffect()` function with additional on-cast effects.
 */
J.EXTEND.Aliased.Game_Action.set('applyItemUserEffect', Game_Action.prototype.applyItemUserEffect);
Game_Action.prototype.applyItemUserEffect = function(target)
{
  // perform original logic.
  J.EXTEND.Aliased.Game_Action.get('applyItemUserEffect').call(this, target);

  // ABS engines handle the timing differently, but in turn-based this would be fine.
  if (J.ABS) return;

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
 * Gets all possible states that could be self-inflicted
 * when casting this skill.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Action.prototype.onCastSelfStates = function()
{
  const sources = [];

  // get the skill and its overlays.
  sources.push(this.item());

  if (J.PASSIVE)
  {
    sources.push(...this.subject().allStates());
  }

  const structure = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
  const stateChances = [];

  // get all "skill chances" aka "chance to inflict a state" on oneself.
  sources.forEach(obj =>
  {
    const chances = J.BASE.Helpers.parseSkillChance(structure, obj);
    stateChances.push(...chances);
  });

  return stateChances;
};

/**
 * Applies the given states to the target.
 * @param target {Game_Actor|Game_Enemy} The targe to apply states to.
 * @param stateChances {JABS_OnChanceEffect[]} The various states to potentially apply.
 */
Game_Action.prototype.applyStates = function(target, stateChances)
{
  if (stateChances.length)
  {
    // iterate over each of them and see if we should apply them.
    stateChances.forEach(stateChance =>
    {
      // if the RNG favors this caster...
      if (stateChance.shouldTrigger())
      {
        // ...then we apply the given state.
        target.addState(stateChance.skillId);
      }
    });
  }
};
//#endregion Game_Action