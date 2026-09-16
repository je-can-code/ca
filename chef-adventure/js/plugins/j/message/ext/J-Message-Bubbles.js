//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MESSAGE-BUBBLES] A J-Message extension that floats messages above whoever is speaking.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Message
 * @orderAfter J-Base
 * @orderAfter J-Message
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin lets a message float above the character saying it, drawn as a
 * bubble rather than shown in the box at the edge of the screen.
 *
 * The bubble is drawn at runtime rather than assembled from a windowskin, so
 * it is sized to the text actually in it, and the speaker's name sits inline
 * in the bubble's own border rather than in a separate plate above it.
 *
 * Messages that name no target are not left out: they are drawn as the same
 * panel, without a tail, at whichever of top/middle/bottom the Show Text
 * command already asked for.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Message; the glyphs in a bubble are its glyphs.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Line breaks are the author's, always. A long line makes a wide bubble; this
 * plugin will never re-break a line to make it fit something.
 *
 * ============================================================================
 * NAMING WHO IS SPEAKING:
 * Put the text code below anywhere in a Show Text command, and the message
 * floats above the target it names instead of appearing in the message box.
 * The code itself is removed before the message is drawn.
 *
 * TEXT CODE FORMAT:
 *  \pop[TARGET]
 *    Where TARGET is one of the forms in the table below.
 *
 * TEXT CODE EXAMPLES:
 *  \pop[self]
 * The message floats above the event running this command.
 *
 *  \pop[player]
 * The message floats above the player.
 *
 *  \pop[e12]
 * The message floats above event 12 of the current map.
 *
 *  \pop[a1]
 * The message floats above actor 1, wherever that actor is walking- as the
 * player if they are leading the party, or as the follower they currently are.
 * If that actor is not marching with the party at all, no bubble is drawn.
 *
 *  \pop[f2]
 * The message floats above the second follower behind the player.
 *
 *  \pop[320,180]
 * The message floats at a fixed point on screen, and does not follow anyone.
 *
 * A target naming nothing that exists- a deleted event, an actor sitting in
 * reserve, a form with a typo in it- draws no bubble, and the message appears
 * as an ordinary panel instead.
 * ============================================================================
 * CONVERSATIONS:
 * A bubble does not disappear the moment its message closes. It stays where it
 * is, dimmed and frozen, until the conversation is declared over- so two
 * characters trading lines both stay on screen and a player who blinks does not
 * lose half of an exchange.
 *
 * A speaker who talks again replaces their own bubble rather than stacking a
 * second one, so a character delivering four lines in a row leaves one behind.
 *
 * Use the End Conversation plugin command when the scene is finished. Changing
 * map, entering a battle and opening the menu all end one too, because the
 * characters those bubbles were pointing at have stopped existing.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command end-conversation
 * @text End Conversation
 * @desc Clears every bubble left behind by the characters who just spoke.
 */
//endregion annotations

//#region src/plugins/message/ext/bubbles/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Message-Bubbles.
*
* Deliberately empty of parameters. Everything an author would want to tune about a bubble - its
* shape, its colours, how far above a speaker's head it floats - varies per speaker rather than per
* game, so it belongs in the same `data/config.message.json` the speaker profiles already come from
* rather than in the plugin manager, where there is exactly one of each value for the whole project.
*/
var J_MessageBubblesPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredMessageVersion = "1.3.0";
	const hasMessageRequirement = J.BASE.Helpers.satisfies(J.MESSAGE.Metadata.version.version(), requiredMessageVersion);
	if (hasMessageRequirement === false) {
		throw new Error(`Either missing J-Message or has a lower version than the required: ${requiredMessageVersion}`);
	}
})();
/**
* The plugin umbrella that governs all extensions related to the message system.
*/
J.MESSAGE.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MESSAGE.EXT.BUBBLES = {};
/**
* The metadata associated with this plugin.
*/
J.MESSAGE.EXT.BUBBLES.Metadata = new J_MessageBubblesPluginMetadata("J-Message-Bubbles", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MESSAGE.EXT.BUBBLES.Aliased = {};
J.MESSAGE.EXT.BUBBLES.Aliased.Game_Interpreter = new Map();
J.MESSAGE.EXT.BUBBLES.Aliased.Game_Message = new Map();
J.MESSAGE.EXT.BUBBLES.Aliased.Scene_Map = new Map();
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message = new Map();
/**
* All regular expressions used by this plugin.
*/
J.MESSAGE.EXT.BUBBLES.RegExp = {};
/**
* The text code declaring which character a message should float above.
*
* <pre>
* Structure:
*  \pop[TARGET]
*
* Example:
*  \pop[a1]
*
* Translation:
*  float this message above actor 1, wherever they happen to be marching.
* </pre>
*
* The capture is deliberately permissive - anything that is not a closing bracket - because
* rejecting a malformed target is the resolver's job and it does it by answering "no target",
* which renders the message as an ordinary panel. A regex strict enough to reject the token here
* would instead leave the code sitting in the text for the player to read.
* @type {RegExp}
*/
J.MESSAGE.EXT.BUBBLES.RegExp.PopTarget = /\\pop\[([^\]]*)\]/i;

//#endregion
//#region src/plugins/message/ext/bubbles/__models/BubbleAnchor.js
/**
* A fixed point on screen for a bubble to sit above.
*
* Every other target a message can name is a character that walks around, and the bubble follows it
* by asking where it is this frame. An author who names a literal coordinate instead is asking for
* the one thing a character cannot give them: a bubble that does not move. Rather than teach the
* rest of the ship to ask "is this a character or a pair of numbers" at every read, the pair of
* numbers learns to answer the two questions a character answers, and the distinction stops
* existing above this file.
*/
var BubbleAnchor = class {
	/**
	* The horizontal position of this anchor, in screen pixels.
	* @type {number}
	*/
	#x = 0;
	/**
	* The vertical position of this anchor, in screen pixels.
	* @type {number}
	*/
	#y = 0;
	/**
	* Constructor.
	* @param {number} x The horizontal position, in screen pixels.
	* @param {number} y The vertical position, in screen pixels.
	*/
	constructor(x, y) {
		this.#x = x;
		this.#y = y;
	}
	/**
	* The horizontal position this anchor holds.<br/>
	* Named for the method every `Game_Character` answers, because that is the whole point of it.
	* @returns {number}
	*/
	screenX() {
		return this.#x;
	}
	/**
	* The vertical position this anchor holds.<br/>
	* Named for the method every `Game_Character` answers, because that is the whole point of it.
	* @returns {number}
	*/
	screenY() {
		return this.#y;
	}
	/**
	* The point a bubble's tail should aim at.
	*
	* The same as this anchor's own position whichever side the bubble is on, and deliberately so. A
	* character answers this differently depending on the side, because a tail has to reach the end of
	* them nearest the bubble rather than cross their whole sprite - but an author who typed a
	* coordinate meant that coordinate, and moving it by the height of a sprite that is not there
	* would put the bubble somewhere they did not ask for.
	* @param {boolean} _preferBelow Whether the bubble is hanging below, which a fixed point ignores.
	* @returns {number}
	*/
	bubbleAnchorY(_preferBelow) {
		return this.#y;
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/__models/BubbleBounds.js
/**
* A rectangle in the window's own coordinates, described by its edges rather than by a corner.
*
* Edges because this is built by union: every glyph pushes whichever sides it sticks out past, and
* a left-and-size rectangle has to be unpacked and repacked at each of those steps. The width and
* height nobody accumulates are derived at the end, once, from edges that are already correct.
*
* The coordinates are the ones glyphs are emitted in - measured from the inside of the message
* window, before any of the padding a bubble adds around them.
*/
var BubbleBounds = class BubbleBounds {
	/**
	* The leftmost pixel the content reaches.
	* @type {number}
	*/
	left = 0;
	/**
	* The topmost pixel the content reaches.
	* @type {number}
	*/
	top = 0;
	/**
	* The pixel just past the rightmost the content reaches.
	* @type {number}
	*/
	right = 0;
	/**
	* The pixel just past the bottommost the content reaches.
	* @type {number}
	*/
	bottom = 0;
	/**
	* Constructor.
	* @param {number} left The leftmost pixel the content reaches.
	* @param {number} top The topmost pixel the content reaches.
	* @param {number} right The pixel just past the rightmost the content reaches.
	* @param {number} bottom The pixel just past the bottommost the content reaches.
	*/
	constructor(left, top, right, bottom) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}
	/**
	* The rectangle enclosing nothing.
	*
	* What a message with no glyphs in it measures to, which is a real situation rather than an error
	* case - a bubble is sized before its text has finished revealing, and a page that is all icons
	* and text codes can genuinely contain no characters at all.
	* @returns {BubbleBounds}
	*/
	static empty() {
		return new BubbleBounds(0, 0, 0, 0);
	}
	/**
	* How wide this rectangle is.
	* @returns {number}
	*/
	width() {
		return this.right - this.left;
	}
	/**
	* How tall this rectangle is.
	* @returns {number}
	*/
	height() {
		return this.bottom - this.top;
	}
	/**
	* Grows this rectangle to also enclose another.
	*
	* Mutates rather than returning a new rectangle, because the caller building it is walking a list
	* of ninety glyphs and allocating ninety intermediate rectangles to throw away is the kind of
	* thing that turns a per-message cost into a per-frame one the first time somebody moves the call.
	* @param {BubbleBounds} other The rectangle to swallow.
	*/
	union(other) {
		this.left = Math.min(this.left, other.left);
		this.top = Math.min(this.top, other.top);
		this.right = Math.max(this.right, other.right);
		this.bottom = Math.max(this.bottom, other.bottom);
	}
	/**
	* Pushes every edge of this rectangle outward by the same amount.
	* @param {number} margin How far to push each edge out, in logical pixels.
	*/
	grow(margin) {
		this.left -= margin;
		this.top -= margin;
		this.right += margin;
		this.bottom += margin;
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubbleTargetResolver.js
/**
* Turns the target an author typed into the thing on screen the bubble should sit above.
*
* The grammar names what it means rather than encoding it. `self` is the event running the command,
* `player` is the player, and the counted forms carry a letter saying which database they are
* counting in - `e12` is an event, `a1` an actor, `f2` a follower. A bare pair of numbers is a fixed
* point. Nothing is overloaded, so nothing has to be memorised, and a line read three years from now
* still says who is talking.
*
* Every unrecognised token resolves to nothing, and nothing is a perfectly good answer: the message
* renders as an ordinary panel instead of floating. That is what makes the grammar safe to change -
* a target this resolver does not understand produces a visibly plain message rather than a bubble
* pointing confidently at the wrong character.
*/
var BubbleTargetResolver = class BubbleTargetResolver {
	/**
	* The target naming the event that is running the message command.
	* @type {string}
	*/
	static SelfToken = "self";
	/**
	* The target naming the player.
	* @type {string}
	*/
	static PlayerToken = "player";
	/**
	* The letter introducing an event id.
	* @type {string}
	*/
	static EventPrefix = "e";
	/**
	* The letter introducing an actor id.
	* @type {string}
	*/
	static ActorPrefix = "a";
	/**
	* The letter introducing a follower's place in the marching order.
	* @type {string}
	*/
	static FollowerPrefix = "f";
	/**
	* The punctuation separating the two halves of the fixed-point form.
	* @type {string}
	*/
	static PointSeparator = ",";
	/**
	* The number of halves a fixed-point target has.
	* @type {number}
	*/
	static PointCoordinateCount = 2;
	/**
	* The marching position of whoever is leading the party.
	*
	* The leader is not drawn as a follower at all - they are the player sprite - so this index is the
	* one place the actor form crosses over into naming `$gamePlayer`.
	* @type {number}
	*/
	static LeaderIndex = 0;
	/**
	* What `indexOf` answers for an actor who is not currently marching with the party.
	* @type {number}
	*/
	static NotMarching = -1;
	/**
	* The sentinel for a counted form whose number was not a usable id.
	*
	* Zero rather than null because every database MZ has numbers its rows from one, so zero is
	* already a value that can never name anything.
	* @type {number}
	*/
	static NoOrdinal = 0;
	/**
	* The thing on screen this target names.
	* @param {string} target The contents of the author's `\pop[...]`, without the brackets.
	* @param {number} hostEventId The id of the event whose page is running this message, for `self`.
	* @returns {?(Game_Character|BubbleAnchor)} Whatever the bubble should follow, or null when the
	* target names nothing on this map - an unrecognised token, an event that no longer exists, or an
	* actor who is not currently marching with the party. Null means "draw no bubble".
	*/
	static resolve(target, hostEventId) {
		const normalized = target.trim().toLowerCase();
		if (normalized === BubbleTargetResolver.SelfToken) return BubbleTargetResolver.resolveEvent(hostEventId);
		if (normalized === BubbleTargetResolver.PlayerToken) return $gamePlayer;
		const isPoint = normalized.includes(BubbleTargetResolver.PointSeparator);
		if (isPoint === true) return BubbleTargetResolver.resolvePoint(normalized);
		const ordinal = BubbleTargetResolver.ordinalOf(normalized);
		if (ordinal === BubbleTargetResolver.NoOrdinal) return null;
		return BubbleTargetResolver.resolveCounted(normalized.charAt(0), ordinal);
	}
	/**
	* The thing named by one of the counted forms.
	* @param {string} prefix The letter saying which database the number counts in.
	* @param {number} ordinal The id or marching position being counted to.
	* @returns {?(Game_Character)} The character named, or null when the letter is not one of ours.
	*/
	static resolveCounted(prefix, ordinal) {
		switch (prefix) {
			case BubbleTargetResolver.EventPrefix: return BubbleTargetResolver.resolveEvent(ordinal);
			case BubbleTargetResolver.ActorPrefix: return BubbleTargetResolver.resolveActor(ordinal);
			case BubbleTargetResolver.FollowerPrefix: return BubbleTargetResolver.resolveFollower(ordinal);
			default: return null;
		}
	}
	/**
	* The event with the given id on the current map.
	* @param {number} eventId The id of the event being named.
	* @returns {?Game_Event} The event, or null when this map has no such event.
	*/
	static resolveEvent(eventId) {
		const event = $gameMap.event(eventId);
		if (event === undefined) return null;
		return event;
	}
	/**
	* The sprite an actor is currently walking around as.
	*
	* An actor is not a thing on screen; their *place in the marching order* is. The party leader is
	* drawn as the player sprite and everyone behind them as a follower, so the same actor moves
	* between the two as the party is reordered - which is exactly why this is resolved per message
	* rather than remembered.
	* @param {number} actorId The id of the actor being named.
	* @returns {?Game_Character} The player or a follower, or null when that actor is not currently
	* marching - held in reserve, out of the party entirely, or never in the database to begin with.
	*/
	static resolveActor(actorId) {
		const actor = $gameActors.actor(actorId);
		const marching = $gameParty.battleMembers();
		const marchingIndex = marching.indexOf(actor);
		if (marchingIndex === BubbleTargetResolver.NotMarching) return null;
		if (marchingIndex === BubbleTargetResolver.LeaderIndex) return $gamePlayer;
		return BubbleTargetResolver.resolveFollower(marchingIndex);
	}
	/**
	* The follower walking in the given place behind the player.
	* @param {number} ordinal The place in line, counting from one for the follower directly behind.
	* @returns {?Game_Follower} The follower, or null when the party is not that long.
	*/
	static resolveFollower(ordinal) {
		const follower = $gamePlayer.followers().follower(ordinal - 1);
		if (follower === undefined) return null;
		return follower;
	}
	/**
	* The fixed point named by a pair of coordinates.
	* @param {string} target The whole target, known to contain the separator.
	* @returns {?BubbleAnchor} The anchor, or null when the pair is not two real numbers.
	*/
	static resolvePoint(target) {
		const coordinates = target.split(BubbleTargetResolver.PointSeparator);
		if (coordinates.length !== BubbleTargetResolver.PointCoordinateCount) return null;
		const [rawX, rawY] = coordinates;
		const x = Number(rawX.trim());
		const y = Number(rawY.trim());
		if (rawX.trim() === String.empty) return null;
		if (rawY.trim() === String.empty) return null;
		if (Number.isFinite(x) === false) return null;
		if (Number.isFinite(y) === false) return null;
		return new BubbleAnchor(x, y);
	}
	/**
	* The number a counted form is counting to.
	* @param {string} target The whole target, whose first character is the prefix letter.
	* @returns {number} The id or place being named, or zero when what followed the letter was not a
	* whole counting number.
	*/
	static ordinalOf(target) {
		const digits = target.slice(1);
		const parsed = Number(digits);
		if (Number.isInteger(parsed) === false) return BubbleTargetResolver.NoOrdinal;
		if (parsed < 1) return BubbleTargetResolver.NoOrdinal;
		return parsed;
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubbleGeometry.js
/**
* Measures how much room a message's text actually needs.
*
* The window already tracks `outputWidth` and `outputHeight` while it reveals, and both are the
* wrong number for this. They describe where the *cursor* got to - the widest line's advance, and
* the bottom of the last line - which is exactly the text's footprint and nothing else. A glyph is
* drawn with an outline stroked around it, an italic leans out past its advance, and an effect can
* throw the whole letter several pixels clear of where it was measured. Size a container from the
* cursor box and every one of those gets its edge shaved off.
*
* So the measurement is taken from the glyphs themselves, one box each, unioned - and the glyphs are
* asked what they are capable of rather than what they are doing this instant. A wave sampled at the
* wrong moment is resting on its own centre line and reports needing nothing at all; half a second
* later it is four pixels higher and clipped. What matters is the envelope, and only the effect
* itself knows its own.
*
* Nothing here knows what "wave" means, and that is deliberate. It asks J-Message's registry for the
* reach of whatever names a glyph is carrying, which is what keeps a bubble correct around an effect
* this ship has never heard of.
*/
var BubbleGeometry = class BubbleGeometry {
	/**
	* How much clear space to leave between the text and the bubble's border, in logical pixels.
	* @type {number}
	*/
	static ContentMargin = 10;
	/**
	* The box the given glyphs occupy, including everything they might do to themselves.
	* @param {MessageGlyph[]} glyphs The glyphs making up the message.
	* @returns {BubbleBounds} The union of every glyph's reach, or an empty rectangle when there are
	* no glyphs to measure.
	*/
	static contentBounds(glyphs) {
		if (glyphs.length === 0) return BubbleBounds.empty();
		const bounds = BubbleGeometry.glyphBounds(glyphs[0]);
		glyphs.forEach((glyph) => {
			bounds.union(BubbleGeometry.glyphBounds(glyph));
		});
		return bounds;
	}
	/**
	* The box one glyph occupies, at rest and at full reach.
	* @param {MessageGlyph} glyph The glyph to measure.
	* @returns {BubbleBounds}
	*/
	static glyphBounds(glyph) {
		const bounds = BubbleGeometry.restingBounds(glyph);
		const excursion = MessageEffectRegistry.excursionOf(glyph.effects);
		bounds.left -= excursion.offsetX;
		bounds.right += excursion.offsetX;
		bounds.top -= excursion.offsetY;
		bounds.bottom += excursion.offsetY;
		const swell = BubbleGeometry.swellOf(glyph, excursion.scale);
		bounds.left -= swell.horizontal;
		bounds.right += swell.horizontal;
		bounds.top -= swell.vertical;
		bounds.bottom += swell.vertical;
		return bounds;
	}
	/**
	* The box one glyph occupies with nothing acting on it.
	*
	* The advance the splitter measured, widened by the margin the raster reserves on each side for
	* the outline - the same margin the sprite then subtracts when it places itself, so this is the
	* glyph's real footprint rather than its contribution to the cursor.
	* @param {MessageGlyph} glyph The glyph to measure.
	* @returns {BubbleBounds}
	*/
	static restingBounds(glyph) {
		const padding = TextRasterMetrics.padding(glyph.outlineWidth);
		return new BubbleBounds(glyph.x - padding, glyph.y, glyph.x + glyph.width + padding, glyph.y + glyph.lineHeight);
	}
	/**
	* How far a swelling glyph reaches past its own edges, on each axis.
	*
	* Measured against the raster rather than against the letter, because the raster is what actually
	* gets scaled: the sprite grows its whole bitmap and pulls back by half the growth to keep the
	* letter centred, so the distance anything travels is set by the size of the bitmap it lives in.
	* The bitmap is taller than the line by some margin, which makes this a little generous vertically
	* - and generous is the correct direction to be wrong in, because the cost is a few pixels of
	* bubble and the alternative is a shaved ascender.
	* @param {MessageGlyph} glyph The glyph to measure.
	* @param {number} scale The largest this glyph ever gets, as a multiple of its drawn size.
	* @returns {{horizontal: number, vertical: number}}
	*/
	static swellOf(glyph, scale) {
		const growth = scale - 1;
		const padding = TextRasterMetrics.padding(glyph.outlineWidth);
		const rasterWidth = glyph.width + padding * 2;
		const rasterHeight = TextRasterMetrics.canvasHeight(glyph.fontSize);
		return {
			horizontal: rasterWidth * growth / 2,
			vertical: rasterHeight * growth / 2
		};
	}
	/**
	* The box the bubble's border encloses, given the text inside it.
	* @param {MessageGlyph[]} glyphs The glyphs making up the message.
	* @returns {BubbleBounds}
	*/
	static bubbleBounds(glyphs) {
		const bounds = BubbleGeometry.contentBounds(glyphs);
		bounds.grow(BubbleGeometry.ContentMargin);
		return bounds;
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubblePlacement.js
/**
* Where on screen a bubble sits, given who it belongs to.
*
* Two rules, and they disagree with each other constantly. A bubble wants to be centred above its
* speaker, because that is what makes it read as theirs; and it wants to be entirely on screen,
* because half a bubble is worse than a slightly misplaced one. Whenever those conflict the screen
* wins and the tail takes up the slack - it leans, which is the whole reason it can.
*
* Nothing here knows about windows or sprites. It is given a size and a point and answers with a
* corner, which is the part of placement that can be checked without a running game.
*/
var BubblePlacement = class BubblePlacement {
	/**
	* How much clear screen to leave around a bubble, in logical pixels.
	* @type {number}
	*/
	static ScreenMargin = 6;
	/**
	* How far above the point it is pointing at a bubble floats, in logical pixels.
	*
	* Enough for the tail plus a little air. A bubble resting directly on a character's head reads as
	* a hat rather than as speech.
	* @type {number}
	*/
	static AnchorGap = 20;
	/**
	* Where a bubble's top-left corner goes.
	* @param {number} width How wide the bubble is.
	* @param {number} height How tall the bubble is.
	* @param {number} anchorX The horizontal position of whoever is speaking, in screen pixels.
	* @param {number} anchorY The vertical position of whoever is speaking, in screen pixels.
	* @param {number} screenWidth How wide the visible area is.
	* @param {number} screenHeight How tall the visible area is.
	* @returns {{x: number, y: number}}
	*/
	static place(width, height, anchorX, anchorY, screenWidth, screenHeight, preferBelow) {
		const centred = anchorX - width / 2;
		return {
			x: BubblePlacement.holdOnScreen(centred, width, screenWidth),
			y: BubblePlacement.verticalFor(height, anchorY, screenHeight, preferBelow)
		};
	}
	/**
	* Which side of its speaker a bubble ends up on, and where.
	*
	* The side an author asked for is honoured wherever it fits, and abandoned where it does not - a
	* bubble squashed against the ceiling sits over its own speaker's head with its tail folded back
	* into itself, which is worse than being on the side nobody asked for. The fallback is checked
	* rather than assumed, so a bubble taller than the room on either side still lands somewhere
	* predictable instead of bouncing between two impossible answers.
	* @param {number} height How tall the bubble is.
	* @param {number} anchorY The vertical position of whoever is speaking.
	* @param {number} screenHeight How tall the visible area is.
	* @param {boolean} preferBelow Whether the author asked for this one to sit under its speaker.
	* @returns {number}
	*/
	static verticalFor(height, anchorY, screenHeight, preferBelow) {
		const above = anchorY - BubblePlacement.AnchorGap - height;
		const below = anchorY + BubblePlacement.AnchorGap;
		const wanted = preferBelow === true ? below : above;
		const other = preferBelow === true ? above : below;
		if (BubblePlacement.fitsOnScreen(wanted, height, screenHeight) === true) {
			return BubblePlacement.holdOnScreen(wanted, height, screenHeight);
		}
		return BubblePlacement.holdOnScreen(other, height, screenHeight);
	}
	/**
	* Whether a bubble placed here would be entirely visible.
	* @param {number} position Where the bubble would sit.
	* @param {number} extent How far it reaches.
	* @param {number} available How much room there is.
	* @returns {boolean}
	*/
	static fitsOnScreen(position, extent, available) {
		if (position < BubblePlacement.ScreenMargin) return false;
		return position + extent <= available - BubblePlacement.ScreenMargin;
	}
	/**
	* Holds one axis of a bubble inside the visible area.
	* @param {number} position Where the bubble would like to sit on this axis.
	* @param {number} extent How far the bubble reaches along this axis.
	* @param {number} available How much room there is along this axis.
	* @returns {number}
	*/
	static holdOnScreen(position, extent, available) {
		const lastFittingPosition = available - extent - BubblePlacement.ScreenMargin;
		if (lastFittingPosition < BubblePlacement.ScreenMargin) return BubblePlacement.ScreenMargin;
		const notTooFarBack = Math.max(position, BubblePlacement.ScreenMargin);
		return Math.min(notTooFarBack, lastFittingPosition);
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubbleShape.js
/**
* The outline of a bubble, as a path something else can draw.
*
* A bubble is not a rectangle with decorations bolted on, and the reason is the legend. The speaker's
* name is meant to sit *in* the border the way a `legend` sits in a `fieldset` - the border stopping
* short on one side of the name and resuming on the other - and a border that stops has to be a path
* rather than a shape. The same is true of the tail: it leaves the body through a mouth, and the
* border has to walk out along one side of it and back along the other instead of drawing straight
* across.
*
* Painting over an unwanted stretch of border in the fill colour would be far less code and is what
* this deliberately does not do. It only looks right while the fill is opaque, and a bubble that can
* never be translucent is a decision being made here on behalf of whoever picks the colours later.
*
* Everything is returned as plain descriptors - lines and arcs in window coordinates - because the
* thing that draws them is a sprite, and sprites are where logic goes to become untestable.
*/
var BubbleShape = class BubbleShape {
	/**
	* How far the corners of a bubble are rounded, in logical pixels.
	* @type {number}
	*/
	static CornerRadius = 12;
	/**
	* How wide the mouth of the tail is where it leaves the body, in logical pixels.
	* @type {number}
	*/
	static TailWidth = 18;
	/**
	* How far the tail reaches from the body toward whoever is speaking, in logical pixels.
	*
	* Fixed rather than stretching all the way to the speaker: a tail that spanned the real distance
	* would become a long thin wedge the moment the bubble was pushed away from its owner by the edge
	* of the screen, which reads as a leak rather than as pointing.
	* @type {number}
	*/
	static TailLength = 14;
	/**
	* How far sideways the tail may lean, as a ratio of how far out it reaches.
	*
	* One is forty-five degrees. The lean exists so a tail aims at a speaker standing off to one side
	* rather than merely hanging over the nearest corner, and the cap exists because the aim stops
	* being the point past that: a speaker level with the bubble would otherwise drag the tail flat
	* along the edge, or - since the edge it leaves from is chosen from whether they are above or
	* below - fold it back up through the body it came out of.
	* @type {number}
	*/
	static MaximumTailLean = 1;
	/**
	* How much clear border to leave either side of the legend, in logical pixels.
	* @type {number}
	*/
	static LegendPadding = 6;
	/**
	* How far from the left corner the legend begins, in logical pixels.
	*
	* Comfortably past the corner radius plus the padding, so a short stub of border survives to the
	* left of the name. A legend flush against the corner reads as a label that has slipped off the
	* edge rather than as one set into the border.
	* @type {number}
	*/
	static LegendInset = 24;
	/**
	* Where the tail leaves the body and where it points.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {number} targetX The horizontal position of whoever is speaking, in the same coordinates.
	* @param {number} targetY The vertical position of whoever is speaking, in the same coordinates.
	* @returns {{onTop: boolean, mouthStart: number, mouthEnd: number, tipX: number, tipY: number}}
	*/
	static tailFor(bounds, targetX, targetY) {
		const onTop = targetY < bounds.top;
		const edgeY = onTop === true ? bounds.top : bounds.bottom;
		const half = BubbleShape.TailWidth / 2;
		const mouthCenter = BubbleShape.clampToStraightRun(bounds, targetX, half);
		const lean = BubbleShape.leanToward(mouthCenter, edgeY, targetX, targetY);
		const spread = Math.sqrt(1 + lean * lean);
		const outward = onTop === true ? -1 : 1;
		return {
			onTop,
			mouthStart: mouthCenter - half,
			mouthEnd: mouthCenter + half,
			tipX: mouthCenter + lean / spread * BubbleShape.TailLength,
			tipY: edgeY + outward * (BubbleShape.TailLength / spread)
		};
	}
	/**
	* How far sideways the tail leans, per unit it reaches outward.
	*
	* Zero when the speaker is directly beyond the mouth, which is most of the time - a bubble is
	* placed over its owner, so the tail usually points straight at them without leaning at all. It
	* only tilts once the bubble has been pushed sideways off them, which is exactly when a tail that
	* did not tilt would stop looking like it was pointing at anybody.
	* @param {number} mouthCenter Where the tail leaves the body, horizontally.
	* @param {number} edgeY The border line the tail leaves from.
	* @param {number} targetX The horizontal position of whoever is speaking.
	* @param {number} targetY The vertical position of whoever is speaking.
	* @returns {number}
	*/
	static leanToward(mouthCenter, edgeY, targetX, targetY) {
		const sideways = targetX - mouthCenter;
		const outwardDistance = Math.max(Math.abs(targetY - edgeY), 1);
		const requested = sideways / outwardDistance;
		const notTooFarLeft = Math.max(requested, -BubbleShape.MaximumTailLean);
		return Math.min(notTooFarLeft, BubbleShape.MaximumTailLean);
	}
	/**
	* Holds a horizontal position inside the flat part of an edge, away from the rounded corners.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {number} x The position to hold.
	* @param {number} margin How much further in from the corner to stay.
	* @returns {number}
	*/
	static clampToStraightRun(bounds, x, margin = 0) {
		const inset = BubbleShape.CornerRadius + margin;
		const leftLimit = bounds.left + inset;
		const rightLimit = bounds.right - inset;
		if (leftLimit > rightLimit) return (bounds.left + bounds.right) / 2;
		const notTooFarLeft = Math.max(x, leftLimit);
		return Math.min(notTooFarLeft, rightLimit);
	}
	/**
	* The stretch of the top border to leave undrawn so the legend can sit in it.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {number} legendWidth How wide the drawn name is, in logical pixels.
	* @returns {?{start: number, end: number}} The gap, or null when there is no name to make room
	* for - narration and signposts have no speaker, and their bubbles want an unbroken border.
	*/
	static legendGapFor(bounds, legendWidth) {
		if (legendWidth <= 0) return null;
		const requested = bounds.left + BubbleShape.LegendInset - BubbleShape.LegendPadding;
		const start = Math.max(requested, bounds.left + BubbleShape.CornerRadius);
		const end = start + legendWidth + BubbleShape.LegendPadding * 2;
		const straightRunEnd = bounds.right - BubbleShape.CornerRadius;
		if (end > straightRunEnd) return null;
		return {
			start,
			end
		};
	}
	/**
	* The whole outline, as the sequence of lines and arcs that walks it once, clockwise.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail The tail as {@link tailFor} describes it, or null for no tail.
	* @param {?object} legendGap The gap as {@link legendGapFor} describes it, or null for no legend.
	* @returns {object[]} Line and arc descriptors, in drawing order.
	*/
	static outlinePath(bounds, tail, legendGap) {
		const { CornerRadius } = BubbleShape;
		const segments = [];
		BubbleShape.appendTopEdge(segments, bounds, tail, legendGap);
		segments.push(BubbleShape.arc(bounds.right - CornerRadius, bounds.top + CornerRadius, -Math.PI / 2, 0));
		segments.push(BubbleShape.line(bounds.right, bounds.top + CornerRadius, bounds.right, bounds.bottom - CornerRadius));
		segments.push(BubbleShape.arc(bounds.right - CornerRadius, bounds.bottom - CornerRadius, 0, Math.PI / 2));
		BubbleShape.appendBottomEdge(segments, bounds, tail);
		segments.push(BubbleShape.arc(bounds.left + CornerRadius, bounds.bottom - CornerRadius, Math.PI / 2, Math.PI));
		segments.push(BubbleShape.line(bounds.left, bounds.bottom - CornerRadius, bounds.left, bounds.top + CornerRadius));
		segments.push(BubbleShape.arc(bounds.left + CornerRadius, bounds.top + CornerRadius, Math.PI, Math.PI * 1.5));
		return segments;
	}
	/**
	* Walks the top edge left to right, stepping around whatever interrupts it.
	* @param {object[]} segments The path being built.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail The tail, which interrupts this edge only when it points upward.
	* @param {?object} legendGap The legend gap, which always interrupts this edge when present.
	*/
	static appendTopEdge(segments, bounds, tail, legendGap) {
		const interruptions = [];
		if (legendGap !== null) {
			interruptions.push({
				start: legendGap.start,
				end: legendGap.end,
				apex: null
			});
		}
		const tailIsHere = tail !== null && tail.onTop === true;
		if (tailIsHere === true) {
			interruptions.push(BubbleShape.tailInterruption(tail));
		}
		BubbleShape.appendHorizontalRun(segments, bounds.top, bounds.left + BubbleShape.CornerRadius, bounds.right - BubbleShape.CornerRadius, interruptions);
	}
	/**
	* Walks the bottom edge right to left, stepping around the tail if it leaves from here.
	* @param {object[]} segments The path being built.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail The tail, which interrupts this edge only when it points downward.
	*/
	static appendBottomEdge(segments, bounds, tail) {
		const interruptions = [];
		const tailIsHere = tail !== null && tail.onTop === false;
		if (tailIsHere === true) {
			interruptions.push(BubbleShape.tailInterruption(tail));
		}
		BubbleShape.appendHorizontalRun(segments, bounds.bottom, bounds.right - BubbleShape.CornerRadius, bounds.left + BubbleShape.CornerRadius, interruptions);
	}
	/**
	* The mouth of the tail, and the point the border detours out to instead of crossing it.
	*
	* The two sides are not built here on purpose. Which one the pen walks first depends on which
	* direction it is travelling along the edge, and that is known one level up - describing the
	* detour by its far point instead lets the same interruption be walked correctly from either end.
	* @param {object} tail The tail as {@link tailFor} describes it.
	* @returns {{start: number, end: number, apex: {x: number, y: number}}}
	*/
	static tailInterruption(tail) {
		return {
			start: tail.mouthStart,
			end: tail.mouthEnd,
			apex: {
				x: tail.tipX,
				y: tail.tipY
			}
		};
	}
	/**
	* Emits one horizontal edge, in travel order, with its interruptions spliced in.
	*
	* The edge is walked in whichever direction the outline is going, so the interruptions are sorted
	* into that same order before anything is emitted - a tail on the bottom edge is met from the
	* right, and a detour emitted in left-to-right order there would double back through the body.
	* @param {object[]} segments The path being built.
	* @param {number} y The line this edge sits on.
	* @param {number} fromX Where the edge starts, in travel order.
	* @param {number} toX Where the edge ends, in travel order.
	* @param {object[]} interruptions The stretches to step around, in any order.
	*/
	static appendHorizontalRun(segments, y, fromX, toX, interruptions) {
		const travellingRight = toX > fromX;
		const ordered = BubbleShape.inTravelOrder(interruptions, travellingRight);
		let penX = fromX;
		ordered.forEach((interruption) => {
			const nearEdge = travellingRight === true ? interruption.start : interruption.end;
			const farEdge = travellingRight === true ? interruption.end : interruption.start;
			segments.push(BubbleShape.line(penX, y, nearEdge, y));
			if (interruption.apex !== null) {
				const { apex } = interruption;
				segments.push(BubbleShape.line(nearEdge, y, apex.x, apex.y));
				segments.push(BubbleShape.line(apex.x, apex.y, farEdge, y));
			}
			penX = farEdge;
		});
		segments.push(BubbleShape.line(penX, y, toX, y));
	}
	/**
	* Sorts interruptions into the order the pen will meet them.
	* @param {object[]} interruptions The stretches to step around.
	* @param {boolean} travellingRight Whether the pen is moving left to right.
	* @returns {object[]}
	*/
	static inTravelOrder(interruptions, travellingRight) {
		const sorted = interruptions.slice().sort((left, right) => left.start - right.start);
		if (travellingRight === true) return sorted;
		return sorted.reverse();
	}
	/**
	* One straight run of border.
	* @param {number} fromX Where it starts horizontally.
	* @param {number} fromY Where it starts vertically.
	* @param {number} toX Where it ends horizontally.
	* @param {number} toY Where it ends vertically.
	* @returns {{kind: string, fromX: number, fromY: number, toX: number, toY: number}}
	*/
	static line(fromX, fromY, toX, toY) {
		return {
			kind: "line",
			fromX,
			fromY,
			toX,
			toY
		};
	}
	/**
	* One rounded corner.
	*
	* The two endpoints are carried alongside the angles that produced them, so that whoever draws
	* this never has to work out where an arc begins. That matters more than it looks: a canvas arc
	* draws a straight line from wherever the pen already is to its own start point, so a renderer
	* that guessed wrong would not fail visibly - it would quietly add a chord across the corner.
	* @param {number} centerX The centre of the circle the corner is cut from.
	* @param {number} centerY The centre of the circle the corner is cut from.
	* @param {number} startAngle Where on that circle the corner begins, in radians.
	* @param {number} endAngle Where on that circle the corner ends, in radians.
	* @returns {object}
	*/
	static arc(centerX, centerY, startAngle, endAngle) {
		const radius = BubbleShape.CornerRadius;
		return {
			kind: "arc",
			centerX,
			centerY,
			radius,
			startAngle,
			endAngle,
			startX: centerX + radius * Math.cos(startAngle),
			startY: centerY + radius * Math.sin(startAngle),
			endX: centerX + radius * Math.cos(endAngle),
			endY: centerY + radius * Math.sin(endAngle)
		};
	}
	/**
	* How far apart two points may be and still count as the same one, in logical pixels.
	*
	* Corner endpoints are derived through a sine and a cosine, so the point an arc ends on and the
	* point the next edge starts from agree to about fifteen decimal places rather than exactly.
	* @type {number}
	*/
	static JoinTolerance = .001;
	/**
	* Whether one segment carries straight on from where the last one finished.
	*
	* What tells a renderer where to lift the pen. Everywhere this is true the border is one
	* continuous stroke and its corners join properly; the one place it is false is the legend, and
	* there the pen is meant to lift.
	* @param {object} previous The segment drawn before this one.
	* @param {object} segment The segment about to be drawn.
	* @returns {boolean}
	*/
	static continuesFrom(previous, segment) {
		const previousEnd = BubbleShape.endOf(previous);
		const thisStart = BubbleShape.startOf(segment);
		const alignedHorizontally = Math.abs(previousEnd.x - thisStart.x) <= BubbleShape.JoinTolerance;
		const alignedVertically = Math.abs(previousEnd.y - thisStart.y) <= BubbleShape.JoinTolerance;
		return alignedHorizontally === true && alignedVertically === true;
	}
	/**
	* Where a segment of either kind begins.
	* @param {object} segment A line or an arc.
	* @returns {{x: number, y: number}}
	*/
	static startOf(segment) {
		if (segment.kind === "arc") {
			return {
				x: segment.startX,
				y: segment.startY
			};
		}
		return {
			x: segment.fromX,
			y: segment.fromY
		};
	}
	/**
	* Where a segment of either kind ends.
	* @param {object} segment A line or an arc.
	* @returns {{x: number, y: number}}
	*/
	static endOf(segment) {
		if (segment.kind === "arc") {
			return {
				x: segment.endX,
				y: segment.endY
			};
		}
		return {
			x: segment.toX,
			y: segment.toY
		};
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubbleStyle.js
/**
* What a bubble looks like, decided by the Background dropdown an author already filled in.
*
* Every Show Text command in the engine carries one, and it has meant the same three things since
* MV: a window, a dimmed backdrop, or nothing at all. A floating message is still a message, so
* those three still mean something - they just have to mean it about a bubble rather than about a
* windowskin. Reusing the dropdown is what makes that free: an author who wanted a hush on a line
* already said so years ago, and nobody has to learn a new code.
*
* - **Window** is the ordinary bubble.
* - **Dim** is the same bubble, greyed and half see-through. It reads as inner thought, or as a
*   line somebody is not quite saying out loud.
* - **Transparent** draws no bubble at all - the text simply floats above the speaker with the map
*   behind it. The message still positions itself over them; only the backdrop is gone.
*/
var BubbleStyle = class BubbleStyle {
	/**
	* The Background value meaning an ordinary window.
	* @type {number}
	*/
	static WindowBackground = 0;
	/**
	* The Background value meaning a dimmed backdrop.
	* @type {number}
	*/
	static DimBackground = 1;
	/**
	* The colour an ordinary bubble is filled with.
	* @type {number}
	*/
	static FillColor = 1185830;
	/**
	* How opaque an ordinary bubble's fill is.
	* @type {number}
	*/
	static FillAlpha = .92;
	/**
	* The colour an ordinary bubble is outlined in.
	* @type {number}
	*/
	static BorderColor = 15922424;
	/**
	* The colour a dimmed bubble is filled with.
	*
	* Greyer than the ordinary fill rather than merely fainter. Dropping the opacity alone lets the
	* map's own colour come through and tint the bubble differently in every room, which reads as a
	* rendering fault rather than as a deliberate hush.
	* @type {number}
	*/
	static DimFillColor = 2304048;
	/**
	* How opaque a dimmed bubble's fill is.
	* @type {number}
	*/
	static DimFillAlpha = .58;
	/**
	* The colour a dimmed bubble is outlined in.
	* @type {number}
	*/
	static DimBorderColor = 9278883;
	/**
	* The colour a speaker's name is drawn in, as the CSS string text rendering deals in.
	* @type {string}
	*/
	static LegendColor = "#f2f4f8";
	/**
	* The colour a dimmed speaker's name is drawn in.
	*
	* Greyed alongside the border it sits in. A legend left at full brightness inside a hushed bubble
	* is the only loud thing on it, which puts the emphasis on the nameplate rather than on the line.
	* @type {string}
	*/
	static DimLegendColor = "#8d95a3";
	/**
	* How a bubble should be drawn for a given Background value.
	* @param {number} background The Show Text command's Background value.
	* @returns {{drawn: boolean, fillColor: number, fillAlpha: number, borderColor: number, legendColor: string}}
	*/
	static forBackground(background) {
		if (background === BubbleStyle.DimBackground) {
			return {
				drawn: true,
				fillColor: BubbleStyle.DimFillColor,
				fillAlpha: BubbleStyle.DimFillAlpha,
				borderColor: BubbleStyle.DimBorderColor,
				legendColor: BubbleStyle.DimLegendColor
			};
		}
		const drawn = background === BubbleStyle.WindowBackground;
		return {
			drawn,
			fillColor: BubbleStyle.FillColor,
			fillAlpha: BubbleStyle.FillAlpha,
			borderColor: BubbleStyle.BorderColor,
			legendColor: BubbleStyle.LegendColor
		};
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/services/BubbleLayout.js
/**
* Everything about where a bubble goes, answered in one call.
*
* Two things place bubbles and they must agree exactly: the live message window, and a spent bubble
* left behind by whoever spoke last. If those drifted apart by a pixel, two characters talking would
* show one bubble sitting slightly differently from the other for no reason a player could name -
* and the drift would only appear once somebody edited one of the two.
*
* So the arithmetic lives here and both of them are callers. Nothing in it touches a window, a
* sprite or the engine, which also means the whole of it can be checked without a running game.
*/
var BubbleLayout = class BubbleLayout {
	/**
	* How far inside its own rectangle a bubble's border is drawn, in logical pixels.
	*
	* A stroke is centred on the line it follows, so a border drawn at zero would hang half its
	* thickness outside the box. Nothing clips it, but the bubble and the thing holding it would
	* disagree about where they end.
	* @type {number}
	*/
	static BorderInset = 2;
	/**
	* Where a bubble goes and what shape it is, given its text and who it belongs to.
	* @param {BubbleBounds} content How much room the text needs, measured from the contents origin.
	* @param {number} padding How much clear space sits between the contents and the window edge.
	* @param {number} anchorX The horizontal position of whoever is speaking, in screen pixels.
	* @param {number} anchorY The vertical position of whoever is speaking, in screen pixels.
	* @param {number} screenWidth How wide the visible area is.
	* @param {number} screenHeight How tall the visible area is.
	* @param {boolean} preferBelow Whether this one was asked to sit under its speaker rather than over.
	* @returns {{x: number, y: number, width: number, height: number, bounds: BubbleBounds, tail: object}}
	*/
	static solve(content, padding, anchorX, anchorY, screenWidth, screenHeight, preferBelow) {
		const width = Math.ceil(content.right) + padding * 2;
		const height = Math.ceil(content.bottom) + padding * 2;
		const placed = BubblePlacement.place(width, height, anchorX, anchorY, screenWidth, screenHeight, preferBelow);
		const bounds = new BubbleBounds(BubbleLayout.BorderInset, BubbleLayout.BorderInset, width - BubbleLayout.BorderInset, height - BubbleLayout.BorderInset);
		const tail = BubbleShape.tailFor(bounds, anchorX - placed.x, anchorY - placed.y);
		return {
			x: placed.x,
			y: placed.y,
			width,
			height,
			bounds,
			tail
		};
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/managers/SpentBubbleManager.js
/**
* The bubbles of everyone who has already spoken in the current conversation.
*
* A message window closing is not the same thing as a character being finished talking. Two people
* trading lines should leave both bubbles on screen - the one being read bright and moving, the one
* before it dimmed and still - because that is what a conversation looks like, and because the
* alternative is a player who missed the first half of an exchange by blinking.
*
* This holds **data, never sprites.** What a spent bubble needs is a list of glyph records, a box, a
* name and a target, all of which are plain values that outlive the window that produced them. The
* sprites are built from that by whatever is currently on screen, which is what lets a conversation
* survive the message window being torn down and rebuilt between every single line.
*
* **Keyed on the target token, not on the character it resolved to.** `\pop[a1]` is `$gamePlayer`
* while Jerald is leading and a `Game_Follower` after a party reorder, so keying on the resolved
* character would let one actor accumulate a bubble per marching position.
*/
var SpentBubbleManager = class SpentBubbleManager {
	/**
	* Everyone who has spoken so far, by the target their message named.
	* @type {Map<string, object>}
	*/
	static #spent = new Map();
	/**
	* Remembers a bubble after the message that drew it has closed.
	*
	* Replaces rather than appends when the same target speaks again, which is the whole reason this
	* is a map: a character delivering four lines in a row should leave one bubble behind, not four
	* stacked in the same place.
	* @param {string} token The target the message named, verbatim.
	* @param {object} entry Everything needed to redraw the bubble without the window.
	*/
	static retain(token, entry) {
		SpentBubbleManager.#spent.set(token, entry);
	}
	/**
	* Forgets one speaker's bubble.
	*
	* Called when that same speaker starts a new message: their old bubble is about to be replaced by
	* a live one in the same place, and two of them overlapping for the length of a line reads as a
	* rendering fault.
	* @param {string} token The target to forget.
	*/
	static release(token) {
		SpentBubbleManager.#spent.delete(token);
	}
	/**
	* Ends the conversation.
	*
	* Authored rather than timed. An author knows when a scene is over and a timeout only guesses -
	* and guessing is what would stop two characters being able to pace around between lines.
	*/
	static clear() {
		SpentBubbleManager.#spent.clear();
	}
	/**
	* Everyone currently holding a spent bubble, with what they need to draw it.
	* @returns {Array<{token: string, entry: object}>}
	*/
	static entries() {
		const listed = [];
		SpentBubbleManager.#spent.forEach((entry, token) => {
			listed.push({
				token,
				entry
			});
		});
		return listed;
	}
	/**
	* Whether anybody has spoken yet in the current conversation.
	* @returns {boolean}
	*/
	static isEmpty() {
		return SpentBubbleManager.#spent.size === 0;
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/objects/Game_CharacterBase.js
/**
* The point a bubble's tail should aim at when this character is speaking.
*
* Which end of the character that is depends on which side the bubble is sitting. A bubble floating
* above wants the top of their head, because a tail aimed at their feet has to cross their whole
* sprite to get there. A bubble hanging below wants the ground they are standing on, for exactly the
* same reason in the other direction - aiming at the head from underneath puts the bubble over them
* rather than under them, which is the version that looks like a bug.
*
* `screenY` answers with the ground, so the head is one tile up from it. Being approximate about the
* height of a sprite costs nothing: the bubble floats clear of this point either way, and the tail
* only leans toward it.
* @param {boolean} preferBelow Whether the bubble is hanging below this character.
* @returns {number}
*/
Game_CharacterBase.prototype.bubbleAnchorY = function(preferBelow) {
	if (preferBelow === true) return this.screenY();
	return this.screenY() - $gameMap.tileHeight();
};

//#endregion
//#region src/plugins/message/ext/bubbles/objects/Game_Interpreter.js
/**
* Extends {@link command101}.<br/>
* Also tells the message which event is running it.
*
* `\pop[self]` means "whoever is speaking this line", and the interpreter is the only thing that
* knows. By the time a window is involved the message has been handed over as text and the event it
* came from is no longer part of the conversation, so the id is stashed on the way past.
* @param {Array} params The parameters of the Show Text command.
* @returns {boolean}
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Game_Interpreter.set("command101", Game_Interpreter.prototype.command101);
Game_Interpreter.prototype.command101 = function(params) {
	$gameMessage.setBubbleHostEventId(this.eventId());
	return J.MESSAGE.EXT.BUBBLES.Aliased.Game_Interpreter.get("command101").call(this, params);
};

//#endregion
//#region src/plugins/message/ext/bubbles/objects/Game_Message.js
/**
* Extends {@link clear}.<br/>
* Also forgets who the last message was floating above.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Game_Message.set("clear", Game_Message.prototype.clear);
Game_Message.prototype.clear = function() {
	J.MESSAGE.EXT.BUBBLES.Aliased.Game_Message.get("clear").call(this);
	/**
	* The target an author named, exactly as they typed it between the brackets.
	* @type {string}
	*/
	this.setBubbleTarget(String.empty);
	/**
	* The event whose page is running this message, for a target of `self`.
	* @type {number}
	*/
	this.setBubbleHostEventId(0);
};
/**
* Extends {@link add}.<br/>
* Also lifts the pop code out of the line before the line becomes something a player reads.
*
* Taken out here rather than while the message is being drawn, because by then the text has been
* measured, broken into lines and handed to a window - and a code still sitting in it has occupied
* width, pushed a wrap and, if anything failed to consume it, been rendered to the screen. The line
* that reaches the message should already be the line the player sees.
* @param {string} text One line of the message.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Game_Message.set("add", Game_Message.prototype.add);
Game_Message.prototype.add = function(text) {
	const spoken = this.extractBubbleTarget(text);
	J.MESSAGE.EXT.BUBBLES.Aliased.Game_Message.get("add").call(this, spoken);
};
/**
* Reads the pop code out of a line, remembering what it named.
* @param {string} text One line of the message.
* @returns {string} The line without its pop code, or the line unchanged when it had none.
*/
Game_Message.prototype.extractBubbleTarget = function(text) {
	const match = J.MESSAGE.EXT.BUBBLES.RegExp.PopTarget.exec(text);
	if (match === null) return text;
	const [whole, target] = match;
	this.setBubbleTarget(target);
	return text.replace(whole, String.empty);
};
/**
* The target an author named for this message.
* @returns {string} The contents of their `\pop[...]`, or empty when they wrote none.
*/
Game_Message.prototype.bubbleTarget = function() {
	return this._bubbleTarget;
};
/**
* Sets the target an author named for this message.
* @param {string} target The contents of their `\pop[...]`.
*/
Game_Message.prototype.setBubbleTarget = function(target) {
	this._bubbleTarget = target;
};
/**
* The event whose page is running this message.
* @returns {number} The event id, or zero when no event is running one.
*/
Game_Message.prototype.bubbleHostEventId = function() {
	return this._bubbleHostEventId;
};
/**
* Sets the event whose page is running this message.
* @param {number} eventId The event id.
*/
Game_Message.prototype.setBubbleHostEventId = function(eventId) {
	this._bubbleHostEventId = eventId;
};

//#endregion
//#region src/plugins/message/ext/bubbles/sprites/Sprite_MessageBubble.js
/**
* The drawn backdrop a floating message sits on.
*
* Drawn rather than stamped from a windowskin, which is the decision everything else about this
* ship follows from. A nine-sliced image can be stretched to any size but it cannot have a hole cut
* in one edge for a name to sit in, it cannot grow a tail pointing at a character who is walking,
* and it cannot be recoloured per speaker without shipping a second image. All three of those are
* the feature.
*
* It is a direct child of the window rather than an inner child, unlike the glyph layer. The client
* area an inner child lands in is clipped to its own rectangle by a filter, and a tail lives
* entirely outside that rectangle by design - it would be neatly cut off at the exact line it is
* supposed to cross.
*
* This class decides nothing. Where the border runs, where the tail leaves from and how wide the
* legend's gap is are all {@link BubbleShape}'s, because a sprite is not somewhere logic can be
* tested. What is left here is issuing the drawing calls in order, which is all a sprite should be.
*/
var Sprite_MessageBubble = class Sprite_MessageBubble extends Sprite {
	/**
	* How thick the drawn border is, in logical pixels.
	* @type {number}
	*/
	static BorderWidth = 3;
	/**
	* The colour a bubble is filled with until a speaker's profile says otherwise.
	* @type {number}
	*/
	static DefaultFillColor = 1185830;
	/**
	* How opaque a bubble's fill is.
	*
	* Not quite solid, so a bubble sitting over a busy tile still reads as floating above the map
	* rather than as a hole cut in it - but nowhere near translucent enough to make the text compete
	* with whatever is behind it.
	* @type {number}
	*/
	static DefaultFillAlpha = .92;
	/**
	* The colour a bubble is outlined in until a speaker's profile says otherwise.
	* @type {number}
	*/
	static DefaultBorderColor = 15922424;
	/**
	* How large the speaker's name is drawn, in logical pixels.
	*
	* A little larger than the dialogue it labels, and bold, because it is a label rather than part of
	* the conversation - it wants to be readable at a glance and then ignored, which is the opposite
	* of what shrinking it would achieve. Fixed rather than derived from the message's own font size,
	* so a line written at `\FS[16]` does not arrive with a shrunken nameplate attached.
	* @type {number}
	*/
	static LegendFontSize = 30;
	/**
	* The colour the speaker's name is drawn in, as the CSS string the engine deals in.
	* @type {string}
	*/
	static DefaultLegendColor = "#f2f4f8";
	/**
	* Extend initialization to build an empty backdrop.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
		this.createGraphics();
		this.createLegend();
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The canvas this bubble's body and border are drawn onto.
		* @type {PIXI.Graphics}
		*/
		this._j._graphics = null;
		/**
		* The colour this bubble is filled with.
		* @type {number}
		*/
		this._j._fillColor = Sprite_MessageBubble.DefaultFillColor;
		/**
		* How opaque this bubble's fill is.
		* @type {number}
		*/
		this._j._fillAlpha = Sprite_MessageBubble.DefaultFillAlpha;
		/**
		* The colour this bubble is outlined in.
		* @type {number}
		*/
		this._j._borderColor = Sprite_MessageBubble.DefaultBorderColor;
		/**
		* The speaker's name, set into the border the way a legend is set into a fieldset.
		* @type {Sprite_BaseText}
		*/
		this._j._legend = null;
	}
	/**
	* Creates the canvas this bubble draws onto and attaches it.
	*/
	createGraphics() {
		const graphics = new PIXI.Graphics();
		this.setGraphics(graphics);
		this.addChild(graphics);
	}
	/**
	* Creates the sprite the speaker's name is drawn on and attaches it.
	*/
	createLegend() {
		const legend = new Sprite_BaseText(String.empty);
		legend.setFontSize(Sprite_MessageBubble.LegendFontSize);
		legend.setColor(Sprite_MessageBubble.DefaultLegendColor);
		legend.setBold(true);
		this.setLegend(legend);
		this.addChild(legend);
	}
	/**
	* The sprite the speaker's name is drawn on.
	* @returns {Sprite_BaseText}
	*/
	legend() {
		return this._j._legend;
	}
	/**
	* Sets the sprite the speaker's name is drawn on.
	* @param {Sprite_BaseText} legend The name sprite.
	*/
	setLegend(legend) {
		this._j._legend = legend;
	}
	/**
	* Sets the colour the speaker's name is drawn in.
	* @param {string} color The colour, as the CSS string text rendering deals in.
	*/
	setLegendColor(color) {
		this.legend().setColor(color);
	}
	/**
	* Names whoever is speaking, or nobody.
	* @param {string} speakerName The name to set into the border, already converted from any text
	* codes it was written with.
	*/
	setSpeakerName(speakerName) {
		this.legend().setText(speakerName);
	}
	/**
	* How much room the speaker's name needs, in logical pixels.
	* @returns {number} The width of the drawn name, or zero when nobody is named.
	*/
	legendWidth() {
		const legend = this.legend();
		if (legend.text() === String.empty) return 0;
		return legend.measureTextWidth();
	}
	/**
	* The canvas this bubble's body and border are drawn onto.
	* @returns {PIXI.Graphics}
	*/
	graphics() {
		return this._j._graphics;
	}
	/**
	* Sets the canvas this bubble's body and border are drawn onto.
	* @param {PIXI.Graphics} graphics The canvas.
	*/
	setGraphics(graphics) {
		this._j._graphics = graphics;
	}
	/**
	* The colour this bubble is filled with.
	* @returns {number}
	*/
	fillColor() {
		return this._j._fillColor;
	}
	/**
	* Sets the colour this bubble is filled with.
	* @param {number} color The fill colour.
	*/
	setFillColor(color) {
		this._j._fillColor = color;
	}
	/**
	* How opaque this bubble's fill is.
	* @returns {number}
	*/
	fillAlpha() {
		return this._j._fillAlpha;
	}
	/**
	* Sets how opaque this bubble's fill is.
	* @param {number} alpha The fill opacity.
	*/
	setFillAlpha(alpha) {
		this._j._fillAlpha = alpha;
	}
	/**
	* The colour this bubble is outlined in.
	* @returns {number}
	*/
	borderColor() {
		return this._j._borderColor;
	}
	/**
	* Sets the colour this bubble is outlined in.
	* @param {number} color The border colour.
	*/
	setBorderColor(color) {
		this._j._borderColor = color;
	}
	/**
	* Draws this bubble at the given size, pointing wherever it is pointing right now.
	*
	* Redrawn whole rather than in pieces, and redrawn on every frame the caller asks for. The tail
	* has to follow a speaker who is walking, and the tail is part of the same outline as the body -
	* splitting them so the body could be cached would put a seam across the tail's mouth, which is
	* the one join in the whole shape that has to be invisible. A dozen path commands per frame for a
	* single object is not the cost worth paying for that.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail Where the tail leaves and points, or null to draw no tail.
	*/
	refresh(bounds, tail) {
		const legendGap = BubbleShape.legendGapFor(bounds, this.legendWidth());
		const graphics = this.graphics();
		graphics.clear();
		this.fillBody(graphics, bounds, tail);
		this.strokeBorder(graphics, bounds, tail, legendGap);
		this.placeLegend(bounds, legendGap);
	}
	/**
	* Sits the speaker's name in the gap left for it, or hides it when there is no gap.
	*
	* The name straddles the border rather than resting above or below it, which is the whole look:
	* `Sprite_BaseText` centres its text vertically within its own bitmap, so putting the bitmap's
	* centre on the border line puts the text's centre there too.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} legendGap The stretch of border left out for the name, or null.
	*/
	placeLegend(bounds, legendGap) {
		const legend = this.legend();
		if (legendGap === null) {
			legend.visible = false;
			return;
		}
		legend.visible = true;
		legend.x = legendGap.start + BubbleShape.LegendPadding - legend.padding();
		legend.y = bounds.top - legend.bitmap.height / 2;
	}
	/**
	* Fills the body of the bubble, tail included.
	*
	* Traced without the legend's gap on purpose: the gap is a hole in the *border*, not in the
	* bubble. Filling around it would cut a notch out of the backdrop and the name would be sitting
	* over the map.
	* @param {PIXI.Graphics} graphics The canvas to draw onto.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail Where the tail leaves and points, or null to draw no tail.
	*/
	fillBody(graphics, bounds, tail) {
		const path = BubbleShape.outlinePath(bounds, tail, null);
		graphics.beginFill(this.fillColor(), this.fillAlpha());
		this.tracePath(graphics, path);
		graphics.endFill();
	}
	/**
	* Strokes the border, stepping around the legend.
	* @param {PIXI.Graphics} graphics The canvas to draw onto.
	* @param {BubbleBounds} bounds The box the border encloses.
	* @param {?object} tail Where the tail leaves and points, or null to draw no tail.
	* @param {?object} legendGap The stretch of border to leave out, or null for an unbroken one.
	*/
	strokeBorder(graphics, bounds, tail, legendGap) {
		const path = BubbleShape.outlinePath(bounds, tail, legendGap);
		graphics.lineStyle(Sprite_MessageBubble.BorderWidth, this.borderColor(), 1);
		this.tracePath(graphics, path);
		graphics.lineStyle(0);
	}
	/**
	* Walks a path onto the canvas, lifting the pen only where the path itself is broken.
	* @param {PIXI.Graphics} graphics The canvas to draw onto.
	* @param {object[]} path The segments to trace, in order.
	*/
	tracePath(graphics, path) {
		path.forEach((segment, index) => {
			const startsFresh = index === 0 || BubbleShape.continuesFrom(path[index - 1], segment) === false;
			if (startsFresh === true) {
				const start = BubbleShape.startOf(segment);
				graphics.moveTo(start.x, start.y);
			}
			this.traceSegment(graphics, segment);
		});
	}
	/**
	* Draws one segment from wherever the pen currently is.
	* @param {PIXI.Graphics} graphics The canvas to draw onto.
	* @param {object} segment The line or arc to draw.
	*/
	traceSegment(graphics, segment) {
		if (segment.kind === "arc") {
			graphics.arc(segment.centerX, segment.centerY, segment.radius, segment.startAngle, segment.endAngle);
			return;
		}
		graphics.lineTo(segment.toX, segment.toY);
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/sprites/Sprite_SpentBubble.js
/**
* A bubble somebody has finished speaking, still on screen while the conversation continues.
*
* Built from the message's glyph records rather than handed the live window's sprites. The window
* measures every message before it reveals it, so the records are already sitting there as plain
* values - and a value survives the window being torn down and rebuilt for the next line, which an
* object graph reparented out of it does not.
*
* **It is frozen by not walking its own children.** The engine's `Sprite.update` recurses, so a
* glyph plane inside anything that updates keeps ticking; declining to recurse stops the effect
* clock dead while leaving this sprite free to keep following its owner around the map. A waving
* word stays caught at whatever point in its wave the speaker stopped talking, which is the right
* answer for both: it is still legibly the same word, and it is visibly no longer being said.
*/
var Sprite_SpentBubble = class Sprite_SpentBubble extends Sprite {
	/**
	* How much of its original brightness a spent bubble keeps.
	*
	* Far enough down to read as background without becoming unreadable. What is being communicated
	* is "this was said a moment ago", not "this is gone".
	* @type {number}
	*/
	static SpentAlpha = .62;
	/**
	* Extend initialization to rebuild one finished message.
	* @param {string} token The target the message named, verbatim.
	* @param {object} entry Everything the message left behind.
	*/
	initialize(token, entry) {
		super.initialize();
		this.initMembers();
		this.setToken(token);
		this.setEntry(entry);
		this.createBubble();
		this.createGlyphs();
		this.alpha = Sprite_SpentBubble.SpentAlpha;
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The target the message named, which is also this bubble's identity.
		* @type {string}
		*/
		this._j._token = String.empty;
		/**
		* Everything the finished message left behind.
		* @type {object}
		*/
		this._j._entry = null;
		/**
		* The backdrop this bubble is drawn on.
		* @type {Sprite_MessageBubble}
		*/
		this._j._bubble = null;
		/**
		* The plane holding this bubble's frozen letters.
		* @type {Sprite}
		*/
		this._j._glyphPlane = null;
	}
	/**
	* The target the message named.
	* @returns {string}
	*/
	token() {
		return this._j._token;
	}
	/**
	* Sets the target the message named.
	* @param {string} token The target, verbatim.
	*/
	setToken(token) {
		this._j._token = token;
	}
	/**
	* Everything the finished message left behind.
	* @returns {object}
	*/
	entry() {
		return this._j._entry;
	}
	/**
	* Sets everything the finished message left behind.
	* @param {object} entry The retained message.
	*/
	setEntry(entry) {
		this._j._entry = entry;
	}
	/**
	* The backdrop this bubble is drawn on.
	* @returns {Sprite_MessageBubble}
	*/
	bubble() {
		return this._j._bubble;
	}
	/**
	* Sets the backdrop this bubble is drawn on.
	* @param {Sprite_MessageBubble} bubble The backdrop.
	*/
	setBubble(bubble) {
		this._j._bubble = bubble;
	}
	/**
	* The plane holding this bubble's frozen letters.
	* @returns {Sprite}
	*/
	glyphPlane() {
		return this._j._glyphPlane;
	}
	/**
	* Sets the plane holding this bubble's frozen letters.
	* @param {Sprite} plane The glyph plane.
	*/
	setGlyphPlane(plane) {
		this._j._glyphPlane = plane;
	}
	/**
	* Builds the backdrop, in the colours the message was drawn in.
	*/
	createBubble() {
		const { style, speakerName } = this.entry();
		const bubble = new Sprite_MessageBubble();
		bubble.setFillColor(style.fillColor);
		bubble.setFillAlpha(style.fillAlpha);
		bubble.setBorderColor(style.borderColor);
		bubble.setLegendColor(style.legendColor);
		bubble.setSpeakerName(speakerName);
		bubble.visible = style.drawn;
		this.setBubble(bubble);
		this.addChild(bubble);
	}
	/**
	* Rebuilds the message's letters, each caught at the moment its speaker stopped.
	*
	* The plane is offset by the window's padding because glyph coordinates were measured from the
	* inside of the message window's contents, and the bubble around them is drawn from its outer
	* edge. Without it every letter lands one padding up and to the left of the box it belongs in.
	*/
	createGlyphs() {
		const { glyphs, padding, frame } = this.entry();
		const plane = new Sprite();
		plane.x = padding;
		plane.y = padding;
		glyphs.forEach((glyph) => {
			const sprite = new Sprite_MessageGlyph(glyph);
			const modulation = MessageEffectRegistry.modulate(glyph.effects, glyph.index, frame);
			sprite.applyModulation(modulation);
			plane.addChild(sprite);
		});
		this.setGlyphPlane(plane);
		this.addChild(plane);
	}
	/**
	* Whether the character this bubble belongs to is still somewhere it can be drawn above.
	* @returns {boolean}
	*/
	hasTarget() {
		return this.currentTarget() !== null;
	}
	/**
	* Whoever this bubble belongs to, as they stand right now.
	*
	* Resolved every frame rather than remembered, for the same reason the entry is keyed on a token:
	* an actor moves between the player sprite and a follower as the party is reordered, and the
	* bubble should follow the actor rather than whichever sprite they happened to be.
	* @returns {?(Game_Character|BubbleAnchor)}
	*/
	currentTarget() {
		const { hostEventId } = this.entry();
		return BubbleTargetResolver.resolve(this.token(), hostEventId);
	}
	/**
	* Keeps this bubble over its owner, without letting anything inside it move.
	*
	* Deliberately does **not** call the original. The engine's own update walks every child, and the
	* children here are a frozen message - the whole point of a spent bubble is that its effects
	* stopped when its speaker did.
	*/
	update() {
		const target = this.currentTarget();
		if (target === null) {
			this.visible = false;
			return;
		}
		this.visible = true;
		const { content, padding, preferBelow } = this.entry();
		const anchorX = target.screenX();
		const anchorY = target.bubbleAnchorY(preferBelow);
		const solved = BubbleLayout.solve(content, padding, anchorX, anchorY, Graphics.boxWidth, Graphics.boxHeight, preferBelow);
		this.x = solved.x;
		this.y = solved.y;
		this.bubble().refresh(solved.bounds, solved.tail);
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/sprites/Sprite_SpentBubbleLayer.js
/**
* The plane everyone who has already spoken is still sitting on.
*
* It owns no state of its own. Every frame it compares what it is showing against what the manager
* is holding and makes the two agree - a speaker the manager has gained gets a bubble, one it has
* lost has theirs taken away. That is what makes ending a conversation a single `clear()` somewhere
* else rather than a cleanup routine that has to find and dismantle things.
*
* It lives on the scene rather than inside the spriteset on purpose. `Spriteset_Base.updatePosition`
* applies the screen's shake and zoom to everything under it, and `screenX` does not include either
* - so a spent bubble in there would drift away from the live message beside it the moment anything
* shook the screen, which is precisely when a conversation is most likely to be happening.
*/
var Sprite_SpentBubbleLayer = class extends Sprite {
	/**
	* Extend initialization to establish an empty plane.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The bubbles currently on this plane, by the target each one belongs to.
		* @type {Map<string, Sprite_SpentBubble>}
		*/
		this._j._bubbles = new Map();
	}
	/**
	* The bubbles currently on this plane.
	* @returns {Map<string, Sprite_SpentBubble>}
	*/
	bubbles() {
		return this._j._bubbles;
	}
	/**
	* Extend the update to keep this plane agreeing with the conversation.
	*/
	update() {
		this.syncSpentBubbles();
		super.update();
	}
	/**
	* Adds and removes bubbles until this plane shows exactly who the manager says has spoken.
	*/
	syncSpentBubbles() {
		const retained = SpentBubbleManager.entries();
		this.removeDepartedBubbles(retained);
		retained.forEach(({ token, entry }) => this.addMissingBubble(token, entry));
	}
	/**
	* Takes away the bubbles of anyone no longer part of the conversation.
	* @param {Array<{token: string, entry: object}>} retained Everyone the manager is still holding.
	*/
	removeDepartedBubbles(retained) {
		const stillSpeaking = retained.map(({ token }) => token);
		const drawn = [...this.bubbles().keys()];
		const departed = drawn.filter((token) => stillSpeaking.includes(token) === false);
		departed.forEach((token) => {
			const sprite = this.bubbles().get(token);
			this.removeChild(sprite);
			this.bubbles().delete(token);
		});
	}
	/**
	* Gives a speaker a bubble if they do not already have one on this plane.
	* @param {string} token The target the message named.
	* @param {object} entry Everything that message left behind.
	*/
	addMissingBubble(token, entry) {
		const existing = this.bubbles().get(token);
		if (existing !== undefined) return;
		const sprite = new Sprite_SpentBubble(token, entry);
		this.bubbles().set(token, sprite);
		this.addChild(sprite);
	}
};

//#endregion
//#region src/plugins/message/ext/bubbles/scenes/Scene_Map.js
/**
* Extends {@link #createSpriteset}.<br/>
* Also raises the plane that finished bubbles wait on.
*
* Attached here rather than to the spriteset, and the ordering is doing two jobs. The scene builds
* its window layer immediately after this, so a plane added now sits above the map and below the
* message being read - which is the right way round when somebody starts talking over somebody else.
* And staying outside the spriteset keeps these bubbles out of the screen shake and zoom that
* `Spriteset_Base.updatePosition` applies, which the live message window is also outside of. Two
* bubbles in a conversation have to move together, and a shake is exactly when they would not.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Scene_Map.set("createSpriteset", Scene_Map.prototype.createSpriteset);
Scene_Map.prototype.createSpriteset = function() {
	J.MESSAGE.EXT.BUBBLES.Aliased.Scene_Map.get("createSpriteset").call(this);
	this.createSpentBubbleLayer();
};
/**
* Creates the plane finished bubbles wait on, and ends whatever conversation was in progress.
*
* The clearing is not a guard. A new map is being built, which means the characters those bubbles
* were pointing at have stopped existing - and a scene rebuild is also what happens on the way back
* from a battle or a menu, both of which are places a conversation does not survive.
*/
Scene_Map.prototype.createSpentBubbleLayer = function() {
	SpentBubbleManager.clear();
	this._j ||= {};
	this._j._bubbles ||= {};
	const layer = new Sprite_SpentBubbleLayer();
	this.setSpentBubbleLayer(layer);
	this.addChild(layer);
};
/**
* The plane finished bubbles wait on.
* @returns {Sprite_SpentBubbleLayer}
*/
Scene_Map.prototype.spentBubbleLayer = function() {
	return this._j._bubbles._spentLayer;
};
/**
* Sets the plane finished bubbles wait on.
* @param {Sprite_SpentBubbleLayer} layer The plane.
*/
Scene_Map.prototype.setSpentBubbleLayer = function(layer) {
	this._j._bubbles._spentLayer = layer;
};

//#endregion
//#region src/plugins/message/ext/bubbles/windows/Window_Message.js
/**
* Extends {@link #initMembers}.<br/>
* Also raises the backdrop a floating message is drawn on.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("initMembers", Window_Message.prototype.initMembers);
Window_Message.prototype.initMembers = function() {
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("initMembers").call(this);
	this.initMessageBubbleMembers();
};
/**
* Initializes the members this plugin adds to the message window.
*/
Window_Message.prototype.initMessageBubbleMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with floating messages.
	*/
	this._j._bubbles ||= {};
	/**
	* The character this message is currently floating above, if any.
	* @type {?(Game_Character|BubbleAnchor)}
	*/
	this._j._bubbles._target = null;
	/**
	* The target the current message named, verbatim.
	*
	* Kept alongside the resolved character rather than derived from it, because it is the stable
	* identity of a speaker: `a1` is the player while Jerald leads and a follower after a reorder,
	* and a conversation keyed on the character would give one actor a bubble per marching position.
	* @type {string}
	*/
	this._j._bubbles._token = String.empty;
	/**
	* How much room the current message's text needs, measured before it began revealing.
	* @type {BubbleBounds}
	*/
	this._j._bubbles._content = BubbleBounds.empty();
	/**
	* Everything the current message would need in order to be redrawn without this window.
	*
	* Assembled while the message is still live, because almost none of it survives the message
	* ending - `terminateMessage` clears `$gameMessage`, which takes the speaker's name, the
	* background and the target with it.
	* @type {?object}
	*/
	this._j._bubbles._entry = null;
	/**
	* The rectangle this window occupies when it is not floating anywhere.
	*
	* Captured rather than recomputed, because a floating message resizes the window to fit its own
	* text and the next ordinary message has to find it the size the scene built it.
	* @type {Rectangle}
	*/
	this._j._bubbles._restingRect = new Rectangle(this.x, this.y, this.width, this.height);
	/**
	* The backdrop a floating message is drawn on.
	* @type {Sprite_MessageBubble}
	*/
	this._j._bubbles._sprite = new Sprite_MessageBubble();
	this.addChildAt(this._j._bubbles._sprite, 0);
};
/**
* The character this message is currently floating above.
* @returns {?(Game_Character|BubbleAnchor)} The target, or null when this message is not floating.
*/
Window_Message.prototype.bubbleTarget = function() {
	return this._j._bubbles._target;
};
/**
* Sets the character this message is floating above.
* @param {?(Game_Character|BubbleAnchor)} target The target, or null to stop floating.
*/
Window_Message.prototype.setBubbleTarget = function(target) {
	this._j._bubbles._target = target;
};
/**
* The target the current message named, verbatim.
* @returns {string}
*/
Window_Message.prototype.bubbleToken = function() {
	return this._j._bubbles._token;
};
/**
* Sets the target the current message named.
* @param {string} token The target, verbatim.
*/
Window_Message.prototype.setBubbleToken = function(token) {
	this._j._bubbles._token = token;
};
/**
* Everything the current message would need in order to be redrawn without this window.
* @returns {?object}
*/
Window_Message.prototype.bubbleEntry = function() {
	return this._j._bubbles._entry;
};
/**
* Sets everything the current message would need in order to be redrawn without this window.
* @param {?object} entry The retained message, or null when there is nothing to retain.
*/
Window_Message.prototype.setBubbleEntry = function(entry) {
	this._j._bubbles._entry = entry;
};
/**
* How much room the current message's text needs.
* @returns {BubbleBounds}
*/
Window_Message.prototype.bubbleContent = function() {
	return this._j._bubbles._content;
};
/**
* Sets how much room the current message's text needs.
* @param {BubbleBounds} content The measured text.
*/
Window_Message.prototype.setBubbleContent = function(content) {
	this._j._bubbles._content = content;
};
/**
* The rectangle this window occupies when it is not floating anywhere.
* @returns {Rectangle}
*/
Window_Message.prototype.bubbleRestingRect = function() {
	return this._j._bubbles._restingRect;
};
/**
* The backdrop a floating message is drawn on.
* @returns {Sprite_MessageBubble}
*/
Window_Message.prototype.bubbleSprite = function() {
	return this._j._bubbles._sprite;
};
/**
* Whether the current message is floating above somebody rather than sitting in its usual box.
* @returns {boolean}
*/
Window_Message.prototype.isFloatingMessage = function() {
	return this.bubbleTarget() !== null;
};
/**
* The Position value meaning a bubble should hang under its speaker rather than over them.
* @type {number}
*/
Window_Message.BubbleBelowPosition = 2;
/**
* Whether this message asked to hang under its speaker.
*
* The Show Text command's Position dropdown, reused. It has always been there and has never meant
* anything to a floating message, which makes it the one place an author can already say "put this
* one on the other side" - and two characters talking need exactly that, or both their bubbles land
* at the same height and sit on top of each other.
* @returns {boolean}
*/
Window_Message.prototype.bubblePrefersBelow = function() {
	return $gameMessage.positionType() === Window_Message.BubbleBelowPosition;
};
/**
* Extends {@link #startMessage}.<br/>
* Also works out whether this message floats, and sizes it to its own text if it does.
*
* Split either side of the original on purpose. The target has to be known *before*, because the
* original decides the window's backdrop on the way through and that decision depends on it; the
* measuring has to happen *after*, because it needs the speaker's profile and the page setup the
* original performs.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("startMessage", Window_Message.prototype.startMessage);
Window_Message.prototype.startMessage = function() {
	this.resolveBubbleTarget();
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("startMessage").call(this);
	this.refreshMessageBubble();
};
/**
* Identifies whoever this message should float above, if anybody.
*/
Window_Message.prototype.resolveBubbleTarget = function() {
	const requested = $gameMessage.bubbleTarget();
	const hostEventId = $gameMessage.bubbleHostEventId();
	const target = BubbleTargetResolver.resolve(requested, hostEventId);
	this.setBubbleTarget(target);
	this.setBubbleToken(requested);
	this.setBubbleEntry(null);
	SpentBubbleManager.release(requested);
};
/**
* Sizes the window to the message it is about to reveal, and draws the bubble around it.
*/
Window_Message.prototype.refreshMessageBubble = function() {
	const sprite = this.bubbleSprite();
	if (this.isFloatingMessage() === false) {
		sprite.visible = false;
		this.restoreRestingRect();
		return;
	}
	const style = BubbleStyle.forBackground($gameMessage.background());
	sprite.visible = style.drawn;
	sprite.setFillColor(style.fillColor);
	sprite.setFillAlpha(style.fillAlpha);
	sprite.setBorderColor(style.borderColor);
	sprite.setLegendColor(style.legendColor);
	this.nameBoxWindow().close();
	const glyphs = this.layoutMessageGlyphs($gameMessage.allText());
	const content = BubbleGeometry.contentBounds(glyphs);
	this.setBubbleContent(content);
	const speakerName = this.convertEscapeCharacters($gameMessage.speakerName());
	sprite.setSpeakerName(speakerName);
	this.setBubbleEntry({
		hostEventId: $gameMessage.bubbleHostEventId(),
		glyphs,
		content,
		speakerName,
		style,
		padding: this.padding,
		preferBelow: this.bubblePrefersBelow(),
		frame: 0
	});
	this.updateMessageBubble();
};
/**
* Puts the window back the size and shape the scene built it.
*/
Window_Message.prototype.restoreRestingRect = function() {
	const resting = this.bubbleRestingRect();
	if (this.width === resting.width && this.height === resting.height) return;
	this.move(resting.x, resting.y, resting.width, resting.height);
	this.createContents();
};
/**
* Places the floating window over its target and redraws the bubble around it.
*
* Run every frame rather than once, because the target walks. `updatePlacement` fires exactly once
* per message, from `startMessage`, so a bubble positioned only from there would be left behind the
* moment its owner took a step.
*/
Window_Message.prototype.updateMessageBubble = function() {
	const target = this.bubbleTarget();
	const content = this.bubbleContent();
	const preferBelow = this.bubblePrefersBelow();
	const anchorX = target.screenX();
	const anchorY = target.bubbleAnchorY(preferBelow);
	const solved = BubbleLayout.solve(content, this.padding, anchorX, anchorY, Graphics.boxWidth, Graphics.boxHeight, preferBelow);
	this.resizeMessageBubble(solved.x, solved.y, solved.width, solved.height);
	this.bubbleSprite().refresh(solved.bounds, solved.tail);
};
/**
* Moves the window, rebuilding its contents only when it actually changed size.
*
* The distinction matters every frame: a walking speaker moves the bubble constantly while its size
* holds still, and `createContents` allocates a bitmap.
* @param {number} x Where the window's left edge goes.
* @param {number} y Where the window's top edge goes.
* @param {number} width How wide the window should be.
* @param {number} height How tall the window should be.
*/
Window_Message.prototype.resizeMessageBubble = function(x, y, width, height) {
	const isSameSize = this.width === width && this.height === height;
	this.move(x, y, width, height);
	if (isSameSize === true) return;
	this.createContents();
};
/**
* The plate the engine draws a speaker's name on.
* @returns {Window_NameBox}
*/
Window_Message.prototype.nameBoxWindow = function() {
	return this._nameBoxWindow;
};
/**
* Extends {@link #updateSpeakerName}.<br/>
* Also keeps the engine's name plate out of the way of the bubble's own legend.
*
* A floating message already says who is speaking, set into its own border. The plate would be the
* same name a second time, in a rectangle, parked wherever the bubble happens to have floated to -
* which is the exact thing the legend exists to replace.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("updateSpeakerName", Window_Message.prototype.updateSpeakerName);
Window_Message.prototype.updateSpeakerName = function() {
	if (this.isFloatingMessage() === true) {
		this.nameBoxWindow().setName(String.empty);
		return;
	}
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("updateSpeakerName").call(this);
};
/**
* Extends {@link #update}.<br/>
* Also keeps a floating message over the character it belongs to.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("update", Window_Message.prototype.update);
Window_Message.prototype.update = function() {
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("update").call(this);
	if (this.isFloatingMessage() === false) return;
	this.updateMessageBubble();
};
/**
* Extends {@link #updateBackground}.<br/>
* Also takes the windowskin away from a floating message, and gives it back to one that is not.
*
* Both directions on every call, deliberately. This runs once per message, so an alias that only
* turned the chrome off would leave the next ordinary message in the game with no frame and no
* backdrop at all.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("updateBackground", Window_Message.prototype.updateBackground);
Window_Message.prototype.updateBackground = function() {
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("updateBackground").call(this);
	if (this.isFloatingMessage() === true) {
		this.setBackgroundType(2);
		this.frameVisible = false;
		return;
	}
	this.frameVisible = true;
};
/**
* Extends {@link #terminateMessage}.<br/>
* Also puts the window back where an ordinary message expects to find it.
*/
J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.set("terminateMessage", Window_Message.prototype.terminateMessage);
Window_Message.prototype.terminateMessage = function() {
	this.retainMessageBubble();
	J.MESSAGE.EXT.BUBBLES.Aliased.Window_Message.get("terminateMessage").call(this);
	this.setBubbleTarget(null);
	this.setBubbleToken(String.empty);
	this.setBubbleEntry(null);
	this.bubbleSprite().visible = false;
	this.restoreRestingRect();
};
/**
* Leaves this message's bubble behind for the rest of the conversation.
*
* Caught at whatever frame the message was on when it closed, so the letters freeze where they were
* rather than snapping back to rest - a word that was mid-wave stays mid-wave, which reads as
* somebody having stopped talking rather than as the effect having been switched off.
*/
Window_Message.prototype.retainMessageBubble = function() {
	if (this.isFloatingMessage() === false) return;
	const entry = this.bubbleEntry();
	entry.frame = this.messageGlyphLayer().frame();
	SpentBubbleManager.retain(this.bubbleToken(), entry);
};

//#endregion
//#region src/plugins/message/ext/bubbles/_metadata/pluginCommands.js
/**
* Ends the current conversation, clearing every bubble left behind by it.
*
* Authored rather than timed on purpose. Only the person writing the scene knows when it is over,
* and a timeout would have to guess - which would also mean characters could not pace around
* between their lines without their own dialogue evaporating behind them.
*/
PluginManager.registerCommand(J.MESSAGE.EXT.BUBBLES.Metadata.name, "end-conversation", () => {
	SpentBubbleManager.clear();
});

//#endregion
//# sourceMappingURL=J-Message-Bubbles.js.map