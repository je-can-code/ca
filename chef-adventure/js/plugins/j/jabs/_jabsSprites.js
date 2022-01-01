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
  J.ABS.Aliased.Spriteset_Map.spritesetUpdate.call(this);
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function()
{
  if ($gameBattleMap.requestActionRendering)
  {
    this.addActionSprites();
  }

  if ($gameBattleMap.requestLootRendering)
  {
    this.addLootSprites();
  }

  if ($gameBattleMap.requestClearMap)
  {
    this.removeActionSprites();
  }

  if ($gameBattleMap.requestClearLoot)
  {
    this.removeLootSprites();
  }

  if ($gameBattleMap.requestSpriteRefresh)
  {
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function()
{
  $gameBattleMap.requestActionRendering = false;
  const events = $gameMap.events();
  events.forEach(event =>
  {
    const shouldAddActionSprite = event.getActionSpriteNeedsAdding();
    if (shouldAddActionSprite)
    {
      event.setActionSpriteNeedsAdding(false);
      const actionSprite = event.getMapActionData().getActionSprite();
      const sprite = new Sprite_Character(actionSprite);
      this._characterSprites.push(sprite);
      this._tilemap.addChild(sprite);
    }
  }, this);
};

/**
 * Adds all needing-to-be-added loot sprites to the map and renders.
 */
Spriteset_Map.prototype.addLootSprites = function()
{
  $gameBattleMap.requestLootRendering = false;
  const events = $gameMap.events();
  events.forEach(event =>
  {
    const shouldAddLootSprite = event.getLootNeedsAdding();
    if (shouldAddLootSprite)
    {
      event.setLootNeedsAdding(false);
      const sprite = new Sprite_Character(event);
      this._characterSprites.push(sprite);
      this._tilemap.addChild(sprite);
    }
  }, this);
};

/**
 * Removes all needing-to-be-removed action sprites from the map.
 */
Spriteset_Map.prototype.removeActionSprites = function()
{
  const events = $gameMap.events();
  events.forEach(event =>
  {
    // if they aren't an action, this function doesn't care.
    const isAction = event.isAction();
    if (!isAction) return;

    const actionEvent = event.getMapActionData();
    const shouldRemoveActionEvent = !!actionEvent && actionEvent.getNeedsRemoval()
    if (shouldRemoveActionEvent)
    {
      event.setActionSpriteNeedsRemoving();
      this._characterSprites.forEach((sprite, index) =>
      {
        const actionSprite = sprite._character;
        const needsRemoval = actionSprite.getActionSpriteNeedsRemoving();
        if (needsRemoval)
        {
          this._characterSprites.splice(index, 1);
          actionSprite.erase();
        }
      });
      $gameMap.clearStaleMapActions();
    }
  });

  $gameBattleMap.requestClearMap = false;
};

/**
 * Removes all needing-to-be-removed loot sprites from the map.
 */
Spriteset_Map.prototype.removeLootSprites = function()
{
  const events = $gameMap.events();
  events.forEach(event =>
  {
    // if they aren't loot, this function doesn't care.
    const isLoot = event.isLoot();
    if (!isLoot) return;

    const shouldRemoveLoot = event.getLootNeedsRemoving();
    if (shouldRemoveLoot)
    {
      this._characterSprites.forEach((sprite, index) =>
      {
        const lootSprite = sprite._character;
        const needsRemoval = lootSprite.getLootNeedsRemoving();
        if (needsRemoval)
        {
          sprite.deleteLootSprite();
          this._characterSprites.splice(index, 1);
          lootSprite.erase();
        }
      });

      $gameMap.clearStaleLootDrops();
    }
  });

  $gameBattleMap.requestClearLoot = false;
};

/**
 * Refreshes all character
 */
Spriteset_Map.prototype.refreshAllCharacterSprites = function()
{
  this._characterSprites.forEach(sprite =>
  {
    if (sprite.isJabsBattler())
    {
      sprite.setupDangerIndicator();
    }
  });

  $gameBattleMap.requestSpriteRefresh = false;
};
//#endregion Spriteset_Map

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function()
{
  this._stateOverlaySprite = null;
  this._hpGauge = null;
  this._dangerIndicator = null;
  this._battlerName = null;
  this._loot = {};
  this._loot._img = null;
  this._loot._swing = false;
  this._loot._ox = 0;
  this._loot._oy = 0;
  J.ABS.Aliased.Sprite_Character.initMembers.call(this);
};

//#region setup & reference
/**
 * Hooks into the `Sprite_Character.update` and adds our ABS updates.
 */
J.ABS.Aliased.Sprite_Character.update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function()
{
  J.ABS.Aliased.Sprite_Character.update.call(this);
  if (this.isJabsBattler())
  {
    this.updateStateOverlay();
    this.updateGauges();
    this.updateDangerIndicator();
    this.updateBattlerName();
  }
  else
  {
    // if the conditions changed for an event that used to have an hp gauge
    // now hide the gauge.
    if (this._hpGauge)
    {
      this.hideHpGauge();
    }
  }
};

/**
 * Returns the `Game_Battler` associated with the current sprite.
 * @returns {Game_Battler} The battler this sprite is bound to.
 */
Sprite_Character.prototype.getBattler = function()
{
  if (this.isJabsBattler())
  {
    return this._character
      .getMapBattler()
      .getBattler();
  }
  else
  {
    return null;
  }
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
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdate = function()
{
  return $gameBattleMap.absEnabled;
};

/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the battler sprite.
 */
J.ABS.Aliased.Sprite_Character.setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character)
{
  J.ABS.Aliased.Sprite_Character.setCharacter.call(this, character);
  // if this is a battler, configure the visual components of the battler.
  if (this._character.hasJabsBattler())
  {
    this.setupMapSprite();
  }

  // if this is just loot, then setup the visual components of the loot.
  if (this.isLoot())
  {
    this.setupLootSprite();
  }
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupMapSprite = function()
{
  this.setupStateOverlay();
  this.setupHpGauge();
  this.setupDangerIndicator();
  this.setupBattlerName();
};
//#endregion setup & reference

//#region state overlay
/**
 * Sets up this character's state overlay, to show things like poison or paralysis.
 */
Sprite_Character.prototype.setupStateOverlay = function()
{
  const battler = this.getBattler();
  this._stateOverlaySprite = this.createStateOverlaySprite();
  if (battler)
  {
    this._stateOverlaySprite.setup(battler);
  }

  this.addChild(this._stateOverlaySprite);
};

/**
 * Creates the sprite representing the overlay of the state on the field.
 * @returns {Sprite_StateOverlay} The state overlay for this character.
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
  const mapBattler = this._character.getMapBattler();
  if (mapBattler)
  {
    if (this.canUpdate())
    {
      if (!this._stateOverlaySprite)
      {
        this.setupMapSprite();
      }

      this._stateOverlaySprite.update();
      this.showStateOverlay();
    }
    else
    {
      this.hideStateOverlay();
    }
  }
};

/**
 * Shows the state overlay if it exists.
 */
Sprite_Character.prototype.showStateOverlay = function()
{
  if (this._stateOverlaySprite)
  {
    this._stateOverlaySprite.opacity = 255;
  }
};

/**
 * Hides the state overlay if it exists.
 */
Sprite_Character.prototype.hideStateOverlay = function()
{
  if (this._stateOverlaySprite)
  {
    this._stateOverlaySprite.opacity = 0;
  }
};
//#endregion state overlay

//#region gauges
/**
 * Sets up this character's hp gauge, to show the hp bar as-needed.
 */
Sprite_Character.prototype.setupHpGauge = function()
{
  if (this._hpGauge)
  {
    this._hpGauge.destroy();
  }

  // initialize the hp gauge as a generic map gauge.
  this._hpGauge = this.createGenericSpriteGauge();

  // locate the gauge below the character.
  this._hpGauge.move(
    -(this._hpGauge.bitmapWidth() / 1.5),
    -12);

  // if we have a battler, set it up and activate it.
  const battler = this.getBattler();
  if (battler)
  {
    this._hpGauge.setup(battler, "hp");
    this._hpGauge.activateGauge();
  }

  // add the sprite to tracking.
  this.addChild(this._hpGauge);
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
  const mapBattler = this._character.getMapBattler();
  if (mapBattler)
  {
    if (this.canUpdate() && mapBattler.showHpBar())
    {
      this.updateHpGauge();
    }
    else
    {
      this.hideHpGauge();
    }
  }
};

/**
 * Updates the hp gauge sprite.
 */
Sprite_Character.prototype.updateHpGauge = function()
{
  // if the gauge is not created, then create it.
  if (!this._hpGauge)
  {
    this.setupHpGauge();
  }

  // ensure the hp gauge is visible.
  this.showHpGauge();

  // ensure the battler for the gauge is assigned to this battler.
  this._hpGauge._battler = this.getBattler();
};

/**
 * Shows the hp gauge if it exists.
 */
Sprite_Character.prototype.showHpGauge = function()
{
  this._hpGauge.opacity = 255;
};

/**
 * Hides the hp gauge if it exists.
 */
Sprite_Character.prototype.hideHpGauge = function()
{
  this._hpGauge.opacity = 0;
};
//#endregion gauges

//#region danger indicator icon
/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function()
{
  if (this._dangerIndicator)
  {
    this._dangerIndicator.destroy();
  }

  this._dangerIndicator = this.createDangerIndicatorSprite();
  this.addChild(this._dangerIndicator);
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function()
{
  const dangerIndicatorIcon = this.getDangerIndicatorIcon();
  const sprite = new Sprite_Icon(dangerIndicatorIcon);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  sprite.move(-50, 8);
  return sprite;
};

/**
 * Determines the iconIndex that indicates the danger level relative to the player and enemy.
 * @returns The icon index of the danger indicator icon.
 */
Sprite_Character.prototype.getDangerIndicatorIcon = function()
{
  // if we aren't using them, don't give an icon.
  if (!J.ABS.Metadata.UseDangerIndicatorIcons) return -1;

  // if a battler isn't on this sprite, then don't do it.
  const battler = this.getBattler();
  if (!battler) return -1;

  // if the sprite belongs to the player, then don't do it.
  const player = $gameBattleMap.getPlayerMapBattler().getBattler();
  if (player === battler) return -1;

  // get the corresponding power levels.
  const bpl = battler.getPowerLevel();
  const ppl = player.getPowerLevel();

  switch (true)
  {
    case (bpl < ppl * 0.5):
      return J.ABS.DangerIndicatorIcons.Worthless;
    case (bpl >= ppl * 0.5 && bpl < ppl * 0.7):
      return J.ABS.DangerIndicatorIcons.Simple;
    case (bpl >= ppl * 0.7 && bpl < ppl * 0.9):
      return J.ABS.DangerIndicatorIcons.Easy;
    case (bpl >= ppl * 0.9 && bpl < ppl * 1.1):
      return J.ABS.DangerIndicatorIcons.Average;
    case (bpl >= ppl * 1.1 && bpl < ppl * 1.3):
      return J.ABS.DangerIndicatorIcons.Hard;
    case (bpl >= ppl * 1.3 && bpl <= ppl * 1.5):
      return J.ABS.DangerIndicatorIcons.Grueling;
    case (bpl > ppl * 1.5):
      return J.ABS.DangerIndicatorIcons.Deadly;
    default:
      console.error(bpl);
      return -1;
  }
};

/**
 * Updates the danger indicator associated with this battler
 */
Sprite_Character.prototype.updateDangerIndicator = function()
{
  const mapBattler = this._character.getMapBattler();
  if (mapBattler)
  {
    if (this.canUpdate() && mapBattler.showDangerIndicator())
    {
      if (!this._dangerIndicator)
      {
        this.setupMapSprite();
      }

      this.showDangerIndicator();
    }
    else
    {
      this.hideDangerIndicator();
    }
  }
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function()
{
  if (this._dangerIndicator)
  {
    this._dangerIndicator.opacity = 255;
  }
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function()
{
  if (this._dangerIndicator)
  {
    this._dangerIndicator.opacity = 0;
  }
};
//#endregion danger indicator icon

//#region battler name
/**
 * Sets up this battler's name as a sprite below the character.
 */
Sprite_Character.prototype.setupBattlerName = function()
{
  this._battlerName = this.createBattlerNameSprite();
  this.addChild(this._battlerName);
};

/**
 * Creates the sprite that contains this battler's name.
 * @returns {Sprite_Text} The battlers name, as a sprite.
 */
Sprite_Character.prototype.createBattlerNameSprite = function()
{
  const battlerName = this.getBattlerName();
  const sprite = new Sprite_Text(battlerName, null, -12, "left");
  sprite.move(-30, 8);
  return sprite;
};

/**
 *
 * @returns {string} The battlers name.
 */
Sprite_Character.prototype.getBattlerName = function()
{
  const battler = this.getBattler();
  if (!battler) return "";

  return battler.opponentsUnit() === $gameParty
    ? battler.enemy().name
    : battler.actor().name;
};

/**
 * Updates this battler's name.
 */
Sprite_Character.prototype.updateBattlerName = function()
{
  const mapBattler = this._character.getMapBattler();
  if (mapBattler)
  {
    if (this.canUpdate() && mapBattler.showBattlerName())
    {
      if (!this._battlerName)
      {
        this.setupMapSprite();
      }

      this.showBattlerName();
    }
    else
    {
      this.hideBattlerName();
    }
  }
};

/**
 * Shows the battler's name if it exists.
 */
Sprite_Character.prototype.showBattlerName = function()
{
  if (this._battlerName)
  {
    this._battlerName.opacity = 255;
  }
};

/**
 * Hides the battler's name if it exists.
 */
Sprite_Character.prototype.hideBattlerName = function()
{
  if (this._battlerName)
  {
    this._battlerName.opacity = 0;
  }
};
//#endregion battler name

//#region loot
/**
 * If the "character" is actually a loot drop, don't identify it as empty for the purposes
 * of drawing the loot icon on the map.
 * @returns {boolean} True if the character should be drawn, false otherwise.
 */
J.ABS.Aliased.Sprite_Character.isEmptyCharacter = Sprite_Character.prototype.isEmptyCharacter;
Sprite_Character.prototype.isEmptyCharacter = function()
{
  if (this.isLoot())
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Sprite_Character.isEmptyCharacter.call(this);
  }
};

/**
 * If this is loot, then treat it as loot instead of a regular character.
 */
J.ABS.Aliased.Sprite_Character.setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function()
{
  if (this.isLoot())
  {
    if (!this.children.length)
    {
      // if there are no sprites currently drawn for the loot, then draw them.
      this.setupLootSprite();
    }

    return;
  }

  J.ABS.Aliased.Sprite_Character.setCharacterBitmap.call(this);
};

/**
 * If this is loot, then treat it as loot instead of a tilemap.
 */
J.ABS.Aliased.Sprite_Character.setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function()
{
  if (this.isLoot())
  {
    if (!this.children.length)
    {
      // if there are no sprites currently drawn for the loot, then draw them.
      this.setupLootSprite();
    }

    return;
  }

  J.ABS.Aliased.Sprite_Character.setTileBitmap.call(this);
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupLootSprite = function()
{
  if (this._loot._img) return;

  this._character._through = true;
  this._loot._img = this.createLootSprite();
  this.addChild(this._loot._img);
};

/**
 * Creates the loot sprite based on the loot the enemy drop.
 */
Sprite_Character.prototype.createLootSprite = function()
{
  const lootData = this.getLootData();
  const iconIndex = lootData.lootIcon;
  const lootSprite = new Sprite_Icon(iconIndex);
  const xOffset = J.BASE.Helpers.getRandomNumber(-30, 0);
  const yOffset = J.BASE.Helpers.getRandomNumber(-90, -70);
  lootSprite.move(xOffset, yOffset);
  return lootSprite;
};

/**
 * Deletes a loot sprite from the screen.
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
 * Gets the loot data associated with this sprite.
 * @returns {JABS_LootDrop}
 */
Sprite_Character.prototype.getLootData = function()
{
  return this._character.getLootData();
};

/**
 * Intercepts the update frame for loot and performs the things we need to
 * make the loot look like its floating in-place.
 */
J.ABS.Aliased.Sprite_Character.updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function()
{
  if (this.isLoot())
  {
    this.updateLootFloat();
    return;
  }

  J.ABS.Aliased.Sprite_Character.updateFrame.call(this);
};

/**
 * Updates the loot to give the effect that it is floating in place.
 */
Sprite_Character.prototype.updateLootFloat = function()
{
  const lootData = this.getLootData();
  lootData.countdownDuration();

  // if the loot is expired, remove it.
  if (lootData.expired)
  {
    // don't reset the removal if its already set.
    if (this._character.getLootNeedsRemoving()) return;

    // set the loot to be removed.
    this._character.setLootNeedsRemoving(true);
    $gameBattleMap.requestClearLoot = true;
    return;
  }

  const {_img: lootSprite, _swing: swingDown} = this._loot;

  swingDown
    ? this.lootFloatDown(lootSprite)
    : this.lootFloatUp(lootSprite);
};

/**
 * The downswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite to give a float effect.
 */
Sprite_Character.prototype.lootFloatDown = function(lootSprite)
{
  this._loot._oy += 0.3;
  lootSprite.y += 0.3;
  if (this._loot._oy > 5) this._loot._swing = false;
};

/**
 * The upswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite give a float effect.
 */
Sprite_Character.prototype.lootFloatUp = function(lootSprite)
{
  this._loot._oy -= 0.3;
  lootSprite.y -= 0.3;
  if (this._loot._oy < -5) this._loot._swing = true;
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