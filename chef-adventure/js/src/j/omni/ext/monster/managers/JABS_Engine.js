//region JABS_Engine
/**
 * Processes the various on-hit effects against the target.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.set('processOnHitEffects', JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target)
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.get('processOnHitEffects').call(this, action, target);

  // check if the target is an enemy.
  if (target.isEnemy())
  {
    // observe elementalistics!
    this.processElementalisticObservations(action, target);
  }
};

/**
 * Observes all elements associated with an action against a given enemy.
 * @param {JABS_Action} action The action to observe elements for.
 * @param {JABS_Battler} target The enemy target to observe elements against.
 */
JABS_Engine.prototype.processElementalisticObservations = function(action, target)
{
  // grab the underlying skill from the action.
  const baseSkill = action.getBaseSkill();

  // the core element of the action.
  const baseElement = baseSkill.damage.elementId;

  // initialize elements collection for this action.
  const elements = [];

  // add any extra elements the action has.
  const addedElements = Game_Action.extractElementsFromAction(baseSkill);
  elements.push(...addedElements);

  // grab the caster of the action.
  const caster = action.getCaster();

  // check if the base element was "normal attack".
  if (baseElement === -1)
  {
    // pile in the attacker's elements.
    elements.push(...caster.getBattler().attackElements());
  }
  // don't add the "normal attack" element into the mix.
  else
  {
    // add the element of the skill instead.
    elements.push(baseElement);
  }

  // grab the enemy itself.
  const enemy = target.getBattler();

  // observe all of the elements against the enemy.
  elements.forEach(elementId => enemy.observeElement(elementId));
};
//endregion JABS_Engine