/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/savefile/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc Changes the default save / load screens
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.0.2
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.2.1
 * ----------------------------------------------------------------------------
 * Description: This plugin modifies the save / load screens to show more
 * game information as well as providing additional customization options.
 * ----------------------------------------------------------------------------
 * Documentation:
 * If using a save image:
 * Image Dimensions (default resolution) are 582 x 160
 * Image height can be changed in parameters below
 * Images should be placed in the "pictures" folder
 * To set the save image for each map, use note tag <cgmzsaveimg:yourImage>
 *
 * To set location, use note tag <cgmzname:yourName>
 *
 * The custom save data are game variables. To assign a game variable to store
 * text, use the script call:
 * $gameVariables.setValue(13, "The Hero Returns");
 * where 13 would be the variable id, and the string would be what shows up on
 * the save screen.
 *
 * Update History:
 * Version 1.0.0 - Initial Release
 *
 * Version 1.0.1:
 * - Added ability to change the color of header / label text
 * - Added ability to change opacity of the black rectangle behind location info
 * - Now compatible with VS core
 * - Fix for location overlapping when no image
 * - Fix for image height ignoring height parameter
 *
 * Version 1.0.2:
 * - Fix for image height being stuck at 160px
 *
 * @param Autosave Options
 * 
 * @param Show Autosave in Save Mode
 * @parent Autosave Options
 * @type boolean
 * @desc Show autosave in the save screen?
 * @default false
 *
 * @param File Options
 *
 * @param Max Save Files
 * @parent File Options
 * @type number
 * @min 1
 * @desc Change the number of files the player can select
 * @default 20
 *
 * @param File Icon Unused
 * @parent File Options
 * @type number
 * @min -1
 * @desc Icon ID to show next to a File that has no save data. Set to -1 for no icon
 * @default 229
 *
 * @param File Icon Used
 * @parent File Options
 * @type number
 * @min -1
 * @desc Icon ID to show next to a File that hassave data. Set to -1 for no icon
 * @default 230
 *
 * @param Image Options
 *
 * @param Show Image
 * @parent Image Options
 * @type boolean
 * @desc Show an image in the save screen?
 * @default true
 *
 * @param Default Image
 * @parent Image Options
 * @type file
 * @dir img/pictures
 * @desc Default image to show (if showing images) if no other image exists
 *
 * @param Image Height
 * @parent Image Options
 * @type number
 * @desc Height of the image to display
 * @default 160
 *
 * @param Location Fade Opacity
 * @parent Image Options
 * @type number
 * @desc Opacity (0-255) of the black rectangle behind the location
 * @default 120
 * 
 * @param Custom Options
 * 
 * @param Custom Save Variables
 * @parent Custom Options
 * @type struct<CustomSaveInfo>[]
 * @desc Set up custom save variables here
 * @default []
 * 
 * @param Display Options
 *
 * @param Show Faces
 * @parent Display Options
 * @type boolean
 * @default true
 * @desc Whether to show faces or charset sprites
 *
 * @param Header Color
 * @parent Display Options
 * @type number
 * @default 16
 * @min 0
 * @desc The color to use for information headers (example - location: or gold:)
 *
 * @param Text Options
 * 
 * @param Empty Text
 * @parent Text Options
 * @desc Text to show when no save file information exists
 * @default No save data exists.
 * 
 * @param Location Text
 * @parent Text Options
 * @desc Text to describe the "location" string
 * @default Location: 
 * 
 * @param Playtime Text
 * @parent Text Options
 * @desc Text to describe the "playtime" string
 * @default Playtime: 
 * 
 * @param Gold Text
 * @parent Text Options
 * @desc Text to describe the "gold" string
 * @default Gold: 
 * 
 * @param Level Text
 * @parent Text Options
 * @desc Text to describe the "level" string
 * @default Lv.  
*/
/*~struct~CustomSaveInfo:
 * @param Variable
 * @type variable
 * @desc The variable value to show as a custom option in the save screen
 *
 * @param Description
 * @desc The text to describe the variable (ex: Chapter: )
 *
 * @param Trailing Text
 * @desc Text to show after the variable (ex: %)
 *
 * @param Icon
 * @type number
 * @min -1
 * @desc The icon to show next to the variable. Set to -1 to not use
 * @default -1
*/
var Imported = Imported || {};
Imported.CGMZ_SaveFile = true;
var CGMZ = CGMZ || {};
CGMZ.Versions = CGMZ.Versions || {};
CGMZ.Versions["Save File"] = "1.0.2";
CGMZ.SaveFile = CGMZ.SaveFile || {};
CGMZ.SaveFile.parameters = PluginManager.parameters('CGMZ_SaveFile');
CGMZ.SaveFile.CustomSaveInfo = JSON.parse(CGMZ.SaveFile.parameters["Custom Save Variables"]);
CGMZ.SaveFile.ShowAutosaveInSaveMode = (CGMZ.SaveFile.parameters["Show Autosave in Save Mode"] === "true");
CGMZ.SaveFile.ShowImage = (CGMZ.SaveFile.parameters["Show Image"] === "true");
CGMZ.SaveFile.ShowFaces = (CGMZ.SaveFile.parameters["Show Faces"] === "true");
CGMZ.SaveFile.MaxSaveFiles = Number(CGMZ.SaveFile.parameters["Max Save Files"]);
CGMZ.SaveFile.SaveIconUsed = Number(CGMZ.SaveFile.parameters["File Icon Used"]);
CGMZ.SaveFile.SaveIconUnused = Number(CGMZ.SaveFile.parameters["File Icon Unused"]);
CGMZ.SaveFile.ImageHeight = Number(CGMZ.SaveFile.parameters["Image Height"]);
CGMZ.SaveFile.FadeSpriteOpacity = Number(CGMZ.SaveFile.parameters["Location Fade Opacity"]);
CGMZ.SaveFile.HeaderColor = Number(CGMZ.SaveFile.parameters["Header Color"]);
CGMZ.SaveFile.DefaultImage = CGMZ.SaveFile.parameters["Default Image"];
CGMZ.SaveFile.EmptyText = CGMZ.SaveFile.parameters["Empty Text"];
CGMZ.SaveFile.LocationText = CGMZ.SaveFile.parameters["Location Text"];
CGMZ.SaveFile.PlaytimeText = CGMZ.SaveFile.parameters["Playtime Text"];
CGMZ.SaveFile.GoldText = CGMZ.SaveFile.parameters["Gold Text"];
CGMZ.SaveFile.LevelText = CGMZ.SaveFile.parameters["Level Text"];
//=============================================================================
// Game_Map
//-----------------------------------------------------------------------------
// Add function for getting map save file image
//=============================================================================
//-----------------------------------------------------------------------------
// Get CGMZ Save File Image url
//-----------------------------------------------------------------------------
Game_Map.prototype.CGMZ_SaveFile_getImage = function() {
    let url = "";
	if($dataMap.meta.cgmzsaveimg) {
		url = $dataMap.meta.cgmzsaveimg;
	}
	return url;
};
//=============================================================================
// Game_Party
//-----------------------------------------------------------------------------
// Add more to each actor's save info
//=============================================================================
//-----------------------------------------------------------------------------
// Get CGMZ Save File actor info
//-----------------------------------------------------------------------------
Game_Party.prototype.CGMZ_SaveFile_actorInfoForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.name(),
        actor._level
    ]);
};
//=============================================================================
// DataManager
//-----------------------------------------------------------------------------
// Change max save file count and save file info
//=============================================================================
//-----------------------------------------------------------------------------
// OVERWRITE. Change max save files
//-----------------------------------------------------------------------------
DataManager.maxSavefiles = function() {
    return CGMZ.SaveFile.MaxSaveFiles;
};
//-----------------------------------------------------------------------------
// Alias. Add additional save file info
//-----------------------------------------------------------------------------
const alias_CGMZ_SaveFile_DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function() {
    const info = alias_CGMZ_SaveFile_DataManager_makeSavefileInfo.call(this);
    info.cgmz_mapName = $gameMap.CGMZ_getMapName();
	info.cgmz_gold = $gameParty.gold();
	info.cgmz_image = $gameMap.CGMZ_SaveFile_getImage();
	info.cgmz_actor = $gameParty.CGMZ_SaveFile_actorInfoForSavefile();
	if(CGMZ.SaveFile.CustomSaveInfo.length > 0) {
		info.cgmz_custom = {};
		CGMZ.SaveFile.CustomSaveInfo.forEach(customInfo => {
			const data = JSON.parse(customInfo);
			const variable = Number(data.Variable);
			info.cgmz_custom[variable] = $gameVariables.value(variable);
		});
	}
    return info;
};
//=============================================================================
// Window_SavefileList
//-----------------------------------------------------------------------------
// Do not include autosave if save mode and option disabled
//=============================================================================
//-----------------------------------------------------------------------------
// Alias. Do not include autosave if in save mode (optional)
//-----------------------------------------------------------------------------
const alias_CGMZ_SaveFile_WindowSavefileList_setMode = Window_SavefileList.prototype.setMode;
Window_SavefileList.prototype.setMode = function(mode, autosave) {
	if(mode === "save" && !CGMZ.SaveFile.ShowAutosaveInSaveMode) {
		autosave = false;
	}
	alias_CGMZ_SaveFile_WindowSavefileList_setMode.call(this, mode, autosave);
};
//-----------------------------------------------------------------------------
// OVERWRITE. Draw the item
//-----------------------------------------------------------------------------
Window_SavefileList.prototype.drawItem = function(index) {
    const savefileId = this.indexToSavefileId(index);
    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.changePaintOpacity(this.isEnabled(savefileId));
	if(!!DataManager.savefileInfo(savefileId) && CGMZ.SaveFile.SaveIconUsed >= 0) {
		this.drawIcon(CGMZ.SaveFile.SaveIconUsed, rect.x, rect.y + 4);
		rect.x += ImageManager.iconWidth + 4;
	} else if(!DataManager.savefileInfo(savefileId) && CGMZ.SaveFile.SaveIconUsed >= 0) {
		this.drawIcon(CGMZ.SaveFile.SaveIconUnused, rect.x, rect.y + 4);
		rect.x += ImageManager.iconWidth + 4;
	}
    this.drawTitle(savefileId, rect.x, rect.y + 4);
};
//-----------------------------------------------------------------------------
// OVERWRITE. Change item height back to default
//-----------------------------------------------------------------------------
Window_SavefileList.prototype.itemHeight = function() {
    return Window_Selectable.prototype.itemHeight.call(this);
};
//-----------------------------------------------------------------------------
// Set Help Window
//-----------------------------------------------------------------------------
Window_SavefileList.prototype.CGMZ_SaveFile_setDisplayWindow = function(displayWindow) {
    this._CGMZ_SaveFile_displayWindow = displayWindow;
	this.callUpdateHelp();
};
//-----------------------------------------------------------------------------
// Update display window if exists
//-----------------------------------------------------------------------------
Window_SavefileList.prototype.callUpdateHelp = function() {
    if(this._CGMZ_SaveFile_displayWindow) {
		const savefileId = this.indexToSavefileId(this.index());
		const info = DataManager.savefileInfo(savefileId);
		this._CGMZ_SaveFile_displayWindow.setInfo(info);
	}
};
//=============================================================================
// Scene_File
//-----------------------------------------------------------------------------
// Shrink list window and display new display window
//=============================================================================
//-----------------------------------------------------------------------------
// Alias. Also create save file display window
//-----------------------------------------------------------------------------
const alias_CGMZ_SaveFile_SceneFile_create = Scene_File.prototype.create;
Scene_File.prototype.create = function() {
    alias_CGMZ_SaveFile_SceneFile_create.call(this);
	this.CGMZ_SaveFile_createDisplayWindow();
};
//-----------------------------------------------------------------------------
// Alias. Change width of save file select window
//-----------------------------------------------------------------------------
const alias_CGMZ_SaveFile_SceneFile_listWindowRect = Scene_File.prototype.listWindowRect;
Scene_File.prototype.listWindowRect = function() {
	const rect = alias_CGMZ_SaveFile_SceneFile_listWindowRect.call(this);
	rect.width = Graphics.boxWidth / 4;
    return rect;
};
//-----------------------------------------------------------------------------
// VS compatibility. Seems their core doesn't call above default function ¯\_(ツ)_/¯
//-----------------------------------------------------------------------------
const alias_CGMZ_SaveFile_SceneFile_createListWindow = Scene_File.prototype.createListWindow;
Scene_File.prototype.createListWindow = function() {
    alias_CGMZ_SaveFile_SceneFile_createListWindow.call(this);
	this._listWindow.width = Graphics.boxWidth / 4;
};
//-----------------------------------------------------------------------------
// Create display window
//-----------------------------------------------------------------------------
Scene_File.prototype.CGMZ_SaveFile_createDisplayWindow = function() {
	const rect = this.CGMZ_SaveFile_displayWindowRect();
	this._CGMZ_SaveFile_displayWindow = new CGMZ_Window_SaveFileDisplay(rect);
	this.addWindow(this._CGMZ_SaveFile_displayWindow);
	this._listWindow.CGMZ_SaveFile_setDisplayWindow(this._CGMZ_SaveFile_displayWindow);
};
//-----------------------------------------------------------------------------
// Display window rect
//-----------------------------------------------------------------------------
Scene_File.prototype.CGMZ_SaveFile_displayWindowRect = function() {
	const x = this._listWindow.width;
	const y = this._listWindow.y;
	const width = Graphics.boxWidth - this._listWindow.width;
	const height = this._listWindow.height;
	return new Rectangle(x, y, width, height);
};
//=============================================================================
// CGMZ_Window_SaveFileDisplay
//-----------------------------------------------------------------------------
// Display save file info
//=============================================================================
function CGMZ_Window_SaveFileDisplay(rect) {
    this.initialize.apply(this, arguments);
}
CGMZ_Window_SaveFileDisplay.prototype = Object.create(Window_Base.prototype);
CGMZ_Window_SaveFileDisplay.prototype.constructor = CGMZ_Window_SaveFileDisplay;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
	this._info = null;
	this.initSprites();
	this.refresh();
};
//-----------------------------------------------------------------------------
// Initialize sprites
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.initSprites = function() {
	this._saveSprite = new Sprite();
	this._saveSprite.width = this.contents.width;
	this._saveSprite.height = CGMZ.SaveFile.ImageHeight;
	this._saveSpriteFade = new Sprite();
	this._saveSpriteFade.width = this.contents.width;
	this._saveSpriteFade.height = this.contents.height;
	this._saveSpriteFade.bitmap = new Bitmap(this._saveSpriteFade.width, this._saveSpriteFade.height);
	this._saveSpriteFade.bitmap.paintOpacity = CGMZ.SaveFile.FadeSpriteOpacity;
	this._saveSprite.x = $gameSystem.windowPadding();
	this._saveSprite.y = $gameSystem.windowPadding();
	this._saveSpriteFade.x = $gameSystem.windowPadding();
	this._saveSpriteFade.y = $gameSystem.windowPadding();
	this.addChildToBack(this._saveSpriteFade);
	this.addChildToBack(this._saveSprite);
};
//-----------------------------------------------------------------------------
// Refresh
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.refresh = function() {
	this.contents.clear();
	this.contentsBack.clear();
	if(this._info) {
		this.drawSaveFileInfo();
	} else {
		this.drawEmptyInfo();
	}
};
//-----------------------------------------------------------------------------
// Set save file info object (might also be null if save file not exists)
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.setInfo = function(info) {
	this._info = info;
	this.refresh();
};
//-----------------------------------------------------------------------------
// Draw empty save file information
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawEmptyInfo = function() {
	this._saveSprite.hide();
	this._saveSpriteFade.hide();
	this.drawText(CGMZ.SaveFile.EmptyText, 0, 0, this.contents.width, 'center');
};
//-----------------------------------------------------------------------------
// Draw save file information
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawSaveFileInfo = function() {
	let y = 0;
	if(CGMZ.SaveFile.ShowImage) {
		const url = this._info.cgmz_image || CGMZ.SaveFile.DefaultImage;
		this._saveSprite.bitmap = ImageManager.loadPicture(url);
		this._saveSprite.bitmap.addLoadListener(this.setBitmapHeight.bind(this));
		this._saveSpriteFade.show();
		y += this._saveSprite.height - this.lineHeight();
		this.drawLocationInfo(4, y);
		y += this.lineHeight();
	} else {
		this.drawLocationInfo(0, this.lineHeight());
	}
	this.drawTimeInfo(0, y);
	y += (CGMZ.SaveFile.ShowImage) ? this.lineHeight() : this.lineHeight()*2;
	this.drawGoldInfo(0, y);
	y += this.lineHeight();
	if(CGMZ.SaveFile.CustomSaveInfo.length > 0 && this._info.cgmz_custom) {
		y = this.drawCustomInfo(0, y);
	}
	if(CGMZ.SaveFile.ShowFaces) {
		this.drawFaces(0, y);
	} else {
		this.drawChars(0, y);
	}
};
//-----------------------------------------------------------------------------
// Set the sprite height after load
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.setBitmapHeight = function() {
	this._saveSprite.height = CGMZ.SaveFile.ImageHeight;
	this._saveSprite.show();
};
//-----------------------------------------------------------------------------
// Draw location info
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawLocationInfo = function(x, y) {
	this.changeTextColor(ColorManager.textColor(CGMZ.SaveFile.HeaderColor));
	this.drawText(CGMZ.SaveFile.LocationText, x, y, this.contents.width);
	this.resetTextColor();
	x += this.textWidth(CGMZ.SaveFile.LocationText);
	this.drawText(this._info.cgmz_mapName, x, y, this.contents.width - x);
	if(CGMZ.SaveFile.ShowImage) {
		x += this.textWidth(this._info.cgmz_mapName) + 4;
		this._saveSpriteFade.bitmap.clear();
		this._saveSpriteFade.bitmap.fillRect(0, y, x, this.lineHeight(), "#000000");
	}
};
//-----------------------------------------------------------------------------
// Draw time info
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawTimeInfo = function(x, y) {
	const date = new Date(this._info.timestamp);
	this.drawText(date.toLocaleDateString(), x, y, this.contents.width, 'right');
	this.changeTextColor(ColorManager.textColor(CGMZ.SaveFile.HeaderColor));
	this.drawText(CGMZ.SaveFile.PlaytimeText, x, y, this.contents.width);
	this.resetTextColor();
	x += this.textWidth(CGMZ.SaveFile.PlaytimeText);
	this.drawText(this._info.playtime, x, y, this.contents.width - x);
};
//-----------------------------------------------------------------------------
// Draw gold info
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawGoldInfo = function(x, y) {
	this.changeTextColor(ColorManager.textColor(CGMZ.SaveFile.HeaderColor));
	this.drawText(CGMZ.SaveFile.GoldText, x, y, this.contents.width);
	this.resetTextColor();
	x += this.textWidth(CGMZ.SaveFile.GoldText);
	let gold = this._info.cgmz_gold;
	if(this._info.cgmz_gold) gold = gold.toLocaleString();
	this.drawText(gold, x, y, this.contents.width - x);
};
//-----------------------------------------------------------------------------
// Draw custom save info. Returns y value due to variable data amounts
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawCustomInfo = function(x, y) {
	const startX = x;
	CGMZ.SaveFile.CustomSaveInfo.forEach(customInfo => {
		const info = JSON.parse(customInfo);
		const variable = Number(info.Variable);
		if(typeof(this._info.cgmz_custom[variable]) !== 'undefined') {
			this.changeTextColor(ColorManager.textColor(CGMZ.SaveFile.HeaderColor));
			this.drawText(info.Description, x, y, this.contents.width);
			x += this.textWidth(info.Description);
			if(Number(info.Icon) >= 0) {
				this.drawIcon(Number(info.Icon), x, y);
				x += ImageManager.iconWidth + 4;
			}
			this.resetTextColor();
			this.drawText(this._info.cgmz_custom[variable].toString(), x, y, this.contents.width - x);
			x += this.textWidth(this._info.cgmz_custom[variable].toString());
			this.drawText(info["Trailing Text"], x, y, this.contents.width - x);
			y += this.lineHeight();
			x = startX;
		}
	});
	return y;
};
//-----------------------------------------------------------------------------
// Load face and info
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawFaces = function(x, y) {
	const width = this.contents.width / 4;
	for(let i = 0; i < this._info.faces.length; i++) {
		const faceName = this._info.faces[i][0];
		const faceIndex = this._info.faces[i][1];
		const bitmap = ImageManager.loadFace(faceName);
		const args = {"name": faceName, "index": faceIndex, "x": x, "y": y, "width": width};
		if(this._info.cgmz_actor && this._info.cgmz_actor[i]) {
			args.actorName = this._info.cgmz_actor[i][0];
			args.actorLevel = this._info.cgmz_actor[i][1];
		}
		bitmap.addLoadListener(this.onFaceLoaded.bind(this, args));
		x += width;
	}
};
//-----------------------------------------------------------------------------
// Draw face & info after loaded
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.onFaceLoaded = function(args) {
	this.drawFace(args.name, args.index, args.x, args.y, args.width);
	const y = args.y + ImageManager.faceHeight - this.lineHeight();
	this.contents.fontBold = true;
	this.contents.outlineWidth = 6;
	this.drawText(args.actorName, args.x, args.y, args.width, "center");
	this.drawText(CGMZ.SaveFile.LevelText + args.actorLevel, args.x, y, args.width, "right");
	this.contents.fontBold = false;
	this.contents.outlineWidth = 3;
};
//-----------------------------------------------------------------------------
// Load characters and info
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.drawChars = function(x, y) {
	const width = this.contents.width / 4;
	for(let i = 0; i < this._info.characters.length; i++) {
		const charName = this._info.characters[i][0];
		const charIndex = this._info.characters[i][1];
		const bitmap = ImageManager.loadCharacter(charName);
		const args = {"name": charName, "index": charIndex, "x": x, "y": y, "width": width};
		if(this._info.cgmz_actor && this._info.cgmz_actor[i]) {
			args.actorName = this._info.cgmz_actor[i][0];
			args.actorLevel = this._info.cgmz_actor[i][1];
		}
		bitmap.addLoadListener(this.onCharLoaded.bind(this, args));
		x += width;
	}
};
//-----------------------------------------------------------------------------
// Draw character & info after loaded
//-----------------------------------------------------------------------------
CGMZ_Window_SaveFileDisplay.prototype.onCharLoaded = function(args) {
	this.drawCharacter(args.name, args.index, args.x + args.width / 2, args.y + this.lineHeight()*2);
	const y = args.y + ImageManager.faceHeight - this.lineHeight();
	this.makeFontSmaller();
	this.contents.outlineWidth = 4;
	this.drawText(args.actorName, args.x, args.y, args.width, "center");
	this.drawText(CGMZ.SaveFile.LevelText + args.actorLevel, args.x, args.y + this.lineHeight()*1.5, args.width, "center");
	this.contents.outlineWidth = 3;
	this.makeFontBigger();
};