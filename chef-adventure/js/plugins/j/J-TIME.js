//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TIME] A system for tracking time- real or artificial.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @help
 * ==============================================================================
 * This is a system that tracks time, either artificial or real, and manipulates
 * various components of the game based on the time.
 *
 * 	Temporally Integrated Monitoring of Ecosystems- aka TIME.
 *
 * ==============================================================================
 * This plugin enables a TIME system. The TIME system functions much like you'd
 * expect: it tracks TIME. This TIME however, is configurable in many ways that
 * regular time is not.
 *
 * There are two forms of time-keeping, real and artificial.
 *
 * REAL TIME
 * Real time acts much like you'd expect: it reads the client's computer's time
 * and updates every half of a second to keep in sync with real time. All of
 * the features surrounding this TIME system (relating to time of day or seasons)
 * operate the same as artificial, but based on real time.
 *
 * ARTIFICIAL TIME
 * Artificial time acts similar to real time, but instead of reading the time
 * from your computer, it starts at a designated point that you specify and ticks
 * ever forward. The rate at which time ticks forward defaults to 60 frames per
 * second, but you can reduce that if you want time to pass faster. Alternatively
 * (or in addition to), you can also adjust the amount of time that passes per
 * "tock". A "tock" is defined as "on-increment", so for example, when the second
 * counter increments past 59 to 60, you would expect the minutes to go up by 1.
 * That incrementing is a "tock", that is defined by you. You can define how much
 * that increment is for each unit of time: seconds, minutes, hours, days,
 * months, and years. I would encourage this be explored before tweaking the
 * defaults.
 *
 * VARIABLES
 * Unless disabled, both real and artificial TIME will track the various
 * components of the current TIME in variables, to allow for developing events
 * revolving around TIME. You can specify in the plugin parameters which variables
 * you want these to be assigned to. If you do not want one or more of the TIME
 * components tracked in variable, but do want to leverage the functionality of
 * variable assignment, then just assign the TIME components that you do not care
 * about to variable id of 0.
 *
 * TIME OF DAY
 * Additionally, this system tracks "time of day". "Time of Day" is defined as
 * a block of time (measured in hours) that is named.
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
 *   This sets the time to a fixed point in time. This is not relative. You will
 *   likely need to be cautious when using this particular command.
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
 *   NOTE: This is not compatible with "real" time. If you use this command with
 *   real time, it will pause the counting for the duration and pick back up
 *   with the current time when TIME is unblocked.
 *
 * - Start TIME
 *   This re-enables the flow of TIME.
 *   NOTE: This is not compatible with "real" time. If you used the stop command
 *   to halt real time, when re-enabled, it will pick up wherever it is currently
 *   which may result in skipping time.
 *
 * - Unlock Screen Tone
 *   This (re-)allows the TIME system to control screen tone.
 *   NOTE: This does nothing if the plugin parameters are set to disable screen
 *   tone changing entirely.
 *
 * - Lock Screen Tone
 *   This locks the TIME system from controlling the screen tone.
 *
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    J-TIME's initial release.
 * ==============================================================================
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
 * @desc Allows the TIME system to manage the tone of the screen based on the hour.
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
 * @desc Jumps to the next instance of a particular time of day, such as morning or night.
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
 * @desc Fast forwards time by a designated amount; only applicable to artificial time.
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
 * @desc Rewinds time by a designated amount; only applicable to artificial time.
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

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.TIME = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.TIME.Metadata = {};
J.TIME.Metadata.Version = '1.0.0';
J.TIME.Metadata.Name = `J-TIME`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.TIME.PluginParameters = PluginManager.parameters(J.TIME.Metadata.Name);
J.TIME.Metadata.TimeWindowX = Number(J.TIME.PluginParameters['timeWindowX']);
J.TIME.Metadata.TimeWindowY = Number(J.TIME.PluginParameters['timeWindowY']);

J.TIME.Metadata.StartVisible = J.TIME.PluginParameters['startVisible'] === "true";
J.TIME.Metadata.StartActivated = J.TIME.PluginParameters['startActivated'] === "true";
J.TIME.Metadata.UseRealTime = J.TIME.PluginParameters['useRealTime'] === "true";
J.TIME.Metadata.ChangeToneByTime = J.TIME.PluginParameters['changeToneByTime'] === "true";
J.TIME.Metadata.UseVariableAssignment = J.TIME.PluginParameters['useVariableAssignment'] === "true";

J.TIME.Metadata.SecondsVariable = Number(J.TIME.PluginParameters['secondsVariable']);
J.TIME.Metadata.MinutesVariable = Number(J.TIME.PluginParameters['minutesVariable']);
J.TIME.Metadata.HoursVariable = Number(J.TIME.PluginParameters['hoursVariable']);
J.TIME.Metadata.DaysVariable = Number(J.TIME.PluginParameters['daysVariable']);
J.TIME.Metadata.MonthsVariable = Number(J.TIME.PluginParameters['monthsVariable']);
J.TIME.Metadata.YearsVariable = Number(J.TIME.PluginParameters['yearsVariable']);
J.TIME.Metadata.TimeOfDayIdVariable = Number(J.TIME.PluginParameters['timeOfDayIdVariable']);
J.TIME.Metadata.TimeOfDayNameVariable = Number(J.TIME.PluginParameters['timeOfDayNameVariable']);
J.TIME.Metadata.SeasonOfYearIdVariable = Number(J.TIME.PluginParameters['seasonOfYearIdVariable']);
J.TIME.Metadata.SeasonOfYearNameVariable = Number(J.TIME.PluginParameters['seasonOfYearNameVariable']);

J.TIME.Metadata.FramesPerTick = Number(J.TIME.PluginParameters['framesPerTick']);

J.TIME.Metadata.StartingSecond = Number(J.TIME.PluginParameters['startingSecond']);
J.TIME.Metadata.StartingMinute = Number(J.TIME.PluginParameters['startingMinute']);
J.TIME.Metadata.StartingHour = Number(J.TIME.PluginParameters['startingHour']);
J.TIME.Metadata.StartingDay = Number(J.TIME.PluginParameters['startingDay']);
J.TIME.Metadata.StartingMonth = Number(J.TIME.PluginParameters['startingMonth']);
J.TIME.Metadata.StartingYear = Number(J.TIME.PluginParameters['startingYear']);

J.TIME.Metadata.SecondsPerIncrement = Number(J.TIME.PluginParameters['secondsPerIncrement']);
J.TIME.Metadata.MinutesPerIncrement = Number(J.TIME.PluginParameters['minutesPerIncrement']);
J.TIME.Metadata.HoursPerIncrement = Number(J.TIME.PluginParameters['hoursPerIncrement']);
J.TIME.Metadata.DaysPerIncrement = Number(J.TIME.PluginParameters['daysPerIncrement']);
J.TIME.Metadata.MonthsPerIncrement = Number(J.TIME.PluginParameters['monthsPerIncrement']);
J.TIME.Metadata.YearsPerIncrement = Number(J.TIME.PluginParameters['yearsPerIncrement']);

/**
 * A collection of all aliased methods for this plugin.
 */
J.TIME.Aliased = {
  DataManager: {},

  Game_Event: new Map(),
  Game_Interpreter: new Map(),

  JABS_InputController: new Map(),

  Scene_Base: {},
  Scene_Map: new Map(),

  Window_Base: new Map(),
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
J.TIME.RegExp.FullDateRangePage = /<fullDateRangePage:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])-(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])>/i


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
J.TIME.RegExp.FullDateRangeChoice = /<fullDateRangeChoice:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])-(\[\d+, ?\d+, ?\d+, ?\d+, ?\d+])>/i

/**
 * A global object for storing data related to TIME.
 * @global
 * @type {Game_Time}
 */
var $gameTime = null;
//endregion Introduction

//region plugin commands
/**
 * Plugin command for hiding the TIME window on the map.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "hideMapTime", () =>
{
  $gameTime.hideMapWindow();
});

/**
 * Plugin command for showing the TIME window on the map.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "showMapTime", () =>
{
  $gameTime.showMapWindow();
});

/**
 * Plugin command for setting the time to a new point in time.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "setTime", args =>
{
  const {
    Second,
    Minute,
    Hour,
    Day,
    Month,
    Year
  } = args;
  $gameTime.setTime(parseInt(Second), parseInt(Minute), parseInt(Hour), parseInt(Day), parseInt(Month), parseInt(Year));
});

/**
 * Plugin command for fast-forwarding time by a designated amount.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "fastForwardtime", args =>
{
  const {
    Second,
    Minute,
    Hour,
    Day,
    Month,
    Year
  } = args;
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
PluginManager.registerCommand(J.TIME.Metadata.Name, "rewindTime", args =>
{
  const {
    Second,
    Minute,
    Hour,
    Day,
    Month,
    Year
  } = args;
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
PluginManager.registerCommand(J.TIME.Metadata.Name, "jumpToTimeOfDay", args =>
{
  const { TimeOfDay } = args;
  $gameTime.jumpToTimeOfDay(parseInt(TimeOfDay));
});

/**
 * Plugin command for stopping artificial TIME.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "stopTime", () =>
{
  $gameTime.deactivate();
});

/**
 * Plugin command for resuming artificial TIME.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "startTime", () =>
{
  $gameTime.activate();
});

/**
 * Plugin command for allowing the TIME system to control the screen tone.
 * Does nothing if the plugin parameters are set to disable tone changing.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "unlockTone", () =>
{
  $gameTime.unlockTone();
});

/**
 * Plugin command for locking the TIME system from controlling screen tone.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "lockTone", () =>
{
  $gameTime.lockTone();
});
//endregion plugin commands

//region Game_Time
/**
 * A class for controlling time.
 */
function Game_Time()
{
  // initialize all the properties of TIME.
  this.initMembers();

  // update the tone for the first time.
  this.updateCurrentTone();
}

Game_Time.prototype = {};
Game_Time.prototype.constructor = Game_Time;

//region statics
/**
 * A static representation of the tones for each time of day.
 */
Game_Time.toneOfDay = {
  Night: [ -100, -100, -30, 100 ],
  Dawn: [ -30, -15, 15, 64 ],
  Morning: [ 0, 0, 0, 0 ],
  Afternoon: [ 10, 10, 10, 10 ],
  Evening: [ 0, -30, -30, -30 ],
  Twilight: [ -68, -68, 0, 68 ],
};
//endregion statics

/**
 * Initializes the members of this class.
 */
Game_Time.prototype.initMembers = function()
{
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
};

//region properties
/**
 * Gets the current tick speed.
 * @returns {number}
 */
Game_Time.prototype.getTickSpeed = function()
{
  return this._tickFrames;
};

/**
 * Sets the new tick speed to (60 / multiplier) frames per second.
 *
 * The threshold for this multiplier is `0.1` to `10.0`.
 * @param {number} flowSpeedMultiplier The new multiplier for how fast a single tick is.
 */
Game_Time.prototype.setTickSpeed = function(flowSpeedMultiplier)
{
  // localize the variable.
  let flow = flowSpeedMultiplier;

  // if the user is trying to speed it up to more than 10x, then lock it at 10x.
  if (flow > 10)
  {
    flow = 10;
  }
  // if the user is trying to reduce the speed to less than 0.1x, then lock it at 0.1x.
  else if (flow < 0.1)
  {
    flow = 0.1;
  }

  const newTickSpeed = Math.ceil(60 / flow);
  this._tickFrames = newTickSpeed;
};

/**
 * Gets whether or not the time window is visibile on the map.
 * @returns {boolean}
 */
Game_Time.prototype.isMapWindowVisible = function()
{
  return this._visible;
};

/**
 * Gets whether or not time is actively flowing right now.
 * @returns {boolean}
 */
Game_Time.prototype.isActive = function()
{
  return this._active;
};

/**
 * Deactivates TIME. Time will stop flowing if it wasn't already stopped.
 */
Game_Time.prototype.deactivate = function()
{
  this._active = false;
};

/**
 * Activates TIME. Time will now start flowing if it wasn't already started.
 */
Game_Time.prototype.activate = function()
{
  this._active = true;
};

/**
 * Gets whether or not TIME is blocked from flowing.
 * @returns {boolean}
 */
Game_Time.prototype.isBlocked = function()
{
  return this._blocked;
};

/**
 * Blocks time and prevents it from flowing regardless of previous flow.
 */
Game_Time.prototype.block = function()
{
  this._blocked = true;
};

/**
 * Unblocks time and allows it to return to it's previous flow.
 */
Game_Time.prototype.unblock = function()
{
  this._blocked = false;
};

/**
 * Gets whether or not the screen tone is currently locked from changing.
 * @returns {boolean}
 */
Game_Time.prototype.isToneLocked = function()
{
  return this._toneLocked;
};

/**
 * Locks the screen's tone, preventing it from changing by this system.
 */
Game_Time.prototype.lockTone = function()
{
  this._toneLocked = true;
};

/**
 * Unlocks the screen's tone, allowing this system to regain control over it.
 */
Game_Time.prototype.unlockTone = function()
{
  this._toneLocked = false;
};

/**
 * Hides the time window on the map.
 */
Game_Time.prototype.hideMapWindow = function()
{
  this._visible = false;
};

/**
 * Shows the time window on the map.
 */
Game_Time.prototype.showMapWindow = function()
{
  this._visible = true;
};

/**
 * Toggles the map window visibility.
 */
Game_Time.prototype.toggleMapWindow = function()
{
  if (this._visible === true)
  {
    this._visible = false;
  }
  else if (this._visible === false)
  {
    this._visible = true;
  }
};

/**
 * Flags oneself for having been updated so HUD elements can update accordingly.
 */
Game_Time.prototype.flagForHudUpdate = function()
{
  if (this._hasBeenUpdated === undefined)
  {
    this._hasBeenUpdated = true;
    console.log('hasBeenUpdated property added.');
  }

  this._hasBeenUpdated = true;
};

/**
 * Acknowledges a HUD update.
 */
Game_Time.prototype.acknowledgeHudUpdate = function()
{
  if (this._hasBeenUpdated === undefined)
  {
    this._hasBeenUpdated = false;
    console.log('hasBeenUpdated property added.');
  }

  this._hasBeenUpdated = false;
};

/**
 * Gets whether or not TIME has been updated and thus the HUD should be updated.
 * @returns {boolean}
 */
Game_Time.prototype.needsHudUpdate = function()
{
  if (this._hasBeenUpdated === undefined)
  {
    this._hasBeenUpdated = false;
    console.log('hasBeenUpdated property added.');
  }

  return this._hasBeenUpdated;
};
//endregion properties

/**
 * Updates the time when the framecount aligns with the designated tick frame count.
 */
Game_Time.prototype.update = function()
{
  // check if we can update TIME.
  if (this.canUpdateTime())
  {
    // process the TIME update.
    this.handleUpdateTime();
  }

  // check if we need to process a tone change.
  if (this.getNeedsToneChange())
  {
    // process the tone update.
    this.handleUpdateTone();
  }
};

/**
 * Determine if TIME can be updated.
 * @returns {boolean}
 */
Game_Time.prototype.canUpdateTime = function()
{
  // if the frame count is divisible cleanly by the flow of TIME, then its time to tick TIME.
  if (Graphics.frameCount % this.getTickSpeed() === 0) return true;

  // it is not time to update TIME.
  return false;
};

/**
 * Processes TIME updating.
 */
Game_Time.prototype.handleUpdateTime = function()
{
  // process time advancement.
  this.tickTime();

  // update the relevant variables- if applicable.
  this.updateVariables();

  // flag for HUD updates.
  this.flagForHudUpdate();
};

/**
 * Processes screen tone updating.
 */
Game_Time.prototype.handleUpdateTone = function()
{
  // disable the flag for tone change processing.
  this.setNeedsToneChange(false);

  // execute the tone change.
  this.processToneChange();
};

//region tone management
/**
 * Gets whether or not the screen's tone change is needed.
 * @returns {boolean}
 */
Game_Time.prototype.getNeedsToneChange = function()
{
  if (!J.TIME.Metadata.ChangeToneByTime)
  {
    return false;
  }

  // if we don't have a map to inspect, don't try to interpret it.
  if (!$dataMap || !$dataMap.meta)
  {
    console.warn("no datamap to inspect.");
    return false;
  }

  // if there is a tag on the map that specifies not to change the tone, then don't.
  if ($dataMap.meta["noToneChange"])
  {
    return false;
  }

  return this._needsToneChange;
};

/**
 * Sets whether or not the screen's tone change is needed.
 * @param {boolean} need Whether or not a tone change is needed.
 */
Game_Time.prototype.setNeedsToneChange = function(need = true)
{
  this._needsToneChange = need;
};

/**
 * Gets the current screen's tone.
 * @returns {[number, number, number, number]}
 */
Game_Time.prototype.getCurrentTone = function()
{
  return this._currentTone;
};

/**
 * Sets the current screen's tone.
 * @param {[number, number, number, number]} newTone The new tone to change to.
 */
Game_Time.prototype.setCurrentTone = function(newTone)
{
  this._currentTone = newTone;
};

/**
 * Updates the screen's tone based on the current time.
 */
Game_Time.prototype.updateCurrentTone = function()
{
  if (!this.canUpdateTone()) return;

  // if we reached this point, then grab the target tone
  const tone = this.translateHourToTone();
  if (!this.isSameTone(tone))
  {
    this.setCurrentTone(tone.clone());
    this.setNeedsToneChange(true);
  }
};

/**
 * Gets whether or not the screen's tone can be updated.
 * @returns {boolean}
 */
Game_Time.prototype.canUpdateTone = function()
{
  // if the user decided they never want to update tones, then don't force them.
  if (!J.TIME.Metadata.ChangeToneByTime)
  {
    return false;
  }

  // if the tone is locked for control reasons, then don't update it.
  if (this.isToneLocked())
  {
    return false;
  }

  return true;
};

/**
 * Determines the tone associated with the current hour of the day.
 * Tone is represented as whole numbers in an array: `[red, green, blue, grey]`.
 * For example: `[100, -50, 0, 0]`. `Grey` must be between 0 and 255, while the rest can
 * be between -255 and 255.
 * @returns {[number, number, number, number]}
 */
Game_Time.prototype.translateHourToTone = function()
{
  const hours = J.TIME.Metadata.UseRealTime
    ? new Date().getHours()
    : this._hours;
  let tone = [ 0, 0, 0, 0 ];
  switch (hours)
  {
    case  0: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.25);
      break;
    case  1: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.50);
      break;
    case  2: // night
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Twilight, Game_Time.toneOfDay.Night, 0.75);
      break;
    case  3: // night
      tone = Game_Time.toneOfDay.Night;
      break;
    case  4: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.25);
      break;
    case  5: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.50);
      break;
    case  6: // dawn
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Night, Game_Time.toneOfDay.Dawn, 0.75);
      break;
    case  7: // dawn
      tone = Game_Time.toneOfDay.Dawn;
      break;
    case  8: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.25);
      break;
    case  9: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.50);
      break;
    case 10: // morning
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Dawn, Game_Time.toneOfDay.Morning, 0.75);
      break;
    case 11: // morning
      tone = Game_Time.toneOfDay.Morning;
      break;
    case 12: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.25);
      break;
    case 13: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.50);
      break;
    case 14: // afternoon
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Morning, Game_Time.toneOfDay.Afternoon, 0.75);
      break;
    case 15: // afternoon
      tone = Game_Time.toneOfDay.Afternoon;
      break;
    case 16: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.25);
      break;
    case 17: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.50);
      break;
    case 18: // evening
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Afternoon, Game_Time.toneOfDay.Evening, 0.75);
      break;
    case 19: // evening
      tone = Game_Time.toneOfDay.Evening;
      break;
    case 20: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.25);
      break;
    case 21: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.50);
      break;
    case 22: // twilight
      tone = this.toneBetweenTones(Game_Time.toneOfDay.Evening, Game_Time.toneOfDay.Twilight, 0.75);
      break;
    case 23: // twilight
      tone = Game_Time.toneOfDay.Twilight;
      break;
  }

  return tone;
};

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
Game_Time.prototype.toneBetweenTones = function(tone1, tone2, rate)
{
  const diff = (a, b) => a > b
    ? a - b
    : b - a;
  const newTone = [];
  tone1.forEach((color1, index) =>
  {
    const color2 = tone2[index];
    const diffToNext = diff(color1, color2);
    const partial = Math.round(diffToNext * rate);
    const newRgbValue = color2 > color1
      ? color1 + partial
      : color1 - partial;
    newTone.push(newRgbValue);
  });

  return newTone;
};

/**
 * Compares the current tone with a target tone to see if they are the same.
 * @param {[number, number, number, number]} targetTone
 * @returns {boolean}
 */
Game_Time.prototype.isSameTone = function(targetTone)
{
  if (this._currentTone.length < 4) return false;

  // individually compare each of the RGBA elements with the new tone's elements.
  if (this._currentTone[0] !== targetTone[0]) return false;
  if (this._currentTone[1] !== targetTone[1]) return false;
  if (this._currentTone[2] !== targetTone[2]) return false;
  if (this._currentTone[3] !== targetTone[3]) return false;

  return true;
};

/**
 * Processes the screen's tone change.
 * @param {boolean} skip If true, then there will be no transition time. Defaults to false.
 */
Game_Time.prototype.processToneChange = function(skip = false)
{
  if (skip)
  {
    $gameScreen.startTint(this._currentTone, 1);
  }
  else
  {
    $gameScreen.startTint(this._currentTone, 300);
  }
};
//endregion tone management

//region time management
/**
 * Gets a snapshot of the current time.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.currentTime = function()
{
  // return the snapshot.
  return this.getTimeSnapshot();
};

/**
 * Gets the {@link Time_Snapshot} based on mode of time configured.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.getTimeSnapshot = function()
{
  // check if we're using real or artificial time.
  if (J.TIME.Metadata.UseRealTime)
  {
    // render a realtime snapshot.
    return this.determineRealTime();
  }
  // we're using artificial time.
  else
  {
    // render the artificial snapshot.
    return this.determineArtificialTime();
  }
};

/**
 * Builds a snapshot of the time designated by the array of numbers.
 * @param {[number, number, number, number, number, number]} fromArray The six-length array of numbers
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.toTimeSnapshot = function(fromArray)
{
  const [ seconds, minutes, hours, days, months, years ] = fromArray;
  const timeOfDayId = this.timeOfDay(hours);
  const seasonOfYearId = this.seasonOfYear(months);
  return new Time_Snapshot(
    seconds,
    minutes,
    hours,
    days,
    months,
    years,
    timeOfDayId,
    seasonOfYearId);
};

/**
 * Assigns the current time to the designated variables.
 */
Game_Time.prototype.updateVariables = function()
{
  // if they haven't chosen to use variable assignment, then don't do that.
  if (!J.TIME.Metadata.UseVariableAssignment) return;

  // grab the current time's snapshot.
  const timeSnapshot = this.getTimeSnapshot();

  // also update the variables with the current time snapshot.
  this.updateVariablesBySnapshot(timeSnapshot);
};

/**
 * Update the variables for TIME based on a {@link Time_Snapshot}.
 * @param {Time_Snapshot} timeSnapshot The snapshot of TIME to update variables with.
 */
Game_Time.prototype.updateVariablesBySnapshot = function(timeSnapshot)
{
  // if they haven't chosen to use variable assignment, then don't do that.
  if (!J.TIME.Metadata.UseVariableAssignment) return;

  // assign all them values to their variables.
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
};

/**
 * Gets a snapshot of the current time that is artificial.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.determineArtificialTime = function()
{
  const timeOfDayId = this.timeOfDay(this._hours);
  const seasonOfYearId = this.seasonOfYear(this._months);
  return new Time_Snapshot(
    this._seconds,
    this._minutes,
    this._hours,
    this._days,
    this._months,
    this._years,
    timeOfDayId,
    seasonOfYearId);
};

/**
 * Gets a snapshot of the current time in the real world.
 * @returns {Time_Snapshot}
 */
Game_Time.prototype.determineRealTime = function()
{
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1; //? returns 0-11 for some reason instead of 1-12.
  const years = date.getFullYear();
  const timeOfDayId = this.timeOfDay(hours);
  const seasonOfYearId = this.seasonOfYear(months);
  return new Time_Snapshot(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId);
};

/**
 * Translates the current hour into the time of the day id.
 * @returns {number}
 */
Game_Time.prototype.timeOfDay = function(hours)
{
  switch (true)
  {
    case (hours <= 3):
      return 0;
    case (hours > 3 && hours <= 7):
      return 1;
    case (hours > 7 && hours <= 11):
      return 2;
    case (hours > 11 && hours <= 15):
      return 3;
    case (hours > 15 && hours <= 19):
      return 4;
    case (hours > 19):
      return 5;
    default:
      return -1;
  }
};

/**
 * Determines when the (hour) start of a given time of day is.
 * @param {number} timeOfDayId The id of the time of day.
 * @returns
 */
Game_Time.prototype.startOfTimeOfDay = function(timeOfDayId)
{
  return (timeOfDayId * 4);
};

/**
 * Translates the current month into the season of the year id.
 * @returns {number}
 */
Game_Time.prototype.seasonOfYear = function(months)
{
  const springMonths = [ 3, 4, 5 ];
  const summerMonths = [ 6, 7, 8 ];
  const autumnMonths = [ 9, 10, 11 ];
  const winterMonths = [ 1, 2, 12 ];
  switch (true)
  {
    case (springMonths.includes(months)):
      return 0;
    case (summerMonths.includes(months)):
      return 1;
    case (autumnMonths.includes(months)):
      return 2;
    case (winterMonths.includes(months)):
      return 3;
    default:
      return -1;
  }
};

/**
 * Sets the time to a fixed point.
 * @param {number} seconds The new second.
 * @param {number} minutes The new minute.
 * @param {number} hours The new hour.
 * @param {number} days The new day.
 * @param {number} months The new month.
 * @param {number} years The new year.
 */
Game_Time.prototype.setTime = function(seconds, minutes, hours, days, months, years)
{
  // don't actually set time if using real time, it'll just get reset in 0.5 seconds.
  if (J.TIME.Metadata.UseRealTime) return;

  this._seconds = seconds;
  this._minutes = minutes;
  this._hours = hours;
  this._days = days;
  this._months = months;
  this._years = years;
};

/**
 * Fast forwards to the next instance of a specific time of day.
 *
 * If the current time of day IS the target time of day, it will instead skip
 * to the following day's time of day.
 * @param {number} targetTimeOfDayId The target time of day's id.
 */
Game_Time.prototype.jumpToTimeOfDay = function(targetTimeOfDayId)
{
  const currentTimeOfDay = this.timeOfDay(this._hours);
  let timeUntilTargetTimeOfDay = 0;

  if (currentTimeOfDay >= targetTimeOfDayId)
  {
    const timeToEndOfDay = 24 - this._hours;
    const startingHourTargetTimeOfday = this.startOfTimeOfDay(targetTimeOfDayId);
    timeUntilTargetTimeOfDay = timeToEndOfDay + startingHourTargetTimeOfday
  }
  else
  {
    const startingHourTargetTimeOfday = this.startOfTimeOfDay(targetTimeOfDayId);
    timeUntilTargetTimeOfDay = startingHourTargetTimeOfday - this._hours;
  }

  this.addHours(timeUntilTargetTimeOfDay);
  this._seconds = 0;
  this._minutes = 0;
};

/**
 * Executes the progression of time automatically. Adds the default amount of seconds
 * to the current time with every tick. This function was designed to emulate the ticking
 * of the second hand, but if the defaults are changed, it can tick multiple seconds or
 * even multiple minutes per tick.
 */
Game_Time.prototype.tickTime = function()
{
  this.addSeconds();
};
//endregion time management

//region add time
/**
 * Ticks the second counter up by a designated amount.
 * @param {number} seconds The number of seconds to tick.
 */
Game_Time.prototype.addSeconds = function(seconds = this._secondsPerTick)
{
  // check how many seconds we have when adding the tick amount.
  let potentialSeconds = this._seconds + seconds;

  // if we have greater than or equal to 60...
  if (potentialSeconds >= 60)
  {
    // ...keep adding minutes until we're below 60 seconds.
    while (potentialSeconds >= 60)
    {
      this.addMinutes(this._minutesPerTick);
      potentialSeconds -= 60;
    }

    // and reassign the seconds.
    this._seconds = potentialSeconds;
    // if we don't have more than 60, just add the seconds on.
  }
  else
  {
    this._seconds += seconds;
  }
};

/**
 * Ticks the minute counter up by a designated amount.
 * @param {number} minutes The number of minutes to tick.
 */
Game_Time.prototype.addMinutes = function(minutes = this._minutesPerTick)
{
  this.updateCurrentTone();
  let potentialMinutes = this._minutes + minutes;
  if (potentialMinutes >= 60)
  {
    while (potentialMinutes >= 60)
    {
      this.addHours(this._hoursPerDay);
      potentialMinutes -= 60;
    }

    this._minutes = potentialMinutes;
  }
  else
  {
    this._minutes += minutes;
  }
};

/**
 * Ticks the hour counter up by a designated amount.
 * @param {number} hours The number of hours to tick.
 */
Game_Time.prototype.addHours = function(hours = this._hoursPerTick)
{
  let potentialHours = this._hours + hours;
  if (potentialHours >= 24)
  {
    while (potentialHours >= 24)
    {
      this.addDays(this._daysPerTick);
      potentialHours -= 24;
    }

    this._hours = potentialHours;
  }
  else
  {
    this._hours += hours;
  }
};

/**
 * Ticks the days counter up by a designated amount.
 * @param {number} days The number of days to tick.
 */
Game_Time.prototype.addDays = function(days = this._daysPerTick)
{
  let potentialDays = this._days + days;
  if (potentialDays > 30)
  {
    while (potentialDays > 30)
    {
      this.addMonths(this._monthsPerTick);
      potentialDays -= 30;
    }

    this._days = potentialDays;
  }
  else
  {
    this._days += days;
  }
};

/**
 * Ticks the months counter up by a designated amount.
 * @param {number} months The number of months to tick.
 */
Game_Time.prototype.addMonths = function(months = this._monthsPerTick)
{
  let potentialMonths = this._months + months;
  if (potentialMonths > 12)
  {
    while (potentialMonths > 12)
    {
      this.addYears(this._yearsPerTick);
      potentialMonths -= 12;
    }

    this._months = potentialMonths;
  }
  else
  {
    this._months += months;
  }
};

/**
 * Ticks the years counter up by a designated amount.
 * @param {number} years The number of years to tick.
 */
Game_Time.prototype.addYears = function(years = this._yearsPerTick)
{
  this._years += years;
};
//endregion add time

//endregion Game_Time

//region Time_Snapshot
/**
 * A class representing a snapshot in time of a moment.
 */
class Time_Snapshot
{
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
  constructor(seconds, minutes, hours, days, months, years, timeOfDayId, seasonOfYearId)
  {
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
  };

  //region statics
  /**
   * Translates the numeric season of the year into it's proper name.
   * @param {number} seasonId The numeric representation of the season of the year.
   * @returns {string}
   */
  static SeasonsName(seasonId)
  {
    switch (seasonId)
    {
      case 0:
        return "Spring";
      case 1:
        return "Summer";
      case 2:
        return "Autumn";
      case 3:
        return "Winter";
      default:
        console.error(`${seasonId} is not a valid season id.`);
        return null;
    }
  };

  /**
   * Translates the numeric season of the year into it's icon index.
   * @param {number} seasonId The numeric representation of the season of the year.
   * @returns {string}
   */
  static SeasonsIconIndex(seasonId)
  {
    switch (seasonId)
    {
      case 0:
        return 887;
      case 1:
        return 888;
      case 2:
        return 889;
      case 3:
        return 890;
      default:
        return `${seasonId} is not a valid season id.`;
    }
  };

  /**
   * Translates the name of the season into its id.
   * @param {string} seasonName The name of the season.
   * @returns {number}
   */
  static SeasonsId(seasonName)
  {
    switch (seasonName.toLowerCase())
    {
      case "spring":
        return 0;
      case "summer":
        return 1;
      case "autumn":
      case "fall":
        return 2;
      case "winter":
        return 3;
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
  static TimesOfDayName(timeOfDayId)
  {
    switch (timeOfDayId)
    {
      case 0:
        return "Night";     // midnight-4am aka 0-4
      case 1:
        return "Dawn";      // 4am-8am aka 4-8
      case 2:
        return "Morning";   // 8am-noon aka 8-12
      case 3:
        return "Afternoon"; // noon-4pm aka 12-16
      case 4:
        return "Evening";   // 4pm-8pm aka 16-20
      case 5:
        return "Twilight";  // 8pm-midnight aka 20-2359
      default:
        console.error(`${timeOfDayId} is not a valid time of day id.`);
        return null;
    }
  };

  /**
   * Translates the numeric time of the day into it's icon index.
   * @param {number} timeOfDayId The numeric representation of the time of the day.
   * @returns {string}
   */
  static TimesOfDayIcon(timeOfDayId)
  {
    switch (timeOfDayId)
    {
      case 0:
        return 2256;  // midnight-4am
      case 1:
        return 2260;  // 4am-8am
      case 2:
        return 2261;  // 8am-noon
      case 3:
        return 2261;  // noon-4pm
      case 4:
        return 2257;  // 4pm-8pm
      case 5:
        return 2256;  // 8pm-midnight
      default:
        return `${timeOfDayId} is not a valid time of day id.`;
    }
  };

  /**
   * Translates the name of a time of the day into its id.
   * @param {string} timeOfDayString The name of the time of the day.
   * @returns {number}
   */
  static TimesOfDayId(timeOfDayString)
  {
    switch (timeOfDayString.toLowerCase())
    {
      case "night":
        return 0;     // midnight-4am
      case "dawn":
        return 1;      // 4am-8am
      case "morning":
        return 2;   // 8am-noon
      case "afternoon":
        return 3; // noon-4pm
      case "evening":
        return 4;   // 4pm-8pm
      case "twilight":
        return 5;  // 8pm-midnight
      default:
        console.error(`${timeOfDayString} is not a valid time of day name.`);
        return -1;
    }
  }

  //endregion statics

  /**
   * Gets the name of the current season of the year.
   * @type {string}
   */
  get seasonOfTheYearName()
  {
    return Time_Snapshot.SeasonsName(this._seasonOfYearId);
  };

  /**
   * Gets the icon index of the current season of the year.
   * @type {number}
   */
  get seasonOfTheYearIcon()
  {
    return Time_Snapshot.SeasonsIconIndex(this._seasonOfYearId);
  };

  /**
   * Gets the name of the current time of the day.
   * @type {string}
   */
  get timeOfDayName()
  {
    return Time_Snapshot.TimesOfDayName(this._timeOfDayId);
  };

  /**
   * Gets the icon index of the current time of the day.
   * @type {number}
   */
  get timeOfDayIcon()
  {
    return Time_Snapshot.TimesOfDayIcon(this._timeOfDayId);
  };

  /**
   * Determines if this {@link Time_Snapshot} is effectively the same as the provided snapshot.<br/>
   * "Effectively the same" translates to "all time properties are the same from seconds to years" as the target.
   * @param {Time_Snapshot} snapshot The target snapshot to compare equality against.
   * @returns {boolean} True if this snapshot is effectively the same, false otherwise.
   */
  equals(snapshot)
  {
    // if any of the properties don't match, then it isn't equal to the target.
    if (this.years !== snapshot.years) return false;
    if (this.months !== snapshot.months) return false;
    if (this.days !== snapshot.days) return false;
    if (this.hours !== snapshot.hours) return false;
    if (this.minutes !== snapshot.minutes) return false;
    if (this.seconds !== snapshot.seconds) return false;

    // it must be equal!
    return true;
  }

  /**
   * Determines if this {@link Time_Snapshot} is after the provided snapshot.
   * @param {Time_Snapshot} snapshot The target snapshot to see if this snapshot is after.
   * @returns {boolean} True if this snapshot is after the target, false otherwise.
   */
  isAfter(snapshot)
  {
    // NOTE: for using Date objects, the months value is the index, but we use it as the literal month value.
    const thisDate = new Date(this.years, this.months-1, this.days, this.hours, this.minutes, this.seconds);
    const targetDate = new Date(snapshot.years, snapshot.months-1, snapshot.days, snapshot.hours, snapshot.minutes, snapshot.seconds);

    return thisDate > targetDate;
  }

  /**
   * Determines if this {@link Time_Snapshot} is before the provided snapshot.
   * @param {Time_Snapshot} snapshot The target snapshot to see if this snapshot is before.
   * @returns {boolean} True if this snapshot is before the target, false otherwise.
   */
  isBefore(snapshot)
  {
    // NOTE: for using Date objects, the months value is the index, but we use it as the literal month value.
    const thisDate = new Date(this.years, this.months-1, this.days, this.hours, this.minutes, this.seconds);
    const targetDate = new Date(snapshot.years, snapshot.months-1, snapshot.days, snapshot.hours, snapshot.minutes, snapshot.seconds);

    return thisDate < targetDate;
  }

  /**
   * Determines of this {@link Time_Snapshot} is between the two provided snapshots.
   * @param {Time_Snapshot} start The starting snapshot to check betweenness against.
   * @param {Time_Snapshot} end The ending snapshot to check betweenness against.
   * @param {boolean} [startInclusive=false] Whether or not to include the start time as "between"; defaults to false.
   * @param {boolean} [endInclusive=false] Whether or not to include the end time as "between"; defaults to false.
   */
  isBetweenSnapshots(start, end, startInclusive = false, endInclusive = false)
  {
    // check if this snapshot is after the start.
    const isAfterStart = this.isAfter(start) || (startInclusive && this.equals(start));

    // if this snapshot isn't after the start, then it is not between.
    if (!isAfterStart) return false;

    // check if this snapshot is before the end.
    const isBeforeEnd = this.isBefore(end) || (endInclusive && this.equals(end));

    // if this snapshot isn't before the end, then it is not between.
    if (!isBeforeEnd) return false;

    // this snapshot is between the start and end!
    return true;
  }

  /**
   * Determines whether or not this {@link Time_Snapshot} is between the given start and end {@link Date}s.
   * @param {Date} start The start date.
   * @param {Date} end The end date.
   * @param {boolean} [startInclusive=false] Whether or not to include the start time as "between"; defaults to false.
   * @param {boolean} [endInclusive=false] Whether or not to include the end time as "between"; defaults to false.
   */
  isBetweenDates(start, end, startInclusive = false, endInclusive = false)
  {
    const startTimeSnapshot = this.#dateToSnapshot(start);
    const endTimeSnapshot = this.#dateToSnapshot(end);

    return this.isBetweenSnapshots(startTimeSnapshot, endTimeSnapshot, startInclusive, endInclusive);
  }

  /**
   * Maps a {@link Date} to a {@link Time_Snapshot}.
   * @param {Date} date The date to map to a {@link Time_Snapshot}.
   * @returns {Time_Snapshot} The mapped snapshot.
   */
  #dateToSnapshot(date)
  {
    const dateTimeOfDay = $gameTime.timeOfDay(date.getHours());
    const seasonOfYear = $gameTime.seasonOfYear(date.getMonth() + 1);
    return new Time_Snapshot(
      date.getSeconds(),
      date.getMinutes(),
      date.getHours(),
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
      dateTimeOfDay,
      seasonOfYear)
  }
}

//endregion Time_Snapshot

class TimeConditional
{
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
}

//region DataManager
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.TIME.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.TIME.Aliased.DataManager.createGameObjects.call(this);
  $gameTime = new Game_Time();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.TIME.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function()
{
  const contents = J.TIME.Aliased.DataManager.makeSaveContents.call(this);
  contents.time = $gameTime;
  return contents;
};

/**
 * Extends the save content extraction to include extracting JAFTING data.
 *
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 */
J.TIME.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  J.TIME.Aliased.DataManager.extractSaveContents2.call(this, contents);
  $gameTime = contents.time;
  if (!$gameTime)
  {
    $gameTime = new Game_Time();
    console.info('J-Time did not exist in the loaded save file- creating anew.');
  }
};
//endregion DataManager

//region JABS_InputAdapter
// only setup this shortcut key if we're using JABS.
if (J.ABS)
{
  /**
   * Calls the questopedia directly on the map.
   */
  JABS_InputAdapter.performTimeWindowAction = function()
  {
    // if we cannot toggle the time window, then do not.
    if (!this._canPerformTimeWindowAction()) return;

    // call up the menu.
    $gameTime.toggleMapWindow();
  };

  /**
   * Determines whether or not the player can toggle the time window.
   * @returns {boolean}
   * @private
   */
  JABS_InputAdapter._canPerformTimeWindowAction = function()
  {
    // TODO: check if the time window can be toggled.
    return true;
  };
}
//endregion JABS_InputAdapter

//region Game_Event
/**
 * Extends {@link meetsConditions}.<br/>
 * Also includes the custom conditions that relate to time.
 * @param {any} page
 * @returns {boolean}
 */
J.TIME.Aliased.Game_Event.set('meetsConditions', Game_Event.prototype.meetsConditions);
Game_Event.prototype.meetsConditions = function(page)
{
  // check original conditions.
  const metOtherPageConditions = J.TIME.Aliased.Game_Event.get('meetsConditions')
    .call(this, page);

  // if other conditions aren't met, then TIME conditions don't override that.
  if (!metOtherPageConditions) return false;

  // grab the list of valid comments.
  const commentCommandList = Game_Event.getValidCommentCommandsFromPage(page);

  // there aren't any comments on this event at all.
  if (commentCommandList.length === 0) return true;

  // gather all conditional comments from the comment commands of this event.
  const timeConditionals = Game_Event.toTimeConditionals(commentCommandList);

  // if there are none, then this event is fine to proceed!
  if (timeConditionals.length === 0) return true;

  // determine if all the TIME conditionals are satisfied.
  return timeConditionals.every(Game_Event.timeConditionalMet, this);
};

/**
 * Filters the comment commands to only TIME conditionals- should any exist in the collection.
 * @param {rm.types.EventCommand[]} commentCommandList The comment commands to potentially convert to conditionals.
 * @returns {TimeConditional[]}
 */
Game_Event.toTimeConditionals = function(commentCommandList)
{
  // gather all TIME comments from the comment commands of this event.
  const timeCommentComands = commentCommandList
    .filter(Game_Event.filterCommentCommandsByEventTimeConditional, this);

  // if there are no TIME conditionals available for parsing, don't bother.
  if (timeCommentComands.length === 0) return [];

  // map all the TIME conditionals from the parsed regex.
  return timeCommentComands.map(Game_Event.toTimeConditional, this);
};

/**
 * A filter function for only including comment event commands relevant to TIME.
 * @param {rm.types.EventCommand} command The command being evaluated.
 * @returns {boolean}
 */
Game_Event.filterCommentCommandsByEventTimeConditional = function(command)
{
  // identify the actual comment being evaluated.
  const [ comment, ] = command.parameters;

  // in case the command isn't even valid for comment-validation.
  if (!comment) return false;

  // extract the types of regex we will be considering.
  const {
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
    FullDateRangePage,
  } = J.TIME.RegExp;
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
    FullDateRangePage, ].some(regex => regex.test(comment));
};

/**
 * A filter function for only including comment event commands relevant to TIME.
 * @param {rm.types.EventCommand} command The command being evaluated.
 * @returns {boolean}
 */
Game_Event.filterCommentCommandsByChoiceTimeConditional = function(command)
{
  // identify the actual comment being evaluated.
  const [ comment, ] = command.parameters;

  // in case the command isn't even valid for comment-validation.
  if (!comment) return false;

  // extract the types of regex we will be considering.
  const {
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
    FullDateRangeChoice,
  } = J.TIME.RegExp;
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
    FullDateRangeChoice, ].some(regex => regex.test(comment));
};

/**
 * Converts a known comment event command into a conditional for TIME control.
 * @param {rm.types.EventCommand} commentCommand The comment command to parse into a conditional.
 * @returns {TimeConditional}
 */
Game_Event.toTimeConditional = function(commentCommand)
{
  // shorthand the comment into a variable.
  const [ comment, ] = commentCommand.parameters;

  // use a switch block to identify which RegExp should be used to populate the conditional.
  switch (true)
  {
    //region events
    // FOR WHOLE EVENTS:
    case J.TIME.RegExp.MinutePage.test(comment):
      return TimeMapper.minuteToConditional(comment, J.TIME.RegExp.MinutePage);
    case J.TIME.RegExp.HourPage.test(comment):
      return TimeMapper.hourToConditional(comment, J.TIME.RegExp.HourPage);
    case J.TIME.RegExp.DayPage.test(comment):
      return TimeMapper.dayToConditional(comment, J.TIME.RegExp.DayPage);
    case J.TIME.RegExp.MonthPage.test(comment):
      return TimeMapper.monthToConditional(comment, J.TIME.RegExp.MonthPage);
    case J.TIME.RegExp.YearPage.test(comment):
      return TimeMapper.yearToConditional(comment, J.TIME.RegExp.YearPage);
    case J.TIME.RegExp.TimeOfDayPage.test(comment):
      return TimeMapper.timeOfDayToConditional(comment, J.TIME.RegExp.TimeOfDayPage);
    case J.TIME.RegExp.SeasonOfYearPage.test(comment):
      return TimeMapper.seasonOfYearToConditional(comment, J.TIME.RegExp.SeasonOfYearPage);
    case J.TIME.RegExp.TimeRangePage.test(comment):
      return TimeMapper.timeRangeToConditional(comment, J.TIME.RegExp.TimeRangePage);
    case J.TIME.RegExp.FullDateRangePage.test(comment):
      return TimeMapper.fullDateRangeToConditional(comment, J.TIME.RegExp.FullDateRangePage);
    case J.TIME.RegExp.MinuteRangePage.test(comment):
      return TimeMapper.minuteRangeToConditional(comment, J.TIME.RegExp.MinuteRangePage);
    case J.TIME.RegExp.HourRangePage.test(comment):
      return TimeMapper.hourRangeToConditional(comment, J.TIME.RegExp.HourRangePage);
    case J.TIME.RegExp.DayRangePage.test(comment):
      return TimeMapper.dayRangeToConditional(comment, J.TIME.RegExp.DayRangePage);
    case J.TIME.RegExp.MonthRangePage.test(comment):
      return TimeMapper.monthRangeToConditional(comment, J.TIME.RegExp.MonthRangePage);
    case J.TIME.RegExp.YearRangePage.test(comment):
      return TimeMapper.yearRangeToConditional(comment, J.TIME.RegExp.YearRangePage);
    //endregion events

    //region choices
    // JUST FOR CHOICES:
    case J.TIME.RegExp.MinuteChoice.test(comment):
      return TimeMapper.minuteToConditional(comment, J.TIME.RegExp.MinuteChoice);
    case J.TIME.RegExp.HourChoice.test(comment):
      return TimeMapper.hourToConditional(comment, J.TIME.RegExp.HourChoice);
    case J.TIME.RegExp.DayChoice.test(comment):
      return TimeMapper.dayToConditional(comment, J.TIME.RegExp.DayChoice);
    case J.TIME.RegExp.MonthChoice.test(comment):
      return TimeMapper.monthToConditional(comment, J.TIME.RegExp.MonthChoice);
    case J.TIME.RegExp.YearChoice.test(comment):
      return TimeMapper.yearToConditional(comment, J.TIME.RegExp.YearChoice);
    case J.TIME.RegExp.TimeOfDayChoice.test(comment):
      return TimeMapper.timeOfDayToConditional(comment, J.TIME.RegExp.TimeOfDayChoice);
    case J.TIME.RegExp.SeasonOfYearChoice.test(comment):
      return TimeMapper.seasonOfYearToConditional(comment, J.TIME.RegExp.SeasonOfYearChoice);
    case J.TIME.RegExp.TimeRangeChoice.test(comment):
      return TimeMapper.timeRangeToConditional(comment, J.TIME.RegExp.TimeRangeChoice);
    case J.TIME.RegExp.FullDateRangeChoice.test(comment):
      return TimeMapper.fullDateRangeToConditional(comment, J.TIME.RegExp.FullDateRangeChoice);
    case J.TIME.RegExp.MinuteRangeChoice.test(comment):
      return TimeMapper.minuteRangeToConditional(comment, J.TIME.RegExp.MinuteRangeChoice);
    case J.TIME.RegExp.HourRangeChoice.test(comment):
      return TimeMapper.hourRangeToConditional(comment, J.TIME.RegExp.HourRangeChoice);
    case J.TIME.RegExp.DayRangeChoice.test(comment):
      return TimeMapper.dayRangeToConditional(comment, J.TIME.RegExp.DayRangeChoice);
    case J.TIME.RegExp.MonthRangeChoice.test(comment):
      return TimeMapper.monthRangeToConditional(comment, J.TIME.RegExp.MonthRangeChoice);
    case J.TIME.RegExp.YearRangeChoice.test(comment):
      return TimeMapper.yearRangeToConditional(comment, J.TIME.RegExp.YearRangeChoice);
    //endregion choices

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
Game_Event.timeConditionalMet = function(timeConditional)
{
  // if this is a full date range, then use the full date range checking functionality.
  if (timeConditional.isFullDateRange) return Game_Event._timeConditionalFullDateRangeMet(timeConditional);

  // if this is a time range, then use the time range checking functionality.
  if (timeConditional.isTimeRange) return Game_Event._timeConditionalTimeRangeMet(timeConditional);

  // otherwise, use the direct checking.
  return Game_Event._timeConditionalDirectMet(timeConditional);
};

/**
 * Determines if the conditional comparison was equal.
 * @param {TimeConditional} timeConditional
 * @returns {boolean}
 * @private
 */
Game_Event._timeConditionalDirectMet = function(timeConditional)
{
  // grab the current time snapshot.
  const currentTime = $gameTime.currentTime();

  // extract the various data points from the conditional.
  const {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    timeOfDay,
    seasonOfYear,
  } = timeConditional;

  // validate if the data points are something other than -1, that they match.
  if (years !== -1 && years !== currentTime.years) return false;
  if (months !== -1 && months !== currentTime.months) return false;
  if (days !== -1 && days !== currentTime.days) return false;
  if (hours !== -1 && hours !== currentTime.hours) return false;
  if (minutes !== -1 && minutes !== currentTime.minutes) return false;
  if (seconds !== -1 && seconds !== currentTime.seconds) return false;
  if (timeOfDay !== -1 && timeOfDay !== currentTime._timeOfDayId) return false;
  if (seasonOfYear !== -1 && seasonOfYear !== currentTime._seasonOfYearId) return false;

  // everything that isn't -1 must match, so conditional met!
  return true;
};

/**
 * Determines if the current time was within the conditional time range.
 * @param {TimeConditional} timeConditional
 * @returns {boolean}
 * @private
 */
Game_Event._timeConditionalTimeRangeMet = function(timeConditional)
{
  // grab the current time snapshot.
  const {
    years,
    months,
    days
  } = $gameTime.currentTime();

  // extract the start and end ranges for time comparison.
  const {
    startRange,
    endRange
  } = timeConditional;

  // identify the hour markers.
  const startHour = startRange.at(0);
  const endHour = endRange.at(0);

  // if the end hour is less than the starting hour, then its intended to be overnight.
  const isOvernight = startHour > endHour;

  // identify the minute markers.
  const startMinute = startRange.at(1);
  const endMinute = endRange.at(1);

  // if the end minute is less than the starting minute, then its intended to be the next hour.
  const isOverhour = startMinute > endMinute;

  // build a starting date based on the "start" time.
  const fakeStartTimeArray = [ years, months - 1, days, startHour, startMinute, 0 ];
  const fakeStartDate = new Date(...fakeStartTimeArray);

  // build an ending date based on "end" time.
  const fakeEndTimeArray = [ years, months - 1, days, endHour, endMinute, 0 ];
  const fakeEndDate = new Date(...fakeEndTimeArray);

  // if the time difference translates to overnight, then add a day.
  if (isOvernight)
  {
    fakeEndDate.addDays(1);
  }

  // if the time difference translates to the next hour, then add an hour.
  if (isOverhour)
  {
    fakeEndDate.addHours(1);
  }

  // if we are not within the range of the projected start and end dates, then we did not meet the conditional.
  if (!$gameTime.currentTime()
    .isBetweenDates(fakeStartDate, fakeEndDate))
  {
    return false;
  }

  // we are within range!
  return true;
};

/**
 * Determines if the current full date time was within the conditional full date time range.
 * @param {TimeConditional} timeConditional
 * @returns {boolean}
 * @private
 */
Game_Event._timeConditionalFullDateRangeMet = function(timeConditional)
{
  // grab the current time snapshot.
  const currentSnapshot = $gameTime.currentTime();

  // build snapshots based on the start and end range.
  const startSnapshot = $gameTime.toTimeSnapshot(timeConditional.startRange);
  const endSnapshot = $gameTime.toTimeSnapshot(timeConditional.endRange);

  return currentSnapshot.isBetweenSnapshots(startSnapshot, endSnapshot);
};
//endregion Game_Event

//region Game_Interpreter
/**
 * Extends {@link shouldHideChoiceBranch}.<br/>
 * Includes possibility of hiding time-related options.
 * @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
 * @returns {boolean}
 */
J.TIME.Aliased.Game_Interpreter.set('shouldHideChoiceBranch', Game_Interpreter.prototype.shouldHideChoiceBranch);
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex)
{
  // perform original logic to see if this branch was already hidden.
  const defaultShow = J.TIME.Aliased.Game_Interpreter.get('shouldHideChoiceBranch')
    .call(this, subChoiceCommandIndex);

  // if there is another reason to hide this branch, then do not process quest reasons.
  if (defaultShow) return true;

  // grab some metadata about the event.
  const eventMetadata = $gameMap.event(this.eventId());
  const currentPageCommands = !!eventMetadata
    ? eventMetadata.page().list
    : $dataCommonEvents.at(this._commonEventId).list;

  // grab the event subcommand.
  const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);

  // ignore the comment if its not a tag.
  if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;

  // if its not a choice time conditional tag, don't hide it.
  if (!Game_Event.filterCommentCommandsByChoiceTimeConditional(subEventCommand)) return false;

  // convert the known-conditional-command to a conditional.
  const conditional = Game_Event.toTimeConditional(subEventCommand);

  // if the condition is met, then we don't need to hide.
  const met = Game_Event.timeConditionalMet(conditional);
  if (met) return false;

  // the conditional isn't met, hide the group.
  return true;
};
//endregion Game_Interpreter

//region JABS_InputController
/**
 * Extends {@link #update}.<br/>
 * Also handles input detection for the the time window toggle shortcut key.
 */
J.TIME.Aliased.JABS_InputController.set('update', JABS_InputController.prototype.update);
JABS_InputController.prototype.update = function()
{
  // perform original logic.
  J.TIME.Aliased.JABS_InputController.get('update')
    .call(this);

  // update input for the time window toggle shortcut key.
  this.updateTimeWindowAction();
};

/**
 * Monitors and takes action based on player input regarding the time window toggle shortcut key.
 */
JABS_InputController.prototype.updateTimeWindowAction = function()
{
  // check if the action's input requirements have been met.
  if (this.isTimeWindowActionTriggered())
  {
    // execute the action.
    this.performTimeWindowAction();
  }

};

/**
 * Checks the inputs of the time window action.
 * @returns {boolean}
 */
JABS_InputController.prototype.isTimeWindowActionTriggered = function()
{
  // this action requires the left stick button to be triggered.
  if (Input.isTriggered(J.ABS.Input.L3))
  {
    return true;
  }

  // input was not triggered.
  return false;
}

/**
 * Executes the time window toggle action.
 */
JABS_InputController.prototype.performTimeWindowAction = function()
{
  JABS_InputAdapter.performTimeWindowAction();
}
//endregion JABS_InputController

//region TimeMapper
/**
 * A class with several static mapping functions for parsing comments into {@link TimeConditional}s.
 */
class TimeMapper
{
  constructor()
  {
    throw new Error("This is a static class.");
  }

  static minuteToConditional(comment, regex)
  {
    const [ , minutes ] = regex.exec(comment);
    const timeConditional = new TimeConditional();
    timeConditional.minutes = parseInt(minutes);
    return timeConditional;
  }

  static hourToConditional(comment, regex)
  {
    const [ , hours ] = regex.exec(comment);
    const timeConditional = new TimeConditional();
    timeConditional.hours = parseInt(hours);
    return timeConditional;
  }

  static dayToConditional(comment, regex)
  {
    const [ , days ] = regex.exec(comment);
    const timeConditional = new TimeConditional();
    timeConditional.days = parseInt(days);
    return timeConditional;
  }

  static monthToConditional(comment, regex)
  {
    const [ , months ] = regex.exec(comment);
    const timeConditional = new TimeConditional();
    timeConditional.months = parseInt(months);
    return timeConditional;
  }

  static yearToConditional(comment, regex)
  {
    const [ , years ] = regex.exec(comment);
    const timeConditional = new TimeConditional();
    timeConditional.years = parseInt(years);
    return timeConditional;
  }

  static timeOfDayToConditional(comment, regex)
  {
    const [ , timeOfDay ] = regex.exec(comment);
    const maybeStringTimeOfDay = parseInt(timeOfDay);
    const timeConditional = new TimeConditional();
    isNaN(maybeStringTimeOfDay) === false
      ? timeConditional.timeOfDay = maybeStringTimeOfDay
      : timeConditional.timeOfDay = Time_Snapshot.TimesOfDayId(timeOfDay);
    return timeConditional;
  }

  static seasonOfYearToConditional(comment, regex)
  {
    const [ , seasonOfYear ] = regex.exec(comment);
    const maybeStringSeasonOfYear = parseInt(seasonOfYear);
    const timeConditional = new TimeConditional();
    isNaN(maybeStringSeasonOfYear) === false
      ? timeConditional.seasonOfYear = maybeStringSeasonOfYear
      : timeConditional.seasonOfYear = Time_Snapshot.SeasonsId(seasonOfYear);
    return timeConditional;
  }

  static timeRangeToConditional(comment, regex)
  {
    const [ , startHour, startMinute, endHour, endMinute ] = regex.exec(comment);
    // NOTE: there should only be two digits per time range- hours and minutes- like a clock.
    const startTimeRange = [ parseInt(startHour), parseInt(startMinute) ];
    const endTimeRange = [ parseInt(endHour), parseInt(endMinute) ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = startTimeRange;
    timeConditional.endRange = endTimeRange;
    timeConditional.isTimeRange = true;
    return timeConditional;
  }

  static fullDateRangeToConditional(comment, regex)
  {
    const [ , startFullRangeRaw, endFullRangeRaw ] = regex.exec(comment);
    // seconds are not a part of the regex but still need to be entered.
    const startFullRange = [ 0, ...JSON.parse(startFullRangeRaw) ];
    const endFullRange = [ 59, ...JSON.parse(endFullRangeRaw) ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = startFullRange;
    timeConditional.endRange = endFullRange;
    timeConditional.isFullDateRange = true;
    return timeConditional;
  }

  static minuteRangeToConditional(comment, regex)
  {
    const currentTimeSnapshot = $gameTime.currentTime();
    const [ , startMinuteRange, endMinuteRange ] = regex.exec(comment);
    const minuteRangeHourStart = currentTimeSnapshot.hours;
    let minuteRangeHourEnd = startMinuteRange < endMinuteRange
      ? currentTimeSnapshot.hours
      : currentTimeSnapshot.hours + 1;
    // if we teetered over to the next day, then reset the hour to zero.
    if (minuteRangeHourEnd === 24)
    {
      minuteRangeHourEnd = 0;
    }
    const startMinuteRangeTimeRange = [ minuteRangeHourStart, parseInt(startMinuteRange) ];
    const endMinuteRangeTimeRange = [ minuteRangeHourEnd, parseInt(endMinuteRange) ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = startMinuteRangeTimeRange;
    timeConditional.endRange = endMinuteRangeTimeRange;
    timeConditional.isTimeRange = true;
    return timeConditional;
  }

  static hourRangeToConditional(comment, regex)
  {
    const [ , startHourRange, endHourRange ] = regex.exec(comment);
    const startHourRangeTimeRange = [ parseInt(startHourRange), 0 ];
    const endHourRangeTimeRange = [ parseInt(endHourRange), 0];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = startHourRangeTimeRange;
    timeConditional.endRange = endHourRangeTimeRange;
    timeConditional.isTimeRange = true;
    return timeConditional;
  }

  static dayRangeToConditional(comment, regex)
  {
    const currentTimeSnapshot = $gameTime.currentTime();
    const [ , startDayRange, endDayRange ] = regex.exec(comment);
    const dayRangeStart = parseInt(startDayRange);
    const dayRangeEnd = parseInt(endDayRange);
    // seconds, minutes, and hours are all defaulted to zero for start.
    const fullDateRangeStart = [ 0, 0, 0, dayRangeStart, currentTimeSnapshot.months, currentTimeSnapshot.years ];
    let dayRangeMonthEnd = dayRangeEnd < dayRangeStart
      ? currentTimeSnapshot.months + 1
      : currentTimeSnapshot.months;
    let dayRangeYearEnd = currentTimeSnapshot.years;
    if (dayRangeMonthEnd === 13)
    {
      dayRangeMonthEnd = 1;
      dayRangeYearEnd += 1;
    }
    const fullDateRangeEnd = [ 59, 59, 23, dayRangeEnd, dayRangeMonthEnd, dayRangeYearEnd ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = fullDateRangeStart;
    timeConditional.endRange = fullDateRangeEnd;
    timeConditional.isFullDateRange = true;
    return timeConditional;
  }

  static monthRangeToConditional(comment, regex)
  {
    const currentTimeSnapshot = $gameTime.currentTime();
    const [ , startMonthRange, endMonthRange ] = regex.exec(comment);
    const monthRangeStart = parseInt(startMonthRange);
    const monthRangeEnd = parseInt(endMonthRange);
    const fullDateRangeStart = [ 0, 0, 0, 1, monthRangeStart, currentTimeSnapshot.years ];
    let monthRangeYearEnd = monthRangeEnd < monthRangeStart
      ? currentTimeSnapshot.years + 1
      : currentTimeSnapshot.years;
    const fullDateRangeEnd = [ 59, 59, 23, 30, monthRangeEnd, monthRangeYearEnd ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = fullDateRangeStart;
    timeConditional.endRange = fullDateRangeEnd;
    timeConditional.isFullDateRange = true;
    return timeConditional;
  }

  static yearRangeToConditional(comment, regex)
  {
    const [ , startYearRange, endYearRange ] = regex.exec(comment);
    const yearRangeStart = parseInt(startYearRange);
    const yearRangeEnd = parseInt(endYearRange);
    const fullDateRangeStart = [ 0, 0, 0, 1, 1, yearRangeStart ];
    const fullDateRangeEnd = [ 0, 0, 0, 1, 1, yearRangeEnd ];
    const timeConditional = new TimeConditional();
    timeConditional.startRange = fullDateRangeStart;
    timeConditional.endRange = fullDateRangeEnd;
    timeConditional.isFullDateRange = true;
    return timeConditional;
  }
}
//endregion TimeMapper

//region Scene_Base
/**
 * Extend the highest level `Scene_Base.update()` to also update time when applicable.
 */
J.TIME.Aliased.Scene_Base.update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function()
{
  J.TIME.Aliased.Scene_Base.update.call(this);
  if (this.shouldUpdateTime())
  {
    $gameTime.update();
  }
};

/**
 * Determines whether or not we should update artificial time while within the
 * current scene.
 * @returns {boolean}
 */
Scene_Base.prototype.shouldUpdateTime = function()
{
  const noTimeScenes = [ Scene_Boot, Scene_File, Scene_Save, Scene_Load, Scene_Title, Scene_Gameover ];
  const checkIfNoTimeScene = scene => SceneManager._scene instanceof scene;
  const isNoTimeScene = !noTimeScenes.some(checkIfNoTimeScene);
  const isTimeActive = $gameTime.isActive();
  const isTimeUnblocked = !$gameTime.isBlocked();

  return isNoTimeScene && isTimeActive && isTimeUnblocked;
};
//endregion Scene_Base

//region Scene_Map
/**
 * Extends {@link Scene_Map#initialize}.<br/>
 * Also initializes the TIME window.
 */
J.TIME.Aliased.Scene_Map.set("initialize", Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.TIME.Aliased.Scene_Map.get("initialize")
    .call(this);

  // init the TIME window.
  this.initTimeMembers();
};

/**
 * Initializes all members related to the TIME system.
 */
Scene_Map.prototype.initTimeMembers = function()
{
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
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.TIME.Aliased.Scene_Map.get("createAllWindows")
    .call(this);

  // also create the TIME window.
  this.createTimeWindow();
};

//region TIME window
/**
 * Creates the TIME window.
 */
Scene_Map.prototype.createTimeWindow = function()
{
  // create the window.
  const window = this.buildTimeWindow();

  // update the tracker with the new window.
  this.setTimeWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the TIME window.
 * @returns {Window_Time}
 */
Scene_Map.prototype.buildTimeWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.timeWindowRect();

  // create the window with the rectangle.
  const window = new Window_Time(rectangle);

  // return the built and configured window.
  return window;
};

/**
 * Creates the rectangle representing the window for TIME.
 * @returns {Rectangle}
 */
Scene_Map.prototype.timeWindowRect = function()
{
  // defined the width of the window.
  const width = 200;

  // define the height of the window.
  const height = 180;

  // the x and y are defined by the plugin parameters.
  const x = J.TIME.Metadata.TimeWindowX;
  const y = J.TIME.Metadata.TimeWindowY;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked TIME window.
 * @returns {Window_Time}
 */
Scene_Map.prototype.getTimeWindow = function()
{
  return this._j._timeWindow;
};

/**
 * Sets the currently tracked TIME window to the given window.
 * @param window
 */
Scene_Map.prototype.setTimeWindow = function(window)
{
  this._j._timeWindow = window;
};
//endregion TIME window

/**
 * Extends {@link Scene_Map#update}.<br/>
 * Also updates the TIME window.
 */
J.TIME.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.TIME.Aliased.Scene_Map.get("update")
    .call(this);

  // also update the TIME window.
  this.updateTimeWindow();
};

/**
 * Handles the updating of the TIME window.
 */
Scene_Map.prototype.updateTimeWindow = function()
{
  // grab the TIME window.
  const timeWindow = this.getTimeWindow();

  // if for some reason, there is no TIME window, then don't try to update it.
  if (timeWindow === null) return;

  // update TIME.
  timeWindow.update();

  // handle visibility.
  this.manageTimeVisibility();
};

/**
 * Manages the visibility of the TIME window.
 */
Scene_Map.prototype.manageTimeVisibility = function()
{
  // grab the TIME window.
  const timeWindow = this.getTimeWindow();

  // check if the map window should be visible.
  if ($gameTime.isMapWindowVisible())
  {
    // show the window.
    timeWindow.show();
    timeWindow.open();
  }
  // it shouldn't be visible.
  else
  {
    // hide the window.
    timeWindow.close();
    timeWindow.hide();
  }
};

/**
 * Extends {@link Scene_Map#onMapLoaded}.<br/>
 * Also handles blocking/unblocking the flow of TIME based on the presence of tags.
 */
J.TIME.Aliased.Scene_Map.set("onMapLoaded", Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function()
{
  // inspect if this map was loaded as a result of a map transfer.
  if (this._transfer)
  {
    // handle the blockage of TIME as-needed.
    this.handleTimeBlock();

    // flag the system for needing a tone change (potentially) upon map transfer.
    $gameTime.setNeedsToneChange(true);
  }

  // perform original logic.
  J.TIME.Aliased.Scene_Map.get("onMapLoaded")
    .call(this);
};

/**
 * Blocks the flow of time if the target map is tagged with the specified tag.
 */
Scene_Map.prototype.handleTimeBlock = function()
{
  // check if TIME should be blocked.
  // TODO: update this to use notes instead of meta.
  if ($dataMap.meta && $dataMap.meta['timeBlock'])
  {
    // block it.
    $gameTime.block();
  }
  // it shouldn't be blocked.
  else
  {
    // unblock it.
    $gameTime.unblock();
  }
};
//endregion Scene_Map

//region Window_Base
/**
 * Extends {@link #convertEscapeCharacters}.<br>
 * Adds handling for new text codes for TIME data.
 */
J.TIME.Aliased.Window_Base.set('convertEscapeCharacters', Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text)
{
  // capture the text in a local variable for good practices!
  let textToModify = text;

  // handle season of year replacements.
  textToModify = this.translateSeasonOfYearTextCode(textToModify);

  // handle time of day replacements.
  textToModify = this.translateTimeOfDayTextCode(textToModify);

  // handle current time replacements.
  textToModify = this.translateCurrentTimeTextCode(textToModify);

  // let the rest of the conversion occur with the newly modified text.
  return J.TIME.Aliased.Window_Base.get('convertEscapeCharacters')
    .call(this, textToModify);
};

/**
 * Translates the text code into the name and icon of the corresponding time of day.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateTimeOfDayTextCode = function(text)
{
  // if not using the TIME system, then don't try to process the text.
  if (!J.TIME) return text;

  return text.replace(/\\timeOfDay\[(\d+)]/gi, (_, p1) =>
  {
    // determine the time of day id.
    const timeOfDayId = parseInt(p1) ?? -1;

    // if no id was provided, then do not parse.
    if (timeOfDayId === -1) return text;

    // determine the name of the time of day.
    const timeOfDayName = Time_Snapshot.TimesOfDayName(timeOfDayId);

    // if we got null back, then it was an invalid id.
    if (timeOfDayName === null) return text;

    // grab the iconIndex for the time of day.
    const timeOfDayIconIndex = Time_Snapshot.TimesOfDayIcon(timeOfDayId);

    // return the constructed replacement string.
    return `\\I[${timeOfDayIconIndex}]\\C[1]${timeOfDayName}\\C[0]`;
  });
};

/**
 * Translates the text code into the name and icon of the corresponding season of year.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateSeasonOfYearTextCode = function(text)
{
  // if not using the TIME system, then don't try to process the text.
  if (!J.TIME) return text;

  return text.replace(/\\seasonOfYear\[(\d+)]/gi, (_, p1) =>
  {
    // determine the season of year id.
    const seasonOfYearId = parseInt(p1) ?? -1;

    // if no id was provided, then do not parse.
    if (seasonOfYearId === -1) return text;

    // determine the name of the season of the year.
    const seasonOfYearName = Time_Snapshot.SeasonsName(seasonOfYearId);

    // if we got null back, then it was an invalid id.
    if (seasonOfYearName === null) return text;

    // grab the iconIndex for the season of the year.
    const seasonOfYearIconIndex = Time_Snapshot.SeasonsIconIndex(seasonOfYearId);

    // return the constructed replacement string.
    return `\\I[${seasonOfYearIconIndex}]\\C[1]${seasonOfYearName}\\C[0]`;
  });
};

/**
 * Translates the text code into the current time.
 * @param {string} text The text that has a text code in it.
 * @returns {string} The new text to parse.
 */
Window_Base.prototype.translateCurrentTimeTextCode = function(text)
{
  // if not using the TIME system, then don't try to process the text.
  if (!J.TIME) return text;

  return text.replace(/\\currentTime/gi, (_) =>
  {
    // grab the current time.
    const currentTime = $gameTime.currentTime();

    // extract the display for time.
    const { hours, minutes, seconds } = currentTime;

    // return the constructed replacement string.
    return `\\I[${currentTime.timeOfDayIcon}]\\C[1]${hours}:${minutes}:${seconds}\\C[0]`;
  });
};
//endregion Window_Base

//region Window_Time
/**
 * A window class for displaying the time.
 */
class Window_Time extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The shape representing this window.
   */
  constructor(rect)
  {
    // perform original logic.
    super(rect);

    // set the opacity of the window as 100% transparent.
    this.opacity = 0;

    // identify the background for this window.
    this.generateBackground();

    // initialize all members for this window.
    this.initMembers();

    // initialize the window with a refresh.
    this.refresh();
  };

  /**
   * Renders the background of the time window with what will look like a standard "dimmed" window gradient.
   */
  generateBackground()
  {
    const c1 = ColorManager.dimColor1();
    const c2 = ColorManager.dimColor2();
    const x = -4;
    const y = -4;
    const w = this.contentsBack.width + 8;
    const h = this.contentsBack.height + 8;
    this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    this.contentsBack.strokeRect(x, y, w, h, c1);
  };

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
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
  };

  /**
   * Toggles the alternating colon boolean.
   */
  toggleAlternating()
  {
    this._alternating = !this._alternating;
  }

  /**
   * Updates the frames and refreshes the window's contents once every half second.
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if the TIME window can be updated.
    if (this.canUpdate())
    {
      // toggle the colons!
      this.toggleAlternating();

      // process window refresh.
      this.refresh();

      // acknowledge the TIME update.
      $gameTime.acknowledgeHudUpdate();
    }
  };

  /**
   * Determine if the window can be updated.
   * @returns {boolean}
   */
  canUpdate()
  {
    // cannot process TIME update if it is inactive or blocked.
    if (!$gameTime.isActive() || $gameTime.isBlocked()) return false;

    // cannot process TIME update if time hasn't ticked.
    if ($gameTime.needsHudUpdate() === false) return false;

    // TIME should be processed.
    return true;
  }

  /**
   * Refreshes the window by clearing it and redrawing everything.
   */
  refresh()
  {
    this.time = $gameTime.currentTime();
    this.redrawContent();
  };

  /**
   * Clears and redraws the contents of the window.
   */
  redrawContent()
  {
    this.contents.clear();
    this.drawContent();
  }

  /**
   * Implements {@link #drawContent}.<br/>
   * Renders the TIME into the window.
   */
  drawContent()
  {
    const colon1 = this._alternating
      ? ":"
      : " ";
    const colon2 = this._alternating
      ? " "
      : ":";
    const ampm = this.time.hours > 11
      ? "PM"
      : "AM";
    const lh = this.lineHeight();

    const seconds = this.time.seconds.padZero(2);
    const minutes = this.time.minutes.padZero(2);
    const hours = this.time.hours.padZero(2);
    const timeOfDayName = this.time.timeOfDayName;
    const timeOfDayIcon = this.time.timeOfDayIcon;
    const seasonName = this.time.seasonOfTheYearName;
    const seasonIcon = this.time.seasonOfTheYearIcon;

    const days = this.time.days.padZero(2);
    const months = this.time.months.padZero(2);
    const years = this.time.years.padZero(4);

    this.drawTextEx(`\\I[2784]${hours}${colon1}${minutes}${colon2}${seconds} \\}${ampm}`, 0, lh * 0, 200);
    this.drawTextEx(`\\I[${timeOfDayIcon}]${timeOfDayName}`, 0, lh * 1, 200);
    this.drawTextEx(`\\I[${seasonIcon}]${seasonName}`, 0, lh * 2, 200);
    this.drawTextEx(`${years}/${months}/${days}`, 0, lh * 3, 200);
  };
}

//endregion Window_Time