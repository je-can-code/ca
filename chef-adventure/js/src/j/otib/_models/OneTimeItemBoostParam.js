//region OneTimeItemBoostParam
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoostParam()
{
  this.initialize(...arguments);
}

OneTimeItemBoostParam.prototype = {};
OneTimeItemBoostParam.prototype.constructor = OneTimeItemBoostParam;
OneTimeItemBoostParam.prototype.initialize = function(paramId, boost, isPercent)
{
  /**
   * The parameter id this parameter boost represents.
   * @type {number}
   */
  this.paramId = paramId;

  /**
   * The value of the parameter boost.
   * @type {number}
   */
  this.boost = boost;

  /**
   * Whether or not this boost is a multiplicative parameter boost or not.
   * @type {boolean}
   */
  this.isPercent = isPercent;
};
//endregion OneTimeItemBoostParam