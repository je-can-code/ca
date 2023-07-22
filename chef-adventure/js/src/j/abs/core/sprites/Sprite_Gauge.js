//region Sprite_Gauge
/**
 * Due to JABS' slip effects, we have fractional hp/mp/tp values.
 * This rounds up the values for the sprite gauge if they are a number.
 */
J.ABS.Aliased.Sprite_Gauge.set('currentValue', Sprite_Gauge.prototype.currentValue);
Sprite_Gauge.prototype.currentValue = function()
{
  // perform original logic.
  const base = J.ABS.Aliased.Sprite_Gauge.get('currentValue').call(this);

  // if we somehow ended up with NaN, then just let them deal with it.
  if (isNaN(base)) return base;

  // return the rounded-up amount.
  return Math.ceil(base);
};
//endregion Sprite_Gauge