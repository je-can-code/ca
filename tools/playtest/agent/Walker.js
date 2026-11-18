//region Walker
/**
 * Turns a route of tiles into thumbs on the d-pad.
 *
 * Movement here is continuous, so there is no such thing as "take one step". The walker holds whichever
 * directions close the gap to the next tile, and diagonals are just two directions at once, exactly like
 * a person rolling a thumb around a corner.
 *
 * The player's body is anchored at the feet: it covers from 0.4 to 1.0 of a tile below its logical y, and
 * 0.2 to 0.8 across from its logical x. So the body only fits inside the rows of tile (5, 8) for a logical
 * y between 7.6 and 8.0, and a character standing at exactly y 8.02 has its toes in the next row down,
 * where a rock can stop it dead while everything about the tile it is "on" says the way is clear. The
 * middle of that range is where steering aims, which is what {@link Walker.BodyOffsetY} is for.
 */
class Walker
{
  /**
   * How far above a tile's own row the player has to aim for its body to sit in the middle of that row.
   * @type {number}
   */
  static BodyOffsetY = 0.2;

  /**
   * How close to the middle of a tile counts as having reached it. The body has two tenths of a tile to
   * spare in any direction there, so this keeps it inside the tile without asking for a precision the
   * character's own speed would overshoot.
   * @type {number}
   */
  static ArrivalRadius = 0.15;

  /**
   * The smallest gap on one axis worth pressing a direction for, below which the character only jitters.
   * @type {number}
   */
  static Deadband = 0.06;

  /**
   * How little a character has to move in a frame to count as not having moved at all.
   * @type {number}
   */
  static StillDistance = 0.003;

  /**
   * How many frames of pushing and going nowhere before the route counts as blocked.
   * @type {number}
   */
  static StallFrames = 45;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs;

  /**
   * The tiles left to walk through.
   * @type {{x: number, y: number}[]}
   */
  #route = [];

  /**
   * How many frames in a row the character has gone nowhere.
   * @type {number}
   */
  #stillFrames = 0;

  /**
   * Where the character stood last frame.
   * @type {{x: number, y: number}}
   */
  #last = { x: 0, y: 0 };

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   */
  constructor(thumbs)
  {
    this.#thumbs = thumbs;
  }

  /**
   * Starts following a new route.
   * @param {{x: number, y: number}[]} route The tiles to walk through.
   */
  follow(route)
  {
    this.#route = route;
    this.#stillFrames = 0;
    this.#last = { x: $gamePlayer.x, y: $gamePlayer.y };
  }

  /**
   * Determines whether a tile's center has been reached.
   * @param {{x: number, y: number}} tile The tile to check.
   * @returns {boolean}
   */
  #hasReached(tile)
  {
    const isCloseOnX = Math.abs(tile.x - $gamePlayer.x) <= Walker.ArrivalRadius;
    const isCloseOnY = Math.abs(tile.y - Walker.BodyOffsetY - $gamePlayer.y) <= Walker.ArrivalRadius;

    return isCloseOnX && isCloseOnY;
  }

  /**
   * Holds whichever directions close the gap to a tile's center.
   * @param {{x: number, y: number}} tile The tile to steer for.
   */
  #steerTowards(tile)
  {
    const gapX = tile.x - $gamePlayer.x;
    const gapY = tile.y - Walker.BodyOffsetY - $gamePlayer.y;

    if (Math.abs(gapX) > Walker.Deadband)
    {
      this.#thumbs.hold(gapX > 0 ? 'right' : 'left');
    }

    if (Math.abs(gapY) > Walker.Deadband)
    {
      this.#thumbs.hold(gapY > 0 ? 'down' : 'up');
    }
  }

  /**
   * Holds the dash button, the way anyone holds it on a long walk. In a fight that same button is the
   * dodge, and the engine treats a fresh press there as asking for one, so it comes off the moment a
   * fight starts rather than going off by accident.
   */
  dashIfSafe()
  {
    if ($jabsEngine.getPlayer1()
      .isInCombat()) return;

    this.#thumbs.hold('shift');
  }

  /**
   * Forgives standing still this frame. Something else took the thumb off the d-pad on purpose, and waiting
   * for a telegraph to pass is not the same as walking into a wall.
   */
  excuse()
  {
    this.#stillFrames = 0;
  }

  /**
   * Counts how long the character has been going nowhere.
   */
  #trackStillness()
  {
    const moved = Math.hypot($gamePlayer.x - this.#last.x, $gamePlayer.y - this.#last.y);

    this.#stillFrames = moved < Walker.StillDistance ? this.#stillFrames + 1 : 0;
    this.#last = { x: $gamePlayer.x, y: $gamePlayer.y };
  }

  /**
   * Walks for one frame.
   * @returns {'walking'|'arrived'|'stalled'} How the route is going.
   */
  step()
  {
    // corners get cut by simply moving on as soon as a tile is reached.
    while (this.#route.length > 0 && this.#hasReached(this.#route[0]))
    {
      this.#route.shift();
    }

    if (this.#route.length === 0) return 'arrived';

    this.#trackStillness();
    if (this.#stillFrames >= Walker.StallFrames) return 'stalled';

    this.#steerTowards(this.#route[0]);
    this.dashIfSafe();

    return 'walking';
  }
}

export default Walker;
//endregion Walker
