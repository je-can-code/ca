//region enemy-oases
/**
 * The Enemy Oases: a test hall for every subgroup, so any tier of any enemy can be fought by dropping into
 * its map. They hang under the Test Oasis beside the AI Oasis, wear the regular oasis styling (tileset 4's
 * teal brick and pale stone over the Space parallax, as on Map359), and a real lobby holds one door per
 * subgroup, the subgroup's T1 standing in for the door.
 *
 * A hall is a long north-south corridor with six pairs of rooms along it, one pair per rung of the subgroup,
 * T1 nearest the entrance and the named at the far end. The left room of a pair is the rung alone, "1v1 me
 * noob". The right room is that rung among others, "1v3-6 in varying tiers", and for the named, how it
 * actually stands amidst others (Jeremy). A hall is 100 rows tall because J-ABS sight is a plain radius
 * that walls do not stop, and vertical space is what keeps a room's neighbours out of a fight.
 *
 * Every hall is the same template, and every enemy is copied from the `_FullEnemyMap` palette, so a sprite,
 * a motion or a move speed only ever lives in one place. No enemy here carries a pool or a level: each one
 * is exactly its row, and comes back a few seconds after it dies.
 *
 * The setup autorun, the Level Manager and the respawn stake are copied from the oases that already have
 * them, so there is one version of each.
 *
 * Usage: bun tools/mapgen/dungeons/enemy-oases.js
 *        bun tools/mapgen/validate.js --staged 494 495
 *        bun tools/mapgen/snapshot.js 495 --staged --out hall.png
 *        bun tools/mapgen/install.js
 */
import { DATA } from '../paths.js';
import { serialise, transferEvent, OUT } from '../terrain.js';
import { CELL, renderCave } from '../cave.js';
import {
  OASIS, copyEvent, comment, fill, newBlock, paveFloors, lightPortal, oasisMap, labelEvent, exitEvent,
} from '../oasis.js';

/**
 * The map tree node the lobby hangs under: Map1, the Test Oasis, beside the AI Oasis and the others.
 * @type {number}
 */
const TEST_OASIS = 1;

/**
 * The lobby's map id and tree name. `TESTING:` rather than `REGION:` because `tools/burndown.js` counts
 * everything under a `REGION:` map as the real world.
 * @type {{id: number, tree: string}}
 */
const LOBBY = { id: 494, tree: 'TESTING: Enemy Oasises' };

/**
 * The first hall's map id; the rest follow on in subgroup order.
 * @type {number}
 */
const FIRST_HALL = 495;

/**
 * The enemy families in id order, fifty rows each from row 101.
 * @type {string[]}
 */
const FAMILIES = [
  'Undead', 'Reptile', 'Aquatic', 'Slime', 'Plant', 'Beast', 'Insect', 'Humanoid', 'Construct', 'Deity',
];

/**
 * The T1 row of every subgroup with a hall: every decade from 101 to 541, then Emotion and Devil. The
 * elemental bosses at 551 and the sins and votaries from 581 are not a ladder of tiers.
 * @type {number[]}
 */
const LINES = [ ...Array.from({ length: 45 }, (_, index) => 101 + index * 10), 561, 571 ];

/**
 * A hall's map size and its fixed columns. The rooms are fifteen wide and twelve tall, room enough for the
 * widest T5 (Immortal Monolith, 5.2 tiles) to fight, and a hall stacks six of them.
 * @type {Object<string, number>}
 */
const HALL = {
  width: 50,
  height: 100,
  blockLeft: 4,
  blockRight: 45,
  blockBottom: 98,
  leftRoom: 5,
  rightRoom: 30,
  roomWidth: 15,
  roomHeight: 12,
  pitch: 15,
  firstFloor: 4,
  corridorLeft: 22,
  corridorRight: 27,
  soloX: 12,
  packX: 37,
  foyerTop: 93,
  foyerBottom: 95,
  foyerLeft: 14,
  foyerRight: 35,
  arrivalX: 24,
  arrivalY: 94,
  exitX: 24,
  exitY: 96,
};

/**
 * The lobby's map size and fixed lines. Each family takes a row of up to five doors.
 * @type {Object<string, number>}
 */
const HUB = {
  width: 50,
  height: 60,
  blockLeft: 4,
  blockRight: 45,
  blockBottom: 58,
  floorLeft: 5,
  floorRight: 44,
  floorTop: 4,
  floorBottom: 55,
  firstRow: 6,
  rowPitch: 5,
  firstColumn: 14,
  columnPitch: 6,
  signX: 8,
  arrivalX: 24,
  arrivalY: 54,
  exitX: 24,
  exitY: 56,
};

/**
 * Where the pack room's enemies stand, as offsets from the room's middle, in the order its roster lists them.
 * @type {number[][]}
 */
const PACK_OFFSETS = [ [ 0, 0 ], [ -5, -3 ], [ 5, -3 ], [ -5, 3 ], [ 5, 3 ], [ 0, 4 ] ];

/**
 * The tag every room's enemy carries, so a fight can be run again without leaving the room.
 * @type {string}
 */
const RESPAWN = '<respawn:[seconds, 5]>';

/**
 * Reads a database file.
 * @param {string} name The file's name in `data/`.
 * @returns {Promise<Object>}
 */
const readData = async name => JSON.parse(await Bun.file(`${DATA}/${name}`).text());

const enemies = await readData('Enemies.json');
const palette = await readData('Map361.json');
const respawnOasis = await readData('Map359.json');
const levelOasis = await readData('Map305.json');

/**
 * The row a rung's room begins on. Rung 0 is the T1, at the south end by the entrance, and rung 5 is the
 * named, at the far north end, so walking up the hall climbs the ladder.
 * @param {number} rung The rung, 0 through 5.
 * @returns {number}
 */
const floorTopOf = rung => HALL.firstFloor + HALL.pitch * (5 - rung);

/**
 * Carves a hall: six pairs of rooms, the corridor between them, a doorway from each room onto the corridor,
 * and the foyer and its exit at the south end.
 * @returns {number[][]}
 */
const carveHall = () =>
{
  const carved = newBlock(HALL);

  for (let rung = 0; rung < 6; rung++)
  {
    const top = floorTopOf(rung);
    const bottom = top + HALL.roomHeight - 1;
    const doorTop = top + 4;
    const doorBottom = top + 7;

    // the two rooms of the pair.
    fill(carved, [ HALL.leftRoom, top ], [ HALL.leftRoom + HALL.roomWidth - 1, bottom ], CELL.floor);
    fill(carved, [ HALL.rightRoom, top ], [ HALL.rightRoom + HALL.roomWidth - 1, bottom ], CELL.floor);

    // their doorways, through the walls either side of the corridor.
    fill(carved, [ HALL.leftRoom + HALL.roomWidth, doorTop ], [ HALL.corridorLeft - 1, doorBottom ], CELL.floor);
    fill(carved, [ HALL.corridorRight + 1, doorTop ], [ HALL.rightRoom - 1, doorBottom ], CELL.floor);
  }

  fill(carved, [ HALL.corridorLeft, HALL.firstFloor ], [ HALL.corridorRight, HALL.foyerBottom ], CELL.floor);
  fill(carved, [ HALL.foyerLeft, HALL.foyerTop ], [ HALL.foyerRight, HALL.foyerBottom ], CELL.floor);
  fill(carved, [ HALL.exitX, HALL.exitY ], [ HALL.exitX + 1, HALL.exitY ], CELL.floor);

  return carved;
};

/**
 * Carves the lobby: one big room and its exit.
 * @returns {number[][]}
 */
const carveLobby = () =>
{
  const carved = newBlock(HUB);
  fill(carved, [ HUB.floorLeft, HUB.floorTop ], [ HUB.floorRight, HUB.floorBottom ], CELL.floor);
  fill(carved, [ HUB.exitX, HUB.exitY ], [ HUB.exitX + 1, HUB.exitY ], CELL.floor);
  return carved;
};

/**
 * One enemy standing in a room: its palette event, whole, with the respawn tag added.
 * @param {number} id The event id.
 * @param {number} enemyId The enemy's row, which is also its event id on the palette.
 * @param {number} x The column.
 * @param {number} y The row.
 * @returns {Object}
 */
const enemyEvent = (id, enemyId, x, y) =>
{
  const event = copyEvent(palette.events[enemyId], id, x, y);
  event.pages.forEach(page => page.list.unshift(comment(RESPAWN)));
  return event;
};

/**
 * Who stands in a rung's right-hand room: that rung among others, three to six of them, always with some of
 * the tiers beneath it. The named's room is how it really stands, amidst its subgroup's low tiers.
 * @param {number} first The subgroup's T1 row.
 * @param {number} rung The rung, 0 through 5.
 * @returns {number[]} Enemy rows, the rung itself first.
 */
const packFor = (first, rung) =>
{
  const [ t1, t2, t3, t4, t5, named ] = [ first, first + 1, first + 2, first + 3, first + 4, first + 9 ];
  const rosters = [
    [ t1, t1, t1 ],
    [ t2, t1, t1, t1 ],
    [ t3, t2, t2, t1, t1 ],
    [ t4, t3, t3, t2, t2 ],
    [ t5, t4, t3, t2, t1 ],
    [ named, t2, t2, t1, t1, t1 ],
  ];
  return rosters[rung];
};

/**
 * A rung's row, the T1 through T5 and then the named.
 * @param {number} first The subgroup's T1 row.
 * @param {number} rung The rung, 0 through 5.
 * @returns {number}
 */
const rowOf = (first, rung) => first + (rung === 5 ? 9 : rung);

/**
 * Where a subgroup's door stands in the lobby: its family's row, its place in the decade's column.
 * @param {number} first The subgroup's T1 row.
 * @returns {number[]} The door's [x, y].
 */
const doorOf = first =>
{
  const family = Math.floor((first - 101) / 50);
  const place = Math.floor((first - 101) / 10) % 5;
  return [ HUB.firstColumn + place * HUB.columnPitch, HUB.firstRow + family * HUB.rowPitch ];
};

/**
 * Builds one subgroup's hall.
 * @param {number} first The subgroup's T1 row.
 * @param {number} mapId The hall's map id.
 * @returns {Object}
 */
const buildHall = (first, mapId) =>
{
  const name = enemies[first].name;
  const carved = carveHall();
  const data = renderCave(carved, HALL.width, HALL.height, OASIS);
  paveFloors(data, carved, HALL.width);
  lightPortal(data, HALL.exitX, HALL.exitY, HALL.width, HALL.height);

  // the kit first, so its event ids read the same on every hall.
  const [ doorX, doorY ] = doorOf(first);
  const events = [
    null,
    copyEvent(respawnOasis.events[9], 1, HALL.foyerLeft, HALL.foyerTop),
    exitEvent(2, HALL.exitX, HALL.exitY, { map: LOBBY.id, x: doorX, y: doorY + 1, dir: 2 }),
    copyEvent(levelOasis.events[1], 3, HALL.foyerLeft + 3, HALL.foyerTop + 1),
    copyEvent(respawnOasis.events[13], 4, HALL.foyerRight - 3, HALL.foyerTop + 1),
  ];

  // then a pair of rooms per rung, each with a label at its doorway.
  for (let rung = 0; rung < 6; rung++)
  {
    const middle = floorTopOf(rung) + 5;
    const row = enemies[rowOf(first, rung)];
    const tier = rung === 5 ? 'Named' : `T${rung + 1}`;
    events.push(labelEvent(events.length, HALL.corridorLeft, middle, `${tier} ${row.name}`));
    events.push(labelEvent(events.length, HALL.corridorRight, middle, `${tier} pack`));
    events.push(enemyEvent(events.length, row.id, HALL.soloX, middle));

    packFor(first, rung).forEach((enemyId, index) =>
    {
      const [ dx, dy ] = PACK_OFFSETS[index];
      events.push(enemyEvent(events.length, enemyId, HALL.packX + dx, middle + dy));
    });
  }

  return { id: mapId, ...oasisMap({ tree: `${name} Oasis`, display: `Enemy Oasis: ${name}` }, HALL, data, events) };
};

/**
 * A lobby door: the subgroup's T1 standing still, labelled, and bumping it walks you into its hall.
 * @param {number} id The event id.
 * @param {number} first The subgroup's T1 row.
 * @param {number} mapId The hall's map id.
 * @returns {Object}
 */
const doorEvent = (id, first, mapId) =>
{
  const [ x, y ] = doorOf(first);
  const name = enemies[first].name;
  const event = transferEvent(id, `door: ${name}`, x, y, { map: mapId, x: HALL.arrivalX, y: HALL.arrivalY, dir: 8 });
  const [ page ] = event.pages;
  page.image = structuredClone(palette.events[first].pages[0].image);
  page.list.unshift(comment(`<text:${name}>`));
  page.priorityType = 1;
  page.directionFix = true;
  page.walkAnime = false;
  return event;
};

/**
 * Builds the lobby: a door per subgroup, a label per family, and the way back to the Test Oasis.
 * @returns {Object}
 */
const buildLobby = () =>
{
  const carved = carveLobby();
  const data = renderCave(carved, HUB.width, HUB.height, OASIS);
  paveFloors(data, carved, HUB.width);
  lightPortal(data, HUB.exitX, HUB.exitY, HUB.width, HUB.height);

  const events = [
    null,
    copyEvent(respawnOasis.events[9], 1, HUB.floorLeft, HUB.floorBottom),
    exitEvent(2, HUB.exitX, HUB.exitY, { map: TEST_OASIS, x: 26, y: 26, dir: 2 }),
  ];

  FAMILIES.forEach((family, index) =>
  {
    events.push(labelEvent(events.length, HUB.signX, HUB.firstRow + index * HUB.rowPitch, family));
  });

  LINES.forEach((first, index) =>
  {
    events.push(doorEvent(events.length, first, FIRST_HALL + index));
  });

  return { id: LOBBY.id, ...oasisMap({ tree: LOBBY.tree, display: 'Enemy Oasises' }, HUB, data, events) };
};

const built = [ buildLobby(), ...LINES.map((first, index) => buildHall(first, FIRST_HALL + index)) ];

await Bun.$`mkdir -p ${OUT}`.quiet();
for (const map of built)
{
  await Bun.write(`${OUT}/Map${map.id}.json`, serialise(map));
}

// the manifest is what `install.js` reads: the lobby under the Test Oasis, and every hall under the lobby.
const manifest = built.map(map => ({
  id: map.id,
  tree: map.tree,
  parentId: map.id === LOBBY.id ? TEST_OASIS : LOBBY.id,
  order: map.id,
  w: map.width,
  h: map.height,
  events: map.events.filter(Boolean).length,
}));
await Bun.write(`${OUT}/_built.json`, JSON.stringify(manifest));

console.log(`wrote ${built.length} maps to staging`);
built.slice(0, 4).forEach(map =>
{
  console.log(`  Map${map.id} ${map.tree.padEnd(24)} ${map.width}x${map.height}  events=${map.events.length - 1}`);
});
//endregion enemy-oases
