//region Game_Action
/**
 * Scales damaged dealt and received to be based on level differences.
 */
J.LEVEL.Aliased.Game_Action.set('makeDamageValue', Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  // get the base damage that would've been done.
  const baseDamage = J.LEVEL.Aliased.Game_Action.get('makeDamageValue').call(this, target, critical);

  // get the multiplier based on target and user levels.
  const multiplier = LevelScaling.multiplier(this.subject().level, target.level);

  // return the product of these two values.
  return (baseDamage * multiplier);
}
//endregion Game_Action