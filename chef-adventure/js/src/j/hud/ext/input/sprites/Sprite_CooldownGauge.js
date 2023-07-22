/**
 * A simple calculated gauge representing the current cooldown of an action.
 * While the skill is ready, this gauge is invisible.
 */
class Sprite_CooldownGauge extends Sprite
{
  constructor(cooldownData)
  {
    // perform original logic with no bitmap.
    super();

    // initialize with the cooldown data.
    this.initMembers();

    // initialize the bitmap for the gauge.
    this.createBitmap();

    // sets up this gauge with the cooldown data.
    this.setup(cooldownData);
  }

  //region properties
  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j = {
      /**
       * The cooldown data this gauge is associated with.
       * @type {JABS_Cooldown|null}
       */
      _cooldownData: null,

      /**
       * The current value of the gauge.
       * @type {number}
       */
      _valueCurrent: 0,

      /**
       * The maximum value of the gauge.
       * @type {number}
       */
      _valueMax: 0,
    };
  }

  /**
   * Gets whether or not this gauge has a max value currently.
   * @returns {boolean}
   */
  isMaxUnassigned()
  {
    return this._j._valueMax === 0;
  }

  /**
   * Gets the cooldown data associated with this gauge.
   * @returns {JABS_Cooldown}
   */
  cooldownData()
  {
    return this._j._cooldownData;
  }

  /**
   * Sets the cooldown data associated with this gauge.
   * @param {JABS_Cooldown} cooldownData The new cooldown data to set.
   */
  setCooldownData(cooldownData)
  {
    this._j._cooldownData = cooldownData;
  }

  /**
   * Gets the current value for this gauge.
   * @returns {number}
   */
  currentValue()
  {
    return this.cooldownData().frames;
  }

  /**
   * Gets the max value for this gauge.
   * @returns {number}
   */
  maxValue()
  {
    return this._j._valueMax;
  }

  /**
   * Sets the max value for this gauge.
   * @param {number} maxValue The max value to set.
   */
  setMaxValue(maxValue)
  {
    this._j._valueMax = maxValue;
  }

  /**
   * The width of the bitmap.
   */
  bitmapWidth()
  {
    return 32;
  }

  /**
   * The height of the bitmap.
   */
  bitmapHeight()
  {
    return 20;
  }

  /**
   * The height of this gauge.
   */
  gaugeHeight()
  {
    return 10;
  }

  /**
   * The color to gradient from.
   * Defaults to blue.
   * @returns {string}
   */
  gaugeColor1()
  {
    return "rgba(0, 0, 255, 1)";
  }

  /**
   * The color to gradient into.
   * Defaults to green.
   * @returns {string}
   */
  gaugeColor2()
  {
    return "rgba(0, 255, 0, 1)";
  }

  /**
   * The backdrop color.
   * Defaults to black with 50% opacity.
   * @returns {string}
   */
  gaugeBackColor()
  {
    return "rgba(0, 0, 0, 0.5)";
  }

  /**
   * The percent/decimal representing how full this gauge is currently is.
   * @returns {number} A number between 0 and 1.
   */
  gaugeRate()
  {
    // the rate is always zero if we don't have anything assigned.
    if (this.isMaxUnassigned()) return 0;

    const value = this.currentValue();
    const maxValue = this.maxValue();
    const rate = maxValue > 0
      ? value / maxValue
      : 0;

    const parsedRate = parseFloat(rate.toFixed(3));

    return parsedRate;
  }
  //endregion properties

  /**
   * Sets up the gauge based on the cooldown data.
   * @param {JABS_Cooldown} cooldownData The cooldown data for this gauge.
   */
  setup(cooldownData)
  {
    this.setCooldownData(cooldownData);
  }

  /**
   * Generates the bitmap for this gauge.
   */
  createBitmap()
  {
    this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  }

  /**
   * Disables the gauge and makes it invisible.
   */
  disableGauge()
  {
    // zero the max value.
    this.setMaxValue(0);

    // make the sprite invisible.
    this.bitmap.paintOpacity = 0;
  }

  /**
   * Enables the gauge and sets the max value to whatever the cooldown dictates.
   * If the gauge was previously invisible, it will be made visible.
   */
  enableGauge()
  {
    // extract the frames from the cooldown data.
    const { frames } = this.cooldownData();

    // set the new max value.
    this.setMaxValue(frames);

    // make the sprite visible.
    this.bitmap.paintOpacity = 255;
  }

  /**
   * Extends {@link Sprite.update}.
   * Also updates the drawing of this gauge.
   */
  update()
  {
    // perform original logic.
    super.update();

    // if we cannot update, do not try to draw the gauge.
    if (!this.canUpdate()) return;

    // handle readiness of the combo.
    this.handleActionReadiness();

    // draw the gauge.
    this.redraw();
  }

  /**
   * Whether or not this gauge can be updated.
   * @returns {boolean} True if this gauge can be updated, false otherwise.
   */
  canUpdate()
  {
    // if we do not have a current value, do not update.
    if (Number.isNaN(this.currentValue())) return false;

    return true;
  }

  /**
   * Handles the visibility of the gauge.
   */
  handleActionReadiness()
  {
    // grab the cooldown for this gauge.
    const cooldown = this.cooldownData();

    // check if the combo is ready and we have no max.
    if (cooldown.isComboReady() && this.isMaxUnassigned())
    {
      // enable the gauge with its values.
      this.enableGauge();
    }

    // check if the cooldown's base is ready.
    if (cooldown.isBaseReady())
    {
      // clear the gauge when the base is ready.
      this.disableGauge();
    }
  }

  /**
   * Clears the bitmap to redraw the gauge anew.
   */
  redraw()
  {
    // clear the rendering.
    this.bitmap.clear();

    // draw the gauge.
    this.drawGauge();
  }

  /**
   * Draws this gauge.
   */
  drawGauge()
  {
    // define the origin point of this gauge.
    const x = 0;
    const y = this.bitmapHeight() - this.gaugeHeight();

    // define the size of this gauge.
    const w = this.bitmapWidth() - x;
    const h = this.gaugeHeight();

    // draw the gauge with the given parameters.
    this.drawGaugeRect(x, y, w, h);
  }

  /**
   * Actually draws the gauge based on the given parameters.
   * @param {number} x The x of the origin for this gauge.
   * @param {number} y The y of the origin for this gauge.
   * @param {number} w The width of the gauge.
   * @param {number} h The height of this gauge.
   */
  drawGaugeRect(x, y, w, h)
  {
    // determine the percent/decimal amount of how filled the gauge is.
    const rate = this.gaugeRate();

    // calculate the width of the filled portion of the gauge lesser the borders.
    const fillW = Math.floor((w - 2) * rate);

    // calculate the height of the filled portion of the gauge lesser the borders.
    const fillH = h - 2;

    // render the backdrop of the gauge.
    this.bitmap.fillRect(x, y, w, h, this.gaugeBackColor());

    // calculate the bordered x,y coordinates.
    const [borderedX, borderedY] = [x + 1, y + 1];

    // render the filled portion of the gauge onto the bitmap.
    this.bitmap.gradientFillRect(
      borderedX,            // the x including borders.
      borderedY,            // the y including borders.
      fillW,                // the width to fill.
      fillH,                // the hieght to fill.
      this.gaugeColor1(),   // the color gradient to start with.
      this.gaugeColor2());  // the color gradient to end with.
  }
}