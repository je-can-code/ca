//region tunnels
/**
 * The Windward Tunnels: the long cave road under the Deluge Valley, drafted to the spec in
 * `docs/maps/tunnels.md`. Three short feeders run from Jeremy's three access caves under the valley and braid
 * together at the Confluence; the Deluge leg runs west from there to the Breakthrough, where the miners of the
 * Pearl Salt Mines dug one tunnel too far out of Overmined Corner; and the Peaks leg climbs north from the same
 * junction, colder all the way, until it breaks into the Negative Peaks' first ice cave. The wind that names
 * them blows down from the Peaks.
 *
 * Floors, walls, doorways and the gust lanes only: no enemies, no loot, no lights, no decoration. Those are
 * Jeremy's passes. Every half of a door that stands on one of his maps is left to him and listed in the spec.
 *
 * Every map is drawn the same way: `lanes` are polylines carved five or six wide with a wobble along their
 * length, the way-on that the wind blows down; `chambers` open organic rooms on them; `pockets` hang small
 * dead ends off them for whatever Jeremy hides; and `rests` are calm side rooms off the lanes. The lanes and
 * the chambers on them are painted region 30, the gust lanes, which J-Regions-States turns into the Windswept
 * state (182) for anyone standing there, enemies included. Pockets, rests and the breakthroughs into his maps
 * stay unpainted, so they stay calm.
 *
 * Usage: bun tools/mapgen/dungeons/tunnels.js
 *        bun tools/mapgen/snapshot.js 482 --staged --out confluence.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js links 328
 *
 * `mapgen/validate.js` cannot judge these maps: its passability is vanilla, and tileset 14's ceilings are
 * walkable in vanilla, sealed only by terrain tag 1 through J-RegionEffects. This recipe proves its own floors
 * connected before writing anything, and `map-atlas` reads the real rule after installing.
 */
import { DATA } from '../paths.js';
import { blob, serialise, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor, landingOf } from '../doors.js';

/**
 * The map tree node every map here hangs under: Map328, "DUNGEON: Deluge Caverns", after Jeremy's three access
 * caves (Map325-327).
 * @type {number}
 */
const PARENT = 328;

/**
 * The grey cave of the access caves themselves (`Map325`-`Map327`, read off the maps): grey floor ("A2 ground
 * 9"), under the dark ceiling and wall ("A4 ceiling 2" and "A4 wall 10").
 * @type {{floor: number, ceiling: number, face: number}}
 */
const GREY = { tileset: 14, floor: 24, ceiling: 81, face: 89 };

/**
 * The ice of `Map302`, "Where It Gets Colder", read off the map: its floor ("A2 ground 17") under the ice cave's
 * ceiling and wall ("A4 ceiling 1" and "A4 wall 9"). Its walls stand three rows tall, as most of Map302's do.
 * @type {{floor: number, ceiling: number, face: number, faceRows: number}}
 */
const ICE = { tileset: 19, floor: 32, ceiling: 80, face: 88, faceRows: 3 };

/**
 * The region the gust lanes are painted with. It is used nowhere else in the project and is in neither of
 * J-RegionEffects' global lists, so it changes nothing about who can stand where; region 10 is the one that is
 * globally denied, and is never used here.
 * @type {number}
 */
const GUST_REGION = 30;

/**
 * Windswept, the state the gust lanes hand out (`States.json` 182): faster feet and four times the knockback, so
 * a fight in the wind sends everyone flying. It lands on anyone standing on a gust lane, enemies too.
 * @type {number}
 */
const WINDSWEPT = 182;

/**
 * Every tunnel's note: no day or night underground, the `draft` wind held at moderate, dark-ish air, and the
 * gust lanes.
 * @type {string}
 */
const NOTE = `<noToneChange>\n<weather:draft>\n<ambient:[75]>\n<regionAddState:[${GUST_REGION}, ${WINDSWEPT}]>`;

/**
 * How wide a lane is carved, as the radius of the disc swept along it: about five or six squares across, since
 * a three-wide passage leaves a fight nothing to do but trade blows. A pinch is about three across.
 * @type {{lane: number, pinch: number, pocket: number, wobble: number}}
 */
const WIDTH = { lane: 2.6, pinch: 1.5, pocket: 1.4, wobble: 0.55 };

// every link names both doorways, in Jeremy's door format (see `doors.js`). A `silent` side stands on one of his
// maps, so the recipe leaves it to him; `docs/maps/tunnels.md` lists every one of them with its square.
const LINKS = [
  // the three access caves' far openings, into the three feeders.
  {
    a: { map: 326, at: [ 38, 11 ], span: [ 1, 3 ], dir: 4, silent: true },
    b: { map: 479, at: [ 1, 16 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 325, at: [ 29, 23 ], span: [ 3, 1 ], dir: 8, silent: true },
    b: { map: 480, at: [ 18, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 327, at: [ 1, 9 ], span: [ 1, 3 ], dir: 6, silent: true },
    b: { map: 481, at: [ 58, 13 ], span: [ 1, 3 ], dir: 4 },
  },

  // the feeders braid at the Confluence: west, north and east, and the one road out goes south.
  {
    a: { map: 479, at: [ 58, 19 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 482, at: [ 1, 20 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 480, at: [ 19, 48 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 482, at: [ 38, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 481, at: [ 1, 17 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 482, at: [ 78, 24 ], span: [ 1, 3 ], dir: 4 },
  },

  // the Deluge leg: south out of the Confluence, then west, map after map.
  {
    a: { map: 482, at: [ 40, 58 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 483, at: [ 78, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 483, at: [ 1, 25 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 484, at: [ 98, 25 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 484, at: [ 1, 19 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 485, at: [ 98, 19 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 485, at: [ 1, 35 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 486, at: [ 98, 35 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 486, at: [ 1, 11 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 487, at: [ 58, 11 ], span: [ 1, 3 ], dir: 4 },
  },

  // the Breakthrough: down through the hole the miners made into Overmined Corner's north end, which is
  // Jeremy's to open (x 12-14, rows 0-2), and up the Peaks leg.
  {
    a: { map: 487, at: [ 27, 48 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 148, at: [ 12, 1 ], span: [ 3, 1 ], dir: 2, silent: true },
  },
  {
    a: { map: 487, at: [ 23, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 488, at: [ 34, 58 ], span: [ 3, 1 ], dir: 8 },
  },

  // the Peaks leg: north, east, north, and colder, into Map302's west wall, which is Jeremy's to open (x 0-2,
  // rows 6-8).
  {
    a: { map: 488, at: [ 39, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 489, at: [ 19, 48 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 489, at: [ 88, 27 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 490, at: [ 1, 43 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 490, at: [ 47, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 491, at: [ 47, 58 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 491, at: [ 29, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 492, at: [ 29, 48 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 492, at: [ 78, 13 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 302, at: [ 1, 6 ], span: [ 1, 3 ], dir: 6, silent: true },
  },
];

// each map is a list of lanes, the way-on, as polylines of [x, y] or [x, y, radius] corners, carved wide and
// painted with the gusts; chambers opened on them; pockets hung off them; rests beside them; and calm circles
// kept clear of the gusts around a breakthrough. A lane marked `calm` is carved but never painted: the spur into
// a rest, or the last stretch through a breakthrough. Parallel lanes keep at least four rows of rock between
// them, room for a wall face and the ceiling above it.
const SPECS = [
  {
    id: 479, tree: 'Feeder West', w: 60, h: 36, palette: GREY,
    lanes: [
      { points: [ [ 0, 17 ], [ 8, 17 ], [ 16, 11 ], [ 28, 10 ], [ 36, 18 ], [ 46, 24 ], [ 54, 20 ], [ 59, 20 ] ] },
    ],
    chambers: [ { at: [ 41, 22 ], r: [ 6, 4 ], seed: 4791 } ],
    pockets: [ { from: [ 26, 10 ], to: [ 24, 3 ], r: [ 4, 2 ], seed: 4792 } ],
  },
  {
    id: 480, tree: 'Feeder North', w: 40, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 19, 0 ], [ 19, 6 ], [ 12, 14 ], [ 10, 24 ], [ 22, 32 ], [ 26, 40 ], [ 20, 46 ], [ 20, 49 ] ] },
    ],
    chambers: [ { at: [ 12, 20 ], r: [ 5, 5 ], seed: 4801 } ],
    pockets: [ { from: [ 24, 34 ], to: [ 33, 30 ], r: [ 3, 3 ], seed: 4802 } ],
  },
  {
    id: 481, tree: 'Feeder East', w: 60, h: 36, palette: GREY,
    lanes: [
      { points: [ [ 59, 14 ], [ 50, 14 ], [ 42, 22 ], [ 30, 24 ], [ 22, 16 ], [ 12, 18 ], [ 0, 18 ] ] },
    ],
    chambers: [ { at: [ 34, 23 ], r: [ 6, 4 ], seed: 4811 } ],
    pockets: [ { from: [ 43, 23 ], to: [ 47, 31 ], r: [ 4, 2 ], seed: 4812 } ],
  },
  {
    id: 482, tree: 'The Confluence', w: 80, h: 60, palette: GREY,
    lanes: [
      // the three feeders' winds meet in the middle, and one road leaves south.
      { points: [ [ 0, 21 ], [ 10, 21 ], [ 22, 28 ], [ 33, 31 ] ] },
      { points: [ [ 39, 0 ], [ 39, 8 ], [ 34, 18 ], [ 37, 27 ] ] },
      { points: [ [ 79, 25 ], [ 66, 25 ], [ 54, 32 ], [ 44, 32 ] ] },
      { points: [ [ 38, 34 ], [ 34, 43 ], [ 44, 50 ], [ 41, 59 ] ] },
    ],
    chambers: [ { at: [ 38, 31 ], r: [ 10, 6 ], seed: 4821 } ],
    pockets: [ { from: [ 62, 27 ], to: [ 66, 15 ], r: [ 4, 3 ], seed: 4822 } ],
  },
  {
    id: 483, tree: 'Windward 1', w: 90, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 79, 0 ], [ 79, 8 ], [ 70, 16 ], [ 56, 14 ], [ 46, 21 ], [ 48, 27, WIDTH.pinch ], [ 51, 32 ],
        [ 40, 40 ], [ 24, 36 ], [ 14, 26 ], [ 0, 26 ] ] },
    ],
    chambers: [ { at: [ 50, 33 ], r: [ 8, 5 ], seed: 4831 }, { at: [ 62, 15 ], r: [ 7, 4 ], seed: 4832 } ],
    pockets: [ { from: [ 24, 37 ], to: [ 17, 45 ], r: [ 4, 2 ], seed: 4833 } ],
  },
  {
    id: 484, tree: 'Windward 2', w: 100, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 99, 26 ], [ 88, 26 ], [ 80, 16 ], [ 64, 12 ], [ 52, 20 ], [ 54, 27, WIDTH.pinch ], [ 56, 34 ],
        [ 42, 40 ], [ 28, 34 ], [ 20, 22 ], [ 8, 20 ], [ 0, 20 ] ] },
    ],
    chambers: [ { at: [ 64, 13 ], r: [ 9, 5 ], seed: 4841 }, { at: [ 42, 39 ], r: [ 8, 5 ], seed: 4842 } ],
    pockets: [ { from: [ 81, 15 ], to: [ 88, 6 ], r: [ 4, 3 ], seed: 4843 } ],
  },
  {
    id: 485, tree: 'Windward 3', w: 100, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 99, 20 ], [ 86, 20 ], [ 76, 30 ], [ 62, 34 ], [ 50, 28 ], [ 36, 30 ], [ 26, 40 ], [ 12, 36 ],
        [ 0, 36 ] ] },
      // the spur up into the Lee, the rest chamber out of the wind.
      { points: [ [ 50, 26 ], [ 50, 17 ] ], calm: true },
    ],
    chambers: [ { at: [ 62, 33 ], r: [ 8, 5 ], seed: 4851 } ],
    rests: [ { at: [ 50, 12 ], r: [ 8, 5 ], seed: 4852 } ],
    pockets: [ { from: [ 27, 41 ], to: [ 33, 46 ], r: [ 3, 2 ], seed: 4853 } ],
  },
  {
    id: 486, tree: 'Windward 4', w: 100, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 99, 36 ], [ 84, 36 ], [ 74, 27 ], [ 77, 20, WIDTH.pinch ], [ 80, 14 ], [ 64, 8 ], [ 48, 14 ],
        [ 40, 26 ], [ 24, 24 ], [ 16, 12 ], [ 0, 12 ] ] },
    ],
    chambers: [ { at: [ 48, 14 ], r: [ 8, 5 ], seed: 4861 }, { at: [ 86, 37 ], r: [ 7, 4 ], seed: 4862 } ],
    pockets: [ { from: [ 40, 27 ], to: [ 43, 39 ], r: [ 4, 3 ], seed: 4863 } ],
  },
  {
    id: 487, tree: 'The Breakthrough', w: 60, h: 50, palette: GREY,
    lanes: [
      // in from the Deluge leg to the junction, and up the Peaks leg out of it.
      { points: [ [ 59, 12 ], [ 48, 12 ], [ 40, 20 ], [ 30, 26 ] ] },
      { points: [ [ 26, 22 ], [ 20, 12 ], [ 24, 0 ] ] },
      // down through the miners' hole into Overmined Corner, calm the last stretch.
      { points: [ [ 28, 30 ], [ 28, 49 ] ], calm: true },
    ],
    chambers: [ { at: [ 28, 26 ], r: [ 8, 6 ], seed: 4871 } ],
    calm: [ [ 28, 46, 7 ] ],
  },
  {
    id: 488, tree: 'Northward 1', w: 70, h: 60, palette: GREY,
    lanes: [
      { points: [ [ 35, 59 ], [ 35, 52 ], [ 55, 48 ], [ 60, 40 ], [ 40, 36 ], [ 14, 34 ], [ 10, 24 ], [ 30, 20 ],
        [ 52, 16 ], [ 50, 6 ], [ 40, 0 ] ] },
    ],
    chambers: [ { at: [ 40, 35 ], r: [ 9, 5 ], seed: 4881 } ],
    pockets: [ { from: [ 13, 36 ], to: [ 8, 47 ], r: [ 4, 3 ], seed: 4882 } ],
  },
  {
    id: 489, tree: 'Northward 2', w: 90, h: 50, palette: GREY,
    lanes: [
      { points: [ [ 20, 49 ], [ 20, 40 ], [ 34, 32 ], [ 30, 18 ], [ 46, 10 ], [ 62, 18 ], [ 60, 26, WIDTH.pinch ],
        [ 58, 32 ], [ 74, 38 ], [ 82, 28 ], [ 89, 28 ] ] },
    ],
    chambers: [ { at: [ 46, 12 ], r: [ 8, 5 ], seed: 4891 }, { at: [ 70, 38 ], r: [ 7, 4 ], seed: 4892 } ],
    pockets: [ { from: [ 29, 19 ], to: [ 15, 13 ], r: [ 4, 3 ], seed: 4893 } ],
  },
  {
    id: 490, tree: 'Northward 3', w: 70, h: 60, palette: GREY,
    lanes: [
      { points: [ [ 0, 44 ], [ 12, 44 ], [ 24, 51 ], [ 42, 48 ], [ 52, 36 ], [ 40, 26 ], [ 26, 20 ], [ 32, 10 ],
        [ 46, 6 ], [ 48, 0 ] ] },
      // the spur out to the Hollow, the rest chamber out of the wind.
      { points: [ [ 52, 34 ], [ 58, 26 ] ], calm: true },
    ],
    chambers: [ { at: [ 40, 49 ], r: [ 8, 4 ], seed: 4901 } ],
    rests: [ { at: [ 60, 21 ], r: [ 6, 4 ], seed: 4902 } ],
    pockets: [ { from: [ 26, 20 ], to: [ 12, 14 ], r: [ 4, 3 ], seed: 4903 } ],
  },
  {
    id: 491, tree: 'Cold Draft 1', w: 70, h: 60, palette: ICE,
    lanes: [
      { points: [ [ 48, 59 ], [ 48, 50 ], [ 30, 46 ], [ 16, 38 ], [ 24, 28 ], [ 44, 24 ], [ 58, 16 ], [ 44, 8 ],
        [ 30, 0 ] ] },
    ],
    chambers: [ { at: [ 31, 46 ], r: [ 8, 4 ], seed: 4911 } ],
    pockets: [ { from: [ 57, 17 ], to: [ 62, 30 ], r: [ 4, 3 ], seed: 4912 } ],
  },
  {
    id: 492, tree: 'Cold Draft 2', w: 80, h: 50, palette: ICE,
    lanes: [
      { points: [ [ 30, 49 ], [ 30, 40 ], [ 16, 32 ], [ 24, 20 ], [ 42, 16 ], [ 56, 24 ], [ 64, 14 ], [ 79, 14 ] ] },
    ],
    chambers: [ { at: [ 42, 18 ], r: [ 8, 5 ], seed: 4921 } ],
    pockets: [ { from: [ 17, 33 ], to: [ 6, 40 ], r: [ 4, 3 ], seed: 4922 } ],
    calm: [ [ 75, 14, 6 ] ],
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

// the door helpers, bound to this recipe's links. No drafted map here has been handed over yet.
const { proveLinksKeepHeading, exitsFor, doorSquaresOf } = doorsFor(LINKS, treeName, new Set());

/**
 * Proves the gust region changes nothing about passability: J-RegionEffects denies or allows a region only
 * when one of its global lists, or a map's own note, names it, and these notes never do.
 */
const proveGustsAreNeutral = async () =>
{
  const source = await Bun.file(`${DATA}/../js/plugins.js`).text();
  const plugins = JSON.parse(source.match(/var \$plugins =\s*(\[[\s\S]*\]);/)[1]);
  const effects = plugins.find(plugin => plugin.name === 'j/regions/J-RegionEffects');
  const listed = [ effects.parameters.globalDenyRegions, effects.parameters.globalAllowRegions ]
    .flatMap(list => JSON.parse(list).map(Number));
  if (listed.includes(GUST_REGION))
  {
    throw new Error(`region ${GUST_REGION} is in J-RegionEffects' global lists, so painting it would change passability`);
  }
};

/**
 * A smooth, seeded wobble along a lane's length: value noise between knots six squares apart, eased between
 * them so the edge undulates rather than jitters. The same seed and distance always give the same wobble.
 * @param {number} seed The lane's seed.
 * @returns {function(number): number} The wobble, between -1 and 1, at a distance along the lane.
 */
const wobbleOf = seed =>
{
  const knots = [];
  let state = seed >>> 0;
  const next = () =>
  {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return distance =>
  {
    const position = distance / 6;
    const index = Math.floor(position);
    while (knots.length <= index + 1)
    {
      knots.push(next() * 2 - 1);
    }

    const along = position - index;
    const eased = (1 - Math.cos(along * Math.PI)) / 2;
    return knots[index] * (1 - eased) + knots[index + 1] * eased;
  };
};

/**
 * Carves one map: rock everywhere, then its lanes, chambers, pockets and rests, then the door openings, then
 * a tidy. Alongside the carving it keeps the gust mask, which squares the wind blows across.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], gusts: boolean[][], laneLength: number}} What every square holds, which squares
 * are gust lanes, and how long the lanes run end to end.
 */
const carveMap = spec =>
{
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(CELL.rock));
  const windy = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
  const still = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
  let laneLength = 0;

  /**
   * Opens one square, marking it windy or still.
   * @param {number} x The column.
   * @param {number} y The row.
   * @param {boolean} isWindy Whether the wind blows across it.
   */
  const open = (x, y, isWindy) =>
  {
    if (x < 0 || y < 0 || x >= spec.w || y >= spec.h)
    {
      return;
    }

    // a calm square carved over a lane that is already windy stays windy: the wind keeps the way-on even where
    // a pocket or a rest branches off it.
    carved[y][x] = CELL.floor;
    if (isWindy)
    {
      windy[y][x] = true;
    }
    else if (windy[y][x] === false)
    {
      still[y][x] = true;
    }
  };

  /**
   * Pulls a lane's end in from the map's edge by four squares, so the lane narrows into its doorway's
   * three-wide neck rather than meeting the edge at its full width beside the door.
   * @param {number[]} point The corner, [x, y] or [x, y, radius].
   * @returns {number[]}
   */
  const inward = point =>
  {
    const [ x, y, ...rest ] = point;
    const nx = x === 0 ? 4 : (x === spec.w - 1 ? spec.w - 5 : x);
    const ny = y === 0 ? 4 : (y === spec.h - 1 ? spec.h - 5 : y);
    return [ nx, ny, ...rest ];
  };

  /**
   * Sweeps a disc along a polyline, its radius easing between corners and wobbling along the way.
   * @param {number[][]} points The corners, each [x, y] or [x, y, radius].
   * @param {number} defaultRadius The radius of a corner that names none.
   * @param {boolean} isWindy Whether the wind blows down it.
   * @param {number} seed The wobble's seed.
   * @returns {number} The polyline's length in squares.
   */
  const sweep = (points, defaultRadius, isWindy, seed) =>
  {
    const wobble = wobbleOf(seed);
    let travelled = 0;
    for (let index = 0; index + 1 < points.length; index++)
    {
      const [ x1, y1, r1 = defaultRadius ] = points[index];
      const [ x2, y2, r2 = defaultRadius ] = points[index + 1];
      const length = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.ceil(length * 4));
      for (let step = 0; step <= steps; step++)
      {
        const along = step / steps;
        const cx = x1 + (x2 - x1) * along;
        const cy = y1 + (y2 - y1) * along;
        const radius = r1 + (r2 - r1) * along + wobble(travelled + length * along) * WIDTH.wobble;
        const reach = Math.ceil(radius) + 1;
        for (let y = Math.floor(cy) - reach; y <= Math.ceil(cy) + reach; y++)
        {
          for (let x = Math.floor(cx) - reach; x <= Math.ceil(cx) + reach; x++)
          {
            if ((x - cx) ** 2 + (y - cy) ** 2 <= (radius + 0.35) ** 2)
            {
              open(x, y, isWindy);
            }
          }
        }
      }

      travelled += length;
    }

    return travelled;
  };

  /**
   * Opens an organic room around a centre, using the same seeded blob every cave recipe uses.
   * @param {number[]} at The centre, [x, y].
   * @param {number[]} r The radii, [rx, ry].
   * @param {number} seed The wobble's seed.
   * @param {boolean} isWindy Whether the wind blows through it.
   */
  const room = (at, r, seed, isWindy) =>
  {
    const shape = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(shape, spec.w, spec.h, true, at[0], at[1], r[0], r[1], seed);
    shape.forEach((row, y) => row.forEach((inside, x) =>
    {
      if (inside)
      {
        open(x, y, isWindy);
      }
    }));
  };

  // the way-on first, with the rooms that sit on it; then everything the wind leaves alone.
  (spec.lanes ?? []).forEach((lane, index) =>
  {
    const points = lane.points.map(inward);
    const travelled = sweep(points, WIDTH.lane, lane.calm !== true, spec.id * 10 + index);
    if (lane.calm !== true)
    {
      laneLength += travelled;
    }
  });
  (spec.chambers ?? []).forEach(chamber => room(chamber.at, chamber.r, chamber.seed, true));
  (spec.rests ?? []).forEach(rest => room(rest.at, rest.r, rest.seed, false));
  (spec.pockets ?? []).forEach((pocket, index) =>
  {
    sweep([ pocket.from, pocket.to ], WIDTH.pocket, false, spec.id * 10 + 7 + index);
    room(pocket.to, pocket.r, pocket.seed, false);
  });

  // every doorway opens three squares deep from the map's edge, so its area event spans a clean neck.
  const doors = doorSquaresOf(spec.id);
  LINKS.flatMap(link => [ link.a, link.b ]).filter(side => side.map === spec.id).forEach(side =>
  {
    const [ x, y ] = side.at;
    const [ w, h ] = side.span;
    const isVertical = w === 1;
    for (let depth = 0; depth < 4; depth++)
    {
      for (let along = 0; along < (isVertical ? h : w); along++)
      {
        const dx = isVertical ? (x === 1 ? depth : x + 1 - depth) : x + along;
        const dy = isVertical ? y + along : (y === 1 ? depth : y + 1 - depth);
        open(dx, dy, true);
      }
    }
  });

  // where two openings come within a wall's height of each other, the rock between them is too thin to draw, so
  // it gives way: the band is opened, windy wherever the wind blows on either side of it, so no calm speck is left
  // stranded in a lane. A real cave does the same where two passages nearly meet.
  const faceRows = spec.palette.faceRows ?? 2;
  const isOpen = (x, y) => carved[y][x] === CELL.floor;
  const healThinRock = () =>
  {
    let healed = 0;
    for (let x = 1; x < spec.w - 1; x++)
    {
      let lastOpen = -1;
      for (let y = 0; y < spec.h; y++)
      {
        if (isOpen(x, y) === false)
        {
          continue;
        }

        const band = y - lastOpen - 1;
        if (lastOpen >= 0 && band > 0 && band <= faceRows)
        {
          for (let row = lastOpen + 1; row < y; row++)
          {
            open(x, row, windy[lastOpen][x] || windy[y][x]);
          }

          healed++;
        }

        lastOpen = y;
      }
    }

    for (let y = 1; y < spec.h - 1; y++)
    {
      let lastOpen = -1;
      for (let x = 0; x < spec.w; x++)
      {
        if (isOpen(x, y) === false)
        {
          continue;
        }

        if (lastOpen >= 0 && x - lastOpen - 1 === 1)
        {
          open(x - 1, y, windy[y][lastOpen] || windy[y][x]);
          healed++;
        }

        lastOpen = x;
      }
    }

    return healed;
  };

  // sand the blobs' noise off, never touching a doorway or its landing, then let thin rock give way, and go
  // round again until neither changes anything.
  for (let pass = 0; ; pass++)
  {
    tidyCarving(carved, spec.w, spec.h, doors, `Map${spec.id}`);
    if (healThinRock() === 0)
    {
      break;
    }

    if (pass === 8)
    {
      throw new Error(`Map${spec.id}: thin rock never settled`);
    }
  }

  // a square the tidy opened was carved by nothing, so it takes the air of whatever it opened onto: windy
  // beside a lane, calm beside a pocket or a rest.
  for (let pass = 0; pass < 3; pass++)
  {
    carved.forEach((row, y) => row.forEach((cell, x) =>
    {
      if (cell !== CELL.floor || windy[y][x] || still[y][x])
      {
        return;
      }

      const around = [ [ x, y + 1 ], [ x, y - 1 ], [ x + 1, y ], [ x - 1, y ] ]
        .filter(([ nx, ny ]) => nx >= 0 && ny >= 0 && nx < spec.w && ny < spec.h);
      if (around.some(([ nx, ny ]) => windy[ny][nx] && still[ny][nx] === false))
      {
        windy[y][x] = true;
      }
      else if (around.some(([ nx, ny ]) => still[ny][nx]))
      {
        still[y][x] = true;
      }
    }));
  }

  // the wind blows wherever a lane or a room on it was carved, unless something calm was carved there too,
  // and never within a breakthrough's calm circle.
  const gusts = carved.map((row, y) => row.map((cell, x) =>
  {
    if (cell !== CELL.floor || windy[y][x] === false || still[y][x])
    {
      return false;
    }

    return (spec.calm ?? []).every(([ cx, cy, radius ]) => (x - cx) ** 2 + (y - cy) ** 2 > radius ** 2);
  }));

  return { carved, gusts, laneLength };
};

/**
 * Proves a carved map's floor is one connected cave that every one of its door squares stands on. A failure
 * here is a recipe mistake, so it stops the run rather than being patched over.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 */
const proveConnected = (spec, carved) =>
{
  const squares = doorSquaresOf(spec.id);
  squares.forEach(([ x, y ]) =>
  {
    if (carved[y][x] !== CELL.floor)
    {
      throw new Error(`Map${spec.id}: door square ${x},${y} is not floor`);
    }
  });

  const reached = stepsFrom(spec, carved, squares[0]);
  const floorCount = carved.flat().filter(cell => cell === CELL.floor).length;
  if (reached.size !== floorCount)
  {
    throw new Error(`Map${spec.id}: ${floorCount - reached.size} floor squares cannot be reached`);
  }
};

/**
 * How many steps it takes to walk from one square to every square of floor reachable from it.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[]} start The square to walk from, [x, y].
 * @returns {Map<string, number>} Each reachable square, as "x,y", to the steps it takes.
 */
const stepsFrom = (spec, carved, start) =>
{
  const steps = new Map([ [ start.join(','), 0 ] ]);
  const queue = [ start ];
  for (let head = 0; head < queue.length; head++)
  {
    const [ x, y ] = queue[head];
    const here = steps.get(`${x},${y}`);
    [ [ x, y + 1 ], [ x, y - 1 ], [ x + 1, y ], [ x - 1, y ] ].forEach(([ nx, ny ]) =>
    {
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= spec.w || ny >= spec.h || steps.has(key) || carved[ny][nx] !== CELL.floor)
      {
        return;
      }

      steps.set(key, here + 1);
      queue.push([ nx, ny ]);
    });
  }

  return steps;
};

/**
 * Finds every band of rock between two floors too thin to draw: a wall needs its face rows and a row of
 * ceiling above them, or it reads as a slit; and rock a single column wide between two floors reads as a seam.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @returns {string[]} One line naming every thin band on the map, or nothing when there are none.
 */
const proveRockHolds = (spec, carved) =>
{
  const faceRows = spec.palette.faceRows ?? 2;
  const thin = [];
  for (let x = 0; x < spec.w; x++)
  {
    let lastFloor = -1;
    for (let y = 0; y < spec.h; y++)
    {
      if (carved[y][x] !== CELL.floor)
      {
        continue;
      }

      const band = y - lastFloor - 1;
      if (lastFloor >= 0 && band > 0 && band <= faceRows)
      {
        thin.push(`column ${x}, rows ${lastFloor + 1}-${y - 1}`);
      }

      lastFloor = y;
    }
  }

  for (let y = 0; y < spec.h; y++)
  {
    let lastFloor = -1;
    for (let x = 0; x < spec.w; x++)
    {
      if (carved[y][x] !== CELL.floor)
      {
        continue;
      }

      if (lastFloor >= 0 && x - lastFloor - 1 === 1)
      {
        thin.push(`row ${y}, column ${x - 1}`);
      }

      lastFloor = x;
    }
  }

  return thin.length === 0 ? [] : [ `Map${spec.id}: rock too thin to draw at ${thin.join('; ')}` ];
};

/**
 * Builds one map's file contents: the rendered cave, its gust lanes on the region layer, and its doors.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], gusts: boolean[][]}} carving The map's carving.
 * @returns {Object}
 */
const buildMap = (spec, carving) =>
{
  const data = renderCave(carving.carved, spec.w, spec.h, spec.palette);

  // the region layer is the sixth, after four of tiles and one of shadows.
  carving.gusts.forEach((row, y) => row.forEach((isGust, x) =>
  {
    if (isGust)
    {
      data[(5 * spec.h + y) * spec.w + x] = GUST_REGION;
    }
  }));

  const events = [ null ];
  exitsFor(spec.id).forEach((exit, index) =>
  {
    events.push(doorEvent(index + 1, exit));
  });

  // a silent theme still autoplays, which is what stops the valley's music at the first tunnel: down here the
  // wind is the sound.
  return {
    autoplayBgm: true,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: '', pan: 0, pitch: 100, volume: 90 },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: spec.id === 487 ? 'The Breakthrough' : 'Windward Tunnels',
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
    tilesetId: spec.palette.tileset,
    width: spec.w,
    data,
    events,
  };
};

/**
 * Prints a carving as text: `#` rock, `.` calm floor, `~` gust lane, and `D` a door square.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], gusts: boolean[][]}} carving The map's carving.
 */
const printPlan = (spec, carving) =>
{
  const doors = new Set(doorSquaresOf(spec.id).map(square => square.join(',')));
  console.log(`\n=== Map${spec.id} ${spec.tree} ${spec.w}x${spec.h} ===`);
  carving.carved.forEach((row, y) =>
  {
    const line = row.map((cell, x) =>
    {
      if (doors.has(`${x},${y}`))
      {
        return 'D';
      }

      if (cell !== CELL.floor)
      {
        return '#';
      }

      return carving.gusts[y][x] ? '~' : '.';
    }).join('');
    console.log(`${String(y).padStart(3)} ${line}`);
  });
};

// prove every link and every map before writing any of them, so a bad recipe never leaves a half-written
// staging run.
proveLinksKeepHeading();
await proveGustsAreNeutral();
const carvings = SPECS.map(spec =>
{
  const carving = carveMap(spec);
  proveConnected(spec, carving.carved);
  return { spec, carving };
});

// every thin band on every map is reported at once, so one run shows everything there is to fix.
const thinBands = carvings.flatMap(({ spec, carving }) => proveRockHolds(spec, carving.carved));
if (thinBands.length > 0)
{
  throw new Error(thinBands.join('\n'));
}

await Bun.$`mkdir -p ${OUT}`.quiet();
const built = carvings.map(({ spec, carving }) => ({ spec, carving, map: buildMap(spec, carving) }));
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, in id order, every map hanging under the Deluge Caverns after the
// three access caves.
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

// how far each map makes the player walk: from where they arrive through each door to every other door.
console.log(`wrote ${built.length} maps to staging`);
built.forEach(({ spec, carving, map }) =>
{
  const sides = LINKS.flatMap(link => [ link.a, link.b ]).filter(side => side.map === spec.id);
  const walks = sides.map(side =>
  {
    const steps = stepsFrom(spec, carving.carved, landingOf(side));
    const to = sides.filter(other => other !== side).map(other => `${steps.get(other.at.join(',')) ?? '?'}`);
    return to.join('/');
  });
  const gustCount = carving.gusts.flat().filter(Boolean).length;
  const floorCount = carving.carved.flat().filter(cell => cell === CELL.floor).length;
  console.log(`  Map${spec.id} ${spec.tree.padEnd(16)} ${spec.w}x${spec.h} ts${spec.palette.tileset}  events=${map.events.filter(Boolean).length}  floor=${floorCount} gusts=${gustCount}  walks=${walks.join(' | ')}`);
});

if (Bun.argv.includes('--plan'))
{
  built.forEach(({ spec, carving }) => printPlan(spec, carving));
}
//endregion tunnels
