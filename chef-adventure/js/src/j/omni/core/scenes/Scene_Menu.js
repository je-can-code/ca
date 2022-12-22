//region Scene_Menu
/**
 * Hooks into the command window creation of the menu to add functionality for the SDP menu.
 */
J.OMNI.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.OMNI.Aliased.Scene_Menu.get('createCommandWindow').call(this);

  // add an additional handler for the new menu.
  this._commandWindow.setHandler(J.OMNI.Metadata.Command.Symbol, this.commandOmnipedia.bind(this));
};

/**
 * Calls forth the omnipedia scene.
 */
Scene_Menu.prototype.commandOmnipedia = function()
{
  Scene_Omnipedia.callScene();
};
//endregion Scene_Menu