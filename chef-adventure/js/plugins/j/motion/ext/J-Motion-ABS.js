//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOTION-ABS] Combat-driven motion: state effects and death animations.
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
 * Two things live here, and both exist because a battler and a character are
 * different objects that only J-ABS holds together at the same time:
 *
 * - STATES can declare motions. A bleeding creature pulses, an elite swells.
 * - DEATHS are animated. Enemies collapse instead of vanishing mid-frame.
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
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/motion/ext/abs/_metadata/_pluginMetadata.js
/**
* The metadata for J-Motion-ABS.
*
* Death pacing is read from the same external config J-Motion core uses, under its own `death`
* section. Keeping it there rather than in plugin parameters means the speed at which everything in
* the game dies is one file a designer can open, which is the sort of thing that gets retuned by
* feel rather than by reasoning.
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
	* Extends {@link #postInitialize}.<br>
	* Reads the death pacing out of the shared motion configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeDeathMetadata();
	}
	/**
	* Reads how long each death style lasts, and which one everything gets by default.
	*/
	initializeDeathMetadata() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Motion-ABS").configName("motion configuration").build();
		const parsedConfiguration = ExternalJsonConfigLoader.load(J_MOTION_ABS_PluginMetadata.CONFIG_PATH, options);
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
	const requiredJabsVersion = "4.16.0";
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
J.MOTION.EXT.ABS.Metadata = new J_MOTION_ABS_PluginMetadata("J-Motion-ABS", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MOTION.EXT.ABS.Aliased = {};
J.MOTION.EXT.ABS.Aliased.Game_Battler = new Map();
J.MOTION.EXT.ABS.Aliased.JABS_Engine = new Map();
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

//#endregion
//# sourceMappingURL=J-Motion-ABS.js.map