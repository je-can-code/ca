//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0.0 TIME] A system for tracking time- real or artificial.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ==============================================================================
 * This is a system that tracks time, either artificial or real, and manipulates
 * various components of the game based on the time.
 * 
 * 	Temporally Integrated Monitoring of Ecosystems- aka TIME.
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    J-TIME's initial release.
 * ==============================================================================
 * 
 * @param BASEconfigs
 * @text BASE SETUP
 * 
 * @param startEnabled
 * @parent BASEconfigs
 * @type boolean
 * @text Start Enabled
 * @desc Begins the game with the time window visible.
 * @on Start Enabled
 * @off Start Disabled
 * @default true
 * 
 * @param useRealTime
 * @parent BASEconfigs
 * @type boolean
 * @text Use Real Time
 * @desc Instead of using artificial time, use real life time.
 * Using real time negates most configs below.
 * @on Real Time
 * @off Artificial Time
 * @default false
 * 
 * @param changeToneByTime
 * @parent BASEconfigs
 * @type boolean
 * @text Change Tone by Time
 * @desc Allows the TIME system to manage the tone of the screen based on the hour.
 * @on Allow
 * @off Disallow
 * @default true
 * 
 * @param ARTIFICIALconfigs
 * @text ARTIFICAL CONFIGS
 * 
 * @param framesPerTick
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Rate of Time
 * @desc The number of frames that must pass for time to tick.
 * (~60 frames per real second)
 * @default 60
 * 
 * @param startingSecond
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Second
 * @desc The precise second that time begins on for a new game.
 * Also affects direct time manipulation for seconds.
 * @default 0
 * 
 * @param startingMinute
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Minute
 * @desc The number of minutes that are incremented per tock.
 * Also affects direct time manipulation for minutes.
 * @default 0
 * 
 * @param startingHour
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Hour
 * @desc The number of hours that are incremented per tock.
 * Also affects direct time manipulation for hours.
 * @default 9
 * 
 * @param startingDay
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Starting Day
 * @desc The number of days that are incremented per tock.
 * Also affects direct time manipulation for days.
 * @default 29
 * 
 * @param startingMonth
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Starting Month
 * @desc The number of months that are incremented per tock.
 * Also affects direct time manipulation for months.
 * @default 5
 * 
 * @param startingYear
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Year
 * @desc The number of years that are incremented per tock.
 * Also affects direct time manipulation for years.
 * @default 2021
 * 
 * @param secondsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Seconds per Tick
 * @desc The number of seconds that are incremented per tick.
 * Also affects direct time manipulation for seconds.
 * @default 10
 * 
 * @param minutesPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Minutes per Tock
 * @desc The number of minutes that are incremented per tock.
 * Also affects direct time manipulation for minutes.
 * @default 1
 * 
 * @param hoursPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Hours per Tock
 * @desc The number of hours that are incremented per tock.
 * Also affects direct time manipulation for hours.
 * @default 1
 * 
 * @param daysPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Days per Tock
 * @desc The number of days that are incremented per tock.
 * Also affects direct time manipulation for days.
 * @default 1
 * 
 * @param monthsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Months per Tock
 * @desc The number of months that are incremented per tock.
 * Also affects direct time manipulation for months.
 * @default 1
 * 
 * @param yearsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Years per Tock
 * @desc The number of years that are incremented per tock.
 * Also affects direct time manipulation for years.
 * @default 1
 * 
 * 
 * 
 * 
 * @command showMapTime
 * @text Show TIME on Map
 * @desc Shows the TIME window on the map.
 * 
 * @command hideMapTime
 * @text Hide TIME on Map
 * @desc Hides the TIME window on the map.
 * 
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
J.TIME = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.TIME.Metadata = {};
J.TIME.Metadata.Version = '1.0.0';
J.TIME.Metadata.Name = `J-TIME`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.TIME.PluginParameters = PluginManager.parameters(J.TIME.Metadata.Name);
J.TIME.Metadata.StartEnabled = J.TIME.PluginParameters['startEnabled'] === "true";
J.TIME.Metadata.UseRealTime = J.TIME.PluginParameters['useRealTime'] === "true";
J.TIME.Metadata.ChangeToneByTime = J.TIME.PluginParameters['changeToneByTime'] === "true";
J.TIME.Metadata.FramesPerTick = Number(J.TIME.PluginParameters['framesPerTick']);

J.TIME.Metadata.StartingSecond = Number(J.TIME.PluginParameters['startingSecond']);
J.TIME.Metadata.StartingMinute = Number(J.TIME.PluginParameters['startingMinute']);
J.TIME.Metadata.StartingHour = Number(J.TIME.PluginParameters['startingHour']);
J.TIME.Metadata.StartingDay = Number(J.TIME.PluginParameters['startingDay']);
J.TIME.Metadata.StartingMonth = Number(J.TIME.PluginParameters['startingMonth']);
J.TIME.Metadata.StartingYear = Number(J.TIME.PluginParameters['startingYear']);

J.TIME.Metadata.SecondsPerIncrement = Number(J.TIME.PluginParameters['secondsPerIncrement']);
J.TIME.Metadata.MinutesPerIncrement = Number(J.TIME.PluginParameters['minutesPerIncrement']);
J.TIME.Metadata.HoursPerIncrement = Number(J.TIME.PluginParameters['hoursPerIncrement']);
J.TIME.Metadata.DaysPerIncrement = Number(J.TIME.PluginParameters['daysPerIncrement']);
J.TIME.Metadata.MonthsPerIncrement = Number(J.TIME.PluginParameters['monthsPerIncrement']);
J.TIME.Metadata.YearsPerIncrement = Number(J.TIME.PluginParameters['yearsPerIncrement']);

/**
 * A collection of all aliased methods for this plugin.
 */
J.TIME.Aliased = {
  DataManager: {},
  Scene_Base: {},
  Scene_Map: {},
};

/**
 * Plugin command for hiding the TIME window on the map.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "hideMapTime", () => {
  $gameTime.hideMapWindow();
});

/**
 * Plugin command for showing the TIME window on the map.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "showMapTime", () => {
  $gameTime.showMapWindow();
});

/**
 * A global object for storing data related to TIME.
 * @global
 * @type {Game_Time}
 */
var $gameTime = null;
//#endregion Introduction

//#region Static objects
//#region DataManager
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.TIME.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  J.TIME.Aliased.DataManager.createGameObjects.call(this);
  $gameTime = new Game_Time();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.TIME.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
  const contents = J.TIME.Aliased.DataManager.makeSaveContents.call(this);
  contents.time = $gameTime;
  return contents;
};
 
/**
 * Extends the save content extraction to include extracting JAFTING data.
 * 
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 */
J.TIME.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
  J.TIME.Aliased.DataManager.extractSaveContents2.call(this, contents);
  $gameTime = contents.time;
};
//#endregion DataManager
//#endregion Static objects

//#region Scene objects
//#region Scene_Base
/**
 * Extend the highest level `Scene_Base.update()` to also update time when applicable.
 */
J.TIME.Aliased.Scene_Base.update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
  J.TIME.Aliased.Scene_Base.update.call(this);
  if (this.shouldUpdateTime()) {
    $gameTime.update();
  }
};

/**
 * Determines whether or not we should update artificial time while within the
 * current scene.
 * @returns {boolean}
 */
Scene_Base.prototype.shouldUpdateTime = function() {
  const noTimeScenes = [Scene_Boot, Scene_File, Scene_Save, Scene_Load, Scene_Title, Scene_Gameover];
  return !noTimeScenes.some(scene => SceneManager._scene instanceof scene);
};
//#endregion Scene_Base

//#region Scene_Map
/**
 * Extends `Scene_Map.initialize()` to also initialize the TIME window.
 */
J.TIME.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
  J.TIME.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initTimeWindow();
};

/**
 * Initializes the property containing the TIME window.
 */
Scene_Map.prototype.initTimeWindow = function() {
  /**
   * The window that displays the current time, real or artificial.
   */
  this._j._timeWindow = null;
};

/**
 * Extends `Scene_Map.createAllWindows()` to also create the TIME window.
 */
J.TIME.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
  J.TIME.Aliased.Scene_Map.createAllWindows.call(this);
  this.createTimeWindow();
};

/**
 * Creates the TIME window.
 */
Scene_Map.prototype.createTimeWindow = function() {
  const w = 200;
  const h = 180;
  const x = Graphics.boxWidth - w;
  const y = 0;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_Time(rect);
  this._j._timeWindow = wind;
  this.addWindow(this._j._timeWindow);
};

/**
 * Extends the `Scene_Map.update()` to also update the TIME window.
 */
J.TIME.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  J.TIME.Aliased.Scene_Map.update.call(this);

  if (this._j._timeWindow) {
    this._j._timeWindow.update();
    this.manageTimeVisibility();
  }
};

/**
 * Manages the visibility of the TIME window.
 */
Scene_Map.prototype.manageTimeVisibility = function() {
  if ($gameTime.isMapWindowVisible()) {
    this._j._timeWindow.show();
    this._j._timeWindow.open();
  } else {
    this._j._timeWindow.close();
    this._j._timeWindow.hide();
  }
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Game objects
//#region Game_Time
/**
 * A class for controlling time.
 */
function Game_Time() { this.initialize(...arguments) };
Game_Time.prototype = {};
Game_Time.prototype.constructor = Game_Time;

//#region statics
/**
 * A static representation of the tones for each time of day.
 */
Game_Time.toneOfDay = {
  Night: [-100, -100, -30, 100],
  Dawn: [-30, -15, 15, 64],
  Morning: [0, 0, 0, 0],
  Afternoon: [10, 10, 10, 10],
  Evening: [0, -30, -30, -30],
  Twilight: [-68, -68, 0, 68],
};
//#endregion statics

/**
 * Initializes the members of this class.
 */
Game_Time.prototype.initialize = function() {
  /**
   * The number of frames that must pass before we execute a tick.
   * @type {number}
   */
  this._tickFrames = this._tickFrames ?? J.TIME.Metadata.FramesPerTick;

  /**
   * The number of seconds per tick.
   * @type {number}
   */
  this._secondsPerTick = this._secondsPerTick ?? J.TIME.Metadata.SecondsPerIncrement;

  /**
   * The number of minutes per tick.
   * @type {number}
   */
  this._minutesPerTick = this._minutesPerTick ?? J.TIME.Metadata.MinutesPerIncrement;

  /**
   * The number of hours per tick.
   * @type {number}
   */
  this._hoursPerTick = this._hoursPerTick ?? J.TIME.Metadata.HoursPerIncrement;

  /**
   * The number of days per tick.
   * @type {number}
   */
  this._daysPerTick = this._daysPerTick ?? J.TIME.Metadata.DaysPerIncrement;

  /**
   * The number of months per tick.
   * @type {number}
   */
  this._monthsPerTick = this._monthsPerTick ?? J.TIME.Metadata.MonthsPerIncrement;

  /**
   * The number of years per tick.
   * @type {number}
   */
  this._yearsPerTick = this._yearsPerTick ?? J.TIME.Metadata.YearsPerIncrement;

  /**
   * The current second.
   * @type {number}
   */
  this._seconds = this._seconds ?? J.TIME.Metadata.StartingSecond;

  /**
   * The current minute.
   * @type {number}
   */
  this._minutes = this._minutes ?? J.TIME.Metadata.StartingMinute;

  /**
   * The current hour.
   * @type {number}
   */
  this._hours = this._hours ?? J.TIME.Metadata.StartingHour;

  /**
   * The current day (number).
   * @type {number}
   */
  this._days = this._days ?? J.TIME.Metadata.StartingDay;

  /**
   * The current month (number).
   * @type {number}
   */
  this._months = this._months ?? J.TIME.Metadata.StartingMonth;

  /**
   * The current year.
   * @type {number}
   */
  this._years = this._years ?? J.TIME.Metadata.StartingYear;

  /**
   * The general time of day, such as "twilight" or "afternoon"- numerically mapped.
   * @type {number}
   */
  this._timeOfDay = 0;

  /**
   * The general season of the year, such as "spring" or "winter"- numerically mapped.
   * @type {number}
   */
  this._seasonOfYear = 0;

  /**
   * Whether or not the screen's tone needs to be changed based on the time.
   * @type {boolean}
   */
  this._needsToneChange = false;

  /**
   * The current tone of the screen.
   * @type {[number, number, number, number]}
   */
  this._currentTone = [];

  /**
   * Whether or not the time window is visible on the map.
   * @type {boolean}
   */
  this._visible = this._visible ?? J.TIME.Metadata.StartEnabled;
  this.updateCurrentTone();
};

/**
 * Gets the current tick speed.
 * @returns {number}
 */
Game_Time.prototype.getTickSpeed = function() {
  return this._tickFrames;
};

/**
 * Gets whether or not the time window is visibile on the map.
 * @returns {boolean}
 */
Game_Time.prototype.isMapWindowVisible = function() {
  return this._visible;
};

/**
 * Hides the time window on the map.
 */
Game_Time.prototype.hideMapWindow = function() {
  this._visible = false;
};

/**
 * Shows the time window on the map.
 */
Game_Time.prototype.showMapWindow = function() {
  this._visible = true;
};

/**
 * Sets the new tick speed to (60 / multiplier) frames per second.
 * 
 * The threshold for this multiplier is `0.1` to `10.0`.
 * @param {number} flowSpeedMultiplier The new multiplier for how fast a single tick is.
 */
Game_Time.prototype.setTickSpeed = function(flowSpeedMultiplier) {
  // if the user is trying to speed it up to more than 10x, then lock it at 10x.
  if (flowSpeedMultiplier > 10) {
    flowSpeedMultiplier = 10;
  // if the user is trying to reduce the speed to less than 0.1x, then lock it at 0.1x.
  } else if (flowSpeedMultiplier < 0.1) {
    flowSpeedMultiplier = 0.1;
  }

  const newTickSpeed = Math.ceil(60 / flowSpeedMultiplier);
  this._tickFrames = newTickSpeed;
};

/**
 * Updates the time when the framecount aligns with the designated tick frame count.
 */
Game_Time.prototype.update = function() {
  if (Graphics.frameCount % this._tickFrames === 0) {
    this.tickTime();
  }

  if (this.getNeedsToneChange()) {
    this.setNeedsToneChange(false);
    this.processToneChange();
  }
};

/**
 * Gets whether or not the screen's tone change is needed.
 * @returns {boolean}
 */
Game_Time.prototype.getNeedsToneChange = function() {
  if (!J.TIME.Metadata.ChangeToneByTime) {
    return false;
  }

  // if we don't have a map to inspect, don't try to interpret it.
  if (!$dataMap || !$dataMap.meta) {
    console.log("no datamap to inspect.");
    return false;
  }

  // if there is a tag on the map that specifies not to change the tone, then don't.
  if ($dataMap.meta["noToneChange"]) {
    console.log("no tone change on this map.");
    return false;
  }

  return this._needsToneChange;
};

/**
 * Sets whether or not the screen's tone change is needed.
 * @param {boolean} need Whether or not a tone change is needed.
 */
Game_Time.prototype.setNeedsToneChange = function(need = true) {
  this._needsToneChange = need;
};

/**
 * Gets the current screen's tone.
 * @returns {[number, number, number, number]}
 */
Game_Time.prototype.getCurrentTone = function() {
  return this._currentTone;
};

/**
 * Sets the current screen's tone.
 * @param {[number, number, number, number]} newTone The new tone to change to.
 */
Game_Time.prototype.setCurrentTone = function(newTone) {
  this._currentTone = newTone;
};

/**
 * Updates the screen's tone based on the current time.
 */
Game_Time.prototype.updateCurrentTone = function() {
  // if the user decided they don't want to update tones, then don't force them.
  if (!J.TIME.Metadata.ChangeToneByTime) {
    console.log("no tone change per plugin configuration.");
    return;
  };

  // if we reached this point, then grab the target tone 
  const tone = this.translateHourToTone();
  if (!this.isSameTone(tone)) {
    console.log("target tone is different! applying new tone...")
    this.setCurrentTone(tone.clone());
    this.setNeedsToneChange(true);
  }
};

/**
 * Determines the tone associated with the current hour of the day.
 * Tone is represented as whole numbers in an array: `[red, green, blue, grey]`.
 * For example: `[100, -50, 0, 0]`. `Grey` must be between 0 and 255, while the rest can
 * be between -255 and 255.
 * @returns {[number, number, number, number]}
 */
Game_Time.prototype.translateHourToTone = function() {
  const hours = J.TIME.Metadata.UseRealTime
    ? new Date().getHours()
    : this._hours;
  let tone = [0, 0, 0, 0];
  switch (hours) {
    case  0: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.25);
      break;
    case  1: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.50);
      break;
    case  2: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.75);
      break;
    case  3: // night
      tone = Game_Time.toneOfDay.Night;
      break;
    case  4: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.25);
      break;
    case  5: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.50);
      break;
    case  6: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.75);
      break;
    case  7: // dawn
      tone = Game_Time.toneOfDay.Dawn;
      break;
    case  8: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.25);
      break;
    case  9: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.50);
      break;
    case 10: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.75);
      break;
    case 11: // morning
      tone = Game_Time.toneOfDay.Morning;
      break;
    case 12: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.25);
      break;
    case 13: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.50);
      break;
    case 14: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.75);
      break;
    case 15: // afternoon
      tone = Game_Time.toneOfDay.Afternoon;
      break;
    case 16: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.25);
      break;
    case 17: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.50);
      break;
    case 18: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.75);
      break;
    case 19: // evening
      tone = Game_Time.toneOfDay.Evening;
      break;
    case 20: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.25);
      break;
    case 21: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.50);
      break;
    case 22: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.75);
      break;
    case 23: // twilight
      tone = Game_Time.toneOfDay.Twilight;
      break;
  }

  return tone;
};

/**
 * Calculates the tone that is a percentage of the way between two tones.
 * 
 * Order is important here, as we are calculating a percent of the way from
 * the first tone to the second tone.
 * @param {[number, number, number, number]} tone1 The starting tone.
 * @param {[number, number, number, number]} tone2 The next tone.
 * @param {number} rate The decimal rate of which we are transitioning to.
 * @returns {[number, number, number, number]}
 */
Game_Time.prototype.toneBetweenTones = function(tone1, tone2, rate) {
  const diff = (a, b) => a > b ? a - b : b - a;
  const newTone = [];
  tone1.forEach((color1, index) => {
    const color2 = tone2[index];
    const diffToNext = diff(color1, color2);
    const partial = Math.round(diffToNext * rate);
    const newRgbValue = color2 > color1 ? color1 + partial : color1 - partial;
    newTone.push(newRgbValue);
  });

  return newTone;
};

/**
 * Compares the current tone with a target tone to see if they are the same.
 * @param {[number, number, number, number]} targetTone 
 * @returns {boolean}
 */
Game_Time.prototype.isSameTone = function(targetTone) {
  if (this._currentTone.length < 4) return false;

  // individually compare each array item with the new tone.
  if (this._currentTone[0] !== targetTone[0]) return false;
  if (this._currentTone[1] !== targetTone[1]) return false;
  if (this._currentTone[2] !== targetTone[2]) return false;
  if (this._currentTone[3] !== targetTone[3]) return false;

  return true;
};

/**
 * Processes the screen's tone change.
 */
Game_Time.prototype.processToneChange = function() {
  $gameScreen.startTint(this._currentTone, 30);
};

/**
 * Gets a snapshot of the current time.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.currentTime = function() {
  if (J.TIME.Metadata.UseRealTime) {
    return this.determineRealTime();
  } else {
    return this.determineArtificialTime();
  }
};

/**
 * Gets a snapshot of the current time that is artificial.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.determineArtificialTime = function() {
  const timeOfDayId = this.timeOfDay(this._hours);
  const seasonOfYearId = this.seasonOfYear(this._months);
  return new Time_Snapshot(
    this._seconds,
    this._minutes,
    this._hours,
    this._days,
    this._months,
    this._years,
    timeOfDayId,
    seasonOfYearId);
};

/**
 * Gets a snapshot of the current time in the real world.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.determineRealTime = function() {
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1; //? returns 0-11 for some reason instead of 1-12.
  const years = date.getFullYear();
  const timeOfDayId = this.timeOfDay(hours);
  const seasonOfYearId = this.seasonOfYear(months);
  return new Time_Snapshot(
    seconds,
    minutes,
    hours,
    days,
    months,
    years,
    timeOfDayId,
    seasonOfYearId);
};

/**
 * Translates the current hour into the time of the day id.
 * @returns {number}
 */
Game_Time.prototype.timeOfDay = function(hours) {
  switch (true) {
    case (hours <= 3):
      return 0;
    case (hours > 3 && hours <= 7):
      return 1;
    case (hours > 7 && hours <= 11):
      return 2;
    case (hours > 11 && hours <= 15):
      return 3;
    case (hours > 15 && hours <= 19):
      return 4;
    case (hours > 19):
      return 5;
    default: return -1;
  }
};

/**
 * Translates the current month into the season of the year id.
 * @returns {number}
 */
Game_Time.prototype.seasonOfYear = function(months) {
  const springMonths = [3, 4, 5];
  const summerMonths = [6, 7, 8];
  const autumnMonths = [9, 10, 11];
  const winterMonths = [1, 2, 12];
  switch (true) {
    case (springMonths.includes(months)):
      return 0;
    case (summerMonths.includes(months)):
      return 1;
    case (autumnMonths.includes(months)):
      return 2;
    case (winterMonths.includes(months)):
      return 3;
    default:
      return -1;
  }
};

/**
 * Executes the progression of time automatically. Adds the default amount of seconds
 * to the current time with every tick. This function was designed to emulate the ticking
 * of the second hand, but if the defaults are changed, it can tick multiple seconds or
 * even multiple minutes per tick.
 */
Game_Time.prototype.tickTime = function() {
  this.addSeconds();
};

//#region add time
/**
 * Ticks the second counter up by a designated amount.
 * @param {number} seconds The number of seconds to tick.
 */
Game_Time.prototype.addSeconds = function(seconds = this._secondsPerTick) {
  // check how many seconds we have when adding the tick amount.
  let potentialSeconds = this._seconds + seconds;

  // if we have greater than or equal to 60...
  if (potentialSeconds >= 60) {
    // ...keep adding minutes until we're below 60 seconds.
    while (potentialSeconds >= 60) {
      this.addMinutes(this._minutesPerTick);
      potentialSeconds -= 60;
    }

    // and reassign the seconds.
    this._seconds = potentialSeconds;
  // if we don't have more than 60, just add the seconds on.
  } else {
    this._seconds += seconds;
  }
};

/**
 * Ticks the minute counter up by a designated amount.
 * @param {number} minutes The number of minutes to tick.
 */
Game_Time.prototype.addMinutes = function(minutes = this._minutesPerTick) {
  let potentialMinutes = this._minutes + minutes;
  if (potentialMinutes >= 60) {
    while (potentialMinutes >= 60) {
      this.addHours(this._hoursPerDay);
      potentialMinutes -= 60;
    }

    this._minutes = potentialMinutes;
  } else {
    this._minutes += minutes;
  }
};

/**
 * Ticks the hour counter up by a designated amount.
 * @param {number} hours The number of hours to tick.
 */
Game_Time.prototype.addHours = function(hours = this._hoursPerTick) {
  this.updateCurrentTone();
  let potentialHours = this._hours + hours;
  if (potentialHours >= 24) {
    while (potentialHours >= 24) {
      this.addDays(this._daysPerTick);
      potentialHours -= 24;
    }

    this._hours = potentialHours;
  } else {
    this._hours += hours;
  }
};

/**
 * Ticks the days counter up by a designated amount.
 * @param {number} days The number of days to tick.
 */
Game_Time.prototype.addDays = function(days = this._daysPerTick) {
  let potentialDays = this._days + days;
  if (potentialDays > 30) {
    while (potentialDays > 30) {
      this.addMonths(this._monthsPerTick);
      potentialDays -= 30;
    }

    this._days = potentialDays;
  } else {
    this._days += days;
  }
};

/**
 * Ticks the months counter up by a designated amount.
 * @param {number} months The number of months to tick.
 */
Game_Time.prototype.addMonths = function(months = this._monthsPerTick) {
  let potentialMonths = this._months + months;
  if (potentialMonths > 12) {
    while (potentialMonths > 12) {
      this.addYears(this._yearsPerTick);
      potentialMonths -= 12;
    }

    this._months = potentialMonths;
  } else {
    this._months += months;
  }
};

/**
 * Ticks the years counter up by a designated amount.
 * @param {number} years The number of years to tick.
 */
Game_Time.prototype.addYears = function(years = this._yearsPerTick) {
  this._years += years;
};
//#endregion add time

//#endregion Game_Time
//#endregion Game objects

//#region Window objects
//#region Window_Time
/**
 * A window class for displaying the time.
 */
class Window_Time extends Window_Base {
  /**
   * @constructor
   * @param {Rectangle} rect The shape representing this window.
   */
  constructor(rect) {
    super(rect);
    this.opacity = 0;
    this.generateBackground();
    this.initMembers();
  };

  /**
   * Replaces the background of the time window with what will look like a standard
   * "dimmed" window gradient.
   */
  generateBackground() {
    const c1 = ColorManager.dimColor1();
    const c2 = ColorManager.dimColor2();
    const x = -4;
    const y = -4;
    const w = this.contentsBack.width + 8;
    const h = this.contentsBack.height + 8;
    this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    this.contentsBack.strokeRect(x, y, w, h, c1);
  };

  /**
   * Initializes all members of this class.
   */
  initMembers() {
    this.time = null;
    this._frames = 0;
    this._alternating = false;
    this.refresh();
  };

  /**
   * Updates the frames and refreshes the window's contents once every half second.
   */
  update() {
    super.update();
    this._frames++;
    if (this._frames % $gameTime.getTickSpeed() === 0) {
      this.refresh();
    }

    if (this._frames % 60 === 0) {
      this._alternating = !this._alternating;
      this.refresh();
    }
  };

  /**
   * Refreshes the window by clearing it and redrawing everything.
   */
  refresh() {
    this.time = $gameTime.currentTime();

    // redraw all the contents.
    this.contents.clear();
    this.drawContent();
  };

  /**
   * Draws the contents of the window.
   */
  drawContent() {
    const colon1 = this._alternating ? ":" : " ";
    const colon2 = this._alternating ? " " : ":";
    const ampm = this.time.hours > 11 ? "PM" : "AM";
    const lh = this.lineHeight();

    const seconds = this.time.seconds.padZero(2);
    const minutes = this.time.minutes.padZero(2);
    const hours = this.time.hours.padZero(2);
    const timeOfDayName = this.time.timeOfDayName;
    const timeOfDayIcon = this.time.timeOfDayIcon;
    const seasonName = this.time.seasonOfTheYearName;
    const seasonIcon = this.time.seasonOfTheYearIcon;

    const days = this.time.days.padZero(2);
    const months = this.time.months.padZero(2);
    const years = this.time.years.padZero(4);

    this.drawTextEx(`\\I[2784]${hours}${colon1}${minutes}${colon2}${seconds} \\}${ampm}`, 0, lh*0, 200);
    this.drawTextEx(`\\I[${timeOfDayIcon}]${timeOfDayName}`, 0, lh*1, 200);
    this.drawTextEx(`\\I[${seasonIcon}]${seasonName}`, 0, lh*2, 200);
    this.drawTextEx(`${years}/${months}/${days}`, 0, lh*3, 200);
  };

}
//#endregion Window_Time
//#endregion Window objects

//#region Custom classes
//#region Time_Snapshot
/**
 * A class representing a snapshot in time of a moment.
 */
class Time_Snapshot {
  /**
   * @constructor
   * @param {number} seconds The seconds of the current time.
   * @param {number} minutes The minutes of the current time.
   * @param {number} hours The hours of the current time.
   * @param {number} days The days of the current time.
   * @param {number} months The months of the current time.
   * @param {number} years The years of the current time.
   * @param {number} timeOfDayId The id of the time of day.
   * @param {number} seasonOfYearId The id of the season of the year.
   */
  constructor(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId) {
    /**
     * The seconds of the current time.
     * @type {number}
     */
    this.seconds = seconds;

    /**
     * The minutes of the current time.
     * @type {number}
     */
    this.minutes = minutes;

    /**
     * The hours of the current time.
     * @type {number}
     */
    this.hours = hours;

    /**
     * The days of the current time.
     * @type {number}
     */
    this.days = days;

    /**
     * The months of the current time.
     * @type {number}
     */
    this.months = months;

    /**
     * The years of the current time.
     * @type {number}
     */
    this.years = years;

    /**
     * The id of the time of day.
     * @type {number}
     */
    this._timeOfDayId = timeOfDayId;

    /**
     * The id of the season of the year.
     * @type {number}
     */
    this._seasonOfYearId = seasonOfYearId;
  };

  //#region statics
  /**
   * Translates the numeric season of the year into it's proper name.
   * @param {number} seasonId The numeric representation of the season of the year.
   * @returns {string}
   */
  static SeasonsName(seasonId) {
    switch (seasonId) {
      case 0: return "Spring";
      case 1: return "Summer";
      case 2: return "Autumn";
      case 3: return "Winter";
      default: return `${seasonId} is not a valid season id.`;
    }
  };

  /**
   * Translates the numeric season of the year into it's icon index.
   * @param {number} seasonId The numeric representation of the season of the year.
   * @returns {string}
   */
  static SeasonsIconIndex(seasonId) {
    switch (seasonId) {
      case 0: return 887;
      case 1: return 888;
      case 2: return 889;
      case 3: return 890;
      default: return `${seasonId} is not a valid season id.`;
    }
  };

  /**
   * Translates the numeric time of the day into it's proper name.
   * @param {number} timeOfDayId The numeric representation of the time of the day.
   * @returns {string}
   */
  static TimesOfDayName(timeOfDayId) {
    switch (timeOfDayId) {
      case 0: return "Night";     // midnight-4am
      case 1: return "Dawn";      // 4am-8am
      case 2: return "Morning";   // 8am-noon
      case 3: return "Afternoon"; // noon-4pm
      case 4: return "Evening";   // 4pm-8pm
      case 5: return "Twilight";  // 8pm-midnight
      default: return `${timeOfDayId} is not a valid time of day id.`;
    }
  };

  /**
   * Translates the numeric time of the day into it's icon index.
   * @param {number} timeOfDayId The numeric representation of the time of the day.
   * @returns {string}
   */
  static TimesOfDayIcon(timeOfDayId) {
    switch (timeOfDayId) {
      case 0: return 2256;  // midnight-4am
      case 1: return 2260;  // 4am-8am
      case 2: return 2261;  // 8am-noon
      case 3: return 2261;  // noon-4pm
      case 4: return 2257;  // 4pm-8pm
      case 5: return 2256;  // 8pm-midnight
      default: return `${timeOfDayId} is not a valid time of day id.`;
    }
  };
  //#endregion statics

  /**
   * Gets the name of the current season of the year.
   * @type {string}
   */
  get seasonOfTheYearName() {
    return Time_Snapshot.SeasonsName(this._seasonOfYearId);
  };

  /**
   * Gets the icon index of the current season of the year.
   * @type {number}
   */
  get seasonOfTheYearIcon() {
    return Time_Snapshot.SeasonsIconIndex(this._seasonOfYearId);
  };

  /**
   * Gets the name of the current time of the day.
   * @type {string}
   */
  get timeOfDayName() {
    return Time_Snapshot.TimesOfDayName(this._timeOfDayId);
  };

  /**
   * Gets the icon index of the current time of the day.
   * @type {number}
   */
  get timeOfDayIcon() {
    return Time_Snapshot.TimesOfDayIcon(this._timeOfDayId);
  };
}
//#endregion Time_Snapshot
//#endregion Custom classes