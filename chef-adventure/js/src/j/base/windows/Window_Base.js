//#region Window_Base
/**
 * Draws a horizontal "line" with the given parameters.
 *
 * The origin coordinate is always the upper left corner.
 * @param {number} x The x coordinate of the line.
 * @param {number} y The y coordinate of the line.
 * @param {number} width The width in pixels of the line.
 * @param {number=} height The height in pixels of the line; defaults to 2.
 */
Window_Base.prototype.drawHorizontalLine = function(x, y, width, height = 2)
{
  this.drawRect(x, y, width, height);
};

/**
 * Draws a vertical "line" with the given parameters.
 *
 * The origin coordinate is always the upper left corner.
 * @param {number} x The x coordinate of the line.
 * @param {number} y The y coordinate of the line.
 * @param {number} height The height in pixels of the line.
 * @param {number=} width The width in pixels of the line; defaults to 2.
 */
Window_Base.prototype.drawVerticalLine = function(x, y, height, width = 2)
{
  this.drawRect(x, y, width, height);
};
//#endregion Window_Base