//region Window_JaftingCraftRecipeDetails
/**
 * The window that displays all tools, ingredients, and output from a given recipe.
 */
class Window_JaftingCraftRecipeDetails
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The recipe currently being displayed in this window.
     * @type {JAFTING_Recipe}
     */
    this._currentRecipe = null;
  }

  /**
   * Gets the current recipe being displayed.
   * @returns {JAFTING_Recipe}
   */
  get currentRecipe()
  {
    return this._currentRecipe;
  }

  /**
   * Sets the current recipe to be this recipe.
   * @param {JAFTING_Recipe} recipe The recipe to assign as the current.
   */
  set currentRecipe(recipe)
  {
    this._currentRecipe = recipe;
    this.refresh();
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no recipe to refresh the contents of.
    if (!this.currentRecipe) return;

    this.contents.clear();
    this.drawRecipeInfo();
  }

  /**
   * Draws the recipe details of the currently selected recipe.
   */
  drawRecipeInfo()
  {
    this.drawRecipeTitle();
    this.drawRecipeIngredients();
    this.drawRecipeTools();
    this.drawRecipeOutput();
  }

  /**
   * Draws the title of the recipe.
   */
  drawRecipeTitle()
  {
    const recipe = this.currentRecipe;
    const iconIndex = this.currentRecipe.getRecipeIconIndex();
    const lh = this.lineHeight();
    this.drawTextEx(`\\{\\I[${iconIndex}] \\C[6]${recipe.getRecipeName()}\\C[0]\\}`, 0, lh * 0, 300);
  }

  /**
   * Draw all ingredients for the recipe.
   */
  drawRecipeIngredients()
  {
    const recipe = this.currentRecipe;
    const {ingredients} = recipe;
    const ox = 30;
    const lh = this.lineHeight();
    this.drawTextEx(`\\C[1]Ingredients\\C[0]`, ox, lh * 2, 300);
    ingredients.forEach((ingredient, index) =>
    {
      const rpgItem = J.BASE.Helpers.translateItem(ingredient.id, ingredient.type);
      const x = ox + 40;
      const y = lh * (3 + (index));
      const need = ingredient.count;
      const have = $gameParty.numItems(rpgItem);
      this.drawRecipeIngredientCount(need, have, x - 60, y);
      this.drawRecipeItemName(rpgItem, x + 40, y);
    });
  }

  /**
   * Draws a single recipe and it's required count vs how many the player has on-hand.
   * @param {number} need The number of this ingredient that is needed.
   * @param {number} have The number of this ingredient that the player has currently.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeIngredientCount(need, have, x, y)
  {
    const haveTextColor = (have >= need) ? 24 : 18;
    this.drawTextEx(`\\C[${haveTextColor}]${have}\\C[0]`, x, y, 100);
    this.drawTextEx(`/`, x + 35, y, 100);
    this.drawTextEx(`${need}`, x + 55, y, 100);
  }

  /**
   * Draw all tools for the recipe.
   */
  drawRecipeTools()
  {
    const recipe = this.currentRecipe;
    const {tools} = recipe;
    const ox = 430;
    const lh = this.lineHeight();
    this.drawTextEx(`\\C[1]Tools Required\\C[0]`, ox, lh * 2, 300);
    tools.forEach((tool, index) =>
    {
      const rpgItem = J.BASE.Helpers.translateItem(tool.id, tool.type);
      const x = ox + 40;
      const y = lh * (3 + (index));
      const available = $gameParty.numItems(rpgItem);
      this.drawRecipeToolAvailability(available, x - 40, y);
      this.drawRecipeItemName(rpgItem, x, y);
    });
  }

  /**
   * Draws a symbol representing whether or not the tool is in the player's possession.
   * @param {boolean} available
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeToolAvailability(available, x, y)
  {
    const availableTextColor = available ? 24 : 18;
    const symbol = available ? " ✔" : "❌";
    this.drawTextEx(`\\C[${availableTextColor}]${symbol}\\C[0]`, x, y, 50);
  }

  /**
   * Draws the name of a given ingredient.
   * @param {object} rpgItem The underlying item that needs drawing.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeItemName(rpgItem, x, y)
  {
    this.drawTextEx(`\\I[${rpgItem.iconIndex}]${rpgItem.name}`, x, y, 300);
  }

  /**
   * Draw all output for the recipe.
   */
  drawRecipeOutput()
  {
    const recipe = this.currentRecipe;
    const outputs = recipe.output;
    const lh = this.lineHeight();
    const ox = 430;
    this.drawTextEx(`\\C[1]Recipe Output\\C[0]`, ox, lh * 8, 300);
    outputs.forEach((component, index) =>
    {
      const {count} = component;
      const rpgItem = component.getItem();
      const y = lh * (9 + (index));
      this.drawRecipeOutputItem(rpgItem, count, ox, y);
    });
  }

  /**
   * Draws one output item and it's yield.
   * @param {object} rpgItem The underlying item that needs drawing.
   * @param {number} count The number of items that this output yields.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeOutputItem(rpgItem, count, x, y)
  {
    const paddedCount = count.padZero(2);
    const itemCount = ($gameParty.numItems(rpgItem)).padZero(2);
    const itemNumbers = `${paddedCount}x / (x${itemCount})`
    let {name} = rpgItem;
    if (this.currentRecipe.maskedUntilCrafted && !this.currentRecipe.hasBeenCrafted())
    {
      name = name.replace(/[A-Za-z!-?.]/ig, "?");
    }
    this.drawTextEx(`${itemNumbers}x \\I[${rpgItem.iconIndex}]${name}`, x, y, 300);
  }
}
//endregion Window_JaftingCraftRecipeDetails