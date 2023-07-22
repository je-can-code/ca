//region DataManager
/**
 * Instantiates the hud manager after the rest of the objects are created.
 */
J.HUD.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('createGameObjects').call(this);

  // create the global hud manager object.
  if (!$hudManager)
  {
    // if somehow we're missing this global object, then re-add it.
    $hudManager = new Hud_Manager();
  }
};

J.HUD.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('extractSaveContents').call(this, contents);

  // setup the hud now that we know we have the save contents available.
  $hudManager.setup();
};

J.HUD.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('setupNewGame').call(this);

  // setup the hud now that we know we have the save contents available.
  $hudManager.setup();
};
//endregion DataManager