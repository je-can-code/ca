//region StatusParameter
/**
 * The content of a single parameter being drawn in a window.
 */
class StatusParameter
{
  /**
   * The numeric value for the parameter.
   * For sp/ex parameters, this may be a decimal.
   * @type {number}
   */
  value = 0.0;

  /**
   * The "long" parameter id for this parameter.
   * @type {number}
   */
  longParamId = 0;

  /**
   * The `name` of this parameter.
   * @type {string}
   */
  name = String.empty;

  /**
   * The `iconIndex` of this parameter.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The `colorIndex` of this parameter.
   * @type {number}
   */
  colorIndex = 0;

  /**
   * Constructor.
   * @param {number} value The value of the parameter.
   * @param {boolean=} longParamId True if this should be multiplied by 100, false otherwise.
   */
  constructor(value, longParamId)
  {
    this.value = value;
    this.longParamId = longParamId;
    this.refresh();
  }

  /**
   * Initialize the properties based on the provided
   */
  refresh()
  {
    this.name = TextManager.longParam(this.longParamId);
    this.iconIndex = IconManager.longParam(this.longParamId);
    this.colorIndex = ColorManager.longParam(this.longParamId);
  }

  /**
   * Get the pretty value of this parameter.
   * @param {boolean=} withPadding True if you want zero-padding, false otherwise; defaults to false.
   * @returns {string}
   */
  prettyValue(withPadding = false)
  {
    // copy the value.
    let prettyValue = this.value;

    // subjectively, whole numbers are better than 0-1 decimal numbers.
    const needsMultiplyBy100 = [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17,     // ex-params
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
      28, 29                                    // crit params
    ];

    // check if our long param id is in this group.
    if (needsMultiplyBy100.includes(this.longParamId))
    {
      // multiply by 100 then.
      prettyValue *= 100;
    }

    // subjectively, the sp-params would look better if they were 0-based instead of 100-based.
    const needsMinusBy100 = [
      18, 19, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
    ];

    // check if our long param id is in this group.
    if (needsMinusBy100.includes(this.longParamId))
    {
      // reduce by 100 then.
      prettyValue -= 100;
    }

    // check to make sure we're using padding.
    if (withPadding && this.value)
    {
      // subjectively, the big parameters like hp and mp should have leading zeroes.
      const needs6ZeroPadding = [
        0, 1,                                     // max hp/mp
      ];

      // subjectively, the sorta big parameters like b-params, crit-params, and max tp also get zeroes.
      const needs4ZeroPadding = [
        2, 3, 4, 5, 6, 7,                         // most b-params
        19,                                       // just GRD
        28, 29,                                   // crit params
        30,                                       // max tp
      ];

      // subjectively, the sp-params (except GRD) should have fewer leading zeroes.
      const needs3ZeroPadding = [
        13, 14,                               // CNT & MRF
        18, 20, 21, 22, 23, 24, 25, 26, 27,   // sp-params
      ];

      // check if our long param id is in this group.
      if (needs6ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 6 zeroes.
        prettyValue = prettyValue.padZero(6);
      }
      // check if our long param id is in this group.
      else if (needs4ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 4 zeroes.
        prettyValue = prettyValue.padZero(4);
      }
      // check if our long param id is in this group.
      else if (needs3ZeroPadding.includes(this.longParamId))
      {
        // pad with up to 3 zeroes.
        prettyValue = prettyValue.padZero(3);
      }
    }

    let finalPrettyValue = !(Number.isInteger(prettyValue))
      ? prettyValue.toFixed(1)
      : prettyValue.toString();

    // check if we just have unused decimals.
    if (finalPrettyValue.endsWith(".0"))
    {
      // strip em off.
      finalPrettyValue = finalPrettyValue.slice(0, finalPrettyValue.length-2);
    }

    // the long param ids that should be decorated with a % symbol.
    const needsPercentSymbol = [
      9, 13, 14,                                // EVA & CNT & MRF
      20, 21, 22, 23, 24, 25, 26, 27,           // sp-params
      28, 29,                                   // crit params
    ];

    // check if our long param id is in this group.
    if (needsPercentSymbol.includes(this.longParamId))
    {
      // append with a % symbol.
      finalPrettyValue = `${finalPrettyValue}%`;
    }

    // the long param ids that should be decorated with a regen rate per second.
    const needsRegenRate = [
      15, 16, 17
    ];

    // check if our long param id is in this group.
    if (needsRegenRate.includes(this.longParamId))
    {
      // calculate the per-second rate of regen.
      let per1rate = (prettyValue / 5);

      // check if it came out to be a clean whole number or not.
      if (!Number.isInteger(per1rate))
      {
        // chop off the shit after 2 decimals.
        per1rate = per1rate.toFixed(1);
      }

      // decorate the value with the per-second rate.
      finalPrettyValue = `${per1rate}/s`;
    }

    // return the "pretty" value!
    return finalPrettyValue;
  }
}
//endregion StatusParameter