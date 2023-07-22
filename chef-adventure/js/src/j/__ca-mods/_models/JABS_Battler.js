//region JABS_Battler
/**
 * Extends {@link #getTargetFrameText}.
 * If no text was provided for the target, instead autogenerate some text based on their traits.
 * The "traits" are defined by arbitrary CA-specific elements, so this can't live in the
 * target frame plugin, or the monsterpedia plugin.
 * @returns {string}
 */
J.CAMods.Aliased.JABS_Battler.set('getTargetFrameText', JABS_Battler.prototype.getTargetFrameText);
JABS_Battler.prototype.getTargetFrameText = function()
{
  // perform original logic to get the target frame text.
  const originalTargetFrameText = J.CAMods.Aliased.JABS_Battler.get('getTargetFrameText').call(this);

  // if a target frame text was provided, then just use that.
  if (originalTargetFrameText !== String.empty) return originalTargetFrameText;

  // grab the battler to extract element data from.
  const battler = this.getBattler();

  // arbitrary CA elements that define the four "xTrait" elements.
  const isArmed = battler.elementRate(21) > 1;
  const isFlying = battler.elementRate(22) > 1;
  const isShielded = battler.elementRate(23) > 1;
  const hasAura = battler.elementRate(24) > 1;

  // a quick check to see if there even are any traits.
  const hasNoTraits = !([isArmed, isFlying, isShielded, hasAura].every(trait => !!trait));

  // if we have no traits, no need to do anymore work.
  if (hasNoTraits) return String.empty;

  // initialize the traits array here.
  const traits = [];

  // check if the target has a weapon.
  if (isArmed)
  {
    traits.push("Weaponized");
  }

  // check if the target is aerial.
  if (isFlying)
  {
    traits.push("Flying");
  }

  // check if the target has shields of some sort.
  if (isShielded)
  {
    traits.push("Shielded");
  }

  // check if the target bears some kind of aura.
  if (hasAura)
  {
    traits.push("Aural");
  }

  // join all the traits together to build the target frame text.
  const text = traits.join(", ");

  // and return it.
  return text;
};
//endregion JABS_Battler