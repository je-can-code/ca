//region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JAFTING objects for tracking.
 */
J.JAFTING.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  J.JAFTING.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initJaftingMenu();
};

/**
 * Initializes all JAFTING components.
 */
Scene_Map.prototype.initJaftingMenu = function()
{
  this._j._jaftingMenu = {
    // shared properties and windows
    _windowFocus: null,
    _jaftingMode: null,
    _helpWindow: null,
    _modeWindow: null, // craft, free, refine
    _categoryWindow: null, // the various types
    _currentCategory: null,
    _currentRecipe: null,
    _confirmationWindow: null,
    _resultsWindow: null,

    // for crafting mode
    _recipeListWindow: null,
    _projectedCraftingResultWindow: null,
    _ingredientsRequiredWindow: null,
    _craftCostWindow: null,

    // for free mode
    _inventoryWindow: null,
    _freeMixDetailsWindow: null,
  };
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.JAFTING.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function()
{
  J.JAFTING.Aliased.Scene_Map.createAllWindows.call(this);
  this.createJaftingMenu();
};

/**
 * Creates all JAFTING windows associated with each mode of crafting.
 */
Scene_Map.prototype.createJaftingMenu = function()
{
  this.createJaftingSharedWindows();
  this.createJaftingCraftModeWindows();
  this.createJaftingFreeModeWindows();
};

/**
 * Creates all JAFTING windows that are shared between the different modes.
 */
Scene_Map.prototype.createJaftingSharedWindows = function()
{
  this.createJaftingHelpWindow();
  this.createJaftingModeWindow();
  this.createJaftingCategoryWindow();
};

/**
 * Creates the help window used throughout all of the JAFTING menu.
 */
Scene_Map.prototype.createJaftingHelpWindow = function()
{
  const w = Graphics.boxWidth;
  const h = 100;
  const x = 0;
  const y = 0;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_Help(rect);
  this._j._jaftingMenu._helpWindow = wind;
  this._j._jaftingMenu._helpWindow.close();
  this._j._jaftingMenu._helpWindow.hide();
  this.addWindow(this._j._jaftingMenu._helpWindow);
};

/**
 * Creates the mode selection window used to determine which type of JAFTING
 * that the player will perform.
 */
Scene_Map.prototype.createJaftingModeWindow = function()
{
  const w = 800;
  const h = 68;
  const x = 0;
  const y = Graphics.boxHeight - h;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingModeMenu(rect);
  wind.setHandler('cancel', this.closeJaftingMenu.bind(this));
  wind.setHandler('craft-mode', this.chooseJaftingCraftMode.bind(this));
  wind.setHandler('free-mode', this.chooseJaftingFreeMode.bind(this));
  this._j._jaftingMenu._modeWindow = wind;
  this._j._jaftingMenu._modeWindow.close();
  this._j._jaftingMenu._modeWindow.hide();
  this.addWindow(this._j._jaftingMenu._modeWindow);
};

/**
 * Creates the category selection window used to determine which category of
 * craft-mode or free-mode
 */
Scene_Map.prototype.createJaftingCategoryWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 60;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingCraftCategory(rect);
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "category"));
  wind.setHandler('crafting-category', this.chooseJaftingCraftRecipe.bind(this));
  this._j._jaftingMenu._categoryWindow = wind;
  this._j._jaftingMenu._categoryWindow.close();
  this._j._jaftingMenu._categoryWindow.hide();
  this.addWindow(this._j._jaftingMenu._categoryWindow);
};

Scene_Map.prototype.createJaftingCraftModeWindows = function()
{
  this.createJaftingCraftRecipeListWindow();
  this.createJaftingCraftRecipeDetailsWindow();
};

/**
 * Creates the window containing the list of recipes available for crafting.
 */
Scene_Map.prototype.createJaftingCraftRecipeListWindow = function()
{
  const w = 350;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 60;
  const x = 0;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingCraftRecipeList(rect);
  wind.setHandler('cancel', this.closeJaftingWindow.bind(this, "craft-recipes-list"));
  wind.setHandler('ok', this.confirmSelectedRecipe.bind(this));
  this._j._jaftingMenu._recipeListWindow = wind;
  this._j._jaftingMenu._recipeListWindow.close();
  this._j._jaftingMenu._recipeListWindow.hide();
  this.addWindow(this._j._jaftingMenu._recipeListWindow);
};

/**
 * Creates the window containing the recipe details, such as ingredients and tools required
 * and the items it will output on crafting the recipe.
 */
Scene_Map.prototype.createJaftingCraftRecipeDetailsWindow = function()
{
  const w = this._j._jaftingMenu._helpWindow.width - this._j._jaftingMenu._recipeListWindow.width;
  const h = Graphics.height - this._j._jaftingMenu._helpWindow.height - 60;
  const x = this._j._jaftingMenu._recipeListWindow.width;
  const y = this._j._jaftingMenu._helpWindow.height;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingCraftRecipeDetails(rect);
  this._j._jaftingMenu._ingredientsRequiredWindow = wind;
  this._j._jaftingMenu._ingredientsRequiredWindow.close();
  this._j._jaftingMenu._ingredientsRequiredWindow.hide();
  this.addWindow(this._j._jaftingMenu._ingredientsRequiredWindow);
};

/**
 * The actions to perform when selecting the "crafting" mode.
 * Opens up the category window to choose a category to look at recipes for.
 */
Scene_Map.prototype.chooseJaftingCraftMode = function()
{
  this.setWindowFocus("craft-mode");
};

/**
 * The actions to perform when selecting the "freestyle" mode.
 * Opens up the items-only window for picking a base item to freestyle off of.
 */
Scene_Map.prototype.chooseJaftingFreeMode = function()
{
  throw new Error("Free mode is not implemented in this version.");
};

/**
 * The actions to perform when a category is selected.
 * Opens the recipe list for a given category.
 */
Scene_Map.prototype.chooseJaftingCraftRecipe = function()
{
  const category = this.getCurrentCategory();

  this.setWindowFocus("craft-recipes-list");
  this._j._jaftingMenu._recipeListWindow.currentCategory = category;
};

/**
 * The actions to perform when a recipe is selected.
 * Crafts the designated recipe.
 */
Scene_Map.prototype.confirmSelectedRecipe = function()
{
  SoundManager.playShop();
  this.jaftRecipe();
};

/**
 * Forces the player to gain all items of the given recipe's output.
 */
Scene_Map.prototype.jaftRecipe = function()
{
  const recipe = this.getCurrentRecipe();
  recipe.craft();
};

Scene_Map.prototype.createJaftingFreeModeWindows = function()
{
  //this._j._jaftingMenu._inventoryWindow = null;
  //this._j._jaftingMenu._freeMixDetailsWindow = null;
};

/**
 * Extends the `Scene_Map.update()` to include updating these windows as well.
 */
J.JAFTING.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function()
{
  J.JAFTING.Aliased.Scene_Map.update.call(this);

  if ($gameSystem.isRefreshRequested())
  {
    this.refreshJafting();
  }

  if ($gameSystem.isJafting())
  {
    this.manageJaftingMenu();
  }
  else
  {
    this.hideAllJaftingWindows();
  }
};

/**
 * Refreshes all windows that could possibly require refreshing when requested.
 * As an example, if the player gains/loses an item, all windows will need refreshing
 * to reflect the change in quantity.
 */
Scene_Map.prototype.refreshJafting = function()
{
  $gameSystem.setRefreshRequest(false);
  this._j._jaftingMenu._recipeListWindow.refresh();
  this._j._jaftingMenu._ingredientsRequiredWindow.refresh();
  this._j._jaftingMenu._categoryWindow.refresh();
  this.setRecipeDescription();
};

/**
 * Sets the currently focused/activated window to be a given part of the flow.
 * @param {string} newFocus The new window flow to focus on.
 */
Scene_Map.prototype.setWindowFocus = function(newFocus)
{
  this._j._jaftingMenu._windowFocus = newFocus;
};

/**
 * Gets the current window being focused.
 * @returns {string}
 */
Scene_Map.prototype.getWindowFocus = function()
{
  return this._j._jaftingMenu._windowFocus;
};

/**
 * Sets the category currently selected.
 * @param {string} category The currently selected category.
 */
Scene_Map.prototype.setCurrentCategory = function(category)
{
  this._j._jaftingMenu._currentCategory = category;
};

/**
 * Gets the currently selected category.
 * @returns {string} The currently selected category.
 */
Scene_Map.prototype.getCurrentCategory = function()
{
  return this._j._jaftingMenu._currentCategory;
};

/**
 * Sets the currently selected recipe.
 * @param {string} recipe The currently selected recipe.
 */
Scene_Map.prototype.setCurrentRecipe = function(recipe)
{
  this._j._jaftingMenu._currentRecipe = recipe;
};

/**
 * Gets the currently selected recipe.
 * @returns {string} The currently selected recipe.
 */
Scene_Map.prototype.getCurrentRecipe = function()
{
  return this._j._jaftingMenu._currentRecipe;
};

/**
 * Manages window focus within the JAFTING menus.
 * Compare with `Scene_Map.prototype.closeJaftingWindow` to know what close.
 */
Scene_Map.prototype.manageJaftingMenu = function()
{
  switch (this.getWindowFocus())
  {
    case "main":
      this.toggleJaftingHelpWindow(true);
      this.toggleJaftingModeWindow(true);
      this.determineModeHelpWindowText();
      break;
    case "craft-mode":
      this.toggleJaftingModeWindow(false);
      this.toggleJaftingCraftTypeWindow(true);
      this.determineCategoryHelpWindowText();
      break;
    case "craft-recipes-list":
      this.toggleJaftingCraftTypeWindow(false);
      this.toggleJaftingRecipeListWindow(true);
      this.toggleJaftingRecipeDetailsWindow(true);
      this.determineRecipeHelpWindowText();
      break;
    case "free-mode":
      // open up item selection list to free-style off of.
      break;
    case "refine-mode":
      // open up weapon/armor selection list to pick primary gear.
      break;
    case "refine-secondary":
      // open up an all item/weapon/armor selection list to pick secondary.
      break;
    case "results":
      break;
    case null:
      this.setWindowFocus("main");
      break;
  }
};

/**
 * Toggles the visibility for the help window in the JAFTING menu.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingHelpWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._helpWindow.show();
    this._j._jaftingMenu._helpWindow.open();
  }
  else
  {
    this._j._jaftingMenu._helpWindow.close();
    this._j._jaftingMenu._helpWindow.hide();
  }
};

/**
 * Toggles the visibility for the mode selection window in the JAFTING menu.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingModeWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._modeWindow.show();
    this._j._jaftingMenu._modeWindow.open();
    this._j._jaftingMenu._modeWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._modeWindow.close();
    this._j._jaftingMenu._modeWindow.hide();
    this._j._jaftingMenu._modeWindow.deactivate();
    this._j._jaftingMenu._modeWindow.select(0);
  }
};

/**
 * Toggles the visibility for the type selection window in the JAFTING menu
 * for the craft mode.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingCraftTypeWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._categoryWindow.show();
    this._j._jaftingMenu._categoryWindow.open();
    this._j._jaftingMenu._categoryWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._categoryWindow.close();
    this._j._jaftingMenu._categoryWindow.hide();
    this._j._jaftingMenu._categoryWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the recipe selection window in the JAFTING menu
 * for the craft mode.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRecipeListWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._recipeListWindow.show();
    this._j._jaftingMenu._recipeListWindow.open();
    this._j._jaftingMenu._recipeListWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._recipeListWindow.close();
    this._j._jaftingMenu._recipeListWindow.hide();
    this._j._jaftingMenu._recipeListWindow.select(0);
    this._j._jaftingMenu._recipeListWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the recipe details window in the JAFTING menu
 * for the craft mode.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingRecipeDetailsWindow = function(visible)
{
  if (visible)
  {
    this._j._jaftingMenu._ingredientsRequiredWindow.show();
    this._j._jaftingMenu._ingredientsRequiredWindow.open();
    this._j._jaftingMenu._ingredientsRequiredWindow.activate();
  }
  else
  {
    this._j._jaftingMenu._ingredientsRequiredWindow.close();
    this._j._jaftingMenu._ingredientsRequiredWindow.hide();
    this._j._jaftingMenu._ingredientsRequiredWindow.deactivate();
  }
};

/**
 * Resets the current index of the recipe window to `null`.
 */
Scene_Map.prototype.resetAllIndices = function()
{
  this._j._jaftingMenu._modeWindow.currentIndex = null;
  this._j._jaftingMenu._modeWindow.refresh();

  this._j._jaftingMenu._categoryWindow.currentIndex = null;
  this._j._jaftingMenu._categoryWindow.refresh();

  this._j._jaftingMenu._ingredientsRequiredWindow.currentRecipe = null;
  this._j._jaftingMenu._ingredientsRequiredWindow.refresh();

  this._j._jaftingMenu._recipeListWindow.refresh();
  this._j._jaftingMenu._recipeListWindow.currentIndex = null;
  this._j._jaftingMenu._recipeListWindow.currentCategory = null;
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected option.
 */
Scene_Map.prototype.determineModeHelpWindowText = function()
{
  const index = this._j._jaftingMenu._modeWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._modeWindow.currentIndex) return;

  const currentSymbol = this._j._jaftingMenu._modeWindow.currentSymbol();

  this._j._jaftingMenu._modeWindow.currentIndex = index;
  let message = ``;
  switch (currentSymbol)
  {
    case `craft-mode`:
      message = `Crafting mode allows for the creation of new items.\n`;
      message += `Choose a category of JAFTING to get started.`;
      break;
    case `free-mode`:
      message = `Free mode leverages RNG will create new items from experimentation.\n`;
      message += `This is slated for JAFTING v3.0.`;
      break;
    case `refine-mode`:
      message = `Refinement mode empowers items by fusing another item into a base.\n`;
      message += `This is slated for JAFTING v2.0.`;
      break;
    case `cancel`:
      message = `Close the JAFTING menu and resume your adventures.\n`;
      message += `After all, ingredients and recipes won't find themselves!`;
      break;
  }

  this._j._jaftingMenu._helpWindow.setText(message);
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected category.
 */
Scene_Map.prototype.determineCategoryHelpWindowText = function()
{
  const index = this._j._jaftingMenu._categoryWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._categoryWindow.currentIndex) return;

  this._j._jaftingMenu._categoryWindow.currentIndex = index;

  // extract the unique key of the category from the panel.
  const {key, description} = this._j._jaftingMenu._categoryWindow.getCategoryDetails();
  this.setCurrentCategory(key);

  // handle multi-line descriptions separated by a "\n" new line.
  const multipartDescription = description.split("\\n");
  let message = `${multipartDescription[0]}`;
  if (multipartDescription.length > 1)
  {
    message += `\n${multipartDescription[1]}`;
  }
  this._j._jaftingMenu._helpWindow.setText(message);
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected recipe.
 */
Scene_Map.prototype.determineRecipeHelpWindowText = function()
{
  const index = this._j._jaftingMenu._recipeListWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._recipeListWindow.currentIndex &&
    !$gameSystem.isRefreshRequested())
  {
    return;
  }

  this._j._jaftingMenu._recipeListWindow.currentIndex = index;

  // extract the unique key of the category from the panel.
  const details = this._j._jaftingMenu._recipeListWindow.getRecipeDetails();
  if (!details)
  {
    this._j._jaftingMenu._helpWindow.setText("There are no unlocked recipes.");
    return;
  }

  // assign the current recipe to the details for display.
  this.setCurrentRecipe(details);
  this._j._jaftingMenu._ingredientsRequiredWindow.currentRecipe = this.getCurrentRecipe();

  this.setRecipeDescription();
};

/**
 * Sets the description of the recipe into the help window text.
 */
Scene_Map.prototype.setRecipeDescription = function()
{
  const details = this._j._jaftingMenu._recipeListWindow.getRecipeDetails();
  if (!details) return;

  // handle multi-line descriptions separated by a "\n" new line.
  const description = details.getRecipeDescription();
  const multipartDescription = description.split("\\n");
  let message = `${multipartDescription[0]}`;
  if (multipartDescription.length > 1)
  {
    message += `\n${multipartDescription[1]}`;
  }
  this._j._jaftingMenu._helpWindow.setText(message);
};

/**
 * Hides all windows associated with JAFTING.
 */
Scene_Map.prototype.hideAllJaftingWindows = function()
{
  this.toggleJaftingHelpWindow(false);
  this.toggleJaftingModeWindow(false);
  this.toggleJaftingCraftTypeWindow(false);
  this.toggleJaftingRecipeListWindow(false);
  this.toggleJaftingRecipeDetailsWindow(false);
  this.resetAllIndices();
};

/**
 * Closes a designated window from somewhere within the JAFTING menu.
 * Compare with `Scene_Map.prototype.manageJaftingMenu` to see where the focus goes.
 * @param {string} jaftingWindow The type of window we're closing.
 */
Scene_Map.prototype.closeJaftingWindow = function(jaftingWindow)
{
  this.resetAllIndices();
  switch (jaftingWindow)
  {
    case "main":
      this.hideAllJaftingWindows();
      this.closeJaftingMenu();
      break;
    case "category":
      this.toggleJaftingCraftTypeWindow(false);
      this.toggleJaftingModeWindow(true);
      this.setWindowFocus("main");
      break;
    case "craft-recipes-list":
      this.toggleJaftingRecipeListWindow(false);
      this.toggleJaftingRecipeDetailsWindow(false);
      this.toggleJaftingCraftTypeWindow(true);
      this.setWindowFocus("craft-mode");
      break;
  }
};

/**
 * Closes the entire menu of JAFTING.
 */
Scene_Map.prototype.closeJaftingMenu = function()
{
  this._j._jaftingMenu._modeWindow.closeMenu();
};
//endregion Scene_Map