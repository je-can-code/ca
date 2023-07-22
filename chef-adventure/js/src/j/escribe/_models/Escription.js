//region Escription
/**
 * A single "describe" class which contains various data to describe this event on the map.
 */
function Escription()
{
  this.initialize(...arguments);
}
Escription.prototype = {};
Escription.prototype.constructor = Escription;

/**
 * Initializes the data about the event's describe.
 * @param {string} text The text to show on this event.
 * @param {number} iconIndex The index of the icon to show on this event.
 * @param {number} proximityTextRange The distance required for the describe text to be visible.
 * @param {number} proximityIconRange The distance required for the describe icon to be visible.
 */
Escription.prototype.initialize = function(
  text, iconIndex, proximityTextRange, proximityIconRange
)
{
  this._text = text;
  this._iconIndex = iconIndex;
  this._proximityText = proximityTextRange;
  this._proximityIcon = proximityIconRange;
};

/**
 * Gets the text associated with this describe.
 * @returns {string}
 */
Escription.prototype.text = function()
{
  return this._text;
};

/**
 * Gets the icon index associated with this describe.
 * @returns {number}
 */
Escription.prototype.iconIndex = function()
{
  return this._iconIndex;
};

/**
 * Gets the distance required for this describe text to be visible.
 * Returns -1 when there is no proximity requirement.
 * @returns {number}
 */
Escription.prototype.proximityTextRange = function()
{
  return this._proximityText;
};

/**
 * Gets the distance required for this describe icon to be visible.
 * Returns -1 when there is no proximity requirement.
 * @returns {number}
 */
Escription.prototype.proximityIconRange = function()
{
  return this._proximityIcon;
};
//endregion Escription