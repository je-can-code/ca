/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/core/
 * @target MZ
 * @plugindesc Core CGMZ Plugin, should be placed above all other CGMZ Plugins.
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.6.0
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.3.2
 * ----------------------------------------------------------------------------
 * Description: This is the core CGMZ plugin which is used extensively
 * by other CGMZ plugins and is likely to be required.
 * ----------------------------------------------------------------------------
 * Documentation:
 * This plugin can automatically check if any CGMZ plugin you have is out of
 * date. To see out of date plugins, open the console while playtesting by
 * pressing F8. The game will not check for updates in deployed games.
 * -------------------------Plugin Commands------------------------------------
 * The following plugin commands are supported:
 * Initialize   # Re-initializes the CGMZ Core. Only use this if you know what
 *              # you are doing! Erases CGMZ data.
 * -------------------------Version History------------------------------------
 * 1.1:
 * - Added function to automatically check if any CGMZ plugin is out of date
 * - Added function to split a string into multiple lines if the string is too
 * long for a window to handle without reducing font size (text wrap).
 * - Added class CGMZ_Window_Scrollable which can scroll vertically with
 * handlers but no visible cursor. A mix between Window_Base,
 * Window_Scrollable, and Window_Selectable
 * - Added CGMZ map name meta access
 *
 * 1.2:
 * - Removed unused code for a title window as this no longer fits with MZ
 * touch buttons.
 * - Added draw gauge functionality to windows that do not need sprite gauges
 *
 * 1.2.1:
 * - Updated api call for version check to use semantic versioning
 * - Added link to update directly from console
 * - Cut down on outdated CGMZ plugin warnings in console
 *
 * 1.3.0:
 * - Added basic input processing for all keys on keyboard
 * - Added option to open dev tools on game start
 *
 * 1.4.0:
 * - Added option to show fps on game start
 * - Added option to go fullscreen on game start
 * - Bugfix to add cap to scrollable window size
 *
 * 1.5.0:
 * - Added new draw text function for text codes with automatic line breaks
 * - Added update behavior
 * - Added behavior after load in CGMZ classes
 * - Added new timer class
 * - Optimized existing code
 *
 * 1.5.1:
 * - Added parameter to simulate deployed environment during playtest
 * - Added new draw text function for drawing for a single line of text with text codes
 *
 * 1.5.2:
 * - More concise error reporting
 * - Bugfix for font size changes throwing off line wrap when drawing text with text codes
 *
 * 1.5.3:
 * - Added function for getting file info
 * - Removed deprecated code (if getting crash after update, update crashing plugin)
 *
 * 1.6.0:
 * - Added support for subfolders for images
 * - Added more customizable selectable window with categories
 * - Added function to draw a divider on windows
 * - Added support for spritesheet animations on map
 * - Various bug fixes for text code drawing in unusual cases
 *
 * @command Initialize
 * @desc Re-initializes some CGMZ Classes. Only call this if you know what you
 * are doing. Will reset all CGMZ Data as if you started a new game.
 *
 * @param Check for Updates
 * @type boolean
 * @desc Check for updates to CGMZ plugins on game start?
 * @default true
 *
 * @param Dev Tools on Start
 * @type boolean
 * @desc Open the dev tool console on game start?
 * @default false
 *
 * @param Show FPS Counter
 * @type boolean
 * @desc Show fps counter on game start?
 * @default false
 *
 * @param Fullscreen
 * @type boolean
 * @desc Go fullscreen on game start?
 * @default false
 *
 * @param Simulate Production Env
 * @type boolean
 * @desc If set to true, this will cause the game to think you are NOT playtesting even when launched in editor
 * @default false
*/
var Imported = Imported || {};
Imported.CGMZ_Core = true;
var CGMZ = CGMZ || {};
CGMZ.Versions = CGMZ.Versions || {};
CGMZ.Versions["CGMZ Core"] = "1.6.0";
CGMZ.Core = CGMZ.Core || {};
CGMZ.Core.parameters = PluginManager.parameters('CGMZ_Core');
CGMZ.Core.CheckForUpdates = (CGMZ.Core.parameters["Check for Updates"] === "true");
CGMZ.Core.ShowDevTools = (CGMZ.Core.parameters["Dev Tools on Start"] === "true");
CGMZ.Core.StartFullscreen = (CGMZ.Core.parameters["Fullscreen"] === "true");
CGMZ.Core.ShowFPSCounter = (CGMZ.Core.parameters["Show FPS Counter"] === "true");
CGMZ.Core.SimulateProductionEnv = (CGMZ.Core.parameters["Simulate Production Env"] === "true");
//=============================================================================
// CGMZ_Temp
//-----------------------------------------------------------------------------
// This class stores data not saved for CGMZ plugins
//=============================================================================
function CGMZ_Temp() {
    this.initialize.apply(this, arguments);
}
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.initialize = function() {
	this._inputCurrentState = {};
	this._animationQueue = [];
	this.createPluginData();
	this.createMappedFunctions();
	this.registerPluginCommands();
	this.initEnvVariables();
};
//-----------------------------------------------------------------------------
// Set up environment variables
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.initEnvVariables = function() {
	const canvas = document.createElement('canvas');
	const gl = canvas.getContext('webgl');
	if(gl) {
		this._maxCanvasSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
	} else {
		this._maxCanvasSize = 16384; // 2^14
	}
};
//-----------------------------------------------------------------------------
// Get the max canvas size
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.getMaxCanvasSize = function() {
	return this._maxCanvasSize;
};
//-----------------------------------------------------------------------------
// Check the version of CGMZ plugins against most up to date from server
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.checkCGMZPluginVersions = function(jsonData) {
	let warned = false;
	let pluginName = "";
	jsonData.versions.forEach((version) => {
		if(CGMZ.Versions[version.name] && CGMZ.Versions[version.name].toString() !== version.version.toString()) {
			if(!warned) {
				console.warn("Warning! Out of date CGMZ Plugin(s) found:");
				warned = true;
			}
			pluginName = version.name;
			if(pluginName === "CGMZ Core") {
				pluginName = "Core";
			}
			console.warn("CGMZ " + pluginName + " had a local version of " + 
						 CGMZ.Versions[version.name] + " but a server version of " + version.version + "\n" + 
						 "You can download an update from https://www.caspergaming.com/plugins/cgmz/" + version.url + "/");
		}
	});
};
//-----------------------------------------------------------------------------
// To be overridden by CGMZ plugins
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.createPluginData = function() {
	// Used by CGMZ plugins
};
//-----------------------------------------------------------------------------
// Update CGMZ Timers and other plugins
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.update = function() {
	this.updateTimers();
};
//-----------------------------------------------------------------------------
// Update CGMZ Timers
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.updateTimers = function() {
	const timer = $cgmz.getEarliestTimer();
	if(timer && timer._frameCount < Graphics.frameCount) {
		$cgmz.executeEarliestTimer();
	}
};
//-----------------------------------------------------------------------------
// Register Plugin Commands
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.registerPluginCommands = function() {
	PluginManager.registerCommand("CGMZ_Core", "Initialize", this.pluginCommandReinitialize);
};
//-----------------------------------------------------------------------------
// Reinitializes the plugin - Plugin Command
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandReinitialize = function() {
	$cgmzTemp.createPluginData();
	$cgmz.createPluginData();
};
//-----------------------------------------------------------------------------
// Report an error to the console
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.reportError = function(error, origin, suggestion = "Update Plugins") {
	console.warn("Error in plugin: " + origin + "\nError description: " + error + "\nPossible solution: " + suggestion);
};
//-----------------------------------------------------------------------------
// Takes a filepath of folder+filename and returns object with separate folder+filename
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.getImageData = function(imageLoc) {
	const splitPath = imageLoc.split("/");
	const file = splitPath.pop();
	const path = splitPath.join("/");
	return {folder: "img/" + path + "/", filename: file};
};
//-----------------------------------------------------------------------------
// Takes a number and returns it's toLocaleString value
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.numberSplit = function(num) {
	return num.toLocaleString();
};
//-----------------------------------------------------------------------------
// Takes an amount of frames and gives back the time in hours:minutes:seconds
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.timeSplit = function(frameCount) {
	let temp = frameCount/60;
	let seconds = temp%60;
	let minutes = Math.floor(temp/60) % 60;
	let hours = Math.floor(temp/60/60) % 60;
    return hours.padZero(2) + ':' + minutes.padZero(2) + ':' + seconds.padZero(2);
};
//-----------------------------------------------------------------------------
// Takes an amount of seconds and tries to approximate it to Hours, Minutes, or Seconds
// Does not go above days as a time unit.
// For example, 30 seconds would return [30, "seconds"]
//              45 minutes would return [45, "minutes"]
//              18 hours would return   [18, "hours"]
//              28 days would return    [28, "days"]
// If there is an error, it will return an empty array
// If forceApproximation is true, will round down to nearest even unit provided
// by approximateToUnitString
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.approximateTimeValue = function(seconds, forceApproximation, approximateToUnitString) {
	forceApproximation = forceApproximation || false;
	let value = [];
	if (forceApproximation) {
		value[0] = this.approximateTimeValueToUnit(seconds, approximateToUnitString);
		value[1] = approximateToUnitString;
	}
	else if (seconds >= 86400) { // 86400 seconds in a day
		value[0] = Math.floor(seconds/60/60/24);
		value[1] = "Days";
	}
	else if (seconds >= 3600 && seconds < 86400) { // 3060 seconds in an hour, 86400 seconds in a day
		value[0] = Math.floor(seconds/60/60);
		value[1] = "Hours";
	}
	else if (seconds >= 60 && seconds < 3600) { // 60 seconds in a minute, 3600 seconds in an hour
		value[0] = Math.floor(seconds/60);
		value[1] = "Minutes";
	}
	else if (seconds < 60) { // 60 seconds in a minute
		value[0] = seconds;
		value[1] = "Seconds";
	}
	return value;
};
//-----------------------------------------------------------------------------
// Takes an amount of seconds and approximates it to an amount of time units (minute, hour, day)
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.approximateTimeValueToUnit = function(seconds, unitString) {
	switch(unitString) {
		case "Days": return Math.floor(seconds/60/60/24);
		case "Hours": return Math.floor(seconds/60/60);
		case "Minutes": return Math.floor(seconds/60);
		case "Seconds": return seconds;
	}
	const script = "CGMZ Core";
	const error = "Unrecognized unitString in approximateTimeValueToUnit()";
	this.reportError(error, script);
	return 0;
};
//-----------------------------------------------------------------------------
// Take javascript getDate, getMonth, and getFullYear and return formatted date text
// Valid formats (using / as delim):
// 0: MM/DD/YYYY     (ex: 1/20/2001)
// 1: DD/MM/YYYY     (ex: 20/1/2001)
// 2: YYYY/MM/DD     (ex: 2001/1/20)
// 3: Month DD, YYYY (ex: January 20, 2001)
// 4: DD Month YYYY  (ex: 20 January 2001)
// 5: Mon. DD, YYYY  (ex: Jan 20, 2001)
// 6: DD Mon. YYYY   (ex: 20 Jan 2001)
// 7: MM/DD          (ex: 1/20)
// 8: DD/MM          (ex: 20/1)
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.createDateText = function(day, month, year, format, delim) {
	switch(format) {
		case 0: return (month+1).toString() + delim + day.toString() + delim + year.toString();
		case 1: return day.toString() + delim + (month+1).toString() + delim + year.toString();
		case 2: return year.toString() + delim + (month+1).toString() + delim + day.toString();
		case 3: return this.getFullMonthName(month) + " " + day.toString() + ", " + year.toString();
		case 4: return day.toString() + " " + this.getFullMonthName(month) + " " + year.toString();
		case 5: return this.getShortMonthName(month) + " " + day.toString() + ", " + year.toString();
		case 6: return day.toString() + " " + this.getShortMonthName(month) + " " + year.toString();
		case 7: return (month+1).toString() + delim + day.toString();
		case 8: return day.toString() + delim + (month+1).toString();
	}
	this.reportError("createDateText: Out of range", "CGMZ Core");
	return "Unknown Date";
};
//-----------------------------------------------------------------------------
// Convert javascript getMonth int to full name of month string
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.getFullMonthName = function(month) {
	switch(month) {
		case 0: return "January";
		case 1: return "February";
		case 2: return "March";
		case 3: return "April";
		case 4: return "May";
		case 5: return "June";
		case 6: return "July";
		case 7: return "August";
		case 8: return "September";
		case 9: return "October";
		case 10: return "November";
		case 11: return "December";
	}
	this.reportError("getFullMonthName: Out of range", "CGMZ Core");
	return "Unknown";
};
//-----------------------------------------------------------------------------
// Convert javascript getMonth int to abbreviated name of month string
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.getShortMonthName = function(month) {
	switch(month) {
		case 0: return "Jan";
		case 1: return "Feb";
		case 2: return "Mar";
		case 3: return "Apr";
		case 4: return "May";
		case 5: return "Jun";
		case 6: return "Jul";
		case 7: return "Aug";
		case 8: return "Sep";
		case 9: return "Oct";
		case 10: return "Nov";
		case 11: return "Dec";
	}
	this.reportError("getShortMonthName: Out of range", "CGMZ Core", "Update CGMZ Plugins");
	return "Unknown";
};
//-----------------------------------------------------------------------------
// Look up item given type and id
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.lookupItem = function(type, id) {
	switch(type) {
		case 'item': return $dataItems[id];
		case 'weapon': return $dataWeapons[id];
		case 'armor': return $dataArmors[id];
	}
	this.reportError("Item type setup incorrectly", "CGMZ Core", "Check item parameters set up through CGMZ plugins");
	return null;
};
//-----------------------------------------------------------------------------
// Request a response from an API using fetch, and output response to custom
// function
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.requestResponse = function(url, func) {
	fetch(url).then(response => {
		if(response.status >= 200 && response.status < 300)
			return response.json();
		console.warn("Request error, received non-OK response: " + response.status);
	}).then(data => {
		func.call(this, data);
	}).catch((e) => { // JSON error
		console.warn('Error with response JSON: ', e);
	});
};
//-----------------------------------------------------------------------------
// Clear input
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.inputClear = function() {
	this._inputCurrentState = {};
};
//-----------------------------------------------------------------------------
// on key down
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.onKeyDown = function(event) {
	let key = event.key;
	if(key) {
		this._inputCurrentState[key] = true;
		this.refreshForKeysDown();
	}
};
//-----------------------------------------------------------------------------
// on key up
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.onKeyUp = function(event) {
	let key = event.key;
	if(key) {
		this._inputCurrentState[key] = false;
		this.refreshForKeysUp();
	}
};
//-----------------------------------------------------------------------------
// Refresh plugins on key down
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.refreshForKeysDown = function() {
	//Used by other plugins
};
//-----------------------------------------------------------------------------
// Refresh plugins on key up
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.refreshForKeysUp = function() {
	//Used by other plugins
};
//-----------------------------------------------------------------------------
// is Key Pressed?
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.isKeyPressed = function(key) {
	return this._inputCurrentState[key];
};
//-----------------------------------------------------------------------------
// Create mapped functions
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.createMappedFunctions = function() {
	this._mappedFunctions = {}
};
//-----------------------------------------------------------------------------
// Call a mapped function
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.callMappedFunctions = function(funcName, args) {
	func = this._mappedFunctions[funcName];
	if(func) {
		func.call(this, args);
	}
};
//-----------------------------------------------------------------------------
// Request a map animation
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.requestMapAnimation = function(imageData, x, y, frameWidth, frameHeight, animationSpeed, options = {}) {
	const request = {};
	request.bitmap = imageData;
	request.x = x;
	request.y = y;
	request.frameWidth = frameWidth;
	request.frameHeight = frameHeight;
	request.animationSpeed = animationSpeed;
	request.options = options;
	this._animationQueue.push(request);
};
//-----------------------------------------------------------------------------
// Retrieve a map animation request
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.retrieveMapAnimationRequest = function() {
	return this._animationQueue.shift();
};
//=============================================================================
// CGMZ_Core
//-----------------------------------------------------------------------------
// This class contains some common methods for other CGMZ plugins.
//=============================================================================
function CGMZ_Core() {
    this.initialize.apply(this, arguments);
}
//-----------------------------------------------------------------------------
// Initialize CGMZ_Core
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.initialize = function() {
	this._cgmzTimers = [];
	this.createPluginData();
};
//-----------------------------------------------------------------------------
// To be overridden by CGMZ plugins
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.createPluginData = function() {
	// Used by CGMZ plugins
};
//-----------------------------------------------------------------------------
// Check if anything needs to be done after a saved game is loaded
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.onAfterLoad = function() {
	if(!this._cgmzTimers) this._cgmzTimers = [];
	// Used by CGMZ plugins
};
//-----------------------------------------------------------------------------
// Get earliest timer
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.getEarliestTimer = function() {
	if(this._cgmzTimers) return this._cgmzTimers[0];
	return null;
};
//-----------------------------------------------------------------------------
// Get all timers
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.getAllTimers = function() {
	return this._cgmzTimers;
};
//-----------------------------------------------------------------------------
// Get timer by id
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.getTimerById = function(id) {
	return this._cgmzTimers.find(timer => timer._id === id);
};
//-----------------------------------------------------------------------------
// Request adding a timer, if valid will add the timer to the timer array
// sorted by each timer's frameCount
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.requestNewTimer = function(timer) {
	if(!timer) return;
	const existingTimer = this.getTimerById(timer._id);
	if(existingTimer) {
		existingTimer._frameCount = timer._frameCount;
	} else {
		this._cgmzTimers.push(timer);
	}
	this._cgmzTimers.sort((a, b) => (a._frameCount > b._frameCount) ? 1 : -1);
};
//-----------------------------------------------------------------------------
// Execute earliest timer
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.executeEarliestTimer = function() {
	timer = this._cgmzTimers.shift();
	if(timer) {
		$cgmzTemp.callMappedFunctions(timer._funcName, timer._args);
	}
};
//-----------------------------------------------------------------------------
// Execute timer by id
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.executeTimerById = function(id) {
	for(let i = 0; i < this._cgmzTimers.length; i++) {
		if(this._cgmzTimers[i]._id === id) {
			const removedTimer = this._cgmzTimers.splice(i, 1)[0];
			$cgmzTemp.callMappedFunctions(removedTimer._funcName, removedTimer._args);
			break;
		}
	}
};
//=============================================================================
// CGMZ_Timer
//-----------------------------------------------------------------------------
// Handles a timer (by frame count)
//=============================================================================
function CGMZ_Timer() {
    this.initialize.apply(this, arguments);
}
//-----------------------------------------------------------------------------
// Initialize Reputation
//-----------------------------------------------------------------------------
CGMZ_Timer.prototype.initialize = function(frameCount, id, funcName, args = {}) {
	this._id = id;
	this._frameCount = Graphics.frameCount + frameCount;
	this._funcName = funcName;
	this._args = args;
};
//=============================================================================
// Game_Map
//-----------------------------------------------------------------------------
// Add function for getting map name (unique to CGMZ plugins)
//=============================================================================
//-----------------------------------------------------------------------------
// Get CGMZ map name
//-----------------------------------------------------------------------------
Game_Map.prototype.CGMZ_getMapName = function() {
    let name = "Unknown";
	if($dataMap.meta.cgmzname) {
		name = $dataMap.meta.cgmzname;
	}
	return name;
};
//=============================================================================
// Game_System
//-----------------------------------------------------------------------------
// Add call to CGMZ_Core after load
//=============================================================================
//-----------------------------------------------------------------------------
// Alias. Also check if CGMZ_Core needs to do anything after load
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_GameSystem_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function() {
    alias_CGMZ_Core_GameSystem_onAfterLoad.call(this);
	$cgmz.onAfterLoad();
};
//=============================================================================
// DataManager
//-----------------------------------------------------------------------------
// Saving and loading CGMZ data. Also checks for out of date plugins
// modified functions: createGameObjects, makeSaveContents, extractSaveContents
// 					   setupNewGame
//=============================================================================
$cgmz = null;
$cgmzTemp = null;
//-----------------------------------------------------------------------------
// Initialize the $cgmz variable
//-----------------------------------------------------------------------------
const CGMZ_Core_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    CGMZ_Core_createGameObjects.call(this);
	$cgmz = new CGMZ_Core();
	$cgmzTemp = new CGMZ_Temp();
};
//-----------------------------------------------------------------------------
// Save CGMZ data
//-----------------------------------------------------------------------------
const CGMZ_Core_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = CGMZ_Core_makeSaveContents.call(this);
    contents.cgmz = $cgmz;
    return contents;
};
//-----------------------------------------------------------------------------
// Load CGMZ data
//-----------------------------------------------------------------------------
const CGMZ_Core_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    CGMZ_Core_extractSaveContents.call(this, contents);
	contents.cgmz ? $cgmz = contents.cgmz : console.warn("Could not load CGMZ data!");
};
//-----------------------------------------------------------------------------
// After setting things up, check for out of date CGMZ plugins
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_DataManager_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function() {
    alias_CGMZ_Core_DataManager_setupNewGame.call(this);
	if($gameTemp.isPlaytest() && CGMZ.Core.CheckForUpdates) {
		const url = 'https://www.caspergaming.com/api/public/cgmz/v2/versions/';
		$cgmzTemp.requestResponse(url, $cgmzTemp.checkCGMZPluginVersions);
	}
};
//=============================================================================
// SceneManager
//-----------------------------------------------------------------------------
// Update CGMZ_Core every frame
// modified functions: updateMain
//=============================================================================
//-----------------------------------------------------------------------------
// Update CGMZ_Core
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_SceneManager_updateMain = SceneManager.updateMain;
SceneManager.updateMain = function() {
	alias_CGMZ_Core_SceneManager_updateMain.call(this);
	if($cgmzTemp) $cgmzTemp.update();
};
//=============================================================================
// Scene_Boot
//-----------------------------------------------------------------------------
// Opens dev tools on startup if test play and plugin parameter is configured
//=============================================================================
//-----------------------------------------------------------------------------
// Also open dev tool console if user wishes
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    alias_CGMZ_Core_Scene_Boot_start.call(this);
	if($gameTemp.isPlaytest() && CGMZ.Core.ShowDevTools) {
		SceneManager.showDevTools();
	}
	if($gameTemp.isPlaytest() && CGMZ.Core.ShowFPSCounter) {
		Graphics._switchFPSCounter();
	}
	if(CGMZ.Core.StartFullscreen) {
		Graphics._requestFullScreen();
	}
};
//=============================================================================
// CGMZ_Window_Scrollable
//-----------------------------------------------------------------------------
// Window used by CGMZ Scripts to allow for more info to be shown than would
// otherwise fit and also scroll automatically to show info.
// A mix between the default Window_Scrollable and Window_Selectable with the
// functionality of: handlers (selectable), vertical scrolling (scrollable).
//=============================================================================
function CGMZ_Window_Scrollable() {
    this.initialize(...arguments);
}
CGMZ_Window_Scrollable.prototype = Object.create(Window_Base.prototype);
CGMZ_Window_Scrollable.prototype.constructor = CGMZ_Window_Scrollable;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.initialize = function(rect, heightMultiplier, scrollWait = 300, scrollSpeed = 1,
													   autoscroll = true, deceleration = 0.92) {
    Window_Base.prototype.initialize.call(this, rect);
	this._handlers = {};
	this._scroll = false;
	this._autoScroll = autoscroll;
	this._scrollTouching = false;
    this._scrollLastTouchY = 0;
    this._scrollAccelY = 0;
	this._scrollMode = 0; // 0 = down, 1 = up
	this._scrollTimer = 0;
	this._scrollWait = scrollWait;
	this._scrollSpeed = scrollSpeed;
	this._decelerationRate = deceleration;
    this._neededHeight = 0;
	this._windowHeight = rect.height;
	this._heightMultiplier = heightMultiplier;
	this.createContents();
};
//-----------------------------------------------------------------------------
// Get contents height
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.contentsHeight = function() {
	let height = this._windowHeight * this._heightMultiplier;
	if(height > $cgmzTemp.getMaxCanvasSize()) {
		height = $cgmzTemp.getMaxCanvasSize();
	}
	return height;
};
//-----------------------------------------------------------------------------
// If refresh is requested
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.requestRefresh = function() {
    this.refresh();
	this._neededHeight += $gameSystem.windowPadding()*2;
	this.checkForScroll();
};
//-----------------------------------------------------------------------------
// Process Handling
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processHandling = function() {
    if (this.isActive()) {
        if (this.isCancelEnabled() && (Input.isRepeated('cancel') || TouchInput.isCancelled())) {
            this.processCancel();
		}
    }
};
//-----------------------------------------------------------------------------
// Process Cancel
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processCancel = function() {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};
//-----------------------------------------------------------------------------
// Update Input Data
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.updateInputData = function() {
    Input.update();
    TouchInput.update();
};
//-----------------------------------------------------------------------------
// Call Cancel Handler
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.callCancelHandler = function() {
    this.callHandler('cancel');
};
//-----------------------------------------------------------------------------
// Updates for scroll (if needed)
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.update = function() {
	Window_Base.prototype.update.call(this);
	this.processHandling();
	this.updateArrows();
	if(this._scroll) {
		this.processArrowKeys();
		this.processWheel();
		this.processTouch();
		this.updateScrollAccel();
		if(this._autoScroll) {
			if(this._scrollTimer > this._scrollWait) {
				this.updateScroll();
			}
			this._scrollTimer += 1;
		}
    }
};
//-----------------------------------------------------------------------------
// Update the automatic scroll effect
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.updateArrows = function() {
	this.downArrowVisible = (this.origin.y + this._windowHeight < this._neededHeight && this._scroll);
    this.upArrowVisible = this.origin.y > 0;
};
//-----------------------------------------------------------------------------
// Update the automatic scroll effect
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.updateScroll = function() {
	if(this.origin.y + this._windowHeight >= this._neededHeight && this._scrollMode == 0) {
		this._scrollMode = 1; // Scroll up
		this._scrollTimer = 0;
	}
	else if(this.origin.y <= 0 && this._scrollMode == 1) {
		this._scrollMode = 0; // Scroll down
		this._scrollTimer = 0;
	}
	else {
		const speed = (this._scrollMode == 1) ? -this._scrollSpeed : this._scrollSpeed;
		this.processScroll(speed);
	}
};
//-----------------------------------------------------------------------------
// Process Arrow Key Input
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processArrowKeys = function() {
    if(this.isActive()) {
        if(Input.isPressed('down')) {
            this.processScroll(this._scrollSpeed*5);
			this._scrollTimer = 0;
        }
        if(Input.isPressed('up')) {
            this.processScroll(-this._scrollSpeed*5);
			this._scrollTimer = 0;
        }
    }
};
//-----------------------------------------------------------------------------
// Process Wheel Input
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processWheel = function() {
    if (this.isActive()) {
        const threshold = 20;
        if (TouchInput.wheelY >= threshold) {
            this.processScroll(this._scrollSpeed*20);
			this._scrollTimer = 0;
        }
        if (TouchInput.wheelY <= -threshold) {
            this.processScroll(-this._scrollSpeed*20);
			this._scrollTimer = 0;
        }
    }
};
//-----------------------------------------------------------------------------
// Process Touch Scrolling
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processTouch = function() {
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        this.onTouchScrollStart();
    }
    if (this._scrollTouching) {
		this._scrollTimer = 0;
        if (TouchInput.isReleased()) {
            this.onTouchScrollEnd();
        } else if (TouchInput.isMoved()) {
            this.onTouchScroll();
        }
    }
};
//-----------------------------------------------------------------------------
// Determine if window has been touched inside the window frame
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.isTouchedInsideFrame = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.innerRect.contains(localPos.x, localPos.y);
};
//-----------------------------------------------------------------------------
// Processing for when window is touched
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.onTouchScrollStart = function() {
    this._scrollTouching = true;
    this._scrollLastTouchY = TouchInput.y;
    this.setScrollAccel(0, 0);
};
//-----------------------------------------------------------------------------
// Handling for current scroll via touch
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.onTouchScroll = function() {
    const accelY = this._scrollLastTouchY - TouchInput.y;
    this.setScrollAccel(accelY);
    this._scrollLastTouchY = TouchInput.y;
};
//-----------------------------------------------------------------------------
// Processing for letting go of touch scroll
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.onTouchScrollEnd = function() {
    this._scrollTouching = false;
};
//-----------------------------------------------------------------------------
// Update Scroll Acceleration
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.updateScrollAccel = function() {
    if(this._scrollAccelY !== 0) {
        this.processScroll(this._scrollAccelY);
        this._scrollAccelY *= this.getDecelerationRate();
        if(Math.abs(this._scrollAccelY) < 1) {
            this._scrollAccelY = 0;
        }
    }
};
//-----------------------------------------------------------------------------
// Get deceleration rate
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.getDecelerationRate = function() {
    return this._decelerationRate;
};
//-----------------------------------------------------------------------------
// Set x and y acceleration for scrolling
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.setScrollAccel = function(y) {
    this._scrollAccelY = y;
};
//-----------------------------------------------------------------------------
// Process scrolling
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.processScroll = function(scrollAmount) {
	if(this.origin.y + this._windowHeight + scrollAmount > this._neededHeight) {
		this.origin.y = this._neededHeight - this._windowHeight;
	}
	else if(this.origin.y + scrollAmount < 0) {
		this.origin.y = 0;
	}
	else {
		this._scrollMode = (scrollAmount < 0) ? 1 : 0;
		this.origin.y += scrollAmount;
	}
};
//-----------------------------------------------------------------------------
// Check if needs to scroll (might change after drawing contents because bitmap)
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.checkForScroll = function() {
	if(this._neededHeight > this._windowHeight) {
		this._scroll = true;
	}
};
//-----------------------------------------------------------------------------
// Reset variables for new object
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.setupWindowForNewEntry = function() {
	this.origin.y = 0;
	this._scrollTimer = 0;
	this._scrollMode = 0;
	this._neededHeight = 0;
    this._scrollLastTouchY = 0;
    this._scrollAccelY = 0;
	this._scroll = false;
	this._scrollTouching = false;
	this.contents.clear();
};
//-----------------------------------------------------------------------------
// Check if window is active
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.isActive = function() {
	return this.active;
};
//-----------------------------------------------------------------------------
// Set Handler same as Window_Selectable
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};
//-----------------------------------------------------------------------------
// check if is handled same as Window_Selectable
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};
//-----------------------------------------------------------------------------
// Call Handler same as Window_Selectable
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};
//-----------------------------------------------------------------------------
// Check if cancel handling exists
//-----------------------------------------------------------------------------
CGMZ_Window_Scrollable.prototype.isCancelEnabled = function() {
    return this.isHandled('cancel');
};
//=============================================================================
// CGMZ_Window_Selectable
//-----------------------------------------------------------------------------
// Window used by CGMZ Scripts to allow for categories within a selectable
// window which are expandable/minimizable. It also allows each item to
// define its own width/height, which may vary per item.
//=============================================================================
function CGMZ_Window_Selectable() {
    this.initialize(...arguments);
}
CGMZ_Window_Selectable.prototype = Object.create(Window_Selectable.prototype);
CGMZ_Window_Selectable.prototype.constructor = CGMZ_Window_Selectable;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
	this._category = null;
	this._data = [];
};
//-----------------------------------------------------------------------------
// Current item
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.item = function() {
	if(this._data && this.index() >= 0) return this._data[this.index()];
	return null;
};
//-----------------------------------------------------------------------------
// Level Adjustment for width / x offset
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.levelAdjustment = function(level) {
	return level * 8;
};
//-----------------------------------------------------------------------------
// Change width by index
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.itemWidth = function(index) {
	if(this._data[index] && this._data[index].hasOwnProperty("width")) {
		return this._data[index].width;
	}
	if(this._data[index] && this._data[index].hasOwnProperty("level")) {
		return Window_Selectable.prototype.itemWidth.call(this) - this.levelAdjustment(this._data[index].level);
	}
    return Window_Selectable.prototype.itemWidth.call(this);
};
//-----------------------------------------------------------------------------
// Change height by index
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.itemHeight = function(index = -1) {
	if(index >= 0 && this._data && this._data[index] && this._data[index].hasOwnProperty("height")) {
		return this._data[index].height;
	}
	if(index >= 0 && this._data && this._data[index] && this._data[index].hasOwnProperty("heightMultiplier")) {
		return Window_Scrollable.prototype.itemHeight.call(this) * this._data[index].heightMultiplier + 8;
	}
    return Window_Scrollable.prototype.itemHeight.call(this) + 8;
};
//-----------------------------------------------------------------------------
// Get item height of previous entries
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.itemHeightOfIndex = function(index) {
	let height = 0;
	for(i = 0; i < index; i++) {
		height += this.itemHeight(i);
	}
	return height;
};
//-----------------------------------------------------------------------------
// Get contents height
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.contentsHeight = function() {
    return this.innerHeight + this.itemHeight() * 2;
};
//-----------------------------------------------------------------------------
// Get overall height
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.overallHeight = function() {
    return this.itemHeightOfIndex(this.maxItems());
};
//-----------------------------------------------------------------------------
// Get top row
// TODO: Make this better, right now kind of hackish
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.topRow = function() {
	return Math.max(0, (Math.floor(this.scrollY() / this.itemHeight()) - 5));
};
//-----------------------------------------------------------------------------
// Get item rect
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.itemRect = function(index) {
	const level = (this._data && this._data[index] && this._data[index].hasOwnProperty('level')) ? this._data[index].level : 0;
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth(index);
    const itemHeight = this.itemHeight(index);
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = (col * itemWidth + colSpacing / 2 - this.scrollBaseX()) + this.levelAdjustment(level);
    const y = this.itemHeightOfIndex(index) + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};
//-----------------------------------------------------------------------------
// Ensure Cursor is Visible
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.ensureCursorVisible = function(smooth) {
    if (this._cursorAll) {
        this.scrollTo(0, 0);
    } else if (this.innerHeight > 0 && this.row() >= 0) {
        const scrollY = this.scrollY();
        const itemTop = this.itemHeightOfIndex(this.index());
        const itemBottom = itemTop + this.itemHeight(this.index());
        const scrollMin = itemBottom - this.innerHeight;
        if (scrollY > itemTop) {
            if (smooth) {
                this.smoothScrollTo(0, itemTop);
            } else {
                this.scrollTo(0, itemTop);
            }
        } else if (scrollY < scrollMin) {
            if (smooth) {
                this.smoothScrollTo(0, scrollMin);
            } else {
                this.scrollTo(0, scrollMin);
            }
        }
    }
};
//-----------------------------------------------------------------------------
// Pass index to drawing background rect for color differentiation
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.drawItemBackground = function(index) {
    const rect = this.itemRect(index);
    this.drawBackgroundRect(rect, index);
};
//-----------------------------------------------------------------------------
// Look for color property on index
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.drawBackgroundRect = function(rect, index) {
	const item = this.getPreviousCategoryItem(index);
	this.setNewCategory(item);
	if(!this._category) {
		Window_Selectable.prototype.drawBackgroundRect.call(this, rect);
		return;
	}
    const c1 = this._category._color1;
    const c2 = this._category._color2;
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    this.contentsBack.strokeRect(x, y, w, h, c1);
};
//-----------------------------------------------------------------------------
// Get the closest category with index smaller than current index
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.getPreviousCategoryItem = function(index) {
    for(let i = index; i >= 0; i--) {
		const item = this._data[i];
		if(item && item.isCategory) {
			return item;
		}
	}
	return null;
};
//-----------------------------------------------------------------------------
// Get the closest category with index smaller than current index
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.processOk = function() {
	const item = this.item();
	if(item && item.isCategory) {
		this.handleCategorySelection(item);
		this.playOkSound();
	} else {
		Window_Selectable.prototype.processOk.call(this);
	}
};
//-----------------------------------------------------------------------------
// Set new category. Used by individual instances to set category.
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.setNewCategory = function(item) {
    this._category = item;
};
//-----------------------------------------------------------------------------
// Handling for when category is selected and OK press occurs
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.handleCategorySelection = function(item) {
    // Used by plugins to minimize / expand category
};
//-----------------------------------------------------------------------------
// Always handle OK
//-----------------------------------------------------------------------------
CGMZ_Window_Selectable.prototype.isOkEnabled = function() {
    return true;
};
//=============================================================================
// Window_Base
//-----------------------------------------------------------------------------
// Adding functions for CGMZ Windows. Drawing gauges and text processing
//=============================================================================
//-----------------------------------------------------------------------------
// Use bitmap gauge - don't always need full sprite gauge
//-----------------------------------------------------------------------------
Window_Base.prototype.CGMZ_drawGauge = function(rect, rate, color1, color2, color0 = ColorManager.gaugeBackColor()) {
	const fillW = Math.floor((rect.width - 2) * rate);
    const fillH = rect.height - 2;
	this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color0);
    this.contents.gradientFillRect(rect.x + 1, rect.y + 1, fillW, fillH, color1, color2);
};
//-----------------------------------------------------------------------------
// Draw Header
//-----------------------------------------------------------------------------
Window_Base.prototype.CGMZ_drawHeader = function(header, y, color1 = 1, color2 = 0) {
	const textWidth = this.textWidth(header);
	const divWidth = this.contents.width / 2 - textWidth / 2 - $gameSystem.windowPadding() * 2;
	const rect1 = new Rectangle($gameSystem.windowPadding(), y + this.lineHeight() / 2, divWidth, 2);
	const rect2 = new Rectangle(this.contents.width / 2 + textWidth / 2 + $gameSystem.windowPadding(), y + this.lineHeight() / 2, divWidth, 2);
	this.CGMZ_drawDivider(rect1, ColorManager.textColor(color1), ColorManager.textColor(color2));
	this.CGMZ_drawDivider(rect2, ColorManager.textColor(color2), ColorManager.textColor(color1));
	this.drawText(header, 0, y, this.contents.width, 'center');
};
//-----------------------------------------------------------------------------
// Draw a divider / hr
//-----------------------------------------------------------------------------
Window_Base.prototype.CGMZ_drawDivider = function(rect, color1 = ColorManager.gaugeBackColor(), color2 = ColorManager.gaugeBackColor()) {
    this.contents.gradientFillRect(rect.x, rect.y, rect.width, rect.height, color1, color2);
};
//-----------------------------------------------------------------------------
// Draw a string of text with text codes and word wrapping.
// It can also handle a first-line offset.
// Returns the overall output height
//-----------------------------------------------------------------------------
Window_Base.prototype.CGMZ_drawText = function(string, x, firstLineX, y, width, alignment = "left") {
	this.resetFontSettings();
    const textState = this.createTextState(string, x, y, width);
	textState.drawing = false;
	textState.x = firstLineX;
	textState.lastSpaceIndex = 0;
	let additionalWidth = 0;
	while (textState.index < textState.text.length) {
		const c = textState.text[textState.index++];
		const tempFS = this.contents.fontSize;
		let neededWidth = additionalWidth + this.textWidth(textState.buffer) + this.textSizeEx(c).width * (c !== ' ');
		this.contents.fontSize = tempFS; // reset font size since textSizeEx resets font size.
		if(neededWidth > width && textState.lastSpaceIndex > 0) {
			textState.text = textState.text.substring(0, textState.lastSpaceIndex) + '\n' + textState.text.substring(textState.lastSpaceIndex + 1);
			textState.x = x;
			additionalWidth = 0;
		}
		if (c.charCodeAt(0) < 0x20) {
			this.flushTextState(textState);
			this.processControlCharacter(textState, c);
			additionalWidth = textState.x - x;
		} else if(c === " ") {
			textState.buffer += c;
			this.flushTextState(textState);
			textState.lastSpaceIndex = textState.index - 1;
			additionalWidth = textState.x - x;
		} else {
			textState.buffer += c;
		}
	}
	switch(alignment) {
		case "left":
			const textState2 = this.createTextState(textState.text, x, y, width);
			textState2.x = firstLineX;
			this.processAllText(textState2);
			return textState2.outputHeight;
		case "center":
		case "right":
			let totalHeight = 0;
			let firstLine = true;
			const lines = textState.text.split("\n");
			for(line of lines) {
				const textState2 = this.createTextState(line, x, y + totalHeight, width);
				const color = this.contents.textColor;
				const fs = this.contents.fontSize;
				const textWidth = this.textSizeEx(line).width;
				this.contents.textColor = color;
				this.contents.fontSize = fs;
				if(alignment === "right") textState2.x = width + textState2.x - textWidth;
				if(alignment === "center") textState2.x += (width - textWidth) / 2;
				if(firstLine && (firstLineX > textState2.x)) textState2.x = firstLineX;
				firstLine = false;
				this.processAllText(textState2);
				totalHeight += textState2.outputHeight;
			}
			return totalHeight;
	}
	return 0;
};
//-----------------------------------------------------------------------------
// Draw one line of string of text with any character codes.
// While \n IS supported, it is not recommended for this function since it assumes only one line will be drawn
// It can also handle an x offset.
// Returns the output height of the line drawn
//-----------------------------------------------------------------------------
Window_Base.prototype.CGMZ_drawTextLine = function(string, x, y, width, alignment = "left") {
	this.resetFontSettings();
	const textState = this.createTextState(string, x, y, width);
	const textWidth = this.textSizeEx(string).width;
	switch(alignment) {
		case "center":
			textState.x = width + textState.x - textWidth;
			textState.x = (textState.x / 2) + (x / 2);
			break;
		case "right":
			textState.x = width + textState.x - textWidth;
			if(textState.x < x) textState.x = x;
	}
	this.processAllText(textState);
	return textState.outputHeight;
};
//=============================================================================
// Spriteset_Map
//-----------------------------------------------------------------------------
// Add cgmz animations
//=============================================================================
//-----------------------------------------------------------------------------
// Alias. Also init cgmz animation array
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
Spriteset_Map.prototype.initialize = function() {
    alias_CGMZ_Core_Spriteset_Map_initialize.call(this);
    this._cgmzAnimations = [];
};
//-----------------------------------------------------------------------------
// Alias. Also Update cgmz animations
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
    alias_CGMZ_Core_Spriteset_Map_update.call(this);
    this.updateCGMZAnimations();
};
//-----------------------------------------------------------------------------
// Alias. Also remove all cgmz animations
//-----------------------------------------------------------------------------
const alias_CGMZ_Core_Spriteset_Map_destroy = Spriteset_Map.prototype.destroy;
Spriteset_Map.prototype.destroy = function(options) {
    this.removeAllCGMZAnimations();
    alias_CGMZ_Core_Spriteset_Map_destroy.call(this, options);
};
//-----------------------------------------------------------------------------
// Update cgmz animations
//-----------------------------------------------------------------------------
Spriteset_Map.prototype.updateCGMZAnimations = function() {
    for(const sprite of this._cgmzAnimations) {
        if (!sprite.isPlaying()) {
            this.removeCGMZAnimation(sprite);
        }
    }
    this.processCGMZAnimationRequests();
};
//-----------------------------------------------------------------------------
// Process new animation requests
//-----------------------------------------------------------------------------
Spriteset_Map.prototype.processCGMZAnimationRequests = function() {
    for(;;) {
        const request = $cgmzTemp.retrieveMapAnimationRequest();
        if (request) {
            this.createCGMZAnimation(request);
        } else {
            break;
        }
    }
};
//-----------------------------------------------------------------------------
// Create a new CGMZ animation
//-----------------------------------------------------------------------------
Spriteset_Map.prototype.createCGMZAnimation = function(request) {
	const sprite = new Sprite_CGMZ_MapAnimation(request);
	this._effectsContainer.addChild(sprite);
	this._cgmzAnimations.push(sprite);
};
//-----------------------------------------------------------------------------
// Remove a CGMZ animation
//-----------------------------------------------------------------------------
Spriteset_Map.prototype.removeCGMZAnimation = function(sprite) {
    this._cgmzAnimations.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    sprite.destroy();
};
//-----------------------------------------------------------------------------
// Remove all CGMZ animations
//-----------------------------------------------------------------------------
Spriteset_Map.prototype.removeAllCGMZAnimations = function() {
    for(const sprite of this._cgmzAnimations.clone()) {
        this.removeCGMZAnimation(sprite);
    }
};
//=============================================================================
// Sprite_CGMZ_MapAnimation
//-----------------------------------------------------------------------------
// Sprite class for basic map animations
//=============================================================================
function Sprite_CGMZ_MapAnimation() {
    this.initialize(...arguments);
}
Sprite_CGMZ_MapAnimation.prototype = Object.create(Sprite.prototype);
Sprite_CGMZ_MapAnimation.prototype.constructor = Sprite_CGMZ_MapAnimation;
//-----------------------------------------------------------------------------
// Initialize the sprite
// request should have:
// bitmap - Object with folder and filename properties to load the image with
// x - x coordinate (tile) of animation center
// y - y coordinate (tile) of animation center
// frameWidth - width of 1 animation cell
// frameHeight - height of 1 animation cell
// animationSpeed - how many frames to wait before swapping animation cells
// options - custom options to alter sprite behavior
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.initialize = function(request) {
    Sprite.prototype.initialize.call(this);
	this._isPlaying = true;
	this._needsUpdate = false;
	this._waitCounter = 0;
	this._currentFrame = 0;
	this._maxFrames = 0;
	this.anchor.x = 0.5;
    this.anchor.y = 0.5;
	this._request = request;
	this.startBitmapLoad(request.bitmap);
};
//-----------------------------------------------------------------------------
// Start loading the bitmap
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.startBitmapLoad = function(bitmap) {
	this._bitmap = ImageManager.loadBitmap(bitmap.folder, bitmap.filename);
	this._bitmap.addLoadListener(this.onImageLoaded.bind(this));
};
//-----------------------------------------------------------------------------
// After bitmap is loaded
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.onImageLoaded = function() {
	this.calculateMaxFrames();
	this._needsUpdate = true;
	const pw = this._request.frameWidth;
	const ph = this._request.frameHeight;
	const sx = 0;
	const sy = 0;
    this.setFrame(sx, sy, pw, ph);
};
//-----------------------------------------------------------------------------
// Calculate max amount of frames
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.calculateMaxFrames = function() {
	this._maxFrames = Math.floor(this._bitmap.width / this._request.frameWidth);
};
//-----------------------------------------------------------------------------
// Check if sprite is still playing
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.isPlaying = function() {
	return this._isPlaying;
};
//-----------------------------------------------------------------------------
// Update sprite
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.update = function() {
    Sprite.prototype.update.call(this);
	if(this._needsUpdate) {
		this.updateFrame();
		this.updatePosition();
	}
};
//-----------------------------------------------------------------------------
// Update frame of animation
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.updateFrame = function() {
	this._waitCounter++;
	if(this._waitCounter > this._request.animationSpeed) {
		if(this._currentFrame + 1 > this._maxFrames) {
			this._isPlaying = false;
			return;
		}
		this._waitCounter = 0;
		this._currentFrame++;
		const pw = this._request.frameWidth;
		const ph = this._request.frameHeight;
		const sx = this._currentFrame * pw;
		const sy = 0;
        this.setFrame(sx, sy, pw, ph);
	}
};
//-----------------------------------------------------------------------------
// Update position of sprite on screen
//-----------------------------------------------------------------------------
Sprite_CGMZ_MapAnimation.prototype.updatePosition = function() {
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	this.x = Math.floor($gameMap.adjustX(this._request.x) * tw + tw / 2);
    this.y = Math.floor($gameMap.adjustY(this._request.y) * th + th / 2);
};
//=============================================================================
// Input
//-----------------------------------------------------------------------------
// Pass input keycodes to CGMZ Temp
//=============================================================================
//-----------------------------------------------------------------------------
// Pass Inputs to CGMZ Temp
//-----------------------------------------------------------------------------
const CGMZ_Core_Input_onKeyDown = Input._onKeyDown;
Input._onKeyDown = function(event) {
    CGMZ_Core_Input_onKeyDown.call(this, event);
	if($cgmzTemp) $cgmzTemp.onKeyDown(event);
};
//-----------------------------------------------------------------------------
// Pass Inputs to CGMZ Temp
//-----------------------------------------------------------------------------
const CGMZ_Core_Input_onKeyUp = Input._onKeyUp;
Input._onKeyUp = function(event) {
    CGMZ_Core_Input_onKeyUp.call(this, event);
	if($cgmzTemp) $cgmzTemp.onKeyUp(event);
};
//-----------------------------------------------------------------------------
// Also clear CGMZ Input
//-----------------------------------------------------------------------------
const CGMZ_Core_Input_onLostFocus = Input._onLostFocus;
Input._onLostFocus = function() {
    CGMZ_Core_Input_onLostFocus.call(this);
	if($cgmzTemp) $cgmzTemp.inputClear();
};
//=============================================================================
// Game_Temp
//-----------------------------------------------------------------------------
// Simulate production environment parameter
//=============================================================================
//-----------------------------------------------------------------------------
// Alias. Always pass false if simulating production
//-----------------------------------------------------------------------------
const CGMZ_Core_GameTemp_isPlaytest = Game_Temp.prototype.isPlaytest;
Game_Temp.prototype.isPlaytest = function() {
	return (CGMZ.Core.SimulateProductionEnv) ? false : CGMZ_Core_GameTemp_isPlaytest.call(this);
};