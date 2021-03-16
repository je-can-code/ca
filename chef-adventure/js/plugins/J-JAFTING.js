//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 JAFT] Enables a new jafting menu that allows item creation and refinement.
 * @author JE
 * @url https://dev.azure.com/je-can-code/RPG%20Maker/_git/rmmz
 * @help
 * no help 4 u
 * 
 * @command Call Jafting Menu
 * @text Access the Jafting Menu
 * @desc Calls the Jafting Menu via plugin command.
 * 
 * @command Close Jafting Menu
 * @text End the Jafting session
 * @desc Ends the current Jafting session immediately.
 * Typically used for triggering a parallel item created event.
 * 
 * @command Unlock Category
 * @text Unlock new category
 * @desc Within the Crafting Mode, unlocks a new category of crafting.
 * @arg name
 * @type string
 * @desc The name that shows up in the list of categories.
 * @default Some Category
 * @arg key
 * @type string
 * @desc The unique identifier to this category.
 * @default C_SOME
 * @arg iconIndex
 * @type number
 * @desc The icon index that represents this category. 0 = no icon.
 * @default 0
 * @arg description
 * @type string
 * @desc This is the text that shows up in the help window when hovering over this option.
 * @default A wonderful category of JAFTING that everyone loves to work from!
 * 
 * @command Unlock Output
 * @text Unlock new crafting output
 * @desc Within the Crafting Mode, all these items from the database will be craftable.
 * @arg itemIds
 * @type item[]
 * @desc All items chosen here will be unlocked and available for crafting.
 * @arg weaponIds
 * @type weapon[]
 * @desc All weapons chosen here will be unlocked and available for crafting.
 * @arg armorIds
 * @type armor[]
 * @desc All armors chosen here will be unlocked and available for crafting.
 * 
 * @command Lock Category
 * @text Lock a category
 * @desc Within the Crafting Mode, locks a previously unlocked category of crafting.
 * @arg key
 * @type string
 * @desc The unique identifier to this category to remove.
 * @default C_SOME
 * 
 * @command Lock All Categories
 * @text Lock all crafting categories
 * @desc Locks all categories that were previously unlocked, effectively disabling crafting.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.JAFTING.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-JAFTING`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.JAFTING.PluginParameters = PluginManager.parameters(J.JAFTING.Metadata.Name);
J.JAFTING.Metadata = {
  ...J.JAFTING.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {
  Game_Party: {},
  Game_Player: {},
  Game_System: {},
  Scene_Map: {},
};

/**
 * Plugin command for calling forth the JAFTING menu and all its windowy glory.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Call Jafting Menu", () => {
  $gameSystem.startJafting();
  if (J.ABS && J.ABS.Metadata.Enabled) {
    $gameBattleMap.absPause = true;
  }
});

/**
 * Plugin command for ending the current JAFTING session.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Close Jafting Menu", () => {
  $gameSystem.endJafting();
  if (J.ABS && J.ABS.Metadata.Enabled) {
    $gameBattleMap.absPause = false;
  }
});

/**
 * Plugin command for unlocking a JAFTING category (such as cooking or blacksmithing).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Unlock Category", args => {
  const { name, key, iconIndex, description } = args;
  $gameSystem.unlockCategory(name, key, iconIndex, description);
});

/**
 * Plugin command for unlocking any recipes that output only this item (or other unlocked items).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Unlock Output", args => {
  const { itemIds, weaponIds, armorIds } = args;

  // unlock items
  if (itemIds) {
    JSON.parse(itemIds).forEach(itemId => {
      $gameSystem.unlockOutput(parseInt(itemId), "i");
    });  
  }

  // unlock weapons
  if (weaponIds) {
    JSON.parse(weaponIds).forEach(weaponId => {
      $gameSystem.unlockOutput(parseInt(weaponId), "w");
    });  
  }

  // unlock armors
  if (armorIds) {
    JSON.parse(armorIds).forEach(armorId => {
      $gameSystem.unlockOutput(parseInt(armorId), "a");
    });  
  }
});

/**
 * Plugin command for locking a JAFTING category (such as cooking or blacksmithing).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Lock Category", args => {
  const { key } = args;
  $gameSystem.lockCategory(key);
});

/**
 * Plugin command for locking all JAFTING categories.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Lock All Categories", () => {
  $gameSystem.lockAllCategories();
});
//#endregion Introduction

//#region Game objects
//#region Game_Party
J.JAFTING.Aliased.Game_Party.gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
  J.JAFTING.Aliased.Game_Party.gainItem.call(this, item, amount, includeEquip);
  $gameSystem.setRefreshRequest(true);
};

/**
 * An overwrite of how the itemcontainer function determines the type.
 * @param {object} item The item to discern type of.
 * @returns {object[]} The bucket containing the passed-in item type.
 */
Game_Party.prototype.itemContainer = function(item) {
  if (!item) {
      return null;
  } else if (item.itypeId) {
      return this._items;
  } else if (item.wtypeId) {
      return this._weapons;
  } else if (item.atypeId) {
      return this._armors;
  } else {
      return null;
  }
};

J.JAFTING.Aliased.Game_Party.maxItems = Game_Party.prototype.maxItems;
Game_Party.prototype.maxItems = function(item = null) {
  const defaultMaxItems = 999;
  // if there is no item passed, then just return max.
  if (!item) {
    return defaultMaxItems;
  }
  else {
    const baseMax = J.JAFTING.Aliased.Game_Party.maxItems.call(this, item);
    if (!baseMax || isNaN(baseMax)) {
      // if there is a problem with someone elses' plugins, return our max.
      return defaultMaxItems;
    } else {
      // return other plugins max if available.
      return baseMax;
    }
  }
};
//#endregion Game_Party

//#region Game_Player
J.JAFTING.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
  if (J.ABS) {
    return J.JAFTING.Aliased.Game_Player.canMove.call(this);
  }

  if ($gameSystem.isJafting()) {
    return false;
  }
};
//#endregion Game_Player

//#region Game_System
/**
 * Extends the `Game_System.initialize()` to include the JAFTING setup.
 */
J.JAFTING.Aliased.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  this.initJaftingMembers();
  J.JAFTING.Aliased.Game_System.initialize.call(this);
};

/**
 * Initializes the JAFTING object for tracking various things related to the system.
 */
Game_System.prototype.initJaftingMembers = function() {
  this._j = this._j || {};
  this._j._jafting = this._j._jafting || {};

  /**
   * Whether or not the JAFTING flow is executing.
   * @type {boolean}
   */
  this._j._jafting._callJafting = false;

  /**
   * The collection of all jafting recipes extracted from the database.
   * @type {JaftingRecipe[]}
   */
  this._j._jafting._recipes = [];

  /**
   * The collection of all unlocked categories that are viewable
   * within the JAFTING menu.
   * @type {Crafting_Category[]}
   */
  this._j._jafting._categories = this._j._jafting._categories || [];

  /**
   * The collection of all unlocked recipes that will be viewable
   * within the JAFTING menu.
   * @type {Crafting_Unlock[]}
   */
  this._j._jafting._unlocked = this._j._jafting._unlocked || [];

  /**
   * A request to refresh the windows of JAFTING.
   * @type {boolean} 
   */
  this._j._jafting._requestRefresh = false;
  this.populateRecipes();
};

/**
 * Iterate over all database tabs that recipes could live in to extract
 * the recipes into the list.
 */
Game_System.prototype.populateRecipes = function() {
  const stores = [$dataItems, $dataWeapons, $dataArmors];
  stores.forEach(store => {
    this.extractDataFromStore(store);
  });
};

/**
 * Extracts all recipes currently available from the current iteration
 * of the given database store.
 * @param {object[]} store The database object to iterate over. ex: `$dataItems`
 */
Game_System.prototype.extractDataFromStore = function(store) {
  store.forEach(obj => {
    // the first entry is always null.
    if (!obj) return;

    // if there are no ingredients, then its not a recipe.
    const ingredients = obj._jaft.ingredients();
    if (!ingredients.length) return;

    const tools = obj._jaft.tools();
    const categories = obj._jaft.categories();
    const output = obj._jaft.output();
    const { name, iconIndex } = obj._jaft.nameData();
    const description = obj._jaft.description();
    const recipe = new Crafting_Recipe(
      name, 
      description, 
      categories, 
      parseInt(iconIndex), 
      tools, 
      ingredients, 
      output);

    this._j._jafting._recipes.push(recipe);
  });
};

/**
 * Summons the JAFTING menu.
 */
Game_System.prototype.startJafting = function() {
  this._j._jafting._callJafting = true;
};

/**
 * Closes the JAFTING menu.
 */
Game_System.prototype.endJafting = function() {
  this._j._jafting._callJafting = false;
};

/**
 * Gets whether or not the player is currently using the JAFTING menu.
 * @returns {boolean}
 */
Game_System.prototype.isJafting = function() {
  return this._j._jafting._callJafting;
};

/**
 * Gets the category of crafting by key.
 * @param {string} key The unique identifier of a category of crafting.
 * @returns {Crafting_Category?}
 */
Game_System.prototype.getCategoryByKey = function(key) {
  const result = this._j._jafting._categories.find(category => category.key === key);
  return result;
};

/**
 * Gets whether or not the item id and type has been unlocked already or not.
 * @param {string} key The unique identifier of a category of crafting.
 * @returns {boolean}
 */
Game_System.prototype.isItemIdUnlocked = function(itemId, itemType) {
  const result = this._j._jafting._unlocked
    .find(unlock => unlock.itemId === itemId && unlock.itemType === itemType);
  return !!result;
};

/**
 * Unlocks/adds a new category to the list of available categories.
 * @param {string} name The name that shows up in the category list column.
 * @param {string} key The unique identifier of this category.
 * @param {number} iconIndex The index of the icon that shows up in the category list.
 * @param {string} description The visual description that shows up in the help text box for this category.
 */
Game_System.prototype.unlockCategory = function(name, key, iconIndex, description) {
  const exists = this.getCategoryByKey(key);
  if (!exists) {
    const newCategory = new Crafting_Category(name, key, iconIndex, description);
    this._j._jafting._categories.push(newCategory);
    this.setRefreshRequest(true);
  }
};

/**
 * Locks/removes a previously unlocked category of crafting.
 * @param {string} key The unique identifier of this category.
 */
Game_System.prototype.lockCategory = function(key) {
  const categoryToRemove = this.getCategoryByKey(key);
  if (categoryToRemove) {
    const newCategoryList = this._j._jafting._categories.filter(category => category.key != categoryToRemove.key);
    this._j._jafting._categories = newCategoryList;
    this.setRefreshRequest(true);
  }
};

/**
 * Locks all categories of crafting.
 */
Game_System.prototype.lockAllCategories = function() {
  this._j._jafting._categories = [];
  this.setRefreshRequest(true);
};

/**
 * Unlocks/adds a new output result for crafting.
 * @param {string} itemId The id of the item in the database.
 * @param {string} itemType The type of item this is.
 */
Game_System.prototype.unlockOutput = function(itemId, itemType) {
  const exists = this.isItemIdUnlocked(itemId, itemType);
  if (!exists) {
    const newUnlock = new Crafting_Unlock(itemId, itemType);
    this._j._jafting._unlocked.push(newUnlock);
    this.setRefreshRequest(true);
  }
};

/**
 * Gets all recipes that exist in the database at this time.
 * @returns {Crafting_Recipe[]}
 */
Game_System.prototype.getAllRecipes = function() {
  return this._j._jafting._recipes;
};

/**
 * Gets a list of all items that have been unlocked.
 * @returns {Crafting_Unlock}
 */
Game_System.prototype.getAllRecipeUnlocks = function() {
  return this._j._jafting._unlocked;
};

/**
 * Gets a list of all categories that have been unlocked.
 * @returns {Crafting_Category[]}
 */
Game_System.prototype.getUnlockedCategories = function() {
  return this._j._jafting._categories;
};

/**
 * Gets whether or not we have an outstanding request to refresh all JAFTING windows.
 * @returns {boolean} True if we need to refresh the windows, false otherwise.
 */
Game_System.prototype.isRefreshRequested = function() {
  return this._j._jafting._requestRefresh;
};

/**
 * Issues a request to refresh all JAFTING windows.
 * @param {boolean} requested True if we need to refresh the windows, false otherwise.
 */
Game_System.prototype.setRefreshRequest = function(requested = true) {
  this._j._jafting._requestRefresh = requested;
};

/**
 * For a recipe to be available for crafting/unlocked, the player must have
 * all outputs of a recipe unlocked.
 * @returns {Crafting_Recipe[]}
 */
Game_System.prototype.getUnlockedRecipes = function() {
  const recipes = this.getAllRecipes();       // all recipes in the database.
  const unlocks = this.getAllRecipeUnlocks(); // all unlocks the player has.

  // determine which recipes are unlocked based on unlocked output.
  const unlockedRecipes = recipes.filter(recipe => {
    const allOutputUnlocks = [];
    recipe.output.forEach(result => {
      const fakeType = this.translateRpgItemToType(result.item);
      const fakeUnlock = new Crafting_Unlock(result.item.id, fakeType);
      allOutputUnlocks.push(fakeUnlock);
    });

    // unique-ify the unlocks.
    const uniqueOutputUnlocks = [...new Set(allOutputUnlocks)];

    // only compares ids and type, the ".crafted" is irrelevant.
    const isUnlocked = uniqueOutputUnlocks.every(unique => unlocks.some(unlocked => {
      if ((unique.itemId === unlocked.itemId) && (unique.itemType === unlocked.itemType))
        return true;
      else
        return false;
    }));

    return isUnlocked;
  });

  return unlockedRecipes;
};

/**
 * Gets all unlocked recipes that are a part of a given category.
 * @param {string} category The category to get all unlocked recipes for.
 * @returns {Crafting_Recipe[]}
 */
Game_System.prototype.getUnlocksByCategory = function(category) {
  const recipes = this.getUnlockedRecipes();
  const unlocked = recipes.filter(recipe => {
    if (recipe.categories.includes(category))
      return true;
    else
      return false;
  });

  return unlocked;
};

/**
 * Translates an unidentified RPG::Item into it's item type abbreviation.
 * @param {object} rpgItem The RPG::Item that needs it's type determined.
 * @returns {string} One of: `i`, `w`, `a` for `item`, `weapon`, `armor`.
 */
Game_System.prototype.translateRpgItemToType = function(rpgItem) {
  if (rpgItem.itypeId) {
    return "i";
  } else if (rpgItem.wtypeId) {
    return "w";
  } else if (rpgItem.atypeId) {
    return "a";
  } else {
    console.error(rpgItem);
    console.error(`check the logs, there were issues translating items for recipes.`)
  }
};
//#endregion Game_System
//#endregion Game objects

//#region Scene objects

//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JAFTING objects for tracking.
 */
J.JAFTING.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.JAFTING.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initJaftingMenu();
};

/**
 * Initializes all JAFTING components.
 */
Scene_Map.prototype.initJaftingMenu = function() {
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

    // for refine mode
    _refinementMixDetailsWindow: null,
    _refinementCostWindow: null,
    _projectedRefinementResultsWindow: null,

  };
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.JAFTING.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
  J.JAFTING.Aliased.Scene_Map.createAllWindows.call(this);
  this.createJaftingMenu();
};

/**
 * Creates all JAFTING windows associated with each mode of crafting.
 */
Scene_Map.prototype.createJaftingMenu = function() {
  this.createJaftingSharedWindows();
  this.createJaftingCraftModeWindows();
  this.createJaftingFreeModeWindows();
  this.createJaftingRefinementModeWindows();
};

/**
 * Creates all JAFTING windows that are shared between the different modes.
 */
Scene_Map.prototype.createJaftingSharedWindows = function() {
  this.createJaftingHelpWindow();
  this.createJaftingModeWindow();
  this.createJaftingCategoryWindow();
};

/**
 * Creates the help window used throughout all of the JAFTING menu.
 */
Scene_Map.prototype.createJaftingHelpWindow = function() {
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
Scene_Map.prototype.createJaftingModeWindow = function() {
  const w = 800;
  const h = 68;
  const x = 0;
  const y = Graphics.boxHeight - h;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_JaftingModeMenu(rect);
  wind.setHandler('cancel', this.closeJaftingMenu.bind(this));
  wind.setHandler('craft-mode', this.chooseJaftingCraftMode.bind(this));
  wind.setHandler('free-mode', this.chooseJaftingFreeMode.bind(this));
  wind.setHandler('refine-mode', this.chooseJaftingRefineMode.bind(this));
  this._j._jaftingMenu._modeWindow = wind;
  this._j._jaftingMenu._modeWindow.close();
  this._j._jaftingMenu._modeWindow.hide();
  this.addWindow(this._j._jaftingMenu._modeWindow);
};

/**
 * Creates the category selection window used to determine which category of
 * craft-mode or free-mode 
 */
Scene_Map.prototype.createJaftingCategoryWindow = function() {
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

Scene_Map.prototype.createJaftingCraftModeWindows = function() {
  this.createJaftingCraftRecipeListWindow();
  this.createJaftingCraftRecipeDetailsWindow();
  //this._j._jaftingMenu._projectedCraftingResultWindow = null;
};

/**
 * Creates the window containing the list of recipes available for crafting.
 */
Scene_Map.prototype.createJaftingCraftRecipeListWindow = function() {
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
Scene_Map.prototype.createJaftingCraftRecipeDetailsWindow = function() {
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
Scene_Map.prototype.chooseJaftingCraftMode = function() {
  this._j._jaftingMenu._jaftingMode = "craft";
  this.setWindowFocus("craft-mode");
};

/**
 * The actions to perform when selecting the "freestyle" mode.
 * Opens up the items-only window for picking a base item to freestyle off of.
 */
Scene_Map.prototype.chooseJaftingFreeMode = function() {
  this._j._jaftingMenu._jaftingMode = "free";
};

/**
 * The actions to perform when selecting the "refinement" mode.
 * Opens up the equipment-only window for picking a base item to refine further.
 */
Scene_Map.prototype.chooseJaftingRefineMode = function() {
  this._j._jaftingMenu._jaftingMode = "refine";
};

/**
 * The actions to perform when a category is selected.
 * Opens the recipe list for a given category.
 */
Scene_Map.prototype.chooseJaftingCraftRecipe = function() {
  const category = this.getCurrentCategory();

  this.setWindowFocus("craft-recipes-list");
  this._j._jaftingMenu._recipeListWindow.currentCategory = category;
  return;
};

/**
 * The actions to perform when a recipe is selected.
 * Crafts the designated recipe.
 */
Scene_Map.prototype.confirmSelectedRecipe = function() {
  SoundManager.playShop();
  this.jaftingConsumeIngredients();
  this.jaftingGainOutput();
};

/**
 * Forces the player to lose all ingredients of the given recipe.
 */
Scene_Map.prototype.jaftingConsumeIngredients = function() {
  const recipe = this.getCurrentRecipe();
  const ingredients = recipe.ingredients;
  ingredients.forEach(ingredient => {
    const item = J.Base.Helpers.translateItem(ingredient.id, ingredient.type);
    const count = ingredient.count;
    $gameParty.loseItem(item, count);
  });
};

/**
 * Forces the player to gain all items of the given recipe's output.
 */
Scene_Map.prototype.jaftingGainOutput = function() {
  const recipe = this.getCurrentRecipe();
  const outputs = recipe.output;
  outputs.forEach(output => {
    const item = output.item;
    const count = parseInt(output.count);
    $gameParty.gainItem(item, count);
  });
};

Scene_Map.prototype.createJaftingFreeModeWindows = function() {
  //this._j._jaftingMenu._inventoryWindow = null;
  //this._j._jaftingMenu._freeMixDetailsWindow = null;
};

Scene_Map.prototype.createJaftingRefinementModeWindows = function() {
  //this._j._jaftingMenu._recipeListWindow = null;
  //this._j._jaftingMenu._projectedCraftingResultWindow = null;
  //this._j._jaftingMenu._ingredientsRequiredWindow = null;
  //this._j._jaftingMenu._craftCostWindow = null;
};

/**
 * Extends the `Scene_Map.update()` to include updating these windows as well.
 */
J.JAFTING.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  J.JAFTING.Aliased.Scene_Map.update.call(this);

  if ($gameSystem.isRefreshRequested()) {
    this._j._jaftingMenu._recipeListWindow.refresh();
    this._j._jaftingMenu._ingredientsRequiredWindow.refresh();
    this._j._jaftingMenu._categoryWindow.refresh();
    $gameSystem.setRefreshRequest(false);
  }

  if ($gameSystem.isJafting()) {
    this.manageJaftingMenu();
    this.hideNonJaftingWindows();
    return;
  } else {
    this.hideAllJaftingWindows();
    this.showNonJaftingWindows();
  }
};

/**
 * Sets the currently focused/activated window to be a given part of the flow.
 * @param {string} newFocus The new window flow to focus on.
 */
Scene_Map.prototype.setWindowFocus = function(newFocus) {
  this._j._jaftingMenu._windowFocus = newFocus;
};

/**
 * Gets the current window being focused.
 * @returns {string}
 */
Scene_Map.prototype.getWindowFocus = function() {
  return this._j._jaftingMenu._windowFocus;
};

/**
 * Sets the category currently selected.
 * @param {string} category The currently selected category.
 */
Scene_Map.prototype.setCurrentCategory = function(category) {
  this._j._jaftingMenu._currentCategory = category;
};

/**
 * Gets the currently selected category.
 * @returns {string} The currently selected category.
 */
Scene_Map.prototype.getCurrentCategory = function() {
  return this._j._jaftingMenu._currentCategory;
};

/**
 * Sets the category currently recipe.
 * @param {string} category The currently selected recipe.
 */
Scene_Map.prototype.setCurrentRecipe = function(recipe) {
  this._j._jaftingMenu._currentRecipe = recipe;
};

/**
 * Gets the currently selected recipe.
 * @returns {string} The currently selected recipe.
 */
Scene_Map.prototype.getCurrentRecipe = function() {
  return this._j._jaftingMenu._currentRecipe;
};

/**
 * Hides all non-JAFTING windows that may overlap with the JAFTING windows.
 */
Scene_Map.prototype.hideNonJaftingWindows = function() {
  if (J.Hud && J.Hud.Metadata.Enabled) this.toggleHud(false);
  if (J.TextLog && J.TextLog.Metadata.Enabled) this.toggleLog(false);
  if (J.ActionKeys && J.ActionKeys.Metadata.Enabled) this.toggleKeys(false);
};

/**
 * Shows the various non-JAFTING hud-type windows.
 */
Scene_Map.prototype.showNonJaftingWindows = function() {
  if (J.Hud && J.Hud.Metadata.Enabled) this.toggleHud(true);
  if (J.TextLog && J.TextLog.Metadata.Enabled) this.toggleLog(true);
  if (J.ActionKeys && J.ActionKeys.Metadata.Enabled) this.toggleKeys(true);
};

/**
 * Manages window visibility within the JAFTING menus.
 * Compare with `Scene_Map.prototype.closeJaftingWindow` to know what close.
 */
Scene_Map.prototype.manageJaftingMenu = function() {
  switch (this.getWindowFocus()) {
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
Scene_Map.prototype.toggleJaftingHelpWindow = function(visible) {
  if (visible) {
    this._j._jaftingMenu._helpWindow.show();
    this._j._jaftingMenu._helpWindow.open();
  } else {
    this._j._jaftingMenu._helpWindow.close();
    this._j._jaftingMenu._helpWindow.hide();
  }
};

/**
 * Toggles the visibility for the mode selection window in the JAFTING menu.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingModeWindow = function(visible) {
  if (visible) {
    this._j._jaftingMenu._modeWindow.show();
    this._j._jaftingMenu._modeWindow.open();
    this._j._jaftingMenu._modeWindow.activate();
  } else {
    this._j._jaftingMenu._modeWindow.close();
    this._j._jaftingMenu._modeWindow.hide();
    this._j._jaftingMenu._modeWindow.select(0);
    this._j._jaftingMenu._modeWindow.deactivate();
  }
};

/**
 * Toggles the visibility for the type selection window in the JAFTING menu
 * for the craft mode.
 * @param {boolean} visible Whether or not to show this window.
 */
Scene_Map.prototype.toggleJaftingCraftTypeWindow = function(visible) {
  if (visible) {
    this._j._jaftingMenu._categoryWindow.show();
    this._j._jaftingMenu._categoryWindow.open();
    this._j._jaftingMenu._categoryWindow.activate();
  } else {
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
Scene_Map.prototype.toggleJaftingRecipeListWindow = function(visible) {
  if (visible) {
    this._j._jaftingMenu._recipeListWindow.show();
    this._j._jaftingMenu._recipeListWindow.open();
    this._j._jaftingMenu._recipeListWindow.activate();
  } else {
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
Scene_Map.prototype.toggleJaftingRecipeDetailsWindow = function(visible) {
  if (visible) {
    this._j._jaftingMenu._ingredientsRequiredWindow.show();
    this._j._jaftingMenu._ingredientsRequiredWindow.open();
    this._j._jaftingMenu._ingredientsRequiredWindow.activate();
  } else {
    this._j._jaftingMenu._ingredientsRequiredWindow.close();
    this._j._jaftingMenu._ingredientsRequiredWindow.hide();
    this._j._jaftingMenu._ingredientsRequiredWindow.deactivate();  
  }
};

/**
 * Resets the current index of the recipe window to `null`.
 */
Scene_Map.prototype.resetAllIndices = function() {
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
Scene_Map.prototype.determineModeHelpWindowText = function() {
  const index = this._j._jaftingMenu._modeWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._modeWindow.currentIndex) return;

  const currentSymbol = this._j._jaftingMenu._modeWindow.currentSymbol();

  this._j._jaftingMenu._modeWindow.currentIndex = index;
  let message = ``;
  switch (currentSymbol) {
    case `craft-mode`:
      message = `Crafting mode allows for the creation of new items.\n`;
      message += `Choose from your currently learned recipes of a given type to get started.`;
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
Scene_Map.prototype.determineCategoryHelpWindowText = function() {
  const index = this._j._jaftingMenu._categoryWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._categoryWindow.currentIndex) return;

  this._j._jaftingMenu._categoryWindow.currentIndex = index;

  // extract the unique key of the category from the panel.
  const { key, description } = this._j._jaftingMenu._categoryWindow.getCategoryDetails();
  this.setCurrentCategory(key);

  // handle multi-line descriptions separated by a "\n" new line.
  const multipartDescription = description.split("\\n");
  let message = `${multipartDescription[0]}`;
  if (multipartDescription.length > 1) {
    message += `\n${multipartDescription[1]}`;
  }
  this._j._jaftingMenu._helpWindow.setText(message);
};

/**
 * Sets the text of the help window for the mode selection based on
 * the currently selected recipe.
 */
Scene_Map.prototype.determineRecipeHelpWindowText = function() {
  const index = this._j._jaftingMenu._recipeListWindow.index();
  // don't update the text if the index matches! (prevents tons of unnecessary updates)
  if (index === this._j._jaftingMenu._recipeListWindow.currentIndex) return;

  this._j._jaftingMenu._recipeListWindow.currentIndex = index;

  // extract the unique key of the category from the panel.
  const details = this._j._jaftingMenu._recipeListWindow.getRecipeDetails();
  if (!details) {
    this._j._jaftingMenu._helpWindow.setText("There are no unlocked recipes.");
    return;
  }

  // assign the current recipe to the details for display.
  this.setCurrentRecipe(details);
  this._j._jaftingMenu._ingredientsRequiredWindow.currentRecipe = this.getCurrentRecipe();

  // handle multi-line descriptions separated by a "\n" new line.
  const description = details.description;
  const multipartDescription = description.split("\\n");
  let message = `${multipartDescription[0]}`;
  if (multipartDescription.length > 1) {
    message += `\n${multipartDescription[1]}`;
  }
  this._j._jaftingMenu._helpWindow.setText(message);
};

/**
 * Hides all windows associated with JAFTING.
 */
Scene_Map.prototype.hideAllJaftingWindows = function() {
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
Scene_Map.prototype.closeJaftingWindow = function(jaftingWindow) {
  this.resetAllIndices();
  switch (jaftingWindow) {
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
Scene_Map.prototype.closeJaftingMenu = function() {
  this._j._jaftingMenu._modeWindow.closeMenu();
  return;
};
//#endregion Scene_Map

//#endregion Scene objects

//#region Window objects
//#region Window_JaftingModeMenu
/**
 * The mode selection window for JAFTING.
 */
class Window_JaftingModeMenu extends Window_HorzCommand {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    /**
     * The currently selected index of this mode selection window.
     * @type {number}
     */
    this._currentIndex = null;
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex() {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index) {
    this._currentIndex = index;
  };

  /**
   * Generate commands for all modes of crafting.
   */
  makeCommandList() {
    const hasCategories = $gameSystem.getUnlockedCategories();
    this.addCommand(`Crafting`, `craft-mode`, hasCategories, null, 193);
    this.addCommand(`Freestyle`, `free-mode`, false, null, 93); // disabled till implemented.
    this.addCommand(`Refine`, `refine-mode`, false, null, 223); // disabled till implemented.
    this.addCommand(`Cancel`, `cancel`, true, null, 90);
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign() {
    return "left";
  };

  /**
   * Closes the entire JAFTING menu.
   */
  closeMenu() {
    if (!this.isClosed()) {
      this.close();
      if (J.ABS && J.ABS.Metadata.Enabled) {
        $gameBattleMap.absPause = false;
        $gameBattleMap.requestAbsMenu = false;
      }

      $gameSystem.endJafting();
    }
  };
};
//#endregion Window_JaftingModeMenu

//#region Window_JaftingCraftCategory
/**
 * A simple window that shows a list of categories unlocked.
 */
class Window_JaftingCraftCategory extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);

    /**
     * The currently selected index of this mode selection window.
     * @type {number}
     */
    this._currentIndex = null;
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex() {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index) {
    this._currentIndex = index;
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign() {
    return "left";
  };

  /**
   * Gets the details of the currently selected category.
   * @returns {Crafting_Category}
   */
  getCategoryDetails() {
    // cannot return details for null.
    if (this.currentIndex === null) return null;

    const details = this._list[this.currentIndex].ext;
    return details;
  };

  hasRecipes(categoryKey) {
    const unlockedRecipes = $gameSystem.getUnlocksByCategory(categoryKey);
    const hasRecipesForCategory = unlockedRecipes.length > 0;
    return hasRecipesForCategory;
  };

  /**
   * Creates a list of all unlocked categories of crafting.
   */
  makeCommandList() {
    const unlockedCategories = $gameSystem.getUnlockedCategories();

    // don't make the list if we have no categories to draw.
    if (!unlockedCategories.length) return;

    unlockedCategories.forEach(category => {
      const hasRecipesForCategory = this.hasRecipes(category.key);
      this.addCommand(category.name, `crafting-category`, hasRecipesForCategory, category, category.iconIndex);
    });
  };
};
//#endregion Window_JaftingCraftCategory

//#region Window_JaftingCraftRecipeList
/**
 * A simple window that shows a list of recipes available based on unlocked ingredients.
 */
class Window_JaftingCraftRecipeList extends Window_Command {
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
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
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex() {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index) {
    this._currentIndex = index;
  };

  /**
   * Gets the current category that the recipe list is based off of.
   * @returns {string}
   */
  get currentCategory() {
    return this._currentCategory;
  };

  set currentCategory(category) {
    this._currentCategory = category;
    this.refresh();
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign() {
    return "left";
  };

  /**
   * Gets the details of the currently selected category.
   * @returns {Crafting_Category}
   */
  getRecipeDetails() {
    // cannot return details for null.
    if (this.currentIndex === null) return null;

    // cannot get the details for an empty list.
    if (!this._list.length) return null;

    if (this.currentIndex > this._list.length-1) {
      this.currentIndex = 0;
      this.select(0);
    }

    const details = this._list[this.currentIndex].ext;
    return details;
  };

  /**
   * Determines whether or not the player has the necessary ingredients on-hand
   * to craft a given item.
   * @param {Crafting_Ingredient[]} craftingIngredients The collection of required ingredients.
   * @returns {boolean} True if the ingredients are present, false otherwise.
   */
  hasIngredients(craftingIngredients) {
    let hasIngredients = true;
    craftingIngredients.forEach(ingredient => {
      const rpgItem = J.Base.Helpers.translateItem(ingredient.id, ingredient.type);
      const count = $gameParty.numItems(rpgItem);
      if (ingredient.count > count) {
        hasIngredients = false;
      }
    });

    return hasIngredients;
  };

  /**
   * Determines whether or not the player has the necessary tools on-hand
   * to craft a given item.
   * @param {Crafting_Ingredient[]} craftingTools The collection of required tools.
   * @returns {boolean} True if the tools are present, false otherwise.
   */
  hasTools(craftingTools) {
    let hasTools = true;
    craftingTools.forEach(tool => {
      const rpgItem = J.Base.Helpers.translateItem(tool.id, tool.type);
      const count = $gameParty.numItems(rpgItem);

      // recipe calls for more than we currently have.
      if (tool.count > count) {
        hasTools = false;
      }
    });

    return hasTools;
  };

  /**
   * Creates a list of all unlocked recipes that belong to this category of crafting.
   */
  makeCommandList() {
    const unlockedRecipes = $gameSystem.getUnlocksByCategory(this.currentCategory);

    // don't make the list if we have no categories to draw.
    if (!unlockedRecipes.length) return;

    // create commands based on the recipe and the ingredients/tools vs player inventory.
    unlockedRecipes.forEach(recipe => {
      const hasIngredients = this.hasIngredients(recipe.ingredients);
      const hasTools = this.hasTools(recipe.tools);
      const canCraft = (hasIngredients && hasTools);
      // determine if enabled/disabled by ingredients+tools in inventory.
      this.addCommand(recipe.name, `chosen-recipe`, canCraft, recipe, recipe.iconIndex);
    });
  };
};
//#endregion Window_JaftingCraftRecipeList

//#region Window_JaftingCraftRecipeDetails
/**
 * The window that displays all tools, ingredients, and output from a given recipe.
 */
class Window_JaftingCraftRecipeDetails extends Window_Base {
    /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  };

  /**
   * Initializes all members of this window.
   */
  initMembers() {
    /**
     * The recipe currently being displayed in this window.
     * @type {Crafting_Recipe}
     */
    this._currentRecipe = null;
  };

  /**
   * Gets the current recipe being displayed.
   * @returns {Crafting_Recipe}
   */
  get currentRecipe() {
    return this._currentRecipe;
  };

  /**
   * Sets the current recipe to be this recipe.
   * @param {Crafting_Recipe} recipe The recipe to assign as the current.
   */
  set currentRecipe(recipe) {
    this._currentRecipe = recipe;
    this.refresh();
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh() {
    // don't refresh if there is no recipe to refresh the contents of.
    if (!this.currentRecipe) return;

    this.contents.clear();
    this.drawRecipeInfo();
  };

  /**
   * Draws the recipe details of the currently selected recipe.
   */
  drawRecipeInfo() {
    this.drawRecipeTitle();
    this.drawRecipeIngredients();
    this.drawRecipeTools();
    this.drawRecipeOutput();
  };

  /**
   * Draws the title of the recipe.
   */
  drawRecipeTitle() {
    const recipe = this.currentRecipe;
    const lh = this.lineHeight();
    this.drawTextEx(`\\{\\I[${recipe.iconIndex}] \\C[6]${recipe.name}\\C[0]\\}`, 0, lh*0, 300);
  };

  /**
   * Draw all ingredients for the recipe.
   */
  drawRecipeIngredients() {
    const recipe = this.currentRecipe;
    const ingredients = recipe.ingredients;
    const ox = 30;
    const lh = this.lineHeight();
    this.drawTextEx(`\\C[1]Ingredients\\C[0]`, ox, lh*2, 300);
    ingredients.forEach((ingredient, index) => {
      const rpgItem = J.Base.Helpers.translateItem(ingredient.id, ingredient.type);
      const x = ox+40;
      const y = lh*(3+(index));
      const need = ingredient.count;
      const have = $gameParty.numItems(rpgItem);
      this.drawRecipeIngredientCount(need, have, x-60, y);
      this.drawRecipeItemName(rpgItem, x+40, y);
    });
  };

  /**
   * Draws a single recipe and it's required count vs how many the player has on-hand.
   * @param {number} need The number of this ingredient that is needed.
   * @param {number} have The number of this ingredient that the player has currently.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeIngredientCount(need, have, x, y) {
    const haveTextColor = (have >= need) ? 24 : 18;
    this.drawTextEx(`\\C[${haveTextColor}]${have}\\C[0]`, x, y, 100);
    this.drawTextEx(`/`, x+35, y, 100);
    this.drawTextEx(`${need}`, x+55, y, 100);
  };

  /**
   * Draw all tools for the recipe.
   */
  drawRecipeTools() {
    const recipe = this.currentRecipe;
    const tools = recipe.tools;
    const ox = 430;
    const lh = this.lineHeight();
    this.drawTextEx(`\\C[1]Tools Required\\C[0]`, ox, lh*2, 300);
    tools.forEach((tool, index) => {
      const rpgItem = J.Base.Helpers.translateItem(tool.id, tool.type);
      const x = ox+40;
      const y = lh*(3+(index));
      const available = $gameParty.numItems(rpgItem);
      this.drawRecipeToolAvailability(available, x-40, y);
      this.drawRecipeItemName(rpgItem, x, y);
    });
  };

  /**
   * Draws a symbol representing whether or not the tool is in the player's possession.
   * @param {boolean} available 
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeToolAvailability(available, x, y) {
    const availableTextColor = available ? 24 : 18;
    const symbol = available ? " ✔" : "❌";
    this.drawTextEx(`\\C[${availableTextColor}]${symbol}\\C[0]`, x, y, 50);
  };

  /**
   * Draws the name of a given ingredient.
   * @param {object} rpgItem The underlying item that needs drawing.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeItemName(rpgItem, x, y) {
    this.drawTextEx(`\\I[${rpgItem.iconIndex}]${rpgItem.name}`, x, y, 300);
  };

  /**
   * Draw all output for the recipe.
   */
  drawRecipeOutput() {
    const recipe = this.currentRecipe;
    const outputs = recipe.output;
    const lh = this.lineHeight();
    const ox = 430;
    this.drawTextEx(`\\C[1]Recipe Output\\C[0]`, ox, lh*8, 300);
    outputs.forEach((output, index) => {
      const count = output.count;
      const rpgItem = output.item;
      const y = lh*(9+(index));
      this.drawRecipeOutputItem(rpgItem, count, ox, y);
    });
  };

  /**
   * Draws one output item and it's yield.
   * @param {object} rpgItem The underlying item that needs drawing.
   * @param {number} count The number of items that this output yields.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeOutputItem(rpgItem, count, x, y) {
    const paddedCount = count.padZero(2);
    this.drawTextEx(`${paddedCount}x \\I[${rpgItem.iconIndex}]${rpgItem.name}`, x, y, 300);
  };
};
//#endregion Window_JaftingCraftRecipeDetails
//#endregion Window objects

//#region Custom classes
//#region Crafting_Recipe
/**
 * The data that makes up what defines a crafting recipe for use with JAFTING.
 */
function Crafting_Recipe() { this.initialize(...arguments); }
Crafting_Recipe.prototype = {};
Crafting_Recipe.prototype.constructor = Crafting_Recipe;
Crafting_Recipe.prototype.initialize = function(
  name, description, categories, iconIndex, tools, ingredients, output) {
    /**
     * The name of this crafting recipe.
     * @type {string}
     */
    this.name = name;

    /**
     * The description of this crafting recipe.
     * @type {string}
     */
    this.description = description;

    /**
     * The category keys that this crafting recipe belongs to.
     * @type {string[]}
     */
    this.categories = categories;

    /**
     * The icon that will display in the type selection window next to this category.
     * @type {number}
     */
    this.iconIndex = iconIndex;

    /**
     * The list of required tools not consumed but required to execute the recipe.
     * @type {Crafting_Ingredient[]}
     */
    this.tools = tools;

    /**
     * The list of ingredients that make up this recipe that will be consumed.
     * @type {Crafting_Ingredient[]}
     */
    this.ingredients = ingredients;

    /**
     * The list of `RPG:Item`s that would be generated when this recipe is successfully crafted.
     * @type {object}
     */
    this.output = output;
};
//#endregion Crafting_Recipe

//#region Crafting_Category
/**
 * Represents the category details for this recipe.
 * A single recipe can live in multiple categories.
 */
function Crafting_Category() { this.initialize(...arguments); }
Crafting_Category.prototype = {};
Crafting_Category.prototype.constructor = Crafting_Category;
Crafting_Category.prototype.initialize = function(name, key, iconIndex, description) {
  /**
   * The name of this crafting category.
   * @type {string}
   */
  this.name = name;

  /**
   * The unique key of this crafting category.
   * @type {string}
   */
  this.key = key;

  /**
   * The icon that will display in the type selection window next to this category.
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The description that shows up in the help window.
   * @type {string}
   */
  this.description = description;
};
//#endregion Crafting_Category
//#endregion Custom classes

//ENDFILE