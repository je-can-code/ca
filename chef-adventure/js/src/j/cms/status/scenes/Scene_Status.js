//region Scene_Status
/**
 * OVERWRITE Removes the buttons because fuck the buttons.
 */
Scene_Status.prototype.createButtons = function()
{
};

/**
 * OVERWRITE Removes the profile window because sticking that in a help window
 * was a dumb idea.
 */
Scene_Status.prototype.create = function()
{
  Scene_MenuBase.prototype.create.call(this);
  //this.createProfileWindow();
  this.createStatusWindow();
  this.createStatusParamsWindow();
  this.createStatusEquipWindow();
};

/**
 * OVERWRITE Removes the binding between the "profile" (help) window and
 * the refreshing of an actor.
 */
Scene_Status.prototype.refreshActor = function()
{
  const actor = this.actor();
  //this._profileWindow.setText(actor.profile());
  this._statusWindow.setActor(actor);
  this._statusParamsWindow.setActor(actor);
  this._statusEquipWindow.setActor(actor);
};

/**
 * Creates the Rectangle that will represent the window for the base status details.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusWindowRect = function()
{
  const wx = 0;
  const wy = 0;
  const ww = Math.round(Graphics.width * 0.3);
  const wh = Math.round(Graphics.height * 0.6);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Creates the Rectangle that will represent the window for the equip details.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusEquipWindowRect = function()
{
  const wx = 0;
  const wy = this._statusWindow.height;
  const ww = Math.round(Graphics.boxWidth * 0.3);
  const wh = Math.round(Graphics.boxHeight * 0.4);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * OVERWRITE Replaces the window type used for this part of the display.
 * This window no longer extends Window_Selectable, but instead extends
 * Window_Base so that we can draw cleaner than as a list.
 */
Scene_Status.prototype.createStatusParamsWindow = function()
{
  const rect = this.statusParamsWindowRect();
  this._statusParamsWindow = new Window_StatusParameters(rect);
  this.addWindow(this._statusParamsWindow);
};

/**
 * Creates the Rectangle that will represent the window for the parameter details.
 * @returns {Rectangle}
 */
Scene_Status.prototype.statusParamsWindowRect = function()
{
  const wx = this._statusWindow.width;
  const wy = 0;
  const ww = Math.round(Graphics.boxWidth * 0.7);
  const wh = Graphics.boxHeight;
  return new Rectangle(wx, wy, ww, wh);
};
//endregion Scene_Status