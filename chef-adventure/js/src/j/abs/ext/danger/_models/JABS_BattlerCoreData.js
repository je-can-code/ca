//region JABS_BattlerCoreData
/**
 * Extends the `initMembers()` function to include our new data.
 */
J.ABS.EXT.DANGER.Aliased.JABS_BattlerCoreData.set('initMembers', JABS_BattlerCoreData.prototype.initMembers);
JABS_BattlerCoreData.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.JABS_BattlerCoreData.get('initMembers').call(this);

  /**
   * Whether or not this battler's danger indicator will be visible.
   * @type {boolean} True if the battler's danger indicator should show, false otherwise.
   */
  this._showDangerIndicator = J.ABS.EXT.DANGER.Metadata.DefaultEnemyShowDangerIndicator;
};
/**
 * Sets whether or not to show the danger indicator.
 */
JABS_BattlerCoreData.prototype.setDangerIndicator = function(showDangerIndicator)
{
  this._showDangerIndicator = showDangerIndicator;
};

/**
 * Gets whether or not this battler's danger indicator will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showDangerIndicator = function()
{
  // danger indicators NEVER show on inanimate enemies.
  if (this.isInanimate()) return false;

  return this._showDangerIndicator;
};
//endregion JABS_BattlerCoreData