//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.1.0 TIME] A system for tracking time- real or artificial.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * =============================================================================
 * This is a system that tracks time, either artificial or real, and
 * manipulates various components of the game based on the time.
 *
 *   Temporally Integrated Monitoring of Ecosystems- aka TIME.
 *
 * =============================================================================
 * This plugin enables a TIME system. The TIME system functions much like you'd
 * expect: it tracks TIME. This TIME however, is configurable in many ways that
 * regular time is not.
 *
 * There are two forms of time-keeping, real and artificial.
 *
 * REAL TIME
 * Real time acts much like you'd expect: it reads the client's computer's
 * time and updates every half of a second to keep in sync with real time. All
 * of the features surrounding this TIME system (relating to time of day or
 * seasons) operate the same as artificial, but based on real time.
 *
 * ARTIFICIAL TIME
 * Artificial time acts similar to real time, but instead of reading the time
 * from your computer, it starts at a designated point that you specify and
 * ticks ever forward. The rate at which time ticks forward defaults to 60
 * frames per second, but you can reduce that if you want time to pass faster.
 * Alternatively (or in addition to), you can also adjust the amount of time
 * that passes per "tock". A "tock" is defined as "on-increment", so for
 * example, when the second counter increments past 59 to 60, you would expect
 * the minutes to go up by 1. That incrementing is a "tock", that is defined
 * by you. You can define how much that increment is for each unit of time:
 * seconds, minutes, hours, days, months, and years. I would encourage this be
 * explored before tweaking the defaults.
 *
 * VARIABLES
 * Unless disabled, both real and artificial TIME will track the various
 * components of the current TIME in variables, to allow for developing events
 * revolving around TIME. You can specify in the plugin parameters which
 * variables you want these to be assigned to. If you do not want one or more
 * of the TIME components tracked in variable, but do want to leverage the
 * functionality of variable assignment, then just assign the TIME components
 * that you do not care about to variable id of 0.
 *
 * TIME OF DAY
 * Additionally, this system tracks "time of day". "Time of Day" is defined
 * as a block of time (measured in hours) that is named.
 * There are six of these blocks of time that make up a day:
 * - Night (00:00am - 03:59am)
 * - Dawn (04:00am - 7:59am)
 * - Morning (08:00am - 11:59am)
 * - Afternoon (12:00pm - 15:59pm)
 * - Evening (16:00pm - 19:59pm)
 * - Twilight (20:00pm - 23:59pm)
 *
 * Alongside the "time of day" functionality, there is also an optional "tone"
 * adjustment to alter the screen tone based on "time of day". The tone will
 * change on the hour. This can be disabled entirely, or selectively with tags.
 * Keep in mind that, understandably, this does not play nicely with manual
 * tone-changes from outside this system. If you intend to control the tone
 * yourself, you should probably disable the tone-change functionality for
 * those maps.
 *
 * SEASON OF YEAR
 * Additionally, this system tracks the "season of the year". The "season of
 * the year" is defined likely much how you think it is: a block of time
 * (measured in months) that is named.
 * - Spring (march, april, may)
 * - Summer (june, july, august)
 * - Autumn (september, october, november)
 * - Winter (december, january, february)
 * Nothing special happens as months progress, you as the developer can decide
 * what to do when it is the summer months or the winter months if you want.
 *
 * TAGS
 * If you want the auto-tone changing, but want it disabled for certain maps,
 * then you can use this note tag which will cause the system to not change the
 * tone when transfering to that particular map:
 * <noToneChange>
 *
 * If you are using artificial TIME, and you need TIME to be stopped for some
 * reason or another, you can use this tag on a map and while on that map, TIME
 * will be considered "blocked", where TIME will not flow:
 * <timeBlock>
 *
 * =============================================================================
 * TIME-GATED EVENT PAGES AND CHOICES
 * Ever wanted an event page (or a "Show Choices" branch) to only be active
 * during a specific minute, hour, day, month, year, time of day, season, or
 * combination thereof? Well now you can! There are two parallel tag families-
 * "Page" tags gate an entire event page condition; "Choice" tags gate a
 * single choice in a "Show Choices" branch. Both families share identical
 * unit names and behavior, just swap "Page" for "Choice" in the tag name.
 *
 * NOTE ABOUT EXACT VS RANGE:
 * The plain unit tags (<minutePage>, <hourPage>, etc.) match only that exact
 * value. The "Range" variants (<minuteRangePage>, <hourRangePage>, etc.)
 * match an inclusive START-END span instead.
 *
 * TAG USAGE:
 * - Event pages (comment, gates the whole page like a normal page condition)
 * - "Show Choices" branches (comment, gates a single choice)
 *
 * EXACT-VALUE TAG FORMAT:
 *  <minutePage:MINUTE>            <minuteChoice:MINUTE>
 *  <hourPage:HOUR>                <hourChoice:HOUR>
 *  <dayPage:DAY>                  <dayChoice:DAY>
 *  <monthPage:MONTH>              <monthChoice:MONTH>
 *  <yearPage:YEAR>                <yearChoice:YEAR>
 *  <timeOfDayPage:TIME_OF_DAY>    <timeOfDayChoice:TIME_OF_DAY>
 *  <seasonOfYearPage:SEASON>      <seasonOfYearChoice:SEASON>
 * Where TIME_OF_DAY is a 0-5 index or one of: night, dawn, morning,
 *   afternoon, evening, twilight.
 * Where SEASON is a 0-3 index or one of: spring, summer, autumn, winter.
 *
 * RANGE TAG FORMAT (inclusive START-END):
 *  <minuteRangePage:START-END>    <minuteRangeChoice:START-END>
 *  <hourRangePage:START-END>      <hourRangeChoice:START-END>
 *  <dayRangePage:START-END>       <dayRangeChoice:START-END>
 *  <monthRangePage:START-END>     <monthRangeChoice:START-END>
 *  <yearRangePage:START-END>      <yearRangeChoice:START-END>
 *
 * COMPOSITE SHORTCUT TAG FORMAT:
 *  <timeRangePage:HH:MM-HH:MM>     <timeRangeChoice:HH:MM-HH:MM>
 *    Shortcut for gating on an hour:minute clock-time span within a single
 *    day (e.g. "9:00 to 17:30").
 *
 *  <fullDateRangePage:[MINUTE,HOUR,DAY,MONTH,YEAR]-[MINUTE,HOUR,DAY,MONTH,YEAR]>
 *  <fullDateRangeChoice:[MINUTE,HOUR,DAY,MONTH,YEAR]-[MINUTE,HOUR,DAY,MONTH,YEAR]>
 *    The most precise gate: an inclusive span across a full calendar
 *    date+time. Seconds are always treated as 0 at the start of the range and
 *    59 at the end (seconds are not independently configurable here).
 *
 * TAG EXAMPLES:
 *  <timeOfDayPage:morning>
 * This event page is only active while TIME considers it currently morning.
 *
 *  <hourRangePage:9-17>
 * This event page is only active between hour 9 and hour 17, inclusive.
 *
 *  <timeRangeChoice:9:00-17:30>
 * This choice is only shown between 9:00am and 5:30pm.
 *
 *  <fullDateRangePage:[0,9,29,5,2021]-[0,17,29,5,2021]>
 * This event page is only active from 9:00am to 5:00pm on day 29, month 5,
 * year 2021- and nowhere else on the calendar.
 * =============================================================================
 * COMMANDS
 * There are a number of plugin commands available to manipulate TIME:
 * - Jump to time of day
 *   Jumping to a specific time of day may result in skipping a day. This will
 *   fast-forward to a particular time of day. If that time of day has already
 *   passed (or it is currently that time of day), the system will proceed to
 *   the next day's time of day. (common use case is sleeping at an inn till
 *   morning)
 *
 * - Set Time
 *   This sets the time to a fixed point in time. This is not relative. You
 *   will likely need to be cautious when using this particular command.
 *
 * - Fast Forward Time
 *   This fast-forwards time by a given amount.
 *
 * - Rewind Time
 *   This rewinds time by a given amount.
 *
 * - Show TIME on Map
 *   This toggles the TIME window to be visible on the map.
 *
 * - Hide TIME on Map
 *   This toggles the TIME window to be invisible on the map.
 *   NOTE: TIME will still pass while the window is hidden.
 *
 * - Stop TIME
 *   This halts the flow of TIME.
 *   NOTE: This is not compatible with "real" time. If you use this command
 *   with real time, it will pause the counting for the duration and pick back
 *   up with the current time when TIME is unblocked.
 *
 * - Start TIME
 *   This re-enables the flow of TIME.
 *   NOTE: This is not compatible with "real" time. If you used the stop
 *   command to halt real time, when re-enabled, it will pick up wherever it is
 *   currently which may result in skipping time.
 *
 * - Unlock Screen Tone
 *   This (re-)allows the TIME system to control screen tone.
 *   NOTE: This does nothing if the plugin parameters are set to disable screen
 *   tone changing entirely.
 *
 * - Lock Screen Tone
 *   This locks the TIME system from controlling the screen tone.
 *
 * =============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added time-gated event pages/choices: exact-value, range, composite
 *    clock-time, and full-date-range tag families (Page and Choice variants)
 *    for minute/hour/day/month/year/timeOfDay/seasonOfYear.
 * - 1.0.4
 *    Fixed reversed check that only let time pass while blocked (oops!).
 * - 1.0.3
 *    Adapted for updates to J-ABS-InputManager (input namespace).
 * - 1.0.2
 *    Adapted input remappability update of J-ABS-InputManager.
 *    Removed connection between J-MAP and J-TIME toggling (HUD).
 *    Updated to support RMMZ v1.10.X base scripts (Scene_Splash).
 * - 1.0.1
 *    Fixed issue with "hours per tick" not being respected.
 * - 1.0.0
 *    J-TIME's initial release.
 * =============================================================================
 *
 * @param BASEconfigs
 * @text BASE SETUP
 *
 * @param timeWindowX
 * @parent BASEconfigs
 * @type number
 * @text Origin X
 * @desc The x coordinate of the overarching TIME window.
 * @default 1316
 *
 * @param timeWindowY
 * @parent BASEconfigs
 * @type number
 * @text Origin Y
 * @desc The y coordinate of the overarching TIME window.
 * @default 0
 *
 * @param startVisible
 * @parent BASEconfigs
 * @type boolean
 * @text Start Visible
 * @desc Begins the game with the time window visible.
 * @on Start Visible
 * @off Start Invisible
 * @default true
 *
 * @param startActivated
 * @parent BASEconfigs
 * @type boolean
 * @text Start Activated
 * @desc Begins the game with TIME active and flowing.
 * @on Start Activated
 * @off Start Deactivated
 * @default true
 *
 * @param useRealTime
 * @parent BASEconfigs
 * @type boolean
 * @text Use Real Time
 * @desc Instead of using artificial time, use real life time.
 * Using real time negates most configs below.
 * @on Real Time
 * @off Artificial Time
 * @default false
 *
 * @param changeToneByTime
 * @parent BASEconfigs
 * @type boolean
 * @text Change Tone by Time
 * @desc Lets TIME manage screen tone based on the hour.
 * @on Allow
 * @off Disallow
 * @default true
 *
 * @param useVariableAssignment
 * @parent BASEconfigs
 * @type boolean
 * @text Auto-assign Variables
 * @desc Assign all components of the time to variables.
 * @on Assign to Variables
 * @off Do Nothing
 * @default true
 *
 * @param VARIABLEconfigs
 * @parent BASEconfigs
 * @text VARIABLE CONFIGS
 *
 * @param secondsVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Seconds Variable
 * @desc The variable id the seconds value will be assigned to.
 * @default 121
 *
 * @param minutesVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Minutes Variable
 * @desc The variable id the minutes value will be assigned to.
 * @default 122
 *
 * @param hoursVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Hours Variable
 * @desc The variable id the hours value will be assigned to.
 * @default 123
 *
 * @param daysVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Days Variable
 * @desc The variable id the days value will be assigned to.
 * @default 124
 *
 * @param monthsVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Months Variable
 * @desc The variable id the months value will be assigned to.
 * @default 125
 *
 * @param yearsVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Years Variable
 * @desc The variable id the years value will be assigned to.
 * @default 126
 *
 * @param timeOfDayIdVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Time of Day Id Variable
 * @desc The variable id the time of the day's name will be assigned to.
 * @default 127
 *
 * @param timeOfDayNameVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Time of Day Name Variable
 * @desc The variable id the time of the day's name will be assigned to.
 * @default 128
 *
 * @param seasonOfYearIdVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Season of Year Id Variable
 * @desc The variable id the season of the year's id will be assigned to.
 * @default 129
 *
 * @param seasonOfYearNameVariable
 * @parent VARIABLEconfigs
 * @type variable
 * @text Season of Year Name Variable
 * @desc The variable id the season of the year's name will be assigned to.
 * @default 130
 *
 * @param ARTIFICIALconfigs
 * @text ARTIFICAL CONFIGS
 *
 * @param framesPerTick
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Rate of Time
 * @desc The number of frames that must pass for time to tick.
 * (~60 frames per real second)
 * @default 60
 *
 * @param startingSecond
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Second
 * @desc The precise second that time begins on for a new game.
 * Also affects direct time manipulation for seconds.
 * @default 0
 *
 * @param startingMinute
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Minute
 * @desc The number of minutes that are incremented per tock.
 * Also affects direct time manipulation for minutes.
 * @default 0
 *
 * @param startingHour
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Hour
 * @desc The number of hours that are incremented per tock.
 * Also affects direct time manipulation for hours.
 * @default 9
 *
 * @param startingDay
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Starting Day
 * @desc The number of days that are incremented per tock.
 * Also affects direct time manipulation for days.
 * @default 29
 *
 * @param startingMonth
 * @parent ARTIFICIALconfigs
 * @type number
 * @text Starting Month
 * @desc The number of months that are incremented per tock.
 * Also affects direct time manipulation for months.
 * @default 5
 *
 * @param startingYear
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 0
 * @text Starting Year
 * @desc The number of years that are incremented per tock.
 * Also affects direct time manipulation for years.
 * @default 2021
 *
 * @param secondsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Seconds per Tick
 * @desc The number of seconds that are incremented per tick.
 * Also affects direct time manipulation for seconds.
 * @default 10
 *
 * @param minutesPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Minutes per Tock
 * @desc The number of minutes that are incremented per tock.
 * Also affects direct time manipulation for minutes.
 * @default 1
 *
 * @param hoursPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Hours per Tock
 * @desc The number of hours that are incremented per tock.
 * Also affects direct time manipulation for hours.
 * @default 1
 *
 * @param daysPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Days per Tock
 * @desc The number of days that are incremented per tock.
 * Also affects direct time manipulation for days.
 * @default 1
 *
 * @param monthsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Months per Tock
 * @desc The number of months that are incremented per tock.
 * Also affects direct time manipulation for months.
 * @default 1
 *
 * @param yearsPerIncrement
 * @parent ARTIFICIALconfigs
 * @type number
 * @min 1
 * @text Years per Tock
 * @desc The number of years that are incremented per tock.
 * Also affects direct time manipulation for years.
 * @default 1
 *
 * @command jumpToTimeOfDay
 * @text Jump to Time of Day
 * @desc Jump to the next instance of a chosen time of day (e.g., morning).
 * @arg TimeOfDay
 * @type select
 * @desc Use the dropdown to select a time of day to jump to.
 * This will jump to the next day rather than rewind.
 * @option Night (00:00am aka midnight)
 * @value 0
 * @option Dawn (04:00am)
 * @value 1
 * @option Morning (08:00am)
 * @value 2
 * @option Afternoon (12:00pm aka noon)
 * @value 3
 * @option Evening (16:00pm)
 * @value 4
 * @option Twilight (20:00pm)
 * @value 5
 *
 * @command setTime
 * @text Set Time
 * @desc Sets the time to a fixed time; only applicable to artificial time.
 * @arg Second
 * @type number
 * @max 59
 * @arg Minute
 * @type number
 * @max 59
 * @arg Hour
 * @type number
 * @max 12
 * @arg Day
 * @type number
 * @min 1
 * @max 30
 * @arg Month
 * @type number
 * @min 1
 * @max 12
 * @default 1
 * @arg Year
 * @type number
 * @default 2021
 *
 * @command fastForwardtime
 * @text Fast Forward Time
 * @desc Fast-forwards time by a set amount; artificial time only.
 * @arg Second
 * @type number
 * @default 0
 * @arg Minute
 * @type number
 * @default 0
 * @arg Hour
 * @type number
 * @default 0
 * @arg Day
 * @type number
 * @default 0
 * @arg Month
 * @type number
 * @default 0
 * @arg Year
 * @type number
 * @default 0
 *
 * @command rewindTime
 * @text Rewind Time
 * @desc Rewinds time by a set amount; artificial time only.
 * @arg Second
 * @type number
 * @default 0
 * @arg Minute
 * @type number
 * @default 0
 * @arg Hour
 * @type number
 * @default 0
 * @arg Day
 * @type number
 * @default 0
 * @arg Month
 * @type number
 * @default 0
 * @arg Year
 * @type number
 * @default 0
 *
 * @command showMapTime
 * @text Show TIME on Map
 * @desc Shows the TIME window on the map.
 *
 * @command hideMapTime
 * @text Hide TIME on Map
 * @desc Hides the TIME window on the map.
 *
 * @command stopTime
 * @text Stop TIME
 * @desc Stops the flow of time; only applicable to artificial time.
 *
 * @command startTime
 * @text Start TIME
 * @desc Starts the flow of time; only applicable to artificial time.
 *
 * @command unlockTone
 * @text Unlock Screen Tone
 * @desc Allows the TIME system to control screen tone.
 * Does nothing if screen tone changing was initially disabled.
 *
 * @command lockTone
 * @text Lock Screen Tone
 * @desc Prevents the TIME system from controlling the screen tone.
 *
 */

//#region src/plugins/time/core/_metadata/_pluginMetadata.js
var J_TIME_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps plugin parameters into instance fields used by {@link Game_Time}.
	*/
	postInitialize() {
		super.postInitialize();
		const pp = this.parsedPluginParameters;
		this.TimeWindowX = Number(pp["timeWindowX"]);
		this.TimeWindowY = Number(pp["timeWindowY"]);
		this.StartVisible = pp["startVisible"] === "true";
		this.StartActivated = pp["startActivated"] === "true";
		this.UseRealTime = pp["useRealTime"] === "true";
		this.ChangeToneByTime = pp["changeToneByTime"] === "true";
		this.UseVariableAssignment = pp["useVariableAssignment"] === "true";
		this.SecondsVariable = Number(pp["secondsVariable"]);
		this.MinutesVariable = Number(pp["minutesVariable"]);
		this.HoursVariable = Number(pp["hoursVariable"]);
		this.DaysVariable = Number(pp["daysVariable"]);
		this.MonthsVariable = Number(pp["monthsVariable"]);
		this.YearsVariable = Number(pp["yearsVariable"]);
		this.TimeOfDayIdVariable = Number(pp["timeOfDayIdVariable"]);
		this.TimeOfDayNameVariable = Number(pp["timeOfDayNameVariable"]);
		this.SeasonOfYearIdVariable = Number(pp["seasonOfYearIdVariable"]);
		this.SeasonOfYearNameVariable = Number(pp["seasonOfYearNameVariable"]);
		this.FramesPerTick = Number(pp["framesPerTick"]);
		this.StartingSecond = Number(pp["startingSecond"]);
		this.StartingMinute = Number(pp["startingMinute"]);
		this.StartingHour = Number(pp["startingHour"]);
		this.StartingDay = Number(pp["startingDay"]);
		this.StartingMonth = Number(pp["startingMonth"]);
		this.StartingYear = Number(pp["startingYear"]);
		this.SecondsPerIncrement = Number(pp["secondsPerIncrement"]);
		this.MinutesPerIncrement = Number(pp["minutesPerIncrement"]);
		this.HoursPerIncrement = Number(pp["hoursPerIncrement"]);
		this.DaysPerIncrement = Number(pp["daysPerIncrement"]);
		this.MonthsPerIncrement = Number(pp["monthsPerIncrement"]);
		this.YearsPerIncrement = Number(pp["yearsPerIncrement"]);
	}
};

//#endregion
//#region src/plugins/time/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.TIME = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.TIME.Metadata = new J_TIME_PluginMetadata("J-TIME", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.TIME.Aliased = {
	DataManager: new Map(),
	Game_Event: new Map(),
	Game_Interpreter: new Map(),
	JABS_StandardController: new Map(),
	Scene_Base: new Map(),
	Scene_Map: new Map(),
	Window_Base: new Map()
};
/**
* A collection of all regular expressions for this plugin.
*/
J.TIME.RegExp = {};
J.TIME.RegExp.MinutePage = /<minutePage:[ ]?(\d+),? ?( )?>/i;
J.TIME.RegExp.HourPage = /<hourPage:[ ]?(\d+)>/i;
J.TIME.RegExp.DayPage = /<dayPage:[ ]?(\d+)>/i;
J.TIME.RegExp.MonthPage = /<monthPage:[ ]?(\d+)>/i;
J.TIME.RegExp.YearPage = /<yearPage:[ ]?(\d+)>/i;
J.TIME.RegExp.TimeOfDayPage = /<timeOfDayPage:[ ]?([0-5]|night|dawn|morning|afternoon|evening|twilight)>/i;
J.TIME.RegExp.SeasonOfYearPage = /<seasonOfYearPage:[ ]?([0-3]|spring|summer|autumn|winter)>/i;
J.TIME.RegExp.MinuteRangePage = /<minuteRangePage:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.HourRangePage = /<hourRangePage:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.DayRangePage = /<dayRangePage:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.MonthRangePage = /<monthRangePage:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.YearRangePage = /<yearRangePage:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.TimeRangePage = /<timeRangePage:[ ]?(\d{1,2}):(\d{1,2})-(\d{1,2}):(\d{1,2})>/i;
J.TIME.RegExp.FullDateRangePage = /<fullDateRangePage:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])-(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])>/i;
J.TIME.RegExp.MinuteChoice = /<minuteChoice:[ ]?(\d+)>/i;
J.TIME.RegExp.HourChoice = /<hourChoice:[ ]?(\d+)>/i;
J.TIME.RegExp.DayChoice = /<dayChoice:[ ]?(\d+)>/i;
J.TIME.RegExp.MonthChoice = /<monthChoice:[ ]?(\d+)>/i;
J.TIME.RegExp.YearChoice = /<yearChoice:[ ]?(\d+)>/i;
J.TIME.RegExp.TimeOfDayChoice = /<timeOfDayChoice:[ ]?([0-5]|night|dawn|morning|afternoon|evening|twilight)>/i;
J.TIME.RegExp.SeasonOfYearChoice = /<seasonOfYearChoice:[ ]?([0-3]|spring|summer|autumn|winter)>/i;
J.TIME.RegExp.MinuteRangeChoice = /<minuteRangeChoice:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.HourRangeChoice = /<hourRangeChoice:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.DayRangeChoice = /<dayRangeChoice:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.MonthRangeChoice = /<monthRangeChoice:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.YearRangeChoice = /<yearRangeChoice:[ ]?(\d+)-(\d+)>/i;
J.TIME.RegExp.TimeRangeChoice = /<timeRangeChoice:[ ]?(\d{1,2}):(\d{1,2})-(\d{1,2}):(\d{1,2})>/i;
J.TIME.RegExp.FullDateRangeChoice = /<fullDateRangeChoice:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])-(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])>/i;
/**
* A global object for storing data related to TIME.
* @global
* @type {Game_Time}
*/
globalThis.$gameTime = null;

//#endregion
//#region src/plugins/time/core/_models/TimeConditional.js
var TimeConditional = class {
	isTimeRange = false;
	isFullDateRange = false;
	seconds = -1;
	minutes = -1;
	hours = -1;
	days = -1;
	months = -1;
	years = -1;
	timeOfDay = -1;
	seasonOfYear = -1;
	/**
	* The start range for a time if there are two numbers in the array, or a full date range if there are 5 numbers.
	* @type {[number, number]|[number,number,number,number,number]}
	*/
	startRange = [];
	/**
	* The end range for a time if there are two numbers in the array, or a full date range if there are six numbers.
	* When it is two numbers, it is `[hour, minute]`, like reading a clock.<br/>
	* When it is six numbers, it is `[second, minute, hour, day, month, year]`- though seconds are not customizable.
	* @type {[number, number]|[number,number,number,number,number,number]}
	*/
	endRange = [];
};

//#endregion
//#region src/plugins/time/core/_models/Time_Snapshot.js
/**
* A class representing a snapshot in time of a moment.
*/
var Time_Snapshot = class Time_Snapshot {
	/**
	* Gets the season of year id.
	* @returns {number} The seasonOfYearId.
	*/
	seasonOfYearId() {
		return this._seasonOfYearId;
	}
	/**
	* Gets the time of day id.
	* @returns {number} The timeOfDayId.
	*/
	timeOfDayId() {
		return this._timeOfDayId;
	}
	/**
	* @constructor
	* @param {number} seconds The seconds of the current time.
	* @param {number} minutes The minutes of the current time.
	* @param {number} hours The hours of the current time.
	* @param {number} days The days of the current time.
	* @param {number} months The months of the current time.
	* @param {number} years The years of the current time.
	* @param {number} timeOfDayId The id of the time of day.
	* @param {number} seasonOfYearId The id of the season of the year.
	*/
	constructor(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId) {
		/**
		* The seconds of the current time.
		* @type {number}
		*/
		this.seconds = seconds;
		/**
		* The minutes of the current time.
		* @type {number}
		*/
		this.minutes = minutes;
		/**
		* The hours of the current time.
		* @type {number}
		*/
		this.hours = hours;
		/**
		* The days of the current time.
		* @type {number}
		*/
		this.days = days;
		/**
		* The months of the current time.
		* @type {number}
		*/
		this.months = months;
		/**
		* The years of the current time.
		* @type {number}
		*/
		this.years = years;
		/**
		* The id of the time of day.
		* @type {number}
		*/
		this._timeOfDayId = timeOfDayId;
		/**
		* The id of the season of the year.
		* @type {number}
		*/
		this._seasonOfYearId = seasonOfYearId;
	}
	/**
	* Translates the numeric season of the year into it's proper name.
	* @param {number} seasonId The numeric representation of the season of the year.
	* @returns {string}
	*/
	static SeasonsName(seasonId) {
		switch (seasonId) {
			case 0: return "Spring";
			case 1: return "Summer";
			case 2: return "Autumn";
			case 3: return "Winter";
			default:
				console.error(`${seasonId} is not a valid season id.`);
				return null;
		}
	}
	/**
	* Translates the numeric season of the year into it's icon index.
	* @param {number} seasonId The numeric representation of the season of the year.
	* @returns {string}
	*/
	static SeasonsIconIndex(seasonId) {
		switch (seasonId) {
			case 0: return 887;
			case 1: return 888;
			case 2: return 889;
			case 3: return 890;
			default: return `${seasonId} is not a valid season id.`;
		}
	}
	/**
	* Translates the name of the season into its id.
	* @param {string} seasonName The name of the season.
	* @returns {number}
	*/
	static SeasonsId(seasonName) {
		switch (seasonName.toLowerCase()) {
			case "spring": return 0;
			case "summer": return 1;
			case "autumn":
			case "fall": return 2;
			case "winter": return 3;
			default:
				console.error(`${seasonName} is not a valid season name.`);
				return -1;
		}
	}
	/**
	* Translates the numeric time of the day into it's proper name.
	* @param {number} timeOfDayId The numeric representation of the time of the day.
	* @returns {string}
	*/
	static TimesOfDayName(timeOfDayId) {
		switch (timeOfDayId) {
			case 0: return "Night";
			case 1: return "Dawn";
			case 2: return "Morning";
			case 3: return "Afternoon";
			case 4: return "Evening";
			case 5: return "Twilight";
			default:
				console.error(`${timeOfDayId} is not a valid time of day id.`);
				return null;
		}
	}
	/**
	* Translates the numeric time of the day into it's icon index.
	* @param {number} timeOfDayId The numeric representation of the time of the day.
	* @returns {string}
	*/
	static TimesOfDayIcon(timeOfDayId) {
		switch (timeOfDayId) {
			case 0: return 2256;
			case 1: return 2260;
			case 2: return 2261;
			case 3: return 2261;
			case 4: return 2257;
			case 5: return 2256;
			default: return `${timeOfDayId} is not a valid time of day id.`;
		}
	}
	/**
	* Translates the name of a time of the day into its id.
	* @param {string} timeOfDayString The name of the time of the day.
	* @returns {number}
	*/
	static TimesOfDayId(timeOfDayString) {
		switch (timeOfDayString.toLowerCase()) {
			case "night": return 0;
			case "dawn": return 1;
			case "morning": return 2;
			case "afternoon": return 3;
			case "evening": return 4;
			case "twilight": return 5;
			default:
				console.error(`${timeOfDayString} is not a valid time of day name.`);
				return -1;
		}
	}
	/**
	* Gets the name of the current season of the year.
	* @type {string}
	*/
	get seasonOfTheYearName() {
		return Time_Snapshot.SeasonsName(this.seasonOfYearId());
	}
	/**
	* Gets the icon index of the current season of the year.
	* @type {number}
	*/
	get seasonOfTheYearIcon() {
		return Time_Snapshot.SeasonsIconIndex(this.seasonOfYearId());
	}
	/**
	* Gets the name of the current time of the day.
	* @type {string}
	*/
	get timeOfDayName() {
		return Time_Snapshot.TimesOfDayName(this.timeOfDayId());
	}
	/**
	* Gets the icon index of the current time of the day.
	* @type {number}
	*/
	get timeOfDayIcon() {
		return Time_Snapshot.TimesOfDayIcon(this.timeOfDayId());
	}
	/**
	* Determines if this {@link Time_Snapshot} is effectively the same as the provided snapshot.<br/>
	* "Effectively the same" translates to "all time properties are the same from seconds to years" as the target.
	* @param {Time_Snapshot} snapshot The target snapshot to compare equality against.
	* @returns {boolean} True if this snapshot is effectively the same, false otherwise.
	*/
	equals(snapshot) {
		if (this.years !== snapshot.years) return false;
		if (this.months !== snapshot.months) return false;
		if (this.days !== snapshot.days) return false;
		if (this.hours !== snapshot.hours) return false;
		if (this.minutes !== snapshot.minutes) return false;
		if (this.seconds !== snapshot.seconds) return false;
		return true;
	}
	/**
	* Determines if this {@link Time_Snapshot} is after the provided snapshot.
	* @param {Time_Snapshot} snapshot The target snapshot to see if this snapshot is after.
	* @returns {boolean} True if this snapshot is after the target, false otherwise.
	*/
	isAfter(snapshot) {
		const thisDate = new Date(this.years, this.months - 1, this.days, this.hours, this.minutes, this.seconds);
		const targetDate = new Date(snapshot.years, snapshot.months - 1, snapshot.days, snapshot.hours, snapshot.minutes, snapshot.seconds);
		return thisDate > targetDate;
	}
	/**
	* Determines if this {@link Time_Snapshot} is before the provided snapshot.
	* @param {Time_Snapshot} snapshot The target snapshot to see if this snapshot is before.
	* @returns {boolean} True if this snapshot is before the target, false otherwise.
	*/
	isBefore(snapshot) {
		const thisDate = new Date(this.years, this.months - 1, this.days, this.hours, this.minutes, this.seconds);
		const targetDate = new Date(snapshot.years, snapshot.months - 1, snapshot.days, snapshot.hours, snapshot.minutes, snapshot.seconds);
		return thisDate < targetDate;
	}
	/**
	* Determines of this {@link Time_Snapshot} is between the two provided snapshots.
	* @param {Time_Snapshot} start The starting snapshot to check betweenness against.
	* @param {Time_Snapshot} end The ending snapshot to check betweenness against.
	* @param {boolean} [startInclusive=false] Whether or not to include the start time as "between"; defaults to false.
	* @param {boolean} [endInclusive=false] Whether or not to include the end time as "between"; defaults to false.
	*/
	isBetweenSnapshots(start, end, startInclusive = false, endInclusive = false) {
		const isAfterStart = this.isAfter(start) || startInclusive && this.equals(start);
		if (!isAfterStart) return false;
		const isBeforeEnd = this.isBefore(end) || endInclusive && this.equals(end);
		if (!isBeforeEnd) return false;
		return true;
	}
	/**
	* Determines whether or not this {@link Time_Snapshot} is between the given start and end {@link Date}s.
	* @param {Date} start The start date.
	* @param {Date} end The end date.
	* @param {boolean} [startInclusive=false] Whether or not to include the start time as "between"; defaults to false.
	* @param {boolean} [endInclusive=false] Whether or not to include the end time as "between"; defaults to false.
	*/
	isBetweenDates(start, end, startInclusive = false, endInclusive = false) {
		const startTimeSnapshot = this.#dateToSnapshot(start);
		const endTimeSnapshot = this.#dateToSnapshot(end);
		return this.isBetweenSnapshots(startTimeSnapshot, endTimeSnapshot, startInclusive, endInclusive);
	}
	/**
	* Maps a {@link Date} to a {@link Time_Snapshot}.
	* @param {Date} date The date to map to a {@link Time_Snapshot}.
	* @returns {Time_Snapshot} The mapped snapshot.
	*/
	#dateToSnapshot(date) {
		const dateTimeOfDay = $gameTime.timeOfDay(date.getHours());
		const seasonOfYear = $gameTime.seasonOfYear(date.getMonth() + 1);
		return new Time_Snapshot(date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth() + 1, date.getFullYear(), dateTimeOfDay, seasonOfYear);
	}
};

//#endregion
//#region src/plugins/time/core/objects/TimeMapper.js
/**
* A class with several static mapping functions for parsing comments into {@link TimeConditional}s.
* Registered and referenced by time/initialization, not in-file.
*/
var TimeMapper = class {
	constructor() {
		throw new Error("This is a static class.");
	}
	static minuteToConditional(comment, regex) {
		const [, minutes] = regex.exec(comment);
		const timeConditional = new TimeConditional();
		timeConditional.minutes = parseInt(minutes);
		return timeConditional;
	}
	static hourToConditional(comment, regex) {
		const [, hours] = regex.exec(comment);
		const timeConditional = new TimeConditional();
		timeConditional.hours = parseInt(hours);
		return timeConditional;
	}
	static dayToConditional(comment, regex) {
		const [, days] = regex.exec(comment);
		const timeConditional = new TimeConditional();
		timeConditional.days = parseInt(days);
		return timeConditional;
	}
	static monthToConditional(comment, regex) {
		const [, months] = regex.exec(comment);
		const timeConditional = new TimeConditional();
		timeConditional.months = parseInt(months);
		return timeConditional;
	}
	static yearToConditional(comment, regex) {
		const [, years] = regex.exec(comment);
		const timeConditional = new TimeConditional();
		timeConditional.years = parseInt(years);
		return timeConditional;
	}
	static timeOfDayToConditional(comment, regex) {
		const [, timeOfDay] = regex.exec(comment);
		const maybeStringTimeOfDay = parseInt(timeOfDay);
		const timeConditional = new TimeConditional();
		isNaN(maybeStringTimeOfDay) === false ? timeConditional.timeOfDay = maybeStringTimeOfDay : timeConditional.timeOfDay = Time_Snapshot.TimesOfDayId(timeOfDay);
		return timeConditional;
	}
	static seasonOfYearToConditional(comment, regex) {
		const [, seasonOfYear] = regex.exec(comment);
		const maybeStringSeasonOfYear = parseInt(seasonOfYear);
		const timeConditional = new TimeConditional();
		isNaN(maybeStringSeasonOfYear) === false ? timeConditional.seasonOfYear = maybeStringSeasonOfYear : timeConditional.seasonOfYear = Time_Snapshot.SeasonsId(seasonOfYear);
		return timeConditional;
	}
	static timeRangeToConditional(comment, regex) {
		const [, startHour, startMinute, endHour, endMinute] = regex.exec(comment);
		const startTimeRange = [parseInt(startHour), parseInt(startMinute)];
		const endTimeRange = [parseInt(endHour), parseInt(endMinute)];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = startTimeRange;
		timeConditional.endRange = endTimeRange;
		timeConditional.isTimeRange = true;
		return timeConditional;
	}
	static fullDateRangeToConditional(comment, regex) {
		const [, startFullRangeRaw, endFullRangeRaw] = regex.exec(comment);
		const startFullRange = [0, ...JSON.parse(startFullRangeRaw)];
		const endFullRange = [59, ...JSON.parse(endFullRangeRaw)];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = startFullRange;
		timeConditional.endRange = endFullRange;
		timeConditional.isFullDateRange = true;
		return timeConditional;
	}
	static minuteRangeToConditional(comment, regex) {
		const currentTimeSnapshot = $gameTime.currentTime();
		const [, startMinuteRange, endMinuteRange] = regex.exec(comment);
		const minuteRangeHourStart = currentTimeSnapshot.hours;
		let minuteRangeHourEnd = startMinuteRange < endMinuteRange ? currentTimeSnapshot.hours : currentTimeSnapshot.hours + 1;
		if (minuteRangeHourEnd === 24) {
			minuteRangeHourEnd = 0;
		}
		const startMinuteRangeTimeRange = [minuteRangeHourStart, parseInt(startMinuteRange)];
		const endMinuteRangeTimeRange = [minuteRangeHourEnd, parseInt(endMinuteRange)];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = startMinuteRangeTimeRange;
		timeConditional.endRange = endMinuteRangeTimeRange;
		timeConditional.isTimeRange = true;
		return timeConditional;
	}
	static hourRangeToConditional(comment, regex) {
		const [, startHourRange, endHourRange] = regex.exec(comment);
		const startHourRangeTimeRange = [parseInt(startHourRange), 0];
		const endHourRangeTimeRange = [parseInt(endHourRange), 0];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = startHourRangeTimeRange;
		timeConditional.endRange = endHourRangeTimeRange;
		timeConditional.isTimeRange = true;
		return timeConditional;
	}
	static dayRangeToConditional(comment, regex) {
		const currentTimeSnapshot = $gameTime.currentTime();
		const [, startDayRange, endDayRange] = regex.exec(comment);
		const dayRangeStart = parseInt(startDayRange);
		const dayRangeEnd = parseInt(endDayRange);
		const fullDateRangeStart = [
			0,
			0,
			0,
			dayRangeStart,
			currentTimeSnapshot.months,
			currentTimeSnapshot.years
		];
		let dayRangeMonthEnd = dayRangeEnd < dayRangeStart ? currentTimeSnapshot.months + 1 : currentTimeSnapshot.months;
		let dayRangeYearEnd = currentTimeSnapshot.years;
		if (dayRangeMonthEnd === 13) {
			dayRangeMonthEnd = 1;
			dayRangeYearEnd += 1;
		}
		const fullDateRangeEnd = [
			59,
			59,
			23,
			dayRangeEnd,
			dayRangeMonthEnd,
			dayRangeYearEnd
		];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = fullDateRangeStart;
		timeConditional.endRange = fullDateRangeEnd;
		timeConditional.isFullDateRange = true;
		return timeConditional;
	}
	static monthRangeToConditional(comment, regex) {
		const currentTimeSnapshot = $gameTime.currentTime();
		const [, startMonthRange, endMonthRange] = regex.exec(comment);
		const monthRangeStart = parseInt(startMonthRange);
		const monthRangeEnd = parseInt(endMonthRange);
		const fullDateRangeStart = [
			0,
			0,
			0,
			1,
			monthRangeStart,
			currentTimeSnapshot.years
		];
		const monthRangeYearEnd = monthRangeEnd < monthRangeStart ? currentTimeSnapshot.years + 1 : currentTimeSnapshot.years;
		const fullDateRangeEnd = [
			59,
			59,
			23,
			30,
			monthRangeEnd,
			monthRangeYearEnd
		];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = fullDateRangeStart;
		timeConditional.endRange = fullDateRangeEnd;
		timeConditional.isFullDateRange = true;
		return timeConditional;
	}
	static yearRangeToConditional(comment, regex) {
		const [, startYearRange, endYearRange] = regex.exec(comment);
		const yearRangeStart = parseInt(startYearRange);
		const yearRangeEnd = parseInt(endYearRange);
		const fullDateRangeStart = [
			0,
			0,
			0,
			1,
			1,
			yearRangeStart
		];
		const fullDateRangeEnd = [
			0,
			0,
			0,
			1,
			1,
			yearRangeEnd
		];
		const timeConditional = new TimeConditional();
		timeConditional.startRange = fullDateRangeStart;
		timeConditional.endRange = fullDateRangeEnd;
		timeConditional.isFullDateRange = true;
		return timeConditional;
	}
};

//#endregion
//#region src/plugins/time/core/_models/Game_Time.js
/**
* A class for controlling time.
*/
var Game_Time = class Game_Time {
	/**
	* Constructor.
	*/
	constructor() {
		this.initMembers();
		this.updateCurrentTone();
	}
	/**
	* A static representation of the tones for each time of day.
	*/
	static toneOfDay = {
		Night: [
			-100,
			-100,
			-30,
			100
		],
		Dawn: [
			-30,
			-15,
			15,
			64
		],
		Morning: [
			0,
			0,
			0,
			0
		],
		Afternoon: [
			10,
			10,
			10,
			10
		],
		Evening: [
			0,
			-30,
			-30,
			-30
		],
		Twilight: [
			-68,
			-68,
			0,
			68
		]
	};
	/**
	* Initializes the members of this class.
	*/
	initMembers() {
		/**
		* The number of frames that must pass before we execute a tick.
		* @type {number}
		*/
		this._tickFrames ??= J.TIME.Metadata.FramesPerTick;
		/**
		* The number of seconds per tick.
		* @type {number}
		*/
		this._secondsPerTick ??= J.TIME.Metadata.SecondsPerIncrement;
		/**
		* The number of minutes per tick.
		* @type {number}
		*/
		this._minutesPerTick ??= J.TIME.Metadata.MinutesPerIncrement;
		/**
		* The number of hours per tick.
		* @type {number}
		*/
		this._hoursPerTick ??= J.TIME.Metadata.HoursPerIncrement;
		/**
		* The number of days per tick.
		* @type {number}
		*/
		this._daysPerTick ??= J.TIME.Metadata.DaysPerIncrement;
		/**
		* The number of months per tick.
		* @type {number}
		*/
		this._monthsPerTick ??= J.TIME.Metadata.MonthsPerIncrement;
		/**
		* The number of years per tick.
		* @type {number}
		*/
		this._yearsPerTick ??= J.TIME.Metadata.YearsPerIncrement;
		/**
		* The current second.
		* @type {number}
		*/
		this._seconds ??= J.TIME.Metadata.StartingSecond;
		/**
		* The current minute.
		* @type {number}
		*/
		this._minutes ??= J.TIME.Metadata.StartingMinute;
		/**
		* The current hour.
		* @type {number}
		*/
		this._hours ??= J.TIME.Metadata.StartingHour;
		/**
		* The current day (number).
		* @type {number}
		*/
		this._days ??= J.TIME.Metadata.StartingDay;
		/**
		* The current month (number).
		* @type {number}
		*/
		this._months ??= J.TIME.Metadata.StartingMonth;
		/**
		* The current year.
		* @type {number}
		*/
		this._years ??= J.TIME.Metadata.StartingYear;
		/**
		* Whether or not the screen's tone needs to be changed based on the time.
		* @type {boolean}
		*/
		this._needsToneChange = false;
		/**
		* The current tone of the screen.
		* @type {[number, number, number, number]}
		*/
		this._currentTone = [];
		/**
		* Whether or not the tone is able to be changed.
		* @type {boolean}
		*/
		this._toneLocked ??= !J.TIME.Metadata.ChangeToneByTime;
		/**
		* Whether or not the time window is visible on the map.
		* @type {boolean}
		*/
		this._visible ??= J.TIME.Metadata.StartVisible;
		/**
		* Whether or not time is currently flowing.
		* @type {boolean}
		*/
		this._active ??= J.TIME.Metadata.StartActivated;
		/**
		* Whether or not time is blocked from flowing for some predetermined reason.
		* This is typically used for manually stopping artificial time with with
		* plugin commands.
		* @type {boolean}
		*/
		this._blocked ??= false;
		/**
		* Whether or not this has been updated. This is primarily for HUD elements keeping in-sync with TIME.
		* @type {boolean}
		*/
		this._hasBeenUpdated ??= false;
	}
	/**
	* Gets the has been updated.
	* @returns {boolean} The hasBeenUpdated.
	*/
	hasBeenUpdated() {
		return this._hasBeenUpdated;
	}
	/**
	* Sets the has been updated.
	* @param {boolean} newHasBeenUpdated The new hasBeenUpdated.
	*/
	setHasBeenUpdated(newHasBeenUpdated) {
		this._hasBeenUpdated = newHasBeenUpdated;
	}
	/**
	* Gets the visible.
	* @returns {*} The visible.
	*/
	isVisible() {
		return this._visible;
	}
	/**
	* Sets the visible.
	* @param {boolean} newVisible The new visible.
	*/
	setVisible(newVisible) {
		this._visible = newVisible;
	}
	/**
	* Gets the tick frames.
	* @returns {number} The tickFrames.
	*/
	tickFrames() {
		return this._tickFrames;
	}
	/**
	* Sets the tick frames.
	* @param {number} newTickFrames The new tickFrames.
	*/
	setTickFrames(newTickFrames) {
		this._tickFrames = newTickFrames;
	}
	/**
	* Gets the hours.
	* @returns {*} The hours.
	*/
	hours() {
		return this._hours;
	}
	/**
	* Sets the hours.
	* @param {*} newHours The new hours.
	*/
	setHours(newHours) {
		this._hours = newHours;
	}
	/**
	* Gets the months.
	* @returns {*} The months.
	*/
	months() {
		return this._months;
	}
	/**
	* Sets the months.
	* @param {*} newMonths The new months.
	*/
	setMonths(newMonths) {
		this._months = newMonths;
	}
	/**
	* Gets the seconds.
	* @returns {number} The seconds.
	*/
	seconds() {
		return this._seconds;
	}
	/**
	* Sets the seconds.
	* @param {number} newSeconds The new seconds.
	*/
	setSeconds(newSeconds) {
		this._seconds = newSeconds;
	}
	/**
	* Gets the minutes.
	* @returns {number} The minutes.
	*/
	minutes() {
		return this._minutes;
	}
	/**
	* Sets the minutes.
	* @param {number} newMinutes The new minutes.
	*/
	setMinutes(newMinutes) {
		this._minutes = newMinutes;
	}
	/**
	* Gets the days.
	* @returns {*} The days.
	*/
	days() {
		return this._days;
	}
	/**
	* Sets the days.
	* @param {*} newDays The new days.
	*/
	setDays(newDays) {
		this._days = newDays;
	}
	/**
	* Gets the years.
	* @returns {*} The years.
	*/
	years() {
		return this._years;
	}
	/**
	* Sets the years.
	* @param {*} newYears The new years.
	*/
	setYears(newYears) {
		this._years = newYears;
	}
	/**
	* Gets the minutes per tick.
	* @returns {*} The minutesPerTick.
	*/
	minutesPerTick() {
		return this._minutesPerTick;
	}
	/**
	* Gets the hours per tick.
	* @returns {*} The hoursPerTick.
	*/
	hoursPerTick() {
		return this._hoursPerTick;
	}
	/**
	* Gets the days per tick.
	* @returns {*} The daysPerTick.
	*/
	daysPerTick() {
		return this._daysPerTick;
	}
	/**
	* Gets the months per tick.
	* @returns {*} The monthsPerTick.
	*/
	monthsPerTick() {
		return this._monthsPerTick;
	}
	/**
	* Gets the years per tick.
	* @returns {*} The yearsPerTick.
	*/
	yearsPerTick() {
		return this._yearsPerTick;
	}
	/**
	* Gets the current tick speed.
	* @returns {number}
	*/
	getTickSpeed() {
		return this.tickFrames();
	}
	/**
	* Sets the new tick speed to (60 / multiplier) frames per second.
	*
	* The threshold for this multiplier is `0.1` to `10.0`.
	* @param {number} flowSpeedMultiplier The new multiplier for how fast a single tick is.
	*/
	setTickSpeed(flowSpeedMultiplier) {
		let flow = flowSpeedMultiplier;
		if (flow > 10) {
			flow = 10;
		} else if (flow < .1) {
			flow = .1;
		}
		const newTickSpeed = Math.ceil(60 / flow);
		this.setTickFrames(newTickSpeed);
	}
	/**
	* Gets whether or not the time window is visibile on the map.
	* @returns {boolean}
	*/
	isMapWindowVisible() {
		return this.isVisible();
	}
	/**
	* Gets whether or not time is actively flowing right now.
	* @returns {boolean}
	*/
	isActive() {
		return this._active;
	}
	/**
	* Deactivates TIME. Time will stop flowing if it wasn't already stopped.
	*/
	deactivate() {
		this._active = false;
	}
	/**
	* Activates TIME. Time will now start flowing if it wasn't already started.
	*/
	activate() {
		this._active = true;
	}
	/**
	* Gets whether or not TIME is blocked from flowing.
	* @returns {boolean}
	*/
	isBlocked() {
		return this._blocked;
	}
	/**
	* Blocks time and prevents it from flowing regardless of previous flow.
	*/
	block() {
		this._blocked = true;
	}
	/**
	* Unblocks time and allows it to return to it's previous flow.
	*/
	unblock() {
		this._blocked = false;
	}
	/**
	* Gets whether or not the screen tone is currently locked from changing.
	* @returns {boolean}
	*/
	isToneLocked() {
		return this._toneLocked;
	}
	/**
	* Locks the screen's tone, preventing it from changing by this system.
	*/
	lockTone() {
		this._toneLocked = true;
	}
	/**
	* Unlocks the screen's tone, allowing this system to regain control over it.
	*/
	unlockTone() {
		this._toneLocked = false;
	}
	/**
	* Hides the time window on the map.
	*/
	hideMapWindow() {
		this.setVisible(false);
	}
	/**
	* Shows the time window on the map.
	*/
	showMapWindow() {
		this.setVisible(true);
	}
	/**
	* Toggles the map window visibility.
	*/
	toggleMapWindow() {
		if (this.isVisible() === true) {
			this.setVisible(false);
		} else if (this.isVisible() === false) {
			this.setVisible(true);
		}
	}
	/**
	* Flags oneself for having been updated so HUD elements can update accordingly.
	*/
	flagForHudUpdate() {
		if (this.hasBeenUpdated() === undefined) {
			this.setHasBeenUpdated(true);
			console.log("hasBeenUpdated property added.");
		}
		this.setHasBeenUpdated(true);
	}
	/**
	* Acknowledges a HUD update.
	*/
	acknowledgeHudUpdate() {
		if (this.hasBeenUpdated() === undefined) {
			this.setHasBeenUpdated(false);
			console.log("hasBeenUpdated property added.");
		}
		this.setHasBeenUpdated(false);
	}
	/**
	* Gets whether or not TIME has been updated and thus the HUD should be updated.
	* @returns {boolean}
	*/
	needsHudUpdate() {
		if (this.hasBeenUpdated() === undefined) {
			this.setHasBeenUpdated(false);
		}
		return this.hasBeenUpdated();
	}
	/**
	* Updates the time when the framecount aligns with the designated tick frame count.
	*/
	update() {
		if (this.canUpdateTime()) {
			this.handleUpdateTime();
		}
		if (this.getNeedsToneChange()) {
			this.handleUpdateTone();
		}
	}
	/**
	* Determine if TIME can be updated.
	* @returns {boolean}
	*/
	canUpdateTime() {
		if (Graphics.frameCount % this.getTickSpeed() === 0) return true;
		return false;
	}
	/**
	* Processes TIME updating.
	*/
	handleUpdateTime() {
		this.tickTime();
		this.updateVariables();
		this.flagForHudUpdate();
	}
	/**
	* Processes screen tone updating.
	*/
	handleUpdateTone() {
		this.setNeedsToneChange(false);
		this.processToneChange();
	}
	/**
	* Gets whether or not the screen's tone change is needed.
	* @returns {boolean}
	*/
	getNeedsToneChange() {
		if (!J.TIME.Metadata.ChangeToneByTime) {
			return false;
		}
		if (!$dataMap || !$dataMap.meta) {
			console.warn("no datamap to inspect.");
			return false;
		}
		if ($dataMap.meta["noToneChange"]) {
			return false;
		}
		return this._needsToneChange;
	}
	/**
	* Sets whether or not the screen's tone change is needed.
	* @param {boolean} need Whether or not a tone change is needed.
	*/
	setNeedsToneChange(need = true) {
		this._needsToneChange = need;
	}
	/**
	* Gets the current screen's tone.
	* @returns {[number, number, number, number]}
	*/
	getCurrentTone() {
		return this._currentTone;
	}
	/**
	* Sets the current screen's tone.
	* @param {[number, number, number, number]} newTone The new tone to change to.
	*/
	setCurrentTone(newTone) {
		this._currentTone = newTone;
	}
	/**
	* Updates the screen's tone based on the current time.
	*/
	updateCurrentTone() {
		if (!this.canUpdateTone()) return;
		const tone = this.translateHourToTone();
		if (!this.isSameTone(tone)) {
			this.setCurrentTone(tone.clone());
			this.setNeedsToneChange(true);
		}
	}
	/**
	* Gets whether or not the screen's tone can be updated.
	* @returns {boolean}
	*/
	canUpdateTone() {
		if (!J.TIME.Metadata.ChangeToneByTime) {
			return false;
		}
		if (this.isToneLocked()) {
			return false;
		}
		return true;
	}
	/**
	* Determines the tone associated with the current hour of the day.
	* Tone is represented as whole numbers in an array: `[red, green, blue, grey]`.
	* For example: `[100, -50, 0, 0]`. `Grey` must be between 0 and 255, while the rest can
	* be between -255 and 255.
	* @returns {[number, number, number, number]}
	*/
	translateHourToTone() {
		const hours = J.TIME.Metadata.UseRealTime ? new Date().getHours() : this.hours();
		let tone = [
			0,
			0,
			0,
			0
		];
		switch (hours) {
			case 0:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, .25);
				break;
			case 1:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, .5);
				break;
			case 2:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, .75);
				break;
			case 3:
				tone = Game_Time.toneOfDay.Night;
				break;
			case 4:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, .25);
				break;
			case 5:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, .5);
				break;
			case 6:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, .75);
				break;
			case 7:
				tone = Game_Time.toneOfDay.Dawn;
				break;
			case 8:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, .25);
				break;
			case 9:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, .5);
				break;
			case 10:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, .75);
				break;
			case 11:
				tone = Game_Time.toneOfDay.Morning;
				break;
			case 12:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, .25);
				break;
			case 13:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, .5);
				break;
			case 14:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, .75);
				break;
			case 15:
				tone = Game_Time.toneOfDay.Afternoon;
				break;
			case 16:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, .25);
				break;
			case 17:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, .5);
				break;
			case 18:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, .75);
				break;
			case 19:
				tone = Game_Time.toneOfDay.Evening;
				break;
			case 20:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, .25);
				break;
			case 21:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, .5);
				break;
			case 22:
				tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, .75);
				break;
			case 23:
				tone = Game_Time.toneOfDay.Twilight;
				break;
		}
		return tone;
	}
	/**
	* Calculates the tone that is a percentage of the way between two tones.
	*
	* Order is important here, as we are calculating a percent of the way from
	* the first tone to the second tone.
	* @param {[number, number, number, number]} tone1 The starting tone.
	* @param {[number, number, number, number]} tone2 The next tone.
	* @param {number} rate The decimal rate of which we are transitioning to.
	* @returns {[number, number, number, number]}
	*/
	toneBetweenTones(tone1, tone2, rate) {
		const diff = (a, b) => a > b ? a - b : b - a;
		const newTone = [];
		tone1.forEach((color1, index) => {
			const color2 = tone2[index];
			const diffToNext = diff(color1, color2);
			const partial = Math.round(diffToNext * rate);
			const newRgbValue = color2 > color1 ? color1 + partial : color1 - partial;
			newTone.push(newRgbValue);
		});
		return newTone;
	}
	/**
	* Compares the current tone with a target tone to see if they are the same.
	* @param {[number, number, number, number]} targetTone
	* @returns {boolean}
	*/
	isSameTone(targetTone) {
		if (this.getCurrentTone().length < 4) return false;
		if (this.getCurrentTone()[0] !== targetTone[0]) return false;
		if (this.getCurrentTone()[1] !== targetTone[1]) return false;
		if (this.getCurrentTone()[2] !== targetTone[2]) return false;
		if (this.getCurrentTone()[3] !== targetTone[3]) return false;
		return true;
	}
	/**
	* Processes the screen's tone change.
	* @param {boolean} skip If true, then there will be no transition time. Defaults to false.
	*/
	processToneChange(skip = false) {
		if (skip) {
			$gameScreen.startTint(this.getCurrentTone(), 1);
		} else {
			$gameScreen.startTint(this.getCurrentTone(), 300);
		}
	}
	/**
	* Gets a snapshot of the current time.
	* @returns {Time_Snapshot}
	*/
	currentTime() {
		return this.getTimeSnapshot();
	}
	/**
	* Gets the {@link Time_Snapshot} based on mode of time configured.
	* @returns {Time_Snapshot}
	*/
	getTimeSnapshot() {
		if (J.TIME.Metadata.UseRealTime) {
			return this.determineRealTime();
		} else {
			return this.determineArtificialTime();
		}
	}
	/**
	* Builds a snapshot of the time designated by the array of numbers.
	* @param {[number, number, number, number, number, number]} fromArray The six-length array of numbers
	* @returns {Time_Snapshot}
	*/
	toTimeSnapshot(fromArray) {
		const [seconds, minutes, hours, days, months, years] = fromArray;
		const timeOfDayId = this.timeOfDay(hours);
		const seasonOfYearId = this.seasonOfYear(months);
		return new Time_Snapshot(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId);
	}
	/**
	* Assigns the current time to the designated variables.
	*/
	updateVariables() {
		if (!J.TIME.Metadata.UseVariableAssignment) return;
		const timeSnapshot = this.getTimeSnapshot();
		this.updateVariablesBySnapshot(timeSnapshot);
	}
	/**
	* Update the variables for TIME based on a {@link Time_Snapshot}.
	* @param {Time_Snapshot} timeSnapshot The snapshot of TIME to update variables with.
	*/
	updateVariablesBySnapshot(timeSnapshot) {
		if (!J.TIME.Metadata.UseVariableAssignment) return;
		$gameVariables.setValue(J.TIME.Metadata.SecondsVariable, timeSnapshot.seconds);
		$gameVariables.setValue(J.TIME.Metadata.MinutesVariable, timeSnapshot.minutes);
		$gameVariables.setValue(J.TIME.Metadata.HoursVariable, timeSnapshot.hours);
		$gameVariables.setValue(J.TIME.Metadata.DaysVariable, timeSnapshot.days);
		$gameVariables.setValue(J.TIME.Metadata.MonthsVariable, timeSnapshot.months);
		$gameVariables.setValue(J.TIME.Metadata.YearsVariable, timeSnapshot.years);
		$gameVariables.setValue(J.TIME.Metadata.TimeOfDayIdVariable, timeSnapshot._timeOfDayId);
		$gameVariables.setValue(J.TIME.Metadata.TimeOfDayNameVariable, timeSnapshot.timeOfDayName);
		$gameVariables.setValue(J.TIME.Metadata.SeasonOfYearIdVariable, timeSnapshot._seasonOfYearId);
		$gameVariables.setValue(J.TIME.Metadata.SeasonOfYearNameVariable, timeSnapshot.seasonOfTheYearName);
	}
	/**
	* Gets a snapshot of the current time that is artificial.
	* @returns {Time_Snapshot}
	*/
	determineArtificialTime() {
		const timeOfDayId = this.timeOfDay(this.hours());
		const seasonOfYearId = this.seasonOfYear(this.months());
		return new Time_Snapshot(this.seconds(), this.minutes(), this.hours(), this.days(), this.months(), this.years(), timeOfDayId, seasonOfYearId);
	}
	/**
	* Gets a snapshot of the current time in the real world.
	* @returns {Time_Snapshot}
	*/
	determineRealTime() {
		const date = new Date();
		const seconds = date.getSeconds();
		const minutes = date.getMinutes();
		const hours = date.getHours();
		const days = date.getDate();
		const months = date.getMonth() + 1;
		const years = date.getFullYear();
		const timeOfDayId = this.timeOfDay(hours);
		const seasonOfYearId = this.seasonOfYear(months);
		return new Time_Snapshot(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId);
	}
	/**
	* Translates the current hour into the time of the day id.
	* @returns {number}
	*/
	timeOfDay(hours) {
		switch (true) {
			case hours <= 3: return 0;
			case hours > 3 && hours <= 7: return 1;
			case hours > 7 && hours <= 11: return 2;
			case hours > 11 && hours <= 15: return 3;
			case hours > 15 && hours <= 19: return 4;
			case hours > 19: return 5;
			default: return -1;
		}
	}
	/**
	* Determines when the (hour) start of a given time of day is.
	* @param {number} timeOfDayId The id of the time of day.
	* @returns
	*/
	startOfTimeOfDay(timeOfDayId) {
		return timeOfDayId * 4;
	}
	/**
	* Translates the current month into the season of the year id.
	* @returns {number}
	*/
	seasonOfYear(months) {
		const springMonths = [
			3,
			4,
			5
		];
		const summerMonths = [
			6,
			7,
			8
		];
		const autumnMonths = [
			9,
			10,
			11
		];
		const winterMonths = [
			1,
			2,
			12
		];
		switch (true) {
			case springMonths.includes(months): return 0;
			case summerMonths.includes(months): return 1;
			case autumnMonths.includes(months): return 2;
			case winterMonths.includes(months): return 3;
			default: return -1;
		}
	}
	/**
	* Sets the time to a fixed point.
	* @param {number} seconds The new second.
	* @param {number} minutes The new minute.
	* @param {number} hours The new hour.
	* @param {number} days The new day.
	* @param {number} months The new month.
	* @param {number} years The new year.
	*/
	setTime(seconds, minutes, hours, days, months, years) {
		if (J.TIME.Metadata.UseRealTime) return;
		this.setSeconds(seconds);
		this.setMinutes(minutes);
		this.setHours(hours);
		this.setDays(days);
		this.setMonths(months);
		this.setYears(years);
	}
	/**
	* Fast forwards to the next instance of a specific time of day.
	*
	* If the current time of day IS the target time of day, it will instead skip
	* to the following day's time of day.
	* @param {number} targetTimeOfDayId The target time of day's id.
	*/
	jumpToTimeOfDay(targetTimeOfDayId) {
		const currentTimeOfDay = this.timeOfDay(this.hours());
		let timeUntilTargetTimeOfDay;
		if (currentTimeOfDay >= targetTimeOfDayId) {
			const timeToEndOfDay = 24 - this.hours();
			const startingHourTargetTimeOfday = this.startOfTimeOfDay(targetTimeOfDayId);
			timeUntilTargetTimeOfDay = timeToEndOfDay + startingHourTargetTimeOfday;
		} else {
			const startingHourTargetTimeOfday = this.startOfTimeOfDay(targetTimeOfDayId);
			timeUntilTargetTimeOfDay = startingHourTargetTimeOfday - this.hours();
		}
		this.addHours(timeUntilTargetTimeOfDay);
		this.setSeconds(0);
		this.setMinutes(0);
	}
	/**
	* Executes the progression of time automatically. Adds the default amount of seconds
	* to the current time with every tick. This function was designed to emulate the ticking
	* of the second hand, but if the defaults are changed, it can tick multiple seconds or
	* even multiple minutes per tick.
	*/
	tickTime() {
		this.addSeconds();
	}
	/**
	* Ticks the second counter up by a designated amount.
	* @param {number} seconds The number of seconds to tick.
	*/
	addSeconds(seconds = this._secondsPerTick) {
		let potentialSeconds = this.seconds() + seconds;
		if (potentialSeconds >= 60) {
			while (potentialSeconds >= 60) {
				this.addMinutes(this.minutesPerTick());
				potentialSeconds -= 60;
			}
			this.setSeconds(potentialSeconds);
		} else {
			this.setSeconds(this.seconds() + seconds);
		}
	}
	/**
	* Ticks the minute counter up by a designated amount.
	* @param {number} minutes The number of minutes to tick.
	*/
	addMinutes(minutes = this._minutesPerTick) {
		this.updateCurrentTone();
		let potentialMinutes = this.minutes() + minutes;
		if (potentialMinutes >= 60) {
			while (potentialMinutes >= 60) {
				this.addHours(this.hoursPerTick());
				potentialMinutes -= 60;
			}
			this.setMinutes(potentialMinutes);
		} else {
			this.setMinutes(this.minutes() + minutes);
		}
	}
	/**
	* Ticks the hour counter up by a designated amount.
	* @param {number} hours The number of hours to tick.
	*/
	addHours(hours = this._hoursPerTick) {
		let potentialHours = this.hours() + hours;
		if (potentialHours >= 24) {
			while (potentialHours >= 24) {
				this.addDays(this.daysPerTick());
				potentialHours -= 24;
			}
			this.setHours(potentialHours);
		} else {
			this.setHours(this.hours() + hours);
		}
	}
	/**
	* Ticks the days counter up by a designated amount.
	* @param {number} days The number of days to tick.
	*/
	addDays(days = this._daysPerTick) {
		let potentialDays = this.days() + days;
		if (potentialDays > 30) {
			while (potentialDays > 30) {
				this.addMonths(this.monthsPerTick());
				potentialDays -= 30;
			}
			this.setDays(potentialDays);
		} else {
			this.setDays(this.days() + days);
		}
	}
	/**
	* Ticks the months counter up by a designated amount.
	* @param {number} months The number of months to tick.
	*/
	addMonths(months = this._monthsPerTick) {
		let potentialMonths = this.months() + months;
		if (potentialMonths > 12) {
			while (potentialMonths > 12) {
				this.addYears(this.yearsPerTick());
				potentialMonths -= 12;
			}
			this.setMonths(potentialMonths);
		} else {
			this.setMonths(this.months() + months);
		}
	}
	/**
	* Ticks the years counter up by a designated amount.
	* @param {number} years The number of years to tick.
	*/
	addYears(years = this._yearsPerTick) {
		this.setYears(this.years() + years);
	}
};
SerializableRegistry.register(Game_Time);

//#endregion
//#region src/plugins/time/core/database/DataManager.js
/**
* Extends the game object creation to include creating the JAFTING manager.
*/
J.TIME.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.TIME.Aliased.DataManager.get("createGameObjects").call(this);
	$gameTime = new Game_Time();
};
/**
* Extends the save content creation to include creating JAFTING data.
*/
J.TIME.Aliased.DataManager.set("makeSaveContents", DataManager.makeSaveContents);
DataManager.makeSaveContents = function() {
	const contents = J.TIME.Aliased.DataManager.get("makeSaveContents").call(this);
	contents.time = $gameTime;
	return contents;
};
/**
* Extends the save content extraction to include extracting JAFTING data.
*
* NOTE: This is the first function encountered where I actually extend it _twice_.
* As such, we accommodated that by numbering it.
*/
J.TIME.Aliased.DataManager.set("extractSaveContents2", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents) {
	J.TIME.Aliased.DataManager.get("extractSaveContents2").call(this, contents);
	$gameTime = contents.time;
	if (!$gameTime) {
		$gameTime = new Game_Time();
		console.info("J-Time did not exist in the loaded save file- creating anew.");
	}
};

//#endregion
//#region src/plugins/time/core/objects/Game_Event.js
/**
* Extends {@link meetsConditions}.<br/>
* Also includes the custom conditions that relate to time.
* @param {any} page The page driving this step.
* @returns {boolean}
*/
J.TIME.Aliased.Game_Event.set("meetsConditions", Game_Event.prototype.meetsConditions);
Game_Event.prototype.meetsConditions = function(page) {
	const metOtherPageConditions = J.TIME.Aliased.Game_Event.get("meetsConditions").call(this, page);
	if (!metOtherPageConditions) return false;
	const commentCommandList = Game_Event.getValidCommentCommandsFromPage(page);
	if (commentCommandList.length === 0) return true;
	const timeConditionals = Game_Event.toTimeConditionals(commentCommandList);
	if (timeConditionals.length === 0) return true;
	return timeConditionals.every(Game_Event.timeConditionalMet, this);
};
/**
* Filters the comment commands to only TIME conditionals- should any exist in the collection.
* @param {RPG_EventListCommand[]} commentCommandList The comment commands to potentially convert to conditionals.
* @returns {TimeConditional[]}
*/
Game_Event.toTimeConditionals = function(commentCommandList) {
	const timeCommentComands = commentCommandList.filter(Game_Event.filterCommentCommandsByEventTimeConditional, this);
	if (timeCommentComands.length === 0) return [];
	return timeCommentComands.map(Game_Event.toTimeConditional, this);
};
/**
* A filter function for only including comment event commands relevant to TIME.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsByEventTimeConditional = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { MinutePage, HourPage, DayPage, MonthPage, YearPage, TimeOfDayPage, SeasonOfYearPage, TimeRangePage, MinuteRangePage, HourRangePage, DayRangePage, MonthRangePage, YearRangePage, FullDateRangePage } = J.TIME.RegExp;
	return [
		MinutePage,
		HourPage,
		DayPage,
		MonthPage,
		YearPage,
		TimeOfDayPage,
		SeasonOfYearPage,
		TimeRangePage,
		MinuteRangePage,
		HourRangePage,
		DayRangePage,
		MonthRangePage,
		YearRangePage,
		FullDateRangePage
	].some((regex) => regex.test(comment));
};
/**
* A filter function for only including comment event commands relevant to TIME.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsByChoiceTimeConditional = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { MinuteChoice, HourChoice, DayChoice, MonthChoice, YearChoice, TimeOfDayChoice, SeasonOfYearChoice, TimeRangeChoice, MinuteRangeChoice, HourRangeChoice, DayRangeChoice, MonthRangeChoice, YearRangeChoice, FullDateRangeChoice } = J.TIME.RegExp;
	return [
		MinuteChoice,
		HourChoice,
		DayChoice,
		MonthChoice,
		YearChoice,
		TimeOfDayChoice,
		SeasonOfYearChoice,
		TimeRangeChoice,
		MinuteRangeChoice,
		HourRangeChoice,
		DayRangeChoice,
		MonthRangeChoice,
		YearRangeChoice,
		FullDateRangeChoice
	].some((regex) => regex.test(comment));
};
/**
* Converts a known comment event command into a conditional for TIME control.
* @param {RPG_EventListCommand} commentCommand The comment command to parse into a conditional.
* @returns {TimeConditional}
*/
Game_Event.toTimeConditional = function(commentCommand) {
	const [comment] = commentCommand.parameters;
	switch (true) {
		case J.TIME.RegExp.MinutePage.test(comment): return TimeMapper.minuteToConditional(comment, J.TIME.RegExp.MinutePage);
		case J.TIME.RegExp.HourPage.test(comment): return TimeMapper.hourToConditional(comment, J.TIME.RegExp.HourPage);
		case J.TIME.RegExp.DayPage.test(comment): return TimeMapper.dayToConditional(comment, J.TIME.RegExp.DayPage);
		case J.TIME.RegExp.MonthPage.test(comment): return TimeMapper.monthToConditional(comment, J.TIME.RegExp.MonthPage);
		case J.TIME.RegExp.YearPage.test(comment): return TimeMapper.yearToConditional(comment, J.TIME.RegExp.YearPage);
		case J.TIME.RegExp.TimeOfDayPage.test(comment): return TimeMapper.timeOfDayToConditional(comment, J.TIME.RegExp.TimeOfDayPage);
		case J.TIME.RegExp.SeasonOfYearPage.test(comment): return TimeMapper.seasonOfYearToConditional(comment, J.TIME.RegExp.SeasonOfYearPage);
		case J.TIME.RegExp.TimeRangePage.test(comment): return TimeMapper.timeRangeToConditional(comment, J.TIME.RegExp.TimeRangePage);
		case J.TIME.RegExp.FullDateRangePage.test(comment): return TimeMapper.fullDateRangeToConditional(comment, J.TIME.RegExp.FullDateRangePage);
		case J.TIME.RegExp.MinuteRangePage.test(comment): return TimeMapper.minuteRangeToConditional(comment, J.TIME.RegExp.MinuteRangePage);
		case J.TIME.RegExp.HourRangePage.test(comment): return TimeMapper.hourRangeToConditional(comment, J.TIME.RegExp.HourRangePage);
		case J.TIME.RegExp.DayRangePage.test(comment): return TimeMapper.dayRangeToConditional(comment, J.TIME.RegExp.DayRangePage);
		case J.TIME.RegExp.MonthRangePage.test(comment): return TimeMapper.monthRangeToConditional(comment, J.TIME.RegExp.MonthRangePage);
		case J.TIME.RegExp.YearRangePage.test(comment): return TimeMapper.yearRangeToConditional(comment, J.TIME.RegExp.YearRangePage);
		case J.TIME.RegExp.MinuteChoice.test(comment): return TimeMapper.minuteToConditional(comment, J.TIME.RegExp.MinuteChoice);
		case J.TIME.RegExp.HourChoice.test(comment): return TimeMapper.hourToConditional(comment, J.TIME.RegExp.HourChoice);
		case J.TIME.RegExp.DayChoice.test(comment): return TimeMapper.dayToConditional(comment, J.TIME.RegExp.DayChoice);
		case J.TIME.RegExp.MonthChoice.test(comment): return TimeMapper.monthToConditional(comment, J.TIME.RegExp.MonthChoice);
		case J.TIME.RegExp.YearChoice.test(comment): return TimeMapper.yearToConditional(comment, J.TIME.RegExp.YearChoice);
		case J.TIME.RegExp.TimeOfDayChoice.test(comment): return TimeMapper.timeOfDayToConditional(comment, J.TIME.RegExp.TimeOfDayChoice);
		case J.TIME.RegExp.SeasonOfYearChoice.test(comment): return TimeMapper.seasonOfYearToConditional(comment, J.TIME.RegExp.SeasonOfYearChoice);
		case J.TIME.RegExp.TimeRangeChoice.test(comment): return TimeMapper.timeRangeToConditional(comment, J.TIME.RegExp.TimeRangeChoice);
		case J.TIME.RegExp.FullDateRangeChoice.test(comment): return TimeMapper.fullDateRangeToConditional(comment, J.TIME.RegExp.FullDateRangeChoice);
		case J.TIME.RegExp.MinuteRangeChoice.test(comment): return TimeMapper.minuteRangeToConditional(comment, J.TIME.RegExp.MinuteRangeChoice);
		case J.TIME.RegExp.HourRangeChoice.test(comment): return TimeMapper.hourRangeToConditional(comment, J.TIME.RegExp.HourRangeChoice);
		case J.TIME.RegExp.DayRangeChoice.test(comment): return TimeMapper.dayRangeToConditional(comment, J.TIME.RegExp.DayRangeChoice);
		case J.TIME.RegExp.MonthRangeChoice.test(comment): return TimeMapper.monthRangeToConditional(comment, J.TIME.RegExp.MonthRangeChoice);
		case J.TIME.RegExp.YearRangeChoice.test(comment): return TimeMapper.yearRangeToConditional(comment, J.TIME.RegExp.YearRangeChoice);
		default:
			console.warn(`time conditional was not generated for an identified TIME tag; ${comment}`);
			return new TimeConditional();
	}
};
/**
* Evaluates a {@link TimeConditional} to see if its requirements are currently met.
* @param {TimeConditional} timeConditional The TIME conditional to evaluate satisfaction of.
* @returns {boolean}
*/
Game_Event.timeConditionalMet = function(timeConditional) {
	if (timeConditional.isFullDateRange) return Game_Event._timeConditionalFullDateRangeMet(timeConditional);
	if (timeConditional.isTimeRange) return Game_Event._timeConditionalTimeRangeMet(timeConditional);
	return Game_Event._timeConditionalDirectMet(timeConditional);
};
/**
* Determines if the conditional comparison was equal.
* @param {TimeConditional} timeConditional The time conditional driving this step.
* @returns {boolean}
* @private
*/
Game_Event._timeConditionalDirectMet = function(timeConditional) {
	const currentTime = $gameTime.currentTime();
	const { years, months, days, hours, minutes, seconds, timeOfDay, seasonOfYear } = timeConditional;
	if (years !== -1 && years !== currentTime.years) return false;
	if (months !== -1 && months !== currentTime.months) return false;
	if (days !== -1 && days !== currentTime.days) return false;
	if (hours !== -1 && hours !== currentTime.hours) return false;
	if (minutes !== -1 && minutes !== currentTime.minutes) return false;
	if (seconds !== -1 && seconds !== currentTime.seconds) return false;
	if (timeOfDay !== -1 && timeOfDay !== currentTime._timeOfDayId) return false;
	if (seasonOfYear !== -1 && seasonOfYear !== currentTime._seasonOfYearId) return false;
	return true;
};
/**
* Determines if the current time was within the conditional time range.
* @param {TimeConditional} timeConditional The time conditional driving this step.
* @returns {boolean}
* @private
*/
Game_Event._timeConditionalTimeRangeMet = function(timeConditional) {
	const { years, months, days } = $gameTime.currentTime();
	const { startRange, endRange } = timeConditional;
	const startHour = startRange.at(0);
	const endHour = endRange.at(0);
	const isOvernight = startHour > endHour;
	const startMinute = startRange.at(1);
	const endMinute = endRange.at(1);
	const isOverhour = startMinute > endMinute;
	const fakeStartTimeArray = [
		years,
		months - 1,
		days,
		startHour,
		startMinute,
		0
	];
	const fakeStartDate = new Date(...fakeStartTimeArray);
	const fakeEndTimeArray = [
		years,
		months - 1,
		days,
		endHour,
		endMinute,
		0
	];
	const fakeEndDate = new Date(...fakeEndTimeArray);
	if (isOvernight) {
		fakeEndDate.addDays(1);
	}
	if (isOverhour) {
		fakeEndDate.addHours(1);
	}
	if (!$gameTime.currentTime().isBetweenDates(fakeStartDate, fakeEndDate)) {
		return false;
	}
	return true;
};
/**
* Determines if the current full date time was within the conditional full date time range.
* @param {TimeConditional} timeConditional The time conditional driving this step.
* @returns {boolean}
* @private
*/
Game_Event._timeConditionalFullDateRangeMet = function(timeConditional) {
	const currentSnapshot = $gameTime.currentTime();
	const startSnapshot = $gameTime.toTimeSnapshot(timeConditional.startRange);
	const endSnapshot = $gameTime.toTimeSnapshot(timeConditional.endRange);
	return currentSnapshot.isBetweenSnapshots(startSnapshot, endSnapshot);
};

//#endregion
//#region src/plugins/time/core/objects/Game_Interpreter.js
/**
* Extends {@link shouldHideChoiceBranch}.<br/>
* Includes possibility of hiding time-related options.
* @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
* @returns {boolean}
*/
J.TIME.Aliased.Game_Interpreter.set("shouldHideChoiceBranch", Game_Interpreter.prototype.shouldHideChoiceBranch);
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex) {
	const defaultShow = J.TIME.Aliased.Game_Interpreter.get("shouldHideChoiceBranch").call(this, subChoiceCommandIndex);
	if (defaultShow) return true;
	const eventMetadata = $gameMap.event(this.eventId());
	const currentPageCommands = eventMetadata ? eventMetadata.page().list : $dataCommonEvents.at(this.commonEventId()).list;
	const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);
	if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;
	if (!Game_Event.filterCommentCommandsByChoiceTimeConditional(subEventCommand)) return false;
	const conditional = Game_Event.toTimeConditional(subEventCommand);
	const met = Game_Event.timeConditionalMet(conditional);
	if (met) return false;
	return true;
};

//#endregion
//#region src/plugins/time/core/managers/JABS_InputAdapter.js
if (J.ABS) {
	/**
	* Calls the questopedia directly on the map.
	*/
	JABS_InputAdapter.performTimeWindowAction = function() {
		if (!this._canPerformTimeWindowAction()) return;
		$gameTime.toggleMapWindow();
	};
	/**
	* Determines whether or not the player can toggle the time window.
	* @returns {boolean}
	* @private
	*/
	JABS_InputAdapter._canPerformTimeWindowAction = function() {
		return true;
	};
}

//#endregion
//#region src/plugins/time/core/objects/JABS_InputController.js
/**
* Extends {@link #update}.<br/>
* Also handles input detection for the the time window toggle shortcut key.
*/
J.TIME.Aliased.JABS_StandardController.set("update", JABS_StandardController.prototype.update);
JABS_StandardController.prototype.update = function() {
	J.TIME.Aliased.JABS_StandardController.get("update").call(this);
	this.updateTimeWindowAction();
};
/**
* Monitors and takes action based on player input regarding the time window toggle shortcut key.
*/
JABS_StandardController.prototype.updateTimeWindowAction = function() {
	if (this.isTimeWindowActionTriggered()) {
		this.performTimeWindowAction();
	}
};
/**
* Checks the inputs of the time window action.
* @returns {boolean}
*/
JABS_StandardController.prototype.isTimeWindowActionTriggered = function() {
	if (Input.isTriggered(J.ABS.EXT.INPUT.Symbols.L3)) {
		return true;
	}
	return false;
};
/**
* Executes the time window toggle action.
*/
JABS_StandardController.prototype.performTimeWindowAction = function() {
	JABS_InputAdapter.performTimeWindowAction();
};

//#endregion
//#region src/plugins/time/core/scenes/Scene_Base.js
/**
* The scenes that should not update artificial time.
*/
Scene_Base._noTimeScenes = [
	Scene_Boot,
	Scene_Splash,
	Scene_File,
	Scene_Save,
	Scene_Load,
	Scene_Title,
	Scene_Gameover
];
/**
* Extends {@link #update}.<br/>
* Also updates artificial time if it should be updated.
*/
J.TIME.Aliased.Scene_Base.set("update", Scene_Base.prototype.update);
Scene_Base.prototype.update = function() {
	J.TIME.Aliased.Scene_Base.get("update").call(this);
	if (this.shouldUpdateTime() === false) return;
	$gameTime.update();
};
/**
* Determines whether or not we should update artificial time while within the
* current scene.
* @returns {boolean}
*/
Scene_Base.prototype.shouldUpdateTime = function() {
	const checkIfNoTimeScene = (scene) => SceneManager._scene instanceof scene;
	const isOnNoTimeScene = Scene_Base._noTimeScenes.some(checkIfNoTimeScene, this) === true;
	if (isOnNoTimeScene) return false;
	const isTimeInactive = $gameTime.isActive() === false;
	if (isTimeInactive) return false;
	const isTimeBlocked = $gameTime.isBlocked() === true;
	if (isTimeBlocked) return false;
	return true;
};

//#endregion
//#region src/plugins/time/core/windows/Window_Time.js
/**
* A window class for displaying the time.
*/
var Window_Time = class extends Window_Base {
	/**
	* @constructor
	* @param {Rectangle} rect The shape representing this window.
	*/
	constructor(rect) {
		super(rect);
		this.opacity = 0;
		this.generateBackground();
		this.initMembers();
		this.refresh();
	}
	/**
	* Renders the background of the time window with what will look like a standard "dimmed" window gradient.
	*/
	generateBackground() {
		const c1 = ColorManager.dimColor1();
		const c2 = ColorManager.dimColor2();
		const x = -4;
		const y = -4;
		const w = this.contentsBack.width + 8;
		const h = this.contentsBack.height + 8;
		this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
		this.contentsBack.strokeRect(x, y, w, h, c1);
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		/**
		* The TIME rendered by this window.
		* @type {Time_Snapshot}
		*/
		this.time = null;
		/**
		* The boolean managing the alternating colon for this window.
		* @type {boolean}
		*/
		this._alternating = false;
	}
	/**
	* Gets the alternating.
	* @returns {boolean} The alternating.
	*/
	isAlternating() {
		return this._alternating;
	}
	/**
	* Sets the alternating.
	* @param {boolean} newAlternating The new alternating.
	*/
	setAlternating(newAlternating) {
		this._alternating = newAlternating;
	}
	/**
	* Toggles the alternating colon boolean.
	*/
	toggleAlternating() {
		this.setAlternating(!this.isAlternating());
	}
	/**
	* Updates the frames and refreshes the window's contents once every half second.
	*/
	update() {
		super.update();
		if (this.canUpdate()) {
			this.toggleAlternating();
			this.refresh();
			$gameTime.acknowledgeHudUpdate();
		}
	}
	/**
	* Determine if the window can be updated.
	* @returns {boolean}
	*/
	canUpdate() {
		if (!$gameTime.isActive() || $gameTime.isBlocked()) return false;
		if ($gameTime.needsHudUpdate() === false) return false;
		return true;
	}
	/**
	* Refreshes the window by clearing it and redrawing everything.
	*/
	refresh() {
		this.time = $gameTime.currentTime();
		this.redrawContent();
	}
	/**
	* Clears and redraws the contents of the window.
	*/
	redrawContent() {
		this.contents.clear();
		this.drawContent();
	}
	/**
	* Implements {@link #drawContent}.<br/>
	* Renders the TIME into the window.
	*/
	drawContent() {
		const colon1 = this.isAlternating() ? ":" : " ";
		const colon2 = this.isAlternating() ? " " : ":";
		const ampm = this.time.hours > 11 ? "PM" : "AM";
		const lh = this.lineHeight();
		const seconds = this.time.seconds.padZero(2);
		const minutes = this.time.minutes.padZero(2);
		const hours = this.time.hours.padZero(2);
		const { timeOfDayName } = this.time;
		const { timeOfDayIcon } = this.time;
		const seasonName = this.time.seasonOfTheYearName;
		const seasonIcon = this.time.seasonOfTheYearIcon;
		const days = this.time.days.padZero(2);
		const months = this.time.months.padZero(2);
		const years = this.time.years.padZero(4);
		this.drawTextEx(`\\I[2784]${hours}${colon1}${minutes}${colon2}${seconds} \\}${ampm}`, 0, lh * 0, 200);
		this.drawTextEx(`\\I[${timeOfDayIcon}]${timeOfDayName}`, 0, lh * 1, 200);
		this.drawTextEx(`\\I[${seasonIcon}]${seasonName}`, 0, lh * 2, 200);
		this.drawTextEx(`${years}/${months}/${days}`, 0, lh * 3, 200);
	}
};

//#endregion
//#region src/plugins/time/core/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map#initialize}.<br/>
* Also initializes the TIME window.
*/
J.TIME.Aliased.Scene_Map.set("initialize", Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function() {
	J.TIME.Aliased.Scene_Map.get("initialize").call(this);
	this.initTimeMembers();
};
/**
* Initializes all members related to the TIME system.
*/
Scene_Map.prototype.initTimeMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The window that displays the current time, real or artificial.
	* @type {Window_Time}
	*/
	this._j._timeWindow = null;
};
/**
* Extends {@link Scene_Map#createAllWindows}.<br/>
* Also creates the TIME window.
*/
J.TIME.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.TIME.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createTimeWindow();
};
/**
* Creates the TIME window.
*/
Scene_Map.prototype.createTimeWindow = function() {
	const window = this.buildTimeWindow();
	this.setTimeWindow(window);
	this.addWindow(window);
};
/**
* Sets up and defines the TIME window.
* @returns {Window_Time}
*/
Scene_Map.prototype.buildTimeWindow = function() {
	const rectangle = this.timeWindowRect();
	const window = new Window_Time(rectangle);
	return window;
};
/**
* Creates the rectangle representing the window for TIME.
* @returns {Rectangle}
*/
Scene_Map.prototype.timeWindowRect = function() {
	const width = 200;
	const height = 180;
	const x = J.TIME.Metadata.TimeWindowX;
	const y = J.TIME.Metadata.TimeWindowY;
	return new Rectangle(x, y, width, height);
};
/**
* Gets the currently tracked TIME window.
* @returns {Window_Time}
*/
Scene_Map.prototype.getTimeWindow = function() {
	return this._j._timeWindow;
};
/**
* Sets the currently tracked TIME window to the given window.
* @param window
*/
Scene_Map.prototype.setTimeWindow = function(window) {
	this._j._timeWindow = window;
};
/**
* Extends {@link Scene_Map#update}.<br/>
* Also updates the TIME window.
*/
J.TIME.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.TIME.Aliased.Scene_Map.get("update").call(this);
	this.updateTimeWindow();
};
/**
* Handles the updating of the TIME window.
*/
Scene_Map.prototype.updateTimeWindow = function() {
	const timeWindow = this.getTimeWindow();
	if (timeWindow === null) return;
	timeWindow.update();
	this.manageTimeVisibility();
};
/**
* Manages the visibility of the TIME window.
*/
Scene_Map.prototype.manageTimeVisibility = function() {
	const timeWindow = this.getTimeWindow();
	if ($gameTime.isMapWindowVisible()) {
		timeWindow.show();
		timeWindow.open();
	} else {
		timeWindow.close();
		timeWindow.hide();
	}
};
/**
* Extends {@link Scene_Map#onMapLoaded}.<br/>
* Also handles blocking/unblocking the flow of TIME based on the presence of tags.
*/
J.TIME.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function() {
	if (this.transfer()) {
		this.handleTimeBlock();
		$gameTime.setNeedsToneChange(true);
	}
	J.TIME.Aliased.Scene_Map.get("onMapLoaded").call(this);
};
/**
* Blocks the flow of time if the target map is tagged with the specified tag.
*/
Scene_Map.prototype.handleTimeBlock = function() {
	if ($dataMap.meta && $dataMap.meta["timeBlock"]) {
		$gameTime.block();
	} else {
		$gameTime.unblock();
	}
};

//#endregion
//#region src/plugins/time/core/windows/Window_Base.js
/**
* Extends {@link #convertEscapeCharacters}.<br/>
* Adds handling for new text codes for TIME data.
*/
J.TIME.Aliased.Window_Base.set("convertEscapeCharacters", Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text) {
	let textToModify = text;
	textToModify = this.translateSeasonOfYearTextCode(textToModify);
	textToModify = this.translateTimeOfDayTextCode(textToModify);
	textToModify = this.translateCurrentTimeTextCode(textToModify);
	return J.TIME.Aliased.Window_Base.get("convertEscapeCharacters").call(this, textToModify);
};
/**
* Translates the text code into the name and icon of the corresponding time of day.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateTimeOfDayTextCode = function(text) {
	if (!J.TIME) return text;
	return text.replace(/\\timeOfDay\[(\d+)]/gi, (_, p1) => {
		const timeOfDayId = parseInt(p1) ?? -1;
		if (timeOfDayId === -1) return text;
		const timeOfDayName = Time_Snapshot.TimesOfDayName(timeOfDayId);
		if (timeOfDayName === null) return text;
		const timeOfDayIconIndex = Time_Snapshot.TimesOfDayIcon(timeOfDayId);
		return `\\I[${timeOfDayIconIndex}]\\C[1]${timeOfDayName}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the corresponding season of year.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSeasonOfYearTextCode = function(text) {
	if (!J.TIME) return text;
	return text.replace(/\\seasonOfYear\[(\d+)]/gi, (_, p1) => {
		const seasonOfYearId = parseInt(p1) ?? -1;
		if (seasonOfYearId === -1) return text;
		const seasonOfYearName = Time_Snapshot.SeasonsName(seasonOfYearId);
		if (seasonOfYearName === null) return text;
		const seasonOfYearIconIndex = Time_Snapshot.SeasonsIconIndex(seasonOfYearId);
		return `\\I[${seasonOfYearIconIndex}]\\C[1]${seasonOfYearName}\\C[0]`;
	});
};
/**
* Translates the text code into the current time.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateCurrentTimeTextCode = function(text) {
	if (!J.TIME) return text;
	return text.replace(/\\currentTime/gi, (_) => {
		const currentTime = $gameTime.currentTime();
		const { hours, minutes, seconds } = currentTime;
		return `\\I[${currentTime.timeOfDayIcon}]\\C[1]${hours}:${minutes}:${seconds}\\C[0]`;
	});
};

//#endregion
//#region src/plugins/time/core/_metadata/pluginCommands.js
/**
* Plugin command for hiding the TIME window on the map.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "hideMapTime", () => {
	$gameTime.hideMapWindow();
});
/**
* Plugin command for showing the TIME window on the map.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "showMapTime", () => {
	$gameTime.showMapWindow();
});
/**
* Plugin command for setting the time to a new point in time.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "setTime", (args) => {
	const { Second, Minute, Hour, Day, Month, Year } = args;
	$gameTime.setTime(parseInt(Second), parseInt(Minute), parseInt(Hour), parseInt(Day), parseInt(Month), parseInt(Year));
});
/**
* Plugin command for fast-forwarding time by a designated amount.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "fastForwardtime", (args) => {
	const { Second, Minute, Hour, Day, Month, Year } = args;
	$gameTime.addSeconds(parseInt(Second));
	$gameTime.addMinutes(parseInt(Minute));
	$gameTime.addHours(parseInt(Hour));
	$gameTime.addDays(parseInt(Day));
	$gameTime.addMonths(parseInt(Month));
	$gameTime.addYears(parseInt(Year));
});
/**
* Plugin command for rewinding time by a designated amount.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "rewindTime", (args) => {
	const { Second, Minute, Hour, Day, Month, Year } = args;
	$gameTime.addSeconds(-parseInt(Second));
	$gameTime.addMinutes(-parseInt(Minute));
	$gameTime.addHours(-parseInt(Hour));
	$gameTime.addDays(-parseInt(Day));
	$gameTime.addMonths(-parseInt(Month));
	$gameTime.addYears(-parseInt(Year));
});
/**
* Plugin command for jumping to the next instance of a particular time of day.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "jumpToTimeOfDay", (args) => {
	const { TimeOfDay } = args;
	$gameTime.jumpToTimeOfDay(parseInt(TimeOfDay));
});
/**
* Plugin command for stopping artificial TIME.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "stopTime", () => {
	$gameTime.deactivate();
});
/**
* Plugin command for resuming artificial TIME.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "startTime", () => {
	$gameTime.activate();
});
/**
* Plugin command for allowing the TIME system to control the screen tone.
* Does nothing if the plugin parameters are set to disable tone changing.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "unlockTone", () => {
	$gameTime.unlockTone();
});
/**
* Plugin command for locking the TIME system from controlling screen tone.
*/
PluginManager.registerCommand(J.TIME.Metadata.name, "lockTone", () => {
	$gameTime.lockTone();
});

//#endregion
//# sourceMappingURL=J-TIME.js.map