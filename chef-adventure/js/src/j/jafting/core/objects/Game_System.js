//#region Game_System
/**
 * Extends the `Game_System.initialize()` to include the JAFTING setup.
 */
J.JAFTING.Aliased.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function()
{
  this.initJaftingMembers();
  J.JAFTING.Aliased.Game_System.initialize.call(this);
};

/**
 * Initializes the JAFTING object for tracking various things related to the system.
 */
Game_System.prototype.initJaftingMembers = function()
{
  this._j = this._j || {};
  this._j._jafting = this._j._jafting || {};

  /**
   * Whether or not the JAFTING flow is executing.
   * @type {boolean}
   */
  this._j._jafting._isJafting = false;

  /**
   * The collection of all jafting recipes extracted from the database.
   * @type {JAFTING_Recipe[]}
   */
  this._j._jafting._recipes = J.JAFTING.Metadata.Recipes;

  /**
   * The collection of all categories that are viewable within the JAFTING menu.
   * @type {JAFTING_Category[]}
   */
  this._j._jafting._categories = J.JAFTING.Metadata.Categories;

  /**
   * A request to refresh the windows of JAFTING.
   * @type {boolean}
   */
  this._j._jafting._requestRefresh = false;
};

/**
 * Summons the JAFTING menu.
 */
Game_System.prototype.startJafting = function()
{
  this._j._jafting._isJafting = true;
};

/**
 * Closes the JAFTING menu.
 */
Game_System.prototype.endJafting = function()
{
  this._j._jafting._isJafting = false;
};

/**
 * Gets whether or not the player is currently using the JAFTING menu.
 * @returns {boolean}
 */
Game_System.prototype.isJafting = function()
{
  return this._j._jafting._isJafting;
};

/**
 * Gets the category of crafting by key.
 * @param {string} key The unique identifier of a category of crafting.
 * @returns {JAFTING_Category|null}
 */
Game_System.prototype.getCategoryByKey = function(key)
{
  const result = this._j._jafting._categories.find(category => category.key === key);
  return result;
};

/**
 * Unlocks/adds a new category to the list of available categories.
 * @param {string} key The unique identifier of this category.
 */
Game_System.prototype.unlockCategory = function(key)
{
  const foundCategory = this._j._jafting._categories.find(category => category.key === key);
  if (foundCategory)
  {
    foundCategory.unlock();
    this.setRefreshRequest(true);
  }
  else
  {
    console.warn(`Attempted to unlock a category that doesn't exist in the plugin parameters.`);
    console.warn(`Please add a category with key of [${key}] to unlock it.`);
  }
};

/**
 * Unlocks all categories of JAFTING.
 */
Game_System.prototype.unlockAllCategories = function()
{
  this._j._jafting._categories.forEach(category => category.unlock());
  this.setRefreshRequest(true);
};

/**
 * Locks/removes a previously unlocked category of JAFTING.
 * @param {string} key The unique identifier of this category.
 */
Game_System.prototype.lockCategory = function(key)
{
  const foundCategory = this._j._jafting._categories.find(category => category.key === key);
  if (foundCategory)
  {
    foundCategory.lock();
    this.setRefreshRequest(true);
  }
};

/**
 * Locks all categories of JAFTING.
 */
Game_System.prototype.lockAllCategories = function()
{
  this._j._jafting._categories.forEach(category => category.lock());
  this.setRefreshRequest(true);
};

/**
 * Unlocks a recipe. Does not unlock the category this recipe belongs to.
 * @param {string} key The key of the recipe to unlock.
 */
Game_System.prototype.unlockRecipe = function(key)
{
  const foundRecipe = this._j._jafting._recipes.find(recipe => recipe.key === key);
  if (foundRecipe)
  {
    foundRecipe.unlock();
    this.setRefreshRequest(true);
  }
};

/**
 * Locks a recipe. Does not lock the category this recipe belongs to.
 * @param {string} key The key of the recipe to unlock.
 */
Game_System.prototype.lockRecipe = function(key)
{
  const foundRecipe = this._j._jafting._recipes.find(recipe => recipe.key === key);
  if (foundRecipe)
  {
    foundRecipe.lock();
    this.setRefreshRequest(true);
  }
};

/**
 * Gets all defined JAFTING recipes.
 * @returns {JAFTING_Recipe[]}
 */
Game_System.prototype.getAllRecipes = function()
{
  return this._j._jafting._recipes;
};

/**
 * Gets a list of all categories that have been unlocked.
 * @returns {JAFTING_Category[]}
 */
Game_System.prototype.getUnlockedCategories = function()
{
  return this._j._jafting._categories.filter(category => category.isUnlocked());
};

/**
 * Gets whether or not we have an outstanding request to refresh all JAFTING windows.
 * @returns {boolean} True if we need to refresh the windows, false otherwise.
 */
Game_System.prototype.isRefreshRequested = function()
{
  return this._j._jafting._requestRefresh;
};

/**
 * Issues a request to refresh all JAFTING windows.
 * @param {boolean} requested True if we need to refresh the windows, false otherwise.
 */
Game_System.prototype.setRefreshRequest = function(requested = true)
{
  this._j._jafting._requestRefresh = requested;
};

/**
 * For a recipe to be available for crafting/unlocked, the player must have
 * all outputs of a recipe unlocked.
 * @returns {JAFTING_Recipe[]}
 */
Game_System.prototype.getUnlockedRecipes = function()
{
  return this._j._jafting._recipes.filter(recipe => recipe.isUnlocked());
};

/**
 * Gets all unlocked recipes that are a part of a given category.
 * @param {string} categoryKey The category to get all unlocked recipes for.
 * @returns {JAFTING_Recipe[]}
 */
Game_System.prototype.getUnlockedRecipesByCategory = function(categoryKey)
{
  const recipes = this.getUnlockedRecipes();
  const unlocked = recipes.filter(recipe => recipe.categories.includes(categoryKey));

  return unlocked;
};

/**
 * Gets all unlocked recipes that are a part of a given category that have
 * also been crafted at least once.
 * @param {string} categoryKey The category to get all unlocked recipes for.
 * @returns {JAFTING_Recipe[]}
 */
Game_System.prototype.getCraftedRecipesByCategory = function(categoryKey)
{
  const unlocked = this.getUnlockedRecipesByCategory(categoryKey);
  if (unlocked.length)
  {
    const isAvailable = (recipe) =>
    {
      if (recipe.maskedUntilCrafted && recipe.crafted) return true;
      if (!recipe.maskedUntilCrafted) return true;
      return false;
    };
    return unlocked.filter(isAvailable);
  }
};

/**
 * Translates an unidentified RPG::Item into it's item type abbreviation.
 * @param {object} rpgItem The RPG::Item that needs it's type determined.
 * @returns {string} One of: `i`, `w`, `a` for `item`, `weapon`, `armor`.
 */
Game_System.prototype.translateRpgItemToType = function(rpgItem)
{
  if (rpgItem.itypeId)
  {
    return "i";
  }
  else if (rpgItem.wtypeId)
  {
    return "w";
  }
  else if (rpgItem.atypeId)
  {
    return "a";
  }
  else
  {
    console.error(rpgItem);
    console.error(`check the logs, there were issues translating items for recipes.`)
  }
};
//#endregion Game_System