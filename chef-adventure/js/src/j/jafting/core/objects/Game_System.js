//region Game_System
/**
 * Extends the `Game_System.initialize()` to include the JAFTING setup.
 */
J.JAFTING.Aliased.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.JAFTING.Aliased.Game_System.initialize.call(this);

  // initialize the members.
  this.initJaftingMembers();
};

/**
 * Initializes the JAFTING object for tracking various things related to the system.
 */
Game_System.prototype.initJaftingMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the JAFTING system.
   */
  this._j._jafting ||= {};

  /**
   * Whether or not the JAFTING flow is executing.
   * @type {boolean}
   */
  this._j._jafting._isJafting = false;

  /**
   * The collection of all jafting recipes extracted from the database.
   * @type {JAFTING_Recipe[]}
   */
  this._j._jafting._recipes = J.JAFTING.Helpers.translateRecipes(J.JAFTING.PluginParameters['JAFTINGrecipes']);

  /**
   * The collection of all categories that are viewable within the JAFTING menu.
   * @type {JAFTING_Category[]}
   */
  this._j._jafting._categories = J.JAFTING.Helpers.translateCategories(J.JAFTING.PluginParameters['JAFTINGcategories']);

  /**
   * A request to refresh the windows of JAFTING.
   * @type {boolean}
   */
  this._j._jafting._requestRefresh = false;
};

/**
 * Updates the list of all available JAFTING recipes from the latest plugin metadata.
 */
J.JAFTING.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.JAFTING.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the recipes from the latest plugin metadata.
  this.updateRecipesFromPluginMetadata();

  // update the recipes from the latest plugin metadata.
  this.updateCategoriesFromPluginMetadata();
};

/**
 * Updates the recipe list from the latest plugin metadata.
 */
Game_System.prototype.updateRecipesFromPluginMetadata = function()
{
  // refresh the recipes list from the plugin metadata.
  this._j._jafting._recipes ??=
    J.JAFTING.Helpers.translateRecipes(J.JAFTING.PluginParameters['JAFTINGrecipes']);
};

/**
 * Updates the category list from the latest plugin metadata.
 */
Game_System.prototype.updateCategoriesFromPluginMetadata = function()
{
  // refresh the categories list from the plugin metadata.
  this._j._jafting._categories ??=
    J.JAFTING.Helpers.translateCategories(J.JAFTING.PluginParameters['JAFTINGcategories']);
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
 * Locks all recipes of JAFTING.
 */
Game_System.prototype.lockAllRecipes = function()
{
  this._j._jafting._recipes.forEach(recipe => recipe.lock());
  this.setRefreshRequest(true);
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
  // get all unlocked recipes of a given category.
  const unlocked = this.getUnlockedRecipesByCategory(categoryKey);

  // check to make sure we have at least one before
  if (unlocked.length)
  {
    // a filtering function to determine what is available.
    const craftedRecipes = unlocked.filter(recipe => recipe.crafted);

    // return what we found.
    return craftedRecipes;
  }

  console.warn("no recipes have yet been crafted.")
  return [];
};

/**
 * Gets the number of recipes that have been crafted in a particular category.
 * @param {string} categoryKey The category key to search through.
 * @returns {number} The number of recipes that have been crafted.
 */
Game_System.prototype.getCraftedRecipesCountByCategory = function(categoryKey)
{
  return this.getCraftedRecipesByCategory(categoryKey).length;
};

/**
 * Gets a specific recipe by its key.
 * @param {string} recipeKey The key of the recipe to find.
 * @returns {JAFTING_Recipe|null} The found recipe, or null if it wasn't found.
 */
Game_System.prototype.getRecipe = function(recipeKey)
{
  // grab all the recipes agailable.
  const recipes = this.getAllRecipes();

  // if we don't have any recipes, then always null.
  if (!recipes.length) return null;

  // find the recipe by its key.
  const foundRecipe = recipes.find(recipe => recipe.key === recipeKey);

  // normalize the return value to null rather than undefined if necessary.
  return foundRecipe ?? null;
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
//endregion Game_System