//region SDP_Parameter
/**
 * A class that represents a single parameter and its growth for a SDP.
 */
function PanelParameter()
{
  this.initialize(...arguments);
}
PanelParameter.prototype = {};
PanelParameter.prototype.constructor = PanelParameter;

/**
 * Initializes a single panel parameter.
 * @param {number} parameterId The parameter this class represents.
 * @param {number} perRank The amount per rank this parameter gives.
 * @param {boolean} isFlat True if it is flat growth, false if it is percent growth.
 * @param {boolean} isCore True if this is a core parameter, false otherwise.
 */
PanelParameter.prototype.initialize = function({
  parameterId,
  perRank,
  isFlat = false,
  isCore = false,})
{
  /**
   * The id of the parameter this class represents.
   * @type {number}
   */
  this.parameterId = parameterId;

  /**
   * The amount per rank this parameter gives.
   * @type {number}
   */
  this.perRank = perRank;

  /**
   * Whether or not the growth per rank for this parameter is flat or percent.
   * @type {boolean} True if it is flat growth, false if it is percent growth.
   */
  this.isFlat = isFlat;

  /**
   * Whether or not this is a core parameter.
   * Core parameters are emphasized on the SDP scene.
   * @type {boolean} True if it is a core parameter, false otherwise.
   */
  this.isCore = isCore;
};
//endregion SDP_Parameter