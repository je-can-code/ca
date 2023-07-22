/**
 * A window containing the difficulty points information.
 */
class Window_DifficultyPoints extends Window_Base
{
  /**
   * The difficulty layer that the cursor is currently hovering over.
   * @type {DifficultyLayer|null}
   */
  #hoveredDifficulty = null;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    // execute parent constructor.
    super(rect);
  }

  /**
   * Get the currently hovered difficulty from the list window.
   * @returns {DifficultyLayer}
   */
  getHoveredDifficulty()
  {
    return this.#hoveredDifficulty;
  }

  /**
   * Set the currently hovered difficulty used by this window.
   * @param {DifficultyLayer} difficulty The difficulty currently hovered.
   */
  setHoveredDifficulty(difficulty)
  {
    this.#hoveredDifficulty = difficulty;
  }

  /**
   * Implements {@link Window_Base.drawContent}.
   * Draws the various data points surrounding the difficulty layer points
   * and how they are affected by the difficulty layer currently being
   * hovered over by the player.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    this.drawHeader(x, y);

    // draw the max.
    const maxLayerY = y + (lh * 1);
    this.drawMaxLayerPoints(x, maxLayerY);

    // draw the current.
    const currentLayerX = x + 200;
    const currentLayerY = y + (lh * 1);
    this.drawCurrentLayerPoints(currentLayerX, currentLayerY);

    // draw the difficulty's modifier.
    const layerModifierX = x + 250;
    const layerModifierY = y + (lh * 1);
    this.drawLayerModifier(layerModifierX, layerModifierY);
  }

  /**
   * Renders the header for the difficulty layer points available to the player.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawHeader(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(10);

    // enable italics.
    this.toggleItalics(true);

    // TODO: parameterize this.
    // render the icon representing difficulty layers.
    this.drawIcon(2564, x, y);

    // modify the x by the width of an icon with some padding.
    const modX = x + ImageManager.iconWidth + 4;

    // modify the y by an arbitrary small amount to align better with the icon.
    const modY = y - 2;

    // render the headline title text.
    this.drawText(`Difficulty Layer Points`, modX, modY, 300, "left");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the maximum amount of layer points the player has available.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawMaxLayerPoints(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(-4);

    // grab the max.
    const layerPointMax = $gameSystem.getLayerPointMax();

    // enable bold.
    this.toggleBold(true);

    // draw the layer point maximum.
    this.drawText(`Max:`, x, y, 100, "left");

    // disable bold.
    this.toggleBold(false);

    // draw the layer point maximum.
    this.drawText(`${layerPointMax}`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the currently applied layer points.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawCurrentLayerPoints(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(-4);

    // grab the current points.
    const layerPointsCurrent = $gameSystem.getLayerPoints();

    // enable bold.
    this.toggleBold(true);

    // draw the layer point maximum.
    this.drawText(`Applied:`, x, y, 100, "left");

    // disable bold.
    this.toggleBold(false);

    // draw the layer point maximum.
    this.drawText(`${layerPointsCurrent}`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the modifer against the current amount of applied layer points.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawLayerModifier(x, y)
  {
    // get the layer the player is hovering over.
    const difficulty = this.getHoveredDifficulty();

    // if we have no difficulty being hovered, then do not render.
    if (!difficulty) return;

    // don't render for the applied or efault layers.
    if (difficulty.isAppliedLayer() || difficulty.isDefaultLayer()) return;

    // reset any lingering font settings.
    this.resetFontSettings();

    // grab the difficulty layer cost.
    const layerCost = difficulty.cost;

    // default the sign to nothing.
    let sign = String.empty;

    // default the color to white like normal.
    let costColorIndex = 0;

    // check if the cost is a positive amount.
    if (layerCost > 0)
    {
      // change the sign to a plus.
      sign = "+";

      if (layerCost + $gameSystem.getLayerPoints() > $gameSystem.getLayerPointMax())
      {
        // to big, red!
        costColorIndex = 10;
      }
      else
      {
        // an increase.
        costColorIndex = 20;
      }
    }

    // make the font size nice and big.
    this.modFontSize(-4);

    // change the color for the current amounts accordingly.
    this.changeTextColor(ColorManager.textColor(costColorIndex));

    // draw the layer point modifier of this layer.
    this.drawText(`(${sign}${layerCost})`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}