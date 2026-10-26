//region shores
/**
 * The Seashell Shores: a chapter 4 optional area at the foot of the Outer Cliffs, drafted to the spec in
 * `docs/maps/shores.md`. Jeremy wanted "more of a place than a proper dungeon": a short way down from the
 * Outer Cliffs' Hidey Hole, a few maps of beach, and "maybe a couple of caves". What makes it a place is the
 * tide. The sea comes and goes with J-Time's clock, so the same beach holds different things at different
 * hours, and one cove at its far end exists twice, once at high tide and once at low, because it is the one
 * place where the tide changes the ground itself.
 *
 * Floors, walls, water and doorways only: no enemies, no treasure, no decoration, and none of the tide's
 * spawns. Those are Jeremy's passes, and every tide spawn is an event page gated by J-Time's
 * `<timeOfDayPage>`.
 *
 * The beach wears tileset 17, "EX Outside Alt Beach", which no map had used before: dry sand above, wet sand
 * where the tide comes and goes, teal sea beyond it with sandbars in the shallows, and sandstone cliffs. The
 * way down and the two sea caves wear tileset 14: the way down in the Hidey Hole's own orange rock, since it
 * carries on from that cave, and the sea caves in the grey rock and still pools of the Deluge Caverns.
 *
 * Usage: bun tools/mapgen/dungeons/shores.js [--plan]
 *        bun tools/mapgen/snapshot.js 454 --staged --out cove.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js links 450
 *
 * `--plan` prints each carving as text before writing, for reading a layout without rendering it.
 */
import { DATA } from '../paths.js';
import { a2TileId } from '../autotile.js';
import { blob, serialise, transferEvent, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor, landingOf } from '../doors.js';

/**
 * The map tree node the area's folder hangs under: Map13, "REGION: Western Erocia", beside the Outer Cliffs
 * it is reached from. Where it finally sits in the tree is Jeremy's to move.
 * @type {number}
 */
const REGION = 13;

/**
 * The area's own folder: a 0x0 map that is nothing but a branch, the way "FIELD: Outer Cliffs" is.
 * @type {{id: number, tree: string}}
 */
const FIELD = { id: 450, tree: 'FIELD: Seashell Shores' };

/**
 * Every map's id, the next free ones after the Crystalline Ravine when drafted.
 * @type {Object<string, number>}
 */
const ID = {
  descent: 451,
  shores1: 452,
  shores2: 453,
  coveHigh: 454,
  coveLow: 455,
  cave1: 456,
  cave2: 457,
};

/**
 * What a carved square stands on. Rock is the carving's own business; every square carved out of it is one of
 * these, and only the first three can be walked on.
 * @type {Object<string, string>}
 */
const GROUND = { dry: 'dry', wet: 'wet', floor: 'floor', sea: 'sea', shoal: 'shoal', pool: 'pool' };

/**
 * The grounds the player can stand on. Sea, sandbars and pools are water, which the tilesets make impassable.
 * @type {Set<string>}
 */
const WALKABLE = new Set([ GROUND.dry, GROUND.wet, GROUND.floor ]);

/**
 * The beach on tileset 17: wavy dry sand ("A2 ground 17"), the darker grained sand the tide uncovers ("A2 ground
 * 19"), teal sea ("A1 2"), and the sandbar shallows ("A1 1"), under cliffs with grass on top and rock faces
 * whose feet are sanded over ("A4 ceiling 1" and "A4 wall 12"). The wet sand draws its own pale rim against the
 * sea, which is what reads as a shoreline. The cliff tops are grass rather than the sheet's sand-topped cliffs,
 * which looked exactly like the beach below them. `layered` sits the cliffs' edges over the ground; see
 * `layerCliffEdges`.
 * @type {{tileset: number, ceiling: number, face: number, kinds: Object<string, number>, layered: boolean}}
 */
const BEACH = { tileset: 17, ceiling: 80, face: 91, kinds: { dry: 32, wet: 34, sea: 1, shoal: 0 }, layered: true };

/**
 * The Hidey Hole's own rock (`Map113`): orange cobble underfoot, olive rock walls.
 * @type {{tileset: number, ceiling: number, face: number, kinds: Object<string, number>}}
 */
const ORANGE_CAVE = { tileset: 14, ceiling: 116, face: 124, kinds: { floor: 16, pool: 10 } };

/**
 * The Deluge Caverns' grey rock (`Map326`), with the still water they pool.
 * @type {{tileset: number, ceiling: number, face: number, kinds: Object<string, number>}}
 */
const GREY_CAVE = { tileset: 14, ceiling: 81, face: 89, kinds: { floor: 24, pool: 10 } };

/**
 * The times of day the tide is out. J-Time splits the day into six four-hour phases; these two are twelve hours
 * apart, the way real low tides are, and the first of them is the phase the clock already calls moontide.
 * @type {string[]}
 */
const LOW_TIDES = [ 'moontide', 'afternoon' ];

/**
 * The music outdoors, borrowed from the Outer Cliffs above as a placeholder.
 * @type {{name: string, pan: number, pitch: number, volume: number}}
 */
const OUTDOORS = { name: '_Ys9_DesertAfterTears', pan: 0, pitch: 100, volume: 100 };

/**
 * The music in the caves, borrowed from the Hidey Hole the way down starts in.
 * @type {{name: string, pan: number, pitch: number, volume: number}}
 */
const INDOORS = { name: '_LoH_FeelingsOfHometownishness', pan: 0, pitch: 100, volume: 30 };

// every link names both doorways, in Jeremy's door format (see `doors.js`). Map113 is Jeremy's, so its half of
// the first door is his to place: its east wall opens at x 21, rows 9-11, once all four Magic Torches are lit,
// and an event there with <areaEvent:[1,3]> leads to the way down. The way back lands on the floor already
// there at (20,10). The two links from Shores 2 into the cove share one doorway, so that side is silent here
// and written as a single event whose pages choose the tide (see `tideDoorEvent`).
const LINKS = [
  {
    a: { map: 113, at: [ 21, 9 ], span: [ 1, 3 ], dir: 4, silent: true },
    b: { map: ID.descent, at: [ 1, 3 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.descent, at: [ 18, 38 ], span: [ 3, 1 ], dir: 8 },
    b: { map: ID.shores1, at: [ 18, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: ID.shores1, at: [ 38, 8 ], span: [ 1, 3 ], dir: 4 },
    b: { map: ID.shores2, at: [ 1, 8 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.shores2, at: [ 88, 9 ], span: [ 1, 3 ], dir: 4, silent: true },
    b: { map: ID.coveHigh, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.shores2, at: [ 88, 9 ], span: [ 1, 3 ], dir: 4, silent: true },
    b: { map: ID.coveLow, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.coveLow, at: [ 18, 5 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.cave1, at: [ 18, 28 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.coveLow, at: [ 40, 5 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.cave2, at: [ 18, 28 ], span: [ 3, 1 ], dir: 8 },
  },
];

/**
 * A gentle, repeatable wobble for a shoreline or a cliff line: a sine of the column, so a re-run draws the same
 * coast and neighbouring columns never jump more than a square.
 * @param {number} x The column.
 * @param {number} amplitude How many rows the line strays either way.
 * @param {number} period How many columns one sway takes, roughly.
 * @param {number} seed Shifts the sway along, so two lines on one map do not sway together.
 * @returns {number}
 */
const wave = (x, amplitude, period, seed) => Math.round(amplitude * Math.sin((x + seed * 7) / period));

/**
 * Paints the cove at one tide. Both tides share every rock and every doorway; the tide only decides how far the
 * sea reaches. Out, it leaves a wide flat of wet sand with pools and rocks on it, and the two sea-cave mouths at
 * the cliff foot can be walked to. In, the sea comes right up to the cliffs and fills the mouths, and only the
 * dry strip at the door from Shores 2 stays above it.
 * @param {string} tide 'high' or 'low'.
 * @returns {function(Object): void}
 */
const paintCove = tide => ({ shore, rocks, fill, outcrop, pool, shoal }) =>
{
  const isLow = tide === 'low';

  // the cliffs along the north; the tide decides what lies at their foot.
  shore(0, 59, () => 8, () => 8, x => (isLow ? 29 + wave(x, 2, 9, 5) : 8));

  // the dry strip at the door, which the sea never reaches.
  for (let x = 0; x <= 10; x++)
  {
    fill(x, 8, x, 14 + wave(x, 1, 3, 2), GROUND.dry);
  }

  // the headland closing the strip in to the west, and the cliffs wrapping round the east.
  rocks(0, 0, 0, 39);
  rocks(0, 16, 2, 39);
  for (let y = 0; y < 40; y++)
  {
    rocks(52 + wave(y, 2, 6, 3), y, 59, y);
  }

  // the door from Shores 2.
  fill(0, 10, 1, 12, GROUND.dry);

  // the two sea-cave mouths, cut into the cliff foot: sand at low tide, sea at high.
  const mouth = isLow ? GROUND.wet : GROUND.sea;
  fill(18, 5, 20, 7, mouth);
  fill(40, 5, 42, 7, mouth);

  // rocks on the flat, which stand above any tide.
  outcrop(26, 21, 2, 2, 11);
  outcrop(46, 24, 2, 2, 12);
  outcrop(12, 30, 2, 2, 13);

  // pools the tide leaves behind, only there when it is out.
  if (isLow)
  {
    pool(14, 19, 3, 2, 21);
    pool(31, 13, 3, 2, 22);
    pool(37, 22, 4, 2, 23);
    pool(46, 15, 2, 3, 24);
  }

  // sandbars in the shallows beyond.
  shoal(28, 35, 6, 2, 31);
  shoal(44, 33, 4, 2, 32);
};

// each map paints its ground with a small vocabulary. `shore` lays a coast column by column: cliff above, then
// dry sand, wet sand and sea, at rows given as functions of the column. `rocks` restores solid rock, `fill`
// carves a rectangle of one ground, `blob` an organic patch of one, and `outcrop` stands an organic stack of rock
// up out of whatever is there. `pool` and `shoal` sink water into ground already carved: a pool into sand or a
// cave floor, a sandbar into the sea.
const SPECS = [
  {
    id: ID.descent,
    tree: 'The Way Down',
    display: 'The Way Down',
    w: 40,
    h: 40,
    palette: ORANGE_CAVE,
    music: INDOORS,
    note: '<noToneChange>',
    paint: ({ fill, blob }) =>
    {
      // in from the Hidey Hole, then switchbacks down the inside of the cliff.
      fill(0, 3, 33, 5, GROUND.floor);
      fill(31, 3, 33, 13, GROUND.floor);
      fill(6, 11, 33, 13, GROUND.floor);
      fill(6, 11, 8, 21, GROUND.floor);
      fill(6, 19, 33, 21, GROUND.floor);
      fill(31, 19, 33, 29, GROUND.floor);

      // the turns open out a little, the way water wears a corner.
      blob(32, 4, 3, 2, 1, GROUND.floor);
      blob(7, 12, 3, 2, 2, GROUND.floor);
      blob(32, 20, 3, 2, 3, GROUND.floor);

      // a landing at the bottom, then out through the cliff foot onto the beach.
      blob(22, 31, 11, 3, 4, GROUND.floor);
      fill(18, 29, 20, 39, GROUND.floor);
    },
  },
  {
    id: ID.shores1,
    tree: 'Shores 1',
    display: 'Seashell Shores',
    w: 40,
    h: 23,
    palette: BEACH,
    music: OUTDOORS,
    note: '',
    paint: ({ shore, rocks, fill }) =>
    {
      // one screen of beach under the cliff, the sea along the bottom: where Rob was standing in J&R II.
      shore(0, 39, () => 6, x => 15 + wave(x, 1, 7, 3), x => 18 + wave(x, 1, 9, 1));

      // the way down comes out through the cliff here.
      fill(18, 0, 20, 5, GROUND.dry);

      // spurs of cliff run down to the sea either side, leaving the way on to the east.
      rocks(0, 0, 2, 18);
      rocks(37, 0, 39, 18);
      fill(37, 8, 39, 10, GROUND.dry);
    },
  },
  {
    id: ID.shores2,
    tree: 'Shores 2',
    display: 'Seashell Shores',
    w: 90,
    h: 35,
    palette: BEACH,
    music: OUTDOORS,
    note: '',
    paint: ({ shore, rocks, fill, outcrop, pool, shoal }) =>
    {
      // the long beach: cliffs along the north with a headland jutting out partway, sea along the south.
      const headland = x => (x >= 34 && x <= 44 ? 3 - Math.abs(x - 39) * 0.5 : 0);
      shore(0, 89, x => 6 + wave(x, 1, 6, 1) + Math.round(Math.max(0, headland(x))),
        x => 21 + wave(x, 1, 8, 2), x => 25 + wave(x, 2, 11, 3));

      // the ends are closed by cliff but for the doors: west to Shores 1, east to the cove.
      rocks(0, 0, 1, 26);
      fill(0, 8, 1, 10, GROUND.dry);
      rocks(88, 0, 89, 26);
      fill(88, 9, 89, 11, GROUND.dry);

      // sandstone stacks on the beach and out in the sea.
      outcrop(20, 13, 2, 2, 41);
      outcrop(58, 15, 3, 2, 42);
      outcrop(75, 12, 2, 2, 43);
      outcrop(31, 29, 2, 2, 44);
      outcrop(66, 31, 2, 2, 45);

      // pools in the wet sand, and sandbars offshore.
      pool(12, 22, 2, 1, 51);
      pool(47, 22, 3, 1, 52);
      pool(71, 22, 2, 1, 53);
      shoal(24, 31, 5, 2, 61);
      shoal(52, 30, 4, 2, 62);
    },
  },
  {
    id: ID.coveHigh,
    tree: 'The Cove (high tide)',
    display: 'The Cove',
    w: 60,
    h: 40,
    palette: BEACH,
    music: OUTDOORS,
    note: '',
    // the mouths the sea has filled, which no walk may reach.
    sealed: [ [ 19, 6 ], [ 41, 6 ] ],
    paint: paintCove('high'),
  },
  {
    id: ID.coveLow,
    tree: 'The Cove (low tide)',
    display: 'The Cove',
    w: 60,
    h: 40,
    palette: BEACH,
    music: OUTDOORS,
    note: '',
    paint: paintCove('low'),
  },
  {
    id: ID.cave1,
    tree: 'Sea Cave 1',
    display: 'Sea Cave',
    w: 40,
    h: 30,
    palette: GREY_CAVE,
    music: INDOORS,
    note: '<noToneChange>\n<ambient:[70]>',
    paint: ({ fill, blob, pool }) =>
    {
      // in from the cove's west mouth, up into a first chamber with a pool the tide left.
      fill(18, 24, 20, 29, GROUND.floor);
      blob(19, 19, 7, 4, 71, GROUND.floor);
      pool(21, 18, 2, 1, 72);

      // a passage west and up to a chamber at the back, a dead end.
      fill(10, 12, 13, 19, GROUND.floor);
      blob(12, 8, 8, 4, 73, GROUND.floor);
      pool(8, 7, 2, 1, 74);
    },
  },
  {
    id: ID.cave2,
    tree: 'Sea Cave 2',
    display: 'Sea Cave',
    w: 40,
    h: 30,
    palette: GREY_CAVE,
    music: INDOORS,
    note: '<noToneChange>\n<ambient:[70]>',
    paint: ({ fill, blob, pool }) =>
    {
      // in from the cove's east mouth to a flooded cavern, its pool ringed by a rim to walk around it.
      fill(18, 23, 20, 29, GROUND.floor);
      blob(20, 14, 14, 8, 81, GROUND.floor);
      pool(20, 13, 8, 4, 82);

      // a side chamber off the far rim, a dead end.
      fill(30, 5, 33, 9, GROUND.floor);
      blob(32, 5, 5, 3, 83, GROUND.floor);
    },
  },
];

const mapInfos = JSON.parse(await Bun.file(`${DATA}/MapInfos.json`).text());

/**
 * The tree name of any map, drafted here or already shipped, for naming the doors that lead to it.
 * @param {number} id The map id.
 * @returns {string}
 */
const treeName = id =>
{
  const drafted = SPECS.find(spec => spec.id === id);
  if (drafted)
  {
    return drafted.tree;
  }

  return mapInfos[id].name;
};

// the door helpers, bound to this recipe's links. Nothing here has been handed over to Jeremy yet.
const { proveLinksKeepHeading, exitsFor, doorSquaresOf } = doorsFor(LINKS, treeName, new Set());

/**
 * Carves one map out of solid rock by running its spec's paint function, then sands the noise off and gives any
 * square the sanding opened the ground most of its neighbours stand on.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], ground: string[][]}} What every square holds, as a `CELL`, and what every carved
 * square stands on, as a `GROUND`.
 */
const carveMap = spec =>
{
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(CELL.rock));
  const ground = Array.from({ length: spec.h }, () => new Array(spec.w).fill(null));
  const inside = (x, y) => x >= 0 && y >= 0 && x < spec.w && y < spec.h;

  /**
   * Carves one square as a ground.
   * @param {number} x The column.
   * @param {number} y The row.
   * @param {string} kind The ground.
   */
  const set = (x, y, kind) =>
  {
    if (inside(x, y) === false)
    {
      return;
    }

    carved[y][x] = CELL.floor;
    ground[y][x] = kind;
  };

  /**
   * Carves an axis-aligned rectangle of one ground between two corners, inclusive.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {string} kind The ground.
   */
  const fill = (x1, y1, x2, y2, kind) =>
  {
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        set(x, y, kind);
      }
    }
  };

  /**
   * Restores solid rock over an axis-aligned rectangle, inclusive.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const rocks = (x1, y1, x2, y2) =>
  {
    for (let y = Math.max(0, y1); y <= Math.min(spec.h - 1, y2); y++)
    {
      for (let x = Math.max(0, x1); x <= Math.min(spec.w - 1, x2); x++)
      {
        carved[y][x] = CELL.rock;
        ground[y][x] = null;
      }
    }
  };

  /**
   * Lays a coast across a run of columns: rock above the cliff line, dry sand down to the wet line, wet sand down
   * to the sea line, and sea below it to the bottom of the map.
   * @param {number} x1 The first column.
   * @param {number} x2 The last column.
   * @param {function(number): number} cliff The first row below the cliff, by column.
   * @param {function(number): number} wet The first row of wet sand, by column.
   * @param {function(number): number} sea The first row of sea, by column.
   */
  const shore = (x1, x2, cliff, wet, sea) =>
  {
    for (let x = x1; x <= x2; x++)
    {
      for (let y = cliff(x); y < spec.h; y++)
      {
        let kind = GROUND.dry;
        if (y >= sea(x))
        {
          kind = GROUND.sea;
        }
        else if (y >= wet(x))
        {
          kind = GROUND.wet;
        }

        set(x, y, kind);
      }
    }
  };

  /**
   * Raises an organic patch of one ground around a centre, its edge wobbling by a seeded amount so a re-run
   * carves the same patch.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   * @param {string} kind The ground.
   */
  const patch = (cx, cy, rx, ry, seed, kind) =>
  {
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, cx, cy, rx, ry, seed);
    marked.forEach((row, y) => row.forEach((isMarked, x) =>
    {
      if (isMarked)
      {
        set(x, y, kind);
      }
    }));
  };

  /**
   * Stands an organic stack of rock up out of whatever is there. Its lowest two rows become its face, so a stack
   * needs at least three rows to show a top.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const outcrop = (cx, cy, rx, ry, seed) =>
  {
    // a stack wobbles less than a patch of sand would, so it stands up as one rock rather than a ragged heap.
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, cx, cy, rx, ry, seed, 0.12);
    marked.forEach((row, y) => row.forEach((isMarked, x) =>
    {
      if (isMarked)
      {
        carved[y][x] = CELL.rock;
        ground[y][x] = null;
      }
    }));
  };

  /**
   * Sinks an organic patch of water into ground already carved, never into rock: a pool into sand or a cave
   * floor, a sandbar into the sea.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   * @param {string} kind The water, a pool or a sandbar.
   */
  const sink = (cx, cy, rx, ry, seed, kind) =>
  {
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, cx, cy, rx, ry, seed, 0.08);
    marked.forEach((row, y) => row.forEach((isMarked, x) =>
    {
      if (isMarked && carved[y][x] === CELL.floor)
      {
        ground[y][x] = kind;
      }
    }));
  };

  spec.paint({
    shore,
    rocks,
    fill,
    blob: patch,
    outcrop,
    pool: (cx, cy, rx, ry, seed) => sink(cx, cy, rx, ry, seed, spec.palette === BEACH ? GROUND.sea : GROUND.pool),
    shoal: (cx, cy, rx, ry, seed) => sink(cx, cy, rx, ry, seed, GROUND.shoal),
  });

  // sand the noise off, keeping every doorway exactly where its link put it.
  tidyCarving(carved, spec.w, spec.h, doorSquaresOf(spec.id), `Map${spec.id}`);

  // the sanding opens the odd notch of rock; it stands on whatever its neighbours stand on most.
  for (let y = 0; y < spec.h; y++)
  {
    for (let x = 0; x < spec.w; x++)
    {
      if (carved[y][x] === CELL.rock)
      {
        ground[y][x] = null;
        continue;
      }

      if (ground[y][x] !== null)
      {
        continue;
      }

      const counts = new Map();
      [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ].forEach(([ dx, dy ]) =>
      {
        const nearby = inside(x + dx, y + dy) ? ground[y + dy][x + dx] : null;
        if (nearby !== null)
        {
          counts.set(nearby, (counts.get(nearby) ?? 0) + 1);
        }
      });
      const [ [ most ] ] = [ ...counts ].sort((left, right) => right[1] - left[1]);
      ground[y][x] = most;
    }
  }

  return { carved, ground };
};

/**
 * Whether the player can stand on a square of a carving.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {boolean}
 */
const isWalkable = (carving, x, y) => carving.carved[y][x] === CELL.floor && WALKABLE.has(carving.ground[y][x]);

/**
 * Floods a carving's walkable ground from one square and returns every square it covers.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 * @param {number[]} start The square to flood from.
 * @returns {Set<string>} The squares covered, as "x,y".
 */
const floodFrom = (spec, carving, start) =>
{
  const seen = new Set([ start.join(',') ]);
  const stack = [ start ];
  while (stack.length > 0)
  {
    const [ x, y ] = stack.pop();
    [ [ x, y + 1 ], [ x, y - 1 ], [ x + 1, y ], [ x - 1, y ] ].forEach(([ nx, ny ]) =>
    {
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= spec.w || ny >= spec.h || seen.has(key) || isWalkable(carving, nx, ny) === false)
      {
        return;
      }

      seen.add(key);
      stack.push([ nx, ny ]);
    });
  }

  return seen;
};

/**
 * Proves a carved map holds together before anything is written: every doorway and landing stands on ground
 * the player can stand on, every such square can be reached from the first doorway, and anything a spec marks
 * sealed, such as the cave mouths the high tide fills, cannot be. A failure here is a recipe mistake, so it
 * stops the run rather than being patched over.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 */
const proveWalkable = (spec, carving) =>
{
  const squares = doorSquaresOf(spec.id);
  squares.forEach(([ x, y ]) =>
  {
    if (isWalkable(carving, x, y) === false)
    {
      throw new Error(`Map${spec.id}: door square ${x},${y} is not ground the player can stand on`);
    }
  });

  const everywhere = floodFrom(spec, carving, squares[0]);
  let walkable = 0;
  carving.carved.forEach((row, y) => row.forEach((_cell, x) =>
  {
    if (isWalkable(carving, x, y))
    {
      walkable++;
    }
  }));
  if (everywhere.size !== walkable)
  {
    throw new Error(`Map${spec.id}: ${walkable - everywhere.size} squares of ground cannot be reached`);
  }

  (spec.sealed ?? []).forEach(([ x, y ]) =>
  {
    if (everywhere.has(`${x},${y}`))
    {
      throw new Error(`Map${spec.id}: the sealed square ${x},${y} can be walked to`);
    }
  });
};

/**
 * The door from Shores 2 into the cove: one event whose pages choose the tide. The first page, with no
 * conditions, leads to the cove at high tide; each later page carries a J-Time `<timeOfDayPage>` tag for one of
 * the low tides and leads to the cove at low tide. MZ runs the last page whose conditions hold, so the low tide
 * wins whenever it is out. Every page carries its own `<areaEvent>`, because J-Pixelistics reads it per page.
 * @param {number} id The event id.
 * @returns {Object}
 */
const tideDoorEvent = id =>
{
  const [ high, low ] = [ ID.coveHigh, ID.coveLow ].map(map =>
  {
    const link = LINKS.find(each => each.a.map === ID.shores2 && each.b.map === map);
    const [ x, y ] = landingOf(link.b);
    return { link, to: { map, x, y, dir: link.b.dir } };
  });
  const { at, span } = high.link.a;
  const area = { code: 108, indent: 0, parameters: [ `<areaEvent:[${span[0]},${span[1]}]>` ] };

  // the page every tide falls back on: the sea is in.
  const event = transferEvent(id, 'Transfer (The Cove, by the tide)', at[0], at[1], high.to);
  event.pages[0].list.unshift(area);

  // a page for each low tide, the same door into the cove with the sea out.
  LOW_TIDES.forEach(timeOfDay =>
  {
    const page = transferEvent(id, '', at[0], at[1], low.to).pages[0];
    page.list.unshift(area, { code: 108, indent: 0, parameters: [ `<timeOfDayPage:${timeOfDay}>` ] });
    event.pages.push(page);
  });

  return event;
};

/**
 * Sits a beach's cliff edges on the layer above the ground, with the ground drawn on beneath them. The EX outside
 * sheets draw the rims of their cliffs with rounded corners that are see-through, made to sit over ground, which
 * is how Jeremy's Negative Peaks maps lay them (Map303 keeps its cliff edges on layer 1). Drawn straight onto the
 * bottom layer, those corners show the black behind the map instead. So every square of rock that touches open
 * ground, even at a corner, lifts its cliff tile onto layer 1, and layer 0 beneath it takes whatever ground its
 * open neighbours stand on most; then the ground is shaped again with those squares counted in, so the sand and
 * the sea run on under the cliff's edge instead of stopping at it. Rock further in keeps its tile on layer 0,
 * where nothing shows through.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 * @param {number[]} data The six-layer tile array, edited in place.
 */
const layerCliffEdges = (spec, carving, data) =>
{
  const { w, h } = spec;
  const { kinds, ceiling } = spec.palette;
  const isRock = (x, y) => carving.carved[y][x] === CELL.rock;
  const around = [ [ -1, -1 ], [ 0, -1 ], [ 1, -1 ], [ -1, 0 ], [ 1, 0 ], [ -1, 1 ], [ 0, 1 ], [ 1, 1 ] ];

  // the ground under each edge of rock: what most of its open neighbours stand on.
  const under = new Map();
  for (let y = 0; y < h; y++)
  {
    for (let x = 0; x < w; x++)
    {
      if (isRock(x, y) === false)
      {
        continue;
      }

      const counts = new Map();
      around.forEach(([ dx, dy ]) =>
      {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || isRock(nx, ny))
        {
          return;
        }

        const kind = kinds[carving.ground[ny][nx]];
        counts.set(kind, (counts.get(kind) ?? 0) + 1);
      });
      if (counts.size > 0)
      {
        const [ [ most ] ] = [ ...counts ].sort((left, right) => right[1] - left[1]);
        under.set(`${x},${y}`, most);
      }
    }
  }

  /**
   * The ground-layer kind at a square once the edges have ground beneath them: the ground for open squares and
   * edges, the cliff top for rock further in, and undefined beyond the map, which reads as joined.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number|undefined}
   */
  const kindAt = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= w || y >= h)
    {
      return undefined;
    }

    if (isRock(x, y) === false)
    {
      return kinds[carving.ground[y][x]];
    }

    return under.get(`${x},${y}`) ?? ceiling;
  };

  for (let y = 0; y < h; y++)
  {
    for (let x = 0; x < w; x++)
    {
      const isEdge = under.has(`${x},${y}`);
      if (isRock(x, y) && isEdge === false)
      {
        continue;
      }

      // an edge's cliff tile moves up a layer before its ground is drawn beneath it.
      if (isEdge)
      {
        data[(1 * h + y) * w + x] = data[y * w + x];
      }

      data[y * w + x] = a2TileId(kindAt, x, y);
    }
  }
};

/**
 * Builds one map's file contents: the drawn ground, its doors, and its header.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 * @returns {Object}
 */
const buildMap = (spec, carving) =>
{
  const events = [ null ];
  exitsFor(spec.id).forEach(exit =>
  {
    events.push(doorEvent(events.length, exit));
  });

  // Shores 2's way into the cove is the one door that reads the clock.
  if (spec.id === ID.shores2)
  {
    events.push(tideDoorEvent(events.length));
  }

  const { kinds } = spec.palette;
  const floorAt = (x, y) => kinds[carving.ground[y][x]];
  const data = renderCave(carving.carved, spec.w, spec.h, { ...spec.palette, floor: floorAt(...firstGround(carving)), floorAt });
  if (spec.palette.layered)
  {
    layerCliffEdges(spec, carving, data);
  }

  return {
    autoplayBgm: true,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { ...spec.music },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: spec.display,
    encounterList: [],
    encounterStep: 30,
    height: spec.h,
    note: spec.note,
    parallaxLoopX: false,
    parallaxLoopY: false,
    parallaxName: '',
    parallaxShow: true,
    parallaxSx: 0,
    parallaxSy: 0,
    scrollType: 0,
    specifyBattleback: false,
    tilesetId: spec.palette.tileset,
    width: spec.w,
    data,
    events,
  };
};

/**
 * The first carved square of a carving, whose ground stands in as the palette's plain floor; `floorAt` names
 * every square anyway, so it only has to be a real one.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 * @returns {number[]}
 */
const firstGround = carving =>
{
  for (let y = 0; y < carving.carved.length; y++)
  {
    const x = carving.carved[y].indexOf(CELL.floor);
    if (x >= 0)
    {
      return [ x, y ];
    }
  }

  throw new Error('a map with no ground at all');
};

/**
 * Builds the area's folder: a 0x0 map that holds nothing, laid out exactly as MZ saves the region's other
 * "FIELD:" folders.
 * @returns {Object}
 */
const buildFolder = () =>
{
  return {
    autoplayBgm: false,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: '', pan: 0, pitch: 100, volume: 90 },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: '',
    encounterList: [],
    encounterStep: 30,
    height: 0,
    note: '',
    parallaxLoopX: false,
    parallaxLoopY: false,
    parallaxName: '',
    parallaxShow: true,
    parallaxSx: 0,
    parallaxSy: 0,
    scrollType: 0,
    specifyBattleback: false,
    tilesetId: 1,
    width: 0,
    data: [],
    events: [],
  };
};

/**
 * Prints a carving as text: `#` rock, `.` dry sand or cave floor, `,` wet sand, `~` sea, `=` a sandbar, `o` a
 * pool, and `D` a door square.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ground: string[][]}} carving The map's carving.
 */
const printPlan = (spec, carving) =>
{
  const doors = new Set(doorSquaresOf(spec.id).map(square => square.join(',')));
  const glyph = { dry: '.', floor: '.', wet: ',', sea: '~', shoal: '=', pool: 'o' };

  console.log(`\nMap${spec.id} ${spec.tree} ${spec.w}x${spec.h}`);
  const tens = Array.from({ length: spec.w }, (_, x) => (x % 10 === 0 ? String(x / 10 % 10) : ' ')).join('');
  console.log(`    ${tens}`);
  carving.carved.forEach((row, y) =>
  {
    const line = row.map((cell, x) =>
    {
      if (doors.has(`${x},${y}`))
      {
        return 'D';
      }

      return cell === CELL.rock ? '#' : glyph[carving.ground[y][x]];
    }).join('');
    console.log(`${String(y).padStart(3)} ${line}`);
  });
};

// prove every link and every map before writing any of them, so a bad recipe never leaves a half-written
// staging run.
proveLinksKeepHeading();
const carvings = SPECS.map(spec =>
{
  const carving = carveMap(spec);
  if (process.argv.includes('--plan'))
  {
    printPlan(spec, carving);
  }

  proveWalkable(spec, carving);
  return { spec, carving };
});

await Bun.$`mkdir -p ${OUT}`.quiet();

// the folder goes first, so the tree has its branch before any map is hung on it.
await Bun.write(`${OUT}/Map${FIELD.id}.json`, serialise(buildFolder()));
const built = carvings.map(({ spec, carving }) => ({ spec, map: buildMap(spec, carving) }));
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else. The folder
// hangs under the region, and every map under the folder, in id order.
const manifest = [
  { id: FIELD.id, tree: FIELD.tree, parentId: REGION, order: FIELD.id, w: 0, h: 0, events: 0 },
  ...built.map(({ spec, map }) => ({
    id: spec.id,
    tree: spec.tree,
    parentId: FIELD.id,
    order: spec.id,
    w: spec.w,
    h: spec.h,
    events: map.events.filter(Boolean).length,
  })),
];
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote the folder and ${built.length} maps to staging`);
built.forEach(({ spec, map }) =>
{
  console.log(`  Map${spec.id} ${spec.tree.padEnd(22)} ${spec.w}x${spec.h}  tileset ${spec.palette.tileset}  events=${map.events.filter(Boolean).length}`);
});
//endregion shores
