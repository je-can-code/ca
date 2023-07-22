//region Window_Base
/**
 * All alignments available for {@link Window_Base.prototype.drawText}.
 */
Window_Base.TextAlignments = {
  /**
   * The "left" text alignment.
   * This is the default and not normally required to be set.
   */
  Left: "left",

  /**
   * The "center" text alignment.
   * This requires the full width of the area attempting to be centered within
   * be provided (such as the whole window's width).
   */
  Center: "center",

  /**
   * The "right" text alignment.
   * It is encouraged to use {@link Window_Base.prototype.textWidth} to define the
   * width parameter in order to properly right-align.
   */
  Right: "right"
};

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

/**
 * Clears the bitmaps associated with the window if available.
 */
Window_Base.prototype.clearContent = function()
{
  // check if we have a bitmap to clear.
  if (this.contents)
  {
    // clear it.
    this.contents.clear();
  }

  // check if we have a background to clear.
  if (this.contentsBack)
  {
    // clear it, too.
    this.contentsBack.clear();
  }
};

/**
 * Refreshes the window by clearing its bitmaps and redrawing the content.
 */
Window_Base.prototype.refresh = function()
{
  // clears the existing bitmaps' content.
  this.clearContent();

  // redraws all the content.
  this.drawContent();
};

/**
 * Draws the content of this window.
 */
Window_Base.prototype.drawContent = function()
{
  // implement.
};

/**
 * Extends {@link Window_Base.resetFontSettings}.
 * Also resets bold and italics.
 */
J.BASE.Aliased.Window_Base.set('resetFontSettings', Window_Base.prototype.resetFontSettings);
Window_Base.prototype.resetFontSettings = function()
{
  // perform original logic.
  J.BASE.Aliased.Window_Base.get('resetFontSettings').call(this);

  // also reset the italics/bold back to false.
  this.resetFontFormatting();
};

/**
 * Resets bold and italics for this bitmap.
 */
Window_Base.prototype.resetFontFormatting = function()
{
  this.contents.fontItalic = false;
  this.contents.fontBold = false;
};

/**
 * Gets the minimum font size.
 * @returns {number}
 */
Window_Base.prototype.minimumFontSize = function()
{
  return 8;
};

/**
 * Gets the maximum font size.
 * @returns {number}
 */
Window_Base.prototype.maximumFontSize = function()
{
  return 96;
};

/**
 * Clamps a font size value to fit within the min and max font size.
 * @param {number} fontSize The font size to normalize.
 * @returns {number}
 */
Window_Base.prototype.normalizeFontSize = function(fontSize)
{
  // calculate the projected font size.
  let projectedFontSize = fontSize;

  // clamp our minimum value.
  projectedFontSize = Math.max(this.minimumFontSize(), projectedFontSize);

  // clamp our maximum value.
  projectedFontSize = Math.min(this.maximumFontSize(), projectedFontSize);

  // return our acceptale font size value.
  return projectedFontSize;
};

/**
 * Modify the font size by a given amount.
 * Will clamp the value between the min and max font sizes.
 * @param {number} amount The amount to add to the font size to change it.
 */
Window_Base.prototype.modFontSize = function(amount)
{
  // calculate the projected font size.
  const projectedFontSize = this.contents.fontSize + amount;

  // normalize the font size.
  const normalizedFontSize = this.normalizeFontSize(projectedFontSize);

  // assign the projected size as the real size.
  this.contents.fontSize = normalizedFontSize;
};

/**
 * Sets the font size to a given amount.
 * Will clamp the value between the min and max font sizes.
 * @param {number} fontSize The new potential font size to change it to.
 */
Window_Base.prototype.setFontSize = function(fontSize)
{
  // calculate the projected font size.
  const projectedFontSize = fontSize;

  // normalize the font size.
  const normalizedFontSize = this.normalizeFontSize(projectedFontSize);

  // set the font size to the new size.
  this.contents.fontSize = normalizedFontSize;
};

/**
 * Renders a "background" of a given rectangle.
 * This is centralized for all windows to leverage if necessary.
 * @param {Rectangle} rect The rectangle representing the background shape to render.
 */
Window_Base.prototype.drawBackgroundRect = function(rect)
{
  // grab the color gradient for the background.
  const color1 = ColorManager.itemBackColor1();
  const color2 = ColorManager.itemBackColor2();

  // extract the data from the rectangle.
  const { x, y, width, height } = rect;

  // render the background.
  this.contentsBack.gradientFillRect(x, y, width, height, color1, color2, true);
  this.contentsBack.strokeRect(x, y, width, height, color1);
};
//endregion Window_Base