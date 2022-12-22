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
        return `${seasonId} is not a valid season id.`;
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
   * Translates the numeric time of the day into it's proper name.
   * @param {number} timeOfDayId The numeric representation of the time of the day.
   * @returns {string}
   */
  static TimesOfDayName(timeOfDayId)
  {
    switch (timeOfDayId)
    {
      case 0:
        return "Night";     // midnight-4am
      case 1:
        return "Dawn";      // 4am-8am
      case 2:
        return "Morning";   // 8am-noon
      case 3:
        return "Afternoon"; // noon-4pm
      case 4:
        return "Evening";   // 4pm-8pm
      case 5:
        return "Twilight";  // 8pm-midnight
      default:
        return `${timeOfDayId} is not a valid time of day id.`;
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
}

//endregion Time_Snapshot