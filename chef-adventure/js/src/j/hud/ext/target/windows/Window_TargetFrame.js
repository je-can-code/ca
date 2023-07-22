//region Window_TargetFrame
/**
 * A window that displays a target and their relevant information.
 */
class Window_TargetFrame extends Window_Base
{
  /**
   * The maximum possible duration in frames.
   * @type {number}
   */
  static MaxDuration = 180;

  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Initializes the properties of this class.
   * @param {Rectangle} rect The rectangle representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // add our extra data points to track.
    this.initMembers();

    // run any one-time configuration changes.
    this.configure();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The over-arching object that contains all properties for this plugin.
     */
    this._j ||= {};

    /**
     * The cached collection of sprites.
     * @type {Map<string, Sprite_Icon|Sprite>}
     */
    this._j._spriteCache = new Map();

    /**
     * The name to display in the name field.
     *
     * NOTE:
     * This is separated out from the battler data itself so that it can be
     * separately assigned to something different if the dev wanted to.
     * @type {string}
     */
    this._j._name = String.empty;

    /**
     * The second line associated with the target.
     * Optional.
     * @type {string}
     */
    this._j._text = String.empty;

    /**
     * The icon that this target has.
     * @type {number}
     */
    this._j._icon = 0;

    /**
     * The battler of the target.
     * @type {Game_Actor|Game_Enemy}
     */
    this._j._battler = null;

    /**
     * Whether or not this window requires a target update.
     * @type {boolean}
     */
    this._j._requestTargetRefresh = true;

    /**
     * The duration until this window is deemed inactive.
     * @type {number}
     */
    this._j._inactivityTimer = 0;
  }

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;

    // build the image cache for the first time.
    this.refreshCache();
  }

  //region caching
  /**
   * Empties and recreates the entire cache of sprites.
   */
  refreshCache()
  {
    // destroy and empty all sprites within the cache.
    this.emptyCache();

    // recreate all sprites for the cache.
    this.createCache();
  }

  /**
   * Empties the cache of all sprites.
   */
  emptyCache()
  {
    // iterate over each sprite and destroy it properly.
    this._j._spriteCache.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._j._spriteCache.clear();
  }

  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // cache the target hp gauge.
    this.getOrCreateTargetHpGaugeSprite();

    // cache the target mp gauge.
    this.getOrCreateTargetMpGaugeSprite();

    // cache the target tp gauge.
    this.getOrCreateTargetTpGaugeSprite();
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetHpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-hp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.HpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetMpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-mp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.MpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetTpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `targetframe-enemy-tp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.rotation = J.HUD.EXT.TARGET.Metadata.TpGaugeRotation * (Math.PI / 180);
    sprite.scale.x = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleX;
    sprite.scale.y = J.HUD.EXT.TARGET.Metadata.TpGaugeScaleY;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  /**
   * Sets the target that this window should be tracking.
   * @param {FramedTarget} target The name of the target.
   */
  setTarget(target)
  {
    // assign the newly provided data.
    this._j._name = target.name;
    this._j._text = target.text;
    this._j._icon = target.icon;
    this._j._battler = target.battler;
    this._j._configuration = target.configuration;

    // refresh the contents of the window to reflect the changes.
    this.refresh();
  }

  /**
   * Sets whether or not this window needs to refresh its target.
   */
  requestTargetRefresh()
  {
    this._j._requestTargetRefresh = true;
  }

  /**
   * Gets whether or not this window needs to refresh its target.
   * @returns {boolean}
   */
  hasRequestTargetRefresh()
  {
    return this._j._requestTargetRefresh;
  }

  /**
   * Acknowledges the request to refresh the target of this window.
   */
  acknowledgeTargetRefresh()
  {
    this._j._requestTargetRefresh = false;
  }

  /**
   * Gets the name of the current target of this window.
   * @returns {string}
   */
  targetName()
  {
    return this._j._name;
  }

  /**
   * Gets the extra line of information for the current target of this window.
   * @returns {string|String.empty}
   */
  targetText()
  {
    return this._j._text;
  }

  /**
   * Gets the icon of the current target of this window.
   * @returns {number}
   */
  targetIcon()
  {
    return this._j._icon;
  }

  /**
   * Gets the configuration of the current target.
   * @returns {FramedTargetConfiguration|null}
   */
  targetConfiguration()
  {
    return this._j._configuration;
  }

  /**
   * Refreshes the contents of this window.
   */
  refresh()
  {
    // clear out the window contents.
    this.contents.clear();

    // reset the timer for fading.
    this.resetInactivityTimer();

    // request a refresh of the target of this window.
    this.requestTargetRefresh();

    // rebuilds the contents of the window.
    this.updateTarget();
  }

  /**
   * Resets the inactivity timer back to max.
   */
  resetInactivityTimer()
  {
    this._j._inactivityTimer = Window_TargetFrame.MaxDuration;
  }

  /**
   * Hooks into the update cycle for updating this window.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update the window logic.
    this.updateTarget();
  }

  /**
   * Updates the target of this window as-necessary.
   */
  updateTarget()
  {
    // check if we have a request to refresh this target frame inactivity timer.
    if ($hudManager.hasRequestTargetFrameRefreshInactivityTimer())
    {
      // reset it if we do.
      this.resetInactivityTimer();

      // acknowledge the request.
      $hudManager.acknowledgeTargetFrameInactivityTimerRefresh();
    }

    // manage inactivity timers and visibility.
    this.handleInactivity();

    // check if the target this window is tracking needs updating.
    if (this.needsTargetUpdate())
    {
      // determine base coordinates.
      const x = 0;
      const y = 0;

      // draw the target data.
      this.drawContent(x, y);

      // acknowledge the request to refresh the target.
      this.acknowledgeTargetRefresh();
    }
  }

  drawContent(x, y)
  {
    // draw the name of the target.
    this.drawTargetName(x, y);

    // draw the level of the target.
    this.drawTargetLevel(x+220, y);

    // draw the extra data for the target.
    this.drawTargetExtra(x, y+24);

    // draw the relation of the target.
    this.drawTargetIcon(x, y+48);

    // draw the battler data of the target- if available.
    this.drawTargetBattlerInfo(x+32, y);
  }

  /**
   * Handles inactivity of this window.
   * Counts down the inactivity timer and manages visibility as-necessary.
   */
  handleInactivity()
  {
    // countdown the timer.
    this._j._inactivityTimer--;

    // check if we have <1 second left before this goes inactive.
    if (this._j._inactivityTimer < 60)
    {
      this.fadeOutWindow();
    }
    else
    {
      this.fadeInWindow();
    }
  }

  /**
   * Fades out the target frame window along with all sprites and content.
   */
  fadeOutWindow()
  {
    this.opacity -= 10;
    this.backOpacity -= 10;
    this.contentsOpacity -= 10;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);
  }

  /**
   * Fades in the target frame window along with all sprites and content.
   */
  fadeInWindow()
  {
    this.opacity += 40;
    this.backOpacity += 40;
    this.contentsOpacity += 40;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity += 40);
  }

  /**
   * Determines whether or not the target data should be updated.
   * @returns {boolean} True if it needs an update, false otherwise.
   */
  needsTargetUpdate()
  {
    if (!this.hasRequestTargetRefresh()) return false;

    return true;
  }

  /**
   * Draws the target's name in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetName(x, y)
  {
    let name = `\\FS[24]${this.targetName()}`;
    if (J.MESSAGE)
    {
      name = `\\*`+ name;
    }

    this.drawTextEx(name, x, y, 200);
  }

  /**
   * Draws the target's level in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetLevel(x, y)
  {
    // don't draw level if we can't.
    if (!this.canDrawTargetLevel()) return;

    // get the level from the battler.
    const {level} = this._j._battler;

    // check to see if the enemy is leveled.
    if (level)
    {
      // build the level string.
      const levelString = `\\FS[14]Lv.${level.padZero(3)}`;

      // and draw it to the window.
      this.drawTextEx(levelString, x, y, 200);
    }
  }

  /**
   * Determines whether or not we can draw the level of the target.
   * @returns {boolean} True if we can draw levels, false otherwise.
   */
  canDrawTargetLevel()
  {
    // if we don't have our level system, then don't draw levels.
    if (!J.LEVEL) return false;

    // if we don't have a battler as the target, then don't draw levels.
    if (!this._j._battler) return false;

    // draw levels!
    return true;
  }

  /**
   * Draws the target's extra information in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetExtra(x, y)
  {
    // if there is no text to draw, don't try to draw it.
    if (!this.hasTargetText()) return;

    // draw the extra text.
    this.drawTextEx(`\\FS[14]${this.targetText()}`, x, y, 200);
  }

  /**
   * Determine whether or not we have extra text to draw for the current target.
   * @returns {boolean}
   */
  hasTargetText()
  {
    // if we have an empty string for the text, then lets not draw it.
    if (!this.targetText()) return false;

    // return the truth.
    return true;
  }

  /**
   * Draws the target's icon in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetIcon(x, y)
  {
    // check if we have an icon to draw.
    if (!this.hasTargetIcon()) return;

    // draw the target's icon.
    this.drawIcon(this.targetIcon(), x, y+4);
  }

  /**
   * Determines whether or not we have an icon to draw for the current target.
   * @returns {boolean}
   */
  hasTargetIcon()
  {
    // if we have 0 icon index, then lets not draw one.
    if (!this.targetIcon()) return false;

    // return the truth.
    return true;
  }

  /**
   * Draws the target's battler data- if present- in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetBattlerInfo(x, y)
  {
    // validate that we have a battler to draw data for.
    if (this._j._battler)
    {
      // determine the corrected X coordinate.
      const currentX = x + this.targetBattlerGaugesX();

      // determine the corrected Y coordinate.
      const currentY = y + this.targetBattlerGaugesY();

      // draw the gauges at the desginated coordinates.
      this.drawTargetBattlerGauges(currentX, currentY);
    }
    // if we do not have a battler, then hide everything.
    else
    {
      // clear/hide the gauge data.
      this._j._spriteCache.forEach(value => value.hide());
    }
  }

  /**
   * Calculate the X coordinate for gauges.
   * @returns {number}
   */
  targetBattlerGaugesX()
  {
    // if there is an icon in the way, then move the gauges out.
    if (this.hasTargetIcon())
    {
      // move it respectively to the icon width.
      return ImageManager.iconWidth;
    }

    // otherwise, we have no modifiers.
    return -8;
  }

  /**
   * Calculate the Y coordinate for gauges.
   * @returns {number}
   */
  targetBattlerGaugesY()
  {
    // if this target had extra text, then move the gauges down
    if (this.hasTargetText())
    {
      // move it down a bit more than usual.
      return 64;
    }

    // don't move it down as much..
    return 44;
  }

  /**
   * Draws the target's various gauges.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetBattlerGauges(x, y)
  {
    // draw all three of the primary gauges.
    this.drawTargetHpGauge(x, y);
    this.drawTargetMpGauge(x, y+22);
    this.drawTargetTpGauge(x-10, y+32);
  }

  /**
   * Draws the hp gauge of the target.
   */
  drawTargetHpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetHpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showHp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.HP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }

  /**
   * Draws the mp gauge of the target.
   */
  drawTargetMpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetMpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showMp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.MP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }

  /**
   * Draws the tp gauge of the target.
   */
  drawTargetTpGauge(x, y)
  {
    // grab the gauge to draw.
    const gauge = this.getOrCreateTargetTpGaugeSprite();

    // don't draw the gauge if its disabled.
    if (!this.targetConfiguration().showTp)
    {
      gauge.hide();
      return;
    }

    // setup the gauge with the battler.
    gauge.setup(this._j._battler, Sprite_FlowingGauge.Types.TP);

    // relocate the gauge sprite.
    gauge.move(x, y);
  }
}
//endregion Window_TargetFrame