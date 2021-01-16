/*:
 * @target MZ
 * @plugindesc (v1.0) Add text over an event.
 * @author Moghunter
 *
 * @param X axis
 * @desc The X axis modifier.
 * @default 0
 *
 * @param Y axis
 * @desc The Y axis modifier.
 * @default 0
 *
 * @param Font Size
 * @desc The font size of the text.
 * @default 18 
 *
 * @help  
 * =============================================================================
 * +++ MOG - Event Text (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Add the text into a comment on the event you want the text to show up over.
 * It is important to note that the space is required between the ":" and text.
 *
 *  event_text : TEXT
 *
 * Example:
 *
 *  event_text : I'm The Boss
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
var Imported = Imported || {};
Imported.MOG_EventText = true;
var Moghunter = Moghunter || {}; 

Moghunter.parameters = PluginManager.parameters('MOG_EventText');
Moghunter.charText_x = Number(Moghunter.parameters['X axis'] || 0);
Moghunter.charText_y = Number(Moghunter.parameters['Y axis'] || 0);
Moghunter.charText_Size = Number(Moghunter.parameters['Font Size'] || 18);
	
//=============================================================================
// ■■■ Character Base ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Init Members
//==============================
var _alias_mog_eventext_cbase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
	_alias_mog_eventext_cbase_initMembers.call(this);
	this._char_text = [false, ""];
};

//=============================================================================
// ■■■ Game Event ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Setup Page
//==============================
var _alias_mog_eventext_gevent_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
	_alias_mog_eventext_gevent_setupPage.call(this);
	this.check_event_text();
};

//==============================
// * Check Event Text
//==============================
Game_Event.prototype.check_event_text = function() {
	this._need_clear_text = true
	if (!this._erased && this.page()) {
		this.list().forEach((l) => {
			if (l.code === 108) {
				const comment = l.parameters[0].split(' : ');
				if (comment[0].toLowerCase() == "event_text") {
					this._char_text = [true, String(comment[1])];
					this._need_clear_text = false;
				}
			}
		}, this);
	};

	if (this._need_clear_text) {
		this._char_text = [true, ""]
	};
};

//=============================================================================
// ■■■ Sprite Character ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  Initialize
//==============================
var _alias_mog_eventext_schar_initialize = Sprite_Character.prototype.initialize;
Sprite_Character.prototype.initialize = function(character) {
	_alias_mog_eventext_schar_initialize.call(this,character);
	if (this._character && this._character._eventId) {
		this._character.check_event_text();
	}
};

//=============================================================================
// ■■■ Spriteset Map ■■■
//=============================================================================

//==============================
// ♦ ALIAS ♦  create Lower Layer
//==============================
var _alias_mog_eventext_srmap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
	_alias_mog_eventext_srmap_createLowerLayer.call(this);
	this.create_event_text_field();
};

//==============================
// * create Event Text Field
//==============================
Spriteset_Map.prototype.create_event_text_field = function() {
	this._etextField = new Sprite();
	this._baseSprite.addChild(this._etextField);
	this._sprite_char_text = [];
	for (let i = 0; i < this._characterSprites.length; i++) {
		this._sprite_char_text[i] = new Sprite_CharText(this._characterSprites[i]);
		this._etextField.addChild(this._sprite_char_text[i]);
	}
};

//=============================================================================
// ■■■ Sprite CharText ■■■
//=============================================================================
function Sprite_CharText() { this.initialize.apply(this, arguments); };

Sprite_CharText.prototype = Object.create(Sprite.prototype);
Sprite_CharText.prototype.constructor = Sprite_CharText;

//==============================
// * Initialize
//==============================
Sprite_CharText.prototype.initialize = function(target) {
	Sprite.prototype.initialize.call(this);
	this.sprite_char = target;
};

//==============================
// * Character
//==============================
Sprite_CharText.prototype.character = function() {
	return this.sprite_char._character;
};

//==============================
// * Update Char Text
//==============================
Sprite_CharText.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if (this.character()._char_text[0]) {
		this.refresh_char_text();
	}
	
	if (!this._char_text) return;

	this._char_text.x = this.textX_axis();
	this._char_text.y = this.textY_axis();
};

//==============================
// * Create Char Text
//==============================
Sprite_CharText.prototype.create_char_text = function() {
	if (this._char_text) {
		this.removeChild(this._char_text);
	}

	if (this.character()._char_text[1] === "") return;

	this._char_text = new Sprite(new Bitmap(140,32));
	this._char_text.anchor.x = 0.5;
	this._char_text.y = -(this.sprite_char.patternHeight());
	this._char_text.bitmap.fontSize = Moghunter.charText_Size;
	this.addChild(this._char_text);
};

//==============================
// * Refresh Char Text
//==============================
Sprite_CharText.prototype.refresh_char_text = function() {
	this.create_char_text();
	this.character()._char_text[0] = false;
	if (this.character()._char_text[1] === "") return;

	const text = this.character()._char_text[1];
	this._char_text.bitmap.clear();
	this._char_text.bitmap.drawText(text,0,0,135,32,"center");
};

//==============================
// * Text X Axis
//==============================
Sprite_CharText.prototype.textX_axis = function() {
	return Moghunter.charText_x + this.sprite_char.x;
};

//==============================
// * Text Y Axis
//==============================
Sprite_CharText.prototype.textY_axis = function() {
	return -(this.sprite_char.patternHeight() + 24) + Moghunter.charText_y + this.sprite_char.y;
};