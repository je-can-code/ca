/**
 * Extends {@link Game_System.initMembers}.
 * Also initializes our new members.
 */
J.ABS.EXT.TOOLS.Aliased.Game_System.set('initMembers', Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.Game_System.get('initMembers').call(this);

  // initialize our class members.
  this.initToolsMembers();
};

Game_System.prototype.initToolsMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the tools extension.
   */
  this._j._tools ||= {};

  /**
   * Whether or not the grab and throw functionality is currently enabled.
   * @type {boolean}
   */
  this._j._tools._grabThrowEnabled = true; // TODO: parameterize this.
};

/**
 * Gets whether or not grab and throw functionality is enabled.
 * @returns {boolean}
 */
Game_System.prototype.isGrabThrowEnabled = function()
{
  return this._j._tools._grabThrowEnabled;
};

/**
 * Sets whether or not grab and throw functionality is enabled.
 * @param {boolean} isEnabled
 */
Game_System.prototype.setGrabThrowEnabled = function(isEnabled)
{
  this._j._tools._grabThrowEnabled = isEnabled;
};

/**
 * Toggles whether or not grab and throw functionality is enabled.
 */
Game_System.prototype.toggleGrabThrowEnabled = function()
{
  this._j._tools._grabThrowEnabled = !this.isGrabThrowEnabled();
};