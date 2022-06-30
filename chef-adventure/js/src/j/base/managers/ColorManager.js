//#region ColorManager
/**
 * Gets the color index from the "long" parameter id.
 *
 * "Long" parameter ids are used in the context of 0-27, rather than
 * 0-7 for param, 0-9 for xparam, and 0-9 for sparam.
 * @param {number} paramId The "long" parameter id.
 * @returns {number} The color index of the given parameter.
 */
ColorManager.longParam = function(paramId)
{
  switch (paramId)
  {
    // currently there are no special colors for parameters, but just in case...
    default:
      return 0;
  }
};
//#endregion ColorManager