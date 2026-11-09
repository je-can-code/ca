//region Cartographer
/**
 * Reads the floor of the current map as whole tiles, and works out how to get around on it.
 *
 * Characters in this game move in fractions of a tile, so "standing on a tile" only exists as an idea.
 * Planning on whole tiles anyway is what makes this simple: a route through tile centers stays clear of
 * every wall the collision grid knows about, and {@link Walker} is what turns it into real movement.
 *
 * The engine's own path search gives up after a dozen tiles, which is why this walks the whole map.
 */
class Cartographer
{
  /**
   * The four ways out of a tile.
   * @type {{direction: number, x: number, y: number}[]}
   */
  static Steps = [
    { direction: 2, x: 0, y: 1 },
    { direction: 4, x: -1, y: 0 },
    { direction: 6, x: 1, y: 0 },
    { direction: 8, x: 0, y: -1 },
  ];

  /**
   * Builds the key a tile goes by in a set or map.
   * @param {number} x The tile's x.
   * @param {number} y The tile's y.
   * @returns {string}
   */
  static keyOf(x, y)
  {
    return `${x},${y}`;
  }

  /**
   * Gathers the tiles events are standing in the way on.
   * An enemy that can walk is left out, because it will not be there by the time the route gets that
   * far. Inanimate ones never move, so a spire in a corridor counts as the wall it is.
   * @returns {Set<string>}
   */
  static solidTiles()
  {
    const solid = new Set();

    $gameMap.events()
      .forEach(event =>
      {
        // only something standing at character level, and solid, can block anybody.
        if (event.isErased() || event.isThrough() || event.isNormalPriority() === false) return;

        // the things a battle throws around the map pass through everyone.
        if (event.isJabsAction()) return;

        // anything alive and mobile moves out of the way, one way or another.
        if (event.isJabsBattler() && event.getJabsBattler()
          .isInanimate() === false) return;

        solid.add(this.keyOf(event.occupiedTileX(), event.occupiedTileY()));
      });

    return solid;
  }

  /**
   * Determines whether one step can be taken out of a tile, by the same rule the collision grid is built
   * from: the tile being left has to allow leaving that way, and the next has to allow arriving.
   * @param {number} x The tile being left.
   * @param {number} y The tile being left.
   * @param {{direction: number, x: number, y: number}} step The step being taken.
   * @param {Set<string>} solid The tiles events are blocking.
   * @returns {boolean} True if the step can be taken.
   */
  static canStep(x, y, step, solid)
  {
    const nextX = x + step.x;
    const nextY = y + step.y;

    if ($gameMap.isValid(nextX, nextY) === false) return false;
    if (solid.has(this.keyOf(nextX, nextY))) return false;
    if ($gameMap.isPassable(x, y, step.direction) === false) return false;

    return $gameMap.isPassable(nextX, nextY, 10 - step.direction);
  }

  /**
   * Floods the map outward from a tile, finding every tile that can be walked to and how to get there.
   * @param {number} fromX The tile to start from.
   * @param {number} fromY The tile to start from.
   * @returns {Map<string, {x: number, y: number, distance: number, previous: object|null}>}
   */
  static flood(fromX, fromY)
  {
    const solid = this.solidTiles();
    const start = { x: fromX, y: fromY, distance: 0, previous: null };
    const field = new Map([ [ this.keyOf(fromX, fromY), start ] ]);
    const queue = [ start ];

    // the queue grows as it is read, which is what makes this breadth first.
    for (let index = 0; index < queue.length; index += 1)
    {
      const tile = queue[index];

      this.Steps.forEach(step =>
      {
        const key = this.keyOf(tile.x + step.x, tile.y + step.y);
        if (field.has(key) || this.canStep(tile.x, tile.y, step, solid) === false) return;

        const next = { x: tile.x + step.x, y: tile.y + step.y, distance: tile.distance + 1, previous: tile };
        field.set(key, next);
        queue.push(next);
      });
    }

    return field;
  }

  /**
   * Floods the map outward from wherever a character can actually walk away from.
   *
   * That is usually the tile its body covers, but not when an event stands in that same tile. Bodies are
   * anchored at the feet, so a character pressed up against the top of something has its feet in the row
   * that other body starts in, and the two of them count as standing on the same tile. A route planned from
   * there steps straight through whatever the character is pressed against, and walking it pushes into that
   * forever. The tile its logical position rounds to is on its own side, and is the one its body can leave.
   * @param {Game_Character} character The character the routes are for.
   * @returns {Map<string, {x: number, y: number, distance: number, previous: object|null}>}
   */
  static floodFrom(character)
  {
    const x = character.occupiedTileX();
    const y = character.occupiedTileY();

    // nothing else claims the tile, so the body's own tile is an honest place to start.
    if (this.solidTiles().has(this.keyOf(x, y)) === false) return this.flood(x, y);

    return this.flood(Math.round(character.x), Math.round(character.y));
  }

  /**
   * Unwinds a flooded tile back into the walk that reaches it, not counting the tile already stood on.
   * @param {{x: number, y: number, previous: object|null}} tile The tile to reach.
   * @returns {{x: number, y: number}[]} The tiles to walk through, in order.
   */
  static routeTo(tile)
  {
    const route = [];

    for (let step = tile; step.previous !== null; step = step.previous)
    {
      route.unshift({ x: step.x, y: step.y });
    }

    return route;
  }
}

export default Cartographer;
//endregion Cartographer
