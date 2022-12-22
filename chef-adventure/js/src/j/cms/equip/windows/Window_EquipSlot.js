//region Window_EquipSlot
/**
 * Extends the `.initialize()` to include tracking for the more equip data window.
 */
J.CMS_E.Aliased.Window_EquipSlot.initialize = Window_EquipSlot.prototype.initialize;
Window_EquipSlot.prototype.initialize = function(rect)
{
  J.CMS_E.Aliased.Window_EquipSlot.initialize.call(this, rect);
  /**
   * The more data window to manipulate.
   * @type {Window_MoreEquipData}
   */
  this._moreDataWindow = null;
};

/**
 * Refreshes the more data window.
 */
Window_EquipSlot.prototype.refreshMoreData = function()
{
  this.onIndexChange();
};

/**
 * Updates the "more" window to point to the new index's item.
 */
Window_EquipSlot.prototype.onIndexChange = function()
{
  this._moreDataWindow.setItem(this.item());
};

/**
 * Associates the more equip data window to this one for observation.
 * @param {Window_MoreEquipData} moreDataWindow The window to attach to this.
 */
Window_EquipSlot.prototype.setMoreDataWindow = function(moreDataWindow)
{
  this._moreDataWindow = moreDataWindow;
};
//endregion Window_EquipSlot