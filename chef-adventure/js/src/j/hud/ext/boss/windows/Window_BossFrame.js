//region Window_BossFrame
class Window_BossFrame extends Window_TargetFrame
{
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    this._j._hud ||= {};

    this._j._hud._boss = {};

    this._j._hud._boss._requestHide = false;

    this._j._hud._boss._concealing = false;

    this._j._hud._boss._requestShow = false;

    this._j._hud._boss._revealing = false;
  }

  requestHideBossFrame()
  {
    this._j._hud._boss._requestHide = true;

    this.beginConcealing();
  }

  beginConcealing()
  {
    this._j._hud._boss._concealing = true;
  }

  endConcealing()
  {
    this._j._hud._boss._concealing = false;

    this.acknowledgeBossFrameHidden();
  }

  acknowledgeBossFrameHidden()
  {
    this._j._hud._boss._requestHide = false;
  }

  isStillConcealing()
  {
    return this._j._hud._boss._concealing;
  }

  requestShowBossFrame()
  {
    this._j._hud._boss._requestShow = true;

    this.beginRevealing();
  }

  beginRevealing()
  {
    this._j._hud._boss._revealing = true;
  }

  endRevealing()
  {
    this._j._hud._boss._revealing = false;
  }

  isStillRevealing()
  {
    return this._j._hud._boss._revealing;
  }

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // cache the target hp gauge.
    this.getOrCreateTargetHpGaugeSprite();

    // remove the mp/tp gauges for bosses.
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetHpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `bossframe-enemy-hp-gauge`;

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
    sprite.scale.x = 10;
    sprite.scale.y = 1;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  handleInactivity()
  {
    // boss frames don't go inactive.
  }

  update()
  {
    super.update();

    this.manageBossFrameVisibility();
  }

  manageBossFrameVisibility()
  {
    if (this.isStillConcealing())
    {
      this.fadeOutWindow();
    }

    if (this.isStillRevealing())
    {
      this.fadeInWindow();
    }
  }

  /**
   * Fades out the boss frame window along with all sprites and content.
   */
  fadeOutWindow()
  {
    // perform original logic.
    this.contentsOpacity -= 10;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);

    // verify the opacities.
    const contentsOpacityZero = this.contentsOpacity <= 0;

    // determine if this frame is done concealing.
    const doneFading = (contentsOpacityZero);

    // check if we're done concealing.
    if (doneFading)
    {
      // end the concealment process.
      this.endConcealing();
    }
  }

  /**
   * Fades in the boss frame window along with all sprites and content.
   */
  fadeInWindow()
  {
    // perform original logic.
    this.contentsOpacity += 40;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity += 40);

    // verify the opacities.
    const contentsOpacityMax = this.contentsOpacity >= 255;

    // determine if this frame is done revealing.
    const doneShowing = (contentsOpacityMax);

    // check if we're done revealing.
    if (doneShowing)
    {
      // end the revealment process.
      this.endRevealing();
    }
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

    const textWidth = this.textWidth(name);

    const centerX = (this.contentsWidth() / 2) - (textWidth / 2);

    this.drawTextEx(name, centerX, y, textWidth);
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
  }
}
//endregion Window_BossFrame