//region Window_Time
/**
 * A window class for displaying the time.
 */
class Window_Time
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The shape representing this window.
   */
  constructor(rect)
  {
    super(rect);
    this.opacity = 0;
    this.generateBackground();
    this.initMembers();
  };

  /**
   * Replaces the background of the time window with what will look like a standard
   * "dimmed" window gradient.
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
    this.time = null;
    this._frames = 0;
    this._alternating = false;
    this.refresh();
  };

  /**
   * Updates the frames and refreshes the window's contents once every half second.
   */
  update()
  {
    super.update();

    // don't actually update rendering the time if time isn't active.
    if (!$gameTime.isActive() || $gameTime.isBlocked()) return;

    this._frames++;
    if (this._frames % $gameTime.getTickSpeed() === 0)
    {
      this.refresh();
    }

    if (this._frames % 60 === 0)
    {
      this._alternating = !this._alternating;
      this.refresh();
    }
  };

  /**
   * Refreshes the window by clearing it and redrawing everything.
   */
  refresh()
  {
    this.time = $gameTime.currentTime();
    this.contents.clear();
    this.drawContent();
  };

  /**
   * Draws the contents of the window.
   */
  drawContent()
  {
    const colon1 = this._alternating ? ":" : " ";
    const colon2 = this._alternating ? " " : ":";
    const ampm = this.time.hours > 11 ? "PM" : "AM";
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