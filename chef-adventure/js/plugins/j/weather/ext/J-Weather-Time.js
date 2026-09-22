//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 WEATHER-TIME] A sky that changes with the clock, forecast a year ahead.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Weather
 * @base J-TIME
 * @orderAfter J-Base
 * @orderAfter J-Weather
 * @orderAfter J-TIME
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin makes the weather a thing that happens rather than a property a
 * map owns.
 *
 * J-Weather draws what a place looks like. J-TIME knows what hour it is. This
 * is the piece in between: it decides what the sky over the whole island is
 * doing right now, rolls that decision a year into the future so it can be
 * read, and hands the answer to J-Weather to draw.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-Weather; this is an extension of it.
 * - J-TIME; this is where the calendar comes from.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The sky holds a CONDITION and a STRENGTH, and the two move separately.
 *
 * The condition steps through a transition graph belonging to the current
 * season, so a day reads as a sequence rather than as dice: overcast eases
 * into light rain, rain eases back off into overcast, and overcast clears.
 * Seasons hard-gate which conditions are even possible, which is why it never
 * snows in summer and why sakura is a spring thing.
 *
 * The strength takes a single step up or down a three-rung ladder - light,
 * moderate, heavy - and never jumps. A type may narrow that ladder for
 * itself: a monsoon is heavy or it is not a monsoon.
 *
 * ----------------------------------------------------------------------------
 * CONDITIONS AND FACES:
 * A condition is a state the sky is IN. A face is the preset it is DRAWN with,
 * chosen by season and hour.
 *
 * A clear summer afternoon and a clear winter afternoon are the same state and
 * completely different pictures - one is a heat shimmer and the other is ice
 * hanging in still air. Rather than make those separate conditions and author
 * every edge into and out of "clear" twice over, they are faces of one.
 *
 * This is also the only way some looks ever appear at all. Fireflies are the
 * face of a clear summer night; a field of stars is the face of any other
 * clear night.
 *
 * ----------------------------------------------------------------------------
 * SETTLING DAYS:
 * On the last day of a season the sky stops rolling and starts steering: each
 * phase takes whichever step gets it closest to clear.
 *
 * That gives a season handover a whole day to happen in, so the incoming
 * season starts from somewhere neutral and can bias away from it. Without it,
 * the last phase of autumn could be a monsoon and the first phase of winter a
 * blizzard, with nothing in between.
 *
 * Note that seasons do NOT sit on calendar quarters - winter is months 12, 1
 * and 2 - so the settling days are the last day of months 2, 5, 8 and 11.
 *
 * ----------------------------------------------------------------------------
 * CLIMATES:
 * A place may answer the sky rather than follow it.
 *
 *   <climate:NAME>
 *
 * on a map's note box bends the sky's strength through a named table before it
 * is drawn. The one this ships for is the Forest of Dreams, which is foggiest
 * when the sky is CLEAREST - something no amount of tuning the sky itself can
 * express, because it is a statement about somewhere in particular.
 *
 * A climate only bends a look the map already authored with `<weather:...>`.
 * A map with no weather of its own simply follows the sky.
 *
 * ----------------------------------------------------------------------------
 * EVENT PAGES:
 * A page may require the weather to be something, using comment commands in
 * the same style as J-TIME's:
 *
 *   <weatherTypePage:rain>
 *   <weatherIntensityPage:heavy>
 *   <weatherIntensityRangePage:moderate-heavy>
 *
 * These match what is ACTUALLY ON SCREEN - the resolved preset - rather than
 * the sky's condition. So a creature that comes out on clear summer nights is
 * tagged `fireflies`, because fireflies are what a clear summer night looks
 * like where the player is standing.
 *
 * Both names and numbers are accepted, matching `presetIds` and
 * `intensityIds` in the weather config.
 *
 * ============================================================================
 * CONFIGURATION:
 * The sky lives in the `sky` and `climates` blocks of
 * `data/config.weather.json` - the same file as the presets it names, so a
 * face pointing at a preset that does not exist can be caught by reading.
 *
 *  sky.types              every condition, its preset, and its faces
 *  sky.seasons            which conditions each season permits, and the graph
 *  sky.intensityDrift     how much the strength wants to hold, rise or fall
 *  sky.settleTo           the condition a season handover steers toward
 *  sky.forecastPhases     how far ahead the forecast is rolled
 *  sky.visibleDays        how much of it the forecast scene shows at once
 *  climates.<name>        how one kind of place bends the sky
 *
 * ----------------------------------------------------------------------------
 * THE DIAGNOSTIC FORECAST:
 * A developer screen, behind a plugin command and deliberately NOT in the
 * player's menu. One day at a time, paged left and right; the top row is the
 * sky over Erocia and every row beneath it is a named destination, with the
 * exact preset and strength each would draw, per phase.
 *
 * It exists to answer "is this weather that" - to check what is on screen
 * against what the sky rolled, and to see a climate inverting or a map tag
 * overriding without having to walk there.
 *
 * It is not what a player sees, for two reasons. The weather is reported from
 * Raevula, which is the only town left on Erocia - a player has no way to
 * check the sky over somewhere they are not. And a menu listing the Negative
 * Peaks and the Forest of Dreams tells them those places exist before they
 * have found them.
 *
 * Destinations are listed in `sky.places` as a name and a map id. The screen
 * reads that map's own note and runs it through the same resolver the game
 * uses on arrival, so nothing is restated and the two cannot disagree.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @command showDebugForecast
 * @text Show The Diagnostic Forecast
 * @desc Opens the developer forecast: every destination, exact preset and strength, per phase.
 *
 *
 * @command refreshForecastPlaces
 * @text Re-read Forecast Maps
 * @desc Forgets every destination's map note so it is read again. For development.
 */
//endregion annotations

//#region src/plugins/weather/ext/time/core/SkyStates.js
/**
* What conditions the sky can be in, and what each of them looks like right now.
*
* A **type** is a state the sky walks between - `rain`, `overcast`, `snow`. A **face** is the preset
* that type is drawn with at a particular season and hour. The two are separate because a clear
* summer afternoon and a clear winter afternoon are the same *state* and completely different
* *pictures*: one is a heat shimmer and the other is ice hanging in the air, and nothing about the
* way the sky moves from condition to condition should have to know which.
*
* Folding faces into the graph instead would mean `clear-summer-day` and `clear-winter-day` as
* separate nodes, and every edge into or out of `clear` authored twice. Eight types with faces is
* the same expressiveness at half the edges.
*
* **Everything here is a pure lookup over the parsed `sky` block.** No engine globals, no clock, no
* randomness - which is what lets the whole design be tested before a single hook exists.
*/
var SkyStates = class SkyStates {
	/**
	* The season names, indexed by the season id J-TIME publishes.
	*
	* Held here rather than taken from `Time_Snapshot.SeasonsName` because that method answers a
	* different question: it returns display-cased names for a window to draw, reports an unknown id
	* through `Diagnostics`, and hands back null. This needs the lowercase keys the config is authored
	* with, and needs them without reaching for anything.
	* @type {string[]}
	*/
	static Seasons = [
		"spring",
		"summer",
		"autumn",
		"winter"
	];
	/**
	* The strengths the sky can be at, weakest first.
	*
	* The *order* is the point, and it is the one thing `WeatherPresets.Intensities` cannot express -
	* that is three named keys, and this is a ladder. Clamping a drift into a type's allowed range
	* means knowing which rung is nearest, which means knowing which way is up.
	* @type {string[]}
	*/
	static Ladder = [
		"light",
		"moderate",
		"heavy"
	];
	/**
	* The name of a season, from the id J-TIME reports.
	* @param {number} seasonId The season id, 0 through 3.
	* @returns {string} The lowercase season name, or an empty string for an id off the calendar.
	*/
	static seasonNameOf(seasonId) {
		const name = SkyStates.Seasons[seasonId];
		if (name === undefined) return String.empty;
		return name;
	}
	/**
	* The configuration for one sky type.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} typeName The type being asked about, ex: `rain`.
	* @returns {?object} That type's block, or null when the sky has never heard of it.
	*/
	static typeOf(sky, typeName) {
		const type = sky.types[typeName];
		if (type === undefined) return null;
		return type;
	}
	/**
	* The types the sky is allowed to be in during a given season.
	*
	* Seasons hard-gate types rather than merely making them unlikely, because "it never snows in
	* summer" is a fact about the world and a weight of zero is a fact about dice. One of those
	* survives somebody retuning the table.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} seasonName The season, lowercase.
	* @returns {string[]} The permitted type names, or an empty list for an unknown season.
	*/
	static allowedIn(sky, seasonName) {
		const season = sky.seasons[seasonName];
		if (season === undefined) return [];
		return season.allowed;
	}
	/**
	* Whether a type is one the sky may hold during a given season.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} typeName The type being tested.
	* @param {string} seasonName The season, lowercase.
	* @returns {boolean}
	*/
	static isAllowedIn(sky, typeName, seasonName) {
		return SkyStates.allowedIn(sky, seasonName).includes(typeName);
	}
	/**
	* The strengths a type is willing to be drawn at.
	*
	* A type declaring a narrower range than the full ladder is how a condition keeps its identity
	* through the drift: `monsoon` is heavy or it is not a monsoon, and `mist` stops at moderate
	* because a heavy mist is just fog - and fog is a place rather than a sky.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} typeName The type being asked about.
	* @returns {string[]} The rungs it permits, or the whole ladder when it named none.
	*/
	static intensitiesOf(sky, typeName) {
		const type = SkyStates.typeOf(sky, typeName);
		if (type === null) return SkyStates.Ladder;
		if (type.intensities === undefined) return SkyStates.Ladder;
		return type.intensities;
	}
	/**
	* Pulls a strength into the range a type is willing to be drawn at.
	*
	* Nearest rung rather than a reset to the middle, so a sky arriving at `monsoon` from heavy rain
	* is already where it needs to be and one arriving from light rain climbs rather than jumping.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} typeName The type being entered.
	* @param {string} intensity The strength the drift produced.
	* @returns {string} A strength that type permits.
	*/
	static clampIntensity(sky, typeName, intensity) {
		const permitted = SkyStates.intensitiesOf(sky, typeName);
		const wanted = SkyStates.Ladder.indexOf(intensity);
		if (wanted === -1) return permitted[0];
		return SkyStates.nearestRung(permitted, wanted);
	}
	/**
	* Which of a set of permitted rungs sits closest to a given position on the ladder.
	* @param {string[]} permitted The rungs a type allows.
	* @param {number} wanted The ladder position being reached for.
	* @returns {string}
	*/
	static nearestRung(permitted, wanted) {
		let [closest] = permitted;
		let shortest = Number.MAX_SAFE_INTEGER;
		permitted.forEach((rung) => {
			const distance = Math.abs(SkyStates.Ladder.indexOf(rung) - wanted);
			if (distance < shortest) {
				shortest = distance;
				closest = rung;
			}
		});
		return closest;
	}
	/**
	* The preset a type is drawn with at a given season and hour of the day.
	*
	* Rules are tested in the order they were authored and the first match wins, so a rule naming both
	* a season and a phase must sit above one naming only a phase. A rule that omits either key
	* matches every value of it, which is what keeps the common case - "autumn wind is maple wind" -
	* to a single line.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} typeName The condition the sky is in.
	* @param {string} seasonName The season, lowercase.
	* @param {number} phaseId The phase of the day, 0 through 5.
	* @returns {string} The preset name, or an empty string when the type is unknown.
	*/
	static faceFor(sky, typeName, seasonName, phaseId) {
		const type = SkyStates.typeOf(sky, typeName);
		if (type === null) return String.empty;
		if (type.faces === undefined) return type.preset;
		const match = type.faces.find((face) => SkyStates.faceMatches(face, seasonName, phaseId));
		if (match === undefined) return type.preset;
		return match.preset;
	}
	/**
	* Whether one face rule applies at a given season and hour.
	* @param {object} face One authored face rule.
	* @param {string} seasonName The season, lowercase.
	* @param {number} phaseId The phase of the day, 0 through 5.
	* @returns {boolean}
	*/
	static faceMatches(face, seasonName, phaseId) {
		if (face.seasons !== undefined && face.seasons.includes(seasonName) === false) return false;
		if (face.phases !== undefined && face.phases.includes(phaseId) === false) return false;
		return true;
	}
	/**
	* Every preset name the sky can possibly ask for.
	*
	* Used by configuration validation rather than at runtime. A face pointing at a preset that does
	* not exist is the single most likely authoring mistake here, and it would otherwise surface as an
	* empty sky on one particular afternoon of one particular season.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @returns {string[]} Every named preset, deduplicated.
	*/
	static presetsNamedBy(sky) {
		const named = [];
		Object.values(sky.types).forEach((type) => {
			named.push(type.preset);
			if (type.faces === undefined) return;
			type.faces.forEach((face) => named.push(face.preset));
		});
		return [...new Set(named)];
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/SkyWalk.js
/**
* How the sky gets from what it is now to what it is next.
*
* **Two axes, walked separately.** The condition steps through a per-season transition graph, and
* the strength takes a bounded step up or down a three-rung ladder. Authoring one graph over every
* (type, intensity) pair instead would be thirty nodes and nine hundred possible edges, for a
* result no better than two small mechanisms that each do one thing.
*
* It also matches how weather actually reads. A day that goes overcast, then lightly rainy, then
* properly rainy, then eases back off is two gentle sequences happening at once - not one sequence
* through a large alphabet of compound states.
*
* **Every roll is handed in.** Nothing here calls `Math.random`, which is what lets a whole
* simulated year be asserted to exact values rather than to ranges, and what lets the settling-day
* behaviour be proven rather than observed.
*/
var SkyWalk = class SkyWalk {
	/**
	* How far along the ladder one step of the strength walk moves.
	* @type {{hold: number, up: number, down: number}}
	*/
	static Steps = {
		down: -1,
		hold: 0,
		up: 1
	};
	/**
	* The answer to "how far is it from here to there" when there is no route at all.
	* @type {number}
	*/
	static Unreachable = -1;
	/**
	* Takes the sky one phase forward.
	*
	* The moment is handed over as one object rather than as three arguments because it is one
	* thing - *when this phase is* - and because a signature that grows a positional every time the
	* calendar gains an opinion is a signature nobody can call correctly from memory.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{type: string, intensity: string}} state What the sky is now.
	* @param {{season: string, month: number, isSettling: boolean}} when The phase being rolled for.
	* @param {{type: number, intensity: number}} rolls A fresh roll per axis, each in [0, 1).
	* @returns {{type: string, intensity: string}} What the sky is next.
	*/
	static next(sky, state, when, rolls) {
		const type = when.isSettling === true ? SkyWalk.settlingType(sky, state.type, when.season) : SkyWalk.nextType(sky, state.type, when, rolls.type);
		const drifted = SkyWalk.nextIntensity(state.intensity, rolls.intensity, sky.intensityDrift);
		const intensity = SkyStates.clampIntensity(sky, type, drifted);
		return {
			type,
			intensity
		};
	}
	/**
	* The condition the sky moves to next, rolled against this season's graph and this month's lean.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} currentType What the sky is now.
	* @param {{season: string, month: number, isSettling: boolean}} when The phase being rolled for.
	* @param {number} roll A roll in [0, 1).
	* @returns {string}
	*/
	static nextType(sky, currentType, when, roll) {
		const candidates = SkyWalk.candidatesFor(sky, currentType, when.season);
		const leaned = SkyWalk.leanToward(candidates, SkyWalk.leanOf(sky, when.month));
		return SkyWalk.pickWeighted(leaned, roll);
	}
	/**
	* What a given month leans toward, as a multiplier per condition.
	*
	* **A season says what is possible; a month says what is likely.** Sakura is a spring condition
	* and a fortnight of it, not a season of it; a monsoon belongs to October rather than to autumn
	* at large; the deep snow is December and January and has visibly let go by February. None of
	* that can be said in a transition graph, because a graph has no idea what day it is.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {number} month The month, 1 through 12.
	* @returns {object} Condition names to multipliers; empty when this month leans nowhere.
	*/
	static leanOf(sky, month) {
		if (sky.months === undefined) return {};
		const lean = sky.months[month];
		if (lean === undefined) return {};
		return lean;
	}
	/**
	* Scales a set of candidates by what the month wants more and less of.
	*
	* **Applied here and deliberately not inside {@link SkyWalk.candidatesFor}.** That method also
	* answers `hopsTo`, which asks what the graph *can* reach - and a condition a month has scaled
	* to zero is still reachable, just not today. Folding the lean in there would make a settling
	* day in January believe half its graph had vanished.
	* @param {{type: string, weight: number}[]} candidates What the graph offers.
	* @param {object} lean Condition names to multipliers.
	* @returns {{type: string, weight: number}[]}
	*/
	static leanToward(candidates, lean) {
		return candidates.map((candidate) => ({
			type: candidate.type,
			weight: candidate.weight * SkyWalk.multiplierFor(lean, candidate.type)
		}));
	}
	/**
	* How much a month wants one particular condition.
	*
	* One by default, which leaves the graph's own weight exactly as authored - so a month names
	* only the conditions it has something to say about.
	* @param {object} lean Condition names to multipliers.
	* @param {string} type The condition being weighed.
	* @returns {number}
	*/
	static multiplierFor(lean, type) {
		if (lean[type] === undefined) return 1;
		return lean[type];
	}
	/**
	* Where the sky could go from here, and how much each is wanted.
	*
	* Targets are filtered against the season's own `allowed` list, so a graph shared between seasons
	* cannot leak snow into summer even if somebody authors the edge.
	*
	* **A state with nowhere legal to go falls back to every legal state, equally weighted.** That is
	* a recovery rather than a guard: the ordinary path can never reach it, because a settling day
	* hands each season over at `clear` and `clear` is allowed everywhere. A debug clock jump from
	* winter straight into summer *can* - it lands the sky mid-graph holding `snow` in a season that
	* forbids it - and the sky picking a legal condition beats the sky freezing.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} currentType What the sky is now.
	* @param {string} seasonName The season, lowercase.
	* @returns {{type: string, weight: number}[]}
	*/
	static candidatesFor(sky, currentType, seasonName) {
		const season = sky.seasons[seasonName];
		if (season === undefined) return [];
		const row = season.transitions[currentType];
		if (row === undefined) return SkyWalk.anyOf(season);
		const candidates = Object.keys(row).filter((target) => season.allowed.includes(target)).map((target) => ({
			type: target,
			weight: row[target]
		}));
		if (candidates.length === 0) return SkyWalk.anyOf(season);
		return candidates;
	}
	/**
	* Every condition a season permits, wanted equally.
	* @param {object} season One season's block of the sky configuration.
	* @returns {{type: string, weight: number}[]}
	*/
	static anyOf(season) {
		return season.allowed.map((target) => ({
			type: target,
			weight: 1
		}));
	}
	/**
	* Picks one weighted candidate.
	*
	* Weights are relative and need not sum to anything, because a config an author can edit is one
	* where adding a condition does not mean rebalancing every number around it.
	* @param {{type: string, weight: number}[]} candidates What could be picked, and how much.
	* @param {number} roll A roll in [0, 1).
	* @returns {string} The chosen type, or an empty string when there was nothing to choose from.
	*/
	static pickWeighted(candidates, roll) {
		if (candidates.length === 0) return String.empty;
		const total = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
		if (total <= 0) return candidates[0].type;
		let remaining = roll * total;
		const found = candidates.find((candidate) => {
			remaining -= candidate.weight;
			return remaining < 0;
		});
		if (found === undefined) return candidates[candidates.length - 1].type;
		return found.type;
	}
	/**
	* The condition the sky moves to when it is being steered toward the season handover.
	*
	* Deterministic rather than rolled, because the whole point of a settling day is that the next
	* season starts from a known state. Each phase takes the neighbour that sits closest to
	* `settleTo`, so a monsoon walks down through the graph over the day rather than snapping out of
	* itself - and the incoming season inherits somewhere neutral to start biasing from.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} currentType What the sky is now.
	* @param {string} seasonName The season, lowercase.
	* @returns {string}
	*/
	static settlingType(sky, currentType, seasonName) {
		const target = sky.settleTo;
		if (currentType === target) return target;
		const candidates = SkyWalk.candidatesFor(sky, currentType, seasonName);
		if (candidates.length === 0) return currentType;
		return SkyWalk.closestTo(sky, candidates, target, seasonName);
	}
	/**
	* Which candidate stands nearest the settling condition.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{type: string, weight: number}[]} candidates Where the sky could go from here.
	* @param {string} target The condition being walked toward.
	* @param {string} seasonName The season, lowercase.
	* @returns {string}
	*/
	static closestTo(sky, candidates, target, seasonName) {
		let best = candidates[0].type;
		let shortest = Number.MAX_SAFE_INTEGER;
		candidates.forEach((candidate) => {
			const hops = SkyWalk.hopsTo(sky, candidate.type, target, seasonName);
			if (hops === SkyWalk.Unreachable) return;
			if (hops < shortest) {
				shortest = hops;
				best = candidate.type;
			}
		});
		return best;
	}
	/**
	* How many steps it takes to get from one condition to another inside a season's graph.
	*
	* Breadth-first, so the answer is the shortest route rather than the first one found. Used on
	* settling days to choose a direction, and at load time to prove every condition can actually
	* reach the settling state within the six phases a day has to offer.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {string} fromType Where the walk starts.
	* @param {string} targetType Where it is trying to get to.
	* @param {string} seasonName The season, lowercase.
	* @returns {number} The number of steps, or {@link SkyWalk.Unreachable} when there is no route.
	*/
	static hopsTo(sky, fromType, targetType, seasonName) {
		if (fromType === targetType) return 0;
		const seen = new Set([fromType]);
		let frontier = [fromType];
		let distance = 0;
		while (frontier.length > 0) {
			distance++;
			const next = [];
			frontier.forEach((type) => {
				SkyWalk.candidatesFor(sky, type, seasonName).forEach((candidate) => {
					if (seen.has(candidate.type) === true) return;
					seen.add(candidate.type);
					next.push(candidate.type);
				});
			});
			if (next.includes(targetType) === true) return distance;
			frontier = next;
		}
		return SkyWalk.Unreachable;
	}
	/**
	* Takes the strength one rung up or down, or leaves it where it is.
	*
	* Bounded to a single rung because that is what makes a sequence read as weather. A strength free
	* to jump from light to heavy produces a day that argues with itself, which is exactly how a
	* player learns the sky is dice rather than a system.
	* @param {string} currentIntensity The strength now.
	* @param {number} roll A roll in [0, 1).
	* @param {{hold: number, up: number, down: number}} drift How much each move is wanted.
	* @returns {string}
	*/
	static nextIntensity(currentIntensity, roll, drift) {
		const { Ladder } = SkyStates;
		const current = Ladder.indexOf(currentIntensity);
		const step = SkyWalk.stepFor(roll, drift);
		const wanted = current + step;
		const clamped = Math.min(Math.max(wanted, 0), Ladder.length - 1);
		return Ladder[clamped];
	}
	/**
	* Which way one step of the strength walk goes.
	* @param {number} roll A roll in [0, 1).
	* @param {{hold: number, up: number, down: number}} drift How much each move is wanted.
	* @returns {number} One of {@link SkyWalk.Steps}.
	*/
	static stepFor(roll, drift) {
		const candidates = [
			{
				type: "hold",
				weight: drift.hold
			},
			{
				type: "up",
				weight: drift.up
			},
			{
				type: "down",
				weight: drift.down
			}
		];
		const chosen = SkyWalk.pickWeighted(candidates, roll);
		return SkyWalk.Steps[chosen];
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/SkyForecast.js
/**
* The calendar the sky is walked across, and the window of it that is kept.
*
* A forecast is a flat run of states with a phase number attached to the front of it. Everything
* else here is the arithmetic that turns a date into an index into that run, and back.
*
* **Rolling the whole thing ahead rather than a phase at a time is the entire point.** A forecast
* the player can read has to already exist; one rolled on arrival is a prediction of a thing that
* has not been decided, which is just a lie with extra steps. Deciding it up front also means the
* forecast cannot change out from under somebody who wrote it down.
*
* **States are stored by name, not by number.** A numeric id would shave the slice from roughly
* thirty-five kilobytes to eight, and would cost a `skyTypeIds` block that has to be maintained in
* lockstep with the types and never renumbered - which is the exact hazard `presetIds` exists to
* warn about. There is also no author-facing reason to number sky types at all: the page tags key
* on presets. A save that is self-describing and immune to somebody reordering the config is worth
* far more than the bytes.
*
* **Everything here is pure.** No clock, no globals, and the rolls are handed in.
*/
var SkyForecast = class SkyForecast {
	/**
	* The months belonging to each season, indexed by the season id J-TIME publishes.
	*
	* This mirrors `Game_Time.seasonOfYear`, which cannot simply be called: it is an instance method
	* on a global that may not exist yet, and a forecast reasons about months the clock has not
	* reached. Winter wrapping the year boundary is the part worth staring at - seasons do **not**
	* sit on calendar quarters, and every off-by-one in this file traces back to assuming they do.
	* @type {number[][]}
	*/
	static SeasonMonths = [
		[
			3,
			4,
			5
		],
		[
			6,
			7,
			8
		],
		[
			9,
			10,
			11
		],
		[
			12,
			1,
			2
		]
	];
	/**
	* Days in a month, matching `Game_Time.daysPerMonth`.
	* @type {number}
	*/
	static DaysPerMonth = 30;
	/**
	* Months in a year, matching `Game_Time.monthsPerYear`.
	* @type {number}
	*/
	static MonthsPerYear = 12;
	/**
	* Phases in a day, matching the six four-hour buckets of `TimePhases`.
	* @type {number}
	*/
	static PhasesPerDay = 6;
	/**
	* Days in a week, matching the seven `Time_Snapshot` names them.
	* @type {number}
	*/
	static DaysPerWeek = 7;
	/**
	* The answer handed back for a date that is not on the clock.
	*
	* `TimePhases.phaseOfHour` reports an hour off the 24-hour face as `-1`, and the clock can
	* genuinely hold one - `setTime` writes the hour straight through without constraining it. That
	* propagates through here rather than being silently rounded into a real phase.
	* @type {number}
	*/
	static OffClock = -1;
	/**
	* Days in a year.
	* @returns {number}
	*/
	static daysPerYear() {
		return SkyForecast.DaysPerMonth * SkyForecast.MonthsPerYear;
	}
	/**
	* Phases in a year, which is the natural length of a full forecast.
	* @returns {number}
	*/
	static phasesPerYear() {
		return SkyForecast.daysPerYear() * SkyForecast.PhasesPerDay;
	}
	/**
	* The last month of each season, which is where a season hands over.
	*
	* Derived from {@link SkyForecast.SeasonMonths} rather than written out, because a second
	* hand-written list of months is a second thing to get wrong - and this is the exact list that
	* was got wrong in design, as 3/6/9/12 rather than 5/8/11/2.
	* @returns {number[]}
	*/
	static settlingMonths() {
		return SkyForecast.SeasonMonths.map((months) => months[months.length - 1]);
	}
	/**
	* Which day of the year a date falls on.
	* @param {number} months The month, 1 through 12.
	* @param {number} days The day of the month, 1 through 30.
	* @returns {number} The day of the year, 1 through 360.
	*/
	static dayOfYear(months, days) {
		return (months - 1) * SkyForecast.DaysPerMonth + days;
	}
	/**
	* A date as a single day number that only ever counts upward.
	* @param {number} years The year.
	* @param {number} months The month, 1 through 12.
	* @param {number} days The day of the month, 1 through 30.
	* @returns {number}
	*/
	static absoluteDay(years, months, days) {
		return years * SkyForecast.daysPerYear() + (SkyForecast.dayOfYear(months, days) - 1);
	}
	/**
	* A date and an hour as the single phase number the forecast is indexed by.
	* @param {number} years The year.
	* @param {number} months The month, 1 through 12.
	* @param {number} days The day of the month, 1 through 30.
	* @param {number} phaseId The phase of the day, 0 through 5, or -1 for an hour off the clock.
	* @returns {number} The absolute phase, or {@link SkyForecast.OffClock}.
	*/
	static absolutePhaseOf(years, months, days, phaseId) {
		if (phaseId === SkyForecast.OffClock) return SkyForecast.OffClock;
		return SkyForecast.absoluteDay(years, months, days) * SkyForecast.PhasesPerDay + phaseId;
	}
	/**
	* Which phase of its own day an absolute phase is.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} 0 through 5.
	*/
	static phaseOfDay(absolutePhase) {
		return absolutePhase % SkyForecast.PhasesPerDay;
	}
	/**
	* The phase a given phase's own day begins on.
	* @param {number} absolutePhase Any phase of the day in question.
	* @returns {number}
	*/
	static startOfDay(absolutePhase) {
		return absolutePhase - SkyForecast.phaseOfDay(absolutePhase);
	}
	/**
	* Which day of the year an absolute phase falls on, counting from zero.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} 0 through 359.
	*/
	static dayIndexOf(absolutePhase) {
		const day = Math.floor(absolutePhase / SkyForecast.PhasesPerDay);
		return day % SkyForecast.daysPerYear();
	}
	/**
	* Which day of the week an absolute phase falls on.
	*
	* Counted from the absolute day rather than the day of the *year*, so the week runs on through
	* new year's day instead of restarting - three hundred and sixty days is not a whole number of
	* weeks, and a calendar that quietly repeated a weekday every December would be the sort of
	* thing somebody notices a year after it shipped.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} 0 through 6, counting from Monday as `Time_Snapshot` does.
	*/
	static dayOfWeekIdOf(absolutePhase) {
		const day = Math.floor(absolutePhase / SkyForecast.PhasesPerDay);
		return day % SkyForecast.DaysPerWeek;
	}
	/**
	* Which month an absolute phase falls in.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} The month, 1 through 12.
	*/
	static monthOf(absolutePhase) {
		return Math.floor(SkyForecast.dayIndexOf(absolutePhase) / SkyForecast.DaysPerMonth) + 1;
	}
	/**
	* Which day of its month an absolute phase falls on.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} The day, 1 through 30.
	*/
	static dayOfMonthOf(absolutePhase) {
		return SkyForecast.dayIndexOf(absolutePhase) % SkyForecast.DaysPerMonth + 1;
	}
	/**
	* Which season an absolute phase falls in.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {number} The season id, 0 through 3.
	*/
	static seasonIdOf(absolutePhase) {
		const month = SkyForecast.monthOf(absolutePhase);
		return SkyForecast.SeasonMonths.findIndex((months) => months.includes(month));
	}
	/**
	* The name of the season an absolute phase falls in.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {string} The lowercase season name.
	*/
	static seasonNameOf(absolutePhase) {
		return SkyStates.seasonNameOf(SkyForecast.seasonIdOf(absolutePhase));
	}
	/**
	* Whether a phase falls on the day a season hands over to the next.
	*
	* The last day of a season rather than the first day of the next, so the handover has a whole
	* day - six phases - to walk down to something neutral. Starting spring out of a blizzard is
	* what this exists to prevent, and it cannot be prevented from inside spring.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {boolean}
	*/
	static isSettling(absolutePhase) {
		if (SkyForecast.dayOfMonthOf(absolutePhase) !== SkyForecast.DaysPerMonth) return false;
		return SkyForecast.settlingMonths().includes(SkyForecast.monthOf(absolutePhase));
	}
	/**
	* Everything the walk needs to know about when a phase is.
	*
	* Gathered into one object rather than handed over as three arguments, because the three are one
	* fact and they are always wanted together.
	* @param {number} absolutePhase The phase being described.
	* @returns {{season: string, month: number, isSettling: boolean}}
	*/
	static momentOf(absolutePhase) {
		return {
			season: SkyForecast.seasonNameOf(absolutePhase),
			month: SkyForecast.monthOf(absolutePhase),
			isSettling: SkyForecast.isSettling(absolutePhase)
		};
	}
	/**
	* An empty forecast, starting at a given phase.
	* @param {number} startPhase The absolute phase index 0 will represent.
	* @returns {{startPhase: number, types: string[], intensities: string[]}}
	*/
	static empty(startPhase) {
		return {
			startPhase,
			types: [],
			intensities: []
		};
	}
	/**
	* Whether a forecast holds an answer for a given phase.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {boolean}
	*/
	static covers(forecast, absolutePhase) {
		if (absolutePhase < forecast.startPhase) return false;
		return absolutePhase < forecast.startPhase + forecast.types.length;
	}
	/**
	* What the sky is doing at a given phase.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {?{type: string, intensity: string}} The state, or null when it is outside the window.
	*/
	static stateAt(forecast, absolutePhase) {
		if (SkyForecast.covers(forecast, absolutePhase) === false) return null;
		const index = absolutePhase - forecast.startPhase;
		return {
			type: forecast.types[index],
			intensity: forecast.intensities[index]
		};
	}
	/**
	* The last state a forecast holds, which is where any extension of it carries on from.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @returns {{type: string, intensity: string}} The final state, or a neutral one when empty.
	*/
	static lastState(sky, forecast) {
		const last = forecast.types.length - 1;
		if (last < 0) {
			return {
				type: sky.settleTo,
				intensity: SkyStates.Ladder[1]
			};
		}
		return {
			type: forecast.types[last],
			intensity: forecast.intensities[last]
		};
	}
	/**
	* Walks the sky forward until the forecast reaches a given phase.
	*
	* Appends rather than replaces, so extending a window costs only the phases actually added and a
	* forecast somebody has already read never changes underneath them.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} throughPhase The last phase that must be covered, inclusive.
	* @param {function(): {type: number, intensity: number}} rollFor A fresh pair of rolls per phase.
	* @returns {{startPhase: number, types: string[], intensities: string[]}} The same forecast.
	*/
	static extendThrough(sky, forecast, throughPhase, rollFor) {
		let state = SkyForecast.lastState(sky, forecast);
		let phase = forecast.startPhase + forecast.types.length;
		while (phase <= throughPhase) {
			state = SkyWalk.next(sky, state, SkyForecast.momentOf(phase), rollFor());
			forecast.types.push(state.type);
			forecast.intensities.push(state.intensity);
			phase++;
		}
		return forecast;
	}
	/**
	* Drops the phases that have already been lived through.
	*
	* Without this the arrays only ever grow: six entries per game day, which at Chef Adventure's
	* tick rate is six per two and a half hours of play. Trimming as the window rolls is what keeps
	* the saved slice a flat size for the life of a file rather than a log of everything that ever
	* happened.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} fromPhase The earliest phase worth keeping.
	* @returns {{startPhase: number, types: string[], intensities: string[]}} The same forecast.
	*/
	static trimBefore(forecast, fromPhase) {
		const dropped = fromPhase - forecast.startPhase;
		if (dropped <= 0) return forecast;
		forecast.types.splice(0, dropped);
		forecast.intensities.splice(0, dropped);
		forecast.startPhase = fromPhase;
		return forecast;
	}
	/**
	* Brings a forecast up to date around a given phase, rebuilding it when it cannot be stretched.
	*
	* **A backward jump regenerates rather than extends.** The only way to move the clock backward is
	* a debug jump, and re-rolling days already lived through is the honest answer to it - the
	* forecast's promise is that what it says about the *future* does not change, and a rewind has no
	* future to disturb.
	* **Both ends are given explicitly** rather than as a point and a length, because they are not
	* the same point. The window is trimmed to the start of the *day* rather than to the current
	* phase, so the hours already gone are still there to be shown - a forecast screen listing the
	* whole of today would otherwise render this morning as blanks. Five spare phases is nothing;
	* a day view full of gaps is not.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} keepFrom The earliest phase worth keeping.
	* @param {number} throughPhase The last phase that must be covered, inclusive.
	* @param {function(): {type: number, intensity: number}} rollFor A fresh pair of rolls per phase.
	* @returns {{startPhase: number, types: string[], intensities: string[]}} The current forecast.
	*/
	static ensureCovers(sky, forecast, keepFrom, throughPhase, rollFor) {
		const usable = keepFrom >= forecast.startPhase ? forecast : SkyForecast.empty(keepFrom);
		SkyForecast.trimBefore(usable, keepFrom);
		return SkyForecast.extendThrough(sky, usable, throughPhase, rollFor);
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/SkyConfigValidator.js
/**
* Proves the authored sky is one the walk can actually survive.
*
* Every fault this looks for is silent at runtime and slow to surface. A transition pointing at a
* condition the season forbids simply never fires; a face naming a preset that does not exist
* renders nothing on one particular afternoon of one particular season; a cluster with no route to
* the settling state leaves a handover day walking in circles. None of them throw, and all of them
* turn up in month nine of somebody's playthrough rather than at startup.
*
* **Findings are returned as well as reported.** Reporting alone would make the only assertable
* thing a spy on `Diagnostics`, which proves a call happened rather than that the right fault was
* found; handing the list back lets a test name the fault.
*/
var SkyConfigValidator = class SkyConfigValidator {
	/**
	* The most steps a handover may take to reach the settling state.
	*
	* Six, because that is how many phases a day has and a season hands over across exactly one day.
	* A cluster needing seven is a cluster that runs out of day.
	* @type {number}
	*/
	static SettlingBudget = 6;
	/**
	* Everything wrong with an authored sky.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @returns {string[]} One message per fault, empty when there are none.
	*/
	static findFaults(config) {
		const { sky } = config;
		return [
			...SkyConfigValidator.findRowlessTypes(sky),
			...SkyConfigValidator.findIllegalTargets(sky),
			...SkyConfigValidator.findUnsettleableTypes(sky),
			...SkyConfigValidator.findMissingPresets(config),
			...SkyConfigValidator.findAmbiguousClimates(config),
			...SkyConfigValidator.findStrandingMonths(sky),
			...SkyConfigValidator.findUnseasonalMonths(sky)
		];
	}
	/**
	* Reports every fault in an authored sky, and says so out loud.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @param {string} pluginName The ship reporting, for the diagnostic prefix.
	* @returns {string[]} The same findings, for anything that wants to act on them.
	*/
	static report(config, pluginName) {
		const faults = SkyConfigValidator.findFaults(config);
		faults.forEach((fault) => Diagnostics.warn(pluginName, fault));
		return faults;
	}
	/**
	* Conditions a season permits but never says how to leave.
	*
	* A condition with no row is a dead end the sky can walk into and never walk out of - it falls
	* back to every legal state, which works but silently discards the whole graph for that node.
	* @param {object} sky The parsed `sky` block.
	* @returns {string[]}
	*/
	static findRowlessTypes(sky) {
		const faults = [];
		Object.keys(sky.seasons).forEach((seasonName) => {
			const season = sky.seasons[seasonName];
			season.allowed.forEach((typeName) => {
				if (season.transitions[typeName] !== undefined) return;
				faults.push(`[${seasonName}] permits [${typeName}] but gives it no transitions.`);
			});
		});
		return faults;
	}
	/**
	* Transitions pointing at a condition their own season forbids.
	*
	* Filtered out at runtime rather than obeyed, so the visible symptom is a weight that does
	* nothing - which reads as the graph being badly tuned rather than as a typo.
	* @param {object} sky The parsed `sky` block.
	* @returns {string[]}
	*/
	static findIllegalTargets(sky) {
		const faults = [];
		Object.keys(sky.seasons).forEach((seasonName) => {
			const season = sky.seasons[seasonName];
			Object.keys(season.transitions).forEach((fromType) => {
				Object.keys(season.transitions[fromType]).forEach((target) => {
					if (season.allowed.includes(target) === true) return;
					faults.push(`[${seasonName}] routes [${fromType}] to [${target}], which it forbids.`);
				});
			});
		});
		return faults;
	}
	/**
	* Conditions that cannot reach the settling state inside a handover day.
	* @param {object} sky The parsed `sky` block.
	* @returns {string[]}
	*/
	static findUnsettleableTypes(sky) {
		const faults = [];
		Object.keys(sky.seasons).forEach((seasonName) => {
			sky.seasons[seasonName].allowed.forEach((typeName) => {
				const hops = SkyWalk.hopsTo(sky, typeName, sky.settleTo, seasonName);
				if (hops === SkyWalk.Unreachable) {
					faults.push(`[${seasonName}] strands [${typeName}]: no route to [${sky.settleTo}].`);
					return;
				}
				if (hops <= SkyConfigValidator.SettlingBudget) return;
				faults.push(`[${seasonName}] needs ${hops} phases to settle [${typeName}]; a day has 6.`);
			});
		});
		return faults;
	}
	/**
	* Presets the sky asks for that either do not exist or were never numbered.
	*
	* Both halves matter and they fail differently. A preset that does not exist draws nothing; one
	* that exists without an id draws fine and reports itself to events as *no weather at all*,
	* which quietly breaks every conditional branch written against it.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @returns {string[]}
	*/
	static findMissingPresets(config) {
		const faults = [];
		SkyStates.presetsNamedBy(config.sky).forEach((preset) => {
			if (config.presets[preset] === undefined) {
				faults.push(`the sky names preset [${preset}], which does not exist.`);
				return;
			}
			if (config.presetIds[preset] !== undefined) return;
			faults.push(`the sky names preset [${preset}], which has no declared id.`);
		});
		return faults;
	}
	/**
	* Months whose lean leaves some condition with nowhere at all to go.
	*
	* **The one way a month can genuinely break the sky.** A multiplier of zero is a legitimate and
	* useful thing to write - it is how sakura ends rather than fades - but zeroing every exit from
	* a condition leaves the walk with no positive weight to pick from, and it falls back to the
	* first candidate regardless of what the author meant. That is a sky quietly ignoring its own
	* configuration for a whole month, which is exactly the kind of thing nobody notices until the
	* screenshots look wrong.
	* @param {object} sky The parsed `sky` block.
	* @returns {string[]}
	*/
	static findStrandingMonths(sky) {
		const faults = [];
		if (sky.months === undefined) return faults;
		Object.keys(sky.months).forEach((month) => {
			const seasonName = SkyConfigValidator.seasonOfMonth(Number(month));
			const season = sky.seasons[seasonName];
			if (season === undefined) return;
			const lean = sky.months[month];
			season.allowed.forEach((from) => {
				const candidates = SkyWalk.candidatesFor(sky, from, seasonName);
				const leaned = SkyWalk.leanToward(candidates, lean);
				const total = leaned.reduce((sum, candidate) => sum + candidate.weight, 0);
				if (total > 0) return;
				faults.push(`month ${month} leaves [${from}] with no way out in ${seasonName}.`);
			});
		});
		return faults;
	}
	/**
	* Months leaning on a condition their own season does not permit.
	*
	* Harmless at runtime - the condition is never a candidate, so the multiplier never applies -
	* and almost always a typo or a month number off by one. Silence here is how an author spends
	* an evening wondering why their monsoons never arrived.
	* @param {object} sky The parsed `sky` block.
	* @returns {string[]}
	*/
	static findUnseasonalMonths(sky) {
		const faults = [];
		if (sky.months === undefined) return faults;
		Object.keys(sky.months).forEach((month) => {
			const seasonName = SkyConfigValidator.seasonOfMonth(Number(month));
			const season = sky.seasons[seasonName];
			if (season === undefined) return;
			Object.keys(sky.months[month]).forEach((type) => {
				if (season.allowed.includes(type) === true) return;
				faults.push(`month ${month} leans on [${type}], which ${seasonName} does not permit.`);
			});
		});
		return faults;
	}
	/**
	* Which season a month belongs to.
	* @param {number} month The month, 1 through 12.
	* @returns {string} The lowercase season name, or an empty string for a month off the calendar.
	*/
	static seasonOfMonth(month) {
		const seasonId = SkyForecast.SeasonMonths.findIndex((months) => months.includes(month));
		return SkyStates.seasonNameOf(seasonId);
	}
	/**
	* Climates that declare two ways of answering the sky.
	*
	* `byType` is consulted before `byIntensity`, so a climate carrying both silently never uses the
	* second - and which one an author meant is not recoverable from the file.
	* @param {object} config The parsed contents of `config.weather.json`.
	* @returns {string[]}
	*/
	static findAmbiguousClimates(config) {
		const faults = [];
		Object.keys(config.climates).forEach((climateName) => {
			const climate = config.climates[climateName];
			if (climate.byType === undefined) return;
			if (climate.byIntensity === undefined) return;
			faults.push(`climate [${climateName}] declares both byType and byIntensity; declare one.`);
		});
		return faults;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/_metadata/_pluginMetadata.js
/**
* The metadata for J-Weather-Time.
*
* **Nothing is loaded here.** J-Weather already read `config.weather.json` in its own metadata, and
* the sky lives in the same file as the presets it names - deliberately, because a face that points
* at a preset which does not exist is the most likely authoring mistake in the whole system, and
* keeping both halves in one file is what lets it be caught by reading rather than by playing.
*
* Reading the parent's parsed copy rather than loading the file a second time also means the two can
* never disagree about what is in it.
*/
var J_WEATHER_TIME_PluginMetadata = class extends PluginMetadata {
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
	* Picks the sky and climate blocks out of the weather config the parent plugin already loaded.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeSky();
	}
	/**
	* Takes the sky and the climates off the already-parsed weather configuration.
	*
	* Validated here rather than on first use, because every fault it looks for is silent: the sky
	* keeps walking, the screen keeps drawing, and the symptom arrives months of game time later on
	* one particular afternoon of one particular season. Boot is the only moment somebody is still
	* looking at the console.
	*/
	initializeSky() {
		const { weatherConfig } = J.WEATHER.Metadata;
		/**
		* Every condition the sky can be in, how it moves between them, and what each one looks like.
		* @type {object}
		*/
		this.sky = weatherConfig.sky;
		/**
		* The named tables by which a place bends the sky into its own weather.
		* @type {object}
		*/
		this.climates = weatherConfig.climates;
		SkyConfigValidator.report(weatherConfig, "J-Weather-Time");
	}
};

//#endregion
//#region src/plugins/weather/ext/time/_metadata/initialization.js
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
	const requiredWeatherVersion = "1.0.0";
	const weatherVersion = J.WEATHER.Metadata.version.version();
	const hasWeatherRequirement = J.BASE.Helpers.satisfies(weatherVersion, requiredWeatherVersion);
	if (hasWeatherRequirement === false) {
		throw new Error(`Either missing J-Weather or has a lower version than the required: ${requiredWeatherVersion}`);
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
J.WEATHER.EXT.TIME = {};
/**
* The metadata associated with this plugin.
*/
J.WEATHER.EXT.TIME.Metadata = new J_WEATHER_TIME_PluginMetadata("J-Weather-Time", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.WEATHER.EXT.TIME.Aliased = {};
J.WEATHER.EXT.TIME.Aliased.Game_Event = new Map();
J.WEATHER.EXT.TIME.Aliased.Game_System = new Map();
J.WEATHER.EXT.TIME.Aliased.Game_Time = new Map();
J.WEATHER.EXT.TIME.Aliased.MapWeatherResolver = new Map();
J.WEATHER.EXT.TIME.Aliased.Scene_Map = new Map();
J.WEATHER.EXT.TIME.Aliased.Window_Time = new Map();
/**
* All regular expressions used by this plugin.
*/
J.WEATHER.EXT.TIME.RegExp = {};
/**
* How the sky over a place is bent into local weather.
*
* <pre>
* Structure:
*  <climate:NAME>
*
* Example:
*  <climate:dreaming>
*
* Translation:
*  This place answers the sky through the `dreaming` table rather than following it directly.
* </pre>
*
* Named rather than described, for the same reason `<weather:>` is: the table lives in
* `config.weather.json` where retuning it is a data edit. A climate only bends a look the map
* already authored with `<weather:>` - see `MapWeatherResolver.resolve`, which consults the
* intensity resolver on that branch alone.
* @type {RegExp}
*/
J.WEATHER.EXT.TIME.RegExp.Climate = /<climate:[ ]?([a-zA-Z][a-zA-Z0-9_-]*)>/i;
/**
* Requires a page's weather to be a particular look.
*
* <pre>
* Structure:
*  <weatherTypePage:LOOK>
*
* Example:
*  <weatherTypePage:rain>
*
* Translation:
*  This page is only active while it is raining where the player is standing.
* </pre>
*
* **The look, not the sky's condition.** A creature that comes out on clear summer nights is
* `fireflies` rather than `clear`, because fireflies are what a clear summer night looks like -
* which is also what `presetIds` enumerates and what the weather variable reports. Both a name
* and a number are accepted.
* @type {RegExp}
*/
J.WEATHER.EXT.TIME.RegExp.WeatherTypePage = /<weatherTypePage:[ ]?([a-zA-Z0-9_-]+)>/i;
/**
* Requires a page's weather to be at a particular strength.
*
* <pre>
* Structure:
*  <weatherIntensityPage:STRENGTH>
*
* Example:
*  <weatherIntensityPage:heavy>
*
* Translation:
*  This page is only active while the weather is at its heaviest.
* </pre>
* @type {RegExp}
*/
J.WEATHER.EXT.TIME.RegExp.WeatherIntensityPage = /<weatherIntensityPage:[ ]?([a-zA-Z0-9_-]+)>/i;
/**
* Requires a page's weather to fall within a span of strengths.
*
* <pre>
* Structure:
*  <weatherIntensityRangePage:WEAKEST-STRONGEST>
*
* Example:
*  <weatherIntensityRangePage:moderate-heavy>
*
* Translation:
*  This page is active from moderate weather upward, but not in a light drizzle.
* </pre>
*
* Inclusive at both ends. Distinct from the single-strength tag by name rather than by shape, so
* neither pattern can shadow the other however the table is ordered.
* @type {RegExp}
*/
J.WEATHER.EXT.TIME.RegExp.WeatherIntensityRangePage = /<weatherIntensityRangePage:[ ]?([a-zA-Z0-9]+)-([a-zA-Z0-9]+)>/i;

//#endregion
//#region src/plugins/weather/ext/time/core/ForecastWhen.js
/**
* How the forecast says *when* it is talking about.
*
* Three screens each need a slightly different amount of the same answer - the week wants a
* weekday and a date, today wants the season too, and here-and-now wants the clock on top of all
* of it. Building the strings here rather than in each window is what stops those three drifting
* into three date formats, and it is the only way any of this gets tested: `windows/**` is not
* measured, and a date format is exactly the sort of thing that is wrong by one somewhere.
*
* Seasons come back as the `\seasonOfYear[]` text code rather than a word, so the season arrives
* with the icon and colour J-TIME already gives it everywhere else in the game. The two plugins
* happen to number the seasons identically - spring is zero in both `SkyStates.Seasons` and
* `Time_Snapshot.SeasonsName` - so the forecast's own id can be handed straight over.
*/
var ForecastWhen = class ForecastWhen {
	/**
	* What day of the week a phase falls on.
	* @param {number} absolutePhase The phase being described.
	* @returns {string} The weekday's name.
	*/
	static weekdayOf(absolutePhase) {
		const dayOfWeekId = SkyForecast.dayOfWeekIdOf(absolutePhase);
		return Time_Snapshot.DaysOfWeekName(dayOfWeekId);
	}
	/**
	* A phase's date, without its season.
	* @param {number} absolutePhase The phase being described.
	* @returns {string} Something like `Thursday, Day 30 of Month 5`.
	*/
	static dateOf(absolutePhase) {
		const weekday = ForecastWhen.weekdayOf(absolutePhase);
		const day = SkyForecast.dayOfMonthOf(absolutePhase);
		const month = SkyForecast.monthOf(absolutePhase);
		return `${weekday}, Day ${day} of Month ${month}`;
	}
	/**
	* A phase's season, as the text code that draws it with its own icon.
	* @param {number} absolutePhase The phase being described.
	* @returns {string} A `\seasonOfYear[]` code.
	*/
	static seasonOf(absolutePhase) {
		const seasonId = SkyForecast.seasonIdOf(absolutePhase);
		return `\\seasonOfYear[${seasonId}]`;
	}
	/**
	* A phase's date and season together, ready for `drawTextEx`.
	* @param {number} absolutePhase The phase being described.
	* @returns {string} Something like `Thursday, Day 30 of Month 5 - \seasonOfYear[0]`.
	*/
	static dateLineOf(absolutePhase) {
		return `${ForecastWhen.dateOf(absolutePhase)} - ${ForecastWhen.seasonOf(absolutePhase)}`;
	}
	/**
	* A phase's time of day, as the text code that draws it with its own icon.
	* @param {number} absolutePhase The phase being described.
	* @returns {string} A `\timeOfDay[]` code.
	*/
	static phaseOf(absolutePhase) {
		return `\\timeOfDay[${SkyForecast.phaseOfDay(absolutePhase)}]`;
	}
	/**
	* The clock, as two padded figures.
	*
	* Padded because an unpadded clock reads as a decimal - `9:5` is not five past nine to anybody
	* glancing at it - and this is a line somebody glances at.
	* @param {number} hours The hour being shown.
	* @param {number} minutes The minute being shown.
	* @returns {string} Something like `09:05`.
	*/
	static clockOf(hours, minutes) {
		const paddedHours = String(hours).padStart(2, "0");
		const paddedMinutes = String(minutes).padStart(2, "0");
		return `${paddedHours}:${paddedMinutes}`;
	}
	/**
	* Everything the here-and-now view says about when it is, on one line.
	* @param {number} absolutePhase The phase being described.
	* @param {number} hours The hour being shown.
	* @param {number} minutes The minute being shown.
	* @returns {string} Ready for `drawTextEx`.
	*/
	static nowLineOf(absolutePhase, hours, minutes) {
		const clock = ForecastWhen.clockOf(hours, minutes);
		const phase = ForecastWhen.phaseOf(absolutePhase);
		return `${ForecastWhen.dateLineOf(absolutePhase)} - ${clock} ${phase}`;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/ClimateCurves.js
/**
* How one kind of place answers the sky rather than following it.
*
* Most places need nothing here. The Negative Peaks are tagged `<weather:snow>`, so a rainy sky is
* already snow up there and the map tag has done the whole job. **A climate exists for the one
* thing a tag cannot say: that somewhere responds to the sky inversely.** The Forest of Dreams is
* foggiest when the sky is at its *clearest*, and no amount of tuning the sky itself expresses
* that, because it is a statement about one particular place.
*
* That is also why a climate keys on the sky's **type** and not merely its strength. Clearness is a
* condition, not an amount - and an earlier design that mapped strength alone produced the exact
* opposite of the intent, turning a blazing cathedral of godrays into the forest's lightest fog.
*
* A table declares `byType` **or** `byIntensity`, never both, and falls back to its own `default`.
* Configuration validation rejects one carrying both, because which the author meant is not
* recoverable from the file.
*/
var ClimateCurves = class ClimateCurves {
	/**
	* Bends a sky's strength into what one place makes of it.
	*
	* **Only reached for a map that authored its own look.** `MapWeatherResolver.resolve` consults
	* the strength resolver on that branch alone, so a `<climate:>` tag on an untagged map does
	* nothing at all. That is the intended shape: a place with a climate is a place with a
	* character, and the climate says how the sky argues with it.
	* @param {{suppressed: boolean, preset: ?string, hasSky: boolean, climate: ?string}} declaration
	* What the map said.
	* @param {?{preset: string, intensity: string, type: string}} sky What the sky is doing.
	* @param {string} skyIntensity The strength the core resolver arrived at.
	* @returns {string} One of {@link WeatherPresets.Intensities}.
	*/
	static apply(declaration, sky, skyIntensity) {
		if (declaration.hasSky === false) return skyIntensity;
		if (sky === null) return skyIntensity;
		const climate = ClimateCurves.climateFor(declaration.climate);
		if (climate === null) return skyIntensity;
		const byType = ClimateCurves.lookUp(climate.byType, sky.type);
		if (byType !== null) return byType;
		const byIntensity = ClimateCurves.lookUp(climate.byIntensity, skyIntensity);
		if (byIntensity !== null) return byIntensity;
		return ClimateCurves.fallbackOf(climate, skyIntensity);
	}
	/**
	* The table a named climate answers the sky by.
	*
	* An unknown name is a content error rather than a contract violation - an author mistyped a tag
	* the regex was perfectly happy to match - so it is reported and the place simply follows the
	* sky. That is a visible and diagnosable outcome rather than a crash mid-playthrough.
	* @param {?string} climateName The name off the map's note, or null when it named none.
	* @returns {?object} The climate's table, or null when there is none to apply.
	*/
	static climateFor(climateName) {
		if (climateName === null) return null;
		const { climates } = J.WEATHER.EXT.TIME.Metadata;
		const climate = climates[climateName];
		if (climate === undefined) {
			Diagnostics.warn("J-Weather-Time", `no climate named: [ ${climateName} ]!`, { known: Object.keys(climates) });
			return null;
		}
		return climate;
	}
	/**
	* Reads one entry out of a climate's table.
	* @param {?object} table The table being consulted, or undefined when the climate declared none.
	* @param {string} key What is being looked up - a sky condition, or a strength.
	* @returns {?string} The strength the table names, or null when it has nothing to say.
	*/
	static lookUp(table, key) {
		if (table === undefined) return null;
		const found = table[key];
		if (found === undefined) return null;
		return found;
	}
	/**
	* What a climate makes of a sky its table said nothing about.
	*
	* Falls through to the sky's own strength rather than to some neutral rung, because a climate
	* that listed four conditions and omitted a fifth most likely has no opinion about the fifth.
	* @param {object} climate The climate being applied.
	* @param {string} skyIntensity The strength the core resolver arrived at.
	* @returns {string}
	*/
	static fallbackOf(climate, skyIntensity) {
		if (climate.default === undefined) return skyIntensity;
		return climate.default;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/MapWeatherResolver.js
/**
* Extends {@link MapWeatherResolver.declarationFor}.<br/>
* Also reads which climate, if any, the map answers the sky through.
*
* `MapWeatherResolver` belongs to J-Weather and is a hoisted global by the time this runs, so this
* needs no import - and the tag is read here rather than in core because core must not know its
* extensions exist.
*/
J.WEATHER.EXT.TIME.Aliased.MapWeatherResolver.set("declarationFor", MapWeatherResolver.declarationFor);
MapWeatherResolver.declarationFor = function(dataMap) {
	const declaration = J.WEATHER.EXT.TIME.Aliased.MapWeatherResolver.get("declarationFor").call(this, dataMap);
	declaration.climate = RPGManager.getStringFromNoteByRegex(dataMap, J.WEATHER.EXT.TIME.RegExp.Climate, true);
	return declaration;
};
/**
* Extends {@link MapWeatherResolver.intensityFor}.<br/>
* Also bends the sky's strength through whatever climate the place has.
*
* Aliasing the static rather than reaching into `resolve` keeps the whole of this extension's
* opinion in one place: core decides what strength the sky implies, and this decides what one
* particular place makes of that.
*/
J.WEATHER.EXT.TIME.Aliased.MapWeatherResolver.set("intensityFor", MapWeatherResolver.intensityFor);
MapWeatherResolver.intensityFor = function(declaration, sky) {
	const skyIntensity = J.WEATHER.EXT.TIME.Aliased.MapWeatherResolver.get("intensityFor").call(this, declaration, sky);
	return ClimateCurves.apply(declaration, sky, skyIntensity);
};

//#endregion
//#region src/plugins/weather/ext/time/core/ForecastVoice.js
/**
* Somebody's opinion of the weather, instead of a readout of it.
*
* "rain, moderate" is a fact. A party member saying they would not go up the mountain today is
* the same fact doing something - and the forecast is the one screen in the game where a number
* is strictly worse than a sentence.
*
* **Only people who are actually here speak.** A line belongs to an actor, and an actor who has
* not joined the party yet has no business remarking on anything. That is also what keeps the
* screen feeling like it belongs to whoever is travelling with you rather than to the UI.
*
* Lines are keyed by look, then optionally by strength. A look that writes only `any` uses those
* lines at every strength, so an author owes fifteen states rather than forty-five up front and
* can split the ones where a drizzle and a downpour genuinely want different words.
*/
var ForecastVoice = class ForecastVoice {
	/**
	* The key holding lines that suit a look at any strength.
	* @type {string}
	*/
	static Any = "any";
	/**
	* The key holding lines for somewhere with no weather at all.
	* @type {string}
	*/
	static Sheltered = "none";
	/**
	* Every line written for a given weather, whoever says them.
	* @param {object} voices The `voices` block of the sky configuration.
	* @param {?{preset: string, intensity: string}} weather What is falling, or null for nothing.
	* @returns {{who: number, says: string}[]} The lines, or an empty list when none are written.
	*/
	static linesFor(voices, weather) {
		const key = weather === null ? ForecastVoice.Sheltered : weather.preset;
		const written = voices[key];
		if (written === undefined) return [];
		if (weather !== null && written[weather.intensity] !== undefined) return written[weather.intensity];
		if (written[ForecastVoice.Any] !== undefined) return written[ForecastVoice.Any];
		return [];
	}
	/**
	* The lines belonging to people who are actually travelling with the player.
	* @param {{who: number, says: string}[]} lines Every line written for this weather.
	* @param {number[]} presentIds The actor ids currently in the party.
	* @returns {{who: number, says: string}[]}
	*/
	static spokenBy(lines, presentIds) {
		return lines.filter((line) => presentIds.includes(line.who));
	}
	/**
	* Picks one line.
	*
	* Rolled rather than cycled, because a screen a player opens constantly wants to not be the
	* same screen every time, and a rotation is something they would eventually learn the order of.
	* @param {{who: number, says: string}[]} lines The lines available.
	* @param {number} roll A roll in [0, 1).
	* @returns {?{who: number, says: string}} One line, or null when there were none.
	*/
	static pick(lines, roll) {
		if (lines.length === 0) return null;
		const index = Math.min(Math.floor(roll * lines.length), lines.length - 1);
		return lines[index];
	}
	/**
	* What somebody in the party has to say about the weather, if anybody does.
	* @param {object} voices The `voices` block of the sky configuration.
	* @param {?{preset: string, intensity: string}} weather What is falling, or null for nothing.
	* @param {number[]} presentIds The actor ids currently in the party.
	* @param {number} roll A roll in [0, 1).
	* @returns {?{who: number, says: string}} A remark, or null when nobody present has one.
	*/
	static remarkFor(voices, weather, presentIds, roll) {
		const written = ForecastVoice.linesFor(voices, weather);
		const available = ForecastVoice.spokenBy(written, presentIds);
		return ForecastVoice.pick(available, roll);
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/ForecastDigest.js
/**
* What the forecast says, as a player is told it.
*
* **This is the sky over Raevula, and only that.** Erocia has one weather system and one town left
* standing on it, so there is exactly one forecast and no way for anybody to check the sky
* somewhere they are not. The diagnostic screen breaks it down by destination; this deliberately
* does not, both because the player has no in-world way to know that and because a menu naming the
* Negative Peaks tells them the Negative Peaks exist.
*
* Two grains, because a player asks two different questions. *What is the rest of today doing* is
* answered phase by phase. *Is this week worth travelling in* is answered at a glance, three
* readings a day across a week, because nobody is planning around the difference between dawn and
* morning seven days out.
*/
var ForecastDigest = class ForecastDigest {
	/**
	* How many phases a day holds.
	* @type {number}
	*/
	static PhasesPerDay = 6;
	/**
	* The phases a week's overview samples, when the config names none.
	*
	* Three readings rather than six: morning, midday and evening is the shape of a day at the
	* distance a week is read from, and doubling the cells buys nothing but width.
	* @type {number[]}
	*/
	static DefaultWeekPhases = [
		1,
		3,
		4
	];
	/**
	* How many days a week's overview covers, when the config names none.
	* @type {number}
	*/
	static DefaultWeekDays = 7;
	/**
	* What the sky over Raevula is at one phase.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {?{preset: string, intensity: string, type: string}} The sky, or null when the
	* forecast does not reach that far.
	*/
	static skyAt(sky, forecast, absolutePhase) {
		const state = SkyForecast.stateAt(forecast, absolutePhase);
		if (state === null) return null;
		const seasonName = SkyForecast.seasonNameOf(absolutePhase);
		const phaseOfDay = SkyForecast.phaseOfDay(absolutePhase);
		return {
			preset: SkyStates.faceFor(sky, state.type, seasonName, phaseOfDay),
			intensity: state.intensity,
			type: state.type
		};
	}
	/**
	* The rest of today, phase by phase.
	*
	* The whole day rather than only what is left of it, because a forecast that shortens as the day
	* wears on gives the player a different-shaped screen every time they open it, and because what
	* the morning *was* is useful context for reading what the evening will be.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} nowPhase The phase the clock has reached.
	* @returns {{startPhase: number, nowColumn: number, entries: object[]}}
	*/
	static today(sky, forecast, nowPhase) {
		const dayStart = SkyForecast.startOfDay(nowPhase);
		const entries = [];
		for (let phaseOfDay = 0; phaseOfDay < ForecastDigest.PhasesPerDay; phaseOfDay++) {
			entries.push({
				phaseOfDay,
				sky: ForecastDigest.skyAt(sky, forecast, dayStart + phaseOfDay)
			});
		}
		return {
			startPhase: dayStart,
			nowColumn: nowPhase - dayStart,
			entries
		};
	}
	/**
	* Which phases a week's overview samples.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @returns {number[]}
	*/
	static weekPhasesOf(sky) {
		if (sky.weekPhases === undefined) return ForecastDigest.DefaultWeekPhases;
		return sky.weekPhases;
	}
	/**
	* How many days a week's overview covers.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @returns {number}
	*/
	static weekDaysOf(sky) {
		if (sky.weekDays === undefined) return ForecastDigest.DefaultWeekDays;
		return sky.weekDays;
	}
	/**
	* The week ahead, sampled a few readings a day.
	*
	* **No strength.** At this distance the useful question is whether a day is wet or clear, and a
	* second mark per cell to say how wet turns a glanceable week into something that has to be
	* studied. Today's view carries the detail.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} nowPhase The phase the clock has reached.
	* @returns {{phases: number[], days: object[]}}
	*/
	static week(sky, forecast, nowPhase) {
		const dayStart = SkyForecast.startOfDay(nowPhase);
		const phases = ForecastDigest.weekPhasesOf(sky);
		const days = [];
		for (let dayOffset = 0; dayOffset < ForecastDigest.weekDaysOf(sky); dayOffset++) {
			const start = dayStart + dayOffset * ForecastDigest.PhasesPerDay;
			days.push({
				dayOffset,
				startPhase: start,
				cells: phases.map((phaseOfDay) => ForecastDigest.presetAt(sky, forecast, start + phaseOfDay))
			});
		}
		return {
			phases,
			days
		};
	}
	/**
	* Just the look at one phase, for a view that shows nothing else.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {?string} The preset name, or null when the forecast does not reach that far.
	*/
	static presetAt(sky, forecast, absolutePhase) {
		const resolved = ForecastDigest.skyAt(sky, forecast, absolutePhase);
		if (resolved === null) return null;
		return resolved.preset;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/ForecastPlaces.js
/**
* What the forecast knows about the places it reports on.
*
* **A place is a map id and nothing else.** The alternative - restating each destination's weather
* in the config - would mean every place authored twice, and the two copies drifting the first
* time somebody retags a map and forgets this list exists. So the forecast reads the same note the
* map itself reads, through the same resolver, and cannot disagree with what the player will
* actually walk into.
*
* That is possible because `StorageManager.fsReadFile` is synchronous and a map's note lives in a
* file sitting right there. Reading the five largest maps in Chef Adventure costs about four
* milliseconds all told, and the results are held for the session, so the whole exercise happens
* once.
*
* **It does mean the forecast cannot work without a filesystem**, which is a constraint this whole
* ecosystem already lives under: every external config is loaded the same way.
*/
var ForecastPlaces = class ForecastPlaces {
	/**
	* How many digits a map file's number is padded to, matching how RPG Maker names them.
	* @type {number}
	*/
	static IdDigits = 3;
	/**
	* Declarations already read this session, keyed by map id.
	*
	* Held because a map's note cannot change while the game is running, and because the forecast
	* scene is something a player may open repeatedly.
	* @type {Map<number, ?object>}
	*/
	static #known = new Map();
	/**
	* Where a given map's data file lives, relative to the project.
	* @param {number} mapId The map being read.
	* @returns {string}
	*/
	static pathFor(mapId) {
		const padded = String(mapId).padStart(ForecastPlaces.IdDigits, "0");
		return `data/Map${padded}.json`;
	}
	/**
	* Reads one map's own weather declaration off disk.
	*
	* `extractMetadata` is the engine's own, and running it here is what makes the loaded object
	* indistinguishable from the `$dataMap` the resolver normally sees - notes parsed into `meta`,
	* exactly as a real map load would leave it.
	* @param {number} mapId The map being read.
	* @returns {?object} What that map declared, or null when there is no such map file.
	*/
	static declarationOf(mapId) {
		if (ForecastPlaces.#known.has(mapId) === true) return ForecastPlaces.#known.get(mapId);
		const declaration = ForecastPlaces.readDeclaration(mapId);
		ForecastPlaces.#known.set(mapId, declaration);
		return declaration;
	}
	/**
	* Reads and parses one map, without consulting or updating what is already known.
	* @param {number} mapId The map being read.
	* @returns {?object} What that map declared, or null when there is no such map file.
	*/
	static readDeclaration(mapId) {
		const path = ForecastPlaces.pathFor(mapId);
		const raw = StorageManager.fsReadFile(path);
		if (raw === null) {
			Diagnostics.warn("J-Weather-Time", `forecast names a map that does not exist: [ ${path} ]!`);
			return null;
		}
		const dataMap = JSON.parse(raw);
		DataManager.extractMetadata(dataMap);
		return MapWeatherResolver.declarationFor(dataMap);
	}
	/**
	* Every configured place, paired with what its map declared.
	*
	* A place whose map could not be read is dropped rather than shown blank, because a row that
	* says nothing is worse than a row that is not there - it reads as "clear" to anybody scanning.
	* @param {object[]} places The `places` block of the sky configuration.
	* @returns {{name: string, declaration: object}[]}
	*/
	static resolveAll(places) {
		if (places === undefined) return [];
		return places.map((place) => ({
			name: place.name,
			declaration: ForecastPlaces.declarationOf(place.mapId)
		})).filter((place) => place.declaration !== null);
	}
	/**
	* Forgets every map read so far.
	*
	* For tests, and for the plugin command that exists so somebody retagging a map can see the
	* change without restarting the game.
	*/
	static forget() {
		ForecastPlaces.#known.clear();
	}
};

//#endregion
//#region src/plugins/weather/ext/time/core/ForecastTable.js
/**
* One day of the forecast, as a grid of what each place will actually look like.
*
* **The sky is not the answer a player wants.** They want to know whether to go up the mountain,
* and the sky over Erocia being clear says nothing useful about that - the Negative Peaks are
* snowy under a clear sky, and the Forest of Dreams is at its foggiest under one. So every row
* here is a *destination*, resolved through the same `MapWeatherResolver.resolve` the game itself
* runs on arrival, and the sky rides along at the top as the thing the rest are answers to.
*
* Everything is worked out here rather than in the window, because a window is excluded from
* coverage and this is where the interesting mistakes would live - an off-by-one in the phase
* columns, a place resolved against the wrong hour, a day that quietly shows yesterday.
*/
var ForecastTable = class ForecastTable {
	/**
	* How many phases one row of the grid covers.
	* @type {number}
	*/
	static Columns = 6;
	/**
	* The label the sky's own row carries.
	* @type {string}
	*/
	static SkyRowName = "Sky";
	/**
	* The answer for a phase the forecast has not rolled.
	*
	* Reachable by paging past the end of a window that was somehow not topped up, and drawn as a
	* blank rather than guessed at.
	* @type {null}
	*/
	static Unknown = null;
	/**
	* Builds one day of the grid.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} nowPhase The phase the clock has actually reached.
	* @param {number} dayOffset How many days ahead of today this page is; zero is today.
	* @returns {{startPhase: number, dayOffset: number, nowColumn: number, rows: object[]}}
	*/
	static build(sky, forecast, nowPhase, dayOffset) {
		const dayStart = SkyForecast.startOfDay(nowPhase) + dayOffset * ForecastTable.Columns;
		const places = ForecastPlaces.resolveAll(sky.places);
		const skies = [];
		for (let column = 0; column < ForecastTable.Columns; column++) {
			skies.push(ForecastTable.skyAt(sky, forecast, dayStart + column));
		}
		const rows = [ForecastTable.skyRow(skies)];
		places.forEach((place) => rows.push(ForecastTable.placeRow(place, skies)));
		return {
			startPhase: dayStart,
			dayOffset,
			nowColumn: ForecastTable.nowColumnOf(nowPhase, dayStart),
			rows
		};
	}
	/**
	* Which column of a day's grid is the one happening right now.
	* @param {number} nowPhase The phase the clock has reached.
	* @param {number} dayStart The first phase of the day being shown.
	* @returns {number} The column, or -1 when the day being shown is not today.
	*/
	static nowColumnOf(nowPhase, dayStart) {
		const column = nowPhase - dayStart;
		if (column < 0) return -1;
		if (column >= ForecastTable.Columns) return -1;
		return column;
	}
	/**
	* What the sky itself is doing at one phase.
	* @param {object} sky The parsed `sky` block of `config.weather.json`.
	* @param {{startPhase: number, types: string[], intensities: string[]}} forecast The forecast.
	* @param {number} absolutePhase The phase being asked about.
	* @returns {?{preset: string, intensity: string, type: string}} The sky, or null when the
	* forecast does not reach this far.
	*/
	static skyAt(sky, forecast, absolutePhase) {
		const state = SkyForecast.stateAt(forecast, absolutePhase);
		if (state === null) return ForecastTable.Unknown;
		const seasonName = SkyForecast.seasonNameOf(absolutePhase);
		const phaseOfDay = SkyForecast.phaseOfDay(absolutePhase);
		return {
			preset: SkyStates.faceFor(sky, state.type, seasonName, phaseOfDay),
			intensity: state.intensity,
			type: state.type
		};
	}
	/**
	* The row describing the sky over the island.
	* @param {?object[]} skies What the sky is doing at each phase of the day.
	* @returns {{name: string, cells: ?object[]}}
	*/
	static skyRow(skies) {
		return {
			name: ForecastTable.SkyRowName,
			cells: skies.map((sky) => ForecastTable.cellOf(sky))
		};
	}
	/**
	* The row describing what one destination makes of that sky.
	* @param {{name: string, declaration: object}} place The destination being described.
	* @param {?object[]} skies What the sky is doing at each phase of the day.
	* @returns {{name: string, cells: ?object[]}}
	*/
	static placeRow(place, skies) {
		return {
			name: place.name,
			cells: skies.map((sky) => ForecastTable.resolvedCell(place.declaration, sky))
		};
	}
	/**
	* One cell of the sky's own row.
	* @param {?object} sky What the sky is doing, or null when unknown.
	* @returns {?{preset: string, intensity: string}}
	*/
	static cellOf(sky) {
		if (sky === ForecastTable.Unknown) return ForecastTable.Unknown;
		return {
			preset: sky.preset,
			intensity: sky.intensity
		};
	}
	/**
	* One cell of a destination's row.
	*
	* Resolved through the very same method the game runs on arrival, which is the whole reason a
	* forecast can be trusted: there is no second implementation of "what does this place make of
	* that sky" that could drift from the first.
	* @param {object} declaration What that place's map declared.
	* @param {?object} sky What the sky is doing, or null when unknown.
	* @returns {?{preset: string, intensity: string}} What would be drawn there, or null for
	* nothing at all - which is a real answer, and the one a sheltered place gives.
	*/
	static resolvedCell(declaration, sky) {
		if (sky === ForecastTable.Unknown) return ForecastTable.Unknown;
		return MapWeatherResolver.resolve(declaration, sky);
	}
};

//#endregion
//#region src/plugins/weather/ext/time/managers/ForecastDirector.js
/**
* Owns the forecast, and decides when the sky reaches the screen.
*
* **The work is split in two, and the split is the whole design.** `advance` moves the forecast
* along and touches nothing but the save slice and the clock handed to it. `push` tells J-Weather
* what the sky is doing, which reaches map data by way of `WeatherDirector.refresh`.
*
* They are separate because the clock announces the time from inside its own constructor, during
* game-object creation, long before any map exists - so a hook that pushed would crash on every
* new game. `TimeLightingCoordinator` solves the same problem by keeping map reads out of the
* announcement entirely; this cannot copy that, because pushing *is* a map read. Splitting is what
* gets the same guarantee: **push only ever happens from the map scene, by construction, rather
* than behind a check for whether a map exists.**
*/
var ForecastDirector = class ForecastDirector {
	/**
	* Whether the sky has moved since the screen was last told about it.
	*
	* A static rather than a saved field, and correct as one: it resets to false on a load, and an
	* arrival pushes unconditionally anyway. What must survive a load is *which phase was applied*,
	* and that lives on `Game_System`.
	* @type {boolean}
	*/
	static #pending = false;
	/**
	* The parsed sky configuration.
	* @returns {object}
	*/
	static sky() {
		return J.WEATHER.EXT.TIME.Metadata.sky;
	}
	/**
	* How many phases ahead of now the forecast is kept.
	* @returns {number}
	*/
	static horizon() {
		return ForecastDirector.sky().forecastPhases;
	}
	/**
	* A fresh roll for each axis of one phase's walk.
	*
	* Drawn here rather than inside the walk, which is what keeps every calculation in
	* {@link SkyWalk} a pure function of its arguments and assertable to an exact value.
	* @returns {{type: number, intensity: number}}
	*/
	static rollFor() {
		return {
			type: Math.random(),
			intensity: Math.random()
		};
	}
	/**
	* Which phase of the calendar a clock is showing.
	* @param {Game_Time} clock The clock being read.
	* @returns {number} The absolute phase, or {@link SkyForecast.OffClock}.
	*/
	static phaseOf(clock) {
		const phaseOfDay = TimePhases.phaseOfHour(clock.hours());
		return SkyForecast.absolutePhaseOf(clock.years(), clock.months(), clock.days(), phaseOfDay);
	}
	/**
	* Brings the forecast up to the clock, and notes whether that changed anything.
	*
	* **Called on every announcement, and the clock announces every game minute** - roughly every six
	* real seconds - so nearly every call here does nothing at all. Only a genuine phase crossing
	* gets past the dedupe, which at Chef Adventure's tick rate is about once every twenty-four real
	* minutes.
	*
	* Touches the save slice and the clock handed in, and nothing else. See the class summary for why
	* that restriction is load-bearing rather than tidiness.
	* @param {Game_Time} clock The clock announcing the time.
	*/
	static advance(clock) {
		const phase = ForecastDirector.phaseOf(clock);
		if (phase === SkyForecast.OffClock) return;
		if (phase === $gameSystem.lastAppliedSkyPhase()) return;
		const extended = SkyForecast.ensureCovers(ForecastDirector.sky(), $gameSystem.skyForecast(), SkyForecast.startOfDay(phase), phase + ForecastDirector.horizon(), ForecastDirector.rollFor);
		$gameSystem.setSkyForecast(extended);
		$gameSystem.setLastAppliedSkyPhase(phase);
		ForecastDirector.flagPending();
	}
	/**
	* What the sky is doing at the clock's current phase.
	*
	* The preset is the **face** rather than the condition, because that is what `setSky` wants and
	* because season and hour are this class's business rather than J-Weather's. The condition rides
	* along beside it so a climate can key on how clear the sky is, which is a thing no face can say.
	* @param {Game_Time} clock The clock being read.
	* @returns {?{preset: string, intensity: string, type: string}} The sky, or null when the clock
	* is showing an hour that belongs to no phase.
	*/
	static skyFor(clock) {
		const phase = ForecastDirector.phaseOf(clock);
		if (phase === SkyForecast.OffClock) return null;
		const state = SkyForecast.stateAt($gameSystem.skyForecast(), phase);
		const sky = ForecastDirector.sky();
		const seasonName = SkyForecast.seasonNameOf(phase);
		const preset = SkyStates.faceFor(sky, state.type, seasonName, SkyForecast.phaseOfDay(phase));
		return {
			preset,
			intensity: state.intensity,
			type: state.type
		};
	}
	/**
	* Tells J-Weather what the sky is doing.
	*
	* **Only ever called from the map scene**, which is what makes `$dataMap` being the arriving map
	* a property of where this runs rather than something to check for.
	*
	* Advances first, so a forecast that does not yet reach this phase is wound forward before it is
	* read. That matters on exactly one path and it is a path every existing player will take: a save
	* written before this plugin shipped restores a `Game_System` whose slice was seeded rather than
	* saved, holding an empty forecast that covers nothing.
	* @param {Game_Time} clock The clock being read.
	*/
	static push(clock) {
		ForecastDirector.advance(clock);
		ForecastDirector.clearPending();
		const sky = ForecastDirector.skyFor(clock);
		if (sky === null) return;
		WeatherDirector.setSky(sky);
	}
	/**
	* Tells J-Weather what the sky is doing, if it has moved since last time.
	*
	* The fork lives here rather than in the scene that calls it, because `scenes/**` is excluded
	* from coverage and a branch written up there is a branch nothing measures.
	* @param {Game_Time} clock The clock being read.
	*/
	static pushIfPending(clock) {
		if (ForecastDirector.isPending() === false) return;
		ForecastDirector.push(clock);
	}
	/**
	* How many days ahead the forecast is willing to be read.
	*
	* Short on purpose. The window holds a year, but a forecast a player can read a year of is a
	* forecast that has stopped being weather and started being a timetable - the interesting
	* question is what tomorrow looks like, not what the ninth of next autumn does.
	* @returns {number}
	*/
	static visibleDays() {
		return ForecastDirector.sky().visibleDays;
	}
	/**
	* Pulls a requested day into the range the forecast will show.
	*
	* Clamped rather than wrapped, so holding the key at either end simply stops - wrapping from
	* the last day back to today reads as the page having glitched.
	*
	* Lives here rather than in the scene because `scenes/**` is excluded from coverage, and an
	* off-by-one at either end of a page control is exactly the sort of thing a test should be
	* holding rather than a playthrough.
	* @param {number} dayOffset How many days ahead was asked for.
	* @returns {number} A day offset the forecast will actually show.
	*/
	static clampDayOffset(dayOffset) {
		if (dayOffset < 0) return 0;
		const last = ForecastDirector.visibleDays() - 1;
		if (dayOffset > last) return last;
		return dayOffset;
	}
	/**
	* One day of the forecast, ready to draw.
	* @param {Game_Time} clock The clock being read.
	* @param {number} dayOffset How many days ahead of today; zero is today.
	* @returns {object} The day, as {@link ForecastTable} builds it.
	*/
	static tableFor(clock, dayOffset) {
		return ForecastTable.build(ForecastDirector.sky(), $gameSystem.skyForecast(), ForecastDirector.phaseOf(clock), dayOffset);
	}
	/**
	* The rest of today over Raevula, ready to draw.
	* @param {Game_Time} clock The clock being read.
	* @returns {object} The day, as {@link ForecastDigest} builds it.
	*/
	static todayFor(clock) {
		return ForecastDigest.today(ForecastDirector.sky(), $gameSystem.skyForecast(), ForecastDirector.phaseOf(clock));
	}
	/**
	* The week ahead over Raevula, ready to draw.
	* @param {Game_Time} clock The clock being read.
	* @returns {object} The week, as {@link ForecastDigest} builds it.
	*/
	static weekFor(clock) {
		return ForecastDigest.week(ForecastDirector.sky(), $gameSystem.skyForecast(), ForecastDirector.phaseOf(clock));
	}
	/**
	* What the weather is doing where the player is standing, and whatever somebody said about it.
	*
	* **The only part of the forecast that is not about Raevula.** The two forward-looking views
	* describe the sky over the town, which is the only forecast anybody on Erocia could have; this
	* describes the here and now, so a cave reports a cave.
	*
	* The remark is null until somebody has written lines for this weather, and the window draws
	* the plain reading in that case rather than an empty space.
	* @param {Game_Time} clock The clock being read.
	* @returns {{weather: ?{preset: string, intensity: string}, when: string, remark: ?object}}
	*/
	static readingHere(clock) {
		const weather = WeatherDirector.current();
		return {
			weather,
			when: ForecastDirector.whenLine(clock),
			remark: ForecastVoice.remarkFor(ForecastDirector.voices(), weather, ForecastDirector.partyActorIds(), Math.random())
		};
	}
	/**
	* When "now" is, in words.
	*
	* Built here rather than in the window so the format is testable, and so the three views cannot
	* drift into three ways of writing a date.
	* @returns {string} Ready for `drawTextEx`, or {@link String.empty} off the clock.
	*/
	static whenLine(clock) {
		const phase = ForecastDirector.phaseOf(clock);
		if (phase === SkyForecast.OffClock) return String.empty;
		return ForecastWhen.nowLineOf(phase, clock.hours(), clock.minutes());
	}
	/**
	* Every line anybody has written about the weather.
	* @returns {object} The `voices` block, or nothing written at all.
	*/
	static voices() {
		const { voices } = ForecastDirector.sky();
		if (voices === undefined) return {};
		return voices;
	}
	/**
	* Who is currently travelling with the player.
	*
	* Only these people get to remark on anything - somebody who has not joined yet has no
	* business having an opinion, and a line from them would be a spoiler with a face attached.
	* @returns {number[]}
	*/
	static partyActorIds() {
		return $gameParty.members().map((member) => member.actorId());
	}
	/**
	* Whether the sky has moved since the screen was last told about it.
	* @returns {boolean}
	*/
	static isPending() {
		return ForecastDirector.#pending;
	}
	/**
	* Notes that the sky has moved.
	*/
	static flagPending() {
		ForecastDirector.#pending = true;
	}
	/**
	* Notes that the screen has been told.
	*/
	static clearPending() {
		ForecastDirector.#pending = false;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/_models/WeatherConditional.js
/**
* One requirement an event page places on the weather.
*
* **Immutable, and built through the named factories rather than assembled field by field.** A
* conditional exists for the length of one `meetsConditions` call and answers one question, so
* there is nothing for a setter to be for - and a half-built conditional is a thing that can
* silently mean "any weather at all".
*
* A single strength and a range are the same mechanism with the bounds set equal, which is what
* keeps `isMet` three comparisons rather than a fork per tag shape.
*/
var WeatherConditional = class WeatherConditional {
	/**
	* The value a bound takes when it constrains nothing.
	*
	* Not zero, because zero is a real answer: it is what the weather reports when there is none,
	* and a page requiring "no weather" is a page somebody will eventually write.
	* @type {number}
	*/
	static Any = -1;
	/**
	* The look this page requires, or {@link WeatherConditional.Any}.
	* @type {number}
	*/
	#typeId = WeatherConditional.Any;
	/**
	* The weakest strength this page accepts, or {@link WeatherConditional.Any}.
	* @type {number}
	*/
	#minIntensity = WeatherConditional.Any;
	/**
	* The strongest strength this page accepts, or {@link WeatherConditional.Any}.
	* @type {number}
	*/
	#maxIntensity = WeatherConditional.Any;
	/**
	* Constructor.
	* @param {number} typeId The look required, or {@link WeatherConditional.Any}.
	* @param {number} minIntensity The weakest strength accepted, or {@link WeatherConditional.Any}.
	* @param {number} maxIntensity The strongest strength accepted, or {@link WeatherConditional.Any}.
	*/
	constructor(typeId, minIntensity, maxIntensity) {
		this.#typeId = typeId;
		this.#minIntensity = minIntensity;
		this.#maxIntensity = maxIntensity;
	}
	/**
	* A requirement on the look, and nothing else.
	* @param {number} typeId The declared id of the look required.
	* @returns {WeatherConditional}
	*/
	static forType(typeId) {
		return new WeatherConditional(typeId, WeatherConditional.Any, WeatherConditional.Any);
	}
	/**
	* A requirement on the strength, and nothing else.
	* @param {number} intensityId The declared id of the strength required.
	* @returns {WeatherConditional}
	*/
	static forIntensity(intensityId) {
		return new WeatherConditional(WeatherConditional.Any, intensityId, intensityId);
	}
	/**
	* A requirement that the strength fall within a span, inclusive at both ends.
	* @param {number} minIntensity The declared id of the weakest strength accepted.
	* @param {number} maxIntensity The declared id of the strongest strength accepted.
	* @returns {WeatherConditional}
	*/
	static forIntensityRange(minIntensity, maxIntensity) {
		return new WeatherConditional(WeatherConditional.Any, minIntensity, maxIntensity);
	}
	/**
	* Gets the look this page requires.
	* @returns {number} The typeId, or {@link WeatherConditional.Any}.
	*/
	typeId() {
		return this.#typeId;
	}
	/**
	* Gets the weakest strength this page accepts.
	* @returns {number} The minIntensity, or {@link WeatherConditional.Any}.
	*/
	minIntensity() {
		return this.#minIntensity;
	}
	/**
	* Gets the strongest strength this page accepts.
	* @returns {number} The maxIntensity, or {@link WeatherConditional.Any}.
	*/
	maxIntensity() {
		return this.#maxIntensity;
	}
	/**
	* Whether the weather currently on screen satisfies this requirement.
	* @param {number} typeId The declared id of the look being drawn, or zero for none.
	* @param {number} intensityId The declared id of its strength, or zero for none.
	* @returns {boolean}
	*/
	isMet(typeId, intensityId) {
		if (this.#typeId !== WeatherConditional.Any && this.#typeId !== typeId) return false;
		if (this.#minIntensity !== WeatherConditional.Any && intensityId < this.#minIntensity) return false;
		if (this.#maxIntensity !== WeatherConditional.Any && intensityId > this.#maxIntensity) return false;
		return true;
	}
};

//#endregion
//#region src/plugins/weather/ext/time/objects/WeatherMapper.js
/**
* Turns a page comment into the weather requirement it declares.
*
* **Tags name what is on screen, not what the sky is doing.** A creature that comes out on clear
* summer nights is tagged `fireflies`, because fireflies are what a clear summer night looks like
* where the player is standing - and because that is the vocabulary `presetIds` already
* enumerates and the weather variable already reports. An author should never meet two dialects
* for one thing.
*
* Names and numbers are both accepted, matching how `<timeOfDayPage:>` reads. Numbers are resolved
* against the same `presetIds` and `intensityIds` blocks the variable mirror uses, so a tag and a
* conditional branch written against the variable can never disagree.
*/
var WeatherMapper = class WeatherMapper {
	/**
	* The kinds of weather requirement a comment can declare, in the order they are tested.
	*
	* Order is not load-bearing here - unlike J-TIME's table, no tag name is a prefix of another
	* once the captures are stripped - but the list is kept in one place for the same reason: a new
	* requirement is a row rather than another branch in the parser.
	* @type {{key: string, map: function(string, RegExp): WeatherConditional}[]}
	*/
	static ConditionalKinds = [
		{
			key: "WeatherTypePage",
			map: (comment, regex) => WeatherMapper.typeToConditional(comment, regex)
		},
		{
			key: "WeatherIntensityRangePage",
			map: (comment, regex) => WeatherMapper.intensityRangeToConditional(comment, regex)
		},
		{
			key: "WeatherIntensityPage",
			map: (comment, regex) => WeatherMapper.intensityToConditional(comment, regex)
		}
	];
	/**
	* Whether a comment declares a weather requirement at all.
	* @param {string} comment The comment being examined.
	* @returns {boolean}
	*/
	static isWeatherComment(comment) {
		return WeatherMapper.ConditionalKinds.some((kind) => J.WEATHER.EXT.TIME.RegExp[kind.key].test(comment));
	}
	/**
	* Parses a comment into the requirement it declares.
	*
	* The regex table is read per call rather than captured when this class is defined, because the
	* table is populated during plugin bootstrap.
	* @param {string} comment The comment to parse.
	* @returns {?WeatherConditional} The requirement, or null when the comment declares none. Null is
	* meaningful: the caller distinguishes an unparsed tag from a parsed one and reports it.
	*/
	static toConditional(comment) {
		const kind = WeatherMapper.ConditionalKinds.find((candidate) => J.WEATHER.EXT.TIME.RegExp[candidate.key].test(comment));
		if (kind === undefined) return null;
		return kind.map(comment, J.WEATHER.EXT.TIME.RegExp[kind.key]);
	}
	/**
	* Builds a requirement on the look being drawn.
	* @param {string} comment The comment being parsed.
	* @param {RegExp} regex The pattern that matched it.
	* @returns {WeatherConditional}
	*/
	static typeToConditional(comment, regex) {
		const [, token] = regex.exec(comment);
		return WeatherConditional.forType(WeatherMapper.typeIdOf(token));
	}
	/**
	* Builds a requirement on the strength being drawn.
	* @param {string} comment The comment being parsed.
	* @param {RegExp} regex The pattern that matched it.
	* @returns {WeatherConditional}
	*/
	static intensityToConditional(comment, regex) {
		const [, token] = regex.exec(comment);
		return WeatherConditional.forIntensity(WeatherMapper.intensityIdOf(token));
	}
	/**
	* Builds a requirement that the strength fall within a span.
	* @param {string} comment The comment being parsed.
	* @param {RegExp} regex The pattern that matched it.
	* @returns {WeatherConditional}
	*/
	static intensityRangeToConditional(comment, regex) {
		const [, from, to] = regex.exec(comment);
		return WeatherConditional.forIntensityRange(WeatherMapper.intensityIdOf(from), WeatherMapper.intensityIdOf(to));
	}
	/**
	* The declared id of a look, written as either its name or its number.
	* @param {string} token What the author typed.
	* @returns {number}
	*/
	static typeIdOf(token) {
		const asNumber = parseInt(token);
		if (Number.isNaN(asNumber) === false) return asNumber;
		return WeatherVariables.typeIdFor(J.WEATHER.Metadata.weatherConfig, token);
	}
	/**
	* The declared id of a strength, written as either its name or its number.
	* @param {string} token What the author typed.
	* @returns {number}
	*/
	static intensityIdOf(token) {
		const asNumber = parseInt(token);
		if (Number.isNaN(asNumber) === false) return asNumber;
		return WeatherVariables.intensityIdFor(J.WEATHER.Metadata.weatherConfig, token);
	}
};

//#endregion
//#region src/plugins/weather/ext/time/objects/Game_Event.js
/**
* Extends {@link meetsConditions}.<br/>
* Also includes the custom conditions that relate to the weather.
*
* J-TIME and J-Omni-Quest both alias this same method, and the chain holds because each calls the
* one before it. Weather is a separate domain from either: J-TIME's conditional kinds all return a
* `TimeConditional` whose fields are clock fields, so registering into its table was never an
* option. J-Omni-Quest is the precedent followed here instead.
* @param {any} page The page driving this step.
* @returns {boolean}
*/
J.WEATHER.EXT.TIME.Aliased.Game_Event.set("meetsConditions", Game_Event.prototype.meetsConditions);
Game_Event.prototype.meetsConditions = function(page) {
	const metOtherPageConditions = J.WEATHER.EXT.TIME.Aliased.Game_Event.get("meetsConditions").call(this, page);
	if (!metOtherPageConditions) return false;
	const commentCommandList = Game_Event.getValidCommentCommandsFromPage(page);
	if (commentCommandList.length === 0) return true;
	const weatherConditionals = Game_Event.toWeatherConditionals(commentCommandList);
	if (weatherConditionals.length === 0) return true;
	return weatherConditionals.every(Game_Event.weatherConditionalMet, this);
};
/**
* Filters the comment commands to only weather conditionals- should any exist in the collection.
* @param {RPG_EventListCommand[]} commentCommandList The comment commands to potentially convert.
* @returns {WeatherConditional[]}
*/
Game_Event.toWeatherConditionals = function(commentCommandList) {
	const weatherCommentCommands = commentCommandList.filter(Game_Event.filterCommentCommandsByWeatherConditional, this);
	if (weatherCommentCommands.length === 0) return [];
	return weatherCommentCommands.map(Game_Event.toWeatherConditional, this);
};
/**
* A filter function for only including comment event commands relevant to the weather.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsByWeatherConditional = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	return WeatherMapper.isWeatherComment(comment);
};
/**
* Converts a known comment event command into a conditional for weather control.
*
* **This cannot fail.** Recognising a weather comment and parsing one are the same table read
* twice - see {@link WeatherMapper.ConditionalKinds} - so anything that reached here has a kind
* waiting for it. J-TIME guards the equivalent step because its filter and its parser genuinely
* are two lists that can drift apart; one list cannot drift from itself.
* @param {RPG_EventListCommand} commentCommand The comment command to parse into a conditional.
* @returns {WeatherConditional}
*/
Game_Event.toWeatherConditional = function(commentCommand) {
	const [comment] = commentCommand.parameters;
	return WeatherMapper.toConditional(comment);
};
/**
* Evaluates a {@link WeatherConditional} to see if its requirements are currently met.
*
* The weather is read from the director rather than from the game variables it mirrors. The
* variables are a one-way mirror for event authors to branch on, and an author who edits one by
* hand should change what their own events see rather than what this plugin believes.
* @param {WeatherConditional} weatherConditional The conditional to evaluate satisfaction of.
* @returns {boolean}
*/
Game_Event.weatherConditionalMet = function(weatherConditional) {
	const { weatherConfig } = J.WEATHER.Metadata;
	const ids = WeatherVariables.idsFor(weatherConfig, WeatherDirector.current());
	return weatherConditional.isMet(ids.weatherType, ids.weatherIntensity);
};

//#endregion
//#region src/plugins/weather/ext/time/objects/Game_System.js
/**
* Extends {@link #initMembers}.<br/>
* Also sets up the sky's own memory.
*/
J.WEATHER.EXT.TIME.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.WEATHER.EXT.TIME.Aliased.Game_System.get("initMembers").call(this);
	this.initWeatherTimeMembers();
};
/**
* Initializes the forecast.
*
* **Everything here is plain data, so none of it needs a codec declaration.** `SerializableRegistry`
* fails open: an undeclared field of strings and numbers persists and restores on its own, and the
* throw is reserved for a field holding a class instance. Read `docs/save-system.md` before adding
* a field that is anything else.
*/
Game_System.prototype.initWeatherTimeMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the sky over time.
	*/
	this._j._weatherTime ||= {};
	/**
	* What the sky will be doing, phase by phase, for about a year ahead.
	*
	* Seeded empty at phase zero rather than rolled here, because rolling needs the clock and the
	* clock does not exist yet at the moment game objects are created. The first time the forecast is
	* asked for anything it winds itself forward to wherever the calendar actually is.
	* @type {{startPhase: number, types: string[], intensities: string[]}}
	*/
	this._j._weatherTime._forecast = SkyForecast.empty(0);
	/**
	* The phase whose sky was last handed to the director.
	*
	* This is the dedupe that makes a once-a-minute announcement into a once-a-phase decision, and it
	* lives in the save rather than on a static so that loading a game does not re-roll the walk at
	* whatever moment the file happened to be written.
	* @type {number}
	*/
	this._j._weatherTime._lastApplied = SkyForecast.OffClock;
};
/**
* Gets what the sky will be doing over the coming year.
* @returns {{startPhase: number, types: string[], intensities: string[]}} The forecast.
*/
Game_System.prototype.skyForecast = function() {
	return this._j._weatherTime._forecast;
};
/**
* Sets what the sky will be doing over the coming year.
* @param {{startPhase: number, types: string[], intensities: string[]}} newForecast The forecast.
*/
Game_System.prototype.setSkyForecast = function(newForecast) {
	this._j._weatherTime._forecast = newForecast;
};
/**
* Gets the phase whose sky was last applied.
* @returns {number} The absolute phase, or -1 when none has been.
*/
Game_System.prototype.lastAppliedSkyPhase = function() {
	return this._j._weatherTime._lastApplied;
};
/**
* Sets the phase whose sky was last applied.
* @param {number} newPhase The absolute phase.
*/
Game_System.prototype.setLastAppliedSkyPhase = function(newPhase) {
	this._j._weatherTime._lastApplied = newPhase;
};

//#endregion
//#region src/plugins/weather/ext/time/objects/Game_Time.js
/**
* Extends {@link #onTimeChanged}.<br/>
* Winds the forecast forward to whatever the clock now says.
*
* **This announcement fires every game minute**, not every hour - roughly every six real seconds -
* so nearly every one of these does nothing. The director dedupes on the phase, and only a genuine
* phase crossing gets any further.
*
* **It advances and does not push.** The very first announcement of a new game comes from inside
* `Game_Time`'s own constructor, during game-object creation, when there is no map to read; the
* screen is told separately, from the map scene, where there always is one. See
* {@link ForecastDirector} for the whole of that argument.
*
* The clock hands itself over rather than being looked up, for the same reason: `$gameTime` is
* still null until that constructor returns, so anything reaching for the global here would crash
* on a fresh game.
*/
J.WEATHER.EXT.TIME.Aliased.Game_Time.set("onTimeChanged", Game_Time.prototype.onTimeChanged);
Game_Time.prototype.onTimeChanged = function() {
	J.WEATHER.EXT.TIME.Aliased.Game_Time.get("onTimeChanged").call(this);
	ForecastDirector.advance(this);
};

//#endregion
//#region src/plugins/weather/ext/time/scenes/Scene_Map.js
/**
* Extends {@link #onMapLoaded}.<br/>
* Says what the sky is doing before the map is built around it.
*
* **This is the only place the sky reaches the screen on an arrival**, and it covers every kind of
* arrival there is - a transfer, a save load, a new game, and a menu closing. It runs before the
* original, which is J-Weather's own `onMapLoaded`, so the weather it resolves is already resolved
* against the right sky rather than against the one the player walked in with.
*
* `$dataMap` is the arriving map by the time this runs, which is what makes pushing safe here and
* nowhere earlier. `Game_System.onAfterLoad` is specifically *not* an option:
* `docs/save-system.md` is explicit that decoding happens before `Scene_Map.create` loads the map,
* so a push from there would read the map the player was standing on when they saved, or none.
*/
J.WEATHER.EXT.TIME.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function() {
	ForecastDirector.push($gameTime);
	J.WEATHER.EXT.TIME.Aliased.Scene_Map.get("onMapLoaded").call(this);
};
/**
* Extends {@link #update}.<br/>
* Lets a phase that turned over mid-play reach the screen.
*
* The clock announces a phase crossing from wherever it happens to be running, which is not
* somewhere a map read is safe. The announcement leaves a note; this is where the note is acted
* on, and it is acted on within a frame of being left.
*
* The condition itself lives in the director rather than here, because `scenes/**` is excluded
* from coverage and a fork written in a scene is a fork nothing measures.
*/
J.WEATHER.EXT.TIME.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.WEATHER.EXT.TIME.Aliased.Scene_Map.get("update").call(this);
	ForecastDirector.pushIfPending($gameTime);
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_Time.js
/**
* Extends {@link #drawContent}.<br/>
* Also draws what the weather is doing.
*
* **The weather line lives here rather than in J-TIME**, because J-TIME has never heard of weather
* and must keep working without it. A `\weather[]` written into J-TIME's own window would render
* as those nine literal characters for anybody running the clock on its own.
*
* `Window_Time` is a hoisted global by the time this runs; J-TIME is a declared dependency of this
* ship, so the class is there to be extended.
*/
Window_Time.RowCount += 1;
Window_Time.ContentWidth = Math.max(Window_Time.ContentWidth, 340);
J.WEATHER.EXT.TIME.Aliased.Window_Time.set("drawContent", Window_Time.prototype.drawContent);
Window_Time.prototype.drawContent = function() {
	J.WEATHER.EXT.TIME.Aliased.Window_Time.get("drawContent").call(this);
	this.drawWeather();
};
/**
* Draws what the weather is doing where the player is standing.
*
* The whole line is the text code, which is the point of having one: the icon, the name and the
* strength are spelled the same way here as in the forecast and in anybody's dialogue, and this
* window needs to know nothing about any of them.
*/
Window_Time.prototype.drawWeather = function() {
	const row = Window_Time.RowCount - 1;
	this.drawTextEx("\\weather[]", 0, this.contentLineY(row), this.contentWidth());
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_DebugForecast.js
/**
* Draws one day of the forecast.
*
* **Deliberately dumb.** Every decision about what a cell contains was already made in
* {@link ForecastTable}, which is measured; this walks the grid it was handed and puts text on
* the screen. If a question here needs answering with an `if`, it probably belongs up there.
*/
var Window_DebugForecast = class Window_DebugForecast extends Window_Base {
	/**
	* How tall one row of the grid is, in lines: the place's name and weather share the first, the
	* strength sits under it.
	* @type {number}
	*/
	static LinesPerRow = 2;
	/**
	* How much of the window's width the leftmost column - the place names - takes.
	* @type {number}
	*/
	static LabelShare = .18;
	/**
	* Extends {@link Window_Base.initialize}.<br/>
	* @param {Rectangle} rect The bounds of this window.
	*/
	initialize(rect) {
		super.initialize(rect);
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
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast ||= {};
		/**
		* The day being drawn, as {@link ForecastTable} built it.
		* @type {?object}
		*/
		this._j._forecast._table = null;
	}
	/**
	* Gets the day currently being drawn.
	* @returns {?object} The table.
	*/
	table() {
		return this._j._forecast._table;
	}
	/**
	* Sets the day to draw, and draws it.
	* @param {object} newTable The day to show.
	*/
	setTable(newTable) {
		this._j._forecast._table = newTable;
		this.refresh();
	}
	/**
	* How wide the place-name column is.
	* @returns {number}
	*/
	labelWidth() {
		return Math.floor(this.innerWidth * Window_DebugForecast.LabelShare);
	}
	/**
	* How wide one phase column is.
	* @returns {number}
	*/
	columnWidth() {
		return Math.floor((this.innerWidth - this.labelWidth()) / ForecastTable.Columns);
	}
	/**
	* Redraws the whole day.
	*/
	refresh() {
		this.contents.clear();
		const table = this.table();
		if (table === null) return;
		this.drawHeader(table);
		table.rows.forEach((row, index) => this.drawRow(row, index, table));
	}
	/**
	* Draws the date and the six phase names across the top.
	* @param {object} table The day being drawn.
	*/
	drawHeader(table) {
		const { startPhase } = table;
		const date = `Day ${SkyForecast.dayOfMonthOf(startPhase)}, Month ${SkyForecast.monthOf(startPhase)}`;
		const season = SkyForecast.seasonNameOf(startPhase);
		this.drawText(`${date} - ${season}`, 0, 0, this.innerWidth, "left");
		const y = this.lineHeight();
		for (let column = 0; column < ForecastTable.Columns; column++) {
			const x = this.labelWidth() + column * this.columnWidth();
			this.changeTextColor(this.columnColor(column, table));
			this.drawText(Time_Snapshot.TimesOfDayName(column), x, y, this.columnWidth(), "center");
		}
		this.resetTextColor();
	}
	/**
	* What colour a phase column's heading is drawn in.
	* @param {number} column The column being drawn.
	* @param {object} table The day being drawn.
	* @returns {string}
	*/
	columnColor(column, table) {
		if (column === table.nowColumn) return ColorManager.powerUpColor();
		return ColorManager.systemColor();
	}
	/**
	* Draws one place and its whole day.
	* @param {object} row The place being drawn.
	* @param {number} index Which row this is, from the top.
	* @param {object} table The day being drawn.
	*/
	drawRow(row, index, table) {
		const top = (2 + index * Window_DebugForecast.LinesPerRow) * this.lineHeight();
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(row.name, 0, top, this.labelWidth(), "left");
		this.resetTextColor();
		row.cells.forEach((cell, column) => this.drawCell(cell, column, top, table));
	}
	/**
	* Draws one phase of one place.
	* @param {?object} cell What would be drawn there, or null for nothing.
	* @param {number} column Which phase this is.
	* @param {number} top The y of the row being drawn.
	* @param {object} table The day being drawn.
	*/
	drawCell(cell, column, top, table) {
		const x = this.labelWidth() + column * this.columnWidth();
		const width = this.columnWidth();
		this.changeTextColor(this.cellColor(column, table));
		if (cell === null) {
			this.drawText("-", x, top, width, "center");
			this.resetTextColor();
			return;
		}
		this.drawText(cell.preset, x, top, width, "center");
		this.drawText(cell.intensity, x, top + this.lineHeight(), width, "center");
		this.resetTextColor();
	}
	/**
	* What colour a cell is drawn in.
	* @param {number} column The column being drawn.
	* @param {object} table The day being drawn.
	* @returns {string}
	*/
	cellColor(column, table) {
		if (column === table.nowColumn) return ColorManager.powerUpColor();
		return ColorManager.normalColor();
	}
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_ForecastCommand.js
/**
* The three things a player can ask the forecast.
*
* Right now, the rest of today, and the week - which is the whole of what anybody wants from a
* forecast, at the three distances they want it from.
*/
var Window_ForecastCommand = class Window_ForecastCommand extends Window_Command {
	/**
	* The symbol for the view describing what it is doing where the player stands.
	* @type {string}
	*/
	static NowSymbol = "forecast-now";
	/**
	* The symbol for the view describing the rest of today over Raevula.
	* @type {string}
	*/
	static TodaySymbol = "forecast-today";
	/**
	* The symbol for the view describing the week ahead over Raevula.
	* @type {string}
	*/
	static WeekSymbol = "forecast-week";
	/**
	* How many views this window offers.
	*
	* Declared so the scene can size the window to its contents without building it first. Three is
	* the whole of what a forecast is asked, and it is not a number that grows with content.
	* @type {number}
	*/
	static ViewCount = 3;
	/**
	* Overwrites {@link #makeCommandList}.<br/>
	* Builds the three views.
	*/
	makeCommandList() {
		const now = new WindowCommandBuilder("Here and Now").setSymbol(Window_ForecastCommand.NowSymbol).setHelpText("What the weather is doing where you are standing.").build();
		const today = new WindowCommandBuilder("Today").setSymbol(Window_ForecastCommand.TodaySymbol).setHelpText("How the sky over Raevula moves through the rest of the day.").build();
		const week = new WindowCommandBuilder("Next Seven Days").setSymbol(Window_ForecastCommand.WeekSymbol).setHelpText("The days ahead over Raevula, at a glance.").build();
		[
			now,
			today,
			week
		].forEach((command) => this.addBuiltCommand(command));
	}
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_ForecastNow.js
/**
* What the weather is doing where the player is standing, said out loud.
*
* **This one is not about Raevula.** The other two views describe the sky over the town, which is
* the only forecast anybody on Erocia could actually have. This describes the here and now - so
* standing in a cave it says the cave, and up on the Peaks it says the Peaks. Duplicative in town,
* which is the one place it does not matter.
*
* Said by somebody rather than reported, because "light rain, moderate" is a readout and this is
* the one place in the screen that can afford a voice.
*/
var Window_ForecastNow = class extends Window_Base {
	/**
	* Extends {@link Window_Base.initialize}.<br/>
	* @param {Rectangle} rect The bounds of this window.
	*/
	initialize(rect) {
		super.initialize(rect);
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
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast ||= {};
		/**
		* What is being described, or null when nothing is.
		* @type {?object}
		*/
		this._j._forecast._reading = null;
	}
	/**
	* Gets what is currently being described.
	* @returns {?object} The reading.
	*/
	reading() {
		return this._j._forecast._reading;
	}
	/**
	* Sets what to describe, and draws it.
	* @param {object} newReading What the weather is, and who is remarking on it.
	*/
	setReading(newReading) {
		this._j._forecast._reading = newReading;
		this.refresh();
	}
	/**
	* Redraws the reading.
	*/
	refresh() {
		this.contents.clear();
		const reading = this.reading();
		if (reading === null) return;
		this.drawWhen(reading);
		this.drawWeather(reading);
		this.drawRemark(reading);
	}
	/**
	* Draws when "now" is.
	*
	* `drawTextEx` rather than `drawText`, because the line carries the season and the time of day
	* as J-TIME's own text codes - so both arrive with the icon and colour they have everywhere
	* else in the game rather than being spelled out a second way here.
	* @param {object} reading What the weather is, when it is, and who is remarking on it.
	*/
	drawWhen(reading) {
		const { when } = reading;
		this.drawTextEx(when, 0, 0, this.innerWidth);
	}
	/**
	* Draws what the weather actually is, as icon and words.
	* @param {object} reading What the weather is, and who is remarking on it.
	*/
	drawWeather(reading) {
		const { weather } = reading;
		const config = J.WEATHER.Metadata.weatherConfig;
		const y = this.lineHeight();
		if (weather === null) {
			this.drawText(WeatherLabel.nothingFalling(config), 0, y, this.innerWidth, "left");
			return;
		}
		const iconIndex = WeatherIcons.indexFor(config, weather.preset);
		const label = WeatherLabel.words(config, weather.preset, weather.intensity);
		if (iconIndex === WeatherIcons.None) {
			this.drawText(label, 0, y, this.innerWidth, "left");
			return;
		}
		this.drawIcon(iconIndex, 0, y);
		this.drawText(label, ImageManager.iconWidth + this.itemPadding(), y, this.innerWidth, "left");
	}
	/**
	* Draws whatever somebody travelling with the player had to say about it.
	*
	* The speaker is an actor id rather than a name, so the face and the name both come from the
	* database - which means renaming somebody in the editor renames them here, and a line can
	* never be attributed to a face that does not match it.
	* @param {object} reading What the weather is, and who is remarking on it.
	*/
	drawRemark(reading) {
		const { remark } = reading;
		if (remark === null) return;
		const speaker = $gameActors.actor(remark.who);
		const top = this.lineHeight() * 3;
		this.drawFace(speaker.faceName(), speaker.faceIndex(), 0, top);
		const textX = ImageManager.faceWidth + this.itemPadding() * 2;
		const textWidth = this.innerWidth - textX;
		this.changeTextColor(ColorManager.systemColor());
		this.drawText(speaker.name(), textX, top, textWidth, "left");
		this.resetTextColor();
		this.drawRemarkText(remark.says, textX, top + this.lineHeight(), textWidth);
	}
	/**
	* Draws a remark, wrapped to the space beside the speaker's face.
	*
	* `drawTextEx` does not wrap, and a line long enough to say something interesting is long
	* enough to run off the edge - so the words are broken up here rather than the author being
	* asked to guess where the margin falls.
	* @param {string} says What was said.
	* @param {number} x Where the text starts.
	* @param {number} y The top of the text.
	* @param {number} width How much room it has.
	*/
	drawRemarkText(says, x, y, width) {
		const words = says.split(" ");
		let line = String.empty;
		let row = 0;
		words.forEach((word) => {
			const candidate = line === String.empty ? word : `${line} ${word}`;
			if (this.textWidth(candidate) <= width) {
				line = candidate;
				return;
			}
			this.drawText(line, x, y + row * this.lineHeight(), width, "left");
			row++;
			line = word;
		});
		this.drawText(line, x, y + row * this.lineHeight(), width, "left");
	}
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_ForecastToday.js
/**
* How the sky over Raevula moves through a whole day.
*
* All six phases rather than only the ones still to come, because a view that shortens as the day
* wears on is a different shape every time it is opened, and because what the morning did is
* useful for reading what the evening will.
*/
var Window_ForecastToday = class extends Window_Base {
	/**
	* Extends {@link Window_Base.initialize}.<br/>
	* @param {Rectangle} rect The bounds of this window.
	*/
	initialize(rect) {
		super.initialize(rect);
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
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast ||= {};
		/**
		* The day being drawn, or null when none is.
		* @type {?object}
		*/
		this._j._forecast._digest = null;
	}
	/**
	* Gets the day currently being drawn.
	* @returns {?object} The digest.
	*/
	digest() {
		return this._j._forecast._digest;
	}
	/**
	* Sets the day to draw, and draws it.
	* @param {object} newDigest The day to show.
	*/
	setDigest(newDigest) {
		this._j._forecast._digest = newDigest;
		this.refresh();
	}
	/**
	* How tall one phase's row is.
	* @returns {number}
	*/
	rowHeight() {
		return this.lineHeight();
	}
	/**
	* How wide the phase-name column is.
	* @returns {number}
	*/
	phaseWidth() {
		return Math.floor(this.innerWidth * .3);
	}
	/**
	* Redraws the day.
	*/
	refresh() {
		this.contents.clear();
		const digest = this.digest();
		if (digest === null) return;
		this.drawDate(digest);
		digest.entries.forEach((entry, index) => this.drawPhase(entry, index, digest));
	}
	/**
	* Draws which day this is.
	* @param {object} digest The day being drawn.
	*/
	drawDate(digest) {
		const { startPhase } = digest;
		this.drawTextEx(ForecastWhen.dateLineOf(startPhase), 0, 0, this.innerWidth);
	}
	/**
	* Draws one phase of the day.
	* @param {object} entry The phase being drawn.
	* @param {number} index Which phase this is, from the top.
	* @param {object} digest The day being drawn.
	*/
	drawPhase(entry, index, digest) {
		const y = this.lineHeight() + index * this.rowHeight();
		const isNow = index === digest.nowColumn;
		this.changeTextColor(isNow ? ColorManager.powerUpColor() : ColorManager.systemColor());
		this.drawText(Time_Snapshot.TimesOfDayName(entry.phaseOfDay), 0, y, this.phaseWidth(), "left");
		this.resetTextColor();
		this.drawSky(entry.sky, this.phaseWidth(), y, isNow);
	}
	/**
	* Draws what the sky is doing at one phase.
	* @param {?object} sky What the sky is, or null when the forecast does not reach.
	* @param {number} x Where to start drawing.
	* @param {number} y The top of the row.
	* @param {boolean} isNow Whether this is the phase happening now.
	*/
	drawSky(sky, x, y, isNow) {
		const width = this.innerWidth - x;
		if (sky === null) {
			this.drawText("-", x, y, width, "left");
			return;
		}
		const config = J.WEATHER.Metadata.weatherConfig;
		const iconIndex = WeatherIcons.indexFor(config, sky.preset);
		let textX = x;
		if (iconIndex !== WeatherIcons.None) {
			this.drawIcon(iconIndex, x, y);
			textX = x + ImageManager.iconWidth + this.itemPadding();
		}
		const words = WeatherLabel.words(config, sky.preset, sky.intensity);
		this.changeTextColor(isNow ? ColorManager.powerUpColor() : ColorManager.normalColor());
		this.drawText(words, textX, y, width, "left");
		this.resetTextColor();
	}
};

//#endregion
//#region src/plugins/weather/ext/time/windows/Window_ForecastWeek.js
/**
* The week ahead over Raevula, at the distance a week is actually read from.
*
* Three readings a day rather than six, and **no strength at all**. At this zoom the useful
* question is whether a day is wet or clear; a second mark per cell saying how wet turns a screen
* somebody glances at into one they have to study, and the day view is right there for anybody who
* wants the detail.
*/
var Window_ForecastWeek = class extends Window_Base {
	/**
	* Extends {@link Window_Base.initialize}.<br/>
	* @param {Rectangle} rect The bounds of this window.
	*/
	initialize(rect) {
		super.initialize(rect);
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
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast ||= {};
		/**
		* The week being drawn, or null when none is.
		* @type {?object}
		*/
		this._j._forecast._digest = null;
	}
	/**
	* Gets the week currently being drawn.
	* @returns {?object} The digest.
	*/
	digest() {
		return this._j._forecast._digest;
	}
	/**
	* Sets the week to draw, and draws it.
	* @param {object} newDigest The week to show.
	*/
	setDigest(newDigest) {
		this._j._forecast._digest = newDigest;
		this.refresh();
	}
	/**
	* How wide the date column is.
	* @returns {number}
	*/
	dateWidth() {
		return this.dayNameWidth() + this.dayNumberWidth();
	}
	/**
	* How wide the weekday column is.
	*
	* Measured from the longest weekday there is, so every date underneath starts at the same x
	* regardless of whether the day is a Monday or a Wednesday.
	* @returns {number}
	*/
	dayNameWidth() {
		return this.textWidth("Wednesday") + this.itemPadding() * 2;
	}
	/**
	* How wide the numeric date column is.
	* @returns {number}
	*/
	dayNumberWidth() {
		return this.textWidth("12/30") + this.itemPadding() * 2;
	}
	/**
	* How wide one sampled phase's column is.
	*
	* **Measured from what goes in it rather than from the window.** Splitting the full width three
	* ways puts a hundred-pixel icon-and-word in the middle of a four-hundred-pixel column, which
	* reads as three lonely things rather than as a table - and it pushes each heading so far from
	* the next column's contents that the eye stops connecting them.
	* @param {object} digest The week being drawn.
	* @returns {number}
	*/
	cellWidth(digest) {
		const widest = this.widestLookWidth();
		const natural = widest + ImageManager.iconWidth + this.itemPadding() * 3;
		const available = Math.floor((this.innerWidth - this.dateWidth()) / digest.phases.length);
		return Math.min(natural, available);
	}
	/**
	* How much room the longest weather name needs.
	*
	* Every name is measured rather than the longest being guessed at, because the names are
	* authored in the configuration and a new one longer than any of these would otherwise be the
	* one that overlaps its neighbour.
	* @returns {number}
	*/
	widestLookWidth() {
		const config = J.WEATHER.Metadata.weatherConfig;
		const names = Object.keys(config.presets).filter((name) => name.startsWith("_") === false);
		return names.reduce((widest, name) => Math.max(widest, this.textWidth(name)), 0);
	}
	/**
	* Redraws the week.
	*/
	refresh() {
		this.contents.clear();
		const digest = this.digest();
		if (digest === null) return;
		this.drawColumnHeadings(digest);
		digest.days.forEach((day, index) => this.drawDay(day, index, digest));
	}
	/**
	* Draws which phases the columns are sampling.
	* @param {object} digest The week being drawn.
	*/
	drawColumnHeadings(digest) {
		this.changeTextColor(ColorManager.systemColor());
		digest.phases.forEach((phaseOfDay, column) => {
			const x = this.dateWidth() + column * this.cellWidth(digest);
			this.drawText(Time_Snapshot.TimesOfDayName(phaseOfDay), x, 0, this.cellWidth(digest), "center");
		});
		this.resetTextColor();
	}
	/**
	* Draws one day of the week.
	* @param {object} day The day being drawn.
	* @param {number} index Which day this is, from the top.
	* @param {object} digest The week being drawn.
	*/
	drawDay(day, index, digest) {
		const y = this.lineHeight() * (index + 1);
		this.changeTextColor(index === 0 ? ColorManager.powerUpColor() : ColorManager.systemColor());
		this.drawText(this.dayName(day), 0, y, this.dayNameWidth(), "left");
		this.drawText(this.dayNumber(day), this.dayNameWidth(), y, this.dayNumberWidth(), "left");
		this.resetTextColor();
		day.cells.forEach((preset, column) => {
			const x = this.dateWidth() + column * this.cellWidth(digest);
			this.drawCell(preset, x, y, this.cellWidth(digest));
		});
	}
	/**
	* What a day is called in the leftmost column.
	* @param {object} day The day being labelled.
	* @returns {string}
	*/
	dayName(day) {
		if (day.dayOffset === 0) return "Today";
		return ForecastWhen.weekdayOf(day.startPhase);
	}
	/**
	* The date a row falls on, as figures.
	* @param {object} day The day being labelled.
	* @returns {string}
	*/
	dayNumber(day) {
		const month = SkyForecast.monthOf(day.startPhase);
		const date = SkyForecast.dayOfMonthOf(day.startPhase);
		return `${month}/${date}`;
	}
	/**
	* Draws one sampled phase of one day.
	* @param {?string} preset The look, or null when the forecast does not reach.
	* @param {number} x Where the cell starts.
	* @param {number} y The top of the row.
	* @param {number} width How wide the cell is.
	*/
	drawCell(preset, x, y, width) {
		if (preset === null) {
			this.drawText("-", x, y, width, "center");
			return;
		}
		const config = J.WEATHER.Metadata.weatherConfig;
		const iconIndex = WeatherIcons.indexFor(config, preset);
		if (iconIndex === WeatherIcons.None) {
			this.drawText(preset, x, y, width, "center");
			return;
		}
		const words = WeatherLabel.words(config, preset, String.empty);
		const textWidth = width - ImageManager.iconWidth - this.itemPadding();
		this.drawIcon(iconIndex, x, y);
		this.drawText(words, x + ImageManager.iconWidth + this.itemPadding(), y, textWidth, "left");
	}
};

//#endregion
//#region src/plugins/weather/ext/time/scenes/Scene_DebugForecast.js
/**
* The scene a player reads the forecast in.
*
* One day at a time, paged left and right, because six phases across four or five destinations is
* already a dense thing to read and stacking three days of it would be denser than it is useful.
*
* **Deliberately dumb**, like the window it owns: it holds which day is on screen, asks
* {@link ForecastTable} for that day, and hands the result over. Nothing about weather is decided
* here.
*/
var Scene_DebugForecast = class Scene_DebugForecast extends Scene_MenuBase {
	/**
	* Opens the forecast.
	*
	* A static so the two ways in - the menu command and the plugin command - reach it through one
	* door rather than each knowing how to push a scene.
	*/
	static callScene() {
		SceneManager.push(Scene_DebugForecast);
	}
	/**
	* Extends {@link Scene_MenuBase.initialize}.<br/>
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
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast ||= {};
		/**
		* How many days ahead of today is being shown.
		* @type {number}
		*/
		this._j._forecast._dayOffset = 0;
		/**
		* The window the day is drawn in.
		* @type {?Window_DebugForecast}
		*/
		this._j._forecast._window = null;
	}
	/**
	* Gets how many days ahead of today is being shown.
	* @returns {number} The dayOffset.
	*/
	dayOffset() {
		return this._j._forecast._dayOffset;
	}
	/**
	* Sets how many days ahead of today is being shown.
	* @param {number} newOffset The new dayOffset.
	*/
	setDayOffset(newOffset) {
		this._j._forecast._dayOffset = newOffset;
	}
	/**
	* Gets the window the day is drawn in.
	* @returns {?Window_DebugForecast} The forecastWindow.
	*/
	forecastWindow() {
		return this._j._forecast._window;
	}
	/**
	* Sets the window the day is drawn in.
	* @param {Window_DebugForecast} newWindow The new forecastWindow.
	*/
	setForecastWindow(newWindow) {
		this._j._forecast._window = newWindow;
	}
	/**
	* Extends {@link Scene_MenuBase.create}.<br/>
	* Also builds the forecast window and fills it with today.
	*/
	create() {
		super.create();
		this.createForecastWindow();
		this.showDay(0);
	}
	/**
	* Builds the window the forecast is drawn in.
	*/
	createForecastWindow() {
		const window = new Window_DebugForecast(this.forecastRectangle());
		this.setForecastWindow(window);
		this.addWindow(window);
	}
	/**
	* The bounds the forecast is drawn within.
	* @returns {Rectangle}
	*/
	forecastRectangle() {
		const x = 0;
		const y = this.mainAreaTop();
		const width = Graphics.boxWidth;
		const height = this.mainAreaHeight();
		return new Rectangle(x, y, width, height);
	}
	/**
	* Shows a given day, clamped to the days the forecast is willing to show.
	* @param {number} dayOffset How many days ahead of today to show.
	*/
	showDay(dayOffset) {
		const clamped = ForecastDirector.clampDayOffset(dayOffset);
		this.setDayOffset(clamped);
		this.forecastWindow().setTable(ForecastDirector.tableFor($gameTime, clamped));
	}
	/**
	* Extends {@link Scene_MenuBase.update}.<br/>
	* Also pages between days, and leaves.
	*/
	update() {
		super.update();
		this.updatePaging();
	}
	/**
	* Moves between days on the left and right inputs.
	*/
	updatePaging() {
		if (Input.isRepeated("right") === true) {
			this.showDay(this.dayOffset() + 1);
			return;
		}
		if (Input.isRepeated("left") === true) {
			this.showDay(this.dayOffset() - 1);
			return;
		}
		if (Input.isTriggered("cancel") === true) {
			this.popScene();
		}
	}
};

//#endregion
//#region src/plugins/weather/ext/time/scenes/Scene_Forecast.js
/**
* The forecast, as a player reads it.
*
* Three views at three distances: what it is doing here and now, how the sky over Raevula moves
* through the rest of today, and the shape of the week. Built on the facet skeleton so it sits in
* the same chrome as every other scene in the game rather than inventing a layout.
*
* **Raevula, not Erocia's regions.** There is one weather system over the island and one town left
* standing on it, so there is one forecast; a player has no way to check the sky somewhere they
* are not. The developer screen behind `showDebugForecast` breaks it down by destination, and is
* deliberately not this.
*
* Deliberately dumb, like its windows. It owns which view is showing and asks
* {@link ForecastDirector} for the contents.
*/
var Scene_Forecast = class Scene_Forecast extends Scene_MenuFacetBase {
	/**
	* Opens the forecast.
	*/
	static callScene() {
		SceneManager.push(Scene_Forecast);
	}
	/**
	* Extends {@link Scene_MenuFacetBase.initMembers}.<br/>
	* Also initializes this scene's own windows.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the forecast.
		*/
		this._j._forecast = {};
		/**
		* The list of views.
		* @type {?Window_ForecastCommand}
		*/
		this._j._forecast._commands = null;
		/**
		* The view describing here and now.
		* @type {?Window_ForecastNow}
		*/
		this._j._forecast._now = null;
		/**
		* The view describing the rest of today.
		* @type {?Window_ForecastToday}
		*/
		this._j._forecast._today = null;
		/**
		* The view describing the week ahead.
		* @type {?Window_ForecastWeek}
		*/
		this._j._forecast._week = null;
		/**
		* Which view is currently filled, so it is only refilled when it actually changes.
		*
		* Without this the update loop refills sixty times a second, which re-rolls the remark on
		* every frame and leaves the here-and-now view flickering through every line anybody wrote.
		* @type {string}
		*/
		this._j._forecast._showing = String.empty;
	}
	/**
	* Gets which view is currently filled.
	* @returns {string} The showing symbol.
	*/
	showing() {
		return this._j._forecast._showing;
	}
	/**
	* Sets which view is currently filled.
	* @param {string} newSymbol The new showing symbol.
	*/
	setShowing(newSymbol) {
		this._j._forecast._showing = newSymbol;
	}
	/**
	* Gets the list of views.
	* @returns {?Window_ForecastCommand} The commandWindow.
	*/
	commandWindow() {
		return this._j._forecast._commands;
	}
	/**
	* Sets the list of views.
	* @param {Window_ForecastCommand} newWindow The new commandWindow.
	*/
	setCommandWindow(newWindow) {
		this._j._forecast._commands = newWindow;
	}
	/**
	* Gets the view describing here and now.
	* @returns {?Window_ForecastNow} The nowWindow.
	*/
	nowWindow() {
		return this._j._forecast._now;
	}
	/**
	* Sets the view describing here and now.
	* @param {Window_ForecastNow} newWindow The new nowWindow.
	*/
	setNowWindow(newWindow) {
		this._j._forecast._now = newWindow;
	}
	/**
	* Gets the view describing the rest of today.
	* @returns {?Window_ForecastToday} The todayWindow.
	*/
	todayWindow() {
		return this._j._forecast._today;
	}
	/**
	* Sets the view describing the rest of today.
	* @param {Window_ForecastToday} newWindow The new todayWindow.
	*/
	setTodayWindow(newWindow) {
		this._j._forecast._today = newWindow;
	}
	/**
	* Gets the view describing the week ahead.
	* @returns {?Window_ForecastWeek} The weekWindow.
	*/
	weekWindow() {
		return this._j._forecast._week;
	}
	/**
	* Sets the view describing the week ahead.
	* @param {Window_ForecastWeek} newWindow The new weekWindow.
	*/
	setWeekWindow(newWindow) {
		this._j._forecast._week = newWindow;
	}
	/**
	* Extends {@link Scene_MenuFacetBase.create}.<br/>
	* Also builds the list and the three views.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createForecastCommandWindow();
		this.createForecastViews();
		this.showView(Window_ForecastCommand.NowSymbol);
	}
	/**
	* Builds the list of views.
	*/
	createForecastCommandWindow() {
		const window = new Window_ForecastCommand(this.forecastCommandRect());
		window.setHandler(Window_ForecastCommand.NowSymbol, this.commandView.bind(this));
		window.setHandler(Window_ForecastCommand.TodaySymbol, this.commandView.bind(this));
		window.setHandler(Window_ForecastCommand.WeekSymbol, this.commandView.bind(this));
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHelpWindow(this.helpWindow());
		window.activate();
		this.setCommandWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds all three views, with only the first showing.
	*/
	createForecastViews() {
		const rect = this.forecastDetailRect();
		this.setNowWindow(new Window_ForecastNow(rect));
		this.setTodayWindow(new Window_ForecastToday(rect));
		this.setWeekWindow(new Window_ForecastWeek(rect));
		this.forecastViews().forEach((window) => this.addWindow(window));
	}
	/**
	* Every view, in the order the list offers them.
	* @returns {Window_Base[]}
	*/
	forecastViews() {
		return [
			this.nowWindow(),
			this.todayWindow(),
			this.weekWindow()
		];
	}
	/**
	* The bounds of the list of views.
	* @returns {Rectangle}
	*/
	forecastCommandRect() {
		const area = this.facetAreaRect();
		const height = this.calcWindowHeight(Window_ForecastCommand.ViewCount, true);
		return new Rectangle(area.x, area.y, this.commandColumnWidth(), height);
	}
	/**
	* The bounds the showing view fills.
	* @returns {Rectangle}
	*/
	forecastDetailRect() {
		const area = this.facetAreaRect();
		const x = area.x + this.commandColumnWidth();
		return new Rectangle(x, area.y, area.width - this.commandColumnWidth(), area.height);
	}
	/**
	* Moves between views as the cursor moves, rather than on confirm.
	*
	* A three-item list where every item is a page of information is a list nobody wants to press a
	* button to read - the cursor moving *is* the choice.
	*/
	commandView() {
		this.commandWindow().activate();
	}
	/**
	* Extends {@link Scene_MenuFacetBase.update}.<br/>
	* Also keeps the showing view in step with the cursor.
	*/
	update() {
		super.update();
		this.updateShowingView();
	}
	/**
	* Shows whichever view the cursor is currently on.
	*/
	updateShowingView() {
		const symbol = this.commandWindow().currentSymbol();
		if (symbol === null) return;
		if (symbol === this.showing()) return;
		this.showView(symbol);
	}
	/**
	* Shows one view and hides the others.
	* @param {string} symbol Which view to show.
	*/
	showView(symbol) {
		this.setShowing(symbol);
		const showing = this.viewFor(symbol);
		this.forecastViews().forEach((window) => {
			window.visible = window === showing;
		});
		this.fillView(symbol);
	}
	/**
	* Which window a given view symbol belongs to.
	* @param {string} symbol The view being asked for.
	* @returns {Window_Base}
	*/
	viewFor(symbol) {
		if (symbol === Window_ForecastCommand.TodaySymbol) return this.todayWindow();
		if (symbol === Window_ForecastCommand.WeekSymbol) return this.weekWindow();
		return this.nowWindow();
	}
	/**
	* Fills the showing view with what it describes.
	*
	* Refilled whenever it is shown rather than once at creation, because the clock keeps running
	* while the scene is open and a phase can turn over under the player's cursor.
	* @param {string} symbol Which view is showing.
	*/
	fillView(symbol) {
		if (symbol === Window_ForecastCommand.TodaySymbol) {
			this.todayWindow().setDigest(ForecastDirector.todayFor($gameTime));
			return;
		}
		if (symbol === Window_ForecastCommand.WeekSymbol) {
			this.weekWindow().setDigest(ForecastDirector.weekFor($gameTime));
			return;
		}
		this.nowWindow().setReading(ForecastDirector.readingHere($gameTime));
	}
	/**
	* Overwrites {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* @returns {{semantic: string, label: string}[]}
	*/
	controlLegendEntries() {
		return [{
			semantic: ["up", "down"],
			label: "Change view"
		}, {
			semantic: "cancel",
			label: "Back"
		}];
	}
};

//#endregion
//#region src/plugins/weather/ext/time/_metadata/pluginCommands.js
/**
* Opens the diagnostic forecast.
*
* **Not the player's forecast.** This lists named destinations with their exact preset and
* strength per phase, which is how you check that what is on screen is what the sky rolled - and
* is also a list of places the player has not necessarily found yet. The screen a player sees is
* a separate thing entirely.
*/
PluginManager.registerCommand(J.WEATHER.EXT.TIME.Metadata.name, "showDebugForecast", () => {
	Scene_DebugForecast.callScene();
});
/**
* Re-reads every destination's map note.
*
* The forecast holds what it read for the life of the session, because a map's note cannot change
* while the game is running - except during development, when it does constantly. This exists so
* retagging a map and looking again does not mean restarting.
*/
PluginManager.registerCommand(J.WEATHER.EXT.TIME.Metadata.name, "refreshForecastPlaces", () => {
	ForecastPlaces.forget();
});

//#endregion
//# sourceMappingURL=J-Weather-Time.js.map