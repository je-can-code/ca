//=============================================================================
// MOG_CharacterMotion.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc (v1.0) Sistema de animações dos sprites dos personagens.
 * @author Moghunter
 *
 * @command CharIddleMotionEvent
 * @desc Define a animação para o evento.
 * @text Iddle Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 *
 * @arg motion
 * @desc Define a animação do evento.
 * @text Motion
 * @default Breath Effect 1
 * @type select
 * @option Breath Effect 1
 * @value Breath Effect 1
 * @option Breath Effect 2
 * @value Breath Effect 2
 * @option Float Effect
 * @value Float Effect
 * @option Swing Effect
 * @value Swing Effect
 * @option Ghost Effect
 * @value Ghost Effect
 * 
 * @command CharIddleMotionPlayer
 * @desc Define a animação para o jogador e aliados.
 * @text Iddle Motion (Player)
 *
 * @arg id
 * @desc Define a Index do jogador.
 * @text Player Index
 * @default 1
 * @type number
 * @min 1
 *
 * @arg motion
 * @desc Define a animação do evento.
 * @text Motion
 * @default Breath Effect 1
 * @type select
 * @option Breath Effect 1
 * @value Breath Effect 1
 * @option Breath Effect 2
 * @value Breath Effect 2
 * @option Float Effect
 * @value Float Effect
 * @option Swing Effect
 * @value Swing Effect
 * @option Ghost Effect
 * @value Ghost Effect
 * 
 * @command CharShakeMotionEvent
 * @desc Ativa o efeito tremer no evento.
 * @text Shake Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 *
 * @arg duration
 * @desc Duração do tempo de tremer.
 * @text Duration
 * @default 60
 * @type number
 * @min 10
 *
 * @command CharShakeMotionPlayer
 * @desc Ativa o efeito tremer no jogador.
 * @text Shake Motion (Player)
 *
 * @arg id
 * @desc Define a Index do jogador.
 * @text Player Index
 * @default 1
 * @type number
 * @min 1
 *
 * @arg duration
 * @desc Duração do tempo de tremer.
 * @text Duration
 * @default 60
 * @type number
 * @min 10
 * 
 * @command CharRotationMotionEvent
 * @desc Ativa o efeito rotação no evento.
 * @text Rotation Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 *
 * @arg angle
 * @desc Definição do ângulo.
 * @text Angle
 * @default 90
 * 
 * @command CharRotationMotionPlayer
 * @desc Ativa o efeito rotação no jogador.
 * @text Rotation Motion (Player)
 *
 * @arg id
 * @desc Define a Index do jogador.
 * @text Player Index
 * @default 1
 * @type number
 * @min 1
 *
 * @arg angle
 * @desc Definição do ângulo.
 * @text Angle
 * @default 90
 * 
 * @command CharZoomMotionEvent
 * @desc Ativa o efeito zoom no evento.
 * @text Zoom Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 *
 * @arg zoom
 * @desc Define o valor do zoom.
 * @text Zoom (%)
 * @default 200
 * @type number
 * @min 10
 * @max 2000
 * 
 * @command CharZoomMotionPlayer
 * @desc Ativa o efeito zoom no jogador.
 * @text Zoom Motion (Player)
 *
 * @arg id
 * @desc Define a Index do jogador
 * @text Player Index
 * @default 1
 * @type number
 * @min 1
 *
 * @arg zoom
 * @desc Define o valor do zoom.
 * @text Zoom (%)
 * @default 200
 * @type number
 * @min 10
 * @max 2000
 *
 * @command CharCollapseMotionEvent
 * @desc Ativa o efeito colapso no evento.
 * @text Collapse Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 *
 * @arg collapse
 * @desc Define o efeito do colapso.
 * @text Effect
 * @default Vertical Collapse
 * @type select
 * @option Vertical Collapse
 * @value Vertical Collapse
 * @option Horizontal Collapse
 * @value Horizontal Collapse
 * @option Vert & Horiz Collapse
 * @value Vert & Horiz Collapse
 * 
 * @command CharCollapseMotionPlayer
 * @desc Ativa o efeito colapso no jogador.
 * @text Collapse Motion (Player)
 *
 * @arg id
 * @desc Define a Index do jogador.
 * @text Player Index
 * @default 1
 * @type number
 * @min 1
 *
 * @arg collapse
 * @desc Define o tipo de colapso.
 * @text Effect
 * @default Vertical Collapse
 * @type select
 * @option Vertical Collapse
 * @value Vertical Collapse
 * @option Horizontal Collapse
 * @value Horizontal Collapse
 * @option Vert & Horiz Collapse
 * @value Vert & Horiz Collapse
 *
 * @command CharMotionEventRemove
 * @desc Define a animação para o evento.
 * @text Remove Motion (Event)
 *
 * @arg id
 * @desc Define a ID do evento.
 * @text Event ID
 * @default 1
 * @type number
 * @min 1
 * 
 * @command CharMotionPlayerRemove
 * @desc Define a animação para o evento.
 * @text Remove Motion (Player)
 *
 * @arg id
 * @desc Define a ID do jogador e aliados.
 * @text Player ID
 * @default 1
 * @type number
 * @min 1
 * 
 * @help  
 * =============================================================================
 * +++ MOG - Character Motion (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Sistema de animações dos sprites dos personagens.
 * =============================================================================
 * UTILIZAÇÂO
 * =============================================================================
 * Para ativar os efeitos nos eventos, basta usar esse comentários.
 *
 * Breath Motion 1
 *  
 * Breath Motion 2
 * 
 * Float Motion
 *
 * Swing Motion
 *
 * Ghost Motion
 * 
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_CharacterMotion = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_CharacterMotion');

//=============================================================================
// ■■■  PluginManager ■■■ 
//=============================================================================	
PluginManager.registerCommand('MOG_CharacterMotion', "CharIddleMotionEvent", data => {
 	var charID = Number(data.id);
	var char = $gameMap.event(charID);
	if (char) {$gameMap.charIddleMotion(data,char)};	
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharIddleMotionPlayer", data => {
 	var charID = Number(data.id);
	var char = $gameMap.getCharPlayer(charID);
	if (char) {$gameMap.charIddleMotion(data,char)};	
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharShakeMotionEvent", data => {
 	var charID = Number(data.id);
	var char = $gameMap.event(charID);
	if (char) {$gameMap.charShakeMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharShakeMotionPlayer", data => {
 	var charID = Number(data.id);
	var char = $gameMap.getCharPlayer(charID);
	if (char) {$gameMap.charShakeMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharRotationMotionEvent", data => {
 	var charID = Number(data.id);
	var char = $gameMap.event(charID);
	if (char) {$gameMap.charRotationMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharRotationMotionPlayer", data => {
 	var charID = Number(data.id);
	var char = $gameMap.getCharPlayer(charID);
	if (char) {$gameMap.charRotationMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharZoomMotionEvent", data => {
 	var charID = Number(data.id);
	var char = $gameMap.event(charID);
	if (char) {$gameMap.charZoomMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharZoomMotionPlayer", data => {
 	var charID = Number(data.id);
	var char = $gameMap.getCharPlayer(charID);
	if (char) {$gameMap.charZoomMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharCollapseMotionEvent", data => {
 	var charID = Number(data.id);
	var char = $gameMap.event(charID);
	if (char) {$gameMap.charCollapseMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharCollapseMotionPlayer", data => {
 	var charID = Number(data.id);
	var char = $gameMap.getCharPlayer(charID);
	if (char) {$gameMap.charCollapseMotion(data,char)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharMotionEventRemove", data => {
	var eventID = Number(data.id)
	if ($gameMap.events(eventID)) {$gameMap.removeCharMotionEvent(eventID)};
});

PluginManager.registerCommand('MOG_CharacterMotion', "CharMotionPlayerRemove", data => {
	$gameMap.removeCharMotionPlayer(Number(data.id))
});

//=============================================================================
// ■■■  Game Map ■■■ 
//=============================================================================	

//==============================
// * Char Collapse Motion
//==============================
Game_Map.prototype.charCollapseMotion = function(data,char) {
    var coll = this.getCharCollapseMotion(String(data.collapse))
    char._collapseData[0] = coll;
	char._charEffectChecked = true;
};

//==============================
// * get Char Collapse Motion
//==============================
Game_Map.prototype.getCharCollapseMotion = function(coll_name) {
     if (coll_name == "Vertical Collapse") {return 1;
	 } else if (coll_name == "Horizontal Collapse") {return 2;
	 } else if (coll_name == "Vert & Horiz Collapse") {return 3;
	 };
	 return 0;
};

//==============================
// * Char Zoom Motion
//==============================
Game_Map.prototype.charZoomMotion = function(data,char) {
    var zoom = Number(data.zoom) * 0.01;
    char._zoomData[2] = zoom;
	char._zoomData[3] = zoom;
	char._charEffectChecked = true;
};

//==============================
// * Char Rotation Motion
//==============================
Game_Map.prototype.charRotationMotion = function(data,char) {
    var angle = Number(data.angle);
    char._rotationData[1] = angle * Math.PI / 180;
	char._charEffectChecked = true;
};

//==============================
// * Char Shake Motion
//==============================
Game_Map.prototype.charShakeMotion = function(data,char) {
    var duration = Number(data.duration);
    char._shakeData[0] = duration;
	char._charEffectChecked = true;
};

//==============================
// * Char Iddle Motion
//==============================
Game_Map.prototype.charIddleMotion = function(data,char) {
    var motionID = this.getCharMotionID(String(data.motion));
	this.setCharIddleMotion(char,motionID);
};

//==============================
// * set Char Iddle Motion Player
//==============================
Game_Map.prototype.getCharPlayer = function(playerID) {
    var char = null;
	if (playerID == 1) {
		char = $gamePlayer
	} else {
		var followID = playerID - 2
	    char = $gamePlayer.followers().follower(followID)
	};
    return char;
};

//==============================
// * set Char Iddle Motion
//==============================
Game_Map.prototype.setCharIddleMotion = function(char,motion) {
	 char._charEffectChecked = true;
     if (motion <= 1) {
	     char._breathData[0] = motion + 1;
	 } else if (motion == 2) {
		 char._floatData[0] = 1;
	 } else if (motion == 3) {
		 char._swingData[0] = 1;
	 } else if (motion == 4) {
		 char._ghostData[0] = 1;	
	 };
};

//==============================
// * get Char Motion ID
//==============================
Game_Map.prototype.getCharMotionID = function(motion_name) {
     if (motion_name == "Breath Effect 1") {return 0;
	 } else if (motion_name == "Breath Effect 2") {return 1;
	 } else if (motion_name == "Float Effect") {return 2;
	 } else if (motion_name == "Swing Effect") {return 3;
	 } else if (motion_name == "Ghost Effect") {return 4;
	 };
	 return 0;
};

//==============================
// * remove Char Motion Event
//==============================
Game_Map.prototype.removeCharMotionEvent = function(eventID) {
	 var eventChar = this.event(eventID);
     if (eventChar) {eventChar.charEffectsClear()};
};

//==============================
// * remove Char Motion Player
//==============================
Game_Map.prototype.removeCharMotionPlayer = function(playerID) {
	 var playerChar = this.getCharPlayer(playerID);
     if (playerChar) {playerChar.charEffectsClear()};
};

//=============================================================================
// ■■■ Game Character Base ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  InitMembers
//==============================
var _mog_spChar_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
	_mog_spChar_initMembers.call(this) 
	this.charEffectsClear();
};

//==============================
// * spCharSetup
//==============================
Game_CharacterBase.prototype.charEffectsClear = function() {
	this._charEffectChecked = false;
	this._actionZoomData = {};
	this._actionZoomData.enabled = false;
	this._actionZoomData.loop = true;
	this._actionZoomData.returnBack = false;
	this._actionZoomData.mode = 0;
	this._actionZoomData.zoom = 0;
	this._zoomData = [1.00,1.00,1.00,1.00];
	this._rotationData = [0,0];
	this._swingData = [0,0,0,0,0,0,false];
	this._floatData = [0,0,0,0,0,0,false];
	this._breathData = [0,0,0,0,0,0,false];
	this._ghostData = [0,0,0,0,0,0,false];
	this._shakeData = [0,0,0,0,0,0,false];
	this._collapseData = [0,0,0,0,0,0,false];
};

//==============================
// * char Zoom Act
//==============================
Game_CharacterBase.prototype.charZoomAct = function(enable,loop) {
	if (!this._actionZoomData.enabled) {
		this._actionZoomData.enabled = true
	};
	var loop = loop != null ? loop : enable;
	this._actionZoomData.loop = loop;
};

//==============================
// * Base New Parameters
//==============================
Game_CharacterBase.prototype.baseParametersClear = function() {
    this._zoomData[2] = 1.00;
	this._zoomData[3] = 1.00;
	this._rotationData[1] = 0;
};

//==============================
// * Set New Parameters
//==============================
Game_CharacterBase.prototype.setNewParameters = function() {
    this._zoomData[0] = this.setCharNewPar(this._zoomData[0],this._zoomData[2],30);
	this._zoomData[1] = this.setCharNewPar(this._zoomData[1],this._zoomData[3],30);
	this._rotationData[0] = this.setCharNewPar(this._rotationData[0],this._rotationData[1],30);
};

//==============================
// * set New Par
//==============================
Game_CharacterBase.prototype.setCharNewPar = function(value,real_value,speed) {
	if (value == real_value) {return value};
	var dnspeed = 0.001 + (Math.abs(value - real_value) / speed);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return value;
};

//==============================
// * char Collapse Clear
//==============================
Game_CharacterBase.prototype.charCollapseClear = function(mode) {
	this._collapseData = [0,0,0,0,0,255,false];
	if (mode === 1) {this._collapseData[5] = 0};
	this._shakeData = [0,0,0,0,0,0,false];
};

//==============================
// * is Swing
//==============================
Game_CharacterBase.prototype.isSwing = function() {
	return this._swingData[0] > 0;
};

//==============================
// * is Float Data
//==============================
Game_CharacterBase.prototype.isFlying = function() {
	return this._floatData[0] > 0;
};

//==============================
// * is Breathing
//==============================
Game_CharacterBase.prototype.isBreathing = function() {
	if (this._actionZoomData.enabled) {return false};
	return this._breathData[0] > 0;
};

//==============================
// * is Breath Act
//==============================
Game_CharacterBase.prototype.isBreathAct = function() {
	return this._actionZoomData.enabled;
}; 

//==============================
// * is Ghost Mode
//==============================
Game_CharacterBase.prototype.isGhostMode = function() {
	return this._ghostData[0] > 0;
};

//==============================
// * is Shaking
//==============================
Game_CharacterBase.prototype.isShaking = function() {
	return this._shakeData[0] > 0;
};

//==============================
// * is Collapsing
//==============================
Game_CharacterBase.prototype.isCollapsing = function() {
	return this._collapseData[0] > 0;
};

//==============================
// * motionX
//==============================
Game_CharacterBase.prototype.motionX = function() {
	return this._shakeData[1];
};

//==============================
// * motionY
//==============================
Game_CharacterBase.prototype.motionY = function() {
	return this._floatData[1];
};

//==============================
// * motionR
//==============================
Game_CharacterBase.prototype.motionR = function() {
	var n = this._rotationData[0] + this._swingData[1]
	if (Imported.MOG_ChronoEngine) {
	    n += this._user.rotation[0];
	};
	return n;
};

//==============================
// * motion ZX
//==============================
Game_CharacterBase.prototype.motionZX = function() {
	return this._zoomData[0] + this._breathData[1] + this._collapseData[1] + this._actionZoomData.zoom;
};

//==============================
// * motion ZY
//==============================
Game_CharacterBase.prototype.motionZY = function() {
	return this._zoomData[1] + this._breathData[2] + this._collapseData[2] + this._actionZoomData.zoom;
};

//==============================
// * motion OP
//==============================
Game_CharacterBase.prototype.motionOP = function() {
	return -(this._ghostData[1] + this._collapseData[5]);
};

//=============================================================================
// ■■■ Game Event ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Setup Page
//==============================
var _alias_mog_charmotion_gevent_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
	_alias_mog_charmotion_gevent_setupPage.call(this);
	this._actionZoomData.loop = false;
    if (!this._charEffectChecked) {this.checkCharMotion()};
};

//==============================
// * Check Char Motion
//==============================
Game_Event.prototype.checkCharMotion = function() {
	this.charEffectsClear()
	if (!this._erased && this.page()) {
		this.list().forEach(function(l) {
			if (l.code === 108) {
				if (l.parameters[0].toLowerCase() == "float motion") {
					this._floatData[0] = 1;
					this._charEffectChecked = true;
				};
				if (l.parameters[0].toLowerCase() == "swing motion") {
					this._swingData[0] = 1;
					this._charEffectChecked = true;
				};
				
				var comment = l.parameters[0].split(' : ')
				if (comment[0].toLowerCase() == "breath motion 1"){
					this._breathData[0] = 1;
					this._charEffectChecked = true;
				} else if (comment[0].toLowerCase() == "breath motion 2") {
					this._breathData[0] = 2;
					this._charEffectChecked = true;				  
				};
				if (comment[0].toLowerCase() == "ghost motion") {
					this._ghostData[0] = 1;
					this._charEffectChecked = true;
				};
			};
		}, this);
	};
};

//=============================================================================
// ■■■ Sprite Character ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Update
//==============================
var mog_prChar_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
	mog_prChar_update.call(this);
	if (this._character) {this.updateSprEffect()};
};

//==============================
// * Update Spr Effect
//==============================
Sprite_Character.prototype.updateSprEffect = function() {   
    if (Imported.MOG_ChronoEngine && this._character._user.treasure[0]) {
        return
	};
	if (this._character.isCollapsing()) {this.updateCollapseEffect()
	} else {
	   if (this._character.isSwing()) {this.updateSwingEffect()};
	   if (this._character.isFlying()) {this.updateFloatEffect()};
	   if (this._character.isBreathAct()) {
		   this.updateBreathActEffect();
	   } else if (this._character.isBreathing()) {
		   this.updateBreathEffect()};
	   if (this._character.isShaking()) {this.updateShakeEffect()};
	   if (this._character.isGhostMode()) {this.updateGhostEffect()};
	};
	this.updateSprParameters();
};

//==============================
// * Update Spr Parameters
//==============================
Sprite_Character.prototype.updateSprParameters = function() {
	this._character.setNewParameters();
	this.x += this._character.motionX();
	this.y += this._character.motionY();
	this.opacity += this._character.motionOP();
	this.rotation = this._character.motionR();
	this.scale.x = this._character.motionZX();
	this.scale.y = this._character.motionZY();
};

//==============================
// * set Ghost Data
//==============================
Sprite_Character.prototype.setGhostData = function() {
        this._character._ghostData[6] = true;
		var rz = Math.randomInt(255);
		this._character._ghostData[1] = rz;
		this._character._ghostData[3] = 0;
		this._character._ghostData[5] = this._character._ghostData[0] === 1 ? 0 : 120;
		if (this._character._ghostData[1] < this._character._ghostData[5]) {
			this._character._ghostData[1] = this._character._ghostData[5]; 
		};
};

//==============================
// * Update Ghost Effect
//==============================
Sprite_Character.prototype.updateGhostEffect = function() {
	if (!this._character._ghostData[6]) {this.setGhostData()};
	this.updateGhostEffect1();
};

//==============================
// * Update Ghost Effect 1
//==============================
Sprite_Character.prototype.updateGhostEffect1 = function() {	
	if (this._character._ghostData[3] > 0) {
	    this._character._ghostData[3] --;
		return;
    };
	if (this._character._ghostData[4] === 0) {
	    this._character._ghostData[1] -= 3;
		if (this._character._ghostData[1] <= this._character._ghostData[5]) {
			this._character._ghostData[4] = 1;
		    this._character._ghostData[3] = 60;		
		};
	} else {
		this._character._ghostData[1] += 3;
		if (this._character._ghostData[1] >= 255) {
			this._character._ghostData[4] = 0;
			this._character._ghostData[3] = 60;	
		};
	};
};

//==============================
// * set Swing Data
//==============================
Sprite_Character.prototype.setSwingData = function() {
        this._character._swingData[6] = true;
		var rz = Math.min(Math.max((Math.random() * 0.2).toFixed(3),0.1),0.2);
		this.rotation = -Number(rz);
		this._character._swingData[2] = Math.min(Math.max((Math.random() * 0.02).toFixed(3),0.015),0.02);
		this._character._swingData[3] = rz;
		this._character._swingData[4] = 0;
		this._character._swingData[5] = 0.005; 		
};

//==============================
// * Update Swing Effect
//==============================
Sprite_Character.prototype.updateSwingEffect = function() {
	if (!this._character._swingData[6]) {this.setSwingData()};
	if (this._character._swingData[0] === 1) {this.updateSwingEffect1();
	} else {this.updateSwingEffect2();};	
};

//==============================
// * Update Swing Effect 1
//==============================
Sprite_Character.prototype.updateSwingEffect1 = function() {
	if (this._character._swingData[4] === 0) {
	    this._character._swingData[1] += this._character._swingData[5];
		if (this._character._swingData[1] >= this._character._swingData[3]) {this._character._swingData[4] = 1};
	} else {
		this._character._swingData[1] -= this._character._swingData[5];
		if (this._character._swingData[1] <= -this._character._swingData[3]) {this._character._swingData[4] = 0};
	};
};

//==============================
// * Update Swing Effect 2
//==============================
Sprite_Character.prototype.updateSwingEffect2 = function() {
	this._character._swingData[1] += this._character._swingData[2];
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
};

//==============================
// * set Float Data
//==============================
Sprite_Character.prototype.setFloatData = function() {
        this._character._floatData[6] = true;
		var rz = Math.min(Math.max((Math.random() * 30).toFixed(3),5),20);
		this._character._floatData[1] = -Number(rz);
		this._character._floatData[3] = Number(rz);
    	var rz = Math.min(Math.max((Math.random() * 0.5).toFixed(2),0.1),0.3);
		this._character._floatData[5] = rz;
		this._character._floatData[4] = 1;
};

//==============================
// * Update Float Effect
//==============================
Sprite_Character.prototype.updateFloatEffect = function() {
	 if (!this._character._floatData[6]) {this.setFloatData()};
	 if (this._character._floatData[4] === 0) {
	     this._character._floatData[1] += this._character._floatData[5];
	  	if (this._character._floatData[1] >= 0) {this._character._floatData[4] = 1};
	 } else {
		this._character._floatData[1] -= this._character._floatData[5];
		if (this._character._floatData[1] <= -this._character._floatData[3]) {this._character._floatData[4] = 0};
	 };	 
};

//==============================
// * Update Breath Effect
//==============================
Sprite_Character.prototype.updateBreathEffect = function() {
	 if (!this._character._breathData[6]) {this.setBreathData()};
	 if (this._character._breathData[0] === 1) {this.updateBreathEffect1();
	 } else if (this._character._breathData[0] === 2) {this.updateBreathEffect2();
	 } else {this.updateBreathEffect3();
	 };	
};

//==============================
// * set Breath Data
//==============================
Sprite_Character.prototype.setBreathData = function() {
        this._character._breathData[6] = true;
		var rz = Math.min(Math.max((Math.random() * 0.1).toFixed(3),0.030),0.080);
		this.scale.y = 1.00 + Number(rz);
		this._character._breathData[3] = rz;
		this._character._breathData[4] = 0;
		this._character._breathData[5] = 0.0008;  
};

//==============================
// * Update Breath Effect 1
//==============================
Sprite_Character.prototype.updateBreathEffect1 = function() {    
	if (this._character._breathData[4] === 0) {
	    this._character._breathData[2] += this._character._breathData[5];
		if (this._character._breathData[2] >= this._character._breathData[3]) {this._character._breathData[4] = 1};
	} else {
		this._character._breathData[2] -= this._character._breathData[5];
		if (this._character._breathData[2] <= 0) {this._character._breathData[4] = 0};
	};
};

//==============================
// * Update Breath Effect 2
//==============================
Sprite_Character.prototype.updateBreathEffect2 = function() {    
	if (this._character._breathData[4] === 0) {
	    this._character._breathData[2] += this._character._breathData[5];
		this._character._breathData[1] -= this._character._breathData[5];
		if (this._character._breathData[2] >= this._character._breathData[3]) {this._character._breathData[4] = 1};
	} else {
		this._character._breathData[2] -= this._character._breathData[5];
		this._character._breathData[1] += this._character._breathData[5];
		if (this._character._breathData[2] <= 0) {this._character._breathData[4] = 0};
	};
};

//==============================
// * Update Breath Effect 3
//==============================
Sprite_Character.prototype.updateBreathEffect3 = function() {    
	if (this._character._breathData[4] === 0) {
	    this._character._breathData[2] += this._character._breathData[5];
		this._character._breathData[1] += this._character._breathData[5];
		if (this._character._breathData[2] >= this._character._breathData[3]) {this._character._breathData[4] = 1};
	} else {
		this._character._breathData[2] -= this._character._breathData[5];
		this._character._breathData[1] -= this._character._breathData[5];
		if (this._character._breathData[2] <= 0) {this._character._breathData[4] = 0};
	};
};

//==============================
// * Update Breath Act Effect
//==============================
Sprite_Character.prototype.updateBreathActEffect = function() {
	if (Imported.MOG_ChronoEngine && this._character.isKnockbacking()) {return};
	if (this._character._actionZoomData.mode === 0) {
		this._character._actionZoomData.zoom += 0.01;
		if (this._character._actionZoomData.zoom > 0.20) {
			this._character._actionZoomData.zoom = 0.20;
			this._character._actionZoomData.mode = 1;
		};
	} else {
		this._character._actionZoomData.zoom -= 0.01;
		if (this._character._actionZoomData.zoom < 0) {
			this._character._actionZoomData.zoom = 0;
			this._character._actionZoomData.mode = 0;
			if (!this._character._actionZoomData.loop) {
				this._character._actionZoomData.enabled = false;
				this._character._actionZoomData.returnBack = false;
			};
		};
	};
	if (this._character._actionZoomData.returnBack) {
		this._character._actionZoomData.loop = false; 
	};	
};

//==============================
// * Update Shake Effect
//==============================
Sprite_Character.prototype.updateShakeEffect = function() {
	if (this._character._shakeData[0] > 0) {this._character._shakeData[0] -= 1};
    this._character._shakeData[1] = Math.randomInt(5)
	if (this._character._shakeData[0] === 0) {this._character._shakeData[1] = 0};
	this.x -= 2;
};

//==============================
// * Update Collapse
//==============================
Sprite_Character.prototype.updateCollapseEffect = function() {
	if (this._character._collapseData[0] === 1) {this.updateCollapse1();
	} else if (this._character._collapseData[0] === 2) {this.updateCollapse2();
	} else {this.updateCollapse3();
    };
	if (this._character._collapseData[5] < 255) {this._character._collapseData[5] += 5;
    	if (this._character._collapseData[5] >= 255) {
			this._character.charCollapseClear(0);
		};
	};
};

//==============================
// * Update Collapse1
//==============================
Sprite_Character.prototype.updateCollapse1 = function() {
	this._character._collapseData[2] += 0.3;
	if (this._character._collapseData[1] > -1) {this._character._collapseData[1] -= 0.1};	
};

//==============================
// * Update Collapse2
//==============================
Sprite_Character.prototype.updateCollapse2 = function() {
    this._character._collapseData[1] += 0.1;
	if (this._character._collapseData[2] > -1) {this._character._collapseData[2] -= 0.1};	
};

//==============================
// * Update Collapse3
//==============================
Sprite_Character.prototype.updateCollapse3 = function() {
	this._character._collapseData[3]++;
	if (this._character._collapseData[3] < 20) {
		this._character._collapseData[1] += 0.05;
  	    if (this._character._collapseData[2] > -0.8) {this._character._collapseData[2] -= 0.05};		
	} else if (this._character._collapseData[3] < 60) {
		if (this._character._collapseData[1] > -0.9) {this._character._collapseData[1] -= 0.2};
  	    this._character._collapseData[2] += 0.8;		
	};
};