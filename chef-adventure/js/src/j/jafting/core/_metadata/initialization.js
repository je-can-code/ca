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