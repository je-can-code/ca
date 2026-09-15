//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 LIGHTING] Declarative darkness and light sources for the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin lets a place be dark, and lets things in it give off light.
 *
 * The engine has always been able to tint the screen, but a tint is uniform-
 * it colours everything equally and cannot have holes punched in it. That is
 * why night in most games is "everything goes blue" rather than "you cannot
 * see". This plugin adds the other half: a mask that takes light away, which
 * torches, lanterns and glowing things cut back out of.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Darkness is DECLARED on the thing that has it, and lasts exactly as long as
 * that declaration does. A map says how dark it is in its own note box. An
 * event page says what light it gives off in a comment. The party leader's
 * equipment and states say what light they carry.
 *
 * Everything that reaches the screen is composed rather than overwritten. A
 * cave that is dark, at an hour that is dark, during a cutscene that has
 * tinted everything red, resolves into one coherent picture- and when the
 * cutscene lets go, the cave is still dark, because nobody ever overwrote it.
 *
 * A map that says nothing is not dark. Every map authored before this plugin
 * existed is untouched by it, renders exactly as it always has, and costs
 * nothing at all.
 *
 * ============================================================================
 * DECLARING DARKNESS:
 * Put a tag in a MAP's note box (Map Properties -> Note):
 *
 * TAG FORMAT:
 *  <ambient:[DARKNESS]>
 *  <ambient:[DARKNESS, COLOR]>
 *    Where DARKNESS is how much light is gone, from 0 to 100.
 *    Where COLOR is a hex colour for the dark itself (OPTIONAL).
 *
 * EXAMPLE USAGES:
 *  <ambient:[60]>
 * This map has lost 60% of its light. Dim, but navigable.
 *
 *  <ambient:[100]>
 * This map is pitch black. Only declared lights are visible.
 *
 *  <ambient:[85, #0a2a2a]>
 * This map has lost 85% of its light, and what is left reads teal rather
 * than grey. Useful when the dark should belong to the place.
 *
 * A map's note is the right home for this because a map has no pages, so
 * there is no page comment for it to live in instead.
 *
 * ----------------------------------------------------------------------------
 * WHEN THE LIGHTS COME ON:
 * A map's tag says what somewhere is like ORDINARILY. For a room whose lights
 * can be switched on, use the Lights On plugin command- it withdraws the map's
 * own darkness rather than arguing with it.
 *
 * Declaring "no darkness" over the top would do nothing at all, because
 * darkness compounds: none of it, compounded with what is already there, is
 * exactly what is already there.
 *
 * Lights On lasts until the player next arrives on the map. Anything that
 * should outlive a transfer is a switch and a page, the same as any other
 * lasting change to a room.
 *
 * ============================================================================
 * DECLARING A LIGHT:
 * Add a comment to an EVENT PAGE:
 *
 * TAG FORMAT:
 *  <light:[RADIUS]>
 *  <light:[RADIUS, COLOR]>
 *  <light:[RADIUS, COLOR, INTENSITY]>
 *  <light:[RADIUS, COLOR, INTENSITY, EFFECT]>
 *    Where RADIUS is how far the light reaches, in TILES. Fractions are
 *    fine- 2.5 is two and a half tiles.
 *    Where COLOR is a hex colour for the light (OPTIONAL).
 *    Where INTENSITY is how evenly the circle is filled, 0 to 100 (OPTIONAL).
 *    Where EFFECT is `flicker`, `pulse` or `glitch` (OPTIONAL).
 *
 * ONLY THE RADIUS HAS A FIXED PLACE. Colour, intensity and effect are told
 * apart by what they look like- a `#` leads a colour, a bare number is an
 * intensity, a word is an effect- so they may be written in any order, and any
 * of them may be left out.
 *
 * ----------------------------------------------------------------------------
 * INTENSITY- HOW EVENLY THE CIRCLE IS FILLED:
 * This is the SHAPE of the light, not its brightness. At 0 the light is
 * brightest at its heart and fades away to nothing, the way a flame in the
 * open does. At 100 the whole circle burns evenly and stops dead at the rim,
 * the way a spotlight does. Everything between is how hard the edge is.
 *
 * A light with no intensity given is a soft pool, which is what a light has
 * always looked like here.
 *
 * ----------------------------------------------------------------------------
 * EFFECTS- WHAT THE LIGHT DOES OVER TIME:
 * A light with no effect named simply burns steadily.
 *
 *  flicker   Erratic and organic, like a torch or a bonfire. Two waves at
 *            odds with each other, so it never repeats and two torches in a
 *            room never gutter in time.
 *  pulse     Steady and rhythmic, like something breathing or a crystal
 *            humming. One clean wave, the same every cycle.
 *  glitch    Mostly perfectly steady, then a short burst of stuttering, then
 *            steady again. A dying fluorescent tube or failing machinery. The
 *            waiting is what sells it.
 *
 * An effect costs nothing extra to draw. Two torches of the same size and
 * colour share one picture between them whether they flicker or not- the
 * effect changes how brightly that picture is shown, never the picture.
 *
 * EXAMPLE USAGES:
 *  <light:[5]>
 * A plain white light reaching five tiles.
 *
 *  <light:[4, #ffbb73]>
 * A warm light, the colour of an incandescent bulb, reaching four tiles.
 *
 *  <light:[6, #ffbb73, flicker]>
 * The same warm light, reaching six tiles, guttering like a torch.
 *
 *  <light:[5, #ffffff, 90, flicker]>
 * A sharp-edged beam that is not quite holding steady- an unsteady spotlight.
 *
 *  <light:[4, #ffeebb, 10]>
 * A soft, even, unwavering pool- a street lamp.
 *
 *  <light:[3, #88ffcc, 70, pulse]>
 * A crisp teal circle breathing in and out- a crystal.
 *
 *  <light:[2, #aaddff, 100, glitch]>
 * A hard little disc that holds, stutters, and holds again- failing machinery.
 *
 * ----------------------------------------------------------------------------
 * WHY A COMMENT AND NOT A NOTE:
 * A light on a page can stop. An unlit torch is page one with no tag; page
 * two, behind a self switch, has the lit graphic AND the light tag. Setting
 * the torch alight is a self switch, and the light arrives with the page that
 * describes a burning torch.
 *
 * Nothing has to register the event as ignitable, and nothing has to remember
 * to put it out.
 *
 * ----------------------------------------------------------------------------
 * LIGHTS THE PLAYER CARRIES:
 * The same `<light:...>` tag works on anything the party leader has: a weapon,
 * an armor, a state, a skill, a class, or the actor themselves.
 *
 * EXAMPLE USAGES:
 *  <light:[4.5, #ffdca8, flicker]>   (on a Lantern armor)
 * The party gives off light while that lantern is equipped, and stops the
 * moment it comes off.
 *
 *  <light:[3, #88ffcc]>              (on a "Glowing" state)
 * The party gives off light for as long as the state lasts.
 *
 * THE PLAYER HAS NO LIGHT OF THEIR OWN. This is deliberate. A globe that
 * follows the party everywhere makes darkness unreachable, because the one
 * place the player can always see is exactly where they are standing.
 *
 * ============================================================================
 * HOW THINGS COMBINE:
 * DARKNESS COMPOUNDS. A map that is 30% dark, at an hour that is 40% dark, is
 * 58% dark- not 70%. Each one takes away a share of whatever light reached it,
 * so two ordinary evenings never add up to a blackout.
 *
 * THE COLOUR OF THE DARK belongs to whoever actually stated one. A map saying
 * `<ambient:[85, #0a2a2a]>` keeps its teal even when something that only knows
 * how dark it is disagrees.
 *
 * LIGHTS ADD TOGETHER. Two torches overlapping are brighter where they meet,
 * the way two real ones would be.
 *
 * ============================================================================
 * WHAT GOES DARK AND WHAT DOES NOT:
 * The mask sits directly above the weather. Everything painted below it goes
 * dark with the world: the tilemap, characters, their nameplates and gauges,
 * and damage popups.
 *
 * Everything a plugin adds to the spriteset sits above it and stays lit. That
 * is where J-ABS puts its cast previews and debug hitboxes, so attack
 * telegraphs stay readable in a pitch-black room.
 *
 * ADDING YOURSELF TO THE SPRITESET IS HOW YOU OPT OUT OF THE DARK.
 *
 * Anything that should glow within the world's own rules does not need to opt
 * out at all- give it a `<light:...>` tag and it lights the room it is in.
 *
 * ============================================================================
 * CONFIGURATION:
 * Defaults live in `data/config.lighting.json` rather than in plugin
 * parameters, so retuning what a torch looks like across the whole game is a
 * data edit instead of a rebuild.
 *
 *  light.radius         how far a light with no radius given reaches, in tiles
 *  light.color          the colour a light with no colour given is
 *  light.intensity      how evenly a light with no intensity given is filled
 *  light.effects        one block per effect, tuning how it behaves
 *  ambient.color        the colour of dark when a map does not say
 *
 * CONFIG NUMBERS ARE FRACTIONS, NOT PERCENTAGES. A tag is written by hand and
 * so takes an intensity of 0 to 100; this file is read by the game and takes
 * the same thing as 0 to 1, matching `depth` beside it. `light.intensity: 0.5`
 * is what `<light:[5, 50]>` asks for.
 *
 * Every effect is tuned by the same three numbers, so retuning one is the same
 * job as retuning another:
 *
 *  depth    how much brightness the effect may take away at its worst, 0 to 1
 *  period   how many frames one cycle of it takes
 *  chance   how likely a cycle is to fault at all- `glitch` alone reads this,
 *           and it is what decides how long the steady stretches are
 *  variance how far either side of that period an individual light may sit
 *
 * VARIANCE IS WHAT KEEPS A ROOM FROM BEATING AS ONE. Every light already
 * starts somewhere different in its cycle, but two lights running the exact
 * same period hold that stagger forever, and a fixed relationship reads as
 * choreography. A little variance lets them drift in and out of agreement
 * instead, the way two real flames do. Set it to 0 where you want a bank of
 * machines to fault together.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command applyAmbient
 * @text Apply Darkness
 * @desc Darkens the scene until removed. Compounds with the map's own darkness rather than replacing it.
 *
 * @arg darkness
 * @type number
 * @min 0
 * @max 100
 * @default 50
 * @text Darkness
 * @desc How much light to take away, from 0 to 100.
 *
 * @arg color
 * @type string
 * @default
 * @text Color
 * @desc A hex colour for the dark itself, ex: #0a2a2a. Leave blank for ordinary black.
 *
 *
 * @command removeAmbient
 * @text Remove Darkness
 * @desc Withdraws darkness applied by plugin command. The map's own darkness is untouched.
 *
 *
 * @command lightsOn
 * @text Lights On
 * @desc Turns the lights on somewhere the map itself calls dark. Lasts until the player next arrives here.
 *
 *
 * @command lightsOff
 * @text Lights Off
 * @desc Gives a place its own darkness back after Lights On.
 */
//endregion annotations

//#region src/plugins/lighting/core/_metadata/_pluginMetadata.js
/**
* The metadata for J-Lighting.
*
* Every default a light or an ambient falls back to lives in an external config rather than in
* plugin parameters, because retuning how dark the game gets is a data edit that should not require
* opening the plugin manager or rebuilding anything.
*/
var J_LIGHTING_PluginMetadata = class J_LIGHTING_PluginMetadata extends PluginMetadata {
	/**
	* The path where the config for lighting defaults is located.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.lighting.json";
	/**
	* The tuning handed back for a light that does not animate.
	*
	* A steady light never reaches for these, but the renderer asks for a tuning before it knows that,
	* and answering with nothing would move the question of what a steady light does into the caller.
	* @type {{depth: number, period: number, chance: number, variance: number}}
	*/
	static STEADY_TUNING = {
		depth: 0,
		period: 1,
		chance: 0,
		variance: 0
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
	* Loads the lighting defaults from external configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeLightingDefaults();
	}
	/**
	* Reads the defaults a light and an ambient fall back to out of the external config.
	*
	* The tag grammar makes every parameter optional, so an author writing `<light:[5]>` has silently
	* asked for whatever colour, intensity and behaviour are configured here. That is the whole point -
	* the game's torches should all agree on what a torch looks like without anybody retyping a hex
	* code onto two hundred events.
	*/
	initializeLightingDefaults() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Lighting").configName("lighting configuration").build();
		const parsedConfiguration = ExternalJsonConfigLoader.load(J_LIGHTING_PluginMetadata.CONFIG_PATH, options);
		/**
		* The values a `<light:>` tag falls back to for anything it did not spell out.
		* @type {{radius: number, color: string, intensity: number, effects: Object}}
		*/
		this.lightDefaults = parsedConfiguration.light;
		/**
		* The values an `<ambient:>` tag falls back to for anything it did not spell out.
		* @type {{color: string}}
		*/
		this.ambientDefaults = parsedConfiguration.ambient;
	}
	/**
	* How strong and how fast a given effect runs.
	*
	* Each behaviour is tuned separately because they are not the same thing at different speeds. A
	* flicker takes a fifth of a flame's brightness away and never stops; a glitch drops a tube almost
	* to nothing and then leaves it alone for seconds. One shared pair of numbers could describe
	* neither without ruining the other.
	* @param {string} effect The effect being asked about.
	* @returns {{depth: number, period: number, chance: number, variance: number}}
	*/
	tuningFor(effect) {
		const configured = this.lightDefaults.effects[effect];
		if (configured === undefined) return J_LIGHTING_PluginMetadata.STEADY_TUNING;
		return configured;
	}
};

//#endregion
//#region src/plugins/lighting/core/_metadata/initialization.js
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
J.LIGHTING = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.LIGHTING.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.LIGHTING.Metadata = new J_LIGHTING_PluginMetadata("J-Lighting", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.LIGHTING.Aliased = {};
J.LIGHTING.Aliased.DataManager = new Map();
J.LIGHTING.Aliased.Game_Actor = new Map();
J.LIGHTING.Aliased.Game_Event = new Map();
J.LIGHTING.Aliased.Game_Screen = new Map();
J.LIGHTING.Aliased.Scene_Map = new Map();
J.LIGHTING.Aliased.Spriteset_Map = new Map();
/**
* All regular expressions used by this plugin.
*/
J.LIGHTING.RegExp = {};
/**
* How much light a map takes away, and what colour the dark it leaves behind is.
*
* Written on a map's note box, which is the one place a note is the correct home for a declaration:
* a map has no pages, so it has no page comments to carry one instead.
*
* Darkness is a percentage rather than a colour because that is the unit an author thinks in - "this
* room is mostly dark" - while the colour is a separate question about what sort of dark it is. A map
* with no tag at all declares nothing and gets no mask, which is what keeps every existing map in the
* game exactly as bright as it is today.
*
* <pre>
* Structure:
*  <ambient:[DARKNESS]>
*  <ambient:[DARKNESS, COLOR]>
*
* Example:
*  <ambient:[60]>
*  <ambient:[85, #0a2a2a]>
*
* Translation:
*  This map has 60% of its light taken away, in ordinary black.
*  This map has 85% of its light taken away, and the dark itself is teal.
* </pre>
* @type {RegExp}
*/
J.LIGHTING.RegExp.Ambient = /<ambient:[ ]?(\[[\d.]+(?:,[ ]?[#\w.-]+)*])>/i;
/**
* A source of light, given a radius in tiles and optionally a colour and a flicker.
*
* Written on an event page as a comment, so the light belongs to the page rather than to the event:
* an unlit torch is a page with no tag, and lighting it is a page change. Also read from anything
* {@link Game_Battler.getAllNotes} reaches for the party leader - an equipped lantern, a glowing
* state, a class that sees in the dark - which is the only way the player carries a light at all.
*
* <pre>
* Structure:
*  <light:[RADIUS]>
*  <light:[RADIUS, COLOR]>
*  <light:[RADIUS, COLOR, flicker]>
*
* Example:
*  <light:[5]>
*  <light:[4, #ffbb73]>
*  <light:[6, #ffbb73, flicker]>
*
* Translation:
*  A plain white light reaching five tiles.
*  A warm incandescent light reaching four tiles.
*  The same warm light, reaching six tiles and guttering like a flame.
* </pre>
* @type {RegExp}
*/
J.LIGHTING.RegExp.Light = /<light:[ ]?(\[[\d.]+(?:,[ ]?[#\w.-]+)*])>/i;

//#endregion
//#region src/plugins/lighting/core/core/LightingChannels.js
/**
* The properties of the screen that a lighting source is allowed to write, and the rules for
* combining several sources that all want to write the same one.
*
* A channel exists so that no source ever touches the screen directly. The clock states "night is
* this colour and takes away this much light", a map states "this cave is mostly dark", a cutscene
* states "everything is red right now", and the composer decides what the renderer actually gets.
* That is the only reason a cave at midnight during a red-lit cutscene resolves to one coherent
* picture rather than to whichever of the three ran last.
*
* The combine rule differs per channel because the arithmetic that is correct for darkness is wrong
* for a colour. Two things each removing half the light should leave a quarter of it, not none.
* Two things each tinting the screen should not sum into a colour neither of them asked for.
*/
var LightingChannels = class LightingChannels {
	/**
	* The additive colour cast over the whole scene, as `[r, g, b, grey]`.
	*
	* This is what the engine's own screen tone has always been, and it reaches the same place - the
	* colour filter on the spriteset's base sprite. It says what colour the light is. It cannot say
	* how much of it there is, because an additive filter is uniform and cannot have holes punched
	* in it, which is exactly the limitation that made this plugin necessary.
	* @type {string}
	*/
	static TONE = "tone";
	/**
	* How much light the scene has lost, as a fraction where `0` is untouched and `1` is pitch black.
	* @type {string}
	*/
	static AMBIENT = "ambient";
	/**
	* What colour the darkness itself is, as a `[r, g, b]` triplet.
	*
	* Ordinary dark is black, but dark is not always black - a cave lit by nothing but its own
	* bioluminescence is closer to teal, and saying so is cheaper and more controllable than tinting
	* every light in the room to compensate.
	* @type {string}
	*/
	static AMBIENT_COLOR = "ambientColor";
	/**
	* Every channel, in the order a composition reports them.
	* @returns {string[]}
	*/
	static all() {
		return [
			LightingChannels.TONE,
			LightingChannels.AMBIENT,
			LightingChannels.AMBIENT_COLOR
		];
	}
	/**
	* The value a channel holds when nothing is contributing to it.
	*
	* A fresh array is built on every call rather than handing back a shared constant, because the
	* composer accumulates into whatever this returns and a shared array would carry one frame's
	* colour into the next.
	* @param {string} channel The channel name.
	* @returns {number|number[]} The identity value for that channel.
	*/
	static identityFor(channel) {
		switch (channel) {
			case LightingChannels.TONE: return [
				0,
				0,
				0,
				0
			];
			case LightingChannels.AMBIENT_COLOR: return [
				0,
				0,
				0
			];
			default: return 0;
		}
	}
	/**
	* Folds one source's contribution into whatever has accumulated for a channel so far.
	*
	* **Fold order is part of the contract for the claiming channels.** `TONE` and `AMBIENT_COLOR`
	* resolve by letting the incoming value win outright, so the composer must fold sources in
	* ascending priority - the last one in is the one that keeps the channel. Folding them in the
	* other order silently hands the screen to the least assertive source, and the result looks
	* plausible enough that nobody would go looking for the reason.
	* @param {string} channel The channel being combined.
	* @param {number|number[]} accumulated The running value for this channel.
	* @param {number|number[]} contribution The value one source wants to apply to it.
	* @returns {number|number[]} The new running value.
	*/
	static combine(channel, accumulated, contribution) {
		switch (channel) {
			case LightingChannels.AMBIENT: return LightingChannels.#combineDarkness(accumulated, contribution);
			default: return contribution;
		}
	}
	/**
	* Compounds two darkness fractions by multiplying the light each one leaves behind.
	*
	* Darkness compounds rather than sums because each source removes a share of whatever light
	* reached it, not a share of the original. A map that is 30% dark at a moment the sky is 40% dark
	* leaves `0.7 x 0.6` of its light, so it is 58% dark - not 70%, which is what summing would say,
	* and which would let two ordinary evenings add up to a total blackout.
	* @param {number} accumulated The running darkness fraction.
	* @param {number} contribution The darkness fraction being folded in.
	* @returns {number}
	*/
	static #combineDarkness(accumulated, contribution) {
		const lightRemaining = (1 - accumulated) * (1 - contribution);
		return 1 - lightRemaining;
	}
};

//#endregion
//#region src/plugins/lighting/core/core/LightingColor.js
/**
* Turns the hex colours an author writes into the shapes the renderer and the composer need.
*
* Authors write colours the way a colour picker hands them over - `#ffbb73` - and three different
* consumers want three different things from that string. Keeping the conversions in one place means
* a malformed hex is judged once, by one rule, rather than being separately tolerated by whichever
* consumer happens to see it first.
*/
var LightingColor = class LightingColor {
	/**
	* The shape a colour must have to be usable: a hash and either three or six hex digits.
	* @type {RegExp}
	*/
	static HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
	/**
	* Determines whether a string is a colour this plugin can actually use.
	* @param {string} hex The string to judge.
	* @returns {boolean}
	*/
	static isValidHex(hex) {
		return LightingColor.HEX_PATTERN.test(hex);
	}
	/**
	* Splits a hex colour into its red, green and blue channels.
	*
	* Shorthand is expanded rather than rejected, because `#fff` is something an author will
	* reasonably write and refusing it would be a papercut with no upside.
	* @param {string} hex A colour that has already passed {@link isValidHex}.
	* @returns {number[]} The colour as `[r, g, b]`, each 0 through 255.
	*/
	static toRgb(hex) {
		const digits = hex.slice(1);
		const expanded = digits.length === 3 ? digits.replace(/./g, (digit) => digit + digit) : digits;
		const red = Number.parseInt(expanded.slice(0, 2), 16);
		const green = Number.parseInt(expanded.slice(2, 4), 16);
		const blue = Number.parseInt(expanded.slice(4, 6), 16);
		return [
			red,
			green,
			blue
		];
	}
	/**
	* Packs a colour into the single number PIXI wants for a sprite's tint.
	* @param {number[]} rgb The colour as `[r, g, b]`.
	* @returns {number} The colour as `0xRRGGBB`.
	*/
	static toTintNumber(rgb) {
		const [red, green, blue] = rgb;
		return (red << 16) + (green << 8) + blue;
	}
};

//#endregion
//#region src/plugins/lighting/core/core/LightingEffects.js
/**
* The names a light's animation can go by, and what each one is for.
*
* These are three different *kinds* of behaviour rather than three tunings of one. A flame is never
* still; a crystal is perfectly regular; a failing tube is mostly fine and then is not. Trying to
* express any of them with the others' curve produces something that reads as neither.
*
* They are mutually exclusive on purpose. A light animates one way, and a tag asking for two would
* be asking for a shape that does not exist.
*/
var LightingEffects = class LightingEffects {
	/**
	* A light that does not animate at all, which is what a light is unless it says otherwise.
	* @type {string}
	*/
	static STEADY = "steady";
	/**
	* The restless, never-repeating dance of a flame.
	* @type {string}
	*/
	static FLICKER = "flicker";
	/**
	* A clean, perfectly regular swell and fade. Something charged rather than burning.
	* @type {string}
	*/
	static PULSE = "pulse";
	/**
	* Long stretches of nothing happening, broken by a stutter. Something failing.
	* @type {string}
	*/
	static GLITCH = "glitch";
	/**
	* Every effect an author can actually write in a tag.
	*
	* `steady` is deliberately absent: it is what a light does when it says nothing, and offering it
	* as a keyword would invite the question of what `<light:[4, steady, flicker]>` means.
	* @returns {string[]}
	*/
	static authorable() {
		return [
			LightingEffects.FLICKER,
			LightingEffects.PULSE,
			LightingEffects.GLITCH
		];
	}
	/**
	* Determines whether a word from a tag names an effect.
	* @param {string} word The word to judge.
	* @returns {boolean}
	*/
	static isEffect(word) {
		return LightingEffects.authorable().includes(word);
	}
};

//#endregion
//#region src/plugins/lighting/core/core/LightingEasing.js
/**
* The small amount of arithmetic lighting needs to make a light behave like something.
*
* This deliberately does not reach for J-Motion's easing, even though that plugin solves a
* superficially similar problem: importing across ship trees bundles a second copy of it into this
* plugin, and a light needs almost none of what a motion does. There are no channels to claim here
* and nothing travels to a destination - a light is simply brighter or dimmer this frame than last.
*
* Every curve here answers the same question and returns the same thing: a multiplier between
* `1 - depth` and `1`. None of them ever exceed `1`, because a light that overshot its declared
* strength would be brighter than the author asked for at exactly the moments it is most noticeable.
*/
var LightingEasing = class LightingEasing {
	/**
	* The share of a flicker's movement carried by its slow wave.
	*
	* Two waves at unrelated rates are summed rather than one used alone, because a single sine reads
	* as a pulse - regular, mechanical, obviously a loop. Beating two together gives a period long
	* enough that the eye stops finding it, which is the whole difference between a torch and a
	* blinking light. It is also precisely what separates `flicker` from `pulse`, which *wants* to be
	* heard as a loop.
	* @type {number}
	*/
	static SLOW_WAVE_SHARE = .6;
	/**
	* How much faster a flicker's second wave runs than its first.
	*
	* Deliberately not a whole number. An integer ratio makes the two waves line up every cycle and
	* hands the regularity straight back.
	* @type {number}
	*/
	static FAST_WAVE_RATIO = 2.3;
	/**
	* How far into a glitch window the stutter is allowed to run.
	*
	* A burst that filled its whole window would read as a square wave rather than a fault. Confining
	* it to the opening third leaves the long quiet tail that makes the next one feel unscheduled.
	* @type {number}
	*/
	static GLITCH_BURST_SHARE = .35;
	/**
	* How many frames one step of a glitch stutter holds for.
	*
	* Two, because one flips faster than a 60hz screen reads as anything but a grey blur, and three
	* starts to look like deliberate blinking rather than a fault.
	* @type {number}
	*/
	static GLITCH_STEP_FRAMES = 2;
	/**
	* A starting point somewhere inside a light's own cycle.
	*
	* Every light rolls its own, which is what stops a wall of torches burning in formation. A room
	* of thirty synchronised flames reads as one thing flickering rather than thirty things burning -
	* and two broken lamps stuttering in unison reads as a scripted effect rather than as decay.
	* @returns {number} A phase offset in radians.
	*/
	static randomPhase() {
		return Math.random() * Math.PI * 2;
	}
	/**
	* A tempo of a light's own, a little either side of the one its effect was tuned to.
	*
	* A phase offset alone is not enough to keep two lights apart. Offset by half a cycle they are
	* still running at *identical* rates, so they hold that stagger forever and the pair reads as one
	* deliberate two-beat pattern rather than as two independent things. Detuning the rate itself is
	* what makes them drift: they wander in and out of agreement the way two real flames would, and
	* never settle into a relationship the eye can name.
	*
	* The spread is small on purpose. This is meant to be felt and not seen - a ghost breathing
	* obviously faster than the ghost beside it reads as a bug rather than as life.
	* @param {number} variance How far either side of the tuned rate a light may sit, as a fraction.
	* @returns {number} A multiplier to apply to the effect's period.
	*/
	static randomRate(variance) {
		return 1 + (Math.random() * 2 - 1) * variance;
	}
	/**
	* How brightly a light should be burning this frame, for whichever way it animates.
	* @param {string} effect Which behaviour the light was declared with.
	* @param {number} frameCount The engine's running frame count.
	* @param {number} phase This light's own starting offset within its cycle.
	* @param {{depth: number, period: number, chance: number}} tuning How strong and how fast.
	* @param {number} rate This light's own tempo, as a multiplier on the tuned period.
	* @returns {number} A multiplier between `1 - depth` and `1`.
	*/
	static strengthFor(effect, frameCount, phase, tuning, rate) {
		const period = tuning.period * rate;
		switch (effect) {
			case LightingEffects.FLICKER: return LightingEasing.flickerStrength(frameCount, phase, tuning.depth, period);
			case LightingEffects.PULSE: return LightingEasing.pulseStrength(frameCount, phase, tuning.depth, period);
			case LightingEffects.GLITCH: return LightingEasing.glitchStrength(frameCount, phase, tuning.depth, period, tuning.chance);
			default: return 1;
		}
	}
	/**
	* The restless brightness of a flame, from two waves beating against one another.
	* @param {number} frameCount The engine's running frame count.
	* @param {number} phase This light's own starting offset within the cycle.
	* @param {number} depth How much brightness the flicker may take away, 0 through 1.
	* @param {number} periodFrames How many frames the slow wave takes to come back around.
	* @returns {number}
	*/
	static flickerStrength(frameCount, phase, depth, periodFrames) {
		const slowAngle = frameCount / periodFrames * Math.PI * 2 + phase;
		const slowWave = Math.sin(slowAngle) * LightingEasing.SLOW_WAVE_SHARE;
		const fastWave = Math.sin(slowAngle * LightingEasing.FAST_WAVE_RATIO) * (1 - LightingEasing.SLOW_WAVE_SHARE);
		return LightingEasing.#asMultiplier(slowWave + fastWave, depth);
	}
	/**
	* The even swell and fade of something charged rather than burning.
	*
	* One clean sine, which is exactly what {@link flickerStrength} goes to trouble to avoid. The
	* regularity is the point: a crystal that breathed unpredictably would read as broken.
	* @param {number} frameCount The engine's running frame count.
	* @param {number} phase This light's own starting offset within the cycle.
	* @param {number} depth How much brightness the pulse may take away, 0 through 1.
	* @param {number} periodFrames How many frames one full breath takes.
	* @returns {number}
	*/
	static pulseStrength(frameCount, phase, depth, periodFrames) {
		const angle = frameCount / periodFrames * Math.PI * 2 + phase;
		return LightingEasing.#asMultiplier(Math.sin(angle), depth);
	}
	/**
	* The behaviour of something failing: long stretches of nothing, then a stutter.
	*
	* Unlike the other two this is not a wave at all, and it deliberately spends most of its time at
	* full strength. What sells a dying tube is the *waiting* - a light that stuttered continuously
	* would read as a flicker with a harsher curve rather than as a fault.
	*
	* The schedule is a hash of the current window rather than remembered state, which keeps this
	* pure and means two failing lamps in one room never stutter together.
	* @param {number} frameCount The engine's running frame count.
	* @param {number} phase This light's own offset, which shifts its windows away from its neighbours.
	* @param {number} depth How far the light drops during a stutter, 0 through 1.
	* @param {number} periodFrames How many frames one window lasts.
	* @param {number} chance How likely any given window is to fault, 0 through 1.
	* @returns {number}
	*/
	static glitchStrength(frameCount, phase, depth, periodFrames, chance) {
		const ownClock = frameCount / periodFrames + phase;
		const window = Math.floor(ownClock);
		if (LightingEasing.#noiseAt(window) > chance) return 1;
		const throughWindow = ownClock - window;
		if (throughWindow > LightingEasing.GLITCH_BURST_SHARE) return 1;
		const framesIntoWindow = throughWindow * periodFrames;
		const step = Math.floor(framesIntoWindow / LightingEasing.GLITCH_STEP_FRAMES);
		return step % 2 === 0 ? 1 - depth : 1;
	}
	/**
	* Walks a value a single frame's worth of the way toward where it is going.
	*
	* The step is recomputed from what remains rather than from where the journey started, which is
	* the same arithmetic the engine's own tone fade uses. It means a destination that changes
	* mid-journey is simply travelled toward from wherever the value happens to be, with no need to
	* restart or to remember an origin.
	* @param {number} current Where the value is now.
	* @param {number} destination Where it is headed.
	* @param {number} framesRemaining How many frames are left to get there.
	* @returns {number} The value one frame later.
	*/
	static stepToward(current, destination, framesRemaining) {
		if (framesRemaining <= 1) return destination;
		return (current * (framesRemaining - 1) + destination) / framesRemaining;
	}
	/**
	* Folds a wave in the range -1..1 into a brightness multiplier that never exceeds full strength.
	* @param {number} wave Where the curve sits this frame, -1 through 1.
	* @param {number} depth How much brightness may be taken away, 0 through 1.
	* @returns {number}
	*/
	static #asMultiplier(wave, depth) {
		const dip = .5 - wave * .5;
		return 1 - depth * dip;
	}
	/**
	* A stable pseudo-random value for a given window.
	*
	* Deterministic so a window keeps its verdict for as long as it lasts - re-rolling every frame
	* would turn the occasional fault into permanent noise.
	* @param {number} window Which window is being judged.
	* @returns {number} A value between 0 and 1.
	*/
	static #noiseAt(window) {
		const scrambled = Math.sin(window * 12.9898) * 43758.5453;
		return scrambled - Math.floor(scrambled);
	}
};

//#endregion
//#region src/plugins/lighting/core/models/AmbientDeclaration.js
/**
* A statement that some place has lost some of its light, and who said so.
*
* Darkness and the colour of that darkness live on one declaration rather than two because they are
* authored as one thought - `<ambient:[85, #0a2a2a]>` is a single decision about what this cave is
* like. Splitting them would let a source withdraw half of its own opinion.
*
* A declaration carries no behavior and no animation state. It is the authored intent, and the
* composer is what turns a pile of them into a number the renderer can use.
*/
var AmbientDeclaration = class {
	/**
	* How much light is gone, as a fraction where `0` is untouched and `1` is pitch black.
	* @type {number}
	*/
	#darkness = 0;
	/**
	* What colour the darkness is, as `[r, g, b]`.
	* @type {number[]}
	*/
	#color = [
		0,
		0,
		0
	];
	/**
	* Whether the author actually said what colour the dark should be.
	*
	* This is the difference between `<ambient:[60]>` and `<ambient:[60, #000000]>`, which produce the
	* same colour and mean entirely different things. The first has no opinion and should lose the
	* colour to anything that does; the second insists, and a source that merely knows how dark it is
	* has no business overruling it.
	*
	* Without this the clock would win every argument about what colour a cave is, purely because it
	* outranks the cave on the question of *how* dark - and a teal grotto would quietly render black.
	* @type {boolean}
	*/
	#declaresColor = false;
	/**
	* Who declared this ambient, and therefore who can remove it.
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* Constructor.
	* @param {number} darkness The fraction of light removed, 0 through 1.
	* @param {number[]} color The colour of the darkness, as `[r, g, b]`.
	* @param {boolean} declaresColor Whether the author stated that colour themselves.
	* @param {string} sourceKey Who declared this ambient.
	*/
	constructor(darkness, color, declaresColor, sourceKey) {
		this.#darkness = darkness;
		this.#color = color;
		this.#declaresColor = declaresColor;
		this.#sourceKey = sourceKey;
	}
	/**
	* Gets the fraction of light this declaration removes.
	* @returns {number} The darkness.
	*/
	darkness() {
		return this.#darkness;
	}
	/**
	* Gets the colour of the darkness.
	* @returns {number[]} The color.
	*/
	color() {
		return this.#color;
	}
	/**
	* Gets whether the author stated the colour of the dark themselves.
	* @returns {boolean} The declaresColor.
	*/
	hasDeclaredColor() {
		return this.#declaresColor;
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
	* This is what lets a map's ambient be re-declared without disturbing anything. Arriving on a map
	* re-reads its note on every transfer, every save load and every return from the menu, and without
	* a value comparison each of those would count as a change and restart whatever the composer is
	* easing.
	* @param {AmbientDeclaration} other The declaration to compare against.
	* @returns {boolean}
	*/
	matches(other) {
		if (this.darkness() !== other.darkness()) return false;
		if (this.sourceKey() !== other.sourceKey()) return false;
		if (this.hasDeclaredColor() !== other.hasDeclaredColor()) return false;
		const otherColor = other.color();
		return this.#color.every((channel, index) => channel === otherColor.at(index));
	}
};

//#endregion
//#region src/plugins/lighting/core/models/LightDeclaration.js
/**
* A statement that something is giving off light, and who said so.
*
* What a light *is* and what a light *does* are separate things here, and the split is load-bearing
* rather than merely tidy. Reach, colour and intensity decide what gets drawn, so they belong to the
* cached picture. The effect decides what happens to that picture over time, so it belongs to the
* sprite's alpha and must stay out of the cache key - which is why a guttering torch and a steady
* one of the same size and colour share a single drawing between them.
*
* A declaration carries no sprite and no phase. The composer owns both, so that withdrawing a light
* is dropping a declaration rather than hunting down whatever it built.
*/
var LightDeclaration = class {
	/**
	* How far the light reaches, in tiles.
	*
	* Tiles rather than pixels because that is the unit every other distance in the ecosystem is
	* written in - `<sight:5>`, `<proximityText:2>`, JABS's `<radius:1>` - and because an author
	* thinks in tiles. Fractions are allowed: a two-and-a-half tile lamp is a reasonable thing to
	* want, and refusing it would only push people back toward counting pixels.
	* @type {number}
	*/
	#radius = 0;
	/**
	* The colour of the light, as a hex string.
	*
	* Kept as authored rather than parsed into channels, because this doubles as part of the texture
	* cache's key and a string compares in one operation where a triplet compares in three.
	* @type {string}
	*/
	#color = String.empty;
	/**
	* How evenly the circle is filled, from `0` for a soft pool to `1` for a flat disc.
	*
	* This is a property of the picture rather than of its brightness. At `0` the light is brightest
	* at its heart and fades away to nothing, which is what a flame in the open looks like. At `1` the
	* whole circle burns at full strength and stops dead at the rim, which is what a spotlight looks
	* like. Everything between is a matter of how hard the edge is.
	* @type {number}
	*/
	#intensity = 0;
	/**
	* How this light animates, if it animates at all.
	* @type {string}
	*/
	#effect = String.empty;
	/**
	* The character carrying this light around.
	*
	* A light is always attached to something in the world - a torch event, the player, a follower -
	* because there is nowhere else for it to be. The screen position is deliberately *not* stored:
	* the character already knows where it is every frame, and a light that cached its own coordinates
	* would be wrong the instant the map scrolled.
	* @type {Game_CharacterBase}
	*/
	#character = null;
	/**
	* Who declared this light, and therefore who can remove it.
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* Constructor.
	* @param {number} radius How far the light reaches, in tiles.
	* @param {string} color The colour of the light, as a hex string.
	* @param {number} intensity How evenly the circle is filled, 0 through 1.
	* @param {string} effect How the light animates, from {@link LightingEffects}.
	* @param {Game_CharacterBase} character The character carrying the light.
	* @param {string} sourceKey Who declared this light.
	*/
	constructor(radius, color, intensity, effect, character, sourceKey) {
		this.#radius = radius;
		this.#color = color;
		this.#intensity = intensity;
		this.#effect = effect;
		this.#character = character;
		this.#sourceKey = sourceKey;
	}
	/**
	* Gets how far this light reaches, in tiles.
	* @returns {number} The radius.
	*/
	radius() {
		return this.#radius;
	}
	/**
	* How far this light reaches in pixels, which is the only unit a texture can be drawn in.
	*
	* The conversion lives here rather than at the point of authoring so that the declaration keeps
	* saying what was actually written. It asks the map rather than assuming 48, because the tile size
	* is a project setting and a game that changed it would otherwise get lights of the wrong size
	* with nothing anywhere reporting a problem.
	* @returns {number}
	*/
	radiusInPixels() {
		return this.#radius * $gameMap.tileWidth();
	}
	/**
	* Gets the colour of this light.
	* @returns {string} The color.
	*/
	color() {
		return this.#color;
	}
	/**
	* Gets how evenly this light fills its circle.
	* @returns {number} The intensity.
	*/
	intensity() {
		return this.#intensity;
	}
	/**
	* Gets how this light animates.
	* @returns {string} The effect.
	*/
	effect() {
		return this.#effect;
	}
	/**
	* Gets the character carrying this light.
	* @returns {Game_CharacterBase} The character.
	*/
	character() {
		return this.#character;
	}
	/**
	* Gets the source key.
	* @returns {string} The sourceKey.
	*/
	sourceKey() {
		return this.#sourceKey;
	}
	/**
	* The key under which this light's texture is cached.
	*
	* Reach, colour and intensity are exactly the three things that decide what a light *looks* like,
	* so every light in the game agreeing on all three shares one drawing. Everything else is
	* deliberately absent: the effect is animated by changing a sprite's alpha, and the character is
	* where the light is rather than what it looks like. A guttering torch and a steady one of the
	* same size, colour and edge are the same picture shown at different brightnesses.
	* @returns {string}
	*/
	textureKey() {
		return `${this.#radius}:${this.#color}:${this.#intensity}`;
	}
	/**
	* Determines whether another declaration says exactly the same thing as this one.
	* @param {LightDeclaration} other The declaration to compare against.
	* @returns {boolean}
	*/
	matches(other) {
		if (this.textureKey() !== other.textureKey()) return false;
		if (this.effect() !== other.effect()) return false;
		if (this.character() !== other.character()) return false;
		return this.sourceKey() === other.sourceKey();
	}
};

//#endregion
//#region src/plugins/lighting/core/models/ToneDeclaration.js
/**
* A statement that the scene should be cast in some colour, and how long it should take to get there.
*
* Tone is the one channel that arrives with a duration attached, because the engine's own
* `Game_Screen.startTint` has always taken one and every cutscene in the game was authored against
* that. The duration is carried here rather than acted on here - the composer owns the easing, since
* it is the only thing that knows what tone the screen is actually showing right now.
*
* **A declaration states a destination, never a current value.** Reading a live interpolation as a
* declaration is the mistake this design exists to avoid: partway through a fade the live tone
* matches nobody's intent, and composing against it makes the screen lurch toward a colour no source
* ever asked for.
*/
var ToneDeclaration = class {
	/**
	* The colour being travelled toward, as `[r, g, b, grey]`.
	* @type {number[]}
	*/
	#tone = [
		0,
		0,
		0,
		0
	];
	/**
	* How many frames the journey there should take.
	* @type {number}
	*/
	#durationFrames = 0;
	/**
	* Who declared this tone, and therefore who can remove it.
	* @type {string}
	*/
	#sourceKey = String.empty;
	/**
	* Constructor.
	* @param {number[]} tone The colour being travelled toward, as `[r, g, b, grey]`.
	* @param {number} durationFrames How many frames the journey should take.
	* @param {string} sourceKey Who declared this tone.
	*/
	constructor(tone, durationFrames, sourceKey) {
		this.#tone = tone;
		this.#durationFrames = durationFrames;
		this.#sourceKey = sourceKey;
	}
	/**
	* Gets the colour being travelled toward.
	* @returns {number[]} The tone.
	*/
	tone() {
		return this.#tone;
	}
	/**
	* Gets how many frames the journey should take.
	* @returns {number} The durationFrames.
	*/
	durationFrames() {
		return this.#durationFrames;
	}
	/**
	* Gets the source key.
	* @returns {string} The sourceKey.
	*/
	sourceKey() {
		return this.#sourceKey;
	}
	/**
	* Determines whether this declaration is asking for no colour at all.
	*
	* A neutral destination is how the engine has always spelled "I am finished" - an event's Tint
	* Screen back to `[0,0,0,0]` means the cutscene is handing the screen back, not that the world is
	* supposed to become colourless. Treating it as a withdrawal is what lets the clock's night take
	* over again afterward instead of being wiped flat.
	* @returns {boolean}
	*/
	isNeutral() {
		return this.#tone.every((channel) => channel === 0);
	}
	/**
	* Determines whether another declaration says exactly the same thing as this one.
	* @param {ToneDeclaration} other The declaration to compare against.
	* @returns {boolean}
	*/
	matches(other) {
		if (this.sourceKey() !== other.sourceKey()) return false;
		if (this.durationFrames() !== other.durationFrames()) return false;
		const otherTone = other.tone();
		return this.#tone.every((channel, index) => channel === otherTone.at(index));
	}
};

//#endregion
//#region src/plugins/lighting/core/models/LightingComposition.js
/**
* What every lighting source, taken together, says the screen should look like this frame.
*
* Nothing writes to a composition after it is built. The composer hands the same instance to the
* colour filter and to the mask, and neither is able to disturb what the other sees - which matters
* because they run at different points in the render walk and in battle only one of them exists.
*/
var LightingComposition = class {
	/**
	* The colour cast over the whole scene, as `[r, g, b, grey]`.
	* @type {number[]}
	*/
	#tone = [
		0,
		0,
		0,
		0
	];
	/**
	* How much light the scene has lost, as a fraction where `0` is untouched and `1` is pitch black.
	* @type {number}
	*/
	#darkness = 0;
	/**
	* What colour the darkness is, as `[r, g, b]`.
	* @type {number[]}
	*/
	#ambientColor = [
		0,
		0,
		0
	];
	/**
	* Every light currently burning, from every source at once.
	* @type {LightDeclaration[]}
	*/
	#lights = [];
	/**
	* Constructor.
	* @param {number[]} tone The colour cast over the scene, as `[r, g, b, grey]`.
	* @param {number} darkness The fraction of light removed, 0 through 1.
	* @param {number[]} ambientColor The colour of the darkness, as `[r, g, b]`.
	* @param {LightDeclaration[]} lights Every light currently burning.
	*/
	constructor(tone, darkness, ambientColor, lights) {
		this.#tone = tone;
		this.#darkness = darkness;
		this.#ambientColor = ambientColor;
		this.#lights = lights;
	}
	/**
	* Gets the colour cast over the whole scene.
	* @returns {number[]} The tone.
	*/
	tone() {
		return this.#tone;
	}
	/**
	* Gets how much light the scene has lost.
	* @returns {number} The darkness.
	*/
	darkness() {
		return this.#darkness;
	}
	/**
	* Gets what colour the darkness is.
	* @returns {number[]} The ambientColor.
	*/
	ambientColor() {
		return this.#ambientColor;
	}
	/**
	* Gets every light currently burning.
	* @returns {LightDeclaration[]} The lights.
	*/
	lights() {
		return this.#lights;
	}
	/**
	* Determines whether there is any darkness worth rendering a mask for.
	*
	* A place nobody said was dark is not dark, and this is the guard that keeps that promise. Every
	* map in a game that predates this plugin declares no ambient at all, so every one of them takes
	* this exit and renders exactly as it always has - no mask, no render pass, no cost.
	*
	* Lights deliberately do not qualify on their own. A torch in a well-lit room has nothing to
	* reveal, and letting it force a mask into existence would put an additive glow on two hundred
	* existing events the moment this plugin was installed.
	* @returns {boolean}
	*/
	hasMask() {
		return this.#darkness > 0;
	}
};

//#endregion
//#region src/plugins/lighting/core/core/LightTextureCache.js
/**
* Every distinct light picture the game has needed so far, drawn once and handed out forever.
*
* A light's radius and colour never change - only where it is. That single observation is what
* separates this from the plugin it replaces, which rasterised the entire screen onto a canvas every
* frame and re-uploaded eight hundred kilobytes of texture sixty times a second to do it. Here a
* torch is drawn once, and forty-seven torches sharing a radius and a colour share that one drawing.
*
* Nothing is ever evicted. The set of distinct light appearances in a game is small, bounded by what
* authors actually wrote in tags, and a cache that can throw away a texture would have to be able to
* rebuild it mid-frame - which is the cost this exists to avoid.
*/
var LightTextureCache = class LightTextureCache {
	/**
	* Every generated light picture, keyed by the appearance that produced it.
	* @type {Map<string, Bitmap>}
	*/
	static #texturesByKey = new Map();
	/**
	* Where the midpoint colour stop sits on a light of the softest possible edge.
	*
	* A gradient running straight from full brightness to black in one step reads as a flat disc.
	* Bending it with a midpoint gives the pooled, lamp-like falloff that an open flame actually has,
	* without the expense of computing a real curve per pixel.
	* @type {number}
	*/
	static SOFT_MIDPOINT = .45;
	/**
	* How much brightness survives to the midpoint on a light of the softest possible edge.
	* @type {number}
	*/
	static SOFT_MIDPOINT_STRENGTH = .35;
	/**
	* Where the midpoint sits on a light of the hardest possible edge.
	*
	* Not quite the rim: leaving a sliver of gradient at the very edge is what keeps a hard circle
	* from looking like an aliased cut-out, while still reading as a spotlight rather than a haze.
	* @type {number}
	*/
	static HARD_MIDPOINT = .97;
	/**
	* How much brightness survives to the midpoint on a light of the hardest possible edge.
	* @type {number}
	*/
	static HARD_MIDPOINT_STRENGTH = 1;
	/**
	* Gets the picture for a light, drawing it only if this is the first one of its kind.
	* @param {LightDeclaration} declaration The light whose picture is wanted.
	* @returns {Bitmap} The cached picture.
	*/
	static forDeclaration(declaration) {
		const key = declaration.textureKey();
		if (LightTextureCache.#texturesByKey.has(key) === true) {
			return LightTextureCache.#texturesByKey.get(key);
		}
		const generated = LightTextureCache.#generate(declaration.radiusInPixels(), declaration.color(), declaration.intensity());
		LightTextureCache.#texturesByKey.set(key, generated);
		return generated;
	}
	/**
	* Draws one light as a radial falloff from its own colour out to black.
	*
	* Black is the far stop rather than transparency because these pictures are composited additively:
	* a pixel of black adds nothing, which is exactly what "no light reaches here" should mean. It also
	* makes the square corners of the bitmap free - they are black, so they contribute nothing, and no
	* masking or clipping is needed to make a circle out of a rectangle.
	* Intensity is what decides the shape of that falloff. At zero the light is brightest at its
	* heart and fades away, which is an open flame. At one the whole circle burns evenly and stops at
	* the rim, which is a spotlight. Both are the same three gradient stops with the middle one slid
	* outward and brightened, which is why this costs nothing extra to draw.
	* @param {number} radius How far the light reaches, in pixels - already converted from tiles.
	* @param {string} color The colour of the light, as a hex string.
	* @param {number} intensity How evenly the circle is filled, 0 through 1.
	* @returns {Bitmap} The freshly drawn picture.
	*/
	static #generate(radius, color, intensity) {
		const diameter = radius * 2;
		const bitmap = new Bitmap(diameter, diameter);
		const { context } = bitmap;
		const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
		const midpoint = LightTextureCache.#between(LightTextureCache.SOFT_MIDPOINT, LightTextureCache.HARD_MIDPOINT, intensity);
		const strength = LightTextureCache.#between(LightTextureCache.SOFT_MIDPOINT_STRENGTH, LightTextureCache.HARD_MIDPOINT_STRENGTH, intensity);
		const midpointColor = LightTextureCache.#dim(color, strength);
		gradient.addColorStop(0, color);
		gradient.addColorStop(midpoint, midpointColor);
		gradient.addColorStop(1, "#000000");
		context.fillStyle = gradient;
		context.fillRect(0, 0, diameter, diameter);
		bitmap.baseTexture.update();
		return bitmap;
	}
	/**
	* Slides a value between its softest and hardest settings.
	* @param {number} soft What this value is at an intensity of zero.
	* @param {number} hard What it is at an intensity of one.
	* @param {number} intensity Where between the two to land, 0 through 1.
	* @returns {number}
	*/
	static #between(soft, hard, intensity) {
		return soft + (hard - soft) * intensity;
	}
	/**
	* Scales a colour toward black by a given strength.
	* @param {string} hex The colour to dim, as a hex string.
	* @param {number} strength How much of the colour survives, 0 through 1.
	* @returns {string} The dimmed colour, as an `rgb()` string.
	*/
	static #dim(hex, strength) {
		const rgb = LightingColor.toRgb(hex);
		const [red, green, blue] = rgb.map((channel) => Math.round(channel * strength));
		return `rgb(${red},${green},${blue})`;
	}
	/**
	* Discards every generated picture.
	*
	* Nothing in the game needs this - a light appearance stays valid for the life of the process -
	* but a test that asserts a texture was generated exactly once needs somewhere to start from.
	*/
	static clear() {
		LightTextureCache.#texturesByKey.clear();
	}
	/**
	* How many distinct light pictures have been drawn.
	*
	* Exists so a test can prove the sharing actually happens. Forty-seven torches of one appearance
	* producing one texture is the entire performance claim of this class, and an assertion that only
	* checks the picture looks right would pass just as happily if it had been drawn forty-seven times.
	* @returns {number}
	*/
	static size() {
		return LightTextureCache.#texturesByKey.size;
	}
};

//#endregion
//#region src/plugins/lighting/core/core/LightingTagParser.js
/**
* Turns authored lighting tags into declarations.
*
* One parser serves every source. An event page hands it comment text, a map hands it the body of
* its note, and the party leader's equipment hands it the same - which is why `<light:[5]>` means
* exactly one thing no matter where somebody writes it.
*/
var LightingTagParser = class LightingTagParser {
	/**
	* How many parameters a `<light:>` tag accepts before something is wrong.
	*
	* Reach, colour, intensity and an effect. Anything beyond that is an author remembering a
	* signature that does not exist.
	* @type {number}
	*/
	static LIGHT_PARAMETER_LIMIT = 4;
	/**
	* The largest intensity an author can ask for, being a completely flat disc.
	* @type {number}
	*/
	static MAX_INTENSITY_PERCENT = 100;
	/**
	* How many positional parameters an `<ambient:>` tag accepts before something is wrong.
	* @type {number}
	*/
	static AMBIENT_PARAMETER_LIMIT = 2;
	/**
	* The largest darkness an author can ask for, being all of it.
	* @type {number}
	*/
	static MAX_DARKNESS_PERCENT = 100;
	/**
	* Reads every light tag out of a list of comment strings.
	* @param {string[]} comments The comment text to read.
	* @param {Game_CharacterBase} character The character these lights hang off.
	* @param {string} sourceKey Who is declaring these lights.
	* @returns {LightDeclaration[]} Every valid declaration found, in the order written.
	*/
	static parseComments(comments, character, sourceKey) {
		const declarations = [];
		comments.forEach((comment) => {
			const match = J.LIGHTING.RegExp.Light.exec(comment);
			if (match === null) return;
			const [, payload] = match;
			const declaration = LightingTagParser.parseLightPayload(payload, character, sourceKey);
			if (declaration === null) return;
			declarations.push(declaration);
		}, this);
		return declarations;
	}
	/**
	* Reads every light tag off a collection of database objects that carry notes.
	*
	* This is how the party leader comes to be carrying a lantern: `getAllNotes` hands over the actor,
	* its class, its skills, its equipment and its states, and any one of them may be the thing that
	* glows.
	* @param {RPG_BaseItem[]} noteObjects The database objects to read.
	* @param {Game_CharacterBase} character The character these lights hang off.
	* @param {string} sourceKey Who is declaring these lights.
	* @returns {LightDeclaration[]} Every valid declaration found.
	*/
	static parseNoteObjects(noteObjects, character, sourceKey) {
		const payloads = RPGManager.getStringsFromAllNotesByRegex(noteObjects, J.LIGHTING.RegExp.Light);
		const declarations = [];
		payloads.forEach((payload) => {
			const declaration = LightingTagParser.parseLightPayload(payload, character, sourceKey);
			if (declaration === null) return;
			declarations.push(declaration);
		}, this);
		return declarations;
	}
	/**
	* Turns one light tag's bracketed body into a declaration.
	*
	* Returns null when the tag cannot be honoured, which is one of the two places in this plugin
	* where null is a meaningful answer: the caller needs to distinguish "this text was not for us"
	* from "this text was for us and was wrong", and only the second is worth complaining about.
	* @param {string} payload The bracketed body, ex: `[5, #ffbb73, flicker]`.
	* @param {Game_CharacterBase} character The character this light hangs off.
	* @param {string} sourceKey Who is declaring this light.
	* @returns {LightDeclaration|null} The declaration, or null when the tag was invalid.
	*/
	static parseLightPayload(payload, character, sourceKey) {
		const parsed = JsonMapper.parseObject(payload);
		const [radius, ...rest] = parsed;
		if (parsed.length > LightingTagParser.LIGHT_PARAMETER_LIMIT) {
			const message = `light accepts up to ${LightingTagParser.LIGHT_PARAMETER_LIMIT} parameters`;
			Diagnostics.warn("J-Lighting", message, {
				payload,
				sourceKey
			});
			return null;
		}
		if (Number.isFinite(radius) === false || radius <= 0) {
			Diagnostics.warn("J-Lighting", `light radius must be a positive number of tiles`, {
				payload,
				sourceKey
			});
			return null;
		}
		const effect = rest.find((parameter) => LightingEffects.isEffect(parameter)) ?? LightingEffects.STEADY;
		const colorCandidates = rest.filter((parameter) => String(parameter).startsWith("#"));
		const intensityCandidate = rest.find((parameter) => Number.isFinite(parameter));
		const defaults = J.LIGHTING.Metadata.lightDefaults;
		const color = LightingTagParser.#resolveColor(colorCandidates, defaults.color, payload, sourceKey);
		const intensity = LightingTagParser.#resolveIntensity(intensityCandidate, defaults.intensity);
		LightingTagParser.#reportUnusable(rest, payload, sourceKey);
		return new LightDeclaration(radius, color, intensity, effect, character, sourceKey);
	}
	/**
	* Turns one ambient tag's bracketed body into a declaration.
	* @param {string} payload The bracketed body, ex: `[85, #0a2a2a]`.
	* @param {string} sourceKey Who is declaring this ambient.
	* @returns {AmbientDeclaration|null} The declaration, or null when the tag was invalid.
	*/
	static parseAmbientPayload(payload, sourceKey) {
		const parsed = JsonMapper.parseObject(payload);
		const [percent, ...rest] = parsed;
		if (parsed.length > LightingTagParser.AMBIENT_PARAMETER_LIMIT) {
			const message = `ambient accepts up to ${LightingTagParser.AMBIENT_PARAMETER_LIMIT} parameters`;
			Diagnostics.warn("J-Lighting", message, {
				payload,
				sourceKey
			});
			return null;
		}
		if (Number.isFinite(percent) === false) {
			Diagnostics.warn("J-Lighting", `ambient darkness must be a number`, {
				payload,
				sourceKey
			});
			return null;
		}
		const clamped = percent.clamp(0, LightingTagParser.MAX_DARKNESS_PERCENT);
		const darkness = clamped / LightingTagParser.MAX_DARKNESS_PERCENT;
		const defaultColor = J.LIGHTING.Metadata.ambientDefaults.color;
		const hex = LightingTagParser.#resolveColor(rest, defaultColor, payload, sourceKey);
		const color = LightingColor.toRgb(hex);
		const declaresColor = rest.length > 0;
		return new AmbientDeclaration(darkness, color, declaresColor, sourceKey);
	}
	/**
	* Turns an authored intensity percentage into the fraction the renderer draws with.
	*
	* Absent means the configured default, which ships at zero - the soft pool a light has always
	* been. That is what keeps every tag written before intensity existed looking exactly as it did.
	* @param {number|undefined} candidate Whatever the author wrote, if anything.
	* @param {number} fallback The configured default, as a fraction.
	* @returns {number} The intensity as a fraction, 0 through 1.
	*/
	static #resolveIntensity(candidate, fallback) {
		if (candidate === undefined) return fallback;
		const clamped = candidate.clamp(0, LightingTagParser.MAX_INTENSITY_PERCENT);
		return clamped / LightingTagParser.MAX_INTENSITY_PERCENT;
	}
	/**
	* Reports any parameter that was neither a colour, an intensity, nor an effect.
	*
	* Silence here would be the wrong kindness. A misspelled `flickr` produces a light that is subtly
	* not what was asked for, and a author who is not told will stare at the event rather than the tag.
	* @param {Array<string|number>} parameters Everything written after the reach.
	* @param {string} payload The whole tag body, for reporting.
	* @param {string} sourceKey Who declared it, for reporting.
	*/
	static #reportUnusable(parameters, payload, sourceKey) {
		const unusable = parameters.filter((parameter) => {
			if (Number.isFinite(parameter) === true) return false;
			if (String(parameter).startsWith("#") === true) return false;
			return LightingEffects.isEffect(parameter) === false;
		});
		if (unusable.length === 0) return;
		const message = `unrecognised light parameter: [ ${unusable.join(", ")} ]`;
		Diagnostics.warn("J-Lighting", message, {
			payload,
			sourceKey
		});
	}
	/**
	* Settles which colour a tag actually asked for, falling back to the configured default.
	*
	* A colour that is present but malformed is reported rather than quietly swapped, because it
	* almost always means a typo in a hex code - and a torch that is subtly the wrong colour is the
	* kind of thing an author stares at for twenty minutes without suspecting the tag.
	* @param {Array<string|number>} candidates Whatever parameters might be a colour.
	* @param {string} fallback The configured default for this kind of tag.
	* @param {string} payload The whole tag body, for reporting.
	* @param {string} sourceKey Who declared it, for reporting.
	* @returns {string} A hex colour that is safe to use.
	*/
	static #resolveColor(candidates, fallback, payload, sourceKey) {
		if (candidates.length === 0) return fallback;
		const [candidate] = candidates;
		if (LightingColor.isValidHex(candidate) === false) {
			const message = `unusable colour, falling back to ${fallback}`;
			Diagnostics.warn("J-Lighting", message, {
				candidate,
				payload,
				sourceKey
			});
			return fallback;
		}
		return candidate;
	}
};

//#endregion
//#region src/plugins/lighting/core/managers/ScreenLightingComposer.js
/**
* Owns the screen's light: what has been declared, what is currently easing, and what the renderer
* should show this frame.
*
* Nothing lighting-related lives on a game object. That is deliberate and it is the whole reason
* this plugin adds nothing to a savefile: there is no field for the save encoder to find, no
* transient to keep correct, and no way for a future addition to end up persisted by accident. The
* failure mode is unrepresentable rather than guarded against.
*
* Everything arrives here as a declaration carrying a source key, and removal is always by source.
* `removeDeclarations('time')` cannot touch a map's ambient, and a cutscene handing the screen back
* cannot erase the fact that the cave it happened in is dark. That property is what lets the clock,
* a map, an event page, the party leader's lantern and an event command all reach the same screen
* while remaining completely ignorant of one another.
*/
var ScreenLightingComposer = class ScreenLightingComposer {
	/**
	* How strongly a source's claim on a channel outranks another's.
	*
	* The order is how transient each kind is, because the more fleeting a declaration is the more
	* likely it is the thing a player is meant to be reading right now. A map's darkness is what a
	* place is forever, an event page's torch lasts as long as that page, the leader's lantern lasts
	* as long as they carry it, the clock's night lasts an hour, and a cutscene's tint is happening
	* this second.
	* @type {Map<string, number>}
	*/
	static #sourcePriorities = new Map([
		["command", 5],
		["time", 4],
		["player", 3],
		["page", 2],
		["map", 1]
	]);
	/**
	* How long a withdrawal takes to travel home when nothing says otherwise.
	*
	* One frame, because an immediate handover is what the engine has always done: a source that
	* never stated a duration is not asking for a journey.
	* @type {number}
	*/
	static DEFAULT_RELEASE_FRAMES = 1;
	/**
	* Every source's declared tone, keyed by who declared it.
	* @type {Map<string, ToneDeclaration>}
	*/
	static #toneBySource = new Map();
	/**
	* Every source's declared ambient, keyed by who declared it.
	* @type {Map<string, AmbientDeclaration>}
	*/
	static #ambientBySource = new Map();
	/**
	* Every source's declared lights, keyed by who declared them.
	* @type {Map<string, LightDeclaration[]>}
	*/
	static #lightsBySource = new Map();
	/**
	* The tone the screen is actually showing right now, partway through whatever journey it is on.
	* @type {number[]}
	*/
	static #currentTone = [
		0,
		0,
		0,
		0
	];
	/**
	* The tone the screen is currently travelling toward.
	* @type {number[]}
	*/
	static #toneDestination = [
		0,
		0,
		0,
		0
	];
	/**
	* How many frames are left in the current tone journey.
	* @type {number}
	*/
	static #toneFramesRemaining = 0;
	/**
	* How long the next withdrawal should take to travel home.
	*
	* Captured when a source withdraws rather than read when the journey starts, because by the time
	* the composer notices the destination changed, the declaration that knew how long it wanted to
	* take is already gone.
	* @type {number}
	*/
	static #releaseFrames = ScreenLightingComposer.DEFAULT_RELEASE_FRAMES;
	/**
	* The composition built this frame.
	* @type {LightingComposition}
	*/
	static #composition = new LightingComposition([
		0,
		0,
		0,
		0
	], 0, [
		0,
		0,
		0
	], []);
	/**
	* The frame the current composition was built on.
	*
	* Composition is idempotent within a frame, and this is what makes it so. Two entirely separate
	* consumers ask for it - the colour filter on the base sprite and the mask sprite - and they run
	* at different points in the render walk, in an order that depends on which plugins are installed.
	* Advancing the easing on whichever asked first would make the fade speed depend on the plugin
	* list, so instead the first caller of a frame does the work and the second is handed the answer.
	* @type {number}
	*/
	static #composedFrame = -1;
	/**
	* Declares the tone one source wants the screen cast in.
	*
	* A neutral tone is a withdrawal rather than a request. That is how the engine has always spelled
	* "I am finished" - an event tinting back to `[0,0,0,0]` is handing the screen back, not asking
	* for the world to become colourless - and honouring it is what lets the clock's night resume
	* after a cutscene instead of being wiped flat until the next hour.
	* @param {string} sourceKey Who is declaring, ex: `command`.
	* @param {ToneDeclaration} declaration What that source wants.
	*/
	static declareTone(sourceKey, declaration) {
		if (declaration.isNeutral() === true) {
			ScreenLightingComposer.#releaseFrames = declaration.durationFrames();
			ScreenLightingComposer.#toneBySource.delete(sourceKey);
			return;
		}
		const previous = ScreenLightingComposer.#toneBySource.get(sourceKey);
		if (previous !== undefined && previous.matches(declaration) === true) return;
		ScreenLightingComposer.#toneBySource.set(sourceKey, declaration);
	}
	/**
	* Declares how dark one source says the scene is.
	* @param {string} sourceKey Who is declaring, ex: `map`.
	* @param {AmbientDeclaration} declaration What that source wants.
	*/
	static declareAmbient(sourceKey, declaration) {
		const previous = ScreenLightingComposer.#ambientBySource.get(sourceKey);
		if (previous !== undefined && previous.matches(declaration) === true) return;
		ScreenLightingComposer.#ambientBySource.set(sourceKey, declaration);
	}
	/**
	* Declares the complete set of lights one source is responsible for.
	*
	* This replaces whatever that source had before and leaves every other source alone, which is the
	* property that lets a torch go out without disturbing the lantern the player is holding.
	* @param {string} sourceKey Who is declaring, ex: `page`.
	* @param {LightDeclaration[]} declarations Everything that source wants, in full.
	*/
	static declareLights(sourceKey, declarations) {
		const previous = ScreenLightingComposer.#lightsBySource.get(sourceKey);
		if (ScreenLightingComposer.#areLightsIdentical(previous, declarations) === true) return;
		ScreenLightingComposer.#lightsBySource.set(sourceKey, declarations);
	}
	/**
	* Withdraws everything one source had declared.
	* @param {string} sourceKey Who is withdrawing.
	*/
	static removeDeclarations(sourceKey) {
		const outgoing = ScreenLightingComposer.#toneBySource.get(sourceKey);
		if (outgoing !== undefined) {
			ScreenLightingComposer.#releaseFrames = outgoing.durationFrames();
		}
		ScreenLightingComposer.#toneBySource.delete(sourceKey);
		ScreenLightingComposer.#ambientBySource.delete(sourceKey);
		ScreenLightingComposer.#lightsBySource.delete(sourceKey);
	}
	/**
	* Reports what the screen should look like this frame, advancing any journey in progress.
	* @returns {LightingComposition}
	*/
	static compose() {
		if (ScreenLightingComposer.#composedFrame === Graphics.frameCount) {
			return ScreenLightingComposer.#composition;
		}
		ScreenLightingComposer.#composedFrame = Graphics.frameCount;
		ScreenLightingComposer.#advanceTone();
		const darkness = ScreenLightingComposer.#composeDarkness();
		const ambientColor = ScreenLightingComposer.#composeAmbientColor();
		const lights = ScreenLightingComposer.#composeLights();
		const tone = ScreenLightingComposer.#currentTone;
		ScreenLightingComposer.#composition = new LightingComposition(tone, darkness, ambientColor, lights);
		return ScreenLightingComposer.#composition;
	}
	/**
	* Discards everything the composer knows.
	*
	* Nothing in the game needs this - the composer's state is rebuilt by arriving anywhere - but a
	* test sharing the composer between cases does, and so does anything wanting a hard reset.
	*/
	static reset() {
		ScreenLightingComposer.#toneBySource.clear();
		ScreenLightingComposer.#ambientBySource.clear();
		ScreenLightingComposer.#lightsBySource.clear();
		ScreenLightingComposer.#currentTone = [
			0,
			0,
			0,
			0
		];
		ScreenLightingComposer.#toneDestination = [
			0,
			0,
			0,
			0
		];
		ScreenLightingComposer.#toneFramesRemaining = 0;
		ScreenLightingComposer.#releaseFrames = ScreenLightingComposer.DEFAULT_RELEASE_FRAMES;
		ScreenLightingComposer.#composedFrame = -1;
		ScreenLightingComposer.#composition = new LightingComposition([
			0,
			0,
			0,
			0
		], 0, [
			0,
			0,
			0
		], []);
	}
	/**
	* Moves the live tone one frame closer to wherever it is headed, restarting if the target moved.
	*
	* The destination is recomputed every frame rather than remembered, because the thing that decides
	* it is a priority contest whose entrants come and go. A cutscene starting outranks the clock the
	* instant it is declared, and the clock takes the screen back the instant the cutscene withdraws -
	* neither of which involves anybody telling this method anything.
	*/
	static #advanceTone() {
		const winner = ScreenLightingComposer.#winningTone();
		const destination = winner === null ? LightingChannels.identityFor(LightingChannels.TONE) : winner.tone();
		if (ScreenLightingComposer.#isSameTone(destination) === false) {
			const frames = winner === null ? ScreenLightingComposer.#releaseFrames : winner.durationFrames();
			ScreenLightingComposer.#toneDestination = destination;
			ScreenLightingComposer.#toneFramesRemaining = Math.max(frames, 1);
		}
		if (ScreenLightingComposer.#toneFramesRemaining <= 0) return;
		const remaining = ScreenLightingComposer.#toneFramesRemaining;
		const target = ScreenLightingComposer.#toneDestination;
		ScreenLightingComposer.#currentTone = ScreenLightingComposer.#currentTone.map((channel, index) => LightingEasing.stepToward(channel, target.at(index), remaining));
		ScreenLightingComposer.#toneFramesRemaining -= 1;
	}
	/**
	* The tone declaration belonging to the highest-ranking source that made one.
	* @returns {ToneDeclaration|null} The winning declaration, or null when nobody wants the screen.
	*/
	static #winningTone() {
		const ordered = ScreenLightingComposer.#ascendingByPriority(ScreenLightingComposer.#toneBySource);
		if (ordered.length === 0) return null;
		const [winner] = ordered.slice(-1);
		return winner;
	}
	/**
	* Determines whether the live destination already matches a proposed one.
	* @param {number[]} destination The tone being proposed.
	* @returns {boolean}
	*/
	static #isSameTone(destination) {
		const current = ScreenLightingComposer.#toneDestination;
		return current.every((channel, index) => channel === destination.at(index));
	}
	/**
	* Compounds every source's darkness into the single fraction the mask is drawn from.
	* @returns {number}
	*/
	static #composeDarkness() {
		const declarations = ScreenLightingComposer.#ascendingByPriority(ScreenLightingComposer.#ambientBySource);
		const identity = LightingChannels.identityFor(LightingChannels.AMBIENT);
		const fold = (accumulated, declaration) => {
			return LightingChannels.combine(LightingChannels.AMBIENT, accumulated, declaration.darkness());
		};
		return declarations.reduce(fold, identity);
	}
	/**
	* Settles what colour the darkness is, among the sources with an opinion about it.
	*
	* Only sources that actually stated a colour are considered. The clock knows how dark night is and
	* has nothing to say about what colour a particular cave's dark should be, so it must not be able
	* to win this contest merely by outranking the cave on the other question.
	* @returns {number[]}
	*/
	static #composeAmbientColor() {
		const declarations = ScreenLightingComposer.#ascendingByPriority(ScreenLightingComposer.#ambientBySource);
		const opinionated = declarations.filter((declaration) => declaration.hasDeclaredColor() === true);
		const identity = LightingChannels.identityFor(LightingChannels.AMBIENT_COLOR);
		const fold = (accumulated, declaration) => {
			return LightingChannels.combine(LightingChannels.AMBIENT_COLOR, accumulated, declaration.color());
		};
		return opinionated.reduce(fold, identity);
	}
	/**
	* Gathers every live light from every source into one list.
	*
	* Lights are a union rather than a contest. Two sources lighting the same room is two lights, and
	* the additive blend that composites them is what makes overlapping pools brighten where they meet.
	* @returns {LightDeclaration[]}
	*/
	static #composeLights() {
		const gathered = [];
		ScreenLightingComposer.#lightsBySource.forEach((declarations) => gathered.push(...declarations));
		return gathered;
	}
	/**
	* Sorts a source-keyed map's values so the most assertive source comes last.
	*
	* Last, not first, because the claiming channels resolve by letting each incoming value overwrite
	* the one before it. Reversing this quietly hands the screen to whichever source cares least.
	* @param {Map<string, Object>} bySource The declarations to order.
	* @returns {Object[]} The declarations, least assertive first.
	*/
	static #ascendingByPriority(bySource) {
		const entries = Array.from(bySource.entries());
		const sorted = entries.sort((first, second) => {
			const firstPriority = ScreenLightingComposer.#priorityOf(first.at(0));
			const secondPriority = ScreenLightingComposer.#priorityOf(second.at(0));
			return firstPriority - secondPriority;
		});
		return sorted.map((entry) => entry.at(1));
	}
	/**
	* How strongly a source key outranks others.
	*
	* Source keys carry an id for anything there can be several of at once - `page:12` is the twelfth
	* event's torch, and a map full of them are all equally page-ranked. The part in front of the
	* colon is what says how a declaration should behave; the part after it only says which one.
	* @param {string} sourceKey The source key to rank.
	* @returns {number}
	*/
	static #priorityOf(sourceKey) {
		const sourceKind = ScreenLightingComposer.#kindOf(sourceKey);
		if (ScreenLightingComposer.#sourcePriorities.has(sourceKind) === false) return 0;
		return ScreenLightingComposer.#sourcePriorities.get(sourceKind);
	}
	/**
	* The kind of source a key names, which is everything in front of the colon.
	* @param {string} sourceKey The source key to read.
	* @returns {string}
	*/
	static #kindOf(sourceKey) {
		const [sourceKind] = sourceKey.split(":");
		return sourceKind;
	}
	/**
	* Withdraws every declaration whose source is of one kind.
	*
	* Leaving a map has to drop every torch on it, and there is no list of which events had one -
	* the events themselves are about to be replaced. Clearing by kind is what makes that possible
	* without core keeping a register it would then have to keep correct.
	* @param {string} sourceKind The kind of source to withdraw, ex: `page`.
	*/
	static removeDeclarationKind(sourceKind) {
		const everyKey = [
			...ScreenLightingComposer.#toneBySource.keys(),
			...ScreenLightingComposer.#ambientBySource.keys(),
			...ScreenLightingComposer.#lightsBySource.keys()
		];
		const matching = everyKey.filter((sourceKey) => ScreenLightingComposer.#kindOf(sourceKey) === sourceKind);
		matching.forEach((sourceKey) => ScreenLightingComposer.removeDeclarations(sourceKey));
	}
	/**
	* Determines whether two sets of light declarations ask for exactly the same thing.
	* @param {LightDeclaration[]} previous What the source had declared before, if anything.
	* @param {LightDeclaration[]} incoming What it is asking for now.
	* @returns {boolean}
	*/
	static #areLightsIdentical(previous, incoming) {
		if (previous === undefined) return false;
		if (previous.length !== incoming.length) return false;
		return previous.every((declaration, index) => declaration.matches(incoming.at(index)));
	}
};

//#endregion
//#region src/plugins/lighting/core/managers/MapAmbientCoordinator.js
/**
* Keeps the darkness a place is ordinarily in, and lets an event argue with it.
*
* A map's `<ambient:>` tag says what somewhere is like when nothing else is going on, which is the
* right default and the wrong answer for a room whose lights can come on. Reading the tag and
* withdrawing it are therefore two separate operations rather than one, so a cutscene can say "the
* lights are working now" without having to know what the map said in the first place - and without
* that knowledge having to be copied into the event.
*
* Withdrawal lasts only as long as the visit. Walking back in re-reads the tag, so a room returns to
* being what the map says it is unless something turns the lights on again. Anything that should
* outlive a transfer is a switch and a page, which is eventing's job rather than this plugin's.
*/
var MapAmbientCoordinator = class MapAmbientCoordinator {
	/**
	* The source key a map's own darkness is declared under.
	* @type {string}
	*/
	static SOURCE_KEY = "map";
	/**
	* Reads the current map's darkness and declares it, or declares nothing at all.
	*
	* A map with no tag declares nothing, and that silence is load-bearing: it is what leaves every
	* map authored before this plugin existed exactly as bright as it always was.
	*/
	static refresh() {
		const payload = RPGManager.getStringFromNoteByRegex($dataMap, J.LIGHTING.RegExp.Ambient, true);
		if (payload === null) {
			ScreenLightingComposer.removeDeclarations(MapAmbientCoordinator.SOURCE_KEY);
			return;
		}
		const declaration = LightingTagParser.parseAmbientPayload(payload, MapAmbientCoordinator.SOURCE_KEY);
		if (declaration === null) return;
		ScreenLightingComposer.declareAmbient(MapAmbientCoordinator.SOURCE_KEY, declaration);
	}
	/**
	* Withdraws the darkness this map declared, until the player next arrives here.
	*
	* This is what an event does when the lights come on. It is a withdrawal rather than a declaration
	* of brightness because darkness compounds - declaring "no darkness" would compound to exactly the
	* darkness already there and change nothing at all.
	*/
	static suppress() {
		ScreenLightingComposer.removeDeclarations(MapAmbientCoordinator.SOURCE_KEY);
	}
};

//#endregion
//#region src/plugins/lighting/core/managers/PlayerLightCoordinator.js
/**
* Keeps the light the player is carrying in step with who the player currently is and what they hold.
*
* The player has no light of their own. That is deliberate: a globe that follows the party
* everywhere makes true darkness unreachable, because the one place a player can always see is
* wherever they are standing. So the light comes from the leader's own notes instead - an equipped
* lantern, a glowing state, a class that sees in the dark - which makes carrying light a thing the
* game can give and take away rather than a setting.
*
* Reading those notes is cheap enough to do on demand: `getAllNotes` is cached on the battler and
* invalidated whenever their equipment, states or skills change, and the note-parsing behind it is
* cached per regex. Two cache hits is less work than keeping a subscription correct would be.
*/
var PlayerLightCoordinator = class PlayerLightCoordinator {
	/**
	* The source key every light the player carries is declared under.
	* @type {string}
	*/
	static SOURCE_KEY = "player";
	/**
	* The stand-in identity for having nobody to read lights from.
	*
	* A party can genuinely be empty - a full wipe, or a moment during setup before anybody has been
	* added - and `Game_Party#leader` hands back nothing at all when it is. A sentinel means the
	* change check can compare identities without ever reading through the nothing.
	* @type {string}
	*/
	static NO_LEADER = "none";
	/**
	* Who the lights currently declared were read from.
	* @type {string}
	*/
	static #lastLeaderKey = PlayerLightCoordinator.NO_LEADER;
	/**
	* Re-reads the leader's lights and declares them, whatever they turn out to be.
	* @returns {void}
	*/
	static refresh() {
		const leader = $gameParty.leader();
		PlayerLightCoordinator.#lastLeaderKey = PlayerLightCoordinator.#keyOf(leader);
		if (PlayerLightCoordinator.#lastLeaderKey === PlayerLightCoordinator.NO_LEADER) {
			ScreenLightingComposer.removeDeclarations(PlayerLightCoordinator.SOURCE_KEY);
			return;
		}
		const noteObjects = leader.getAllNotes();
		const sourceKey = PlayerLightCoordinator.SOURCE_KEY;
		const declarations = LightingTagParser.parseNoteObjects(noteObjects, $gamePlayer, sourceKey);
		ScreenLightingComposer.declareLights(sourceKey, declarations);
	}
	/**
	* Re-reads the leader's lights only if the party is now being led by somebody else.
	*
	* The leader *changing* is a different event from the leader's data changing, and the hook that
	* catches the second cannot catch the first: when party cycling swaps who is in front, nothing
	* about either actor's data changed - only the question of whose data to read. Party cycling also
	* lives in J-ABS, which this plugin must run without, so there is no hook to alias even if one
	* would do. Comparing identities where the composition is already being asked for costs one
	* string comparison a frame and is correct whether J-ABS is installed or not.
	* @returns {void}
	*/
	static refreshIfLeaderChanged() {
		const leader = $gameParty.leader();
		const currentKey = PlayerLightCoordinator.#keyOf(leader);
		if (currentKey === PlayerLightCoordinator.#lastLeaderKey) return;
		PlayerLightCoordinator.refresh();
	}
	/**
	* The identity of whoever is leading, in a form that is safe to compare.
	* @param {Game_Actor} leader The party leader, if there is one.
	* @returns {string}
	*/
	static #keyOf(leader) {
		if (leader === undefined) return PlayerLightCoordinator.NO_LEADER;
		return `${leader.actorId()}`;
	}
	/**
	* Forgets who was last read from.
	*
	* Only a test needs this; in a running game the coordinator is re-seeded by arriving anywhere.
	*/
	static reset() {
		PlayerLightCoordinator.#lastLeaderKey = PlayerLightCoordinator.NO_LEADER;
	}
};

//#endregion
//#region src/plugins/lighting/core/database/DataManager.js
/**
* Extends {@link #createGameObjects}.<br/>
* Forgets every lighting declaration from whatever game was being played before this one.
*
* The composer deliberately keeps its state in memory rather than on a game object, which is what
* makes this plugin invisible to the save file - but it also means nothing about loading a save
* clears it. Without this, loading partway through a tinted cutscene would carry that tint into the
* loaded game, and the cave you saved in would still be dark in the field you loaded into.
*
* `createGameObjects` is the one hook that runs for both a new game and a load, which is exactly the
* set of moments where "the game being played is now a different game" becomes true.
*/
J.LIGHTING.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.LIGHTING.Aliased.DataManager.get("createGameObjects").call(this);
	ScreenLightingComposer.reset();
	PlayerLightCoordinator.reset();
};

//#endregion
//#region src/plugins/lighting/core/objects/Game_Screen.js
/**
* Extends {@link #startTint}.<br/>
* Declares the requested tone to the composer under the `command` source.
*
* This is the door every tint in the game comes through. An event's Tint Screen command is literally
* `$gameScreen.startTint(params[0], params[1])`, and a script call is the same method by another
* name, so aliasing here catches every cutscene, every plugin and every hand-written call without
* any of them needing to know this plugin exists.
*
* The original logic still runs, so `$gameScreen` keeps behaving exactly as the engine designed. It
* simply stops being the only voice deciding what reaches the screen.
*/
J.LIGHTING.Aliased.Game_Screen.set("startTint", Game_Screen.prototype.startTint);
Game_Screen.prototype.startTint = function(tone, duration) {
	J.LIGHTING.Aliased.Game_Screen.get("startTint").call(this, tone, duration);
	this.declareLightingTone(tone, duration);
};
/**
* Passes a requested screen tone to the lighting composer.
*
* The arguments are used rather than the fields the engine just wrote them into, and that is the
* whole trick: what arrives here is a *destination*, which is what a declaration must carry. Reading
* the live tone instead would mean composing against an interpolation that matches nobody's intent
* partway through a fade, and the screen would lurch toward a colour no source ever asked for.
* @param {[number, number, number, number]} tone The tone being travelled toward.
* @param {number} duration How many frames the journey should take.
*/
Game_Screen.prototype.declareLightingTone = function(tone, duration) {
	const declaration = new ToneDeclaration(tone, duration, "command");
	ScreenLightingComposer.declareTone("command", declaration);
};
/**
* Overrides {@link #tone}.<br/>
* Reports the tone every source composed together, rather than only the last one to write.
*
* This is where the composed colour actually reaches the screen, and it reaches it by answering the
* question the engine was already asking: `Spriteset_Base#updateBaseFilters` reads this every frame
* and hands the answer to the colour filter on the base sprite. Answering here rather than reaching
* into that filter directly means battle is covered by the same three lines as the map, since
* `Spriteset_Battle` inherits the very same method.
*
* The engine's own interpolation underneath is untouched and still runs; it simply is not what gets
* painted any more. That matters for an event that tints and then transfers - the engine has always
* let a tint outlive a map change, nothing clears it on the way through, and a cutscene that expects
* its red to follow the player through a door still gets exactly that.
* @returns {[number, number, number, number]}
*/
Game_Screen.prototype.tone = function() {
	const composition = ScreenLightingComposer.compose();
	return composition.tone();
};

//#endregion
//#region src/plugins/lighting/core/objects/Game_Event.js
/**
* Extends {@link #setupPage}.<br/>
* Reads whatever lights the newly-active page declares and hands them to the composer.
*/
J.LIGHTING.Aliased.Game_Event.set("setupPage", Game_Event.prototype.setupPage);
Game_Event.prototype.setupPage = function() {
	J.LIGHTING.Aliased.Game_Event.get("setupPage").call(this);
	this.refreshDeclaredLights();
};
/**
* Declares whatever lights this event's active page asks for.
*
* A page is the right home for a light because a light is a thing that can stop. An unlit torch is
* page one with no tag; setting it alight is a self-switch and page two, and the light arrives with
* the page that describes a burning torch. Nothing has to register the event as ignitable, and
* nothing has to remember to put the light out.
*
* This runs far more often than a page actually changes - `Game_Map#refresh` re-runs page setup for
* every event on the map whenever a single self-switch flips anywhere. The composer compares the
* incoming declarations against what it already holds and does nothing when they agree.
*/
Game_Event.prototype.refreshDeclaredLights = function() {
	const sourceKey = this.lightingSourceKey();
	const comments = this.lightingCommentTexts();
	const declarations = LightingTagParser.parseComments(comments, this, sourceKey);
	ScreenLightingComposer.declareLights(sourceKey, declarations);
};
/**
* The source key under which this event's lights are declared.
*
* Every event needs its own key because the composer holds one set of declarations for the whole
* screen rather than one per character. A shared `page` key would mean each torch on a map wiped out
* the one declared before it, and the last event to refresh would be the only thing still burning.
* @returns {string}
*/
Game_Event.prototype.lightingSourceKey = function() {
	return `page:${this.eventId()}`;
};
/**
* The text of every parsable comment on this event's active page.
*
* Comment blocks in the editor are stored as one command for the first line and another for each
* line after it, and J-Base's comment reader honours both - so a light tag written on the third line
* of a block is found exactly like one written on its own.
* @returns {string[]}
*/
Game_Event.prototype.lightingCommentTexts = function() {
	const commands = this.getValidCommentCommands();
	return commands.map((command) => {
		const [comment] = command.parameters;
		return comment;
	});
};

//#endregion
//#region src/plugins/lighting/core/objects/Game_Actor.js
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Re-reads the light this actor is carrying, when this actor is the one leading the party.
*
* That hook already fires whenever equipment, states or skills change, and it is what invalidates
* the note cache this reads through - so equipping a lantern or gaining a glowing state updates the
* screen with nothing polling for it.
*/
J.LIGHTING.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.LIGHTING.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.refreshCarriedLight();
};
/**
* Re-reads whatever light the party leader is carrying.
*
* Every actor's data change routes through here rather than only the leader's, because an actor in
* the back of the party can become the leader later and the reverse is just as true - deciding
* whether this particular change matters costs more than simply re-reading, which is two cache hits.
*/
Game_Actor.prototype.refreshCarriedLight = function() {
	PlayerLightCoordinator.refresh();
};

//#endregion
//#region src/plugins/lighting/core/scenes/Scene_Map.js
/**
* Extends {@link #onMapLoaded}.<br/>
* Retires the previous map's lighting and declares the arriving map's own.
*
* This is the arrival hook rather than `Game_Map#setup`, and the difference matters: `setup` only
* runs when the player is actually transferring, so loading a save straight into a dark cave would
* never declare its darkness and the cave would come up lit. This runs for every kind of arrival -
* transfers, save loads and new games alike - and it is the first point at which `$dataMap` is the
* map being entered rather than the one being left.
*/
J.LIGHTING.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function() {
	MapAmbientCoordinator.refresh();
	J.LIGHTING.Aliased.Scene_Map.get("onMapLoaded").call(this);
	this.refreshMapLighting();
	PlayerLightCoordinator.refresh();
};
/**
* Rebuilds every event light on the map being arrived at, from scratch.
*
* Withdrawing and re-declaring rather than merely withdrawing is the whole point, and the asymmetry
* that makes it necessary is easy to miss: only a *transfer* runs `Game_Map#setup`, and only `setup`
* calls `setupPage` on each event. Closing the menu, or loading a save, arrives here without either
* - so anything that clears the page lights on the way in and waits for the events to announce
* themselves again is waiting for something that will never happen, and the map comes back with its
* ambient intact and every torch out.
*
* Clearing the whole kind first is what keeps a departed map's torches from lingering: lights are
* keyed by event id, so arriving somewhere with fewer events would otherwise strand the surplus -
* event seven's torch still burning on a map whose seventh event is a barrel. Removal is by source,
* so the leader's lantern and any cutscene tint are declared under other kinds and survive it.
*/
Scene_Map.prototype.refreshMapLighting = function() {
	ScreenLightingComposer.removeDeclarationKind("page");
	$gameMap.events().forEach((event) => event.refreshDeclaredLights());
};

//#endregion
//#region src/plugins/lighting/core/sprites/LightingRenderLayer.js
/**
* The offscreen scene the light mask is composited from, never shown to anybody directly.
*
* Two stages are needed rather than one, and the reason is a property of how blending works: a
* container has no blend mode of its own in PIXI 5, and even if it had, its children would each
* blend against whatever is behind the container rather than against each other first. A white light
* blended into the world by multiplication does nothing at all, and a black ambient sheet blended
* the same way turns the world off. Overlapping torches have to be added *together* before the
* result is multiplied *into* the scene, and nothing but a separate render target can do that.
*
* The plugin this replaces reached the same conclusion and composited onto a 2D canvas, which cost a
* full-screen texture upload every frame. This composites on the GPU, where the pixels already live.
*/
var LightingRenderLayer = class LightingRenderLayer extends PIXI.Container {
	/**
	* The sheet of darkness every light is punched out of.
	* @type {PIXI.Sprite}
	*/
	#ambientFill = null;
	/**
	* Everything being drawn for one light, kept under that light's own identity.
	*
	* Keyed by identity rather than held in an array alongside the declarations, because a light's
	* place in that list is not a property of the light. A torch is the fourth thing burning until a
	* projectile spawns, and then it is the fifth - and if its phase and its tempo live at index four,
	* the torch inherits somebody else's cycle the instant anything appears beside it.
	*
	* That is not a hypothetical: a handful of enemies firing projectiles changes the light count
	* almost every frame, which under an index-keyed scheme re-seeded every light on the screen sixty
	* times a second. Nothing could complete a cycle, so nothing pulsed - it only jittered between the
	* right two bounds.
	* @type {Map<string, {sprite: PIXI.Sprite, phase: number, rate: number, textureKey: string}>}
	*/
	#lightsByKey = new Map();
	/**
	* How far the layer extends past the screen on every side, in pixels.
	* @type {number}
	*/
	#margin = 0;
	/**
	* The darkness the ambient fill is currently painted for.
	* @type {number}
	*/
	#paintedDarkness = -1;
	/**
	* The colour the ambient fill is currently painted for.
	* @type {number[]}
	*/
	#paintedColor = [
		-1,
		-1,
		-1
	];
	/**
	* Constructor.
	* @param {number} width How wide the layer is, including its margins.
	* @param {number} height How tall the layer is, including its margins.
	* @param {number} margin How far the layer extends past the screen on every side.
	*/
	constructor(width, height, margin) {
		super();
		this.#margin = margin;
		this.#ambientFill = LightingRenderLayer.#buildAmbientFill(width, height);
		this.addChild(this.#ambientFill);
	}
	/**
	* Brings the layer into agreement with what the composer says the screen should look like.
	* @param {LightingComposition} composition What every source, taken together, is asking for.
	*/
	syncTo(composition) {
		this.#syncAmbient(composition);
		this.#syncLights(composition);
	}
	/**
	* Repaints the sheet of darkness, but only when the darkness has actually changed.
	*
	* The render pass itself runs every frame regardless, because torches move with the camera - but
	* the fill behind them is a solid colour that changes only when the hour turns or the player walks
	* into somewhere darker, which is a few times an hour rather than sixty times a second.
	* @param {LightingComposition} composition What is being asked for.
	*/
	#syncAmbient(composition) {
		const darkness = composition.darkness();
		const color = composition.ambientColor();
		if (this.#isAmbientPainted(darkness, color) === true) return;
		this.#paintedDarkness = darkness;
		this.#paintedColor = color;
		this.#ambientFill.tint = LightingRenderLayer.#maskTintFor(darkness, color);
	}
	/**
	* Determines whether the ambient fill is already painted for a given darkness.
	* @param {number} darkness The darkness being asked for.
	* @param {number[]} color The colour being asked for.
	* @returns {boolean}
	*/
	#isAmbientPainted(darkness, color) {
		if (this.#paintedDarkness !== darkness) return false;
		return this.#paintedColor.every((channel, index) => channel === color.at(index));
	}
	/**
	* Brings the drawn lights into agreement with the declared ones, and moves them where they belong.
	* @param {LightingComposition} composition What is being asked for.
	*/
	#syncLights(composition) {
		const declarations = composition.lights();
		const identities = LightingRenderLayer.#identitiesOf(declarations);
		this.#retireLightsOtherThan(identities);
		declarations.forEach((declaration, index) => this.#placeLight(declaration, identities.at(index)), this);
	}
	/**
	* Names every declared light in a way that survives the list around it changing.
	*
	* A source key alone is not enough - one event may declare several lights, and the player's
	* equipment routinely declares more than one - so each light is numbered within its own source.
	* That pairing is stable for exactly as long as the light is: a torch keeps its name while
	* anything at all spawns or dies elsewhere on the map.
	* @param {LightDeclaration[]} declarations Every light being asked for this frame.
	* @returns {string[]} One identity per declaration, in the same order.
	*/
	static #identitiesOf(declarations) {
		const seenPerSource = new Map();
		return declarations.map((declaration) => {
			const sourceKey = declaration.sourceKey();
			const ordinal = seenPerSource.get(sourceKey) ?? 0;
			seenPerSource.set(sourceKey, ordinal + 1);
			return `${sourceKey}#${ordinal}`;
		});
	}
	/**
	* Takes down the sprite of every light that is no longer being asked for.
	*
	* Withdrawing one light must leave every other one exactly as it was, which is the whole reason
	* this removes by name instead of rebuilding the set. A projectile expiring beside a torch is not
	* a reason for the torch to start its cycle again.
	* @param {string[]} identities The names of every light that should still exist.
	*/
	#retireLightsOtherThan(identities) {
		const wanted = new Set(identities);
		this.#lightsByKey.forEach((entry, key) => {
			if (wanted.has(key) === true) return;
			this.removeChild(entry.sprite);
			this.#lightsByKey.delete(key);
		}, this);
	}
	/**
	* Moves one light to wherever its character currently is, and sets how brightly it is burning.
	* @param {LightDeclaration} declaration The light being placed.
	* @param {string} identity What this light is called.
	*/
	#placeLight(declaration, identity) {
		const entry = this.#entryFor(declaration, identity);
		const character = declaration.character();
		entry.sprite.x = character.screenX() + this.#margin;
		entry.sprite.y = character.screenY() + this.#margin;
		entry.sprite.alpha = this.#strengthOf(declaration, entry);
	}
	/**
	* Everything being drawn for one light, built on first sight and kept for as long as it burns.
	*
	* A light that changes what it looks like - a page swapping a small flame for a bonfire under the
	* same event - keeps its identity and therefore its place in its cycle, and is simply handed the
	* new picture. Only a genuinely new light rolls a fresh phase.
	* @param {LightDeclaration} declaration The light being drawn.
	* @param {string} identity What this light is called.
	* @returns {{sprite: PIXI.Sprite, phase: number, rate: number, textureKey: string}}
	*/
	#entryFor(declaration, identity) {
		const existing = this.#lightsByKey.get(identity);
		if (existing !== undefined) {
			if (existing.textureKey !== declaration.textureKey()) {
				existing.sprite.bitmap = LightTextureCache.forDeclaration(declaration);
				existing.textureKey = declaration.textureKey();
			}
			return existing;
		}
		return this.#buildEntry(declaration, identity);
	}
	/**
	* Builds the sprite and the cycle a newly-appeared light will live by.
	* @param {LightDeclaration} declaration The light being drawn.
	* @param {string} identity What this light is called.
	* @returns {{sprite: PIXI.Sprite, phase: number, rate: number, textureKey: string}}
	*/
	#buildEntry(declaration, identity) {
		const sprite = new Sprite();
		sprite.bitmap = LightTextureCache.forDeclaration(declaration);
		sprite.blendMode = PIXI.BLEND_MODES.ADD;
		sprite.anchor.set(.5, .5);
		this.addChild(sprite);
		const tuning = J.LIGHTING.Metadata.tuningFor(declaration.effect());
		const entry = {
			sprite,
			phase: LightingEasing.randomPhase(),
			rate: LightingEasing.randomRate(tuning.variance),
			textureKey: declaration.textureKey()
		};
		this.#lightsByKey.set(identity, entry);
		return entry;
	}
	/**
	* How brightly a light should be burning this frame.
	*
	* This is the only place a light's effect is ever felt: it moves the sprite's alpha and nothing
	* else. The picture underneath is untouched, which is what lets a guttering torch and a steady one
	* of the same appearance go on sharing a single cached texture between them.
	* @param {LightDeclaration} declaration The light being judged.
	* @param {{phase: number, rate: number}} entry The cycle this particular light is living by.
	* @returns {number}
	*/
	#strengthOf(declaration, entry) {
		const effect = declaration.effect();
		const tuning = J.LIGHTING.Metadata.tuningFor(effect);
		return LightingEasing.strengthFor(effect, Graphics.frameCount, entry.phase, tuning, entry.rate);
	}
	/**
	* Builds the full-bleed sheet that the darkness is painted onto.
	* @param {number} width How wide the sheet is.
	* @param {number} height How tall the sheet is.
	* @returns {PIXI.Sprite}
	*/
	static #buildAmbientFill(width, height) {
		const fill = new PIXI.Sprite(PIXI.Texture.WHITE);
		fill.width = width;
		fill.height = height;
		return fill;
	}
	/**
	* The colour the darkness sheet has to be for a given darkness and colour of dark.
	*
	* The mask is multiplied into the scene, so each channel of this colour is the fraction of that
	* channel the world gets to keep. White keeps everything and is what "not dark" means; black keeps
	* nothing. A coloured dark keeps *more of some channels than others*, which is how a cave can be
	* nearly black and still unmistakably teal - multiplication can take light away unevenly, which is
	* the one thing the engine's additive screen tone was never able to do.
	* @param {number} darkness How much light is gone, 0 through 1.
	* @param {number[]} color What colour the dark is, as `[r, g, b]`.
	* @returns {number} The colour as `0xRRGGBB`.
	*/
	static #maskTintFor(darkness, color) {
		const light = 1 - darkness;
		const channels = color.map((channel) => {
			const kept = light + darkness * (channel / 255);
			return Math.round(kept * 255);
		});
		return LightingColor.toTintNumber(channels);
	}
};

//#endregion
//#region src/plugins/lighting/core/sprites/Sprite_LightMask.js
/**
* The single sprite that takes light away from the map.
*
* Everything interesting happens offscreen. This holds a render texture, asks the render layer to
* composite the darkness and every light into it, and shows the result multiplied into the scene.
* Multiplication is what makes a light a *hole* rather than a glow: where the texture is white the
* world survives untouched, where it is black the world is gone, and a torch is simply a bright
* patch in an otherwise dark sheet.
*/
var Sprite_LightMask = class Sprite_LightMask extends Sprite {
	/**
	* How far past the screen the mask extends on every side, in pixels.
	*
	* The spriteset shakes as a whole, mask included, so a mask sized exactly to the screen slides off
	* its own edge during a screen shake and shows a bright strip of undarkened world where it ran
	* out. One tile of overdraw is comfortably more than any shake the engine produces, and costs a
	* border of texture nobody ever sees.
	* @type {number}
	*/
	static MARGIN = 48;
	/**
	* Initializes this sprite.
	*
	* Members are seeded here rather than in class fields because `Sprite`'s constructor calls
	* `initialize` on the way past, which means class fields have not been installed yet by the time
	* anything this method reaches could run.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
		this.prepareMask();
	}
	/**
	* Initializes all properties of this sprite.
	*/
	initMembers() {
		/**
		* The texture the darkness and every light are composited into each frame.
		* @type {PIXI.RenderTexture}
		*/
		this._renderTexture = null;
		/**
		* The offscreen scene that composite is built from.
		* @type {LightingRenderLayer}
		*/
		this._renderLayer = null;
	}
	/**
	* Gets the texture the composite is rendered into.
	* @returns {PIXI.RenderTexture} The renderTexture.
	*/
	renderTexture() {
		return this._renderTexture;
	}
	/**
	* Sets the texture the composite is rendered into.
	* @param {PIXI.RenderTexture} texture The new render target.
	*/
	setRenderTexture(texture) {
		this._renderTexture = texture;
	}
	/**
	* Gets the offscreen scene the composite is built from.
	* @returns {LightingRenderLayer} The renderLayer.
	*/
	renderLayer() {
		return this._renderLayer;
	}
	/**
	* Sets the offscreen scene the composite is built from.
	* @param {LightingRenderLayer} layer The new offscreen scene.
	*/
	setRenderLayer(layer) {
		this._renderLayer = layer;
	}
	/**
	* Builds the render target, the offscreen scene, and this sprite's own blending.
	*/
	prepareMask() {
		const margin = Sprite_LightMask.MARGIN;
		const width = Graphics.width + margin * 2;
		const height = Graphics.height + margin * 2;
		this.setRenderTexture(PIXI.RenderTexture.create(width, height));
		this.setRenderLayer(new LightingRenderLayer(width, height, margin));
		this.texture = this.renderTexture();
		this.blendMode = PIXI.BLEND_MODES.MULTIPLY;
		this.x = -margin;
		this.y = -margin;
	}
	/**
	* Extends {@link Sprite.update}.<br/>
	* Recomposites the darkness and every light into the render target.
	*/
	update() {
		super.update();
		PlayerLightCoordinator.refreshIfLeaderChanged();
		const composition = ScreenLightingComposer.compose();
		this.visible = composition.hasMask();
		if (this.visible === false) return;
		this.renderLayer().syncTo(composition);
		this.renderComposite();
	}
	/**
	* Draws the offscreen scene into the render target.
	*
	* This runs every frame even though the darkness rarely changes, because the lights inside it move
	* with the camera - a torch two tiles away is somewhere different the moment the player walks. It
	* is one GPU pass over a screen-sized target, which is the cheap half of what the plugin this
	* replaces was doing sixty times a second on the CPU.
	*/
	renderComposite() {
		const { renderer } = Graphics.app;
		const layer = this.renderLayer();
		const target = this.renderTexture();
		renderer.render(layer, target);
	}
};

//#endregion
//#region src/plugins/lighting/core/sprites/Spriteset_Map.js
/**
* Extends {@link Spriteset_Map.createLowerLayer}.<br/>
* Builds the light mask and slots it directly above the weather.
*/
J.LIGHTING.Aliased.Spriteset_Map.set("createLowerLayer", Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function() {
	J.LIGHTING.Aliased.Spriteset_Map.get("createLowerLayer").call(this);
	this.createLightMask();
};
/**
* Creates the light mask and places it in the display tree.
*
* The mask is inserted at an index rather than appended, and that one decision draws the line
* between what goes dark and what does not. Appending would put it above or below the other
* plugins' spriteset layers depending purely on the order `plugins.js` happens to list them, which
* is the kind of dependency that works until somebody reorders their plugin manager.
*
* Indexing off the weather is deterministic whoever runs first, and it puts the line exactly where
* it already sits for the screen tone: everything painted into the base sprite - the tilemap, the
* characters, their captions, the damage popups - is below and gets darkened. Everything a plugin
* adds to the spriteset itself is above and stays lit, which is where J-ABS already puts its cast
* previews and debug hitboxes. **Adding yourself to the spriteset is how you opt out of the dark.**
*
* Weather stays below deliberately. Rain falling through a pitch-black cavern should be rain you
* cannot see.
*/
Spriteset_Map.prototype.createLightMask = function() {
	const mask = new Sprite_LightMask();
	const weatherIndex = this.getChildIndex(this.weather());
	this.setLightMask(mask);
	this.addChildAt(mask, weatherIndex + 1);
};
/**
* Gets the sprite taking light away from this map.
* @returns {Sprite_LightMask} The lightMask.
*/
Spriteset_Map.prototype.lightMask = function() {
	return this._j._lighting._lightMask;
};
/**
* Sets the sprite taking light away from this map.
* @param {Sprite_LightMask} mask The new mask.
*/
Spriteset_Map.prototype.setLightMask = function(mask) {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with lighting.
	*/
	this._j._lighting ||= {};
	this._j._lighting._lightMask = mask;
};

//#endregion
//#region src/plugins/lighting/core/_metadata/pluginCommands.js
/**
* Darkens the scene for as long as the command source holds it.
*
* A cutscene wanting the lights to go out has nowhere else to say so: the map's own darkness is what
* the place is like ordinarily, and overwriting it would mean remembering to put it back. Declaring
* under a separate source means the map's ambient is still there underneath, still compounding, and
* still exactly what the room returns to when this is withdrawn.
*/
PluginManager.registerCommand(J.LIGHTING.Metadata.name, "applyAmbient", (args) => {
	const { darkness, color } = args;
	const payload = color ? `[${darkness}, ${color}]` : `[${darkness}]`;
	const declaration = LightingTagParser.parseAmbientPayload(payload, "command");
	if (declaration === null) return;
	ScreenLightingComposer.declareAmbient("command", declaration);
});
/**
* Withdraws whatever darkness a plugin command had applied.
*/
PluginManager.registerCommand(J.LIGHTING.Metadata.name, "removeAmbient", () => {
	ScreenLightingComposer.removeDeclarations("command");
});
/**
* Turns the lights on in a place the map itself calls dark.
*
* Withdrawing the map's own darkness rather than declaring brightness over the top of it is the only
* thing that works: darkness compounds, so a command asking for none of it would compound to exactly
* the darkness already there.
*/
PluginManager.registerCommand(J.LIGHTING.Metadata.name, "lightsOn", () => {
	MapAmbientCoordinator.suppress();
});
/**
* Gives a place its own darkness back after the lights were turned on.
*/
PluginManager.registerCommand(J.LIGHTING.Metadata.name, "lightsOff", () => {
	MapAmbientCoordinator.refresh();
});

//#endregion
//# sourceMappingURL=J-Lighting.js.map