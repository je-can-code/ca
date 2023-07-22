//region Scene_Map
/**
 * Adds the functionality for calling the SDP menu from the JABS quick menu.
 */
J.SDP.Aliased.Scene_Map.set('createJabsAbsMenuMainWindow', Scene_Map.prototype.createJabsAbsMenuMainWindow);
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  // perform original logic.
  J.SDP.Aliased.Scene_Map.get('createJabsAbsMenuMainWindow').call(this);

  // grab the list window.
  const mainMenuWindow = this.getJabsMainListWindow();

  // add an additional handler for the new menu.
  mainMenuWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Map.prototype.commandSdp = function()
{
  Scene_SDP.callScene();
};
//endregion Scene_Map