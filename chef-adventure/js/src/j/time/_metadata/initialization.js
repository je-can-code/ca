/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

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
J.TIME.Metadata.TimeOfDayIdVariable = Number(J.TIME.PluginParameters['yearsVariable']);
J.TIME.Metadata.TimeOfDayNameVariable = Number(J.TIME.PluginParameters['yearsVariable']);
J.TIME.Metadata.SeasonOfYearIdVariable = Number(J.TIME.PluginParameters['yearsVariable']);
J.TIME.Metadata.SeasonOfYearNameVariable = Number(J.TIME.PluginParameters['yearsVariable']);

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
  Scene_Base: {},
  Scene_Map: {},
};

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
  const {Second, Minute, Hour, Day, Month, Year} = args;
  $gameTime.setTime(
    parseInt(Second),
    parseInt(Minute),
    parseInt(Hour),
    parseInt(Day),
    parseInt(Month),
    parseInt(Year)
  );
});

/**
 * Plugin command for fast-forwarding time by a designated amount.
 */
PluginManager.registerCommand(J.TIME.Metadata.Name, "fastForwardtime", args =>
{
  const {Second, Minute, Hour, Day, Month, Year} = args;
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
  const {Second, Minute, Hour, Day, Month, Year} = args;
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
  const {TimeOfDay} = args;
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

/**
 * A global object for storing data related to TIME.
 * @global
 * @type {Game_Time}
 */
var $gameTime = null;
//endregion Introduction