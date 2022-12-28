//region Sprite_Icon
/**
 * A customizable sprite that displays a single icon.
 *
 * Defaults to regular `ImageManager`'s defaults in size and columns,
 * but can be modified manually to different iconsets bitmaps and/or
 * different icon widths and heights.
 */
class Sprite_Icon extends Sprite
{
  /**
   * Initializes this sprite with the designated icon.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   */
  initialize(iconIndex = 0)
  {
    // perform original logic.
    super.initialize();

    // initialize our properties.
    this.initMembers();

    // setups up the bitmap with the default iconset via promises.
    this.setupDefaultIconsetBitmap(iconIndex);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * Whether or not the sprite is ready to be drawn yet.
     * @type {boolean}
     */
    this._j._isReady = false;

    /**
     * The icon index that this sprite represents.
     * @type {number}
     */
    this._j._iconIndex = 0;

    /**
     * The width of our icon. Defaults to the image manager's width,
     * but it can be set higher or lower for different-sized iconsheets.
     * @type {number}
     */
    this._j._iconWidth = ImageManager.iconWidth;

    /**
     * The height of our icon. Defaults to the image manager's height,
     * but it can be set higher or lower for different-sized iconsheets.
     * @type {number}
     */
    this._j._iconHeight = ImageManager.iconHeight;

    /**
     * The number of columns on the iconset we're using. Defaults to 16,
     * which was also predefined by this plugin, but is just the number
     * of columns the default iconset.png file has.
     * @type {number}
     */
    this._j._iconColumns = ImageManager.iconColumns;
  }

  /**
   * Sets up the bitmap with the default iconset.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   */
  setupDefaultIconsetBitmap(iconIndex)
  {
    // undoes the ready check flag.
    this.unReady();

    // setup a promise for when the bitmap loads.
    const bitmapPromise = ImageManager.loadBitmapPromise(`IconSet`,`img/system/`)
      .then(bitmap => this.setIconsetBitmap(bitmap))
      .catch(() =>
      {
        throw new Error('default iconset bitmap failed to load.');
      });

    // upon promise delivery, execute the rendering.
    Promise.all([bitmapPromise])
    // execute on-ready logic, such as setting the icon index of this sprite to render.
      .then(() => this.onReady(iconIndex))
  }

  /**
   * Sets the ready flag to false to prevent rendering further
   */
  unReady()
  {
    this._j._isReady = false;
  }

  /**
   * Gets whether or not this icon sprite is ready for rendering.
   * @returns {boolean}
   */
  isReady()
  {
    return this._j._isReady;
  }

  /**
   * Sets the bitmap to the designated bitmap.
   * @param {Bitmap} bitmap The base bitmap of this sprite.
   */
  setIconsetBitmap(bitmap)
  {
    this.bitmap = bitmap;
  }

  /**
   * Gets the icon index from the iconset for this sprite.
   * @returns {number}
   */
  iconIndex()
  {
    return this._j._iconIndex;
  }

  /**
   * Sets the icon index for this sprite.
   * @param {number} iconIndex The icon index this sprite should render.
   */
  setIconIndex(iconIndex)
  {
    // reassign the icon index.
    this._j._iconIndex = iconIndex;

    // if we are not ready to render, then do not.
    if (!this.isReady()) return;

    // (re)renders the sprite based on the icon index.
    this.drawIcon();
  }

  /**
   * Gets the width of this icon for this sprite.
   * @returns {number}
   */
  iconWidth()
  {
    return this._j._iconWidth;
  }

  /**
   * Sets the width of this sprite's icon.
   * @param width
   */
  setIconWidth(width)
  {
    this._j._iconWidth = width;
  }

  /**
   * Gets the height of this icon for this sprite.
   * @returns {number}
   */
  iconHeight()
  {
    return this._j._iconHeight;
  }

  /**
   * Sets the height of this sprite's icon.
   * @param height
   */
  setIconHeight(height)
  {
    this._j._iconHeight = height;
  }

  /**
   * Gets the number of columns for this sprite's iconset.
   * @returns {number}
   */
  iconColumns()
  {
    return this._j._iconColumns;
  }

  /**
   * Sets the number of columns for the sprite's iconset.
   * @param {number} columns The new number of columns in this sprite's iconset.
   */
  setIconColumns(columns)
  {
    this._j._iconColumns = columns;
  }

  /**
   * Upon becoming ready, execute this logic.
   * In this sprite's case, we render ourselves.
   * @param {number} iconIndex The icon index of this sprite.
   */
  onReady(iconIndex = 0)
  {
    // flag this sprite as being ready for rendering.
    this._j._isReady = true;

    // and also follow up with rendering an icon.
    this.setIconIndex(iconIndex);
  }

  /**
   * Sets the frame of the bitmap to be the icon we care about.
   */
  drawIcon()
  {
    // determine the universal shape of the icon and iconset.
    const iconWidth = this.iconWidth();
    const iconHeight = this.iconHeight();
    const iconsetColumns = this.iconColumns();
    const iconIndex = this.iconIndex();

    // calculate the x:y of the icon's origin based on index.
    const x = (iconIndex % iconsetColumns) * iconWidth;
    const y = Math.floor(iconIndex / iconsetColumns) * iconHeight;

    // set the frame of the bitmap to start at the x:y, and be as big as designated.
    this.setFrame(x, y, iconWidth, iconHeight);
  }
}
//endregion Sprite_Icon