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