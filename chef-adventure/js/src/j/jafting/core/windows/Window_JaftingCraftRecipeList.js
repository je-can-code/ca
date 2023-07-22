//region Window_JaftingCraftRecipeList
/**
 * A simple window that shows a list of recipes available based on unlocked ingredients.
 */
class Window_JaftingCraftRecipeList
  extends Window_Command
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

    /**
     * The currently selected category that this recipe list is derived from.
     * @type {string}
     */
    this._currentCategory = null;
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
   * Gets the current category that the recipe list is based off of.
   * @returns {string}
   */
  get currentCategory()
  {
    return this._currentCategory;
  }

  /**
   * Sets the current category to a given category.
   */
  set currentCategory(category)
  {
    this._currentCategory = category;
    this.refresh();
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
  getRecipeDetails()
  {
    // cannot return details for null.
    if (this.currentIndex === null) return null;

    // cannot get the details for an empty list.
    if (!this._list.length) return null;

    if (this.currentIndex > this._list.length - 1)
    {
      this.currentIndex = 0;
      this.select(0);
    }

    const details = this._list[this.currentIndex].ext;
    return details;
  }

  /**
   * Creates a list of all unlocked recipes that belong to this category of crafting.
   */
  makeCommandList()
  {
    const unlockedRecipes = $gameSystem.getUnlockedRecipesByCategory(this.currentCategory);

    // don't make the list if we have no categories to draw.
    if (!unlockedRecipes.length) return;

    // create commands based on the recipe and the ingredients/tools vs player inventory.
    unlockedRecipes.forEach(recipe =>
    {
      const canCraft = recipe.canCraft();
      const name = recipe.getRecipeName();
      const iconIndex = recipe.getRecipeIconIndex();

      // determine if enabled/disabled by ingredients+tools in inventory.
      this.addCommand(name, `chosen-recipe`, canCraft, recipe, iconIndex);
    });
  }
}
//endregion Window_JaftingCraftRecipeList