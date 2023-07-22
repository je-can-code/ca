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