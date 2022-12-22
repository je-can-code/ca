//region Window_SDP_Details
/**
 * Extends `.translateParameter()` to understand how to build the crit damage parameters.
 */
J.CRIT.Aliased.Window_SDP_Details.set('translateParameter', Window_SDP_Details.prototype.translateParameter);
Window_SDP_Details.prototype.translateParameter = function(longParamId)
{
  // determine "is smaller better?".
  const smallerIsBetter = this.isNegativeGood(longParamId);

  // determine if we should render a % symbol after the value.
  const isPercentValue = this.isPercentParameter(longParamId);

  // initialize values.
  let name = String.empty;
  let value = 0;
  let iconIndex = 0;

  // fork on the paramId.
  switch (longParamId)
  {
    case 28:  // the long param id.
      // build for crit damage multiplier.
      name = TextManager.critParam(0);
      value = (this.currentActor.cdm * 100).toFixed(2);
      iconIndex = IconManager.critParam(0);
      break;
    case 29:
      // build for crit damage reduction.
      name = TextManager.critParam(1);
      value = (this.currentActor.cdr * 100).toFixed(2);
      iconIndex = IconManager.critParam(1);
      break;
    default:
      // miss- fallback to default handling.
      return J.CRIT.Aliased.Window_SDP_Details.get('translateParameter').call(this, longParamId);
  }

  // return the anonymous object that i swear one day I will refactor to a proper class.
  return { name, value, iconIndex, smallerIsBetter, isPercentValue };
};

/**
 * Extends `.getIsPercentParameterIds()` to include our crit param ids as %-needing params.
 */
J.CRIT.Aliased.Window_SDP_Details
  .set('getIsPercentParameterIds', Window_SDP_Details.prototype.getIsPercentParameterIds);
Window_SDP_Details.prototype.getIsPercentParameterIds = function(paramId)
{
  // determine the original logic.
  const original = J.CRIT.Aliased.Window_SDP_Details.get('getIsPercentParameterIds').call(this, paramId);

  // define the crit parameter ids that should be decorated.
  const critParamPercentIds = [
    28,   // cdm is a percent multiplier.
    29,   // cdr is a percent reduction.
  ];

  // combine the original with our new ids.
  return original.concat(critParamPercentIds);
};
//endregion Window_SDP_Details