/**
 * Extends {@link Game_Temp.prototype.initMembers}.
 * Intializes all additional members of this class.
 */
J.UTILS.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.UTILS.Aliased.Game_Temp.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._utils ||= {};

  /**
   * Whether or not to use the click-to-log-event functionality.
   * @type {boolean}
   */
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Gets whether or not to use the click-to-log-event functionality.
 * @returns {boolean}
 */
Game_Temp.prototype.canClickToLogEvent = function()
{
  return this._j._utils._useClickToLogEvent;
};

/**
 * Enables the click-to-log-event functionality.
 */
Game_Temp.prototype.enableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Disables the click-to-log-event functionality.
 */
Game_Temp.prototype.disableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = false;
};

Game_Temp.prototype.getAllArmorNames = function()
{
  const mapping = armor =>
  {
    if (!armor) return;

    if (armor.name.startsWith('===')) return;

    return {
      key: armor._key(),
      name: armor.name,
      description: armor.description
    };
  }

  return $dataArmors.map(mapping);
};