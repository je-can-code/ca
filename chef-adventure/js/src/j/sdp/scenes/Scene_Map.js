//#region Scene_Map
/**
 * Adds the functionality for calling the SDP menu from the JABS quick menu.
 */
J.SDP.Aliased.Scene_Map.createJabsAbsMenuMainWindow = Scene_Map.prototype.createJabsAbsMenuMainWindow;
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  J.SDP.Aliased.Scene_Map.createJabsAbsMenuMainWindow.call(this);
  this._j._absMenu._mainWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Map.prototype.commandSdp = function()
{
  SceneManager.push(Scene_SDP);
};
//#endregion Scene_Map