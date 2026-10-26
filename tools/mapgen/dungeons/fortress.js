//region fortress
/**
 * The Frozen Fortress: chapter 5's finale, drafted to the spec in `docs/maps/fortress.md` - the empty castle
 * from the summit of the Negative Peaks, paused mid-moment beside Lakeside Road. An entry hall, a tower lane
 * for Jerald, a basement lane for Rupert, and the courtyard where the gent waits. Floors, walls and doorways
 * only: no enemies, no story events, and no decoration beyond the carpet. Those are Jeremy's passes.
 *
 * The castle is drafted a piece at a time and looked over before the next piece is added, so this holds what
 * has been drafted so far: the entry hall, where the duo take about four steps before the traps spring; the
 * whole of Jerald's tower, from the rafters he is sprung up into to Envy's chamber, plus the shaft he falls
 * down at the very end; and the whole of Rupert's basement, the caves under the castle, from the slide to
 * Lust's dome.
 *
 * Every room but a switcher room holds exactly one encounter, a standing rule for both lanes (Jeremy), so
 * each needs space for a real tussle of one against four or five. Switcher rooms are the rest stops, and
 * stay enemy-free.
 *
 * Every map wears tileset 21, "EX Dungeon Fortress", which was made for this dungeon: tileset 19's icy castle
 * with plain castle stone and blue-lit tech walls in A4 and the industrial tech sheet in E.
 *
 * Usage: bun tools/mapgen/dungeons/fortress.js
 *        bun tools/mapgen/snapshot.js 411 --staged --out hall.png
 *        bun tools/mapgen/install.js
 *        bun tools/map-atlas.js plan 411
 */
import { DATA } from '../paths.js';
import { a2TileId } from '../autotile.js';
import { blob, serialise, OUT } from '../terrain.js';
import { CELL, renderCave, tidyCarving } from '../cave.js';
import { doorEvent, doorsFor } from '../doors.js';

/**
 * The map tree node the dungeon's folder hangs under: Map118, "FIELD: Lakeside Road", beside the field's
 * other two dungeons, the Erocia Isthmus and the Crystalline Ravine.
 * @type {number}
 */
const FIELD = 118;

/**
 * The dungeon's own folder in the map tree: a 0x0 map that is nothing but a branch, like every other
 * "DUNGEON:" node.
 * @type {{id: number, tree: string, parent: number}}
 */
const DUNGEON = { id: 410, tree: 'DUNGEON: Frozen Fortress', parent: FIELD };

/**
 * Jerald's lane, gathered in a folder of its own the way the Fallen Kingdom gathers its castle's parts under
 * "AREA:" folders.
 * @type {{id: number, tree: string, parent: number}}
 */
const TOWER = { id: 412, tree: 'AREA: Tower', parent: DUNGEON.id };

/**
 * Rupert's lane: the caves under the castle, which "probably actually isn't even a basement of the castle at
 * all" (Jeremy).
 * @type {{id: number, tree: string, parent: number}}
 */
const BASEMENT = { id: 427, tree: 'AREA: Basement', parent: DUNGEON.id };

/**
 * The basement's first level, rooms 1 to 8, from the slide to the second switcher room. Within a level the
 * maps run side to side, eastwards, and the lane drops to the next level from its end.
 * @type {{id: number, tree: string, parent: number}}
 */
const B1 = { id: 428, tree: 'FLOOR: B1', parent: BASEMENT.id };

/**
 * The basement's second level, rooms 9 to 12, from the horde to the last switcher room. It runs back west,
 * under the first.
 * @type {{id: number, tree: string, parent: number}}
 */
const B2 = { id: 437, tree: 'FLOOR: B2', parent: BASEMENT.id };

/**
 * The basement's last level, Lust's alone: "the boss on his own final level" (Jeremy).
 * @type {{id: number, tree: string, parent: number}}
 */
const B3 = { id: 442, tree: 'FLOOR: B3', parent: BASEMENT.id };

/**
 * Every folder this recipe writes, in the order they hang on the tree.
 * @type {{id: number, tree: string, parent: number}[]}
 */
const FOLDERS = [ DUNGEON, TOWER, BASEMENT, B1, B2, B3 ];

/**
 * How much a dome's edge wobbles, against a cave chamber's 0.28: little enough that the room reads as one great
 * round vault rather than as a cavern.
 * @type {number}
 */
const DOME_WOBBLE = 0.08;

/**
 * Where the fall sorts among the tower's maps. It is the lane's last map but drafted early, so the floors
 * drafted after it (ids from 418) would otherwise sort below it; any order above every id keeps it last until
 * the editor renumbers the tree, and a later install has to slot its floors in above it.
 * @type {number}
 */
const FALL_ORDER = 9999;

/**
 * Tileset 21, "EX Dungeon Fortress".
 * @type {number}
 */
const TILESET = 21;

/**
 * The plain castle look: the cracked flagstone floor ("A2 ground 11" in the map editor) under the plain grey
 * castle stone ("A4 ceiling 1" and "A4 wall 9").
 * @type {{floor: number, ceiling: number, face: number}}
 */
const CASTLE = { floor: 26, ceiling: 80, face: 88 };

/**
 * The floor of anything raised above a room, like the entry hall's balcony: the square grey tiles ("A2 ground
 * 28"), paved apart from the cracked flagstone below so the eye reads it as the floor above. Railings and the
 * stair tiles themselves are decoration, and Jeremy's.
 * @type {number}
 */
const UPPER = 43;

/**
 * The rafters' beams: the grey brick ("A2 ground 9"), standing in for wood until Jeremy dresses them, since
 * tileset 21 has no wooden beams and tileset 18 does.
 * @type {number}
 */
const BEAM = 24;

/**
 * The elevator car's floor: the flagstone set with blue-lit tech ("A2 ground 12"), the one floor in the tower
 * that is plainly his tech rather than the castle's stone.
 * @type {number}
 */
const CAR_FLOOR = 27;

/**
 * The elevator car's front, the wall face that shows it is a solid thing hanging in the shaft: riveted steel
 * ("A4 wall 14").
 * @type {number}
 */
const CAR_FRONT = 93;

/**
 * The carpet, or something like one: the dark framed slab ("A2 decoration 22"), which reads as a runner
 * against the pale flagstone. It is an A2 decoration, so it lies over the floor on the decoration layer,
 * where the map editor puts it too.
 * @type {number}
 */
const CARPET = 37;

/**
 * The tile layer the A2 decorations lie on, over the ground.
 * @type {number}
 */
const DECORATION_LAYER = 1;

/**
 * Tileset 22, "EX Dungeon Basement": tileset 18's caves, twisted roots, industrial machines and gothic sheet,
 * with tileset 19's toxic sludge pools and hazard grate.
 * @type {number}
 */
const CAVE_TILESET = 22;

/**
 * The basement's look: the dark purple-grey cobble underfoot ("A2 ground 9"), under the dark, mossy cave whose
 * wall face is all twisted roots ("A4 ceiling 18" and "A4 wall 26"), the growth the castle landed on, dead and
 * gone wrong.
 * @type {{floor: number, ceiling: number, face: number}}
 */
const CAVE = { floor: 24, ceiling: 97, face: 105 };

/**
 * The hazard grate, tileset 19's red lattice over glowing heat, for the basement's environmental hazard
 * floors. It is passable on every shape; what it does to Rupert is Jeremy's to event.
 * @type {number}
 */
const HAZARD = 12;

/**
 * The toxic sludge, tileset 19's green goop in its stone rim, which tileset 22 flags impassable on every
 * shape: "I don't wanna take even a STEP into that disgusting sludge".
 * @type {number}
 */
const SLUDGE = 6;

/**
 * Dressed stone in the caves, the cracked flagstone ("A2 ground 19"), where somebody built something: the
 * cultists' platforms the demons come from.
 * @type {number}
 */
const RITUAL = 34;

/**
 * The floor kinds nobody can stand on, which the proof that a map holds together leaves out.
 * @type {Set<number>}
 */
const IMPASSABLE_FLOORS = new Set([ SLUDGE ]);

/**
 * How CA's hops are built (`Map158` "Rapid Hops"): a player-touch event on the edge square of each side of a
 * two-square gap, three squares apart, each throwing the player four squares, so a jump lands one square past
 * the other side's event rather than on it and never bounces them back. Each way's turn command, from MZ's
 * move route codes: turn down, left, right and up.
 * @type {Object<string, {turn: number, name: string}>}
 */
const HOP_WAY = {
  '0,1': { turn: 16, name: 'jump down' },
  '-1,0': { turn: 17, name: 'jump left' },
  '1,0': { turn: 18, name: 'jump right' },
  '0,-1': { turn: 19, name: 'jump up' },
};

/**
 * What every map of the basement shares: its tileset and look, and the dark. Every map is pitch black from
 * the first step (`<ambient:[100]>`), with nothing to see by but Rupert's own lighting gear, a few whirring
 * machines and the Digiwood; and it is a cave, carved in blobs and sanded smooth.
 * @type {{palette: Object, tileset: number, note: string, cave: boolean, display: string}}
 */
const CAVE_MAP = {
  palette: CAVE,
  tileset: CAVE_TILESET,
  note: '<noWeather>\n<noToneChange>\n<ambient:[100]>',
  cave: true,
  display: 'The Basement',
};

/**
 * What a map's header says about scrolling: MZ's `scrollType` 1 loops the map vertically.
 * @type {{none: number, vertical: number}}
 */
const LOOP = { none: 0, vertical: 1 };

// every link names both doorways, in Jeremy's door format (see `doors.js`). The tower climbs up the screen:
// each floor is left through a stair at its top and entered through a stair at the bottom of the next, the
// two stairs standing over each other, so the way up zigzags across every floor. The hall's ways in and out
// are all story events (the gate, the spring, the trapdoor, the courtyard doors, the elevator), and so is the
// fall, so none of them is a link.
const LINKS = [
  // up off the rafters' far ledge into the tower.
  {
    a: { map: 413, at: [ 26, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 414, at: [ 26, 21 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 414, at: [ 4, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 415, at: [ 4, 21 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 415, at: [ 17, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 416, at: [ 17, 21 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 416, at: [ 4, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 418, at: [ 4, 21 ], span: [ 3, 1 ], dir: 8 },
  },

  // the dead elevator is the only way from the fifth floor to the sixth, and power decides whether it runs,
  // so that ride is Jeremy's event; the stairs carry on from the sixth floor up.
  {
    a: { map: 419, at: [ 26, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 420, at: [ 26, 21 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 420, at: [ 4, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 421, at: [ 4, 21 ], span: [ 3, 1 ], dir: 8 },
  },
  {
    a: { map: 421, at: [ 17, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 422, at: [ 17, 21 ], span: [ 3, 1 ], dir: 8 },
  },

  // the long elevator ride, from the mini-boss's floor to the floor above it, is all Jeremy's eventing: the
  // ride, the robot waves, and where it lets Jerald off. Above it, the grand staircase climbs to the last
  // switcher room, six wide, and the last stair climbs to Envy.
  {
    a: { map: 424, at: [ 17, 1 ], span: [ 6, 1 ], dir: 2 },
    b: { map: 425, at: [ 17, 21 ], span: [ 6, 1 ], dir: 8 },
  },
  {
    a: { map: 425, at: [ 18, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 426, at: [ 18, 44 ], span: [ 3, 1 ], dir: 8 },
  },

  // the basement's first level runs east, map to map, through doors in the side walls. How Rupert gets in
  // at all, down the trapdoor and the slide, is Jeremy's event.
  {
    a: { map: 429, at: [ 48, 22 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 430, at: [ 1, 22 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 430, at: [ 48, 10 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 431, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 431, at: [ 48, 22 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 432, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 432, at: [ 38, 10 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 433, at: [ 1, 18 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 433, at: [ 118, 15 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 434, at: [ 1, 16 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 434, at: [ 48, 26 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 435, at: [ 1, 18 ], span: [ 1, 3 ], dir: 6 },
  },
  {
    a: { map: 435, at: [ 58, 18 ], span: [ 1, 3 ], dir: 4 },
    b: { map: 436, at: [ 1, 10 ], span: [ 1, 3 ], dir: 6 },
  },

  // down from the second switcher room to the second level, which runs back west; then up out of the dome's
  // approach into the last switcher room.
  {
    a: { map: 436, at: [ 19, 21 ], span: [ 3, 1 ], dir: 8 },
    b: { map: 438, at: [ 44, 1 ], span: [ 3, 1 ], dir: 2 },
  },
  {
    a: { map: 438, at: [ 1, 24 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 439, at: [ 78, 13 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 439, at: [ 1, 16 ], span: [ 1, 3 ], dir: 6 },
    b: { map: 440, at: [ 48, 26 ], span: [ 1, 3 ], dir: 4 },
  },
  {
    a: { map: 440, at: [ 27, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 441, at: [ 19, 21 ], span: [ 3, 1 ], dir: 8 },
  },

  // on north out of the last switcher room into Lust's dome. The elevator up out of it is the lane's exit
  // scene, Jeremy's to event.
  {
    a: { map: 441, at: [ 19, 1 ], span: [ 3, 1 ], dir: 2 },
    b: { map: 443, at: [ 38, 44 ], span: [ 3, 1 ], dir: 8 },
  },
];

/**
 * The shell every floor of the tower shares: one screen, castle stone all round, the stairs, and the hole.
 * The hole is the shaft Jerald falls down at the end of his lane: it sits in the same place on every floor,
 * down the right side, where its far wall drops two rows into nothing, and nothing is solid, which makes it
 * "inexplicably inaccessible" for free. A floor reached by the elevator rather than a stair names no `from`,
 * and the floor the elevator leaves names no `up`.
 * @param {function(number, number, number, number, number=): void} dig Cuts floor.
 * @param {function(number, number, number, number): void} wall Puts stone back.
 * @param {function(number, number, number, number): void} pit Opens nothing.
 * @param {{from: (number|undefined), up: (number|undefined)}} stairs The left columns of the stair up from the
 * floor below, through the front wall, and of the stair on up, through the back wall.
 */
const towerFloor = (dig, wall, pit, stairs) =>
{
  // the floor itself, under the back wall's two rows of face.
  dig(2, 3, 37, 20);

  // the hole: its far wall, then the shaft.
  wall(31, 5, 37, 6);
  pit(31, 7, 37, 17);

  // the stair up from the floor below, and the stair on up.
  if (stairs.from !== undefined)
  {
    dig(stairs.from, 21, stairs.from + 2, 22);
  }

  if (stairs.up !== undefined)
  {
    dig(stairs.up, 0, stairs.up + 2, 2);
  }
};

// each map carves its floor out of solid stone with `dig`, an axis-aligned rectangle, since a castle is
// architecture rather than a cave; a dig can name its own floor, and takes the castle's flagstone otherwise.
// `wall` puts stone back and `pit` opens nothing at all. A raised floor stands exactly two rows of stone
// above the floor below it, because those two rows become the wall face that holds it up, and a hole shows
// its far wall the same way. A map that starts as open air rather than stone says so with `air`.
const SPECS = [
  {
    // two screens tall, because one screen made it "more like an entry closet" (Jeremy).
    id: 411, tree: 'Entry Hall', display: 'Entry Hall', w: 40, h: 46,
    carve: dig =>
    {
      // the balcony across the back of the hall, overlooking it.
      dig(2, 3, 37, 5, UPPER);

      // the hall itself. The courtyard doors stand in the balcony's wall dead ahead of the way in (x 18-21,
      // rows 6-7) and the elevator a little to their right (x 26-27); both are Jeremy's events to place, so
      // the wall is left whole for them.
      dig(2, 8, 37, 44);

      // a flight of stairs up to the balcony at each end, against the side walls, cut through its wall.
      dig(2, 6, 4, 7, UPPER);
      dig(35, 6, 37, 7, UPPER);

      // the way in from the gate, through the middle of the hall's front wall.
      dig(18, 45, 21, 45);
    },

    // the carpet runs straight from the way in to the foot of the courtyard doors.
    carpet: [ 18, 8, 21, 45 ],
  },
  {
    // the rafters high over the entry hall, open air everywhere but the beams. The parallax will be a still of
    // the polished hall, shrunk to fit this one screen, so the beams keep to its middle twenty columns, where
    // the hall below will show. The spring lands Jerald on the bottom beam, over the carpet (19, 20).
    id: 413, tree: 'Tower 1: Rafters', display: 'Rafters', w: 40, h: 23, parent: TOWER.id, air: true,
    carve: dig =>
    {
      // the beams zigzag up: along one, up a tie at its end, back along the next.
      dig(10, 20, 29, 20, BEAM);
      dig(10, 15, 10, 20, BEAM);
      dig(10, 15, 29, 15, BEAM);
      dig(29, 10, 29, 15, BEAM);
      dig(10, 10, 29, 10, BEAM);
      dig(10, 5, 10, 10, BEAM);
      dig(10, 5, 29, 5, BEAM);

      // halfway up, the beams meet in a broad platform, the one place up here with room for the room's
      // encounter; the beams themselves are one wide, for balancing rather than fighting.
      dig(11, 7, 28, 13, BEAM);

      // up a last tie to the ledge at the far wall, and through the door into the tower.
      dig(27, 2, 27, 5, BEAM);
      dig(26, 0, 28, 2, BEAM);
    },
  },
  {
    // "a boring floor, hazard trap enemies probably".
    id: 414, tree: 'Tower 2: Boring Floor', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 26, up: 4 });
    },
  },
  {
    // the floor that gives way under Jerald and drops Rupert his bridge. The floor has already fallen in
    // across the room, leaving one crossing he cannot avoid, which is where Jeremy's event breaks it.
    id: 415, tree: 'Tower 3: Crumbling Floor', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 4, up: 17 });

      // the fallen-in trench, running into the hole, and the crossing left standing.
      wall(2, 10, 30, 11);
      pit(2, 12, 30, 12);
      dig(14, 10, 16, 12);
    },
  },
  {
    // the first switcher room: enemy-free by convention, with the sigil Jeremy's to place.
    id: 416, tree: 'Tower 4: Switcher Room', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 17, up: 4 });
    },
  },
  {
    // the dead elevator, waiting on power from the lever below; the only way up is the elevator itself. Four
    // pillars stand around the lobby, cover for a fight that has nowhere else to go.
    id: 418, tree: 'Tower 5: Dead Elevator', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 4 });

      // the elevator's car stands in a recess in the back wall, dead ahead of the lobby (x 18-21).
      dig(18, 1, 21, 2);

      // the pillars.
      wall(8, 7, 9, 9);
      wall(22, 7, 23, 9);
      wall(8, 14, 9, 16);
      wall(22, 14, 23, 16);
    },
  },
  {
    // "a room of traps firing deadly bolts": the traps are hazard enemies, sitting in niches cut into the
    // left wall and the back wall so their bolts cross the floor both ways. The elevator arrives in a recess
    // in the front wall, under where it left the floor below.
    id: 419, tree: 'Tower 6: Bolt Gallery', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { up: 26 });

      // where the elevator comes up (x 18-21).
      dig(18, 21, 21, 21);

      // the niches: four down the left wall, three along the back.
      dig(1, 5, 1, 6);
      dig(1, 9, 1, 10);
      dig(1, 13, 1, 14);
      dig(1, 17, 1, 18);
      dig(9, 1, 10, 2);
      dig(15, 1, 16, 2);
      dig(21, 1, 22, 2);
    },
  },
  {
    // "a needless amount of hazards", whose destruction reverse-charges the circuit. The floor runs in a ring
    // around a great block of masonry, so the fight circles it, and the hazards have every wall to line.
    id: 420, tree: 'Tower 7: Needless Hazards', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 26, up: 4 });
      wall(12, 8, 22, 14);
    },
  },
  {
    // the second switcher room, enemy-free like the first.
    id: 421, tree: 'Tower 8: Switcher Room', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 4, up: 17 });
    },
  },
  {
    // the mini-boss: one massively overpowered ghost. The floor is left wide open, since a ghost needs no
    // cover and the fight needs every square of room; the way on is another elevator, in the back wall.
    id: 422, tree: 'Tower 9: Mini-Boss', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { from: 17 });

      // the elevator's car stands in a recess in the back wall (x 18-21).
      dig(18, 1, 21, 2);
    },
  },
  {
    // the long elevator ride, ambushed by robots: a static car, six by six, hanging in a shaft with empty
    // space all round it before the walls. Jeremy moves the parallax to make it climb, with sound and
    // dialogue, and spawns the waves by eventing; the car is "a little tight" on purpose.
    id: 423, tree: 'Tower 10: Elevator Ride', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      // the shaft, nothing but the parallax, its far wall showing above it.
      pit(12, 3, 27, 18);

      // the car's floor, and the riveted front that hangs beneath it.
      dig(17, 8, 22, 13, CAR_FLOOR);
      wall(17, 14, 22, 15, CAR_FRONT);
    },
  },
  {
    // "a room with what appears to be a staircase up to some chamber": the elevator lets Jerald off in a
    // recess in the front wall, and a grand staircase climbs through the back wall, six wide, between two
    // pairs of pillars that make an aisle of the approach.
    id: 424, tree: 'Tower 11: Grand Staircase', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, {});

      // where the elevator comes up (x 18-21), and the grand staircase (x 17-22).
      dig(18, 21, 21, 21);
      dig(17, 0, 22, 2);

      // the pillars either side of the aisle.
      wall(13, 5, 14, 7);
      wall(25, 5, 26, 7);
      wall(13, 11, 14, 13);
      wall(25, 11, 26, 13);
    },
  },
  {
    // the last switcher room, enemy-free like the others, where the grand staircase arrives; Rupert's care
    // package lands here.
    id: 425, tree: 'Tower 12: Switcher Room', display: 'The Tower', w: 40, h: 23, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      towerFloor(dig, wall, pit, { up: 18 });

      // the grand staircase arriving, six wide (x 17-22).
      dig(17, 21, 22, 22);
    },
  },
  {
    // Envy's chamber, two screens tall: one screen left thirty milling clones of Jerald one every few
    // squares (Jeremy). The hole sits where it does on every floor, at the top right, for the tumble after
    // the fight, and the floor she waits on is paved apart.
    id: 426, tree: 'Tower 13: Envy', display: 'The Tower', w: 40, h: 46, parent: TOWER.id,
    carve: (dig, wall, pit) =>
    {
      // the chamber, under the back wall's two rows of face.
      dig(2, 3, 37, 43);

      // the hole: its far wall, then the shaft.
      wall(31, 5, 37, 6);
      pit(31, 7, 37, 17);

      // where she waits, and the last stair up into the chamber.
      dig(13, 6, 26, 12, UPPER);
      dig(18, 44, 20, 45);
    },
  },

  // the basement: caves, carved with `hollow`s (organic chambers, seeded so a re-run carves the same room)
  // joined by five-wide passages, and paved here and there with hazard floor by `pave`. Each room's chamber
  // has space for its one encounter.
  {
    // the trapdoor's output: the landing, the one lit spot down here, under the hole in the ceiling; then the
    // slide, a chute Rupert cannot walk back up, into the cavern below.
    ...CAVE_MAP, id: 429, tree: 'Basement 1: Landing', w: 50, h: 38, parent: B1.id,
    carve: (dig, wall, pit, hollow) =>
    {
      // the landing (Rupert comes down at its middle, 9, 7), and the slide south out of it.
      hollow(9, 7, 5, 3, 4291);
      dig(7, 9, 11, 19);

      // the cavern at the slide's foot, where the room's encounter waits.
      hollow(19, 25, 12, 7, 4292);

      // east along a passage, and out through the east wall to the dark floor.
      dig(29, 21, 44, 25);
      dig(44, 22, 49, 24);
    },
  },
  {
    // "a boring dark floor, environmental hazard floors probably".
    ...CAVE_MAP, id: 430, tree: 'Basement 2: Dark Floor', w: 50, h: 38, parent: B1.id,
    carve: (dig, wall, pit, hollow, pave) =>
    {
      // in through the west wall from the landing.
      dig(0, 22, 5, 24);
      dig(5, 20, 14, 26);

      // a cavern with hazard floor underfoot, the room's encounter.
      hollow(22, 21, 11, 7, 4301);
      pave(19, 24, 4, 2, 4302, HAZARD);
      pave(27, 18, 3, 2, 4303, HAZARD);

      // north out of the cavern, then east, and out through the east wall to the lever.
      dig(30, 9, 34, 18);
      dig(30, 9, 45, 13);
      dig(45, 10, 49, 12);
    },
  },
  {
    // the first "how convenient": the lever that powers Jerald's elevator. It is high-tech and out of place,
    // standing in a nook beside the way out, where Rupert cannot pass without seeing it.
    ...CAVE_MAP, id: 431, tree: 'Basement 3: The Lever', w: 50, h: 38, parent: B1.id,
    carve: (dig, wall, pit, hollow) =>
    {
      // in through the west wall from the dark floor, and down into a cavern, the room's encounter.
      dig(0, 10, 5, 12);
      dig(5, 8, 12, 13);
      dig(8, 13, 12, 18);
      hollow(20, 24, 12, 7, 4311);

      // east out of the cavern, past the lever's nook (the lever at 36, 18).
      dig(31, 21, 44, 25);
      dig(35, 17, 38, 20);

      // out through the east wall to the switcher room.
      dig(44, 22, 49, 24);
    },
  },
  {
    // the first switcher room: a still chamber, enemy-free, the sigil Jeremy's to place.
    ...CAVE_MAP, id: 432, tree: 'Basement 4: Switcher Room', w: 40, h: 23, parent: B1.id,
    carve: (dig, wall, pit, hollow) =>
    {
      dig(0, 10, 13, 12);
      hollow(20, 11, 10, 5, 4321);
      dig(27, 10, 39, 12);
    },
  },
  {
    // the ocean of goop, the block on Rupert's side: big enough that nobody standing at one edge could see
    // across it even with light, and the basement has none, so it is crossed rather than seen, about three
    // screens of hops. No tools: both lanes hop a little, and nobody has to ask who had the Snake Rope last
    // (Jeremy).
    ...CAVE_MAP, id: 433, tree: 'Basement 5: Goop Ocean', w: 120, h: 40, parent: B1.id,
    carve: (dig, wall, pit, hollow, pave, hop, bridge) =>
    {
      // the goop, wall to wall under the cave's far wall.
      dig(2, 4, 117, 36, SLUDGE);

      // the west shore, in from the switcher room.
      dig(0, 18, 2, 20);
      dig(2, 14, 9, 26);

      // the block: six squares of goop, too wide to hop, until Jerald's chunk of floor comes down and makes
      // the bridge. The sigil is one room back, as the block needs.
      bridge(9, 19, 16, 19);

      // the hops east, island to island: over to a ledge, up, along, and onto the big island.
      dig(16, 15, 22, 23);
      dig(25, 17, 30, 21);
      hop(22, 19, 1, 0);
      dig(25, 8, 32, 14);
      hop(28, 17, 0, -1);
      dig(35, 8, 40, 14);
      hop(32, 11, 1, 0);

      // the big island halfway across, the room's encounter.
      dig(43, 8, 48, 14);
      hollow(56, 12, 9, 5, 4331);
      dig(58, 14, 62, 18);
      hop(40, 11, 1, 0);

      // down off the big island, along, up, and along again to the east shore.
      dig(56, 21, 64, 27);
      hop(60, 18, 0, 1);
      dig(67, 22, 72, 27);
      hop(64, 24, 1, 0);
      dig(75, 22, 81, 29);
      hop(72, 25, 1, 0);
      dig(75, 13, 82, 19);
      hop(78, 22, 0, -1);
      dig(85, 12, 91, 19);
      hop(82, 16, 1, 0);
      dig(94, 12, 99, 18);
      hop(91, 15, 1, 0);
      dig(102, 9, 117, 24);
      hop(99, 15, 1, 0);

      // the way on east, to the hazard floors.
      dig(117, 15, 119, 17);
    },
  },
  {
    // "yet more environmental hazard floors everywhere, manageable, a nuisance. Rupert hates sludge": a winding
    // cave salted with hazard grate and puddles of goop, through two caverns, the first the room's encounter.
    ...CAVE_MAP, id: 434, tree: 'Basement 6: Hazard Floors', w: 50, h: 38, parent: B1.id,
    carve: (dig, wall, pit, hollow, pave) =>
    {
      // in through the west wall from the goop.
      dig(0, 16, 5, 18);
      dig(5, 14, 16, 20);

      // the first cavern, the room's encounter, then south into the second and out through the east wall.
      hollow(24, 17, 10, 6, 4341);
      dig(30, 17, 34, 30);
      hollow(38, 29, 8, 5, 4342);
      dig(44, 26, 49, 28);

      // the nuisance: grate underfoot, and goop to step round.
      pave(20, 15, 3, 2, 4343, HAZARD);
      pave(27, 20, 3, 2, 4344, HAZARD);
      pave(32, 24, 2, 3, 4345, HAZARD);
      pave(40, 30, 3, 2, 4346, HAZARD);
      pave(23, 13, 2, 1, 4347, SLUDGE);
      pave(36, 31, 2, 1, 4348, SLUDGE);
    },
  },
  {
    // "completely covered in hazard floors": one great field of grate between safe ground at either end. A
    // switch puzzle opens a few jumps that lessen the damage without removing it, over a chain of safe
    // stepping stones covering about half the way; or, if Jerald reverse-charged the circuit, a light bridge
    // forms straight across (along row 23, x 12-47) and the crossing is free. The puzzle's switch is the
    // jumps' page condition, and the bridge, both Jeremy's to event.
    ...CAVE_MAP, id: 435, tree: 'Basement 7: Hazard Field', w: 60, h: 40, parent: B1.id,
    carve: (dig, wall, pit, hollow, pave, hop) =>
    {
      // the field, grate from wall to wall.
      hollow(30, 19, 18, 11, 4351, HAZARD);

      // safe ground at the west end, in from the hazard floors, and at the east end, out to the switcher room.
      dig(0, 18, 5, 20);
      dig(5, 14, 11, 24);
      dig(48, 14, 55, 25);
      dig(55, 18, 59, 20);

      // the stepping stones, and the jumps the puzzle opens between them.
      dig(14, 17, 18, 21);
      dig(21, 16, 25, 22);
      dig(28, 17, 32, 21);
      hop(11, 19, 1, 0);
      hop(18, 19, 1, 0);
      hop(25, 19, 1, 0);
    },
  },
  {
    // the second switcher room: a still chamber, enemy-free, the sigil Jeremy's to place, and the drop to the
    // basement's second level.
    ...CAVE_MAP, id: 436, tree: 'Basement 8: Switcher Room', w: 40, h: 23, parent: B1.id,
    carve: (dig, wall, pit, hollow) =>
    {
      dig(0, 10, 13, 12);
      hollow(20, 10, 9, 5, 4361);
      dig(19, 14, 21, 22);
    },
  },
  {
    // the mini-boss: "the horde" of puppets, orbs and golems, not a boss at all, so the arena is the biggest
    // cavern yet, room for one man against a crowd.
    ...CAVE_MAP, id: 438, tree: 'Basement 9: The Horde', w: 60, h: 45, parent: B2.id,
    carve: (dig, wall, pit, hollow) =>
    {
      // down from the switcher room, into the arena.
      dig(44, 0, 46, 6);
      dig(43, 6, 47, 22);
      hollow(30, 24, 18, 11, 4381);

      // out through the west wall to the cultists' lair.
      dig(4, 23, 14, 27);
      dig(0, 24, 4, 26);
    },
  },
  {
    // "a long path Rupert can only read as a cultists' lair, torches lighting as he nears, a couple of platforms
    // spawning waves of demons": a long, winding path, and beside it two platforms of dressed stone, the
    // waves together the room's one encounter. The torches are Jeremy's events along the path.
    ...CAVE_MAP, id: 439, tree: 'Basement 10: Cultists\' Lair', w: 80, h: 30, parent: B2.id,
    carve: (dig, wall, pit, hollow, pave) =>
    {
      // in through the east wall from the horde, then the long path west: along, down, along, up, along.
      dig(75, 13, 79, 15);
      dig(60, 11, 76, 15);
      dig(56, 11, 60, 22);
      dig(40, 18, 60, 22);
      dig(36, 6, 40, 22);
      dig(16, 6, 40, 10);
      dig(12, 6, 16, 20);
      dig(4, 15, 16, 19);

      // the platforms the demons come from, the first at the path's first bend and the second at its last.
      dig(50, 20, 62, 27, RITUAL);
      dig(20, 10, 32, 17, RITUAL);

      // out through the west wall to the dome's approach.
      dig(0, 16, 4, 18);
    },
  },
  {
    // a room that "leads up to a large dome underground", per Rupert: in from the east into a cavern, the room's
    // encounter, and then a broad climb north to the dome. A dead-end side passage off the cavern ends at the
    // barely perceptible button that drops Jerald's care package (9, 28).
    ...CAVE_MAP, id: 440, tree: 'Basement 11: Dome Approach', w: 50, h: 38, parent: B2.id,
    carve: (dig, wall, pit, hollow) =>
    {
      // in through the east wall from the cultists' lair, into the cavern.
      dig(45, 26, 49, 28);
      dig(36, 24, 45, 30);
      hollow(28, 26, 12, 7, 4401);

      // the side passage to the button.
      dig(8, 27, 17, 29);

      // the climb north, broad as a processional, and out through the top to the last switcher room.
      dig(22, 6, 34, 20);
      dig(27, 0, 29, 6);
    },
  },
  {
    // the last switcher room, enemy-free, where Jerald's care package lands; the way on north is to Lust.
    ...CAVE_MAP, id: 441, tree: 'Basement 12: Switcher Room', w: 40, h: 23, parent: B2.id,
    carve: (dig, wall, pit, hollow) =>
    {
      dig(19, 16, 21, 22);
      hollow(20, 11, 9, 5, 4411);
      dig(19, 0, 21, 6);
    },
  },
  {
    // Lust's dome, the "large dome underground", big on purpose: his approach scene is paced by his slow walk,
    // each line firing as he crosses a distance from Rupert, so the walk has to be long. Rupert comes in at the
    // bottom; Lust waits at the far end (40, 9); and the VERY convenient elevator that ends the lane stands in a
    // recess in the back wall behind him (x 38-41, rows 2-4).
    ...CAVE_MAP, id: 443, tree: 'Basement 13: Lust', w: 80, h: 46, parent: B3.id,
    carve: (dig, wall, pit, hollow, pave, hop, bridge, dome) =>
    {
      // the dome itself.
      dome(40, 24, 34, 19, 4431);

      // in from the switcher room through the front of the dome.
      dig(38, 40, 40, 45);

      // the elevator's recess, in the back wall dead ahead.
      dig(38, 2, 41, 9);
    },
  },
  {
    // the courtyard, the one place in the castle open to the sky, and the last map of the dungeon: the gent's
    // duel. It has a weather of its own, a purple gloom (the `gloom` preset), and is perpetually dark but not
    // black, lit by Jeremy's fluorescent lights; `<noToneChange>` because the castle is paused and has no clock,
    // which also holds the gloom at a steady strength. The gate from the entry hall opens at the bottom middle
    // (x 28-31), Jeremy's event, since it needs both the key and the power. Across the far end runs a raised
    // terrace with stairs down its middle and the statue at its centre (29, 5), which the gent steps out from
    // behind; everything below it is wide open for a battle mage who blinks from point to point.
    id: 444, tree: 'The Courtyard', display: 'The Courtyard', w: 60, h: 40,
    note: '<noToneChange>\n<weather:gloom>\n<ambient:[85]>',
    carve: (dig, wall) =>
    {
      // the courtyard, and the gate in from the entry hall.
      dig(3, 4, 56, 36);
      dig(28, 37, 31, 39);

      // the terrace across the far end, its wall, and the stairs down from it.
      dig(3, 4, 56, 7, UPPER);
      wall(3, 8, 56, 9);
      dig(27, 8, 32, 9, UPPER);
    },
  },
];

/**
 * The fall: the inside of the shaft Jerald tumbles down at the end of his lane, a tunnel of plain castle
 * stone between two dark sides. The map loops vertically, so with Jerald on a move-down route the fall lasts
 * exactly as long as Jeremy's monologue, past the same windows, until the last line hands control over. Two
 * screens tall, so the loop has room for the windows to vary.
 * @type {{id: number, tree: string, display: string, w: number, h: number, parent: number, order: number, shaft: number[]}}
 */
const FALL = {
  id: 417, tree: 'Tower 14: The Fall', display: '', w: 40, h: 46, parent: TOWER.id, order: FALL_ORDER,
  shaft: [ 15, 24 ],
};

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

// the door helpers, bound to this recipe's links; nothing here has been handed over yet.
const { proveLinksKeepHeading, exitsFor, doorSquaresOf } = doorsFor(LINKS, treeName, new Set());

/**
 * Carves one map by running its spec's carve function over solid stone, or over open air for a map that
 * says `air`.
 * @param {Object} spec The map's spec.
 * @returns {{carved: number[][], floors: number[][], faces: number[][]}} What every square holds, as a `CELL`,
 * the floor kind of every square carved, and the face kind every stone square takes if a face hangs there, all
 * by row then column.
 */
const carveMap = spec =>
{
  const palette = spec.palette ?? CASTLE;
  const start = spec.air ? CELL.void : CELL.rock;
  const carved = Array.from({ length: spec.h }, () => new Array(spec.w).fill(start));
  const floors = Array.from({ length: spec.h }, () => new Array(spec.w).fill(palette.floor));
  const faces = Array.from({ length: spec.h }, () => new Array(spec.w).fill(palette.face));

  /**
   * Sets every square of a rectangle, inclusive, clipped to the map.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {number} cell What the squares hold, as a `CELL`.
   * @param {number} floor The floor kind, for a floor.
   * @param {number} face The face kind, for stone that a face hangs on.
   */
  const fill = (x1, y1, x2, y2, cell, floor, face) =>
  {
    for (let y = Math.max(0, y1); y <= Math.min(spec.h - 1, y2); y++)
    {
      for (let x = Math.max(0, x1); x <= Math.min(spec.w - 1, x2); x++)
      {
        carved[y][x] = cell;
        floors[y][x] = floor;
        faces[y][x] = face;
      }
    }
  };

  /**
   * Cuts an axis-aligned room or passage between two corners, inclusive, and paves it.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {number} floor The floor's autotile kind; the map's own floor unless a dig names another.
   */
  const dig = (x1, y1, x2, y2, floor = palette.floor) =>
  {
    fill(x1, y1, x2, y2, CELL.floor, floor, palette.face);
  };

  /**
   * Puts solid stone back over a rectangle, inclusive: a wall face where it stands over something open, and
   * ceiling everywhere else.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   * @param {number} face The face's autotile kind; the map's own wall unless a wall names another.
   */
  const wall = (x1, y1, x2, y2, face = palette.face) =>
  {
    fill(x1, y1, x2, y2, CELL.rock, palette.floor, face);
  };

  /**
   * Opens nothing at all over a rectangle, inclusive: a hole nobody can step into, showing the parallax.
   * @param {number} x1 The left column.
   * @param {number} y1 The top row.
   * @param {number} x2 The right column.
   * @param {number} y2 The bottom row.
   */
  const pit = (x1, y1, x2, y2) =>
  {
    fill(x1, y1, x2, y2, CELL.void, palette.floor, palette.face);
  };

  /**
   * Every square inside a seeded organic blob, so a re-run finds the same squares.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   * @param {number|undefined} wobble How far the edge strays, as a share of the radius; a chamber's own when
   * left out.
   * @returns {number[][]} The squares, as [x, y].
   */
  const blobSquares = (cx, cy, rx, ry, seed, wobble = undefined) =>
  {
    const inside = Array.from({ length: spec.h }, () => new Array(spec.w).fill(false));
    blob(inside, spec.w, spec.h, true, cx, cy, rx, ry, seed, wobble);
    const squares = [];
    inside.forEach((row, y) => row.forEach((isInside, x) =>
    {
      if (isInside)
      {
        squares.push([ x, y ]);
      }
    }));

    return squares;
  };

  /**
   * Opens an organic chamber around a centre, for a cave rather than a castle.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   * @param {number} floor The floor's autotile kind; the map's own floor unless a hollow names another.
   */
  const hollow = (cx, cy, rx, ry, seed, floor = palette.floor) =>
  {
    blobSquares(cx, cy, rx, ry, seed).forEach(([ x, y ]) =>
    {
      fill(x, y, x, y, CELL.floor, floor, palette.face);
    });
  };

  /**
   * Repaves the floor inside an organic patch with another kind, such as hazard floor, without opening any
   * new floor: stone inside the patch stays stone.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   * @param {number} floor The new floor's autotile kind.
   */
  const pave = (cx, cy, rx, ry, seed, floor) =>
  {
    blobSquares(cx, cy, rx, ry, seed)
      .filter(([ x, y ]) => carved[y][x] === CELL.floor)
      .forEach(([ x, y ]) =>
      {
        floors[y][x] = floor;
      });
  };

  const hops = [];
  const bridges = [];

  /**
   * Strings a hop across a two-square gap, the way `Map158` builds one: a jump event on this edge square,
   * and its partner three squares on, each throwing the player four squares the other way.
   * @param {number} x The near edge square's column.
   * @param {number} y The near edge square's row.
   * @param {number} dx The way across, -1, 0 or 1.
   * @param {number} dy The way across, -1, 0 or 1.
   */
  const hop = (x, y, dx, dy) =>
  {
    hops.push({ x, y, dx, dy });
  };

  /**
   * Marks a crossing that a story event makes, such as the bridge Jerald's chunk of floor forms in the goop:
   * nothing is drawn, but the proof that the map holds together counts the two ends as joined.
   * @param {number} x1 One end's column.
   * @param {number} y1 One end's row.
   * @param {number} x2 The other end's column.
   * @param {number} y2 The other end's row.
   */
  const bridge = (x1, y1, x2, y2) =>
  {
    bridges.push([ [ x1, y1 ], [ x2, y2 ] ]);
  };

  /**
   * Opens a great round chamber around a centre, its edge barely wobbling, for a room that should read as one
   * vault rather than as a cave.
   * @param {number} cx The centre column.
   * @param {number} cy The centre row.
   * @param {number} rx The horizontal radius.
   * @param {number} ry The vertical radius.
   * @param {number} seed The wobble's seed.
   */
  const dome = (cx, cy, rx, ry, seed) =>
  {
    blobSquares(cx, cy, rx, ry, seed, DOME_WOBBLE).forEach(([ x, y ]) =>
    {
      fill(x, y, x, y, CELL.floor, palette.floor, palette.face);
    });
  };

  spec.carve(dig, wall, pit, hollow, pave, hop, bridge, dome);

  // a cave's blobs leave noise along their edges, sanded off without touching a door or a hop.
  if (spec.cave)
  {
    const hopSquares = hops.flatMap(({ x, y, dx, dy }) => [ [ x, y ], [ x + 3 * dx, y + 3 * dy ] ]);
    const keep = [ ...doorSquaresOf(spec.id), ...hopSquares ];
    tidyCarving(carved, spec.w, spec.h, keep, `Map${spec.id}`);
  }

  return { carved, floors, faces, hops, bridges };
};

/**
 * Proves a carved map's floor is one connected whole that every one of its doors stands on, before anything
 * is written: a balcony whose stairs missed it, or a floor its stair cannot reach, would be ground nobody can
 * stand on. Goop is not ground, so it is left out; a hop joins the two squares it throws the player between,
 * and must actually be worth taking, with goop or hazard floor in its gap and safe ground at both ends; and a
 * bridge a story event makes counts as already made. A failure here is a recipe mistake, so it stops the run
 * rather than being patched over.
 * @param {Object} spec The map's spec.
 * @param {number[][]} carved What every square holds, as a `CELL`.
 * @param {number[][]} floors The floor kind of every square carved.
 * @param {{x: number, y: number, dx: number, dy: number}[]} hops The map's hops.
 * @param {number[][][]} bridges The map's story-made crossings, each a pair of squares.
 */
const proveConnected = (spec, carved, floors, hops, bridges) =>
{
  const inside = (x, y) => x >= 0 && y >= 0 && x < spec.w && y < spec.h;
  const isGround = (x, y) =>
  {
    return inside(x, y) && carved[y][x] === CELL.floor && IMPASSABLE_FLOORS.has(floors[y][x]) === false;
  };
  const isSafe = (x, y) => isGround(x, y) && floors[y][x] !== HAZARD;
  const doors = doorSquaresOf(spec.id);
  doors.forEach(([ x, y ]) =>
  {
    if (isGround(x, y) === false)
    {
      throw new Error(`Map${spec.id}: door square ${x},${y} is not ground`);
    }
  });

  // every hop throws the player from its edge square to one square past its partner, both ways.
  const jumpsFrom = new Map();
  hops.forEach(({ x, y, dx, dy }) =>
  {
    const ends = [ [ x, y ], [ x + 3 * dx, y + 3 * dy ], [ x + 4 * dx, y + 4 * dy ], [ x - dx, y - dy ] ];
    const gap = [ [ x + dx, y + dy ], [ x + 2 * dx, y + 2 * dy ] ];
    if (ends.some(([ ex, ey ]) => isSafe(ex, ey) === false) || gap.some(([ gx, gy ]) => isSafe(gx, gy)))
    {
      throw new Error(`Map${spec.id}: the hop from ${x},${y} does not span a two-square gap between safe ground`);
    }

    jumpsFrom.set(`${x},${y}`, [ x + 4 * dx, y + 4 * dy ]);
    jumpsFrom.set(`${x + 3 * dx},${y + 3 * dy}`, [ x - dx, y - dy ]);
  });

  // a bridge joins its two ends both ways.
  const crossingsFrom = new Map();
  bridges.forEach(([ from, to ]) =>
  {
    crossingsFrom.set(from.join(','), to);
    crossingsFrom.set(to.join(','), from);
  });

  // flood from the first door, or from the first ground square on a map with none, and count what it covers.
  const ground = [];
  carved.forEach((row, y) => row.forEach((_, x) =>
  {
    if (isGround(x, y))
    {
      ground.push([ x, y ]);
    }
  }));
  const [ startX, startY ] = doors.length > 0 ? doors[0] : ground[0];
  const seen = new Set([ `${startX},${startY}` ]);
  const stack = [ [ startX, startY ] ];
  while (stack.length > 0)
  {
    const [ x, y ] = stack.pop();
    const nexts = [ [ x, y + 1 ], [ x, y - 1 ], [ x + 1, y ], [ x - 1, y ] ];
    [ jumpsFrom.get(`${x},${y}`), crossingsFrom.get(`${x},${y}`) ].forEach(far =>
    {
      if (far !== undefined)
      {
        nexts.push(far);
      }
    });

    nexts.forEach(([ nx, ny ]) =>
    {
      const key = `${nx},${ny}`;
      if (seen.has(key) || isGround(nx, ny) === false)
      {
        return;
      }

      seen.add(key);
      stack.push([ nx, ny ]);
    });
  }

  if (seen.size !== ground.length)
  {
    throw new Error(`Map${spec.id}: ${ground.length - seen.size} ground squares cannot be reached`);
  }
};

/**
 * One side of a hop, built exactly as `Map158` "Rapid Hops" builds its own: a player-touch event under the
 * player, labelled "Jump" as the player comes near, that turns the player the way across, plays the jump
 * sound and throws them four squares.
 * @param {number} id The event id.
 * @param {number} x The edge square's column.
 * @param {number} y The edge square's row.
 * @param {number} dx The way across, -1, 0 or 1.
 * @param {number} dy The way across, -1, 0 or 1.
 * @returns {Object}
 */
const jumpEvent = (id, x, y, dx, dy) =>
{
  const way = HOP_WAY[`${dx},${dy}`];
  const sound = { name: 'Jump2', volume: 70, pitch: 100, pan: 0 };
  const turn = { code: way.turn, indent: null };
  const play = { code: 44, parameters: [ sound ], indent: null };
  const jump = { code: 14, parameters: [ 4 * dx, 4 * dy ], indent: null };
  const route = { list: [ turn, play, jump, { code: 0 } ], repeat: false, skippable: false, wait: true };
  return {
    id,
    name: way.name,
    note: '',
    pages: [ {
      conditions: {
        actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false,
        switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false,
        variableId: 1, variableValid: false, variableValue: 0,
      },
      directionFix: false,
      image: { characterIndex: 0, characterName: '', direction: 2, pattern: 0, tileId: 0 },
      list: [
        { code: 108, indent: 0, parameters: [ '<text:Jump>' ] },
        { code: 408, indent: 0, parameters: [ '<icon:82>' ] },
        { code: 408, indent: 0, parameters: [ '<proximityText:4>' ] },
        { code: 408, indent: 0, parameters: [ '<proximityIcon:4>' ] },
        { code: 205, indent: 0, parameters: [ -1, route ] },
        { code: 505, indent: 0, parameters: [ turn ] },
        { code: 505, indent: 0, parameters: [ play ] },
        { code: 505, indent: 0, parameters: [ jump ] },
        { code: 0, indent: 0, parameters: [] },
      ],
      moveFrequency: 3,
      moveRoute: { list: [ { code: 0, parameters: [] } ], repeat: true, skippable: false, wait: false },
      moveSpeed: 3,
      moveType: 0,
      priorityType: 0,
      stepAnime: false,
      through: false,
      trigger: 1,
      walkAnime: false,
    } ],
    x,
    y,
  };
};

/**
 * Lays a runner of one A2 decoration over a rectangle of floor, shaped like any autotile: its border follows
 * the rectangle's edges, and an end that runs off the map stays open, since beyond the map counts as joined.
 * @param {number[]} data The six-layer tile array to draw into.
 * @param {Object} spec The map's spec.
 * @param {number} kind The decoration's autotile kind.
 * @param {number[]} rectangle The runner's corners, inclusive: left, top, right, bottom.
 */
const layRunner = (data, spec, kind, rectangle) =>
{
  const [ x1, y1, x2, y2 ] = rectangle;

  /**
   * The decoration kind at a square: the runner's kind inside the rectangle, nothing outside it.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number|undefined}
   */
  const kindAt = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= spec.w || y >= spec.h)
    {
      return undefined;
    }

    return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? kind : -1;
  };

  for (let y = y1; y <= y2; y++)
  {
    for (let x = x1; x <= x2; x++)
    {
      data[(DECORATION_LAYER * spec.h + y) * spec.w + x] = a2TileId(kindAt, x, y);
    }
  }
};

/**
 * Draws the fall's tunnel: the shaft's stone wall, seen face on, down the middle of the map, and ceiling
 * either side of it. The wall takes the face's fully joined shape everywhere, since its sides meet ceiling
 * and the loop joins its top to its bottom, so it repeats without a seam; the ceiling takes its edge where
 * it meets the wall, and treats beyond the map as joined, so it loops cleanly too.
 * @param {{w: number, h: number, shaft: number[]}} fall The fall's spec.
 * @returns {number[]}
 */
const drawTunnel = fall =>
{
  const [ left, right ] = fall.shaft;
  const data = new Array(fall.w * fall.h * 6).fill(0);
  const inShaft = x => x >= left && x <= right;

  /**
   * The ground kind at a square: the wall's face in the shaft, the ceiling either side of it.
   * @param {number} x The column.
   * @param {number} y The row.
   * @returns {number|undefined}
   */
  const kindAt = (x, y) =>
  {
    if (x < 0 || y < 0 || x >= fall.w || y >= fall.h)
    {
      return undefined;
    }

    return inShaft(x) ? CASTLE.face : CASTLE.ceiling;
  };

  for (let y = 0; y < fall.h; y++)
  {
    for (let x = 0; x < fall.w; x++)
    {
      // shape 0 is a face with every edge joined.
      data[y * fall.w + x] = inShaft(x) ? 2048 + CASTLE.face * 48 : a2TileId(kindAt, x, y);
    }
  }

  return data;
};

/**
 * The header every map of the castle shares. Like Lucian's castle, the rooms take `<noToneChange>`, so the
 * game clock never tints indoors, unless a map brings its own note, as the dark basement does; and they wear
 * tileset 21 unless a map names its own. Music is not chosen yet, so nothing autoplays.
 * @param {{w: number, h: number, display: string, tileset: (number|undefined), note: (string|undefined)}} spec
 * The map's spec.
 * @param {number} scrollType How the map scrolls, from {@link LOOP}.
 * @param {number[]} data The six-layer tile array.
 * @param {Object[]} events The map's events, slot 0 left empty when there are any.
 * @returns {Object}
 */
const castleMap = (spec, scrollType, data, events) =>
{
  return {
    autoplayBgm: false,
    autoplayBgs: false,
    battleback1Name: '',
    battleback2Name: '',
    bgm: { name: '', pan: 0, pitch: 100, volume: 90 },
    bgs: { name: '', pan: 0, pitch: 100, volume: 90 },
    disableDashing: false,
    displayName: spec.display,
    encounterList: [],
    encounterStep: 30,
    height: spec.h,
    note: spec.note ?? '<noToneChange>',
    parallaxLoopX: false,
    parallaxLoopY: false,
    parallaxName: '',
    parallaxShow: true,
    parallaxSx: 0,
    parallaxSy: 0,
    scrollType,
    specifyBattleback: false,
    tilesetId: spec.tileset ?? TILESET,
    width: spec.w,
    data,
    events,
  };
};

/**
 * Builds one carved map's file contents: the rendered castle or cave, its carpet, its doors, and both sides
 * of every hop.
 * @param {Object} spec The map's spec.
 * @param {{carved: number[][], floors: number[][], faces: number[][], hops: Object[]}} carving The carved map:
 * what every square holds, its floor and face kinds, and its hops.
 * @returns {Object}
 */
const buildMap = (spec, carving) =>
{
  const { carved, floors, faces, hops } = carving;
  const palette = { ...(spec.palette ?? CASTLE), floorAt: (x, y) => floors[y][x], faceAt: (x, y) => faces[y][x] };
  const data = renderCave(carved, spec.w, spec.h, palette);
  if (spec.carpet)
  {
    layRunner(data, spec, CARPET, spec.carpet);
  }

  // the doors come first, then both sides of every hop, numbered on from them.
  const doors = exitsFor(spec.id).map((exit, index) => doorEvent(index + 1, exit));
  const sides = hops.flatMap(({ x, y, dx, dy }) => [ [ x, y, dx, dy ], [ x + 3 * dx, y + 3 * dy, -dx, -dy ] ]);
  const jumps = sides.map(([ x, y, dx, dy ], index) => jumpEvent(doors.length + index + 1, x, y, dx, dy));

  // a map with events keeps MZ's empty slot 0 ahead of them; a map with none has no events at all.
  const listed = [ ...doors, ...jumps ];
  const events = listed.length > 0 ? [ null, ...listed ] : [];
  return castleMap(spec, LOOP.none, data, events);
};

/**
 * Builds a folder: a 0x0 map that holds nothing, laid out exactly as MZ saves the field's other "DUNGEON:"
 * nodes (Map213, Map291) and the Fallen Kingdom's "AREA:" ones (Map263), so the editors treat it like any
 * folder they made themselves.
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

// prove every link and every map before writing any of them, so a bad recipe never leaves a half-written
// staging run.
proveLinksKeepHeading();
const carvedMaps = SPECS.map(spec =>
{
  const carving = carveMap(spec);
  proveConnected(spec, carving.carved, carving.floors, carving.hops, carving.bridges);
  return { spec, carving };
});

await Bun.$`mkdir -p ${OUT}`.quiet();

// the folders go first, so the tree has its branches before any map is hung on them.
const folders = FOLDERS.map(folder => ({ spec: { ...folder, w: 0, h: 0 }, map: buildFolder() }));
const maps = carvedMaps.map(({ spec, carving }) => ({ spec, map: buildMap(spec, carving) }));
const fall = { spec: FALL, map: castleMap(FALL, LOOP.vertical, drawTunnel(FALL), []) };
const built = [ ...folders, ...maps, fall ];
for (const { spec, map } of built)
{
  await Bun.write(`${OUT}/Map${spec.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads, so it carries everything MapInfos needs and nothing else. A map
// hangs under its own `parent` when it has one, and under the dungeon's folder otherwise.
const manifest = built.map(({ spec, map }) => ({
  id: spec.id,
  tree: spec.tree,
  parentId: spec.parent ?? DUNGEON.id,
  order: spec.order ?? spec.id,
  w: spec.w,
  h: spec.h,
  events: map.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${folders.length} folder(s) and ${maps.length + 1} map(s) to staging`);
built.forEach(({ spec, map }) =>
{
  console.log(`  Map${spec.id} ${spec.tree.padEnd(26)} ${spec.w}x${spec.h}  events=${map.events.filter(Boolean).length}`);
});
//endregion fortress