//region Window_MapLog
/**
 * A window containing the logs.
 */
class Window_MapLog extends Window_Command
{
  /**
   * The height of one row; 16.
   * @type {number}
   * @static
   */
  static rowHeight = 16;

  /**
   * The in-window tracking of how long before we reduce opacity for inactivity.
   * @type {number}
   */
  inactivityTimer = 300;

  /**
   * The duration of which the inactivity timer will be refreshed to.
   * @type {number}
   */
  defaultInactivityDuration = J.LOG.Metadata.InactivityTimerDuration;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Sets the default inactivity max duration. Changing this will change how long
   * the logs remain visible.
   * @param {number} duration The new duration for how long logs remain visible.
   */
  setDefaultInactivityDuration(duration)
  {
    this.defaultInactivityDuration = duration;
  }

  /**
   * OVERWRITE Initialize this class, but with our things, too.
   * @param {Rectangle} rect The rectangle representing the shape of this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // run our one-time setup and configuration.
    this.configure();
  }

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;

    // fix the arrows presence to be false by default.
    this.downArrowVisible = false;
    this.upArrowVisible = false;
  }

  //region overwrites
  isScrollEnabled()
  {
    if (!$gameTextLog.isVisible()) return false;

    return true;
  }

  /**
   * OVERWRITE Forces the arrows that appear in scrollable windows to not be visible.
   */
  updateArrows()
  {
  }

  /**
   * Extends the scroll functionality to also refresh the timer to prevent this window
   * from going invisible while perusing the logs.
   * @param {number} x The x coordinate to scroll to.
   * @param {number} y The y coordinate to scroll to.
   */
  smoothScrollTo(x, y)
  {
    // perform original logic.
    super.smoothScrollTo(x, y);

    // forces the window to show if scrolling through it.
    this.showWindow();
  }

  /**
   * OVERWRITE Make our rows narrow-er.
   * @returns {number} The height of each row.
   */
  itemHeight()
  {
    return Window_MapLog.rowHeight;
  }

  /**
   * Overwrites {@link #drawBackgroundRect}.
   * Prevents the rendering of the backdrop of each line in the window.
   * @param {Rectangle} _ The rectangle to draw the background for.
   */
  drawBackgroundRect(_)
  {
  }

  /**
   * Extends the `itemRectWithPadding()` function to move the rect a little
   * to the left to look a bit cleaner.
   * @param {number} index The index of the item in the window.
   * @returns {Rectangle}
   */
  itemRectWithPadding(index)
  {
    const rect = super.itemRectWithPadding(index);
    rect.x -= 16;
    return rect;
  }

  /**
   * OVERWRITE Reduces the size of the icons being drawn in the log window.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {number} x The x coordinate to draw the icon at.
   * @param {number} y The y coordinate to draw the icon at.
   */
  drawIcon(iconIndex, x, y)
  {
    // just copy-paste of the icon drawing variable math.
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;

    // the last two parameters reduce the size of the icon to a smaller size.
    // this allows the icons to not look so clumsy in the log.
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, 16, 16);
  }

  /**
   * Extends the draw-icon processing for this window to slightly adjust how
   * icons are drawn since we're also drawing em good and smol.
   * @param {number} iconIndex The index of the icon to draw.
   * @param {rm.types.TextState} textState The rolling state of the text being drawn.
   */
  processDrawIcon(iconIndex, textState)
  {
    // before drawing the icon, draw it a bit lower since its smaller.
    textState.y += 8;

    // draw the icon.
    super.processDrawIcon(iconIndex, textState);

    // move the text state back up to where it was before.
    textState.y -= 8;

    // because we didn't draw a full-sized icon, we move the textState.x back a bit.
    textState.x -= 16;
  }
  //endregion overwrites

  /**
   * Update this window's drawing and the like.
   */
  update()
  {
    // process original update logic.
    super.update();

    // update our log data.
    this.updateMapLog();
  }

  /**
   * Perform the update logic that maintains this window.
   */
  updateMapLog()
  {
    // manage the incoming logging.
    this.updateLogging();

    // manage the visibility of this window.
    this.updateVisibility();
  }

  //region update logging
  /**
   * The update of the logging.
   * The processing of incoming messages, and updating the contents of this window
   * occur thanks to this function.
   */
  updateLogging()
  {
    // check if we have a need to update.
    if (this.shouldUpdate())
    {
      // process the logs.
      this.processNewLogs();

      // acknowledge the new logs.
      $gameTextLog.acknowledgeNewLog();
    }
  }

  /**
   * Determines whether or not this window should update.
   * @returns {boolean} True if we need to redraw the contents, false otherwise.
   */
  shouldUpdate()
  {
    // check if we have a new log.
    return $gameTextLog.hasNewLog();
  }

  /**
   * Process all new logs.
   */
  processNewLogs()
  {
    // perform any logic for when a new log is added.
    this.onLogChange();

    // refreshing will redraw based on the updated list.
    this.refresh();
  }

  /**
   * Processes effects whenever a change in the logs occurs.
   * Occurs before the window is refreshed.
   * Open for extension.
   */
  onLogChange()
  {
    this.showWindow();
  }

  /**
   * Draws all items in the log.
   */
  makeCommandList()
  {
    this.drawLogs();
  }

  /**
   * Draws all items from the log tracker into our command window.
   */
  drawLogs()
  {
    // iterate over each log.
    $gameTextLog.getLogs().forEach((log, index) =>
    {
      // add the message as a "command" into the log window.
      this.addCommand(`\\FS[14]${log.message()}`, `log-${index}`, true, null, null, 0);
    });

    // after drawing all the logs, scroll to the bottom.
    this.smoothScrollDown(this._list.length);
  }
  //endregion update logging

  //region update visibility
  /**
   * Updates the visibility of the window.
   * Uses an inactivity timer to countdown and eventually reduce opacity once
   * a certain threshold is reached.
   */
  updateVisibility()
  {
    // if the text log is flagged as hidden, then don't show it.
    if (!$gameTextLog.isVisible() || $gameMessage.isBusy())
    {
      this.hideWindow();
      return;
    }

    // decrement the timer.
    this.decrementInactivityTimer();

    // if the timer is at or below 100, then
    if (this.inactivityTimer <= 60)
    {
      // fade the window accordingly.
      this.fadeWindow();
    }
    else if (this.playerInterference())
    {
      this.handlePlayerInterference();
    }
    else
    {
      this.revertInterferenceOpacity(this.inactivityTimer);
    }
  }

  /**
   * Determines whether or not the player is in the way (or near it) of this window.
   * @returns {boolean} True if the player is in the way, false otherwise.
   */
  playerInterference()
  {
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();
    return (playerX < this.width) && (playerY > this.y);
  }

  /**
   * Manages opacity for the window while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    // if we are above 64, rapidly decrement by -15 until we get below 64.
    if (this.contentsOpacity > 64) this.contentsOpacity -= 15;
    // if we are below 64, increment by +1 until we get to 64.
    else if (this.contentsOpacity < 64) this.contentsOpacity += 1;
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  revertInterferenceOpacity(currentDuration)
  {
    const num = currentDuration;
    this.showWindow();

    this.setInactivityTimer(num);
  }

  /**
   * Decrements the inactivity timer, by 1 by default.
   */
  decrementInactivityTimer(amount = 1)
  {
    // decrement the timer.
    this.inactivityTimer -= amount;
  }

  /**
   * Sets the duration of the inactivity timer.
   * @param {number} duration The duration to set the inactivity timer to; 300 by default.
   */
  setInactivityTimer(duration = this.defaultInactivityDuration)
  {
    this.inactivityTimer = duration;
  }

  /**
   * Fades this window out based on the inactivity timer.
   */
  fadeWindow()
  {
    // check if this is the "other" of every other frame.
    if (this.inactivityTimer % 2 === 0)
    {
      // reduce opacity if it is.
      this.contentsOpacity -= 12;
    }
    // otherwise, check if the timer is simply 0.
    else if (this.inactivityTimer === 0)
    {
      // and hide the window if it is.
      this.hideWindow();
    }
  }

  /**
   * Hides this window entirely.
   */
  hideWindow()
  {
    // force the timer to 0.
    this.setInactivityTimer(0);

    // hide the contents.
    this.contentsOpacity = 0;
  }

  /**
   * Shows this window.
   * Refreshes the inactivity timer to 5 seconds.
   * Typically used after the log window was hidden.
   */
  showWindow()
  {
    // if the text log is flagged as hidden
    if (!$gameTextLog.isVisible()) return;

    // refresh the timer back to 5 seconds.
    this.setInactivityTimer(this.defaultInactivityDuration);

    // refresh the opacity so the logs can be seen again.
    this.contentsOpacity = 255;
  }
  //endregion update visibility
}
//endregion Window_MapLog