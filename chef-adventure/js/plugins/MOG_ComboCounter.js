//=============================================================================
// MOG_ComboCounter.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc (v1.0) Apresenta a quantidade de acertos no alvo.
 * @author Moghunter
 *
 * @param -> MAIN <<<<<<<<<<<<<<<<<<<<<<<
 * @desc
 *  
 * @param For Party
 * @desc Ativar o contador de Hits para o grupo.
 * @default true
 * @type boolean
 * @parent -> MAIN <<<<<<<<<<<<<<<<<<<<<<< 
 *  
 * @param For Enemies
 * @desc Ativar o contador de Hits para os inimigos.
 * @default true
 * @type boolean
 * @parent -> MAIN <<<<<<<<<<<<<<<<<<<<<<<  
 *  
 * @param Damage Cancel Counter
 * @desc Cancelar o contador quando o oponente causar dano.
 * @default true
 * @type boolean
 * @parent -> MAIN <<<<<<<<<<<<<<<<<<<<<<<  
 *  
 * @param Shake Effect
 * @desc Ativar o efeito de tremer.
 * @default false
 * @type boolean
 * @parent -> MAIN <<<<<<<<<<<<<<<<<<<<<<<  
 *  
 * @param Zoom Effect Range
 * @desc Definição do valor do zoom.
 * @default 3
 * @type number
 * @parent -> MAIN <<<<<<<<<<<<<<<<<<<<<<<  
 *
 * @param
 * 
 * @param -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 * @desc
 *
 * @param Party X-Axis
 * @desc Posição X-Axis do contador para o grupo.
 * @default 500
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param Party Y-Axis
 * @desc Posição Y-Axis do contador para o grupo.
 * @default 90
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param Enemies X-Axis
 * @desc Posição X-Axis do contador para os inimigos.
 * @default 0
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param Enemies Y-Axis
 * @desc Posição Y-Axis do contador para os inimigos.
 * @default 90
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param ----------------------------------------
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C HIT Layout X-Axis
 * @desc Posição X-Axis do layout do HIT.
 * @default 118
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C HIT Layout Y-Axis
 * @desc Posição Y-Axis do layout do HI.
 * @default 34
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C DMG Layout X-Axis
 * @desc Posição X-Axis do layout do DMG.
 * @default 10
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C DMG Layout Y-Axis
 * @desc Posição Y-Axis do layout do DMG.
 * @default 0
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C HIT Number X-Axis
 * @desc Posição X-Axis do numero do HIT.
 * @default 115
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C HIT Number Y-Axis
 * @desc Posição Y-Axis do numero do HIT.
 * @default 45
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C DMG Number X-Axis
 * @desc Posição X-Axis do numero do DMG.
 * @default 150
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @param C DMG Number Y-Axis
 * @desc Posição Y-Axis do numero do DMG.
 * @default 3
 * @parent -> POSITION <<<<<<<<<<<<<<<<<<<<<<<
 *
 * @help  
 * =============================================================================
 * +++ MOG - Combo Counter (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Apresenta a quantidade de Hits ao atacar o inimigo.
 * Serão necessários os arquivos. (img/system/)
 *
 * Combo_A.png
 * Combo_B.png
 * Combo_C.png
 * Combo_D.png 
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_ComboCounter = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_ComboCounter');
    Moghunter.combo_allies = String(Moghunter.parameters['For Party'] || 'true');
    Moghunter.combo_enemies = String(Moghunter.parameters['For Enemies'] || 'true');
	Moghunter.combo_cancel = String(Moghunter.parameters['Damage Cancel Counter'] || 'true');
	Moghunter.combo_shakeEffect = String(Moghunter.parameters['Shake Effect'] || 'true');
	Moghunter.combo_zoomEffect = Number(Moghunter.parameters['Zoom Effect Range'] || 3);
    Moghunter.combo_posX1 = Number(Moghunter.parameters['Party X-Axis'] || 500);
    Moghunter.combo_posY1 = Number(Moghunter.parameters['Party Y-Axis'] || 90);	
    Moghunter.combo_posX2 = Number(Moghunter.parameters['Enemies X-Axis'] || 0);
    Moghunter.combo_posY2 = Number(Moghunter.parameters['Enemies Y-Axis'] || 90);	
    Moghunter.combo_hit_layout_x = Number(Moghunter.parameters['C HIT Layout X-Axis'] || 118);
    Moghunter.combo_hit_layout_y = Number(Moghunter.parameters['C HIT Layout Y-Axis'] || 34);
    Moghunter.combo_dmg_layout_x = Number(Moghunter.parameters['C DMG Layout X-Axis'] || 10);
    Moghunter.combo_dmg_layout_y = Number(Moghunter.parameters['C DMG Layout Y-Axis'] || 0);
    Moghunter.combo_hit_number_x = Number(Moghunter.parameters['C HIT Number X-Axis'] || 115);
    Moghunter.combo_hit_number_y = Number(Moghunter.parameters['C HIT Number Y-Axis'] || 45);	
    Moghunter.combo_dmg_number_x = Number(Moghunter.parameters['C DMG Number X-Axis'] || 150);
    Moghunter.combo_dmg_number_y = Number(Moghunter.parameters['C DMG Number Y-Axis'] || 3);


//=============================================================================
// ■■■ Game Temp ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================
var _mog_hitCounter_TempInitialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	_mog_hitCounter_TempInitialize.call(this);
	this.combo_data = [];
	this.combo_data[0] = [false,0,0,false,false];
	this.combo_data[1] = [false,0,0,false,false];
	this.combo_cancel = String(Moghunter.combo_cancel) == "true" ? true : false;
};

//=============================================================================
// ■■■ Game System ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================
var _mog_hitCounter_SysInitialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_mog_hitCounter_SysInitialize.call(this);
    this.clearComboSpriteData();	
};

//==============================
// * clear Combo Sprite Data
//==============================
Game_System.prototype.clearComboSpriteData = function() {
	this._comboSpriteA = [];
	this._comboSpriteB = [];
    this._comboSpriteN1 = [];
	this._comboSpriteN2 = [];
	for (var i = 0; i < 2; i++) {	
		this._comboSpriteA[i] = {};
		this._comboSpriteB[i] = {};
		this._comboSpriteN1[i] = [];
		this._comboSpriteN2[i] = [];
	};
};

//=============================================================================
// ■■■ Game Action ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Apply
//==============================
var _alias_mog_combocounter_apply = Game_Action.prototype.apply
Game_Action.prototype.apply = function(target) {
	_alias_mog_combocounter_apply.call(this,target);
	if (this.subject().isActor() && target.isEnemy() && !target.result().isHit()) {
		$gameTemp.combo_data[0][3] = true;
	} else if (this.subject().isEnemy() && target.isActor() && !target.result().isHit()) {
		$gameTemp.combo_data[1][3] = true;
	};
};

//==============================
// ♦ ALIAS ♦  Game Action
//==============================
var _mog_comboCounterGaction_executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value) {
	_mog_comboCounterGaction_executeHpDamage.call(this,target, value);
	if (value > 0) {
		if (Imported.MOG_ChronoEngine && $gameSystem.isChronoMode()) {
			$gameTemp.combo_data[0][0] = true;
			$gameTemp.combo_data[0][1] += 1;
			$gameTemp.combo_data[0][2] += value;		
		} else {
			if (this.subject().isActor() && target.isEnemy()) {
			    $gameTemp.combo_data[0][0] = true;
				$gameTemp.combo_data[0][1] += 1;
				$gameTemp.combo_data[0][2] += value;
				if ($gameTemp.combo_cancel) {
					$gameTemp.combo_data[1][3] = true;	
					$gameTemp.combo_data[1][4] = false;
				};
			}
			else if (this.subject().isEnemy() && target.isActor()) {
			    $gameTemp.combo_data[1][0] = true;
				$gameTemp.combo_data[1][1] += 1;
				$gameTemp.combo_data[1][2] += value;
				if ($gameTemp.combo_cancel) {				
					$gameTemp.combo_data[0][3] = true;	
					$gameTemp.combo_data[0][4] = false;
				};
			};
		};
	};
};		
	
//=============================================================================
// ■■■ BattleManager ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Start Action
//==============================
var _mog_ccount_bmngr_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    $gameTemp.combo_data[0][4] = true;
	$gameTemp.combo_data[1][4] = true;
	_mog_ccount_bmngr_startAction.call(this);
};

//==============================
// ♦ ALIAS ♦  End Action
//==============================
var _mog_ccount_bmngr_endAction = BattleManager.endAction;
BattleManager.endAction = function() {
	_mog_ccount_bmngr_endAction.call(this);
	$gameTemp.combo_data[0][4] = false;
	$gameTemp.combo_data[1][4] = false;
};

//=============================================================================
// ■■■ Scene Battle ■■■
//=============================================================================	

//==============================
// ♦ ALIAS ♦  Terminate
//==============================
var _mog_ccount_sbattle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    _mog_ccount_sbattle_terminate.call(this);
    $gameTemp.combo_data[0] = [false,0,0,false,false];
    $gameTemp.combo_data[1] = [false,0,0,false,false];
};

//=============================================================================
// ■■■ Scene Base ■■■
//=============================================================================

//==============================
// ** create Hud Field
//==============================
Scene_Base.prototype.createHudField = function() {
	this._hudField = new Sprite();
	this._hudField.z = 10;
	this.addChild(this._hudField);
};

//==============================
// ** sort MZ
//==============================
Scene_Base.prototype.sortMz = function() {
   this._hudField.children.sort((a, b) => a.z - b.z);
};

//==============================
// ** create Combo Counter
//==============================
Scene_Base.prototype.createComboCounter = function() {
	this._hitCounterSprite = []
	for (var i = 0; i < 2 ; i++) {
		this._hitCounterSprite[i] = new HitCounterSprites(i);
		this._hitCounterSprite[i].z = 140;
		this._hudField.addChild(this._hitCounterSprite[i]);
	};
};

//=============================================================================
// ■■■ Scene Battle ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  create Spriteset
//==============================
var _mog_comboCounter_sbattle_createSpriteset = Scene_Battle.prototype.createSpriteset;
Scene_Battle.prototype.createSpriteset = function() {
	_mog_comboCounter_sbattle_createSpriteset.call(this);
	if (!this._hudField) {this.createHudField()};
    this.createComboCounter();
	this.sortMz();	
};

//=============================================================================
// ■■■ Hit Counter Sprites ■■■
//=============================================================================
function HitCounterSprites() {
    this.initialize.apply(this, arguments);
};

HitCounterSprites.prototype = Object.create(Sprite.prototype);
HitCounterSprites.prototype.constructor = HitCounterSprites;

//==============================
// * Initialize
//==============================
HitCounterSprites.prototype.initialize = function(type) {
    Sprite.prototype.initialize.call(this);	
    this.setup(type);
	this.loadImages();
    this.createLayout();
	if ($gameSystem._comboSpriteN1[this._type].length > 0 && $gameTemp.combo_data[this._type][1] > 0) {
		this.loadComboSpriteData()
	};
};

//==============================
// * Setup
//==============================
HitCounterSprites.prototype.setup = function(type) {
	this._type = type
	this._shakeEffect = String(Moghunter.combo_shakeEffect) == "true" ? true : false;
	this._shakeData = [0,0,0];
	this.combo_sprite_data = [0,[],[],0,0];
    this.combo_sprite_n1 = [];
	this.combo_sprite_n2 = [];
	this.setupPosition();
};

//==============================
// * Setup Position
//==============================
HitCounterSprites.prototype.setupPosition = function() {
    if (this._type == 0) {
		var xf = -(816 - Graphics.width);
        this.x = Moghunter.combo_posX1;
	    this.y = Moghunter.combo_posY1; 		
	    this.visible = String(Moghunter.combo_allies) == "true" ? true : false;
	} else {
		var xf = 0;
	    this.visible = String(Moghunter.combo_enemies) == "true" ? true : false;
        this.x = Moghunter.combo_posX2;
	    this.y = Moghunter.combo_posY2; 			
	};
	var yf = 0;	
	this._org = [this.x + xf,this.y + yf];
};

//==============================
// * Load Images
//==============================
HitCounterSprites.prototype.loadImages = function() {
   this._layImg1 = ImageManager.loadSystem("Combo_A");
   this._layImg2 = ImageManager.loadSystem("Combo_B");
   this._numberImg1 = ImageManager.loadSystem("Combo_C");
   this._numberImg2 = ImageManager.loadSystem("Combo_D");	   
};

//==============================
// * Create Layout
//==============================
HitCounterSprites.prototype.createLayout = function() {
    this.combo_sprite_a = new Sprite(this._layImg1);
	this.combo_sprite_a.x = Moghunter.combo_hit_layout_x;
	this.combo_sprite_a.y = Moghunter.combo_hit_layout_y;
	this.combo_sprite_a.org = [this.combo_sprite_a.x,this.combo_sprite_a.y];
    this.combo_sprite_a.opacity = 0;
	this.combo_sprite_b = new Sprite(this._layImg2);
	this.combo_sprite_b.x = Moghunter.combo_dmg_layout_x;
	this.combo_sprite_b.y = Moghunter.combo_dmg_layout_y;
	this.combo_sprite_b.org = [this.combo_sprite_b.x,this.combo_sprite_b.y];
	this.combo_sprite_b.opacity = 0;
	this.addChild(this.combo_sprite_a);
	this.addChild(this.combo_sprite_b);
};

//==============================
// * Update Combo Sprites
//==============================
HitCounterSprites.prototype.update = function() {	
   Sprite.prototype.update.call(this);	
   if ($gameTemp.combo_data[this._type][0]) {this.refresh_combo_sprite()};
   this.updateOpacity();
   this.updateLayout();
   this.updateNumber1();
   this.updateNumber2();
   this.updatePosition();
   if (this.needUpdateDuration()) {this.updateDuration()};
};

//==============================
// * Update position
//==============================
HitCounterSprites.prototype.updatePosition = function() {
   if (this._shakeData[0] > 0) {this.updateShake()};
   this.x = this._org[0] + this._shakeData[2];
   this.y = this._org[1];
};

//==============================
// * Update Shake
//==============================
HitCounterSprites.prototype.updateShake = function() {
   this._shakeData[1]++
   if (this._shakeData[1] < 1) {return};
   this._shakeData[0]--;
   this._shakeData[1] = 0;
   this._shakeData[2] = Math.randomInt(6) - 3 
   if (this._shakeData[0] <= 0) {this._shakeData = [0,0,0]};
};

//==============================
// * Update Opacity
//==============================
HitCounterSprites.prototype.updateOpacity = function() {	
   if (this.combo_sprite_data[0] <= 0 && this.combo_sprite_a.opacity > 0) {
      this.combo_sprite_a.opacity -= 10;
	  this.combo_sprite_b.opacity -= 10;
	  this.combo_sprite_data[3] += 1;
   };   
};

//==============================
// * Update Layout
//==============================
HitCounterSprites.prototype.updateLayout = function() {	
   this.combo_sprite_a.x = this.combo_sprite_data[3] + this.combo_sprite_a.org[0];
   this.combo_sprite_a.y = this.combo_sprite_a.org[1];
   this.combo_sprite_b.x = this.combo_sprite_data[3] + this.combo_sprite_b.org[0];
   this.combo_sprite_b.y = this.combo_sprite_b.org[1];
};

//==============================
// * Update Number 1
//==============================
HitCounterSprites.prototype.updateNumber1 = function() {	
   for (var i = 0; i < this.combo_sprite_n1.length; i++) {
	   this.combo_sprite_n1[i].x = this.combo_sprite_data[3] + this.combo_sprite_data[1][i]  + this.combo_sprite_n1[i].org[0];
	   this.combo_sprite_n1[i].y = this.combo_sprite_n1[i].org[1];
	   if (this.combo_sprite_n1[i].scale.x > 1.00) {
		   this.combo_sprite_n1[i].scale.x -= 0.1;
	   this.combo_sprite_n1[i].scale.y = this.combo_sprite_n1[i].scale.x};
	   if (this.combo_sprite_data[0] <= 0) { this.combo_sprite_n1[i].opacity -= 10};
   };
};

//==============================
// * Update Number 2
//==============================
HitCounterSprites.prototype.updateNumber2 = function() {	
   for (var i = 0; i < this.combo_sprite_n2.length; i++) {
	   this.combo_sprite_n2[i].x = this.combo_sprite_data[3] + this.combo_sprite_data[2][i]  + this.combo_sprite_n2[i].org[0];
	   this.combo_sprite_n2[i].y = this.combo_sprite_n2[i].org[1];
	   if (this.combo_sprite_data[0] <= 0) { this.combo_sprite_n2[i].opacity -= 10};
   };
};

//==============================
// * Need Update Duration
//==============================
HitCounterSprites.prototype.needUpdateDuration = function() {	
   if (this.combo_sprite_data[0] <= 0) {return false};
   return true
};

//==============================
// * Update Duration
//==============================
HitCounterSprites.prototype.updateDuration = function() {	
   if (!$gameTemp.combo_data[this._type][4]) {this.combo_sprite_data[0] -= 1};
   if ($gameTemp.combo_data[this._type][3]) {this.combo_sprite_data[0] = 0};
   if (this.combo_sprite_data[0] == 0) {
	   $gameTemp.combo_data[this._type] = [false,0,0,false,false];
	   $gameSystem.clearComboSpriteData();
   };
};

//==============================
// * Refresh Combo Sprite
//==============================
HitCounterSprites.prototype.refresh_combo_sprite = function() {
	if (!this._numberImg1.isReady()) {return};
	$gameTemp.combo_data[this._type][0] = false;
	$gameTemp.combo_data[this._type][3] = false;
	this.combo_sprite_data[0] = 90;
    this.combo_sprite_a.opacity = 255;
    this.combo_sprite_b.opacity = 255;
	this.combo_sprite_data[3] = 0;	
	if (this._shakeEffect) {this._shakeData[0] = 30};
	this.refresh_combo_hit();
	this.refresh_combo_damage();
	$gameSystem.clearComboSpriteData();
};

//==============================
// * Refresh Combo Hit
//==============================
HitCounterSprites.prototype.refresh_combo_hit = function() {
	var w = this._numberImg1.width / 10;
	var h = this._numberImg1.height;
	var dmg_number = Math.abs($gameTemp.combo_data[this._type][1]).toString().split("");
	for (var i = 0; i <  this.combo_sprite_n1.length; i++) {this.removeChild(this.combo_sprite_n1[i]);};
    for (var i = 0; i <  dmg_number.length; i++) {
		var n = Number(dmg_number[i]);
		     this.combo_sprite_n1[i] = new Sprite(this._numberImg1);
			 this.combo_sprite_n1[i].setFrame(n * w, 0, w, h);
		     this.combo_sprite_data[1][i] = (i * w) - (dmg_number.length *  (w));
			 this.combo_sprite_n1[i].anchor.x = 0.5;
			 this.combo_sprite_n1[i].anchor.y = 0.5;
		     this.combo_sprite_n1[i].scale.x = Moghunter.combo_zoomEffect;
			 this.combo_sprite_n1[i].scale.y = Moghunter.combo_zoomEffect;	
			 this.combo_sprite_n1[i].x = Moghunter.combo_hit_number_x;
			 this.combo_sprite_n1[i].y = Moghunter.combo_hit_number_y;
			 this.combo_sprite_n1[i].org = [this.combo_sprite_n1[i].x,this.combo_sprite_n1[i].y];		 
		     this.addChild(this.combo_sprite_n1[i]);
	};
};

//==============================
// * Refresh Combo Damage
//==============================
HitCounterSprites.prototype.refresh_combo_damage = function() {
	var w = this._numberImg2.width / 10;
	var h = this._numberImg2.height;
	var dmg_number =  Math.abs($gameTemp.combo_data[this._type][2]).toString().split("");
	for (var i = 0; i <  this.combo_sprite_n2.length; i++) {this.removeChild(this.combo_sprite_n2[i]);};
    for (var i = 0; i <  dmg_number.length; i++) {
		var n = Number(dmg_number[i]);
		     this.combo_sprite_n2[i] = new Sprite(this._numberImg2);
			 this.combo_sprite_n2[i].setFrame(n * w, 0, w, h);
			 this.combo_sprite_n2[i].x = Moghunter.combo_dmg_number_x;
			 this.combo_sprite_n2[i].y = Moghunter.combo_dmg_number_y;
			 this.combo_sprite_n2[i].org = [this.combo_sprite_n2[i].x,this.combo_sprite_n2[i].y];
			 this.combo_sprite_data[2][i] = i * w;
		     this.addChild(this.combo_sprite_n2[i]);
	};
};
