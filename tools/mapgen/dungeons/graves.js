//region graves
/**
 * The Desolate Graves: a chapter 4 optional area north of the Crossroads, drafted to the spec in
 * `docs/maps/graves.md`. Jeremy's picture is "effectively a forest with graves everywhere", open to anyone who
 * walks in from the Crossroads, level 1 included, with the torch opening particular places inside it rather than
 * the Graves as a whole: "How is a torch gonna block what is effectively a forest with graves everywhere lmao".
 * And it is big: "It's not just a little graveyard, it's The Desolate Graves!"
 *
 * It is laid out like a compass. The shrine stands at the heart of a vast necropolis, where the Mother-Sigil wakes
 * for Cerak, with stone avenues running out to the four points and blocks of graves between them. Each point is
 * an arm of the compass, a field of graves and then its great stone at the far end, so Cerak's "go touch all
 * four" walks the player round the whole place: south from `Map329` through the South Graves, where the south
 * stone stands in its own clearing, to the heart; and north, east and west from the heart, each through its own
 * field of graves to its stone. Gilbert's caravan graves lie in the West Graves, where the old caravan road comes
 * in and ends; the dead master smith's crypt stands beside the east stone; and beside the north stone there is an
 * empty clearing for "the wreckage that isn't there". The crypts, the smith's and the catacombs under the shrine,
 * are the places the torch opens: the smith's door and the shrine's each have a Magic Torch either side.
 *
 * Underground is a compass beneath the compass, at least as big as the whole surface, because Jeremy wanted the
 * crypt and the catacombs "at least as expansive as the entirety of the surface!". The shrine's stair comes down
 * into a great hall, with a tunnel out to each point, and each point is an arm of two maps: a gallery of burial
 * niches, ossuaries and side vaults, then a deep chamber at its far end, under the great stone above it. A stair
 * in the hall leads on down to the lower catacombs. The smith's crypt runs three maps deep, from the hall inside
 * the mausoleum's door through a burial gallery to the chamber where the smith's ghost waits.
 *
 * Floors, walls, water and doorways only, plus the four torches: no enemies, no treasure, no headstones and no
 * decoration, which are Jeremy's passes. The forest wears `Map329`'s own tileset-12 palette, read off the map:
 * grass, the grey stone path, bare earth for the grave plots, and the tree wall whose trunks hang four rows tall.
 * The stones, the shrine and the smith's mausoleum are grey castle stone standing in it. The crypts are grey
 * castle stone too, floored with the worked stone the Earthen Tomb (`Map172`) lays underfoot.
 *
 * Usage: bun tools/mapgen/dungeons/graves.js [--plan]
 *        bun tools/mapgen/snapshot.js 458 --staged --out heart.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js links 124
 *
 * `--plan` prints each carving as text before writing, for reading a layout without rendering it.
 */
import { DATA } from '../paths.js';
import { blob, serialise, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor } from '../doors.js';

/**
 * The area's folder, which already exists: Map124, "FIELD: Desolate Graves", holding Jeremy's `Map329`.
 * @type {number}
 */
const FIELD = 124;

/**
 * Every map's id. Each redraw keeps the ids already given out in their roles, so it never renames a map in the
 * tree, and the maps it adds take the next free ids after them: the catacombs' great hall is the first draft's
 * upper catacombs, and the smith's crypt is now the hall inside its door.
 * @type {Object<string, number>}
 */
const ID = {
  heart: 458,
  northStone: 459,
  eastStone: 460,
  westStone: 461,
  crypt: 462,
  catacombs: 463,
  southGraves: 464,
  northGraves: 465,
  eastGraves: 466,
  westGraves: 467,
  lowerCatacombs: 468,
  northCatacombs: 469,
  northDeep: 470,
  eastCatacombs: 471,
  eastDeep: 472,
  westCatacombs: 473,
  westDeep: 474,
  southCatacombs: 475,
  southDeep: 476,
  burialGallery: 477,
  burialChamber: 478,
};

/**
 * What a carved square stands on. Rock is the carving's own business; every square carved out of it is one of
 * these, and all but the pond can be walked on.
 * @type {Object<string, string>}
 */
const GROUND = { grass: 'grass', path: 'path', plot: 'plot', road: 'road', scar: 'scar', pond: 'pond', floor: 'floor' };

/**
 * The grounds the player can stand on. A pond is water, which the tileset makes impassable.
 * @type {Set<string>}
 */
const WALKABLE = new Set([ GROUND.grass, GROUND.path, GROUND.plot, GROUND.road, GROUND.scar, GROUND.floor ]);

/**
 * The forest, read off `Map329`: grass ("A2 ground 1"), the grey stone path ("A2 ground 3"), bare earth ("A2
 * ground 2") for grave plots, the old road and the empty clearing alike, the pond ("A1 1"), and the tree wall,
 * green canopy over trunks ("A4 ceiling 38" and "A4 wall 46"). Jeremy's trunks hang four rows tall, so these do
 * too. The stones, the shrine and the mausoleum are grey castle stone ("A4 ceiling 21" and "A4 wall 29").
 * @type {{tileset: number, ceiling: number, face: number, faceRows: number, stone: {ceiling: number, face: number},
 * kinds: Object<string, number>}}
 */
const FOREST = {
  tileset: 12,
  ceiling: 117,
  face: 125,
  faceRows: 4,
  stone: { ceiling: 100, face: 108 },
  kinds: { grass: 16, path: 18, plot: 17, road: 17, scar: 17, pond: 0 },
};

/**
 * The crypts: grey castle stone walls over a dark ceiling ("A4 ceiling 22" and "A4 wall 30"), hanging four rows the
 * way the Earthen Tomb's (`Map172`) do, and that tomb's worked stone underfoot. The floor is an A5 tile rather
 * than an autotile, so it is drawn as `STAND_IN` and swapped for the real tile afterwards, the way the Ravine's
 * oldest structure does it.
 * @type {{tileset: number, ceiling: number, face: number, faceRows: number, kinds: Object<string, number>}}
 */
const TOMB = { tileset: 14, ceiling: 101, face: 109, faceRows: 4, kinds: { floor: 48 } };

/**
 * A stand-in kind for the tomb's worked stone while it is drawn: the first A3 kind, which tileset 14 has no sheet
 * for, so nothing else on a map can ever hold it.
 * @type {number}
 */
const STAND_IN = 48;

/**
 * The worked stone the Earthen Tomb lays underfoot, an A5 tile.
 * @type {number}
 */
const WORKED_STONE = 1568;

/**
 * `Map329`'s music and note, which the forest keeps: Jeremy's own entrance sets the Graves' sound.
 * @type {{name: string, pan: number, pitch: number, volume: number}}
 */
const OUTDOORS = { name: '_FFL1-DoorToTheUnknown', pan: 0, pitch: 100, volume: 100 };

/**
 * The crypts' music, borrowed from the Earthen Tomb as a placeholder.
 * @type {{name: string, pan: number, pitch: number, volume: number}}
 */
const INDOORS = { name: '_DKC1_DrowningInBrambles', pan: 0, pitch: 100, volume: 100 };

/**
 * The crypts' note: no day or night underground, and most of the light gone, so the torches Jeremy lights at the
 * door are not the last light the player sees.
 * @type {string}
 */
const CRYPT_NOTE = '<noToneChange>\n<ambient:[85]>';

// every link names both doorways, in Jeremy's door format (see `doors.js`). Map329 is Jeremy's, so its half of
// the way in is his to place: an event at (26,1) with <areaEvent:[3,1]>, across the stone path where his map
// opens to the north, leading to the South Graves. The way back lands on that path at (27,2). The crypts' doors
// stand in recesses cut into the front of the shrine and the mausoleum, so the player walks up into them and comes
// back out facing down. Underground, both stairs in the great hall stand in recesses too: the shrine's comes down
// into one in the south wall, so the player arrives walking north into the hall, and the way on down to the lower
// catacombs is one in the north wall. A map's doors are numbered in the order its links appear here, so the links
// the redraws added follow the first draft's rather than slotting in among them, which would renumber the events
// of maps that have not changed.
const LINKS = [
  {
    a: { map: 329, at: [ 26, 1 ], span: [ 3, 1 ], dir: 2, silent: true },
    b: { map: ID.southGraves, at: [ 44, 58 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.southGraves, at: [ 44, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.heart, at: [ 53, 78 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.heart, at: [ 53, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.northGraves, at: [ 44, 58 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.northGraves, at: [ 44, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.northStone, at: [ 34, 48 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.heart, at: [ 108, 39 ], span: [ 1, 3 ], dir: 4 },
    b: { map: ID.eastGraves, at: [ 1, 29 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.eastGraves, at: [ 88, 29 ], span: [ 1, 3 ], dir: 4 },
    b: { map: ID.eastStone, at: [ 1, 24 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.heart, at: [ 1, 39 ], span: [ 1, 3 ], dir: 6 },
    b: { map: ID.westGraves, at: [ 88, 29 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: ID.westGraves, at: [ 1, 29 ], span: [ 1, 3 ], dir: 6 },
    b: { map: ID.westStone, at: [ 68, 24 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: ID.heart, at: [ 53, 37 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.catacombs, at: [ 28, 38 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.catacombs, at: [ 58, 8 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.lowerCatacombs, at: [ 28, 38 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.eastStone, at: [ 27, 11 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.crypt, at: [ 22, 34 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.catacombs, at: [ 43, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.northCatacombs, at: [ 38, 53 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.northCatacombs, at: [ 38, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.northDeep, at: [ 28, 43 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.catacombs, at: [ 88, 22 ], span: [ 1, 3 ], dir: 4 },
    b: { map: ID.eastCatacombs, at: [ 1, 26 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.eastCatacombs, at: [ 78, 26 ], span: [ 1, 3 ], dir: 4 },
    b: { map: ID.eastDeep, at: [ 1, 21 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: ID.catacombs, at: [ 1, 22 ], span: [ 1, 3 ], dir: 6 },
    b: { map: ID.westCatacombs, at: [ 78, 26 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: ID.westCatacombs, at: [ 1, 26 ], span: [ 1, 3 ], dir: 6 },
    b: { map: ID.westDeep, at: [ 58, 21 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: ID.catacombs, at: [ 43, 63 ], span: [ 3, 1 ], dir: 8 },
    b: { map: ID.southCatacombs, at: [ 38, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: ID.southCatacombs, at: [ 38, 53 ], span: [ 3, 1 ], dir: 8 },
    b: { map: ID.southDeep, at: [ 28, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: ID.crypt, at: [ 22, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.burialGallery, at: [ 33, 48 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: ID.burialGallery, at: [ 33, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: ID.burialChamber, at: [ 23, 38 ], span: [ 3, 1 ], dir: 8 },
  },
];

// each map paints its ground with a small vocabulary. `field` opens a great stretch of grass in the forest and
// `clearing` a smaller organic one, `fill` carves a rectangle of one ground, `path` lays a stone path along a run
// of waypoints (three wide, or five for an avenue), `graves` lays a block of grave plots in rows, `plot` marks one
// rectangle of bare earth for headstones, `pond` sinks water into ground already carved, `rocks` restores the map's
// own rock, `stone` stands a block of grey stone up with a margin of grass round it, `recess` cuts a doorway into
// the front of a block, and `torch` stands a Magic Torch on a square. Paths are laid before graves, and no plot
// ever covers a path. The trees standing about the fields are Jeremy's: a stand of tree wall in the open reads as a
// pit, since the canopy is black inside its rim. Underground, `fill` carves the halls and passages, `rocks` stands
// pillars and tombs in them, and `niches` lines their walls with burial niches once every floor is carved. Every
// band of rock between two floors is left at least five rows deep, room for a wall face four rows tall and a row of
// ceiling over it, and at least two columns wide.
const SPECS = [
  {
    id: ID.southGraves,
    tree: 'South Graves',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: 457.5,
    w: 90,
    h: 60,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ field, clearing, path, graves, stone }) =>
    {
      // a field of graves north of Map329, with a path straight through it and one across.
      field(4, 6, 62, 54, 101);
      path([ [ 45, 59 ], [ 45, 0 ] ]);
      path([ [ 6, 27 ], [ 61, 27 ] ]);
      graves(8, 9, 8, 5);
      graves(50, 9, 3, 5);
      graves(8, 31, 8, 6);
      graves(50, 31, 3, 6);

      // the south stone, in a clearing of its own off to the east.
      clearing(77, 17, 9, 8, 103);
      path([ [ 61, 27 ], [ 66, 27 ], [ 66, 17 ], [ 71, 17 ] ]);
      stone(76, 13, 78, 18);
    },
  },
  {
    id: ID.heart,
    tree: 'The Heart',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: ID.heart,
    w: 110,
    h: 80,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ field, fill, path, graves, pond, stone, recess, torch }) =>
    {
      // the necropolis: open ground from edge to edge, inside a fringe of forest.
      field(3, 4, 106, 76, 111);

      // a great paved plaza in the middle, and a stone avenue out to each point of the compass.
      fill(40, 26, 68, 54, GROUND.path);
      path([ [ 54, 0 ], [ 54, 26 ] ], 2);
      path([ [ 54, 54 ], [ 54, 79 ] ], 2);
      path([ [ 0, 40 ], [ 40, 40 ] ], 2);
      path([ [ 68, 40 ], [ 109, 40 ] ], 2);

      // blocks of graves in rows, filling each quarter between the avenues.
      graves(6, 7, 7, 3);
      graves(31, 7, 6, 3);
      graves(6, 21, 7, 4);
      graves(31, 21, 2, 4);
      graves(81, 7, 7, 3);
      graves(59, 7, 6, 3);
      graves(81, 21, 7, 4);
      graves(71, 21, 2, 4);
      graves(6, 64, 7, 3);
      graves(31, 64, 6, 3);
      graves(6, 47, 7, 4);
      graves(31, 47, 2, 4);
      graves(81, 64, 7, 3);
      graves(59, 64, 6, 3);
      graves(81, 47, 7, 4);
      graves(71, 47, 2, 4);
      pond(65, 61, 3, 2, 112);

      // the shrine at the heart, with the catacombs' door cut into its front and a torch either side of it.
      stone(46, 27, 62, 38);
      recess(53, 37, 55, 38);
      torch(51, 39);
      torch(57, 39);
    },
  },
  {
    id: ID.northGraves,
    tree: 'North Graves',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: 458.5,
    w: 90,
    h: 60,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ field, path, graves }) =>
    {
      // a field of graves north of the Heart, the path winding through it to the north stone.
      field(4, 6, 85, 54, 121);
      path([ [ 45, 59 ], [ 45, 47 ], [ 26, 47 ], [ 26, 31 ], [ 64, 31 ], [ 64, 15 ], [ 45, 15 ], [ 45, 0 ] ]);
      graves(8, 8, 5, 3);
      graves(30, 18, 9, 3);
      graves(68, 20, 5, 6);
      graves(8, 22, 5, 7);
      graves(32, 35, 9, 3);
      graves(50, 49, 6, 2);
    },
  },
  {
    id: ID.northStone,
    tree: 'North Stone',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: ID.northStone,
    w: 70,
    h: 50,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ clearing, fill, path, graves, stone }) =>
    {
      // up from the North Graves to the north stone's clearing at the far end.
      path([ [ 35, 49 ], [ 35, 26 ] ]);
      clearing(35, 17, 13, 9, 131);

      // off the way, a last clearing of graves to the west...
      clearing(14, 36, 8, 6, 132);
      graves(8, 32, 4, 3);
      path([ [ 34, 36 ], [ 21, 36 ] ]);

      // ...and to the east the empty clearing, long and bare: "the wreckage that isn't there".
      clearing(57, 38, 8, 4, 133);
      fill(51, 36, 63, 40, GROUND.scar);
      path([ [ 36, 38 ], [ 50, 38 ] ]);

      // the north stone.
      stone(34, 10, 36, 15);
    },
  },
  {
    id: ID.eastGraves,
    tree: 'East Graves',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: 459.5,
    w: 90,
    h: 60,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ field, path, graves }) =>
    {
      // a field of graves east of the Heart, the path winding through it to the east stone.
      field(4, 6, 85, 54, 141);
      path([ [ 0, 30 ], [ 22, 30 ], [ 22, 15 ], [ 62, 15 ], [ 62, 45 ], [ 76, 45 ], [ 76, 30 ], [ 89, 30 ] ]);
      graves(8, 8, 4, 3);
      graves(26, 19, 10, 3);
      graves(8, 34, 6, 5);
      graves(30, 33, 9, 3);
      graves(66, 8, 6, 5);
      graves(30, 47, 9, 2);
    },
  },
  {
    id: ID.eastStone,
    tree: 'East Stone',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: ID.eastStone,
    w: 70,
    h: 50,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ clearing, path, graves, stone, recess, torch }) =>
    {
      // in from the East Graves to the east stone's clearing at the far end.
      path([ [ 0, 25 ], [ 44, 25 ] ]);
      clearing(56, 25, 10, 12, 151);

      // the dead master smith's mausoleum to the north, its door between two torches.
      clearing(28, 10, 10, 6, 152);
      path([ [ 28, 24 ], [ 28, 13 ] ]);
      stone(23, 4, 33, 12);
      recess(27, 11, 29, 12);
      torch(25, 13);
      torch(31, 13);

      // graves to the south of the way.
      clearing(14, 38, 9, 6, 153);
      graves(7, 34, 5, 3);
      path([ [ 15, 25 ], [ 15, 33 ] ]);

      // the east stone.
      stone(58, 22, 60, 27);
    },
  },
  {
    id: ID.westGraves,
    tree: 'West Graves',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: 460.5,
    w: 90,
    h: 60,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ field, fill, path, graves, plot }) =>
    {
      // a field of graves west of the Heart, the path winding through it to the west stone.
      field(4, 6, 85, 54, 161);
      path([ [ 89, 30 ], [ 66, 30 ], [ 66, 15 ], [ 28, 15 ], [ 28, 30 ], [ 0, 30 ] ]);
      graves(8, 8, 5, 5);
      graves(34, 18, 9, 3);
      graves(70, 8, 4, 5);
      graves(36, 34, 8, 4);
      graves(66, 36, 5, 5);

      // Gilbert's caravan graves, a row of them where the old caravan road comes in off the south edge and ends.
      [ 10, 15, 20, 25, 30 ].forEach(x => plot(x, 44, x + 3, 46));
      fill(19, 48, 21, 59, GROUND.road);
    },
  },
  {
    id: ID.westStone,
    tree: 'West Stone',
    display: 'The Desolate Graves',
    parent: FIELD,
    order: ID.westStone,
    w: 70,
    h: 50,
    palette: FOREST,
    music: OUTDOORS,
    note: '',
    paint: ({ clearing, path, graves, stone }) =>
    {
      // in from the West Graves to the west stone's clearing at the far end.
      path([ [ 69, 25 ], [ 26, 25 ] ]);
      clearing(14, 25, 10, 12, 171);

      // graves north and south of the way.
      clearing(50, 12, 9, 6, 172);
      graves(43, 8, 5, 3);
      path([ [ 50, 24 ], [ 50, 18 ] ]);
      clearing(48, 37, 10, 5, 173);
      graves(40, 33, 6, 3);
      path([ [ 47, 26 ], [ 47, 32 ] ]);

      // the west stone.
      stone(10, 22, 12, 27);
    },
  },
  {
    id: ID.crypt,
    tree: 'The Smith\'s Crypt',
    display: 'The Smith\'s Crypt',
    parent: ID.eastStone,
    order: ID.crypt,
    w: 48,
    h: 36,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // in through the mausoleum's door and up a passage into the crypt's entrance hall, between two colonnades.
      fill(22, 27, 24, 35, GROUND.floor);
      fill(8, 9, 39, 26, GROUND.floor);
      [ 12, 17, 28, 33 ].forEach(x =>
      {
        rocks(x, 12, x + 1, 16);
        rocks(x, 20, x + 1, 24);
      });

      // on north, down into the burial gallery.
      fill(22, 0, 24, 8, GROUND.floor);
      niches(8, 9, 39, 26);
    },
  },
  {
    id: ID.burialGallery,
    tree: 'The Burial Gallery',
    display: 'The Smith\'s Crypt',
    parent: ID.crypt,
    order: ID.burialGallery,
    w: 70,
    h: 50,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // up from the entrance hall onto a gallery that switches back and forth up through the rock, west, then east,
      // then west again to the way on north, burial niches all along it.
      fill(33, 43, 35, 49, GROUND.floor);
      fill(6, 40, 35, 42, GROUND.floor);
      fill(6, 26, 8, 42, GROUND.floor);
      fill(6, 26, 63, 28, GROUND.floor);
      fill(61, 12, 63, 28, GROUND.floor);
      fill(33, 12, 63, 14, GROUND.floor);
      fill(33, 0, 35, 11, GROUND.floor);

      // a hall of stone tombs off the middle reach of the gallery, above it and below it.
      fill(6, 6, 27, 20, GROUND.floor);
      fill(15, 21, 17, 25, GROUND.floor);
      [ 8, 12, 19, 23 ].forEach(x => rocks(x, 11, x + 2, 15));
      fill(42, 34, 63, 47, GROUND.floor);
      fill(51, 29, 53, 33, GROUND.floor);
      [ 44, 48, 55, 59 ].forEach(x => rocks(x, 38, x + 2, 42));

      niches(6, 40, 35, 42);
      niches(6, 26, 8, 42);
      niches(6, 26, 63, 28);
      niches(61, 12, 63, 28);
      niches(33, 12, 63, 14);
      niches(6, 6, 27, 20);
      niches(42, 34, 63, 47);
    },
  },
  {
    id: ID.burialChamber,
    tree: 'The Burial Chamber',
    display: 'The Smith\'s Crypt',
    parent: ID.burialGallery,
    order: ID.burialChamber,
    w: 50,
    h: 40,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // up from the gallery into the burial chamber, where the smith's tomb stands at the head between two pairs of
      // pillars and his ghost waits before it. A dead end.
      fill(23, 30, 25, 39, GROUND.floor);
      fill(7, 7, 41, 29, GROUND.floor);
      rocks(20, 11, 28, 15);
      [ 15, 32 ].forEach(x =>
      {
        rocks(x, 17, x + 1, 21);
        rocks(x, 24, x + 1, 28);
      });
      niches(7, 7, 41, 29);
    },
  },
  {
    id: ID.catacombs,
    tree: 'The Catacombs',
    display: 'The Catacombs',
    parent: ID.heart,
    order: ID.catacombs,
    w: 90,
    h: 65,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // the great hall under the shrine. The shrine's stair comes down into a recess in its south wall, and across
      // the hall the stair on down to the lower catacombs stands in a recess in its north wall.
      fill(14, 10, 74, 36, GROUND.floor);
      fill(28, 37, 30, 38, GROUND.floor);
      fill(58, 6, 60, 9, GROUND.floor);

      // two colonnades along the hall, its middle left open where the four ways meet.
      [ 18, 24, 30, 36, 51, 57, 63, 69 ].forEach(x =>
      {
        rocks(x, 13, x + 1, 17);
        rocks(x, 29, x + 1, 33);
      });

      // a tunnel out to each point of the compass, each to an arm of the catacombs.
      fill(43, 0, 45, 9, GROUND.floor);
      fill(75, 22, 89, 24, GROUND.floor);
      fill(0, 22, 13, 24, GROUND.floor);
      fill(43, 37, 45, 64, GROUND.floor);

      // an ossuary either side of the south tunnel, deep enough below the hall that the stair's recess ends in
      // solid rock rather than against an ossuary's wall.
      fill(16, 47, 36, 58, GROUND.floor);
      fill(37, 51, 42, 53, GROUND.floor);
      fill(52, 47, 72, 58, GROUND.floor);
      fill(46, 51, 51, 53, GROUND.floor);

      // burial niches in the hall's walls, though not its south wall, where the stair up stands; and along the
      // tunnels and round the ossuaries.
      niches(14, 10, 74, 36, 'nwe');
      niches(75, 22, 89, 24);
      niches(0, 22, 13, 24);
      niches(43, 37, 45, 64);
      niches(16, 47, 36, 58);
      niches(52, 47, 72, 58);
    },
  },
  {
    id: ID.lowerCatacombs,
    tree: 'The Lower Catacombs',
    display: 'The Catacombs',
    parent: ID.catacombs,
    order: ID.lowerCatacombs,
    w: 60,
    h: 40,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill }) =>
    {
      // down from the upper level onto a gallery that splits round two long halls, burial niches all along them.
      fill(28, 26, 30, 39, GROUND.floor);
      fill(8, 26, 52, 28, GROUND.floor);
      fill(8, 12, 10, 28, GROUND.floor);
      fill(50, 12, 52, 28, GROUND.floor);
      fill(8, 12, 52, 14, GROUND.floor);
      [ 14, 20, 38, 44 ].forEach(x =>
      {
        fill(x, 24, x + 1, 25, GROUND.floor);
        fill(x, 15, x + 1, 16, GROUND.floor);
      });

      // the far chamber, under the heart of the shrine.
      fill(28, 6, 30, 12, GROUND.floor);
      fill(20, 1, 40, 6, GROUND.floor);
    },
  },
  {
    id: ID.northCatacombs,
    tree: 'North Catacombs',
    display: 'The Catacombs',
    parent: ID.catacombs,
    order: ID.northCatacombs,
    w: 80,
    h: 55,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // up from the great hall onto a long gallery, and from either end of it up through an ossuary to a second
      // gallery, the way on north at its middle: the walk goes round by one ossuary or the other.
      fill(38, 47, 40, 54, GROUND.floor);
      fill(6, 44, 73, 46, GROUND.floor);
      fill(11, 37, 13, 43, GROUND.floor);
      fill(66, 37, 68, 43, GROUND.floor);
      fill(4, 20, 20, 36, GROUND.floor);
      fill(59, 20, 75, 36, GROUND.floor);
      fill(11, 15, 13, 19, GROUND.floor);
      fill(66, 15, 68, 19, GROUND.floor);
      fill(6, 12, 73, 14, GROUND.floor);
      fill(38, 0, 40, 11, GROUND.floor);
      [ 7, 16, 62, 71 ].forEach(x =>
      {
        rocks(x, 23, x + 1, 27);
        rocks(x, 30, x + 1, 34);
      });

      // side vaults off both galleries, between the ossuaries.
      fill(25, 33, 33, 38, GROUND.floor);
      fill(28, 39, 30, 43, GROUND.floor);
      fill(46, 33, 54, 38, GROUND.floor);
      fill(49, 39, 51, 43, GROUND.floor);
      fill(25, 20, 33, 25, GROUND.floor);
      fill(28, 15, 30, 19, GROUND.floor);
      fill(46, 20, 54, 25, GROUND.floor);
      fill(49, 15, 51, 19, GROUND.floor);

      niches(6, 44, 73, 46);
      niches(6, 12, 73, 14);
      niches(4, 20, 20, 36);
      niches(59, 20, 75, 36);
    },
  },
  {
    id: ID.northDeep,
    tree: 'North Deep',
    display: 'The Catacombs',
    parent: ID.northCatacombs,
    order: ID.northDeep,
    w: 60,
    h: 45,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // up from the north gallery into a long nave running north under the north stone, between two colonnades,
      // with an apse at its head. A dead end.
      fill(28, 37, 30, 44, GROUND.floor);
      fill(13, 14, 45, 36, GROUND.floor);
      fill(21, 8, 37, 13, GROUND.floor);
      [ 18, 39 ].forEach(x =>
      {
        rocks(x, 16, x + 1, 20);
        rocks(x, 23, x + 1, 27);
        rocks(x, 30, x + 1, 34);
      });
      niches(13, 14, 45, 36, 'nwe');
      niches(21, 8, 37, 13, 'nwe');
    },
  },
  {
    id: ID.eastCatacombs,
    tree: 'East Catacombs',
    display: 'The Catacombs',
    parent: ID.catacombs,
    order: ID.eastCatacombs,
    w: 80,
    h: 55,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // in from the great hall along a gallery that winds east, the way the East Graves' path winds above it, round
      // a great ossuary that opens off the gallery's north and east legs.
      fill(0, 26, 19, 28, GROUND.floor);
      fill(17, 8, 19, 28, GROUND.floor);
      fill(17, 8, 59, 10, GROUND.floor);
      fill(57, 8, 59, 45, GROUND.floor);
      fill(57, 43, 73, 45, GROUND.floor);
      fill(71, 26, 73, 45, GROUND.floor);
      fill(71, 26, 79, 28, GROUND.floor);
      fill(25, 17, 50, 36, GROUND.floor);
      fill(36, 11, 38, 16, GROUND.floor);
      fill(51, 25, 56, 27, GROUND.floor);
      [ 28, 32, 42, 46 ].forEach(x =>
      {
        rocks(x, 20, x + 1, 24);
        rocks(x, 29, x + 1, 33);
      });

      // a lesser ossuary under the great one, and side vaults off the gallery.
      fill(22, 44, 52, 51, GROUND.floor);
      fill(36, 37, 38, 43, GROUND.floor);
      fill(4, 36, 14, 44, GROUND.floor);
      fill(8, 29, 10, 35, GROUND.floor);
      fill(64, 7, 74, 17, GROUND.floor);
      fill(60, 11, 63, 13, GROUND.floor);
      fill(60, 51, 70, 53, GROUND.floor);
      fill(64, 46, 66, 50, GROUND.floor);

      niches(0, 26, 19, 28);
      niches(17, 8, 19, 28);
      niches(17, 8, 59, 10);
      niches(57, 8, 59, 45);
      niches(57, 43, 73, 45);
      niches(71, 26, 73, 45);
      niches(71, 26, 79, 28);
      niches(25, 17, 50, 36);
      niches(22, 44, 52, 51);
    },
  },
  {
    id: ID.eastDeep,
    tree: 'East Deep',
    display: 'The Catacombs',
    parent: ID.eastCatacombs,
    order: ID.eastDeep,
    w: 60,
    h: 45,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // in from the east gallery to a chamber built as a cross under the east stone, with four pillars round its
      // crossing. A dead end.
      fill(0, 21, 12, 23, GROUND.floor);
      fill(13, 15, 50, 29, GROUND.floor);
      fill(24, 5, 39, 39, GROUND.floor);
      [ 27, 35 ].forEach(x =>
      {
        rocks(x, 15, x + 1, 19);
        rocks(x, 25, x + 1, 29);
      });
      niches(13, 15, 50, 29);
      niches(24, 5, 39, 39);
    },
  },
  {
    id: ID.westCatacombs,
    tree: 'West Catacombs',
    display: 'The Catacombs',
    parent: ID.catacombs,
    order: ID.westCatacombs,
    w: 80,
    h: 55,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, niches }) =>
    {
      // in from the great hall onto a grid of galleries, three across and three down, the middle one broken by an
      // ossuary either side of the centre, so the way west goes through the ossuaries or round by the top and
      // bottom galleries.
      fill(64, 26, 79, 28, GROUND.floor);
      fill(0, 26, 14, 28, GROUND.floor);
      fill(12, 12, 66, 14, GROUND.floor);
      fill(12, 40, 66, 42, GROUND.floor);
      fill(12, 12, 14, 42, GROUND.floor);
      fill(38, 12, 40, 42, GROUND.floor);
      fill(64, 12, 66, 42, GROUND.floor);
      fill(20, 20, 31, 34, GROUND.floor);
      fill(15, 26, 19, 28, GROUND.floor);
      fill(32, 26, 37, 28, GROUND.floor);
      fill(47, 20, 58, 34, GROUND.floor);
      fill(41, 26, 46, 28, GROUND.floor);
      fill(59, 26, 63, 28, GROUND.floor);

      // side vaults above the top gallery and below the bottom one.
      fill(22, 4, 30, 6, GROUND.floor);
      fill(25, 7, 27, 11, GROUND.floor);
      fill(48, 4, 56, 6, GROUND.floor);
      fill(51, 7, 53, 11, GROUND.floor);
      fill(22, 48, 30, 51, GROUND.floor);
      fill(25, 43, 27, 47, GROUND.floor);
      fill(48, 48, 56, 51, GROUND.floor);
      fill(51, 43, 53, 47, GROUND.floor);

      niches(64, 26, 79, 28);
      niches(0, 26, 14, 28);
      niches(12, 12, 66, 14);
      niches(12, 40, 66, 42);
      niches(12, 12, 14, 42);
      niches(38, 12, 40, 42);
      niches(64, 12, 66, 42);
      niches(20, 20, 31, 34);
      niches(47, 20, 58, 34);
    },
  },
  {
    id: ID.westDeep,
    tree: 'West Deep',
    display: 'The Catacombs',
    parent: ID.westCatacombs,
    order: ID.westDeep,
    w: 60,
    h: 45,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // in from the west gallery to a square chamber under the west stone, a great tomb at its heart and rows of
      // lesser tombs either side of the way to it. A dead end.
      fill(47, 21, 59, 23, GROUND.floor);
      fill(8, 6, 46, 38, GROUND.floor);
      rocks(24, 20, 30, 24);
      [ 12, 19, 33, 40 ].forEach(x =>
      {
        rocks(x, 9, x + 2, 13);
        rocks(x, 30, x + 2, 34);
      });
      niches(8, 6, 46, 38);
    },
  },
  {
    id: ID.southCatacombs,
    tree: 'South Catacombs',
    display: 'The Catacombs',
    parent: ID.catacombs,
    order: ID.southCatacombs,
    w: 80,
    h: 55,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // down from the great hall into a ring of galleries round a great ossuary, which opens off the ring's west and
      // east sides; the way on south leaves the ring's far side.
      fill(38, 0, 40, 7, GROUND.floor);
      fill(10, 8, 69, 10, GROUND.floor);
      fill(10, 44, 69, 46, GROUND.floor);
      fill(10, 8, 12, 46, GROUND.floor);
      fill(67, 8, 69, 46, GROUND.floor);
      fill(38, 47, 40, 54, GROUND.floor);
      fill(20, 18, 59, 36, GROUND.floor);
      fill(13, 26, 19, 28, GROUND.floor);
      fill(60, 26, 66, 28, GROUND.floor);
      [ 24, 30, 36, 42, 48, 54 ].forEach(x =>
      {
        rocks(x, 21, x + 1, 25);
        rocks(x, 30, x + 1, 34);
      });

      // a side vault off each side of the ring.
      fill(2, 22, 7, 32, GROUND.floor);
      fill(8, 26, 9, 28, GROUND.floor);
      fill(72, 22, 77, 32, GROUND.floor);
      fill(70, 26, 71, 28, GROUND.floor);

      // the ring is lined along its outer walls, and the ossuary round its own, so the rock between them stays whole.
      niches(10, 8, 69, 10, 'n');
      niches(10, 44, 69, 46, 's');
      niches(10, 8, 12, 46, 'w');
      niches(67, 8, 69, 46, 'e');
      niches(20, 18, 59, 36);
    },
  },
  {
    id: ID.southDeep,
    tree: 'South Deep',
    display: 'The Catacombs',
    parent: ID.southCatacombs,
    order: ID.southDeep,
    w: 60,
    h: 45,
    palette: TOMB,
    music: INDOORS,
    note: CRYPT_NOTE,
    paint: ({ fill, rocks, niches }) =>
    {
      // down from the south gallery into a chamber under the south stone, where eight pillars stand in a ring round
      // its middle. A dead end.
      fill(28, 0, 30, 9, GROUND.floor);
      fill(8, 10, 51, 40, GROUND.floor);
      [ [ 29, 13 ], [ 21, 16 ], [ 37, 16 ], [ 16, 23 ], [ 42, 23 ], [ 21, 30 ], [ 37, 30 ], [ 29, 33 ] ]
        .forEach(([ x, y ]) => rocks(x, y, x + 1, y + 4));
      niches(8, 10, 51, 40);
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

// the Magic Torch, taken whole from the Hidey Hole (`Map113`), whose four are identical but for where they stand.
const hideyHole = JSON.parse(await Bun.file(`${DATA}/Map113.json`).text());
const TORCH = hideyHole.events[1];

/**
 * A Magic Torch, exactly as the Hidey Hole has them: an invincible JABS target only the Red Wand can light, which
 * turns its own self switch A on when lit and shows its lit page after. Nothing yet reads those switches.
 * @param {number} id The event id.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {Object}
 */
const torchEvent = (id, x, y) => ({ ...structuredClone(TORCH), id, x, y });

/**
 * Carves one map out of solid rock by running its spec's paint function, then sands the noise off and gives any
 * square the sanding opened the ground most of its neighbours stand on.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], ground: string[][], stone: Set<string>, torches: number[][]}} What every square
 * holds, as a `CELL`; what every carved square stands on, as a `GROUND`; the squares of grey stone, as "x,y"; and
 * where the torches stand.
 */
const carveMap = spec =>
{
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(CELL.rock));
  const ground = Array.from({ length: spec.h }, () => new Array(spec.w).fill(null));
  const stones = new Set();
  const torches = [];
  const recesses = [];
  const inside = (x, y) => x >= 0 && y >= 0 && x < spec.w && y < spec.h;
  const isPath = (x, y) => inside(x, y) && ground[y][x] === GROUND.path;

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
    stones.delete(`${x},${y}`);
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
   * Restores the map's own rock over an axis-aligned rectangle, inclusive.
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
   * Turns every square an organic blob around a centre covers to grass, where the forest stood. The blob's edge
   * wobbles by a seeded amount, so a re-run carves the same shape.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const clearing = (cx, cy, rx, ry, seed) =>
  {
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, cx, cy, rx, ry, seed);
    marked.forEach((row, y) => row.forEach((isMarked, x) =>
    {
      if (isMarked && carved[y][x] === CELL.rock)
      {
        set(x, y, GROUND.grass);
      }
    }));
  };

  /**
   * Opens a great stretch of grass across a rectangle, inclusive: its middle cleared outright, and its edge an
   * organic oval round that, so the forest closes in on the corners rather than at a ruled line. Nothing is
   * cleared outside the rectangle, so a field never eats through the forest at the map's edge.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {number} seed The edge's seed.
   */
  const field = (x1, y1, x2, y2, seed) =>
  {
    for (let y = y1 + 3; y <= y2 - 3; y++)
    {
      for (let x = x1 + 3; x <= x2 - 3; x++)
      {
        set(x, y, GROUND.grass);
      }
    }

    const halfWidth = Math.floor((x2 - x1) / 2);
    const halfHeight = Math.floor((y2 - y1) / 2);
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, x1 + halfWidth, y1 + halfHeight, halfWidth + 1, halfHeight + 1, seed, 0.16);
    for (let y = Math.max(0, y1); y <= Math.min(spec.h - 1, y2); y++)
    {
      for (let x = Math.max(0, x1); x <= Math.min(spec.w - 1, x2); x++)
      {
        if (marked[y][x] && carved[y][x] === CELL.rock)
        {
          set(x, y, GROUND.grass);
        }
      }
    }
  };

  /**
   * Lays a stone path through a run of waypoints, each leg straight along a row or a column. A path paves over
   * grass and plots alike, and cuts through the forest.
   * @param {number[][]} points The waypoints, as [x, y]; each leg must share a row or a column.
   * @param {number} half How far the path reaches either side of the line through its waypoints: one for a path
   * three wide, two for an avenue five wide.
   */
  const path = (points, half = 1) =>
  {
    for (let index = 1; index < points.length; index++)
    {
      const [ x1, y1 ] = points[index - 1];
      const [ x2, y2 ] = points[index];
      fill(Math.min(x1, x2) - half, Math.min(y1, y2) - half, Math.max(x1, x2) + half, Math.max(y1, y2) + half,
        GROUND.path);
    }
  };

  /**
   * Marks a rectangle of bare earth for headstones, inclusive, leaving any path across it as it is.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const plot = (x1, y1, x2, y2) =>
  {
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        if (isPath(x, y) === false)
        {
          set(x, y, GROUND.plot);
        }
      }
    }
  };

  /**
   * Lays a block of grave plots in rows: each plot two squares by two, with an aisle of grass one square wide
   * between plots and round the block, which is cleared out of the forest wherever it stood.
   * @param {number} x The block's left column.
   * @param {number} y The block's top row.
   * @param {number} columns How many plots across.
   * @param {number} rows How many plots down.
   */
  const graves = (x, y, columns, rows) =>
  {
    const right = x + columns * 3;
    const bottom = y + rows * 3;
    for (let row = y; row <= bottom; row++)
    {
      for (let column = x; column <= right; column++)
      {
        if (inside(column, row) && carved[row][column] === CELL.rock)
        {
          set(column, row, GROUND.grass);
        }
      }
    }

    for (let row = 0; row < rows; row++)
    {
      for (let column = 0; column < columns; column++)
      {
        const left = x + 1 + column * 3;
        const top = y + 1 + row * 3;
        plot(left, top, left + 1, top + 1);
      }
    }
  };

  /**
   * Sinks an organic pond into ground already carved, never into the forest.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const pond = (cx, cy, rx, ry, seed) =>
  {
    const marked = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(marked, spec.w, spec.h, true, cx, cy, rx, ry, seed, 0.08);
    marked.forEach((row, y) => row.forEach((isMarked, x) =>
    {
      if (isMarked && carved[y][x] === CELL.floor)
      {
        ground[y][x] = GROUND.pond;
      }
    }));
  };

  /**
   * Stands a block of grey stone up in the forest, inclusive of both corners, with two squares of grass cut
   * round it wherever the forest stood, so the block stands free and shows its edges on every side. Its lowest
   * rows become its face, so a block needs more rows than the palette's face to show a top.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const stone = (x1, y1, x2, y2) =>
  {
    for (let y = y1 - 2; y <= y2 + 2; y++)
    {
      for (let x = x1 - 2; x <= x2 + 2; x++)
      {
        if (inside(x, y) && carved[y][x] === CELL.rock)
        {
          set(x, y, GROUND.grass);
        }
      }
    }

    rocks(x1, y1, x2, y2);
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        stones.add(`${x},${y}`);
      }
    }
  };

  /**
   * Cuts a doorway's recess into the front of a block, paved like the path that leads to it.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const recess = (x1, y1, x2, y2) =>
  {
    fill(x1, y1, x2, y2, GROUND.path);
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        recesses.push([ x, y ]);
      }
    }
  };

  /**
   * Stands a Magic Torch on a square, which must already be ground.
   * @param {number} x The column.
   * @param {number} y The row.
   */
  const torch = (x, y) => torches.push([ x, y ]);

  /**
   * Whether every square of a rectangle is uncarved rock, inclusive. Off the map counts as rock, since nothing
   * can ever stand there.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @returns {boolean}
   */
  const isAllRock = (x1, y1, x2, y2) =>
  {
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        if (inside(x, y) && carved[y][x] !== CELL.rock)
        {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Whether every square of a rectangle is carved ground on the map, inclusive.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @returns {boolean}
   */
  const isAllFloor = (x1, y1, x2, y2) =>
  {
    for (let y = y1; y <= y2; y++)
    {
      for (let x = x1; x <= x2; x++)
      {
        if (inside(x, y) === false || carved[y][x] !== CELL.floor)
        {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Where the niches go along one wall: the first square of each, `step` apart and centred on the wall, with at
   * least two squares of wall left at either end.
   * @param {number} start The wall's first square.
   * @param {number} end The wall's last square.
   * @param {number} step How far apart the niches stand.
   * @returns {number[]}
   */
  const nichesAlong = (start, end, step) =>
  {
    const length = end - start + 1;
    if (length < 6)
    {
      return [];
    }

    const count = Math.floor((length - 6) / step) + 1;
    const first = start + Math.floor((length - (2 + (count - 1) * step)) / 2);
    return Array.from({ length: count }, (_, index) => first + index * step);
  };

  /**
   * The walls a carved rectangle is lined along by default: a corridor, no more than four squares across, along
   * its two long walls, and a room along all four.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @returns {string}
   */
  const wallsOf = (x1, y1, x2, y2) =>
  {
    const width = x2 - x1 + 1;
    const height = y2 - y1 + 1;
    if (height <= 4 && width > height)
    {
      return 'ns';
    }

    if (width <= 4 && height > width)
    {
      return 'we';
    }

    return 'nesw';
  };

  /**
   * Lines the walls of a carved rectangle with burial niches, two squares by two: every six squares along a top or
   * bottom wall, and every seven down a side wall, since a niche's wall face hangs four rows above it there. A
   * niche is cut only where the rock has room for it: its mouth opens onto the rectangle's own floor, and it keeps
   * two columns of rock between it and any ground beside it and five rows between it and any ground above or
   * below, which is room for a wall face and a row of ceiling over it. So a niche never breaks into another
   * passage or leaves a wall face without its top, and lining comes after every floor of the map is carved, so it
   * sees them all.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {string} sides The walls to line, as any of "n", "e", "s" and "w"; by default, a corridor's two long
   * walls or all four of a room's.
   */
  const niches = (x1, y1, x2, y2, sides = wallsOf(x1, y1, x2, y2)) =>
  {
    // every niche the walls ask for, as its own squares, its mouth on the rectangle's floor, and the rock round it.
    const wanted = [];
    if (sides.includes('n'))
    {
      nichesAlong(x1, x2, 6).forEach(x => wanted.push({
        niche: [ x, y1 - 2, x + 1, y1 - 1 ],
        mouth: [ x, y1, x + 1, y1 ],
        clear: [ [ x - 2, y1 - 2, x - 1, y1 - 1 ], [ x + 2, y1 - 2, x + 3, y1 - 1 ], [ x, y1 - 7, x + 1, y1 - 3 ] ],
      }));
    }

    if (sides.includes('s'))
    {
      nichesAlong(x1, x2, 6).forEach(x => wanted.push({
        niche: [ x, y2 + 1, x + 1, y2 + 2 ],
        mouth: [ x, y2, x + 1, y2 ],
        clear: [ [ x - 2, y2 + 1, x - 1, y2 + 2 ], [ x + 2, y2 + 1, x + 3, y2 + 2 ], [ x, y2 + 3, x + 1, y2 + 7 ] ],
      }));
    }

    if (sides.includes('w'))
    {
      nichesAlong(y1, y2, 7).forEach(y => wanted.push({
        niche: [ x1 - 2, y, x1 - 1, y + 1 ],
        mouth: [ x1, y, x1, y + 1 ],
        clear: [ [ x1 - 4, y, x1 - 3, y + 1 ], [ x1 - 2, y - 5, x1 - 1, y - 1 ], [ x1 - 2, y + 2, x1 - 1, y + 6 ] ],
      }));
    }

    if (sides.includes('e'))
    {
      nichesAlong(y1, y2, 7).forEach(y => wanted.push({
        niche: [ x2 + 1, y, x2 + 2, y + 1 ],
        mouth: [ x2, y, x2, y + 1 ],
        clear: [ [ x2 + 3, y, x2 + 4, y + 1 ], [ x2 + 1, y - 5, x2 + 2, y - 1 ], [ x2 + 1, y + 2, x2 + 2, y + 6 ] ],
      }));
    }

    // a niche stays off the map's outermost squares, and is cut only where it fits.
    wanted.forEach(({ niche, mouth, clear }) =>
    {
      const [ left, top, right, bottom ] = niche;
      const isClearOfTheEdge = left >= 1 && top >= 1 && right <= spec.w - 2 && bottom <= spec.h - 2;
      const fits = isClearOfTheEdge
        && isAllRock(left, top, right, bottom)
        && isAllFloor(...mouth)
        && clear.every(area => isAllRock(...area));
      if (fits)
      {
        fill(left, top, right, bottom, GROUND.floor);
      }
    });
  };

  spec.paint({ field, clearing, fill, path, plot, graves, pond, rocks, stone, recess, torch, niches });

  // sand the noise off, keeping every doorway, recess and torch exactly where the recipe put it.
  tidyCarving(carved, spec.w, spec.h, [ ...doorSquaresOf(spec.id), ...recesses, ...torches ], `Map${spec.id}`);

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

      stones.delete(`${x},${y}`);
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

  return { carved, ground, stone: stones, torches };
};

/**
 * Whether the player can stand on a square of a carving: walkable ground with no torch standing on it, since a
 * Magic Torch is solid whether it is lit or not.
 * @param {{carved: number[][], ground: string[][], torches: number[][]}} carving The map's carving.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {boolean}
 */
const isWalkable = (carving, x, y) => carving.carved[y][x] === CELL.floor
  && WALKABLE.has(carving.ground[y][x])
  && carving.torches.some(([ tx, ty ]) => tx === x && ty === y) === false;

/**
 * Floods a carving's walkable ground from one square and returns every square it covers.
 * @param {Object} spec The map's spec.
 * @param {Object} carving The map's carving.
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
 * Proves a carved map holds together before anything is written: every doorway and landing stands on ground the
 * player can stand on, every torch stands on ground, and every square of walkable ground can be reached from the
 * first doorway without walking through a torch. A failure here is a recipe mistake, so it stops the run rather
 * than being patched over.
 * @param {Object} spec The map's spec.
 * @param {Object} carving The map's carving.
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

  carving.torches.forEach(([ x, y ]) =>
  {
    if (carving.carved[y][x] !== CELL.floor || WALKABLE.has(carving.ground[y][x]) === false)
    {
      throw new Error(`Map${spec.id}: the torch at ${x},${y} does not stand on ground`);
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
};

/**
 * Draws one map's tiles. The forest's rock is tree wall except where a block of grey stone stands; the tomb's
 * worked stone is drawn as its stand-in kind and swapped for the real A5 tile afterwards.
 * @param {Object} spec The map's spec.
 * @param {Object} carving The map's carving.
 * @returns {number[]}
 */
const drawTiles = (spec, carving) =>
{
  const { palette } = spec;
  const isStone = (x, y) => carving.stone.has(`${x},${y}`);
  const data = renderCave(carving.carved, spec.w, spec.h, {
    floor: palette.kinds[GROUND.grass] ?? STAND_IN,
    ceiling: palette.ceiling,
    face: palette.face,
    faceRows: palette.faceRows,
    floorAt: (x, y) => palette.kinds[carving.ground[y][x]],
    ceilingAt: (x, y) => (isStone(x, y) ? palette.stone.ceiling : palette.ceiling),
    faceAt: (x, y) => (isStone(x, y) ? palette.stone.face : palette.face),
  });

  // the stand-in's tile ids are the 48 that follow the A2 sheet; every one of them becomes worked stone.
  if (palette === TOMB)
  {
    const first = 2048 + STAND_IN * 48;
    for (let index = 0; index < spec.w * spec.h; index++)
    {
      if (data[index] >= first && data[index] < first + 48)
      {
        data[index] = WORKED_STONE;
      }
    }
  }

  return data;
};

/**
 * Builds one map's file contents: the drawn ground, its doors and torches, and its header.
 * @param {Object} spec The map's spec.
 * @param {Object} carving The map's carving.
 * @returns {Object}
 */
const buildMap = (spec, carving) =>
{
  const events = [ null ];
  exitsFor(spec.id).forEach(exit =>
  {
    events.push(doorEvent(events.length, exit));
  });

  // the torches follow the doors, numbered on from them.
  carving.torches.forEach(([ x, y ]) =>
  {
    events.push(torchEvent(events.length, x, y));
  });

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
    data: drawTiles(spec, carving),
    events,
  };
};

/**
 * Prints a carving as text: `#` forest or tomb wall, `S` grey stone, `.` grass or crypt floor, `=` path, `+` bare
 * earth, `~` pond, `T` a torch, and `D` a door square.
 * @param {Object} spec The map's spec.
 * @param {Object} carving The map's carving.
 */
const printPlan = (spec, carving) =>
{
  const doors = new Set(doorSquaresOf(spec.id).map(square => square.join(',')));
  const torches = new Set(carving.torches.map(square => square.join(',')));
  const glyph = { grass: '.', floor: '.', path: '=', plot: '+', road: '+', scar: '+', pond: '~' };

  console.log(`\nMap${spec.id} ${spec.tree} ${spec.w}x${spec.h}`);
  const tens = Array.from({ length: spec.w }, (_, x) => (x % 10 === 0 ? String(x / 10 % 10) : ' ')).join('');
  console.log(`    ${tens}`);
  carving.carved.forEach((row, y) =>
  {
    const line = row.map((cell, x) =>
    {
      const key = `${x},${y}`;
      if (doors.has(key))
      {
        return 'D';
      }

      if (torches.has(key))
      {
        return 'T';
      }

      if (cell === CELL.rock)
      {
        return carving.stone.has(key) ? 'S' : '#';
      }

      return glyph[carving.ground[y][x]];
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

const built = carvings.map(({ spec, carving }) => ({ spec, map: buildMap(spec, carving) }));
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else. The forest
// hangs under the Graves' folder beside Jeremy's entrance in walking order, the redraw's new fields slotted between
// the maps that were already there by half-step orders, since install.js never touches an entry it already has.
// Each crypt hangs under the map it is entered from. The manifest lists the maps in id order rather than walking
// order: install.js appends each new map's entry to MapInfos in the order the manifest gives it, and MapInfos is
// read by position, so an entry appended out of id order sits at another map's index.
const manifest = built.map(({ spec, map }) => ({
  id: spec.id,
  tree: spec.tree,
  parentId: spec.parent,
  order: spec.order,
  w: spec.w,
  h: spec.h,
  events: map.events.filter(Boolean).length,
})).sort((left, right) => left.id - right.id);
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${built.length} maps to staging`);
built.forEach(({ spec, map }) =>
{
  console.log(`  Map${spec.id} ${spec.tree.padEnd(20)} ${spec.w}x${spec.h}  tileset ${spec.palette.tileset}  events=${map.events.filter(Boolean).length}`);
});
//endregion graves
