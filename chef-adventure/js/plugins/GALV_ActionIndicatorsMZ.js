//-----------------------------------------------------------------------------
//  Galv's Action Indicators MZ
//-----------------------------------------------------------------------------
//  For: RPGMAKER MZ
//  Galv.ActionIndicatorsMZ.js
//-----------------------------------------------------------------------------
//  2021-01-02 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_ActionIndicators = true;

var Galv = Galv || {};        // Galv's main object
Galv.AI = Galv.AI || {};      // Plugin Object
Galv.AI.pluginName = "Galv_ActionIndicatorsMZ";

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.0) Display an icon when the player is able to interact with an event. View help for comment tag.
 * @url http://galvs-scripts.com
 * @target MZ
 * @author Galv
 *
 * @param yOffset
 * @name Y Offset
 * @desc Pixel offset for icon's Y position
 * @default -10
 *
 * @param zPosition
 * @name Z Position
 * @desc The Z position (controls if it appears over/under map objects)
 * @default 5
 *
 * @param autoHide
 * @name Auto Hide
 * @desc true or false. If true, icons will disappear when an event is running
 * @type boolean
 * @on YES
 * @off NO
 * @default true
 *
 * @param iconOpacity
 * @name Icon Opacity
 * @desc 0-255. The opacity of the icon
 * @type number
 * @default 200
 *
 * @help
 *   Galv's Action Indicators
 * ----------------------------------------------------------------------------
 * This plugin will enable you to display an icon when the player is facing an
 * event that has the below code in a 'comment' command anywhere in the active
 * event page.
 *
 *
 *   <actionIcon: id,yo>      // The code to use in a COMMENT within an event
 *                            // id = the icon ID to use for the indicator
 *                            // yo = the y offset in pixels for the indicator
 *
 *
 * This plugin only does ONE icon above a single event that the player is
 * facing, the idea being to give the player an indication they can press the
 * action key to action with what they are looking at.
 * It is not designed for multiple icons over events.
 *
 * ----------------------------------------------------------------------------
 *  PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *
 *    Galv.AI.status(x);    // x is true or false
 *   
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

Galv.AI.params = PluginManager.parameters(Galv.AI.pluginName);
Galv.AI.y = Number(Galv.AI.params["yOffset"]);
Galv.AI.z = Number(Galv.AI.params["zPosition"]);
Galv.AI.opacity = Number(Galv.AI.params["iconOpacity"]);
Galv.AI.autoHide = eval(Galv.AI.params["autoHide"]);
Galv.AI.needRefresh = false;

Galv.AI.status = function(status) {
	$gameSystem.actionIndicatorVisible = status;
};

Galv.AI.checkActionIcon = function() {
	const x2 = $gameMap.roundXWithDirection($gamePlayer._x, $gamePlayer._direction);
    const y2 = $gameMap.roundYWithDirection($gamePlayer._y, $gamePlayer._direction);
	let action = null;
	
	// CHECK EVENT STANDING ON
	$gameMap.eventsXy($gamePlayer._x, $gamePlayer._y).forEach(function(event) {
		action = Galv.AI.checkEventForIcon(event);
	});
	
	// CHECK EVENT IN FRONT
	if (!action) {
		$gameMap.eventsXy(x2, y2).forEach(function(event) {
			if (event.isNormalPriority()) action = Galv.AI.checkEventForIcon(event);
		});
	};
	
	// CHECK COUNTER
	if (!action && $gameMap.isCounter(x2, y2)) {
		const direction = $gamePlayer.direction();
		const x3 = $gameMap.roundXWithDirection(x2, direction);
        const y3 = $gameMap.roundYWithDirection(y2, direction);
		$gameMap.eventsXy(x3, y3).forEach(function(event) {
			if (event.isNormalPriority()) action = Galv.AI.checkEventForIcon(event);
		});
	};
	action = action || {'eventId': 0, 'iconId': 0};
	$gamePlayer.actionIconTarget = action;
};

Galv.AI.checkEventForIcon = function(event) {
	let icon = 0;
			
	if (event.page()) {
		const listCount = event.page().list.length;
		
		for (let i = 0; i < listCount; i++) {
			if (event.page().list[i].code === 108) {
				let iconCheck = event.page().list[i].parameters[0].match(/<actionIcon: (.*)>/i);
				if (iconCheck) {
					// create target object
					let array = iconCheck[1].split(",");
					const iconId = array[0];
					let offset = {x:0,y:0};
					if (array[1]) { // if there is a value in index 1 of tag
						const v = array[1].split("|");
						if (v[1]) { // if 2 values because split value
							offset.x = Number(v[0]);
							offset.y = Number(v[1]);
						} else { // if only 1 value, use it for y
							offset.y = Number(v[0]);
						}
					}
					return {eventId: event._eventId,iconId: Number(iconId), xy:offset};
					break;
				};
			};
		};
	};
	return null;
};


// GAME SYSTEM
//-----------------------------------------------------------------------------

Galv.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	Galv.Game_System_initialize.call(this);
	this.actionIndicatorVisible = true;
};


// GAME MAP
//-----------------------------------------------------------------------------

Galv.Game_Map_requestRefresh = Game_Map.prototype.requestRefresh;
Game_Map.prototype.requestRefresh = function(mapId) {
	Galv.Game_Map_requestRefresh.call(this,mapId);
	Galv.AI.needRefresh = true;
};


// GAME PLAYER
//-----------------------------------------------------------------------------

Galv.Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d) {
	Galv.Game_CharacterBase_moveStraight.call(this,d);
	Galv.AI.needRefresh = true;
};


// SPRITESET MAP
//-----------------------------------------------------------------------------

Galv.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	Galv.Spriteset_Map_createLowerLayer.call(this);
	this.createActionIconSprite();
};

Spriteset_Map.prototype.createActionIconSprite = function() {
	this._actionIconSprite = new Sprite_ActionIcon();
	this._tilemap.addChild(this._actionIconSprite);
};


// SPRITE ACTIONICON
//-----------------------------------------------------------------------------

function Sprite_ActionIcon() {
    this.initialize(...arguments);
}

Sprite_ActionIcon.prototype = Object.create(Sprite.prototype);
Sprite_ActionIcon.prototype.constructor = Sprite_ActionIcon;

Sprite_ActionIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	$gamePlayer.actionIconTarget = $gamePlayer.actionIconTarget || {eventId: 0, iconId: 0, xy:{x:0,y:0}}; 
	this._iconIndex = 0;
	this.z = Galv.AI.z;
	this.changeBitmap();
	this._tileWidth = $gameMap.tileWidth();
	this._tileHeight = $gameMap.tileHeight();
	this._offsetX = -(ImageManager.iconWidth / 2);
	this._offsetY = -38 + Galv.AI.y;
	this.anchor.y = 1;
	this._float = 0.1;
	this.mod = 0.2;
	Galv.AI.needRefresh = true;
};

Sprite_ActionIcon.prototype.changeBitmap = function() {
	if ($gamePlayer.actionIconTarget.eventId <= 0) {
		this._iconIndex = 0;
	} else {
		this._iconIndex = $gamePlayer.actionIconTarget.iconId;
	};

	const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
	const sx = this._iconIndex % 16 * pw;
    const sy = Math.floor(this._iconIndex / 16) * ph;
	
	this.bitmap = new Bitmap(pw,ph);
	if (this._iconIndex <= 0) return;
    const bitmap = ImageManager.loadSystem('IconSet');
    this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
	
	Galv.AI.needRefresh = false;
};

Sprite_ActionIcon.prototype.initPopVars = function() {
	this.scale.y = 0.1;
	this.opacity = 0;
	this.mod = 0.2;
	this._float = 0.1;
};

if (Galv.AI.autoHide) {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		if ($gameMap.isEventRunning()) {
			this.opacity -= 40;
		} else {
			this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
		};
	};
} else {
	Sprite_ActionIcon.prototype.updateOpacity = function() {
		this.opacity = $gameSystem.actionIndicatorVisible ? Galv.AI.opacity : 0;
	};
};

Sprite_ActionIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
	if (Galv.AI.needRefresh) Galv.AI.checkActionIcon();
	
	if ($gamePlayer.actionIconTarget.eventId != this._eventId) {
		this.initPopVars();
		this._eventId = $gamePlayer.actionIconTarget.eventId;
	};
	
	if (this._iconIndex !== $gamePlayer.actionIconTarget.iconId) this.changeBitmap();
	if (this._iconIndex <= 0) return;
	
	const commentX = $gamePlayer.actionIconTarget.xy.x;
	const commentY = $gamePlayer.actionIconTarget.xy.y;
	
	this.x = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenX() + this._offsetX + commentX;
	this.y = $gameMap.event($gamePlayer.actionIconTarget.eventId).screenY() + this._offsetY + this._float + commentY;
	this.scale.y = Math.min(this.scale.y + 0.1,1);
	this.updateOpacity();
	this._float += this.mod;
	if (this._float < -0.1) {
		this.mod = Math.min(this.mod + 0.01,0.2);
	} else if (this._float >= 0.1) {
		this.mod = Math.max(this.mod + -0.01,-0.2);
	};
};