//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 MOTION-ABS] Combat-driven motion: state effects, deaths, arrivals and departures.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Motion
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Motion
 * @help
 * ============================================================================
 * OVERVIEW
 * J-Motion gives map characters motion. This extension lets combat drive it.
 *
 * Three things live here, and all of them exist because a battler and a
 * character are different objects that only J-ABS holds together at once:
 *
 * - STATES can declare motions. A bleeding creature pulses, an elite swells.
 * - DEATHS are animated. Enemies collapse instead of vanishing mid-frame.
 * - ARRIVALS and DEPARTURES are animated. An enemy whose event page brings it
 *   onto the map or takes it off again turns into view or away from it.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; this extension is meaningless without combat on the map.
 * - J-Motion; this extension is meaningless without motion.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * MOTIONS ON STATES
 * Any state can carry J-Motion's ordinary <motion:...> tag, and whatever it
 * declares runs for exactly as long as the state is on the battler. It is the
 * same tag, read by the same parser, as the one an event page uses- so nothing
 * new has to be learned to use it.
 *
 * A state's motions are filed separately from an event page's, so a state
 * expiring never disturbs the ambient motion a creature was authored with.
 * A breathing enemy that catches fire is breathing AND flickering, and stops
 * flickering alone when the fire goes out.
 *
 * DEATH ANIMATIONS
 * Every enemy gets one, without being asked. Before this plugin an enemy simply
 * stopped rendering on the frame it died; now it collapses, and the corpse is
 * held on the map for exactly as long as that takes.
 *
 * Rewards and loot still drop the moment the enemy is defeated, so gold and
 * items appear while the body is still coming apart.
 *
 * ARRIVALS AND DEPARTURES
 * Every enemy gets these too, without being asked. An enemy event whose page
 * stops applying - a <timeRangePage> closing, a switch turning off, an Erase
 * Event command - used to vanish on the spot, and one whose page started
 * applying used to pop into existence. Now both are animated.
 *
 * The shape is a fold: the sprite turns on its vertical axis like a paper
 * cutout, edge-on when it is absent and facing the player when it is present.
 * A departing enemy turns away and is gone; an arriving one turns to face you.
 * No death looks like this, so an enemy leaving at the end of its hours is
 * never mistaken for one that was just killed with no loot to show for it.
 *
 * While it folds away, an enemy cannot be hit and does not act, and its page is
 * held back until the fold has finished. While it unfolds, it can be hit but
 * does not act until it is fully facing you.
 *
 * Both begin with the enemy's respawn animation, the very one it plays when it
 * returns after being defeated, chosen the same way: <respawnAnimation:ID> on
 * the event, then the enemy's note, then J-ABS's default. An id of 0 turns it
 * off here too, and the fold still plays without it.
 *
 * Any page change on a living enemy counts, including one that swaps it for a
 * different enemy on the event's next page: J-ABS builds that as a brand new
 * battler at full health anyway, so it folds out and the new one folds in.
 *
 * Enemies that respawn after being defeated, and enemies brought in by the
 * Spawn Enemy command, unfold into view too, beneath whatever animation they
 * already play - so every way an enemy appears looks the same.
 *
 * Enemies already on a map when you arrive there do not unfold; that is a map
 * loading, not an entrance. Enemies that are dying leave through their death
 * animation instead.
 *
 * Both motions are also ordinary J-Motion types, `fold` and `unfold`, taking a
 * single DURATION parameter, and can be declared anywhere a motion can.
 *
 * ============================================================================
 * DEATH MOTION:
 * There are three styles, and they are speeds as much as shapes:
 *
 *   swift     a quick vertical squash. Trash mobs, gone in half a second.
 *   moderate  a topple, falling and fading. Something worth having fought.
 *   slow      a long shimmering sink. Something whose death is a moment.
 *
 * TAG FORMAT:
 *  <deathMotion:STYLE>
 *    Where STYLE is one of the three above.
 *
 *  <noDeathMotion>
 *    Suppresses the animation entirely, and the delay that comes with it.
 *
 * TAG USAGE:
 * - Enemies
 * - States
 *
 * WHICH ONE WINS:
 * A battler's states are consulted first, and among several the one with the
 * highest state PRIORITY as set in the editor wins. Failing that, the enemy's
 * own note. Failing that, the configured default.
 *
 * That order is what makes affixes work without authoring anything twice-
 * affixes are states, so an elite version of an ordinary creature dies harder
 * purely because of what is stuck to it.
 *
 * <noDeathMotion> outranks all of it, from either a state or the enemy. A boss
 * that runs its own scripted collapse does not want a generic one underneath,
 * and definitely does not want its corpse held open for the extra frames.
 *
 * TAG EXAMPLES:
 *  <deathMotion:slow>
 * This enemy takes its time dying.
 *
 *  <noDeathMotion>
 * This enemy leaves the map the instant it is defeated, as it always did.
 *
 * ============================================================================
 * CONFIGURATION:
 * Death pacing lives in `data/config.motion.json`, under `death`:
 *
 *   "death": {
 *     "defaultStyle": "swift",
 *     "durations": { "swift": 30, "moderate": 60, "slow": 120 }
 *   }
 *
 * Durations are in frames, at 60 frames per second. Changing them retunes how
 * every death in the game feels, without rebuilding anything.
 *
 * ----------------------------------------------------------------------------
 * Loot expiry pacing lives in the same file, under `loot`:
 *
 *   "loot": {
 *     "expiryWarnFrames": 300,
 *     "expiryFadeFrames": 120,
 *     "flicker": { "min": 0.2, "max": 1.0, "interval": 8 }
 *   }
 *
 * A loot drop that is about to time out blinks for its last `expiryWarnFrames`,
 * then additionally dissolves over its last `expiryFadeFrames`, reaching
 * invisible on the frame it would have vanished anyway. The fade window sits
 * inside the warning one, so the closing stretch both blinks and dims.
 *
 * The blink comes first on purpose. A slow dim is something the eye adapts to
 * rather than notices, and it makes the drop hardest to see during exactly the
 * window it most needs finding. A blink returns to full opacity between beats
 * while being impossible to miss.
 *
 * `flicker` is the shape of that blink: the opacity range it swings between and
 * how many frames pass between re-rolls. A lower `min` reads as a harder blink.
 *
 * Loot being drawn toward somebody is exempt: it has been claimed, it has
 * stopped expiring, and anything already fading on it is put back.
 *
 * Collection is deliberately not animated. A collected drop arrives at the
 * player and goes there, which is already a moment with a visible cause.
 *
 * ----------------------------------------------------------------------------
 * Arrival and departure pacing lives in the same file, under `presence`:
 *
 *   "presence": {
 *     "arrivalDuration": 30,
 *     "departureDuration": 30
 *   }
 *
 * Both are in frames. A duration of 0 turns that half off, and the enemy
 * appears or vanishes on the frame its page changes, as it used to.
 * ============================================================================
 * CHANGELOG:
 * - 1.2.0
 *    Enemies now fold into view when their page brings them onto the map, and fold
 *    away when it takes them off, instead of popping in and out. A folding enemy
 *    can't be hit on the way out, and doesn't act until it is facing you.
 * - 1.1.0
 *    A loot drop about to expire now blinks, then dissolves over its closing frames,
 *    so it stops vanishing without warning. Loot being drawn toward somebody is
 *    exempt, and the pacing is configured in data/config.motion.json.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/motion/ext/abs/_metadata/_pluginMetadata.js
/**
* The metadata for J-Motion-ABS.
*
* Death, loot, and presence pacing are read from the same external config J-Motion core uses, under
* their own `death`, `loot`, and `presence` sections. Keeping them there rather than in plugin
* parameters means the speed at which everything in the game dies, fades away, arrives, or leaves is
* one file a designer can open, which is the sort of thing that gets retuned by feel rather than by
* reasoning.
*/
var J_MOTION_ABS_PluginMetadata = class J_MOTION_ABS_PluginMetadata extends PluginMetadata {
	/**
	* The path where the motion configuration lives.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.motion.json";
	/**
	* The death pacing used when the config says nothing at all.
	*
	* A plugin that cannot find its config should still bury the dead. These are frames, and they are
	* the same numbers the shipped config carries.
	* @type {Object<string, number>}
	*/
	static FALLBACK_DURATIONS = {
		swift: 30,
		moderate: 60,
		slow: 120
	};
	/**
	* Constructor.
	* @param {string} name The name of this plugin.
	* @param {string} version The version of this plugin.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* The loot expiry pacing used when the config says nothing at all.
	*
	* Frames, and the same numbers the shipped config carries. `warnFrames` is when the drop starts
	* blinking and `fadeFrames` is when it additionally starts dissolving, so the fade window sits
	* inside the warning one rather than beside it.
	* @type {Object}
	*/
	static FALLBACK_LOOT = {
		warnFrames: 300,
		fadeFrames: 120,
		flicker: {
			min: .2,
			max: 1,
			interval: 8
		}
	};
	/**
	* The arrival and departure pacing used when the config says nothing at all.
	*
	* Frames, and the same numbers the shipped config carries. Half a second each way: long enough to
	* read as a battler turning to face the player or turning away, short enough that nobody is left
	* waiting on it.
	* @type {{arrivalDuration: number, departureDuration: number}}
	*/
	static FALLBACK_PRESENCE = {
		arrivalDuration: 30,
		departureDuration: 30
	};
	/**
	* Extends {@link #postInitialize}.<br>
	* Reads the death, loot, and presence pacing out of the shared motion configuration.
	*/
	postInitialize() {
		super.postInitialize();
		const parsedConfiguration = this.loadMotionConfiguration();
		this.initializeDeathMetadata(parsedConfiguration);
		this.initializeLootMetadata(parsedConfiguration);
		this.initializePresenceMetadata(parsedConfiguration);
	}
	/**
	* Reads the shared motion configuration off disk.
	* @returns {Object} The parsed configuration root.
	*/
	loadMotionConfiguration() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Motion-ABS").configName("motion configuration").build();
		return ExternalJsonConfigLoader.load(J_MOTION_ABS_PluginMetadata.CONFIG_PATH, options);
	}
	/**
	* Reads how long each death style lasts, and which one everything gets by default.
	* @param {Object} parsedConfiguration The parsed motion configuration root.
	*/
	initializeDeathMetadata(parsedConfiguration) {
		const deathConfiguration = parsedConfiguration.death ?? {};
		/**
		* How many frames each death style holds the corpse open for.
		* @type {Object<string, number>}
		*/
		this.deathDurations = {
			...J_MOTION_ABS_PluginMetadata.FALLBACK_DURATIONS,
			...deathConfiguration.durations
		};
		/**
		* The style anything dies with when nothing has said otherwise.
		* @type {string}
		*/
		this.defaultDeathStyle = deathConfiguration.defaultStyle ?? "swift";
	}
	/**
	* Reads how a loot drop announces that it is running out of time.
	* @param {Object} parsedConfiguration The parsed motion configuration root.
	*/
	initializeLootMetadata(parsedConfiguration) {
		const lootConfiguration = parsedConfiguration.loot ?? {};
		const fallback = J_MOTION_ABS_PluginMetadata.FALLBACK_LOOT;
		/**
		* How many frames before a loot drop expires it begins blinking.
		* @type {number}
		*/
		this.lootExpiryWarnFrames = lootConfiguration.expiryWarnFrames ?? fallback.warnFrames;
		/**
		* How many frames before a loot drop expires it additionally begins dissolving.
		* @type {number}
		*/
		this.lootExpiryFadeFrames = lootConfiguration.expiryFadeFrames ?? fallback.fadeFrames;
		/**
		* The shape of the blink: the opacity range it swings between and how often it re-rolls.
		* @type {{min: number, max: number, interval: number}}
		*/
		this.lootExpiryFlicker = {
			...fallback.flicker,
			...lootConfiguration.flicker
		};
	}
	/**
	* Reads how long a battler takes to arrive on the map and to leave it when its page changes.
	*
	* A duration of zero turns that half off entirely, and the battler appears or vanishes on the
	* frame its page changes, the way it did before either animation existed.
	* @param {Object} parsedConfiguration The parsed motion configuration root.
	*/
	initializePresenceMetadata(parsedConfiguration) {
		const presenceConfiguration = parsedConfiguration.presence ?? {};
		const fallback = J_MOTION_ABS_PluginMetadata.FALLBACK_PRESENCE;
		/**
		* How many frames a battler takes to unfold into view when its page brings it onto the map.
		* @type {number}
		*/
		this.arrivalDuration = presenceConfiguration.arrivalDuration ?? fallback.arrivalDuration;
		/**
		* How many frames a battler takes to fold out of view before its page takes it off the map.
		* @type {number}
		*/
		this.departureDuration = presenceConfiguration.departureDuration ?? fallback.departureDuration;
	}
	/**
	* How long a death style runs for, in frames.
	*
	* An unrecognised style is a typo in somebody's notetag rather than a reason to stop the game, so
	* it falls back to the default pacing and the resolver reports the bad name separately.
	* @param {string} style The death style being asked about.
	* @returns {number}
	*/
	deathDurationFor(style) {
		const configured = this.deathDurations[style];
		if (configured === undefined) return this.deathDurations[this.defaultDeathStyle];
		return configured;
	}
	/**
	* Determines whether a style name is one this plugin knows how to animate.
	* @param {string} style The death style being checked.
	* @returns {boolean}
	*/
	isKnownDeathStyle(style) {
		return this.deathDurations[style] !== undefined;
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/_metadata/initialization.js
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
	const requiredMotionVersion = "1.1.0";
	const hasMotionRequirement = J.BASE.Helpers.satisfies(J.MOTION.Metadata.version.version(), requiredMotionVersion);
	if (hasMotionRequirement === false) {
		throw new Error(`Either missing J-Motion or has a lower version than the required: ${requiredMotionVersion}`);
	}
	const requiredJabsVersion = "4.25.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (hasJabsRequirement === false) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension.
*/
J.MOTION.EXT.ABS = {};
/**
* The metadata associated with this plugin.
*/
J.MOTION.EXT.ABS.Metadata = new J_MOTION_ABS_PluginMetadata("J-Motion-ABS", "1.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MOTION.EXT.ABS.Aliased = {};
J.MOTION.EXT.ABS.Aliased.Game_Battler = new Map();
J.MOTION.EXT.ABS.Aliased.Game_Event = new Map();
J.MOTION.EXT.ABS.Aliased.JABS_Engine = new Map();
J.MOTION.EXT.ABS.Aliased.Sprite_Character = new Map();
/**
* All regular expressions used by this plugin.
*/
J.MOTION.EXT.ABS.RegExp = {};
/**
* The death animation a battler collapses with when it is defeated.
*
* Written on a state or an enemy. A state's declaration outranks the enemy's own, so an affix can
* give an otherwise ordinary creature a more laboured end than it would have had.
*
* <pre>
* Structure:
*  <deathMotion:STYLE>
*
* Example:
*  <deathMotion:slow>
*
* Translation:
*  This battler dies slowly, dissolving as it goes.
* </pre>
* @type {RegExp}
*/
J.MOTION.EXT.ABS.RegExp.DeathMotion = /<deathMotion:[ ]?(\w+)>/i;
/**
* Suppresses the death animation entirely for whatever carries it.
*
* For anything that runs its own show on death - a boss with a scripted collapse, an enemy whose
* event actions do something more interesting than melting - the automatic animation is in the way,
* and the delay it holds the corpse open for is worse than in the way.
*
* <pre>
* Structure:
*  <noDeathMotion>
* </pre>
* @type {RegExp}
*/
J.MOTION.EXT.ABS.RegExp.NoDeathMotion = /<noDeathMotion>/i;

//#endregion
//#region src/plugins/motion/ext/abs/models/CollapseMotionEffect.js
/**
* How a battler leaves the world.
*
* Without this an enemy simply stops existing on the frame it dies, which is the one moment in a
* fight the player is most likely to be looking directly at it. A collapse gives that moment a
* shape, and gives the game somewhere to say how much this particular death mattered.
*
* Three styles, and they are speeds as much as they are shapes. A trash mob should be gone before
* the player has finished swinging at the next one; a boss has earned a few seconds of dying.
*
* This is the only motion in the ecosystem that claims its channels outright. Everything else
* composes, because a breathing enemy that also sways is two true things at once — but a corpse is
* not still breathing, and an ambient float would otherwise carry it gently upward as it melts.
*
* `MotionEffect`, `MotionChannels` and `MotionEasing` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var CollapseMotionEffect = class CollapseMotionEffect extends MotionEffect {
	/**
	* A quick vertical squash. For anything whose death is punctuation rather than an event.
	* @type {string}
	*/
	static SWIFT = "swift";
	/**
	* A squash that topples over as it goes. For something that was worth fighting.
	* @type {string}
	*/
	static MODERATE = "moderate";
	/**
	* A long sink with a shimmer through it. For something whose death the player should watch.
	* @type {string}
	*/
	static SLOW = "slow";
	/**
	* The channels a collapse takes exclusive ownership of.
	*
	* Everything that could otherwise keep animating a corpse: its size, its angle, how solid it is,
	* and how far off the ground it sits. A dying thing does not also hover.
	* @returns {string[]}
	*/
	claims() {
		return [
			MotionChannels.SCALE_X,
			MotionChannels.SCALE_Y,
			MotionChannels.OPACITY,
			MotionChannels.ROTATION,
			MotionChannels.OFFSET_Y
		];
	}
	/**
	* Determines whether the composer may forget about this effect.
	*
	* Never, of its own accord. A collapse ends when the battler it belongs to is removed from the
	* map, and until that happens the corpse has to keep being drawn in whatever state it reached —
	* a collapse that retired itself at the end of its duration would pop the sprite back to full
	* size and full opacity for the frame or two before the engine got around to deleting it.
	* @returns {boolean}
	*/
	isDiscardable() {
		return this.hasRemovalRequested();
	}
	/**
	* How far through the collapse this frame is, from 0 to 1.
	* @returns {number}
	*/
	progress() {
		const { duration } = this.parameters();
		return MotionEasing.normalize(this.elapsedFrames() / duration);
	}
	/**
	* Writes this frame of the collapse into the composition.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const { style } = this.parameters();
		const progress = this.progress();
		switch (style) {
			case CollapseMotionEffect.MODERATE:
				this.applyTopple(composition, progress);
				break;
			case CollapseMotionEffect.SLOW:
				this.applyDissolve(composition, progress);
				break;
			default:
				this.applySquash(composition, progress);
				break;
		}
	}
	/**
	* The swift death: the body drops straight down into the ground and is gone.
	*
	* Width grows a little as height collapses, which is what sells it as something being crushed
	* rather than something being scaled down.
	* @param {MotionComposition} composition The composition being built.
	* @param {number} progress How far through the collapse, 0 to 1.
	*/
	applySquash(composition, progress) {
		const eased = MotionEasing.easeInQuad(progress);
		composition.contribute(this, MotionChannels.SCALE_Y, 1 - eased);
		composition.contribute(this, MotionChannels.SCALE_X, 1 + eased * .35);
		composition.contribute(this, MotionChannels.OPACITY, 1 - progress);
		composition.contribute(this, MotionChannels.ROTATION, 0);
		composition.contribute(this, MotionChannels.OFFSET_Y, 0);
	}
	/**
	* The moderate death: the body tips over and settles, fading as it falls.
	*
	* The fall accelerates while the fade does not, so the body has visibly hit the ground before it
	* finishes disappearing — it reads as a thing that fell over and then stopped being there,
	* rather than a thing that faded out mid-topple.
	* @param {MotionComposition} composition The composition being built.
	* @param {number} progress How far through the collapse, 0 to 1.
	*/
	applyTopple(composition, progress) {
		const falling = MotionEasing.easeInQuad(progress);
		const quarterTurn = Math.PI / 2;
		const fadeWhileFalling = falling * .9;
		const fadeAfterLanding = progress * .1;
		const opacity = 1 - fadeWhileFalling - fadeAfterLanding;
		composition.contribute(this, MotionChannels.ROTATION, quarterTurn * falling);
		composition.contribute(this, MotionChannels.SCALE_Y, 1 - falling * .25);
		composition.contribute(this, MotionChannels.SCALE_X, 1);
		composition.contribute(this, MotionChannels.OPACITY, opacity);
		composition.contribute(this, MotionChannels.OFFSET_Y, 0);
	}
	/**
	* The slow death: the body sinks, shrinking and shimmering, and takes its time about it.
	*
	* The shimmer is a sine rather than a random roll, which is both cheaper and steadier — a random
	* flicker at this duration reads as a rendering fault, while a regular pulse reads as something
	* losing its grip on being solid.
	* @param {MotionComposition} composition The composition being built.
	* @param {number} progress How far through the collapse, 0 to 1.
	*/
	applyDissolve(composition, progress) {
		const shimmerCycles = 6;
		const shimmer = .85 + .15 * Math.sin(shimmerCycles * 2 * Math.PI * progress);
		const shrinking = MotionEasing.easeInQuad(progress);
		composition.contribute(this, MotionChannels.SCALE_X, 1 - shrinking * .4);
		composition.contribute(this, MotionChannels.SCALE_Y, 1 - shrinking * .4);
		composition.contribute(this, MotionChannels.OPACITY, (1 - progress) * shimmer);
		composition.contribute(this, MotionChannels.ROTATION, 0);
		composition.contribute(this, MotionChannels.OFFSET_Y, this.sinkDistance() * shrinking);
	}
	/**
	* How far into the ground a dissolving body settles, in pixels.
	*
	* Positive is downward in screen space. Kept small: a body that sinks far enough to notice looks
	* like it fell through the floor rather than like it came apart.
	* @returns {number}
	*/
	sinkDistance() {
		return 8;
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/models/FoldMotionEffect.js
/**
* How a battler arrives on the map and leaves it when nobody killed it.
*
* A battler whose page appears or disappears used to do so on a single frame, which reads as a
* rendering fault rather than as something happening. This gives both moments a shape: the sprite
* turns on its vertical axis like a paper cutout, edge-on when it is not there and facing the player
* when it is. Folding turns it away; unfolding turns it back.
*
* The shape was chosen against J-Motion-ABS's own collapses rather than on its own merits. Every
* death squashes, topples, or sinks, and all of those move a body vertically or tip it over. A fold
* is the one thing none of them do — the height never changes — so a battler leaving at the end of
* its hours can never be mistaken for one that was just killed with no loot to show for it.
*
* The two directions are one effect because each is exactly the other played backwards, and keeping
* them together is what guarantees they stay that way when either one is retuned.
*
* `MotionEffect`, `MotionChannels` and `MotionEasing` are reached as globals rather than imports:
* they ship inside J-Motion's bundle and are hoisted by the time this one loads.
*/
var FoldMotionEffect = class FoldMotionEffect extends MotionEffect {
	/**
	* The motion type that turns a sprite away until it is edge-on and gone.
	* @type {string}
	*/
	static FOLD = "fold";
	/**
	* The motion type that turns a sprite from edge-on to facing the player.
	* @type {string}
	*/
	static UNFOLD = "unfold";
	/**
	* The channels a fold takes exclusive ownership of while it runs.
	*
	* Width and opacity are the whole of the fold, so nothing ambient may fight it for them: a
	* ghosting enemy would otherwise pulse back into view halfway through leaving. Everything else is
	* left to compose, so a floating enemy still bobs as it turns and a large one is still large.
	* @returns {string[]}
	*/
	claims() {
		return [MotionChannels.SCALE_X, MotionChannels.OPACITY];
	}
	/**
	* How far through the fold this frame is, from 0 to 1.
	* @returns {number}
	*/
	progress() {
		const { duration } = this.parameters();
		return MotionEasing.normalize(this.elapsedFrames() / duration);
	}
	/**
	* How far the sprite is turned away from the player this frame, from 0 (facing) to 1 (edge-on).
	*
	* Folding turns away as it progresses; unfolding starts turned away and comes back. Answering the
	* question in these terms is what lets one drawing serve both directions.
	* @returns {number}
	*/
	turnedAway() {
		const progress = this.progress();
		const motionType = this.declaration().type();
		if (motionType === FoldMotionEffect.UNFOLD) return 1 - progress;
		return progress;
	}
	/**
	* Writes this frame of the fold into the composition.
	*
	* The width is the cosine of the turn, which is exactly how wide a flat card looks at that angle —
	* so a turn at a steady pace starts slowly and hurries as it goes edge-on, and unfolding does the
	* reverse. The opacity falls away with the square of the turn, so the sprite stays solid while it
	* is still recognisably turning and is gone by the time it is edge-on.
	* @param {MotionComposition} composition The composition being built for this character.
	*/
	applyTo(composition) {
		const turnedAway = this.turnedAway();
		const quarterTurn = Math.PI / 2;
		const width = Math.cos(turnedAway * quarterTurn);
		const opacity = 1 - turnedAway * turnedAway;
		composition.contribute(this, MotionChannels.SCALE_X, width);
		composition.contribute(this, MotionChannels.OPACITY, opacity);
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/core/registerCollapseMotionType.js
/**
* Teaches J-Motion how to animate a death.
*
* The registry is additive by design, so an extension adds a motion the same way core declares one
* and core never learns that this exists. Anything that can declare a motion can now declare a
* collapse — a plugin command, a state, an event page — even though the only thing that routinely
* does is a battler dying.
*
* There is no phase offset: a death happens when it happens, and starting one halfway through its
* own animation would be nonsense.
*/
MotionTypeRegistry.register("collapse", {
	implementation: CollapseMotionEffect,
	parameterNames: ["style", "duration"],
	defaults: {
		style: CollapseMotionEffect.SWIFT,
		duration: 30
	},
	phaseSpan: () => 0
});

//#endregion
//#region src/plugins/motion/ext/abs/core/registerFoldMotionTypes.js
/**
* Teaches J-Motion how a battler arrives and leaves.
*
* Two types sharing one implementation, the same way J-Motion core's transitions share one: the
* effect reads which of the two it was declared as. Like the collapse, anything that can declare a
* motion can declare these, even though the only thing that routinely does is a battler's page
* bringing it onto the map or taking it off again.
*
* There is no phase offset: an entrance or an exit happens when it happens, and starting one halfway
* through would be nonsense.
*/
[FoldMotionEffect.FOLD, FoldMotionEffect.UNFOLD].forEach((motionType) => {
	MotionTypeRegistry.register(motionType, {
		implementation: FoldMotionEffect,
		parameterNames: ["duration"],
		defaults: { duration: 30 },
		phaseSpan: () => 0
	});
});

//#endregion
//#region src/plugins/motion/ext/abs/core/DeathMotionResolver.js
/**
* Decides how a particular battler dies.
*
* Every enemy gets a death animation whether or not anybody authored one, because the alternative
* is what the game did before this existed: enemies stopped rendering mid-frame. So the question is
* never "does this thing have a death", only "which one", and the answer comes from three places in
* a fixed order:
*
* 1. **The battler's states**, highest state priority first. Affixes are states, so this is what
*    lets an elite die harder than the ordinary version of the same creature without either of them
*    being authored twice.
* 2. **The enemy's own note**, for a creature whose death is characteristic of the creature.
* 3. **The configured default**, which is swift, because most things that die are trash.
*
* Opting out is separate from choosing, and deliberately outranks everything: a boss that runs its
* own scripted collapse does not want a generic one layered underneath, and more importantly does
* not want the corpse held open for the extra frames one would cost.
*/
var DeathMotionResolver = class DeathMotionResolver {
	/**
	* Works out which death style a battler should collapse with.
	* @param {Game_Enemy} battler The battler that has been defeated.
	* @returns {string|null} The style name, or null when this battler opts out entirely.
	*/
	static resolveStyleFor(battler) {
		if (DeathMotionResolver.hasOptedOut(battler) === true) return null;
		const fromStates = DeathMotionResolver.styleFromStates(battler);
		if (fromStates !== null) return fromStates;
		const fromEnemy = DeathMotionResolver.styleFromEnemy(battler);
		if (fromEnemy !== null) return fromEnemy;
		return J.MOTION.EXT.ABS.Metadata.defaultDeathStyle;
	}
	/**
	* Determines whether this battler, or anything currently afflicting it, suppresses death motion.
	* @param {Game_Enemy} battler The battler that has been defeated.
	* @returns {boolean}
	*/
	static hasOptedOut(battler) {
		const { NoDeathMotion } = J.MOTION.EXT.ABS.RegExp;
		const enemyData = battler.databaseData();
		const enemyOptedOut = RPGManager.checkForBooleanFromNoteByRegex(enemyData, NoDeathMotion);
		if (enemyOptedOut === true) return true;
		const states = DeathMotionResolver.deathRelevantStates(battler);
		return states.some((state) => RPGManager.checkForBooleanFromNoteByRegex(state, NoDeathMotion));
	}
	/**
	* The death style declared by the highest-priority state carrying one.
	*
	* Priority is the state's own priority as authored in the editor, not the length or drama of the
	* animation it asks for. That keeps this consistent with every other place two states disagree,
	* and it means a designer orders deaths the same way they already order everything else.
	* @param {Game_Enemy} battler The battler that has been defeated.
	* @returns {string|null} The style name, or null when no state asks for one.
	*/
	static styleFromStates(battler) {
		const { DeathMotion } = J.MOTION.EXT.ABS.RegExp;
		const states = DeathMotionResolver.deathRelevantStates(battler);
		const declaring = states.filter((state) => RPGManager.getStringFromNoteByRegex(state, DeathMotion, true) !== null);
		if (declaring.length === 0) return null;
		const winner = declaring.reduce(DeathMotionResolver.higherPriorityOf);
		return RPGManager.getStringFromNoteByRegex(winner, DeathMotion, true);
	}
	/**
	* Whichever of two states the editor considers more important.
	*
	* Ties go to the incumbent, so a state that was already winning keeps winning. Nothing meaningful
	* distinguishes two equally-prioritised states, and picking the first keeps the answer stable
	* rather than dependent on the order the engine happened to return them in.
	* @param {RPG_State} incumbent The state currently winning.
	* @param {RPG_State} challenger The state being compared against it.
	* @returns {RPG_State}
	*/
	static higherPriorityOf(incumbent, challenger) {
		if (challenger.priority > incumbent.priority) return challenger;
		return incumbent;
	}
	/**
	* The death style declared on the enemy itself.
	* @param {Game_Enemy} battler The battler that has been defeated.
	* @returns {string|null} The style name, or null when the creature has no preference.
	*/
	static styleFromEnemy(battler) {
		const { DeathMotion } = J.MOTION.EXT.ABS.RegExp;
		const enemyData = battler.databaseData();
		return RPGManager.getStringFromNoteByRegex(enemyData, DeathMotion, true);
	}
	/**
	* The states worth consulting about a battler's death.
	*
	* Read through the battler's own accessor rather than the database table, so this sees what is
	* actually afflicting it at the moment it died.
	* @param {Game_Enemy} battler The battler that has been defeated.
	* @returns {RPG_State[]}
	*/
	static deathRelevantStates(battler) {
		return battler.states();
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/managers/BattlerMotionCoordinator.js
/**
* Connects what is happening to a battler with what its sprite is doing about it.
*
* J-Motion core knows how to animate a character and knows nothing about combat. J-ABS knows a
* great deal about combat and nothing about motion. This is the piece in between, and it is
* deliberately the only piece: everything here is a translation from a combat event into a motion
* declaration, and there is no animation logic in it at all.
*
* A battler is not a character. Only `JABS_Battler` holds both, which is why this extension exists
* at all rather than living in core — core has no way to reach an enemy's sprite, because outside
* of JABS an enemy has no presence on the map to reach.
*/
var BattlerMotionCoordinator = class BattlerMotionCoordinator {
	/**
	* The source key a state's motions are declared under.
	* @param {number} stateId The state declaring the motion.
	* @returns {string}
	*/
	static sourceKeyForState(stateId) {
		return `state:${stateId}`;
	}
	/**
	* The source key a death collapse is declared under.
	* @type {string}
	*/
	static DEATH_SOURCE_KEY = "combat:death";
	/**
	* Declares whatever motions a state asks for onto the battler it was applied to.
	*
	* Reached from the state being added rather than polled, so a bleed that makes something pulse
	* starts pulsing on the frame the bleed lands rather than on the next frame that happened to
	* check. There is no per-frame cost to this feature at all.
	* @param {Game_Battler} battler The battler the state was applied to.
	* @param {number} stateId The state that was applied.
	*/
	static applyStateMotions(battler, stateId) {
		if (battler.isStateAffected(stateId) === false) return;
		const character = BattlerMotionCoordinator.characterFor(battler);
		if (character === null) return;
		const state = battler.state(stateId);
		const sourceKey = BattlerMotionCoordinator.sourceKeyForState(stateId);
		const declarations = BattlerMotionCoordinator.declarationsFromNote(state, sourceKey);
		if (declarations.length === 0) return;
		CharacterMotionComposer.declare(character, sourceKey, declarations);
	}
	/**
	* Withdraws whatever motions a state had asked for.
	* @param {Game_Battler} battler The battler the state was removed from.
	* @param {number} stateId The state that was removed.
	*/
	static removeStateMotions(battler, stateId) {
		const character = BattlerMotionCoordinator.characterFor(battler);
		if (character === null) return;
		const sourceKey = BattlerMotionCoordinator.sourceKeyForState(stateId);
		CharacterMotionComposer.removeDeclarations(character, sourceKey);
	}
	/**
	* Starts a battler's death animation, and reports how long it needs.
	*
	* The caller is expected to hold the battler on the map for the returned number of frames. This
	* does not do that itself, because how long a defeated battler lingers is J-ABS's business and it
	* already has a mechanism for it.
	* @param {JABS_Battler} jabsBattler The battler that was defeated.
	* @returns {number} How many frames the collapse needs, or 0 when this battler opts out.
	*/
	static beginDeath(jabsBattler) {
		const battler = jabsBattler.getBattler();
		const style = DeathMotionResolver.resolveStyleFor(battler);
		if (style === null) return 0;
		const metadata = J.MOTION.EXT.ABS.Metadata;
		if (metadata.isKnownDeathStyle(style) === false) {
			Diagnostics.warn("J-Motion-ABS", `unknown death motion style: [ ${style} ]`, { style });
		}
		const duration = metadata.deathDurationFor(style);
		const character = jabsBattler.getCharacter();
		const declaration = new MotionDeclaration("collapse", [style, duration], BattlerMotionCoordinator.DEATH_SOURCE_KEY);
		CharacterMotionComposer.declare(character, BattlerMotionCoordinator.DEATH_SOURCE_KEY, [declaration]);
		return duration;
	}
	/**
	* Re-derives the state motions on the character the player is currently driving.
	*
	* `$gamePlayer` is a single character that stands in for whichever actor is leading, so a party
	* cycle hands the same character to somebody else without anything being declared or withdrawn.
	* Left alone, the outgoing leader's motions keep playing on the incoming one, and the withdrawal
	* that should have stopped them later resolves against a different character entirely and never
	* lands — so one cycle is enough to strand a motion for the rest of the session.
	*
	* Everything is torn down and rebuilt from the new leader's actual states rather than diffed,
	* because the thing that would know what to diff against is precisely what just changed.
	*/
	static refreshLeaderStateMotions() {
		const leader = $gameParty.leader();
		const character = BattlerMotionCoordinator.characterFor(leader);
		if (character === null) return;
		CharacterMotionComposer.removeDeclarationKind(character, "state");
		leader.states().forEach((state) => BattlerMotionCoordinator.applyStateMotions(leader, state.id), this);
	}
	/**
	* Reads every motion tag out of a database entry's note.
	*
	* A note is handed to the same parser an event page's comments go through, one line at a time.
	* That is not a convenience — it is the reason `<motion:[breathe]>` means exactly one thing
	* whether it was written on an event, a state, or anything added later.
	* @param {RPG_Base} databaseData The database entry whose note is being read.
	* @param {string} sourceKey Who is declaring these motions.
	* @returns {MotionDeclaration[]}
	*/
	static declarationsFromNote(databaseData, sourceKey) {
		const lines = databaseData.note.split(/\r?\n/);
		return MotionTagParser.parseComments(lines, sourceKey);
	}
	/**
	* Finds the map character a battler is riding around in, if it has one.
	* @param {Game_Battler} battler The battler to locate.
	* @returns {Game_Character|null} The character, or null when this battler is not on the map.
	*/
	static characterFor(battler) {
		const jabsBattler = JABS_AiManager.getBattlerByUuid(battler.getUuid());
		if (!jabsBattler) return null;
		return jabsBattler.getCharacter();
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/managers/LootMotionCoordinator.js
/**
* Connects a loot drop's remaining lifetime with what its sprite is doing about it.
*
* A drop that times out is removed from the map the instant its duration hits zero. Nothing leads
* into that, so from the player's side an item they were on their way to fetch is simply not there
* any more, at a moment they had no way to anticipate.
*
* The warning is a blink first and a dissolve second, and the order matters. A slow dim is
* something the eye adapts to rather than notices, and it also makes the drop progressively harder
* to see during exactly the window it most needs finding. A blink keeps the drop at full opacity
* half the time while being impossible to miss, which is why it is the conventional language for
* a despawning pickup. The dissolve then joins it for the closing stretch to say the blinking is
* nearly over.
*
* Collection is deliberately left alone. A collected drop arrives at the player and vanishes there,
* which is already a moment with an author - adding a dissolve after it would soften a beat that
* has earned being abrupt.
*
* `CharacterMotionComposer` and `MotionDeclaration` are reached as globals rather than imports:
* they ship in the J-Motion bundle, and importing across that boundary would bundle a second copy
* of each into this one.
*/
var LootMotionCoordinator = class LootMotionCoordinator {
	/**
	* The source key a loot drop's expiry blink is declared under.
	* @type {string}
	*/
	static WARN_SOURCE_KEY = "loot:expiry-warn";
	/**
	* The source key a loot drop's expiry dissolve is declared under.
	*
	* Kept separate from the blink rather than declared alongside it, because a source replacing its
	* own declarations tears down whatever it had running - so sharing one key would restart the
	* blink at the moment the dissolve joined it.
	* @type {string}
	*/
	static FADE_SOURCE_KEY = "loot:expiry-fade";
	/**
	* Keeps a loot sprite's expiry warning in step with how long the drop has left.
	*
	* Safe to call every frame. The composer treats a source re-declaring exactly what it already
	* declared as a no-op, so each stage is started once and then left to run rather than being
	* restarted into its opening frame over and over.
	* @param {Sprite_Character} sprite The sprite of the loot drop being checked.
	*/
	static syncExpiryWarning(sprite) {
		const character = sprite.character();
		const lootDrop = character.getJabsLoot();
		if (lootDrop.isWaiting() === false) {
			LootMotionCoordinator.withdrawExpiryWarning(character);
			return;
		}
		if (lootDrop.canExpire() === false) return;
		const remaining = lootDrop.duration();
		const metadata = J.MOTION.EXT.ABS.Metadata;
		if (remaining > metadata.lootExpiryWarnFrames) return;
		LootMotionCoordinator.declareExpiryFlicker(character, metadata.lootExpiryFlicker);
		if (remaining > metadata.lootExpiryFadeFrames) return;
		LootMotionCoordinator.declareExpiryFade(character, metadata.lootExpiryFadeFrames);
	}
	/**
	* Starts a drop blinking to announce that it is running out of time.
	* @param {Game_CharacterBase} character The loot character that should blink.
	* @param {{min: number, max: number, interval: number}} flicker The shape of the blink.
	*/
	static declareExpiryFlicker(character, flicker) {
		const { min, max, interval } = flicker;
		const declaration = new MotionDeclaration("flicker", [
			min,
			max,
			interval
		], LootMotionCoordinator.WARN_SOURCE_KEY);
		CharacterMotionComposer.declare(character, LootMotionCoordinator.WARN_SOURCE_KEY, [declaration]);
	}
	/**
	* Starts a drop dissolving over the frames it has left.
	* @param {Game_CharacterBase} character The loot character that should dissolve.
	* @param {number} fadeFrames How many frames the dissolve spans.
	*/
	static declareExpiryFade(character, fadeFrames) {
		const declaration = new MotionDeclaration("fade", [0, fadeFrames], LootMotionCoordinator.FADE_SOURCE_KEY);
		CharacterMotionComposer.declare(character, LootMotionCoordinator.FADE_SOURCE_KEY, [declaration]);
	}
	/**
	* Takes back everything the expiry warning had declared on a drop.
	* @param {Game_CharacterBase} character The loot character that is no longer doomed.
	*/
	static withdrawExpiryWarning(character) {
		CharacterMotionComposer.removeDeclarations(character, LootMotionCoordinator.WARN_SOURCE_KEY);
		CharacterMotionComposer.removeDeclarations(character, LootMotionCoordinator.FADE_SOURCE_KEY);
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/managers/PresenceMotionCoordinator.js
/**
* Gives a battler an entrance and an exit when its event's page brings it onto the map or takes it
* off again, rather than letting it blink into or out of existence.
*
* Arriving is the easy half. By the time anybody hears about a page change it has already happened,
* and the battler the new page brought simply unfolds into view. Leaving is the hard half, because
* the page change is itself what blanks the graphic: by the time a departure could be announced
* there is nothing left on screen to animate. So a departure holds the page change back instead.
* The battler keeps its page, folds away, and only then is the change let through. That hold is the
* only state this class keeps.
*
* Like {@link BattlerMotionCoordinator}, this translates what is happening to a battler into motion
* declarations, plus the battler's own respawn animation as the one flourish every coming and going
* shares, and draws nothing itself. How a fold looks is {@link FoldMotionEffect}'s business.
*/
var PresenceMotionCoordinator = class PresenceMotionCoordinator {
	/**
	* The source key arrivals and departures are both declared under.
	*
	* One key for both, because they are the two ends of one thing. An arrival declared over a
	* departure that is still folding replaces the fold outright rather than composing with it.
	* @type {string}
	*/
	static PRESENCE_SOURCE_KEY = "combat:presence";
	/**
	* The page index vanilla gives an event that has never been set up.
	*
	* An event only ever leaves this value while it is being built, which happens for every event on
	* a map at once as the map loads.
	* @type {number}
	*/
	static UNBUILT_PAGE_INDEX = -2;
	/**
	* Every event currently folding out of view, and what seeing its departure through will need.
	*
	* Kept here rather than on the event for the same reason J-Motion keeps motion off characters: a
	* departure is half a second of presentation, and a `WeakMap` gives it no field for a savefile to
	* find. Saving mid-fold simply loses the rest of the fold. The page change is still pending when
	* the save loads, so the next refresh starts a fresh one.
	* @type {WeakMap<Game_Event, Object>}
	*/
	static #departures = new WeakMap();
	/**
	* Determines whether an event is partway through folding out of view.
	* @param {Game_Event} event The event to check.
	* @returns {boolean}
	*/
	static isDeparting(event) {
		return PresenceMotionCoordinator.#departures.has(event);
	}
	/**
	* Holds back a page change that would take a live battler off the map, and starts it folding away.
	*
	* Every page change on an event holding a battler comes through here, whether the new page is
	* empty, a plain event, or another battler entirely. That last case matters. J-ABS rebuilds a
	* battler from scratch whenever its page changes, so a creature swapping for the one on its next
	* page is a new creature at full health, and it should look like one leaving and another arriving.
	* @param {Game_Event} event The event about to change page.
	* @returns {boolean} True when the change must wait for the fold to finish.
	*/
	static holdPageChange(event) {
		if (PresenceMotionCoordinator.isDeparting(event) === true) {
			return PresenceMotionCoordinator.#isReleasing(event) === false;
		}
		if (event.hasJabsBattler() === false) return false;
		const jabsBattler = event.getJabsBattler();
		if (PresenceMotionCoordinator.canDepart(jabsBattler) === false) return false;
		PresenceMotionCoordinator.beginDeparture(event, jabsBattler);
		return true;
	}
	/**
	* Determines whether a battler may fold out of view rather than vanish on the spot.
	* @param {JABS_Battler} jabsBattler The battler whose page is about to change.
	* @returns {boolean}
	*/
	static canDepart(jabsBattler) {
		if (J.MOTION.EXT.ABS.Metadata.departureDuration <= 0) return false;
		if (jabsBattler.isDying() === true) return false;
		if (jabsBattler.isDead() === true) return false;
		return true;
	}
	/**
	* Starts a battler folding out of view, and holds its page until it has finished.
	* @param {Game_Event} event The event whose page is being held.
	* @param {JABS_Battler} jabsBattler The battler that is leaving.
	*/
	static beginDeparture(event, jabsBattler) {
		const duration = J.MOTION.EXT.ABS.Metadata.departureDuration;
		const sourceKey = PresenceMotionCoordinator.PRESENCE_SOURCE_KEY;
		PresenceMotionCoordinator.#departures.set(event, {
			framesRemaining: duration,
			departingUuid: event.getJabsBattlerUuid(),
			wasInvincible: jabsBattler.isInvincible(),
			isReleasing: false
		});
		jabsBattler.setInvincible(true);
		jabsBattler.setWaitCountdown(duration);
		const declaration = new MotionDeclaration(FoldMotionEffect.FOLD, [duration], sourceKey);
		CharacterMotionComposer.declare(event, sourceKey, [declaration]);
		PresenceMotionCoordinator.#playPresenceAnimation(event);
	}
	/**
	* Counts a departure down by one frame, and lets its page change through once the fold is done.
	*
	* Reached from every event's update, the one per-frame heartbeat an event is guaranteed to have
	* while it is on the map. Nothing else would ever finish a departure: the refresh that started it
	* does not come round again on its own.
	* @param {Game_Event} event The event being updated.
	*/
	static updateDeparture(event) {
		if (PresenceMotionCoordinator.isDeparting(event) === false) return;
		const departure = PresenceMotionCoordinator.#departures.get(event);
		const framesRemaining = departure.framesRemaining - 1;
		if (framesRemaining > 0) {
			PresenceMotionCoordinator.#departures.set(event, {
				...departure,
				framesRemaining
			});
			return;
		}
		PresenceMotionCoordinator.completeDeparture(event, departure);
	}
	/**
	* Lets a finished departure's page change through, and settles whatever that leaves behind.
	*
	* The fold is withdrawn before the page moves rather than after. All of this happens inside one
	* update, before the sprite next draws, so nothing pops back into view in between. Whatever comes
	* next then starts from a clean slate: an empty page shows nothing, and a battler arriving in its
	* place begins its own unfold without a finished fold still claiming the sprite.
	* @param {Game_Event} event The event that has finished folding.
	* @param {Object} departure What was recorded when the departure began.
	*/
	static completeDeparture(event, departure) {
		CharacterMotionComposer.removeDeclarations(event, PresenceMotionCoordinator.PRESENCE_SOURCE_KEY);
		PresenceMotionCoordinator.#releasePage(event, departure);
		if (event.getJabsBattlerUuid() === departure.departingUuid) {
			PresenceMotionCoordinator.#returnFromDeparture(event, departure);
		}
	}
	/**
	* Lets the page change a departure was holding back go through.
	* @param {Game_Event} event The event whose page was held.
	* @param {Object} departure What was recorded when the departure began.
	*/
	static #releasePage(event, departure) {
		PresenceMotionCoordinator.#departures.set(event, {
			...departure,
			isReleasing: true
		});
		event.refresh();
		PresenceMotionCoordinator.#departures.delete(event);
	}
	/**
	* Determines whether a departure is in the middle of letting its own page change through.
	* @param {Game_Event} event The departing event.
	* @returns {boolean}
	*/
	static #isReleasing(event) {
		const departure = PresenceMotionCoordinator.#departures.get(event);
		return departure.isReleasing;
	}
	/**
	* Puts back a battler whose page came back before it had finished leaving.
	* @param {Game_Event} event The event that kept its page.
	* @param {Object} departure What was recorded when the departure began.
	*/
	static #returnFromDeparture(event, departure) {
		const jabsBattler = event.getJabsBattler();
		jabsBattler.setInvincible(departure.wasInvincible);
		PresenceMotionCoordinator.beginArrival(event);
	}
	/**
	* Unfolds a battler into view when a page change has just brought one onto the map.
	* @param {Game_Event} event The event that changed page.
	* @param {number} previousPageIndex The page it was on before the change.
	*/
	static welcomeArrival(event, previousPageIndex) {
		if (previousPageIndex === PresenceMotionCoordinator.UNBUILT_PAGE_INDEX) return;
		if (event.hasJabsBattler() === false) return;
		PresenceMotionCoordinator.beginArrival(event);
	}
	/**
	* Starts a battler unfolding into view with its respawn animation, as a page change brings it in.
	* @param {Game_Event} event The event whose battler is arriving.
	*/
	static beginArrival(event) {
		if (PresenceMotionCoordinator.#hasArrivals() === false) return;
		PresenceMotionCoordinator.#unfoldIntoView(event);
		PresenceMotionCoordinator.#playPresenceAnimation(event);
	}
	/**
	* Unfolds a battler that has just been created on the map, rather than one a page change revealed.
	*
	* Two things create a battler outright: a respawn, which rebuilds a defeated battler's event from
	* scratch, and the Spawn Enemy command, which clones one in. Both happen on a brand new event, whose
	* first page is set up as it is built and so never counts as an arrival on its own. Both also play
	* an animation of their own choosing already, which is why this adds only the unfold - a second
	* flourish on top would play the same stars twice.
	*
	* The new event has no sprite yet, and needs none: the unfold is declared against the event, and
	* simply starts on the first frame its sprite draws.
	* @param {Game_Event} event The event that was just created.
	*/
	static welcomeNewBattler(event) {
		if (PresenceMotionCoordinator.#hasArrivals() === false) return;
		if (event.hasJabsBattler() === false) return;
		PresenceMotionCoordinator.#unfoldIntoView(event);
	}
	/**
	* Determines whether arrivals are configured to take any time at all.
	* @returns {boolean}
	*/
	static #hasArrivals() {
		return J.MOTION.EXT.ABS.Metadata.arrivalDuration > 0;
	}
	/**
	* Turns a battler to face the player from edge-on, and keeps it from acting until it has.
	* @param {Game_Event} event The event whose battler is arriving.
	*/
	static #unfoldIntoView(event) {
		const duration = J.MOTION.EXT.ABS.Metadata.arrivalDuration;
		const sourceKey = PresenceMotionCoordinator.PRESENCE_SOURCE_KEY;
		const jabsBattler = event.getJabsBattler();
		jabsBattler.setWaitCountdown(duration);
		const declaration = new MotionDeclaration(FoldMotionEffect.UNFOLD, [duration], sourceKey);
		CharacterMotionComposer.declare(event, sourceKey, [declaration], duration);
	}
	/**
	* Plays a battler's respawn animation on its event, as a fold into or out of existence begins.
	*
	* The very same animation a battler comes back from the dead with, resolved by J-ABS's own ladder,
	* so a creature appearing at the start of its hours, leaving at the end of them, and respawning after
	* a death all share one flourish. An event or enemy that asks for animation 0 gets none of it, here or
	* on a respawn.
	*
	* Unlike a respawn this needs no delay before asking: a respawned event is built fresh and has no
	* sprite until the next spriteset update, but an event changing page has had its sprite all along.
	* @param {Game_Event} event The event whose battler is arriving or leaving.
	*/
	static #playPresenceAnimation(event) {
		const animationId = event.respawnAnimationId();
		if (animationId === 0) return;
		event.requestAnimation(animationId);
	}
};

//#endregion
//#region src/plugins/motion/ext/abs/objects/Game_Battler.js
/**
* Extends {@link #addState}.<br/>
* Declares whatever motions the newly-applied state asks for.
*/
J.MOTION.EXT.ABS.Aliased.Game_Battler.set("addState", Game_Battler.prototype.addState);
Game_Battler.prototype.addState = function(stateId, attacker, sourceSkill = null) {
	J.MOTION.EXT.ABS.Aliased.Game_Battler.get("addState").call(this, stateId, attacker, sourceSkill);
	BattlerMotionCoordinator.applyStateMotions(this, stateId);
};
/**
* Extends {@link #removeState}.<br/>
* Withdraws whatever motions the departing state had asked for.
*/
J.MOTION.EXT.ABS.Aliased.Game_Battler.set("removeState", Game_Battler.prototype.removeState);
Game_Battler.prototype.removeState = function(stateId) {
	J.MOTION.EXT.ABS.Aliased.Game_Battler.get("removeState").call(this, stateId);
	BattlerMotionCoordinator.removeStateMotions(this, stateId);
};

//#endregion
//#region src/plugins/motion/ext/abs/objects/Game_Event.js
/**
* Extends {@link #deferPageChange}.<br/>
* Also holds a live battler's page back long enough for it to fold out of view.
*
* Without this a battler whose page stops applying - a time window closing, a switch turning off -
* vanishes on the frame the page changes, because that change is what blanks its graphic. Holding
* the change back is the only way to give it anything to animate on the way out.
*/
J.MOTION.EXT.ABS.Aliased.Game_Event.set("deferPageChange", Game_Event.prototype.deferPageChange);
Game_Event.prototype.deferPageChange = function(newPageIndex) {
	const deferred = J.MOTION.EXT.ABS.Aliased.Game_Event.get("deferPageChange").call(this, newPageIndex);
	if (deferred === true) return true;
	return PresenceMotionCoordinator.holdPageChange(this);
};
/**
* Extends {@link #onPageChanged}.<br/>
* Also unfolds whatever battler the new page brought onto the map.
*/
J.MOTION.EXT.ABS.Aliased.Game_Event.set("onPageChanged", Game_Event.prototype.onPageChanged);
Game_Event.prototype.onPageChanged = function(previousPageIndex) {
	J.MOTION.EXT.ABS.Aliased.Game_Event.get("onPageChanged").call(this, previousPageIndex);
	PresenceMotionCoordinator.welcomeArrival(this, previousPageIndex);
};
/**
* Extends {@link #update}.<br/>
* Also counts down a departure, and lets its held page change through once the fold is done.
*/
J.MOTION.EXT.ABS.Aliased.Game_Event.set("update", Game_Event.prototype.update);
Game_Event.prototype.update = function() {
	J.MOTION.EXT.ABS.Aliased.Game_Event.get("update").call(this);
	PresenceMotionCoordinator.updateDeparture(this);
};

//#endregion
//#region src/plugins/motion/ext/abs/managers/JABS_Engine.js
/**
* Extends {@link #handleDefeatedEnemy}.<br/>
* Gives the enemy a death worth watching before it leaves the map.
*
* The engine's own defeat handling is untouched. It still clears followers, plays the collapse
* sound, fires the enemy's death event actions, grants rewards and drops loot, and marks the
* battler dying — all of which happens first, so gold and drops appear while the body is still
* coming apart rather than after it has finished.
*
* What changes is only the last step. A dying battler destroys itself on the next update, and that
* update already declines to run while the battler is waiting, so declaring the collapse and then
* setting a wait for exactly its duration holds the corpse on screen for precisely as long as the
* animation needs and not one frame longer. Nothing in J-ABS had to learn what a motion is.
*/
J.MOTION.EXT.ABS.Aliased.JABS_Engine.set("handleDefeatedEnemy", JABS_Engine.prototype.handleDefeatedEnemy);
JABS_Engine.prototype.handleDefeatedEnemy = function(defeatedTarget, caster) {
	J.MOTION.EXT.ABS.Aliased.JABS_Engine.get("handleDefeatedEnemy").call(this, defeatedTarget, caster);
	this.beginDeathMotion(defeatedTarget);
};
/**
* Starts a defeated battler's collapse and holds it on the map long enough to be seen.
* @param {JABS_Battler} defeatedTarget The battler that was defeated.
*/
JABS_Engine.prototype.beginDeathMotion = function(defeatedTarget) {
	const duration = BattlerMotionCoordinator.beginDeath(defeatedTarget);
	if (duration <= 0) return;
	defeatedTarget.setWaitCountdown(duration);
};
/**
* Extends {@link #postPartyCycling}.<br/>
* Moves the state motions over to whoever is leading now.
*
* By the time this runs the swap is complete — `handlePartyCycleMemberChanges` has already rotated
* the party and rebuilt the player battler — so the leader this reads is the new one.
*/
J.MOTION.EXT.ABS.Aliased.JABS_Engine.set("postPartyCycling", JABS_Engine.prototype.postPartyCycling);
JABS_Engine.prototype.postPartyCycling = function() {
	J.MOTION.EXT.ABS.Aliased.JABS_Engine.get("postPartyCycling").call(this);
	BattlerMotionCoordinator.refreshLeaderStateMotions();
};
/**
* Extends {@link #processRespawnAnimation}.<br/>
* Also unfolds the returning battler into view, the same way a battler its page brings in does.
*
* J-ABS still plays the respawn animation itself, a beat later once the new sprite exists. This only
* adds the unfold beneath it, so a creature returning from the dead and one appearing at the start
* of its hours look like one thing.
*/
J.MOTION.EXT.ABS.Aliased.JABS_Engine.set("processRespawnAnimation", JABS_Engine.prototype.processRespawnAnimation);
JABS_Engine.prototype.processRespawnAnimation = function(freshEvent) {
	J.MOTION.EXT.ABS.Aliased.JABS_Engine.get("processRespawnAnimation").call(this, freshEvent);
	PresenceMotionCoordinator.welcomeNewBattler(freshEvent);
};
/**
* Extends {@link #addEnemyToMap}.<br/>
* Also unfolds an enemy spawned onto the map into view.
*
* The Spawn Enemy command plays whatever animation it was given on its own, so like a respawn this
* only adds the unfold, and a spawned wave arrives the same way everything else does.
*/
J.MOTION.EXT.ABS.Aliased.JABS_Engine.set("addEnemyToMap", JABS_Engine.prototype.addEnemyToMap);
JABS_Engine.prototype.addEnemyToMap = function(x, y, enemyCloneEventId) {
	const addedEnemy = J.MOTION.EXT.ABS.Aliased.JABS_Engine.get("addEnemyToMap").call(this, x, y, enemyCloneEventId);
	if (addedEnemy === undefined) return addedEnemy;
	PresenceMotionCoordinator.welcomeNewBattler(addedEnemy);
	return addedEnemy;
};

//#endregion
//#region src/plugins/motion/ext/abs/sprites/Sprite_Character.js
/**
* Extends {@link #handleLootDuration}.<br/>
* Gives a loot drop a visible ending rather than letting it blink out.
*
* J-ABS's own duration handling is untouched: it still counts the drop down and still removes it
* the moment it runs out. What changes is only that the closing stretch of that countdown is now
* something the player can see, which is what makes a missed drop a thing that was lost rather
* than a thing that was never there.
*
* Hooked here because this is already the per-frame heartbeat of a live loot drop, so nothing new
* has to be polled and nothing in J-ABS had to learn what a motion is.
*/
J.MOTION.EXT.ABS.Aliased.Sprite_Character.set("handleLootDuration", Sprite_Character.prototype.handleLootDuration);
Sprite_Character.prototype.handleLootDuration = function() {
	J.MOTION.EXT.ABS.Aliased.Sprite_Character.get("handleLootDuration").call(this);
	LootMotionCoordinator.syncExpiryWarning(this);
};

//#endregion
//# sourceMappingURL=J-Motion-ABS.js.map