//region Window_JaftingCraftCategory
/**
 * A simple window that shows a list of categories unlocked.
 */
class Window_JaftingCraftCategory extends Window_Command
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
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * Gets the details of the currently selected category.
   * @returns {JAFTING_Category}
   */
  getCategoryDetails()
  {
    // cannot return details for null.
    if (this.currentIndex === null || !this._list.length) return null;

    const details = this._list[this.currentIndex].ext;
    return details;
  }

  /**
   * Determines whether or not there are any recipes learned for a given category.
   * @param {string} categoryKey The key of the category to check for recipes.
   * @returns {boolean}
   */
  hasRecipes(categoryKey)
  {
    const unlockedRecipes = $gameSystem.getUnlockedRecipesByCategory(categoryKey);
    const hasRecipesForCategory = unlockedRecipes.length > 0;
    return hasRecipesForCategory;
  }

  /**
   * Creates a list of all unlocked categories of crafting.
   */
  makeCommandList()
  {
    const unlockedCategories = $gameSystem.getUnlockedCategories();

    // don't make the list if we have no categories to draw.
    if (!unlockedCategories.length) return;

    unlockedCategories.forEach(category =>
    {
      const hasRecipesForCategory = this.hasRecipes(category.key);
      this.addCommand(category.name, `crafting-category`, hasRecipesForCategory, category, category.iconIndex);
    });
  }
}
//endregion Window_JaftingCraftCategory