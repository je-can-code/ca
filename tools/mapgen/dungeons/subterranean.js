//region subterranean
/**
 * The Subterranean: chapter 4's Sloth dungeon, drafted to the spec in `docs/maps/subterranean.md` - a
 * snake of six layers coiling down from the Pearl Salt Mines, each layer a few maps that run the
 * opposite way from the layer above. Floors, walls and doorways only: no enemies, no lights, no
 * decoration, no boss. Those are Jeremy's passes.
 *
 * Layers are drafted one at a time and walked before the next one is added, so this holds what has
 * been drafted so far: layer 1, the mineshafts beneath `Map331`, and layer 2, three more shafts running
 * back west and the big cavern at their end, where Jeremy turns the mine into the teal of layer 3; and
 * layer 3 itself, the snake's back, five-wide paths winding over open chasm with platforms to fight on.
 * Off the spine hang ribs: small side maps, each exactly one screen, at the end of a dead-end tunnel.
 *
 * One screen is 40x22.5 tiles (1920x1080 at 48 pixels, with no zoom plugin enabled), so no map here is
 * smaller than 40x23; anything smaller sits in a black border.
 *
 * Usage: bun tools/mapgen/dungeons/subterranean.js
 *        bun tools/mapgen/snapshot.js 385 --staged --out shaft.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js links 290
 *
 * `mapgen/validate.js` cannot judge these maps. Its passability is vanilla, and CA's ceilings are
 * walkable in vanilla, sealed only by terrain tag 1 through J-RegionEffects; `map-atlas` reads that rule
 * and this recipe proves its own floors connected before writing anything.
 */
import { DATA } from '../paths.js';
import { blob, serialise, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor } from '../doors.js';

/**
 * The map tree node every map here hangs under: Map290, "DUNGEON: Subterranean Depths".
 * @type {number}
 */
const PARENT = 290;

/**
 * The mineshaft look of layers 1 and 2: the mines' grey floor, under the darker ceiling and wall the
 * mines wore until 2026-10-23 (the map editor's "A4 ceiling 2" and "A4 wall 10").
 * @type {{floor: number, ceiling: number, face: number}}
 */
const MINESHAFT = { floor: 24, ceiling: 81, face: 89 };

/**
 * The snake's look, from layer 3 down: `Map331`'s teal floor ("A2 ground 26") under the teal ceiling and
 * wall ("A4 ceiling 8" and "A4 wall 16"), with "A2 decoration 30" as the chasm either side of the path.
 * @type {{floor: number, ceiling: number, face: number, chasm: number}}
 */
const SNAKE = { floor: 41, ceiling: 87, face: 95, chasm: 45 };

/**
 * What each layer sets for every map in it: its look, its darkness, and how loud the theme still is.
 * The theme fades as the dungeon deepens, so the bottom is left to the heartbeat.
 * @type {Object<number, {palette: Object, darkness: number, volume: number}>}
 */
const LAYERS = {
  1: { palette: MINESHAFT, darkness: 75, volume: 90 },
  2: { palette: MINESHAFT, darkness: 80, volume: 75 },
  3: { palette: SNAKE, darkness: 85, volume: 60 },
  4: { palette: SNAKE, darkness: 90, volume: 45 },
  5: { palette: SNAKE, darkness: 100, volume: 30 },
  6: { palette: SNAKE, darkness: 100, volume: 15 },
};

/**
 * The farthest a drafted rope crossing asks the Snake Rope to reach, post to post. The rope itself
 * reaches 8 (`ROPE_REACH` in `map-atlas.js`, measured from the widest crossing a shipped dungeon asks
 * of it), and Jeremy remembers it as "about 5", so drafts stay within what he expects of it.
 * @type {number}
 */
const ROPE_LIMIT = 6;

/**
 * The folder each layer's maps hang under in the map tree: a 0x0 map that is nothing but a branch,
 * named the way the Forlorn Basin names its floors, so the tree reads layer by layer instead of as one
 * flat list. A rib hangs under the shaft it branches from instead.
 * @type {Object<number, {id: number, tree: string, display: string}>}
 */
const FLOORS = {
  1: { id: 396, tree: 'FLOOR: 1', display: 'F1' },
  2: { id: 397, tree: 'FLOOR: 2', display: 'F2' },
  3: { id: 398, tree: 'FLOOR: 3', display: 'F3' },
  4: { id: 399, tree: 'FLOOR: 4', display: 'F4' },
  5: { id: 403, tree: 'FLOOR: 5', display: 'F5' },
  6: { id: 407, tree: 'FLOOR: 6', display: 'F6' },
};

/**
 * Drafted maps Jeremy has taken over to polish. Hand-edits outrank the generator, so these are never
 * written again, and their halves of any door are his to place, exactly like a `silent` side.
 * @type {Set<number>}
 */
const HANDED_OVER = new Set([ 390 ]);

/**
 * The dungeon's theme, DDRKirby's "Remachination".
 * @type {string}
 */
const THEME = '_SMRPG-Remachination';

// every link names both doorways, in Jeremy's door format (see `doors.js`). A `silent` side is a doorway
// this recipe does not write: Map331 is Jeremy's to rework, so its half of the door is his to place, at the
// top of the corridor between its two wall lamps.
const LINKS = [
  {
    a: { map: 331, at: [ 34, 1 ], span: [ 3, 1 ], dir: 2, silent: true },
    b: { map: 385, at: [ 24, 36 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 385, at: [ 48, 14 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 386, at: [ 1, 14 ], span: [ 1, 3 ], dir: 6 },
  },

  // down from Shaft 1c's drop shaft into the top of 2a, then back west along layer 2.
  {
    a: { map: 386, at: [ 44, 36 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 387, at: [ 41, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 387, at: [ 1, 26 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 388, at: [ 48, 10 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 388, at: [ 1, 28 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 389, at: [ 48, 27 ], span: [ 1, 3 ], dir: 4 },
  },

  // Cavern 2d's half of this door was written before it was handed over, so Shaft 2c's west door must
  // stay exactly where that door lands: the opening at (1,6), three tall.
  {
    a: { map: 389, at: [ 1, 6 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 390, at: [ 58, 12 ], span: [ 1, 3 ], dir: 4 },
  },

  // the ribs: down out of the dead end below Shaft 1c's chamber, and up out of Shaft 2b's side passage.
  {
    a: { map: 386, at: [ 17, 36 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 391, at: [ 19, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 388, at: [ 39, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 392, at: [ 19, 21 ], span: [ 3, 1 ], dir: 8 },
  },

  // down out of Cavern 2d (Jeremy's now, so its half is his) onto the snake, then east along layer 3.
  {
    a: { map: 390, at: [ 8, 38 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 393, at: [ 8, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 393, at: [ 58, 29 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 394, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 394, at: [ 58, 24 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 395, at: [ 1, 28 ], span: [ 1, 3 ], dir: 6 },
  },

  // down out of Snake 3c onto the islands of layer 4, which run back west.
  {
    a: { map: 395, at: [ 46, 43 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 400, at: [ 46, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 400, at: [ 1, 29 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 401, at: [ 58, 29 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 401, at: [ 1, 26 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 402, at: [ 58, 9 ], span: [ 1, 3 ], dir: 4 },
  },

  // down off the last island into the dark of layer 5, east to the fork, and on to the rest room.
  {
    a: { map: 402, at: [ 7, 43 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 404, at: [ 7, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 404, at: [ 58, 30 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 405, at: [ 1, 30 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 405, at: [ 58, 31 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 406, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },

  // down out of the rest room into the prelude, and west to where the path stops.
  {
    a: { map: 406, at: [ 19, 21 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 408, at: [ 46, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 408, at: [ 1, 32 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 409, at: [ 58, 21 ], span: [ 1, 3 ], dir: 4 },
  },
];

// each map carves its floor out of solid rock with `dig` (an axis-aligned rectangle, for anything the
// miners cut) and `hollow` (an organic blob, for the chambers they opened up), and from layer 3 opens
// `gulf`s first (organic blobs of chasm, which never swallow floor already cut); from layer 4 a `rope`
// strings a Snake Rope crossing between two posts. Parallel passages keep at least three rows of rock
// between them, room for a two-row wall face and the ceiling above it.
//
// Every passage is five wide, because a three-wide one leaves a fight nothing to do but trade blows
// ("4-6 gives room for sidestepping/dodging/manuevering", Jeremy). Only a door's last few squares narrow
// to a three-wide neck, so its area event spans the whole opening. The shafts are 50x38 so the wider
// passages keep the layouts they had at three wide instead of crowding them shorter.
const SPECS = [
  {
    id: 385, tree: 'Shaft 1b', layer: 1, w: 50, h: 38,
    carve: (dig, hollow) =>
    {
      // up from Map331 through the door's neck, then west along the first gallery.
      dig(24, 34, 26, 37);
      dig(23, 25, 27, 34);
      dig(10, 25, 27, 29);
      hollow(10, 24, 7, 5, 3851);

      // north out of the chamber and east along the upper gallery.
      dig(9, 9, 13, 20);
      dig(9, 7, 30, 11);

      // down a short drop, then east to Shaft 1c.
      dig(26, 7, 30, 17);
      dig(26, 13, 44, 17);
      dig(45, 14, 49, 16);

      // a dead end south of the last gallery, for whatever Jeremy hides there.
      dig(37, 17, 41, 23);
      hollow(39, 27, 5, 4, 3852);
    },
  },
  {
    id: 386, tree: 'Shaft 1c', layer: 1, w: 50, h: 38,
    carve: (dig, hollow) =>
    {
      // in from Shaft 1b through the door's neck, into the working chamber.
      dig(0, 14, 4, 16);
      dig(4, 13, 14, 17);
      hollow(21, 13, 9, 6, 3861);

      // east out of the chamber, down, and over to the shaft that drops to layer 2.
      dig(28, 11, 42, 15);
      dig(38, 11, 42, 23);
      dig(38, 19, 47, 23);
      dig(43, 19, 47, 33);
      dig(44, 34, 46, 37);

      // a dead end below the chamber, and the tunnel on down to its rib.
      dig(19, 18, 23, 27);
      hollow(18, 30, 6, 4, 3862);
      dig(16, 30, 20, 34);
      dig(17, 35, 19, 37);
    },
  },
  {
    id: 387, tree: 'Shaft 2a', layer: 2, w: 50, h: 38,
    carve: (dig, hollow) =>
    {
      // down from Shaft 1c through the door's neck, into a chamber.
      dig(41, 0, 43, 3);
      dig(40, 3, 44, 12);
      hollow(39, 16, 8, 5, 3871);

      // west along a gallery, then south and west again to Shaft 2b.
      dig(17, 16, 34, 20);
      dig(17, 16, 21, 29);
      dig(4, 25, 21, 29);
      dig(0, 26, 4, 28);

      // a dead end up a side passage.
      dig(23, 8, 27, 16);
      hollow(23, 5, 5, 3, 3872);
    },
  },
  {
    id: 388, tree: 'Shaft 2b', layer: 2, w: 50, h: 38,
    carve: (dig, hollow) =>
    {
      // in from Shaft 2a through the door's neck, into an old working chamber.
      dig(45, 10, 49, 12);
      dig(30, 9, 45, 13);
      hollow(24, 15, 9, 6, 3881);

      // out of its far side, down, and west to Shaft 2c.
      dig(8, 19, 24, 23);
      dig(8, 19, 12, 31);
      dig(4, 27, 12, 31);
      dig(0, 28, 4, 30);

      // a dead end up a side passage off the first gallery, which carries on up to its rib.
      dig(38, 4, 42, 9);
      hollow(40, 3, 5, 2, 3882);
      dig(39, 0, 41, 2);
    },
  },
  {
    id: 389, tree: 'Shaft 2c', layer: 2, w: 50, h: 38,
    carve: (dig, hollow) =>
    {
      // in from Shaft 2b through the door's neck, and up a long climb.
      dig(45, 27, 49, 29);
      dig(35, 26, 45, 30);
      dig(35, 17, 39, 30);

      // west, up again, and west to the cavern, through a neck that opens where Cavern 2d's door lands.
      dig(22, 17, 39, 21);
      dig(22, 5, 26, 21);
      dig(4, 5, 26, 9);
      dig(0, 6, 4, 8);

      // a dead end south of the middle gallery.
      dig(26, 21, 30, 27);
      hollow(24, 30, 6, 4, 3891);
    },
  },
  {
    id: 390, tree: 'Cavern 2d', layer: 2, w: 60, h: 40,
    carve: (dig, hollow) =>
    {
      // in from Shaft 2c, where the dug shaft gives out into open cave.
      dig(48, 12, 59, 14);

      // the cavern itself, a run of overlapping hollows stepping down to the west.
      hollow(46, 15, 8, 6, 3901);
      hollow(35, 19, 10, 7, 3902);
      hollow(23, 23, 10, 7, 3903);
      hollow(12, 26, 7, 6, 3904);

      // a side pocket off the cavern's north edge.
      hollow(30, 9, 5, 3, 3905);
      dig(29, 9, 31, 15);

      // the way down to layer 3, at the cavern's west end.
      dig(8, 30, 10, 39);
    },
  },
  {
    id: 391, tree: 'Rib 1c', layer: 1, w: 40, h: 23, parent: 386,
    carve: (dig, hollow) =>
    {
      // down from Shaft 1c's dead end through the door's neck into one wide working: the miners' last
      // good seam.
      dig(19, 0, 21, 2);
      dig(18, 2, 22, 7);
      hollow(20, 12, 10, 5, 3911);

      // two nooks off the working, where the seam runs into the walls.
      hollow(10, 16, 3, 2, 3912);
      hollow(30, 8, 3, 2, 3913);
    },
  },
  {
    id: 392, tree: 'Rib 2b', layer: 2, w: 40, h: 23, parent: 388,
    carve: (dig, hollow) =>
    {
      // up from Shaft 2b's side passage through the door's neck into a chamber big enough to camp in.
      dig(19, 20, 21, 22);
      dig(18, 13, 22, 20);
      hollow(20, 9, 11, 5, 3921);

      // an alcove either side, the corners people sleep in.
      hollow(31, 6, 3, 2, 3922);
      hollow(9, 11, 3, 2, 3923);
    },
  },

  // layer 3, the snake's back: one great chasm per map, the walls standing well back from it, and a
  // five-wide path winding across it with wider platforms at the turns, room to dodge a fight rather than
  // trade blows in a corridor. Each map is 60x45, so it scrolls both ways and the path runs off into the
  // dark ahead.
  {
    id: 393, tree: 'Snake 3a', layer: 3, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 26, 17, 3930);

      // down out of Cavern 2d onto the first platform.
      dig(8, 0, 10, 6);
      dig(7, 5, 11, 16);
      hollow(10, 18, 6, 4, 3931);

      // east, up onto a high platform, and east again.
      dig(13, 17, 33, 21);
      dig(29, 8, 33, 21);
      hollow(34, 9, 7, 4, 3932);
      dig(39, 8, 50, 12);

      // down to a last platform and out through the east wall to Snake 3b.
      dig(46, 8, 50, 30);
      hollow(48, 30, 6, 4, 3933);
      dig(54, 29, 59, 31);
    },
  },
  {
    id: 394, tree: 'Snake 3b', layer: 3, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 26, 17, 3940);

      // in through the west wall onto a platform, then down the far side.
      dig(0, 10, 5, 12);
      hollow(9, 11, 5, 4, 3941);
      dig(8, 14, 12, 31);
      hollow(11, 34, 7, 4, 3942);

      // east along the bottom, back up, and onto a platform in the middle.
      dig(16, 32, 34, 36);
      dig(30, 14, 34, 36);
      hollow(34, 13, 6, 4, 3943);

      // east, down, and out through the east wall to Snake 3c.
      dig(38, 11, 51, 15);
      dig(47, 11, 51, 26);
      dig(51, 24, 59, 26);
    },
  },
  {
    id: 395, tree: 'Snake 3c', layer: 3, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 26, 17, 3950);

      // in through the west wall onto a platform, then up the far side.
      dig(0, 28, 5, 30);
      hollow(9, 29, 5, 4, 3951);
      dig(10, 9, 14, 27);
      hollow(14, 8, 6, 4, 3952);

      // east along the top to a platform, then down.
      dig(18, 7, 40, 11);
      hollow(42, 11, 6, 5, 3953);
      dig(42, 15, 46, 33);

      // a last platform, and the way down through the floor of the world to layer 4.
      hollow(46, 34, 7, 4, 3954);
      dig(46, 37, 48, 44);
    },
  },

  // layer 4 takes the ground: the path breaks into islands over the chasm, some joined by land and the
  // rest by the Snake Rope. Every rope crossing is a short jetty off each island with a durable post on
  // its tip, the two posts on one row or column a few tiles apart, so the rope fires either way.
  {
    id: 400, tree: 'Islands 4a', layer: 4, w: 60, h: 45,
    carve: (dig, hollow, gulf, rope) =>
    {
      gulf(30, 22, 27, 18, 4000);

      // down out of Snake 3c onto the first island.
      dig(46, 0, 48, 4);
      hollow(47, 9, 7, 5, 4001);

      // roped west to a second island, then down a land bridge to a third.
      dig(36, 9, 41, 11);
      hollow(23, 10, 6, 5, 4002);
      dig(28, 9, 31, 11);
      rope(36, 10, 31, 10);
      dig(19, 14, 23, 25);
      hollow(21, 28, 6, 5, 4003);

      // roped west again to the island at the chasm's edge, and out through the west wall to 4b.
      dig(12, 29, 15, 31);
      dig(2, 26, 7, 34);
      dig(7, 29, 8, 31);
      rope(12, 30, 8, 30);
      dig(0, 29, 1, 31);

      // a dead-end island roped off to the east.
      dig(27, 29, 31, 31);
      hollow(43, 30, 6, 4, 4004);
      dig(35, 29, 38, 31);
      rope(31, 30, 35, 30);
    },
  },
  {
    id: 401, tree: 'Islands 4b', layer: 4, w: 60, h: 45,
    carve: (dig, hollow, gulf, rope) =>
    {
      gulf(30, 22, 27, 18, 4010);

      // in through the east wall onto an island, then up a land bridge to the next.
      dig(55, 29, 59, 31);
      hollow(50, 30, 6, 5, 4011);
      dig(48, 14, 52, 26);
      hollow(49, 10, 6, 4, 4012);

      // roped west across the top, then down a land bridge.
      dig(39, 9, 44, 11);
      hollow(28, 10, 6, 4, 4013);
      dig(32, 9, 35, 11);
      rope(39, 10, 35, 10);
      dig(22, 13, 26, 24);
      hollow(21, 27, 6, 5, 4014);

      // roped west to the island at the chasm's edge, and out through the west wall to 4c.
      dig(11, 26, 16, 28);
      dig(2, 22, 6, 32);
      dig(6, 26, 7, 28);
      rope(11, 27, 7, 27);
      dig(0, 26, 1, 28);
    },
  },
  {
    id: 402, tree: 'Islands 4c', layer: 4, w: 60, h: 45,
    carve: (dig, hollow, gulf, rope) =>
    {
      gulf(30, 22, 27, 18, 4020);

      // in through the east wall onto an island, then roped south to the next.
      dig(55, 9, 59, 11);
      hollow(49, 11, 6, 5, 4021);
      dig(48, 15, 50, 18);
      hollow(49, 28, 6, 4, 4022);
      dig(48, 22, 50, 25);
      rope(49, 18, 49, 22);

      // west over a land bridge, then roped west to the last island and the way down to layer 5.
      dig(30, 26, 44, 30);
      hollow(25, 28, 6, 5, 4023);
      dig(17, 27, 20, 29);
      hollow(8, 28, 5, 6, 4024);
      dig(12, 27, 13, 29);
      rope(17, 28, 13, 28);
      dig(7, 33, 9, 44);

      // a dead-end island roped off to the west of the first.
      dig(39, 9, 44, 11);
      hollow(28, 10, 5, 4, 4025);
      dig(32, 9, 35, 11);
      rope(39, 10, 35, 10);
    },
  },

  // layer 5 takes the light: no passive visibility at all, only the critters, the sigil and whatever
  // light the player brought. The path winds over the chasm again rather than across islands, because
  // nobody can find a post they cannot see.
  {
    id: 404, tree: 'Dark 5a', layer: 5, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 27, 18, 4040);

      // down off the islands and onto a platform.
      dig(7, 0, 9, 4);
      dig(6, 4, 10, 14);
      hollow(9, 17, 6, 4, 4041);

      // east, up onto a high platform, and east again.
      dig(12, 15, 30, 19);
      dig(26, 7, 30, 19);
      hollow(30, 7, 6, 3, 4042);
      dig(30, 6, 44, 10);

      // down to a last platform and out through the east wall to the fork.
      dig(40, 6, 44, 28);
      hollow(43, 31, 6, 4, 4043);
      dig(46, 29, 54, 33);
      dig(54, 30, 59, 32);
    },
  },
  {
    id: 405, tree: 'Dark 5b', layer: 5, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 27, 18, 4050);

      // in through the west wall onto a platform, and up.
      dig(0, 30, 5, 32);
      hollow(9, 31, 5, 4, 4051);
      dig(10, 12, 14, 28);
      hollow(13, 10, 6, 4, 4052);

      // east to the fork, where the Basin's way in comes down from above.
      dig(18, 9, 36, 13);
      hollow(38, 11, 7, 5, 4053);
      dig(37, 0, 39, 7);

      // down and out through the east wall to the rest room.
      dig(41, 14, 45, 30);
      hollow(46, 32, 6, 4, 4054);
      dig(52, 31, 59, 33);
    },
  },
  {
    id: 406, tree: 'Respite', layer: 5, w: 40, h: 23,
    carve: (dig, hollow) =>
    {
      // the rest room: its own still chamber, solid ground under it for once, with the sigil and the
      // teleportal left for Jeremy to place.
      dig(0, 10, 4, 12);
      dig(4, 9, 10, 13);
      hollow(20, 11, 10, 5, 4061);

      // the way down to layer 6.
      dig(19, 16, 21, 22);
    },
  },

  // layer 6 takes the sound. The prelude is "a map that obviously is the last map before something bad"
  // and otherwise a regular one; then the arena, where the snaking path simply stops.
  {
    id: 408, tree: 'Prelude', layer: 6, w: 60, h: 45,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 27, 18, 4080);

      // down out of the rest room onto a platform, then west.
      dig(46, 0, 48, 4);
      dig(45, 4, 49, 14);
      hollow(47, 17, 6, 4, 4081);
      dig(28, 15, 46, 19);

      // down again, west along the bottom, and out through the west wall to her.
      dig(28, 15, 32, 30);
      hollow(30, 33, 6, 4, 4082);
      dig(5, 31, 30, 35);
      dig(0, 32, 5, 34);
    },
  },
  {
    id: 409, tree: 'Arena', layer: 6, w: 60, h: 45, silence: true,
    carve: (dig, hollow, gulf) =>
    {
      gulf(30, 22, 27, 18, 4090);

      // in through the east wall and along the last of the path.
      dig(55, 21, 59, 23);
      dig(36, 20, 55, 24);

      // where it stops: one wide platform with cliffs on every side but the way in, room for two to
      // fight a swarm. The statue and its light are Jeremy's to place.
      hollow(26, 22, 13, 9, 4091);
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

// the door helpers, bound to this recipe's links and to the maps Jeremy has taken over.
const { proveLinksKeepHeading, exitsFor, doorSquaresOf } = doorsFor(LINKS, treeName, HANDED_OVER);

/**
 * Proves a carved map's floor is one connected cave that every one of its doors and posts stands on,
 * before anything is written. Chasm does not count, since nobody walks on it, but a rope crossing does:
 * standing at one of its posts gets the player to the other. A failure here is a recipe mistake, so it
 * stops the run rather than being patched over.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[][][]} ropes The map's rope crossings, each a pair of post squares.
 */
const proveConnected = (spec, carved, ropes) =>
{
  const squares = doorSquaresOf(spec.id);
  const posts = ropes.flat();
  [ ...squares, ...posts ].forEach(([ x, y ]) =>
  {
    if (carved[y][x] !== CELL.floor)
    {
      throw new Error(`Map${spec.id}: door or post square ${x},${y} is not floor`);
    }
  });

  // each post leads to its partner across the gap, both ways.
  const across = new Map();
  ropes.forEach(([ from, to ]) =>
  {
    across.set(from.join(','), to);
    across.set(to.join(','), from);
  });

  // flood the floor from the first door, across every rope it reaches, and count what it covers.
  const [ startX, startY ] = squares[0];
  const seen = new Set([ `${startX},${startY}` ]);
  const stack = [ [ startX, startY ] ];
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

  const floorCount = carved.flat().filter(cell => cell === CELL.floor).length;
  if (seen.size !== floorCount)
  {
    throw new Error(`Map${spec.id}: ${floorCount - seen.size} floor squares cannot be reached`);
  }
};

/**
 * Carves one map out of solid rock by running its spec's carve function.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], ropes: number[][][]}} What every square holds, and the rope crossings.
 */
const carveMap = spec =>
{
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(CELL.rock));
  const ropes = [];

  /**
   * Cuts an axis-aligned passage between two corners, inclusive, clipped to the map.
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
   * Opens an organic chamber around a centre, its edge wobbling by a seeded amount so a re-run carves
   * the same room.
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
   * Opens a great organic chasm around a centre. Its edge wobbles less than a chamber's, because at this
   * size a chamber's wobble would throw the edge a third of the map off course; and it only ever replaces
   * rock, so a path cut before it survives.
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
   * Strings a Snake Rope crossing between two squares, a durable post standing on each so the rope can
   * be fired either way. The two must share a row or a column, the rope flying straight, and sit no
   * farther apart than drafts trust it to reach.
   * @param {number} x1 The first post's column.
   * @param {number} y1 The first post's row.
   * @param {number} x2 The second post's column.
   * @param {number} y2 The second post's row.
   */
  const rope = (x1, y1, x2, y2) =>
  {
    const straight = x1 === x2 || y1 === y2;
    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2);
    if (straight === false || distance < 2 || distance > ROPE_LIMIT)
    {
      throw new Error(`Map${spec.id}: ${x1},${y1} to ${x2},${y2} is not a crossing the rope can make`);
    }

    ropes.push([ [ x1, y1 ], [ x2, y2 ] ]);
  };

  spec.carve(dig, hollow, gulf, rope);

  // sand the blobs' noise off, never touching a door or a post.
  const keep = [ ...doorSquaresOf(spec.id), ...ropes.flat() ];
  tidyCarving(carved, spec.w, spec.h, keep, `Map${spec.id}`);
  return { carved, ropes };
};

/**
 * A durable post, the Snake Rope's anchor, shaped exactly like the two standing in Map331: J-ABS reads it
 * as enemy 33 from its page comment, and `through` lets the rope pull the player right up to it.
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
 * Builds one map's file contents: the rendered cave, its doors and rope posts, and the header every
 * map in its layer shares.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[][][]} ropes The map's rope crossings, each a pair of post squares.
 * @returns {Object}
 */
const buildMap = (spec, carved, ropes) =>
{
  const layer = LAYERS[spec.layer];
  const events = [ null ];
  exitsFor(spec.id).forEach((exit, index) =>
  {
    events.push(doorEvent(index + 1, exit));
  });

  // the posts follow the doors, numbered on from them.
  ropes.flat().forEach(([ x, y ]) =>
  {
    events.push(postEvent(events.length, x, y));
  });

  // a map marked for silence still autoplays, with no track, which is what stops the theme at its door.
  const track = spec.silence ? '' : THEME;

  return {
    autoplayBgm: true,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: track, pan: 0, pitch: 100, volume: layer.volume },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: 'Subterranean Depths',
    encounterList: [],
    encounterStep: 30,
    height: spec.h,
    note: `<noWeather>\n<noToneChange>\n<ambient:[${layer.darkness}]>`,
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
    data: renderCave(carved, spec.w, spec.h, layer.palette),
    events,
  };
};

/**
 * Builds a layer's folder: a 0x0 map that holds nothing, laid out exactly as MZ saves the Forlorn Basin's
 * own "FLOOR: 1" (Map183), so the editors treat it like any folder they made themselves.
 * @param {{id: number, tree: string, display: string}} floor The layer's folder.
 * @returns {Object}
 */
const buildFolder = floor =>
{
  return {
    autoplayBgm: false,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: '', pan: 0, pitch: 100, volume: 90 },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: floor.display,
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

// prove every link and every map before writing any of them, so a bad recipe never leaves a half-written
// staging run. A map Jeremy has taken over is his now, so it is neither carved nor written.
proveLinksKeepHeading();
const carvedMaps = SPECS.filter(spec => HANDED_OVER.has(spec.id) === false).map(spec =>
{
  const { carved, ropes } = carveMap(spec);
  proveConnected(spec, carved, ropes);
  return { spec, carved, ropes };
});

await Bun.$`mkdir -p ${OUT}`.quiet();

// the folders go first, so the tree has every branch before any map is hung on one.
const folders = Object.values(FLOORS).map(floor => ({
  spec: { id: floor.id, tree: floor.tree, w: 0, h: 0, parent: PARENT },
  map: buildFolder(floor),
}));
const maps = carvedMaps.map(({ spec, carved, ropes }) => ({ spec, map: buildMap(spec, carved, ropes) }));
const built = [ ...folders, ...maps ];
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else. A
// map hangs under its own `parent` when it has one, the way Jeremy nests a rib under the shaft it
// branches from, and under its layer's folder otherwise; the map tree is never meant to be a flat list.
const manifest = built.map(({ spec, map }) => ({
  id: spec.id,
  tree: spec.tree,
  parentId: spec.parent ?? FLOORS[spec.layer].id,
  order: spec.id,
  w: spec.w,
  h: spec.h,
  events: map.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${folders.length} folders and ${maps.length} maps to staging`);
built.forEach(({ spec, map }) =>
{
  console.log(`  Map${spec.id} ${spec.tree.padEnd(10)} ${spec.w}x${spec.h}  events=${map.events.filter(Boolean).length}`);
});
//endregion subterranean