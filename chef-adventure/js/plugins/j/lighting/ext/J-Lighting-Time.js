//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 LIGHTING-TIME] The day and night cycle, as colour and as darkness.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Lighting
 * @base J-TIME
 * @orderAfter J-Base
 * @orderAfter J-Lighting
 * @orderAfter J-TIME
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin makes the sky change with the clock.
 *
 * J-TIME knows what hour it is. J-Lighting owns what the screen looks like.
 * This is the piece in between: it decides what a given hour LOOKS like, and
 * declares that to the lighting system.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Lighting; this is an extension of it.
 * - J-TIME; this is where the hour comes from.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The day is six four-hour phases, each fading into the next across its own
 * four hours. Every phase says two things: what colour the light is, and how
 * much of it there is.
 *
 * Those are genuinely different tools. Colour is a tint over everything and
 * cannot have holes in it. Darkness is a mask that a torch can cut through.
 * Night used to be written entirely in colour, because colour was all there
 * was- which is why it read as "the world turned blue" rather than "you
 * cannot see". With both available, night can be dark AND cool rather than
 * having to fake one with the other.
 *
 * ----------------------------------------------------------------------------
 * WHAT THIS SHIPS WITH:
 * The colour curve is exactly what J-TIME used before this plugin existed,
 * value for value. The darkness curve ships at ZERO for every phase.
 *
 * That is deliberate. Installing this changes nothing about how the game
 * looks until somebody decides what night's darkness should be. The migration
 * is invisible; the art decision is separate, and it is yours.
 *
 * ============================================================================
 * CONFIGURATION:
 * The whole curve lives in `data/config.lighting-time.json`, so retuning what
 * night looks like is a data edit rather than a rebuild.
 *
 *  phases.<name>.tone      the [r, g, b, grey] that phase settles on
 *  phases.<name>.darkness  how much light it takes away, 0 through 1
 *  sequence                the phases in the order a day cycles through them
 *
 * The sequence lists the same phase at both ends on purpose. A day opens
 * partway through the fade INTO its first phase and closes having just
 * arrived back at it, so listing it twice lets one lookup serve every hour
 * with no wraparound special case.
 *
 * ============================================================================
 * MAPS WITHOUT A SKY:
 * A map tagged `<noToneChange>` opts out of all of this- an interior, a cave,
 * anywhere the sky is not visible. On such a map this plugin declares nothing
 * at all rather than declaring "neutral".
 *
 * That distinction matters. Declaring neutral would wipe out a tint an event
 * deliberately applied to an interior. Declaring nothing leaves whatever else
 * has a claim on the screen exactly where it is.
 *
 * `<noToneChange>` is about the SKY. It has nothing to do with J-Lighting's
 * `<ambient:...>`, and a cave usually wants both: no sky, and its own dark.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command lockTone
 * @text Freeze The Sky
 * @desc Stops the sky changing with the clock. The clock itself keeps running.
 *
 *
 * @command unlockTone
 * @text Unfreeze The Sky
 * @desc Lets the sky resume following the clock.
 */
//endregion annotations

//#region src/plugins/lighting/ext/time/_metadata/_pluginMetadata.js
/**
* The metadata for J-Lighting-Time.
*
* The whole day/night curve - what colour each phase is and how much light it takes away - lives in
* an external config rather than in source or in plugin parameters. Deciding what night looks like
* is an art decision that gets revisited, and revisiting it should be editing a file rather than
* rebuilding a plugin.
*/
var J_LIGHTING_TIME_PluginMetadata = class J_LIGHTING_TIME_PluginMetadata extends PluginMetadata {
	/**
	* The path where the config for the day/night curve is located.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.lighting-time.json";
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
	* Loads the day/night curve from external configuration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeCurve();
	}
	/**
	* Reads the day/night curve out of the external config.
	*
	* The sequence is bookended by the same phase at both ends on purpose. A day opens partway through
	* the fade *into* its first phase and closes having just arrived back at it, so listing it twice
	* lets one lookup serve every hour of the day with no wraparound special case anywhere.
	*/
	initializeCurve() {
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Lighting-Time").configName("day/night lighting curve").build();
		const parsed = ExternalJsonConfigLoader.load(J_LIGHTING_TIME_PluginMetadata.CONFIG_PATH, options);
		/**
		* The tone each phase of the day settles on, in the order a full day cycles through them.
		* @type {number[][]}
		*/
		this.toneSequence = parsed.sequence.map((phaseName) => parsed.phases[phaseName].tone);
		/**
		* The darkness each phase of the day settles on, in the order a full day cycles through them.
		* @type {number[]}
		*/
		this.darknessSequence = parsed.sequence.map((phaseName) => parsed.phases[phaseName].darkness);
	}
};

//#endregion
//#region src/plugins/lighting/ext/time/_metadata/initialization.js
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
	const requiredLightingVersion = "1.0.0";
	const lightingVersion = J.LIGHTING.Metadata.version.version();
	const hasLightingRequirement = J.BASE.Helpers.satisfies(lightingVersion, requiredLightingVersion);
	if (hasLightingRequirement === false) {
		throw new Error(`Either missing J-Lighting or has a lower version than the required: ${requiredLightingVersion}`);
	}
	const requiredTimeVersion = "1.0.0";
	const timeVersion = J.TIME.Metadata.version.version();
	const hasTimeRequirement = J.BASE.Helpers.satisfies(timeVersion, requiredTimeVersion);
	if (hasTimeRequirement === false) {
		throw new Error(`Either missing J-TIME or has a lower version than the required: ${requiredTimeVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension.
*/
J.LIGHTING.EXT.TIME = {};
/**
* The metadata associated with this plugin.
*/
J.LIGHTING.EXT.TIME.Metadata = new J_LIGHTING_TIME_PluginMetadata("J-Lighting-Time", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.LIGHTING.EXT.TIME.Aliased = {};
J.LIGHTING.EXT.TIME.Aliased.Game_Time = new Map();
J.LIGHTING.EXT.TIME.Aliased.Scene_Map = new Map();
/**
* All regular expressions used by this plugin.
*/
J.LIGHTING.EXT.TIME.RegExp = {};

//#endregion
//#region src/plugins/lighting/ext/time/managers/TimeToneResolver.js
/**
* Resolves what the sky looks like at a given hour of the day.
*
* This is deliberately free of any state at all- hand it an hour and a curve, get back a value.
* Everything about *when* that value gets applied, whether the sky has been frozen, and how it
* reaches the screen stays outside.
*
* How the day is divided is not decided here either. That belongs to the clock, which surfaces the
* same six buckets to events as time-of-day ids, so this reads `TimePhases` rather than keeping a
* second copy that could drift from the one authors write conditionals against.
*
* Each phase *begins* on its own value and spends its four hours travelling toward the next one's.
* That alignment is the whole reason {@link rateIntoPhase} lives here rather than with the rest of
* the phase maths: it is a statement about how a curve is read, not about how the day is divided,
* and the clock has no opinion on it.
*/
var TimeToneResolver = class {
	/**
	* How far through its own phase a given hour sits, as a fraction.
	*
	* A phase's first hour sits exactly on that phase's own value, which is what makes the hours named
	* Night actually look like night rather than spending themselves still fading out of evening. The
	* fraction therefore starts at 0 and stops short of 1 - the value it would be travelling toward is
	* the next phase's, and the next phase opens by sitting on it.
	* @param {number} hours The hour of the day, 0 through 23.
	* @returns {number} The fraction of the way across, 0 up to but never including 1.
	*/
	static rateIntoPhase(hours) {
		const hoursIntoPhase = hours % TimePhases.hoursPerPhase;
		return hoursIntoPhase / TimePhases.hoursPerPhase;
	}
	/**
	* Resolves the tone belonging to a given hour of the day.
	* @param {number} hours The hour of the day, 0 through 23.
	* @param {number[][]} toneSequence The tone each phase settles on, in the order they cycle.
	* @returns {[number, number, number, number]} The tone for that hour.
	*/
	static toneOfHour(hours, toneSequence) {
		if (TimePhases.isClockHour(hours) === false) return [
			0,
			0,
			0,
			0
		];
		const phase = TimePhases.phaseOfHour(hours);
		const destination = toneSequence.at(phase + 1);
		const rate = this.rateIntoPhase(hours);
		return this.between(toneSequence.at(phase), destination, rate);
	}
	/**
	* Resolves how much light the sky has taken away at a given hour of the day.
	* @param {number} hours The hour of the day, 0 through 23.
	* @param {number[]} darknessSequence The darkness each phase settles on, in the order they cycle.
	* @returns {number} The darkness for that hour, 0 through 1.
	*/
	static darknessOfHour(hours, darknessSequence) {
		if (TimePhases.isClockHour(hours) === false) return 0;
		const phase = TimePhases.phaseOfHour(hours);
		const destination = darknessSequence.at(phase + 1);
		const rate = this.rateIntoPhase(hours);
		const origin = darknessSequence.at(phase);
		return origin + (destination - origin) * rate;
	}
	/**
	* Calculates the tone a given fraction of the way between two tones.
	*
	* Order matters- this travels from the first tone toward the second, so swapping the arguments
	* does not produce the same result unless the rate is exactly half.
	* @param {[number, number, number, number]} fromTone The tone being left behind.
	* @param {[number, number, number, number]} toTone The tone being approached.
	* @param {number} rate The decimal fraction of the way across, 0 through 1.
	* @returns {[number, number, number, number]}
	*/
	static between(fromTone, toTone, rate) {
		const distance = (from, to) => from > to ? from - to : to - from;
		const blended = [];
		fromTone.forEach((fromChannel, index) => {
			const toChannel = toTone[index];
			const travelled = Math.round(distance(fromChannel, toChannel) * rate);
			blended.push(toChannel > fromChannel ? fromChannel + travelled : fromChannel - travelled);
		});
		return blended;
	}
	/**
	* Compares two tones channel by channel to see whether they are the same.
	* @param {[number, number, number, number]} currentTone The tone presently in effect.
	* @param {[number, number, number, number]} targetTone The tone being compared against.
	* @returns {boolean}
	*/
	static isSameTone(currentTone, targetTone) {
		if (currentTone.length < 4) return false;
		return currentTone.every((channel, index) => channel === targetTone[index]);
	}
};

//#endregion
//#region src/plugins/lighting/ext/time/managers/TimeLightingCoordinator.js
/**
* Turns what the clock says into what the sky looks like.
*
* The clock itself has no opinion about colour. It knows what hour it is and announces when that
* changes, and everything about what an hour *looks* like lives here - which is the whole point of
* the split. Night's colour and night's darkness are one artistic decision, and keeping them in one
* file means they cannot drift apart.
*
* Nothing here paints. Everything is declared to the composer under the `time` source, so a cutscene
* that tints the screen simply outranks the sky for as long as it holds it, and the sky is still
* there underneath when it lets go.
*
* **The clock is always handed in, never reached for.** `$gameTime` does not exist during the very
* first announcement: `Game_Time`'s own constructor announces the starting hour, and the global it
* will be assigned to is still null until that constructor returns. Taking the clock as an argument
* is what makes that moment representable rather than a crash on a fresh game.
*/
var TimeLightingCoordinator = class TimeLightingCoordinator {
	/**
	* The source key everything the sky asks for is declared under.
	* @type {string}
	*/
	static SOURCE_KEY = "time";
	/**
	* How many frames the sky takes to travel from one hour's look to the next.
	*
	* Long, because the sky is the one thing on screen that should never be seen to change. An hour of
	* game time passes in far less than this many frames of real time, so in practice the screen is
	* always partway through a journey it never completes - which is exactly how a sky behaves.
	* @type {number}
	*/
	static TRANSITION_FRAMES = 300;
	/**
	* Whether the map the player is standing on has opted out of the day/night cycle.
	* @type {boolean}
	*/
	static #suppressedByMap = false;
	/**
	* Whether something has deliberately frozen the sky where it is.
	* @type {boolean}
	*/
	static #locked = false;
	/**
	* Re-reads whether the current map wants anything to do with the sky.
	*
	* This is the only thing in the extension that reads map data, and it is deliberately the only
	* thing: everything else works from the hour alone. That split is what lets the hour-change hook
	* run during game-object creation, long before any map exists, without needing to check whether
	* one does.
	*/
	static refreshMapSuppression() {
		TimeLightingCoordinator.#suppressedByMap = Boolean($dataMap.meta["noToneChange"]);
	}
	/**
	* Declares what the sky should look like at the clock's current hour, or withdraws entirely.
	*
	* Withdrawing rather than declaring something neutral is what makes a cave behave. The composer
	* falls back to whatever else has a claim - a cutscene's tint if one is running, and nothing at
	* all otherwise - so an event that deliberately tinted an interior keeps its tint, and a plain
	* cave simply has no sky rather than inheriting the last map's midnight.
	* @param {Game_Time} clock The clock announcing the time.
	*/
	static declareForCurrentTime(clock) {
		const sourceKey = TimeLightingCoordinator.SOURCE_KEY;
		if (TimeLightingCoordinator.isActive() === false) {
			ScreenLightingComposer.removeDeclarations(sourceKey);
			return;
		}
		const hours = TimeLightingCoordinator.currentHour(clock);
		const metadata = J.LIGHTING.EXT.TIME.Metadata;
		const frames = TimeLightingCoordinator.TRANSITION_FRAMES;
		const tone = TimeToneResolver.toneOfHour(hours, metadata.toneSequence);
		const darkness = TimeToneResolver.darknessOfHour(hours, metadata.darknessSequence);
		const toneDeclaration = new ToneDeclaration(tone, frames, sourceKey);
		ScreenLightingComposer.declareTone(sourceKey, toneDeclaration);
		const ambient = new AmbientDeclaration(darkness, [
			0,
			0,
			0
		], false, sourceKey);
		ScreenLightingComposer.declareAmbient(sourceKey, ambient);
	}
	/**
	* Determines whether the sky should be reaching the screen at all right now.
	* @returns {boolean}
	*/
	static isActive() {
		if (TimeLightingCoordinator.#locked === true) return false;
		return TimeLightingCoordinator.#suppressedByMap === false;
	}
	/**
	* The hour the sky should be showing.
	*
	* Sourcing the hour is the clock's business rather than this class's, except for the one case the
	* clock cannot answer: when the game is running on real time, the hour belongs to the player's own
	* wall clock rather than to anything the game is counting.
	* @param {Game_Time} clock The clock announcing the time.
	* @returns {number}
	*/
	static currentHour(clock) {
		if (J.TIME.Metadata.UseRealTime === true) {
			return new Date().getHours();
		}
		return clock.hours();
	}
	/**
	* Freezes the sky wherever it currently is.
	* @param {Game_Time} clock The clock to resume reading from when it is unfrozen.
	*/
	static lock(clock) {
		TimeLightingCoordinator.#locked = true;
		TimeLightingCoordinator.declareForCurrentTime(clock);
	}
	/**
	* Lets the sky resume following the clock.
	* @param {Game_Time} clock The clock to resume reading from.
	*/
	static unlock(clock) {
		TimeLightingCoordinator.#locked = false;
		TimeLightingCoordinator.declareForCurrentTime(clock);
	}
	/**
	* Determines whether the sky is currently frozen.
	* @returns {boolean}
	*/
	static isLocked() {
		return TimeLightingCoordinator.#locked;
	}
};

//#endregion
//#region src/plugins/lighting/ext/time/objects/Game_Time.js
/**
* Extends {@link #onTimeChanged}.<br/>
* Re-reads what the sky should look like now that the clock has moved.
*
* The clock announces; this decides what the announcement looks like. That is the entire bridge -
* J-TIME knows nothing about lighting, and removing this plugin leaves it a working clock with no
* opinion about the screen.
*
* The clock hands itself over rather than being looked up. The first announcement of a new game
* comes from inside `Game_Time`'s own constructor, and `$gameTime` is still null until that
* constructor returns - so anything reaching for the global here would crash on a fresh game.
*/
J.LIGHTING.EXT.TIME.Aliased.Game_Time.set("onTimeChanged", Game_Time.prototype.onTimeChanged);
Game_Time.prototype.onTimeChanged = function() {
	J.LIGHTING.EXT.TIME.Aliased.Game_Time.get("onTimeChanged").call(this);
	TimeLightingCoordinator.declareForCurrentTime(this);
};

//#endregion
//#region src/plugins/lighting/ext/time/scenes/Scene_Map.js
/**
* Extends {@link #onMapLoaded}.<br/>
* Works out whether the arriving map has a sky, then applies it.
*
* This is the one place in the extension that reads map data, and it runs here because this is the
* first moment `$dataMap` is the map being entered rather than the one being left. It covers every
* kind of arrival - a transfer, a save load, and a new game - which matters because only one of
* those three actually runs the map's own setup.
*/
J.LIGHTING.EXT.TIME.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function() {
	TimeLightingCoordinator.refreshMapSuppression();
	TimeLightingCoordinator.declareForCurrentTime($gameTime);
	J.LIGHTING.EXT.TIME.Aliased.Scene_Map.get("onMapLoaded").call(this);
};

//#endregion
//#region src/plugins/lighting/ext/time/_metadata/pluginCommands.js
/**
* Lets the sky resume following the clock.
*/
PluginManager.registerCommand(J.LIGHTING.EXT.TIME.Metadata.name, "unlockTone", () => {
	TimeLightingCoordinator.unlock($gameTime);
});
/**
* Freezes the sky wherever it currently is.
*/
PluginManager.registerCommand(J.LIGHTING.EXT.TIME.Metadata.name, "lockTone", () => {
	TimeLightingCoordinator.lock($gameTime);
});

//#endregion
//# sourceMappingURL=J-Lighting-Time.js.map