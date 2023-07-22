//region IconManager
/**
 * Extend `.longParam()` to first search for our critical damage icon indices.
 */
J.CRIT.Aliased.IconManager.set('longParam', IconManager.longParam)
IconManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 28:
      return this.critParam(0);   // cdm
    case 29:
      return this.critParam(1);   // cdr
    default:
      return J.CRIT.Aliased.IconManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the icon index for the critical damager parameters from "J-CriticalFactors".
 * @param {number} paramId The id of the crit param to get an icon index for.
 * @returns {number} The icon index of the parameter.
 */
IconManager.critParam = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return 976;    // cdm
    case 1:
      return 977;    // cdr
  }
};
//endregion IconManager