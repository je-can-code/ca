//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TIME] A system for tracking time- real or artificial.
 * @author JE
 * @url https://github.com/je-can-code/ca
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