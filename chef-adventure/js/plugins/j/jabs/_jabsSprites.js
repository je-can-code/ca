/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various sprite object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites/additions to the objects that
 * would otherwise be found in the rmmz_sprites.js, such as Sprite_Damage.
 * ============================================================================
 */

//#region Spriteset_Map
/**
 * Hooks into the `update` function to also update any active action sprites.
 */
J.ABS.Aliased.Spriteset_Map.spritesetUpdate = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Spriteset_Map.spritesetUpdate.call(this);

  // perform jabs-related sprite updates.
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function()
{
  // manage action sprites.
  this.handleActionSprites();

  // manage loot sprites.
  this.handleLootSprites();

  // manage full-screen sprite refreshes.
  this.handleSpriteRefresh();
};

/**
 * Processes incoming requests to add/remove action sprites.
 */
Spriteset_Map.prototype.handleActionSprites = function()
{
  // check if we have incoming requests to add new action sprites.
  if ($gameBattleMap.requestActionRendering)
  {
    // add the new action sprites.
    this.addActionSprites();
  }

  // check if we have incoming requests to remove old action sprites.
  if ($gameBattleMap.requestClearMap)
  {
    // remove the old action sprites.
    this.removeActionSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleLootSprites = function()
{
  // check if we have incoming requests to add new loot sprites.
  if ($gameBattleMap.requestLootRendering)
  {
    // add the new loot sprites.
    this.addLootSprites();
  }

  // check if we have incoming requests to remove old loot sprites.
  if ($gameBattleMap.requestClearLoot)
  {
    // remove the old loot sprites.
    this.removeLootSprites();
  }
};

/**
 * Processes incoming requests to add/remove loot sprites.
 */
Spriteset_Map.prototype.handleSpriteRefresh = function()
{
  // check if we have incoming requests to do a sprite refresh.
  if ($gameBattleMap.requestSpriteRefresh)
  {
    // refresh all character sprites.
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function()
{
  // grab all the newly-added action events.
  const newActionEvents = $gameMap.newActionEvents();

  // scan each of them and add new action sprites as-needed.
  newActionEvents.forEach(this.addActionSprite, this);

  // acknowledge that action sprites were added.
  $gameBattleMap.requestActionRendering = false;
};

/**
 * Processes a single event and adds its corresponding action sprite if necessary.
 * @param {Game_Event} actionEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addActionSprite = function(actionEvent)
{
  // get the underlying character associated with this action.
  const character = actionEvent.getMapActionData().getActionSprite();

  // generate the new sprite based on the action's character.
  const sprite = new Sprite_Character(character);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  actionEvent.setActionSpriteNeedsAdding(false);
};

/**
 * Scans all events on the map and adds new loot sprites accordingly.
 */
Spriteset_Map.prototype.addLootSprites = function()
{
  // grab all the newly-added loot events.
  const events = $gameMap.newLootEvents();

  // scan each of them and add new loot sprites.
  events.forEach(this.addLootSprite, this);

  // acknowledge that loot sprites were added.
  $gameBattleMap.requestLootRendering = false;
};

/**
 * Processes a single event and adds its corresponding loot sprite if necessary.
 * @param {Game_Event} lootEvent The event that may require a new sprite added.
 */
Spriteset_Map.prototype.addLootSprite = function(lootEvent)
{
  // generate the new sprite based on the loot's character.
  const sprite = new Sprite_Character(lootEvent);

  // add the sprite to tracking.
  this._characterSprites.push(sprite);
  this._tilemap.addChild(sprite);

  // acknowledge that the sprite was added.
  lootEvent.setLootNeedsAdding(false);
};

/**
 * Removes all expired action sprites from the map.
 */
Spriteset_Map.prototype.removeActionSprites = function()
{
  // grab all expired action events.
  const events = $gameMap.expiredActionEvents();

  // remove them.
  events.forEach(this.removeActionSprite, this);

  // acknowledge that expired action sprites were cleared.
  $gameBattleMap.requestClearMap = false;
};

/**
 * Processes a single action event and removes its corresponding sprite(s).
 * @param {Game_Event} actionEvent The action event that requires removal.
 */
Spriteset_Map.prototype.removeActionSprite = function(actionEvent)
{
  // get the sprite index for the action event.
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite._character !== actionEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // flag the Game_Event for removal from Game_Map's tracking.
  actionEvent.setActionSpriteNeedsRemoving();

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredJabsActionEvents();
};

/**
 * Removes all needing-to-be-removed loot sprites from the map.
 */
Spriteset_Map.prototype.removeLootSprites = function()
{
  // grab all expired loot events.
  const events = $gameMap.expiredLootEvents();

  // remove them.
  events.forEach(this.removeLootSprite, this);

  // acknowledge that expired loot sprites were cleared.
  $gameBattleMap.requestClearLoot = false;
};

/**
 * Processes a single loot event and removes its corresponding sprite(s).
 * @param {Game_Event} lootEvent The loot event that requires removal.
 */
Spriteset_Map.prototype.removeLootSprite = function(lootEvent)
{
  const spriteIndex = this._characterSprites.findIndex(sprite =>
  {
    // if the character doesn't match the event, then keep looking.
    if (sprite._character !== lootEvent) return false;

    // we found a match!
    return true;
  });

  // confirm we did indeed find the sprite's index for removal.
  if (spriteIndex !== -1)
  {
    // delete that sprite's loot.
    this._characterSprites[spriteIndex].deleteLootSprite();

    // purge the sprite from tracking.
    this._characterSprites.splice(spriteIndex, 1);
  }

  // delete the now-removed sprite for this action.
  $gameMap.clearExpiredLootEvents();
};

/**
 * Refreshes all character sprites on the map.
 * Does nothing in this plugin, but leaves open for extension.
 */
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  $gameBattleMap.requestSpriteRefresh = false;
};
//#endregion Spriteset_Map

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.set('initMembers', Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * The battle-related sprites and such are maintained within this umbrella.
   */
  this._j._abs ||= {};

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
   * @type {Sprite_Text|null}
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

//#region setup & reference
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

  /// only update the loot components if they have been initialized.
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
    return this._character.getMapBattler().getBattler();
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
  if (!this._character || this._character instanceof Game_Vehicle) return false;

  // return whether or not this has a battler attached to it.
  return !!this._character.hasJabsBattler();
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
  return $gameBattleMap.absEnabled;
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
//#endregion setup & reference

//#region state overlay
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
//#endregion state overlay

//#region gauges
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
  if (!this._character.getMapBattler().showHpBar()) return false;

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
//#endregion gauges

//#region battler name
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
 * @returns {Sprite_Text} The battlers name, as a sprite.
 */
Sprite_Character.prototype.createBattlerNameSprite = function()
{
  // get the name of this battler.
  const battlerName = this.getBattlerName();

  // build the text sprite.
  const sprite = new Sprite_Text(battlerName, null, -12, "left");

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

  // pull the name straight from the database actor/enemy tab.
  const battlerName = battler.databaseData().name;

  // return the battler name.
  return battlerName;
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
  if (!this._character.getMapBattler().showBattlerName()) return false;

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
//#endregion battler name

//#region loot
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

  // create and assign the image sprite icon.
  this._j._loot._sprite = this.createLootSprite();

  // add it to this sprite's tracking.
  this.addChild(this._j._loot._sprite);

  // flag this character as finalized for the purpose of loot-related updates.
  this.finalizeLootSetup();
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
  return this._character.getLootData();
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
  return this._character.isLoot();
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
  $gameBattleMap.requestClearLoot = true;
};

/**
 *
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
  if (!this._j._loot._sprite) return false;

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
  // grab the sprite for floaty goodness- if we have one.
  const lootSprite = this._j._loot._sprite;

  // Lets swing up and down a bit.
  if (this.lootSwing())
  {
    // ~swing up!
    this.lootFloatUp(lootSprite);
  }
  else
  {
    // !swing down~
    this.lootFloatDown(lootSprite);
  }
};

/**
 * The downswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite to give a float effect.
 */
Sprite_Character.prototype.lootFloatDown = function(lootSprite)
{
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
 * @param {Sprite} lootSprite The sprite give a float effect.
 */
Sprite_Character.prototype.lootFloatUp = function(lootSprite)
{
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
//#endregion loot
//#endregion Sprite_Character

//#region Sprite_Gauge
/**
 * Due to JABS' slip effects, we have fractional hp/mp/tp values.
 * This rounds up the values for the sprite gauge if they are a number.
 */
J.ABS.Aliased.Sprite_Gauge.currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function()
{
  let base = J.ABS.Aliased.Sprite_Gauge.currentValue.call(this);

  // if we somehow ended up with NaN, then just let them deal with it.
  if (isNaN(base)) return base;

  // return the rounded-up amount.
  return Math.ceil(base);
};
//#endregion Sprite_Gauge
//ENDFILE