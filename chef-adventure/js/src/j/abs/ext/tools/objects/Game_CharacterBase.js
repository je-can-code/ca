/**
 * Extends {@link Game_CharacterBase.initMembers}.
 * Also initializes our new members.
 */
J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.get('initMembers').call(this);

  // initialize our class members.
  this.initToolsMembers();
};

Game_CharacterBase.prototype.initToolsMembers = function()
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
   * A grouping of all properties associated with the grab and throw tool functionality.
   */
  this._j._tools._grabThrow ||= {};

  this._j._tools._grabThrow._grab ||= {};

  this._j._tools._grabThrow._grab._enabled = false;

  this._j._tools._grabThrow._grab._wait = new JABS_Timer(0);

  this._j._tools._grabThrow._grab._check = false;

  this._j._tools._grabThrow._throw ||= {};

  this._j._tools._grabThrow._throw._enabled = false;

  this._j._tools._grabThrow._throw._through = false;

  this._j._tools._grabThrow._throw._directionFixAlways = false; // TODO: from plugin params.

  this._j._tools._grabThrow._throw._directionFix = false;

  this._j._tools._grabThrow._throw._range = 0;

  this._j._tools._grabThrow._throw._wait = new JABS_Timer(0);
};