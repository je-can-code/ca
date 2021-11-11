/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various sprite object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
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
Spriteset_Map.prototype.update = function() {
  J.ABS.Aliased.Spriteset_Map.spritesetUpdate.call(this);
  this.updateJabsSprites();
};

/**
 * Updates all existing actionSprites on the map.
 */
Spriteset_Map.prototype.updateJabsSprites = function() {
  if ($gameBattleMap.requestActionRendering) {
    this.addActionSprites();
  }

  if ($gameBattleMap.requestLootRendering) {
    this.addLootSprites();
  }

  if ($gameBattleMap.requestClearMap) {
    this.removeActionSprites();
  }

  if ($gameBattleMap.requestClearLoot) {
    this.removeLootSprites();
  }

  if ($gameBattleMap.requestSpriteRefresh) {
    this.refreshAllCharacterSprites();
  }
};

/**
 * Adds all needing-to-be-added action sprites to the map and renders.
 */
Spriteset_Map.prototype.addActionSprites = function() {
  $gameBattleMap.requestActionRendering = false;
  const events = $gameMap.events();
  events.forEach(event => {
    const shouldAddActionSprite = event.getActionSpriteNeedsAdding();
    if (shouldAddActionSprite) {
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
Spriteset_Map.prototype.addLootSprites = function() {
  $gameBattleMap.requestLootRendering = false;
  const events = $gameMap.events();
  events.forEach(event => {
    const shouldAddLootSprite = event.getLootNeedsAdding();
    if (shouldAddLootSprite) {
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
Spriteset_Map.prototype.removeActionSprites = function() {
  const events = $gameMap.events();
  events.forEach(event => {
    // if they aren't an action, this function doesn't care.
    const isAction = event.isAction();
    if (!isAction) return;

    const actionEvent = event.getMapActionData();
    const shouldRemoveActionEvent = !!actionEvent && actionEvent.getNeedsRemoval()
    if (shouldRemoveActionEvent) {
      event.setActionSpriteNeedsRemoving();
      this._characterSprites.forEach((sprite, index) => {
        const actionSprite = sprite._character;
        const needsRemoval = actionSprite.getActionSpriteNeedsRemoving();
        if (needsRemoval) {
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
Spriteset_Map.prototype.removeLootSprites = function() {
  const events = $gameMap.events();
  events.forEach(event => {
    // if they aren't loot, this function doesn't care.
    const isLoot = event.isLoot();
    if (!isLoot) return;

    const shouldRemoveLoot = event.getLootNeedsRemoving();
    if (shouldRemoveLoot) {
      this._characterSprites.forEach((sprite, index) => {
        const lootSprite = sprite._character;
        const needsRemoval = lootSprite.getLootNeedsRemoving();
        if (needsRemoval) {
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
Spriteset_Map.prototype.refreshAllCharacterSprites = function() {
  this._characterSprites.forEach(sprite => {
    if (sprite.isJabsBattler()) {
      sprite.setupDangerIndicator();
    }
  });

  $gameBattleMap.requestSpriteRefresh = false;
};
//#endregion

//#region Sprite_Character
/**
 * Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
 */
J.ABS.Aliased.Sprite_Character.initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function() {
  this._damages = [];
  this._nonDamages = [];
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
Sprite_Character.prototype.update = function() {
  J.ABS.Aliased.Sprite_Character.update.call(this);
  if (this.getBattler()) {
    this.updateStateOverlay();
    this.updateMapPopups();
    this.updateGauges();
    this.updateDangerIndicator();
    this.updateBattlerName();
  } else {
    // if the conditions changed for an event that used to have an hp gauge
    // now hide the gauge.
    if (this._hpGauge) {
      this.hideHpGauge();
    }
  }
};

/**
 * Returns the `Game_Battler` associated with the current sprite.
 * @returns {Game_Battler} The battler this sprite is bound to.
 */
Sprite_Character.prototype.getBattler = function() {
  if (!this._character ||
    this._character instanceof Game_Vehicle) {
    return null;
  } else {
    if (this.isJabsBattler()) {
      return this._character.getMapBattler().getBattler();
    } else {
      return null;
    }
  }
};

/**
 * Gets whether or not this sprite belongs to a battler.
 * @returns {boolean} True if this sprite belongs to a battler, false otherwise.
 */
Sprite_Character.prototype.isJabsBattler = function() {
  return !!this._character.hasJabsBattler();
};

/**
 * Whether or not we should be executing JABS-related updates for this sprite.
 * @returns {boolean} True if updating is available, false otherwise.
 */
Sprite_Character.prototype.canUpdate = function() {
  return $gameBattleMap.absEnabled;
};

/**
 * Hooks into the `Sprite_Character.setCharacter` and sets up the battler sprite.
 */
J.ABS.Aliased.Sprite_Character.setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
  J.ABS.Aliased.Sprite_Character.setCharacter.call(this, character);
  // if this is a battler, configure the visual components of the battler.
  if (this._character.hasJabsBattler()) {
    this.setupMapSprite();
  }

  // if this is just loot, then setup the visual components of the loot.
  if (this.isLoot()) {
    this.setupLootSprite();
  }
};

/**
 * Sets up this character's sprite for activities on the map.
 */
Sprite_Character.prototype.setupMapSprite = function() {
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
Sprite_Character.prototype.setupStateOverlay = function() {
  const battler = this.getBattler();
  this._stateOverlaySprite = this.createStateOverlaySprite();
  if (battler) {
    this._stateOverlaySprite.setup(battler);
  }

  this.addChild(this._stateOverlaySprite);
};

/**
 * Creates the sprite representing the overlay of the state on the field.
 * @returns {Sprite_StateOverlay} The state overlay for this character.
 */
Sprite_Character.prototype.createStateOverlaySprite = function() {
  return new Sprite_StateOverlay();
};

/**
 * Updates the battler's overlay for states (if applicable).
 */
Sprite_Character.prototype.updateStateOverlay = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate()) {
      if (!this._stateOverlaySprite) {
        this.setupMapSprite();
      }

      this._stateOverlaySprite.update();
      this.showStateOverlay();
    } else {
      this.hideStateOverlay();
    }
  }
};

/**
 * Shows the state overlay if it exists.
 */
Sprite_Character.prototype.showStateOverlay = function() {
  if (this._stateOverlaySprite) {
    this._stateOverlaySprite.opacity = 255;
  }
};

/**
 * Hides the state overlay if it exists.
 */
Sprite_Character.prototype.hideStateOverlay = function() {
  if (this._stateOverlaySprite) {
    this._stateOverlaySprite.opacity = 0;
  }
};
//#endregion state overlay

//#region gauges
/**
 * Sets up this character's hp gauge, to show the hp bar as-needed.
 */
Sprite_Character.prototype.setupHpGauge = function() {
  const battler = this.getBattler();
  this._hpGauge = this.createGenericSpriteGauge();
  if (battler) {
    this._hpGauge.setup(battler, "hp");
  }

  this.addChild(this._hpGauge);
};

/**
 * Creates an on-the-map HP gauge for this battler.
 */
 Sprite_Character.prototype.createGenericSpriteGauge = function() {
  const sprite = new Sprite_MapGauge();
  const x = this.x - (sprite.width / 1.5);
  const y = this.y - 12;
  sprite.move(x, y);
  return sprite;
};

/**
 * Updates the all gauges associated with this battler
 */
Sprite_Character.prototype.updateGauges = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showHpBar()) {
      if (!this._hpGauge) {
        this.setupMapSprite();
        this._hpGauge.move(0 - (this._hpGauge.width / 1.5), 0 - 12);
      }
      this._hpGauge._battler = this.getBattler();
      this._hpGauge.update();
      this.showHpGauge();
    } else {
      this.hideHpGauge();
    }
  }
};

/**
 * Shows the hp gauge if it exists.
 */
Sprite_Character.prototype.showHpGauge = function() {
  if (this._hpGauge) {
    this._hpGauge.opacity = 255;
  }
};

/**
 * Hides the hp gauge if it exists.
 */
Sprite_Character.prototype.hideHpGauge = function() {
  if (this._hpGauge) {
    this._hpGauge.opacity = 0;
  }
};
//#endregion gauges

//#region danger indicator icon
/**
 * Sets up the danger indicator sprite for this battler.
 */
Sprite_Character.prototype.setupDangerIndicator = function() {
  this._dangerIndicator = this.createDangerIndicatorSprite();
  this.addChild(this._dangerIndicator);
};

/**
 * Creates the danger indicator sprite for this battler.
 * @returns {Sprite_Icon} The icon representing this danger indicator.
 */
Sprite_Character.prototype.createDangerIndicatorSprite = function() {
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
Sprite_Character.prototype.getDangerIndicatorIcon = function() {
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

  switch (true) {
    case (bpl < ppl*0.5):
      return J.ABS.DangerIndicatorIcons.Worthless;
    case (bpl >= ppl*0.5 && bpl < ppl*0.7):
      return J.ABS.DangerIndicatorIcons.Simple;
    case (bpl >= ppl*0.7 && bpl < ppl*0.9):
      return J.ABS.DangerIndicatorIcons.Easy;
    case (bpl >= ppl*0.9 && bpl < ppl*1.1):
      return J.ABS.DangerIndicatorIcons.Average;
    case (bpl >= ppl*1.1 && bpl < ppl*1.3):
      return J.ABS.DangerIndicatorIcons.Hard;
    case (bpl >= ppl*1.3 && bpl <= ppl*1.5):
      return J.ABS.DangerIndicatorIcons.Grueling;
    case (bpl > ppl*1.5):
      return J.ABS.DangerIndicatorIcons.Deadly;
    default:
      console.error(bpl);
      return -1;
  }
};

/**
 * Updates the danger indicator associated with this battler
 */
Sprite_Character.prototype.updateDangerIndicator = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showDangerIndicator()) {
      if (!this._dangerIndicator) {
        this.setupMapSprite();
      }

      this.showDangerIndicator();
    } else {
      this.hideDangerIndicator();
    }
  }
};

/**
 * Shows the danger indicator if it exists.
 */
Sprite_Character.prototype.showDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 255;
  }
};

/**
 * Hides the danger indicator if it exists.
 */
Sprite_Character.prototype.hideDangerIndicator = function() {
  if (this._dangerIndicator) {
    this._dangerIndicator.opacity = 0;
  }
};
//#endregion danger indicator icon

//#region battler name
/**
 * Sets up this battler's name as a sprite below the character.
 */
Sprite_Character.prototype.setupBattlerName = function() {
  this._battlerName = this.createBattlerNameSprite();
  this.addChild(this._battlerName);
};

/**
 * Creates the sprite that contains this battler's name.
 * @returns {Sprite_Text} The battlers name, as a sprite.
 */
 Sprite_Character.prototype.createBattlerNameSprite = function() {
  const battlerName = this.getBattlerName();
  const sprite = new Sprite_Text(battlerName, null, -12, "left");
  sprite.move(-30, 8);
  return sprite;
};

/**
 * 
 * @returns {string} The battlers name.
 */
Sprite_Character.prototype.getBattlerName = function() {
  const battler = this.getBattler();
  if (!battler) return "";

  return battler.opponentsUnit() === $gameParty
    ? battler.enemy().name
    : battler.actor().name;
};

/**
 * Updates this battler's name.
 */
Sprite_Character.prototype.updateBattlerName = function() {
  const mapBattler = this._character.getMapBattler();
  if (mapBattler) {
    if (this.canUpdate() && mapBattler.showBattlerName()) {
      if (!this._battlerName) {
        this.setupMapSprite();
      }

      this.showBattlerName();
    } else {
      this.hideBattlerName();
    }
  }
};

/**
 * Shows the battler's name if it exists.
 */
Sprite_Character.prototype.showBattlerName = function() {
  if (this._battlerName) {
    this._battlerName.opacity = 255;
  }
};

/**
 * Hides the battler's name if it exists.
 */
Sprite_Character.prototype.hideBattlerName = function() {
  if (this._battlerName) {
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
Sprite_Character.prototype.isEmptyCharacter = function() {
  if (this.isLoot()) {
    return false;
  } else {
    return J.ABS.Aliased.Sprite_Character.isEmptyCharacter.call(this);
  }
};

/**
 * If this is loot, then treat it as loot instead of a regular character.
 */
J.ABS.Aliased.Sprite_Character.setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
  if (this.isLoot()) {
    if (!this.children.length) {
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
Sprite_Character.prototype.setTileBitmap = function() {
  if (this.isLoot()) {
    if (!this.children.length) {
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
Sprite_Character.prototype.setupLootSprite = function() {
  if (this._loot._img) return;

  this._character._through = true;
  this._loot._img = this.createLootSprite();
  this.addChild(this._loot._img);
};

/**
 * Creates the loot sprite based on the loot the enemy drop.
 */
Sprite_Character.prototype.createLootSprite = function() {
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
Sprite_Character.prototype.deleteLootSprite = function() {
  if (this.children.length > 0) {
    this.children.splice(0, this.children.length);
  }
};

/**
 * Gets whether or not this sprite is actually just some loot to be gathered.
 * @returns {boolean} True if this sprite represents a loot object, false otherwise.
 */
 Sprite_Character.prototype.isLoot = function() {
  return this._character.isLoot();
};

/**
 * Gets the loot data associated with this sprite.
 * @returns {JABS_LootDrop}
 */
Sprite_Character.prototype.getLootData = function() {
  return this._character.getLootData();
};

/**
 * Intercepts the update frame for loot and performs the things we need to
 * make the loot look like its floating in-place.
 */
J.ABS.Aliased.Sprite_Character.updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function() {
  if (this.isLoot()) {
    this.updateLootFloat();
    return;
  }

  J.ABS.Aliased.Sprite_Character.updateFrame.call(this);
};

/**
 * Updates the loot to give the effect that it is floating in place.
 */
Sprite_Character.prototype.updateLootFloat = function() {
  const lootData = this.getLootData();
  lootData.countdownDuration();

  // if the loot is expired, remove it.
  if (lootData.expired) {
    // don't reset the removal if its already set.
    if (this._character.getLootNeedsRemoving()) return;

    // set the loot to be removed.
    this._character.setLootNeedsRemoving(true);
    $gameBattleMap.requestClearLoot = true;
    return;
  }

  const { _img: lootSprite, _swing: swingDown } = this._loot;

  swingDown
    ? this.lootFloatDown(lootSprite)
    : this.lootFloatUp(lootSprite);
};

/**
 * The downswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite to give a float effect.
 */
Sprite_Character.prototype.lootFloatDown = function(lootSprite) {
  this._loot._oy += 0.3;
  lootSprite.y += 0.3;
  if (this._loot._oy > 5) this._loot._swing = false;
};

/**
 * The upswing of a loot sprite while floating.
 * @param {Sprite} lootSprite The sprite give a float effect.
 */
Sprite_Character.prototype.lootFloatUp = function(lootSprite) {
  this._loot._oy -= 0.3;
  lootSprite.y -= 0.3;
  if (this._loot._oy < -5) this._loot._swing = true;
};
//#endregion loot

//#region popups
/**
 * Updates the sprites for all current damage popups.
 */
Sprite_Character.prototype.updateMapPopups = function() {
  this.buildPopupsIfAny();
  this.updateDamagePopups();
  this.updateNonDamagePopups();
  this._character.setRequestTextPop(false);
};

/**
 * Updates all damage popup sprites on this character.
 */
Sprite_Character.prototype.updateDamagePopups = function() {
  if (this._damages.length > 0) {
    this._damages.forEach(damage => {
      damage.update();
      damage.x = this.x + 150 + damage._xVariance;
      damage.y = this.y + damage._yVariance;
    })

    if (!this._damages[0].isPlaying()) {
      this.parent.removeChild(this._damages[0]);
      this._damages[0].destroy();
      this._damages.shift();
    }
  }
};

/**
 * Updates all non-damage popup sprites on this character.
 */
Sprite_Character.prototype.updateNonDamagePopups = function() {
  if (this._nonDamages.length > 0) {
    this._nonDamages.forEach(nonDamage => {
      nonDamage.update();
      nonDamage.x = this.x + 150 + nonDamage._xVariance;
      nonDamage.y = this.y + nonDamage._yVariance;
    })

    if (!this._nonDamages[0].isPlaying()) {
      this.parent.removeChild(this._nonDamages[0]);
      this._nonDamages[0].destroy();
      this._nonDamages.shift();
    }
  }
};

/**
 * Constructs a damage popup if one is requested.
 */
Sprite_Character.prototype.buildPopupsIfAny = function() {
  if (this._character.getRequestTextPop()) {
    do
    {
      const popup = this._character.getDamagePops().shift();
      const sprite = this.configurePopup(popup);
      sprite._isDamage 
        ? this._damages.push(sprite)
        : this._nonDamages.push(sprite);
      this.parent.addChild(sprite);
    }
    while (this._character.getDamagePops().length);
  }
};

/**
 * Configures a text popup based on it's type.
 * @param {JABS_TextPop} popup The popup details.
 * @returns {Sprite_Damage} The completely configured sprite of the popup.
 */
Sprite_Character.prototype.configurePopup = function(popup) {
  const getRandomNumber = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min))
  }

  let sprite = new Sprite_Damage();

  if (popup.iconIndex > -1) {
    sprite.addIcon(popup.iconIndex);
  }

  switch (popup.popupType) {
    case JABS_TextPop.Types.Damage:
      sprite._xVariance = getRandomNumber(-30, 30);
      sprite._yVariance = getRandomNumber(-30, 30);
      this.buildDamagePopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Slip:
      sprite._xVariance = getRandomNumber(-30, 30);
      sprite._yVariance = getRandomNumber(-10, 50);
      this.buildDamagePopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Experience:
      sprite._xVariance = -40;
      sprite._yVariance = 20;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Gold:
      sprite._xVariance = -40;
      sprite._yVariance = 40;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Sdp:
      sprite._xVariance = -40;
      sprite._yVariance = 60;
      sprite._duration += 180;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Item:
      sprite._xVariance = 60;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 60;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Learn:
      sprite._xVariance = 0;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 120;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.Levelup:
      sprite._xVariance = 0;
      sprite._yVariance = getRandomNumber(-30, 30);
      sprite._duration += 210;
      this.buildBasicPopSprite(sprite, popup);
      break;
    case JABS_TextPop.Types.SkillUsage:
      sprite._xVariance = 60;
      sprite._yVariance = getRandomNumber(-10, 50);
      sprite._duration += 0;
      this.buildSkillUsageSprite(sprite, popup);
      break;
    default:
      console.warn(`unsupported popup type of [${popup.popupType}] found.`);
      sprite._xVariance = getRandomNumber(-30, 30);
      sprite._yVariance = getRandomNumber(-30, 30);
      this.buildBasicPopSprite(sprite, popup);
      break;
  }

  return sprite;
};

/**
 * Configures the values for this damage popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this damage pop.
 * @param {JABS_TextPop} popup The popup details.
 */
Sprite_Character.prototype.buildDamagePopSprite = function(sprite, popup) {
  sprite._isDamage = true;
  sprite._duration = 120;
  let damageValue;

  // handle damage pop based on Game_ActionResult from the target.
  const result = popup.actionResult;
  if (result) {
    // if we have an action result to work with, then use it.
    if (result.evaded) {
      sprite._colorType = 7;
      sprite.createValue("Evade!");
      console.warn('this popup resulted in an evasion somehow');
      console.warn('evasions are not supported by JABS');
      console.error(popup);
      return;  
    } else if (result.parried) {
      sprite._flashColor = [96, 96, 255, 192];
      sprite._flashDuration = 60;
      sprite._colorType = 8;
      sprite.createValue("Parry!");
      return;
    }
  
    if (result.hpAffected) {
      // if hp-centric.
      sprite._colorType = result.hpDamage >= 0 
        ? 0 // hp damage
        : 3;// hp healing
      damageValue = Math.round(result.hpDamage).toString();
    } else if (result.mpDamage !== 0) {
      // if mp-centric.
      sprite._colorType = result.mpDamage >= 0 
        ? 5 // mp damage
        : 4;// mp healing
      damageValue = Math.round(result.mpDamage).toString();
    } else if (result.tpDamage !== 0) {
      // if tp-centric.
      sprite._colorType = result.tpDamage >= 0 
        ? 19 // tp damage
        : 18;// tp healing
      damageValue = Math.round(result.tpDamage).toString();
    }

    // handle visual alterations if critical.
    if (result.critical) {
      sprite._flashColor = [255, 0, 0, 240];
      sprite._flashDuration = 100;
      sprite._isCritical = true;
      sprite._duration += 60;
    }
  } else {
    damageValue = popup.directValue;
    sprite._colorType = popup.textColorIndex;
  }

  // stringify the damage and if its `undefined`, just clean that up.
  damageValue = `${damageValue}`;
  if (damageValue.includes(`undefined`)) {
    damageValue = ``;
  }

  // remove the `-` from healing popups.
  if (damageValue.indexOf(`-`) !== -1) {
    damageValue = damageValue.substring(damageValue.indexOf(`-`) + 1);
  }

  // handle visual alterations if elementally strong/weak.
  if (popup.isStrength) {
    damageValue = `${damageValue}!!!`;
  } else if (popup.isWeakness) {
    damageValue = `${damageValue}...`;
  }

  sprite.createValue(damageValue.toString());
};

/**
 * Configures the values for a basic text popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this experience pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildBasicPopSprite = function(sprite, popup) {
  const value = popup.directValue;
  sprite._colorType = popup.textColorIndex;
  sprite.createValue(`${value}`);
};

/**
 * Configures the values for a basic text popup.
 * @param {Sprite_Damage} sprite The sprite to configure for this experience pop.
 * @param {JABS_TextPop} popup The data for this pop.
 */
Sprite_Character.prototype.buildSkillUsageSprite = function(sprite, popup)
{
  sprite._colorType = popup.textColorIndex;
  sprite.createCustomValue(`${popup.directValue}`);
};
//#endregion popups
//#endregion Sprite_Character

//#region Sprite_Damage
/**
 * Extends this `.initialize()` function to include our parameters for all damage sprites.
 */
J.ABS.Aliased.Sprite_Damage.initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
  J.ABS.Aliased.Sprite_Damage.initialize.call(this);
  this._xVariance = 0;
  this._yVariance = 0;
  this._isCritical = false;
  this._isDamage = false;
  this._icon = null;
  this._persist = false;
};

/**
 * Assigns the custom formatted value to be the text of this popup.
 * @param {string} value The value to display in the popup.
 */
Sprite_Damage.prototype.createCustomValue = function(value)
{
  const h = this.fontSize();
  const w = 400;
  const sprite = this.createChildSprite(w, h);
  sprite.bitmap.fontSize = 14;
  sprite.bitmap.fontItalic = true;
  sprite.bitmap.paintOpacity = 128;
  sprite.bitmap.drawText(value, 32, 0, w, h, "left");
  sprite.dy = 0;
};

/**
 * Assigns the provided value to be the text of this popup.
 * @param {string} value The value to display in the popup. 
 */
Sprite_Damage.prototype.createValue = function(value)
{
  const h = this.fontSize();
  const w = 400;
  const sprite = this.createChildSprite(w, h);
  let fontSize = 20;
  if (this._isCritical) {
    fontSize += 12;
    sprite.bitmap.fontBold = true;
  } else if (value.includes("Missed") || value.includes("Evaded") || value.includes("Parry")) {
    fontSize -= 6;
    sprite.bitmap.fontItalic = true;
  }

  sprite.bitmap.fontSize = fontSize;
  sprite.bitmap.drawText(value, 32, 0, w, h, "left");
  sprite.dy = 0;
};

/**
 * Adds an icon to the damage sprite.
 * @param {number} iconIndex The id/index of the icon on the iconset.
 */
Sprite_Damage.prototype.addIcon = function(iconIndex) {
  const sprite = this.createChildSprite(32, 32);
  const bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;
  sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
  sprite.scale.x = 0.75;
  sprite.scale.y = 0.75;
  sprite.x -= 180;
  sprite.y += 15;
  sprite.dy = 0;
}

/**
 * OVERWRITE
 * 
 * Updates the duration to start fading later, and for longer.
 */
Sprite_Damage.prototype.updateOpacity = function() {
  if (this._duration < 60 && this._persist === false) {
    this.opacity = (255 * this._duration) / 60;
  }
}

/**
 * OVERWRITE Updates the damage color to be any color on the system palette.
 */
Sprite_Damage.prototype.damageColor = function() {
  return ColorManager.textColor(this._colorType);
}
//#endregion Sprite_Damage

//#region Sprite_Gauge
/**
 * Due to JABS' slip effects, we have fractional hp/mp/tp values.
 * This rounds up the values for the sprite gauge if they are a number.
 */
J.ABS.Aliased.Sprite_Gauge.currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function() {
  let base = J.ABS.Aliased.Sprite_Gauge.currentValue.call(this);
  if (base !== NaN) {
    base = Math.ceil(base);
  }

  return base;
};
//#endregion Sprite_Gauge
//ENDFILE