//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.0.2 ESCRIBE] Enables "describing" the event with some text and/or an icon.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This plugin allows the functionality to have events with text and/or icons
 * over them. These can also be only visible when the player is within a
 * specified distance from the event.
 *
 * In order to utilize this functionality, add a comment to an event with one
 * of the following tags below to create text/icons that show up on the event:
 *
 * <text:EVENT_TEXT>
 * Where EVENT_TEXT is whatever text you want to show on this event.
 *
 * <icon:ICON_INDEX>
 * Where ICON_INDEX is the icon index of the icon to show on this event.
 *
 * <proximityText:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be
 * within in order to see the text on this event. DISTANCE is required- to
 * require the player stand directly on the event, use <proximityText:0>
 * explicitly.
 *
 * <proximityIcon:DISTANCE>
 * Where DISTANCE is the distance in tiles/squares that the player must be
 * within in order to see the icon on this event. DISTANCE is required- to
 * require the player stand directly on the event, use <proximityIcon:0>
 * explicitly.
 * ============================================================================
 * NOTE:
 * Proximity tags are optional. If they are not added to the event alongside
 * the text or icon tag, then the text/icon will always be visible while the
 * event is visible on the map.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    Text escriptions are now horizontally centered on their event. The map
 *    coordinate was being added into a pixel offset, drifting every label one
 *    pixel to the right per tile from the left edge of the map.
 *    Escription height is now measured from the character sprite instead of
 *    being picked from the sheet's "$" prefix, which is a single-character
 *    marker rather than a tall-character one. Small "$" sheets floated their
 *    labels far too high, and sheets taller than 96 pixels wore theirs inside
 *    the sprite. Sheets 48 and 96 pixels tall are unaffected.
 *    <proximityText:DISTANCE> now fades its text in. It was being gated on the
 *    icon's proximity, so an event with proximity text and no icon never
 *    showed the text at all.
 * - 1.0.1
 *    <proximityText>/<proximityIcon> now require an explicit DISTANCE; the
 *    no-argument form (implicit distance 0) is no longer supported- use
 *    <proximityText:0>/<proximityIcon:0> instead.
 *    Removed a dead constructor-type check against Game_Event that was
 *    already unreachable behind an equivalent isEvent() check.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
*/

//#region src/plugins/escribe/core/_metadata/_pluginMetadata.js
var J_EscriptionsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/escribe/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ESCRIBE = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.ESCRIBE.Metadata = new J_EscriptionsPluginMetadata("J-Escriptions", "1.0.2");
/**
* All regular expressions used by this plugin.
*/
J.ESCRIBE.RegExp = {
	Text: /<text:(.+)>/i,
	IconIndex: /<icon:[ ]?(\d+)>/i,
	ProximityText: /<proximityText:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
	ProximityIcon: /<proximityIcon:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i
};
/**
* The collection of all aliased classes for extending.
*/
J.ESCRIBE.Aliased = {
	Game_Event: new Map(),
	Sprite_Character: new Map()
};

//#endregion
//#region src/plugins/escribe/core/_models/Escription.js
/**
* A single "describe" class which contains various data to describe this event on the map.
*/
var Escription = class {
	/**
	* Initializes the data about the event's describe.
	* @param {string} text The text to show on this event.
	* @param {number} iconIndex The index of the icon to show on this event.
	* @param {number} proximityTextRange The distance required for the describe text to be visible.
	* @param {number} proximityIconRange The distance required for the describe icon to be visible.
	*/
	constructor(text, iconIndex, proximityTextRange, proximityIconRange) {
		this._text = text;
		this._iconIndex = iconIndex;
		this._proximityText = proximityTextRange;
		this._proximityIcon = proximityIconRange;
	}
	/**
	* Gets the text associated with this describe.
	* @returns {string}
	*/
	text() {
		return this._text;
	}
	/**
	* Gets the icon index associated with this describe.
	* @returns {number}
	*/
	iconIndex() {
		return this._iconIndex;
	}
	/**
	* Gets the distance required for this describe text to be visible.
	* Returns -1 when there is no proximity requirement.
	* @returns {number}
	*/
	proximityTextRange() {
		return this._proximityText;
	}
	/**
	* Gets the distance required for this describe icon to be visible.
	* Returns -1 when there is no proximity requirement.
	* @returns {number}
	*/
	proximityIconRange() {
		return this._proximityIcon;
	}
};

//#endregion
//#region src/plugins/escribe/core/objects/Game_Event.js
/**
* Hooks into the initialization to add our members for containing event data.
*/
J.ESCRIBE.Aliased.Game_Event.set("initMembers", Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function() {
	J.ESCRIBE.Aliased.Game_Event.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with escriptions.
	*/
	this._j._event ||= {};
	/**
	* The describe data for this event.
	* @type {Escription}
	*/
	this._j._event._describe = null;
	/**
	* Whether or not the player is in-proximity for the text.
	* @type {boolean}
	*/
	this._j._event._playerNearbyText = null;
	/**
	* Whether or not the player is in-proximity for the icon.
	* @type {boolean}
	*/
	this._j._event._playerNearbyIcon = null;
	/**
	* Whether or not the escription needs adding.
	* @type {boolean}
	*/
	this._j._event._needsAdding = false;
	/**
	* Whether or not the escription needs removal.
	* @type {boolean}
	*/
	this._j._event._needsRemoval = false;
};
/**
* Gets the describe data for this event.
* @returns {Escription}
*/
Game_Event.prototype.escribeData = function() {
	return this._j._event._describe;
};
/**
* Sets the describe data for this event.
* @param {Escription} describeData The new describe data.
*/
Game_Event.prototype.setEscribeData = function(describeData) {
	this._j._event._describe = describeData;
};
/**
* Sets whether or not the player is witin the proximity to see the describe text.
* @param {boolean} nearby True if the player is nearby, false otherwise.
*/
Game_Event.prototype.setPlayerNearbyForText = function(nearby) {
	this._j._event._playerNearbyText = nearby;
};
/**
* Gets whether or not the player is witin the proximity to see the describe text.
* @returns {boolean} True if the player is close enough to see the describe text, false otherwise.
*/
Game_Event.prototype.getPlayerNearbyForText = function() {
	return this._j._event._playerNearbyText;
};
/**
* Sets whether or not the player is witin the proximity to see the describe icon.
* @param {boolean} nearby True if the player is nearby, false otherwise.
*/
Game_Event.prototype.setPlayerNearbyForIcon = function(nearby) {
	this._j._event._playerNearbyIcon = nearby;
};
/**
* Gets whether or not the player is witin the proximity to see the describe icon.
* @returns {boolean} True if the player is close enough to see the describe text, false otherwise.
*/
Game_Event.prototype.getPlayerNearbyForIcon = function() {
	return this._j._event._playerNearbyIcon;
};
/**
* Gets whether or not this event has non-empty describe data.
* @returns {boolean}
*/
Game_Event.prototype.hasEscribeData = function() {
	const describe = this.escribeData();
	return !!describe;
};
Game_Event.prototype.needsEscribeAdding = function() {
	return this._j._event._needsAdding;
};
Game_Event.prototype.flagForEscribeAddition = function() {
	this._j._event._needsAdding = true;
};
Game_Event.prototype.acknowledgeEscribeAddition = function() {
	this._j._event._needsAdding = false;
};
Game_Event.prototype.needsEscribeRemoval = function() {
	return this._j._event._needsRemoval;
};
Game_Event.prototype.flagForEscribeRemoval = function() {
	this._j._event._needsRemoval = true;
};
Game_Event.prototype.acknowledgeEscribeRemoval = function() {
	this._j._event._needsRemoval = false;
};
/**
* Extends the page settings for events and adds on custom parameters to this event.
*/
J.ESCRIBE.Aliased.Game_Event.set("setupPage", Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function() {
	J.ESCRIBE.Aliased.Game_Event.get("setupPage").call(this);
	this.refreshEscription();
};
/**
* Refreshes the escription data for this event based on the current page.
*/
Game_Event.prototype.refreshEscription = function() {
	this.parseEscriptionComments();
};
/**
* Parses the event comments to discern the describe data, if any.
*/
Game_Event.prototype.parseEscriptionComments = function() {
	if (!this.canParseEscriptionComments()) return;
	const text = this.parseEscriptionTextValue();
	const iconIndex = this.parseEscriptionIconIndexValue();
	const proximityText = this.parseEscriptionTextProximityValue();
	const proximityIcon = this.parseEscriptionIconProximityValue();
	if (text || iconIndex > -1) {
		const describe = new Escription(text, iconIndex, proximityText, proximityIcon);
		this.setEscribeData(describe);
		this.flagForEscribeAddition();
	} else {
		this.setEscribeData(null);
		this.flagForEscribeRemoval();
	}
};
/**
* Determines whether or not we can parse the comments for escription data.
* @returns {boolean} True if we can, false otherwise.
*/
Game_Event.prototype.canParseEscriptionComments = function() {
	if (J.ABS && (this.isJabsAction() || this.isJabsLoot())) return false;
	if (this.pageIndex() === -1 || this.pageIndex() === -2) return false;
	return true;
};
/**
* Extracts the escription text value from the comment event commands.
* @returns {string|String.empty}
*/
Game_Event.prototype.parseEscriptionTextValue = function() {
	const text = this.extractValueByRegex(J.ESCRIBE.RegExp.Text, String.empty);
	return text;
};
/**
* Extracts the escription icon index value from the comment event commands.
* @returns {number|-1}
*/
Game_Event.prototype.parseEscriptionIconIndexValue = function() {
	const iconIndex = this.extractValueByRegex(J.ESCRIBE.RegExp.IconIndex, -1);
	return iconIndex;
};
/**
* Extracts the escription text proximity value from the comment event commands.
* @returns {number|-1}
*/
Game_Event.prototype.parseEscriptionTextProximityValue = function() {
	const textProximity = this.extractValueByRegex(J.ESCRIBE.RegExp.ProximityText, -1);
	return textProximity;
};
/**
* Extracts the escription icon proximity value from the comment event commands.
* @returns {number|-1}
*/
Game_Event.prototype.parseEscriptionIconProximityValue = function() {
	const iconProximity = this.extractValueByRegex(J.ESCRIBE.RegExp.ProximityIcon, -1);
	return iconProximity;
};
/**
* Extends {@link Game_Event.update}.<br/>
* Also updates the describe proximity information of the player for the describe data.
*/
J.ESCRIBE.Aliased.Game_Event.set("update", Game_Event.prototype.update);
Game_Event.prototype.update = function() {
	J.ESCRIBE.Aliased.Game_Event.get("update").call(this);
	if (this.hasProximityEscriptionData()) {
		this.updateEscribeTextProximity();
		this.updateEscribeIconProximity();
	}
};
/**
* Gets whether or not this event has a proximity describe associated with it.
* @returns {boolean} True if there is something with proximity, false otherwise.
*/
Game_Event.prototype.hasProximityEscriptionData = function() {
	const describe = this.escribeData();
	if (!describe) return false;
	const hasProximity = describe.proximityTextRange() > -1 || describe.proximityIconRange() > -1;
	return hasProximity;
};
/**
* Updates whether or not the player is within proximity for the describe text to be visible.
*/
Game_Event.prototype.updateEscribeTextProximity = function() {
	const describe = this.escribeData();
	if (describe.proximityTextRange() < 0) return;
	if (describe.proximityTextRange() >= this.distanceFromPlayer()) {
		this.setPlayerNearbyForText(true);
	} else {
		this.setPlayerNearbyForText(false);
	}
};
/**
* Updates whether or not the player is within proximity for the describe icon to be visible.
*/
Game_Event.prototype.updateEscribeIconProximity = function() {
	const describe = this.escribeData();
	if (describe.proximityIconRange() < 0) return;
	if (describe.proximityIconRange() >= this.distanceFromPlayer()) {
		this.setPlayerNearbyForIcon(true);
	} else {
		this.setPlayerNearbyForIcon(false);
	}
};

//#endregion
//#region src/plugins/escribe/core/objects/Game_Character.js
/**
* Creates the method for overwriting by subclasses.
* At this level, it will return false for non-events.
* @abstract
* @returns {boolean}
*/
Game_Character.prototype.hasEscribeData = function() {
	return false;
};
/**
* Creates the method for overwriting by subclasses.
* At this level, it will do nothing.
*/
Game_Character.prototype.parseEscriptionComments = function() {};

//#endregion
//#region src/plugins/escribe/core/sprites/Sprite_Character.js
/**
* Hooks into the initmembers function to add our properties.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("initMembers", Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function() {
	J.ESCRIBE.Aliased.Sprite_Character.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with escriptions.
	*/
	this._j._event = {
		/**
		* A grouping of all properties associated with text-based escriptions.
		*/
		_textDescribe: {
			/**
			* The text.
			* @type {string}
			*/
			_text: String.empty,
			/**
			* The text sprite.
			* @type {Sprite_BaseText}
			*/
			_sprite: null,
			/**
			* The proximity required to see this text.
			* -1 proximity means the text will always be visible while the character exists.
			* @type {number}
			*/
			_proximity: -1
		},
		/**
		* A grouping of all properties associated with icon-based escriptions.
		*/
		_iconDescribe: {
			/**
			* The icon index.
			* @type {number}
			*/
			_iconIndex: -1,
			/**
			* The icon sprite.
			* @type {Sprite_Icon}
			*/
			_sprite: null,
			/**
			* The proximity required to see this icon.
			* -1 proximity means the icon will always be visible while the character exists.
			* @type {number}
			*/
			_proximity: -1
		}
	};
};
/**
* Gets the data related to the escription members.
*/
Sprite_Character.prototype.allEscriptionData = function() {
	return this._j._event;
};
/**
* Gets the data related to the text escription information.
*/
Sprite_Character.prototype.escribeTextData = function() {
	const escriptionData = this.allEscriptionData();
	return escriptionData._textDescribe;
};
/**
* Gets the text associated with the text escription.
* @returns {string}
*/
Sprite_Character.prototype.escriptionText = function() {
	const escriptionTextData = this.escribeTextData();
	return escriptionTextData._text;
};
/**
* Sets the text associated with the text escription.
* @params {string} text The new escription text.
*/
Sprite_Character.prototype.setEscriptionText = function(text) {
	const escriptionTextData = this.escribeTextData();
	escriptionTextData._text = text;
};
/**
* Gets the sprite associated with the text escription.
* @returns {Sprite_BaseText|null}
*/
Sprite_Character.prototype.escriptionTextSprite = function() {
	const escriptionTextData = this.escribeTextData();
	return escriptionTextData._sprite;
};
/**
* Sets the sprite associated with the text escription.
* @param {Sprite_BaseText} textSprite The new sprite containing the text.
*/
Sprite_Character.prototype.setEscriptionTextSprite = function(textSprite) {
	const escriptionTextData = this.escribeTextData();
	escriptionTextData._sprite = textSprite;
};
/**
* Gets the distance the player must be within in order for the text to be rendered.
* If the value is -1, then the text can be seen from any distance.
* @returns {number}
*/
Sprite_Character.prototype.escriptionTextProximity = function() {
	const escriptionTextData = this.escribeTextData();
	return escriptionTextData._proximity;
};
/**
* Sets the distance the player must be within in order for the text to be rendered.
* If the value is -1, then the text can be seen from any distance.
* @param {number} textProximity The proximity to see this text.
*/
Sprite_Character.prototype.setEscriptionTextProximity = function(textProximity) {
	const escriptionTextData = this.escribeTextData();
	escriptionTextData._proximity = textProximity;
};
/**
* Gets the data related to the icon escription information.
*/
Sprite_Character.prototype.escribeIconData = function() {
	const escriptionData = this.allEscriptionData();
	return escriptionData._iconDescribe;
};
/**
* Gets the icon index associated with the icon escription.
* @returns {number}
*/
Sprite_Character.prototype.escriptionIconIndex = function() {
	const escriptionIconData = this.escribeIconData();
	return escriptionIconData._iconIndex;
};
/**
* Gets the icon index associated with the icon escription.
* @param {number} iconIndex The new icon index.
*/
Sprite_Character.prototype.setEscriptionIconIndex = function(iconIndex) {
	const escriptionIconData = this.escribeIconData();
	escriptionIconData._iconIndex = iconIndex;
};
/**
* Gets the sprite associated with the icon escription.
* @returns {Sprite_Icon|null}
*/
Sprite_Character.prototype.escriptionIconSprite = function() {
	const escriptionIconData = this.escribeIconData();
	return escriptionIconData._sprite;
};
/**
* Sets the sprite associated with the icon escription.
* @param {Sprite_Icon} iconSprite The new sprite containing the icon.
*/
Sprite_Character.prototype.setEscriptionIconSprite = function(iconSprite) {
	const escriptionIconData = this.escribeIconData();
	escriptionIconData._sprite = iconSprite;
};
/**
* Gets whether or not the player is in proximity to view the icon portion of the escription.
* @returns {number}
*/
Sprite_Character.prototype.escriptionIconProximity = function() {
	const escriptionIconData = this.escribeIconData();
	return escriptionIconData._proximity;
};
/**
* Sets whether or not the player is in proximity to view the icon portion of the escription.
* @param {number} iconProximity The proximity to see this icon.
*/
Sprite_Character.prototype.setEscriptionIconProximity = function(iconProximity) {
	const escriptionIconData = this.escribeIconData();
	escriptionIconData._proximity = iconProximity;
};
/**
* Checks whether or not this sprite has a character with escription data.
* @returns {boolean}
*/
Sprite_Character.prototype.hasCharacterEscriptionData = function() {
	const character = this.character();
	if (!character) return false;
	return character.hasEscribeData();
};
Sprite_Character.prototype.needsEscribeAdding = function() {
	const character = this.character();
	if (!character) return false;
	if (!character.isEvent()) return false;
	return character.needsEscribeAdding();
};
Sprite_Character.prototype.needsEscribeRemoval = function() {
	const character = this.character();
	if ((this.escribeTextData() || this.escribeIconData()) && !character) return true;
	if (!character) return true;
	if (!character.isEvent()) return false;
	return character.needsEscribeRemoval();
};
/**
* Gets this sprite's underlying character's escription data.
* @returns {Escription|null}
*/
Sprite_Character.prototype.characterEscriptionData = function() {
	const character = this.character();
	if (!character) return null;
	return character.escribeData();
};
/**
* Checks whether or not this sprite's text is visible based on the player's proximity.
* @returns {boolean}
*/
Sprite_Character.prototype.characterCanSeeText = function() {
	const character = this.character();
	if (!character) return false;
	return character.getPlayerNearbyForText();
};
/**
* Checks whether or not this sprite's icon is visible based on the player's proximity.
* @returns {boolean}
*/
Sprite_Character.prototype.characterCanSeeIcon = function() {
	const character = this.character();
	if (!character) return false;
	return character.getPlayerNearbyForIcon();
};
/**
* Extends {@link Sprite_Character.isEmptyCharacter}.<br/>
* If the character has describe data, don't make it invisible for the time being.
* @returns {boolean} True if the character should be drawn, false otherwise.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("isEmptyCharacter", Sprite_Character.prototype.isEmptyCharacter);
Sprite_Character.prototype.isEmptyCharacter = function() {
	if (this.hasCharacterEscriptionData() && !this.isErased()) return false;
	return J.ESCRIBE.Aliased.Sprite_Character.get("isEmptyCharacter").call(this);
};
/**
* The height an escription floats above this sprite's feet, in pixels.<br/>
* Both the text and the icon hang off this one number so they never drift apart.
*
* The thirty-two is the gap that reads as "labelled" rather than "collided", measured from the top
* of the character rather than guessed from its sheet. A `$` prefix means a sheet holds a single
* character, not that the character is tall - `$o_grass` is a `$` sheet with 47 pixel frames, and a
* height picked off that prefix buried its label sixty pixels up in the scenery while `$dragon`, at
* 120, wore its label inside its own silhouette.
*
* This is deliberately recomputed every frame rather than settled when the sprite is built.
* {@link Sprite_Character.patternHeight} divides the character bitmap's height, and escriptions are
* created from `setCharacterBitmap` - one line after the image is *requested*. On a cold load that
* bitmap has not decoded yet and reports a height of zero, so a value computed there is right only
* when the image happened to be cached. Reading it per frame costs one subtraction and is correct
* the moment the image lands, and again whenever a page change swaps the sprite for a taller one.
* @returns {number}
*/
Sprite_Character.prototype.escriptionBaseY = function() {
	return -(this.patternHeight() + 32);
};
/**
* Parses the event comments on the character that belongs to this sprite.
*/
Sprite_Character.prototype.refreshCharacterEscription = function() {
	const character = this.character();
	if (!character) return;
	if (!character.isEvent()) return;
	character.refreshEscription();
};
/**
* Extends {@link Sprite_Character.setCharacterBitmap}.<br/>
* Sets up the initial escription sprites and renders them as applicable.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("setCharacterBitmap", Sprite_Character.prototype.setCharacterBitmap);
Sprite_Character.prototype.setCharacterBitmap = function() {
	J.ESCRIBE.Aliased.Sprite_Character.get("setCharacterBitmap").call(this);
	this.refreshCharacterEscription();
	if (this.hasCharacterEscriptionData()) {
		this.setupEscribeSprites();
	}
};
/**
* Sets up the visual components of the describe for this event.
*/
Sprite_Character.prototype.setupEscribeSprites = function() {
	this.setupDescribeText();
	this.setupDescribeIcon();
	const character = this.character();
	character.acknowledgeEscribeAddition();
};
/**
* Sets up the describe text for this event.
*/
Sprite_Character.prototype.setupDescribeText = function() {
	if (this.children.includes(this.escriptionTextSprite())) {
		this.removeEscriptionTextData();
	}
	const sprite = this.createDescribeTextSprite();
	this.setEscriptionTextSprite(sprite);
	this.addChild(sprite);
};
/**
* Creates the describe text sprite for this event.
* @returns {Sprite_BaseText}
*/
Sprite_Character.prototype.createDescribeTextSprite = function() {
	const describe = this.characterEscriptionData();
	const describeText = describe.text();
	this.setEscriptionText(describeText);
	this.setEscriptionTextProximity(describe.proximityTextRange());
	const sprite = new Sprite_BaseText().setText(describeText).setFontSize(14).setAlignment(Sprite_BaseText.Alignments.Center).setColor("#ffffff");
	const x = -(sprite.width / 2);
	sprite.move(x, this.escriptionBaseY());
	if (this.escriptionTextProximity() > -1) {
		sprite.opacity = 0;
	}
	return sprite;
};
/**
* Sets up the describe icon for this event.
*/
Sprite_Character.prototype.setupDescribeIcon = function() {
	if (this.children.includes(this.escriptionIconSprite())) {
		this.removeEscriptionIconData();
	}
	const sprite = this.createDescribeIconSprite();
	this.setEscriptionIconSprite(sprite);
	this.addChild(sprite);
};
/**
* Creates the describe icon sprite for this event.
* @returns {Sprite_Icon}
*/
Sprite_Character.prototype.createDescribeIconSprite = function() {
	const describe = this.characterEscriptionData();
	const describeIconIndex = describe.iconIndex();
	this.setEscriptionIconIndex(describeIconIndex);
	this.setEscriptionIconProximity(describe.proximityIconRange());
	const x = 0 - ImageManager.iconWidth / 2 - 4;
	const sprite = new Sprite_Icon(describeIconIndex);
	sprite.move(x, this.escriptionBaseY() - 32);
	if (this.escriptionIconProximity() > -1) {
		sprite.opacity = 0;
	}
	return sprite;
};
/**
* Refreshes the escription data for the underlying character's escription data.
*/
Sprite_Character.prototype.refreshEscriptionIfNeeded = function() {
	if (this.needsEscribeRemoval()) {
		this.removeEscriptions();
	}
	if (this.needsEscribeAdding()) {
		this.setupEscribeSprites();
	}
};
/**
* Hooks into the update function to update our describe sprites.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("update", Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function() {
	J.ESCRIBE.Aliased.Sprite_Character.get("update").call(this);
	this.updateEscriptions();
};
/**
* The update loop for managing the addition/removal/visibility of escriptions.
*/
Sprite_Character.prototype.updateEscriptions = function() {
	this.refreshEscriptionIfNeeded();
	if (this.hasCharacterEscriptionData()) {
		this.updateEscribe();
	}
};
/**
* Removes all escription data from this character sprite.
*/
Sprite_Character.prototype.removeEscriptions = function() {
	this.removeEscriptionTextData();
	this.removeEscriptionIconData();
	const character = this.character();
	if (character) {
		character.acknowledgeEscribeRemoval();
	}
};
/**
* Removes all escription text data.
*/
Sprite_Character.prototype.removeEscriptionTextData = function() {
	if (this.escriptionTextSprite()) {
		this.escriptionTextSprite().destroy();
	}
	this.setEscriptionTextSprite(null);
	this.setEscriptionText(String.empty);
	this.setEscriptionTextProximity(-1);
};
/**
* Removes all escription icon data.
*/
Sprite_Character.prototype.removeEscriptionIconData = function() {
	if (this.escriptionIconSprite()) {
		this.escriptionIconSprite().destroy();
	}
	this.setEscriptionIconSprite(null);
	this.setEscriptionIconIndex(-1);
	this.setEscriptionIconProximity(-1);
};
/**
* Updates all describe sprites where applicable.
*/
Sprite_Character.prototype.updateEscribe = function() {
	this.updateEscriptionPositions();
	this.updateTextEscribe();
	this.updateIconEscribe();
};
/**
* Parks the text and icon escriptions above the character sprite.
*
* See {@link Sprite_Character.escriptionBaseY} for why this is a per-frame job rather than
* something the sprites could have been built with.
*/
Sprite_Character.prototype.updateEscriptionPositions = function() {
	const baseY = this.escriptionBaseY();
	this.escriptionTextSprite().y = baseY;
	this.escriptionIconSprite().y = baseY - 32;
};
/**
* Manages the visibility of the describe text on this sprite's event.
*/
Sprite_Character.prototype.updateTextEscribe = function() {
	if (!this.escriptionText()) return;
	if (this.escriptionTextProximity() < 0) return;
	if (this.characterCanSeeText()) {
		this.fadeInEscribeText();
	} else {
		this.fadeOutEscribeText();
	}
};
/**
* Fades out the describe text.
*/
Sprite_Character.prototype.fadeOutEscribeText = function() {
	const sprite = this.escriptionTextSprite();
	if (sprite.opacity === 0) return;
	if (sprite.opacity < 0) {
		sprite.opacity = 0;
		return;
	}
	sprite.opacity -= 17;
};
/**
* Fades in the describe text.
*/
Sprite_Character.prototype.fadeInEscribeText = function() {
	const sprite = this.escriptionTextSprite();
	if (sprite.opacity === 255) return;
	if (sprite.opacity > 255) {
		sprite.opacity = 255;
		return;
	}
	sprite.opacity += 17;
};
/**
* Manages visibility of the describe icon on this sprite's event.
*/
Sprite_Character.prototype.updateIconEscribe = function() {
	if (this.escriptionIconIndex() < 0) return;
	if (this.escriptionIconProximity() < 0) return;
	if (this.characterCanSeeIcon()) {
		this.fadeInEscribeIcon();
	} else {
		this.fadeOutEscribeIcon();
	}
};
/**
* Fades in the describe icon.
*/
Sprite_Character.prototype.fadeOutEscribeIcon = function() {
	const sprite = this.escriptionIconSprite();
	if (sprite.opacity === 0) return;
	if (sprite.opacity < 0) {
		sprite.opacity = 0;
		return;
	}
	sprite.opacity -= 17;
};
/**
* Fades out the describe icon.
*/
Sprite_Character.prototype.fadeInEscribeIcon = function() {
	const sprite = this.escriptionIconSprite();
	if (sprite.opacity === 255) return;
	if (sprite.opacity > 255) {
		sprite.opacity = 255;
		return;
	}
	sprite.opacity += 17;
};

//#endregion
//# sourceMappingURL=J-Escriptions.js.map