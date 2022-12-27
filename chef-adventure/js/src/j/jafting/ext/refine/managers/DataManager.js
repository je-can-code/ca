//region DataManager
//region save/load data
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.JAFTING.EXT.REFINE.Aliased.DataManager.createGameObjects.call(this);
  $gameJAFTING = new Game_JAFTING();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function()
{
  const contents = J.JAFTING.EXT.REFINE.Aliased.DataManager.makeSaveContents.call(this);
  contents.jafting = $gameJAFTING;
  return contents;
};

/**
 * Extends the save content extraction to include extracting JAFTING data.
 *
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 *
 * TODO: change this plugin to use EXT_REFINE so there is no collision.
 */
J.JAFTING.EXT.REFINE.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.DataManager.extractSaveContents2.call(this, contents);

  // grab the jafting contents out.
  $gameJAFTING = contents.jafting;

  // update the weapons & armor.
  $gameJAFTING.updateDataWeapons();
  $gameJAFTING.updateDataArmors();
};
//endregion save/load data
//endregion DataManager