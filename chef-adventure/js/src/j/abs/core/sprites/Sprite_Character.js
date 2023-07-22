//region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  this._j._abs._gauges ||= {};

  this._j._abs._gauges._castGauge = null;

  /**
   * Whether or not the map sprite setup has been completed.
   * @type {boolean}
   */
  this._j._abs._jabsBattlerSetupComplete = false;

  /**
   * The state overlay sprite associated with this character's battler.
   * @type {Sprite_StateOverlay|null}
   */
  this._j._stateOverlaySprite = null;

  /**
   * The hp gauge sprite associated with this character's battler.
   * @type {Sprite_MapGauge|null}
   */
  this._j._hpGauge = null;

  /**
   * The text sprite displaying the name of this character's battler.
   * @type {Sprite_BaseText|null}
   */
  this._j._battlerName = null;

  /**
   * The umbrella object for loot information.
   * @type {{}}
   */
  this._j._loot = {};

  /**
   * Whether or not the loot sprite setup has been completed.
   * @type {boolean}
   */
  this._j._loot._lootSetupComplete = false;

  /**
   * The icon sprite that represents this character if it is loot.
   * @type {Sprite_Icon|null}
   */
  this._j._loot._sprite = null;

  /**
   * Whether this is on the up or the down swing.
   * @type {boolean} True if on the upswing, false if on the downswing.
   */
  this._j._loot._swing = false;

  /**
   * The modified x coordinate to draw this character as a result of swinging.
   * @type {number}
   */
  this._j._loot._ox = 0;

  /**
   * The modified y coordinate to draw this character as a result of swinging.
   * @type {number}
   */
  this._j._loot._oy = 0;

  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('initMembers').call(this);
};

//region setup & reference
/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.ABS.Aliased.Sprite_Character.set('update', Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('update').call(this);

  // only update the jabs battler components if they have been initialized.
  if (this.isJabsBattlerReady())
  {
    // update the state overlay for this battler.
    this.updateStateOverlay();

    // update the gauges, if any, for this battler.
    this.updateGauges();

    // update the battler's name, if any.
    this.updateBattlerName();
  }

  // only update the loot components if they have been initialized.
  if (this.isLootReady())
  {
    // update the battler's name, if any.
    this.updateLootFloat();
  }
};

/**
 * Whether or not this map sprite has been setup with all its sprites yet.
 * @returns {boolean} True if this jabs battler has been established, false otherwise.
 */
Sprite_Character.prototype.isJabsBattlerReady = function()
{
  return this._j._abs._jabsBattlerSetupComplete;
};

/**
 * Give this map sprite setup a stamp of approval, indicating that it is
 * ready to be processed by our `update()` siblings/overlords!
 */
Sprite_Character.prototype.finalizeJabsBattlerSetup = function()
{
  this._j._abs._jabsBattlerSetupComplete = true;
};

/**
 * Returns the `Game_Battler` associated with the current sprite.
 * @returns {Game_Actor|Game_Enemy} The battler this sprite is bound to.
 */
Sprite_Character.prototype.getBattler = function()
{
  // check to make sure this is a JABS battler.
  if (this.isJabsBattler())
  {
    // grab the battler associated with this sprite.
    return this._character.getJabsBattler().getBattler();
  }
  // otherwise, this must be a regular sprite for an event.
  else return null;
};

/**
 * Gets whether or not this sprite belongs to a battler.
 * @returns {boolean} True if this sprite belongs to a battler, false otherwise.
 */
Sprite_Character.prototype.isJabsBattler = function()
{
  // if the character doesn't exist, or they are a vehicle, they aren't a battler.
  if (!this.character() || this.character() instanceof Game_Vehicle) return false;

  // return whether or not this has a battler attached to it.
  return !!this.character().hasJabsBattler();
};

/**
 * Whether or not this loot sprite has been setup with all its sprites yet.
 * @returns {boolean}  True if this loot has been established, false otherwise.
 */
Sprite_Character.prototype.isLootReady = function()
{
  return this._j._loot._lootSetupComplete;
};

/**
 * Give this loot sprite setup a stamp of approval, indicating that it is
 * ready to be processed by our `update()` siblings/overlords!
 */
Sprite_Character.prototype.finalizeLootSetup = function()
{
  this._j._loot._lootSetupComplete = true;
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdate = function()
{
  return $jabsEngine.absEnabled;
};

/**
 * If the "character" is actually a loot drop, don't identify it as empty for the purposes
 * of drawing the loot icon on the map.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ABS.Aliased.Sprite_Character.set('isEmptyCharacter', Sprite_Character.prototype.isEmptyCharacter);
Sprite_Character.prototype.isEmptyCharacter = function()
{
  // check if we're loot.
  return this.isLoot()
    // intercept for the case of loot, as it actually is a character to be updated!
    ? false
    // otherwise, perform original logic.
    : J.ABS.Aliased.Sprite_Character.get('isEmptyCharacter').call(this)
};

/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the battler sprite.
 * @param {Game_Character} character The character being assigned to this sprite.
 */
J.ABS.Aliased.Sprite_Character.set('setCharacter', Sprite_Character.prototype.setCharacter);
Sprite_Character.prototype.setCharacter = function(character)
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('setCharacter').call(this, character);

  // if the sprite changed, the JABS-related data probably changed, too.
  this.setupJabsSprite();
};

/**
 * Extends `setCharacterBitmap()` to perform on-graphic-change things.
 */
J.ABS.Aliased.Sprite_Character.set('setCharacterBitmap', Sprite_Character.prototype.setCharacterBitmap);
Sprite_Character.prototype.setCharacterBitmap = function()
{
  // perform original logic.
  J.ABS.Aliased.Sprite_Character.get('setCharacterBitmap').call(this);

  // if the sprite changed, the JABS-related data probably changed, too.
  this.setupJabsSprite();
};

/**
 * Setup this `Sprite_Character` with the additional JABS-related functionalities.
 */
Sprite_Character.prototype.setupJabsSprite = function()
{
  // if this is a battler, configure the visual components of the battler.
  this.handleBattlerSetup();

  // perform logic when the character's bitmap changes, like when an event page is changed.
  this.handleLootSetup();
};

/**
 * Handle battler setup for JABS-related data points.
 */
Sprite_Character.prototype.handleBattlerSetup = function()
{
  // check if this is a battler.
  if (this.isJabsBattler())
  {
    // setup the sprite with all the battler-related data points.
    this.setupMapSprite();
  }
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupMapSprite = function()
{
  // setup a state overlay sprite to display the state of a given battler.
  this.setupStateOverlay();

  // setup a gauge sprite to display
  this.setupHpGauge();

  // setup a text sprite to display the name of the battler on the map.
  this.setupBattlerName();

  // flag this character as finalized for the purpose of jabs battler-related updates.
  this.finalizeJabsBattlerSetup();
};
//endregion setup & reference

//region state overlay
/**
 * Sets up this character's state overlay, to show things like poison or paralysis.
 */
Sprite_Character.prototype.setupStateOverlay = function()
{
  // grab the battler of this character.
  const battler = this.getBattler();

  // check if we already have an overlay sprite available.
  if (this._j._stateOverlaySprite)
  {
    // assign the current battler to the overlay sprite.
    this._j._stateOverlaySprite.setup(battler);
  }
  // if we don't have an overlay, the build it.
  else
  {
    // create and assign the state overlay sprite..
    this._j._stateOverlaySprite = this.createStateOverlaySprite();

    // assign the current battler to the overlay sprite.
    this._j._stateOverlaySprite.setup(battler);

    // add it to this sprite's tracking.
    this.addChild(this._j._stateOverlaySprite);
  }
};

/**
 * Creates the sprite representing the overlay of the state on the map.
 * @returns {Sprite_StateOverlay} The overlay sprite, governing state for this character.
 */
Sprite_Character.prototype.createStateOverlaySprite = function()
{
  return new Sprite_StateOverlay();
};

/**
 * Updates the battler's overlay for states (if applicable).
 */
Sprite_Character.prototype.updateStateOverlay = function()
{
  // check if we can update the state overlay.
  if (this.canUpdateStateOverlay())
  {
    // update it.
    this.showStateOverlay();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideStateOverlay();
  }
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdateStateOverlay = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if this sprite doesn't even exist yet, then it shouldn't update.
  if (!this._j._stateOverlaySprite) return false;

  // we should update!
  return true;
};

/**
 * Shows the state overlay if it exists.
 */
Sprite_Character.prototype.showStateOverlay = function()
{
  this._j._stateOverlaySprite.show();
};

/**
 * Hides the state overlay if it exists.
 */
Sprite_Character.prototype.hideStateOverlay = function()
{
  this._j._stateOverlaySprite.hide();
};
//endregion state overlay

//region gauges
/**
 * Sets up this character's hp gauge, to show the hp bar as-needed.
 */
Sprite_Character.prototype.setupHpGauge = function()
{
  // check if we already have an hp gauge sprite available.
  if (!this._j._hpGauge)
  {
    // initialize the hp gauge as a generic map gauge.
    this._j._hpGauge = this.createGenericSpriteGauge();

    // add the sprite to tracking.
    this.addChild(this._j._hpGauge);
  }

  // assign the current battler to the hp gauge sprite.
  this._j._hpGauge.setup(this.getBattler(), "hp");

  // activate it the gauge.
  this._j._hpGauge.activateGauge();


  // locate the gauge below the character.
  this._j._hpGauge.move(
    -(this._j._hpGauge.bitmapWidth() / 1.5),
    -12);
};

/**
 * Creates a deactivated `Sprite_MapGauge` sprite yet to be setup.
 * @returns {Sprite_MapGauge}
 */
Sprite_Character.prototype.createGenericSpriteGauge = function()
{
  // generate a deactivated gauge.
  const sprite = new Sprite_MapGauge();
  sprite.deactivateGauge();

  // relocate the gauge.
  const x = this.x - (sprite.width / 1.5);
  const y = this.y - 12;
  sprite.move(x, y);

  // return the generic sprite centered on the character.
  return sprite;
};

/**
 * Updates the all gauges associated with this battler
 */
Sprite_Character.prototype.updateGauges = function()
{
  // check if we can update the hp gauge.
  if (this.canUpdateHpGauge())
  {
    // update it.
    this.updateHpGauge();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideHpGauge();
  }
};

/**
 * Determines whether or not we can update the hp gauge.
 * @returns {boolean} True if we can update the hp gauge, false otherwise.
 */
Sprite_Character.prototype.canUpdateHpGauge = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the gauge, then it shouldn't update.
  if (!this._character.getJabsBattler().showHpBar()) return false;

  // we should update!
  return true;
};

/**
 * Updates the hp gauge sprite.
 */
Sprite_Character.prototype.updateHpGauge = function()
{
  // show the hp gauge if we should be showing it.
  this.showHpGauge();

  // ensure the hp gauge matches the current battler.
  this._j._hpGauge._battler = this.getBattler();
};

/**
 * Shows the hp gauge if it exists.
 */
Sprite_Character.prototype.showHpGauge = function()
{
  this._j._hpGauge.show();
};

/**
 * Hides the hp gauge if it exists.
 */
Sprite_Character.prototype.hideHpGauge = function()
{
  this._j._hpGauge.hide();
};
//endregion gauges

//region battler name
/**
 * Sets up this battler's name as a sprite below the character.
 */
Sprite_Character.prototype.setupBattlerName = function()
{
  // check if we already have a battler name present.
  if (this._j._battlerName)
  {
    // redraw the new battler name.
    this._j._battlerName.setText(this.getBattlerName());

    // if we already have the sprite, no need to recreate it.
    return;
  }

  // build and assign the battler name sprite.
  this._j._battlerName = this.createBattlerNameSprite();

  // add it to this sprite's tracking.
  this.addChild(this._j._battlerName);
};

/**
 * Creates the sprite that contains this battler's name.
 * @returns {Sprite_BaseText} The battlers name, as a sprite.
 */
Sprite_Character.prototype.createBattlerNameSprite = function()
{
  // get the name of this battler.
  const battlerName = this.getBattlerName();

  // build the text sprite.
  const sprite = new Sprite_BaseText()
    .setText(battlerName)
    .setFontSize(10)
    .setAlignment(Sprite_BaseText.Alignments.Left)
    .setColor("#ffffff");
  sprite.setText(battlerName);

  // relocate the sprite to a better position.
  sprite.move(-30, 8);

  // return this created sprite.
  return sprite;
};

/**
 * Gets this battler's name.
 * If there is no battler, this will return an empty string.
 * @returns {string}
 */
Sprite_Character.prototype.getBattlerName = function()
{
  // get the battler if we have one.
  const battler = this.getBattler();

  // if we don't, then just return an empty string.
  if (!battler) return String.empty;

  // return the battler name.
  return battler.databaseData().name;
};

/**
 * Updates this battler's name.
 */
Sprite_Character.prototype.updateBattlerName = function()
{
  // check if we can update the battler name.
  if (this.canUpdateBattlerName())
  {
    // update it.
    this.showBattlerName();
  }
  // otherwise, if we can't update it...
  else
  {
    // then hide it.
    this.hideBattlerName();
  }
};

/**
 * Determines whether or not we can update the battler name.
 * @returns {boolean} True if we can update the battler name, false otherwise.
 */
Sprite_Character.prototype.canUpdateBattlerName = function()
{
  // if we're not using JABS, then it shouldn't update.
  if (!this.canUpdate()) return false;

  // if this sprite doesn't have a battler, then it shouldn't update.
  if (!this.isJabsBattler()) return false;

  // if we aren't allowed to show the battler name, then it shouldn't update.
  if (!this._character.getJabsBattler().showBattlerName()) return false;

  // we should update!
  return true;
};

/**
 * Shows the battler's name if it exists.
 */
Sprite_Character.prototype.showBattlerName = function()
{
  this._j._battlerName.show();
};

/**
 * Hides the battler's name if it exists.
 */
Sprite_Character.prototype.hideBattlerName = function()
{
  this._j._battlerName.hide();
};
//endregion battler name

//region loot
/**
 * Handle loot setup for loot that hasn't been drawn yet.
 */
Sprite_Character.prototype.handleLootSetup = function()
{
  // check if this is loot.
  if (this.isLoot())
  {
    // check if we've already drawn the loot.
    if (!this.hasLootDrawn())
    {
      // draw the loot sprite for this character.
      this.setupLootSprite();
    }
  }
};

/**
 * Whether or not we've drawn the child sprites that make up the loot.
 * @returns {boolean} True if we've already drawn the loot sprites, false otherwise.
 */
Sprite_Character.prototype.hasLootDrawn = function()
{
  return !this.children.length;
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupLootSprite = function()
{
  // flag this character is "through", so they don't block movement of others.
  this._character._through = true;

  // create the image sprite icon.
  const lootSprite = this.createLootSprite();

  // assign the image sprite icon.
  this.setLootSprite(lootSprite);

  // add it to this sprite's tracking.
  this.addChild(lootSprite);

  // flag this character as finalized for the purpose of loot-related updates.
  this.finalizeLootSetup();
};

/**
 * Gets the loot sprite associated with this character.
 * Will return null if there is no loot.
 * @returns {Sprite_Icon|null}
 */
Sprite_Character.prototype.getLootSprite = function()
{
  return this._j._loot._sprite;
};

/**
 * Sets the loot sprite associated with this character.
 * @param {Sprite_Icon} sprite The icon sprite for this loot.
 */
Sprite_Character.prototype.setLootSprite = function(sprite)
{
  this._j._loot._sprite = sprite;
};

/**
 * Creates the loot sprite based on the loot the enemy drop.
 */
Sprite_Character.prototype.createLootSprite = function()
{
  // get the loot's icon index.
  const iconIndex = this.getLootIcon();

  // build the sprite from the icon.
  const sprite = new Sprite_Icon(iconIndex);

  // relocate the loot a bit randomly.
  const xOffset = J.BASE.Helpers.getRandomNumber(-30, 0);
  const yOffset = J.BASE.Helpers.getRandomNumber(-90, -70);
  sprite.move(xOffset, yOffset);

  // return the built sprite.
  return sprite;
};

/**
 * Gets the loot data associated with this sprite.
 * @returns {JABS_LootDrop}
 */
Sprite_Character.prototype.getLootData = function()
{
  return this._character.getJabsLoot();
};

/**
 * Gets the loot icon associated with the underlying loot.
 * @returns {number} The icon index of the loot, or -1 if there is none.
 */
Sprite_Character.prototype.getLootIcon = function()
{
  return this.getLootData().lootIcon ?? -1;
};

/**
 * Gets the loot icon associated with the underlying loot.
 * @returns {number} The icon index of the loot, or -1 if there is none.
 */
Sprite_Character.prototype.getLootExpired = function()
{
  return this.getLootData().expired ?? true;
};

/**
 * Executes the loot's countdown to expiry.
 */
Sprite_Character.prototype.performLootDurationCountdown = function()
{
  // execute a countdown on behalf of the loot.
  this.getLootData().countdownDuration();
};

/**
 * Deletes all child loot sprites from the screen.
 */
Sprite_Character.prototype.deleteLootSprite = function()
{
  if (this.children.length > 0)
  {
    this.children.splice(0, this.children.length);
  }
};

/**
 * Gets whether or not this sprite is actually just some loot to be gathered.
 * @returns {boolean} True if this sprite represents a loot object, false otherwise.
 */
Sprite_Character.prototype.isLoot = function()
{
  return this._character.isJabsLoot();
};

/**
 * The current direction of swing.
 * @returns {boolean} True if we're swinging up, false if we're swinging down.
 */
Sprite_Character.prototype.lootSwing = function()
{
  return this._j._loot._swing;
};

/**
 * Swing the loot up and enforce the direction.
 * @param {number} amount The amount of the direction.
 */
Sprite_Character.prototype.lootSwingUp = function(amount = 0)
{
  this._j._loot._swing = true;

  this._j._loot._oy -= amount;
};

/**
 * Swing the loot down and enforce the direction.
 * @param {number} amount The amount of the direction.
 */
Sprite_Character.prototype.lootSwingDown = function(amount = 0)
{
  this._j._loot._swing = false;

  this._j._loot._oy += amount;
};

/**
 * Updates the loot to give the effect that it is floating in place.
 */
Sprite_Character.prototype.updateLootFloat = function()
{
  // perform the countdown and manage this loot expiration.
  this.handleLootDuration();

  // manage the floaty-ness if we float.
  this.handleLootFloat();
};

/**
 * Handles loot duration and expiration for this sprite.
 */
Sprite_Character.prototype.handleLootDuration = function()
{
  // tick tock the duration countdown of the loot if it has an expiration.
  this.performLootDurationCountdown();

  // check if the loot is now expired.
  if (this.getLootExpired())
  {
    // expire it if it is.
    this.expireLoot();
  }
};

/**
 * Perform all steps to have this loot expired and removed.
 */
Sprite_Character.prototype.expireLoot = function()
{
  // don't reset the removal if its already set.
  if (this._character.getLootNeedsRemoving()) return;

  // set the loot to be removed.
  this._character.setLootNeedsRemoving(true);
  $jabsEngine.requestClearLoot = true;
};

/**
 * Handles the float effect of the loot while on the map.
 */
Sprite_Character.prototype.handleLootFloat = function()
{
  // check if we can update the loot float.
  if (this.canUpdateLootFloat())
  {
    // float the loot.
    this.lootFloat();
  }
};

/**
 * Checks whether or not we can float the loot.
 * @returns {boolean} True if we can, false if we cannot.
 */
Sprite_Character.prototype.canUpdateLootFloat = function()
{
  // if we have no sprite, we can't update it.
  if (!this.getLootSprite()) return false;

  // if the loot is expired, we can't update it.
  if (this.getLootExpired()) return false;

  // we can update!
  return true;
};

/**
 * A basic slow swing up and down a bit for the loot drops.
 */
Sprite_Character.prototype.lootFloat = function()
{
  // Lets swing up and down a bit.
  if (this.lootSwing())
  {
    // ~swing up!
    this.lootFloatUp();
  }
  else
  {
    // !swing down~
    this.lootFloatDown();
  }
};

/**
 * The downswing of a loot sprite while floating.
 */
Sprite_Character.prototype.lootFloatDown = function()
{
  // grab the sprite for floaty goodness- if we have one.
  const lootSprite = this.getLootSprite();

  // swing the loot down.
  this.lootSwingDown(0.3);
  lootSprite.y += 0.3;

  // check if we should swing back up.
  if (this.shouldSwingUp())
  {
    // if so, swing up.
    this.lootSwingUp();
  }
};

/**
 * Determines whether or not we should reverse the swing back upwards.
 * @returns {boolean}
 */
Sprite_Character.prototype.shouldSwingUp = function()
{
  return this._j._loot._oy > 5;
};

/**
 * The upswing of a loot sprite while floating.
 */
Sprite_Character.prototype.lootFloatUp = function()
{
  // grab the sprite for floaty goodness- if we have one.
  const lootSprite = this.getLootSprite();

  // swing the loot up.
  this.lootSwingUp(0.3);
  lootSprite.y -= 0.3;

  // check if we've swung too far down.
  if (this.shouldSwingDown())
  {
    // if so, swing up.
    this.lootSwingDown();
  }
};

/**
 * Determines whether or not we should reverse the swing back upwards.
 * @returns {boolean}
 */
Sprite_Character.prototype.shouldSwingDown = function()
{
  return this._j._loot._oy < -5;
};
//endregion loot
//endregion Sprite_Character