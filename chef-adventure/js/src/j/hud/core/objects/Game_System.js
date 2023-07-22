//region Game_System
/**
 * Extends the `initialize()` to include our hud data for remembering.
 */
J.HUD.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.Aliased.Game_System.get('initialize').call(this);
  this._j ||= {};
  this._j._hud ||= {
    _hudVisible: true,
    _alliesVisible: true,
  };
};

/**
 * Remembers the setting of hud visibility.
 * @param {boolean} visible True if the hud is visible, false otherwise.
 */
Game_System.prototype.setHudVisible = function(visible)
{
  this._j._hud._hudVisible = visible;
};

/**
 * Gets whether or not the hud was last identified as visible.
 * @returns {boolean} True if it was visible, false otherwise.
 */
Game_System.prototype.getHudVisible = function()
{
  return this._j._hud._hudVisible;
};

/**
 * Remembers the setting of the hud's allies' visibility.
 * @param {boolean} visible True if the hud's allies' are visible, false otherwise.
 */
Game_System.prototype.setHudAlliesVisible = function(visible)
{
  this._j._hud._alliesVisible = visible;
};

/**
 * Gets whether or not the hud's allies were last identified as visible.
 * @returns {boolean} True if they were visible, false otherwise.
 */
Game_System.prototype.getHudAlliesVisible = function()
{
  return this._j._hud._alliesVisible;
};
//endregion Game_System