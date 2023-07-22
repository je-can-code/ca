//region TextManager
/**
 * Extends `.longParam()` to first search for our critical damage text ids.
 */
J.CRIT.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 28:
      return this.critParam(0);   // cdm
    case 29:
      return this.critParam(1);   // cdr
    default:
      // perform original logic.
      return J.CRIT.Aliased.TextManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the text for the critical damage parameters from "J-CriticalFactors".
 * @param {number} paramId The id of the crit param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.critParam = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return "Crit Amp";
    case 1:
      return "Crit Block";
  }
};
//endregion TextManager