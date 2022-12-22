//region Window_SDP_Points
/**
 * The SDP window containing the amount of SDP points a given actor has.
 */
class Window_SDP_Points
  extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that defines this window's shape.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    this._actor = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    this.contents.clear();
    this.drawPoints();
  }

  /**
   * Draws the SDP icon and number of points this actor has.
   */
  drawPoints()
  {
    this.drawSdpIcon();
    this.drawSdpPoints();
    this.drawSdpFace();
  }

  /**
   * Draws the "SDP icon" representing points.
   */
  drawSdpIcon()
  {
    const x = 200;
    const y = 2;
    const iconIndex = J.SDP.Metadata.PointsIcon;
    this.drawIcon(iconIndex, x, y);
  }

  /**
   * Draws the SDP points the actor currently has.
   */
  drawSdpPoints()
  {
    // don't draw the points if the actor is unavailable.
    if (!this._actor) return;

    const points = this._actor.getSdpPoints();
    const x = 240;
    const y = 0;
    const textWidth = 300;
    const alignment = "left";
    this.drawText(points, x, y, textWidth, alignment);
  }

  /**
   * A wrapper around the drawing of the actor's face- in case we need logic.
   */
  drawSdpFace()
  {
    // don't draw the points if the actor is unavailable.
    if (!this._actor) return;

    this.drawFace(
      this._actor.faceName(),
      this._actor.faceIndex(),
      0, 0,   // x,y
      128, 40);// w,h
  }

  /**
   * Sets the actor focus for the SDP points window. Implicit refresh.
   * @param {Game_Actor} actor The actor to display SDP info for.
   */
  setActor(actor)
  {
    this._actor = actor;
    this.refresh();
  }
}
//endregion Window_SDP_Points