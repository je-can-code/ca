//region Graphics
/**
 * The horizontal padding between {@link Graphics.width} and {@link Graphics.boxWidth}.
 * When combined with {@link Graphics.verticalPadding}, the origin x,y can be easily
 * determined.
 * @returns {number} Always positive.
 */
Object.defineProperty(Graphics, "horizontalPadding",
  {
    get: function()
    {
      return Math.abs(this.width - this.boxWidth);
    }
  });

/**
 * The vertical padding between {@link Graphics.height} and {@link Graphics.boxHeight}.
 * @returns {number} Always positive.
 */
Object.defineProperty(Graphics, "verticalPadding",
  {
    get: function()
    {
      return Math.abs(this.height - this.boxHeight);
    }
  });

/**
 * The origin x and y coordinates of the "box" width and height values.
 * @returns {[number, number]} A destructurable array of the box's ox and oy coordinates.
 */
Object.defineProperty(Graphics, "boxOrigin",
  {
    get: function()
    {
      return [this.horizontalPadding, this.verticalPadding];
    }
  });
//endregion Graphics