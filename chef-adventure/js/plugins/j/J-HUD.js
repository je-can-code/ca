//#region introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 HUD] A default HUD, designed for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This is a simple HUD plugin that shows some of the key data points that the
 * player may want to see while on the map. This primarily was designed for use
 * with JABS, but does not require it.
 * 
 * This was designed to be uncustomizable from a regular RM dev perspective,
 * however the code is more than clear enough to go in and tweak as you need in
 * order to move the HUD itself or any of it's components around.
 * 
 * There is a single plugin command for toggling the HUD itself.
 * 
 * If you have followers, but maybe aren't using JABS, or aren't using the ally
 * AI plugin to turn your followers into battlers as well, or just don't like
 * showing the the follower's information, there is a plugin parameter to
 * toggle other member's HUD visibility.
 * 
 * If you decide that the HUD isn't the greatest so you want to use another
 * HUD (like moghunter's or something). However, you're using JABS, and want to
 * be able to view the state data (which is custom-managed by JABS)... then
 * there is another plugin parameter for you! "Hide All but States?" toggle
 * will force the HUD to skip drawing all but the states functionality.
 * 
 * Additionally, to compliment the desire to only draw states, there are plugin
 * parameters for adjusting the X/Y coordinates of the HUD, which will allow
 * you to move where the states are displayed. Alternatively, you are free to
 * lift the code within the "//#region states" block and place it in another
 * plugin and adjust it as-needed to add the state functionality into another
 * HUD instead. You probably will need some degree of RM plugin development
 * experience to accomplish this effort.
 * ============================================================================
 * 
 * @param baseConfigs
 * @text BASE SETUP
 * 
 * @param enabled
 * @parent baseConfigs
 * @type boolean
 * @text Enable HUD?
 * @desc If this is set to true, then the HUD will show up. False will hide it.
 * @default true
 * 
 * @param hideFollowersHudAlways
 * @parent baseConfigs
 * @type boolean
 * @text Hide Followers HUD?
 * @desc If followers are enabled, by default their HUD will show.
 * This hides the follower's HUD components no matter what.
 * @default false
 * 
 * @param externalConfigs
 * @text EXTERNAL COMPATIBILITY
 *  
 * @param hideAllButStates
 * @parent externalConfigs
 * @type boolean
 * @text Hide all but States?
 * @desc If using another HUD, you may want to only show states.
 * This will hide all components of the HUD except states.
 * @default false
 * 
 * @param hudX
 * @parent externalConfigs
 * @type number
 * @min -1
 * @text HUD X coordinate
 * @desc Sets the X coordinate of the HUD window to this value.
 * If this is -1, it will use the default coordinates.
 * @default -1
 * 
 * @param hudY
 * @parent externalConfigs
 * @type number
 * @min -1
 * @text HUD Y coordinate
 * @desc Sets the Y coordinate of the HUD window to this value.
 * If this is -1, it will use the default coordinates.
 * @default -1
 * 
 * 
 * @command Show HUD
 * @text Show HUD
 * @desc Shows the HUD on the map.
 * 
 * @command Hide HUD
 * @text Hide HUD
 * @desc Hides the HUD on the map.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.Metadata = {};
J.HUD.Metadata.Version = '1.0.0';
J.HUD.Metadata.Name = `J-Hud`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.PluginParameters = PluginManager.parameters(`J-HUD`);
J.HUD.Metadata.Enabled = J.HUD.PluginParameters['enabled'] === "true";
J.HUD.Metadata.HideFollowersHudAlways = J.HUD.PluginParameters['hideFollowersHudAlways'] === "true";
J.HUD.Metadata.HideAllButStates = J.HUD.PluginParameters['hideAllButStates'] === "true";
J.HUD.Metadata.Xcoordinate = Number(J.HUD.PluginParameters['hudX']);
J.HUD.Metadata.Ycoordinate = Number(J.HUD.PluginParameters['hudY']);

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.Aliased = {
  Scene_Map: {},
};

/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "Show Hud", () => {
  J.HUD.Metadata.Enabled = true;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "Hide Hud", () => {
  J.HUD.Metadata.Enabled = false;
});
//#endregion introduction

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.HUD.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.HUD.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this._j._hud = null;
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.HUD.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
  this.createHud();
  J.HUD.Aliased.Scene_Map.createAllWindows.call(this);
};

/**
 * Creates the default HUD for JABS.
 */
Scene_Map.prototype.createHud = function() {
  const ww = 400;
  const wh = 300;
  // if we have coordinates from the plugin parameters, use those instead.
  const wx = (J.HUD.Metadata.Xcoordinate > -1)
    ? parseInt(J.HUD.Metadata.Xcoordinate)
    : -((Graphics.width - Graphics.boxWidth) / 2);
  const wy = (J.HUD.Metadata.Ycoordinate > -1)
    ? parseInt(J.HUD.Metadata.Ycoordinate)
    : -((Graphics.height - Graphics.boxHeight) / 2);

  const rect = new Rectangle(wx-8, wy-8, ww, wh);
  this._j._hud = new Window_Hud(rect);
  this.addWindow(this._j._hud);
};

/**
 * If the HUD is in use, move the map name over a bit.
 */
Scene_Map.prototype.mapNameWindowRect = function() {
  const wx = 400;
  const wy = 0;
  const ww = 360;
  const wh = this.calcWindowHeight(1, false);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Toggles the visibility and functionality of the built-in JABS hud.
 * @param {boolean} toggle Whether or not to display the default hud.
 */
Scene_Map.prototype.toggleHud = function(toggle = true) {
  if (J.HUD.Metadata.Enabled) {
    this._j._hud.toggle(toggle);
  }
};

/**
 * Refreshes the hud on-command.
 */
Scene_Map.prototype.refreshHud = function() {
  this._j._hud.refresh();
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Window objects
//#region Window_Hud
/**
 * The built-in Hud window that contains all of the leader's info in realtime.
 */
function Window_Hud() { this.initialize(...arguments); }
Window_Hud.prototype = Object.create(Window_Base.prototype);
Window_Hud.prototype.constructor = Window_Hud;

/**
 * Initializes the entire Hud.
 * @param {Rectangle} rect The rectangle object that defines the shape of this HUD.
 */
Window_Hud.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.opacity = 0;
  this.initMembers();
};

/**
 * Initializes the various variables required for the HUD.
 */
Window_Hud.prototype.initMembers = function() {
  /**
   * The cache of sprites used within this HUD window.
   */
  this._hudSprites = {};

  /**
   * Whether or not the hud should be visible.
   */
  this._enabled = true;
};

/**
 * Refreshes the hud and forces a recreation of all sprites.
 */
Window_Hud.prototype.refresh = function() {
  this.contents.clear();
  const keys = Object.keys(this._hudSprites);
  keys.forEach(key => {
    this._hudSprites[key].destroy();
    delete this._hudSprites[key];
  });

  this._hudSprites = {};
};

/**
 * The update cycle. Refreshes values as-needed and handles all the drawing.
 */
Window_Hud.prototype.update = function() {
  Window_Base.prototype.update.call(this);
  if (this.canUpdate()) {
    this.drawHud();
  } else {
    this.manageVisibility();
    this.refresh();
  }
};

/**
 * Handles visibility for the HUD.
 */
Window_Hud.prototype.manageVisibility = function()
{
  if ($gameMessage.isBusy()) {
    this.opacity = 0;
    this.close();
  }
  else
  {
    this.open();
  }

  this._toggled = false;
};

/**
 * Toggles whether or not this hud is enabled.
 * @param {boolean} toggle Toggles the hud to be visible and operational.
 */
Window_Hud.prototype.toggle = function(toggle = !this._enabled) {
  this._enabled = toggle;
  this.manageVisibility();
};

/**
 * Whether or not the hud actually has an actor to display data for.
 * @returns {boolean} True if there is an actor to update, false otherwise.
 */
Window_Hud.prototype.canUpdate = function() {
  return !(!$gameParty || !$gameParty.leader() || !this.contents ||
    !this._enabled || $gameMessage.isBusy());
};

/**
 * Draws the contents of the HUD.
 */
Window_Hud.prototype.drawHud = function() {
  this.drawLeaderHud();
  if (!J.HUD.Metadata.HideFollowersHudAlways) {
    this.drawOtherMembersHuds();
  }

  if (this.playerInterference()) {
    this.interferenceOpacity();
  } else {
    this.refreshOpacity();
  }
};

/**
 * Draws all leader data for the HUD.
 * Leader data includes face/HP/MP/TP/experience/level.
 */
Window_Hud.prototype.drawLeaderHud = function() {
  if (!J.HUD.Metadata.HideAllButStates) {
    this.drawLeaderFace();
    this.drawLeaderGauges();
    this.drawLeaderNumbers();  
  }

  this.drawStates();
};

/**
 * Draws the leader's face sprite.
 */
Window_Hud.prototype.drawLeaderFace = function() {
  const leader = $gameParty.leader();
  this.placeFaceSprite(leader.actorId(), leader.faceName(), leader.faceIndex(), true, 0, 0);
};

/**
 * Draws all the gauge sprites for the leader's data.
 */
 Window_Hud.prototype.drawLeaderGauges = function() {
  const leader = $gameParty.leader();
  this.placeGaugeSprite("hp",   leader, 100, 0, 200, 24, 14);
  this.placeGaugeSprite("mp",   leader, 100, 25, 200, 24, 14);
  this.placeGaugeSprite("tp",   leader, 100, 44, 200, 20, 8);
  this.placeGaugeSprite("time", leader, 130, 72, 170, 20, 10); // xp
};

/**
 * Draws all the number sprites for the leader's data.
 */
Window_Hud.prototype.drawLeaderNumbers = function() {
  const leader = $gameParty.leader();
  this.placeNumberSprite("hp",  leader, 302, 6, -10);
  this.placeNumberSprite("mp",  leader, 302, 31, -10);
  this.placeNumberSprite("tp",  leader, 302, 53, -16);
  this.placeNumberSprite("xp",  leader, 302, 78, -12);
  this.placeNumberSprite("lvl", leader, 90, 78, -6);
};

/**
 * Draws all the non-leader data for the HUD.
 * Does not draw them if the followers are not identified as battlers.
 */
Window_Hud.prototype.drawOtherMembersHuds = function() {
  // don't draw ally members if they don't exist.
  if ($gameParty._actors.length === 1) return;

  // if the followers aren't visible, then don't show their HUD sprites.
  if (!$gamePlayer.followers().isVisible()) return;

  $gameParty._actors.forEach((actorId, index) => {
    // don't draw the leader's data, they already are being drawn.
    if (index === 0) return;

    // draw the extra actor hud data.
    const follower = $gameActors.actor(actorId);
    const y = 70 + (index * 45);
    this.drawOtherMemberHud(follower, 35, y);
  });
};

/**
 * Draws all the HUD data for a non-leader member.
 * Non-leader data includes only the face, hp, and mp gauges.
 * @param {Game_Actor} follower The follower actor to draw hud data for.
 * @param {number} x The `x` coordinate to draw data at.
 * @param {number} y The `y` coordinate to draw data at.
 */
Window_Hud.prototype.drawOtherMemberHud = function(follower, x, y) {
  this.placeFaceSprite(follower.actorId(), follower.faceName(), follower.faceIndex(), false, x-35, y);
  this.placeGaugeSprite("hp", follower, x, y, 100, 24, 8);
  this.placeGaugeSprite("mp", follower, x, y+5, 100, 24, 6);
};

/**
 * Determines whether or not the player is in the way (or near it) of this window.
 * @returns {boolean} True if the player is in the way, false otherwise.
 */
Window_Hud.prototype.playerInterference = function() {
  const player = $gamePlayer;
  const playerX = player.screenX();
  const playerY = player.screenY();
  return playerX < this.width && playerY < this.height;
};

/**
 * Reduces opacity of all sprites when the player is in the way.
 */
Window_Hud.prototype.interferenceOpacity = function() {
  const sprites = this._hudSprites;
  const keys = Object.keys(sprites);
  keys.forEach(key => {
    const sprite = sprites[key];
    if (sprite.opacity > 64) sprite.opacity -= 15;
    if (sprite.opacity < 64) sprite.opacity += 1;
  });
};

/**
 * Reverts the opacity to normal when the player is no longer in the way.
 */
Window_Hud.prototype.refreshOpacity = function() {
  const sprites = this._hudSprites;
  const keys = Object.keys(sprites);
  keys.forEach(key => {
    const sprite = sprites[key];
    if (sprite.opacity < 255) sprite.opacity += 15;
    if (sprite.opacity > 255) sprite.opacity = 255;
  });
};

//#region states
/**
 * Draws all state-related data for the hud.
 */
Window_Hud.prototype.drawStates = function() {
  this.hideExpiredStates();
  if (!$gameParty.leader().states().length) return;

  const iconWidth = ImageManager.iconWidth + 8;

  if (J.ABS) {
    const player = $gameBattleMap.getPlayerMapBattler();
    const playerBattler = player.getBattler();
    const trackedStates = $gameBattleMap.getStateTrackerByBattler(playerBattler);
    const actorId = $gameParty.leader().actorId();
    trackedStates.forEach((trackedState, i) => {
      if (!trackedState.isExpired() && (trackedState.stateId !== playerBattler.deathStateId())) {
        this.drawState(trackedState, actorId, 128 + i*iconWidth, 100);
      }
    });
  }
};

/**
 * Hides the sprites associated with a given state id.
 */
Window_Hud.prototype.hideExpiredStates = function() {
  if (J.ABS) {
    const trackedStates = $gameBattleMap.getStateTrackerByBattler($gameParty.leader());
    trackedStates.forEach(state => {
      Object.keys(this._hudSprites).forEach(spriteKey => {
        const match = `state${state.stateId}`;
        if (spriteKey.contains(match) && state.isExpired()) {
          this._hudSprites[spriteKey].hide()
        }
      });
    });
  }
};

/**
 * Draws a single state icon and it's duration timer.
 * @param {JABS_TrackedState} state The state afflicted on the character to draw.
 * @param {number} actorId The actor id of the actor with the state.
 * @param {number} x The `x` coordinate to draw this state at.
 * @param {number} y The `y` coordinate to draw this state at.
 */
Window_Hud.prototype.drawState = function(state, actorId, x, y) {
  this.placeStateIconSprite(state.stateId, state.iconIndex, actorId, x, y);
  this.placeStateTimerSprite(state.stateId, state, actorId, x, y);
};

/**
 * Places the state icon at the designated location.
 * @param {number} stateId The id of the state.
 * @param {number} iconIndex The index of the icon associated with this state.
 * @param {number} actorId The actor id of the actor with the state.
 * @param {number} x The `x` coordinate to draw this state at.
 * @param {number} y The `y` coordinate to draw this state at.
 */
Window_Hud.prototype.placeStateIconSprite = function(stateId, iconIndex, actorId, x, y) {
  const key = `actor${actorId}-state${stateId}-icon`;
  const key2 = "actor%1-state-%2-icon".format(actorId, stateId);
  const sprite = this.createStateIconSprite(key, iconIndex);
  sprite.move(x, y);
  sprite.show();
};

/**
 * Places the timer sprite at a designated location.
 * @param {number} stateId The id of the state.
 * @param {object} stateData The data of the state.
 * @param {number} actorId The actor id of the actor with the state.
 * @param {number} x The `x` coordinate to draw this state at.
 * @param {number} y The `y` coordinate to draw this state at.
 */
Window_Hud.prototype.placeStateTimerSprite = function(stateId, stateData, actorId, x, y) {
  const key = `actor${actorId}-state${stateId}-timer`;
  const sprite = this.createStateTimerSprite(key, stateData);
  sprite.move(x, y);
  sprite.show();
};

/**
 * Generates the state icon sprite representing an afflicted state.
 * @param {string} key The key of this sprite.
 * @param {number} iconIndex The icon index of this sprite.
 */
Window_Hud.prototype.createStateIconSprite = function(key, iconIndex) {
  const sprites = this._hudSprites;
  if (sprites[key]) {
    return sprites[key];
  } else {
    const sprite = new Sprite_Icon(iconIndex);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
};

/**
 * Generates the state icon sprite representing an afflicted state.
 * @param {string} key The key of this sprite.
 * @param {number} stateData The state data associated with this state.
 */
Window_Hud.prototype.createStateTimerSprite = function(key, stateData) {
  const sprites = this._hudSprites;
  if (sprites[key]) {
    return sprites[key];
  } else {
    const sprite = new Sprite_StateTimer(stateData);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
};
//#endregion states

/**
 * Draws an actor's face.
 * @param {number} actorId The id of the actor.
 * @param {string} faceName The name of the facesheet.
 * @param {number} faceIndex The index of the face on the facesheet.
 * @param {boolean} isLeader Whether or not this is the leader.
 * @param {number} x The `x` coordinate to draw data at.
 * @param {number} y The `y` coordinate to draw data at.
 */
Window_Hud.prototype.placeFaceSprite = function(actorId, faceName, faceIndex, isLeader, x, y) {
  const key = `actor${actorId}-face-${faceName}-index${faceIndex}`;
  const sprite = this.createFaceSprite(key, faceName, faceIndex, isLeader);
  sprite.move(x, y);
  sprite.show();
};

/**
 * Creates the face sprite, or pulls it from cache if it was already created.
 * @param {string} key The name of this face sprite.
 * @param {string} faceName The name of the facesheet.
 * @param {number} faceIndex The index of the face on the facesheet.
 * @param {boolean} isLeader Whether or not this is the leader.
 * @returns {Sprite_Face}
 */
Window_Hud.prototype.createFaceSprite = function(key, faceName, faceIndex, isLeader) {
  const sprites = this._hudSprites;
  if (sprites[key]) {
    return sprites[key];
  } else {
    const sprite = new Sprite_Face(faceName, faceIndex);
    const scale = isLeader ? 0.8 : 0.3;
    sprite.scale.x = scale;
    sprite.scale.y = scale;
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
};

/**
 * Places an actor value at a designated location with the given parameters.
 * @param {string} type One of: "hp"/"mp"/"tp".
 * @param {Game_Actor} actor The actor that this number sprite belongs to.
 * @param {number} x The origin `x` coordinate.
 * @param {number} y The origin `y` coordinate.
 * @param {number} fontSizeMod The variance of font size for this value.
 */
Window_Hud.prototype.placeNumberSprite = function(type, actor, x, y, fontSizeMod) {
  const key = `actor${actor.actorId()}-number-${type}`;
  const sprite = this.createNumberSprite(key, type, actor, fontSizeMod);
  sprite.move(x, y);
  sprite.show();
};

/**
 * Generates the number sprite that keeps in sync with an actor's value.
 * @param {string} key The name of this number sprite.
 * @param {string} type One of: "hp"/"mp"/"tp".
 * @param {Game_Actor} actor The actor that this number sprite belongs to.
 * @param {number} fontSizeMod The variance of font size for this value.
 */
Window_Hud.prototype.createNumberSprite = function(key, type, actor, fontSizeMod) {
  const sprites = this._hudSprites;
  if (sprites[key]) {
    return sprites[key];
  } else {
    const sprite = new Sprite_ActorValue(actor, type, fontSizeMod);
    sprites[key] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
};

/**
 * Places a gauge at a designated location with the given parameters.
 * @param {string} type One of: "hp"/"mp"/"tp". Determines color and value.
 * @param {Game_Actor} actor The actor that this gauge belongs to.
 * @param {number} x The origin `x` coordinate.
 * @param {number} y The origin `y` coordinate.
 * @param {number} bw The width of the bitmap for the gauge- also the width of the gauge.
 * @param {number} bh The height of the bitmap for the gauge.
 * @param {number} gh The height of the gauge itself.
 */
Window_Hud.prototype.placeGaugeSprite = function(type, actor, x, y, bw, bh, gh) {
  const key = `actor${actor.actorId()}-gauge-${type}`;
  const sprite = this.createGaugeSprite(key, bw, bh, gh);
  sprite.setup(actor, type);
  sprite.move(x, y);
  sprite.show();
};

/**
 * Creates and handles the sprite for this gauge.
 * @param {string} key The name of this gauge graphic.
 * @param {number} bw The width of the bitmap for this graphic.
 * @param {number} bh The height of the bitmap for this graphic.
 * @param {number} gh The height of the gauge of this graphic.
 */
Window_Hud.prototype.createGaugeSprite = function(key, bw, bh, gh) {
  const sprites = this._hudSprites;
  if (sprites[key]) {
      return sprites[key];
  } else {
      const sprite = new Sprite_MapGauge(bw, bh, gh);
      sprite.scale.x = 1.0; // change to match the window size?
      sprite.scale.y = 1.0;
      sprites[key] = sprite;
      this.addInnerChild(sprite);
      return sprite;
  }
};

//#endregion
//#endregion Window objects

//#region Sprite objects
//#region Sprite_StateTimer
/**
 * A sprite that displays some static text.
 */
function Sprite_StateTimer() { this.initialize(...arguments); }
Sprite_StateTimer.prototype = Object.create(Sprite.prototype);
Sprite_StateTimer.prototype.constructor = Sprite_StateTimer;
Sprite_StateTimer.prototype.initialize = function(stateData) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(stateData);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {object} stateData The state data associated with this sprite.
 */
Sprite_StateTimer.prototype.initMembers = function(stateData) {
  this._j = {};
  this._j._stateData = stateData;
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_StateTimer.prototype.loadBitmap = function() {
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.drawText(
    this._j._text, 
    0, 0, 
    this.bitmapWidth(), this.bitmapHeight(), 
    "center");
  }

  Sprite_StateTimer.prototype.update = function() {
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
};

Sprite_StateTimer.prototype.updateCooldownText = function() {
  this.bitmap.clear();
  const durationRemaining = (this._j._stateData.duration / 60).toFixed(1);

  this.bitmap.drawText(
    durationRemaining.toString(), 
    0, 0, 
    this.bitmapWidth(), this.bitmapHeight(), 
    "center");
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapWidth = function() {
  return 40;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapHeight = function() {
  return this.fontSize() * 3;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_StateTimer.prototype.fontSize = function() {
  return $gameSystem.mainFontSize() - 10;
};

/**
 * determines the font face for text in this sprite.
 */
Sprite_StateTimer.prototype.fontFace = function() {
  return $gameSystem.numberFontFace();
};
//#endregion

//#region Sprite_ActorValue
/**
 * A sprite that monitors one of the primary fluctuating values (hp/mp/tp).
 */
function Sprite_ActorValue() { this.initialize(...arguments); }
Sprite_ActorValue.prototype = Object.create(Sprite.prototype);
Sprite_ActorValue.prototype.constructor = Sprite_ActorValue;
Sprite_ActorValue.prototype.initialize = function(actor, parameter, fontSizeMod = 0) {
  this._j = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(actor, parameter, fontSizeMod);
  this.bitmap = this.createBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {object} actor The actor to track the value of.
 * @param {string} parameter The parameter to track of "hp"/"mp"/"tp"/"xp".
 * @param {number} fontSizeMod The modification of the font size for this value.
 */
Sprite_ActorValue.prototype.initMembers = function(actor, parameter, fontSizeMod) {
  this._j._parameter = parameter;
  this._j._actor = actor;
  this._j._fontSizeMod = fontSizeMod;
  this._j._last = {};
  this._j._last._hp = actor.hp;
  this._j._last._mp = actor.mp;
  this._j._last._tp = actor.tp;
  this._j._last._xp = actor.currentExp();
  this._j._last._lvl = actor.level;
  this._j._autoCounter = 60;
};

/**
 * Updates the bitmap if it needs updating.
 */
Sprite_ActorValue.prototype.update = function() {
  Sprite.prototype.update.call(this);
  if (this.hasParameterChanged()) {
    this.refresh();
  }

  this.autoRefresh();
};

/**
 * Automatically refreshes the value being represented by this sprite
 * after a fixed amount of time.
 */
Sprite_ActorValue.prototype.autoRefresh = function() {
  if (this._j._autoCounter <= 0) {
    this.refresh();
    this._j._autoCounter = 60;
  }

  this._j._autoCounter--;
};

/**
 * Refreshes the value being represented by this sprite.
 */
Sprite_ActorValue.prototype.refresh = function() {
  this.bitmap = this.createBitmap();
};

/**
 * Checks whether or not a given parameter has changed.
 */
Sprite_ActorValue.prototype.hasParameterChanged = function() {
  let changed = true;
  switch (this._j._parameter) {
    case "hp": 
      changed = this._j._actor.hp != this._j._last._hp;
      if (changed) this._j._last._hp = this._j._actor.hp;
      return changed;
    case "mp": 
      changed = this._j._actor.mp != this._j._last._mp;
      if (changed) this._j._last._mp = this._j._actor.mp;
      return changed;
    case "tp": 
      changed = this._j._actor.tp != this._j._last._tp;
      if (changed) this._j._last.tp = this._j._actor.tp;
      return changed;
    case "xp": 
      changed = this._j._actor.currentExp() != this._j._last._xp;
      if (changed) this._j._last._xp = this._j._actor.currentExp();
      return changed;
    case "lvl":
      changed = this._j._actor.level != this._j._last._lvl;
      if (changed) this._j._last._lvl = this._j._actor.level;
      return changed;
  }
};

/**
 * Creates a bitmap to attach to this sprite that shows the value.
 */
Sprite_ActorValue.prototype.createBitmap = function() {
  let value = 0;
  const width = this.bitmapWidth();
  const height = this.fontSize() + 4;
  const bitmap = new Bitmap(width, height);
  bitmap.fontFace = this.fontFace();
  bitmap.fontSize = this.fontSize();
  switch (this._j._parameter) {
    case "hp": 
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(128, 24, 24, 1.0)";
      value = Math.floor(this._j._actor.hp);
      break;
    case "mp": 
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(24, 24, 192, 1.0)";
      value = Math.floor(this._j._actor.mp);
      break;
    case "tp": 
      bitmap.outlineWidth = 2;
      bitmap.outlineColor = "rgba(64, 128, 64, 1.0)";
      value = Math.floor(this._j._actor.tp);
      break;
    case "xp":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      const curExp = (this._j._actor.nextLevelExp() - this._j._actor.currentLevelExp());
      const nextLv = (this._j._actor.currentExp() - this._j._actor.currentLevelExp());
      value = curExp - nextLv;
      break;
    case "lvl":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      value = this._j._actor.level.padZero(3);
      break;
  }
  
  bitmap.drawText(value, 0, 0, bitmap.width, bitmap.height, "left");
  return bitmap;
};

/**
 * Defaults the bitmap width to be a fixed 200 pixels.
 */
Sprite_ActorValue.prototype.bitmapWidth = function() {
  return 200;
};

/**
 * Defaults the font size to be an adjusted amount from the base font size.
 */
Sprite_ActorValue.prototype.fontSize = function() {
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Defaults the font face to be the number font.
 */
Sprite_ActorValue.prototype.fontFace = function() {
  return $gameSystem.numberFontFace();
};
//#endregion
//#endregion Sprite objects