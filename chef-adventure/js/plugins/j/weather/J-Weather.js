//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 WEATHER] Named ambience and weather, declared per map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin draws the ambience of a place: rain, drifting snow, leaves on
 * the wind, embers over a lava flow, motes of light in a dark passage.
 *
 * None of those are separate features. Every one is the same emitter carrying
 * a different picture along a different path, which is why adding a new look
 * is a data edit rather than a code change.
 *
 * Integrates with others of my plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Weather-Time; lets the sky change over the course of a day.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A map's weather is a property of THAT MAP. It is resolved fresh on arrival
 * and never carries in from wherever the player came from.
 *
 * That matters more than it sounds. Weather that carried across a transfer
 * would make a connecting corridor look different depending on which end you
 * walked in from, and every room next to an unusual one would have to re-assert
 * normality on the way out. Resolving per map means neither is ever a problem.
 *
 * ============================================================================
 * DECLARING A MAP'S WEATHER:
 * Add to a MAP's note box:
 *
 * TAG FORMAT:
 *  <weather:PRESET>
 *
 * TAG EXAMPLES:
 *  <weather:rain>
 *   This place is rainy.
 *
 *  <weather:motes>
 *   Faint drifting lights, as in a deep passage.
 *
 * The preset names an entry in data/config.weather.json. It says nothing about
 * how hard it is coming down, because that is not a property of the place- the
 * Deluge Plains are rainy at every hour of every day, and only the amount
 * moves. That belongs to the sky, and the sky belongs to J-Weather-Time.
 *
 * On a map with no sky overhead, an authored look still draws- a cave full of
 * drifting motes is not weatherless- and simply sits at its middle strength.
 *
 * ----------------------------------------------------------------------------
 * WHAT A MAP WITH NO TAG DOES:
 * It asks the sky.
 *
 * An outdoor map that says nothing gets whatever the weather currently is,
 * which is what stops a connecting corridor between two rainy fields being the
 * one dry spot in the region. An indoor map that says nothing gets nothing,
 * because there is no sky for it to ask.
 *
 * Indoor and outdoor is read from <noToneChange>, the same tag J-TIME already
 * uses to keep a cave from changing colour at dusk. "Can you see the sky from
 * here" is one question, and asking it twice would eventually get two answers.
 *
 * ============================================================================
 * OPTING OUT ENTIRELY:
 * Add to a MAP's note box:
 *
 * TAG FORMAT:
 *  <noWeather>
 *
 * Nothing falls here, whatever the sky is doing.
 *
 * This is deliberately rare. An ordinary interior already draws nothing without
 * being told, so it needs no tag at all. This exists for the narrower case of
 * somewhere that genuinely has sky overhead and still should not be rained on:
 * a covered market, a colonnade, a courtyard under a canopy.
 *
 * It outranks everything, including a <weather:> tag on the same map.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//#region src/plugins/weather/core/_metadata/_pluginMetadata.js
/**
* The metadata for J-Weather.
*
* Every look this plugin can draw lives in an external config rather than in plugin parameters,
* because retuning what rain looks like is a data edit that should not require opening the plugin
* manager or rebuilding anything. It is also the kind of thing that gets tuned in dozens of small
* passes, and a plugin parameter is a miserable place to do that from.
*/
var J_WEATHER_PluginMetadata = class J_WEATHER_PluginMetadata extends PluginMetadata {
	/**
	* The path where the config for weather presets is located.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.weather.json";
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
	* Loads the weather presets from external configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeWeatherPresets();
	}
	/**
	* Reads every motion and every preset out of the external config.
	*
	* The whole file is kept rather than picked apart, because a preset is resolved against the
	* motions in the same breath it is looked up - handing the two around separately would mean every
	* caller carrying both and eventually one of them carrying a mismatched pair.
	*/
	initializeWeatherPresets() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Weather").configName("weather configuration").build();
		const parsedConfiguration = ExternalJsonConfigLoader.load(J_WEATHER_PluginMetadata.CONFIG_PATH, options);
		/**
		* Every look this game knows how to draw, and the motions they are built from.
		* @type {{motions: Object, presets: Object, variables: Object}}
		*/
		this.weatherConfig = parsedConfiguration;
	}
};

//#endregion
//#region src/plugins/weather/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.18.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.WEATHER = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.WEATHER.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.WEATHER.Metadata = new J_WEATHER_PluginMetadata("J-Weather", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.WEATHER.Aliased = {};
J.WEATHER.Aliased.Game_Map = new Map();
J.WEATHER.Aliased.Scene_Map = new Map();
J.WEATHER.Aliased.Spriteset_Map = new Map();
/**
* All regular expressions used by this plugin.
*/
J.WEATHER.RegExp = {};
/**
* The look a map has, named rather than described.
*
* <pre>
* Structure:
*  <weather:PRESET>
*
* Example:
*  <weather:rain>
*
* Translation:
*  This place is rainy, at whatever strength the sky is currently at.
* </pre>
*
* The tag names a preset out of `config.weather.json` and says nothing about how hard it is coming
* down, because that is not a property of the place - it is what the sky is doing today. The Deluge
* Plains are rainy at midnight and rainy at noon; only the amount moves.
*
* A map's note is the right home for this because a map has no pages, so there is no page comment
* for it to live in instead.
* @type {RegExp}
*/
J.WEATHER.RegExp.Weather = /<weather:[ ]?([a-zA-Z][a-zA-Z0-9_-]*)>/i;
/**
* Opts a map out of weather entirely.
*
* <pre>
* Structure:
*  <noWeather>
*
* Example:
*  <noWeather>
*
* Translation:
*  Nothing falls here, whatever the sky is doing.
* </pre>
*
* **Rarely needed, and that is by design.** A map that says nothing at all already gets nothing when
* it has no sky, so an ordinary interior does not reach for this. It exists for the narrower case of
* somewhere that *does* have sky overhead and still should not be rained on - a covered market, a
* colonnade, a courtyard with a canopy.
* @type {RegExp}
*/
J.WEATHER.RegExp.NoWeather = /<noWeather>/i;

//#endregion
//#region src/plugins/weather/core/core/WeatherMotion.js
/**
* The arithmetic that moves one particle of ambience across the screen.
*
* Every ambient effect in the game - rain, drifting snow, leaves on the wind, embers over a lava
* flow, motes of light in a dreaming forest - is the same handful of numbers with different values
* in them. There is no "rain" here and no "snow" here, and that is deliberate: the moment a motion
* knows what it is depicting, adding a new look means adding a new code path, and the plugin grows
* a branch per mood. A falling motion pointed at a raindrop is rain; pointed at a leaf it is autumn.
*
* **Randomness is handed in rather than drawn here.** Every method below is a pure function of its
* arguments, which is what lets a test assert an exact position instead of a range. The caller draws
* four numbers in 0..1 and passes them; a thousand particles a frame make that the caller's
* bookkeeping anyway.
*
* Everything is in screen pixels. A particle does not know where it is on the map, and does not need
* to - ambience is weather over a camera, not weather over terrain.
*/
var WeatherMotion = class WeatherMotion {
	/**
	* The edges a particle may enter the screen from.
	*
	* `Leading` is the interesting one: it resolves to whichever edge the player is walking toward, so
	* moving through a snowfall throws snow at the face rather than the back of the head. It is the
	* cheapest trick in ambience and the one most responsible for it reading as weather rather than as
	* decoration drifting past.
	* @type {{Top: string, Left: string, Right: string, Bottom: string, Leading: string}}
	*/
	static Edges = {
		Top: "top",
		Left: "left",
		Right: "right",
		Bottom: "bottom",
		Leading: "leading",
		Anywhere: "anywhere"
	};
	/**
	* How far beyond each edge a particle spawns and is retired when its motion does not say.
	*
	* Spawning exactly on the boundary pops a particle into existence in full view of the player, so
	* the margin has to clear *half the drawn sprite* - a particle is anchored at its centre, and
	* anything closer in than that has part of itself on screen at the moment it appears.
	*
	* Which is why this is a per-motion number rather than one shared constant. A raindrop is 18
	* pixels wide and a fog bank is nearly a thousand; a margin generous enough for the second wastes
	* most of the first's lifetime off-screen, and one sized for the first makes the second blink in
	* and out at the edges.
	* @type {number}
	*/
	static DefaultMargin = 256;
	/**
	* One complete cycle of a wander, in radians.
	*
	* A particle's phase is rolled as a fraction of a turn rather than as an angle, so that the roll
	* handed in stays an ordinary 0..1 like every other and nothing outside this file has to know
	* that the wander is a sine underneath.
	* @type {number}
	*/
	static FullTurn = Math.PI * 2;
	/**
	* Builds a particle at the moment it enters the screen.
	*
	* The particle is a plain object rather than a class instance on purpose. A thousand of these are
	* advanced every frame, and this repo's accessor rules would otherwise put two function calls in
	* front of every field read in the hot loop - for a bag of numbers that no other file is allowed
	* to touch.
	* @param {object} params The motion parameters this particle is born from.
	* @param {{width: number, height: number}} bounds The screen the particle crosses.
	* @param {string} edge The resolved heading edge; never {@link WeatherMotion.Edges.Leading}.
	* @param {{along: number, across: number, speedX: number, speedY: number, scale: number,
	* stagger: number, edge: number, phase: number}} rolls Eight rolls, each 0..1.
	* @returns {object} The newborn particle.
	*/
	static spawn(params, bounds, edge, rolls) {
		const speedX = params.speedX + params.jitterX * rolls.speedX;
		const speedY = params.speedY + params.jitterY * rolls.speedY;
		const velocityX = WeatherMotion.orientedForEdge(speedX, edge, WeatherMotion.Edges.Left, WeatherMotion.Edges.Right);
		const velocityY = WeatherMotion.orientedForEdge(speedY, edge, WeatherMotion.Edges.Top, WeatherMotion.Edges.Bottom);
		const entry = WeatherMotion.entryEdgeFor(params, bounds, edge, rolls.edge);
		const origin = WeatherMotion.originOn(entry, bounds, rolls, WeatherMotion.marginOf(params), params);
		return {
			x: origin.x,
			y: origin.y,
			velocityX,
			velocityY,
			rotation: WeatherMotion.angleFor(params, rolls.tilt),
			scaleX: WeatherMotion.stretchedSize(params, rolls, rolls.stretchX),
			scaleY: WeatherMotion.stretchedSize(params, rolls, rolls.stretchY),
			opacity: 0,
			phase: rolls.phase * WeatherMotion.FullTurn,
			age: 0,
			flipPhase: WeatherMotion.flipPhaseFor(params, rolls.flip),
			pulsePhase: WeatherMotion.pulsePhaseFor(params, rolls.pulse),
			stage: 0,
			life: WeatherMotion.lifespanFor(params, rolls.life),
			stagger: Math.floor(params.staggerFrames * rolls.stagger),
			done: false
		};
	}
	/**
	* Whether every particle of a population has finished for good.
	*
	* Asked of a retiring layer, once per frame, to find out whether it can be thrown away. A layer
	* empties at the pace its own motion travels, so this is a slow yes for some of them: rain and
	* leaves clear in seconds, and fog crawls at a third of a pixel a frame through a queue over a
	* thousand deep and takes a minute or two.
	* @param {object[]} particles The population being asked about.
	* @returns {boolean}
	*/
	static isDrained(particles) {
		return particles.every((particle) => particle.done === true);
	}
	/**
	* Points one axis of a velocity inward from the edge the particle entered by.
	*
	* Magnitude is whatever the motion asked for; only the sign is decided here. An edge on the other
	* axis leaves the value alone, so a raindrop entering from the left still falls downward at the
	* speed it was built to fall at - it simply also drifts to the right while doing it.
	*
	* This is what makes `leading` mean something. Walking east into a snowfall puts the snow in front
	* of you coming toward you, because the edge you are walking toward is the edge it enters from and
	* inward is the only direction it can then go.
	* @param {number} speed The magnitude this axis was built for.
	* @param {string} edge The edge being entered from.
	* @param {string} lowEdge The edge at the low end of this axis.
	* @param {string} highEdge The edge at the high end of this axis.
	* @returns {number}
	*/
	static orientedForEdge(speed, edge, lowEdge, highEdge) {
		if (edge === lowEdge) return Math.abs(speed);
		if (edge === highEdge) return -Math.abs(speed);
		return speed;
	}
	/**
	* How far beyond the screen a motion begins and ends.
	*
	* A motion that says nothing gets the default, which suits everything the size of a raindrop or a
	* leaf. Anything drawn large enough to be visible from further out than that says so.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static marginOf(params) {
		if (params.margin === undefined) return WeatherMotion.DefaultMargin;
		return params.margin;
	}
	/**
	* Where on the screen a particle entering from a given edge begins.
	*
	* The two axes are asymmetric on purpose. The axis the particle travels along starts a full margin
	* outside the screen, while the axis it spreads across is distributed over the screen plus a margin
	* at each end - otherwise a particle drifting diagonally would never appear in the corner it was
	* heading for.
	* @param {string} edge The edge being entered from.
	* @param {{width: number, height: number}} bounds The screen the particle crosses.
	* @param {{along: number, across: number}} rolls Where along the edge, and how far back to queue.
	* @param {number} margin How far beyond the edge to begin.
	* @param {object} params The motion parameters, for how deep its entry queue runs.
	* @returns {{x: number, y: number}}
	*/
	static originOn(edge, bounds, rolls, margin, params) {
		const spreadX = rolls.along * (bounds.width + margin * 2) - margin;
		const spreadY = rolls.along * (bounds.height + margin * 2) - margin;
		if (edge === WeatherMotion.Edges.Anywhere) {
			return {
				x: rolls.along * bounds.width,
				y: rolls.across * bounds.height
			};
		}
		const depth = rolls.across * WeatherMotion.entryDepthOf(params);
		if (edge === WeatherMotion.Edges.Top) return {
			x: spreadX,
			y: -margin - depth
		};
		if (edge === WeatherMotion.Edges.Bottom) return {
			x: spreadX,
			y: bounds.height + margin + depth
		};
		if (edge === WeatherMotion.Edges.Left) return {
			x: -margin - depth,
			y: spreadY
		};
		return {
			x: bounds.width + margin + depth,
			y: spreadY
		};
	}
	/**
	* How far back along its travel a particle may queue before entering.
	*
	* None by default, which suits anything numerous enough that the clumping is invisible - a
	* thousand raindrops re-entering at one coordinate still look like rain. It matters for anything
	* sparse and slow, where the population is small enough that its shape is the effect.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static entryDepthOf(params) {
		if (params.entryDepth === undefined) return 0;
		return params.entryDepth;
	}
	/**
	* How far a particle wanders to either side of its heading, in pixels.
	*
	* None by default, because most weather genuinely does travel in a straight line - rain that
	* weaved would read as broken rather than as lively. It is the ember, the firefly and the bubble
	* that look wrong going straight, and they say so.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static swayOf(params) {
		if (params.sway === undefined) return 0;
		return params.sway;
	}
	/**
	* How fast a particle works through its wander, in radians per frame.
	*
	* Paired with {@link WeatherMotion.swayOf} rather than folded into it, because the two say
	* genuinely different things: how far it strays, and how leisurely it does so. A wide slow
	* wander is a bubble, a narrow fast one is a spark, and one number could not be both.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static swayRateOf(params) {
		if (params.swayRate === undefined) return 0;
		return params.swayRate;
	}
	/**
	* How far a particle may be turned from upright when it is born, as a fraction of a full turn.
	*
	* None by default, because most weather has an up. A raindrop rotated at random is not a
	* raindrop, and a leaf is drawn already lying the way leaves lie.
	*
	* It is everything for anything whose shape is arbitrary - a cloud, a fog bank, a splash of
	* light. One at a time they look fine; a screen of them all facing the same way looks like one
	* sprite pasted over and over, which is exactly what it is.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static tiltOf(params) {
		if (params.tilt === undefined) return 0;
		return params.tilt;
	}
	/**
	* Rebuilds a particle as the thing it turns into, where the old one finished.
	*
	* **This is the one place a particle stops being a closed loop.** Everywhere else a population is
	* fixed and self-replacing: a particle leaves, and the same particle comes back at an edge as
	* itself. A stage is the exception - a shooting star that burns out leaves a sparkle behind it, a
	* raindrop that lands leaves a splash, and in both cases the second thing is a different picture
	* with a different motion that happens to begin exactly where the first one ended.
	*
	* Which is the whole trick: the successor is spawned normally, by all the usual arithmetic, and
	* then simply *moved* to where its predecessor died. Nothing else in the model has to know that
	* stages exist.
	* @param {object} particle The particle whose life has just ended.
	* @param {object} params The successor's motion parameters.
	* @param {{width: number, height: number}} bounds The screen it will live on.
	* @param {object} rolls Fresh rolls for the thing being born.
	* @returns {object} The successor, standing where its predecessor fell.
	*/
	static succeed(particle, params, bounds, rolls) {
		const born = WeatherMotion.spawn(params, bounds, WeatherMotion.Edges.Anywhere, rolls);
		born.x = particle.x;
		born.y = particle.y;
		born.stagger = 0;
		born.stage = particle.stage + 1;
		return born;
	}
	/**
	* How much of its speed a particle sheds each frame, as a fraction.
	*
	* None by default: weather falls at terminal velocity, and rain that slowed down on the way past
	* would read as broken.
	*
	* It is for the things that are *spending* something. A shooting star is burning up, so it should
	* be losing speed while it loses brightness - arriving at the end of its life still travelling
	* at full pelt is what makes it read as being switched off rather than as burning out.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static dragOf(params) {
		if (params.drag === undefined) return 0;
		return params.drag;
	}
	/**
	* How deeply a particle dims as it pulses, as a fraction of its brightness.
	*
	* Steady by default, which is what a raindrop and a cloud shadow and a petal all are.
	*
	* It exists for the things that are *lights* rather than things being lit - a firefly is defined
	* by blinking, and a field of them glowing steadily is a field of fairy lights on a wire. One is
	* a full blackout, which reads as a hard on-off switch; anything short of that keeps the insect
	* faintly visible between blinks, so the eye can follow one across the dark instead of losing it
	* and finding a different one.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static pulseOf(params) {
		if (params.pulse === undefined) return 0;
		return params.pulse;
	}
	/**
	* How fast a particle works through its pulse, in radians per frame.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static pulseRateOf(params) {
		if (params.pulseRate === undefined) return 0;
		return params.pulseRate;
	}
	/**
	* Where in its pulse a newborn particle begins.
	*
	* Zero for anything steady, and random for anything that blinks - a population sharing a phase
	* blinks in unison, which is a lighthouse rather than a meadow.
	* @param {object} params The motion parameters.
	* @param {number} roll One roll, 0..1.
	* @returns {number}
	*/
	static pulsePhaseFor(params, roll) {
		if (WeatherMotion.pulseOf(params) === 0) return 0;
		return roll * WeatherMotion.FullTurn;
	}
	/**
	* How brightly a particle is drawn right now, accounting for where it is in its pulse.
	*
	* Applied at draw time rather than written back onto the particle, because the stored opacity is
	* where the fade-in and the dying fade both live - folding a pulse into it would have a blink
	* permanently darken a firefly that happened to blink while it was still arriving.
	* @param {object} particle The particle being drawn.
	* @param {object} params The motion parameters it was born from.
	* @returns {number}
	*/
	static glowFor(particle, params) {
		const depth = WeatherMotion.pulseOf(params);
		if (depth === 0) return particle.opacity;
		const dip = (1 - Math.cos(particle.pulsePhase)) / 2;
		return particle.opacity * (1 - depth * dip);
	}
	/**
	* How fast a particle turns over, in radians per frame.
	*
	* Still by default. This is not {@link WeatherMotion.angleFor}'s rotation and not the `roll` that
	* spins a sprite in the picture plane - both of those turn a shape like a wheel, keeping its face
	* toward the player the whole way round. A falling petal or leaf does something else: it turns
	* over, going edge-on and vanishing to a line before opening out the other way.
	*
	* In two dimensions that is a cosine on the horizontal scale, passing through zero and out the
	* far side - where a negative scale draws the picture mirrored, which is exactly what the back of
	* a petal looks like. So the whole effect costs one number and one cosine.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static flipOf(params) {
		if (params.flip === undefined) return 0;
		return params.flip;
	}
	/**
	* Where in its tumble a newborn particle begins.
	*
	* Zero for anything that does not turn over, because the drawn width is scaled by the cosine of
	* this and a still particle must be scaled by exactly one. Anything that does turn over starts
	* somewhere random, or a whole population goes edge-on at the same instant and the screen blinks.
	* @param {object} params The motion parameters.
	* @param {number} roll One roll, 0..1.
	* @returns {number}
	*/
	static flipPhaseFor(params, roll) {
		if (WeatherMotion.flipOf(params) === 0) return 0;
		return roll * WeatherMotion.FullTurn;
	}
	/**
	* How wide a particle is drawn right now, accounting for how far it has turned over.
	* @param {object} particle The particle being drawn.
	* @returns {number}
	*/
	static facingScaleX(particle) {
		return particle.scaleX * Math.cos(particle.flipPhase);
	}
	/**
	* The angle the whole population shares, as a fraction of a full turn.
	*
	* Upright by default. It exists for anything with a *source* - shafts of light all come from the
	* same sun, so they all lean the same way, and one leaning differently is not variety, it is a
	* mistake. That is the opposite of a cloud, which has no correct angle and wants every angle.
	*
	* Paired with {@link WeatherMotion.tiltOf} rather than replacing it: lean is where the population
	* points and tilt is how loosely it agrees, so a few degrees of tilt over a fixed lean reads as
	* light through moving leaves rather than as a rack of identical bars.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static leanOf(params) {
		if (params.lean === undefined) return 0;
		return params.lean;
	}
	/**
	* Which way up one newborn particle faces.
	* @param {object} params The motion parameters.
	* @param {number} tiltRoll The roll deciding this particle's departure from the shared angle.
	* @returns {number} The rotation, in radians.
	*/
	static angleFor(params, tiltRoll) {
		const shared = WeatherMotion.leanOf(params);
		const departure = WeatherMotion.tiltOf(params) * tiltRoll;
		return (shared + departure) * WeatherMotion.FullTurn;
	}
	/**
	* How far a particle's two axes may be scaled apart, as a fraction of its size.
	*
	* None by default, so a picture keeps its proportions - which anything recognisable needs. A
	* stretched raindrop is a smear and a squashed leaf is a bug report.
	*
	* Shapes with no correct proportions want it badly. Stretching is what turns one cloud into a
	* dozen different clouds, and it costs nothing but a roll.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static stretchOf(params) {
		if (params.stretch === undefined) return 0;
		return params.stretch;
	}
	/**
	* The size of one axis of a newborn particle.
	*
	* The layer's own size and jitter decide how big it is; the stretch decides how far this one
	* axis departs from that. Handed the axis roll separately so that both axes share a size and
	* differ only in how they are pulled from it - rolling the size twice instead would let a
	* particle be small on one axis and large on the other for two unrelated reasons.
	* @param {object} params The motion parameters.
	* @param {object} rolls The rolls this particle was born with.
	* @param {number} axisRoll The roll deciding this axis, 0..1.
	* @returns {number}
	*/
	static stretchedSize(params, rolls, axisRoll) {
		const size = params.scale + params.scaleJitter * rolls.scale;
		const stretch = WeatherMotion.stretchOf(params);
		return size * (1 + (axisRoll * 2 - 1) * stretch);
	}
	/**
	* The strongest a particle of this layer ever draws, as an opacity out of 255.
	*
	* Full strength by default, which is what almost everything wants - a raindrop is a raindrop.
	* It matters for anything meant to *shade* rather than to be seen: a cloud shadow drawn at full
	* strength does not darken the ground, it replaces it, and reads as a cloud floating over the
	* world rather than as a shadow lying on it. The difference between the two is entirely whether
	* you can still see what is underneath.
	* @param {object} params The layer parameters.
	* @returns {number}
	*/
	static peakOf(params) {
		if (params.peakOpacity === undefined) return 255;
		return params.peakOpacity;
	}
	/**
	* How many frames a particle of this motion lives before it is reborn.
	*
	* **None by default, meaning a particle lives until it leaves the screen.** That is the right
	* answer for anything travelling *through* a place - rain crosses and is gone, and giving it a
	* lifetime would only make it wink out mid-fall.
	*
	* It is the wrong answer for anything that happens *in* a place. A wisp rising off dark water or
	* a bubble climbing to the surface has somewhere to stop, and a model that only retires particles
	* at the screen edge cannot express one - the best it can do is send them all the way up and off,
	* which reads as a draught rather than as something local.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static lifeOf(params) {
		if (params.life === undefined) return 0;
		return params.life;
	}
	/**
	* How many frames of life a particle may be granted on top of the base, at random.
	*
	* None by default, which suits anything whose lifetime is the effect itself - a ripple lasts as
	* long as a ripple lasts.
	*
	* It matters enormously for anything whose death has a *position*. Rain that all lived exactly
	* the same number of frames would all land at the same depth, and a screen of it reads as a
	* waterline across the middle of the world with dry ground beneath. Spreading the lifetime
	* spreads where they land, which is the only thing that makes falling rain cover a screen.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static lifeJitterOf(params) {
		if (params.lifeJitter === undefined) return 0;
		return params.lifeJitter;
	}
	/**
	* How long one particular particle gets to live.
	*
	* Rolled once at birth and carried on the particle, exactly like its speed and its size - a
	* lifetime is a property of the individual rather than of the motion, for any motion that cares
	* where its particles end up.
	* @param {object} params The motion parameters.
	* @param {number} roll One roll, 0..1.
	* @returns {number} The lifespan in frames, or zero for a particle that never expires.
	*/
	static lifespanFor(params, roll) {
		const base = WeatherMotion.lifeOf(params);
		if (base === 0) return 0;
		return base + WeatherMotion.lifeJitterOf(params) * roll;
	}
	/**
	* How much opacity a dying particle sheds each frame.
	*
	* Separate from {@link WeatherMotion.lifeOf} because the two answer different questions - how
	* long it lasts, and how abruptly it goes. A bubble reaching the surface should be quick enough
	* to read as a pop; a wisp guttering out should take almost as long to leave as it took to
	* arrive.
	* @param {object} params The motion parameters.
	* @returns {number}
	*/
	static fadeOutOf(params) {
		if (params.fadeOut === undefined) return 0;
		return params.fadeOut;
	}
	/**
	* Whether a particle is close enough to the end of its life to be on the way out.
	*
	* Measured as "is there still time to fade from here" rather than against a fixed share of the
	* lifetime, so the fade always finishes exactly as the particle expires. Sized the other way -
	* as a percentage of life - a slow fade on a short-lived particle would still be half-lit when
	* it vanished, which is the blink the fade exists to avoid.
	* @param {object} particle The particle being tested.
	* @param {object} params The motion parameters it was born from.
	* @returns {boolean}
	*/
	static isDying(particle, params) {
		const { life } = particle;
		if (life === 0) return false;
		const fadeOut = WeatherMotion.fadeOutOf(params);
		if (fadeOut === 0) return false;
		const remaining = life - particle.age;
		return remaining * fadeOut <= particle.opacity;
	}
	/**
	* How brightly a particle should be drawn once the weather has been running a while.
	*
	* **A mortal particle already knows.** Settling advances it through its own lifetime, fading it
	* in and out exactly as it will fade in play, so by the end of that its opacity is the honest
	* answer for how old it happens to be. Overwriting it lights the whole population at once, and a
	* map whose weather breathes then opens with every shaft of it blazing in unison before drifting
	* apart over the next few seconds - which is the arrival looking wrong in the one moment the
	* settling exists to get right.
	*
	* Everything else is simply on. A raindrop spawns invisible and fades in so that one respawned
	* near the screen does not blink, but a settled population has long since finished doing that.
	* @param {object} particle The particle being settled.
	* @param {object} params The motion parameters it was born from.
	* @returns {number}
	*/
	static settledOpacityFor(particle, params) {
		if (particle.life > 0) return particle.opacity;
		return WeatherMotion.peakOf(params);
	}
	/**
	* Whether a particle has lived out its lifetime and should be reborn.
	* @param {object} particle The particle being tested.
	* @param {object} params The motion parameters it was born from.
	* @returns {boolean}
	*/
	static hasExpired(particle) {
		if (particle.life === 0) return false;
		return particle.age >= particle.life;
	}
	/**
	* Nudges a particle sideways along its wander.
	*
	* **Across the heading, never along it.** A particle that swayed forwards and backwards would
	* speed up and slow down rather than wander, which reads as stuttering. So the wander is applied
	* to whichever axis the motion does *not* mainly travel on: embers climbing weave left and right,
	* motes blowing sideways bob up and down.
	*
	* The displacement is taken as the difference between two points on the sine rather than from its
	* derivative, which costs a second call and buys an `sway` that means exactly what it says - the
	* furthest a particle ever strays from the line it would otherwise have travelled. A knob whose
	* number is a real distance is one an author can set once and predict.
	* @param {object} particle The particle being moved.
	* @param {object} params The motion parameters it was born from.
	*/
	static applySway(particle, params) {
		const sway = WeatherMotion.swayOf(params);
		if (sway === 0) return;
		const before = Math.sin(particle.phase);
		particle.phase += WeatherMotion.swayRateOf(params);
		const offset = sway * (Math.sin(particle.phase) - before);
		if (Math.abs(params.speedX) >= Math.abs(params.speedY)) {
			particle.y += offset;
			return;
		}
		particle.x += offset;
	}
	/**
	* Resolves which edge a particle should enter from this spawn.
	*
	* A motion that names a fixed edge always gets it. `Leading` is resolved against the direction the
	* player is actually travelling, and falls back to the motion's own downhill direction when they
	* are standing still - because a stationary player in a snowfall should still have snow coming from
	* somewhere, and "wherever it falls" is the only honest answer.
	* @param {object} params The motion parameters.
	* @param {{x: number, y: number}} travel How far the player moved this frame, per axis.
	* @returns {string} One of {@link WeatherMotion.Edges}, never `Leading`.
	*/
	static resolveEdge(params, travel) {
		if (params.edge !== WeatherMotion.Edges.Leading) return params.edge;
		const preferred = WeatherMotion.travelEdgeFor(travel);
		if (preferred === String.empty) return WeatherMotion.restingEdgeFor(params);
		return preferred;
	}
	/**
	* The edge the player is currently walking toward.
	*
	* The axis the player is committing to more strongly wins, so walking diagonally still picks one
	* edge rather than flickering between two.
	* @param {{x: number, y: number}} travel How far the player moved this frame, per axis.
	* @returns {string} One of the four edges, or {@link String.empty} while standing still.
	*/
	static travelEdgeFor(travel) {
		if (Math.abs(travel.x) > Math.abs(travel.y)) {
			return travel.x > 0 ? WeatherMotion.Edges.Right : WeatherMotion.Edges.Left;
		}
		if (travel.y !== 0) {
			return travel.y > 0 ? WeatherMotion.Edges.Bottom : WeatherMotion.Edges.Top;
		}
		return String.empty;
	}
	/**
	* Which edge one particle actually comes in through.
	*
	* **A motion travelling diagonally has two upstream edges, not one.** Everything drifting down and
	* to the right arrives either from the left or from the top, and a population drawn entirely from
	* one of them leaves a permanent hole in the opposite corner - nothing entering on the left can
	* ever reach the top right, because it would have had to begin a screen and a half above the
	* world. That hole does not fill in over time and does not look like a bug; it looks like weather
	* that only happens on one half of the map.
	*
	* So the two are shared between, in proportion to how much weather each actually delivers. That
	* is **flux** - the speed through an edge times the length of the edge - rather than speed alone,
	* because a slow drift across a wide screen brings in more than a brisk one down a short side.
	* Weighting by speed alone gets this backwards on any screen that is not square, and leaves the
	* seam visible as a band of extra density along the favoured edge.
	*
	* Read from the authored speeds rather than a particle's jittered ones: the question is what
	* proportion the motion is *for*, and rolling it per particle would only add noise to a ratio.
	* @param {object} params The motion parameters.
	* @param {{width: number, height: number}} bounds The screen being crossed.
	* @param {string} edge The resolved heading edge, which orients the motion.
	* @param {number} roll One roll, 0 inclusive to 1 exclusive as `Math.random` produces it,
	* choosing between the upstream edges.
	* @returns {string} The edge this particle enters through.
	*/
	static entryEdgeFor(params, bounds, edge, roll) {
		if (edge === WeatherMotion.Edges.Anywhere) return edge;
		const headingX = WeatherMotion.orientedForEdge(params.speedX, edge, WeatherMotion.Edges.Left, WeatherMotion.Edges.Right);
		const headingY = WeatherMotion.orientedForEdge(params.speedY, edge, WeatherMotion.Edges.Top, WeatherMotion.Edges.Bottom);
		const horizontal = headingX > 0 ? WeatherMotion.Edges.Left : WeatherMotion.Edges.Right;
		const vertical = headingY > 0 ? WeatherMotion.Edges.Top : WeatherMotion.Edges.Bottom;
		const horizontalFlux = Math.abs(headingX) * bounds.height;
		const verticalFlux = Math.abs(headingY) * bounds.width;
		if (horizontalFlux === 0 && verticalFlux === 0) return edge;
		return roll * (horizontalFlux + verticalFlux) < horizontalFlux ? horizontal : vertical;
	}
	/**
	* The edge a motion draws from when nobody is moving.
	*
	* Chosen as the side the particle travels *away* from, so it still crosses the screen rather than
	* spawning at its own destination and retiring immediately.
	* @param {object} params The motion parameters.
	* @returns {string}
	*/
	static restingEdgeFor(params) {
		if (Math.abs(params.speedX) > Math.abs(params.speedY)) {
			return params.speedX > 0 ? WeatherMotion.Edges.Left : WeatherMotion.Edges.Right;
		}
		return params.speedY >= 0 ? WeatherMotion.Edges.Top : WeatherMotion.Edges.Bottom;
	}
	/**
	* Moves a particle on by one frame, in place.
	*
	* Mutating rather than returning a fresh particle is a deliberate concession to the hot loop: this
	* runs up to a thousand times a frame, and allocating a thousand short-lived objects sixty times a
	* second is how a plugin starts costing frames. It stays testable because the particle is an
	* ordinary object - hand one in, assert its fields afterward.
	* @param {object} particle The particle to advance.
	* @param {object} params The motion parameters it was born from.
	*/
	static advance(particle, params) {
		if (particle.stagger > 0) {
			particle.stagger -= 1;
			return;
		}
		particle.age += 1;
		particle.x += particle.velocityX;
		particle.y += particle.velocityY;
		const remaining = 1 - WeatherMotion.dragOf(params);
		particle.velocityX *= remaining;
		particle.velocityY *= remaining;
		particle.rotation += params.roll;
		particle.flipPhase += WeatherMotion.flipOf(params);
		particle.pulsePhase += WeatherMotion.pulseRateOf(params);
		particle.scaleX += params.growth;
		particle.scaleY += params.growth;
		WeatherMotion.applySway(particle, params);
		if (WeatherMotion.isDying(particle, params) === true) {
			particle.opacity = Math.max(particle.opacity - WeatherMotion.fadeOutOf(params), 0);
			return;
		}
		particle.opacity = Math.min(particle.opacity + params.fadeIn, WeatherMotion.peakOf(params));
	}
	/**
	* Determines whether a particle has left the screen and should be reborn.
	*
	* The same margin the particle spawned outside of is used to retire it, so a motion that enters
	* from the top and leaves at the bottom travels exactly the distance it was built to travel.
	* @param {object} particle The particle to test.
	* @param {{width: number, height: number}} bounds The screen the particle crosses.
	* @param {object} params The motion parameters it was born from.
	* @returns {boolean}
	*/
	static hasEscaped(particle, bounds, params) {
		const margin = WeatherMotion.marginOf(params) + WeatherMotion.entryDepthOf(params);
		if (particle.x < -margin) return true;
		if (particle.x > bounds.width + margin) return true;
		if (particle.y < -margin) return true;
		return particle.y > bounds.height + margin;
	}
};

//#endregion
//#region src/plugins/weather/core/core/WeatherPresets.js
/**
* Turns the name of a look into the layers that draw it.
*
* An author writes `<weather:rain>` on a map and means something specific and visual; they do not
* mean "a falling motion pointed at Rain_01A at density 450 and speed 170." Both are true, but only
* one of them is worth typing, and only one of them survives being retuned later. This class is the
* seam between the two - the tag names a preset, the preset names its layers, and the numbers live
* in `data/config.weather.json` where changing them is a data edit rather than a rebuild.
*
* **A preset carries its own intensity ladder rather than a single look.** That is not a convenience:
* it is how the whole system stays honest about identity. The Negative Peaks are snowy at every
* intensity the sky can produce, so there is no roll that makes them not snowy - only rolls that
* make the snow lighter or heavier. A preset with three stops cannot express "and sometimes clear,"
* which is exactly the property wanted.
*
* The ladder also mirrors how these looks were authored in the first place. Fog was tuned by hand as
* three configurations identical but for their density; snow as one layer, then two, then four.
*/
var WeatherPresets = class WeatherPresets {
	/**
	* The rungs of every preset's intensity ladder.
	*
	* Three rather than a continuous scale, because the sky rolls between discrete conditions and
	* because three is what an author can actually hold in their head while tuning. The transition
	* between them is smoothed at the emitter, so the player never sees a step.
	* @type {{Light: string, Moderate: string, Heavy: string}}
	*/
	static Intensities = {
		Light: "light",
		Moderate: "moderate",
		Heavy: "heavy"
	};
	/**
	* How a layer's authored `speed` and `scale` are read.
	*
	* Both are percentages, because that is the unit they were authored in and the unit an author
	* thinks in - "half as fast", "four times the size". A layer that says nothing about either gets
	* the motion exactly as configured.
	* @type {number}
	*/
	static PercentBase = 100;
	/**
	* A fully opaque particle, in the units the renderer draws with.
	* @type {number}
	*/
	static FullOpacity = 255;
	/**
	* The tint that leaves a picture exactly as it was painted.
	* @type {number}
	*/
	static NoTint = 16777215;
	/**
	* The layers that draw a named look at a given intensity.
	*
	* An unknown preset is a content error rather than a contract violation - an author mistyped a tag
	* that the regex was perfectly happy to match - so it is reported and answered with an empty set.
	* The map simply has no ambience, which is a visible and diagnosable outcome rather than a crash
	* during someone's playthrough.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {string} presetName The look being asked for, ex: `rain`.
	* @param {string} intensity One of {@link WeatherPresets.Intensities}.
	* @returns {object[]} Emitter-ready layers, or an empty array.
	*/
	static layersFor(config, presetName, intensity) {
		const preset = config.presets[presetName];
		if (preset === undefined) {
			Diagnostics.warn("J-Weather", `no weather preset named: [ ${presetName} ]!`, { known: Object.keys(config.presets) });
			return [];
		}
		const stop = preset.stops[intensity];
		if (stop === undefined) {
			Diagnostics.warn("J-Weather", `preset [ ${presetName} ] has no intensity: [ ${intensity} ]!`, { known: Object.keys(preset.stops) });
			return [];
		}
		return stop.map((layer) => WeatherPresets.resolveLayer(config, layer));
	}
	/**
	* Folds one authored layer together with the motion it names.
	*
	* The motion supplies the shape of the movement and the layer supplies how much of it, which is
	* what keeps a motion reusable: `float` is the same wandering drift whether it is carrying motes of
	* spirit-light through a passage or snow down a mountain, and the two differ by numbers rather than
	* by code.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {object} layer One authored layer of a preset stop.
	* @returns {object} A layer the emitter can build particles from.
	*/
	static resolveLayer(config, layer) {
		const resolved = WeatherPresets.resolveStage(config, layer);
		resolved.becomes = WeatherPresets.successorFor(config, layer);
		return resolved;
	}
	/**
	* Folds one authored layer together with its motion, without following it anywhere.
	*
	* Split out from {@link WeatherPresets.resolveLayer} so that resolving a successor cannot
	* resolve a successor, which is the whole of the cycle protection.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {object} layer One authored layer, or one authored stage of one.
	* @returns {object} A layer the emitter can build particles from, with no successor attached.
	*/
	static resolveStage(config, layer) {
		const motion = config.motions[layer.motion];
		if (motion === undefined) {
			Diagnostics.warn("J-Weather", `no weather motion named: [ ${layer.motion} ]!`, { known: Object.keys(config.motions) });
			return WeatherPresets.inertLayer(layer);
		}
		const rate = layer.speed / WeatherPresets.PercentBase;
		return {
			edge: motion.edge,
			speedX: motion.speedX * rate,
			speedY: motion.speedY * rate,
			jitterX: motion.jitterX * rate,
			jitterY: motion.jitterY * rate,
			roll: motion.roll,
			growth: motion.growth,
			fadeIn: motion.fadeIn,
			staggerFrames: motion.staggerFrames,
			margin: motion.margin,
			entryDepth: motion.entryDepth,
			sway: motion.sway,
			swayRate: WeatherMotion.swayRateOf(motion) * rate,
			life: motion.life,
			lifeJitter: motion.lifeJitter,
			fadeOut: motion.fadeOut,
			drag: motion.drag,
			tilt: motion.tilt,
			stretch: motion.stretch,
			lean: motion.lean,
			flip: motion.flip,
			pulse: motion.pulse,
			pulseRate: WeatherMotion.pulseRateOf(motion) * rate,
			scale: layer.scale / WeatherPresets.PercentBase,
			scaleJitter: WeatherPresets.jitterOf(layer) / WeatherPresets.PercentBase,
			peakOpacity: WeatherPresets.opacityOf(layer),
			tint: WeatherPresets.tintOf(layer),
			asset: layer.asset,
			density: layer.density,
			blend: layer.blend,
			becomes: null
		};
	}
	/**
	* Resolves what a layer's particles turn into at the end of their lives.
	*
	* **One stage deep, deliberately.** A successor's own successor is ignored, which makes a cycle
	* impossible to author by accident and keeps the resolved layer a finite thing rather than a
	* chain somebody has to follow. Two stages is a raindrop and its splash, or a shooting star and
	* the spark it leaves; nothing worth drawing has needed a third.
	*
	* A stage inherits the layer's own speed and blend, because it is the same effect continuing -
	* only its picture, its size and its motion change.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {object} layer One authored layer of a preset stop.
	* @returns {?object} The successor as a resolved layer, or null when there is none.
	*/
	static successorFor(config, layer) {
		const motion = config.motions[layer.motion];
		if (motion === undefined) return null;
		if (motion.becomes === undefined) return null;
		const staged = {
			motion: motion.becomes,
			asset: layer.becomesAsset,
			density: layer.density,
			speed: layer.speed,
			scale: WeatherPresets.stageScaleOf(layer),
			scaleJitter: layer.becomesScaleJitter,
			opacity: layer.becomesOpacity,
			tint: layer.becomesTint,
			blend: layer.blend
		};
		return WeatherPresets.resolveStage(config, staged);
	}
	/**
	* How big a layer's successor draws, as a percentage.
	*
	* Falls back to the layer's own size rather than to a hundred, because a stage that said nothing
	* about its size most likely meant "the same as the thing it came from".
	* @param {object} layer One authored layer of a preset stop.
	* @returns {number}
	*/
	static stageScaleOf(layer) {
		if (layer.becomesScale === undefined) return layer.scale;
		return layer.becomesScale;
	}
	/**
	* How much a layer's particles vary in size, as a percentage.
	*
	* A layer that says nothing gets none, which suits anything whose picture is already the size it
	* should be. Anything drawn as a *field* rather than as objects wants some: a hundred identical
	* clouds read as a repeated sprite no matter how they are arranged, and the eye finds the
	* repetition faster than it finds the fog.
	* @param {object} layer One authored layer of a preset stop.
	* @returns {number}
	*/
	static jitterOf(layer) {
		if (layer.scaleJitter === undefined) return 0;
		return layer.scaleJitter;
	}
	/**
	* The colour a layer multiplies its picture by, as the renderer own packed integer.
	*
	* Untinted by default, which draws the asset exactly as it was painted. It matters because an
	* asset carries one colour and a preset may need several - the same light shaft is warm at noon
	* and cold under a moon, and repainting it twice is two files to keep in step rather than one
	* number in a config.
	*
	* Authored as a CSS-style hex string, because that is what an artist has in their clipboard.
	* @param {object} layer One authored layer of a preset stop.
	* @returns {number}
	*/
	static tintOf(layer) {
		if (layer.tint === undefined) return WeatherPresets.NoTint;
		const digits = layer.tint.replace("#", "");
		return parseInt(digits, 16);
	}
	/**
	* How strongly a layer draws at its fullest, as an opacity out of 255.
	*
	* Authored as a percentage because that is how the rest of a layer is authored, and because
	* "this layer draws at thirty percent" is a sentence somebody tuning a config can hold in their
	* head where "at seventy-six" is not. A layer that says nothing draws at full strength.
	* @param {object} layer One authored layer of a preset stop.
	* @returns {number}
	*/
	static opacityOf(layer) {
		if (layer.opacity === undefined) return WeatherPresets.FullOpacity;
		const share = layer.opacity / WeatherPresets.PercentBase;
		return Math.round(WeatherPresets.FullOpacity * share);
	}
	/**
	* A layer that draws nothing, for a layer naming a motion that does not exist.
	*
	* Zero density rather than an absent layer, so the shape the emitter receives is the same shape it
	* always receives and the failure stays where it was reported rather than surfacing later as a
	* different-looking bug somewhere downstream.
	* @param {object} layer The authored layer that could not be resolved.
	* @returns {object}
	*/
	static inertLayer(layer) {
		return {
			edge: "top",
			speedX: 0,
			speedY: 0,
			jitterX: 0,
			jitterY: 0,
			roll: 0,
			growth: 0,
			fadeIn: 0,
			staggerFrames: 0,
			scale: 1,
			scaleJitter: 0,
			asset: layer.asset,
			density: 0,
			blend: layer.blend
		};
	}
	/**
	* Every look this configuration knows how to draw.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @returns {string[]}
	*/
	static names(config) {
		return Object.keys(config.presets);
	}
};

//#endregion
//#region src/plugins/weather/core/core/MapWeatherResolver.js
/**
* Decides what a given map's weather actually is.
*
* Every map answers the same question in one of four ways, and the whole design rests on the fourth
* one being *automatic* rather than *empty*:
*
* | The note says | What happens |
* |---|---|
* | `<noWeather>` | nothing, whatever the sky is doing |
* | `<weather:motes>` | that look |
* | nothing, and there is no sky | nothing |
* | nothing, and there is sky | whatever the sky is doing |
*
* **Nothing here inherits from anywhere.** A map's weather is a property of that map, resolved fresh
* on arrival, so it can never depend on the route the player took to get there. That is worth saying
* out loud because the obvious alternative - letting weather carry across a transfer - reads as
* simpler and is not: it makes a connecting corridor look different depending on which end you came
* in from, and it forces every room next to an unusual one to re-assert normality on the way out.
*
* Strength is deliberately not a property of a place either. The Deluge Plains are rainy at every
* hour of every day; only how hard it is coming down moves, and that belongs to the sky.
*/
var MapWeatherResolver = class MapWeatherResolver {
	/**
	* The strength an authored look runs at where the sky cannot be seen.
	*
	* A cave's drifting motes have no business getting heavier because it happens to be overcast
	* outside. Somewhere sheltered, an authored look simply sits at its middle rung and stays there.
	* @type {string}
	*/
	static ShelteredIntensity = WeatherPresets.Intensities.Moderate;
	/**
	* Resolves the look and strength a map should be drawn with.
	* @param {{suppressed: boolean, preset: ?string, hasSky: boolean}} declaration What the map said.
	* @param {?{preset: string, intensity: string}} sky What the sky is doing, or null when nothing
	* is driving one - which is the ordinary state of this plugin running without its time extension.
	* @returns {?{preset: string, intensity: string}} What to draw, or null to draw nothing.
	*/
	static resolve(declaration, sky) {
		if (declaration.suppressed === true) return null;
		if (declaration.preset !== null) {
			return {
				preset: declaration.preset,
				intensity: MapWeatherResolver.intensityFor(declaration, sky)
			};
		}
		if (declaration.hasSky === false) return null;
		if (sky === null) return null;
		return {
			preset: sky.preset,
			intensity: sky.intensity
		};
	}
	/**
	* How strongly an authored look runs.
	* @param {{suppressed: boolean, preset: ?string, hasSky: boolean}} declaration What the map said.
	* @param {?{preset: string, intensity: string}} sky What the sky is doing, or null.
	* @returns {string} One of {@link WeatherPresets.Intensities}.
	*/
	static intensityFor(declaration, sky) {
		if (declaration.hasSky === true && sky !== null) return sky.intensity;
		return MapWeatherResolver.ShelteredIntensity;
	}
	/**
	* Reads what a map's note box has to say about its weather.
	*
	* Sky visibility is read from `noToneChange` rather than from a tag of this plugin's own, because
	* "can you see the sky from here" is one question and two plugins need the answer. Asking it twice
	* guarantees two answers that eventually disagree, and the map that disagrees will be the one
	* nobody looks at for a year.
	* @param {rm.types.Map} dataMap The map being arrived at.
	* @returns {{suppressed: boolean, preset: ?string, hasSky: boolean}}
	*/
	static declarationFor(dataMap) {
		const suppressed = RPGManager.checkForBooleanFromNoteByRegex(dataMap, J.WEATHER.RegExp.NoWeather);
		const preset = RPGManager.getStringFromNoteByRegex(dataMap, J.WEATHER.RegExp.Weather, true);
		const hasSky = Boolean(dataMap.meta["noToneChange"]) === false;
		return {
			suppressed,
			preset,
			hasSky
		};
	}
};

//#endregion
//#region src/plugins/weather/core/core/WeatherVariables.js
/**
* Mirrors the current weather into game variables, so an event can ask about it.
*
* Two numbers: what the weather is, and how hard it is going. Both are zero when there is no weather
* at all, which makes `variable > 0` the honest way to ask "is anything happening" without an event
* author needing to know what any particular number means.
*
* **The mirror is one-way and the variables are never read back as truth.** They exist so a
* conditional branch can fire - kappas in the rain, a merchant who packs up in a storm - and nothing
* in this plugin consults them. An author who edits one by hand changes what their own events see and
* changes nothing about the sky, which is the only relationship between the two that stays honest
* when somebody inevitably does exactly that.
*
* **Ids are declared in configuration rather than derived from position.** A positional scheme would
* renumber every preset after any insertion, and every conditional branch already written against the
* old numbers would quietly start meaning something else - the worst kind of breakage, because
* nothing errors and the game just behaves wrong somewhere nobody is looking.
*/
var WeatherVariables = class WeatherVariables {
	/**
	* The value written when nothing is happening.
	*
	* Zero rather than an absent write, because a variable that merely stops being updated keeps
	* whatever it last held - so walking out of the rain into a cave would leave every "is it raining"
	* branch in the game still answering yes.
	* @type {number}
	*/
	static None = 0;
	/**
	* The pair of numbers describing a resolved weather.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {?{preset: string, intensity: string}} resolution What the map resolved to, or null.
	* @returns {{weatherType: number, weatherIntensity: number}}
	*/
	static idsFor(config, resolution) {
		if (resolution === null) {
			return {
				weatherType: WeatherVariables.None,
				weatherIntensity: WeatherVariables.None
			};
		}
		return {
			weatherType: WeatherVariables.typeIdFor(config, resolution.preset),
			weatherIntensity: WeatherVariables.intensityIdFor(config, resolution.intensity)
		};
	}
	/**
	* The declared id of a named look.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {string} presetName The look being numbered.
	* @returns {number} Its declared id, or zero when it was never given one.
	*/
	static typeIdFor(config, presetName) {
		const declared = config.presetIds[presetName];
		if (declared === undefined) {
			Diagnostics.warn("J-Weather", `weather preset has no declared id: [ ${presetName} ]!`, { declared: Object.keys(config.presetIds) });
			return WeatherVariables.None;
		}
		return declared;
	}
	/**
	* The declared id of a strength.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {string} intensity The rung being numbered.
	* @returns {number} Its declared id, or zero when it was never given one.
	*/
	static intensityIdFor(config, intensity) {
		const declared = config.intensityIds[intensity];
		if (declared === undefined) {
			Diagnostics.warn("J-Weather", `weather intensity has no declared id: [ ${intensity} ]!`, { declared: Object.keys(config.intensityIds) });
			return WeatherVariables.None;
		}
		return declared;
	}
	/**
	* Writes the current weather into the variables events read.
	*
	* Silent when the mirror is switched off, which is how a game that does not branch on weather
	* avoids having two of its variables quietly commandeered.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {?{preset: string, intensity: string}} resolution What the map resolved to, or null.
	*/
	static sync(config, resolution) {
		const { variables } = config;
		if (variables.enabled === false) return;
		const ids = WeatherVariables.idsFor(config, resolution);
		$gameVariables.setValue(variables.weatherType, ids.weatherType);
		$gameVariables.setValue(variables.weatherIntensity, ids.weatherIntensity);
	}
};

//#endregion
//#region src/plugins/weather/core/core/WeatherAudio.js
/**
* What a given weather sounds like, and how loudly.
*
* Only some weather makes a noise, and that is authored rather than assumed: rain and wind do, snow
* does only once it is a whiteout being driven by wind, and fog does not make a sound at all. A
* preset with no `sounds` block is simply silent, which is the correct answer for most of them.
*
* **The volume arithmetic lives here rather than at the buffer**, because getting it wrong is an
* infuriating and very shippable bug: weather runs on a channel of its own, so a volume that ignored
* the player's own BGS setting would let them turn the sound off in Options and still have rain
* hissing at them for the rest of the game.
*/
var WeatherAudio = class WeatherAudio {
	/**
	* How the engine folds two percentages into the zero-to-one a buffer wants.
	*
	* Copied from `AudioManager.updateBufferParameters` rather than invented, because weather sitting
	* at a different loudness than everything else for the same slider position is exactly the sort of
	* thing nobody can quite put their finger on.
	* @type {number}
	*/
	static VolumeDivisor = 1e4;
	/**
	* The sound a given weather makes.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {?{preset: string, intensity: string}} resolution What the map resolved to, or null.
	* @returns {?{name: string, volume: number, pitch: number}} What to play, or null for silence.
	*/
	static soundFor(config, resolution) {
		if (resolution === null) return null;
		const preset = config.presets[resolution.preset];
		if (preset === undefined) return null;
		if (preset.sounds === undefined) return null;
		const sound = preset.sounds[resolution.intensity];
		if (sound === undefined) return null;
		return sound;
	}
	/**
	* The volume a buffer should actually be set to, once the player's own setting is folded in.
	* @param {number} configuredVolume How loud this sound is authored to be, 0 through 100.
	* @param {number} playerVolume The player's BGS setting, 0 through 100.
	* @returns {number} A volume between 0 and 1.
	*/
	static bufferVolume(configuredVolume, playerVolume) {
		return playerVolume * configuredVolume / WeatherAudio.VolumeDivisor;
	}
	/**
	* Determines whether two sounds are the same one, playing the same way.
	*
	* Used to decide whether a change of weather is a change of *sound*. Rain easing from moderate to
	* light is a different volume of the same recording as far as the config is concerned but a
	* different file here, while walking between two maps that are both lightly raining is neither -
	* and restarting the loop for that second case would put an audible hitch in the rain every time
	* the player crossed a boundary.
	* @param {?{name: string, volume: number, pitch: number}} a One sound, or null.
	* @param {?{name: string, volume: number, pitch: number}} b Another sound, or null.
	* @returns {boolean}
	*/
	static matches(a, b) {
		if (a === null && b === null) return true;
		if (a === null || b === null) return false;
		return a.name === b.name && a.volume === b.volume && a.pitch === b.pitch;
	}
};

//#endregion
//#region src/plugins/weather/core/core/PlayerTravel.js
/**
* How far the player moved across the last frame, measured rather than inferred.
*
* Weather asks this so that walking into a snowfall throws snow at the face rather than past the
* back of the head. The obvious place to read it from is the engine's own pair of coordinates -
* `_x` is the tile a character is heading for and `_realX` is where the sprite has got to, so the
* gap between them is the direction of travel and closes the instant they stop.
*
* **That gap does not exist under pixel movement.** A plugin that moves characters in continuous
* space writes the two together on every frame of movement, so they are always identical and the
* inferred travel is permanently zero. Weather reading it concludes the player is standing still
* forever, and the whole effect quietly turns itself off with nothing to show that it has.
*
* So the measurement is taken the one way that cannot be argued with: remember where the player was
* last frame and subtract. That is a true velocity under either movement model, it needs to know
* nothing about which one is installed, and it costs two numbers.
*/
var PlayerTravel = class {
	/**
	* Whether a previous position has been recorded to measure against.
	*
	* The first sample of a run has nothing to subtract from, and guessing zero is not the same as
	* knowing it - without this, the first frame after a teleport reports the whole jump as one
	* frame of travel, which is a sprint in whichever direction the player happened to land.
	* @type {boolean}
	*/
	#tracking = false;
	/**
	* Where the player was when last sampled.
	* @type {number}
	*/
	#lastX = 0;
	/**
	* Where the player was when last sampled.
	* @type {number}
	*/
	#lastY = 0;
	/**
	* How far the player moved on the most recent sample.
	* @type {number}
	*/
	#movedX = 0;
	/**
	* How far the player moved on the most recent sample.
	* @type {number}
	*/
	#movedY = 0;
	/**
	* Records where the player is now, and works out how far that is from last time.
	* @param {number} x Where the player is now, horizontally.
	* @param {number} y Where the player is now, vertically.
	*/
	sample(x, y) {
		if (this.#tracking === false) {
			this.#beginAt(x, y);
			return;
		}
		this.#movedX = x - this.#lastX;
		this.#movedY = y - this.#lastY;
		this.#lastX = x;
		this.#lastY = y;
	}
	/**
	* Starts measuring afresh from wherever the player currently is.
	* @param {number} x Where the player is now, horizontally.
	* @param {number} y Where the player is now, vertically.
	*/
	#beginAt(x, y) {
		this.#tracking = true;
		this.#lastX = x;
		this.#lastY = y;
		this.#movedX = 0;
		this.#movedY = 0;
	}
	/**
	* How far the player moved on the most recent sample, per axis.
	*
	* A fresh object each time rather than a shared one, because the caller is at liberty to hold on
	* to it and a shared object would change under them on the next frame.
	* @returns {{x: number, y: number}}
	*/
	perFrame() {
		return {
			x: this.#movedX,
			y: this.#movedY
		};
	}
	/**
	* Forgets where the player was, so the next sample measures from there instead.
	*
	* Called when the player arrives somewhere rather than walks somewhere. A transfer moves them an
	* arbitrary distance in no time at all, and a difference taken across that is not a speed.
	*/
	forget() {
		this.#tracking = false;
		this.#movedX = 0;
		this.#movedY = 0;
	}
};

//#endregion
//#region src/plugins/weather/core/managers/ImageManager.js
/**
* Loads a weather particle's picture.
*
* `img/weather/` is where RPG Maker's own rain and snow have always lived, so an ambient particle
* goes in beside them rather than inventing a folder. It also means the sixty-odd pictures that ship
* with a weather plugin are already in the right place for this one.
* @param {string} filename The name of the picture, without its extension.
* @returns {Bitmap}
*/
ImageManager.loadWeather = function(filename) {
	return this.loadBitmap("img/weather/", filename);
};

//#endregion
//#region src/plugins/weather/core/managers/WeatherAudioChannel.js
/**
* A looping audio channel of the plugin's own, so weather can be heard over whatever else is.
*
* RPG Maker keeps exactly one background sound - `AudioManager._bgsBuffer` - and playing anything
* through it stops whatever was already there. That is why a river and a rainstorm have never been
* able to coexist: not an engine limitation, just a single field.
*
* `AudioManager.createBuffer` hands back an ordinary `WebAudio`, and nothing stops this plugin
* holding one of its own. So it does, and a map keeps its river while the weather rains on top of it.
*
* **What is bought with that is bookkeeping.** `AudioManager` will not stop, retune or clean up a
* buffer it has never heard of, so every one of those becomes this class's job - including the one
* that matters most, which is honouring the player's BGS slider. A channel that ignored it would let
* somebody turn the sound off in Options and still be rained on.
*/
var WeatherAudioChannel = class WeatherAudioChannel {
	/**
	* How long a sound takes to arrive or leave, in seconds.
	*
	* Weather does not start; it is already going when you walk outside. A fade is what turns a loop
	* beginning into a door opening.
	* @type {number}
	*/
	static FadeSeconds = 2;
	/**
	* The buffer currently playing, or null when nothing is.
	* @type {?WebAudio}
	*/
	static #buffer = null;
	/**
	* The sound that buffer was started for, or null when nothing is playing.
	* @type {?{name: string, volume: number, pitch: number}}
	*/
	static #playing = null;
	/**
	* Plays whatever the given weather sounds like, replacing whatever was playing before.
	*
	* A sound that is already playing is left strictly alone rather than restarted. That is the whole
	* reason this compares before acting: walking between two lightly-raining maps resolves to the same
	* sound twice, and starting the loop again each time would put an audible hitch in the rain at
	* every single boundary.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {?{preset: string, intensity: string}} resolution What the map resolved to, or null.
	*/
	static play(config, resolution) {
		const sound = WeatherAudio.soundFor(config, resolution);
		if (WeatherAudio.matches(sound, WeatherAudioChannel.#playing) === true) return;
		WeatherAudioChannel.stop();
		if (sound === null) return;
		const buffer = AudioManager.createBuffer("bgs/", sound.name);
		buffer.volume = WeatherAudio.bufferVolume(sound.volume, AudioManager.bgsVolume);
		buffer.pitch = sound.pitch / 100;
		buffer.play(true, 0);
		buffer.fadeIn(WeatherAudioChannel.FadeSeconds);
		WeatherAudioChannel.#buffer = buffer;
		WeatherAudioChannel.#playing = sound;
	}
	/**
	* Silences the channel and lets go of its buffer.
	*/
	static stop() {
		if (WeatherAudioChannel.#buffer === null) return;
		WeatherAudioChannel.#buffer.stop();
		WeatherAudioChannel.#buffer.destroy();
		WeatherAudioChannel.#buffer = null;
		WeatherAudioChannel.#playing = null;
	}
	/**
	* Re-reads the player's volume setting onto whatever is currently playing.
	*
	* Needed because this channel is invisible to `AudioManager`, which retunes only the buffers it
	* knows about when somebody moves a slider in Options.
	*/
	static refreshVolume() {
		if (WeatherAudioChannel.#buffer === null) return;
		const sound = WeatherAudioChannel.#playing;
		WeatherAudioChannel.#buffer.volume = WeatherAudio.bufferVolume(sound.volume, AudioManager.bgsVolume);
	}
	/**
	* What is currently playing, or null when nothing is.
	* @returns {?{name: string, volume: number, pitch: number}}
	*/
	static playing() {
		return WeatherAudioChannel.#playing;
	}
};

//#endregion
//#region src/plugins/weather/core/managers/AudioManager.js
/**
* Extends the `bgsVolume` setter.<br/>
* Also retunes the weather's own channel.
*
* The engine's setter retunes `_currentBgs` and nothing else, which is correct as far as it goes -
* that is the only background sound it knows about. Weather runs on a channel of its own so that a
* river and a rainstorm can be heard at once, and the price of that is being invisible to exactly
* this.
*
* Without it, every route that changes the volume silently stops working for weather: the slider in
* Options, J-SystemUtilities' mute key, a plugin command. The player mutes the game and the rain
* keeps going, which reads as the mute being broken rather than as weather being special.
*
* Hooking the property rather than each of those callers is what makes that true for routes that do
* not exist yet.
*/
(() => {
	const original = Object.getOwnPropertyDescriptor(AudioManager, "bgsVolume");
	Object.defineProperty(AudioManager, "bgsVolume", {
		get: original.get,
		set: function(value) {
			original.set.call(this, value);
			WeatherAudioChannel.refreshVolume();
		},
		configurable: true
	});
})();

//#endregion
//#region src/plugins/weather/core/managers/WeatherDirector.js
/**
* Decides what the weather is, and tells anybody who asks.
*
* One director rather than state scattered across the map and the spriteset, because the answer has
* exactly two consumers with very different lifetimes: the sprites that draw it, which are thrown
* away and rebuilt every time the player opens the menu, and the game variables events branch on,
* which must outlive all of that. Resolving once and letting both read from here is what keeps them
* from ever disagreeing.
*
* **Nothing is remembered between maps.** The weather is re-resolved on arrival from the map's own
* note, so it can never depend on where the player came from. That also means a save load needs no
* special handling at all: loading a game arrives at a map, arriving at a map resolves its weather,
* and the answer is the same one it would be after walking in.
*/
var WeatherDirector = class WeatherDirector {
	/**
	* What the weather currently is, or null when there is none.
	* @type {?{preset: string, intensity: string}}
	*/
	static #current = null;
	/**
	* What the sky is currently doing, or null when nothing is driving one.
	*
	* Null is the ordinary state of this plugin running by itself: a sky that changes over the course
	* of a day is J-Weather-Time's business, and without it installed a map has whatever its note says
	* and nothing else.
	* @type {?{preset: string, intensity: string}}
	*/
	static #sky = null;
	/**
	* How far the player is moving, for the motions that spawn relative to it.
	*
	* Held here rather than on the emitter because the emitter is rebuilt on every menu close while
	* the player keeps walking through all of it, and because a per-layer copy would have each layer
	* sampling the same frame and all but the first seeing no movement at all.
	* @type {PlayerTravel}
	*/
	static #travel = new PlayerTravel();
	/**
	* How many times the weather has actually become something else.
	*
	* **A counter rather than a flag, and the difference is a visible bug.** Something has to clear a
	* flag, and the only thing positioned to is the emitter's own update - which runs *after* the
	* spriteset is built. So on every ordinary arrival the sky is declared, the flag goes up, the
	* plane is built correctly from the new weather, and then the first frame tears it down and
	* rebuilds it again. A generation recorded at build time and compared afterwards has no such
	* window: the number the plane was built against is the number it compares to.
	* @type {number}
	*/
	static #generation = 0;
	/**
	* Re-reads the weather for the map the player has just arrived on.
	*
	* Called on arrival rather than on a timer, because everything it reads - the map's note, the sky -
	* only changes when the player goes somewhere or when the hour turns over, and the hour turning
	* over announces itself.
	*/
	static refresh() {
		WeatherDirector.#travel.forget();
		const declaration = MapWeatherResolver.declarationFor($dataMap);
		const resolved = MapWeatherResolver.resolve(declaration, WeatherDirector.#sky);
		if (WeatherDirector.isSameWeather(WeatherDirector.#current, resolved) === false) {
			WeatherDirector.#generation++;
		}
		WeatherDirector.#current = resolved;
		const { weatherConfig } = J.WEATHER.Metadata;
		WeatherVariables.sync(weatherConfig, WeatherDirector.#current);
		WeatherAudioChannel.play(weatherConfig, WeatherDirector.#current);
	}
	/**
	* What the weather currently is.
	* @returns {?{preset: string, intensity: string}} The current weather, or null for none.
	*/
	static current() {
		return WeatherDirector.#current;
	}
	/**
	* Whether two resolutions describe the same weather.
	*
	* **Compared by value, and that is load-bearing.** `MapWeatherResolver.resolve` builds a fresh
	* object every call, so an identity check is always false and the emitter would tear itself down
	* and rebuild sixty times a second.
	* @param {?{preset: string, intensity: string}} left One resolution, or null for none.
	* @param {?{preset: string, intensity: string}} right The other, or null for none.
	* @returns {boolean}
	*/
	static isSameWeather(left, right) {
		if (left === null) return right === null;
		if (right === null) return false;
		if (left.preset !== right.preset) return false;
		return left.intensity === right.intensity;
	}
	/**
	* How many times the weather has become something else.
	*
	* Recorded by the emitter when it builds, and compared afterwards. See the field's own note for
	* why this is a number rather than a flag.
	* @returns {number}
	*/
	static generation() {
		return WeatherDirector.#generation;
	}
	/**
	* Whether the weather has become something else since a given generation was recorded.
	* @param {number} generation The generation the asker last built against.
	* @returns {boolean}
	*/
	static hasChangedSince(generation) {
		return generation !== WeatherDirector.#generation;
	}
	/**
	* Tells the director what the sky is doing.
	*
	* The seam J-Weather-Time reaches through. Handing the sky in rather than reaching for it is what
	* lets this plugin work perfectly well with nothing driving one.
	* @param {?{preset: string, intensity: string}} sky What the sky is doing, or null.
	*/
	static setSky(sky) {
		WeatherDirector.#sky = sky;
		WeatherDirector.refresh();
	}
	/**
	* Takes this frame's reading of where the player is.
	*
	* Driven from the map scene's own update rather than from the emitter, so that exactly one
	* reading is taken per frame no matter how many layers are drawing.
	*/
	static trackPlayer() {
		WeatherDirector.#travel.sample($gamePlayer.x, $gamePlayer.y);
	}
	/**
	* How far the player moved across the last frame, per axis.
	* @returns {{x: number, y: number}}
	*/
	static travel() {
		return WeatherDirector.#travel.perFrame();
	}
	/**
	* The layers that draw the current weather.
	* @returns {object[]} Emitter-ready layers, empty when there is no weather.
	*/
	static layers() {
		const current = WeatherDirector.current();
		if (current === null) return [];
		return WeatherPresets.layersFor(J.WEATHER.Metadata.weatherConfig, current.preset, current.intensity);
	}
};

//#endregion
//#region src/plugins/weather/core/sprites/Sprite_WeatherLayer.js
/**
* One layer of a place's ambience, drawn as a fixed population of particles.
*
* A layer is one picture travelling one way: rain falling, motes wandering, embers rising. Anything
* more complicated than that - snow that is also blowing sideways, a lava flow that both glows and
* sparks - is two layers, which is why a preset owns a list of them rather than a single description.
*
* **The population never changes size.** Particles are created once and reused forever: one that
* leaves the screen is not destroyed and replaced, it is moved back to an edge and given a fresh
* velocity. That matters more here than almost anywhere else in this codebase, because the heaviest
* ambience Chef Adventure authors runs a thousand particles, and allocating a thousand short-lived
* objects sixty times a second is how a plugin quietly starts costing frames.
*
* For the same reason the particle *state* is a plain object rather than a class. Nothing outside
* this file touches it, it is read and written a thousand times a frame, and putting a pair of
* accessors in front of every number would be paying a readability tax on the one loop in the plugin
* that cannot afford it.
*/
var Sprite_WeatherLayer = class Sprite_WeatherLayer extends Sprite {
	/**
	* How an authored blend name maps onto the renderer's own.
	*
	* Authored as words because that is what somebody tuning a config wants to type, and because
	* `additive` says what it does where `1` does not.
	* @type {Object<string, number>}
	*/
	static Blends = {
		normal: 0,
		additive: 1,
		multiply: 2
	};
	/**
	* The most frames any one particle is run forward for when the weather is first built.
	*
	* A ceiling rather than a target. Fog crawls at a third of a pixel a frame through a queue well
	* over a thousand pixels deep, and without a cap that arithmetic asks for tens of thousands of
	* iterations per particle at the exact moment a map is trying to load.
	* @type {number}
	*/
	static MaxSettleFrames = 12e3;
	/**
	* The screen an authored density is expressed against.
	*
	* RPG Maker's own default window, because that is the one number every author can be assumed to
	* have in mind, and because a config full of numbers tuned to one person's monitor is a config
	* that is wrong for everybody else's.
	* @type {number}
	*/
	static ReferenceArea = 816 * 624;
	/**
	* Extends {@link Sprite.initialize}.<br/>
	* Also builds this layer's entire particle population.
	*
	* **An arrival and a change are not the same event.** Arriving somewhere should look like weather
	* that has already been going, which costs a settling pass; that pass is affordable exactly
	* because the map is loading anyway. A change of weather under a player who is already standing
	* there cannot afford it - see {@link Sprite_WeatherLayer.settle} - and does not want it either,
	* because there is a whole population already on screen for the new one to arrive through.
	* @param {object} layer A layer resolved by `WeatherPresets.resolveLayer`.
	* @param {boolean} isArrival Whether the player is arriving, rather than the sky having moved.
	*/
	initialize(layer, isArrival) {
		super.initialize();
		this.initMembers();
		this.setLayer(layer);
		this.createParticles(isArrival);
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
		* A grouping of all properties associated with weather.
		*/
		this._j._weather ||= {};
		/**
		* What this layer draws and how it moves.
		* @type {object}
		*/
		this._j._weather._layer = null;
		/**
		* The state of every particle, in the same order as the sprites drawing them.
		* @type {object[]}
		*/
		this._j._weather._particles = [];
		/**
		* Whether this layer is on its way out.
		*
		* A retired layer stops replacing particles that finish and simply empties, which is what makes
		* a change of weather a crossfade rather than a cut. Nothing else about it changes - the ones
		* still alive go on exactly as they were, and a raindrop still leaves its ripple.
		* @type {boolean}
		*/
		this._j._weather._retired = false;
	}
	/**
	* Gets what this layer draws and how it moves.
	* @returns {object} The layer.
	*/
	layer() {
		return this._j._weather._layer;
	}
	/**
	* Sets what this layer draws and how it moves.
	* @param {object} newLayer The new layer.
	*/
	setLayer(newLayer) {
		this._j._weather._layer = newLayer;
	}
	/**
	* Gets the state of every particle in this layer.
	* @returns {object[]} The particles.
	*/
	particles() {
		return this._j._weather._particles;
	}
	/**
	* Gets whether this layer is on its way out.
	* @returns {boolean} Whether it has been retired.
	*/
	isRetired() {
		return this._j._weather._retired;
	}
	/**
	* Stops this layer replacing the particles that finish.
	*
	* Everything already alive carries on to its own end, including turning into whatever it becomes,
	* so the last raindrops of a shower still land with ripples rather than blinking out mid-air.
	*/
	retire() {
		this._j._weather._retired = true;
	}
	/**
	* Whether this layer has finished emptying and can be thrown away.
	* @returns {boolean}
	*/
	isDrained() {
		return WeatherMotion.isDrained(this.particles());
	}
	/**
	* Builds the sprites and the states for this layer's whole population.
	*
	* One bitmap is shared by every particle, because they are all the same picture - a thousand rain
	* drops are a thousand draws of one 18x36 image, and loading it a thousand times would be a
	* thousand copies of it in texture memory.
	* @param {boolean} isArrival Whether the player is arriving, rather than the sky having moved.
	*/
	createParticles(isArrival) {
		const layer = this.layer();
		const bitmap = ImageManager.loadWeather(layer.asset);
		const blendMode = Sprite_WeatherLayer.Blends[layer.blend];
		const count = this.particleCount();
		for (let index = 0; index < count; index++) {
			const sprite = new Sprite(bitmap);
			sprite.anchor.set(.5, .5);
			sprite.blendMode = blendMode;
			sprite.tint = layer.tint;
			this.addChild(sprite);
			this.particles().push(this.buildParticle());
		}
		if (isArrival === false) return;
		this.settle();
	}
	/**
	* How many particles this layer actually builds, for the screen it is being drawn on.
	*
	* **An authored density is a density, not a count.** It says how thick the weather is, and how
	* many sprites that takes depends entirely on how much screen there is to cover - a number tuned
	* against the engine's default 816x624 window puts a quarter as much weather on a 1080p one, which
	* is the difference between fog and a few wisps.
	*
	* Scaled by area rather than by width, because coverage is areal: a screen twice as wide and twice
	* as tall needs four times the particles to look the same, not two.
	* @returns {number}
	*/
	particleCount() {
		const bounds = Sprite_WeatherLayer.screenBounds();
		const area = bounds.width * bounds.height;
		return Math.round(this.layer().density * (area / Sprite_WeatherLayer.ReferenceArea));
	}
	/**
	* Runs every particle forward by a random slice of its own journey.
	*
	* Seeding a *snapshot* - scattering the opening population across the screen - gets the first
	* frame right and every frame after it wrong, because on screen is not where most of a population
	* lives. Particles queue up off-screen before entering, so scattering them all into view opens at
	* several times the intended density and then thins out as the surplus drains away. What arriving
	* somewhere should look like is the distribution the weather settles into on its own, and the
	* cheapest way to get exactly that distribution is to let it settle.
	*
	* The cost is a few hundred thousand arithmetic operations, once, while the map is already loading.
	*/
	settle() {
		const layer = this.layer();
		const bounds = Sprite_WeatherLayer.screenBounds();
		this.particles().forEach((newborn, index) => {
			const frames = Math.floor(Math.random() * Sprite_WeatherLayer.settleFramesFor(newborn, layer, bounds));
			for (let frame = 0; frame < frames; frame++) {
				const living = this.particles()[index];
				const params = this.paramsFor(index);
				WeatherMotion.advance(living, params);
				if (this.isFinished(living, params, bounds) === true) {
					this.reseatParticle(index);
				}
			}
			const settled = this.particles()[index];
			settled.opacity = WeatherMotion.settledOpacityFor(settled, this.paramsFor(index));
			settled.stagger = 0;
		});
	}
	/**
	* How many frames one full round trip takes this particle.
	*
	* **The whole cycle, not the visible part of it.** A particle's journey begins a margin outside the
	* screen and as much as an entry queue further back again, so settling it for only the width of
	* the screen leaves most of a population still queued up outside and the map opening empty.
	* Overshooting is harmless - a particle that runs out the far side is reseated and simply goes
	* round again - so the number errs long on purpose.
	*
	* Measured per particle rather than per layer because their speeds differ, and a slow one given a
	* fast one's budget does not get far enough.
	* @param {object} particle The particle being settled.
	* @param {object} layer The motion parameters it was born from.
	* @param {{width: number, height: number}} bounds The screen it crosses.
	* @returns {number}
	*/
	static settleFramesFor(particle, layer, bounds) {
		if (particle.life > 0) return particle.life;
		const pace = Math.max(Math.abs(particle.velocityX), Math.abs(particle.velocityY), .05);
		const distance = WeatherMotion.marginOf(layer) * 2 + WeatherMotion.entryDepthOf(layer) + bounds.width + bounds.height;
		return Math.min(distance / pace, Sprite_WeatherLayer.MaxSettleFrames);
	}
	/**
	* Builds one particle entering from a given edge.
	* @param {?string} edge Where to enter from, or null to use the layer's own.
	* @returns {object}
	*/
	buildParticle(edge = null) {
		const layer = this.layer();
		const entry = edge === null ? WeatherMotion.resolveEdge(layer, Sprite_WeatherLayer.playerTravel()) : edge;
		return WeatherMotion.spawn(layer, Sprite_WeatherLayer.screenBounds(), entry, Sprite_WeatherLayer.rolls());
	}
	/**
	* A fresh roll for every independent choice a particle makes at birth.
	*
	* Drawn here rather than inside the motion itself, which is what keeps every calculation in
	* {@link WeatherMotion} a pure function of its arguments and therefore assertable to an exact
	* number rather than a range.
	*
	* One per choice, never shared. Two choices driven off a single roll are not two choices - they
	* are one, wearing a disguise, and the population ends up agreeing with itself in a way that is
	* immediately visible as structure on screen.
	* @returns {{along: number, across: number, speedX: number, speedY: number, scale: number,
	* stagger: number, edge: number, phase: number, flip: number, pulse: number}}
	*/
	static rolls() {
		return {
			along: Math.random(),
			across: Math.random(),
			speedX: Math.random(),
			speedY: Math.random(),
			scale: Math.random(),
			stagger: Math.random(),
			life: Math.random(),
			edge: Math.random(),
			phase: Math.random(),
			flip: Math.random(),
			pulse: Math.random(),
			tilt: Math.random(),
			stretchX: Math.random(),
			stretchY: Math.random()
		};
	}
	/**
	* The screen every particle crosses.
	* @returns {{width: number, height: number}}
	*/
	static screenBounds() {
		return {
			width: Graphics.width,
			height: Graphics.height
		};
	}
	/**
	* How far the player moved this frame, per axis.
	*
	* Read from the director rather than measured here, because every layer of a preset asks on the
	* same frame and only the first of them could possibly observe the movement.
	* @returns {{x: number, y: number}}
	*/
	static playerTravel() {
		return WeatherDirector.travel();
	}
	/**
	* Extends {@link Sprite.update}.<br/>
	* Also advances every particle and draws it where it got to.
	*/
	update() {
		super.update();
		this.updateParticles();
	}
	/**
	* Advances every particle by a frame, reseating any that have left the screen.
	*/
	updateParticles() {
		const bounds = Sprite_WeatherLayer.screenBounds();
		this.particles().forEach((particle, index) => {
			if (particle.done === true) return;
			const params = this.paramsFor(index);
			WeatherMotion.advance(particle, params);
			if (this.isFinished(particle, params, bounds) === true) {
				this.reseatParticle(index);
			}
			this.drawParticle(index);
		});
	}
	/**
	* Whether a particle is done and should be replaced.
	*
	* Two ways to be done, and a motion uses one or the other rather than both: travelling weather
	* finishes by leaving, and local weather finishes by running out of life. Asking both questions
	* of every particle costs nothing, since a motion with no lifetime answers the second instantly.
	* @param {object} particle The particle being tested.
	* @param {object} layer The motion parameters it was born from.
	* @param {{width: number, height: number}} bounds The screen it crosses.
	* @returns {boolean}
	*/
	isFinished(particle, layer, bounds) {
		if (WeatherMotion.hasEscaped(particle, bounds, layer) === true) return true;
		return WeatherMotion.hasExpired(particle);
	}
	/**
	* Sends a particle that has left the screen back to an edge to cross it again.
	*
	* Rebuilt rather than merely repositioned, so it picks up a fresh velocity and size on the way -
	* a population that reseated without rerolling would settle into visible lanes within a minute.
	* @param {number} index Which particle is being reseated.
	*/
	reseatParticle(index) {
		const particle = this.particles()[index];
		const successor = this.successorFor(particle);
		if (successor !== null) {
			const bounds = Sprite_WeatherLayer.screenBounds();
			this.particles()[index] = WeatherMotion.succeed(particle, successor, bounds, Sprite_WeatherLayer.rolls());
			this.children[index].bitmap = ImageManager.loadWeather(successor.asset);
			return;
		}
		if (this.isRetired() === true) {
			particle.done = true;
			this.children[index].opacity = 0;
			return;
		}
		const replacement = this.buildParticle();
		replacement.stagger = 0;
		this.particles()[index] = replacement;
		this.children[index].bitmap = ImageManager.loadWeather(this.layer().asset);
	}
	/**
	* What a particle turns into when its life runs out, if anything.
	*
	* Only a first-stage particle has a successor. That is what keeps the chain finite without any
	* bookkeeping: a sparkle left behind by a shooting star simply dies and is replaced by a new
	* shooting star, rather than leaving a sparkle of its own forever.
	*
	* **And only a particle that ran out of life leaves anything behind.** A particle that merely
	* left the screen has not finished, it has gone - and a raindrop retired below the bottom edge
	* would otherwise splash a quarter of a screen beneath the world, where the ripple is both
	* invisible and occupying a particle that could have been raining.
	* @param {object} particle The particle whose turn has just ended.
	* @returns {?object} The successor layer, or null when this particle simply starts again.
	*/
	successorFor(particle) {
		if (particle.stage > 0) return null;
		if (WeatherMotion.hasExpired(particle) === false) return null;
		return this.layer().becomes;
	}
	/**
	* The parameters one particle is currently living by.
	*
	* A particle part-way through a staged life is not moving the way its layer says any more - it is
	* a splash rather than a raindrop - so everything that advances or draws it has to ask which of
	* the two it is rather than assuming the layer.
	* @param {number} index Which particle is being asked about.
	* @returns {object} The motion parameters governing that particle right now.
	*/
	paramsFor(index) {
		const particle = this.particles()[index];
		if (particle.stage === 0) return this.layer();
		return this.layer().becomes;
	}
	/**
	* Puts one particle's state onto the sprite drawing it.
	* @param {number} index Which particle is being drawn.
	*/
	drawParticle(index) {
		const particle = this.particles()[index];
		const sprite = this.children[index];
		sprite.x = particle.x;
		sprite.y = particle.y;
		sprite.rotation = particle.rotation;
		sprite.scale.set(WeatherMotion.facingScaleX(particle), particle.scaleY);
		sprite.opacity = particle.stagger > 0 ? 0 : WeatherMotion.glowFor(particle, this.paramsFor(index));
	}
};

//#endregion
//#region src/plugins/weather/core/sprites/Spriteset_Map.js
/**
* Extends {@link Spriteset_Map.createLowerLayer}.<br/>
* Also builds the plane the weather is drawn on.
*/
J.WEATHER.Aliased.Spriteset_Map.set("createLowerLayer", Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function() {
	J.WEATHER.Aliased.Spriteset_Map.get("createLowerLayer").call(this);
	this.createWeatherPlane();
};
/**
* Builds the plane the weather is drawn on, and populates it.
*
* **Weather goes inside the base sprite, which is what makes it part of the world rather than a
* layer floating over one.** `_baseColorFilter` is attached there, so rain at midnight is
* midnight-coloured rain - which is the honest answer to the question the screen tone is asking.
* You cannot see a downpour at Moontide the way you can see one at noon, and weather drawn outside
* the tone reads as bright white confetti over a dark blue world.
*
* That places it correctly against everything else without any index arithmetic. Appended after the
* tilemap, so it draws over the terrain and the characters standing on it. Inside `_baseSprite`, so
* it is beneath the caption plane, the ambient mask and the popup plane - every one of which is
* information about the world rather than part of it, and none of which should be rained on.
*
* Being beneath the mask matters as much as being inside the tone: rain falling through a
* pitch-black cavern should be rain you cannot see.
*/
Spriteset_Map.prototype.createWeatherPlane = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The plane the weather is drawn on.
	* @type {Sprite}
	*/
	this.setWeatherPlane(new Sprite());
	/**
	* Which generation of the weather this plane was last built against.
	* @type {number}
	*/
	this.setWeatherGeneration(0);
	this.baseSprite().addChild(this.weatherPlane());
	this.refreshWeatherLayers();
};
/**
* Gets the generation of the weather this plane was last built against.
* @returns {number} The weatherGeneration.
*/
Spriteset_Map.prototype.weatherGeneration = function() {
	return this._j._weatherGeneration;
};
/**
* Sets the generation of the weather this plane was last built against.
* @param {number} newGeneration The new weatherGeneration.
*/
Spriteset_Map.prototype.setWeatherGeneration = function(newGeneration) {
	this._j._weatherGeneration = newGeneration;
};
/**
* Gets the plane the weather is drawn on.
* @returns {Sprite} The weatherPlane.
*/
Spriteset_Map.prototype.weatherPlane = function() {
	return this._j._weatherPlane;
};
/**
* Sets the plane the weather is drawn on.
* @param {Sprite} newWeatherPlane The new weatherPlane.
*/
Spriteset_Map.prototype.setWeatherPlane = function(newWeatherPlane) {
	this._j._weatherPlane = newWeatherPlane;
};
/**
* Rebuilds the plane's contents from whatever the weather currently is.
*
* Torn down and rebuilt whole rather than reconciled, because a layer's population is fixed at the
* moment it is created - the density it was built for *is* the layer. Changing weather therefore
* means new layers, and reconciling two lists of things that are all being replaced anyway would be
* bookkeeping in exchange for nothing.
*/
Spriteset_Map.prototype.refreshWeatherLayers = function() {
	const plane = this.weatherPlane();
	plane.removeChildren();
	this.setWeatherGeneration(WeatherDirector.generation());
	WeatherDirector.layers().forEach((layer) => plane.addChild(new Sprite_WeatherLayer(layer, true)));
};
/**
* Extends {@link Spriteset_Base.update}.<br/>
* Also crossfades the weather when the sky has moved underneath it.
*
* **Nothing else would ever notice.** The plane is populated once, when the spriteset is built, so
* without this a phase turning over mid-play changes the variables and the audio and leaves the
* screen showing the previous weather until the player next opens a menu.
*/
J.WEATHER.Aliased.Spriteset_Map.set("update", Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function() {
	J.WEATHER.Aliased.Spriteset_Map.get("update").call(this);
	this.updateWeatherLayers();
};
/**
* Brings the plane into line with whatever the weather has become.
*
* Clearing out the emptied layers happens first and unconditionally, because a layer retired by an
* earlier change is still draining while a later one arrives - three changes inside one fog's
* drain would otherwise leave three dead populations on the plane.
*/
Spriteset_Map.prototype.updateWeatherLayers = function() {
	this.dropDrainedWeatherLayers();
	if (WeatherDirector.hasChangedSince(this.weatherGeneration()) === false) return;
	this.crossfadeWeatherLayers();
};
/**
* Starts the outgoing weather emptying and the incoming weather arriving.
*
* **Both populations are on the plane at once**, which is what makes this a crossfade rather than
* a cut - and it is also the ceiling on how heavy this can get, since for the length of one drain
* the screen is carrying roughly double the heaviest preset. Rain and leaves clear in seconds; fog
* takes a minute or two.
*/
Spriteset_Map.prototype.crossfadeWeatherLayers = function() {
	const plane = this.weatherPlane();
	this.setWeatherGeneration(WeatherDirector.generation());
	plane.children.forEach((layer) => layer.retire());
	WeatherDirector.layers().forEach((layer) => plane.addChild(new Sprite_WeatherLayer(layer, false)));
};
/**
* Throws away the retired layers that have finished emptying.
*/
Spriteset_Map.prototype.dropDrainedWeatherLayers = function() {
	const plane = this.weatherPlane();
	const spent = plane.children.filter((layer) => layer.isRetired() === true && layer.isDrained() === true);
	spent.forEach((layer) => plane.removeChild(layer));
};

//#endregion
//#region src/plugins/weather/core/scenes/Scene_Map.js
/**
* Extends {@link #onMapLoaded}.<br/>
* Works out what the weather is on the map being arrived at.
*
* This is the first moment `$dataMap` is the map being entered rather than the one being left, and it
* covers every kind of arrival - a transfer, a save load, a new game, and returning from the menu.
* That last one matters: the spriteset is rebuilt on a menu close, so the weather has to have been
* decided again by the time it goes looking for what to draw.
*/
J.WEATHER.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function() {
	WeatherDirector.refresh();
	J.WEATHER.Aliased.Scene_Map.get("onMapLoaded").call(this);
};
/**
* Extends {@link #update}.<br/>
* Also takes this frame's reading of how far the player has moved.
*
* Here rather than in the emitter because a reading has to be taken exactly once a frame to mean
* anything, and the emitter is several sprites that all update in the same one. The scene is also
* the only place that keeps running while the weather is being rebuilt around a menu close.
*/
J.WEATHER.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.WEATHER.Aliased.Scene_Map.get("update").call(this);
	WeatherDirector.trackPlayer();
};

//#endregion
//# sourceMappingURL=J-Weather.js.map