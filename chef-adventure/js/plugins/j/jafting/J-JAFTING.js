//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0.0 JAFT] Enables the ability to craft items from recipes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This is not officially released and thus has no/incomplete documentation.
 * 
 * If you really want to use it, just look at the plugin commands & parameters.
 * ============================================================================
 * 
 * @param JAFTINGconfigs
 * @text JAFTING SETUP
 * 
 * @param JAFTINGrecipes
 * @parent JAFTINGconfigs
 * @type struct<RecipeStruct>[]
 * @text JAFTING Recipes
 * 
 * @param JAFTINGcategories
 * @parent JAFTINGconfigs
 * @type struct<CategoryStruct>[]
 * @text JAFTING Categories
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
 * @arg categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc All the keys of the categories to be unlocked.
 * 
 * @command Unlock Recipe
 * @text Unlock new recipe
 * @desc Within the Crafting Mode, unlocks a new recipe of a category of crafting.
 * @arg recipeKeys
 * @type string[]
 * @text Recipe Keys
 * @desc All the keys of the recipes to be unlocked.
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
/*~struct~RecipeStruct:
 * @param recipeKey
 * @type string
 * @text Recipe Key
 * @desc A unique identifier for this recipe.
 * 
 * @param name
 * @type string
 * @text Name
 * @desc The name of the recipe.
 * 
 * @param description
 * @type string
 * @text Description
 * @desc The description of this recipe. If unspecified, it will pull from the first output description.
 * 
 * @param iconIndex
 * @type number
 * @text Icon Index
 * @desc The icon index of this recipe. If unspecified, it will pull from the first output description.
 * 
 * @param categoryKeys
 * @type string[]
 * @text Category Keys
 * @desc The keys of the categories that this recipe belongs to.
 * @default []
 * 
 * @param ingredients
 * @type struct<ComponentStruct>[]
 * @text Ingredients
 * @desc The ingredients required to JAFT this recipe. These are consumed.
 * @default []
 * 
 * @param tools
 * @type struct<ComponentStruct>[]
 * @text Tools
 * @desc The tools required to JAFT this recipe. These are not consumed.
 * @default []
 * 
 * @param output
 * @type struct<ComponentStruct>[]
 * @text Output
 * @desc Upon JAFTING this recipe, these items are given to the player.
 * @default []
 * 
 * @param maskedUntilCrafted
 * @type boolean
 * @text Masked Until Crafted
 * @desc If this is set to true, then it will appear as all question marks until crafted the first time.
 * @default false
 * 
 */
/*~struct~ComponentStruct:
 * @param itemId
 * @type item
 * @text Item ID
 * @desc The item this component represents.
 * There can only be one "id" identified on a component.
 * 
 * @param weaponId
 * @type weapon
 * @text Weapon ID
 * @desc The weapon this component represents.
 * There can only be one "id" identified on a component.
 * 
 * @param armorId
 * @type armor
 * @text Armor ID
 * @desc The armor this component represents.
 * There can only be one "id" identified on a component.
 * 
 * @param num
 * @type number
 * @min 1
 * @text Quantity
 * @desc The quantity of this JAFTING component.
 * @default 1
 */
/*~struct~CategoryStruct:
 * 
 * @param name
 * @type string
 * @text Category Name
 * @desc The name of this category.
 * 
 * @param key
 * @type string
 * @text Category Key
 * @desc The unique key for this category.
 * 
 * @param iconIndex
 * @type number
 * @text Icon Index
 * @desc The icon index to represent this category.
 * @default 0
 * 
 * @param description
 * @type string
 * @text Description
 * @desc The description of this category to show up in the help window.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING = {};

/**
 * A helpful collection of functions for this plugin.
 */
J.JAFTING.Helpers = {};

/**
 * Translates the plugin settings from JSON to JAFTING recipes.
 * @param {JSON} rawRecipeBlobs The raw JSON data representing the recipes.
 * @returns {JAFTING_Recipe[]}
 */
J.JAFTING.Helpers.translateRecipes = rawRecipeBlobs =>
{
  if (!rawRecipeBlobs)
  {
    return [];
  }

  const parsedRecipeBlobs = JSON.parse(rawRecipeBlobs);
  const parsedRecipes = [];
  parsedRecipeBlobs.forEach(recipeBlob =>
  {
    // get at the high-level recipe data.
    const parsedRecipeBlob = JSON.parse(recipeBlob);

    // parse all ingredients from the recipe.
    const parsedIngredientsBlob = JSON.parse(parsedRecipeBlob.ingredients);
    const parsedIngredients = [];
    parsedIngredientsBlob.forEach(rawIngredient =>
    {
      const parsedIngredient = JSON.parse(rawIngredient);
      const itemId = parseInt(parsedIngredient.itemId);
      const weaponId = parseInt(parsedIngredient.weaponId);
      const armorId = parseInt(parsedIngredient.armorId);
      const quantity = parseInt(parsedIngredient.num);
      if (itemId)
      {
        const newItemIngredient = new JAFTING_Component(itemId, `i`, quantity, false);
        parsedIngredients.push(newItemIngredient);
      }
      if (weaponId)
      {
        const newWeaponIngredient = new JAFTING_Component(weaponId, `w`, quantity, false);
        parsedIngredients.push(newWeaponIngredient);
      }
      if (armorId)
      {
        const newArmorIngredient = new JAFTING_Component(armorId, `a`, quantity, false);
        parsedIngredients.push(newArmorIngredient);
      }
    });

    // parse all tools from the recipe.
    const parsedToolsBlob = JSON.parse(parsedRecipeBlob.tools);
    const parsedTools = [];
    parsedToolsBlob.forEach(rawTool =>
    {
      const parsedTool = JSON.parse(rawTool);
      const itemId = parseInt(parsedTool.itemId);
      const weaponId = parseInt(parsedTool.weaponId);
      const armorId = parseInt(parsedTool.armorId);
      const quantity = parseInt(parsedTool.num);
      if (itemId)
      {
        const newItemTool = new JAFTING_Component(itemId, `i`, quantity, false);
        parsedTools.push(newItemTool);
      }
      if (weaponId)
      {
        const newWeaponTool = new JAFTING_Component(weaponId, `w`, quantity, false);
        parsedTools.push(newWeaponTool);
      }
      if (armorId)
      {
        const newArmorTool = new JAFTING_Component(armorId, `a`, quantity, false);
        parsedTools.push(newArmorTool);
      }
    });

    // parse all output from the recipe.
    const parsedOutputBlob = JSON.parse(parsedRecipeBlob.output);
    const parsedOutputs = [];
    parsedOutputBlob.forEach(rawOutput =>
    {
      const parsedOutput = JSON.parse(rawOutput);
      const itemId = parseInt(parsedOutput.itemId);
      const weaponId = parseInt(parsedOutput.weaponId);
      const armorId = parseInt(parsedOutput.armorId);
      const quantity = parseInt(parsedOutput.num);
      if (itemId)
      {
        const newItemOutput = new JAFTING_Component(itemId, `i`, quantity, false);
        parsedOutputs.push(newItemOutput);
      }
      if (weaponId)
      {
        const newWeaponOutput = new JAFTING_Component(weaponId, `w`, quantity, false);
        parsedOutputs.push(newWeaponOutput);
      }
      if (armorId)
      {
        const newArmorOutput = new JAFTING_Component(armorId, `a`, quantity, false);
        parsedOutputs.push(newArmorOutput);
      }
    });

    // parse recipe metadata.
    const parsedDescription = parsedRecipeBlob.description;
    const parsedIconIndex = parseInt(parsedRecipeBlob.iconIndex)
      ? parseInt(parsedRecipeBlob.iconIndex)
      : -1;
    const parsedCategoryKeys = JSON.parse(parsedRecipeBlob.categoryKeys);

    // create and add JAFTING recipe.
    const parsedRecipe = new JAFTING_Recipe(
      parsedRecipeBlob.name,
      parsedRecipeBlob.recipeKey,
      parsedDescription,
      parsedCategoryKeys,
      parsedIconIndex,
      parsedTools,
      parsedIngredients,
      parsedOutputs,
      (parsedRecipeBlob.maskedUntilCrafted === 'true')
    );
    parsedRecipes.push(parsedRecipe);
  });

  return parsedRecipes;
};

/**
 * Translates the plugin settings from JSON to JAFTING categories.
 * @param {string} rawCategoryBlobs The raw JSON data representing the categories.
 * @returns {JAFTING_Category[]}
 */
J.JAFTING.Helpers.translateCategories = rawCategoryBlobs =>
{
  if (!rawCategoryBlobs)
  {
    return [];
  }

  const parsedCategoryBlobs = JSON.parse(rawCategoryBlobs);
  const parsedCategories = [];
  parsedCategoryBlobs.forEach(categoryBlob =>
  {
    const parsedCategoryBlob = JSON.parse(categoryBlob);
    const parsedCategory = new JAFTING_Category(
      parsedCategoryBlob.name,
      parsedCategoryBlob.key,
      parseInt(parsedCategoryBlob.iconIndex),
      parsedCategoryBlob.description
    );
    parsedCategories.push(parsedCategory);
  });

  return parsedCategories;
};

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
  Version: '2.0.0',

  /**
   * All recipes defined in the plugin settings that can be JAFTED.
   */
  Recipes: J.JAFTING.Helpers.translateRecipes(J.JAFTING.PluginParameters['JAFTINGrecipes']),

  /**
   * All categories defined in the plugin settings that can contain JAFTING recipes.
   */
  Categories: J.JAFTING.Helpers.translateCategories(J.JAFTING.PluginParameters['JAFTINGcategories']),
};

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {
  DataManager: {},
  Game_Party: {},
  Game_Player: {},
  Game_System: {},
  Scene_Map: {},
};

/**
 * Plugin command for calling forth the JAFTING menu and all its windowy glory.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Call Jafting Menu", () =>
{
  $gameSystem.startJafting();
});

/**
 * Plugin command for ending the current JAFTING session.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Close Jafting Menu", () =>
{
  $gameSystem.endJafting();
});

/**
 * Plugin command for unlocking a JAFTING category (such as cooking or blacksmithing).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Unlock Category", args =>
{
  const {categoryKeys} = args;

  const parsedCategoryKeys = JSON.parse(categoryKeys);
  parsedCategoryKeys.forEach(parsedCategoryKey => $gameSystem.unlockCategory(parsedCategoryKey));
});

/**
 * Plugin command for unlocking any recipes that output only this item (or other unlocked items).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Unlock Recipe", args =>
{
  const {recipeKeys} = args;

  const parsedRecipeKeys = JSON.parse(recipeKeys);
  parsedRecipeKeys.forEach(parsedRecipeKey => $gameSystem.unlockRecipe(parsedRecipeKey));
});

/**
 * Plugin command for locking a JAFTING category (such as cooking or blacksmithing).
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Lock Category", args =>
{
  const {key} = args;
  $gameSystem.lockCategory(key);
});

/**
 * Plugin command for locking all JAFTING categories.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.Name, "Lock All Categories", () =>
{
  $gameSystem.lockAllCategories();
});
//#endregion Introduction

//#region Static objects

//#region DataManager
/**
 * Extends the save data extraction to include any changes in recipes/categories
 * from the plugin settings.
 */
J.JAFTING.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  const fromPluginSettingsJafting = $gameSystem._j._jafting;
  const fromSaveFileJafting = contents.system._j._jafting;
  fromSaveFileJafting._recipes.forEach(savedRecipe =>
  {
    const updatedRecipe = fromPluginSettingsJafting._recipes
      .find(settingsRecipe => settingsRecipe.key === savedRecipe.key);
    // if the recipe no longer exists, don't do anything with it.
    if (!updatedRecipe) return;

    // if it was unlocked before, it stays unlocked.
    if (savedRecipe.isUnlocked())
    {
      if (updatedRecipe)
      {
        updatedRecipe.unlock();
      }
    }

    // if it was crafted before, it stays crafted.
    if (savedRecipe.hasBeenCrafted())
    {
      updatedRecipe.setCrafted();
    }
  });

  // iterate over all categories from the save file and update the unlock status of each.
  fromSaveFileJafting._categories.forEach(savedCategory =>
  {
    const updatedCategory = fromPluginSettingsJafting._categories
      .find(settingsCategory => settingsCategory.key === savedCategory.key);

    // if the category no longer exists, don't do anything with it.
    if (!updatedCategory) return;

    if (savedCategory.isUnlocked())
    {
      updatedCategory.unlock();
    }
  });

  // update the save file data with the modified plugin settings JAFTING data.
  contents.system._j._jafting = fromPluginSettingsJafting;
  J.JAFTING.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//#endregion DataManager

//#endregion Static objects

//#region Game objects
//#region Game_Party
J.JAFTING.Aliased.Game_Party.gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  J.JAFTING.Aliased.Game_Party.gainItem.call(this, item, amount, includeEquip);
  $gameSystem.setRefreshRequest(true);
};

/**
 * An overwrite of how the itemcontainer function determines the type.
 * @param {object} item The item to discern type of.
 * @returns {object[]} The bucket containing the passed-in item type.
 */
Game_Party.prototype.itemContainer = function(item)
{
  if (!item)
  {
    return null;
  }
  else if (item.itypeId)
  {
    return this._items;
  }
  else if (item.wtypeId && item.wtypeId > -1)
  {
    return this._weapons;
  }
  else if (item.atypeId && item.atypeId > -1)
  {
    return this._armors;
  }
  else
  {
    return null;
  }
};

/**
 * OVERWRITE Changes the max to be what I set instead, or handle other plugins'
 * max item count if they modify it.
 */
J.JAFTING.Aliased.Game_Party.maxItems = Game_Party.prototype.maxItems;
Game_Party.prototype.maxItems = function(item = null)
{
  const defaultMaxItems = 999;
  // if there is no item passed, then just return max.
  if (!item)
  {
    return defaultMaxItems;
  }
  else
  {
    const baseMax = J.JAFTING.Aliased.Game_Party.maxItems.call(this, item);
    if (!baseMax || isNaN(baseMax))
    {
      // if there is a problem with someone elses' plugins, return our max.
      return defaultMaxItems;
    }
    else
    {
      // return other plugins max if available.
      return baseMax;
    }
  }
};
//#endregion Game_Party

//#region Game_Player
/**
 * Extends the canMove function to ensure the player can't move around while
 * in the JAFTING menu.
 */
J.JAFTING.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function()
{
  if ($gameSystem.isJafting())
  {
    return false;
  }
  else
  {
    return J.JAFTING.Aliased.Game_Player.canMove.call(this);
  }
};
//#endregion Game_Player

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
  this._j._jafting._callJafting = false;

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
  this._j._jafting._callJafting = true;
};

/**
 * Closes the JAFTING menu.
 */
Game_System.prototype.endJafting = function()
{
  this._j._jafting._callJafting = false;
};

/**
 * Gets whether or not the player is currently using the JAFTING menu.
 * @returns {boolean}
 */
Game_System.prototype.isJafting = function()
{
  return this._j._jafting._callJafting;
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
 * @param {string} name The name that shows up in the category list column.
 * @param {string} key The unique identifier of this category.
 * @param {number} iconIndex The index of the icon that shows up in the category list.
 * @param {string} description The visual description that shows up in the help text box for this category.
 */
Game_System.prototype.unlockCategory = function(key)
{
  const category = this._j._jafting._categories.find(category => category.key === key);
  if (category)
  {
    category.unlock();
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
  const category = this._j._jafting._categories.find(category => category.key === key);
  if (category)
  {
    category.lock();
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
  const recipe = this._j._jafting._recipes.find(recipe => recipe.key === key);
  if (recipe)
  {
    recipe.unlock();
    this.setRefreshRequest(true);
  }
};

/**
 * Locks a recipe. Does not lock the category this recipe belongs to.
 * @param {string} key The key of the recipe to unlock.
 */
Game_System.prototype.lockRecipe = function(key)
{
  const recipe = this._j._jafting._recipes.find(recipe => recipe.key === key);
  if (recipe)
  {
    recipe.lock();
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
//#endregion Game objects

//#region Scene objects

//#region Scene_Map
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
    this.hideNonJaftingWindows();
  }
  else
  {
    this.hideAllJaftingWindows();
    this.showNonJaftingWindows();
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
 * Hides all non-JAFTING windows that may overlap with the JAFTING windows.
 */
Scene_Map.prototype.hideNonJaftingWindows = function()
{
  if (J.HUD)
  {
    $hudManager.requestHideHud();
  }
  if (J.KEYS && J.KEYS.Metadata.Enabled) this.toggleKeys(false);
};

/**
 * Shows the various non-JAFTING hud-type windows.
 */
Scene_Map.prototype.showNonJaftingWindows = function()
{
  if (J.HUD)
  {
    $hudManager.requestShowHud();
  }
  if (J.KEYS && J.KEYS.Metadata.Enabled) this.toggleKeys(true);
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
  return;
};
//#endregion Scene_Map

//#endregion Scene objects

//#region Window objects
//#region Window_JaftingModeMenu
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
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex()
  {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index)
  {
    this._currentIndex = index;
  };

  /**
   * Generate commands for all modes of crafting.
   */
  makeCommandList()
  {
    const hasCategories = $gameSystem.getUnlockedCategories();
    this.addCommand(`Crafting`, `craft-mode`, hasCategories.length, null, 193);
    this.addCommand(`Freestyle`, `free-mode`, false, null, 93); // disabled till implemented.
    this.addCommand(`Cancel`, `cancel`, true, null, 90);
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  };

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
class Window_JaftingCraftCategory
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
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex()
  {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index)
  {
    this._currentIndex = index;
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  };

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
  };

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
  };

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
  };
};
//#endregion Window_JaftingCraftCategory

//#region Window_JaftingCraftRecipeList
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
  };

  /**
   * Gets the current index that was last assigned of this window.
   * @returns {number}
   */
  get currentIndex()
  {
    return this._currentIndex;
  };

  /**
   * Sets the current index to a given value.
   */
  set currentIndex(index)
  {
    this._currentIndex = index;
  };

  /**
   * Gets the current category that the recipe list is based off of.
   * @returns {string}
   */
  get currentCategory()
  {
    return this._currentCategory;
  };

  /**
   * Sets the current category to a given category.
   */
  set currentCategory(category)
  {
    this._currentCategory = category;
    this.refresh();
  };

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  };

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
  };

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
  };
};
//#endregion Window_JaftingCraftRecipeList

//#region Window_JaftingCraftRecipeDetails
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
  };

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
  };

  /**
   * Gets the current recipe being displayed.
   * @returns {JAFTING_Recipe}
   */
  get currentRecipe()
  {
    return this._currentRecipe;
  };

  /**
   * Sets the current recipe to be this recipe.
   * @param {JAFTING_Recipe} recipe The recipe to assign as the current.
   */
  set currentRecipe(recipe)
  {
    this._currentRecipe = recipe;
    this.refresh();
  };

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no recipe to refresh the contents of.
    if (!this.currentRecipe) return;

    this.contents.clear();
    this.drawRecipeInfo();
  };

  /**
   * Draws the recipe details of the currently selected recipe.
   */
  drawRecipeInfo()
  {
    this.drawRecipeTitle();
    this.drawRecipeIngredients();
    this.drawRecipeTools();
    this.drawRecipeOutput();
  };

  /**
   * Draws the title of the recipe.
   */
  drawRecipeTitle()
  {
    const recipe = this.currentRecipe;
    const iconIndex = this.currentRecipe.getRecipeIconIndex();
    const lh = this.lineHeight();
    this.drawTextEx(`\\{\\I[${iconIndex}] \\C[6]${recipe.getRecipeName()}\\C[0]\\}`, 0, lh * 0, 300);
  };

  /**
   * Draw all ingredients for the recipe.
   */
  drawRecipeIngredients()
  {
    const recipe = this.currentRecipe;
    const ingredients = recipe.ingredients;
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
  };

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
  };

  /**
   * Draw all tools for the recipe.
   */
  drawRecipeTools()
  {
    const recipe = this.currentRecipe;
    const tools = recipe.tools;
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
  };

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
  };

  /**
   * Draws the name of a given ingredient.
   * @param {object} rpgItem The underlying item that needs drawing.
   * @param {number} x The `x` coordinate.
   * @param {number} y The `y` coordinate.
   */
  drawRecipeItemName(rpgItem, x, y)
  {
    this.drawTextEx(`\\I[${rpgItem.iconIndex}]${rpgItem.name}`, x, y, 300);
  };

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
      const count = component.count;
      const rpgItem = component.getItem();
      const y = lh * (9 + (index));
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
  drawRecipeOutputItem(rpgItem, count, x, y)
  {
    const paddedCount = count.padZero(2);
    let name = rpgItem.name;
    if (this.currentRecipe.maskedUntilCrafted && !this.currentRecipe.hasBeenCrafted())
    {
      name = name.replace(/[A-Za-z!-?.]/ig, "?");
    }
    this.drawTextEx(`${paddedCount}x \\I[${rpgItem.iconIndex}]${name}`, x, y, 300);
  };
};
//#endregion Window_JaftingCraftRecipeDetails
//#endregion Window objects

//ENDFILE