//region Window_OmnipediaListHeader
class Window_OmnipediaListHeader extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link Window_Base.drawContent}.
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the header.
    this.drawHeader(x, y);

    // draw the detail under the header.
    const detailY = y + (lh * 1);
    this.drawDetail(x, detailY);
  }

  /**
   * Draws the header text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawHeader(x, y)
  {
    // make the font size nice and big.
    this.modFontSize(10);

    // define the text for this section.
    const headerText = `The Omnipedia`;

    // when using "center"-alignment, you center across the width of the window.
    const headerTextWidth = this.width;

    // enable italics.
    this.toggleBold(true);

    // render the headline title text.
    this.drawText(headerText, x, y, headerTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the detail text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawDetail(x, y)
  {
    // define the text for this section.
    const detailText = `Where you can find a pedia for everything.`;

    // when using "center"-alignment, you center across the width of the window.
    const detailTextWidth = this.width;

    // enable italics.
    this.toggleItalics(true);

    // render the headline title text.
    this.drawText(detailText, x, y, detailTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}
//endregion Window_OmnipediaListHeader