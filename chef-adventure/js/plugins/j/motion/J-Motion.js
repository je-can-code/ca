//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOTION] Ambient and reactive motion for character sprites.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * A character on the map is a static sprite that slides between tiles. This
 * plugin makes it move on its own: breathing, floating, swaying, spinning,
 * flickering, flashing, tinting, and travelling to a new size or angle and
 * staying there.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A motion is DECLARED on the thing that should have it, and runs for exactly
 * as long as that declaration exists. An event page declares motions with a
 * comment tag, and they stop when the page changes. Nothing expires on its own
 * and nothing fires once- if you want a motion to last three seconds, the
 * plugin command that applies it says so.
 *
 * Several motions compose on one character. A breathing, swaying, ghosting
 * enemy is three declarations, and each of them can be withdrawn without
 * disturbing the other two.
 *
 * Two characters declaring the same motion will not animate in lockstep; each
 * one starts somewhere random within its own cycle. A room of thirty breathing
 * enemies reads as alive rather than choreographed. Add the `sync` keyword to
 * a motion when you actually want them in formation.
 *
 * ============================================================================
 * DECLARING A MOTION:
 * Add a comment to an event page:
 *
 * TAG FORMAT:
 *  <motion:[TYPE]>
 *  <motion:[TYPE, PARAM, PARAM, ...]>
 *    Where TYPE is one of the motions listed below.
 *    Where PARAM are that motion's parameters, in order.
 *
 * Every motion works with no parameters at all. Parameters are positional and
 * optional, filling in from left to right, so you can specify only the first
 * one and leave the rest at their defaults.
 *
 * THE CYCLING MOTIONS:
 *  <motion:[breathe, AMOUNT, PERIOD]>
 *    Swells and narrows, the way a chest does.
 *  <motion:[stretch, AMOUNT, PERIOD]>
 *    Grows and shrinks in height only.
 *  <motion:[pulse, AMOUNT, PERIOD]>
 *    Grows and shrinks evenly, like a heartbeat.
 *  <motion:[float, DISTANCE, PERIOD]>
 *    Hovers above the ground and settles back to it.
 *  <motion:[sway, DISTANCE, PERIOD]>
 *    Drifts side to side.
 *  <motion:[swing, ANGLE, PERIOD]>
 *    Rocks back and forth about its feet, like a hanging sign.
 *  <motion:[spin, PERIOD, DIRECTION]>
 *    Turns in place. DIRECTION is `cw` or `ccw`.
 *  <motion:[ghost, MIN, MAX, PERIOD]>
 *    Fades in and out between two opacities.
 *  <motion:[flicker, MIN, MAX, INTERVAL]>
 *    Jumps between opacities, like a failing lamp.
 *  <motion:[shake, STRENGTH, AXIS, INTERVAL]>
 *    Vibrates. AXIS is `x`, `y`, or `both`.
 *  <motion:[hop, HEIGHT, DURATION, REST]>
 *    Leaps, lands, waits, and leaps again.
 *  <motion:[throb, RED, GREEN, BLUE, GRAY, PERIOD]>
 *    Pulses a colour tone in and out.
 *  <motion:[flash, COLOR, PERIOD]>
 *    Strobes a colour. COLOR is written as #rrggbb.
 *
 * THE TRAVELLING MOTIONS:
 * These ease to somewhere and stay there for as long as they are declared,
 * then ease back when they are removed.
 *
 *  <motion:[scale, PERCENT, DURATION]>
 *    Becomes larger or smaller. 150 is half again as big.
 *  <motion:[angle, DEGREES, DURATION]>
 *    Turns to face an angle and holds it.
 *  <motion:[fade, PERCENT, DURATION]>
 *    Becomes more or less transparent.
 *  <motion:[hue, DEGREES, DURATION]>
 *    Rotates the sprite's hue.
 *  <motion:[tint, COLOR, DURATION]>
 *    Tints the sprite toward a colour. COLOR is written as #rrggbb.
 *
 * ALL PERIODS AND DURATIONS ARE IN FRAMES.
 * The game runs at 60 frames per second, so a period of 150 is two and a half
 * seconds for one full cycle.
 *
 * TAG EXAMPLES:
 *  <motion:[breathe]>
 * This character breathes at the default depth and rate.
 *
 *  <motion:[swing, 15, 200]>
 * This character rocks 15 degrees to either side, over a 200 frame cycle.
 *
 *  <motion:[float]>
 *  <motion:[ghost]>
 * This character hovers AND fades. Motions compose; declare as many as you
 * like.
 *
 *  <motion:[breathe, 0.08, 90, sync]>
 * A deeper, quicker breath, deliberately in step with every other character
 * declaring the same thing.
 *
 * ============================================================================
 * A NOTE ON COLOUR:
 * The hue, tint, tone and flash motions are more expensive than the others.
 * Colouring a sprite gives it its own render pass for the rest of its life,
 * and the engine never takes that back. On a map holding a dozen coloured
 * characters this is nothing; on one holding a hundred it is worth knowing.
 *
 * The plain motions- anything moving, scaling or rotating- cost nothing at
 * all beyond the arithmetic.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command applyMotion
 * @text Apply Motion
 * @desc Applies a motion to a character, optionally for a limited time.
 *
 * @arg target
 * @type select
 * @option Player
 * @option Follower
 * @option Event
 * @option This Event
 * @default This Event
 * @text Target
 * @desc Which character the motion is applied to.
 *
 * @arg targetId
 * @type number
 * @min 1
 * @default 1
 * @text Target ID
 * @desc The follower's party slot or the event's id. Ignored for the player and this event.
 *
 * @arg motion
 * @type string
 * @default breathe
 * @text Motion
 * @desc The motion and its parameters, written as they would be inside a tag. Ex: breathe, 0.08, 90
 *
 * @arg sourceKey
 * @type string
 * @default command
 * @text Source
 * @desc Who owns this motion. Removing a source only removes what that source applied.
 *
 * @arg duration
 * @type number
 * @min 0
 * @default 0
 * @text Duration
 * @desc How many frames the motion lasts before it removes itself. 0 lasts until removed.
 *
 *
 * @command removeMotion
 * @text Remove Motion
 * @desc Withdraws whatever a source had applied to a character.
 *
 * @arg target
 * @type select
 * @option Player
 * @option Follower
 * @option Event
 * @option This Event
 * @default This Event
 * @text Target
 * @desc Which character to stop moving.
 *
 * @arg targetId
 * @type number
 * @min 1
 * @default 1
 * @text Target ID
 * @desc The follower's party slot or the event's id. Ignored for the player and this event.
 *
 * @arg sourceKey
 * @type string
 * @default command
 * @text Source
 * @desc Who is withdrawing. Only motions applied under this same source are removed.
 */
//endregion annotations

//#region src/plugins/motion/core/_metadata/_pluginMetadata.js
/**
* The metadata for J-Motion.
*
* Every motion type's default parameters live in an external config rather than in plugin
* parameters, because retuning how the whole game breathes is a data edit that should not require
* opening the plugin manager or rebuilding anything.
*/
var J_MOTION_PluginMetadata = class J_MOTION_PluginMetadata extends PluginMetadata {
	/**
	* The path where the config for motion defaults is located.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.motion.json";
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Loads the motion defaults from external configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMotionDefaults();
	}
	/**
	* Reads every motion type's default parameters out of the external config.
	*
	* The config is authoritative for defaults; the type registry only names which parameters a type
	* accepts and in what order. That split means a designer retuning the game never touches source.
	*/
	initializeMotionDefaults() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Motion").configName("motion configuration").build();
		const parsedConfiguration = ExternalJsonConfigLoader.load(J_MOTION_PluginMetadata.CONFIG_PATH, options);
		const defaultsByType = new Map();
		Object.keys(parsedConfiguration).forEach((motionType) => defaultsByType.set(motionType, parsedConfiguration[motionType]));
		/**
		* A motionType:defaults map of every configured motion type.
		* @type {Map<string, Object<string, any>>}
		*/
		this.motionDefaults = defaultsByType;
	}
	/**
	* Gets the configured default parameters for a motion type.
	*
	* An unconfigured type is not an error worth throwing over — the registry still knows the type's
	* parameter names, so the caller falls back to the registry's own baked defaults and the motion
	* still renders.
	* @param {string} motionType The name of the motion type, ex: `breathe`.
	* @returns {Object<string, any>} The configured defaults, or an empty object when unconfigured.
	*/
	defaultsForMotionType(motionType) {
		if (this.motionDefaults.has(motionType) === false) return {};
		return this.motionDefaults.get(motionType);
	}
};

//#endregion
//#region src/plugins/motion/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.5.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MOTION = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.MOTION.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.MOTION.Metadata = new J_MOTION_PluginMetadata("J-Motion", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MOTION.Aliased = {};
J.MOTION.Aliased.Game_Event = new Map();
J.MOTION.Aliased.Sprite_Character = new Map();
/**
* All regular expressions used by this plugin.
*/
J.MOTION.RegExp = {};
/**
* A sprite motion declared on the thing that should have it.
*
* The capture is the whole bracketed list; the first entry is the motion type and everything after
* it is that type's positional parameters. Arity cannot live in the pattern because each type
* takes a different number of them, so the parser validates the count once it knows the type.
*
* <pre>
* Structure:
*  <motion:[TYPE]>
*  <motion:[TYPE, PARAM, ...]>
*
* Example:
*  <motion:[breathe]>
*  <motion:[swing, 15, 200]>
*  <motion:[tint, #ffa0a0]>
*
* Translation:
*  This character breathes at the default depth and rate.
*  This character swings 15 degrees each way over a 200 frame cycle.
*  This character is tinted a pale red.
* </pre>
* @type {RegExp}
*/
J.MOTION.RegExp.Motion = /<motion:[ ]?(\[\w+(?:,[ ]?[#\w.-]+)*])>/i;

//#endregion
//#region src/plugins/motion/core/core/MotionChannels.js
/**
* The properties of a sprite that a motion effect is allowed to write, and the rules for combining
* several effects that all want to write the same one.
*
* A channel exists so that effects never touch a sprite directly. An effect states "I contribute
* +4 to offsetY this frame" and the composer decides what the sprite actually gets, which is the
* only reason an ambient breathe and a combat squish can coexist on one enemy without either
* knowing the other exists.
*
* The combine rule differs per channel because the arithmetic that is correct for a pixel offset
* is wrong for a scale. Two effects each nudging a sprite four pixels right should move it eight;
* two effects each scaling it by 1.5 should produce 2.25, not 3.
*/
var MotionChannels = class MotionChannels {
	/**
	* Horizontal pixel offset from wherever the engine placed the sprite.
	* @type {string}
	*/
	static OFFSET_X = "offsetX";
	/**
	* Vertical pixel offset from wherever the engine placed the sprite.
	* @type {string}
	*/
	static OFFSET_Y = "offsetY";
	/**
	* Sprite rotation, in radians.
	* @type {string}
	*/
	static ROTATION = "rotation";
	/**
	* Horizontal scale, as a multiplier where 1.0 is unchanged.
	* @type {string}
	*/
	static SCALE_X = "scaleX";
	/**
	* Vertical scale, as a multiplier where 1.0 is unchanged.
	* @type {string}
	*/
	static SCALE_Y = "scaleY";
	/**
	* Opacity, as a multiplier against whatever opacity the engine assigned.
	* @type {string}
	*/
	static OPACITY = "opacity";
	/**
	* Hue rotation, in degrees.
	* @type {string}
	*/
	static HUE = "hue";
	/**
	* Multiplicative colour tint as `[r, g, b]`, each 0-255.
	* @type {string}
	*/
	static TINT = "tint";
	/**
	* Additive colour tone as `[r, g, b, gray]`, each -255 to 255.
	* @type {string}
	*/
	static TONE = "tone";
	/**
	* Blend colour as `[r, g, b, a]`, each 0-255.
	* @type {string}
	*/
	static FLASH = "flash";
	/**
	* Every channel, in the order a composition reports them.
	* @type {string[]}
	*/
	static all() {
		return [
			MotionChannels.OFFSET_X,
			MotionChannels.OFFSET_Y,
			MotionChannels.ROTATION,
			MotionChannels.SCALE_X,
			MotionChannels.SCALE_Y,
			MotionChannels.OPACITY,
			MotionChannels.HUE,
			MotionChannels.TINT,
			MotionChannels.TONE,
			MotionChannels.FLASH
		];
	}
	/**
	* The value a channel holds when nothing is contributing to it.
	*
	* A fresh array is built on every call rather than handing back a shared constant, because the
	* composer accumulates into whatever this returns and a shared array would carry one character's
	* colour onto every other character on the map.
	* @param {string} channel The channel name.
	* @returns {number|number[]} The identity value for that channel.
	*/
	static identityFor(channel) {
		switch (channel) {
			case MotionChannels.SCALE_X:
			case MotionChannels.SCALE_Y:
			case MotionChannels.OPACITY: return 1;
			case MotionChannels.TINT: return [
				255,
				255,
				255
			];
			case MotionChannels.TONE: return [
				0,
				0,
				0,
				0
			];
			case MotionChannels.FLASH: return [
				0,
				0,
				0,
				0
			];
			default: return 0;
		}
	}
	/**
	* Folds one effect's contribution into whatever has accumulated for a channel so far.
	* @param {string} channel The channel being combined.
	* @param {number|number[]} accumulated The running value for this channel.
	* @param {number|number[]} contribution The value one effect wants to add to it.
	* @returns {number|number[]} The new running value.
	*/
	static combine(channel, accumulated, contribution) {
		switch (channel) {
			case MotionChannels.SCALE_X:
			case MotionChannels.SCALE_Y:
			case MotionChannels.OPACITY: return accumulated * contribution;
			case MotionChannels.HUE: return MotionChannels.#wrapDegrees(accumulated + contribution);
			case MotionChannels.TINT: return MotionChannels.#combineTint(accumulated, contribution);
			case MotionChannels.TONE: return MotionChannels.#combineTone(accumulated, contribution);
			case MotionChannels.FLASH: return MotionChannels.#combineFlash(accumulated, contribution);
			default: return accumulated + contribution;
		}
	}
	/**
	* Normalizes a hue into the 0-359 range so that repeated additions never run away.
	* @param {number} degrees The raw summed degrees.
	* @returns {number}
	*/
	static #wrapDegrees(degrees) {
		const remainder = degrees % 360;
		if (remainder < 0) return remainder + 360;
		return remainder;
	}
	/**
	* Multiplies two tints together in normalized space.
	*
	* Tints multiply rather than sum because a tint darkens toward a colour; two half-strength reds
	* should compound into a deeper red rather than saturating back to white.
	* @param {number[]} accumulated The running `[r, g, b]`.
	* @param {number[]} contribution The `[r, g, b]` being folded in.
	* @returns {number[]}
	*/
	static #combineTint(accumulated, contribution) {
		return accumulated.map((component, index) => component * contribution.at(index) / 255);
	}
	/**
	* Sums two tones component-wise, clamped to the range the engine's colour filter accepts.
	* @param {number[]} accumulated The running `[r, g, b, gray]`.
	* @param {number[]} contribution The `[r, g, b, gray]` being folded in.
	* @returns {number[]}
	*/
	static #combineTone(accumulated, contribution) {
		return accumulated.map((component, index) => {
			const summed = component + contribution.at(index);
			return summed.clamp(-255, 255);
		});
	}
	/**
	* Resolves two flashes by taking whichever is strongest.
	*
	* Flashes do not stack: two things flashing a character white at once should read as one white
	* flash, not as a blown-out double exposure. Alpha is the strength, so the higher alpha wins
	* outright and carries its own colour with it.
	* @param {number[]} accumulated The running `[r, g, b, a]`.
	* @param {number[]} contribution The `[r, g, b, a]` being folded in.
	* @returns {number[]}
	*/
	static #combineFlash(accumulated, contribution) {
		if (contribution.at(3) <= accumulated.at(3)) return accumulated;
		return contribution;
	}
};

//#endregion
//#region src/plugins/motion/core/core/MotionEasing.js
/**
* The easing curves used when a motion travels to a target rather than cycling around one.
*
* Every curve here takes a normalized progress from 0 to 1 and returns a normalized position from
* 0 to 1. Nothing in this class knows about frames, distances, or channels — that keeps the curves
* trivially testable and lets a caller reuse one for a scale, a rotation, or a colour without
* anything having to be adapted.
*/
var MotionEasing = class MotionEasing {
	/**
	* Decelerating ease: fast to start, settling gently into the target.
	*
	* This is the default for transitions because it reads as something arriving under its own
	* momentum. A linear travel reads as mechanical, which is right for a conveyor belt and wrong
	* for a creature swelling with rage.
	* @param {number} progress Normalized progress, 0 to 1.
	* @returns {number} Normalized position, 0 to 1.
	*/
	static easeOutQuad(progress) {
		const clamped = MotionEasing.normalize(progress);
		const remaining = 1 - clamped;
		return 1 - remaining * remaining;
	}
	/**
	* Accelerating ease: slow to start, arriving at speed.
	* @param {number} progress Normalized progress, 0 to 1.
	* @returns {number} Normalized position, 0 to 1.
	*/
	static easeInQuad(progress) {
		const clamped = MotionEasing.normalize(progress);
		return clamped * clamped;
	}
	/**
	* Constant-rate travel, for when a motion should read as machinery rather than as life.
	* @param {number} progress Normalized progress, 0 to 1.
	* @returns {number} Normalized position, 0 to 1.
	*/
	static linear(progress) {
		return MotionEasing.normalize(progress);
	}
	/**
	* Constrains a raw progress value into the 0-to-1 range the curves are defined over.
	*
	* Callers compute progress as elapsed over duration, which overshoots 1 on the frame after a
	* transition completes and would send a curve past its target if left alone.
	* @param {number} progress The raw progress value.
	* @returns {number} The same value, held within 0 and 1.
	*/
	static normalize(progress) {
		return progress.clamp(0, 1);
	}
};

//#endregion
//#region src/plugins/motion/core/core/MotionTargetResolver.js
/**
* Works out which character a plugin command is talking about.
*
* A command names its target in the vocabulary an event author thinks in — the player, a follower,
* an event, or the event currently running — and this turns that into the actual character. It is
* separate from everything else because party positioning has nothing to do with motion and no
* reason to be entangled with it.
*/
var MotionTargetResolver = class MotionTargetResolver {
	/**
	* The player and their followers, addressed as one ordered party.
	* @type {string}
	*/
	static PLAYER = "Player";
	/**
	* A specific follower behind the player.
	* @type {string}
	*/
	static FOLLOWER = "Follower";
	/**
	* A specific event on the current map.
	* @type {string}
	*/
	static EVENT = "Event";
	/**
	* The event whose page is running this command.
	* @type {string}
	*/
	static THIS_EVENT = "This Event";
	/**
	* Resolves a command's target into a character.
	* @param {string} target Which kind of thing is being addressed.
	* @param {number} targetId The follower slot or event id, where one applies.
	* @param {Game_Interpreter} interpreter The interpreter running the command.
	* @returns {Game_CharacterBase|null} The character, or null when the target does not exist.
	*/
	static resolve(target, targetId, interpreter) {
		switch (target) {
			case MotionTargetResolver.PLAYER: return $gamePlayer;
			case MotionTargetResolver.FOLLOWER: return MotionTargetResolver.characterForPartySlot(targetId);
			case MotionTargetResolver.EVENT: return $gameMap.event(targetId);
			case MotionTargetResolver.THIS_EVENT: return $gameMap.event(interpreter.eventId());
			default: return null;
		}
	}
	/**
	* Resolves a party slot into the character that occupies it.
	*
	* Slot 1 is the player and slot 2 onward are the followers walking behind them, which is the
	* numbering an author sees in the editor's own party ordering rather than the zero-based index
	* the follower collection uses.
	* @param {number} partySlot The 1-based party slot.
	* @returns {Game_CharacterBase} The character in that slot.
	*/
	static characterForPartySlot(partySlot) {
		if (partySlot <= 1) return $gamePlayer;
		const followerIndex = partySlot - 2;
		return $gamePlayer.followers().follower(followerIndex);
	}
};

//#endregion
//#region src/plugins/motion/core/models/MotionDeclaration.js
/**
* A statement that some character should be doing some motion, and who said so.
*
* A declaration carries no behavior and no animation state — it is the authored intent, nothing
* more. The composer turns it into a live effect, and throws that effect away when the declaration
* goes. That separation is what lets an event page, a state, and a combat hit all declare motions
* on one sprite while remaining completely ignorant of each other.
*/
var MotionDeclaration = class {
	/**
	* The name of the motion type, ex: `breathe`.
	* @type {string}
	*/
	#type = String.empty;
	/**
	* The positional parameters as authored, before defaults are applied.
	* @type {Array<string|number>}
	*/
	#parameters = [];
	/**
	* Who declared this motion, and therefore who can remove it.
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* Constructor.
	* @param {string} type The name of the motion type.
	* @param {Array<string|number>} parameters The positional parameters as authored.
	* @param {string} sourceKey Who declared this motion.
	*/
	constructor(type, parameters, sourceKey) {
		this.#type = type;
		this.#parameters = parameters;
		this.#sourceKey = sourceKey;
	}
	/**
	* Gets the motion type.
	* @returns {string} The type.
	*/
	type() {
		return this.#type;
	}
	/**
	* Gets the authored parameters.
	* @returns {Array<string|number>} The parameters.
	*/
	parameters() {
		return this.#parameters;
	}
	/**
	* Gets the source key.
	* @returns {string} The sourceKey.
	*/
	sourceKey() {
		return this.#sourceKey;
	}
	/**
	* Determines whether another declaration says exactly the same thing as this one.
	*
	* This is what lets a page be re-declared without disturbing anything. `Game_Map#refresh` fires
	* on any self-switch anywhere on the map and re-runs every event's page setup, so without a
	* value comparison every enemy in the scene would be handed fresh effects and snap to a new
	* random phase several times a minute.
	* @param {MotionDeclaration} other The declaration to compare against.
	* @returns {boolean}
	*/
	matches(other) {
		if (this.type() !== other.type()) return false;
		if (this.sourceKey() !== other.sourceKey()) return false;
		const otherParameters = other.parameters();
		if (this.#parameters.length !== otherParameters.length) return false;
		return this.#parameters.every((parameter, index) => parameter === otherParameters.at(index));
	}
};

//#endregion
//#region src/plugins/motion/core/models/MotionComposition.js
/**
* Every channel's final value for one character on one frame.
*
* The composer builds one of these per sprite per frame and the sprite applies it without knowing
* how many effects produced it or which of them won a contested channel. A composition is
* therefore the entire contract between the motion system and the view: widen this and the view
* learns something new, leave it alone and the view never changes again.
*
* Effects write into it directly rather than handing back a bag of values to be merged, because a
* map allocated per effect per frame is a lot of garbage on a map holding several hundred events.
*/
var MotionComposition = class {
	/**
	* The accumulated value of each channel, keyed by channel name.
	* @type {Map<string, number|number[]>}
	*/
	#values = new Map();
	/**
	* The effect that has exclusive ownership of a channel, keyed by channel name.
	* @type {Map<string, MotionEffect>}
	*/
	#claimants = new Map();
	/**
	* Whether any contributing effect needs the sprite rotated about its middle rather than its feet.
	* @type {boolean}
	*/
	#centerRotation = false;
	/**
	* Constructor. Seeds every channel to the value it holds when nothing is contributing.
	*/
	constructor() {
		MotionChannels.all().forEach((channel) => this.#values.set(channel, MotionChannels.identityFor(channel)), this);
	}
	/**
	* Gets the final value of a channel.
	* @param {string} channel The channel name.
	* @returns {number|number[]} The composed value.
	*/
	valueFor(channel) {
		return this.#values.get(channel);
	}
	/**
	* Records which effect has won exclusive ownership of a channel for this frame.
	*
	* Claims are resolved before any effect contributes, so that a losing contributor can be
	* discarded on arrival rather than being written and then overwritten.
	* @param {string} channel The channel being claimed.
	* @param {MotionEffect} claimant The effect that won the channel.
	*/
	awardClaim(channel, claimant) {
		this.#claimants.set(channel, claimant);
	}
	/**
	* Gets the effect that owns a channel this frame, if any.
	* @param {string} channel The channel name.
	* @returns {MotionEffect|null} The claimant, or null when the channel is uncontested.
	*/
	claimantFor(channel) {
		if (this.#claimants.has(channel) === false) return null;
		return this.#claimants.get(channel);
	}
	/**
	* Folds one effect's contribution into a channel, honouring any claim on it.
	*
	* A claimed channel accepts writes only from its claimant, and takes that write outright rather
	* than combining it — that is what "claim" means. Everyone else's contribution to that channel
	* is discarded silently, which is correct: a combat squish taking over the scale is supposed to
	* make the ambient breathe invisible for its duration, not fight it.
	* @param {MotionEffect} contributor The effect making the contribution.
	* @param {string} channel The channel being contributed to.
	* @param {number|number[]} contribution The value the effect wants to apply.
	*/
	contribute(contributor, channel, contribution) {
		const claimant = this.claimantFor(channel);
		if (claimant === null) {
			const accumulated = this.#values.get(channel);
			const combined = MotionChannels.combine(channel, accumulated, contribution);
			this.#values.set(channel, combined);
			return;
		}
		if (claimant !== contributor) return;
		this.#values.set(channel, contribution);
	}
	/**
	* Gets whether the sprite should rotate about its centre this frame.
	* @returns {boolean} The centerRotation.
	*/
	hasCenterRotation() {
		return this.#centerRotation;
	}
	/**
	* Requests that the sprite rotate about its centre rather than its feet.
	*
	* A character sprite is anchored at its feet so that it stands on a tile, which is correct for
	* walking and wrong for spinning — a spin about the feet reads as the character being swung
	* around on a rope. Only the view can compensate, because only the view knows the sprite's
	* height, so the composition carries the request rather than the correction.
	*/
	flagCenterRotation() {
		this.#centerRotation = true;
	}
};

//#endregion
//#region src/plugins/motion/core/models/MotionEffect.js
/**
* One live motion, animating for as long as the declaration that asked for it exists.
*
* An effect owns nothing but its own animation state — the frame it is on, the phase it started
* at, whether it has been asked to stop. It never touches a sprite, never reads another effect,
* and never removes its own declaration. All of that belongs to the composer, which is why an
* effect can be tested by handing it a composition and reading what it wrote.
*
* Subclasses implement {@link #applyTo}. Everything else has a working default.
*/
var MotionEffect = class {
	/**
	* The declaration that asked for this motion.
	* @type {MotionDeclaration}
	*/
	#declaration = null;
	/**
	* The resolved parameters, by name, after defaults were applied.
	* @type {Object<string, any>}
	*/
	#parameters = {};
	/**
	* How many frames this effect has been running.
	* @type {number}
	*/
	#elapsedFrames = 0;
	/**
	* Where in its cycle this effect started, so that identical motions do not animate in lockstep.
	* @type {number}
	*/
	#phaseOffset = 0;
	/**
	* Whether the declaration behind this effect has gone away.
	* @type {boolean}
	*/
	#removalRequested = false;
	/**
	* Constructor.
	* @param {MotionDeclaration} declaration The declaration that asked for this motion.
	* @param {Object<string, any>} parameters The resolved parameters, by name.
	* @param {number} phaseOffset Where in its cycle this effect starts.
	*/
	constructor(declaration, parameters, phaseOffset) {
		this.#declaration = declaration;
		this.#parameters = parameters;
		this.#phaseOffset = phaseOffset;
	}
	/**
	* Gets the declaration that asked for this motion.
	* @returns {MotionDeclaration} The declaration.
	*/
	declaration() {
		return this.#declaration;
	}
	/**
	* Gets the resolved parameters.
	* @returns {Object<string, any>} The parameters.
	*/
	parameters() {
		return this.#parameters;
	}
	/**
	* Gets how many frames this effect has been running.
	* @returns {number} The elapsedFrames.
	*/
	elapsedFrames() {
		return this.#elapsedFrames;
	}
	/**
	* Gets where in its cycle this effect started.
	* @returns {number} The phaseOffset.
	*/
	phaseOffset() {
		return this.#phaseOffset;
	}
	/**
	* Gets whether this effect's declaration has been removed.
	* @returns {boolean} The removalRequested.
	*/
	hasRemovalRequested() {
		return this.#removalRequested;
	}
	/**
	* Tells this effect that the declaration behind it is gone.
	*
	* Most effects stop immediately, but a transition holding a channel far from its identity needs
	* to travel back before it disappears, so the composer keeps ticking whatever is not yet
	* discardable rather than dropping effects the instant a declaration is removed.
	*/
	requestRemoval() {
		this.#removalRequested = true;
	}
	/**
	* Advances this effect by one frame.
	*/
	tick() {
		this.#elapsedFrames++;
	}
	/**
	* Determines whether the composer may forget about this effect.
	*
	* The default is "as soon as its declaration is gone", which is right for anything cycling
	* around the channel identity — the worst a cancelled breathe can do is drop a few percent of
	* scale, which nobody sees. Effects that park a channel somewhere visible override this.
	* @returns {boolean}
	*/
	isDiscardable() {
		return this.hasRemovalRequested();
	}
	/**
	* The channels this effect takes exclusive ownership of while it runs.
	*
	* Claiming is for effects that must be seen exactly as authored — a combat reaction that has to
	* read clearly regardless of what ambient motion the character happens to have. Ambient motions
	* claim nothing, which is why several of them compose.
	* @returns {string[]}
	*/
	claims() {
		return [];
	}
	/**
	* Writes this frame's contribution into the composition.
	* @param {MotionComposition} _composition The composition being built for this character.
	*/
	applyTo(_composition) {
		throw new Error("MotionEffect#applyTo must be implemented by a subclass.");
	}
};

//#endregion
//#region src/plugins/motion/core/models/OscillatorMotionEffect.js
/**
* Any motion that cycles smoothly around its rest state forever.
*
* Nine of the eighteen motion types are this one effect pointed at different channels, because
* breathing, floating, swaying, swinging, fading and throbbing are the same sine wave wearing
* different clothes. Keeping them together means the phase and period arithmetic — the part that
* is fiddly and the part that has to stay identical across types for the desync to work — exists
* exactly once.
*
* Two waveforms cover every type:
*
* - `wave` runs -1 to 1 and is centred on the rest state, for motions that overshoot in both
*   directions. A swaying reed leans equally left and right.
* - `rise` runs 0 to 1 and never goes negative, for motions where the rest state is a floor rather
*   than a midpoint. A floating thing hovers above the ground and comes back down to it; it does
*   not spend half of every cycle sunk into the floor.
*/
var OscillatorMotionEffect = class extends MotionEffect {
	/**
	* Writes this frame's oscillation into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const wave = this.wave();
		const rise = this.rise();
		const parameters = this.parameters();
		const motionType = this.declaration().type();
		switch (motionType) {
			case "breathe":
				composition.contribute(this, MotionChannels.SCALE_Y, 1 + parameters.amount * wave);
				composition.contribute(this, MotionChannels.SCALE_X, 1 - parameters.amount * wave);
				break;
			case "stretch":
				composition.contribute(this, MotionChannels.SCALE_Y, 1 + parameters.amount * wave);
				break;
			case "pulse":
				composition.contribute(this, MotionChannels.SCALE_X, 1 + parameters.amount * wave);
				composition.contribute(this, MotionChannels.SCALE_Y, 1 + parameters.amount * wave);
				break;
			case "float":
				composition.contribute(this, MotionChannels.OFFSET_Y, -(parameters.distance * rise));
				break;
			case "sway":
				composition.contribute(this, MotionChannels.OFFSET_X, parameters.distance * wave);
				break;
			case "swing":
				composition.contribute(this, MotionChannels.ROTATION, this.degreesToRadians(parameters.angle) * wave);
				break;
			case "ghost":
				composition.contribute(this, MotionChannels.OPACITY, this.ghostOpacity(wave));
				break;
			case "throb":
				composition.contribute(this, MotionChannels.TONE, this.throbTone(rise));
				break;
			case "flash":
				composition.contribute(this, MotionChannels.FLASH, this.flashColor(rise));
				break;
		}
	}
	/**
	* This frame's position in the cycle, from 0 to 1.
	*
	* The phase offset is added to the frame count rather than to the result, so that an effect
	* which starts mid-cycle stays mid-cycle forever instead of drifting back into step with its
	* neighbours.
	* @returns {number}
	*/
	progress() {
		const { period } = this.parameters();
		const advanced = this.elapsedFrames() + this.phaseOffset();
		return advanced % period / period;
	}
	/**
	* The centred waveform, running -1 to 1 across one cycle.
	* @returns {number}
	*/
	wave() {
		return Math.sin(2 * Math.PI * this.progress());
	}
	/**
	* The unipolar waveform, running 0 to 1 and back across one cycle without going negative.
	* @returns {number}
	*/
	rise() {
		return .5 - .5 * Math.cos(2 * Math.PI * this.progress());
	}
	/**
	* Converts an authored angle into the radians the rotation channel expects.
	* @param {number} degrees The angle in degrees.
	* @returns {number}
	*/
	degreesToRadians(degrees) {
		return degrees * Math.PI / 180;
	}
	/**
	* The opacity multiplier for a ghosting character.
	*
	* The wave is remapped from its natural -1..1 into 0..1 first so that the authored minimum and
	* maximum are hit exactly at the extremes of the cycle rather than approximately.
	* @param {number} wave The centred waveform value.
	* @returns {number}
	*/
	ghostOpacity(wave) {
		const { min, max } = this.parameters();
		const normalized = .5 + .5 * wave;
		return min + (max - min) * normalized;
	}
	/**
	* The colour tone for a throbbing character, scaled by how far into the pulse it is.
	* @param {number} rise The unipolar waveform value.
	* @returns {number[]} The `[r, g, b, gray]` tone.
	*/
	throbTone(rise) {
		const { red, green, blue, gray } = this.parameters();
		return [
			red * rise,
			green * rise,
			blue * rise,
			gray * rise
		];
	}
	/**
	* The blend colour for a flashing character, pulsing its alpha rather than its colour.
	* @param {number} rise The unipolar waveform value.
	* @returns {number[]} The `[r, g, b, a]` blend colour.
	*/
	flashColor(rise) {
		const { color } = this.parameters();
		const [red, green, blue] = color;
		return [
			red,
			green,
			blue,
			255 * rise
		];
	}
};

//#endregion
//#region src/plugins/motion/core/models/SpinMotionEffect.js
/**
* Continuous rotation, for coins, orbs, puzzle pieces and anything else that turns rather than
* rocks.
*
* This is its own effect rather than another oscillator binding because it accumulates instead of
* cycling — the angle grows without bound and is only meaningful modulo a full turn, where an
* oscillator's value always comes back to where it started.
*
* A spin also needs the sprite rotated about its middle. Character sprites are anchored at their
* feet so they stand on a tile, and rotating about that point swings the character around like a
* conker on a string rather than turning it in place.
*/
var SpinMotionEffect = class extends MotionEffect {
	/**
	* Writes this frame's rotation into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		composition.contribute(this, MotionChannels.ROTATION, this.currentRotation());
		composition.flagCenterRotation();
	}
	/**
	* The accumulated rotation in radians.
	*
	* The phase offset is included so that a row of identical spinning objects starts at different
	* angles; without it, a shelf of coins turns as one piece of scenery rather than as several
	* coins.
	* @returns {number}
	*/
	currentRotation() {
		const { period } = this.parameters();
		const advanced = this.elapsedFrames() + this.phaseOffset();
		const revolutions = advanced / period;
		return 2 * Math.PI * this.directionSign() * revolutions;
	}
	/**
	* Which way round the spin goes, as a multiplier on the angle.
	*
	* Anything that is not explicitly counter-clockwise turns clockwise, because an unrecognised
	* direction is an authoring typo and a spinning object is a better outcome than a stationary one
	* that gives no clue anything was wrong.
	* @returns {number} `1` for clockwise, `-1` for counter-clockwise.
	*/
	directionSign() {
		const { direction } = this.parameters();
		return direction === "ccw" ? -1 : 1;
	}
};

//#endregion
//#region src/plugins/motion/core/models/JitterMotionEffect.js
/**
* Discontinuous motion: hold a random value for a moment, then jump to another one.
*
* Shaking and flickering are the same effect on different channels. Both are defined by what
* separates them from their smooth cousins — a shake is not a sway and a flicker is not a ghost,
* because the value jumps rather than travels, and that jumping is the entire read.
*
* The `interval` is what turns one into the other in feel: re-rolling every frame buzzes like a
* held tool, while re-rolling every sixth frame reads as a stutter or a failing lamp.
*/
var JitterMotionEffect = class extends MotionEffect {
	/**
	* The value currently being held, per channel this effect writes.
	* @type {Map<string, number>}
	*/
	#heldValues = new Map();
	/**
	* How many frames the current values have been held for.
	* @type {number}
	*/
	#framesHeld = 0;
	/**
	* Whether any value has been rolled yet.
	*
	* A jitter has to produce something on its very first frame — waiting for the first interval to
	* elapse would leave the character conspicuously still for a moment after being hit.
	* @type {boolean}
	*/
	#hasRolled = false;
	/**
	* Extends {@link MotionEffect#tick}.<br/>
	* Counts down toward the next re-roll.
	*/
	tick() {
		super.tick();
		this.#framesHeld++;
	}
	/**
	* Writes the currently held jitter into the composition, rolling fresh values when due.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		if (this.isRollDue() === true) {
			this.roll();
		}
		this.#heldValues.forEach((value, channel) => composition.contribute(this, channel, value), this);
	}
	/**
	* Determines whether the held values have gone stale.
	* @returns {boolean}
	*/
	isRollDue() {
		if (this.#hasRolled === false) return true;
		const { interval } = this.parameters();
		return this.#framesHeld >= interval;
	}
	/**
	* Rolls a fresh set of values and starts holding them.
	*/
	roll() {
		const motionType = this.declaration().type();
		if (motionType === "shake") {
			this.rollShake();
		} else {
			this.rollFlicker();
		}
		this.#hasRolled = true;
		this.#framesHeld = 0;
	}
	/**
	* Rolls a positional jitter on whichever axes the author enabled.
	*/
	rollShake() {
		const { strength, axis } = this.parameters();
		this.#heldValues.clear();
		if (this.isAxisEnabled(axis, "x") === true) {
			this.#heldValues.set(MotionChannels.OFFSET_X, this.randomDeflection(strength));
		}
		if (this.isAxisEnabled(axis, "y") === true) {
			this.#heldValues.set(MotionChannels.OFFSET_Y, this.randomDeflection(strength));
		}
	}
	/**
	* Rolls an opacity somewhere between the authored bounds.
	*/
	rollFlicker() {
		const { min, max } = this.parameters();
		const span = max - min;
		this.#heldValues.set(MotionChannels.OPACITY, min + Math.random() * span);
	}
	/**
	* Determines whether a shake should move along a given axis.
	* @param {string} authored The axis the author asked for: `x`, `y`, or `both`.
	* @param {string} candidate The axis being tested.
	* @returns {boolean}
	*/
	isAxisEnabled(authored, candidate) {
		if (authored === "both") return true;
		return authored === candidate;
	}
	/**
	* A random deflection either side of centre.
	*
	* Deflection is symmetric so the character vibrates around where it stands rather than creeping
	* off in one direction over the life of the shake.
	* @param {number} strength The maximum deflection in pixels.
	* @returns {number}
	*/
	randomDeflection(strength) {
		return (Math.random() * 2 - 1) * strength;
	}
};

//#endregion
//#region src/plugins/motion/core/models/BounceMotionEffect.js
/**
* A repeating hop: an arc into the air, a pause on the ground, and away again.
*
* This is not an oscillator with a different waveform, because the pause is the point. A sine wave
* spends every frame somewhere, so a character animated by one is never quite still; a hopping
* creature is defined as much by the beat it sits out as by the arc it travels. Setting `rest` to
* zero collapses this back into a continuously bouncing ball, which is the less interesting of the
* two and is why it is not the default.
*/
var BounceMotionEffect = class extends MotionEffect {
	/**
	* Writes this frame's height into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		composition.contribute(this, MotionChannels.OFFSET_Y, this.currentHeight());
	}
	/**
	* How high off the ground the character is this frame, in screen pixels.
	*
	* Negative is upward, and the character is never below its own tile — a hop leaves the ground
	* and returns to it, and there is nothing to sink into.
	* @returns {number}
	*/
	currentHeight() {
		const { height, duration } = this.parameters();
		const positionInCycle = this.positionInCycle();
		if (positionInCycle >= duration) return 0;
		const progress = positionInCycle / duration;
		return -(height * Math.sin(Math.PI * progress));
	}
	/**
	* How far into the current arc-then-rest cycle this frame falls.
	*
	* The phase offset is folded in so that a clutch of identical creatures does not hop in
	* formation.
	* @returns {number}
	*/
	positionInCycle() {
		const { duration, rest } = this.parameters();
		const cycleLength = duration + rest;
		const advanced = this.elapsedFrames() + this.phaseOffset();
		return advanced % cycleLength;
	}
};

//#endregion
//#region src/plugins/motion/core/models/TransitionMotionEffect.js
/**
* A motion that travels somewhere and stays there.
*
* Five of the eighteen types are this: growing, turning, fading, hue-shifting and tinting all mean
* "put a channel somewhere other than its rest state and hold it". They differ only in which
* channel and what the target is, so they share one implementation.
*
* These are the shape that makes a state expressive. A state declaring `scale 150` swells the
* character as it lands, and because a removed transition travels back rather than vanishing, it
* settles again when the state drops — an author gets the animation in both directions without
* having written either.
*/
var TransitionMotionEffect = class extends MotionEffect {
	/**
	* How many frames this effect has been travelling back toward its rest state.
	* @type {number}
	*/
	#releaseFrames = 0;
	/**
	* The channel values held at the moment removal was requested.
	*
	* A transition can be cancelled before it ever arrived, so the journey home starts from wherever
	* it actually got to rather than from the target it was aiming at.
	* @type {Map<string, number|number[]>}
	*/
	#releaseValues = new Map();
	/**
	* Extends {@link MotionEffect#tick}.<br/>
	* Advances the journey home once one is underway.
	*/
	tick() {
		super.tick();
		if (this.hasRemovalRequested() === true) {
			this.#releaseFrames++;
		}
	}
	/**
	* Extends {@link MotionEffect#requestRemoval}.<br/>
	* Captures where the channels currently sit, so the ease-out starts from there.
	*/
	requestRemoval() {
		this.channels().forEach((channel) => this.#releaseValues.set(channel, this.arrivingValue(channel)), this);
		super.requestRemoval();
	}
	/**
	* Determines whether the composer may forget about this effect.
	*
	* Unlike the cycling motions, a transition parks a channel somewhere visible — an enemy at 150%
	* does not quietly return to normal if its effect is dropped, it snaps. So this one stays alive
	* after its declaration is gone, for exactly as long as it takes to get home.
	* @returns {boolean}
	*/
	isDiscardable() {
		if (this.hasRemovalRequested() === false) return false;
		const { duration } = this.parameters();
		return this.#releaseFrames >= duration;
	}
	/**
	* Writes this frame's position into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		this.channels().forEach((channel) => composition.contribute(this, channel, this.currentValue(channel)), this);
	}
	/**
	* The channels this transition drives.
	* @returns {string[]}
	*/
	channels() {
		const motionType = this.declaration().type();
		switch (motionType) {
			case "scale": return [MotionChannels.SCALE_X, MotionChannels.SCALE_Y];
			case "angle": return [MotionChannels.ROTATION];
			case "fade": return [MotionChannels.OPACITY];
			case "hue": return [MotionChannels.HUE];
			default: return [MotionChannels.TINT];
		}
	}
	/**
	* Where this transition's channels should sit once it has fully arrived.
	*
	* Scale and opacity are authored as percentages because that is how the engine's own zoom and
	* opacity controls read; angles are authored in degrees for the same reason. The conversion into
	* channel units happens here, once, rather than in every caller.
	*
	* A scale drives two channels and gives both the same target, which is why this is answered per
	* motion rather than per channel — nothing here needs to know which of the two it is answering
	* for.
	* @returns {number|number[]}
	*/
	targetValue() {
		const parameters = this.parameters();
		const motionType = this.declaration().type();
		switch (motionType) {
			case "scale": return parameters.percent / 100;
			case "angle": return parameters.degrees * Math.PI / 180;
			case "fade": return parameters.percent / 100;
			case "hue": return parameters.degrees;
			default: return parameters.color;
		}
	}
	/**
	* The value of a channel this frame, travelling out or travelling home.
	* @param {string} channel The channel being read.
	* @returns {number|number[]}
	*/
	currentValue(channel) {
		if (this.hasRemovalRequested() === true) return this.releasingValue(channel);
		return this.arrivingValue(channel);
	}
	/**
	* The value while travelling toward the target.
	* @param {string} channel The channel being read.
	* @returns {number|number[]}
	*/
	arrivingValue(channel) {
		const { duration } = this.parameters();
		const eased = MotionEasing.easeOutQuad(this.elapsedFrames() / duration);
		const identity = MotionChannels.identityFor(channel);
		const target = this.targetValue();
		return this.interpolate(channel, identity, target, eased);
	}
	/**
	* The value while travelling back toward the rest state.
	* @param {string} channel The channel being read.
	* @returns {number|number[]}
	*/
	releasingValue(channel) {
		const { duration } = this.parameters();
		const eased = MotionEasing.easeOutQuad(this.#releaseFrames / duration);
		const identity = MotionChannels.identityFor(channel);
		const start = this.#releaseValues.get(channel);
		return this.interpolate(channel, start, identity, eased);
	}
	/**
	* Blends between two channel values.
	*
	* Whether a value is a number or a set of colour components is decided by which channel it
	* belongs to, so this dispatches on the channel rather than inspecting the value. Asking a value
	* what it is would work equally well today and would stop working the moment a channel changed
	* shape, with nothing to say why.
	* @param {string} channel The channel being blended.
	* @param {number|number[]} from The value at the start of the journey.
	* @param {number|number[]} to The value at the end of it.
	* @param {number} progress How far along, 0 to 1.
	* @returns {number|number[]}
	*/
	interpolate(channel, from, to, progress) {
		if (channel === MotionChannels.TINT) {
			return to.map((component, index) => this.interpolateScalar(from.at(index), component, progress));
		}
		return this.interpolateScalar(from, to, progress);
	}
	/**
	* Blends between two numbers.
	* @param {number} from The value at the start of the journey.
	* @param {number} to The value at the end of it.
	* @param {number} progress How far along, 0 to 1.
	* @returns {number}
	*/
	interpolateScalar(from, to, progress) {
		return from + (to - from) * progress;
	}
};

//#endregion
//#region src/plugins/motion/core/core/MotionTypeRegistry.js
/**
* The roster of every motion an author can declare.
*
* The roster is data. A type is a name, the implementation that animates it, the parameters it
* accepts in the order they are written, and what each of those parameters is when the author
* leaves it out. Adding a tenth oscillator is a row in this table, not a new class, and that is
* deliberate — the interesting variety in this plugin is in the roster, not in the code.
*
* Extensions register their own types through {@link #register} without touching this table, which
* is how a combat extension adds a death collapse that core has no opinion about.
*/
var MotionTypeRegistry = class MotionTypeRegistry {
	/**
	* Every registered motion type, keyed by its authored name.
	* @type {Map<string, Object>}
	*/
	static #definitions = new Map();
	/**
	* Registers a motion type.
	* @param {string} motionType The name an author writes in a tag, ex: `breathe`.
	* @param {Object} definition The implementation, parameter names, defaults and phase span.
	*/
	static register(motionType, definition) {
		MotionTypeRegistry.#definitions.set(motionType, definition);
	}
	/**
	* Determines whether a name refers to a motion anybody knows how to animate.
	* @param {string} motionType The name from a tag.
	* @returns {boolean}
	*/
	static isRegistered(motionType) {
		return MotionTypeRegistry.#definitions.has(motionType);
	}
	/**
	* Gets the definition for a motion type.
	* @param {string} motionType The name from a tag.
	* @returns {Object} The definition.
	*/
	static definitionFor(motionType) {
		return MotionTypeRegistry.#definitions.get(motionType);
	}
	/**
	* Every registered motion type name.
	* @returns {string[]}
	*/
	static registeredTypes() {
		return Array.from(MotionTypeRegistry.#definitions.keys());
	}
	/**
	* How many parameters a motion type accepts, which is what a tag is validated against.
	* @param {string} motionType The name from a tag.
	* @returns {number}
	*/
	static parameterCountFor(motionType) {
		const definition = MotionTypeRegistry.definitionFor(motionType);
		return definition.parameterNames.length;
	}
	/**
	* Builds the live effect for a declaration.
	* @param {MotionDeclaration} declaration The declaration asking for the motion.
	* @param {Object<string, any>} configuredDefaults The defaults from external configuration.
	* @returns {MotionEffect}
	*/
	static buildEffect(declaration, configuredDefaults) {
		const motionType = declaration.type();
		const definition = MotionTypeRegistry.definitionFor(motionType);
		const authored = declaration.parameters();
		const wantsSync = MotionTypeRegistry.#wantsSync(authored);
		const positional = MotionTypeRegistry.#withoutSyncToken(authored);
		const resolved = MotionTypeRegistry.#resolveParameters(definition, positional, configuredDefaults);
		const phaseOffset = MotionTypeRegistry.#rollPhaseOffset(definition, resolved, wantsSync);
		return new definition.implementation(declaration, resolved, phaseOffset);
	}
	/**
	* Determines whether the author asked for this motion to run in step with its neighbours.
	* @param {Array<string|number>} authored The parameters as written.
	* @returns {boolean}
	*/
	static #wantsSync(authored) {
		return authored.includes("sync");
	}
	/**
	* The authored parameters with the `sync` token removed.
	*
	* `sync` is a trailing flag rather than a positional parameter, so it has to come out before the
	* remaining values are matched up against parameter names by position.
	* @param {Array<string|number>} authored The parameters as written.
	* @returns {Array<string|number>}
	*/
	static #withoutSyncToken(authored) {
		return authored.filter((parameter) => parameter !== "sync");
	}
	/**
	* Turns positional authored values into named parameters, filling the gaps.
	*
	* Precedence runs authored, then external config, then the registry's own defaults. That order
	* is what lets a designer retune the whole game in a config file while an individual event stays
	* exactly as it was authored.
	* @param {Object} definition The type definition.
	* @param {Array<string|number>} positional The authored values, sync token already removed.
	* @param {Object<string, any>} configuredDefaults The defaults from external configuration.
	* @returns {Object<string, any>}
	*/
	static #resolveParameters(definition, positional, configuredDefaults) {
		const resolved = {};
		definition.parameterNames.forEach((parameterName, index) => {
			const authoredValue = positional.at(index);
			const configuredValue = configuredDefaults[parameterName];
			const bakedValue = definition.defaults[parameterName];
			const chosen = MotionTypeRegistry.#firstDefined(authoredValue, configuredValue, bakedValue);
			resolved[parameterName] = MotionTypeRegistry.#coerceParameter(parameterName, chosen);
		}, this);
		return resolved;
	}
	/**
	* The first of three candidate values that was actually supplied.
	* @param {any} authoredValue What the author wrote, if anything.
	* @param {any} configuredValue What the config says, if anything.
	* @param {any} bakedValue What the registry falls back to.
	* @returns {any}
	*/
	static #firstDefined(authoredValue, configuredValue, bakedValue) {
		if (authoredValue !== undefined) return authoredValue;
		if (configuredValue !== undefined) return configuredValue;
		return bakedValue;
	}
	/**
	* Converts an authored parameter into the form its effect expects.
	*
	* Only colours need this: they are written as `#rrggbb` because that is how a human describes a
	* colour, and consumed as component triplets because that is how a sprite does.
	* @param {string} parameterName The name of the parameter.
	* @param {any} value The chosen value.
	* @returns {any}
	*/
	static #coerceParameter(parameterName, value) {
		if (parameterName !== "color") return value;
		return MotionTypeRegistry.parseColor(value);
	}
	/**
	* Turns a `#rrggbb` colour into its `[r, g, b]` components.
	* @param {string} hexColor The authored colour.
	* @returns {number[]}
	*/
	static parseColor(hexColor) {
		const digits = hexColor.replace("#", String.empty);
		const red = Number.parseInt(digits.substring(0, 2), 16);
		const green = Number.parseInt(digits.substring(2, 4), 16);
		const blue = Number.parseInt(digits.substring(4, 6), 16);
		return [
			red,
			green,
			blue
		];
	}
	/**
	* Picks where in its cycle a new effect starts.
	*
	* Two enemies with the same declaration must not animate in lockstep, so every cycling motion
	* begins somewhere random within its own period. Amplitude is deliberately not randomised: a
	* room where everything breathes by the same amount at different moments reads as alive, while a
	* room where each thing breathes by a different amount reads as a mistake.
	* @param {Object} definition The type definition.
	* @param {Object<string, any>} resolved The resolved parameters.
	* @param {boolean} wantsSync Whether the author asked for lockstep.
	* @returns {number}
	*/
	static #rollPhaseOffset(definition, resolved, wantsSync) {
		if (wantsSync === true) return 0;
		const span = definition.phaseSpan(resolved);
		if (span <= 0) return 0;
		return Math.randomInt(span);
	}
};
MotionTypeRegistry.register("breathe", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["amount", "period"],
	defaults: {
		amount: .05,
		period: 150
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("stretch", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["amount", "period"],
	defaults: {
		amount: .05,
		period: 150
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("pulse", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["amount", "period"],
	defaults: {
		amount: .05,
		period: 150
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("float", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["distance", "period"],
	defaults: {
		distance: 12,
		period: 180
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("sway", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["distance", "period"],
	defaults: {
		distance: 6,
		period: 200
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("swing", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["angle", "period"],
	defaults: {
		angle: 8,
		period: 170
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("ghost", {
	implementation: OscillatorMotionEffect,
	parameterNames: [
		"min",
		"max",
		"period"
	],
	defaults: {
		min: .25,
		max: 1,
		period: 240
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("throb", {
	implementation: OscillatorMotionEffect,
	parameterNames: [
		"red",
		"green",
		"blue",
		"gray",
		"period"
	],
	defaults: {
		red: 0,
		green: 0,
		blue: 80,
		gray: 0,
		period: 120
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("flash", {
	implementation: OscillatorMotionEffect,
	parameterNames: ["color", "period"],
	defaults: {
		color: "#ffffff",
		period: 40
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("spin", {
	implementation: SpinMotionEffect,
	parameterNames: ["period", "direction"],
	defaults: {
		period: 120,
		direction: "cw"
	},
	phaseSpan: (parameters) => parameters.period
});
MotionTypeRegistry.register("shake", {
	implementation: JitterMotionEffect,
	parameterNames: [
		"strength",
		"axis",
		"interval"
	],
	defaults: {
		strength: 4,
		axis: "x",
		interval: 1
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("flicker", {
	implementation: JitterMotionEffect,
	parameterNames: [
		"min",
		"max",
		"interval"
	],
	defaults: {
		min: .6,
		max: 1,
		interval: 6
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("hop", {
	implementation: BounceMotionEffect,
	parameterNames: [
		"height",
		"duration",
		"rest"
	],
	defaults: {
		height: 24,
		duration: 24,
		rest: 30
	},
	phaseSpan: (parameters) => parameters.duration + parameters.rest
});
MotionTypeRegistry.register("scale", {
	implementation: TransitionMotionEffect,
	parameterNames: ["percent", "duration"],
	defaults: {
		percent: 150,
		duration: 30
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("angle", {
	implementation: TransitionMotionEffect,
	parameterNames: ["degrees", "duration"],
	defaults: {
		degrees: 90,
		duration: 30
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("fade", {
	implementation: TransitionMotionEffect,
	parameterNames: ["percent", "duration"],
	defaults: {
		percent: 50,
		duration: 30
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("hue", {
	implementation: TransitionMotionEffect,
	parameterNames: ["degrees", "duration"],
	defaults: {
		degrees: 180,
		duration: 30
	},
	phaseSpan: () => 0
});
MotionTypeRegistry.register("tint", {
	implementation: TransitionMotionEffect,
	parameterNames: ["color", "duration"],
	defaults: {
		color: "#ffa0a0",
		duration: 30
	},
	phaseSpan: () => 0
});

//#endregion
//#region src/plugins/motion/core/core/MotionTagParser.js
/**
* Turns authored motion tags into declarations.
*
* One parser serves every source. An event page hands it comment text, a plugin command hands it
* the body of a tag, and an extension reading a state's notes will hand it the same, which is why
* `<motion:[breathe]>` means exactly one thing no matter where it is written.
*/
var MotionTagParser = class MotionTagParser {
	/**
	* Reads every motion tag out of a list of comment strings.
	* @param {string[]} comments The comment text to read.
	* @param {string} sourceKey Who is declaring these motions.
	* @returns {MotionDeclaration[]} Every valid declaration found, in the order written.
	*/
	static parseComments(comments, sourceKey) {
		const declarations = [];
		comments.forEach((comment) => {
			const match = J.MOTION.RegExp.Motion.exec(comment);
			if (match === null) return;
			const [, payload] = match;
			const declaration = MotionTagParser.parsePayload(payload, sourceKey);
			if (declaration === null) return;
			declarations.push(declaration);
		}, this);
		return declarations;
	}
	/**
	* Turns one tag's bracketed body into a declaration.
	*
	* Returns null when the tag cannot be honoured, which is the one place in this plugin where null
	* is a meaningful answer: the caller needs to distinguish "this comment was not for us" from
	* "this comment was for us and was wrong", and only the second is worth complaining about.
	* @param {string} payload The bracketed body, ex: `[breathe, 0.08]`.
	* @param {string} sourceKey Who is declaring this motion.
	* @returns {MotionDeclaration|null} The declaration, or null when the tag was invalid.
	*/
	static parsePayload(payload, sourceKey) {
		const parsed = JsonMapper.parseObject(payload);
		const [motionType, ...parameters] = parsed;
		if (MotionTypeRegistry.isRegistered(motionType) === false) {
			Diagnostics.warn("J-Motion", `unknown motion type: [ ${motionType} ]`, {
				payload,
				sourceKey
			});
			return null;
		}
		if (MotionTagParser.hasTooManyParameters(motionType, parameters) === true) {
			const allowed = MotionTypeRegistry.parameterCountFor(motionType);
			const message = `motion [ ${motionType} ] accepts up to ${allowed} parameters`;
			Diagnostics.warn("J-Motion", message, {
				payload,
				sourceKey
			});
			return null;
		}
		return new MotionDeclaration(motionType, parameters, sourceKey);
	}
	/**
	* Determines whether a tag supplied more parameters than its motion knows what to do with.
	*
	* Too many parameters is reported rather than trimmed, because it almost always means the author
	* has the order wrong or is remembering a different motion's signature — and silently animating
	* something subtly incorrect costs far more of their afternoon than a line in the console does.
	* @param {string} motionType The motion type from the tag.
	* @param {Array<string|number>} parameters Everything written after the type.
	* @returns {boolean}
	*/
	static hasTooManyParameters(motionType, parameters) {
		const allowed = MotionTypeRegistry.parameterCountFor(motionType);
		const positional = parameters.filter((parameter) => parameter !== "sync");
		return positional.length > allowed;
	}
};

//#endregion
//#region src/plugins/motion/core/managers/CharacterMotionComposer.js
/**
* Owns every character's motion: what has been declared, what is currently animating, and what the
* sprite should look like this frame.
*
* Nothing motion-related lives on a character. That is unusual for this codebase, and the reason
* is that motion is presentation with no persistence — parking it in a `WeakMap` here means there
* is no field for the save encoder to find, no transient declaration to keep correct, and no way
* for a future addition to end up in a savefile by accident. The failure mode is unrepresentable
* rather than guarded against.
*
* A `WeakMap` also means a character that leaves the game takes its motions with it, so there is no
* registry to sweep on a scene change and no way to leak effects across maps.
*/
var CharacterMotionComposer = class CharacterMotionComposer {
	/**
	* Every character's motion state, keyed by the character itself.
	* @type {WeakMap<Game_CharacterBase, Object>}
	*/
	static #stateByCharacter = new WeakMap();
	/**
	* The composition handed to characters that have no motion at all.
	*
	* Most characters on a map are declaring nothing, and allocating an identical all-identity
	* composition for each of them every frame is a lot of garbage for no information. Nothing
	* writes to a composition it was handed, so one instance serves everybody.
	* @type {MotionComposition}
	*/
	static #emptyComposition = new MotionComposition();
	/**
	* How strongly a source's claim on a channel outranks another's.
	* @type {Map<string, number>}
	*/
	static #sourcePriorities = new Map([
		["combat", 4],
		["command", 3],
		["state", 2],
		["page", 1]
	]);
	/**
	* Declares the complete set of motions for one source on one character.
	*
	* This replaces whatever that source had declared before and leaves every other source alone,
	* which is the property that lets a state expire without disturbing an event page's ambient
	* motion.
	* @param {Game_CharacterBase} character The character that should move.
	* @param {string} sourceKey Who is declaring, ex: `page` or `state:42`.
	* @param {MotionDeclaration[]} declarations Everything that source wants, in full.
	* @param {number=} expiryFrames How long the source wants this to last; 0 means indefinitely.
	*/
	static declare(character, sourceKey, declarations, expiryFrames = 0) {
		const state = CharacterMotionComposer.#stateFor(character);
		const previous = state.declarationsBySource.get(sourceKey);
		if (CharacterMotionComposer.#areDeclarationsIdentical(previous, declarations) === true) {
			CharacterMotionComposer.#scheduleExpiry(state, sourceKey, expiryFrames);
			return;
		}
		CharacterMotionComposer.removeDeclarations(character, sourceKey);
		state.declarationsBySource.set(sourceKey, declarations);
		declarations.forEach((declaration) => state.effects.push(CharacterMotionComposer.#buildEffect(declaration)), this);
		CharacterMotionComposer.#scheduleExpiry(state, sourceKey, expiryFrames);
	}
	/**
	* Withdraws everything one source had declared on a character.
	* @param {Game_CharacterBase} character The character to stop moving.
	* @param {string} sourceKey Who is withdrawing.
	*/
	static removeDeclarations(character, sourceKey) {
		const state = CharacterMotionComposer.#stateFor(character);
		state.declarationsBySource.delete(sourceKey);
		state.expiryBySource.delete(sourceKey);
		state.effects.filter((effect) => CharacterMotionComposer.#isFromSource(effect, sourceKey)).forEach((effect) => effect.requestRemoval());
	}
	/**
	* Determines whether a character has any motion worth composing.
	* @param {Game_CharacterBase} character The character to check.
	* @returns {boolean}
	*/
	static hasMotion(character) {
		if (CharacterMotionComposer.#stateByCharacter.has(character) === false) return false;
		const state = CharacterMotionComposer.#stateByCharacter.get(character);
		return state.effects.length > 0;
	}
	/**
	* Advances a character's motions by one frame and reports what its sprite should look like.
	* @param {Game_CharacterBase} character The character being drawn.
	* @returns {MotionComposition}
	*/
	static compose(character) {
		if (CharacterMotionComposer.hasMotion(character) === false) {
			return CharacterMotionComposer.#emptyComposition;
		}
		const state = CharacterMotionComposer.#stateByCharacter.get(character);
		CharacterMotionComposer.#expireElapsedSources(character, state);
		state.effects.forEach((effect) => effect.tick());
		state.effects = state.effects.filter((effect) => effect.isDiscardable() === false);
		const composition = new MotionComposition();
		CharacterMotionComposer.#awardClaims(state.effects, composition);
		state.effects.forEach((effect) => effect.applyTo(composition));
		return composition;
	}
	/**
	* Discards everything known about a character's motion.
	*
	* Nothing in core needs this — a character's state dies with the character — but a test that
	* shares a character between cases does, and so will anything that wants a hard reset.
	* @param {Game_CharacterBase} character The character to forget.
	*/
	static forget(character) {
		CharacterMotionComposer.#stateByCharacter.delete(character);
	}
	/**
	* Records how long a source wants to last, or clears any clock it had.
	* @param {Object} state The character's motion state.
	* @param {string} sourceKey The source being scheduled.
	* @param {number} expiryFrames How long it should last; 0 means indefinitely.
	*/
	static #scheduleExpiry(state, sourceKey, expiryFrames) {
		if (expiryFrames <= 0) {
			state.expiryBySource.delete(sourceKey);
			return;
		}
		state.expiryBySource.set(sourceKey, expiryFrames);
	}
	/**
	* Counts down every timed source and withdraws the ones whose time is up.
	*
	* Timed removal lives here rather than with whoever asked for it because this is the only place
	* that already counts frames. An applier states how long it wants something to last and never
	* has to run a clock of its own.
	* @param {Game_CharacterBase} character The character being composed.
	* @param {Object} state The character's motion state.
	*/
	static #expireElapsedSources(character, state) {
		if (state.expiryBySource.size === 0) return;
		const expired = [];
		state.expiryBySource.forEach((framesRemaining, sourceKey) => {
			const remaining = framesRemaining - 1;
			if (remaining <= 0) {
				expired.push(sourceKey);
				return;
			}
			state.expiryBySource.set(sourceKey, remaining);
		});
		expired.forEach((sourceKey) => CharacterMotionComposer.removeDeclarations(character, sourceKey));
	}
	/**
	* Settles which effect owns each contested channel this frame.
	*
	* Claims are resolved up front so that a losing contribution can be discarded when it arrives
	* rather than written and then painted over. Higher-priority sources win outright, and among
	* equals the most recently declared wins, because the newest thing to happen to a character is
	* usually the thing a player is meant to notice.
	* @param {MotionEffect[]} effects Every live effect on the character.
	* @param {MotionComposition} composition The composition being built.
	*/
	static #awardClaims(effects, composition) {
		const winningPriorities = new Map();
		effects.forEach((effect) => {
			const priority = CharacterMotionComposer.#priorityFor(effect);
			effect.claims().forEach((channel) => {
				const incumbent = winningPriorities.get(channel);
				if (incumbent !== undefined && incumbent > priority) return;
				winningPriorities.set(channel, priority);
				composition.awardClaim(channel, effect);
			});
		}, this);
	}
	/**
	* How strongly an effect's source outranks others when claiming a channel.
	*
	* Source keys carry an id for states and combat reactions, so the rank comes from the part in
	* front of the colon. An unrecognised source ranks lowest, which means a typo produces a motion
	* that composes politely rather than one that seizes a channel from everything else.
	* @param {MotionEffect} effect The effect whose source is being ranked.
	* @returns {number}
	*/
	static #priorityFor(effect) {
		const sourceKey = effect.declaration().sourceKey();
		const [sourceKind] = sourceKey.split(":");
		if (CharacterMotionComposer.#sourcePriorities.has(sourceKind) === false) return 0;
		return CharacterMotionComposer.#sourcePriorities.get(sourceKind);
	}
	/**
	* Determines whether an effect came from a given source.
	* @param {MotionEffect} effect The effect being tested.
	* @param {string} sourceKey The source being withdrawn.
	* @returns {boolean}
	*/
	static #isFromSource(effect, sourceKey) {
		const effectSource = effect.declaration().sourceKey();
		return effectSource === sourceKey;
	}
	/**
	* Builds the live effect for a declaration, with its configured defaults applied.
	* @param {MotionDeclaration} declaration The declaration being brought to life.
	* @returns {MotionEffect}
	*/
	static #buildEffect(declaration) {
		const motionType = declaration.type();
		const configuredDefaults = J.MOTION.Metadata.defaultsForMotionType(motionType);
		return MotionTypeRegistry.buildEffect(declaration, configuredDefaults);
	}
	/**
	* Determines whether a source is asking for exactly what it already asked for.
	* @param {MotionDeclaration[]} previous What that source declared last time, if anything.
	* @param {MotionDeclaration[]} incoming What it is declaring now.
	* @returns {boolean}
	*/
	static #areDeclarationsIdentical(previous, incoming) {
		if (previous === undefined) return false;
		if (previous.length !== incoming.length) return false;
		return previous.every((declaration, index) => declaration.matches(incoming.at(index)));
	}
	/**
	* Gets a character's motion state, creating it on first use.
	* @param {Game_CharacterBase} character The character.
	* @returns {Object} The state.
	*/
	static #stateFor(character) {
		if (CharacterMotionComposer.#stateByCharacter.has(character) === false) {
			CharacterMotionComposer.#stateByCharacter.set(character, {
				declarationsBySource: new Map(),
				expiryBySource: new Map(),
				effects: []
			});
		}
		return CharacterMotionComposer.#stateByCharacter.get(character);
	}
};

//#endregion
//#region src/plugins/motion/core/objects/Game_Event.js
/**
* Extends {@link #setupPage}.<br/>
* Reads whatever motions the newly-active page declares and hands them to the composer.
*/
J.MOTION.Aliased.Game_Event.set("setupPage", Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function() {
	J.MOTION.Aliased.Game_Event.get("setupPage").call(this);
	this.refreshDeclaredMotions();
};
/**
* Declares whatever motions this event's active page asks for.
*
* This runs far more often than a page actually changes — `Game_Map#refresh` re-runs page setup for
* every event on the map whenever a single self-switch flips. The composer compares the incoming
* declarations against what it already holds and does nothing when they agree, which is what keeps
* a room full of enemies from snapping mid-breath every time a chest is opened.
*/
Game_Event.prototype.refreshDeclaredMotions = function() {
	const comments = this.motionCommentTexts();
	const declarations = MotionTagParser.parseComments(comments, "page");
	CharacterMotionComposer.declare(this, "page", declarations);
};
/**
* The text of every parsable comment on this event's active page.
*
* Comment blocks in the editor are stored as one command for the first line and another for each
* line after it, and J-Base's comment reader honours both — so a motion tag written on the third
* line of a block is found exactly like one written on its own.
* @returns {string[]}
*/
Game_Event.prototype.motionCommentTexts = function() {
	const commands = this.getValidCommentCommands();
	return commands.map((command) => {
		const [comment] = command.parameters;
		return comment;
	});
};

//#endregion
//#region src/plugins/motion/core/sprites/Sprite_Character.js
/**
* Extends {@link #initMembers}.<br/>
* Adds the motion-specific members to this sprite.
*/
J.MOTION.Aliased.Sprite_Character.set("initMembers", Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function() {
	J.MOTION.Aliased.Sprite_Character.get("initMembers").call(this);
	this.initMotionMembers();
};
/**
* Initializes the members of this sprite that belong to motion.
*/
Sprite_Character.prototype.initMotionMembers = function() {
	/**
	* Whether this sprite has ever had a colour motion applied to it.
	* @type {boolean}
	*/
	this._motionColored = false;
};
/**
* Gets whether this sprite has ever had a colour motion applied to it.
* @returns {boolean} The motionColored.
*/
Sprite_Character.prototype.isMotionColored = function() {
	return this._motionColored;
};
/**
* Flags this sprite as having had a colour motion applied to it.
*/
Sprite_Character.prototype.flagMotionColored = function() {
	this._motionColored = true;
};
/**
* Extends {@link #update}.<br/>
* Applies this character's composed motion after the engine has finished placing the sprite.
*
* This runs after the original rather than before it because `updatePosition` assigns x and y and
* `updateOther` assigns opacity, every frame, unconditionally. Anything written ahead of them is
* overwritten within the same frame and never reaches the screen.
*/
J.MOTION.Aliased.Sprite_Character.set("update", Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function() {
	J.MOTION.Aliased.Sprite_Character.get("update").call(this);
	this.updateCharacterMotion();
};
/**
* Applies one frame of composed motion to this sprite.
*/
Sprite_Character.prototype.updateCharacterMotion = function() {
	const character = this.character();
	if (!character) return;
	const composition = CharacterMotionComposer.compose(character);
	this.applyMotionTransform(composition);
	this.applyMotionColor(composition);
};
/**
* Applies the positional half of a composition: offsets, rotation, scale and opacity.
*
* Every channel is written on every frame, including when nothing is animating. Returning early
* for a still character would be cheaper, and would also mean a character that had been scaled up
* and then had that motion removed would stay large forever, because nothing else in the engine
* ever writes scale or rotation back.
* @param {MotionComposition} composition This character's composed motion.
*/
Sprite_Character.prototype.applyMotionTransform = function(composition) {
	this.x += composition.valueFor(MotionChannels.OFFSET_X);
	this.y += composition.valueFor(MotionChannels.OFFSET_Y);
	this.opacity *= composition.valueFor(MotionChannels.OPACITY);
	this.scale.x = composition.valueFor(MotionChannels.SCALE_X);
	this.scale.y = composition.valueFor(MotionChannels.SCALE_Y);
	this.rotation = composition.valueFor(MotionChannels.ROTATION);
	this.applyMotionAnchor(composition);
};
/**
* Moves the sprite's anchor to its middle when a motion needs to rotate it in place.
*
* A character sprite is anchored at its feet so that it stands on its tile. Rotating about that
* point swings the character around like a conker on a string, so a spin asks for the anchor to
* move — and then the sprite has to drop half its own height to keep standing where it was.
* @param {MotionComposition} composition This character's composed motion.
*/
Sprite_Character.prototype.applyMotionAnchor = function(composition) {
	if (composition.hasCenterRotation() === false) return;
	this.anchor.y = .5;
	this.y += this.height / 2;
};
/**
* Applies the colour half of a composition: hue, tint, tone and flash.
*
* The colour filter these use is created lazily by the engine on first write and never removed, so
* a sprite that has ever been coloured keeps its own render pass for the rest of its life. Nothing
* is written until a colour motion actually runs, which is why an ordinary character never pays
* for a feature it is not using.
* @param {MotionComposition} composition This character's composed motion.
*/
Sprite_Character.prototype.applyMotionColor = function(composition) {
	if (this.needsMotionColor(composition) === false) return;
	const [red, green, blue] = composition.valueFor(MotionChannels.TINT);
	this.setHue(composition.valueFor(MotionChannels.HUE));
	this.setColorTone(composition.valueFor(MotionChannels.TONE));
	this.setBlendColor(composition.valueFor(MotionChannels.FLASH));
	this.tint = (red << 16) + (green << 8) + blue;
};
/**
* Determines whether the colour channels need writing this frame.
*
* Once a sprite has been coloured it must keep being written even as the values return to normal,
* because the trip back to plain is itself something the engine has to be told about.
* @param {MotionComposition} composition This character's composed motion.
* @returns {boolean}
*/
Sprite_Character.prototype.needsMotionColor = function(composition) {
	if (this.isMotionColored() === true) return true;
	const isColored = Sprite_Character.isMotionColorMeaningful(composition);
	if (isColored === true) {
		this.flagMotionColored();
	}
	return isColored;
};
/**
* Determines whether a composition's colour channels differ from doing nothing at all.
* @param {MotionComposition} composition The composition to inspect.
* @returns {boolean}
*/
Sprite_Character.isMotionColorMeaningful = function(composition) {
	if (composition.valueFor(MotionChannels.HUE) !== 0) return true;
	const tone = composition.valueFor(MotionChannels.TONE);
	if (tone.some((component) => component !== 0)) return true;
	const flash = composition.valueFor(MotionChannels.FLASH);
	if (flash.at(3) !== 0) return true;
	const tint = composition.valueFor(MotionChannels.TINT);
	return tint.some((component) => component !== 255);
};

//#endregion
//#region src/plugins/motion/core/_metadata/pluginCommands.js
/**
* Applies a motion to a character for a while, or forever.
*
* There are two commands rather than one per motion because the tag grammar already says what a
* motion is; a command only has to say who it happens to and for how long.
*/
PluginManager.registerCommand(J.MOTION.Metadata.name, "applyMotion", function(args) {
	const { target, targetId, motion, sourceKey, duration } = args;
	const parsedTargetId = Number.parseInt(targetId, 10);
	const parsedDuration = Number.parseInt(duration, 10);
	const resolvedSourceKey = sourceKey || "command";
	const character = MotionTargetResolver.resolve(target, parsedTargetId, this);
	if (!character) {
		Diagnostics.warn("J-Motion", "apply motion could not find its target", {
			target,
			targetId
		});
		return;
	}
	const declaration = MotionTagParser.parsePayload(`[${motion}]`, resolvedSourceKey);
	if (declaration === null) return;
	const expiryFrames = Number.isFinite(parsedDuration) ? parsedDuration : 0;
	CharacterMotionComposer.declare(character, resolvedSourceKey, [declaration], expiryFrames);
});
/**
* Withdraws whatever a source had applied to a character.
*/
PluginManager.registerCommand(J.MOTION.Metadata.name, "removeMotion", function(args) {
	const { target, targetId, sourceKey } = args;
	const parsedTargetId = Number.parseInt(targetId, 10);
	const resolvedSourceKey = sourceKey || "command";
	const character = MotionTargetResolver.resolve(target, parsedTargetId, this);
	if (!character) {
		Diagnostics.warn("J-Motion", "remove motion could not find its target", {
			target,
			targetId
		});
		return;
	}
	CharacterMotionComposer.removeDeclarations(character, resolvedSourceKey);
});

//#endregion
//# sourceMappingURL=J-Motion.js.map