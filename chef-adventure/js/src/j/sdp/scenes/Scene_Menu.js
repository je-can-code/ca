//#region Scene_Menu
/**
 * Hooks into the command window creation of the menu to add functionality for the SDP menu.
 */
J.SDP.Aliased.Scene_Menu.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function()
{
  J.SDP.Aliased.Scene_Menu.createCommandWindow.call(this);
  this._commandWindow.setHandler("sdp-menu", this.commandSdp.bind(this));
};

/**
 * Brings up the SDP menu.
 */
Scene_Menu.prototype.commandSdp = function()
{
  SceneManager.push(Scene_SDP);
};
//#endregion Scene_Menu