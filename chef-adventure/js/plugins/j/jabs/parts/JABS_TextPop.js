/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Pop-up data structure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class represents the data structure of the popups used throughout JABS.
 * ============================================================================
 */

/**
 * The necessary data to construct a text popup on the map.
 */
class JABS_TextPop {
  /**
   * @constructor
   * @param {Game_ActionResult} baseActionResult The base action result.
   * @param {number} icon The icon to display alongside this popup.
   * @param {number} textColor The text color.
   * @param {boolean} isWeakness Whether or not this was weakness empowered.
   * @param {boolean} isStrength Whether or not this was strength reduced.
   * @param {string} type The type of popup this is.
   * @param {string} directValue If applicable, a direct value to popup.
   */
  constructor(
    baseActionResult,
    icon,
    textColor,
    isWeakness,
    isStrength,
    type,
    directValue = "") {
      /**
       * The base `Game_ActionResult` for this `JABS_TextPop`.
       * @type {Game_ActionResult} 
       */
      this._baseActionResult = baseActionResult;

      /**
       * The id of the icon to display alongside this `JABS_TextPop`.
       * @type {number} 
       */
      this._icon = icon;

      /**
       * The text color.
       * @type {number} 
       */
      this._textColor = textColor;

      /**
       * Whether or not this popup was multiplied by elemental weaknesses.
       * @type {boolean} 
       */
      this._isWeakness = isWeakness;

      /**
       * Whether or not this popup was reduced by elemental strengths.
       * @type {boolean} 
       */
      this._isStrength = isStrength;

      /**
       * The type of popup this is, such as damage, experience, loot, etc.
       * @type {string}
       */
      this._type = type;

      /**
       * The direct value to display. 
       * For use with non-battle-calculated popups.
       * @type {string}
       */
      this._directValue = directValue;
  }

  /**
   * Gets the base action result for the popup.
   * @returns {Game_ActionResult}
   */
  getBaseActionResult = () => this._baseActionResult;

  /**
   * Gets the icon id for the popup.
   * @returns {number}
   */
  getIcon = () => this._icon;

  /**
   * Gets the text color for the popup.
   * @returns {number}
   */
  getTextColor = () => this._textColor;

  /**
   * Gets the boolean for if this hit a weak spot.
   * @returns {boolean}
   */
  getIsWeakness = () => this._isWeakness;

  /**
   * Gets the boolean for if this was elementally resisted.
   * @returns {boolean}
   */
  getIsStrength = () => this._isStrength;

  /**
   * Gets the type of popup this is.
   * @returns {string}
   */
  getType = () => this._type;

  /**
   * Gets the direct value assigned to this popup.
   * @returns {string}
   */
  getDirectValue = () => this._directValue;
};
//ENDFILE