//region JABS_Battler
/**
 * Extends `initCoreData()` to include our danger indicator flag.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data of the battler.
 */
J.ABS.EXT.DANGER.Aliased.JABS_Battler.set('initCoreData', JABS_Battler.prototype.initCoreData);
JABS_Battler.prototype.initCoreData = function(battlerCoreData)
{
  /**
   * Whether or not this battler's danger indicator is visible.
   * Inanimate battlers do not show by default.
   * @type {boolean}
   */
  this._showDangerIndicator = battlerCoreData.isInanimate()
    ? false
    : battlerCoreData.showDangerIndicator();

  // perform original logic.
  J.ABS.EXT.DANGER.Aliased.JABS_Battler.get('initCoreData').call(this, battlerCoreData);
};
/**
 * Gets whether or not this battler should show its danger indicator.
 * @returns {boolean}
 */
JABS_Battler.prototype.showDangerIndicator = function()
{
  return this._showDangerIndicator;
};
//endregion JABS_Battler