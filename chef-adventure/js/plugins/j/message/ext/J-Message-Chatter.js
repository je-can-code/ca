//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MESSAGE-CHATTER] A J-Message extension that gives idle NPCs something to say.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Message
 * @base J-Message-Bubbles
 * @orderAfter J-Base
 * @orderAfter J-Message
 * @orderAfter J-Message-Bubbles
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin lets characters talk to themselves as the player walks past.
 *
 * A civilian mutters about the weather; a shopkeeper tries to peddle his
 * goods. Nobody pressed a button and nothing was interrupted to make it
 * happen: chatter runs alongside whatever the player is doing, never blocks
 * the interpreter, and never takes the player's input.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Message; a chatter line is laid out as that plugin's glyphs.
 * - J-Message-Bubbles; a chatter line is drawn as that plugin's bubble.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Chatter is declared on an event page, which means it inherits that page's
 * conditions for free. A merchant who has closed up for the night is page two
 * with no chatter tags on it, and the muttering stops with the page.
 *
 * Chatter is silent- it plays no sound as it types itself out. A whole town
 * of blipping NPCs gets obnoxious fast.
 *
 * Line breaks are the author's, always. A chatter line is never re-wrapped.
 *
 * ============================================================================
 * GIVING A CHARACTER SOMETHING TO SAY:
 * Put a comment on the event page carrying this tag:
 *
 * TAG FORMAT:
 *  <chatter:LINE>
 *
 * TAG EXAMPLES:
 *  <chatter:Lovely weather, isn't it.>
 *  <chatter:Anything I can get you? Half price today.>
 * This character has two things they might say, and picks between them. The
 * same line is never said twice in a row.
 *
 * A line may not contain the < or > characters. A comment carrying either is
 * dropped before this plugin is ever offered it, and the result is a character
 * who simply says nothing. Everything else in ordinary prose is fine.
 * ============================================================================
 * TUNING ONE CHARACTER:
 * Every tag below is optional, and each overrides the project default for this
 * character only. Most chattering events will want none of them; an excitable
 * child or a bemoaning merchant might want one or two.
 *
 * TAG FORMAT:
 *  <chatterRadius:TILES>
 *  <chatterCooldown:FRAMES>
 *  <chatterDelay:FRAMES>
 *  <chatterDuration:FRAMES>
 *  <chatterSpeed:FRAMES>
 *  <chatterPosition:top|middle|bottom>
 *
 * TAG EXAMPLES:
 *  <chatterRadius:5>
 * The player hears this character from up to five tiles away. Walls do not
 * enter into it; this is simply the distance between the two of them.
 *
 *  <chatterCooldown:600>
 * This character says nothing for ten seconds after finishing a line. The
 * clock starts when the line ends, never when it begins.
 *
 *  <chatterDelay:300>
 * This character waits somewhere between zero and five seconds before
 * speaking. The wait is rolled fresh every time, which is what keeps a row of
 * shopkeepers from speaking in lockstep. It only counts down while the player
 * is close enough to hear how it ends.
 *
 *  <chatterDuration:180>
 * A finished line stays on screen for three seconds. Counted from the moment
 * it finishes typing out, so a long line is readable for as long as a short
 * one.
 *
 *  <chatterSpeed:2>
 * A new character of the line appears every two frames. Zero shows the whole
 * line at once.
 *
 *  <chatterPosition:top>
 * The bubble floats above this character's head. Use bottom to hang it under
 * their feet instead, which is how two characters near each other avoid
 * stacking their bubbles in the same place. Middle behaves as top does.
 * ============================================================================
 * PROJECT DEFAULTS:
 * The defaults every character starts from live in the "chatter" section of
 * data/config.message.json, alongside the speaker profiles. A project that has
 * not written that section gets the plugin's own defaults, which are the
 * numbers used as examples above.
 * ============================================================================
 * WHEN CHATTER STOPS:
 * - The player walks out of earshot. The line is cut where it stands.
 * - A message opens above that character. Somebody you have started talking to
 *   stops muttering; everybody else carries on.
 * - An event takes the floor. A cutscene does not get heckled, and every idle
 *   line on the map is cut for the duration of it.
 * - The map changes.
 *
 * A line forced by the plugin command below ignores the first two - it is
 * heard from anywhere and it carries on through a cutscene, which is the
 * entire point of it. It is still cut by the map changing, and by a message
 * opening above that same character, because one character cannot be
 * muttering and speaking dialogue in the same place at the same time.
 *
 * Note that this is only ever about the character the message is on. A
 * forced line on somebody else carries on regardless - one character
 * thinking while another one talks needs nothing at all, whatever the two of
 * them are doing.
 *
 * For the same character, tick Keep During Dialogue on the command. That is
 * how one person holds a thought while saying something else out loud. It is
 * also the one case where the two bubbles share an anchor however much room
 * the scene has, so give them opposite sides - the thought at top and the
 * spoken line at bottom, or the reverse.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command chatter-now
 * @text Chatter Now
 * @desc Makes a character say one specific line, ignoring radius, cooldown and any running event.
 *
 * @arg target
 * @type string
 * @text Target
 * @desc Who says it. Accepts self, player, eN for an event, aN for an actor, fN for a follower, or X,Y for a point.
 * @default self
 *
 * @arg text
 * @type string
 * @text Text
 * @desc What they say. Message text codes work here exactly as they do in a Show Text command.
 * @default
 *
 * @arg duration
 * @type string
 * @text Duration
 * @desc How many frames it stays up after it finishes typing out. Leave blank for this character's usual.
 * @default
 *
 * @arg position
 * @type select
 * @option
 * @option top
 * @option middle
 * @option bottom
 * @text Position
 * @desc Which side of the character it sits on. Leave blank for this character's usual.
 * @default
 *
 * @arg background
 * @type select
 * @option
 * @option window
 * @option dim
 * @option transparent
 * @text Background
 * @desc What it is drawn on, as the Show Text dropdown means it. Dim reads as a thought. Blank for the usual.
 * @default
 *
 * @arg persist
 * @type boolean
 * @text Keep During Dialogue
 * @desc Keep this line up even while a message opens above the same character. You decide where each one sits.
 * @default false
 */
//endregion annotations

//#region src/plugins/message/ext/chatter/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Message-Chatter.
*
* Deliberately empty of parameters. Every knob chatter has - how far an NPC is heard, how long they
* wait, how long they are on screen - is something a single excitable child and a single bored
* merchant need different answers to, and the plugin manager holds exactly one answer per project.
* The defaults live in the `chatter` section of `data/config.message.json`, where they can be
* overridden per event by a comment tag on the page.
*/
var J_MessageChatterPluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/message/ext/chatter/_metadata/initialization.js
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
	const requiredMessageVersion = "1.3.1";
	const hasMessageRequirement = J.BASE.Helpers.satisfies(J.MESSAGE.Metadata.version.version(), requiredMessageVersion);
	if (hasMessageRequirement === false) {
		throw new Error(`Either missing J-Message or has a lower version than the required: ${requiredMessageVersion}`);
	}
	const requiredBubblesVersion = "1.0.0";
	const bubblesVersion = J.MESSAGE.EXT.BUBBLES.Metadata.version.version();
	const hasBubblesRequirement = J.BASE.Helpers.satisfies(bubblesVersion, requiredBubblesVersion);
	if (hasBubblesRequirement === false) {
		throw new Error(`Either missing J-Message-Bubbles or has a lower version than the required: ${requiredBubblesVersion}`);
	}
})();
/**
* The plugin umbrella that governs all extensions related to the message system.
*/
J.MESSAGE.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MESSAGE.EXT.CHATTER = {};
/**
* The metadata associated with this plugin.
*/
J.MESSAGE.EXT.CHATTER.Metadata = new J_MessageChatterPluginMetadata("J-Message-Chatter", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MESSAGE.EXT.CHATTER.Aliased = {};
J.MESSAGE.EXT.CHATTER.Aliased.Game_Event = new Map();
J.MESSAGE.EXT.CHATTER.Aliased.Game_Map = new Map();
J.MESSAGE.EXT.CHATTER.Aliased.Scene_Map = new Map();
J.MESSAGE.EXT.CHATTER.Aliased.Window_Message = new Map();
/**
* All regular expressions used by this plugin.
*/
J.MESSAGE.EXT.CHATTER.RegExp = {};
/**
* One line this character may say to themselves, unprompted.
*
* <pre>
* Structure:
*  <chatter:LINE>
*
* Example:
*  <chatter:Anything I can get you? Half price today.>
*
* Translation:
*  this character may mutter "Anything I can get you? Half price today." as the player passes.
* </pre>
*
* This is the one tag on the page that may appear more than once: every one of them is a line in
* the same character's pool, and the picker chooses between them. The capture is anything that is
* not a closing angle bracket, because the value is prose rather than a parameter list - a line
* carrying a comma or a bracket is ordinary writing, not a second argument.
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.Chatter = /<chatter: ?([^>]+)>/i;
/**
* How far away this character can still be heard, in tiles.
*
* <pre>
* Structure:
*  <chatterRadius:TILES>
*
* Example:
*  <chatterRadius:5>
*
* Translation:
*  this character chatters while the player is within five tiles of them.
* </pre>
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterRadius = /<chatterRadius: ?(\d+)>/i;
/**
* How long this character rests after a line before they may say another, in frames.
*
* <pre>
* Structure:
*  <chatterCooldown:FRAMES>
*
* Example:
*  <chatterCooldown:600>
*
* Translation:
*  this character says nothing for ten seconds after finishing a line.
* </pre>
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterCooldown = /<chatterCooldown: ?(\d+)>/i;
/**
* The longest this character waits before speaking once they are able to, in frames.
*
* <pre>
* Structure:
*  <chatterDelay:FRAMES>
*
* Example:
*  <chatterDelay:300>
*
* Translation:
*  this character waits somewhere between zero and five seconds before speaking.
* </pre>
*
* The actual wait is rolled somewhere in that range rather than being the number written, which is
* what keeps a row of shopkeepers from all speaking on the same frame forever.
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterDelay = /<chatterDelay: ?(\d+)>/i;
/**
* How long a finished line stays on screen, in frames.
*
* <pre>
* Structure:
*  <chatterDuration:FRAMES>
*
* Example:
*  <chatterDuration:180>
*
* Translation:
*  this character's lines linger for three seconds after they finish typing out.
* </pre>
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterDuration = /<chatterDuration: ?(\d+)>/i;
/**
* How quickly this character's lines type out, in frames per character.
*
* <pre>
* Structure:
*  <chatterSpeed:FRAMES>
*
* Example:
*  <chatterSpeed:2>
*
* Translation:
*  a new character of this line appears every two frames.
* </pre>
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterSpeed = /<chatterSpeed: ?(\d+)>/i;
/**
* Which side of this character their chatter sits on.
*
* <pre>
* Structure:
*  <chatterPosition:WHERE>
*
* Example:
*  <chatterPosition:top>
*
* Translation:
*  this character's chatter floats above their head.
* </pre>
*
* The three words mean what the Show Text command's Position dropdown means to a bubble, so an
* author who has placed a conversation already knows what they do.
* @type {RegExp}
*/
J.MESSAGE.EXT.CHATTER.RegExp.ChatterPosition = /<chatterPosition: ?(top|middle|bottom)>/i;

//#endregion
//#region src/plugins/message/ext/chatter/__models/ChatterProfile.js
/**
* Everything settled about how one character chatters.
*
* Every field is populated, always. A profile is built by laying the page's tags over the project's
* configured defaults, and those over the defaults written here - so by the time anything reads one,
* "the author did not say" has already been answered and no consumer has to ask whether a value is
* present before using it.
*
* The three layers exist because the three questions are different. The constants below are what
* chatter means with nobody having configured anything at all; the config section is what *this*
* project considers ordinary; the tags are what makes this particular shopkeeper louder than the
* one across the street. Jeremy's expectation is that the third layer stays small: *"many will use a
* single default with a couple of tweaks for an excited kid or bemoaning merchant."*
*/
var ChatterProfile = class ChatterProfile {
	/**
	* How many tiles away a character can be heard from, by default.
	* @type {number}
	*/
	static DefaultRadius = 5;
	/**
	* How many frames a character rests after finishing a line, by default.
	* @type {number}
	*/
	static DefaultCooldown = 600;
	/**
	* The longest a character waits before starting a line, by default, in frames.
	* @type {number}
	*/
	static DefaultDelay = 300;
	/**
	* How many frames a finished line stays on screen, by default.
	* @type {number}
	*/
	static DefaultDuration = 180;
	/**
	* How many frames each character of a line takes to appear, by default.
	* @type {number}
	*/
	static DefaultSpeed = 2;
	/**
	* Which side of a character their chatter sits on, by default.
	* @type {string}
	*/
	static DefaultPosition = "top";
	/**
	* What a chatter bubble is drawn on, by default.
	* @type {string}
	*/
	static DefaultBackground = "window";
	/**
	* The Show Text Background value each authored word means.
	*
	* The same three the editor's own dropdown has offered since MV, named rather than numbered: a
	* plugin command argument is read by whoever writes the scene, and `dim` says what `1` does not.
	* @type {Object<string, number>}
	*/
	static BackgroundTypes = {
		window: 0,
		dim: 1,
		transparent: 2
	};
	/**
	* The position meaning a bubble hangs beneath its speaker rather than over them.
	*
	* The odd one out on purpose: `top` and `middle` both put a bubble above a character, exactly as
	* the Show Text Position dropdown does for a `\pop` message, so `bottom` is the only one of the
	* three that changes which end of the sprite gets aimed at.
	* @type {string}
	*/
	static BelowPosition = "bottom";
	/**
	* Everything this character may say.
	* @type {string[]}
	*/
	#lines = [];
	/**
	* How many tiles away this character can be heard from.
	* @type {number}
	*/
	#radius = ChatterProfile.DefaultRadius;
	/**
	* How many frames this character rests after finishing a line.
	* @type {number}
	*/
	#cooldown = ChatterProfile.DefaultCooldown;
	/**
	* The longest this character waits before starting a line, in frames.
	* @type {number}
	*/
	#delay = ChatterProfile.DefaultDelay;
	/**
	* How many frames a finished line stays on screen.
	* @type {number}
	*/
	#duration = ChatterProfile.DefaultDuration;
	/**
	* How many frames each character of a line takes to appear.
	* @type {number}
	*/
	#speed = ChatterProfile.DefaultSpeed;
	/**
	* Which side of this character their chatter sits on.
	* @type {string}
	*/
	#position = ChatterProfile.DefaultPosition;
	/**
	* What this character's chatter is drawn on.
	* @type {string}
	*/
	#background = ChatterProfile.DefaultBackground;
	/**
	* Constructor.
	* @param {string[]} lines Everything this character may say.
	* @param {number} radius How many tiles away they can be heard from.
	* @param {number} cooldown How many frames they rest after finishing a line.
	* @param {number} delay The longest they wait before starting one, in frames.
	* @param {number} duration How many frames a finished line stays on screen.
	* @param {number} speed How many frames each character of a line takes to appear.
	* @param {string} position Which side of them their chatter sits on.
	* @param {string} background What their chatter is drawn on.
	*/
	constructor(lines, radius, cooldown, delay, duration, speed, position, background) {
		this.#lines = lines;
		this.#radius = radius;
		this.#cooldown = cooldown;
		this.#delay = delay;
		this.#duration = duration;
		this.#speed = speed;
		this.#position = position;
		this.#background = background;
	}
	/**
	* Everything this character may say.
	* @returns {string[]}
	*/
	lines() {
		return this.#lines;
	}
	/**
	* How many tiles away this character can be heard from.
	* @returns {number}
	*/
	radius() {
		return this.#radius;
	}
	/**
	* How many frames this character rests after finishing a line.
	* @returns {number}
	*/
	cooldown() {
		return this.#cooldown;
	}
	/**
	* The longest this character waits before starting a line, in frames.
	* @returns {number}
	*/
	delay() {
		return this.#delay;
	}
	/**
	* How many frames a finished line stays on screen.
	* @returns {number}
	*/
	duration() {
		return this.#duration;
	}
	/**
	* How many frames each character of a line takes to appear.
	* @returns {number}
	*/
	speed() {
		return this.#speed;
	}
	/**
	* Which side of this character their chatter sits on.
	* @returns {string}
	*/
	position() {
		return this.#position;
	}
	/**
	* What this character's chatter is drawn on.
	* @returns {string}
	*/
	background() {
		return this.#background;
	}
	/**
	* The Show Text Background value this character's chatter is drawn with.
	* @returns {number}
	*/
	backgroundType() {
		const known = ChatterProfile.BackgroundTypes[this.#background];
		if (known === undefined) return ChatterProfile.BackgroundTypes.window;
		return known;
	}
	/**
	* Whether this character has anything at all to say.
	*
	* An empty pool is the ordinary state of almost every event in a project, and it is how a page
	* turns chatter off: page two simply carries no `<chatter:>` tags.
	* @returns {boolean}
	*/
	hasLines() {
		return this.#lines.length > 0;
	}
	/**
	* Whether this character's chatter hangs beneath them rather than over their head.
	* @returns {boolean}
	*/
	prefersBelow() {
		return this.#position === ChatterProfile.BelowPosition;
	}
	/**
	* The profile a project that has configured nothing gets.
	* @returns {ChatterProfile}
	*/
	static default() {
		return new ChatterProfile([], ChatterProfile.DefaultRadius, ChatterProfile.DefaultCooldown, ChatterProfile.DefaultDelay, ChatterProfile.DefaultDuration, ChatterProfile.DefaultSpeed, ChatterProfile.DefaultPosition, ChatterProfile.DefaultBackground);
	}
	/**
	* Lays a set of authored values over an existing profile.
	*
	* One merge rather than one per layer, which is what lets the config section and an event page be
	* applied by the same code in the same order every time. Anything the values do not mention is
	* carried through untouched, so a page saying only `<chatterRadius:2>` keeps every other answer
	* the project already settled.
	* @param {ChatterProfile} profile The profile being overridden.
	* @param {object} values Whatever was authored, with anything unauthored absent.
	* @returns {ChatterProfile}
	*/
	static overriddenBy(profile, values) {
		return new ChatterProfile(values.lines ?? profile.lines(), values.radius ?? profile.radius(), values.cooldown ?? profile.cooldown(), values.delay ?? profile.delay(), values.duration ?? profile.duration(), values.speed ?? profile.speed(), values.position ?? profile.position(), values.background ?? profile.background());
	}
	/**
	* Builds a profile from authored values alone, over the defaults written here.
	* @param {object} values Whatever was authored, with anything unauthored absent.
	* @returns {ChatterProfile}
	*/
	static fromValues(values) {
		const defaults = ChatterProfile.default();
		return ChatterProfile.overriddenBy(defaults, values);
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/__models/ChatterSession.js
/**
* One line a character is saying right now.
*
* It holds the line and the clock, and deliberately not the bubble. The bubble is rebuilt from this
* by whichever layer happens to be on screen, exactly as a spent bubble is rebuilt from its entry -
* so a scene torn down and remade loses nothing a player would notice.
*
* **The duration clock does not start when the bubble appears; it starts when the line finishes
* typing itself out.** Otherwise a long line would be readable for less time than a short one, which
* is precisely backwards. The reveal itself is drawn by the sprite, so the sprite is what says when
* it finished - this only knows that it has.
*/
var ChatterSession = class {
	/**
	* What this character is saying.
	* @type {string}
	*/
	#line = String.empty;
	/**
	* The settled profile this line is being said under.
	* @type {ChatterProfile}
	*/
	#profile = null;
	/**
	* Whether this line was demanded by a plugin command rather than chosen by the character.
	*
	* A forced line ignores the rules that exist to keep idle chatter out of the way - earshot and
	* cooldown both - because somebody wrote it into a scene deliberately, and a scene is allowed to
	* say things the ambient system would not.
	* @type {boolean}
	*/
	#forced = false;
	/**
	* Whether this line stays up even while its speaker is delivering a real message.
	*
	* Off by default, and deliberately separate from being forced. A character cannot ordinarily be
	* muttering and speaking dialogue at once - the two bubbles would land in the same place - so
	* keeping both is something an author opts into, having decided where each one goes.
	*
	* What it buys is a character thinking one thing while saying another, which is a scene that
	* cannot be written any other way: a thought bubble over their head and their spoken line at their
	* feet, both on screen, neither interrupting the other.
	* @type {boolean}
	*/
	#persistent = false;
	/**
	* Whether the line has finished typing itself out.
	* @type {boolean}
	*/
	#revealed = false;
	/**
	* How many frames this line stays on screen once it has finished revealing.
	* @type {number}
	*/
	#durationRemaining = 0;
	/**
	* Constructor.
	* @param {string} line What this character is saying.
	* @param {ChatterProfile} profile The settled profile it is being said under.
	* @param {boolean} forced Whether a plugin command demanded this line.
	* @param {number} duration How many frames it stays up once it has finished revealing.
	* @param {boolean} persistent Whether it survives a message opening above the same character.
	*/
	constructor(line, profile, forced, duration, persistent) {
		this.#line = line;
		this.#profile = profile;
		this.#forced = forced;
		this.#durationRemaining = duration;
		this.#persistent = persistent;
	}
	/**
	* What this character is saying.
	* @returns {string}
	*/
	line() {
		return this.#line;
	}
	/**
	* The settled profile this line is being said under.
	* @returns {ChatterProfile}
	*/
	profile() {
		return this.#profile;
	}
	/**
	* Whether a plugin command demanded this line.
	* @returns {boolean}
	*/
	isForced() {
		return this.#forced;
	}
	/**
	* Whether this line stays up while its speaker delivers a real message.
	* @returns {boolean}
	*/
	isPersistent() {
		return this.#persistent;
	}
	/**
	* Whether the line has finished typing itself out.
	* @returns {boolean}
	*/
	hasRevealed() {
		return this.#revealed;
	}
	/**
	* Declares that the line has finished typing itself out.
	*/
	flagRevealed() {
		this.#revealed = true;
	}
	/**
	* How many frames this line has left on screen.
	* @returns {number}
	*/
	durationRemaining() {
		return this.#durationRemaining;
	}
	/**
	* Sets how many frames this line has left on screen.
	* @param {number} frames The frames remaining.
	*/
	setDurationRemaining(frames) {
		this.#durationRemaining = frames;
	}
	/**
	* Whether this line has been on screen long enough and should come down.
	*
	* A line that has not finished revealing is never finished, however long it has taken - which is
	* what makes the duration a measure of reading time rather than of total time.
	* @returns {boolean}
	*/
	isFinished() {
		if (this.#revealed === false) return false;
		return this.#durationRemaining <= 0;
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/__models/ChatterState.js
/**
* Everything the chatter system remembers about one character.
*
* A state outlives any line the character says. It is created when a page declares chatter and it
* survives every line, every cooldown and every trip out of earshot, because the timers are the
* whole point - a character who has just spoken has to keep being the character who has just spoken
* for the next ten seconds.
*/
var ChatterState = class ChatterState {
	/**
	* The delay value meaning no wait has been rolled yet.
	*
	* Distinct from a rolled wait of zero, which means "speak on the very next frame you are able to".
	* A single number covers both because a wait is never legitimately negative.
	* @type {number}
	*/
	static NoDelay = -1;
	/**
	* This character's settled chatter profile.
	* @type {ChatterProfile}
	*/
	#profile = null;
	/**
	* How many frames are left of this character's rolled wait.
	* @type {number}
	*/
	#delayRemaining = ChatterState.NoDelay;
	/**
	* How many frames are left before this character may speak again.
	* @type {number}
	*/
	#cooldownRemaining = 0;
	/**
	* The line this character is saying right now, if any.
	* @type {?ChatterSession}
	*/
	#session = null;
	/**
	* The last thing this character said.
	*
	* Kept so the picker can avoid repeating it. It survives the session that said it on purpose - the
	* repeat worth avoiding is the one a player hears back to back, and by the time a third line comes
	* around the first is long out of earshot of memory.
	* @type {string}
	*/
	#lastLine = String.empty;
	/**
	* Constructor.
	* @param {ChatterProfile} profile This character's settled chatter profile.
	*/
	constructor(profile) {
		this.#profile = profile;
	}
	/**
	* This character's settled chatter profile.
	* @returns {ChatterProfile}
	*/
	profile() {
		return this.#profile;
	}
	/**
	* Sets this character's settled chatter profile.
	* @param {ChatterProfile} profile The newly-settled profile.
	*/
	setProfile(profile) {
		this.#profile = profile;
	}
	/**
	* How many frames are left of this character's rolled wait.
	* @returns {number}
	*/
	delayRemaining() {
		return this.#delayRemaining;
	}
	/**
	* Sets how many frames are left of this character's rolled wait.
	* @param {number} frames The frames remaining, or {@link ChatterState.NoDelay} to ask for a
	* fresh roll.
	*/
	setDelayRemaining(frames) {
		this.#delayRemaining = frames;
	}
	/**
	* Whether this character is due a freshly-rolled wait.
	* @returns {boolean}
	*/
	isAwaitingDelayRoll() {
		return this.#delayRemaining === ChatterState.NoDelay;
	}
	/**
	* How many frames are left before this character may speak again.
	* @returns {number}
	*/
	cooldownRemaining() {
		return this.#cooldownRemaining;
	}
	/**
	* Sets how many frames are left before this character may speak again.
	* @param {number} frames The frames remaining.
	*/
	setCooldownRemaining(frames) {
		this.#cooldownRemaining = frames;
	}
	/**
	* The line this character is saying right now.
	* @returns {?ChatterSession} The live line, or null when this character is quiet.
	*/
	session() {
		return this.#session;
	}
	/**
	* Sets the line this character is saying right now.
	* @param {?ChatterSession} session The line, or null to make them quiet.
	*/
	setSession(session) {
		this.#session = session;
	}
	/**
	* Whether this character is saying something right now.
	* @returns {boolean}
	*/
	isSpeaking() {
		return this.#session !== null;
	}
	/**
	* The last thing this character said.
	* @returns {string}
	*/
	lastLine() {
		return this.#lastLine;
	}
	/**
	* Sets the last thing this character said.
	* @param {string} line The line just chosen.
	*/
	setLastLine(line) {
		this.#lastLine = line;
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/services/ChatterTagParser.js
/**
* Turns an event page's comment tags into a chatter profile.
*
* A page is full of other plugins' comments, and most pages carry no chatter tags at all, so a
* comment this does not recognise is skipped rather than reported. There is no such thing as a
* malformed chatter tag reaching here: a tag that does not match its pattern was never a chatter
* tag, and one that does match cannot be out of shape.
*
* The three layers of a profile are assembled here because this is the only place that sees all of
* them at once - the defaults in {@link ChatterProfile}, the project's `chatter` section of
* `data/config.message.json`, and finally the page.
*/
var ChatterTagParser = class ChatterTagParser {
	/**
	* The section of J-Message's external config that chatter's project defaults live in.
	* @type {string}
	*/
	static ConfigSection = "chatter";
	/**
	* Builds the fully-resolved profile an event page is asking for.
	* @param {string[]} comments The text of every parsable comment on the page.
	* @returns {ChatterProfile}
	*/
	static parseComments(comments) {
		const configured = ChatterTagParser.configuredProfile();
		const values = ChatterTagParser.readValues(comments);
		return ChatterProfile.overriddenBy(configured, values);
	}
	/**
	* The profile this project considers ordinary, before any page has had its say.
	* @returns {ChatterProfile}
	*/
	static configuredProfile() {
		const section = MessageConfig.section(ChatterTagParser.ConfigSection);
		return ChatterProfile.fromValues(section);
	}
	/**
	* Reads every chatter tag out of a page's comments.
	*
	* Lines accumulate and everything else is a single answer, so a page repeating `<chatterRadius:>`
	* is settled by whichever one was written last. That is a authoring mistake rather than a feature,
	* and taking the last one is the same thing the editor's own fields do.
	* @param {string[]} comments The text of every parsable comment on the page.
	* @returns {object} Whatever the page authored, with anything it did not mention absent.
	*/
	static readValues(comments) {
		const values = { lines: [] };
		comments.forEach((comment) => {
			ChatterTagParser.readLine(comment, values);
			ChatterTagParser.readNumbers(comment, values);
			ChatterTagParser.readPosition(comment, values);
		}, this);
		return values;
	}
	/**
	* Adds a comment's line to the pool, if it carries one.
	* @param {string} comment The comment text to read.
	* @param {object} values The values being assembled.
	*/
	static readLine(comment, values) {
		const match = J.MESSAGE.EXT.CHATTER.RegExp.Chatter.exec(comment);
		if (match === null) return;
		const [, line] = match;
		values.lines.push(line);
	}
	/**
	* Reads whichever of the numeric knobs a comment carries.
	* @param {string} comment The comment text to read.
	* @param {object} values The values being assembled.
	*/
	static readNumbers(comment, values) {
		const patterns = J.MESSAGE.EXT.CHATTER.RegExp;
		const numericTags = [
			[patterns.ChatterRadius, "radius"],
			[patterns.ChatterCooldown, "cooldown"],
			[patterns.ChatterDelay, "delay"],
			[patterns.ChatterDuration, "duration"],
			[patterns.ChatterSpeed, "speed"]
		];
		numericTags.forEach(([pattern, field]) => {
			const match = pattern.exec(comment);
			if (match === null) return;
			const [, amount] = match;
			values[field] = Number(amount);
		});
	}
	/**
	* Reads which side of the character their chatter sits on, if a comment says.
	* @param {string} comment The comment text to read.
	* @param {object} values The values being assembled.
	*/
	static readPosition(comment, values) {
		const match = J.MESSAGE.EXT.CHATTER.RegExp.ChatterPosition.exec(comment);
		if (match === null) return;
		const [, position] = match;
		values.position = position.toLowerCase();
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/services/ChatterScheduler.js
/**
* Decides whether a character speaks, and how fast the words arrive when they do.
*
* Every answer here is a function of its arguments and nothing else, which is the point: the rules
* about earshot and waiting are the part of chatter most likely to be argued with later, and keeping
* them out of the manager means they can be argued with in a test rather than in a playtest.
*
* The random source is injected for the same reason. `Math.random` is the real one, and a fixed
* source is what lets "the wait lands somewhere inside the range" be an assertion instead of a hope.
*/
var ChatterScheduler = class ChatterScheduler {
	/**
	* Whether the player is close enough to hear this character.
	*
	* Walls do not enter into it. Nothing in this project treats a radius as anything other than the
	* distance between two points, and chatter is not going to be the one system that does.
	* @param {number} distance How many tiles apart the player and the character are.
	* @param {ChatterProfile} profile The character's settled chatter profile.
	* @returns {boolean}
	*/
	static isWithinEarshot(distance, profile) {
		return distance <= profile.radius();
	}
	/**
	* Rolls how long this character waits before starting their next line.
	*
	* Somewhere between saying it immediately and waiting the whole configured delay. A fixed wait
	* would have every shopkeeper on a street speak in lockstep forever, which reads as a mechanism
	* rather than as a town - and the whole effect depends on the player not noticing the mechanism.
	* @param {ChatterProfile} profile The character's settled chatter profile.
	* @param {function(): number} random A source of numbers from zero up to but excluding one.
	* @returns {number} The wait, in frames.
	*/
	static rollDelay(profile, random) {
		const longest = profile.delay();
		return Math.floor(random() * (longest + 1));
	}
	/**
	* Whether the moment has come for this character to speak.
	*
	* Deliberately says nothing about whether they have anything *to* say. That is the caller's
	* question, because the caller is the one holding the pool and about to pick from it - and asking
	* it in both places would leave whichever copy ran second unable to change any outcome.
	* @param {number} distance How many tiles apart the player and the character are.
	* @param {ChatterProfile} profile The character's settled chatter profile.
	* @param {number} delayRemaining How many frames of their rolled wait are left.
	* @returns {boolean}
	*/
	static shouldSpeak(distance, profile, delayRemaining) {
		if (ChatterScheduler.isWithinEarshot(distance, profile) === false) return false;
		return delayRemaining <= 0;
	}
	/**
	* How many characters of a line are visible after a given number of frames.
	*
	* Counted from the frames a bubble has been open rather than accumulated per character, so a
	* dropped frame costs the reveal nothing and two bubbles opened together stay in step.
	* @param {number} frames How many frames the line has been revealing for.
	* @param {number} speed How many frames each character takes to appear.
	* @param {number} total How many characters the line has in total.
	* @returns {number}
	*/
	static revealedCount(frames, speed, total) {
		if (speed <= 0) return total;
		const revealed = Math.floor(frames / speed);
		return Math.min(revealed, total);
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/services/ChatterLinePicker.js
/**
* Chooses which of a character's lines they say next.
*
* Random, but never the same line twice in a row. Pure chance over a pool of three will say the same
* thing twice often enough that a player standing still hears it within a minute, and a repeat is
* the single loudest way an ambient system announces that it is a system.
*
* The random source is injected so the choice can be pinned in a test. `Math.random` is the one the
* game passes.
*/
var ChatterLinePicker = class {
	/**
	* Picks the next line from a character's pool.
	* @param {string[]} lines The character's pool, which the caller has already confirmed is not empty.
	* @param {string} previous The line this character said last, or empty if they have not spoken.
	* @param {function(): number} random A source of numbers from zero up to but excluding one.
	* @returns {string}
	*/
	static pick(lines, previous, random) {
		const candidates = lines.filter((line) => line !== previous);
		if (candidates.length === 0) {
			const [only] = lines;
			return only;
		}
		const index = Math.floor(random() * candidates.length);
		return candidates[index];
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/managers/ChatterManager.js
/**
* Who is muttering, who is resting, and who is waiting for their moment.
*
* Holds data and never sprites, exactly as the spent-bubble manager does. A scene can be torn down
* and rebuilt - which happens on every menu, every battle, every map transfer - and a line already
* in progress comes back looking the same, because nothing that was on screen was ever the record of
* it.
*
* **Keyed on a target token rather than an event id.** Chatter declared by a page is `e<id>`, which
* is the same grammar `\pop` speaks, and it has to be: a forced line can name `player` or `a1`, and
* neither of those is an event. One key space means one resolver, and the resolver already knows how
* to turn any of those into something with a position on screen.
*/
var ChatterManager = class ChatterManager {
	/**
	* The target naming whichever event is running the command.
	* @type {string}
	*/
	static SelfToken = "self";
	/**
	* The letter introducing an event id in a target token.
	* @type {string}
	*/
	static EventPrefix = "e";
	/**
	* The answer when a token names nobody currently standing on this map.
	*
	* Negative because a real distance never is, so nothing downstream can mistake it for a character
	* standing very close.
	* @type {number}
	*/
	static NoDistance = -1;
	/**
	* Everything the system remembers, keyed by target token.
	* @type {Map<string, ChatterState>}
	*/
	static #states = new Map();
	/**
	* Rewrites a target token into the form this manager keys on.
	*
	* `self` is the one form whose meaning depends on where it was written, so it is resolved at the
	* edges rather than carried inward. Without that, a page declaring chatter under `e12` and a
	* message popping `\pop[self]` from inside event twelve would be two different characters as far
	* as this is concerned, and talking to somebody would not stop them muttering.
	* @param {string} token The target as it was authored.
	* @param {number} hostEventId The event whose page is running, for `self`.
	* @returns {string}
	*/
	static normalizeToken(token, hostEventId) {
		const normalized = token.trim().toLowerCase();
		if (normalized !== ChatterManager.SelfToken) return normalized;
		return `${ChatterManager.EventPrefix}${hostEventId}`;
	}
	/**
	* The token a given event declares its chatter under.
	* @param {number} eventId The id of the event on the current map.
	* @returns {string}
	*/
	static eventToken(eventId) {
		return `${ChatterManager.EventPrefix}${eventId}`;
	}
	/**
	* Records what a character's active page says about their chatter.
	*
	* Called far more often than a page actually changes - the engine re-runs page setup for every
	* event on the map whenever any self-switch flips - so this only ever replaces the profile. Timers
	* and anything being said right now are left exactly as they were, which is what keeps a self
	* switch somewhere across the map from resetting a line mid-sentence.
	* @param {string} token The target token this character chatters under.
	* @param {ChatterProfile} profile Their newly-settled profile.
	*/
	static declare(token, profile) {
		if (profile.hasLines() === false) {
			ChatterManager.#states.delete(token);
			return;
		}
		const existing = ChatterManager.#states.get(token);
		if (existing === undefined) {
			ChatterManager.#states.set(token, new ChatterState(profile));
			return;
		}
		existing.setProfile(profile);
	}
	/**
	* The state held for a token, creating one if this is the first anybody has heard of it.
	*
	* A forced line can name somebody no page ever declared - the player, an actor, a fixed point -
	* and they still need somewhere to keep the line while it is being said.
	* @param {string} token The target token.
	* @returns {ChatterState}
	*/
	static stateFor(token) {
		const existing = ChatterManager.#states.get(token);
		if (existing !== undefined) return existing;
		const state = new ChatterState(ChatterTagParser.configuredProfile());
		ChatterManager.#states.set(token, state);
		return state;
	}
	/**
	* Every line currently being said, with the token of whoever is saying it.
	*
	* This is what the layer on the map diffs its sprites against, so a bubble is built for a line
	* that has appeared and dropped for one that has ended, with nothing having to tell it either.
	* @returns {Array<[string, ChatterSession]>}
	*/
	static liveSessions() {
		const live = [];
		ChatterManager.#states.forEach((state, token) => {
			if (state.isSpeaking() === false) return;
			live.push([token, state.session()]);
		});
		return live;
	}
	/**
	* Whether anybody is saying anything at all right now.
	* @returns {boolean}
	*/
	static isQuiet() {
		return ChatterManager.liveSessions().length === 0;
	}
	/**
	* Forgets everything, including anything being said.
	*
	* Called when the map changes, because every token was naming something on the old one.
	*/
	static clear() {
		ChatterManager.#states = new Map();
	}
	/**
	* Makes a character say a specific line, regardless of what the ambient rules would have allowed.
	*
	* This is how a scene has somebody mutter in the background without blocking it - a real message
	* would stop the interpreter and take the player's input, which is the one thing chatter can never
	* do.
	* @param {string} token The target token of whoever should speak.
	* @param {string} line What they should say.
	* @param {object} values Whatever the command overrode, with anything it left blank absent.
	* @param {boolean} [persistent] Whether it survives a message opening above the same character.
	*/
	static force(token, line, values, persistent = false) {
		if (ChatterManager.hasTarget(token) === false) return;
		const state = ChatterManager.stateFor(token);
		const profile = ChatterProfile.overriddenBy(state.profile(), values);
		const session = new ChatterSession(line, profile, true, profile.duration(), persistent);
		state.setSession(session);
	}
	/**
	* Stops a character talking, whatever they were in the middle of.
	*
	* Used when a real message opens above them: somebody you have started a conversation with stops
	* muttering to themselves, while the shopkeeper two doors down carries on.
	*
	* A character cannot ordinarily be muttering to themselves and delivering dialogue at the same
	* time, because the two bubbles would land in the same place - so this cuts a forced line as
	* readily as an idle one. The exception is a line a scene explicitly asked to keep, where somebody
	* has already decided where each of the two goes.
	* @param {string} token The target token of whoever should stop.
	*/
	static silence(token) {
		const state = ChatterManager.#states.get(token);
		if (state === undefined) return;
		if (state.isSpeaking() === false) return;
		const session = state.session();
		if (session.isPersistent() === true) return;
		ChatterManager.endSession(state);
	}
	/**
	* Stops every line a character started on their own, leaving forced ones alone.
	*
	* A cutscene does not get heckled. This cuts rather than merely blocking new lines, because a
	* scene routinely transfers the player or walks them away, and a line left running would be cut a
	* moment later by the earshot rule anyway - at a worse moment, often through a screen fade.
	*/
	static silenceAutomatic() {
		ChatterManager.#states.forEach((state) => {
			if (state.isSpeaking() === false) return;
			const session = state.session();
			if (session.isForced() === true) return;
			ChatterManager.endSession(state);
		});
	}
	/**
	* Advances every character's clock by one frame.
	*/
	static update() {
		const isSceneRunning = $gameMap.isEventRunning();
		if (isSceneRunning === true) {
			ChatterManager.silenceAutomatic();
		}
		ChatterManager.#states.forEach((state, token) => {
			ChatterManager.updateState(token, state, isSceneRunning);
		});
	}
	/**
	* Advances one character's clock by one frame.
	* @param {string} token The target token of the character.
	* @param {ChatterState} state Everything remembered about them.
	* @param {boolean} isSceneRunning Whether an event currently has the floor.
	*/
	static updateState(token, state, isSceneRunning) {
		if (state.isSpeaking() === true) {
			ChatterManager.updateSession(token, state);
			return;
		}
		ChatterManager.updateSilence(token, state, isSceneRunning);
	}
	/**
	* Advances the line a character is currently saying.
	* @param {string} token The target token of the character.
	* @param {ChatterState} state Everything remembered about them.
	*/
	static updateSession(token, state) {
		const session = state.session();
		if (ChatterManager.hasWalkedOutOfEarshot(token, state, session) === true) {
			ChatterManager.endSession(state);
			return;
		}
		if (session.hasRevealed() === false) return;
		session.setDurationRemaining(session.durationRemaining() - 1);
		if (session.isFinished() === false) return;
		ChatterManager.endSession(state);
	}
	/**
	* Whether the player has wandered away from a line that is still being said.
	* @param {string} token The target token of the character.
	* @param {ChatterState} state Everything remembered about them.
	* @param {ChatterSession} session The line being said.
	* @returns {boolean}
	*/
	static hasWalkedOutOfEarshot(token, state, session) {
		if (session.isForced() === true) return false;
		const distance = ChatterManager.distanceTo(token);
		if (distance === ChatterManager.NoDistance) return true;
		return ChatterScheduler.isWithinEarshot(distance, state.profile()) === false;
	}
	/**
	* Advances a quiet character toward their next line.
	* @param {string} token The target token of the character.
	* @param {ChatterState} state Everything remembered about them.
	* @param {boolean} isSceneRunning Whether an event currently has the floor.
	*/
	static updateSilence(token, state, isSceneRunning) {
		if (state.cooldownRemaining() > 0) {
			state.setCooldownRemaining(state.cooldownRemaining() - 1);
			return;
		}
		if (isSceneRunning === true) return;
		const profile = state.profile();
		if (profile.hasLines() === false) return;
		const distance = ChatterManager.distanceTo(token);
		if (distance === ChatterManager.NoDistance) return;
		if (state.isAwaitingDelayRoll() === true) {
			state.setDelayRemaining(ChatterScheduler.rollDelay(profile, Math.random));
		}
		if (ChatterScheduler.isWithinEarshot(distance, profile) === false) return;
		state.setDelayRemaining(state.delayRemaining() - 1);
		if (ChatterScheduler.shouldSpeak(distance, profile, state.delayRemaining()) === false) return;
		ChatterManager.speak(state);
	}
	/**
	* Starts a character on a line of their own choosing.
	* @param {ChatterState} state Everything remembered about them.
	*/
	static speak(state) {
		const profile = state.profile();
		const line = ChatterLinePicker.pick(profile.lines(), state.lastLine(), Math.random);
		const session = new ChatterSession(line, profile, false, profile.duration(), false);
		state.setLastLine(line);
		state.setSession(session);
	}
	/**
	* Takes a character's line down and starts them resting.
	* @param {ChatterState} state Everything remembered about them.
	*/
	static endSession(state) {
		state.setSession(null);
		const cooldown = state.profile().cooldown();
		state.setCooldownRemaining(cooldown);
		state.setDelayRemaining(ChatterState.NoDelay);
	}
	/**
	* Whether a token names anybody currently standing on this map.
	* @param {string} token The target token.
	* @returns {boolean}
	*/
	static hasTarget(token) {
		const target = BubbleTargetResolver.resolve(token, 0);
		return target !== null;
	}
	/**
	* Turns a plugin command's blank-able fields into the overrides a profile merges.
	*
	* A field left blank in the editor arrives as an empty string and means "whatever this character
	* already does", so it is left out of the overrides entirely rather than passed along as a zero -
	* which is a real setting meaning something quite different.
	* @param {string} duration How long the line stays up, in frames, or empty.
	* @param {string} position Which side of the character it sits on, or empty.
	* @param {string} background What the line is drawn on, or empty.
	* @returns {object}
	*/
	static overridesFrom(duration, position, background) {
		const overrides = {};
		if (duration !== String.empty) {
			overrides.duration = Number(duration);
		}
		if (position !== String.empty) {
			overrides.position = position;
		}
		if (background !== String.empty) {
			overrides.background = background;
		}
		return overrides;
	}
	/**
	* How many tiles lie between the player and whoever a token names.
	* @param {string} token The target token.
	* @returns {number} The distance in tiles, or {@link ChatterManager.NoDistance} when the token
	* names nobody standing on this map.
	*/
	static distanceTo(token) {
		const target = BubbleTargetResolver.resolve(token, 0);
		if (target === null) return ChatterManager.NoDistance;
		return $gameMap.distance($gamePlayer.x, $gamePlayer.y, target.x, target.y);
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/objects/Game_Event.js
/**
* Extends {@link #setupPage}.<br/>
* Reads whatever chatter the newly-active page declares and hands it to the manager.
*/
J.MESSAGE.EXT.CHATTER.Aliased.Game_Event.set("setupPage", Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function() {
	J.MESSAGE.EXT.CHATTER.Aliased.Game_Event.get("setupPage").call(this);
	this.refreshDeclaredChatter();
};
/**
* Declares whatever this event's active page has to say for itself.
*
* A page is the right home for chatter for the same reason it is the right home for a light: chatter
* is a thing that can stop. A merchant who has closed up for the night is page two with no tags, and
* the muttering ends with the page that described somebody willing to mutter. Nothing has to register
* the event as chatty, and nothing has to remember to shut it up.
*/
Game_Event.prototype.refreshDeclaredChatter = function() {
	const comments = this.chatterCommentTexts();
	const profile = ChatterTagParser.parseComments(comments);
	const token = ChatterManager.eventToken(this.eventId());
	ChatterManager.declare(token, profile);
};
/**
* The text of every parsable comment on this event's active page.
*
* Comment blocks in the editor are stored as one command for the first line and another for each
* line after it, and J-Base's comment reader honours both - so a chatter line written as the third
* line of a block is found exactly like one written on its own.
* @returns {string[]}
*/
Game_Event.prototype.chatterCommentTexts = function() {
	const commands = this.getValidCommentCommands();
	return commands.map((command) => {
		const [comment] = command.parameters;
		return comment;
	});
};

//#endregion
//#region src/plugins/message/ext/chatter/objects/Game_Map.js
/**
* Extends {@link #setup}.<br/>
* Also forgets everything the map being left had to say.
*
* Emptied here rather than when the scene builds its sprites, and the ordering is the whole reason.
* A transfer runs `$gamePlayer.performTransfer` - which is this - and only afterwards builds the
* scene's display objects, so a wipe at scene-creation time would land *after* every event on the
* new map had already declared itself and would take all of it with it. Worse, returning from a menu
* or a battle rebuilds the scene without setting the map up again, so nothing would ever declare a
* second time and the town would stay silent for good.
*
* Cleared before the original, because the original is what sets the events up and therefore what
* makes the new map's declarations.
*/
J.MESSAGE.EXT.CHATTER.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	ChatterManager.clear();
	J.MESSAGE.EXT.CHATTER.Aliased.Game_Map.get("setup").call(this, mapId);
};

//#endregion
//#region src/plugins/message/ext/chatter/windows/Window_ChatterLayout.js
/**
* A message window that exists only to measure, and is never put on screen.
*
* Laying out a line into glyphs is something only a `Window_Message` knows how to do - the emission
* lives in that prototype's own overrides, and the pass needs `contents` to measure against, a font
* to measure in, and a line height to place baselines on. Chatter has none of that and must not
* borrow the real one: going through `$gameMessage` would stop the interpreter and take the player's
* input, which is the one thing chatter can never do.
*
* So it gets a window of its own, added to nothing, asked for `layoutMessageGlyphs` and nothing
* else. The pass already saves and restores the two pieces of window state it disturbs, so the
* instance is inert between calls.
*
* **It must be built lazily, on the map.** `Window_Base.initialize` reaches `updatePadding`, which
* reads `$gameSystem.windowPadding()` - and `$gameSystem` does not exist until a game has started,
* so one of these constructed at plugin load would boot to a stack trace.
*/
var Window_ChatterLayout = class extends Window_Message {
	/**
	* How many lines tall the measuring window is.
	*
	* It is never seen, so this is only about the size of the bitmap the measuring happens against.
	* Four is what the editor allows a single Show Text command, which makes it the most any authored
	* line can need.
	* @type {number}
	*/
	static LineCapacity = 4;
	/**
	* Where a line starts, horizontally.
	*
	* Vanilla's answer reads `$gameMessage.faceName()` and indents by the width of a face portrait
	* when there is one. A chatter line has no face, and it is being laid out while some completely
	* unrelated message may well be open - so inheriting that answer would indent every chatter line
	* in the game by the width of somebody else's portrait, and the four pixels it returns otherwise
	* are dead margin inside a bubble sized to its own text.
	* @param {RPG_TextState} _textState The text state being laid out.
	* @returns {number}
	*/
	newLineX(_textState) {
		return 0;
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/windows/Window_Message.js
/**
* Extends {@link #startMessage}.<br/>
* Also stops the character this message is being spoken by muttering to themselves.
*
* Only that character. Somebody the player has walked up to and started a conversation with should
* not be talking over their own dialogue - but the shopkeeper two doors down has nothing to do with
* it and carries on. A blanket hush on any message would empty a whole market square every time
* anybody read a signpost.
*
* Before the original, because the original is what starts revealing the message; a bubble that
* appeared and was cut on the same frame would flicker.
*/
J.MESSAGE.EXT.CHATTER.Aliased.Window_Message.set("startMessage", Window_Message.prototype.startMessage);
Window_Message.prototype.startMessage = function() {
	this.silenceChatterTarget();
	J.MESSAGE.EXT.CHATTER.Aliased.Window_Message.get("startMessage").call(this);
};
/**
* Hushes whoever this message is floating above, if it is floating above anybody.
*/
Window_Message.prototype.silenceChatterTarget = function() {
	const requested = $gameMessage.bubbleTarget();
	if (requested === String.empty) return;
	const hostEventId = $gameMessage.bubbleHostEventId();
	const token = ChatterManager.normalizeToken(requested, hostEventId);
	ChatterManager.silence(token);
};

//#endregion
//#region src/plugins/message/ext/chatter/sprites/Sprite_ChatterBubble.js
/**
* One line a character is muttering to themselves, floating above them.
*
* It is the same bubble a message draws, with two deliberate differences. It carries **no legend**,
* because idle chatter is not a conversation and nobody needs telling who is muttering - the tail is
* already pointing at them. And it is **alive**: its glyph plane updates, so `\~` waves and `\%`
* jitters here exactly as they do in a real message. A spent bubble is the opposite of this on
* purpose, frozen at the frame its speaker stopped.
*
* The line types itself out rather than appearing whole. Every glyph is built the moment the bubble
* is, so that is a matter of showing progressively more of them rather than of running a reveal
* pipeline - which is also what makes the bubble the right size from its very first frame.
*/
var Sprite_ChatterBubble = class extends Sprite {
	/**
	* Extend initialization to build one line of chatter.
	* @param {string} token The target token of whoever is saying it.
	* @param {ChatterSession} session The line being said.
	* @param {MessageGlyph[]} glyphs The line, laid out.
	* @param {number} padding How far the text sits inside the bubble.
	*/
	initialize(token, session, glyphs, padding) {
		super.initialize();
		this.initMembers();
		this.setToken(token);
		this.setSession(session);
		this.setPadding(padding);
		this.setContent(BubbleGeometry.contentBounds(glyphs));
		this.createBubble();
		this.createGlyphs(glyphs);
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
		* The target token of whoever is saying this line.
		* @type {string}
		*/
		this._j._token = String.empty;
		/**
		* The line being said.
		* @type {ChatterSession}
		*/
		this._j._session = null;
		/**
		* How far the text sits inside the bubble.
		* @type {number}
		*/
		this._j._padding = 0;
		/**
		* How much room this line's text needs.
		* @type {BubbleBounds}
		*/
		this._j._content = null;
		/**
		* The backdrop this line is drawn on.
		* @type {Sprite_MessageBubble}
		*/
		this._j._bubble = null;
		/**
		* The plane holding this line's letters.
		* @type {Sprite_MessageGlyphLayer}
		*/
		this._j._glyphLayer = null;
		/**
		* How many of this line's letters have appeared so far.
		* @type {number}
		*/
		this._j._revealed = 0;
	}
	/**
	* The target token of whoever is saying this line.
	* @returns {string}
	*/
	token() {
		return this._j._token;
	}
	/**
	* Sets the target token of whoever is saying this line.
	* @param {string} token The target token.
	*/
	setToken(token) {
		this._j._token = token;
	}
	/**
	* The line being said.
	* @returns {ChatterSession}
	*/
	session() {
		return this._j._session;
	}
	/**
	* Sets the line being said.
	* @param {ChatterSession} session The line.
	*/
	setSession(session) {
		this._j._session = session;
	}
	/**
	* How far the text sits inside the bubble.
	* @returns {number}
	*/
	padding() {
		return this._j._padding;
	}
	/**
	* Sets how far the text sits inside the bubble.
	* @param {number} padding The padding.
	*/
	setPadding(padding) {
		this._j._padding = padding;
	}
	/**
	* How much room this line's text needs.
	* @returns {BubbleBounds}
	*/
	content() {
		return this._j._content;
	}
	/**
	* Sets how much room this line's text needs.
	* @param {BubbleBounds} content The measured text.
	*/
	setContent(content) {
		this._j._content = content;
	}
	/**
	* The backdrop this line is drawn on.
	* @returns {Sprite_MessageBubble}
	*/
	bubble() {
		return this._j._bubble;
	}
	/**
	* Sets the backdrop this line is drawn on.
	* @param {Sprite_MessageBubble} bubble The backdrop.
	*/
	setBubble(bubble) {
		this._j._bubble = bubble;
	}
	/**
	* The plane holding this line's letters.
	* @returns {Sprite_MessageGlyphLayer}
	*/
	glyphLayer() {
		return this._j._glyphLayer;
	}
	/**
	* Sets the plane holding this line's letters.
	* @param {Sprite_MessageGlyphLayer} layer The glyph plane.
	*/
	setGlyphLayer(layer) {
		this._j._glyphLayer = layer;
	}
	/**
	* How many of this line's letters have appeared so far.
	* @returns {number}
	*/
	revealed() {
		return this._j._revealed;
	}
	/**
	* Sets how many of this line's letters have appeared so far.
	* @param {number} revealed The count.
	*/
	setRevealed(revealed) {
		this._j._revealed = revealed;
	}
	/**
	* Builds the backdrop, with no name set into its border.
	*
	* The three backgrounds mean here what they mean to any other message: a window, a dimmed hush, or
	* no backdrop at all. Dim is the one that earns its keep - it is what a thought looks like, as
	* against something the character actually said out loud.
	*/
	createBubble() {
		const background = this.session().profile().backgroundType();
		const style = BubbleStyle.forBackground(background);
		const bubble = new Sprite_MessageBubble();
		bubble.setFillColor(style.fillColor);
		bubble.setFillAlpha(style.fillAlpha);
		bubble.setBorderColor(style.borderColor);
		bubble.flagBordered(style.bordered);
		bubble.visible = style.drawn;
		bubble.setSpeakerName(String.empty);
		this.setBubble(bubble);
		this.addChild(bubble);
	}
	/**
	* Builds the line's letters, none of them showing yet.
	*
	* The plane is offset by the padding because the glyphs were laid out from the inside of a message
	* window's contents, while the bubble around them is drawn from its outer edge.
	* @param {MessageGlyph[]} glyphs The line, laid out.
	*/
	createGlyphs(glyphs) {
		const layer = new Sprite_MessageGlyphLayer();
		layer.x = this.padding();
		layer.y = this.padding();
		glyphs.forEach((glyph) => layer.addGlyph(glyph));
		layer.glyphSprites().forEach((sprite) => {
			sprite.visible = false;
		});
		this.setGlyphLayer(layer);
		this.addChild(layer);
	}
	/**
	* Whoever this line belongs to, as they stand right now.
	* @returns {?(Game_Character|BubbleAnchor)}
	*/
	currentTarget() {
		return BubbleTargetResolver.resolve(this.token(), 0);
	}
	/**
	* Extends {@link Sprite.update}.<br/>
	* Also types the line out and keeps it over whoever is saying it.
	*/
	update() {
		super.update();
		this.updateReveal();
		this.updatePlacement();
	}
	/**
	* Brings out however much of the line should have arrived by now.
	*/
	updateReveal() {
		const session = this.session();
		const sprites = this.glyphLayer().glyphSprites();
		const frame = this.glyphLayer().frame();
		const speed = session.profile().speed();
		const revealed = ChatterScheduler.revealedCount(frame, speed, sprites.length);
		if (revealed === this.revealed()) return;
		sprites.slice(this.revealed(), revealed).forEach((sprite) => {
			sprite.visible = true;
		});
		this.setRevealed(revealed);
		if (revealed < sprites.length) return;
		session.flagRevealed();
	}
	/**
	* Keeps the bubble over whoever is saying it.
	*/
	updatePlacement() {
		const target = this.currentTarget();
		if (target === null) {
			this.visible = false;
			return;
		}
		this.visible = true;
		const preferBelow = this.session().profile().prefersBelow();
		const anchorX = target.screenX();
		const anchorY = target.bubbleAnchorY(preferBelow);
		const solved = BubbleLayout.solve(this.content(), this.padding(), anchorX, anchorY, Graphics.boxWidth, Graphics.boxHeight, preferBelow);
		this.x = solved.x;
		this.y = solved.y;
		this.bubble().refresh(solved.bounds, solved.tail);
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/sprites/Sprite_ChatterBubbleLayer.js
/**
* The plane everybody currently muttering to themselves is standing on.
*
* It owns no state of its own beyond the measuring window. Every frame it compares what it is
* showing against the lines the manager says are being said, and makes the two agree - somebody who
* has started speaking gets a bubble, somebody who has finished loses theirs. Cutting a line short
* is therefore something the manager does to a record, with nothing here needing to be told.
*
* It sits on the scene beside the spent-bubble plane rather than inside the spriteset, for the same
* reason that one does: `Spriteset_Base.updatePosition` applies the screen's shake and zoom to
* everything beneath it while `screenX` includes neither, so chatter in there would drift away from
* the character it belongs to the moment anything shook the screen.
*/
var Sprite_ChatterBubbleLayer = class extends Sprite {
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
		* The bubbles currently on this plane, by the token each one belongs to.
		* @type {Map<string, Sprite_ChatterBubble>}
		*/
		this._j._bubbles = new Map();
		/**
		* The window every chatter line is laid out against.
		*
		* Built on demand rather than here, because a project may well go a whole session without an
		* NPC saying anything, and building one costs a bitmap and a windowskin.
		* @type {?Window_ChatterLayout}
		*/
		this._j._layoutWindow = null;
	}
	/**
	* The bubbles currently on this plane.
	* @returns {Map<string, Sprite_ChatterBubble>}
	*/
	bubbles() {
		return this._j._bubbles;
	}
	/**
	* The window every chatter line is laid out against, building it if this is the first line.
	* @returns {Window_ChatterLayout}
	*/
	layoutWindow() {
		const existing = this._j._layoutWindow;
		if (existing !== null) return existing;
		const built = this.buildLayoutWindow();
		this.setLayoutWindow(built);
		return built;
	}
	/**
	* Sets the window every chatter line is laid out against.
	* @param {Window_ChatterLayout} window The measuring window.
	*/
	setLayoutWindow(window) {
		this._j._layoutWindow = window;
	}
	/**
	* Builds the window chatter lines are measured against.
	*
	* As wide as the screen because chatter is never wrapped - a line is as wide as its author wrote
	* it - so the width only has to be generous enough never to be the thing that decides a break.
	* @returns {Window_ChatterLayout}
	*/
	buildLayoutWindow() {
		const height = Window_Base.prototype.fittingHeight(Window_ChatterLayout.LineCapacity);
		const rect = new Rectangle(0, 0, Graphics.boxWidth, height);
		return new Window_ChatterLayout(rect);
	}
	/**
	* Extend the update to keep this plane agreeing with who is talking.
	*/
	update() {
		this.syncChatterBubbles();
		super.update();
	}
	/**
	* Adds and removes bubbles until this plane shows exactly who the manager says is talking.
	*/
	syncChatterBubbles() {
		const live = ChatterManager.liveSessions();
		this.removeFinishedBubbles(live);
		live.forEach(([token, session]) => this.addMissingBubble(token, session));
	}
	/**
	* Takes away the bubbles of anyone who has stopped talking.
	* @param {Array<[string, ChatterSession]>} live Every line currently being said.
	*/
	removeFinishedBubbles(live) {
		const stillTalking = live.map(([token]) => token);
		const drawn = [...this.bubbles().keys()];
		const finished = drawn.filter((token) => stillTalking.includes(token) === false);
		finished.forEach((token) => {
			const sprite = this.bubbles().get(token);
			this.removeChild(sprite);
			this.bubbles().delete(token);
		});
	}
	/**
	* Gives a talker a bubble if they do not already have one on this plane.
	* @param {string} token The target token of whoever is talking.
	* @param {ChatterSession} session The line they are saying.
	*/
	addMissingBubble(token, session) {
		const existing = this.bubbles().get(token);
		if (existing !== undefined) return;
		const sprite = this.buildBubble(token, session);
		this.bubbles().set(token, sprite);
		this.addChild(sprite);
	}
	/**
	* Lays a line out and builds the bubble that shows it.
	* @param {string} token The target token of whoever is talking.
	* @param {ChatterSession} session The line they are saying.
	* @returns {Sprite_ChatterBubble}
	*/
	buildBubble(token, session) {
		const window = this.layoutWindow();
		const glyphs = window.layoutMessageGlyphs(session.line());
		return new Sprite_ChatterBubble(token, session, glyphs, window.padding);
	}
};

//#endregion
//#region src/plugins/message/ext/chatter/scenes/Scene_Map.js
/**
* Extends {@link #createSpriteset}.<br/>
* Also raises the plane that idle chatter floats on.
*
* Added after the bubbles plugin's own plane and outside the spriteset, for the reasons that plugin
* documents: the window layer is built immediately after this, so chatter sits above the map and
* below any message being read, and staying outside the spriteset keeps it out of the screen shake
* and zoom that a floating message is also outside of.
*
* **Nothing is cleared here.** Every other plane in this family empties itself on a scene rebuild,
* and chatter must not: the events on the map declare themselves during `$gameMap.setup`, which has
* already happened by the time a scene builds anything, and returning from a menu or a battle
* rebuilds the scene without setting the map up at all. Emptying here would take every declaration
* with it and leave the town permanently silent. The forgetting lives on `Game_Map.setup` instead.
*/
J.MESSAGE.EXT.CHATTER.Aliased.Scene_Map.set("createSpriteset", Scene_Map.prototype.createSpriteset);
Scene_Map.prototype.createSpriteset = function() {
	J.MESSAGE.EXT.CHATTER.Aliased.Scene_Map.get("createSpriteset").call(this);
	this.createChatterBubbleLayer();
};
/**
* Creates the plane idle chatter floats on.
*/
Scene_Map.prototype.createChatterBubbleLayer = function() {
	this._j ||= {};
	this._j._chatter ||= {};
	const layer = new Sprite_ChatterBubbleLayer();
	this.setChatterBubbleLayer(layer);
	this.addChild(layer);
};
/**
* The plane idle chatter floats on.
* @returns {Sprite_ChatterBubbleLayer}
*/
Scene_Map.prototype.chatterBubbleLayer = function() {
	return this._j._chatter._layer;
};
/**
* Sets the plane idle chatter floats on.
* @param {Sprite_ChatterBubbleLayer} layer The plane.
*/
Scene_Map.prototype.setChatterBubbleLayer = function(layer) {
	this._j._chatter._layer = layer;
};
/**
* Extends {@link #update}.<br/>
* Also advances everybody's chatter by a frame.
*
* Ticked from the scene rather than from `Game_Map.update`, because chatter is a thing that happens
* on the map the player is looking at. The map object updates in places the player is not there for,
* and a character counting down a cooldown in a room nobody is standing in is bookkeeping for
* nothing.
*/
J.MESSAGE.EXT.CHATTER.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.MESSAGE.EXT.CHATTER.Aliased.Scene_Map.get("update").call(this);
	ChatterManager.update();
};

//#endregion
//#region src/plugins/message/ext/chatter/_metadata/pluginCommands.js
/**
* Makes a character say a specific line right now, regardless of the ambient rules.
*
* This is how a scene has somebody mutter in the background without stopping to do it. A real
* message would block the interpreter and take the player's input; a forced chatter line does
* neither, which is exactly what makes it usable while something else is going on.
*
* **Not an arrow function, deliberately.** `PluginManager.callCommand` invokes a handler as
* `func.bind(self)(args)` with the running interpreter as `self`, and `self.eventId()` is the only
* way a target of `self` can mean anything. An arrow discards that binding.
*/
PluginManager.registerCommand(J.MESSAGE.EXT.CHATTER.Metadata.name, "chatter-now", function(args) {
	const { target, text, duration, position, background, persist } = args;
	const hostEventId = this.eventId();
	const token = ChatterManager.normalizeToken(target, hostEventId);
	const overrides = ChatterManager.overridesFrom(duration, position, background);
	const persistent = persist === "true";
	ChatterManager.force(token, text, overrides, persistent);
});

//#endregion
//# sourceMappingURL=J-Message-Chatter.js.map