//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.1.0 ESCRIBE] Enables "describing" the event with some text and/or an icon.
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
 * - 1.1.0
 *    Multiple <text> tags now render as multiple lines, rather than the last
 *    one silently winning. An icon rides above the whole block.
 *    Collapsed text and icons into one internal escription type.
 *    Fixed unreachable opacity branches and a negative-zero offset.
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
J.ESCRIBE.Metadata = new J_EscriptionsPluginMetadata("J-Escriptions", "1.1.0");
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
* One thing floating above an event: a line of text, or an icon.
*
* Text and icons were originally two parallel features written side by side, but they only ever
* differed in what they draw and where they park. Modelling them as one kind-tagged thing lets an
* event hold a list of them, which in turn lets parsing, proximity, sprite construction and
* visibility each run once in a loop instead of twice in longhand.
*/
var Escription = class Escription {
	/**
	* The kinds of thing an escription can be.
	* The kind decides which sprite draws it and where that sprite parks relative to the character.
	*/
	static Kinds = {
		/**
		* A line of text.
		*/
		Text: "text",
		/**
		* An icon from the icon sheet.
		*/
		Icon: "icon"
	};
	/**
	* The proximity range meaning "no proximity requirement at all", which is how an escription says
	* it is visible for as long as its event is.
	* @type {number}
	*/
	static ALWAYS_VISIBLE = -1;
	/**
	* Which kind of escription this is, from {@link Escription.Kinds}.
	* @type {string}
	*/
	_kind = Escription.Kinds.Text;
	/**
	* What this escription draws: the line of text, or the index of the icon.
	* @type {string|number}
	*/
	_content = String.empty;
	/**
	* How close the player must stand for this to become visible, in tiles.
	* {@link Escription.ALWAYS_VISIBLE} means there is no requirement to meet.
	* @type {number}
	*/
	_proximityRange = Escription.ALWAYS_VISIBLE;
	/**
	* Whether the player is currently close enough to see this.
	* Meaningless for an escription with no proximity requirement, which is always visible.
	* @type {boolean}
	*/
	_playerNearby = false;
	/**
	* @param {string} kind Which kind of escription this is, from {@link Escription.Kinds}.
	* @param {string|number} content The text to draw, or the index of the icon to draw.
	* @param {number} proximityRange The tiles the player must be within, or ALWAYS_VISIBLE.
	*/
	constructor(kind, content, proximityRange) {
		this.initMembers(kind, content, proximityRange);
	}
	/**
	* Initializes the members of this class.
	* @param {string} kind Which kind of escription this is, from {@link Escription.Kinds}.
	* @param {string|number} content The text to draw, or the index of the icon to draw.
	* @param {number} proximityRange The tiles the player must be within, or ALWAYS_VISIBLE.
	*/
	initMembers(kind, content, proximityRange) {
		this._kind = kind;
		this._content = content;
		this._proximityRange = proximityRange;
	}
	/**
	* Gets which kind of escription this is, from {@link Escription.Kinds}.
	* @returns {string}
	*/
	kind() {
		return this._kind;
	}
	/**
	* Gets what this escription draws- the line of text, or the index of the icon.
	* @returns {string|number}
	*/
	content() {
		return this._content;
	}
	/**
	* Gets how close the player must stand for this to become visible, in tiles.
	* @returns {number}
	*/
	proximityRange() {
		return this._proximityRange;
	}
	/**
	* Whether this only becomes visible once the player has come close enough.
	* @returns {boolean}
	*/
	hasProximity() {
		return this.proximityRange() > Escription.ALWAYS_VISIBLE;
	}
	/**
	* Whether the player is currently close enough to see this.
	* @returns {boolean}
	*/
	isPlayerNearby() {
		return this._playerNearby;
	}
	/**
	* Records whether the player has come close enough to see this.
	* @param {boolean} nearby True if the player is within range, false otherwise.
	*/
	setPlayerNearby(nearby) {
		this._playerNearby = nearby;
	}
	/**
	* Whether this should currently be drawn on the map.
	* @returns {boolean}
	*/
	isVisible() {
		if (!this.hasProximity()) return true;
		return this.isPlayerNearby();
	}
	/**
	* A signature of everything about this escription that decides what its sprite looks like.
	*
	* The sprite layer holds no reference to the escriptions themselves- it compares this signature
	* against the one it last built from, and rebuilds when they differ. Proximity belongs in it
	* because a gated escription is born invisible and an ungated one is not, which is a difference
	* in construction rather than something the update loop could correct afterward.
	* @returns {string}
	*/
	key() {
		return `${this.kind()}:${this.content()}:${this.proximityRange()}`;
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
	* Everything this event currently declares floating above itself.
	*
	* An empty list is the ordinary state and means the event describes nothing- it is also what an
	* event that used to describe something looks like after a page change, which is what lets the
	* sprite layer discover a removal by the same comparison it discovers an addition with.
	* @type {Escription[]}
	*/
	this._j._event._escriptions = [];
};
/**
* Gets everything this event declares floating above itself.
* @returns {Escription[]} The escriptions; empty when this event describes nothing.
*/
Game_Event.prototype.escriptions = function() {
	return this._j._event._escriptions;
};
/**
* Sets everything this event declares floating above itself.
* @param {Escription[]} escriptions The escriptions parsed from the current page.
*/
Game_Event.prototype.setEscriptions = function(escriptions) {
	this._j._event._escriptions = escriptions;
};
/**
* Whether this event declares anything floating above itself.
* @returns {boolean}
*/
Game_Event.prototype.hasEscriptions = function() {
	return this.escriptions().length > 0;
};
/**
* Extends the page settings for events and adds on custom parameters to this event.
*/
J.ESCRIBE.Aliased.Game_Event.set("setupPage", Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function() {
	J.ESCRIBE.Aliased.Game_Event.get("setupPage").call(this);
	this.parseEscriptionComments();
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
* Parses the event comments to discern what this event describes, if anything.
*
* **Every `<text>` tag on the page is its own line**, in the order they were written. That falls out
* of how RMMZ stores a comment box- one command per line- so an author writing three lines into one
* box gets three lines above the event, which is the shape the data was already in.
*
* The text lines come first and the icon last, and that order is a contract rather than an
* accident: the sprite layer pairs a sprite back to what it draws by index rather than by holding
* the escription, so both sides have to agree on the sequence.
*/
Game_Event.prototype.parseEscriptionComments = function() {
	if (!this.canParseEscriptionComments()) return;
	const commentNote = this.commentNote();
	const escriptions = [];
	const lines = RPGManager.getStringsFromNoteByRegex(commentNote, J.ESCRIBE.RegExp.Text);
	if (lines.length > 0) {
		const declaredRange = RPGManager.getNumberFromNoteByRegex(commentNote, J.ESCRIBE.RegExp.ProximityText, true);
		const proximity = declaredRange ?? Escription.ALWAYS_VISIBLE;
		lines.forEach((line) => escriptions.push(new Escription(Escription.Kinds.Text, line, proximity)));
	}
	const iconIndex = RPGManager.getNumberFromNoteByRegex(commentNote, J.ESCRIBE.RegExp.IconIndex, true);
	if (iconIndex !== null) {
		const declaredRange = RPGManager.getNumberFromNoteByRegex(commentNote, J.ESCRIBE.RegExp.ProximityIcon, true);
		const proximity = declaredRange ?? Escription.ALWAYS_VISIBLE;
		escriptions.push(new Escription(Escription.Kinds.Icon, iconIndex, proximity));
	}
	this.setEscriptions(escriptions);
};
/**
* Extends {@link Game_Event.update}.<br/>
* Also tracks whether the player has come close enough to see this event's escriptions.
*/
J.ESCRIBE.Aliased.Game_Event.set("update", Game_Event.prototype.update);
Game_Event.prototype.update = function() {
	J.ESCRIBE.Aliased.Game_Event.get("update").call(this);
	this.updateEscriptionProximity();
};
/**
* Updates whether the player is close enough to see each proximity-gated escription.
*/
Game_Event.prototype.updateEscriptionProximity = function() {
	const gated = this.escriptions().filter((escription) => escription.hasProximity());
	if (gated.length === 0) return;
	const distance = this.distanceFromPlayer();
	gated.forEach((escription) => escription.setPlayerNearby(escription.proximityRange() >= distance));
};

//#endregion
//#region src/plugins/escribe/core/objects/Game_Character.js
/**
* Creates the method for overwriting by subclasses.
* At this level, it will return an empty list for non-events.
* @abstract
* @returns {Escription[]}
*/
Game_Character.prototype.escriptions = function() {
	return [];
};
/**
* Creates the method for overwriting by subclasses.
* At this level, it will return false for non-events.
* @abstract
* @returns {boolean}
*/
Game_Character.prototype.hasEscriptions = function() {
	return false;
};
/**
* Creates the method for overwriting by subclasses.
* At this level, it will do nothing.
* @abstract
*/
Game_Character.prototype.parseEscriptionComments = function() {};

//#endregion
//#region src/plugins/escribe/core/sprites/Sprite_Character.js
/**
* The vertical distance between two stacked lines of escription text, in pixels.
* Two more than the font size, which is the leading that stops descenders in one line from
* touching the capitals in the next.
* @type {number}
*/
var ESCRIPTION_LINE_HEIGHT = 16;
/**
* The gap between the topmost line of escription text and an icon riding above it, in pixels.
* @type {number}
*/
var ESCRIPTION_ICON_GAP = 32;
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
		* The sprites currently drawn for this character's escriptions, in the order the character
		* declared them. This holds sprites and nothing else- what each one *means* is read back off
		* the character every frame, so a page change can never leave this pointing at a stale model.
		* @type {(Sprite_BaseText|Sprite_Icon)[]}
		*/
		_escriptionSprites: [],
		/**
		* The signature of the escriptions the sprites above were built from.
		*
		* This is the whole of the change detection. Comparing what the character says now against
		* what was built from replaces the flag-and-acknowledge handshake this plugin used to run
		* across two objects- a handshake that could desync, where a comparison cannot.
		* @type {string}
		*/
		_escriptionKey: String.empty
	};
};
/**
* Gets the sprites currently drawn for this character's escriptions.
* @returns {(Sprite_BaseText|Sprite_Icon)[]}
*/
Sprite_Character.prototype.escriptionSprites = function() {
	return this._j._event._escriptionSprites;
};
/**
* Sets the sprites currently drawn for this character's escriptions.
* @param {(Sprite_BaseText|Sprite_Icon)[]} sprites The sprites now being drawn.
*/
Sprite_Character.prototype.setEscriptionSprites = function(sprites) {
	this._j._event._escriptionSprites = sprites;
};
/**
* Gets the signature of the escriptions the current sprites were built from.
* @returns {string}
*/
Sprite_Character.prototype.escriptionKey = function() {
	return this._j._event._escriptionKey;
};
/**
* Sets the signature of the escriptions the current sprites were built from.
* @param {string} key The signature just built from.
*/
Sprite_Character.prototype.setEscriptionKey = function(key) {
	this._j._event._escriptionKey = key;
};
/**
* Gets the escriptions belonging to the character this sprite draws.
* @returns {Escription[]} The escriptions; empty when there is nothing to draw.
*/
Sprite_Character.prototype.characterEscriptions = function() {
	const character = this.character();
	if (!character) return [];
	if (!character.isEvent()) return [];
	return character.escriptions();
};
/**
* Whether the character this sprite draws currently describes anything.
* @returns {boolean}
*/
Sprite_Character.prototype.hasCharacterEscriptions = function() {
	return this.characterEscriptions().length > 0;
};
/**
* Builds the signature of a collection of escriptions, for comparison against what was last built.
* @param {Escription[]} escriptions The escriptions to summarize.
* @returns {string}
*/
Sprite_Character.prototype.escriptionSignature = function(escriptions) {
	return escriptions.map((escription) => escription.key()).join("|");
};
/**
* The height an escription floats above this sprite's feet, in pixels.<br/>
* Every escription hangs off this one number so they never drift apart.
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
* How many text lines the given escriptions amount to.
* @param {Escription[]} escriptions The escriptions to count through.
* @returns {number}
*/
Sprite_Character.prototype.escriptionLineCount = function(escriptions) {
	return escriptions.filter((escription) => escription.kind() === Escription.Kinds.Text).length;
};
/**
* The offset from {@link Sprite_Character.escriptionBaseY} that one escription sits at.
*
* Text lines stack **upward**, so the last line sits on the base and the first sits highest- a
* block therefore reads top to bottom, and a single line lands exactly where a single line has
* always landed. The icon clears the whole block rather than only the first line, so writing a
* second line pushes the icon up with the text instead of burying it in the middle of it.
* @param {Escription} escription The escription being placed.
* @param {number} index Its position in the character's list.
* @param {number} lineCount How many text lines the character declares in total.
* @returns {number}
*/
Sprite_Character.prototype.escriptionOffsetY = function(escription, index, lineCount) {
	if (escription.kind() === Escription.Kinds.Icon) {
		const topLine = Math.max(lineCount - 1, 0);
		return 0 - (topLine * ESCRIPTION_LINE_HEIGHT + ESCRIPTION_ICON_GAP);
	}
	const linesAbove = lineCount - 1 - index;
	return 0 - linesAbove * ESCRIPTION_LINE_HEIGHT;
};
/**
* Extends {@link Sprite_Character.isEmptyCharacter}.<br/>
* If the character describes something, don't make it invisible for the time being.
* @returns {boolean} True if the character should be drawn, false otherwise.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("isEmptyCharacter", Sprite_Character.prototype.isEmptyCharacter);
Sprite_Character.prototype.isEmptyCharacter = function() {
	if (this.hasCharacterEscriptions() && !this.isErased()) return false;
	return J.ESCRIBE.Aliased.Sprite_Character.get("isEmptyCharacter").call(this);
};
/**
* Extends {@link Sprite_Character.setCharacterBitmap}.<br/>
* Also re-reads what the underlying character describes.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("setCharacterBitmap", Sprite_Character.prototype.setCharacterBitmap);
Sprite_Character.prototype.setCharacterBitmap = function() {
	J.ESCRIBE.Aliased.Sprite_Character.get("setCharacterBitmap").call(this);
	this.refreshCharacterEscriptions();
};
/**
* Asks the underlying character to re-read its own event comments.
*/
Sprite_Character.prototype.refreshCharacterEscriptions = function() {
	const character = this.character();
	if (!character) return;
	if (!character.isEvent()) return;
	character.parseEscriptionComments();
};
/**
* Rebuilds this sprite's escription sprites, but only when what the character describes has
* actually changed since they were built.
*/
Sprite_Character.prototype.refreshEscriptionSpritesIfNeeded = function() {
	const escriptions = this.characterEscriptions();
	const signature = this.escriptionSignature(escriptions);
	if (signature === this.escriptionKey()) return;
	this.removeEscriptionSprites();
	const sprites = escriptions.map((escription) => this.buildEscriptionSprite(escription));
	sprites.forEach((sprite) => this.addChild(sprite));
	this.setEscriptionSprites(sprites);
	this.setEscriptionKey(signature);
};
/**
* Builds the sprite that draws a single escription.
* @param {Escription} escription The escription to build a sprite for.
* @returns {Sprite_BaseText|Sprite_Icon}
*/
Sprite_Character.prototype.buildEscriptionSprite = function(escription) {
	let sprite = null;
	if (escription.kind() === Escription.Kinds.Icon) {
		sprite = this.buildEscriptionIconSprite(escription);
	} else {
		sprite = this.buildEscriptionTextSprite(escription);
	}
	if (escription.hasProximity()) {
		sprite.opacity = 0;
	}
	return sprite;
};
/**
* Builds the text sprite for a text escription.
* @param {Escription} escription The escription to build a sprite for.
* @returns {Sprite_BaseText}
*/
Sprite_Character.prototype.buildEscriptionTextSprite = function(escription) {
	const sprite = new Sprite_BaseText().setText(escription.content()).setFontSize(14).setAlignment(Sprite_BaseText.Alignments.Center).setColor("#ffffff");
	sprite.x = -(sprite.width / 2);
	return sprite;
};
/**
* Builds the icon sprite for an icon escription.
* @param {Escription} escription The escription to build a sprite for.
* @returns {Sprite_Icon}
*/
Sprite_Character.prototype.buildEscriptionIconSprite = function(escription) {
	const sprite = new Sprite_Icon(escription.content());
	sprite.x = 0 - ImageManager.iconWidth / 2 - 4;
	return sprite;
};
/**
* Removes every escription sprite currently drawn, and forgets what they were built from.
*/
Sprite_Character.prototype.removeEscriptionSprites = function() {
	this.escriptionSprites().forEach((sprite) => {
		this.removeChild(sprite);
		sprite.destroy();
	});
	this.setEscriptionSprites([]);
	this.setEscriptionKey(String.empty);
};
/**
* Hooks into the update function to update our escription sprites.
*/
J.ESCRIBE.Aliased.Sprite_Character.set("update", Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function() {
	J.ESCRIBE.Aliased.Sprite_Character.get("update").call(this);
	this.updateEscriptions();
};
/**
* The update loop for managing the addition, removal and visibility of escriptions.
*/
Sprite_Character.prototype.updateEscriptions = function() {
	this.refreshEscriptionSpritesIfNeeded();
	this.updateEscriptionSprites();
};
/**
* Keeps every escription sprite parked above the character and faded to match its proximity.
*/
Sprite_Character.prototype.updateEscriptionSprites = function() {
	const escriptions = this.characterEscriptions();
	const sprites = this.escriptionSprites();
	const baseY = this.escriptionBaseY();
	const lineCount = this.escriptionLineCount(escriptions);
	sprites.forEach((sprite, index) => {
		const escription = escriptions.at(index);
		sprite.y = baseY + this.escriptionOffsetY(escription, index, lineCount);
		if (!escription.hasProximity()) return;
		this.fadeEscriptionSprite(sprite, escription.isVisible());
	});
};
/**
* Steps a sprite's opacity one frame's worth toward visible, or toward gone.
*
* The terminal checks are inequalities rather than equalities on purpose. `Sprite.opacity` reads
* back as `alpha * 255` without rounding, and a step of seventeen does not land on a value the
* float can hold exactly, so an equality check would sail past the destination and keep writing
* forever. There is also no clamping to do here- the engine's own setter clamps to 0-255 before it
* stores anything, which is why an out-of-range opacity is not a state this can ever observe.
* @param {Sprite_BaseText|Sprite_Icon} sprite The sprite to fade.
* @param {boolean} visible True to fade it in, false to fade it out.
*/
Sprite_Character.prototype.fadeEscriptionSprite = function(sprite, visible) {
	if (visible) {
		if (sprite.opacity >= 255) return;
		sprite.opacity += 17;
		return;
	}
	if (sprite.opacity <= 0) return;
	sprite.opacity -= 17;
};

//#endregion
//# sourceMappingURL=J-Escriptions.js.map