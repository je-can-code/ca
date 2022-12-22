//region Window_JaftingModeMenu
/**
 * The mode selection window for JAFTING.
 */
class Window_JaftingModeMenu
  extends Window_HorzCommand
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    /**
     * The currently selected index of this mode selection window.
     * @type {number}
     */
    this._currentIndex = null;
  }

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex()
  {
    return this._currentIndex;
  }

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index)
  {
    this._currentIndex = index;
  }

  /**
   * Generate commands for all modes of crafting.
   */
  makeCommandList()
  {
    const hasCategories = $gameSystem.getUnlockedCategories();
    this.addCommand(`Crafting`, `craft-mode`, hasCategories.length, null, 193);
    this.addCommand(`Freestyle`, `free-mode`, false, null, 93); // disabled till implemented.
    this.addCommand(`Cancel`, `cancel`, true, null, 90);
  }

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * Closes the entire JAFTING menu.
   */
  closeMenu()
  {
    if (!this.isClosed())
    {
      this.close();
      if (J.ABS)
      {
        $jabsEngine.absPause = false;
        $jabsEngine.requestAbsMenu = false;
      }

      $gameSystem.endJafting();
    }
  }
}
//endregion Window_JaftingModeMenu