//region Window_InputFrame
/**
 * A window displaying available skills and button inputs.
 */
class Window_InputFrame extends Window_Frame
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
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

    /**
     * The battler of which to track inputs for.
     * @type {Game_Actor}
     */
    this._j._battler = null;

    /**
     * Whether or not the window needs a refresh internally.
     * This is toggled after all draws are executed and tracked to
     * prevent unnecessary redraws.
     * @type {boolean}
     */
    this._j._needsRefresh = true;
  }

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // perform original logic.
    super.configure();

    // remove opacity for completely transparent window.
    this.opacity = 0;
  }

  /**
   * Requests this window to clear and redraw its contents.
   */
  requestInternalRefresh()
  {
    this._j._needsRefresh = true;
  }

  /**
   * Gets whether or not this window needs refresh.
   * @returns {boolean}
   */
  needsInternalRefresh()
  {
    return this._j._needsRefresh;
  }

  /**
   * Flags internally this window for successfully refreshing text.
   */
  acknowledgeInternalRefresh()
  {
    this._j._needsRefresh = false;
  }

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // perform original logic.
    super.createCache();
  }

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySlotSpriteKey(skillSlot, inputType)
  {
    return `inputkey-${$gameParty.leader().actorId()}-${inputType}`;
  }

  /**
   * Creates the input key sprite for the given slot.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_InputKeySlot}
   */
  getOrCreateInputKeySlotSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySlotSpriteKey(skillSlot, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_InputKeySlot(
      skillSlot,
      $jabsEngine.getPlayer1());

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  /**
   * Refreshes the contents of this window.
   */
  refresh()
  {
    // clear out the window contents.
    this.contents.clear();

    // rebuilds the contents of the window.
    this.requestInternalRefresh();
  }

  /**
   * Hide all sprites for the hud.
   */
  hideSprites()
  {
    // hide all the sprites.
    this._j._spriteCache.forEach((sprite, _) => sprite.hide());

    this.requestInternalRefresh();
  }

  /**
   * Updates the logic for this window frame.
   */
  updateFrame()
  {
    // perform original logic.
    super.updateFrame();

    // handle the visibility of the hud for dynamic interferences.
    this.manageVisibility();

    // draw the contents.
    this.drawInputFrame();
  }

  //region visibility
  /**
   * Manages visibility for the hud.
   */
  manageVisibility()
  {
    // handle interference from the message window popping up.
    this.handleMessageWindowInterference();

    // check if the player is interfering with visibility.
    if (this.playerInterference())
    {
      // if so, adjust opacity accordingly.
      this.handlePlayerInterference();
    }
    // the player isn't interfering.
    else
    {
      // undo the opacity changes.
      this.revertInterferenceOpacity();
    }
  }

  /**
   * Close and open the window based on whether or not the message window is up.
   */
  handleMessageWindowInterference()
  {
    // check if the message window is up.
    if ($gameMessage.isBusy() || $gameMap.isEventRunning())
    {
      // check to make sure we haven't closed this window yet.
      if (!this.isClosed())
      {
        // hide all the sprites.
        this.hideSprites();

        // and close the window.
        this.close();
      }
    }
    // otherwise, the message window isn't there.
    else
    {
      // just open the window.
      this.open();
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
    return (playerX < this.width+100) && (playerY < this.height+100);
  }

  /**
   * Manages opacity for all sprites while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    this._j._spriteCache.forEach((sprite, _) =>
    {
      // if we are above 64, rapidly decrement by -15 until we get below 64.
      if (sprite.opacity > 64) sprite.opacity -= 15;
      // if we are below 64, increment by +1 until we get to 64.
      else if (sprite.opacity < 64) sprite.opacity += 1;
    });
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  revertInterferenceOpacity()
  {
    this._j._spriteCache.forEach((sprite, _) =>
    {
      // if we are below 255, rapidly increment by +15 until we get to 255.
      if (sprite.opacity < 255) sprite.opacity += 15;
      // if we are above 255, set to 255.
      else if (sprite.opacity > 255) sprite.opacity = 255;
    });
  }
  //endregion visibility

  /**
   * The rough estimate of width for a single input key and all its subsprites.
   * @returns {number}
   */
  inputKeyWidth()
  {
    return 72;
  }

  inputKeyHeight()
  {
    return 96;
  }

  /**
   * Draws the input frame window in its entirety.
   */
  drawInputFrame()
  {
    // don't draw if we don't need to draw.
    if (!this.canDrawInputFrame()) return;

    // wipe the drawn contents.
    this.contents.clear();

    // hide all the sprites.
    this._j._spriteCache.forEach((sprite =>
    {
      sprite.hide();
      sprite.drawInputKey();
    }));

    if (J.HUD.EXT.INPUT.Metadata.UseGamepadLayout)
    {
      // draw the inputs.
      this.drawGamepadStyleInputKeys();
    }
    else
    {
      // draw the inputs.
      this.drawKeyboardStyleInputKeys();
    }

    // flags that this has been refreshed.
    this.acknowledgeInternalRefresh();
  }

  /**
   * Determines whether or not we can draw the input frame.
   * @returns {boolean} True if we can, false otherwise.
   */
  canDrawInputFrame()
  {
    // if the leader is not present or available, we cannot draw.
    if (!$gameParty.leader()) return false;

    // if we cannot draw the hud, we cannot draw.
    if (!$hudManager.canShowHud()) return false;

    // if we are JAFTING, we cannot draw.
    if ($gameSystem.isJafting()) return false;

    // if we don't need to draw it, we cannot draw.
    if (!this.needsInternalRefresh()) return false;

    // draw it!
    return true;
  }

  /**
   * Draws the inputs to be more console-style with a gamepad layout.
   */
  drawGamepadStyleInputKeys()
  {
    // our origin x:y coordinates.
    const x = 0;
    const y = 0;

    // draw the primary section of our input.
    this.drawGamepadPrimaryInputKeys(x, y);

    // draw the secondary section of our input.
    this.drawGamepadSecondaryInputKeys(x+250, y);
  }

  /**
   * Draws the inputs to be more PC-style with a keyboard layout.
   */
  drawKeyboardStyleInputKeys()
  {
    // our origin x:y coordinates.
    const ikw = this.inputKeyWidth();
    const x = 0;
    const y = 0;

    // draw the primary section of our input.
    this.drawKeyboardPrimaryInputKeys(x, y);

    // draw the secondary section of our input.
    const keyboardSecondaryX = x + (ikw*4) + 24;
    this.drawKeyboardSecondaryInputKeys(keyboardSecondaryX, y);
  }

  /**
   * Draws the primary set of input keys.
   * This includes: mainhand, offhand, dodge, and tool input keys.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawGamepadPrimaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the four basic core functions of JABS.
    this.drawInputKey(JABS_Button.Mainhand, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.Offhand, baseX+(ikw*1), baseY+32);
    this.drawInputKey(JABS_Button.Dodge, baseX+(ikw*2), baseY+64);
    this.drawInputKey(JABS_Button.Tool, baseX+(ikw*2), baseY);
  }

  /**
   * Draws the primary set of input keys.
   * This includes: all L1 and R1 combo inputs.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawGamepadSecondaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the combat skills equipped for JABS.
    this.drawInputKey(JABS_Button.CombatSkill3, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.CombatSkill4, baseX+(ikw*1), baseY);
    this.drawInputKey(JABS_Button.CombatSkill1, baseX+(ikw*1), baseY+64);
    this.drawInputKey(JABS_Button.CombatSkill2, baseX+(ikw*2), baseY+32);
  }

  drawKeyboardPrimaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the four basic core functions of JABS.
    this.drawInputKey(JABS_Button.Mainhand, baseX + ikw*0, baseY);
    this.drawInputKey(JABS_Button.Offhand, baseX + ikw*1, baseY);
    this.drawInputKey(JABS_Button.Dodge, baseX + ikw*2, baseY);
    this.drawInputKey(JABS_Button.Tool, baseX + ikw*3, baseY);
  }

  drawKeyboardSecondaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the combat skills equipped for JABS.
    this.drawInputKey(JABS_Button.CombatSkill1, baseX + ikw*0, baseY);
    this.drawInputKey(JABS_Button.CombatSkill2, baseX + ikw*1, baseY);
    this.drawInputKey(JABS_Button.CombatSkill3, baseX + ikw*2, baseY);
    this.drawInputKey(JABS_Button.CombatSkill4, baseX + ikw*3, baseY);
  }

  /**
   * Draws a single input key of the input frame.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKey(inputType, x, y)
  {
    // shorthand the player's JABS battler data.
    const jabsPlayer = $jabsEngine.getPlayer1();

    // grab the cooldown data and the skillslot data from the leader based on the slot.
    const actionKeyData = jabsPlayer.getActionKeyData(inputType);

    // if we have no action key data for this slot, don't draw it.
    if (!actionKeyData) return;

    // extract the input key's data.
    const skillSlot =  actionKeyData.skillslot;

    // draw the input key slot's sprite.
    this.drawInputKeySlotSprite(skillSlot, inputType, x, y);
  }

  /**
   * Draw the input key associated with a given skill slot.
   * @param {JABS_SkillSlot} skillSlot The skill slot to draw.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySlotSprite(skillSlot, inputType, x, y)
  {
    const sprite = this.getOrCreateInputKeySlotSprite(skillSlot, inputType);

    if (!skillSlot.isEmpty())
    {
      const width = this.inputKeyWidth() - 10;
      const height = this.inputKeyHeight();
      const c1 = ColorManager.itemBackColor1();
      const c2 = ColorManager.itemBackColor2();
      this.contents.gradientFillRect(x-10, y+20, width, height, c1, c2, true);
    }

    sprite.show();
    sprite.move(x+6, y+20);
  }
}
//endregion Window_InputFrame