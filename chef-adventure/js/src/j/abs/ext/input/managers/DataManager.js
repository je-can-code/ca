//region DataManager
J.ABS.EXT.INPUT.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.EXT.INPUT.Aliased.DataManager.get('createGameObjects').call(this);

  // initialize controller 1 for JABS.
  $jabsController1 = new JABS_InputController();
};
//endregion DataManager