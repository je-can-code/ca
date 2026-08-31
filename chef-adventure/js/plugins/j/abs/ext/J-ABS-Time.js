//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 ABS-TIME] Calendar-based respawn methods for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base J-TIME
 * @orderAfter J-ABS
 * @orderAfter J-TIME
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin teaches the JABS respawn system to speak in appointments rather
 * than durations. Core's <respawn:[seconds, N]> counts playtime; the methods
 * registered here consult the J-TIME calendar instead, so a battler can come
 * back "next morning" or "at the start of winter" rather than "in N seconds".
 *
 * This plugin requires JABS.
 * This plugin requires J-TIME.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * All of these methods ride the same <respawn:[METHOD, PARAM]> tag that core
 * owns, on enemies in the database or as comment overrides on individual
 * placements. Every schedule resolves to the start of the NEXT occurrence of
 * the named moment, strictly after the moment of death- dying during the
 * morning schedules tomorrow's morning, not the one already underway.
 *
 * NEW METHODS
 * - game-minutes: a duration measured on the game clock rather than on
 *                 playtime, which is what core's [seconds, N] measures.
 *     <respawn:[game-minutes, 30]>
 *     Thirty in-game minutes, so it runs at whatever rate the clock is
 *     configured for and freezes whenever the clock is blocked.
 *
 * - time-of-day:  the next time a time of day begins.
 *     <respawn:[time-of-day, morning]>
 *     Valid values: night, dawn, morning, afternoon, evening, twilight.
 *
 * - next-day:     tomorrow, at a clock time written as HMM/HHMM.
 *     <respawn:[next-day, 830]>
 *     830 means 8:30am; 1430 means 2:30pm.
 *
 * - day-of-week:  midnight on the next occurrence of a weekday.
 *     <respawn:[day-of-week, monday]>
 *     The artificial calendar cycles a seven-day week anchored so that
 *     day 1 of month 1 of year 0 is a Monday.
 *
 * - month:        the first midnight of the next occurrence of a month.
 *     <respawn:[month, 3]>
 *
 * - season:       the first midnight of the next occurrence of a season.
 *     <respawn:[season, winter]>
 *     Seasons begin in months 3, 6, 9, and 12 respectively.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */

//#region src/plugins/abs/ext/time/_metadata/_pluginMetadata.js
var J_AbsTimePluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/abs/ext/time/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.18.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
	const requiredTimeVersion = "1.2.0";
	const hasTimeRequirement = J.BASE.Helpers.satisfies(J.TIME.Metadata.version.version(), requiredTimeVersion);
	if (!hasTimeRequirement) {
		throw new Error(`Either missing J-TIME or has a lower version than the required: ${requiredTimeVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this extension plugin.
*/
J.ABS.EXT.TIME = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TIME.Metadata = new J_AbsTimePluginMetadata("J-ABS-Time", "1.0.0");

//#endregion
//#region src/plugins/abs/ext/time/managers/JABS_TimeRespawnMethods.js
/**
* This static class holds the calendar arithmetic behind the respawn methods this ship registers.
*
* Every method reduces to the same shape: at death, find the start of the next occurrence of some
* calendar moment- strictly after now- and encode it as a comparable scalar. During sweeps, the
* current time is encoded the same way and the two are compared. All of it reads the clock through
* `$gameTime`, so both the artificial calendar and real-time mode resolve correctly.
*/
var JABS_TimeRespawnMethods = class {
	/**
	* The first month of each season, keyed by season id.
	* Derived from {@link Game_Time.seasonOfYear}'s month groupings- winter's months are 12, 1, 2,
	* so in cyclic order the season begins in month 12.
	* @type {Map<number, number>}
	*/
	static SEASON_START_MONTHS = new Map([
		[0, 3],
		[1, 6],
		[2, 9],
		[3, 12]
	]);
	/**
	* Encodes a snapshot into a single comparable scalar.
	*
	* The day radix is 31 rather than the artificial calendar's 30 on purpose: real-time mode
	* produces day 31, and a radix too small would fold the end of one month into the start of the
	* next. 31 keeps the encoding strictly monotonic for both calendars, which is all a due
	* comparison needs- this is an ordering, not an elapsed-time measure.
	* @param {Time_Snapshot} snapshot The snapshot to encode.
	* @returns {number} The comparable scalar for this moment.
	*/
	static epochOf(snapshot) {
		const totalDays = (snapshot.years * 12 + (snapshot.months - 1)) * 31 + (snapshot.days - 1);
		return snapshot.seconds + 60 * (snapshot.minutes + 60 * (snapshot.hours + 24 * totalDays));
	}
	/**
	* Encodes the current moment into the same comparable scalar space as {@link epochOf}.
	* @returns {number} The comparable scalar for right now.
	*/
	static currentEpoch() {
		const now = $gameTime.currentTime();
		return this.epochOf(now);
	}
	/**
	* Builds a snapshot of the given date at the given time of the clock.
	* @param {Time_Snapshot} snapshot The snapshot providing the date.
	* @param {number} hours The hour of the clock.
	* @param {number} minutes The minute of the clock.
	* @returns {Time_Snapshot} The same date, at the requested clock time.
	*/
	static atClockTime(snapshot, hours, minutes) {
		return $gameTime.toTimeSnapshot([
			0,
			minutes,
			hours,
			snapshot.days,
			snapshot.months,
			snapshot.years
		]);
	}
	/**
	* Builds a snapshot the given number of whole days after the given snapshot, at the same clock.
	*
	* This is the one place the two calendars genuinely differ: the artificial calendar rolls over
	* every 30 days without exception, while real-time months are irregular and are delegated to
	* the real calendar via `Date`.
	* @param {Time_Snapshot} snapshot The snapshot to advance.
	* @param {number} count The number of days to advance by.
	* @returns {Time_Snapshot} The advanced snapshot.
	*/
	static addDays(snapshot, count) {
		if (J.TIME.Metadata.UseRealTime) {
			const date = new Date(snapshot.years, snapshot.months - 1, snapshot.days + count, snapshot.hours, snapshot.minutes, snapshot.seconds);
			return $gameTime.toTimeSnapshot([
				date.getSeconds(),
				date.getMinutes(),
				date.getHours(),
				date.getDate(),
				date.getMonth() + 1,
				date.getFullYear()
			]);
		}
		let { days, months, years } = snapshot;
		days += count;
		while (days > Game_Time.daysPerMonth) {
			days -= Game_Time.daysPerMonth;
			months += 1;
			if (months > Game_Time.monthsPerYear) {
				months -= Game_Time.monthsPerYear;
				years += 1;
			}
		}
		return $gameTime.toTimeSnapshot([
			snapshot.seconds,
			snapshot.minutes,
			snapshot.hours,
			days,
			months,
			years
		]);
	}
	/**
	* Schedules a duration measured on the game clock: come back N in-game minutes from now.
	*
	* This is the duration sibling of core's playtime "seconds"- same statement, different clock.
	* The duration cannot simply be added to the epoch scalar, because that scalar is an ordering
	* with phantom day-31 gaps at artificial month boundaries; instead the minutes fold through
	* real calendar arithmetic into a target moment, which then encodes exactly.
	* @param {string} param The number of in-game minutes to wait.
	* @returns {number|null} The due scalar, or null for a non-positive or non-numeric duration.
	*/
	static scheduleGameMinutes(param) {
		const minutes = parseInt(param);
		if (!Number.isFinite(minutes) || minutes <= 0) return null;
		const now = $gameTime.currentTime();
		const totalMinutes = now.minutes + minutes;
		const targetMinute = totalMinutes % 60;
		const totalHours = now.hours + Math.floor(totalMinutes / 60);
		const targetHour = totalHours % 24;
		const dayCount = Math.floor(totalHours / 24);
		const todayAtClock = $gameTime.toTimeSnapshot([
			now.seconds,
			targetMinute,
			targetHour,
			now.days,
			now.months,
			now.years
		]);
		const target = this.addDays(todayAtClock, dayCount);
		return this.epochOf(target);
	}
	/**
	* Schedules the start of the next occurrence of a time of day, strictly after now.
	* Dying during the morning schedules tomorrow's morning, not the one already underway.
	* @param {string} param The name of the time of day, like "morning".
	* @returns {number|null} The due scalar, or null for an unrecognized time of day.
	*/
	static scheduleTimeOfDay(param) {
		const timeOfDayId = Time_Snapshot.TimesOfDayId(param);
		if (timeOfDayId === -1) return null;
		const startHour = $gameTime.startOfTimeOfDay(timeOfDayId);
		const now = $gameTime.currentTime();
		const todaysOccurrence = this.atClockTime(now, startHour, 0);
		if (this.epochOf(todaysOccurrence) > this.epochOf(now)) return this.epochOf(todaysOccurrence);
		const tomorrowsOccurrence = this.addDays(todaysOccurrence, 1);
		return this.epochOf(tomorrowsOccurrence);
	}
	/**
	* Schedules tomorrow at a given clock time, expressed as an HMM/HHMM number like 830 or 1430.
	* @param {string} param The clock time as an HHMM number.
	* @returns {number|null} The due scalar, or null for an invalid clock time.
	*/
	static scheduleNextDay(param) {
		const clockValue = parseInt(param);
		if (!Number.isFinite(clockValue) || clockValue < 0) return null;
		const hours = Math.floor(clockValue / 100);
		const minutes = clockValue % 100;
		if (hours > 23 || minutes > 59) return null;
		const now = $gameTime.currentTime();
		const todayAtClock = this.atClockTime(now, hours, minutes);
		const tomorrowAtClock = this.addDays(todayAtClock, 1);
		return this.epochOf(tomorrowAtClock);
	}
	/**
	* Schedules midnight of the next occurrence of a day of the week, strictly after today.
	* Dying on a monday schedules the following monday.
	* @param {string} param The name of the day of the week, like "monday".
	* @returns {number|null} The due scalar, or null for an unrecognized day of the week.
	*/
	static scheduleDayOfWeek(param) {
		const dayOfWeekId = Time_Snapshot.DaysOfWeekId(param);
		if (dayOfWeekId === -1) return null;
		const now = $gameTime.currentTime();
		const todayAtMidnight = this.atClockTime(now, 0, 0);
		let candidate = this.addDays(todayAtMidnight, 1);
		while (candidate.dayOfWeekId() !== dayOfWeekId) {
			candidate = this.addDays(candidate, 1);
		}
		return this.epochOf(candidate);
	}
	/**
	* Schedules the start of the next occurrence of a given month, strictly after now.
	* @param {number} month The month number, 1-12.
	* @returns {number|null} The due scalar, or null for an invalid month.
	*/
	static scheduleMonthStart(month) {
		if (!Number.isFinite(month) || month < 1 || month > Game_Time.monthsPerYear) return null;
		const now = $gameTime.currentTime();
		const thisYearsOccurrence = $gameTime.toTimeSnapshot([
			0,
			0,
			0,
			1,
			month,
			now.years
		]);
		if (this.epochOf(thisYearsOccurrence) > this.epochOf(now)) return this.epochOf(thisYearsOccurrence);
		const nextYearsOccurrence = $gameTime.toTimeSnapshot([
			0,
			0,
			0,
			1,
			month,
			now.years + 1
		]);
		return this.epochOf(nextYearsOccurrence);
	}
	/**
	* Schedules the start of the next occurrence of a season, strictly after now.
	* Dying mid-winter schedules the coming month-12 winter, the next time the season begins.
	* @param {string} param The name of the season, like "winter".
	* @returns {number|null} The due scalar, or null for an unrecognized season.
	*/
	static scheduleSeason(param) {
		const seasonId = Time_Snapshot.SeasonsId(param);
		if (seasonId === -1) return null;
		const startMonth = this.SEASON_START_MONTHS.get(seasonId);
		return this.scheduleMonthStart(startMonth);
	}
	/**
	* Determines whether a scheduled calendar moment has passed.
	* @param {number} due The due scalar produced by one of the schedulers above.
	* @returns {boolean}
	*/
	static isDue(due) {
		return this.currentEpoch() >= due;
	}
};
/**
* Register every calendar method with core's respawn registry. Each shares the single epoch-based
* due check, because every scheduler above encodes into the same scalar space.
*/
JABS_RespawnManager.registerMethod("game-minutes", {
	/**
	* Schedules a duration measured in in-game minutes.
	* @param {string} param The number of in-game minutes, like 30.
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleGameMinutes(param),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});
JABS_RespawnManager.registerMethod("time-of-day", {
	/**
	* Schedules the start of the next occurrence of a time of day.
	* @param {string} param The name of the time of day, like "morning".
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleTimeOfDay(param),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});
JABS_RespawnManager.registerMethod("next-day", {
	/**
	* Schedules tomorrow at a given HHMM clock time.
	* @param {string} param The clock time as an HHMM number, like 830.
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleNextDay(param),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});
JABS_RespawnManager.registerMethod("day-of-week", {
	/**
	* Schedules midnight of the next occurrence of a day of the week.
	* @param {string} param The name of the day of the week, like "monday".
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleDayOfWeek(param),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});
JABS_RespawnManager.registerMethod("month", {
	/**
	* Schedules the start of the next occurrence of a month.
	* @param {string} param The month number, 1-12.
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleMonthStart(parseInt(param)),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});
JABS_RespawnManager.registerMethod("season", {
	/**
	* Schedules the start of the next occurrence of a season.
	* @param {string} param The name of the season, like "winter".
	* @returns {number|null}
	*/
	schedule: (param) => JABS_TimeRespawnMethods.scheduleSeason(param),
	/**
	* Determines whether the scheduled calendar moment has passed.
	* @param {number} due The due scalar for the scheduled moment.
	* @returns {boolean}
	*/
	isDue: (due) => JABS_TimeRespawnMethods.isDue(due)
});

//#endregion
//# sourceMappingURL=J-ABS-Time.js.map