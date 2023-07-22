//region Game_System
J.LEVEL.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
/**
 * Extends `initialize()` to include properties for this plugin.
 */
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_System.get('initialize').call(this);

  /**
   * The overarching _j object, where all my stateful plugin data is stored.
   */
  this._j ||= {};

  /**
   * Whether or not the level scaling is enabled.
   * @type {boolean}
   */
  this._j._levelScalingEnabled ||= J.LEVEL.Metadata.Enabled;
};

/**
 * Gets whether or not the level scaling is enabled.
 * @returns {boolean}
 */
Game_System.prototype.isLevelScalingEnabled = function()
{
  return this._j._levelScalingEnabled;
};

/**
 * Enables level scaling functionality.
 */
Game_System.prototype.enableLevelScaling = function()
{
  this._j._levelScalingEnabled = true;
};

/**
 * Disables level scaling functionality.
 */
Game_System.prototype.disableLevelScaling = function()
{
  this._j._levelScalingEnabled = false;
};
//endregion Game_System