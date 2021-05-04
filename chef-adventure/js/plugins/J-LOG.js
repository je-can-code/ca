 /*:
 * @target MZ
 * @plugindesc 
 * [v1.0 LOG] A non-battle-reliant text log (designed for JABS, though).
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @orderAfter J-ABS
 * @orderBefore J-SDP
 * @help
 * ============================================================================
 * This plugin creates a window on the screen that will act as a log of sorts.
 * It was initially designed as a battle log for JABS, but it can do things 
 * without the help of JABS if you really want it to.
 * 
 * If not using this with JABS, then you'll need to leverage the plugin
 * commands to add logs manually where applicable.
 * 
 * Icons were initially a part of the design, but that was never implemented
 * due to lack of popularity of the plugin and never really needing it myself.
 * If this starts to pick up traction and people like it, I'll refactor it to
 * be more feature-complete.
 * ============================================================================
 * @param Enabled
 * @type boolean
 * @text Enable Log?
 * @desc True if you want the log to be enabled, false otherwise.
 * @default true
 * 
 * 
 * @command Enable Text Log
 * @text Enable the Text Log
 * @desc Enables the text log and displays it on the screen.
 * 
 * @command Disable Text Log
 * @text Disable the Text Log
 * @desc Disables the text log and renders it invisible.
 * 
 * @command Add Text Log
 * @text Add a text log
 * @desc Create a new entry and add it to the text log window. 
 * @arg Text
 * @type string
 * @default One potion was found!
 * @arg Icon
 * @type number
 * @default 1
 */

//#region plugin setup and configuration
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
J.LOG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LOG.Metadata = {};
J.LOG.Metadata.Name = `J-LOG`;
J.LOG.Metadata.Version = 1.00;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LOG.PluginParameters = PluginManager.parameters(J.LOG.Metadata.Name);
J.LOG.Metadata.Active = Boolean(J.LOG.PluginParameters['Enabled']);
J.LOG.Metadata.Enabled = true;

/**
 * A collection of all aliased methods for this plugin.
 */
J.LOG.Aliased = {};
J.LOG.Aliased.DataManager = {};
J.LOG.Aliased.Scene_Map = {};

/**
 * Plugin command for enabling the text log and showing it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Enable Text Log", () => {
  J.LOG.Metadata.Active = true;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Disable Text Log", () => {
  J.LOG.Metadata.Active = false;
});

/**
 * Plugin command for disabling the text log and hiding it.
 */
PluginManager.registerCommand(J.LOG.Metadata.Name, "Add Text Log", args => {
  const { Text, Icon } = args;
  const log = new Map_TextLog(Text, Icon);
  $gameTextLog.addLog(log);
});
//#endregion

//#region DataManager
/**
 * Hooks into `DataManager` to create the game objects.
 */
J.LOG.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  J.LOG.Aliased.DataManager.createGameObjects.call(this);
  $gameTextLog = new Game_TextLog();
};
//#endregion DataManager

//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.LOG.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.LOG.Aliased.Scene_Map.initialize.call(this);
  if (!this._j) {
    this._j = this._j || {};
  }

  this._j._mapTextLog = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.LOG.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
  J.LOG.Aliased.Scene_Map.onMapLoaded.call(this);
  this.createJabsTextLog();
};

/**
 * Creates the internal text log for JABS.
 */
Scene_Map.prototype.createJabsTextLog = function() {
  const width = 768;
  const height = 200;
  const x = 0;
  const y = Graphics.boxHeight - height;
  const rect = new Rectangle(x, y, width, height);
  this._j._mapTextLog = this._j._mapTextLog || new Window_TextLog(rect);
  this.addWindow(this._j._mapTextLog);
};

/**
 * Toggles the visibility and functionality of the externally managed text log.
 * @param {boolean} toggle Whether or not to display the external text log.
 */
Scene_Map.prototype.toggleLog = function(toggle = true) {
  if (J.LOG.Metadata.Enabled) {
    this._j._mapTextLog.toggle(toggle);
  }
};
//#endregion Scene_Map

//#region Game_TextLog
/**
 * The manager that handles all logs in the `Window_TextLog`.
 */
function Game_TextLog() { this.initialize(...arguments); };
Game_TextLog.prototype = {};
Game_TextLog.prototype.constructor = Game_TextLog;

/**
 * Initializes this class.
 */
Game_TextLog.prototype.initialize = function() {
  /**
   * The logs currently being managed.
   * @type {Map_TextLog[]}
   */
  this._logs = null;
  this.initMembers();
};

/**
 * Initializes all properties for this class.
 */
Game_TextLog.prototype.initMembers = function() {
  this._logs = [];
};

/**
 * Gets all currently pending logs.
 * @returns {Map_TextLog[]} All logs currently in queue.
 */
Game_TextLog.prototype.getLogs = function() {
  return this._logs;
};

/**
 * Adds a new text log to the window.
 * @param {Map_TextLog} log The log to add to the window.
 */
Game_TextLog.prototype.addLog = function(log) {
  this._logs.push(log);
};

/**
 * Removes the first log and returns it.
 * @returns {Map_TextLog} The first text log in the collection.
 */
Game_TextLog.prototype.shiftLog = function() {
  return this._logs.shift();
};

/**
 * Removes the last log and returns it.
 * @returns {Map_TextLog} The last text log in the collection.
 */
Game_TextLog.prototype.popLog = function() {
  return this._logs.pop();
};

/**
 * Empties the currently pending logs.
 */
Game_TextLog.prototype.clearLogs = function() {
  this._logs.splice(0, this._logs.length);
};
//#endregion

//#region Window_TextLog
/**
 * A window that displays the rolling text log of various activities.
 */
function Window_TextLog() { this.initialize(...arguments); }
Window_TextLog.prototype = Object.create(Window_Base.prototype);
Window_TextLog.prototype.constructor = Window_TextLog;

/**
 * Initializes the entire text log.
 * @param {Rectangle} rect The rectangle object that defines the shape of this window.
 */
Window_TextLog.prototype.initialize = function(rect) {
  Window_Base.prototype.initialize.call(this, rect);
  this.openness = 255;
  this.opacity = 0;
  this.initMembers();
};

/**
 * Initializes all the various properties of this text log.
 */
Window_TextLog.prototype.initMembers = function() {
  /**
   * The height of a single line. Determines spacing of the log entries.
   */
  this._lineHeight = 20;

  /**
   * How long before the activity is considered "inactive".
   */
  this._inactiveCountdown = 120;

  /**
   * Whether or not this window is inactive.
   */
  this._inactive = false;

  /**
   * The number of frames until it starts tracking the "faded".
   */
  this._fadingCountdown = 60;

  /**
   * Whether or not this window is considered "faded".
   */
  this._faded = false;

  /**
   * The `y` coordinate of the first row (bottom-most).
   */
  this._rowOne = this.height - 50;

  /**
   * Whether or not a given log entry is sliding out of visibility.
   */
  this._slidingDown = false;

  /**
   * The duration of sliding.
   */
  this._sliding = 0;

  /**
   * The sprites which represent the visual of the logs.
   */
  this._messageSprites = this._messageSprites || {};

  /**
   * The tracker which manages messages in this log.
   */
  this._messageTracker = this._messageTracker || [];

  /**
   * The minimum opacity possible for sprites and the window.
   */
  this._opacityMinimum = 0;

  /**
   * The rate at which opacity increases/decreases.
   */
  this._opacityRate = 15;

  /**
   * Whether or not the log should be visible.
   */
  this._enabled = true;
};

/**
 * Handles the logical updating for this text log.
 */
Window_TextLog.prototype.update = function() {
  Window_Base.prototype.update.call(this);
  if (this.canUpdate()) {
    this.drawLogs();
  } else {
    this.refresh();
  }
};

/**
 * Toggles whether or not this hud is enabled.
 * @param {boolean} toggle Toggles the hud to be visible and operational.
 */
Window_TextLog.prototype.toggle = function(toggle = !this._enabled) {
  this._enabled = toggle;
  if (!this._enabled) {
    this.opacity = 0;
  }
};

/**
 * Whether or not this text log should be updated.
 * @returns {boolean} True if the log can be updated, false otherwise.
 */
Window_TextLog.prototype.canUpdate = function() {
  if (!this.contents || (!this._enabled || 
    !J.LOG.Metadata.Active || $gameMessage.isBusy())) {
      return false;
  }

  return true;
};

/**
 * Refreshes the window and forces a recreation of all sprites.
 */
Window_TextLog.prototype.refresh = function() {
  this.contents.clear();
  const keys = Object.keys(this._messageSprites);
  keys.forEach(key => {
    this._messageSprites[key].destroy();
    delete this._messageSprites[key];
  })

  this._messageSprites = {};
  this._messageTracker = [];
};

/**
 * Draws all the logs and manages them. If the player is in the way, then
 * pause management and greatly reduce opacity for the text log.
 */
Window_TextLog.prototype.drawLogs = function() {
  if (this.playerInterference()) {
    this.interferenceOpacity();
  }
  
  this.writeAllEntries();
  this.handleIncomingLogs();
  this.handleOutgoingLogs();
  this.fadeWhileInactive();  
};

/**
 * Determines whether or not the player is in the way (or near it) of this window.
 * @returns {boolean} True if the player is in the way, false otherwise.
 */
Window_TextLog.prototype.playerInterference = function() {
  const player = $gamePlayer;
  const playerX = player.screenX();
  const playerY = player.screenY();
  if (playerX < (this.width + 50) && playerY > (this.y - 50)) {
    return true;
  }

  return false;
};

/**
 * Reduces opacity of all sprites when the player is in the way.
 */
Window_TextLog.prototype.interferenceOpacity = function() {
  const sprites = this._messageSprites;
  const keys = Object.keys(sprites);
  keys.forEach(key => {
    const sprite = sprites[key];
    if (sprite.opacity > 0) sprite.opacity -= 15;
    if (sprite.opacity < 0) sprite.opacity += 1;
  });

  //if (this.opacity > 0) this.opacity -= 15;
  //if (this.opacity < 0) this.opacity += 1;
};

/**
 * Draws all the entries in the log.
 */
Window_TextLog.prototype.writeAllEntries = function() {
  this.contents.clear();
  if (this._messageTracker.length == 0 || this.isFaded()) return;

  this._messageTracker.forEach((messageSprite, index) => {
    messageSprite.y = this._rowOne - (this._lineHeight * index);
    messageSprite.show();
  })
};

/**
 * Extracts the logs and creates sprites representing their data.
 */
Window_TextLog.prototype.handleIncomingLogs = function() {
  if ($gameTextLog.getLogs().length > 0) {

    // get the log from the global log manager.
    const nextLog = $gameTextLog.shiftLog();

    // create the sprite based on the data and hide it for now.
    const sprite = this.createMessageSprite(nextLog);
    sprite.hide();

    // add the latest log to the beginning.
    this._messageTracker.unshift(sprite);

    // the log isn't inactive if we're adding to it!
    this._inactive = false;
    this._inactiveCountdown = 300;
    this._faded = false;
    this._fadingCountdown = 60;
  }
};

/**
 * After a fixed amount of inactivity, begin destroying logs in order.
 */
Window_TextLog.prototype.handleOutgoingLogs = function() {
  if (this.isInactive() && this._messageTracker.length > 0) {
    //this.removeOldestLog();
  }
};

/**
 * Controls the opacity of this window. While it is inactive, reduce opacity.
 * Once activity resumes, quickly increase opacity back to max(255).
 */
Window_TextLog.prototype.fadeWhileInactive = function() {
  if (this.isInactive()) {
    this.fadeOpacity();
  } else {
    this.resetOpacity();
  }
};

/**
 * While the log window is inactive, reduce opacity of the window and text.
 */
Window_TextLog.prototype.fadeOpacity = function() {
  //if (this.opacity > this._opacityMinimum) this.opacity -= this._opacityRate;
  //if (this.opacity < this._opacityMinimum) this.opacity = this._opacityMinimum;

  if (this.isFaded()) {
    Object.values(this._messageSprites).forEach(sprite => {
      if (sprite.opacity > this._opacityMinimum) {
        sprite.opacity -= this._opacityRate;
      } else if (sprite.opacity < this._opacityMinimum) {
        sprite.opacity = this._opacityMinimum;
      }
    });
  }
};

/**
 * When activity in the text log resumes, quickly increase opacity back to max(255).
 */
Window_TextLog.prototype.resetOpacity = function() {
  //if (this.opacity < 255) this.opacity += this._opacityRate;
  //if (this.opacity > 255) this.opacity = 255;
  if (this.isFaded()) {
    Object.values(this._messageSprites).forEach(sprite => {
      if (sprite.opacity < 255) sprite.opacity += this._opacityRate;
      else if (sprite.opacity > 255) sprite.opacity = 255;
    });
  }
};

/**
 * Slides the bottom-most log off the screen and destroys it.
 */
Window_TextLog.prototype.removeOldestLog = function() {
  if (this.isFaded()) {
    const removedSprite = this._messageTracker[0];
    if (removedSprite != null) {
      // slide all logs down one row.
      if (this._sliding < this._lineHeight) {
        this._messageTracker.forEach(messageSprite => messageSprite.y += 2)
        this._sliding += 2;
        return;
      } else {
        // completely dispose of this sprite now that its off-screen.
        this._messageSprites[removedSprite.getUuid()].destroy();
        delete this._messageSprites[removedSprite.getUuid()];
        this._messageTracker.shift();

        // reset the sliding and fading.
        this._sliding = 0;
        this._faded = false;
        this._fadingCountdown = 15;
      }
    }
  }
};

/**
 * Creates a sprite for a given text log.
 * @param {Map_TextLog} textLog A log entry to create a sprite for.
 */
Window_TextLog.prototype.createMessageSprite = function(textLog) {
  const sprites = this._messageSprites;
  if (sprites[textLog.getUuid()]) {
    return sprites[textLog.getUuid()];
  } else {
    const sprite = new Sprite_TextLog(textLog);
    sprites[textLog.getUuid()] = sprite;
    this.addInnerChild(sprite);
    return sprite;
  }
};

/**
 * Counts down the inactivity clock until 0. Inactivity will cause
 * logs to start to fade away.
 */
Window_TextLog.prototype.isInactive = function() {
  if (this._inactive) {
    return true;
  }

  if (this._inactiveCountdown > 0) {
    this._inactiveCountdown--;
    return false;
  }

  this._inactive = true;
  this._inactiveCountdown = 0;
  return true;
};

/**
 * Counts down the inactivity clock until 0. Inactivity will cause
 * logs to start to fade away.
 */
Window_TextLog.prototype.isFaded = function() {
  if (this._faded) {
    return true;
  }

  if (this._fadingCountdown > 0) {
    this._fadingCountdown--;
    return false;
  }

  this._faded = true;
  this._fadingCountdown = 0;
  return true;
};
//#endregion

//#region Sprite_TextLog
/**
 * The sprite used for writing into the text log.
 */
function Sprite_TextLog() { this.initialize(...arguments); }
Sprite_TextLog.prototype = Object.create(Sprite.prototype);
Sprite_TextLog.prototype.constructor = Sprite_TextLog;

/**
 * Initializes the sprite for this entry in the text log.
 * @param {Map_TextLog} textLog The text log object to base this sprite upon.
 */
Sprite_TextLog.prototype.initialize = function(textLog) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(textLog);
  this.bitmap = this.createBitmap();
};

/**
 * Assigns all properties for this entry in the text log.
 * @param {Map_TextLog} textLog The text log object to base this sprite upon.
 */
Sprite_TextLog.prototype.initMembers = function(textLog) {
  this._j = {};
  this._j._uuid = textLog.getUuid();
  this._j._text = textLog.getText();
  this._j._baseIconIndex = textLog.getIconIndex();
};

/**
 * Creates the bitmap that is the canvas for this sprite.
 */
Sprite_TextLog.prototype.createBitmap = function() {
  const text = this._j._text;
  const width = (this.fontSize() * text.length) + 32;
  const height = 32;
  const bitmap = new Bitmap(width, height);
  bitmap.fontFace = this.fontFace();
  bitmap.fontSize = this.fontSize();
  bitmap.outlineWidth = 3;
  bitmap.outlineColor = "rgba(0, 0, 0, 1.0)";
  bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, "left");
  return bitmap;
};

/**
 * The font size for text written into this sprite.
 * This overwrites the base sprite class to shrink the font size a bit.
 * @returns {number} The modified smaller font size.
 */
Sprite_TextLog.prototype.fontSize = function() {
  return $gameSystem.mainFontSize() - 8;
};

/**
 * The font size for text written into this sprite.
 * This overwrites the base sprite class to use a monospace font instead.
 */
Sprite_TextLog.prototype.fontFace = function() {
  return $gameSystem.numberFontFace();
};

/**
 * Retrieves the Uuid associated with this sprite.
 */
Sprite_TextLog.prototype.getUuid = function() { 
  return this._j._uuid;
};
//#endregion

//#region Map_TextLog
/**
 * The shape of a single line in the text log window.
 */
function Map_TextLog() { this.initialize(...arguments); };
Map_TextLog.prototype = {};
Map_TextLog.prototype.constructor = Map_TextLog;

/**
 * Initializes this class.
 */
Map_TextLog.prototype.initialize = function(text, iconIndex) {
  /**
   * The message for this text log.
   */
  this._text = null;

  /**
   * The base icon index for this text log.
   */
  this._iconIndex = null;

  /**
   * The unique identifier for this text log.
   */
  this._uuid = null;
  this.initMembers(text, iconIndex);
}

/**
 * Initializes all properties for this class.
 */
Map_TextLog.prototype.initMembers = function(text, iconIndex) {
  this._text = text;
  this._iconIndex = iconIndex;
  this._uuid = J.BASE.Helpers.generateUuid();
};

/**
 * Gets this text log's unique identifier.
 * @returns {string}
 */
Map_TextLog.prototype.getUuid = function() {
  return this._uuid;
};

/**
 * Gets this text log's message.
 * @returns {string}
 */
Map_TextLog.prototype.getText = function() {
  return this._text;
};

/**
 * Gets this text log's base icon index.
 * @returns {number}
 */
Map_TextLog.prototype.getIconIndex = function() {
  return this._iconIndex;
};
//#endregion