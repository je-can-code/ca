//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 JAFT] Enables the ability to craft items from recipes.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables a new "JAFTING" (aka crafting) scene. With it, you can
 * define recipes and enable generic item creation in your game.
 *
 * NOTE ABOUT CREATION:
 * This base plugin can only be used to create already-existing entries from
 * the database. If you want to create new weapons/armor entirely, consider
 * looking into the J-JAFTING-Refinement extension.
 * ============================================================================
 * RECIPES:
 * Have you ever wanted to make a recipe that the player can then learn and
 * create items from? Well now you can! There are absolutely no tags required
 * for this basic functionality, it is 100% defined within the plugin
 * parameters of your RMMZ editor.
 *
 * A recipe is comprised of three lists:
 * - Ingredients: the consumed items/weapons/armors.
 * - Tools: the non-consumed items/weapons/armors.
 * - Output: what the player gains when JAFTING the recipe.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
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

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING = {};

/**
 * A collection of all extensions for JAFTING.
 */
J.JAFTING.EXT = {};

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
J.JAFTING.Metadata = {};
J.JAFTING.Metadata.Name = `J-JAFTING`;
J.JAFTING.Metadata.Version = '2.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.JAFTING.PluginParameters = PluginManager.parameters(J.JAFTING.Metadata.Name);

/**
 * All recipes defined in the plugin settings that can be JAFTED.
 */
J.JAFTING.Metadata.Recipes = [];

/**
 * All categories defined in the plugin settings that can contain JAFTING recipes.
 */
J.JAFTING.Metadata.Categories = [];

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {
  DataManager: {},
  Game_Party: new Map(),
  Game_Player: {},
  Game_System: new Map(),
  Scene_Map: {},
};

//region plugin commands
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
//endregion plugin commands
//endregion Introduction

//region JAFT_Category
/**
 * Represents the category details for this recipe.
 * A single recipe can live in multiple categories.
 */
function JAFTING_Category()
{
  this.initialize(...arguments);
}

JAFTING_Category.prototype = {};
JAFTING_Category.prototype.constructor = JAFTING_Category;
JAFTING_Category.prototype.initialize = function(name, key, iconIndex, description)
{
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
  this.initMembers();
};

/**
 * Initializes all members in this class with defaults.
 */
JAFTING_Category.prototype.initMembers = function()
{
  /**
   * Whether or not this category is unlocked.
   * @type {boolean}
   */
  this.unlocked = false;
};

/**
 * Gets whether or not this JAFTING category is unlocked.
 * @returns {boolean}
 */
JAFTING_Category.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Locks this JAFTING category.
 */
JAFTING_Category.prototype.lock = function()
{
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING category.
 */
JAFTING_Category.prototype.unlock = function()
{
  this.unlocked = true;
};
//endregion JAFT_Category

//region JAFT_Component
/**
 * A single instance of a particular crafting component, such as an ingredient/tool/output,
 * for use in JAFTING.
 */
function JAFTING_Component()
{
  this.initialize(...arguments);
}

JAFTING_Component.prototype = {};
JAFTING_Component.prototype.constructor = JAFTING_Component;
JAFTING_Component.prototype.initialize = function(id, type, count, isTool)
{
  /**
   * The id of the underlying component.
   * @type {number}
   */
  this.id = id;

  /**
   * The type of component this is, such as `i`/`w`/`a`.
   * @type {string}
   */
  this.type = type;

  /**
   * How many of this component is required.
   * @type {number}
   */
  this.count = count;

  /**
   * Whether or not this component is a non-consumable tool that is required
   * to perform crafting for particular recipes.
   * @type {boolean}
   */
  this.isTool = isTool;
};

/**
 * Gets the underlying RPG:Item that this component represents.
 */
JAFTING_Component.prototype.getItem = function()
{
  switch (this.type)
  {
    case `i`:
      return $dataItems[this.id];
    case `w`:
      return $dataWeapons[this.id];
    case `a`:
      return $dataArmors[this.id];
    default:
      console.error("attempted to craft an invalid item.");
      console.log(this);
      throw new Error("The output's type of a recipe was invalid. Check your recipes' output types again.");
  }
};

/**
 * Crafts this particular component based on it's type.
 */
JAFTING_Component.prototype.craft = function()
{
  $gameParty.gainItem(this.getItem(), this.count);
};

/**
 * Consumes this particular component based on it's type.
 */
JAFTING_Component.prototype.consume = function()
{
  $gameParty.loseItem(this.getItem(), this.count);
};
//endregion JAFT_Component

//region JAFT_Recipe
/**
 * The data that makes up what defines a crafting recipe for use with JAFTING.
 */
function JAFTING_Recipe()
{
  this.initialize(...arguments);
}

JAFTING_Recipe.prototype = {};
JAFTING_Recipe.prototype.constructor = JAFTING_Recipe;
JAFTING_Recipe.prototype.initialize = function(
  name, key, description, categories, iconIndex, tools, ingredients, output, masked
)
{
  /**
   * The name of this crafting recipe.
   * @type {string}
   */
  this.name = name;

  /**
   * The unique key associated with this crafting recipe.
   * @type {string}
   */
  this.key = key;

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
   * @type {JAFTING_Component[]}
   */
  this.tools = tools;

  /**
   * The list of ingredients that make up this recipe that will be consumed.
   * @type {JAFTING_Component[]}
   */
  this.ingredients = ingredients;

  /**
   * The list of `JAFTING_Component`s that would be generated when this recipe is successfully crafted.
   * @type {JAFTING_Component[]}
   */
  this.output = output;

  /**
   * Whether or not this recipe is masked by default until crafted the first time.
   * Masked recipes show up as all question marks in place of their name.
   * @type {boolean}
   */
  this.maskedUntilCrafted = masked;
  this.initMembers();
};

/**
 * Initializes all members that do not require parameters for this class.
 */
JAFTING_Recipe.prototype.initMembers = function()
{
  /**
   * Whether or not this recipe has been unlocked for JAFTING.
   * @type {boolean}
   */
  this.unlocked = false;

  /**
   * Whether or not this recipe has been JAFTED before.
   * @type {boolean}
   */
  this.crafted = false;
};

/**
 * Gets whether or not this JAFTING recipe has been unlocked or not.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Locks this JAFTING recipe.
 */
JAFTING_Recipe.prototype.lock = function()
{
  this.unlocked = false;
};

/**
 * Unlocks this JAFTING recipe. Does not unlock the category this recipe belongs to.
 */
JAFTING_Recipe.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Creates all output of this JAFTING recipe and marks the recipe as "crafted".
 */
JAFTING_Recipe.prototype.craft = function()
{
  this.output.forEach(component => component.craft());
  this.ingredients.forEach(component => component.consume());
  this.setCrafted();
};

/**
 * Gets whether or not this recipe is craftable based on the ingredients and tools on-hand.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.canCraft = function()
{
  let hasIngredients = true;
  let hasTools = true;

  // check over all ingredients to see if we have enough to JAFT this recipe.
  this.ingredients.forEach(component =>
  {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count)
    {
      hasIngredients = false;
    }
  });

  // check over all tools to see if we have them on-hand to JAFT this recipe.
  this.tools.forEach(component =>
  {
    const count = $gameParty.numItems(component.getItem());
    if (component.count > count)
    {
      hasTools = false;
    }
  });

  return hasIngredients && hasTools;
};

/**
 * Gets whether or not this recipe has been crafted before.
 * @returns {boolean}
 */
JAFTING_Recipe.prototype.hasBeenCrafted = function()
{
  return this.crafted;
};

/**
 * Sets this recipe to a "crafted" state.
 * @param {boolean} crafted Whether or not this item has been crafted.
 */
JAFTING_Recipe.prototype.setCrafted = function(crafted = true)
{
  this.crafted = crafted;
};

/**
 * Gets the primary output of this recipe.
 * Primary output is defined as the first item in the list of all output
 * that this recipe creates.
 * @returns {any}
 */
JAFTING_Recipe.prototype.getPrimaryOutput = function()
{
  return this.output[0].getItem();
};

/**
 * Gets the name of this recipe.
 * If none was specified, then the primary output's name will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeName = function()
{
  let name = "";
  if (!this.name.length)
  {
    const primaryOutput = this.getPrimaryOutput();
    name = primaryOutput.name;
  }
  else
  {
    name = this.name;
  }

  if (this.maskedUntilCrafted && !this.crafted)
  {
    name = name.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return name;
};

/**
 * Gets the icon index of this recipe.
 * If none was specified, then the primary output's icon index will be used.
 * @returns {number}
 */
JAFTING_Recipe.prototype.getRecipeIconIndex = function()
{
  if (this.iconIndex === -1)
  {
    const primaryOutput = this.getPrimaryOutput();
    return primaryOutput.iconIndex;
  }
  else
  {
    return this.iconIndex;
  }
};

/**
 * Gets the description of this recipe.
 * If none was specified, then the primary output's description will be used.
 * @returns {string}
 */
JAFTING_Recipe.prototype.getRecipeDescription = function()
{
  let description = "";
  if (!this.description.length)
  {
    const primaryOutput = this.getPrimaryOutput();
    description = primaryOutput.description;
  }
  else
  {
    description = this.description;
  }

  if (this.maskedUntilCrafted && !this.crafted)
  {
    description = description.replace(/[A-Za-z\-!?',.]/ig, "?");
  }

  return description;
};
//endregion JAFT_Recipe

//region DataManager
/**
 * Extends the save data extraction to include any changes in recipes/categories
 * from the plugin settings.
 */
J.JAFTING.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  // grab the latest data from the plugin parameters for jafting.
  const fromPluginParamsRecipes =
    J.JAFTING.Helpers.translateRecipes(J.JAFTING.PluginParameters['JAFTINGrecipes']);
  const fromPluginParamsCategories =
    J.JAFTING.Helpers.translateCategories(J.JAFTING.PluginParameters['JAFTINGcategories']);

  // pull out the jafting data from the save file.
  const fromSaveFileJafting = contents.system._j._jafting;

  // iterate over the save file recipes.
  fromSaveFileJafting._recipes.forEach(savedRecipe =>
  {
    // grab the recipe from our plugin parameter data.
    const updatedRecipe = fromPluginParamsRecipes
      .find(settingsRecipe => settingsRecipe.key === savedRecipe.key);

    // if the recipe no longer exists, don't do anything with it.
    if (!updatedRecipe) return;

    // if it was unlocked before, it stays unlocked.
    if (savedRecipe.isUnlocked()) updatedRecipe.unlock();

    // if it was crafted before, it stays crafted.
    if (savedRecipe.hasBeenCrafted()) updatedRecipe.setCrafted();
  });

  // iterate over all categories from the save file and update the unlock status of each.
  fromSaveFileJafting._categories.forEach(savedCategory =>
  {
    // grab the category from our plugin parameter data.
    const updatedCategory = fromPluginParamsCategories
      .find(settingsCategory => settingsCategory.key === savedCategory.key);

    // if the category no longer exists, don't do anything with it.
    if (!updatedCategory) return;

    // if it was unlocked before, it stays unlocked.
    if (savedCategory.isUnlocked()) updatedCategory.unlock();
  });

  // update the save file data with the modified plugin settings JAFTING data.
  contents.system._j._jafting._recipes = fromPluginParamsRecipes;
  contents.system._j._jafting._categories = fromPluginParamsCategories;
  J.JAFTING.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//endregion DataManager

//region Game_Party
/**
 * Extends `gainItem()` to also refresh the JAFTING windows on item quantity change.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.JAFTING.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  // perform original logic.
  J.JAFTING.Aliased.Game_Party.get('gainItem').call(this, item, amount, includeEquip);

  // refresh the JAFTING windows on item quantity change.
  $gameSystem.setRefreshRequest(true);
};
//endregion Game_Party

//region Game_Player
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
//endregion Game_Player

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