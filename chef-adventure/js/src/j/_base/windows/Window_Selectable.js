//region Window_Selectable
/**
 * Weaves in the "more data window" at the highest level of selectable.
 *
 * It can be added to any window that extends this or its subclasses.
 */
J.BASE.Aliased.Window_Selectable.initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(rect)
{
  J.BASE.Aliased.Window_Selectable.initialize.call(this, rect);
  /**
   * The "more data" window. Used for further elaborating on a particular selection.
   *
   * @type {Window_MoreData}
   */
  this._moreDataWindow = null;
};

J.BASE.Aliased.Window_Selectable.processHandling = Window_Selectable.prototype.processHandling;
Window_Selectable.prototype.processHandling = function()
{
  if (this.isOpenAndActive())
  {
    if (this.isMoreEnabled() && this.isMoreTriggered())
    {
      return this.processMore();
    }
  }

  return J.BASE.Aliased.Window_Selectable.processHandling.call(this);
};

/**
 * Gets whether or not "more" data has been provided.
 * @returns {boolean}  True if "more" is handled, false otherwise.
 */
Window_Selectable.prototype.isMoreEnabled = function()
{
  return this.isHandled("more");
};

/**
 * Gets whether or not the "more" button is pressed/held.
 * @returns {boolean} True if the "more" button is pressed/held, false otherwise.
 */
Window_Selectable.prototype.isMoreTriggered = function()
{
  return this._canRepeat ? Input.isRepeated("shift") : Input.isTriggered("shift");
};

/**
 * Processes the "more" functionality.
 */
Window_Selectable.prototype.processMore = function()
{
  this.playCursorSound();
  this.updateInputData();
  this.callMoreHandler();
};

/**
 * Calls the given handler provided by the "more" symbol.
 */
Window_Selectable.prototype.callMoreHandler = function()
{
  this.callHandler("more");
};

/**
 * Extends the `.select()` to include a hook for executing logic onIndexChange.
 */
J.BASE.Aliased.Window_Selectable.select = Window_Selectable.prototype.select;
Window_Selectable.prototype.select = function(index)
{
  const previousIndex = this._index;
  J.BASE.Aliased.Window_Selectable.select.call(this, index);
  if (previousIndex !== this._index)
  {
    this.onIndexChange();
  }
};

/**
 * Designed for overriding to weave in functionality on-change of the index.
 *
 * NOTE: This executes AFTER the index has changed.
 */
Window_Selectable.prototype.onIndexChange = function()
{
};
//endregion Window_Selectable