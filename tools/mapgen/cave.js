//region cave
/**
 * Turns a carved cave into the six-layer tile array, drawn the way MZ's editor would have drawn it.
 *
 * A cloud island is ground floating in nothing, so `terrain.js` only has to paint ground and let the
 * void be the collision. A cave is the opposite: rock everywhere, with the walkable part carved out of
 * it. That rock is three things, and the editor treats each differently:
 *
 * - the floor, an A2 ground autotile;
 * - the wall face, an A4 wall side that hangs down from the ceiling over the top edge of every floor;
 * - the ceiling, an A4 wall top covering everything else, which is what reads as solid rock and what
 *   CA seals with terrain tag 1.
 *
 * So a recipe here never paints walls at all. It carves rock away into floor, or into chasm, and this
 * file works out where the faces hang, fills the rest with ceiling, picks every autotile's shape from its
 * neighbours, and casts the shadows the editor would cast beside the walls.
 *
 * A chasm is open ground nobody can cross: the floor runs on beneath it, and the palette's chasm, an A2
 * decoration, lies over it on layer 1 the way the editor stacks a decoration on ground. The decoration is
 * impassable on every shape, so it blocks, and the floor beneath it keeps the floor's edges clean.
 *
 * A void square holds nothing at all, on any layer: the open air under a castle's rafters, or a hole in a
 * floor. Tile 0 carries the star flag, so MZ treats it as solid and draws the parallax through it, the same
 * way the Nimbus clouds float. Everything beside a void shows its edge, and a wall face hangs over a void's
 * top edge just as it does over a floor's, which is what turns a hole into a shaft with a far wall going down.
 *
 * The shape rules are the jmz map editor's (`core/tiles/autotileShapes.ts`), which were measured against
 * every map MZ itself saved; the face height and the shadow rule were measured here, against the 92
 * shipped maps on tileset 14. None of it is recalled from memory.
 */
import { a2TileId } from './autotile.js';

/**
 * How many rows a wall face hangs below its ceiling. Two, because 3,119 of the 3,428 face runs on the
 * shipped tileset-14 maps are two rows tall; the rest are hand-made ledges and pits of other heights.
 * @type {number}
 */
const FACE_ROWS = 2;

/**
 * What the editor stores on the shadow layer for a square shaded down its left half: the top-left and
 * bottom-left quarters.
 * @type {number}
 */
const LEFT_HALF_SHADOW = 5;

/**
 * The layer the editor keeps shadows on. Layers 0 to 3 hold tiles and layer 5 holds regions.
 * @type {number}
 */
const SHADOW_LAYER = 4;

/**
 * The edges of a wall face's shape. A face's shape number is simply its open edges added together.
 * @type {Object<string, number>}
 */
const EDGE = { left: 1, top: 2, right: 4, bottom: 8 };

/**
 * What a square of a carving holds: solid rock, floor the player walks on, chasm they cannot cross, or void,
 * nothing at all.
 * @type {{rock: number, floor: number, chasm: number, void: number}}
 */
const CELL = { rock: 0, floor: 1, chasm: 2, void: 3 };

/**
 * The kind a void square holds in the kind grid: none, which every autotile beside it reads as a different
 * kind, so it shows its edge there.
 * @type {number}
 */
const NOTHING = -1;

/**
 * The layer a chasm lies on, above the floor it hides.
 * @type {number}
 */
const DECORATION_LAYER = 1;

/**
 * Whether an autotile kind is an A4 wall, top or side. A4 occupies kinds 80 through 127.
 * @param {number} kind The autotile kind.
 * @returns {boolean}
 */
const isA4 = kind => kind >= 80 && kind < 128;

/**
 * Whether an autotile kind is an A4 wall top, the ceiling. Within each block of sixteen A4 kinds the
 * first eight are tops and the last eight are the faces that hang beneath them.
 * @param {number} kind The autotile kind.
 * @returns {boolean}
 */
const isWallTop = kind => isA4(kind) && (kind - 80) % 16 < 8;

/**
 * Whether an autotile kind is an A4 wall face.
 * @param {number} kind The autotile kind.
 * @returns {boolean}
 */
const isWallFace = kind => isA4(kind) && (kind - 80) % 16 >= 8;

/**
 * Lays the three kinds of rock over a carving: floor wherever it was carved, under chasm as well as open
 * ground, faces hanging from the ceiling over the top edge of everything carved, and ceiling elsewhere.
 * A palette with a `floorAt` names the floor square by square, for a map with more than one floor, such
 * as a castle whose balcony is paved differently from the hall below it; one without lays `floor` everywhere.
 * A `faceAt` does the same for wall faces, such as the riveted front of an elevator car in a stone shaft, and a
 * `ceilingAt` for the rock itself, such as a stone monument standing in a forest. A `faceRows` hangs faces taller
 * than the two rows a cave's take, the way a forest's trunks stand four rows high.
 * @param {number[][]} carved What every square holds, as a {@link CELL}, by row then column.
 * @param {number} width The map's width in tiles.
 * @param {number} height The map's height in tiles.
 * @param {{floor: number, ceiling: number, face: number, floorAt: (function(number, number): number|undefined),
 * faceAt: (function(number, number): number|undefined), ceilingAt: (function(number, number): number|undefined),
 * faceRows: (number|undefined)}} palette The autotile kind for each part.
 * @returns {number[][]} The ground-layer autotile kind of every square, by row then column.
 */
const layRock = (carved, width, height, palette) =>
{
  const isRock = (x, y) => carved[y][x] === CELL.rock;
  const floorAt = palette.floorAt ?? (() => palette.floor);
  const faceAt = palette.faceAt ?? (() => palette.face);
  const ceilingAt = palette.ceilingAt ?? (() => palette.ceiling);
  const faceRows = palette.faceRows ?? FACE_ROWS;

  /**
   * The kind a square starts as, before any face is hung: ceiling for rock, nothing for void, and floor for
   * everything carved, chasm included, since the chasm lies over a floor.
   * @param {number} cell What the square holds, as a {@link CELL}.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number}
   */
  const kindOf = (cell, x, y) =>
  {
    if (cell === CELL.rock)
    {
      return ceilingAt(x, y);
    }

    return cell === CELL.void ? NOTHING : floorAt(x, y);
  };

  const kinds = carved.map((row, y) => row.map((cell, x) => kindOf(cell, x, y)));

  for (let x = 0; x < width; x++)
  {
    for (let y = 0; y < height; y++)
    {
      // a face only hangs over the top edge of a carving, so skip anything with carving above it.
      if (isRock(x, y) || (y > 0 && isRock(x, y - 1) === false))
      {
        continue;
      }

      // hang the face upwards from that edge, stopping early if the rock is thinner than a face.
      for (let row = 1; row <= faceRows && y - row >= 0 && isRock(x, y - row); row++)
      {
        kinds[y - row][x] = faceAt(x, y - row);
      }
    }
  }

  return kinds;
};

/**
 * Draws the chasm's decoration layer: the palette's chasm wherever the carving holds chasm, shaped against
 * its own kind like any ground, and nothing anywhere else.
 * @param {number[][]} carved What every square holds, as a {@link CELL}.
 * @param {number} width The map's width in tiles.
 * @param {number} height The map's height in tiles.
 * @param {number} chasmKind The chasm decoration's autotile kind.
 * @param {number[]} data The six-layer tile array to draw into.
 */
const layChasm = (carved, width, height, chasmKind, data) =>
{
  /**
   * The decoration kind at a square: the chasm where there is one, and beyond the map counts as joined,
   * the same rule every ground autotile follows.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number|undefined}
   */
  const chasmAt = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= width || y >= height)
    {
      return undefined;
    }

    return carved[y][x] === CELL.chasm ? chasmKind : -1;
  };

  for (let y = 0; y < height; y++)
  {
    for (let x = 0; x < width; x++)
    {
      if (carved[y][x] === CELL.chasm)
      {
        data[(DECORATION_LAYER * height + y) * width + x] = a2TileId(chasmAt, x, y);
      }
    }
  }
};

/**
 * Builds the shape rules over one map's kind grid.
 * @param {number[][]} kinds The autotile kind of every square.
 * @param {number} width The map's width in tiles.
 * @param {number} height The map's height in tiles.
 * @returns {{kindAt: function(number, number): (number|undefined), faceShape: function(number, number): number}}
 */
const shapesOver = (kinds, width, height) =>
{
  /**
   * The kind at a square, or undefined beyond the map, which is what `a2TileId` reads as joined.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number|undefined}
   */
  const kindAt = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= width || y >= height)
    {
      return undefined;
    }

    return kinds[y][x];
  };

  /**
   * The row a column's run of one kind starts on, walking up while the square above holds it too.
   * @param {number} x The column.
   * @param {number} y The row to start from.
   * @param {number} kind The kind.
   * @returns {number}
   */
  const runTop = (x, y, kind) =>
  {
    let top = y;
    while (top > 0 && kindAt(x, top - 1) === kind)
    {
      top--;
    }

    return top;
  };

  /**
   * The row a column's run of one kind ends on, walking down while the square below holds it too.
   * @param {number} x The column.
   * @param {number} y The row to start from.
   * @param {number} kind The kind.
   * @returns {number}
   */
  const runBottom = (x, y, kind) =>
  {
    let bottom = y;
    while (bottom + 1 < height && kindAt(x, bottom + 1) === kind)
    {
      bottom++;
    }

    return bottom;
  };

  /**
   * Whether the square beside a wall face joins it. A face is a column hanging from its top edge, so a
   * face beside it joins only when that column's wall starts and ends no higher than this one; a
   * ceiling beside it always joins, so a face runs cleanly into the rock that turns the corner; and
   * beyond the map counts as the same wall only for a wall that starts on the top row.
   * @param {number} x The face's column.
   * @param {number} y The face's row.
   * @param {number} dx -1 for the left neighbour, 1 for the right.
   * @returns {boolean}
   */
  const sideJoins = (x, y, dx) =>
  {
    const kind = kindAt(x, y);
    const besideKind = kindAt(x + dx, y);

    // beyond the edge of the map.
    if (besideKind === undefined)
    {
      return runTop(x, y, kind) === 0;
    }

    // another face, of any kind: compare where the two columns' walls start and end.
    if (isWallFace(besideKind))
    {
      const startsNoHigher = runTop(x + dx, y, besideKind) >= runTop(x, y, kind);
      const endsNoHigher = runBottom(x + dx, y, besideKind) >= runBottom(x, y, kind);
      return startsNoHigher && endsNoHigher;
    }

    // ceiling joins; floor, or anything else, shows the face's edge.
    return isWallTop(besideKind);
  };

  /**
   * A wall face's shape: its open edges added up. The top shows unless the face continues upwards or
   * sits on the map's top row; the bottom shows unless the face continues downwards or runs off the
   * bottom of the map.
   * @param {number} x The face's column.
   * @param {number} y The face's row.
   * @returns {number}
   */
  const faceShape = (x, y) =>
  {
    const kind = kindAt(x, y);
    let shape = 0;

    if (sideJoins(x, y, -1) === false)
    {
      shape += EDGE.left;
    }

    if (y === 0 || kindAt(x, y - 1) !== kind)
    {
      shape += EDGE.top;
    }

    if (sideJoins(x, y, 1) === false)
    {
      shape += EDGE.right;
    }

    if (y + 1 < height && kindAt(x, y + 1) !== kind)
    {
      shape += EDGE.bottom;
    }

    return shape;
  };

  return { kindAt, faceShape };
};

/**
 * Turns a carving into a map's six-layer tile array: every ground autotile on layer 0 in its proper
 * shape, any chasm on layer 1, layers 2 and 3 left empty for decoration, the editor's shadows on layer 4,
 * and no regions.
 *
 * The shadows follow the rule the shipped maps keep: a square that is not wall, with wall to its left
 * and wall above that, is shaded down its left half. Of the 2,488 shadows MZ stored on tileset 14, 2,484
 * sit exactly there, and of the squares the rule picks out, MZ left only 73 bare. It is the wall's own
 * shadow falling to the right, starting from its second row.
 * @param {number[][]} carved What every square holds, as a {@link CELL}, by row then column.
 * @param {number} width The map's width in tiles.
 * @param {number} height The map's height in tiles.
 * @param {{floor: number, ceiling: number, face: number, chasm: (number|undefined), floorAt: (function(number,
 * number): number|undefined), faceAt: (function(number, number): number|undefined), ceilingAt: (function(number,
 * number): number|undefined), faceRows: (number|undefined)}} palette The autotile kind for each part; `chasm`
 * only for a palette that has one, `floorAt`, `faceAt` and `ceilingAt` only for one whose floor, wall faces or
 * rock change from square to square, and `faceRows` only for walls taller than a cave's.
 * @returns {number[]}
 */
const renderCave = (carved, width, height, palette) =>
{
  const kinds = layRock(carved, width, height, palette);
  const { kindAt, faceShape } = shapesOver(kinds, width, height);
  const data = new Array(width * height * 6).fill(0);

  for (let y = 0; y < height; y++)
  {
    for (let x = 0; x < width; x++)
    {
      const kind = kinds[y][x];

      // a void keeps nothing on any layer, not even a shadow, which would float over the parallax.
      if (kind === NOTHING)
      {
        continue;
      }

      // faces read whole columns; floors and ceilings read their eight neighbours.
      if (isWallFace(kind))
      {
        data[y * width + x] = 2048 + kind * 48 + faceShape(x, y);
      }
      else
      {
        data[y * width + x] = a2TileId(kindAt, x, y);
      }

      // only open ground takes a shadow, and only from wall standing to its left and above-left.
      const castsOnto = isA4(kind) === false && x > 0 && y > 0;
      if (castsOnto && isA4(kindAt(x - 1, y)) && isA4(kindAt(x - 1, y - 1)))
      {
        data[(SHADOW_LAYER * height + y) * width + x] = LEFT_HALF_SHADOW;
      }
    }
  }

  // a palette with a chasm lays it over the floor; one without has none to lay.
  if (palette.chasm !== undefined)
  {
    layChasm(carved, width, height, palette.chasm, data);
  }

  return data;
};

/**
 * Sands the noise off a carving. A blob's wobble leaves one-square spurs poking out of a chamber and
 * one-square notches bitten into it, and a spur on a chamber's top edge is the worst of them: a wall face
 * hangs over it, which reads as a row of broken teeth. So open ground with at most one open neighbour is
 * filled back in, and rock with three or more open neighbours is opened up as whatever borders it most.
 * The same goes for the edge between a path and its chasm: a lone square of floor poking into the chasm
 * is given to the chasm, and a square of chasm bitten into a path is floored over. All of it repeats
 * until nothing changes. The squares a recipe needs kept, its doors and posts, are never touched, and the
 * map's border is never opened, so no doorway appears that a link did not ask for.
 * @param {number[][]} carved What every square holds, as a {@link CELL}; tidied in place.
 * @param {number} width The map's width in tiles.
 * @param {number} height The map's height in tiles.
 * @param {number[][]} keep The squares never to touch, as [x, y].
 * @param {string} label The map's name, for the error when a carving never settles.
 */
const tidyCarving = (carved, width, height, keep, label) =>
{
  const kept = new Set(keep.map(square => square.join(',')));

  /**
   * What a square's four neighbours hold, leaving out any beyond the map.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number[]}
   */
  const neighboursOf = (x, y) =>
  {
    return [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ]
      .map(([ dx, dy ]) => [ x + dx, y + dy ])
      .filter(([ nx, ny ]) => nx >= 0 && ny >= 0 && nx < width && ny < height)
      .map(([ nx, ny ]) => carved[ny][nx]);
  };

  // a handful of passes settles any real carving; one that never settles is a recipe bug worth a stop.
  let changed = true;
  let passes = 0;
  while (changed)
  {
    passes++;
    if (passes > 20)
    {
      throw new Error(`${label}: tidying never settled`);
    }

    changed = false;
    for (let y = 0; y < height; y++)
    {
      for (let x = 0; x < width; x++)
      {
        const cell = carved[y][x];
        const onBorder = x === 0 || y === 0 || x === width - 1 || y === height - 1;
        const isKept = kept.has(`${x},${y}`);
        const around = neighboursOf(x, y);
        const openAround = around.filter(neighbour => neighbour !== CELL.rock).length;
        const floorAround = around.filter(neighbour => neighbour === CELL.floor).length;
        const chasmAround = around.filter(neighbour => neighbour === CELL.chasm).length;
        let next = cell;

        // a spur of open ground poking into the rock: filled back in, unless it is kept.
        if (cell !== CELL.rock && openAround <= 1 && isKept === false)
        {
          next = CELL.rock;
        }
        // a notch bitten into the rock: opened up, unless it would cut a new opening in the map's edge.
        else if (cell === CELL.rock && openAround >= 3 && onBorder === false)
        {
          next = chasmAround > floorAround ? CELL.chasm : CELL.floor;
        }
        // a lone square of floor poking out over the chasm: given to the chasm, unless it is kept.
        else if (cell === CELL.floor && floorAround <= 1 && chasmAround >= 1 && isKept === false)
        {
          next = CELL.chasm;
        }
        // a square of chasm bitten into a path: floored over.
        else if (cell === CELL.chasm && floorAround >= 3)
        {
          next = CELL.floor;
        }

        if (next !== cell)
        {
          carved[y][x] = next;
          changed = true;
        }
      }
    }
  }
};

export { CELL, renderCave, tidyCarving };
//endregion cave