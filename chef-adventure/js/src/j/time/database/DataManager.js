//region DataManager
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.TIME.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.TIME.Aliased.DataManager.createGameObjects.call(this);
  $gameTime = new Game_Time();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.TIME.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function()
{
  const contents = J.TIME.Aliased.DataManager.makeSaveContents.call(this);
  contents.time = $gameTime;
  return contents;
};

/**
 * Extends the save content extraction to include extracting JAFTING data.
 *
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 */
J.TIME.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  J.TIME.Aliased.DataManager.extractSaveContents2.call(this, contents);
  $gameTime = contents.time;
  if (!$gameTime)
  {
    $gameTime = new Game_Time();
    console.info('J-Time did not exist in the loaded save file- creating anew.');
  }
};
//endregion DataManager