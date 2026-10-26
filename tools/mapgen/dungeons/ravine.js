//region ravine
/**
 * The Crystalline Ravine: an optional chapter 4 dungeon off the Erocia Isthmus, drafted to the spec in
 * `docs/maps/ravine.md` - "a crystalline cavern with massive gaping holes to encourage you to use your snake
 * rope a bunch" (Jeremy), old and magical, with the oldest surviving structure anyone knows of at its far end.
 * Floors, walls, doorways and rope posts only: no enemies, no treasure, no decoration. Those are Jeremy's
 * passes.
 *
 * "Not a huge place in the sense that it has 500000 maps, but making the few maps it has enormous is perfect"
 * (Jeremy), so it is four big caverns and the chamber at the end, all hung under the dungeon's folder after
 * `Map330`, the entrance Jeremy built himself. Each cavern is mostly hole: the ground is broken into crystal
 * islands, the way on hops between them by Snake Rope, and the islands off the way on hold the loot, reachable
 * only by rope. Every cavern also keeps one island big enough for a named fight.
 *
 * Every map wears tileset 14 in `Map330`'s own palette, which is the tileset, tiling and walls Jeremy meant the
 * whole dungeon to use: the blue crystal floor, the purple crystal walls, and the hole with a blue crystal rim
 * that the sheet draws to go with that floor. The chamber is built rather than grown, so it is walled in white
 * stone and floored with the worked stone the Earthen Tomb (`Map172`) is floored with.
 *
 * Usage: bun tools/mapgen/dungeons/ravine.js [--plan]
 *        bun tools/mapgen/snapshot.js 445 --staged --out ravine.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js gates 291
 *
 * `--plan` prints each carving as text before writing, for reading a layout without rendering it.
 *
 * `mapgen/validate.js` cannot judge these maps. Its passability is vanilla, and CA's ceilings are walkable in
 * vanilla, sealed only by terrain tag 1 through J-RegionEffects; `map-atlas` reads that rule and this recipe
 * proves its own floors connected before writing anything.
 */
import { DATA } from '../paths.js';
import { blob, serialise, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor } from '../doors.js';

/**
 * The map tree node every map here hangs under: Map291, "DUNGEON: Crystalline Ravine", which already holds
 * Jeremy's `Map330`.
 * @type {number}
 */
const PARENT = 291;

/**
 * `Map330`'s look: the blue crystal floor ("A2 ground 10" in the jmz map editor), under the purple crystal
 * ceiling and wall ("A4 ceiling 6" and "A4 wall 14"), with "A2 decoration 14" as the holes. That decoration is
 * the sheet's hole for this very floor, rimmed in the same blue crystal, and impassable on every shape.
 * @type {{floor: number, ceiling: number, face: number, chasm: number}}
 */
const CRYSTAL = { floor: 25, ceiling: 85, face: 93, chasm: 29 };

/**
 * The worked stone the chamber is floored with: the A5 tile the Earthen Tomb (`Map172`) lays across its own
 * floor, the one other place on this tileset where something old was built rather than grown.
 * @type {number}
 */
const WORKED_STONE = 1568;

/**
 * A stand-in kind for worked stone while the chamber is drawn. `cave.js` lays autotile kinds, and an A5 tile
 * is not one, so the chamber's floor is drawn as this kind and swapped for `WORKED_STONE` afterwards. It is the
 * first A3 kind, which tileset 14 has no sheet for, so nothing else on the map can ever hold it; and because it
 * differs from the crystal floor, the crystal still draws its rim where the two floors meet.
 * @type {number}
 */
const WORKED_STONE_STAND_IN = 48;

/**
 * The chamber's look: white stone walls whose faces end in columns ("A4 ceiling 33" and "A4 wall 41"), worked
 * stone underfoot, and the crystal floor only where the cavern runs in through its door.
 * @type {{floor: number, ceiling: number, face: number}}
 */
const RUIN = { floor: CRYSTAL.floor, ceiling: 112, face: 120 };

/**
 * How far apart a rope crossing's two posts stand, as the fewest and most tiles. The rope itself reaches 8
 * (`ROPE_REACH` in `map-atlas.js`), and Jeremy remembers it as "about 5", so every crossing here is 4 or 5.
 * @type {{least: number, most: number}}
 */
const ROPE_SPAN = { least: 4, most: 5 };

/**
 * The fewest squares a patch of hole standing on its own may have. Anything smaller reads as noise in the ground
 * rather than as a gaping hole, so it is filled in (see `sandSpecks`); the great holes run to thousands.
 * @type {number}
 */
const LEAST_HOLE = 25;

/**
 * How far a rope crossing's jetties reach back from each post towards the island the post belongs to. Islands
 * are wobbly blobs, so a jetty long enough to be sure of meeting its island simply overlaps it when it is
 * close.
 * @type {number}
 */
const JETTY_REACH = 5;

/**
 * The dungeon's music, `Map330`'s own: the whole ravine keeps the entrance's track.
 * @type {{name: string, pan: number, pitch: number, volume: number}}
 */
const THEME = { name: '_SM-InfectedWaters', pan: 0, pitch: 100, volume: 100 };

/**
 * Every map's note, and `Map330`'s too: no day or night underground, the `glimmer` weather (cyan motes, sparks
 * rising out of the chasms, the odd glint), and 80% of the light gone into a deep navy dark, so the blue floor and
 * purple crystal stay in palette while the glowing crystals Jeremy places carry the light (2026-10-25).
 * @type {string}
 */
const NOTE = '<noToneChange>\n<weather:glimmer>\n<ambient:[80, #10103a]>';

// every link names both doorways, in Jeremy's door format (see `doors.js`). Map330 is Jeremy's, so the recipe
// never writes its half of the first door; that half was added to it by hand on 2026-10-25, at his go: an event at
// (19,1) with <areaEvent:[5,1]>, covering the whole of row 1 where his corridor opens to the top edge,
// transferring to Map445 (45,61) facing up. The way back lands at (21,2).
const LINKS = [
  {
    a: { map: 330, at: [ 19, 1 ], span: [ 5, 1 ], dir: 2, silent: true },
    b: { map: 445, at: [ 43, 62 ], span: [ 5, 1 ], dir: 8 },
  },
  {
    a: { map: 445, at: [ 70, 1 ], span: [ 5, 1 ], dir: 2 },
    b: { map: 446, at: [ 18, 58 ], span: [ 5, 1 ], dir: 8 },
  },
  {
    a: { map: 446, at: [ 94, 26 ], span: [ 1, 5 ], dir: 4 },
    b: { map: 447, at: [ 1, 38 ], span: [ 1, 5 ], dir: 6 },
  },
  {
    a: { map: 447, at: [ 58, 1 ], span: [ 5, 1 ], dir: 2 },
    b: { map: 448, at: [ 42, 64 ], span: [ 5, 1 ], dir: 8 },
  },
  {
    a: { map: 448, at: [ 42, 1 ], span: [ 5, 1 ], dir: 2 },
    b: { map: 449, at: [ 22, 32 ], span: [ 5, 1 ], dir: 8 },
  },
];

// each cavern opens a great `gulf` of hole first, then raises its islands out of it: `hollow` for an organic
// island, `dig` for anything straight, such as a land bridge or the neck of a door. A `rope` strings a Snake
// Rope crossing between two posts, digging a three-wide jetty back from each post to its island and keeping the
// channel between them open hole, so no island can grow across it. A `pillar` stands a crystal formation up out
// of the hole or the ground. `loot` and `arena` mark the islands the loot and the named fights are meant for:
// the recipe proves a loot island can only be reached by rope, and the spec names both. In the chamber, `built`
// floors the structure with worked stone.
const SPECS = [
  {
    id: 445, tree: 'Ravine 1', w: 90, h: 64,
    carve: ({ dig, hollow, gulf, rope, pillar, loot, arena }) =>
    {
      gulf(45, 32, 39, 26, 44501);

      // up from Map330 through the door's neck onto the first island.
      dig(43, 56, 47, 63);
      hollow(45, 52, 9, 5, 44502);

      // west over a land bridge to the arena.
      dig(30, 50, 38, 54);
      hollow(20, 46, 11, 8, 44503);
      arena(20, 46);

      // roped north, then east to the middle island.
      hollow(17, 22, 8, 6, 44504);
      rope(18, 34, 18, 29);
      hollow(46, 20, 10, 6, 44505);
      rope(28, 21, 33, 21);

      // roped east to the last island and out through the top wall to Ravine 2.
      hollow(74, 14, 8, 6, 44506);
      rope(59, 16, 64, 16);
      dig(70, 0, 74, 10);

      // three loot islands, each one rope off the way on. The one in the north-west corner sits on a ledge the
      // great hole never reached, so a smaller hole is opened under it for the rope to cross.
      hollow(70, 51, 5, 4, 44507);
      rope(56, 51, 61, 51);
      loot(70, 51);
      hollow(11, 7, 5, 3, 44508);
      rope(12, 14, 12, 10);
      gulf(12, 11, 8, 4, 44509);
      loot(11, 7);
      hollow(46, 37, 5, 3, 44510);
      rope(46, 29, 46, 33);
      loot(46, 37);

      // crystal standing up out of the deep.
      pillar(31, 33, 3, 4, 44511);
      pillar(62, 32, 4, 5, 44512);
      pillar(82, 38, 3, 4, 44513);
      pillar(34, 8, 3, 3, 44514);
    },
  },
  {
    id: 446, tree: 'Ravine 2', w: 96, h: 60,
    carve: ({ dig, hollow, gulf, rope, pillar, loot, arena }) =>
    {
      gulf(48, 30, 43, 25, 44601);

      // up from Ravine 1 through the door's neck onto the first island.
      dig(18, 53, 22, 59);
      hollow(20, 50, 8, 5, 44602);

      // roped north, then east to the arena.
      hollow(16, 27, 8, 7, 44603);
      rope(20, 43, 20, 38);
      hollow(48, 30, 14, 10, 44604);
      rope(27, 26, 32, 26);
      arena(48, 30);

      // roped east to the last island and out through the east wall to Ravine 3.
      hollow(82, 30, 9, 7, 44605);
      rope(65, 30, 70, 30);
      dig(88, 26, 95, 30);

      // three loot islands, each one rope off the way on.
      hollow(50, 8, 5, 3, 44606);
      rope(50, 17, 50, 13);
      loot(50, 8);
      hollow(48, 52, 6, 3, 44607);
      rope(48, 43, 48, 48);
      loot(48, 52);
      hollow(84, 10, 5, 3, 44608);
      rope(84, 21, 84, 16);
      loot(84, 10);

      // crystal standing up out of the deep, clear of the south wall: the hole there is too narrow for another.
      pillar(67, 44, 3, 3, 44610);
      pillar(30, 10, 4, 4, 44611);
      pillar(68, 14, 3, 3, 44612);
    },
  },
  {
    id: 447, tree: 'Ravine 3', w: 84, h: 68,
    carve: ({ dig, hollow, gulf, rope, pillar, loot, arena }) =>
    {
      gulf(42, 34, 37, 29, 44701);

      // in through the west wall onto the first island.
      dig(0, 38, 8, 42);
      hollow(12, 40, 8, 6, 44702);

      // roped east to the arena, then north to the last island and out through the top wall to Ravine 4.
      hollow(42, 44, 13, 9, 44703);
      rope(22, 42, 27, 42);
      arena(42, 44);
      hollow(54, 20, 10, 6, 44704);
      rope(50, 34, 50, 29);
      dig(58, 0, 62, 16);

      // three loot islands, each one rope off the way on.
      hollow(14, 16, 5, 4, 44705);
      rope(14, 31, 14, 26);
      loot(14, 16);
      hollow(70, 45, 5, 5, 44706);
      rope(57, 45, 62, 45);
      loot(70, 45);
      hollow(75, 18, 4, 4, 44707);
      rope(66, 18, 71, 18);
      loot(75, 18);

      // crystal standing up out of the deep.
      pillar(30, 24, 4, 5, 44708);
      pillar(70, 32, 3, 4, 44709);
      pillar(38, 8, 4, 3, 44710);
      pillar(30, 60, 3, 3, 44711);
    },
  },
  {
    id: 448, tree: 'Ravine 4', w: 90, h: 66,
    carve: ({ dig, hollow, gulf, rope, pillar, loot, arena }) =>
    {
      gulf(45, 33, 40, 28, 44801);

      // up from Ravine 3 through the door's neck onto the first island.
      dig(42, 59, 46, 65);
      hollow(44, 55, 10, 6, 44802);

      // roped west, north, then east to the arena: the longest run of rope in the ravine.
      hollow(16, 52, 8, 6, 44803);
      rope(32, 53, 27, 53);
      hollow(14, 28, 8, 7, 44804);
      rope(15, 43, 15, 38);
      hollow(46, 28, 14, 10, 44805);
      rope(25, 28, 30, 28);
      arena(46, 28);

      // roped north to the last island and out through the top wall to the chamber.
      hollow(44, 9, 8, 4, 44806);
      rope(44, 17, 44, 13);
      dig(42, 0, 46, 8);

      // four loot islands, each one rope off the way on. The one in the north-west corner sits on a ledge the
      // great hole never reached, so a smaller hole is opened under it for the rope to cross.
      hollow(70, 54, 6, 4, 44807);
      rope(56, 54, 61, 54);
      loot(70, 54);
      hollow(74, 26, 5, 4, 44808);
      rope(62, 26, 67, 26);
      loot(74, 26);
      hollow(14, 8, 5, 3, 44809);
      rope(14, 18, 14, 13);
      gulf(14, 15, 8, 4, 44810);
      loot(14, 8);
      hollow(66, 9, 5, 3, 44811);
      rope(54, 9, 59, 9);
      loot(66, 9);

      // crystal standing up out of the deep.
      pillar(60, 42, 4, 4, 44812);
      pillar(28, 10, 4, 4, 44813);
      pillar(82, 40, 3, 5, 44814);
      pillar(30, 40, 3, 3, 44815);
    },
  },
  {
    id: 449, tree: 'The Oldest Structure', w: 48, h: 34, palette: RUIN, display: 'The Oldest Structure',
    carve: ({ dig, pillar, built }) =>
    {
      // up from Ravine 4 through the door's neck: the last of the cavern, still crystal underfoot.
      dig(22, 26, 26, 33);

      // where the structure begins: a vestibule, then the hall, worked stone from here on.
      dig(16, 21, 32, 25);
      dig(22, 19, 26, 21);
      dig(8, 7, 40, 19);
      built(3, 1, 45, 25);

      // a niche either side of the hall, and the apse at its head, whose back wall is left bare for Cerak's
      // sigil-script.
      dig(3, 11, 7, 15);
      dig(41, 11, 45, 15);
      dig(19, 3, 29, 6);

      // two columns either side of the nave.
      pillar(13, 9, 1, 1);
      pillar(13, 14, 1, 1);
      pillar(34, 9, 1, 1);
      pillar(34, 14, 1, 1);
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
 * The squares strictly between a rope crossing's two posts, the channel the rope flies over.
 * @param {number[][]} crossing The crossing's two post squares.
 * @returns {number[][]}
 */
const channelOf = ([ [ x1, y1 ], [ x2, y2 ] ]) =>
{
  const squares = [];
  const length = Math.abs(x1 - x2) + Math.abs(y1 - y2);
  const stepX = Math.sign(x2 - x1);
  const stepY = Math.sign(y2 - y1);
  for (let step = 1; step < length; step++)
  {
    squares.push([ x1 + stepX * step, y1 + stepY * step ]);
  }

  return squares;
};

/**
 * Floods a carving's floor from one square and returns every square it covers, crossing the given ropes.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[][][]} ropes The rope crossings the flood may use; none floods on foot only.
 * @param {number[]} start The square to flood from.
 * @returns {Set<string>} The squares covered, as "x,y".
 */
const floodFrom = (spec, carved, ropes, start) =>
{
  // each post leads to its partner across the gap, both ways.
  const across = new Map();
  ropes.forEach(([ from, to ]) =>
  {
    across.set(from.join(','), to);
    across.set(to.join(','), from);
  });

  const seen = new Set([ start.join(',') ]);
  const stack = [ start ];
  while (stack.length > 0)
  {
    const [ x, y ] = stack.pop();
    const ropeTo = across.get(`${x},${y}`);
    const nexts = [ [ x, y + 1 ], [ x, y - 1 ], [ x + 1, y ], [ x - 1, y ] ];
    if (ropeTo !== undefined)
    {
      nexts.push(ropeTo);
    }

    nexts.forEach(([ nx, ny ]) =>
    {
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= spec.w || ny >= spec.h || seen.has(key) || carved[ny][nx] !== CELL.floor)
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
 * Proves a carved map holds together the way the ravine needs it to, before anything is written: every door
 * and post stands on floor; every rope crossing is a real one, a channel of open hole between two posts on
 * jetty tips that nothing joins on foot; every floor square can be reached from the first door, ropes
 * included; and every loot island can be reached only by rope. A failure here is a recipe mistake, so it stops
 * the run rather than being patched over.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[][][]} ropes The map's rope crossings, each a pair of post squares.
 * @param {number[][]} loots The squares the map's loot islands are marked at.
 */
const proveConnected = (spec, carved, ropes, loots) =>
{
  const squares = doorSquaresOf(spec.id);
  [ ...squares, ...ropes.flat(), ...loots ].forEach(([ x, y ]) =>
  {
    if (carved[y][x] !== CELL.floor)
    {
      throw new Error(`Map${spec.id}: door, post or loot square ${x},${y} is not floor`);
    }
  });

  ropes.forEach(crossing =>
  {
    const [ [ x1, y1 ], [ x2, y2 ] ] = crossing;
    const label = `Map${spec.id}: the rope from ${x1},${y1} to ${x2},${y2}`;

    // the rope flies over open hole, and each post stands on the tip of a jetty: hole ahead, ground behind.
    channelOf(crossing).forEach(([ x, y ]) =>
    {
      if (carved[y][x] !== CELL.chasm)
      {
        throw new Error(`${label} flies over ${x},${y}, which is not hole`);
      }
    });
    [ [ x1, y1, x2, y2 ], [ x2, y2, x1, y1 ] ].forEach(([ postX, postY, farX, farY ]) =>
    {
      const behindX = postX - Math.sign(farX - postX);
      const behindY = postY - Math.sign(farY - postY);
      if (carved[behindY][behindX] !== CELL.floor)
      {
        throw new Error(`${label}: the post at ${postX},${postY} has no ground behind it`);
      }
    });

    // a crossing whose two ends already meet on foot crosses nothing.
    if (floodFrom(spec, carved, [], [ x1, y1 ]).has(`${x2},${y2}`))
    {
      throw new Error(`${label} joins two places already joined on foot`);
    }
  });

  const everywhere = floodFrom(spec, carved, ropes, squares[0]);
  const floorCount = carved.flat().filter(cell => cell === CELL.floor).length;
  if (everywhere.size !== floorCount)
  {
    throw new Error(`Map${spec.id}: ${floorCount - everywhere.size} floor squares cannot be reached`);
  }

  const onFoot = floodFrom(spec, carved, [], squares[0]);
  loots.forEach(([ x, y ]) =>
  {
    if (onFoot.has(`${x},${y}`))
    {
      throw new Error(`Map${spec.id}: the loot island at ${x},${y} can be walked to without the rope`);
    }
  });
};

/**
 * Carves one map out of solid rock by running its spec's carve function, then keeps every rope's channel open
 * and sands the blobs' noise off.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], ropes: number[][][], loots: number[][], arenas: number[][], worked: Set<string>}}
 * What every square holds, the rope crossings, the loot and arena marks, and the squares floored with worked
 * stone.
 */
const carveMap = spec =>
{
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(CELL.rock));
  const ropes = [];
  const loots = [];
  const arenas = [];
  const worked = new Set();
  const inside = (x, y) => x >= 0 && y >= 0 && x < spec.w && y < spec.h;

  /**
   * Cuts an axis-aligned stretch of ground between two corners, inclusive, clipped to the map.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const dig = (x1, y1, x2, y2) =>
  {
    for (let y = Math.max(0, y1); y <= Math.min(spec.h - 1, y2); y++)
    {
      for (let x = Math.max(0, x1); x <= Math.min(spec.w - 1, x2); x++)
      {
        carved[y][x] = CELL.floor;
      }
    }
  };

  /**
   * Raises an organic island of ground around a centre, its edge wobbling by a seeded amount so a re-run
   * carves the same island.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const hollow = (cx, cy, rx, ry, seed) =>
  {
    blob(carved, spec.w, spec.h, CELL.floor, cx, cy, rx, ry, seed);
  };

  /**
   * Opens a great organic hole around a centre. Its edge wobbles less than an island's, because at this size
   * an island's wobble would throw the edge a third of the map off course; and it only ever replaces rock, so
   * ground cut before it survives.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const gulf = (cx, cy, rx, ry, seed) =>
  {
    const opened = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(opened, spec.w, spec.h, true, cx, cy, rx, ry, seed, 0.12);
    for (let y = 0; y < spec.h; y++)
    {
      for (let x = 0; x < spec.w; x++)
      {
        if (opened[y][x] && carved[y][x] === CELL.rock)
        {
          carved[y][x] = CELL.chasm;
        }
      }
    }
  };

  /**
   * Stands a crystal formation up out of the hole or the ground: rock again, which hangs a crystal face below
   * itself like any wall. With a seed it is an organic blob; without one it is a block exactly 2rx wide and
   * 2ry + 2 tall, a built column whose lowest two rows are its face.
   * @param {number} cx The centre column, or for a block, its left column.
   * @param {number} cy The centre row, or for a block, its top row.
   * @param {number} rx The horizontal radius, or for a block, half its width.
   * @param {number} ry The vertical radius, or for a block, half its height above its face.
   * @param {number} [seed] The wobble's seed, for an organic formation.
   */
  const pillar = (cx, cy, rx, ry, seed) =>
  {
    if (seed === undefined)
    {
      for (let y = cy; y < cy + ry * 2 + 2; y++)
      {
        for (let x = cx; x < cx + rx * 2; x++)
        {
          carved[y][x] = CELL.rock;
        }
      }

      return;
    }

    blob(carved, spec.w, spec.h, CELL.rock, cx, cy, rx, ry, seed);
  };

  /**
   * Strings a Snake Rope crossing between two squares, a durable post standing on each so the rope can be
   * fired either way. The two must share a row or a column, the rope flying straight, and stand 4 or 5 apart.
   * A three-wide jetty is dug back from each post towards its own island, long enough to meet it.
   * @param {number} x1 The first post's column.
   * @param {number} y1 The first post's row.
   * @param {number} x2 The second post's column.
   * @param {number} y2 The second post's row.
   */
  const rope = (x1, y1, x2, y2) =>
  {
    const straight = x1 === x2 || y1 === y2;
    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    if (straight === false || distance < ROPE_SPAN.least || distance > ROPE_SPAN.most)
    {
      throw new Error(`Map${spec.id}: ${x1},${y1} to ${x2},${y2} is not a crossing the ravine uses`);
    }

    // each jetty runs from its post away from the gap, one square either side of the rope's line.
    [ [ x1, y1, x2, y2 ], [ x2, y2, x1, y1 ] ].forEach(([ postX, postY, farX, farY ]) =>
    {
      const backX = -Math.sign(farX - postX);
      const backY = -Math.sign(farY - postY);
      for (let step = 0; step <= JETTY_REACH; step++)
      {
        for (let side = -1; side <= 1; side++)
        {
          const x = postX + backX * step + (backY === 0 ? 0 : side);
          const y = postY + backY * step + (backX === 0 ? 0 : side);
          if (inside(x, y))
          {
            carved[y][x] = CELL.floor;
          }
        }
      }
    });

    ropes.push([ [ x1, y1 ], [ x2, y2 ] ]);
  };

  /**
   * Marks the island a loot cache is meant for, which the recipe proves only the rope reaches.
   * @param {number} x The column.
   * @param {number} y The row.
   */
  const loot = (x, y) =>
  {
    loots.push([ x, y ]);
  };

  /**
   * Marks the island a named fight is meant for.
   * @param {number} x The column.
   * @param {number} y The row.
   */
  const arena = (x, y) =>
  {
    arenas.push([ x, y ]);
  };

  /**
   * Floors a rectangle with worked stone instead of crystal, wherever ground is carved inside it.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const built = (x1, y1, x2, y2) =>
  {
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        worked.add(`${x},${y}`);
      }
    }
  };

  /**
   * Keeps every rope's channel and its two flanking lines open hole, so no island grows across a crossing.
   */
  const openChannels = () =>
  {
    ropes.forEach(crossing =>
    {
      // a crossing along a row is flanked by the rows above and below it; one along a column, by the columns.
      const [ [ , y1 ], [ , y2 ] ] = crossing;
      const [ flankX, flankY ] = y1 === y2 ? [ 0, 1 ] : [ 1, 0 ];
      channelOf(crossing).forEach(([ x, y ]) =>
      {
        // the line itself is always hole; a flank only turns to hole where it was open, so no wall is cut.
        carved[y][x] = CELL.chasm;
        [ -1, 1 ].forEach(side =>
        {
          const besideX = x + flankX * side;
          const besideY = y + flankY * side;
          if (inside(besideX, besideY) && carved[besideY][besideX] !== CELL.rock)
          {
            carved[besideY][besideX] = CELL.chasm;
          }
        });
      });
    });
  };

  /**
   * Every square of every rope's channel and its flanks, as "x,y": the hole a rope flies over, which no sanding
   * may fill however narrow it is.
   * @returns {Set<string>}
   */
  const channelSquares = () =>
  {
    const squares = new Set();
    ropes.forEach(crossing =>
    {
      const [ [ , y1 ], [ , y2 ] ] = crossing;
      const [ flankX, flankY ] = y1 === y2 ? [ 0, 1 ] : [ 1, 0 ];
      channelOf(crossing).forEach(([ x, y ]) =>
      {
        [ -1, 0, 1 ].forEach(side => squares.add(`${x + flankX * side},${y + flankY * side}`));
      });
    });

    return squares;
  };

  /**
   * Labels every square of ground with the landmass it belongs to, on foot: two squares share a label exactly
   * when the player can walk from one to the other.
   * @returns {Map<string, number>} Each ground square, as "x,y", to its landmass.
   */
  const landmasses = () =>
  {
    const labels = new Map();
    for (let y = 0; y < spec.h; y++)
    {
      for (let x = 0; x < spec.w; x++)
      {
        if (carved[y][x] !== CELL.floor || labels.has(`${x},${y}`))
        {
          continue;
        }

        const label = labels.size;
        floodFrom(spec, carved, [], [ x, y ]).forEach(square => labels.set(square, label));
      }
    }

    return labels;
  };

  /**
   * Fills in every speck of hole, so every hole left is a real gap: any square of hole that no three-by-three
   * of hole fits around, and any patch of hole on its own smaller than `LEAST_HOLE`. A rope's channel is never
   * touched. Each patch of specks is floored over when ground borders it at least as much as rock does and it
   * touches only one landmass, and turned to rock otherwise; so a notch bitten into an island becomes island, a
   * speck in a wall's face becomes wall, and nothing that was apart is ever joined.
   */
  const sandSpecks = () =>
  {
    const isHole = (x, y) => inside(x, y) && carved[y][x] === CELL.chasm;
    const steps = [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ];
    const channel = channelSquares();

    // the hole that some three-by-three of hole fits around.
    const roomy = new Set();
    for (let y = 0; y + 2 < spec.h; y++)
    {
      for (let x = 0; x + 2 < spec.w; x++)
      {
        const block = [ 0, 1, 2 ].flatMap(dy => [ 0, 1, 2 ].map(dx => [ x + dx, y + dy ]));
        if (block.every(([ bx, by ]) => isHole(bx, by)))
        {
          block.forEach(square => roomy.add(square.join(',')));
        }
      }
    }

    const specks = new Set();
    for (let y = 0; y < spec.h; y++)
    {
      for (let x = 0; x < spec.w; x++)
      {
        const key = `${x},${y}`;
        if (isHole(x, y) && roomy.has(key) === false && channel.has(key) === false)
        {
          specks.add(key);
        }
      }
    }

    /**
     * Every square 4-joined to a starting square that passes a test, as "x,y".
     * @param {number[]} start The square to start from.
     * @param {function(number, number): boolean} joins Whether a square belongs.
     * @returns {Set<string>}
     */
    const groupFrom = (start, joins) =>
    {
      const group = new Set([ start.join(',') ]);
      const stack = [ start ];
      while (stack.length > 0)
      {
        const [ x, y ] = stack.pop();
        steps.forEach(([ dx, dy ]) =>
        {
          const key = `${x + dx},${y + dy}`;
          if (group.has(key) === false && joins(x + dx, y + dy))
          {
            group.add(key);
            stack.push([ x + dx, y + dy ]);
          }
        });
      }

      return group;
    };

    // what is left of each hole once the specks are gone: a patch of it standing on its own that is too small to
    // read as a gap is a speck too, unless a rope flies over it.
    const visited = new Set();
    for (let y = 0; y < spec.h; y++)
    {
      for (let x = 0; x < spec.w; x++)
      {
        const key = `${x},${y}`;
        if (isHole(x, y) === false || specks.has(key) || visited.has(key))
        {
          continue;
        }

        const patch = groupFrom([ x, y ], (px, py) => isHole(px, py) && specks.has(`${px},${py}`) === false);
        patch.forEach(square => visited.add(square));
        const ropeCrosses = [ ...patch ].some(square => channel.has(square));
        if (patch.size < LEAST_HOLE && ropeCrosses === false)
        {
          patch.forEach(square => specks.add(square));
        }
      }
    }

    // fill each patch of specks, deciding floor or rock from what borders it.
    const labels = landmasses();
    const filled = new Set();
    specks.forEach(key =>
    {
      if (filled.has(key))
      {
        return;
      }

      const start = key.split(',').map(Number);
      const patch = groupFrom(start, (px, py) => specks.has(`${px},${py}`));
      let rockBeside = 0;
      let groundBeside = 0;
      const touched = new Set();
      patch.forEach(square =>
      {
        const [ x, y ] = square.split(',').map(Number);
        steps.forEach(([ dx, dy ]) =>
        {
          const besideKey = `${x + dx},${y + dy}`;
          if (inside(x + dx, y + dy) === false || patch.has(besideKey))
          {
            return;
          }

          const beside = carved[y + dy][x + dx];
          if (beside === CELL.rock)
          {
            rockBeside++;
          }
          else if (beside === CELL.floor)
          {
            groundBeside++;
            touched.add(labels.get(besideKey));
          }
        });
      });

      const fill = groundBeside >= rockBeside && touched.size === 1 ? CELL.floor : CELL.rock;
      patch.forEach(square =>
      {
        const [ x, y ] = square.split(',').map(Number);
        carved[y][x] = fill;
        filled.add(square);
      });
    });
  };

  spec.carve({ dig, hollow, gulf, rope, pillar, loot, arena, built });
  openChannels();

  // sand the blobs' noise off, never touching a door, a post or a loot mark; reopen any channel it closed; and
  // fill in the specks of hole it leaves. Filling can leave a spur for the next tidy, so the three take turns
  // until a whole round changes nothing.
  const keep = [ ...doorSquaresOf(spec.id), ...ropes.flat(), ...loots ];
  const snapshot = () => carved.map(row => row.join('')).join('|');
  for (let round = 1; ; round++)
  {
    const before = snapshot();
    tidyCarving(carved, spec.w, spec.h, keep, `Map${spec.id}`);
    openChannels();
    sandSpecks();
    if (snapshot() === before)
    {
      break;
    }

    if (round === 10)
    {
      throw new Error(`Map${spec.id}: tidying and sanding never settled`);
    }
  }

  return { carved, ropes, loots, arenas, worked };
};

/**
 * A durable post, the Snake Rope's anchor, shaped exactly like the two standing in Map331: J-ABS reads it as
 * enemy 33 from its page comment, and `through` lets the rope pull the player right up to it.
 * @param {number} id The event id.
 * @param {number} x The post's column.
 * @param {number} y The post's row.
 * @returns {Object}
 */
const postEvent = (id, x, y) => ({
  id,
  name: 'durable post',
  note: '',
  pages: [ {
    conditions: {
      actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
      switch1Id: 97, switch1Valid: false, switch2Id: 1, switch2Valid: false,
      variableId: 1, variableValid: false, variableValue: 0,
    },
    directionFix: true,
    image: { tileId: 0, characterName: '$stake', direction: 2, pattern: 1, characterIndex: 0 },
    list: [
      { code: 108, indent: 0, parameters: [ '<enemyId:33>' ] },
      { code: 0, indent: 0, parameters: [] },
    ],
    moveFrequency: 3,
    moveRoute: { list: [ { code: 0, parameters: [] } ], repeat: true, skippable: false, wait: false },
    moveSpeed: 3, moveType: 0, priorityType: 1, stepAnime: false, through: true, trigger: 0, walkAnime: true,
  } ],
  x,
  y,
});

/**
 * Draws one map's tiles: the cave in its palette, with any worked stone drawn as its stand-in kind and then
 * swapped for the real A5 tile, so the crystal floor around it still draws its rim.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {Set<string>} worked The squares floored with worked stone, as "x,y".
 * @returns {number[]}
 */
const drawTiles = (spec, carved, worked) =>
{
  const palette = spec.palette ?? CRYSTAL;
  const floorAt = (x, y) => (worked.has(`${x},${y}`) ? WORKED_STONE_STAND_IN : palette.floor);
  const data = renderCave(carved, spec.w, spec.h, { ...palette, floorAt });

  // the stand-in's tile ids are the first 48 past the A2 sheet; every one of them becomes worked stone.
  const first = 2048 + WORKED_STONE_STAND_IN * 48;
  for (let index = 0; index < spec.w * spec.h; index++)
  {
    if (data[index] >= first && data[index] < first + 48)
    {
      data[index] = WORKED_STONE;
    }
  }

  return data;
};

/**
 * Builds one map's file contents: the drawn cave, its doors and rope posts, and the header every map in the
 * ravine shares with `Map330`.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ropes: number[][][], worked: Set<string>}} carving The map's carving.
 * @returns {Object}
 */
const buildMap = (spec, carving) =>
{
  const events = [ null ];
  exitsFor(spec.id).forEach((exit, index) =>
  {
    events.push(doorEvent(index + 1, exit));
  });

  // the posts follow the doors, numbered on from them.
  carving.ropes.flat().forEach(([ x, y ]) =>
  {
    events.push(postEvent(events.length, x, y));
  });

  return {
    autoplayBgm: true,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { ...THEME },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: spec.display ?? 'Crystalline Ravine',
    encounterList: [],
    encounterStep: 30,
    height: spec.h,
    note: NOTE,
    parallaxLoopX: false,
    parallaxLoopY: false,
    parallaxName: '',
    parallaxShow: true,
    parallaxSx: 0,
    parallaxSy: 0,
    scrollType: 0,
    specifyBattleback: false,
    tilesetId: 14,
    width: spec.w,
    data: drawTiles(spec, carving.carved, carving.worked),
    events,
  };
};

/**
 * Prints a carving as text: `#` rock, `.` ground, a space for hole, `P` a post, `D` a door square, `L` a loot
 * mark, `A` an arena mark, and `=` worked stone.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], ropes: number[][][], loots: number[][], arenas: number[][], worked: Set<string>}}
 * carving The map's carving.
 */
const printPlan = (spec, carving) =>
{
  const marks = new Map();
  doorSquaresOf(spec.id).forEach(square => marks.set(square.join(','), 'D'));
  carving.ropes.flat().forEach(square => marks.set(square.join(','), 'P'));
  carving.loots.forEach(square => marks.set(square.join(','), 'L'));
  carving.arenas.forEach(square => marks.set(square.join(','), 'A'));
  const glyph = { [CELL.rock]: '#', [CELL.floor]: '.', [CELL.chasm]: ' ', [CELL.void]: '~' };

  console.log(`\nMap${spec.id} ${spec.tree} ${spec.w}x${spec.h}`);
  const tens = Array.from({ length: spec.w }, (_, x) => (x % 10 === 0 ? String(x / 10 % 10) : ' ')).join('');
  console.log(`    ${tens}`);
  carving.carved.forEach((row, y) =>
  {
    const line = row.map((cell, x) =>
    {
      const key = `${x},${y}`;
      if (marks.has(key))
      {
        return marks.get(key);
      }

      return cell === CELL.floor && carving.worked.has(key) ? '=' : glyph[cell];
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

  proveConnected(spec, carving.carved, carving.ropes, carving.loots);
  return { spec, carving };
});

await Bun.$`mkdir -p ${OUT}`.quiet();

const built = carvings.map(({ spec, carving }) => ({ spec, carving, map: buildMap(spec, carving) }));
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else. Every map
// hangs under the dungeon's folder, after Map330 by id.
const manifest = built.map(({ spec, map }) => ({
  id: spec.id,
  tree: spec.tree,
  parentId: PARENT,
  order: spec.id,
  w: spec.w,
  h: spec.h,
  events: map.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${built.length} maps to staging`);
built.forEach(({ spec, carving, map }) =>
{
  const counts = `ropes=${carving.ropes.length} loot=${carving.loots.length} arenas=${carving.arenas.length}`;
  console.log(`  Map${spec.id} ${spec.tree.padEnd(20)} ${spec.w}x${spec.h}  events=${map.events.filter(Boolean).length}  ${counts}`);
});
//endregion ravine
