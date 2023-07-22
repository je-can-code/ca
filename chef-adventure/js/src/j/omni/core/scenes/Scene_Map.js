//region Scene_Map
/**
 * Extends {@link #createJabsAbsMenuMainWindow}.
 * Adds additional handling in the list for the omnipedia command.
 */
J.OMNI.Aliased.Scene_Map.set('createJabsAbsMenuMainWindow', Scene_Map.prototype.createJabsAbsMenuMainWindow);
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  // perform original logic.
  J.OMNI.Aliased.Scene_Map.get('createJabsAbsMenuMainWindow').call(this);

  // grab the list window.
  const mainMenuWindow = this.getJabsMainListWindow();

  // add an additional handler for the new menu.
  mainMenuWindow.setHandler(J.OMNI.Metadata.Command.Symbol, this.commandOmnipedia.bind(this));
};

/**
 * Calls forth the omnipedia scene.
 */
Scene_Map.prototype.commandOmnipedia = function()
{
  Scene_Omnipedia.callScene();
};
//endregion Scene_Map