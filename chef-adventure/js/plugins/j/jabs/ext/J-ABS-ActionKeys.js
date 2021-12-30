//#region initialization
/*:
* @target MZ
* @plugindesc
* [v1.0 KEYS] The Action Keys for JABS.
* @author JE
* @url https://github.com/je-can-code/rmmz
* @base J-BASE
* @base J-ABS
* @orderAfter J-BASE
* @orderAfter J-ABS
* @help
* ============================================================================
* This plugin displays all equipped skills that the leader of the party has
* equipped in the context of JABS. It will also show cooldowns and costs.
* ============================================================================
*
* @param BreakHead
* @text --------------------------
* @default ----------------------------------
*
* @param Extensions
* @default Modify Below
*
* @param BreakSettings
* @text --------------------------
* @default ----------------------------------
*
* @param Enabled
* @type boolean
* @desc Use Action Keys display?
* @default true
*
* @command Show Action Keys
* @text Show Action Keys
* @desc Shows the action keys on the screen.
*
* @command Hide Action Keys
* @text Hide Action Keys
* @desc Hides the action keys. Actions still exist, but the visual component is hidden.
*/

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

// Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '1.0.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.KEYS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.KEYS.Metadata = {};
J.KEYS.Metadata.Version = '1.0.0';
J.KEYS.Metadata.Name = `J-ABS-ActionKeys`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.KEYS.PluginParameters = PluginManager.parameters(`J-ABS-ActionKeys`);
J.KEYS.Metadata.Active = Boolean(J.KEYS.PluginParameters['Enabled']);
J.KEYS.Metadata.Enabled = true;

/**
 * A collection of all aliased methods for this plugin.
 */
J.KEYS.Aliased =
  {
    Scene_Map: new Map(),
  };

//#region plugin commands
/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.KEYS.Metadata.Name, "Show Action Keys", () =>
{
  J.KEYS.Metadata.Active = true;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.KEYS.Metadata.Name, "Hide Action Keys", () =>
{
  J.KEYS.Metadata.Active = false;
});
//#endregion plugin commands
//#endregion initialization

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.KEYS.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  J.KEYS.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The action keys window.
   * @type {Window_ActionKeys|null}
   */
  this._j._actionKeysWindow = null;
};

/**
 * Once the map is loaded, hook in and create the `JABS_BattlerManager` for managing
 * the JABS.
 */
J.KEYS.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  J.KEYS.Aliased.Scene_Map.get('createAllWindows').call(this);
  this.createJabsActionKeys();
};

/**
 * Creates the internal action keys for JABS.
 */
Scene_Map.prototype.createJabsActionKeys = function()
{
  const rect = this.actionKeysWindowRect();
  this._j._actionKeysWindow = new Window_ActionKeys(rect);
  this.addWindow(this._j._actionKeysWindow);
};

/**
 * Creates the rectangle representing the window for the action keys.
 * @returns {Rectangle}
 */
Scene_Map.prototype.actionKeysWindowRect = function()
{
  const width = 600;
  const height = 184;
  const x = Graphics.boxWidth - width;
  const y = Graphics.boxHeight - height;
  return new Rectangle(x, y, width, height);
};

/**
 * Toggles the visibility and functionality of the externally managed action keys.
 * @param {boolean} toggle Whether or not to display the external action keys.
 */
Scene_Map.prototype.toggleKeys = function(toggle = true)
{
  if (J.KEYS.Metadata.Enabled)
  {
    this._j._actionKeysWindow.toggle(toggle);
  }
};

J.KEYS.Aliased.Scene_Map.set('commandAssign', Scene_Map.prototype.commandAssign);
Scene_Map.prototype.commandAssign = function()
{
  // execute the original logic.
  J.KEYS.Aliased.Scene_Map.get('commandAssign').call(this);
  this._j._actionKeysWindow.refresh();
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Window objects
//#region Window_ActionKeys
/**
 * The built-in window for displaying the action keys.
 */
function Window_ActionKeys()
{
  this.initialize(...arguments);
}

Window_ActionKeys.prototype = Object.create(Window_Base.prototype);
Window_ActionKeys.prototype.constructor = Window_ActionKeys;

/**
 * Initializes this window.
 * @param {Rectangle} rect The dimensions and coordinates of this window.
 */
Window_ActionKeys.prototype.initialize = function(rect)
{
  Window_Base.prototype.initialize.call(this, rect);
  this.opacity = 0;
  this.initMembers();
};

/**
 * Initializes all the properties of this class.
 */
Window_ActionKeys.prototype.initMembers = function()
{
  /**
   * The actor being managed within this Hud.
   */
  this._actor = null;

  /**
   * The dictionary of sprites for this window, used for action keys.
   */
  this._sprites = {};

  /**
   * Whether or not the action keys should be visible.
   */
  this._enabled = true;
};

/**
 * The update cycle. Refreshes values as-needed and handles all the drawing.
 */
Window_ActionKeys.prototype.update = function()
{
  Window_Base.prototype.update.call(this);
  if (this.canUpdate())
  {
    this.drawActionKeys();
  }
  else
  {
    this.manageVisibility();
    this.refresh();
  }
};

/**
 * Handles visibility for the action keys.
 */
Window_ActionKeys.prototype.manageVisibility = function()
{
  if ($gameMessage.isBusy())
  {
    this.opacity = 0;
    this.close();
  }
  else
  {
    this.open();
  }
};

/**
 * Toggles visibility of the action keys on the screen.
 * @param {boolean} toggle True if showing the action keys, false otherwise.
 */
Window_ActionKeys.prototype.toggle = function(toggle = !this._enabled)
{
  this._enabled = toggle;
  this.manageVisibility();
};

/**
 * Whether or not this window actually has an actor to display data for.
 * @returns {boolean} True if there is an actor to update, false otherwise.
 */
Window_ActionKeys.prototype.canUpdate = function()
{
  if (!$gameParty || !$gameParty.leader() || !this.contents ||
    !this._enabled || !J.KEYS.Metadata.Active || $gameMessage.isBusy())
  {
    return false;
  }

  return true;
};

/**
 * Refreshes the window and forces a recreation of all sprites.
 */
Window_ActionKeys.prototype.refresh = function()
{
  this.contents.clear();
  const keys = Object.keys(this._sprites);
  keys.forEach(key =>
  {
    this._sprites[key].destroy();
    delete this._sprites[key];
  })

  this._sprites = {};
};

/**
 * Draws the contents of the action keys window.
 */
Window_ActionKeys.prototype.drawActionKeys = function()
{
  this.contents.clear();
  this._actor = $gameParty.leader();
  const akh = 46;
  const cw = 52;
  const middleY = Math.round((this.height) / 2 - akh);
  const bottomY = (Math.round(middleY / 2)) + akh + 10;
  const topY = (Math.round(middleY / 2)) - (akh / 2);

  this.drawActionKey(Game_Actor.JABS_MAINHAND, cw * 0, middleY);
  this.drawActionKey(Game_Actor.JABS_OFFHAND, cw * 1, middleY);
  this.drawActionKey(Game_Actor.JABS_DODGESKILL, cw * 2, bottomY);
  this.drawActionKey(Game_Actor.JABS_TOOLSKILL, cw * 2, topY, true);

  this.drawActionKey(Game_Actor.JABS_L1_X_SKILL, cw * 4, middleY);
  this.drawActionKey(Game_Actor.JABS_L1_A_SKILL, cw * 5, bottomY);
  this.drawActionKey(Game_Actor.JABS_L1_Y_SKILL, cw * 5, topY);
  this.drawActionKey(Game_Actor.JABS_L1_B_SKILL, cw * 6, middleY);

  this.drawActionKey(Game_Actor.JABS_R1_X_SKILL, cw * 8, middleY);
  this.drawActionKey(Game_Actor.JABS_R1_A_SKILL, cw * 9, bottomY);
  this.drawActionKey(Game_Actor.JABS_R1_Y_SKILL, cw * 9, topY);
  this.drawActionKey(Game_Actor.JABS_R1_B_SKILL, cw * 10, middleY);

  if (this.playerInterference())
  {
    this.interferenceOpacity();
  }
  else
  {
    this.refreshOpacity();
  }
};

/**
 * Determines whether or not the player is in the way (or near it) of this window.
 * @returns {boolean} True if the player is in the way, false otherwise.
 */
Window_ActionKeys.prototype.playerInterference = function()
{
  const player = $gamePlayer;
  const playerX = player.screenX();
  const playerY = player.screenY();
  if (playerX > (this.x + 50) && playerY > (this.y + 50))
  {
    return true;
  }

  return false;
};

/**
 * Reduces opacity of all sprites when the player is in the way.
 */
Window_ActionKeys.prototype.interferenceOpacity = function()
{
  const sprites = this._sprites;
  const keys = Object.keys(sprites);
  keys.forEach(key =>
  {
    const sprite = sprites[key];
    if (sprite.opacity > 64) sprite.opacity -= 15;
    if (sprite.opacity < 64) sprite.opacity += 1;
  });
};

/**
 * Reverts the opacity to normal when the player is no longer in the way.
 */
Window_ActionKeys.prototype.refreshOpacity = function()
{
  const sprites = this._sprites;
  const keys = Object.keys(sprites);
  keys.forEach(key =>
  {
    const sprite = sprites[key];
    if (sprite.opacity < 255) sprite.opacity += 15;
    if (sprite.opacity > 255) sprite.opacity = 255;
  });
};

/**
 * Draws a single action key and all it's relevant info.
 * @param {string} skillType The skill type (ex: "mainhand", "offhand", etc).
 * @param {number} x The `x` coordinate of this sprite.
 * @param {number} y The `y` coordinate of this sprite.
 * @param {boolean} isItem True if this is an item, false if it is a skill (default = false).
 */
Window_ActionKeys.prototype.drawActionKey = function(skillType, x, y, isItem = false)
{
  this.hideUnusedActionKeys(skillType);
  const mapBattler = $gameBattleMap.getPlayerMapBattler();
  const actionKeyData = mapBattler.getActionKeyData(skillType);
  const cooldownData = actionKeyData.cooldown;
  if (!cooldownData)
  {
    return;
  }

  const skillslotData = actionKeyData.skillslot;
  const skillId = (cooldownData.comboNextActionId > 0)
    ? cooldownData.comboNextActionId
    : skillslotData.id;
  if (!skillId)
  {
    return;
  }

  const referenceData = !isItem
    ? $dataSkills[skillId]
    : $dataItems[skillId];

  const iconIndex = referenceData.iconIndex;
  this.placeActionKeyIconSprite(iconIndex, skillType, x + 4, y + 20);
  this.placeActionKeyButtonLabel(skillType, x - 44, y);
  this.placeActionKeyComboGauge(skillType, cooldownData, x, y + 70)
  this.placeActionKeyCooldownTimer(skillType, cooldownData, x, y + 40, isItem);
  this.placeActionKeyAbilityCosts(skillType, referenceData, x - 84, y + 40);
}

/**
 * Hides all icons associated with a given skillType for the action key.
 * Typically used when a skill slot has nothing currently equipped.
 * @param {string} skillType The skilltype to hide the icons for.
 */
Window_ActionKeys.prototype.hideUnusedActionKeys = function(skillType)
{
  const spriteKeysOfIcon = Object
    .keys(this._sprites)
    .filter(key =>
    {
      if (key.contains(`${skillType}`))
      {
        return true;
      }
      else
      {
        return false;
      }
    })

  spriteKeysOfIcon.forEach(key => this._sprites[key].hide());
}

/**
 * Places an action key icon at a designated location.
 * @param {number} iconIndex The index of the icon on the iconsheet.
 * @param {string} skillType The type of skill being placed.
 * @param {number} x The origin `x` coordinate.
 * @param {number} y The origin `y` coordinate.
 */
Window_ActionKeys.prototype.placeActionKeyIconSprite = function(iconIndex, skillType, x, y)
{
  const key = "actor%1-icon-%2-%3".format(this._actor.actorId(), iconIndex, skillType);
  const sprite = this.createActionKeyIconSprite(key, iconIndex);
  sprite.move(x, y);
  sprite.show();
}

/**
 * Either retrieves a sprite of a given key, or creates it anew because its missing.
 * @param {string} key The unique identifier for this sprite.
 * @param {number} iconIndex The index of the icon on the iconsheet.
 */
Window_ActionKeys.prototype.createActionKeyIconSprite = function(key, iconIndex)
{
  const sprites = this._sprites;
  if (sprites[key])
  {
    return sprites[key];
  }
  else
  {
    const sprite = new Sprite_Icon(iconIndex);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
}

/**
 * Places the action key button label sprite at a designated location.
 * @param {string} skillType The skill type of this action key.
 * @param {number} x The `x` coordinate of this sprite.
 * @param {number} y The `y` coordinate of this sprite.
 */
Window_ActionKeys.prototype.placeActionKeyButtonLabel = function(skillType, x, y)
{
  const key = "actor%1-label-%2".format(this._actor.actorId(), skillType);
  const sprite = this.createActionKeyButtonLabel(key, skillType);
  sprite.move(x, y);
  sprite.show();
}

/**
 * Creates (or fetches) the sprite for this button label.
 * @param {string} key The key of the sprite.
 * @param {string} skillType The skill type of this action key.
 */
Window_ActionKeys.prototype.createActionKeyButtonLabel = function(key, skillType)
{
  const sprites = this._sprites;
  if (sprites[key])
  {
    return sprites[key];
  }
  else
  {
    const sprite = new Sprite_Text(skillType, null, -10);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
}

/**
 * Places the action key combo gauge sprite at a designated location.
 * @param {string} skillType The skill type of this action key.
 * @param {object} cooldownData The cooldown data for this action.
 * @param {number} x The `x` coordinate of this sprite.
 * @param {number} y The `y` coordinate of this sprite.
 */
Window_ActionKeys.prototype.placeActionKeyComboGauge = function(skillType, cooldownData, x, y)
{
  const key = "actor%1-comboGauge-%2".format(this._actor.actorId(), skillType);
  const sprite = this.createActionKeyComboGauge(key, cooldownData);
  sprite.move(x, y);
  sprite.show();
}

/**
 * Creates (or fetches) the sprite for this combo gauge.
 * @param {string} key The key of the sprite.
 * @param {object} cooldownData The cooldown data for this action.
 */
Window_ActionKeys.prototype.createActionKeyComboGauge = function(key, cooldownData)
{
  const sprites = this._sprites;
  if (sprites[key])
  {
    return sprites[key];
  }
  else
  {
    const sprite = new Sprite_ComboGauge(cooldownData);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
}

/**
 * Places the action key cooldown timer sprite at a designated location.
 * @param {string} skillType The skill type of this action key.
 * @param {JABS_Cooldown} cooldownData The cooldown data for this action.
 * @param {number} x The `x` coordinate of this sprite.
 * @param {number} y The `y` coordinate of this sprite.
 * @param {boolean} isItem True if this is an item, false if it is a skill.
 */
Window_ActionKeys.prototype.placeActionKeyCooldownTimer = function(skillType, cooldownData, x, y, isItem)
{
  const key = "actor%1-cooldown-%2".format(this._actor.actorId(), skillType);
  const sprite = this.createActionKeyCooldownTimer(key, skillType, cooldownData, isItem);
  sprite.move(x, y);
  sprite.show();
}

/**
 * Creates (or fetches) the sprite for this cooldown timer.
 * @param {string} key The key of the sprite.
 * @param {string} skillType The skill type of this action key.
 * @param {JABS_Cooldown} cooldownData The cooldown data for this action.
 * @param {boolean} isItem True if this is an item, false if it is a skill.
 */
Window_ActionKeys.prototype.createActionKeyCooldownTimer = function(key, skillType, cooldownData, isItem)
{
  const sprites = this._sprites;
  if (sprites[key])
  {
    return sprites[key];
  }
  else
  {
    const sprite = new Sprite_CooldownTimer(skillType, cooldownData, isItem);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
}

/**
 * Places the action key cooldown timer sprite at a designated location.
 * @param {string} skillType The skill type of this action key.
 * @param {object} referenceData The reference data for the skill or item to draw costs for.
 * @param {number} x The `x` coordinate of this sprite.
 * @param {number} y The `y` coordinate of this sprite.
 */
Window_ActionKeys.prototype.placeActionKeyAbilityCosts = function(skillType, referenceData, x, y)
{
  const isItem = DataManager.isItem(referenceData);
  const actorId = this._actor.actorId();
  const actor = $gameActors.actor(actorId);

  // for abilities with an hp cost, draw that.
  // TODO: figure out hp cost reduction when thats a thing.
  const hpCost = isItem ? "" : (referenceData.hpCost * 1) || "";
  const hpColor = 21;
  const hpKey = "actor%1-hpcost-%2".format(actorId, skillType);
  const hpSprite = this.createActionKeyAbilityCosts(hpKey, hpCost, hpColor);
  hpSprite.move(x, y - 30);
  hpSprite.show();

  // for abilities with an mp cost, draw that.
  let mpCost = isItem ? 0 : Number(referenceData.mpCost * actor.mcr);
  mpCost = (mpCost > 0) ? mpCost.toFixed(0) : mpCost = "";

  const mpColor = 23;
  const mpKey = "actor%1-mpcost-%2".format(actorId, skillType);
  const mpSprite = this.createActionKeyAbilityCosts(mpKey, mpCost, mpColor);
  mpSprite.move(x, y - 15);
  mpSprite.show();

  // for abilities with an tp cost, draw that.
  let tpCost = isItem ? "" : Number(referenceData.tpCost * actor.tcr);
  tpCost = (tpCost > 0) ? tpCost.toFixed(0) : tpCost = "";

  const tpColor = 29;
  const tpKey = "actor%1-tpcost-%2".format(actorId, skillType);
  const tpSprite = this.createActionKeyAbilityCosts(tpKey, tpCost, tpColor);
  tpSprite.move(x, y);
  tpSprite.show();

  // if its an item, determine the remaining count and draw that.
  if (isItem)
  {
    const itemsLeft = $gameParty.numItems(referenceData);
    const itemColor = 0;
    const itemKey = "actor%1-itemcount-%2-%3".format(actorId, skillType, referenceData.id);
    const itemSprite = this.createActionKeyAbilityCosts(itemKey, itemsLeft, itemColor, referenceData.id);
    itemSprite.move(x - 30, y);
    itemSprite.show();
  }
}

/**
 * Creates (or fetches) the sprite for this cooldown timer.
 * @param {string} key The key of the sprite.
 * @param {string} skillType The skill type of this action key.
 * @param {JABS_Cooldown} cooldownData The cooldown data for this action.
 * @param {boolean} itemId The id of the item if an item, otherwise 0 (for updating count).
 */
Window_ActionKeys.prototype.createActionKeyAbilityCosts = function(key, cost, color, itemId = 0)
{
  const sprites = this._sprites;
  if (sprites[key])
  {
    return sprites[key];
  }
  else
  {
    const sprite = new Sprite_AbilityCost(cost, color, itemId);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
}
//#endregion Window_ActionKeys
//#endregion Window objects

//#region Sprite objects
//#region Sprite_AbilityCost
/**
 * A sprite that displays some static text.
 */
function Sprite_AbilityCost()
{
  this.initialize(...arguments);
}

Sprite_AbilityCost.prototype = Object.create(Sprite_Text.prototype);
Sprite_AbilityCost.prototype.constructor = Sprite_Text;
Sprite_AbilityCost.prototype.initialize = function(text, color, itemId = 0)
{
  Sprite_Text.prototype.initialize.call(this, text, color);
  this._j._itemId = itemId;
}

Sprite_AbilityCost.prototype.update = function()
{
  Sprite_Text.prototype.update.call(this);
  if (this._j._itemId)
  {
    const referenceData = $dataItems[this._j._itemId];
    this._j._text = $gameParty.numItems(referenceData);
    this.loadBitmap();
  }
}

Sprite_AbilityCost.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 12;
}

Sprite_AbilityCost.prototype.textAlignment = function()
{
  return "right";
}
//#endregion

//#region Sprite_ComboGauge
/**
 * The gauge sprite for handling combo timing.
 */
function Sprite_ComboGauge()
{
  this.initialize(...arguments);
}

Sprite_ComboGauge.prototype = Object.create(Sprite.prototype);
Sprite_ComboGauge.prototype.constructor = Sprite_ComboGauge;
Sprite_ComboGauge.prototype.initialize = function(cooldownData)
{
  this._j = {};
  this._gauge = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(cooldownData);
  this.createBitmap();
}

/**
 * Initializes all parameters for this sprite.
 * @param {object} cooldownData The cooldown data for this combo gauge.
 */
Sprite_ComboGauge.prototype.initMembers = function(cooldownData)
{
  this._j._maxUnassigned = true;
  this._j._cooldownData = cooldownData;
  this._j._cooldownMax = 0;
  this._gauge._valueCurrent = 0;
  this._gauge._valueMax = 0;
}

/**
 * Creates the bitmap for this sprite.
 */
Sprite_ComboGauge.prototype.createBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
}

/**
 * Updates this gauge.
 */
Sprite_ComboGauge.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  // don't draw if there isn't a combo available.
  if (!this._j._cooldownData.comboNextActionId)
  {
    this.bitmap.clear();
    return;
  }

  // if this gauge is uninitiated or the user is comboing, reset the max.
  const shouldInitialize = this._j._cooldownData.comboReady && this._j._maxUnassigned;
  const chainComboing = this._gauge._valueMax < this._j._cooldownData.frames;
  if (shouldInitialize || chainComboing)
  {
    this._j._maxUnassigned = false;
    this._gauge._valueMax = JsonEx.makeDeepCopy(this._j._cooldownData.frames);
  }

  // cooldown is ready, combo is no longer available.
  if (this._j._cooldownData.ready)
  {
    this._j._maxUnassigned = true;
    this._gauge._valueMax = 0;
  }
  this.redraw();
}

/**
 * The width of the whole bitmap.
 * @param {number} bitmapWidth The width of the bitmap for this gauge.
 */
Sprite_ComboGauge.prototype.bitmapWidth = function()
{
  return 32;
}

/**
 * The height of the whole bitmap.
 * @param {number} bitmapHeight The height of the bitmap for this gauge.
 */
Sprite_ComboGauge.prototype.bitmapHeight = function()
{
  return 20;
}

/**
 * The height of this gauge.
 * @param {number} gaugeHeight The height of the gauge itself.
 */
Sprite_ComboGauge.prototype.gaugeHeight = function()
{
  return 10;
}

/**
 * The current value for this gauge.
 */
Sprite_ComboGauge.prototype.currentValue = function()
{
  return this._j._cooldownData.frames;
}

/**
 * The max value for this gauge.
 * @returns {number}
 */
Sprite_ComboGauge.prototype.currentMaxValue = function()
{
  return this._gauge._valueMax;
}

/**
 * OVERWRITE
 * Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_ComboGauge.prototype.redraw = function()
{
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue))
  {
    this.drawGauge();
  }
}

Sprite_ComboGauge.prototype.gaugeColor1 = function()
{
  return "rgba(0, 0, 255, 1)";
};

Sprite_ComboGauge.prototype.gaugeColor2 = function()
{
  return "rgba(0, 255, 0, 1)";
};

Sprite_ComboGauge.prototype.gaugeBackColor = function()
{
  return "rgba(0, 0, 0, 0.5)";
};

Sprite_ComboGauge.prototype.isValid = function()
{
  if (this.currentMaxValue())
  {
    return true;
  }
  else
  {
    return false;
  }
}

Sprite_ComboGauge.prototype.drawGauge = function()
{
  const gaugeX = 0;
  const gaugeY = this.bitmapHeight() - this.gaugeHeight();
  const gaugewidth = this.bitmapWidth() - gaugeX;
  const gaugeHeight = this.gaugeHeight();
  this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
}

Sprite_ComboGauge.prototype.drawGaugeRect = function(x, y, width, height)
{
  const rate = this.gaugeRate();
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  this.bitmap.fillRect(x, y, width, height, this.gaugeBackColor());
  this.bitmap.gradientFillRect(
    x + 1, y + 1,
    fillW, fillH,
    this.gaugeColor1(), this.gaugeColor2());
}

Sprite_ComboGauge.prototype.gaugeRate = function()
{
  if (this.isValid())
  {
    const value = this.currentValue();
    const maxValue = this.currentMaxValue();
    return maxValue > 0 ? value / maxValue : 0;
  }
  else
  {
    return 0;
  }
}
//#endregion

//#region Sprite_CooldownTimer
/**
 * A sprite that displays a timer representing the cooldown time for a JABS action.
 */
function Sprite_CooldownTimer()
{
  this.initialize(...arguments);
}

Sprite_CooldownTimer.prototype = Object.create(Sprite.prototype);
Sprite_CooldownTimer.prototype.constructor = Sprite_CooldownTimer;
Sprite_CooldownTimer.prototype.initialize = function(skillType, cooldownData, isItem = false)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(skillType, cooldownData, isItem);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {string} skillType The slot that this skill maps to.
 * @param {object} cooldownData The cooldown data associated with this cooldown sprite.
 * @param {boolean} isItem Whether or not this cooldown timer is for an item.
 */
Sprite_CooldownTimer.prototype.initMembers = function(skillType, cooldownData, isItem)
{
  this._j = {};
  this._j._skillType = skillType;
  this._j._cooldownData = cooldownData;
  this._j._isItem = isItem;
}

/**
 * Loads the bitmap into the sprite.
 */
Sprite_CooldownTimer.prototype.loadBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.drawText(
    this._j._text,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
}

Sprite_CooldownTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
}

Sprite_CooldownTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  let baseCooldown = (this._j._cooldownData.frames / 60).toFixed(1);
  if (typeof baseCooldown === 'undefined')
  {
    baseCooldown = 0;
  }

  let cooldownBaseText = baseCooldown > 0
    ? baseCooldown
    : "✔";
  let cooldownComboText = (cooldownBaseText > 0 && this._j._cooldownData.comboNextActionId != 0)
    ? "COMBO!"
    : "❌";

  this.bitmap.drawText(
    cooldownBaseText,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize() - 8;
  this.bitmap.fontItalic = true;
  this.bitmap.drawText(
    cooldownComboText,
    0, this.fontSize(),
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.fontItalic = false;

}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapWidth = function()
{
  return 40;
}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
}

/**
 * Determines the font size for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
}

/**
 * determines the font face for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
}
//#endregion
//#endregion Sprite objects

//ENDFILE