//region JCMS_ParameterKvp
/**
 * A class representing a single key-value pair, with an optional long id.
 * This is used for storing table-like data related to actors and skills.
 */
class JCMS_ParameterKvp
{
  constructor(name, value = null, colorId = 0)
  {
    /**
     * The name of the parameter.
     * @type {string}
     */
    this._name = name;

    /**
     * The value of the parameter.
     * @type {string|number|null}
     */
    this._value = value;

    /**
     * The id of the color for this parameter when drawing.
     * @type {number|null}
     */
    this._colorId = colorId;
  }

  /**
   * Gets the name of the parameter.
   * @returns {string}
   */
  name()
  {
    return this._name;
  }

  /**
   * Gets the value of the parameter associated with this
   * @returns
   */
  value()
  {
    return this._value;
  }

  /**
   * Gets the provided color of this parameter.
   * @returns {string}
   */
  color()
  {
    return this._colorId;
  }
}
//endregion JCMS_ParameterKvp