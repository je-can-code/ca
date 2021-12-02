/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] OTIB parameter part.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of OTIB.
 * This class represents the metadata used by OTIB that is parsed and
 * managed by the BASE plugin. This is the shape of a single parameter, and
 * typically used in bulk for OTIBs.
 * ============================================================================
 */

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
//ENDFILE