/**
 * A simple container of the coordinates of a destination.
 */
class StarOrigin
{
  /**
   * The map id of the destination.
   * @type {number}
   */
  mapId = 0;

  /**
   * The `x` coordinate of this point.
   * @type {number}
   */
  x = 0;

  /**
   * The `y` coordinate of this point.
   * @type {number}
   */
  y = 0;

  /**
   * Constructor.
   * @param {number} mapId The target map id.
   * @param {number} x The target `x` coordinate.
   * @param {number} y The target `y` coordinate.
   */
  constructor(mapId, x, y)
  {
    this.mapId = mapId;
    this.x = x;
    this.y = y;
  }
}